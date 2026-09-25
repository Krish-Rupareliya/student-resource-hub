// ─── src/services/polls/pollsApi.js ──────────────────────────
// Public endpoints for campus referendums / polls.

import { fetchFromApi } from '../../lib/api';

/**
 * Fetch the currently active campus poll with real-time percentage stats.
 */
export async function getActivePoll() {
  return fetchFromApi('poll/active');
}

/**
 * Cast a vote on a specific poll option.
 * @param {string} pollId
 * @param {string} optionId
 */
export async function castVote(pollId, optionId) {
  return fetchFromApi(`poll/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionId }),
  });
}
