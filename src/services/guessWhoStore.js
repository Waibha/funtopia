/**
 * ============================================================================
 * GUESS WHO? COORDINATOR ENGINE & SYNCHRONIZATION STORE
 * ============================================================================
 * 
 * Manages game session state for the coordinator-operated Guess Who? module.
 * Broadcasts actions from the Coordinator Admin Portal to the Public Projector
 * Display using BroadcastChannel API with localStorage persistence fallback.
 */

const STORAGE_KEY = 'funtopia_guess_who_state';
const CHANNEL_NAME = 'funtopia_guess_who_channel';

// Preset Question Decks by Category
export const GUESS_WHO_DECKS = {
  celebrities: {
    id: 'celebrities',
    name: 'Celebrities & Icons',
    icon: '🌟',
    description: 'Recognize legendary pop culture icons, sci-fi stars, and tech visionaries.',
    questions: [
      {
        id: 'cel-1',
        title: 'Cyberpunk & Sci-Fi Legend',
        prompt: 'Can you identify this iconic Hollywood star who played Neo in The Matrix and John Wick?',
        answer: 'Keanu Reeves',
        clue: 'Known for: The Matrix, Speed, Cyberpunk 2077 (Johnny Silverhand).',
        category: 'celebrities',
        difficulty: 'Medium',
        maxPoints: 1000,
        // Embedded SVG illustration styled for high-res retro presentation
        imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          <rect width="400" height="400" fill="#0d1117"/>
          <circle cx="200" cy="200" r="160" fill="#1f2937" stroke="#00f0ff" stroke-width="4"/>
          <!-- Shaded Figure & Hair -->
          <path d="M120 380 C120 280 150 250 200 250 C250 250 280 280 280 380" fill="#111827"/>
          <!-- Face Contour -->
          <ellipse cx="200" cy="190" rx="65" ry="85" fill="#fbcfe8"/>
          <!-- Long Dark Hair -->
          <path d="M125 150 C125 80 170 80 200 80 C230 80 275 80 275 150 C275 220 265 240 260 250 C250 200 240 140 200 135 C160 140 150 200 140 250 C135 240 125 220 125 150 Z" fill="#030712"/>
          <!-- Sunglasses (The Matrix style) -->
          <ellipse cx="175" cy="180" rx="22" ry="14" fill="#000000" stroke="#00f0ff" stroke-width="2"/>
          <ellipse cx="225" cy="180" rx="22" ry="14" fill="#000000" stroke="#00f0ff" stroke-width="2"/>
          <line x1="197" y1="180" x2="203" y2="180" stroke="#000000" stroke-width="3"/>
          <!-- Goatee & Beard -->
          <path d="M190 230 Q200 255 210 230 Q200 240 190 230" fill="#1f2937"/>
          <rect x="195" y="250" width="10" height="15" rx="3" fill="#1f2937"/>
          <!-- Matrix Neon Rain Glyphs in background -->
          <text x="50" y="80" fill="#00ff88" font-family="monospace" font-size="14" opacity="0.6">0 1 0 1</text>
          <text x="320" y="120" fill="#00ff88" font-family="monospace" font-size="14" opacity="0.6">1 1 0 0</text>
          <text x="40" y="320" fill="#00ff88" font-family="monospace" font-size="14" opacity="0.6">MATRIX</text>
        </svg>`,
      },
      {
        id: 'cel-2',
        title: 'Space & Electric Pioneer',
        prompt: 'Which tech tycoon is famous for electric supercars, humanoid robots, and Starship rocket missions?',
        answer: 'Elon Musk',
        clue: 'CEO of Tesla & SpaceX; acquired Twitter and rebranded it to X.',
        category: 'celebrities',
        difficulty: 'Easy',
        maxPoints: 1000,
        imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          <rect width="400" height="400" fill="#0a0a1a"/>
          <circle cx="200" cy="200" r="160" fill="#1e1b4b" stroke="#ff2a85" stroke-width="4"/>
          <!-- Rocket Silhouette -->
          <path d="M330 90 L340 70 L350 90 L345 140 L335 140 Z" fill="#ffffff" opacity="0.8"/>
          <path d="M340 140 L335 155 L345 155 Z" fill="#f59e0b"/>
          <!-- Cyber Body -->
          <path d="M130 380 C130 290 160 260 200 260 C240 260 270 290 270 380" fill="#0f172a"/>
          <!-- Cyber Jacket Collar -->
          <path d="M170 260 L200 300 L230 260" fill="#3b82f6" opacity="0.6"/>
          <!-- Face -->
          <ellipse cx="200" cy="180" rx="60" ry="75" fill="#fed7aa"/>
          <!-- Hair (Tech executive sweep) -->
          <path d="M140 150 C140 100 180 90 215 90 C250 90 265 110 265 145 C250 135 220 120 190 125 C160 130 145 145 140 150 Z" fill="#78350f"/>
          <!-- Eyes -->
          <ellipse cx="180" cy="175" rx="6" ry="4" fill="#1e293b"/>
          <ellipse cx="220" cy="175" rx="6" ry="4" fill="#1e293b"/>
          <!-- Smile -->
          <path d="M185 220 Q200 230 215 220" stroke="#9a3412" stroke-width="2" fill="none"/>
          <text x="40" y="90" fill="#ff2a85" font-family="monospace" font-size="20" font-weight="bold">X</text>
        </svg>`,
      },
      {
        id: 'cel-3',
        title: 'The Queen of Pop & Glamour',
        prompt: 'Identify this global pop superstar who headlined the Super Bowl and starred in A Star Is Born.',
        answer: 'Lady Gaga',
        clue: 'Hits include: Bad Romance, Poker Face, Shallow, Born This Way.',
        category: 'celebrities',
        difficulty: 'Easy',
        maxPoints: 1000,
        imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          <rect width="400" height="400" fill="#180b24"/>
          <circle cx="200" cy="200" r="160" fill="#2e1065" stroke="#facc15" stroke-width="4"/>
          <!-- Glamour Outfit -->
          <path d="M120 380 C120 280 155 240 200 240 C245 240 280 280 280 380" fill="#701a75"/>
          <!-- Platinum Blonde Hair Wave -->
          <path d="M120 160 C110 70 170 60 200 60 C250 60 290 80 285 180 C270 230 270 300 260 330 C250 280 240 200 220 180 C180 140 140 200 130 270 Z" fill="#fef08a"/>
          <!-- Face -->
          <ellipse cx="200" cy="190" rx="55" ry="70" fill="#fde047" opacity="0.3"/>
          <ellipse cx="200" cy="190" rx="50" ry="65" fill="#fed7aa"/>
          <!-- Iconic Lightning Bolt Eye Makeup -->
          <path d="M215 155 L235 180 L225 185 L245 210 L220 195 L225 190 Z" fill="#ff007f"/>
          <!-- Red Lips -->
          <path d="M185 225 Q200 240 215 225 Q200 232 185 225 Z" fill="#e11d48"/>
          <text x="50" y="340" fill="#facc15" font-family="monospace" font-size="16">★ LITTLE MONSTERS ★</text>
        </svg>`,
      },
    ],
  },
  objects: {
    id: 'objects',
    name: 'Mystery Objects & Tech',
    icon: '📦',
    description: 'Deduce vintage artifacts, breakthrough arcade hardware, and retro inventions.',
    questions: [
      {
        id: 'obj-1',
        title: 'Retro Storage Artifact',
        prompt: 'What magnetic storage medium with a sliding metal shutter held 1.44 MB of data in the 1990s?',
        answer: '3.5-inch Floppy Disk',
        clue: 'Today it is the universal "Save" icon in almost every software application.',
        category: 'objects',
        difficulty: 'Easy',
        maxPoints: 1000,
        imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          <rect width="400" height="400" fill="#060913"/>
          <circle cx="200" cy="200" r="160" fill="#111827" stroke="#00f0ff" stroke-width="4"/>
          <!-- Floppy Body -->
          <rect x="110" y="100" width="180" height="200" rx="12" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>
          <!-- Top Left Chamfer -->
          <polygon points="110,120 130,100 110,100" fill="#111827"/>
          <!-- Metal Shutter (Top) -->
          <rect x="145" y="100" width="110" height="85" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
          <rect x="175" y="115" width="20" height="50" rx="3" fill="#1e293b"/>
          <!-- Label Sticker -->
          <rect x="135" y="200" width="130" height="85" rx="6" fill="#f8fafc"/>
          <line x1="145" y1="220" x2="255" y2="220" stroke="#f43f5e" stroke-width="3"/>
          <line x1="145" y1="240" x2="240" y2="240" stroke="#94a3b8" stroke-width="2"/>
          <line x1="145" y1="255" x2="220" y2="255" stroke="#94a3b8" stroke-width="2"/>
          <!-- Hub Ring at Bottom -->
          <circle cx="200" cy="320" r="15" fill="#475569"/>
        </svg>`,
      },
      {
        id: 'obj-2',
        title: 'Handheld Gaming Legend',
        prompt: 'Which gray handheld 8-bit game console released by Nintendo in 1989 popularized Tetris worldwide?',
        answer: 'Nintendo Game Boy (Original)',
        clue: 'Featured a monochrome olive-green LCD screen, D-pad, and Burgundy A/B buttons.',
        category: 'objects',
        difficulty: 'Easy',
        maxPoints: 1000,
        imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          <rect width="400" height="400" fill="#090a16"/>
          <circle cx="200" cy="200" r="160" fill="#1e1b4b" stroke="#ffd000" stroke-width="4"/>
          <!-- Gameboy Body -->
          <rect x="120" y="80" width="160" height="250" rx="16" fill="#d1d5db" stroke="#9ca3af" stroke-width="4"/>
          <!-- Screen Bezel -->
          <rect x="135" y="105" width="130" height="100" rx="8" fill="#4b5563"/>
          <!-- Olive Screen -->
          <rect x="155" y="120" width="90" height="70" rx="4" fill="#84cc16"/>
          <!-- Tetris Shapes on Screen -->
          <rect x="175" y="145" width="12" height="12" fill="#3f6212"/>
          <rect x="187" y="145" width="12" height="12" fill="#3f6212"/>
          <rect x="199" y="145" width="12" height="12" fill="#3f6212"/>
          <rect x="187" y="133" width="12" height="12" fill="#3f6212"/>
          <!-- Power LED -->
          <circle cx="145" cy="145" r="3" fill="#ef4444"/>
          <!-- D-Pad -->
          <path d="M150 235 H160 V225 H170 V235 H180 V245 H170 V255 H160 V245 H150 Z" fill="#1f2937"/>
          <!-- A and B Buttons (Burgundy slanted) -->
          <circle cx="230" cy="245" r="9" fill="#991b1b"/>
          <circle cx="250" cy="235" r="9" fill="#991b1b"/>
          <!-- Speaker Grille -->
          <line x1="230" y1="290" x2="260" y2="305" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
          <line x1="235" y1="296" x2="265" y2="311" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
      },
    ],
  },
  gaming: {
    id: 'gaming',
    name: 'Retro Gaming Champions',
    icon: '👾',
    description: 'Guess legendary video game characters and arcade icons.',
    questions: [
      {
        id: 'gam-1',
        title: 'Arcade Yellow Hero',
        prompt: 'Which 1980 arcade character navigates a blue maze chomping dots and power pellets while evading ghosts?',
        answer: 'PAC-MAN',
        clue: 'Created by Toru Iwatani; pursued by Blinky, Pinky, Inky, and Clyde.',
        category: 'gaming',
        difficulty: 'Easy',
        maxPoints: 1000,
        imageSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          <rect width="400" height="400" fill="#000000"/>
          <circle cx="200" cy="200" r="160" fill="#05051a" stroke="#0051ff" stroke-width="6"/>
          <!-- Pacman Body (Wedge open) -->
          <path d="M190 200 L285 140 A 110 110 0 1 0 285 260 Z" fill="#ffd000"/>
          <!-- Eye -->
          <circle cx="210" cy="140" r="10" fill="#000000"/>
          <!-- Power Pellet -->
          <circle cx="330" cy="200" r="18" fill="#ffb8b8"/>
          <!-- Dots -->
          <circle cx="370" cy="200" r="8" fill="#ffb8b8"/>
          <!-- Ghost in background -->
          <path d="M70 190 C70 160 110 160 110 190 L110 220 L103 210 L96 220 L90 210 L84 220 L77 210 L70 220 Z" fill="#ff0000"/>
          <circle cx="83" cy="180" r="5" fill="#ffffff"/>
          <circle cx="81" cy="180" r="2.5" fill="#0000ff"/>
          <circle cx="97" cy="180" r="5" fill="#ffffff"/>
          <circle cx="95" cy="180" r="2.5" fill="#0000ff"/>
        </svg>`,
      },
    ],
  },
};

// Initial Coordinator Game State
export const initialGameState = {
  sessionActive: false,
  currentCategory: 'celebrities',
  currentQuestionIndex: 0,
  revealLevel: 1, // 1 (25% heavy blur), 2 (50% medium blur), 3 (75% slight blur), 4 (100% crystal clear)
  clueRevealed: false,
  answerRevealed: false,
  timerSeconds: 60,
  isTimerRunning: false,
  winnerTeam: '',
  winnerPointsAwarded: 0,
  teamScores: [
    { team: 'Team Pulsar', score: 2500 },
    { team: 'Nebula Rogues', score: 2100 },
    { team: 'Laser Knights', score: 1800 },
    { team: 'Bit Shift', score: 1450 },
  ],
  lastAction: 'Session Initialized',
  updatedAt: Date.now(),
};

// Singleton broadcast channel
let broadcastChannel = null;

const getChannel = () => {
  if (typeof window === 'undefined') return null;
  if (!broadcastChannel && typeof window.BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
  return broadcastChannel;
};

// Get current state from localStorage or initial
export const getGameState = () => {
  if (typeof window === 'undefined') return initialGameState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...initialGameState, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed reading Guess Who game state:', err);
  }
  return initialGameState;
};

// Save and broadcast state
export const updateGameState = (patch) => {
  if (typeof window === 'undefined') return initialGameState;
  try {
    const current = getGameState();
    const updated = {
      ...current,
      ...patch,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const channel = getChannel();
    if (channel) {
      channel.postMessage({ type: 'STATE_UPDATE', payload: updated });
    }
    return updated;
  } catch (err) {
    console.error('Failed updating Guess Who game state:', err);
    return initialGameState;
  }
};

// Subscribe to state updates (cross-tab & local storage)
export const subscribeToGame = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleChannelMsg = (event) => {
    if (event.data && event.data.payload) {
      callback(event.data.payload);
    }
  };

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        callback(JSON.parse(event.newValue));
      } catch (err) {
        // Ignore parse error
      }
    }
  };

  const channel = getChannel();
  if (channel) {
    channel.addEventListener('message', handleChannelMsg);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleChannelMsg);
    }
    window.removeEventListener('storage', handleStorage);
  };
};

// Helper: Calculate points according to reveal level
export const getPointsForRevealLevel = (level) => {
  switch (level) {
    case 1: return 1000;
    case 2: return 750;
    case 3: return 500;
    case 4: return 250;
    default: return 500;
  }
};
