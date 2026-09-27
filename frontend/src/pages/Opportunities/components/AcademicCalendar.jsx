import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import thumbTackIcon from '../../Resources/thumb tack 2 plain.svg';

const ACADEMIC_EVENTS = {
  // --- JULY 2026 ---
  '2026-07-01': { type: 'TERM START', label: 'Term Start', color: 'bg-amber-300 text-amber-900 border border-amber-400 shadow-sm' },
  ...[2, 3, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31].reduce((acc, d) => ({
    ...acc, [`2026-07-${String(d).padStart(2, '0')}`]: { type: 'T', label: `Teaching Day (T${acc.idx++})` }
  }), { idx: 2 }),

  // --- AUGUST 2026 ---
  ...[3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 29].reduce((acc, d) => ({
    ...acc, [`2026-08-${String(d).padStart(2, '0')}`]: { type: 'T', label: `Teaching Day (T${acc.idx++})` }
  }), { idx: 26 }),
  '2026-08-15': { type: 'HOLIDAY', label: 'Independence Day', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' },
  '2026-08-28': { type: 'HOLIDAY', label: 'Raksha Bandhan', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' },

  // --- SEPTEMBER 2026 ---
  ...[1, 2, 3].reduce((acc, d) => ({
    ...acc, [`2026-09-${String(d).padStart(2, '0')}`]: { type: 'T', label: `Teaching Day (T${acc.idx++})` }
  }), { idx: 49 }),
  '2026-09-04': { type: 'HOLIDAY', label: 'Janmashtami', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' },
  '2026-09-15': { type: 'HOLIDAY', label: 'Samvatsari / Ganesh Chaturthi', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' },
  ...[7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 21, 22, 23, 24].reduce((acc, d) => ({
    ...acc, [`2026-09-${String(d).padStart(2, '0')}`]: { type: 'MID', label: 'Mid Semester Examination', color: 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm' }
  }), {}),
  ...[25, 26, 28, 29, 30].reduce((acc, d) => ({
    ...acc, [`2026-09-${String(d).padStart(2, '0')}`]: { type: 'MSE Remid', label: 'MSE Remedial', color: 'bg-purple-100 text-purple-800 border border-purple-300 shadow-sm' }
  }), {}),

  // --- OCTOBER 2026 ---
  ...[1, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 19].reduce((acc, d) => ({
    ...acc, [`2026-10-${String(d).padStart(2, '0')}`]: { type: 'MSE Remid', label: 'MSE Remedial', color: 'bg-purple-100 text-purple-800 border border-purple-300 shadow-sm' }
  }), {}),
  '2026-10-02': { type: 'HOLIDAY', label: 'Lal Bahadur Shastri Jayanti', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' },
  '2026-10-20': { type: 'HOLIDAY', label: 'Dussehra / Vijay Dashami', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' },
  '2026-10-24': { type: 'TERM END', label: 'Academic Term End', color: 'bg-[#0F172A] text-amber-400 border border-[#0F172A] shadow-md' },
  ...[26, 27, 28, 29, 30, 31].reduce((acc, d) => ({
    ...acc, [`2026-10-${String(d).padStart(2, '0')}`]: { type: 'ESE-PR', label: 'End Semester Exam — Practical', color: 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm' }
  }), {}),

  // --- NOVEMBER 2026 ---
  ...[2, 3, 4, 5].reduce((acc, d) => ({
    ...acc, [`2026-11-${String(d).padStart(2, '0')}`]: { type: 'ESE-PR', label: 'End Semester Exam — Practical', color: 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm' }
  }), {}),
  ...[6, 7, 8, 9, 10, 11, 12, 13].reduce((acc, d) => ({
    ...acc, [`2026-11-${String(d).padStart(2, '0')}`]: { type: 'HOLIDAY', label: 'Diwali Holiday', color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' }
  }), {}),
  ...[16, 17, 18, 19, 20, 23, 24, 25, 26, 27, 28, 30].reduce((acc, d) => ({
    ...acc, [`2026-11-${String(d).padStart(2, '0')}`]: { type: 'ESE-TH', label: 'End Semester Exam — Theory', color: 'bg-red-100 text-red-800 border border-red-300 shadow-sm' }
  }), {}),

  // --- DECEMBER 2026 ---
  ...[1, 2, 3, 4].reduce((acc, d) => ({
    ...acc, [`2026-12-${String(d).padStart(2, '0')}`]: { type: 'ESE-TH', label: 'End Semester Exam — Theory', color: 'bg-red-100 text-red-800 border border-red-300 shadow-sm' }
  }), {})
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AcademicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Default: Aug 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 10)); // Default: Aug 10 2026
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let lastKnownDateString = new Date().toLocaleDateString('en-CA');

    const updateToToday = (today) => {
      if (today.getFullYear() === 2026 && today.getMonth() >= 6 && today.getMonth() <= 11) {
        setCurrentDate(new Date(2026, today.getMonth(), 1));
        setSelectedDate(today);
      }
    };

    // 1. Initial setup on mount
    updateToToday(new Date());

    // 2. Poll every minute to detect midnight rollovers
    const intervalId = setInterval(() => {
      const now = new Date();
      const nowString = now.toLocaleDateString('en-CA');
      
      if (nowString !== lastKnownDateString) {
        lastKnownDateString = nowString;
        updateToToday(now);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    if (currentYear === 2026 && currentMonth === 6) return; // Stop at July
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (currentYear === 2026 && currentMonth === 11) return; // Stop at Dec
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate Calendar Grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells = [];
    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateString: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i).toLocaleDateString('en-CA')
      });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        dateString: new Date(currentYear, currentMonth, i).toLocaleDateString('en-CA')
      });
    }
    // Next month padding (to complete 42 cells, i.e. 6 rows)
    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        dateString: new Date(currentYear, currentMonth + 1, i).toLocaleDateString('en-CA')
      });
    }
    return cells;
  }, [currentMonth, currentYear, daysInMonth, firstDayOfMonth, daysInPrevMonth]);

  const selectedDateString = selectedDate.toLocaleDateString('en-CA');
  const selectedEventInfo = ACADEMIC_EVENTS[selectedDateString];

  const getEventBadge = (eventInfo) => {
    if (!eventInfo) return null;
    if (eventInfo.type === 'T') {
      return <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-300" />;
    }
    
    let badgeText = eventInfo.type;
    if (badgeText === 'TERM START') badgeText = 'START';
    else if (badgeText === 'TERM END') badgeText = 'END';
    else if (badgeText === 'MSE Remid') badgeText = 'MSE';
    else badgeText = badgeText.split('-')[0];

    return (
      <div className={`absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 text-[5.5px] sm:text-[6.5px] font-black px-0.5 rounded-[3px] text-center leading-tight tracking-tighter w-11/12 max-w-fit truncate ${eventInfo.color}`}>
        {badgeText}
      </div>
    );
  };

  return (
    <div className="relative mt-8 md:mt-10 group">
      {/* Push Pin */}
      <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 group-hover:-translate-y-1">
        <img
          src={thumbTackIcon}
          alt="Push Pin"
          className="w-[75px] h-[75px] object-contain drop-shadow-[0_8px_6px_rgba(0,0,0,0.4)]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, rotateZ: -1 }}
        animate={{ opacity: 1, y: 0, rotateZ: -1 }}
        whileHover={{ rotateZ: 0, scale: 1.01 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="bg-white rounded-[24px] shadow-[5px_5px_0_#0F172A] border-[2.5px] border-[#0F172A] relative overflow-hidden"
      >
        {/* Header Block */}
        <div className="bg-[#0F172A] px-5 py-4 flex justify-between items-end border-b-[3px] border-[#0F172A] relative text-white">
          <div className="flex gap-1 items-center relative z-10">
            <button onClick={handlePrevMonth} disabled={currentYear === 2026 && currentMonth === 6} className="text-white/70 hover:text-white transition-colors disabled:opacity-30 p-1 cursor-pointer">
              <span className="material-symbols-outlined text-[28px]">chevron_left</span>
            </button>
            <span className="text-5xl md:text-6xl font-black text-[#FEF08A] tracking-tighter drop-shadow-md leading-none">
              {currentMonth + 1}
            </span>
            <button onClick={handleNextMonth} disabled={currentYear === 2026 && currentMonth === 11} className="text-white/70 hover:text-white transition-colors disabled:opacity-30 p-1 cursor-pointer">
              <span className="material-symbols-outlined text-[28px]">chevron_right</span>
            </button>
          </div>

          <div className="flex gap-1 items-center relative z-10">
            <span className="text-2xl md:text-3xl font-black text-white/90 drop-shadow-sm tracking-tight leading-none mb-1">
              {currentYear}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 bg-white">
          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((day, idx) => (
              <div key={idx} className="text-center text-[10px] md:text-[11px] font-black text-red-500/80 tracking-widest uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 border-t border-l border-amber-900/10 bg-[#fdfcf8]">
            <AnimatePresence mode="popLayout">
              {calendarCells.map((cell, idx) => {
                const isSelected = cell.dateString === selectedDateString;
                const eventInfo = ACADEMIC_EVENTS[cell.dateString];

                return (
                  <motion.div
                    key={`${currentMonth}-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-r border-amber-900/10 aspect-[1/1.15] flex flex-col justify-start items-center p-0.5 sm:p-1 relative group/cell min-w-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const [y, m, d] = cell.dateString.split('-');
                        setSelectedDate(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
                        if (!cell.isCurrentMonth) {
                          setCurrentDate(new Date(parseInt(y), parseInt(m) - 1, 1));
                        }
                        setIsModalOpen(true);
                      }}
                      className={`relative cursor-pointer w-full h-full flex flex-col items-center justify-start pt-1 sm:pt-1.5 transition-colors min-w-0
                        ${isSelected ? 'z-10' : 'group-hover/cell:bg-amber-50 rounded-lg'}
                        ${!cell.isCurrentMonth && !isSelected ? 'opacity-30' : ''}
                      `}
                    >
                      {/* Hand-drawn style circle for selection */}
                      {isSelected && (
                        <div className="absolute inset-0 border-[2.5px] border-amber-500 rounded-[50%_40%_60%_45%/45%_55%_40%_50%] bg-amber-500/5 pointer-events-none scale-[1.15]"></div>
                      )}

                      <span className={`text-[13px] sm:text-[15px] leading-none mb-0.5 z-10 ${isSelected ? 'font-black text-amber-600' : (cell.isCurrentMonth ? 'font-bold text-gray-700' : 'font-medium text-gray-500')}`}>
                        {cell.day}
                      </span>
                      {getEventBadge(eventInfo)}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-5 flex justify-center items-center px-1 pb-1">
            <span
              style={{ fontFamily: '"Grindy Brush", sans-serif' }}
              className="text-[22px] whitespace-nowrap text-gray-400/80 -rotate-2 transform tracking-wide"
            >
              Academic Calendar
            </span>
          </div>
        </div>
      </motion.div>

      {/* Selected Date Details Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FDFBF7] rounded-[24px] p-6 md:p-7 max-w-sm w-full shadow-[8px_8px_0_#0F172A] relative overflow-hidden border-[3px] border-[#0F172A] overscroll-contain"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white hover:bg-red-500 hover:text-white text-[#0F172A] border-[1.5px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center transition-all cursor-pointer z-20"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="text-xs font-black text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-1.5 relative z-10">
                  <span className="material-symbols-outlined text-[16px] text-[#FF5722]">event_available</span>
                  <span>{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                <div className="relative z-10">
                  {selectedEventInfo && selectedEventInfo.type !== 'T' ? (
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-[6px] text-xs font-black uppercase mb-3 shadow-sm ${selectedEventInfo.color}`}>
                        {selectedEventInfo.type}
                      </span>
                      <h3 className="font-headline-md text-2xl font-black text-black leading-tight mb-2">
                        {selectedEventInfo.label}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm">
                        Official academic event marked for this date.
                      </p>
                    </div>
                  ) : selectedEventInfo && selectedEventInfo.type === 'T' ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Regular Day</span>
                      </div>
                      <h3 className="font-headline-md text-2xl font-black text-black leading-tight mb-2">
                        {selectedEventInfo.label}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm">
                        Classes will proceed as per the regular timetable.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">event_busy</span>
                        <span className="text-xs font-black uppercase tracking-wider">No Event</span>
                      </div>
                      <h3 className="font-headline-md text-2xl font-black text-gray-400 leading-tight mb-2">
                        No Major Event
                      </h3>
                      <p className="text-gray-500 font-medium text-sm">
                        There are no special academic events or holidays marked for this date.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
