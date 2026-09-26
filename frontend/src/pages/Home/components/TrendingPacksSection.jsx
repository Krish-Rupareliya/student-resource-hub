import React, { useState, useEffect } from 'react';
import { getPublicHomepageSettings } from '../../../services/settings/settingsApi';

const DEFAULT_PACKS = [
  {
    id: 'pack-1',
    tag: 'SEM 3 & 4',
    category: 'dsa',
    tagBg: 'bg-[#FEF08A] text-[#0F172A]',
    rating: '★ 4.9 (1.2k)',
    title: 'DSA Master Cheat Sheet & 80 Solved PYQs',
    desc: 'Trees, Graphs, and DP templates with Indus 100-mark proofs and diagrams.',
    fileSize: '4.2 MB',
    format: 'PDF',
    pages: '48 Pages',
    topics: [
      'Binary Search Trees & AVL Rotations with complete runnable C code',
      'Dijkstra & Prim Minimal Spanning Tree Step-by-Step examples',
      'Dynamic Programming: 0/1 Knapsack & Longest Common Subsequence',
      'Indus Repeated 100-Mark Exam Proof: Asymptotic notations Big-O, Omega, Theta',
    ],
    fileUrl: '/downloads/dsa-master-cheat-sheet.pdf',
    fileName: 'dsa-master-cheat-sheet.pdf',
  },
  {
    id: 'pack-2',
    tag: 'SEM 5',
    category: 'systems',
    tagBg: 'bg-[#BAE6FD] text-[#0F172A]',
    rating: '★ 4.8 (890)',
    title: 'Operating Systems End-Sem Rapid Revision',
    desc: 'Deadlocks, Semaphore code, and Page Replacement algorithms step-by-step.',
    fileSize: '6.8 MB',
    format: 'PDF',
    pages: '62 Pages',
    topics: [
      'Process Synchronization: Peterson’s Algorithm & Counting Semaphores',
      "Banker's Deadlock Avoidance Algorithm with full safety matrix proof",
      'Virtual Memory: FIFO, LRU, and Optimal Paging comparison table',
      'Disk Arm Scheduling: SCAN, C-SCAN, LOOK, C-LOOK numericals',
    ],
    fileUrl: '/downloads/operating-systems-rapid-revision.pdf',
    fileName: 'operating-systems-rapid-revision.pdf',
  },
  {
    id: 'pack-3',
    tag: 'SEM 4',
    category: 'dbms',
    tagBg: 'bg-[#BBF7D0] text-[#0F172A]',
    rating: '★ 5.0 (2.1k)',
    title: 'DBMS Complete SQL & Normalization Kit',
    desc: '1NF to BCNF decomposition examples with solutions to past 5 winter papers.',
    fileSize: '3.1 MB',
    format: 'PDF',
    pages: '36 Pages',
    topics: [
      'Relational Algebra vs Tuple Relational Calculus query equivalents',
      'Lossless Join & Dependency Preserving Normalization proofs (1NF-BCNF)',
      'ACID Properties & Two-Phase Locking (2PL) Concurrency Protocol',
      'Solved SQL queries with GROUP BY, HAVING, nested subqueries, and Triggers',
    ],
    fileUrl: '/downloads/dbms-complete-sql-normalization-kit.pdf',
    fileName: 'dbms-complete-sql-normalization-kit.pdf',
  },
  {
    id: 'pack-4',
    tag: 'ALL BRANCHES',
    category: 'python',
    tagBg: 'bg-[#FBCFE8] text-[#0F172A]',
    rating: '★ 4.9 (3.4k)',
    title: 'Python & Full Stack Practical Code Files',
    desc: '12 mandatory lab experiments with input/output screenshots ready for print.',
    fileSize: '12.4 MB',
    format: 'ZIP',
    pages: '12 Files + PDF',
    topics: [
      'Lab 1-4: Python Data Structures, Generators, Lambda, and Decorators',
      'Lab 5-8: SQLite database connectivity, NumPy Matrix, Pandas CSV analysis',
      'Lab 9-12: Full Stack REST API with Express / FastAPI + React Frontend',
      'Viva Guide: 50 Most asked technical viva questions with short answers',
    ],
    fileUrl: '/downloads/python-fullstack-practical-code-files.pdf',
    fileName: 'python-fullstack-practical-code-files.pdf',
  },
];

export default function TrendingPacksSection() {
  const [downloadStates, setDownloadStates] = useState({});
  const [activePreviewPack, setActivePreviewPack] = useState(null);
  const [packs, setPacks] = useState(DEFAULT_PACKS);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function loadPacks() {
      try {
        const settings = await getPublicHomepageSettings();
        if (isMounted && settings?.trending?.trendingPacks?.length > 0) {
          setPacks(settings.trending.trendingPacks);
        }
      } catch (err) {
        console.warn('Could not load trending packs:', err);
      }
    }
    loadPacks();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = (pack) => {
    if (!pack) return;
    const packId = pack.id;
    setDownloadStates((prev) => ({ ...prev, [packId]: 'loading' }));

    try {
      if (pack.fileUrl) {
        const link = document.createElement('a');
        link.href = pack.fileUrl;
        link.download = pack.fileName || `${(pack.title || 'study_pack').replace(/[^a-zA-Z0-9_-]/g, '_')}.${pack.format ? pack.format.toLowerCase() : 'pdf'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const topicsList = (pack.topics || []).map((t, i) => `${i + 1}. ${t}`).join('\n');
        const documentContent = `================================================================================
INDUS UNIVERSITY - STUDENT RESOURCE HUB
OFFICIAL REVISION STUDY PACK
================================================================================
Title:       ${pack.title}
Semester:    ${pack.tag || 'All Semesters'}
Rating:      ${pack.rating || '★ 5.0'}
Pages/Scope: ${pack.pages || 'Complete Revision'}
Format:      ${pack.format || 'PDF'}
Date Saved:  ${new Date().toLocaleDateString()}
Passing:     40/100 Marks (Indus University 100-Mark Official Scheme)
================================================================================

OVERVIEW & EXAM SYNOPSIS:
${pack.desc || 'Comprehensive exam preparation pack.'}

--------------------------------------------------------------------------------
KEY HIGH-YIELD TOPICS & FORMULA BLUEPRINTS:
--------------------------------------------------------------------------------
${topicsList}

================================================================================
STUDY INSTRUCTIONS:
1. Practice each topic question under timed conditions (3 hours for 100-mark paper).
2. Write full step-by-step proofs with diagram sketches for descriptive questions.
3. Access question papers and solutions on Student Resource Hub.
================================================================================
`;
        const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(pack.title || 'study_pack').replace(/[^a-zA-Z0-9_-]/g, '_')}_StudyPack.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [packId]: 'done' }));
        setTimeout(() => {
          setDownloadStates((prev) => ({ ...prev, [packId]: null }));
        }, 2500);
      }, 500);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStates((prev) => ({ ...prev, [packId]: null }));
    }
  };

  const filteredPacks = selectedFilter === 'all'
    ? packs
    : packs.filter((p) => p.category === selectedFilter || p.tag.toLowerCase().includes(selectedFilter));

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFEDD5] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2.5">
              <span className="material-symbols-outlined text-[15px] text-[#FF5722]">local_fire_department</span>
              <span>MOST DOWNLOADED THIS WEEK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
              Trending <span className="text-amber-500">Study Packs</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Packs' },
              { id: 'dsa', label: 'DSA & Algorithms' },
              { id: 'systems', label: 'OS & Systems' },
              { id: 'dbms', label: 'DBMS' },
              { id: 'python', label: 'Python & Web' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase border-2 border-[#0F172A] transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#0F172A] text-white shadow-[2.5px_2.5px_0_#FACC15] -translate-y-0.5'
                    : 'bg-white hover:bg-[#FEF08A] text-[#0F172A] shadow-[2px_2px_0_#0F172A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPacks.map((pack) => {
            const state = downloadStates[pack.id];
            return (
              <div
                key={pack.id}
                className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A] hover:shadow-[7px_7px_0_#0F172A] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`${pack.tagBg} px-2.5 py-0.5 rounded-lg border border-[#0F172A] text-[10px] font-black uppercase shadow-xs`}>
                      {pack.tag}
                    </span>
                    <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                      {pack.rating}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-black text-hub-navy uppercase leading-snug group-hover:text-amber-600 transition-colors mb-2">
                    {pack.title}
                  </h3>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed line-clamp-2 mb-4">
                    {pack.desc}
                  </p>

                  {/* Mini bullet highlights */}
                  <div className="space-y-1.5 mb-5">
                    {(pack.topics || []).slice(0, 2).map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-1.5 text-[11px] font-semibold text-gray-700">
                        <span className="material-symbols-outlined text-[14px] text-[#4ADE80] shrink-0 mt-0.5">check_circle</span>
                        <span className="line-clamp-1">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t-2 border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">description</span>
                      {pack.pages}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300">
                      {pack.fileSize}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePreviewPack(pack)}
                      className="bg-[#FAF8FF] hover:bg-[#FEF08A] text-[#0F172A] text-xs font-black uppercase py-2.5 rounded-xl border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(pack)}
                      disabled={state === 'loading'}
                      className={`text-xs font-black uppercase py-2.5 rounded-xl border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        state === 'done'
                          ? 'bg-[#4ADE80] text-[#0F172A]'
                          : state === 'loading'
                          ? 'bg-[#FEF08A] text-[#0F172A] animate-pulse'
                          : 'bg-[#FF5722] hover:bg-[#E64A19] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {state === 'done' ? 'check_circle' : 'download'}
                      </span>
                      <span>{state === 'loading' ? 'Fetching...' : state === 'done' ? 'Saved ✓' : 'Get Pack'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Preview Modal */}
        {activePreviewPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 font-poppins">
            <div className="bg-white rounded-3xl border-[3px] border-[#0F172A] shadow-[8px_8px_0_#FF5722] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between border-b-[3px] border-[#0F172A]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FACC15]">menu_book</span>
                  <span className="text-xs uppercase font-mono font-black text-amber-400">
                    Quick Syllabus Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePreviewPack(null)}
                  className="w-7 h-7 rounded-lg bg-white text-[#0F172A] border border-[#0F172A] flex items-center justify-center text-xs font-black cursor-pointer shadow-[1px_1px_0_#0F172A]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-lg border border-[#0F172A] text-[10px] font-black uppercase bg-[#FEF08A] text-[#0F172A] mb-2">
                    {activePreviewPack.tag} • {activePreviewPack.fileSize}
                  </div>
                  <h3 className="text-xl font-black text-hub-navy uppercase leading-tight">
                    {activePreviewPack.title}
                  </h3>
                  <p className="text-xs font-medium text-gray-600 mt-1">
                    {activePreviewPack.desc}
                  </p>
                </div>

                <div className="bg-[#FAF8FF] border-[2px] border-[#0F172A] p-4 rounded-2xl">
                  <span className="text-xs font-black text-hub-navy uppercase block mb-2">
                    High-Yield Topics Covered:
                  </span>
                  <ul className="space-y-2">
                    {(activePreviewPack.topics || []).map((top, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-gray-700">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">verified</span>
                        <span>{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePreviewPack(null)}
                    className="px-4 py-2.5 text-xs font-black uppercase text-gray-700 hover:text-black cursor-pointer text-center"
                  >
                    Close
                  </button>
                  {activePreviewPack.fileUrl && (
                    <a
                      href={activePreviewPack.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-slate-100 text-[#0F172A] px-4 py-2.5 text-xs font-black uppercase rounded-xl border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                      <span>View PDF</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleDownload(activePreviewPack);
                      setActivePreviewPack(null);
                    }}
                    className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 text-xs font-black uppercase rounded-xl border-[2px] border-[#0F172A] shadow-[3px_3px_0_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download Full Pack</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
