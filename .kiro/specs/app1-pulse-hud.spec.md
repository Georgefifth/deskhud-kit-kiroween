# Spec: App 1 — `PulseHUD` (`apps/pulse-hud`)

## 1. Overview
`PulseHUD` is the first distinct application built on `packages/deskhud-skeleton`. It is a floating developer HUD for AI-assisted coding (Kiro, Claude Code, Cursor) that visualizes repository architecture health in real time using **Oxlint (`oxc`)**, **Vite+ (`vp check`)**, **Fallow (`fallow-rs/fallow`)**, and **Rust `cargo clippy` + `tauri-specta`**.

## 2. Core Capabilities
- **Interactive Force-Directed Repository Graph**: Renders modules as spatial nodes, highlights circular dependencies (`A -> B -> C -> A`) in pulsing crimson vectors, and scales node halos by cognitive complexity.
- **1-Click Kiro Hook Auto-Heal**: Executes the deterministic `.kiro/hooks/agentic-clean-gate` transformation to break dependency cycles, strip unused exports, and replace Rust `.unwrap()` calls with typed `Result<T, DeskHudError>`.
- **Handy-Style Voice/Shortcut Bot**: Press `Alt+Space` to issue natural-language refactoring or audit commands.
