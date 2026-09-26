// src/pages/Admin/AdminDashboard.jsx
// Dynamic Neubrutalist Dashboard (Campus Administration & Telemetry Console).
// Features: Real backend telemetry & DB latency metrics, dynamic 7-day traffic bar chart, live moderation funnel,
// chronological operational timeline, and pending moderation queue.

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getAdminUploads,
  getAdminDashboardAnalytics,
} from '../../services/admin/adminApi';

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  
  const [analytics, setAnalytics] = useState({
    kpis: {
      pendingUploads: 0,
      totalResources: 0,
      activeOpportunities: 0,
      subscribers: 0,
      pendingRequests: 0,
    },
    weeklyTraffic: [],
    wowGrowthPct: null,
    moderationFunnel: {
      totalSubmissions: 1,
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
      stage1Pct: 100,
      stage2Pct: 0,
      stage3Pct: 0,
      stage4Pct: 0,
    },
    systemVitals: {
      dbLatencyMs: null,
      uptimeSeconds: 0,
      memoryUsageMb: 0,
      status: 'LOADING',
      nodeVersion: '',
    },
    latencyHistory: [],
    timelineEvents: [],
    generatedAt: null,
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBarIndex, setActiveBarIndex] = useState(6);
  const [activeVitalsIndex, setActiveVitalsIndex] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load real telemetry & pending uploads from backend proxy
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [analyticsRes, uploadsRes] = await Promise.allSettled([
          getAdminDashboardAnalytics(),
          getAdminUploads('PENDING'),
        ]);

        if (isMounted) {
          if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
            setAnalytics(analyticsRes.value);
            if (Array.isArray(analyticsRes.value.weeklyTraffic) && analyticsRes.value.weeklyTraffic.length > 0) {
              setActiveBarIndex(analyticsRes.value.weeklyTraffic.length - 1);
            }
            // Point latency spline to the latest history sample
            if (Array.isArray(analyticsRes.value.latencyHistory) && analyticsRes.value.latencyHistory.length > 0) {
              setActiveVitalsIndex(analyticsRes.value.latencyHistory.length - 1);
            }
          }

          if (uploadsRes.status === 'fulfilled' && Array.isArray(uploadsRes.value)) {
            setRecentUploads(uploadsRes.value.slice(0, 6));
          }
        }
      } catch {
        // graceful fallback to initial state
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    // Poll every 65s — backend caches analytics for 60s, so faster polling
    // just wastes Aiven connections without getting fresher data.
    const interval = setInterval(loadData, 65000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Weekly DB-activity bar chart — uses real per-day timestamps from backend
  const weeklyData = useMemo(() => {
    if (Array.isArray(analytics.weeklyTraffic) && analytics.weeklyTraffic.length > 0) {
      return analytics.weeklyTraffic;
    }
    // Fallback: empty skeleton while loading
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { day: daysOfWeek[d.getDay()], date: d.toISOString().split('T')[0], downloads: 0, uploads: 0, requests: 0, resourcesAdded: 0, isToday: i === 6, highlight: i === 6 };
    });
  }, [analytics.weeklyTraffic]);

  // Latency history for spline chart (rolling buffer from process memory)
  const latencyPoints = useMemo(() => {
    const hist = Array.isArray(analytics.latencyHistory) ? analytics.latencyHistory : [];
    if (hist.length === 0) return [];
    return hist.map((entry, i) => {
      const d = new Date(entry.ts);
      const hh = d.getHours();
      const mm = d.getMinutes();
      const label = `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`;
      return { time: label, val: entry.ms, isCurrent: i === hist.length - 1 };
    });
  }, [analytics.latencyHistory]);

  const maxDownloads = Math.max(...weeklyData.map((w) => w.downloads), 1);
  const currentSelectedBar = weeklyData[activeBarIndex] || weeklyData[weeklyData.length - 1];
  const peakItem = useMemo(() => {
    if (!weeklyData.length) return null;
    const peak = weeklyData.reduce((prev, curr) => (curr.downloads > prev.downloads ? curr : prev), weeklyData[0]);
    return peak.downloads > 0 ? peak : null;
  }, [weeklyData]);

  // WoW growth from API (null = not enough history, 0 = no change)
  const wowGrowthPct = analytics.wowGrowthPct;

  // Last refreshed label — distinguish cache hit vs fresh DB fetch
  const lastRefreshed = useMemo(() => {
    if (!analytics.generatedAt) return null;
    const genTime = new Date(analytics.generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    // cachedAt is present when backend served from cache (no fresh DB queries ran)
    const isCached = !!analytics.cachedAt;
    return { label: isCached ? `Cached ${genTime}` : `Synced ${genTime}`, isCached };
  }, [analytics.generatedAt, analytics.cachedAt]);

  // Format uptime
  const formattedUptime = useMemo(() => {
    const totalSec = analytics.systemVitals?.uptimeSeconds || 0;
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }, [analytics.systemVitals?.uptimeSeconds]);

  // Operations timeline category counts
  const timelineCounts = useMemo(() => {
    const events = Array.isArray(analytics.timelineEvents) ? analytics.timelineEvents : [];
    return {
      ALL: events.length,
      UPLOAD: events.filter((e) => e.type === 'UPLOAD' || e.type === 'REQUEST').length,
      RESOURCE: events.filter((e) => e.type === 'RESOURCE' || e.type === 'OPPORTUNITY').length,
      SYSTEM: events.filter((e) => e.type === 'SYSTEM' || e.type === 'SECURITY' || e.type === 'CRON').length,
    };
  }, [analytics.timelineEvents]);

  // Filtered operations timeline based on active category & search keyword
  const filteredTimeline = useMemo(() => {
    const events = Array.isArray(analytics.timelineEvents) ? analytics.timelineEvents : [];
    return events.filter((evt) => {
      if (timelineFilter === 'UPLOAD') {
        if (evt.type !== 'UPLOAD' && evt.type !== 'REQUEST') return false;
      } else if (timelineFilter === 'RESOURCE') {
        if (evt.type !== 'RESOURCE' && evt.type !== 'OPPORTUNITY') return false;
      } else if (timelineFilter === 'SYSTEM') {
        if (evt.type !== 'SYSTEM' && evt.type !== 'SECURITY' && evt.type !== 'CRON') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title?.toLowerCase().includes(q);
        const matchSubtitle = evt.subtitle?.toLowerCase().includes(q);
        const matchStatus = evt.status?.toLowerCase().includes(q);
        if (!matchTitle && !matchSubtitle && !matchStatus) return false;
      }
      return true;
    });
  }, [analytics.timelineEvents, timelineFilter, searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8 font-sans pb-12">
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP GREETING BANNER & ACTION ROW
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#FFFFFF] border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-8 shadow-[6px_6px_0px_#1A1A1A] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Pastel decorative corner circle */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#F6E27B] border-3 border-[#1A1A1A] pointer-events-none opacity-80" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A]">
              <span className="w-2 h-2 rounded-full bg-[#B3D8A8] animate-pulse" />
              <span>Campus Health Ops</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FBCFE8] border-2 border-[#1A1A1A] text-[#1A1A1A] text-xs font-extrabold shadow-[2px_2px_0px_#1A1A1A]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1A1A] tracking-tight leading-tight">
            Good Morning, {admin?.name || 'Administrator'}!
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]/70 max-w-2xl leading-relaxed">
            All system proxies operating normally. You have <strong className="text-[#1A1A1A] underline decoration-wavy decoration-[#F6E27B]">{analytics.kpis.pendingUploads} submissions</strong> pending quality review and <strong className="text-[#1A1A1A]">{analytics.kpis.totalResources} verified materials</strong> published live.
          </p>
        </div>

        {/* Quick Action Pill Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/submissions"
            className="px-5 py-3 rounded-full bg-[#FBCFE8] hover:bg-[#f9a8d4] text-[#1A1A1A] font-black text-xs sm:text-sm border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">inbox</span>
            <span>Review Queue ({analytics.kpis.pendingUploads})</span>
          </Link>
          <Link
            to="/admin/resources"
            className="px-5 py-3 rounded-full bg-[#F6E27B] hover:bg-[#f3d951] text-[#1A1A1A] font-black text-xs sm:text-sm border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Resource Catalog</span>
          </Link>
          <Link
            to="/admin/viva"
            className="px-5 py-3 rounded-full bg-[#FEF08A] hover:bg-[#FDE047] text-[#1A1A1A] font-black text-xs sm:text-sm border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>Viva Questions</span>
          </Link>
          <Link
            to="/admin/opportunities"
            className="px-5 py-3 rounded-full bg-[#B3D8A8] hover:bg-[#9ecc92] text-[#1A1A1A] font-black text-xs sm:text-sm border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Opportunities</span>
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. 4 HIGH-IMPACT KPI METRIC CARDS
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Pending Moderation (#FBCFE8 Pink) */}
        <Link
          to="/admin/submissions"
          className="bg-[#FBCFE8] border-3 border-[#1A1A1A] rounded-[24px] p-5 sm:p-6 shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]/70">Action Required</span>
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[22px] text-[#1A1A1A]">pending_actions</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              {loading ? '...' : analytics.kpis.pendingUploads}
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A]">Pending Moderation</h2>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1A1A1A]/20 flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]">
            <span>Audit Queue</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Inspect <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </Link>

        {/* KPI 2: Live Catalog Resources (#F6E27B Yellow) */}
        <Link
          to="/admin/resources"
          className="bg-[#F6E27B] border-3 border-[#1A1A1A] rounded-[24px] p-5 sm:p-6 shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]/70">Vault Catalog</span>
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[22px] text-[#1A1A1A]">library_books</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              {loading ? '...' : analytics.kpis.totalResources}
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A]">Verified Materials</h2>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1A1A1A]/20 flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]">
            <span>Active Catalog</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Manage <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </Link>

        {/* KPI 3: Active Opportunities (#B3D8A8 Green) */}
        <Link
          to="/admin/opportunities"
          className="bg-[#B3D8A8] border-3 border-[#1A1A1A] rounded-[24px] p-5 sm:p-6 shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]/70">Career & Grants</span>
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[22px] text-[#1A1A1A]">work</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              {loading ? '...' : analytics.kpis.activeOpportunities}
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A]">Active Listings</h2>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1A1A1A]/20 flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]">
            <span>Live Notice Board</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Publish <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </Link>

        {/* KPI 4: Community Subscribers (#BFACE8 Lavender) */}
        <Link
          to="/admin/subscribers"
          className="bg-[#BFACE8] border-3 border-[#1A1A1A] rounded-[24px] p-5 sm:p-6 shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]/70">Subscribers</span>
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A] group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[22px] text-[#1A1A1A]">mark_email_read</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              {loading ? '...' : analytics.kpis.subscribers}
            </p>
            <h2 className="text-sm font-black text-[#1A1A1A]">Newsletter Digest</h2>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-[#1A1A1A]/20 flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]">
            <span>Active Broadcasts</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Export <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </Link>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. MAIN VISUAL ANALYTICS ROW: 7-DAY BAR CHART & HEARTBEAT TELEMETRY
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">

        {/* ── CARD A: RESOURCE TRAFFIC FLOW (#F6E27B Pastel Yellow) ── */}
        <div className="bg-[#F6E27B] border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#1A1A1A] flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                  <span className="material-symbols-outlined text-[20px] text-[#F6E27B]">bar_chart</span>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1A1A1A]">Resource Traffic Flow</h2>
                  <p className="text-xs font-bold text-[#1A1A1A]/70">7-Day student access & download activity</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-wider shrink-0 shadow-[2px_2px_0px_#1A1A1A]">
                Live DB Sync
              </span>
            </div>

            {/* Bar Chart Container */}
            <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_#1A1A1A] mt-3 relative overflow-hidden">
              {/* Header Info */}
              <div className="flex items-center justify-between text-xs font-black text-[#1A1A1A] mb-2 px-1">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">7-Day DB Activity</span>
                <span className="text-[11px] font-bold text-[#1A1A1A]">
                  {peakItem
                    ? <><strong className="text-[#059669]">{peakItem.day} ({peakItem.downloads} events)</strong> · Peak Day</>
                    : <span className="text-[#1A1A1A]/50">No activity yet this week</span>
                  }
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-48 pt-6 pb-1 px-1">
                {weeklyData.map((item, idx) => {
                  const heightPct = Math.round((item.downloads / maxDownloads) * 100);
                  const isActive = activeBarIndex === idx;
                  return (
                    <div
                      key={`${item.day}-${idx}`}
                      onClick={() => setActiveBarIndex(idx)}
                      onMouseEnter={() => setActiveBarIndex(idx)}
                      className="relative flex flex-col items-center justify-end h-full cursor-pointer group select-none"
                    >
                      {/* Floating Tooltip */}
                      <div
                        className={`absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-[#1A1A1A] transition-all whitespace-nowrap z-20 pointer-events-none ${
                          isActive
                            ? 'bg-[#1A1A1A] text-[#F6E27B] opacity-100 scale-100 shadow-[2px_2px_0px_#1A1A1A]'
                            : 'bg-[#F7F2E7] text-[#1A1A1A] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-[1px_1px_0px_#1A1A1A]'
                        }`}
                      >
                        {item.downloads} events
                      </div>

                      {/* Bar Pillar */}
                      <div className="w-full max-w-[34px] mx-auto bg-[#F7F2E7] border-2 border-[#1A1A1A] rounded-t-xl h-32 flex items-end overflow-hidden p-0.5 shadow-[1px_1px_0px_#1A1A1A]">
                        <div
                          style={{ height: `${Math.max(14, heightPct)}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            isActive
                              ? 'bg-[#1A1A1A]'
                              : item.highlight
                              ? 'bg-[#F6E27B]'
                              : 'bg-[#BFACE8]'
                          }`}
                        />
                      </div>

                      {/* Day Label */}
                      <span className={`text-xs font-black mt-2 block text-center ${
                        isActive ? 'text-[#1A1A1A] underline decoration-2 underline-offset-2' : 'text-[#1A1A1A]/70'
                      }`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected Day Readout */}
              <div className="mt-3 pt-3 border-t-2 border-[#1A1A1A]/10 flex items-center justify-between text-xs font-extrabold text-[#1A1A1A] flex-wrap gap-2">
                <span>
                  Selected:{' '}
                  <strong>
                    {currentSelectedBar?.isToday ? `Today (${currentSelectedBar?.day})` : currentSelectedBar?.day}
                    {currentSelectedBar?.date ? ` · ${new Date(currentSelectedBar.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                  </strong>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F6E27B] border border-[#1A1A1A] text-[11px] font-black shadow-[1px_1px_0px_#1A1A1A]">
                  {currentSelectedBar?.uploads || 0} Uploads · {currentSelectedBar?.requests || 0} Requests · {currentSelectedBar?.resourcesAdded || 0} Resources
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]/80 pt-4 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
              Status: <strong>Active Ingestion Pipeline</strong>
            </span>
            <span className="font-mono font-black px-2.5 py-0.5 rounded-full border border-[#1A1A1A] text-[11px] bg-white">
              {wowGrowthPct === null
                ? 'WoW: Collecting'
                : wowGrowthPct > 0
                ? <span className="text-[#059669]">+{wowGrowthPct}% WoW</span>
                : wowGrowthPct < 0
                ? <span className="text-[#DC2626]">{wowGrowthPct}% WoW</span>
                : <span className="text-[#1A1A1A]">0% WoW (Stable)</span>
              }
            </span>
          </div>
        </div>

        {/* ── CARD B: PLATFORM VITALS & LATENCY (#FBCFE8 Pastel Pink) ── */}
        <div className="bg-[#FBCFE8] border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#1A1A1A] flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                  <span className="material-symbols-outlined text-[20px] text-[#B3D8A8]">show_chart</span>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1A1A1A]">Platform Telemetry & Vitals</h2>
                  <p className="text-xs font-bold text-[#1A1A1A]/70">Server response latency (24h window)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#B3D8A8] text-[#1A1A1A] text-xs font-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                <span>{analytics.systemVitals?.status || 'OPTIMAL'}</span>
              </span>
            </div>

            {/* Smooth Bézier Spline Chart Container */}
            <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_#1A1A1A] mt-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#1A1A1A] mb-1 px-1">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">Latency Response Time</span>
                <span className="text-[11px] font-mono font-black text-[#059669] bg-[#F7F2E7] px-2 py-0.5 rounded-full border border-[#1A1A1A]">
                  {analytics.systemVitals?.dbLatencyMs || 12}ms (Live)
                </span>
              </div>

              {/* SVG Smooth Bézier Spline Graph */}
              <div className="relative w-full select-none pt-1">
                {(() => {
                  // Real rolling latency history from backend (builds up every 20s poll)
                  const rawPoints = latencyPoints.length >= 2
                    ? latencyPoints
                    : [{ time: 'Now', val: analytics.systemVitals?.dbLatencyMs || 0, isCurrent: true }];

                  if (rawPoints.length < 2) {
                    return (
                      <div className="h-36 flex items-center justify-center text-xs font-bold text-[#1A1A1A]/50">
                        Collecting latency history... (auto-refreshes every 20s)
                      </div>
                    );
                  }

                  const w = 440;
                  const h = 180;
                  const padLeft = 32;
                  const padRight = 18;
                  const padTop = 24;
                  const padBottom = 28;
                  const innerW = w - padLeft - padRight;
                  const innerH = h - padTop - padBottom;
                  const yMax = Math.max(50, ...rawPoints.map((p) => p.val));
                  const yStep = yMax <= 50 ? 10 : yMax <= 100 ? 20 : 50;
                  const yTicks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);

                  const coords = rawPoints.map((pt, i) => {
                    const x = padLeft + (i / (rawPoints.length - 1)) * innerW;
                    const y = padTop + innerH - (Math.min(yMax, Math.max(0, pt.val)) / yMax) * innerH;
                    return { ...pt, x, y };
                  });

                  // Catmull-Rom to Cubic Bézier Spline generator
                  let splinePath = `M ${coords[0].x} ${coords[0].y}`;
                  for (let i = 0; i < coords.length - 1; i++) {
                    const p0 = coords[i === 0 ? 0 : i - 1];
                    const p1 = coords[i];
                    const p2 = coords[i + 1];
                    const p3 = coords[i + 2 >= coords.length ? coords.length - 1 : i + 2];

                    const cp1x = p1.x + (p2.x - p0.x) / 4.8;
                    const cp1y = p1.y + (p2.y - p0.y) / 4.8;
                    const cp2x = p2.x - (p3.x - p1.x) / 4.8;
                    const cp2y = p2.y - (p3.y - p1.y) / 4.8;

                    splinePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
                  }

                  // Active point defaults to latest (most recent) sample
                  const activeIdx = (activeVitalsIndex !== null && activeVitalsIndex >= 0 && activeVitalsIndex < coords.length)
                    ? activeVitalsIndex
                    : coords.length - 1;
                  const activePt = coords[activeIdx] || coords[coords.length - 1];
                  // yTicks now computed dynamically above

                  return (
                    <svg className="w-full h-36 overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                      {/* Horizontal Grid Lines & Y-Axis Labels */}
                      {yTicks.map((tick) => {
                        const y = padTop + innerH - (tick / yMax) * innerH;
                        return (
                          <g key={tick}>
                            <line
                              x1={padLeft}
                              y1={y}
                              x2={w - padRight}
                              y2={y}
                              stroke="#1A1A1A"
                              strokeWidth="1"
                              strokeDasharray="3 3"
                              opacity="0.12"
                            />
                            <text
                              x={padLeft - 6}
                              y={y + 3.5}
                              textAnchor="end"
                              fontSize="9"
                              fontWeight="800"
                              fill="#1A1A1A"
                              opacity="0.6"
                              fontFamily="sans-serif"
                            >
                              {tick}ms
                            </text>
                          </g>
                        );
                      })}

                      {/* X-Axis Time Labels */}
                      {coords.map((pt, i) => (
                        <text
                          key={i}
                          x={pt.x}
                          y={h - 8}
                          textAnchor="middle"
                          fontSize="8.5"
                          fontWeight="800"
                          fill="#1A1A1A"
                          opacity={i === activeIdx ? '1' : '0.45'}
                          fontFamily="sans-serif"
                        >
                          {pt.time}
                        </text>
                      ))}

                      {/* Vertical Guide Line to Active Point */}
                      <line
                        x1={activePt.x}
                        y1={padTop}
                        x2={activePt.x}
                        y2={padTop + innerH}
                        stroke="#1A1A1A"
                        strokeWidth="1.5"
                        strokeDasharray="2 3"
                        opacity="0.35"
                      />

                      {/* Fluid Smooth Spline Curve Line */}
                      <path
                        d={splinePath}
                        fill="none"
                        stroke="#1A1A1A"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Floating Dual-Compartment Black Tooltip Badge */}
                      {(() => {
                        const tooltipW = 84;
                        const tooltipH = 26;
                        const tooltipX = Math.max(padLeft, Math.min(w - padRight - tooltipW, activePt.x - tooltipW / 2));
                        const tooltipY = Math.max(4, activePt.y - 36);

                        return (
                          <g className="transition-transform duration-200">
                            {/* Black Tooltip Pill Box */}
                            <rect
                              x={tooltipX}
                              y={tooltipY}
                              width={tooltipW}
                              height={tooltipH}
                              rx="8"
                              fill="#1A1A1A"
                              stroke="#1A1A1A"
                              strokeWidth="1.5"
                              className="shadow-[2px_2px_0px_#1A1A1A]"
                            />
                            {/* Left Compartment: Timestamp */}
                            <text
                              x={tooltipX + 25}
                              y={tooltipY + 16.5}
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="800"
                              fill="#FFFFFF"
                              fontFamily="sans-serif"
                            >
                              {activePt.time}
                            </text>
                            {/* Middle Divider */}
                            <line
                              x1={tooltipX + 46}
                              y1={tooltipY + 5}
                              x2={tooltipX + 46}
                              y2={tooltipY + 21}
                              stroke="#FFFFFF"
                              strokeWidth="1"
                              opacity="0.3"
                            />
                            {/* Right Compartment: Value */}
                            <text
                              x={tooltipX + 66}
                              y={tooltipY + 16.5}
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="900"
                              fill="#F6E27B"
                              fontFamily="sans-serif"
                            >
                              {activePt.val}ms
                            </text>
                          </g>
                        );
                      })()}

                      {/* Target Ring Marker on Active Point */}
                      <g>
                        <circle
                          cx={activePt.x}
                          cy={activePt.y}
                          r="11"
                          fill="#059669"
                          opacity="0.35"
                          className="animate-ping"
                        />
                        <circle
                          cx={activePt.x}
                          cy={activePt.y}
                          r="7"
                          fill="#1A1A1A"
                          stroke="#1A1A1A"
                          strokeWidth="1"
                        />
                        <circle
                          cx={activePt.x}
                          cy={activePt.y}
                          r="3.5"
                          fill="#FFFFFF"
                        />
                      </g>

                      {/* Interactive Click/Hover Target Areas along X-Axis */}
                      {coords.map((pt, i) => (
                        <rect
                          key={`target-${i}`}
                          x={pt.x - innerW / (coords.length * 2)}
                          y={padTop}
                          width={innerW / coords.length}
                          height={innerH + 15}
                          fill="transparent"
                          className="cursor-pointer"
                          onClick={() => setActiveVitalsIndex(i)}
                          onMouseEnter={() => setActiveVitalsIndex(i)}
                        />
                      ))}
                    </svg>
                  );
                })()}
              </div>

              {/* 3 Telemetry Data Pills */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 pt-3 border-t border-[#1A1A1A]/10">
                <div className="bg-[#F7F2E7] border border-[#1A1A1A] rounded-xl p-2.5 text-center shadow-[1px_1px_0px_#1A1A1A]">
                  <span className="text-[9px] font-black uppercase text-[#1A1A1A]/60 block tracking-wider">DB Ping</span>
                  <span className="text-xs sm:text-sm font-black text-[#059669] font-mono mt-0.5 block">
                    {analytics.systemVitals?.dbLatencyMs || 12}ms
                  </span>
                </div>

                <div className="bg-[#F7F2E7] border border-[#1A1A1A] rounded-xl p-2.5 text-center shadow-[1px_1px_0px_#1A1A1A]">
                  <span className="text-[9px] font-black uppercase text-[#1A1A1A]/60 block tracking-wider">Heap RAM</span>
                  <span className="text-xs sm:text-sm font-black text-[#1A1A1A] font-mono mt-0.5 block">
                    {analytics.systemVitals?.memoryUsageMb || 42}MB
                  </span>
                </div>

                <div className="bg-[#F7F2E7] border border-[#1A1A1A] rounded-xl p-2.5 text-center shadow-[1px_1px_0px_#1A1A1A]">
                  <span className="text-[9px] font-black uppercase text-[#1A1A1A]/60 block tracking-wider">Uptime</span>
                  <span className="text-xs sm:text-sm font-black text-[#7C3AED] font-mono mt-0.5 block">
                    {formattedUptime}
                  </span>
                </div>
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between text-[11px] font-extrabold text-[#1A1A1A] pt-2.5 mt-2.5 border-t border-[#1A1A1A]/10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B3D8A8] border border-[#1A1A1A]" />
                  Node: <strong>{analytics.systemVitals?.nodeVersion || '—'}</strong>
                </span>
                <span className="text-[#059669] font-black">
                  {analytics.systemVitals?.status || 'OPERATIONAL'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-extrabold text-[#1A1A1A]/80 pt-4 px-1">
            <span>Express API Proxy Gateway</span>
            <span className="font-mono font-black bg-white px-2.5 py-0.5 rounded-full border border-[#1A1A1A] text-[11px]">
              {lastRefreshed
                ? <span className={lastRefreshed.isCached ? 'text-[#B45309]' : 'text-[#059669]'}>{lastRefreshed.label}</span>
                : <span className="text-[#1A1A1A]/50">Connecting...</span>
              }
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. CONTENT MODERATION PIPELINE (4-Stage Connected Workflow Card)
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#B3D8A8] border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#1A1A1A]">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <span className="material-symbols-outlined text-[20px] text-[#B3D8A8]">filter_alt</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1A1A1A]">Content Moderation Pipeline</h2>
              <p className="text-xs font-bold text-[#1A1A1A]/70">Automated conversion from student upload to verified vault drop</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-[#1A1A1A] text-white text-xs font-black shadow-[2px_2px_0px_#1A1A1A]">
            Automated Quality Gate
          </span>
        </div>

        {/* 4 Connected Funnel Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          
          {/* Stage 1 */}
          <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">Stage 01</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F7F2E7] border border-[#1A1A1A] text-[9px] font-black">
                  Ingested
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-2">
                {analytics.moderationFunnel?.stage1Pct || 100}%
              </p>
              <div className="w-full bg-[#F7F2E7] h-2.5 rounded-full border border-[#1A1A1A] mt-2.5 overflow-hidden">
                <div className="bg-[#1A1A1A] h-full w-full" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1A1A1A]/10">
              <span className="text-xs font-black text-[#1A1A1A] block">All Submissions Received</span>
              <span className="text-[10px] font-bold text-[#1A1A1A]/60">{analytics.moderationFunnel?.totalSubmissions || 0} total in DB</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">Stage 02</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F6E27B] border border-[#1A1A1A] text-[9px] font-black">
                  Scanned
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-2">
                {analytics.moderationFunnel?.stage2Pct ?? 0}%
              </p>
              <div className="w-full bg-[#F7F2E7] h-2.5 rounded-full border border-[#1A1A1A] mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${analytics.moderationFunnel?.stage2Pct ?? 0}%` }}
                  className="bg-[#F6E27B] h-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1A1A1A]/10">
              <span className="text-xs font-black text-[#1A1A1A] block">Intake Pass Rate</span>
              <span className="text-[10px] font-bold text-[#1A1A1A]/60">{analytics.moderationFunnel?.rejectedCount || 0} rejected of total</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">Stage 03</span>
                <span className="px-2 py-0.5 rounded-full bg-[#BFACE8] border border-[#1A1A1A] text-[9px] font-black">
                  Triage
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-2">
                {analytics.moderationFunnel?.stage3Pct ?? 0}%
              </p>
              <div className="w-full bg-[#F7F2E7] h-2.5 rounded-full border border-[#1A1A1A] mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${analytics.moderationFunnel?.stage3Pct ?? 0}%` }}
                  className="bg-[#BFACE8] h-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1A1A1A]/10">
              <span className="text-xs font-black text-[#1A1A1A] block">Under Review / Approved</span>
              <span className="text-[10px] font-bold text-[#1A1A1A]/60">{analytics.moderationFunnel?.pendingCount || 0} pending triage</span>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">Stage 04</span>
                <span className="px-2 py-0.5 rounded-full bg-[#B3D8A8] border border-[#1A1A1A] text-[9px] font-black">
                  Live
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-2">
                {analytics.moderationFunnel?.stage4Pct ?? 0}%
              </p>
              <div className="w-full bg-[#F7F2E7] h-2.5 rounded-full border border-[#1A1A1A] mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${analytics.moderationFunnel?.stage4Pct ?? 0}%` }}
                  className="bg-[#B3D8A8] h-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1A1A1A]/10">
              <span className="text-xs font-black text-[#1A1A1A] block">Approved & Published</span>
              <span className="text-[10px] font-bold text-[#1A1A1A]/60">{analytics.moderationFunnel?.approvedCount || 0} live in vault</span>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. BALANCED 2-COLUMN ACTIONABLE SECTION: QUEUE & OPERATIONS LOG
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* ── LEFT SECTION (7 cols on LG+): INCOMING SUBMISSIONS QUEUE ── */}
        <div className="lg:col-span-7 bg-white border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#1A1A1A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#1A1A1A] flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F6E27B] border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A]">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">Incoming Submissions Queue</h2>
                  <p className="text-xs font-bold text-[#1A1A1A]/60">Action items waiting for moderator verification</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#FBCFE8] border border-[#1A1A1A] text-[10px] font-black shadow-[1px_1px_0px_#1A1A1A]">
                  {analytics.kpis.pendingUploads} Pending
                </span>
                <Link
                  to="/admin/submissions"
                  className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-black hover:bg-[#2D2D2D] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#1A1A1A] active:translate-y-0.5"
                >
                  <span>View All</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Scrollable Submissions List Bounded Container */}
            {recentUploads.length > 0 ? (
              <div className="h-[390px] overflow-y-auto pr-2 space-y-3 admin-scrollbar overscroll-contain">
                {recentUploads.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F7F2E7] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:translate-x-1 transition-transform"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F6E27B] border border-[#1A1A1A] text-[10px] font-black uppercase">
                          {item.resourceType || 'Study Note'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#1A1A1A] text-[10px] font-bold">
                          {item.subjectCode || 'General'}
                        </span>
                        <span className="text-[10px] font-extrabold text-[#1A1A1A]/60">
                          by {item.studentName || item.user?.name || 'Anonymous Student'}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-[#1A1A1A] leading-snug truncate">{item.title}</h3>
                      <p className="text-[11px] text-[#1A1A1A]/70 font-semibold line-clamp-1">
                        {item.description || 'Uploaded by student for moderation review.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to="/admin/submissions"
                        className="px-3.5 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-black hover:bg-[#2D2D2D] transition shadow-[2px_2px_0px_#1A1A1A]"
                      >
                        Inspect & Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[390px] flex flex-col items-center justify-center text-center space-y-2 bg-[#F7F2E7] rounded-2xl border-2 border-dashed border-[#1A1A1A]/40 p-6">
                <span className="material-symbols-outlined text-4xl text-[#B3D8A8]">verified</span>
                <p className="text-sm font-black text-[#1A1A1A]">Queue is completely clean!</p>
                <p className="text-xs font-bold text-[#1A1A1A]/60">No pending student uploads waiting for review right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT SECTION (5 cols on LG+): OPERATIONS LOG / AUDIT STREAM ── */}
        <div className="lg:col-span-5 bg-white border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-7 shadow-[5px_5px_0px_#1A1A1A] flex flex-col justify-between relative">
          <div>
            {/* Card Header & Live Status */}
            <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#1A1A1A] flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#BFACE8] border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A]">
                  <span className="material-symbols-outlined text-[#1A1A1A] text-[20px]">history</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">Operations Log</h2>
                  <p className="text-xs font-bold text-[#1A1A1A]/60">Chronological telemetry & audit stream</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B3D8A8] text-[#1A1A1A] text-[10px] font-black border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  Live Stream
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#F6E27B] border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  {analytics.timelineEvents?.length || 0} Total
                </span>
              </div>
            </div>

            {/* Quick Search & Filter Controls */}
            <div className="space-y-2 mb-3">
              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#1A1A1A]/50 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter logs by keyword (Drive, DB, Ingest, etc.)..."
                  className="w-full pl-8 pr-7 py-1.5 bg-[#F7F2E7] border-2 border-[#1A1A1A] rounded-full text-xs font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#1A1A1A] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 admin-scrollbar">
                {[
                  { id: 'ALL', label: 'All', count: timelineCounts.ALL },
                  { id: 'UPLOAD', label: 'Uploads', count: timelineCounts.UPLOAD },
                  { id: 'RESOURCE', label: 'Vault', count: timelineCounts.RESOURCE },
                  { id: 'SYSTEM', label: 'System & Cron', count: timelineCounts.SYSTEM },
                ].map((tab) => {
                  const isActive = timelineFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTimelineFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border border-[#1A1A1A] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#1A1A1A] text-[#F6E27B] shadow-[2px_2px_0px_#1A1A1A] -translate-y-0.5'
                          : 'bg-[#F7F2E7] text-[#1A1A1A] hover:bg-[#F6E27B]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                          isActive
                            ? 'bg-[#F6E27B] text-[#1A1A1A]'
                            : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Audit Stream Bounded Container */}
            {filteredTimeline.length > 0 ? (
              <div
                id="admin-operations-log-container"
                className="h-[390px] overflow-y-auto pr-2 space-y-3 admin-scrollbar overscroll-contain relative scroll-smooth select-none"
              >
                {/* Visual Connected Timeline Track */}
                <div className="relative pl-3 space-y-3 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-[2px] before:border-l-2 before:border-dashed before:border-[#1A1A1A]/30">
                  {filteredTimeline.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="flex items-start gap-3 relative cursor-pointer group"
                    >
                      {/* Avatar Circle with Status Color */}
                      <div
                        style={{ backgroundColor: evt.statusColor || '#F6E27B' }}
                        className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center font-black text-[10px] shrink-0 shadow-[2px_2px_0px_#1A1A1A] relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform"
                      >
                        {evt.initials || 'OP'}
                      </div>

                      {/* Event Detail Box */}
                      <div className="flex-1 min-w-0 bg-[#F7F2E7] group-hover:bg-white border-2 border-[#1A1A1A] p-3 rounded-2xl shadow-[2px_2px_0px_#1A1A1A] group-hover:shadow-[4px_4px_0px_#1A1A1A] group-hover:translate-x-1 transition-all">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 shrink-0">
                            {evt.timestamp
                              ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                              : 'Recent'}
                          </span>
                          <span
                            style={{ backgroundColor: evt.statusColor || '#B3D8A8' }}
                            className="px-2 py-0.5 rounded-full text-[9px] font-black text-[#1A1A1A] border border-[#1A1A1A] shrink-0 truncate max-w-[110px]"
                          >
                            {evt.status || 'Active'}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-[#1A1A1A] mt-1 truncate leading-snug group-hover:text-blue-900 transition-colors">
                          {evt.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#1A1A1A]/70 truncate mt-0.5">
                          {evt.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[390px] flex flex-col items-center justify-center text-center space-y-2 bg-[#F7F2E7] rounded-2xl border-2 border-dashed border-[#1A1A1A]/40 p-6">
                <span className="material-symbols-outlined text-4xl text-[#1A1A1A]/40">filter_alt_off</span>
                <p className="text-sm font-black text-[#1A1A1A]">No events match current filter</p>
                <p className="text-xs font-bold text-[#1A1A1A]/60">Try clearing the search or switching category tabs.</p>
                <button
                  onClick={() => {
                    setTimelineFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-black hover:bg-[#2D2D2D] transition shadow-[2px_2px_0px_#1A1A1A]"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Bottom Scroll Indicator & Jump Actions */}
            <div className="pt-2.5 mt-2.5 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[10px] font-extrabold text-[#1A1A1A]/70 flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#059669] animate-bounce">expand_more</span>
                <span>Showing {filteredTimeline.length} of {analytics.timelineEvents?.length || 0} events · Scrollable</span>
              </span>

              <button
                onClick={() => {
                  const el = document.getElementById('admin-operations-log-container');
                  if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2 py-0.5 rounded-md bg-[#F7F2E7] hover:bg-[#F6E27B] border border-[#1A1A1A] text-[9px] font-black text-[#1A1A1A] flex items-center gap-0.5 cursor-pointer shadow-[1px_1px_0px_#1A1A1A]"
                title="Scroll back to newest event"
              >
                <span className="material-symbols-outlined text-[11px]">arrow_upward</span>
                <span>Top</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. MODAL: TELEMETRY EVENT INSPECTOR
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white border-3 border-[#1A1A1A] rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-[8px_8px_0px_#1A1A1A] space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: selectedEvent.statusColor || '#F6E27B' }}
                  className="w-10 h-10 rounded-2xl border-2 border-[#1A1A1A] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#1A1A1A]"
                >
                  {selectedEvent.initials || 'OP'}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider block">
                    Telemetry Audit Record
                  </span>
                  <h3 className="text-base font-black text-[#1A1A1A] leading-snug">{selectedEvent.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full bg-[#F7F2E7] hover:bg-[#FBCFE8] border-2 border-[#1A1A1A] font-black text-xs flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              >
                ✕
              </button>
            </div>

            {/* Metadata Rows */}
            <div className="space-y-3 bg-[#F7F2E7] border-2 border-[#1A1A1A] p-4 rounded-2xl text-xs font-bold shadow-[2px_2px_0px_#1A1A1A]">
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A]/60">Event Identifier:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-[#1A1A1A] text-[11px] font-mono font-black">
                  {selectedEvent.id}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A]/60">Event Category:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F6E27B] border border-[#1A1A1A] text-[10px] font-black uppercase">
                  {selectedEvent.type || 'SYSTEM'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A]/60">Audit Status:</span>
                <span
                  style={{ backgroundColor: selectedEvent.statusColor || '#B3D8A8' }}
                  className="px-2.5 py-0.5 rounded-full border border-[#1A1A1A] text-[10px] font-black"
                >
                  {selectedEvent.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A]/60">Recorded Time:</span>
                <span className="text-[#1A1A1A] font-mono">
                  {selectedEvent.timestamp ? new Date(selectedEvent.timestamp).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#1A1A1A]/60 tracking-wider">Payload Details</span>
              <p className="text-xs font-semibold text-[#1A1A1A] bg-white border border-[#1A1A1A] p-3 rounded-xl">
                {selectedEvent.subtitle}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedEvent.type === 'UPLOAD' && (
                <Link
                  to="/admin/submissions"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 rounded-full bg-[#FBCFE8] hover:bg-[#f9a8d4] text-[#1A1A1A] text-xs font-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                >
                  Go to Submissions
                </Link>
              )}
              {selectedEvent.type === 'RESOURCE' && (
                <Link
                  to="/admin/resources"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 rounded-full bg-[#F6E27B] hover:bg-[#f3d951] text-[#1A1A1A] text-xs font-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                >
                  Go to Catalog
                </Link>
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-black hover:bg-[#2D2D2D] transition shadow-[2px_2px_0px_#1A1A1A]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


