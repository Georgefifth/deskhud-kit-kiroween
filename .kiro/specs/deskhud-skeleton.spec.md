# Spec: DeskHUD Core Skeleton (`packages/deskhud-skeleton`)

## 1. Purpose
`DeskHUD Kit` is a lean, cross-platform Rust/Tauri v2 + WebGPU/Canvas ambient HUD skeleton inspired by `cjpais/Handy` and `Harpita-P/Kiro-InteractionKit`. It abstracts away:
1. **Global Shortcut & Voice-Activated Floating HUD Pill (`Alt+Space` / `Alt+S`)** with real-time WebAudio waveform telemetry and context-aware assistant bot dispatch.
2. **Agentic Clean-Code Gate (`Oxlint + Vite+ + Fallow + Rust Clippy/Specta`)**: Deterministic static graph analysis that computes a 0–100 Fallow Health Score, detects circular dependency cycles, prunes dead exports, enforces cognitive complexity caps (`<= 10`), and verifies Rust-to-TypeScript IPC contracts.
3. **1:1 Millimeter-Calibrated Spatial & Volumetric Engine**: Parses unstructured dimension strings (`cm`, `mm`, `in`) into normalized millimeter bounding hulls, generates 2.5D depth-relief meshes, aligns ISO reference objects, and computes 3D AABB volumetric bin packing.

## 2. Invariants (Verified via Property-Based Testing)
- **Invariant S1 (Health Score Monotonicity)**: Eliminating a circular dependency or dead export via `.kiro/hooks/agentic-clean-gate` strictly increases or preserves the repository Fallow Health Score (`0 <= score <= 100`).
- **Invariant S2 (Metric Unit Conservation)**: Parsing `W cm x H cm x D cm` always equals `W*10 mm x H*10 mm x D*10 mm` with zero floating-point drift.
- **Invariant S3 (Volumetric Packing Non-Overlap)**: No two packed items `A` and `B` inside a container may have intersecting 3D Axis-Aligned Bounding Boxes (`AABB_intersect(A, B) === false`).
