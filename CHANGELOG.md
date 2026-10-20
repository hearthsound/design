# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/hearthsound/design/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/hearthsound/design/releases/tag/v0.1.0
