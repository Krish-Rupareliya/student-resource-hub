// frontend/src/components/viva/VivaQuestionCard.jsx
import { motion, AnimatePresence } from 'framer-motion';
import VivaAnswerPanel from './VivaAnswerPanel';

export default function VivaQuestionCard({
  question,
  index,
  isExpanded,
  onToggleExpand,
  isBookmarked,
  isLearned,
  isRevision,
  onToggleBookmark,
  onToggleLearned,
  onToggleNeedRevision,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) {
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'basic':
        return { label: 'Basic', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'advanced':
        return { label: 'Advanced', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      default:
        return { label: 'Intermediate', color: 'bg-blue-100 text-blue-900 border-blue-300' };
    }
  };

  const diffBadge = getDifficultyBadge(question.difficulty);

  return (
    <div
      id={`question-${question.id}`}
      className={`border-2 border-black rounded-[24px] transition-all duration-200 mb-4 overflow-hidden ${
        isExpanded
          ? 'bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] ring-2 ring-black'
          : 'bg-white hover:bg-[#FFFDF5] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]'
      }`}
    >
      {/* ─── Question Card Collapsed Strip ─── */}
      <div className="p-5 sm:p-6">
        
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Question Number Badge */}
            <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-black px-2.5 py-0.5 rounded-lg text-xs font-black">
              {question.source?.questionNumber || `Q.${index + 1}`}
            </span>

            {/* Category Badge */}
            <span className="bg-[#FEF3D6] text-black border border-black/40 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold capitalize">
              {question.category || 'theory'}
            </span>

            {/* Difficulty Badge */}
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${diffBadge.color}`}>
              {diffBadge.label}
            </span>

            {/* Unit / Section Badge */}
            {question.section && (
              <span className="text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-lg hidden md:inline truncate max-w-xs">
                {question.section}
              </span>
            )}
          </div>

          {/* Right Status Indicator Pills */}
          <div className="flex items-center gap-1.5 ml-auto">
            {isLearned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg">
                <span className="material-symbols-outlined text-[14px]">check</span>
                Learned
              </span>
            )}
            {isRevision && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                Revise
              </span>
            )}

            {/* Bookmark Quick Toggle */}
            <button
              onClick={() => onToggleBookmark(question.id)}
              className={`p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-400 text-black border-black shadow-2xs'
                  : 'bg-white text-gray-400 hover:text-black border-black/20'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>

        </div>

        {/* Question Text */}
        <h3
          onClick={() => onToggleExpand(question.id)}
          className="font-black text-base sm:text-lg text-black leading-snug mb-2 cursor-pointer hover:text-amber-600 transition-colors"
        >
          {question.question}
        </h3>

        {/* Short Answer Preview (shown only when collapsed) */}
        {!isExpanded && (
          <p className="text-gray-600 text-xs sm:text-sm font-medium line-clamp-2 mb-4 leading-relaxed">
            {question.shortAnswer}
          </p>
        )}

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          
          <button
            onClick={() => onToggleExpand(question.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black inline-flex items-center gap-1.5 transition-all active-press cursor-pointer shadow-2xs ${
              isExpanded
                ? 'bg-black text-[#FBBF24] border-2 border-black'
                : 'btn-black-yellow'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExpanded ? 'visibility_off' : 'visibility'}
            </span>
            <span>{isExpanded ? 'Hide Answer' : 'View Full Answer'}</span>
          </button>

          {/* Quick Mark as Learned / Revision Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleLearned(question.id)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isLearned
                  ? 'bg-emerald-500 text-white border-black'
                  : 'bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border-gray-300'
              }`}
              title={isLearned ? 'Mark as Unlearned' : 'Mark as Learned'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLearned ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </button>

            <button
              onClick={() => onToggleNeedRevision(question.id)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isRevision
                  ? 'bg-amber-400 text-black border-black'
                  : 'bg-gray-100 hover:bg-amber-50 text-gray-600 hover:text-amber-700 border-gray-300'
              }`}
              title={isRevision ? 'Remove Revision Flag' : 'Mark for Revision'}
            >
              <span className="material-symbols-outlined text-[18px]">
                sync
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* ─── Expandable Full Answer Panel ─── */}
      <AnimatePresence>
        {isExpanded && (
          <div className="px-4 pb-5 sm:px-6 sm:pb-6">
            <VivaAnswerPanel
              question={question}
              onClose={() => onToggleExpand(question.id)}
              onNext={onNext}
              onPrevious={onPrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              isLearned={isLearned}
              isRevision={isRevision}
              isBookmarked={isBookmarked}
              onToggleLearned={onToggleLearned}
              onToggleNeedRevision={onToggleNeedRevision}
              onToggleBookmark={onToggleBookmark}
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
