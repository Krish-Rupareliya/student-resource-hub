// backend/prisma/seed_viva.js
// Seeds initial viva question banks into the database for admin management.
'use strict';

const prisma = require('../src/config/prisma');

async function seedVivaQuestions() {
  console.log('🌱 Seeding Viva Questions into database...');

  // 1. Get Subject IDs
  const wt = await prisma.subject.findFirst({ where: { code: 'CE0522' } });
  const cn = await prisma.subject.findFirst({ where: { code: 'CE0518' } });

  console.log(`WT (CE0522): ${wt ? wt.id : 'NOT FOUND'}`);
  console.log(`CN (CE0518): ${cn ? cn.id : 'NOT FOUND'}`);

  // Dynamic import of viva datasets from frontend
  const { CE0522_ALL_QUESTIONS } = await import('../../frontend/src/data/viva/ce0522_webtechnology.js');
  const { CE0518_UNIT1_QUESTIONS } = await import('../../frontend/src/data/viva/ce0518_unit1.js');
  const { CE0518_UNIT2_QUESTIONS } = await import('../../frontend/src/data/viva/ce0518_unit2.js');
  const { CE0518_UNIT3_QUESTIONS } = await import('../../frontend/src/data/viva/ce0518_unit3.js');
  const { CE0518_UNIT4_QUESTIONS } = await import('../../frontend/src/data/viva/ce0518_unit4.js');

  const cnAll = [
    ...CE0518_UNIT1_QUESTIONS,
    ...CE0518_UNIT2_QUESTIONS,
    ...CE0518_UNIT3_QUESTIONS,
    ...CE0518_UNIT4_QUESTIONS,
  ];

  let wtCount = 0;
  let cnCount = 0;

  if (wt) {
    for (let i = 0; i < CE0522_ALL_QUESTIONS.length; i++) {
      const q = CE0522_ALL_QUESTIONS[i];
      const exists = await prisma.vivaQuestion.findFirst({
        where: { subjectId: wt.id, question: q.question },
      });
      if (!exists) {
        let uId = 'unit-1';
        if (q.section.includes('Unit 2')) uId = 'unit-2';
        else if (q.section.includes('Unit 3')) uId = 'unit-3';
        else if (q.section.includes('Unit 4')) uId = 'unit-4';

        await prisma.vivaQuestion.create({
          data: {
            subjectId: wt.id,
            unitId: uId,
            section: q.section,
            category: q.category || 'theory',
            questionNumber: q.questionNumber || `Q.${i + 1}`,
            question: q.question,
            shortAnswer: q.shortAnswer || null,
            detailedAnswer: q.detailedAnswer,
            difficulty: q.difficulty || 'basic',
            tags: q.tags ? JSON.stringify(q.tags) : null,
            followUpQuestions: q.followUpQuestions ? JSON.stringify(q.followUpQuestions) : null,
            quickRevision: q.quickRevision || null,
            diagram: q.diagram || null,
            source: q.source ? JSON.stringify(q.source) : null,
            isPublished: true,
            sortOrder: i + 1,
          },
        });
        wtCount++;
      }
    }
    console.log(`✅ Seeded ${wtCount} Web Technology questions.`);
  }

  if (cn) {
    for (let i = 0; i < cnAll.length; i++) {
      const q = cnAll[i];
      const exists = await prisma.vivaQuestion.findFirst({
        where: { subjectId: cn.id, question: q.question },
      });
      if (!exists) {
        let uId = 'unit-1';
        if (q.section.includes('Unit 2')) uId = 'unit-2';
        else if (q.section.includes('Unit 3')) uId = 'unit-3';
        else if (q.section.includes('Unit 4')) uId = 'unit-4';

        await prisma.vivaQuestion.create({
          data: {
            subjectId: cn.id,
            unitId: uId,
            section: q.section,
            category: q.category || 'theory',
            questionNumber: q.questionNumber || `Q.${i + 1}`,
            question: q.question,
            shortAnswer: q.shortAnswer || null,
            detailedAnswer: q.detailedAnswer,
            difficulty: q.difficulty || 'basic',
            tags: q.tags ? JSON.stringify(q.tags) : null,
            followUpQuestions: q.followUpQuestions ? JSON.stringify(q.followUpQuestions) : null,
            quickRevision: q.quickRevision || null,
            diagram: q.diagram || null,
            source: q.source ? JSON.stringify(q.source) : null,
            isPublished: true,
            sortOrder: i + 1,
          },
        });
        cnCount++;
      }
    }
    console.log(`✅ Seeded ${cnCount} Computer Networks questions.`);
  }

  const total = await prisma.vivaQuestion.count();
  console.log(`🎉 Total Viva Questions in Database: ${total}`);
  process.exit(0);
}

seedVivaQuestions().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
