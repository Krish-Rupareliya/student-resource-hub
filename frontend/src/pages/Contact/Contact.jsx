import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useResourceRequest } from '../../hooks/useResourceRequest';
import { InlineError } from '../../components/ui/ErrorState';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import FramerButton from '../../components/ui/FramerButton';

const RESOURCE_TYPES = [
  { id: 'Notes', label: 'Handwritten Notes', icon: 'edit_note' },
  { id: 'Previous Year Papers (PYQ)', label: 'Previous Year Papers (PYQ)', icon: 'history_edu' },
  { id: 'Practical File', label: 'Practical & Lab Files', icon: 'science' },
  { id: 'Viva Questions', label: 'Viva & Question Bank', icon: 'quiz' },
  { id: 'Syllabus', label: 'Official Syllabus', icon: 'menu_book' },
  { id: 'Lab Manual', label: 'Lab Manual & Codes', icon: 'terminal' },
  { id: 'Other', label: 'Other Special Request', icon: 'folder_open' },
];

const PRESET_TOPICS = [
  { label: 'Unit-Wise Notes', type: 'Notes', hint: 'I need unit-wise handwritten notes for ', icon: 'edit_note' },
  { label: 'Mid-Sem PYQs', type: 'Previous Year Papers (PYQ)', hint: 'I need previous 3 years mid-sem question papers for ', icon: 'history_edu' },
  { label: 'Lab Manual & Codes', type: 'Lab Manual', hint: 'I need completed lab experiments and source code for ', icon: 'terminal' },
  { label: 'Viva Question Bank', type: 'Viva Questions', hint: 'I need most frequently asked viva and oral exam questions for ', icon: 'quiz' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Instant Dispatch',
    desc: 'Your request is categorized and queued in our priority moderation dashboard.',
    icon: 'send',
    color: 'bg-[#FEF08A] text-[#713F12]',
  },
  {
    step: '02',
    title: 'Peer & Senior Search',
    desc: 'Verified senior contributors and coordinators source or digitize the document.',
    icon: 'manage_search',
    color: 'bg-[#BAE6FD] text-[#0369A1]',
  },
  {
    step: '03',
    title: 'Verified & Published',
    desc: 'Quality-checked file is uploaded to the Hub and you receive an email link.',
    icon: 'verified',
    color: 'bg-[#BBF7D0] text-[#14532D]',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How long does fulfillment usually take?',
    a: 'Most requests are resolved within 12 to 24 hours. Rare subject materials or newly introduced syllabus units may take up to 48 hours.',
  },
  {
    q: 'Are all requested resources free?',
    a: 'Yes, 100% free. CampusHub is an open student initiative — zero paywalls, zero locked PDFs, and no mandatory fees.',
  },
  {
    q: 'Can I upload my own notes to help other students?',
    a: 'Absolutely! You can share your notes directly via our community links or reach out through the official WhatsApp & Telegram channels.',
  },
  {
    q: 'Who reviews and verifies the requested files?',
    a: 'Every file is checked by senior engineering alumni and student coordinators for syllabus alignment, OCR readability, and accuracy before publishing.',
  },
];

function Contact() {
  const { formData, handleChange, handleSubmit, status, errorMessage, reset } = useResourceRequest();
  const { toasts, addToast, removeToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (status === 'success') {
      addToast({
        message: 'Request received! Our community will source this for you within 24h.',
        type: 'success',
        duration: 5000,
      });
    }
    if (status === 'error' && errorMessage) {
      addToast({ message: errorMessage, type: 'error', duration: 5000 });
    }
  }, [status, errorMessage, addToast]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const applyPreset = (preset) => {
    handleChange('resourceType', preset.type);
    if (!formData.message || formData.message.length < 15) {
      handleChange('message', preset.hint);
    }
  };

  return (
    <div className="pt-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen pb-24 relative overflow-x-clip selection:bg-amber-300 selection:text-hub-navy">
      {/* ─── Ambient Canvas Vector Layers ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Subtle Neo-Brutalist Dot Matrix */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              'radial-gradient(#0F172A 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Blurred Organic Blobs */}
        <div className="absolute top-16 -left-20 w-[480px] h-[480px] bg-amber-200/35 rounded-full blur-3xl lofty-pulse" />
        <div className="absolute top-[40%] -right-24 w-[520px] h-[520px] bg-sky-200/30 rounded-full blur-3xl lofty-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 pt-6">
        {/* ─── 1. BREADCRUMBS & HERO HEADER ─── */}
        <section className="pt-4 pb-4 max-w-4xl mx-auto text-center space-y-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center text-xs font-bold text-gray-500 mb-2">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-hub-navy font-black">Contact &amp; Resource Desk</span>
          </nav>

          {/* Fulfillment Status Pill */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] animate-ping shrink-0" />
            <span>24-Hour Fulfillment Desk</span>
            <span className="text-[#0F172A]/40">•</span>
            <span>Community Verified</span>
          </div>

          {/* Main Headline with Brush Underline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-hub-navy leading-[1.14] tracking-tight">
            Can't Find What You{' '}
            <span className="relative inline-block text-amber-500">
              Need?
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-90"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium pt-1">
            Submit your subject request below. Our network of student contributors, seniors, and coordinators will track down, verify, and upload the material for you.
          </p>

          {/* Urgent Exam Channel Ticket Bar */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A] flex flex-col sm:flex-row items-center justify-between gap-3.5 text-xs font-black text-[#0F172A] max-w-2xl mx-auto text-left mt-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#FF5722] text-2xl shrink-0">bolt</span>
              <div>
                <span className="block font-black text-slate-900">Need urgent mid-sem exam papers in under 5 minutes?</span>
                <span className="text-[11px] text-slate-500 font-semibold">Join live peer groups for immediate file sharing</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <a
                href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>WhatsApp ↗</span>
              </a>
              <a
                href="https://t.me/+fP4hKU69AQIwZjI1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-black text-xs border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>Telegram ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── 2. MAIN GRID (Interactive Request Form + Sidebar) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: Form + Resolution Pipeline (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Neo-Brutalist Request Form Card */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 md:p-10 border-[2.5px] border-[#0F172A] shadow-[6px_6px_0_#0F172A] relative overflow-hidden">
              
              {/* Form Card Header */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] flex items-center justify-center text-[#0F172A] shrink-0">
                    <span className="material-symbols-outlined text-2xl">edit_document</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-hub-navy tracking-tight">Direct Resource Request</h2>
                    <p className="text-xs text-slate-500 font-semibold">Free student-to-student fulfillment pipeline</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#0F172A] text-[#FEF08A] text-[10px] font-black uppercase tracking-wider border border-[#0F172A]">
                  TICKET #DESK-2026
                </span>
              </div>

              {/* Success Notification Banner */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-8 p-5 bg-[#DCFCE7] border-2 border-[#0F172A] rounded-2xl flex items-start gap-3.5 shadow-[3px_3px_0_#0F172A]"
                  >
                    <span className="material-symbols-outlined text-emerald-700 text-3xl shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <h4 className="font-black text-[#0F172A] text-base">Request Dispatched Successfully!</h4>
                      <p className="text-emerald-900 text-xs sm:text-sm mt-1 leading-relaxed font-semibold">
                        Our student coordinators have received your request. We will notify you at your email as soon as the file is verified and published.
                      </p>
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-[#FEF08A] text-xs font-black transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shadow-[2px_2px_0_#0F172A]"
                      >
                        <span>Submit Another Request</span>
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Topic Autofill Presets */}
              <div className="mb-6">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#FF5722] text-base">auto_awesome</span>
                  <span>Quick-Select Resource Category:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TOPICS.map((preset, idx) => {
                    const isActive = formData.resourceType === preset.type;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2 border-[#0F172A] transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FF5722] text-white shadow-[2px_2px_0_#0F172A] translate-x-0.5 translate-y-0.5'
                            : 'bg-[#FFFDF8] text-slate-800 shadow-[3px_3px_0_#0F172A] hover:shadow-[4px_4px_0_#0F172A] hover:-translate-y-0.5 hover:bg-amber-50'
                        }`}
                      >
                        {preset.icon && <span className="material-symbols-outlined text-base leading-none">{preset.icon}</span>}
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The Form */}
              <form onSubmit={handleSubmit} noValidate aria-label="Resource request form" className="space-y-5">
                {/* Row 1: Subject Code & Resource Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject Code */}
                  <div>
                    <label htmlFor="subjectCode" className="block font-black text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject Code / Name <span className="text-slate-400 font-bold lowercase">(optional)</span>
                    </label>
                    <input
                      id="subjectCode"
                      type="text"
                      value={formData.subjectCode}
                      onChange={(e) => handleChange('subjectCode', e.target.value.toUpperCase())}
                      placeholder="e.g. CE0516 or Data Structures"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#0F172A] bg-[#FFFDF8] focus:bg-white focus:shadow-[4px_4px_0_#FF5722] outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Resource Type */}
                  <div>
                    <label htmlFor="resourceType" className="block font-black text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Resource Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="resourceType"
                      value={formData.resourceType}
                      onChange={(e) => handleChange('resourceType', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#0F172A] bg-[#FFFDF8] focus:bg-white focus:shadow-[4px_4px_0_#FF5722] outline-none transition-all text-sm font-bold text-slate-900 cursor-pointer"
                      disabled={isLoading}
                    >
                      {RESOURCE_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message / Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="message" className="block font-black text-xs uppercase tracking-wider text-slate-700">
                      Describe What You Need <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {formData.message?.length || 0} characters
                    </span>
                  </div>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="e.g. Need handwritten notes for Unit 3 of Operating Systems (CE0512) — specifically CPU Scheduling & Deadlocks with diagrams..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#0F172A] bg-[#FFFDF8] focus:bg-white focus:shadow-[4px_4px_0_#FF5722] outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none leading-relaxed"
                    disabled={isLoading}
                    required
                    aria-required="true"
                  />
                  {errorMessage && <InlineError message={errorMessage} />}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="requesterEmail" className="block font-black text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Email Address <span className="text-rose-500">*</span>{' '}
                    <span className="text-slate-400 font-bold lowercase">(must be @gmail.com)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="requesterEmail"
                      type="email"
                      value={formData.requesterEmail}
                      onChange={(e) => handleChange('requesterEmail', e.target.value)}
                      placeholder="student@gmail.com"
                      pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                      title="Please enter a valid @gmail.com address"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-[#0F172A] bg-[#FFFDF8] focus:bg-white focus:shadow-[4px_4px_0_#FF5722] outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                      disabled={isLoading}
                      required
                      aria-required="true"
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                      mail
                    </span>
                  </div>
                </div>

                {/* Submit Action Button with Framer Dual-Text Slide Up */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className="w-full group relative overflow-hidden bg-[#0F172A] hover:bg-[#FF5722] text-white font-black py-4 px-6 rounded-2xl border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A] hover:shadow-[6px_6px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Queuing Request...</span>
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2 text-[#4ADE80]">
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                        <span>Request Queued in Dashboard!</span>
                      </span>
                    ) : (
                      <span className="relative inline-block overflow-hidden leading-tight py-0.5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 transition-transform duration-300 ease-[cubic-bezier(.44,0,.56,1)] group-hover:-translate-y-full">
                          <span className="material-symbols-outlined text-lg leading-none">send</span>
                          <span>Submit Resource Request</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 inline-flex items-center justify-center gap-2 translate-y-full transition-transform duration-300 ease-[cubic-bezier(.44,0,.56,1)] group-hover:translate-y-0 text-white"
                        >
                          <span className="material-symbols-outlined text-lg leading-none">rocket_launch</span>
                          <span>Dispatch to Coordinators</span>
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Workflow Pipeline Process Bar (3 Bento Cards) */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
              <h3 className="font-black text-sm uppercase tracking-wider text-hub-navy mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-xl">sync_alt</span>
                <span>How Your Request Gets Resolved</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {WORKFLOW_STEPS.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-2xl bg-[#FFFDF8] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] hover:-translate-y-1 hover:shadow-[4px_4px_0_#0F172A] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md border border-[#0F172A] shadow-xs bg-[#0F172A] text-[#FEF08A]">
                          STEP {step.step}
                        </span>
                        <div className={`w-8 h-8 rounded-lg border border-[#0F172A] flex items-center justify-center ${step.color}`}>
                          <span className="material-symbols-outlined text-base leading-none">{step.icon}</span>
                        </div>
                      </div>
                      <h4 className="font-black text-xs text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right Column: Direct Community & Guarantee Sidebar (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Community Direct Connect Card */}
            <div className="bg-[#0F172A] text-white rounded-[32px] p-6 sm:p-8 border-2 border-[#0F172A] shadow-[6px_6px_0_#FF5722] relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] text-[#0F172A] text-xs font-black uppercase tracking-wider border-2 border-[#0F172A]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time Peer Help</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Need an Answer in Minutes?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  Connect with batch seniors, rank holders, and subject moderators on our official student channels.
                </p>

                <div className="space-y-3 pt-2">
                  <FramerButton
                    href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    icon="chat"
                    shadow="sm"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black border-2 border-[#0F172A]"
                  >
                    Join WhatsApp Community
                  </FramerButton>

                  <FramerButton
                    href="https://t.me/+fP4hKU69AQIwZjI1"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="sky"
                    size="md"
                    icon="send"
                    shadow="sm"
                    className="w-full bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-black border-2 border-[#0F172A]"
                  >
                    Join Telegram Channel
                  </FramerButton>

                  <FramerButton
                    to="/resources"
                    variant="outline"
                    size="md"
                    icon="grid_view"
                    shadow="sm"
                    className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black border-2 border-[#0F172A]"
                  >
                    Browse Existing Catalog
                  </FramerButton>
                </div>
              </div>
            </div>

            {/* Quality & Trust Cards */}
            <div className="bg-white rounded-[28px] p-6 border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A] space-y-4">
              <h3 className="font-black text-sm text-hub-navy uppercase tracking-wider flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-emerald-600 text-xl">verified_user</span>
                <span>The CampusHub Guarantee</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A]">
                  <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">
                    timer
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 mb-0.5">24-Hour Moderation Cycle</h4>
                    <p className="text-slate-600 leading-relaxed font-semibold">
                      Requests are directly reviewed by department coordinators every morning and evening.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A]">
                  <span className="material-symbols-outlined text-sky-500 text-xl shrink-0 mt-0.5">
                    rule
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 mb-0.5">Handwritten &amp; OCR Quality Check</h4>
                    <p className="text-slate-600 leading-relaxed font-semibold">
                      No blurry photocopies. Notes and PYQs are scanned, indexed, and formatted for optimal printing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A]">
                  <span className="material-symbols-outlined text-emerald-500 text-xl shrink-0 mt-0.5">
                    lock_open
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 mb-0.5">100% Free &amp; Open Forever</h4>
                    <p className="text-slate-600 leading-relaxed font-semibold">
                      Zero paywalls, zero premium tiers. All community fulfilled files are published for all students.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="bg-white rounded-[28px] p-6 border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
              <h3 className="font-black text-sm text-hub-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-xl">help</span>
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-2.5">
                {FAQ_ITEMS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl border-2 border-[#0F172A] bg-[#FFFDF8] overflow-hidden shadow-[2px_2px_0_#0F172A] transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-3.5 text-left text-xs font-black text-slate-900 hover:bg-amber-50/50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                      >
                        <span>{faq.q}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="material-symbols-outlined text-base text-slate-600 shrink-0"
                        >
                          expand_more
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3.5 pb-3.5 text-[11px] text-slate-700 leading-relaxed font-semibold border-t-2 border-[#0F172A]/10 pt-2.5"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default Contact;
