# Ljcorp Employee Portal

**System Documentation & User Manual** • Version 1.0
**Prepared By:** Jonh Paul Feliciano

---

## 1. System Overview

The Ljcorp Employee Portal is a comprehensive, web-based centralized workspace designed to help employees manage their daily work activities and provide Department Managers with complete visibility over team operations. The system modernizes routine HR tasks including attendance tracking, task delegation, leave requests, and company-wide communications.

**Primary Objectives:**

- Provide a secure workspace for employees.
- Simplify daily attendance (DTR) and leave management.
- Organize and monitor departmental task assignments.

---

## 2. Screen Inventory

| # | Module / Screen | Purpose & Functionality |
|---|-----------------|-------------------------|
| 1 | Activate Account | First-time onboarding. Requires Employee ID and registered email. Validates against company records before activation. |
| 2 | Login & Recovery | Secure entry point using work email and password. Includes a Forgot Password workflow for email-based reset links. |
| 3 | Employee Dashboard | Central hub showing attendance status (Clock In/Out), summary statistics, latest announcements, and leave balances. |
| 4 | DTR (Time Record) | Tracks daily work duration, late arrivals, on-time streaks, and absent days. Includes a searchable "View Full Record" ledger. |
| 5 | Task Page | Lists assigned duties with priority tags and due dates. Includes a Task Details page for file attachments and comments. |
| 6 | Leave Request | Displays balances across leave types. Features a submission form requiring dates and reasons, plus a historical status view. |
| 7 | Announcements | Global and departmental notices filtered by All, News, and Activities. |
| 8 | Settings | Profile management, password updates, and avatar uploads. |
| 9 | Manager Dashboard | Department overview of present staff, leave requests, and task progress. Features a newly integrated "View Attendance Record" button. |

---

## 3. Employee Authentication & Account Setup

Access to the portal is strictly governed by pre-registered HR data. An employee cannot create an account from scratch; they must activate an existing profile provisioned by the company.

### Account Activation

New hires visit the **Activate Your Account** page. They must enter their exact Employee ID, Full Name, Work Email, and define a new password. The system checks the database for a matching ID and Email combination. If a mismatch occurs, the system rejects the activation with the prompt: *"Employee ID not found. Please contact your administrator."*

### Authentication & Recovery

Standard access uses the Work Email and Password. A failed attempt yields a generic rejection message to prevent credential fishing. If a user forgets their password, the Forgot Password workflow emails a secure, time-sensitive reset link to their registered work address.

---

## 4. The Employee Dashboard

The dashboard acts as the primary telemetry screen for the employee's workday. It dynamically alters its available actions based on the user's current working status.

### Dynamic Attendance Panel

If a shift hasn't started, the system displays a large **Clock In** button. Once active, the interface switches to **Clock Out** and tracks duration.

### Quick Actions & Summaries

Dedicated shortcuts for DTR, Leave, Tasks, and Announcements. Displays an immediate breakdown of remaining leave credits (Vacation, Sick, etc.).

---

## 5. Daily Time Record (DTR) Module

The DTR module provides absolute transparency into an employee's punctuality and attendance history. It features two primary views:

- **Today's Attendance:** Shows the current day's Clock In/Out times, calculated work duration, and scheduled shift hours.
- **Performance Metrics:** Summary cards tracking the monthly Attendance Rate (%), accumulated Late Days against policy limits, Absent Days, and the current On-Time Streak.
- **View Full Record:** A comprehensive ledger allowing employees to filter past attendance by month, year, and specific statuses (`Present`, `On Leave`, `Late`, etc.).

---

## 6. Task Management (Employee View)

The Task Management module ensures employees maintain visibility over their responsibilities. Tasks are assigned by Department Managers and categorized by Priority (Low, Medium, High, Critical).

### Task Details & Submission

Clicking **View** on any task opens the details workspace. This interface includes:

- **Core Details:** Assigned department, exact deadline, and the full task description.
- **Discussion Thread:** A comment section allowing the employee to communicate directly with the assigning department for clarifications.
- **Deliverable Upload:** A file attachment zone where the employee can upload completed work (e.g., PDFs, documents) before clicking **Submit Task**.

---

## 7. Leave Request Management

The Leave Request dashboard combines current balances with historical application data to streamline time-off requests.

| Leave Type | Tracking Method |
|------------|-----------------|
| Vacation / Annual | Deducted from yearly quota. |
| Sick Leave | Tracked against health credits. |
| Emergency | Special allocation limit. |
| Personal | General time-off tracking. |

**Form Requirements:** Employees select the Leave Type, set Start/End dates, and provide a mandatory text reason. A file upload option is provided for necessary documentation (e.g., medical certificates for Sick Leave).

> **Validation Logic:** The system strictly enforces logical date sequencing (Start Date cannot be after End Date). All required fields must be populated, and requests immediately enter a **Pending** status on the historical ledger until a Manager reviews them.

---

## 8. Announcements & Settings

- **Announcements:** A chronologically sorted feed of company updates. Employees can filter notices by categories (All, News, Activities). Clicking an announcement opens a distraction-free reading pane for detailed instructions or policy updates.
- **Account Settings:** Employees retain control over their personal data. They can update their residential address, contact number, emergency details, and profile picture. Security settings allow for password updates directly from this page.

---

## 9. Department Manager Portal

The Department Manager (DM) interface provides elevated privileges for overseeing department operations. Managers utilize this space to assign tasks, approve leave, broadcast notices, and monitor daily attendance.

### The DM Dashboard

The dashboard is tailored for departmental oversight. It includes KPI summary cards detailing total headcount, active leave requests, and pending tasks.

> **UI Update Note:** The Search Bar previously located on the DM Dashboard has been intentionally removed. In its place, a dedicated **"View Attendance Record"** button has been added. This allows managers immediate, one-click access to the full attendance ledger for their entire team without needing to navigate through secondary menus.

Additional dashboard features include an **Active Task Progress** panel, which utilizes visual progress bars to track ongoing projects across the department, and a live **Today's Attendance** breakdown.

### Employee Management Directory

Managers have access to a searchable, filterable directory of all personnel within their department. The directory lists names, contact info, roles, and current task assignments.

- **View Profile:** Opens a quick-reference card showing the employee's join date and core details.
- **Edit Profile:** Allows the manager to administratively update an employee's job title, email, or contact number.
- **Direct Messaging:** A built-in communication tool. Clicking the speech bubble icon opens a modal to send a subject-based message directly to the employee.

---

## 10. Manager Task Delegation

The Task Management page is the control center for departmental workload.

| Action | Details & Workflow |
|--------|--------------------|
| Create Task | Managers define the Task Name, select an Assignee from a dropdown, set a strict Deadline, estimate hours required, and set Priority. Attachments can be appended to provide instructions. |
| Track & Filter | The main board filters tasks by Assignee, Status (Pending, In Progress, Overdue, Completed), or Priority. |
| Update Progress | Managers can manually override or update a task's progress utilizing a 0-100% slider, ensuring reports accurately reflect reality even if the employee forgets to update it. |

---

## 11. Leave Request Approvals (DM Side)

The Leave Request queue allows managers to efficiently process employee time-off applications to maintain operational coverage.

The interface groups requests into tabs: **Pending Review**, **Approved**, and **Rejected**. Managers can quickly scan the table to see the employee name, exact date range, total days requested, and a preview of the submitted reason.

### Quick Actions

Inline ✓ (Approve) and ✕ (Reject) icons allow rapid processing of standard requests directly from the main list view.

### Detailed Review

Clicking the 'Eye' icon opens the full request details, showing attached medical certificates or extended reasons before making a final decision.

---

## 12. Departmental Announcements

Managers hold publishing rights to broadcast news directly to their team's dashboard feeds. This centralized communication method replaces easily lost mass-emails.

- **Creation Workflow:** Managers define a Title, draft the Message, select a Priority level, and set the Status to either **Draft** (for later review) or publish it immediately.
- **Management Console:** The Announcements table tracks all published and drafted notices. Managers can use quick action icons to edit typos, instantly publish a saved draft, or delete obsolete announcements from the system.

---

## 13. Roles & Access Levels

- **Staff Member (Employee):** Restricted to viewing and modifying personal data. Authorized capabilities include updating profile details, tracking individual Daily Time Records (DTR), submitting time-off applications, receiving task assignments, and reading corporate bulletins.
- **Department Head (Manager):** Granted oversight exclusively for their assigned department. Capabilities include monitoring subordinate attendance, reviewing and processing leave requests, delegating projects, and publishing department-wide notices.

---

## 14. Proposed System Architecture & API Endpoints

The following outlines the suggested data structures and API routes required to support the managerial workflows and overall system architecture.

| Core Module | Suggested Data Fields & Endpoint Examples |
|-------------|-------------------------------------------|
| Project Tracking | `assigned_subordinate`, `progress_metric`, `task_priority`, `department_tag` |
| Attendance Logs | `GET /manager/team-roster`<br>`GET /manager/attendance/{id}`<br>`POST /manager/attendance/correction`<br>`GET /manager/attendance/export` |
| Task Delegation | `GET /manager/projects`<br>`POST /manager/projects/new`<br>`PATCH /manager/projects/{id}/update` |
| Leave Approvals | `GET /manager/leave-requests?filter=pending`<br>`POST /manager/leave/{id}/authorize`<br>`POST /manager/leave/{id}/deny` |
| Corporate Notices | `GET /manager/bulletins`<br>`POST /manager/bulletins/draft`<br>`PATCH /manager/bulletins/{id}/modify`<br>`DELETE /manager/bulletins/{id}` |

---

## 15. Outstanding System Requirements & Clarifications

- **Account Initialization:** Discrepancies exist between the activation UI and the functional feature list regarding the required input fields and the method for distributing default passwords.
- **Authentication Credentials:** The primary login key needs standardization to resolve conflicts across the documentation (e.g., finalizing the choice between Employee ID, corporate email, or a custom username).
- **Messaging Routing:** The manager's direct message function requires technical clarification regarding whether it utilizes an internal portal inbox built into the dashboard or routes directly to the employee's external corporate email.
- **Scope of Managerial Access:** Mockups occasionally indicate broad, organization-wide department data; strict boundaries must be codified so managers only access data relevant to their direct subordinates.
- **Attendance Adjustments:** The audit trail process for manual time record adjustments by managers requires a defined, transparent workflow.
- **Task Finalization:** A definitive system rule is required to determine whether an employee sliding progress to 100% automatically marks a task as completed, or if explicit manager sign-off is mandated.

---

## 16. System Development Lifecycle (SDLC) Phases

This implementation sequence prioritizes backend stability and core security before layering on managerial tools and cross-functional features.

| Stage | Implementation Focus |
|-------|----------------------|
| Stage 1 | **Architectural Foundation:** Database design, primary repository setup, core layout wireframing, and role-based access control (RBAC) routing. |
| Stage 2 | **Identity & Access Management:** Account registration logic, secure credential authentication, session persistence, and password recovery mechanisms. |
| Stage 3 | **Employee Hub & Profiles:** User settings interfaces, personal data management, and profile picture upload capabilities. |
| Stage 4 | **Timekeeping & Attendance Logistics:** Daily Time Record (DTR) mechanics, shift clock-in/out logic, and the manager's live attendance monitoring roster. |
| Stage 5 | **Leave Processing Pipeline:** Time-off application forms, dynamic leave balance calculations, and the manager's approval/rejection queue. |
| Stage 6 | **Task & Project Delegation:** The manager's task creation suite integrated with the employee's assignment viewer and progress update sliders. |
| Stage 7 | **Corporate Broadcasting:** Department-wide announcement drafting and publishing tools for managers, linked to the employee notification feed. |
| Stage 8 | **Dashboard Aggregation & Widgets:** Finalizing summary cards, rapid-action shortcuts, system alerts, and deploying the manager's updated "View Attendance Record" interface. |
| Stage 9 | **System Optimization & QA:** Comprehensive edge-case testing, mobile responsiveness checks, file upload constraint validation, and final error-state polishing. |

---

## 17. Security & Usage Guidelines

- Active sessions must be explicitly terminated by users via the logout function to prevent unauthorized access, particularly on shared corporate devices.
- Authentication credentials, verification codes, and reset links are strictly confidential and must never be distributed.
- Uploaded files (e.g., medical certificates for sick leave, or project assets attached to tasks) must strictly adhere to the predefined size and format restrictions programmed into the system.
- Backend Role-Based Access Control (RBAC) must rigidly block standard employees from accessing URL endpoints reserved for department managers or Human Resources personnel.
