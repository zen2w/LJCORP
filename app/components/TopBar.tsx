'use client';

import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { ShieldCheck, UserCheck, RefreshCw, Mail, X, Send, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';

export function TopBar() {
  const { currentUser, switchRole, messages, resetData, showToast } = useEMS();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');

  const unreadMessages = messages.filter(m => !m.isRead);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    showToast('Reply Sent to Manager', 'Your direct message was delivered to Sarah Jenkins.', 'success');
    setReplySubject('');
    setReplyBody('');
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 text-white px-4 py-2.5 flex items-center justify-between text-xs">
        {/* Left: Branding & Role Status */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm tracking-wide text-blue-400 hover:text-blue-300 transition-colors">
            <Building2 className="w-4 h-4 text-blue-500" />
            <span>LJCORP <span className="text-slate-400 font-normal">EMS</span></span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Active Persona: <strong className="text-white">{currentUser?.name || 'Guest'}</strong> ({currentUser?.role === 'manager' ? 'Dept Manager' : 'Staff'})</span>
          </div>
        </div>

        {/* Right: Actions, Message Drawer Trigger & Quick Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Direct Message Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            title="In-Portal Direct Messages from Manager"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Messages</span>
            {unreadMessages.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                {unreadMessages.length}
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetData}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Mock Seed Data to Default"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Reset Data</span>
          </button>

          {/* Quick Role Toggle Switch */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => switchRole('employee')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser?.role === 'employee'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Employee View</span>
            </button>
            <button
              onClick={() => switchRole('manager')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser?.role === 'manager'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Manager View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out In-Portal Direct Message Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Direct Messages</h3>
                  <p className="text-xs text-slate-400">Notes & communication from Department Head</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-300">{msg.senderName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{msg.senderRole}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-100">{msg.subject}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Send className="w-3 h-3 text-blue-400" />
                <span>Quick Reply to Sarah Jenkins</span>
              </h4>
              <input
                type="text"
                value={replySubject}
                onChange={e => setReplySubject(e.target.value)}
                placeholder="Subject (e.g., Re: Sprint 28 Auth Migration)"
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <textarea
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                placeholder="Type your message here..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-blue-500 resize-none"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
