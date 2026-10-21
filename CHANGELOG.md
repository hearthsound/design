# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.4] - 2026-10-21

### Fixed

- A search field no longer shows Chromium's native cancel button beside the approved Clear
  action.

## [0.2.3] - 2026-10-20

### Added

- A destructive menu item (`hs-menu__item--destructive`), in the danger tone with its icon.

### Fixed

- The detail hero's text column is 12 px apart, as l09 draws it.

## [0.2.2] - 2026-10-20

### Added

- `--hs-track-row-inset` names the row's lead inset, and `hs-shelf--flush` a shelf that sits
  on the page margin.

### Fixed

- A card's play disc is pressed instead of the card link that sits above it.
- The shelf header is 44 px (42 px on phones) with `border-box`, so art sits the approved
  distance under its title.
- The phone track list declares three columns, so the row's actions end at its padding.
- The play disc stays above the card link even while the cover is promoted for a press or
  focus.

## [0.2.1] - 2026-10-20

### Fixed

- A shelf's scrollport keeps room for the card's 8 px hover tile, so the tile is never clipped.
- The app shell's main column reserves the scrollbar's gutter, so a page that grows past the
  viewport does not shift sideways.

## [0.2.0] - 2026-10-20

### Added

- `Hearthsound Mask`, a one-glyph web font that draws the password disc, so Chromium and
  Firefox show the same round dots (0.76 em on a 0.88 em advance, Geist's vertical metrics;
  `scripts/mask-font.py` regenerates it).

### Changed

- Masked password fields keep the normal text size and spacing; only the glyph changes.
  The 17 px bullet sizing of 0.1.2-0.1.10 is withdrawn.

## [0.1.10] - 2026-10-20

### Fixed

- A reorder list has no list indent or markers.

## [0.1.9] - 2026-10-20

### Fixed

- The phone sign-in shows the plain frame (no toned brand bar).
- The phone step line's marker is the current-step disc.

## [0.1.8] - 2026-10-20

### Fixed

- Phone setup keeps the plain frame's 24 px top padding; setup step titles stay 23 px on
  phones; the phone sign-in column is centred with the 20vh upward bias.
- `hs-inline-code` padding matches the approved board (1 px 5 px).

## [0.1.7] - 2026-10-20

### Added

- `hs-inline-code`, `hs-group-heading`, `hs-setting-row__subtitle--error`,
  `hs-setting-row__icon--success` / `--error`, `hs-drop-zone--small`, and the permission
  list's insets inside a grey group (first-run setup).

### Fixed

- A checkbox or radio row's native control covers the row, so pointer clicks and test
  drivers reach it.
- `hs-setting-row__subtitle--mono` works outside a reorder list.
- The phone sign-in form starts about 20vh down in the split frame too.

## [0.1.6] - 2026-10-20

### Added

- A lockup can be a link (`a.hs-lockup`): no underline, the shared focus treatment.

## [0.1.5] - 2026-10-20

### Fixed

- The mini player's play disc sits at the right end of the card when the cover and title
  are a button.

## [0.1.4] - 2026-10-20

### Added

- The `adwaita-repeat-song` icon for the player's Repeat Song state.

## [0.1.3] - 2026-10-20

### Changed

- The segmented control has no outer margin by default.
- Nested settings rows line up with their parent instead of indenting 32 px.
- Masked password bullets are 17 px.

### Fixed

- Cards keep the approved 8 px gap between the cover and the text.

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

[Unreleased]: https://github.com/hearthsound/design/compare/v0.2.4...HEAD
[0.2.4]: https://github.com/hearthsound/design/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/hearthsound/design/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/hearthsound/design/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/hearthsound/design/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/hearthsound/design/compare/v0.1.10...v0.2.0
[0.1.10]: https://github.com/hearthsound/design/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/hearthsound/design/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/hearthsound/design/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/hearthsound/design/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/hearthsound/design/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/hearthsound/design/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/hearthsound/design/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/hearthsound/design/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/hearthsound/design/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/hearthsound/design/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/hearthsound/design/releases/tag/v0.1.0
