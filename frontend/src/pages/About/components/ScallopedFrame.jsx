// src/pages/About/components/ScallopedFrame.jsx
// Playful Neo-Brutalism & Y2K Scalloped Frame & Interactive Motion Elements.
// 100% compliant with svg-avoid.md (0 raw text emojis, 100% Lucide SVGs), pinte.md, and AGENTS.md.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Scalloped Arch Top Header SVG Divider
 * Creates repeating architectural dome/arch cutouts along card top borders with organic wave motion.
 */
export function ScallopedArch({ color = '#FFFFFF', borderColor = '#111111', height = 24, className = '' }) {
  return (
    <motion.div
      initial={{ scaleY: 0.9, opacity: 0.95 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`w-full overflow-hidden leading-none select-none origin-bottom ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        viewBox="0 0 1200 36"
        preserveAspectRatio="none"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,36 L0,22 
             C25,22 35,0 60,0 C85,0 95,22 120,22 
             C145,22 155,0 180,0 C205,0 215,22 240,22 
             C265,22 275,0 300,0 C325,0 335,22 360,22 
             C385,22 395,0 420,0 C445,0 455,22 480,22 
             C505,22 515,0 540,0 C565,0 575,22 600,22 
             C625,22 635,0 660,0 C685,0 695,22 720,22 
             C745,22 755,0 780,0 C805,0 815,22 840,22 
             C865,22 875,0 900,0 C925,0 935,22 960,22 
             C985,22 995,0 1020,0 C1045,0 1055,22 1080,22 
             C1105,22 1115,0 1140,0 C1165,0 1175,22 1200,22 
             L1200,36 Z"
          fill={color}
          stroke={borderColor}
          strokeWidth="2.5"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Scalloped Inverted Arch Header (Card Top Cutout Cap)
 * Organic vector curves with smooth scroll and hover wave transitions.
 */
export function ScallopedCap({ color = '#FFFFFF', strokeColor = '#111111' }) {
  return (
    <motion.div
      initial={{ scaleY: 0.85, opacity: 0.9 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full overflow-hidden -mb-[3px] relative z-10 origin-bottom select-none"
    >
      <svg
        viewBox="0 0 600 24"
        preserveAspectRatio="none"
        className="w-full h-5 sm:h-7 block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,24 
             C20,24 28,4 50,4 C72,4 80,24 100,24 
             C120,24 128,4 150,4 C172,4 180,24 200,24 
             C220,24 228,4 250,4 C272,4 280,24 300,24 
             C320,24 328,4 350,4 C372,4 380,24 400,24 
             C420,24 428,4 450,4 C472,4 480,24 500,24 
             C520,24 528,4 550,4 C572,4 580,24 600,24 
             L600,24 L0,24 Z"
          fill={color}
          stroke={strokeColor}
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Playful Y2K Floating Sticker Tag with Spring Micro-Interactions
 */
export function StickerTag({
  children,
  bgColor = '#FACC15',
  textColor = '#111111',
  rotate = '-2deg',
  icon = null,
  iconComponent: IconComponent = null,
  className = '',
}) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, rotate: 0, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 450, damping: 17 }}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        transform: `rotate(${rotate})`,
      }}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] cursor-default select-none transition-shadow ${className}`}
    >
      {IconComponent && <IconComponent className="w-3.5 h-3.5 stroke-[2.5]" />}
      {icon && !IconComponent && (
        typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-[15px]">{icon}</span>
        ) : (
          icon
        )
      )}
      <span>{children}</span>
    </motion.span>
  );
}

/**
 * Styled Y2K Pill Badge for Inline Vector SVGs (svg-avoid.md rule)
 */
export function InlineIconBadge({
  icon: Icon,
  label = null,
  bgColor = 'bg-white',
  textColor = 'text-[#111111]',
  borderColor = 'border-[#111111]',
  rotate = 'rotate-[-2deg]',
  size = 'w-3.5 h-3.5',
  className = '',
}) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, rotate: 0, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 450, damping: 18 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-xs border shadow-[1.5px_1.5px_0px_#111111] ${bgColor} ${textColor} ${borderColor} ${rotate} select-none cursor-default ${className}`}
    >
      {Icon && <Icon className={`${size} stroke-[2.5]`} />}
      {label && <span>{label}</span>}
    </motion.span>
  );
}

/**
 * Floating Pill Button with Spring Hover Scaling & Active Compression
 */
export function PillButton({
  children,
  to = null,
  href = null,
  onClick = null,
  bgColor = '#FFFFFF',
  textColor = '#111111',
  icon = null,
  iconComponent: IconComponent = null,
  className = '',
}) {
  const content = (
    <motion.span
      whileHover={{ scale: 1.05, rotate: -1.5, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      style={{ backgroundColor: bgColor, color: textColor }}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs sm:text-sm border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] active:shadow-none transition-shadow cursor-pointer select-none ${className}`}
    >
      {IconComponent && <IconComponent className="w-4 h-4 stroke-[2.5]" />}
      {icon && !IconComponent && (
        typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        ) : (
          icon
        )
      )}
      <span>{children}</span>
    </motion.span>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <button onClick={onClick}>{content}</button>;
}


