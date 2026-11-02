# FUNTOPIA — Indie Arcade Championship Platform & Guess Who Arena

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-8--Bit_Synth-FFDE25?logo=audio&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**FUNTOPIA** is a retro-modern tournament and interactive arcade gaming platform designed for tracking arcade game participants, virtual coin balances, live performance scores, real-time standings, and running the interactive **Guess Who?** deduction arena.

Built with React 18, Vite, Tailwind CSS, and Supabase, FUNTOPIA delivers an immersive gaming atmosphere featuring canvas-driven environmental animations, tactile 8-bit synthesizer audio, responsive live leaderboards, and dual operational domains.

---

## 🚀 Dual-Domain Architecture

FUNTOPIA combines two complete, complementary domains:

- **Domain 1 — Championship Tournament Platform:**
  - Real-time participant registration and USN-based PIN authentication.
  - Live arcade leaderboard with podium rankings, score breakdown by game, and audit logs.
  - Virtual coin economy with tournament entry fees and administrative adjustments.
  - Full Admin Portal with passkey authentication, game manager, and marshal scorekeepers.
- **Domain 2 — Guess Who? Cosmic Deduction Arena:**
  - Dedicated public projector screen with zero answer/clue leakage (`/guess-who`).
  - Strict 12-puzzle game limits, 3-tier scoring, and instant early-win at 7 correct answers.
  - Master dataset of 211 verified puzzles across 8 diverse categories (Flags, Bollywood songs/eyes/dialogues, Hollywood, Scientists, Periodic Table, Country Emoji, Language scripts).
  - Multi-laptop Supabase Realtime synchronization with offline fallback.
  - Server-side atomic scoring via `gw_submit_turn` RPC with Row Level Security.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [Local Installation & Setup](#-local-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Development & Production Commands](#-development--production-commands)
- [Testing & Quality Verification](#-testing--quality-verification)
- [Database Schema & Backend Services](#-database-schema--backend-services)
- [Meet the Creators](#-meet-the-creators)
- [License](#-license)

---

## 🕹️ Core Features

### 1. Welcome Stage & Portal Selection
- Cosmic pixel arcade landing screen featuring animated twinkling starfield and interactive canvas elements.
- Portal Selector directing players to the Participant Arena, Admins to Mission Control, or spectators to the Guess Who Projector Display.

### 2. Participant Portal & Authentication
- Self-registration with Unique Student Number (USN) and secure SHA-256 PIN hashing.
- Live personal coin balance and registered game history with real-time score feeds.

### 3. Championship Admin Portal
- Protected mission control with passkey authorization.
- Real-time tournament game management, coin allocations, and live scoring.

### 4. Guess Who? Cosmic Deduction Arena
- Interactive 12-question slabs (automatic or manual generation).
- Clean projector display route (`/guess-who`) designed for audience screens, stripped of answers, clues, and metadata.
- Coordinator administrative hub (`/admin/guess-who`) for turn scoring, clue reveals, and victory celebrations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.3.1 (Single Page Application) |
| **Build & Dev Tooling** | Vite 6.0.1, PostCSS, Autoprefixer |
| **Styling & Design** | Tailwind CSS 3.4.17 with Pixel Arcade & Cosmic Retro token extensions |
| **Icons & SFX** | Lucide React, Web Audio API 8-bit Synth, HTML5 Audio |
| **Routing** | React Router v6 |
| **Backend & Realtime** | Supabase (PostgreSQL, Supabase Auth, Row Level Security, Realtime WebSockets) |

---

## 💻 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Waibha/funtopia.git
   cd funtopia
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

4. **Launch development server:**
   ```bash
   npm run dev
   ```

---

## 🧪 Testing & Quality Verification

FUNTOPIA includes automated testing across both platform domains:

```bash
# Run Guess Who scoring, reveal mechanics, and Supabase integration tests
npm test

# Run Championship platform standalone verification tests
node test/verify-focused-features.mjs
node test/verify-10-games-leaderboard.mjs
node test/verify-admin-passkey.mjs
node test/verify-12-coin-flow.mjs
```

---

## 🗄️ Database Schema & Backend Services

FUNTOPIA utilizes PostgreSQL with Supabase RLS across two modules:

### Championship Module
1. `participants`: Competitor profiles, USN unique constraint, PIN hash, and coin balances.
2. `games`: Arcade challenges with entry costs and point values.
3. `score_transactions`: Append-only performance scoring log.
4. `coin_transactions`: Virtual currency ledger and audit trail.
5. `system_settings`: Global tournament parameters.

### Guess Who Module
1. `gw_game_state`: Single authoritative row for cross-device Realtime game synchronization.
2. `gw_coordinators`: Authorized coordinator identity registry.
3. `gw_turn_events`: Idempotent scoring event audit log (`UNIQUE(session_id, slot_number)`).
4. `gw_players`: Standalone player score records.
5. `gw_attempts`: Completed run history archive.
6. `gw_questions` & `gw_public_questions`: Raw question bank and sanitized public view (`security_barrier = true`).

---

## 👥 Meet the Creators

FUNTOPIA is created and developed by a dedicated 2-person development team:

| Creator | Role | Contribution Scope |
| :--- | :--- | :--- |
| **Waibha** | Lead Architect & Full-Stack Developer | Engineered the core FUNTOPIA tournament platform, including the arcade leaderboard, Admin Portal, Participant Portal, USN authentication, coin economy, and Supabase data services. |
| **hania** | Game Developer & Systems Engineer | Developed the interactive Guess Who? game, 211-puzzle dataset, 12-slot slab engine, scoring RPC (`gw_submit_turn`), projector display sanitization, and Supabase Realtime synchronization. |

---

## 📄 License

This project is licensed under the [MIT License](./package.json).
