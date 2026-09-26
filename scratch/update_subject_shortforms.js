// scratch/update_subject_shortforms.js
const prisma = require('../backend/src/config/prisma');

const SHORT_FORM_MAP = {
  'CE0401': 'OS',
  'CE0402': 'CN',
  'CE0403': 'TOC',
  'CE0404': 'SE',
  'CE0405': 'WD',
  'CE0501': 'DAA',
  'CE0502': 'CD',
  'CE0503': 'AI',
  'CE0504': 'MAD',
  'CE0505': 'IS',
  'CE0516': 'DAA',
  'CE0601': 'ML',
  'CE0602': 'CC',
  'CE0603': 'IOT',
  'CE0604': 'BDA',
  'CE0605': 'DS',
  'CE0701': 'DL',
  'CE0702': 'BT',
  'CE0703': 'NLP',
  'CE0704': 'DEVOPS',
  'CE0801': 'PM',
  'CE0802': 'EIC',
  'CE0803': 'MP'
};

async function main() {
  console.log('--- Updating Database Subject ShortForms ---');
  let updatedCount = 0;
  for (const [code, shortForm] of Object.entries(SHORT_FORM_MAP)) {
    const existing = await prisma.subject.findUnique({ where: { code } });
    if (existing) {
      await prisma.subject.update({
        where: { code },
        data: { shortForm }
      });
      console.log(`[UPDATED] ${code}: ${existing.title} -> ${shortForm}`);
      updatedCount++;
    }
  }

  // Also clear public cache if running
  try {
    const publicService = require('../backend/src/services/public.service');
    publicService.clearPublicCache('all');
    console.log('[CACHE] In-memory cache cleared.');
  } catch (e) {
    // ignore
  }

  console.log(`Successfully updated ${updatedCount} subjects with canonical short forms.`);
}

main()
  .catch(err => {
    console.error('Update failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
