import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { CONFIG } from './config';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Hash password using bcrypt with work factor 12.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(CONFIG.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Verify plaintext password against bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate cryptographically secure random token (e.g. 64-char hex string).
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Compute SHA-256 hash of a token for secure database storage.
 * Prevents plain token leakage in the event of database exfiltration.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Enforce robust password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special symbol
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password must not exceed 128 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must include at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must include at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    return { isValid: false, message: 'Password must include at least one special character.' };
  }
  return { isValid: true };
}

/**
 * Validate email format with standard regex.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Generate signed JWT session token with explicit expiration.
 */
export function createSessionToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, expiresInSeconds = CONFIG.SESSION_EXPIRY_SECONDS): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      isVerified: payload.isVerified,
    },
    CONFIG.JWT_SECRET,
    {
      expiresIn: expiresInSeconds,
      algorithm: 'HS256',
    }
  );
}

/**
 * Verify JWT session token and enforce expiration.
 */
export function verifySessionToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET, { algorithms: ['HS256'] }) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}
