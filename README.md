# Campus Bangladesh — website

A one-page, interactive site for **Campus Bangladesh**, the UGC-run satellite TV channel.
No frameworks, no build step: open `index.html` in a browser and it runs.

```
index.html      markup + content (all copy lives here)
styles.css      design system (tokens at the top) + layout
script.js       interaction layer (vanilla JS, no dependencies)
assets/
  favicon.svg   the channel mark, used as the browser icon
  qr.svg        real, scannable QR code (currently → https://campusbangladesh.tv)
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
  visitor and follows the OS preference on a first visit.
- **Type.** Space Grotesk for display, Inter for text, Hind Siliguri for Bangla.
- **Motion.** Reveal-on-scroll, animated counters, orbiting satellite, marquees and
  the starfield all switch off automatically under `prefers-reduced-motion`.

### Sections

Hero → stats → 01 About → 02 What we do (the six pillars from the poster) →
03 Programmes (tabbed line-up) → 04 How to watch → 05 Partner network →
06 Get involved → 07 FAQ + contact form → CTA band → footer.

## Interactions

Sticky nav with scroll progress and active-section highlighting · mobile menu ·
theme toggle · cursor spotlight and card glow · animated statistics · keyboard-
accessible programme tabs (arrow keys / Home / End) · FAQ accordion · floating-label
contact form with validation · play button on the live player · back-to-top button.

## Accessibility

Skip link, visible focus rings, ARIA roles on the tab list and accordion, live
region on the form status, alt text on the QR, and full keyboard operation.
Decorative layers (starfield, aurora, orbit) are `aria-hidden`.

## What is placeholder content

Everything below is written to be plausible, not authoritative — replace it as the
real information arrives.

| Where | Placeholder |
| --- | --- |
| Hero / stats | 160+ universities, 45 lakh+ reach, 24/7 |
| Programmes | All 12 shows and their times (labelled "sample schedule") |
| How to watch | Satellite frequency, cable tier, app availability |
| Partners | 12 university names as text badges — no official crests are used |
| Footer | `info@campusbangladesh.tv`, phone number, UGC address |
| `assets/qr.svg` | Encodes `https://campusbangladesh.tv` |

## How to change things

**Colours, spacing, radius, fonts** — the tokens in `:root` and `[data-theme="light"]`
at the top of `styles.css`. Change `--green-bright` / `--red` and the whole site follows.

**The logo.** The mark is an inline SVG (`<symbol id="mark">` at the top of
`index.html`, mirrored in `assets/favicon.svg`) drawn to match the poster. To use the
official artwork instead, drop it in `assets/` and replace the two
`<span class="brand__mark">…</span>` blocks and the one inside `.orbit__core` with
`<img src="assets/logo.svg" alt="Campus Bangladesh">`.

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

**The player** is a styled placeholder. Replace `.player__screen` with the real
`<iframe>` or `<video>` embed when the stream exists.

## Deploying

Static hosting — any of GitHub Pages, Netlify, Vercel, cPanel, or an S3 bucket.
Copy `index.html`, `styles.css`, `script.js` and `assets/` as they are. Two notes:

- Fonts load from Google Fonts; if the site must work fully offline, download the
  three families into `assets/fonts/` and replace the `<link>` in `<head>`.
- Add real Open Graph and Twitter card images before launch (`<meta property="og:image">`)
  so shared links preview well.

Tested in current Chrome/Edge; the layout, both themes and all breakpoints from
390px to 1440px+ were checked.
