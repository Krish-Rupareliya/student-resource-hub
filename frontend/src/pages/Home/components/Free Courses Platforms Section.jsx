import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, ExternalLink } from 'lucide-react';
import { NeoBadge } from '../../../components/common/BrandIcons';
import { getPublicHomepageSettings } from '../../../services/settings/settingsApi';

const DEFAULT_PLATFORMS = [
  {
    title: 'Deloitte',
    subtitle: 'Professional Learning',
    logo: '/images/logos/deloitte.svg',
    link: 'https://www2.deloitte.com/us/en/careers/students.html',
    bgClass: 'bg-[#1E293B]',
    textClass: 'text-white',
    badgeClass: 'text-[#FBBF24]',
    isLight: false,
  },
  {
    title: 'Cisco',
    subtitle: 'Networking Academy',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg',
    link: 'https://www.netacad.com/',
    bgClass: 'bg-[#0072C6]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
  {
    title: 'Google',
    subtitle: 'Career Certificates',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    link: 'https://grow.google/certificates/',
    bgClass: 'bg-white',
    textClass: 'text-[#111111]',
    badgeClass: 'text-gray-600',
    isLight: true,
  },
  {
    title: 'Microsoft',
    subtitle: 'Learn',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    link: 'https://learn.microsoft.com/',
    bgClass: 'bg-[#4F46E5]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
  {
    title: 'AWS',
    subtitle: 'Training & Certification',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    link: 'https://aws.amazon.com/training/',
    bgClass: 'bg-[#F97316]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
  {
    title: 'IBM',
    subtitle: 'SkillsBuild',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    link: 'https://skillsbuild.org/',
    bgClass: 'bg-[#1E293B]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
  {
    title: 'Oracle',
    subtitle: 'Academy',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    link: 'https://academy.oracle.com/',
    bgClass: 'bg-[#991B1B]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
  {
    title: 'TCS iON',
    subtitle: 'Career Edge',
    logo: '/images/logos/tcs-ion.png',
    link: 'https://learning.tcsionhub.in/courses/career-edge/',
    bgClass: 'bg-[#1E3BB3]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
];

function LearningPlatformsSection() {
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);

  useEffect(() => {
    let isMounted = true;
    async function loadPlatforms() {
      const data = await getPublicHomepageSettings();
      if (data && Array.isArray(data.learningPlatforms) && data.learningPlatforms.length > 0 && isMounted) {
        // Map backend learning platforms or merge with styling presets
        const mapped = data.learningPlatforms.map((p, idx) => {
          const fallback = DEFAULT_PLATFORMS[idx % DEFAULT_PLATFORMS.length];
          return {
            title: p.title || p.name || fallback.title,
            subtitle: p.subtitle || p.badge || fallback.subtitle,
            logo: p.logo || fallback.logo,
            link: p.link || p.url || fallback.link,
            bgClass: p.bgClass || fallback.bgClass,
            textClass: p.textClass || fallback.textClass,
            badgeClass: p.badgeClass || fallback.badgeClass,
            isLight: p.isLight !== undefined ? p.isLight : fallback.isLight,
          };
        });
        setPlatforms(mapped);
      }
    }
    loadPlatforms();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Neo-Brutalist Sticker Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div>
              <NeoBadge
                icon={Flame}
                label="POPULAR PLATFORMS"
                bgColor="bg-[#FEF3D6]"
                textColor="text-[#111111]"
                borderColor="border-[#111111]"
                rotate="rotate-[2.5deg]"
                shadow="shadow-[3px_3px_0px_#111111]"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hub-navy leading-tight tracking-tight pt-1">
              Discover Free <br className="hidden sm:inline" />
              <span className="relative inline-block text-amber-500">
                Learning Platforms
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 0 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-medium pt-1">
              Explore free certifications, industry-recognized courses, career opportunities and trusted learning resources.
            </p>
          </div>

          <div>
            <a
              href="#learning-grid"
              className="inline-flex items-center gap-2 bg-white hover:bg-amber-300 text-[#111111] font-black px-6 py-3 rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-sm group cursor-pointer"
            >
              <span>Explore All Platforms</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Brand Cards Grid with Sticker Aesthetic */}
        <div id="learning-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p, idx) => (
            <div
              key={idx}
              className={`${p.bgClass} rounded-[28px] p-6 flex flex-col justify-between items-center text-center border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[7px_7px_0px_#111111] hover:-translate-y-1.5 transition-all duration-300 min-h-[230px] relative group overflow-hidden`}
            >
              {/* Brand Logo Container with 2px border and sticker shadow */}
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2.5 border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] mb-4 shrink-0 group-hover:scale-105 group-hover:rotate-[-2deg] transition-all">
                <img src={p.logo} alt={p.title} className="w-full h-full object-contain" />
              </div>

              {/* Brand Info */}
              <div className="mb-5">
                <h3 className={`text-xl font-black ${p.textClass} tracking-tight`}>{p.title}</h3>
                <p className={`text-xs font-bold mt-1 ${p.badgeClass}`}>{p.subtitle}</p>
              </div>

              {/* Explore Button inside Card */}
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-black transition-all border-2 border-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                  p.isLight
                    ? 'bg-amber-400 text-[#111111] hover:bg-amber-300'
                    : 'bg-white text-[#111111] hover:bg-amber-300'
                }`}
              >
                <span>Explore</span>
                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default LearningPlatformsSection;
