// src/components/common/StudyBuddyWidget.jsx
// Global Floating Productivity Hub for students:
// 1. Pomodoro Focus Study Timer (25m / 5m / 15m)
// 2. Saved Bookmarks & Notes Stash
// 3. Quick Note Request / Link Issue Desk

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TIMER_MODES = [
  { id: 'focus', label: '25m Focus', seconds: 25 * 60 },
  { id: 'short', label: '5m Break', seconds: 5 * 60 },
  { id: 'long', label: '15m Deep Rest', seconds: 15 * 60 },
];

export default function StudyBuddyWidget({ onOpenRequestModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timer'); // 'timer' | 'bookmarks' | 'actions'

  // Timer State
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ch_bookmarked_subjects');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  // Notification State
  const [completedNotice, setCompletedNotice] = useState(false);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setCompletedNotice(true);
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play();
            } catch (e) {
              console.error(e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleModeChange = (newMode) => {
    const selected = TIMER_MODES.find((m) => m.id === newMode);
    if (selected) {
      setMode(newMode);
      setIsRunning(false);
      setTimeLeft(selected.seconds);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const removeBookmark = (code) => {
    const next = bookmarks.filter((b) => b.code !== code);
    setBookmarks(next);
    localStorage.setItem('ch_bookmarked_subjects', JSON.stringify(next));
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[120] font-sans">
      {/* Floating Popover Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3 w-[calc(100vw-24px)] max-w-[340px] bg-[#FFFDF5] border-3 border-slate-900 rounded-3xl shadow-[6px_6px_0px_#0F172A] overflow-hidden"
          >
            {/* Header with Tabs */}
            <div className="p-3.5 border-b-2 border-slate-900 bg-[#FFFBEB] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('timer')}
                  className={`px-2.5 py-1 text-xs font-black rounded-xl border-2 transition-all cursor-pointer inline-flex items-center gap-1 ${
                    activeTab === 'timer'
                      ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_#0F172A]'
                      : 'bg-white text-slate-600 border-transparent hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>Focus</span>
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`px-2.5 py-1 text-xs font-black rounded-xl border-2 transition-all cursor-pointer inline-flex items-center gap-1 ${
                    activeTab === 'bookmarks'
                      ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_#0F172A]'
                      : 'bg-white text-slate-600 border-transparent hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">bookmark</span>
                  <span>Stash ({bookmarks.length})</span>
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-900 shadow-[1px_1px_0px_#0F172A] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Tab 1: Pomodoro Focus Timer */}
            {activeTab === 'timer' && (
              <div className="p-5 text-center space-y-4">
                {/* Mode Selector */}
                <div className="flex justify-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  {TIMER_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleModeChange(m.id)}
                      className={`px-2.5 py-1 text-[11px] font-black rounded-xl transition-all ${
                        mode === m.id
                          ? 'bg-white text-slate-950 border border-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-950'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Session Finished Notification Banner */}
                {completedNotice && (
                  <div className="p-3 bg-emerald-100 border-2 border-emerald-600 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between gap-2 animate-bounce">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">celebration</span>
                      <span>Great session! Take a short break.</span>
                    </div>
                    <button
                      onClick={() => setCompletedNotice(false)}
                      className="text-emerald-700 hover:text-emerald-900 text-sm font-black p-0.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                )}

                {/* Clock Display */}
                <div className="p-4 rounded-3xl bg-[#0F172A] text-amber-400 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]">
                  <p className="font-mono text-4xl font-black tracking-tight">{formatTime(timeLeft)}</p>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      {isRunning ? 'local_fire_department' : 'pause_circle'}
                    </span>
                    <span>{isRunning ? 'Focus In Progress' : 'Paused'}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setCompletedNotice(false);
                      setIsRunning(!isRunning);
                    }}
                    className={`flex-1 py-2.5 rounded-2xl border-2 border-slate-900 text-xs font-black shadow-[2px_2px_0px_#0F172A] transition-all cursor-pointer ${
                      isRunning
                        ? 'bg-rose-300 hover:bg-rose-400 text-slate-950'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                    }`}
                  >
                    {isRunning ? 'Pause Timer' : 'Start Focus'}
                  </button>

                  <button
                    onClick={() => {
                      setCompletedNotice(false);
                      setIsRunning(false);
                      const sel = TIMER_MODES.find((m) => m.id === mode);
                      if (sel) setTimeLeft(sel.seconds);
                    }}
                    className="p-2.5 rounded-2xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_#0F172A] cursor-pointer"
                    title="Reset"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Saved Bookmarks Stash */}
            {activeTab === 'bookmarks' && (
              <div className="p-4 space-y-2.5 max-h-60 overflow-y-auto">
                {bookmarks.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs font-bold">
                    <span className="material-symbols-outlined text-2xl text-slate-400">bookmark_border</span>
                    <p className="mt-1">No saved subjects yet.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Click the &quot;⭐ Bookmark&quot; button on any subject page to stash it here for quick access!
                    </p>
                  </div>
                ) : (
                  bookmarks.map((b) => (
                    <div
                      key={b.code}
                      className="p-2.5 rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0F172A] flex items-center justify-between gap-2"
                    >
                      <Link
                        to={`/subject/${b.code}`}
                        onClick={() => setIsOpen(false)}
                        className="min-w-0 flex-1 hover:text-amber-600 transition"
                      >
                        <p className="text-xs font-black text-slate-950 truncate">{b.title}</p>
                        <p className="text-[10px] font-bold text-slate-500">{b.code}</p>
                      </Link>

                      <button
                        onClick={() => removeBookmark(b.code)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Footer Quick Links */}
            <div className="p-2.5 border-t-2 border-slate-200 bg-[#FFFBEB] flex items-center justify-between text-[11px] font-bold text-slate-700 px-3">
              <Link
                to="/community"
                onClick={() => setIsOpen(false)}
                className="hover:text-amber-700 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-emerald-600">headphones</span>
                <span>Spotify Beats</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="hover:text-amber-700 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-600">campaign</span>
                <span>Request Notes</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black border-3 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xs">
          {isRunning ? (
            <span className="material-symbols-outlined text-[16px] animate-pulse">timer</span>
          ) : (
            <span className="material-symbols-outlined text-[16px]">bolt</span>
          )}
        </div>
        <span className="text-xs hidden sm:inline-block">
          {isRunning ? formatTime(timeLeft) : 'Study Suite'}
        </span>
        <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">
          {isOpen ? 'expand_more' : 'tune'}
        </span>
      </button>
    </div>
  );
}
