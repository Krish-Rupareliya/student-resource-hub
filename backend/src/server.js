// src/server.js — HTTP server entry point
'use strict';

require('dotenv').config();

const app = require('./app');
const prisma = require('./config/prisma');

const PORT = parseInt(process.env.PORT, 10) || 3001;

async function startServer() {
  try {
    // Verify database connection before accepting traffic
    await prisma.$connect();
    console.log('✅  Database connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
      console.log(`📁  Uploads served at http://localhost:${PORT}/uploads`);
      console.log(`🩺  Health check at http://localhost:${PORT}/health`);
      console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌  Port ${PORT} is already in use by another running process.`);
        console.error(`👉  Close the other process or run: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT} -State Listen).OwningProcess -Force`);
      } else {
        console.error('❌  Server error:', err);
      }
      await prisma.$disconnect();
      process.exit(1);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⛔  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⛔  SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
