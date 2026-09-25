// src/pages/About/About.jsx
// Streamlined Playful Neo-Brutalism / Y2K Digital Pop About Page with Card Stack Motion.
// Motion Principles:
// 1. Sticky Stacking Scroll (Card Reveal): section cards slide up and pin over previous cards with scale (1 - progress * 0.05) & opacity (0.80).
// 2. Organic Wave & Mask Morphing: Vector curves and arch-shaped scalloped masks expand smoothly.
// 3. Playful Micro-Interactions: Slight rotation, bouncy scaling, and cursor-following effects.
// 100% compliant with svg-avoid.md (0 raw text emojis, 100% Lucide SVGs), pinte.md, and AGENTS.md.

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useVelocity, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Sparkles,
  Zap,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Users,
  Moon,
  ShieldCheck,
  Hand,
  FolderArchive,
  MessageSquare,
  Code2,
  Plus,
  Minus,
  ArrowUp,
  HelpCircle,
  Flame,
  Layers,
  FileWarning,
  Crown,
  Palette,
  Search,
} from 'lucide-react';
import { ScallopedCap, StickerTag, PillButton } from './components/ScallopedFrame';
import { NeoBadge } from '../../components/common/BrandIcons';
import { CardStack, CardStackItem } from '../../components/common/CardStack';

export default function About() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress, scrollY } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.1 });
  
  // Velocity-reactive transform
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 200, damping: 30 });
  const velocitySkew = useTransform(smoothVelocity, [-2000, 0, 2000], [-2.5, 0, 2.5]);

  // Floating background parallax
  const floatBg1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const floatBg2 = useTransform(smoothProgress, [0, 1], [0, 220]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4 Live Metric Badges
  const stats = [
    { label: 'Verified Vault Drops', value: '1,200+', iconComponent: BookOpen, color: '#FACC15' },
    { label: 'Active Engineers', value: '5,000+', iconComponent: GraduationCap, color: '#A3E635' },
    { label: 'Semesters Covered', value: 'Sem 1 - 8', iconComponent: Layers, color: '#C084FC' },
    { label: 'Free & Open Source', value: '100%', iconComponent: Code2, color: '#FF5722', textColor: '#FFFFFF' },
  ];

  // 3 Rich Stacking Story Cards
  const storyCards = [
    {
      step: 'CHAPTER 01',
      title: 'THE 2:00 AM EXAM PANIC & BROKEN DRIVES',
      subtitle: 'When 400 students frantic ping WhatsApp groups for PYQs',
      story:
        'It was 2:15 AM before the End-Sem exam. Group chats were flooded with broken Google Drive permissions, blurry photos of handwritten notes, and missing syllabus units. We realized engineering students waste 40+ hours every semester just searching for valid files.',
      challenge: 'Problem: Fragmented, gatekept, and expired materials.',
      solution: 'Solution: A lightning-fast, zero-paywall unified student vault.',
      bgColor: '#FF5722',
      textColor: '#FFFFFF',
      badgeColor: '#FACC15',
      badgeText: '#111111',
      tagText: 'THE ORIGIN',
      tagIcon: Lightbulb,
      iconComponent: Moon,
      image: '/images/logos/about2.svg',
    },
    {
      step: 'CHAPTER 02',
      title: 'BUILDING THE AUTONOMOUS VAULT ENGINE',
      subtitle: 'OCR-indexed, syllabus-matched, and protected with backend proxies',
      story:
        'We designed CampusHub from the ground up on modern tech. Every note is scanned for clean OCR readability, mapped directly to university course codes (e.g. CE0101, CE0401), and served via high-speed cloud streams. No spam, no dead links, and zero tracking.',
      challenge: 'Standard: Strict 4-Stage Quality Gate on every upload.',
      solution: 'Result: Over 1,200+ verified semester guides available 24/7.',
      bgColor: '#2563EB',
      textColor: '#FFFFFF',
      badgeColor: '#C084FC',
      badgeText: '#111111',
      tagText: 'ARCHITECTED',
      tagIcon: Zap,
      iconComponent: ShieldCheck,
      image: '/images/logos/about3.svg',
    },
    {
      step: 'CHAPTER 03',
      title: 'THE EXPANDING CAMPUS NETWORK & IMPACT',
      subtitle: 'From 1 department to 5,000+ students across all 8 semesters',
      story:
        'CampusHub grew beyond just study notes. We integrated verified tech internships, national hackathon alerts, live student referendums, and peer doubt-solving channels on WhatsApp and Telegram. Built by engineers, for engineers.',
      challenge: 'Impact: 5,000+ students empowered every single exam cycle.',
      solution: 'Mission: 100% open-source and free for every generation.',
      bgColor: '#A3E635',
      textColor: '#111111',
      badgeColor: '#FACC15',
      badgeText: '#111111',
      tagText: 'COMMUNITY POWER',
      tagIcon: Users,
      iconComponent: GraduationCap,
    },
  ];

  // 4 Core Platform Pillars
  const pillars = [
    {
      id: '01',
      title: 'Verified Study Vault & PYQs',
      desc: 'Syllabus-indexed lecture notes, Indus university solved question papers, and lab manuals ready for exam viva prep.',
      color: '#FEF3D6',
      icon: BookOpen,
      tags: ['Syllabus Indexed', 'Solved Papers', 'Lab Manuals'],
    },
    {
      id: '02',
      title: 'Career Board & Hackathons',
      desc: 'Curated paid tech internships, national hackathons, open-source grants, and student scholarships with verified deadlines.',
      color: '#EDE9FE',
      icon: Rocket,
      tags: ['Paid Internships', 'Hackathons', 'Grants'],
    },
    {
      id: '03',
      title: '4-Stage Quality Gate',
      desc: 'Every file passes automated SHA-256 buffer audits, MIME checks, course code triage, and peer review to ensure zero corrupt files.',
      color: '#DCFCE7',
      icon: ShieldCheck,
      tags: ['SHA-256 Check', 'Zero Spam', 'Peer Reviewed'],
    },
    {
      id: '04',
      title: 'Active Student Community',
      desc: 'Direct collaborative doubt-solving channels on WhatsApp and Telegram with live campus referendums.',
      color: '#FFEDD5',
      icon: Users,
      tags: ['WhatsApp Sync', 'Live Polls', 'Doubt Solving'],
    },
  ];

  // Contributor Squad Data
  const squad = [
    {
      name: 'Manan Gohil',
      role: 'Project Lead & Architect',
      roleIcon: Crown,
      tag: 'LEAD',
      tagColor: '#2563EB',
      tagText: '#FFFFFF',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1_X_o4f0hXOLkW8GFyS_99Wd-27mxjyc4Mkqby9idLKqmK1_lmpRdWzy0oMZtO2kdV_3hQWsDO1lSHgZfM6y_0hO-EQJg8_Zgrczv4PkA8nJ_mFucfDNLZA19T-LSFdQJUHiTa0R8MSXuTSup7os3xdEGi3xqa3JO_FyDLBp9vckatx7iWaX02Rypurh_nynVhFTeyxY9DewWS_AtZEZwruBWEPMD6juzu5DOYkE4wavx3DYkuQmTnogBcILFWkp9HvOSgxU4xiM',
      university: 'Indus University · CE',
      skills: ['System Design', 'Cloud Infra', 'Community Ops'],
    },
    {
      name: 'Krish Patel',
      role: 'Frontend Architect & UX',
      roleIcon: Palette,
      tag: 'FRONTEND',
      tagColor: '#FACC15',
      tagText: '#111111',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1oB7febShFcsKAnTYIXP_T0HYgEoD69brUFelyDnZjsAdajt4siCu1jqwgLsw9GTm5oVFWAWBXo4fF95FNhqwi7KPEsgCJVBzkx5utFdtCLDiqPltlJqXj9usXg2kDugbXNq75b4kMzD7oFJ2m2fzt2InwOfhvR7Nj_FDuyHV4yn1rUM7EjkxOgkor9RENdnAndgr3RH4o5zoBjjORBEJVy9iv58p41NlDfre-xmMyF_yUUgv3sAEGRCBFmfOxMuw3ndVT8hnol4',
      university: 'Indus University · CE',
      skills: ['React / Vite', 'Lenis Physics', 'Design Systems'],
    },
    {
      name: 'Akshat Khatri',
      role: 'Backend & Cloud Proxy',
      roleIcon: Zap,
      tag: 'BACKEND',
      tagColor: '#FF5722',
      tagText: '#FFFFFF',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJdoXoH2mO-SWtcIlNOq823u1YxeVXZMm73gR2eOImOqtEXniRhHocHVFFxrYKwywX47IBxLwgXDu-hbFVFUNYOPwM0K1L1rRkFcHzGbU7u1ffzRvdFiILM1vLQc0PIks5BAkKyXvdIXswr1L9j1vNbC4EaRIA70MEsF8h1VmssFhYCwhVZVTqgPG2Wjoe5EiwKFmlvnv88ZWa3KyFoN_zhh_sG8ilafIApaaWccTv-3WU5NOzAyIE7O-ms6i_-w8FKWdLY1H2HY',
      university: 'Indus University · CE',
      skills: ['Express & Prisma', 'PostgreSQL', 'Auth Security'],
    },
    {
      name: 'Manthan Prajapati',
      role: 'UI QA & Beta Tester',
      roleIcon: Search,
      tag: 'UI & QA',
      tagColor: '#C084FC',
      tagText: '#111111',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZFdmp7jD-2xVxlNZuWTtGVRObUG4El_gOLLjYcxAgE3wRs7AX9Ckm9brOPRuravtS9xL-_6O58LiqyHBmzf-ZIHVNih59hKRTOSjd8afrerRZXH_Y-UDc6KCQ_kggJ00u5jbmlxzVc6x3DrjDNXkVfxQJf5fK8z0cHHCJkKy9WozpuZoVfjD8x5g_X0_IQVUZ_ppUcB45LQCgdYmKowJzm6c4jVgqnvoLmlzgmwzKDV-xCc4CUX7npVcqGvxyGk_CUUX2HBD7AgA',
      university: 'Indus University · CE',
      skills: ['Quality Assurance', 'Beta Testing', 'Visual Audit'],
    },
  ];

  // 3 Essential FAQs
  const faqs = [
    {
      q: 'Is CampusHub really 100% free with zero paywalls?',
      a: 'YES! We are completely free and open-source. No subscription fees, no locked PDFs, and no mandatory accounts for downloading resources. Shared by students, for students.',
      color: '#FEF3D6',
    },
    {
      q: 'How are uploaded notes and exam solutions verified?',
      a: 'Every upload passes through our 4-Stage Quality Gate: automated SHA-256 malware check, PDF format validation, subject code alignment, and student-moderator peer review.',
      color: '#DCFCE7',
    },
    {
      q: 'How can I submit study materials or contribute code?',
      a: 'Head to the Upload tab to submit PDF guides! To contribute code or feature ideas, ping our contributor squad or join our WhatsApp community.',
      color: '#EDE9FE',
    },
  ];

  return (
    <div ref={containerRef} className="pt-20 bg-[#F6F6F8] text-[#111111] font-sans min-h-screen pb-24 selection:bg-[#FACC15] selection:text-[#111111] relative overflow-x-clip">
      
      {/* ── Subtle Multi-Speed Parallax Stickers ── */}
      <motion.div
        style={{ y: floatBg1 }}
        className="absolute top-44 -left-8 pointer-events-none hidden lg:block z-0 opacity-35"
      >
        <motion.div
          animate={{ rotate: [-6, 2, -6], y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl bg-[#FACC15] border-3 border-[#111111] shadow-[5px_5px_0px_#111111] flex items-center justify-center -rotate-6"
        >
          <Sparkles className="w-10 h-10 text-[#111111] stroke-[2.5]" />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: floatBg2 }}
        className="absolute top-[48%] -right-8 pointer-events-none hidden lg:block z-0 opacity-35"
      >
        <motion.div
          animate={{ rotate: [12, -4, 12], y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          className="w-28 h-28 rounded-full bg-[#A3E635] border-3 border-[#111111] shadow-[5px_5px_0px_#111111] flex items-center justify-center rotate-12"
        >
          <Zap className="w-12 h-12 text-[#111111] stroke-[2.5]" />
        </motion.div>
      </motion.div>

      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-14 sm:space-y-18 relative z-10">

        {/* ══════════════════════════════════════════════════════════════════════════
            1. HERO SECTION (Punchy Headline, Scalloped Cap & 4 Metrics)
        ══════════════════════════════════════════════════════════════════════════ */}
        <motion.section
          id="hero"
          style={{ skewY: velocitySkew }}
          className="relative scroll-mt-28"
        >
          <ScallopedCap color="#FACC15" strokeColor="#111111" />

          <div className="bg-[#FACC15] border-3 border-[#111111] rounded-b-[32px] p-6 sm:p-9 md:p-11 shadow-[8px_8px_0px_#111111] relative overflow-hidden">
            {/* Dotted Background */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              {/* Left Column: Mission & Actions */}
              <div className="max-w-2xl space-y-4">
                {/* Badges */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-2">
                  <NeoBadge
                    icon={Zap}
                    label="EST. 2024 · CAMPUSHUB"
                    bgColor="bg-[#111111]"
                    textColor="text-[#FACC15]"
                    rotate="rotate-[-2.5deg]"
                    shadow="shadow-[3px_3px_0px_#111111]"
                  />
                  <NeoBadge
                    icon={ShieldCheck}
                    label="100% FREE & OPEN SOURCE"
                    bgColor="bg-[#FF5722]"
                    textColor="text-white"
                    rotate="rotate-[2deg]"
                    shadow="shadow-[3px_3px_0px_#111111]"
                  />
                </div>

                {/* Heading & Mission */}
                <div className="space-y-3">
                  <h1 className="font-display-pop text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#111111] tracking-tight leading-[0.95]">
                    BUILT BY STUDENTS, <br /> POWERED FOR CAMPUS
                  </h1>

                  <p className="text-sm sm:text-base font-bold text-[#111111]/85 max-w-xl leading-relaxed">
                    Eliminating exam panic, dead Google Drive links, and gatekept notes forever. Verified semester lecture guides and solved past papers created for engineering students.
                  </p>
                </div>

                {/* Action Buttons with Spring Micro-Interactions */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap pt-2">
                  <PillButton to="/resources" bgColor="#111111" textColor="#FACC15" iconComponent={FolderArchive}>
                    Explore Vault
                  </PillButton>
                  <PillButton to="/community" bgColor="#FFFFFF" textColor="#111111" iconComponent={MessageSquare}>
                    Join Community
                  </PillButton>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                  >
                    <Link
                      to="/resources"
                      className="px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 text-[#111111] font-bold text-xs sm:text-sm border-2 border-[#111111] shadow-[2.5px_2.5px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] active:shadow-none flex items-center gap-2 transition-shadow cursor-pointer select-none"
                    >
                      <Search className="w-4 h-4 stroke-[2.5] text-gray-500" />
                      <span className="text-gray-600 font-medium">Search or Filter by Semester...</span>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: about1.svg Illustration with Spring Micro-Motion */}
              <div className="shrink-0 flex items-center justify-center lg:justify-end relative flex-1 max-w-[560px] w-full">
                <motion.img
                  src="/images/logos/about1.svg"
                  alt="CampusHub Students Learning Together"
                  whileHover={{ scale: 1.03, rotate: 0.5 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                  className="w-full max-w-[340px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[560px] h-auto object-contain drop-shadow-[6px_6px_0px_#111111] select-none cursor-pointer"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* 4 Stats Badges with Spring Micro-Interactions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5 sm:mt-6">
            {stats.map((st, i) => {
              const IconComp = st.iconComponent;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ backgroundColor: st.color, color: st.textColor || '#111111' }}
                  className="p-4 sm:p-5 rounded-2xl border-2 border-[#111111] shadow-[3.5px_3.5px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] flex items-center gap-3.5 select-none transition-shadow cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                    className="w-10 h-10 rounded-xl bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center text-[#111111] shrink-0"
                  >
                    <IconComp className="w-5 h-5 stroke-[2.5]" />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="font-display-pop text-2xl sm:text-3xl font-black tracking-tight leading-none">
                      {st.value}
                    </p>
                    <p className="text-xs font-black mt-0.5 opacity-90 truncate">{st.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Marquee Ticker ── */}
        <div className="py-1 overflow-hidden -mx-4 sm:mx-0 select-none">
          <div className="bg-[#111111] text-[#FACC15] py-2 px-4 rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#FACC15] rotate-[-0.8deg] flex items-center overflow-hidden">
            <div className="flex shrink-0 gap-6 animate-marquee font-black uppercase tracking-wider text-xs">
              <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#A3E635]" /> 100% FREE VAULT</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#FF5722]" /> OCR VERIFIED NOTES</span>
              <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5 text-[#FACC15]" /> ZERO ADS</span>
              <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-[#C084FC]" /> 5,000+ ENGINEERS</span>
              <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#A3E635]" /> 100% FREE VAULT</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#FF5722]" /> OCR VERIFIED NOTES</span>
              <span className="flex items-center gap-2"><Flame className="w-3.5 h-3.5 text-[#FACC15]" /> ZERO ADS</span>
              <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-[#C084FC]" /> 5,000+ ENGINEERS</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            2. CARD STACK ORIGIN STORY (Sticky Stacking Scroll & Reveal)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="story" className="space-y-6 scroll-mt-28">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b-3 border-[#111111]">
            <div>
              <NeoBadge
                icon={Flame}
                label="OUR ORIGIN"
                bgColor="bg-[#111111]"
                textColor="text-[#FACC15]"
                rotate="rotate-[-2deg]"
                shadow="shadow-[2px_2px_0px_#111111]"
              />
              <h2 className="font-display-pop text-2xl sm:text-4xl font-black text-[#111111] pt-1">
                HOW CAMPUSHUB WAS BORN
              </h2>
            </div>
            <StickerTag bgColor="#FF5722" textColor="#FFFFFF" rotate="1.5deg" iconComponent={Lightbulb}>
              SCROLL TO STACK CARDS
            </StickerTag>
          </div>

          {/* Sticky Stacking Cards: Slide up & pin over previous cards with scale (1 - progress * 0.05) & opacity (0.80) */}
          <CardStack totalCards={storyCards.length} scaleMultiplier={0.05} topOffset={100} topGap={24}>
            {storyCards.map((card, idx) => {
              const IconComp = card.iconComponent;
              const TagIcon = card.tagIcon;
              return (
                <CardStackItem
                  key={idx}
                  index={idx}
                  totalCards={storyCards.length}
                  className="w-full"
                >
                  <ScallopedCap color={card.bgColor} strokeColor="#111111" />
                  
                  <div
                    style={{ backgroundColor: card.bgColor, color: card.textColor }}
                    className="border-3 border-[#111111] rounded-b-[32px] p-6 sm:p-9 md:p-12 shadow-[8px_8px_0px_#111111] relative overflow-hidden"
                  >
                    {/* Subtle Neo-Brutalist Dotted Background */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(#111111 2px, transparent 2px)',
                        backgroundSize: '24px 24px',
                      }}
                    />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10 relative z-10">
                      <div className="space-y-4 max-w-xl xl:max-w-2xl flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <motion.span
                            whileHover={{ scale: 1.08, rotate: -2 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                            style={{ backgroundColor: card.badgeColor, color: card.badgeText }}
                            className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#111111] shadow-[2px_2px_0px_#111111] cursor-default select-none"
                          >
                            {card.step}
                          </motion.span>
                          <StickerTag bgColor="#FFFFFF" textColor="#111111" rotate="1.5deg" iconComponent={TagIcon}>
                            {card.tagText}
                          </StickerTag>
                        </div>

                        <h3 className="font-display-pop text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
                          {card.title}
                        </h3>

                        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider opacity-90">
                          {card.subtitle}
                        </p>

                        <p className="text-sm sm:text-base font-semibold leading-relaxed opacity-95">
                          {card.story}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                            className="bg-black/15 border-2 border-[#111111] p-3.5 rounded-2xl cursor-default"
                          >
                            <span className="text-[10px] font-black uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                              <FileWarning className="w-3.5 h-3.5 stroke-[2.5]" /> The Challenge
                            </span>
                            <p className="text-xs sm:text-sm font-bold mt-1">{card.challenge}</p>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                            className="bg-white text-[#111111] border-2 border-[#111111] p-3.5 rounded-2xl shadow-[2px_2px_0px_#111111] cursor-default"
                          >
                            <span className="text-[10px] font-black uppercase text-[#FF5722] tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" /> CampusHub Impact
                            </span>
                            <p className="text-xs sm:text-sm font-black mt-1">{card.solution}</p>
                          </motion.div>
                        </div>
                      </div>

                      {card.image ? (
                        <div className="shrink-0 flex items-center justify-center lg:justify-end flex-1 max-w-[580px] w-full">
                          <motion.img
                            src={card.image}
                            alt={card.title}
                            whileHover={{ scale: 1.03, rotate: -0.8 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                            className="w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[540px] xl:max-w-[580px] h-auto object-contain drop-shadow-[6px_6px_0px_#111111] select-none cursor-pointer"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="shrink-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ rotate: 0, scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-white border-3 border-[#111111] flex items-center justify-center shadow-[4px_4px_0px_#111111] rotate-3 text-[#111111] cursor-pointer"
                          >
                            <IconComp className="w-10 h-10 sm:w-14 sm:h-14 stroke-[2]" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardStackItem>
              );
            })}
          </CardStack>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            3. CORE PLATFORM PILLARS (Clean 4-Card Bento Grid)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="pillars" className="space-y-5 scroll-mt-28">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b-3 border-[#111111]">
            <div>
              <NeoBadge
                icon={Layers}
                label="ECOSYSTEM"
                bgColor="bg-[#111111]"
                textColor="text-[#A3E635]"
                rotate="rotate-[-2deg]"
                shadow="shadow-[2px_2px_0px_#111111]"
              />
              <h2 className="font-display-pop text-2xl sm:text-4xl font-black text-[#111111] pt-1">
                4 CORE PLATFORM PILLARS
              </h2>
            </div>
            <StickerTag bgColor="#FACC15" textColor="#111111" rotate="-1.5deg" iconComponent={Zap}>
              WHAT WE OFFER
            </StickerTag>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {pillars.map((p, idx) => {
              const PIcon = p.icon;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02, rotate: idx % 2 === 0 ? -0.5 : 0.5 }}
                  whileTap={{ scale: 0.98 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.35, type: 'spring', stiffness: 350, damping: 18 }}
                  style={{ backgroundColor: p.color }}
                  className="p-5 sm:p-6 rounded-[24px] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] flex flex-col justify-between select-none transition-shadow cursor-default"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                        className="w-9 h-9 rounded-xl bg-white border-2 border-[#111111] flex items-center justify-center text-[#111111] shadow-[2px_2px_0px_#111111]"
                      >
                        <PIcon className="w-4 h-4 stroke-[2.5]" />
                      </motion.div>
                      <span className="font-display-pop text-2xl font-black opacity-30 text-[#111111]">
                        {p.id}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#111111]">
                      {p.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-medium text-[#111111]/85 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-[#111111]/15 flex items-center gap-1.5 flex-wrap">
                    {p.tags.map((tg, tIdx) => (
                      <motion.span
                        key={tIdx}
                        whileHover={{ scale: 1.08, rotate: 1 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                        className="px-2 py-0.5 rounded-md bg-white text-[#111111] text-[10px] font-black border border-[#111111] shadow-[1px_1px_0px_#111111]"
                      >
                        {tg}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            4. THE CONTRIBUTOR SQUAD (4 Creators)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="squad" className="space-y-5 scroll-mt-28">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b-3 border-[#111111]">
            <div>
              <NeoBadge
                icon={Users}
                label="MEET THE SQUAD"
                bgColor="bg-[#111111]"
                textColor="text-[#FACC15]"
                rotate="rotate-[-2deg]"
                shadow="shadow-[2px_2px_0px_#111111]"
              />
              <h2 className="font-display-pop text-2xl sm:text-4xl font-black text-[#111111] pt-1">
                BUILT BY INDUS CE ENGINEERS
              </h2>
            </div>
            <StickerTag bgColor="#C084FC" textColor="#111111" rotate="2deg" iconComponent={Crown}>
              CORE CONTRIBUTORS
            </StickerTag>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {squad.map((m, mIdx) => {
              const RoleIcon = m.roleIcon;
              return (
                <motion.div
                  key={mIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ delay: mIdx * 0.08, duration: 0.35, type: 'spring', stiffness: 350, damping: 18 }}
                  className="bg-white p-4 sm:p-5 rounded-[24px] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] flex flex-col justify-between select-none transition-shadow cursor-default"
                >
                  <div>
                    {/* Avatar with sticker pill */}
                    <div className="relative mb-3 group">
                      <div className="w-full aspect-square rounded-2xl border-2 border-[#111111] overflow-hidden bg-[#F6F6F8] shadow-[2px_2px_0px_#111111]">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <motion.span
                        whileHover={{ scale: 1.15, rotate: 3 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                        style={{ backgroundColor: m.tagColor, color: m.tagText }}
                        className="absolute -bottom-2 right-2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-[#111111] shadow-2xs cursor-default"
                      >
                        {m.tag}
                      </motion.span>
                    </div>

                    <h3 className="text-base font-black text-[#111111] leading-tight">{m.name}</h3>
                    <p className="text-xs font-black text-[#2563EB] flex items-center gap-1 mt-0.5">
                      <RoleIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{m.role}</span>
                    </p>
                    <p className="text-[11px] font-bold text-gray-500 mt-0.5">{m.university}</p>

                    <div className="flex items-center gap-1 flex-wrap pt-2.5">
                      {m.skills.map((sk, skIdx) => (
                        <span
                          key={skIdx}
                          className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300 text-[9px] font-bold text-gray-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.a
                    href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.95, y: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="mt-4 w-full py-2 rounded-full bg-[#FACC15] hover:bg-amber-300 text-[#111111] font-black text-xs border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:shadow-[3.5px_3.5px_0px_#111111] active:shadow-none flex items-center justify-center gap-1.5 transition-shadow cursor-pointer"
                  >
                    <Hand className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Say Hi</span>
                  </motion.a>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            5. ESSENTIAL FAQS (Spring Height & Rotation Animation)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="space-y-4 scroll-mt-28">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b-3 border-[#111111]">
            <div>
              <NeoBadge
                icon={HelpCircle}
                label="FAQS"
                bgColor="bg-[#111111]"
                textColor="text-[#C084FC]"
                rotate="rotate-[-2deg]"
                shadow="shadow-[2px_2px_0px_#111111]"
              />
              <h2 className="font-display-pop text-2xl sm:text-4xl font-black text-[#111111] pt-1">
                FREQUENTLY ASKED QUESTIONS
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, fIdx) => {
              const isOpen = activeFaq === fIdx;
              return (
                <motion.div
                  key={fIdx}
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                  style={{ backgroundColor: faq.color }}
                  className="p-4 sm:p-5 rounded-2xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] transition-shadow cursor-pointer select-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm sm:text-base font-black text-[#111111]">
                      {faq.q}
                    </h3>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                      className="w-6 h-6 rounded-lg bg-white border border-[#111111] flex items-center justify-center text-[#111111] shrink-0 shadow-[1px_1px_0px_#111111]"
                    >
                      {isOpen ? <Minus className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="mt-2.5 pt-2.5 border-t border-[#111111]/20 text-xs sm:text-sm font-semibold text-[#111111]/85 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            6. CALL TO ACTION BANNER
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="relative pt-2">
          <ScallopedCap color="#2563EB" strokeColor="#111111" />

          <div className="bg-[#2563EB] text-white border-3 border-[#111111] rounded-b-[32px] p-6 sm:p-10 text-center relative overflow-hidden shadow-[6px_6px_0px_#111111]">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="font-display-pop text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                READY TO CRUSH YOUR EXAMS?
              </h2>

              <p className="text-xs sm:text-sm font-bold text-white/90 max-w-lg mx-auto leading-relaxed">
                Explore thousands of verified lecture notes, solved papers, and career links curated by engineering students.
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                <PillButton to="/resources" bgColor="#FACC15" textColor="#111111" iconComponent={BookOpen}>
                  Browse Vault
                </PillButton>
                <PillButton
                  href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                  bgColor="#FFFFFF"
                  textColor="#111111"
                  iconComponent={MessageSquare}
                >
                  Join WhatsApp Squad
                </PillButton>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Circular Lenis Progress Back-To-Top Dial with Spring Physics ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1, rotate: 6 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            onClick={() => {
              if (window.__lenis) {
                window.__lenis.scrollTo(0, {
                  duration: 1.2,
                  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-[#FACC15] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-amber-300 active:shadow-none flex items-center justify-center cursor-pointer group"
            title="Smooth Glide to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
