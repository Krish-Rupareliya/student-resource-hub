// ─── src/services/admin/adminApi.js ──────────────────────────
// All authenticated admin API calls.
// Bearer token is injected automatically by fetchFromApi via sessionStorage.

import { fetchFromApi, setAccessToken } from '../../lib/api';
import { clearHomepageSettingsCache } from '../settings/settingsApi';
import { clearCatalogCache } from '../resources/resourcesApi';
import { clearMemoryCache } from '../../hooks/useFetch';

// ─── Auth ────────────────────────────────────────────────────

export async function adminLogin({ email, password }) {
  const data = await fetchFromApi('admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function adminMe() {
  return fetchFromApi('admin/auth/me');
}

export async function adminLogout() {
  try {
    await fetchFromApi('admin/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}

// ─── Uploads (student submissions) ───────────────────────────

// GET /api/admin/uploads?status=PENDING|APPROVED|REJECTED
export async function getAdminUploads(status = 'PENDING') {
  return fetchFromApi(`admin/uploads?status=${status}`);
}

// PATCH /api/admin/uploads/:id  body: { action: 'APPROVED'|'REJECTED', title?, subjectCode?, resourceType? }
export async function reviewUpload(id, action, updatedData = {}) {
  const result = await fetchFromApi(`admin/uploads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action, ...updatedData }),
  });
  if (action === 'APPROVED') {
    clearCatalogCache();
    clearMemoryCache();
  }
  return result;
}

// ─── Resource Requests ────────────────────────────────────────

// GET /api/admin/requests?status=PENDING|APPROVED|REJECTED
export async function getAdminRequests(status = 'PENDING') {
  return fetchFromApi(`admin/requests?status=${status}`);
}

// PATCH /api/admin/requests/:id  body: { action: 'APPROVED'|'REJECTED' }
export async function reviewRequest(id, action) {
  return fetchFromApi(`admin/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

// ─── Resources ───────────────────────────────────────────────

// GET /api/admin/resources?subjectCode=&search=
export async function getAdminResources({ subjectCode = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (subjectCode) params.set('subjectCode', subjectCode);
  if (search) params.set('search', search);
  const qs = params.toString();
  return fetchFromApi(`admin/resources${qs ? `?${qs}` : ''}`);
}

// POST /api/admin/resources  (JSON — URL-based resource)
export async function createResource({ subjectId, title, resourceType, fileUrl, description, source }) {
  const result = await fetchFromApi('admin/resources', {
    method: 'POST',
    body: JSON.stringify({ subjectId, title, resourceType, fileUrl, description, source }),
  });
  clearCatalogCache();
  clearMemoryCache();
  return result;
}

// POST /api/admin/resources  (multipart — file upload)
export async function createResourceWithFile(formData) {
  // Do NOT set Content-Type — browser sets multipart boundary automatically
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  const token = sessionStorage.getItem('admin_access_token');
  const res = await fetch(`${API_BASE_URL}/admin/resources`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${res.status}`);
  }
  const json = await res.json();
  clearCatalogCache();
  clearMemoryCache();
  return json.data ?? json;
}

// PUT /api/admin/resources/:id
export async function updateResource(id, data) {
  const result = await fetchFromApi(`admin/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  clearCatalogCache();
  clearMemoryCache();
  return result;
}

// DELETE /api/admin/resources/:id  (soft-delete)
export async function deleteResource(id) {
  const result = await fetchFromApi(`admin/resources/${id}`, { method: 'DELETE' });
  clearCatalogCache();
  clearMemoryCache();
  return result;
}

// POST /api/admin/resources/bulk-delete  (hard-delete selected IDs + Drive files)
export async function bulkDeleteResources(ids) {
  const result = await fetchFromApi('admin/resources/bulk-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  clearCatalogCache();
  clearMemoryCache();
  return result;
}

// ─── Opportunities ────────────────────────────────────────────

// GET /api/admin/opportunities
export async function getAdminOpportunities() {
  return fetchFromApi('admin/opportunities');
}

// POST /api/admin/opportunities
export async function createOpportunity({ title, description, category, tag, pinBg, link, deadline }) {
  const result = await fetchFromApi('admin/opportunities', {
    method: 'POST',
    body: JSON.stringify({ title, description, category, tag, pinBg, link, deadline }),
  });
  clearMemoryCache('opportunities');
  return result;
}

// PUT /api/admin/opportunities/:id
export async function updateOpportunity(id, data) {
  const result = await fetchFromApi(`admin/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  clearMemoryCache('opportunities');
  return result;
}

// PATCH /api/admin/opportunities/:id/toggle
export async function toggleOpportunity(id) {
  const result = await fetchFromApi(`admin/opportunities/${id}/toggle`, { method: 'PATCH' });
  clearMemoryCache('opportunities');
  return result;
}

// DELETE /api/admin/opportunities/:id
export async function deleteOpportunity(id) {
  const result = await fetchFromApi(`admin/opportunities/${id}`, { method: 'DELETE' });
  clearMemoryCache('opportunities');
  return result;
}

// ─── Announcements ────────────────────────────────────────────

// GET /api/admin/announcements
export async function getAdminAnnouncements() {
  return fetchFromApi('admin/announcements');
}

// POST /api/admin/announcements
export async function createAnnouncement({ text, badge, color, deadline }) {
  const result = await fetchFromApi('admin/announcements', {
    method: 'POST',
    body: JSON.stringify({ text, badge, color, deadline }),
  });
  clearMemoryCache('announcements');
  return result;
}

// PUT /api/admin/announcements/:id
export async function updateAnnouncement(id, data) {
  const result = await fetchFromApi(`admin/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  clearMemoryCache('announcements');
  return result;
}

// PATCH /api/admin/announcements/:id/toggle
export async function toggleAnnouncement(id) {
  const result = await fetchFromApi(`admin/announcements/${id}/toggle`, { method: 'PATCH' });
  clearMemoryCache('announcements');
  return result;
}

// DELETE /api/admin/announcements/:id
export async function deleteAnnouncement(id) {
  const result = await fetchFromApi(`admin/announcements/${id}`, { method: 'DELETE' });
  clearMemoryCache('announcements');
  return result;
}

// ─── Subscribers (Newsletter Audience) ────────────────────────

// GET /api/admin/subscribers
export async function getAdminSubscribers() {
  return fetchFromApi('admin/subscribers');
}

// DELETE /api/admin/subscribers/:id
export async function deleteAdminSubscriber(id) {
  return fetchFromApi(`admin/subscribers/${id}`, { method: 'DELETE' });
}

// ─── Polls / Referendums ─────────────────────────────────────

// GET /api/admin/polls
export async function getAdminPolls() {
  return fetchFromApi('admin/polls');
}

// POST /api/admin/polls
export async function createAdminPoll(data) {
  return fetchFromApi('admin/polls', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT /api/admin/polls/:id
export async function updateAdminPoll(id, data) {
  return fetchFromApi(`admin/polls/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// PATCH /api/admin/polls/:id/toggle
export async function toggleAdminPoll(id) {
  return fetchFromApi(`admin/polls/${id}/toggle`, { method: 'PATCH' });
}

// POST /api/admin/polls/:id/sync-votes
export async function syncAdminPollVotes(id, optionVotes) {
  return fetchFromApi(`admin/polls/${id}/sync-votes`, {
    method: 'POST',
    body: JSON.stringify({ optionVotes }),
  });
}

// DELETE /api/admin/polls/:id
export async function deleteAdminPoll(id) {
  return fetchFromApi(`admin/polls/${id}`, { method: 'DELETE' });
}

// ─── Bulk Review Uploads ──────────────────────────────────────
// POST /api/admin/uploads/bulk-review
export async function bulkReviewUploads(ids, action) {
  return fetchFromApi('admin/uploads/bulk-review', {
    method: 'POST',
    body: JSON.stringify({ ids, action }),
  });
}

// ─── Catalog (for subject picker in resource form) ────────────
export async function getAdminCatalog() {
  return fetchFromApi('categories/semesters');
}

// ─── Analytics & Telemetry ───────────────────────────────────
// GET /api/admin/analytics/dashboard
export async function getAdminDashboardAnalytics() {
  return fetchFromApi('admin/analytics/dashboard');
}

// ─── Homepage Settings (Live Semester Clock & Trending) ──────
// GET /api/admin/settings/homepage
export async function getAdminHomepageSettings() {
  return fetchFromApi('admin/settings/homepage');
}

// PUT /api/admin/settings/homepage
export async function updateAdminHomepageSettings(data) {
  return fetchFromApi('admin/settings/homepage', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// PUT /api/admin/settings/live-clock
export async function updateAdminLiveClock(liveClockData) {
  const res = await fetchFromApi('admin/settings/live-clock', {
    method: 'PUT',
    body: JSON.stringify(liveClockData),
  });
  clearHomepageSettingsCache();
  return res;
}

// PUT /api/admin/settings/trending
export async function updateAdminTrending(trendingData) {
  const res = await fetchFromApi('admin/settings/trending', {
    method: 'PUT',
    body: JSON.stringify(trendingData),
  });
  clearHomepageSettingsCache();
  return res;
}

// POST /api/admin/settings/upload-pack-file (multipart — upload study pack file)
export async function uploadAdminPackFile(file) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  const token = sessionStorage.getItem('admin_access_token');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/admin/settings/upload-pack-file`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `File upload failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data ?? json;
}

// PUT /api/admin/settings/video
export async function updateAdminVideo(videoData) {
  const res = await fetchFromApi('admin/settings/video', {
    method: 'PUT',
    body: JSON.stringify(videoData),
  });
  clearHomepageSettingsCache();
  return res;
}

// PUT /api/admin/settings/learning-platforms
export async function updateAdminLearningPlatforms(platformsData) {
  const res = await fetchFromApi('admin/settings/learning-platforms', {
    method: 'PUT',
    body: JSON.stringify(platformsData),
  });
  clearHomepageSettingsCache();
  return res;
}

// PUT /api/admin/settings/community-groups
export async function updateAdminCommunityGroups(groupsData) {
  const res = await fetchFromApi('admin/settings/community-groups', {
    method: 'PUT',
    body: JSON.stringify(groupsData),
  });
  clearHomepageSettingsCache();
  return res;
}

// Aliases for convenience
export const reviewAdminUpload = reviewUpload;
export const reviewAdminRequest = reviewRequest;




