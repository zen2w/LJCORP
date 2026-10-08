'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/Sidebar';
import { useEMS } from '../../context/EMSContext';
import {
  ArrowLeft,
  Search,
} from 'lucide-react';

export default function ManagerAttendancePage() {
  const { attendance, showToast } = useEMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRecords = attendance.filter(rec => {
    const matchesSearch =
      rec.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-[calc(100vh-45px)] bg-[#0c0e12] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="px-8 py-4 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Link
              href="/manager/dashboard"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Department Attendance Record</h1>
              <p className="text-xs text-slate-400">Live timekeeping and Daily Time Record (DTR) for Engineering Team</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Attendance Ledger Exported', 'CSV report generated for HR audit.', 'info')}
              className="px-4 py-1.5 rounded-full bg-[#35485e] hover:bg-[#435973] text-xs font-semibold text-slate-100 transition-colors"
            >
              Export Report (CSV)
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 lg:p-10 space-y-6 max-w-7xl w-full">
          {/* Filter & Search Controls */}
          <div className="bg-[#141922] rounded-2xl p-4 border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by employee name or ID..."
                className="w-full bg-[#1e232c] border border-white/10 rounded-full pl-9 pr-4 py-2 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['ALL', 'Present', 'Late', 'Absent', 'On Leave', 'Half-Day'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1e232c] text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-[#141922] rounded-2xl border border-white/[0.06] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#191f2b] text-slate-400 font-semibold border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3.5 px-6">Employee</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Clock In</th>
                    <th className="py-3.5 px-4">Clock Out</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Schedule</th>
                    <th className="py-3.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredRecords.map(record => {
                    let badgeClass = 'bg-[#2ecc71]/20 text-[#2ecc71] border-[#2ecc71]/40';
                    if (record.status === 'Late') badgeClass = 'bg-[#f39c12]/20 text-[#f39c12] border-[#f39c12]/40';
                    if (record.status === 'Absent') badgeClass = 'bg-[#e74c3c]/20 text-[#e74c3c] border-[#e74c3c]/40';
                    if (record.status === 'On Leave') badgeClass = 'bg-[#3498db]/20 text-[#3498db] border-[#3498db]/40';
                    if (record.status === 'Half-Day') badgeClass = 'bg-purple-500/20 text-purple-300 border-purple-500/40';

                    return (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-sm">{record.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{record.userId} • {record.department}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-300">{record.date}</td>
                        <td className="py-4 px-4 font-mono text-slate-200">{record.clockIn || '—'}</td>
                        <td className="py-4 px-4 font-mono text-slate-200">{record.clockOut || 'Not Yet'}</td>
                        <td className="py-4 px-4 font-mono font-semibold text-slate-100">{record.totalHours}</td>
                        <td className="py-4 px-4 text-slate-400 text-[11px]">{record.shiftSchedule}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
