import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSemestersCatalog } from '../../services/resources/resourcesApi';
import { submitResourceUpload } from '../../services/uploads/uploadsApi';
import { submitResourceRequest } from '../../services/requests/requestsApi';
import { ToastContainer, useToast } from '../../components/ui/Toast';

// ─── Department Stream Definitions ──────────────────────────────
const DEPARTMENTS = [
  {
    code: 'CE',
    name: 'Computer Engineering (CE)',
    status: 'Available • Sem 1-8',
    statusBg: 'bg-[#4ADE80] text-[#0F172A]',
    icon: 'memory',
    accentColor: '#FF5722',
    targetRoute: '/semesters',
    desc: 'Complete curriculum matrix covering Algorithms, Microprocessors, Database Systems, Computer Networks, and AI viva preparations.',
    stats: ['38 Subjects', '310+ Solved PYQs', '64 Lab Files'],
    isAvailable: true,
  },
  {
    code: 'CSE',
    name: 'Computer Science & Engineering (CSE)',
    status: 'Available • Sem 1-8',
    statusBg: 'bg-[#38BDF8] text-[#0F172A]',
    icon: 'laptop_mac',
    accentColor: '#38BDF8',
    targetRoute: '/semesters?dept=CSE',
    desc: 'Curated specializations for Data Science, Cloud Architectures, Theory of Computation, and Compiler Design coursework.',
    stats: ['26 Subjects', '180+ Solved PYQs', '42 Lab Files'],
    isAvailable: true,
  },
  {
    code: 'IT',
    name: 'Information Technology (IT)',
    status: 'Available • Sem 1-8',
    statusBg: 'bg-[#FBCFE8] text-[#0F172A]',
    icon: 'dns',
    accentColor: '#F472B6',
    targetRoute: '/semesters?dept=IT',
    desc: 'Specialized materials for Web Systems, Cybersecurity fundamentals, Information Security, and Enterprise Java frameworks.',
    stats: ['18 Subjects', '115+ Solved PYQs', '30 Lab Files'],
    isAvailable: true,
  },
];

// ─── 4 Feature Cards ─────────────────────────────────────────────
const FEATURES = [
  {
    image: '/images/verified-content.png',
    title: 'Verified Content',
    desc: 'All resources are reviewed by subject matter experts and top-performing alumni.',
    badge: '100% Verified',
    badgeBg: 'bg-[#FEF08A] text-[#0F172A]',
  },
  {
    image: '/images/organized.png',
    title: 'Organized',
    desc: 'Structured by semester and category for zero-friction navigation through your degree.',
    badge: 'Sem 1-8 Matrix',
    badgeBg: 'bg-[#BAE6FD] text-[#0F172A]',
  },
  {
    image: '/images/fast-downloads.png',
    title: 'Fast Downloads',
    desc: 'Optimized PDF sizes and high-speed servers for instant access even on mobile data.',
    badge: 'Direct High-Speed',
    badgeBg: 'bg-[#BBF7D0] text-[#0F172A]',
  },
  {
    image: '/images/updated-regularly.png',
    title: 'Updated Regularly',
    desc: 'New syllabus changes and the latest session papers are added within 24 hours of release.',
    badge: '2024-25 Syllabus',
    badgeBg: 'bg-[#FBCFE8] text-[#0F172A]',
  },
];

// ─── Full Fallback Syllabus Catalog ──────────────────────────────
const DEPARTMENT_CATALOG_DEFAULTS = {
  CE: {
    1: [
      { code: 'CE0101', name: 'Mathematics - I', credits: 4 },
      { code: 'CE0102', name: 'Physics', credits: 4 },
      { code: 'CE0103', name: 'Basic Electronics', credits: 4 },
      { code: 'CE0104', name: 'Programming Fundamentals (C)', credits: 5 },
      { code: 'CE0105', name: 'Engineering Graphics', credits: 3 },
    ],
    2: [
      { code: 'CE0201', name: 'Mathematics - II', credits: 4 },
      { code: 'CE0202', name: 'Data Structures', credits: 5 },
      { code: 'CE0203', name: 'Digital Electronics', credits: 4 },
      { code: 'CE0204', name: 'Object Oriented Programming (C++)', credits: 4 },
      { code: 'CE0205', name: 'Environmental Science', credits: 2 },
    ],
    3: [
      { code: 'CE0301', name: 'Discrete Mathematics', credits: 4 },
      { code: 'CE0302', name: 'Computer Organization', credits: 4 },
      { code: 'CE0303', name: 'Database Management Systems', credits: 5 },
      { code: 'CE0304', name: 'Java Programming', credits: 5 },
      { code: 'CE0305', name: 'Probability & Statistics', credits: 4 },
    ],
    4: [
      { code: 'CE0401', name: 'Operating Systems', credits: 4 },
      { code: 'CE0402', name: 'Computer Networks', credits: 4 },
      { code: 'CE0403', name: 'Theory of Computation', credits: 4 },
      { code: 'CE0404', name: 'Software Engineering', credits: 4 },
      { code: 'CE0405', name: 'Web Development', credits: 4 },
    ],
    5: [
      { code: 'CE0501', name: 'Design & Analysis of Algorithms', credits: 5 },
      { code: 'CE0502', name: 'Compiler Design', credits: 4 },
      { code: 'CE0503', name: 'Artificial Intelligence', credits: 4 },
      { code: 'CE0504', name: 'Mobile Application Development', credits: 4 },
      { code: 'CE0505', name: 'Information Security', credits: 4 },
    ],
    6: [
      { code: 'CE0601', name: 'Machine Learning', credits: 4 },
      { code: 'CE0602', name: 'Cloud Computing', credits: 4 },
      { code: 'CE0603', name: 'Internet of Things', credits: 4 },
      { code: 'CE0604', name: 'Big Data Analytics', credits: 4 },
      { code: 'CE0605', name: 'Distributed Systems', credits: 4 },
    ],
    7: [
      { code: 'CE0701', name: 'Deep Learning', credits: 4 },
      { code: 'CE0702', name: 'Blockchain Technology', credits: 4 },
      { code: 'CE0703', name: 'Natural Language Processing', credits: 4 },
      { code: 'CE0704', name: 'DevOps & CI/CD', credits: 4 },
    ],
    8: [
      { code: 'CE0801', name: 'Project Management', credits: 3 },
      { code: 'CE0802', name: 'Ethics in Computing', credits: 3 },
      { code: 'CE0803', name: 'Major Project', credits: 12 },
    ],
  },
  CSE: {
    1: [
      { code: 'CS0101', name: 'Discrete Mathematics for CS', credits: 4 },
      { code: 'CS0102', name: 'Python Programming Lab', credits: 4 },
      { code: 'CS0103', name: 'Digital Logic Design', credits: 4 },
    ],
    2: [
      { code: 'CS0201', name: 'Linear Algebra & Numerical Methods', credits: 4 },
      { code: 'CS0202', name: 'Advanced C Programming & Pointers', credits: 5 },
      { code: 'CS0203', name: 'Object Oriented Paradigms (C++)', credits: 4 },
    ],
    3: [
      { code: 'CS0301', name: 'Advanced Data Structures & Algorithms', credits: 5 },
      { code: 'CS0302', name: 'Relational & NoSQL Database Systems', credits: 5 },
      { code: 'CS0303', name: 'Formal Languages & Automata', credits: 4 },
    ],
    4: [
      { code: 'CS0401', name: 'Design and Analysis of Algorithms (DAA)', credits: 5 },
      { code: 'CS0402', name: 'Modern Operating Systems & Kernel', credits: 4 },
      { code: 'CS0403', name: 'Java Enterprise Architecture', credits: 5 },
    ],
    5: [
      { code: 'CS0501', name: 'Artificial Intelligence & Search Tech', credits: 5 },
      { code: 'CS0502', name: 'Cloud Native Systems & Containers', credits: 4 },
      { code: 'CS0503', name: 'Big Data Processing (Hadoop/Spark)', credits: 4 },
    ],
    6: [
      { code: 'CS0601', name: 'Machine Learning & Deep Neural Nets', credits: 5 },
      { code: 'CS0602', name: 'Natural Language Processing (NLP)', credits: 4 },
      { code: 'CS0603', name: 'Distributed Systems & Blockchain', credits: 4 },
    ],
    7: [
      { code: 'CS0701', name: 'Reinforcement Learning & LLMs', credits: 4 },
      { code: 'CS0702', name: 'Information Retrieval & Search Engines', credits: 4 },
      { code: 'CS0703', name: 'Major Capstone Project - Phase 1', credits: 6 },
    ],
    8: [
      { code: 'CS0801', name: 'Full-Semester Industry Capstone', credits: 12 },
      { code: 'CS0802', name: 'Engineering Economics & IPR', credits: 3 },
    ],
  },
  IT: {
    1: [
      { code: 'IT0101', name: 'Information Technology Fundamentals', credits: 4 },
      { code: 'IT0102', name: 'Python for Data Analysis', credits: 4 },
      { code: 'IT0103', name: 'Applied Mathematics - 1', credits: 4 },
    ],
    2: [
      { code: 'IT0201', name: 'Applied Mathematics - 2', credits: 4 },
      { code: 'IT0202', name: 'Data Structures in C++', credits: 5 },
      { code: 'IT0203', name: 'Web Development Basics (HTML/CSS/JS)', credits: 4 },
    ],
    3: [
      { code: 'IT0301', name: 'Database Management Systems (SQL)', credits: 5 },
      { code: 'IT0302', name: 'Computer Organization & Architecture', credits: 4 },
      { code: 'IT0303', name: 'Core Java Programming', credits: 5 },
    ],
    4: [
      { code: 'IT0401', name: 'Operating System Principles', credits: 4 },
      { code: 'IT0402', name: 'Computer Communication Networks', credits: 4 },
      { code: 'IT0403', name: 'Fullstack Web Technologies (MERN)', credits: 5 },
    ],
    5: [
      { code: 'IT0501', name: 'Enterprise Java & Spring Boot', credits: 5 },
      { code: 'IT0502', name: 'Information & Network Security', credits: 4 },
      { code: 'IT0503', name: 'Mobile App Development', credits: 4 },
    ],
    6: [
      { code: 'IT0601', name: 'Data Mining & Business Analytics', credits: 4 },
      { code: 'IT0602', name: 'Cyber Forensics & Incident Response', credits: 4 },
      { code: 'IT0603', name: 'Internet of Things (IoT) & Sensors', credits: 4 },
    ],
    7: [
      { code: 'IT0701', name: 'Artificial Intelligence & Big Data', credits: 4 },
      { code: 'IT0702', name: 'DevOps & Site Reliability Eng', credits: 4 },
      { code: 'IT0703', name: 'IT Project - Phase 1', credits: 6 },
    ],
    8: [
      { code: 'IT0801', name: 'Industry Internship / Enterprise Project', credits: 12 },
      { code: 'IT0802', name: 'Cyber Law & Ethics', credits: 3 },
    ],
  },
};

const RESOURCE_TYPES = [
  'Notes',
  'Previous Year Papers (PYQ)',
  'Practical File',
  'Viva Questions',
  'Question Bank',
  'Syllabus',
  'Lab Manual',
  'Other',
];

const INDUS_ESE_PAPER_STYLE = [
  {
    qNumber: 'Q.1',
    title: 'Question 1: Unit – I Core Theory & Application',
    unit: 'Unit – I',
    unitBadge: 'UNIT 1',
    totalMarks: 20,
    parts: [
      {
        part: 'A',
        syllabus: 'From Syllabus of Unit – I',
        taxonomy: 'Remember',
        taxonomyLevel: 'Bloom: Remember',
        taxonomyColor: 'emerald',
        marks: 10,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Direct definitions, fundamental properties, theorem statements, and structured enumeration from Unit 1.',
      },
      {
        part: 'B',
        syllabus: 'From Syllabus of Unit – I',
        taxonomy: 'Understanding / Application',
        taxonomyLevel: 'Bloom: Understanding / Application',
        taxonomyColor: 'sky',
        marks: 10,
        keywords: [
          'Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast',
          'Paraphrase', 'Discuss', 'Extrapolate', 'Predict', 'Convert', 'Distinguish',
          'Solve', 'Use', 'Compute', 'Demonstrate', 'Calculate',
        ],
        description: 'Conceptual explanations, comparative analysis, mathematical calculations, and application problems from Unit 1.',
      },
    ],
  },
  {
    qNumber: 'Q.2',
    title: 'Question 2: Unit – II Core Theory & Application',
    unit: 'Unit – II',
    unitBadge: 'UNIT 2',
    totalMarks: 20,
    parts: [
      {
        part: 'A',
        syllabus: 'From Syllabus Unit – II',
        taxonomy: 'Remember',
        taxonomyLevel: 'Bloom: Remember',
        taxonomyColor: 'emerald',
        marks: 10,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Core definitions, protocol listings, structural taxonomies, and architectural outlines from Unit 2.',
      },
      {
        part: 'B',
        syllabus: 'From Syllabus Unit – II',
        taxonomy: 'Understanding / Application',
        taxonomyLevel: 'Bloom: Understanding / Application',
        taxonomyColor: 'sky',
        marks: 10,
        keywords: [
          'Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast',
          'Paraphrase', 'Discuss', 'Extrapolate', 'Predict', 'Convert', 'Distinguish',
          'Solve', 'Use', 'Compute', 'Demonstrate', 'Calculate',
        ],
        description: 'State machine comparisons, workflow explanations, data structure operations, and calculations from Unit 2.',
      },
    ],
  },
  {
    qNumber: 'Q.3',
    title: 'Question 3: Unit – III Core Theory & Application',
    unit: 'Unit – III',
    unitBadge: 'UNIT 3',
    totalMarks: 20,
    parts: [
      {
        part: 'A',
        syllabus: 'From Syllabus Unit – III',
        taxonomy: 'Remember',
        taxonomyLevel: 'Bloom: Remember',
        taxonomyColor: 'emerald',
        marks: 10,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Standard terminology, rule declarations, protocol criteria, and fundamental listings from Unit 3.',
      },
      {
        part: 'B',
        syllabus: 'From Syllabus Unit – III',
        taxonomy: 'Understanding / Application',
        taxonomyLevel: 'Bloom: Understanding / Application',
        taxonomyColor: 'sky',
        marks: 10,
        keywords: [
          'Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast',
          'Paraphrase', 'Discuss', 'Extrapolate', 'Predict', 'Convert', 'Distinguish',
          'Solve', 'Use', 'Compute', 'Demonstrate', 'Calculate',
        ],
        description: 'Comparative differentiation, execution sequence analysis, performance modeling, and applied problems from Unit 3.',
      },
    ],
  },
  {
    qNumber: 'Q.4',
    title: 'Question 4: Unit – IV Core Theory & Application',
    unit: 'Unit – IV',
    unitBadge: 'UNIT 4',
    totalMarks: 20,
    parts: [
      {
        part: 'A',
        syllabus: 'From Syllabus Unit – IV',
        taxonomy: 'Remember',
        taxonomyLevel: 'Bloom: Remember',
        taxonomyColor: 'emerald',
        marks: 10,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Formal definitions, boundary condition rules, category outlines, and specifications from Unit 4.',
      },
      {
        part: 'B',
        syllabus: 'From Syllabus Unit – IV',
        taxonomy: 'Understanding / Application',
        taxonomyLevel: 'Bloom: Understanding / Application',
        taxonomyColor: 'sky',
        marks: 10,
        keywords: [
          'Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast',
          'Paraphrase', 'Discuss', 'Extrapolate', 'Predict', 'Convert', 'Distinguish',
          'Solve', 'Use', 'Compute', 'Demonstrate', 'Calculate',
        ],
        description: 'System diagrams, resource allocation proofs, comparative matrices, and multi-step calculations from Unit 4.',
      },
    ],
  },
  {
    qNumber: 'Q.5',
    title: 'Question 5: Analytical Evaluation Box (Answer Any Four)',
    unit: 'Units I – IV',
    unitBadge: 'ALL UNITS',
    totalMarks: 20,
    instruction: 'Answer Any Four (05*4=20)',
    instructionDetail: 'Choose 4 questions (05M each). Unit 1 and Unit 2 questions with internal OR options on Unit 3 and Unit 4.',
    isOptionalQuestion: true,
    sections: [
      {
        partLabel: '5(a)',
        part: 'A',
        syllabus: 'From Syllabus Unit – 1',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyBadge: 'bg-purple-100 text-purple-900 border-purple-300',
        marks: 5,
        isOptional: false,
        hasOrChoice: false,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'Critical analysis, deconstruction, and architectural contrast of Unit 1 concepts.',
      },
      {
        partLabel: '5(b)',
        part: 'B',
        syllabus: 'From Syllabus Unit – 2',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyBadge: 'bg-purple-100 text-purple-900 border-purple-300',
        marks: 5,
        isOptional: false,
        hasOrChoice: false,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'In-depth analysis, algorithm trade-offs, and behavioral breakdown of Unit 2 systems.',
      },
      {
        partLabel: '5(c)',
        part: 'C / D',
        syllabus: 'From Syllabus Unit – 3',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyBadge: 'bg-purple-100 text-purple-900 border-purple-300',
        marks: 5,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          part: 'C',
          label: 'Option 1 (Part C)',
          text: 'From Syllabus Unit – 3 (Bloom’s Taxonomy : Analysis) 05 Marks',
          keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
          description: 'Protocol dissection, edge case correlation, and structural analysis of Unit 3 methods.',
        },
        orOption: {
          part: 'D',
          label: 'Option 2 (Part D)',
          text: 'From Syllabus Unit – 3 (Bloom’s Taxonomy : Analysis) 05 Marks',
          keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
          description: 'Comparative deconstruction and analytical justification of Unit 3 mechanisms.',
        },
      },
      {
        partLabel: '5(d)',
        part: 'E / F',
        syllabus: 'From Syllabus Unit – 4',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyBadge: 'bg-purple-100 text-purple-900 border-purple-300',
        marks: 5,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          part: 'E',
          label: 'Option 1 (Part E)',
          text: 'From Syllabus Unit – 4 (Bloom’s Taxonomy : Analysis) 05 Marks',
          keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
          description: 'System-level analysis, trade-off matrix evaluation, and architectural breakdown of Unit 4.',
        },
        orOption: {
          part: 'F',
          label: 'Option 2 (Part F)',
          text: 'From Syllabus Unit – 4 (Bloom’s Taxonomy : Analysis) 05 Marks',
          keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
          description: 'Advanced breakdown, comparative synthesis, and selection rationale across Unit 4 implementations.',
        },
      },
    ],
    parts: [
      {
        part: 'A',
        syllabus: 'From Syllabus Unit – 1',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyColor: 'purple',
        marks: 5,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'Critical analysis, deconstruction, and architectural contrast of Unit 1 concepts.',
      },
      {
        part: 'B',
        syllabus: 'From Syllabus Unit – 2',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyColor: 'purple',
        marks: 5,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'In-depth analysis, algorithm trade-offs, and behavioral breakdown of Unit 2 systems.',
      },
      {
        part: 'C',
        syllabus: 'From Syllabus Unit – 3',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyColor: 'purple',
        marks: 5,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'Protocol dissection, edge case correlation, and structural analysis of Unit 3 methods.',
      },
      {
        part: 'D',
        syllabus: 'From Syllabus Unit – 3',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyColor: 'purple',
        marks: 5,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'Comparative deconstruction and analytical justification of Unit 3 mechanisms.',
      },
      {
        part: 'E',
        syllabus: 'From Syllabus Unit – 4',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyColor: 'purple',
        marks: 5,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'System-level analysis, trade-off matrix evaluation, and architectural breakdown of Unit 4.',
      },
      {
        part: 'F',
        syllabus: 'From Syllabus Unit – 4',
        taxonomy: 'Analysis',
        taxonomyLevel: 'Bloom: Analysis',
        taxonomyColor: 'purple',
        marks: 5,
        keywords: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
        description: 'Advanced breakdown, comparative synthesis, and selection rationale across Unit 4 implementations.',
      },
    ],
  },
];

const BLOOM_TAXONOMY_SUMMARY = [
  {
    name: 'Remember',
    level: 'L1 Cognitive Domain',
    marks: 40,
    percentage: '40% of Total Paper',
    barWidth: 'w-[40%]',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    dotColor: 'bg-emerald-500',
    description: 'Direct recall of definitions, principles, formulas, laws, and enumerated lists.',
    paperCoverage: 'Q.1(A) [10M] + Q.2(A) [10M] + Q.3(A) [10M] + Q.4(A) [10M]',
    keyActionVerbs: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
  },
  {
    name: 'Understanding / Application',
    level: 'L2 & L3 Cognitive Domain',
    marks: 40,
    percentage: '40% of Total Paper',
    barWidth: 'w-[40%]',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-400',
    dotColor: 'bg-sky-500',
    description: 'Conceptual comprehension, comparisons, derivations, and applied mathematical calculations.',
    paperCoverage: 'Q.1(B) [10M] + Q.2(B) [10M] + Q.3(B) [10M] + Q.4(B) [10M]',
    keyActionVerbs: [
      'Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast',
      'Paraphrase', 'Discuss', 'Extrapolate', 'Predict', 'Convert', 'Distinguish',
      'Solve', 'Use', 'Compute', 'Demonstrate', 'Calculate',
    ],
  },
  {
    name: 'Analysis',
    level: 'L4 Cognitive Domain',
    marks: 20,
    percentage: '20% of Total Paper',
    barWidth: 'w-[20%]',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-400',
    dotColor: 'bg-purple-500',
    description: 'Deconstructing complex concepts into sub-elements, comparing architectural trade-offs, and critical correlation.',
    paperCoverage: 'Q.5: Answer Any 4 out of 6 options (A, B, C, D, E, F) [5M × 4 = 20M]',
    keyActionVerbs: ['Analyze', 'Compare', 'Contrast', 'Deconstruct', 'Outline', 'Select', 'Separate', 'Correlate', 'Breakdown'],
  },
];

const INDUS_MSE_PAPER_STYLE = [
  {
    qNumber: 'Q 1',
    title: 'Question 1: Unit – 1 Knowledge & Fundamental Recall',
    unit: 'Unit - 1',
    unitBadge: 'UNIT 1',
    totalMarks: 8,
    instruction: 'Unit 1 Foundation Questions (04 + 04 = 08 Marks)',
    instructionDetail: 'Compulsory sub-question 1(a) plus choice-based sub-question 1(b) with internal OR.',
    sections: [
      {
        partLabel: '1(a)',
        syllabus: 'Unit - 1 (Cognitive Level – I)',
        cognitiveLevel: 'Cognitive Level – I',
        taxonomyName: 'Remember / Recall',
        taxonomyBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        marks: 4,
        isOptional: false,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Direct definitions, fundamental laws, core principles, and basic classifications from Unit 1.',
      },
      {
        partLabel: '1(b)',
        syllabus: 'Unit - 1 (Cognitive Level – I)',
        cognitiveLevel: 'Cognitive Level – I',
        taxonomyName: 'Remember / Recall',
        taxonomyBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        marks: 4,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          label: 'Option 1',
          text: 'Unit - 1 (Cognitive Level – I) 04',
          keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
          description: 'Standard conceptual definitions and theorem statements from Unit 1.',
        },
        orOption: {
          label: 'Option 2',
          text: 'Unit – 1 (Cognitive Level – I) 04',
          keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
          description: 'Alternative fundamental recall question or listing exercise from Unit 1.',
        },
      },
    ],
  },
  {
    qNumber: 'Q 2',
    title: 'Question 2: Unit – 2 Theory, Comprehension & Application',
    unit: 'Unit – 2',
    unitBadge: 'UNIT 2',
    totalMarks: 16,
    instruction: 'Unit 2 Comprehensive Split (04 + 06 + 06 = 16 Marks)',
    instructionDetail: 'Sub-question 2(a) is compulsory (04M). Sub-questions 2(b) (06M) and 2(c) (06M) each offer an internal OR option.',
    sections: [
      {
        partLabel: '2(a)',
        syllabus: 'Unit – 2 (Cognitive Level – I)',
        cognitiveLevel: 'Cognitive Level – I',
        taxonomyName: 'Remember / Recall',
        taxonomyBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        marks: 4,
        isOptional: false,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Core concepts, terminologies, architecture outlines, and specifications from Unit 2.',
      },
      {
        partLabel: '2(b)',
        syllabus: 'Unit – 2 (Cognitive Level – II)',
        cognitiveLevel: 'Cognitive Level – II',
        taxonomyName: 'Understanding / Comprehension',
        taxonomyBadge: 'bg-sky-100 text-sky-900 border-sky-300',
        marks: 6,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          label: 'Option 1',
          text: 'Unit – 2 (Cognitive Level – II) 06',
          keywords: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast'],
          description: 'In-depth conceptual explanation, comparative breakdown, or workflow mechanism from Unit 2.',
        },
        orOption: {
          label: 'Option 2',
          text: 'Unit – 2 (Cognitive Level – II) 06',
          keywords: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast'],
          description: 'Alternative descriptive mechanism, comparative distinction table, or system interpretation from Unit 2.',
        },
      },
      {
        partLabel: '2(c)',
        syllabus: 'Unit – 2 (Cognitive Level – III)',
        cognitiveLevel: 'Cognitive Level – III',
        taxonomyName: 'Application / Problem Solving',
        taxonomyBadge: 'bg-purple-100 text-purple-900 border-purple-300',
        marks: 6,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          label: 'Option 1',
          text: 'Unit – 2 (Cognitive Level – III) 06',
          keywords: ['Solve', 'Calculate', 'Compute', 'Demonstrate', 'Apply', 'Implement'],
          description: 'Practical problem solving, mathematical derivation, or case application from Unit 2.',
        },
        orOption: {
          label: 'Option 2',
          text: 'Unit – 2 (Cognitive Level – III) 06',
          keywords: ['Solve', 'Calculate', 'Compute', 'Demonstrate', 'Apply', 'Implement'],
          description: 'Alternative numerical computation, algorithm tracing, or applied scenario from Unit 2.',
        },
      },
    ],
  },
  {
    qNumber: 'Q 3',
    title: 'Question 3: Unit – 3 Theory, Comprehension & Application',
    unit: 'Unit – 3',
    unitBadge: 'UNIT 3',
    totalMarks: 16,
    instruction: 'Unit 3 Comprehensive Split (04 + 06 + 06 = 16 Marks)',
    instructionDetail: 'Sub-question 3(a) is compulsory (04M). Sub-questions 3(b) (06M) and 3(c) (06M) each offer an internal OR option.',
    sections: [
      {
        partLabel: '3(a)',
        syllabus: 'Unit – 3 (Cognitive Level – I)',
        cognitiveLevel: 'Cognitive Level – I',
        taxonomyName: 'Remember / Recall',
        taxonomyBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        marks: 4,
        isOptional: false,
        keywords: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
        description: 'Direct definitions, parameter listings, theorem statements, and structural overviews from Unit 3.',
      },
      {
        partLabel: '3(b)',
        syllabus: 'Unit – 3 (Cognitive Level – II)',
        cognitiveLevel: 'Cognitive Level – II',
        taxonomyName: 'Understanding / Comprehension',
        taxonomyBadge: 'bg-sky-100 text-sky-900 border-sky-300',
        marks: 6,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          label: 'Option 1',
          text: 'Unit – 3 (Cognitive Level – II) 06',
          keywords: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast'],
          description: 'System architectural explanation, trade-off analysis, or protocol interpretation from Unit 3.',
        },
        orOption: {
          label: 'Option 2',
          text: 'Unit – 3 (Cognitive Level – II) 06',
          keywords: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast'],
          description: 'Alternative workflow comparison, descriptive diagram, or conceptual derivation from Unit 3.',
        },
      },
      {
        partLabel: '3(c)',
        syllabus: 'Unit – 3 (Cognitive Level – III)',
        cognitiveLevel: 'Cognitive Level – III',
        taxonomyName: 'Application / Problem Solving',
        taxonomyBadge: 'bg-purple-100 text-purple-900 border-purple-300',
        marks: 6,
        isOptional: true,
        hasOrChoice: true,
        primaryOption: {
          label: 'Option 1',
          text: 'Unit – 3 (Cognitive Level – III) 06',
          keywords: ['Solve', 'Calculate', 'Compute', 'Demonstrate', 'Apply', 'Implement'],
          description: 'Engineering numerical calculation, implementation problem, or real-world application from Unit 3.',
        },
        orOption: {
          label: 'Option 2',
          text: 'Unit – 3 (Cognitive Level – III) 06',
          keywords: ['Solve', 'Calculate', 'Compute', 'Demonstrate', 'Apply', 'Implement'],
          description: 'Alternative application problem, mathematical solution, or algorithmic design from Unit 3.',
        },
      },
    ],
  },
];

const MSE_COGNITIVE_SUMMARY = [
  {
    name: 'Cognitive Level – I (Remember)',
    level: 'Bloom L1 Domain',
    marks: 16,
    percentage: '40% of Total Paper',
    barWidth: 'w-[40%]',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    dotColor: 'bg-emerald-500',
    description: 'Knowledge recall, direct definitions, theorem statements, and list enumerations across Units 1, 2, and 3.',
    paperCoverage: 'Q 1 [8M (4M + 4M)] + Q 2(a) [4M] + Q 3(a) [4M]',
    keyActionVerbs: ['Define', 'List', 'State', 'Enumerate', 'Outline', 'Tabulate'],
  },
  {
    name: 'Cognitive Level – II (Understanding)',
    level: 'Bloom L2 Domain',
    marks: 12,
    percentage: '30% of Total Paper',
    barWidth: 'w-[30%]',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-400',
    dotColor: 'bg-sky-500',
    description: 'Comprehension, comparative analysis, workflow explanation, and interpretive reasoning with internal choice options.',
    paperCoverage: 'Q 2(b) [6M with OR] + Q 3(b) [6M with OR]',
    keyActionVerbs: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Classify', 'Compare', 'Contrast'],
  },
  {
    name: 'Cognitive Level – III (Application)',
    level: 'Bloom L3 Domain',
    marks: 12,
    percentage: '30% of Total Paper',
    barWidth: 'w-[30%]',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-400',
    dotColor: 'bg-purple-500',
    description: 'Applied engineering calculations, mathematical problem solving, algorithm tracing, and practical implementations.',
    paperCoverage: 'Q 2(c) [6M with OR] + Q 3(c) [6M with OR]',
    keyActionVerbs: ['Solve', 'Calculate', 'Compute', 'Demonstrate', 'Apply', 'Implement'],
  },
];

export default function Resources() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  // Examination Mode Switcher ('ESE' = 100M End Sem, 'MSE' = 40M Mid Sem)
  const [selectedExamMode, setSelectedExamMode] = useState('ESE'); // 'ESE' | 'MSE'

  // Blueprint Tab and Filter state
  const [blueprintTab, setBlueprintTab] = useState('questions'); // 'questions' | 'taxonomy'
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('ALL'); // 'ALL' | Unit filters

  const handleExamModeChange = (mode) => {
    setSelectedExamMode(mode);
    setSelectedUnitFilter('ALL');
  };

  // Dynamic Syllabus Catalog state
  const [dbCatalog, setDbCatalog] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const data = await fetchSemestersCatalog();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setDbCatalog(data);
        }
      } catch (err) {
        console.warn('Could not load live semester catalog:', err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract subjects for department and semester
  const getSubjectsForDepartmentAndSem = (deptCode, semNum) => {
    if (dbCatalog && dbCatalog.length > 0) {
      const match = dbCatalog.find(
        (s) =>
          (s.number === semNum || s.semesterNumber === semNum) &&
          (s.departmentCode === deptCode || !s.departmentCode || s.departmentCode === 'CE')
      );
      if (match?.subjects && Array.isArray(match.subjects) && match.subjects.length > 0) {
        return match.subjects.map((sub) => ({
          code: String(sub.code || sub.subjectCode || 'CE0401'),
          name: sub.name || sub.title || 'Course',
          credits: sub.credits || 4,
        }));
      }
    }
    const branchFallback = DEPARTMENT_CATALOG_DEFAULTS[deptCode] || DEPARTMENT_CATALOG_DEFAULTS.CE;
    return branchFallback[semNum] || branchFallback[4] || [];
  };

  // ─── Contributor Hub States ───
  const [vaultTab, setVaultTab] = useState('upload'); // 'upload' | 'request'

  // Upload Form States
  const [uploadDept, setUploadDept] = useState('CE');
  const [uploadSem, setUploadSem] = useState(4);
  const uploadDeptSubjects = getSubjectsForDepartmentAndSem(uploadDept, uploadSem);
  const [uploadSubjectCode, setUploadSubjectCode] = useState(uploadDeptSubjects[0]?.code || 'CE0401');
  const [uploadCategory, setUploadCategory] = useState('Notes');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadEmail, setUploadEmail] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');

  // Request Form States
  const [requestDept, setRequestDept] = useState('CE');
  const [requestSem, setRequestSem] = useState(4);
  const requestDeptSubjects = getSubjectsForDepartmentAndSem(requestDept, requestSem);
  const [requestSubjectCode, setRequestSubjectCode] = useState(requestDeptSubjects[0]?.code || 'CE0401');
  const [requestCategory, setRequestCategory] = useState('Notes');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  // Sync subject dropdown defaults when branch or semester changes
  useEffect(() => {
    const subs = getSubjectsForDepartmentAndSem(uploadDept, uploadSem);
    if (subs.length > 0 && !subs.some((s) => s.code === uploadSubjectCode)) {
      setUploadSubjectCode(subs[0].code);
    }
  }, [uploadDept, uploadSem]);

  useEffect(() => {
    const reqSubs = getSubjectsForDepartmentAndSem(requestDept, requestSem);
    if (reqSubs.length > 0 && !reqSubs.some((s) => s.code === requestSubjectCode)) {
      setRequestSubjectCode(reqSubs[0].code);
    }
  }, [requestDept, requestSem]);

  // Handle Drag & Drop Upload
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
      setUploadErrorMsg('');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadErrorMsg('');
    }
  };

  // Upload Submission Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadErrorMsg('Please provide a descriptive resource title.');
      return;
    }
    if (!uploadFile) {
      setUploadErrorMsg('Please select a PDF, Document, or Zip archive to upload.');
      return;
    }
    if (!uploadEmail.trim()) {
      setUploadErrorMsg('Your email is required for contributor credit and approval alert.');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(15);
      setUploadErrorMsg('');

      const progTimer = setInterval(() => {
        setUploadProgress((p) => (p < 85 ? p + 15 : p));
      }, 200);

      const payload = {
        title: uploadTitle.trim(),
        subjectCode: uploadSubjectCode,
        resourceType: uploadCategory,
        contributorEmail: uploadEmail.trim(),
        authorAlias: uploadAuthor.trim() || 'Anonymous Topper',
        description: uploadDescription.trim() || `${uploadCategory} for ${uploadSubjectCode}`,
        file: uploadFile,
        ocrEnabled: ocrEnabled,
      };

      const result = await submitResourceUpload(payload);
      clearInterval(progTimer);
      setUploadProgress(100);

      if (result && !result.success && result.error) {
        throw new Error(result.error);
      }

      setUploadStatus('success');
      addToast({
        message: 'Resource submitted! Sent to moderation queue with topper attribution.',
        type: 'success',
        duration: 5000,
      });

      // Reset form after short delay
      setTimeout(() => {
        setUploadTitle('');
        setUploadFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 3000);
    } catch (err) {
      setUploadStatus('error');
      setUploadErrorMsg(err.message || 'Failed to submit resource. Please check connection.');
      addToast({
        message: err.message || 'Upload failed. Please try again.',
        type: 'error',
        duration: 4000,
      });
    }
  };

  // Request Submission Handler
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) {
      addToast({
        message: 'Please describe what resource or paper you need.',
        type: 'error',
        duration: 3500,
      });
      return;
    }

    if (!requestEmail.trim() || !requestEmail.endsWith('@gmail.com')) {
      addToast({
        message: 'A valid @gmail.com email is required for fulfillment alerts.',
        type: 'error',
        duration: 3500,
      });
      return;
    }

    try {
      setRequestLoading(true);
      const res = await submitResourceRequest({
        subjectCode: requestSubjectCode || 'CE0401',
        resourceType: requestCategory,
        message: `[${requestDept} Sem ${requestSem}] ${requestMessage.trim()}`,
        requesterEmail: requestEmail.trim(),
      });

      if (res && !res.success && res.error) {
        throw new Error(res.error);
      }

      addToast({
        message: 'Request submitted! We will alert your email once material is uploaded.',
        type: 'success',
        duration: 4500,
      });

      setRequestMessage('');
      setRequestEmail('');
    } catch (err) {
      addToast({
        message: err.message || 'Failed to submit request. Please try again.',
        type: 'error',
        duration: 4000,
      });
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-hub-navy">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── Background Decor Vector Layers ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Warm Cream Blob */}
        <div className="absolute top-[200px] -left-28 w-[280px] h-[380px] bg-amber-200/30 rounded-full blur-3xl lofty-pulse" />
        <div className="absolute top-[800px] -right-28 w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-3xl lofty-pulse" />

        {/* Far-Left Dots Grid */}
        <svg className="absolute top-14 left-4 w-16 h-28 opacity-40 lofty-float-slow" viewBox="0 0 60 140" fill="#F59E0B">
          <pattern id="r-dots-left" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" />
          </pattern>
          <rect width="60" height="140" fill="url(#r-dots-left)" />
        </svg>

        {/* Top-Right Navy Dots Grid */}
        <svg className="absolute top-8 right-12 w-24 h-24 opacity-30 lofty-float" viewBox="0 0 100 100" fill="#0D1B40">
          <pattern id="r-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="100" height="100" fill="url(#r-dots-tr)" />
        </svg>
      </div>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-6 pb-16 lg:pt-8 lg:pb-20 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-gray-500 mb-6">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-hub-navy font-bold">Resources</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 max-w-[560px]">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/80 text-hub-navy text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
                <span className="material-symbols-outlined text-sm text-amber-600">menu_book</span>
                <span>Academic Resources</span>
              </div>

              {/* Headline with Gold Brush Underline */}
              <h1 className="text-[40px] sm:text-5xl lg:text-[50px] xl:text-[54px] font-black text-hub-navy leading-[1.14] tracking-tight">
                Access All Your Academic
                <br />
                <span className="relative inline-block text-amber-500">
                  Resources
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 opacity-90"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
                {' '}in{' '}
                <span className="relative inline-block text-amber-500">
                  One Place
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 opacity-90"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed font-medium">
                Browse semester-wise notes, previous year papers, practical files, viva questions, question banks, syllabus, and other academic materials organized for easy access.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#departments"
                  className="inline-flex items-center gap-2.5 bg-hub-navy hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm cursor-pointer"
                >
                  <span>Explore Departments</span>
                  <span className="material-symbols-outlined text-lg leading-none">arrow_forward</span>
                </a>

                <a
                  href="#exam-strategy"
                  className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-hub-navy font-bold px-7 py-3.5 rounded-full border-2 border-amber-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm cursor-pointer"
                >
                  <span>Exam Blueprint</span>
                  <span className="material-symbols-outlined text-lg text-amber-600">analytics</span>
                </a>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-7 relative flex justify-center items-center lg:justify-end lg:pl-6">
              <div className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[720px] xl:max-w-[800px] lg:translate-x-8 xl:translate-x-12 transition-transform duration-500 hover:scale-[1.02]">
                <img
                  alt="Academic Resources Center Illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  src="/images/resource-hero-section.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. CHOOSE YOUR DEPARTMENT SECTION ─── */}
      <section id="departments" className="py-14 sm:py-20 relative scroll-mt-24 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm text-[#0F172A]">bolt</span>
              <span>CHOOSE YOUR STREAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
              Choose Your{' '}
              <span className="relative inline-block text-amber-500">
                Department
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-xl mx-auto pt-1">
              Select your engineering branch to access specialized academic resources, solved PYQs, and lab manuals.
            </p>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEPARTMENTS.map((dept) => {
              const liveSubjectsCount = (dept.code === 'CE' && dbCatalog)
                ? dbCatalog.reduce((sum, sem) => sum + (sem.subjects?.length || 0), 0)
                : 0;
              const liveStats = (liveSubjectsCount > 0)
                ? [`${liveSubjectsCount} Subjects`, dept.stats[1], dept.stats[2]]
                : dept.stats;

              return (
              <div
                key={dept.code}
                className="bg-white rounded-[32px] p-6 sm:p-9 border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
              >
                {/* Top Header Row with Status Badge (In-flow so it NEVER collides with center icon) */}
                <div className="w-full flex items-center justify-end mb-2 sm:mb-3">
                  <span className={`${dept.statusBg} text-[10px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#0F172A] uppercase tracking-wider shadow-xs`}>
                    {dept.status}
                  </span>
                </div>

                {/* Amber Icon Badge */}
                <div className="w-18 h-18 rounded-2xl bg-[#FEF3D6] text-hub-navy border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] flex items-center justify-center mb-5 sm:mb-6 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-4xl text-hub-navy">{dept.icon}</span>
                </div>

                <h3 className="text-xl font-black text-hub-navy mb-3 tracking-tight leading-snug">{dept.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium mb-6 max-w-[290px] mx-auto flex-1">
                  {dept.desc}
                </p>

                {/* Stats list */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                  {liveStats.map((st, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {st}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => navigate(dept.targetRoute)}
                  className="w-full sm:w-[90%] font-black py-3.5 rounded-full bg-hub-navy hover:bg-[#FF5722] text-white border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] hover:shadow-[5px_5px_0_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 text-sm mt-auto cursor-pointer"
                >
                  <span>Explore Vault</span>
                  <span className="material-symbols-outlined text-base leading-none transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* ─── 3. WHY CHOOSE OUR RESOURCES (4 Feature Cards) ─── */}
      <section className="py-12 sm:py-16 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-hub-navy tracking-tight">
              Why Students Trust Our Repository
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Built for speed, accuracy, and syllabus completeness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 border-[2px] border-[#0F172A] shadow-[4px_4px_0_#0F172A] hover:shadow-[6px_6px_0_#0F172A] hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img src={feat.image} alt={feat.title} className="max-h-full max-w-full object-contain" />
                </div>
                <span className={`${feat.badgeBg} text-[10px] font-black px-2.5 py-0.5 rounded-md border border-[#0F172A] uppercase mb-2`}>
                  {feat.badge}
                </span>
                <h4 className="text-base font-black text-hub-navy mb-1">{feat.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. EXAM STRATEGY & MARK SPLITS SECTION ─── */}
      <section id="exam-strategy" className="py-14 sm:py-20 relative z-10 bg-[#FAF8FF] border-y-[3px] border-[#0F172A] scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Examination Mode Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="inline-flex p-1.5 bg-white border-[2.5px] border-[#0F172A] rounded-2xl shadow-[3.5px_3.5px_0_#0F172A]">
              <button
                type="button"
                onClick={() => handleExamModeChange('ESE')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  selectedExamMode === 'ESE'
                    ? 'bg-[#0F172A] text-white shadow-[2px_2px_0_#FF5722]'
                    : 'text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-base text-[#FEF08A]">school</span>
                <span>End Sem Exam (ESE · 100M)</span>
              </button>
              <button
                type="button"
                onClick={() => handleExamModeChange('MSE')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  selectedExamMode === 'MSE'
                    ? 'bg-[#0F172A] text-white shadow-[2px_2px_0_#38BDF8]'
                    : 'text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-base text-[#38BDF8]">assignment</span>
                <span>Mid Sem Exam (MSE · 40M)</span>
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700">
              <span className="material-symbols-outlined text-sm text-[#FF5722]">bolt</span>
              <span>Indus Examination Standard 2025–2026</span>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFEDD5] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2.5">
                <span className="material-symbols-outlined text-[15px] text-[#FF5722]">analytics</span>
                <span>EXAM STRATEGY &amp; MARK SPLITS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
                {selectedExamMode === 'ESE' ? (
                  <>
                    Indus ESE Paper Style &amp; <span className="text-amber-500">Weightage Matrix</span>
                  </>
                ) : (
                  <>
                    Indus MSE Paper Style &amp; <span className="text-sky-500">Weightage Matrix</span>
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1 leading-relaxed">
                {selectedExamMode === 'ESE'
                  ? 'Official 100-Mark End Semester Examination question distribution with Bloom’s Taxonomy cognitive mapping.'
                  : 'Official 40-Mark Mid Semester Examination question distribution across Units 1, 2, and 3 with internal choice options.'}
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 shrink-0 w-full xl:w-auto">
              {selectedExamMode === 'ESE' ? (
                <>
                  <div className="bg-white border-[2.5px] border-[#0F172A] px-4 py-3 sm:py-3.5 shadow-[3.5px_3.5px_0_#0F172A] flex items-center gap-3.5 rounded-2xl">
                    <div className="w-12 h-12 bg-[#FACC15] text-[#0F172A] border-2 border-[#0F172A] flex items-center justify-center font-mono font-black text-xl rounded-xl shadow-[2px_2px_0_#0F172A] shrink-0">
                      100
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-[11px] uppercase font-black text-[#0F172A] tracking-wider leading-none mb-1">External ESE Paper</p>
                      <p className="text-xs font-bold text-emerald-700 leading-none">Passing Mark: 40/100 (40%)</p>
                    </div>
                  </div>
                  <div className="bg-[#E0E7FF] border-[2.5px] border-[#0F172A] px-4 py-3 sm:py-3.5 shadow-[3.5px_3.5px_0_#0F172A] flex items-center gap-3.5 rounded-2xl">
                    <div className="w-12 h-12 bg-[#818CF8] text-white border-2 border-[#0F172A] flex items-center justify-center font-mono font-black text-lg rounded-xl shadow-[2px_2px_0_#0F172A] shrink-0">
                      3h
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-[11px] uppercase font-black text-[#0F172A] tracking-wider leading-none mb-1">Exam Duration</p>
                      <p className="text-xs font-bold text-indigo-900 leading-none">5 Questions × 20M</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white border-[2.5px] border-[#0F172A] px-4 py-3 sm:py-3.5 shadow-[3.5px_3.5px_0_#0F172A] flex items-center gap-3.5 rounded-2xl">
                    <div className="w-12 h-12 bg-[#38BDF8] text-white border-2 border-[#0F172A] flex items-center justify-center font-mono font-black text-xl rounded-xl shadow-[2px_2px_0_#0F172A] shrink-0">
                      40
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-[11px] uppercase font-black text-[#0F172A] tracking-wider leading-none mb-1">Mid Sem Exam (MSE)</p>
                      <p className="text-xs font-bold text-emerald-700 leading-none">Passing Mark: 16/40 (40%)</p>
                    </div>
                  </div>
                  <div className="bg-[#E0E7FF] border-[2.5px] border-[#0F172A] px-4 py-3 sm:py-3.5 shadow-[3.5px_3.5px_0_#0F172A] flex items-center gap-3.5 rounded-2xl">
                    <div className="w-12 h-12 bg-[#6366F1] text-white border-2 border-[#0F172A] flex items-center justify-center font-mono font-black text-lg rounded-xl shadow-[2px_2px_0_#0F172A] shrink-0">
                      1.5h
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-[11px] uppercase font-black text-[#0F172A] tracking-wider leading-none mb-1">Exam Duration</p>
                      <p className="text-xs font-bold text-indigo-900 leading-none">3 Questions (40 Marks)</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interactive Navigation: Tabs + Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white border-[2.5px] border-[#0F172A] p-3 rounded-2xl shadow-[4px_4px_0_#0F172A]">
            {/* View Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setBlueprintTab('questions')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto ${
                  blueprintTab === 'questions'
                    ? 'bg-[#0F172A] text-white shadow-[2px_2px_0_#FF5722]'
                    : 'text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm">format_list_numbered</span>
                <span>
                  {selectedExamMode === 'ESE' ? 'Question Breakdown (Q.1 - Q.5)' : 'Question Breakdown (Q 1 - Q 3)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBlueprintTab('taxonomy')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto ${
                  blueprintTab === 'taxonomy'
                    ? 'bg-[#0F172A] text-white shadow-[2px_2px_0_#FF5722]'
                    : 'text-[#0F172A] hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm">psychology</span>
                <span>
                  {selectedExamMode === 'ESE'
                    ? 'Bloom’s Taxonomy Matrix (40% / 40% / 20%)'
                    : 'Cognitive Levels Matrix (40% / 30% / 30%)'}
                </span>
              </button>
            </div>

            {/* Unit Filters (Active when in Question Breakdown) */}
            {blueprintTab === 'questions' && (
              <div className="flex flex-wrap items-center gap-1.5">
                {(selectedExamMode === 'ESE'
                  ? [
                      { id: 'ALL', label: 'All (Q1–Q5)' },
                      { id: 'Unit – I', label: 'Unit I (Q1)' },
                      { id: 'Unit – II', label: 'Unit II (Q2)' },
                      { id: 'Unit – III', label: 'Unit III (Q3)' },
                      { id: 'Unit – IV', label: 'Unit IV (Q4)' },
                      { id: 'Q.5', label: 'Q.5 (Analysis Box)' },
                    ]
                  : [
                      { id: 'ALL', label: 'All (Q1–Q3)' },
                      { id: 'Unit - 1', label: 'Unit 1 (Q1)' },
                      { id: 'Unit – 2', label: 'Unit 2 (Q2)' },
                      { id: 'Unit – 3', label: 'Unit 3 (Q3)' },
                    ]
                ).map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setSelectedUnitFilter(flt.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase border transition-all cursor-pointer ${
                      selectedUnitFilter === flt.id
                        ? 'bg-[#FF5722] text-white border-[#0F172A] shadow-[1.5px_1.5px_0_#0F172A]'
                        : 'bg-[#FAF8FF] text-[#0F172A] border-slate-300 hover:border-[#0F172A]'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Blueprint Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Blueprint Content */}
            <div className="lg:col-span-8 space-y-6">

              {blueprintTab === 'questions' ? (
                /* TAB 1: QUESTION BREAKDOWN */
                selectedExamMode === 'ESE' ? (
                  /* ESE QUESTIONS (Q.1 to Q.5) */
                  <div className="space-y-6">
                    {INDUS_ESE_PAPER_STYLE
                      .filter((q) => {
                        if (selectedUnitFilter === 'ALL') return true;
                        if (selectedUnitFilter === 'Q.5') return q.qNumber === 'Q.5';
                        return q.unit === selectedUnitFilter;
                      })
                      .map((q) => (
                        <div
                          key={q.qNumber}
                          className={`bg-white border-[3px] border-[#0F172A] rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0_#0F172A] transition-all ${
                            q.isOptionalQuestion ? 'ring-2 ring-purple-400/50' : ''
                          }`}
                        >
                          {/* Question Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="w-12 h-10 bg-[#FEF08A] text-[#0F172A] border-2 border-[#0F172A] rounded-xl flex items-center justify-center font-mono font-black text-sm shadow-[2px_2px_0_#0F172A]">
                                {q.qNumber}
                              </span>
                              <div>
                                <h3 className="font-black text-base text-[#0F172A] leading-tight">
                                  {q.title}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                  Coverage: <span className="text-[#0F172A] font-bold">{q.unit}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="bg-[#E2E8F0] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                {q.unitBadge}
                              </span>
                              <span className="bg-[#4ADE80] text-[#0F172A] text-xs font-black px-3 py-1 rounded-lg border-2 border-[#0F172A] shadow-[1.5px_1.5px_0_#0F172A]">
                                {q.totalMarks} Marks
                              </span>
                            </div>
                          </div>

                          {/* Optional Question Callout Banner for Q.5 */}
                          {q.isOptionalQuestion && (
                            <div className="mb-5 bg-gradient-to-r from-[#FAF5FF] to-[#F3E8FF] border-2 border-purple-600/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                              <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-purple-700 text-xl">psychology</span>
                                <div>
                                  <p className="text-xs font-black text-purple-950 uppercase tracking-wide">
                                    {q.instruction}
                                  </p>
                                  <p className="text-[11px] font-semibold text-purple-800">
                                    {q.instructionDetail}
                                  </p>
                                </div>
                              </div>
                              <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full bg-purple-200 text-purple-900 border border-purple-400 text-[11px] font-black uppercase">
                                Higher Order Thinking (L4)
                              </span>
                            </div>
                          )}

                          {/* Sub-Questions Container */}
                          {q.isOptionalQuestion ? (
                            /* Q.5 4-Section Layout with Internal OR for Unit 3 & Unit 4 */
                            <div className="space-y-4">
                              {q.sections.map((sec, secIdx) => (
                                <div
                                  key={secIdx}
                                  className="bg-[#FAF8FF] border-2 border-[#0F172A] rounded-2xl p-4 sm:p-5 shadow-[2.5px_2.5px_0_#0F172A]"
                                >
                                  {/* Section Header */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#0F172A] text-white border-2 border-[#0F172A] rounded-xl font-mono font-black text-xs shadow-xs">
                                        {sec.partLabel}
                                      </span>
                                      <div>
                                        <h4 className="font-black text-sm text-[#0F172A]">
                                          {sec.syllabus}
                                        </h4>
                                        <span className={`inline-block mt-0.5 text-[10px] font-black uppercase px-2 py-0.5 rounded border ${sec.taxonomyBadge}`}>
                                          {sec.taxonomyLevel}
                                        </span>
                                      </div>
                                    </div>

                                    <span className="self-start sm:self-auto bg-[#FEF08A] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                      0{sec.marks} Marks
                                    </span>
                                  </div>

                                  {/* Compulsory Sub-Question (5a, 5b) */}
                                  {!sec.hasOrChoice && (
                                    <div>
                                      <p className="text-xs font-medium text-slate-600 mb-3 leading-relaxed">
                                        {sec.description}
                                      </p>
                                      <div className="bg-white border border-slate-200 rounded-xl p-3">
                                        <p className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-sm text-[#FF5722]">fact_check</span>
                                          <span>Action Keywords:</span>
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {sec.keywords.map((kw, kwIdx) => (
                                            <span
                                              key={kwIdx}
                                              className="px-2 py-0.5 bg-[#FAF8FF] border border-slate-300 rounded-md text-[11px] font-bold text-[#0F172A] shadow-2xs"
                                            >
                                              {kw}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Choice Sub-Questions with OR Divider (5c, 5d) */}
                                  {sec.hasOrChoice && (
                                    <div className="space-y-3">
                                      {/* Primary Option */}
                                      <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 shadow-2xs">
                                        <div className="flex items-center justify-between mb-1.5">
                                          <span className="text-[11px] font-black text-purple-700 uppercase">{sec.primaryOption.label}</span>
                                          <span className="text-xs font-black text-slate-800 font-mono">0{sec.marks} Marks</span>
                                        </div>
                                        <p className="text-xs font-black text-[#0F172A] mb-1.5">
                                          {sec.primaryOption.text}
                                        </p>
                                        <p className="text-xs font-medium text-slate-600 mb-2 leading-relaxed">
                                          {sec.primaryOption.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {sec.primaryOption.keywords.map((kw, kwIdx) => (
                                            <span
                                              key={kwIdx}
                                              className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700"
                                            >
                                              {kw}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      {/* OR Divider */}
                                      <div className="flex items-center gap-3 my-2">
                                        <div className="flex-1 h-0.5 bg-amber-400"></div>
                                        <span className="px-3.5 py-0.5 bg-[#FACC15] text-[#0F172A] border-2 border-[#0F172A] rounded-full text-xs font-black shadow-[1.5px_1.5px_0_#0F172A]">
                                          OR
                                        </span>
                                        <div className="flex-1 h-0.5 bg-amber-400"></div>
                                      </div>

                                      {/* Alternative Option */}
                                      <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 shadow-2xs">
                                        <div className="flex items-center justify-between mb-1.5">
                                          <span className="text-[11px] font-black text-purple-700 uppercase">{sec.orOption.label}</span>
                                          <span className="text-xs font-black text-slate-800 font-mono">0{sec.marks} Marks</span>
                                        </div>
                                        <p className="text-xs font-black text-[#0F172A] mb-1.5">
                                          {sec.orOption.text}
                                        </p>
                                        <p className="text-xs font-medium text-slate-600 mb-2 leading-relaxed">
                                          {sec.orOption.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {sec.orOption.keywords.map((kw, kwIdx) => (
                                            <span
                                              key={kwIdx}
                                              className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700"
                                            >
                                              {kw}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Q.1 to Q.4 (Part A & Part B) */
                            <div className="space-y-4">
                              {q.parts.map((sub) => (
                                <div
                                  key={sub.part}
                                  className="bg-[#FAF8FF] border-2 border-[#0F172A] rounded-2xl p-4 sm:p-5 shadow-[2.5px_2.5px_0_#0F172A] hover:bg-[#F8FAFC] transition-colors"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#0F172A] text-white border-2 border-[#0F172A] rounded-xl font-mono font-black text-xs shadow-xs">
                                        {sub.part}
                                      </span>
                                      <div>
                                        <h4 className="font-black text-sm text-[#0F172A]">
                                          Sub-Question {sub.part} · {sub.syllabus}
                                        </h4>
                                        <span
                                          className={`inline-block mt-0.5 text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                                            sub.taxonomy === 'Remember'
                                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                              : 'bg-sky-100 text-sky-900 border-sky-300'
                                          }`}
                                        >
                                          {sub.taxonomyLevel}
                                        </span>
                                      </div>
                                    </div>

                                    <span className="self-start sm:self-auto bg-[#FEF08A] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                      {sub.marks} Marks
                                    </span>
                                  </div>

                                  <p className="text-xs font-medium text-slate-600 mb-3 leading-relaxed">
                                    {sub.description}
                                  </p>

                                  <div className="bg-white border border-slate-200 rounded-xl p-3">
                                    <p className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                                      <span className="material-symbols-outlined text-sm text-[#FF5722]">fact_check</span>
                                      <span>Examination Action Verbs &amp; Keywords:</span>
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {sub.keywords.map((kw, kwIdx) => (
                                        <span
                                          key={kwIdx}
                                          className="px-2 py-0.5 bg-[#FAF8FF] border border-slate-300 rounded-md text-[11px] font-bold text-[#0F172A] hover:bg-[#FEF08A] transition-colors shadow-2xs"
                                        >
                                          {kw}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  /* MSE QUESTIONS (Q 1, Q 2, Q 3) */
                  <div className="space-y-6">
                    {INDUS_MSE_PAPER_STYLE
                      .filter((q) => {
                        if (selectedUnitFilter === 'ALL') return true;
                        return q.unit === selectedUnitFilter;
                      })
                      .map((q) => (
                        <div
                          key={q.qNumber}
                          className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0_#0F172A] transition-all"
                        >
                          {/* Question Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="w-12 h-10 bg-[#38BDF8] text-white border-2 border-[#0F172A] rounded-xl flex items-center justify-center font-mono font-black text-sm shadow-[2px_2px_0_#0F172A]">
                                {q.qNumber}
                              </span>
                              <div>
                                <h3 className="font-black text-base text-[#0F172A] leading-tight">
                                  {q.title}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                  Coverage: <span className="text-[#0F172A] font-bold">{q.unit}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="bg-[#E2E8F0] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                {q.unitBadge}
                              </span>
                              <span className="bg-[#4ADE80] text-[#0F172A] text-xs font-black px-3 py-1 rounded-lg border-2 border-[#0F172A] shadow-[1.5px_1.5px_0_#0F172A]">
                                0{q.totalMarks} Marks
                              </span>
                            </div>
                          </div>

                          {/* Instruction Callout Banner */}
                          <div className="mb-5 bg-[#F0FDF4] border-2 border-emerald-600/50 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="material-symbols-outlined text-emerald-700 text-xl">assignment_turned_in</span>
                              <div>
                                <p className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                                  {q.instruction}
                                </p>
                                <p className="text-[11px] font-semibold text-emerald-800">
                                  {q.instructionDetail}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 text-[11px] font-black uppercase">
                              Indus MSE Pattern
                            </span>
                          </div>

                          {/* Sub-Questions Container */}
                          <div className="space-y-4">
                            {q.sections.map((sec, secIdx) => (
                              <div
                                key={secIdx}
                                className="bg-[#FAF8FF] border-2 border-[#0F172A] rounded-2xl p-4 sm:p-5 shadow-[2.5px_2.5px_0_#0F172A]"
                              >
                                {/* Section Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2.5">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-[#0F172A] text-white border-2 border-[#0F172A] rounded-xl font-mono font-black text-xs shadow-xs">
                                      {sec.partLabel}
                                    </span>
                                    <div>
                                      <h4 className="font-black text-sm text-[#0F172A]">
                                        {sec.syllabus}
                                      </h4>
                                      <span className={`inline-block mt-0.5 text-[10px] font-black uppercase px-2 py-0.5 rounded border ${sec.taxonomyBadge}`}>
                                        {sec.cognitiveLevel} · {sec.taxonomyName}
                                      </span>
                                    </div>
                                  </div>

                                  <span className="self-start sm:self-auto bg-[#FEF08A] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                    0{sec.marks} Marks
                                  </span>
                                </div>

                                {/* Compulsory Sub-Question */}
                                {!sec.hasOrChoice && (
                                  <div>
                                    <p className="text-xs font-medium text-slate-600 mb-3 leading-relaxed">
                                      {sec.description}
                                    </p>
                                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                                      <p className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm text-[#FF5722]">fact_check</span>
                                        <span>Action Keywords:</span>
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {sec.keywords.map((kw, kwIdx) => (
                                          <span
                                            key={kwIdx}
                                            className="px-2 py-0.5 bg-[#FAF8FF] border border-slate-300 rounded-md text-[11px] font-bold text-[#0F172A] shadow-2xs"
                                          >
                                            {kw}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Choice Sub-Questions with OR Divider */}
                                {sec.hasOrChoice && (
                                  <div className="space-y-3">
                                    {/* Primary Option */}
                                    <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 shadow-2xs">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[11px] font-black text-slate-500 uppercase">{sec.primaryOption.label}</span>
                                        <span className="text-xs font-black text-slate-800 font-mono">0{sec.marks} Marks</span>
                                      </div>
                                      <p className="text-xs font-black text-[#0F172A] mb-1.5">
                                        {sec.primaryOption.text}
                                      </p>
                                      <p className="text-xs font-medium text-slate-600 mb-2 leading-relaxed">
                                        {sec.primaryOption.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {sec.primaryOption.keywords.map((kw, kwIdx) => (
                                          <span
                                            key={kwIdx}
                                            className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700"
                                          >
                                            {kw}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* OR Divider */}
                                    <div className="flex items-center gap-3 my-2">
                                      <div className="flex-1 h-0.5 bg-amber-400"></div>
                                      <span className="px-3.5 py-0.5 bg-[#FACC15] text-[#0F172A] border-2 border-[#0F172A] rounded-full text-xs font-black shadow-[1.5px_1.5px_0_#0F172A]">
                                        OR
                                      </span>
                                      <div className="flex-1 h-0.5 bg-amber-400"></div>
                                    </div>

                                    {/* Alternative Option */}
                                    <div className="bg-white border-2 border-slate-300 rounded-xl p-3.5 shadow-2xs">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[11px] font-black text-slate-500 uppercase">{sec.orOption.label}</span>
                                        <span className="text-xs font-black text-slate-800 font-mono">0{sec.marks} Marks</span>
                                      </div>
                                      <p className="text-xs font-black text-[#0F172A] mb-1.5">
                                        {sec.orOption.text}
                                      </p>
                                      <p className="text-xs font-medium text-slate-600 mb-2 leading-relaxed">
                                        {sec.orOption.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {sec.orOption.keywords.map((kw, kwIdx) => (
                                          <span
                                            key={kwIdx}
                                            className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700"
                                          >
                                            {kw}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )
              ) : (
                /* TAB 2: TAXONOMY / COGNITIVE MATRIX */
                selectedExamMode === 'ESE' ? (
                  /* ESE BLOOM’S TAXONOMY MATRIX (100M) */
                  <div className="space-y-6">
                    {/* Cognitive Distribution Progress Visualizer */}
                    <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-base font-black text-hub-navy uppercase">
                            Overall 100-Mark Cognitive Level Ratio
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Indus University ESE evaluation balance across Bloom’s Taxonomy tiers.
                          </p>
                        </div>
                        <span className="text-xs font-mono font-black bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                          Total: 100 Marks
                        </span>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div className="h-5 w-full bg-slate-100 rounded-xl border-2 border-[#0F172A] overflow-hidden flex shadow-xs mb-3">
                        <div className="w-[40%] bg-emerald-500 flex items-center justify-center text-[10px] font-mono font-black text-white" title="Remember: 40 Marks (40%)">
                          40%
                        </div>
                        <div className="w-[40%] bg-sky-500 flex items-center justify-center text-[10px] font-mono font-black text-white" title="Understanding / Application: 40 Marks (40%)">
                          40%
                        </div>
                        <div className="w-[20%] bg-purple-500 flex items-center justify-center text-[10px] font-mono font-black text-white" title="Analysis: 20 Marks (20%)">
                          20%
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-[#0F172A]"></span>
                          <span className="text-slate-700">Remember: 40M (40%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-sky-500 border border-[#0F172A]"></span>
                          <span className="text-slate-700">Understanding / Application: 40M (40%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-purple-500 border border-[#0F172A]"></span>
                          <span className="text-slate-700">Analysis: 20M (20%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Taxonomy Detailed Cards */}
                    <div className="space-y-4">
                      {BLOOM_TAXONOMY_SUMMARY.map((tx) => (
                        <div
                          key={tx.name}
                          className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b-2 border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${tx.dotColor} border border-[#0F172A]`}></span>
                                <h4 className="text-base font-black text-[#0F172A]">{tx.name}</h4>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${tx.badgeBg}`}>
                                  {tx.level}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-semibold mt-1">
                                Exam Mapping: <strong className="text-slate-800">{tx.paperCoverage}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="bg-[#FEF08A] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                {tx.marks} Marks
                              </span>
                              <span className="bg-[#E0E7FF] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                {tx.percentage}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                            {tx.description}
                          </p>

                          <div className="bg-[#FAF8FF] border-2 border-slate-200 rounded-2xl p-3.5">
                            <p className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-[#FF5722]">key</span>
                              <span>Associated Paper Keywords:</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {tx.keyActionVerbs.map((kw, kwIdx) => (
                                <span
                                  key={kwIdx}
                                  className="px-2 py-0.5 bg-white border border-slate-300 rounded-md text-[11px] font-bold text-[#0F172A] shadow-2xs"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* MSE COGNITIVE LEVELS MATRIX (40M) */
                  <div className="space-y-6">
                    {/* Cognitive Distribution Progress Visualizer */}
                    <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-base font-black text-hub-navy uppercase">
                            MSE 40-Mark Cognitive Level Ratio
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Indus University MSE evaluation distribution across Cognitive Levels I, II, and III.
                          </p>
                        </div>
                        <span className="text-xs font-mono font-black bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                          Total: 40 Marks
                        </span>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div className="h-5 w-full bg-slate-100 rounded-xl border-2 border-[#0F172A] overflow-hidden flex shadow-xs mb-3">
                        <div className="w-[40%] bg-emerald-500 flex items-center justify-center text-[10px] font-mono font-black text-white" title="Cognitive Level – I: 16 Marks (40%)">
                          40%
                        </div>
                        <div className="w-[30%] bg-sky-500 flex items-center justify-center text-[10px] font-mono font-black text-white" title="Cognitive Level – II: 12 Marks (30%)">
                          30%
                        </div>
                        <div className="w-[30%] bg-purple-500 flex items-center justify-center text-[10px] font-mono font-black text-white" title="Cognitive Level – III: 12 Marks (30%)">
                          30%
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-[#0F172A]"></span>
                          <span className="text-slate-700">Cognitive Level – I: 16M (40%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-sky-500 border border-[#0F172A]"></span>
                          <span className="text-slate-700">Cognitive Level – II: 12M (30%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-purple-500 border border-[#0F172A]"></span>
                          <span className="text-slate-700">Cognitive Level – III: 12M (30%)</span>
                        </div>
                      </div>
                    </div>

                    {/* MSE Cognitive Level Detailed Cards */}
                    <div className="space-y-4">
                      {MSE_COGNITIVE_SUMMARY.map((tx) => (
                        <div
                          key={tx.name}
                          className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b-2 border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${tx.dotColor} border border-[#0F172A]`}></span>
                                <h4 className="text-base font-black text-[#0F172A]">{tx.name}</h4>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${tx.badgeBg}`}>
                                  {tx.level}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-semibold mt-1">
                                Exam Mapping: <strong className="text-slate-800">{tx.paperCoverage}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="bg-[#FEF08A] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                {tx.marks} Marks
                              </span>
                              <span className="bg-[#E0E7FF] text-[#0F172A] text-xs font-black px-2.5 py-1 rounded-lg border border-[#0F172A]">
                                {tx.percentage}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                            {tx.description}
                          </p>

                          <div className="bg-[#FAF8FF] border-2 border-slate-200 rounded-2xl p-3.5">
                            <p className="text-[11px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-[#FF5722]">key</span>
                              <span>Targeted Action Keywords:</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {tx.keyActionVerbs.map((kw, kwIdx) => (
                                <span
                                  key={kwIdx}
                                  className="px-2 py-0.5 bg-white border border-slate-300 rounded-md text-[11px] font-bold text-[#0F172A] shadow-2xs"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Right Column: Topper Strategy & Exam Hall Guidelines */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              
              {/* Topper Exam Strategy Card */}
              {selectedExamMode === 'ESE' ? (
                <div className="bg-[#FEF9C3] border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FACC15] border-2 border-[#0F172A] text-xs font-black uppercase mb-3 shadow-xs">
                      <span className="material-symbols-outlined text-[15px] text-[#713F12]">lightbulb</span>
                      <span>Topper ESE Strategy</span>
                    </div>
                    <h4 className="text-lg font-black text-[#713F12] uppercase mb-2">
                      How to Score 85+ / 100
                    </h4>
                    <p className="text-xs font-bold text-amber-900 mb-3">
                      Strategically conquer Bloom’s Taxonomy levels:
                    </p>
                    
                    <ul className="space-y-3.5 text-xs font-semibold text-[#854D0E] leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                        <div>
                          <strong className="text-slate-900 block">Step 1: Secure 40 Marks Passing</strong>
                          <span>Answer Part A of Q.1, Q.2, Q.3, Q.4 first. These 40 marks test direct recall (definitions, statements, lists).</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                        <div>
                          <strong className="text-slate-900 block">Step 2: Conquer 40M Application</strong>
                          <span>Prepare step-by-step algorithms, comparison tables, and numerical derivations for Part B of Q.1 to Q.4.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                        <div>
                          <strong className="text-slate-900 block">Step 3: Maximize Q.5 Analysis (20M)</strong>
                          <span>Attempt compulsory Part A (Unit 1) &amp; Part B (Unit 2), then select your stronger options in the Unit 3 (Part C OR D) and Unit 4 (Part E OR F) internal choices.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-[#EAB308]/50 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-[#713F12]">Indus Evaluation Standard</span>
                    <span className="text-xs font-mono font-black bg-white px-2 py-0.5 rounded border border-[#0F172A]">Grade: AA (10 SPI)</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#E0F2FE] border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8] text-white border-2 border-[#0F172A] text-xs font-black uppercase mb-3 shadow-xs">
                      <span className="material-symbols-outlined text-[15px] text-white">lightbulb</span>
                      <span>Topper MSE Strategy</span>
                    </div>
                    <h4 className="text-lg font-black text-sky-950 uppercase mb-2">
                      How to Score 35+ / 40
                    </h4>
                    <p className="text-xs font-bold text-sky-900 mb-3">
                      Master the 40-Mark Mid Semester examination with precision:
                    </p>
                    
                    <ul className="space-y-3.5 text-xs font-semibold text-sky-950 leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                        <div>
                          <strong className="text-slate-900 block">Step 1: Secure 16 Marks Passing Immediately</strong>
                          <span>All 16 Level I marks are pure recall: Q 1 (4M + 4M) + Q 2(a) (4M) + Q 3(a) (4M) = 16 Marks. You hit the passing mark 16/40 (40%) on definitions, statements, and formulas alone!</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                        <div>
                          <strong className="text-slate-900 block">Step 2: Lock in 12M Understanding</strong>
                          <span>Sub-questions 2(b) and 3(b) (06M each) both offer an internal OR option. Review both choices and answer the topic you have higher command on.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                        <div>
                          <strong className="text-slate-900 block">Step 3: Master 12M Application</strong>
                          <span>Sub-questions 2(c) and 3(c) (06M each) test practical problems and derivations. Solve numerical examples to attain a 35+ score.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-sky-300 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-sky-900">Mid Sem Target</span>
                    <span className="text-xs font-mono font-black bg-white px-2 py-0.5 rounded border border-[#0F172A]">Target: 38+/40</span>
                  </div>
                </div>
              )}

              {/* Exam Hall Blueprint Summary */}
              <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A]">
                <h4 className="text-base font-black text-hub-navy uppercase mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">verified</span>
                  <span>{selectedExamMode === 'ESE' ? 'ESE Blueprint Rules' : 'MSE Blueprint Rules'}</span>
                </h4>
                
                <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span>Total Examination Marks</span>
                    <strong className="text-slate-900 font-mono">
                      {selectedExamMode === 'ESE' ? '100 Marks' : '40 Marks'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span>Minimum Passing Marks</span>
                    <strong className="text-emerald-700 font-mono">
                      {selectedExamMode === 'ESE' ? '40/100 (40%)' : '16/40 (40%)'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span>Compulsory Units</span>
                    <strong className="text-slate-900 font-mono">
                      {selectedExamMode === 'ESE' ? 'Units I – IV' : 'Units 1, 2 & 3'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span>Optionality Format</span>
                    <strong className="text-indigo-900 font-mono">
                      {selectedExamMode === 'ESE' ? 'Q.5 Internal OR (05*4=20)' : 'Internal OR on 6M & 4M'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span>Exam Duration</span>
                    <strong className="text-slate-900 font-mono">
                      {selectedExamMode === 'ESE' ? '3 Hours' : '1.5 Hours (90 Mins)'}
                    </strong>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200">
                  <a
                    href="#community-hub"
                    className="w-full font-black py-3 rounded-xl bg-hub-navy hover:bg-[#FF5722] text-white border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] flex items-center justify-center gap-1.5 text-xs uppercase transition-all cursor-pointer"
                  >
                    <span>{selectedExamMode === 'ESE' ? 'Request ESE Material ↓' : 'Request MSE Material ↓'}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. COMMUNITY CONTRIBUTOR HUB (Upload & Request Tabs with Semester Gating) ─── */}
      <section id="community-hub" className="py-14 sm:py-20 relative z-10 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-white border-[3px] border-[#0F172A] rounded-[36px] shadow-[8px_8px_0_#0F172A] p-6 sm:p-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[15px] text-[#FF5722]">handshake</span>
                  <span>COMMUNITY CONTRIBUTOR HUB</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-hub-navy tracking-tight">
                  Upload Notes or Request Materials
                </h2>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 bg-[#FAF8FF] p-1.5 rounded-2xl border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A]">
                <button
                  type="button"
                  onClick={() => setVaultTab('upload')}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    vaultTab === 'upload'
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#0F172A] hover:bg-slate-200'
                  }`}
                >
                  Upload Material
                </button>
                <button
                  type="button"
                  onClick={() => setVaultTab('request')}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    vaultTab === 'request'
                      ? 'bg-[#FF5722] text-white shadow-xs'
                      : 'text-[#0F172A] hover:bg-slate-200'
                  }`}
                >
                  Request Notes
                </button>
              </div>
            </div>

            {/* TAB 1: UPLOAD MATERIAL */}
            {vaultTab === 'upload' && (
              <form onSubmit={handleUploadSubmit} className="space-y-5">
                {uploadStatus === 'success' ? (
                  <div className="bg-emerald-50 border-[2.5px] border-emerald-500 p-6 rounded-2xl text-center space-y-2">
                    <span className="material-symbols-outlined text-4xl text-emerald-600">task_alt</span>
                    <h3 className="text-xl font-black text-emerald-800 uppercase">Upload Submitted Successfully!</h3>
                    <p className="text-xs font-semibold text-emerald-700 max-w-md mx-auto">
                      Thank you for contributing. Our academic moderators will review your file and attribute full topper credits to your profile.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Drag & Drop File Box */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      onClick={() => document.getElementById('resource-file-input').click()}
                      className="border-[2.5px] border-dashed border-[#0F172A] hover:border-[#FF5722] bg-[#FAF8FF] hover:bg-[#FFF7ED] p-6 sm:p-8 rounded-2xl text-center cursor-pointer transition-all group"
                    >
                      <input
                        id="resource-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.zip,.rar"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="material-symbols-outlined text-4xl text-amber-500 group-hover:scale-110 transition-transform block mb-2">
                        cloud_upload
                      </span>
                      <p className="font-black text-sm sm:text-base text-hub-navy">
                        {uploadFile ? uploadFile.name : 'Click or Drag & Drop PDF, Document, or Lab Zip here'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: PDF, Word, Zip files up to 15MB.
                      </p>
                    </div>

                    {/* Form Grid (Branch -> Semester -> Subject -> Category) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          1. Branch
                        </label>
                        <select
                          value={uploadDept}
                          onChange={(e) => setUploadDept(e.target.value)}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="CE">Computer (CE)</option>
                          <option value="CSE">Comp Science (CSE)</option>
                          <option value="IT">Info Tech (IT)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          2. Semester
                        </label>
                        <select
                          value={uploadSem}
                          onChange={(e) => setUploadSem(parseInt(e.target.value, 10))}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem}>
                              Semester {sem}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1 truncate">
                          3. Subject
                        </label>
                        <select
                          value={uploadSubjectCode}
                          onChange={(e) => setUploadSubjectCode(e.target.value)}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer truncate"
                        >
                          {uploadDeptSubjects.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          4. Type
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                        >
                          {RESOURCE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-xs uppercase font-black text-[#0F172A] block mb-1">
                        Resource Title <span className="text-[#FF5722]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. Unit 3 Trees & Graphs Master Handwritten Notes"
                        className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-3 text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722]"
                      />
                    </div>

                    {/* Contributor Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          Your Name / Alias <span className="text-gray-400 font-normal">(for credit badge)</span>
                        </label>
                        <input
                          type="text"
                          value={uploadAuthor}
                          onChange={(e) => setUploadAuthor(e.target.value)}
                          placeholder="e.g. Harshil Vora (LDCE)"
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          Your Email <span className="text-[#FF5722]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={uploadEmail}
                          onChange={(e) => setUploadEmail(e.target.value)}
                          placeholder="student@college.edu or gmail"
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Progress Bar & Error */}
                    {uploadStatus === 'uploading' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-black text-[#0F172A]">
                          <span>Uploading File...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 border border-[#0F172A] rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-[#4ADE80] rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {uploadErrorMsg && (
                      <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-300">
                        {uploadErrorMsg}
                      </p>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ocrEnabled}
                          onChange={(e) => setOcrEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#FF5722] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-700">
                          Enable automatic OCR indexing
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={uploadStatus === 'uploading'}
                        className="w-full sm:w-auto bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs sm:text-sm uppercase px-8 py-3 rounded-xl border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {uploadStatus === 'uploading' ? 'Publishing...' : 'Publish Resource'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* TAB 2: REQUEST MISSING NOTES */}
            {vaultTab === 'request' && (
              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div className="bg-[#FEF9C3] border-2 border-[#0F172A] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#713F12]">
                  <span className="material-symbols-outlined text-lg text-amber-600 mt-0.5 shrink-0">info</span>
                  <p className="font-semibold leading-relaxed">
                    Can’t find a specific chapter or previous year solution? Post your request here. Our campus toppers will upload it and notify your Gmail!
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                      Branch
                    </label>
                    <select
                      value={requestDept}
                      onChange={(e) => setRequestDept(e.target.value)}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="CE">Computer (CE)</option>
                      <option value="CSE">Comp Science (CSE)</option>
                      <option value="IT">Info Tech (IT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                      Semester
                    </label>
                    <select
                      value={requestSem}
                      onChange={(e) => setRequestSem(parseInt(e.target.value, 10))}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1 truncate">
                      Subject
                    </label>
                    <select
                      value={requestSubjectCode}
                      onChange={(e) => setRequestSubjectCode(e.target.value)}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer truncate"
                    >
                      {requestDeptSubjects.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                      Type
                    </label>
                    <select
                      value={requestCategory}
                      onChange={(e) => setRequestCategory(e.target.value)}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      {RESOURCE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-black text-[#0F172A] block mb-1">
                    Describe What You Need <span className="text-[#FF5722]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="e.g. Need Indus Winter 2023 Solved Paper with Peterson's algorithm step-by-step solution."
                    className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-3 text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-black text-[#0F172A] block mb-1">
                    Your Gmail Email <span className="text-[#FF5722]">*</span> <span className="text-gray-400 font-normal">(for fulfillment alert)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-3 text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722]"
                  />
                </div>

                <div className="pt-2 border-t-2 border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#FF5722] text-white font-black text-xs sm:text-sm uppercase px-8 py-3 rounded-xl border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>{requestLoading ? 'Submitting...' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
