// src/routes/admin.viva.routes.js
// Protected admin endpoints for Viva Question & Answer Management.
// Mounted at /api/admin/viva
'use strict';

const { Router } = require('express');
const { body, param, query } = require('express-validator');

const adminVivaController = require('../controllers/admin.viva.controller');
const { requireRole } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');

const router = Router();

// GET /api/admin/viva/sample-json (Must be before /:id)
router.get('/sample-json', adminVivaController.getSampleJson);

// GET /api/admin/viva
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  adminVivaController.getQuestions
);

// GET /api/admin/viva/:id
router.get(
  '/:id',
  [param('id').isUUID()],
  handleValidationErrors,
  adminVivaController.getQuestionById
);

// POST /api/admin/viva
router.post(
  '/',
  requireRole('ADMIN', 'MODERATOR'),
  [
    body('subjectId').notEmpty().isUUID().withMessage('Valid subjectId UUID is required'),
    body('question').notEmpty().isString().trim().withMessage('Question text is required'),
    body('detailedAnswer').notEmpty().isString().trim().withMessage('Detailed answer is required'),
    body('section').optional().isString().trim(),
    body('category').optional().isString().trim(),
    body('difficulty').optional().isIn(['basic', 'intermediate', 'advanced']),
    body('isPublished').optional().isBoolean(),
  ],
  handleValidationErrors,
  adminVivaController.createQuestion
);

// PUT /api/admin/viva/:id
router.put(
  '/:id',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('question').optional().isString().trim(),
    body('detailedAnswer').optional().isString().trim(),
  ],
  handleValidationErrors,
  adminVivaController.updateQuestion
);

// PATCH /api/admin/viva/:id/toggle
router.patch(
  '/:id/toggle',
  requireRole('ADMIN', 'MODERATOR'),
  [param('id').isUUID()],
  handleValidationErrors,
  adminVivaController.togglePublish
);

// DELETE /api/admin/viva/:id
router.delete(
  '/:id',
  requireRole('ADMIN'),
  [param('id').isUUID()],
  handleValidationErrors,
  adminVivaController.deleteQuestion
);

// POST /api/admin/viva/bulk-delete
router.post(
  '/bulk-delete',
  requireRole('ADMIN'),
  [
    body('ids').optional().isArray().withMessage('ids must be an array of question IDs'),
    body('ids.*').optional().isUUID().withMessage('Each ID must be a valid UUID'),
    body('deleteAllMatching').optional().isBoolean(),
  ],
  handleValidationErrors,
  adminVivaController.bulkDeleteQuestions
);

// POST /api/admin/viva/bulk-import
router.post(
  '/bulk-import',
  requireRole('ADMIN', 'MODERATOR'),
  [
    body('subjectId').optional().isUUID().withMessage('subjectId must be a valid UUID'),
    body('subjectCode').optional().isString().trim(),
    body('questions').isArray({ min: 1 }).withMessage('questions must be a non-empty array'),
  ],
  handleValidationErrors,
  adminVivaController.bulkImport
);

module.exports = router;
