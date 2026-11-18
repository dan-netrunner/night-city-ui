## What changes

<!-- One paragraph. What a reader of the diff needs to know that the diff itself does not say. -->

Closes #

## Kind of change

- [ ] component behaviour or a new component
- [ ] tokens / theming
- [ ] docs site or guide
- [ ] build, CI or packaging
- [ ] dependency bump

## Checklist

- [ ] every commit is signed off (`git commit -s`; the `dco` check enforces it)
- [ ] `npm test` passes
- [ ] `npm run build` passes (type-check plus docs build)
- [ ] `npm run build:lib` passes and `npm pack --dry-run` still shows only library output
- [ ] the change was looked at in **all four skins**, not just the default
- [ ] keyboard-only pass: focus lands where it should, `Esc` and arrows behave
- [ ] styles put values in `tokens.css` and structure in `ui.css`
- [ ] no new runtime dependency, no game assets or fonts added
- [ ] a dependency install script was approved deliberately in `allowScripts`, if one appeared
- [ ] guide page, `GUIA_DE_USO.md` and `CHANGELOG.md` updated when behaviour changed

<!-- A screenshot or two for anything visual. -->
