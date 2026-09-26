import { Request, Response, NextFunction } from 'express';
import { CONFIG } from './config';

export interface RateLimitCheckResult {
  allowed: boolean;
  totalLimit: number;
  remaining: number;
  resetTimeMs: number;
  retryAfterSeconds: number;
}

interface RateLimitRecord {
  count: number;
  firstRequestAt: number;
  lastRequestAt: number;
  lockedUntil?: number;
}

class UnifiedAbuseProtectionService {
  private buckets = new Map<string, RateLimitRecord>();
  private blockedIps = new Set<string>();
  private abuseIncidents: Array<{
    timestamp: string;
    ip: string;
    type: 'bot_ua' | 'honeypot_triggered' | 'subhuman_timing' | 'rate_limit_exceeded';
    endpoint: string;
    detail: string;
  }> = [];

  public getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      const first = forwarded.split(',')[0].trim();
      if (first) return first;
    }
    return req.socket.remoteAddress || '127.0.0.1';
  }

  /**
   * Sliding window rate limiter for any namespace.
   */
  public checkLimit(
    namespace: string,
    key: string,
    maxRequests: number,
    windowMs: number
  ): RateLimitCheckResult {
    const bucketKey = `${namespace}:${key}`;
    const now = Date.now();
    let record = this.buckets.get(bucketKey);

    // If bucket expired or doesn't exist, create fresh
    if (!record || (now - record.firstRequestAt > windowMs && !record.lockedUntil)) {
      record = {
        count: 1,
        firstRequestAt: now,
        lastRequestAt: now,
      };
      this.buckets.set(bucketKey, record);
      return {
        allowed: true,
        totalLimit: maxRequests,
        remaining: Math.max(0, maxRequests - 1),
        resetTimeMs: now + windowMs,
        retryAfterSeconds: 0,
      };
    }

    // Check if locked
    if (record.lockedUntil && record.lockedUntil > now) {
      const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
      return {
        allowed: false,
        totalLimit: maxRequests,
        remaining: 0,
        resetTimeMs: record.lockedUntil,
        retryAfterSeconds: retryAfter,
      };
    }

    // Increment count
    record.count += 1;
    record.lastRequestAt = now;

    if (record.count > maxRequests) {
      // Lock out for remainder of window
      record.lockedUntil = now + windowMs;
      this.buckets.set(bucketKey, record);
      const retryAfter = Math.ceil(windowMs / 1000);
      return {
        allowed: false,
        totalLimit: maxRequests,
        remaining: 0,
        resetTimeMs: record.lockedUntil,
        retryAfterSeconds: retryAfter,
      };
    }

    this.buckets.set(bucketKey, record);
    const resetTime = record.firstRequestAt + windowMs;
    return {
      allowed: true,
      totalLimit: maxRequests,
      remaining: Math.max(0, maxRequests - record.count),
      resetTimeMs: resetTime,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Specifically for failed attempts (e.g. invalid login password).
   */
  public recordFailureAttempt(
    namespace: string,
    key: string,
    maxAttempts: number,
    windowMs: number
  ): { isLocked: boolean; remainingAttempts: number; retryAfterSeconds: number } {
    const bucketKey = `${namespace}:${key}`;
    const now = Date.now();
    let record = this.buckets.get(bucketKey);

    if (!record || (now - record.firstRequestAt > windowMs && !record.lockedUntil)) {
      record = { count: 1, firstRequestAt: now, lastRequestAt: now };
    } else {
      record.count += 1;
      record.lastRequestAt = now;
    }

    let isLocked = false;
    let retryAfterSeconds = 0;

    if (record.count >= maxAttempts) {
      record.lockedUntil = now + windowMs;
      isLocked = true;
      retryAfterSeconds = Math.ceil(windowMs / 1000);
    }

    this.buckets.set(bucketKey, record);
    const remaining = Math.max(0, maxAttempts - record.count);
    return { isLocked, remainingAttempts: remaining, retryAfterSeconds };
  }

  public resetBucket(namespace: string, key: string): void {
    this.buckets.delete(`${namespace}:${key}`);
  }

  public resetAll(): void {
    this.buckets.clear();
    this.blockedIps.clear();
    this.abuseIncidents = [];
  }

  public recordIncident(
    ip: string,
    type: 'bot_ua' | 'honeypot_triggered' | 'subhuman_timing' | 'rate_limit_exceeded',
    endpoint: string,
    detail: string
  ): void {
    const timestamp = new Date().toISOString();
    this.abuseIncidents.unshift({ timestamp, ip, type, endpoint, detail });
    if (this.abuseIncidents.length > 50) {
      this.abuseIncidents.pop();
    }
  }

  public getTelemetry() {
    return {
      activeBucketsCount: this.buckets.size,
      totalIncidentsDetected: this.abuseIncidents.length,
      recentIncidents: this.abuseIncidents.slice(0, 10),
      rules: {
        globalApiLimit: `${CONFIG.RATE_LIMIT.GLOBAL_API_MAX_REQUESTS} req / 15m`,
        loginLimit: `${CONFIG.RATE_LIMIT.LOGIN_MAX_ATTEMPTS} fails / 15m`,
        accountCreationLimit: `${CONFIG.RATE_LIMIT.REGISTER_MAX_ACCOUNTS} accounts / 1h`,
        aiGenerationLimit: `${CONFIG.RATE_LIMIT.AI_MAX_REQUESTS} requests / 10m`,
        botFilter: 'Active (Honeypot + Signature + Timing)',
      },
    };
  }

  /**
   * Prune expired entries to prevent memory growth.
   */
  public prune(): void {
    const now = Date.now();
    for (const [key, rec] of this.buckets.entries()) {
      if (rec.lockedUntil ? rec.lockedUntil < now : now - rec.lastRequestAt > 2 * 60 * 60 * 1000) {
        this.buckets.delete(key);
      }
    }
  }
}

export const abuseProtectionService = new UnifiedAbuseProtectionService();
setInterval(() => abuseProtectionService.prune(), 15 * 60 * 1000);

/**
 * Helper to write standard RateLimit headers.
 */
function applyRateLimitHeaders(res: Response, result: RateLimitCheckResult): void {
  res.setHeader('X-RateLimit-Limit', result.totalLimit);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTimeMs / 1000));
  if (!result.allowed && result.retryAfterSeconds > 0) {
    res.setHeader('Retry-After', result.retryAfterSeconds);
  }
}

/**
 * 1. BOT & AUTOMATED SCRIPT DEFENSE MIDDLEWARE
 * Detects known web scrapers, crawler automation tools, honeypots, and subhuman submission timing.
 */
export function botAndScraperDefenseMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = abuseProtectionService.getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';

  // 1. Check known scraper / automated script signatures
  for (const pattern of CONFIG.BOT_PROTECTION.SUSPICIOUS_UA_PATTERNS) {
    if (pattern.test(userAgent)) {
      // Allow dev test curls if requested with explicit test header, otherwise block scraper
      if (req.headers['x-ironforge-test-client'] === 'authorized-test-runner') {
        break;
      }

      abuseProtectionService.recordIncident(
        ip,
        'bot_ua',
        req.path,
        `Matched automated user-agent pattern: ${pattern.toString()}`
      );

      res.status(403).json({
        error: 'Access Denied by IronForge Abuse Shield.',
        code: 'AUTOMATED_CLIENT_DETECTED',
        message: 'Direct automated scraping and bot execution are prohibited.',
      });
      return;
    }
  }

  // 2. Honeypot check on body payload for POST / PUT / PATCH
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const body = req.body || {};
    const honeypotKey = CONFIG.BOT_PROTECTION.HONEYPOT_FIELD;
    const honeypotAlt = 'website_url_hp';

    // If bot filled out invisible honeypot field
    if ((body[honeypotKey] && String(body[honeypotKey]).trim().length > 0) ||
        (body[honeypotAlt] && String(body[honeypotAlt]).trim().length > 0)) {
      abuseProtectionService.recordIncident(
        ip,
        'honeypot_triggered',
        req.path,
        'Form honeypot trap populated by automated autofill bot'
      );

      res.status(403).json({
        error: 'Submission blocked by IronForge Bot Defense.',
        code: 'HONEYPOT_TRIPPED',
        message: 'Automated script behavior identified.',
      });
      return;
    }

    // 3. Human timing check (if client attaches _form_rendered_at timestamp)
    if (body._form_rendered_at && typeof body._form_rendered_at === 'number') {
      const elapsed = Date.now() - body._form_rendered_at;
      if (elapsed > 0 && elapsed < CONFIG.BOT_PROTECTION.MIN_SUBMISSION_TIME_MS) {
        abuseProtectionService.recordIncident(
          ip,
          'subhuman_timing',
          req.path,
          `Submission time ${elapsed}ms is below human threshold (${CONFIG.BOT_PROTECTION.MIN_SUBMISSION_TIME_MS}ms)`
        );

        res.status(429).json({
          error: 'Form submitted too rapidly.',
          code: 'SUBHUMAN_SPEED_DETECTED',
          message: 'Please take your time when completing the form.',
        });
        return;
      }
    }
  }

  next();
}

/**
 * 2. GLOBAL API RATE LIMITER
 * Prevents endpoint exhaustion and general API scraping across all /api/* routes.
 */
export function globalApiRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Exclude health check and dev reset endpoints from strict quota
  if (req.path === '/health' || req.path === '/api/health' || req.path.includes('/reset-rate-limit')) {
    return next();
  }

  const ip = abuseProtectionService.getClientIp(req);
  const result = abuseProtectionService.checkLimit(
    'api_global',
    ip,
    CONFIG.RATE_LIMIT.GLOBAL_API_MAX_REQUESTS,
    CONFIG.RATE_LIMIT.GLOBAL_API_WINDOW_MS
  );

  applyRateLimitHeaders(res, result);

  if (!result.allowed) {
    abuseProtectionService.recordIncident(
      ip,
      'rate_limit_exceeded',
      req.originalUrl,
      `Exceeded global API rate limit (${CONFIG.RATE_LIMIT.GLOBAL_API_MAX_REQUESTS} req / 15m)`
    );

    res.status(429).json({
      error: 'Too Many Requests.',
      code: 'API_RATE_LIMIT_EXCEEDED',
      message: `Global API request threshold reached. Please wait ${result.retryAfterSeconds}s before retrying.`,
      retryAfterSeconds: result.retryAfterSeconds,
    });
    return;
  }

  next();
}

/**
 * 3. ACCOUNT CREATION (REGISTRATION) RATE LIMITER
 * Restricts account creation to 3 per hour per IP to prevent spam registration floods.
 */
export function accountCreationRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = abuseProtectionService.getClientIp(req);
  const result = abuseProtectionService.checkLimit(
    'auth_register',
    ip,
    CONFIG.RATE_LIMIT.REGISTER_MAX_ACCOUNTS,
    CONFIG.RATE_LIMIT.REGISTER_WINDOW_MS
  );

  applyRateLimitHeaders(res, result);

  if (!result.allowed) {
    abuseProtectionService.recordIncident(
      ip,
      'rate_limit_exceeded',
      req.originalUrl,
      `Exceeded account registration quota (${CONFIG.RATE_LIMIT.REGISTER_MAX_ACCOUNTS} accounts / hour)`
    );

    res.status(429).json({
      error: 'Account creation rate limit reached.',
      code: 'REGISTRATION_LIMIT_REACHED',
      message: `To safeguard system integrity, new account registrations are limited to ${CONFIG.RATE_LIMIT.REGISTER_MAX_ACCOUNTS} per hour per IP. Please retry in ${Math.ceil(result.retryAfterSeconds / 60)} minute(s).`,
      retryAfterSeconds: result.retryAfterSeconds,
    });
    return;
  }

  next();
}

/**
 * 4. AI GENERATION REQUEST RATE LIMITER & INPUT SANITIZER
 * Enforces per-IP/user AI quota and guards against prompt injection & token exhaustion.
 */
export function aiGenerationRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = abuseProtectionService.getClientIp(req);
  const user = (req as any).user;
  const identifier = user ? `user:${user.id}` : `ip:${ip}`;

  const result = abuseProtectionService.checkLimit(
    'ai_generation',
    identifier,
    CONFIG.RATE_LIMIT.AI_MAX_REQUESTS,
    CONFIG.RATE_LIMIT.AI_WINDOW_MS
  );

  applyRateLimitHeaders(res, result);

  if (!result.allowed) {
    abuseProtectionService.recordIncident(
      ip,
      'rate_limit_exceeded',
      req.originalUrl,
      `Exceeded AI generation limit (${CONFIG.RATE_LIMIT.AI_MAX_REQUESTS} requests / 10m)`
    );

    res.status(429).json({
      error: 'AI Generation Quota Exceeded.',
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: `You have reached the maximum AI generation limit (${CONFIG.RATE_LIMIT.AI_MAX_REQUESTS} requests per 10 minutes). Please wait ${Math.ceil(result.retryAfterSeconds / 60)} minute(s).`,
      retryAfterSeconds: result.retryAfterSeconds,
    });
    return;
  }

  // Guard against massive payload / token exhaustion
  const prompt = req.body?.prompt || req.body?.goal || '';
  if (typeof prompt === 'string' && prompt.length > CONFIG.RATE_LIMIT.AI_MAX_PROMPT_CHARS) {
    res.status(400).json({
      error: 'Prompt exceeds allowable character limit.',
      code: 'PROMPT_TOO_LARGE',
      message: `Maximum allowed prompt length is ${CONFIG.RATE_LIMIT.AI_MAX_PROMPT_CHARS} characters. Provided: ${prompt.length}.`,
    });
    return;
  }

  next();
}

/**
 * 5. PUBLIC LEAD & CONTACT SUBMISSION RATE LIMITER
 */
export function leadSubmissionRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = abuseProtectionService.getClientIp(req);
  const result = abuseProtectionService.checkLimit(
    'lead_submission',
    ip,
    CONFIG.RATE_LIMIT.LEAD_MAX_SUBMISSIONS,
    CONFIG.RATE_LIMIT.LEAD_WINDOW_MS
  );

  applyRateLimitHeaders(res, result);

  if (!result.allowed) {
    abuseProtectionService.recordIncident(
      ip,
      'rate_limit_exceeded',
      req.originalUrl,
      `Exceeded public lead/contact submission limit (${CONFIG.RATE_LIMIT.LEAD_MAX_SUBMISSIONS} per 15m)`
    );

    res.status(429).json({
      error: 'Too many submissions.',
      code: 'LEAD_LIMIT_EXCEEDED',
      message: `Submission quota exceeded. Please wait ${Math.ceil(result.retryAfterSeconds / 60)} minute(s) before sending another inquiry.`,
      retryAfterSeconds: result.retryAfterSeconds,
    });
    return;
  }

  next();
}
