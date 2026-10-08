'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { JellyfishLogo } from '../components/JellyfishLogo';
import { LocalStore } from '@/lib/store';
import { useEMS } from '../context/EMSContext';
import { User, Lock, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';

function CredentialsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, showToast, refreshState } = useEMS();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPassword(currentUser.password || '');
    }
  }, [currentUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    setErrorMessage('');

    if (!name.trim()) {
      setHasError(true);
      setErrorMessage('Please enter your full given name.');
      return;
    }

    if (!password) {
      setHasError(true);
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setHasError(true);
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setHasError(true);
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeUser = currentUser || LocalStore.getCurrentUser();
      
      // 1. Update LocalStore
      LocalStore.updateUserProfile(activeUser.id, {
        name: name.trim(),
        password: password.trim(),
      });

      // 2. Sync with Supabase
      try {
        await fetch('/api/update-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: activeUser.id,
            email: activeUser.email,
            name: name.trim(),
            password: password.trim(),
          }),
        });
      } catch (dbErr) {
        console.warn('Supabase sync warning:', dbErr);
      }

      refreshState();
      setIsSuccess(true);
      showToast('Credentials Updated!', 'Your given name and password have been saved.', 'success');

      setTimeout(() => {
        if (activeUser.role === 'manager') {
          router.push('/manager/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1200);
    } catch (err) {
      setHasError(true);
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] space-y-4">
      {/* Return to Dashboard / Login */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold">
          <Shield className="w-3 h-3" />
          <span>Credential Manager</span>
        </div>
      </div>

      {/* Main Card with exact same UI as Login Card */}
      <div className="bg-[#181a1e] rounded-[32px] p-8 sm:p-11 shadow-2xl border border-white/[0.06] text-white space-y-7">
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-center gap-3">
          <JellyfishLogo className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Ljcorp</h1>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
            User Credentials
          </h2>
          <p className="text-xs sm:text-[13px] text-[#9ca3af] leading-relaxed">
            Change your given name and custom password for future sign-ins.
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold">Credentials Updated Successfully!</div>
            <div className="text-xs text-emerald-300/80">Redirecting to your dashboard...</div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Given Name Field */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-medium tracking-wide ${
                  hasError && !name.trim() ? 'text-[#ff3b3b]' : 'text-slate-200'
                }`}
              >
                Given / Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="input-credential-name"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="e.g. Jonh Paul Feliciano"
                  className={`w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-lg text-sm font-normal focus:outline-none transition-all ${
                    hasError && !name.trim()
                      ? 'border-2 border-[#ff3b3b] focus:ring-2 focus:ring-[#ff3b3b]/30'
                      : 'border border-transparent focus:ring-2 focus:ring-blue-400/40'
                  }`}
                  required
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-medium tracking-wide ${
                  hasError && !password ? 'text-[#ff3b3b]' : 'text-slate-200'
                }`}
              >
                New Password
              </label>
              <input
                type="password"
                id="input-credential-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (hasError) setHasError(false);
                }}
                placeholder="Enter new password (min. 6 chars)"
                className={`w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-lg text-sm font-normal focus:outline-none transition-all ${
                  hasError && !password
                    ? 'border-2 border-[#ff3b3b] focus:ring-2 focus:ring-[#ff3b3b]/30'
                    : 'border border-transparent focus:ring-2 focus:ring-blue-400/40'
                }`}
                required
              />
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-medium tracking-wide text-slate-200">
                Confirm New Password
              </label>
              <input
                type="password"
                id="input-credential-confirm-password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (hasError) setHasError(false);
                }}
                placeholder="Re-enter password"
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-lg text-sm font-normal focus:outline-none transition-all border border-transparent focus:ring-2 focus:ring-blue-400/40"
              />
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="flex items-center gap-1.5 text-[#ff3b3b] text-xs font-normal pt-0.5 animate-in fade-in duration-150">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#ff3b3b] text-[10px] font-bold">
                  !
                </span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                id="btn-save-credentials"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#8eaeff] hover:bg-[#a0bbff] text-[#0f172a] font-semibold rounded-lg text-sm tracking-wide shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? 'Saving Credentials...' : 'Save & Continue to Dashboard'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const activeUser = currentUser || LocalStore.getCurrentUser();
                  if (activeUser?.role === 'manager') {
                    router.push('/manager/dashboard');
                  } else {
                    router.push('/dashboard');
                  }
                }}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-white/[0.06] text-slate-300 font-medium rounded-lg text-xs tracking-wide transition-all text-center cursor-pointer"
              >
                Skip & Proceed to Dashboard →
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="text-center pt-2 space-y-6">
          <p className="text-xs text-[#9ca3af]">
            Logged in as{' '}
            <span className="text-white font-medium">
              {currentUser?.email || 'Active User'}
            </span>
          </p>

          <p className="text-[11px] text-[#64748b]">
            © 2026 Jelly Corp. Secure Portal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CredentialsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-black">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading credentials editor...</div>}>
        <CredentialsContent />
      </Suspense>
    </main>
  );
}
