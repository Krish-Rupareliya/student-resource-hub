import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSemesters } from '../../hooks/useSemesters';
import { SemesterCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import pinIcon from './thumb tack 2 plain.svg';
import hackerIcon from './hacker-icon.png';
import sparklesIcon from './sparkles-icon.png';
import databaseIcon from './database-icon.png';
import computerIcon from './computer-icon.png';
import exceptionIcon from './exception-icon.png';
import dataScienceIcon from './data-science-icon.png';
import dnaIcon from './dna-icon.png';

function Semesters() {
  const navigate = useNavigate();
  const { semesters, loading, error, refetch } = useSemesters();
  const gridRef = useRef(null);
  const [pathData, setPathData] = useState({ path: '', points: [], width: 0, height: 0 });

  // Dynamically calculate the curved flow path connecting pushpins
  const updatePath = useCallback(() => {
    if (!gridRef.current) return;
    const container = gridRef.current;
    const containerRect = container.getBoundingClientRect();
    const pinElements = Array.from(container.querySelectorAll('[data-semester-pin]'));

    if (pinElements.length < 2) {
      setPathData({ path: '', points: [], width: containerRect.width, height: containerRect.height });
      return;
    }

    const points = pinElements.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height * 0.45 - containerRect.top,
      };
    });

    // Build continuous smooth bezier path
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      const isSameRow = Math.abs(dy) < 100 && dx > 40;
      const isRowWrap = dy >= 100 && dx < -40;

      if (isSameRow) {
        // Same horizontal row (desktop/tablet): natural hanging yarn curve
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const dist = Math.hypot(dx, dy);
        const sag = Math.min(26, Math.max(10, dist * 0.06));
        d += ` Q ${midX.toFixed(1)} ${(midY + sag).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      } else if (isRowWrap) {
        // Multi-column row wrap: S-curve looping around the end of row through the row gap
        const deltaY = p2.y - p1.y;
        const midY = p1.y + deltaY * 0.5;
        const midX = (p1.x + p2.x) / 2;

        const maxRight = Math.max(15, (containerRect.width - p1.x - 15) * 0.6);
        const maxLeft = Math.max(15, (p2.x - 15) * 0.6);
        const rightLoop = Math.min(65, maxRight);
        const leftLoop = Math.min(65, maxLeft);

        const cp1x = p1.x + rightLoop;
        const cp1y = p1.y + deltaY * 0.15;
        const cp2x = midX + Math.abs(p1.x - midX) * 0.4;
        const cp2y = midY;

        const cp3x = midX - Math.abs(midX - p2.x) * 0.4;
        const cp3y = midY;
        const cp4x = p2.x - leftLoop;
        const cp4y = p2.y - deltaY * 0.15;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
        d += ` C ${cp3x.toFixed(1)} ${cp3y.toFixed(1)}, ${cp4x.toFixed(1)} ${cp4y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      } else {
        // Vertical stacked flow (mobile single column):
        // Clean vertical flow connecting pin to pin behind cards
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        d += ` Q ${midX.toFixed(1)} ${midY.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
    }

    setPathData({
      path: d,
      points,
      width: Math.round(containerRect.width),
      height: Math.round(containerRect.height),
    });
  }, []);

  // Recalculate on mount, data changes, and viewport resize
  useEffect(() => {
    if (loading) return;

    const t1 = setTimeout(updatePath, 50);
    const t2 = setTimeout(updatePath, 200);

    const observer = new ResizeObserver(() => updatePath());
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    window.addEventListener('resize', updatePath);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
      window.removeEventListener('resize', updatePath);
    };
  }, [loading, semesters, updatePath]);

  return (
    <div
      className="pt-20 text-on-surface font-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container relative overflow-x-clip"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '32px 32px'
      }}
    >
      {/* Header / Breadcrumb Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-12 pb-6 overflow-x-clip">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 font-label-lg text-label-lg text-secondary">
          <Link to="/" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/resources" className="hover:text-amber-600 opacity-70 transition-colors font-medium">Resources</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-black font-extrabold">Computer Engineering</span>
        </nav>
        <h1 className="font-display-lg text-display-lg md:text-display-lg-mobile text-on-surface mb-4 font-bold text-4xl">
          Computer Engineering Semesters
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Explore study resources for Computer Engineering across all semesters. Access hand-picked notes, papers, and lab manuals.
        </p>
      </section>

      {/* The "Bulletin Board" Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-12 relative overflow-x-clip">
        {/* Error state */}
        {error && !loading && (
          <ErrorState
            message={error}
            onRetry={refetch}
            className="max-w-xl mx-auto"
          />
        )}

        {/* Bento Grid with Dynamic Flow Thread */}
        <div ref={gridRef} className="flex flex-wrap justify-center gap-x-8 gap-y-16 lg:gap-x-16 lg:gap-y-24 relative overflow-visible">
          {/* Dynamic SVG Flow Thread (1:1 subpixel overlay) */}
          {pathData.path && (
            <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
              <style>
                {`
                  @keyframes thread-flow {
                    from {
                      stroke-dashoffset: 0;
                    }
                    to {
                      stroke-dashoffset: -180;
                    }
                  }
                  .animate-thread-flow {
                    animation: thread-flow 10s linear infinite;
                  }
                `}
              </style>
              <svg className="w-full h-full overflow-visible">
                <defs>
                  {/* Vibrant continuous journey gradient */}
                  <linearGradient id="semester-flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="20%" stopColor="#0EA5E9" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="60%" stopColor="#8B5CF6" />
                    <stop offset="80%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                  <filter id="thread-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.1" />
                  </filter>
                </defs>

                {/* Layer 1: Ambient Depth Shadow */}
                <path
                  d={pathData.path}
                  fill="none"
                  stroke="rgba(15, 23, 42, 0.06)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(0, 3)"
                />

                {/* Layer 2: Subtle Under-track */}
                <path
                  d={pathData.path}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.45"
                />

                {/* Layer 3: Vibrant Animated Flow Thread */}
                <path
                  d={pathData.path}
                  fill="none"
                  stroke="url(#semester-flow-gradient)"
                  strokeWidth="3"
                  strokeDasharray="8 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-thread-flow"
                  filter="url(#thread-shadow)"
                />
              </svg>
            </div>
          )}

          {/* Loading: show skeleton placeholders */}
          {loading && Array.from({ length: 7 }).map((_, i) => (
            <SemesterCardSkeleton key={i} />
          ))}

          {/* Loaded: render semester cards */}
          {!loading && !error && semesters.map((sem, index) => {
            const getLayoutStyles = (i) => {
              const styles = [
                'lg:-rotate-3 lg:mt-0',    // 1
                'lg:rotate-1 lg:mt-8',     // 2
                'lg:rotate-3 lg:mt-2',     // 3
                'lg:rotate-2 lg:mt-4',     // 4
                'lg:-rotate-2 lg:mt-12',   // 5
                'lg:-rotate-3 lg:mt-6',    // 6
                'lg:rotate-1 lg:mt-4',     // 7
                'lg:-rotate-2 lg:mt-8',    // 8
              ];
              return styles[i % styles.length];
            };
            const cardColors = {
              emerald: {
                pinFilter: 'hue-rotate-[140deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#e5fad5]',
                numText: 'text-[#1e5c00]',
              },
              sky: {
                pinFilter: 'hue-rotate-[240deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#d5f3fa]',
                numText: 'text-[#004e5c]',
              },
              yellow: {
                pinFilter: 'hue-rotate-[60deg] brightness-125 drop-shadow-md',
                innerBg: 'bg-[#fdf2d5]',
                numText: 'text-[#5c4a00]',
              },
              purple: {
                pinFilter: 'hue-rotate-[280deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#e5d5fa]',
                numText: 'text-[#3a005c]',
              },
              orange: {
                pinFilter: 'hue-rotate-[30deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#fae5d5]',
                numText: 'text-[#5c2a00]',
              },
              cyan: {
                pinFilter: 'hue-rotate-[200deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#d5faf0]',
                numText: 'text-[#005c48]',
              },
              rose: {
                pinFilter: 'hue-rotate-[330deg] brightness-110 drop-shadow-md',
                innerBg: 'bg-[#fad5e0]',
                numText: 'text-[#5c0022]',
              },
            };

            const colors = cardColors[sem.pinColor] || cardColors['emerald'];

            return (
              <motion.div
                key={sem.id}
                drag
                dragSnapToOrigin
                dragMomentum={false}
                dragConstraints={gridRef}
                dragElastic={0.15}
                onDrag={updatePath}
                onDragEnd={updatePath}
                whileHover={{ scale: 1.03, y: -8, zIndex: 30 }}
                whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: 'grabbing' }}
                onClick={(e) => {
                  if (!e.defaultPrevented) {
                    navigate(`/semesters/${sem.id}`);
                  }
                }}
                className={`group relative z-10 w-[calc(100%-20px)] sm:w-[calc(50%-16px)] lg:w-[30%] max-w-[335px] rounded-[32px] bg-white p-3 sm:p-4 pt-10 sm:pt-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-shadow duration-300 min-h-[340px] cursor-grab touch-pan-y select-none ${getLayoutStyles(index)}`}
              >
                {/* Pin */}
                <div
                  data-semester-pin
                  className="absolute left-1/2 -top-2 sm:top-[-4px] -translate-x-1/2 z-20 pointer-events-none transition-transform duration-300 group-hover:scale-110"
                >
                  <img
                    src={pinIcon}
                    alt="Pin"
                    className={`w-14 h-14 sm:w-16 sm:h-16 object-contain ${colors.pinFilter}`}
                  />
                </div>

                {/* Card Body */}
                <div className={`relative h-full overflow-hidden rounded-[24px] ${colors.innerBg} p-6 flex flex-col`}>
                  {/* Decorative Icon */}
                  <div className="absolute right-5 top-5">
                    {sem.semesterNumber === 1 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={sparklesIcon} alt="Sparkles" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 2 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={dnaIcon} alt="DNA" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 3 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={databaseIcon} alt="Database" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 4 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={computerIcon} alt="Computer" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 5 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={exceptionIcon} alt="Exception" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 6 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={dataScienceIcon} alt="Data Science" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : sem.semesterNumber === 7 ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <img src={hackerIcon} alt="Hacker" className="w-full h-full object-contain filter drop-shadow-sm" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 opacity-90 transition-transform group-hover:scale-105 group-hover:rotate-[2deg]">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#F24E1E]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#A259FF]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FF7262]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1ABCFE]" />
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0ACF83]" />
                      </div>
                    )}
                  </div>

                  <p className={`text-4xl sm:text-5xl font-black ${colors.numText} mb-1 tracking-tighter font-display-lg`}>
                    {String(sem.semesterNumber).padStart(2, '0')}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-900 font-display-lg tracking-tight">
                    {sem.name}
                  </h3>

                  <p className="mt-2 text-sm sm:text-[15px] leading-6 text-gray-800 font-medium flex-grow pr-4">
                    {sem.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-full text-xs font-black bg-white/70 text-gray-900 shadow-sm border border-white tracking-wide">
                      {sem.resourcesCount}
                    </span>
                    <div className={`bg-white/80 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-sm`}>
                      <span className={`material-symbols-outlined ${colors.numText} text-[20px] leading-none m-0 p-0`}>
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── CTA BANNER: "Can't find your resource?" ─── */}
      <section className="py-8 sm:py-12 md:py-16 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Dark CTA Box */}
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl bg-[#0B132B] border border-white/10">
            
            {/* Top Left Yellow Ring Accent */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 sm:border-[3px] border-[#FBBF24] opacity-90 pointer-events-none" />

            {/* Paper Airplane Trail Image (Left Side) */}
            <div className="absolute bottom-0 left-0 h-28 sm:h-44 md:h-[88%] max-h-full w-auto pointer-events-none z-0 sm:z-10 flex items-end opacity-40 sm:opacity-75 md:opacity-90">
              <img
                src="/images/paper-airplane-trail.png"
                alt="Paper Airplane Trail"
                className="h-full w-auto object-contain object-bottom"
              />
            </div>

            {/* Top-Right Royal Blue Circle - Responsive Sizing */}
            <div className="absolute -top-16 -right-16 sm:-top-28 sm:-right-20 w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-[#1350E8] opacity-90 pointer-events-none" />

            {/* Top-Right Yellow Dot Matrix Grid - Hidden on mobile */}
            <div className="absolute top-6 right-8 sm:top-7 sm:right-8 pointer-events-none hidden sm:block z-10">
              <svg className="w-24 h-18 md:w-32 md:h-24" viewBox="0 0 100 80">
                <pattern id="cta-yellow-dots-sem" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="2.2" fill="#FBBF24" />
                </pattern>
                <rect width="100" height="80" fill="url(#cta-yellow-dots-sem)" />
              </svg>
            </div>

            {/* Bottom-Right Amber/Yellow Burst Circle - Responsive Sizing */}
            <div className="absolute -bottom-20 -right-10 sm:-bottom-24 sm:-right-12 w-44 h-44 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-xl pointer-events-none opacity-80 sm:opacity-100" />

            {/* Content Container */}
            <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-14 md:px-14 md:py-20 text-center max-w-2xl mx-auto space-y-4 sm:space-y-5">
              <h2 className="text-2xl sm:text-3xl md:text-[38px] font-black text-white leading-tight tracking-tight">
                Can&apos;t find{' '}
                <span className="relative inline-block mt-1">
                  what you&apos;re looking for?
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2 text-white/70"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 6 Q 50 0 100 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                Our community is constantly updating the resource library. If a specific paper or note is missing, let us know and we&apos;ll track it down for you.
              </p>

              {/* Responsive Buttons Container */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-white hover:bg-amber-400 text-hub-navy hover:text-black font-black px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2 active-press"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg leading-none">assignment_add</span>
                  <span>Request Resource</span>
                </Link>

                <a
                  href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border-2 border-white/50 hover:border-white text-white font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-white/10 transition-all duration-300 text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer active-press"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg leading-none">groups</span>
                  <span>Join WhatsApp Community</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Semesters;
