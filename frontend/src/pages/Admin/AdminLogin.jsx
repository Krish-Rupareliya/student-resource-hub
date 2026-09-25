// src/pages/Admin/AdminLogin.jsx
// Staff & Admin Sign In.
// Signature Neo-Brutalist Yellow & Slate Theme.

import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect to dashboard
  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2E7] flex items-center justify-center p-4 font-sans selection:bg-[#F6E27B] selection:text-[#1A1A1A]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border-3 border-[#1A1A1A] rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0px_#1A1A1A] relative overflow-hidden">
          {/* Decorative Corner Accent */}
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#F6E27B] border-2 border-[#1A1A1A] pointer-events-none opacity-80" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#F6E27B] border-3 border-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#1A1A1A]">
              <span className="material-symbols-outlined text-[#1A1A1A] text-[32px]">shield_person</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B3D8A8] animate-pulse" />
              <span>CampusAdmin OS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">Admin Portal</h1>
            <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]/70 mt-1">Student Resource Hub — Staff Access</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FBCFE8] border-2 border-[#1A1A1A] text-[#1A1A1A] flex items-start gap-3 shadow-[2px_2px_0px_#1A1A1A]">
              <span className="material-symbols-outlined text-[#E11D48] text-[20px] mt-0.5 shrink-0">error</span>
              <p className="text-xs sm:text-sm font-black">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-black uppercase text-[#1A1A1A] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1A1A1A]/50 text-[18px]">
                  alternate_email
                </span>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campus.edu"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F2E7] border-2 border-[#1A1A1A] rounded-2xl text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:bg-white text-xs sm:text-sm font-extrabold shadow-[2px_2px_0px_#1A1A1A] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-black uppercase text-[#1A1A1A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1A1A1A]/50 text-[18px]">
                  lock
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-[#F7F2E7] border-2 border-[#1A1A1A] rounded-2xl text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:bg-white text-xs sm:text-sm font-extrabold shadow-[2px_2px_0px_#1A1A1A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#F6E27B] hover:bg-[#ebd35d] text-[#1A1A1A] border-3 border-[#1A1A1A] px-6 py-3.5 rounded-full font-black text-xs sm:text-sm shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Sign In to Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t-2 border-[#1A1A1A]/10 text-center relative z-10">
            <Link to="/" className="text-xs font-black text-[#1A1A1A]/70 hover:text-[#1A1A1A] underline transition-colors">
              ← Back to Student Resource Hub
            </Link>
          </div>
        </div>

        <p className="text-center text-xs font-extrabold text-[#1A1A1A]/60 mt-4">
          🔒 Secure HttpOnly session with Backend Proxy Isolation
        </p>
      </div>
    </div>
  );
}
