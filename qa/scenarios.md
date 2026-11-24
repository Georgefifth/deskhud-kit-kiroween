# Stage 3 — Real-Browser QA Scenarios (`DESKHUD_OS`)

| ID | Priority | Scenario | Expected Business Outcome |
|---|---|---|---|
| `p0-landing-and-momen-sync` | P0 | First visit, responsive layout & Momen PostgreSQL sync | Page loads with zero horizontal overflow (`scrollWidth <= innerWidth + 1`), `DESKHUD_OS` shell visible, and live Momen PostgreSQL query (`hud_audit_run`) populates `MOMEN_PG` badge. |
| `p0-pulse-hud-heal-and-persist` | P0 | App 1 (`PulseHUD`) Kiro Hook Auto-Heal & Momen Persistence | Initial state shows `CYCLES: 3`; clicking `HEAL VIA KIRO HOOK (ALT+H)` transitions graph to `CYCLES: 0` and `CLEAN · 100/100`, commits a row to Momen PostgreSQL (`insert_hud_audit_run_one`), and preserves persisted audit history after full page reload (`F5`). |
| `p0-scale-hud-3d-and-packfit` | P0 | App 2 (`ScaleHUD 3D`) Custom Dimension Extrusion, PackFit 3D & Exploded Rig | Extrudes `24 x 15 x 9 cm` into `240×150×90MM` on the 3D stage, calculates volumetric utilization % in `02 // PACKFIT 3D BOX`, and renders 4-layer isometric teardown in `03 // EXPLODED CAD RIG`. |
| `p1-invalid-input-recovery` | P1 | Invalid & negative dimension input handling and recovery | Entering `"-10 x 5 x 5 cm"` or `"invalid"` triggers inline `metric-parse-error` banner without throwing console errors, and entering `"20 x 12 x 8 cm"` recovers cleanly. |
| `p1-camera-rig-and-handy-bot` | P1 | Camera Rig visual director & Handy Pill Bot command dispatch | Clicking `03 // CAMERA RIG` and `AUTO-PAN CAMERA RIG` animates viewBox zoom; submitting `"heal fallow"` in Handy Bot input triggers `HANDY_BOT //` confirmation toast. |
