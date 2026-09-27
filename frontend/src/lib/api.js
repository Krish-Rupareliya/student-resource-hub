// ─── Central API Client ───────────────────────────────────────
// All frontend ↔ backend communication goes through this module.
// The browser NEVER talks to the database directly.

export let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Dynamic host resolution: If accessing via local IP (e.g. from a phone),
// replace "localhost" or "127.0.0.1" in the API URL with the actual host IP/domain.
if (
  (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) &&
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
) {
  API_BASE_URL = API_BASE_URL.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
}

/**
 * Read the admin access token stored in sessionStorage after login.
 * We use sessionStorage (not localStorage) so the token is wiped on tab-close.
 */
function getAccessToken() {
  return sessionStorage.getItem('admin_access_token') ?? null;
}

/**
 * Store or clear the access token.
 * Called exclusively from AdminAuthContext.
 */
export function setAccessToken(token) {
  if (token) {
    sessionStorage.setItem('admin_access_token', token);
  } else {
    sessionStorage.removeItem('admin_access_token');
  }
}

/**
 * Core fetch wrapper used by every service layer function.
 *
 * - Always sends `credentials: 'include'` so the HttpOnly refresh-token
 *   cookie is forwarded to the backend.
 * - Injects `Authorization: Bearer <token>` when an admin is logged in.
 * - Unwraps the standard `{ success, data }` envelope automatically.
 *
 * @param {string} endpoint  Relative path, e.g. "categories/semesters"
 * @param {RequestInit} options  Any standard fetch options
 */
export async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // always send the HttpOnly refresh-token cookie
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `Request failed with status ${response.status}`
    );
  }

  const json = await response.json();

  // Unwrap standard success envelope: { success: true, data: ... }
  if (json && json.success !== undefined && json.data !== undefined) {
    return json.data;
  }

  return json;
}
