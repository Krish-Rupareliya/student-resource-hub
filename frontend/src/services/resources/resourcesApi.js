import { fetchFromApi } from '../../lib/api';
import { semestersData } from '../../data/semestersData';

const TIMEOUT_MS = 8000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  );
  return Promise.race([promise, timeout]);
}

// In-memory catalog cache (60s TTL) and in-flight promise deduplicator
let cachedCatalog = null;
let lastCatalogFetchTime = 0;
let inFlightCatalogPromise = null;
const CATALOG_CACHE_TTL = 60000;

/**
 * Clear the in-memory catalog cache so subsequent reads fetch fresh data.
 */
export function clearCatalogCache() {
  cachedCatalog = null;
  lastCatalogFetchTime = 0;
  inFlightCatalogPromise = null;
}

export async function fetchSemestersCatalog(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedCatalog && now - lastCatalogFetchTime < CATALOG_CACHE_TTL) {
    return cachedCatalog;
  }
  if (!forceRefresh && inFlightCatalogPromise) {
    return inFlightCatalogPromise;
  }

  inFlightCatalogPromise = withTimeout(fetchFromApi('categories/semesters'))
    .then((data) => {
      cachedCatalog = data;
      lastCatalogFetchTime = Date.now();
      inFlightCatalogPromise = null;
      return data;
    })
    .catch((err) => {
      inFlightCatalogPromise = null;
      throw err;
    });

  return inFlightCatalogPromise;
}

export async function getSemesters() {
  try {
    const data = await fetchSemestersCatalog();
    const dept = data.find(d => d.code === 'CE') || data[0];
    if (dept && dept.semesters) {
      return dept.semesters.map(sem => {
        const count = sem.subjects?.reduce((acc, subj) => acc + (subj._count?.resources || 0), 0) || 0;
        return { ...sem, resourcesCount: `${count}+ Resources` };
      });
    }
    return [];
  } catch (err) {
    console.warn('[resourcesApi] getSemesters failed, falling back to static data:', err.message);
    return semestersData;
  }
}

export async function getSemesterById(semesterId) {
  try {
    const data = await fetchSemestersCatalog();
    for (const dept of data) {
      const sem = dept.semesters?.find((s) => s.id === parseInt(semesterId));
      if (sem) {
        const count = sem.subjects?.reduce((acc, subj) => acc + (subj._count?.resources || 0), 0) || 0;
        const mappedSubjects = sem.subjects?.map(subj => ({
          ...subj,
          resourcesCount: `${subj._count?.resources || 0}+ Resources`
        })) || [];
        return { ...sem, subjects: mappedSubjects, resourcesCount: `${count}+ Resources` };
      }
    }
    return null;
  } catch (err) {
    console.warn(`[resourcesApi] getSemesterById(${semesterId}) failed, using static fallback:`, err.message);
    return semestersData.find((s) => s.id === parseInt(semesterId)) ?? null;
  }
}

export async function getResourcesBySubject(subjectCode) {
  if (!subjectCode) return [];
  try {
    const data = await withTimeout(fetchFromApi(`resources?subjectCode=${subjectCode}`));
    return data;
  } catch (err) {
    console.error(`[resourcesApi] getResourcesBySubject(${subjectCode}) failed:`, err.message);
    throw err;
  }
}

export async function getResourceById(id) {
  if (!id) return null;
  try {
    const data = await withTimeout(fetchFromApi(`resources/${id}`));
    return data;
  } catch (err) {
    console.error(`[resourcesApi] getResourceById(${id}) failed:`, err.message);
    return null;
  }
}

export async function getSubjectByCode(subjectCode) {
  if (!subjectCode) return null;
  const target = subjectCode.toLowerCase().trim();
  const cleanTarget = target.replace(/[-\s_]/g, '');

  const matches = (s) => {
    const sCode = s.code.toLowerCase();
    const sPath = (s.path || '').toLowerCase();

    // 1. Direct or sanitized code match
    if (sCode === target || sCode.replace(/[-\s_]/g, '') === cleanTarget) {
      return true;
    }

    // 2. Dynamic shortForm tokens (supports multi-alias e.g. "DBMS, DMS" or "OPER-SYS / OS")
    if (s.shortForm) {
      const tokens = s.shortForm
        .split(/[,/|]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      for (const tok of tokens) {
        if (tok === target || tok.replace(/[-\s_]/g, '') === cleanTarget) {
          return true;
        }
      }
    }

    // 3. Path slug match
    if (sPath === `/subject/${target}` || sPath.endsWith(`/${target}`)) {
      return true;
    }

    // 4. Dynamic algorithmic acronym from title (stopword filtered)
    if (s.title) {
      const words = s.title
        .split(/[\s-]+/)
        .filter((w) => !['and', 'of', '&', 'for', 'in', 'with', 'to', 'the', 'a', 'an'].includes(w.toLowerCase()));
      const acronym = words.map((w) => w[0]).join('').toLowerCase();
      if (acronym.length >= 2 && (acronym === target || acronym === cleanTarget)) {
        return true;
      }
    }

    return false;
  };

  try {
    const data = await fetchSemestersCatalog();
    for (const dept of data) {
      if (!dept.semesters) continue;
      for (const sem of dept.semesters) {
        if (!sem.subjects) continue;
        const subject = sem.subjects.find(matches);
        if (subject) {
          return { ...subject, semester: sem, department: dept };
        }
      }
    }

    // Static fallback if not matched in live catalog
    for (const sem of semestersData) {
      if (!sem.subjects) continue;
      const subject = sem.subjects.find(matches);
      if (subject) {
        return { ...subject, semester: sem, department: { code: 'CE', name: 'Computer Engineering' } };
      }
    }
    return null;
  } catch (err) {
    console.warn(`[resourcesApi] getSubjectByCode(${subjectCode}) failed:`, err.message);
    return null;
  }
}

export async function searchAllSubjects(query) {
  if (!query || query.trim() === '') return [];
  const lowerQuery = query.toLowerCase().trim();
  const cleanQuery = lowerQuery.replace(/[-\s_]/g, '');

  const matchSubject = (s) => {
    const codeMatch = s.code.toLowerCase().includes(lowerQuery) || s.code.toLowerCase().replace(/[-\s_]/g, '').includes(cleanQuery);
    const titleMatch = s.title.toLowerCase().includes(lowerQuery);

    let shortFormMatch = false;
    if (s.shortForm) {
      const tokens = s.shortForm
        .split(/[,/|]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      shortFormMatch = tokens.some(
        (tok) =>
          tok.includes(lowerQuery) ||
          tok.replace(/[-\s_]/g, '').includes(cleanQuery) ||
          lowerQuery.includes(tok)
      );
    }

    // Word boundary and acronym matching
    const words = s.title.split(/[\s-]+/);
    const acronym = words.map((w) => w[0]).join('').toLowerCase();
    const filteredWords = words.filter((w) => !['and', 'of', '&', 'for', 'in', 'with', 'to', 'the', 'a', 'an'].includes(w.toLowerCase()));
    const strictAcronym = filteredWords.map((w) => w[0]).join('').toLowerCase();
    const pathSlug = (s.path || '').replace('/subject/', '').toLowerCase();

    const aliasMatch =
      acronym.includes(lowerQuery) ||
      strictAcronym.includes(lowerQuery) ||
      pathSlug.includes(lowerQuery);

    return codeMatch || titleMatch || shortFormMatch || aliasMatch;
  };

  try {
    const data = await fetchSemestersCatalog();
    const allSubjects = [];

    for (const dept of data) {
      if (!dept.semesters) continue;
      for (const sem of dept.semesters) {
        if (!sem.subjects) continue;
        for (const subject of sem.subjects) {
          allSubjects.push({ ...subject, semester: sem, department: dept });
        }
      }
    }

    return allSubjects.filter(matchSubject);
  } catch (err) {
    console.warn(`[resourcesApi] searchAllSubjects failed, using fallback:`, err.message);
    const allSubjects = [];
    for (const sem of semestersData) {
      if (!sem.subjects) continue;
      for (const subject of sem.subjects) {
        allSubjects.push({ ...subject, semester: sem, department: { code: 'CE', name: 'Computer Engineering' } });
      }
    }

    return allSubjects.filter(matchSubject);
  }
}
