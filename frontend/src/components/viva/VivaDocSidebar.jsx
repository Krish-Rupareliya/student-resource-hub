// frontend/src/components/viva/VivaDocSidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { semestersData } from '../../data/semestersData';

/**
 * Documentation-style Left Sidebar
 * Displays Semesters, Subjects, and Units hierarchy matching the reference layout.
 */
export default function VivaDocSidebar({
  currentSubjectCode,
  currentSemesterNumber = 5,
  currentSectionId,
  sections = [],
  onSelectSection,
  mobileOpen = false,
  onCloseMobile,
}) {
  const navigate = useNavigate();
  const [expandedSemester, setExpandedSemester] = useState(currentSemesterNumber);
  const [filterQuery, setFilterQuery] = useState('');

  // Find all subjects in current semester
  const currentSemester = semestersData.find((s) => s.id === currentSemesterNumber) || {
    id: 5,
    name: 'Semester 5',
    subjects: [
      { code: 'CE0518', title: 'Computer Networks' },
      { code: 'CE0517', title: 'Microprocessor and Interfacing' },
      { code: 'CE0516', title: 'Design and Analysis of Algorithms' },
      { code: 'CE0525', title: 'Programming for Scientific Computing' },
      { code: 'CE0522', title: 'Web Technology' },
    ],
  };

  const normalizedCurrentCode = (currentSubjectCode || 'CE0518').toUpperCase();

  const handleSubjectChange = (subjectCode) => {
    navigate(`/subject/${subjectCode.toLowerCase()}/viva`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSectionClick = (sectionId) => {
    onSelectSection(sectionId);
    if (onCloseMobile) onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSections = filterQuery.trim()
    ? sections.filter((s) => s.name.toLowerCase().includes(filterQuery.toLowerCase()))
    : sections;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 z-50 lg:z-10 h-screen lg:h-[calc(100vh-5rem)] w-72 shrink-0 bg-white lg:bg-slate-50/70 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">menu_book</span>
            <span className="font-bold text-gray-900 text-sm">Course Navigation</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search / Filter in Sidebar */}
        <div className="p-3 border-b border-gray-200/80 bg-white/50">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Filter units..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Tree Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-xs font-medium">
          {/* Active Semester Section */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 text-gray-400 uppercase tracking-wider text-[11px] font-bold">
              <span>{currentSemester.name}</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">Active</span>
            </div>

            {/* Subjects in Current Semester */}
            <div className="mt-1 space-y-1">
              {currentSemester.subjects.map((subj) => {
                const isCurrentSubject = subj.code.toUpperCase() === normalizedCurrentCode;

                return (
                  <div key={subj.code} className="space-y-0.5">
                    {/* Subject Row */}
                    <button
                      onClick={() => handleSubjectChange(subj.code)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isCurrentSubject
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium'
                      }`}
                    >
                      <span className="truncate pr-1">{subj.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200/70 text-gray-600 font-mono shrink-0">
                        {subj.code}
                      </span>
                    </button>

                    {/* If this is the active subject, show its Units tree */}
                    {isCurrentSubject && (
                      <div className="pl-3 ml-2 border-l border-blue-200 space-y-0.5 my-1">
                        {filteredSections.map((sec, idx) => {
                          const isSecActive = currentSectionId === sec.id;
                          return (
                            <button
                              key={sec.id}
                              onClick={() => handleSectionClick(sec.id)}
                              className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer text-[12px] leading-snug ${
                                isSecActive
                                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50/50'
                              }`}
                            >
                              <span className="truncate">{sec.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gray-200 my-2" />

          {/* Quick links to Other Semesters */}
          <div>
            <div className="px-2 py-1 text-gray-400 uppercase tracking-wider text-[11px] font-bold">
              Other Semesters
            </div>
            <div className="mt-1 space-y-0.5">
              {[1, 2, 3, 4, 6].map((semNum) => (
                <Link
                  key={semNum}
                  to={`/semesters`}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <span>Semester {semNum}</span>
                  <span className="material-symbols-outlined text-[14px] text-gray-400">chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-gray-200 bg-white/70 text-[11px] text-gray-500">
          <Link
            to={`/subject/${normalizedCurrentCode.toLowerCase()}`}
            className="flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            Back to Subject Home
          </Link>
        </div>
      </aside>
    </>
  );
}
