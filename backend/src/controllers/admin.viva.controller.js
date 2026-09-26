// src/controllers/admin.viva.controller.js
// Admin Viva Questions & Answers Management controller.
'use strict';

const adminVivaService = require('../services/admin.viva.service');
const { sendSuccess, sendError } = require('../utils/response');
const prisma = require('../config/prisma');

/**
 * GET /api/admin/viva
 * List questions with search, pagination, and multi-level filters.
 */
async function getQuestions(req, res, next) {
  try {
    const result = await adminVivaService.getVivaQuestions(req.query);
    return sendSuccess(res, result);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/viva/:id
 * Retrieve single question details.
 */
async function getQuestionById(req, res, next) {
  try {
    const { id } = req.params;
    const question = await adminVivaService.getVivaQuestionById(id);
    if (!question) {
      return sendError(res, 'Viva question not found', 404);
    }
    return sendSuccess(res, question);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/viva
 * Create a new question.
 */
async function createQuestion(req, res, next) {
  try {
    const created = await adminVivaService.createVivaQuestion(req.body);
    return sendSuccess(res, created, 201, 'Viva question created successfully');
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/admin/viva/:id
 * Update an existing question.
 */
async function updateQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await adminVivaService.updateVivaQuestion(id, req.body);
    return sendSuccess(res, updated, 200, 'Viva question updated successfully');
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/admin/viva/:id
 * Delete a question.
 */
async function deleteQuestion(req, res, next) {
  try {
    const { id } = req.params;
    const result = await adminVivaService.deleteVivaQuestion(id);
    return sendSuccess(res, result, 200, 'Viva question deleted successfully');
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/admin/viva/:id/toggle
 * Toggle publish/draft status.
 */
async function togglePublish(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await adminVivaService.togglePublishStatus(id);
    const statusText = updated.isPublished ? 'published' : 'saved as draft';
    return sendSuccess(res, updated, 200, `Question ${statusText}`);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/viva/bulk-import
 * Bulk import questions with duplicate detection.
 */
async function bulkImport(req, res, next) {
  try {
    const result = await adminVivaService.bulkImportVivaQuestions(req.body);
    return sendSuccess(
      res,
      result,
      200,
      `Imported ${result.successCount} questions (${result.skippedCount} skipped duplicates)`
    );
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/admin/viva/bulk-delete
 * Delete multiple viva questions.
 */
async function bulkDeleteQuestions(req, res, next) {
  try {
    const result = await adminVivaService.bulkDeleteVivaQuestions(req.body);
    return sendSuccess(res, result, 200, result.message);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/admin/viva/sample-json
 * Download sample JSON template for bulk import.
 */
async function getSampleJson(req, res, next) {
  try {
    const sample = adminVivaService.getSampleImportJson();
    return sendSuccess(res, sample);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkDeleteQuestions,
  togglePublish,
  bulkImport,
  getSampleJson,
};
