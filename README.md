# MADAGASCAR — Indie Arcade Championship Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-8--Bit_Synth-FFDE25?logo=audio&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MADAGASCAR** is a retro-modern tournament platform designed for tracking arcade game participants, virtual coin balances, live performance scores, and real-time standings. Built with React 18, Vite, Tailwind CSS, and Supabase, MADAGASCAR delivers an interactive gaming atmosphere featuring canvas-driven environmental animations, tactile 8-bit synthesizer audio, responsive live leaderboards, and dual operational portals.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
  - [1. Welcome Stage & Portal Selection](#1-welcome-stage--portal-selection)
  - [2. Participant Portal & Authentication](#2-participant-portal--authentication)
  - [3. Admin & Operator Management Portal](#3-admin--operator-management-portal)
  - [4. Championship Leaderboard & Podium](#4-championship-leaderboard--podium)
  - [5. Virtual Coin Economy](#5-virtual-coin-economy)
  - [6. Living Environmental Animations & Audio Engine](#6-living-environmental-animations--audio-engine)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Local Installation & Setup](#-local-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Development & Production Commands](#-development--production-commands)
- [Project Directory Structure](#-project-directory-structure)
- [Testing & Quality Verification](#-testing--quality-verification)
- [Database Schema & Backend Services](#-database-schema--backend-services)
- [Accessibility & Performance Standards](#-accessibility--performance-standards)
- [License](#-license)

---

## 🕹️ Core Features

### 1. Welcome Stage & Portal Selection
- **Arcade Marquee Welcome Page**: Features continuous falling Tetris blocks rendered on HTML5 canvas with multi-depth parallax, spinning golden coins, and interactive control cabinet illustrations.
- **Stage Select Portal (`/select-portal`)**: Clean gateway offering dual dedicated access paths:
  - **Participant Portal** (Public competitor access)
  - **Admin Portal** (Restricted tournament operator access)
- **Audio & Atmosphere Settings**: Global modal for toggling 8-bit sound effects, synthesized background music (BGM), and master volumes.

### 2. Participant Portal & Authentication
- **USN & Secure PIN Authentication**:
  - Registration with Full Name, University Seat Number (USN), and 4-to-6 digit numeric security PIN.
  - Case-insensitive USN duplicate prevention.
  - Zero plain-text storage: PINs are hashed using client-side SHA-256 before persistence.
  - Sign-in flow restores competitor session, coin balance, and verified transaction history.
- **Competitor Wallet & Profile**:
  - Live virtual coin balance badge with auto-granted starting tournament tokens.
  - Personal tournament points tally and individual game-by-game performance breakdown.
- **Arcade Lobby Games Catalog**:
  - Browse all active tournament challenges with coin entry costs.
  - Atomic entry validation: Competitors spend coins to enter games with double-click protection and balance checks.

### 3. Admin & Operator Management Portal
- **Passkey Operator Authentication**:
  - Protected by tournament operator passkey with cryptographic SHA-256 session signature verification.
  - Operator identity attribution (e.g. `lead-director`, marshal email) recorded on all transactions.
- **Games Catalog Management**:
  - Create, edit, activate/deactivate, and delete tournament games.
  - Configure coin entry cost and configurable **Default Points Earned**.
- **Real-Time Scoring Console**:
  - Rapid score recording: select competitor, select game (pre-populates the game's default points with manual override capability), set score delta, and add round notes.
  - Comprehensive score transaction ledger with one-click transaction rollback.
- **Coin Economy Management**:
  - Configure tournament starting coin allocation granted upon registration.
  - Adjust individual competitor coin balances with auditable reason logs.
- **Participant Roster Manager**:
  - Real-time search and filter across all registered competitors by Name or USN.
  - Direct operator controls to register or remove competitors.

### 4. Championship Leaderboard & Podium
- **10+ Games Responsive Table**:
  - Dynamic horizontal scrolling layout (`overflow-x-auto`) supporting 10 or more games without clipping or column overlapping.
  - Sticky rank column and sticky participant identity column for seamless browsing on desktop and mobile.
  - Precise game-by-game breakdown columns displaying verified point contributions for each game in rotation order.
  - Top individual game badge (`★ BEST`) highlighting a player's strongest performance.
- **Interactive 3-Step Podium**:
  - Visual 1st (Gold), 2nd (Silver), and 3rd (Bronze) pedestals with score speech bubbles and avatar highlights.
  - Rank 1 Champion features animated golden crown badge and subtle pulsing glow.
- **Broadcast & Filter Controls**:
  - Filter scores by individual game challenge or inspect aggregated championship totals.
  - Full-screen broadcast view for projection on tournament arena screens.
  - Interactive celebration button triggering multi-colored confetti blasts.

### 5. Virtual Coin Economy
- **Decoupled Currency Model**:
  - **Virtual Coins (🪙)**: Currency spent by competitors to enter games or awarded by tournament marshals.
  - **Tournament Points (🏆)**: Performance score earned through gameplay that determines rank on the live leaderboard.
- **Auditable Ledger**: Every coin transaction (`starting_allocation`, `game_entry`, `admin_adjustment`) is recorded with timestamps, balance before/after, and operator attribution.

### 6. Living Environmental Animations & Audio Engine
- **Dedicated Canvas Backgrounds**:
  - **Welcome Page**: Classic falling tetromino shapes, golden spinning coins, and twinkling stars.
  - **Portal Select Screen**: Drifting 16-bit arcade stars, floating neon geometric diamonds, and cosmic parallax.
  - **Participant Arena**: Falling 3D-spinning gold coins, floating game gems, and sparkling stars.
  - **Operator Station**: Cyber telemetry data flow, circuit matrix nodes, and coordinate crosses.
- **Tactile Micro-Interactions**:
  - Snappy button compression physics (`active:translate-x-1 active:translate-y-1 active:shadow-none`).
  - Light-sweep sheens across primary arcade buttons on hover.
  - Interactive card hover lifts with border highlights and avatar micro-animations.
  - Smooth 200ms page route transitions (`.arcade-page-transition`).
- **Web Audio API Synthesizer (`soundFx.js`)**:
  - Zero external MP3/WAV dependencies; 100% synthesized in real time via browser AudioContext oscillators.
  - Audio presets: mechanical switch click, coin reward shimmer, fanfare celebration, error buzz, and score down.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18.3.1](https://react.dev/) | Component architecture, state management, and hooks |
| **Build Tool & Bundler** | [Vite 6.0.1](https://vitejs.dev/) | Ultra-fast HMR and optimized production bundling |
| **Routing** | [React Router DOM 7.18.5](https://reactrouter.com/) | Client-side routing, route guards, and stage navigation |
| **Styling & Design** | [Tailwind CSS 3.4.17](https://tailwindcss.com/) | Custom retro pixel palette, utility classes, and typography |
| **Typography** | Google Fonts | `Press Start 2P`, `Oxanium`, `Space Grotesk`, `JetBrains Mono`, `Bungee`, `Silkscreen` |
| **Icons** | [Lucide React 1.16.0](https://lucide.dev/) | Clean, consistent SVG interface icons |
| **Celebrations** | [Canvas Confetti 1.9.4](https://www.npmjs.com/package/canvas-confetti) | High-performance particle confetti on podium and score events |
| **Audio Synthesis** | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Native 8-bit sound generation with zero external assets |
| **Backend / Database** | [Supabase](https://supabase.com/) | PostgreSQL with Row Level Security for cloud persistence |
| **Offline Fallback** | LocalStorage Engine | Resilient local fallback when operating without cloud credentials |

---

## 💻 Prerequisites

Ensure your system meets the following requirements before local installation:

- **Node.js**: `v18.0.0` or higher (`v20.x` LTS recommended)
- **Package Manager**: `npm` (v9+), `pnpm`, or `yarn`
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari supporting HTML5 Canvas and the Web Audio API.

---

## 📦 Local Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Waibha/funtopia.git madagascar
   cd madagascar
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Supabase credentials (see [Environment Configuration](#-environment-configuration)).

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔐 Environment Configuration

MADAGASCAR supports both **Cloud Supabase Mode** and **Local Fallback Mode**.

Configure your credentials in `.env`:

```env
# Supabase Project URL (Dashboard -> Project Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon (Public) Key
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

> **Security Note**: Never commit your `.env` file or private service-role keys to Git. The project `.gitignore` explicitly prevents `.env` and related secret files from being tracked.

### Local Fallback Mode
If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are omitted, MADAGASCAR automatically switches to its **Local Storage Persistence Layer** (`src/services/mockData.js`). All registrations, score awards, and game modifications will persist locally in browser storage, enabling offline tournaments and development.

---

## ⚡ Development & Production Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the Vite local development server with Hot Module Replacement (HMR) at `http://localhost:5173` |
| `npm run build` | Compiles and tree-shakes production assets into the `dist/` directory |
| `npm run preview` | Locally serves the production build from `dist/` for verification |

---

## 📂 Project Directory Structure

```text
madagascar/
├── public/                       # Static public assets (favicon, icons)
├── src/
│   ├── assets/                   # Static media assets and fonts
│   ├── components/               # Reusable modular UI components
│   │   ├── admin/                # Admin portal components
│   │   │   ├── AdminLogin.jsx              # Passkey authentication modal
│   │   │   ├── CoinEconomyManager.jsx      # Starting coins & coin adjustment tools
│   │   │   └── ParticipantRosterManager.jsx# Competitor roster search and management
│   │   ├── backgrounds/          # Environmental HTML5 canvas backdrops
│   │   │   ├── AdminArcadeBackground.jsx   # Cyber telemetry matrix for Admin Portal
│   │   │   ├── AuthArcadeBackground.jsx    # Drifting stars & gems for Portal Select
│   │   │   └── ParticipantArcadeBackground.jsx# 3D spinning coins for Participant Arena
│   │   ├── leaderboard/          # Leaderboard views
│   │   │   └── LeaderboardTableView.jsx    # Responsive horizontal scrolling 10+ games table
│   │   ├── participant/          # Competitor components
│   │   │   ├── ParticipantAuthScreen.jsx   # USN & PIN sign-in modal
│   │   │   └── ParticipantRegistration.jsx # Competitor registration form
│   │   ├── AudioSettingsModal.jsx          # Sound effects and BGM volume controls
│   │   ├── LiveTicker.jsx                  # Scrolling marquee ticker
│   │   ├── Navbar.jsx                      # Navigation bar
│   │   ├── Podium.jsx                      # 1st, 2nd, and 3rd place champion pedestals
│   │   └── TetrisArcadeBackground.jsx      # Falling Tetris blocks canvas for welcome page
│   ├── pages/                    # Route-level view components
│   │   ├── AdminDashboard.jsx              # Admin overview with stat tiles & leaderboard
│   │   ├── AdminPortal.jsx                 # Restricted admin management portal container
│   │   ├── AuthCallback.jsx                # OAuth / redirect callback handler
│   │   ├── GameManagement.jsx              # Games catalog, cost, and default points editor
│   │   ├── ParticipantPortal.jsx           # Competitor arena, lobby, profile, and scores
│   │   ├── PortalSelectPage.jsx            # Stage select portal choice screen
│   │   ├── PublicLeaderboard.jsx           # Standalone leaderboard with broadcast mode
│   │   ├── ScoringManagement.jsx           # Real-time score entry console & rollback log
│   │   └── WelcomeHomepage.jsx             # Arcade title screen with Tetris background
│   ├── services/                 # Data, API, and cloud backend adapters
│   │   ├── api/
│   │   │   ├── authService.js              # USN/PIN hashing, sessions & admin passkey validation
│   │   │   ├── dbService.js                # Supabase persistence layer with fallback
│   │   │   └── scoringService.js           # Scoring transaction handlers
│   │   ├── supabase/                       # Database schema and documentation
│   │   │   ├── funtopia_schema.sql         # PostgreSQL table definitions and indexes
│   │   │   ├── rlsPolicies.sql             # Row Level Security access policies
│   │   │   ├── rpcFunctions.sql            # Stored procedures
│   │   │   └── README.md                   # Supabase architecture and schema reference
│   │   ├── mockData.js                     # Offline fallback initial state & localStorage engine
│   │   └── supabaseClient.js               # Supabase JS client initializer
│   ├── utilities/                # Helper utilities and audio engines
│   │   ├── leaderboardEngine.js            # Leaderboard point aggregation and ranking logic
│   │   └── soundFx.js                      # Web Audio API 8-bit sound synthesizer
│   ├── App.jsx                   # Root application router and global state provider
│   ├── index.css                 # Global CSS, button physics, and animation keyframes
│   └── main.jsx                  # React DOM root entry point
├── test/                         # Automated verification test suite
│   ├── verify-10-games-leaderboard.mjs     # 10+ games layout & scoring math tests
│   ├── verify-admin-passkey.mjs            # Passkey authentication & session security tests
│   ├── verify-focused-features.mjs         # USN auth, default points, and UI tests
│   ├── verify-12-coin-flow.mjs             # Coin allocation and game entry fee tests
│   ├── verify-13-points.mjs                # Score delta and point aggregation tests
│   ├── verify-16-steps.mjs                 # Full system integration flow walkthrough
│   ├── verify-real-auth-flow.mjs           # Session restoration and security tests
│   ├── verify-redirect-flow.mjs            # Routing and navigation tests
│   └── README.md                           # Test suite documentation and usage instructions
├── .env.example                  # Environment variable configuration template
├── .gitignore                    # Git file exclusions
├── index.html                    # Single Page Application HTML template
├── package.json                  # Dependencies, scripts, and package metadata
├── postcss.config.js             # PostCSS plugin configuration
├── tailwind.config.js            # Tailwind theme, typography, and color settings
├── vite.config.js                # Vite build and development configuration
└── README.md                     # Project documentation (this file)
```

---

## 🧪 Testing & Quality Verification

MADAGASCAR includes a standalone automated test suite written in Node.js ES Modules (`.mjs`). These test scripts validate scoring accuracy, USN PIN hashing, admin security, and table layout limits without requiring a running browser.

Run the test suite with:

```bash
# Verify USN registration, secure PIN hashing, default points, and scoring
node test/verify-focused-features.mjs

# Verify 10+ games leaderboard math, horizontal scrolling, and score breakdown
node test/verify-10-games-leaderboard.mjs

# Verify admin passkey verification, session signature, and rejected keys
node test/verify-admin-passkey.mjs
```

For complete documentation on all 8 verification scripts, consult [`test/README.md`](./test/README.md).

---

## 🗄️ Database Schema & Backend Services

MADAGASCAR uses five primary PostgreSQL tables in Supabase:

1. **`participants`**: Stores competitor profiles, USN unique constraint, SHA-256 PIN hash, and coin balances.
2. **`games`**: Stores arcade challenges with coin entry costs and default performance points.
3. **`score_transactions`**: Append-only log of performance points awarded/deducted by tournament marshals.
4. **`coin_transactions`**: Complete audit trail of virtual currency allocations and game entry expenditures.
5. **`system_settings`**: Global tournament parameters (e.g. starting coin allocation).

Detailed table schemas, SQL migration scripts, and RLS policies are documented in [`src/services/supabase/README.md`](./src/services/supabase/README.md).

---

## ♿ Accessibility & Performance Standards

- **Reduced Motion Support**: All canvas animation loops, floating particles, and transition effects strictly monitor `prefers-reduced-motion: reduce`. When enabled, animations cleanly halt or render static backgrounds to accommodate users with vestibular sensitivity.
- **Click-Through Layering**: All background canvas containers are configured with `pointer-events-none` and appropriate z-indexing (`z-0`) so environmental elements never obstruct UI clicks, text selection, or screen readers.
- **High-DPI Canvas Rendering**: Canvas elements dynamically adapt to window resize events and maintain lightweight 60 FPS performance without degrading host CPU/GPU cycles.
- **Keyboard Navigation**: Buttons, cards, and modal dialogs support keyboard accessibility with `Tab` focusing and `Enter` key execution.

---

## 📄 License

This project is licensed under the [MIT License](./package.json).
