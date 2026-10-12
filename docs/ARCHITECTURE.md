# OpenTask — System Architecture & Design

## 1. Architectural Overview
OpenTask follows a modern, decoupled **3-tier client-server architecture**:
1. **Presentation Tier (Frontend)**: Single Page Application (SPA) built with React 18, bundled by Vite, delivering a component-driven responsive user interface.
2. **Application Tier (Backend)**: Lightweight, modular RESTful API built on Node.js 24 and Express, structured using controller and routing layers with centralized error handling.
3. **Data Tier (Database)**: Relational SQLite database using Node.js built-in `node:sqlite` (`DatabaseSync`), enforcing ACID properties, constraints, and indexes.

---

## 2. Architecture Diagram

```mermaid
graph TD
    User["👤 End User (Web Browser)"]
    
    subgraph Frontend["Frontend Tier (React + Vite - Port 5173)"]
        UI["React UI Components<br/>(Dashboard, TaskList, TaskForm)"]
        State["React State & Hooks<br/>(useState, useEffect, useCallback)"]
        APIService["API Service Module<br/>(frontend/src/services/api.js)"]
        UI --> State
        State --> APIService
    end

    subgraph Backend["Application Tier (Node.js + Express - Port 5000)"]
        ExpressApp["Express Application & Router<br/>(backend/src/app.js)"]
        Validation["Validation Middleware<br/>(validateTask.js)"]
        Controller["Task Controller<br/>(taskController.js)"]
        ErrorHandler["Centralized Error Handler<br/>(errorHandler.js)"]
        
        ExpressApp --> Validation
        Validation --> Controller
        Controller --> ErrorHandler
    end

    subgraph Database["Data Tier (SQLite)"]
        DBModule["Database Module<br/>(backend/src/database/db.js)"]
        SQLiteFile[("SQLite DB File<br/>opentask.db / :memory:")]
        
        Controller --> DBModule
        DBModule --> SQLiteFile
    end

    User -->|HTTP / HTTPS| UI
    APIService -->|JSON over REST API| ExpressApp
```

---

## 3. End-to-End Request Lifecycle

When a user performs an action (e.g. creating a task):

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Component as TaskForm.jsx
    participant Service as api.js
    participant Server as Express Server
    participant Middleware as validateTask.js
    participant Controller as taskController.js
    participant DB as SQLite (DatabaseSync)

    User->>Component: Enters Title, Priority, Due Date & clicks Submit
    Component->>Component: Client-side validation check (non-empty title)
    Component->>Service: createTask({ title, priority, ... })
    Service->>Server: HTTP POST /api/tasks (application/json)
    Server->>Middleware: validateCreateTask middleware
    alt Validation Failure
        Middleware-->>Service: HTTP 400 Bad Request { success: false, error: "..." }
        Service-->>Component: Displays error alert to user
    else Validation Success
        Middleware->>Controller: Passes sanitized req.validatedBody
        Controller->>DB: INSERT INTO tasks (...) VALUES (?, ?, ...) [Parameterized]
        DB-->>Controller: Returns lastInsertRowid
        Controller->>DB: SELECT * FROM tasks WHERE id = ?
        DB-->>Controller: Returns task row object
        Controller-->>Service: HTTP 201 Created { success: true, data: newTask }
        Service-->>Component: Resolves Promise with created task
        Component->>User: Closes modal & renders toast "Task created successfully"
    end
```

---

## 4. Database Schema Design (Entity-Relationship)

```mermaid
erDiagram
    TASKS {
        INTEGER id PK "Auto Increment, Primary Key"
        TEXT title "Not Null, Max 200 chars"
        TEXT description "Nullable/Default empty string"
        TEXT priority "Not Null, CHECK: Low, Medium, High"
        TEXT status "Not Null, CHECK: Pending, In Progress, Completed"
        TEXT due_date "Nullable, ISO Date String (YYYY-MM-DD)"
        TEXT created_at "Not Null, DEFAULT CURRENT_TIMESTAMP"
        TEXT updated_at "Not Null, DEFAULT CURRENT_TIMESTAMP"
    }
```

### Table Definitions & Constraints
- **Primary Key**: `id INTEGER PRIMARY KEY AUTOINCREMENT` guarantees unique sequential IDs.
- **Constraints**:
  - `CHECK(priority IN ('Low', 'Medium', 'High'))`: Restricts priority domain at the database engine level.
  - `CHECK(status IN ('Pending', 'In Progress', 'Completed'))`: Restricts status domain.
  - `title TEXT NOT NULL`: Enforces presence of title on every record.
- **Performance Indexes**:
  - `idx_tasks_status` on `status` column for fast category querying.
  - `idx_tasks_priority` on `priority` column for fast priority filtering.
  - `idx_tasks_created_at` on `created_at` column for sorting.

---

## 5. Security & Design Patterns
1. **Parameterized Queries**: Every SQL statement utilizes `?` parameter markers via `db.prepare().run(...params)`. This completely prevents SQL injection attacks.
2. **Separation of Concerns**: Business logic is separated into controllers, route definitions into routers, validation into middleware, and data access into a dedicated database module.
3. **Environment Agnostic**: The application dynamically handles local SQLite files (`backend/data/opentask.db`) as well as in-memory databases (`:memory:`) during automated testing.
4. **Resilient Error Boundaries**: Unhandled exceptions are caught by `errorHandler.js`, preventing process termination and concealing internal stack traces from clients.
