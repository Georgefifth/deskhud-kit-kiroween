# Kiro Steering — Agentic Clean-Code & Spatial Architecture Guardrails

## 1. Skeleton Crew Structural Law
- Every application in `apps/*` (`apps/pulse-hud` and `apps/scale-hud`) MUST import its core state machine, AST graph analyzer, and metric 3D spatial engine from `packages/deskhud-skeleton`.
- Apps in `apps/*` MUST NOT import from each other (`apps/pulse-hud` cannot import `apps/scale-hud`). This hexagonal boundary is enforced by `fallow guard` and unit tests.

## 2. Frontend Agentic Clean-Code Rules (`Oxlint + Vite+ + Fallow`)
- **Zero `any` or Unsafe Assertions**: Enforce strict TypeScript types across all HUD events and IPC payloads.
- **Zero Circular Dependencies**: Module import graphs must be strict Directed Acyclic Graphs (DAGs).
- **Zero Dead Exports**: Every exported function or type must be consumed by at least one active module or public package entrypoint.
- **Cognitive Complexity Cap**: No function may exceed a cognitive complexity score of `10`.

## 3. Backend Agentic Clean-Code Rules (`Rust Tauri v2 + Specta + Hono/Momen`)
- **No `.unwrap()` or `.expect()` in Rust Commands**: Every `#[tauri::command]` must return `Result<T, DeskHudError>` and carry `#[specta::specta]` so TypeScript IPC bindings stay 100% synchronized.
- **1 Unit = 1 Millimeter (`mm`)**: All 3D spatial coordinates, reference items, and volumetric containers must be normalized to integer or float millimeters before rendering.
