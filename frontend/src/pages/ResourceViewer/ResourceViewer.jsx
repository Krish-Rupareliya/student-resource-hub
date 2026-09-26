// src/pages/ResourceViewer/ResourceViewer.jsx
// Full-screen inline PDF / file viewer for students.
// Navigated to from SubjectDetails via /resource/:id
import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { getResourceById } from '../../services/resources/resourcesApi';
import ScrollToTop from '../../components/common/ScrollToTop';

import { API_BASE_URL } from '../../lib/api';

// ─── Helpers ──────────────────────────────────────────────────
// Backend proxy URLs — the raw Google Drive URL NEVER reaches the browser
function buildViewUrl(id)     { return `${API_BASE_URL}/resources/${id}/view`; }
function buildDownloadUrl(id) { return `${API_BASE_URL}/resources/${id}/download`; }

function isPdf(url) {
  // For proxy URLs we rely on the backend Content-Type header, but we can
  // check the stored mimeType on the resource object instead (see below).
  return url?.toLowerCase().includes('.pdf');
}

function isImage(url) {
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(url || '');
}

// Category icon map (matches SubjectDetails categories)
const CATEGORY_ICONS = {
  'Notes': 'edit_note',
  'Previous Year Papers': 'description',
  'Practical Files': 'biotech',
  'Viva Questions': 'forum',
  'Question Bank': 'account_balance_wallet',
  'Syllabus': 'list_alt',
};

// ─── Main Component ────────────────────────────────────────────
function ResourceViewer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Instant display using state passed from SubjectDetails (no flicker)
  // Falls back to API fetch if navigated directly via URL
  const [resource, setResource] = useState(location.state?.resource ?? null);
  const [loading, setLoading] = useState(!location.state?.resource);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (resource) return; // Already have data from state
    async function load() {
      setLoading(true);
      const data = await getResourceById(id);
      if (!data) {
        navigate('/404', { replace: true });
      } else {
        setResource(data);
      }
      setLoading(false);
    }
    load();
  }, [id, navigate, resource]);

  // Safety fallback: Chromium PDF plugin inside <iframe> does not trigger standard onLoad.
  // Automatically dismiss loading spinner after 1.2s to reveal PDF.
  useEffect(() => {
    if (!resource) return;
    setIframeLoading(true);
    setIframeError(false);
    const timer = setTimeout(() => {
      setIframeLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [resource]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto" />
          <p className="text-white/60 text-sm">Loading resource…</p>
        </div>
      </div>
    );
  }

  if (!resource) return null;

  const viewUrl     = buildViewUrl(resource.id);     // iframe + "Open in New Tab"
  const downloadUrl = buildDownloadUrl(resource.id); // Download button

  // Detect type from stored mimeType or file name
  const mime = resource.mimeType || '';
  const titleStr = resource.title || '';
  const urlStr = resource.fileUrl || '';

  const resourceIsPdf   = mime.includes('pdf') || isPdf(urlStr) || isPdf(titleStr);
  const resourceIsImage = mime.startsWith('image/') || isImage(urlStr) || isImage(titleStr);
  const hasDriveFile    = !!resource.driveFileId;
  const canTryIframe    = resourceIsPdf || hasDriveFile;

  const subject = resource.subject;
  const semester = subject?.semester;
  const department = semester?.department;
  const catIcon = CATEGORY_ICONS[resource.resourceType] || 'draft';

  // Build back-link to the subject page
  const subjectCode = subject?.code?.toLowerCase() ?? '';
  const backUrl = subjectCode ? `/subject/${subjectCode}` : '/resources';

  return (
    <div className="h-screen flex flex-col bg-[#0f1117] text-white overflow-hidden">
      <ScrollToTop />

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="shrink-0 bg-[#1a1d27] border-b border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Back button */}
        <Link
          to={backUrl}
          className="flex items-center gap-1 text-white/70 hover:text-white transition text-xs sm:text-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_back</span>
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="w-px h-4 sm:h-5 bg-white/10 shrink-0" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-white/40 overflow-hidden flex-1 min-w-0">
          {department && (
            <>
              <span className="shrink-0 hidden xs:inline">{department.code}</span>
              <span className="material-symbols-outlined text-[10px] sm:text-[12px] shrink-0 hidden xs:inline">chevron_right</span>
            </>
          )}
          {semester && (
            <>
              <span className="shrink-0 hidden sm:inline">Sem {semester.semesterNumber}</span>
              <span className="material-symbols-outlined text-[10px] sm:text-[12px] shrink-0 hidden sm:inline">chevron_right</span>
            </>
          )}
          {subject && (
            <>
              <span className="truncate text-white/60 hidden md:inline">{subject.title}</span>
              <span className="material-symbols-outlined text-[10px] sm:text-[12px] shrink-0 hidden md:inline">chevron_right</span>
            </>
          )}
          <span className="truncate text-white/90 font-semibold">{resource.title}</span>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Download button */}
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition"
            title="Download File"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Open in new tab */}
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/90 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition"
            title="Open in New Tab"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span className="hidden sm:inline">New Tab</span>
          </a>
        </div>
      </header>

      {/* ── Body: Sidebar + Viewer ───────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ──────────────────────────────────── */}
        <aside className="w-64 shrink-0 bg-[#1a1d27] border-r border-white/10 overflow-y-auto flex flex-col p-5 gap-5 hidden md:flex">

          {/* Subject icon + title */}
          <div className="flex flex-col items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400 text-[22px]">
                {subject?.icon || 'book'}
              </span>
            </div>
            {subject && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-0.5">Subject</p>
                <p className="text-sm font-semibold text-white/90 leading-tight">{subject.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{subject.code}</p>
              </div>
            )}
          </div>

          <div className="h-px bg-white/10" />

          {/* Resource metadata */}
          <div className="space-y-4">
            {/* Category */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1.5">Category</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-[18px]">{catIcon}</span>
                <span className="text-sm text-white/80">{resource.resourceType}</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1.5">Title</p>
              <p className="text-sm text-white/90 leading-relaxed">{resource.title}</p>
            </div>

            {/* Description */}
            {resource.description && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1.5">Description</p>
                <p className="text-xs text-white/60 leading-relaxed">{resource.description}</p>
              </div>
            )}

            {/* Source */}
            {resource.source && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1.5">Source</p>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-white/30 text-[14px]">person</span>
                  <span className="text-xs text-white/60">{resource.source}</span>
                </div>
              </div>
            )}

            {/* Date */}
            {resource.createdAt && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1.5">Uploaded</p>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-white/30 text-[14px]">calendar_today</span>
                  <span className="text-xs text-white/60">
                    {new Date(resource.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              Open in New Tab
            </a>
            <a
              href={downloadUrl}
              download
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm font-semibold py-2.5 rounded-xl transition"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download File
            </a>
          </div>
        </aside>

        {/* ── Main Viewer Area ──────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative bg-black">
          {!resource.fileUrl && !resource.driveFileId ? (
            <EmptyViewer message="No file is attached to this resource." />
          ) : resourceIsImage && !hasDriveFile ? (
            // Local image files — render directly
            <div className="w-full h-full overflow-auto flex items-center justify-center p-8">
              <img
                src={viewUrl}
                alt={resource.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          ) : canTryIframe ? (
            // PDF or Drive file — attempt inline iframe (backend sends correct Content-Type)
            <>
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="text-center space-y-3 bg-[#0f1117]/80 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mx-auto" />
                    <p className="text-white/60 text-sm font-medium">Loading preview…</p>
                  </div>
                </div>
              )}
              {iframeError ? (
                <FallbackViewer viewUrl={viewUrl} downloadUrl={downloadUrl} />
              ) : (
                <iframe
                  key={viewUrl}
                  src={viewUrl}
                  title={resource.title}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoading(false)}
                  onError={() => { setIframeLoading(false); setIframeError(true); }}
                />
              )}
            </>
          ) : (
            <FallbackViewer viewUrl={viewUrl} downloadUrl={downloadUrl} isUnknownType />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Fallback: when PDF can't be embedded or unknown type ───
function FallbackViewer({ viewUrl, downloadUrl, isUnknownType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4 sm:px-8 bg-neutral-950">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
        <span className="material-symbols-outlined text-yellow-400 text-[36px] sm:text-[48px]">
          {isUnknownType ? 'folder_zip' : 'picture_as_pdf'}
        </span>
      </div>
      <div>
        <h3 className="text-yellow-400 font-bold text-base sm:text-lg mb-1.5">Preview not available</h3>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-sm">
          {isUnknownType 
            ? "This file format cannot be previewed directly in the browser. Click below to download."
            : "Your browser blocked the inline preview for this file. You can still open or download it directly."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
        {!isUnknownType && (
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Open in New Tab
          </a>
        )}
        <a
          href={downloadUrl}
          download
          className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-yellow-400 font-bold px-6 py-3 rounded-xl transition border border-neutral-700 text-xs sm:text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download File
        </a>
      </div>
    </div>
  );
}

function EmptyViewer({ message }) {
  return (
    <div className="flex items-center justify-center h-full text-neutral-500 text-sm bg-neutral-950">
      <span className="material-symbols-outlined mr-2">error_outline</span>
      {message}
    </div>
  );
}

export default ResourceViewer;
