import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthResponse } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  sessionRemainingSeconds: number | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; remainingAttempts?: number; retryAfterSeconds?: number }>;
  register: (email: string, password: string, name?: string, membershipTier?: string) => Promise<{ success: boolean; error?: string; devVerificationToken?: string }>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resendVerification: () => Promise<{ success: boolean; message?: string; error?: string; devVerificationToken?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; devResetToken?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetRateLimits: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ironforge_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number | null>(null);

  // Helper for authenticated requests
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  // Check active session on mount and refresh
  const refreshSession = useCallback(async () => {
    try {
      const activeToken = token || localStorage.getItem('ironforge_token');
      const res = await fetch('/api/auth/me', {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSessionRemainingSeconds(data.sessionRemainingSeconds || null);
      } else {
        // Session expired or unauthorized
        setUser(null);
        setToken(null);
        localStorage.removeItem('ironforge_token');
        setSessionRemainingSeconds(null);
      }
    } catch (err) {
      console.warn('Could not verify active session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Session countdown timer
  useEffect(() => {
    if (!sessionRemainingSeconds || sessionRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setSessionRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          // Session expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('ironforge_token');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionRemainingSeconds]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Authentication failed.',
          remainingAttempts: data.remainingAttempts,
          retryAfterSeconds: data.retryAfterSeconds,
        };
      }

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('ironforge_token', data.token);
        setSessionRemainingSeconds(data.expiresIn || 7200);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed.' };
    }
  };

  const register = async (email: string, password: string, name?: string, membershipTier?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name, membershipTier }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('ironforge_token', data.token);
        setSessionRemainingSeconds(data.expiresIn || 7200);
      }

      return {
        success: true,
        devVerificationToken: data.devVerificationToken,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ironforge_token');
      setSessionRemainingSeconds(null);
    }
  };

  const verifyEmail = async (verificationToken: string) => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }

      if (data.user) {
        setUser(data.user);
      }
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('ironforge_token', data.token);
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const resendVerification = async () => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || data.message || 'Failed to resend verification.' };
      }

      return {
        success: true,
        message: data.message,
        devVerificationToken: data.devVerificationToken,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      return {
        success: true,
        message: data.message,
        devResetToken: data.devResetToken,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to reset password.' };
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const resetRateLimits = async () => {
    try {
      await fetch('/api/auth/reset-rate-limit', {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Failed to reset rate limits:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sessionRemainingSeconds,
        login,
        register,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        resetRateLimits,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
