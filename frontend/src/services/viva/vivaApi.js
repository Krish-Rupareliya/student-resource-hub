// frontend/src/services/viva/vivaApi.js
/**
 * Viva API Service — Communicates with the Backend Proxy.
 * Strictly adheres to Frontend Isolation and Backend Proxy constraints.
 */

import { fetchFromApi } from '../../lib/api';

/**
 * Fetch viva syllabus, questions, and experiments for a subject.
 * Proxies request through backend /api/viva/:subjectCode.
 * All questions are purely dynamic from the database.
 *
 * @param {string} subjectCode 
 * @param {Object} [subjectMetadata] Optional cached metadata from subject catalog
 * @returns {Promise<Object>}
 */
export async function getSubjectVivaData(subjectCode, subjectMetadata = {}) {
  if (!subjectCode) return null;
  const normalizedCode = subjectCode.toUpperCase().trim();

  try {
    const data = await fetchFromApi(`viva/${normalizedCode}`);
    return data || {
      subjectCode: normalizedCode,
      sections: [],
      questions: [],
      experiments: [],
      isDbManaged: true,
    };
  } catch (err) {
    console.warn(`Failed to fetch viva questions for ${normalizedCode}:`, err);
    return {
      subjectCode: normalizedCode,
      sections: [],
      questions: [],
      experiments: [],
      isDbManaged: true,
    };
  }
}
