import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const themePath = resolve(root, 'dist/icons-individual-icon-theme.json');

const defaultKeys = ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded'];
const associationKeys = [
  'fileExtensions', 'fileNames', 'languageIds', 'folderNames',
  'folderNamesExpanded', 'rootFolderNames', 'rootFolderNamesExpanded',
];

function object(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
}

function readSource(name) {
  return JSON.parse(readFileSync(resolve(root, `src/theme/${name}.json`), 'utf8'));
}

export function createTheme(
  definitions = readSource('definitions'),
  folders = readSource('folders'),
  files = readSource('files'),
) {
  assert(Array.isArray(definitions), 'definitions must be an array of [id, asset] pairs');
  const iconDefinitions = {};
  for (const pair of definitions) {
    assert(Array.isArray(pair) && pair.length === 2, 'Each definition must be [id, asset]');
    const [id, asset] = pair;
    assert(typeof id === 'string' && /^[a-z0-9-]+$/.test(id), `Invalid definition ID: ${id}`);
    assert(!Object.hasOwn(iconDefinitions, id), `Duplicate definition ID: ${id}`);
    assert(typeof asset === 'string' && /^(files|folders)\/[a-z0-9-]+\.svg$/.test(asset), `Invalid asset: ${asset}`);
    iconDefinitions[id] = { iconPath: `../src/icons/${asset}` };
  }

  object(folders, 'folders');
  object(folders.associations, 'folders.associations');
  object(files, 'files');
  for (const key of Object.keys(folders)) {
    assert(['folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded', 'associations'].includes(key), `Unknown folder property: ${key}`);
  }
  for (const key of Object.keys(files)) {
    assert(['file', 'fileExtensions', 'fileNames', 'languageIds'].includes(key), `Unknown file property: ${key}`);
  }

  const { associations, ...folderDefaults } = folders;
  const folderNames = {};
  for (const [name, id] of Object.entries(associations)) {
    assert(typeof id === 'string', `Folder association ${name} must reference an ID`);
    folderNames[name] = `${id}-closed`;
  }
  return {
    iconDefinitions,
    ...files,
    ...folderDefaults,
    folderNames,
    folderNamesExpanded: { ...associations },
    hidesExplorerArrows: false,
  };
}

export function validateTheme(theme) {
  object(theme, 'theme');
  object(theme.iconDefinitions, 'iconDefinitions');
  assert(Object.keys(theme.iconDefinitions).length > 0, 'iconDefinitions must not be empty');
  for (const key of Object.keys(theme)) {
    assert(['iconDefinitions', 'hidesExplorerArrows', ...defaultKeys, ...associationKeys].includes(key), `Unknown theme property: ${key}`);
  }
  assert(typeof theme.hidesExplorerArrows === 'boolean', 'hidesExplorerArrows must be a boolean');

  const assets = new Set();
  for (const [id, definition] of Object.entries(theme.iconDefinitions)) {
    object(definition, `Definition ${id}`);
    const { iconPath } = definition;
    assert(Object.keys(definition).length === 1 && typeof iconPath === 'string', `Definition ${id} must contain iconPath`);
    assert(/^\.\.\/src\/icons\/(files|folders)\/[a-z0-9-]+\.svg$/.test(iconPath), `Definition ${id}: invalid local SVG path ${iconPath}`);
    const asset = resolve(dirname(themePath), iconPath);
    let svg;
    try {
      svg = readFileSync(asset, 'utf8');
    } catch {
      throw new Error(`Definition ${id}: missing or unreadable SVG ${iconPath}`);
    }
    assert(/<svg\b[^>]*\bxmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg) && svg.includes('</svg>'), `Definition ${id}: invalid SVG ${iconPath}`);
    assets.add(asset);
  }

  function reference(id, label) {
    assert(typeof id === 'string' && Object.hasOwn(theme.iconDefinitions, id), `${label} references nonexistent definition: ${id}`);
  }
  for (const key of defaultKeys) reference(theme[key], key);
  for (const key of associationKeys) {
    if (theme[key] === undefined) continue;
    object(theme[key], key);
    for (const [name, id] of Object.entries(theme[key])) {
      assert(name.length > 0 && name === name.toLowerCase(), `${key}.${name}: association names must be nonempty and lowercase`);
      reference(id, `${key}.${name}`);
    }
  }
  return assets;
}

export function serializeTheme(theme) {
  return `${JSON.stringify(theme, null, 2)}\n`;
}
