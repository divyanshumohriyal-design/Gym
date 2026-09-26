import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'register' | 'forgot' | 'verify';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
}) => {
  const {
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resetRateLimits,
    user,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot' | 'reset' | 'verify'>(initialTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [membershipTier, setMembershipTier] = useState<'Basic' | 'Pro' | 'Elite'>('Pro');
  const [resetToken, setResetToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');

  // UI feedback
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [devHelperToken, setDevHelperToken] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMessage(null);
    setSuccessMessage(null);
    setDevHelperToken(null);
  }, [initialTab, isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutSeconds || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);
  const isPasswordStrong = hasMinLength && hasUpper && hasLower && hasDigit && hasSpecial;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Welcome back! Authentication successful.');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
      if (res.retryAfterSeconds) {
        setLockoutSeconds(res.retryAfterSeconds);
      }
      if (res.remainingAttempts !== undefined) {
        setRemainingAttempts(res.remainingAttempts);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isPasswordStrong) {
      setErrorMessage('Please ensure your password satisfies all security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(email, password, name, membershipTier);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Account registered successfully! A secure verification token has been issued.');
      if (res.devVerificationToken) {
        setDevHelperToken(res.devVerificationToken);
        setVerifyToken(res.devVerificationToken);
      }
      setActiveTab('verify');
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const res = await forgotPassword(email);
    setIsSubmitting(false);

    setSuccessMessage(res.message || 'If an account exists, a 15-minute reset token has been dispatched.');
    if (res.devResetToken) {
      setDevHelperToken(res.devResetToken);
      setResetToken(res.devResetToken);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isPasswordStrong) {
      setErrorMessage('New password does not meet security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(resetToken, password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Password reset successfully! You can now sign in with your new password.');
      setTimeout(() => {
        setActiveTab('signin');
        setPassword('');
        setConfirmPassword('');
      }, 1500);
    } else {
      setErrorMessage(res.error || 'Invalid or expired reset token.');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const res = await verifyEmail(verifyToken);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Email verified successfully! Your account is now fully secured.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Failed to verify email token.');
    }
  };

  const handleUseDemoAccount = () => {
    setEmail('member@ironforge.com');
    setPassword('IronForge2026!');
    setErrorMessage(null);
  };

  const handleClearRateLimit = async () => {
    await resetRateLimits();
    setLockoutSeconds(null);
    setRemainingAttempts(null);
    setErrorMessage('Rate limiter reset. You may attempt sign-in.');
  };

  return (
    <div
      id="ironforge-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-[#FAFAF8] rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#171717] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E63946] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-wider">IRONFORGE</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest bg-white/10 text-neutral-300 px-2 py-0.5 rounded-sm">
                  Auth Security
                </span>
              </div>
              <p className="text-xs text-neutral-400">Encrypted sessions, bcrypt hashing & rate-limiting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F3F4F1] text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage(null);
            }}
            className={`py-3 transition-colors text-center border-b-2 ${
              activeTab === 'signin'
                ? 'border-[#E63946] text-[#171717] bg-[#FAFAF8] font-bold'
                : 'border-transparent text-neutral-600 hover:text-[#171717]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`py-3 transition-colors text-center border-b-2 ${
              activeTab === 'register'
                ? 'border-[#E63946] text-[#171717] bg-[#FAFAF8] font-bold'
                : 'border-transparent text-neutral-600 hover:text-[#171717]'
            }`}
          >
            Join / Register
          </button>
          <button
            onClick={() => {
              setActiveTab('verify');
              setErrorMessage(null);
            }}
            className={`py-3 transition-colors text-center border-b-2 ${
              activeTab === 'verify'
                ? 'border-[#E63946] text-[#171717] bg-[#FAFAF8] font-bold'
                : 'border-transparent text-neutral-600 hover:text-[#171717]'
            }`}
          >
            Email Verify
          </button>
        </div>

        {/* Alerts */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {lockoutSeconds !== null && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Rate Limit Triggered: </span>
                Too many failed login attempts. Locked for {lockoutSeconds}s for brute-force protection.
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleClearRateLimit}
                    className="inline-flex items-center gap-1 font-semibold text-[#E63946] underline hover:text-red-900"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset rate limiter (Dev helper)
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMessage && !lockoutSeconds && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {remainingAttempts !== null && remainingAttempts < 5 && remainingAttempts > 0 && (
            <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
              <span>Security warning: <strong>{remainingAttempts}</strong> attempt(s) remaining before lockout.</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* Dev helper token box */}
          {devHelperToken && (
            <div className="mb-4 p-3 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#E63946]">
                  Simulated Token Dispatched
                </span>
                <span className="text-[10px] text-neutral-500">Expires soon</span>
              </div>
              <code className="block bg-white p-2 rounded border border-neutral-200 font-mono text-[11px] break-all select-all text-[#171717]">
                {devHelperToken}
              </code>
            </div>
          )}

          {/* TAB: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@ironforge.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs text-[#E63946] hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || lockoutSeconds !== null}
                  className="w-full py-3 bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Verifying Secure Hash...</span>
                  ) : (
                    <>
                      <span>Sign In to IronForge</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Account Quick-fill */}
              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-neutral-500">
                <span>Testing credentials:</span>
                <button
                  type="button"
                  onClick={handleUseDemoAccount}
                  className="font-semibold text-[#171717] bg-white border border-neutral-300 hover:border-[#E63946] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <KeyRound className="w-3 h-3 text-[#E63946]" /> Fill Demo Member
                </button>
              </div>
            </form>
          )}

          {/* TAB: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Steele"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Membership Plan</label>
                <select
                  value={membershipTier}
                  onChange={(e) => setMembershipTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                >
                  <option value="Basic">Basic Access ($39/mo)</option>
                  <option value="Pro">Pro Athlete ($69/mo) - Recommended</option>
                  <option value="Elite">Elite VIP Performance ($119/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="w-full pl-10 pr-10 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>

              {/* Password strength checklist */}
              <div className="p-3 bg-[#F3F4F1] rounded-xl border border-neutral-200 text-[11px] space-y-1">
                <div className="font-semibold text-neutral-700 mb-1">Password Security Criteria:</div>
                <div className="grid grid-cols-2 gap-1">
                  <span className={hasMinLength ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                    {hasMinLength ? '✓' : '○'} 8+ Characters
                  </span>
                  <span className={hasUpper ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                    {hasUpper ? '✓' : '○'} Uppercase Letter
                  </span>
                  <span className={hasLower ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                    {hasLower ? '✓' : '○'} Lowercase Letter
                  </span>
                  <span className={hasDigit ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                    {hasDigit ? '✓' : '○'} Number (0-9)
                  </span>
                  <span className={hasSpecial ? 'text-emerald-700 font-medium' : 'text-neutral-400'}>
                    {hasSpecial ? '✓' : '○'} Special Symbol (!@#$)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isPasswordStrong}
                className="w-full py-3 bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Hashing & Registering...' : 'Create Athlete Account'}
              </button>
            </form>
          )}

          {/* TAB: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Password Reset Security: </span>
                  Reset tokens are cryptographically generated, stored as SHA-256 hashes, and expire in strictly 15 minutes.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#171717] hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-all"
              >
                {isSubmitting ? 'Generating Token...' : 'Send Password Reset Token'}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  ← Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reset')}
                  className="text-[#E63946] font-semibold hover:underline"
                >
                  Have a reset token? Enter it here →
                </button>
              </div>
            </form>
          )}

          {/* TAB: RESET PASSWORD */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Reset Token (from Email)</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste 64-character token"
                  className="w-full px-3 py-2.5 bg-white border border-[#E5E7EB] rounded-xl font-mono text-xs focus:outline-none focus:border-[#E63946]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New strong password"
                    className="w-full pl-10 pr-10 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E63946]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isPasswordStrong}
                className="w-full py-3 bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Updating Hash...' : 'Set New Password'}
              </button>

              <div className="text-center text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB: EMAIL VERIFICATION */}
          {activeTab === 'verify' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Email Verification Security: </span>
                  Verifying your email confirms ownership and enables account recovery safeguards. Tokens expire in 24 hours.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Verification Token</label>
                <input
                  type="text"
                  required
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  placeholder="Paste verification token"
                  className="w-full px-3 py-2.5 bg-white border border-[#E5E7EB] rounded-xl font-mono text-xs focus:outline-none focus:border-[#E63946]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !verifyToken.trim()}
                className="w-full py-3 bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying Token...' : 'Confirm Email Verification'}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  ← Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
