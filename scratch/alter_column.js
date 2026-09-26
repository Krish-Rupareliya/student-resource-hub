const prisma = require('../backend/src/config/prisma');

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE subjects MODIFY COLUMN shortForm VARCHAR(100);
  `);
  console.log('Successfully altered shortForm column to VARCHAR(100)');
  const res = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_name = 'subjects' AND column_name = 'shortForm';
  `);
  console.log('Updated column info:', res);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
