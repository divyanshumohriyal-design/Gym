import crypto from 'crypto';

// Secret key handling: server-side only, never exposed to client
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  // Generate an ephemeral strong 256-bit secret if not configured in environment
  jwtSecret = crypto.randomBytes(32).toString('hex');
  console.warn('[SECURITY WARNING] No JWT_SECRET found in environment. Using a cryptographically secure ephemeral key for session signing.');
}

export const CONFIG = {
  JWT_SECRET: jwtSecret,
  SESSION_EXPIRY_SECONDS: 2 * 60 * 60, // 2 hours
  PASSWORD_RESET_EXPIRY_MS: 15 * 60 * 1000, // 15 minutes
  EMAIL_VERIFICATION_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  BCRYPT_SALT_ROUNDS: 12,
  RATE_LIMIT: {
    // Global API scraper & flood protection
    GLOBAL_API_MAX_REQUESTS: 120,
    GLOBAL_API_WINDOW_MS: 15 * 60 * 1000, // 15 minutes

    // Authentication protections
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes

    // Account creation / registration spam protection
    REGISTER_MAX_ACCOUNTS: 3,
    REGISTER_WINDOW_MS: 60 * 60 * 1000, // 1 hour

    // Password recovery protections
    FORGOT_PASSWORD_MAX_ATTEMPTS: 3,
    FORGOT_PASSWORD_WINDOW_MS: 15 * 60 * 1000, // 15 minutes

    // AI Generation prompt & quota protections
    AI_MAX_REQUESTS: 5,
    AI_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
    AI_MAX_PROMPT_CHARS: 500,

    // Public contact & free trial lead spam protection
    LEAD_MAX_SUBMISSIONS: 5,
    LEAD_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  BOT_PROTECTION: {
    HONEYPOT_FIELD: '_iron_hp_check',
    MIN_SUBMISSION_TIME_MS: 800, // 800ms human threshold
    SUSPICIOUS_UA_PATTERNS: [
      /scrapy/i,
      /python-requests/i,
      /aiohttp/i,
      /httpclient/i,
      /curl\/[0-9]/i,
      /wget\/[0-9]/i,
      /go-http-client/i,
      /node-fetch/i,
      /axios\/[0-9]/i,
      /phantomjs/i,
      /headlesschrome/i,
      /selenium/i,
      /puppeteer/i,
      /bot[_\s\-]/i,
      /spider/i,
      /crawl/i,
    ],
  }
};

