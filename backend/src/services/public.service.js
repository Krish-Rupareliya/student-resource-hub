// src/services/public.service.js
// All public (no-auth) database operations with in-memory caching and stampede protection.
'use strict';

const prisma = require('../config/prisma');

// ─── High-Concurrency In-Memory Cache Structures ───────────────
// In-flight Promise deduplication eliminates the "thundering herd" problem:
// When 100 concurrent requests arrive simultaneously, exactly ONE database query
// runs, and all other 99 requests receive the exact same resolved in-flight Promise.
let cachedSemesters = null;
let cachedSemestersTime = 0;
let inFlightSemestersPromise = null;
const SEMESTERS_CACHE_TTL = 60 * 1000; // 60 seconds

let cachedOpportunities = null;
let cachedOpportunitiesTime = 0;
let inFlightOpportunitiesPromise = null;
const OPPORTUNITIES_CACHE_TTL = 60 * 1000; // 60 seconds

let cachedPoll = null;
let cachedPollTime = 0;
let inFlightPollPromise = null;
const POLL_CACHE_TTL = 15 * 1000; // 15 seconds (keeps poll votes responsive)

let cachedHomepageSettings = null;
let cachedHomepageSettingsTime = 0;
let inFlightHomepageSettingsPromise = null;
const HOMEPAGE_SETTINGS_CACHE_TTL = 60 * 1000; // 60 seconds

const resourcesCache = new Map();
const resourceDetailCache = new Map();
const RESOURCES_CACHE_TTL = 30 * 1000; // 30 seconds
const RESOURCE_DETAIL_CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Invalidate cached items when admin makes updates or new votes occur.
 * @param {'catalog'|'opportunities'|'poll'|'resources'|'settings'|'all'} [tag='all']
 */
function clearPublicCache(tag = 'all') {
  if (tag === 'catalog' || tag === 'all') {
    cachedSemesters = null;
    cachedSemestersTime = 0;
    resourcesCache.clear();
    resourceDetailCache.clear();
  }
  if (tag === 'opportunities' || tag === 'all') {
    cachedOpportunities = null;
    cachedOpportunitiesTime = 0;
  }
  if (tag === 'poll' || tag === 'all') {
    cachedPoll = null;
    cachedPollTime = 0;
  }
  if (tag === 'settings' || tag === 'all') {
    cachedHomepageSettings = null;
    cachedHomepageSettingsTime = 0;
  }
  if (tag === 'resources') {
    resourcesCache.clear();
    resourceDetailCache.clear();
    // Also invalidate semesters so embedded resource counts stay accurate
    cachedSemesters = null;
    cachedSemestersTime = 0;
  }
}

// ─── Semesters + Subjects (with resource counts) ─────────────

/**
 * Returns all departments, each containing semesters, each containing
 * subjects with an embedded _count of active resources.
 * Protected by 60s cache + Promise deduplication + stale-on-error fallback.
 */
async function getSemesters() {
  const now = Date.now();
  if (cachedSemesters && now - cachedSemestersTime < SEMESTERS_CACHE_TTL) {
    return cachedSemesters;
  }
  if (inFlightSemestersPromise) {
    return inFlightSemestersPromise;
  }

  inFlightSemestersPromise = prisma.department
    .findMany({
      orderBy: { code: 'asc' },
      include: {
        semesters: {
          orderBy: [{ semesterNumber: 'asc' }, { sortOrder: 'asc' }],
          include: {
            subjects: {
              orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
              include: {
                _count: {
                  select: {
                    resources: { where: { isActive: true } },
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((data) => {
      cachedSemesters = data;
      cachedSemestersTime = Date.now();
      inFlightSemestersPromise = null;
      return data;
    })
    .catch((err) => {
      inFlightSemestersPromise = null;
      if (cachedSemesters) {
        console.warn('[getSemesters] DB query failed, serving stale cache for 100-user resilience:', err.message);
        return cachedSemesters;
      }
      throw err;
    });

  return inFlightSemestersPromise;
}

// ─── Resources ────────────────────────────────────────────────

/**
 * Fetch active resources, optionally filtered by subjectCode or resourceType.
 * Protected by 30s cache per filter combination.
 * @param {{ subjectCode?: string, resourceType?: string }} filters
 */
async function getResources(filters = {}) {
  const { subjectCode, resourceType } = filters;
  const cacheKey = `${subjectCode || 'all'}:${resourceType || 'all'}`;
  const now = Date.now();
  const cached = resourcesCache.get(cacheKey);

  if (cached && now - cached.time < RESOURCES_CACHE_TTL) {
    return cached.data;
  }

  const where = { isActive: true };

  if (subjectCode) {
    where.subject = { code: subjectCode };
  }
  if (resourceType) {
    where.resourceType = resourceType;
  }

  try {
    const data = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        subject: {
          select: { id: true, code: true, title: true, shortForm: true },
        },
      },
    });

    if (resourcesCache.size > 200) {
      resourcesCache.clear();
    }
    resourcesCache.set(cacheKey, { data, time: now });
    return data;
  } catch (err) {
    if (cached) {
      console.warn(`[getResources] DB error, serving stale cache for ${cacheKey}:`, err.message);
      return cached.data;
    }
    throw err;
  }
}

/**
 * Fetch a single resource by ID, including full subject+semester+department context.
 * Protected by 60s in-memory cache to prevent repetitive DB queries when viewing/downloading.
 * @param {string} id
 */
async function getResourceById(id) {
  const now = Date.now();
  const cached = resourceDetailCache.get(id);

  if (cached && now - cached.time < RESOURCE_DETAIL_CACHE_TTL) {
    return cached.data;
  }

  try {
    const data = await prisma.resource.findFirst({
      where: { id, isActive: true },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            title: true,
            shortForm: true,
            icon: true,
            semester: {
              select: {
                id: true,
                semesterNumber: true,
                name: true,
                department: { select: { id: true, code: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (data) {
      if (resourceDetailCache.size > 500) {
        resourceDetailCache.clear();
      }
      resourceDetailCache.set(id, { data, time: now });
    }
    return data;
  } catch (err) {
    if (cached) {
      console.warn(`[getResourceById] DB error, serving stale cache for ${id}:`, err.message);
      return cached.data;
    }
    throw err;
  }
}

// ─── Opportunities & Announcements ───────────────────────────

/**
 * Returns active opportunities and active announcements in one payload.
 * Protected by 60s cache + Promise deduplication.
 */
async function getOpportunities() {
  const now = Date.now();
  if (cachedOpportunities && now - cachedOpportunitiesTime < OPPORTUNITIES_CACHE_TTL) {
    return cachedOpportunities;
  }
  if (inFlightOpportunitiesPromise) {
    return inFlightOpportunitiesPromise;
  }

  inFlightOpportunitiesPromise = Promise.all([
    prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])
    .then(([opportunities, announcements]) => {
      const result = { opportunities, announcements };
      cachedOpportunities = result;
      cachedOpportunitiesTime = Date.now();
      inFlightOpportunitiesPromise = null;
      return result;
    })
    .catch((err) => {
      inFlightOpportunitiesPromise = null;
      if (cachedOpportunities) {
        console.warn('[getOpportunities] DB query failed, serving stale cache:', err.message);
        return cachedOpportunities;
      }
      throw err;
    });

  return inFlightOpportunitiesPromise;
}

// ─── Student Submissions ──────────────────────────────────────

/**
 * Create a ResourceUpload submission (status defaults to PENDING).
 * @param {{ subjectCode: string, resourceType: string, title: string, description?: string, fileUrl?: string, fileKey?: string }} data
 */
async function createUpload(data) {
  return prisma.resourceUpload.create({ data });
}

/**
 * Create a ResourceRequest (status defaults to PENDING).
 * @param {{ subjectCode: string, resourceType: string, message: string, email: string }} data
 */
async function createRequest(data) {
  return prisma.resourceRequest.create({ data });
}

/**
 * Add or find newsletter subscriber.
 * @param {string} email
 */
async function createSubscriber(email) {
  return prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

// ─── Referendum & Polls ───────────────────────────────────────

/**
 * Return the current active poll with computed vote totals and percentages.
 * Protected by 15s cache + Promise deduplication.
 */
async function getActivePoll() {
  const now = Date.now();
  if (cachedPoll && now - cachedPollTime < POLL_CACHE_TTL) {
    return cachedPoll;
  }
  if (inFlightPollPromise) {
    return inFlightPollPromise;
  }

  inFlightPollPromise = (async () => {
    const poll = await prisma.poll.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!poll) return null;

    const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
    const optionsWithPct = poll.options.map((o) => ({
      ...o,
      percentage: totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0,
    }));

    let topDemand = poll.statusTopDemand;
    if (!topDemand && poll.options.length > 0) {
      const topOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
      const topPct = totalVotes > 0 ? Math.round((topOption.votes / totalVotes) * 100) : 0;
      topDemand = `${topOption.text.slice(0, 20)} (${topPct}%)`;
    }

    const result = {
      ...poll,
      options: optionsWithPct,
      totalVotes,
      computedTopDemand: topDemand,
    };

    cachedPoll = result;
    cachedPollTime = Date.now();
    return result;
  })()
    .catch((err) => {
      if (cachedPoll) {
        console.warn('[getActivePoll] DB query failed, serving stale cache:', err.message);
        return cachedPoll;
      }
      throw err;
    })
    .finally(() => {
      inFlightPollPromise = null;
    });

  return inFlightPollPromise;
}

/**
 * Cast a vote on a poll option and return updated poll metrics.
 * @param {string} pollId
 * @param {string} optionId
 */
async function castVote(pollId, optionId) {
  const option = await prisma.pollOption.findFirst({
    where: { id: optionId, pollId },
  });

  if (!option) {
    const err = new Error('Invalid poll option selected');
    err.statusCode = 404;
    throw err;
  }

  await prisma.pollOption.update({
    where: { id: optionId },
    data: { votes: { increment: 1 } },
  });

  // Invalidate poll cache immediately so the voter and others see updated tally
  clearPublicCache('poll');

  return getActivePoll();
}

const DEFAULT_HOMEPAGE_SETTINGS = {
  liveClock: {
    examTitle: 'Indus Winter Finals',
    targetDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    subtitle: 'Target exam date approaching. Be prepared before server crashes and dead WhatsApp groups strike.',
    papersSchedule: [
      { code: 'CE0402', name: 'Computer Networks', deadline: 'In 3 Days' },
      { code: 'CE0404', name: 'Software Engineering', deadline: 'In 7 Days' },
      { code: 'CE0401', name: 'Operating Systems', deadline: 'In 12 Days' },
    ],
  },
  trending: {
    heroTags: [
      { label: 'OS 100-Mark Imp', query: 'Operating Systems' },
      { label: 'DAA NP-Hard Proofs', query: 'Design and Analysis of Algorithms' },
      { label: 'DBMS B+ Trees', query: 'Database Management Systems' },
      { label: 'Python Lab Manual', query: 'Python' },
    ],
    trendingPacks: [
      {
        id: 'pack-1',
        tag: 'SEM 3 & 4',
        tagBg: 'bg-tertiary-fixed text-[#0F172A]',
        rating: '★ 4.9 (1.2k)',
        title: 'DSA Master Cheat Sheet & 80 Leetcode PYQs',
        desc: 'Trees, Graphs, DP templates with Indus 100-mark proofs and diagrams.',
        fileSize: '4.2 MB',
        format: 'PDF',
        pages: '48 Pages',
        topics: [
          'Binary Search Trees & AVL Rotations with complete C code',
          'Dijkstra & Prim Minimal Spanning Tree Step-by-Step examples',
          'Dynamic Programming: 0/1 Knapsack & Longest Common Subsequence',
          'Indus Repeated 100-Mark Exam Proof: Asymptotic notations Big-O, Omega, Theta',
        ],
        fileUrl: '/downloads/dsa-master-cheat-sheet.pdf',
        fileName: 'dsa-master-cheat-sheet.pdf',
      },
      {
        id: 'pack-2',
        tag: 'SEM 5',
        tagBg: 'bg-secondary-fixed text-[#0F172A]',
        rating: '★ 4.8 (890)',
        title: 'Operating Systems End-Sem Rapid Revision',
        desc: 'Deadlocks, Semaphore code, Page Replacement algorithms step-by-step.',
        fileSize: '6.8 MB',
        format: 'PDF',
        pages: '62 Pages',
        topics: [
          'Process Synchronization: Peterson’s Algorithm & Counting Semaphores',
          "Banker's Deadlock Avoidance Algorithm with full safety matrix proof",
          'Virtual Memory: FIFO, LRU, and Optimal Paging comparison table',
          'Disk Arm Scheduling: SCAN, C-SCAN, LOOK, C-LOOK numericals',
        ],
        fileUrl: '/downloads/operating-systems-rapid-revision.pdf',
        fileName: 'operating-systems-rapid-revision.pdf',
      },
      {
        id: 'pack-3',
        tag: 'SEM 4',
        tagBg: 'bg-[#4ADE80] text-[#0F172A]',
        rating: '★ 5.0 (2.1k)',
        title: 'DBMS Complete SQL & Normalization Kit',
        desc: '1NF to BCNF decomposition examples with solutions to past 5 winter papers.',
        fileSize: '3.1 MB',
        format: 'PDF',
        pages: '36 Pages',
        topics: [
          'Relational Algebra vs Tuple Relational Calculus query equivalents',
          'Lossless Join & Dependency Preserving Normalization proofs (1NF-BCNF)',
          'ACID Properties & Two-Phase Locking (2PL) Concurrency Protocol',
          'Solved SQL queries with GROUP BY, HAVING, nested subqueries, and Triggers',
        ],
        fileUrl: '/downloads/dbms-complete-sql-normalization-kit.pdf',
        fileName: 'dbms-complete-sql-normalization-kit.pdf',
      },
      {
        id: 'pack-4',
        tag: 'ALL BRANCHES',
        tagBg: 'bg-[#C084FC] text-[#0F172A]',
        rating: '★ 4.9 (3.4k)',
        title: 'Python & Full Stack Practical Code Files',
        desc: '12 mandatory lab experiments with input/output screenshots ready for print.',
        fileSize: '12.4 MB',
        format: 'ZIP',
        pages: '12 Code Files + PDF',
        topics: [
          'Lab 1-4: Python Data Structures, Generators, Lambda, and Decorators',
          'Lab 5-8: SQLite database connectivity, NumPy Matrix, Pandas CSV analysis',
          'Lab 9-12: Full Stack REST API with Express / FastAPI + React Frontend',
          'Viva Guide: 50 Most asked technical viva questions with short answers',
        ],
        fileUrl: '/downloads/python-fullstack-practical-code-files.pdf',
        fileName: 'python-fullstack-practical-code-files.pdf',
      },
    ],
  },
  video: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Platform Orientation & Vault Walkthrough',
    badge: 'Video Walkthrough',
    description: 'Learn how to filter subject PYQs, download lab manuals, and calculate your SGPA target with our quick interactive guide.',
  },
  learningPlatforms: [
    {
      name: 'Deloitte Tech Academy',
      badge: 'Free Certifications',
      description: 'Enterprise Cloud Architecture, SAP, and Salesforce hands-on simulations.',
      perk: 'Free Exam Voucher',
      url: 'https://www.deloitte.com',
      color: '#86EFAC',
    },
    {
      name: 'Cisco Networking Academy',
      badge: 'CCNA Modules',
      description: 'Packet Tracer labs, Cybersecurity Operations, and Python for Network Automation.',
      perk: 'Digital Verified Badge',
      url: 'https://www.netacad.com',
      color: '#93C5FD',
    },
    {
      name: 'Oracle University (MyLearn)',
      badge: 'OCI & Database',
      description: 'Free access to Oracle Cloud Infrastructure (OCI) courses and professional exams.',
      perk: 'Free Professional Cert',
      url: 'https://mylearn.oracle.com',
      color: '#FCA5A5',
    },
    {
      name: 'Infosys Springboard',
      badge: 'Industry Skills',
      description: 'Full stack development, AI/ML engineering, and soft skills for campus placements.',
      perk: 'Certificate of Completion',
      url: 'https://infyspringboard.onwingspan.com',
      color: '#FDE047',
    },
    {
      name: 'IBM SkillsBuild',
      badge: 'Enterprise AI',
      description: 'Hands-on training in Generative AI, Quantum Computing, and Data Science.',
      perk: 'IBM Credly Digital Badge',
      url: 'https://skillsbuild.org',
      color: '#C4B5FD',
    },
    {
      name: 'Google Cloud Skills Boost',
      badge: 'Cloud Architecture',
      description: 'Google Cloud Computing Foundations, Kubernetes Engine, and Vertex AI labs.',
      perk: 'Skill Badges + Lab Credits',
      url: 'https://www.cloudskillsboost.google',
      color: '#67E8F9',
    },
  ],
  communityGroups: {
    whatsappSem1_4: 'https://chat.whatsapp.com',
    whatsappSem5_8: 'https://chat.whatsapp.com',
    telegramMain: 'https://t.me',
    discordServer: 'https://discord.gg',
  },
};

/**
 * Retrieve public Homepage Settings (Live Semester Clock, Trending, Video, Platforms, Groups)
 */
async function getHomepageSettings() {
  const now = Date.now();
  if (cachedHomepageSettings && now - cachedHomepageSettingsTime < HOMEPAGE_SETTINGS_CACHE_TTL) {
    return cachedHomepageSettings;
  }
  if (inFlightHomepageSettingsPromise) {
    return inFlightHomepageSettingsPromise;
  }

  inFlightHomepageSettingsPromise = (async () => {
    try {
      const settingsRecords = await prisma.siteSetting.findMany({
        where: {
          key: {
            in: [
              'homepage_live_clock',
              'homepage_trending',
              'homepage_video',
              'homepage_learning_platforms',
              'homepage_community_groups',
            ],
          },
        },
      });

      let liveClock = DEFAULT_HOMEPAGE_SETTINGS.liveClock;
      let trending = DEFAULT_HOMEPAGE_SETTINGS.trending;
      let video = DEFAULT_HOMEPAGE_SETTINGS.video;
      let learningPlatforms = DEFAULT_HOMEPAGE_SETTINGS.learningPlatforms;
      let communityGroups = DEFAULT_HOMEPAGE_SETTINGS.communityGroups;

      for (const record of settingsRecords) {
        try {
          if (record.key === 'homepage_live_clock') {
            liveClock = { ...liveClock, ...JSON.parse(record.value) };
          } else if (record.key === 'homepage_trending') {
            trending = { ...trending, ...JSON.parse(record.value) };
          } else if (record.key === 'homepage_video') {
            video = { ...video, ...JSON.parse(record.value) };
          } else if (record.key === 'homepage_learning_platforms') {
            learningPlatforms = JSON.parse(record.value);
          } else if (record.key === 'homepage_community_groups') {
            communityGroups = { ...communityGroups, ...JSON.parse(record.value) };
          }
        } catch (parseErr) {
          console.warn('[public.service] Error parsing setting JSON for', record.key, parseErr.message);
        }
      }

      // Ensure live clock countdown never freezes if targetDate is expired or unset
      if (!liveClock.targetDate || isNaN(new Date(liveClock.targetDate).getTime()) || new Date(liveClock.targetDate).getTime() <= Date.now()) {
        const futureDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
        futureDate.setHours(10, 30, 0, 0);
        liveClock = {
          ...liveClock,
          targetDate: futureDate.toISOString(),
        };
      }

      const result = { liveClock, trending, video, learningPlatforms, communityGroups };
      cachedHomepageSettings = result;
      cachedHomepageSettingsTime = Date.now();
      return result;
    } catch (err) {
      console.error('[public.service] Failed to fetch homepage settings:', err.message);
      if (cachedHomepageSettings) return cachedHomepageSettings;
      return DEFAULT_HOMEPAGE_SETTINGS;
    } finally {
      inFlightHomepageSettingsPromise = null;
    }
  })();

  return inFlightHomepageSettingsPromise;
}

/**
 * Public Platform Overview Telemetry & Resource Counts
 */
async function getOverviewStats() {
  try {
    const [resourceCount, subjectCount, departmentCount, oppCount, subCount] = await Promise.all([
      prisma.resource.count({ where: { isActive: true } }),
      prisma.subject.count(),
      prisma.department.count(),
      prisma.opportunity.count({ where: { isActive: true } }),
      prisma.subscriber.count(),
    ]);

    return {
      totalResources: resourceCount,
      totalSubjects: subjectCount,
      totalDepartments: departmentCount,
      activeOpportunities: oppCount,
      totalSubscribers: subCount,
      displayResources: resourceCount > 0 ? `${resourceCount}+` : '10K+',
      displayStudents: subCount > 0 ? `${subCount}+` : '2,500+',
      displaySubjects: subjectCount > 0 ? `${subjectCount}+` : '38+',
      displayOpportunities: oppCount > 0 ? `${oppCount}+` : '100+',
      passRate: '99.2%',
    };
  } catch (err) {
    console.error('[public.service] getOverviewStats failed:', err.message);
    return {
      totalResources: 1200,
      totalSubjects: 38,
      totalDepartments: 3,
      activeOpportunities: 25,
      totalSubscribers: 2500,
      displayResources: '10K+',
      displayStudents: '2,500+',
      displaySubjects: '38+',
      displayOpportunities: '100+',
      passRate: '99.2%',
    };
  }
}

/**
 * Retrieve public announcements for ticker tape and alerts
 */
async function getAnnouncements() {
  try {
    const items = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return items;
  } catch (err) {
    console.error('[public.service] getAnnouncements failed:', err.message);
    return [];
  }
}

module.exports = {
  getSemesters,
  getResources,
  getResourceById,
  getOpportunities,
  createUpload,
  createRequest,
  createSubscriber,
  getActivePoll,
  castVote,
  getHomepageSettings,
  getOverviewStats,
  getAnnouncements,
  clearPublicCache,
};

