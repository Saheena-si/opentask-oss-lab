# OpenTask — REST API Documentation

Base URL for local development: `http://localhost:5000/api`

All request payloads and response bodies use the `application/json` Content-Type.

---

## Endpoint Summary

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health and database connectivity check | `200`, `500` |
| `GET` | `/tasks` | List all tasks with optional search & filters | `200` |
| `GET` | `/tasks/:id` | Retrieve an individual task by ID | `200`, `400`, `404` |
| `POST` | `/tasks` | Create a new task | `201`, `400` |
| `PUT` | `/tasks/:id` | Update an existing task | `200`, `400`, `404` |
| `DELETE` | `/tasks/:id` | Delete a task | `200`, `400`, `404` |

---

## 1. Health Check

### `GET /api/health`
Checks server responsiveness and verifies SQLite database read access.

#### Request
```bash
curl -X GET http://localhost:5000/api/health
```

#### Success Response (`200 OK`)
```json
{
  "status": "ok",
  "service": "opentask-backend",
  "timestamp": "2026-10-12T06:30:00.000Z",
  "database": "connected"
}
```

---

## 2. Get All Tasks

### `GET /api/tasks`
Retrieves a list of tasks, sorted by ID descending. Supports query parameters for filtering and searching.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `search` | string | Optional | Substring match against task title | `search=Wireframe` |
| `status` | string | Optional | Filter by status (`Pending`, `In Progress`, `Completed`) | `status=Pending` |
| `priority`| string | Optional | Filter by priority (`Low`, `Medium`, `High`) | `priority=High` |

#### Request Example
```bash
curl -X GET "http://localhost:5000/api/tasks?status=In%20Progress&priority=High"
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 2,
      "title": "Implement Express REST API & SQLite Schema",
      "description": "Set up endpoints for CRUD operations and verify schema with parameterized queries.",
      "priority": "High",
      "status": "In Progress",
      "due_date": "2026-10-18",
      "created_at": "2026-10-12 06:33:00",
      "updated_at": "2026-10-12 06:33:00"
    }
  ]
}
```

---

## 3. Get Task by ID

### `GET /api/tasks/:id`
Retrieves a single task record.

#### Path Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | integer | Unique identifier of the task |

#### Request Example
```bash
curl -X GET http://localhost:5000/api/tasks/1
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Design OpenTask UI Wireframes",
    "description": "Create responsive mockup components.",
    "priority": "High",
    "status": "Completed",
    "due_date": "2026-10-15",
    "created_at": "2026-10-12 06:33:00",
    "updated_at": "2026-10-12 06:33:00"
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Task with ID 999999 not found."
}
```

---

## 4. Create Task

### `POST /api/tasks`
Creates a new task.

#### Request Body
```json
{
  "title": "Build UI Extension Sidecar",
  "description": "Integrate side pane plugin with Node backend.",
  "priority": "High",
  "status": "Pending",
  "due_date": "2026-10-30"
}
```

| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `title` | string | **Yes** | 1–200 characters, non-empty |
| `description` | string | No | Defaults to empty string |
| `priority` | string | No | Allowed: `Low`, `Medium`, `High`. Defaults to `Medium` |
| `status` | string | No | Allowed: `Pending`, `In Progress`, `Completed`. Defaults to `Pending` |
| `due_date` | string | No | Valid date format (e.g. `YYYY-MM-DD`) or `null` |

#### Request Example
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Build UI Extension Sidecar","priority":"High","status":"Pending","due_date":"2026-10-30"}'
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": 7,
    "title": "Build UI Extension Sidecar",
    "description": "",
    "priority": "High",
    "status": "Pending",
    "due_date": "2026-10-30",
    "created_at": "2026-10-12 06:40:00",
    "updated_at": "2026-10-12 06:40:00"
  }
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Task title is required and cannot be empty.",
  "errors": [
    "Task title is required and cannot be empty."
  ]
}
```

---

## 5. Update Task

### `PUT /api/tasks/:id`
Updates fields of an existing task.

#### Request Example
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed","priority":"High"}'
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "id": 1,
    "title": "Design OpenTask UI Wireframes",
    "description": "Create responsive mockup components.",
    "priority": "High",
    "status": "Completed",
    "due_date": "2026-10-15",
    "created_at": "2026-10-12 06:33:00",
    "updated_at": "2026-10-12 06:45:12"
  }
}
```

---

## 6. Delete Task

### `DELETE /api/tasks/:id`
Removes a task from the database.

#### Request Example
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Task deleted successfully.",
  "deletedId": 1
}
```

#### Error Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Task with ID 1 not found."
}
```
