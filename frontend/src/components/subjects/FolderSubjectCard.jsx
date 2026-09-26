import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FOLDER_THEMES = {
  lime: { bg: '#c6f62b', frontBg: '#c6f62b', rightTabBg: '#fef08a' },
  emerald: { bg: '#4ade80', frontBg: '#4ade80', rightTabBg: '#dcfce7' },
  sky: { bg: '#38bdf8', frontBg: '#38bdf8', rightTabBg: '#e0f2fe' },
  yellow: { bg: '#facc15', frontBg: '#facc15', rightTabBg: '#fef9c3' },
  orange: { bg: '#fb923c', frontBg: '#fb923c', rightTabBg: '#ffedd5' },
  purple: { bg: '#c084fc', frontBg: '#c084fc', rightTabBg: '#f3e8ff' },
  pink: { bg: '#f472b6', frontBg: '#f472b6', rightTabBg: '#fce7f3' },
  blue: { bg: '#3b82f6', frontBg: '#3b82f6', rightTabBg: '#dbeafe' },
  green: { bg: '#22c55e', frontBg: '#22c55e', rightTabBg: '#dcfce7' },
  rose: { bg: '#f43f5e', frontBg: '#f43f5e', rightTabBg: '#ffe4e6' },
  cyan: { bg: '#22d3ee', frontBg: '#22d3ee', rightTabBg: '#cffafe' },
};

function getFolderTheme(pinColor, bgColor, index) {
  if (pinColor) {
    const key = pinColor.toLowerCase();
    if (FOLDER_THEMES[key]) return FOLDER_THEMES[key];
    if (pinColor.startsWith('#')) {
      return { bg: pinColor, frontBg: pinColor, rightTabBg: '#fef9c3' };
    }
  }
  if (bgColor && bgColor.startsWith('#')) {
    return { bg: bgColor, frontBg: bgColor, rightTabBg: '#fef9c3' };
  }
  const keys = Object.keys(FOLDER_THEMES);
  return FOLDER_THEMES[keys[index % keys.length]] || FOLDER_THEMES.lime;
}

/**
 * FolderSubjectCard
 * Compact, pixel-perfect folder card matching the TikTok Ops Visual / TT Localization Guidelines reference image.
 * Scaled appropriately for multi-card grid layouts.
 */
export default function FolderSubjectCard({ subject, index, semesterNumber = 5 }) {
  const navigate = useNavigate();

  // Helper to extract acronym or prominent title
  const getShortTitle = (title, code, shortForm) => {
    if (shortForm && shortForm.trim()) return shortForm.trim().toUpperCase();
    if (!title) return code || 'SUB';
    const words = title.split(' ').filter(w => !['and', 'of', '&', 'for', 'in', 'to'].includes(w.toLowerCase()));
    if (words.length >= 3 || title.length > 18) {
      return words.map(w => w[0]).join('').toUpperCase();
    }
    return title;
  };

  const shortTitle = getShortTitle(subject.title, subject.code, subject.shortForm);
  const isLongTitle = shortTitle.length >= 7;
  const titleSizeClass = isLongTitle
    ? 'text-lg sm:text-2xl lg:text-[28px]'
    : 'text-xl sm:text-3xl lg:text-[34px]';
  const theme = getFolderTheme(subject.pinColor, subject.bgColor, index);

  // Dynamic resource count computation
  const getResourceCount = () => {
    if (typeof subject?._count?.resources === 'number') {
      return subject._count.resources;
    }
    if (Array.isArray(subject?.resources)) {
      return subject.resources.length;
    }
    if (subject?.resourcesCount) {
      const match = String(subject.resourcesCount).match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return index !== undefined ? index + 1 : 0;
  };

  const resourceCount = getResourceCount();
  const formattedCount = resourceCount < 10 ? `0${resourceCount}+` : `${resourceCount}+`;
  const resourceLabel = `${resourceCount}+ ${resourceCount === 1 ? 'Resource' : 'Resources'}`;

  const handleCardClick = (e) => {
    if (!e.defaultPrevented && subject?.code) {
      navigate(`/subject/${subject.code.toLowerCase()}`);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }}
      dragElastic={0.12}
      whileHover={{ scale: 1.03, y: -5, zIndex: 40 }}
      whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: 'grabbing' }}
      onClick={handleCardClick}
      className="group relative w-full max-w-xs sm:max-w-sm mx-auto cursor-grab active:cursor-grabbing select-none my-3 sm:my-4"
    >
      {/* ─── Top Brand Header ─── */}
      <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-black/50 uppercase mb-1.5 px-1">
        <span>{subject.code || 'CE0516'}</span>
        <span>SEM 0{semesterNumber}</span>
      </div>

      {/* ─── Folder Vector & Interactive Container ─── */}
      <div className="relative w-full aspect-[400/280] [perspective:1000px] group/folder">

        {/* ─── 1. BACK FOLDER LAYER (Static Base) ─── */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full drop-shadow-[0_6px_12px_rgba(0,0,0,0.08)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Back Folder Body + Top Tab */}
            <path
              d="M 28 0 
                 H 150 
                 C 175 0, 185 24, 210 24 
                 H 372 
                 C 387 24, 398 35, 398 50 
                 V 252 
                 C 398 267, 387 278, 372 278 
                 H 28 
                 C 13 278, 2 267, 2 252 
                 V 26 
                 C 2 11, 13 0, 28 0 Z"
              fill={theme.bg}
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Dark inner shadow representing folder depth interior */}
            <path
              d="M 28 35 H 372 V 75 H 28 Z"
              fill="black"
              fillOpacity="0.12"
            />
          </svg>
        </div>

        {/* ─── 2. INNER PAPER SHEETS (Slide up out of folder on hover) ─── */}
        <div className="absolute inset-x-8 top-[18%] bottom-[20%] pointer-events-none z-10 overflow-visible">
          {/* Back Paper Sheet (Left tilted) */}
          <div className="absolute inset-x-3 top-0 h-32 bg-[#fffdfa] border-[2px] border-black rounded-t-lg shadow-sm transition-all duration-300 ease-out transform origin-bottom group-hover/folder:-translate-y-8 group-hover/folder:-rotate-4 group-hover/folder:scale-102 flex flex-col p-2 gap-1.5 opacity-90 group-hover/folder:opacity-100">
            <div className="w-12 h-1.5 bg-amber-400/80 rounded-full" />
            <div className="w-full h-1 bg-black/15 rounded-full" />
            <div className="w-3/4 h-1 bg-black/15 rounded-full" />
          </div>

          {/* Middle Paper Sheet (Right tilted) */}
          <div className="absolute inset-x-5 top-0 h-32 bg-[#fefce8] border-[2px] border-black rounded-t-lg shadow-md transition-all duration-300 ease-out delay-50 transform origin-bottom group-hover/folder:-translate-y-11 group-hover/folder:rotate-3 group-hover/folder:scale-102 flex flex-col p-2 gap-1.5 opacity-95 group-hover/folder:opacity-100">
            <div className="flex items-center justify-between">
              <div className="w-14 h-1.5 bg-sky-400/80 rounded-full" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black" />
            </div>
            <div className="w-full h-1 bg-black/20 rounded-full" />
            <div className="w-4/5 h-1 bg-black/20 rounded-full" />
            <div className="w-2/3 h-1 bg-black/20 rounded-full" />
          </div>

          {/* Front Paper Sheet (Syllabus / Exam Preview) */}
          <div className="absolute inset-x-7 top-0 h-32 bg-white border-[2px] border-black rounded-t-lg shadow-lg transition-all duration-300 ease-out delay-75 transform origin-bottom group-hover/folder:-translate-y-7 group-hover/folder:-rotate-1 flex flex-col p-2.5 gap-1.5">
            <div className="flex items-center justify-between border-b border-black/10 pb-1">
              <span className="text-[7px] font-black uppercase tracking-wider text-black/60">RESOURCES</span>
              <span className="text-[7px] font-bold text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">PDF</span>
            </div>
            <div className="w-full h-1 bg-black/25 rounded-full" />
            <div className="w-5/6 h-1 bg-black/20 rounded-full" />
          </div>
        </div>

        {/* ─── 3. FRONT COVER FLAP & CONTENT (Tilts forward in 3D on hover) ─── */}
        <div
          className="absolute inset-0 z-20 transition-all duration-300 ease-out origin-bottom transform group-hover/folder:[transform:rotateX(-24deg)_translateY(6px)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Flap SVG */}
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover/folder:drop-shadow-[0_18px_32px_rgba(0,0,0,0.22)] transition-all duration-300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Front cover flap path */}
            <path
              d="M 28 50 
                 H 372 
                 C 387 50, 398 61, 398 76 
                 V 252 
                 C 398 267, 387 278, 372 278 
                 H 28 
                 C 13 278, 2 267, 2 252 
                 V 76 
                 C 2 61, 13 50, 28 50 Z"
              fill={theme.frontBg}
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Inner Lip Gradient/Highlight */}
            <path
              d="M 29 52 H 371"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeOpacity="0.4"
            />
          </svg>

          {/* Center Typography & Content on Front Cover */}
          <div className="absolute inset-x-0 top-[22%] bottom-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none z-10">
            {/* Main Title with Italic Glyph Cutoff Protection */}
            <h2
              className={`font-black italic ${titleSizeClass} text-black tracking-tight leading-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] max-w-full px-2 py-0.5 truncate`}
              title={shortTitle}
            >
              <span className="inline-block pl-0.5 pr-3 sm:pr-4">
                {shortTitle}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="font-medium text-[10px] sm:text-xs text-black/80 mt-1 sm:mt-1.5 max-w-[92%] leading-tight tracking-tight line-clamp-2 break-words text-center">
              {subject.title}
            </p>

            {/* Resource Count Pill */}
            <span className="inline-block mt-1.5 sm:mt-2 text-[8px] sm:text-[10px] font-black tracking-wider text-black/70 bg-black/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-black/10 uppercase group-hover/folder:bg-black group-hover/folder:text-white transition-colors duration-300">
              {resourceLabel}
            </span>
          </div>
        </div>

        {/* ─── 4. Stacked Right-Side Vertical Tabs ─── */}
        <div className="absolute right-[1px] translate-x-full top-[56%] -translate-y-1/2 flex flex-col gap-1 z-30">
          {[
            { label: 'Syllabus', type: 'syllabus', hoverOffset: 'group-hover/folder:translate-x-1.5' },
            { label: 'Notes', type: 'notes', hoverOffset: 'group-hover/folder:translate-x-2.5' },
            { label: 'PYQs', type: 'pyqs', hoverOffset: 'group-hover/folder:translate-x-1.5' },
          ].map((tab, tIdx) => (
            <div
              key={tIdx}
              onClick={(e) => {
                e.stopPropagation();
                if (subject?.code) {
                  navigate(`/subject/${subject.code.toLowerCase()}?tab=${tab.type}`);
                }
              }}
              className={`px-1 py-1.5 sm:py-2 flex items-center justify-center bg-[#fef9c3] hover:bg-amber-300 cursor-pointer border border-l-0 border-black rounded-r-[5px] shadow-[1px_1px_0px_rgba(0,0,0,0.8)] transition-all duration-200 ${tab.hoverOffset}`}
              style={{ writingMode: 'vertical-rl' }}
              title={`View ${tab.label}`}
            >
              <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-black transform rotate-180 leading-none">
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* ─── 5. Bottom Left Glass Lens Ring Overlay ─── */}
        <div className="absolute left-[-8px] bottom-[-8px] z-40 pointer-events-none" title={resourceLabel}>
          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-[2px] border-white/90 bg-white/20 backdrop-blur-md shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,0,0,0.15)] flex items-center justify-center transform -rotate-12 group-hover/folder:scale-110 group-hover/folder:-translate-y-1 group-hover/folder:rotate-0 transition-all duration-300">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/60 flex items-center justify-center">
              <span className="font-extrabold text-black/70 text-[9px] sm:text-[11px] tracking-tighter">
                {formattedCount}
              </span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
