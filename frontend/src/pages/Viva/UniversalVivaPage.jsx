// frontend/src/pages/Viva/UniversalVivaPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useViva } from '../../hooks/useViva';
import VivaDossierSidebar from '../../components/viva/VivaDossierSidebar';
import VivaDossierQuestion from '../../components/viva/VivaDossierQuestion';
import VivaDossierExperiment from '../../components/viva/VivaDossierExperiment';

/**
 * Universal Viva Questions & Solutions Platform
 * Fresh, distinctive CampusHub Academic Dossier Design Pattern.
 * - Branded CampusHub neo-brutalist styling
 * - Clean unit switcher pills
 * - Sticky left question index with active scroll tracking
 * - Directly visible answers (punchline, detailed breakdown, diagrams, examiner follow-ups)
 * - Practical experiment support
 */
export default function UniversalVivaPage() {
  const { code } = useParams();
  const normalizedCode = (code || 'CE0518').toUpperCase();

  const {
    subject,
    loading,
    allQuestions,
    experiments,
    sections,
  } = useViva(normalizedCode);

  const [activeSectionId, setActiveSectionId] = useState('unit-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Initialize active section once sections are loaded
  useEffect(() => {
    if (sections && sections.length > 0) {
      const exists = sections.some((s) => s.id === activeSectionId);
      if (!exists) {
        setActiveSectionId(sections[0].id);
      }
    }
  }, [sections]);

  const activeSection = useMemo(() => {
    return sections?.find((s) => s.id === activeSectionId) || sections?.[0] || {
      id: 'unit-1',
      name: 'Unit 1: Introduction to Computer Networks, Data Link Layer',
      type: 'theory',
    };
  }, [sections, activeSectionId]);

  // Questions for active section (100% dynamic from database)
  const currentQuestions = useMemo(() => {
    if (activeSectionId === 'practicals') return [];

    const sId = (activeSection.id || '').toLowerCase();
    const sName = (activeSection.name || '').toLowerCase();
    const hasMultipleSections = sections && sections.length > 1;

    const unitQuestions = allQuestions.filter((q) => {
      if (!hasMultipleSections) return true;
      if (!q.section && !q.unitId) return true;

      const qUnitId = (q.unitId || '').toLowerCase();
      const qSec = (q.section || '').toLowerCase();

      return (
        qUnitId === sId ||
        qSec === sName ||
        qSec.includes(sId) ||
        (sName.length > 5 && qSec.includes(sName.slice(0, 6)))
      );
    });

    if (!searchQuery.trim()) return unitQuestions;
    const term = searchQuery.toLowerCase().trim();

    return unitQuestions.filter(
      (q) =>
        (q.question || '').toLowerCase().includes(term) ||
        (q.shortAnswer || '').toLowerCase().includes(term) ||
        (q.detailedAnswer || '').toLowerCase().includes(term) ||
        (q.keyPoints || []).some((kp) => kp.toLowerCase().includes(term))
    );
  }, [allQuestions, sections, activeSection, activeSectionId, searchQuery]);

  // Experiments for practicals section
  const currentExperiments = useMemo(() => {
    if (activeSectionId !== 'practicals') return [];
    if (!searchQuery.trim()) return experiments;

    const term = searchQuery.toLowerCase().trim();
    return experiments.filter(
      (exp) =>
        (exp.title || '').toLowerCase().includes(term) ||
        (exp.aim || '').toLowerCase().includes(term) ||
        (exp.shortTheory || '').toLowerCase().includes(term)
    );
  }, [experiments, activeSectionId, searchQuery]);

  // Pagination between units
  const currentSectionIndex = sections?.findIndex((s) => s.id === activeSectionId) ?? 0;
  const prevSection = currentSectionIndex > 0 ? sections[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex < (sections?.length || 0) - 1 ? sections[currentSectionIndex + 1] : null;

  const subjectTitle = subject?.title || subject?.subjectName || 'Computer Networks';
  const semesterNumber = subject?.semester || 5;

  return (
    <div className="pt-20 min-h-screen bulletin-board-bg text-gray-900 selection:bg-amber-300 selection:text-black">
      
      {/* ─── Ambient Glows ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-10 left-[5%] w-[450px] h-[450px] bg-amber-200/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] right-[5%] w-[420px] h-[420px] bg-sky-200/40 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ─── 1. Header Card (CampusHub Dossier Banner) ─── */}
        <section className="bg-white/95 border-2 border-black rounded-[26px] p-5 sm:p-7 shadow-[6px_6px_0px_#000] mb-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-gray-600 font-bold mb-4">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/semesters" className="hover:text-amber-600 transition-colors">Semester {semesterNumber}</Link>
            <span className="text-gray-400">/</span>
            <Link to={`/subject/${normalizedCode.toLowerCase()}`} className="hover:text-amber-600 transition-colors">
              {subjectTitle}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="bg-[#FEF3D6] text-black border border-black/20 px-2 py-0.5 rounded-md">
              Viva Preparation
            </span>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b-2 border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-[#FBBF24] px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider font-mono">
                  {normalizedCode}
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-lg text-xs font-extrabold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">verified</span>
                  Indus University Exam Question Bank
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-tight">
                {subjectTitle} — Viva Questions & Solutions
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Comprehensive viva solutions with direct examiner answers, technical explanations, diagrams, and follow-ups.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="w-full md:w-72 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#000] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Unit Switcher Pills Bar */}
          <div className="pt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-black uppercase tracking-wider text-black/60 mr-2 shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">bookmark</span>
              Units:
            </span>

            {sections.map((sec) => {
              const isActive = activeSectionId === sec.id;
              const shortName = sec.name.split(':')[0] || sec.name;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-2 ${
                    isActive
                      ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-[3px_3px_0px_#FBBF24] -translate-y-0.5'
                      : 'bg-white hover:bg-amber-50 text-gray-900 border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  <span>{shortName}</span>
                </button>
              );
            })}
          </div>

        </section>

        {/* ─── Mobile Navigator Trigger Button ─── */}
        <div className="lg:hidden mb-6 flex items-center justify-between bg-white border-2 border-black rounded-2xl p-3 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-amber-500 text-lg">folder</span>
            <span className="text-xs font-black truncate">{activeSection.name}</span>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="btn-black-yellow px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">list</span>
            <span>Index</span>
          </button>
        </div>

        {/* ─── 2. Main 2-Column Responsive Reading Layout ─── */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Left Sticky Index Navigator */}
          <VivaDossierSidebar
            questions={currentQuestions}
            sections={sections}
            activeSectionId={activeSectionId}
            onSelectSection={setActiveSectionId}
          />

          {/* Right Reading Canvas: Directly Visible Questions & Answers */}
          <main className="flex-1 w-full min-w-0 space-y-6">
            
            {/* Active Unit Section Heading */}
            <div className="bg-[#FEF3D6] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black/60 block">
                  Active Syllabus Section
                </span>
                <h2 className="text-lg sm:text-xl font-black text-black tracking-tight">
                  {activeSection.name}
                </h2>
              </div>
              <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-black px-3 py-1 rounded-xl text-xs font-black font-mono shrink-0 shadow-2xs">
                {activeSectionId === 'practicals' ? `${currentExperiments.length} Labs` : `${currentQuestions.length} Questions`}
              </span>
            </div>

            {/* Questions Stream */}
            {activeSectionId !== 'practicals' ? (
              <div className="space-y-6">
                {currentQuestions.length === 0 ? (
                  <div className="text-center py-16 bg-white border-2 border-black rounded-2xl p-6 shadow-[3px_3px_0px_#000]">
                    <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">quiz</span>
                    <h3 className="font-black text-base text-black">
                      {searchQuery.trim() ? 'No questions match your search' : 'No questions published in this section yet'}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                      {searchQuery.trim()
                        ? 'Try resetting the search query to see all questions.'
                        : 'Questions added and published in the Admin Portal will appear here automatically.'}
                    </p>
                    {searchQuery.trim() && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 btn-black-yellow px-4 py-2 rounded-xl text-xs font-black cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  currentQuestions.map((q, idx) => (
                    <VivaDossierQuestion key={q.id || idx} question={q} index={idx} />
                  ))
                )}
              </div>
            ) : (
              /* Practical Experiments Stream */
              <div className="space-y-6">
                {currentExperiments.length === 0 ? (
                  <div className="text-center py-16 bg-white border-2 border-dashed border-black/30 rounded-2xl p-6">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">science</span>
                    <h3 className="font-black text-base text-black">No experiments found</h3>
                  </div>
                ) : (
                  currentExperiments.map((exp, idx) => (
                    <VivaDossierExperiment key={exp.id || idx} experiment={exp} index={idx} />
                  ))
                )}
              </div>
            )}

            {/* Bottom Next/Previous Unit Navigation */}
            <div className="pt-6 flex items-center justify-between gap-4">
              {prevSection ? (
                <button
                  onClick={() => {
                    setActiveSectionId(prevSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-amber-50 text-black border-2 border-black rounded-2xl px-4 py-3 text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000] flex items-center gap-2 active-press cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  <div className="text-left">
                    <span className="block text-[10px] text-gray-500 uppercase">Previous Unit</span>
                    <span className="truncate max-w-[140px] sm:max-w-xs block">{prevSection.name.split(':')[0]}</span>
                  </div>
                </button>
              ) : <div />}

              {nextSection && (
                <button
                  onClick={() => {
                    setActiveSectionId(nextSection.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#0F172A] hover:bg-slate-800 text-[#FBBF24] border-2 border-black rounded-2xl px-5 py-3 text-xs sm:text-sm font-black shadow-[3px_3px_0px_#FBBF24] flex items-center gap-2 active-press cursor-pointer"
                >
                  <div className="text-right">
                    <span className="block text-[10px] text-amber-300 uppercase">Next Unit</span>
                    <span className="truncate max-w-[140px] sm:max-w-xs block">{nextSection.name.split(':')[0]}</span>
                  </div>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              )}
            </div>

          </main>

        </div>

      </div>

    </div>
  );
}
