// src/layouts/AdminLayout.jsx
// Protected layout wrapper for all /admin/* routes.
// Neubrutalist 3-Column SaaS Theme — Dark Sidebar (#1A1A1A) & Cream Background (#F7F2E7).

import { useState, useEffect } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getAdminUploads } from '../services/admin/adminApi';
import ScrollToTop from '../components/common/ScrollToTop';

export default function AdminLayout() {
  const { admin, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending uploads count for sidebar badge
  useEffect(() => {
    let mounted = true;
    async function checkPending() {
      try {
        const uploads = await getAdminUploads('PENDING');
        if (mounted && Array.isArray(uploads)) {
          setPendingCount(uploads.length);
        }
      } catch {
        // silent fallback
      }
    }
    if (admin) {
      checkPending();
      const timer = setInterval(checkPending, 30000); // refresh every 30s
      return () => {
        mounted = false;
        clearInterval(timer);
      };
    }
  }, [admin]);

  // While checking session cookie, show a spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F2E7] flex items-center justify-center font-sans">
        <div className="w-14 h-14 bg-[#F6E27B] border-3 border-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#1A1A1A] animate-bounce">
          <span className="material-symbols-outlined text-[#1A1A1A] text-[28px]">shield_person</span>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  const navItems = [
    { to: '/admin/dashboard',         icon: 'dashboard',    label: 'Overview Dashboard',  accent: '#F6E27B' },
    { to: '/admin/homepage-settings', icon: 'tune',         label: 'Clock & Trending',    accent: '#FDE047' },
    { to: '/admin/submissions',       icon: 'inbox',        label: 'Submissions Queue',   accent: '#FBCFE8', badge: pendingCount },
    { to: '/admin/resources',         icon: 'folder_open',  label: 'Study Vault',         accent: '#B3D8A8' },
    { to: '/admin/viva',              icon: 'quiz',         label: 'Viva Questions',      accent: '#F6E27B' },
    { to: '/admin/opportunities',     icon: 'work',         label: 'Opportunities',       accent: '#BFACE8' },
    { to: '/admin/polls',             icon: 'how_to_vote',  label: 'Polls & Referendums', accent: '#F6E27B' },
    { to: '/admin/catalog',           icon: 'account_tree', label: 'Academic Catalog',    accent: '#B3D8A8' },
    { to: '/admin/subscribers',       icon: 'mail',         label: 'Newsletter Audience', accent: '#FBCFE8' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F2E7] text-[#1A1A1A] flex flex-col md:flex-row font-sans selection:bg-[#F6E27B] selection:text-[#1A1A1A]">
      <ScrollToTop />

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#1A1A1A] text-white border-b-3 border-[#1A1A1A] px-4 py-3.5 flex items-center justify-between z-30 sticky top-0 shadow-[0_4px_0px_#1A1A1A]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#F6E27B] border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#000000]">
            <span className="material-symbols-outlined text-[#1A1A1A] text-[20px]">shield_person</span>
          </div>
          <div>
            <p className="font-black text-white text-sm leading-tight tracking-tight">CampusAdmin OS</p>
            <p className="text-[10px] font-extrabold text-[#F6E27B] uppercase tracking-wider">Student Resource Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-full bg-[#F6E27B] text-[#1A1A1A] text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-1"
          >
            <span>Live Site ↗</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 bg-[#262626] border-2 border-white/20 rounded-xl flex items-center justify-center text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Desktop Dark Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 w-72 shrink-0 bg-[#1A1A1A] text-white border-r-3 border-[#1A1A1A] flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0 shadow-[10px_0px_0px_#1A1A1A]' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b-2 border-white/10 bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#F6E27B] border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#000000]">
                <span className="material-symbols-outlined text-[#1A1A1A] text-[24px]">local_hospital</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-white text-base leading-tight tracking-tight">CampusAdmin</p>
                  <span className="px-2 py-0.5 rounded-full bg-[#B3D8A8] text-[#1A1A1A] text-[10px] font-black border border-black">
                    v2.5
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#B3D8A8] animate-pulse" />
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Health SaaS Engine</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden w-8 h-8 rounded-xl border border-white/20 bg-[#262626] flex items-center justify-center text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Quick Launch Pill */}
          <div className="p-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#262626] hover:bg-[#333333] border-2 border-white/10 text-white text-xs font-bold transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#F6E27B]">public</span>
                <span>Open Student Portal</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-white/60 group-hover:translate-x-0.5 transition-transform">
                arrow_outward
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="px-3.5 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
              Core Modules
            </p>
            {navItems.map(({ to, icon, label, accent, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F6E27B] text-[#1A1A1A] border-2 border-black shadow-[3px_3px_0px_#000000] translate-x-1'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center border shrink-0 ${
                          isActive
                            ? 'bg-[#1A1A1A] text-[#F6E27B] border-black'
                            : 'bg-[#262626] text-white border-white/10'
                        }`}
                        style={{ color: !isActive ? accent : undefined }}
                      >
                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                      </div>
                      <span className="truncate">{label}</span>
                    </div>

                    {typeof badge === 'number' && badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-black shadow-[1px_1px_0px_#000000] shrink-0 ${
                          isActive ? 'bg-[#1A1A1A] text-[#FBCFE8]' : 'bg-[#FBCFE8] text-[#1A1A1A]'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Profile & Sign Out Footer */}
          <div className="mt-auto p-4 border-t-2 border-white/10 bg-[#141414] space-y-3">
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#262626] border-2 border-white/10">
              <div className="w-9 h-9 bg-[#FBCFE8] border border-black rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#1A1A1A] text-[20px]">person</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-white truncate">{admin?.name || 'Admin User'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B3D8A8]" />
                  <span className="text-[10px] font-bold text-[#B3D8A8] uppercase tracking-wider">
                    {admin?.role || 'Moderator'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-black text-white bg-[#262626] hover:bg-[#E11D48] hover:text-white border-2 border-white/20 hover:border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-[#F7F2E7]">
        <Outlet />
      </main>
    </div>
  );
}
