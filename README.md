# DESKHUD_OS (`DeskHUD Kit`) — Kiroween 2026 (`Skeleton Crew` Track)

> **One Cross-Platform Rust/Tauri & Web Spatial HUD Skeleton (`packages/deskhud-skeleton`) → Two Distinct Applications (`apps/pulse-hud` & `apps/scale-hud`), Guarded by Kiro Specs, Hooks, Steering, Property-Based Tests & Momen Headless BaaS.**

- **Live Deployed App (Vercel CDN)**: [https://kiro-hackathon-lake.vercel.app](https://kiro-hackathon-lake.vercel.app)
- **Live Deployed App (Momen Static Site CDN)**: [https://v5nv4ypdpr159.cave.momenapp.com](https://v5nv4ypdpr159.cave.momenapp.com)
- **Momen Headless BaaS Runtime GraphQL Endpoint**: `https://villa.momen.app/zero/BqvlMwgw2gA/api/graphql-v2`
- **License**: MIT (`LICENSE`)

---

## 1. Repository Architecture (`Skeleton Crew` Compliance)

```text
├── .kiro/                                 # Mandatory Kiro configuration (Tracked in Git)
│   ├── specs/                             # Spec-driven development definitions
│   │   ├── deskhud-skeleton.spec.md       # Shared skeleton invariants & contracts
│   │   ├── app1-pulse-hud.spec.md         # App 1 specification
│   │   └── app2-scale-hud.spec.md         # App 2 specification
│   ├── steering/
│   │   └── agentic-clean-architecture.md  # Hexagonal boundaries, Oxlint/Fallow & 1mm rules
│   ├── hooks/
│   │   ├── agentic-clean-gate.json        # Automated post-edit Kiro hook
│   │   └── run-clean-gate.sh              # Runs tsc + 250-seed Property-Based Tests (PBT)
│   └── settings/
│       └── mcp.json                       # Momen Headless BaaS MCP + Fallow Codebase MCP
├── packages/
│   └── deskhud-skeleton/                  # Core Reusable Skeleton Engine
│       └── index.ts                       # AST cycle/dead-code analyzer + 1mm 3D spatial & bin-packing engine
├── apps/                                  # 2 Separate Repo Folders for 2 Distinct Applications
│   ├── pulse-hud/                         # App 1: Agentic Code-Hygiene & Architecture Force-Graph HUD
│   │   └── PulseHudApp.tsx
│   └── scale-hud/                         # App 2: 1:1 Millimeter 3D E-Commerce Comparator & Volumetric Packer
│       └── ScaleHudApp.tsx
├── src/
│   ├── components/
│   │   └── VisualStoryDirector.tsx        # Animated Camera-Rig Architecture & Data-Flow Blueprint
│   ├── momenClient.ts                     # Momen Runtime GraphQL + WebSocket Telemetry Client
│   ├── App.tsx                            # DESKHUD_OS 100vw×100vh Spatial Shell & Handy Pill
│   └── main.tsx
└── tests/
    └── skeleton-pbt.test.mjs              # 250-seed Property-Based Tests + Shared-Skeleton Proofs
```

---

## 2. The Two Distinct Applications Built on `packages/deskhud-skeleton`

### App 1 (`apps/pulse-hud`) — `PulseHUD` (Agentic Code-Hygiene & Force-Graph Studio)
Inspired by `cjpais/Handy`, `voidzero-dev/vite-plus`, `oxc-project/oxc` (`Oxlint`), and `fallow-rs/fallow` (`Fallow`):
- Renders the repository module graph as an interactive **Spatial Force-Directed Field** where cursor proximity warps the coordinate grid.
- Highlights circular dependencies (`A → B → C → A`) in pulsing crimson vectors, hexagonal boundary violations in amber, and scales node halos by cognitive complexity.
- **1-Click Kiro Hook Auto-Heal (`Alt+H`)**: Executes `.kiro/hooks/agentic-clean-gate` to sever dependency cycles, strip dead exports, replace panic-inducing Rust `.unwrap()` calls with `#[specta::specta]` typed `Result<T, HudErr>`, and persist the audit run to **Momen PostgreSQL (`hud_audit_run`)**.

### App 2 (`apps/scale-hud`) — `ScaleHUD 3D` (1:1 E-Commerce Scale Comparator, PackFit 3D & Exploded CAD Rig)
Solves e-commerce "2D Studio Photo Size Deception" on Shopee, Amazon, and AliExpress:
- **`01 // 1:1 SCALE STAGE`**: Parses unstructured `L × W × H` dimension strings (`mm`, `cm`, `in`) into a 1:1 millimeter-calibrated 2.5D relief hull alongside ISO physical reference objects (**330ml Soda Can `66×115mm`**, **iPhone 16 `72×148×8mm`**, **ISO ID-1 Credit Card `86×54mm`**, **A4 Sheet `210×297mm`**).
- **`02 // PACKFIT 3D BOX`**: Interactive 3D AABB volumetric bin-packer that tests whether multiple 3D items fit inside airline cabin sizers, camera cubes, or Shopee parcel boxes with real-time utilization % and overflow detection.
- **`03 // EXPLODED CAD RIG`**: Interactive 4-layer exploded isometric assembly inspector (`0%–100%` explosion slider) with BOM tolerance and contract redline verification.

---

## 3. Quick Start & Verification

```bash
npm install
bash .kiro/hooks/run-clean-gate.sh   # Runs TypeScript check + 250-seed Property-Based Tests
npm run dev                          # Starts local DESKHUD_OS studio
npm run build                        # Builds production bundle into ./dist
```
