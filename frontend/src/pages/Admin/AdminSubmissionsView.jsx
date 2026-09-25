// src/pages/Admin/AdminSubmissionsView.jsx
// Review pending resource uploads and requests: Approve, Reject, Edit, Preview.
// Signature Neo-Brutalist Yellow & Slate Theme with Bulk Actions.

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminUploads, reviewUpload,
  getAdminRequests, reviewRequest,
  getAdminCatalog,
  bulkReviewUploads,
} from '../../services/admin/adminApi';

const STATUS_TABS = ['PENDING', 'APPROVED', 'REJECTED'];

function UploadCard({ item, isSelected, onToggleSelect, onAction, departments, semesters, subjects }) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editable fields for approval
  const [title, setTitle] = useState(item.title);
  const [resourceType, setResourceType] = useState(item.resourceType);
  const [description, setDescription] = useState(item.description || '');
  const [subjectId, setSubjectId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Filter cascaded subjects
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');

  // Auto-match subject by code
  useEffect(() => {
    if (subjects.length > 0 && item.subjectCode) {
      const match = subjects.find(
        (s) => s.code.toLowerCase() === item.subjectCode.toLowerCase()
      );
      if (match) {
        setSubjectId(match.id);
        const sem = semesters.find((se) => se.id === match.semesterId);
        if (sem) {
          setSelectedSem(sem.id);
          setSelectedDept(sem.departmentId);
        }
      }
    }
  }, [subjects, semesters, item.subjectCode]);

  const filteredSubjects = subjects.filter((s) => {
    if (selectedSem) return s.semesterId === Number(selectedSem);
    if (selectedDept) {
      const semIds = semesters.filter((se) => se.departmentId === Number(selectedDept)).map((se) => se.id);
      return semIds.includes(s.semesterId);
    }
    return true;
  });

  async function handleApprove() {
    setLoading(true);
    try {
      await onAction(item.id, 'APPROVED', {
        title,
        resourceType,
        description,
        subjectId: subjectId || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      await onAction(item.id, 'REJECTED', { rejectionReason: rejectReason });
      setShowRejectBox(false);
    } finally {
      setLoading(false);
    }
  }

  const isPending = item.status === 'PENDING';

  return (
    <div
      className={`bg-white border-3 border-slate-900 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-[4px_4px_0px_#0F172A] transition-all ${
        isSelected ? 'ring-3 ring-amber-400 bg-amber-50/20' : ''
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isPending && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(item.id)}
                className="w-4 h-4 rounded border-2 border-slate-900 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
            )}
            <span className="text-xs font-mono font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_#0F172A]">
              [{item.subjectCode}]
            </span>
            <span className="text-xs text-slate-700 font-black">
              &bull; {item.resourceType}
            </span>
          </div>

          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-slate-900 ${
              item.status === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-950'
                : item.status === 'REJECTED'
                ? 'bg-rose-100 text-rose-950'
                : 'bg-amber-100 text-amber-950'
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Title */}
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm font-black border-2 border-slate-900 rounded-xl px-3 py-1.5 bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        ) : (
          <h3 className="font-black text-slate-950 text-base">{title}</h3>
        )}

        {/* Description */}
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full text-xs font-medium border-2 border-slate-900 rounded-xl px-3 py-1.5 bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        ) : description ? (
          <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">{description}</p>
        ) : null}

        {/* Subject dropdown if editing */}
        {isEditing && (
          <div className="p-3 bg-amber-50 rounded-xl space-y-2 border-2 border-slate-900">
            <p className="text-xs font-black text-slate-950">Target Catalog Subject:</p>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setSelectedSem(''); }}
                className="text-xs font-bold border-2 border-slate-900 rounded-lg p-1.5 bg-white"
              >
                <option value="">All Branches</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
                ))}
              </select>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="text-xs font-bold border-2 border-slate-900 rounded-lg p-1.5 bg-white"
              >
                <option value="">All Semesters</option>
                {semesters
                  .filter((s) => !selectedDept || s.departmentId === Number(selectedDept))
                  .map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </div>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full text-xs font-bold border-2 border-slate-900 rounded-lg p-1.5 bg-white"
            >
              <option value="">-- Select Subject ({filteredSubjects.length} found) --</option>
              {filteredSubjects.map((s) => (
                <option key={s.id} value={s.id}>[{s.code}] {s.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* File preview stream or URL */}
        <div className="flex items-center gap-2 text-xs pt-1">
          {item.webViewLink || item.fileUrl ? (
            <a
              href={item.webViewLink || item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-black text-slate-950 bg-amber-100 hover:bg-amber-200 border border-slate-900 px-2 py-0.5 rounded-lg transition"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Preview File</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          ) : (
            <span className="text-slate-400 font-medium">No attached preview link</span>
          )}
          <span className="text-slate-300 font-bold">&bull;</span>
          <span className="text-slate-500 font-mono text-[11px] font-bold">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      {isPending && (
        <div className="pt-3 border-t-2 border-slate-100 space-y-2">
          {showRejectBox ? (
            <div className="space-y-2">
              <input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (optional)..."
                className="w-full text-xs font-bold border-2 border-slate-900 rounded-xl px-3 py-2 bg-white text-slate-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-950 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white border-2 border-slate-900 text-xs font-black hover:bg-rose-700 shadow-[2px_2px_0px_#0F172A] disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 text-xs font-black text-slate-700 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">tune</span>
                <span>{isEditing ? 'Done Editing' : 'Edit Target'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  disabled={loading}
                  className="px-3.5 py-1.5 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 text-xs font-black shadow-[2px_2px_0px_#0F172A] transition cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 text-xs font-black hover:bg-amber-500 transition shadow-[2px_2px_0px_#0F172A] cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                  <span>Approve &amp; Publish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RequestCard({ item, onAction }) {
  const [loading, setLoading] = useState(false);
  const isPending = item.status === 'PENDING';

  async function handleAction(status) {
    setLoading(true);
    try {
      await onAction(item.id, status);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-[4px_4px_0px_#0F172A]">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-[1px_1px_0px_#0F172A]">
            [{item.subjectCode}]
          </span>
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-slate-900 ${
              item.status === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-950'
                : item.status === 'REJECTED'
                ? 'bg-rose-100 text-rose-950'
                : 'bg-amber-100 text-amber-950'
            }`}
          >
            {item.status}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-900 leading-snug">{item.description}</p>
        <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-amber-600">mail</span>
          <span>{item.email}</span>
        </p>
      </div>

      {isPending && (
        <div className="pt-3 border-t-2 border-slate-100 flex justify-end gap-2">
          <button
            onClick={() => handleAction('REJECTED')}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl border-2 border-slate-300 text-xs font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={() => handleAction('APPROVED')}
            disabled={loading}
            className="px-4 py-1.5 rounded-xl bg-amber-400 border-2 border-slate-900 text-slate-950 text-xs font-black hover:bg-amber-500 shadow-[2px_2px_0px_#0F172A] cursor-pointer"
          >
            Mark Fulfilled
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminSubmissionsView() {
  const [tab, setTab] = useState('uploads'); // 'uploads' | 'requests'
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [uploads, setUploads] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Multi-select bulk state
  const [selectedUploadIds, setSelectedUploadIds] = useState(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadCatalog = useCallback(async () => {
    try {
      const depts = await getAdminCatalog();
      const allDepts = [];
      const allSems = [];
      const allSubs = [];
      for (const d of depts) {
        allDepts.push({ id: d.id, code: d.code, name: d.name });
        for (const sem of d.semesters ?? []) {
          allSems.push({ id: sem.id, name: sem.name, semesterNumber: sem.semesterNumber, departmentId: d.id });
          for (const sub of sem.subjects ?? []) {
            allSubs.push({ ...sub, semesterId: sem.id });
          }
        }
      }
      setDepartments(allDepts);
      setSemesters(allSems);
      setSubjects(allSubs);
    } catch {
      // ignore
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setSelectedUploadIds(new Set());
    try {
      if (tab === 'uploads') {
        const data = await getAdminUploads(statusFilter);
        setUploads(Array.isArray(data) ? data : []);
      } else {
        const data = await getAdminRequests(statusFilter);
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tab, statusFilter]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUploadAction(id, action, payload = {}) {
    await reviewUpload(id, action, payload);
    await load();
  }

  async function handleRequestAction(id, action) {
    await reviewRequest(id, action);
    await load();
  }

  function toggleSelect(id) {
    setSelectedUploadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll() {
    if (selectedUploadIds.size === uploads.length) {
      setSelectedUploadIds(new Set());
    } else {
      setSelectedUploadIds(new Set(uploads.map((u) => u.id)));
    }
  }

  async function handleBulkAction(action) {
    if (selectedUploadIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to mark ${selectedUploadIds.size} uploads as ${action}?`)) return;
    setBulkBusy(true);
    try {
      await bulkReviewUploads(Array.from(selectedUploadIds), action);
      await load();
    } catch (err) {
      alert(err.message || 'Bulk review operation failed');
    } finally {
      setBulkBusy(false);
    }
  }

  const items = tab === 'uploads' ? uploads : requests;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border-2 border-slate-900 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#0F172A]">
          <span className="material-symbols-outlined text-[16px] text-amber-600">inbox</span>
          <span>Contribution Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">Submissions Review</h1>
        <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
          Review, categorize, and approve student resource contributions before publishing.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 bg-[#FFFBEB] p-2 rounded-2xl w-full sm:w-fit border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]">
        {[
          { key: 'uploads', icon: 'upload_file', label: 'Resource Uploads' },
          { key: 'requests', icon: 'help_outline', label: 'Resource Requests' },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setStatusFilter('PENDING'); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
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

      {/* Status filter bar & Bulk Action Bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-slate-950 text-amber-400 shadow-[2px_2px_0px_#0F172A]'
                  : 'bg-white text-slate-700 hover:bg-amber-50'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {tab === 'uploads' && statusFilter === 'PENDING' && uploads.length > 0 && (
            <div className="flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#0F172A]">
              <button
                onClick={handleSelectAll}
                className="text-xs font-black text-slate-950 hover:text-amber-600 cursor-pointer"
              >
                {selectedUploadIds.size === uploads.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedUploadIds.size > 0 && (
                <>
                  <span className="text-slate-300 font-bold">|</span>
                  <button
                    onClick={() => handleBulkAction('APPROVED')}
                    disabled={bulkBusy}
                    className="px-2.5 py-1 rounded-lg bg-emerald-400 border-2 border-slate-900 text-slate-950 font-black text-xs hover:bg-emerald-500 shadow-[1px_1px_0px_#0F172A] cursor-pointer disabled:opacity-50"
                  >
                    Approve ({selectedUploadIds.size})
                  </button>
                  <button
                    onClick={() => handleBulkAction('REJECTED')}
                    disabled={bulkBusy}
                    className="px-2.5 py-1 rounded-lg bg-rose-400 border-2 border-slate-900 text-slate-950 font-black text-xs hover:bg-rose-500 shadow-[1px_1px_0px_#0F172A] cursor-pointer disabled:opacity-50"
                  >
                    Reject ({selectedUploadIds.size})
                  </button>
                </>
              )}
            </div>
          )}

          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-white hover:bg-amber-50 border-2 border-slate-900 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_#0F172A]"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-[2px_2px_0px_#0F172A]">
          <span className="material-symbols-outlined text-[20px] text-rose-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 bg-white border-2 border-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-center py-16 sm:py-20 bg-white border-3 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_#0F172A]">
          <span className="material-symbols-outlined text-5xl sm:text-6xl text-slate-300 block mb-3">inbox</span>
          <p className="font-black text-slate-900 text-base">No {statusFilter.toLowerCase()} {tab} found</p>
          <p className="text-xs font-bold text-slate-500 mt-1">When students submit materials, they will appear here for review.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {tab === 'uploads'
            ? uploads.map((item) => (
                <UploadCard
                  key={item.id}
                  item={item}
                  isSelected={selectedUploadIds.has(item.id)}
                  onToggleSelect={toggleSelect}
                  onAction={handleUploadAction}
                  departments={departments}
                  semesters={semesters}
                  subjects={subjects}
                />
              ))
            : requests.map((item) => <RequestCard key={item.id} item={item} onAction={handleRequestAction} />)
          }
        </div>
      )}
    </div>
  );
}
