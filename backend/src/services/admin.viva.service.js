// src/services/admin.viva.service.js
// Admin Viva Questions & Solutions Management service.
'use strict';

const prisma = require('../config/prisma');

/**
 * Fetch paginated list of viva questions with dynamic filters.
 */
async function getVivaQuestions(filters = {}) {
  const {
    departmentId,
    semesterId,
    subjectId,
    subjectCode,
    unitId,
    category,
    difficulty,
    isPublished,
    search,
    page = 1,
    limit = 25,
  } = filters;

  const where = {};

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { question: { contains: q } },
      { shortAnswer: { contains: q } },
      { detailedAnswer: { contains: q } },
      { tags: { contains: q } },
      { section: { contains: q } },
    ];
  }

  if (subjectId) {
    where.subjectId = subjectId;
  } else if (subjectCode) {
    where.subject = { code: { equals: subjectCode.toUpperCase().trim() } };
  }

  if (semesterId) {
    where.subject = {
      ...(where.subject || {}),
      semesterId: Number(semesterId),
    };
  }

  if (departmentId) {
    where.subject = {
      ...(where.subject || {}),
      semester: {
        departmentId: Number(departmentId),
      },
    };
  }

  if (unitId && unitId !== 'all') {
    where.unitId = unitId;
  }

  if (category && category !== 'all') {
    where.category = category.toLowerCase();
  }

  if (difficulty && difficulty !== 'all') {
    where.difficulty = difficulty.toLowerCase();
  }

  if (isPublished !== undefined && isPublished !== 'all' && isPublished !== '') {
    where.isPublished = isPublished === 'true' || isPublished === true;
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const take = Math.max(1, Math.min(100, Number(limit) || 25));
  const skip = (pageNum - 1) * take;

  const [totalCount, items] = await Promise.all([
    prisma.vivaQuestion.count({ where }),
    prisma.vivaQuestion.findMany({
      where,
      skip,
      take,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
            semesterId: true,
            semester: {
              select: {
                id: true,
                semesterNumber: true,
                departmentId: true,
                department: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const parsedItems = items.map((q) => formatQuestionRecord(q));

  return {
    questions: parsedItems,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(totalCount / take) || 1,
    },
  };
}

/**
 * Fetch a single viva question by ID.
 */
async function getVivaQuestionById(id) {
  const item = await prisma.vivaQuestion.findUnique({
    where: { id },
    include: {
      subject: {
        select: {
          id: true,
          code: true,
          title: true,
          semesterId: true,
          semester: {
            select: {
              id: true,
              semesterNumber: true,
              departmentId: true,
              department: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!item) return null;
  return formatQuestionRecord(item);
}

/**
 * Create a new viva question.
 */
async function createVivaQuestion(data) {
  const {
    subjectId,
    unitId = 'unit-1',
    section = 'Unit 1: Theory',
    category = 'theory',
    questionNumber = null,
    question,
    shortAnswer = null,
    detailedAnswer,
    difficulty = 'basic',
    tags = null,
    followUpQuestions = null,
    quickRevision = null,
    diagram = null,
    imageUrl = null,
    source = null,
    isPublished = true,
    sortOrder = 0,
  } = data;

  if (!subjectId) {
    throw new Error('subjectId is required');
  }
  if (!question || !question.trim()) {
    throw new Error('Question text is required');
  }
  if (!detailedAnswer || !detailedAnswer.trim()) {
    throw new Error('Detailed answer is required');
  }

  // Verify subject exists
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) {
    throw new Error(`Subject with ID ${subjectId} not found`);
  }

  const tagsStr = Array.isArray(tags) ? JSON.stringify(tags) : tags;
  const followUpStr = Array.isArray(followUpQuestions)
    ? JSON.stringify(followUpQuestions)
    : followUpQuestions;
  const sourceStr = typeof source === 'object' && source !== null ? JSON.stringify(source) : source;

  const created = await prisma.vivaQuestion.create({
    data: {
      subjectId,
      unitId,
      section,
      category: (category || 'theory').toLowerCase(),
      questionNumber,
      question: question.trim(),
      shortAnswer: shortAnswer ? shortAnswer.trim() : null,
      detailedAnswer: detailedAnswer.trim(),
      difficulty: (difficulty || 'basic').toLowerCase(),
      tags: tagsStr,
      followUpQuestions: followUpStr,
      quickRevision: quickRevision ? quickRevision.trim() : null,
      diagram: diagram ? diagram.trim() : null,
      imageUrl: imageUrl ? imageUrl.trim() : null,
      source: sourceStr,
      isPublished: Boolean(isPublished),
      sortOrder: Number(sortOrder) || 0,
    },
    include: {
      subject: {
        select: {
          id: true,
          code: true,
          title: true,
        },
      },
    },
  });

  return formatQuestionRecord(created);
}

/**
 * Update an existing viva question.
 */
async function updateVivaQuestion(id, data) {
  const existing = await prisma.vivaQuestion.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Viva question not found');
  }

  const updateData = {};

  if (data.subjectId !== undefined) {
    const s = await prisma.subject.findUnique({ where: { id: data.subjectId } });
    if (!s) throw new Error(`Subject with ID ${data.subjectId} not found`);
    updateData.subjectId = data.subjectId;
  }
  if (data.unitId !== undefined) updateData.unitId = data.unitId;
  if (data.section !== undefined) updateData.section = data.section;
  if (data.category !== undefined) updateData.category = data.category.toLowerCase();
  if (data.questionNumber !== undefined) updateData.questionNumber = data.questionNumber;
  if (data.question !== undefined) updateData.question = data.question.trim();
  if (data.shortAnswer !== undefined) updateData.shortAnswer = data.shortAnswer ? data.shortAnswer.trim() : null;
  if (data.detailedAnswer !== undefined) updateData.detailedAnswer = data.detailedAnswer.trim();
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty.toLowerCase();
  if (data.quickRevision !== undefined) updateData.quickRevision = data.quickRevision ? data.quickRevision.trim() : null;
  if (data.diagram !== undefined) updateData.diagram = data.diagram ? data.diagram.trim() : null;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? data.imageUrl.trim() : null;
  if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);
  if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder) || 0;

  if (data.tags !== undefined) {
    updateData.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags;
  }
  if (data.followUpQuestions !== undefined) {
    updateData.followUpQuestions = Array.isArray(data.followUpQuestions)
      ? JSON.stringify(data.followUpQuestions)
      : data.followUpQuestions;
  }
  if (data.source !== undefined) {
    updateData.source = typeof data.source === 'object' && data.source !== null
      ? JSON.stringify(data.source)
      : data.source;
  }

  const updated = await prisma.vivaQuestion.update({
    where: { id },
    data: updateData,
    include: {
      subject: {
        select: {
          id: true,
          code: true,
          title: true,
        },
      },
    },
  });

  return formatQuestionRecord(updated);
}

/**
 * Delete a viva question.
 */
async function deleteVivaQuestion(id) {
  const existing = await prisma.vivaQuestion.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Viva question not found');
  }

  await prisma.vivaQuestion.delete({ where: { id } });
  return { id, message: 'Question deleted successfully' };
}

/**
 * Bulk delete viva questions by IDs or by active filter criteria.
 */
async function bulkDeleteVivaQuestions(payload) {
  const ids = Array.isArray(payload) ? payload : payload?.ids;

  if (Array.isArray(ids) && ids.length > 0) {
    const result = await prisma.vivaQuestion.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return {
      deletedCount: result.count,
      ids,
      message: `Successfully deleted ${result.count} question(s)`,
    };
  }

  if (typeof payload === 'object' && payload?.deleteAllMatching) {
    const where = {};
    if (payload.subjectId) where.subjectId = payload.subjectId;
    if (payload.section && payload.section !== 'all') where.section = payload.section;
    if (payload.category && payload.category !== 'all') where.category = payload.category.toLowerCase();
    if (payload.difficulty && payload.difficulty !== 'all') where.difficulty = payload.difficulty.toLowerCase();
    if (payload.isPublished !== undefined && payload.isPublished !== 'all') {
      where.isPublished = String(payload.isPublished) === 'true';
    }
    if (payload.search && payload.search.trim()) {
      const q = payload.search.trim();
      where.OR = [
        { question: { contains: q } },
        { shortAnswer: { contains: q } },
        { detailedAnswer: { contains: q } },
      ];
    }
    if (!payload.subjectId && (payload.semesterId || payload.departmentId)) {
      where.subject = {};
      if (payload.semesterId) where.subject.semesterId = payload.semesterId;
      if (payload.departmentId) where.subject.semester = { departmentId: Number(payload.departmentId) };
    }

    const result = await prisma.vivaQuestion.deleteMany({ where });

    return {
      deletedCount: result.count,
      message: `Successfully deleted all ${result.count} matching question(s)`,
    };
  }

  throw new Error('Either a list of IDs or deleteAllMatching: true must be provided');
}

/**
 * Toggle publish status of a question.
 */
async function togglePublishStatus(id) {
  const existing = await prisma.vivaQuestion.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Viva question not found');
  }

  const updated = await prisma.vivaQuestion.update({
    where: { id },
    data: { isPublished: !existing.isPublished },
  });

  return formatQuestionRecord(updated);
}

/**
 * Bulk import viva questions from JSON.
 * Validates entries, checks duplicates against the DB, and batch saves valid ones.
 */
async function bulkImportVivaQuestions(body = {}) {
  let {
    subjectId,
    subjectCode,
    defaultUnitId = 'unit-1',
    defaultSection = 'Unit 1: Theory',
    defaultCategory = 'theory',
    questions = [],
  } = body;

  // Support alternative keys like answers, data, items, units
  if (!Array.isArray(questions) || questions.length === 0) {
    if (Array.isArray(body?.answers)) questions = body.answers;
    else if (Array.isArray(body?.data)) questions = body.data;
    else if (Array.isArray(body?.items)) questions = body.items;
    else if (Array.isArray(body?.results)) questions = body.results;
    else if (Array.isArray(body?.units)) {
      questions = body.units.flatMap((u) => (u.questions || u.answers || []).map((q) => ({ ...q, section: q.section || u.name || u.title })));
    }
  }

  let targetSubjectId = subjectId;

  // Auto-detect subjectCode from keywords if not provided
  if (!targetSubjectId && !subjectCode) {
    const textSample = (JSON.stringify(body).slice(0, 3000) + ' ' + (questions[0]?.question || '')).toLowerCase();
    if (textSample.includes('8086') || textSample.includes('microprocessor') || textSample.includes('biu') || textSample.includes('8085')) {
      subjectCode = 'CE0517';
    } else if (textSample.includes('computer network') || textSample.includes('ce0518') || textSample.includes('osi') || textSample.includes('tcp/ip')) {
      subjectCode = 'CE0518';
    } else if (textSample.includes('web tech') || textSample.includes('ce0522') || textSample.includes('javascript') || textSample.includes('css')) {
      subjectCode = 'CE0522';
    }
  }

  // If subjectId is not provided, attempt lookup by subjectCode
  if (!targetSubjectId && subjectCode) {
    const foundSub = await prisma.subject.findFirst({
      where: { code: { equals: String(subjectCode).trim().toUpperCase() } },
    });
    if (foundSub) {
      targetSubjectId = foundSub.id;
    }
  }

  // Also check if any question carries subjectCode
  if (!targetSubjectId && Array.isArray(questions) && questions.length > 0) {
    const firstCode = questions.find((q) => q.subjectCode || q.code)?.subjectCode || questions.find((q) => q.subjectCode || q.code)?.code;
    if (firstCode) {
      const foundSub = await prisma.subject.findFirst({
        where: { code: { equals: String(firstCode).trim().toUpperCase() } },
      });
      if (foundSub) {
        targetSubjectId = foundSub.id;
      }
    }
  }

  if (!targetSubjectId) {
    throw new Error('Target subjectId (or valid subjectCode) is required for bulk import');
  }

  const subject = await prisma.subject.findUnique({ where: { id: targetSubjectId } });
  if (!subject) {
    throw new Error(`Subject with ID ${targetSubjectId} not found`);
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('questions array cannot be empty');
  }

  // Fetch existing questions for this subject to detect duplicates
  const existingQuestions = await prisma.vivaQuestion.findMany({
    where: { subjectId: targetSubjectId },
    select: { question: true },
  });

  const existingSet = new Set(
    existingQuestions.map((q) => q.question.trim().toLowerCase())
  );

  let successCount = 0;
  let skippedCount = 0;
  const errors = [];
  const toInsert = [];

  for (let i = 0; i < questions.length; i++) {
    const raw = questions[i];
    const index = i + 1;

    // Flexible extraction of question text
    const qText = raw.question || raw.q || raw.questionText || raw.title || raw.problem;
    if (!qText || !String(qText).trim()) {
      errors.push({ index, error: 'Question text is missing or blank' });
      continue;
    }

    // Flexible extraction of answers
    const detailedAns = raw.detailedAnswer || raw.detailed_answer || raw.answer || raw.ans || raw.explanation || raw.solution || raw.shortAnswer || raw.short_answer;
    const shortAns = raw.shortAnswer || raw.short_answer || raw.punchline || raw.directAnswer || null;

    if (!detailedAns && !shortAns) {
      errors.push({ index, question: qText, error: 'Answer is required (detailedAnswer or answer)' });
      continue;
    }

    const normalizedQ = String(qText).trim().toLowerCase();
    if (existingSet.has(normalizedQ)) {
      skippedCount++;
      continue; // Duplicate skipped
    }

    existingSet.add(normalizedQ);

    // Intelligent auto-extraction of shortAnswer punchline if missing
    let finalShortAns = shortAns ? String(shortAns).trim() : null;
    if (!finalShortAns && detailedAns) {
      const cleanDetail = String(detailedAns).replace(/\n+/g, ' ').trim();
      const firstSentence = cleanDetail.split(/\.\s+/)[0];
      if (firstSentence && firstSentence.length > 15 && firstSentence.length < 240) {
        finalShortAns = firstSentence.trim().endsWith('.') ? firstSentence.trim() : `${firstSentence.trim()}.`;
      }
    }

    // Auto-generate clean question number if missing
    const finalQNum = raw.questionNumber || (raw.question_no ? `Q.${raw.question_no}` : null) || raw.qNo || raw.qNumber || `Q.${index}`;

    // Auto-extract tags if missing
    let tagsArr = Array.isArray(raw.tags) ? raw.tags : (Array.isArray(raw.keyPoints) ? raw.keyPoints : null);
    if (!tagsArr || tagsArr.length === 0) {
      const stopWords = new Set(['what', 'explain', 'describe', 'difference', 'between', 'discuss', 'define', 'with', 'using', 'from', 'this', 'that', 'have', 'your', 'write', 'draw', 'brief', 'state', 'list']);
      const words = String(qText).replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w.toLowerCase()));
      if (words.length > 0) {
        tagsArr = words.slice(0, 4);
      }
    }
    const tagsStr = tagsArr ? JSON.stringify(tagsArr) : null;

    // Intelligent unit partitioning if raw JSON didn't specify units
    let finalUnitId = raw.unitId || raw.unit_id || raw.unit;
    let finalSection = raw.section || raw.sectionTitle || raw.unitTitle || raw.unitName;

    if (!finalUnitId) {
      const qLower = (qText + ' ' + (raw.section || '')).toLowerCase();
      if (qLower.includes('unit 1') || qLower.includes('unit-1') || qLower.includes('architecture') || qLower.includes('register') || qLower.includes('biu') || qLower.includes('eu')) {
        finalUnitId = 'unit-1';
        finalSection = 'Unit 1: Architecture & Internal Organization';
      } else if (qLower.includes('unit 2') || qLower.includes('unit-2') || qLower.includes('segmentation') || qLower.includes('addressing mode') || qLower.includes('instruction')) {
        finalUnitId = 'unit-2';
        finalSection = 'Unit 2: Memory & Instruction Set';
      } else if (qLower.includes('unit 3') || qLower.includes('unit-3') || qLower.includes('alp') || qLower.includes('assembly') || qLower.includes('timing') || qLower.includes('bus')) {
        finalUnitId = 'unit-3';
        finalSection = 'Unit 3: Bus Timing & Assembly Programming';
      } else if (qLower.includes('unit 4') || qLower.includes('unit-4') || qLower.includes('interrupt') || qLower.includes('8255') || qLower.includes('8254') || qLower.includes('8259')) {
        finalUnitId = 'unit-4';
        finalSection = 'Unit 4: Interrupts & Peripheral Interfacing';
      } else if (questions.length >= 16) {
        // Distribute proportionally across 4 units for balanced UI pills
        const qPart = Math.floor(i / (questions.length / 4));
        const uNum = Math.min(4, Math.max(1, qPart + 1));
        finalUnitId = `unit-${uNum}`;
        finalSection = `Unit ${uNum}: Core Viva Questions`;
      } else {
        finalUnitId = defaultUnitId;
        finalSection = defaultSection;
      }
    }

    const followUpStr = Array.isArray(raw.followUpQuestions)
      ? JSON.stringify(raw.followUpQuestions)
      : Array.isArray(raw.followUps)
      ? JSON.stringify(raw.followUps)
      : null;

    const sourceStr = typeof raw.source === 'object' && raw.source !== null
      ? JSON.stringify(raw.source)
      : raw.source || null;

    const finalDifficulty = (raw.difficulty || raw.level || 'basic').toLowerCase().trim();
    const finalDiff = ['basic', 'intermediate', 'advanced'].includes(finalDifficulty) ? finalDifficulty : 'basic';

    toInsert.push({
      subjectId: targetSubjectId,
      unitId: finalUnitId,
      section: finalSection,
      category: (raw.category || raw.type || defaultCategory || 'theory').toLowerCase(),
      questionNumber: finalQNum,
      question: String(qText).trim(),
      shortAnswer: finalShortAns,
      detailedAnswer: String(detailedAns || shortAns).trim(),
      difficulty: finalDiff,
      tags: tagsStr,
      followUpQuestions: followUpStr,
      quickRevision: raw.quickRevision || raw.quick_revision || (finalShortAns ? finalShortAns.slice(0, 120) : null),
      diagram: raw.diagram || raw.diagram_or_format ? String(raw.diagram || raw.diagram_or_format).trim() : null,
      imageUrl: raw.imageUrl || raw.image ? String(raw.imageUrl || raw.image).trim() : null,
      source: sourceStr,
      isPublished: raw.isPublished !== undefined ? Boolean(raw.isPublished) : true,
      sortOrder: Number(raw.sortOrder) || toInsert.length + 1,
    });
  }

  // Insert in batch
  if (toInsert.length > 0) {
    await prisma.vivaQuestion.createMany({
      data: toInsert,
    });
    successCount = toInsert.length;
  }

  return {
    success: true,
    totalReceived: questions.length,
    successCount,
    skippedCount,
    errors,
  };
}

/**
 * Generate sample JSON template for bulk import.
 */
function getSampleImportJson() {
  return [
    {
      unitId: 'unit-1',
      section: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5',
      category: 'theory',
      questionNumber: 'Q.1',
      question: 'What is the difference between the Internet and the World Wide Web?',
      shortAnswer: 'The Internet is the global network of interconnected computers; the Web is an information service operating over the Internet using HTTP.',
      detailedAnswer: '1. Internet: Physical and logical network of routers and cables communicating via TCP/IP.\\n2. WWW: Application-layer system of linked hypermedia documents identified by URLs.',
      difficulty: 'basic',
      tags: ['internet', 'www', 'networking', 'http'],
      quickRevision: 'The Internet is the infrastructure; the Web is a document service running on top of it.',
      followUpQuestions: [
        {
          question: 'Can the Internet exist without the World Wide Web?',
          answer: 'Yes, services like Email (SMTP) and FTP ran for decades before the Web.'
        }
      ],
      diagram: '+---------------+       +---------------+\\n| Internet      | =====> | World Wide Web|\\n+---------------+       +---------------+'
    },
    {
      unitId: 'unit-2',
      section: 'Unit 2: CSS3 Styling, Animations & JavaScript Programming',
      category: 'theory',
      questionNumber: 'Q.2',
      question: 'Explain the CSS Box Model and box-sizing: border-box.',
      shortAnswer: 'The CSS Box Model consists of Content, Padding, Border, and Margin. `box-sizing: border-box` includes padding and border within the specified width.',
      detailedAnswer: 'In standard CSS content-box, padding and border are added to width, causing unexpected layout overflows. border-box keeps width fixed.',
      difficulty: 'intermediate',
      tags: ['css', 'box-model', 'border-box'],
      quickRevision: 'Box model: Content -> Padding -> Border -> Margin.',
      followUpQuestions: []
    }
  ];
}

/**
 * Format DB record to parsed object for JSON response.
 */
function formatQuestionRecord(item) {
  let tags = [];
  if (item.tags) {
    try {
      tags = JSON.parse(item.tags);
    } catch (e) {
      tags = item.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }

  let followUpQuestions = [];
  if (item.followUpQuestions) {
    try {
      followUpQuestions = JSON.parse(item.followUpQuestions);
    } catch (e) {
      followUpQuestions = [];
    }
  }

  let source = null;
  if (item.source) {
    try {
      source = JSON.parse(item.source);
    } catch (e) {
      source = { name: item.source };
    }
  }

  return {
    ...item,
    tags,
    followUpQuestions,
    source,
  };
}

module.exports = {
  getVivaQuestions,
  getVivaQuestionById,
  createVivaQuestion,
  updateVivaQuestion,
  deleteVivaQuestion,
  bulkDeleteVivaQuestions,
  togglePublishStatus,
  bulkImportVivaQuestions,
  getSampleImportJson,
  formatQuestionRecord,
};
