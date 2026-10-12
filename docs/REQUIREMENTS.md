# OpenTask — System Requirements Specification

## 1. Project Overview
**OpenTask** is an open-source, full-stack task management web application created for an Open Source Software (OSS) Lab mini project. It provides an intuitive, responsive interface for organizing, prioritizing, and tracking tasks backed by a persistent relational database.

---

## 2. Functional Requirements (FR)

### FR-1: Dashboard & Metrics
- **FR-1.1**: The system shall calculate and display total task count.
- **FR-1.2**: The system shall compute real-time counts for tasks by status: *Pending*, *In Progress*, and *Completed*.
- **FR-1.3**: The system shall calculate overall project completion percentage and present a visual progress indicator.
- **FR-1.4**: Users shall be able to click summary cards to quickly filter the task list by that status.

### FR-2: Task Management (CRUD)
- **FR-2.1 Create**: Users shall be able to create new tasks with a required title, optional description, priority (*Low*, *Medium*, *High*), status (*Pending*, *In Progress*, *Completed*), and optional due date.
- **FR-2.2 Read**: The system shall retrieve and display all tasks with clear badges, identifiers, and formatted due dates.
- **FR-2.3 Read Single**: Users shall be able to view an individual task's details in a dedicated view modal displaying all fields and timestamps.
- **FR-2.4 Update**: Users shall be able to edit all task attributes. The system shall update the `updated_at` timestamp.
- **FR-2.5 Delete**: Users shall be able to delete a task. Deletion must require explicit user confirmation to prevent accidental data loss.
- **FR-2.6 Quick Status Cycling**: Users shall be able to advance a task's status directly from the card.

### FR-3: Search and Filtering
- **FR-3.1 Title Search**: Users shall be able to perform case-insensitive substring searches across task titles.
- **FR-3.2 Status Filter**: Users shall be able to filter tasks by status (*All*, *Pending*, *In Progress*, *Completed*).
- **FR-3.3 Priority Filter**: Users shall be able to filter tasks by priority (*All*, *Low*, *Medium*, *High*).
- **FR-3.4 Combined Filtering**: The system shall combine search keywords and filter dropdowns simultaneously using logical AND.
- **FR-3.5 Clear Filters**: A one-click reset action shall restore the full task list.

### FR-4: Validation and Feedback
- **FR-4.1 Title Validation**: Empty or whitespace-only titles must be rejected by both frontend and backend (HTTP 400).
- **FR-4.2 Enum Validation**: Priority and status values must match predefined allowed values.
- **FR-4.3 Loading States**: The user interface shall display spinners and loading indicators during asynchronous operations.
- **FR-4.4 User Feedback**: Successful actions and server errors shall be communicated via toast notifications.

### FR-5: Data Persistence & Seeding
- **FR-5.1 SQLite Source of Truth**: All tasks must persist in an SQLite database. Refreshing the browser or restarting the backend must preserve data.
- **FR-5.2 Idempotent Seeding**: A safe demo data seeding script must populate initial sample tasks when the database is empty without creating duplicates on repeated server starts.

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Responsiveness
- API endpoints shall respond in under 50ms under local development load.
- Frontend builds shall be optimized and bundled with Vite (< 200 KB gzipped).

### NFR-2: Security
- Parameterized SQL queries must be strictly enforced to eliminate SQL Injection (SQLi) vulnerabilities.
- Backend error responses must return sanitized user-friendly messages without leaking stack traces or internal paths.
- No secrets, tokens, or live production credentials shall exist in version control.

### NFR-3: Usability & Accessibility
- Accessible contrast ratios conforming to WCAG AA guidelines.
- Keyboard navigation support including `Esc` key handling for modal closing.
- Semantic HTML tags (`<header>`, `<main>`, `<section>`, `<article>`, `<button>`).

### NFR-4: Portability & Cross-Platform Support
- Fully functional on Windows, Linux, and macOS.
- Compatible with Node.js LTS (Node.js 20 and Node.js 24).
- Zero required native C++ compilers on Windows due to Node.js built-in `node:sqlite`.

---

## 4. Hardware & Software Requirements

| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Operating System** | Windows 10/11, macOS 12+, Ubuntu 22.04+ | Windows 11 / Ubuntu 24.04 |
| **RAM** | 4 GB | 8 GB or higher |
| **Disk Space** | 500 MB free space | 1 GB free space |
| **Node.js** | v20.0.0+ | v24.18.0+ |
| **npm** | v10.0.0+ | v11.16.0+ |
| **Git** | v2.30.0+ | v2.55.0+ |
| **Browser** | Chromium 100+, Firefox 100+, Safari 15+ | Latest Chrome, Edge, or Firefox |
