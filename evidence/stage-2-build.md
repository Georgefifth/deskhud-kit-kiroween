# Stage 2 — Competitive Analysis, UX Contract & App Build (`DESKHUD_OS // DeskHUD Kit`)

## 1. Competitive Analysis (Phase 1)

| Product | Category | Strengths ([Fact]) | Weaknesses / Gaps ([Fact]) | How `DESKHUD_OS` Outperforms |
|---|---|---|---|---|
| **`cjpais/Handy`** ([github.com/cjpais/Handy](https://github.com/cjpais/Handy), 39.9k★) | Cross-platform Rust/Tauri v2 STT HUD | Fast local Whisper/Parakeet transcription, zero-bloat floating pill overlay (`Alt+Space`), native Win/Mac/Linux tray integration. | Single-purpose speech-to-text utility; not a multi-app extensible skeleton with static analysis or 3D spatial viewports. | Expands the `Handy` pill paradigm into a **general-purpose Kiro Skeleton (`packages/deskhud-skeleton`)** powering both an **Agentic Code-Hygiene HUD (`PulseHUD`)** and a **1:1 3D Spatial Comparator (`ScaleHUD`)**. |
| **`Kiro-InteractionKit`** ([github.com/Harpita-P/Kiro-InteractionKit](https://github.com/Harpita-P/Kiro-InteractionKit), 2025 $30k Winner) | Kiroween 2025 Skeleton Crew Winner | Clear `.kiro/` spec + hook + steering integration; 2 distinct apps in separate folders. | Requires local Python virtualenv + OpenCV + PyGame; cannot run instantly in a browser or enforce Rust/TS code-hygiene gates. | Zero-install WebGL/Canvas + Tauri v2 architecture with sub-35ms **Oxlint + Vite+ + Fallow + PBT** automated hooks. |
| **`fallow-rs/fallow`** ([github.com/fallow-rs/fallow](https://github.com/fallow-rs/fallow), 5.4k★) & **`voidzero-dev/vite-plus`** ([github.com/voidzero-dev/vite-plus](https://github.com/voidzero-dev/vite-plus), 6.6k★) | Agentic Codebase Intelligence & Toolchain | Rust-speed AST linting, circular dependency detection, dead-code pruning, cognitive complexity scoring. | CLI-only text output in terminal; no interactive force-directed spatial graph or 1-click visual hook healing HUD. | Turns `Fallow + Oxlint` diagnostics into an **interactive force-directed spatial graph (`PulseHUD`)** with animated cycle arcs and 1-click `.kiro/hooks` auto-healing. |
| **Tangiblee** ([tangiblee.com](https://www.tangiblee.com/)) & **CompareSizes** ([comparesizes.com](https://comparesizes.com/)) | Product Sizing & 3D Comparison | Tangiblee offers B2B visual sizing; CompareSizes offers manual box wireframes. | Tangiblee costs $1,500+/mo for B2B merchants (unavailable on Shopee/AliExpress); CompareSizes lacks 2.5D depth relief, volumetric bin-packing (`PackFit`), and exploded CAD rig inspection. | Works on **any** e-commerce listing or dimension string in `<50ms` with **1:1 millimeter laser calipers, ISO reference objects, 3D container bin-packing, and exploded isometric CAD inspection**. |

---

## 2. Product Audit & Radical UI Transformation (Phase 2 & Phase 3)

### Key Issues Identified in Initial Prototype & How They Were Fixed
1. **Issue P0 (Eliminated "Bloated Web Page with Text Walls")**:
   - *Before*: Scrolling web document with 6 tab cards and multi-paragraph explanatory banners.
   - *After*: Rebuilt as **`DESKHUD_OS`**, a fixed `100vw × 100vh` (`overflow: hidden` on desktop) native-OS desktop application shell applying **`Cartridge 03 // SPATIAL FIELD CANVAS (`SPATIAL_SHADER`)`** + **`Cartridge 01 // SWISS BRUTALISM (`BRUTALIST_GRID`)`**.
   - *Verification*: 80% of the viewport is dedicated to interactive HTML5 Canvas / 3D rendering, with crisp `IBM Plex Mono` telemetry tags (`<= 4 words` per chip) and zero marketing prose.
2. **Issue P0 (Visual Storytelling Instead of Text Explanations — `prompts/04-demo.md` Alignment)**:
   - *Before*: Static text explaining how the skeleton connects to the two apps.
   - *After*: Built **`03 // CAMERA RIG` (`src/components/VisualStoryDirector.tsx`)**, an interactive pan/zoom cinema camera rig over the live SVG architecture blueprint that visually zooms into `01 // HANDY INPUT PILL` → `02 // SKELETON CORE (.kiro)` → `03 // PULSE_HUD & SCALE_HUD 3D` with live Before/After metric deltas.
3. **Issue P1 (Strict `Skeleton Crew` Repository Compliance)**:
   - Created root `LICENSE` (MIT) and root `/.kiro` directory (`specs/`, `hooks/`, `steering/`, `settings/mcp.json` — verified NOT gitignored).
   - Extracted shared engine into `packages/deskhud-skeleton/index.ts` and separated the two applications into `apps/pulse-hud/PulseHudApp.tsx` and `apps/scale-hud/ScaleHudApp.tsx`.

---

## 3. Build, Kiro Hooks, Property-Based Tests & Visual Verification (Phase 4.1)

- **Clean Gate & Property-Based Testing (`.kiro/hooks/run-clean-gate.sh`)**:
  - `npx tsc --noEmit`: **PASS (0 errors)**
  - `node --test tests/skeleton-pbt.test.mjs`: **4/4 test suites PASS** (including 250 randomized Property-Based Test seeds verifying `1 cm = 10 mm` metric conservation and hexagonal isolation between `apps/pulse-hud` and `apps/scale-hud`).
- **Live Vercel Production Deployment (Verified HTTP 200)**:
  - **URL**: [https://kiro-hackathon-lake.vercel.app](https://kiro-hackathon-lake.vercel.app)
- **Captured & Inspected Frontend Evidence (`evidence/stage-2-build/frontend/`)**:
  1. `01-desktop-pulse-dirty.png` — `1440×900` App 1 (`PulseHUD`) showing 3-node crimson circular dependency, boundary drift, and cognitive complexity `34/10` (`FALLOW: 52/100`).
  2. `02-desktop-pulse-healed.png` — `1440×900` App 1 (`PulseHUD`) after clicking `HEAL VIA KIRO HOOK (ALT+H)`, showing clean emerald DAG (`FALLOW: 98/100`, `CYCLES: 0`, `DEAD_EXPORTS: 0`).
  3. `03-desktop-scale-3d.png` — `1440×900` App 2 (`ScaleHUD // 01 1:1 SCALE STAGE`) comparing `CANVAS_TOTE_MINI (180×120×70MM)` with `SPAN: 180MM` laser caliper against `330ML_CAN (66×115MM)` and `IPHONE_16 (72×148×8MM)`.
  4. `04-desktop-packfit-3d.png` — `1440×900` App 2 (`ScaleHUD // 02 PACKFIT 3D BOX`) showing 3D volumetric packing inside `CAMERA_CUBE_S (290×200×140MM)` (`VOLUME UTILIZATION: 26%`, `TOP CLEARANCE: +80MM`).
  5. `05-desktop-exploded-rig.png` — `1440×900` App 2 (`ScaleHUD // 03 EXPLODED CAD RIG`) showing 4-layer exploded isometric assembly with leader callout lines and BOM tolerance redline guard.
  6. `06-desktop-camera-rig.png` — `1440×900` `03 // CAMERA RIG` visual architecture director.
  7. `07-mobile-390px.png` — `390×844` responsive mobile viewport with zero horizontal overflow.

---

## 4. Momen Headless BaaS Cloud Sync, Static Site Hosting & GitHub Repository (Phase 4.2 & Phase 5)

- **Momen Project Created & Synced**:
  - **Project Name**: `DeskHUD-Kiroween`
  - **`projectExId`**: `BqvlMwgw2gA`
  - **`appExId`**: `Y5qOvKnEDkg` (`appType: "WEB"`)
  - **PostgreSQL Tables Synced (`sync_backend` deployV2=true, 0 errors)**:
    1. `hud_audit_run` (`tableId: dd6a177f-b856-49ad-8b5a-fb4ccfa9d6fe`) — Seeded & verified via live `runtime_graphql` (`insert_hud_audit_run` & `hud_audit_run` query).
    2. `spatial_sku_twin` (`tableId: 45efff81-1844-46bc-b5e7-46253cb56719`) — Seeded with Shopee/Amazon true-scale 3D twin benchmarks.
  - **Momen Runtime GraphQL HTTP Endpoint**: `https://villa.momen.app/zero/BqvlMwgw2gA/api/graphql-v2`
  - **Momen Static Site Hosting URL (BETA CDN)**: [https://v5nv4ypdpr159.cave.momenapp.com](https://v5nv4ypdpr159.cave.momenapp.com) (`deploymentExId: R9MYMQe2Lwy`)
- **Vercel Production Deployment (Verified HTTP 200)**:
  - **URL**: [https://kiro-hackathon-lake.vercel.app](https://kiro-hackathon-lake.vercel.app)
- **GitHub Public Repository (with root `/.kiro`, `LICENSE`, `packages/deskhud-skeleton`, `apps/pulse-hud`, `apps/scale-hud`)**:
  - **URL**: [https://github.com/Georgefifth/deskhud-kit-kiroween](https://github.com/Georgefifth/deskhud-kit-kiroween)

