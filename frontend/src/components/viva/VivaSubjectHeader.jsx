// frontend/src/components/viva/VivaSubjectHeader.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function VivaSubjectHeader({
  subject,
  stats,
  onContinuePrep,
  onExpandAll,
  onCollapseAll,
  onOpenQuestionBankModal,
  isAllExpanded
}) {
  const subjectTitle = subject?.title || subject?.subjectName || 'Subject';
  const subjectCode = (subject?.code || subject?.subjectCode || '').toUpperCase();
  const departmentName = subject?.department?.name || subject?.department || 'Computer Engineering';
  const semesterNum = subject?.semester?.semesterNumber || subject?.semester || 5;

  return (
    <header className="mb-8">
      <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        
        {/* Subtle decorative background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/50 via-sky-100/30 to-transparent rounded-bl-full pointer-events-none -z-0" />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 mb-6 text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar relative z-10">
          <Link to="/" className="hover:text-amber-600 font-bold transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px] text-gray-400">chevron_right</span>
          <Link to="/resources" className="hover:text-amber-600 font-bold transition-colors">Resources</Link>
          <span className="material-symbols-outlined text-[14px] text-gray-400">chevron_right</span>
          <Link to="/semesters" className="hover:text-amber-600 font-bold transition-colors">
            {subject?.department?.code || 'CE'}
          </Link>
          <span className="material-symbols-outlined text-[14px] text-gray-400">chevron_right</span>
          <Link to={`/subject/${subjectCode.toLowerCase()}`} className="hover:text-amber-600 font-bold transition-colors">
            {subjectTitle}
          </Link>
          <span className="material-symbols-outlined text-[14px] text-gray-400">chevron_right</span>
          <span className="text-black font-black bg-amber-300 border border-black px-2.5 py-0.5 rounded-lg shadow-2xs">
            Viva Preparation &amp; Solutions
          </span>
        </nav>

        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left: Subject Info & Title */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 text-black">
              <span className="material-symbols-outlined text-[36px] sm:text-[44px]">
                {subject?.icon || 'quiz'}
              </span>
            </div>

            <div>
              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {subjectCode && (
                  <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-[#FBBF24] px-3 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase shadow-xs">
                    {subjectCode}
                  </span>
                )}
                <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                  SEM 0{semesterNum} • {departmentName}
                </span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Verified University Question Bank
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight mb-1.5">
                Viva Questions &amp; Solutions
              </h1>
              
              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-700 font-medium max-w-2xl leading-relaxed">
                Prepare for external viva, lab practicals, internal evaluations, and semester theory examinations with comprehensive verified answers.
              </p>
            </div>
          </div>

          {/* Right: Progress Tracker Widget & Quick Action Buttons */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            
            {/* Progress Card */}
            <div className="bg-[#FFF7E8] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-black/70 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">trending_up</span>
                  Preparation Progress
                </span>
                <span className="text-xs font-black bg-black text-[#FBBF24] px-2 py-0.5 rounded-md">
                  {stats.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-white border border-black rounded-full overflow-hidden p-0.5 shadow-inner mb-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full"
                />
              </div>

              {/* Counters */}
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                <span>
                  <strong className="text-black font-black text-xs">{stats.learned}</strong> of{' '}
                  <strong className="text-black font-black text-xs">{stats.total}</strong> Learned
                </span>
                <span className="text-amber-800">
                  {stats.revision > 0 && `${stats.revision} Need Revision • `}
                  {stats.bookmarked} Bookmarked
                </span>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onContinuePrep}
                className="btn-black-yellow px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 active-press flex-1 shadow-xs cursor-pointer"
                title="Jump to the next unlearned question"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                Continue Prep
              </button>

              <button
                onClick={isAllExpanded ? onCollapseAll : onExpandAll}
                className="bg-white hover:bg-gray-50 border-2 border-black text-black px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-xs active-press cursor-pointer"
                title={isAllExpanded ? "Collapse All Answers" : "Expand All Answers"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isAllExpanded ? 'unfold_less' : 'unfold_more'}
                </span>
                <span className="hidden sm:inline">{isAllExpanded ? 'Collapse All' : 'Expand All'}</span>
              </button>

              <button
                onClick={onOpenQuestionBankModal}
                className="bg-[#D1E8E2] hover:bg-[#bfe0d8] border-2 border-black text-black px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-xs active-press cursor-pointer"
                title="View Question Bank Details or Contribute Files"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span className="hidden sm:inline">Source Docs</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}
