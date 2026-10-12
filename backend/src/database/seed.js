const { getDb } = require('./db');

const demoTasks = [
  {
    title: 'Design OpenTask UI Wireframes',
    description: 'Create responsive mockup components for the dashboard, task list, and task creation modal.',
    priority: 'High',
    status: 'Completed',
    due_date: '2026-10-15'
  },
  {
    title: 'Implement Express REST API & SQLite Schema',
    description: 'Set up endpoints for CRUD operations and verify schema with parameterized queries.',
    priority: 'High',
    status: 'In Progress',
    due_date: '2026-10-18'
  },
  {
    title: 'Add Search and Multi-Filter Controls',
    description: 'Allow filtering by status (Pending, In Progress, Completed) and priority (Low, Medium, High).',
    priority: 'Medium',
    status: 'In Progress',
    due_date: '2026-10-20'
  },
  {
    title: 'Write Unit & Integration Tests',
    description: 'Add tests for input validation, edge cases, 404 responses, and database initialization.',
    priority: 'High',
    status: 'Pending',
    due_date: '2026-10-22'
  },
  {
    title: 'Prepare OSS Lab Report & Presentation Slides',
    description: 'Document architecture, design decisions, GitHub workflow, and prepare viva talking points.',
    priority: 'Medium',
    status: 'Pending',
    due_date: '2026-10-25'
  },
  {
    title: 'Conduct Code Review and Security Audit',
    description: 'Check for parameterized SQL statements, input sanitation, and zero credentials in repository.',
    priority: 'Low',
    status: 'Pending',
    due_date: '2026-10-28'
  }
];

/**
 * Seeds the database with demo tasks if currently empty.
 * @param {boolean} [force=false] - Force insertion even if tasks exist
 * @returns {number} Number of seeded tasks
 */
function seedDatabase(force = false) {
  const db = getDb();

  const countRow = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
  const currentCount = countRow ? countRow.count : 0;

  if (currentCount > 0 && !force) {
    console.log(`Database already contains ${currentCount} tasks. Skipping seed to prevent duplicates.`);
    return 0;
  }

  const insertStmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  let insertedCount = 0;
  for (const task of demoTasks) {
    insertStmt.run(
      task.title,
      task.description || '',
      task.priority,
      task.status,
      task.due_date || null
    );
    insertedCount++;
  }

  console.log(`Successfully seeded ${insertedCount} demo tasks.`);
  return insertedCount;
}

if (require.main === module) {
  const isForce = process.argv.includes('--force');
  seedDatabase(isForce);
}

module.exports = {
  demoTasks,
  seedDatabase
};
