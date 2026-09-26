import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjectResources } from '../../hooks/useResources';
import { getSubjectByCode } from '../../services/resources/resourcesApi';
import { ErrorState } from '../../components/ui/ErrorState';
import UploadResourceModal from '../../components/resources/UploadResourceModal';
import { API_BASE_URL } from '../../lib/api';

// Backend proxy base — never expose raw Drive URLs to the browser
const buildDownloadUrl = (id) => `${API_BASE_URL}/resources/${id}/download`;

// Detect file type — checks mimeType first (reliable for Drive files), then URL
function getFileIcon(resource) {
  const mime = resource.mimeType || '';
  const url = (resource.fileUrl || resource.url || '').toLowerCase();
  if (mime.includes('pdf') || url.includes('.pdf')) return { icon: 'picture_as_pdf', label: 'PDF', color: 'text-red-600 bg-red-50 border-red-200' };
  if (mime.includes('word') || url.includes('.doc')) return { icon: 'description', label: 'DOC', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (mime.includes('ppt') || url.includes('.ppt')) return { icon: 'slideshow', label: 'PPT', color: 'text-orange-600 bg-orange-50 border-orange-200' };
  if (mime.includes('excel') || url.includes('.xls')) return { icon: 'grid_on', label: 'XLS', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (mime.includes('zip') || url.includes('.zip')) return { icon: 'folder_zip', label: 'ZIP', color: 'text-purple-600 bg-purple-50 border-purple-200' };
  if (mime.startsWith('image/') || /\.(jpe?g|png|gif|webp)/.test(url)) return { icon: 'image', label: 'IMG', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' };
  return { icon: 'draft', label: 'FILE', color: 'text-gray-700 bg-gray-100 border-gray-300' };
}

function SubjectDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Notes');
  const [subject, setSubject] = useState(null);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const resourcesPanelRef = useRef(null);

  function selectCategory(dbType) {
    setSelectedCategory(dbType);
    // Smooth scroll to the resources panel so users can immediately see results
    setTimeout(() => {
      resourcesPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  // useSubjectResources will fetch based on the actual subject code
  const { resources, loading: resourcesLoading, error, refetch } = useSubjectResources(subject?.code || '');

  useEffect(() => {
    async function fetchSubject() {
      if (!code) return;
      setSubjectLoading(true);
      const data = await getSubjectByCode(code);
      if (data) {
        setSubject(data);
      } else {
        // If subject not found, navigate to 404
        navigate('/404', { replace: true });
      }
      setSubjectLoading(false);
    }
    fetchSubject();
  }, [code, navigate]);

  const categories = [
    {
      icon: 'edit_note',
      title: 'Notes',
      dbType: 'Notes',
      desc: 'Handwritten & Typed lecture notes',
      accentColor: '#FBBF24',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      activeGradient: 'from-amber-400 to-amber-500 text-black',
    },
    {
      icon: 'description',
      title: 'Previous Year Papers',
      dbType: 'Previous Year Papers',
      desc: 'Past Indus & university exam papers',
      accentColor: '#38BDF8',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
      activeGradient: 'from-sky-400 to-sky-500 text-black',
    },
    {
      icon: 'biotech',
      title: 'Practical Files',
      dbType: 'Practical Files',
      desc: 'Complete lab records & experiment codes',
      accentColor: '#34D399',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      activeGradient: 'from-emerald-400 to-emerald-500 text-black',
    },
    {
      icon: 'forum',
      title: 'Viva Questions',
      dbType: 'Viva Questions',
      desc: 'Important viva Q&A for practical exams',
      accentColor: '#FB7185',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      activeGradient: 'from-rose-400 to-rose-500 text-black',
    },
    {
      icon: 'account_balance_wallet',
      title: 'Question Bank',
      dbType: 'Question Bank',
      desc: 'Unit-wise practice question banks',
      accentColor: '#C084FC',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      activeGradient: 'from-purple-400 to-purple-500 text-black',
    },
    {
      icon: 'list_alt',
      title: 'Syllabus',
      dbType: 'Syllabus',
      desc: 'Official Indus course syllabus document',
      accentColor: '#22D3EE',
      badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      activeGradient: 'from-cyan-400 to-cyan-500 text-black',
    },
  ];

  const filteredResources = resources.filter(
    (res) => res.resourceType === selectedCategory
  );

  const totalResourcesCount = resources.length;

  if (subjectLoading) {
    return (
      <div className="min-h-screen bulletin-board-bg flex flex-col items-center justify-center pt-20">
        <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center animate-bounce mb-4">
          <span className="material-symbols-outlined text-black text-3xl">auto_stories</span>
        </div>
        <p className="font-black text-black text-lg tracking-tight">Loading Subject Details...</p>
      </div>
    );
  }

  if (!subject) return null;

  return (
    <div className="pt-20 min-h-screen bulletin-board-bg text-on-surface font-body-md selection:bg-amber-300 selection:text-black relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-12 left-[10%] w-[450px] h-[450px] bg-amber-200/40 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-[35%] right-[5%] w-[480px] h-[480px] bg-sky-200/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 py-6 sm:py-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Top Hero / Header Section ─── */}
        <section className="mb-8 sm:mb-10">
          <div className="bg-white/90 backdrop-blur-md border-2 border-black rounded-[28px] p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.9)] relative overflow-hidden">
            {/* Main Header Content Grid */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Left Column: Icon + Subject Info */}
              <div className="flex items-start gap-3 sm:gap-6 min-w-0 flex-1">
                
                {/* Subject Avatar Icon Badge */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 text-black">
                  <span className="material-symbols-outlined text-[28px] sm:text-[44px]">
                    {subject.icon || 'menu_book'}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {subject.code && (
                      <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-[#FBBF24] px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
                        {subject.code}
                      </span>
                    )}
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Verified Subject
                    </span>
                    <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-extrabold">
                      SEM 0{subject.semester?.semesterNumber || 7}
                    </span>
                  </div>

                  {/* Main Subject Title */}
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight mb-2">
                    {subject.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium max-w-2xl leading-relaxed">
                    Select a resource category below to explore handwritten notes, Indus papers, lab manuals, and question banks.
                  </p>
                </div>
              </div>

              {/* Right Column: Quick Stats Pill */}
              <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 gap-3 shrink-0">
                <div className="bg-[#FEF3D6] border-2 border-black rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-center w-full md:w-auto">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black/60 block">Total Study Materials</span>
                  <span className="text-xl sm:text-3xl font-black text-black">
                    {resourcesLoading ? '...' : totalResourcesCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                  <Link
                    to={`/subject/${(subject.code || code).toLowerCase()}/viva`}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 active-press shadow-xs cursor-pointer w-full sm:w-auto bg-[#F6E27B] text-black border-2 border-black hover:bg-amber-400 transition"
                    title="Open Viva Questions & Solutions platform"
                  >
                    <span className="material-symbols-outlined text-[18px]">quiz</span>
                    Viva Prep
                  </Link>
                  <button
                    onClick={() => setShowUpload(true)}
                    className="btn-black-yellow px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 active-press shadow-xs cursor-pointer w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Contribute
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ─── Resource Categories Section ─── */}
        <section className="mb-10 sm:mb-12">
          
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-black flex items-center gap-2 tracking-tight">
              <span className="material-symbols-outlined text-amber-500 text-xl sm:text-2xl">category</span>
              Resource Categories
            </h2>
            <span className="text-[11px] sm:text-sm font-bold text-gray-600 bg-white border border-black/20 px-3 py-1 rounded-full shadow-xs hidden sm:inline-block">
              Click a card to filter materials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat, idx) => {
              const isViva = cat.dbType === 'Viva Questions';
              const vivaUrl = `/subject/${(subject?.code || code).toLowerCase()}/viva`;
              const isSelected = selectedCategory === cat.dbType;
              const catCount = resources.filter(r => r.resourceType === cat.dbType).length;

              if (isViva) {
                return (
                  <Link
                    key={idx}
                    to={vivaUrl}
                    className="relative p-3.5 sm:p-5 md:p-6 rounded-[20px] sm:rounded-[24px] text-left flex flex-col justify-between min-h-[140px] sm:min-h-[180px] transition-all duration-300 cursor-pointer select-none group border-2 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-black border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[20px] sm:text-[26px]">quiz</span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-2 bg-[#0F172A] text-[#FBBF24] border-black">
                          Oral Exam Prep ↗
                        </span>
                      </div>
                      <h3 className="font-black text-base sm:text-xl mb-1 sm:mb-2 tracking-tight line-clamp-1 text-black">
                        {cat.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-6 leading-relaxed line-clamp-2 text-gray-700">
                        Interactive syllabus dossiers, examiner punchlines, diagrams, and quick-recall cards.
                      </p>
                    </div>
                    <div className="pt-2.5 sm:pt-4 border-t border-black/10 flex items-center justify-between text-xs sm:text-sm font-black text-black group-hover:text-amber-800">
                      <span className="tracking-wide">Launch Viva Platform</span>
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1.5 transition-transform duration-200">
                        arrow_forward
                      </span>
                    </div>
                  </Link>
                );
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => selectCategory(cat.dbType)}
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-3.5 sm:p-5 md:p-6 rounded-[20px] sm:rounded-[24px] text-left flex flex-col justify-between min-h-[140px] sm:min-h-[180px] transition-all duration-300 cursor-pointer select-none group border-2 ${
                    isSelected
                      ? 'bg-[#0F172A] text-white border-black shadow-[6px_6px_0px_#FBBF24] ring-2 ring-[#FBBF24]'
                      : 'bg-white hover:bg-[#FFFDF5] text-black border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon Badge & Counter Badge */}
                    <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                      
                      <div
                        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border-2 border-black transition-transform duration-300 group-hover:scale-110 shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                          isSelected
                            ? 'bg-[#FBBF24] text-black'
                            : `${cat.badgeBg}`
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] sm:text-[26px]">{cat.icon}</span>
                      </div>

                      {/* Material Count Pill */}
                      <span
                        className={`text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border-2 ${
                          isSelected
                            ? 'bg-[#FBBF24] text-black border-black'
                            : 'bg-[#FEF3D6] text-black border-black'
                        }`}
                      >
                        {catCount < 10 ? `0${catCount}` : catCount} {catCount === 1 ? 'Resource' : 'Resources'}
                      </span>
                    </div>

                    {/* Category Title */}
                    <h3 className={`font-black text-base sm:text-xl mb-1 sm:mb-2 tracking-tight line-clamp-1 ${isSelected ? 'text-[#FBBF24]' : 'text-black'}`}>
                      {cat.title}
                    </h3>

                    {/* Category Description */}
                    <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-6 leading-relaxed line-clamp-2 break-words ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                      {cat.desc}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div
                    className={`pt-2.5 sm:pt-4 border-t flex items-center justify-between text-xs sm:text-sm font-black transition-colors ${
                      isSelected
                        ? 'border-white/15 text-[#FBBF24]'
                        : 'border-black/10 text-black group-hover:text-amber-600'
                    }`}
                  >
                    <span className="tracking-wide">Explore {cat.title}</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1.5 transition-transform duration-200">
                        arrow_forward
                      </span>
                    </div>
                  </div>

                </motion.button>
              );
            })}
          </div>

        </section>

        {/* ─── Active Category Resources List Section ─── */}
        <section ref={resourcesPanelRef} className="scroll-mt-6">
          <div className="bg-white/95 backdrop-blur-md rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-6 md:p-10 border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.12)] min-h-[300px] sm:min-h-[360px] relative">
            
            {/* Header of Resources Panel */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b-2 border-black/10">
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black shrink-0">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">folder_open</span>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-black tracking-tight flex items-center gap-2">
                    {selectedCategory}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-semibold line-clamp-1">
                    Showing study materials uploaded for {subject.title} ({subject.code})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setShowUpload(true)}
                  className="btn-black-yellow px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 active-press cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  Upload {selectedCategory}
                </button>

                <span className="text-[11px] sm:text-xs font-black bg-black text-[#FBBF24] border-2 border-[#FBBF24] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-xs shrink-0">
                  {resourcesLoading ? '...' : filteredResources.length} {filteredResources.length === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>
            </div>

            {/* Loading Skeleton State */}
            {resourcesLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="border-2 border-black/20 p-4 sm:p-6 rounded-2xl animate-pulse space-y-4 bg-gray-50">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-10 bg-gray-200 rounded-xl w-1/3 mt-4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !resourcesLoading && (
              <ErrorState message={error} onRetry={refetch} className="my-8" />
            )}

            {/* Loaded Resources Grid */}
            {!resourcesLoading && !error && filteredResources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredResources.map((res) => {
                  const downloadUrl = buildDownloadUrl(res.id);
                  const fileMeta = getFileIcon(res);
                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      className="border-2 border-black rounded-2xl bg-white hover:bg-[#FFFDF5] p-3.5 sm:p-5 md:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col justify-between min-h-[140px] sm:min-h-[160px] group"
                    >
                      <div>
                        {/* File Format Badge + Title */}
                        <div className="flex items-start justify-between gap-2.5 mb-2 sm:mb-3">
                          <h3 className="font-black text-sm sm:text-base md:text-lg text-black leading-snug flex items-start gap-1.5 sm:gap-2 line-clamp-2 break-words">
                            <span className="material-symbols-outlined text-amber-500 text-[20px] sm:text-[22px] mt-0.5 shrink-0">
                              {fileMeta.icon}
                            </span>
                            {res.title}
                          </h3>
                          <span className={`text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded border uppercase shrink-0 ${fileMeta.color}`}>
                            {fileMeta.label}
                          </span>
                        </div>

                        {res.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed font-medium line-clamp-2 break-words">
                            {res.description}
                          </p>
                        )}

                        {/* Metadata Pills */}
                        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-5">
                          {res.source && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-black font-extrabold bg-[#FEF3D6] border border-black/30 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
                              <span className="material-symbols-outlined text-[13px] sm:text-[14px]">person</span>
                              {res.source}
                            </span>
                          )}
                          {res.createdAt && (
                            <span className="text-[11px] sm:text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-gray-200">
                              {new Date(res.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-black/10">
                        <Link
                          to={`/resource/${res.id}`}
                          state={{ resource: res }}
                          className="btn-black-yellow px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 active-press flex-1"
                        >
                          <span className="material-symbols-outlined text-[15px] sm:text-[16px]">visibility</span>
                          View Material
                        </Link>
                        <a
                          href={downloadUrl}
                          download
                          className="inline-flex items-center justify-center gap-1.5 bg-[#FEF3D6] border-2 border-black text-black hover:bg-amber-400 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all active-press shadow-2xs shrink-0"
                          title="Download Document"
                        >
                          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">download</span>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!resourcesLoading && !error && filteredResources.length === 0 && (
              <div className="text-center py-12 px-4 border-2 border-dashed border-black/20 rounded-2xl bg-[#FFFDF5]/60 space-y-4">
                
                <div className="w-16 h-16 rounded-2xl bg-[#FEF3D6] border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto text-black">
                  <span className="material-symbols-outlined text-3xl">folder_off</span>
                </div>

                <div>
                  <h3 className="font-black text-xl text-black mb-1">
                    No {selectedCategory} uploaded yet
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-medium">
                    Be the first to share study material for <strong className="text-black">{subject.title}</strong>! Upload your notes or request them from the community.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                  <button
                    onClick={() => setShowUpload(true)}
                    className="btn-black-yellow px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black inline-flex items-center gap-2 active-press cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Upload Resource
                  </button>
                  <Link
                    to="/contact"
                    className="btn-yellow-black px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black inline-flex items-center gap-2 active-press cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    Request Material
                  </Link>
                </div>

              </div>
            )}

          </div>
        </section>

      </div>

      {/* Upload Resource Modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadResourceModal
            subjectCode={subject?.code}
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              refetch();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubjectDetails;
