// src/routes/admin.routes.js
// Protected admin management routes — ALL require authenticate middleware.
// Mounted at /api/admin
'use strict';

const { Router } = require('express');
const { body, param, query } = require('express-validator');

const adminController = require('../controllers/admin.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');
const { adminUpload } = require('../config/multer');

const router = Router();

// Apply authentication to every route in this router
router.use(authenticate);

// ─── Uploads ──────────────────────────────────────────────────

// GET /api/admin/uploads?status=PENDING
router.get(
  '/uploads',
  [query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])],
  handleValidationErrors,
  adminController.getUploads
);

// POST /api/admin/uploads/bulk-review (bulk approve/reject student uploads)
router.post(
  '/uploads/bulk-review',
  requireRole('ADMIN', 'MODERATOR'),
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
    body('ids.*').isUUID().withMessage('each id must be a valid UUID'),
    body('action').notEmpty().isIn(['APPROVED', 'REJECTED']),
  ],
  handleValidationErrors,
  adminController.bulkReviewUploads
);

// PATCH /api/admin/uploads/:id
router.patch(
  '/uploads/:id',
  [
    param('id').isUUID(),
    body('action').notEmpty().isIn(['APPROVED', 'REJECTED']),
    body('title').optional().isString().trim(),
    body('subjectCode').optional().isString().trim(),
    body('resourceType').optional().isString().trim(),
  ],
  handleValidationErrors,
  adminController.reviewUpload
);

// ─── Resource Requests ────────────────────────────────────────

// GET /api/admin/requests?status=PENDING
router.get(
  '/requests',
  [query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])],
  handleValidationErrors,
  adminController.getRequests
);

// PATCH /api/admin/requests/:id
router.patch(
  '/requests/:id',
  [
    param('id').isUUID(),
    body('action').notEmpty().isIn(['APPROVED', 'REJECTED']),
  ],
  handleValidationErrors,
  adminController.reviewRequest
);

// ─── Resources ────────────────────────────────────────────────

// GET /api/admin/resources
router.get(
  '/resources',
  [
    query('subjectCode').optional().isString().trim(),
    query('search').optional().isString().trim(),
  ],
  handleValidationErrors,
  adminController.getResources
);

// POST /api/admin/resources
router.post(
  '/resources',
  requireRole('ADMIN', 'MODERATOR'),
  adminUpload.single('file'),
  [
    body('subjectId').notEmpty().isUUID(),
    body('title').notEmpty().isString().trim(),
    body('resourceType').notEmpty().isString().trim(),
    body('fileUrl').optional().isURL(),
  ],
  handleValidationErrors,
  adminController.createResource
);

// POST /api/admin/resources/bulk-delete  — MUST be registered before /:id to avoid param collision
router.post(
  '/resources/bulk-delete',
  requireRole('ADMIN'),
  [
    body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
    body('ids.*').isUUID().withMessage('each id must be a valid UUID'),
  ],
  handleValidationErrors,
  adminController.bulkDeleteResources
);

// PUT /api/admin/resources/:id
router.put(
  '/resources/:id',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('title').optional().isString().trim(),
    body('resourceType').optional().isString().trim(),
    body('isActive').optional().isBoolean(),
  ],
  handleValidationErrors,
  adminController.updateResource
);

// DELETE /api/admin/resources/:id  (soft-delete)
router.delete(
  '/resources/:id',
  requireRole('ADMIN'),
  [param('id').isUUID()],
  handleValidationErrors,
  adminController.deleteResource
);

// ─── Opportunities ────────────────────────────────────────────

// GET /api/admin/opportunities
router.get('/opportunities', adminController.getOpportunities);

// POST /api/admin/opportunities
router.post(
  '/opportunities',
  requireRole('ADMIN', 'MODERATOR'),
  [
    body('title').notEmpty().isString().trim(),
    body('link').optional({ nullable: true }).isString().trim(),
    body('deadline').optional({ nullable: true }).isString().trim(),
  ],
  handleValidationErrors,
  adminController.createOpportunity
);

// PUT /api/admin/opportunities/:id
router.put(
  '/opportunities/:id',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('title').optional().isString().trim(),
    body('link').optional({ nullable: true }).isString().trim(),
    body('deadline').optional({ nullable: true }).isString().trim(),
  ],
  handleValidationErrors,
  adminController.updateOpportunity
);

// PATCH /api/admin/opportunities/:id/toggle
router.patch('/opportunities/:id/toggle', requireRole('ADMIN', 'MODERATOR'), adminController.toggleOpportunity);

// DELETE /api/admin/opportunities/:id
router.delete('/opportunities/:id', requireRole('ADMIN'), adminController.deleteOpportunity);

// ─── Announcements ────────────────────────────────────────────

// GET /api/admin/announcements
router.get('/announcements', adminController.getAnnouncements);

// POST /api/admin/announcements
router.post(
  '/announcements',
  requireRole('ADMIN', 'MODERATOR'),
  [body('text').notEmpty().isString().trim()],
  handleValidationErrors,
  adminController.createAnnouncement
);

// PUT /api/admin/announcements/:id
router.put(
  '/announcements/:id',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('text').optional().isString().trim(),
  ],
  handleValidationErrors,
  adminController.updateAnnouncement
);

// PATCH /api/admin/announcements/:id/toggle
router.patch('/announcements/:id/toggle', requireRole('ADMIN', 'MODERATOR'), adminController.toggleAnnouncement);

// DELETE /api/admin/announcements/:id
router.delete('/announcements/:id', requireRole('ADMIN'), adminController.deleteAnnouncement);

// ─── Subscribers (Newsletter Audience) ────────────────────────
// GET /api/admin/subscribers
router.get('/subscribers', adminController.getSubscribers);

// DELETE /api/admin/subscribers/:id
router.delete('/subscribers/:id', requireRole('ADMIN'), adminController.deleteSubscriber);

// ─── Polls / Referendums ─────────────────────────────────────
// GET /api/admin/polls
router.get('/polls', adminController.getPolls);

// POST /api/admin/polls
router.post(
  '/polls',
  requireRole('ADMIN', 'MODERATOR'),
  [
    body('title').notEmpty().withMessage('title is required').isString().trim(),
    body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
    body('options.*.text').notEmpty().withMessage('Option text is required'),
  ],
  handleValidationErrors,
  adminController.createPoll
);

// PUT /api/admin/polls/:id
router.put(
  '/polls/:id',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('title').optional().isString().trim(),
  ],
  handleValidationErrors,
  adminController.updatePoll
);

// PATCH /api/admin/polls/:id/toggle
router.patch(
  '/polls/:id/toggle',
  requireRole('ADMIN', 'MODERATOR'),
  [param('id').isUUID()],
  handleValidationErrors,
  adminController.togglePoll
);

// POST /api/admin/polls/:id/sync-votes
router.post(
  '/polls/:id/sync-votes',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('optionVotes').isArray().withMessage('optionVotes must be an array'),
  ],
  handleValidationErrors,
  adminController.syncPollVotes
);

// DELETE /api/admin/polls/:id
router.delete(
  '/polls/:id',
  requireRole('ADMIN'),
  [param('id').isUUID()],
  handleValidationErrors,
  adminController.deletePoll
);

// ─── Telemetry & Analytics ────────────────────────────────────
// GET /api/admin/analytics/dashboard
router.get(
  '/analytics/dashboard',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.getDashboardAnalytics
);

// ─── Homepage Settings (Live Semester Clock & Trending) ──────
// GET /api/admin/settings/homepage
router.get(
  '/settings/homepage',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.getHomepageSettings
);

// PUT /api/admin/settings/homepage
router.put(
  '/settings/homepage',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.updateHomepageSettings
);

// PUT /api/admin/settings/live-clock
router.put(
  '/settings/live-clock',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.updateLiveClock
);

// PUT /api/admin/settings/trending
router.put(
  '/settings/trending',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.updateTrending
);

// POST /api/admin/settings/upload-pack-file (Admin uploads study pack PDF / files)
router.post(
  '/settings/upload-pack-file',
  requireRole('ADMIN', 'MODERATOR'),
  adminUpload.single('file'),
  adminController.uploadPackFile
);

// PUT /api/admin/settings/video
router.put(
  '/settings/video',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.updateVideo
);

// PUT /api/admin/settings/learning-platforms
router.put(
  '/settings/learning-platforms',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.updateLearningPlatforms
);

// PUT /api/admin/settings/community-groups
router.put(
  '/settings/community-groups',
  requireRole('ADMIN', 'MODERATOR'),
  adminController.updateCommunityGroups
);

// ─── Academic Catalog (Departments / Semesters / Subjects) ────
router.use('/catalog', require('./catalog.routes'));

module.exports = router;

