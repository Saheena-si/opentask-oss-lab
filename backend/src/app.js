const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: corsOrigin === '*' ? '*' : [corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Base API route greeting
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'OpenTask REST API',
    version: '1.0.0',
    description: 'Open source task management API with SQLite',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks'
    }
  });
});

// Mount task routes under /api
app.use('/api', taskRoutes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
