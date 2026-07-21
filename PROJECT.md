# Yellina Seeds Website — Project Bible

> **Read this first.** This file is the canonical, self-contained record of the project:
> every owner decision, content rule, design-system choice, asset, integration, and open item.
> A fresh Claude session should be able to work from this file alone.
> Last updated: **21 July 2026**.

---

## 1. What this is

A single-page marketing website for **Yellina Seeds Private Limited** — a family seed company
from Sathupally, Khammam District, Telangana, producing hybrid seed since 1995 and selling
under its own brand since 2022. Stack: **React 19 + Vite, Tailwind CSS v4, Lenis smooth-scroll,
Three.js/@react-three/fiber (lazy-loaded, product-modal 3D only)**. Runs at `localhost:5173`
via `.claude/launch.json` (server name `yellina-website`). `npm run build` must pass after every
change. Not yet deployed; no git repo initialized.

The owner/user is **Abhinav Sanjay Yellina** (family member, Operations/Technology,
yellinaasanju@gmail.com locally; company email yellinaseeds@gmail.com).

---

## 2. Content sources & precedence (IMPORTANT)

1. **`/Users/sanjuyellina/Documents/YELLINA'S/PPT CONTENT.txt`** — the manager-approved
   Company Profile 2026 copy. **Site copy comes ONLY from this file** (plus owner decisions
   in the log below). Do not reintroduce old-brochure agronomic specs (plant heights, seed
   rates, grain traits, fertilizer tables) or invent marketing copy.
2. **Owner decisions in chat** override the file (see Decision Log).
3. The **Dealers Meet PPT 2026 v3 deck** (`Documents/YELLINA'S/flexi/*.mhtml`) is the visual
   reference for the hero design and confirms product lineup, but where its facts conflict
   with owner answers, owner answers win.
4. The original brochure (`~/Downloads/yellina_seeds_brochure_v4.html`, copy served at
   `public/brochure/yellina-seeds-company-profile-2026.html` as the downloadable) is now
   **imagery/statutory-label source only**, not copy.

Truthful-label numbers (allowed, statutory, match their pack artwork):
maize 98/90/95 purity-germination-genetic, moisture 12% · sweet corn same with moisture 8%
· paddy 98/80/95, moisture 13%.

---

## 3. Decision log (owner = final)

| Date | Decision |
|---|---|
| Jul 1 | Rejected dark green/gold "brochure" theme as AI-looking → light modern agri palette, real photos only. |
| Jul 1 | Photos provided in `~/Downloads/website pics/` (16 + 2 videos); later 9 dryer photos added there. Some originals have an OPPO watermark bottom-left → must crop it off. |
| Jul 1 | Partner logos exist in `~/Downloads/logo-*.png` (7 files) → used in partner marquee. |
| Jul 7 | "Magical" atmosphere requested: levitation, parallax depth, god-rays, fireflies — keep GPU-cheap, transform-only. |
| Jul 7 | Stylized SVG floating objects rejected ("comic") → then real-photo cutout objects also rejected → **floating decor objects removed entirely**. Levitating photo frames, pollen, bokeh, fireflies stayed. |
| Jul 7 | "AI feel" purge: NO italic-green accent word in headings (one plain color accent in hero max), NO "Chapter N" labels, NO word-by-word text reveals, NO clever slogan microcopy. Copy must sound like the family wrote it. |
| Jul 21 | All copy replaced with the manager-approved PPT CONTENT file. Old specs removed from product modals. |
| Jul 21 | Hero rebuilt to deck reference: field photo masked INSIDE the leaf logo, gold offset silhouette, 3 certification seals, arch photo chips row. Logo then doubled (up to 860px) with a new high-res mask. |
| Jul 21 | **Owner answers:** (1) **Padma 25 IS included** (sweet corn, 80–85 days). (2) The research paddy is **"Singara 999"** (not 1509 as the txt file says). (3) Drying capacity is **2,000 MT TOTAL across the two facilities** (800-tonne in 2010 + second in 2020). ⚠️ Note: deck v3 says "a 2,000 MT unit followed in 2020" — owner's "total 2000MT" answer was taken as authoritative; if marketing wants the deck reading, only `TIMELINE`/`STATS`/Infrastructure `FACTS` need editing. (4) Corporate address short form "Kompally, Hyderabad, Telangana" approved (full address + PIN still pending from owner). |
| Jul 21 | Portfolio section lists ALL crops from the txt file; everything except Maize, Sweet Corn, Paddy is **Coming Soon**. Coming-soon crops use custom line icons until real photos exist. |
| Jul 21 (later) | **Portfolio moved to the TOP** (directly after Hero; CropStrip removed as redundant) and redesigned as an "orchard" of gold-bordered ARCH windows: 4 tall photo arches (Available, staggered heights, click→product tab) + "Growing Next" row of 10 small icon arches. Photos for available crops came from the dealers-meet deck (field-maize-rows, paddy-panicle, sweetcorn-cobs). |
| Jul 21 (later) | **Hero logo v3**: gold offset silhouette REMOVED (owner: "only one logo"), arch chips row removed, logo enlarged to `min(56vw, 1000px)` with interior switched to dense `field-canopy-green` (no sky in leaves). Highlight effects: `.logo-halo` radial glow, static + slowly-rotating dashed gold orbit ring with gold diamond marker (`spin-slow`), `logo-sheen` light sweep inside the mask, drop-shadow, ground shadow ellipse, and the "Yellina Seeds / Rooted in Nature" wordmark beneath — emblem treatment. |

| Jul 21 (v2) | Hero copy fade slowed (owner: "fading away faster than before") — now starts after 20% viewport scroll and completes at ~95%, gentler lift, no scale. |
| Jul 21 (v2) | **Portfolio reimagined again from scratch** (owner asked; arch-orchard replaced): now an interactive split showcase — big "living window" feature panel left (Ken Burns photo, fade-swap on change; Coming Soon crops show a dark-green panel with big icon + gold chip + 2027 note) and a full crop index right (4 Available rows with thumbnails — hover/first-click selects, click-when-active navigates to product tab; 10 Coming Soon pill chips in two "Growing Next" groups). State lives in `Portfolio.jsx` (`selected`); animations `fade-swap` + `kenburns` in index.css. |

| Jul 21 (v3) | **Portfolio v4 — "two rivers"** (owner: show ALL products, no selecting): Field Crops marquee flows LEFT→RIGHT (`marquee-reverse`), Vegetable Seeds flows RIGHT→LEFT. Photo tiles (Available, click→tab) + white icon tiles (Coming Soon) in the same streams; pause on hover; gold hairline group labels. |
| Jul 21 (v3) | **Hero v5 — centered monument** (owner: keep logo, page must feel "big, premium, trust"): emblem centered like a crest (halo, rotating orbit, sheen, ground shadow) → wordmark lockup → headline as supporting thesis → intro → CTAs → 3 seals → **TRUST BAR**: gold hairline + "Trusted production partner to India's leading seed companies" + 7 real partner logos (grayscale, color on hover) + 31+/15+/2,000MT stats. Hero copy fade now tracks the content's actual viewport position (rect-based), not raw scrollY. Guided by the official `frontend-design` skill ("hero is a thesis; spend boldness in one place"). |
| Jul 21 (v3) | Skills audit: only ui-ux-pro-max was actually installed; added **banner-design, brand, design, design-system, ui-styling** to `~/.claude/skills/` (from the ui-ux-pro-max repo); the official `frontend-design` skill lives in the plugins marketplace cache and its guidance is baked into the hero. |

| Jul 21 (v4) | **"Sathupally" removed sitewide** (owner) — replaced with "Khammam District, Telangana" / neutral phrasing in hero chip, founder letter, timeline 1995, footer baseline, portfolio note. Do not reintroduce. |
| Jul 21 (v4) | Hero uses BOTH sides now: left rail = 31+/15+/2,000 MT stats (gold-edged), right rail = the 3 seals stacked (seals show under CTAs only below lg); trust bar keeps label + logos only. Logo interior image switched to `field-maize-rows.jpg`. |
| Jul 21 (v4) | **Scroll-length reduction pass**: global section paddings tightened (py-24/32 → py-16/22 family), hero rhythm compressed, and **Fields reimagined as a compact horizontal snap rail** (10 tiles, arrow buttons, hidden scrollbar, ~1/3 former height) and **moved to after Quality** (order: … Pillars → Quality → Fields → Infrastructure …). Total page height cut ~16%. |

| Jul 21 (v5) | **Real photos for every portfolio crop** (owner, ref: eastwestseed.com uses vivid crop close-ups). The 10 coming-soon crops now use openly-licensed CC photos in `public/images/photos/crops/` (see `CREDITS.txt` — Openverse/Wikimedia; sorghum & beans re-fetched commercial-safe). CropIcons.jsx no longer used by Portfolio (kept in repo). Portfolio is now all photo tiles in the two rivers; **replace these stock CC photos with Yellina's own crop photos when available.** |
| Jul 21 (v5) | Fields rail changed from arrow-scroll to an **always-moving marquee** (`marquee-slow`, pauses on hover). "9" → "9+" varieties (Story CountUp keeps the "+" suffix); "2,000 MT" → "2,000+ MT" in hero rail, Infrastructure facts, Story stat label, timeline note. **Footer/contact compressed** (~1/3 less height: smaller closing block, plant-a-seed scaled 90%, tighter gaps). Full page now ~14,000px (was ~16,900px). |

**Still open for the owner:** full corporate address + PIN; approved one-line description for
Padma 25 (currently shown without prose claim); real photos for the 10 coming-soon crops;
whether the removed Telugu founder-note should return (it was cut because it isn't in the
approved file).

---

## 4. Content map (what lives where on the page)

Section order in `src/App.jsx`:
`Nav → Hero → Portfolio → FounderLetter → Story → Fields → PhotoBand(promise) → Pillars →
Quality → Infrastructure → Products → PhotoBand(trust) → Agronomy →
PhotoBand(agronomy) → Partner → Footer`  (CropStrip removed Jul 21; Portfolio keeps id `coming`)

| Section (id) | File | Approved content it carries |
|---|---|---|
| Hero (`home`) | `Hero.jsx` | Headline "Seed you can trust. Harvests you can count on."; crops line; intro para (file line 11, lightly cleaned); Since 1995 · Sathupally chip; 3 seals (100% Genuine / Quality Tested / Truthfully Labelled); ONE big logo-mask emblem (halo, orbit rings, sheen, wordmark). |
| Portfolio (`coming`) | `Portfolio.jsx` + `CropIcons.jsx` | Top-of-page arch orchard: 4 Available photo arches (→ product tabs) + 10 Coming Soon icon arches; "New improved varieties arriving in 2027" chip. |
| Founder letter | `FounderLetter.jsx` | Full "Built on Trust. Driven by Experience." letter, verbatim; signed Mr. Murali Krishna, Hyderabad; Our Promise card. |
| Story (`story`) | `Story.jsx` | "31 years of excellence in the seed supply chain."; Our Strength stats (31+ / 15+ / 2 facilities · 2,000 MT / 9 varieties, count-up animation); milestones 1995→2001→2010→2020→2022; partner marquee (6 real logos + "Shriram Bioseed" + "+ several others" text chips; label 15+ partners). |
| Fields (`fields`) | `Fields.jsx` | Photo/video gallery "This season, in pictures." (10 tiles incl. 2 autoplay videos). Captions are UI text, not claims. |
| Photo bands | `PhotoBand.jsx` (3 uses in App) | Quotes from file: "If the seed is right…", "Trust is earned in the field — not in advertisements.", "Helping farmers achieve higher productivity from sowing to harvest." |
| Why (`why`) | `Pillars.jsx` | 3 pillars: Built on Indian Agriculture / Complete Quality Control / (agronomy paragraph, headed "With You Through the Season" — heading was derived, body verbatim). Photo headers per card. |
| Quality (`quality`) | `Quality.jsx` | "Quality without compromise."; GOT/germination testing paragraph (grammar-cleaned, meaning kept); "Every seed is" 6-bullet list verbatim; Seeds Act 1966 sentence verbatim; purity rings (statutory numbers); grain cross-section photos. |
| Plant (`plant`) | `Infrastructure.jsx` | Dryer photo showcase; facts: 2,000 MT total / 2 units / 100% own / every lot tested. Address strip on photo: Banda Mallaram, Siddipet. |
| Products (`products`) | `Products.jsx` + `data/products.js` | "Nine varieties under our own name." 3 tabs. Cards+modal show ONLY: name, type, code (maize only), duration/season line, file description (maize+Sweet 16), truthful label, pack image, 3D model. Modal has prev/next arrows + ←/→ keys. |
| Portfolio (`coming`) | `Portfolio.jsx` + `CropIcons.jsx` | All 14 crops from file in two groups; 4 Available (photo tiles, click → products tab), 10 Coming Soon (line icons + gold chip); "New improved varieties arriving in 2027." |
| Agronomy (`agronomy`) | `Agronomy.jsx` | 5 support areas verbatim + seasonal crop calendar visual + closing line. NO detailed agronomy numbers (removed). |
| Dealers (`partner`) | `Partner.jsx` | "Grow your business with Yellina." + 5 benefits verbatim + contacts: Murali Krishna Yellina +91 99494 84078, Abhinav Sanjay Yellina +91 83414 64748, email. |
| Footer (`contact`) | `Footer.jsx` | Addresses (short forms), Direct numbers ×2, Customer Care +91 85230 06206, email, brochure download, quick links, badges (Since 1995 / Made in India / Yellina Family), plant-a-seed interaction. |

### Product catalog (9)

| id | Name | Type | Tab | Spec shown | Pack image |
|---|---|---|---|---|---|
| sandhya-8028 | Sandhya 8028 | Hybrid Maize HY-001 | maize | 110–115 Days · Kharif & Rabi + desc | pack-sandhya-8028.jpg |
| ram-0304 | Ram 0304 | Hybrid Maize HY-002 | maize | 105–110 Days · Early Maturity + desc | pack-ram-0304.jpg |
| virat-8115 | Virat 8115 | Hybrid Maize HY-003 | maize | 115–120 Days · Long-Duration + desc | pack-virat-8115.jpg |
| sweet-16 | Sweet 16 | Sweet Corn | sweetcorn | 75–80 Days + desc | pack-sweet-16.jpg |
| padma-25 | Padma 25 | Sweet Corn | sweetcorn | 80–85 Days (no prose yet) | pack-padma-25.jpg |
| mr-10 | MR 10 | Hybrid Paddy | paddy | label only | pack-mr-10.jpg |
| neelavathi | Neelavathi | Hybrid Paddy | paddy | label only | pack-neelavathi.jpg |
| kanika-1692 | Kanika 1692 | Research Paddy | paddy | label only | pack-kanika.jpg |
| singara-999 | Singara 999 | Research Paddy | paddy | label only | pack-singara-999-improved.jpg |

---

## 5. Design system

**Palette** (Tailwind v4 `@theme` in `src/index.css`): bg `#FAFAF6`, sage `#F0F4E7`,
card white, line `#E3E8DA`; greens 950 `#142F1B` → 700 `#2C7A3C` → leaf `#7DB343`;
harvest amber `#E39A2E` / amber-deep `#B87716`; **deck gold `#C9A227`** (+ gold-soft `#E7D188`)
for seals, outline, coming-soon chips, hero arcs/diamonds; ink `#1F2A21` / soft / mute.
**Never** dark-theme ornamental styling or AI-purple gradients.

**Type**: Fraunces (serif, light, headings/serif accents) + Outfit (sans UI labels) +
Noto Sans (body). Headings are plain — at most ONE non-italic color accent in the hero.
Eyebrow style: 11px, 0.3em tracking, uppercase, with 34px leaf-green rule.

**Signature motifs**
- `corner-leaf` class: cards get one oversized top-left radius (3rem vs 18px) — used on all
  card grids (crop strip, pillars, portfolio tiles, products, agronomy).
- `SectionCurve.jsx`: organic hill-line boundary painted in the PREVIOUS section's color at a
  section's top. Used at Story, Pillars, Infrastructure, Footer.
- **Logo-mask hero**: `public/images/logo-mask.png` (1824×1484, generated 4× upscale of
  logo-white.png alpha with smoothed edge — regenerate with PIL if logo changes) used as CSS
  mask; field photo inside + gold silhouette offset (22px/24px) behind; width
  `min(50vw, 860px)`, bleeds right. Deck-style gold arcs + rotated gold squares behind.
- **Seals**: 3 dark-green circles, gold border + inner dashed gold outline (deck badges).
- **Arch chips**: `rounded-t-full rounded-b-xl` photo row under hero, alternating heights,
  odd ones gold-bordered.

**Motion system** (all transform-only, `prefers-reduced-motion` respected)
- `.reveal` → `.is-visible`: rise 56px + scale .975 + blur(8px)→0, 1.1s. Applied by
  `useReveal()` hook which observes descendants AND re-scans via MutationObserver (critical:
  without it, tab-switched content stays invisible — this was a real bug).
- `float-idle` keyframes with `--famp/--frot/--fsway/--tilt` vars: levitating photo frames,
  arch chips, hero logo block.
- Global scroll-depth: any `[data-parallax="±speed"]` element is translated by the loop in
  `App.jsx` (speeds ~0.12–0.5; photo frames ±0.13–0.16; PhotoBand image −0.16; infra photo −0.14).
- Atmosphere: pollen motes (`.pollen`), god-rays (unused since hero redesign; class remains),
  cursor `sun-glow` (hero), sunlit `.bokeh` (photo bands), `.firefly` ×14 (footer),
  count-up numbers (Story), marquee partner strip, pack-shine sweep + `tilt-card` on product
  cards, scrollspy underline in nav, plant-a-seed SVG interaction in footer
  (kernel → soil → water → roots → blades → sway).
- `Backdrop.jsx`: soft-focus section backgrounds — photo at 0.15–0.17 opacity with
  `blur(6px) saturate(0.9) scale(1.06)` + top/bottom fade into section color.

**Photo treatment**: frameless (`.photo-frame` = rounded 16px + layered shadow, NO white mat),
captions overlay on-photo with dark-green gradient. Real photos only; never stock.

---

## 6. Asset inventory (`public/`)

- `images/logo-green.png`, `logo-white.png` (456×371 source), **`logo-mask.png`** (hi-res mask).
- `images/founder.jpg` (Murali Krishna portrait, office).
- `images/pack-*.jpg` — 10 pack designs from the brochure (incl. padma-25 and the two singara
  packs; `pack-singara-999-hybrid.jpg` is currently unused).
- `images/photos/` — 28 real photos, semantic names. From the dealers deck (Jul 21): field-maize-rows (hi-res), paddy-panicle, sweetcorn-cobs, farmers-cobs (used in Trust photo band), team-young-maize, cobs-hands-line. Field: field-tassels-tree (hero mask
  photo), field-maize-wide (2000×780), field-canopy-green, detasseling-crew, cob-on-plant,
  cob-drying-stalk, cobs-in-hands, harvest-mesh-bag, grain-cross-{hand,closeup,three},
  paddy-{inspection,grain-check}. Plant: plant-sorting-lines, processing-unit-wide,
  cobs-conveyor, dryer-{exterior,deck,conveyors,grader,bins-row,bins-closeup}.
  Source originals: `~/Downloads/website pics/` (OPPO watermark on some — crop bottom).
- `images/partners/logo-{syngenta,pioneer,advanta,kaveri,nath,crystal,kanchan,indoam}.png`
  (kanchan added from the deck and IS in the marquee; indoam unused — not in approved list).
- `videos/conveyor-loop.mp4` (0.66MB), `husking-line.mp4` (3.2MB, trimmed 16s) — muted loops.
- `brochure/yellina-seeds-company-profile-2026.html` — downloadable original brochure.

---

## 7. Tooling & integrations

- **Dev server**: Browser-pane `preview_start {name:"yellina-website"}` (port 5173).
- **21st.dev MCP** (`21st`): registered for BOTH `/Users/sanjuyellina` and this project in
  `~/.claude.json` (HTTP, `x-api-key` header). Free tier: unlimited `search`, **2
  `get_component` code retrievals/day**. If tools aren't loaded in-session, call directly:
  `curl -X POST https://21st.dev/api/mcp -H "x-api-key: $KEY" -H "Content-Type: application/json"
  -H "Accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
  "params":{"name":"search","arguments":{"query":"..."}}}'` (key lives in `~/.claude.json`).
- **ui-ux-pro-max skill**: installed at `~/.claude/skills/ui-ux-pro-max`. Query:
  `cd ~/.claude/skills/ui-ux-pro-max && python3 scripts/search.py "<query>" --design-system`
  (or `--domain ux|color|typography|landing`). Its verdict for this site: **Organic
  Biophilic** — flowing curves, earth green + harvest gold, no AI-purple; checklist drove the
  focus-visible rings, curves, corner-leaf.
- **Supabase** (claude.ai connector): org "SSS DRYER", project **YellinaSeeds**
  (`gnujlntvcdwtwdnsgobj`, also hosts their dryer-ops tables — don't touch those).
  Table **`public.website_enquiries`** exists (RLS: anon INSERT-only). URL
  `https://gnujlntvcdwtwdnsgobj.supabase.co`, publishable key
  `sb_publishable_w2ZM4DlDpDc4G5kRtDLLdw_e17OdLgc` (client-safe).
- **Parked backend (owner said "design first, functions later")**: `src/lib/supabase.js`,
  `src/components/Enquiry.jsx` (full call-back form w/ honeypot),
  `src/components/WhatsAppButton.jsx` — written but **NOT imported in App.jsx**. Wiring them +
  a `wa.me/918341464748` float is the first "functions" task.
- **Vercel** (claude.ai connector): connected, unused. Deploy = `deploy_to_vercel` from
  project dir (static Vite; no config needed). Also has `check_domain_availability_and_price`.
- **Python for images**: use `/opt/homebrew/bin/python3.11` (has Pillow arm64); plain
  `python3` is x86 and Pillow import fails. `sips` for crops/resize, `ffmpeg` available.

---

## 8. Environment quirks (save yourself an hour)

- Screenshots can lag the compositor even when visible — a `window.scrollBy(0, 1)` nudge before capturing forces a repaint and fixes blank shots.
- **Browser-pane screenshots freeze when the user's panel is hidden** (`document.visibilityState
  === 'hidden'`): rAF pauses, captures go stale/blank. Verify via DOM/a11y instead; also
  Lenis-based nav falls back to instant scroll when hidden (already handled in `App.jsx`).
- The pane's **console buffer persists old errors** across reloads — check
  `vite-error-overlay` absence + section render instead of trusting old entries.
- Screenshot viewport often resets to the user's panel size; `resize_window` before capture.
- React `.click()` via JS evaluates state synchronously — re-read state in a SECOND eval.
- `npm run build` after every change set; Three.js lives only in the lazy CobModel chunk
  (~234KB gz) — keep it lazy; main bundle ~90KB gz.

---

## 9. Roadmap / next steps

1. **Wire functions**: Enquiry form + WhatsApp button into App; test insert into
   `website_enquiries`; then `deploy_to_vercel`; check `yellinaseeds.com` availability
   (a claude.ai "YELLINA SEEDS" connector already points at https://www.yellinaseeds.com —
   domain may already be theirs; verify before buying anything).
2. Get from owner: full corporate address + PIN; Padma 25 one-liner; coming-soon crop photos;
   Telugu note decision; resolve 2,000-MT total vs deck's "2,000 MT unit" wording.
3. Performance pass for rural 4G: srcset/WebP for `photos/*` (many 300KB–1.2MB), poster-only
   videos on save-data, width/height attrs.
4. SEO: per-variety URLs/anchors + structured data once deployed; domain email.
5. Possible Hindi/Telugu language toggle (biggest authenticity win per earlier critique).
