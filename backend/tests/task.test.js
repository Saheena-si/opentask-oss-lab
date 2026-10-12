process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';

const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const { initDb, closeDb, getDb } = require('../src/database/db');

describe('Task API Integration Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    initDb(':memory:');
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    closeDb();
    await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(() => {
    // Clear tasks table before each test for test isolation
    const db = getDb();
    db.prepare('DELETE FROM tasks').run();
  });

  it('GET /api/health should return 200 with service health and database connected', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'opentask-backend');
    assert.equal(body.database, 'connected');
    assert.ok(body.timestamp);
  });

  it('POST /api/tasks should create a valid task with 201 status', async () => {
    const payload = {
      title: 'Write project documentation',
      description: 'Create thorough README and architecture docs',
      priority: 'High',
      status: 'Pending',
      due_date: '2026-10-25'
    };

    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.id);
    assert.equal(body.data.title, payload.title);
    assert.equal(body.data.priority, 'High');
    assert.equal(body.data.status, 'Pending');
    assert.equal(body.data.due_date, '2026-10-25');
    assert.ok(body.data.created_at);
  });

  it('POST /api/tasks should reject missing or empty title with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   ', priority: 'Low' })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /Task title is required/i);
  });

  it('POST /api/tasks should reject invalid priority with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Valid Title', priority: 'Urgent' })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /Priority must be one of/i);
  });

  it('POST /api/tasks should reject invalid status with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Valid Title', status: 'Blocked' })
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.match(body.error, /Status must be one of/i);
  });

  it('GET /api/tasks should return list of tasks', async () => {
    // Insert sample tasks
    const db = getDb();
    db.prepare('INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)')
      .run('Task 1', 'Low', 'Pending');
    db.prepare('INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)')
      .run('Task 2', 'High', 'Completed');

    const res = await fetch(`${baseUrl}/api/tasks`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.count, 2);
    assert.equal(body.data.length, 2);
  });

  it('GET /api/tasks/:id should return single task or 404', async () => {
    const db = getDb();
    const insertRes = db.prepare('INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)')
      .run('Find Me', 'Medium', 'Pending');
    const id = Number(insertRes.lastInsertRowid);

    // Existing ID
    const res = await fetch(`${baseUrl}/api/tasks/${id}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Find Me');

    // Nonexistent ID
    const notFoundRes = await fetch(`${baseUrl}/api/tasks/999999`);
    assert.equal(notFoundRes.status, 404);
    const notFoundBody = await notFoundRes.json();
    assert.equal(notFoundBody.success, false);
  });

  it('PUT /api/tasks/:id should update existing task fields', async () => {
    const db = getDb();
    const insertRes = db.prepare('INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)')
      .run('Initial Title', 'Low', 'Pending');
    const id = Number(insertRes.lastInsertRowid);

    const updatePayload = {
      title: 'Updated Title',
      status: 'Completed',
      priority: 'High'
    };

    const res = await fetch(`${baseUrl}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Updated Title');
    assert.equal(body.data.status, 'Completed');
    assert.equal(body.data.priority, 'High');
  });

  it('PUT /api/tasks/:id should return 404 for nonexistent task', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/999999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New' })
    });

    assert.equal(res.status, 404);
  });

  it('DELETE /api/tasks/:id should delete task and return 200, 404 thereafter', async () => {
    const db = getDb();
    const insertRes = db.prepare('INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)')
      .run('To Be Deleted', 'Low', 'Pending');
    const id = Number(insertRes.lastInsertRowid);

    // Delete
    const deleteRes = await fetch(`${baseUrl}/api/tasks/${id}`, {
      method: 'DELETE'
    });
    assert.equal(deleteRes.status, 200);

    // Confirm deletion
    const getRes = await fetch(`${baseUrl}/api/tasks/${id}`);
    assert.equal(getRes.status, 404);

    // Deleting again should return 404
    const deleteAgainRes = await fetch(`${baseUrl}/api/tasks/${id}`, {
      method: 'DELETE'
    });
    assert.equal(deleteAgainRes.status, 404);
  });

  it('Search and Filtering should filter tasks correctly', async () => {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)');
    stmt.run('Learn React Components', 'High', 'Completed');
    stmt.run('Learn Express Router', 'Medium', 'In Progress');
    stmt.run('Build UI Navigation', 'Low', 'Pending');

    // Search by title
    const searchRes = await fetch(`${baseUrl}/api/tasks?search=Express`);
    const searchBody = await searchRes.json();
    assert.equal(searchBody.count, 1);
    assert.equal(searchBody.data[0].title, 'Learn Express Router');

    // Filter by status
    const statusRes = await fetch(`${baseUrl}/api/tasks?status=Completed`);
    const statusBody = await statusRes.json();
    assert.equal(statusBody.count, 1);
    assert.equal(statusBody.data[0].title, 'Learn React Components');

    // Filter by priority
    const priorityRes = await fetch(`${baseUrl}/api/tasks?priority=Low`);
    const priorityBody = await priorityRes.json();
    assert.equal(priorityBody.count, 1);
    assert.equal(priorityBody.data[0].title, 'Build UI Navigation');

    // Combined filter
    const combinedRes = await fetch(`${baseUrl}/api/tasks?search=React&status=Completed&priority=High`);
    const combinedBody = await combinedRes.json();
    assert.equal(combinedBody.count, 1);
    assert.equal(combinedBody.data[0].title, 'Learn React Components');

    // Empty result filter
    const noneRes = await fetch(`${baseUrl}/api/tasks?search=Python`);
    const noneBody = await noneRes.json();
    assert.equal(noneBody.count, 0);
  });
});
