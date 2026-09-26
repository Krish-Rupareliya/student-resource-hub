// frontend/src/pages/Admin/AdminVivaView.jsx
// Comprehensive Admin Viva Question & Answer Management with Bulk Selection & Deletion
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  getAdminVivaQuestions,
  getAdminVivaQuestion,
  createAdminVivaQuestion,
  updateAdminVivaQuestion,
  deleteAdminVivaQuestion,
  bulkDeleteVivaQuestions,
  togglePublishVivaQuestion,
  bulkImportVivaQuestions,
  getSampleVivaJson,
} from '../../services/admin/adminApi';
import { getAdminDepartments } from '../../services/admin/catalogApi';

// ─── Toast Notification Component ─────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-sm animate-fade-in ${
        isError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'
      }`}
    >
      <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
        {isError ? 'error' : 'check_circle'}
      </span>
      <p className="text-sm leading-relaxed flex-1 font-medium">{toast.message}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

// ─── Generic Modal Wrapper ─────────────────────────────────────
function Modal({ title, onClose, maxWidth = 'max-w-3xl', children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[92vh] flex flex-col overflow-hidden border border-black/10`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70 shrink-0">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">quiz</span>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Simple Markdown Previewer Helper ──────────────────────────
function MarkdownPreview({ content }) {
  if (!content) {
    return <p className="text-gray-400 italic text-sm">Nothing to preview yet.</p>;
  }

  const lines = content.split('\n');
  const rendered = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = (key) => {
    if (tableRows.length === 0) return null;
    const header = tableRows[0];
    const bodyRows = tableRows.slice(2);
    const res = (
      <div key={key} className="overflow-x-auto my-3 border border-gray-300 rounded-xl">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-gray-100 font-bold border-b border-gray-300">
            <tr>
              {header.split('|').filter(c => c.trim()).map((cell, i) => (
                <th key={i} className="px-3 py-2 border-r last:border-r-0 border-gray-300">{cell.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50">
                {row.split('|').filter(c => c.trim()).map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-1.5 border-r last:border-r-0 border-gray-200">{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    return res;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        rendered.push(
          <pre key={`code-${i}`} className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs my-2 overflow-x-auto">
            {codeBuffer.join('\n')}
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      const tbl = flushTable(`table-${i}`);
      if (tbl) rendered.push(tbl);
    }

    if (line.startsWith('### ')) {
      rendered.push(<h4 key={i} className="text-sm font-bold text-gray-900 mt-3 mb-1">{line.replace('### ', '')}</h4>);
    } else if (line.startsWith('## ')) {
      rendered.push(<h3 key={i} className="text-base font-bold text-gray-900 mt-4 mb-1">{line.replace('## ', '')}</h3>);
    } else if (line.startsWith('# ')) {
      rendered.push(<h2 key={i} className="text-lg font-black text-gray-900 mt-4 mb-2">{line.replace('# ', '')}</h2>);
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      rendered.push(
        <li key={i} className="ml-5 list-disc text-sm text-gray-800 leading-relaxed">
          {line.replace(/^[-*]\s+/, '')}
        </li>
      );
    } else if (/^\d+\.\s/.test(line.trim())) {
      rendered.push(
        <li key={i} className="ml-5 list-decimal text-sm text-gray-800 leading-relaxed">
          {line.replace(/^\d+\.\s+/, '')}
        </li>
      );
    } else if (line.trim() === '') {
      rendered.push(<div key={i} className="h-2" />);
    } else {
      rendered.push(
        <p key={i} className="text-sm text-gray-800 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  if (inTable) {
    const tbl = flushTable('table-end');
    if (tbl) rendered.push(tbl);
  }

  return <div className="space-y-1.5 p-3 bg-white border border-gray-200 rounded-xl">{rendered}</div>;
}

// ─── Add / Edit Question Modal Form ────────────────────────────
function QuestionFormModal({
  initialData = null,
  departments = [],
  onClose,
  onSave,
}) {
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    subjectId: initialData?.subjectId || '',
    section: initialData?.section || 'Unit 1',
    category: initialData?.category || 'Theory Viva',
    difficulty: initialData?.difficulty || 'intermediate',
    questionNumber: initialData?.questionNumber || '',
    question: initialData?.question || '',
    shortAnswer: initialData?.shortAnswer || '',
    detailedAnswer: initialData?.detailedAnswer || '',
    quickRevision: initialData?.quickRevision || '',
    diagram: initialData?.diagram || '',
    imageUrl: initialData?.imageUrl || '',
    source: initialData?.source || 'Indus University Question Bank',
    isPublished: initialData?.isPublished ?? true,
    tagsText: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    followUpQuestions: Array.isArray(initialData?.followUpQuestions)
      ? initialData.followUpQuestions
      : [],
  });

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedSemId, setSelectedSemId] = useState('');
  const [editorTab, setEditorTab] = useState('write');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (form.subjectId && departments.length > 0) {
      for (const dept of departments) {
        for (const sem of dept.semesters || []) {
          const sub = (sem.subjects || []).find((s) => s.id === form.subjectId);
          if (sub) {
            setSelectedDeptId(dept.id);
            setSelectedSemId(sem.id);
            return;
          }
        }
      }
    }
  }, [form.subjectId, departments]);

  const activeDept = departments.find((d) => String(d.id) === String(selectedDeptId));
  const availableSemesters = activeDept?.semesters || [];
  const activeSem = availableSemesters.find((s) => String(s.id) === String(selectedSemId));
  const availableSubjects = activeSem?.subjects || [];

  const handleDeptChange = (deptId) => {
    setSelectedDeptId(deptId);
    setSelectedSemId('');
    setForm((f) => ({ ...f, subjectId: '' }));
  };

  const handleSemChange = (semId) => {
    setSelectedSemId(semId);
    setForm((f) => ({ ...f, subjectId: '' }));
  };

  const handleAddFollowUp = () => {
    setForm((f) => ({
      ...f,
      followUpQuestions: [...f.followUpQuestions, { question: '', answer: '' }],
    }));
  };

  const handleRemoveFollowUp = (index) => {
    setForm((f) => ({
      ...f,
      followUpQuestions: f.followUpQuestions.filter((_, i) => i !== index),
    }));
  };

  const handleFollowUpChange = (index, field, value) => {
    setForm((f) => {
      const updated = [...f.followUpQuestions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...f, followUpQuestions: updated };
    });
  };

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('detailed-answer-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.detailedAnswer;
    const selected = text.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;
    const nextVal = text.substring(0, start) + replacement + text.substring(end);
    setForm((f) => ({ ...f, detailedAnswer: nextVal }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleSubmit = async (e, publishStatus = null) => {
    e.preventDefault();
    setError('');

    if (!form.subjectId) {
      setError('Please select Department, Semester, and Subject.');
      return;
    }
    if (!form.question.trim()) {
      setError('Question text is required.');
      return;
    }
    if (!form.detailedAnswer.trim() && !form.shortAnswer.trim()) {
      setError('Please provide at least a Short Answer or a Detailed Answer.');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = form.tagsText
        ? form.tagsText.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        subjectId: form.subjectId,
        section: form.section.trim() || 'Unit 1',
        category: form.category,
        difficulty: form.difficulty,
        questionNumber: form.questionNumber.trim() || undefined,
        question: form.question.trim(),
        shortAnswer: form.shortAnswer.trim(),
        detailedAnswer: form.detailedAnswer.trim() || form.shortAnswer.trim(),
        quickRevision: form.quickRevision.trim() || undefined,
        diagram: form.diagram.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        source: form.source.trim() || undefined,
        tags: tagsArray,
        followUpQuestions: form.followUpQuestions.filter((q) => q.question && q.question.trim()),
        isPublished: publishStatus !== null ? publishStatus : form.isPublished,
      };

      await onSave(payload, initialData?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Viva Question' : 'Add New Viva Question'}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-semibold">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1. Academic Association */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-500">account_tree</span>
            Academic Association (Cascading)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
              <select
                value={selectedDeptId}
                onChange={(e) => handleDeptChange(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="">Select Department...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemId}
                onChange={(e) => handleSemChange(e.target.value)}
                disabled={!selectedDeptId}
                className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none disabled:bg-gray-100 disabled:opacity-60"
              >
                <option value="">Select Semester...</option>
                {availableSemesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    Semester {s.semesterNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject *</label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
                disabled={!selectedSemId}
                className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none disabled:bg-gray-100 disabled:opacity-60"
                required
              >
                <option value="">Select Subject...</option>
                {availableSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title ? `${sub.title} (${sub.code})` : sub.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Classification & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Unit / Chapter / Module / Section *
            </label>
            <input
              type="text"
              placeholder="e.g. Unit 1: Introduction, Unit 2, Practicals"
              value={form.section}
              onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
              className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="Theory Viva">Theory Viva</option>
              <option value="Practical Viva">Practical Viva</option>
              <option value="Experiment-wise Viva">Experiment-wise Viva</option>
            </select>
          </div>
        </div>

        {/* 3. Question Text */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Question *</label>
            <input
              type="text"
              placeholder="Q Number (e.g. Q.1)"
              value={form.questionNumber}
              onChange={(e) => setForm((f) => ({ ...f, questionNumber: e.target.value }))}
              className="w-28 text-xs bg-white border border-gray-300 rounded-lg px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <textarea
            rows={3}
            placeholder="e.g. What is the difference between TCP and UDP? Explain with connection characteristics."
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
            required
          />
        </div>

        {/* 4. Short Answer Punchline */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-500 text-sm">record_voice_over</span>
            Short Answer (Direct Viva Punchline — 10-Second Recall)
          </label>
          <textarea
            rows={2}
            placeholder="Concise direct answer the student should speak immediately to the examiner..."
            value={form.shortAnswer}
            onChange={(e) => setForm((f) => ({ ...f, shortAnswer: e.target.value }))}
            className="w-full text-xs sm:text-sm bg-amber-50/50 border border-amber-200 rounded-xl p-3 font-medium text-gray-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
          />
        </div>

        {/* 5. Detailed Technical Answer Editor */}
        <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-300 flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-700 mr-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-blue-600">psychology</span>
                Detailed Technical Answer
              </span>
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="px-2 py-1 text-xs font-bold bg-white hover:bg-gray-200 rounded border border-gray-300"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="px-2 py-1 text-xs italic font-bold bg-white hover:bg-gray-200 rounded border border-gray-300"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('### ')}
                className="px-2 py-1 text-xs font-bold bg-white hover:bg-gray-200 rounded border border-gray-300"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- ')}
                className="px-2 py-1 text-xs font-bold bg-white hover:bg-gray-200 rounded border border-gray-300"
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('```\n', '\n```')}
                className="px-2 py-1 text-xs font-mono font-bold bg-white hover:bg-gray-200 rounded border border-gray-300"
                title="Code Block"
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('| Feature | TCP | UDP |\n|---|---|---|\n| Connection | Connection-oriented | Connectionless |\n')}
                className="px-2 py-1 text-xs font-bold bg-white hover:bg-gray-200 rounded border border-gray-300"
                title="Insert Table"
              >
                Table
              </button>
            </div>

            <div className="flex items-center bg-gray-200 p-0.5 rounded-lg text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditorTab('write')}
                className={`px-3 py-1 rounded-md transition-all ${
                  editorTab === 'write' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('preview')}
                className={`px-3 py-1 rounded-md transition-all ${
                  editorTab === 'preview' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {editorTab === 'write' ? (
            <textarea
              id="detailed-answer-textarea"
              rows={6}
              placeholder="Full concept explanation with paragraphs, bullets, tables, or code..."
              value={form.detailedAnswer}
              onChange={(e) => setForm((f) => ({ ...f, detailedAnswer: e.target.value }))}
              className="w-full text-xs sm:text-sm p-3 font-mono focus:outline-none focus:ring-0 resize-y"
            />
          ) : (
            <div className="p-3 min-h-[144px] bg-gray-50/50">
              <MarkdownPreview content={form.detailedAnswer} />
            </div>
          )}
        </div>

        {/* 6. Blueprint Diagram & Image URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-purple-600">terminal</span>
              ASCII / Text Blueprint Diagram (Optional)
            </label>
            <textarea
              rows={3}
              placeholder={`[Client] ---> SYN ---> [Server]\n[Client] <--- SYN-ACK <--- [Server]\n[Client] ---> ACK ---> [Server]`}
              value={form.diagram}
              onChange={(e) => setForm((f) => ({ ...f, diagram: e.target.value }))}
              className="w-full text-xs font-mono bg-slate-900 text-emerald-400 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-purple-600">image</span>
              Image URL / Diagram Illustration (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/diagram.png"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none mb-2"
            />
            {form.imageUrl && (
              <div className="h-20 border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 7. Follow-up Viva Questions */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-sky-50/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-blue-600">help_center</span>
              Examiner Follow-up Questions & Counter-Questions ({form.followUpQuestions.length})
            </h3>
            <button
              type="button"
              onClick={handleAddFollowUp}
              className="px-2.5 py-1 bg-white hover:bg-sky-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Follow-up
            </button>
          </div>

          {form.followUpQuestions.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2">
              No follow-up questions added. Click above to add examiner counter-questions.
            </p>
          ) : (
            <div className="space-y-3">
              {form.followUpQuestions.map((fu, idx) => (
                <div key={idx} className="bg-white border border-sky-200 rounded-xl p-3 shadow-2xs relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveFollowUp(idx)}
                    className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-600 transition"
                    title="Remove follow-up"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                  <div className="grid grid-cols-1 gap-2 pr-6">
                    <input
                      type="text"
                      placeholder="Follow-up question (e.g. Why does TCP use 3-way handshake instead of 2?)"
                      value={fu.question}
                      onChange={(e) => handleFollowUpChange(idx, 'question', e.target.value)}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Examiner expected answer..."
                      value={fu.answer}
                      onChange={(e) => handleFollowUpChange(idx, 'answer', e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 8. Tags & Quick Takeaway */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Keywords / Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. TCP, UDP, Handshake, Transport Layer"
              value={form.tagsText}
              onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))}
              className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">1-Line Takeaway / Bolt Punchline</label>
            <input
              type="text"
              placeholder="e.g. TCP is reliable stream, UDP is best-effort datagram."
              value={form.quickRevision}
              onChange={(e) => setForm((f) => ({ ...f, quickRevision: e.target.value }))}
              className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="publishCheckbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
              className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400"
            />
            <label htmlFor="publishCheckbox" className="text-xs font-bold text-gray-800 cursor-pointer">
              Publish immediately (visible to students)
            </label>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition"
              disabled={saving}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-xs transition"
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditing ? 'Update Question' : 'Publish Question'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

// ─── Bulk JSON Import Modal ────────────────────────────────────
function BulkImportModal({
  departments = [],
  initialDeptId = '',
  initialSemId = '',
  initialSubjectId = '',
  onClose,
  onImportSuccess,
}) {
  // Flatten all subjects for direct 1-click selection and code lookup
  const allSubjects = useMemo(() => {
    const list = [];
    departments.forEach((dept) => {
      (dept.semesters || []).forEach((sem) => {
        (sem.subjects || []).forEach((sub) => {
          list.push({
            id: sub.id,
            code: sub.code,
            title: sub.title || sub.name || sub.code,
            deptId: dept.id,
            deptName: dept.name,
            deptCode: dept.code,
            semId: sem.id,
            semNumber: sem.semesterNumber,
          });
        });
      });
    });
    return list;
  }, [departments]);

  const [selectedDeptId, setSelectedDeptId] = useState(initialDeptId || '');
  const [selectedSemId, setSelectedSemId] = useState(initialSemId || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || '');
  const [defaultSection, setDefaultSection] = useState('Unit 1');
  const [detectedBadge, setDetectedBadge] = useState(null);

  const [jsonText, setJsonText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // If initialSubjectId was provided but not dept/sem, auto-link them
  useEffect(() => {
    if (initialSubjectId && allSubjects.length > 0 && (!selectedDeptId || !selectedSemId)) {
      const match = allSubjects.find((s) => String(s.id) === String(initialSubjectId));
      if (match) {
        setSelectedSubjectId(match.id);
        setSelectedDeptId(match.deptId);
        setSelectedSemId(match.semId);
      }
    }
  }, [initialSubjectId, allSubjects]);

  const activeDept = departments.find((d) => String(d.id) === String(selectedDeptId));
  const availableSemesters = activeDept?.semesters || [];
  const activeSem = availableSemesters.find((s) => String(s.id) === String(selectedSemId));
  const availableSubjects = activeSem?.subjects || [];

  const selectedSubjectObj = allSubjects.find((s) => String(s.id) === String(selectedSubjectId));

  // Quick Direct Subject Selector handler
  const handleQuickSubjectChange = (subjectId) => {
    setSelectedSubjectId(subjectId);
    if (!subjectId) return;
    const match = allSubjects.find((s) => String(s.id) === String(subjectId));
    if (match) {
      setSelectedDeptId(match.deptId);
      setSelectedSemId(match.semId);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target?.result || '');
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = async () => {
    try {
      const sample = await getSampleVivaJson();
      const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'viva_questions_template.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      const fallback = [
        {
          questionNumber: 'Q.1',
          section: 'Unit 1: Introduction',
          category: 'Theory Viva',
          difficulty: 'intermediate',
          question: 'What is the primary difference between TCP and UDP?',
          shortAnswer: 'TCP is connection-oriented and reliable with 3-way handshake; UDP is connectionless and lightweight.',
          detailedAnswer: 'TCP (Transmission Control Protocol) guarantees delivery using sequence numbers, ACKs, and retransmissions. UDP does not establish a connection, making it faster for streaming.',
          quickRevision: 'TCP = Reliable & Ordered; UDP = Fast & Datagram-oriented.',
          tags: ['TCP', 'UDP', 'Transport Layer'],
          followUpQuestions: [
            {
              question: 'Which header is larger, TCP or UDP?',
              answer: 'TCP header is 20-60 bytes; UDP header is fixed at 8 bytes.'
            }
          ],
          isPublished: true
        }
      ];
      const blob = new Blob([JSON.stringify(fallback, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'viva_questions_template.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const sanitizeAndParseJson = (text) => {
    if (!text || typeof text !== 'string') return null;
    let cleaned = text.trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (initialErr) {
      try {
        // Auto-heal invalid backslash escapes (e.g. \alpha, \approx, \times, \s, \0, paths)
        let fixed = cleaned.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
        // Auto-heal trailing commas before } or ]
        fixed = fixed.replace(/,\s*([\]}])/g, '$1');
        return JSON.parse(fixed);
      } catch (secondErr) {
        try {
          let third = cleaned
            .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\')
            .replace(/,\s*([\]}])/g, '$1')
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
              if (c === '\n') return '\\n';
              if (c === '\r') return '\\r';
              if (c === '\t') return '\\t';
              return '';
            });
          return JSON.parse(third);
        } catch {
          throw initialErr;
        }
      }
    }
  };

  const handleAutoFixJson = () => {
    if (!jsonText.trim()) return;
    try {
      const parsed = sanitizeAndParseJson(jsonText);
      if (parsed) {
        setJsonText(JSON.stringify(parsed, null, 2));
      }
    } catch {
      let fixed = jsonText
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\')
        .replace(/,\s*([\]}])/g, '$1');
      setJsonText(fixed);
    }
  };

  useEffect(() => {
    if (!jsonText.trim()) {
      setParsedQuestions([]);
      setValidationErrors([]);
      setDetectedBadge(null);
      return;
    }

    try {
      const raw = sanitizeAndParseJson(jsonText);
      let items = [];
      let detectedCode = raw.subjectCode || raw.subject || raw.courseCode || raw.course || null;

      if (Array.isArray(raw)) {
        items = raw;
      } else if (raw.questions && Array.isArray(raw.questions)) {
        items = raw.questions;
      } else if (raw.answers && Array.isArray(raw.answers)) {
        items = raw.answers;
      } else if (raw.data && Array.isArray(raw.data)) {
        items = raw.data;
      } else if (raw.items && Array.isArray(raw.items)) {
        items = raw.items;
      } else if (raw.results && Array.isArray(raw.results)) {
        items = raw.results;
      } else if (raw.list && Array.isArray(raw.list)) {
        items = raw.list;
      } else if (raw.qa && Array.isArray(raw.qa)) {
        items = raw.qa;
      } else if (raw.qna && Array.isArray(raw.qna)) {
        items = raw.qna;
      } else if (raw.questionBank && Array.isArray(raw.questionBank)) {
        items = raw.questionBank;
      } else if (raw.question_bank && Array.isArray(raw.question_bank)) {
        items = raw.question_bank;
      } else if (raw.units && Array.isArray(raw.units)) {
        // Hierarchical JSON grouped by units
        items = raw.units.flatMap((unit) => {
          const unitQuestions = Array.isArray(unit.questions) ? unit.questions : (Array.isArray(unit.answers) ? unit.answers : []);
          return unitQuestions.map((q) => ({
            ...q,
            unitId: q.unitId || unit.id || unit.unitId,
            section: q.section || unit.name || unit.title || unit.section,
          }));
        });
      } else if (raw.sections && Array.isArray(raw.sections)) {
        // Hierarchical JSON grouped by sections
        items = raw.sections.flatMap((sec) => {
          const secQuestions = Array.isArray(sec.questions) ? sec.questions : (Array.isArray(sec.answers) ? sec.answers : []);
          return secQuestions.map((q) => ({
            ...q,
            unitId: q.unitId || sec.id || sec.unitId,
            section: q.section || sec.name || sec.title || sec.section,
          }));
        });
      } else if (raw.syllabus && Array.isArray(raw.syllabus)) {
        // Hierarchical JSON grouped by syllabus modules
        items = raw.syllabus.flatMap((s) => {
          const sQuestions = Array.isArray(s.questions) ? s.questions : (Array.isArray(s.answers) ? s.answers : []);
          return sQuestions.map((q) => ({
            ...q,
            unitId: q.unitId || s.id || s.unitId,
            section: q.section || s.name || s.title || s.section,
          }));
        });
      } else if (raw.question && (raw.answer || raw.detailedAnswer || raw.shortAnswer)) {
        // Single question object
        items = [raw];
      } else if (Array.isArray(raw.segments) || Array.isArray(raw.tokens) || Array.isArray(raw.words)) {
        // Reconstruct from tokenized PDF converter output (e.g. segments array)
        const tokenList = raw.segments || raw.tokens || raw.words;
        const fullText = tokenList.join(' ');
        const qRegex = /(?:Q\s*([0-9]+)\.|\bQ\.([0-9]+)\b)\s*(.*?)(?=(?:Q\s*[0-9]+\.|\bQ\.[0-9]+\b|$))/gis;
        let m;
        while ((m = qRegex.exec(fullText)) !== null) {
          const qNum = m[1] || m[2];
          const content = m[3].trim();
          const periodIdx = content.indexOf('. ');
          const qMarkIdx = content.indexOf('?');
          let splitIdx = -1;
          if (qMarkIdx !== -1 && (periodIdx === -1 || qMarkIdx < periodIdx + 40)) {
            splitIdx = qMarkIdx + 1;
          } else if (periodIdx !== -1) {
            splitIdx = periodIdx + 1;
          }

          if (splitIdx > 10) {
            items.push({
              questionNumber: 'Q.' + qNum,
              question: content.slice(0, splitIdx).trim(),
              answer: content.slice(splitIdx).trim(),
              section: defaultSection || 'Unit 1: Theory',
            });
          } else {
            items.push({
              questionNumber: 'Q.' + qNum,
              question: content.slice(0, 120).trim(),
              answer: content.slice(120).trim() || content.trim(),
              section: defaultSection || 'Unit 1: Theory',
            });
          }
        }
      } else {
        setValidationErrors(['JSON format not recognized. Supported formats: array of questions, or object containing "questions", "answers", "units", "sections", "data", "items", or "segments".']);
        setParsedQuestions([]);
        return;
      }

      // Check if individual items have subject code
      if (!detectedCode && items.length > 0) {
        const itemWithCode = items.find((it) => it.subjectCode || it.courseCode || it.subject);
        if (itemWithCode) {
          detectedCode = itemWithCode.subjectCode || itemWithCode.courseCode || itemWithCode.subject;
        }
      }

      // Automatic subject keyword detection if no code was given
      if (!detectedCode) {
        const contentSample = (JSON.stringify(raw).slice(0, 3000) + ' ' + (items[0]?.question || '')).toLowerCase();
        if (contentSample.includes('8086') || contentSample.includes('microprocessor') || contentSample.includes('biu') || contentSample.includes('8085')) {
          detectedCode = 'CE0517';
        } else if (contentSample.includes('computer network') || contentSample.includes('ce0518') || contentSample.includes('osi') || contentSample.includes('tcp/ip')) {
          detectedCode = 'CE0518';
        } else if (contentSample.includes('web tech') || contentSample.includes('ce0522') || contentSample.includes('javascript') || contentSample.includes('css')) {
          detectedCode = 'CE0522';
        }
      }

      // If detected code and not already explicitly selected by user or matches subject
      if (detectedCode && allSubjects.length > 0) {
        const matched = allSubjects.find(
          (s) => s.code.toUpperCase() === String(detectedCode).trim().toUpperCase() ||
                 s.title.toLowerCase() === String(detectedCode).trim().toLowerCase()
        );
        if (matched) {
          setSelectedSubjectId(matched.id);
          setSelectedDeptId(matched.deptId);
          setSelectedSemId(matched.semId);
          setDetectedBadge(`${matched.code} — ${matched.title} (Sem ${matched.semNumber})`);
        }
      }

      const errors = [];
      const validated = items.map((item, idx) => {
        const itemErrors = [];

        // Flexible question extraction
        const questionText = item.question || item.q || item.questionText || item.problem || item.title;
        // Flexible answer extraction
        const answerText = item.detailedAnswer || item.detailed_answer || item.answer || item.ans || item.explanation || item.solution || item.shortAnswer || item.short_answer;

        if (!questionText || !String(questionText).trim()) {
          itemErrors.push('Missing question text');
        }
        if (!answerText || !String(answerText).trim()) {
          itemErrors.push('Missing answer (answer or detailedAnswer required)');
        }

        if (itemErrors.length > 0) {
          errors.push(`Item #${idx + 1}: ${itemErrors.join(', ')}`);
        }

        const qNum = item.questionNumber || (item.question_no ? `Q.${item.question_no}` : (item.qNo ? `Q.${item.qNo}` : null));
        const diagramContent = item.diagram || item.diagram_or_format || '';

        return {
          ...item,
          questionNumber: qNum,
          question: questionText ? String(questionText).trim() : '',
          detailedAnswer: answerText ? String(answerText).trim() : '',
          shortAnswer: item.shortAnswer || item.short_answer || (typeof item.answer === 'string' && item.answer.length < 200 ? item.answer : ''),
          diagram: diagramContent,
          section: item.section || item.unit || item.unitName || item.unitTitle || defaultSection,
          difficulty: item.difficulty || item.level || 'intermediate',
          category: item.category || item.type || 'Theory Viva',
          isValid: itemErrors.length === 0,
          errors: itemErrors,
        };
      });

      setValidationErrors(errors);
      setParsedQuestions(validated);
    } catch (parseErr) {
      setValidationErrors([`JSON Syntax Error: ${parseErr.message}`]);
      setParsedQuestions([]);
    }
  }, [jsonText, allSubjects, defaultSection]);

  const handleConfirmImport = async () => {
    if (!selectedSubjectId) {
      alert('Please select a target Subject for the imported questions.');
      return;
    }
    const validQuestions = parsedQuestions.filter((q) => q.isValid);
    if (validQuestions.length === 0) {
      alert('No valid questions to import.');
      return;
    }

    setImporting(true);
    try {
      const payload = {
        subjectId: selectedSubjectId,
        subjectCode: selectedSubjectObj?.code,
        defaultSection: defaultSection.trim() || 'Unit 1',
        questions: validQuestions.map((q) => ({
          unitId: q.unitId,
          section: q.section || defaultSection.trim() || 'Unit 1',
          category: q.category || 'Theory Viva',
          difficulty: q.difficulty || 'intermediate',
          questionNumber: q.questionNumber,
          question: q.question,
          shortAnswer: q.shortAnswer || '',
          detailedAnswer: q.detailedAnswer || q.shortAnswer || '',
          quickRevision: q.quickRevision || q.summary || '',
          diagram: q.diagram || '',
          imageUrl: q.imageUrl || q.image || '',
          source: q.source || 'Bulk JSON Import',
          tags: Array.isArray(q.tags) ? q.tags : (q.tags ? [q.tags] : []),
          followUpQuestions: Array.isArray(q.followUpQuestions) ? q.followUpQuestions : [],
          isPublished: q.isPublished ?? true,
        })),
      };

      const result = await bulkImportVivaQuestions(payload);
      setImportResult(result);
      if (onImportSuccess) {
        onImportSuccess(result, selectedSubjectId, selectedDeptId, selectedSemId);
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleFinishAndClose = () => {
    if (onImportSuccess) {
      onImportSuccess(importResult, selectedSubjectId, selectedDeptId, selectedSemId);
    }
    onClose();
  };

  return (
    <Modal title="Bulk Import Viva Questions via JSON" onClose={onClose} maxWidth="max-w-4xl">
      {importResult ? (
        <div className="space-y-6 text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="text-xl font-black text-gray-900">Bulk Import Complete!</h3>
          <p className="text-sm text-gray-600">
            Target Subject: <strong className="text-gray-900">{selectedSubjectObj ? `${selectedSubjectObj.code} - ${selectedSubjectObj.title}` : 'Selected Subject'}</strong>
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-2xl font-black text-green-700">
                {importResult.successCount ?? importResult.insertedCount ?? importResult.importedCount ?? 0}
              </p>
              <p className="text-xs font-bold text-green-900 mt-1">Successfully Added</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-2xl font-black text-amber-700">
                {importResult.skippedCount ?? importResult.skippedDuplicates ?? 0}
              </p>
              <p className="text-xs font-bold text-amber-900 mt-1">Duplicates Skipped</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <p className="text-2xl font-black text-gray-700">
                {importResult.errors?.length ?? importResult.errorCount ?? 0}
              </p>
              <p className="text-xs font-bold text-gray-900 mt-1">Errors</p>
            </div>
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="max-w-md mx-auto text-left bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
              <div className="font-bold mb-1">Import Warnings / Errors:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {importResult.errors.slice(0, 5).map((e, idx) => (
                  <li key={idx}>Item #{e.index}: {e.error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleFinishAndClose}
            className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-xs transition"
          >
            Done & View Questions
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-amber-500">target</span>
                Target Course & Unit for Questions
              </h3>
              {detectedBadge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 border border-green-200 animate-fade-in">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  Auto-detected: {detectedBadge}
                </span>
              )}
            </div>

            {/* Quick 1-Click Direct Subject Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Quick Select Subject (All Subjects) *</span>
                {selectedSubjectObj && (
                  <span className="text-[11px] font-semibold text-amber-700">
                    Selected: {selectedSubjectObj.code} — Sem {selectedSubjectObj.semNumber} ({selectedSubjectObj.deptCode})
                  </span>
                )}
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => handleQuickSubjectChange(e.target.value)}
                className="w-full text-xs bg-white border border-amber-300 focus:border-amber-500 rounded-xl px-3 py-2 font-semibold text-gray-900 shadow-2xs"
              >
                <option value="">— Select Target Subject Directly —</option>
                {allSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.title} (Sem {sub.semNumber}, {sub.deptCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Or Cascading Dropdowns */}
            <div className="pt-2 border-t border-gray-200/80">
              <div className="text-[11px] font-semibold text-gray-500 mb-2">Or Filter by Department / Semester:</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => {
                      setSelectedDeptId(e.target.value);
                      setSelectedSemId('');
                      setSelectedSubjectId('');
                    }}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-medium"
                  >
                    <option value="">All Departments...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
                  <select
                    value={selectedSemId}
                    onChange={(e) => {
                      setSelectedSemId(e.target.value);
                      setSelectedSubjectId('');
                    }}
                    disabled={!selectedDeptId}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-medium disabled:opacity-50"
                  >
                    <option value="">All Semesters...</option>
                    {availableSemesters.map((s) => (
                      <option key={s.id} value={s.id}>Semester {s.semesterNumber}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Filtered Subject</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    disabled={!selectedSemId}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-medium disabled:opacity-50"
                  >
                    <option value="">Select Subject...</option>
                    {availableSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title ? `${sub.title} (${sub.code})` : sub.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Default Unit / Section</label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 1"
                    value={defaultSection}
                    onChange={(e) => setDefaultSection(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black cursor-pointer flex items-center gap-1.5 transition shadow-xs">
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Select & Upload .JSON File</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 transition"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download Sample JSON Template
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Paste or Edit JSON Data</label>
              <button
                type="button"
                onClick={handleAutoFixJson}
                title="Automatically fix bad backslash escapes (\alpha, \approx, \path) and trailing commas"
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-600">auto_fix_high</span>
                <span>Auto-Fix Bad Escapes & Format</span>
              </button>
            </div>
            <textarea
              rows={6}
              placeholder="Paste JSON array here or upload file..."
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Validation Issues ({validationErrors.length})
                </div>
                <button
                  type="button"
                  onClick={handleAutoFixJson}
                  className="px-2.5 py-1 rounded-lg bg-red-200/80 hover:bg-red-200 text-red-950 font-bold text-[11px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  <span>Click to Auto-Fix JSON Escapes & Commas</span>
                </button>
              </div>
              <ul className="list-disc pl-5 max-h-24 overflow-y-auto">
                {validationErrors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {validationErrors.length > 5 && <li>...and {validationErrors.length - 5} more</li>}
              </ul>
            </div>
          )}

          {parsedQuestions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-700">
                  Preview Questions ({parsedQuestions.length} detected, {parsedQuestions.filter(q => q.isValid).length} ready to import)
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-gray-600 font-bold sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Question</th>
                      <th className="px-3 py-2 text-left">Unit / Section</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {parsedQuestions.map((q, idx) => (
                      <tr key={idx} className={q.isValid ? 'hover:bg-gray-50' : 'bg-red-50/50'}>
                        <td className="px-3 py-1.5 font-mono text-gray-500">{idx + 1}</td>
                        <td className="px-3 py-1.5">
                          {q.isValid ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                              Valid
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                              Invalid
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 font-semibold text-gray-900 truncate max-w-xs">{q.question || '—'}</td>
                        <td className="px-3 py-1.5 text-gray-600 truncate">{q.section || defaultSection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
            <div className="text-xs text-gray-500">
              {selectedSubjectObj ? (
                <span className="text-green-700 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Ready to import to {selectedSubjectObj.code}
                </span>
              ) : (
                <span className="text-amber-700 font-medium">Please select a subject above to proceed</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                disabled={importing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={importing || parsedQuestions.filter(q => q.isValid).length === 0 || !selectedSubjectId}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-xs transition disabled:opacity-50"
              >
                {importing ? 'Importing...' : `Import ${parsedQuestions.filter(q => q.isValid).length} Questions`}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Single Delete Confirmation Dialog ─────────────────────────
function DeleteConfirmModal({ question, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(question.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-red-200">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[26px]">delete</span>
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">Delete Viva Question?</h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Are you sure you want to permanently delete this viva question? This action cannot be undone.
        </p>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-xs text-gray-800 font-semibold italic">
          "{question?.question}"
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Delete Confirmation Dialog ───────────────────────────
function BulkDeleteConfirmModal({
  count,
  isAllMatching = false,
  totalPages = 1,
  selectedQuestions = [],
  onClose,
  onConfirm,
}) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-red-200">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[28px]">delete_sweep</span>
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">
          {isAllMatching ? `Delete ALL ${count} Viva Questions?` : `Delete ${count} Viva Questions?`}
        </h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          {isAllMatching ? (
            <>
              Are you sure you want to permanently delete <strong>ALL {count} questions</strong> across all{' '}
              <strong>{totalPages || 1} pages</strong> matching your active filters? This action cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to permanently delete these <strong>{count}</strong> selected viva questions? This action cannot be undone.
            </>
          )}
        </p>

        {!isAllMatching && selectedQuestions.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-2.5 max-h-36 overflow-y-auto mb-6 bg-gray-50 text-xs space-y-1.5">
            {selectedQuestions.slice(0, 5).map((q) => (
              <p key={q.id} className="text-gray-800 font-medium truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="truncate">{q.question}</span>
              </p>
            ))}
            {selectedQuestions.length > 5 && (
              <p className="text-[11px] text-gray-500 font-bold pl-3 italic">
                ...and {selectedQuestions.length - 5} more questions
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : isAllMatching ? `Confirm Delete All (${count})` : `Confirm Delete (${count})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Viva View Component ────────────────────────────
export default function AdminVivaView() {
  const [questions, setQuestions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllMatching, setSelectAllMatching] = useState(false);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedSemId, setSelectedSemId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPublishStatus, setSelectedPublishStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Header checkbox ref for indeterminate state
  const headerCheckboxRef = useRef(null);

  // Load catalog (departments, semesters, subjects)
  useEffect(() => {
    async function loadCatalog() {
      try {
        const depts = await getAdminDepartments();
        setDepartments(depts || []);
      } catch (err) {
        console.error('Failed to load departments catalog:', err);
      }
    }
    loadCatalog();
  }, []);

  const allSubjects = useMemo(() => {
    return departments.flatMap((d) =>
      (d.semesters || []).flatMap((s) =>
        (s.subjects || []).map((sub) => ({
          ...sub,
          deptId: d.id,
          deptCode: d.code,
          deptName: d.name,
          semId: s.id,
          semNumber: s.semesterNumber,
        }))
      )
    );
  }, [departments]);

  const activeDept = departments.find((d) => String(d.id) === String(selectedDeptId));
  const availableSemesters = activeDept?.semesters || [];
  const activeSem = availableSemesters.find((s) => String(s.id) === String(selectedSemId));
  const availableSubjects = activeSem?.subjects || [];

  const hasActiveFilter = Boolean(
    selectedDeptId || selectedSemId || selectedSubjectId || search.trim()
  );

  // Fetch Questions from Backend Proxy
  const fetchQuestions = useCallback(async () => {
    // By default, if no filter or search is active, keep questions empty
    if (!selectedDeptId && !selectedSemId && !selectedSubjectId && !search.trim()) {
      setQuestions([]);
      setPagination({ page: 1, limit: 15, total: 0, totalPages: 1 });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        search: search.trim() || undefined,
        departmentId: selectedDeptId || undefined,
        semesterId: selectedSemId || undefined,
        subjectId: selectedSubjectId || undefined,
        section: selectedSection !== 'all' ? selectedSection : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        isPublished: selectedPublishStatus !== 'all' ? selectedPublishStatus : undefined,
        page: currentPage,
        limit: 15,
      };

      const res = await getAdminVivaQuestions(params);
      setQuestions(res.questions || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err) {
      setToast({ message: err.message || 'Failed to load questions', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [
    search,
    selectedDeptId,
    selectedSemId,
    selectedSubjectId,
    selectedSection,
    selectedCategory,
    selectedPublishStatus,
    currentPage,
  ]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Selection calculations
  const visibleQuestionIds = useMemo(() => questions.map((q) => q.id), [questions]);
  const isAllVisibleSelected = visibleQuestionIds.length > 0 && visibleQuestionIds.every((id) => selectedIds.has(id));
  const isSomeVisibleSelected = visibleQuestionIds.some((id) => selectedIds.has(id));

  // Sync indeterminate property on header checkbox
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeVisibleSelected && !isAllVisibleSelected;
    }
  }, [isSomeVisibleSelected, isAllVisibleSelected]);

  const handleToggleSelect = (id) => {
    setSelectAllMatching(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      // Unselect visible questions
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleQuestionIds.forEach((id) => next.delete(id));
        return next;
      });
      setSelectAllMatching(false);
    } else {
      // Select all visible questions
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleQuestionIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleQuestionIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectAllMatching(false);
  };

  const handleSelectAllMatching = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleQuestionIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectAllMatching(true);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
    setSelectAllMatching(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedDeptId('');
    setSelectedSemId('');
    setSelectedSubjectId('');
    setSelectedSection('all');
    setSelectedCategory('all');
    setSelectedPublishStatus('all');
    setCurrentPage(1);
    setSelectedIds(new Set());
    setSelectAllMatching(false);
    setQuestions([]);
    setPagination({ page: 1, limit: 15, total: 0, totalPages: 1 });
  };

  // Toggle publish / unpublish status
  const handleTogglePublish = async (question) => {
    try {
      const updated = await togglePublishVivaQuestion(question.id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? { ...q, isPublished: updated.isPublished } : q))
      );
      setToast({
        message: updated.isPublished
          ? 'Question published to students!'
          : 'Question moved to draft.',
        type: 'success',
      });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update publish status', type: 'error' });
    }
  };

  // Save (Create or Update)
  const handleSaveQuestion = async (payload, id = null) => {
    if (id) {
      await updateAdminVivaQuestion(id, payload);
      setToast({ message: 'Viva question updated successfully!', type: 'success' });
    } else {
      await createAdminVivaQuestion(payload);
      setToast({ message: 'New viva question created!', type: 'success' });
    }
    fetchQuestions();
  };

  // Single Delete
  const handleDeleteQuestion = async (id) => {
    try {
      await deleteAdminVivaQuestion(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setSelectAllMatching(false);
      setToast({ message: 'Question deleted successfully.', type: 'success' });
      fetchQuestions();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete question', type: 'error' });
    }
  };

  // Bulk Delete (Supports either selected page items or all matching items across all pages)
  const handleBulkDelete = async () => {
    if (!selectAllMatching && selectedIds.size === 0) return;

    try {
      let res;
      if (selectAllMatching) {
        res = await bulkDeleteVivaQuestions({
          deleteAllMatching: true,
          departmentId: selectedDeptId || undefined,
          semesterId: selectedSemId || undefined,
          subjectId: selectedSubjectId || undefined,
          section: selectedSection !== 'all' ? selectedSection : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          isPublished: selectedPublishStatus !== 'all' ? selectedPublishStatus : undefined,
          search: search.trim() || undefined,
        });
      } else {
        const idsToDelete = [...selectedIds];
        res = await bulkDeleteVivaQuestions(idsToDelete);
      }

      setSelectedIds(new Set());
      setSelectAllMatching(false);
      setToast({
        message: res.message || 'Questions deleted successfully.',
        type: 'success',
      });
      fetchQuestions();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete selected questions', type: 'error' });
    }
  };

  const selectedQuestionsList = useMemo(() => {
    return questions.filter((q) => selectedIds.has(q.id));
  }, [questions, selectedIds]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ─── 1. Header & Actions ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Exam Preparation Module
            </span>
            <span className="text-xs text-gray-500 font-semibold font-mono">
              {hasActiveFilter ? `Total: ${pagination.total} Questions` : 'Select a Filter'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Viva Question & Answer Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Manage comprehensive viva questions, punchlines, diagrams, and examiner follow-ups for all subjects.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Search & Multi-Level Cascading Filters ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        {/* Top search row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search questions, punchlines, keywords..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center gap-1 transition cursor-pointer"
              title="Reset all filters"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filter dropdowns row (5 Columns - Difficulty removed) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value);
                setSelectedSemId('');
                setSelectedSubjectId('');
                setCurrentPage(1);
                setSelectedIds(new Set());
                setSelectAllMatching(false);
              }}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="">All Depts</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name ? `${d.name} (${d.code})` : d.code}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">Semester</label>
            <select
              value={selectedSemId}
              onChange={(e) => {
                setSelectedSemId(e.target.value);
                setSelectedSubjectId('');
                setCurrentPage(1);
                setSelectedIds(new Set());
                setSelectAllMatching(false);
              }}
              disabled={!selectedDeptId}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50 cursor-pointer"
            >
              <option value="">All Sems</option>
              {availableSemesters.map((s) => (
                <option key={s.id} value={s.id}>Sem {s.semesterNumber}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                const subId = e.target.value;
                setSelectedSubjectId(subId);
                if (subId && !selectedSemId) {
                  const match = allSubjects.find((s) => String(s.id) === String(subId));
                  if (match) {
                    setSelectedDeptId(match.deptId);
                    setSelectedSemId(match.semId);
                  }
                }
                setCurrentPage(1);
                setSelectedIds(new Set());
                setSelectAllMatching(false);
              }}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="">{selectedSemId ? 'All Subjects in Semester' : 'Select Subject...'}</option>
              {(selectedSemId ? availableSubjects : allSubjects).map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} — {sub.title} {!selectedSemId && `(Sem ${sub.semNumber})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
                setSelectedIds(new Set());
                setSelectAllMatching(false);
              }}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Theory Viva">Theory Viva</option>
              <option value="Practical Viva">Practical Viva</option>
              <option value="Experiment-wise Viva">Experiment Viva</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">Status</label>
            <select
              value={selectedPublishStatus}
              onChange={(e) => {
                setSelectedPublishStatus(e.target.value);
                setCurrentPage(1);
                setSelectedIds(new Set());
                setSelectAllMatching(false);
              }}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── 3. Bulk Selection Action Banner (Single Delete Action) ─── */}
      {(selectedIds.size > 0 || selectAllMatching) && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center shadow-xs">
              {selectAllMatching ? pagination.total : selectedIds.size}
            </span>
            <span className="text-xs sm:text-sm font-black text-gray-900">
              {selectAllMatching
                ? `All ${pagination.total} Questions Selected (Across All Pages)`
                : selectedIds.size === 1
                ? '1 Question Selected on this page'
                : `${selectedIds.size} Questions Selected on this page`}
            </span>

            <span className="text-gray-300">|</span>

            {!selectAllMatching && (
              <>
                {!isAllVisibleSelected && (
                  <button
                    onClick={handleSelectAllVisible}
                    className="text-xs font-bold text-amber-900 hover:text-black underline cursor-pointer"
                  >
                    Select page ({questions.length})
                  </button>
                )}

                {pagination.total > questions.length && (
                  <button
                    type="button"
                    onClick={handleSelectAllMatching}
                    className="text-xs font-black text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">done_all</span>
                    <span>Select all {pagination.total} questions across all {pagination.totalPages} pages</span>
                  </button>
                )}
              </>
            )}

            {selectAllMatching && (
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                All {pagination.total} questions selected
              </span>
            )}

            <button
              onClick={handleClearSelection}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 underline cursor-pointer ml-1"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* The single, unified Delete Selected / Delete All button */}
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>
                {selectAllMatching
                  ? `Delete All (${pagination.total}) Questions`
                  : `Delete Selected (${selectedIds.size})`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 4. Questions Table ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
        {!hasActiveFilter ? (
          <div className="py-20 text-center space-y-3 max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
              <span className="material-symbols-outlined text-[36px]">filter_alt</span>
            </div>
            <h3 className="text-base font-bold text-gray-900">Select a Filter to View Questions</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Questions are hidden by default. Please select a <strong>Department</strong>, <strong>Semester</strong>, or <strong>Subject</strong> from the dropdown filters above (or type in search) to load and manage viva questions.
            </p>
          </div>
        ) : loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500 mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">quiz</span>
            </div>
            <h3 className="text-base font-bold text-gray-900">No Viva Questions Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No questions matched your current filter criteria. Try adjusting filters or create a new question.
            </p>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black inline-flex items-center gap-1 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add First Question
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600 text-xs font-bold">
                <tr>
                  {/* Select All Checkbox */}
                  <th className="px-3 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      ref={headerCheckboxRef}
                      checked={isAllVisibleSelected}
                      onChange={handleToggleSelectAllVisible}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-gray-300 cursor-pointer"
                      title={isAllVisibleSelected ? 'Deselect all on this page' : 'Select all on this page'}
                    />
                  </th>
                  <th className="px-3 py-3 text-left w-12">#</th>
                  <th className="px-4 py-3 text-left">Question & Content</th>
                  <th className="px-4 py-3 text-left w-48">Subject & Unit</th>
                  <th className="px-4 py-3 text-left w-28">Status</th>
                  <th className="px-4 py-3 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {questions.map((q, idx) => {
                  const num = (pagination.page - 1) * pagination.limit + idx + 1;
                  const isPublished = q.isPublished;
                  const isSelected = selectedIds.has(q.id);

                  return (
                    <tr
                      key={q.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-amber-50/70 border-l-4 border-l-amber-500' : 'hover:bg-amber-50/20'
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="px-3 py-3.5 text-center align-top">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(q.id)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-gray-300 cursor-pointer"
                          aria-label={`Select question: ${q.question}`}
                        />
                      </td>

                      {/* Number */}
                      <td className="px-3 py-3.5 font-mono text-gray-400 font-bold align-top">
                        {q.questionNumber || num}
                      </td>

                      {/* Question Content */}
                      <td className="px-4 py-3.5 align-top space-y-1.5">
                        <p className="font-extrabold text-gray-900 text-sm leading-snug">
                          {q.question}
                        </p>
                        {q.shortAnswer && (
                          <p className="text-gray-600 line-clamp-2 italic text-[11px] leading-relaxed">
                            <span className="font-bold text-amber-700 not-italic mr-1">Punchline:</span>
                            {q.shortAnswer}
                          </p>
                        )}
                        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                          {q.category && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              {q.category}
                            </span>
                          )}
                          {Array.isArray(q.followUpQuestions) && q.followUpQuestions.length > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">help_center</span>
                              {q.followUpQuestions.length} Follow-ups
                            </span>
                          )}
                          {(q.diagram || q.imageUrl) && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">image</span>
                              Diagram
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Subject & Unit */}
                      <td className="px-4 py-3.5 align-top space-y-1.5 min-w-[160px]">
                        <div className="font-extrabold text-gray-900 text-xs leading-snug" title={q.subject?.title}>
                          {q.subject?.title || q.subject?.name || q.subject?.code || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {q.subject?.code && (
                            <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-200">
                              {q.subject.code}
                            </span>
                          )}
                          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px] truncate max-w-[140px]" title={q.section}>
                            {q.section || 'Unit 1'}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle Pill */}
                      <td className="px-4 py-3.5 align-top">
                        <button
                          onClick={() => handleTogglePublish(q)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                            isPublished
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-600' : 'bg-gray-400'}`} />
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 align-top text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingQuestion(q);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                            title="Edit Question"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingQuestion(q)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Question"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Pagination Footer (Only when filter is active and has questions) ─── */}
        {hasActiveFilter && questions.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <p className="text-gray-500 font-medium">
              Showing <strong className="text-gray-900">{questions.length}</strong> of{' '}
              <strong className="text-gray-900">{pagination.total}</strong> questions
              {selectedIds.size > 0 && (
                <span className="ml-2 font-bold text-amber-700">
                  ({selectedIds.size} selected)
                </span>
              )}
            </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                setSelectedIds(new Set());
              }}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-bold disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold text-gray-700">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(pagination.totalPages || 1, p + 1));
                setSelectedIds(new Set());
              }}
              disabled={currentPage >= (pagination.totalPages || 1) || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-bold disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

      {/* ─── Modals ─── */}
      {isAddModalOpen && (
        <QuestionFormModal
          initialData={editingQuestion}
          departments={departments}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveQuestion}
        />
      )}

      {isImportModalOpen && (
        <BulkImportModal
          departments={departments}
          initialDeptId={selectedDeptId}
          initialSemId={selectedSemId}
          initialSubjectId={selectedSubjectId}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={(result, targetSubId, targetDeptId, targetSemId) => {
            if (targetSubId) {
              setSelectedSubjectId(targetSubId);
            }
            if (targetDeptId) {
              setSelectedDeptId(targetDeptId);
            }
            if (targetSemId) {
              setSelectedSemId(targetSemId);
            }
            fetchQuestions();
          }}
        />
      )}

      {/* Single Delete Modal */}
      {deletingQuestion && (
        <DeleteConfirmModal
          question={deletingQuestion}
          onClose={() => setDeletingQuestion(null)}
          onConfirm={handleDeleteQuestion}
        />
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <BulkDeleteConfirmModal
          count={selectAllMatching ? pagination.total : selectedIds.size}
          isAllMatching={selectAllMatching}
          totalPages={pagination.totalPages}
          selectedQuestions={selectedQuestionsList}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          onConfirm={handleBulkDelete}
        />
      )}
    </div>
  );
}
