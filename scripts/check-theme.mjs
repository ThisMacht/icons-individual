import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createTheme, root, serializeTheme, themePath, validateTheme } from './theme.mjs';

try {
  const output = readFileSync(themePath, 'utf8');
  const theme = JSON.parse(output);
  const assets = validateTheme(theme);
  assert.equal(output, serializeTheme(createTheme()), 'Generated theme is stale or modified; run npm run build.');
  const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const [contribution] = manifest.contributes.iconThemes;
  assert.equal(contribution.id, 'icons-individual', 'Unexpected theme ID');
  assert.equal(contribution.label, 'Icons Individual', 'Unexpected theme label');
  assert.equal(resolve(root, contribution.path), themePath, 'Theme contribution path is incorrect');
  for (const category of ['files', 'folders']) {
    for (const name of readdirSync(resolve(root, `src/icons/${category}`))) {
      if (name.endsWith('.svg')) {
        assert(assets.has(resolve(root, `src/icons/${category}`, name)), `SVG has no definition: ${category}/${name}`);
      }
    }
  }
  console.log(`Integrity OK: ${assets.size} SVGs, ${Object.keys(theme.folderNames).length} named folders with open/closed mappings; generated output matches source.`);
} catch (error) {
  console.error(`Integrity check failed: ${error.message}`);
  process.exitCode = 1;
}
