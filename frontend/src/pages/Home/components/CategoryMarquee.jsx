import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileQuestion, FlaskConical, MessageSquare, HelpCircle } from 'lucide-react';

function CategoryMarquee() {
  const displayItems = [
    {
      id: 'notes',
      icon: FileText,
      title: 'Notes',
      desc: 'Over 2500 Files',
      bgColor: 'bg-[#FEF3D6]',
      rotate: 'rotate-[-3deg]',
    },
    {
      id: 'pyqs',
      icon: FileQuestion,
      title: 'PYQs',
      desc: 'Previous Year Papers',
      bgColor: 'bg-[#EDE9FE]',
      rotate: 'rotate-[2.5deg]',
    },
    {
      id: 'practicals',
      icon: FlaskConical,
      title: 'Practicals',
      desc: 'Lab Manuals',
      bgColor: 'bg-[#DCFCE7]',
      rotate: 'rotate-[-2.5deg]',
    },
    {
      id: 'viva',
      icon: MessageSquare,
      title: 'Viva',
      desc: 'Imp Questions',
      bgColor: 'bg-[#FFEDD5]',
      rotate: 'rotate-[3deg]',
    },
    {
      id: 'qbank',
      icon: HelpCircle,
      title: 'Q-Bank',
      desc: 'Bank of questions',
      bgColor: 'bg-[#E0F2FE]',
      rotate: 'rotate-[-2deg]',
    },
  ];

  const renderCards = (keyPrefix) => (
    <div className="flex shrink-0 gap-5 sm:gap-6 pr-5 sm:pr-6 py-3">
      {displayItems.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <Link
            key={`${keyPrefix}-${cat.id}-${idx}`}
            to={`/resources?category=${encodeURIComponent(cat.title.toLowerCase())}`}
            className="w-48 sm:w-56 shrink-0 bg-white p-5 sm:p-6 rounded-[28px] text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[7px_7px_0px_#111111] flex flex-col items-center justify-between group"
          >
            <div className="mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] ${cat.rotate} group-hover:rotate-0 group-hover:scale-110 transition-all ${cat.bgColor} text-[#111111]`}
              >
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-base text-hub-navy group-hover:text-amber-600 transition-colors">{cat.title}</h3>
              <p className="text-xs text-gray-500 font-bold mt-1">{cat.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      <div className="w-full relative pause-marquee-on-hover">
        {/* Gradients to fade out the edges for a smoother look */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-hub-cream to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-hub-cream to-transparent z-10 pointer-events-none"></div>

        {/* Infinite Marquee Wrapper */}
        <div className="flex w-max animate-marquee" style={{ animationDuration: '90s' }}>
          {renderCards('set1')}
          {renderCards('set2')}
          {renderCards('set3')}
          {renderCards('set4')}
          {renderCards('set5')}
          {renderCards('set6')}
        </div>
      </div>
    </section>
  );
}

export default CategoryMarquee;

