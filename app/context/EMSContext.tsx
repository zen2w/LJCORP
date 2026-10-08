'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AttendanceRecord, TaskItem, LeaveRequest, Announcement, DirectMessage, ToastMessage } from '@/lib/types';
import { LocalStore } from '@/lib/store';

interface EMSContextType {
  currentUser: User | null;
  users: User[];
  attendance: AttendanceRecord[];
  tasks: TaskItem[];
  leaves: LeaveRequest[];
  announcements: Announcement[];
  messages: DirectMessage[];
  todayAttendance?: AttendanceRecord;
  liveWorkingSeconds: number;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  switchRole: (role: 'employee' | 'manager') => void;
  setCurrentUserId: (id: string) => void;
  clockIn: () => void;
  clockOut: () => void;
  resetData: () => void;
  refreshState: () => void;
}

const EMSContext = createContext<EMSContextType | undefined>(undefined);

export function EMSProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [liveWorkingSeconds, setLiveWorkingSeconds] = useState<number>(28800); // 8 hrs base sample

  let toastCounter = 0;

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${++toastCounter}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshState = () => {
    if (typeof window === 'undefined') return;
    LocalStore.init();
    const allUsers = LocalStore.getUsers();
    setUsers(allUsers);
    const active = LocalStore.getCurrentUser();
    setCurrentUser(active);
    setAttendance(LocalStore.getAttendance());
    setTasks(LocalStore.getTasks());
    setLeaves(LocalStore.getLeaves());
    setAnnouncements(LocalStore.getAnnouncements());
    setMessages(LocalStore.getMessages());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshState();
    }, 0);

    const handleUpdate = () => {
      refreshState();
    };

    window.addEventListener('ljcorp_store_updated', handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('ljcorp_store_updated', handleUpdate);
    };
  }, []);

  // Live timer for active shift
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWorkingSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const switchRole = (role: 'employee' | 'manager') => {
    const target = users.find(u => u.role === role);
    if (target) {
      LocalStore.setCurrentUser(target.id);
      setCurrentUser(target);
      showToast(
        `Switched to ${role === 'manager' ? 'Department Manager' : 'Staff Member'} View`,
        `Logged in as ${target.name} (${target.position})`,
        'info'
      );
    }
  };

  const setCurrentUserId = (id: string) => {
    LocalStore.setCurrentUser(id);
    const user = users.find(u => u.id === id);
    if (user) {
      setCurrentUser(user);
    }
  };

  const clockIn = () => {
    if (!currentUser) return;
    LocalStore.clockIn(currentUser.id);
    showToast('Clock In Recorded!', `Shift started at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 'success');
  };

  const clockOut = () => {
    if (!currentUser) return;
    LocalStore.clockOut(currentUser.id);
    showToast('Clock Out Recorded!', `Shift ended at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Great work!`, 'success');
  };

  const resetData = () => {
    LocalStore.resetSeedData();
    refreshState();
    showToast('System State Reset', 'Preloaded seed employees, tasks, attendance & notices restored.', 'info');
  };

  const todayAttendance = currentUser ? LocalStore.getTodayAttendance(currentUser.id) : undefined;

  return (
    <EMSContext.Provider
      value={{
        currentUser,
        users,
        attendance,
        tasks,
        leaves,
        announcements,
        messages,
        todayAttendance,
        liveWorkingSeconds,
        toasts,
        showToast,
        removeToast,
        switchRole,
        setCurrentUserId,
        clockIn,
        clockOut,
        resetData,
        refreshState,
      }}
    >
      {children}
    </EMSContext.Provider>
  );
}

export function useEMS() {
  const context = useContext(EMSContext);
  if (!context) {
    return {
      currentUser: null,
      users: [],
      attendance: [],
      tasks: [],
      leaves: [],
      announcements: [],
      messages: [],
      todayAttendance: undefined,
      liveWorkingSeconds: 28800,
      toasts: [],
      showToast: () => {},
      removeToast: () => {},
      switchRole: () => {},
      setCurrentUserId: () => {},
      clockIn: () => {},
      clockOut: () => {},
      resetData: () => {},
      refreshState: () => {},
    };
  }
  return context;
}
