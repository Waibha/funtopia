/**
 * FUNTOPIA - Clean Production Data Store
 * Zero demo content, zero fictional participants, zero sample games.
 * Clean slate ready for real administrator and participant testing.
 */

const STORAGE_KEY = 'funtopia_production_v1';

export const INITIAL_DATA = {
  activeCompetition: {
    id: 'funtopia-championship',
    name: 'FUNTOPIA Championship',
    description: 'Official arcade competition and tournament platform.',
  },
  games: [],
  participants: [],
  transactions: [],
};

/**
 * Loads stored data from localStorage.
 * Initializes with completely clean empty arrays if no existing data is found.
 */
export function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const parsed = JSON.parse(raw);
    return {
      activeCompetition: parsed.activeCompetition || INITIAL_DATA.activeCompetition,
      games: Array.isArray(parsed.games) ? parsed.games : [],
      participants: Array.isArray(parsed.participants) ? parsed.participants : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch (e) {
    console.error('Error loading stored Funtopia data, defaulting to clean database', e);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

/**
 * Persists application state to localStorage.
 */
export function saveStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error persisting Funtopia data', e);
  }
}

/**
 * Clears stored database completely.
 */
export function clearStoredData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing Funtopia data', e);
  }
}
