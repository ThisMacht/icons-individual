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
  assert.equal(theme.fileNames['package.json'], 'npm-full');
  assert.equal(theme.file, 'document');
});

test('full file mappings cover framework files, source aliases, and repaired upstream references', () => {
  const theme = createTheme();
  assert.equal(theme.fileExtensions['component.ts'], 'angular-component');
  assert.equal(theme.fileExtensions['spec.ts'], 'tests');
  assert.equal(theme.fileNames['agents.md'], 'robot');
  assert.equal(theme.fileNames['readme.md'], 'readme');
  assert.equal(theme.fileExtensions.less, 'brackets-sky');
  assert.equal(theme.languageIds.yml, 'yaml');
  assert.equal(theme.fileNames['go.mod'], 'go-pink');
});

test('custom pig associations resolve to local SVGs in src/my', () => {
  const theme = createTheme();
  validateTheme(theme);
  for (const name of ['pig', 'pigpig']) {
    assert.equal(theme.folderNames[name], 'folder-pig-closed');
    assert.equal(theme.folderNamesExpanded[name], 'folder-pig');
    assert.equal(theme.fileNames[name], 'pig');
  }
  assert.equal(theme.iconDefinitions.pig.iconPath, '../src/my/file/pig.svg');
  assert.equal(theme.iconDefinitions['folder-pig'].iconPath, '../src/my/folder/folder-pig.svg');
  assert.equal(theme.iconDefinitions['folder-pig-closed'].iconPath, '../src/my/folder/folder-pig-closed.svg');
});

test('custom mappings override imported names and can be cleared to restore them', () => {
  const folders = { associations: { pig: 'folder-node' } };
  const files = { fileNames: { pig: 'document' } };
  const myFolders = { definitions: [], associations: { pig: 'folder-pig' } };
  const myFiles = { definitions: [], fileNames: { pig: 'pig' } };
  const custom = createTheme(undefined, folders, files, myFolders, myFiles);
  assert.equal(custom.folderNames.pig, 'folder-pig-closed');
  assert.equal(custom.folderNamesExpanded.pig, 'folder-pig');
  assert.equal(custom.fileNames.pig, 'pig');
  const restored = createTheme(undefined, folders, files,
    { ...myFolders, associations: {} }, { ...myFiles, fileNames: {} });
  assert.equal(restored.folderNames.pig, 'folder-node-closed');
  assert.equal(restored.folderNamesExpanded.pig, 'folder-node');
  assert.equal(restored.fileNames.pig, 'document');
  assert.deepEqual(folders.associations, { pig: 'folder-node' });
  assert.deepEqual(files.fileNames, { pig: 'document' });
});

test('imported sources contain no custom definitions or pig aliases', () => {
  const imported = createTheme(undefined, undefined, undefined,
    { definitions: [], associations: {} }, { definitions: [], fileNames: {} });
  validateTheme(imported);
  assert(!Object.values(imported.iconDefinitions).some(d => d.iconPath.startsWith('../src/my/')));
  for (const name of ['pig', 'pigpig']) {
    assert(!Object.hasOwn(imported.folderNames, name));
    assert(!Object.hasOwn(imported.fileNames, name));
  }
});

test('custom layers retain schema validation and reject duplicate imported IDs', () => {
  assert.throws(() => createTheme(undefined, undefined, undefined,
    { definitions: [], associations: [] }), /my-folder.associations must be an object/);
  assert.throws(() => createTheme(undefined, undefined, undefined, undefined,
    { definitions: [], fileNames: {}, typo: {} }), /Unknown my-file property: typo/);
  assert.throws(() => createTheme(undefined, undefined, undefined, undefined,
    { definitions: [['document', 'my/file/pig.svg']], fileNames: {} }), /Duplicate definition ID: document/);
  assert.throws(() => createTheme(undefined, undefined, { fileNames: [] }), /files.fileNames must be an object/);
});

test('custom asset paths cannot escape their directories', () => {
  assert.throws(() => createTheme([
    ['pig', 'my/file/../pig.svg'],
  ], { associations: {} }, {}), /Invalid asset/);
  const theme = createTheme();
  theme.iconDefinitions.pig.iconPath = '../src/my/file/../pig.svg';
  assert.throws(() => validateTheme(theme), /invalid local SVG path/);
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
