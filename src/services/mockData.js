/**
 * FUNTOPIA - Clean Production Data Store v2
 * Supports Admin-controlled Starting Coins, Independent Coin Economy,
 * Games Catalog, Participant Profiles, and Competition Points Ledger.
 */

const STORAGE_KEY = 'funtopia_production_v2';

export const INITIAL_DATA = {
  activeCompetition: {
    id: 'madagascar-championship',
    name: 'MADAGASCAR Championship',
    description: 'Official arcade competition and tournament platform.',
  },
  // Admin-controlled system settings
  settings: {
    startingCoins: 10, // Configurable by administrator; applies to future registrations
    lastUpdated: new Date().toISOString(),
  },
  games: [
    {
      id: 'game-guess-who',
      name: 'Guess Who?',
      cost: 5,
      defaultPoints: 7,
      isActive: true,
    },
  ],
  participants: [],
  transactions: [], // Competition performance points (Leaderboard ranking)
  coinTransactions: [], // Virtual coin audit trail (Entry fees, starting allocations, admin adjustments)
};

/**
 * Loads stored data from localStorage.
 * Initializes with clean empty state and configured settings if no existing data is found.
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
      settings: parsed.settings && typeof parsed.settings.startingCoins === 'number'
        ? parsed.settings
        : INITIAL_DATA.settings,
      games: Array.isArray(parsed.games) ? parsed.games : [],
      participants: Array.isArray(parsed.participants) ? parsed.participants : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      coinTransactions: Array.isArray(parsed.coinTransactions) ? parsed.coinTransactions : [],
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
