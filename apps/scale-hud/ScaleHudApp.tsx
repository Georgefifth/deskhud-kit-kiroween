import React, { useState, useEffect, useRef } from 'react';
import {
  parseMetricDimensions,
  packVolumetricContainer,
  type MetricBox3D
} from '../../packages/deskhud-skeleton';
import { Box, Layers, PackageCheck, RotateCw, Sliders } from 'lucide-react';

interface SkuPreset extends MetricBox3D {
  marketplace: string;
  specRaw: string;
  verdictCode: 'SIZE_TRAP' | 'SCALE_OK';
  verdictShort: string;
}

const SKU_PRESETS: SkuPreset[] = [
  {
    id: 'mini-tote',
    name: 'CANVAS_TOTE_MINI',
    marketplace: 'SHOPEE_SG',
    specRaw: '18 x 12 x 7 cm',
    widthMm: 180,
    heightMm: 120,
    depthMm: 70,
    color: '#00F0FF',
    verdictCode: 'SIZE_TRAP',
    verdictShort: 'HEIGHT 120MM = +5MM VS 330ML CAN (NO 13" LAPTOP FIT)'
  },
  {
    id: 'nordic-mug',
    name: 'CERAMIC_MUG_130ML',
    marketplace: 'SHOPEE_MY',
    specRaw: '6.2 x 7.0 x 6.2 cm',
    widthMm: 62,
    heightMm: 70,
    depthMm: 62,
    color: '#FF9F1C',
    verdictCode: 'SIZE_TRAP',
    verdictShort: 'HEIGHT 70MM = 45MM SHORTER THAN 330ML SODA CAN'
  },
  {
    id: 'cyber-dac',
    name: 'POCKET_AUDIO_DAC',
    marketplace: 'AMAZON_US',
    specRaw: '95 x 65 x 50 mm',
    widthMm: 95,
    heightMm: 65,
    depthMm: 50,
    color: '#10B981',
    verdictCode: 'SCALE_OK',
    verdictShort: 'FOOTPRINT 95×50MM ≈ ISO CREDIT CARD (85.6×54MM)'
  },
  {
    id: 'acrylic-riser',
    name: 'DESK_MONITOR_RISER',
    marketplace: 'LAZADA',
    specRaw: '32 x 8.5 x 14.5 cm',
    widthMm: 320,
    heightMm: 85,
    depthMm: 145,
    color: '#A855F7',
    verdictCode: 'SCALE_OK',
    verdictShort: 'SPAN 320MM CLEARS 13" MACBOOK (304MM)'
  }
];

const REFERENCE_OBJS: MetricBox3D[] = [
  { id: 'can330', name: '330ML_CAN (66×115MM)', widthMm: 66, heightMm: 115, depthMm: 66, color: '#FF3366' },
  { id: 'iphone16', name: 'IPHONE_16 (72×148×8MM)', widthMm: 72, heightMm: 148, depthMm: 8, color: '#E2F1FF' },
  { id: 'isocard', name: 'ISO_CARD (86×54×2MM)', widthMm: 86, heightMm: 54, depthMm: 2, color: '#10B981' },
  { id: 'a4sheet', name: 'A4_SHEET (210×2×297MM)', widthMm: 210, heightMm: 2, depthMm: 297, color: '#FDE047' }
];

const CONTAINERS = [
  { id: 'pd-cube', name: 'CAMERA_CUBE_S (290×200×140MM)', widthMm: 290, heightMm: 200, depthMm: 140 },
  { id: 'shopee-s', name: 'PARCEL_BOX_S (250×180×150MM)', widthMm: 250, heightMm: 180, depthMm: 150 },
  { id: 'cabin-7kg', name: 'CABIN_SIZER (400×300×200MM)', widthMm: 400, heightMm: 300, depthMm: 200 }
];

export const ScaleHudApp: React.FC = () => {
  const [subMode, setSubMode] = useState<'scale-stage' | 'packfit-box' | 'exploded-rig'>('scale-stage');
  const [selectedSku, setSelectedSku] = useState<SkuPreset>(SKU_PRESETS[0]);
  const [specInput, setSpecInput] = useState(SKU_PRESETS[0].specRaw);
  const [parseError, setParseError] = useState<string | null>(null);
  const [boxDims, setBoxDims] = useState({ widthMm: 180, heightMm: 120, depthMm: 70 });

  const [yawDeg, setYawDeg] = useState(32);
  const [pitchFactor, setPitchFactor] = useState(0.46);
  const [explodePct, setExplodePct] = useState(55);
  const [activeRefs, setActiveRefs] = useState<string[]>(['can330', 'iphone16']);
  const [selectedContainer, setSelectedContainer] = useState(CONTAINERS[0]);
  const [packedIds, setPackedIds] = useState<string[]>(['mini-tote', 'nordic-mug', 'cyber-dac']);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startYaw: number }>({
    active: false,
    startX: 0,
    startYaw: 32
  });

  const selectPreset = (sku: SkuPreset) => {
    setSelectedSku(sku);
    setSpecInput(sku.specRaw);
    setParseError(null);
    setBoxDims({ widthMm: sku.widthMm, heightMm: sku.heightMm, depthMm: sku.depthMm });
  };

  const handleApplyCustomSpec = (e: React.FormEvent) => {
    e.preventDefault();
    const res = parseMetricDimensions(specInput);
    if (!res.ok || !res.box) {
      setParseError(res.error || 'INVALID_FORMAT');
      return;
    }
    setParseError(null);
    setBoxDims(res.box);
  };

  const toggleRef = (id: string) => {
    setActiveRefs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const togglePacked = (id: string) => {
    setPackedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const packResult = packVolumetricContainer(
    selectedContainer,
    SKU_PRESETS.filter((s) => packedIds.includes(s.id))
  );

  // Render 3D Spatial Viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Obsidian Void
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, W, H);

    const rad = (yawDeg * Math.PI) / 180;
    const scale = subMode === 'packfit-box' ? 0.72 : 0.94;
    const ox = W * 0.46;
    const oy = H * 0.74;

    const project = (x: number, y: number, z: number): [number, number] => {
      const rx = x * Math.cos(rad) - z * Math.sin(rad);
      const rz = x * Math.sin(rad) + z * Math.cos(rad);
      return [ox + rx * scale, oy - y * scale + rz * pitchFactor * scale];
    };

    // 50mm Metric Calibration Floor Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.09)';
    ctx.lineWidth = 1;
    for (let g = -250; g <= 250; g += 50) {
      const [x1, y1] = project(g, 0, -250);
      const [x2, y2] = project(g, 0, 250);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const [z1, zy1] = project(-250, 0, g);
      const [z2, zy2] = project(250, 0, g);
      ctx.beginPath();
      ctx.moveTo(z1, zy1);
      ctx.lineTo(z2, zy2);
      ctx.stroke();
    }

    const drawSolidBox = (
      cx: number,
      cy: number,
      cz: number,
      w: number,
      h: number,
      d: number,
      color: string,
      tag: string,
      wireframe = false,
      reliefSlices = 0
    ) => {
      const hw = w / 2;
      const hd = d / 2;
      const p000 = project(cx - hw, cy, cz - hd);
      const p100 = project(cx + hw, cy, cz - hd);
      const p101 = project(cx + hw, cy, cz + hd);
      const p001 = project(cx - hw, cy, cz + hd);
      const p010 = project(cx - hw, cy + h, cz - hd);
      const p110 = project(cx + hw, cy + h, cz - hd);
      const p111 = project(cx + hw, cy + h, cz + hd);
      const p011 = project(cx - hw, cy + h, cz + hd);

      if (!wireframe) {
        ctx.fillStyle = color + '44';
        ctx.beginPath();
        ctx.moveTo(...p001);
        ctx.lineTo(...p101);
        ctx.lineTo(...p111);
        ctx.lineTo(...p011);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = color + '28';
        ctx.beginPath();
        ctx.moveTo(...p101);
        ctx.lineTo(...p100);
        ctx.lineTo(...p110);
        ctx.lineTo(...p111);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = color + '72';
        ctx.beginPath();
        ctx.moveTo(...p010);
        ctx.lineTo(...p110);
        ctx.lineTo(...p111);
        ctx.lineTo(...p011);
        ctx.closePath();
        ctx.fill();

        // 2.5D Relief Contour Slices
        for (let s = 1; s <= reliefSlices; s++) {
          const k = s * 0.14;
          const r0 = project(cx - hw * (1 - k), cy + h * k, cz + hd + s * 3.5);
          const r1 = project(cx + hw * (1 - k), cy + h * k, cz + hd + s * 3.5);
          const r2 = project(cx + hw * (1 - k), cy + h * (1 - k), cz + hd + s * 3.5);
          const r3 = project(cx - hw * (1 - k), cy + h * (1 - k), cz + hd + s * 3.5);
          ctx.strokeStyle = 'rgba(255,255,255,0.45)';
          ctx.beginPath();
          ctx.moveTo(...r0);
          ctx.lineTo(...r1);
          ctx.lineTo(...r2);
          ctx.lineTo(...r3);
          ctx.closePath();
          ctx.stroke();
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = wireframe ? 1.8 : 1.5;
      const lines: [[number, number], [number, number]][] = [
        [p000, p100], [p100, p101], [p101, p001], [p001, p000],
        [p010, p110], [p110, p111], [p111, p011], [p011, p010],
        [p000, p010], [p100, p110], [p101, p111], [p001, p011]
      ];
      lines.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(...a);
        ctx.lineTo(...b);
        ctx.stroke();
      });

      if (tag) {
        const [lx, ly] = project(cx, cy + h + 14, cz);
        ctx.fillStyle = '#E2F1FF';
        ctx.font = '700 10.5px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(tag, lx, ly);
      }
    };

    if (subMode === 'scale-stage') {
      // Draw Target Product Hull
      drawSolidBox(
        -55,
        0,
        0,
        boxDims.widthMm,
        boxDims.heightMm,
        boxDims.depthMm,
        selectedSku.color,
        `${selectedSku.name} (${boxDims.widthMm}×${boxDims.heightMm}×${boxDims.depthMm}MM)`,
        false,
        3
      );

      // Laser Caliper Line on Front Edge
      const [c1x, c1y] = project(-55 - boxDims.widthMm / 2, 0, boxDims.depthMm / 2 + 24);
      const [c2x, c2y] = project(-55 + boxDims.widthMm / 2, 0, boxDims.depthMm / 2 + 24);
      ctx.strokeStyle = '#00F0FF';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c2x, c2y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#00F0FF';
      ctx.fillText(`SPAN: ${boxDims.widthMm}MM`, (c1x + c2x) / 2, (c1y + c2y) / 2 + 14);

      // Draw Active Reference Objects with staggered Z and clean callout spacing
      let rx = boxDims.widthMm / 2 + 65;
      REFERENCE_OBJS.filter((r) => activeRefs.includes(r.id)).forEach((ref, idx) => {
        const zOffset = idx % 2 === 0 ? -35 : 45;
        drawSolidBox(rx, 0, zOffset, ref.widthMm, ref.heightMm, ref.depthMm, ref.color, ref.name, false, 0);
        rx += ref.widthMm + 92;
      });
    } else if (subMode === 'packfit-box') {
      // Draw Container Cage
      drawSolidBox(
        0,
        0,
        0,
        selectedContainer.widthMm,
        selectedContainer.heightMm,
        selectedContainer.depthMm,
        '#64748B',
        selectedContainer.name,
        true,
        0
      );

      // Draw Packed Items
      packResult.placements.forEach((p) => {
        drawSolidBox(
          p.xMm,
          p.yMm,
          p.zMm,
          p.item.widthMm,
          p.item.heightMm,
          p.item.depthMm,
          p.overflowsContainer ? '#FF3366' : p.item.color,
          `${p.overflowsContainer ? 'OVERFLOW ' : ''}${p.item.widthMm}×${p.item.heightMm}MM`,
          false,
          0
        );
      });
    } else {
      // SubMode 3: Exploded Isometric CAD Assembly Rig with Right-Hand Leader Callouts
      const layers = [
        { name: 'L0_MAGNESIUM_CHASSIS (±0.04MM)', h: 22, color: '#0284C7', zIndex: 0 },
        { name: 'L1_VAPOR_THERMAL_PLATE (58°C)', h: 15, color: '#FF9F1C', zIndex: 1 },
        { name: 'L2_DEPTH_CMOS_ARRAY (±0.01MM)', h: 16, color: '#10B981', zIndex: 2 },
        { name: 'L3_OPTICAL_BEZEL_RING (IP67)', h: 14, color: '#00F0FF', zIndex: 3 }
      ];
      const gap = Math.max(28, explodePct * 0.72);
      layers.forEach((layer) => {
        const yPos = layer.zIndex * (20 + gap);
        drawSolidBox(-35, yPos, 0, 165 - layer.zIndex * 10, layer.h, 125 - layer.zIndex * 8, layer.color, '', false, 0);
        const [px, py] = project(55, yPos + layer.h / 2, 0);
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 48, py);
        ctx.stroke();
        ctx.fillStyle = '#E2F1FF';
        ctx.font = '700 10.5px "IBM Plex Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(layer.name, px + 54, py + 3);
      });
    }
  }, [subMode, boxDims, yawDeg, pitchFactor, explodePct, activeRefs, selectedSku, selectedContainer, packResult]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '12px', height: '100%', minHeight: 0 }}>
      {/* Left 75%: Interactive 3D Viewport */}
      <div
        style={{
          background: '#050608',
          border: '1px solid rgba(0, 240, 255, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Sub-Mode Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.14)',
            background: 'rgba(11, 15, 23, 0.88)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px'
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              data-testid="scale-submode-stage"
              onClick={() => setSubMode('scale-stage')}
              style={{
                background: subMode === 'scale-stage' ? '#00F0FF' : '#0B0F17',
                color: subMode === 'scale-stage' ? '#050608' : '#94A3B8',
                border: '1px solid rgba(0,240,255,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              01 // 1:1 SCALE STAGE
            </button>
            <button
              data-testid="scale-submode-packfit"
              onClick={() => setSubMode('packfit-box')}
              style={{
                background: subMode === 'packfit-box' ? '#10B981' : '#0B0F17',
                color: subMode === 'packfit-box' ? '#050608' : '#94A3B8',
                border: '1px solid rgba(16,185,129,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              02 // PACKFIT 3D BOX
            </button>
            <button
              data-testid="scale-submode-rig"
              onClick={() => setSubMode('exploded-rig')}
              style={{
                background: subMode === 'exploded-rig' ? '#FF9F1C' : '#0B0F17',
                color: subMode === 'exploded-rig' ? '#050608' : '#94A3B8',
                border: '1px solid rgba(255,159,28,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              03 // EXPLODED CAD RIG
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8' }}>
            <span>ORBIT: {yawDeg}°</span>
            <input
              type="range"
              min={-180}
              max={180}
              value={yawDeg}
              onChange={(e) => setYawDeg(Number(e.target.value))}
              style={{ width: '90px' }}
            />
            {subMode === 'exploded-rig' && (
              <>
                <span>EXPLODE: {explodePct}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  style={{ width: '80px' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Drag-to-Orbit 3D Canvas */}
        <div style={{ flex: 1, position: 'relative', minHeight: '340px' }}>
          <canvas
            ref={canvasRef}
            width={780}
            height={440}
            onMouseDown={(e) => {
              dragRef.current = { active: true, startX: e.clientX, startYaw: yawDeg };
            }}
            onMouseMove={(e) => {
              if (!dragRef.current.active) return;
              const delta = e.clientX - dragRef.current.startX;
              setYawDeg(Math.max(-180, Math.min(180, Math.round(dragRef.current.startYaw + delta * 0.6))));
            }}
            onMouseUp={() => {
              dragRef.current.active = false;
            }}
            onMouseLeave={() => {
              dragRef.current.active = false;
            }}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
          />

          {/* Bottom Telemetry Callout Banner */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              right: '12px',
              bottom: '12px',
              background: 'rgba(9, 12, 18, 0.92)',
              border: `1px solid ${
                subMode === 'packfit-box'
                  ? packResult.hasOverflow
                    ? '#FF3366'
                    : '#10B981'
                  : selectedSku.verdictCode === 'SIZE_TRAP'
                  ? '#FF9F1C'
                  : '#10B981'
              }`,
              padding: '8px 12px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {subMode === 'scale-stage' && (
              <>
                <span style={{ color: selectedSku.verdictCode === 'SIZE_TRAP' ? '#FF9F1C' : '#10B981', fontWeight: 700 }}>
                  [{selectedSku.verdictCode}] {selectedSku.verdictShort}
                </span>
                <span style={{ color: '#64748B' }}>DRAG CANVAS TO ORBIT 360°</span>
              </>
            )}
            {subMode === 'packfit-box' && (
              <>
                <span style={{ color: packResult.hasOverflow ? '#FF3366' : '#10B981', fontWeight: 700 }}>
                  VOLUME UTILIZATION: {packResult.utilizationPct}% ({packResult.packedVolumeCm3} / {packResult.containerVolumeCm3} CM³)
                </span>
                <span style={{ color: packResult.hasOverflow ? '#FF3366' : '#E2F1FF' }}>
                  {packResult.hasOverflow ? '✗ CONTAINER BOUNDS EXCEEDED' : `✓ TOP CLEARANCE: +${packResult.clearanceTopMm}MM`}
                </span>
              </>
            )}
            {subMode === 'exploded-rig' && (
              <>
                <span style={{ color: '#00F0FF', fontWeight: 700 }}>
                  ISOMETRIC CAD RIG // 4 LAYERS · EXPLOSION FACTOR {explodePct}%
                </span>
                <span style={{ color: '#10B981' }}>TOLERANCE: ±0.01MM VERIFIED</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right 350px Surgical Control Dock */}
      <div
        style={{
          background: '#090C12',
          border: '1px solid rgba(0, 240, 255, 0.18)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontFamily: 'IBM Plex Mono, monospace'
        }}
      >
        {subMode === 'scale-stage' ? (
          <>
            <div>
              <div style={{ fontSize: '10px', color: '#00F0FF', marginBottom: '6px' }}>01 // SELECT E-COMMERCE SKU TWIN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {SKU_PRESETS.map((sku) => (
                  <button
                    key={sku.id}
                    onClick={() => selectPreset(sku)}
                    style={{
                      textAlign: 'left',
                      background: selectedSku.id === sku.id ? 'rgba(0, 240, 255, 0.12)' : '#050608',
                      border: `1px solid ${ selectedSku.id === sku.id ? '#00F0FF' : 'rgba(255,255,255,0.08)' }`,
                      padding: '8px 10px',
                      color: '#E2F1FF',
                      cursor: 'pointer',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{sku.name}</span>
                      <span style={{ color: sku.verdictCode === 'SIZE_TRAP' ? '#FF9F1C' : '#10B981', fontSize: '10px' }}>
                        {sku.marketplace}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                      {sku.widthMm} × {sku.heightMm} × {sku.depthMm} MM
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Spec Input with Validation */}
            <form onSubmit={handleApplyCustomSpec}>
              <div style={{ fontSize: '10px', color: '#10B981', marginBottom: '6px' }}>
                02 // PARSE CUSTOM DIMENSIONS (MM / CM / IN)
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  data-testid="metric-spec-input"
                  type="text"
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  placeholder="e.g. 24 x 15 x 9 cm"
                  style={{
                    flex: 1,
                    background: '#050608',
                    border: `1px solid ${ parseError ? '#FF3366' : 'rgba(0,240,255,0.3)' }`,
                    padding: '7px 10px',
                    color: '#E2F1FF',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '11px'
                  }}
                />
                <button
                  data-testid="metric-parse-btn"
                  type="submit"
                  style={{
                    background: '#00F0FF',
                    color: '#050608',
                    border: 'none',
                    padding: '7px 12px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  EXTRUDE
                </button>
              </div>
              {parseError && (
                <div
                  data-testid="metric-parse-error"
                  style={{
                    marginTop: '6px',
                    padding: '6px 8px',
                    background: 'rgba(255, 51, 102, 0.14)',
                    border: '1px solid #FF3366',
                    color: '#FF3366',
                    fontSize: '10px'
                  }}
                >
                  {parseError}
                </div>
              )}
            </form>

            <div>
              <div style={{ fontSize: '10px', color: '#FF9F1C', marginBottom: '6px' }}>03 // TOGGLE ISO REFERENCE OBJECTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {REFERENCE_OBJS.map((ref) => {
                  const on = activeRefs.includes(ref.id);
                  return (
                    <button
                      key={ref.id}
                      onClick={() => toggleRef(ref.id)}
                      style={{
                        textAlign: 'left',
                        background: on ? 'rgba(16, 185, 129, 0.14)' : '#050608',
                        border: `1px solid ${ on ? '#10B981' : 'rgba(255,255,255,0.08)' }`,
                        padding: '7px 10px',
                        color: on ? '#10B981' : '#94A3B8',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {on ? '[ON] ' : '[OFF] '} {ref.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : subMode === 'packfit-box' ? (
          <>
            <div>
              <div style={{ fontSize: '10px', color: '#10B981', marginBottom: '6px' }}>01 // SELECT TARGET CONTAINER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {CONTAINERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContainer(c)}
                    style={{
                      textAlign: 'left',
                      background: selectedContainer.id === c.id ? 'rgba(16,185,129,0.16)' : '#050608',
                      border: `1px solid ${ selectedContainer.id === c.id ? '#10B981' : 'rgba(255,255,255,0.08)' }`,
                      padding: '8px 10px',
                      color: '#E2F1FF',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '10.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#00F0FF', marginBottom: '6px' }}>02 // ITEMS IN 3D PACKING MANIFEST</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {SKU_PRESETS.map((sku) => {
                  const packed = packedIds.includes(sku.id);
                  return (
                    <button
                      key={sku.id}
                      onClick={() => togglePacked(sku.id)}
                      style={{
                        textAlign: 'left',
                        background: packed ? 'rgba(0,240,255,0.14)' : '#050608',
                        border: `1px solid ${ packed ? '#00F0FF' : 'rgba(255,255,255,0.08)' }`,
                        padding: '8px 10px',
                        color: packed ? '#E2F1FF' : '#64748B',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      {packed ? '✓ PACKED: ' : '+ ADD: '} {sku.name} ({sku.widthMm}×{sku.heightMm}MM)
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: '10px', color: '#FF9F1C', marginBottom: '6px' }}>01 // EXPLODED CAD LAYER TELEMETRY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px' }}>
                <div style={{ background: '#050608', border: '1px solid #00F0FF', padding: '8px 10px' }}>
                  <div style={{ color: '#00F0FF', fontWeight: 700 }}>L3 // OPTICAL_BEZEL_RING</div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>6061-T6 AL · IP67 SEAL · ±0.03MM</div>
                </div>
                <div style={{ background: '#050608', border: '1px solid #10B981', padding: '8px 10px' }}>
                  <div style={{ color: '#10B981', fontWeight: 700 }}>L2 // DEPTH_CMOS_ARRAY</div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>IMX-DEPTH · 60FPS · ±0.01MM</div>
                </div>
                <div style={{ background: '#050608', border: '1px solid #FF9F1C', padding: '8px 10px' }}>
                  <div style={{ color: '#FF9F1C', fontWeight: 700 }}>L1 // VAPOR_THERMAL_PLATE</div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>SINTERED CU · 58°C NOMINAL</div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#FF3366', marginBottom: '6px' }}>02 // BOM & CLAUSE REDLINE GUARD</div>
              <div style={{ background: 'rgba(255,51,102,0.12)', border: '1px solid #FF3366', padding: '8px 10px', fontSize: '10.5px', color: '#FECACA' }}>
                ✗ SUPPLIER QUOTE DRIFT CAUGHT:<br />
                Bore tolerance shifted <del>±0.01mm</del> → <strong>±0.25mm</strong>; Net-30 shifted to <strong>Net-90</strong>.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
