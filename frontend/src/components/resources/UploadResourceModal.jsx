// src/components/resources/UploadResourceModal.jsx
// Student file submission modal — sends FormData to POST /api/submissions/upload
import { useState, useRef, useCallback } from 'react';
import { submitResourceUpload } from '../../services/uploads/uploadsApi';

const RESOURCE_TYPES = [
  'Notes',
  'Previous Year Papers (PYQ)',
  'Practical File',
  'Viva Questions',
  'Question Bank',
  'Syllabus',
  'Lab Manual',
  'Other',
];

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip';
const MAX_SIZE_MB = 15;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name) {
  const ext = name?.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'picture_as_pdf';
  if (['doc', 'docx'].includes(ext)) return 'description';
  if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
  if (['xls', 'xlsx'].includes(ext)) return 'grid_on';
  if (['zip'].includes(ext)) return 'folder_zip';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
  return 'draft';
}

export default function UploadResourceModal({ isOpen = true, subjectCode, onClose, onSuccess }) {
  const [form, setForm] = useState({
    subjectCode: subjectCode || '',
    title: '',
    resourceType: 'Notes',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File exceeds the ${MAX_SIZE_MB} MB limit.`);
      return;
    }
    setFile(selectedFile);
    setErrorMsg('');
    if (!form.title) {
      const name = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setForm(f => ({ ...f, title: name }));
    }
  }, [form.title]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }, [handleFileSelect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.subjectCode) { setErrorMsg('Please select a subject.'); return; }
    if (!form.title.trim()) { setErrorMsg('Please enter a title.'); return; }
    if (!form.resourceType) { setErrorMsg('Please select a resource type.'); return; }
    if (!file) { setErrorMsg('Please select a file to upload.'); return; }

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('subjectCode', form.subjectCode);
    formData.append('resourceType', form.resourceType);
    if (form.description.trim()) {
      formData.append('description', form.description.trim());
    }
    formData.append('file', file);

    setStatus('uploading');
    const interval = setInterval(() => {
      setProgress(p => (p < 85 ? p + 5 : p));
    }, 120);

    try {
      await submitResourceUpload(formData);
      clearInterval(interval);
      setProgress(100);
      setStatus('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1800);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setStatus('error');
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    }
  };

  const isLoading = status === 'uploading';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      {/* Matte black/yellow borders theme applied here */}
      <div className="bg-white rounded-[24px] shadow-2xl w-[95%] sm:w-full sm:max-w-xl border-2 border-amber-300/80 max-h-[95vh] overflow-y-auto custom-scrollbar mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 sm:px-8 sm:py-6 border-b border-gray-100">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FEF3D6] border border-amber-300 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-black text-[20px] sm:text-[24px]">upload_file</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-black">Contribute a Resource</h2>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5">
              Help fellow students — submit study material for review
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">close</span>
          </button>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-emerald-600 text-[32px] sm:text-[40px]">check_circle</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-black mb-2 sm:mb-3">Submitted Successfully!</h3>
            <p className="text-sm font-medium text-gray-600 max-w-sm">
              Your resource has been sent for admin review. It will appear once approved — thank you!
            </p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Subject Code */}
              <div>
                <label className="block font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 text-black">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.subjectCode}
                  onChange={(e) => setForm(f => ({ ...f, subjectCode: e.target.value }))}
                  disabled={isLoading || !!subjectCode}
                  placeholder="e.g. CE0516 or Machine Learning"
                  className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all text-xs sm:text-sm font-semibold text-black outline-none ${
                    !!subjectCode || isLoading 
                      ? 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed'
                      : 'border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px]'
                  }`}
                />
              </div>

              {/* Resource Type */}
              <div>
                <label className="block font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 text-black">
                  Resource Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.resourceType}
                    onChange={(e) => setForm(f => ({ ...f, resourceType: e.target.value }))}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-xs sm:text-sm font-semibold text-black appearance-none cursor-pointer disabled:opacity-50"
                  >
                    {RESOURCE_TYPES.map(rt => (
                      <option key={rt} value={rt}>{rt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 text-black">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Unit 3 Notes — Data Structures"
                maxLength={255}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-xs sm:text-sm font-semibold text-black disabled:opacity-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 text-black">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief note for reviewers — topics covered, year, etc."
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#FBBF24] focus:shadow-[2px_2px_0px_0px_#FBBF24] focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all text-xs sm:text-sm font-semibold text-black resize-none disabled:opacity-50"
              />
            </div>

            {/* File Drop Zone */}
            <div>
              <label className="block font-bold text-xs sm:text-sm mb-1.5 sm:mb-2 text-black">
                File <span className="text-red-500">*</span>
              </label>

              {!file ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  onKeyDown={e => e.key === 'Enter' && !isLoading && fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-3 p-5 sm:p-8 rounded-[20px] border-2 border-dashed cursor-pointer transition-all select-none ${
                    dragOver
                      ? 'border-black bg-amber-50 scale-[1.02]'
                      : 'border-amber-300/80 hover:border-black hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <span className="material-symbols-outlined text-[36px] sm:text-[48px] text-black">cloud_upload</span>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-bold text-black">
                      Drag &amp; drop or <span className="text-amber-600">browse</span>
                    </p>
                    <p className="text-[11px] sm:text-xs font-medium text-gray-500 mt-1">
                      PDF, DOC, Images, ZIP — up to {MAX_SIZE_MB} MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    onChange={e => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <span className="material-symbols-outlined text-black text-[28px] shrink-0">
                    {getFileIcon(file.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-black truncate">{file.name}</p>
                    <p className="text-[11px] font-medium text-gray-500 mt-0.5">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setProgress(0); }}
                    disabled={isLoading}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-100 text-red-500 transition shrink-0 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {isLoading && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-2">
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {(errorMsg || status === 'error') && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-xs sm:text-sm font-semibold text-red-700">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <p>{errorMsg || 'Something went wrong. Please try again.'}</p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:flex-1 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-bold bg-white border-2 border-gray-200 text-black hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full sm:flex-[2] btn-black-yellow py-3 sm:py-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active-press"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">publish</span>
                    Submit Resource
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
