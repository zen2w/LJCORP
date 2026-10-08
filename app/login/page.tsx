'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { JellyfishLogo } from '../components/JellyfishLogo';
import { LocalStore } from '@/lib/store';
import { useEMS } from '../context/EMSContext';
import { UserCheck, ShieldCheck } from 'lucide-react';

function LoginCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, refreshState } = useEMS();

  const [activeTab, setActiveTab] = useState<'employee' | 'manager'>('employee');
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showActivatedSuccess = searchParams.get('activated') === 'true';

  // Handle Tab Switch
  const handleSelectTab = (tab: 'employee' | 'manager') => {
    setActiveTab(tab);
    setHasError(false);
    setErrorMessage('');
    if (tab === 'employee') {
      setWorkEmail('jonhpaul.feliciano@ljcorp.com');
      setPassword('password123');
    } else {
      setWorkEmail('manager.zen@ljcorp.com');
      setPassword('manager123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    setErrorMessage('');

    if (!workEmail.trim() || !password) {
      setHasError(true);
      setErrorMessage('The password or Work Email you entered is incorrect.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = LocalStore.authenticate(workEmail, password);

      if (!result.success || !result.user) {
        setHasError(true);
        setErrorMessage('The password or Work Email you entered is incorrect.');
        setIsSubmitting(false);
        return;
      }

      refreshState();
      showToast('Signed In Successfully', `Welcome, ${result.user.name}. Please confirm or customize your credentials.`, 'success');

      // Seamlessly navigate to User Credentials step before dashboard
      router.push('/credentials');
    }, 350);
  };

  return (
    <div className="w-full max-w-[480px] space-y-4">
      {/* Separate Role Selection Segmented Control */}
      <div className="bg-[#191c20] p-1.5 rounded-2xl border border-white/10 grid grid-cols-2 gap-1.5 shadow-xl">
        <button
          type="button"
          onClick={() => handleSelectTab('employee')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'employee'
              ? 'bg-[#2b3342] text-white shadow-md border border-white/20'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <UserCheck className="w-4 h-4 text-blue-400" />
          <span>Employee Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('manager')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'manager'
              ? 'bg-[#2b3342] text-white shadow-md border border-white/20'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Manager Sign In</span>
        </button>
      </div>

      {/* Main Login Card matching LOGIN.png & WRONG INPUT.png exactly */}
      <div className="bg-[#181a1e] rounded-[32px] p-8 sm:p-11 shadow-2xl border border-white/[0.06] text-white space-y-7">
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-center gap-3">
          <JellyfishLogo className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Ljcorp</h1>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
            {activeTab === 'manager' ? 'Department Manager Portal' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-[13px] text-[#9ca3af] leading-relaxed">
            {activeTab === 'manager'
              ? 'Sign in to access team telemetry, task sign-off & attendance.'
              : 'Sign in to your employee account to continue.'}
          </p>
        </div>

        {/* Activation Success Banner */}
        {showActivatedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs text-center">
            ✓ Account activated! Please sign in with your updated password.
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Work Email Field */}
          <div className="space-y-2">
            <label
              className={`block text-xs font-medium tracking-wide ${
                hasError ? 'text-[#ff3b3b]' : 'text-slate-200'
              }`}
            >
              Work Email
            </label>
            <input
              type="email"
              id="login-work-email"
              value={workEmail}
              onChange={e => {
                setWorkEmail(e.target.value);
                if (hasError) setHasError(false);
              }}
              placeholder={activeTab === 'manager' ? 'manager.zen@ljcorp.com' : 'John.doe@gmail.com'}
              className={`w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-lg text-sm font-normal focus:outline-none transition-all ${
                hasError
                  ? 'border-2 border-[#ff3b3b] focus:ring-2 focus:ring-[#ff3b3b]/30'
                  : 'border border-transparent focus:ring-2 focus:ring-blue-400/40'
              }`}
              required
            />
          </div>

          {/* Password Field & Forgot Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className={`block text-xs font-medium tracking-wide ${
                  hasError ? 'text-[#ff3b3b]' : 'text-slate-200'
                }`}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#8eaeff] hover:text-[#b4cbff] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (hasError) setHasError(false);
              }}
              placeholder="••••••••"
              className={`w-full bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-lg text-sm font-normal focus:outline-none transition-all ${
                hasError
                  ? 'border-2 border-[#ff3b3b] focus:ring-2 focus:ring-[#ff3b3b]/30'
                  : 'border border-transparent focus:ring-2 focus:ring-blue-400/40'
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
              <span>{errorMessage || 'The password or Work Email you entered is incorrect.'}</span>
            </div>
          )}

          {/* Sign In Button Matching Periwinkle Style */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#8eaeff] hover:bg-[#a0bbff] text-[#0f172a] font-semibold rounded-lg text-sm tracking-wide shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center"
            >
              {isSubmitting ? 'Signing In...' : `Sign In as ${activeTab === 'manager' ? 'Department Manager' : 'Employee'}`}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-2 space-y-6">
          <p className="text-xs text-[#9ca3af]">
            New to the portal?{' '}
            <Link
              href="/activate"
              className="text-[#8eaeff] hover:text-[#b4cbff] font-medium transition-colors"
            >
              Activate account
            </Link>
          </p>

          <p className="text-[11px] text-[#64748b]">
            © 2026 Jelly Corp. Secure Portal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-black">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading portal login...</div>}>
        <LoginCardContent />
      </Suspense>
    </main>
  );
}
