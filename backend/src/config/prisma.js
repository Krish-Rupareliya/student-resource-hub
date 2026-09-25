// src/config/prisma.js — Singleton PrismaClient instance
'use strict';

const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

/**
 * Configure connection pool parameters for Aiven free tier MySQL.
 * Aiven free-tier limits max connections to ~10-20 total.
 * Capping Prisma to 5 connections ensures Render never exhausts Aiven's limit,
 * while pool_timeout=20 prevents premature timeouts during sudden traffic spikes.
 */
function getDatasourceUrl() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  if (rawUrl.includes('connection_limit=')) {
    return rawUrl;
  }

  const separator = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${separator}connection_limit=5&pool_timeout=20`;
}

const dbUrl = getDatasourceUrl();

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
