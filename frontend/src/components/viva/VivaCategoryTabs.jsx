// frontend/src/components/viva/VivaCategoryTabs.jsx
import { motion } from 'framer-motion';

export default function VivaCategoryTabs({
  activeTab,
  onSelectTab,
  stats,
  hasPracticals = true
}) {
  const tabs = [
    {
      id: 'all',
      label: 'All Questions',
      icon: 'format_list_bulleted',
      count: stats.total,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'theory',
      label: 'Theory Viva',
      icon: 'menu_book',
      count: stats.total - stats.experimentsCount, // Approximate theory pool
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      id: 'practical',
      label: 'Practical Viva',
      icon: 'biotech',
      count: stats.experimentsCount > 0 ? stats.experimentsCount * 2 : 0,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      hidden: !hasPracticals
    },
    {
      id: 'experiments',
      label: 'Experiment-wise Viva',
      icon: 'science',
      count: stats.experimentsCount,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      hidden: !hasPracticals
    },
    {
      id: 'quick-revision',
      label: 'Quick Revision',
      icon: 'bolt',
      count: stats.total,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
    },
    {
      id: 'bookmarked',
      label: 'Bookmarked',
      icon: 'bookmark',
      count: stats.bookmarked,
      badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300'
    }
  ].filter(t => !t.hidden);

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border-2 cursor-pointer ${
              isActive
                ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-[4px_4px_0px_#FBBF24] ring-2 ring-black'
                : 'bg-white hover:bg-[#FFFDF5] text-black border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && tab.count >= 0 && (
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                  isActive
                    ? 'bg-[#FBBF24] text-black border-black'
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
