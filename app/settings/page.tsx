'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/Sidebar';
import { useEMS } from '../context/EMSContext';
import { LogOut, Mail, Building, Phone, MapPin } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, showToast } = useEMS();

  const handleSignOut = () => {
    showToast('Signed Out', 'You have been logged out of your portal session.', 'info');
    router.push('/login');
  };

  const isManager = currentUser?.role === 'manager';

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Settings & Profile</h1>
          <p className="text-xs text-slate-400">
            Account preferences and session management.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#151c24] rounded-[24px] p-6 sm:p-8 border border-[#1e2836] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2836]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{currentUser?.name || 'User Name'}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold uppercase text-[10px]">
                    {isManager ? 'Department Manager' : 'Employee'}
                  </span>
                  <span>•</span>
                  <span>ID: {currentUser?.id || 'EMP-2026-0891'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <Link
                href="/credentials"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e293b] hover:bg-[#2e3e56] text-[#8eaeff] border border-[#8eaeff]/30 font-semibold text-xs tracking-wide shadow-md transition-all"
              >
                <span>Edit Name & Password</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#541f23] hover:bg-[#68242a] text-[#ff4d4f] border border-[#ff4d4f]/30 font-semibold text-xs tracking-wide shadow-md transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#18202b] border border-[#1e2836] space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Work Email</span>
              </div>
              <div className="font-semibold text-white">{currentUser?.email}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#18202b] border border-[#1e2836] space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>Department</span>
              </div>
              <div className="font-semibold text-white">{currentUser?.department}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#18202b] border border-[#1e2836] space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Number</span>
              </div>
              <div className="font-semibold text-white">{currentUser?.phone || '+1 (555) 234-5678'}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#18202b] border border-[#1e2836] space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Residential Address</span>
              </div>
              <div className="font-semibold text-white">{currentUser?.address || '742 Evergreen Terrace, Sector 4'}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
