import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Users,
  GraduationCap,
  Briefcase,
  Flame,
  Tag,
  Code,
  Database,
  BookOpen,
  Zap,
  Terminal,
  Star,
} from 'lucide-react';
import { getPublicOverviewStats, getPublicHomepageSettings } from '../../../services/settings/settingsApi';

const DEFAULT_TAGS = [
  { label: 'OS 100-Mark Imp', query: 'Operating Systems', icon: 'zap' },
  { label: 'DAA NP-Hard Proofs', query: 'Design and Analysis of Algorithms', icon: 'code' },
  { label: 'DBMS B+ Trees', query: 'Database Management Systems', icon: 'database' },
  { label: 'Python Lab Manual', query: 'Python', icon: 'terminal' },
];

function getTagIcon(iconName) {
  const props = { className: 'w-3 h-3 text-amber-500 shrink-0' };
  switch (iconName?.toLowerCase()) {
    case 'code': return <Code {...props} />;
    case 'database': return <Database {...props} />;
    case 'book': return <BookOpen {...props} />;
    case 'flame': return <Flame {...props} />;
    case 'zap': return <Zap {...props} />;
    case 'terminal': return <Terminal {...props} />;
    case 'star': return <Star {...props} />;
    case 'tag':
    default:
      return <Tag {...props} />;
  }
}

function HeroSection() {
  const [stats, setStats] = useState({
    displayResources: '10K+',
    displayStudents: '2,500+',
    displaySubjects: '38+',
    displayOpportunities: '100+',
  });
  const [heroTags, setHeroTags] = useState(DEFAULT_TAGS);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [statsData, homeSettings] = await Promise.allSettled([
          getPublicOverviewStats(),
          getPublicHomepageSettings(),
        ]);

        if (statsData.status === 'fulfilled' && statsData.value && isMounted) {
          const d = statsData.value;
          setStats({
            displayResources: d.displayResources || '10K+',
            displayStudents: d.displayStudents || '2,500+',
            displaySubjects: d.displaySubjects || '38+',
            displayOpportunities: d.displayOpportunities || '100+',
          });
        }

        if (homeSettings.status === 'fulfilled' && homeSettings.value && isMounted) {
          const trending = homeSettings.value.trending;
          if (trending && Array.isArray(trending.heroTags) && trending.heroTags.length > 0) {
            setHeroTags(trending.heroTags);
          }
        }
      } catch (err) {
        console.warn('Failed to load hero section data:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-7 z-10">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/80 shadow-xs text-hub-navy text-xs font-extrabold uppercase tracking-wide">
              <span className="text-amber-500 text-sm">★</span>
              <span>YOUR LEARNING HUB</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-hub-navy leading-[1.12] tracking-tight">
              Everything a <br className="hidden sm:inline" />
              Student Needs in <br />
              <span className="relative inline-block text-amber-500 mt-1">
                One Platform
                <svg
                  className="absolute -bottom-3 left-0 w-full h-4 text-amber-400 opacity-90 drop-shadow-xs"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M 0 5 Q 50 0 100 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed font-medium">
              Access Notes, PYQs, Practical Files, Free Courses, Question Banks, Internships, and much more — All in one place. Everything you need to learn, grow, and succeed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/resources"
                className="bg-hub-navy hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2.5 text-sm sm:text-base border border-hub-navy cursor-pointer"
              >
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/semesters"
                className="bg-white hover:bg-amber-50 text-hub-navy font-bold px-8 py-3.5 rounded-full shadow-sm hover:shadow-md border-2 border-amber-300 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
              >
                Explore Semesters
              </Link>
            </div>

            {/* Quick Search Tag Chips */}
            {heroTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-black uppercase text-gray-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Popular:</span>
                </span>
                {heroTags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/resources?search=${encodeURIComponent(tag.query || tag.label)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white hover:bg-amber-100 text-hub-navy border border-amber-300/80 shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all active:scale-95 cursor-pointer"
                  >
                    {getTagIcon(tag.icon)}
                    <span>{tag.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Hero Stats Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs transition-transform duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <Bookmark className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">{stats.displayResources}</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Resources</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs transition-transform duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">{stats.displayStudents}</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Students</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs transition-transform duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">{stats.displaySubjects}</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Subjects</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs transition-transform duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-hub-navy leading-none">{stats.displayOpportunities}</span>
                <span className="text-xs font-semibold text-gray-500 mt-1">Opportunities</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[620px] lg:max-w-[720px] scale-100 lg:scale-110 transition-transform duration-500">
              <img
                src="/images/hero-student.png"
                alt="Student pointing to resources"
                className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
