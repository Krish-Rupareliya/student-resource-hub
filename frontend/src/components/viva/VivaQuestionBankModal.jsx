// frontend/src/components/viva/VivaQuestionBankModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VivaQuestionBankModal({
  subject,
  onClose,
  onOpenResourceUpload
}) {
  const [activeTab, setActiveTab] = useState('source'); // 'source' | 'contribute'
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customUnit, setCustomUnit] = useState('Unit 1');
  const [submitted, setSubmitted] = useState(false);

  const subjectTitle = subject?.title || subject?.subjectName || 'Subject';
  const subjectCode = (subject?.code || subject?.subjectCode || '').toUpperCase();

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuestionText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCustomQuestionText('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-black rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black/10">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black">
              <span className="material-symbols-outlined text-2xl">description</span>
            </span>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-black">
                Question Bank &amp; Source Documentation
              </h3>
              <p className="text-xs text-gray-500 font-semibold">
                {subjectTitle} ({subjectCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 border border-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('source')}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
              activeTab === 'source'
                ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-2xs'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Verified Source Materials
          </button>
          <button
            onClick={() => setActiveTab('contribute')}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
              activeTab === 'contribute'
                ? 'bg-[#0F172A] text-[#FBBF24] border-black shadow-2xs'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Contribute Questions / Files
          </button>
        </div>

        {/* Tab 1: Source Materials */}
        {activeTab === 'source' && (
          <div className="space-y-4">
            <div className="bg-[#FFFDF5] border-2 border-black rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase text-amber-900">
                <span className="material-symbols-outlined text-[18px] text-amber-600">verified</span>
                Primary Verified University Question Bank
              </div>
              <h4 className="font-black text-base text-black mb-1">
                Indus Institute of Technology &amp; Engineering — Indus University
              </h4>
              <p className="text-xs text-gray-600 font-semibold mb-3">
                Subject: {subjectTitle} ({subjectCode}) • End Sem Exam Question Bank (Units 1-4)
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2 text-xs text-gray-700 font-medium">
                <div className="flex items-center justify-between">
                  <span>• Unit 1: Introduction to Computer Networks, Data Link Layer</span>
                  <strong className="text-black">11 Solved Q&amp;As</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Unit 2: Medium Access Sub-layer</span>
                  <strong className="text-black">10 Solved Q&amp;As</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Unit 3: Network Layer</span>
                  <strong className="text-black">22 Solved Q&amp;As</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Unit 4: Transport Layer, Application Layer</span>
                  <strong className="text-black">26 Solved Q&amp;As</strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span>• Practical Lab Manual Experiments</span>
                  <strong className="text-emerald-700 font-black">8 Verified Practicals</strong>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs font-medium text-sky-900 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-lg shrink-0 mt-0.5">info</span>
              <span>
                All questions maintain original university question numbering and technical meaning. Solutions have been formatted into direct answers, explanations, oral bullet points, and examiner follow-up questions.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onOpenResourceUpload}
                className="btn-black-yellow px-5 py-2.5 rounded-xl font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs active-press"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                Upload Supplementary PDF or Lab Manual
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Contribute Questions */}
        {activeTab === 'contribute' && (
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Have recent mid-semester viva questions or external examiner questions from your laboratory exam? Submit them below to be reviewed and included in the verified student bank!
            </p>

            <div>
              <label className="text-xs font-black uppercase text-gray-700 block mb-1.5">
                Target Unit / Section:
              </label>
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Unit 1">Unit 1</option>
                <option value="Unit 2">Unit 2</option>
                <option value="Unit 3">Unit 3</option>
                <option value="Unit 4">Unit 4</option>
                <option value="Practical Lab">Practical Lab Experiment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-gray-700 block mb-1.5">
                Paste Question &amp; Notes:
              </label>
              <textarea
                rows={5}
                value={customQuestionText}
                onChange={(e) => setCustomQuestionText(e.target.value)}
                placeholder="Paste the viva question text, examiner follow-ups, or lab experiment details here..."
                required
                className="w-full bg-[#FFFDF5] border-2 border-black rounded-xl p-3 text-xs sm:text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {submitted ? (
              <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-950 p-3 rounded-xl font-black text-xs text-center">
                ✓ Thank you! Question submitted for verification and indexing.
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onOpenResourceUpload}
                  className="text-xs font-black text-amber-700 hover:text-black transition-colors"
                >
                  Upload Full PDF Document instead →
                </button>

                <button
                  type="submit"
                  className="btn-black-yellow px-5 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-xs active-press"
                >
                  Submit Question
                </button>
              </div>
            )}
          </form>
        )}

      </motion.div>
    </div>
  );
}
