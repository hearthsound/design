# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-10-20

### Added

- `hs-segmented__thumb`: the segmented control's selection slides between segments.

### Fixed

- Mosaic tiles are spliced edge to edge; only the whole mosaic is rounded.
- A disabled settings row dims its contents, so its separator keeps the shared colour.
- `hs-settings-group` on a list element has no indent or markers.
- Masked passwords show larger bullets.

## [0.1.1] - 2026-10-20

### Fixed

- The k05 drop-down list classes `hs-listbox`, `hs-option`, `hs-option--selected` and
  `hs-option--active`, which the spec names but 0.1.0 did not style.
- An invalid drop-down (`hs-select` with `aria-invalid="true"`) shows the invalid tint like
  a text field.

## [0.1.0] - 2026-10-20

### Added

- Every design token from the frozen foundations, with light and dark values and the
  System / Light / Dark `data-scheme` choice.
- Base stylesheet: the Geist, Bricolage Grotesque and Geist Mono faces, the type scale,
  links, the focus treatment, `hs-visually-hidden`, the `hs-icon` base class and reduced
  motion.
- Component stylesheets for the approved components, built only from `--hs-*` tokens and
  `hs-` classes.
- The approved Adwaita and custom icons, an SVG sprite built from them, and the
  `iconNames` / `IconName` exports.
- The approved mark, lockup assets, app icons and scheme-switching favicon.
- Font and icon attributions in `THIRD-PARTY.md`.
- `npm run check` (build plus verification) and the unpublished `specimen/` visual
  reference built by `npm run specimen`.
- CI that runs the checks and a dry-run pack, and a tag-triggered release that publishes
  to npm through Trusted Publishing and creates the GitHub release.

[Unreleased]: https://github.com/hearthsound/design/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/hearthsound/design/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/hearthsound/design/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/hearthsound/design/releases/tag/v0.1.0
