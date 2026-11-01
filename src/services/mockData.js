/**
 * FUNTOPIA - Local Data Store & Mock State
 * Manages dynamically configurable Events, Teams, Games, and Scoring Transactions.
 */

const STORAGE_KEY = 'funtopia_cosmic_state_v1';

export const INITIAL_DATA = {
  activeEventId: 'evt-cosmic-2026',
  events: [
    {
      id: 'evt-cosmic-2026',
      name: 'Cosmic Retro Championship 2026',
      code: 'CRC-26',
      status: 'active', // 'active' | 'draft' | 'completed' | 'archived'
      description: 'The supreme galactic showdown across 4 arcade disciplines. Teams battle for starlight supremacy.',
      startDate: '2026-11-01',
      endDate: '2026-11-05',
      location: 'Sector 7 Grand Arena / Cyber Twitch Stream',
      prizePool: '10,000 Cosmic Tokens + Golden Marquee Trophy',
      assignedGameIds: ['game-astro', 'game-cipher', 'game-rally', 'game-gravity'],
      assignedTeamIds: ['team-vpr', 'team-pls', 'team-vlk', 'team-qnt', 'team-ttn', 'team-gld'],
    },
    {
      id: 'evt-neon-cup',
      name: 'Neon Asteroid Cup',
      code: 'NAC-26',
      status: 'draft',
      description: 'Pre-season time trials for rookie navigators and speedrunners.',
      startDate: '2026-11-15',
      endDate: '2026-11-18',
      location: 'Sub-Orbital Station Zeta',
      prizePool: '3,500 Cosmic Tokens',
      assignedGameIds: ['game-rally', 'game-gravity'],
      assignedTeamIds: ['team-vpr', 'team-pls', 'team-gld'],
    },
    {
      id: 'evt-galactic-trials',
      name: 'Hyper Space Galactic Trials (Season 1)',
      code: 'HSG-25',
      status: 'completed',
      description: 'Inaugural championship where the first legends of Funtopia were forged.',
      startDate: '2026-05-10',
      endDate: '2026-05-14',
      location: 'Chamber of the Ancients',
      prizePool: 'Golden Cartridge of Sector 9',
      assignedGameIds: ['game-astro', 'game-cipher'],
      assignedTeamIds: ['team-vpr', 'team-vlk', 'team-ttn'],
    },
  ],
  teams: [
    {
      id: 'team-vpr',
      name: 'Vapor Hawks',
      tag: 'VPR',
      color: '#FF007F', // Cyber Magenta
      secondaryColor: '#FF6EA7',
      avatar: '🦅',
      bannerStyle: 'cyber-magenta',
      motto: 'Speed of light, sharper than lasers.',
      captain: 'Nova Chen',
      membersCount: 5,
    },
    {
      id: 'team-pls',
      name: 'Neon Pulsars',
      tag: 'PLS',
      color: '#00F0FF', // Starlight Turquoise
      secondaryColor: '#67E8F9',
      avatar: '⚡',
      bannerStyle: 'neon-cyan',
      motto: 'Charge fast, strike harder.',
      captain: 'Zara Matrix',
      membersCount: 4,
    },
    {
      id: 'team-vlk',
      name: 'Solar Valkyries',
      tag: 'VLK',
      color: '#FFE600', // Arcade Gold
      secondaryColor: '#FDE047',
      avatar: '⚔️',
      bannerStyle: 'arcade-gold',
      motto: 'Golden honor among galaxies.',
      captain: 'Kaius Thorne',
      membersCount: 5,
    },
    {
      id: 'team-qnt',
      name: 'Quantum Drifters',
      tag: 'QNT',
      color: '#A855F7', // Electric Violet
      secondaryColor: '#C084FC',
      avatar: '🌀',
      bannerStyle: 'electric-violet',
      motto: 'Warp through the obstacle matrix.',
      captain: 'Lyra Vance',
      membersCount: 4,
    },
    {
      id: 'team-ttn',
      name: 'Cyber Titans',
      tag: 'TTN',
      color: '#FF5E3A', // Blazing Orange
      secondaryColor: '#FB923C',
      avatar: '🛡️',
      bannerStyle: 'blaze-orange',
      motto: 'Unbreakable defense, relentless attack.',
      captain: 'Dax Riven',
      membersCount: 6,
    },
    {
      id: 'team-gld',
      name: 'Starlight Gliders',
      tag: 'GLD',
      color: '#10B981', // Emerald Matrix
      secondaryColor: '#34D399',
      avatar: '🚀',
      bannerStyle: 'emerald-matrix',
      motto: 'Riding solar winds to victory.',
      captain: 'Echo Sola',
      membersCount: 4,
    },
  ],
  games: [
    {
      id: 'game-astro',
      name: 'Astro Blitz 3000',
      category: 'Reflex Arcade',
      icon: '🕹️',
      badgeColor: '#00F0FF',
      description: 'High-speed asteroid dodging and blaster accuracy battle.',
      basePoints: 150,
      multiplier: 1.5,
      maxRounds: 3,
      isActive: true,
      rules: 'Highest survival combo multiplier awards bonus 50 PTS.',
    },
    {
      id: 'game-cipher',
      name: 'Cyber Cipher Matrix',
      category: 'Puzzle Strategy',
      icon: '💻',
      badgeColor: '#A855F7',
      description: 'Decode encrypted cosmic terminal transmissions under time pressure.',
      basePoints: 200,
      multiplier: 2.0,
      maxRounds: 5,
      isActive: true,
      rules: 'Each solved terminal tier unlocks escalating point bonuses.',
    },
    {
      id: 'game-rally',
      name: 'Supernova Rally',
      category: 'Cosmic Racing',
      icon: '🏎️',
      badgeColor: '#FF007F',
      description: 'Anti-gravity drift racing on floating planetary rings.',
      basePoints: 120,
      multiplier: 1.25,
      maxRounds: 3,
      isActive: true,
      rules: 'Clean lap bonus: 25 PTS. Wall bump penalty: -10 PTS.',
    },
    {
      id: 'game-gravity',
      name: 'Gravity Hopper',
      category: 'Platformer',
      icon: '🌌',
      badgeColor: '#FFE600',
      description: 'Precision jump trial with shifting gravitational vortexes.',
      basePoints: 100,
      multiplier: 1.0,
      maxRounds: 4,
      isActive: true,
      rules: 'Collect cosmic gems for +15 PTS each.',
    },
    {
      id: 'game-siege',
      name: 'Void Siege Outpost',
      category: 'Defense Tactics',
      icon: '🛰️',
      badgeColor: '#FF5E3A',
      description: 'Defend orbital beacon towers from rogue drone swarms.',
      basePoints: 250,
      multiplier: 1.75,
      maxRounds: 2,
      isActive: false,
      rules: 'Base core health determines final point yield.',
    },
  ],
  transactions: [
    {
      id: 'tx-101',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-vpr',
      gameId: 'game-astro',
      pointsDelta: 320,
      reason: '1st Place Finish + 3x Perfect Combo Streak',
      timestamp: '2026-11-01T21:15:00Z',
      admin: 'Chief Marshal Orion',
    },
    {
      id: 'tx-102',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-pls',
      gameId: 'game-cipher',
      pointsDelta: 280,
      reason: 'Flawless Decryption of Vault Matrix',
      timestamp: '2026-11-01T21:30:00Z',
      admin: 'Judge Andromeda',
    },
    {
      id: 'tx-103',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-vlk',
      gameId: 'game-rally',
      pointsDelta: 245,
      reason: 'Fastest Lap Time on Ring Track 4',
      timestamp: '2026-11-01T21:48:00Z',
      admin: 'Chief Marshal Orion',
    },
    {
      id: 'tx-104',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-qnt',
      gameId: 'game-gravity',
      pointsDelta: 190,
      reason: 'Gems sweep bonus across all 4 stages',
      timestamp: '2026-11-01T22:05:00Z',
      admin: 'Judge Andromeda',
    },
    {
      id: 'tx-105',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-ttn',
      gameId: 'game-astro',
      pointsDelta: 160,
      reason: 'Stage 2 Survival & Blaster Defense',
      timestamp: '2026-11-01T22:15:00Z',
      admin: 'Chief Marshal Orion',
    },
    {
      id: 'tx-106',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-vpr',
      gameId: 'game-cipher',
      pointsDelta: -30,
      reason: 'Penalty: Buffer Overflow Security Trigger',
      timestamp: '2026-11-01T22:25:00Z',
      admin: 'Chief Marshal Orion',
    },
    {
      id: 'tx-107',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-pls',
      gameId: 'game-rally',
      pointsDelta: 150,
      reason: 'Anti-grav sprint 2nd position podium',
      timestamp: '2026-11-01T22:42:00Z',
      admin: 'Judge Andromeda',
    },
    {
      id: 'tx-108',
      eventId: 'evt-cosmic-2026',
      teamId: 'team-gld',
      gameId: 'game-gravity',
      pointsDelta: 140,
      reason: 'Clean Jump Precision Run',
      timestamp: '2026-11-01T22:50:00Z',
      admin: 'Judge Andromeda',
    },
  ],
};

export const loadStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.events && parsed.teams && parsed.games) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using initial mock data', e);
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
