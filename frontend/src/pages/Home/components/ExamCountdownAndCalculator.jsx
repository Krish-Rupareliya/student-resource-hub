import React, { useState, useEffect } from 'react';
import { getPublicHomepageSettings } from '../../../services/settings/settingsApi';
import { fetchSemestersCatalog } from '../../../services/resources/resourcesApi';

// Official Indus University Grading Scale (UGC 10-Point Choice Based Credit System)
export const GRADE_MAP = [
  { label: 'O (10) · Outstanding (≥85%)', value: 10, grade: 'O', minPct: 85, bg: 'bg-[#BBF7D0] text-[#14532D]' },
  { label: 'A+ (9) · Excellent (70–84%)', value: 9, grade: 'A+', minPct: 70, bg: 'bg-[#BAE6FD] text-[#0369A1]' },
  { label: 'A (8) · Very Good (60–69%)', value: 8, grade: 'A', minPct: 60, bg: 'bg-[#FEF08A] text-[#713F12]' },
  { label: 'B+ (7) · Good (55–59%)', value: 7, grade: 'B+', minPct: 55, bg: 'bg-[#FDE047] text-[#854D0E]' },
  { label: 'B (6) · Above Average (50–54%)', value: 6, grade: 'B', minPct: 50, bg: 'bg-[#FED7AA] text-[#9A3412]' },
  { label: 'C (5) · Average (45–49%)', value: 5, grade: 'C', minPct: 45, bg: 'bg-[#FECDD3] text-[#9F1239]' },
  { label: 'P (4) · Pass (40–44%)', value: 4, grade: 'P', minPct: 40, bg: 'bg-[#E2E8F0] text-[#334155]' },
  { label: 'FF (0) · Fail / Backlog (<40%)', value: 0, grade: 'FF', minPct: 0, bg: 'bg-[#FFDAD6] text-[#93000A]' },
];

// Helper: Calculate Letter Grade & Grade Point from Total Marks
export function computeGradeFromTotalMarks(obt, max) {
  const numObt = Number(obt) || 0;
  const numMax = Number(max) || 100;
  const pct = numMax > 0 ? (numObt / numMax) * 100 : 0;

  if (pct < 40) {
    return {
      grade: 'FF',
      gradePoint: 0,
      pct: parseFloat(pct.toFixed(1)),
      failed: true,
      failReason: 'Score < 40%',
    };
  }

  for (const scale of GRADE_MAP) {
    if (pct >= scale.minPct && scale.grade !== 'FF') {
      return {
        grade: scale.grade,
        gradePoint: scale.value,
        pct: parseFloat(pct.toFixed(1)),
        failed: false,
        failReason: '',
      };
    }
  }

  return {
    grade: 'FF',
    gradePoint: 0,
    pct: parseFloat(pct.toFixed(1)),
    failed: true,
    failReason: 'Below passing threshold',
  };
}

// Backward-compatible component evaluator (Theory min 24/60, ESE min 16/40)
export function computeGradeFromMarks(theory, practical, totalMarks) {
  let failed = false;
  let failReason = '';

  if (theory?.cie?.max != null) {
    const cieVal = Number(theory.cie.obt) || 0;
    const eseVal = Number(theory.ese.obt) || 0;
    const cieMin = theory.cie.min ?? 24;
    const eseMin = theory.ese.min ?? 16;
    if (cieVal < cieMin) {
      failed = true;
      failReason = `Theory CIE < ${cieMin}`;
    } else if (eseVal < eseMin) {
      failed = true;
      failReason = `Theory ESE < ${eseMin}`;
    }
  }

  if (practical?.cie?.max != null) {
    const pCieVal = Number(practical.cie.obt) || 0;
    const pCieMin = practical.cie.min ?? (practical.cie.max === 100 ? 40 : 24);
    if (pCieVal < pCieMin) {
      failed = true;
      failReason = `Practical CIE < ${pCieMin}`;
    }
    if (practical.ese?.max != null) {
      const pEseVal = Number(practical.ese.obt) || 0;
      const pEseMin = practical.ese.min ?? 16;
      if (pEseVal < pEseMin) {
        failed = true;
        failReason = `Practical ESE < ${pEseMin}`;
      }
    }
  }

  const max = totalMarks?.max || 100;
  const obt = totalMarks?.obt || 0;
  const pct = max > 0 ? (obt / max) * 100 : 0;

  if (failed || pct < 40) {
    return {
      grade: 'FF',
      gradePoint: 0,
      pct: parseFloat(pct.toFixed(1)),
      failed: true,
      failReason: failReason || 'Total Score < 40%',
    };
  }

  return computeGradeFromTotalMarks(obt, max);
}

// Official Indus University Semester 4 Sample Marksheet (8 Subjects · 25 Credits · 8.28 SGPA · 774/1100 Marks)
export const OFFICIAL_SEM4_SAMPLE = [
  {
    code: 'BB0311',
    name: 'Management for Engineers (BB0311)',
    shortTitle: 'Management for Engineers',
    credits: 2,
    grade: 8,
    computedGrade: 'A',
    theory: {
      cie: { max: 60, min: 24, obt: 40 },
      ese: { max: 40, min: 16, obt: 24 },
    },
    practical: {
      cie: { max: null, min: null, obt: null },
      ese: { max: null, min: null, obt: null },
    },
    totalMarks: { max: 100, obt: 64 },
  },
  {
    code: 'CE0404',
    name: 'Computer Organization and Architecture (CE0404)',
    shortTitle: 'Computer Organization & Architecture',
    credits: 3,
    grade: 8,
    computedGrade: 'A',
    theory: {
      cie: { max: 60, min: 24, obt: 38 },
      ese: { max: 40, min: 16, obt: 23 },
    },
    practical: {
      cie: { max: null, min: null, obt: null },
      ese: { max: null, min: null, obt: null },
    },
    totalMarks: { max: 100, obt: 61 },
  },
  {
    code: 'CE0417',
    name: 'Data Structure and Algorithms (CE0417)',
    shortTitle: 'Data Structure and Algorithms',
    credits: 4,
    grade: 9,
    computedGrade: 'A+',
    theory: {
      cie: { max: 60, min: 24, obt: 47 },
      ese: { max: 40, min: 16, obt: 20 },
    },
    practical: {
      cie: { max: 60, min: 24, obt: 45 },
      ese: { max: 40, min: 16, obt: 34 },
    },
    totalMarks: { max: 200, obt: 146 },
  },
  {
    code: 'CE0418',
    name: 'Operating System (CE0418)',
    shortTitle: 'Operating System',
    credits: 4,
    grade: 9,
    computedGrade: 'A+',
    theory: {
      cie: { max: 60, min: 24, obt: 35 },
      ese: { max: 40, min: 16, obt: 30 },
    },
    practical: {
      cie: { max: 60, min: 24, obt: 47 },
      ese: { max: 40, min: 16, obt: 34 },
    },
    totalMarks: { max: 200, obt: 146 },
  },
  {
    code: 'CE0421',
    name: 'Core Java Programming (CE0421)',
    shortTitle: 'Core Java Programming',
    credits: 4,
    grade: 9,
    computedGrade: 'A+',
    theory: {
      cie: { max: 60, min: 24, obt: 53 },
      ese: { max: 40, min: 16, obt: 18 },
    },
    practical: {
      cie: { max: 60, min: 24, obt: 48 },
      ese: { max: 40, min: 16, obt: 38 },
    },
    totalMarks: { max: 200, obt: 157 },
  },
  {
    code: 'CE0424',
    name: 'Internship (CE0424)',
    shortTitle: 'Internship',
    credits: 2,
    grade: 10,
    computedGrade: 'O',
    theory: {
      cie: { max: null, min: null, obt: null },
      ese: { max: null, min: null, obt: null },
    },
    practical: {
      cie: { max: 100, min: 40, obt: 90 },
      ese: { max: null, min: null, obt: null },
    },
    totalMarks: { max: 100, obt: 90 },
  },
  {
    code: 'ME0424',
    name: 'Elements of Robotics (ME0424)',
    shortTitle: 'Elements of Robotics',
    credits: 3,
    grade: 7,
    computedGrade: 'B+',
    theory: {
      cie: { max: 60, min: 24, obt: 35 },
      ese: { max: 40, min: 16, obt: 22 },
    },
    practical: {
      cie: { max: null, min: null, obt: null },
      ese: { max: null, min: null, obt: null },
    },
    totalMarks: { max: 100, obt: 57 },
  },
  {
    code: 'ME0425',
    name: 'Robot Mechanics, Kinematics & Dynamics (ME0425)',
    shortTitle: 'Robot Mechanics, Kinematics & Dynamics',
    credits: 3,
    grade: 6,
    computedGrade: 'B',
    theory: {
      cie: { max: 60, min: 24, obt: 33 },
      ese: { max: 40, min: 16, obt: 20 },
    },
    practical: {
      cie: { max: null, min: null, obt: null },
      ese: { max: null, min: null, obt: null },
    },
    totalMarks: { max: 100, obt: 53 },
  },
];

// Pre-defined semester syllabus presets matching database subjects for Indus CE
export const SEMESTER_PRESETS = {
  1: [
    { code: 'CE0101', name: 'Mathematics - I (CE0101)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 72 } },
    { code: 'CE0102', name: 'Physics (CE0102)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 65 } },
    { code: 'CE0103', name: 'Basic Electronics (CE0103)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 62 } },
    { code: 'CE0104', name: 'Programming Fundamentals - C (CE0104)', credits: 5, grade: 9, totalMarks: { max: 100, obt: 75 } },
    { code: 'CE0105', name: 'Engineering Graphics (CE0105)', credits: 3, grade: 8, totalMarks: { max: 100, obt: 68 } },
  ],
  2: [
    { code: 'CE0201', name: 'Mathematics - II (CE0201)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 74 } },
    { code: 'CE0202', name: 'Data Structures (CE0202)', credits: 5, grade: 9, totalMarks: { max: 100, obt: 76 } },
    { code: 'CE0203', name: 'Digital Electronics (CE0203)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 64 } },
    { code: 'CE0204', name: 'Object Oriented Programming - C++ (CE0204)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 73 } },
    { code: 'CE0205', name: 'Environmental Science (CE0205)', credits: 2, grade: 10, totalMarks: { max: 100, obt: 88 } },
  ],
  3: [
    { code: 'CE0301', name: 'Discrete Mathematics (CE0301)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 65 } },
    { code: 'CE0302', name: 'Computer Organization (CE0302)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 63 } },
    { code: 'CE0303', name: 'Database Management Systems (CE0303)', credits: 5, grade: 9, totalMarks: { max: 100, obt: 78 } },
    { code: 'CE0304', name: 'Java Programming (CE0304)', credits: 5, grade: 10, totalMarks: { max: 100, obt: 86 } },
    { code: 'CE0305', name: 'Probability & Statistics (CE0305)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 62 } },
  ],
  4: OFFICIAL_SEM4_SAMPLE,
  5: [
    { code: 'CE0501', name: 'Design & Analysis of Algorithms (CE0501)', credits: 5, grade: 9, totalMarks: { max: 100, obt: 74 } },
    { code: 'CE0502', name: 'Compiler Design (CE0502)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 66 } },
    { code: 'CE0503', name: 'Artificial Intelligence (CE0503)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 77 } },
    { code: 'CE0504', name: 'Mobile Application Development (CE0504)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 68 } },
    { code: 'CE0505', name: 'Information Security (CE0505)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 72 } },
  ],
  6: [
    { code: 'CE0601', name: 'Machine Learning (CE0601)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 75 } },
    { code: 'CE0602', name: 'Cloud Computing (CE0602)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 74 } },
    { code: 'CE0603', name: 'Internet of Things (CE0603)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 67 } },
    { code: 'CE0604', name: 'Big Data Analytics (CE0604)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 64 } },
    { code: 'CE0605', name: 'Distributed Systems (CE0605)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 73 } },
  ],
  7: [
    { code: 'CE0701', name: 'Deep Learning (CE0701)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 76 } },
    { code: 'CE0702', name: 'Blockchain Technology (CE0702)', credits: 4, grade: 8, totalMarks: { max: 100, obt: 65 } },
    { code: 'CE0703', name: 'Natural Language Processing (CE0703)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 75 } },
    { code: 'CE0704', name: 'DevOps & CI/CD (CE0704)', credits: 4, grade: 9, totalMarks: { max: 100, obt: 78 } },
  ],
  8: [
    { code: 'CE0801', name: 'Project Management (CE0801)', credits: 3, grade: 9, totalMarks: { max: 100, obt: 75 } },
    { code: 'CE0802', name: 'Ethics in Computing (CE0802)', credits: 3, grade: 9, totalMarks: { max: 100, obt: 74 } },
    { code: 'CE0803', name: 'Major Project (CE0803)', credits: 12, grade: 10, totalMarks: { max: 100, obt: 92 } },
  ],
};

export default function ExamCountdownAndCalculator() {
  // Live Clock Config from API / defaults
  const [clockConfig, setClockConfig] = useState(() => {
    const futureDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    futureDate.setHours(10, 30, 0, 0);
    return {
      examTitle: 'Indus Winter Finals',
      targetDate: futureDate.toISOString(),
      subtitle: 'Target exam date approaching. Be prepared before server crashes and dead WhatsApp groups strike.',
      papersSchedule: [
        { code: 'CE0404', name: 'Computer Organization & Architecture', deadline: 'In 4 Days' },
        { code: 'CE0417', name: 'Data Structure and Algorithms', deadline: 'In 8 Days' },
        { code: 'CE0418', name: 'Operating System', deadline: 'In 12 Days' },
        { code: 'CE0421', name: 'Core Java Programming', deadline: 'In 16 Days' },
      ],
    };
  });

  // Dynamic Catalog Semesters from DB
  const [dbCatalogSemesters, setDbCatalogSemesters] = useState(null);

  // Fetch settings dynamically from backend proxy
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const settings = await getPublicHomepageSettings();
        if (isMounted && settings?.liveClock) {
          setClockConfig((prev) => ({ ...prev, ...settings.liveClock }));
        }
      } catch (err) {
        console.warn('Could not load live clock settings:', err);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch live subjects directly from DB catalog, keeping rich Sem 4 sample intact
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const catalog = await fetchSemestersCatalog();
        if (!isMounted || !Array.isArray(catalog)) return;
        const dept = catalog.find((d) => d.code === 'CE') || catalog[0];
        if (dept?.semesters) {
          const semMap = {};
          dept.semesters.forEach((sem) => {
            if (Array.isArray(sem.subjects) && sem.subjects.length > 0) {
              semMap[sem.semesterNumber] = sem.subjects.map((sub) => {
                const existing = (SEMESTER_PRESETS[sem.semesterNumber] || []).find((p) => p.code === sub.code);
                return {
                  code: sub.code,
                  name: `${sub.title} (${sub.code})`,
                  credits: existing?.credits || 4,
                  grade: existing?.grade || 8,
                  totalMarks: existing?.totalMarks || { max: 100, obt: 65 },
                };
              });
            }
          });
          setDbCatalogSemesters(semMap);
        }
      } catch (err) {
        console.warn('Could not load DB catalog for calculator:', err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live countdown timer calculation based on targetDate
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      if (!clockConfig.targetDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const targetTime = new Date(clockConfig.targetDate).getTime();
      const now = Date.now();

      if (isNaN(targetTime)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [clockConfig.targetDate]);

  // SGPA calculator state (Defaults to simple and fast 'grades' mode for best student experience)
  const [selectedSem, setSelectedSem] = useState(4);
  const [calculatorMode, setCalculatorMode] = useState('grades'); // 'grades' | 'marks'
  const [subjects, setSubjects] = useState(OFFICIAL_SEM4_SAMPLE);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [customSubjectCredits, setCustomSubjectCredits] = useState(4);
  const [showAddCustom, setShowAddCustom] = useState(false);

  const handleSemChange = (sem) => {
    setSelectedSem(sem);
    if (sem === 4) {
      setSubjects(OFFICIAL_SEM4_SAMPLE);
    } else if (SEMESTER_PRESETS[sem]) {
      setSubjects(SEMESTER_PRESETS[sem]);
    } else if (dbCatalogSemesters?.[sem]?.length > 0) {
      setSubjects(dbCatalogSemesters[sem]);
    } else {
      setSubjects([]);
    }
  };

  const handleGradeChange = (index, value) => {
    const updated = [...subjects];
    const gp = parseFloat(value);
    const scaleObj = GRADE_MAP.find((g) => g.value === gp);
    updated[index] = {
      ...updated[index],
      grade: gp,
      computedGrade: scaleObj ? scaleObj.grade : 'Custom',
      hasBacklog: gp === 0,
      failReason: gp === 0 ? 'Grade FF (Fail)' : '',
    };
    setSubjects(updated);
  };

  const handleToggleMaxMarks = (index, targetMax) => {
    const updated = [...subjects];
    const subj = { ...updated[index] };
    const oldMax = subj.totalMarks?.max || 100;
    const oldObt = subj.totalMarks?.obt;

    let newObt = oldObt;
    if (oldObt != null && oldMax > 0 && oldMax !== targetMax) {
      newObt = Math.round((oldObt / oldMax) * targetMax);
    }

    subj.totalMarks = {
      ...subj.totalMarks,
      max: targetMax,
      obt: newObt,
    };

    const computed = computeGradeFromTotalMarks(newObt, targetMax);
    subj.grade = computed.gradePoint;
    subj.computedGrade = computed.grade;
    subj.hasBacklog = computed.failed;
    subj.failReason = computed.failReason;

    updated[index] = subj;
    setSubjects(updated);
  };

  const handleTotalMarkChange = (index, val) => {
    const updated = [...subjects];
    const subj = { ...updated[index] };
    const currentMax = subj.totalMarks?.max || 100;
    const num = val === '' ? null : Math.max(0, Math.min(currentMax, Number(val)));

    subj.totalMarks = {
      ...subj.totalMarks,
      max: currentMax,
      obt: num,
    };

    const computed = computeGradeFromTotalMarks(num, currentMax);
    subj.grade = computed.gradePoint;
    subj.computedGrade = computed.grade;
    subj.hasBacklog = computed.failed;
    subj.failReason = computed.failReason;

    updated[index] = subj;
    setSubjects(updated);
  };

  const handleRemoveSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!customSubjectName.trim()) return;
    setSubjects([
      ...subjects,
      {
        code: `CUSTOM${subjects.length + 1}`,
        name: customSubjectName.trim(),
        shortTitle: customSubjectName.trim(),
        credits: parseInt(customSubjectCredits, 10) || 4,
        grade: 9,
        computedGrade: 'A+',
        totalMarks: { max: 100, obt: 75 },
      },
    ]);
    setCustomSubjectName('');
    setShowAddCustom(false);
  };

  const loadSampleMarksheet = () => {
    setSelectedSem(4);
    setSubjects(OFFICIAL_SEM4_SAMPLE);
  };

  const resetToDefaultPreset = () => {
    if (selectedSem === 4) {
      setSubjects(OFFICIAL_SEM4_SAMPLE);
    } else if (SEMESTER_PRESETS[selectedSem]) {
      setSubjects(SEMESTER_PRESETS[selectedSem]);
    } else if (dbCatalogSemesters?.[selectedSem]?.length > 0) {
      setSubjects(dbCatalogSemesters[selectedSem]);
    } else {
      setSubjects([]);
    }
  };

  // Aggregated calculations
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalPoints = subjects.reduce((sum, s) => sum + s.credits * s.grade, 0);
  const calculatedSGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  const progressPercent = Math.min(100, Math.max(0, (parseFloat(calculatedSGPA) / 10) * 100));

  const totalMarksMax = subjects.reduce((sum, s) => sum + (s.totalMarks?.max || 100), 0);
  const totalMarksObt = subjects.reduce((sum, s) => sum + (s.totalMarks?.obt || 0), 0);
  const overallPercentage = totalMarksMax > 0 ? ((totalMarksObt / totalMarksMax) * 100).toFixed(1) : '0.0';
  const hasAnyBacklog = subjects.some((s) => s.grade === 0 || s.hasBacklog);

  // Merit classification badge (Strictly ZERO EMOJIS, uses Material Symbols)
  const getMeritBadge = (val, backlog) => {
    if (backlog) {
      return {
        text: 'Backlog Alert',
        color: 'bg-[#FF5722] text-white',
        icon: 'warning',
      };
    }
    const num = parseFloat(val);
    if (num >= 9.0) {
      return {
        text: 'Outstanding (Ranker Tier)',
        color: 'bg-[#4ADE80] text-[#0F172A]',
        icon: 'military_tech',
      };
    }
    if (num >= 8.0) {
      return {
        text: 'First Class Distinction',
        color: 'bg-[#38BDF8] text-[#0F172A]',
        icon: 'stars',
      };
    }
    if (num >= 6.5) {
      return {
        text: 'First Class Grade',
        color: 'bg-[#FACC15] text-[#0F172A]',
        icon: 'verified',
      };
    }
    if (num >= 5.0) {
      return {
        text: 'Second Class Pass',
        color: 'bg-[#FED7AA] text-[#0F172A]',
        icon: 'task_alt',
      };
    }
    return {
      text: 'Pass Class',
      color: 'bg-slate-200 text-slate-800',
      icon: 'check_circle',
    };
  };

  const merit = getMeritBadge(calculatedSGPA, hasAnyBacklog);

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2.5">
              <span className="material-symbols-outlined text-[15px] text-[#FF5722]">bolt</span>
              <span>EXAM READINESS &amp; SGPA MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
              Live Semester Clock &amp; <span className="text-amber-500">SGPA Matrix</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base font-medium text-gray-600 max-w-md">
            Track real-time examination deadlines and forecast your semester SGPA using official Indus credit splits.
          </p>
        </div>

        {/* 2-Column Bento Grid with Balanced items-start Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Box 1: Live Exam Countdown Clock */}
          <div className="lg:col-span-5 bg-white border-[3px] border-[#0F172A] shadow-[6px_6px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] p-6 sm:p-7 rounded-[32px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
            
            {/* Background watermark icon */}
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none text-[#0F172A]">
              <span className="material-symbols-outlined text-[220px]">alarm</span>
            </div>

            <div>
              {/* Top Status Header */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-[1.5px] text-xs font-black ${
                  timeLeft.isExpired
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-red-50 border-red-300 text-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${timeLeft.isExpired ? 'bg-amber-500' : 'bg-red-500 animate-ping'}`}></span>
                  <span className="uppercase tracking-wide">{timeLeft.isExpired ? 'EXAM DATE REACHED' : 'LIVE COUNTDOWN'}</span>
                </div>
                <span className="bg-[#FEF08A] text-[#0F172A] text-xs font-black uppercase px-3 py-1 rounded-xl border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A]">
                  {clockConfig.examTitle || 'Indus Finals'}
                </span>
              </div>

              {/* Title & description */}
              <h3 className="text-2xl sm:text-3xl font-black text-hub-navy uppercase leading-tight mb-2">
                {clockConfig.examTitle ? `${clockConfig.examTitle} Countdown` : 'Semester Finals Countdown'}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed mb-6">
                {clockConfig.subtitle || 'Target exam date approaching. Be prepared before server crashes and dead WhatsApp groups strike.'}
              </p>

              {/* 4 Digital Flip-Style Clock Blocks */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 mb-6">
                <div className="bg-[#0F172A] text-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0_#FACC15] p-3 sm:p-4 rounded-2xl text-center group hover:scale-[1.02] transition-transform">
                  <span className="font-mono text-3xl sm:text-4xl font-black leading-none text-[#FACC15] block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mt-1 block">
                    Days
                  </span>
                </div>

                <div className="bg-[#0F172A] text-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0_#38BDF8] p-3 sm:p-4 rounded-2xl text-center group hover:scale-[1.02] transition-transform">
                  <span className="font-mono text-3xl sm:text-4xl font-black leading-none text-[#38BDF8] block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mt-1 block">
                    Hours
                  </span>
                </div>

                <div className="bg-[#0F172A] text-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0_#4ADE80] p-3 sm:p-4 rounded-2xl text-center group hover:scale-[1.02] transition-transform">
                  <span className="font-mono text-3xl sm:text-4xl font-black leading-none text-[#4ADE80] block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mt-1 block">
                    Mins
                  </span>
                </div>

                <div className="bg-[#FF5722] text-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0_#0F172A] p-3 sm:p-4 rounded-2xl text-center group hover:scale-[1.02] transition-transform">
                  <span className="font-mono text-3xl sm:text-4xl font-black leading-none text-white block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90 mt-1 block">
                    Secs
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Papers Schedule */}
            <div className="bg-[#FAF8FF] border-[2px] border-[#0F172A] p-4 rounded-2xl shadow-[3px_3px_0_#0F172A] mt-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase font-black text-hub-navy flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">event_upcoming</span>
                  <span>Semester 4 Critical Examination Slots:</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">Indus Schedule</span>
              </div>
              <div className="space-y-2">
                {(clockConfig.papersSchedule || []).map((paper, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-2.5 rounded-xl border-[1.5px] border-[#0F172A] text-xs font-bold"
                  >
                    <span className="text-[#0F172A] truncate pr-2">
                      {paper.code ? `${paper.code} · ` : ''}{paper.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0 border border-[#0F172A] ${
                        idx === 0
                          ? 'bg-[#FEE2E2] text-red-700'
                          : 'bg-[#FEF08A] text-[#0F172A]'
                      }`}
                    >
                      {paper.deadline || 'Upcoming'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Interactive SGPA Predictor Matrix */}
          <div
            className="lg:col-span-7 bg-white border-[3px] border-[#0F172A] shadow-[6px_6px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] p-6 sm:p-7 rounded-[32px] flex flex-col justify-between transition-all duration-300"
            id="sgpa-calculator"
          >
            <div>
              {/* Header: Title + Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-black text-[#0F172A] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#FF5722]">calculate</span>
                    <span>Interactive SGPA Predictor</span>
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Indus Standard
                  </span>
                </div>

                {/* Simplified Mode Toggle: Quick Grades vs Enter Marks */}
                <div className="inline-flex p-1 bg-slate-100 border-[2px] border-[#0F172A] rounded-xl self-start sm:self-auto shrink-0 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setCalculatorMode('grades')}
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      calculatorMode === 'grades'
                        ? 'bg-[#0F172A] text-white shadow-[1.5px_1.5px_0_#FF5722]'
                        : 'text-slate-700 hover:text-black'
                    }`}
                  >
                    Quick Grades
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalculatorMode('marks')}
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      calculatorMode === 'marks'
                        ? 'bg-[#0F172A] text-white shadow-[1.5px_1.5px_0_#FF5722]'
                        : 'text-slate-700 hover:text-black'
                    }`}
                  >
                    Enter Marks
                  </button>
                </div>
              </div>

              {/* Semester Pill Track (Neatly displayed S1 to S8 without cutting off) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-gray-500 uppercase mr-1">Sem:</span>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => handleSemChange(sem)}
                      className={`px-2.5 py-1 text-xs font-black uppercase rounded-lg border-[1.5px] border-[#0F172A] transition-all cursor-pointer ${
                        selectedSem === sem
                          ? 'bg-[#FF5722] text-white shadow-[2px_2px_0_#0F172A] -translate-y-0.5'
                          : 'bg-slate-100 hover:bg-[#FEF08A] text-[#0F172A]'
                      }`}
                    >
                      S{sem}
                    </button>
                  ))}
                </div>

                {/* Quick Presets Action */}
                <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={loadSampleMarksheet}
                    className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-400 text-[11px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[13px] text-sky-700">fact_check</span>
                    <span className="hidden sm:inline">Load Sample (8.28 SGPA · 774/1100 Marks)</span>
                    <span className="sm:hidden">Sample Sem 4 (8.28 SGPA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetToDefaultPreset}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 text-[11px] font-bold uppercase transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-xl sm:text-2xl font-black text-hub-navy uppercase leading-tight">
                  Semester {selectedSem} Course List
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {totalCredits} Credits Total
                </span>
              </div>

              {/* Helpful Guide for Enter Marks Mode */}
              {calculatorMode === 'marks' && (
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-slate-600 bg-slate-100/90 border border-slate-300 rounded-lg px-2.5 py-1 mb-2.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">info</span>
                    <span>Pass threshold: 40%</span>
                  </span>
                  <span>Toggle 100M / 200M if course has practical lab</span>
                </div>
              )}

              {/* ─── SIMPLIFIED & INTUITIVE COURSE LIST ─── */}
              <div className="space-y-2.5 mb-4 max-h-none sm:max-h-[500px] overflow-visible sm:overflow-y-auto pr-0 sm:pr-1.5 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
                {subjects.map((sub, idx) => {
                  const maxMarks = sub.totalMarks?.max || 100;
                  const obtMarks = sub.totalMarks?.obt ?? 0;
                  const pct = maxMarks > 0 ? ((obtMarks / maxMarks) * 100).toFixed(1) : '0.0';

                  return (
                    <div
                      key={sub.code || idx}
                      className={`p-3 sm:p-3.5 rounded-2xl border-[2px] transition-all ${
                        sub.hasBacklog
                          ? 'bg-red-50/70 border-red-400'
                          : 'bg-[#FAF8FF] hover:bg-[#F3E8FF]/40 border-[#0F172A]'
                      }`}
                    >
                      {/* Top Header Row: Full Title (Wrap cleanly, no truncation) + Credits & Remove Button */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-black text-[#0F172A] leading-snug break-words">
                            {sub.name || sub.shortTitle || sub.code}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                              maxMarks === 200
                                ? 'bg-purple-100 text-purple-950 border-purple-300'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                            }`}>
                              <span className="material-symbols-outlined text-[12px] text-amber-600">
                                {maxMarks === 200 ? 'science' : 'menu_book'}
                              </span>
                              <span>{maxMarks === 200 ? '200M Theory + Lab' : '100M Standard Scheme'}</span>
                            </span>
                            {sub.hasBacklog && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700 border border-red-300">
                                <span className="material-symbols-outlined text-[11px]">warning</span>
                                <span>Backlog</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Top-Right Badges & Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                          <span className="bg-[#FEF08A] text-[#0F172A] px-2 py-0.5 rounded-lg text-[10px] font-black border-[1.5px] border-[#0F172A] shadow-xs">
                            {sub.credits} Cr
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            title="Remove Course"
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 border border-slate-300 hover:border-red-300 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={`Remove ${sub.name || sub.code}`}
                          >
                            <span className="material-symbols-outlined text-xs leading-none">close</span>
                          </button>
                        </div>
                      </div>

                      {/* Bottom Interaction Row: Grade Dropdown (Mode 1) OR Marks Input (Mode 2) */}
                      {calculatorMode === 'grades' ? (
                        /* Mode 1: Quick Grade Dropdown */
                        <div className="pt-2.5 mt-2.5 border-t border-slate-200/80 flex items-center gap-2">
                          <div className="relative flex-1">
                            <select
                              className="w-full appearance-none bg-white text-xs font-black text-[#0F172A] pl-3 pr-8 py-2 rounded-xl border-[1.5px] border-[#0F172A] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF5722] cursor-pointer"
                              value={sub.grade}
                              onChange={(e) => handleGradeChange(idx, e.target.value)}
                              aria-label={`Select grade for ${sub.name}`}
                            >
                              {GRADE_MAP.map((g) => (
                                <option key={g.value} value={g.value}>
                                  {g.label}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-base">
                              unfold_more
                            </span>
                          </div>
                          <div className={`px-2.5 py-1.5 rounded-xl text-xs font-black border-[1.5px] shrink-0 ${
                            sub.hasBacklog
                              ? 'bg-red-500 text-white border-red-700'
                              : 'bg-[#BBF7D0] text-[#14532D] border-emerald-500'
                          }`}>
                            {sub.hasBacklog ? '0 GP' : `${sub.grade} GP`}
                          </div>
                        </div>
                      ) : (
                        /* Mode 2: Clean Total Marks Input + 100M/200M Switcher */
                        <div className="pt-2.5 mt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          {/* Scheme toggle pill (100M vs 200M) */}
                          <div className="flex items-center justify-between sm:justify-start gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 sm:hidden">Max Scheme:</span>
                            <div className="inline-flex p-0.5 bg-slate-200 border border-[#0F172A] rounded-lg shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleMaxMarks(idx, 100)}
                                className={`px-2 py-1 text-[10px] font-black rounded transition-all cursor-pointer ${
                                  maxMarks === 100
                                    ? 'bg-[#0F172A] text-white shadow-xs'
                                    : 'text-slate-700 hover:text-black'
                                }`}
                                title="Standard Theory Scheme (100 Marks Total)"
                              >
                                100M
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleMaxMarks(idx, 200)}
                                className={`px-2 py-1 text-[10px] font-black rounded transition-all cursor-pointer ${
                                  maxMarks === 200
                                    ? 'bg-[#0F172A] text-white shadow-xs'
                                    : 'text-slate-700 hover:text-black'
                                }`}
                                title="Theory + Practical Lab Scheme (200 Marks Total)"
                              >
                                200M
                              </button>
                            </div>
                          </div>

                          {/* Marks Input & Live Grade Badge */}
                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border-[1.5px] border-[#0F172A] shadow-xs flex-1 sm:flex-none justify-center">
                              <input
                                type="number"
                                min="0"
                                max={maxMarks}
                                value={sub.totalMarks?.obt ?? ''}
                                onChange={(e) => handleTotalMarkChange(idx, e.target.value)}
                                className="w-14 text-center font-mono text-xs font-black bg-slate-100 border border-slate-300 rounded px-1 py-0.5 focus:outline-none focus:bg-white"
                                placeholder="Marks"
                              />
                              <span className="text-[11px] font-bold text-slate-500">/ {maxMarks}M</span>
                            </div>

                            {/* Live Computed Grade Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-xl text-xs font-black border-[1.5px] shrink-0 text-center min-w-[68px] ${
                                sub.hasBacklog
                                  ? 'bg-red-500 text-white border-red-700'
                                  : 'bg-[#BBF7D0] text-[#14532D] border-emerald-500'
                              }`}
                            >
                              {sub.hasBacklog ? 'FF (0)' : `${sub.computedGrade || 'A'} (${sub.grade} GP)`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Add Custom Course Accordion */}
              {!showAddCustom ? (
                <button
                  type="button"
                  onClick={() => setShowAddCustom(true)}
                  className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-[#FAF8FF] text-slate-700 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer mb-4"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-600">add_circle</span>
                  <span>Add Elective / Custom Subject</span>
                </button>
              ) : (
                <form onSubmit={handleAddSubject} className="bg-slate-50 p-3.5 rounded-2xl border-2 border-[#0F172A] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 shadow-sm">
                  <input
                    type="text"
                    placeholder="Course name (e.g. Cloud Computing)..."
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    className="flex-1 bg-white border-[1.5px] border-[#0F172A] px-3 py-1.5 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={customSubjectCredits}
                      onChange={(e) => setCustomSubjectCredits(e.target.value)}
                      className="flex-1 sm:flex-none bg-white border-[1.5px] border-[#0F172A] px-3 py-1.5 text-xs font-black text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="2">2 Credits</option>
                      <option value="3">3 Credits</option>
                      <option value="4">4 Credits</option>
                      <option value="5">5 Credits</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-[#0F172A] hover:bg-[#FF5722] text-white px-4 py-1.5 text-xs font-black uppercase rounded-xl border-[1.5px] border-[#0F172A] shadow-[2px_2px_0_#FF5722] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCustom(false)}
                      className="text-slate-500 hover:text-slate-900 p-1.5 text-xs font-bold cursor-pointer"
                      title="Cancel"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Result Scorecard & Merit Achievement */}
            <div className="bg-[#FEF9C3] border-[2.5px] border-[#0F172A] p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0_#0F172A] space-y-3.5">
              {/* Top Row: Projected SGPA & Merit Classification Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/10">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <div>
                    <span className="text-[11px] uppercase font-black tracking-wider text-slate-700 block">
                      Projected SGPA:
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-3xl sm:text-4xl font-black text-hub-navy leading-none">
                        {calculatedSGPA}
                      </span>
                      <span className="text-xs uppercase font-black text-[#FF5722]">/ 10.0</span>
                    </div>
                  </div>

                  <span className={`sm:hidden inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black rounded-xl border border-[#0F172A] shadow-xs ${merit.color}`}>
                    <span className="material-symbols-outlined text-[15px]">{merit.icon}</span>
                    <span>{merit.text}</span>
                  </span>
                </div>

                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border border-[#0F172A] shadow-[2px_2px_0_#0F172A] ${merit.color}`}>
                  <span className="material-symbols-outlined text-[16px]">{merit.icon}</span>
                  <span>{merit.text}</span>
                </span>
              </div>

              {/* Progress bar toward 10.0 CGPA & Credits summary */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold text-slate-800">
                  <span>Total {totalCredits} Credits ({subjects.length} Subjects)</span>
                  {calculatorMode === 'marks' && (
                    <span className="bg-white/90 px-2 py-0.5 rounded-md border border-[#0F172A] text-[11px]">
                      Total Marks: {totalMarksObt} / {totalMarksMax} ({overallPercentage}%)
                    </span>
                  )}
                </div>
                <div className="w-full h-2.5 bg-white/90 border border-[#0F172A] rounded-full overflow-hidden p-0.5 shadow-2xs">
                  <div
                    className="h-full bg-[#FF5722] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
