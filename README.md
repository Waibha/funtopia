# Funtopia - Cosmic Retro Event Leaderboard & Championship

A Cosmic Retro Event Management & Leaderboard Website built with React 18, Vite, Tailwind CSS, Lucide React, and Supabase.

## 🚀 Project Overview

Funtopia is an interactive cosmic retro-themed arcade tournament platform designed for tracking event participants, scores, and real-time rankings with an immersive arcade / synthwave aesthetic.

The platform is split into two modular domains:
- **Person 1 Domain (50%):** Championship Leaderboard, real-time score aggregation, podium rankings, and telemetry.
- **Person 2 Domain (50%):** Guess Who? cosmic deduction game arena, character roster deck, and match lobby.

---

## 📁 Project Structure

```text
funtopia/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, icons, audio, and font files
│   ├── components/             # Reusable UI & Layout components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      # Cosmic arcade navigation header with SFX toggle
│   │   │   ├── Footer.jsx      # Retro marquee footer & team domain credits
│   │   │   ├── MainLayout.jsx  # Main shell for public & player pages
│   │   │   └── AdminLayout.jsx # Mission Control layout with sidebar
│   │   └── ui/
│   │       ├── Badge.jsx       # Arcade glowing pill badges
│   │       ├── Button.jsx      # Retro 3D beveled buttons with 8-bit sound effects
│   │       ├── Card.jsx        # Glassmorphic cyber cards with corner brackets & scanlines
│   │       ├── CosmicBackground.jsx # Animated twinkling starfield & horizon grid
│   │       ├── Modal.jsx       # Holographic dialog modal
│   │       └── StatCard.jsx    # Arcade statistics card
│   ├── pages/                  # Page-level views and routes
│   │   ├── public/
│   │   │   ├── HomePage.jsx        # Championship overview, countdown timer, stats
│   │   │   ├── LeaderboardPage.jsx # Person 1 decoupled modular leaderboard & podium
│   │   │   ├── SchedulePage.jsx    # Tournament timeline & stage tracker
│   │   │   └── RulesPage.jsx       # Official arcade code of conduct
│   │   ├── guess-who/              # Person 2 Module Domain
│   │   │   ├── GuessWhoHubPage.jsx   # Guess Who? game hub, roster preview & modes
│   │   │   └── GuessWhoLobbyPage.jsx # Match lobby, room code transmission & ready status
│   │   ├── admin/                  # Mission Control Admin Portal
│   │   │   ├── AdminDashboardPage.jsx    # Live telemetry & Supabase connection checker
│   │   │   ├── AdminParticipantsPage.jsx # Player roster & seed directory
│   │   │   ├── AdminGuessWhoPage.jsx     # Mystery deck config & timer rules
│   │   │   └── AdminScoresPage.jsx       # Scoring submission logs & audit stream
│   │   └── NotFoundPage.jsx        # Cosmic 404 Deep Space screen
│   ├── services/
│   │   └── supabaseClient.js   # Supabase client with safe env var fallback & anon key guard
│   ├── utilities/
│   │   └── sound.js            # Web Audio API 8-bit retro sound synthesizer
│   ├── App.jsx                 # Client-side router configuration
│   ├── index.css               # Tailwind & custom cosmic retro styles
│   └── main.jsx                # Application entry point
├── .env.example                # Template for environment variables (no secrets)
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point (Press Start 2P & Space Grotesk fonts)
├── package.json                # Project metadata and dependencies
├── postcss.config.js           # PostCSS configuration for Tailwind CSS
├── tailwind.config.js          # Cosmic retro palette, animations & glows
└── vite.config.js              # Vite configuration
```

---

## 🛠️ Tech Stack

- **React 18** (`react`, `react-dom`, `react-router-dom`)
- **Vite 6**
- **Tailwind CSS 3** (Custom arcade animations, neon glow shadows, scanline overlays)
- **Lucide React** (Arcade and cyber icons)
- **Supabase** (`@supabase/supabase-js` - database, realtime, auth)
- **Web Audio API** (Pure 8-bit sound synthesizer for arcade feedback without external audio files)

---

## 💻 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone repository and ensure you are on the feature branch:
   ```bash
   git checkout feature/guess-who
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up Supabase environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your public Supabase URL and Anon Key:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   *Note: If credentials are not supplied, Funtopia gracefully runs in local demo mode with visual mock telemetry.*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```
