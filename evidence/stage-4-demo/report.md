# Stage 4 — Demo Video & Visual Presentation Report (`DESKHUD_OS // DeskHUD Kit`)

## 1. Video Artifact & Technical Specs
- **Rendered Video File**: `evidence/stage-4-demo/demo.mp4`
- **Resolution & Frame Rate**: `1920×1080` (`1080p30`, H.264 `yuv420p`)
- **Duration**: `75.5 seconds` (1 min 15.5 sec — well within Kiroween's `<3 minute` limit)
- **File Size**: `9.54 MB`
- **Audio**: `edge-tts` narration + sidechain-ducked `cyber-pulse` BGM + frame-accurate synchronized subtitles
- **Storyboard Source**: `planning/storyboard.json`
- **Fact Validation Contract**: `project/facts.json` (`[validate-facts] scenes: 7 · total: 75.5s · verified facts: 4 · blocked unverified claims: 1 — PASS`)

---

## 2. 7-Scene Visual Narrative Structure

| Scene # | `scene_id` | `visual_type` | Duration | Visual Expression & Real Demo Integration |
|---|---|---|---|---|
| **01** | `opening` | `opening_title` | 9.78s | Custom SVG architecture schematic (`deskhud_front.svg`), 3 verified metric badges (`18ms OXLINT AST GATE`, `0 FALLOW DEAD CODE`, `250/250 PBT SEEDS`), and timed reticle highlighting the Handy global pill. |
| **02** | `problem` | `problem_flow` | 10.84s | Animated bottleneck flowchart contrasting unsteered agent circular dependencies (`3-Node Cycle`) and 2D studio photo size deception (`120mm Tote`). |
| **03** | `exploded_architecture` | `exploded_view` | 10.53s | Four-layer isometric exploded stack (`L3 Handy Pill` → `L2 Oxlint + Fallow Gate` → `L1 Shared Skeleton Core` → `L0 Rust Specta IPC + Momen BaaS`) with leader callouts. |
| **04** | `live_pulse_hud` | `real_footage_with_annotations` | 10.94s | **Live Playwright Browser Capture (`live_live_pulse_hud.mp4`)** on `https://kiro-hackathon-lake.vercel.app`: clicks `HEAL VIA KIRO HOOK`, severs the 3-node cycle into a clean DAG (`52 → 98/100`), and commits to Momen PostgreSQL (`BqvlMwgw2gA`). |
| **05** | `live_scale_hud` | `real_footage_with_annotations` | 13.02s | **Live Playwright Browser Capture (`live_live_scale_hud.mp4`)**: switches to `ScaleHUD 3D`, compares `180×120×70mm` tote against a `330ml` soda can & `iPhone 16`, packs `PackFit 3D Box` (`26% utilization`), and inspects the 4-layer `Exploded CAD Rig`. |
| **06** | `validation` | `technical_validation` | 11.78s | Animated empirical benchmark bars (`100% vs 83.3%` on 18 real-world cases; `18ms vs 850ms` Oxlint hook speed) paired with explicit scope limitations. |
| **07** | `closing` | `closing_summary` | 8.58s | Summary badges (`SKELETON::packages/deskhud-skeleton`, `2 APPS::apps/pulse-hud + apps/scale-hud`, `LIVE::kiro-hackathon-lake.vercel.app`). |

---

## 3. Visual Frame Verification (`evidence/stage-4-demo/frames/`)
Extracted 8 frames (`frame_01.png` .. `frame_08.png`) via `ffmpeg` and inspected with `read`:
- Zero text truncation or overlapping callout boxes.
- Both live Playwright recordings (`live_pulse_hud` and `live_scale_hud`) are crisp, properly framed inside the annotated HUD monitor, and synchronized with step trackers and bottom captions.
