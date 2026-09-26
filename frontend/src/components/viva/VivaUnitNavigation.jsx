// frontend/src/components/viva/VivaUnitNavigation.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VivaUnitNavigation({
  sections = [],
  selectedSection,
  onSelectSection,
  questions = [],
  experiments = []
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Compute question counts per section dynamically
  const getSectionCount = (sectionName, sectionId) => {
    if (sectionId === 'practicals') {
      return experiments.length;
    }
    return questions.filter(
      (q) => q.section === sectionName || (q.section && q.section.toLowerCase().includes(sectionName.toLowerCase()))
    ).length;
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      {/* Mobile Accordion Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between bg-white border-2 border-black rounded-2xl px-4 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-black font-black text-sm active-press cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">menu_book</span>
            <span>Units &amp; Syllabus Modules</span>
          </div>
          <span className="material-symbols-outlined text-gray-600 transition-transform duration-200">
            {mobileOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Navigation Box (Permanent on desktop, Collapsible on mobile) */}
      <div className={`lg:block ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-[24px] p-4 sm:p-5 shadow-[5px_5px_0px_rgba(0,0,0,1)] sticky top-24">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black/10">
            <h3 className="font-black text-sm uppercase tracking-wider text-black flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-500">folder</span>
              Course Units
            </h3>
            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
              {sections.length} Sections
            </span>
          </div>

          {/* Section List */}
          <div className="flex flex-col gap-1.5">
            
            {/* "All Units" Option */}
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectSection('all');
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl font-black text-xs sm:text-sm text-left transition-all border-2 cursor-pointer ${
                selectedSection === 'all'
                  ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-[3px_3px_0px_#FBBF24]'
                  : 'bg-white hover:bg-[#FFFDF5] text-black border-transparent hover:border-black/20'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="material-symbols-outlined text-[18px]">apps</span>
                <span className="truncate">All Units &amp; Sections</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black border ${
                selectedSection === 'all'
                  ? 'bg-[#FBBF24] text-black border-black'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {questions.length}
              </span>
            </motion.button>

            {/* Dynamic Units / Sections */}
            {sections.map((section, idx) => {
              const isSelected = selectedSection === section.name || selectedSection === section.id;
              const count = getSectionCount(section.name, section.id);

              return (
                <motion.button
                  key={section.id || idx}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectSection(section.name);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs sm:text-sm text-left transition-all border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-[3px_3px_0px_#FBBF24] font-black'
                      : 'bg-white hover:bg-[#FFFDF5] text-gray-800 border-transparent hover:border-black/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate pr-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                      {section.type === 'practical' ? 'science' : 'article'}
                    </span>
                    <span className="truncate leading-snug">{section.name}</span>
                  </div>
                  
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-black shrink-0 border ${
                    isSelected
                      ? 'bg-[#FBBF24] text-black border-black'
                      : 'bg-[#FFF7E8] text-amber-900 border-amber-300'
                  }`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}

          </div>

          {/* Quick Syllabus Note Pill */}
          <div className="mt-4 pt-3 border-t border-black/10 text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
            <span>Aligned with University Course Structure</span>
          </div>

        </div>
      </div>
    </aside>
  );
}
