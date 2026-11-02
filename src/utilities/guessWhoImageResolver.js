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
 * @param {Object|string} question - Question object from question library or raw URL string
 * @returns {string[]} Array of candidate image URLs in priority order
 */
export const getImageCandidates = (question) => {
  if (!question) return [];

  // Support string input directly
  const q = typeof question === 'string' ? { image_url: question } : question;

  const candidates = [];

  // 1. Explicit local asset path if annotated in dataset record
  if (q.local_asset_path) {
    candidates.push(q.local_asset_path);
  }
  if (q.local_image_url) {
    candidates.push(q.local_image_url);
  }
  if (q.image_path) {
    candidates.push(q.image_path);
  }

  // 2. PRIMARY DATASET URL (Prioritized as authored by Agent 2)
  // For the 23 local assets, this is '/assets/guess-who/...'.
  // For all other records, this is the canonical Wikimedia Commons URL.
  if (q.image_url) {
    candidates.push(q.image_url);
    if (!q.image_url.startsWith('http') && !q.image_url.startsWith('/') && !q.image_url.startsWith('data:')) {
      candidates.push(`/${q.image_url}`);
    }
    try {
      const encoded = encodeURI(q.image_url);
      if (encoded !== q.image_url) {
        candidates.push(encoded);
      }
    } catch {
      // ignore
    }
  }

  // 3. External backup URL if present and distinct from primary
  if (q.external_image_url && q.external_image_url !== q.image_url) {
    candidates.push(q.external_image_url);
  }

  // 4. Fallback convention in Agent 2's verified asset directory (/assets/guess-who/)
  if (q.id) {
    candidates.push(`/assets/guess-who/logos/${q.id}.svg`);
    candidates.push(`/assets/guess-who/${q.id}.jpg`);
    candidates.push(`/assets/guess-who/${q.id}.png`);
    candidates.push(`/assets/guess-who/${q.id}.webp`);
    candidates.push(`/assets/guess-who/${q.id}.svg`);
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
