# Campus Bangladesh — website

A one-page, interactive site for **Campus Bangladesh**, the UGC-run satellite TV channel.
No frameworks, no build step: open `index.html` in a browser and it runs.

```
index.html      markup + content (all copy lives here)
styles.css      design system (tokens at the top) + layout
script.js       interaction layer (vanilla JS, no dependencies)
assets/
  favicon.svg   the channel mark, used as the browser icon
  logo.png      the official lockup (icon + wordmark), background removed — header, footer, hero
  qr.svg        real, scannable QR code (currently → https://campusbangladesh.tv, unused since
                the How to Watch section was removed — kept for when a player section returns)
```

## Design direction

The poster's language — Bangladesh green and flag red, the antenna/TV mark, the
"Connecting Campuses, Inspiring Futures" line — is carried into a darker, more
cinematic broadcast look: deep green night sky, a live starfield with satellite
signal rings, glass panels and a single green→red gradient used sparingly for
emphasis. It reads as a national TV channel rather than a brochure, while staying
calm and uncluttered.

- **Two themes.** Dark by default, light available from the toggle in the header
  (the light theme is the poster's white/green side). The choice is remembered per
  visitor and follows the OS preference on a first visit. The light theme uses
  banded surfaces (`--bg` / `--bg-2` / `--bg-3`, each a distinct mint-green tint,
  not near-white) plus a darker `--green-deep` accent for body-sized text/icons,
  so it reads as a designed page rather than "mostly white" — `--green-bright`
  stays reserved for filled swatches (buttons, badges) where it has its own
  background to sit on.
- **Type.** Sora for display, Inter for text, Hind Siliguri for Bangla.
- **Motion.** Reveal-on-scroll, animated counters, orbiting satellite, marquees and
  the starfield all switch off automatically under `prefers-reduced-motion`.

### Sections

Hero → stats → 01 About → 02 What we do (the six pillars from the poster, each
filled with its own soft accent colour, not just tinted on hover) → 03 Partner
network → 04 Get involved → 05 FAQ + contact form → CTA band → footer.

The header also carries a "Concept Paper" link (opens the official document in
a new tab) next to the disabled "Watch Live" button — update its `href` in
`index.html` if the document moves.

Programmes and How to watch have been removed for now. Every "Watch Live" /
"Start watching" control (nav, hero, CTA band) and the "Watch" nav item are kept
but rendered as inert "Soon" placeholders (`.is-disabled` / `.nav__soon`) rather
than deleted, so they can be re-enabled once there's a section/player for them
to point to.

## Interactions

Sticky nav with scroll progress and active-section highlighting · mobile menu ·
theme toggle · cursor spotlight and card glow · animated statistics · FAQ
accordion · floating-label contact form with validation · back-to-top button.

## Accessibility

Skip link, visible focus rings, ARIA roles on the accordion, live region on the
form status, and full keyboard operation. Decorative layers (starfield, aurora,
orbit) are `aria-hidden`.

## What is placeholder content

Everything below is written to be plausible, not authoritative — replace it as the
real information arrives.

| Where | Placeholder |
| --- | --- |
| Hero / stats | 160+ universities, 45 lakh+ reach, 24/7 |
| Partners | 12 university names as text badges — no official crests are used |
| Footer | `info@campusbangladesh.tv`, phone number, UGC address |

## How to change things

**Colours, spacing, radius, fonts** — the tokens in `:root` and `[data-theme="light"]`
at the top of `styles.css`. Change `--green-bright` / `--red` and the whole site follows.

**The logo.** The header, footer and hero orbit all use the official lockup at
`assets/logo.png` via `<img class="brand__logo" src="assets/logo.png" alt="Campus Bangladesh">`
(hero orbit: `.orbit__core img`, no class needed). To swap the artwork, replace that
file — same filename, any aspect ratio works since it's sized with `height`/`object-fit`,
not fixed dimensions. `assets/favicon.svg` is separate and unaffected.

**The QR code.** Regenerate for the real URL:

```bash
pip install segno
python -c "import segno; segno.make('https://YOUR-URL', error='m').save('assets/qr.svg', kind='svg', scale=10, border=2, dark='#04140D', light='#FFFFFF')"
```

Then re-add `viewBox="0 0 330 330"` to the `<svg>` tag (segno omits it, and browsers
need it to scale the image down).

**University crests.** When you have permission to use them, swap the `<i>ABBR</i>`
monogram inside each `.uni` for `<img src="assets/unis/du.svg" alt="">`. Keep both
marquee rows the same length as now — each list is duplicated so the scroll loops
seamlessly.

**The contact form** is front-end only: it validates and shows a confirmation, but
sends nothing. Point it at a real endpoint in the `form()` block of `script.js`
(or add `action`/`method` to the `<form>` and delete the `preventDefault`).

**The six commitment cards** (`#focus`) each carry a `data-hue` attribute
(`teal` / `violet` / `amber` / `coral` / `blue` / `rose`) that drives their icon,
background tint and accent line via the `--fc-h` custom property in `styles.css`
section 10. Reassign or add hues there.

**Re-enabling Watch / Programmes.** Both sections were removed along with the
tab and player interactions in `script.js`. Every button that used to point at
`#watch` (nav, hero, CTA band) is kept as a disabled `.btn.is-disabled` with a
`.btn__soon` badge, and the nav's "Watch" item is a disabled `.nav__soon` span —
re-add the section markup, restore `href="#watch"` / turn the `<span>` back into
an `<a>`, and drop the `is-disabled`/`disabled`/`aria-disabled` attributes.

## Deploying

Static hosting — any of GitHub Pages, Netlify, Vercel, cPanel, or an S3 bucket.
Copy `index.html`, `styles.css`, `script.js` and `assets/` as they are. Two notes:

- Fonts load from Google Fonts; if the site must work fully offline, download the
  three families into `assets/fonts/` and replace the `<link>` in `<head>`.
- Add real Open Graph and Twitter card images before launch (`<meta property="og:image">`)
  so shared links preview well.

Tested in current Chrome/Edge; the layout, both themes and all breakpoints from
390px to 1440px+ were checked.
