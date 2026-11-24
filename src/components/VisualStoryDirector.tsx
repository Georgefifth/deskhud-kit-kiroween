import React, { useState, useEffect } from 'react';
import { Play, Pause, Maximize2 } from 'lucide-react';

interface StoryNode {
  id: number;
  code: string;
  title: string;
  metric: string;
  cx: number;
  cy: number;
  zoom: number;
  accent: string;
  beforeVal: string;
  afterVal: string;
}

const STORY_NODES: StoryNode[] = [
  {
    id: 0,
    code: '00 // OVERVIEW',
    title: 'ONE SKELETON → TWO APPS',
    metric: 'KIROWEEN SKELETON CREW',
    cx: 500,
    cy: 250,
    zoom: 1.0,
    accent: '#00F0FF',
    beforeVal: 'RAW BOILERPLATE',
    afterVal: 'DESKHUD CORE + 2 APPS'
  },
  {
    id: 1,
    code: '01 // TRIGGER',
    title: 'HANDY SHORTCUT & VOICE PILL',
    metric: 'ALT+SPACE · LOCAL WHISPER',
    cx: 170,
    cy: 250,
    zoom: 1.85,
    accent: '#FF9F1C',
    beforeVal: '7-STEP CONTEXT SWITCH',
    afterVal: '1-KEY AMBIENT OVERLAY'
  },
  {
    id: 2,
    code: '02 // AGENTIC GATE',
    title: 'OXLINT + VITE+ + FALLOW + CLIPPY',
    metric: '14MS AST · 0 CYCLES · SPECTA IPC',
    cx: 460,
    cy: 250,
    zoom: 1.85,
    accent: '#10B981',
    beforeVal: 'HEALTH 52/100 (3 CYCLES)',
    afterVal: 'HEALTH 98/100 (DAG CLEAN)'
  },
  {
    id: 3,
    code: '03 // APP 1 & APP 2',
    title: 'PULSE_HUD + SCALE_HUD 3D',
    metric: '1MM CALIBRATED · 250 PBT SEEDS',
    cx: 790,
    cy: 250,
    zoom: 1.75,
    accent: '#A855F7',
    beforeVal: '2D PHOTO SIZE DECEPTION',
    afterVal: '1:1 3D TWIN + PACKFIT BOX'
  }
];

interface Props {
  onJumpToApp: (app: 'pulse-hud' | 'scale-hud') => void;
}

export const VisualStoryDirector: React.FC<Props> = ({ onJumpToApp }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STORY_NODES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = STORY_NODES[activeStep];

  // Compute SVG viewBox camera transform from cx, cy, zoom
  const baseW = 1000;
  const baseH = 500;
  const vw = baseW / current.zoom;
  const vh = baseH / current.zoom;
  const vx = Math.max(0, Math.min(baseW - vw, current.cx - vw / 2));
  const vy = Math.max(0, Math.min(baseH - vh, current.cy - vh / 2));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '12px', height: '100%', minHeight: 0 }}>
      {/* Left: Animated Camera-Rig Architecture & Data-Flow Blueprint */}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.14)',
            background: 'rgba(11, 15, 23, 0.9)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#00F0FF', fontWeight: 700 }}>CAMERA RIG // {current.code}</span>
            <span style={{ color: '#94A3B8' }}>ZOOM: {current.zoom.toFixed(2)}x</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              data-testid="story-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? '#FF3366' : '#00F0FF',
                color: '#050608',
                border: 'none',
                padding: '5px 12px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              {isPlaying ? 'PAUSE CAMERA RIG' : 'AUTO-PAN CAMERA RIG'}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setActiveStep(0); }}
              style={{
                background: '#0B0F17',
                color: '#E2F1FF',
                border: '1px solid rgba(0,240,255,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Maximize2 size={12} /> FULL BLUEPRINT
            </button>
          </div>
        </div>

        {/* Smoothly Animated Camera ViewBox SVG */}
        <div style={{ flex: 1, position: 'relative', minHeight: '340px' }}>
          <svg
            viewBox={`${vx} ${vy} ${vw} ${vh}`}
            width="100%"
            height="100%"
            style={{ transition: 'viewBox 0.6s cubic-bezier(0.22, 1, 0.36, 1)', display: 'block', background: '#050608' }}
          >
            <defs>
              <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,240,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="1000" height="500" fill="url(#archGrid)" />

            {/* Signal Bus Wires */}
            <path
              d="M 260 250 L 350 250"
              stroke={activeStep === 1 || activeStep === 0 ? '#FF9F1C' : '#1E293B'}
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            <path
              d="M 570 250 L 680 155"
              stroke={activeStep === 2 || activeStep === 3 || activeStep === 0 ? '#00F0FF' : '#1E293B'}
              strokeWidth="3"
            />
            <path
              d="M 570 250 L 680 345"
              stroke={activeStep === 2 || activeStep === 3 || activeStep === 0 ? '#10B981' : '#1E293B'}
              strokeWidth="3"
            />

            {/* NODE 1: Handy Input Layer */}
            <g
              transform="translate(70, 175)"
              onClick={() => { setIsPlaying(false); setActiveStep(1); }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="0"
                y="0"
                width="190"
                height="150"
                fill="#0B0F17"
                stroke={activeStep === 1 ? '#FF9F1C' : 'rgba(255,159,28,0.4)'}
                strokeWidth={activeStep === 1 ? '3' : '1.5'}
              />
              <text x="16" y="28" fill="#FF9F1C" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono">
                01 // INPUT LAYER
              </text>
              <text x="16" y="54" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Space Grotesk">
                Handy HUD Pill
              </text>
              <text x="16" y="80" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono">
                • Alt+Space / Alt+S
              </text>
              <text x="16" y="100" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono">
                • Rust Tauri v2 Tray
              </text>
              <text x="16" y="120" fill="#10B981" fontSize="11" fontFamily="IBM Plex Mono">
                • Local Whisper STT
              </text>
            </g>

            {/* NODE 2: Core Skeleton & Kiro Clean Gate */}
            <g
              transform="translate(350, 145)"
              onClick={() => { setIsPlaying(false); setActiveStep(2); }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="0"
                y="0"
                width="220"
                height="210"
                fill="#0B0F17"
                stroke={activeStep === 2 ? '#10B981' : 'rgba(16,185,129,0.45)'}
                strokeWidth={activeStep === 2 ? '3.5' : '1.5'}
              />
              <text x="16" y="28" fill="#10B981" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono">
                02 // SKELETON CORE (.kiro)
              </text>
              <text x="16" y="54" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Space Grotesk">
                packages/deskhud-skeleton
              </text>
              <rect x="16" y="70" width="188" height="32" fill="#050608" stroke="rgba(0,240,255,0.3)" />
              <text x="26" y="90" fill="#00F0FF" fontSize="11" fontFamily="IBM Plex Mono">
                Vite+ (vp check) + Oxlint
              </text>
              <rect x="16" y="110" width="188" height="32" fill="#050608" stroke="rgba(16,185,129,0.3)" />
              <text x="26" y="130" fill="#10B981" fontSize="11" fontFamily="IBM Plex Mono">
                Fallow DAG & Dead-Code
              </text>
              <rect x="16" y="150" width="188" height="32" fill="#050608" stroke="rgba(255,159,28,0.3)" />
              <text x="26" y="170" fill="#FF9F1C" fontSize="11" fontFamily="IBM Plex Mono">
                Rust Clippy + Specta IPC
              </text>
            </g>

            {/* NODE 3A: App 1 (apps/pulse-hud) */}
            <g
              transform="translate(680, 75)"
              onClick={() => onJumpToApp('pulse-hud')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="0"
                y="0"
                width="245"
                height="150"
                fill="#0B0F17"
                stroke="#00F0FF"
                strokeWidth={activeStep === 3 ? '3' : '1.5'}
              />
              <text x="16" y="26" fill="#00F0FF" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono">
                FOLDER 1 // apps/pulse-hud
              </text>
              <text x="16" y="52" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Space Grotesk">
                App 1: PulseHUD Studio
              </text>
              <text x="16" y="78" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono">
                • Force-Directed AST Graph
              </text>
              <text x="16" y="98" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono">
                • 1-Click Kiro Hook Heal
              </text>
              <text x="16" y="126" fill="#00F0FF" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono">
                [CLICK TO LAUNCH APP 1 →]
              </text>
            </g>

            {/* NODE 3B: App 2 (apps/scale-hud) */}
            <g
              transform="translate(680, 275)"
              onClick={() => onJumpToApp('scale-hud')}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="0"
                y="0"
                width="245"
                height="150"
                fill="#0B0F17"
                stroke="#10B981"
                strokeWidth={activeStep === 3 ? '3' : '1.5'}
              />
              <text x="16" y="26" fill="#10B981" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono">
                FOLDER 2 // apps/scale-hud
              </text>
              <text x="16" y="52" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="Space Grotesk">
                App 2: ScaleHUD 3D & PackFit
              </text>
              <text x="16" y="78" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono">
                • Shopee 2D→3D 1:1 Calipers
              </text>
              <text x="16" y="98" fill="#94A3B8" fontSize="11" fontFamily="IBM Plex Mono">
                • 3D Cabin & Box Packer
              </text>
              <text x="16" y="126" fill="#10B981" fontSize="11" fontWeight="700" fontFamily="IBM Plex Mono">
                [CLICK TO LAUNCH APP 2 →]
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Right: Camera Step Selector & Visual Before/After Telemetry */}
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
        <div style={{ fontSize: '10px', color: '#00F0FF', fontWeight: 700 }}>
          CAMERA SHOT LIST (CLICK NODE TO ZOOM)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {STORY_NODES.map((node) => {
            const active = activeStep === node.id;
            return (
              <button
                key={node.id}
                onClick={() => { setIsPlaying(false); setActiveStep(node.id); }}
                style={{
                  textAlign: 'left',
                  background: active ? 'rgba(0, 240, 255, 0.14)' : '#050608',
                  border: `1px solid ${ active ? node.accent : 'rgba(255,255,255,0.08)' }`,
                  padding: '10px',
                  color: '#E2F1FF',
                  cursor: 'pointer',
                  fontFamily: 'IBM Plex Mono, monospace'
                }}
              >
                <div style={{ fontSize: '10px', color: node.accent, fontWeight: 700 }}>{node.code}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '3px' }}>{node.title}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{node.metric}</div>
              </button>
            );
          })}
        </div>

        {/* Before / After Visual Metric Card */}
        <div style={{ background: '#050608', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', marginTop: 'auto' }}>
          <div style={{ fontSize: '9px', color: '#64748B', marginBottom: '6px' }}>BEFORE / AFTER DELTA</div>
          <div style={{ fontSize: '11px', color: '#FF3366', marginBottom: '6px' }}>
            ✗ BEFORE: {current.beforeVal}
          </div>
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
            ✓ AFTER: {current.afterVal}
          </div>
        </div>
      </div>
    </div>
  );
};
