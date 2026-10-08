# UI Screen-by-Screen Master Implementation Plan: Ljcorp Employee Portal

**Derived from:** [Employee_Management_System_Combined_Documentation.md](file:///c:/Users/COMPUTER%20CENTER/Pictures/ljcorp/my-app/Employee_Management_System_Combined_Documentation.md)  
**Refined via:** [Grill-Me Skill](file:///c:/Users/COMPUTER%20CENTER/Pictures/ljcorp/my-app/.agent/skills/frontend-design/grill-me/skill.md)

---

## 🖥️ Screen-by-Screen Phased Implementation Plan

### 🔹 Phase 0: Foundation, Design Tokens & LocalStorage Store
- **Key Deliverables**:
  - Install `lucide-react`.
  - Configure Tailwind CSS v4 design tokens in `app/globals.css` (Ljcorp Deep Navy `#1E40AF`, Slate `#0F172A`, Emerald `#10B981`, Amber `#F59E0B`, Rose `#F43F5E`).
  - Build `src/lib/store.ts` with TypeScript interfaces and pre-populated seed data for Employee (*Jonh Paul Feliciano*), Manager (*Sarah Jenkins*), colleagues, attendance records, tasks, leaves, and announcements.
  - Create the Global TopBar with **1-click Role Switcher** and **In-Portal Direct Message Drawer**.

---

### 🔹 Phase 1: Screen 1 – Activate Account (`/activate`)
- **Purpose**: First-time onboarding for newly provisioned personnel.
- **UI Components**:
  - Employee ID, Full Name, Work Email, Password, and Confirm Password fields.
  - Ljcorp corporate branding card with animated submit button.
- **Validation & Business Logic**:
  - Validates that `Employee ID` exists in records and matches `Work Email`.
  - **Exact Error on mismatch**: *"Employee ID not found. Please contact your administrator."*
  - Checks password strength and confirmation match.
- **Success Action**: Activates profile status, shows success toast, and redirects to `/login`.

---

### 🔹 Phase 2: Screen 2 – Login & Forgot Password (`/login`, `/forgot-password`)
- **Purpose**: Secure portal authentication and password recovery workflow.
- **UI Components**:
  - Work Email and Password input fields with show/hide password toggle.
  - **Quick-Fill Demo Credentials**: 1-click buttons for *Jonh Paul (Employee)* and *Sarah (Manager)*.
  - Forgot Password form with email verification and simulated reset link modal.
- **Validation & Business Logic**:
  - Generic error banner on incorrect email/password to prevent credential fishing.
  - Simulated password reset flow allowing instant password reset.
- **Success Action**: Authenticates session and routes to role-specific dashboard.

---

### 🔹 Phase 3: Screen 3 – Employee Dashboard (`/dashboard`)
- **Purpose**: Daily employee telemetry, live shift timekeeping, and quick actions.
- **UI Components**:
  - **Today's Attendance Panel**: Dynamic **Clock In / Clock Out** button with live duration timer (`08h 15m 32s`), shift schedule (`08:00 AM - 05:00 PM`), and status indicator.
  - **4 Summary KPI Cards**: Monthly Attendance Rate %, Late Records (vs allowable limit e.g. 2/3), Remaining Leave Balance, Outstanding Tasks count.
  - **Quick Actions Bar**: Shortcuts to DTR, Leave Request, My Tasks, Announcements.
  - **Latest Announcements Widget**: Categorized preview snippets with "View All" link.
  - **Leave Balance Widget**: Breakdown bars for Vacation, Sick, Emergency, Personal leave.
- **Interactions**: Clicking Clock In/Out updates live attendance record and summary statistics in real time.

---

### 🔹 Phase 4: Screen 4 – Daily Time Record (DTR) & History (`/dtr`)
- **Purpose**: Punctuality transparency, shift logging, and full attendance history.
- **UI Components**:
  - **Today's Attendance Summary**: Current status, Clock In/Out timestamps, total hours.
  - **Performance Cards**: Attendance %, Late Records, Absent Days, On-Time Streak (🔥).
  - **View Full Record Ledger**: Searchable table with Date, Month, Year filters and Status badges (`Present`, `Late`, `Absent`, `On Leave`, `Half-Day`).
- **Interactions**: Instant table filtering and pagination.

---

### 🔹 Phase 5: Screen 5 – Task Management Workspace (`/tasks`)
- **Purpose**: Employee assignment tracking, deliverable submissions, and manager discussion.
- **UI Components**:
  - **Task Table/Cards**: Priority pills (`Low`, `Medium`, `High`, `Critical`), Due Date, Department, Status (`Pending`, `In Progress`, `Completed / Pending Sign-Off`, `Completed`, `Overdue`).
  - **Filter Bar**: Priority and Date filters.
  - **Task Details Modal**: Full description, requirements, assigned department instructions.
  - **Deliverable Upload**: File attachment dropzone for completed work (PDF/docs).
  - **Submission Action**: Marks task as `Completed / Pending Sign-Off`.
  - **Threaded Comments Modal**: Real-time conversation thread with department manager.

---

### 🔹 Phase 6: Screen 6 – Leave Request Dashboard (`/leave`)
- **Purpose**: Leave quota management and time-off application submissions.
- **UI Components**:
  - **Quota Cards**: Vacation Leave, Sick Leave, Emergency Leave, Personal Leave remaining days.
  - **Request History Table**: Status badges (`Pending`, `Approved`, `Declined`), applied dates, duration, reason.
  - **+ Add Leave Modal**: Leave type dropdown, Start/End date pickers with logical validation (`Start Date <= End Date`), Reason textarea, File attachment upload for medical certificates.
- **Validation**: Rejects invalid date ranges and negative quotas; places request into `Pending` status.

---

### 🔹 Phase 7: Screen 7 – Announcements Feed & Reader (`/announcements`)
- **Purpose**: Company and departmental communications.
- **UI Components**:
  - **Category Tabs**: `All`, `News`, `Activities`.
  - **Announcement Feed**: Chronological cards with title, timestamp, author, and snippet.
  - **Distraction-Free Reader Modal**: Full message view with category tag and Close (X) button.

---

### 🔹 Phase 8: Screen 8 – Account Settings & Avatar (`/settings`)
- **Purpose**: Employee profile customization and account security.
- **UI Components**:
  - **Profile Information**: Editable contact number, residential address, emergency contact.
  - **Avatar Uploader**: Image picker with instant preview.
  - **Security Section**: Current Password, New Password, Confirm Password with validation.
- **Feedback**: Toast notification confirming saved updates.

---

### 🔹 Phase 9: Screen 9 – Department Manager Dashboard (`/manager/dashboard`)
- **Purpose**: High-level departmental operations and team attendance overview.
- **UI Components**:
  - **Department Header**: Department name (*Engineering*), active date.
  - **"View Attendance Record" Button**: Dedicated header action opening team attendance ledger (replaces top search bar).
  - **4 Department KPI Cards**: Pending Leave Approvals %, Staff Present Today (e.g. 24/28), Total Headcount, Pending/Overdue Tasks.
  - **Live Attendance Breakdown**: Chart and counts of `Present`, `Late`, `Absent`, `On Leave`.
  - **Active Task Progress Panel**: Project progress bars (0-100%) with link to tasks.

---

### 🔹 Phase 10: Screen 10 – Team Attendance Ledger (`/manager/attendance`)
- **Purpose**: Comprehensive team timekeeping and manager attendance adjustments.
- **UI Components**:
  - Department roster attendance table (Staff Name, ID, Date, Clock In, Clock Out, Total Hours, Status).
  - Search bar and date/status filters.
  - **Audit Adjustment Tool**: Manager can adjust attendance with recorded reason and timestamp.

---

### 🔹 Phase 11: Screen 11 – Employee Management Directory (`/manager/employees`)
- **Purpose**: Department staff directory and employee communications.
- **UI Components**:
  - Summary cards: Active, On Leave, Inactive counts.
  - Search by Name/ID/Email and Position filter.
  - Employee Table with 3 Action Icons:
    - 👁️ **View Profile Modal**: Complete staff dossier and join date.
    - ✏️ **Edit Profile Modal**: Modify role, email, phone, and status.
    - 💬 **Direct Message Modal**: Sends internal message to employee's portal drawer.

---

### 🔹 Phase 12: Screen 12 – Manager Task Delegation Hub (`/manager/tasks`)
- **Purpose**: Task assignment, workload monitoring, and progress override.
- **UI Components**:
  - Workload metrics: Completed, Pending, In Progress, Overdue.
  - **+ Create Task Modal**: Title, Assignee dropdown, Deadline, Estimated Hours, Priority, Description, File Attachments.
  - **✏️ Progress Override Modal**: Interactive 0-100% slider to adjust team progress and grant final completion sign-off.

---

### 🔹 Phase 13: Screen 13 – Leave Approval Pipeline (`/manager/leaves`)
- **Purpose**: Multi-tab leave request review and processing.
- **UI Components**:
  - Tabbed Queue: `Pending Review`, `Approved`, `Rejected`.
  - Quick Action Buttons: Inline Approve (✓) and Reject (✕).
  - 👁️ **View Details Modal**: Full reason, applied date, attached medical certificate preview, and Approve / Reject buttons.

---

### 🔹 Phase 14: Screen 14 – Announcement Studio (`/manager/announcements`)
- **Purpose**: Department broadcast authoring and lifecycle management.
- **UI Components**:
  - Summary cards: Total Announcements, Published, Drafts.
  - **+ New Announcement Modal**: Title, Message, Priority, Status (`Draft` vs `Published`).
  - Action Tools: Publish Draft (✈️), Edit (✏️), Delete (🗑️).

---

### 🔹 Phase 15: Cross-Screen Integration, Mobile QA & Polish
- **Key Deliverables**:
  - Comprehensive end-to-end testing across all 14 screens.
  - Responsive mobile and desktop layout verification.
  - Rich micro-animations, glassmorphic styling, and feedback toasts for all user actions.
