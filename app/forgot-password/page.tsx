'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JellyfishLogo } from '../components/JellyfishLogo';
import { LocalStore } from '@/lib/store';
import { useEMS } from '../context/EMSContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { showToast } = useEMS();
  const [workEmail, setWorkEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    setErrorMessage('');

    if (!workEmail.trim()) {
      setHasError(true);
      setErrorMessage('The Work Email field cannot be left blank.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const users = LocalStore.getUsers();
      const cleanEmail = workEmail.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        setHasError(true);
        setErrorMessage('Account does not exist. Please verify your work email or contact HR.');
        setIsSubmitting(false);
        return;
      }

      setIsSentSuccess(true);
      showToast('Password Reset Link Sent', `A reset email has been sent to ${user.email}`, 'info');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <main className="min-h-[calc(100vh-45px)] flex items-center justify-center p-4 sm:p-6 bg-black text-white">
      <div className="w-full max-w-[480px] space-y-4">
        {/* Main Card */}
        <div className="bg-[#181a1e] rounded-[32px] p-8 sm:p-11 shadow-2xl border border-white/[0.06] space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-center gap-3">
            <JellyfishLogo className="w-10 h-10" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Ljcorp</h1>
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h2>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Enter your registered work email to receive a password reset link.
            </p>
          </div>

          {/* Success State */}
          {isSentSuccess ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Reset Link Dispatched!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  We sent a secure password reset link to <strong>{workEmail}</strong>. Please check your inbox.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8eaeff] text-[#0f172a] font-semibold rounded-lg text-xs hover:bg-[#a0bbff] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <div className="space-y-2">
                <label className={`block text-xs font-medium ${hasError ? 'text-[#ff3b3b]' : 'text-slate-200'}`}>
                  Work Email
                </label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={e => {
                    setWorkEmail(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="jonhpaul.feliciano@ljcorp.com"
                  className={`w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-lg text-sm focus:outline-none transition-all ${
                    hasError ? 'border-2 border-[#ff3b3b]' : 'border border-transparent focus:ring-2 focus:ring-blue-400/40'
                  }`}
                  required
                />
              </div>

              {/* Red Error Message Matching WRONG INPUT.png */}
              {hasError && (
                <div className="flex items-center gap-1.5 text-[#ff3b3b] text-xs font-normal pt-0.5 animate-in fade-in duration-150">
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#ff3b3b] text-[10px] font-bold">
                    !
                  </span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#8eaeff] hover:bg-[#a0bbff] text-[#0f172a] font-semibold rounded-lg text-sm tracking-wide shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center"
                >
                  {isSubmitting ? 'Verifying Account...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="text-center pt-2 space-y-6">
            <p className="text-xs text-[#9ca3af]">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-[#8eaeff] hover:text-[#b4cbff] font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>

            <p className="text-[11px] text-[#64748b]">
              © 2026 Jelly Corp. Secure Portal.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
