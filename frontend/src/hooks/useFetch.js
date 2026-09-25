import { useState, useEffect, useCallback } from 'react';

// In-memory response cache to eliminate repetitive skeleton flashing across navigation
const memoryCache = new Map();

/**
 * Enhanced async data-fetching hook with memory cache & stale-while-revalidate.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array that triggers re-fetch when changed
 * @param {Object} options - Optional caching parameters ({ cacheKey, ttl })
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function }}
 */
export function useFetch(fetchFn, deps = [], options = {}) {
  const { cacheKey = null, ttl = 60000 } = options;
  const cached = cacheKey ? memoryCache.get(cacheKey) : null;
  const isCacheValid = cached && Date.now() - cached.timestamp < ttl;

  const [data, setData] = useState(() => (isCacheValid ? cached.data : null));
  const [loading, setLoading] = useState(() => !isCacheValid);
  const [error, setError] = useState(null);

  const execute = useCallback(async (bypassCache = false) => {
    if (!bypassCache && cacheKey) {
      const entry = memoryCache.get(cacheKey);
      if (entry && Date.now() - entry.timestamp < ttl) {
        setData(entry.data);
        setLoading(false);
        return;
      }
    }

    // If we already have data from cache, don't show full skeleton loader
    if (!data) setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      if (cacheKey) {
        memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: () => execute(true) };
}

/**
 * Invalidate in-memory cached responses.
 * @param {string|null} key - Optional specific cache key to clear. If omitted, clears entire cache.
 */
export function clearMemoryCache(key = null) {
  if (key) {
    memoryCache.delete(key);
  } else {
    memoryCache.clear();
  }
}

