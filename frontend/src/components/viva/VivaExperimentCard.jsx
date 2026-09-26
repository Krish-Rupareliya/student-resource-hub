// frontend/src/components/viva/VivaExperimentCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VivaExperimentCard({ experiment, index }) {
  const [expanded, setExpanded] = useState(false);
  const [openVivaId, setOpenVivaId] = useState(null);

  return (
    <div className="bg-white border-2 border-black rounded-[24px] p-5 sm:p-7 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all mb-6">
      
      {/* Experiment Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-black px-3 py-0.5 rounded-lg text-xs font-black uppercase">
              Lab Practical 0{experiment.experimentNumber || index + 1}
            </span>
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-lg text-xs font-extrabold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">biotech</span>
              Lab Manual Procedure
            </span>
          </div>

          <h3 className="font-black text-lg sm:text-xl text-black leading-snug">
            {experiment.title}
          </h3>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
            expanded
              ? 'bg-[#0F172A] text-[#FBBF24] border-black'
              : 'bg-white hover:bg-gray-50 border-black text-black'
          }`}
          title={expanded ? 'Collapse Experiment Details' : 'Expand Experiment Details'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Aim Callout */}
      <div className="bg-[#FFFDF5] border-2 border-black/15 rounded-xl p-3.5 mb-4 text-xs sm:text-sm">
        <strong className="text-black font-black uppercase tracking-wider text-[11px] block mb-1">
          🎯 Aim of Experiment:
        </strong>
        <p className="text-gray-800 font-medium">{experiment.aim}</p>
      </div>

      {/* Expandable Experiment Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5 pt-2 border-t-2 border-black/10"
          >
            {/* Short Theory */}
            {experiment.shortTheory && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-sky-600">menu_book</span>
                  Theoretical Background
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  {experiment.shortTheory}
                </p>
              </div>
            )}

            {/* Required Hardware & Software Tools */}
            {experiment.requiredTools && experiment.requiredTools.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-purple-600">build</span>
                  Required Tools, Hardware &amp; Software
                </h4>
                <div className="flex flex-wrap gap-2">
                  {experiment.requiredTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 text-purple-900 border border-purple-200 font-bold text-xs px-2.5 py-1 rounded-lg"
                    >
                      • {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Procedure */}
            {experiment.procedure && experiment.procedure.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">checklist</span>
                  Experimental Procedure &amp; Workflow
                </h4>
                <div className="bg-[#E6F8F1] border-2 border-black rounded-xl p-4 space-y-2">
                  {experiment.procedure.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-emerald-950">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Output / Observations */}
            {experiment.expectedOutput && (
              <div className="bg-[#FEF3D6] border-2 border-black rounded-xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">visibility</span>
                  Expected Output &amp; Observation
                </h4>
                <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                  {experiment.expectedOutput}
                </p>
              </div>
            )}

            {/* Common Errors & Troubleshooting */}
            {experiment.commonErrors && experiment.commonErrors.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-rose-600">warning</span>
                  Common Lab Errors &amp; Troubleshooting
                </h4>
                <div className="space-y-2">
                  {experiment.commonErrors.map((err, idx) => (
                    <div key={idx} className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs sm:text-sm">
                      <div className="font-black text-rose-900 mb-1">
                        ⚠️ Error: {err.error}
                      </div>
                      <div className="text-gray-700 mb-1">
                        <strong className="text-gray-900">Cause:</strong> {err.cause}
                      </div>
                      <div className="text-emerald-800 font-semibold">
                        <strong className="text-emerald-950">Fix:</strong> {err.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experiment-Specific Viva Questions */}
            {experiment.questions && experiment.questions.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-amber-500">help</span>
                  Experiment-Specific Oral Viva Questions ({experiment.questions.length})
                </h4>
                <div className="space-y-2.5">
                  {experiment.questions.map((q, idx) => {
                    const isQOpen = openVivaId === q.id || openVivaId === idx;
                    return (
                      <div
                        key={q.id || idx}
                        className="border-2 border-black rounded-xl bg-white overflow-hidden shadow-2xs"
                      >
                        <button
                          onClick={() => setOpenVivaId(isQOpen ? null : (q.id || idx))}
                          className="w-full flex items-center justify-between p-3 text-left font-bold text-xs sm:text-sm text-black hover:bg-amber-50/50 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <strong className="text-amber-600 font-black">Q{idx + 1}:</strong> {q.question}
                          </span>
                          <span className="material-symbols-outlined text-gray-500 text-[18px]">
                            {isQOpen ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {isQOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-3.5 pb-3.5 pt-1 text-xs sm:text-sm text-gray-800 bg-[#FFFDF5] border-t border-black/10 font-medium leading-relaxed"
                            >
                              <strong className="text-emerald-800">Answer:</strong> {q.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Footer Strip */}
      <div className="pt-3 mt-4 border-t border-black/10 flex items-center justify-between text-xs font-bold text-gray-500">
        <span>{experiment.questions?.length || 0} Viva Q&amp;As Included</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-black hover:text-amber-600 font-black transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>{expanded ? 'Hide Details' : 'View Full Experiment & Viva'}</span>
          <span className="material-symbols-outlined text-[16px]">
            {expanded ? 'expand_less' : 'arrow_forward'}
          </span>
        </button>
      </div>

    </div>
  );
}
