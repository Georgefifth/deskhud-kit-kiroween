# Devpost Submission Fields — `DESKHUD_OS (DeskHUD Kit)`

## 1. Project Name
```text
DESKHUD_OS (DeskHUD Kit)
```

## 2. Category
```text
Skeleton Crew
```

## 3. Elevator Pitch (170 characters, max 200)
```text
One cross-platform Rust/Tauri & Web spatial HUD skeleton guarded by Oxlint, Vite+, Fallow & Kiro Hooks—powering an Agentic Clean-Code HUD and a 1:1 3D Scale Comparator.
```

## 4. About the Project (Copy-Paste Markdown)
```markdown
## Inspiration

While building with AI coding agents and shopping online, our team noticed two seemingly unrelated frustrations that share the same architectural root:

1. **Unsteered Agentic Code Drift**: When coding agents vibe-code features without sub-50ms architectural guardrails, they silently introduce 3-node circular dependencies, dead exports, high cognitive complexity functions, and panic-inducing `.unwrap()` calls across the frontend-backend boundary.
2. **2D E-Commerce Size Deception**: On marketplaces like Shopee, Amazon, and AliExpress, 99% of listings only show macro 2D studio photos on white backgrounds. A `18 × 12 × 7 cm` bag looks laptop-sized in 2D, but arrives barely taller than a `115 mm` soda can.

Inspired by last year's Kiroween Grand Prize winner (`Kiro-InteractionKit`) and CJ Pais's cross-platform Rust/Tauri overlay utility (`Handy`), we asked: **What if we built a single, ultra-lean Spatial Desktop HUD Skeleton (`DeskHUD Kit`) steered by Kiro Specs, Hooks, and Rust-speed static analyzers (`Oxlint` + `Vite+` + `Fallow`), and proved its versatility by shipping two completely distinct spatial applications on top of it?**

## What it does

`DESKHUD_OS` (`DeskHUD Kit`) is a reusable cross-platform **Rust/Tauri v2 & WebGPU/Canvas Spatial HUD Skeleton** (`packages/deskhud-skeleton`) featuring a top-center `Handy`-style shortcut/voice capsule (`Alt+Space`) and two distinct applications housed in separate repository folders:

### App 1 (`apps/pulse-hud`) — `PulseHUD` (Agentic Code-Hygiene & Force-Graph Studio)
- Renders the live repository module graph as an interactive **Spatial Force-Directed Field** where cursor proximity warps the underlying coordinate grid.
- Highlights circular dependencies (`hudView.tsx -> overlayController.ts -> stateStore.ts`) in pulsing crimson vectors, hexagonal boundary violations in amber, and cognitive complexity hotspots (`C:34`) as scaled node halos.
- **1-Click Kiro Hook Auto-Heal (`Alt+H`)**: Executes `.kiro/hooks/agentic-clean-gate.json` (`Oxlint` AST check in `18ms` + `Fallow` graph audit in `20ms` + Rust `Specta` IPC verification), severing circular dependency cycles into a clean Directed Acyclic Graph (`98/100` health) and committing the audit record to **Momen PostgreSQL (`BqvlMwgw2gA`)**.

### App 2 (`apps/scale-hud`) — `ScaleHUD 3D` (1:1 Millimeter E-Commerce Comparator, PackFit 3D & Exploded CAD Rig)
- **`01 // 1:1 SCALE STAGE`**: Parses messy e-commerce dimension text (`mm`, `cm`, `in`, mixed-unit axes) into a 1:1 millimeter-calibrated 2.5D depth-relief hull alongside ISO physical reference objects (`330ml Soda Can 66×115mm`, `iPhone 16 72×148×8mm`, `ISO ID-1 Credit Card 86×54mm`, `A4 Sheet 210×297mm`) with interactive `360°` drag orbit and laser caliper readouts.
- **`02 // PACKFIT 3D BOX`**: A deterministic 3D AABB volumetric bin-packer that tests whether multiple 3D items fit inside airline cabin sizers, camera cubes, or Shopee parcel boxes with real-time utilization percentages and millimeter top-clearance gauges.
- **`03 // EXPLODED CAD RIG`**: A 4-layer interactive isometric hardware teardown viewer (`0%–100%` explosion slider) paired with a BOM tolerance and contract redline guard.

## How we built it (And How Kiro Was Used)

We built `DESKHUD_OS` using a strict **Two-Track Decoupled Architecture**:
- **Shared Core Skeleton (`packages/deskhud-skeleton/index.ts`)**: Zero-dependency TypeScript engine implementing DFS cycle detection, cognitive complexity scoring, deterministic per-axis metric parsing (`1 unit = 1 mm`), and 3D shelf/guillotine AABB bin-packing.
- **Local Bespoke Frontend (`React 18` + `TypeScript` + `HTML5 Canvas 3D` + `Vite`)**: Designed as a fixed `100vw × 100vh` hardware-tactile desktop OS shell with zero text-wall bloat, plus an interactive `03 // CAMERA RIG` visual architecture director.
- **Cloud Persistence (`Momen Headless BaaS` — Project `BqvlMwgw2gA`)**: Provisioned via the **Momen MCP** (`tools.momen.*`), syncing PostgreSQL tables (`hud_audit_run` and `spatial_sku_twin`) and exposing a live Runtime GraphQL API (`https://villa.momen.app/zero/BqvlMwgw2gA/api/graphql-v2`) and Static Site CDN.

### Deep Kiro Feature Integration (`/.kiro` Directory)
1. **Spec-Driven Development (`.kiro/specs/`)**: We authored three formal specs (`deskhud-skeleton.spec.md`, `app1-pulse-hud.spec.md`, `app2-scale-hud.spec.md`) defining exact mathematical invariants (`S1: Health Score Monotonicity`, `S2: 1cm = 10mm Metric Conservation`, `S3: Volumetric AABB Non-Overlap`) before writing application code. Compared to unstructured vibe coding, spec-driven development eliminated cross-app coupling from day one.
2. **Steering Docs (`.kiro/steering/agentic-clean-architecture.md`)**: Enforced hexagonal boundaries (`apps/pulse-hud` and `apps/scale-hud` must consume `packages/deskhud-skeleton` and never import each other), banned Rust `.unwrap()` in favor of `#[specta::specta] Result<T, HudErr>`, and locked all 3D geometry to `1 unit = 1 mm`.
3. **Agent Hooks (`.kiro/hooks/agentic-clean-gate.json` & `run-clean-gate.sh`)**: Automated a 4-stage verification pipeline on file save:
   - `npx oxlint --deny-warnings src packages apps` (`18ms` Rust AST lint, `0` warnings)
   - `npx fallow dead-code` (`20ms` full-repo dependency graph check, `0` dead files, `0` dead exports)
   - `npx tsc --noEmit` (`0` type errors)
   - `node --test tests/skeleton-pbt.test.mjs` (`250` Property-Based Test seeds)
4. **Property-Based Testing (PBT — `tests/skeleton-pbt.test.mjs`)**: Using a deterministic Mulberry32 PRNG across `250` randomized dimension triplets, PBT verified that arbitrary `cm` and `mm` inputs always produce identical millimeter bounding boxes without floating-point drift, and verified hexagonal isolation between both app folders.
5. **MCP Integration (`.kiro/settings/mcp.json`)**: Combined **Momen MCP** (to provision PostgreSQL schemas, validate CRDT state, sync the backend, seed runtime rows, and deploy `./dist` to Momen's CDN) with **Fallow MCP** for real-time codebase graph intelligence.

## Challenges we ran into

During Stage 3.5 real-world validation against an `18-case` external dataset (`tests/real-world-dataset.mjs` sourced from ISO 7810, Apple iPhone 16 specs, AirAsia cabin rules, and messy Shopee/AliExpress listings), our initial metric parser scored `83.3% (15/18)` and failed on three real-world edge cases:
- Mixed-unit strings (`"Width 18cm x Height 120mm x Depth 7cm"`) where a single global unit detector mis-scaled `120mm` by `10x`.
- Product titles prefixed with model numbers (`"Model 2026-X99, Pack of 2, Size: 22 x 14 x 8 cm"`) where naive number extraction grabbed `2026, 99, 2`.
- HTML-tagged strings (`"<script>alert(1)</script> 15 x 10 x 5 cm"`).

Running `npx fallow` and `npx oxlint` on our own repository also uncovered `17` unused imports and `3` unused exports in `src/momenClient.ts`. We refactored the parser to strip HTML tags and resolve per-axis unit suffixes on explicit `A × B × C` triplets—bringing real-world accuracy from `83.3%` to `100% (18/18)`—and pruned all unused symbols to achieve `0` Oxlint warnings and `0` Fallow dead-code issues.

## Accomplishments that we're proud of

- **True App-Grade Spatial UI**: Zero scrolling text walls; `80%` of the viewport is dedicated to interactive 60fps HTML5 Canvas force graphs, 3D millimeter stages, and an animated `03 // CAMERA RIG` visual director.
- **100% Verified Engineering Evidence**: `10/10` Playwright real-browser scenarios passing across both Desktop (`1440×900`) and Mobile (`390×844`) on Vercel, Momen CDN, and Local builds; `250/250` PBT seeds passing; and `18/18 (100%)` real-world validation accuracy.

## What we learned

 Combining **Kiro Specs + Hooks** with ultra-fast Rust static analysis tools (`Oxlint` at `18ms` and `Fallow` at `20ms`) solves the biggest bottleneck of agentic software development: feedback latency. Because the clean-code gate finishes in under `40ms`, an AI agent can run it on every single edit without slowing down iteration.

## What's next for DESKHUD_OS

- Packaging the native **Tauri v2** `.dmg` (macOS) and `.msi` (Windows) installers with global OS-level screen OCR for one-hotkey (`Alt+S`) Shopee/Amazon overlays outside the browser.
- Adding multi-view silhouette carving for irregular 3D collectibles anddecimal-fraction conversion for imperial carpentry specs.
```

## 5. Built With (Tags)
```text
kiro, rust, tauri, typescript, react, vite, oxlint, fallow, momen, postgresql, graphql, html5-canvas, threejs, playwright, vercel
```

## 6. "Try It Out" Links
- **Live App (Vercel Production)**: `https://kiro-hackathon-lake.vercel.app`
- **Live App (Momen Static Site CDN)**: `https://v5nv4ypdpr159.cave.momenapp.com`
- **Public GitHub Repository**: `https://github.com/Georgefifth/deskhud-kit-kiroween`

## 7. Demo Video
- **Local MP4 File to Upload to YouTube (`<3 min`, 1080p30, 75.5s)**: `submission/assets/demo.mp4`
- **YouTube Video URL Field**: `TODO(human): Upload submission/assets/demo.mp4 to YouTube as Public and paste the URL here`

## 8. Image Gallery Files & Captions (`submission/assets/`, <= 150 chars each)
1. **`submission/assets/thumbnail.png`** (Upload as Project Thumbnail):
   - `DESKHUD_OS: One Rust/Tauri & Web spatial HUD skeleton powering PulseHUD and ScaleHUD 3D.`
2. **`submission/assets/gallery-01-pulse-dirty.png`**:
   - `App 1 (PulseHUD): Force-directed Fallow graph catching a 3-node circular dependency and complexity 34.`
3. **`submission/assets/gallery-02-pulse-healed.png`**:
   - `App 1 (PulseHUD): 1-click Kiro Hook Auto-Heal severs cycles into a clean DAG (98/100) synced to Momen PG.`
4. **`submission/assets/gallery-03-scale-3d.png`**:
   - `App 2 (ScaleHUD 3D): 1:1 millimeter 3D stage comparing a 180x120x70mm Shopee tote vs a 330ml can & iPhone 16.`
5. **`submission/assets/gallery-04-packfit-3d.png`**:
   - `App 2 (PackFit 3D): Volumetric 3D AABB bin-packer calculating 26% utilization and +80mm top clearance.`
6. **`submission/assets/gallery-05-exploded-rig.png`**:
   - `App 2 (Exploded CAD Rig): 4-layer isometric hardware teardown with leader callouts and BOM tolerance guard.`
