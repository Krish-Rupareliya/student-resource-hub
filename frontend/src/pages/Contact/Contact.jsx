import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useResourceRequest } from '../../hooks/useResourceRequest';
import { InlineError } from '../../components/ui/ErrorState';
import { ToastContainer, useToast } from '../../components/ui/Toast';
import { ConversationalHeading } from '../../components/ui/TextAnimations';

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
  },
  {
    step: '02',
    title: 'Peer & Senior Search',
    desc: 'Verified senior contributors and coordinators source or digitize the document.',
    icon: 'manage_search',
  },
  {
    step: '03',
    title: 'Verified & Published',
    desc: 'Quality-checked file is uploaded to the Hub and you receive an email link.',
    icon: 'verified',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How long does fulfillment usually take?',
    a: 'Most requests are resolved within 12 to 24 hours. Rare subject materials or newly introduced syllabus units may take up to 48 hours.',
  },
  {
    q: 'Are all requested resources free?',
    a: 'Yes, 100% free. CampusHub is an open student initiative — no paywalls, no premium subscriptions, ever.',
  },
  {
    q: 'Can I upload my own notes to help other students?',
    a: 'Absolutely! You can share your notes directly via our community links or reach out through the WhatsApp/Discord channels.',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, errorMessage]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const applyPreset = (preset) => {
    handleChange('resourceType', preset.type);
    if (!formData.message || formData.message.length < 15) {
      handleChange('message', preset.hint);
    }
  };

  return (
    <div className="pt-20 bg-[#f8fafc] text-slate-800 font-sans min-h-screen pb-24 relative overflow-x-clip selection:bg-amber-300 selection:text-slate-900">
      {/* ─── Ambient Canvas & Subtle Grid Pattern ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-amber-300/25 via-orange-300/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[30%] -right-24 w-[550px] h-[550px] bg-gradient-to-bl from-sky-300/25 via-indigo-300/15 to-transparent rounded-full blur-3xl opacity-65" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 pt-6">
        {/* ─── HERO HEADER ─── */}
        <section className="pt-4 pb-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>24-Hour Fulfillment Desk</span>
            <span className="text-amber-400">•</span>
            <span className="text-slate-600 font-semibold">Community Verified</span>
          </div>

          <ConversationalHeading
            prefix="Can't Find What You"
            highlight="Need?"
            className="text-3xl sm:text-4xl md:text-5xl text-slate-950 mb-4"
          />

          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-6">
            Submit your subject request below. Our network of student contributors, seniors, and coordinators will track down and verify the material for you.
          </p>

          {/* Quick Instant Channels Alert Bar */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-amber-950 max-w-2xl mx-auto shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">bolt</span>
              <span>Need urgent mid-sem exam papers in under 5 minutes?</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-[11px] border border-slate-900 shadow-2xs"
              >
                WhatsApp ↗
              </a>
              <a
                href="https://t.me/+fP4hKU69AQIwZjI1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-sky-400 hover:bg-sky-500 text-slate-950 font-black text-[11px] border border-slate-900 shadow-2xs"
              >
                Telegram ↗
              </a>
            </div>
          </div>
        </section>

        {/* ─── MAIN GRID (Form + Sidebar) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
              {/* Left Color Indicator Strip */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-500" />

              {/* Success Notification Banner */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-8 p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-emerald-600 text-[28px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-emerald-950 text-base">Request Dispatched Successfully!</h4>
                      <p className="text-emerald-800 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
                        Our student coordinators have received your request. We will notify you at your email as soon as the file is verified and published.
                      </p>
                      <button
                        onClick={reset}
                        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Submit Another Request</span>
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Topic Autofill Presets */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-500 text-[16px]">auto_awesome</span>
                  <span>Quick-Select Resource Type:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TOPICS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${formData.resourceType === preset.type
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50/70 hover:border-amber-300'
                        }`}
                    >
                      {preset.icon && <span className="material-symbols-outlined text-[15px]">{preset.icon}</span>}
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* The Form */}
              <form onSubmit={handleSubmit} noValidate aria-label="Resource request form" className="space-y-5">
                {/* Row 1: Subject Code & Resource Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject Code */}
                  <div>
                    <label htmlFor="subjectCode" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject Code / Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="subjectCode"
                      type="text"
                      value={formData.subjectCode}
                      onChange={(e) => handleChange('subjectCode', e.target.value.toUpperCase())}
                      placeholder="e.g. CE0516 or Data Structures"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Resource Type */}
                  <div>
                    <label htmlFor="resourceType" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                      Resource Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="resourceType"
                      value={formData.resourceType}
                      onChange={(e) => handleChange('resourceType', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-semibold text-slate-900 cursor-pointer"
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
                    <label htmlFor="message" className="block font-bold text-xs uppercase tracking-wider text-slate-700">
                      Describe What You Need <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      {formData.message?.length || 0} characters
                    </span>
                  </div>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="e.g. Need handwritten notes for Unit 3 of Operating Systems (CE0512) — specifically CPU Scheduling & Deadlocks with diagrams..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none leading-relaxed"
                    disabled={isLoading}
                    required
                    aria-required="true"
                  />
                  {errorMessage && <InlineError message={errorMessage} />}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="requesterEmail" className="block font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Email Address <span className="text-rose-500">*</span>{' '}
                    <span className="text-slate-400 font-normal lowercase">(must be @gmail.com)</span>
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
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                      disabled={isLoading}
                      required
                      aria-required="true"
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                      mail
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className="w-full bg-slate-950 hover:bg-amber-400 text-white hover:text-slate-950 font-black py-4 rounded-2xl text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        <span>Queuing Request...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
                        <span>Request Queued in Dashboard!</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>Submit Resource Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Workflow Pipeline Process Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">sync_alt</span>
                <span>How Your Request Gets Resolved</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {WORKFLOW_STEPS.map((step) => (
                  <div key={step.step} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black font-mono text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                          STEP {step.step}
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-slate-400">{step.icon}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Community Direct Connect Card */}
            <div className="bg-[#0B132B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none">
                  <pattern id="request-side-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#request-side-grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Peer Help</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight text-white">
                  Need an Answer in Minutes?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Connect with batch seniors, top students, and subject moderators on our official WhatsApp &amp; Discord student groups.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://chat.whatsapp.com/GwqyqTTNYQK18JsJSfnmFB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Join WhatsApp Student Community</span>
                  </a>

                  <a
                    href="https://t.me/+fP4hKU69AQIwZjI1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#229ED9] hover:bg-[#1d8bc0] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Join Telegram Channel</span>
                  </a>

                  <Link
                    to="/resources"
                    className="w-full py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 transition-all text-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    <span>Browse Existing Catalog</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quality & Trust Cards */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-emerald-500 text-[20px]">verified_user</span>
                <span>The CampusHub Guarantee</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">
                    timer
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">24-Hour Moderation Cycle</h4>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Requests are directly reviewed by department coordinators every morning and evening.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="material-symbols-outlined text-sky-500 text-[20px] shrink-0 mt-0.5">
                    rule
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">Handwritten &amp; OCR Quality Check</h4>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      No blurry photocopies. Notes and PYQs are scanned, indexed, and formatted for optimal printing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">help</span>
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-2">
                {FAQ_ITEMS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200/70 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-3.5 text-left text-xs font-bold text-slate-900 hover:bg-slate-50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                      >
                        <span>{faq.q}</span>
                        <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-3.5 pb-3.5 text-[11px] text-slate-600 leading-relaxed font-medium border-t border-slate-100"
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
