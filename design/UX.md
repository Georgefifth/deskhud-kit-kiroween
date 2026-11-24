# UX Contract & Visual System — `DeskHUD Kit` (Kiroween 2026: Skeleton Crew)

## 1. Target Users, Core Jobs-to-be-Done & Success Criteria

- **Target Users**:
  1. **AI-Assisted Software Engineers (`App 1: PulseHUD`)**: Developers using Kiro, Claude Code, and Cursor on Windows/macOS who need an ambient, zero-context-switch desktop HUD (inspired by `cjpais/Handy`) that continuously enforces **Oxlint + Vite+ (`vp check`) + Fallow** codebase health, visualizes circular dependencies as an interactive force graph, and lets them trigger voice/hotkey auto-healing hooks.
  2. **Online Shoppers, Travelers & Indie Sellers (`App 2: ScaleHUD`)**: Users browsing 2D product listings on Shopee/Amazon or packing gear into airline cabin sizers/parcel boxes who press a global DeskHUD shortcut (`Alt+S`) to summon a **1:1 millimeter-calibrated 3D spatial overlay** comparing the item against everyday reference objects (330ml can, iPhone 16, ISO credit card) and testing 3D volumetric container fit.
- **Core Task & Success Criteria**:
  - **Zero Text-Wall Policy**: Every screen operates like a native macOS/Windows Tauri v2 desktop application (`100vw × 100vh` fixed app shell on desktop, zero document scrollbars, zero marketing paragraphs).
  - **Steps & Time from Launch to Core Result**: **≤ 2 clicks / < 3 seconds** to trigger either:
    1. Live **Fallow + Oxlint + Specta** AST graph inspection & 1-click Kiro Hook Auto-Heal (`52/100 → 98/100`), or
    2. Live **2D-to-Metric-3D Spatial Extrusion & Volumetric Packing** with interactive 360° orbit, laser millimeter calipers, and visual camera-rig storytelling.

---

## 2. Aesthetic Cartridge Selection & Visual Direction

- **Selected Cartridge Combination**:
  - **Primary**: **`Cartridge 03 // SPATIAL FIELD CANVAS (`SPATIAL_SHADER`)`** — Deep obsidian void (`#050608`), bioluminescent cyan vector (`#00F0FF`), surgical emerald (`#10B981`), warning amber (`#FF9F1C`), fault crimson (`#FF3366`), and ice telemetry ink (`#E2F1FF`).
  - **Secondary Structural Framing**: **`Cartridge 01 // SWISS BRUTALISM (`BRUTALIST_GRID`)`** — Exposed `1px solid rgba(0, 240, 255, 0.16)` structural hairlines, crisp technical corner reticles, and `IBM Plex Mono` coordinate tags.
- **3 Defining Adjectives**: **Tactile · Surgical · Zero-Bloat** (like a Teenage Engineering OP-1 / Raycast / `cjpais/Handy` hardware-software instrument, NOT a SaaS web page).
- **Archetype**: **Native OS Floating HUD + Full-Viewport Spatial CAD & AST Graph Studio**.
- **Typography**:
  - Display / HUD Headers: `'Syne'` & `'Space Grotesk'` (700/800 weight, tight `-0.03em` tracking).
  - Telemetry / Coordinates / AST Metrics / Calipers: `'IBM Plex Mono'` (`11px–13px`, tabular-nums).
  - UI Controls: `'Inter'` (`12px–13px`, high legibility).
- **Signature Visual Element**:
  1. **Top-Center Floating `DeskHUD` Capsule (`Handy` Pill)** with live 32-bar WebAudio/Canvas voice waveform, global shortcut badges (`Alt+Space`, `Alt+S`), and live Fallow Health ring gauge.
  2. **Interactive Visual Director / Camera-Rig Canvas (Stage 4 Presentation Principles Built into the App)**: Instead of text descriptions, an interactive pan/zoom vector & 3D viewport visually animates the signal path from `Shortcut/Voice Input → Kiro Spec/Hook Engine → Fallow Dependency Graph → 1:1 3D Metric Stage`.

---

## 3. App Views & Single Primary Action per View

| View / Mode | Folder Source | Primary Visual Canvas (80% Viewport) | Single Primary Action |
|---|---|---|---|
| **Mode 01: `PulseHUD` (Agentic Clean-Code HUD)** | `apps/pulse-hud/` | Interactive Force-Directed **Fallow Repository Graph** (nodes = modules, red animated arcs = circular dependencies, halo size = cognitive complexity) + side-by-side AST diff | **`[HEAL VIA KIRO HOOK]`** — Severs circular dependencies, prunes dead exports, replaces Rust `.unwrap()`, and animates Health Score `52 → 98`. |
| **Mode 02: `ScaleHUD` (True-Scale 3D & PackFit HUD)** | `apps/scale-hud/` | Full-bleed **3D WebGL/Canvas Metric Stage** with warpage grid, 2.5D depth relief extrusion, animated laser calipers (`mm`), 1:1 reference objects (330ml Can, iPhone 16, Credit Card), and 3D Cabin/Parcel Box bin packer | **`[EXTRUDE & COMPARE 1:1]`** — Parses `L×W×H` spec or SKU preset, renders 1:1 3D twin next to physical references, or packs items into a 3D container. |
| **Mode 03: `Visual Storyboard` (Interactive Architecture & Demo Rig)** | `packages/deskhud-skeleton/` | Animated pan/zoom **Visual Architecture & Exploded Isometric Mechanism Rig** (following `prompts/04-demo.md`: Flowchart → Zoomed Node → Live Telemetry → Exploded CAD) | **`[PLAY VISUAL WALKTHROUGH]`** — Steps camera automatically through the 5-stage engineering pipeline with zero text walls. |

---

## 4. Comprehensive State Matrix (Empty, Loading, Success, Error, Invalid Input)

| State | Visual & Interactive Behavior |
|---|---|
| **Empty State** | Clean calibrated coordinate grid with ghost wireframe silhouette and 1-click preset chips (`Load Dirty Agent Commit`, `Load Shopee Mini Tote 18×12×7cm`). |
| **Loading / Analyzing State** | High-frequency scanline sweep across the canvas + millisecond phase ticker (`[08ms] oxc AST parse` → `[19ms] fallow graph cycle check` → `[31ms] specta IPC verify`). |
| **Success State** | Bioluminescent emerald (`#10B981`) HUD ring, `98/100 HEALTH`, `0 CYCLES`, or `1:1 SCALE VERIFIED` badge with Momen Cloud Sync receipt timestamp. |
| **Error / Gate Blocked State** | Pulsing crimson (`#FF3366`) cycle arcs on the Fallow graph or red overflow bounding box in 3D PackFit when an item exceeds container dimensions (`+24mm Z-OVERFLOW`). |
| **Invalid Input State** | If user enters negative, zero, or unparseable dimension text (e.g. `"abc cm"`), inline `IBM Plex Mono` shake badge highlights the input field in amber (`INVALID METRIC SPEC — EXPECTED L×W×H IN MM/CM`) without crashing the 3D stage. |

---

## 5. Responsive & 390px Mobile Adaptation

- **Desktop (`1440×900`)**: Fixed `100vw × 100vh` native-OS HUD layout: Top floating `DeskHUD` pill bar, Left 64px icon rail, Center 72% interactive Canvas/3D viewport, Right 320px collapsible hardware telemetry inspector, Bottom 44px live Kiro Hook / Momen WebSocket wire strip.
- **Mobile (`390×844`)**: Collapses cleanly into a single-column native mobile app shell: Top compact `DeskHUD` status pill, full-width 360px touch-orbit 3D/Graph canvas, swipeable bottom sheet for 1-tap presets and primary action button (`min-height: 44px` touch targets).

---

## 6. Momen Headless Backend Contract (`src/momenClient.ts`)

- **Tables (`snake_case` singular)**:
  1. `hud_audit_run`: `id`, `app_slug`, `module_name`, `health_score` (INT), `circular_count` (INT), `dead_export_count` (INT), `clippy_status` (TEXT), `healed_by_hook` (BOOLEAN), `created_at`.
  2. `spatial_sku_twin`: `id`, `sku_title`, `marketplace`, `width_mm` (INT), `height_mm` (INT), `depth_mm` (INT), `shape_kind` (TEXT), `deception_verdict` (TEXT), `verified_count` (INT).
- **Runtime Endpoints**:
  - HTTP GraphQL: `https://villa.momen.app/zero/{projectExId}/api/graphql-v2`
  - WebSocket Subscriptions (`subscriptions-transport-ws`): `wss://villa.momen.app/zero/{projectExId}/api/graphql-subscription`
  - Fallback Resilience: When running offline or before Momen auth token is attached, seamlessly persists and streams via deterministic local ledger + live simulated wire frames while exposing real GraphQL/WebSocket connection status in the HUD footer.
