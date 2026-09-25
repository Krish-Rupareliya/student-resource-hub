const prisma = require('../src/config/prisma');

async function run() {
  const sub = await prisma.subject.findUnique({ where: { id: '95a7773b-dfd0-4533-b69b-6ce13873d222' } });
  console.log('Subject 95a7773b-dfd0-4533-b69b-6ce13873d222:', sub);
  
  const count = await prisma.vivaQuestion.count({ where: { subjectId: '95a7773b-dfd0-4533-b69b-6ce13873d222' } });
  console.log('Count for this subject:', count);
  
  const total = await prisma.vivaQuestion.count();
  console.log('Total viva questions in DB:', total);

  const all = await prisma.vivaQuestion.findMany({
    select: {
      subject: { select: { code: true, title: true } }
    }
  });
  const m = {};
  all.forEach(x => {
    const k = `${x.subject?.code} - ${x.subject?.title}`;
    m[k] = (m[k] || 0) + 1;
  });
  console.log('Viva questions breakdown:', m);
}

run().catch(console.error).finally(() => prisma.$disconnect());
