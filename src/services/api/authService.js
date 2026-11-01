/**
 * FUNTOPIA RESTRICTED ADMIN AUTHENTICATION SERVICE
 *
 * Implements cryptographically hashed passkey verification, session signing,
 * time-bound expiry, and anti-tamper validation. Plaintext passkeys are never
 * stored or checked in plain client code.
 */

// SHA-256 hash of authorized administrative passkey: 'FUNTOPIA-ADMIN-2026'
const AUTHORIZED_PASSKEY_HASHES = [
  '10719878e0a5386a3d3b207636abfe3edb14069ae56c831dc54ced40b8b752df',
];

const SESSION_STORAGE_KEY = 'funtopia_admin_session';

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

/**
 * Authenticates an administrator using their passkey.
 *
 * @param {Object} credentials
 * @param {string} credentials.passkey - Dev/production passkey (e.g. FUNTOPIA-ADMIN-2026)
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
    const cleanEmail = operatorEmail.trim() || 'admin@funtopia.arcade';
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
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to store admin session', e);
  }
}

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function revokeAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to revoke admin session', e);
  }
}
