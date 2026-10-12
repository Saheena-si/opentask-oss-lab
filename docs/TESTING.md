# OpenTask — Testing Strategy & Execution Report

## 1. Testing Strategy

OpenTask employs a multi-layered testing strategy combining database schema constraint verification with HTTP REST API end-to-end integration tests.

### Test Isolation & Safety Guarantee
- **Zero Risk to Production Data**: Automated test suites configure `process.env.DB_PATH = ':memory:'`.
- Every test suite executes against an ephemeral, in-memory SQLite database instance created in RAM.
- The developer's real database at `backend/data/opentask.db` is never read, modified, or deleted during test runs.
- Before each individual API test, the in-memory `tasks` table is cleared (`DELETE FROM tasks`), guaranteeing total isolation between test cases.

---

## 2. Test Execution Commands

Run the full automated test suite:

```bash
# From repository root
npm test

# Or directly in the backend directory
cd backend
npm test
```

Run frontend production build verification:

```bash
# From repository root
npm run build

# Or directly in the frontend directory
cd frontend
npm run build
```

---

## 3. Test Suites & Cases Covered

### Suite 1: Database Initialization & Schema (`backend/tests/db.test.js`)
| # | Test Case Description | Verified Behavior | Expected Result |
| :--- | :--- | :--- | :--- |
| 1 | In-memory DB creation | Checks SQLite table existence in `sqlite_master` | Table `tasks` exists |
| 2 | Schema column definition | Verifies `PRAGMA table_info(tasks)` for required fields | All 8 required columns present |
| 3 | CHECK constraint on `priority` | Rejects priorities outside `Low`, `Medium`, `High` | SQL constraint exception thrown |
| 4 | CHECK constraint on `status` | Rejects statuses outside `Pending`, `In Progress`, `Completed` | SQL constraint exception thrown |
| 5 | NOT NULL constraint on `title` | Rejects `NULL` title in database insertion | SQL NOT NULL exception thrown |

### Suite 2: Task API Integration (`backend/tests/task.test.js`)
| # | Test Case Description | Method & Endpoint | Expected Status |
| :--- | :--- | :--- | :--- |
| 1 | Health check endpoint | `GET /api/health` | `200 OK`, `status: 'ok'`, `database: 'connected'` |
| 2 | Valid task creation | `POST /api/tasks` | `201 Created`, returns generated `id` and timestamps |
| 3 | Missing / empty title validation | `POST /api/tasks` with `title: ""` | `400 Bad Request` with error message |
| 4 | Invalid priority validation | `POST /api/tasks` with `priority: "Urgent"` | `400 Bad Request` with valid options list |
| 5 | Invalid status validation | `POST /api/tasks` with `status: "Archived"` | `400 Bad Request` with valid options list |
| 6 | Retrieve all tasks | `GET /api/tasks` | `200 OK`, JSON array with count |
| 7 | Retrieve task by ID & 404 test | `GET /api/tasks/:id` & `:nonexistent` | `200 OK` for existing, `404 Not Found` for invalid |
| 8 | Update task attributes | `PUT /api/tasks/:id` | `200 OK`, reflects updated fields & updated timestamp |
| 9 | Update nonexistent task | `PUT /api/tasks/999999` | `404 Not Found` |
| 10 | Task deletion lifecycle | `DELETE /api/tasks/:id` | `200 OK`, subsequent `GET` returns `404 Not Found` |
| 11 | Search and multi-filtering | `GET /api/tasks?search=...&status=...` | `200 OK`, returns only matching filtered records |

---

## 4. Test Execution Summary

```
▶ Database Initialization & Schema Tests
  ✔ should initialize an in-memory database and create tasks table (1.17ms)
  ✔ should create required columns on tasks table (0.41ms)
  ✔ should enforce CHECK constraint on priority (1.16ms)
  ✔ should enforce CHECK constraint on status (0.54ms)
  ✔ should enforce NOT NULL constraint on title (0.51ms)
✔ Database Initialization & Schema Tests (4.58ms)

▶ Task API Integration Tests
  ✔ GET /api/health should return 200 with service health and database connected (31.10ms)
  ✔ POST /api/tasks should create a valid task with 201 status (11.69ms)
  ✔ POST /api/tasks should reject missing or empty title with 400 (6.43ms)
  ✔ POST /api/tasks should reject invalid priority with 400 (3.64ms)
  ✔ POST /api/tasks should reject invalid status with 400 (9.12ms)
  ✔ GET /api/tasks should return list of tasks (15.50ms)
  ✔ GET /api/tasks/:id should return single task or 404 (4.67ms)
  ✔ PUT /api/tasks/:id should update existing task fields (10.48ms)
  ✔ PUT /api/tasks/:id should return 404 for nonexistent task (3.03ms)
  ✔ DELETE /api/tasks/:id should delete task and return 200, 404 thereafter (42.66ms)
  ✔ Search and Filtering should filter tasks correctly (80.48ms)
✔ Task API Integration Tests (232.98ms)

Total Tests: 16
Suites: 2
Passed: 16 (100%)
Failed: 0
Duration: ~375ms
```
