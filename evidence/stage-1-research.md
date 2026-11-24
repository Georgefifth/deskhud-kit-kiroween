# Stage 1 — Market Research, Track Rules & Candidate Selection (`Kiroween 2026 — Skeleton Crew`)

## 0. Kiroween 2026 & `Skeleton Crew` Track Rules (Verified Facts)

- **Official Hackathon Page**: [https://kiroween.devpost.com/](https://kiroween.devpost.com/)
- **Official Rules Page**: [https://kiroween.devpost.com/rules](https://kiroween.devpost.com/rules)
- **Sponsor**: Amazon Web Services (AWS) / Kiro ([https://kiro.dev/](https://kiro.dev/))
- **Prize Pool**: $100,000+ USD ($30,000 1st Place, $20,000 2nd Place, $10,000 3rd Place, **$5,000 Best Skeleton Crew**, **$1,500 + 1-yr Kiro Pro Max Best Student Project: Skeleton Crew**, $1,000 Best Demo, etc.)
- **Target Category (`Skeleton Crew`) Requirements**:
  1. **Core Concept**: *"Build a skeleton code template lean enough to be clear but flexible enough to support various use cases. Show us its versatility with two distinct applications from your foundation."*
  2. **Mandatory Repo Layout**:
     - *"For **Skeleton Crew** projects only: Your repo must contain **2 separate repo folders for the 2 separate applications**."*
     - *"Your repo must contain the **`/.kiro` directory at the root of the project** to show usage of specs, hooks, and steering. **Do NOT add the `/.kiro` directory or sub-folders to your `.gitignore`**, as this could disqualify your submission."*
     - Must include a visible Open Source `LICENSE` file in the GitHub repository root.
  3. **Judging Criteria (Equally Weighted, 20% Each)**:
     - **Potential Impact (20%)**: Solves a real problem for a real audience; intuitive, accessible, and genuinely useful.
     - **Technological Implementation (20%)**: Thorough, skillful use of Kiro features — **Specs** (spec-driven development), **Agent Hooks**, **Steering Docs**, **MCP**, **Property-Based Testing (PBT)**, and **Kiro Powers / Custom Agents**.
     - **Design (20%)**: Complete, coherent, polished, intentional product experience (not just a bare technical PoC).
     - **Innovation / Idea (20%)**: Novelty, creative combination of technologies or public datasets/models.
     - **Presentation (20%)**: End-to-end demo video under 3 minutes clearly communicating the problem, audience, skeleton architecture, and both applications working live.

### Benchmark Analysis: Why `Kiro-InteractionKit` Won the $30,000 Kiroween 2025 Grand Prize
- **Repo**: [https://github.com/Harpita-P/Kiro-InteractionKit](https://github.com/Harpita-P/Kiro-InteractionKit) (Verified Fact)
- **Why it won**:
  1. It built a **clean, high-leverage Skeleton Engine** (`kiro_interaction_kit/`) that abstracted away complex CV/MediaPipe boilerplate into a simple declarative controller API.
  2. It proved versatility with **2 visually distinct, immediately interactive apps** inside separate folders (`my_apps/Math-O-Lantern` game + `my_apps/Holo-Board` glassboard video studio).
  3. It deeply integrated `.kiro/specs/`, `.kiro/hooks/` (auto-wiring new gestures from specs into controllers), `.kiro/steering/` (architectural guardrails), and `.kiro/settings/` (MCP).
- **Competitive Gap in Kiroween 2026 Skeleton Crew**:
  - Current 2026 public submissions on GitHub (e.g., [jlhpacheco/kiroween-skeleton-crew](https://github.com/jlhpacheco/kiroween-skeleton-crew), [zhangdingcheng49-creator/kiroween-skeleton-crew](https://github.com/zhangdingcheng49-creator/kiroween-skeleton-crew), [binasalama12/kiroween-skeleton-crew](https://github.com/binasalama12/kiroween-skeleton-crew)) are mostly **plain CLI text scripts or basic CRUD forms**. None of them combine a **high-craft visual/spatial interactive WebGL/Canvas engine + Momen Headless BaaS persistence + deep Kiro Spec/Hook/PBT automation**.

---

## 1. Deep-Dive Evaluation of Teammate's Two Ideas

### Teammate Idea A: Shopee / E-Commerce 2D Image → 3D Object & True-Scale Physical Comparison
- **User Pain Point (Verified Fact)**: Online shoppers on Shopee, AliExpress, Amazon, and Taobao constantly suffer from **"2D Studio Photo Size Deception"** — studio product photos are shot with macro lenses on white backgrounds without scale references, making a 12cm mini backpack or a 150ml mug look full-sized. Shoppers either skip reading text dimensions (`14 × 9 × 6 cm`) or cannot mentally visualize what `14 × 9 × 6 cm` looks like in 3D space next to their everyday items.
- **Can It Win `Skeleton Crew` As-Is?**:
  - **No, if built only as a single Shopee plugin** — because `Skeleton Crew` strictly requires **1 reusable skeleton template + 2 distinct applications in 2 separate folders**.
  - **YES, if upgraded into `MetricStageKit` (Candidate #1 below)**: We extract the core technical breakthrough into a **Reusable 2D-to-Metric-3D Spatial Calibration & Volumetric Comparison Skeleton (`packages/metric-stage-skeleton`)**, and build **2 distinct applications** on top of it:
    1. **App 1 (`apps/shopscale-3d`)**: **E-Commerce True-Scale 3D Inspector & Browser Companion** (drops any Shopee/Amazon product photo + parsed `L × W × H` text spec onto a 1:1 calibrated 3D desk stage next to a 330ml Coca-Cola can, iPhone 16, ISO credit card, A4 sheet, or human hand, with 2.5D depth relief + 3D bounding proxy).
    2. **App 2 (`apps/packfit-3d`)**: **Carry-On Cabin Sizer, Camera Bag & Parcel Box 3D Volumetric Packer** (uses the exact same metric 3D skeleton so travelers, photographers, and indie sellers can test whether their gear/products physically fit inside an airline personal-item sizer box, camera cube, or Shopee standard shipping box with real-time 3D collision & clearance readouts).

### Teammate Idea B: Real Human Face → Animated Sticker GIF Generator
- **Your Instinct ("这玩意不就是 WhatsApp 里面本来就有的玩意吗") is 100% Confirmed by Market Facts**:
  1. **WhatsApp Native Selfie Stickers (2024–2025)**: WhatsApp natively allows users to tap *Create Sticker → Camera/Selfie* to instantly segment their face and turn it into stickers inside the chat tray ([WhatsApp Help Center](https://faq.whatsapp.com/)).
  2. **Apple iOS 17 / iOS 18 Live Stickers**: Every iPhone user can long-press any face or person in a photo/Live Photo in the native Photos app and tap *Add Sticker* to create animated Live Stickers & GIFs that work in WhatsApp, iMessage, Telegram, and Instagram ([Apple Support: Make stickers from your photos](https://support.apple.com/en-us/105085)).
  3. **Telegram Built-in Sticker Creator & Gboard Pixel Studio**: Telegram's native sticker editor automatically removes backgrounds from face photos/videos, adds white outlines, and exports animated `.webm`/GIF stickers without any third-party app ([Telegram Sticker Editor](https://telegram.org/blog/stickers-revolution)).
- **Why It Should Be Eliminated**: Zero reason for users to leave WhatsApp/iOS native keyboards; awkward fit for the `Skeleton Crew` track (which requires a reusable engineering skeleton supporting two distinct apps); and judges immediately penalize generic AI wrapper toys under the **Potential Impact (20%)** and **Innovation (20%)** criteria.

---

## 2. Six Distinct Candidate Directions (Stage 2 Screening)

> **Epistemic Labeling Key**:
> - **[Fact]**: Verified via official documentation, GitHub repositories, published pricing, or rules.
> - **[Inference]**: Logical engineering or market conclusion derived from verified facts.
> - **[Assumption]**: Hypothesis that requires Stage 3.5 real-world validation to confirm.

---

### Candidate 1: `MetricStageKit` — Monocular 2D + Spec Text to 1:1 Metric 3D Spatial & Volumetric Comparison Skeleton *(Upgraded Teammate Idea 1)*

- **Target Users & Specific Pain Point**:
  - **App 1 Users**: E-commerce shoppers on Shopee, Lazada, AliExpress, Amazon, and Taobao buying bags, desk organizers, mugs, electronics, collectibles, or small appliances who cannot judge real physical size from cropped 2D studio photos and raw `L × W × H` numbers.
  - **App 2 Users**: Budget airline travelers (Ryanair / AirAsia / Scoot personal-item limits), photographers packing camera cubes, and small Shopee/Etsy sellers choosing shipping carton sizes who need to know if multiple items physically fit inside a container without buying and returning them.
- **How Users Currently Solve It**:
  - Mentally guessing from `18cm × 11cm × 7cm` text, grabbing a physical ruler/tape measure at their desk, or manually typing numbers into flat 2D box-comparison websites.
- **Existing Products & Links ([Fact])**:
  1. **Tangiblee** ([https://www.tangiblee.com/](https://www.tangiblee.com/)) — B2B enterprise SaaS for luxury handbag/watch retailers; converts 2D SKU images into on-model and size comparisons next to phones/laptops.
  2. **CompareSizes.com** ([https://comparesizes.com/](https://comparesizes.com/)) & **Size.ly** ([https://www.size.ly/](https://www.size.ly/)) — Manual 3D wireframe box comparison tools.
  3. **Depth Anything V2 / ONNX** ([https://github.com/DepthAnything/Depth-Anything-V2](https://github.com/DepthAnything/Depth-Anything-V2), 9.1k+ stars) — Monocular depth estimation model (produces relative depth maps, not metric-calibrated 1:1 scale comparisons).
- **Shortcomings of Existing Solutions & Evidence ([Fact])**:
  - **Tangiblee** is locked behind enterprise B2B contracts ($1,500–$5,000+/mo for merchant integration) — shoppers cannot use it on Shopee, Taobao, or Amazon listings where sellers haven't installed it.
  - **CompareSizes.com** only draws untextured colored cuboids; you have to manually type every dimension, and it has no product silhouette segmentation, no 2.5D depth relief, and no volumetric container packing.
  - **Raw 2D-to-3D AI generators (TripoSR / Meshy)** take 15–60 seconds on a GPU, hallucinate back-faces, and destroy **metric accuracy** (they output unitless normalized meshes where a 5cm keychain and a 50cm suitcase have the same bounding box `[-1, 1]`).
- **Concrete Improvements We Provide**:
  - **The Skeleton (`packages/metric-stage-skeleton`)**: A client-side + Momen-backed **Metric-Calibrated 2.5D/3D Spatial Engine** that combines:
    1. **DOM / Text Dimension Parser (`Regex + LLM Spec Extractor`)**: Automatically extracts metric dimensions (`mm / cm / in`, `L × W × H`, volume `ml`, weight `g`) from messy Shopee/Amazon product descriptions or pasted text/URLs.
    2. **Silhouette + Monocular Depth Relief Synthesizer**: Converts any 2D product image into a silhouette-cut, depth-extruded 3D relief mesh locked strictly to the exact millimeter bounding box (`L × W × H`).
    3. **Calibrated Reference & Collision Physics Stage**: Interactive Three.js isometric/perspective inspection rig with calibrated reference objects (330ml soda can `66×115mm`, iPhone 16 `147.6×71.6×7.8mm`, ISO ID-1 Credit Card `85.6×53.98mm`, A4 paper, human hand, 120×60cm desk) and 3D AABB/OBB container packing + clearance callouts.
  - **Two Distinct Applications Built on the Skeleton**:
    - **App 1 (`apps/shopscale-3d`)**: **ShopScale 3D (E-Commerce True-Scale Comparator + Chrome Bookmarklet/Extension Mode)** — Inspect any Shopee/Amazon listing in 1:1 3D scale against everyday objects, toggle X-ray measurement calipers, and save/share community-verified SKU scale cards via Momen Headless BaaS.
    - **App 2 (`apps/packfit-3d`)**: **PackFit 3D (Cabin Luggage, Camera Cube & Parcel Box Volumetric Packer)** — Load a target container (e.g., AirAsia 7kg Cabin Bag `56×36×23cm`, Peak Design Camera Cube, or Shopee Parcel Box B) and pack multiple 3D-scaled items inside with real-time volumetric utilization %, collision warnings, and millimeter clearance gauges.
- **Why Users Would Switch**:
  - Works immediately on **any** Shopee/Amazon listing or pasted image+dimensions in <1.5 seconds (no merchant integration required, no waiting 60s for unitless AI meshes).
- **Development Difficulty, Risks & Feasibility**:
  - **Feasibility**: High. Three.js / WebGL + client-side canvas depth/silhouette extrusion + deterministic dimension parser + Momen PostgreSQL/GraphQL for shared product/container libraries.
  - **Main Risk ([Assumption])**: Pure 2D photos shot at steep perspective angles can have slightly skewed silhouettes if not rectified. Mitigation: hybrid mode combining textured 2.5D depth relief + accurate metric CAD primitive proxy (cylinder, rounded box, tapered tote, bottle, electronics slab) with transparent dimension calipers.
- **MVP & Validation Method**:
  - Test against 20 real Shopee / Amazon product listings with known physical dimensions (`L × W × H`); verify 100% millimeter scale accuracy against ISO reference objects and <100ms 3D scene rebuild time.
- **5-Dimension Score**:
  - Practical Value: **9.0/10** (Directly prevents e-commerce size deception & packing mistakes; aligns with teammate's core vision)
  - Innovation: **8.5/10** (Bridges uncalibrated 2D product photos and metric-exact 3D CAD comparison via a reusable spatial skeleton)
  - Competitive Advantage: **8.8/10** (Brings Tangiblee-class sizing to *any* listing for consumers + adds volumetric packing in App 2)
  - User Experience: **9.2/10** (Tactile 3D studio stage, live millimeter calipers, instant reference swapping, high visual impact in <3 min video)
  - Feasibility: **9.0/10** (100% browser-native WebGL + Momen BaaS; zero external GPU bottleneck)

---

### Candidate 2: `FaceStickerGIF` — Real Human Face to Animated Sticker GIF Generator *(Teammate Idea 2 — Evaluated for Elimination)*

- **Target Users & Specific Pain Point**:
  - Casual chat users wanting to turn selfies of themselves or friends into animated reaction GIFs/stickers for WhatsApp, Telegram, or Discord.
- **How Users Currently Solve It ([Fact])**:
  - Directly inside **WhatsApp** (native Selfie Sticker button), **iOS 17/18 Photos** (long-press any face → Add Sticker with Live Photo animation), **Telegram** (built-in sticker cutter with auto-outline and GIF/video trimming), or **Gboard Pixel Studio**.
- **Existing Products & Links ([Fact])**:
  1. **Apple iOS Live Stickers** ([https://support.apple.com/en-us/105085](https://support.apple.com/en-us/105085)) — Pre-installed on 1B+ iPhones; zero-click background removal and animated Live Stickers.
  2. **Telegram Custom Sticker Editor** ([https://telegram.org/blog/stickers-revolution](https://telegram.org/blog/stickers-revolution)) — Built directly into the messenger; cuts faces, adds text/outlines/GIF loops, and adds to packs in 5 seconds.
  3. **Giphy / Tenor / Bitmoji** ([https://giphy.com/create/gifmaker](https://giphy.com/create/gifmaker)) — Established sticker and GIF ecosystems.
- **Shortcomings of Existing Solutions**:
  - Almost none for everyday users. The native OS and chat apps already sit one tap away from the keyboard where stickers are sent.
- **Concrete Improvements We Could Provide**:
  - Web-based face-landmark warping or cartoon shader templates.
- **Why Users Would Switch**:
  - **[Inference]** They wouldn't. Exporting a GIF from an external website and manually importing it into WhatsApp as a sticker pack takes 6–8 steps, whereas WhatsApp/iOS native stickers take 2 taps.
- **Development Difficulty, Risks & Feasibility**:
  - High disqualification/low-score risk in `Skeleton Crew` because a single novelty toy does not naturally justify a clean multi-app software engineering skeleton, and judges penalize redundant consumer wrappers.
- **5-Dimension Score**:
  - Practical Value: **3.5/10** (Solved natively by WhatsApp, iOS, and Telegram)
  - Innovation: **3.0/10** (Commodity feature since 2023–2024)
  - Competitive Advantage: **2.0/10** (Worse friction than native OS keyboards)
  - User Experience: **5.5/10** (Exporting/importing sticker packs across web-to-mobile is painful)
  - Feasibility: **8.0/10** (Easy to build with MediaPipe FaceMesh + GIF.js, but low strategic value)

---

### Candidate 3: `StreamTwinKit` — Deterministic Time-Travel, Frame Scrubbing & Chaos Fault-Injection Skeleton for Streaming Protocols (SSE / WebSocket / Webhook)

- **Target Users & Specific Pain Point**:
  - Frontend & full-stack engineers building AI streaming chat UIs (Server-Sent Events / MCP tool streams), real-time collaborative apps, and webhook consumers who waste hours trying to reproduce intermittent bugs: mid-stream token stalls, malformed partial JSON chunks, out-of-order webhooks, and duplicate retry storms.
- **How Users Currently Solve It**:
  - Writing throwaway `setTimeout` mock scripts, refreshing the live LLM API (spending tokens on every UI reload), or using request-response mock libraries that don't support frame-by-frame timeline scrubbing or chaos injection.
- **Existing Products & Links ([Fact])**:
  1. **Mock Service Worker (MSW)** ([https://github.com/mswjs/msw](https://github.com/mswjs/msw), 16k+ stars) — Industry standard for HTTP mocking, but SSE/WebSocket deterministic timeline replay and chaos fault injection require manual imperative scripting ([MSW Issues on SSE/Streaming](https://github.com/mswjs/msw/issues)).
  2. **Webhook.site / Ngrok Replay** ([https://webhook.site/](https://webhook.site/)) — Captures single webhook payloads, but cannot orchestrate multi-event out-of-order race conditions or clock-skew chaos suites.
- **Concrete Improvements We Provide**:
  - **The Skeleton (`packages/stream-twin-skeleton`)**: A deterministic event-stream tape recorder, millisecond timeline scrubber, state-machine invariant checker, and chaos fault-injector (jitter, chunk fragmentation, drop, reorder, duplicate).
  - **Two Distinct Applications**:
    - **App 1 (`apps/llm-stream-chaos`)**: **AI SSE & MCP Tool-Call Chaos Workbench** — Record or synthesize LLM token/tool-call streams, scrub token-by-token like a video editor, inject chunk splits/stalls, and verify UI parser resilience.
    - **App 2 (`apps/webhook-race-lab`)**: **Payment & Order Webhook Race-Condition Auditor** — Fire concurrent, reordered, and duplicated Stripe/GitHub-style webhook sequences against state machine specs to catch double-credit or state-regression bugs.
- **Development Difficulty, Risks & Feasibility**:
  - **Feasibility**: High. Clean deterministic TypeScript engine + Property-Based Testing (PBT) integration (Directly hits Kiro's PBT judging prompt!).
  - **Main Risk**: Slightly more developer/infra-focused; requires strong visual telemetry (oscilloscope/timeline tracks) so non-infra judges immediately grasp the visual impact.
- **5-Dimension Score**:
  - Practical Value: **8.8/10**
  - Innovation: **8.5/10**
  - Competitive Advantage: **8.6/10**
  - User Experience: **8.3/10**
  - Feasibility: **9.2/10**

---

### Candidate 4: `IsoRigKit` — Spec-Driven Interactive Isometric Technical Dissection & Mechanical Explainer Skeleton

- **Target Users & Specific Pain Point**:
  - Developer advocates, technical writers, hardware/system engineers, and educators who want to publish interactive "Bartosz Ciechanowski / Linear / Stripe Press" style isometric explainers and exploded product teardowns, but only have static diagram tools (Mermaid, Excalidraw) because hand-coding isometric 3D projections, painter's order, and interactive scrubbers takes weeks.
- **Existing Products & Links ([Fact])**:
  1. **Mermaid.js** ([https://github.com/mermaid-js/mermaid](https://github.com/mermaid-js/mermaid), 75k+ stars) — Text-to-diagram, but strictly flat 2D flowcharts with zero physical simulation or exploded-layer inspection.
  2. **Spline** ([https://spline.design/](https://spline.design/)) — GUI-heavy 3D design tool; not spec-driven, cannot be generated deterministically from markdown/JSON specs in git or Kiro IDE.
- **Concrete Improvements We Provide**:
  - **The Skeleton (`packages/isorig-skeleton`)**: A declarative Spec-to-Isometric CAD & Simulation Engine that compiles structured JSON/Kiro Specs into four-tone shaded isometric assemblies with interactive explosion sliders, cross-section planes, and live signal/telemetry flow.
  - **Two Distinct Applications**:
    - **App 1 (`apps/arch-autopsy`)**: **Interactive Distributed System & Protocol Rig** (turns system specs like Raft consensus, rate limiters, or circuit breakers into an interactive mechanical test rig you can fault-inject and step through).
    - **App 2 (`apps/teardown-bench`)**: **Interactive Hardware Anatomy & Exploded BOM Studio** (turns a product component spec into a draggable exploded-view hardware dissection page with tolerance readouts and callout pins).
- **Development Difficulty, Risks & Feasibility**:
  - **Feasibility**: High, and visually breathtaking for judges (**Design 20%** + **Presentation 20%**).
  - **Main Risk**: If the user/teammate strongly prefers an e-commerce / physical-object sizing use case (Idea 1), pure technical diagramming may feel further from their original idea unless combined.
- **5-Dimension Score**:
  - Practical Value: **8.4/10**
  - Innovation: **9.0/10**
  - Competitive Advantage: **8.8/10**
  - User Experience: **9.4/10**
  - Feasibility: **8.8/10**

---

### Candidate 5: `KinemaBrowserKit` — Zero-Install Browser WebGPU/WASM Biomechanical Kinematics & Touchless Control Skeleton

- **Target Users & Specific Pain Point**:
  - Desk workers suffering from "tech neck" / dry-eye fatigue who refuse to install Python/OpenCV scripts, and technicians/home cooks with dirty or gloved hands who need to flip through repair schematics or recipes without touching their laptop.
- **Existing Products & Links ([Fact])**:
  1. **Kiro-InteractionKit (2025 Winner)** ([https://github.com/Harpita-P/Kiro-InteractionKit](https://github.com/Harpita-P/Kiro-InteractionKit)) — Requires local Python virtualenv, OpenCV, and PyGame; cannot run in a browser URL.
  2. **PostureReminder / Mac apps** — Closed-source desktop binaries or basic timers without calibrated biomechanical angle readouts.
- **Concrete Improvements We Provide**:
  - **The Skeleton (`packages/kinema-browser-skeleton`)**: Zero-install browser landmark kinematics + temporal debounce filter + spatial audio feedback engine.
  - **Two Distinct Applications**:
    - **App 1 (`apps/cervical-hud`)**: **Biomechanical Posture & Blink Telemetry Studio**.
    - **App 2 (`apps/touchless-schematic-deck`)**: **Hands-Free Repair Manual & Recipe Navigator**.
- **Development Difficulty, Risks & Feasibility**:
  - **Main Risk**: Because `Kiro-InteractionKit` already won the Kiroween 2025 Grand Prize with webcam gesture tracking, judges in 2026 will likely view another webcam gesture kit as derivative of last year's winner!
- **5-Dimension Score**:
  - Practical Value: **7.8/10**
  - Innovation: **6.5/10** (Penalized due to overlap with 2025 Grand Prize winner)
  - Competitive Advantage: **7.2/10**
  - User Experience: **8.0/10**
  - Feasibility: **8.5/10**

---

### Candidate 6: `ClauseDiffKit` — Local-First Spatial PDF/Spec Redline & Deterministic Constraint Verification Skeleton

- **Target Users & Specific Pain Point**:
  - Freelancers, hardware buyers, and legal/procurement reviewers comparing revised PDFs, quotes, and engineering datasheets who need to catch silent numeric shifts (e.g., Net-30 changed to Net-90, tolerance `±0.05mm` changed to `±0.5mm`, unit price increased by 8%) without uploading confidential documents to cloud AI APIs.
- **Existing Products & Links ([Fact])**:
  1. **pdf-diff** ([https://github.com/serhack/pdf-diff](https://github.com/serhack/pdf-diff)) — CLI-only raster image diff; breaks completely if a paragraph shifts down by 2 lines.
  2. **Draftable** ([https://www.draftable.com/](https://www.draftable.com/)) — Shows text diffs, but has zero semantic/numeric rule validation against a target specification.
- **Concrete Improvements We Provide**:
  - **The Skeleton (`packages/clausediff-skeleton`)**: Client-side PDF/text spatial token extractor + semantic block aligner + deterministic constraint rule engine with bounding-box redline overlays.
  - **Two Distinct Applications**:
    - **App 1 (`apps/freelance-shield`)**: **Freelance Contract & SOW Silent-Trap Auditor**.
    - **App 2 (`apps/bom-quote-verifier`)**: **Engineering Spec & Supplier Quote Discrepancy Inspector**.
- **5-Dimension Score**:
  - Practical Value: **8.6/10**
  - Innovation: **8.0/10**
  - Competitive Advantage: **8.3/10**
  - User Experience: **8.2/10**
  - Feasibility: **8.9/10**

---

## 3. Strict Devil's Advocate Critique (Stage 3 Elimination)

| Question | Candidate 1: `MetricStageKit` (TrueScale 3D + Packing, Teammate Idea 1 Upgraded) | Candidate 2: `FaceStickerGIF` (Teammate Idea 2) | Candidate 3: `StreamTwinKit` (SSE/Webhook Chaos) | Candidate 4: `IsoRigKit` (Spec-to-Isometric Dissection) | Candidate 5: `KinemaBrowserKit` (Webcam Gestures) | Candidate 6: `ClauseDiffKit` (Local Spec/PDF Auditor) |
|---|---|---|---|---|---|---|
| **1. Does this product truly need to exist?** | **Yes.** 99% of Shopee/Amazon listings only have 2D photos + raw dimension strings (`18×12×8cm`), causing high size-expectation mismatch and returns. | **No.** Native OS & chat apps already have 1-tap face-to-sticker built in. | **Yes.** Reproducing SSE mid-stream stalls and webhook race conditions is a daily pain for AI/backend devs. | **Yes.** Interactive isometric technical explainers are high-value but prohibitively slow to code by hand. | **Weak.** Useful, but directly shadows the 2025 Kiroween winner. | **Yes.** Silent numeric edits in quotes and contracts cost freelancers and buyers real money. |
| **2. Why can't existing tools solve it?** | Tangiblee costs $1,500+/mo for merchants; CompareSizes only draws manual untextured boxes; 3D AI generators destroy metric millimeter scale. | WhatsApp, iOS 17/18, and Telegram **already solve it better**. | MSW mocks happy paths well, but lacks a visual frame-scrubber + chaos fault timeline + PBT harness. | Mermaid is flat 2D; Spline is manual GUI and not spec-driven. | Kiro-InteractionKit required local Python/PyGame; however the concept is no longer fresh for Kiroween judges. | Raster PDF diffs break on layout reflows and don't check numeric constraints. |
| **3. Simpler / cheaper / non-AI solution?** | Our core skeleton uses **deterministic regex/unit parsing + metric geometry projection + client-side depth/silhouette map**, using AI only optionally for messy unstructured specs! | Native phone OS long-press subject lift (free, 0 AI credits). | Deterministic seed-based PRNG + protocol frame buffer (no LLM needed to run chaos tests). | Deterministic isometric math + painter's order engine driven by Kiro Specs. | Standard keyboard shortcuts / foot pedals. | Regex + deterministic AST/table diffing on extracted PDF text coordinates. |
| **4. Will users try once and abandon?** | **Low risk** if it includes a 1-click Shopee/Amazon URL/snippet importer + saved comparison workbench & luggage presets. | **Extreme risk.** Users make 1 meme GIF and never open the web app again. | **Low risk** for developers debugging streaming/webhook pipelines. | **Low risk** for technical authors & educators creating explainers. | **High risk** once webcam novelty wears off. | **Low risk** for repeat contract/BOM reviews. |
| **5. Evidence our approach is better?** | Millimeter-exact calibration against ISO reference objects (85.6mm card, 115mm can) + <100ms browser WebGL rendering + volumetric bin-packing in App 2. | None — worse UX than native WhatsApp/iOS. | Property-Based Testing (PBT) catches edge-case stream splits deterministically in milliseconds. | Compiles a 40-line JSON/Kiro Spec into an interactive exploded 3D rig in <1s. | Runs in browser without Python setup, but still derivative of 2025 winner. | 100% local execution with zero cloud NDA leakage + exact bounding-box proof. |
| **6. Fatal assumption that would kill it?** | If users expect full 360° photorealistic neural radiance fields from a single JPEG in 0.1s. **Mitigation**: Position clearly as **Metric-Calibrated 3D Relief & Volumetric CAD Twin** (accurate silhouette + depth extrusion + exact `L×W×H` caliper cage), which is MORE honest and useful for size/fit inspection than hallucinated 3D meshes! | Assuming users don't know WhatsApp/iOS already has native selfie stickers. **(Fatal — Eliminated)** | If judges don't build streaming/webhook apps themselves and find protocol debugging too abstract. | If the spec DSL is too complex to author. | Judges recognizing it as a browser port of the 2025 winner `Kiro-InteractionKit`. **(Eliminated)** | Poor OCR on scanned paper PDFs. |

---

## 4. Comparison Table & Final Recommendation (Stage 4 User Decision)

### Live Deployed Multi-Prototype Decision Lab (Vercel)
- **Public URL (HTTP 200 Verified)**: [https://kiro-hackathon-lake.vercel.app](https://kiro-hackathon-lake.vercel.app)
- Includes 6 live interactive prototypes (`DeskHUD Kit`, `MetricStageKit`, `IsoRigKit`, `StreamTwinKit`, `ClauseDiffKit`, `FaceStickerGIF`) in one unified workspace so the team can test every candidate hands-on.

### Candidate 0 (Master Synthesis of Teammate's New Idea + Idea 1): `DeskHUD Kit` — Cross-Platform Rust/Tauri Ambient HUD & Agentic Clean-Code Skeleton
- **Verified Tech Stack Research ([Fact])**:
  1. **`cjpais/Handy`** ([https://github.com/cjpais/Handy](https://github.com/cjpais/Handy), **39,898 stars**, [https://handy.computer](https://handy.computer)): Cross-platform Windows/macOS/Linux desktop utility built with **Rust + Tauri v2**, global keyboard shortcuts, Silero VAD, and local Whisper / Parakeet V3 speech-to-text.
  2. **`voidzero-dev/vite-plus` (`Vite+`)** ([https://github.com/voidzero-dev/vite-plus](https://github.com/voidzero-dev/vite-plus), **6,652 stars**, [https://viteplus.dev](https://viteplus.dev)): Unified web toolchain (`vp check`, `vp test`, `vp build`) bundling Vite, Vitest, Oxlint, Oxfmt, `tsrs`, and Rolldown.
  3. **`oxc-project/oxc` (`Oxlint`)** ([https://github.com/oxc-project/oxc](https://github.com/oxc-project/oxc), **23,577 stars**): Rust-powered JS/TS linter running 50–100x faster than ESLint, ideal for sub-50ms Kiro agent post-edit hooks.
  4. **`fallow-rs/fallow` (`Fallow`)** ([https://github.com/fallow-rs/fallow](https://github.com/fallow-rs/fallow), **5,397 stars**, [https://fallow.tools](https://fallow.tools)): Rust binary that builds a full repository graph to enforce **0–100 Health Score, cognitive/cyclomatic complexity caps, circular dependency detection, hexagonal/layered architecture boundaries (`fallow guard`), duplication checks, CSS token drift, and dead-code pruning (`fallow audit`)**, with native MCP and agent skills ([`fallow-rs/fallow-skills`](https://github.com/fallow-rs/fallow-skills)).
- **Backend Architecture Recommendation for Agentic Clean-Code Development**:
  1. **Local Win/Mac Native Backend (Rust + Tauri v2 + `tauri-specta`)**:
     - Enforces compile-time IPC contract safety between Rust (`#[tauri::command] #[specta::specta]`) and frontend TypeScript.
     - Guarded by `cargo clippy -- -D warnings -D clippy::unwrap_used` (prevents agent-written `.unwrap()` panics) + `cargo-machete` (dead Rust dependency pruning).
  2. **Full-Stack / Cloud API Backend (`Hono + Zod RPC` or `Rust Axum + SQLx + utoipa` + `Momen Headless BaaS`)**:
     - Pairing **Hono + Zod RPC** with **Mallow/Fallow** allows `npx fallow` to analyze both frontend and backend in **one unified dependency graph**, immediately catching unused API fields or illegal cross-layer imports; while **Momen Headless BaaS (PostgreSQL + GraphQL + WebSocket)** handles persistent multi-user state and ZAI agent workflows.
- **How `DeskHUD Kit` Connects ALL Teammate Ideas into the `Skeleton Crew` Track**:
  - **The Skeleton (`packages/deskhud-core`)**: A reusable **Rust/Tauri v2 + Web Ambient Pill HUD & Agentic Clean-Code Skeleton** with `.kiro/hooks` running `vp check (Oxlint) + fallow audit + cargo clippy`, plus a `Handy`-style shortcut-summoned local voice/context HUD Bot.
  - **App 1 (`apps/pulse-hud`)**: **Agentic Code-Hygiene & Architecture Radar HUD** — Floating desktop HUD that monitors AI coding agents in real time, visualizes Fallow health/circular-dep/complexity metrics, and lets developers hold `Alt+Space` (Handy-style) to command the HUD Bot to refactor flagged hotspots.
  - **App 2 (`apps/scale-hud` — Connects Teammate Idea 1!)**: **Shopee/Amazon 2D-to-3D True-Scale Overlay HUD** — Press the DeskHUD hotkey while viewing any 2D Shopee product listing on Windows/macOS/Web, and the floating HUD pill expands into a **1:1 Millimeter-Calibrated 3D Object & Soda-Can/iPhone Comparator + HUD Buying Bot**!

| Rank | Candidate Direction | Skeleton Core (`packages/*`) | App 1 & App 2 (`apps/*` — 2 Separate Folders) | Practical (10) | Innovation (10) | Moat (10) | UX / Demo (10) | Feasibility (10) | **Total (50)** | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| **#0 (Master Synthesis)** | **Candidate 0: `DeskHUD Kit`** *(串联队友全部想法: 2025冠军模板 + Handy + Oxlint/Vite+/Fallow + Rust + Shopee 3D HUD)* | Cross-Platform Rust/Tauri + Web Ambient HUD, Voice/Shortcut Bot & Agentic Clean-Code Gate (`Oxlint + Vite+ + Fallow + Specta`) | **App 1 (`apps/pulse-hud`)**: Agentic Code-Hygiene & Architecture Radar HUD<br>**App 2 (`apps/scale-hud`)**: Shopee/Amazon 2D→3D True-Scale Overlay HUD | **9.4** | **9.3** | **9.2** | **9.4** | **9.2** | **46.5 / 50** | **Top Master Synthesis (Unifies Every Teammate Idea)** |
| **#1 (Top Rec)** | **Candidate 1: `MetricStageKit`** *(队友 Idea 1 的 Skeleton Crew 升级版)* | Metric 2D-to-3D Relief, Dimension Spec Parser & Spatial Calibration Engine | **App 1 (`apps/shopscale-3d`)**: Shopee/Amazon True-Scale 3D Inspector<br>**App 2 (`apps/packfit-3d`)**: Cabin Luggage & Parcel Box 3D Volumetric Packer | **9.0** | **8.5** | **8.8** | **9.2** | **9.0** | **44.5 / 50** | **Strongly Recommended (Best Pure 3D Spatial Track)** |
| **#2 (Alt Rec)** | **Candidate 4: `IsoRigKit`** | Spec-Driven Isometric 3D/SVG Dissection & Telemetry Simulation Engine | **App 1 (`apps/arch-autopsy`)**: Distributed System Fault Rig<br>**App 2 (`apps/teardown-bench`)**: Hardware Exploded-View BOM Studio | **8.4** | **9.0** | **8.8** | **9.4** | **8.8** | **44.4 / 50** | **Recommended (Highest Visual Craft)** |
| **#3 (Alt Rec)** | **Candidate 3: `StreamTwinKit`** | Deterministic Stream Recording, Timeline Scrubbing & Chaos Injection Skeleton | **App 1 (`apps/llm-stream-chaos`)**: AI SSE/MCP Chaos Workbench<br>**App 2 (`apps/webhook-race-lab`)**: Webhook Idempotency & Race Lab | **8.8** | **8.5** | **8.6** | **8.3** | **9.2** | **43.4 / 50** | **Recommended (Strong DevTool & PBT Showcase)** |
| **#4** | **Candidate 6: `ClauseDiffKit`** | Spatial PDF/Spec Coordinate Aligner & Deterministic Constraint Engine | **App 1 (`apps/freelance-shield`)**: Contract Trap Radar<br>**App 2 (`apps/bom-quote-verifier`)**: BOM & Quote Tolerance Auditor | **8.6** | **8.0** | **8.3** | **8.2** | **8.9** | **42.0 / 50** | Viable Backup |
| **#5** | **Candidate 5: `KinemaBrowserKit`** | Browser WebGPU Landmark Kinematics & Touchless Control Skeleton | **App 1 (`apps/cervical-hud`)**: Posture Telemetry HUD<br>**App 2 (`apps/touchless-schematic-deck`)**: Touchless Repair Manual | 7.8 | 6.5 | 7.2 | 8.0 | 8.5 | 38.0 / 50 | **Eliminated** (Too close to 2025 winner) |
| **#6** | **Candidate 2: `FaceStickerGIF`** *(队友 Idea 2)* | Face Landmark Crop & Animated Sticker GIF Exporter | Single novelty utility | 3.5 | 3.0 | 2.0 | 5.5 | 8.0 | 22.0 / 50 | **Eliminated** (Replaced by native WhatsApp/iOS) |

### Why We Recommend Candidate 1 (`MetricStageKit` — 队友 Idea 1 的 Skeleton Crew 完整升级版)
1. **Perfectly aligns with your teammate's Idea 1 while fixing its structural flaw for `Skeleton Crew`**:
   - Your teammate's core insight ("Shopee 上的商品只有 2D 图，没有 3D 实物和真实尺寸对比，容易买错大小") is a **genuine, universally relatable problem**.
   - However, submitting *only* a single Shopee plugin would violate the `Skeleton Crew` rule (*"Build a skeleton code template... Show us its versatility with two distinct applications from your foundation. Your repo must contain 2 separate repo folders for the 2 separate applications"*).
   - By abstracting the core engine into **`MetricStageKit` (1:1 Metric 3D Spatial & Volumetric Skeleton)** and shipping **App 1 (`shopscale-3d`: Shopee/Amazon 2D商品图转1:1三维实物参照对比台 + 浏览器伴侣插件)** AND **App 2 (`packfit-3d`: 登机箱/背包/快递箱 3D 空间装箱与碰撞检测器)**, you honor your teammate's exact idea *and* nail the `Skeleton Crew` judging criteria 100%!
2. **Maximizes Kiro Feature Scoring (`Technological Implementation 20%`)**:
   - **`.kiro/specs/`**: Spec-driven architecture for the Metric Spatial Engine, Dimension Parser, App 1, and App 2.
   - **`.kiro/hooks/`**: Automated Kiro hooks that validate reference object calibration (`mm` tolerances) and sync schema/specs across both apps whenever a new reference item or container spec is added.
   - **`.kiro/steering/`**: Strict spatial coordinate system (`1 unit = 1 mm`), anti-hallucination metric rules, and shared-skeleton boundary enforcement.
   - **Property-Based Testing (PBT)**: Fast-check property-based tests proving that for *any* arbitrary dimension input (`cm`, `mm`, `inches`, `L×W×H`) and *any* rotation/packing permutation, metric volume conservation and AABB collision invariants hold without floating-point drift!
   - **Momen Headless BaaS Integration**: Persists community-verified Shopee/Amazon SKU 3D scale cards, custom reference objects, and packing manifests via PostgreSQL + Runtime GraphQL.
3. **Key Risks & Mitigations for Candidate 1**:
   - **Risk 1**: Direct scraping of Shopee live pages can hit anti-bot login walls if done server-side.
     - **Mitigation**: Support **3 zero-friction input modes** in App 1: (a) Paste any Shopee/Amazon listing title + spec text + image URL/upload, (b) 1-click Chrome Extension / Bookmarklet overlay that extracts the currently open Shopee/Amazon DOM directly in the user's browser, and (c) Pre-loaded real Shopee/Amazon deceptive-size benchmark catalog for instant judge testing!
   - **Risk 2**: Single-image 3D depth extrusion looks flat from 90° side views if only using a 2D plane.
     - **Mitigation**: Combine **2.5D Monocular Depth Relief** on the front/back faces with **Parametric Volumetric Hulls** (box, cylinder/mug, tapered handbag, bottle, device slab, custom extruded silhouette) + millimeter caliper cage so it looks tactile and physically solid from all 360° orbit angles.
