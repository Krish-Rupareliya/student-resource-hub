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
import { ChevronDown, ExternalLink, Share2, Sparkles } from 'lucide-react';
import schoolSvg from './components/school.svg';
import universitySvg from './components/university.svg';
import indiaSvg from './components/india.svg';
import screwSvg from './components/screw.svg';
import campusSvg from './components/campus.svg';
import FramerButton from '../../components/ui/FramerButton';

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

  // Curated Retro-Modern Neo-Brutalist Category Theme Definition
  const getCategoryTheme = (category, tag) => {
    const text = `${category || ''} ${tag || ''}`.toLowerCase();

    // 1. Internships / Placements / Jobs -> Butter Yellow with Ink Border
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
        badgeBg: 'bg-[#FEF08A] text-[#713F12] border-[#0F172A]',
        accentColor: '#FF5722',
        accentBg: 'bg-[#FEF08A]',
        pillColor: 'bg-[#FEF08A]',
        backgroundGradient: 'from-amber-400/25 via-orange-300/15 to-transparent',
        icon: 'work',
        svgIcon: universitySvg,
        tagText: 'Open for Applications',
        ctaText: 'Explore Role',
      };
    }

    // 2. Hackathons / Coding / Open Source -> Fresh Sky Blue
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
        badgeBg: 'bg-[#BAE6FD] text-[#0369A1] border-[#0F172A]',
        accentColor: '#0284c7',
        accentBg: 'bg-[#BAE6FD]',
        pillColor: 'bg-[#38BDF8]',
        backgroundGradient: 'from-sky-400/25 via-indigo-300/15 to-transparent',
        icon: 'terminal',
        svgIcon: indiaSvg,
        tagText: 'Tech Challenge',
        ctaText: 'View Challenge',
      };
    }

    // 3. Scholarships / Grants / Fellowships -> Fresh Mint Emerald
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
        badgeBg: 'bg-[#BBF7D0] text-[#14532D] border-[#0F172A]',
        accentColor: '#16a34a',
        accentBg: 'bg-[#BBF7D0]',
        pillColor: 'bg-[#4ADE80]',
        backgroundGradient: 'from-emerald-400/25 via-teal-300/15 to-transparent',
        icon: 'school',
        svgIcon: schoolSvg,
        tagText: 'Scholarship Grant',
        ctaText: 'Apply for Grant',
      };
    }

    // 4. Workshops / Webinars / Training -> Warm Peach
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
        badgeBg: 'bg-[#FED7AA] text-[#7C2D12] border-[#0F172A]',
        accentColor: '#ea580c',
        accentBg: 'bg-[#FED7AA]',
        pillColor: 'bg-[#FB923C]',
        backgroundGradient: 'from-orange-400/25 via-amber-300/15 to-transparent',
        icon: 'psychology',
        svgIcon: screwSvg,
        tagText: 'Live Workshop',
        ctaText: 'Reserve Seat',
      };
    }

    // Default / General -> Bubblegum Rose
    return {
      cardName: 'Opportunities Hub',
      badgeBg: 'bg-[#FBCFE8] text-[#831843] border-[#0F172A]',
      accentColor: '#db2777',
      accentBg: 'bg-[#FBCFE8]',
      pillColor: 'bg-[#F472B6]',
      backgroundGradient: 'from-pink-400/25 via-purple-300/15 to-transparent',
      icon: 'auto_awesome',
      svgIcon: campusSvg,
      tagText: 'Campus Opportunity',
      ctaText: 'Explore Details',
    };
  };

  return (
    <div className="pt-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen pb-20 relative overflow-x-clip selection:bg-amber-300 selection:text-hub-navy">
      {/* ─── Architectural Dot Bulletin Canvas Pattern ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: 'radial-gradient(#0F172A 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10 space-y-4 pt-4 sm:pt-6">
        {/* ─── HERO HEADER SECTION (CAMPUS BULLETIN RADAR) ─── */}
        <section className="pt-2 pb-6 text-center max-w-5xl mx-auto px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[16px] text-[#FF5722]">bolt</span>
            <span>Campus Opportunities Radar</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#0F172A]">Updated Daily</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-hub-navy tracking-tight leading-tight mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <SplitText
              text="Accelerate Your"
              className="text-hub-navy"
              charClassName="hover:text-[#FF5722] transition-colors"
              stagger={0.02}
              delay={0.05}
            />
            <span className="relative inline-flex items-baseline pb-1">
              <SplitText
                text="Career Journey"
                className="text-[#FF5722] underline decoration-[#FEF08A] decoration-[6px] underline-offset-4"
                charClassName="hover:scale-105 transition-transform"
                stagger={0.025}
                delay={0.15}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium mb-6">
            Hand-curated internships, top hackathons, prestigious scholarships, campus placement drives, and open-source grants verified for Indus students.
          </p>

          {/* Metrics Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-6 text-xs sm:text-sm font-black text-[#0F172A]">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:-translate-y-0.5 transition-transform">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">verified</span>
              <span>{opportunities.length || '50+'} Verified Opportunities</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BBF7D0] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#14532D] hover:-translate-y-0.5 transition-transform">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">update</span>
              <span>Active Deadlines</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BAE6FD] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0369A1] hover:-translate-y-0.5 transition-transform">
              <span className="material-symbols-outlined text-sky-700 text-[18px]">public</span>
              <span>100% Free &amp; Open Access</span>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-6">
            <div className="relative flex items-center bg-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0_#0F172A] focus-within:shadow-[6px_6px_0_#FF5722] focus-within:-translate-y-0.5 rounded-2xl transition-all">
              <div className="absolute left-4 flex items-center gap-1.5 pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[22px]">search</span>
              </div>

              <input
                type="text"
                id="opportunity-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-transparent focus:outline-none text-sm sm:text-base font-bold text-[#0F172A] placeholder:text-slate-400"
                placeholder="Search opportunities by title, category, company, or keywords..."
                aria-label="Search opportunities"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0F172A] transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <span className="hidden sm:inline-block absolute right-3.5 px-2 py-0.5 rounded-md bg-[#FEF08A] text-[10px] font-mono font-black text-[#0F172A] border border-[#0F172A] pointer-events-none">
                  SEARCH
                </span>
              )}
            </div>
          </div>

          {/* Categorized Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 max-w-5xl mx-auto" role="group" aria-label="Filter opportunities">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count = tab.id === 'All' ? categoryCounts.All : categoryCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase transition-all duration-200 cursor-pointer border-2 border-[#0F172A] ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-[3px_3px_0_#FF5722] -translate-y-0.5 scale-[1.02]'
                      : 'bg-white hover:bg-[#FEF08A] text-[#0F172A] shadow-[2px_2px_0_#0F172A] hover:-translate-y-0.5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {typeof count === 'number' && count > 0 && (
                    <span
                      className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded border ${
                        isActive
                          ? 'bg-[#FEF08A] text-[#0F172A] border-[#FEF08A]'
                          : 'bg-slate-100 text-[#0F172A] border-slate-300'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start mt-4 sm:mt-6">
          {/* Main Feed (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Feed Status Header */}
            <div className="flex items-center justify-between px-1 pb-1 text-xs sm:text-sm text-slate-600 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0F172A]" />
                <span>
                  Showing <strong className="text-[#0F172A] font-black">{filteredOpportunities.length}</strong>{' '}
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
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#0F172A] border border-[#0F172A] font-black text-xs shadow-2xs cursor-pointer flex items-center gap-1 transition-all"
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
                    className="animate-pulse rounded-[24px] bg-white border-2 border-[#0F172A] p-6 sm:p-7 flex flex-col justify-between min-h-[190px] shadow-[4px_4px_0_#0F172A]"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-36 rounded-md bg-slate-200" />
                      <div className="h-6 w-16 rounded-md bg-slate-200" />
                    </div>
                    <div className="space-y-3 my-4">
                      <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
                      <div className="h-4 w-full rounded bg-slate-100" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <div className="h-4 w-20 rounded bg-slate-200" />
                      <div className="h-6 w-24 rounded-lg bg-slate-200" />
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
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedOpp(opp)}
                      className="group relative bg-white rounded-[24px] p-6 sm:p-7 border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
                    >
                      {/* Corner Screw Accent */}
                      <img
                        src={screwSvg}
                        alt=""
                        className="absolute top-3.5 right-3.5 w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all select-none pointer-events-none z-10"
                      />

                      {/* Background Watermark Artwork */}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:right-4 md:right-6 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 opacity-15 sm:opacity-20 group-hover:opacity-35 group-hover:scale-105 transition-all duration-300 pointer-events-none select-none z-0">
                        <img
                          src={opp.image || opp.imageUrl || opp.logo || theme.svgIcon}
                          alt=""
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Top Bar Header */}
                      <div className="flex items-center justify-between gap-3 mb-3 relative z-10 pr-2 sm:pr-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${theme.badgeBg} border-[1.5px] text-xs font-black uppercase tracking-wider shadow-2xs`}>
                          <span className="material-symbols-outlined text-[15px]">{theme.icon}</span>
                          <span className="truncate max-w-[160px] sm:max-w-[260px]">
                            {opp.tag || opp.category || theme.tagText}
                          </span>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {opp.deadline && (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-lg border-[1.5px] shadow-2xs ${
                                opp.urgent
                                  ? 'bg-red-100 text-red-800 border-red-400'
                                  : 'bg-[#FEF08A] text-[#713F12] border-[#0F172A]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">timer</span>
                              <span>{opp.deadline}</span>
                            </span>
                          )}

                          <button
                            onClick={(e) => handleShareLink(opp, e)}
                            className="p-1.5 rounded-lg border-[1.5px] border-[#0F172A] bg-white hover:bg-[#FEF08A] text-[#0F172A] shadow-[1.5px_1.5px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                            title="Copy link"
                            aria-label="Share opportunity"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="relative z-10 pr-2 sm:pr-8 my-1.5">
                        <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] group-hover:text-[#FF5722] transition-colors leading-snug tracking-tight mb-2">
                          {opp.title}
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium">
                          {opp.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-200 relative z-10">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>
                            {opp.created_at || opp.createdAt
                              ? formatRelativeTime(opp.created_at || opp.createdAt)
                              : 'Recently added'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <FramerButton
                            onClick={() => setSelectedOpp(opp)}
                            text="Details"
                            variant="outline"
                            size="sm"
                          />
                          {opp.link ? (
                            <FramerButton
                              href={opp.link}
                              text="Apply now"
                              variant="primary"
                              size="sm"
                              icon={ExternalLink}
                              iconPosition="right"
                            />
                          ) : (
                            <FramerButton
                              onClick={() => setSelectedOpp(opp)}
                              text={theme.ctaText}
                              variant="navy"
                              size="sm"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Empty State */}
                {filteredOpportunities.length === 0 && (
                  <div className="bg-white rounded-[24px] p-12 text-center border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A]">
                    <div className="w-16 h-16 rounded-2xl bg-[#FEF08A] text-[#0F172A] border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-[32px]">search_off</span>
                    </div>
                    <h3 className="font-black text-[#0F172A] text-lg mb-1">No matching opportunities found</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6 font-medium">
                      No results found for &quot;{searchQuery || activeFilter}&quot;. Try adjusting your keywords or category filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('All');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white hover:bg-[#FF5722] font-black text-xs uppercase border-2 border-[#0F172A] shadow-[3px_3px_0_#FF5722] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
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
            <div className="bg-white rounded-[24px] border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] p-5 sm:p-6 relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-[#0F172A]" />
                  <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wide">
                    Live Campus Updates
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF08A] text-[#0F172A] border border-[#0F172A]">
                  Notices
                </span>
              </div>

              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                className="space-y-3 overscroll-contain"
              >
                {annLoading && Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-16 rounded-xl bg-slate-100 border border-slate-200" />
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
                      <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 font-medium">
                        All announcements acknowledged for now.
                      </div>
                    )}
                  </>
                )}

                {annError && !annLoading && (
                  <p className="text-xs text-rose-600 font-bold">Could not load announcements.</p>
                )}
              </div>
            </div>

            {/* 2. Urgent / Closing Soon Widget */}
            <div className="bg-[#FEF08A] rounded-[24px] border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] p-5 sm:p-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#0F172A]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[20px]">
                    local_fire_department
                  </span>
                  <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wide">
                    Closing This Week
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500 text-white border border-[#0F172A]">
                  Urgent
                </span>
              </div>

              <div className="space-y-2.5">
                {CLOSING_SOON_DATA.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-white hover:bg-slate-50 border-[1.5px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-[#0F172A] group-hover:text-[#FF5722] transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                          {item.tag}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-300">
                        {item.deadline}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 3. Academic Calendar Widget */}
            <div className="bg-white rounded-[24px] p-1 shadow-[5px_5px_0_#0F172A] border-[2.5px] border-[#0F172A]">
              <AcademicCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM COMMUNITY CALLOUT BANNER ─── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-14 sm:mt-18 relative z-10">
        <div className="bg-[#0F172A] rounded-[32px] border-[3px] border-[#0F172A] shadow-[8px_8px_0_#FF5722] p-8 sm:p-12 md:p-14 text-center relative overflow-hidden text-white">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#FEF08A] text-xs font-black uppercase tracking-wider mb-4 border border-white/20">
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
                className="w-full sm:w-auto bg-[#FEF08A] hover:bg-yellow-300 text-[#0F172A] font-black px-8 py-3 rounded-xl text-xs uppercase border-2 border-white shadow-[3px_3px_0_#FF5722] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Submit Opportunity</span>
              </button>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-black px-8 py-3 rounded-xl text-xs uppercase border-2 border-white/40 hover:border-white transition-all text-center inline-flex items-center justify-center gap-2"
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
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs cursor-pointer"
                  onClick={() => setSelectedOpp(null)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white rounded-[28px] p-6 sm:p-8 max-w-xl w-full border-[3px] border-[#0F172A] shadow-[8px_8px_0_#0F172A] z-10 overflow-hidden my-auto max-h-[90vh] flex flex-col justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Accent Strip */}
                  <div className={`absolute top-0 left-0 right-0 h-2.5 ${theme.pillColor} z-20`} />

                  {/* ── Ambient Screen-Covering Vector Wave with Undulating Motion ── */}
                  <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center">
                    {/* Expanding Ambient Radial Color Wave */}
                    <motion.div
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: [0.8, 1.4, 1.1], opacity: [0.35, 0.15, 0.25] }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className={`absolute w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-tr ${theme.backgroundGradient} blur-3xl`}
                    />

                    {/* Smooth Fluid Vector Wave */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0.3, rotate: -12 }}
                      animate={{
                        scale: [1, 1.08, 0.98, 1],
                        opacity: [0.10, 0.18, 0.08, 0.10],
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

                    {/* Undulating Background SVG Wave */}
                    <svg
                      className="absolute -bottom-6 left-0 right-0 w-full h-28 opacity-[0.08] pointer-events-none"
                      viewBox="0 0 1440 320"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        animate={{
                          d: [
                            "M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L0,320Z",
                            "M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,160C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z",
                            "M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L0,320Z",
                          ],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        fill="currentColor"
                        className="text-[#0F172A]"
                      />
                    </svg>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-red-500 hover:text-white text-[#0F172A] border-[1.5px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center transition-all cursor-pointer z-20"
                    aria-label="Close dialog"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>

                  {/* Header Metadata Pill Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap pt-1 relative z-10 pr-10">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase border-[1.5px] ${theme.badgeBg} shadow-2xs`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{theme.icon}</span>
                      <span>{selectedOpp.tag || selectedOpp.category || 'Opportunity'}</span>
                    </span>

                    {selectedOpp.deadline && (
                      <span className="inline-flex items-center gap-1 text-red-800 bg-red-100 px-2.5 py-1 rounded-lg border-[1.5px] border-red-300 text-xs font-black uppercase shadow-2xs">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        <span>Deadline: {selectedOpp.deadline}</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>
                        {selectedOpp.created_at || selectedOpp.createdAt
                          ? formatRelativeTime(selectedOpp.created_at || selectedOpp.createdAt)
                          : 'Recently added'}
                      </span>
                    </span>
                  </div>

                  {/* Expanded Title with Illustration Thumbnail */}
                  <div className="flex items-start gap-3.5 mb-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl border-2 border-[#0F172A] bg-white p-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0_#0F172A]">
                      <img
                        src={selectedOpp.image || selectedOpp.imageUrl || selectedOpp.logo || theme.svgIcon}
                        alt={selectedOpp.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-snug tracking-tight">
                        {selectedOpp.title}
                      </h2>
                    </div>
                  </div>

                  {/* Full Description Box with Lenis Scroll Bypass */}
                  <div className="relative z-10 space-y-3 mb-4">
                    <div
                      data-lenis-prevent="true"
                      data-lenis-prevent-wheel="true"
                      className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#0F172A] max-h-[260px] overflow-y-auto overscroll-contain shadow-xs"
                    >
                      <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                        {selectedOpp.description}
                      </p>
                    </div>

                    {selectedOpp.link && (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 border-2 border-[#0F172A] text-xs text-[#0F172A] shadow-2xs">
                        <span className="material-symbols-outlined text-[16px] text-[#FF5722] shrink-0">link</span>
                        <span className="font-black shrink-0">Official URL:</span>
                        <a
                          href={selectedOpp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-[#FF5722] underline font-mono text-[11px] hover:text-[#0F172A] font-bold"
                        >
                          {selectedOpp.link}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 relative z-10">
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                      <button
                        onClick={(e) => handleShareLink(selectedOpp, e)}
                        className="p-2 px-3 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-[#0F172A] hover:bg-[#FEF08A] shadow-[1.5px_1.5px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase"
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
                        className="p-2 px-3 rounded-xl border-[1.5px] border-[#0F172A] bg-[#BBF7D0] text-[#14532D] hover:bg-emerald-200 shadow-[1.5px_1.5px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase"
                        title="Share to WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = `*${selectedOpp.title}*\n${selectedOpp.description || ''}\n\nCategory: ${selectedOpp.category || 'Opportunity'}\nDeadline: ${selectedOpp.deadline || 'Apply Soon'}`;
                          window.open(`https://t.me/share/url?url=${encodeURIComponent(selectedOpp.link || window.location.href)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2 px-3 rounded-xl border-[1.5px] border-[#0F172A] bg-[#BAE6FD] text-[#0369A1] hover:bg-sky-200 shadow-[1.5px_1.5px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase"
                        title="Share to Telegram"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        <span>Telegram</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {selectedOpp.link ? (
                        <FramerButton
                          href={selectedOpp.link}
                          text="Direct Apply"
                          variant="primary"
                          size="md"
                          icon={ExternalLink}
                          iconPosition="right"
                          className="w-full sm:w-auto"
                        />
                      ) : (
                        <FramerButton
                          to="/contact"
                          text="Inquire with Admin"
                          variant="navy"
                          size="md"
                          className="w-full sm:w-auto"
                        />
                      )}
                    </div>
                  </div>
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
                className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs cursor-pointer"
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
                className="bg-[#FDFBF7] rounded-[28px] p-6 sm:p-8 max-w-lg w-full border-[3px] border-[#0F172A] shadow-[8px_8px_0_#0F172A] relative z-10 my-auto max-h-[90vh] overflow-y-auto overscroll-contain"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    resetForm();
                  }}
                  className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-red-500 hover:text-white text-[#0F172A] border-[1.5px] border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#0F172A] border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">publish</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#0F172A] leading-none">Submit Opportunity</h3>
                    <p className="text-xs text-slate-600 font-bold mt-1">Help peers discover new programs and jobs</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="opp-title" className="block font-black text-xs uppercase tracking-wider text-[#0F172A] mb-1.5">
                      Opportunity Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="opp-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g. Google Summer of Code 2026"
                      className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-xs font-bold text-[#0F172A] focus:shadow-[3px_3px_0_#FF5722] focus:outline-none"
                      disabled={submitStatus === 'loading'}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="opp-category" className="block font-black text-xs uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="opp-category"
                          value={formData.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          className="w-full appearance-none px-3.5 pr-8 py-2.5 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-xs font-bold text-[#0F172A] focus:shadow-[3px_3px_0_#FF5722] focus:outline-none cursor-pointer"
                          style={{
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none',
                            backgroundImage: 'none',
                          }}
                          disabled={submitStatus === 'loading'}
                        >
                          {SUBMIT_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 stroke-[2.5]" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="opp-email" className="block font-black text-xs uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Your Email <span className="text-red-500">*</span>
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
                        className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-xs font-bold text-[#0F172A] focus:shadow-[3px_3px_0_#FF5722] focus:outline-none"
                        disabled={submitStatus === 'loading'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="opp-link" className="block font-black text-xs uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Apply / Official Link
                      </label>
                      <input
                        id="opp-link"
                        type="url"
                        value={formData.link || ''}
                        onChange={(e) => handleChange('link', e.target.value)}
                        placeholder="https://company.com/apply"
                        className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-xs font-bold text-[#0F172A] focus:shadow-[3px_3px_0_#FF5722] focus:outline-none"
                        disabled={submitStatus === 'loading'}
                      />
                    </div>

                    <div>
                      <label htmlFor="opp-deadline" className="block font-black text-xs uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Deadline / Due Date
                      </label>
                      <input
                        id="opp-deadline"
                        type="text"
                        value={formData.deadline || ''}
                        onChange={(e) => handleChange('deadline', e.target.value)}
                        placeholder="e.g. Oct 31, 2026 or In 3 days"
                        className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-xs font-bold text-[#0F172A] focus:shadow-[3px_3px_0_#FF5722] focus:outline-none"
                        disabled={submitStatus === 'loading'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="opp-desc" className="block font-black text-xs uppercase tracking-wider text-[#0F172A] mb-1.5">
                      Description &amp; Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="opp-desc"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Provide details about the role, eligibility, stipend, and selection process..."
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-[#0F172A] bg-white text-xs font-bold text-[#0F172A] focus:shadow-[3px_3px_0_#FF5722] focus:outline-none resize-none"
                      disabled={submitStatus === 'loading'}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitModalOpen(false);
                        resetForm();
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-black uppercase text-[#0F172A] hover:bg-[#FEF08A] border-[1.5px] border-[#0F172A] shadow-[1.5px_1.5px_0_#0F172A] transition-all cursor-pointer"
                      disabled={submitStatus === 'loading'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-black px-6 py-2 rounded-xl text-xs uppercase border-[1.5px] border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:shadow-[4px_4px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      disabled={submitStatus === 'loading'}
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          <span>Submit for Review</span>
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
