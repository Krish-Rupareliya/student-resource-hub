// frontend/src/components/viva/VivaAnswerPanel.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VivaAnswerPanel({
  question,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isLearned,
  isRevision,
  isBookmarked,
  onToggleLearned,
  onToggleNeedRevision,
  onToggleBookmark
}) {
  const [copied, setCopied] = useState(false);
  const [openFollowUpIndex, setOpenFollowUpIndex] = useState(null);

  const handleCopy = () => {
    const fullText = `Q: ${question.question}\n\n[DIRECT ANSWER]\n${question.shortAnswer}\n\n[DETAILED EXPLANATION]\n${question.detailedAnswer}\n\n[KEY POINTS]\n${(question.keyPoints || []).map((kp, i) => `${i + 1}. ${kp}`).join('\n')}\n\n[QUICK REVISION]\n${question.quickRevision || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#FFFDF5] border-2 border-black rounded-[24px] p-5 sm:p-7 shadow-[6px_6px_0px_rgba(0,0,0,1)] my-4 relative transition-all"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-black/10 flex-wrap">
        
        {/* Left: Section and Question Numbering */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#0F172A] text-[#FBBF24] border border-black px-2.5 py-0.5 rounded-lg text-xs font-black">
            {question.source?.questionNumber || 'Q'}
          </span>
          <span className="text-xs font-black text-gray-700 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
            {question.section}
          </span>
          {question.source?.name && (
            <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">
              Source: {question.source.name}
            </span>
          )}
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-400 text-black border-black shadow-2xs'
                : 'bg-white text-gray-400 hover:text-black border-black/20'
            }`}
            title="Bookmark for Later"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          {/* Copy Answer Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-white hover:bg-gray-100 border-2 border-black text-black px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active-press"
            title="Copy Answer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Print Answer */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-black text-black transition-all shadow-2xs cursor-pointer hidden sm:flex"
            title="Print Answer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
          </button>

          {/* Close Panel */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-black text-black transition-all shadow-2xs cursor-pointer"
              title="Close Answer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Question Text */}
      <h3 className="text-lg sm:text-xl font-black text-black mb-6 leading-snug">
        {question.question}
      </h3>

      {/* ─── SECTION A: DIRECT ANSWER ─── */}
      <div className="mb-6 bg-[#FEF3D6] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-amber-950">
          <span className="material-symbols-outlined text-[18px] text-amber-600">bolt</span>
          A. Direct Answer (Viva Quick Response)
        </div>
        <p className="text-sm sm:text-base font-semibold text-black leading-relaxed">
          {question.shortAnswer}
        </p>
      </div>

      {/* ─── SECTION B: DETAILED EXPLANATION ─── */}
      {question.detailedAnswer && (
        <div className="mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-sky-600">menu_book</span>
            B. Detailed Technical Explanation
          </h4>
          <div className="text-sm sm:text-base text-gray-900 leading-relaxed font-medium space-y-3 bg-white p-4 sm:p-5 rounded-2xl border-2 border-black/15 shadow-2xs whitespace-pre-line">
            {question.detailedAnswer}
          </div>
        </div>
      )}

      {/* ─── SECTION C: IMPORTANT KEY POINTS ─── */}
      {question.keyPoints && question.keyPoints.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">checklist</span>
            C. Important Points for Oral Viva
          </h4>
          <div className="bg-[#E6F8F1] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-2xs">
            <ul className="space-y-2">
              {question.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-emerald-950">
                  <span className="material-symbols-outlined text-emerald-700 text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ─── SECTION D: PRACTICAL APPLICATION / EXAMPLE ─── */}
      {question.example && (
        <div className="mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-purple-600">lightbulb</span>
            D. Practical Real-World Example
          </h4>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-xs sm:text-sm font-semibold text-purple-950 flex items-start gap-3">
            <span className="material-symbols-outlined text-purple-600 text-xl shrink-0 mt-0.5">
              devices
            </span>
            <div className="leading-relaxed">
              {question.example}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION E: DIAGRAM / VISUAL EXPLANATION / CODE ─── */}
      {question.diagram && (
        <div className="mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-blue-600">schema</span>
            E. Visual Architecture / Diagram / Format
          </h4>
          <div className="bg-[#0F172A] text-[#FBBF24] border-2 border-black rounded-2xl p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner leading-relaxed select-text">
            <pre className="whitespace-pre">{question.diagram}</pre>
          </div>
        </div>
      )}

      {/* ─── SECTION F: FOLLOW-UP VIVA QUESTIONS ─── */}
      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-rose-600">quiz</span>
            F. Common Examiner Follow-up Questions
          </h4>
          <div className="space-y-2.5">
            {question.followUpQuestions.map((item, idx) => {
              const isOpen = openFollowUpIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-2 border-black/15 rounded-xl bg-white overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFollowUpIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3 text-left font-bold text-xs sm:text-sm text-black hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <strong className="text-rose-600">Q{idx + 1}:</strong> {item.question}
                    </span>
                    <span className="material-symbols-outlined text-gray-500 text-[18px]">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3.5 pb-3.5 pt-1 text-xs sm:text-sm text-gray-700 bg-rose-50/40 border-t border-rose-100 font-medium"
                      >
                        <strong className="text-emerald-800">Answer:</strong> {item.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SECTION G: QUICK REVISION TAKEAWAY ─── */}
      {question.quickRevision && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-black rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0">
            bookmark_star
          </span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
              G. Key Viva Takeaway
            </span>
            <p className="text-xs sm:text-sm font-bold text-black leading-snug">
              {question.quickRevision}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar: Status Toggle & Prev/Next Navigation */}
      <div className="pt-4 border-t-2 border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Learned / Revision Status Toggles */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onToggleLearned(question.id)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer active-press shadow-2xs ${
              isLearned
                ? 'bg-emerald-500 text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isLearned ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <span>{isLearned ? 'Learned ✓' : 'Mark as Learned'}</span>
          </button>

          <button
            onClick={() => onToggleNeedRevision(question.id)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer active-press shadow-2xs ${
              isRevision
                ? 'bg-amber-400 text-black border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isRevision ? 'history_edu' : 'sync'}
            </span>
            <span>{isRevision ? 'Need Revision' : 'Revise Later'}</span>
          </button>
        </div>

        {/* Right: Prev & Next Question Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all ${
              hasPrevious
                ? 'bg-white hover:bg-gray-100 text-black border-black cursor-pointer shadow-2xs active-press'
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Previous</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all ${
              hasNext
                ? 'btn-black-yellow cursor-pointer shadow-2xs active-press'
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>

    </motion.div>
  );
}
