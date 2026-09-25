import { useState, useEffect, useCallback } from 'react';
import { getSubjectByCode } from '../services/resources/resourcesApi';

/**
 * Hook: fetch subject metadata (title, code, semester, department) by subject code.
 *
 * @param {string} subjectCode
 * @returns {{ subject: Object|null, loading: boolean, error: string|null, refetch: Function }}
 */
export function useSubject(subjectCode) {
  const normalized = (subjectCode || '').trim();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(Boolean(normalized));
  const [error, setError] = useState(null);

  const fetchSubject = useCallback(async () => {
    if (!normalized) {
      setSubject(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getSubjectByCode(normalized);
      setSubject(data);
    } catch (err) {
      setError(err.message || 'Failed to load subject');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  return { subject, loading, error, refetch: fetchSubject };
}
