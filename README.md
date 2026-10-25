# @hearthsound/design

The design language of Hearthsound: tokens, fonts, icons and component styles. It ships
plain CSS, so it works in any framework and needs no build step of its own.

## Install

```sh
npm install @hearthsound/design
```

Import the stylesheet once per application:

```js
import '@hearthsound/design/index.css';
```

`index.css` pulls in `css/tokens.css`, `css/base.css` and every component stylesheet, in
that order. Individual files can be imported instead, for example
`@hearthsound/design/css/tokens.css`.

## Schemes: System, Light and Dark

The light scheme is the default. Dark follows the operating system unless the page
chooses otherwise. The choice is a `data-scheme` attribute, which may sit on `<html>` or
on any subtree:

| Attribute | Result |
|---|---|
| none | System: dark under `prefers-color-scheme: dark`, light otherwise |
| `data-scheme="light"` | Light, even on a dark system |
| `data-scheme="dark"` | Dark, even on a light system |

```html
<!-- System -->
<html>
<!-- Force light -->
<html data-scheme="light">
<!-- Force dark -->
<html data-scheme="dark">
```

There is one fixed brand accent; there is no accent attribute.

## Class naming

Components use BEM-like `hs-` classes:

- block: `hs-<component>` (for example `hs-button`, `hs-dialog`);
- element: `hs-<component>__<part>` (for example `hs-dialog__title`);
- modifier: `hs-<component>--<modifier>` (for example `hs-button--suggested`);
- utilities: the type scale (`hs-display`, `hs-title-1` to `hs-title-4`, `hs-heading`,
  `hs-body`, `hs-caption`), `hs-link`, `hs-visually-hidden` and `hs-icon`.

Card modifiers `hs-card--album` and `hs-card--playlist` mark the kind of card and carry no
rules of their own; `hs-card--artist` is the only card that changes layout.

State is expressed with real pseudo-classes and ARIA attributes, never helper classes:
`:hover`, `:focus-visible`, `:disabled`, `[aria-disabled="true"]`, `[aria-pressed="true"]`,
`[aria-selected="true"]`, `[aria-current]`, `[aria-busy="true"]`, `[aria-invalid="true"]`
and `[aria-expanded="true"]`. Focus is the approved tint-and-lift treatment shown on
`:focus-visible` only.

Style with the shipped tokens, not raw values:

```css
.my-shell {
  background: var(--hs-view-bg);
  color: var(--hs-fg);
  padding: var(--hs-space-5);
  border-radius: var(--hs-radius-card);
}
```

Tokens cover colour, type, spacing, density, radii, elevation, focus, motion and artwork.
`css/tokens.css` is the complete list; the light values are the `:root` base and dark
values apply through the media query and the `data-scheme` attribute.

## Fonts

Three OFL faces ship in `fonts/` and are declared in `css/base.css`:
`Geist` (body, `--hs-font-body`), `Bricolage Grotesque` (display, `--hs-font-display`) and
`Geist Mono` (machine text, `--hs-font-mono`, ligatures off). The font files are loaded
relative to the stylesheet, so no path configuration is needed.

## Icons

The approved icon set ships as individual SVGs in `icons/` and as a generated sprite in
`dist/icons.svg`. Each source name in the manifest maps to a file name and symbol id by
replacing `/` with `-`:

- manifest `adwaita/play` -> `icons/adwaita-play.svg` -> symbol `#adwaita-play`;
- manifest `custom/upload` -> `icons/custom-upload.svg` -> symbol `#custom-upload`.

Use the sprite with the `hs-icon` base class:

```js
import sprite from '@hearthsound/design/icons.svg?url';
import { iconNames } from '@hearthsound/design/icons'; // string[]
```

```html
<svg class="hs-icon" aria-hidden="true">
  <use href="/path/to/icons.svg#adwaita-play"></use>
</svg>
```

`hs-icon` is 16 px by default and inherits `currentColor`; set `--hs-icon-size` to resize
it. `@hearthsound/design/icons` exports `iconNames` and, in TypeScript, the `IconName`
union type. Give a labelled icon `role="img"` and an accessible name; otherwise mark it
`aria-hidden="true"`.

## Identity

The approved identity files ship unchanged:

- `identity/mark/mark-light.svg`, `mark-dark.svg`: the full-colour mark for each scheme.
- `identity/mark/mark-symbolic.svg`: the one-colour mark in `currentColor`.
- `identity/icons/app-icon-light.svg`, `app-icon-dark.svg`: 128 px masters.
- `identity/icons/app-icon-{light,dark}-{16,32,180,192,512}.png`: exported sizes.
- `identity/icons/favicon.svg`: one file that switches with `prefers-color-scheme`.

Use the full-colour mark only on its own scheme, keep a quarter of the mark's height as
clear space, and never rebuild a one-colour mark from the full-colour file: use
`mark-symbolic.svg`. Licence details are in `THIRD-PARTY.md`.

## Development

```sh
npm run build      # writes dist/icons.svg, dist/icons.js and dist/icons.d.ts
npm run check      # build, then verify tokens, imports, ASCII, fonts and icon refs
npm run specimen   # build, then write the unpublished specimen/index.html
```

`specimen/index.html` shows every component in every state, light and dark side by side.
It is a development reference and is not published.
