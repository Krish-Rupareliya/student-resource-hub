// frontend/src/components/viva/VivaSearchBar.jsx
export default function VivaSearchBar({
  searchQuery,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalResults
}) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-[24px] p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions, answers, keywords (e.g. CRC, ALOHA, TCP, OSPF)..."
            className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns and Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-[#FEF3D6] border-2 border-black rounded-xl px-2.5 py-1.5 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-amber-800">bar_chart</span>
            <select
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="bg-transparent font-black text-xs text-black focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Difficulties</option>
              <option value="basic">Basic (Foundations)</option>
              <option value="intermediate">Intermediate (Core)</option>
              <option value="advanced">Advanced (Deep Viva)</option>
            </select>
          </div>

          {/* Status Filter (Learned / Revision / Unattempted) */}
          <div className="flex items-center gap-1.5 bg-[#E6F4FF] border-2 border-black rounded-xl px-2.5 py-1.5 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-sky-800">check_circle</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-transparent font-black text-xs text-black focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Statuses</option>
              <option value="unattempted">Unattempted</option>
              <option value="learned">Learned</option>
              <option value="revision">Need Revision</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 border-2 border-rose-400 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-black transition-all active-press cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
              Clear
            </button>
          )}

          {/* Results Badge */}
          <span className="text-xs font-black bg-[#0F172A] text-[#FBBF24] border-2 border-[#FBBF24] px-3 py-1.5 rounded-xl shadow-2xs whitespace-nowrap ml-auto md:ml-0">
            {totalResults} {totalResults === 1 ? 'Question' : 'Questions'}
          </span>

        </div>

      </div>
    </div>
  );
}
