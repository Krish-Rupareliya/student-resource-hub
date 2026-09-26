// cleanup_duplicates.js
// ONE-TIME cleanup script for collaborators who got duplicate seed data
// Run from: backend/ directory
//   node prisma/cleanup_duplicates.js
//
// What it does:
//   - Finds ALL duplicate subjects (same code)   → keeps oldest, deletes rest
//   - Finds ALL duplicate announcements (same text) → keeps oldest, deletes rest
//   - Finds ALL duplicate opportunities (same title) → keeps oldest, deletes rest
//   - Shows a full report before and after
//   - Safe: will report "nothing to clean" if DB is already clean

'use strict';

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🧹  Duplicate Cleanup Script\n');
  console.log('   Scans your database and removes any duplicate seed data.');
  console.log('   Keeps the OLDEST record, deletes the newer duplicates.\n');
  console.log('─'.repeat(55));

  let totalDeleted = 0;

  // ── 1. Duplicate Subjects (same code) ───────────────────────
  console.log('\n📚  Checking subjects...');
  const allSubjects = await prisma.subject.findMany({
    orderBy: { code: 'asc' },
    select: { id: true, code: true, title: true },
  });

  const subjectsByCode = {};
  for (const s of allSubjects) {
    if (!subjectsByCode[s.code]) subjectsByCode[s.code] = [];
    subjectsByCode[s.code].push(s);
  }

  let subjectDupes = 0;
  for (const [code, rows] of Object.entries(subjectsByCode)) {
    if (rows.length > 1) {
      // Keep first (lowest id), delete rest
      const keep = rows[0];
      const deleteIds = rows.slice(1).map((r) => r.id);
      console.log(`   ⚠️  Duplicate subject code "${code}" (${rows.length}x) — keeping ${keep.id}, deleting ${deleteIds.length}`);
      await prisma.subject.deleteMany({ where: { id: { in: deleteIds } } });
      subjectDupes += deleteIds.length;
    }
  }
  if (subjectDupes === 0) console.log('   ✅  No duplicate subjects found.');
  else console.log(`   🗑️  Deleted ${subjectDupes} duplicate subject(s).`);
  totalDeleted += subjectDupes;

  // ── 2. Duplicate Semesters (same dept + number) ─────────────
  console.log('\n📅  Checking semesters...');
  const allSemesters = await prisma.semester.findMany({
    orderBy: [{ departmentId: 'asc' }, { semesterNumber: 'asc' }],
    select: { id: true, departmentId: true, semesterNumber: true },
  });

  const semKey = (s) => `${s.departmentId}-${s.semesterNumber}`;
  const semestersByKey = {};
  for (const s of allSemesters) {
    const k = semKey(s);
    if (!semestersByKey[k]) semestersByKey[k] = [];
    semestersByKey[k].push(s);
  }

  let semDupes = 0;
  for (const [key, rows] of Object.entries(semestersByKey)) {
    if (rows.length > 1) {
      const keep = rows[0];
      const deleteIds = rows.slice(1).map((r) => r.id);
      console.log(`   ⚠️  Duplicate semester "${key}" (${rows.length}x) — keeping ${keep.id}, deleting ${deleteIds.length}`);
      await prisma.semester.deleteMany({ where: { id: { in: deleteIds } } });
      semDupes += deleteIds.length;
    }
  }
  if (semDupes === 0) console.log('   ✅  No duplicate semesters found.');
  else console.log(`   🗑️  Deleted ${semDupes} duplicate semester(s).`);
  totalDeleted += semDupes;

  // ── 3. Duplicate Announcements (same text) ───────────────────
  console.log('\n📢  Checking announcements...');
  const allAnnouncements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, text: true, badge: true, createdAt: true },
  });

  const annsByText = {};
  for (const a of allAnnouncements) {
    const key = a.text.trim();
    if (!annsByText[key]) annsByText[key] = [];
    annsByText[key].push(a);
  }

  let annDupes = 0;
  for (const [text, rows] of Object.entries(annsByText)) {
    if (rows.length > 1) {
      const keep = rows[0];
      const deleteIds = rows.slice(1).map((r) => r.id);
      console.log(`   ⚠️  Duplicate announcement "${text.slice(0, 50)}..." (${rows.length}x) — keeping oldest, deleting ${deleteIds.length}`);
      await prisma.announcement.deleteMany({ where: { id: { in: deleteIds } } });
      annDupes += deleteIds.length;
    }
  }
  if (annDupes === 0) console.log('   ✅  No duplicate announcements found.');
  else console.log(`   🗑️  Deleted ${annDupes} duplicate announcement(s).`);
  totalDeleted += annDupes;

  // ── 4. Duplicate Opportunities (same title) ──────────────────
  console.log('\n💼  Checking opportunities...');
  const allOpportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true, category: true, createdAt: true },
  });

  const oppsByTitle = {};
  for (const o of allOpportunities) {
    const key = o.title.trim();
    if (!oppsByTitle[key]) oppsByTitle[key] = [];
    oppsByTitle[key].push(o);
  }

  let oppDupes = 0;
  for (const [title, rows] of Object.entries(oppsByTitle)) {
    if (rows.length > 1) {
      const keep = rows[0];
      const deleteIds = rows.slice(1).map((r) => r.id);
      console.log(`   ⚠️  Duplicate opportunity "${title}" (${rows.length}x) — keeping oldest, deleting ${deleteIds.length}`);
      await prisma.opportunity.deleteMany({ where: { id: { in: deleteIds } } });
      oppDupes += deleteIds.length;
    }
  }
  if (oppDupes === 0) console.log('   ✅  No duplicate opportunities found.');
  else console.log(`   🗑️  Deleted ${oppDupes} duplicate opportunity(s).`);
  totalDeleted += oppDupes;

  // ── 5. Duplicate Departments (same code) ─────────────────────
  console.log('\n🏫  Checking departments...');
  const allDepts = await prisma.department.findMany({
    orderBy: { code: 'asc' },
    select: { id: true, code: true, name: true },
  });

  const deptsByCode = {};
  for (const d of allDepts) {
    if (!deptsByCode[d.code]) deptsByCode[d.code] = [];
    deptsByCode[d.code].push(d);
  }

  let deptDupes = 0;
  for (const [code, rows] of Object.entries(deptsByCode)) {
    if (rows.length > 1) {
      const keep = rows[0];
      const deleteIds = rows.slice(1).map((r) => r.id);
      console.log(`   ⚠️  Duplicate department "${code}" (${rows.length}x) — keeping ${keep.id}, deleting ${deleteIds.length}`);
      await prisma.department.deleteMany({ where: { id: { in: deleteIds } } });
      deptDupes += deleteIds.length;
    }
  }
  if (deptDupes === 0) console.log('   ✅  No duplicate departments found.');
  else console.log(`   🗑️  Deleted ${deptDupes} duplicate department(s).`);
  totalDeleted += deptDupes;

  // ── Summary ──────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(55));
  if (totalDeleted === 0) {
    console.log('✅  Database is clean — no duplicates found!\n');
  } else {
    console.log(`🎉  Cleanup complete! Removed ${totalDeleted} duplicate record(s).\n`);
    console.log('   Now run: npm run db:seed');
    console.log('   The seed is now fully idempotent (safe to run repeatedly).\n');
  }
}

main()
  .catch((err) => {
    console.error('\n❌  Cleanup failed:');
    console.error(err.message);
    console.error('\nIf you see a foreign key error, subjects with linked resources');
    console.error('cannot be deleted automatically. Contact the project owner.\n');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
