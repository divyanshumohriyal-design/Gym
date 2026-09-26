import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  LogOut,
  User,
  Mail,
  Award,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MemberDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerifyModal?: () => void;
}

export const MemberDashboardModal: React.FC<MemberDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenVerifyModal,
}) => {
  const { user, sessionRemainingSeconds, logout, resendVerification } = useAuth();
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendToken, setResendToken] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const formatRemainingTime = (totalSeconds: number | null) => {
    if (!totalSeconds || totalSeconds <= 0) return 'Expired';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);
    const res = await resendVerification();
    setIsResending(false);

    if (res.success) {
      setResendStatus('Fresh verification token issued!');
      if (res.devVerificationToken) {
        setResendToken(res.devVerificationToken);
      }
    } else {
      setResendStatus(res.error || 'Failed to resend verification.');
    }
  };

  const handleSignOut = async () => {
    await logout();
    onClose();
  };

  return (
    <div
      id="ironforge-member-portal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        className="relative w-full max-w-lg bg-[#FAFAF8] rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#171717] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center text-white shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-wider">{user.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#E63946] text-white px-2 py-0.5 rounded-sm">
                  {user.membershipTier} Member
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">{user.email}</p>
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

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Email Verification Status Card */}
          {user.isVerified ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                  Email Verified & Cryptographically Protected
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold">Active</span>
                </div>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your identity has been confirmed. Passwords are encrypted with bcrypt (work factor 12).
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col gap-2.5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                    Email Verification Pending
                    <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-semibold">Action Required</span>
                  </div>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Please verify your email address to unlock all member privileges and password recovery safeguards.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-xs font-semibold text-amber-900 hover:text-black flex items-center gap-1 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                  Resend Verification Link
                </button>
                {onOpenVerifyModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenVerifyModal();
                    }}
                    className="text-xs font-semibold text-[#E63946] hover:underline px-2 py-1"
                  >
                    Enter Token →
                  </button>
                )}
              </div>

              {resendStatus && (
                <p className="text-[11px] font-medium text-amber-800">{resendStatus}</p>
              )}

              {resendToken && (
                <div className="p-2 bg-white rounded border border-amber-300 text-[11px] font-mono break-all select-all text-neutral-800">
                  Token: {resendToken}
                </div>
              )}
            </div>
          )}

          {/* Session Expiry Status */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <Clock className="w-4 h-4 text-[#E63946]" />
                Active Session Expiration
              </div>
              <span className="font-mono text-xs font-bold text-[#E63946] bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                {formatRemainingTime(sessionRemainingSeconds)}
              </span>
            </div>
            <p className="text-xs text-neutral-600">
              For security, sessions expire automatically after 2 hours. Active HTTP requests refresh validity.
            </p>
          </div>

          {/* Security Engineering Audit Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Security Architecture Status</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F3F4F1] border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-neutral-700 font-medium">Bcrypt (Salt Rounds: 12)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F3F4F1] border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-neutral-700 font-medium">HttpOnly Cookie Sessions</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F3F4F1] border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-neutral-700 font-medium">Rate Limiter (5 Attempts/15m)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F3F4F1] border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-neutral-700 font-medium">15-Min Reset Token Expiry</span>
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:border-red-400 text-neutral-700 hover:text-red-700 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-[#E63946]" />
              Secure Sign Out
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
            >
              Close Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
