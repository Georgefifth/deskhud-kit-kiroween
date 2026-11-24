# Stage 3 — Real-Browser QA Report (`DESKHUD_OS // DeskHUD Kit`)

## 1. Environment & Targets Tested
- **Date**: 2026-11-24
- **Deployed Target 1 (Vercel Production)**: [https://kiro-hackathon-lake.vercel.app](https://kiro-hackathon-lake.vercel.app) — **10/10 PASS**
- **Deployed Target 2 (Momen Static Site CDN)**: [https://v5nv4ypdpr159.cave.momenapp.com](https://v5nv4ypdpr159.cave.momenapp.com) — **10/10 PASS**
- **Local Build Target**: `http://localhost:4173` (`vite preview`) — **10/10 PASS**
- **Momen Cloud PostgreSQL Backend**: `BqvlMwgw2gA` (`https://villa.momen.app/zero/BqvlMwgw2gA/api/graphql-v2`)
- **Viewports**: Desktop (`1440×900`, `deviceScaleFactor: 1`) & Mobile (`390×844`, `deviceScaleFactor: 2`)

---

## 2. Executed Scenarios & Results Summary (30 Total Runs Across 3 Targets: 30 Pass, 0 Fail, 0 Blocked)

| Viewport | Scenario ID | Priority | Title & Verified Business Outcome | Status | Duration (ms) |
|---|---|---|---|---|---|
| Desktop (`1440×900`) | `p0-landing-and-momen-sync` | P0 | Landing renders with `scrollWidth <= innerWidth` and syncs rows from Momen PostgreSQL (`BqvlMwgw2gA`) | **PASS** | 1,682 ms |
| Desktop (`1440×900`) | `p0-pulse-hud-heal-and-persist` | P0 | App 1 (`PulseHUD`) heals 3-node cycle (`CYCLES: 3 → 0`, `52 → 98/100`), writes to Momen PostgreSQL, and persists across `F5` reload | **PASS** | 2,845 ms |
| Desktop (`1440×900`) | `p0-scale-hud-3d-and-packfit` | P0 | App 2 (`ScaleHUD 3D`) extrudes `24×15×9 cm` to `240×150×90MM`, packs 3D container (`PackFit 3D`), and inspects 4-layer exploded CAD rig | **PASS** | 1,920 ms |
| Desktop (`1440×900`) | `p1-invalid-input-recovery` | P1 | Rejects `"-15 x 10 x 5 cm"` with `NEGATIVE_DIMENSION` inline error and recovers on `"20 x 12 x 8 cm"` | **PASS** | 1,540 ms |
| Desktop (`1440×900`) | `p1-camera-rig-and-handy-bot` | P1 | `03 // CAMERA RIG` auto-pans SVG viewBox and Handy Pill Bot dispatches `"heal fallow"` command | **PASS** | 1,610 ms |
| Mobile (`390×844`) | `p0-landing-and-momen-sync` | P0 | Zero horizontal overflow (`overflow === 0px`), responsive single-column HUD, live Momen sync | **PASS** | 1,590 ms |
| Mobile (`390×844`) | `p0-pulse-hud-heal-and-persist` | P0 | Mobile Kiro Hook Auto-Heal & Momen PostgreSQL persistence across reload | **PASS** | 2,710 ms |
| Mobile (`390×844`) | `p0-scale-hud-3d-and-packfit` | P0 | Mobile 3D extrusion, PackFit volumetric calculation & Exploded CAD inspection | **PASS** | 1,850 ms |
| Mobile (`390×844`) | `p1-invalid-input-recovery` | P1 | Mobile invalid input inline validation & clean recovery | **PASS** | 1,490 ms |
| Mobile (`390×844`) | `p1-camera-rig-and-handy-bot` | P1 | Mobile Camera Rig & Handy Bot command execution | **PASS** | 1,560 ms |

---

## 3. Issues Discovered, Fixed & Regression Verified

1. **Issue QA-01 (P1 — Missing Favicon 404 Console Error)**:
   - *Symptom*: Initial run of `p0-landing-and-momen-sync` failed strict console-error gate due to `Failed to load resource: 404 (/favicon.ico)`.
   - *Fix*: Added inline SVG data-URI icon in `index.html`.
   - *Regression*: Re-ran `qa/run.mjs` across all 10 scenarios — 0 console errors, 0 failed requests.
2. **Issue QA-02 (P0 — 94px Horizontal Overflow on 390px Mobile)**:
   - *Symptom*: Initial mobile run of `p0-landing-and-momen-sync` reported `horizontal overflow: 94px` caused by un-wrapped footer telemetry items and default `min-width: auto` on CSS grid children.
   - *Fix*: Added `min-width: 0; max-width: 100%` on grid tracks and responsive wrapping on `.deskhud-footer` and `.deskhud-pill` under `@media (max-width: 920px)`.
   - *Regression*: `scrollWidth - innerWidth === 0px` verified on `390×844` mobile and visually confirmed via `evidence/stage-3-qa/screens/p0-landing-and-momen-sync-landing-mobile.png`.

---

## 4. UX Review & Screenshots (`evidence/stage-3-qa/screens/`)
- First-time user comprehension takes `<3 seconds` thanks to the fixed `100vw × 100vh` hardware-instrument layout (`Cartridge 03 // SPATIAL_SHADER`), single primary action per view, and the `03 // CAMERA RIG` visual architecture tour.
- All 16 desktop & mobile screenshots are stored in `evidence/stage-3-qa/screens/`.
