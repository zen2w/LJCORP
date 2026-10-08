export type UserRole = 'employee' | 'manager';

export type UserStatus = 'Active' | 'On Leave' | 'Inactive';

export interface User {
  id: string;              // e.g. "EMP-2026-0891"
  name: string;            // e.g. "Jonh Paul Feliciano"
  email: string;           // e.g. "jonhpaul.feliciano@ljcorp.com"
  password: string;
  role: UserRole;
  department: string;      // e.g. "Engineering"
  position: string;        // e.g. "Frontend Developer"
  phone: string;
  address: string;
  emergencyContact: string;
  status: UserStatus;
  avatarUrl: string;
  joinDate: string;        // e.g. "2024-03-15"
  isActivated: boolean;
  currentTaskId?: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Half-Day';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  department: string;
  date: string;            // YYYY-MM-DD
  clockIn: string | null;  // e.g. "08:02 AM"
  clockOut: string | null; // e.g. "05:05 PM" or null / "Not Yet"
  totalHours: string;      // e.g. "8.0h"
  status: AttendanceStatus;
  shiftSchedule: string;   // e.g. "08:00 AM - 05:00 PM"
  durationSeconds?: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed / Pending Sign-Off' | 'Completed' | 'Overdue';

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedToId: string;
  assignedToName: string;
  assignedToAvatar: string;
  department: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;        // 0 to 100
  dueDate: string;         // YYYY-MM-DD
  estimatedHours: number;
  submittedFile?: {
    name: string;
    size: string;
    date: string;
  };
  comments: TaskComment[];
}

export type LeaveType = 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Personal Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Declined';

export interface LeaveBalance {
  vacation: { used: number; total: number };
  sick: { used: number; total: number };
  emergency: { used: number; total: number };
  personal: { used: number; total: number };
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentName?: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export type AnnouncementCategory = 'News' | 'Activities' | 'General';
export type AnnouncementPriority = 'Low' | 'Medium' | 'High';
export type AnnouncementStatus = 'Published' | 'Draft';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  authorName: string;
  authorRole: string;
  postedDate: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  recipientId: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  replyText?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
