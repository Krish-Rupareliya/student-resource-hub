// src/services/catalog.service.js
// Academic Catalog CRUD — Departments, Semesters, Subjects.
// All DB access goes through Prisma; never called directly from the browser.
'use strict';

const prisma       = require('../config/prisma');
const driveService = require('./drive.service');
const { clearPublicCache } = require('./public.service');

// ─── Helpers ──────────────────────────────────────────────────

function notFound(entity, id) {
  const err = new Error(`${entity} with id "${id}" not found`);
  err.statusCode = 404;
  return err;
}

function conflict(msg) {
  const err = new Error(msg);
  err.statusCode = 409;
  return err;
}

function forbidden(msg) {
  const err = new Error(msg);
  err.statusCode = 400;
  return err;
}

// ─── Departments (Branches) ───────────────────────────────────

/**
 * Return all departments with their semesters and subjects nested.
 * Used to render the full catalog tree in the admin panel.
 */
async function getDepartments() {
  return prisma.department.findMany({
    orderBy: { code: 'asc' },
    include: {
      semesters: {
        // Primary: logical semester number. Secondary: admin sort position.
        orderBy: [{ semesterNumber: 'asc' }, { sortOrder: 'asc' }],
        include: {
          subjects: {
            // Primary: admin sort position. Secondary: title for deterministic tie-break.
            orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
            include: {
              // Embed lightweight resource rows for the checklist modal
              resources: {
                select: { id: true, title: true, resourceType: true },
                orderBy: { createdAt: 'asc' },
              },
              _count: { select: { resources: true } },
            },
          },
          _count: { select: { subjects: true } },
        },
      },
      _count: { select: { semesters: true } },
    },
  });
}

/**
 * Create a new department (branch).
 * @param {{ code: string, name: string }} data
 */
async function createDepartment({ code, name }) {
  const upper = code.toUpperCase().trim();

  const existing = await prisma.department.findUnique({ where: { code: upper } });
  if (existing) throw conflict(`Department code "${upper}" is already taken`);

  const created = await prisma.department.create({ data: { code: upper, name: name.trim() } });
  clearPublicCache('catalog');
  return created;
}

/**
 * Update an existing department's code and/or name.
 * @param {number} id
 * @param {{ code?: string, name?: string }} data
 */
async function updateDepartment(id, { code, name }) {
  const dept = await prisma.department.findUnique({ where: { id } });
  if (!dept) throw notFound('Department', id);

  const updateData = {};
  if (name) updateData.name = name.trim();
  if (code) {
    const upper = code.toUpperCase().trim();
    // Check uniqueness only if code is changing
    if (upper !== dept.code) {
      const taken = await prisma.department.findUnique({ where: { code: upper } });
      if (taken) throw conflict(`Department code "${upper}" is already taken`);
    }
    updateData.code = upper;
  }

  const updated = await prisma.department.update({ where: { id }, data: updateData });
  clearPublicCache('catalog');
  return updated;
}

/**
 * Delete a department. Blocked if it has any semesters.
 * @param {number} id
 */
async function deleteDepartment(id) {
  const dept = await prisma.department.findUnique({
    where: { id },
    include: { _count: { select: { semesters: true } } },
  });
  if (!dept) throw notFound('Department', id);
  if (dept._count.semesters > 0) {
    throw forbidden(
      `Cannot delete "${dept.name}" — it still has ${dept._count.semesters} semester(s). Delete or reassign them first.`
    );
  }

  const deleted = await prisma.department.delete({ where: { id } });
  clearPublicCache('catalog');
  return deleted;
}

// ─── Semesters ────────────────────────────────────────────────

/**
 * Create a new semester under a department.
 * @param {{ departmentId: number, semesterNumber: number, name: string, description?: string, bgColor?: string, pinColor?: string }} data
 */
async function createSemester({ departmentId, semesterNumber, name, description, bgColor, pinColor }) {
  const dept = await prisma.department.findUnique({ where: { id: Number(departmentId) } });
  if (!dept) throw notFound('Department', departmentId);

  // Prevent duplicate semester number within the same department
  const dup = await prisma.semester.findFirst({
    where: { departmentId: Number(departmentId), semesterNumber: Number(semesterNumber) },
  });
  if (dup) {
    throw conflict(`Semester ${semesterNumber} already exists in "${dept.name}"`);
  }

  const created = await prisma.semester.create({
    data: {
      departmentId: Number(departmentId),
      semesterNumber: Number(semesterNumber),
      name: name.trim(),
      description: description?.trim() || null,
      bgColor: bgColor || null,
      pinColor: pinColor || null,
    },
  });
  clearPublicCache('catalog');
  return created;
}

/**
 * Update semester metadata (name, description, semester number, UI colors).
 * @param {number} id
 * @param {object} data
 */
async function updateSemester(id, { semesterNumber, name, description, bgColor, pinColor, sortOrder }) {
  const sem = await prisma.semester.findUnique({ where: { id: Number(id) } });
  if (!sem) throw notFound('Semester', id);

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description?.trim() || null;
  if (semesterNumber !== undefined) updateData.semesterNumber = Number(semesterNumber);
  if (bgColor !== undefined) updateData.bgColor = bgColor || null;
  if (pinColor !== undefined) updateData.pinColor = pinColor || null;
  if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

  const updated = await prisma.semester.update({ where: { id: Number(id) }, data: updateData });
  clearPublicCache('catalog');
  return updated;
}

/**
 * Delete a semester. Blocked if it still has subjects.
 * @param {number} id
 */
async function deleteSemester(id) {
  const sem = await prisma.semester.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { subjects: true } } },
  });
  if (!sem) throw notFound('Semester', id);
  if (sem._count.subjects > 0) {
    throw forbidden(
      `Cannot delete "${sem.name}" — it has ${sem._count.subjects} subject(s). Remove them first.`
    );
  }

  const deleted = await prisma.semester.delete({ where: { id: Number(id) } });
  clearPublicCache('catalog');
  return deleted;
}

/**
 * Cascade-delete a semester along with ALL its subjects and resources.
 * Also removes every associated Google Drive file (404-tolerant).
 * @param {number} id  Semester PK
 * @returns {{ semesterId: number, subjectsDeleted: number, resourcesDeleted: number }}
 */
async function deleteSemesterCascade(id) {
  const numId = Number(id);

  // 1. Load the semester to confirm it exists.
  const sem = await prisma.semester.findUnique({ where: { id: numId } });
  if (!sem) throw notFound('Semester', id);

  // 2. Load all resources nested under this semester's subjects (only the fields we need).
  const subjects = await prisma.subject.findMany({
    where: { semesterId: numId },
    select: {
      id: true,
      resources: { select: { id: true, driveFileId: true } },
    },
  });

  const allResources = subjects.flatMap(s => s.resources);
  const subjectIds   = subjects.map(s => s.id);

  // 3. Best-effort Drive cleanup — log errors, never block.
  await Promise.allSettled(
    allResources
      .filter(r => r.driveFileId)
      .map(r =>
        driveService.deleteFromDrive(r.driveFileId).catch(err =>
          console.error(`[catalog.service] cascade: Drive delete failed for ${r.driveFileId}:`, err.message)
        )
      )
  );

  // 4. Transactional DB cleanup: resources → subjects → semester.
  await prisma.$transaction([
    prisma.resource.deleteMany({ where: { subjectId: { in: subjectIds } } }),
    prisma.subject.deleteMany({  where: { semesterId: numId } }),
    prisma.semester.delete({     where: { id: numId } }),
  ]);

  clearPublicCache('catalog');
  clearPublicCache('resources');

  return {
    semesterId:       numId,
    subjectsDeleted:  subjects.length,
    resourcesDeleted: allResources.length,
  };
}

// ─── Subjects ─────────────────────────────────────────────────

/**
 * Create a new subject under a semester.
 * @param {{ semesterId: number, code: string, title: string, shortForm?: string, description?: string, icon?: string }} data
 */
async function createSubject({ semesterId, code, title, shortForm, description, icon, bgColor, pinColor, cardType, path }) {
  const sem = await prisma.semester.findUnique({ where: { id: Number(semesterId) } });
  if (!sem) throw notFound('Semester', semesterId);

  const upper = code.toUpperCase().trim();
  const dup = await prisma.subject.findUnique({ where: { code: upper } });
  if (dup) throw conflict(`Subject code "${upper}" is already taken`);

  const created = await prisma.subject.create({
    data: {
      semesterId: Number(semesterId),
      code: upper,
      title: title.trim(),
      shortForm: shortForm?.trim().toUpperCase() || null,
      description: description?.trim() || null,
      icon: icon || null,
      bgColor: bgColor || null,
      pinColor: pinColor || null,
      cardType: cardType || null,
      path: path || null,
    },
  });
  clearPublicCache('catalog');
  return created;
}

/**
 * Update subject metadata.
 * @param {string} id  Subject UUID
 * @param {object} data
 */
async function updateSubject(id, { code, title, shortForm, description, icon, bgColor, pinColor, cardType, path, sortOrder }) {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) throw notFound('Subject', id);

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (shortForm !== undefined) updateData.shortForm = shortForm?.trim().toUpperCase() || null;
  if (description !== undefined) updateData.description = description?.trim() || null;
  if (icon !== undefined) updateData.icon = icon || null;
  if (bgColor !== undefined) updateData.bgColor = bgColor || null;
  if (pinColor !== undefined) updateData.pinColor = pinColor || null;
  if (cardType !== undefined) updateData.cardType = cardType || null;
  if (path !== undefined) updateData.path = path || null;
  if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

  if (code !== undefined) {
    const upper = code.toUpperCase().trim();
    if (upper !== subject.code) {
      const taken = await prisma.subject.findUnique({ where: { code: upper } });
      if (taken) throw conflict(`Subject code "${upper}" is already taken`);
    }
    updateData.code = upper;
  }

  const updated = await prisma.subject.update({ where: { id }, data: updateData });
  clearPublicCache('catalog');
  return updated;
}

/**
 * Delete a subject. Blocked if it has active resources.
 * @param {string} id  Subject UUID
 */
async function deleteSubject(id) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { resources: true } } },
  });
  if (!subject) throw notFound('Subject', id);
  if (subject._count.resources > 0) {
    throw forbidden(
      `Cannot delete "${subject.title}" — it has ${subject._count.resources} resource(s). Remove them first.`
    );
  }

  const deleted = await prisma.subject.delete({ where: { id } });
  clearPublicCache('catalog');
  return deleted;
}

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createSemester,
  updateSemester,
  deleteSemester,
  deleteSemesterCascade,
  createSubject,
  updateSubject,
  deleteSubject,
};
