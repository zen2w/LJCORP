'use client';

import { User, AttendanceRecord, TaskItem, LeaveRequest, Announcement, DirectMessage, LeaveBalance } from './types';
import { INITIAL_USERS, INITIAL_ATTENDANCE, INITIAL_TASKS, INITIAL_LEAVES, INITIAL_ANNOUNCEMENTS, INITIAL_MESSAGES } from './seedData';

const STORAGE_KEYS = {
  USERS: 'ljcorp_ems_users_v1',
  ATTENDANCE: 'ljcorp_ems_attendance_v1',
  TASKS: 'ljcorp_ems_tasks_v1',
  LEAVES: 'ljcorp_ems_leaves_v1',
  ANNOUNCEMENTS: 'ljcorp_ems_announcements_v1',
  MESSAGES: 'ljcorp_ems_messages_v1',
  CURRENT_USER_ID: 'ljcorp_ems_current_user_id_v1',
};

// Helper for safe localStorage access
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('ljcorp_store_updated'));
  } catch (err) {
    console.error(`Failed to write to localStorage for key ${key}:`, err);
  }
}

export const LocalStore = {
  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
      setItem(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      setItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      setItem(STORAGE_KEYS.CURRENT_USER_ID, 'EMP-2026-0891');
    }
  },

  resetSeedData() {
    setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    setItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    setItem(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    setItem(STORAGE_KEYS.CURRENT_USER_ID, 'EMP-2026-0891');
    window.dispatchEvent(new Event('ljcorp_store_updated'));
  },

  // USERS & AUTH
  getUsers(): User[] {
    const stored = getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    // Ensure all INITIAL_USERS exist in stored list
    const merged = [...stored];
    INITIAL_USERS.forEach(initial => {
      const idx = merged.findIndex(u => u.id.toLowerCase() === initial.id.toLowerCase());
      if (idx === -1) {
        merged.push(initial);
      }
    });
    return merged;
  },

  getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'EMP-2026-0891');
    return users.find(u => u.id === currentId) || users[0];
  },

  setCurrentUser(userId: string) {
    setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  },

  activateUser(employeeId: string, email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const cleanId = employeeId.trim();
    const cleanEmail = email.trim().toLowerCase();

    let userIndex = users.findIndex(u => u.id.toLowerCase() === cleanId.toLowerCase());
    
    // If not found in stored users, check INITIAL_USERS
    if (userIndex === -1) {
      const seedUser = INITIAL_USERS.find(u => u.id.toLowerCase() === cleanId.toLowerCase());
      if (seedUser) {
        users.push({ ...seedUser });
        userIndex = users.length - 1;
      } else {
        return {
          success: false,
          message: 'Employee ID not found. Please contact your administrator.'
        };
      }
    }

    const matchedUser = users[userIndex];
    
    // Activate the user and set their desired email & credentials
    matchedUser.email = cleanEmail;
    matchedUser.password = password;
    matchedUser.isActivated = true;
    users[userIndex] = matchedUser;
    setItem(STORAGE_KEYS.USERS, users);

    return {
      success: true,
      message: 'Account successfully activated! Credentials delivered.',
      user: matchedUser
    };
  },

  authenticate(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!user) {
      return {
        success: false,
        message: 'Invalid work email or password. Please try again or contact your manager.'
      };
    }

    this.setCurrentUser(user.id);
    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user
    };
  },

  updateUserProfile(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      setItem(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return users[0];
  },

  // ATTENDANCE & DTR
  getAttendance(): AttendanceRecord[] {
    return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },

  getTodayAttendance(userId: string): AttendanceRecord | undefined {
    const records = this.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    return records.find(r => r.userId === userId && (r.date === todayStr || r.date === '2026-10-06'));
  },

  clockIn(userId: string): AttendanceRecord {
    const records = this.getAttendance();
    const user = this.getUsers().find(u => u.id === userId);
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    let todayRecord = records.find(r => r.userId === userId && r.date === todayStr);

    if (todayRecord) {
      todayRecord.clockIn = timeStr;
      todayRecord.clockOut = null;
      todayRecord.status = 'Present';
      todayRecord.totalHours = 'Working...';
    } else {
      todayRecord = {
        id: `ATT-${Date.now()}`,
        userId,
        userName: user?.name || 'Employee',
        department: user?.department || 'Engineering',
        date: todayStr,
        clockIn: timeStr,
        clockOut: null,
        totalHours: 'Working...',
        status: 'Present',
        shiftSchedule: '08:00 AM - 05:00 PM',
      };
      records.unshift(todayRecord);
    }

    setItem(STORAGE_KEYS.ATTENDANCE, records);
    return todayRecord;
  },

  clockOut(userId: string): AttendanceRecord {
    const records = this.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const todayRecord = records.find(r => r.userId === userId && (r.date === todayStr || r.date === '2026-10-06'));
    if (todayRecord) {
      todayRecord.clockOut = timeStr;
      todayRecord.totalHours = '8.0h';
      setItem(STORAGE_KEYS.ATTENDANCE, records);
      return todayRecord;
    }

    return records[0];
  },

  // TASKS
  getTasks(): TaskItem[] {
    return getItem<TaskItem[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },

  addTask(task: Omit<TaskItem, 'id'>): TaskItem {
    const tasks = this.getTasks();
    const newTask: TaskItem = {
      ...task,
      id: `TASK-${Date.now().toString().slice(-4)}`
    };
    tasks.unshift(newTask);
    setItem(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  },

  updateTask(taskId: string, updates: Partial<TaskItem>): TaskItem | undefined {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      setItem(STORAGE_KEYS.TASKS, tasks);
      return tasks[index];
    }
    return undefined;
  },

  addTaskComment(taskId: string, comment: Omit<TaskItem['comments'][0], 'id'>): TaskItem | undefined {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index].comments.push({
        ...comment,
        id: `COMM-${Date.now()}`
      });
      setItem(STORAGE_KEYS.TASKS, tasks);
      return tasks[index];
    }
    return undefined;
  },

  // LEAVE
  getLeaves(): LeaveRequest[] {
    return getItem<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
  },

  getLeaveBalance(userId: string): LeaveBalance {
    const leaves = this.getLeaves().filter(l => l.userId === userId && l.status === 'Approved');
    let vacationUsed = 0;
    let sickUsed = 0;
    let emergencyUsed = 0;
    let personalUsed = 0;

    leaves.forEach(l => {
      if (l.leaveType === 'Vacation Leave') vacationUsed += l.totalDays;
      if (l.leaveType === 'Sick Leave') sickUsed += l.totalDays;
      if (l.leaveType === 'Emergency Leave') emergencyUsed += l.totalDays;
      if (l.leaveType === 'Personal Leave') personalUsed += l.totalDays;
    });

    return {
      vacation: { used: vacationUsed, total: 15 },
      sick: { used: sickUsed, total: 10 },
      emergency: { used: emergencyUsed, total: 5 },
      personal: { used: personalUsed, total: 5 }
    };
  },

  addLeave(leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>): LeaveRequest {
    const leaves = this.getLeaves();
    const newLeave: LeaveRequest = {
      ...leave,
      id: `LV-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    leaves.unshift(newLeave);
    setItem(STORAGE_KEYS.LEAVES, leaves);
    return newLeave;
  },

  updateLeaveStatus(leaveId: string, status: LeaveRequest['status'], reviewerName?: string, comment?: string): LeaveRequest | undefined {
    const leaves = this.getLeaves();
    const index = leaves.findIndex(l => l.id === leaveId);
    if (index !== -1) {
      leaves[index].status = status;
      if (reviewerName) leaves[index].reviewedBy = reviewerName;
      if (comment) leaves[index].reviewComment = comment;
      setItem(STORAGE_KEYS.LEAVES, leaves);
      return leaves[index];
    }
    return undefined;
  },

  // ANNOUNCEMENTS
  getAnnouncements(): Announcement[] {
    return getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  addAnnouncement(ann: Omit<Announcement, 'id' | 'postedDate'>): Announcement {
    const anns = this.getAnnouncements();
    const newAnn: Announcement = {
      ...ann,
      id: `ANN-${Date.now().toString().slice(-4)}`,
      postedDate: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    anns.unshift(newAnn);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, anns);
    return newAnn;
  },

  updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | undefined {
    const anns = this.getAnnouncements();
    const index = anns.findIndex(a => a.id === id);
    if (index !== -1) {
      anns[index] = { ...anns[index], ...updates };
      setItem(STORAGE_KEYS.ANNOUNCEMENTS, anns);
      return anns[index];
    }
    return undefined;
  },

  deleteAnnouncement(id: string): boolean {
    let anns = this.getAnnouncements();
    anns = anns.filter(a => a.id !== id);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, anns);
    return true;
  },

  // DIRECT MESSAGES
  getMessages(): DirectMessage[] {
    return getItem<DirectMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  },

  sendMessage(msg: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>): DirectMessage {
    const messages = this.getMessages();
    const newMsg: DirectMessage = {
      ...msg,
      id: `MSG-${Date.now().toString().slice(-4)}`,
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      isRead: false
    };
    messages.unshift(newMsg);
    setItem(STORAGE_KEYS.MESSAGES, messages);
    return newMsg;
  },

  markMessageRead(id: string) {
    const messages = this.getMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index].isRead = true;
      setItem(STORAGE_KEYS.MESSAGES, messages);
    }
  }
};
