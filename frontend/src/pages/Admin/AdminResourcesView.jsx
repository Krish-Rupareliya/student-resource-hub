// src/pages/Admin/AdminResourcesView.jsx
// Manage all published resources: search, add (URL or file via Drive Proxy), edit, soft-delete.
// Signature Neo-Brutalist Yellow & Slate Theme.

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminResources, createResource, createResourceWithFile,
  updateResource, deleteResource, getAdminCatalog,
} from '../../services/admin/adminApi';

import { API_BASE_URL } from '../../lib/api';

const RESOURCE_TYPES = ['Notes', 'Previous Year Papers', 'Practical Files', 'Viva Questions', 'Question Bank', 'Syllabus', 'Other'];

const buildViewUrl = (id) => `${API_BASE_URL}/resources/${id}/view`;

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <div className="bg-white border-3 border-slate-900 rounded-3xl shadow-[6px_6px_0px_#0F172A] w-[95%] sm:w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-slate-900 bg-[#FFFBEB]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[24px]">folder_open</span>
            <h2 className="text-base sm:text-lg font-black text-slate-950">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function ResourceForm({ departments = [], semesters = [], subjects = [], onSubmit, onClose, initial }) {
  const [form, setForm] = useState({
    subjectId: initial?.subjectId ?? '',
    title: initial?.title ?? '',
    resourceType: initial?.resourceType ?? 'Notes',
    fileUrl: initial?.fileUrl ?? '',
    description: initial?.description ?? '',
    source: initial?.source ?? 'admin',
    uploadMode: 'url', // 'url' | 'file'
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize and sync department/semester based on selected subject
  useEffect(() => {
    if (form.subjectId && subjects.length > 0) {
      const s = subjects.find(sub => sub.id === form.subjectId);
      if (s) {
        setSearchQuery(`[${s.code}] ${s.title}`);
        
        const sem = semesters.find(se => se.id === s.semesterId);
        if (sem) {
          if (!selectedSemester) setSelectedSemester(sem.id);
          if (!selectedDepartment) setSelectedDepartment(sem.departmentId);
        }
      }
    }
  }, [form.subjectId, subjects, semesters]);

  const allowedSemesters = selectedDepartment 
    ? semesters.filter(s => s.departmentId === Number(selectedDepartment))
    : semesters;

  const allowedSubjects = subjects.filter(s => {
    if (selectedSemester) return s.semesterId === Number(selectedSemester);
    if (selectedDepartment) {
      const semIds = allowedSemesters.map(as => as.id);
      return semIds.includes(s.semesterId);
    }
    return true;
  });

  const cleanQuery = searchQuery.toLowerCase().replace(/[-\s_]/g, '');
  const filteredSubjects = allowedSubjects.filter((s) => {
    const qLower = searchQuery.toLowerCase();
    if (s.code.toLowerCase().includes(qLower) || s.code.toLowerCase().replace(/[-\s_]/g, '').includes(cleanQuery)) {
      return true;
    }
    if (s.title.toLowerCase().includes(qLower)) {
      return true;
    }
    if (s.shortForm) {
      const tokens = s.shortForm.split(/[,/|]/).map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (tokens.some((tok) => tok.includes(qLower) || tok.replace(/[-\s_]/g, '').includes(cleanQuery))) {
        return true;
      }
    }
    return false;
  });

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subjectId) {
      setErr('Please select a valid subject from the list.');
      return;
    }
    setErr('');
    setSaving(true);
    try {
      if (form.uploadMode === 'file' && file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('subjectId', form.subjectId);
        fd.append('title', form.title);
        fd.append('resourceType', form.resourceType);
        fd.append('description', form.description);
        fd.append('source', form.source);
        await createResourceWithFile(fd);
      } else {
        await onSubmit({ ...form });
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
        <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs font-bold text-rose-900">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Branch (Department)</label>
          <select 
            value={selectedDepartment} 
            onChange={(e) => { 
              setSelectedDepartment(e.target.value); 
              setSelectedSemester('');
              set('subjectId', ''); 
              setSearchQuery(''); 
            }}
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="">All Branches</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Semester</label>
          <select 
            value={selectedSemester} 
            onChange={(e) => { 
              setSelectedSemester(e.target.value); 
              set('subjectId', ''); 
              setSearchQuery(''); 
            }}
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="">All Semesters</option>
            {allowedSemesters.map((s) => (
              <option key={s.id} value={s.id}>
                {!selectedDepartment && `[${s.deptCode}] `}
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Subject <span className="text-rose-500">*</span></label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type subject name or code..."
            value={searchQuery}
            onChange={(e) => { 
              setSearchQuery(e.target.value); 
              setIsDropdownOpen(true);
              if (form.subjectId) set('subjectId', ''); 
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900"
          />
          {isDropdownOpen && (
            <div className="absolute z-20 w-full mt-1.5 bg-white border-2 border-slate-900 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => { 
                      set('subjectId', s.id); 
                      setSearchQuery(`[${s.code}] ${s.title}`); 
                      setIsDropdownOpen(false); 
                      
                      const sem = semesters.find(se => se.id === s.semesterId);
                      if (sem) {
                        setSelectedSemester(sem.id);
                        setSelectedDepartment(sem.departmentId);
                      }
                    }}
                    className="px-4 py-2.5 hover:bg-amber-50 cursor-pointer text-xs sm:text-sm border-b border-slate-100 last:border-0 transition-colors"
                  >
                    <span className="font-mono font-bold text-amber-600">[{s.code}]</span> <span className="font-semibold text-slate-900">{s.title}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-500 font-medium">No subjects found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Resource Title <span className="text-rose-500">*</span></label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          placeholder="e.g. Design & Analysis of Algorithms Unit 1 Complete Notes"
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Resource Type</label>
        <select
          value={form.resourceType}
          onChange={(e) => set('resourceType', e.target.value)}
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Description (Optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="Details about syllabus coverage, professor notes, or exam relevance..."
          className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900 resize-none"
        />
      </div>

      {!initial && (
        <div className="pt-1">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl mb-4 border border-slate-300">
            {['url', 'file'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set('uploadMode', m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  form.uploadMode === m ? 'bg-amber-400 text-slate-950 border border-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {m === 'url' ? 'Link URL' : 'Upload to Google Drive'}
              </button>
            ))}
          </div>

          {form.uploadMode === 'url' ? (
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">File / Document URL</label>
              <input
                value={form.fileUrl}
                onChange={(e) => set('fileUrl', e.target.value)}
                required={form.uploadMode === 'url'}
                placeholder="https://..."
                className="w-full border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 font-medium focus:outline-none focus:border-slate-900"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Select PDF or Document</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required={form.uploadMode === 'file'}
                className="w-full text-xs sm:text-sm text-slate-700 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-slate-900 file:bg-amber-400 file:text-slate-950 file:font-black file:text-xs cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
        <button
          type="button"
          onClick={() => onClose(false)}
          className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-950 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-500 shadow-[2px_2px_0px_#0F172A] disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving && <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
          <span>{initial ? 'Save Changes' : 'Publish Resource'}</span>
        </button>
      </div>
    </form>
  );
}

export default function AdminResourcesView() {
  const [resources, setResources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadSubjects = useCallback(async () => {
    try {
      const depts = await getAdminCatalog();
      const allDepts = [];
      const allSems = [];
      const allSubs = [];
      for (const d of depts) {
        allDepts.push({ id: d.id, code: d.code, name: d.name });
        for (const sem of d.semesters ?? []) {
          allSems.push({ id: sem.id, name: sem.name, semesterNumber: sem.semesterNumber, deptCode: d.code || d.name, departmentId: d.id });
          for (const sub of sem.subjects ?? []) {
            allSubs.push({ ...sub, semesterId: sem.id });
          }
        }
      }
      setDepartments(allDepts);
      setSemesters(allSems);
      setSubjects(allSubs);
    } catch { 
      setDepartments([]);
      setSemesters([]);
      setSubjects([]); 
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminResources({ search });
      setResources(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadSubjects(); }, [loadSubjects]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleCreate(form) {
    await createResource(form);
  }

  async function handleEdit(form) {
    await updateResource(editItem.id, {
      title:        form.title,
      resourceType: form.resourceType,
      description:  form.description,
      subjectId:    form.subjectId,
      source:       form.source,
      isActive:     true,
    });
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteResource(id);
      await load();
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border-2 border-slate-900 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#0F172A]">
            <span className="material-symbols-outlined text-[16px] text-amber-600">folder_special</span>
            <span>Study Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Resources Repository
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Search, edit, preview, and publish verified materials.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 bg-amber-400 text-slate-950 border-2 border-slate-900 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black hover:bg-amber-500 shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
          search
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, subject, or keywords..."
          className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 bg-white rounded-2xl text-xs sm:text-sm font-bold focus:outline-none focus:border-slate-900 shadow-2xs"
        />
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[2px_2px_0px_#0F172A]">
          <span className="material-symbols-outlined text-[20px] text-rose-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-white border-2 border-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && !error && (
        <div className="text-center py-16 sm:py-20 bg-white border-3 border-slate-900 rounded-3xl p-8 shadow-[4px_4px_0px_#0F172A]">
          <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">folder_off</span>
          <p className="font-black text-slate-900 text-base">No resources found</p>
          <p className="text-xs font-bold text-slate-500 mt-1">Try adjusting your search query or upload new materials.</p>
        </div>
      )}

      {!loading && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-[3px_3px_0px_#0F172A] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0F172A] ${r.isActive ? 'bg-amber-100 text-slate-950' : 'bg-slate-100 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-950 truncate text-sm sm:text-base">{r.title}</p>
                  <p className="text-xs text-slate-600 font-bold mt-0.5 flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 bg-amber-400 px-1.5 py-0.2 rounded border border-slate-900">{r.subject?.code || 'N/A'}</span>
                    <span>• {r.resourceType}</span>
                    <span>• {r.isActive ? <span className="text-emerald-700 font-bold">Active</span> : <span className="text-slate-400">Inactive</span>}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                {(r.fileUrl || r.driveFileId) && (
                  <a
                    href={buildViewUrl(r.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View file stream"
                    className="p-2 rounded-xl border-2 border-slate-900 bg-slate-50 hover:bg-amber-100 text-slate-900 transition-colors shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                )}
                <button
                  onClick={() => setEditItem(r)}
                  title="Edit details"
                  className="p-2 rounded-xl border-2 border-slate-900 bg-slate-50 hover:bg-amber-100 text-slate-900 transition-colors shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => setConfirmDelete({ id: r.id, title: r.title })}
                  disabled={deletingId === r.id}
                  title="Delete permanently"
                  className="p-2 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-40"
                >
                  {deletingId === r.id
                    ? <span className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin inline-block" />
                    : <span className="material-symbols-outlined text-[18px]">delete</span>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Add New Study Resource" onClose={(saved) => { setShowCreate(false); if (saved) load(); }}>
          <ResourceForm departments={departments} semesters={semesters} subjects={subjects} onSubmit={handleCreate} onClose={(saved) => { setShowCreate(false); if (saved) load(); }} />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Study Resource" onClose={(saved) => { setEditItem(null); if (saved) load(); }}>
          <ResourceForm departments={departments} semesters={semesters} subjects={subjects} onSubmit={handleEdit} initial={editItem} onClose={(saved) => { setEditItem(null); if (saved) load(); }} />
        </Modal>
      )}

      {/* ── Drive Delete Confirmation Modal ───────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
          <div className="bg-white border-3 border-slate-900 rounded-3xl shadow-[6px_6px_0px_#0F172A] w-[95%] sm:w-full sm:max-w-md overflow-hidden mx-auto">
            {/* Header */}
            <div className="bg-amber-400 border-b-2 border-slate-900 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-400 text-[22px]">warning</span>
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950 leading-tight">Permanent Removal</h2>
                <p className="text-xs font-bold text-slate-800">Database &amp; Drive Storage Purge</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                You are about to permanently remove this resource from the student hub:
              </p>
              <div className="bg-amber-50 border-2 border-slate-900 rounded-xl px-4 py-3 shadow-[2px_2px_0px_#0F172A]">
                <p className="font-black text-slate-950 text-xs sm:text-sm truncate">{confirmDelete.title}</p>
              </div>
              <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 flex gap-2.5">
                <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0 mt-0.5">cloud_off</span>
                <p className="text-xs text-rose-900 font-bold leading-relaxed">
                  <strong>Notice:</strong> This action permanently deletes file metadata from the database and deletes the file from connected Google Drive storage.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 border-2 border-slate-900 text-white text-xs sm:text-sm font-black hover:bg-rose-700 shadow-[2px_2px_0px_#0F172A] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {deletingId === confirmDelete.id ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                )}
                <span>{deletingId === confirmDelete.id ? 'Deleting…' : 'Delete File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
