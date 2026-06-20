# Juhsone

A premium one-page website for **Juhsone** — a small atelier of handcrafted wooden
objects (candle stands, vessels, tables and small pieces) in ash & walnut.

Built as a fast, dependency-free static site: just HTML, CSS and a little JavaScript.

---

## View it

**Easiest:** double-click `index.html` to open it in your browser.

**Recommended (so images & fonts load cleanly):** run a tiny local server from this
folder:

```bash
# Python 3 (already on your Mac)
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Files

```
index.html      → all the content & sections
styles.css      → the look (colours, fonts, layout, animations)
script.js       → menu, scroll reveals, parallax, the enquiry form
favicon.svg     → little "J" tab icon
assets/         → all photography (swap these for your own pieces)
```

---

## Make it yours

### 1. Use your own product photos
The pictures in `assets/` are tasteful **placeholders** so you can see the design.
Replace them with photos of *your* pieces — keep the same filenames and they'll drop
straight in:

| File | Where it shows | Good photo to use |
|------|----------------|-------------------|
| `hero.jpg` | full-screen top banner | a moody workbench / signature shot |
| `product-candle.jpg` | "Lumen" candle stand | your candle stand |
| `product-table.jpg` | "Solace" coffee table | your coffee table |
| `product-bowl-pale.jpg` | "Cupped" catch-all | a shallow dish |
| `product-bowl-dark.jpg` | "Eclipse" lidded vessel | a dark vessel |
| `product-vase.jpg` | "Monolith" bud vase | a vase |
| `product-decor.jpg` | "Strata" coasters | coasters / small object |
| `candlelight.jpg` | featured piece banner | best hero product shot |
| `maker.jpg` | "Atelier" portrait | you, at work |

Tip: square-ish or upright photos work best for the grid. Aim for ~1500px wide.

### 2. Change names, prices & words
Open `index.html` and edit the text directly — product names, the `Rs 8,000`
prices, the story in the "Atelier" section, etc. It reads like plain English.

### 3. Your contact details
Search `index.html` for `hello@juhsone.com` and the `#` links under "Instagram /
WhatsApp" in the footer, and replace them with your real email / social links.

### 4. Colours & fonts
All colours live at the top of `styles.css` under `:root` (e.g. `--brass`, `--walnut`).
Fonts are **Cormorant Garamond** (elegant serif), **Jost** (clean text) and
**Tangerine** (the wavy script used for "Juhsone"). Swap the Google Fonts link in
`index.html` to try others.

---

## Put it online (free)

Any of these will host this folder for free:

- **Netlify** — drag this whole folder onto <https://app.netlify.com/drop>
- **Vercel** — `vercel` in this folder, or import from GitHub
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch
- **Cloudflare Pages** — connect a repo, no build step needed

When you buy the domain `juhsone.com`, point it at whichever host you pick.

---

## A note on the placeholder photos
The starter images are free-to-use photography from Pexels (Pexels License) and are
only there to dress the layout. Replace them with your own work before going live so
the site shows what *you* actually make.
