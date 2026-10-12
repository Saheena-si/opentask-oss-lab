# OpenTask — User Guide

Welcome to the **OpenTask** user guide! This document explains how to use all features of the OpenTask management dashboard.

---

## 1. Dashboard Overview

The top of the screen displays your project dashboard:

- **Overall Progress Bar**: Shows the percentage of tasks marked *Completed*.
- **Summary Cards**:
  - **Total Tasks**: Count of all tasks currently in the database.
  - **Pending**: Tasks awaiting action.
  - **In Progress**: Tasks actively being worked on.
  - **Completed**: Tasks finished and verified.

> **Tip**: Click on any summary card (e.g. *Pending*) to instantly filter the task list below to only show tasks with that status!

---

## 2. Managing Tasks

### Creating a New Task
1. Click the **➕ New Task** button in the top navigation bar.
2. In the modal dialog that appears:
   - **Task Title**: Enter a clear title (Required, maximum 200 characters).
   - **Description**: Add contextual notes, instructions, or links (Optional).
   - **Priority**: Choose *Low*, *Medium*, or *High*.
   - **Status**: Choose *Pending*, *In Progress*, or *Completed*.
   - **Due Date**: Pick an optional deadline date.
3. Click **Create Task**. A green toast notification confirms creation, and the new card appears at the top of your list.

### Viewing Full Task Details
1. Click the task title or the **👁️ Details** button on any task card.
2. The modal displays:
   - Task ID
   - Full description
   - Priority and Status badges
   - Due date (with an *Overdue* badge if past due)
   - Created and Last Updated timestamps
3. From this modal, you can choose to directly edit or delete the task.

### Editing an Existing Task
1. Click the **✏️ Edit** button on any task card (or inside the details modal).
2. Modify the title, description, priority, status, or due date.
3. Click **Save Changes**. The card and dashboard metrics will update immediately.

### Quick Status Cycling
- Each task card displays a clickable status badge in its upper right corner.
- Click the status badge to cycle quickly through the workflow:
  `Pending ➔ In Progress ➔ Completed ➔ Pending`

### Deleting a Task
1. Click the **🗑️ Delete** button on any task card.
2. A safety confirmation dialog appears displaying the task title:
   > *"Are you sure you want to permanently delete task #X ("...")? This action cannot be reversed."*
3. Click **Delete Task** to confirm deletion, or **Keep Task** to cancel.

---

## 3. Search and Filtering

### Searching by Title
- Type any keyword into the search bar at the top of the task list.
- Matching tasks are filtered dynamically.
- Click the **✕** button inside the search bar to clear your search query.

### Filtering by Status
- Select *All Statuses*, *Pending*, *In Progress*, or *Completed* from the Status dropdown.

### Filtering by Priority
- Select *All Priorities*, *High*, *Medium*, or *Low* from the Priority dropdown.

### Combining Filters
- You can combine search and multiple filters simultaneously (e.g. searching for `"API"` with status `"In Progress"` and priority `"High"`).
- When any filter or search is active, a **🔄 Reset Filters** button appears. Click it to clear all filters with a single click.

---

## 4. Understanding Error and Alert Messages

- **Input Validation Alert**: If you submit the form without a title, a warning alert highlights the required input field.
- **Backend Disconnected Banner**: If the Express backend is not running or unreachable, an alert banner appears at the top with a **Retry Connection** button.
