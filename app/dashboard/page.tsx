'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/Sidebar';
import { useEMS } from '../context/EMSContext';
import {
  Search,
  Clock,
  Calendar,
  CheckSquare,
  Megaphone,
  TrendingUp,
  AlertTriangle,
  LogIn,
  LogOut,
  CalendarPlus,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    todayAttendance,
    liveWorkingSeconds,
    clockIn,
    clockOut,
    showToast,
  } = useEMS();

  const [searchQuery, setSearchQuery] = useState('');

  const isClockedIn = todayAttendance?.status === 'Present' && !todayAttendance?.clockOut;

  const handleLogout = () => {
    showToast('Signed Out', 'You have been safely logged out.', 'info');
    router.push('/login');
  };

  // Format live duration
  const hours = Math.floor(liveWorkingSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((liveWorkingSeconds % 3600) / 60).toString().padStart(2, '0');

  const employeeName = currentUser?.name || 'JONH PAUL FELICIANO';

  return (
    <div className="flex min-h-[calc(100vh-45px)] bg-black text-white selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 lg:p-6 space-y-6 max-w-[1400px]">
        {/* Top Header with Search Pill, Employee Name, and Log Out */}
        <header className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Search Pill Input */}
          <div className="relative w-full max-w-xs sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH"
              className="w-full bg-[#d0d7de] hover:bg-[#e1e6eb] focus:bg-white text-slate-900 placeholder:text-slate-600 font-bold text-xs uppercase tracking-wider pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all"
            />
          </div>

          {/* Right User Indicator & Log Out button */}
          <div className="flex items-center gap-3">
            <Link
              href="/credentials"
              title="Edit Profile & Password"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181d24] hover:bg-[#222933] border border-white/10 transition-all shadow group"
            >
              <div className="w-5 h-5 rounded-full bg-white flex-shrink-0 shadow" />
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-100 uppercase group-hover:text-blue-300 transition-colors">
                {employeeName}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              id="btn-employee-logout"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4a1c22] hover:bg-[#632028] border border-[#ff4d4f]/30 text-[#ff7875] text-xs font-semibold tracking-wide transition-all shadow active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Title & Welcome */}
        <div className="space-y-0.5 pt-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0].toLowerCase() : 'jellyfish'}.
          </p>
        </div>

        {/* Today's Attendance Real-Time Panel (Matching EMPLOYEE DASHBOARD.png & EMPLOYEE DASHBOARD WHEN CLOCK OUT.png) */}
        <div className="bg-[#151c24] rounded-[24px] p-6 sm:p-7 border border-[#1e2836] shadow-2xl space-y-5">
          {/* Panel Top Row: Title & Top Badge */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Today&apos;s Attendance
            </h2>
            {isClockedIn ? (
              <div className="px-5 py-1.5 rounded-full bg-[#163829] border border-[#2ecc71]/40 text-[#2ecc71] font-semibold text-xs tracking-wide">
                Clock In
              </div>
            ) : (
              <div className="px-5 py-1.5 rounded-full bg-[#1e2736] border border-[#60a5fa]/40 text-[#60a5fa] font-semibold text-xs tracking-wide">
                Clock Out
              </div>
            )}
          </div>

          {/* Work Schedule Pill */}
          <div className="bg-[#121922] border border-[#1e2836] rounded-full px-5 py-2 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-slate-200">Work Schedule</span>
            <span className="font-bold text-white tracking-wide">5pm - 6am</span>
          </div>

          {/* 3 Telemetry Columns */}
          <div className="grid grid-cols-3 gap-2 text-center py-2">
            {/* Clock In */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Clock In</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#2ecc71] tracking-tight">
                {todayAttendance?.clockIn || (isClockedIn ? '05:20 PM' : '05:20 PM')}
              </div>
            </div>

            {/* Clock Out */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Clock Out</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#60a5fa] tracking-tight">
                {isClockedIn ? '—' : (todayAttendance?.clockOut || '6:00 AM')}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Duration</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#60a5fa] tracking-tight">
                {isClockedIn ? `${hours}h ${minutes}m` : (todayAttendance?.totalHours || '11h 00m')}
              </div>
            </div>
          </div>

          {/* Large Action Button */}
          <div>
            {isClockedIn ? (
              <button
                onClick={clockOut}
                id="btn-clock-out"
                className="w-full py-3.5 px-6 rounded-xl bg-[#541f23] hover:bg-[#68242a] text-[#ff4d4f] border border-[#ff4d4f]/30 font-bold text-sm tracking-wide shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Clock Out</span>
              </button>
            ) : (
              <button
                onClick={clockIn}
                id="btn-clock-in"
                className="w-full py-3.5 px-6 rounded-xl bg-[#1d4c31] hover:bg-[#235d3c] text-[#2ecc71] border border-[#2ecc71]/40 font-bold text-sm tracking-wide shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Clock In</span>
              </button>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center text-[11px] text-slate-500 font-medium">
            Last updated: just now
          </div>
        </div>

        {/* 4 KPI Cards Grid (2x2) Matching EMPLOYEE DASHBOARD.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Attendance Rate */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#2ecc71] flex items-center justify-center shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#2ecc71]">93.7%</div>
              <div className="text-xs font-semibold text-slate-200">Attendance Rate</div>
              <div className="text-[11px] text-slate-400 pt-1">
                This Month <br />
                <span className="text-[#f39c12] font-medium">+12% vs Last Month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Late Days */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4d3216] text-[#e67e22] flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#e67e22]">3</div>
              <div className="text-xs font-semibold text-slate-200">Late Days</div>
              <div className="text-[11px] text-slate-400 pt-1">
                This Month <br />
                <span className="text-[#e67e22] font-medium">2 more than last month</span>
              </div>
            </div>
          </div>

          {/* Card 3: Leave Balance */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#173a4b] text-[#00b4d8] flex items-center justify-center shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-white">12</div>
              <div className="text-xs font-semibold text-slate-200">Leave Balance</div>
              <div className="text-[11px] text-slate-400 pt-1">
                Days remaining <br />
                <span className="text-slate-400 font-normal">Vacation + Sick combined</span>
              </div>
            </div>
          </div>

          {/* Card 4: Task Due */}
          <div className="bg-[#151c24] rounded-[22px] p-5 sm:p-6 border border-[#1e2836] shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4c1d24] text-[#e74c3c] flex items-center justify-center shadow-inner">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#e74c3c]">4</div>
              <div className="text-xs font-semibold text-slate-200">Task Due</div>
              <div className="text-[11px] text-slate-400 pt-1">
                This Month <br />
                <span className="text-[#e74c3c] font-medium">1 overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS Header & Grid (EMPLOYEE DASHBOARD 2 SCROLLDOWN.png) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-[0.2em] uppercase">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Action 1: Attendance */}
            <Link
              href="/dtr"
              className="p-4 rounded-[20px] bg-[#172230] hover:bg-[#1d2b3d] border border-[#23354a] transition-all flex items-center gap-3.5 group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1e3a5f] text-[#38bdf8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">Attendance</div>
                <div className="text-[10px] text-slate-400">View DTR</div>
              </div>
            </Link>

            {/* Action 2: Leave Request */}
            <Link
              href="/leave"
              className="p-4 rounded-[20px] bg-[#172230] hover:bg-[#1d2b3d] border border-[#23354a] transition-all flex items-center gap-3.5 group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1b4d3e] text-[#2ecc71] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">Leave Request</div>
                <div className="text-[10px] text-slate-400">Submit Request</div>
              </div>
            </Link>

            {/* Action 3: My Tasks */}
            <Link
              href="/tasks"
              className="p-4 rounded-[20px] bg-[#172230] hover:bg-[#1d2b3d] border border-[#23354a] transition-all flex items-center gap-3.5 group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-[#4a3518] text-[#f59e0b] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">My Tasks</div>
                <div className="text-[10px] text-slate-400">View All Task</div>
              </div>
            </Link>

            {/* Action 4: Announcements */}
            <Link
              href="/announcements"
              className="p-4 rounded-[20px] bg-[#172230] hover:bg-[#1d2b3d] border border-[#23354a] transition-all flex items-center gap-3.5 group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-[#173e54] text-[#38bdf8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">Announcements</div>
                <div className="text-[10px] text-slate-400">Read Updates</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Latest Announcements Widget (EMPLOYEE DASHBOARD 2 SCROLLDOWN.png) */}
        <div className="bg-[#151c24] rounded-[24px] p-6 sm:p-7 border border-[#1e2836] shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1e2836] pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Latest Announcements
            </h2>
            <Link
              href="/announcements"
              className="text-xs sm:text-sm font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors"
            >
              All &gt;
            </Link>
          </div>

          <div className="space-y-4">
            {/* Announcement 1 */}
            <div className="flex items-start gap-4 pb-4 border-b border-[#1e2836]/60 last:border-b-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-[#1b3a58] text-[#38bdf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">
                  HR • 1 hour ago
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our annual health benefits enrollment is now open. Employees may review and update their benefit selections until October 15, 2026. Please submit your changes before the deadline.
                </p>
              </div>
            </div>

            {/* Announcement 2 */}
            <div className="flex items-start gap-4 pb-4 border-b border-[#1e2836]/60 last:border-b-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-[#1b3a58] text-[#38bdf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">
                  Facilities • Today
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The office will undergo scheduled maintenance on Saturday, October 3, 2026, from 8:00 AM to 2:00 PM. Some work areas and meeting rooms may be temporarily unavailable.
                </p>
              </div>
            </div>

            {/* Announcement 3 */}
            <div className="flex items-start gap-4 pb-4 border-b border-[#1e2836]/60 last:border-b-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-[#1b3a58] text-[#38bdf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">
                  Management • Yesterday
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The monthly all-hands meeting will take place on Friday, October 2, 2026, at 3:00 PM in the Main Conference Room. Attendance is expected for all employees.
                </p>
              </div>
            </div>

            {/* Announcement 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1b3a58] text-[#38bdf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white">
                  IT Department • 3 days ago
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All employees are required to complete the mandatory Cybersecurity Awareness Training by October 10, 2026. The training link has been sent to your company email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance Widget (EMPLOYEE DASHBOARD 2 SCROLLDOWN.png) */}
        <div className="bg-[#151c24] rounded-[24px] p-6 sm:p-7 border border-[#1e2836] shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1e2836] pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Leave Balance
            </h2>
            <Link
              href="/leave"
              className="text-xs sm:text-sm font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors"
            >
              Details &gt;
            </Link>
          </div>

          <div className="space-y-4">
            {/* Vacation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Vacation</span>
                <span className="font-mono text-slate-300 font-normal"><strong>12</strong>/15 days</span>
              </div>
              <div className="w-full bg-[#1e2736] h-2 rounded-full overflow-hidden">
                <div className="bg-[#3b82f6] h-full rounded-full" style={{ width: `${(12 / 15) * 100}%` }} />
              </div>
            </div>

            {/* Sick */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Sick</span>
                <span className="font-mono text-slate-300 font-normal"><strong>9</strong>/10 days</span>
              </div>
              <div className="w-full bg-[#1e2736] h-2 rounded-full overflow-hidden">
                <div className="bg-[#eab308] h-full rounded-full" style={{ width: `${(9 / 10) * 100}%` }} />
              </div>
            </div>

            {/* Emergency */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Emergency</span>
                <span className="font-mono text-slate-300 font-normal"><strong>3</strong>/5 days</span>
              </div>
              <div className="w-full bg-[#1e2736] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ef4444] h-full rounded-full" style={{ width: `${(3 / 5) * 100}%` }} />
              </div>
            </div>

            {/* Personal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-white">
                <span>Personal</span>
                <span className="font-mono text-slate-300 font-normal"><strong>3</strong>/5 days</span>
              </div>
              <div className="w-full bg-[#1e2736] h-2 rounded-full overflow-hidden">
                <div className="bg-[#64748b] h-full rounded-full" style={{ width: `${(3 / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
