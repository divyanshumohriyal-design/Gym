import fs from 'fs';
import path from 'path';
import { hashPassword } from './security';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'member' | 'admin' | 'trainer';
  membershipTier: 'Basic' | 'Pro' | 'Elite' | 'Guest';
  isVerified: boolean;
  verificationTokenHash: string | null;
  verificationTokenExpires: number | null;
  passwordResetTokenHash: string | null;
  passwordResetTokenExpires: number | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin' | 'trainer';
  membershipTier: 'Basic' | 'Pro' | 'Elite' | 'Guest';
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

class AuthStore {
  private users: Map<string, UserRecord> = new Map();
  private initialized = false;

  public async init(): Promise<void> {
    if (this.initialized) return;

    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create .data directory', err);
      }
    }

    if (fs.existsSync(USERS_FILE)) {
      try {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        const list: UserRecord[] = JSON.parse(raw);
        for (const u of list) {
          this.users.set(u.email.toLowerCase(), u);
        }
        console.log(`[AUTH STORE] Loaded ${this.users.size} user(s) from disk.`);
      } catch (err) {
        console.warn('[AUTH STORE] Failed to parse users file. Starting fresh.', err);
      }
    }

    // Seed default member account if empty
    if (!this.users.has('member@ironforge.com')) {
      const demoHash = await hashPassword('IronForge2026!');
      const demoUser: UserRecord = {
        id: 'usr_ironforge_demo',
        email: 'member@ironforge.com',
        name: 'Alex Mercer',
        passwordHash: demoHash,
        role: 'member',
        membershipTier: 'Elite',
        isVerified: true,
        verificationTokenHash: null,
        verificationTokenExpires: null,
        passwordResetTokenHash: null,
        passwordResetTokenExpires: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
      };
      this.users.set(demoUser.email, demoUser);
      this.saveToDisk();
      console.log('[AUTH STORE] Initialized demo member account: member@ironforge.com (pwd: IronForge2026!)');
    }

    this.initialized = true;
  }

  private saveToDisk(): void {
    try {
      const array = Array.from(this.users.values());
      fs.writeFileSync(USERS_FILE, JSON.stringify(array, null, 2), 'utf-8');
    } catch (err) {
      console.error('[AUTH STORE] Failed to write users to disk', err);
    }
  }

  public findByEmail(email: string): UserRecord | undefined {
    return this.users.get(email.trim().toLowerCase());
  }

  public findById(id: string): UserRecord | undefined {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return undefined;
  }

  public findByPasswordResetTokenHash(tokenHash: string): UserRecord | undefined {
    const now = Date.now();
    for (const u of this.users.values()) {
      if (
        u.passwordResetTokenHash === tokenHash &&
        u.passwordResetTokenExpires &&
        u.passwordResetTokenExpires > now
      ) {
        return u;
      }
    }
    return undefined;
  }

  public findByVerificationTokenHash(tokenHash: string): UserRecord | undefined {
    const now = Date.now();
    for (const u of this.users.values()) {
      if (
        u.verificationTokenHash === tokenHash &&
        u.verificationTokenExpires &&
        u.verificationTokenExpires > now
      ) {
        return u;
      }
    }
    return undefined;
  }

  public createUser(user: UserRecord): SanitizedUser {
    this.users.set(user.email.toLowerCase(), user);
    this.saveToDisk();
    return this.sanitizeUser(user);
  }

  public updateUser(user: UserRecord): void {
    user.updatedAt = new Date().toISOString();
    this.users.set(user.email.toLowerCase(), user);
    this.saveToDisk();
  }

  /**
   * CRITICAL SECURITY PRINCIPLE:
   * Sanitize user object to ensure passwordHash, resetTokenHash,
   * verificationTokenHash, and internal secrets are NEVER exposed to the frontend.
   */
  public sanitizeUser(user: UserRecord): SanitizedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      membershipTier: user.membershipTier,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

export const authStore = new AuthStore();
