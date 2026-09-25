// src/pages/Admin/components/NeoDatePicker.jsx
// Interactive Neo-Brutalist Date & Time Picker for Admin Semester Clock.

import React, { useState, useEffect } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function NeoDatePicker({ value, onChange }) {
  // Parse incoming ISO value or fallback to current date
  const selectedDate = value ? new Date(value) : new Date();
  const validDate = isNaN(selectedDate.getTime()) ? new Date() : selectedDate;

  const [viewYear, setViewYear] = useState(validDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(validDate.getMonth());
  const [hours, setHours] = useState(
    validDate.getHours() % 12 === 0 ? 12 : validDate.getHours() % 12
  );
  const [minutes, setMinutes] = useState(
    String(validDate.getMinutes()).padStart(2, '0')
  );
  const [ampm, setAmpm] = useState(validDate.getHours() >= 12 ? 'PM' : 'AM');
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Sync state if external value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        setHours(d.getHours() % 12 === 0 ? 12 : d.getHours() % 12);
        setMinutes(String(d.getMinutes()).padStart(2, '0'));
        setAmpm(d.getHours() >= 12 ? 'PM' : 'AM');
      }
    }
  }, [value]);

  // Helper to commit date & time change
  const emitChange = (year, month, day, h, m, period) => {
    let hour24 = parseInt(h, 10);
    if (period === 'PM' && hour24 < 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;

    const newDate = new Date(year, month, day, hour24, parseInt(m, 10) || 0, 0);
    onChange(newDate.toISOString());
  };

  // Days in current view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDaySelect = (day) => {
    emitChange(viewYear, viewMonth, day, hours, minutes, ampm);
  };

  const handleTimeChange = (newH, newM, newAmpm) => {
    setHours(newH);
    setMinutes(newM);
    setAmpm(newAmpm);
    emitChange(
      validDate.getFullYear(),
      validDate.getMonth(),
      validDate.getDate(),
      newH,
      newM,
      newAmpm
    );
  };

  // Quick Presets
  const applyPresetDays = (daysCount, labelHour = 10, labelMin = '30', labelPeriod = 'AM') => {
    const target = new Date(Date.now() + daysCount * 86400000);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setHours(labelHour);
    setMinutes(labelMin);
    setAmpm(labelPeriod);
    emitChange(
      target.getFullYear(),
      target.getMonth(),
      target.getDate(),
      labelHour,
      labelMin,
      labelPeriod
    );
  };

  // Format display string
  const formattedTargetStr = validDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;

  // Calculate days remaining
  const daysRemaining = Math.ceil((validDate.getTime() - Date.now()) / 86400000);

  return (
    <div className="space-y-4 bg-slate-50 border-[2.5px] border-[#0F172A] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#0F172A]">
      {/* Header Banner with formatted date & trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-[2px] border-[#0F172A] p-3.5 rounded-xl shadow-[2px_2px_0_#0F172A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDE047] border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#0F172A] text-[22px]">calendar_month</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Selected Target Exam Date:
            </span>
            <p className="text-sm sm:text-base font-black text-[#0F172A] leading-tight">
              {formattedTargetStr} @ {formattedTimeStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md border border-[#0F172A] shadow-[1.5px_1.5px_0_#0F172A] ${
              daysRemaining > 0
                ? 'bg-[#BBF7D0] text-[#14532D]'
                : 'bg-[#FFDAD6] text-[#93000A]'
            }`}
          >
            {daysRemaining > 0 ? `In ${daysRemaining} Days` : 'Date Passed / Today'}
          </span>
        </div>
      </div>

      {/* Main Interactive Date Picker Grid & Time Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Calendar Matrix (Left Col) */}
        <div className="md:col-span-7 bg-white border-[2px] border-[#0F172A] p-4 rounded-xl shadow-[2px_2px_0_#0F172A] space-y-3">
          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="px-2 py-1 bg-slate-100 border border-[#0F172A] rounded font-black text-xs text-[#0F172A] cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="px-2 py-1 bg-slate-100 border border-[#0F172A] rounded font-black text-xs text-[#0F172A] cursor-pointer"
              >
                {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded border border-[#0F172A] bg-slate-100 hover:bg-[#FDE047] flex items-center justify-center font-black text-xs cursor-pointer shadow-[1px_1px_0_#0F172A] active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Previous Month"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded border border-[#0F172A] bg-slate-100 hover:bg-[#FDE047] flex items-center justify-center font-black text-xs cursor-pointer shadow-[1px_1px_0_#0F172A] active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Next Month"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((d, i) => (
              <span
                key={i}
                className={`text-[10px] font-black uppercase py-1 ${
                  i === 0 ? 'text-red-500' : 'text-slate-500'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Day buttons */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected =
                validDate.getFullYear() === viewYear &&
                validDate.getMonth() === viewMonth &&
                validDate.getDate() === dayNum;

              const isToday =
                new Date().getFullYear() === viewYear &&
                new Date().getMonth() === viewMonth &&
                new Date().getDate() === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleDaySelect(dayNum)}
                  className={`h-8 rounded-lg font-black text-xs transition cursor-pointer flex items-center justify-center relative ${
                    isSelected
                      ? 'bg-[#FDE047] text-[#0F172A] border-[2px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] font-extrabold scale-105'
                      : isToday
                      ? 'bg-slate-200 text-[#0F172A] border border-slate-400 hover:bg-slate-300'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {dayNum}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selector & Session Slots (Right Col) */}
        <div className="md:col-span-5 space-y-3">
          {/* Time Picker Controls */}
          <div className="bg-white border-[2px] border-[#0F172A] p-4 rounded-xl shadow-[2px_2px_0_#0F172A] space-y-2.5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <span className="material-symbols-outlined text-[#FF5722] text-[18px]">schedule</span>
              <span className="text-xs font-black uppercase text-[#0F172A]">Exam Time Slot</span>
            </div>

            <div className="flex items-center gap-1.5 justify-center py-1">
              {/* Hour Dropdown */}
              <select
                value={hours}
                onChange={(e) => handleTimeChange(parseInt(e.target.value, 10), minutes, ampm)}
                className="px-2.5 py-1.5 bg-slate-100 border-[2px] border-[#0F172A] rounded-lg font-black text-sm text-[#0F172A] cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>

              <span className="font-black text-lg text-[#0F172A]">:</span>

              {/* Minute Dropdown */}
              <select
                value={minutes}
                onChange={(e) => handleTimeChange(hours, e.target.value, ampm)}
                className="px-2.5 py-1.5 bg-slate-100 border-[2px] border-[#0F172A] rounded-lg font-black text-sm text-[#0F172A] cursor-pointer"
              >
                {['00', '15', '30', '45', '59'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* AM/PM Toggle */}
              <div className="flex border-[2px] border-[#0F172A] rounded-lg overflow-hidden font-black text-xs">
                <button
                  type="button"
                  onClick={() => handleTimeChange(hours, minutes, 'AM')}
                  className={`px-2.5 py-1.5 cursor-pointer ${
                    ampm === 'AM' ? 'bg-[#FDE047] text-[#0F172A]' : 'bg-white text-slate-600'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange(hours, minutes, 'PM')}
                  className={`px-2.5 py-1.5 cursor-pointer border-l-2 border-[#0F172A] ${
                    ampm === 'PM' ? 'bg-[#FDE047] text-[#0F172A]' : 'bg-white text-slate-600'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* University Exam Session Presets */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                Standard Exam Shifts:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTimeChange(10, '30', 'AM')}
                  className={`px-2 py-1 text-[10px] font-black uppercase rounded border border-[#0F172A] cursor-pointer transition ${
                    hours === 10 && minutes === '30' && ampm === 'AM'
                      ? 'bg-[#BBF7D0] text-[#14532D] shadow-[1px_1px_0_#0F172A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  🌅 10:30 AM (Morning)
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange(2, '30', 'PM')}
                  className={`px-2 py-1 text-[10px] font-black uppercase rounded border border-[#0F172A] cursor-pointer transition ${
                    hours === 2 && minutes === '30' && ampm === 'PM'
                      ? 'bg-[#BBF7D0] text-[#14532D] shadow-[1px_1px_0_#0F172A]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  🌇 02:30 PM (Noon)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Timeline Shortcuts */}
          <div className="bg-white border-[2px] border-[#0F172A] p-3.5 rounded-xl shadow-[2px_2px_0_#0F172A] space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-500 block">
              1-Click Date Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPresetDays(15, 10, '30', 'AM')}
                className="px-2 py-1 bg-slate-100 hover:bg-[#FDE047] text-[#0F172A] text-[10px] font-black uppercase rounded border border-[#0F172A] cursor-pointer shadow-[1px_1px_0_#0F172A]"
              >
                +15 Days
              </button>
              <button
                type="button"
                onClick={() => applyPresetDays(30, 10, '30', 'AM')}
                className="px-2 py-1 bg-slate-100 hover:bg-[#FDE047] text-[#0F172A] text-[10px] font-black uppercase rounded border border-[#0F172A] cursor-pointer shadow-[1px_1px_0_#0F172A]"
              >
                +30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPresetDays(60, 10, '30', 'AM')}
                className="px-2 py-1 bg-slate-100 hover:bg-[#FDE047] text-[#0F172A] text-[10px] font-black uppercase rounded border border-[#0F172A] cursor-pointer shadow-[1px_1px_0_#0F172A]"
              >
                +60 Days (Mid-Sem)
              </button>
              <button
                type="button"
                onClick={() => applyPresetDays(90, 10, '30', 'AM')}
                className="px-2 py-1 bg-slate-100 hover:bg-[#FDE047] text-[#0F172A] text-[10px] font-black uppercase rounded border border-[#0F172A] cursor-pointer shadow-[1px_1px_0_#0F172A]"
              >
                +90 Days (Finals)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ISO Output preview */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold pt-1 border-t border-slate-200">
        <span>Target Datetime ISO:</span>
        <code className="bg-slate-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#0F172A]">
          {value || validDate.toISOString()}
        </code>
      </div>
    </div>
  );
}
