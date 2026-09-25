'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BannerStatus = 'success' | 'warning' | 'info' | 'error';
export type BannerVariant = 'light' | 'dark' | 'auto';

export interface BannerProps {
  status?: BannerStatus;
  variant?: BannerVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  isDismissable?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

interface StatusTheme {
  bg: string;
  border: string;
  iconColor: string;
  titleColor: string;
  descColor: string;
  closeColor: string;
  icon: React.ReactNode;
}

const LIGHT_THEMES: Record<BannerStatus, StatusTheme> = {
  success: {
    bg: 'bg-emerald-50/90 hover:bg-emerald-50',
    border: 'border-emerald-200/90',
    iconColor: 'text-emerald-600',
    titleColor: 'text-emerald-950',
    descColor: 'text-emerald-800/90',
    closeColor: 'text-emerald-600/60 hover:text-emerald-900',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-amber-50/90 hover:bg-amber-50',
    border: 'border-amber-200/90',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-950',
    descColor: 'text-amber-800/90',
    closeColor: 'text-amber-600/60 hover:text-amber-900',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-amber-600 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-sky-50/90 hover:bg-sky-50',
    border: 'border-sky-200/90',
    iconColor: 'text-sky-600',
    titleColor: 'text-sky-950',
    descColor: 'text-sky-800/90',
    closeColor: 'text-sky-600/60 hover:text-sky-900',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-sky-600 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-rose-50/90 hover:bg-rose-50',
    border: 'border-rose-200/90',
    iconColor: 'text-rose-600',
    titleColor: 'text-rose-950',
    descColor: 'text-rose-800/90',
    closeColor: 'text-rose-600/60 hover:text-rose-900',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-rose-600 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    ),
  },
};

const DARK_THEMES: Record<BannerStatus, StatusTheme> = {
  success: {
    bg: 'bg-[#18291d]',
    border: 'border-[#2c4b33]',
    iconColor: 'text-[#4ade80]',
    titleColor: 'text-[#86efac]',
    descColor: 'text-[#a7f3d0]/90',
    closeColor: 'text-[#86efac]/70 hover:text-[#86efac]',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-[#4ade80] mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-[#2b2411]',
    border: 'border-[#4d3f1c]',
    iconColor: 'text-[#fbbf24]',
    titleColor: 'text-[#fde047]',
    descColor: 'text-[#fef08a]/90',
    closeColor: 'text-[#fde047]/70 hover:text-[#fde047]',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-[#fbbf24] mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-[#1b2234]',
    border: 'border-[#2d3958]',
    iconColor: 'text-[#60a5fa]',
    titleColor: 'text-[#93c5fd]',
    descColor: 'text-[#bfdbfe]/90',
    closeColor: 'text-[#93c5fd]/70 hover:text-[#93c5fd]',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-[#60a5fa] mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-[#2d1919]',
    border: 'border-[#522929]',
    iconColor: 'text-[#f87171]',
    titleColor: 'text-[#fca5a5]',
    descColor: 'text-[#fecaca]/90',
    closeColor: 'text-[#fca5a5]/70 hover:text-[#fca5a5]',
    icon: (
      <svg
        className="w-5 h-5 shrink-0 text-[#f87171] mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    ),
  },
};

export function Banner({
  status = 'info',
  variant = 'light',
  title,
  description,
  isDismissable = false,
  onDismiss,
  className = '',
  children,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const themes = variant === 'dark' ? DARK_THEMES : LIGHT_THEMES;
  const config = themes[status] || themes.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`relative w-full rounded-2xl ${config.bg} border ${config.border} p-3.5 sm:p-4 shadow-2xs transition-all ${className}`}
        >
          <div className="flex items-start gap-3 pr-6">
            {config.icon}

            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`text-xs sm:text-sm font-bold leading-snug tracking-tight ${config.titleColor}`}>
                  {title}
                </h4>
              )}
              {description && (
                <p className={`text-[11px] sm:text-xs font-normal leading-relaxed mt-0.5 ${config.descColor}`}>
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>

          {isDismissable && (
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className={`absolute top-3.5 right-3.5 p-1 rounded-lg transition-colors cursor-pointer ${config.closeColor}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Banner;
