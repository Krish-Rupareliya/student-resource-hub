// src/pages/Admin/AdminPollsView.jsx
// Manage Campus Referendums & Polls: Create, edit, toggle active, sync vote counts,
// and broadcast directly to WhatsApp and Telegram groups.
// Signature Neo-Brutalist Amber & Slate Theme.

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAdminPolls,
  createAdminPoll,
  updateAdminPoll,
  toggleAdminPoll,
  syncAdminPollVotes,
  deleteAdminPoll,
} from '../../services/admin/adminApi';
import { getPublicHomepageSettings } from '../../services/settings/settingsApi';

const AVAILABLE_ICONS = [
  { value: 'description', label: 'Document / Paper' },
  { value: 'calculate', label: 'Math / Formulas' },
  { value: 'science', label: 'Science / Lab' },
  { value: 'schedule', label: 'Clock / Schedule' },
  { value: 'menu_book', label: 'Book / Notes' },
  { value: 'code', label: 'Coding / Tech' },
  { value: 'laptop', label: 'Computer / Digital' },
  { value: 'school', label: 'Graduation / Exam' },
  { value: 'quiz', label: 'Quiz / Test' },
  { value: 'forum', label: 'Discussion' },
];

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB';
const TELEGRAM_CHANNEL_LINK = 'https://t.me/+fP4hKU69AQIwZjI1';

function Modal({ title, icon = 'how_to_vote', onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-[6px_6px_0px_#0F172A] w-[95%] sm:w-full sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto border-3 border-slate-900 mx-auto">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b-2 border-slate-900 bg-[#FFFBEB]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-500 text-[26px]">{icon}</span>
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

function PollForm({ initial = null, onClose }) {
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    badgeLabel: initial?.badgeLabel || 'Campus Referendum Box',
    statusTopDemand: initial?.statusTopDemand || '',
    statusVaultDrop: initial?.statusVaultDrop || 'Friday @ 6 PM',
    statusResolved: initial?.statusResolved || '480+ Papers',
    isActive: initial ? initial.isActive : true,
    options: initial?.options?.length
      ? initial.options.map((o, idx) => ({
          id: o.id,
          text: o.text || '',
          icon: o.icon || 'description',
          votes: o.votes || 0,
          sortOrder: o.sortOrder ?? idx + 1,
        }))
      : [
          { text: 'Missing step-by-step solved PYQ papers', icon: 'description', votes: 0, sortOrder: 1 },
          { text: 'Complex numerical derivations & formulas', icon: 'calculate', votes: 0, sortOrder: 2 },
          { text: 'Viva questions & practical experiment files', icon: 'science', votes: 0, sortOrder: 3 },
          { text: 'Time management & sudden date changes', icon: 'schedule', votes: 0, sortOrder: 4 },
        ],
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleOptionChange = (idx, field, value) => {
    setForm((prev) => {
      const newOptions = [...prev.options];
      newOptions[idx] = { ...newOptions[idx], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    if (form.options.length >= 8) return;
    setForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { text: '', icon: 'description', votes: 0, sortOrder: prev.options.length + 1 },
      ],
    }));
  };

  const removeOption = (idx) => {
    if (form.options.length <= 2) return;
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr('Please provide a referendum question / title.');
      return;
    }
    const emptyOption = form.options.some((opt) => !opt.text.trim());
    if (emptyOption) {
      setErr('All poll options must have text.');
      return;
    }

    setSaving(true);
    setErr('');
    try {
      if (isEdit) {
        await updateAdminPoll(initial.id, form);
      } else {
        await createAdminPoll(form);
      }
      onClose(true);
    } catch (e) {
      setErr(e.message || 'Failed to save referendum.');
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
          Referendum Question / Title <span className="text-rose-500">*</span>
        </label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          placeholder="e.g. What is your biggest blocker for upcoming university exams?"
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Description / Subtitle</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
          placeholder="e.g. Vote to prioritize which solved papers and study notes the guild uploads next."
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Badge Title</label>
          <input
            value={form.badgeLabel}
            onChange={(e) => set('badgeLabel', e.target.value)}
            placeholder="Campus Referendum Box"
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Next Vault Drop Info</label>
          <input
            value={form.statusVaultDrop}
            onChange={(e) => set('statusVaultDrop', e.target.value)}
            placeholder="Friday @ 6 PM"
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Top Demand (Custom Override)</label>
          <input
            value={form.statusTopDemand}
            onChange={(e) => set('statusTopDemand', e.target.value)}
            placeholder="Leave empty for auto-calculated top option"
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Resolved Resources Count</label>
          <input
            value={form.statusResolved}
            onChange={(e) => set('statusResolved', e.target.value)}
            placeholder="480+ Papers"
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black uppercase text-slate-800">
            Voting Options ({form.options.length}/8) <span className="text-rose-500">*</span>
          </label>
          {form.options.length < 8 && (
            <button
              type="button"
              onClick={addOption}
              className="text-xs font-black text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Add Option
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {form.options.map((opt, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center gap-2 hover:border-slate-900 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-amber-400 border border-slate-900 text-[10px] font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>

              {/* Icon Selector */}
              <select
                value={opt.icon || 'description'}
                onChange={(e) => handleOptionChange(idx, 'icon', e.target.value)}
                className="border-2 border-slate-300 rounded-lg px-2 py-1 text-xs font-bold bg-white focus:border-slate-900 shrink-0"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic.value} value={ic.value}>
                    {ic.label}
                  </option>
                ))}
              </select>

              {/* Option Text */}
              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                placeholder={`Option ${idx + 1} text...`}
                required
                className="flex-1 border-2 border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold bg-white focus:border-slate-900"
              />

              {/* Initial Votes */}
              <div className="w-20 shrink-0 flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={opt.votes}
                  onChange={(e) => handleOptionChange(idx, 'votes', e.target.value)}
                  placeholder="Votes"
                  title="Initial Votes"
                  className="w-full border-2 border-slate-300 rounded-lg px-2 py-1 text-xs font-black text-center bg-white focus:border-slate-900"
                />
              </div>

              {form.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <label className="flex items-center gap-2 text-xs font-black text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
            className="w-4 h-4 rounded border-2 border-slate-900 accent-amber-400"
          />
          <span>Set as currently Active Public Referendum on Live Site</span>
        </label>
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
          {saving ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save Changes' : 'Create Referendum'}
        </button>
      </div>
    </form>
  );
}

function SyncVotesModal({ poll, onClose }) {
  const [optionVotes, setOptionVotes] = useState(
    poll.options.map((o) => ({ id: o.id, text: o.text, votes: o.votes || 0 }))
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleVoteChange = (id, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setOptionVotes((prev) => prev.map((o) => (o.id === id ? { ...o, votes: num } : o)));
  };

  const total = optionVotes.reduce((sum, o) => sum + (o.votes || 0), 0);

  async function handleSyncSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await syncAdminPollVotes(
        poll.id,
        optionVotes.map((o) => ({ id: o.id, votes: o.votes }))
      );
      onClose(true);
    } catch (e) {
      setErr(e.message || 'Failed to sync votes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSyncSubmit} className="space-y-4 font-sans">
      {err && (
        <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 text-xs font-bold">
          {err}
        </div>
      )}

      <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs font-medium text-amber-950">
        <p className="font-black text-amber-900 mb-0.5">WhatsApp &amp; Telegram Channel Vote Sync</p>
        <p>
          Input the live vote counts tallied from your WhatsApp/Telegram poll. The website will dynamically re-calculate
          percentages and display the top student demand.
        </p>
      </div>

      <div className="space-y-3">
        {optionVotes.map((opt, idx) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          return (
            <div key={opt.id} className="p-3 rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_#0F172A]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black text-slate-900">
                  {idx + 1}. {opt.text}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 border border-slate-900">
                  {pct}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={opt.votes}
                  onChange={(e) => handleVoteChange(opt.id, e.target.value)}
                  className="flex-1 accent-amber-500 cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  value={opt.votes}
                  onChange={(e) => handleVoteChange(opt.id, e.target.value)}
                  className="w-20 border-2 border-slate-900 rounded-lg px-2 py-1 text-xs font-black text-center bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs font-bold text-slate-700">
          Total Ballots Counted: <span className="font-black text-slate-950">{total} votes</span>
        </p>
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
          {saving ? 'Syncing…' : 'Save & Publish Sync'}
        </button>
      </div>
    </form>
  );
}

function BroadcastModal({ poll, onClose }) {
  const [copied, setCopied] = useState(false);
  const [communityLinks, setCommunityLinks] = useState({
    whatsapp: WHATSAPP_GROUP_LINK,
    telegram: TELEGRAM_CHANNEL_LINK,
  });

  useEffect(() => {
    let isMounted = true;
    getPublicHomepageSettings()
      .then((settings) => {
        if (isMounted && settings?.communityGroups) {
          const groups = settings.communityGroups;
          setCommunityLinks({
            whatsapp: groups.whatsappSem1_4 || groups.whatsappSem5_8 || WHATSAPP_GROUP_LINK,
            telegram: groups.telegramMain || TELEGRAM_CHANNEL_LINK,
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const websiteUrl = window.location.origin + '/community';

  const broadcastMessage = useMemo(() => {
    const optionsText = (poll.options || [])
      .map((opt, i) => `[${i + 1}] ${opt.text} (${opt.votes || 0} votes - ${opt.percentage || 0}%)`)
      .join('\n');

    return (
      `*CAMPUS REFERENDUM LIVE VOTE*\n\n` +
      `*${poll.title}*\n` +
      `${poll.description || ''}\n\n` +
      `Current Poll Standings:\n` +
      `${optionsText}\n\n` +
      `*Top Demand:* ${poll.statusTopDemand || 'Community PYQs'}\n` +
      `*Next Vault Drop:* ${poll.statusVaultDrop || 'Friday @ 6 PM'}\n\n` +
      `*Cast your vote on Campus Hub:* ${websiteUrl}\n\n` +
      `*WhatsApp Group:* ${communityLinks.whatsapp}\n` +
      `*Telegram Channel:* ${communityLinks.telegram}`
    );
  }, [poll, websiteUrl, communityLinks]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(broadcastMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(broadcastMessage)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 font-sans">
      <p className="text-xs text-slate-700 font-medium">
        Broadcast this live referendum directly to your student WhatsApp groups and Telegram channels with a single click.
      </p>

      {/* Message Preview Box */}
      <div className="relative p-4 rounded-2xl bg-[#0F172A] text-amber-300 font-mono text-xs border-2 border-slate-900 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
        {broadcastMessage}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? 'check_circle' : 'content_copy'}
          </span>
          {copied ? 'Copied to Clipboard!' : 'Copy Text'}
        </button>

        <button
          onClick={shareToWhatsApp}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-500 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          Send on WhatsApp
        </button>

        <button
          onClick={shareToTelegram}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-slate-900 bg-sky-400 hover:bg-sky-500 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          Send on Telegram
        </button>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200">
        <button
          onClick={onClose}
          className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function AdminPollsView() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [formModal, setFormModal] = useState({ open: false, initial: null });
  const [syncModal, setSyncModal] = useState({ open: false, poll: null });
  const [broadcastModal, setBroadcastModal] = useState({ open: false, poll: null });

  const loadPolls = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await getAdminPolls();
      setPolls(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Failed to fetch polls.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const handleToggle = async (id) => {
    try {
      await toggleAdminPoll(id);
      loadPolls();
    } catch (e) {
      alert(`Toggle failed: ${e.message}`);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete the referendum: "${title}"?`)) return;
    try {
      await deleteAdminPoll(id);
      loadPolls();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  // Metrics
  const activePoll = useMemo(() => polls.find((p) => p.isActive), [polls]);
  const totalVotesAcrossAll = useMemo(
    () => polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
    [polls]
  );

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-white border-3 border-slate-900 rounded-3xl shadow-[5px_5px_0px_#0F172A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-slate-900 animate-pulse" />
            <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
              Student Voice &amp; Demand Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Campus Referendums &amp; Polls
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
            Create live voting campaigns, sync counts with WhatsApp &amp; Telegram polls, and dynamically drive resource releases.
          </p>
        </div>

        <button
          onClick={() => setFormModal({ open: true, initial: null })}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-black border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Referendum</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FEF3D6] border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0F172A] flex items-center gap-3.5">
          <div className="w-11 h-11 bg-amber-400 border-2 border-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-slate-950 text-[24px]">how_to_vote</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-amber-800">Active Live Referendum</p>
            <p className="text-lg font-black text-slate-950 truncate">
              {activePoll ? activePoll.title.slice(0, 20) + '…' : 'None Active'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0F172A] flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-300 border-2 border-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-slate-950 text-[24px]">ballot</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-600">Total Ballots Cast</p>
            <p className="text-xl font-black text-slate-950">{totalVotesAcrossAll} Votes</p>
          </div>
        </div>

        <div className="p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0F172A] flex items-center gap-3.5">
          <div className="w-11 h-11 bg-sky-300 border-2 border-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-slate-950 text-[24px]">forum</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-600">Broadcast Channels</p>
            <p className="text-sm font-black text-slate-950">WhatsApp &amp; Telegram</p>
          </div>
        </div>

        <div className="p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0F172A] flex items-center gap-3.5">
          <div className="w-11 h-11 bg-violet-300 border-2 border-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-slate-950 text-[24px]">verified</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-600">Total Referendums</p>
            <p className="text-xl font-black text-slate-950">{polls.length} Total</p>
          </div>
        </div>
      </div>

      {/* Community Links Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-100 via-amber-50 to-emerald-50 border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_#0F172A] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[28px] text-amber-600">hub</span>
          <div>
            <p className="text-xs font-black text-slate-950">Official Broadcast &amp; Community Channels</p>
            <p className="text-[11px] font-bold text-slate-600">
              WhatsApp: {WHATSAPP_GROUP_LINK} | Telegram: {TELEGRAM_CHANNEL_LINK}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-500 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] flex items-center gap-1"
          >
            <span>WhatsApp Group ↗</span>
          </a>
          <a
            href={TELEGRAM_CHANNEL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-sky-400 hover:bg-sky-500 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] flex items-center gap-1"
          >
            <span>Telegram Channel ↗</span>
          </a>
        </div>
      </div>

      {/* Polls List */}
      {err && (
        <div className="p-4 bg-rose-50 border-3 border-slate-900 rounded-2xl text-rose-950 text-sm font-bold shadow-[3px_3px_0px_#0F172A]">
          {err}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center bg-white border-3 border-slate-900 rounded-3xl shadow-[4px_4px_0px_#0F172A]">
          <span className="material-symbols-outlined text-4xl text-amber-500 animate-spin">refresh</span>
          <p className="text-sm font-black text-slate-700 mt-2">Loading referendums…</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="p-12 text-center bg-white border-3 border-slate-900 rounded-3xl shadow-[4px_4px_0px_#0F172A]">
          <span className="material-symbols-outlined text-5xl text-slate-400">how_to_vote</span>
          <h3 className="text-lg font-black text-slate-900 mt-2">No Referendums Found</h3>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-sm mx-auto">
            Create your first campus referendum to allow students to vote on study resources, solved papers, and vault drops.
          </p>
          <button
            onClick={() => setFormModal({ open: true, initial: null })}
            className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 text-xs font-black border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#0F172A] hover:bg-amber-500"
          >
            + Create Referendum
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            const isLive = poll.isActive;
            return (
              <div
                key={poll.id}
                className={`p-5 sm:p-6 rounded-3xl border-3 border-slate-900 bg-white transition-all shadow-[5px_5px_0px_#0F172A] ${
                  isLive ? 'ring-2 ring-amber-400/80' : 'opacity-90'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b-2 border-slate-200">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border border-slate-900 ${
                          isLive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isLive ? '● LIVE ACTIVE POLL' : '○ INACTIVE / ARCHIVED'}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-900 border border-slate-900">
                        {poll.badgeLabel || 'Campus Referendum Box'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        Total Votes: <strong className="text-slate-900">{poll.totalVotes || 0}</strong>
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">{poll.title}</h3>
                    {poll.description && (
                      <p className="text-xs text-slate-600 font-medium">{poll.description}</p>
                    )}
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Broadcast Button */}
                    <button
                      onClick={() => setBroadcastModal({ open: true, poll })}
                      className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-amber-300 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">campaign</span>
                      Broadcast
                    </button>

                    {/* Sync Votes Button */}
                    <button
                      onClick={() => setSyncModal({ open: true, poll })}
                      className="px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-sky-200 hover:bg-sky-300 text-slate-950 text-xs font-black shadow-[2px_2px_0px_#0F172A] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                      Sync Votes
                    </button>

                    {/* Toggle Active Button */}
                    <button
                      onClick={() => handleToggle(poll.id)}
                      className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-black shadow-[2px_2px_0px_#0F172A] flex items-center gap-1 cursor-pointer ${
                        isLive
                          ? 'bg-amber-100 hover:bg-amber-200 text-slate-900'
                          : 'bg-emerald-300 hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isLive ? 'pause_circle' : 'play_circle'}
                      </span>
                      {isLive ? 'Set Inactive' : 'Activate Live'}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => setFormModal({ open: true, initial: poll })}
                      className="p-1.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_#0F172A] cursor-pointer"
                      title="Edit Referendum"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(poll.id, poll.title)}
                      className="p-1.5 rounded-xl border-2 border-slate-900 bg-rose-200 hover:bg-rose-300 text-rose-950 shadow-[2px_2px_0px_#0F172A] cursor-pointer"
                      title="Delete Referendum"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Option Bars breakdown */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(poll.options || []).map((opt) => (
                    <div
                      key={opt.id}
                      className="p-3 rounded-2xl border-2 border-slate-900 bg-[#FFFDF5] shadow-[2px_2px_0px_#0F172A] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">
                            {opt.icon || 'description'}
                          </span>
                          <span className="text-xs font-bold text-slate-950 truncate">{opt.text}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-950">{opt.percentage || 0}%</span>
                          <span className="text-[10px] font-bold text-slate-500 ml-1">({opt.votes || 0})</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 h-2.5 rounded-full border border-slate-900 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${opt.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer status indicators */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                  <span>
                    Top Demand: <strong className="text-slate-900">{poll.statusTopDemand || 'Auto Calculated'}</strong>
                  </span>
                  <span>
                    Vault Drop: <strong className="text-slate-900">{poll.statusVaultDrop || 'Not Set'}</strong>
                  </span>
                  <span>
                    Resolved Count: <strong className="text-slate-900">{poll.statusResolved || 'Not Set'}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {formModal.open && (
        <Modal
          title={formModal.initial ? 'Edit Campus Referendum' : 'Create New Campus Referendum'}
          icon="how_to_vote"
          onClose={(refreshed) => {
            setFormModal({ open: false, initial: null });
            if (refreshed) loadPolls();
          }}
        >
          <PollForm
            initial={formModal.initial}
            onClose={(refreshed) => {
              setFormModal({ open: false, initial: null });
              if (refreshed) loadPolls();
            }}
          />
        </Modal>
      )}

      {syncModal.open && syncModal.poll && (
        <Modal
          title={`Sync Live Votes: ${syncModal.poll.title.slice(0, 30)}…`}
          icon="sync_alt"
          onClose={(refreshed) => {
            setSyncModal({ open: false, poll: null });
            if (refreshed) loadPolls();
          }}
        >
          <SyncVotesModal
            poll={syncModal.poll}
            onClose={(refreshed) => {
              setSyncModal({ open: false, poll: null });
              if (refreshed) loadPolls();
            }}
          />
        </Modal>
      )}

      {broadcastModal.open && broadcastModal.poll && (
        <Modal
          title="Broadcast to WhatsApp & Telegram"
          icon="campaign"
          onClose={() => setBroadcastModal({ open: false, poll: null })}
        >
          <BroadcastModal
            poll={broadcastModal.poll}
            onClose={() => setBroadcastModal({ open: false, poll: null })}
          />
        </Modal>
      )}
    </div>
  );
}
