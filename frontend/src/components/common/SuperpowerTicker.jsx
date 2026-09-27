import React from 'react';
import { motion } from 'framer-motion';

const DEFAULT_SUPERPOWERS = [
  { text: '100% Free & Open Access', icon: '🌐', color: 'bg-[#BAE6FD] text-[#0369A1]' },
  { text: 'Official Indus Syllabus 2024-25', icon: '🎓', color: 'bg-[#FEF08A] text-[#713F12]' },
  { text: 'OCR-Verified Clean Notes', icon: '⚡', color: 'bg-[#BBF7D0] text-[#14532D]' },
  { text: 'Solved Previous Year Papers', icon: '📝', color: 'bg-[#FED7AA] text-[#7C2D12]' },
  { text: 'Live Exam Countdown Clock', icon: '⏳', color: 'bg-[#FBCFE8] text-[#831843]' },
  { text: 'Oral Viva Prep Question Bank', icon: '💡', color: 'bg-[#E9D5FF] text-[#581C87]' },
  { text: 'Predictive SGPA & CGPA Tool', icon: '🧮', color: 'bg-[#BAE6FD] text-[#0369A1]' },
  { text: 'Curated Campus Job Drives', icon: '💼', color: 'bg-[#FEF08A] text-[#713F12]' },
  { text: 'Top National Hackathons Radar', icon: '🏆', color: 'bg-[#BBF7D0] text-[#14532D]' },
  { text: 'Direct High-Speed Downloads', icon: '🚀', color: 'bg-[#FED7AA] text-[#7C2D12]' },
];

const COLOR_MAP = {
  orange: 'bg-[#FFEDD5] text-[#9A3412]',
  blue: 'bg-[#DBEAFE] text-[#1E40AF]',
  green: 'bg-[#DCFCE7] text-[#166534]',
  purple: 'bg-[#F3E8FF] text-[#6B21A8]',
  yellow: 'bg-[#FEF9C3] text-[#854D0E]',
  pink: 'bg-[#FCE7F3] text-[#9D174D]',
  sky: 'bg-[#E0F2FE] text-[#0369A1]',
  amber: 'bg-[#FEF3C7] text-[#92400E]',
  red: 'bg-[#FEE2E2] text-[#991B1B]',
};

function resolveItemColor(color) {
  if (!color) return 'bg-[#FEF9C3] text-[#854D0E]';
  if (COLOR_MAP[color]) return COLOR_MAP[color];
  if (typeof color === 'string' && color.includes('bg-')) return color;
  return 'bg-[#FEF9C3] text-[#854D0E]';
}

function resolveItemIcon(icon) {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'string') {
    // If emoji
    if (/\p{Extended_Pictographic}/u.test(icon)) {
      return <span className="text-base leading-none">{icon}</span>;
    }
    // If Material Symbol name
    return (
      <span className="material-symbols-outlined text-[17px] leading-none shrink-0">
        {icon}
      </span>
    );
  }
  if (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon !== null && (icon.$$typeof || icon.render))
  ) {
    const IconComp = icon;
    return <IconComp className="w-4 h-4 shrink-0" />;
  }
  return null;
}

/**
 * SuperpowerTicker — Infinite Interactive Marquee Ticker with Animated Color Chips
 * Directly ported and elevated from Lofty Lab / Framer Agency interaction design.
 * Features auto-scrolling chips with hover-scale, spring physics, and pause-on-hover.
 */
export default function SuperpowerTicker({
  items = DEFAULT_SUPERPOWERS,
  speed = 45,
  direction = 'left',
  title = 'CAMPUS SUPERPOWERS',
  className = '',
}) {
  const renderChipTrack = (prefix) => (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4 py-2 pr-3 sm:pr-4">
      {items.map((item, idx) => {
        const displayText = item.text || item.label || item.title || '';
        const colorClasses = resolveItemColor(item.color);
        return (
          <motion.div
            key={`${prefix}-${idx}`}
            whileHover={{ scale: 1.08, rotate: idx % 2 === 0 ? -1.5 : 1.5, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:shadow-[4px_4px_0_#0F172A] text-xs sm:text-sm font-black uppercase tracking-wide cursor-pointer transition-shadow select-none whitespace-nowrap ${colorClasses}`}
          >
            {resolveItemIcon(item.icon)}
            <span>{displayText}</span>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className={`w-full overflow-hidden select-none relative z-10 ${className}`}>
      {title && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
          <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#0F172A]">
            {title}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
        </div>
      )}

      <div className="relative w-full overflow-hidden group">
        {/* Soft edge gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track with CSS Animation */}
        <div
          className={`flex w-max animate-marquee group-hover:[animation-play-state:paused] ${
            direction === 'right' ? 'direction-reverse' : ''
          }`}
          style={{ animationDuration: `${speed}s` }}
        >
          {renderChipTrack('track-1')}
          {renderChipTrack('track-2')}
          {renderChipTrack('track-3')}
          {renderChipTrack('track-4')}
        </div>
      </div>
    </div>
  );
}
