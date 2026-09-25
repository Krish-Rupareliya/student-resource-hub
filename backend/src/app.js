// src/app.js — Express application setup
'use strict';

require('dotenv').config();

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const publicRoutes   = require('./routes/public.routes');
const authRoutes     = require('./routes/auth.routes');
const adminRoutes    = require('./routes/admin.routes');
const resourceRoutes = require('./routes/resource.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const rateLimit = require('express-rate-limit');

const app = express();

// ─── Trust Proxy for Cloud Hosting (Render / Vercel) ──────────
// Informs Express that it is running behind a reverse proxy (Cloudflare/Render load balancer).
// Ensures req.ip correctly identifies the actual student's IP address rather than the proxy.
app.set('trust proxy', 1);

// ─── HTTP Response Compression (Gzip / Deflate) ──────────────
app.use(compression());

// ─── Security Headers ─────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow static file serving
    xFrameOptions: false, // allow iframe embedding of PDFs by the frontend
    contentSecurityPolicy: false, // disable frame-ancestors block
  })
);

// ─── Dynamic CORS Configuration ────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173', // Local Vite development
  'http://localhost:3000', // Alternative local dev port
  'http://127.0.0.1:5173',
  'https://campus-hub-eight-omega.vercel.app', // Live Vercel production deployment
  ...(process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim()) : []),
  ...(process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim()) : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // required for HttpOnly cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Request Logging ──────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Welcome / Root Route ──────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Student Resource Hub — Backend API',
    message: 'Backend server is running and ready for traffic.',
    health: '/health',
    api: '/api',
    frontend: process.env.ALLOWED_ORIGIN || 'https://campus-hub-eight-omega.vercel.app',
    version: '1.0.0',
  });
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'student-resource-hub-api',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────

// Global API rate limiter: 180 requests per minute per IP.
// Protects Render 512MB RAM and single-CPU from being saturated by bots or loops.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this device. Please wait a moment and try again.',
  },
});

app.use('/api', apiLimiter);

// Public student routes  (no auth)
app.use('/api', publicRoutes);

// Secure resource proxy (view + download) — no auth required
app.use('/api', resourceRoutes);

// Admin authentication routes
app.use('/api/admin/auth', authRoutes);

// Protected admin management routes
app.use('/api/admin', adminRoutes);

// ─── 404 + Global Error Handler ──────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
