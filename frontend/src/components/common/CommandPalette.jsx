// src/components/common/CommandPalette.jsx
// Global Quick Search & Command Palette (Ctrl+K / Cmd+K).
// Enables instant keyboard-driven jump to any semester, subject, resource type, or action.

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { semestersData } from '../../data/semestersData';

const MAIN_PAGES = [
  { id: 'page-home', title: 'Home', subtitle: 'Main landing page & search portal', path: '/', icon: 'home', category: 'Pages' },
  { id: 'page-resources', title: 'Academic Resources Vault', subtitle: 'Browse departments and semesters', path: '/resources', icon: 'folder_open', category: 'Pages' },
  { id: 'page-semesters', title: 'Computer Engineering (CE)', subtitle: 'All 8 Semesters hierarchy', path: '/semesters', icon: 'school', category: 'Pages' },
  { id: 'page-opps', title: 'Opportunities & Alerts', subtitle: 'Internships, Hackathons, Scholarships', path: '/opportunities', icon: 'work', category: 'Pages' },
  { id: 'page-community', title: 'Community & Referendum', subtitle: 'Quad noticeboard, live voting, Spotify beats', path: '/community', icon: 'forum', category: 'Pages' },
  { id: 'page-about', title: 'About CampusHub', subtitle: 'Mission, rankers & verified contributors', path: '/about', icon: 'info', category: 'Pages' },
  { id: 'page-contact', title: 'Contact & Requests', subtitle: 'Request missing notes or ask questions', path: '/contact', icon: 'mail', category: 'Pages' },
];

const QUICK_ACTIONS = [
  { id: 'act-spotify', title: 'Play Spotify Study Beats', subtitle: 'Open Lo-Fi & focus soundscapes', path: '/community', icon: 'headphones', category: 'Actions', external: false },
  { id: 'act-vote', title: 'Cast Referendum Vote', subtitle: 'Vote on next exam vault drops', path: '/community', icon: 'how_to_vote', category: 'Actions', external: false },
  { id: 'act-wa', title: 'Join WhatsApp Community', subtitle: 'Official Indus University Broadcast', path: 'https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB', icon: 'chat', category: 'Actions', external: true },
  { id: 'act-tg', title: 'Join Telegram Channel', subtitle: 'Daily notes & doubt lounge', path: 'https://t.me/+fP4hKU69AQIwZjI1', icon: 'send', category: 'Actions', external: true },
];

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 30,
    },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.12 } },
};

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  // Aggregate all searchable items
  const allItems = useMemo(() => {
    const items = [];

    // Semesters
    semestersData.forEach((sem) => {
      items.push({
        id: `sem-${sem.id}`,
        title: sem.name,
        subtitle: `${sem.subjects.length} core engineering subjects`,
        path: `/semesters/${sem.id}`,
        icon: 'menu_book',
        category: 'Semesters',
      });

      // Subjects within semester
      sem.subjects.forEach((sub) => {
        items.push({
          id: `sub-${sub.code}`,
          title: `${sub.title} (${sub.code})`,
          subtitle: `${sem.name} · ${sub.description}`,
          path: `/subject/${sub.code}`,
          icon: 'description',
          category: 'Subjects',
        });
      });
    });

    // Pages & Actions
    items.push(...MAIN_PAGES);
    items.push(...QUICK_ACTIONS);

    return items;
  }, []);

  // Filter based on query
  const filtered = useMemo(() => {
    if (!query.trim()) {
      return [
        ...MAIN_PAGES.slice(0, 4),
        ...allItems.filter((i) => i.category === 'Semesters'),
        ...QUICK_ACTIONS,
      ];
    }
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query, allItems]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Smooth scroll selected item into view on keyboard navigation
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    onClose();
    if (item.external) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.path);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-2xl bg-[#FFFDF5] border-3 border-slate-900 rounded-3xl shadow-[8px_8px_0px_#0F172A] overflow-hidden z-10"
        >
          {/* Search Header Bar */}
          <div className="p-4 sm:p-5 border-b-3 border-slate-900 bg-[#FFFBEB] flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500 text-[26px]">search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search subjects, semesters, PYQs, books, or quick actions..."
              className="flex-1 bg-transparent border-none text-sm sm:text-base font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-white border border-slate-300 rounded text-slate-500 shadow-2xs">
              ESC
            </kbd>
          </div>

          {/* Results List without Scrollbar and with Smooth Animation */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="max-h-[60vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth p-3 sm:p-4 space-y-1.5"
          >
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center text-slate-500 font-bold text-sm"
              >
                <span className="material-symbols-outlined text-3xl mb-1 text-slate-400">search_off</span>
                <p>No matching resources or subjects found for &quot;{query}&quot;</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Try searching by subject code (e.g. TOC, CN, DBMS) or semester number.
                </p>
              </motion.div>
            ) : (
              filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <motion.div
                    key={item.id}
                    ref={(el) => (itemRefs.current[index] = el)}
                    variants={itemVariants}
                    layout
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-amber-400 border-slate-900 shadow-[3px_3px_0px_#0F172A] translate-x-1'
                        : 'border-transparent hover:bg-amber-50 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#0F172A] transition-colors ${
                          isSelected ? 'bg-white text-slate-950 scale-105' : 'bg-amber-100 text-slate-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black text-slate-950 truncate">
                          {item.title}
                        </p>
                        <p className={`text-[11px] truncate font-medium transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-slate-900 transition-colors ${
                          isSelected ? 'bg-white text-slate-950 shadow-2xs' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.category}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="material-symbols-outlined text-slate-950 text-[18px]"
                        >
                          keyboard_return
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Footer Shortcuts Help */}
          <div className="p-3 border-t-2 border-slate-200 bg-[#FFFBEB] flex items-center justify-between text-[11px] font-bold text-slate-600 px-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[9px] shadow-2xs">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[9px] shadow-2xs">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[9px] shadow-2xs">↵</kbd>
                Select
              </span>
            </div>
            <span className="text-amber-800 font-extrabold flex items-center gap-1">
              ⚡ CampusHub Quick Command
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
