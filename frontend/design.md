# Glamour Hair Studios — design system

Locked by the Hallmark redesign (v2.0.0). Every page shares this; change it
here first, then in `app/tokens.css`.

## Feeling

A neighbourhood salon that happens to sell online: warm, personal, unhurried.
Linen paper, one teal, a calligraphic serif for headings. Structure and rhythm
take their cue from nishhair.com (product-led rails, a service story, FAQ, a
journal); the palette and faces are our own.

## Tokens (`app/tokens.css`)

- **Paper** `--color-paper` warm linen (n-50); `--color-paper-2`, `-3` for bands.
- **Surface** `--color-surface` (n-0) for cards and inputs.
- **Ink** `--color-ink` (n-900), `--color-ink-2` (n-700), `--color-muted` (n-500).
- **Accent** `--color-accent` teal brand-700; `--color-accent-ink` on it.
- **Deep** `--color-deep` brand-950: the footer and the figures band.
- **Sale** `--color-sale` coral-600, only for price cuts.
- **Field** `--color-field` for input edges (3:1 on paper).
- Tailwind maps every colour family onto these channels: `gray/slate/zinc/stone`
  are the warm neutrals, `purple/blue/cyan/teal/emerald` are the brand ramp.
  Never write a literal colour in a component.

## Type

- Display: **Alegreya** 600 (`font-display`), tracking -0.015em, balanced.
- Body and every label: **Figtree** (`font-sans`, `font-ui`), 16px minimum.
- No tracked capitals, no eyebrows, no uppercase labels. Badges, nav, table
  heads and tags are sentence case, a step smaller.

## Shape and motion

- Radius: cards 6px, inputs 8px, buttons are pills. One radius per level.
- Shadows: `--shadow-card` only, on hover or floating menus.
- Motion: `transform` and `opacity` only, `--dur-short` with `--ease-out`.
  Every animation has a reduced-motion fallback (global clamp in `base.css`).
- Container: `.container-custom`, capped at 1440px with the token gutter.

## Components (`app/globals.css`)

- `.btn-primary` is the one primary action: teal pill, white text, 48px tall.
- `.btn-secondary` ink outline; `.btn-dark` ink fill; `.btn-ghost` quiet.
- `.link-quiet` for a secondary action set as an underlined link.
- `.input-field` for every text input; `.card`, `.card-panel`, `.badge-*`.
- `<Logo tone="dark|light" />` from `components/brand/Logo.tsx`.

## Content rules

- Never invent a number, a review or a logo. Placeholder photography lives in
  `[data-slot]` frames the salon's own photos replace.
- Icons are lucide-react, never emoji.
- Links never carry a glued arrow; an icon sits beside the label with a gap.
