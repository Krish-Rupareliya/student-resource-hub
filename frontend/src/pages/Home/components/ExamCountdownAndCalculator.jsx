import React, { useState, useEffect } from 'react';
import { getPublicHomepageSettings } from '../../../services/settings/settingsApi';
import { fetchSemestersCatalog } from '../../../services/resources/resourcesApi';

// Pre-defined semester syllabus presets matching database subjects for Indus CE
const SEMESTER_PRESETS = {
  1: [
    { name: 'Mathematics - I (CE0101)', credits: 4, grade: 9 },
    { name: 'Physics (CE0102)', credits: 4, grade: 8 },
    { name: 'Basic Electronics (CE0103)', credits: 4, grade: 8 },
    { name: 'Programming Fundamentals - C (CE0104)', credits: 5, grade: 9 },
    { name: 'Engineering Graphics (CE0105)', credits: 3, grade: 8 },
  ],
  2: [
    { name: 'Mathematics - II (CE0201)', credits: 4, grade: 9 },
    { name: 'Data Structures (CE0202)', credits: 5, grade: 9 },
    { name: 'Digital Electronics (CE0203)', credits: 4, grade: 8 },
    { name: 'Object Oriented Programming - C++ (CE0204)', credits: 4, grade: 9 },
    { name: 'Environmental Science (CE0205)', credits: 2, grade: 10 },
  ],
  3: [
    { name: 'Discrete Mathematics (CE0301)', credits: 4, grade: 8 },
    { name: 'Computer Organization (CE0302)', credits: 4, grade: 8 },
    { name: 'Database Management Systems (CE0303)', credits: 5, grade: 9 },
    { name: 'Java Programming (CE0304)', credits: 5, grade: 10 },
    { name: 'Probability & Statistics (CE0305)', credits: 4, grade: 8 },
  ],
  4: [
    { name: 'Operating Systems (CE0401)', credits: 4, grade: 9 },
    { name: 'Computer Networks (CE0402)', credits: 4, grade: 9 },
    { name: 'Theory of Computation (CE0403)', credits: 4, grade: 8 },
    { name: 'Software Engineering (CE0404)', credits: 4, grade: 9 },
    { name: 'Web Development (CE0405)', credits: 4, grade: 9 },
  ],
  5: [
    { name: 'Design & Analysis of Algorithms (CE0501)', credits: 5, grade: 9 },
    { name: 'Compiler Design (CE0502)', credits: 4, grade: 8 },
    { name: 'Artificial Intelligence (CE0503)', credits: 4, grade: 9 },
    { name: 'Mobile Application Development (CE0504)', credits: 4, grade: 8 },
    { name: 'Information Security (CE0505)', credits: 4, grade: 9 },
  ],
  6: [
    { name: 'Machine Learning (CE0601)', credits: 4, grade: 9 },
    { name: 'Cloud Computing (CE0602)', credits: 4, grade: 9 },
    { name: 'Internet of Things (CE0603)', credits: 4, grade: 8 },
    { name: 'Big Data Analytics (CE0604)', credits: 4, grade: 8 },
    { name: 'Distributed Systems (CE0605)', credits: 4, grade: 9 },
  ],
  7: [
    { name: 'Deep Learning (CE0701)', credits: 4, grade: 9 },
    { name: 'Blockchain Technology (CE0702)', credits: 4, grade: 8 },
    { name: 'Natural Language Processing (CE0703)', credits: 4, grade: 9 },
    { name: 'DevOps & CI/CD (CE0704)', credits: 4, grade: 9 },
  ],
  8: [
    { name: 'Project Management (CE0801)', credits: 3, grade: 9 },
    { name: 'Ethics in Computing (CE0802)', credits: 3, grade: 9 },
    { name: 'Major Project (CE0803)', credits: 12, grade: 10 },
  ],
};

const GRADE_MAP = [
  { label: 'AA (10)', value: 10, bg: 'bg-[#BBF7D0] text-[#14532D]' },
  { label: 'AB (9)', value: 9, bg: 'bg-[#BAE6FD] text-[#0369A1]' },
  { label: 'BB (8)', value: 8, bg: 'bg-[#FEF08A] text-[#713F12]' },
  { label: 'BC (7)', value: 7, bg: 'bg-[#FDE047] text-[#854D0E]' },
  { label: 'CC (6)', value: 6, bg: 'bg-[#FED7AA] text-[#9A3412]' },
  { label: 'CD (5)', value: 5, bg: 'bg-[#FECDD3] text-[#9F1239]' },
  { label: 'FF (0)', value: 0, bg: 'bg-[#FFDAD6] text-[#93000A]' },
];

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
        { code: 'CE0402', name: 'Computer Networks', deadline: 'In 3 Days' },
        { code: 'CE0404', name: 'Software Engineering', deadline: 'In 7 Days' },
        { code: 'CE0401', name: 'Operating Systems', deadline: 'In 12 Days' },
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

  // Fetch live subjects directly from DB catalog
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
              semMap[sem.semesterNumber] = sem.subjects.map((sub) => ({
                name: `${sub.title} (${sub.code})`,
                credits: 4,
                grade: 9,
              }));
            }
          });
          setDbCatalogSemesters(semMap);
          if (semMap[4]?.length > 0) {
            setSubjects(semMap[4]);
          }
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

  // SGPA calculator state with preset selection
  const [selectedSem, setSelectedSem] = useState(4);
  const [subjects, setSubjects] = useState(SEMESTER_PRESETS[4]);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [customSubjectCredits, setCustomSubjectCredits] = useState(4);

  const handleSemChange = (sem) => {
    setSelectedSem(sem);
    if (dbCatalogSemesters?.[sem]?.length > 0) {
      setSubjects(dbCatalogSemesters[sem]);
    } else {
      setSubjects(SEMESTER_PRESETS[sem] || []);
    }
  };

  const handleGradeChange = (index, value) => {
    const updated = [...subjects];
    updated[index].grade = parseFloat(value);
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
        name: customSubjectName.trim(),
        credits: parseInt(customSubjectCredits, 10) || 4,
        grade: 9,
      },
    ]);
    setCustomSubjectName('');
  };

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalPoints = subjects.reduce((sum, s) => sum + s.credits * s.grade, 0);
  const calculatedSGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  const progressPercent = Math.min(100, Math.max(0, (parseFloat(calculatedSGPA) / 10) * 100));

  const getMeritBadge = (val) => {
    const num = parseFloat(val);
    if (num >= 9.0) return { text: 'Outstanding (Ranker Tier) 🏆', color: 'bg-[#4ADE80] text-[#0F172A]' };
    if (num >= 8.0) return { text: 'First Class Distinction ⭐', color: 'bg-[#38BDF8] text-[#0F172A]' };
    if (num >= 6.5) return { text: 'First Class Grade ✓', color: 'bg-[#FACC15] text-[#0F172A]' };
    if (num >= 5.0) return { text: 'Second Class Pass 🎯', color: 'bg-[#FED7AA] text-[#0F172A]' };
    return { text: 'Backlog Risk ⚠️', color: 'bg-[#FF5722] text-white' };
  };

  const merit = getMeritBadge(calculatedSGPA);

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2.5">
              <span className="material-symbols-outlined text-[15px] text-[#FF5722]">bolt</span>
              <span>EXAM READINESS ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
              Live Semester Clock &amp; <span className="text-amber-500">SGPA Matrix</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base font-medium text-gray-600 max-w-md">
            Track real-time Indus finals countdowns and project your target semester index before exams arrive.
          </p>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
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
            <div className="bg-[#FAF8FF] border-[2px] border-[#0F172A] p-4 rounded-2xl shadow-[3px_3px_0_#0F172A]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase font-black text-hub-navy flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">event_upcoming</span>
                  Next Critical Papers:
                </span>
                <span className="text-[11px] font-bold text-slate-500">Indus Slot</span>
              </div>
              <div className="space-y-2">
                {(clockConfig.papersSchedule || []).map((paper, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-2.5 rounded-xl border-[1.5px] border-[#0F172A] text-xs font-bold"
                  >
                    <span className="text-[#0F172A] truncate pr-2">
                      {paper.code ? `${paper.code} • ` : ''}{paper.name}
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
              {/* Header + Semester Selector Pill Track */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <span className="text-xs uppercase tracking-wider font-black text-[#0F172A] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#FF5722]">calculate</span>
                  Interactive SGPA Predictor
                </span>

                {/* Preset Semester buttons S1 to S8 */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-black text-hub-navy uppercase leading-tight mb-1.5">
                Semester {selectedSem} Course Matrix
              </h3>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-4">
                Pick expected grades. Credits &amp; formulas auto-adjust according to official Indus syllabus.
              </p>

              {/* Course Matrix Table (Natural full list without inner scrollbar) */}
              <div className="space-y-2.5 mb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center bg-[#FAF8FF] hover:bg-[#F3E8FF]/40 p-2.5 rounded-xl border-[2px] border-[#0F172A] transition-colors"
                  >
                    <div className="col-span-6 text-xs sm:text-sm font-black text-[#0F172A] truncate" title={sub.name}>
                      {sub.name}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="bg-[#FEF08A] text-[#0F172A] px-2 py-0.5 rounded-md text-[10px] font-black border border-[#0F172A]">
                        {sub.credits} Credits
                      </span>
                    </div>
                    <div className="col-span-3">
                      <select
                        className="w-full bg-white text-xs font-black text-[#0F172A] p-1.5 rounded-lg border-[1.5px] border-[#0F172A] focus:outline-none focus:shadow-[2px_2px_0_#FF5722] cursor-pointer"
                        value={sub.grade}
                        onChange={(e) => handleGradeChange(idx, e.target.value)}
                      >
                        {GRADE_MAP.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        title="Remove Course"
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-200 text-red-600 border border-red-300 flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add Custom Course Form */}
              <form onSubmit={handleAddSubject} className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Add custom course (e.g. AI Elective)..."
                  value={customSubjectName}
                  onChange={(e) => setCustomSubjectName(e.target.value)}
                  className="flex-1 bg-[#FAF8FF] border-[2px] border-[#0F172A] px-3 py-2 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722]"
                />
                <select
                  value={customSubjectCredits}
                  onChange={(e) => setCustomSubjectCredits(e.target.value)}
                  className="bg-[#FAF8FF] border-[2px] border-[#0F172A] px-3 py-2 text-xs font-black text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                  <option value="5">5 Credits</option>
                  <option value="6">6 Credits</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#0F172A] hover:bg-[#FF5722] text-white px-4 py-2 text-xs font-black uppercase rounded-xl border-[2px] border-[#0F172A] shadow-[2px_2px_0_#FF5722] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  + Add
                </button>
              </form>
            </div>

            {/* Result Scorecard & Merit Achievement */}
            <div className="bg-[#FEF9C3] border-[2.5px] border-[#0F172A] p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0_#0F172A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-black text-[#0F172A]">
                    Estimated Index:
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-black rounded-lg border border-[#0F172A] shadow-xs ${merit.color}`}>
                    {merit.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <span>Across {totalCredits} credits ({subjects.length} subjects)</span>
                </div>

                {/* Progress bar toward 10.0 CGPA */}
                <div className="w-full sm:w-64 h-2.5 bg-white/80 border border-[#0F172A] rounded-full overflow-hidden mt-2 p-0.5">
                  <div
                    className="h-full bg-[#FF5722] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-baseline gap-1 bg-white px-4 py-2 rounded-xl border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A]">
                <span className="font-mono text-3xl sm:text-4xl font-black text-hub-navy leading-none">
                  {calculatedSGPA}
                </span>
                <span className="text-xs uppercase font-black text-[#FF5722]">/ 10.0</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
