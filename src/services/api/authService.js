/**
 * FUNTOPIA AUTHENTICATION & IDENTITY SERVICE
 *
 * Implements:
 * 1. Cryptographically hashed administrator passkey verification.
 * 2. USN & Secure PIN Participant Authentication:
 *    - Full Name, University Seat Number (USN), and secure PIN.
 *    - No dependency on Gmail, email verification, OTPs, or SMTP.
 *    - Cryptographic SHA-256 PIN hashing with salt.
 *    - Unique USN identification with duplicate prevention.
 *    - Session persistence and revocation.
 */

import { supabase } from '../supabaseClient.js';
import { dbService } from './dbService.js';

// Cryptographic SHA-256 hashes of authorized administrative passkeys
const AUTHORIZED_PASSKEY_HASHES = [
  'adf7f07c08e82e70ee5aca8d7fab6b63444e71498645a587c2943d6d1706d3a5', // QWERTY404
  '10719878e0a5386a3d3b207636abfe3edb14069ae56c831dc54ced40b8b752df', // Primary tournament master
];

const ADMIN_SESSION_KEY = 'funtopia_admin_session';
const PARTICIPANT_SESSION_KEY = 'funtopia_participant_session';

/**
 * Computes SHA-256 hex digest using Web Crypto API.
 */
export async function hashString(value) {
  const cleanVal = String(value || '').trim();
  const c = typeof globalThis !== 'undefined' ? globalThis.crypto : (typeof crypto !== 'undefined' ? crypto : null);
  if (c && c.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanVal);
    const hashBuffer = await c.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic hash fallback for minimal environments without subtle crypto
  let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
  for (let i = 0; i < cleanVal.length; i++) {
    const ch = cleanVal.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(64, '0');
}

/**
 * Salts and hashes a participant's PIN with their USN.
 * Plain-text PINs are NEVER stored.
 */
export async function hashPin(pin, usn) {
  const cleanPin = String(pin || '').trim();
  const cleanUsn = String(usn || '').trim().toUpperCase();
  const pepper = 'funtopia_pin_salt_v1';
  return hashString(`${cleanUsn}:${cleanPin}:${pepper}`);
}

/* ========================================================================= */
/* 1. ADMINISTRATOR PASSKEY AUTHENTICATION                                   */
/* ========================================================================= */

/**
 * Authenticates an administrator using their passkey.
 */
export async function verifyAdminPasskey({ passkey, operatorEmail = 'admin@funtopia.arcade' }) {
  if (!passkey || typeof passkey !== 'string') {
    return { success: false, error: 'Passkey is required.' };
  }

  const cleanKey = passkey.trim();
  if (cleanKey.length === 0) {
    return { success: false, error: 'Passkey cannot be empty.' };
  }

  try {
    const inputHash = await hashString(cleanKey);
    const isAuthorized = AUTHORIZED_PASSKEY_HASHES.includes(inputHash);

    if (!isAuthorized) {
      return {
        success: false,
        error: 'ACCESS DENIED: Invalid administrator passkey. Verification failed.',
      };
    }

    // 8-hour session validity
    const issuedAt = Date.now();
    const expiresAt = issuedAt + 8 * 60 * 60 * 1000;
    const cleanEmail = (typeof operatorEmail === 'string' && operatorEmail.trim().length > 0)
      ? operatorEmail.trim()
      : 'operator@funtopia.arcade';
    const signature = await hashString(`${inputHash}:${cleanEmail}:${expiresAt}`);

    const session = {
      role: 'admin',
      operator: cleanEmail,
      email: cleanEmail,
      issuedAt,
      expiresAt,
      signature,
      token: `funtopia-adm-${Math.random().toString(36).substring(2, 10)}`,
    };

    saveAdminSession(session);

    return {
      success: true,
      session,
    };
  } catch (err) {
    return {
      success: false,
      error: `Cryptographic verification error: ${err.message}`,
    };
  }
}

export function saveAdminSession(session) {
  try {
    const serialized = JSON.stringify(session);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, serialized);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, serialized);
    }
  } catch (e) {
    console.error('Failed to store admin session', e);
  }
}

export function getAdminSession() {
  try {
    let raw = null;
    if (typeof sessionStorage !== 'undefined') {
      raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    }
    if (!raw && typeof localStorage !== 'undefined') {
      raw = localStorage.getItem(ADMIN_SESSION_KEY);
    }
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function validateAdminSession(session) {
  if (!session || !session.signature || !session.expiresAt || !session.operator) {
    return false;
  }
  if (Date.now() > session.expiresAt) {
    revokeAdminSession();
    return false;
  }
  for (const hash of AUTHORIZED_PASSKEY_HASHES) {
    const expectedSig = await hashString(`${hash}:${session.operator}:${session.expiresAt}`);
    if (expectedSig === session.signature) {
      return true;
    }
  }
  return false;
}

export function revokeAdminSession() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to revoke admin session', e);
  }
}

/* ========================================================================= */
/* 2. PARTICIPANT REGISTRATION & LOGIN VIA USN & SECURE PIN                 */
/* ========================================================================= */

/**
 * Registers a new participant using Full Name, USN, and Secure PIN.
 * No email address, OTP, or verification code required.
 */
export async function registerParticipantWithUSN({
  name,
  usn,
  pin,
  avatar = '👾',
  startingCoins = 10,
  existingParticipants = [],
}) {
  const cleanName = (name || '').trim();
  if (cleanName.length < 2) {
    return { success: false, error: 'Full name is required (minimum 2 characters).' };
  }

  const cleanUsn = (usn || '').trim().toUpperCase();
  if (!cleanUsn || cleanUsn.length < 3) {
    return { success: false, error: 'Valid USN (University Seat Number) is required (minimum 3 characters).' };
  }

  const cleanPin = String(pin || '').trim();
  if (!cleanPin || cleanPin.length < 4) {
    return { success: false, error: 'Secure PIN must be at least 4 digits or characters.' };
  }

  // Duplicate USN Check (case-insensitive)
  const isDuplicate = (existingParticipants || []).some(
    (p) => (p.usn || '').trim().toUpperCase() === cleanUsn
  );
  if (isDuplicate) {
    return {
      success: false,
      error: `A participant with USN "${cleanUsn}" is already registered. Please Sign In using your PIN.`,
    };
  }

  try {
    const pinHash = await hashPin(cleanPin, cleanUsn);
    const allocatedCoins = Number(startingCoins ?? 10);

    const participant = {
      id: `p-${cleanUsn.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36)}`,
      name: cleanName,
      usn: cleanUsn,
      pinHash,
      avatar: avatar || '👾',
      coins: allocatedCoins,
      registeredAt: new Date().toISOString(),
    };

    const session = {
      role: 'participant',
      participantId: participant.id,
      name: participant.name,
      usn: participant.usn,
      avatar: participant.avatar,
      issuedAt: Date.now(),
    };

    saveParticipantSession(session);

    // Sync to Supabase in background
    dbService.saveParticipant(participant).catch((err) => {
      console.warn('[authService] Supabase participant save error:', err);
    });

    return {
      success: true,
      participant,
      session,
      message: `Registration successful! Welcome to FUNTOPIA, ${cleanName}!`,
    };
  } catch (err) {
    return {
      success: false,
      error: `Registration error: ${err.message}`,
    };
  }
}

/**
 * Signs in an existing participant using USN and secure PIN.
 */
export async function loginParticipantWithUSN({ usn, pin, participants = [] }) {
  const cleanUsn = (usn || '').trim().toUpperCase();
  if (!cleanUsn) {
    return { success: false, error: 'University Seat Number (USN) is required.' };
  }

  const cleanPin = String(pin || '').trim();
  if (!cleanPin) {
    return { success: false, error: 'PIN is required to sign in.' };
  }

  const participant = (participants || []).find(
    (p) => (p.usn || '').trim().toUpperCase() === cleanUsn
  );

  if (!participant) {
    return {
      success: false,
      error: `No participant found with USN "${cleanUsn}". Please check your USN or Sign Up.`,
    };
  }

  try {
    const inputHash = await hashPin(cleanPin, cleanUsn);
    if (participant.pinHash !== inputHash) {
      return {
        success: false,
        error: 'ACCESS DENIED: Incorrect PIN. Please try again.',
      };
    }

    const session = {
      role: 'participant',
      participantId: participant.id,
      name: participant.name,
      usn: participant.usn,
      avatar: participant.avatar,
      issuedAt: Date.now(),
    };

    saveParticipantSession(session);

    return {
      success: true,
      participant,
      session,
      message: `Welcome back, ${participant.name}!`,
    };
  } catch (err) {
    return {
      success: false,
      error: `Sign in error: ${err.message}`,
    };
  }
}

export function saveParticipantSession(session) {
  try {
    const serialized = JSON.stringify(session);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PARTICIPANT_SESSION_KEY, serialized);
    }
  } catch (e) {
    console.error('Failed to store participant session', e);
  }
}

export function getParticipantSession() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(PARTICIPANT_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function revokeParticipantSession() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(PARTICIPANT_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to revoke participant session', e);
  }
}
