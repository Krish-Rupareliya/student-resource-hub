import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function ComingSoon() {
  const [searchParams] = useSearchParams();
  const deptCode = searchParams.get('dept')?.toUpperCase() || 'DEPARTMENT';

  const DEPT_NAMES = {
    CSE: 'Computer Science & Engineering (CSE)',
    IT: 'Information Technology (IT)',
  };

  const deptName = DEPT_NAMES[deptCode] || `${deptCode} Department`;

  return (
    <div className="pt-24 pb-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-[85vh] relative overflow-hidden flex flex-col items-center justify-center px-4 selection:bg-amber-300 selection:text-hub-navy">
      {/* Background Decor SVG Vector Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-right dots matrix */}
        <svg className="absolute top-8 right-6 w-32 h-28 opacity-20" viewBox="0 0 100 100" fill="#0D1B40">
          <pattern id="cs-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="100" height="100" fill="url(#cs-dots-tr)" />
        </svg>

        {/* Floating amber rings */}
        <div className="absolute top-[20%] left-[10%] w-6 h-6 rounded-full border-2 border-amber-400 opacity-60 animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-8 h-8 rounded-full border-2 border-amber-400 opacity-50" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-8">
        <div className="bg-white/90 backdrop-blur-sm border-2 border-slate-900 rounded-3xl p-8 sm:p-12 shadow-[4px_4px_0px_#0F172A] text-center space-y-6 max-w-2xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3D6] border-2 border-slate-900 text-slate-950 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#0F172A] animate-bounce">
            <span>🚀</span>
            <span>Department Queue</span>
          </div>

          {/* Icon & Department Badge */}
          <div className="relative inline-block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] flex items-center justify-center mx-auto text-amber-700">
              <span className="material-symbols-outlined text-4xl sm:text-5xl">
                {deptCode === 'IT' ? 'dns' : 'laptop_mac'}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              {deptName}
            </h1>
            <p className="text-amber-600 font-extrabold text-sm sm:text-base">
              Study Materials &amp; PYQs Under Preparation
            </p>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-medium">
            We are currently organizing and verifying high-quality handwritten notes, semester question papers (PYQs), and laboratory manuals for <span className="font-bold text-slate-900">{deptName}</span>. In the meantime, Computer Engineering resources are active and open!
          </p>

          {/* Action Cards / Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/semesters"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] hover:shadow-[1px_1px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-xs sm:text-sm inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg leading-none">memory</span>
              <span>Explore Active CE Semesters</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold px-6 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] hover:shadow-[1px_1px_0px_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-xs sm:text-sm inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg leading-none">mail</span>
              <span>Request Subject Notes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
