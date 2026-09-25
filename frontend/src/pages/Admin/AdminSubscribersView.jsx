// src/pages/Admin/AdminSubscribersView.jsx
// Newsletter Subscribers & Student Audience Manager.
// Signature Neo-Brutalist Yellow & Slate Theme.

import { useState, useEffect, useCallback } from 'react';
import { getAdminSubscribers, deleteAdminSubscriber } from '../../services/admin/adminApi';

export default function AdminSubscribersView() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminSubscribers();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleCopyAll = () => {
    if (subscribers.length === 0) return;
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard?.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    if (subscribers.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Subscribed Date']
        .concat(
          subscribers.map(
            (s) =>
              `"${s.email}","${new Date(s.subscribedAt || s.createdAt || Date.now()).toISOString()}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber from the mailing list?')) return;
    setDeletingId(id);
    try {
      await deleteAdminSubscriber(id);
      await load();
    } catch (err) {
      alert(err.message || 'Failed to delete subscriber');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border-2 border-slate-900 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-[16px] text-amber-600">mail</span>
            <span>Audience &amp; Broadcast</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Manage students who opted in for semester study updates and resource alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyAll}
            disabled={subscribers.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border-2 border-slate-900 text-slate-950 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-600">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy All Emails'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={subscribers.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 border-2 border-slate-900 text-slate-950 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-600">Total Subscribers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-950 text-[18px]">group</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-950 mt-2">{loading ? '—' : subscribers.length}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">Active verified email subscribers</p>
        </div>

        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-600">Broadcast Channel</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-400 border-2 border-slate-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-950 text-[18px]">mark_email_read</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-950 mt-2">Ready</p>
          <p className="text-xs font-bold text-emerald-700 mt-1">Formatted for batch delivery</p>
        </div>

        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-600">Acquisition Source</span>
            <div className="w-8 h-8 rounded-xl bg-sky-400 border-2 border-slate-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-950 text-[18px]">web</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-950 mt-2">Homepage Form</p>
          <p className="text-xs font-bold text-sky-700 mt-1">Student resource hub footer</p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-md">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
          search
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subscriber email..."
          className="w-full pl-11 pr-4 py-2.5 border-2 border-slate-900 rounded-2xl bg-white text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#0F172A] focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[2px_2px_0px_#0F172A]">
          <span className="material-symbols-outlined text-[20px] text-rose-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* ── Subscribers Table ── */}
      <div className="bg-white border-3 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_#0F172A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FFFBEB] border-b-2 border-slate-900 text-slate-950 font-black uppercase text-[11px] tracking-wider">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Subscriber Email</th>
                <th className="px-5 py-4">Subscribed Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-5 py-4 bg-amber-50/30" />
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500">
                    <span className="material-symbols-outlined text-5xl block mb-2 text-slate-300">
                      mail_outline
                    </span>
                    <p className="font-black text-slate-900 text-base">No subscribers found</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">Students who subscribe on the homepage will appear here.</p>
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                        <span className="font-black text-slate-900">{s.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-600">
                      {new Date(s.subscribedAt || s.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(s.email);
                            alert(`Copied ${s.email}`);
                          }}
                          className="p-1.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#0F172A] transition-all cursor-pointer"
                          title="Copy Email"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>

                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingId === s.id}
                          className="p-1.5 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 shadow-[2px_2px_0px_#0F172A] transition-all cursor-pointer disabled:opacity-40"
                          title="Delete Subscriber"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
