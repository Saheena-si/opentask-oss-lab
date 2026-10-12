const { getDb } = require('../database/db');

/**
 * Health check endpoint
 * GET /api/health
 */
function getHealth(req, res) {
  try {
    const db = getDb();
    // Test database connectivity
    db.prepare('SELECT 1').get();

    return res.status(200).json({
      status: 'ok',
      service: 'opentask-backend',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      service: 'opentask-backend',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection check failed'
    });
  }
}

/**
 * Get all tasks with optional search, status, and priority query filters
 * GET /api/tasks?search=...&status=...&priority=...
 */
function getAllTasks(req, res, next) {
  try {
    const db = getDb();
    const { search, status, priority } = req.query;

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ' AND title LIKE ?';
      params.push(`%${search.trim()}%`);
    }

    if (status && typeof status === 'string' && status.trim() !== '' && status !== 'All') {
      query += ' AND status = ?';
      params.push(status.trim());
    }

    if (priority && typeof priority === 'string' && priority.trim() !== '' && priority !== 'All') {
      query += ' AND priority = ?';
      params.push(priority.trim());
    }

    query += ' ORDER BY id DESC';

    const stmt = db.prepare(query);
    const tasks = stmt.all(...params);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
function getTaskById(req, res, next) {
  try {
    const db = getDb();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format. Must be an integer.'
      });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new task
 * POST /api/tasks
 */
function createTask(req, res, next) {
  try {
    const db = getDb();
    const { title, description, priority, status, due_date } = req.validatedBody;

    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, status, due_date)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, description, priority, status, due_date);
    const newTaskId = Number(result.lastInsertRowid);

    const createdTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(newTaskId);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: createdTask
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing task
 * PUT /api/tasks/:id
 */
function updateTask(req, res, next) {
  try {
    const db = getDb();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format. Must be an integer.'
      });
    }

    // Check if task exists
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found.`
      });
    }

    const updates = req.validatedUpdates;
    const updateKeys = Object.keys(updates);

    if (updateKeys.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No changes provided.',
        data: existing
      });
    }

    const setClauses = updateKeys.map((key) => `${key} = ?`).join(', ');
    const params = updateKeys.map((key) => updates[key]);

    // Append updated_at
    const sql = `
      UPDATE tasks 
      SET ${setClauses}, updated_at = (datetime('now'))
      WHERE id = ?
    `;
    params.push(id);

    db.prepare(sql).run(...params);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
function deleteTask(req, res, next) {
  try {
    const db = getDb();
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid task ID format. Must be an integer.'
      });
    }

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found.`
      });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      deletedId: id
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHealth,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
