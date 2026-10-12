# OpenTask — Actionable GitHub Issues Backlog

This document defines seven structured GitHub Issues ready to be created on the [OpenTask GitHub Repository](https://github.com/saheena-si/opentask-oss-lab/issues).

---

## Issue 1: Set up React frontend with Vite

### Title
`feat(frontend): Set up React frontend project with Vite, component structure, and design system`

### Description
Initialize the presentation layer for OpenTask using React and Vite. The frontend requires a clean, accessible layout featuring responsive design, component hierarchy, global CSS custom properties, and service integration.

### Scope
- Initialize Vite React project in `frontend/`.
- Establish folder structure: `components/`, `services/`, `public/`.
- Build core reusable components: `Navbar`, `Dashboard`, `SummaryCard`, `TaskList`, `TaskCard`, `StatusBadge`, `PriorityBadge`, `Notification`.
- Implement responsive CSS styling with mobile and desktop breakpoints.

### Acceptance Criteria
- [ ] Vite development server boots reliably on `http://localhost:5173`.
- [ ] Application renders properly without runtime errors in the browser console.
- [ ] Responsive navigation and dashboard metrics layout adapt smoothly across viewport sizes.
- [ ] Production build (`npm run build`) bundles cleanly into `frontend/dist/`.

### Suggested Labels
`frontend`, `enhancement`, `good first issue`

---

## Issue 2: Implement Express REST API

### Title
`feat(backend): Implement Express.js server, router structure, and health endpoint`

### Description
Establish the backend server foundation using Express.js. Configure CORS for local development, request parsing, centralized error handling, and a dedicated `/api/health` endpoint.

### Scope
- Set up `backend/server.js` and `backend/src/app.js`.
- Mount `/api` router for task management endpoints.
- Configure `cors` middleware supporting Vite frontend (`localhost:5173`).
- Implement centralized `errorHandler` and 404 handler to conceal internal stack traces.

### Acceptance Criteria
- [ ] Express server starts on port specified in `PORT` environment variable (default: `5000`).
- [ ] `GET /api/health` responds with HTTP 200, status `ok`, and timestamp.
- [ ] Undefined routes return structured HTTP 404 JSON response.
- [ ] Internal errors return HTTP 500 without leaking stack traces or credentials.

### Suggested Labels
`backend`, `api`

---

## Issue 3: Initialize SQLite schema and database access

### Title
`feat(database): Initialize SQLite schema, indexes, and database module`

### Description
Create a dedicated database module using Node.js built-in `node:sqlite` (`DatabaseSync`). Define the `tasks` table with appropriate primary keys, constraints, and indexes. Provide a safe demo seed script with duplicate prevention.

### Scope
- Implement `backend/src/database/db.js` with `initDb()`, `getDb()`, and `closeDb()`.
- Create `tasks` table with fields: `id`, `title`, `description`, `priority`, `status`, `due_date`, `created_at`, `updated_at`.
- Add CHECK constraints for priority and status values.
- Add indexes on `status`, `priority`, and `created_at`.
- Implement `seed.js` script with realistic sample tasks.

### Acceptance Criteria
- [ ] SQLite database file created safely in `backend/data/opentask.db`.
- [ ] Schema creation is idempotent (`CREATE TABLE IF NOT EXISTS`).
- [ ] Database supports in-memory configuration (`:memory:`) for isolated tests.
- [ ] Running seed script populates 6 demo tasks without duplicating records on restart.

### Suggested Labels
`database`, `backend`

---

## Issue 4: Implement task CRUD operations

### Title
`feat(api): Implement task CRUD endpoints and validation middleware`

### Description
Implement the core business logic for task management: creating, reading, updating, and deleting tasks via Express controllers and parameterized SQL queries.

### Scope
- Implement `taskController.js`: `getAllTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`.
- Implement `validateTask.js`: enforce required non-empty `title`, validate `priority` and `status` enums.
- Use parameterized queries (`?`) for all SQL operations.
- Map endpoints to HTTP status codes (`200`, `201`, `400`, `404`).

### Acceptance Criteria
- [ ] `POST /api/tasks` creates task and returns HTTP 201 with created object.
- [ ] `GET /api/tasks` and `GET /api/tasks/:id` return stored task data.
- [ ] `PUT /api/tasks/:id` updates fields and updates `updated_at` timestamp.
- [ ] `DELETE /api/tasks/:id` removes task and returns HTTP 200.
- [ ] Invalid payloads return HTTP 400 with descriptive error message.

### Suggested Labels
`backend`, `api`, `crud`

---

## Issue 5: Add search and filters

### Title
`feat(frontend+backend): Add title search, status filtering, and priority filtering`

### Description
Enable users to quickly find work items by combining search queries and filter options across both frontend controls and backend query parameter handling.

### Scope
- Backend: Update `getAllTasks` controller to parse `search`, `status`, and `priority` query parameters.
- Frontend: Implement `SearchBar` component with clear button.
- Frontend: Implement `FilterControls` dropdowns with "Reset Filters" action.
- Connect summary cards in `Dashboard` to filter by status on click.

### Acceptance Criteria
- [ ] `GET /api/tasks?search=...` performs case-insensitive substring matching.
- [ ] `GET /api/tasks?status=...&priority=...` applies multi-filter AND criteria.
- [ ] Frontend updates task list dynamically upon typing or changing dropdowns.
- [ ] Reset Filters restores full task list.

### Suggested Labels
`frontend`, `backend`, `enhancement`

---

## Issue 6: Add automated tests

### Title
`test: Implement automated unit and integration tests for API and SQLite database`

### Description
Build a repeatable automated test suite verifying database schema constraints and REST API endpoints using the Node.js built-in test runner (`node:test`) and assertions (`node:assert`).

### Scope
- Create `backend/tests/db.test.js` covering schema creation, column verification, and CHECK constraints.
- Create `backend/tests/task.test.js` covering all HTTP CRUD routes, validation errors, 404s, and filtering.
- Guarantee test isolation using in-memory SQLite database (`:memory:`).
- Add `npm test` script.

### Acceptance Criteria
- [ ] All 16 automated tests pass via `npm test`.
- [ ] Automated tests run in memory without creating or modifying `backend/data/opentask.db`.
- [ ] Tests run fast (< 1 second) and produce clean test runner output.

### Suggested Labels
`testing`, `quality`

---

## Issue 7: Complete documentation and GitHub Actions

### Title
`docs: Complete open-source documentation, community files, and GitHub Actions CI`

### Description
Provide comprehensive documentation and continuous integration automation suitable for open-source project standards and college OSS lab requirements.

### Scope
- Write root `README.md`, `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
- Create detailed guides in `docs/`: `REQUIREMENTS.md`, `ARCHITECTURE.md`, `API_DOCUMENTATION.md`, `INSTALLATION.md`, `USER_GUIDE.md`, `TESTING.md`.
- Create GitHub issue templates and pull request template.
- Implement `.github/workflows/ci.yml` to automatically build frontend and test backend on push and PR.

### Acceptance Criteria
- [ ] CI workflow configured to test on Node.js 24 and fail on broken tests or builds.
- [ ] Issue templates (Bug Report, Feature Request) render properly on GitHub.
- [ ] All documentation files contain accurate paths, setup commands, and architecture diagrams.

### Suggested Labels
`documentation`, `ci/cd`

---

## Manual GitHub Issue Creation Steps

Since GitHub CLI (`gh`) is not installed locally, you can create these issues directly on GitHub using these steps:

1. Visit the Issues tab: [https://github.com/saheena-si/opentask-oss-lab/issues](https://github.com/saheena-si/opentask-oss-lab/issues)
2. Click **New issue**.
3. Copy the **Title**, **Description**, **Scope**, and **Acceptance Criteria** from each issue above.
4. Assign the suggested labels.
5. Click **Submit new issue**.
