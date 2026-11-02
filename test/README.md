# MADAGASCAR — Automated Verification Test Suite

This directory contains standalone Node.js verification scripts for automated regression and feature validation across the **MADAGASCAR** tournament platform.

---

## 🧪 Available Test Scripts

| Script | Purpose | Execution Command |
| :--- | :--- | :--- |
| `verify-focused-features.mjs` | Tests USN registration, secure PIN hashing, duplicate USN rejection, default points pre-fill, leaderboard calculations, and passkey integrity. | `node test/verify-focused-features.mjs` |
| `verify-10-games-leaderboard.mjs` | Mathematically verifies 10+ games standings, dynamic horizontal table layout, and precise game-wise score breakdown order. | `node test/verify-10-games-leaderboard.mjs` |
| `verify-admin-passkey.mjs` | Validates admin passkey authentication (`QWERTY404`), SHA-256 session signature integrity, operator identity attribution, and rejection of invalid keys. | `node test/verify-admin-passkey.mjs` |
| `verify-12-coin-flow.mjs` | Tests virtual coin lifecycle: starting grant, game entry expenditure, admin adjustments, and atomic balance safeguards. | `node test/verify-12-coin-flow.mjs` |
| `verify-13-points.mjs` | Tests scoring engine precision, points addition, delta calculations, and real-time rank updates. | `node test/verify-13-points.mjs` |
| `verify-16-steps.mjs` | End-to-end integration walkthrough covering all user and administrator portal workflows. | `node test/verify-16-steps.mjs` |
| `verify-real-auth-flow.mjs` | Validates session persistence, token handling, and secure storage in browser environments. | `node test/verify-real-auth-flow.mjs` |
| `verify-redirect-flow.mjs` | Validates portal routing, stage select redirects, and route guard fallback behavior. | `node test/verify-redirect-flow.mjs` |

---

## 🚀 Running All Tests

To run the primary feature and security test suites sequentially:

```bash
node test/verify-focused-features.mjs
node test/verify-10-games-leaderboard.mjs
node test/verify-admin-passkey.mjs
```

All tests run locally in Node.js ES Module mode (`.mjs`) with zero external network or database requirements.
