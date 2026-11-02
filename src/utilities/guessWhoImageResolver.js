/**
 * ============================================================================
 * GUESS WHO? IMAGE ASSET RESOLVER & RELIABILITY UTILITY
 * ============================================================================
 * 
 * Provides resilient image URL resolution:
 * 1. Prioritizes the actual `question.image_url` (or `local_asset_path`)
 *    supplied directly by Agent 2's dataset.
 * 2. Directly supports Agent 2's verified project asset directory:
 *    `/assets/guess-who/` and `/assets/guess-who/logos/`.
 * 3. Does NOT prepend speculative `/images/guess-who/` paths ahead of valid dataset paths.
 * 4. Preserves canonical external Wikimedia Commons URLs for all records without local copies.
 * 5. Provides fallback candidates if primary local/remote files fail.
 */

/**
 * Returns prioritized candidate URLs for a given puzzle question.
 * @param {Object} question - Question object from question library
 * @returns {string[]} Array of candidate image URLs in priority order
 */
export const getImageCandidates = (question) => {
  if (!question) return [];

  const candidates = [];

  // 1. Explicit local asset path if annotated in dataset record
  if (question.local_asset_path) {
    candidates.push(question.local_asset_path);
  }
  if (question.local_image_url) {
    candidates.push(question.local_image_url);
  }
  if (question.image_path) {
    candidates.push(question.image_path);
  }

  // 2. PRIMARY DATASET URL (Prioritized as authored by Agent 2)
  // For the 23 local assets, this is '/assets/guess-who/...'.
  // For all other records, this is the canonical Wikimedia Commons URL.
  if (question.image_url) {
    candidates.push(question.image_url);
  }

  // 3. External backup URL if present and distinct from primary
  if (question.external_image_url && question.external_image_url !== question.image_url) {
    candidates.push(question.external_image_url);
  }

  // 4. Fallback convention in Agent 2's verified asset directory (/assets/guess-who/)
  if (question.id) {
    candidates.push(`/assets/guess-who/logos/${question.id}.svg`);
    candidates.push(`/assets/guess-who/${question.id}.jpg`);
    candidates.push(`/assets/guess-who/${question.id}.png`);
    candidates.push(`/assets/guess-who/${question.id}.webp`);
    candidates.push(`/assets/guess-who/${question.id}.svg`);
  }

  // Deduplicate candidates
  return [...new Set(candidates.filter(Boolean))];
};

/**
 * Resolves the primary image source for a question.
 * @param {Object|string} questionOrUrl - Question object or raw image URL
 * @returns {string} Primary image source URL
 */
export const resolveGuessWhoImageUrl = (questionOrUrl) => {
  if (!questionOrUrl) return '';
  if (typeof questionOrUrl === 'string') {
    return questionOrUrl;
  }
  const candidates = getImageCandidates(questionOrUrl);
  return candidates.length > 0 ? candidates[0] : '';
};
