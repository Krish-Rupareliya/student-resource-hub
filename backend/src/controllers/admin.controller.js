// src/controllers/admin.controller.js
// Protected admin management endpoints — delegates to admin.service.js
'use strict';

const path          = require('path');
const fs            = require('fs');
const adminService  = require('../services/admin.service');
const driveService  = require('../services/drive.service');
const prisma        = require('../config/prisma');
const { UPLOAD_DIR } = require('../config/multer');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Uploads ──────────────────────────────────────────────────

// GET /api/admin/uploads?status=PENDING
async function getUploads(req, res, next) {
  try {
    const { status } = req.query;
    const valid = ['PENDING', 'APPROVED', 'REJECTED'];
    const statusFilter = valid.includes(status?.toUpperCase())
      ? status.toUpperCase()
      : 'PENDING';
    const uploads = await adminService.getUploads(statusFilter);
    return sendSuccess(res, uploads);
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/uploads/:id
async function reviewUpload(req, res, next) {
  try {
    const { id } = req.params;
    const { action, title, subjectCode, resourceType } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(action?.toUpperCase())) {
      return sendError(res, 'action must be APPROVED or REJECTED', 400);
    }
    const result = await adminService.reviewUpload(id, action.toUpperCase(), { title, subjectCode, resourceType });
    return sendSuccess(res, result, 200, `Upload ${action.toLowerCase()} successfully`);
  } catch (err) {
    return next(err);
  }
}

// ─── Resource Requests ────────────────────────────────────────

// GET /api/admin/requests?status=PENDING
async function getRequests(req, res, next) {
  try {
    const { status } = req.query;
    const valid = ['PENDING', 'APPROVED', 'REJECTED'];
    const statusFilter = valid.includes(status?.toUpperCase())
      ? status.toUpperCase()
      : 'PENDING';
    const requests = await adminService.getRequests(statusFilter);
    return sendSuccess(res, requests);
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/requests/:id
async function reviewRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(action?.toUpperCase())) {
      return sendError(res, 'action must be APPROVED or REJECTED', 400);
    }
    const result = await adminService.reviewRequest(id, action.toUpperCase());
    return sendSuccess(res, result, 200, `Request ${action.toLowerCase()} successfully`);
  } catch (err) {
    return next(err);
  }
}

// ─── Resources ────────────────────────────────────────────────

// GET /api/admin/resources
async function getResources(req, res, next) {
  try {
    const { subjectCode, search } = req.query;
    const data = await adminService.getResources({ subjectCode, search });
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/resources
async function createResource(req, res, next) {
  try {
    let fileUrl     = req.body.fileUrl || null;
    let fileKey     = req.body.fileKey || null;
    let driveFileId = null;
    let webViewLink = null;

    if (req.file) {
      // ── Resolve Department + Semester + Subject names for folder structure ──
      // Subject ➔ Semester ➔ Department
      let departmentName = 'General';
      let semesterName   = 'General';
      let subjectName    = 'General';

      if (req.body.subjectId) {
        const subject = await prisma.subject.findUnique({
          where:   { id: req.body.subjectId },
          include: { semester: { include: { department: true } } },
        });

        if (subject?.semester?.department?.name) {
          departmentName = subject.semester.department.name;
        }
        if (subject?.semester?.name) {
          semesterName = subject.semester.name;
        }
        if (subject?.title) {
          subjectName = subject.title;
        }
      }

      // ── Upload into Root ➔ Department ➔ Semester ➔ Subject ➔ ResourceType ──
      const result = await driveService.uploadFileToDrive(
        req.file,
        departmentName,
        semesterName,
        subjectName,
        req.body.resourceType || 'General',
      );

      driveFileId = result.fileId;
      webViewLink = result.webViewLink;
      fileKey     = result.fileId;
      fileUrl     = result.webViewLink;
    }

    const resource = await adminService.createResource({
      subjectId:    req.body.subjectId,
      title:        req.body.title,
      description:  req.body.description || null,
      resourceType: req.body.resourceType,
      fileUrl,
      fileKey,
      driveFileId,
      webViewLink,
      fileSize: req.file?.size || req.body.fileSize || null,
      mimeType: req.file?.mimetype || req.body.mimeType || null,
      source:   req.body.source || 'admin',
    });
    return sendSuccess(res, resource, 201, 'Resource created');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/resources/:id
async function updateResource(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch current record so we can detect title changes and get driveFileId
    const current = await prisma.resource.findUnique({ where: { id } });
    if (!current) return sendError(res, 'Resource not found', 404);

    // Strict allowlist — never accept arbitrary fields from the client
    const ALLOWED = ['title', 'description', 'resourceType', 'subjectId', 'source', 'isActive'];
    const updateData = {};
    for (const key of ALLOWED) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updateData[key] = req.body[key];
      }
    }

    // If title is being changed and the resource lives on Drive, rename it there
    const newTitle = updateData.title;
    if (newTitle && newTitle !== current.title && current.driveFileId) {
      try {
        await driveService.renameInDrive(current.driveFileId, newTitle, current.mimeType);
      } catch (driveErr) {
        // Log but don't block the DB update — Drive rename is best-effort
        console.error('[admin.controller] renameInDrive failed:', driveErr.message);
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data:  updateData,
    });
    return sendSuccess(res, resource, 200, 'Resource updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/resources/:id  (hard-delete from DB + Drive)
async function deleteResource(req, res, next) {
  try {
    const { id } = req.params;

    // 1. Fetch the DB record to get the Drive file ID before deleting
    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) return sendError(res, 'Resource not found', 404);

    // 2. Delete the physical file from Google Drive (404-tolerant)
    if (resource.driveFileId) {
      await driveService.deleteFromDrive(resource.driveFileId);
    }

    // 3. Hard-delete the database record
    await prisma.resource.delete({ where: { id } });

    return sendSuccess(res, { id }, 200, 'Resource permanently deleted from database and Google Drive');
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/resources/bulk-delete  (hard-delete multiple resources by ID array)
async function bulkDeleteResources(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'ids must be a non-empty array of resource UUIDs', 400);
    }
    const result = await adminService.bulkDeleteResources(ids);
    return sendSuccess(
      res,
      result,
      200,
      `${result.deleted} resource(s) permanently deleted from database and Google Drive`,
    );
  } catch (err) {
    return next(err);
  }
}

// ─── Opportunities ────────────────────────────────────────────

// GET /api/admin/opportunities
async function getOpportunities(req, res, next) {
  try {
    const data = await adminService.getOpportunities();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/opportunities
async function createOpportunity(req, res, next) {
  try {
    const { title, description, category, tag, pinBg, link, deadline } = req.body;
    const opportunity = await adminService.createOpportunity({
      title,
      description: description || null,
      category: category || null,
      tag: tag || null,
      pinBg: pinBg || null,
      link: link || null,
      deadline: deadline || null,
    });
    return sendSuccess(res, opportunity, 201, 'Opportunity published');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/opportunities/:id
async function updateOpportunity(req, res, next) {
  try {
    const opportunity = await adminService.updateOpportunity(req.params.id, req.body);
    return sendSuccess(res, opportunity, 200, 'Opportunity updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/opportunities/:id/toggle
async function toggleOpportunity(req, res, next) {
  try {
    const data = await adminService.toggleOpportunity(req.params.id);
    return sendSuccess(res, data, 200, 'Opportunity updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/opportunities/:id
async function deleteOpportunity(req, res, next) {
  try {
    await adminService.deleteOpportunity(req.params.id);
    return sendSuccess(res, null, 200, 'Opportunity deleted');
  } catch (err) {
    return next(err);
  }
}

// ─── Announcements ────────────────────────────────────────────

// GET /api/admin/announcements
async function getAnnouncements(req, res, next) {
  try {
    const data = await adminService.getAnnouncements();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/announcements
async function createAnnouncement(req, res, next) {
  try {
    const { text, badge, color, deadline } = req.body;
    const data = await adminService.createAnnouncement({ text, badge, color, deadline });
    return sendSuccess(res, data, 201, 'Announcement created');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/announcements/:id
async function updateAnnouncement(req, res, next) {
  try {
    const data = await adminService.updateAnnouncement(req.params.id, req.body);
    return sendSuccess(res, data, 200, 'Announcement updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/announcements/:id/toggle
async function toggleAnnouncement(req, res, next) {
  try {
    const data = await adminService.toggleAnnouncement(req.params.id);
    return sendSuccess(res, data, 200, 'Announcement updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/announcements/:id
async function deleteAnnouncement(req, res, next) {
  try {
    await adminService.deleteAnnouncement(req.params.id);
    return sendSuccess(res, null, 200, 'Announcement deleted');
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/uploads/bulk-review
async function bulkReviewUploads(req, res, next) {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'ids must be a non-empty array of upload UUIDs', 400);
    }
    const result = await adminService.bulkReviewUploads(ids, action);
    return sendSuccess(res, result, 200, `${result.count} upload(s) marked as ${action}`);
  } catch (err) {
    return next(err);
  }
}

// GET /api/admin/subscribers
async function getSubscribers(req, res, next) {
  try {
    const data = await adminService.getSubscribers();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/subscribers/:id
async function deleteSubscriber(req, res, next) {
  try {
    await adminService.deleteSubscriber(req.params.id);
    return sendSuccess(res, null, 200, 'Subscriber removed');
  } catch (err) {
    return next(err);
  }
}

// ─── Polls / Referendums ─────────────────────────────────────

// GET /api/admin/polls
async function getPolls(req, res, next) {
  try {
    const data = await adminService.getPolls();
    return sendSuccess(res, data, 200, 'Polls retrieved successfully');
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/polls
async function createPoll(req, res, next) {
  try {
    const data = await adminService.createPoll(req.body);
    return sendSuccess(res, data, 201, 'Poll created successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/polls/:id
async function updatePoll(req, res, next) {
  try {
    const data = await adminService.updatePoll(req.params.id, req.body);
    return sendSuccess(res, data, 200, 'Poll updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/polls/:id/toggle
async function togglePoll(req, res, next) {
  try {
    const data = await adminService.togglePoll(req.params.id);
    return sendSuccess(res, data, 200, 'Poll status updated');
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/polls/:id/sync-votes
async function syncPollVotes(req, res, next) {
  try {
    const { optionVotes } = req.body;
    const data = await adminService.syncPollVotes(req.params.id, optionVotes);
    return sendSuccess(res, data, 200, 'Poll votes synced successfully');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/polls/:id
async function deletePoll(req, res, next) {
  try {
    await adminService.deletePoll(req.params.id);
    return sendSuccess(res, null, 200, 'Poll deleted successfully');
  } catch (err) {
    return next(err);
  }
}

// GET /api/admin/settings/homepage
async function getHomepageSettings(req, res, next) {
  try {
    const publicService = require('../services/public.service');
    const data = await publicService.getHomepageSettings();
    return sendSuccess(res, data, 200, 'Homepage settings retrieved successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/settings/homepage
async function updateHomepageSettings(req, res, next) {
  try {
    const { liveClock, trending } = req.body;
    const data = await adminService.updateHomepageSettings({ liveClock, trending });
    return sendSuccess(res, data, 200, 'Homepage settings updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/settings/live-clock
async function updateLiveClock(req, res, next) {
  try {
    const data = await adminService.updateLiveClockSettings(req.body);
    return sendSuccess(res, data, 200, 'Live semester clock settings updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/settings/trending
async function updateTrending(req, res, next) {
  try {
    const data = await adminService.updateTrendingSettings(req.body);
    return sendSuccess(res, data, 200, 'Trending settings updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/settings/video
async function updateVideo(req, res, next) {
  try {
    const data = await adminService.updateVideoSettings(req.body);
    return sendSuccess(res, data, 200, 'Video tour settings updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/settings/learning-platforms
async function updateLearningPlatforms(req, res, next) {
  try {
    const data = await adminService.updateLearningPlatformsSettings(req.body);
    return sendSuccess(res, data, 200, 'Learning platforms updated successfully');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/settings/community-groups
async function updateCommunityGroups(req, res, next) {
  try {
    const data = await adminService.updateCommunityGroupsSettings(req.body);
    return sendSuccess(res, data, 200, 'Community group links updated successfully');
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/settings/upload-pack-file
async function uploadPackFile(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded for study pack', 400);
    }

    const ext = path.extname(req.file.originalname) || '.pdf';
    const baseClean = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}-${baseClean}${ext}`;

    // 1. Save to backend uploads/packs/ directory
    const packsDir = path.join(UPLOAD_DIR, 'packs');
    if (!fs.existsSync(packsDir)) {
      fs.mkdirSync(packsDir, { recursive: true });
    }
    const backendFilePath = path.join(packsDir, safeFilename);
    fs.writeFileSync(backendFilePath, req.file.buffer);

    // 2. Also save to frontend/public/downloads if local repo path exists
    const frontendDownloadsDir = path.resolve(__dirname, '../../../frontend/public/downloads');
    if (fs.existsSync(frontendDownloadsDir)) {
      try {
        fs.writeFileSync(path.join(frontendDownloadsDir, safeFilename), req.file.buffer);
      } catch (copyErr) {
        console.warn('[admin.controller] Could not copy to frontend/public/downloads:', copyErr.message);
      }
    }

    const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = req.file.size >= 1024 * 1024 ? `${sizeInMB} MB` : `${Math.max(1, Math.round(req.file.size / 1024))} KB`;
    const format = ext.replace('.', '').toUpperCase() || 'PDF';

    // File URL that works both in local dev and production
    const fileUrl = `/downloads/${safeFilename}`;

    return sendSuccess(
      res,
      {
        fileUrl,
        downloadUrl: fileUrl,
        serverPath: `/uploads/packs/${safeFilename}`,
        fileName: req.file.originalname,
        fileSize: formattedSize,
        format,
      },
      201,
      'Study pack file uploaded successfully'
    );
  } catch (err) {
    return next(err);
  }
}

// GET /api/admin/analytics/dashboard
async function getDashboardAnalytics(req, res, next) {
  try {
    const data = await adminService.getDashboardAnalytics();
    return sendSuccess(res, data, 200, 'Dashboard analytics retrieved successfully');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUploads, reviewUpload, bulkReviewUploads,
  getRequests, reviewRequest,
  getResources, createResource, updateResource, deleteResource, bulkDeleteResources,
  getOpportunities, createOpportunity, updateOpportunity, toggleOpportunity, deleteOpportunity,
  getAnnouncements, createAnnouncement, updateAnnouncement, toggleAnnouncement, deleteAnnouncement,
  getSubscribers, deleteSubscriber,
  getPolls, createPoll, updatePoll, togglePoll, syncPollVotes, deletePoll,
  getDashboardAnalytics,
  getHomepageSettings,
  updateHomepageSettings,
  updateLiveClock,
  updateTrending,
  uploadPackFile,
  updateVideo,
  updateLearningPlatforms,
  updateCommunityGroups,
};

