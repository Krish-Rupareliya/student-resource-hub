// src/pages/Admin/AdminCatalogView.jsx
// Academic Catalog Manager — Departments > Semesters > Subjects
// Non-tech admins can create, edit, and delete branches/semesters/subjects in real-time.
import { useState, useEffect, useCallback } from 'react';
import {
  getAdminDepartments,
  createDepartment, updateDepartment, deleteDepartment,
  createSemester,  updateSemester,  deleteSemester, deleteSemesterCascade,
  createSubject,   updateSubject,   deleteSubject,
} from '../../services/admin/catalogApi';
import { bulkDeleteResources } from '../../services/admin/adminApi';

// ─── Toast notification (inline, no dependency) ──────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-sm animate-fade-in
        ${isError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}
    >
      <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
        {isError ? 'error' : 'check_circle'}
      </span>
      <p className="text-sm leading-relaxed flex-1">{toast.message}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────
function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-red-500 text-[28px]">warning</span>
          <h3 className="text-lg font-bold text-on-surface">Confirm Delete</h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Semester Cascade Delete Modal (Interactive Checklist) ────
const RESOURCE_TYPE_COLORS = {
  Notes:       'bg-blue-100 text-blue-700',
  PYQ:         'bg-purple-100 text-purple-700',
  Syllabus:    'bg-green-100 text-green-700',
  Book:        'bg-amber-100 text-amber-700',
  Assignment:  'bg-orange-100 text-orange-700',
  Practical:   'bg-cyan-100 text-cyan-700',
  Video:       'bg-rose-100 text-rose-700',
};
function ResourceTypePill({ type }) {
  const cls = RESOURCE_TYPE_COLORS[type] ?? 'bg-surface-container text-on-surface-variant';
  return (
    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cls}`}>
      {type}
    </span>
  );
}

function SemesterCascadeModal({ sem, resources, onBulkDelete, onCascadeDelete, onCancel }) {
  // resources = [{ id, title, resourceType, subjectTitle, subjectCode }]
  const [checked, setChecked]   = useState(() => new Set(resources.map(r => r.id)));
  const [deleting, setDeleting] = useState(null); // null | 'bulk' | 'cascade'

  const allSelected  = checked.size === resources.length && resources.length > 0;
  const noneSelected = checked.size === 0;

  const toggleAll = () =>
    setChecked(allSelected ? new Set() : new Set(resources.map(r => r.id)));

  const toggleOne = (id) =>
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  // Group resources by subject for the list display
  const grouped = resources.reduce((acc, r) => {
    const key = r.subjectTitle;
    if (!acc[key]) acc[key] = { code: r.subjectCode, items: [] };
    acc[key].items.push(r);
    return acc;
  }, {});

  const handleBulk = async () => {
    if (noneSelected || deleting) return;
    setDeleting('bulk');
    try {
      await onBulkDelete([...checked]);
    } finally {
      setDeleting(null);
    }
  };

  const handleCascade = async () => {
    if (deleting) return;
    setDeleting('cascade');
    try {
      await onCascadeDelete();
    } finally {
      setDeleting(null);
    }
  };

  const isDisabled = deleting !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg border border-red-200/40 overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 py-4 bg-red-500/10 border-b border-red-200/30 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600 text-[20px]">delete_sweep</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-on-surface">Manage Resources Before Deleting</h2>
            <p className="text-xs text-on-surface-variant truncate">{sem.name}</p>
          </div>
          <button
            onClick={onCancel}
            disabled={isDisabled}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition text-on-surface-variant disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ── Select-All bar ─────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-outline-variant/10 bg-surface-container/30 shrink-0">
          <button
            onClick={toggleAll}
            disabled={isDisabled}
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition shrink-0
              border-outline-variant/60 hover:border-primary/60
              disabled:opacity-40"
            aria-label={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected && (
              <span className="material-symbols-outlined text-[14px] text-primary">check</span>
            )}
            {!allSelected && checked.size > 0 && (
              <span className="w-2 h-0.5 bg-primary/70 rounded-full" />
            )}
          </button>
          <span className="text-xs text-on-surface-variant flex-1">
            <span className="font-semibold text-on-surface">{checked.size}</span> of {resources.length} selected
          </span>
          <button
            onClick={toggleAll}
            disabled={isDisabled}
            className="text-xs font-semibold text-primary hover:underline disabled:opacity-40"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* ── Scrollable resource checklist ───────────────────── */}
        <div className="overflow-y-auto flex-1 divide-y divide-outline-variant/10">
          {Object.entries(grouped).map(([subjectTitle, { code, items }]) => (
            <div key={subjectTitle}>
              {/* Subject sub-header */}
              <div className="sticky top-0 flex items-center gap-2 px-5 py-2 bg-surface-container/60 backdrop-blur-sm border-b border-outline-variant/10">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">book_2</span>
                <span className="text-xs font-bold text-on-surface">{subjectTitle}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">{code}</span>
                <span className="ml-auto text-[10px] text-on-surface-variant">{items.length} file{items.length !== 1 ? 's' : ''}</span>
              </div>
              {/* Resource rows */}
              {items.map(r => {
                const isChecked = checked.has(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => !isDisabled && toggleOne(r.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition group
                      ${ isChecked
                          ? 'bg-red-50/60 hover:bg-red-50'
                          : 'hover:bg-surface-container/40'
                      } disabled:cursor-not-allowed`}
                  >
                    {/* Checkbox */}
                    <span
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition
                        ${ isChecked
                            ? 'bg-red-500 border-red-500'
                            : 'border-outline-variant/60 group-hover:border-red-400/60'
                        }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-white text-[11px]">check</span>
                      )}
                    </span>
                    {/* Resource info */}
                    <ResourceTypePill type={r.resourceType} />
                    <span className={`text-xs flex-1 truncate ${ isChecked ? 'text-red-800 font-medium' : 'text-on-surface' }`}>
                      {r.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Warning (shown when something is checked) ───────── */}
        {checked.size > 0 && (
          <div className="flex gap-2 items-start mx-5 mt-4 mb-1 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl shrink-0">
            <span className="material-symbols-outlined text-red-500 text-[16px] mt-0.5 shrink-0">warning</span>
            <p className="text-[11px] text-red-700 leading-relaxed">
              <strong>Permanently deletes</strong> {checked.size} file{checked.size !== 1 ? 's' : ''} from the
              database and Google Drive. <strong>Cannot be undone.</strong>
            </p>
          </div>
        )}

        {/* ── Footer actions ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 px-5 py-4 border-t border-outline-variant/10 bg-surface-container/20 shrink-0">
          <button
            onClick={onCancel}
            disabled={isDisabled}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high disabled:opacity-50 transition"
          >
            Cancel
          </button>

          <div className="flex-1" />

          {/* Delete Selected */}
          <button
            onClick={handleBulk}
            disabled={noneSelected || isDisabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {deleting === 'bulk'
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</>
              : <><span className="material-symbols-outlined text-[15px]">delete</span>Delete Selected ({checked.size})</>}
          </button>

          {/* Delete Semester & All */}
          <button
            onClick={handleCascade}
            disabled={isDisabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-800 text-white hover:bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {deleting === 'cascade'
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</>
              : <><span className="material-symbols-outlined text-[15px]">delete_forever</span>Delete Semester &amp; All</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field Component ──────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition ${className}`}
    />
  );
}

function TextArea({ ...props }) {
  return (
    <textarea
      rows={3}
      {...props}
      className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition resize-none"
    />
  );
}

// ─── Department Modal ─────────────────────────────────────────
function DepartmentModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState({ code: initial?.code || '', name: initial?.name || '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Branch code is required (e.g. CE, ME)';
    if (!form.name.trim()) e.name = 'Branch name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={mode === 'create' ? 'Add New Branch' : 'Edit Branch'} icon="account_tree" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Branch Code" required error={errors.code}>
          <Input
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
            placeholder="e.g. CE, ME, EE, CIVIL"
            maxLength={20}
          />
          <p className="mt-1 text-xs text-on-surface-variant">Short code used as identifier. Will be auto-uppercased.</p>
        </Field>
        <Field label="Branch Name" required error={errors.name}>
          <Input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Computer Engineering"
          />
        </Field>
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{errors.submit}</p>}
        <ModalFooter saving={saving} onCancel={onClose} saveLabel={mode === 'create' ? 'Create Branch' : 'Save Changes'} />
      </form>
    </ModalShell>
  );
}

// ─── Semester Modal ───────────────────────────────────────────
function SemesterModal({ mode, initial, departmentName, onClose, onSave }) {
  const [form, setForm] = useState({
    semesterNumber: initial?.semesterNumber || '',
    name: initial?.name || '',
    description: initial?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.semesterNumber) errs.semesterNumber = 'Semester number is required';
    if (!form.name.trim()) errs.name = 'Semester name is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={mode === 'create' ? `Add Semester — ${departmentName}` : 'Edit Semester'} icon="calendar_month" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Semester No." required error={errors.semesterNumber}>
            <Input
              type="number" min={1} max={12}
              value={form.semesterNumber}
              onChange={e => setForm(f => ({ ...f, semesterNumber: e.target.value }))}
              placeholder="e.g. 3"
            />
          </Field>
          <Field label="Name" required error={errors.name}>
            <Input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Semester 3"
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Optional short description for students…"
          />
        </Field>
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{errors.submit}</p>}
        <ModalFooter saving={saving} onCancel={onClose} saveLabel={mode === 'create' ? 'Add Semester' : 'Save Changes'} />
      </form>
    </ModalShell>
  );
}

// ─── Icon Picker ──────────────────────────────────────────────
const ACADEMIC_ICONS = [
  'menu_book', 'code', 'science', 'calculate', 'language', 
  'architecture', 'biotech', 'laptop_mac', 'history_edu', 
  'psychology', 'gavel', 'art_track', 'engineering', 
  'business_center', 'memory', 'terminal', 'data_object',
  'functions', 'bar_chart', 'public'
];

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px] w-6 flex items-center justify-center">
            {value}
          </span>
          <span className="font-mono text-xs opacity-70">{value}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          expand_more
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl z-50 grid grid-cols-5 gap-2 w-64 animate-fade-in">
            {ACADEMIC_ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => { onChange(icon); setOpen(false); }}
                title={icon}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  value === icon 
                    ? 'bg-primary text-on-primary shadow-sm scale-110' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Color Picker ──────────────────────────────────────────────
const SUBJECT_COLORS = [
  { id: 'lime', label: 'Neon Lime', color: 'bg-[#c6f62b]', hex: '#c6f62b' },
  { id: 'emerald', label: 'Emerald', color: 'bg-emerald-400', hex: '#4ade80' },
  { id: 'sky', label: 'Sky Blue', color: 'bg-sky-400', hex: '#38bdf8' },
  { id: 'yellow', label: 'Canary Yellow', color: 'bg-yellow-400', hex: '#facc15' },
  { id: 'orange', label: 'Vivid Orange', color: 'bg-orange-400', hex: '#fb923c' },
  { id: 'purple', label: 'Purple', color: 'bg-purple-400', hex: '#c084fc' },
  { id: 'pink', label: 'Hot Pink', color: 'bg-pink-400', hex: '#f472b6' },
  { id: 'blue', label: 'Classic Blue', color: 'bg-blue-500', hex: '#3b82f6' },
  { id: 'green', label: 'Mint Green', color: 'bg-green-500', hex: '#22c55e' },
  { id: 'rose', label: 'Rose Pink', color: 'bg-rose-500', hex: '#f43f5e' },
  { id: 'cyan', label: 'Electric Cyan', color: 'bg-cyan-400', hex: '#22d3ee' },
];

function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const activeColor = SUBJECT_COLORS.find(c => c.id === value?.toLowerCase() || c.hex === value) || SUBJECT_COLORS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 transition"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-5 h-5 rounded-full border border-black/20 shadow-sm ${activeColor.color}`}
            style={{ backgroundColor: activeColor.hex }}
          />
          <span className="font-semibold text-xs capitalize text-on-surface">
            {activeColor.label || activeColor.id}
          </span>
        </div>
        <span
          className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 md:left-0 mt-2 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl z-50 flex flex-col gap-2 w-56 animate-fade-in">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Folder Theme Color
            </span>
            <div className="grid grid-cols-4 gap-2">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                  }}
                  title={c.label}
                  className={`w-9 h-9 rounded-full border border-black/15 shadow-sm flex items-center justify-center transition-all hover:scale-110 ${
                    value === c.id || value === c.hex ? 'ring-2 ring-offset-2 ring-primary scale-105' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {(value === c.id || value === c.hex) && (
                    <span className="material-symbols-outlined text-[14px] text-black drop-shadow">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Subject Modal ────────────────────────────────────────────
function SubjectModal({ mode, initial, semesterName, onClose, onSave }) {
  const [form, setForm] = useState({
    code: initial?.code || '',
    title: initial?.title || '',
    shortForm: initial?.shortForm || '',
    description: initial?.description || '',
    icon: initial?.icon || 'menu_book',
    pinColor: initial?.pinColor || 'blue',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.code.trim()) errs.code = 'Subject code is required (e.g. CE301)';
    if (!form.title.trim()) errs.title = 'Subject title is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title={mode === 'create' ? `Add Subject — ${semesterName}` : 'Edit Subject'} icon="book_2" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Subject Code" required error={errors.code}>
            <Input
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. CE301"
              maxLength={30}
            />
          </Field>
          <Field label="Icon">
            <IconPicker
              value={form.icon}
              onChange={(icon) => setForm(f => ({ ...f, icon }))}
            />
          </Field>
          <Field label="Folder Color">
            <ColorPicker
              value={form.pinColor}
              onChange={(pinColor) => setForm(f => ({ ...f, pinColor }))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Field label="Subject Title" required error={errors.title}>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Database Management System"
              />
            </Field>
          </div>
          <div>
            <Field label="Short Form / Alias">
              <Input
                value={form.shortForm}
                onChange={e => setForm(f => ({ ...f, shortForm: e.target.value.toUpperCase() }))}
                placeholder="e.g. DMS, OOCWU"
                maxLength={30}
              />
            </Field>
          </div>
        </div>

        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Brief description for students…"
          />
        </Field>
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{errors.submit}</p>}
        <ModalFooter saving={saving} onCancel={onClose} saveLabel={mode === 'create' ? 'Add Subject' : 'Save Changes'} />
      </form>
    </ModalShell>
  );
}

// ─── Shared Modal Shell ───────────────────────────────────────
function ModalShell({ title, icon, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 font-sans">
      <div className="bg-white border-3 border-slate-900 rounded-3xl shadow-[6px_6px_0px_#0F172A] w-[95%] sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-slate-900 bg-[#FFFBEB]">
          <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-slate-950 text-[22px]">{icon}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-950 flex-1">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ saving, onCancel, saveLabel }) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-end pt-3 border-t border-slate-200 mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-50 transition cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-amber-400 text-slate-950 border-2 border-slate-900 hover:bg-amber-500 shadow-[2px_2px_0px_#0F172A] disabled:opacity-60 transition flex items-center gap-2 cursor-pointer"
      >
        {saving && <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
        {saving ? 'Saving…' : saveLabel}
      </button>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
function Badge({ count, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
      {count} {label}
    </span>
  );
}

// ─── Main View ────────────────────────────────────────────────
export default function AdminCatalogView() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState({}); // { deptId: bool, semId: bool }
  const [toast, setToast]             = useState(null);
  const [confirm, setConfirm]         = useState(null);
  const [modal, setModal]             = useState(null);
  const [cascadeModal, setCascadeModal] = useState(null); // { sem, subjectCount, resourceCount }
  // modal = { type: 'dept'|'sem'|'subject', mode: 'create'|'edit', target: object }

  // ── Fetch ──────────────────────────────────────────────────
  const fetchDepts = useCallback(async () => {
    try {
      const data = await getAdminDepartments();
      setDepartments(data?.data ?? data ?? []);
    } catch (err) {
      showToast(err.message || 'Failed to load catalog', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepts(); }, [fetchDepts]);

  // ── Toast helpers ──────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Expand/Collapse ────────────────────────────────────────
  const toggleExpand = (key) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Department actions ─────────────────────────────────────
  const handleCreateDept = async (form) => {
    await createDepartment(form);
    showToast(`Branch "${form.name}" created successfully`);
    fetchDepts();
  };

  const handleUpdateDept = async (id, form) => {
    await updateDepartment(id, form);
    showToast('Branch updated successfully');
    fetchDepts();
  };

  const handleDeleteDept = (dept) => {
    setConfirm({
      message: `Delete branch "${dept.name}" (${dept.code})? This is permanent and only works if it has no semesters.`,
      onConfirm: async () => {
        try {
          await deleteDepartment(dept.id);
          showToast(`Branch "${dept.name}" deleted`);
          fetchDepts();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  // ── Semester actions ───────────────────────────────────────
  const handleCreateSem = async (dept, form) => {
    await createSemester({ ...form, departmentId: dept.id });
    showToast(`Semester ${form.semesterNumber} added to ${dept.name}`);
    setExpanded(prev => ({ ...prev, [`d-${dept.id}`]: true }));
    fetchDepts();
  };

  const handleUpdateSem = async (sem, form) => {
    await updateSemester(sem.id, form);
    showToast('Semester updated');
    fetchDepts();
  };

  const handleDeleteSem = (sem, deptName) => {
    // Flatten all resources across this semester's subjects for the checklist.
    const resources = sem.subjects?.flatMap(s =>
      (s.resources ?? []).map(r => ({
        ...r,
        subjectTitle: s.title,
        subjectCode:  s.code,
      }))
    ) ?? [];

    if (resources.length > 0) {
      // Open the interactive checklist modal.
      setCascadeModal({ sem, resources });
      return;
    }

    // No resources — use the simpler confirm dialog.
    setConfirm({
      message: `Delete "${sem.name}" from ${deptName}? This only works if the semester has no subjects.`,
      onConfirm: async () => {
        try {
          await deleteSemester(sem.id);
          showToast(`"${sem.name}" deleted`);
          fetchDepts();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  const handleBulkDelete = async (ids) => {
    const { sem } = cascadeModal;
    try {
      const result = await bulkDeleteResources(ids);
      showToast(`${result.deleted} resource(s) deleted from "${sem.name}"`);
      setCascadeModal(null);
      fetchDepts();
    } catch (err) {
      showToast(err.message || 'Bulk delete failed', 'error');
    }
  };

  const handleCascadeDeleteSem = async () => {
    if (!cascadeModal) return;
    const { sem } = cascadeModal;
    try {
      const result = await deleteSemesterCascade(sem.id);
      showToast(`"${sem.name}" and ${result.resourcesDeleted} resource(s) permanently deleted`);
      fetchDepts();
    } catch (err) {
      showToast(err.message || 'Cascade delete failed', 'error');
    } finally {
      setCascadeModal(null);
    }
  };

  // ── Subject actions ────────────────────────────────────────
  const handleCreateSubject = async (sem, dept, form) => {
    await createSubject({ ...form, semesterId: sem.id });
    showToast(`Subject "${form.title}" added`);
    setExpanded(prev => ({ ...prev, [`d-${dept.id}`]: true, [`s-${sem.id}`]: true }));
    fetchDepts();
  };

  const handleUpdateSubject = async (subject, form) => {
    await updateSubject(subject.id, form);
    showToast('Subject updated');
    fetchDepts();
  };

  const handleDeleteSubject = (subject) => {
    setConfirm({
      message: `Delete subject "${subject.title}" (${subject.code})? This only works if it has no resources.`,
      onConfirm: async () => {
        try {
          await deleteSubject(subject.id);
          showToast(`"${subject.title}" deleted`);
          fetchDepts();
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>Academic Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Academic Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Manage branches, semesters, and subjects in real-time.
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'dept', mode: 'create', target: null })}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 border-2 border-slate-900 font-black text-xs sm:text-sm hover:bg-amber-500 shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 sm:py-24">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && departments.length === 0 && (
        <div className="text-center py-20 bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_#0F172A]">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-slate-950 text-[36px]">account_tree</span>
          </div>
          <h3 className="text-lg font-black text-slate-950 mb-1">No branches yet</h3>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 font-medium">Start by creating your first department branch.</p>
          <button
            onClick={() => setModal({ type: 'dept', mode: 'create', target: null })}
            className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 font-black text-xs sm:text-sm hover:bg-amber-500 shadow-[2px_2px_0px_#0F172A] transition"
          >
            Add First Branch
          </button>
        </div>
      )}

      {/* Catalog Tree */}
      {!loading && departments.length > 0 && (
        <div className="space-y-4">
          {departments.map(dept => {
            const deptExpanded = expanded[`d-${dept.id}`] ?? true;
            return (
              <div key={dept.id} className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[3px_3px_0px_#0F172A]">
                {/* Department Row */}
                <div className="flex items-center gap-2 sm:gap-3 px-3 py-3 sm:px-5 sm:py-4 bg-[#FFFBEB] border-b-2 border-slate-900">
                  <button
                    onClick={() => toggleExpand(`d-${dept.id}`)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface-container transition shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200"
                      style={{ transform: deptExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      chevron_right
                    </span>
                  </button>
                  <span className="material-symbols-outlined text-primary text-[20px] sm:text-[22px] shrink-0">account_tree</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-base text-on-surface line-clamp-1">{dept.name}</span>
                      <span className="text-[10px] sm:text-xs font-mono font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{dept.code}</span>
                      <Badge count={dept._count?.semesters ?? dept.semesters?.length ?? 0} label="sems" />
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <ActionBtn icon="add" label="Add Semester" color="text-blue-600" onClick={() => setModal({ type: 'sem', mode: 'create', target: dept })} />
                    <ActionBtn icon="edit" label="Edit Branch" color="text-on-surface-variant" onClick={() => setModal({ type: 'dept', mode: 'edit', target: dept })} />
                    <ActionBtn icon="delete" label="Delete Branch" color="text-red-400" onClick={() => handleDeleteDept(dept)} />
                  </div>
                </div>

                {/* Semesters */}
                {deptExpanded && dept.semesters?.length > 0 && (
                  <div className="divide-y divide-outline-variant/10">
                    {dept.semesters.map(sem => {
                      const semExpanded = expanded[`s-${sem.id}`] ?? false;
                      return (
                        <div key={sem.id}>
                          {/* Semester Row */}
                          <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3 pl-6 sm:pl-10 bg-surface-container/30 hover:bg-surface-container/50 transition">
                            <button
                              onClick={() => toggleExpand(`s-${sem.id}`)}
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-surface-container transition shrink-0 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200"
                                style={{ transform: semExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                              >
                                chevron_right
                              </span>
                            </button>
                            <span className="material-symbols-outlined text-tertiary text-[16px] sm:text-[18px] shrink-0">calendar_month</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <span className="font-semibold text-on-surface text-xs sm:text-sm line-clamp-1">{sem.name}</span>
                                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-semibold shrink-0">Sem {sem.semesterNumber}</span>
                                <Badge count={sem._count?.subjects ?? sem.subjects?.length ?? 0} label="subjects" />
                                {/* Resource count badge — only shown when there are resources */}
                                {(() => {
                                  const rc = sem._count?.resources ??
                                    (sem.subjects?.reduce((a, s) => a + (s._count?.resources ?? 0), 0) ?? 0);
                                  return rc > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 shrink-0">
                                      <span className="material-symbols-outlined text-[12px]">folder</span>
                                      {rc} res
                                    </span>
                                  ) : null;
                                })()}
                              </div>
                              {sem.description && (
                                <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 truncate">{sem.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                              <ActionBtn icon="add" label="Add Subject" color="text-blue-600" onClick={() => setModal({ type: 'subject', mode: 'create', target: { sem, dept } })} />
                              <ActionBtn icon="edit" label="Edit Semester" color="text-on-surface-variant" onClick={() => setModal({ type: 'sem', mode: 'edit', target: { sem, dept } })} />
                              <ActionBtn icon="delete" label="Delete Semester" color="text-red-400" onClick={() => handleDeleteSem(sem, dept.name)} />
                            </div>
                          </div>

                          {/* Subjects */}
                          {semExpanded && sem.subjects?.length > 0 && (
                            <div className="divide-y divide-outline-variant/5">
                              {sem.subjects.map(subject => (
                                <div key={subject.id} className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-2.5 pl-8 sm:pl-16 hover:bg-surface-container/30 transition">
                                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-on-surface-variant shrink-0">
                                    {subject.icon || 'menu_book'}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                      <span className="font-medium text-on-surface text-xs sm:text-sm line-clamp-1">{subject.title}</span>
                                      <span className="text-[10px] sm:text-xs font-mono px-1 py-0.5 rounded bg-surface-container text-on-surface-variant shrink-0">{subject.code}</span>
                                      {subject.shortForm && (
                                        <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">{subject.shortForm}</span>
                                      )}
                                      {subject._count?.resources > 0 && (
                                        <Badge count={subject._count.resources} label="resources" />
                                      )}
                                    </div>
                                    {subject.description && (
                                      <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 truncate">{subject.description}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                                    <ActionBtn icon="edit" label="Edit Subject" color="text-on-surface-variant" onClick={() => setModal({ type: 'subject', mode: 'edit', target: { subject, sem, dept } })} />
                                    <ActionBtn icon="delete" label="Delete Subject" color="text-red-400" onClick={() => handleDeleteSubject(subject)} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Empty subjects state inside semester */}
                          {semExpanded && (!sem.subjects || sem.subjects.length === 0) && (
                            <div className="pl-16 py-3 text-xs text-on-surface-variant italic">
                              No subjects yet —{' '}
                              <button
                                className="text-primary font-semibold hover:underline"
                                onClick={() => setModal({ type: 'subject', mode: 'create', target: { sem, dept } })}
                              >
                                Add one
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty semesters state inside dept */}
                {deptExpanded && (!dept.semesters || dept.semesters.length === 0) && (
                  <div className="pl-12 py-4 text-sm text-on-surface-variant italic">
                    No semesters yet —{' '}
                    <button
                      className="text-primary font-semibold hover:underline"
                      onClick={() => setModal({ type: 'sem', mode: 'create', target: dept })}
                    >
                      Add first semester
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Modals ─────────────────────────────────────────── */}

      {/* ─── Cascade Semester Delete Modal ──────────────────── */}
      {cascadeModal && (
        <SemesterCascadeModal
          sem={cascadeModal.sem}
          resources={cascadeModal.resources}
          onBulkDelete={handleBulkDelete}
          onCascadeDelete={handleCascadeDeleteSem}
          onCancel={() => setCascadeModal(null)}
        />
      )}

      {modal?.type === 'dept' && modal.mode === 'create' && (
        <DepartmentModal
          mode="create"
          initial={null}
          onClose={() => setModal(null)}
          onSave={handleCreateDept}
        />
      )}

      {modal?.type === 'dept' && modal.mode === 'edit' && (
        <DepartmentModal
          mode="edit"
          initial={modal.target}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdateDept(modal.target.id, form)}
        />
      )}

      {modal?.type === 'sem' && modal.mode === 'create' && (
        <SemesterModal
          mode="create"
          initial={null}
          departmentName={modal.target?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleCreateSem(modal.target, form)}
        />
      )}

      {modal?.type === 'sem' && modal.mode === 'edit' && (
        <SemesterModal
          mode="edit"
          initial={modal.target?.sem}
          departmentName={modal.target?.dept?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdateSem(modal.target.sem, form)}
        />
      )}

      {modal?.type === 'subject' && modal.mode === 'create' && (
        <SubjectModal
          mode="create"
          initial={null}
          semesterName={modal.target?.sem?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleCreateSubject(modal.target.sem, modal.target.dept, form)}
        />
      )}

      {modal?.type === 'subject' && modal.mode === 'edit' && (
        <SubjectModal
          mode="edit"
          initial={modal.target?.subject}
          semesterName={modal.target?.sem?.name}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdateSubject(modal.target.subject, form)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirm}
        message={confirm?.message}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────
function ActionBtn({ icon, label, color, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition ${color}`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}
