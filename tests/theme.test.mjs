import assert from 'node:assert/strict';
import test from 'node:test';
import { createTheme, validateTheme } from '../scripts/theme.mjs';

test('imported folders retain distinct open/closed artwork, including override aliases', () => {
  const theme = createTheme();
  validateTheme(theme);
  for (const name of ['src', 'tests', 'node_modules', 'agents']) {
    assert.notEqual(theme.folderNames[name], theme.folderNamesExpanded[name]);
    assert.notEqual(
      theme.iconDefinitions[theme.folderNames[name]].iconPath,
      theme.iconDefinitions[theme.folderNamesExpanded[name]].iconPath,
    );
  }
  assert.notEqual(theme.rootFolder, theme.rootFolderExpanded);
  assert.equal(theme.fileExtensions.ts, 'ts');
  assert.equal(theme.fileNames['package.json'], 'npm');
  assert.equal(theme.file, 'document');
});

test('duplicate definition IDs fail before they can be overwritten', () => {
  assert.throws(() => createTheme([
    ['document', 'files/document.svg'],
    ['document', 'files/text.svg'],
  ], { associations: {} }, {}), /Duplicate definition ID: document/);
});

for (const [label, mutate, expected] of [
  ['missing SVG', t => { t.iconDefinitions.document.iconPath = '../src/icons/files/missing.svg'; }, /missing or unreadable SVG/],
  ['unknown association', t => { t.folderNames.tests = 'missing'; }, /folderNames.tests references nonexistent/],
  ['unknown root default', t => { t.rootFolderExpanded = 'missing'; }, /rootFolderExpanded references nonexistent/],
  ['malformed associations', t => { t.fileExtensions = []; }, /fileExtensions must be an object/],
  ['misspelled property', t => { t.folderExpaned = 'folder'; }, /Unknown theme property/],
  ['external asset', t => { t.iconDefinitions.document.iconPath = 'https://example.com/icon.svg'; }, /invalid local SVG path/],
]) {
  test(`integrity rejects ${label}`, () => {
    const theme = createTheme();
    mutate(theme);
    assert.throws(() => validateTheme(theme), expected);
  });
}
