import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOpportunities, useAnnouncements } from '../../hooks/useOpportunities';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatRelativeTime } from '../../services/opportunities/opportunitiesApi';
import { useOpportunitySubmit } from '../../hooks/useResourceRequest';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import Banner from '@/components/ui/astryx-banner';
import AnimatedList from '@/components/ui/animated-list';
import AcademicCalendar from './components/AcademicCalendar';
import { SplitText } from './components/CharacterText';
import schoolSvg from './components/school.svg';
import universitySvg from './components/university.svg';
import indiaSvg from './components/india.svg';
import screwSvg from './components/screw.svg';
import campusSvg from './components/campus.svg';


const CATEGORY_TABS = [
  { id: 'All', label: 'All Postings', icon: 'auto_awesome' },
  { id: 'Internship', label: 'Internships', icon: 'work' },
  { id: 'Hackathon', label: 'Hackathons', icon: 'emoji_events' },
  { id: 'Scholarship', label: 'Scholarships', icon: 'school' },
  { id: 'Open Source', label: 'Open Source & Grants', icon: 'terminal' },
  { id: 'Workshop', label: 'Workshops & Webinars', icon: 'psychology' },
  { id: 'Placement', label: 'Placements', icon: 'business_center' },
  { id: 'Remote', label: 'Remote & Online', icon: 'public' },
];

const SUBMIT_CATEGORIES = [
  { id: 'Internship', label: 'Internship' },
  { id: 'Hackathon', label: 'Hackathon' },
  { id: 'Scholarship', label: 'Scholarship' },
  { id: 'Open Source', label: 'Open Source / Grant' },
  { id: 'Workshop', label: 'Workshop / Webinar' },
  { id: 'Placement', label: 'Campus Placement / Job' },
  { id: 'Certification', label: 'Certification' },
  { id: 'General', label: 'General / Other' },
];

function matchesCategory(opp, filterId) {
  if (!filterId || filterId === 'All') return true;

  const cat = (opp.category || '').toLowerCase().trim();
  const tag = (opp.tag || '').toLowerCase().trim();
  const title = (opp.title || '').toLowerCase();
  const desc = (opp.description || '').toLowerCase();
  const f = filterId.toLowerCase().trim();

  if (f === 'internship' || f === 'internships') {
    return cat.includes('intern') || tag.includes('intern') || title.includes('intern');
  }
  if (f === 'hackathon' || f === 'hackathons') {
    return cat.includes('hackathon') || tag.includes('hackathon') || title.includes('hackathon');
  }
  if (f === 'scholarship' || f === 'scholarships') {
    return cat.includes('scholar') || tag.includes('scholar') || tag.includes('fund') || desc.includes('scholar');
  }
  if (f === 'open source' || f === 'opensource' || f === 'coding') {
    return (
      cat.includes('open source') ||
      cat.includes('coding') ||
      tag.includes('open source') ||
      tag.includes('source') ||
      tag.includes('gsoc') ||
      title.includes('open source') ||
      title.includes('gsoc') ||
      desc.includes('open source') ||
      desc.includes('gsoc')
    );
  }
  if (f === 'workshop' || f === 'workshops' || f === 'webinar' || f === 'webinars') {
    return (
      cat.includes('workshop') ||
      cat.includes('webinar') ||
      tag.includes('workshop') ||
      tag.includes('webinar') ||
      desc.includes('workshop') ||
      desc.includes('webinar')
    );
  }
  if (f === 'placement' || f === 'placements' || f === 'job') {
    return cat.includes('placement') || cat.includes('job') || tag.includes('placement') || tag.includes('campus');
  }
  if (f === 'remote' || f === 'online') {
    return (
      cat.includes('remote') ||
      cat.includes('online') ||
      tag.includes('remote') ||
      tag.includes('online') ||
      desc.includes('remote') ||
      desc.includes('online')
    );
  }

  return cat.includes(f) || tag.includes(f) || title.includes(f);
}

const CLOSING_SOON_DATA = [
  {
    id: 'close-1',
    title: 'Google Summer of Code 2026',
    category: 'Open Source',
    deadline: 'In 3 days',
    urgent: true,
    tag: 'Stipend $1500+',
    link: 'https://summerofcode.withgoogle.com',
  },
  {
    id: 'close-2',
    title: 'Microsoft Explore Internship',
    category: 'Internship',
    deadline: 'This Friday',
    urgent: true,
    tag: 'Paid • 2nd Year',
    link: 'https://careers.microsoft.com',
  },
  {
    id: 'close-3',
    title: 'Smart India Hackathon (SIH)',
    category: 'Hackathon',
    deadline: 'Closing soon',
    urgent: false,
    tag: 'Govt • ₹1 Lakh Prize',
    link: 'https://sih.gov.in',
  },
];

function Opportunities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);
  const { toasts, addToast, removeToast } = useToast();

  // Close dialogs on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedOpp(null);
        setIsSubmitModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedOpp || isSubmitModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedOpp, isSubmitModalOpen]);

  const {
    formData,
    handleChange,
    handleSubmit,
    status: submitStatus,
    errorMessage: submitError,
    reset: resetForm,
  } = useOpportunitySubmit();

  const { opportunities, loading: oppLoading, error: oppError, refetch: refetchOpp } = useOpportunities();
  const { announcements, loading: annLoading, error: annError } = useAnnouncements();

  const handleShareLink = (opp, e) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      message: 'Opportunity link copied to clipboard!',
      type: 'success',
      duration: 2500,
    });
  };

  useEffect(() => {
    if (submitStatus === 'success') {
      addToast({
        message: 'Opportunity submitted! It will appear once reviewed by admin.',
        type: 'success',
        duration: 5000,
      });
      setIsSubmitModalOpen(false);
      resetForm();
    }
    if (submitStatus === 'error' && submitError) {
      addToast({ message: submitError, type: 'error', duration: 5000 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus, submitError]);

  // Filtering
  const filteredOpportunities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return opportunities.filter((opp) => {
      const matchesSearch =
        !q ||
        (opp.title && opp.title.toLowerCase().includes(q)) ||
        (opp.description && opp.description.toLowerCase().includes(q)) ||
        (opp.category && opp.category.toLowerCase().includes(q)) ||
        (opp.tag && opp.tag.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeFilter === 'All') return true;

      return matchesCategory(opp, activeFilter);
    });
  }, [opportunities, searchQuery, activeFilter]);

  // Category counts accurately reflecting active items matching each tab
  const categoryCounts = useMemo(() => {
    const counts = { All: opportunities.length };
    CATEGORY_TABS.forEach((tab) => {
      if (tab.id !== 'All') {
        counts[tab.id] = opportunities.filter((opp) => matchesCategory(opp, tab.id)).length;
      }
    });
    return counts;
  }, [opportunities]);

  // Visual Theme Helpers with Clean High-Contrast Palettes Matching Surrounding Theme
  const getCategoryTheme = (category, tag) => {
    const text = `${category || ''} ${tag || ''}`.toLowerCase();

    // 1. Internships / Placements / Jobs / Companies -> Warm Gold & Amber (University / Campus)
    if (
      text.includes('company') ||
      text.includes('companies') ||
      text.includes('campus') ||
      text.includes('placement') ||
      text.includes('intern') ||
      text.includes('job') ||
      text.includes('hiring')
    ) {
      return {
        cardName: 'Internships & Careers',
        tagDotColor: 'bg-amber-500 shadow-[0_0_6px_#f59e0b]',
        tagBg: 'bg-amber-50 text-amber-900 border-amber-300/80',
        backgroundGradient: 'from-amber-500/[0.06] via-orange-500/[0.02] to-transparent',
        borderHover: 'hover:border-amber-400/80',
        glow: 'hover:shadow-[0_16px_36px_rgba(245,158,11,0.12)]',
        ctaColor: 'text-amber-700 group-hover:text-amber-950',
        titleHover: 'group-hover:text-amber-600',
        pillColor: 'bg-amber-400',
        badge: 'bg-amber-50 text-amber-900 border-amber-300/80',
        btnBg: 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold',
        icon: 'work',
        svgIcon: universitySvg,
        tagText: 'Open for Applications',
        ctaText: 'Explore role',
      };
    }

    // 2. Hackathons / Coding / Open Source / Builders -> Tech Sky Blue & Cyan (India / Hackathons)
    if (
      text.includes('builder') ||
      text.includes('hackathon') ||
      text.includes('source') ||
      text.includes('coding') ||
      text.includes('tech') ||
      text.includes('dev') ||
      text.includes('gsoc')
    ) {
      return {
        cardName: 'Hackathons & Coding',
        tagDotColor: 'bg-sky-500 shadow-[0_0_6px_#0284c7]',
        tagBg: 'bg-sky-50 text-sky-900 border-sky-300/80',
        backgroundGradient: 'from-sky-500/[0.06] via-indigo-500/[0.02] to-transparent',
        borderHover: 'hover:border-sky-400/80',
        glow: 'hover:shadow-[0_16px_36px_rgba(14,165,233,0.12)]',
        ctaColor: 'text-sky-700 group-hover:text-sky-950',
        titleHover: 'group-hover:text-sky-600',
        pillColor: 'bg-sky-500',
        badge: 'bg-sky-50 text-sky-900 border-sky-300/80',
        btnBg: 'bg-sky-500 hover:bg-sky-600 text-white font-bold',
        icon: 'code',
        svgIcon: indiaSvg,
        tagText: 'Open for Registration',
        ctaText: 'View hackathon',
      };
    }

    // 3. Scholarships / Grants / Fellowships / Scouts -> Royal Purple & Lavender (School / Grants)
    if (
      text.includes('scout') ||
      text.includes('scholarship') ||
      text.includes('grant') ||
      text.includes('funded') ||
      text.includes('fellow') ||
      text.includes('prize')
    ) {
      return {
        cardName: 'Scholarships & Grants',
        tagDotColor: 'bg-purple-500 shadow-[0_0_6px_#9333ea]',
        tagBg: 'bg-purple-50 text-purple-900 border-purple-300/80',
        backgroundGradient: 'from-purple-500/[0.06] via-pink-500/[0.02] to-transparent',
        borderHover: 'hover:border-purple-400/80',
        glow: 'hover:shadow-[0_16px_36px_rgba(168,85,247,0.12)]',
        ctaColor: 'text-purple-700 group-hover:text-purple-950',
        titleHover: 'group-hover:text-purple-600',
        pillColor: 'bg-purple-500',
        badge: 'bg-purple-50 text-purple-900 border-purple-300/80',
        btnBg: 'bg-purple-600 hover:bg-purple-700 text-white font-bold',
        icon: 'school',
        svgIcon: schoolSvg,
        tagText: 'Scholarship Grant',
        ctaText: 'Apply for grant',
      };
    }

    // 4. Workshops / Webinars / Engineering & Tools -> Fresh Emerald (Screw / Tools)
    if (
      text.includes('workshop') ||
      text.includes('webinar') ||
      text.includes('certif') ||
      text.includes('train') ||
      text.includes('bootcamp') ||
      text.includes('tool')
    ) {
      return {
        cardName: 'Workshops & Events',
        tagDotColor: 'bg-emerald-500 shadow-[0_0_6px_#10b981]',
        tagBg: 'bg-emerald-50 text-emerald-900 border-emerald-300/80',
        backgroundGradient: 'from-emerald-500/[0.06] via-teal-500/[0.02] to-transparent',
        borderHover: 'hover:border-emerald-400/80',
        glow: 'hover:shadow-[0_16px_36px_rgba(16,185,129,0.12)]',
        ctaColor: 'text-emerald-700 group-hover:text-emerald-950',
        titleHover: 'group-hover:text-emerald-600',
        pillColor: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-900 border-emerald-300/80',
        btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        icon: 'psychology',
        svgIcon: screwSvg,
        tagText: 'Live Workshop',
        ctaText: 'Reserve seat',
      };
    }

    // Default / General (Campus)
    return {
      cardName: 'Opportunities Hub',
      tagDotColor: 'bg-indigo-500 shadow-[0_0_6px_#6366f1]',
      tagBg: 'bg-indigo-50 text-indigo-900 border-indigo-300/80',
      backgroundGradient: 'from-indigo-500/[0.06] via-sky-500/[0.02] to-transparent',
      borderHover: 'hover:border-indigo-400/80',
      glow: 'hover:shadow-[0_16px_36px_rgba(99,102,241,0.12)]',
      ctaColor: 'text-indigo-700 group-hover:text-indigo-950',
      titleHover: 'group-hover:text-indigo-600',
      pillColor: 'bg-indigo-500',
      badge: 'bg-indigo-50 text-indigo-900 border-indigo-300/80',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
      icon: 'auto_awesome',
      svgIcon: campusSvg,
      tagText: 'Featured Post',
      ctaText: 'Explore opportunity',
    };
  };



  return (
    <div className="pt-20 bg-[#f8fafc] text-slate-800 font-sans min-h-screen pb-20 relative overflow-x-clip selection:bg-amber-300 selection:text-slate-900">
      {/* ─── Ambient Canvas & Subtle Grid Pattern ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-amber-300/25 via-orange-300/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[25%] -right-24 w-[550px] h-[550px] bg-gradient-to-bl from-sky-300/25 via-indigo-300/15 to-transparent rounded-full blur-3xl opacity-65" />
        <div className="absolute top-[65%] -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-300/20 via-pink-300/10 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 pt-6">
        {/* ─── HERO HEADER SECTION WITH KINETIC TYPOGRAPHY ─── */}
        <section className="pt-4 pb-6 text-center max-w-4xl mx-auto">
          {/* Status Eyebrow Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>Discover Top Opportunities</span>
            <span className="text-amber-400">•</span>
            <span className="text-slate-600 font-semibold">Updated Daily</span>
          </div>

          {/* Headline with Per-Character Kinetic Text Effect */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <SplitText
              text="Accelerate Your"
              className="text-slate-900"
              charClassName="hover:text-amber-500 transition-colors"
              stagger={0.025}
              delay={0.05}
            />
            <span className="relative inline-flex items-baseline pb-1">
              <SplitText
                text="Career Journey"
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 drop-shadow-xs"
                charClassName="hover:scale-110 transition-transform"
                stagger={0.03}
                delay={0.2}
              />
              <svg
                className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-amber-400/80 pointer-events-none"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path d="M0 6 Q 50 0 100 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-8">
            Curated internships, high-impact hackathons, prestigious scholarships, campus placement drives, and open-source grants.
          </p>

          {/* Metrics Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-7 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">verified</span>
              <span>{opportunities.length || '50+'} Verified Opportunities</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">update</span>
              <span>Updated Daily</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <span className="material-symbols-outlined text-sky-500 text-[18px]">public</span>
              <span>100% Free &amp; Open Access</span>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-7">
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center gap-1.5 pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[22px]">
                  search
                </span>
              </div>

              <input
                type="text"
                id="opportunity-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                placeholder="Search opportunities by title, category, company, or keywords..."
                aria-label="Search opportunities"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <span className="hidden sm:inline-block absolute right-4 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-400 border border-slate-200 pointer-events-none">
                  SEARCH
                </span>
              )}
            </div>
          </div>

          {/* Categorized Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2" role="group" aria-label="Filter opportunities">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count = tab.id === 'All' ? categoryCounts.All : categoryCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30 border border-amber-400 scale-[1.03]'
                      : 'bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px] leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {typeof count === 'number' && count > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-900 text-amber-300' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── MAIN FEED & SIDEBAR GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Main Feed (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Feed Status Header */}
            <div className="flex items-center justify-between px-1 pb-1 text-xs sm:text-sm text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Showing <strong className="text-slate-900 font-bold">{filteredOpportunities.length}</strong>{' '}
                  {activeFilter === 'All'
                    ? 'opportunities'
                    : CATEGORY_TABS.find((t) => t.id === activeFilter)?.label || activeFilter}
                </span>
              </div>
              {(searchQuery || activeFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('All');
                  }}
                  className="text-amber-700 hover:text-amber-950 hover:underline text-xs cursor-pointer font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Reset Filter</span>
                </button>
              )}
            </div>

            {/* Error State */}
            {oppError && !oppLoading && (
              <ErrorState message={oppError} onRetry={refetchOpp} className="mb-6" />
            )}

            {/* Loading Skeletons */}
            {oppLoading && (
              <div className="flex flex-col gap-4 sm:gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-[22px] sm:rounded-[26px] bg-white/80 border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between min-h-[190px] shadow-2xs"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-7 w-36 rounded-full bg-slate-200/70" />
                      <div className="h-7 w-7 rounded-full bg-slate-200/70" />
                    </div>
                    <div className="space-y-3 my-4">
                      <div className="h-6 w-3/4 rounded-lg bg-slate-200/80" />
                      <div className="h-4 w-full rounded bg-slate-200/60" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="h-4 w-20 rounded bg-slate-200/60" />
                      <div className="h-4 w-24 rounded bg-slate-200/60" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Opportunities List in Vertical Stack */}
            {!oppLoading && !oppError && (
              <div className="flex flex-col gap-4 sm:gap-5">
                {filteredOpportunities.map((opp) => {
                  const theme = getCategoryTheme(opp.category, opp.tag);

                  return (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedOpp(opp)}
                      className={`group relative bg-white/95 backdrop-blur-md rounded-[22px] sm:rounded-[26px] p-6 sm:p-7 md:p-8 border border-slate-200/90 ${theme.borderHover} shadow-[0_4px_24px_rgba(0,0,0,0.04)] ${theme.glow} transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between`}
                    >
                      {/* Ambient Gradient Background Layer */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.backgroundGradient} pointer-events-none transition-opacity duration-300`} />

                      {/* SVG Illustration Artwork */}
                      <div
                        className="absolute top-4 sm:top-6 right-3 sm:right-6 md:right-8 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 pointer-events-none opacity-25 sm:opacity-35 group-hover:opacity-85 group-hover:scale-110 group-active:scale-125 transition-opacity duration-300 select-none overflow-hidden flex items-center justify-center z-0"
                      >
                        <img
                          src={opp.image || opp.imageUrl || opp.logo || theme.svgIcon}
                          alt=""
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)] group-hover:rotate-3 group-active:rotate-[-6deg] transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>

                      {/* Top Bar Header */}
                      <div className="flex items-center justify-between gap-3 mb-3.5 relative z-10">
                        {/* Status Pill Tag with Glowing Dot */}
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${theme.tagBg} backdrop-blur-md border text-xs font-semibold shadow-2xs`}>
                          <span className={`w-2 h-2 rounded-full ${theme.tagDotColor}`} />
                          <span className="truncate max-w-[160px] sm:max-w-[260px]">
                            {opp.tag || opp.category || theme.tagText}
                          </span>
                        </div>

                        {/* Top Right Badges & Share */}
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {opp.deadline && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shrink-0">
                              <span className="material-symbols-outlined text-[13px]">timer</span>
                              <span>{opp.deadline}</span>
                            </span>
                          )}

                          <button
                            onClick={(e) => handleShareLink(opp, e)}
                            className="p-1.5 sm:p-2 rounded-full border border-slate-200 bg-slate-50/80 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                            title="Copy link"
                            aria-label="Share opportunity"
                          >
                            <span className="material-symbols-outlined text-[15px] leading-none">share</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Body: Large Bold Title & Description */}
                      <div className="relative z-10 pr-24 sm:pr-36 md:pr-44 my-2">
                        <h2
                          className={`text-lg sm:text-xl md:text-2xl font-black text-slate-950 ${theme.titleHover} transition-colors tracking-tight leading-snug mb-2`}
                        >
                          {opp.title}
                        </h2>

                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium max-w-2xl">
                          {opp.description}
                        </p>
                      </div>

                      {/* Card Footer Call to Action */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 relative z-10">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>
                            {opp.created_at || opp.createdAt
                              ? formatRelativeTime(opp.created_at || opp.createdAt)
                              : 'Recently added'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedOpp(opp)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-950 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          >
                            Details
                          </button>
                          {opp.link ? (
                            <a
                              href={opp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 ${theme.ctaColor} hover:opacity-90 font-bold text-xs sm:text-sm tracking-wide bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-3 py-1 rounded-full shadow-2xs transition-all`}
                            >
                              <span>Apply now</span>
                              <span className="text-base leading-none transition-transform duration-200 group-hover:translate-x-1">
                                →
                              </span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedOpp(opp)}
                              className={`inline-flex items-center gap-1.5 ${theme.ctaColor} font-bold text-xs sm:text-sm tracking-wide cursor-pointer`}
                            >
                              <span>{theme.ctaText}</span>
                              <span className="text-base leading-none transition-transform duration-200 group-hover:translate-x-1.5">
                                →
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Empty State */}
                {filteredOpportunities.length === 0 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
                      <span className="material-symbols-outlined text-[32px]">search_off</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">No matching opportunities found</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                      No results found for &quot;{searchQuery || activeFilter}&quot;. Try adjusting your keywords or category filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('All');
                      }}
                      className="px-5 py-2.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-xs transition-all shadow-md cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR (4 Columns) ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Live Announcements Widget */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Live Announcements
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Campus Updates
                </span>
              </div>

              <div className="space-y-3">
                {annLoading && Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-20 rounded-2xl bg-slate-100 border border-slate-200" />
                ))}

                {!annLoading && !annError && (
                  <>
                    {announcements.filter((ann) => !dismissedAnnouncements.includes(ann.id)).length > 0 ? (
                      <AnimatedList delay={300} className="w-full">
                        {announcements
                          .filter((ann) => !dismissedAnnouncements.includes(ann.id))
                          .map((ann) => {
                            const badge = (ann.badge || '').toLowerCase();
                            const text = (ann.text || '').toLowerCase();
                            const status =
                              badge.includes('urgent') || badge.includes('alert') || text.includes('deadline') || text.includes('maintenance')
                                ? 'warning'
                                : badge.includes('new') || badge.includes('feature') || text.includes('feature')
                                ? 'info'
                                : 'success';

                            return (
                              <Banner
                                key={ann.id}
                                status={status}
                                variant="light"
                                title={ann.badge ? `${ann.badge} • ${formatRelativeTime(ann.created_at || ann.createdAt)}` : 'Campus Update'}
                                description={ann.text}
                                isDismissable
                                onDismiss={() => setDismissedAnnouncements((prev) => [...prev, ann.id])}
                              />
                            );
                          })}
                      </AnimatedList>
                    ) : (
                      <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400 font-medium">
                        All announcements acknowledged for now.
                      </div>
                    )}
                  </>
                )}

                {annError && !annLoading && (
                  <p className="text-xs text-rose-500 font-medium">Could not load announcements.</p>
                )}
              </div>
            </div>




            {/* 2. Urgent / Closing Soon Widget */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-5 sm:p-6 border border-amber-300/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-[20px] animate-bounce">
                    local_fire_department
                  </span>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Closing This Week
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  Critical Deadlines
                </span>
              </div>

              <div className="space-y-3">
                {CLOSING_SOON_DATA.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 rounded-2xl bg-white/90 hover:bg-white border border-amber-200/80 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          {item.tag}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                        {item.deadline}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 3. Academic Calendar Widget */}
            <div className="bg-white rounded-3xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/80">
              <AcademicCalendar />
            </div>
          </div>
        </div>
      </main>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 relative z-10">
        <div className="bg-[#0B132B] rounded-3xl p-8 sm:p-12 md:p-14 text-center relative overflow-hidden shadow-2xl border border-white/10 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none">
              <pattern id="cta-grid-opp-clean" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#cta-grid-opp-clean)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
              <span>Community-Driven Hub</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight text-white">
              Know of an opportunity we missed?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed font-medium">
              Share hackathons, summer internships, or study grants with the campus community. Submissions are reviewed and made live for all students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full sm:w-auto bg-[#FACC15] hover:bg-yellow-400 text-slate-950 font-black px-8 py-3.5 rounded-full text-sm shadow-lg hover:shadow-yellow-400/20 hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Submit Opportunity</span>
              </button>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold border-2 border-white/40 hover:border-white px-8 py-3.5 rounded-full text-sm transition-all text-center inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">contact_support</span>
                <span>Request a Resource</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPPORTUNITY DETAILS MODAL ─── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedOpp && (() => {
            const theme = getCategoryTheme(selectedOpp.category, selectedOpp.tag);

            return (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Click backdrop to close */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm cursor-pointer"
                  onClick={() => setSelectedOpp(null)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white rounded-3xl p-6 sm:p-8 md:p-9 max-w-xl w-full border-2 border-amber-300/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-10 overflow-hidden my-auto max-h-[90vh] flex flex-col justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Accent Strip */}
                  <div className={`absolute top-0 left-0 right-0 h-2 ${theme.pillColor} z-20`} />

                  {/* ── Ambient Screen-Covering Vector Wave with Undulating Low Opacity ── */}
                  <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center">
                    {/* Expanding Ambient Radial Color Wave */}
                    <motion.div
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: [0.8, 1.4, 1.1], opacity: [0.35, 0.15, 0.25] }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`absolute w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-tr ${theme.backgroundGradient} blur-3xl`}
                    />

                    {/* Smooth Fluid Vector Wave */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0.3, rotate: -12 }}
                      animate={{
                        scale: [1, 1.08, 0.98, 1],
                        opacity: [0.10, 0.17, 0.09, 0.10],
                        rotate: [-3, 4, -2, -3],
                        y: [0, -10, 6, 0],
                        x: [0, 8, -6, 0],
                      }}
                      transition={{
                        scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                        opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                        x: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] absolute -right-6 -bottom-6 sm:-right-10 sm:-bottom-10 flex items-center justify-center"
                    >
                      <img
                        src={selectedOpp.image || selectedOpp.imageUrl || selectedOpp.logo || theme.svgIcon}
                        alt=""
                        className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
                      />
                    </motion.div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer z-20 shadow-2xs hover:scale-105"
                    aria-label="Close dialog"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>

                  {/* ── Cascading Text Content Layer ── */}
                  {/* 1. Header Metadata Pill Badges */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center gap-2 mb-4 flex-wrap pt-2 relative z-10"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badge} shadow-2xs backdrop-blur-md`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{theme.icon}</span>
                      <span>{selectedOpp.tag || selectedOpp.category || 'Opportunity'}</span>
                    </span>

                    {selectedOpp.deadline && (
                      <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 text-xs font-bold">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        <span>Deadline: {selectedOpp.deadline}</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>
                        {selectedOpp.created_at || selectedOpp.createdAt
                          ? formatRelativeTime(selectedOpp.created_at || selectedOpp.createdAt)
                          : 'Recently added'}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs font-bold">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      <span>Verified Post</span>
                    </span>
                  </motion.div>

                  {/* 2. Expanded Title with Illustration Thumbnail */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                    className="flex items-start gap-3.5 mb-4 relative z-10"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-slate-100 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={selectedOpp.image || selectedOpp.imageUrl || selectedOpp.logo || theme.svgIcon}
                        alt={selectedOpp.title}
                        className="w-full h-full object-contain filter drop-shadow-xs"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight"
                      >
                        {selectedOpp.title}
                      </h2>
                    </div>
                  </motion.div>

                  {/* 3. Full Description Box & Official Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.4, ease: 'easeOut' }}
                    className="relative z-10 space-y-3 mb-4"
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 backdrop-blur-md border border-slate-200/80 max-h-[260px] overflow-y-auto shadow-inner">
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                        {selectedOpp.description}
                      </p>
                    </div>

                    {selectedOpp.link && (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50/90 backdrop-blur-sm border border-amber-200/80 text-xs text-amber-900 shadow-2xs">
                        <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">link</span>
                        <span className="font-bold shrink-0">Official URL:</span>
                        <a
                          href={selectedOpp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-amber-700 underline font-mono text-[11px] hover:text-amber-900 font-semibold"
                        >
                          {selectedOpp.link}
                        </a>
                      </div>
                    )}
                  </motion.div>

                  {/* 4. Action Row (Share, Social, Apply) */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 relative z-10"
                  >
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                      <button
                        onClick={(e) => handleShareLink(selectedOpp, e)}
                        className="p-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Copy link"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        <span>Copy</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = `*${selectedOpp.title}*\n${selectedOpp.description || ''}\n\nCategory: ${selectedOpp.category || 'Opportunity'}\nDeadline: ${selectedOpp.deadline || 'Apply Soon'}\nLink: ${selectedOpp.link || window.location.href}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Share to WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">chat</span>
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = `*${selectedOpp.title}*\n${selectedOpp.description || ''}\n\nCategory: ${selectedOpp.category || 'Opportunity'}\nDeadline: ${selectedOpp.deadline || 'Apply Soon'}`;
                          window.open(`https://t.me/share/url?url=${encodeURIComponent(selectedOpp.link || window.location.href)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2 px-3 rounded-xl border border-sky-300 bg-sky-50 text-sky-950 hover:bg-sky-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Share to Telegram"
                      >
                        <span className="material-symbols-outlined text-[16px] text-sky-600">send</span>
                        <span>Telegram</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {selectedOpp.link ? (
                        <a
                          href={selectedOpp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 text-center cursor-pointer hover:shadow-lg"
                        >
                          <span>Direct Apply / Portal</span>
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                      ) : (
                        <Link
                          to="/contact"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 text-center"
                        >
                          <span>Inquire with Admin</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}

      {/* ─── SUBMIT OPPORTUNITY MODAL ─── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isSubmitModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm cursor-pointer"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  resetForm();
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-300 shadow-2xl relative z-10 my-auto max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    resetForm();
                  }}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">publish</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 leading-none">Submit Opportunity</h3>
                    <p className="text-xs text-slate-500 mt-1">Help peers discover new programs and jobs</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="opp-title" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Opportunity Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="opp-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g. Google Summer of Code 2026"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                      disabled={submitStatus === 'loading'}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="opp-category" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="opp-category"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800 cursor-pointer"
                        disabled={submitStatus === 'loading'}
                      >
                        {SUBMIT_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="opp-email" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="opp-email"
                        type="email"
                        value={formData.submitterEmail}
                        onChange={(e) => handleChange('submitterEmail', e.target.value)}
                        placeholder="student@gmail.com"
                        pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                        title="Please enter a valid @gmail.com address"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                        disabled={submitStatus === 'loading'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="opp-link" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                        Apply / Official Link
                      </label>
                      <input
                        id="opp-link"
                        type="url"
                        value={formData.link || ''}
                        onChange={(e) => handleChange('link', e.target.value)}
                        placeholder="https://company.com/apply"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                        disabled={submitStatus === 'loading'}
                      />
                    </div>

                    <div>
                      <label htmlFor="opp-deadline" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                        Deadline / Due Date
                      </label>
                      <input
                        id="opp-deadline"
                        type="text"
                        value={formData.deadline || ''}
                        onChange={(e) => handleChange('deadline', e.target.value)}
                        placeholder="e.g. Oct 31, 2026 or In 3 days"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800"
                        disabled={submitStatus === 'loading'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="opp-desc" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Description &amp; Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="opp-desc"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Provide details about the role, eligibility, stipend, and selection process..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
                      disabled={submitStatus === 'loading'}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitModalOpen(false);
                        resetForm();
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      disabled={submitStatus === 'loading'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      disabled={submitStatus === 'loading'}
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          Submit for Review
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Opportunities;
