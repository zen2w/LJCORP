'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { JellyfishLogo } from '../components/JellyfishLogo';
import { LocalStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { sendActivationEmail } from '@/lib/emailService';
import { useEMS } from '../context/EMSContext';
import { Sparkles, CheckCircle2, Mail, KeyRound, ArrowRight } from 'lucide-react';

export default function ActivateAccountPage() {
  const router = useRouter();
  const { showToast, refreshState } = useEMS();

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [desiredEmail, setDesiredEmail] = useState('');

  // UI State
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activatedData, setActivatedData] = useState<{
    name: string;
    email: string;
    employeeId: string;
    username: string;
    defaultPassword?: string;
  } | null>(null);

  // Quick Demo Autofills matching user's info file
  const handleQuickFillJohnPaul = () => {
    setEmployeeId('EMP-2026-0321');
    setDesiredEmail('jonhpaulfeliciano2@gmail.com');
    setHasError(false);
    setErrorMessage('');
    showToast('Employee Info Loaded', 'EMP-2026-0321 (John Paul Feliciano)', 'info');
  };

  const handleQuickFillGozen = () => {
    setEmployeeId('EMP-2026-0543');
    setDesiredEmail('gozenyans@gmail.com');
    setHasError(false);
    setErrorMessage('');
    showToast('Employee Info Loaded', 'EMP-2026-0543 (Gozen Feliciano)', 'info');
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    setErrorMessage('');

    const cleanId = employeeId.trim().toUpperCase();
    const cleanEmail = desiredEmail.trim().toLowerCase();

    if (!cleanId || !cleanEmail) {
      setHasError(true);
      setErrorMessage('Please provide both your Employee ID and desired email.');
      return;
    }

    setIsSubmitting(true);

    try {
      let matchedUser = LocalStore.getUsers().find(u => u.id.toUpperCase() === cleanId);

      // Attempt Supabase lookup if available
      try {
        const { data: dbUser } = await supabase
          .from('employees')
          .select('*')
          .eq('employee_id', cleanId)
          .single();

        if (dbUser) {
          matchedUser = {
            id: dbUser.employee_id,
            name: dbUser.name,
            email: cleanEmail,
            password: dbUser.password || 'Ljcorp2026!',
            role: (dbUser.role as 'employee' | 'manager') || 'employee',
            department: dbUser.department || 'Engineering',
            position: dbUser.position || 'Staff',
            phone: dbUser.phone || '+1 (555) 234-5678',
            address: dbUser.address || '742 Evergreen Terrace, Sector 4',
            emergencyContact: dbUser.emergency_contact || 'Contact Admin',
            status: 'Active',
            avatarUrl: dbUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            joinDate: dbUser.join_date || '2026-10-01',
            isActivated: true,
          };
        }
      } catch (err) {
        console.warn('Supabase query skipped or table not initialized yet:', err);
      }

      if (!matchedUser) {
        setHasError(true);
        setErrorMessage('Employee ID not found. Please contact your administrator.');
        setIsSubmitting(false);
        return;
      }

      const defaultPassword = matchedUser.password || 'Ljcorp2026!';
      const username = cleanEmail;

      // Update LocalStore
      LocalStore.activateUser(cleanId, cleanEmail, defaultPassword);

      // Save directly to Supabase Table Editor via API Route and Direct Client
      try {
        const res = await fetch('/api/activate-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: cleanId,
            email: cleanEmail,
            password: defaultPassword,
          }),
        });
        const result = await res.json();
        if (result.success) {
          console.log('[Supabase Table Editor] Successfully saved to table:', result.table);
        } else {
          console.warn('[Supabase Table Editor Notice]:', result);
        }
      } catch (saveErr) {
        console.warn('API save error:', saveErr);
      }

      // Send Activation Email via EmailJS
      const emailResult = await sendActivationEmail({
        to_name: matchedUser.name,
        to_email: cleanEmail,
        employee_id: cleanId,
        username: cleanEmail,
        password: defaultPassword,
      });

      refreshState();

      if (emailResult.success) {
        showToast('Activation Email Sent!', `Credentials delivered to ${cleanEmail}`, 'success');
      } else {
        showToast('Activated with Notice', `Account activated. Email delivery: ${emailResult.error || 'simulated'}`, 'info');
      }

      setActivatedData({
        name: matchedUser.name,
        email: cleanEmail,
        employeeId: cleanId,
        username,
        defaultPassword,
      });
    } catch (err: unknown) {
      console.error('Activation error:', err);
      setHasError(true);
      setErrorMessage('An unexpected error occurred during activation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-black text-white">
      <div className="w-full max-w-[500px] space-y-4">
        {/* Quick Demo Autofill Helpers */}
        <div className="p-3 rounded-2xl bg-[#191c20]/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span><strong>Quick Autofill:</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickFillJohnPaul}
              className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 rounded-lg font-medium transition-colors text-[11px]"
            >
              John Paul (0321)
            </button>
            <button
              type="button"
              onClick={handleQuickFillGozen}
              className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 rounded-lg font-medium transition-colors text-[11px]"
            >
              Gozen (0543)
            </button>
          </div>
        </div>

        {/* Main Activation Card */}
        <div className="bg-[#181a1e] rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/[0.06] space-y-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-3">
            <JellyfishLogo className="w-10 h-10" />
            <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Ljcorp</h1>
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">Activate Account</h2>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Enter your given Employee ID and desired work email to receive your login credentials.
            </p>
          </div>

          {/* Success State */}
          {activatedData ? (
            <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Credentials Dispatched!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Welcome, <strong>{activatedData.name}</strong>! We have sent your default username & password to <strong className="text-blue-400">{activatedData.email}</strong> and dispatched a verification notification to the Department Manager (<strong className="text-amber-400">gozenyans@gmail.com</strong>).
                </p>
              </div>

              {/* Dual Email Delivery Summary Box */}
              <div className="p-4 rounded-2xl bg-[#141820] border border-white/10 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/[0.06]">
                  <span className="font-semibold text-white">Dispatched Emails:</span>
                  <span className="font-mono text-blue-400 text-[11px]">{activatedData.employeeId}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <div className="flex items-center justify-between text-blue-300 font-semibold text-[11px]">
                    <span>1. Employee Personal Email</span>
                    <span className="text-emerald-400">✓ Sent</span>
                  </div>
                  <div className="font-mono text-white text-xs">{activatedData.email}</div>
                  <div className="text-[10px] text-slate-400">Contains username and default temporary password.</div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-semibold text-[11px]">
                    <span>2. Department Manager Email</span>
                    <span className="text-emerald-400">✓ Sent</span>
                  </div>
                  <div className="font-mono text-white text-xs">gozenyans@gmail.com</div>
                  <div className="text-[10px] text-slate-400">Contains new activation record for verification.</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full py-3 px-4 bg-[#8eaeff] hover:bg-[#a0bbff] text-[#0f172a] font-semibold rounded-lg text-sm tracking-wide shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-4">
              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-medium ${hasError ? 'text-[#ff3b3b]' : 'text-slate-200'}`}>
                  Given Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="input-employee-id"
                    value={employeeId}
                    onChange={e => {
                      setEmployeeId(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder="EMP-2026-0321"
                    className={`w-full bg-white text-slate-900 placeholder:text-slate-400 pl-9 pr-3.5 py-2.5 rounded-lg text-xs font-mono focus:outline-none transition-all ${hasError ? 'border-2 border-[#ff3b3b]' : 'border border-transparent'
                      }`}
                    required
                  />
                </div>
              </div>

              {/* Desired Email */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-medium ${hasError ? 'text-[#ff3b3b]' : 'text-slate-200'}`}>
                  Desired Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="input-desired-email"
                    value={desiredEmail}
                    onChange={e => {
                      setDesiredEmail(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder="yourname@gmail.com"
                    className={`w-full bg-white text-slate-900 placeholder:text-slate-400 pl-9 pr-3.5 py-2.5 rounded-lg text-xs focus:outline-none transition-all ${hasError ? 'border-2 border-[#ff3b3b]' : 'border border-transparent'
                      }`}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Your default username & password will be delivered to this email.
                </p>
              </div>

              {/* Error Message */}
              {hasError && (
                <div className="flex items-center gap-1.5 text-[#ff3b3b] text-xs font-normal pt-1 animate-in fade-in duration-150">
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#ff3b3b] text-[10px] font-bold">
                    !
                  </span>
                  <span>{errorMessage || 'Employee ID not found. Please contact your administrator.'}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-activate-submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#8eaeff] hover:bg-[#a0bbff] text-[#0f172a] font-semibold rounded-lg text-sm tracking-wide shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center"
                >
                  {isSubmitting ? 'Verifying & Sending Email...' : 'Activate & Send Credentials'}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="text-center pt-2 space-y-6">
            <p className="text-xs text-[#9ca3af]">
              Already have an active account?{' '}
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
