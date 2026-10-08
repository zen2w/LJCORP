'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JellyfishLogo } from './JellyfishLogo';
import { useEMS } from '../context/EMSContext';
import {
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useEMS();

  const isManager = currentUser?.role === 'manager' || pathname.startsWith('/manager');

  // Employee vs Manager navigation items matching screenshots exactly
  const managerNavItems = [
    { label: 'Dashboard', href: '/manager/dashboard' },
    { label: 'Employee Management', href: '/manager/employees' },
    { label: 'Task', href: '/manager/tasks' },
    { label: 'Leave Request', href: '/manager/leaves' },
    { label: 'Announcements', href: '/manager/announcements' },
  ];

  const employeeNavItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Announcements', href: '/announcements' },
    { label: 'Task', href: '/tasks' },
    { label: 'DTR', href: '/dtr' },
    { label: 'Leave Request', href: '/leave' },
  ];

  const navItems = isManager ? managerNavItems : employeeNavItems;

  return (
    <aside className="w-64 lg:w-72 p-3 sm:p-4 shrink-0 select-none">
      <div className="h-full min-h-[calc(100vh-65px)] bg-[#111419] border border-white/[0.12] rounded-[28px] flex flex-col justify-between p-4 shadow-2xl">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 pt-2 pb-4 border-b border-white/[0.12]">
            <JellyfishLogo className="w-10 h-10" />
            <span className="text-3xl font-bold tracking-tight text-white font-sans">Ljcorp</span>
          </div>

          {/* Section Header */}
          <div className="space-y-3">
            <div className="text-center text-xs font-semibold text-slate-400 tracking-widest uppercase">
              General
            </div>

            {/* Navigation Pill Menu matching screenshot */}
            <nav className="space-y-2.5">
              {navItems.map(item => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/manager/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-start px-5 py-3 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#222731] text-white border border-white/30 shadow-lg'
                        : 'bg-[#181b21] text-slate-300 hover:text-white hover:bg-[#20242d] border border-white/[0.08]'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions: Settings & Log Out */}
        <div className="pt-4 space-y-2">
          <Link
            href="/settings"
            className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
              pathname === '/settings'
                ? 'bg-[#2a303d] text-white border border-white/40'
                : 'bg-[#1b1f26] text-slate-300 hover:text-white hover:bg-[#252b35] border border-white/10'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-300" />
            <span>SETTINGS</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#ff7875] hover:text-[#ff9c9e] bg-[#3d181b]/50 hover:bg-[#541f23] border border-[#ff4d4f]/20 hover:border-[#ff4d4f]/40 transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOG OUT</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

