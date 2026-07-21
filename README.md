# Yellina Seeds — Website

> **For contributors & AI sessions:** read [PROJECT.md](PROJECT.md) first — it is the
> canonical record of all content decisions, design rules, assets, and integrations.

A light, modern single-page website for **Yellina Seeds Private Limited** — a family-owned
seed production company from Telangana, India (est. 1995). All copy and product data come from
the Company Profile 2026 brochure; all photography and video was shot by the Yellina team in
their own fields and processing unit.

## Tech stack

- **React 19 + Vite** — app framework and build tool
- **Three.js + @react-three/fiber + @react-three/drei** — 3D product viewer (lazy-loaded)
- **Tailwind CSS v4** — styling on a fresh agri palette (off-white, field greens, leaf, harvest amber)
- **Lenis** — smooth scrolling

## Highlights

- **Photo hero** — a real Yellina maize field at tasselling, with slow zoom, pointer parallax,
  and a scrolling film strip of season photos beneath.
- **Browse by crop** — seed-industry-style crop entry cards (Maize / Sweet Corn / Paddy /
  Wheat & Mustard) that jump straight to the right product tab.
- **Our Plant** — a dedicated infrastructure section (modeled on how larger seed companies
  present supply chain) with real dryer photos: the plant exterior, drying deck, numbered
  bins, conveyors, and grading line, plus capacity facts.
- **From Our Fields** — a gallery of real season photos plus two autoplay video loops from the
  processing unit (cobs on the conveyor, hand-husking line).
- **Product experience** — 9 varieties (3 hybrid maize, 2 sweet corn, 5 paddy) in tabbed grids
  with tilt/shine pack cards. Each opens a modal with a **drag-to-rotate 3D model** (maize cob /
  paddy panicle), full agronomic specs, and the truthful label per the Indian Seed Act 1966.
- **Founder's letter** — pointer-tracked 3D-depth portrait, Telugu message, and pull quote.
- **Story** — stats, seed-dot timeline (1995 → 2026), and a partner marquee with real logos
  (Syngenta, Pioneer, Advanta, Kaveri, Nath, Indo-American, Crystal + text chips).
- **Quality promise** — animated purity/germination rings, real grain cross-section photos, and
  a feature card on the company's own 800-tonne drying & processing unit.
- **Plant-a-seed** — a closing interaction in the footer: tap the soil, a seed drops, sprouts,
  and blooms with a burst of sparks.
- **Downloadable brochure** — the original company profile is served from
  `public/brochure/` and linked from the nav, hero, and footer.

## Getting started

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## Project structure

```
public/
  images/            # logo, founder portrait, product pack designs (from brochure)
  images/photos/     # real season photos from the fields & processing unit
  images/partners/   # partner company logos
  videos/            # processing-unit video loops (muted, autoplay)
  brochure/          # downloadable company profile (original HTML)
src/
  data/products.js   # all product specs, timeline, quality, contact data
  three/CobModel.jsx # 3D product viewer (procedural cob / paddy panicle)
  components/        # page sections (Nav, Hero, CropStrip, FounderLetter, Story,
                     #   Fields, Pillars, Quality, Infrastructure, Products,
                     #   ComingSoon, Agronomy, Partner, Footer)
  hooks/useReveal.js # scroll-reveal via IntersectionObserver
```

## Deploying

The site is fully static. Run `npm run build` and host the `dist/` folder anywhere
(Vercel, Netlify, GitHub Pages, or any web server).
