/**
 * FUNTOPIA AUTHENTICATION & IDENTITY SERVICE
 *
 * Implements:
 * 1. Cryptographically hashed administrator passkey verification.
 * 2. Real Gmail/email participant registration with verification, duplicate prevention,
 *    password hashing, and verified session management.
 */

// Cryptographic SHA-256 hashes of authorized administrative passkeys
const AUTHORIZED_PASSKEY_HASHES = [
  '10719878e0a5386a3d3b207636abfe3edb14069ae56c831dc54ced40b8b752df',
];

const ADMIN_SESSION_KEY = 'funtopia_admin_session';
const PARTICIPANT_SESSION_KEY = 'funtopia_participant_session';
const PENDING_VERIFICATIONS_KEY = 'funtopia_pending_verifications';

/**
 * Computes SHA-256 hex digest using Web Crypto API.
 */
export async function hashString(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ========================================================================= */
/* 1. ADMINISTRATOR PASSKEY AUTHENTICATION                                   */
/* ========================================================================= */

/**
 * Authenticates an administrator using their passkey.
 *
 * @param {Object} credentials
 * @param {string} credentials.passkey - Operator administrative passkey
 * @param {string} [credentials.operatorEmail] - Operator ID or email for audit trails
 * @returns {Promise<{ success: boolean, session?: Object, error?: string }>}
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
    const cleanEmail = operatorEmail.trim() || 'operator@funtopia.arcade';
    const signature = await hashString(`${inputHash}:${cleanEmail}:${expiresAt}`);

    const session = {
      role: 'admin',
      operator: cleanEmail,
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

/**
 * Validates active admin session integrity and expiration.
 */
export async function validateAdminSession(session) {
  if (!session || typeof session !== 'object') return false;
  if (session.role !== 'admin') return false;
  if (!session.expiresAt || typeof session.expiresAt !== 'number') return false;
  if (!session.signature || !session.operator) return false;

  // Check expiration
  if (Date.now() > session.expiresAt) {
    revokeAdminSession();
    return false;
  }

  // Validate cryptographic signature against authorized hashes
  try {
    for (const hash of AUTHORIZED_PASSKEY_HASHES) {
      const expectedSig = await hashString(`${hash}:${session.operator}:${session.expiresAt}`);
      if (expectedSig === session.signature) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }

  return false;
}

export function saveAdminSession(session) {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to store admin session', e);
  }
}

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function revokeAdminSession() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Failed to revoke admin session', e);
  }
}

/* ========================================================================= */
/* 2. REAL GMAIL / EMAIL PARTICIPANT AUTHENTICATION & VERIFICATION          */
/* ========================================================================= */

/**
 * Initiates registration with email verification code.
 * Rejects duplicate email addresses and weak passwords.
 */
export async function initiateParticipantRegistration({
  name,
  email,
  password,
  avatar = '👾',
  existingParticipants = [],
}) {
  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Full name is required (minimum 2 characters).' };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address (e.g. name@gmail.com).' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  // Enforce duplicate account prevention
  const isDuplicate = existingParticipants.some(
    (p) => (p.email || '').trim().toLowerCase() === cleanEmail
  );
  if (isDuplicate) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please log in instead.',
    };
  }

  // Generate 6-digit verification OTP
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const passwordHash = await hashString(password);

  const pendingRecord = {
    id: `p-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    passwordHash,
    avatar: avatar || '👾',
    verificationCode,
    isEmailVerified: false,
    coins: 500, // Standard starting casino-arcade coin budget
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minute verification window
  };

  // Store in pending verifications map
  try {
    const raw = sessionStorage.getItem(PENDING_VERIFICATIONS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[cleanEmail] = pendingRecord;
    sessionStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save pending verification', e);
  }

  return {
    success: true,
    cleanEmail,
    verificationCode,
    message: `Verification code generated for ${cleanEmail}.`,
  };
}

/**
 * Confirms email verification code and returns verified participant profile.
 */
export async function completeParticipantVerification({ email, code }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanCode = (code || '').trim();

  let pending = null;
  try {
    const raw = sessionStorage.getItem(PENDING_VERIFICATIONS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    pending = map[cleanEmail];
  } catch (e) {
    return { success: false, error: 'Verification session expired. Please register again.' };
  }

  if (!pending) {
    return { success: false, error: 'No pending registration found for this email. Please register again.' };
  }

  if (Date.now() > pending.expiresAt) {
    return { success: false, error: 'Verification code expired. Please request a new code.' };
  }

  if (pending.verificationCode !== cleanCode) {
    return { success: false, error: 'Incorrect verification code. Please check and try again.' };
  }

  // Create final verified profile
  const verifiedParticipant = {
    id: pending.id,
    name: pending.name,
    email: pending.email,
    passwordHash: pending.passwordHash,
    avatar: pending.avatar,
    isEmailVerified: true,
    coins: pending.coins || 500,
    registeredAt: new Date().toISOString(),
  };

  // Clean pending map
  try {
    const raw = sessionStorage.getItem(PENDING_VERIFICATIONS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    delete map[cleanEmail];
    sessionStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(map));
  } catch (e) {}

  // Issue verified participant session
  const session = {
    role: 'participant',
    participantId: verifiedParticipant.id,
    name: verifiedParticipant.name,
    email: verifiedParticipant.email,
    avatar: verifiedParticipant.avatar,
    issuedAt: Date.now(),
  };
  saveParticipantSession(session);

  return {
    success: true,
    participant: verifiedParticipant,
    session,
  };
}

/**
 * Signs in an existing verified participant with email and password.
 */
export async function loginParticipant({ email, password, registeredParticipants = [] }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const participant = registeredParticipants.find(
    (p) => (p.email || '').trim().toLowerCase() === cleanEmail
  );

  if (!participant) {
    return { success: false, error: 'No account registered with this email address. Please register.' };
  }

  if (!participant.isEmailVerified) {
    return { success: false, error: 'Email has not been verified. Please verify your email first.' };
  }

  const inputHash = await hashString(password);
  if (participant.passwordHash && participant.passwordHash !== inputHash) {
    return { success: false, error: 'Incorrect password for this email account.' };
  }

  const session = {
    role: 'participant',
    participantId: participant.id,
    name: participant.name,
    email: participant.email,
    avatar: participant.avatar,
    issuedAt: Date.now(),
  };
  saveParticipantSession(session);

  return {
    success: true,
    participant,
    session,
  };
}

export function saveParticipantSession(session) {
  try {
    sessionStorage.setItem(PARTICIPANT_SESSION_KEY, JSON.stringify(session));
  } catch (e) {}
}

export function getParticipantSession() {
  try {
    const raw = sessionStorage.getItem(PARTICIPANT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function revokeParticipantSession() {
  try {
    sessionStorage.removeItem(PARTICIPANT_SESSION_KEY);
  } catch (e) {}
}
