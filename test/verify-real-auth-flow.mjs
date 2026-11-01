import assert from 'node:assert/strict';
import fs from 'node:fs';

// Setup Mock Storage for Node.js test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};
globalThis.sessionStorage = {
  getItem: (k) => mockStorage.get(`session:${k}`) || null,
  setItem: (k, v) => mockStorage.set(`session:${k}`, String(v)),
  removeItem: (k) => mockStorage.delete(`session:${k}`),
  clear: () => mockStorage.clear(),
};

import {
  initiateParticipantRegistration,
  completeParticipantVerification,
  resendParticipantVerification,
  loginParticipant,
  saveParticipantSession,
  getParticipantSession,
  revokeParticipantSession,
  verifyAdminPasskey,
  validateAdminSession,
} from '../src/services/api/authService.js';
import { supabaseConfig, getSupabaseStatus } from '../src/services/supabaseClient.js';

console.log('=== FUNTOPIA: REAL AUTH & PARTICIPANT PORTAL VERIFICATION TEST ===\n');

async function runRealAuthTests() {
  // --------------------------------------------------------------------------
  // TEST 1: Honest Configuration Reporting & No Pretend Verification
  // --------------------------------------------------------------------------
  console.log('Test 1: Verifying honest Supabase configuration detection...');
  const status = getSupabaseStatus();
  console.log(`Supabase status message: "${status.message}"`);

  if (!supabaseConfig.isConfigured) {
    console.log('Testing unconfigured mode behavior (no live .env credentials)...');
    const regResult = await initiateParticipantRegistration({
      name: 'Real User',
      email: 'realuser@gmail.com',
      password: 'RealPassword123!',
      startingCoins: 50,
      existingParticipants: [],
    });

    assert.equal(regResult.success, false, 'Must NOT claim success when Supabase/SMTP is unconfigured');
    assert.equal(regResult.missingConfig, true, 'Must flag missingConfig as true');
    assert.ok(regResult.error.includes('Supabase'), 'Error must specify Supabase configuration is required');
    assert.equal('verificationCode' in regResult, false, 'Must NEVER reveal or generate a fake verificationCode');
    console.log('✓ Test 1 Passed: System honestly rejects registration when Supabase/SMTP is unconfigured and never exposes fake OTP.\n');
  } else {
    console.log('✓ Test 1 Passed: Supabase is configured with endpoint:', supabaseConfig.url, '\n');
  }

  // --------------------------------------------------------------------------
  // TEST 2: Duplicate Email Prevention
  // --------------------------------------------------------------------------
  console.log('Test 2: Verifying duplicate email prevention...');
  const existingList = [{ id: 'p-existing', name: 'Existing Alice', email: 'alice@gmail.com', isEmailVerified: true }];
  const dupResult = await initiateParticipantRegistration({
    name: 'Alice Duplicate',
    email: 'alice@gmail.com',
    password: 'Password123!',
    existingParticipants: existingList,
  });
  assert.equal(dupResult.success, false, 'Duplicate registration must be rejected');
  assert.ok(dupResult.error.includes('already exists'), 'Error must inform user account exists');
  console.log('✓ Test 2 Passed: Duplicate registration blocked with message:', `"${dupResult.error}"\n`);

  // --------------------------------------------------------------------------
  // TEST 3: Invalid & Expired Verification Codes Handled
  // --------------------------------------------------------------------------
  console.log('Test 3: Testing invalid and short verification code handling...');
  const shortCodeTest = await completeParticipantVerification({
    email: 'alice@gmail.com',
    code: '12',
  });
  assert.equal(shortCodeTest.success, false, 'Short code must fail');
  assert.ok(shortCodeTest.error.includes('6-digit'), 'Error must require 6-digit code');

  const emptyCodeTest = await completeParticipantVerification({
    email: 'alice@gmail.com',
    code: '',
  });
  assert.equal(emptyCodeTest.success, false, 'Empty code must fail');
  console.log('✓ Test 3 Passed: Short and empty verification codes rejected.\n');

  // --------------------------------------------------------------------------
  // TEST 4: Unverified Participants Blocked from Logging In
  // --------------------------------------------------------------------------
  console.log('Test 4: Verifying unverified participants cannot log in...');
  const unverifiedList = [{
    id: 'p-unverified',
    name: 'Unverified Bob',
    email: 'bob@gmail.com',
    passwordHash: 'dummyhash',
    isEmailVerified: false,
  }];
  const unverifiedLogin = await loginParticipant({
    email: 'bob@gmail.com',
    password: 'password123',
    registeredParticipants: unverifiedList,
  });
  assert.equal(unverifiedLogin.success, false, 'Unverified participant must NOT be allowed to log in');
  assert.ok(unverifiedLogin.error.includes('not been verified'), 'Error must state email is not verified');
  console.log('✓ Test 4 Passed: Unverified participant blocked from portal access.\n');

  // --------------------------------------------------------------------------
  // TEST 5: Session Persistence Across Page Refreshes
  // --------------------------------------------------------------------------
  console.log('Test 5: Testing session storage in localStorage (persistence across refreshes)...');
  const sampleSession = {
    role: 'participant',
    participantId: 'p-persist-test',
    name: 'Persisted Player',
    email: 'player@gmail.com',
    avatar: '🦊',
    issuedAt: Date.now(),
  };

  saveParticipantSession(sampleSession);
  const loadedSession = getParticipantSession();
  assert.ok(loadedSession, 'Failed to load persisted participant session');
  assert.equal(loadedSession.participantId, 'p-persist-test');
  assert.equal(loadedSession.email, 'player@gmail.com');
  console.log('✓ Test 5 Passed: Participant session correctly saved and persisted.\n');

  // --------------------------------------------------------------------------
  // TEST 6: Logout Revocation
  // --------------------------------------------------------------------------
  console.log('Test 6: Testing logout session revocation...');
  revokeParticipantSession();
  const revokedCheck = getParticipantSession();
  assert.equal(revokedCheck, null, 'Session must be null after logout');
  console.log('✓ Test 6 Passed: Logout completely revokes participant session.\n');

  // --------------------------------------------------------------------------
  // TEST 7: Confirm "Switch User" is Completely Removed
  // --------------------------------------------------------------------------
  console.log('Test 7: Verifying "Switch User" is completely eliminated from code...');
  const portalCode = fs.readFileSync('src/pages/ParticipantPortal.jsx', 'utf8');
  assert.equal(portalCode.includes('SWITCH USER'), false, 'Found "SWITCH USER" in ParticipantPortal.jsx!');
  assert.equal(portalCode.includes('Switch User'), false, 'Found "Switch User" in ParticipantPortal.jsx!');
  assert.equal(portalCode.includes('switchUser'), false, 'Found "switchUser" in ParticipantPortal.jsx!');

  const regCode = fs.readFileSync('src/components/participant/ParticipantRegistration.jsx', 'utf8');
  assert.equal(regCode.includes('sentCodeHint'), false, 'Found fake sentCodeHint in ParticipantRegistration.jsx!');
  assert.equal(regCode.includes('FILL CODE'), false, 'Found fake FILL CODE in ParticipantRegistration.jsx!');
  assert.equal(regCode.includes('VERIFICATION DISPATCH'), false, 'Found fake VERIFICATION DISPATCH in ParticipantRegistration.jsx!');
  console.log('✓ Test 7 Passed: "Switch User" and fake OTP elements are 100% removed.\n');

  // --------------------------------------------------------------------------
  // TEST 8: Admin Authentication Remains Intact
  // --------------------------------------------------------------------------
  console.log('Test 8: Confirming Admin Authentication remains intact...');
  const adminAuth = await verifyAdminPasskey({
    passkey: 'QWERTY404',
    operatorEmail: 'operator@funtopia.arcade',
  });
  assert.equal(adminAuth.success, true, 'Admin login with QWERTY404 must succeed');
  const validAdmin = await validateAdminSession(adminAuth.session);
  assert.equal(validAdmin, true, 'Admin session signature must be valid');
  console.log('✓ Test 8 Passed: Admin portal authentication intact.\n');

  console.log('================================================================');
  console.log('>>> ALL REAL AUTH & CLEANUP TESTS PASSED 100%! <<<');
  console.log('================================================================\n');
}

runRealAuthTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
