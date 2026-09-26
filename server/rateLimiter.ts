import { Request, Response, NextFunction } from 'express';
import { CONFIG } from './config';
import { abuseProtectionService } from './abuseProtection';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil?: number;
}

class MemoryRateLimiter {
  private ipAttempts = new Map<string, AttemptRecord>();
  private accountAttempts = new Map<string, AttemptRecord>();

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
  }

  /**
   * Check if IP or account is currently locked out.
   */
  public isLocked(req: Request, email?: string): { locked: boolean; retryAfterSeconds: number } {
    const now = Date.now();
    const ip = this.getClientIp(req);
    const ipRecord = this.ipAttempts.get(ip);

    if (ipRecord && ipRecord.lockedUntil && ipRecord.lockedUntil > now) {
      return {
        locked: true,
        retryAfterSeconds: Math.ceil((ipRecord.lockedUntil - now) / 1000),
      };
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const accountRecord = this.accountAttempts.get(normalizedEmail);
      if (accountRecord && accountRecord.lockedUntil && accountRecord.lockedUntil > now) {
        return {
          locked: true,
          retryAfterSeconds: Math.ceil((accountRecord.lockedUntil - now) / 1000),
        };
      }
    }

    return { locked: false, retryAfterSeconds: 0 };
  }

  /**
   * Record a failed login attempt. If threshold exceeded, lock out.
   */
  public recordFailure(req: Request, email?: string): { isNowLocked: boolean; remainingAttempts: number; retryAfterSeconds: number } {
    const now = Date.now();
    const ip = this.getClientIp(req);
    const maxAttempts = CONFIG.RATE_LIMIT.LOGIN_MAX_ATTEMPTS;
    const windowMs = CONFIG.RATE_LIMIT.LOGIN_WINDOW_MS;

    // Record for IP
    let ipRecord = this.ipAttempts.get(ip);
    if (!ipRecord || (now - ipRecord.firstAttempt > windowMs && !ipRecord.lockedUntil)) {
      ipRecord = { count: 1, firstAttempt: now, lastAttempt: now };
    } else {
      ipRecord.count += 1;
      ipRecord.lastAttempt = now;
    }

    let isNowLocked = false;
    let retryAfterSeconds = 0;

    if (ipRecord.count >= maxAttempts) {
      ipRecord.lockedUntil = now + windowMs;
      isNowLocked = true;
      retryAfterSeconds = Math.ceil(windowMs / 1000);
    }
    this.ipAttempts.set(ip, ipRecord);

    // Record for Account/Email
    let remainingAttempts = Math.max(0, maxAttempts - ipRecord.count);
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      let accountRecord = this.accountAttempts.get(normalizedEmail);
      if (!accountRecord || (now - accountRecord.firstAttempt > windowMs && !accountRecord.lockedUntil)) {
        accountRecord = { count: 1, firstAttempt: now, lastAttempt: now };
      } else {
        accountRecord.count += 1;
        accountRecord.lastAttempt = now;
      }

      if (accountRecord.count >= maxAttempts) {
        accountRecord.lockedUntil = now + windowMs;
        isNowLocked = true;
        retryAfterSeconds = Math.ceil(windowMs / 1000);
      }
      this.accountAttempts.set(normalizedEmail, accountRecord);
      remainingAttempts = Math.min(remainingAttempts, Math.max(0, maxAttempts - accountRecord.count));
    }

    return { isNowLocked, remainingAttempts, retryAfterSeconds };
  }

  /**
   * Reset attempts upon successful login.
   */
  public recordSuccess(req: Request, email?: string): void {
    const ip = this.getClientIp(req);
    this.ipAttempts.delete(ip);
    if (email) {
      this.accountAttempts.delete(email.trim().toLowerCase());
    }
  }

  /**
   * Reset lockout for a specific IP or all records (useful for dev testing / admin unblock)
   */
  public resetIp(ip: string): void {
    this.ipAttempts.delete(ip);
  }

  public resetAll(): void {
    this.ipAttempts.clear();
    this.accountAttempts.clear();
  }

  /**
   * Clean up expired entries every 30 minutes to prevent memory leak.
   */
  public prune(): void {
    const now = Date.now();
    for (const [ip, rec] of this.ipAttempts.entries()) {
      if (rec.lockedUntil ? rec.lockedUntil < now : now - rec.lastAttempt > CONFIG.RATE_LIMIT.LOGIN_WINDOW_MS) {
        this.ipAttempts.delete(ip);
      }
    }
    for (const [email, rec] of this.accountAttempts.entries()) {
      if (rec.lockedUntil ? rec.lockedUntil < now : now - rec.lastAttempt > CONFIG.RATE_LIMIT.LOGIN_WINDOW_MS) {
        this.accountAttempts.delete(email);
      }
    }
  }
}

export const rateLimiter = new MemoryRateLimiter();
setInterval(() => rateLimiter.prune(), 30 * 60 * 1000);

/**
 * Express middleware to enforce login rate limiting before processing credentials.
 */
export function loginRateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const email = req.body?.email;
  const status = rateLimiter.isLocked(req, email);

  res.setHeader('X-RateLimit-Limit', CONFIG.RATE_LIMIT.LOGIN_MAX_ATTEMPTS);

  if (status.locked) {
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('Retry-After', status.retryAfterSeconds);

    const ip = abuseProtectionService.getClientIp(req);
    abuseProtectionService.recordIncident(
      ip,
      'rate_limit_exceeded',
      req.originalUrl,
      `Login lockout triggered for account ${email || 'anonymous'}`
    );

    res.status(429).json({
      error: 'Too many failed login attempts.',
      code: 'LOGIN_RATE_LIMIT_EXCEEDED',
      message: `Account is temporarily locked for security. Please try again in ${Math.ceil(status.retryAfterSeconds / 60)} minute(s).`,
      retryAfterSeconds: status.retryAfterSeconds,
    });
    return;
  }

  next();
}
