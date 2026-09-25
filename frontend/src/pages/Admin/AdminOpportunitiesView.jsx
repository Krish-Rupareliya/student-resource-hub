// src/pages/Admin/AdminOpportunitiesView.jsx
// Manage opportunities and announcements: create, edit, toggle active, delete.
// Signature Neo-Brutalist Yellow & Slate Theme with Direct Application URLs & Deadlines.

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAdminOpportunities, createOpportunity, updateOpportunity, toggleOpportunity, deleteOpportunity,
  getAdminAnnouncements, createAnnouncement, updateAnnouncement, toggleAnnouncement, deleteAnnouncement,
} from '../../services/admin/adminApi';

const OPPORTUNITY_CATEGORIES = [
  'Internship', 'Hackathon', 'Scholarship', 'Workshop', 'Placement',
  'Open Source', 'Certification', 'Webinar', 'General',
];

const BADGE_COLORS = [
  { label: 'Amber',   class: 'bg-amber-400' },
  { label: 'Emerald', class: 'bg-emerald-400' },
  { label: 'Sky',     class: 'bg-sky-400' },
  { label: 'Rose',    class: 'bg-rose-400' },
  { label: 'Purple',  class: 'bg-purple-400' },
];

function Modal({ title, icon = 'campaign', onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-[6px_6px_0px_#0F172A] w-[95%] sm:w-full sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto border-3 border-slate-900 mx-auto">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b-2 border-slate-900 bg-[#FFFBEB]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-500 text-[24px]">{icon}</span>
            <h2 className="text-base sm:text-lg font-black text-slate-950">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-900 transition cursor-pointer shadow-[2px_2px_0px_#0F172A]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

const PRESET_TAGS = ['Paid', 'Remote', 'Govt Funded', 'Urgent', 'Top Stipend', 'Closing Soon', 'Open Source'];

function OpportunityForm({ initial = null, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    category: initial?.category || 'Internship',
    tag: initial?.tag || '',
    link: initial?.link || '',
    deadline: initial?.deadline || '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const isEdit = Boolean(initial?.id);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr('Please enter an opportunity title.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      if (isEdit) {
        await updateOpportunity(initial.id, form);
      } else {
        await createOpportunity(form);
      }
      onClose(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {err && (
        <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 text-xs font-bold shadow-[2px_2px_0px_#0F172A]">
          {err}
        </div>
      )}

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
          Opportunity Title <span className="text-rose-500">*</span>
        </label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          placeholder="e.g. Google Summer of Code 2026"
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full border-2 border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            {OPPORTUNITY_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Deadline / Due Date</label>
          <input
            type="text"
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            placeholder="e.g. In 3 days / 30 April"
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-amber-600">link</span>
            <span>Official Apply / Registration Link</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono lowercase">https://...</span>
        </label>
        <input
          type="url"
          value={form.link}
          onChange={(e) => set('link', e.target.value)}
          placeholder="https://careers.google.com/... or https://unstop.com/..."
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Preset Tag</label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set('tag', t === form.tag ? '' : t)}
              className={`px-3 py-1 text-xs font-bold rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                form.tag === t
                  ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#0F172A]'
                  : 'bg-white text-slate-700 hover:bg-amber-50'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Description &amp; Eligibility</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="Brief details about the program, requirements, stipend, or registration steps…"
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={() => onClose(false)}
          className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-500 shadow-[2px_2px_0px_#0F172A] disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving ? (isEdit ? 'Saving…' : 'Publishing…') : (isEdit ? 'Save Changes' : 'Publish Opportunity')}
        </button>
      </div>
    </form>
  );
}

function AnnouncementForm({ initial = null, onClose }) {
  const [form, setForm] = useState({
    text: initial?.text || '',
    badge: initial?.badge || 'Important',
    color: initial?.color || 'bg-amber-400',
    deadline: initial?.deadline ? (typeof initial.deadline === 'string' ? initial.deadline.slice(0, 10) : new Date(initial.deadline).toISOString().slice(0, 10)) : '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const isEdit = Boolean(initial?.id);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.text.trim()) {
      setErr('Please enter announcement text.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      if (isEdit) {
        await updateAnnouncement(initial.id, { ...form, deadline: form.deadline || null });
      } else {
        await createAnnouncement({ ...form, deadline: form.deadline || null });
      }
      onClose(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {err && (
        <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 text-xs font-bold shadow-[2px_2px_0px_#0F172A]">
          {err}
        </div>
      )}

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
          Announcement Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={form.text}
          onChange={(e) => set('text', e.target.value)}
          required
          rows={3}
          placeholder="e.g. Summer 2026 Exam Forms deadline extended till March 10th..."
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Badge Label</label>
          <input
            value={form.badge}
            onChange={(e) => set('badge', e.target.value)}
            placeholder="e.g. Exam Alert / Urgent"
            className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Expiry / Due Date</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className="w-full border-2 border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Badge Color</label>
        <div className="flex gap-2.5">
          {BADGE_COLORS.map((c) => (
            <button
              key={c.class}
              type="button"
              onClick={() => set('color', c.class)}
              title={c.label}
              className={`w-7 h-7 rounded-full ${c.class} border-2 border-slate-900 transition-all cursor-pointer ${
                form.color === c.class ? 'ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-[2px_2px_0px_#0F172A]' : 'opacity-70 hover:opacity-100'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={() => onClose(false)}
          className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-500 shadow-[2px_2px_0px_#0F172A] disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving ? (isEdit ? 'Saving…' : 'Posting…') : (isEdit ? 'Save Changes' : 'Post Announcement')}
        </button>
      </div>
    </form>
  );
}

function ItemRow({ item, onEdit, onToggle, onDelete, labelField = 'title', isOpportunity, toggling, deleting }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        !item.isActive ? 'opacity-60 bg-slate-50' : 'hover:translate-x-0.5 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-slate-900 ${
              item.isActive ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {item.isActive ? '● Active' : '⏸ Hidden'}
          </span>
          {item.category && (
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-slate-900">
              {item.category}
            </span>
          )}
          {item.tag && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
              #{item.tag}
            </span>
          )}
          {item.badge && (
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-900 ${item.color || 'bg-amber-400'} text-slate-950`}>
              {item.badge}
            </span>
          )}
          {item.deadline && (
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-slate-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">timer</span>
              <span>{typeof item.deadline === 'string' && item.deadline.includes('T') ? item.deadline.slice(0, 10) : item.deadline}</span>
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-black text-slate-950 leading-snug">
          {item[labelField] || item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {isOpportunity && item.link && (
          <div className="pt-1">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline break-all"
            >
              <span className="material-symbols-outlined text-[15px]">link</span>
              <span>{item.link}</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
        {isOpportunity && item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-amber-100 hover:bg-amber-200 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            <span>Test Link</span>
          </a>
        )}

        {/* Edit Button */}
        <button
          onClick={() => onEdit(item)}
          className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] transition-all flex items-center gap-1 cursor-pointer hover:translate-x-0.5 hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Edit</span>
        </button>

        {/* Toggle Visibility */}
        <button
          onClick={() => onToggle(item.id)}
          disabled={toggling === item.id}
          className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-[2px_2px_0px_#0F172A] ${
            item.isActive ? 'bg-white text-slate-800 hover:bg-slate-100' : 'bg-emerald-200 text-emerald-950 hover:bg-emerald-300'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {item.isActive ? 'visibility_off' : 'visibility'}
          </span>
          <span>{item.isActive ? 'Hide' : 'Show'}</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(item.id)}
          disabled={deleting === item.id}
          className="p-1.5 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-[2px_2px_0px_#0F172A] disabled:opacity-40"
          title="Delete"
        >
          {deleting === item.id ? (
            <span className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <span className="material-symbols-outlined text-[18px]">delete</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminOpportunitiesView() {
  const [tab, setTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showOppForm, setShowOppForm] = useState(false);
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const [editingAnn, setEditingAnn] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [opps, anns] = await Promise.all([getAdminOpportunities(), getAdminAnnouncements()]);
      setOpportunities(Array.isArray(opps) ? opps : []);
      setAnnouncements(Array.isArray(anns) ? anns : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleOpenCreateOpp() {
    setEditingOpp(null);
    setShowOppForm(true);
  }

  function handleOpenEditOpp(opp) {
    setEditingOpp(opp);
    setShowOppForm(true);
  }

  function handleOpenCreateAnn() {
    setEditingAnn(null);
    setShowAnnForm(true);
  }

  function handleOpenEditAnn(ann) {
    setEditingAnn(ann);
    setShowAnnForm(true);
  }

  async function handleToggleOpp(id) {
    setToggling(id);
    try {
      await toggleOpportunity(id);
      await load();
    } finally {
      setToggling(null);
    }
  }

  async function handleDeleteOpp(id) {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    setDeleting(id);
    try {
      await deleteOpportunity(id);
      await load();
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleAnn(id) {
    setToggling(id);
    try {
      await toggleAnnouncement(id);
      await load();
    } finally {
      setToggling(null);
    }
  }

  async function handleDeleteAnn(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    setDeleting(id);
    try {
      await deleteAnnouncement(id);
      await load();
    } finally {
      setDeleting(null);
    }
  }

  const isOpps = tab === 'opportunities';

  const displayedOpportunities = useMemo(() => {
    const q = search.toLowerCase().trim();
    return opportunities.filter((o) => {
      const matchCat = selectedCategory === 'ALL' || o.category === selectedCategory;
      const matchText =
        !q ||
        (o.title && o.title.toLowerCase().includes(q)) ||
        (o.tag && o.tag.toLowerCase().includes(q)) ||
        (o.description && o.description.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [opportunities, search, selectedCategory]);

  const displayedAnnouncements = useMemo(() => {
    const q = search.toLowerCase().trim();
    return announcements.filter((a) => {
      return (
        !q ||
        (a.text && a.text.toLowerCase().includes(q)) ||
        (a.badge && a.badge.toLowerCase().includes(q))
      );
    });
  }, [announcements, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border-2 border-slate-900 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-[16px] text-amber-600">work</span>
            <span>Opportunities &amp; Broadcast Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">Opportunities &amp; Alerts</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Post and edit career opportunities with direct apply URLs and campus alert banners.
          </p>
        </div>
        <button
          onClick={isOpps ? handleOpenCreateOpp : handleOpenCreateAnn}
          className="flex items-center justify-center gap-2 bg-amber-400 text-slate-950 border-2 border-slate-900 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black hover:bg-amber-500 shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>{isOpps ? 'New Opportunity' : 'New Announcement'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 bg-[#FFFBEB] p-2 rounded-2xl w-fit border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]">
          {[
            { key: 'opportunities', icon: 'work', label: `Opportunities (${opportunities.length})` },
            { key: 'announcements', icon: 'campaign', label: `Announcements (${announcements.length})` },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setSearch('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                tab === key
                  ? 'bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-amber-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-white hover:bg-amber-50 border-2 border-slate-900 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_#0F172A]"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isOpps ? "Search opportunities by title, tag, description..." : "Search announcements..."}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-900"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {isOpps && (
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-slate-900 bg-amber-100 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 shadow-[2px_2px_0px_#0F172A] cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {OPPORTUNITY_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#0F172A]">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border-2 border-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && isOpps && (
        displayedOpportunities.length === 0 ? (
          <div className="text-center py-16 bg-white border-3 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_#0F172A]">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-2">work_off</span>
            <p className="font-black text-slate-900 text-base">
              {opportunities.length === 0 ? 'No opportunities yet' : 'No matching opportunities found'}
            </p>
            {opportunities.length > 0 && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('ALL');
                }}
                className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-950 underline cursor-pointer"
              >
                Clear search and filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedOpportunities.map((o) => (
              <ItemRow
                key={o.id}
                item={o}
                isOpportunity={true}
                onEdit={handleOpenEditOpp}
                onToggle={handleToggleOpp}
                onDelete={handleDeleteOpp}
                toggling={toggling}
                deleting={deleting}
              />
            ))}
          </div>
        )
      )}

      {!loading && !isOpps && (
        displayedAnnouncements.length === 0 ? (
          <div className="text-center py-16 bg-white border-3 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_#0F172A]">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-2">campaign</span>
            <p className="font-black text-slate-900 text-base">
              {announcements.length === 0 ? 'No announcements yet' : 'No matching announcements found'}
            </p>
            {announcements.length > 0 && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-950 underline cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAnnouncements.map((a) => (
              <ItemRow
                key={a.id}
                item={a}
                labelField="text"
                isOpportunity={false}
                onEdit={handleOpenEditAnn}
                onToggle={handleToggleAnn}
                onDelete={handleDeleteAnn}
                toggling={toggling}
                deleting={deleting}
              />
            ))}
          </div>
        )
      )}

      {showOppForm && (
        <Modal
          title={editingOpp ? 'Edit Opportunity' : 'Publish New Opportunity'}
          icon="work"
          onClose={() => {
            setShowOppForm(false);
            setEditingOpp(null);
          }}
        >
          <OpportunityForm
            initial={editingOpp}
            onClose={(saved) => {
              setShowOppForm(false);
              setEditingOpp(null);
              if (saved) load();
            }}
          />
        </Modal>
      )}

      {showAnnForm && (
        <Modal
          title={editingAnn ? 'Edit Announcement' : 'Broadcast Announcement'}
          icon="campaign"
          onClose={() => {
            setShowAnnForm(false);
            setEditingAnn(null);
          }}
        >
          <AnnouncementForm
            initial={editingAnn}
            onClose={(saved) => {
              setShowAnnForm(false);
              setEditingAnn(null);
              if (saved) load();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
