const prisma = require('../backend/src/config/prisma');

async function main() {
  const res = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'shortForm';
  `);
  console.log('shortForm column info:', res);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
