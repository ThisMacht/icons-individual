import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createTheme, serializeTheme, themePath, validateTheme } from './theme.mjs';

try {
  const theme = createTheme();
  const assets = validateTheme(theme);
  mkdirSync(dirname(themePath), { recursive: true });
  writeFileSync(themePath, serializeTheme(theme));
  console.log(`Built dist/icons-individual-icon-theme.json (${assets.size} SVGs).`);
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
