import React, { useState, useEffect } from 'react';
import { Zap, Bell, Sparkles, BookOpen, GraduationCap, Flame, ShieldCheck } from 'lucide-react';
import { getPublicAnnouncements } from '../../../services/settings/settingsApi';

const DEFAULT_ANNOUNCEMENTS = [
  { badge: 'Exam Alert', icon: 'bell', text: 'Indus Winter 2025-26 Exam Schedule is live' },
  { badge: 'New Notes', icon: 'book', text: '1,200+ OCR-verified semester notes uploaded' },
  { badge: 'Free Access', icon: 'shield', text: '100% Free - No paywalls or subscriptions' },
  { badge: 'Community', icon: 'sparkles', text: '5,000+ engineering students connected' },
  { badge: 'Viva Prep', icon: 'grad', text: 'Viva cheat sheets & lab manuals updated' },
  { badge: 'Trending', icon: 'flame', text: 'Indus Previous Year Questions now available' },
];

function getIconComponent(iconName) {
  switch (iconName?.toLowerCase()) {
    case 'bell':
    case 'alert':
    case 'exam alert':
      return <Bell className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />;
    case 'book':
    case 'new content':
    case 'notes':
      return <BookOpen className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />;
    case 'shield':
    case 'security':
    case 'verified':
      return <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />;
    case 'grad':
    case 'school':
      return <GraduationCap className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />;
    case 'flame':
    case 'fire':
    case 'trending':
      return <Flame className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />;
    case 'zap':
    case 'bolt':
    default:
      return <Zap className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />;
  }
}

function stripEmojis(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim();
}

export default function TickerTape() {
  const [items, setItems] = useState(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    let isMounted = true;
    async function loadAnnouncements() {
      try {
        const data = await getPublicAnnouncements();
        if (Array.isArray(data) && data.length > 0 && isMounted) {
          const formatted = data.map((ann) => ({
            badge: ann.badge ? stripEmojis(ann.badge) : null,
            icon: ann.icon || (ann.badge ? ann.badge.toLowerCase() : 'zap'),
            text: stripEmojis(ann.text || ''),
          }));
          setItems(formatted);
        }
      } catch (err) {
        console.warn('Failed to load announcements ticker:', err);
      }
    }
    loadAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderTrack = () => (
    <div className="flex shrink-0 items-center gap-6 sm:gap-8 whitespace-nowrap pr-6 sm:pr-8">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <div className="flex items-center gap-2 font-sans text-xs sm:text-[13px] font-bold tracking-wide text-slate-100">
            {getIconComponent(item.icon)}
            {item.badge && (
              <span className="bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shrink-0">
                {item.badge}
              </span>
            )}
            <span className="text-slate-100 font-medium">{item.text}</span>
          </div>
          <span className="text-[#FACC15]/60 text-xs font-black select-none">✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="w-full bg-[#0F172A] text-white border-b-2 border-[#0F172A] overflow-hidden py-2.5 select-none shadow-sm pause-marquee-on-hover relative z-20 font-sans">
      <div className="flex w-max animate-marquee" style={{ animationDuration: '32s' }}>
        {renderTrack()}
        {renderTrack()}
      </div>
    </section>
  );
}

