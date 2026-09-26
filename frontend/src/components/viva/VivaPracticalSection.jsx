// frontend/src/components/viva/VivaPracticalSection.jsx
import { useState } from 'react';
import VivaExperimentCard from './VivaExperimentCard';

export default function VivaPracticalSection({ experiments = [], subjectTitle }) {
  const [search, setSearch] = useState('');

  const filteredExperiments = experiments.filter((exp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (exp.title || '').toLowerCase().includes(q) ||
      (exp.aim || '').toLowerCase().includes(q) ||
      (exp.shortTheory || '').toLowerCase().includes(q) ||
      (exp.requiredTools || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#E6F8F1] border-2 border-black rounded-[24px] p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black">
              <span className="material-symbols-outlined text-2xl">biotech</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                Laboratory Practical Viva &amp; Experiment Guides
              </h2>
              <p className="text-xs sm:text-sm text-emerald-950 font-medium">
                Complete lab experiment setups, working code, expected observations, and oral viva questions for {subjectTitle}.
              </p>
            </div>
          </div>

          <span className="bg-black text-[#FBBF24] border-2 border-[#FBBF24] px-3.5 py-1 rounded-xl text-xs font-black shrink-0">
            {experiments.length} {experiments.length === 1 ? 'Experiment' : 'Experiments'} Available
          </span>
        </div>

        {/* Experiment Filter Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiments by aim, tools (e.g. Wireshark, Packet Tracer, CRC)..."
            className="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Experiments List */}
      {filteredExperiments.length > 0 ? (
        <div className="space-y-4">
          {filteredExperiments.map((exp, idx) => (
            <VivaExperimentCard key={exp.id || idx} experiment={exp} index={idx} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-black/30 rounded-2xl p-10 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-gray-400">science_off</span>
          <h3 className="font-black text-lg text-black">No experiments matched your search</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search terms or clear the filter to view all {experiments.length} laboratory practicals.
          </p>
          <button
            onClick={() => setSearch('')}
            className="btn-black-yellow px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-2xs"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
