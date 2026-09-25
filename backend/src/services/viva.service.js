// src/services/viva.service.js
// Universal Viva Questions & Solutions backend service.
// Strictly adheres to Backend Proxy architecture.
'use strict';

const prisma = require('../config/prisma');

/**
 * Universal viva questions database & syllabus knowledge base.
 * Stored server-side and proxied to clients.
 */
const VIVA_KNOWLEDGE_BASE = {
  // ─────────────────────────────────────────────────────────────
  // SUBJECT 1: CE0518 - Computer Networks (Sem 5)
  // Complete End Sem Exam Question Bank (Units 1-4) + Lab Experiments
  // ─────────────────────────────────────────────────────────────
  'CE0518': {
    subjectCode: 'CE0518',
    subjectName: 'Computer Networks',
    department: 'CE/IT/CSE',
    semester: 5,
    syllabusOverview: 'Introduction to Computer Networks, Data Link Layer, Medium Access Sub-layer, Network Layer, Transport Layer, and Application Layer.',
    hasPracticals: true,
    sections: [
      { id: 'unit-1', name: 'Unit 1: Introduction to Computer Networks, Data Link Layer', type: 'theory' },
      { id: 'unit-2', name: 'Unit 2: Medium Access Sub-layer', type: 'theory' },
      { id: 'unit-3', name: 'Unit 3: Network Layer', type: 'theory' },
      { id: 'unit-4', name: 'Unit 4: Transport Layer, Application Layer', type: 'theory' },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // SUBJECT 2: CE0517 - Microprocessor and Interfacing (Sem 5)
  // Demonstrates universal subject independence
  // ─────────────────────────────────────────────────────────────
  'CE0517': {
    subjectCode: 'CE0517',
    subjectName: 'Microprocessor and Interfacing',
    department: 'CE/IT/CSE',
    semester: 5,
    syllabusOverview: '8085 & 8086 Microprocessor Architectures, Assembly Programming, Memory & I/O Interfacing, Interrupts, and Peripheral ICs (8255, 8259, 8254).',
    hasPracticals: true,
    sections: [
      { id: 'unit-1', name: 'Unit 1: 8085 Microprocessor Architecture & Bus Organization', type: 'theory' },
      { id: 'unit-2', name: 'Unit 2: 8086 Microprocessor Architecture & Memory Segmentation', type: 'theory' },
      { id: 'unit-3', name: 'Unit 3: Instruction Set & Assembly Language Programming', type: 'theory' },
      { id: 'unit-4', name: 'Unit 4: Interrupts, Bus Timings & Peripheral Interfacing (8255, 8259)', type: 'theory' },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // SUBJECT 3: CE0522 - Web Technology (Sem 5)
  // Complete 4-Unit Syllabus + Practical Laboratory Experiments
  // ─────────────────────────────────────────────────────────────
  'CE0522': {
    subjectCode: 'CE0522',
    subjectName: 'Web Technology',
    department: 'CE/IT/CSE',
    semester: 5,
    syllabusOverview: 'WWW and HTTP protocols, Web Browsers & Servers, HTML5 semantic elements, Canvas & SVG, CSS3 styling & animations, Bootstrap responsive framework, JavaScript & Advanced JS (DOM, cookies, objects, validation), AngularJS client-side MVC framework (two-way binding, directives, filters, services, forms), server-side PHP, MySQL database integration (prepared statements, phpMyAdmin), and web hosting.',
    hasPracticals: true,
    sections: [
      { id: 'unit-1', name: 'Unit 1: Introduction to WWW, HTTP Protocol, Web Browsers & HTML5', type: 'theory' },
      { id: 'unit-2', name: 'Unit 2: CSS3 Styling, Animations, Bootstrap & JavaScript Programming', type: 'theory' },
      { id: 'unit-3', name: 'Unit 3: AngularJS MVC Architecture, Directives, Filters, Services & Forms', type: 'theory' },
      { id: 'unit-4', name: 'Unit 4: Server-Side PHP, Session Handling, MySQL Database & Web Hosting', type: 'theory' },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical' }
    ]
  }
};

/**
 * Fetch viva metadata, questions, and experiments for any subject.
 * Automatically adapts if subject exists in knowledge base or dynamically builds template.
 */
async function getVivaDataForSubject(subjectCode) {
  const code = (subjectCode || '').toUpperCase().trim();
  
  // Also check if subject exists in Prisma DB to get live subject details
  let dbSubject = null;
  let dbQuestions = [];
  try {
    dbSubject = await prisma.subject.findFirst({
      where: { code: { equals: code } },
      include: {
        semester: {
          include: { department: true }
        }
      }
    });

    if (dbSubject) {
      dbQuestions = await prisma.vivaQuestion.findMany({
        where: {
          subjectId: dbSubject.id,
          isPublished: true,
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'asc' },
        ],
      });
    }
  } catch (err) {
    // If DB is offline, continue gracefully
  }

function slugifySection(section) {
  if (!section) return 'unit-1';
  const match = section.match(/unit[\s\-_]*(\d+)/i);
  if (match) return `unit-${match[1]}`;
  if (/practical|experiment/i.test(section)) return 'practicals';
  return section.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unit-1';
}

  const baseData = VIVA_KNOWLEDGE_BASE[code];

  // Database is the single source of truth for viva questions
  const formattedQuestions = dbQuestions.map((q) => {
    let tags = [];
    if (q.tags) {
      try {
        tags = JSON.parse(q.tags);
      } catch (e) {
        tags = q.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    let followUpQuestions = [];
    if (q.followUpQuestions) {
      try {
        followUpQuestions = JSON.parse(q.followUpQuestions);
      } catch (e) {
        followUpQuestions = [];
      }
    }

    let source = null;
    if (q.source) {
      try {
        source = JSON.parse(q.source);
      } catch (e) {
        source = { name: q.source };
      }
    }

    const uId = q.unitId && q.unitId !== 'unit-1' ? q.unitId : slugifySection(q.section);

    return {
      id: q.id,
      subjectCode: code,
      subjectName: dbSubject?.title || baseData?.subjectName || `Subject ${code}`,
      department: dbSubject?.semester?.department?.name || baseData?.department || 'Engineering',
      semester: dbSubject?.semester?.semesterNumber || baseData?.semester || 5,
      unitId: uId,
      section: q.section,
      category: q.category,
      difficulty: q.difficulty,
      questionNumber: q.questionNumber || undefined,
      question: q.question,
      shortAnswer: q.shortAnswer || '',
      detailedAnswer: q.detailedAnswer,
      keyPoints: Array.isArray(tags) ? tags : [],
      example: '',
      diagram: q.diagram || '',
      imageUrl: q.imageUrl || null,
      followUpQuestions,
      quickRevision: q.quickRevision || '',
      source,
      tags,
    };
  });

  // Build dynamic sections list from actual questions in the database
  const dynamicSectionsMap = new Map();
  formattedQuestions.forEach((q) => {
    const uId = q.unitId || 'unit-1';
    if (!dynamicSectionsMap.has(uId)) {
      dynamicSectionsMap.set(uId, {
        id: uId,
        name: q.section || `Section: ${uId}`,
        type: q.category || 'theory',
        questionCount: 0,
      });
    }
    dynamicSectionsMap.get(uId).questionCount += 1;
  });

  // If practicals exist in baseData, include practicals section
  if (baseData?.hasPracticals && !dynamicSectionsMap.has('practicals')) {
    dynamicSectionsMap.set('practicals', {
      id: 'practicals',
      name: 'Laboratory Practical Experiments',
      type: 'practical',
      questionCount: baseData?.experiments?.length || 0,
    });
  }

  // If subject has no sections yet in DB, provide default 4-unit structure
  if (dynamicSectionsMap.size === 0) {
    const defaultSecs = baseData?.sections || [
      { id: 'unit-1', name: 'Unit 1: Fundamentals & Concepts', type: 'theory', questionCount: 0 },
      { id: 'unit-2', name: 'Unit 2: Architecture & Protocols', type: 'theory', questionCount: 0 },
      { id: 'unit-3', name: 'Unit 3: Implementation & Design', type: 'theory', questionCount: 0 },
      { id: 'unit-4', name: 'Unit 4: Advanced Topics & Applications', type: 'theory', questionCount: 0 },
      { id: 'practicals', name: 'Laboratory Practical Experiments', type: 'practical', questionCount: 0 },
    ];
    defaultSecs.forEach((sec) => dynamicSectionsMap.set(sec.id, sec));
  }

  return {
    subjectCode: code,
    subjectName: dbSubject?.title || baseData?.subjectName || `Subject ${code}`,
    department: dbSubject?.semester?.department?.name || baseData?.department || 'Engineering',
    semester: dbSubject?.semester?.semesterNumber || baseData?.semester || 5,
    syllabusOverview: dbSubject?.description || baseData?.syllabusOverview || 'Course viva questions and solutions.',
    hasPracticals: true,
    sections: Array.from(dynamicSectionsMap.values()),
    experiments: baseData?.experiments || [],
    questions: formattedQuestions, // Purely dynamic from DB!
    isDbManaged: true,
  };
}

module.exports = {
  getVivaDataForSubject,
  VIVA_KNOWLEDGE_BASE
};
