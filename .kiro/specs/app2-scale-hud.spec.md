# Spec: App 2 — `ScaleHUD` (`apps/scale-hud`)

## 1. Overview
`ScaleHUD` is the second distinct application built on `packages/deskhud-skeleton`. When a user browses 2D e-commerce listings (Shopee, Amazon, AliExpress) or plans luggage/parcel packing, pressing `Alt+S` summons the DeskHUD spatial viewport to render a **1:1 millimeter-calibrated 3D relief twin** alongside everyday physical references and a **3D volumetric container packer**.

## 2. Core Capabilities
- **ShopScale 3D Comparator**: Extrudes 2D product imagery + parsed `L×W×H` specs into an interactive 360° 3D hull alongside a 330ml Soda Can (`66×115mm`), iPhone 16 (`71.6×147.6×7.8mm`), ISO Credit Card (`85.6×54mm`), and A4 Sheet (`210×297mm`).
- **PackFit 3D Volumetric Packer**: Packs multiple 3D items into cabin luggage sizers or Shopee shipping boxes with real-time volumetric utilization % and millimeter overflow detection.
- **Interactive Isometric Dissection & Clause Guard Drawer**: Inspects exploded mechanical layers and spec tolerances on the same spatial stage.
