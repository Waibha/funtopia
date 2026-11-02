import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('--- PORTAL SELECTION: GUESS WHO & CORE PORTALS INTEGRITY ---', async (t) => {
  const portalSelectPath = path.resolve(process.cwd(), 'src/pages/PortalSelectPage.jsx');
  assert.ok(fs.existsSync(portalSelectPath), 'src/pages/PortalSelectPage.jsx must exist');

  const content = fs.readFileSync(portalSelectPath, 'utf8');

  await t.test('1. Guess Who player portal navigation and target route', () => {
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
    assert.match(content, /GUESS WHO\?/, 'Must display GUESS WHO? title');
    assert.match(content, /PLAY NOW/, 'Must contain PLAY NOW button');
    assert.match(content, /12 PUZZLES/, 'Must feature 12 PUZZLES badge');
    assert.match(content, /7 TO WIN/, 'Must feature 7 TO WIN badge');
    assert.match(content, /PROJECTOR/, 'Must feature PROJECTOR badge');
  });

  await t.test('2. Guess Who admin/coordinator portal navigation and target route', () => {
    assert.match(
      content,
      /\/admin\/guess-who/,
      'PortalSelectPage must reference the /admin/guess-who route'
    );
    assert.match(
      content,
      /handleSelect\('\/admin\/guess-who'\)/,
      'Clicking coordinator card must invoke handleSelect with /admin/guess-who'
    );
    assert.match(
      content,
      /GUESS WHO — ADMIN \/ COORDINATOR/,
      'Must display GUESS WHO — ADMIN / COORDINATOR title'
    );
    assert.match(
      content,
      /COORDINATOR LOGIN/,
      'Must contain COORDINATOR LOGIN button label'
    );
    assert.match(
      content,
      /COORDINATOR ACCESS/,
      'Must contain COORDINATOR ACCESS badge'
    );
    assert.match(
      content,
      /GW_COORDINATOR_CONSOLE\.SYS/,
      'Must display retro coordinator marquee bar'
    );
  });

  await t.test('3. Core participant and championship admin portal routes preserved', () => {
    assert.match(
      content,
      /handleSelect\('\/participant'\)/,
      'Participant portal route must be preserved'
    );
    assert.match(
      content,
      /ENTER PARTICIPANT PORTAL/,
      'Participant portal button must be preserved'
    );
    assert.match(
      content,
      /handleSelect\('\/admin'\)/,
      'Admin portal route must be preserved'
    );
    assert.match(
      content,
      /ACCESS ADMIN PORTAL/,
      'Admin portal button must be preserved'
    );
  });

  await t.test('4. Grid layout responsiveness and branding', () => {
    assert.match(
      content,
      /grid-cols-1 md:grid-cols-2/,
      'Must support responsive 1-column mobile and 2-column grid layout'
    );
    assert.match(
      content,
      /MADAGASCAR|FUNTOPIA/,
      'Must maintain FUNTOPIA branding in footer or header'
    );
  });
});
