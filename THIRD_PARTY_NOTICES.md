# Third-party notices

Icons Individual includes material from these MIT-licensed projects:

| Project | Author | Pinned source commit | Included material |
| --- | --- | --- | --- |
| [Antigravity Icons Supercharged](https://github.com/DavidBabel/antigravity-icons-supercharged/tree/9cb73f6da16c888bc133248033d8506ea4e7aa8d) | David Babel and contributors | `9cb73f6da16c888bc133248033d8506ea4e7aa8d` | File/folder overrides, associations, and folder variants generated using its build scripts |
| [Symbols](https://github.com/miguelsolorio/vscode-symbols/tree/ab3c31d3bf63d29b77db3aaf59ca4aae203eacf6) | Miguel Solorio and contributors | `ab3c31d3bf63d29b77db3aaf59ca4aae203eacf6` | Base folder and file collections and associations |

Both upstream licenses contain `Copyright (c) 2020-22 Miguel Solorio`.
Their complete license texts are preserved in
`licenses/antigravity-icons-supercharged-MIT.txt` and
`licenses/vscode-symbols-MIT.txt`. Include these copyright and permission notices
in redistributed copies or substantial portions of the material.

## Asset provenance

The Symbols commit is the base pinned by the Antigravity commit above, rather
than an independently chosen newer Symbols revision. The reference snapshots
were downloaded outside this repository; no submodule or runtime link is used.

For this initial import, Antigravity's reviewed
`scripts/build-steps/1-build-json.ts` and `3-build-folders.ts` were run against
that base in a temporary directory. The 252 resulting `build-gray/icons/folders/`
SVGs were copied into `src/icons/folders/` unchanged. This includes the original
expanded artwork and generated `-closed.svg` variants. No blue recoloring,
rasterization, or further SVG transformation was applied. These generated
variants are now maintained as local assets; normal builds do not run the
reference build scripts.

The 198 expanded named-folder associations were adapted into
`src/theme/folders.json`; definition aliases were normalized to the SVG filename
stem (for example, `folder-tests-icon` becomes `folder-tests`). Root defaults
were given an explicit gray open/closed pair.

The full file collection was imported by also running Antigravity's
`scripts/build-steps/2-build-files.ts`. All 325 resulting `build-gray/icons/files/`
SVGs were copied unchanged to `src/icons/files/`. Antigravity overrides take
precedence over base files with the same name, including `astro.svg`,
`readme.svg`, and `rust.svg`. No reference build scripts are needed locally.

The full merged file associations are maintained in `src/theme/files.json`:
474 extensions, 833 filenames, and 111 language IDs. Case aliases with identical
targets were consolidated into lowercase names. Definition aliases were
normalized to SVG filename stems (for example, `tests-icon` becomes `tests`,
`go-mod` becomes `go-pink`, and `unity-prefab` becomes `resource-sky`). Two
undefined upstream targets were repaired: extension `less` uses `brackets-sky`
(matching the upstream LESS language icon), and language ID `yml` uses `yaml`.

No reference extension identity, runtime configuration code, release scripts,
or dependency on either reference repository is included.

The custom `src/my/folder/folder-license.svg` and its closed variant reuse the
copyright glyph paths from the vendored Symbols `src/icons/files/license.svg`,
scaled as a folder badge. The same upstream MIT notices apply to that artwork.

The custom `src/my/folder/folder-markdown.svg` and its closed variant reuse the
glyph path and blue color from the vendored Symbols `src/icons/files/markdown.svg`,
scaled inside a rounded rectangle. The same upstream MIT notices apply.
