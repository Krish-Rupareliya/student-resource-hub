import React from 'react';

const TESTIMONIALS = [
  {
    name: 'Sneha Mehta',
    college: 'LDCE Ahmedabad',
    role: 'CSE, 3rd Year',
    badge: 'SPI 9.12',
    badgeBg: 'bg-[#FEF08A] text-[#0F172A]',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    quote: 'PYQs & practicals are lifesavers! Saved my 3rd sem finals when our college drive died at midnight.',
    offset: 'translate-y-3',
    rating: 5,
  },
  {
    name: 'Niharika Patel',
    college: 'Indus University',
    role: 'IT, 2nd Year',
    badge: 'Topper Notes',
    badgeBg: 'bg-[#BAE6FD] text-[#0F172A]',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'Structured handwritten notes saved me so much time. Stopped hunting across 10 WhatsApp groups.',
    offset: '-translate-y-3',
    rating: 5,
  },
  {
    name: 'Vraj Mehta',
    college: 'BVM Engineering',
    role: 'CSE, 4th Year • Placed at TCS',
    badge: 'Career Placed',
    badgeBg: 'bg-[#BBF7D0] text-[#0F172A]',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    quote: 'From notes to internships, everything is in one fast interface without annoying paywalls.',
    offset: 'translate-y-2',
    rating: 5,
  },
  {
    name: 'Astha Adesara',
    college: 'VGEC Chandkheda',
    role: 'CSE, 3rd Year',
    badge: 'Tested Lab Manuals',
    badgeBg: 'bg-[#FBCFE8] text-[#0F172A]',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    quote: 'Lab codes with terminal output screenshots made submission week completely stress-free.',
    offset: '-translate-y-2',
    rating: 5,
  },
  {
    name: 'Harshil Vora',
    college: 'IITE • Indus Rank 3',
    role: 'CE, 4th Year • SPI 9.82',
    badge: 'Indus Ranker',
    badgeBg: 'bg-[#FFEDD5] text-[#0F172A]',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'Step-by-step 100-mark question proofs gave our batch clarity on scoring maximum marks.',
    offset: 'translate-y-4',
    rating: 5,
  },
  {
    name: 'Dhruv Shah',
    college: 'DDU Nadiad',
    role: 'IT, 3rd Year',
    badge: '100% Free Vault',
    badgeBg: 'bg-[#FED7AA] text-[#0F172A]',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'The SGPA predictor with real Indus syllabus credit maps is insanely accurate.',
    offset: '-translate-y-3',
    rating: 5,
  },
];

const HIGHLIGHT_PILLS = [
  { text: '100% Free Resources', bg: 'bg-[#FEF08A] text-[#0F172A]', offset: 'translate-y-2' },
  { text: 'Indus Verified Notes', bg: 'bg-[#BAE6FD] text-[#0F172A]', offset: '-translate-y-2' },
  { text: 'Solved 5-Year PYQs', bg: 'bg-[#FF5722] text-white', offset: 'translate-y-3' },
  { text: 'No Paywalls or Ads', bg: 'bg-[#4ADE80] text-[#0F172A]', offset: '-translate-y-3' },
  { text: 'Viva Cheat Sheets', bg: 'bg-[#C084FC] text-[#0F172A]', offset: 'translate-y-2' },
  { text: 'Tested Lab Manuals', bg: 'bg-[#FBCFE8] text-[#0F172A]', offset: '-translate-y-1' },
  { text: '5,000+ Students', bg: 'bg-[#FDE047] text-[#0F172A]', offset: 'translate-y-3' },
  { text: 'Real SGPA Predictor', bg: 'bg-[#38BDF8] text-[#0F172A]', offset: '-translate-y-2' },
];

export default function TestimonialsSection() {
  const renderCardSet = (prefix = 'set1') => (
    <div className="flex items-center gap-6 shrink-0 py-6">
      {TESTIMONIALS.map((t, idx) => (
        <div
          key={`${prefix}-${idx}`}
          className={`w-[320px] sm:w-[360px] shrink-0 bg-white rounded-[28px] p-6 border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${t.offset}`}
        >
          <div>
            {/* Header: Avatar, Name, College & Badge */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#0F172A] shadow-xs"
                />
                <div>
                  <h4 className="font-black text-sm sm:text-base text-hub-navy leading-tight">{t.name}</h4>
                  <p className="text-[11px] font-bold text-gray-500">{t.college}</p>
                </div>
              </div>
              <span className={`${t.badgeBg} px-2.5 py-0.5 rounded-lg border border-[#0F172A] text-[10px] font-black uppercase shadow-xs shrink-0`}>
                {t.badge}
              </span>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-0.5 text-amber-500 mb-2">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[15px] fill-current">
                  star
                </span>
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              "{t.quote}"
            </p>
          </div>

          {/* Footer Verified Tag */}
          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Verified Student
            </span>
            <span className="text-slate-400 font-bold">{t.role}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPillSet = (prefix = 'pill1') => (
    <div className="flex items-center gap-4 shrink-0 py-2">
      {HIGHLIGHT_PILLS.map((pill, idx) => (
        <span
          key={`${prefix}-${idx}`}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] uppercase tracking-wider shrink-0 ${pill.bg} ${pill.offset}`}
        >
          {pill.text}
        </span>
      ))}
    </div>
  );

  return (
    <section className="py-14 sm:py-18 md:py-24 relative overflow-hidden font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-3">
            <span className="text-amber-500 font-bold">★</span>
            <span>COMMUNITY PROOF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight">
            What Students{' '}
            <span className="relative inline-block text-amber-500">
              Say
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-3.5 text-amber-400 opacity-90 drop-shadow-xs"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path
                  d="M 0 5 Q 50 0 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>
        <p className="text-sm font-medium text-gray-600 max-w-md">
          Real feedback from Indus rankers, exam toppers, and engineering students across Gujarat.
        </p>
      </div>

      {/* ─── Track 1: Staggered Floating Cards Infinite Marquee ─── */}
      <div className="marquee-container relative w-full overflow-hidden py-4 pause-marquee-on-hover">
        {/* Left & Right Gradient Blur Masks matching the warm canvas */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div className="animate-marquee flex items-center gap-6" style={{ animationDuration: '45s' }}>
          {/* FIRST SET */}
          {renderCardSet('first')}

          {/* DUPLICATE SET (Required for seamless infinite loop) */}
          <div aria-hidden="true" className="flex items-center gap-6 shrink-0">
            {renderCardSet('dup')}
          </div>
        </div>
      </div>

      {/* ─── Track 2: Staggered Floating Badges / Highlight Pills Marquee ─── */}
      <div className="marquee-container relative w-full overflow-hidden pt-4 pb-2 pause-marquee-on-hover">
        {/* Left & Right Gradient Blur Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track (Reverse or complementary flow) */}
        <div className="animate-marquee flex items-center gap-4" style={{ animationDuration: '30s' }}>
          {/* FIRST SET OF BADGES */}
          {renderPillSet('first-pill')}

          {/* DUPLICATE SET (Required for seamless infinite loop) */}
          <div aria-hidden="true" className="flex items-center gap-4 shrink-0">
            {renderPillSet('dup-pill')}
          </div>
        </div>
      </div>
    </section>
  );
}
