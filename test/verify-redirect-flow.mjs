/**
 * Test: Supabase Redirect Flow & Auth Callback
 */
import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('=== VERIFYING SUPABASE CONFIRMATION REDIRECT FLOW ===\n');

// 1. Verify vite.config.js has strictPort and port 5173
const viteConfigContent = fs.readFileSync('vite.config.js', 'utf8');
assert(viteConfigContent.includes('port: 5173'), 'vite.config.js must set port: 5173');
assert(viteConfigContent.includes('strictPort: true'), 'vite.config.js must enforce strictPort: true');
console.log('✓ Test 1 Passed: vite.config.js enforces strict port 5173');

// 2. Verify authService.js uses /auth/callback for emailRedirectTo in signUp and resend
const authServiceContent = fs.readFileSync('src/services/api/authService.js', 'utf8');
assert(authServiceContent.includes('/auth/callback'), 'authService.js must use /auth/callback as redirectUrl');
assert(!authServiceContent.includes('emailRedirectTo: typeof window !== \'undefined\' ? `${window.location.origin}/participant`'), 'resend must not redirect directly to participant without callback handler');
console.log('✓ Test 2 Passed: authService.js directs confirmation links to /auth/callback');

// 3. Verify App.jsx imports AuthCallback and mounts /auth/callback route
const appContent = fs.readFileSync('src/App.jsx', 'utf8');
assert(appContent.includes("import AuthCallback from './pages/AuthCallback'"), 'App.jsx must import AuthCallback');
assert(appContent.includes('path="/auth/callback"'), 'App.jsx must include /auth/callback route');
console.log('✓ Test 3 Passed: App.jsx mounts /auth/callback route with handler');

// 4. Verify AuthCallback.jsx handles PKCE exchange, error parameters, and fallback
const authCallbackContent = fs.readFileSync('src/pages/AuthCallback.jsx', 'utf8');
assert(authCallbackContent.includes('exchangeCodeForSession'), 'AuthCallback must handle PKCE exchangeCodeForSession');
assert(authCallbackContent.includes('errorDescription'), 'AuthCallback must inspect error_description for expired/invalid links');
assert(authCallbackContent.includes('resendParticipantVerification'), 'AuthCallback must support resending verification');
console.log('✓ Test 4 Passed: AuthCallback handles PKCE code exchange and expired/invalid link errors');

// 5. Verify ParticipantPortal.jsx forwards any stray confirmation params to /auth/callback
const participantContent = fs.readFileSync('src/pages/ParticipantPortal.jsx', 'utf8');
assert(participantContent.includes('/auth/callback'), 'ParticipantPortal must forward direct confirmation links to /auth/callback');
console.log('✓ Test 5 Passed: ParticipantPortal forwards direct confirmation params to /auth/callback');

console.log('\n========================================================');
console.log('>>> ALL SUPABASE CONFIRMATION REDIRECT TESTS PASSED! <<<');
console.log('========================================================\n');
