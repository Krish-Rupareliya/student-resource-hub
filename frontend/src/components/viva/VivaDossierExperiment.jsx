// frontend/src/components/viva/VivaDossierExperiment.jsx
import React from 'react';

/**
 * Single Lab Experiment Dossier Entry
 * Provides complete laboratory practical manual and viva Q&A in CampusHub style.
 */
export default function VivaDossierExperiment({ experiment, index }) {
  const expNum = experiment.experimentNumber || index + 1;
  const elementId = experiment.id || `exp-${expNum}`;

  return (
    <article
      id={elementId}
      className="scroll-mt-24 bg-white border-2 border-black rounded-[22px] p-5 sm:p-7 shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] relative space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-black/10">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-400 text-black border-2 border-black font-black text-xs sm:text-sm px-3 py-1 rounded-xl shadow-[2px_2px_0px_#000] font-mono">
            EXP {expNum < 10 ? `0${expNum}` : expNum}
          </span>
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-lg">
            Laboratory Practical
          </span>
        </div>
      </div>

      {/* Experiment Title */}
      <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-black tracking-tight leading-snug">
        {experiment.title}
      </h2>

      {/* Aim Callout */}
      <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block mb-1">
          Experiment Aim
        </span>
        <p className="text-sm sm:text-base font-semibold text-emerald-950">
          {experiment.aim}
        </p>
      </div>

      {/* Short Theory */}
      {experiment.shortTheory && (
        <div className="space-y-1.5 text-sm sm:text-[15px] text-gray-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
            Theory & Principle
          </h3>
          <p className="leading-relaxed">{experiment.shortTheory}</p>
        </div>
      )}

      {/* Tools & Components */}
      {experiment.requiredTools && experiment.requiredTools.length > 0 && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
            Required Tools & Software
          </h3>
          <div className="flex flex-wrap gap-2">
            {experiment.requiredTools.map((tool, ti) => (
              <span
                key={ti}
                className="bg-gray-100 border border-black/20 text-black font-bold text-xs px-3 py-1 rounded-lg"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Procedure Steps */}
      {experiment.procedure && experiment.procedure.length > 0 && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
            Laboratory Procedure
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-gray-800">
            {experiment.procedure.map((step, si) => (
              <li key={si} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Expected Output */}
      {experiment.expectedOutput && (
        <div className="bg-gray-50 border-2 border-black/15 rounded-xl p-4 text-xs sm:text-sm text-gray-800">
          <strong className="font-black text-black block mb-1">Expected Output & Observation:</strong>
          <p className="leading-relaxed">{experiment.expectedOutput}</p>
        </div>
      )}

      {/* Common Errors & Troubleshooting */}
      {experiment.commonErrors && experiment.commonErrors.length > 0 && (
        <div className="bg-rose-50/70 border-2 border-rose-300 rounded-2xl p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">warning</span>
            Common Laboratory Errors & Troubleshooting
          </h3>
          <div className="space-y-2">
            {experiment.commonErrors.map((err, ei) => (
              <div key={ei} className="bg-white border border-rose-200 rounded-xl p-3 text-xs sm:text-sm">
                <p className="font-extrabold text-rose-950">Issue: {err.error}</p>
                <p className="text-gray-600 mt-0.5">Cause: {err.cause}</p>
                <p className="text-emerald-700 font-bold mt-1">Fix: {err.solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experiment Viva Questions */}
      {experiment.questions && experiment.questions.length > 0 && (
        <div className="bg-[#FEF3D6] border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_#000]">
          <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-amber-600">help</span>
            Lab Practical Viva Questions & Answers
          </h3>
          <div className="space-y-3">
            {experiment.questions.map((vq, vqi) => (
              <div key={vqi} className="bg-white border-2 border-black/20 rounded-xl p-3.5 shadow-2xs">
                <p className="font-extrabold text-black text-xs sm:text-sm">
                  Q: {vq.question}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm mt-1.5 pl-3 border-l-2 border-amber-500 font-medium">
                  {vq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
