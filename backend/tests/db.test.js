const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { initDb, closeDb } = require('../src/database/db');

describe('Database Initialization & Schema Tests', () => {
  afterEach(() => {
    closeDb();
  });

  it('should initialize an in-memory database and create tasks table', () => {
    const db = initDb(':memory:');
    assert.ok(db, 'Database instance should be created');

    const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").get();
    assert.ok(tableInfo, 'Table "tasks" must exist');
    assert.equal(tableInfo.name, 'tasks');
  });

  it('should create required columns on tasks table', () => {
    const db = initDb(':memory:');
    const columns = db.prepare("PRAGMA table_info(tasks)").all();
    const columnNames = columns.map(c => c.name);

    const requiredColumns = [
      'id',
      'title',
      'description',
      'priority',
      'status',
      'due_date',
      'created_at',
      'updated_at'
    ];

    for (const col of requiredColumns) {
      assert.ok(columnNames.includes(col), `Column "${col}" must be defined`);
    }
  });

  it('should enforce CHECK constraint on priority', () => {
    const db = initDb(':memory:');
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, status)
      VALUES (?, ?, ?, ?)
    `);

    assert.throws(
      () => {
        stmt.run('Invalid Priority Task', 'Desc', 'Urgent', 'Pending');
      },
      /CHECK constraint failed/i,
      'Should reject priority other than Low, Medium, High'
    );
  });

  it('should enforce CHECK constraint on status', () => {
    const db = initDb(':memory:');
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, status)
      VALUES (?, ?, ?, ?)
    `);

    assert.throws(
      () => {
        stmt.run('Invalid Status Task', 'Desc', 'High', 'Archived');
      },
      /CHECK constraint failed/i,
      'Should reject status other than Pending, In Progress, Completed'
    );
  });

  it('should enforce NOT NULL constraint on title', () => {
    const db = initDb(':memory:');
    const stmt = db.prepare(`
      INSERT INTO tasks (title, priority, status)
      VALUES (?, ?, ?)
    `);

    assert.throws(
      () => {
        stmt.run(null, 'High', 'Pending');
      },
      /NOT NULL constraint failed/i,
      'Should reject null title'
    );
  });
});
