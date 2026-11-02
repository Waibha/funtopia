# MADAGASCAR — Supabase Database Architecture & Schema Guide

This directory contains the SQL migration scripts, schema definitions, and Row Level Security (RLS) policies for the **MADAGASCAR** tournament platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
  - [1. participants](#1-participants)
  - [2. games](#2-games)
  - [3. score_transactions](#3-score_transactions)
  - [4. coin_transactions](#4-coin_transactions)
  - [5. system_settings](#5-system_settings)
- [Row Level Security (RLS)](#row-level-security-rls)
- [How to Apply Migrations](#how-to-apply-migrations)
- [Offline & Local Fallback Mode](#offline--local-fallback-mode)

---

## 🚀 Overview

MADAGASCAR uses PostgreSQL via **Supabase** for persistent, real-time data synchronization. The architecture is designed to support:
1. **USN-Based Authentication**: University Seat Number (USN) unique identification with SHA-256 hashed PINs (no plain-text storage, zero email/OTP dependencies).
2. **Games Catalog**: Dynamic game definitions with entry coin costs and default points auto-fill.
3. **Ledger-Based Scoring**: Append-only score transaction ledger supporting real-time recalculations and safe rollbacks.
4. **Virtual Coin Economy**: Comprehensive audit trail for tournament coin grants, game entry deductions, and operator adjustments.

---

## 🗄️ Database Schema

### 1. `participants`
Stores competitor identity, USN unique constraint, hashed PIN, and live coin wallet balance.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Unique participant identifier (e.g. `part-1730...`) |
| `usn` | `TEXT` | `UNIQUE NOT NULL` | University Seat Number (case-insensitive indexed) |
| `name` | `TEXT` | `NOT NULL` | Full competitor display name |
| `pin_hash` | `TEXT` | `NOT NULL` | SHA-256 hashed security PIN (never stored in plain text) |
| `avatar` | `TEXT` | `DEFAULT '👾'` | Emoji or character avatar |
| `coins` | `INT` | `NOT NULL DEFAULT 0` | Current virtual arcade coin balance |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Account registration timestamp |

*Index*: `CREATE UNIQUE INDEX participants_usn_upper_idx ON public.participants (UPPER(usn));`

---

### 2. `games`
Catalog of tournament challenges configured by tournament organizers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Game identifier (e.g. `game-1`, `game-2`) |
| `name` | `TEXT` | `NOT NULL` | Game display title (e.g. "Pac-Maze Rally") |
| `cost` | `INT` | `NOT NULL DEFAULT 50` | Virtual coin fee to enter the challenge |
| `default_points` | `INT` | `DEFAULT 10` | Default points awarded upon completion |
| `is_active` | `BOOLEAN` | `DEFAULT true` | Availability toggle for competitor entry |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Game creation timestamp |

---

### 3. `score_transactions`
Append-only performance score log for leaderboard point aggregations.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Transaction identifier (`tx-...`) |
| `event_id` | `TEXT` | Nullable | Active tournament / circuit identifier |
| `participant_id` | `TEXT` | `NOT NULL` | References competitor `participants.id` |
| `game_id` | `TEXT` | `NOT NULL` | References challenge `games.id` |
| `points_delta` | `INT` | `NOT NULL` | Score points awarded or deducted |
| `note` | `TEXT` | Nullable | Operator notes or round details |
| `admin` | `TEXT` | `NOT NULL` | Operator email or identity who logged score |
| `metadata` | `JSONB` | `DEFAULT '{}'` | Additional payload attributes |
| `timestamp` | `TIMESTAMPTZ` | `DEFAULT now()` | ISO recording timestamp |

*Indexes*: `score_tx_participant_idx` on `participant_id`, `score_tx_game_idx` on `game_id`.

---

### 4. `coin_transactions`
Auditable record of all virtual arcade currency movements.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY` | Transaction identifier (`ctx-...`) |
| `participant_id` | `TEXT` | `NOT NULL` | Competitor `participants.id` |
| `participant_name`| `TEXT` | Nullable | Denormalized competitor name snapshot |
| `game_id` | `TEXT` | Nullable | Reference to game (if spent on entry) |
| `game_name` | `TEXT` | Nullable | Denormalized game name |
| `amount_delta` | `INT` | `NOT NULL` | Positive (allocation) or negative (entry fee) |
| `new_balance` | `INT` | `NOT NULL` | Coin balance after transaction |
| `type` | `TEXT` | `NOT NULL` | `starting_allocation` \| `game_entry` \| `admin_adjustment` |
| `reason` | `TEXT` | Nullable | Descriptive transaction reason |
| `admin` | `TEXT` | Nullable | Authorized operator or system action |
| `timestamp` | `TIMESTAMPTZ` | `DEFAULT now()` | ISO transaction timestamp |

---

### 5. `system_settings`
Global tournament parameters managed by administrators.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `key` | `TEXT` | `PRIMARY KEY` | Config key (e.g. `tournament_config`) |
| `value` | `JSONB` | `NOT NULL` | Key-value settings object (`startingCoins`, etc.) |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Last update timestamp |

---

## 🔒 Row Level Security (RLS)

All tables have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Transparent policies are applied to permit authenticated tournament operations, competitor registrations, and live public leaderboard reads. See `funtopia_schema.sql` and `rlsPolicies.sql` for full policy scripts.

---

## 🛠️ How to Apply Migrations

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to your project and open the **SQL Editor**.
3. Create a new query, paste the contents of [`funtopia_schema.sql`](./funtopia_schema.sql), and click **Run**.
4. Confirm in the **Table Editor** that `participants`, `games`, `score_transactions`, `coin_transactions`, and `system_settings` tables have been created.

---

## 🌐 Offline & Local Fallback Mode

If no Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are present in `.env`, the frontend automatically engages its **Local Storage Persistence Layer** ([`src/services/mockData.js`](../mockData.js)). This allows offline testing, local demonstrations, and automated test runners to execute without external network dependencies.
