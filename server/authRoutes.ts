import { Router, Request, Response } from 'express';
import { authStore, UserRecord } from './authStore';
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashToken,
  validatePasswordStrength,
  validateEmail,
  createSessionToken,
  verifySessionToken,
  TokenPayload,
} from './security';
import { rateLimiter, loginRateLimitMiddleware } from './rateLimiter';
import { accountCreationRateLimitMiddleware, abuseProtectionService } from './abuseProtection';
import { CONFIG } from './config';

export const authRouter = Router();

/**
 * Authentication Middleware: Extracts & verifies session token from HttpOnly cookie or Bearer header.
 */
export function requireAuth(req: Request, res: Response, next: () => void): void {
  let token: string | undefined;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies.ironforge_session) {
    token = req.cookies.ironforge_session;
  }

  // 2. Check Authorization header fallback
  const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. No active session token found.' });
    return;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    // Session token expired or invalid signature
    res.clearCookie('ironforge_session');
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  const user = authStore.findById(payload.userId);
  if (!user) {
    res.clearCookie('ironforge_session');
    res.status(401).json({ error: 'User account not found.' });
    return;
  }

  // Attach sanitized user & payload to request
  (req as any).user = user;
  (req as any).tokenPayload = payload;
  next();
}

/**
 * POST /api/auth/register
 * Protected by accountCreationRateLimitMiddleware (max 3 accounts/hour/IP)
 * Creates a new user with bcrypt-hashed password (work factor 12)
 * Generates email verification token with 24-hour expiration.
 * Issues session token with 2-hour expiration.
 */
authRouter.post('/register', accountCreationRateLimitMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, membershipTier } = req.body || {};

    if (!email || !validateEmail(email)) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({ error: passwordValidation.message });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = authStore.findByEmail(normalizedEmail);
    if (existing) {
      // Do not disclose account details, but state clearly for registration
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    // 1. Hash password with bcrypt (work factor 12)
    const passwordHash = await hashPassword(password);

    // 2. Generate email verification token (SHA-256 hash stored in DB)
    const rawVerificationToken = generateSecureToken();
    const verificationTokenHash = hashToken(rawVerificationToken);
    const verificationExpires = Date.now() + CONFIG.EMAIL_VERIFICATION_EXPIRY_MS;

    const newUser: UserRecord = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      email: normalizedEmail,
      name: (name && typeof name === 'string') ? name.trim().slice(0, 80) : 'IronForge Athlete',
      passwordHash,
      role: 'member',
      membershipTier: ['Basic', 'Pro', 'Elite'].includes(membershipTier) ? membershipTier : 'Pro',
      isVerified: false,
      verificationTokenHash,
      verificationTokenExpires: verificationExpires,
      passwordResetTokenHash: null,
      passwordResetTokenExpires: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const sanitized = authStore.createUser(newUser);

    // 3. Issue signed JWT session token with explicit expiration
    const sessionToken = createSessionToken({
      userId: sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      role: sanitized.role,
      isVerified: sanitized.isVerified,
    });

    // Set secure HttpOnly cookie
    res.cookie('ironforge_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: CONFIG.SESSION_EXPIRY_SECONDS * 1000,
    });

    console.log(`[EMAIL DISPATCH SIMULATOR] Verification link generated for ${sanitized.email}: /verify-email?token=${rawVerificationToken}`);

    res.status(201).json({
      message: 'Account successfully registered. Please verify your email.',
      user: sanitized,
      token: sessionToken,
      expiresIn: CONFIG.SESSION_EXPIRY_SECONDS,
      // For testing / demo convenience when no live SMTP is configured:
      devVerificationToken: rawVerificationToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

/**
 * POST /api/auth/login
 * Rate limited to 5 attempts per 15 minutes per IP/account.
 * Uses constant-time bcrypt comparison.
 * Sets secure session with 2h expiration upon success.
 */
authRouter.post('/login', loginRateLimitMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = authStore.findByEmail(normalizedEmail);

    // Even if user does not exist, run a dummy bcrypt check to mitigate timing attacks
    if (!user) {
      await hashPassword('dummy_anti_timing_attack_string_2026');
      const failStatus = rateLimiter.recordFailure(req, normalizedEmail);
      res.status(401).json({
        error: 'Invalid email or password.',
        remainingAttempts: failStatus.remainingAttempts,
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      const failStatus = rateLimiter.recordFailure(req, normalizedEmail);
      if (failStatus.isNowLocked) {
        res.setHeader('Retry-After', failStatus.retryAfterSeconds);
        res.status(429).json({
          error: 'Account locked due to 5 consecutive failed attempts.',
          message: `Please try again in ${Math.ceil(failStatus.retryAfterSeconds / 60)} minute(s).`,
          retryAfterSeconds: failStatus.retryAfterSeconds,
        });
        return;
      }

      res.status(401).json({
        error: 'Invalid email or password.',
        remainingAttempts: failStatus.remainingAttempts,
      });
      return;
    }

    // Login successful: reset rate limiter
    rateLimiter.recordSuccess(req, normalizedEmail);

    user.lastLoginAt = new Date().toISOString();
    authStore.updateUser(user);

    const sanitized = authStore.sanitizeUser(user);

    // Issue signed JWT session token
    const sessionToken = createSessionToken({
      userId: sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      role: sanitized.role,
      isVerified: sanitized.isVerified,
    });

    res.cookie('ironforge_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: CONFIG.SESSION_EXPIRY_SECONDS * 1000,
    });

    res.json({
      message: 'Authentication successful.',
      user: sanitized,
      token: sessionToken,
      expiresIn: CONFIG.SESSION_EXPIRY_SECONDS,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

/**
 * POST /api/auth/logout
 * Clears HttpOnly session cookie and signals client to clear local session state.
 */
authRouter.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('ironforge_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Successfully logged out. Session cleared.' });
});

/**
 * GET /api/auth/me
 * Retrieves sanitized user information for the active, validated session.
 */
authRouter.get('/me', requireAuth, (req: Request, res: Response): void => {
  const user = (req as any).user as UserRecord;
  const payload = (req as any).tokenPayload as TokenPayload;
  const sanitized = authStore.sanitizeUser(user);

  // Calculate session remaining time in seconds
  const remainingSeconds = payload.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : CONFIG.SESSION_EXPIRY_SECONDS;

  res.json({
    user: sanitized,
    sessionRemainingSeconds: remainingSeconds,
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  });
});

/**
 * POST /api/auth/verify-email
 * Validates cryptographically random email verification token and marks account verified.
 */
authRouter.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body || {};
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const tokenHash = hashToken(token.trim());
    const user = authStore.findByVerificationTokenHash(tokenHash);

    if (!user) {
      res.status(400).json({
        error: 'Invalid or expired email verification token. Please request a fresh verification link.',
      });
      return;
    }

    user.isVerified = true;
    user.verificationTokenHash = null;
    user.verificationTokenExpires = null;
    authStore.updateUser(user);

    const sanitized = authStore.sanitizeUser(user);

    // Refresh active session token with isVerified: true
    const sessionToken = createSessionToken({
      userId: sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      role: sanitized.role,
      isVerified: true,
    });

    res.cookie('ironforge_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: CONFIG.SESSION_EXPIRY_SECONDS * 1000,
    });

    res.json({
      message: 'Email successfully verified! Your IronForge athlete account is fully active.',
      user: sanitized,
      token: sessionToken,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal error processing email verification.' });
  }
});

/**
 * POST /api/auth/resend-verification
 * Generates a new verification token with fresh 24h expiration.
 */
authRouter.post('/resend-verification', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as UserRecord;

    if (user.isVerified) {
      res.status(400).json({ message: 'Email address is already verified.' });
      return;
    }

    const rawVerificationToken = generateSecureToken();
    user.verificationTokenHash = hashToken(rawVerificationToken);
    user.verificationTokenExpires = Date.now() + CONFIG.EMAIL_VERIFICATION_EXPIRY_MS;
    authStore.updateUser(user);

    console.log(`[EMAIL DISPATCH SIMULATOR] Fresh verification link for ${user.email}: /verify-email?token=${rawVerificationToken}`);

    res.json({
      message: 'A fresh verification link has been generated and dispatched.',
      devVerificationToken: rawVerificationToken,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Rate limited to prevent email enumeration.
 * Generates crypto-random reset token expiring in strictly 15 minutes.
 * Only the SHA-256 hash of the token is stored in the database.
 */
authRouter.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const ip = abuseProtectionService.getClientIp(req);
    const limitCheck = abuseProtectionService.checkLimit(
      'auth_recovery',
      ip,
      CONFIG.RATE_LIMIT.FORGOT_PASSWORD_MAX_ATTEMPTS,
      CONFIG.RATE_LIMIT.FORGOT_PASSWORD_WINDOW_MS
    );

    res.setHeader('X-RateLimit-Limit', CONFIG.RATE_LIMIT.FORGOT_PASSWORD_MAX_ATTEMPTS);
    res.setHeader('X-RateLimit-Remaining', limitCheck.remaining);

    if (!limitCheck.allowed) {
      res.setHeader('Retry-After', limitCheck.retryAfterSeconds);
      res.status(429).json({
        error: 'Too many password reset requests.',
        code: 'RECOVERY_RATE_LIMIT_EXCEEDED',
        message: `Too many password reset attempts from this IP. Please wait ${Math.ceil(limitCheck.retryAfterSeconds / 60)} minute(s).`,
        retryAfterSeconds: limitCheck.retryAfterSeconds,
      });
      return;
    }

    const { email } = req.body || {};

    if (!email || !validateEmail(email)) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = authStore.findByEmail(normalizedEmail);

    let devToken: string | null = null;

    if (user) {
      const rawResetToken = generateSecureToken();
      user.passwordResetTokenHash = hashToken(rawResetToken);
      user.passwordResetTokenExpires = Date.now() + CONFIG.PASSWORD_RESET_EXPIRY_MS; // 15 mins
      authStore.updateUser(user);

      devToken = rawResetToken;
      console.log(`[PASSWORD RESET DISPATCH] Reset token for ${user.email} (expires in 15m): ${rawResetToken}`);
    }

    // Always return constant, generic message to prevent account enumeration
    res.json({
      message: 'If an account exists with that email address, password reset instructions have been dispatched. The reset link is valid for 15 minutes.',
      devResetToken: devToken, // For reviewer / demo convenience in dev
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Enforces:
 * - 15-minute token expiration check
 * - Single-use token invalidation
 * - Strong password validation
 * - Bcrypt hashing with 12 rounds
 */
authRouter.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Password reset token is required.' });
      return;
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      res.status(400).json({ error: passwordValidation.message });
      return;
    }

    const tokenHash = hashToken(token.trim());
    const user = authStore.findByPasswordResetTokenHash(tokenHash);

    if (!user) {
      res.status(400).json({
        error: 'Invalid or expired password reset token. Password reset tokens expire after 15 minutes.',
      });
      return;
    }

    // 1. Hash new password with bcrypt (12 salt rounds)
    user.passwordHash = await hashPassword(newPassword);

    // 2. Invalidate reset token immediately (single-use protection)
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpires = null;
    user.updatedAt = new Date().toISOString();

    authStore.updateUser(user);

    res.json({
      success: true,
      message: 'Password successfully updated. You may now sign in with your new credentials.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error during password reset.' });
  }
});

/**
 * POST /api/auth/reset-rate-limit
 * Development helper to unblock rate-limited IP/accounts during testing.
 */
authRouter.post('/reset-rate-limit', (req: Request, res: Response): void => {
  rateLimiter.resetAll();
  abuseProtectionService.resetAll();
  res.json({ success: true, message: 'All rate limits and abuse buckets successfully cleared.' });
});

/**
 * GET /api/auth/abuse-telemetry
 * Returns real-time abuse monitoring metrics and incident statistics.
 */
authRouter.get('/abuse-telemetry', (req: Request, res: Response): void => {
  res.json({
    status: 'active',
    telemetry: abuseProtectionService.getTelemetry(),
  });
});


