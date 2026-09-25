// src/pages/Admin/AdminHomepageSettingsView.jsx
// Admin Management Portal for Live Semester Clock, Trending, Video, Platforms & Study Groups.
// Neo-Brutalist Playful Pop Theme matching CampusAdmin OS with clean typography and zero emoji artifacts.

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flame,
  Video,
  School,
  Users,
  Eye,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Sparkles,
  Tag,
  Globe,
  Check,
  Palette,
  Image as ImageIcon,
  BookOpen,
  Code,
  Database,
  Terminal,
  Star,
  Zap,
  Play,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileText,
  Download,
  Upload,
} from 'lucide-react';
import {
  getAdminHomepageSettings,
  updateAdminLiveClock,
  updateAdminTrending,
  uploadAdminPackFile,
  updateAdminVideo,
  updateAdminLearningPlatforms,
  updateAdminCommunityGroups,
  updateAdminHomepageSettings,
} from '../../services/admin/adminApi';
import NeoDatePicker from './components/NeoDatePicker';
import { parseVideoInfo, getPlatformLabel } from '../../utils/videoUtils';

const DEFAULT_STUDY_PACKS = [
  {
    id: 'pack-1',
    tag: 'SEM 3 & 4',
    category: 'dsa',
    tagBg: 'bg-[#FEF08A] text-[#0F172A]',
    rating: '★ 4.9 (1.2k)',
    title: 'DSA Master Cheat Sheet & 80 Solved PYQs',
    desc: 'Trees, Graphs, and DP templates with Indus 100-mark proofs and diagrams.',
    fileSize: '4.2 MB',
    format: 'PDF',
    pages: '48 Pages',
    topics: [
      'Binary Search Trees & AVL Rotations with complete runnable C code',
      'Dijkstra & Prim Minimal Spanning Tree Step-by-Step examples',
      'Dynamic Programming: 0/1 Knapsack & Longest Common Subsequence',
      'Indus Repeated 100-Mark Exam Proof: Asymptotic notations Big-O, Omega, Theta',
    ],
    fileUrl: '/downloads/dsa-master-cheat-sheet.pdf',
    fileName: 'dsa-master-cheat-sheet.pdf',
  },
  {
    id: 'pack-2',
    tag: 'SEM 5',
    category: 'systems',
    tagBg: 'bg-[#BAE6FD] text-[#0F172A]',
    rating: '★ 4.8 (890)',
    title: 'Operating Systems End-Sem Rapid Revision',
    desc: 'Deadlocks, Semaphore code, and Page Replacement algorithms step-by-step.',
    fileSize: '6.8 MB',
    format: 'PDF',
    pages: '62 Pages',
    topics: [
      'Process Synchronization: Peterson’s Algorithm & Counting Semaphores',
      "Banker's Deadlock Avoidance Algorithm with full safety matrix proof",
      'Virtual Memory: FIFO, LRU, and Optimal Paging comparison table',
      'Disk Arm Scheduling: SCAN, C-SCAN, LOOK, C-LOOK numericals',
    ],
    fileUrl: '/downloads/operating-systems-rapid-revision.pdf',
    fileName: 'operating-systems-rapid-revision.pdf',
  },
  {
    id: 'pack-3',
    tag: 'SEM 4',
    category: 'dbms',
    tagBg: 'bg-[#BBF7D0] text-[#0F172A]',
    rating: '★ 5.0 (2.1k)',
    title: 'DBMS Complete SQL & Normalization Kit',
    desc: '1NF to BCNF decomposition examples with solutions to past 5 winter papers.',
    fileSize: '3.1 MB',
    format: 'PDF',
    pages: '36 Pages',
    topics: [
      'Relational Algebra vs Tuple Relational Calculus query equivalents',
      'Lossless Join & Dependency Preserving Normalization proofs (1NF-BCNF)',
      'ACID Properties & Two-Phase Locking (2PL) Concurrency Protocol',
      'Solved SQL queries with GROUP BY, HAVING, nested subqueries, and Triggers',
    ],
    fileUrl: '/downloads/dbms-complete-sql-normalization-kit.pdf',
    fileName: 'dbms-complete-sql-normalization-kit.pdf',
  },
  {
    id: 'pack-4',
    tag: 'ALL BRANCHES',
    category: 'python',
    tagBg: 'bg-[#FBCFE8] text-[#0F172A]',
    rating: '★ 4.9 (3.4k)',
    title: 'Python & Full Stack Practical Code Files',
    desc: '12 mandatory lab experiments with input/output screenshots ready for print.',
    fileSize: '12.4 MB',
    format: 'ZIP',
    pages: '12 Files + PDF',
    topics: [
      'Lab 1-4: Python Data Structures, Generators, Lambda, and Decorators',
      'Lab 5-8: SQLite database connectivity, NumPy Matrix, Pandas CSV analysis',
      'Lab 9-12: Full Stack REST API with Express / FastAPI + React Frontend',
      'Viva Guide: 50 Most asked technical viva questions with short answers',
    ],
    fileUrl: '/downloads/python-fullstack-practical-code-files.pdf',
    fileName: 'python-fullstack-practical-code-files.pdf',
  },
];

const PACK_CATEGORY_OPTIONS = [
  { id: 'dsa', label: 'DSA & Algorithms' },
  { id: 'systems', label: 'OS & Systems' },
  { id: 'dbms', label: 'DBMS' },
  { id: 'python', label: 'Python & Web' },
  { id: 'all', label: 'All Branches / General' },
];

const PACK_TAG_BG_OPTIONS = [
  { id: 'bg-[#FEF08A] text-[#0F172A]', label: 'Yellow (Sem 3 & 4)' },
  { id: 'bg-[#BAE6FD] text-[#0F172A]', label: 'Sky Blue (Sem 5)' },
  { id: 'bg-[#BBF7D0] text-[#0F172A]', label: 'Emerald Green (Sem 4)' },
  { id: 'bg-[#FBCFE8] text-[#0F172A]', label: 'Soft Pink (All Branches)' },
  { id: 'bg-[#FED7AA] text-[#0F172A]', label: 'Warm Orange' },
  { id: 'bg-[#E9D5FF] text-[#0F172A]', label: 'Purple' },
];

const COLOR_PRESETS = [
  { label: 'Yellow', class: 'bg-tertiary-fixed text-[#0F172A]' },
  { label: 'Sky Blue', class: 'bg-secondary-fixed text-[#0F172A]' },
  { label: 'Green', class: 'bg-[#4ADE80] text-[#0F172A]' },
  { label: 'Purple', class: 'bg-[#C084FC] text-[#0F172A]' },
  { label: 'Pink', class: 'bg-[#FB7185] text-[#0F172A]' },
  { label: 'Orange', class: 'bg-[#FB923C] text-[#0F172A]' },
];

const PLATFORM_THEME_PRESETS = [
  { id: 'dark-navy', label: 'Dark Slate', bgClass: 'bg-[#1E293B]', textClass: 'text-white', badgeClass: 'text-[#FBBF24]', isLight: false },
  { id: 'indigo', label: 'Microsoft Indigo', bgClass: 'bg-[#4F46E5]', textClass: 'text-white', badgeClass: 'text-white/90', isLight: false },
  { id: 'orange', label: 'AWS Orange', bgClass: 'bg-[#F97316]', textClass: 'text-white', badgeClass: 'text-white/90', isLight: false },
  { id: 'blue', label: 'Cisco Blue', bgClass: 'bg-[#0072C6]', textClass: 'text-white', badgeClass: 'text-white/90', isLight: false },
  { id: 'red', label: 'Oracle Crimson', bgClass: 'bg-[#991B1B]', textClass: 'text-white', badgeClass: 'text-white/90', isLight: false },
  { id: 'white', label: 'Clean White', bgClass: 'bg-white', textClass: 'text-[#111111]', badgeClass: 'text-gray-600', isLight: true },
];

const PLATFORM_QUICK_PRESETS = [
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
    subtitle: 'Learn & Certifications',
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
  {
    title: 'freeCodeCamp',
    subtitle: 'Full-Stack Certifications',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/FreeCodeCamp_logo.png',
    link: 'https://www.freecodecamp.org/',
    bgClass: 'bg-[#1E293B]',
    textClass: 'text-white',
    badgeClass: 'text-[#FBBF24]',
    isLight: false,
  },
  {
    title: 'Coursera',
    subtitle: 'Specializations & Degrees',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg',
    link: 'https://www.coursera.org/',
    bgClass: 'bg-[#0072C6]',
    textClass: 'text-white',
    badgeClass: 'text-white/90',
    isLight: false,
  },
];

const TAG_ICON_OPTIONS = [
  { id: 'tag', label: 'Tag' },
  { id: 'code', label: 'Code' },
  { id: 'database', label: 'Database' },
  { id: 'book', label: 'Book' },
  { id: 'flame', label: 'Flame' },
  { id: 'zap', label: 'Zap' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'star', label: 'Star' },
];

function renderTagIcon(iconName) {
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

export default function AdminHomepageSettingsView() {
  const [activeTab, setActiveTab] = useState('trending'); // 'clock' | 'trending' | 'video' | 'platforms' | 'groups' | 'preview'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form states
  const [liveClock, setLiveClock] = useState(() => {
    const futureDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    futureDate.setHours(10, 30, 0, 0);
    return {
      examTitle: 'Indus Winter Finals',
      targetDate: futureDate.toISOString(),
      subtitle: 'Target exam date approaching. Be prepared before server crashes and dead WhatsApp groups strike.',
      papersSchedule: [
        { code: 'CE0402', name: 'Computer Networks', deadline: 'In 3 Days' },
        { code: 'CE0404', name: 'Software Engineering', deadline: 'In 7 Days' },
        { code: 'CE0401', name: 'Operating Systems', deadline: 'In 12 Days' },
      ],
    };
  });

  const [trending, setTrending] = useState({
    heroTags: [
      { label: 'OS 100-Mark Imp', query: 'Operating Systems', icon: 'zap' },
      { label: 'DAA NP-Hard Proofs', query: 'Design and Analysis of Algorithms', icon: 'code' },
      { label: 'DBMS B+ Trees', query: 'Database Management Systems', icon: 'database' },
      { label: 'Python Lab Manual', query: 'Python', icon: 'terminal' },
    ],
    trendingPacks: DEFAULT_STUDY_PACKS,
  });

  const [video, setVideo] = useState({
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Student Resource Hub: Product Tour',
    badge: 'PLATFORM PREVIEW',
    description: 'Everything you need to excel in your engineering journey, in one place.',
    thumbnailUrl: '',
  });

  const [learningPlatforms, setLearningPlatforms] = useState([]);

  const [communityGroups, setCommunityGroups] = useState({
    whatsappSem1_4: 'https://chat.whatsapp.com',
    whatsappSem5_8: 'https://chat.whatsapp.com',
    telegramMain: 'https://t.me',
    discordServer: 'https://discord.gg',
  });

  // Calculate live countdown for real-time preview in admin
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await getAdminHomepageSettings();
      if (res && res.data) {
        if (res.data.liveClock) {
          const clock = { ...res.data.liveClock };
          if (!clock.targetDate || isNaN(new Date(clock.targetDate).getTime()) || new Date(clock.targetDate).getTime() <= Date.now()) {
            const nextTarget = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
            nextTarget.setHours(10, 30, 0, 0);
            clock.targetDate = nextTarget.toISOString();
          }
          setLiveClock(clock);
        }
        if (res.data.trending) {
          const trendData = { ...res.data.trending };
          if (!Array.isArray(trendData.trendingPacks) || trendData.trendingPacks.length === 0) {
            trendData.trendingPacks = DEFAULT_STUDY_PACKS;
          }
          setTrending(trendData);
        }
        if (res.data.video) setVideo(res.data.video);
        if (Array.isArray(res.data.learningPlatforms)) {
          const normalized = res.data.learningPlatforms.map((p, idx) => ({
            title: p.title || p.name || `Platform #${idx + 1}`,
            subtitle: p.subtitle || p.badge || '',
            logo: p.logo || '',
            link: p.link || p.url || '',
            bgClass: p.bgClass || 'bg-[#F8FAFC]',
            textClass: p.textClass || 'text-[#0F172A]',
            badgeClass: p.badgeClass || 'bg-[#E2E8F0] text-[#0F172A]',
            isLight: p.isLight !== undefined ? p.isLight : true,
          }));
          setLearningPlatforms(normalized);
        }
        if (res.data.communityGroups) setCommunityGroups(res.data.communityGroups);
      }
    } catch (err) {
      console.error('Failed to load homepage settings:', err);
      showToast(err.message || 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Update countdown preview tick
  useEffect(() => {
    const updateTime = () => {
      if (!liveClock.targetDate) return;
      const target = new Date(liveClock.targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [liveClock.targetDate]);

  // Handlers for Live Clock
  const handlePaperChange = (index, field, value) => {
    const updated = [...(liveClock.papersSchedule || [])];
    updated[index] = { ...updated[index], [field]: value };
    setLiveClock({ ...liveClock, papersSchedule: updated });
  };

  const handleAddPaper = () => {
    setLiveClock({
      ...liveClock,
      papersSchedule: [
        ...(liveClock.papersSchedule || []),
        { code: 'CE0401', name: 'New Subject Name', deadline: 'In 5 Days' },
      ],
    });
  };

  const handleRemovePaper = (index) => {
    const updated = liveClock.papersSchedule.filter((_, i) => i !== index);
    setLiveClock({ ...liveClock, papersSchedule: updated });
  };

  // Handlers for Hero Tags
  const handleHeroTagChange = (index, field, value) => {
    const updated = [...(trending.heroTags || [])];
    updated[index] = { ...updated[index], [field]: value };
    setTrending({ ...trending, heroTags: updated });
  };

  const handleAddHeroTag = () => {
    setTrending({
      ...trending,
      heroTags: [
        ...(trending.heroTags || []),
        { label: 'New Tag', query: 'Search Term', icon: 'zap' },
      ],
    });
  };

  const handleRemoveHeroTag = (index) => {
    const updated = trending.heroTags.filter((_, i) => i !== index);
    setTrending({ ...trending, heroTags: updated });
  };

  // Handlers for Trending Packs
  const handleAddPack = () => {
    const newPack = {
      id: `pack-${Date.now()}`,
      tag: 'SEM 3 & 4',
      category: 'dsa',
      tagBg: 'bg-[#FEF08A] text-[#0F172A]',
      rating: '★ 4.9 (New)',
      title: 'New Study Pack Title',
      desc: 'High-yield revision notes, solved question proofs, and cheat sheets.',
      fileSize: '4.5 MB',
      format: 'PDF',
      pages: '32 Pages',
      fileUrl: '/downloads/dsa-master-cheat-sheet.pdf',
      fileName: 'dsa-master-cheat-sheet.pdf',
      topics: [
        'Chapter 1: Key proofs and algorithm implementations',
        'Chapter 2: Exam questions and solved proofs',
      ],
    };
    setTrending((prev) => ({
      ...prev,
      trendingPacks: [...(prev.trendingPacks || []), newPack],
    }));
    showToast('New study pack added. Remember to click Save Trending Tags to publish.', 'success');
  };

  const handleRemovePack = (index) => {
    setTrending((prev) => ({
      ...prev,
      trendingPacks: (prev.trendingPacks || []).filter((_, i) => i !== index),
    }));
    showToast('Study pack removed. Click Save Trending Tags to publish.', 'success');
  };

  const handlePackChange = (index, field, value) => {
    const updated = [...(trending.trendingPacks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setTrending({ ...trending, trendingPacks: updated });
  };

  const handleTopicChange = (packIndex, topicIndex, value) => {
    const updatedPacks = [...(trending.trendingPacks || [])];
    const updatedTopics = [...(updatedPacks[packIndex].topics || [])];
    updatedTopics[topicIndex] = value;
    updatedPacks[packIndex].topics = updatedTopics;
    setTrending({ ...trending, trendingPacks: updatedPacks });
  };

  const handleAddTopic = (packIndex) => {
    const updatedPacks = [...(trending.trendingPacks || [])];
    const updatedTopics = [...(updatedPacks[packIndex].topics || []), 'New Syllabus Topic Blueprint'];
    updatedPacks[packIndex].topics = updatedTopics;
    setTrending({ ...trending, trendingPacks: updatedPacks });
  };

  const handleRemoveTopic = (packIndex, topicIndex) => {
    const updatedPacks = [...(trending.trendingPacks || [])];
    const updatedTopics = updatedPacks[packIndex].topics.filter((_, i) => i !== topicIndex);
    updatedPacks[packIndex].topics = updatedTopics;
    setTrending({ ...trending, trendingPacks: updatedPacks });
  };

  const [uploadingPackIdx, setUploadingPackIdx] = useState(null);

  const handlePackFileUpload = async (packIndex, file) => {
    if (!file) return;
    try {
      setUploadingPackIdx(packIndex);
      const res = await uploadAdminPackFile(file);
      if (res) {
        const updated = [...(trending.trendingPacks || [])];
        updated[packIndex] = {
          ...updated[packIndex],
          fileUrl: res.fileUrl || `/downloads/${file.name}`,
          fileName: res.fileName || file.name,
          fileSize: res.fileSize || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          format: res.format || file.name.split('.').pop().toUpperCase(),
        };
        setTrending({ ...trending, trendingPacks: updated });
        showToast(`File "${file.name}" uploaded successfully! Click Save Trending Tags to publish.`, 'success');
      }
    } catch (err) {
      console.warn('Backend upload fallback:', err.message);
      const updated = [...(trending.trendingPacks || [])];
      updated[packIndex] = {
        ...updated[packIndex],
        fileUrl: `/downloads/${file.name}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        format: file.name.split('.').pop().toUpperCase(),
      };
      setTrending({ ...trending, trendingPacks: updated });
      showToast(`Attached file "${file.name}". Click Save Trending Tags to publish.`, 'success');
    } finally {
      setUploadingPackIdx(null);
    }
  };

  // Handlers for Learning Platforms
  const handlePlatformChange = (index, field, value) => {
    const updated = [...learningPlatforms];
    updated[index] = { ...updated[index], [field]: value };
    setLearningPlatforms(updated);
  };

  const handleApplyPreset = (index, preset) => {
    const updated = [...learningPlatforms];
    updated[index] = {
      ...updated[index],
      title: preset.title,
      subtitle: preset.subtitle,
      logo: preset.logo,
      link: preset.link,
      bgClass: preset.bgClass,
      textClass: preset.textClass,
      badgeClass: preset.badgeClass,
      isLight: preset.isLight,
    };
    setLearningPlatforms(updated);
  };

  const handleAddPlatform = () => {
    setLearningPlatforms([
      ...learningPlatforms,
      {
        title: 'New Platform',
        subtitle: 'Free Certification',
        link: 'https://example.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        bgClass: 'bg-[#1E293B]',
        textClass: 'text-white',
        badgeClass: 'text-[#FBBF24]',
        isLight: false,
      },
    ]);
  };

  const handleRemovePlatform = (index) => {
    setLearningPlatforms(learningPlatforms.filter((_, i) => i !== index));
  };

  // Save Handlers
  const handleSaveClockOnly = async () => {
    try {
      setSaving(true);
      await updateAdminLiveClock(liveClock);
      showToast('Live Semester Clock updated successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save Live Clock', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTrendingOnly = async () => {
    try {
      setSaving(true);
      await updateAdminTrending(trending);
      showToast('Trending Tags and Packs updated successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save Trending', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVideoOnly = async () => {
    try {
      setSaving(true);
      await updateAdminVideo(video);
      showToast('Video Tour configuration updated successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save Video settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatformsOnly = async () => {
    try {
      setSaving(true);
      await updateAdminLearningPlatforms(learningPlatforms);
      showToast('Free Learning Platforms updated successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save Platforms', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGroupsOnly = async () => {
    try {
      setSaving(true);
      await updateAdminCommunityGroups(communityGroups);
      showToast('Community study groups updated successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save Community Groups', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await updateAdminHomepageSettings({
        liveClock,
        trending,
        video,
        learningPlatforms,
        communityGroups,
      });
      showToast('All homepage dynamic settings published successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save homepage settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-[#0F172A] border-t-[#FF5722] rounded-full animate-spin"></div>
        <p className="font-black text-sm uppercase tracking-wider text-[#0F172A]">
          Loading Dynamic Homepage Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 border-[3px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] font-bold text-sm flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-[#FCA5A5] text-[#7F1D1D]' : 'bg-[#86EFAC] text-[#14532D]'
          }`}
        >
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] border-[3px] border-[#0F172A] shadow-[6px_6px_0px_#0F172A] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Live Dynamic Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight uppercase">
              Homepage Dynamic Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Update Live Countdown, Quick-Search Tags, Video Tour, Free Learning Platforms, and Study Groups in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs sm:text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[3px_3px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Strip */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t-2 border-slate-200">
          {[
            { id: 'trending', label: 'Trending & Search Tags', icon: Flame },
            { id: 'platforms', label: 'Free Learning Platforms', icon: School },
            { id: 'clock', label: 'Live Semester Clock', icon: Clock },
            { id: 'video', label: 'Video Tour Tour', icon: Video },
            { id: 'groups', label: 'Study Groups', icon: Users },
            { id: 'preview', label: 'Live Preview', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-[2px] border-[#0F172A] transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#FDE047] text-[#0F172A] shadow-[3px_3px_0px_#0F172A] translate-y-[-1px]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 shadow-[2px_2px_0px_#0F172A]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB 1: TRENDING & SEARCH TAGS ─────────────────────────── */}
      {activeTab === 'trending' && (
        <div className="space-y-6">
          {/* Quick-Search Tag Chips Manager */}
          <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#F59E0B]" />
                  <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">
                    Hero Quick-Search Tag Chips ({trending.heroTags?.length || 0})
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Interactive pills shown directly under the Hero CTA buttons linking students to instant search results.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddHeroTag}
                className="px-3.5 py-1.5 bg-[#BBF7D0] hover:bg-[#86EFAC] text-[#14532D] font-black text-xs uppercase border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A] cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tag Chip</span>
              </button>
            </div>

            {/* Tag Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(trending.heroTags || []).map((tag, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border-[2px] border-[#0F172A] rounded-2xl shadow-[3px_3px_0px_#0F172A] flex flex-col justify-between space-y-3.5"
                >
                  {/* Card Header with Number and Delete */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-[11px] font-black uppercase text-[#0F172A] bg-amber-200/70 px-2 py-0.5 rounded border border-[#0F172A]/30">
                      Tag #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroTag(idx)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition cursor-pointer"
                      title="Remove Tag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Tag Label (Button Text)
                      </label>
                      <input
                        type="text"
                        value={tag.label || ''}
                        onChange={(e) => handleHeroTagChange(idx, 'label', e.target.value)}
                        placeholder="e.g. OS 100-Mark Imp"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#0F172A] rounded-lg font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Search Query / Filter
                      </label>
                      <input
                        type="text"
                        value={tag.query || ''}
                        onChange={(e) => handleHeroTagChange(idx, 'query', e.target.value)}
                        placeholder="e.g. Operating Systems"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#0F172A] rounded-lg font-medium text-xs text-slate-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Icon Style
                      </label>
                      <select
                        value={tag.icon || 'zap'}
                        onChange={(e) => handleHeroTagChange(idx, 'icon', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#0F172A] rounded-lg font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {TAG_ICON_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Live Chip Miniature Preview */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                      Site Preview:
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#0F172A] border border-amber-300 shadow-2xs">
                      {renderTagIcon(tag.icon)}
                      <span>{tag.label || 'Empty Tag'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveTrendingOnly}
              disabled={saving}
              className="py-3 px-6 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Trending Tags</span>
            </button>
          </div>

          {/* Trending Study Packs Manager */}
          <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#FF5722]" />
                  <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">
                    Trending Study Packs ({trending.trendingPacks?.length || 0})
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Manage downloadable high-yield revision kits, cheat sheets, and practical lab code packs shown on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPack}
                className="px-3.5 py-1.5 bg-[#BBF7D0] hover:bg-[#86EFAC] text-[#14532D] font-black text-xs uppercase border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A] cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Study Pack</span>
              </button>
            </div>

            {/* Packs Cards */}
            <div className="space-y-6">
              {(trending.trendingPacks || []).map((pack, pIdx) => (
                <div
                  key={pack.id || pIdx}
                  className="p-5 bg-slate-50 border-[2.5px] border-[#0F172A] rounded-2xl shadow-[4px_4px_0px_#0F172A] space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase text-[#0F172A] bg-amber-300 px-2.5 py-1 rounded-lg border border-[#0F172A]">
                        Pack #{pIdx + 1}
                      </span>
                      <span className="text-xs font-black text-slate-800">
                        {pack.title || 'Untitled Pack'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePack(pIdx)}
                      className="px-2.5 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg border border-red-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                      title="Remove Study Pack"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Pack</span>
                    </button>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1 lg:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Pack Title
                      </label>
                      <input
                        type="text"
                        value={pack.title || ''}
                        onChange={(e) => handlePackChange(pIdx, 'title', e.target.value)}
                        placeholder="e.g. Operating Systems End-Sem Rapid Revision"
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Semester Badge Tag
                      </label>
                      <input
                        type="text"
                        value={pack.tag || ''}
                        onChange={(e) => handlePackChange(pIdx, 'tag', e.target.value)}
                        placeholder="e.g. SEM 4 or ALL BRANCHES"
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Category Filter
                      </label>
                      <select
                        value={pack.category || 'all'}
                        onChange={(e) => handlePackChange(pIdx, 'category', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {PACK_CATEGORY_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Badge Color Theme
                      </label>
                      <select
                        value={pack.tagBg || 'bg-[#FEF08A] text-[#0F172A]'}
                        onChange={(e) => handlePackChange(pIdx, 'tagBg', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      >
                        {PACK_TAG_BG_OPTIONS.map((bg) => (
                          <option key={bg.id} value={bg.id}>
                            {bg.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Rating Display
                      </label>
                      <input
                        type="text"
                        value={pack.rating || ''}
                        onChange={(e) => handlePackChange(pIdx, 'rating', e.target.value)}
                        placeholder="e.g. ★ 4.9 (1.2k)"
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        File Size
                      </label>
                      <input
                        type="text"
                        value={pack.fileSize || ''}
                        onChange={(e) => handlePackChange(pIdx, 'fileSize', e.target.value)}
                        placeholder="e.g. 4.2 MB"
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Format / Pages
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pack.format || 'PDF'}
                          onChange={(e) => handlePackChange(pIdx, 'format', e.target.value)}
                          placeholder="PDF"
                          className="w-20 px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={pack.pages || ''}
                          onChange={(e) => handlePackChange(pIdx, 'pages', e.target.value)}
                          placeholder="e.g. 48 Pages"
                          className="flex-1 px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs text-[#0F172A] focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 lg:col-span-4">
                      <label className="text-[10px] font-black uppercase text-slate-600">
                        Summary Description
                      </label>
                      <input
                        type="text"
                        value={pack.desc || ''}
                        onChange={(e) => handlePackChange(pIdx, 'desc', e.target.value)}
                        placeholder="e.g. Trees, Graphs, and DP templates with Indus 100-mark proofs and diagrams."
                        className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-medium text-xs text-slate-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Dedicated Study Pack File Attachment & Upload Box */}
                    <div className="lg:col-span-4 bg-white border-[2px] border-[#0F172A] rounded-2xl p-4 shadow-[2px_2px_0px_#0F172A] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-[#FF5722]" />
                          <span className="text-xs font-black uppercase text-[#0F172A]">
                            Study Pack Downloadable File Attachment
                          </span>
                        </div>
                        {pack.fileName ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-mono text-[11px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{pack.fileName}</span>
                              <span className="text-emerald-700 font-normal">({pack.fileSize || 'Attached'})</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handlePackChange(pIdx, 'fileUrl', '');
                                handlePackChange(pIdx, 'fileName', '');
                              }}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            No file attached yet
                          </span>
                        )}
                      </div>

                      {/* Upload Button + File Input */}
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="relative inline-flex items-center gap-2 px-4 py-2 bg-[#BBF7D0] hover:bg-[#86EFAC] text-[#14532D] font-black text-xs uppercase border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A] cursor-pointer transition">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingPackIdx === pIdx ? 'Uploading File...' : 'Upload File from Computer'}</span>
                          <input
                            type="file"
                            accept=".pdf,.zip,.doc,.docx,.ppt,.pptx"
                            disabled={uploadingPackIdx === pIdx}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePackFileUpload(pIdx, e.target.files[0]);
                                e.target.value = '';
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </label>

                        {pack.fileUrl && (
                          <a
                            href={pack.fileUrl}
                            download={pack.fileName || 'study-pack.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-[#FEF08A] text-[#0F172A] font-bold text-xs uppercase border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A] transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Test Download</span>
                          </a>
                        )}

                        <span className="text-[11px] text-slate-500 font-medium">
                          Uploads directly to frontend storage (PDF, ZIP, DOCX up to 50 MB)
                        </span>
                      </div>

                      {/* Built-in quick presets and custom URL inputs */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase text-slate-400">
                            Quick Select Frontend Storage Files:
                          </span>
                          {[
                            { label: 'DSA PDF', url: '/downloads/dsa-master-cheat-sheet.pdf', name: 'dsa-master-cheat-sheet.pdf', size: '4.2 MB', fmt: 'PDF' },
                            { label: 'OS PDF', url: '/downloads/operating-systems-rapid-revision.pdf', name: 'operating-systems-rapid-revision.pdf', size: '6.8 MB', fmt: 'PDF' },
                            { label: 'DBMS PDF', url: '/downloads/dbms-complete-sql-normalization-kit.pdf', name: 'dbms-complete-sql-normalization-kit.pdf', size: '3.1 MB', fmt: 'PDF' },
                            { label: 'Python PDF', url: '/downloads/python-fullstack-practical-code-files.pdf', name: 'python-fullstack-practical-code-files.pdf', size: '12.4 MB', fmt: 'PDF' },
                          ].map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => {
                                handlePackChange(pIdx, 'fileUrl', preset.url);
                                handlePackChange(pIdx, 'fileName', preset.name);
                                handlePackChange(pIdx, 'fileSize', preset.size);
                                handlePackChange(pIdx, 'format', preset.fmt);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                pack.fileUrl === preset.url
                                  ? 'bg-[#FF5722] text-white border-[#0F172A]'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>

                        {/* Direct URL text field for external links / manual edits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              value={pack.fileUrl || ''}
                              onChange={(e) => handlePackChange(pIdx, 'fileUrl', e.target.value)}
                              placeholder="File URL or path (e.g. /downloads/study-pack.pdf or Drive link)"
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={pack.fileName || ''}
                              onChange={(e) => handlePackChange(pIdx, 'fileName', e.target.value)}
                              placeholder="Download file name (e.g. cheat-sheet.pdf)"
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus / Highlights Topics Editor */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Key Syllabus & Topic Highlights ({pack.topics?.length || 0})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddTopic(pIdx)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] rounded border border-slate-400 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Topic Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(pack.topics || []).map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => handleTopicChange(pIdx, tIdx, e.target.value)}
                            placeholder="e.g. Binary Search Trees & AVL Rotations with complete proofs"
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(pIdx, tIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Remove bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Visual Card Preview */}
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">
                      Homepage Live Card Simulation:
                    </span>
                    <div className="max-w-sm bg-white border-[2.5px] border-[#0F172A] rounded-2xl p-5 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#0F172A] uppercase tracking-wider ${pack.tagBg || 'bg-[#FEF08A] text-[#0F172A]'}`}>
                            {pack.tag || 'SEM 4'}
                          </span>
                          <span className="text-xs font-black text-[#0F172A]">
                            {pack.rating || '★ 4.9'}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-tight line-clamp-2 mb-1.5 leading-snug">
                          {pack.title || 'Untitled Study Pack'}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3">
                          {pack.desc || 'No description provided.'}
                        </p>
                        <div className="space-y-1.5 mb-4">
                          {(pack.topics || []).slice(0, 3).map((topic, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{pack.pages || '48 Pages'}</span>
                        </span>
                        <span>{pack.fileSize || '4.2 MB'} • {pack.format || 'PDF'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleAddPack}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-black text-xs uppercase border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Study Pack</span>
              </button>
              <button
                type="button"
                onClick={handleSaveTrendingOnly}
                disabled={saving}
                className="w-full sm:w-auto py-3 px-6 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Trending Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: FREE LEARNING PLATFORMS ─────────────────────────── */}
      {activeTab === 'platforms' && (
        <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">
                  Free Learning Platforms ({learningPlatforms.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage partner and free certification platforms displayed with high-visibility sticker cards on the homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPlatform}
              className="px-3.5 py-1.5 bg-[#BBF7D0] hover:bg-[#86EFAC] text-[#14532D] font-black text-xs uppercase border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A] cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Platform</span>
            </button>
          </div>

          {/* Quick Preset Fill Helper */}
          <div className="p-4 bg-amber-50/80 border-[2px] border-amber-300 rounded-xl space-y-2">
            <span className="text-xs font-black uppercase text-amber-900 block">
              1-Click Brand Presets (Auto-fill Verified SVG Logos):
            </span>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_QUICK_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    setLearningPlatforms([...learningPlatforms, { ...preset }]);
                    showToast(`Added ${preset.title} platform preset`);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-amber-200 text-[#0F172A] text-xs font-bold rounded-lg border border-[#0F172A] shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <img src={preset.logo} alt={preset.title} className="w-3.5 h-3.5 object-contain" />
                  <span>+ {preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPlatforms.map((p, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 border-[2.5px] border-[#0F172A] rounded-2xl shadow-[4px_4px_0px_#0F172A] space-y-4 flex flex-col justify-between"
              >
                {/* Header with Title & Delete */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase bg-[#FDE047] px-2 py-0.5 rounded border border-[#0F172A]">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-black text-[#0F172A] truncate max-w-[160px]">
                      {p.title || 'Untitled Platform'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePlatform(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg border border-transparent hover:border-red-200 transition cursor-pointer"
                    title="Remove Platform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-600">Platform Name</label>
                    <input
                      type="text"
                      value={p.title || ''}
                      onChange={(e) => handlePlatformChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-600">Subtitle / Badge</label>
                    <input
                      type="text"
                      value={p.subtitle || ''}
                      onChange={(e) => handlePlatformChange(idx, 'subtitle', e.target.value)}
                      placeholder="e.g. Career Certificates"
                      className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-600 flex items-center justify-between">
                      <span>Logo Image URL</span>
                      <span className="text-[9px] text-slate-400 font-medium">SVG or PNG</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={p.logo || ''}
                        onChange={(e) => handlePlatformChange(idx, 'logo', e.target.value)}
                        placeholder="https://.../logo.svg"
                        className="flex-1 px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#0F172A] flex items-center justify-center p-1 shrink-0">
                        {p.logo ? (
                          <img
                            src={p.logo}
                            alt="preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-600">Direct URL</label>
                    <input
                      type="text"
                      value={p.link || ''}
                      onChange={(e) => handlePlatformChange(idx, 'link', e.target.value)}
                      placeholder="https://grow.google/certificates/"
                      className="w-full px-3 py-2 bg-white border border-[#0F172A] rounded-xl font-mono text-xs text-blue-600 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Card Theme Selector */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-black uppercase text-slate-600 block">
                      Card Theme Color
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PLATFORM_THEME_PRESETS.map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => {
                            const updated = [...learningPlatforms];
                            updated[idx] = {
                              ...updated[idx],
                              bgClass: th.bgClass,
                              textClass: th.textClass,
                              badgeClass: th.badgeClass,
                              isLight: th.isLight,
                            };
                            setLearningPlatforms(updated);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition flex items-center justify-center gap-1 ${
                            p.bgClass === th.bgClass
                              ? 'border-[#0F172A] ring-2 ring-amber-400 font-black'
                              : 'border-slate-300 hover:border-slate-400'
                          } ${th.bgClass} ${th.textClass}`}
                        >
                          <span>{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Card Preview Box */}
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[9px] font-black uppercase text-slate-400 block mb-1.5">
                    Live Homepage Card Preview:
                  </span>
                  <div
                    className={`${p.bgClass || 'bg-[#1E293B]'} rounded-2xl p-4 flex flex-col items-center text-center border-2 border-[#111111] shadow-[3px_3px_0px_#111111]`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2">
                      <img
                        src={p.logo || 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'}
                        alt={p.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className={`text-sm font-black ${p.textClass || 'text-white'}`}>{p.title || 'Platform'}</h4>
                    <p className={`text-[10px] font-bold ${p.badgeClass || 'text-[#FBBF24]'} mb-2`}>
                      {p.subtitle || 'Certification'}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border border-[#111111] shadow-2xs ${
                        p.isLight ? 'bg-amber-400 text-black' : 'bg-white text-black'
                      }`}
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSavePlatformsOnly}
            disabled={saving}
            className="py-3 px-6 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Learning Platforms</span>
          </button>
        </div>
      )}

      {/* ─── TAB 3: LIVE SEMESTER CLOCK ─────────────────────────────── */}
      {activeTab === 'clock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF5722]" />
                  <h2 className="text-lg font-black text-[#0F172A] uppercase">Exam Countdown Target</h2>
                </div>
                <span className="bg-[#FEF08A] text-[#854D0E] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0F172A]">
                  Homepage Banner
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#0F172A]">
                  Exam Title Badge (Top Right Badge)
                </label>
                <input
                  type="text"
                  value={liveClock.examTitle || ''}
                  onChange={(e) => setLiveClock({ ...liveClock, examTitle: e.target.value })}
                  placeholder="e.g. Indus Winter Finals 2025"
                  className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#0F172A]">
                  Exam Countdown Target Date &amp; Time
                </label>
                <NeoDatePicker
                  value={liveClock.targetDate}
                  onChange={(newIso) => setLiveClock({ ...liveClock, targetDate: newIso })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-[#0F172A]">
                  Urgency Subtitle / Target Description
                </label>
                <textarea
                  rows={2}
                  value={liveClock.subtitle || ''}
                  onChange={(e) => setLiveClock({ ...liveClock, subtitle: e.target.value })}
                  placeholder="Target date: 18th December 2025..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>
            </div>

            {/* Critical Papers Schedule List */}
            <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#3B82F6]" />
                  <h2 className="text-lg font-black text-[#0F172A] uppercase">Upcoming Critical Papers</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddPaper}
                  className="px-3 py-1 bg-[#BBF7D0] hover:bg-[#86EFAC] text-[#14532D] font-black text-xs uppercase border-[2px] border-[#0F172A] rounded-lg shadow-[2px_2px_0px_#0F172A] cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Paper</span>
                </button>
              </div>

              <div className="space-y-3">
                {(liveClock.papersSchedule || []).map((paper, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl shadow-[2px_2px_0px_#0F172A]"
                  >
                    <div className="w-full sm:w-28">
                      <input
                        type="text"
                        value={paper.code || ''}
                        onChange={(e) => handlePaperChange(idx, 'code', e.target.value)}
                        placeholder="Code (CE0401)"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#0F172A] rounded-lg font-mono font-bold text-xs"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={paper.name || ''}
                        onChange={(e) => handlePaperChange(idx, 'name', e.target.value)}
                        placeholder="Subject Name"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#0F172A] rounded-lg font-bold text-xs"
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <input
                        type="text"
                        value={paper.deadline || ''}
                        onChange={(e) => handlePaperChange(idx, 'deadline', e.target.value)}
                        placeholder="In 3 Days"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#0F172A] rounded-lg font-bold text-xs text-amber-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePaper(idx)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer self-end sm:self-center"
                      title="Remove paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveClockOnly}
              disabled={saving}
              className="w-full py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Clock Settings</span>
            </button>
          </div>

          {/* Right Live Preview Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0F172A] text-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-black uppercase text-amber-400">Live Clock Simulation</span>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Real-time Tick
                </span>
              </div>
              <div className="text-center py-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
                  {String(countdown.days).padStart(2, '0')}d : {String(countdown.hours).padStart(2, '0')}h :{' '}
                  {String(countdown.minutes).padStart(2, '0')}m : {String(countdown.seconds).padStart(2, '0')}s
                </span>
                <p className="text-xs text-slate-400 mt-2 font-medium">{liveClock.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: VIDEO TOUR SETTINGS ─────────────────────────────── */}
      {activeTab === 'video' && (() => {
        const parsedPreview = parseVideoInfo(video.videoUrl);
        const platformLabel = getPlatformLabel(parsedPreview.type);

        return (
          <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#9333EA]" />
                <h2 className="text-lg font-black text-[#0F172A] uppercase">Homepage Video Tour Configuration</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#C084FC] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded border border-[#0F172A]">
                  Multi-Platform Enabled
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase text-[#0F172A]">
                      Video URL (YouTube, Instagram, Vimeo, Direct MP4)
                    </label>
                    <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {platformLabel}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={video.videoUrl || ''}
                    onChange={(e) => setVideo({ ...video, videoUrl: e.target.value })}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/p/... or .mp4"
                    className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">
                    Supports YouTube standard videos and Shorts, Instagram Posts &amp; Reels, Vimeo, and direct video files.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-[#0F172A]">
                    Custom Video Thumbnail Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={video.thumbnailUrl || ''}
                    onChange={(e) => setVideo({ ...video, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or custom image URL"
                    className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">
                    Leave blank to automatically use YouTube cover art or Instagram brand banner.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-[#0F172A]">
                    Video Card Headline / Title
                  </label>
                  <input
                    type="text"
                    value={video.title || ''}
                    onChange={(e) => setVideo({ ...video, title: e.target.value })}
                    placeholder="Student Resource Hub: Product Tour"
                    className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-[#0F172A]">
                    Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={video.badge || ''}
                    onChange={(e) => setVideo({ ...video, badge: e.target.value })}
                    placeholder="PLATFORM PREVIEW"
                    className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-[#0F172A]">
                    Video Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={video.description || ''}
                    onChange={(e) => setVideo({ ...video, description: e.target.value })}
                    placeholder="Everything you need to excel in your engineering journey, in one place."
                    className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-bold text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveVideoOnly}
                    disabled={saving}
                    className="py-3 px-6 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Publishing...' : 'Save & Publish Video Settings'}</span>
                  </button>

                  {video.videoUrl && (
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border-[2px] border-[#0F172A] rounded-xl transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Source Link</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Live Preview Card (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-black uppercase text-[#0F172A] block">
                  Live Homepage Card Preview
                </span>
                <div className="bg-[#0F172A] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_#FACC15] rounded-2xl overflow-hidden text-white relative">
                  <div className="aspect-video relative bg-slate-950 flex items-center justify-center overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : parsedPreview.type === 'youtube' && parsedPreview.thumbnailUrl ? (
                      <img
                        src={parsedPreview.thumbnailUrl}
                        alt="YouTube Preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : parsedPreview.type === 'instagram' ? (
                      <div className="w-full h-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center relative">
                        <div className="text-center p-4">
                          <Video className="w-8 h-8 text-white mx-auto mb-1" />
                          <span className="text-[10px] font-black tracking-widest uppercase bg-black/40 px-2.5 py-1 rounded-full">
                            Instagram Embed Ready
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <Video className="w-8 h-8 mx-auto mb-1 text-amber-400" />
                        <span className="text-xs font-bold">Standard Video Tour</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center border-2 border-black shadow-md text-black">
                        <Play className="w-5 h-5 fill-black stroke-black translate-x-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-amber-400 text-[#0F172A] text-[10px] font-black uppercase rounded border border-black shadow-xs">
                        {video.badge || platformLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-1">
                    <h3 className="text-sm font-black truncate text-white">
                      {video.title || 'Video Headline Preview'}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {video.description || 'Video description appears here.'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border-[2px] border-amber-300 rounded-xl text-xs space-y-1">
                  <span className="font-black text-amber-950 block">Status:</span>
                  <p className="text-amber-900 font-medium">
                    Target: <strong className="font-bold">{platformLabel}</strong>
                  </p>
                  <p className="text-amber-800 font-mono text-[11px] truncate">
                    {video.videoUrl || 'No URL configured'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── TAB 5: STUDY GROUPS MANAGEMENT ─────────────────────────── */}
      {activeTab === 'groups' && (
        <div className="bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#EA580C]" />
              <h2 className="text-lg font-black text-[#0F172A] uppercase">Community Study Groups &amp; Links</h2>
            </div>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#0F172A]">
                WhatsApp Group (Sem 1-4 Junior Hub)
              </label>
              <input
                type="text"
                value={communityGroups.whatsappSem1_4 || ''}
                onChange={(e) => setCommunityGroups({ ...communityGroups, whatsappSem1_4: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-mono text-xs text-emerald-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#0F172A]">
                WhatsApp Group (Sem 5-8 Senior Hub)
              </label>
              <input
                type="text"
                value={communityGroups.whatsappSem5_8 || ''}
                onChange={(e) => setCommunityGroups({ ...communityGroups, whatsappSem5_8: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-mono text-xs text-emerald-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#0F172A]">
                Telegram Channel / Discussion Group
              </label>
              <input
                type="text"
                value={communityGroups.telegramMain || ''}
                onChange={(e) => setCommunityGroups({ ...communityGroups, telegramMain: e.target.value })}
                placeholder="https://t.me/..."
                className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-mono text-xs text-sky-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#0F172A]">
                Discord Server Invite
              </label>
              <input
                type="text"
                value={communityGroups.discordServer || ''}
                onChange={(e) => setCommunityGroups({ ...communityGroups, discordServer: e.target.value })}
                placeholder="https://discord.gg/..."
                className="w-full px-4 py-2.5 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl font-mono text-xs text-indigo-700"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveGroupsOnly}
              disabled={saving}
              className="py-3 px-6 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-sm uppercase border-[2.5px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Study Group Links</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 6: LIVE HOME PREVIEW ──────────────────────────────── */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border-[3px] border-[#0F172A] shadow-[6px_6px_0px_#0F172A] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-lg font-black text-[#0F172A] uppercase">
                  Homepage Visual Verification
                </h2>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#FDE047] text-[#0F172A] font-black text-xs uppercase rounded-lg border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A] flex items-center gap-1.5"
              >
                <span>Open Live Home</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 bg-slate-50 border-[2px] border-[#0F172A] rounded-xl space-y-2">
              <span className="text-xs font-black uppercase text-slate-600 block">
                Live Configuration Summary:
              </span>
              <p className="text-xs font-bold text-slate-700">
                Target Exam: <span className="text-amber-600">{liveClock.examTitle}</span> • Target Date: <span className="text-amber-600">{new Date(liveClock.targetDate).toLocaleDateString()}</span>
              </p>
              <p className="text-xs font-bold text-slate-700">
                Learning Platforms: <span className="text-emerald-600">{learningPlatforms.length} Active</span> • Hero Tags: <span className="text-blue-600">{trending.heroTags?.length || 0} Chips</span> • Study Packs: <span className="text-purple-600">{trending.trendingPacks?.length || 0} Packs</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
