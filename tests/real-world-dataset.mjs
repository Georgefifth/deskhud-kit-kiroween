import fs from 'node:fs';
import path from 'node:path';

// Real-World Validation Dataset (18 Cases across Basic, Intermediate, Advanced, Edge, Negative, Adversarial)
// Ground-truth derived from ISO 7810, Coca-Cola 330ml spec, Apple iPhone 16 spec, Shopee/Amazon/IKEA listings, and IATA/AirAsia cabin rules.
export const REAL_WORLD_DATASET = [
  {
    id: 'RW-01',
    tier: 'Basic',
    source: 'ISO/IEC 7810 ID-1 Standard Credit Card (https://www.iso.org/standard/70484.html)',
    input: '85.60 x 53.98 x 0.76 mm',
    expectedOk: true,
    expectedMm: { widthMm: 86, heightMm: 54, depthMm: 1 }
  },
  {
    id: 'RW-02',
    tier: 'Basic',
    source: 'Apple iPhone 16 Official Tech Specs (https://www.apple.com/iphone-16/specs/)',
    input: '147.6 x 71.6 x 7.8 mm',
    expectedOk: true,
    expectedMm: { widthMm: 148, heightMm: 72, depthMm: 8 }
  },
  {
    id: 'RW-03',
    tier: 'Basic',
    source: 'Shopee SG Canvas Mini Tote Listing',
    input: '18 x 12 x 7 cm',
    expectedOk: true,
    expectedMm: { widthMm: 180, heightMm: 120, depthMm: 70 }
  },
  {
    id: 'RW-04',
    tier: 'Basic',
    source: 'US Letter / Parcel Box in Inches',
    input: '10 x 6 x 4 in',
    expectedOk: true,
    expectedMm: { widthMm: 254, heightMm: 152, depthMm: 102 }
  },
  {
    id: 'RW-05',
    tier: 'Intermediate',
    source: 'Shopee MY Nordic Mug Spec String with Prefix/Suffix',
    input: 'Product Size: Approx. L6.2cm * W7.0cm * H6.2cm (Manual measurement)',
    expectedOk: true,
    expectedMm: { widthMm: 62, heightMm: 70, depthMm: 62 }
  },
  {
    id: 'RW-06',
    tier: 'Intermediate',
    source: 'Amazon US Product Details String with Weight Suffix',
    input: 'Product Dimensions: 32 x 8.5 x 14.5 cm; 680 Grams',
    expectedOk: true,
    expectedMm: { widthMm: 320, heightMm: 85, depthMm: 145 }
  },
  {
    id: 'RW-07',
    tier: 'Intermediate',
    source: 'AirAsia Cabin Baggage Official Limit (https://support.airasia.com/)',
    input: 'Cabin bag must not exceed 56cm x 36cm x 23cm',
    expectedOk: true,
    expectedMm: { widthMm: 560, heightMm: 360, depthMm: 230 }
  },
  {
    id: 'RW-08',
    tier: 'Advanced',
    source: 'AliExpress Listing Mixing cm and mm Across Axes',
    input: 'Width 18cm x Height 120mm x Depth 7cm',
    expectedOk: true,
    expectedMm: { widthMm: 180, heightMm: 120, depthMm: 70 }
  },
  {
    id: 'RW-09',
    tier: 'Advanced',
    source: 'E-Commerce Title with Model Number & Pack Count Prefix (Adversarial Number Trap)',
    input: 'Model 2026-X99, Pack of 2, Size: 22 x 14 x 8 cm',
    expectedOk: true,
    expectedMm: { widthMm: 220, heightMm: 140, depthMm: 80 }
  },
  {
    id: 'RW-10',
    tier: 'Advanced',
    source: 'Unicode Multiplication Sign (×) and Fullwidth Separators',
    input: '尺寸：25.0 × 18.0 × 15.0 cm',
    expectedOk: true,
    expectedMm: { widthMm: 250, heightMm: 180, depthMm: 150 }
  },
  {
    id: 'RW-11',
    tier: 'Edge',
    source: 'Minimum 1mm Micro SMD Component Boundary',
    input: '1 x 1 x 1 mm',
    expectedOk: true,
    expectedMm: { widthMm: 1, heightMm: 1, depthMm: 1 }
  },
  {
    id: 'RW-12',
    tier: 'Edge',
    source: 'Maximum 3000mm Stage Upper Boundary',
    input: '300 x 200 x 150 cm',
    expectedOk: true,
    expectedMm: { widthMm: 3000, heightMm: 2000, depthMm: 1500 }
  },
  {
    id: 'RW-13',
    tier: 'Edge',
    source: 'Out-of-Bounds Shipping Container (40ft Container > 3000mm Limit)',
    input: '12192 x 2438 x 2591 mm',
    expectedOk: false
  },
  {
    id: 'RW-14',
    tier: 'Negative',
    source: 'Apparel Listing Without Metric Dimensions',
    input: 'Free Size — Fits S/M/L comfortably, 100% Cotton',
    expectedOk: false
  },
  {
    id: 'RW-15',
    tier: 'Negative',
    source: 'Single Axis / Weight-Only String',
    input: 'Net Weight: 450g, Capacity: 500ml',
    expectedOk: false
  },
  {
    id: 'RW-16',
    tier: 'Negative',
    source: 'Negative Dimension Input',
    input: '-18 x 12 x 7 cm',
    expectedOk: false
  },
  {
    id: 'RW-17',
    tier: 'Adversarial',
    source: 'Zero-Value Axis Input',
    input: '18 x 0 x 7 cm',
    expectedOk: false
  },
  {
    id: 'RW-18',
    tier: 'Adversarial',
    source: 'XSS / Script Tag Injection Attempt inside Spec Input',
    input: '<script>alert(1)</script> 15 x 10 x 5 cm',
    expectedOk: true,
    expectedMm: { widthMm: 150, heightMm: 100, depthMm: 50 }
  }
];
