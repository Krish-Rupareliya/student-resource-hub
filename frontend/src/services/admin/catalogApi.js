// src/services/admin/catalogApi.js
// All catalog CRUD calls — goes through the backend proxy (never direct DB).
import { fetchFromApi } from '../../lib/api';
import { clearCatalogCache } from '../resources/resourcesApi';
import { clearMemoryCache } from '../../hooks/useFetch';

function invalidateCatalog() {
  clearCatalogCache();
  clearMemoryCache();
}

// ─── Departments ──────────────────────────────────────────────

/** Fetch full department hierarchy (with semesters + subjects nested). */
export function getAdminDepartments() {
  return fetchFromApi('admin/catalog/departments');
}

/** Create a new department/branch. */
export async function createDepartment(data) {
  const result = await fetchFromApi('admin/catalog/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  invalidateCatalog();
  return result;
}

/** Edit an existing department. */
export async function updateDepartment(id, data) {
  const result = await fetchFromApi(`admin/catalog/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  invalidateCatalog();
  return result;
}

/** Delete a department (only succeeds if it has no semesters). */
export async function deleteDepartment(id) {
  const result = await fetchFromApi(`admin/catalog/departments/${id}`, { method: 'DELETE' });
  invalidateCatalog();
  return result;
}

// ─── Semesters ────────────────────────────────────────────────

/** Create a semester under a given department. */
export async function createSemester(data) {
  const result = await fetchFromApi('admin/catalog/semesters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  invalidateCatalog();
  return result;
}

/** Edit semester metadata. */
export async function updateSemester(id, data) {
  const result = await fetchFromApi(`admin/catalog/semesters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  invalidateCatalog();
  return result;
}

/** Delete a semester (only succeeds if it has no subjects). */
export async function deleteSemester(id) {
  const result = await fetchFromApi(`admin/catalog/semesters/${id}`, { method: 'DELETE' });
  invalidateCatalog();
  return result;
}

/**
 * Cascade-delete a semester along with ALL its subjects + resources.
 * Also triggers backend Drive cleanup for every resource file.
 */
export async function deleteSemesterCascade(id) {
  const result = await fetchFromApi(`admin/catalog/semesters/${id}/cascade`, { method: 'DELETE' });
  invalidateCatalog();
  return result;
}

// ─── Subjects ─────────────────────────────────────────────────

/** Create a subject under a given semester. */
export async function createSubject(data) {
  const result = await fetchFromApi('admin/catalog/subjects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  invalidateCatalog();
  return result;
}

/** Edit subject metadata. */
export async function updateSubject(id, data) {
  const result = await fetchFromApi(`admin/catalog/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  invalidateCatalog();
  return result;
}

/** Delete a subject (only succeeds if it has no active resources). */
export async function deleteSubject(id) {
  const result = await fetchFromApi(`admin/catalog/subjects/${id}`, { method: 'DELETE' });
  invalidateCatalog();
  return result;
}

