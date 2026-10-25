# Icons Individual

An independent VS Code file icon theme.

This project is inspired by [antigravity-icons-supercharged](https://github.com/DavidBabel/antigravity-icons-supercharged), and its icon assets are based on the icon set from [vscode-symbols](https://github.com/miguelsolorio/vscode-symbols).

Includes their folder collection, named folder associations, distinct open/closed
folder icons, workspace root icons, and the full merged file icon collection.
All required assets are local; neither reference project is required to build or run it.

## Build and install

Requires Node.js 22 or newer and npm. VS Code 1.88 or newer is supported.

```bash
npm install
npm run build
npm run check
npm run package
code --install-extension ./icons-individual-0.1.0.vsix
```

In VS Code, open **Preferences → File Icon Theme** (or run that command from
the Command Palette) and select **Icons Individual**. Its theme ID is
`icons-individual`; it can also be selected in settings:

```json
"workbench.iconTheme": "icons-individual"
```

`npm run package` builds and checks again through `vscode:prepublish` before
creating the VSIX. It does not publish anything. Generated `dist/`, dependencies,
and VSIX files are ignored by Git.

The publisher `icons-individual-local` is a **temporary placeholder** for local
installation. Replace it with your own Marketplace publisher before publishing.
Changing publisher changes the installed extension's identity.

As of 2026-10-25, npm reports
[GHSA-xcx6-jx8p-x3h5](https://github.com/advisories/GHSA-xcx6-jx8p-x3h5) in
vsce's development authentication dependencies. `npm audit fix` currently
offers no automatic resolution for this dependency graph. These dependencies
are excluded from the VSIX; `npm audit --omit=dev` reports no vulnerabilities.

## Architecture

- `src/icons/folders/`: 252 vendored folder SVGs, including closed variants.
- `src/icons/files/`: 325 file SVGs from the pinned Symbols base and Antigravity overrides.
- `src/my/folder/` and `src/my/file/`: custom folder and file SVGs, included in the VSIX.
- `src/theme/definitions.json`: imported `[definition ID, asset path]` pairs.
  An array lets validation detect duplicate IDs before they are overwritten.
  Reference paths use `folders/` or `files/` under `src/icons/`.
- `src/theme/folders.json`: default/root icon IDs and folder-name associations.
  Each named association points at the expanded icon; its collapsed icon uses
  the same ID with `-closed` appended. Both definitions must exist. Unmatched
  workspace roots use the gray default pair.
- `src/theme/files.json`: default file icon and the full imported extension,
  filename, and language mappings (474 extensions, 833 filenames, 111 language IDs).
  Association names use lowercase, as VS Code matches them without case sensitivity.
- `src/theme/my-folder.json` and `src/theme/my-file.json`: custom definitions
  and folder/filename/extension mappings for SVGs under `src/my/`. Custom mappings override
  imported names. Clear their `associations`, `fileNames`, or `fileExtensions` entries to restore
  the imported mappings, then rebuild.
- `scripts/theme.mjs`: assembles and validates the theme from these sources.
- `scripts/build-theme.mjs`: deterministically writes
  `dist/icons-individual-icon-theme.json`. Do not edit this generated file.
- `scripts/check-theme.mjs` and `tests/`: check assets, definitions, association
  targets, theme structure, manifest paths, stale output, and failure cases.

To add a folder icon, put its expanded and closed SVGs in `src/icons/folders/`,
register both in `definitions.json`, and associate folder names in `folders.json`.
For files, add the SVG and definition, then update `files.json`. Rebuild, check,
and repackage. For custom icons, use `src/my/` and the corresponding `my-folder.json`
or `my-file.json` instead. The VSIX contains only the manifest, generated theme, SVGs, and
documentation/licenses; it has no runtime dependencies or activation code.

Folders named `pig` or `pigpig` use the custom pig folder pair. Files named
exactly `pig` or `pigpig` use the custom pig file icon.
Folder `gay` uses the rainbow pair; folders `license` and `licenses` use the
copyright badge pair. These mappings live in `src/theme/my-folder.json`.
Folders `data`, `dataset`, and `datasets` use the custom pink square-layer dataset pair.
Folder `.codex` uses a white scalloped terminal `>_` pair with a slate outline for light backgrounds.
Folders `markdown` and `markdowns` use the Markdown glyph inside a blue rounded rectangle.
Folder `raw` uses a brown vector `RAW` label; `processed` uses the green outline icon.
Folder `runs` uses a blue play triangle.
ZIP and other common compressed files use a blue zipper icon; RAR uses stacked
books and TAR (including `.tar.gz`, `.tgz`, and `.tar.xz`) uses a brown archive box.

## Future custom modes

Modes, alternate families, user overrides, presets, and per-project selection are
postponed. Assets, definitions, associations, and generated output are separate
so later build-time presets or runtime configuration can use the same source
data. Milestone 1 contributes one static theme and no configuration settings.

## Attribution and license

MIT. Folder artwork and mappings come from Antigravity Icons Supercharged by
David Babel and its pinned Symbols base by Miguel Solorio. File artwork comes
from that Symbols base and Antigravity overrides. Open/closed variants generated by the reference build
are vendored here without further SVG modifications.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for pinned source versions
and provenance, and `licenses/` for the original MIT notices. Keep those notices
with redistributed assets. This project is independently packaged and is not
affiliated with either reference extension.
