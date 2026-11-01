/**
 * FUNTOPIA - Data Store & Sample Data
 * Individual participant scores, events, games with cost, and verified transactions.
 */

const STORAGE_KEY = 'funtopia_simple_v2';

export const INITIAL_DATA = {
  activeEventId: 'evt-1',
  events: [
    {
      id: 'evt-1',
      name: 'Spring Gaming Championship',
      description: 'Annual competitive tournament across multiple arcade games.',
    },
    {
      id: 'evt-2',
      name: 'Weekend Arcade Clash',
      description: 'Fast-paced individual challenge tournament.',
    },
  ],
  games: [
    {
      id: 'game-1',
      name: 'Retro Racer',
      description: 'Time-attack circuit racing.',
      cost: 150,
      points: 100,
      isActive: true,
    },
    {
      id: 'game-2',
      name: 'Pixel Blaster',
      description: 'Precision target shooting.',
      cost: 200,
      points: 150,
      isActive: true,
    },
    {
      id: 'game-3',
      name: 'Puzzle Master',
      description: 'Pattern and logic problem solving.',
      cost: 100,
      points: 120,
      isActive: true,
    },
    {
      id: 'game-4',
      name: 'Speed Runner',
      description: 'Timed obstacle course sprint.',
      cost: 125,
      points: 80,
      isActive: true,
    },
  ],
  participants: [
    {
      id: 'p-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      avatar: '⭐',
      registeredAt: '2026-11-01T10:00:00Z',
    },
    {
      id: 'p-2',
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      avatar: '⚡',
      registeredAt: '2026-11-01T10:15:00Z',
    },
    {
      id: 'p-3',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      avatar: '🚀',
      registeredAt: '2026-11-01T10:30:00Z',
    },
    {
      id: 'p-4',
      name: 'Liam Patel',
      email: 'liam.p@example.com',
      avatar: '🎯',
      registeredAt: '2026-11-01T10:45:00Z',
    },
    {
      id: 'p-5',
      name: 'Chloe Bennett',
      email: 'chloe.b@example.com',
      avatar: '👾',
      registeredAt: '2026-11-01T11:00:00Z',
    },
    {
      id: 'p-6',
      name: 'Kai Takahashi',
      email: 'kai.t@example.com',
      avatar: '🔥',
      registeredAt: '2026-11-01T11:15:00Z',
    },
  ],
  transactions: [
    {
      id: 'tx-1',
      eventId: 'evt-1',
      participantId: 'p-1',
      gameId: 'game-1',
      pointsDelta: 280,
      note: 'Fastest lap bonus',
      timestamp: '2026-11-01T14:15:00Z',
      adminName: 'Admin',
    },
    {
      id: 'tx-2',
      eventId: 'evt-1',
      participantId: 'p-2',
      gameId: 'game-2',
      pointsDelta: 250,
      note: 'Stage 3 target clear',
      timestamp: '2026-11-01T14:30:00Z',
      adminName: 'Admin',
    },
    {
      id: 'tx-3',
      eventId: 'evt-1',
      participantId: 'p-3',
      gameId: 'game-3',
      pointsDelta: 220,
      note: 'Perfect pattern solve',
      timestamp: '2026-11-01T14:45:00Z',
      adminName: 'Admin',
    },
    {
      id: 'tx-4',
      eventId: 'evt-1',
      participantId: 'p-4',
      gameId: 'game-4',
      pointsDelta: 180,
      note: 'Course completion',
      timestamp: '2026-11-01T15:00:00Z',
      adminName: 'Admin',
    },
    {
      id: 'tx-5',
      eventId: 'evt-1',
      participantId: 'p-5',
      gameId: 'game-1',
      pointsDelta: 160,
      note: 'Clean race finish',
      timestamp: '2026-11-01T15:15:00Z',
      adminName: 'Admin',
    },
    {
      id: 'tx-6',
      eventId: 'evt-1',
      participantId: 'p-6',
      gameId: 'game-2',
      pointsDelta: 140,
      note: 'Target practice round',
      timestamp: '2026-11-01T15:30:00Z',
      adminName: 'Admin',
    },
  ],
};

export const loadStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.events && parsed.participants && parsed.games) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using clean initial data', e);
  }
  return INITIAL_DATA;
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
};
