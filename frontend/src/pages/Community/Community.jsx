import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import { SPOTIFY_STUDY_CATEGORIES } from '../../data/spotifyStudyPlaylists';
import { getActivePoll, castVote } from '../../services/polls/pollsApi';
import { getPublicHomepageSettings } from '../../services/settings/settingsApi';

const DEFAULT_GROUP_LINKS = {
  whatsappSem1_4: 'https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB',
  whatsappSem5_8: 'https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB',
  telegramMain: 'https://t.me/+fP4hKU69AQIwZjI1',
  discordServer: 'https://discord.gg',
};

// ─── SVG Platform Icons ───────────────────────────────────────────────────────
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const TelegramIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.535-.197 1.005.128.832.941z" />
  </svg>
);

const SpotifyIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.216.353-.674.468-1.026.252-2.825-1.727-6.38-2.118-10.57-1.162-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.045 8.51-.599 11.68 1.348.352.216.468.674.252 1.026zm1.467-3.262c-.272.443-.85.586-1.293.314-3.235-1.988-8.167-2.564-11.993-1.402-.497.151-1.028-.135-1.179-.632-.151-.498.135-1.028.632-1.179 4.375-1.328 9.808-.687 13.52 1.606.443.272.585.85.313 1.293zm.126-3.41c-3.879-2.304-10.286-2.517-14.004-1.388-.595.181-1.229-.157-1.41-.752-.181-.595.157-1.229.752-1.41 4.271-1.296 11.341-1.05 15.795 1.595.536.318.712 1.012.394 1.548-.318.536-1.012.712-1.548.394z" />
  </svg>
);



// ─── Push Pin SVG Component ───────────────────────────────────────────────────
const PushPin = ({ color = '#EF4444', className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="5" fill={color} stroke="#0F172A" strokeWidth="2" />
    <path d="M12 12V22" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="10" cy="5.5" r="1.5" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (!numericTarget) return;
    const step = numericTarget / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  const suffix = target.includes('+') ? '+' : target.includes('%') ? '%' : target.includes('Min') ? ' Min' : '';
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Static Data Constants ───────────────────────────────────────────────────
const METRICS = [
  { label: 'Campus Members', value: '5,000+', icon: 'school', pinColor: '#EF4444', stamp: 'VERIFIED', rotation: '-1deg' },
  { label: 'Study Resources', value: '1,500+', icon: 'folder_shared', pinColor: '#F59E0B', stamp: '100% FREE', rotation: '1.5deg' },
  { label: 'Doubt Solve Speed', value: '5 Min', icon: 'bolt', pinColor: '#10B981', stamp: 'FAST HELP', rotation: '-1.5deg' },
  { label: 'Active Channels', value: '14+', icon: 'diversity_3', pinColor: '#6366F1', stamp: 'ACTIVE 24/7', rotation: '1deg' },
];

const PINNED_STICKIES = [
  {
    author: 'Keval (3rd Year CSE)',
    time: '12:41 PM',
    text: 'Need verified TOC Unit-3 Pumping Lemma numerical proofs for Mid-Sem!',
    tag: '#DoubtDesk',
    solution: 'Manan Gohil uploaded solved 2024 notes + cheat sheet (42 upvotes)',
    color: 'bg-[#FEF9C3] border-[#FACC15]', // Yellow sticky
    pinColor: '#EF4444',
  },
  {
    author: 'CampusHub Bot',
    time: '12:30 PM',
    text: '🚨 University Circular: Summer 2026 Exam Forms deadline extended till March 10th.',
    tag: '#ExamAlert',
    solution: 'Official Indus University PDF verified & pinned in Announcement Channel',
    color: 'bg-[#DCFCE7] border-[#86EFAC]', // Green sticky
    pinColor: '#10B981',
  },
  {
    author: 'Krish Patel',
    time: '12:15 PM',
    text: 'Google Summer of Code 2026 Org list released! Free AMA session tonight.',
    tag: '#CareerIntel',
    solution: '30-min roadmap webinar link shared in Tech Community',
    color: 'bg-[#E0F2FE] border-[#7DD3FC]', // Blue sticky
    pinColor: '#0EA5E9',
  },
];

const GUILD_PERKS = [
  {
    title: 'Instant Resource Requests',
    icon: 'search_check',
    desc: 'Can’t find a specific subject module or Indus University solution? Post in the room and get hand-curated links from peers in minutes.',
    color: 'bg-[#FEF3D6] border-amber-300',
  },
  {
    title: 'Senior & Alumni Mentorship',
    icon: 'workspace_premium',
    desc: 'Direct interaction with semester toppers, university rankers, and working alumni for viva questions, project reviews, and exam hacks.',
    color: 'bg-[#E0F2FE] border-sky-300',
  },
  {
    title: 'Fast Exam & Circular Alerts',
    icon: 'bolt',
    desc: 'Never get caught off-guard by sudden schedule changes, exam hall notifications, or urgent grade re-checking circulars.',
    color: 'bg-[#FFE4E6] border-rose-300',
  },
  {
    title: 'Hackathon Teammate Matcher',
    icon: 'groups_3',
    desc: 'Find designers, backend developers, and presentation leads for Smart India Hackathon (SIH), college hackathons, and ideathons.',
    color: 'bg-[#DCFCE7] border-emerald-300',
  },
  {
    title: 'Free Certification Roadmaps',
    icon: 'auto_awesome',
    desc: 'Access verified links to 100% free engineering courses, Cloud vouchers, AI workshops, and recognized skill certificates.',
    color: 'bg-[#F3E8FF] border-purple-300',
  },
  {
    title: 'Zero-Spam Learning Haven',
    icon: 'verified_user',
    desc: 'Active student moderators enforce zero spam, no promotional affiliate links, and pure academic value 24 hours a day.',
    color: 'bg-[#CCFBF1] border-teal-300',
  },
];

const FAQS = [
  {
    question: 'Are all CampusHub community groups and resources free?',
    answer: 'Yes, 100% free forever. CampusHub is an open student initiative created to make college notes, peer help, and exam alerts accessible to every learner without paywalls.',
  },
  {
    question: 'Which study channel should I join first?',
    answer: 'We recommend joining the "Official Student Broadcast" on WhatsApp for urgent timetables, plus our Telegram community lounge for daily notes and doubt resolution.',
  },
  {
    question: 'How does doubt solving work on the Quad board?',
    answer: 'Whenever you post an academic doubt in your group, active peers and verified senior rankers answer with handwritten snippets or step-by-step solutions within 5 to 10 minutes.',
  },
  {
    question: 'How do you keep the groups free from spam and ads?',
    answer: 'Our community operates under a strict Zero-Spam Policy. Verified student moderators and automated filters promptly ban unauthorized commercial links, promotions, or spam.',
  },
  {
    question: 'Can I contribute handwritten notes or become a student mentor?',
    answer: 'Yes! We warmly welcome note contributors and toppers. Reach out via our Contact desk or message any active group admin to get your verified contributor badge.',
  },
];

// ─── Main Community Component ─────────────────────────────────────────────────
export default function Community() {
  const { toasts, addToast, removeToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);

  // ─── Dynamic Live Campus Referendum / Ballot Box State ─────────
  const [activePoll, setActivePoll] = useState(null);
  const [pollLoading, setPollLoading] = useState(true);
  const [votedOptionId, setVotedOptionId] = useState(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [groupLinks, setGroupLinks] = useState(DEFAULT_GROUP_LINKS);

  // Load active poll & community group links from backend
  useEffect(() => {
    let mounted = true;
    async function fetchPollAndLinks() {
      try {
        const [poll, settings] = await Promise.all([
          getActivePoll().catch(() => null),
          getPublicHomepageSettings().catch(() => null),
        ]);
        if (mounted) {
          if (poll) {
            setActivePoll(poll);
            const savedVote = localStorage.getItem(`ch_voted_poll_${poll.id}`);
            if (savedVote) {
              setVotedOptionId(savedVote);
            }
          }
          if (settings && settings.communityGroups) {
            setGroupLinks({ ...DEFAULT_GROUP_LINKS, ...settings.communityGroups });
          }
        }
      } catch (err) {
        console.error('[Community] Failed to load initial data:', err);
      } finally {
        if (mounted) setPollLoading(false);
      }
    }
    fetchPollAndLinks();
    return () => { mounted = false; };
  }, []);

  // ─── Local Spotify Study Lounge State ─────────────────────────────────────
  const [activeCategoryId, setActiveCategoryId] = useState('lofi');
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const activeCategory = SPOTIFY_STUDY_CATEGORIES.find((c) => c.id === activeCategoryId) || SPOTIFY_STUDY_CATEGORIES[0];

  // Floating Stamp / Hype Reactions
  const [stampCount, setStampCount] = useState({
    cheer: 96,
    brain: 58,
    rocket: 134,
    hundred: 82,
  });
  const [floatingStamps, setFloatingStamps] = useState([]);

  const handleStamp = (type, emoji) => {
    setStampCount((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    const id = Date.now() + Math.random();
    const xOffset = Math.random() * 80 - 40;
    setFloatingStamps((prev) => [...prev, { id, emoji, xOffset }]);
    setTimeout(() => {
      setFloatingStamps((prev) => prev.filter((p) => p.id !== id));
    }, 1200);
  };

  const handleVote = async (optionId) => {
    if (!activePoll || votedOptionId || isSubmittingVote) return;

    setIsSubmittingVote(true);
    setVotedOptionId(optionId);

    // Optimistic calculation
    const currentTotal = (activePoll.totalVotes || 0) + 1;
    const updatedOptions = (activePoll.options || []).map((o) => {
      const newVotes = o.id === optionId ? (o.votes || 0) + 1 : (o.votes || 0);
      return {
        ...o,
        votes: newVotes,
        percentage: Math.round((newVotes / currentTotal) * 100),
      };
    });

    setActivePoll((prev) => ({
      ...prev,
      totalVotes: currentTotal,
      options: updatedOptions,
    }));

    try {
      const serverUpdated = await castVote(activePoll.id, optionId);
      if (serverUpdated) {
        setActivePoll(serverUpdated);
      }
      localStorage.setItem(`ch_voted_poll_${activePoll.id}`, optionId);
      addToast({ message: 'Stamped your vote in the Campus Ballot Box! 🗳️', type: 'success' });
    } catch (err) {
      console.error('[Community] Vote error:', err);
      addToast({ message: 'Vote recorded locally! Thanks for participating.', type: 'info' });
      localStorage.setItem(`ch_voted_poll_${activePoll.id}`, optionId);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const totalVotesCount = activePoll?.totalVotes || 0;

  return (
    <div className="pt-24 sm:pt-28 min-h-screen text-[#0F172A] font-body-md pb-24 relative overflow-hidden bg-[#FFF8EC]">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* ── Cork & Tactile Pinboard Pattern Background ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 -z-10"
        style={{
          backgroundImage: 'radial-gradient(#b45309 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating Reaction Stamps */}
      <div className="fixed bottom-12 right-12 z-50 pointer-events-none">
        {floatingStamps.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, y: 0, scale: 1, x: s.xOffset }}
            animate={{ opacity: 0, y: -130, scale: 1.6 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute text-3xl font-black drop-shadow-md"
          >
            {s.emoji}
          </motion.span>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 sm:space-y-12 relative z-10">
        {/* ══════════════════════════════════════════════════════════════════════════
            HERO CONCEPT: THE CAMPUS QUAD NOTICEBOARD & OFFICIAL STUDENT PASS
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left: The Official Student Guild Card / Lanyard Pass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#FFFDF9] rounded-[36px] p-7 sm:p-10 lg:p-12 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] relative flex flex-col justify-between overflow-hidden"
          >
            {/* Tactile Pushpin Header */}
            <div className="absolute top-4 right-6 flex items-center gap-2">
              <PushPin color="#EF4444" className="w-8 h-8 drop-shadow-md" />
            </div>

            <div className="space-y-6">

              {/* College Marquee Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border-2 border-[#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#0F172A]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-slate-900" />
                <span>The Student Quad · Est. 2026</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.12] text-[#0F172A]">
                Your Campus Hub for{' '}
                <span className="bg-[#FACC15] px-2.5 py-0.5 rounded-xl border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] inline-block my-1">
                  Peer Power
                </span>{' '}
                &amp; Notes.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-700 text-sm sm:text-base lg:text-lg font-bold max-w-xl leading-relaxed">
                Connect with 5,000+ engineers across 40+ colleges. Instant doubt resolution, verified toppers&apos; notes, live study rooms, and direct exam alerts.
              </p>

              {/* Stamp Reaction Bar */}
              <div className="pt-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                  📌 Stamp the quad bulletin board:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: 'cheer', emoji: '🔥', count: stampCount.cheer, label: 'Hype' },
                    { key: 'brain', emoji: '💡', count: stampCount.brain, label: 'Solved' },
                    { key: 'rocket', emoji: '🚀', count: stampCount.rocket, label: 'Boost' },
                    { key: 'hundred', emoji: '💯', count: stampCount.hundred, label: 'Verified' },
                  ].map((s) => (
                    <motion.button
                      key={s.key}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => handleStamp(s.key, s.emoji)}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FEF3D6] border-2 border-[#0F172A] text-xs font-black text-[#0F172A] shadow-[2px_2px_0px_#0F172A] transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <span>{s.emoji}</span>
                      <span>{s.count}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Primary High-Energy Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href={groupLinks.whatsappSem1_4 || groupLinks.whatsappSem5_8 || DEFAULT_GROUP_LINKS.whatsappSem1_4}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 sm:px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#0F172A]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                  <span>Join WhatsApp Community</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>

                <a
                  href={groupLinks.telegramMain || DEFAULT_GROUP_LINKS.telegramMain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B132B] hover:bg-[#152244] text-[#FACC15] font-black px-6 sm:px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#FACC15]"
                >
                  <TelegramIcon className="w-5 h-5 text-[#FACC15]" />
                  <span>Join Telegram Channel</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Bottom Pass Barcode Mockup */}
            <div className="pt-6 mt-6 border-t-2 border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Verified by Indus University Rankers &amp; Alumni
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
                |||| | ||||| || |||||| PASS-FREE
              </span>
            </div>
          </motion.div>

          {/* Right: The Live Corkboard Noticeboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-[#FAF6ED] rounded-[36px] p-6 sm:p-7 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] flex-grow flex flex-col justify-between relative overflow-hidden">

              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📌</span>
                    <div>
                      <h2 className="font-black text-sm text-slate-900 uppercase tracking-tight">Quad Noticeboard</h2>
                      <p className="text-[11px] text-slate-500 font-bold">Live pinned peer discussions</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Pulse
                  </span>
                </div>

                {/* Pinned Sticky Notes */}
                <div className="space-y-3.5 mt-4">
                  {PINNED_STICKIES.map((note, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, rotate: 0 }}
                      className={`p-4 rounded-2xl border-2 ${note.color} shadow-[3px_3px_0px_rgba(15,23,42,0.15)] relative transition-all`}
                      style={{ transform: `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})` }}
                    >
                      <div className="absolute -top-3 left-4">
                        <PushPin color={note.pinColor} className="w-5 h-5" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-black text-slate-900">{note.author}</span>
                        <span className="font-bold text-slate-500">{note.time}</span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                        &quot;{note.text}&quot;
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-extrabold text-emerald-800">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          {note.solution}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-black/10 text-slate-800 text-[10px]">
                          {note.tag}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Noticeboard Footer */}
              <div className="pt-3 mt-3 border-t-2 border-slate-200 text-center">
                <span className="text-[11px] font-black text-slate-600 flex items-center justify-center gap-1">
                  ⚡ Over 120+ peer discussions solved daily on our Quad board
                </span>
              </div>

            </div>
          </motion.div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 2: 4 TACTILE BULLETIN METRIC BADGES
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {METRICS.map((m, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, rotate: 0 }}
              style={{ transform: `rotate(${m.rotation})` }}
              className="bg-white rounded-2xl p-5 border-2 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between relative group transition-all"
            >
              <div className="absolute -top-3 left-4">
                <PushPin color={m.pinColor} className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between mb-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3D6] border-2 border-[#0F172A] text-slate-900 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">{m.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  {m.stamp}
                </span>
              </div>

              <div>
                <p className="font-black text-3xl text-slate-900 tracking-tight leading-none">
                  <AnimatedCounter target={m.value} />
                </p>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mt-1.5">{m.label}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{m.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 3: THE QUAD ACOUSTIC STAGE & STUDENT BALLOT BOX
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left: The Spotify Study & Chill Lounge */}
          <div className="lg:col-span-6 bg-[#FEF3D6] rounded-[32px] p-6 sm:p-8 border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              {/* Pill & Live Vibes Header */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F172A] text-[#1DB954] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#0F172A]">
                  <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
                  <span>Spotify Study Lounge</span>
                </span>
                <span className="text-xs text-slate-700 font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping" />
                  🎧 340+ Students Vibing
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  Bored or Tired? Play Study Beats
                </h2>
                <p className="text-xs text-slate-700 font-bold leading-relaxed mt-1">
                  Listen to student-curated Lo-Fi beats, deep coding soundscapes, and chill acoustic tracks directly while studying.
                </p>
              </div>

              {/* Playlist Category Quick Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {SPOTIFY_STUDY_CATEGORIES.map((cat) => {
                  const isSelected = cat.id === activeCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        if (activeCategoryId !== cat.id) {
                          setActiveCategoryId(cat.id);
                          setIsPlayerLoaded(false);
                        }
                      }}
                      className={`py-2.5 px-3 text-center rounded-xl text-xs font-black transition-all cursor-pointer border-2 border-[#0F172A] truncate flex items-center justify-center ${isSelected
                          ? 'bg-[#1DB954] text-slate-950 shadow-[3px_3px_0px_#0F172A] scale-[1.02]'
                          : 'bg-white text-slate-800 hover:bg-[#FFFDF9] shadow-[1px_1px_0px_#0F172A]'
                        }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Official Spotify Mini Player Embed */}
              <div className="rounded-[28px] overflow-hidden border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] bg-[#121212] p-1.5 relative transition-all group/player min-h-[352px]">
                {/* Sleek Spotify Loading State */}
                {!isPlayerLoaded && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#121212] rounded-[22px] text-white">
                    <div className="w-8 h-8 rounded-full border-2 border-[#1DB954] border-t-transparent animate-spin mb-2" />
                    <span className="text-xs text-white/60 font-mono">Syncing Spotify Player...</span>
                  </div>
                )}

                <iframe
                  key={activeCategory.playlistId}
                  onLoad={() => setIsPlayerLoaded(true)}
                  style={{ borderRadius: '22px' }}
                  src={`https://open.spotify.com/embed/playlist/${activeCategory.playlistId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`Spotify Web Player - ${activeCategory.name}`}
                  className="w-full rounded-[22px]"
                />
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-4 mt-4 border-t-2 border-slate-900/10 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`https://open.spotify.com/playlist/${activeCategory.playlistId || '37i9dQZF1DX0XUfTFmNBRM'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-[#1DB954] hover:bg-[#1aa34a] text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <SpotifyIcon className="w-5 h-5 text-slate-950" />
                <span>Open &quot;{activeCategory.label}&quot; in Spotify</span>
                <span className="w-5 h-5 rounded-md border border-slate-950/40 flex items-center justify-center bg-slate-950/10">
                  <span className="material-symbols-outlined text-xs text-slate-950">open_in_new</span>
                </span>
              </a>

              <span className="text-xs sm:text-sm text-slate-800 font-extrabold">
                Curated for Indus University Peers
              </span>
            </div>
          </div>

          {/* Right: The Student Ballot Box */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-6 sm:p-8 border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between relative overflow-hidden gap-5">
            {pollLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-amber-400 border-t-slate-900 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Syncing Campus Referendum...</p>
              </div>
            ) : activePoll ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] text-slate-900 border-2 border-[#0F172A] text-xs font-black shadow-[2px_2px_0px_#0F172A]">
                    <span className="material-symbols-outlined text-sm">how_to_vote</span>
                    {activePoll.badgeLabel || 'Campus Referendum Box'}
                  </span>
                  <span className="text-xs text-slate-500 font-black flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {totalVotesCount} Ballots Cast
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {activePoll.title}
                </h2>
                {activePoll.description && (
                  <p className="text-xs text-slate-600 font-bold mt-1">
                    {activePoll.description}
                  </p>
                )}

                {/* Poll Options with Icons */}
                <div className="space-y-2.5 mt-4">
                  {(activePoll.options || []).map((opt) => {
                    const isChosen = votedOptionId === opt.id;
                    const pct = opt.percentage || 0;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleVote(opt.id)}
                        disabled={!!votedOptionId || isSubmittingVote}
                        className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-black transition-all relative overflow-hidden cursor-pointer flex items-center justify-between ${
                          isChosen
                            ? 'border-[#0F172A] bg-amber-100 text-slate-900 shadow-[3px_3px_0px_#0F172A] scale-[1.01]'
                            : votedOptionId
                            ? 'border-slate-300 bg-slate-50 text-slate-700 opacity-90'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-[#0F172A] hover:bg-white hover:shadow-[2px_2px_0px_#0F172A]'
                        }`}
                      >
                        {votedOptionId && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={`absolute top-0 left-0 bottom-0 ${
                              isChosen ? 'bg-amber-300/50' : 'bg-slate-200/60'
                            } pointer-events-none`}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-2.5 min-w-0 pr-2">
                          <span
                            className={`material-symbols-outlined text-base shrink-0 ${
                              isChosen ? 'text-[#0F172A]' : 'text-slate-500'
                            }`}
                          >
                            {opt.icon || 'description'}
                          </span>
                          <span className="truncate">{opt.text}</span>
                        </div>
                        <div className="relative z-10 shrink-0">
                          {votedOptionId ? (
                            <span className="font-black text-xs font-mono text-slate-900 px-2 py-0.5 rounded-lg bg-white/90 border border-slate-300">
                              {pct}%
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900">
                              Vote
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-bold text-xs">
                No active referendum today. Check back soon for the next campus vault poll!
              </div>
            )}

            {/* Live Referendum Impact & Drop Schedule Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-[#FEF3D6] p-3 rounded-2xl border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-center">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block">
                  Top Demand
                </span>
                <span className="text-xs font-black text-slate-900 truncate block mt-0.5">
                  {activePoll?.statusTopDemand || activePoll?.computedTopDemand || 'Solved PYQs (48%)'}
                </span>
              </div>
              <div className="bg-[#E0F2FE] p-3 rounded-2xl border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-center">
                <span className="text-[10px] uppercase font-black tracking-wider text-sky-800 block">
                  Vault Drop
                </span>
                <span className="text-xs font-black text-slate-900 block mt-0.5">
                  {activePoll?.statusVaultDrop || 'Friday @ 6 PM'}
                </span>
              </div>
              <div className="bg-[#DCFCE7] p-3 rounded-2xl border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-center">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                  Resolved Total
                </span>
                <span className="text-xs font-black text-slate-900 block mt-0.5">
                  {activePoll?.statusResolved || '480+ Papers'}
                </span>
              </div>
            </div>

            {/* Bottom Action Trigger matching Spotify card */}
            <div className="pt-4 border-t-2 border-slate-900/10 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/resources"
                className="px-5 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <span className="material-symbols-outlined text-base text-[#FACC15]">folder_special</span>
                <span>Open Study Resource Vault</span>
                <span className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center bg-white/10">
                  <span className="material-symbols-outlined text-xs text-white">arrow_forward</span>
                </span>
              </Link>

              <span className="text-xs sm:text-sm text-slate-800 font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                100% Peer Verified
              </span>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 4: EXCLUSIVE GUILD PERKS (TACTILE CARDS)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF3D6] text-slate-900 text-xs font-black uppercase tracking-wider mb-2 border border-[#0F172A]">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span>Member Privileges</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Join the CampusHub Community?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-bold mt-1 max-w-2xl">
              Everything you need to excel in university exams, lab vivas, hackathons, and placement drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUILD_PERKS.map((perk, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className={`rounded-3xl p-6 border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between group ${perk.color}`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#FACC15] border-2 border-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_#0F172A]">
                    <span className="material-symbols-outlined text-2xl">{perk.icon}</span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 group-hover:text-amber-800 transition-colors">
                    {perk.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                    {perk.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-black/10 flex items-center text-xs font-black text-slate-700">
                  <span>Available in all groups</span>
                  <span className="material-symbols-outlined text-sm ml-auto">chevron_right</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 5: CODE OF CONDUCT & HELPDESK ACCORDION
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* FAQ Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FEF3D6] text-slate-900 text-xs font-black uppercase tracking-wider mb-2 border border-[#0F172A]">
                <span className="material-symbols-outlined text-sm">help</span>
                <span>Frequently Asked Questions</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, fIdx) => {
                const isOpen = openFaq === fIdx;
                return (
                  <div
                    key={fIdx}
                    className="bg-white rounded-2xl border-2 border-[#0F172A] overflow-hidden shadow-[3px_3px_0px_#0F172A]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`material-symbols-outlined text-lg text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-700' : ''
                          }`}
                      >
                        expand_more
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-4 pt-1 text-xs text-slate-600 font-bold leading-relaxed border-t-2 border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quad Code of Conduct */}
          <div className="lg:col-span-5 bg-[#FAF6ED] p-6 sm:p-8 rounded-3xl border-3 border-[#0F172A] shadow-[6px_6px_0px_#0F172A] text-slate-900 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#FACC15] flex items-center justify-center font-black border-2 border-[#0F172A]">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Quad Code of Conduct</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-bold">
                Our student groups operate under strict active moderation to guarantee an ad-free, spam-free learning haven.
              </p>

              <ul className="space-y-2.5 pt-1">
                {[
                  'Zero tolerance for commercial spam or marketing links',
                  'Only verified syllabus notes & genuine paper solutions',
                  'Academic decorum & mutual respect for all peers',
                  'Privacy protected: no unsolicited direct messaging',
                ].map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-black">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-slate-200 text-center">
              <Link
                to="/contact"
                className="text-xs font-black text-slate-900 hover:text-amber-700 underline inline-flex items-center gap-1"
              >
                <span>Report an issue or contact Admin Desk</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            SECTION 6: CLAIM YOUR PASS (BOTTOM TICKET BANNER)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="bg-[#FACC15] rounded-[36px] p-8 sm:p-12 text-center text-slate-950 border-3 border-[#0F172A] shadow-[8px_8px_0px_#0F172A] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-[#FACC15] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#0F172A]">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              <span>Join 5,000+ Student Engineers</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-950">
              Never Study Alone Again.
            </h2>

            <p className="text-slate-900 text-xs sm:text-sm sm:text-base font-extrabold max-w-lg mx-auto">
              Get instant study materials, fast doubt solutions, and exam alerts delivered directly to your phone.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F172A] hover:bg-slate-800 text-[#FACC15] font-black px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#0F172A] text-xs sm:text-sm"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                <span>Join Official WhatsApp</span>
              </a>

              <a
                href="https://t.me/+fP4hKU69AQIwZjI1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-950 font-black px-7 py-3.5 rounded-2xl inline-flex items-center gap-2.5 shadow-[4px_4px_0px_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer border-2 border-[#0F172A] text-xs sm:text-sm"
              >
                <TelegramIcon className="w-5 h-5 text-[#229ED9]" />
                <span>Join Official Telegram</span>
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
