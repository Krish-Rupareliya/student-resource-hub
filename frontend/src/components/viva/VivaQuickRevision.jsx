// frontend/src/components/viva/VivaQuickRevision.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VivaQuickRevision({
  questions = [],
  learnedIds = new Set(),
  onToggleLearned,
  onToggleBookmark,
  bookmarkedIds = new Set()
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unlearned' | 'bookmarked'

  const activePool = questions.filter((q) => {
    if (filterMode === 'unlearned') return !learnedIds.has(q.id);
    if (filterMode === 'bookmarked') return bookmarkedIds.has(q.id);
    return true;
  });

  const currentQ = activePool[currentIndex] || activePool[0];

  const handleNext = () => {
    if (currentIndex < activePool.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQ || activePool.length === 0) {
    return (
      <div className="bg-white border-2 border-black rounded-[24px] p-10 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
        <span className="material-symbols-outlined text-4xl text-amber-500">celebration</span>
        <h3 className="font-black text-xl text-black">All Done in this Filter!</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          You have learned all questions under this filter. Switch back to "All Questions" to keep revising.
        </p>
        <button
          onClick={() => {
            setFilterMode('all');
            setCurrentIndex(0);
          }}
          className="btn-black-yellow px-5 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-xs"
        >
          View All Questions
        </button>
      </div>
    );
  }

  const isCurrentLearned = learnedIds.has(currentQ.id);
  const isCurrentBookmarked = bookmarkedIds.has(currentQ.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Revision Bar */}
      <div className="bg-[#FEF3D6] border-2 border-black rounded-[24px] p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black">
            <span className="material-symbols-outlined text-xl">bolt</span>
          </span>
          <div>
            <h3 className="font-black text-base text-black">Quick Revision Flashcard Mode</h3>
            <p className="text-xs text-amber-950 font-semibold">
              Card {currentIndex + 1} of {activePool.length}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white border-2 border-black rounded-xl p-1 shadow-2xs">
          <button
            onClick={() => { setFilterMode('all'); setCurrentIndex(0); }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-[#0F172A] text-[#FBBF24]' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setFilterMode('unlearned'); setCurrentIndex(0); }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filterMode === 'unlearned' ? 'bg-[#0F172A] text-[#FBBF24]' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Unlearned
          </button>
          <button
            onClick={() => { setFilterMode('bookmarked'); setCurrentIndex(0); }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filterMode === 'bookmarked' ? 'bg-[#0F172A] text-[#FBBF24]' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bookmarked
          </button>
        </div>

      </div>

      {/* Main Flashcard Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] relative"
        >
          {/* Card Badges */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black bg-black text-[#FBBF24] border border-black px-2.5 py-0.5 rounded-lg">
              {currentQ.source?.questionNumber || `Q.${currentIndex + 1}`}
            </span>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
              {currentQ.section}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-black text-black mb-6 leading-snug">
            {currentQ.question}
          </h2>

          {/* Direct Answer Box */}
          <div className="bg-[#FFFDF5] border-2 border-amber-300 rounded-2xl p-5 mb-5 shadow-2xs">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-2">
              ⚡ Concise Viva Answer:
            </span>
            <p className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed">
              {currentQ.shortAnswer}
            </p>
          </div>

          {/* Key Takeaway */}
          {currentQ.quickRevision && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6 text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-lg">
                bookmark_star
              </span>
              <span>{currentQ.quickRevision}</span>
            </div>
          )}

          {/* Card Actions & Navigation */}
          <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between gap-3 flex-wrap">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLearned(currentQ.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer active-press shadow-2xs ${
                  isCurrentLearned
                    ? 'bg-emerald-500 text-white border-black'
                    : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-400'
                }`}
              >
                {isCurrentLearned ? 'Learned ✓' : 'Mark as Learned'}
              </button>

              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
                  isCurrentBookmarked
                    ? 'bg-amber-400 text-black border-black shadow-2xs'
                    : 'bg-white text-gray-400 hover:text-black border-black/20'
                }`}
                title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCurrentBookmarked ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                  currentIndex > 0
                    ? 'bg-white hover:bg-gray-100 text-black border-black cursor-pointer shadow-2xs active-press'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === activePool.length - 1}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                  currentIndex < activePool.length - 1
                    ? 'btn-black-yellow cursor-pointer shadow-2xs active-press'
                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                }`}
              >
                Next Card
              </button>
            </div>

          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
