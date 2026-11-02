import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('--- PORTAL SELECTION: TWO CORE PORTALS INTEGRITY ---', async (t) => {
  const portalSelectPath = path.resolve(process.cwd(), 'src/pages/PortalSelectPage.jsx');
  assert.ok(fs.existsSync(portalSelectPath), 'src/pages/PortalSelectPage.jsx must exist');

  const content = fs.readFileSync(portalSelectPath, 'utf8');

  await t.test('1. Core participant and championship admin portal routes present', () => {
    assert.match(
      content,
      /handleSelect\('\/participant'\)/,
      'Participant portal route must be present'
    );
    assert.match(
      content,
      /ENTER PARTICIPANT PORTAL/,
      'Participant portal button must be present'
    );
    assert.match(
      content,
      /handleSelect\('\/admin'\)/,
      'Admin portal route must be present'
    );
    assert.match(
      content,
      /ACCESS ADMIN PORTAL/,
      'Admin portal button must be present'
    );
  });

  await t.test('2. Standalone coordinator and redundant arena portals removed from selection', () => {
    assert.ok(
      !content.includes("handleSelect('/admin/guess-who')"),
      'Must NOT contain standalone /admin/guess-who coordinator portal choice'
    );
    assert.ok(
      !content.includes("handleSelect('/guess-who')"),
      'Must NOT contain standalone /guess-who choice on Stage Select (reserved for clean projector/admin)'
    );
    assert.ok(
      !content.includes('COORDINATOR LOGIN'),
      'Must NOT contain separate COORDINATOR LOGIN button on Stage Select'
    );
  });

  await t.test('3. Grid layout responsiveness and branding', () => {
    assert.match(
      content,
      /grid-cols-1 md:grid-cols-2/,
      'Must support responsive 1-column mobile and 2-column grid layout'
    );
    assert.match(
      content,
      /MADAGASCAR/,
      'Must maintain MADAGASCAR tournament branding'
    );
    assert.match(
      content,
      /TWO DEDICATED EXPERIENCES/,
      'Must state exactly TWO dedicated experiences in footer'
    );
  });
});
