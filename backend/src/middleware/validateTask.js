const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

/**
 * Validates task payload for creation (POST)
 */
function validateCreateTask(req, res, next) {
  const { title, description, priority = 'Medium', status = 'Pending', due_date } = req.body || {};
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Task title is required and cannot be empty.');
  } else if (title.trim().length > 200) {
    errors.push('Task title cannot exceed 200 characters.');
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (due_date !== undefined && due_date !== null && due_date !== '') {
    if (typeof due_date !== 'string' || isNaN(Date.parse(due_date))) {
      errors.push('Due date must be a valid date format (e.g., YYYY-MM-DD).');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors[0],
      errors
    });
  }

  req.validatedBody = {
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    priority,
    status,
    due_date: due_date && due_date.trim() !== '' ? due_date.trim() : null
  };

  next();
}

/**
 * Validates task payload for update (PUT)
 */
function validateUpdateTask(req, res, next) {
  const { title, description, priority, status, due_date } = req.body || {};
  const errors = [];

  if (title === undefined && description === undefined && priority === undefined && status === undefined && due_date === undefined) {
    return res.status(400).json({
      success: false,
      error: 'At least one field (title, description, priority, status, due_date) must be provided to update.'
    });
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push('Task title cannot be empty.');
    } else if (title.trim().length > 200) {
      errors.push('Task title cannot exceed 200 characters.');
    } else {
      updates.title = title.trim();
    }
  }

  if (description !== undefined) {
    updates.description = typeof description === 'string' ? description.trim() : '';
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    } else {
      updates.priority = priority;
    }
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
    } else {
      updates.status = status;
    }
  }

  if (due_date !== undefined) {
    if (due_date === null || due_date === '') {
      updates.due_date = null;
    } else if (typeof due_date !== 'string' || isNaN(Date.parse(due_date))) {
      errors.push('Due date must be a valid date format (e.g., YYYY-MM-DD).');
    } else {
      updates.due_date = due_date.trim();
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors[0],
      errors
    });
  }

  req.validatedUpdates = updates;
  next();
}

module.exports = {
  VALID_PRIORITIES,
  VALID_STATUSES,
  validateCreateTask,
  validateUpdateTask
};
