import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  verifyAdminPasskey,
  validateAdminSession,
  getAdminSession,
  revokeAdminSession,
} from '../src/services/api/authService.js';

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

async function runPasskeyTests() {
  console.log('=== FUNTOPIA: ADMIN PASSKEY & OPERATOR IDENTITY VERIFICATION ===\n');

  // Test 1: Verify exact expected passkey QWERTY404 with operator email
  console.log('Test 1: Authenticating with passkey QWERTY404 and operator email...');
  const res1 = await verifyAdminPasskey({
    passkey: 'QWERTY404',
    operatorEmail: 'operator@funtopia.arcade',
  });
  assert.equal(res1.success, true, 'Test 1 Failed: QWERTY404 passkey was rejected!');
  assert.ok(res1.session, 'Test 1 Failed: Session was not created');
  assert.equal(res1.session.role, 'admin');
  assert.equal(res1.session.operator, 'operator@funtopia.arcade');
  assert.equal(res1.session.email, 'operator@funtopia.arcade');
  assert.ok(res1.session.signature, 'Test 1 Failed: Cryptographic signature missing');
  assert.ok(res1.session.token, 'Test 1 Failed: Session token missing');
  console.log('✓ Test 1 Passed: QWERTY404 authenticated successfully with operator email.\n');

  // Test 2: Verify session cryptographic validation
  console.log('Test 2: Validating active admin session integrity...');
  const isValidSession = await validateAdminSession(res1.session);
  assert.equal(isValidSession, true, 'Test 2 Failed: Session cryptographic check failed');
  console.log('✓ Test 2 Passed: Session signature validated against authorized hashes.\n');

  // Test 3: Authenticating with custom identity (e.g. "admin-lead")
  console.log('Test 3: Authenticating with operator identity "lead-director"...');
  const res3 = await verifyAdminPasskey({
    passkey: 'QWERTY404',
    operatorEmail: 'lead-director',
  });
  assert.equal(res3.success, true, 'Test 3 Failed: Custom operator identity failed');
  assert.equal(res3.session.operator, 'lead-director');
  assert.equal(res3.session.email, 'lead-director');
  const validDirector = await validateAdminSession(res3.session);
  assert.equal(validDirector, true, 'Test 3 Failed: Director session check failed');
  console.log('✓ Test 3 Passed: Custom operator identity "lead-director" accepted and signed.\n');

  // Test 4: Default operator email when field left blank
  console.log('Test 4: Authenticating with blank operator email (default fallback)...');
  const res4 = await verifyAdminPasskey({
    passkey: 'QWERTY404',
    operatorEmail: '   ',
  });
  assert.equal(res4.success, true, 'Test 4 Failed: Blank email fallback failed');
  assert.equal(res4.session.operator, 'operator@funtopia.arcade');
  console.log('✓ Test 4 Passed: Default operator email fallback operates correctly.\n');

  // Test 5: Rejection of incorrect passkeys
  console.log('Test 5: Testing incorrect passkeys...');
  const wrong1 = await verifyAdminPasskey({ passkey: 'WRONG123' });
  assert.equal(wrong1.success, false, 'Expected failure on WRONG123');
  assert.match(wrong1.error, /ACCESS DENIED/i);

  const wrong2 = await verifyAdminPasskey({ passkey: 'qwerty404' }); // Case sensitivity check
  assert.equal(wrong2.success, false, 'Expected failure on lowercase qwerty404');

  const wrong3 = await verifyAdminPasskey({ passkey: 'QWERTY 404' }); // Space within token check
  assert.equal(wrong3.success, false, 'Expected failure on token with internal space');

  const wrongEmpty = await verifyAdminPasskey({ passkey: '' });
  assert.equal(wrongEmpty.success, false, 'Expected failure on empty passkey');

  console.log('✓ Test 5 Passed: Case sensitivity, wrong keys, and internal spaces rejected.\n');

  // Test 6: Verify passkey is NOT hardcoded in UI or frontend source
  console.log('Test 6: Checking that passkey string is hidden from UI and frontend source code...');
  const adminLoginCode = fs.readFileSync('src/components/admin/AdminLogin.jsx', 'utf8');
  assert.equal(adminLoginCode.includes('QWERTY404'), false, 'Passkey leaked in AdminLogin.jsx!');
  assert.equal(adminLoginCode.includes('FUNTOPIA-ADMIN-2026'), false, 'Old passkey in AdminLogin.jsx!');

  const adminPortalCode = fs.readFileSync('src/pages/AdminPortal.jsx', 'utf8');
  assert.equal(adminPortalCode.includes('QWERTY404'), false, 'Passkey leaked in AdminPortal.jsx!');

  console.log('✓ Test 6 Passed: Passkey is completely hidden from UI and frontend code.\n');

  console.log('================================================================');
  console.log('>>> ALL ADMIN AUTHENTICATION TESTS PASSED 100%! <<<');
  console.log('================================================================\n');
}

runPasskeyTests().catch((err) => {
  console.error('Passkey Test Suite Failed:', err);
  process.exit(1);
});
