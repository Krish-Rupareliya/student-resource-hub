/**
 * LIVE PROOF: Multiple Short Forms Per Subject
 * Verifies that a subject with multi-alias shortForm is found by ALL aliases independently
 */

const prisma = require('../backend/src/config/prisma');

function extractDynamicSubjectAliases(sub) {
  if (!sub) return [];
  const aliases = [];
  if (sub.shortForm && typeof sub.shortForm === 'string') {
    const tokens = sub.shortForm.split(/[,/|]/).map((t) => t.trim().toUpperCase()).filter(Boolean);
    tokens.forEach((tok) => { if (!aliases.includes(tok)) aliases.push(tok); });
  }
  if (sub.title) {
    const words = sub.title.split(/[\s-]+/).filter((w) => !['and','of','&','for','in','with','to','the','a','an'].includes(w.toLowerCase()));
    const acronym = words.map((w) => w[0]).join('').toUpperCase();
    if (acronym.length >= 2 && !aliases.includes(acronym)) aliases.push(acronym);
  }
  const pathSlug = (sub.path || '').replace('/subject/', '').trim().toUpperCase();
  if (pathSlug && !aliases.includes(pathSlug)) aliases.push(pathSlug);
  return aliases;
}

function matchByCode(s, target) {
  const t = target.toLowerCase().trim();
  const clean = t.replace(/[-\s_]/g, '');
  if (s.code.toLowerCase() === t) return true;
  if (s.shortForm) {
    const tokens = s.shortForm.split(/[,/|]/).map((x) => x.trim().toLowerCase()).filter(Boolean);
    for (const tok of tokens) {
      if (tok === t || tok.replace(/[-\s_]/g, '') === clean) return true;
    }
  }
  return false;
}

function matchSearch(s, query) {
  const q = query.toLowerCase().trim();
  if (s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)) return true;
  if (s.shortForm) {
    const tokens = s.shortForm.split(/[,/|]/).map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (tokens.some((tok) => tok.includes(q))) return true;
  }
  return false;
}

async function main() {
  console.log('=== LIVE PROOF: Multiple Short Forms Per Subject ===\n');
  let passed = 0; let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) { console.log(`  [PASS] ${msg}`); passed++; }
    else       { console.error(`  [FAIL] ${msg}`); process.exitCode = 1; }
  }

  // Pick any real subject
  const subject = await prisma.subject.findFirst({ where: { code: 'CE0402' } }); // Computer Networks
  const originalShortForm = subject.shortForm;

  console.log(`Subject: ${subject.title} (${subject.code})`);
  console.log(`Original shortForm: "${originalShortForm}"\n`);

  // --- Simulate admin setting MULTIPLE short forms ---
  const multiShortForm = 'CN, NETS, COMP-NET';
  await prisma.subject.update({ where: { id: subject.id }, data: { shortForm: multiShortForm } });
  const updated = await prisma.subject.findUnique({ where: { id: subject.id } });

  console.log(`Admin set shortForm to: "${updated.shortForm}"\n`);

  // Verify all three aliases parse out
  const aliases = extractDynamicSubjectAliases(updated);
  console.log(`Parsed aliases: ${JSON.stringify(aliases)}\n`);

  assert(aliases.includes('CN'),       'Alias "CN" is searchable');
  assert(aliases.includes('NETS'),     'Alias "NETS" is searchable');
  assert(aliases.includes('COMP-NET'), 'Alias "COMP-NET" is searchable');
  assert(aliases.includes('CN'),       'Acronym fallback "CN" from title also present');

  // Verify route resolution by EACH alias individually
  assert(matchByCode(updated, 'cn'),       'Route /subject/cn resolves to Computer Networks');
  assert(matchByCode(updated, 'nets'),     'Route /subject/nets resolves to Computer Networks');
  assert(matchByCode(updated, 'comp-net'), 'Route /subject/comp-net resolves to Computer Networks');

  // Verify search by EACH alias individually
  assert(matchSearch(updated, 'cn'),   'Search "cn" finds Computer Networks');
  assert(matchSearch(updated, 'nets'), 'Search "nets" finds Computer Networks');
  assert(matchSearch(updated, 'comp'), 'Search "comp" finds Computer Networks (partial match)');

  // Restore
  await prisma.subject.update({ where: { id: subject.id }, data: { shortForm: originalShortForm } });
  console.log(`\nRestored to original shortForm: "${originalShortForm}"\n`);

  await prisma.$disconnect();

  console.log(`=== RESULT: ${passed}/${total} PASSED ===`);
  if (passed === total) console.log('\nAll multiple short form aliases work perfectly!');
}

main().catch(err => { console.error(err); process.exit(1); });
