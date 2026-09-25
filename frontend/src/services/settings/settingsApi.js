// src/services/settings/settingsApi.js
// Public API access for site settings, platform stats overview, and announcements
import { fetchFromApi } from '../../lib/api';

let cachedHomepageSettings = null;
let cacheTimestamp = 0;
let inFlightPromise = null;
const CACHE_TTL = 30 * 1000; // 30 seconds

export function clearHomepageSettingsCache() {
  cachedHomepageSettings = null;
  cacheTimestamp = 0;
  inFlightPromise = null;
}

export async function getPublicHomepageSettings(forceRefresh = false) {
  if (forceRefresh) {
    clearHomepageSettingsCache();
  }
  const now = Date.now();
  if (!forceRefresh && cachedHomepageSettings && now - cacheTimestamp < CACHE_TTL) {
    return cachedHomepageSettings;
  }
  if (!forceRefresh && inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const response = await fetchFromApi('settings/homepage');
      const data = response?.data || response;
      cachedHomepageSettings = data;
      cacheTimestamp = Date.now();
      return data;
    } catch (err) {
      console.warn('[settingsApi] Failed to fetch homepage settings, using fallback:', err.message);
      if (cachedHomepageSettings) return cachedHomepageSettings;
      return null;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export async function getPublicOverviewStats() {
  try {
    const response = await fetchFromApi('stats/overview');
    return response?.data || response;
  } catch (err) {
    console.warn('[settingsApi] Failed to fetch overview stats:', err.message);
    return null;
  }
}

export async function getPublicAnnouncements() {
  try {
    const response = await fetchFromApi('announcements');
    return response?.data || response || [];
  } catch (err) {
    console.warn('[settingsApi] Failed to fetch announcements:', err.message);
    return [];
  }
}
