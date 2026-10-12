const express = require('express');
const router = express.Router();
const {
  getHealth,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask
} = require('../middleware/validateTask');

// Health endpoint: GET /api/health
router.get('/health', getHealth);

// Task endpoints: GET, POST /api/tasks
router.get('/tasks', getAllTasks);
router.post('/tasks', validateCreateTask, createTask);

// Single task endpoints: GET, PUT, DELETE /api/tasks/:id
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', validateUpdateTask, updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
