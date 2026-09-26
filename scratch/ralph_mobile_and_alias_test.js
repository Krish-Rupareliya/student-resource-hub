// scratch/ralph_mobile_and_alias_test.js
// Automated verification suite for:
// 1. Mobile SGPA controls overlap prevention (SRH-912)
// 2. Department card status badge collision prevention (SRH-913)
// 3. Subject short-form and alias search across DB, API & CommandPalette (SRH-914)

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RALPH MOBILE OVERLAPS & ALIAS SEARCH VERIFICATION SUITE ---');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`[PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${description}`);
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

// ─── 1. Check SGPA Calculator Layout (SRH-912) ────────────────────────
test('SGPA Calculator: Mode 2 uses responsive stacked rows (flex-col sm:flex-row) to prevent mobile overlaps', () => {
  const calcFile = fs.readFileSync(path.join(rootDir, 'frontend/src/pages/Home/components/ExamCountdownAndCalculator.jsx'), 'utf-8');
  assert.ok(calcFile.includes('flex flex-col sm:flex-row sm:items-center justify-between gap-2'), 'Mode 2 controls must use flex-col on mobile');
  assert.ok(!calcFile.includes('flex flex-wrap sm:flex-nowrap items-center justify-between gap-2'), 'Old overlapping flex-wrap layout must be removed');
  assert.ok(calcFile.includes('Max Scheme:'), 'Must provide clear Max Scheme label on mobile');
});

// ─── 2. Check Resources Department Card Layout (SRH-913) ──────────────
test('Resources.jsx: Status badge is in-flow above the center icon badge without absolute collision', () => {
  const resFile = fs.readFileSync(path.join(rootDir, 'frontend/src/pages/Resources/Resources.jsx'), 'utf-8');
  assert.ok(resFile.includes('w-full flex items-center justify-end mb-2 sm:mb-3'), 'Status badge must be in-flow top row container');
  assert.ok(!resFile.includes('<div className="absolute top-4 right-4">\n                  <span className={`${dept.statusBg}'), 'Absolute status badge overlay must be removed');
  assert.ok(resFile.includes('p-6 sm:p-9'), 'Mobile padding must be optimized to p-6 sm:p-9');
});

// ─── 3. Check Backend Seed & DB Canonical ShortForms (SRH-914) ────────
test('Backend seed.js: Defines shortForm for all semesters including OS, CN, TOC, DAA, AI, ML', () => {
  const seedFile = fs.readFileSync(path.join(rootDir, 'backend/prisma/seed.js'), 'utf-8');
  assert.ok(seedFile.includes("shortForm: 'OS'"), 'Seed must define OS');
  assert.ok(seedFile.includes("shortForm: 'CN'"), 'Seed must define CN');
  assert.ok(seedFile.includes("shortForm: 'TOC'"), 'Seed must define TOC');
  assert.ok(seedFile.includes("shortForm: 'DAA'"), 'Seed must define DAA');
  assert.ok(seedFile.includes("shortForm: 'AI'"), 'Seed must define AI');
  assert.ok(seedFile.includes("shortForm: 'ML'"), 'Seed must define ML');
});

// ─── 4. Check resourcesApi.js ShortForm & Alias Resolution (SRH-915/916) ──
test('resourcesApi.js: getSubjectByCode and searchAllSubjects match dynamic shortForm and acronym aliases', () => {
  const apiFile = fs.readFileSync(path.join(rootDir, 'frontend/src/services/resources/resourcesApi.js'), 'utf-8');
  assert.ok(apiFile.includes('.split(/[,/|]/)'), 'getSubjectByCode must split shortForm by delimiters');
  assert.ok(apiFile.includes('tok.replace'), 'getSubjectByCode must support normalized short forms');
  assert.ok(apiFile.includes('shortFormMatch'), 'searchAllSubjects must test shortFormMatch');
  assert.ok(apiFile.includes('strictAcronym.includes(lowerQuery)'), 'searchAllSubjects must test strictAcronym');
});

// ─── 5. Check CommandPalette.jsx Dynamic Aliases (SRH-915/916) ────────
test('CommandPalette.jsx: Uses extractDynamicSubjectAliases, zero static dictionary, and re-fetches on isOpen', () => {
  const cmdFile = fs.readFileSync(path.join(rootDir, 'frontend/src/components/common/CommandPalette.jsx'), 'utf-8');
  assert.ok(!cmdFile.includes('const KNOWN_ALIASES = {'), 'Static KNOWN_ALIASES table must be completely removed');
  assert.ok(cmdFile.includes('extractDynamicSubjectAliases(sub)'), 'Must use extractDynamicSubjectAliases');
  assert.ok(cmdFile.includes('[isOpen]'), 'useEffect must re-fetch catalog on [isOpen]');
  assert.ok(cmdFile.includes('shortLower.includes(q)'), 'CommandPalette filter must check shortLower');
  assert.ok(cmdFile.includes('item.aliases && item.aliases.some'), 'CommandPalette filter must check item.aliases');
  assert.ok(cmdFile.includes('{item.shortForm && ('), 'CommandPalette must render shortForm badge next to title');
});

// ─── 6. Check AdminResourcesView.jsx Subject Filter (SRH-915/916) ─────
test('AdminResourcesView.jsx: Subject dropdown filter matches shortForm tokens', () => {
  const adminFile = fs.readFileSync(path.join(rootDir, 'frontend/src/pages/Admin/AdminResourcesView.jsx'), 'utf-8');
  assert.ok(adminFile.includes('s.shortForm.split(/[,/|]/)'), 'Admin subject filter must check s.shortForm tokens');
});

console.log('\n==========================================');
console.log(`Total Passed: ${passed} | Total Failed: ${failed}`);
console.log('==========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL RALPH MOBILE OVERLAPS & ALIAS SEARCH CHECKS PASSED!\n');
}
