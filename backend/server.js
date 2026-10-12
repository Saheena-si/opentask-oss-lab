require('dotenv').config();
const app = require('./src/app');
const { initDb } = require('./src/database/db');
const { seedDatabase } = require('./src/database/seed');

const PORT = process.env.PORT || 5000;

// Initialize database schema
initDb();

// Seed initial demo data safely if table is empty (will not duplicate on restart)
seedDatabase(false);

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 OpenTask Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks API:    http://localhost:${PORT}/api/tasks`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down OpenTask server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = server;
