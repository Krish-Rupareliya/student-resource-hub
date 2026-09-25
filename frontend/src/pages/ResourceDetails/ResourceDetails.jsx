import { useParams, Link, Navigate } from 'react-router-dom';
import { useSemesterById } from '../../hooks/useSemesterById';
import { SubjectCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import FolderSubjectCard from '../../components/subjects/FolderSubjectCard';

function SemesterDetails() {
  const { id } = useParams();
  const semesterId = parseInt(id || '5', 10);

  const { semester, loading, error, refetch } = useSemesterById(semesterId);

  // Hard redirect for invalid numeric ids (not loading, not error, no semester found)
  if (!loading && !error && !semester) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="pt-20 min-h-screen bulletin-board-bg text-on-surface font-body-md selection:bg-amber-300 selection:text-black relative overflow-hidden">
      
      {/* ─── Background Subtle Isometric Architectural Grid & Ambient Accents ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        
        {/* Soft Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-black/5" />

        {/* Glassmorphic Ambient Accent Glows */}
        <div className="absolute top-10 -left-16 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[20%] right-[-8%] w-[420px] h-[420px] bg-sky-100/45 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-[10%] left-[15%] w-[450px] h-[450px] bg-purple-100/35 rounded-full blur-3xl opacity-65" />

        {/* Subtle Accent Rings */}
        <div className="hidden md:block absolute top-[20%] left-[46%] w-5 h-5 rounded-full border-2 border-black/15 opacity-60" />
        <div className="hidden md:block absolute top-[48%] right-[6%] w-6 h-6 rounded-full border-2 border-black/15 opacity-60" />
      </div>

      <main className="relative z-10">
        {/* Header Section Container Box */}
        <section className="relative pt-6 sm:pt-10 pb-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="bg-white/90 backdrop-blur-md border-2 border-black rounded-[28px] p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.9)] relative overflow-hidden">

            {/* Main Header Content Grid */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Left Column: Icon + Semester Info */}
              <div className="flex items-start gap-3 sm:gap-6">
                
                {/* Semester Avatar Icon Badge */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 text-black">
                  <span className="material-symbols-outlined text-[28px] sm:text-[44px]">
                    school
                  </span>
                </div>

                <div>
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="bg-[#0F172A] text-[#FBBF24] border-2 border-[#FBBF24] px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase shadow-xs">
                      SEM 0{semester?.semesterNumber || semesterId}
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Computer Engineering
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-black tracking-tight leading-tight mb-2">
                    {loading ? <span className="inline-block w-48 h-9 rounded bg-gray-200 animate-pulse" /> : semester?.name}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium max-w-2xl leading-relaxed">
                    Choose a subject to access Notes, Previous Year Papers, Practical Files, Viva Questions, Question Banks, and Syllabus.
                  </p>
                </div>
              </div>

              {/* Right Column: Quick Stat Box */}
              {semester?.subjects && (
                <div className="bg-[#FEF3D6] border-2 border-black rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-center shrink-0 w-full md:w-auto">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black/60 block">Subjects Available</span>
                  <span className="text-xl sm:text-3xl font-black text-black">
                    {semester.subjects.length}
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* Error state */}
          {error && !loading && (
            <ErrorState message={error} onRetry={refetch} className="my-8" />
          )}
        </section>

        {/* The "Bulletin Board" Grid Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative space-y-8">
          
          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 relative z-10 max-w-7xl mx-auto justify-items-center">
            {/* Loading skeletons */}
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <SubjectCardSkeleton key={i} />
            ))}

            {/* Loaded subjects */}
            {!loading && !error && semester?.subjects.map((sub, index) => (
              <FolderSubjectCard
                key={sub.code || index}
                subject={sub}
                index={index}
                semesterNumber={semester?.semesterNumber || semesterId || 5}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SemesterDetails;
