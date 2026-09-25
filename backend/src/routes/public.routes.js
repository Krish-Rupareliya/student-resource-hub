// src/routes/public.routes.js
// All unauthenticated student-facing routes.
'use strict';

const { Router } = require('express');
const { body, query } = require('express-validator');
const rateLimit = require('express-rate-limit');

const publicController = require('../controllers/public.controller');
const { handleValidationErrors } = require('../middlewares/validate.middleware');
const { studentUpload } = require('../config/multer');

const router = Router();

// ─── Rate Limiter: Submission Endpoints ──────────────────────
// Allow 10 upload/request submissions per 15 minutes per IP.
// Protects against spam without impacting normal student usage.
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this device. Please try again in 15 minutes.',
  },
});

// ─── GET /api/categories/semesters ───────────────────────────
router.get('/categories/semesters', publicController.getSemesters);

// ─── GET /api/resources ───────────────────────────────────────
router.get(
  '/resources',
  [
    query('subjectCode').optional().isString().trim(),
    query('resourceType').optional().isString().trim(),
  ],
  handleValidationErrors,
  publicController.getResources
);

// ─── GET /api/resources/:id ───────────────────────────────────
router.get('/resources/:id', publicController.getResourceById);

// ─── GET /api/opportunities ───────────────────────────────────
router.get('/opportunities', publicController.getOpportunities);

// ─── POST /api/submissions/upload ────────────────────────────
// Accepts multipart/form-data with an optional 'file' field — 15 MB student limit
router.post(
  '/submissions/upload',
  submissionLimiter,
  studentUpload.single('file'),
  [
    body('subjectCode')
      .notEmpty().withMessage('subjectCode is required')
      .isString().trim(),
    body('resourceType')
      .notEmpty().withMessage('resourceType is required')
      .isString().trim(),
    body('title')
      .notEmpty().withMessage('title is required')
      .isString().trim()
      .isLength({ max: 255 }),
    body('description').optional().isString().trim(),
  ],
  handleValidationErrors,
  publicController.submitUpload
);

// ─── POST /api/submissions/request ───────────────────────────
router.post(
  '/submissions/request',
  submissionLimiter,
  [
    body('subjectCode')
      .optional({ checkFalsy: true })
      .isString().trim(),
    body('resourceType')
      .notEmpty().withMessage('resourceType is required')
      .isString().trim(),
    body('description')
      .optional()
      .isString().trim(),
    body('message')
      .optional()
      .isString().trim(),
    body('email')
      .exists()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address')
      .custom((value) => {
        if (!value.endsWith('@gmail.com')) {
          throw new Error('Email must be a @gmail.com address');
        }
        return true;
      }),
  ],
  (req, res, next) => {
    // Manually ensure at least one of message or description is provided
    const desc = req.body.description || req.body.message;
    if (!desc || desc.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'description or message is required' });
    }
    req.body.description = desc; // normalize to description for controller
    next();
  },
  handleValidationErrors,
  publicController.submitRequest
);

// ─── POST /api/subscribers ────────────────────────────────────
router.post(
  '/subscribers',
  [
    body('email')
      .notEmpty().withMessage('email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
  ],
  handleValidationErrors,
  publicController.subscribe
);

// ─── Referendum & Polls ───────────────────────────────────────
// GET /api/poll/active
router.get('/poll/active', publicController.getActivePoll);

// POST /api/poll/:pollId/vote
router.post(
  '/poll/:pollId/vote',
  [
    body('optionId')
      .notEmpty().withMessage('optionId is required')
      .isString().trim(),
  ],
  handleValidationErrors,
  publicController.castVote
);

// ─── Homepage Settings (Public Live Clock & Trending) ────────
// GET /api/settings/homepage
router.get('/settings/homepage', publicController.getHomepageSettings);

// ─── Public Platform Stats Overview ──────────────────────────
// GET /api/stats/overview
router.get('/stats/overview', publicController.getOverviewStats);

// ─── Public Announcements & Ticker Tape ───────────────────────
// GET /api/announcements
router.get('/announcements', publicController.getAnnouncements);

module.exports = router;

