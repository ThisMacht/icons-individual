# Third-party notices

Icons Individual includes material from these MIT-licensed projects:

| Project | Author | Pinned source commit | Included material |
| --- | --- | --- | --- |
| [Antigravity Icons Supercharged](https://github.com/DavidBabel/antigravity-icons-supercharged/tree/9cb73f6da16c888bc133248033d8506ea4e7aa8d) | David Babel and contributors | `9cb73f6da16c888bc133248033d8506ea4e7aa8d` | Folder overrides, associations, and folder variants generated using its build scripts |
| [Symbols](https://github.com/miguelsolorio/vscode-symbols/tree/ab3c31d3bf63d29b77db3aaf59ca4aae203eacf6) | Miguel Solorio and contributors | `ab3c31d3bf63d29b77db3aaf59ca4aae203eacf6` | Base folder collection and associations, and selected file SVGs |

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
were given an explicit gray open/closed pair. The 26 SVGs in `src/icons/files/`
were copied unchanged from the pinned Symbols `src/icons/files/` directory;
their basic association selection is maintained locally.

No reference extension identity, runtime configuration code, release scripts,
or dependency on either reference repository is included.
