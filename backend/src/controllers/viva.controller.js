// src/controllers/viva.controller.js
// Universal Viva Questions & Solutions controller.
'use strict';

const vivaService = require('../services/viva.service');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/viva/:subjectCode
async function getSubjectViva(req, res, next) {
  try {
    const { subjectCode } = req.params;
    if (!subjectCode) {
      return sendError(res, 'Subject code is required', 400);
    }
    const data = await vivaService.getVivaDataForSubject(subjectCode);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSubjectViva
};
