// frontend/src/components/viva/VivaDossierSidebar.jsx
import React, { useState, useEffect } from 'react';

/**
 * Sticky Left Question Navigator for the Viva Dossier
 * Shows active unit's questions with instant click-to-scroll and active viewport tracking.
 */
export default function VivaDossierSidebar({
  questions = [],
  activeQuestionId = '',
  onSelectQuestion,
  sections = [],
  activeSectionId = '',
  onSelectSection,
}) {
  const [activeId, setActiveId] = useState(activeQuestionId);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    questions.forEach((q) => {
      const el = document.getElementById(q.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [questions]);

  const scrollToQuestion = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      if (onSelectQuestion) onSelectQuestion(id);
    }
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 space-y-4 select-none">
      
      {/* Unit Selector Box */}
      <div className="bg-white border-2 border-black rounded-2xl p-3.5 shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-500 mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-500">folder_open</span>
            Syllabus Units
          </span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded">
            {sections.length}
          </span>
        </div>

        <div className="space-y-1">
          {sections.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                  isActive
                    ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-[2px_2px_0px_#FBBF24]'
                    : 'bg-white hover:bg-amber-50/70 text-gray-800 border-transparent hover:border-black/20'
                }`}
              >
                <span className="truncate pr-1">
                  {sec.name.split(':')[0] || sec.name}
                </span>
                <span className="material-symbols-outlined text-sm shrink-0">
                  {isActive ? 'check_circle' : 'chevron_right'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* On This Unit Question Navigator */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black pb-2 mb-2 border-b-2 border-black/10">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-blue-600">format_list_numbered</span>
            Questions Index
          </span>
          <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full">
            {questions.length} Qs
          </span>
        </div>

        <nav className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const isActive = activeId === q.id;
            const qNum = q.questionNumber || `Q.${idx + 1}`;

            return (
              <a
                key={q.id}
                href={`#${q.id}`}
                onClick={(e) => scrollToQuestion(e, q.id)}
                className={`block p-2 rounded-xl text-xs transition-all border ${
                  isActive
                    ? 'bg-[#FEF3D6] text-black border-black font-extrabold shadow-[2px_2px_0px_#000] translate-x-1'
                    : 'bg-transparent hover:bg-gray-50 text-gray-700 border-transparent hover:border-black/20 font-medium'
                }`}
                title={q.question}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-black text-[#FBBF24]' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {qNum}
                  </span>
                  {q.difficulty && (
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      {q.difficulty}
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 leading-snug">
                  {q.question}
                </p>
              </a>
            );
          })}
        </nav>

        <div className="mt-3 pt-3 border-t border-black/10 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[11px] font-black text-gray-500 hover:text-black inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
            Back to Top
          </button>
        </div>
      </div>

    </aside>
  );
}
