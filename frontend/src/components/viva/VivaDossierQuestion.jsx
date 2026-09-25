// frontend/src/components/viva/VivaDossierQuestion.jsx
import React, { useState } from 'react';

/**
 * Single Viva Question Dossier Entry
 * All answer sections are directly visible and styled with CampusHub's signature neo-brutalist design.
 */
export default function VivaDossierQuestion({ question, index }) {
  const [copied, setCopied] = useState(false);

  const qNum = question.questionNumber || `Q.${index + 1}`;
  const elementId = question.id || `q-${index + 1}`;

  // Fallback for shortAnswer punchline from detailedAnswer if missing
  const displayShortAnswer = question.shortAnswer?.trim() || (() => {
    if (!question.detailedAnswer) return null;
    const clean = question.detailedAnswer.replace(/\n+/g, ' ').trim();
    const firstSentence = clean.split(/\.\s+/)[0];
    return firstSentence && firstSentence.length > 15 && firstSentence.length < 240
      ? (firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`)
      : null;
  })();

  // Fallback for keyPoints from tags if missing
  const displayKeyPoints = (question.keyPoints && question.keyPoints.length > 0)
    ? question.keyPoints
    : (Array.isArray(question.tags) && question.tags.length > 0 ? question.tags : null);

  const handleCopyAnswer = () => {
    const textToCopy = `Question: ${question.question}\n\nDirect Answer: ${displayShortAnswer || ''}\n\nExplanation: ${question.detailedAnswer || ''}\n\nKey Points:\n${(displayKeyPoints || []).map(p => `• ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'basic':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'advanced':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <article
      id={elementId}
      className="scroll-mt-24 bg-white border-2 border-black rounded-[22px] p-5 sm:p-7 shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] relative"
    >
      {/* ── Top Header Row ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-black/10">
        
        {/* Question Number Badge + Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#FBBF24] text-black border-2 border-black font-black text-xs sm:text-sm px-3 py-1 rounded-xl shadow-[2px_2px_0px_#000] font-mono">
            {qNum}
          </span>

          {question.difficulty && (
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          )}

          {question.category && (
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border bg-blue-50 text-blue-900 border-blue-200">
              {question.category}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyAnswer}
          className="text-xs font-black text-gray-700 hover:text-black bg-gray-100 hover:bg-[#FEF3D6] border border-black/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-auto shadow-2xs"
          title="Copy question and answer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

      </div>

      {/* ── Main Question Title ── */}
      <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-black tracking-tight leading-snug mb-5">
        {question.question}
      </h2>

      {/* ── All Answers Directly Visible ── */}
      <div className="space-y-5 text-sm sm:text-base leading-relaxed">
        
        {/* A. Direct Examiner Answer (The 10-Second Viva Punchline) */}
        {displayShortAnswer && (
          <div className="bg-[#FEF3D6] border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_#000] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="material-symbols-outlined text-lg text-amber-600">record_voice_over</span>
              <span>Direct Examiner Answer (10-Second Recall)</span>
            </div>
            <p className="text-gray-900 font-semibold text-sm sm:text-[15px] leading-relaxed">
              {displayShortAnswer}
            </p>
          </div>
        )}

        {/* B. Detailed Technical Concept Explanation */}
        {question.detailedAnswer && (
          <div className="space-y-3 text-gray-800 text-sm sm:text-[15px]">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-blue-600">psychology</span>
              Technical Breakdown
            </h3>
            {question.detailedAnswer.split('\n\n').map((para, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* C. Important Points Checklist */}
        {displayKeyPoints && displayKeyPoints.length > 0 && (
          <div className="pt-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-emerald-600">task_alt</span>
              Key Memory Points
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displayKeyPoints.map((point, ptIdx) => (
                <div
                  key={ptIdx}
                  className="bg-gray-50 hover:bg-[#FFFDF5] border border-black/15 rounded-xl p-3 text-xs sm:text-sm font-medium text-gray-800 flex items-start gap-2"
                >
                  <span className="material-symbols-outlined text-emerald-600 text-base shrink-0 mt-0.5">check_circle</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D. Visual Diagram / Architecture */}
        {question.diagram && (
          <div className="pt-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-purple-600">terminal</span>
              Architecture & Workflow Blueprint
            </h3>
            <pre className="bg-[#0F172A] text-[#34D399] border-2 border-black rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-[3px_3px_0px_#000] leading-relaxed">
              {question.diagram}
            </pre>
          </div>
        )}

        {/* Visual Image / Diagram */}
        {question.imageUrl && (
          <div className="pt-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-purple-600">image</span>
              Visual Diagram / Illustration
            </h3>
            <div className="border-2 border-black rounded-2xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
              <img
                src={question.imageUrl}
                alt={question.question}
                className="max-h-96 w-auto mx-auto object-contain p-2"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
        )}

        {/* E. Real-World Practical Application */}
        {question.example && (
          <div className="bg-[#FFFDF5] border-2 border-black/20 rounded-xl p-4 text-xs sm:text-sm text-gray-800 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-amber-500 text-lg shrink-0 mt-0.5">lightbulb</span>
            <div>
              <strong className="font-black text-black block mb-0.5">Real-World Application:</strong>
              <p className="text-gray-700 leading-relaxed">{question.example}</p>
            </div>
          </div>
        )}

        {/* F. Examiner Follow-up Questions & Counter-Questions */}
        {question.followUpQuestions && question.followUpQuestions.length > 0 && (
          <div className="bg-sky-50/70 border-2 border-sky-300 rounded-2xl p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-950 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-blue-600">help_center</span>
              Examiner's Likely Follow-up Questions
            </h3>
            <div className="space-y-3">
              {question.followUpQuestions.map((fu, fuIdx) => (
                <div key={fuIdx} className="bg-white border border-sky-200 rounded-xl p-3 shadow-2xs">
                  <p className="font-extrabold text-black text-xs sm:text-sm flex items-start gap-1.5">
                    <span className="text-blue-600">Q:</span>
                    <span>{fu.question}</span>
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1.5 pl-3 border-l-2 border-blue-500">
                    <strong className="text-gray-900 font-bold">Answer: </strong>
                    {fu.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* G. 1-Line Quick Revision Punchline */}
        {question.quickRevision && (
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-gray-500 border-t border-black/10">
            <span className="material-symbols-outlined text-amber-500 text-sm">bolt</span>
            <span className="text-black font-extrabold uppercase tracking-wider text-[10px]">Takeaway:</span>
            <span className="text-gray-700 font-medium italic">{question.quickRevision}</span>
          </div>
        )}

      </div>

    </article>
  );
}
