'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { useEMS } from '../../context/EMSContext';
import {
  Calendar,
  User,
  Users,
  CheckSquare,
  LogOut,
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const router = useRouter();
  const { currentUser, showToast } = useEMS();

  const handleLogout = () => {
    showToast('Signed Out', 'You have been safely logged out.', 'info');
    router.push('/login');
  };

  const managerName = currentUser?.name?.toUpperCase() || 'MANAGER NAME';

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white">
      {/* Encased Sidebar Navigation matching screenshot */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-5 lg:p-6 space-y-6 max-w-[1350px]">
        {/* Top Header Row with white horizontal divider matching screenshot */}
        <header className="space-y-3 pt-1">
          <div className="flex items-center justify-end gap-3 pr-2">
            <Link
              href="/credentials"
              title="Edit Profile & Password"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181d24] hover:bg-[#222933] border border-white/10 transition-all shadow group"
            >
              <div className="w-5 h-5 rounded-full bg-white flex-shrink-0 shadow" />
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-100 uppercase group-hover:text-amber-300 transition-colors">
                {managerName}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              id="btn-manager-logout"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4a1c22] hover:bg-[#632028] border border-[#ff4d4f]/30 text-[#ff7875] text-xs font-semibold tracking-wide transition-all shadow active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
          {/* Thin horizontal line across top */}
          <div className="w-full h-px bg-white/20" />
        </header>

        {/* Dashboard Title & Welcome */}
        <div className="space-y-0.5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, Manager {currentUser?.name ? currentUser.name.split(' ')[0].toLowerCase() : 'zen'}.
          </p>
        </div>

        {/* 4 Summary KPI Cards Grid (2x2) Matching DEPARTMENT MANAGER DASHBOARD 1.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Leave Requests */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4d3216] text-[#e67e22] flex items-center justify-center shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">93.7%</div>
              <div className="text-xs font-semibold text-slate-200">Leave Requests</div>
              <div className="text-[11px] text-slate-400 pt-1">
                Awaiting approval
              </div>
            </div>
          </div>

          {/* Card 2: Present Today */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4d3216] text-[#e67e22] flex items-center justify-center shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3</div>
              <div className="text-xs font-semibold text-slate-200">Present Today</div>
              <div className="text-[11px] text-slate-400 pt-1">
                2 absent · 1 on leave
              </div>
            </div>
          </div>

          {/* Card 3: Total Employees */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b3a58] text-[#38bdf8] flex items-center justify-center shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">10</div>
              <div className="text-xs font-semibold text-slate-200">Total Employees</div>
              <div className="text-[11px] text-slate-400 pt-1">
                Engineering dept.
              </div>
            </div>
          </div>

          {/* Card 4: Pending Tasks */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4c1d24] text-[#e74c3c] flex items-center justify-center shadow-inner">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">4</div>
              <div className="text-xs font-semibold text-slate-200">Pending Tasks</div>
              <div className="text-[11px] text-slate-400 pt-1">
                2 overdue · 1 new
              </div>
            </div>
          </div>
        </div>

        {/* Today's Attendance Big Widget (Matching DEPARTMENT MANAGER DASHBOARD 1.png) */}
        <div className="bg-[#151c24] rounded-[24px] p-6 sm:p-7 border border-[#1e2836] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Today&apos;s Attendance
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Aug 24, 2026 · 10 employees</p>
            </div>
            <Link
              href="/manager/attendance"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#3b4b5e] hover:bg-[#4a5e75] text-[#d6e4f0] text-xs font-semibold tracking-wide shadow-md transition-all self-start sm:self-auto"
            >
              View attendance record
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            {/* Giant Left Stat */}
            <div className="md:col-span-5 text-center md:text-left space-y-1">
              <div className="text-6xl sm:text-7xl font-bold text-white tracking-tight">6</div>
              <div className="text-base sm:text-lg font-semibold text-white tracking-wide">Present</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#2ecc71] tracking-tight">60.7%</div>
            </div>

            {/* Right Legend Breakdown */}
            <div className="md:col-span-7 space-y-3.5 border-t md:border-t-0 md:border-l border-[#1e2836] pt-4 md:pt-0 md:pl-8">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#2ecc71]" />
                  <span className="text-slate-200 font-medium">Present</span>
                </div>
                <span className="font-semibold text-white font-mono">6</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#f39c12]" />
                  <span className="text-slate-200 font-medium">Late</span>
                </div>
                <span className="font-semibold text-white font-mono">1</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#e74c3c]" />
                  <span className="text-slate-200 font-medium">Absent</span>
                </div>
                <span className="font-semibold text-white font-mono">2</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#3498db]" />
                  <span className="text-slate-200 font-medium">On Leave</span>
                </div>
                <span className="font-semibold text-white font-mono">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Distribution (DEPARTMENT MANAGER DASHBOARD SCROLLDOWN 2.png) */}
        <div className="bg-[#151c24] rounded-[24px] p-5 sm:p-6 border border-[#1e2836] shadow-2xl flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Task Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">10 total tasks across department</p>
          </div>
          <div className="px-4 py-1 rounded-full bg-[#3f1c22] text-[#e74c3c] text-xs font-semibold tracking-wider">
            2 overdue
          </div>
        </div>

        {/* Active Task Progress (DEPARTMENT MANAGER DASHBOARD SCROLLDOWN 2.png) */}
        <div className="bg-[#151c24] rounded-[24px] p-6 sm:p-7 border border-[#1e2836] shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1e2836] pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Active Task Progress
            </h2>
            <Link
              href="/manager/tasks"
              className="text-xs sm:text-sm font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors"
            >
              Manage tasks &gt;
            </Link>
          </div>

          {/* Progress Rows */}
          <div className="space-y-4">
            {/* Task 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Migrate Auth Service to OAuth 2.0</span>
                <div className="flex items-center gap-2 font-normal text-slate-400 text-xs">
                  <span>In Progress</span>
                  <span className="font-mono">65%</span>
                </div>
              </div>
              <div className="w-full bg-[#1e2736] h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Task 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>iOS Push Notification Integration</span>
                <div className="flex items-center gap-2 font-normal text-slate-400 text-xs">
                  <span>In Progress</span>
                  <span className="font-mono">40%</span>
                </div>
              </div>
              <div className="w-full bg-[#1e2736] h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Task 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Dashboard Performance Optimization</span>
                <div className="flex items-center gap-2 font-normal text-slate-400 text-xs">
                  <span>In Progress</span>
                  <span className="font-mono">80%</span>
                </div>
              </div>
              <div className="w-full bg-[#1e2736] h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Task 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Onboarding UI Components</span>
                <div className="flex items-center gap-2 font-normal text-slate-400 text-xs">
                  <span>In Progress</span>
                  <span className="font-mono">20%</span>
                </div>
              </div>
              <div className="w-full bg-[#1e2736] h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            {/* Task 5 (Overdue) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Kubernetes Cluster Upgrade</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#e74c3c] font-semibold">Overdue</span>
                  <span className="font-mono text-slate-400 font-normal">100%</span>
                </div>
              </div>
              <div className="w-full bg-[#1e2736] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#e74c3c] h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
