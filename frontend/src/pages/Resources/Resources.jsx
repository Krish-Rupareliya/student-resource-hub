import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSemestersCatalog } from '../../services/resources/resourcesApi';
import { submitResourceUpload } from '../../services/uploads/uploadsApi';
import { submitResourceRequest } from '../../services/requests/requestsApi';
import { ToastContainer, useToast } from '../../components/ui/Toast';

// ─── Department Stream Definitions ──────────────────────────────
const DEPARTMENTS = [
  {
    code: 'CE',
    name: 'Computer Engineering (CE)',
    status: 'Available • Sem 1-8',
    statusBg: 'bg-[#4ADE80] text-[#0F172A]',
    icon: 'memory',
    accentColor: '#FF5722',
    targetRoute: '/semesters',
    desc: 'Complete curriculum matrix covering Algorithms, Microprocessors, Database Systems, Computer Networks, and AI viva preparations.',
    stats: ['38 Subjects', '310+ Solved PYQs', '64 Lab Files'],
    isAvailable: true,
  },
  {
    code: 'CSE',
    name: 'Computer Science & Engineering (CSE)',
    status: 'Available • Sem 1-8',
    statusBg: 'bg-[#38BDF8] text-[#0F172A]',
    icon: 'laptop_mac',
    accentColor: '#38BDF8',
    targetRoute: '/semesters?dept=CSE',
    desc: 'Curated specializations for Data Science, Cloud Architectures, Theory of Computation, and Compiler Design coursework.',
    stats: ['26 Subjects', '180+ Solved PYQs', '42 Lab Files'],
    isAvailable: true,
  },
  {
    code: 'IT',
    name: 'Information Technology (IT)',
    status: 'Available • Sem 1-8',
    statusBg: 'bg-[#FBCFE8] text-[#0F172A]',
    icon: 'dns',
    accentColor: '#F472B6',
    targetRoute: '/semesters?dept=IT',
    desc: 'Specialized materials for Web Systems, Cybersecurity fundamentals, Information Security, and Enterprise Java frameworks.',
    stats: ['18 Subjects', '115+ Solved PYQs', '30 Lab Files'],
    isAvailable: true,
  },
];

// ─── 4 Feature Cards ─────────────────────────────────────────────
const FEATURES = [
  {
    image: '/images/verified-content.png',
    title: 'Verified Content',
    desc: 'All resources are reviewed by subject matter experts and top-performing alumni.',
    badge: '100% Verified',
    badgeBg: 'bg-[#FEF08A] text-[#0F172A]',
  },
  {
    image: '/images/organized.png',
    title: 'Organized',
    desc: 'Structured by semester and category for zero-friction navigation through your degree.',
    badge: 'Sem 1-8 Matrix',
    badgeBg: 'bg-[#BAE6FD] text-[#0F172A]',
  },
  {
    image: '/images/fast-downloads.png',
    title: 'Fast Downloads',
    desc: 'Optimized PDF sizes and high-speed servers for instant access even on mobile data.',
    badge: 'Direct High-Speed',
    badgeBg: 'bg-[#BBF7D0] text-[#0F172A]',
  },
  {
    image: '/images/updated-regularly.png',
    title: 'Updated Regularly',
    desc: 'New syllabus changes and the latest session papers are added within 24 hours of release.',
    badge: '2024-25 Syllabus',
    badgeBg: 'bg-[#FBCFE8] text-[#0F172A]',
  },
];

// ─── Full Fallback Syllabus Catalog ──────────────────────────────
const DEPARTMENT_CATALOG_DEFAULTS = {
  CE: {
    1: [
      { code: 'CE0101', name: 'Mathematics - I', credits: 4 },
      { code: 'CE0102', name: 'Physics', credits: 4 },
      { code: 'CE0103', name: 'Basic Electronics', credits: 4 },
      { code: 'CE0104', name: 'Programming Fundamentals (C)', credits: 5 },
      { code: 'CE0105', name: 'Engineering Graphics', credits: 3 },
    ],
    2: [
      { code: 'CE0201', name: 'Mathematics - II', credits: 4 },
      { code: 'CE0202', name: 'Data Structures', credits: 5 },
      { code: 'CE0203', name: 'Digital Electronics', credits: 4 },
      { code: 'CE0204', name: 'Object Oriented Programming (C++)', credits: 4 },
      { code: 'CE0205', name: 'Environmental Science', credits: 2 },
    ],
    3: [
      { code: 'CE0301', name: 'Discrete Mathematics', credits: 4 },
      { code: 'CE0302', name: 'Computer Organization', credits: 4 },
      { code: 'CE0303', name: 'Database Management Systems', credits: 5 },
      { code: 'CE0304', name: 'Java Programming', credits: 5 },
      { code: 'CE0305', name: 'Probability & Statistics', credits: 4 },
    ],
    4: [
      { code: 'CE0401', name: 'Operating Systems', credits: 4 },
      { code: 'CE0402', name: 'Computer Networks', credits: 4 },
      { code: 'CE0403', name: 'Theory of Computation', credits: 4 },
      { code: 'CE0404', name: 'Software Engineering', credits: 4 },
      { code: 'CE0405', name: 'Web Development', credits: 4 },
    ],
    5: [
      { code: 'CE0501', name: 'Design & Analysis of Algorithms', credits: 5 },
      { code: 'CE0502', name: 'Compiler Design', credits: 4 },
      { code: 'CE0503', name: 'Artificial Intelligence', credits: 4 },
      { code: 'CE0504', name: 'Mobile Application Development', credits: 4 },
      { code: 'CE0505', name: 'Information Security', credits: 4 },
    ],
    6: [
      { code: 'CE0601', name: 'Machine Learning', credits: 4 },
      { code: 'CE0602', name: 'Cloud Computing', credits: 4 },
      { code: 'CE0603', name: 'Internet of Things', credits: 4 },
      { code: 'CE0604', name: 'Big Data Analytics', credits: 4 },
      { code: 'CE0605', name: 'Distributed Systems', credits: 4 },
    ],
    7: [
      { code: 'CE0701', name: 'Deep Learning', credits: 4 },
      { code: 'CE0702', name: 'Blockchain Technology', credits: 4 },
      { code: 'CE0703', name: 'Natural Language Processing', credits: 4 },
      { code: 'CE0704', name: 'DevOps & CI/CD', credits: 4 },
    ],
    8: [
      { code: 'CE0801', name: 'Project Management', credits: 3 },
      { code: 'CE0802', name: 'Ethics in Computing', credits: 3 },
      { code: 'CE0803', name: 'Major Project', credits: 12 },
    ],
  },
  CSE: {
    1: [
      { code: 'CS0101', name: 'Discrete Mathematics for CS', credits: 4 },
      { code: 'CS0102', name: 'Python Programming Lab', credits: 4 },
      { code: 'CS0103', name: 'Digital Logic Design', credits: 4 },
    ],
    2: [
      { code: 'CS0201', name: 'Linear Algebra & Numerical Methods', credits: 4 },
      { code: 'CS0202', name: 'Advanced C Programming & Pointers', credits: 5 },
      { code: 'CS0203', name: 'Object Oriented Paradigms (C++)', credits: 4 },
    ],
    3: [
      { code: 'CS0301', name: 'Advanced Data Structures & Algorithms', credits: 5 },
      { code: 'CS0302', name: 'Relational & NoSQL Database Systems', credits: 5 },
      { code: 'CS0303', name: 'Formal Languages & Automata', credits: 4 },
    ],
    4: [
      { code: 'CS0401', name: 'Design and Analysis of Algorithms (DAA)', credits: 5 },
      { code: 'CS0402', name: 'Modern Operating Systems & Kernel', credits: 4 },
      { code: 'CS0403', name: 'Java Enterprise Architecture', credits: 5 },
    ],
    5: [
      { code: 'CS0501', name: 'Artificial Intelligence & Search Tech', credits: 5 },
      { code: 'CS0502', name: 'Cloud Native Systems & Containers', credits: 4 },
      { code: 'CS0503', name: 'Big Data Processing (Hadoop/Spark)', credits: 4 },
    ],
    6: [
      { code: 'CS0601', name: 'Machine Learning & Deep Neural Nets', credits: 5 },
      { code: 'CS0602', name: 'Natural Language Processing (NLP)', credits: 4 },
      { code: 'CS0603', name: 'Distributed Systems & Blockchain', credits: 4 },
    ],
    7: [
      { code: 'CS0701', name: 'Reinforcement Learning & LLMs', credits: 4 },
      { code: 'CS0702', name: 'Information Retrieval & Search Engines', credits: 4 },
      { code: 'CS0703', name: 'Major Capstone Project - Phase 1', credits: 6 },
    ],
    8: [
      { code: 'CS0801', name: 'Full-Semester Industry Capstone', credits: 12 },
      { code: 'CS0802', name: 'Engineering Economics & IPR', credits: 3 },
    ],
  },
  IT: {
    1: [
      { code: 'IT0101', name: 'Information Technology Fundamentals', credits: 4 },
      { code: 'IT0102', name: 'Python for Data Analysis', credits: 4 },
      { code: 'IT0103', name: 'Applied Mathematics - 1', credits: 4 },
    ],
    2: [
      { code: 'IT0201', name: 'Applied Mathematics - 2', credits: 4 },
      { code: 'IT0202', name: 'Data Structures in C++', credits: 5 },
      { code: 'IT0203', name: 'Web Development Basics (HTML/CSS/JS)', credits: 4 },
    ],
    3: [
      { code: 'IT0301', name: 'Database Management Systems (SQL)', credits: 5 },
      { code: 'IT0302', name: 'Computer Organization & Architecture', credits: 4 },
      { code: 'IT0303', name: 'Core Java Programming', credits: 5 },
    ],
    4: [
      { code: 'IT0401', name: 'Operating System Principles', credits: 4 },
      { code: 'IT0402', name: 'Computer Communication Networks', credits: 4 },
      { code: 'IT0403', name: 'Fullstack Web Technologies (MERN)', credits: 5 },
    ],
    5: [
      { code: 'IT0501', name: 'Enterprise Java & Spring Boot', credits: 5 },
      { code: 'IT0502', name: 'Information & Network Security', credits: 4 },
      { code: 'IT0503', name: 'Mobile App Development', credits: 4 },
    ],
    6: [
      { code: 'IT0601', name: 'Data Mining & Business Analytics', credits: 4 },
      { code: 'IT0602', name: 'Cyber Forensics & Incident Response', credits: 4 },
      { code: 'IT0603', name: 'Internet of Things (IoT) & Sensors', credits: 4 },
    ],
    7: [
      { code: 'IT0701', name: 'Artificial Intelligence & Big Data', credits: 4 },
      { code: 'IT0702', name: 'DevOps & Site Reliability Eng', credits: 4 },
      { code: 'IT0703', name: 'IT Project - Phase 1', credits: 6 },
    ],
    8: [
      { code: 'IT0801', name: 'Industry Internship / Enterprise Project', credits: 12 },
      { code: 'IT0802', name: 'Cyber Law & Ethics', credits: 3 },
    ],
  },
};

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

const CHAPTER_WEIGHTAGE_DATA = [
  {
    chapter: 'Ch 1: Introduction to OS & System Calls',
    teachingHours: 5,
    weightage: '12%',
    marks: '8 - 10 Marks',
    questionType: 'Descriptive & Diagrams',
    frequency: 'Asked Every Winter & Summer',
    frequentQuestions: [
      'Q. Explain Dual Mode Operation (User vs Kernel Mode) with neat diagram. (7M)',
      'Q. Define System Calls and trace steps for open() / read() execution. (4M)',
    ],
  },
  {
    chapter: 'Ch 2: Process Management & CPU Scheduling',
    teachingHours: 8,
    weightage: '20%',
    marks: '14 - 16 Marks',
    questionType: 'Numerical & Algorithms',
    frequency: 'Guaranteed 14 Marks',
    frequentQuestions: [
      'Q. Numerical on FCFS, SJF (Preemptive/Non-preemptive), Round Robin with Gantt Chart. (7M)',
      'Q. Process State Transition Diagram with PCB components detailed description. (7M)',
    ],
  },
  {
    chapter: 'Ch 3: Process Synchronization & Deadlocks',
    teachingHours: 9,
    weightage: '24%',
    marks: '16 - 18 Marks',
    questionType: 'Code, Proofs & Numericals',
    frequency: 'High Weightage Core',
    frequentQuestions: [
      "Q. Explain Peterson's Algorithm solution for Critical Section Problem with C syntax. (7M)",
      "Q. Numerical on Banker's Algorithm for Deadlock Avoidance (Calculate Need Matrix & Safe Seq). (7M)",
    ],
  },
  {
    chapter: 'Ch 4: Memory Management & Virtual Memory',
    teachingHours: 8,
    weightage: '22%',
    marks: '14 - 16 Marks',
    questionType: 'Paging Diagrams & Page Replacement',
    frequency: 'Numericals Repeated 4x',
    frequentQuestions: [
      'Q. Numerical on Page Replacement Algorithms (FIFO, LRU, Optimal) calculate Page Faults. (7M)',
      'Q. Explain Paging hardware with TLB translation lookaside buffer architecture. (7M)',
    ],
  },
  {
    chapter: 'Ch 5: File Systems & Disk Scheduling',
    teachingHours: 6,
    weightage: '14%',
    marks: '10 - 12 Marks',
    questionType: 'Calculations & Tables',
    frequency: 'Regular Exam Slot',
    frequentQuestions: [
      'Q. Numerical on Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN) calculate total head movement. (7M)',
      'Q. Explain File Allocation Methods (Contiguous, Linked, Indexed) with tradeoffs. (4M/7M)',
    ],
  },
];

export default function Resources() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  // Dynamic Syllabus Catalog state
  const [dbCatalog, setDbCatalog] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const data = await fetchSemestersCatalog();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setDbCatalog(data);
        }
      } catch (err) {
        console.warn('Could not load live semester catalog:', err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract subjects for department and semester
  const getSubjectsForDepartmentAndSem = (deptCode, semNum) => {
    if (dbCatalog && dbCatalog.length > 0) {
      const match = dbCatalog.find(
        (s) =>
          (s.number === semNum || s.semesterNumber === semNum) &&
          (s.departmentCode === deptCode || !s.departmentCode || s.departmentCode === 'CE')
      );
      if (match?.subjects && Array.isArray(match.subjects) && match.subjects.length > 0) {
        return match.subjects.map((sub) => ({
          code: String(sub.code || sub.subjectCode || 'CE0401'),
          name: sub.name || sub.title || 'Course',
          credits: sub.credits || 4,
        }));
      }
    }
    const branchFallback = DEPARTMENT_CATALOG_DEFAULTS[deptCode] || DEPARTMENT_CATALOG_DEFAULTS.CE;
    return branchFallback[semNum] || branchFallback[4] || [];
  };

  // ─── Contributor Hub States ───
  const [vaultTab, setVaultTab] = useState('upload'); // 'upload' | 'request'

  // Upload Form States
  const [uploadDept, setUploadDept] = useState('CE');
  const [uploadSem, setUploadSem] = useState(4);
  const uploadDeptSubjects = getSubjectsForDepartmentAndSem(uploadDept, uploadSem);
  const [uploadSubjectCode, setUploadSubjectCode] = useState(uploadDeptSubjects[0]?.code || 'CE0401');
  const [uploadCategory, setUploadCategory] = useState('Notes');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadEmail, setUploadEmail] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');

  // Request Form States
  const [requestDept, setRequestDept] = useState('CE');
  const [requestSem, setRequestSem] = useState(4);
  const requestDeptSubjects = getSubjectsForDepartmentAndSem(requestDept, requestSem);
  const [requestSubjectCode, setRequestSubjectCode] = useState(requestDeptSubjects[0]?.code || 'CE0401');
  const [requestCategory, setRequestCategory] = useState('Notes');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  // Sync subject dropdown defaults when branch or semester changes
  useEffect(() => {
    const subs = getSubjectsForDepartmentAndSem(uploadDept, uploadSem);
    if (subs.length > 0 && !subs.some((s) => s.code === uploadSubjectCode)) {
      setUploadSubjectCode(subs[0].code);
    }
  }, [uploadDept, uploadSem]);

  useEffect(() => {
    const reqSubs = getSubjectsForDepartmentAndSem(requestDept, requestSem);
    if (reqSubs.length > 0 && !reqSubs.some((s) => s.code === requestSubjectCode)) {
      setRequestSubjectCode(reqSubs[0].code);
    }
  }, [requestDept, requestSem]);

  // Handle Drag & Drop Upload
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
      setUploadErrorMsg('');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadErrorMsg('');
    }
  };

  // Upload Submission Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadErrorMsg('Please provide a descriptive resource title.');
      return;
    }
    if (!uploadFile) {
      setUploadErrorMsg('Please select a PDF, Document, or Zip archive to upload.');
      return;
    }
    if (!uploadEmail.trim()) {
      setUploadErrorMsg('Your email is required for contributor credit and approval alert.');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress(15);
      setUploadErrorMsg('');

      const progTimer = setInterval(() => {
        setUploadProgress((p) => (p < 85 ? p + 15 : p));
      }, 200);

      const payload = {
        title: uploadTitle.trim(),
        subjectCode: uploadSubjectCode,
        resourceType: uploadCategory,
        contributorEmail: uploadEmail.trim(),
        authorAlias: uploadAuthor.trim() || 'Anonymous Topper',
        description: uploadDescription.trim() || `${uploadCategory} for ${uploadSubjectCode}`,
        file: uploadFile,
        ocrEnabled: ocrEnabled,
      };

      const result = await submitResourceUpload(payload);
      clearInterval(progTimer);
      setUploadProgress(100);

      if (result && !result.success && result.error) {
        throw new Error(result.error);
      }

      setUploadStatus('success');
      addToast({
        message: '🎉 Resource submitted! Sent to moderation queue with topper attribution.',
        type: 'success',
        duration: 5000,
      });

      // Reset form after short delay
      setTimeout(() => {
        setUploadTitle('');
        setUploadFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 3000);
    } catch (err) {
      setUploadStatus('error');
      setUploadErrorMsg(err.message || 'Failed to submit resource. Please check connection.');
      addToast({
        message: err.message || 'Upload failed. Please try again.',
        type: 'error',
        duration: 4000,
      });
    }
  };

  // Request Submission Handler
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) {
      addToast({
        message: '⚠️ Please describe what resource or paper you need.',
        type: 'error',
        duration: 3500,
      });
      return;
    }

    if (!requestEmail.trim() || !requestEmail.endsWith('@gmail.com')) {
      addToast({
        message: '⚠️ A valid @gmail.com email is required for fulfillment alerts.',
        type: 'error',
        duration: 3500,
      });
      return;
    }

    try {
      setRequestLoading(true);
      const res = await submitResourceRequest({
        subjectCode: requestSubjectCode || 'CE0401',
        resourceType: requestCategory,
        message: `[${requestDept} Sem ${requestSem}] ${requestMessage.trim()}`,
        requesterEmail: requestEmail.trim(),
      });

      if (res && !res.success && res.error) {
        throw new Error(res.error);
      }

      addToast({
        message: '🚀 Request submitted! We will alert your email once material is uploaded.',
        type: 'success',
        duration: 4500,
      });

      setRequestMessage('');
      setRequestEmail('');
    } catch (err) {
      addToast({
        message: err.message || 'Failed to submit request. Please try again.',
        type: 'error',
        duration: 4000,
      });
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-[#FDFBF7] text-hub-navy font-poppins min-h-screen relative overflow-hidden selection:bg-amber-300 selection:text-hub-navy">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ─── Background Decor Vector Layers ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Warm Cream Blob */}
        <div className="absolute top-[200px] -left-28 w-[280px] h-[380px] bg-amber-200/30 rounded-full blur-3xl lofty-pulse" />
        <div className="absolute top-[800px] -right-28 w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-3xl lofty-pulse" />

        {/* Far-Left Dots Grid */}
        <svg className="absolute top-14 left-4 w-16 h-28 opacity-40 lofty-float-slow" viewBox="0 0 60 140" fill="#F59E0B">
          <pattern id="r-dots-left" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2" />
          </pattern>
          <rect width="60" height="140" fill="url(#r-dots-left)" />
        </svg>

        {/* Top-Right Navy Dots Grid */}
        <svg className="absolute top-8 right-12 w-24 h-24 opacity-30 lofty-float" viewBox="0 0 100 100" fill="#0D1B40">
          <pattern id="r-dots-tr" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.2" />
          </pattern>
          <rect width="100" height="100" fill="url(#r-dots-tr)" />
        </svg>
      </div>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-6 pb-16 lg:pt-8 lg:pb-20 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-gray-500 mb-6">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-hub-navy font-bold">Resources</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 max-w-[560px]">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3D6] border border-amber-300/80 text-hub-navy text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
                <span>📚</span>
                <span>Academic Resources</span>
              </div>

              {/* Headline with Gold Brush Underline */}
              <h1 className="text-[40px] sm:text-5xl lg:text-[50px] xl:text-[54px] font-black text-hub-navy leading-[1.14] tracking-tight">
                Access All Your Academic
                <br />
                <span className="relative inline-block text-amber-500">
                  Resources
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 opacity-90"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
                {' '}in{' '}
                <span className="relative inline-block text-amber-500">
                  One Place
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 opacity-90"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M 0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed font-medium">
                Browse semester-wise notes, previous year papers, practical files, viva questions, question banks, syllabus, and other academic materials organized for easy access.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#departments"
                  className="inline-flex items-center gap-2.5 bg-hub-navy hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm cursor-pointer"
                >
                  <span>Explore Departments</span>
                  <span className="material-symbols-outlined text-lg leading-none">arrow_forward</span>
                </a>

                <a
                  href="#exam-strategy"
                  className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-hub-navy font-bold px-7 py-3.5 rounded-full border-2 border-amber-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm cursor-pointer"
                >
                  <span>Exam Blueprint</span>
                  <span className="material-symbols-outlined text-lg text-amber-600">analytics</span>
                </a>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-7 relative flex justify-center items-center lg:justify-end lg:pl-6">
              <div className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[720px] xl:max-w-[800px] lg:translate-x-8 xl:translate-x-12 transition-transform duration-500 hover:scale-[1.02]">
                <img
                  alt="Academic Resources Center Illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  src="/images/resource-hero-section.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. CHOOSE YOUR DEPARTMENT SECTION ─── */}
      <section id="departments" className="py-14 sm:py-20 relative scroll-mt-24 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2">
              <span>⚡</span>
              <span>CHOOSE YOUR STREAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
              Choose Your{' '}
              <span className="relative inline-block text-amber-500">
                Department
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 7 Q 25 1 50 7 Q 75 13 100 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-xl mx-auto pt-1">
              Select your engineering branch to access specialized academic resources, solved PYQs, and lab manuals.
            </p>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEPARTMENTS.map((dept) => {
              const liveSubjectsCount = (dept.code === 'CE' && dbCatalog)
                ? dbCatalog.reduce((sum, sem) => sum + (sem.subjects?.length || 0), 0)
                : 0;
              const liveStats = (liveSubjectsCount > 0)
                ? [`${liveSubjectsCount} Subjects`, dept.stats[1], dept.stats[2]]
                : dept.stats;

              return (
              <div
                key={dept.code}
                className="bg-white rounded-[32px] p-8 sm:p-9 border-[2.5px] border-[#0F172A] shadow-[5px_5px_0_#0F172A] hover:shadow-[8px_8px_0_#0F172A] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`${dept.statusBg} text-[10px] font-black px-3 py-1 rounded-full border border-[#0F172A] uppercase tracking-wider shadow-xs`}>
                    {dept.status}
                  </span>
                </div>

                {/* Amber Icon Badge */}
                <div className="w-18 h-18 rounded-2xl bg-[#FEF3D6] text-hub-navy border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] flex items-center justify-center mb-6 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="material-symbols-outlined text-4xl text-hub-navy">{dept.icon}</span>
                </div>

                <h3 className="text-xl font-black text-hub-navy mb-3 tracking-tight leading-snug">{dept.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium mb-6 max-w-[290px] mx-auto flex-1">
                  {dept.desc}
                </p>

                {/* Stats list */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                  {liveStats.map((st, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {st}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => navigate(dept.targetRoute)}
                  className="w-full sm:w-[90%] font-black py-3.5 rounded-full bg-hub-navy hover:bg-[#FF5722] text-white border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] hover:shadow-[5px_5px_0_#0F172A] transition-all duration-200 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 text-sm mt-auto cursor-pointer"
                >
                  <span>Explore Vault</span>
                  <span className="material-symbols-outlined text-base leading-none transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* ─── 3. WHY CHOOSE OUR RESOURCES (4 Feature Cards) ─── */}
      <section className="py-12 sm:py-16 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-hub-navy tracking-tight">
              Why Students Trust Our Repository
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Built for speed, accuracy, and syllabus completeness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 border-[2px] border-[#0F172A] shadow-[4px_4px_0_#0F172A] hover:shadow-[6px_6px_0_#0F172A] hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img src={feat.image} alt={feat.title} className="max-h-full max-w-full object-contain" />
                </div>
                <span className={`${feat.badgeBg} text-[10px] font-black px-2.5 py-0.5 rounded-md border border-[#0F172A] uppercase mb-2`}>
                  {feat.badge}
                </span>
                <h4 className="text-base font-black text-hub-navy mb-1">{feat.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. EXAM STRATEGY & MARK SPLITS SECTION ─── */}
      <section id="exam-strategy" className="py-14 sm:py-20 relative z-10 bg-[#FAF8FF] border-y-[3px] border-[#0F172A] scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFEDD5] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2.5">
                <span className="material-symbols-outlined text-[15px] text-[#FF5722]">analytics</span>
                <span>EXAM STRATEGY &amp; MARK SPLITS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-hub-navy leading-tight tracking-tight">
                Indus Paper Blueprint &amp; <span className="text-amber-500">Weightage Matrix</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-1">
                100-Mark university examination distribution &amp; high-yield question pattern.
              </p>
            </div>

            <div className="bg-white border-[2.5px] border-[#0F172A] p-4 shadow-[4px_4px_0_#0F172A] flex items-center gap-4 rounded-2xl">
              <div className="w-13 h-13 bg-[#FACC15] border-2 border-[#0F172A] flex items-center justify-center font-mono font-black text-xl sm:text-2xl rounded-xl shadow-[2px_2px_0_#0F172A]">
                100
              </div>
              <div>
                <p className="text-xs uppercase font-black text-[#0F172A]">External Exam</p>
                <p className="text-xs font-bold text-emerald-700">Passing Mark: 40/100</p>
              </div>
            </div>
          </div>

          {/* Blueprint Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border-[3px] border-[#0F172A] shadow-[6px_6px_0_#0F172A] rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-black text-hub-navy uppercase mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF5722]">format_list_numbered</span>
                Chapter-Wise Question Blueprint
              </h3>
              
              <div className="space-y-4">
                {CHAPTER_WEIGHTAGE_DATA.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8FF] hover:bg-[#F3E8FF]/40 border-[2px] border-[#0F172A] p-4 sm:p-5 rounded-2xl transition-colors shadow-[2px_2px_0_#0F172A]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="font-black text-sm sm:text-base text-[#0F172A]">{item.chapter}</h4>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FEF08A] text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded border border-[#0F172A]">
                          {item.weightage}
                        </span>
                        <span className="bg-[#4ADE80] text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded border border-[#0F172A]">
                          {item.marks}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mt-3 pt-2.5 border-t border-slate-200">
                      {item.frequentQuestions.map((fq, fIdx) => (
                        <p key={fIdx} className="text-xs font-semibold text-[#334155] flex items-start gap-2">
                          <span className="text-[#FF5722] font-black">★</span>
                          <span>{fq}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Topper Strategy Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#FEF9C3] border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FACC15] border-2 border-[#0F172A] text-xs font-black uppercase mb-3 shadow-xs">
                    <span className="material-symbols-outlined text-[15px] text-[#713F12]">lightbulb</span>
                    <span>Topper Exam Strategy</span>
                  </div>
                  <h4 className="text-lg font-black text-[#713F12] uppercase mb-2">
                    How to Score 85+ / 100
                  </h4>
                  <ul className="space-y-3 text-xs font-semibold text-[#854D0E] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                      <span><strong>Always draw boxed Safe Sequences</strong> in Banker’s algorithm questions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                      <span><strong>Include Time Milestone timelines</strong> in SJF and Round Robin Gantt charts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm text-[#FF5722] mt-0.5">check_circle</span>
                      <span><strong>Compile POSIX C code</strong> with `-pthread` flag during practical examinations.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-[#EAB308]/50 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#713F12]">Indus Evaluation Standard</span>
                  <span className="text-xs font-mono font-black bg-white px-2 py-0.5 rounded border border-[#0F172A]">Grade: AA (10)</span>
                </div>
              </div>

              <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0_#0F172A]">
                <h4 className="text-base font-black text-hub-navy uppercase mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">verified</span>
                  Need Specific Notes?
                </h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                  Request missing chapters or question banks below and our rankers will upload them directly.
                </p>
                <a
                  href="#community-hub"
                  className="w-full font-black py-3 rounded-xl bg-hub-navy hover:bg-[#FF5722] text-white border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] flex items-center justify-center gap-1.5 text-xs uppercase transition-all cursor-pointer"
                >
                  <span>Post a Request ↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. COMMUNITY CONTRIBUTOR HUB (Upload & Request Tabs with Semester Gating) ─── */}
      <section id="community-hub" className="py-14 sm:py-20 relative z-10 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-white border-[3px] border-[#0F172A] rounded-[36px] shadow-[8px_8px_0_#0F172A] p-6 sm:p-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0_#0F172A] text-[#0F172A] text-xs font-black uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[15px] text-[#FF5722]">handshake</span>
                  <span>COMMUNITY CONTRIBUTOR HUB</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-hub-navy tracking-tight">
                  Upload Notes or Request Materials
                </h2>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 bg-[#FAF8FF] p-1.5 rounded-2xl border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A]">
                <button
                  type="button"
                  onClick={() => setVaultTab('upload')}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    vaultTab === 'upload'
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-[#0F172A] hover:bg-slate-200'
                  }`}
                >
                  Upload Material
                </button>
                <button
                  type="button"
                  onClick={() => setVaultTab('request')}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    vaultTab === 'request'
                      ? 'bg-[#FF5722] text-white shadow-xs'
                      : 'text-[#0F172A] hover:bg-slate-200'
                  }`}
                >
                  Request Notes
                </button>
              </div>
            </div>

            {/* TAB 1: UPLOAD MATERIAL */}
            {vaultTab === 'upload' && (
              <form onSubmit={handleUploadSubmit} className="space-y-5">
                {uploadStatus === 'success' ? (
                  <div className="bg-emerald-50 border-[2.5px] border-emerald-500 p-6 rounded-2xl text-center space-y-2">
                    <span className="material-symbols-outlined text-4xl text-emerald-600">task_alt</span>
                    <h3 className="text-xl font-black text-emerald-800 uppercase">Upload Submitted Successfully!</h3>
                    <p className="text-xs font-semibold text-emerald-700 max-w-md mx-auto">
                      Thank you for contributing. Our academic moderators will review your file and attribute full topper credits to your profile.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Drag & Drop File Box */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      onClick={() => document.getElementById('resource-file-input').click()}
                      className="border-[2.5px] border-dashed border-[#0F172A] hover:border-[#FF5722] bg-[#FAF8FF] hover:bg-[#FFF7ED] p-6 sm:p-8 rounded-2xl text-center cursor-pointer transition-all group"
                    >
                      <input
                        id="resource-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.zip,.rar"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="material-symbols-outlined text-4xl text-amber-500 group-hover:scale-110 transition-transform block mb-2">
                        cloud_upload
                      </span>
                      <p className="font-black text-sm sm:text-base text-hub-navy">
                        {uploadFile ? uploadFile.name : 'Click or Drag & Drop PDF, Document, or Lab Zip here'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: PDF, Word, Zip files up to 15MB.
                      </p>
                    </div>

                    {/* Form Grid (Branch -> Semester -> Subject -> Category) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          1. Branch
                        </label>
                        <select
                          value={uploadDept}
                          onChange={(e) => setUploadDept(e.target.value)}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="CE">Computer (CE)</option>
                          <option value="CSE">Comp Science (CSE)</option>
                          <option value="IT">Info Tech (IT)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          2. Semester
                        </label>
                        <select
                          value={uploadSem}
                          onChange={(e) => setUploadSem(parseInt(e.target.value, 10))}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem}>
                              Semester {sem}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1 truncate">
                          3. Subject
                        </label>
                        <select
                          value={uploadSubjectCode}
                          onChange={(e) => setUploadSubjectCode(e.target.value)}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer truncate"
                        >
                          {uploadDeptSubjects.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          4. Type
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                        >
                          {RESOURCE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-xs uppercase font-black text-[#0F172A] block mb-1">
                        Resource Title <span className="text-[#FF5722]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. Unit 3 Trees & Graphs Master Handwritten Notes"
                        className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-3 text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722]"
                      />
                    </div>

                    {/* Contributor Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          Your Name / Alias <span className="text-gray-400 font-normal">(for credit badge)</span>
                        </label>
                        <input
                          type="text"
                          value={uploadAuthor}
                          onChange={(e) => setUploadAuthor(e.target.value)}
                          placeholder="e.g. Harshil Vora (LDCE)"
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                          Your Email <span className="text-[#FF5722]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={uploadEmail}
                          onChange={(e) => setUploadEmail(e.target.value)}
                          placeholder="student@college.edu or gmail"
                          className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Progress Bar & Error */}
                    {uploadStatus === 'uploading' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-black text-[#0F172A]">
                          <span>Uploading File...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 border border-[#0F172A] rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-[#4ADE80] rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {uploadErrorMsg && (
                      <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-300">
                        {uploadErrorMsg}
                      </p>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ocrEnabled}
                          onChange={(e) => setOcrEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#FF5722] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-700">
                          Enable automatic OCR indexing
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={uploadStatus === 'uploading'}
                        className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs sm:text-sm uppercase px-8 py-3 rounded-xl border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                      >
                        {uploadStatus === 'uploading' ? 'Publishing...' : 'Publish Resource'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* TAB 2: REQUEST MISSING NOTES */}
            {vaultTab === 'request' && (
              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div className="bg-[#FEF9C3] border-2 border-[#0F172A] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#713F12]">
                  <span className="material-symbols-outlined text-lg text-amber-600 mt-0.5 shrink-0">info</span>
                  <p className="font-semibold leading-relaxed">
                    Can’t find a specific chapter or previous year solution? Post your request here. Our campus toppers will upload it and notify your Gmail!
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                      Branch
                    </label>
                    <select
                      value={requestDept}
                      onChange={(e) => setRequestDept(e.target.value)}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="CE">Computer (CE)</option>
                      <option value="CSE">Comp Science (CSE)</option>
                      <option value="IT">Info Tech (IT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                      Semester
                    </label>
                    <select
                      value={requestSem}
                      onChange={(e) => setRequestSem(parseInt(e.target.value, 10))}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1 truncate">
                      Subject
                    </label>
                    <select
                      value={requestSubjectCode}
                      onChange={(e) => setRequestSubjectCode(e.target.value)}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer truncate"
                    >
                      {requestDeptSubjects.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-black text-[#0F172A] block mb-1">
                      Type
                    </label>
                    <select
                      value={requestCategory}
                      onChange={(e) => setRequestCategory(e.target.value)}
                      className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-2.5 text-xs font-bold text-[#0F172A] rounded-xl focus:outline-none cursor-pointer"
                    >
                      {RESOURCE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-black text-[#0F172A] block mb-1">
                    Describe What You Need <span className="text-[#FF5722]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="e.g. Need Indus Winter 2023 Solved Paper with Peterson's algorithm step-by-step solution."
                    className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-3 text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-black text-[#0F172A] block mb-1">
                    Your Gmail Email <span className="text-[#FF5722]">*</span> <span className="text-gray-400 font-normal">(for fulfillment alert)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#FAF8FF] border-[2px] border-[#0F172A] p-3 text-xs sm:text-sm font-bold text-[#0F172A] placeholder:text-slate-400 rounded-xl focus:outline-none focus:shadow-[2px_2px_0_#FF5722]"
                  />
                </div>

                <div className="pt-2 border-t-2 border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="bg-[#0F172A] hover:bg-[#FF5722] text-white font-black text-xs sm:text-sm uppercase px-8 py-3 rounded-xl border-2 border-[#0F172A] shadow-[3px_3px_0_#0F172A] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>{requestLoading ? 'Submitting...' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
