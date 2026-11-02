import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('--- PORTAL SELECTION: GUESS WHO & CORE PORTALS INTEGRITY ---', async (t) => {
  const portalSelectPath = path.resolve(process.cwd(), 'src/pages/PortalSelectPage.jsx');
  assert.ok(fs.existsSync(portalSelectPath), 'src/pages/PortalSelectPage.jsx must exist');

  const content = fs.readFileSync(portalSelectPath, 'utf8');

  await t.test('1. Guess Who portal navigation and target route', () => {
    assert.match(
      content,
      /\/guess-who/,
      'PortalSelectPage must reference the /guess-who route'
    );
    assert.match(
      content,
      /handleSelect\('\/guess-who'\)/,
      'Clicking Guess Who card must invoke handleSelect with /guess-who'
    );
  });

  await t.test('2. Core participant and admin portal routes preserved', () => {
    assert.match(
      content,
      /handleSelect\('\/participant'\)/,
      'Participant portal route must be preserved'
    );
    assert.match(
      content,
      /handleSelect\('\/admin'\)/,
      'Admin portal route must be preserved'
    );
  });

  await t.test('3. Card UI content, badges, and Call-to-Action', () => {
    assert.match(content, /GUESS WHO\?/, 'Must display GUESS WHO? title');
    assert.match(content, /PLAY NOW/, 'Must contain PLAY NOW button');
    assert.match(content, /12 PUZZLES/, 'Must feature 12 PUZZLES badge');
    assert.match(content, /7 TO WIN/, 'Must feature 7 TO WIN badge');
    assert.match(content, /PROJECTOR/, 'Must feature PROJECTOR badge');
  });

  await t.test('4. Grid layout responsiveness and branding', () => {
    assert.match(
      content,
      /lg:grid-cols-3/,
      'Must support 3-column layout on large screens for 3 portal cards'
    );
    assert.match(
      content,
      /FUNTOPIA/,
      'Must maintain FUNTOPIA branding in footer or header'
    );
  });
});
