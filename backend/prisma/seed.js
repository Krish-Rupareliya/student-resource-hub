// prisma/seed.js
// Run via: npm run db:seed   (or: node prisma/seed.js)
'use strict';

require('dotenv').config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
//  SEED DATA DEFINITIONS
// ─────────────────────────────────────────────────────────────

const ADMIN = {
  email: 'admin@campus.edu',
  password: 'AdminPassword123!',
  name: 'Campus Admin',
  role: 'ADMIN',
};

const DEPARTMENTS = [
  { code: 'CE', name: 'Computer Engineering' },
  { code: 'IT', name: 'Information Technology' },
];

const SEMESTER_STYLES = [
  { bgColor: '#E6F8F1', pinColor: 'emerald', rotate: '-1deg' },
  { bgColor: '#E6F4FF', pinColor: 'sky', rotate: '1.5deg' },
  { bgColor: '#FFFDE6', pinColor: 'yellow', rotate: '-1.2deg' },
  { bgColor: '#F3E8FF', pinColor: 'purple', rotate: '0.8deg' },
  { bgColor: '#FFF1E6', pinColor: 'orange', rotate: '-1.5deg' },
  { bgColor: '#E0FCFF', pinColor: 'cyan', rotate: '0.5deg' },
  { bgColor: '#FFEBF5', pinColor: 'rose', rotate: '1.2deg' },
  { bgColor: '#E6F8F1', pinColor: 'emerald', rotate: '-1deg' },
];

// Subjects keyed by semester number (1-indexed), linked to CE dept
// code must be unique across all subjects
const SUBJECTS_BY_SEMESTER = {
  1: [
    { code: 'CE0101', title: 'Mathematics - I',                  shortForm: 'MATHS-1', icon: 'functions', cardType: 'pinned-card',   path: '/subject/maths-1',    sortOrder: 1, description: 'Calculus, matrices, and complex numbers' },
    { code: 'CE0102', title: 'Physics',                          shortForm: 'PHY',     icon: 'science', cardType: 'pinned-card', path: '/subject/physics',    sortOrder: 2, description: 'Mechanics, optics, and electromagnetism' },
    { code: 'CE0103', title: 'Basic Electronics',                shortForm: 'BE',      icon: 'electrical_services', cardType: 'pinned-card', path: '/subject/electronics',sortOrder: 3, description: 'Diodes, transistors, and basic circuits' },
    { code: 'CE0104', title: 'Programming Fundamentals (C)',     shortForm: 'PFC',     icon: 'terminal', cardType: 'pinned-card',   path: '/subject/c-programming', sortOrder: 4, description: 'Fundamentals of C programming' },
    { code: 'CE0105', title: 'Engineering Graphics',             shortForm: 'EG',      icon: 'architecture', cardType: 'pinned-card', path: '/subject/eng-graphics', sortOrder: 5, description: 'Engineering drawing and CAD basics' },
  ],
  2: [
    { code: 'CE0201', title: 'Mathematics - II',                 shortForm: 'MATHS-2', icon: 'calculate', cardType: 'pinned-card',   path: '/subject/maths-2',      sortOrder: 1, description: 'Differential equations and transforms' },
    { code: 'CE0202', title: 'Data Structures',                  shortForm: 'DS',      icon: 'account_tree', cardType: 'pinned-card',   path: '/subject/data-structures', sortOrder: 2, description: 'Arrays, linked lists, trees, graphs' },
    { code: 'CE0203', title: 'Digital Electronics',              shortForm: 'DE',      icon: 'memory', cardType: 'pinned-card', path: '/subject/digital-electronics', sortOrder: 3, description: 'Logic gates, flip-flops, and combinational circuits' },
    { code: 'CE0204', title: 'Object Oriented Programming (C++)',shortForm: 'OOP',     icon: 'code_blocks', cardType: 'pinned-card', path: '/subject/cpp',          sortOrder: 4, description: 'Classes, inheritance, polymorphism' },
    { code: 'CE0205', title: 'Environmental Science',            shortForm: 'EVS',     icon: 'eco', cardType: 'pinned-card', path: '/subject/env-science',  sortOrder: 5, description: 'Ecology, pollution, and sustainability' },
  ],
  3: [
    { code: 'CE0301', title: 'Discrete Mathematics',             shortForm: 'DM',      icon: 'join_inner', cardType: 'pinned-card',   path: '/subject/discrete-maths', sortOrder: 1, description: 'Sets, logic, graph theory, combinatorics' },
    { code: 'CE0302', title: 'Computer Organization',            shortForm: 'COA',     icon: 'developer_board', cardType: 'pinned-card', path: '/subject/computer-org',  sortOrder: 2, description: 'CPU architecture, memory, and I/O' },
    { code: 'CE0303', title: 'Database Management Systems',      shortForm: 'DMS',     icon: 'database', cardType: 'pinned-card',   path: '/subject/dbms',          sortOrder: 3, description: 'SQL, normalization, transactions, and indexing' },
    { code: 'CE0304', title: 'Java Programming',                 shortForm: 'JAVA',    icon: 'coffee', cardType: 'pinned-card', path: '/subject/java',          sortOrder: 4, description: 'Core Java, collections, and exception handling' },
    { code: 'CE0305', title: 'Probability & Statistics',         shortForm: 'PSNM',    icon: 'query_stats', cardType: 'pinned-card', path: '/subject/probability',   sortOrder: 5, description: 'Probability distributions and statistical inference' },
    { code: 'CE0316', title: 'Object Oriented Concepts with UML', shortForm: 'OOCWU',   icon: 'code', cardType: 'pinned-card', path: '/subject/oocwu',        sortOrder: 6, description: 'Learn OOP concepts, UML diagrams and software design.' },
    { code: 'SS0301', title: 'Human Values and Professional Ethics', shortForm: 'HVPE', icon: 'auto_stories', cardType: 'pinned-card', path: '/subject/hvpe', sortOrder: 7, description: 'Understand professional ethics, leadership, and human values.' },
    { code: 'MA0311', title: 'Probability, Statistics & Numerical Methods', shortForm: 'PSNM', icon: 'calculate', cardType: 'pinned-card', path: '/subject/psnm', sortOrder: 8, description: 'Study probability, statistics, numerical methods.' },
  ],
  4: [
    { code: 'CE0401', title: 'Operating Systems',                shortForm: 'OS',      icon: 'settings_system_daydream', cardType: 'pinned-card',   path: '/subject/os',            sortOrder: 1, description: 'Processes, scheduling, memory management, and file systems' },
    { code: 'CE0402', title: 'Computer Networks',                shortForm: 'CN',      icon: 'router', cardType: 'pinned-card',   path: '/subject/networks',      sortOrder: 2, description: 'OSI model, TCP/IP, routing, and network security' },
    { code: 'CE0403', title: 'Theory of Computation',            shortForm: 'TOC',     icon: 'smart_toy', cardType: 'pinned-card', path: '/subject/toc',           sortOrder: 3, description: 'Automata, grammars, and Turing machines' },
    { code: 'CE0404', title: 'Software Engineering',             shortForm: 'SE',      icon: 'engineering', cardType: 'pinned-card', path: '/subject/software-eng',  sortOrder: 4, description: 'SDLC, agile, UML, and testing' },
    { code: 'CE0405', title: 'Web Development',                  shortForm: 'WD',      icon: 'web', cardType: 'pinned-card', path: '/subject/web-dev',       sortOrder: 5, description: 'HTML, CSS, JavaScript, and responsive design' },
  ],
  5: [
    { code: 'CE0501', title: 'Design & Analysis of Algorithms',  shortForm: 'DAA',     icon: 'account_tree', cardType: 'premium-card',   path: '/subject/daa',           sortOrder: 1, description: 'Sorting, greedy, DP, and NP-completeness' },
    { code: 'CE0502', title: 'Compiler Design',                  shortForm: 'CD',      icon: 'handyman', cardType: 'premium-card', path: '/subject/compiler',      sortOrder: 2, description: 'Lexical analysis, parsing, and code generation' },
    { code: 'CE0503', title: 'Artificial Intelligence',          shortForm: 'AI',      icon: 'psychology', cardType: 'premium-card',   path: '/subject/ai',            sortOrder: 3, description: 'Search, knowledge representation, and ML basics' },
    { code: 'CE0504', title: 'Mobile Application Development',   shortForm: 'MAD',     icon: 'smartphone', cardType: 'premium-card', path: '/subject/mobile-dev',    sortOrder: 4, description: 'Android/iOS development fundamentals' },
    { code: 'CE0505', title: 'Information Security',             shortForm: 'IS',      icon: 'lock', cardType: 'premium-card', path: '/subject/info-security', sortOrder: 5, description: 'Cryptography, network security, and ethical hacking' },
    { code: 'CE0516', title: 'Design and Analysis of Algorithms',shortForm: 'DAA',     icon: 'account_tree', cardType: 'premium-card',   path: '/subject/daa',       sortOrder: 6, description: 'Advanced algorithms and complexity theory' },
  ],
  6: [
    { code: 'CE0601', title: 'Machine Learning',                 shortForm: 'ML',      icon: 'model_training', cardType: 'pinned-card',   path: '/subject/ml',            sortOrder: 1, description: 'Supervised, unsupervised, and reinforcement learning' },
    { code: 'CE0602', title: 'Cloud Computing',                  shortForm: 'CC',      icon: 'cloud', cardType: 'pinned-card', path: '/subject/cloud',         sortOrder: 2, description: 'AWS, GCP, Azure, and DevOps fundamentals' },
    { code: 'CE0603', title: 'Internet of Things',               shortForm: 'IOT',     icon: 'sensors', cardType: 'pinned-card', path: '/subject/iot',           sortOrder: 3, description: 'Sensors, protocols, and smart systems' },
    { code: 'CE0604', title: 'Big Data Analytics',               shortForm: 'BDA',     icon: 'storage', cardType: 'pinned-card',   path: '/subject/big-data',      sortOrder: 4, description: 'Hadoop, Spark, and data pipelines' },
    { code: 'CE0605', title: 'Distributed Systems',              shortForm: 'DS',      icon: 'device_hub', cardType: 'pinned-card', path: '/subject/distributed',   sortOrder: 5, description: 'CAP theorem, consensus, and microservices' },
  ],
  7: [
    { code: 'CE0701', title: 'Deep Learning',                    shortForm: 'DL',      icon: 'network_node', cardType: 'pinned-card',   path: '/subject/deep-learning', sortOrder: 1, description: 'CNNs, RNNs, transformers, and GANs' },
    { code: 'CE0702', title: 'Blockchain Technology',            shortForm: 'BT',      icon: 'link', cardType: 'pinned-card', path: '/subject/blockchain',    sortOrder: 2, description: 'Distributed ledger, smart contracts, and DeFi' },
    { code: 'CE0703', title: 'Natural Language Processing',      shortForm: 'NLP',     icon: 'record_voice_over', cardType: 'pinned-card',   path: '/subject/nlp',           sortOrder: 3, description: 'Text processing, sentiment analysis, and LLMs' },
    { code: 'CE0704', title: 'DevOps & CI/CD',                   shortForm: 'DEVOPS',  icon: 'published_with_changes', cardType: 'pinned-card', path: '/subject/devops',        sortOrder: 4, description: 'Docker, Kubernetes, Jenkins, and GitHub Actions' },
  ],
  8: [
    { code: 'CE0801', title: 'Project Management',               shortForm: 'PM',      icon: 'task', cardType: 'pinned-card', path: '/subject/project-mgmt', sortOrder: 1, description: 'Agile, Scrum, PMP, and delivery frameworks' },
    { code: 'CE0802', title: 'Ethics in Computing',              shortForm: 'EIC',     icon: 'gavel', cardType: 'pinned-card', path: '/subject/ethics',       sortOrder: 2, description: 'Professional ethics, IP law, and data privacy' },
    { code: 'CE0803', title: 'Major Project',                    shortForm: 'MP',      icon: 'emoji_events', cardType: 'pinned-card',   path: '/subject/major-project', sortOrder: 3, description: 'Capstone project spanning full software lifecycle' },
  ],
};

const SUBJECT_STYLES = [
  { bgColor: '#f0f9ff', pinColor: 'blue', rotate: '1.2deg' },
  { bgColor: '#f5f3ff', pinColor: 'purple', rotate: '1.8deg' },
  { bgColor: '#f0fdf4', pinColor: 'green', rotate: '-1.5deg' },
  { bgColor: '#fdf2f8', pinColor: 'pink', rotate: '0.9deg' },
  { bgColor: '#fffbeb', pinColor: 'yellow', rotate: '-0.8deg' },
  { bgColor: '#fff7ed', pinColor: 'orange', rotate: '-1.2deg' },
];

const ANNOUNCEMENTS = [
  {
    seedKey: 'sem5-midterm-exam-alert',   // ← stable slug, never changes
    text: 'Mid-semester exam timetable for Semester 5 has been released. Check the notice board for details.',
    badge: 'Exam Alert',
    color: 'bg-red-100 text-red-700',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    seedKey: 'ds-study-materials-uploaded', // ← stable slug, never changes
    text: 'New study materials for Data Structures (Semester 2) have been uploaded by seniors. Explore the resources tab!',
    badge: 'New Content',
    color: 'bg-green-100 text-green-700',
    deadline: null,
    isActive: true,
  },
];

const OPPORTUNITIES = [
  {
    seedKey: 'gsoc-2025',              // ← stable slug, never changes
    title: 'Google Summer of Code 2025',
    description: 'Contribute to open-source projects under Google mentorship. Applications open for all CS/IT students.',
    category: 'Internship',
    tag: 'Open Source',
    pinBg: 'bg-yellow-400',
    isActive: true,
  },
  {
    seedKey: 'sih-2025',              // ← stable slug, never changes
    title: 'Smart India Hackathon 2025',
    description: 'National-level hackathon hosted by the Government of India. Form teams of 2–6 and solve real-world problems.',
    category: 'Hackathon',
    tag: 'Govt. Initiative',
    pinBg: 'bg-orange-400',
    isActive: true,
  },
  {
    seedKey: 'campus-placement-tcs-infosys', // ← stable slug, never changes
    title: 'Campus Placement Drive — TCS & Infosys',
    description: 'On-campus placement drive for final-year students. Eligible: CGPA ≥ 6.0, no active backlogs.',
    category: 'Placement',
    tag: 'On-Campus',
    pinBg: 'bg-blue-400',
    isActive: true,
  },
];

// ─────────────────────────────────────────────────────────────
//  HELPER: idempotent upsert using seedKey (stable slug)
//  Running db:seed any number of times will NEVER create duplicates.
// ─────────────────────────────────────────────────────────────

async function upsertAnnouncement({ seedKey, ...data }) {
  return prisma.announcement.upsert({
    where: { seedKey },
    update: { badge: data.badge, color: data.color, isActive: data.isActive },
    create: { seedKey, ...data },
  });
}

async function upsertOpportunity({ seedKey, ...data }) {
  return prisma.opportunity.upsert({
    where: { seedKey },
    update: { title: data.title, description: data.description, category: data.category, tag: data.tag, pinBg: data.pinBg, isActive: data.isActive },
    create: { seedKey, ...data },
  });
}

// ─────────────────────────────────────────────────────────────
//  MAIN SEED
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱  Starting database seed...\n');

  // ── 1. Admin User ──────────────────────────────────────────
  console.log('👤  Seeding admin user...');
  const passwordHash = await bcrypt.hash(ADMIN.password, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN.email },
    update: {},
    create: {
      email: ADMIN.email,
      passwordHash,
      name: ADMIN.name,
      role: ADMIN.role,
    },
  });
  console.log(`   ✅  Admin: ${admin.email} [role: ${admin.role}]`);

  // ── 2. Departments ─────────────────────────────────────────
  console.log('\n🏫  Seeding departments...');
  const deptMap = {};
  for (const dept of DEPARTMENTS) {
    const record = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name },
      create: dept,
    });
    deptMap[dept.code] = record;
    console.log(`   ✅  ${record.name} (${record.code}) — ID: ${record.id}`);
  }

  // ── 3. Semesters (CE dept, 8 semesters) ────────────────────
  console.log('\n📅  Seeding semesters (CE department)...');
  const ceDept = deptMap['CE'];
  const semesterMap = {}; // semesterNumber → db record

  for (let i = 1; i <= 8; i++) {
    const style = SEMESTER_STYLES[i - 1];
    // Find by departmentId + semesterNumber to avoid duplicate upsert issues
    const existing = await prisma.semester.findFirst({
      where: { departmentId: ceDept.id, semesterNumber: i },
    });

    const data = {
      departmentId: ceDept.id,
      semesterNumber: i,
      name: `Semester ${i}`,
      description: `Core subjects for Semester ${i} of Computer Engineering`,
      sortOrder: i,
      ...style,
    };

    const record = existing
      ? await prisma.semester.update({ where: { id: existing.id }, data })
      : await prisma.semester.create({ data });

    semesterMap[i] = record;
    console.log(`   ✅  Semester ${i} (ID: ${record.id})`);
  }

  // ── 4. Subjects ────────────────────────────────────────────
  console.log('\n📚  Seeding subjects...');
  let totalSubjects = 0;
  let styleIdx = 0;

  for (const [semNum, subjects] of Object.entries(SUBJECTS_BY_SEMESTER)) {
    const semester = semesterMap[parseInt(semNum)];
    if (!semester) {
      console.warn(`   ⚠️  Semester ${semNum} not found, skipping subjects`);
      continue;
    }

    for (const subj of subjects) {
      const style = SUBJECT_STYLES[styleIdx % SUBJECT_STYLES.length];
      styleIdx++;

      await prisma.subject.upsert({
        where: { code: subj.code },
        update: {
          title: subj.title,
          shortForm: subj.shortForm ?? null,
          description: subj.description ?? null,
          icon: subj.icon ?? null,
          cardType: subj.cardType ?? null,
          path: subj.path ?? null,
          sortOrder: subj.sortOrder,
          ...style,
        },
        create: {
          semesterId: semester.id,
          code: subj.code,
          title: subj.title,
          shortForm: subj.shortForm ?? null,
          description: subj.description ?? null,
          icon: subj.icon ?? null,
          cardType: subj.cardType ?? null,
          path: subj.path ?? null,
          sortOrder: subj.sortOrder,
          ...style,
        },
      });

      totalSubjects++;
    }

    console.log(`   ✅  Semester ${semNum}: ${subjects.length} subjects seeded`);
  }
  console.log(`   📦  Total subjects: ${totalSubjects}`);

  // ── 5. Announcements ───────────────────────────────────────
  console.log('\n📢  Seeding announcements...');
  for (const ann of ANNOUNCEMENTS) {
    const record = await upsertAnnouncement(ann);
    console.log(`   ✅  "${record.text.slice(0, 60)}..."`);
  }

  // ── 6. Opportunities ───────────────────────────────────────
  console.log('\n💼  Seeding opportunities...');
  for (const opp of OPPORTUNITIES) {
    const record = await upsertOpportunity(opp);
    console.log(`   ✅  ${record.title} [${record.category}]`);
  }

  // ── Summary ────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(55));
  console.log('🎉  Seeding complete!\n');
  console.log('   Admin email:     admin@campus.edu');
  console.log('   Admin password:  AdminPassword123!');
  console.log('   Departments:     ' + DEPARTMENTS.length);
  console.log('   Semesters:       8 (CE)');
  console.log('   Subjects:        ' + totalSubjects);
  console.log('   Announcements:   ' + ANNOUNCEMENTS.length);
  console.log('   Opportunities:   ' + OPPORTUNITIES.length);
  console.log('─'.repeat(55));
  console.log('\n   ⚠️  Change admin credentials before deploying to production!\n');
}

// ─────────────────────────────────────────────────────────────
//  ENTRY POINT
// ─────────────────────────────────────────────────────────────

main()
  .catch((err) => {
    console.error('\n❌  Seed failed:');
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
