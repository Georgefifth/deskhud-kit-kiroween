import React, { useState, useEffect, useRef } from 'react';
import {
  analyzeCodeGraph,
  type ModuleNode,
  type DependencyEdge
} from '../../packages/deskhud-skeleton';
import { recordAuditRunToMomen, type WsFrameLog } from '../../src/momenClient';
import { Sparkles, RotateCcw } from 'lucide-react';

const DIRTY_NODES: ModuleNode[] = [
  { id: 'hudView', label: 'hudView.tsx', layer: 'ui', x: 0.22, y: 0.28, cyclomatic: 9, cognitive: 14, deadExports: ['legacyBadgeStyle'], hasRustUnwrap: false, loc: 142 },
  { id: 'overlayCtrl', label: 'overlayController.ts', layer: 'controller', x: 0.52, y: 0.22, cyclomatic: 18, cognitive: 34, deadExports: ['deprecatedSyncState', 'unusedVoiceBuf'], hasRustUnwrap: false, loc: 218 },
  { id: 'stateStore', label: 'stateStore.ts', layer: 'controller', x: 0.38, y: 0.62, cyclomatic: 7, cognitive: 11, deadExports: [], hasRustUnwrap: false, loc: 96 },
  { id: 'skeletonIpc', label: '@deskhud/skeleton-ipc', layer: 'skeleton-ipc', x: 0.68, y: 0.56, cyclomatic: 3, cognitive: 4, deadExports: [], hasRustUnwrap: false, loc: 64 },
  { id: 'rustCore', label: 'src-tauri/commands.rs', layer: 'rust-core', x: 0.82, y: 0.28, cyclomatic: 6, cognitive: 8, deadExports: [], hasRustUnwrap: true, loc: 112 },
  { id: 'momenBaas', label: 'momenClient.ts', layer: 'momen-baas', x: 0.84, y: 0.74, cyclomatic: 4, cognitive: 5, deadExports: [], hasRustUnwrap: false, loc: 88 }
];

const DIRTY_EDGES: DependencyEdge[] = [
  { from: 'hudView', to: 'overlayCtrl' },
  { from: 'overlayCtrl', to: 'stateStore' },
  { from: 'stateStore', to: 'hudView' }, // 3-node circular dependency!
  { from: 'hudView', to: 'rustCore' }, // Hexagonal boundary violation (UI -> Rust directly)
  { from: 'overlayCtrl', to: 'skeletonIpc' },
  { from: 'skeletonIpc', to: 'rustCore' },
  { from: 'skeletonIpc', to: 'momenBaas' }
];

const HEALED_NODES: ModuleNode[] = [
  { id: 'hudView', label: 'hudView.tsx', layer: 'ui', x: 0.20, y: 0.30, cyclomatic: 4, cognitive: 5, deadExports: [], hasRustUnwrap: false, loc: 94 },
  { id: 'overlayCtrl', label: 'overlayController.ts', layer: 'controller', x: 0.46, y: 0.26, cyclomatic: 5, cognitive: 6, deadExports: [], hasRustUnwrap: false, loc: 82 },
  { id: 'stateStore', label: 'stateStore.ts', layer: 'controller', x: 0.46, y: 0.68, cyclomatic: 4, cognitive: 4, deadExports: [], hasRustUnwrap: false, loc: 78 },
  { id: 'skeletonIpc', label: '@deskhud/skeleton-ipc', layer: 'skeleton-ipc', x: 0.68, y: 0.48, cyclomatic: 3, cognitive: 3, deadExports: [], hasRustUnwrap: false, loc: 64 },
  { id: 'rustCore', label: 'src-tauri/commands.rs', layer: 'rust-core', x: 0.85, y: 0.28, cyclomatic: 4, cognitive: 4, deadExports: [], hasRustUnwrap: false, loc: 98 },
  { id: 'momenBaas', label: 'momenClient.ts', layer: 'momen-baas', x: 0.85, y: 0.72, cyclomatic: 4, cognitive: 5, deadExports: [], hasRustUnwrap: false, loc: 88 }
];

const HEALED_EDGES: DependencyEdge[] = [
  { from: 'hudView', to: 'overlayCtrl' },
  { from: 'hudView', to: 'stateStore' },
  { from: 'overlayCtrl', to: 'stateStore' },
  { from: 'overlayCtrl', to: 'skeletonIpc' },
  { from: 'skeletonIpc', to: 'rustCore' },
  { from: 'skeletonIpc', to: 'momenBaas' }
];

const CODE_SNIPPETS: Record<string, { dirty: string; clean: string; toolTag: string }> = {
  overlayCtrl: {
    toolTag: 'OXLINT + FALLOW COMPLEXITY & CYCLE',
    dirty: `// overlayController.ts (COGNITIVE: 34 · CYCLE)
import { renderPill } from './hudView'; // ✗ Cycle!
export const deprecatedSyncState = () => {}; // ✗ Dead

export async function onHotKey(e: any) {
  if (e?.key === 'Space') {
    for (const t of e.targets) {
      if (t.active && t.mode === 'stt') {
        await window.__TAURI__.invoke('whisper', t);
      }
    }
  }
}`,
    clean: `// overlayController.ts (COGNITIVE: 6 · DAG CLEAN)
import type { HotkeyEvent } from './stateStore';
import { invokeSpecta } from '@deskhud/skeleton-ipc';

export async function onHotKey(e: HotkeyEvent) {
  const target = e.targets.find(t => t.active);
  if (!target || e.key !== 'Space') return null;
  return invokeSpecta('run_whisper_safe', target.id);
}`
  },
  rustCore: {
    toolTag: 'CARGO CLIPPY + TAURI SPECTA IPC',
    dirty: `// src-tauri/commands.rs (✗ clippy::unwrap_used)
#[tauri::command]
pub fn run_whisper_unchecked(raw: String) -> String {
  let v: Value = serde_json::from_str(&raw).unwrap();
  v["text"].as_str().unwrap().to_string()
}`,
    clean: `// src-tauri/commands.rs (✓ Specta + Result<T, E>)
#[tauri::command]
#[specta::specta]
pub fn run_whisper_safe(id: String) -> Result< Transcript, HudErr > {
  AudioEngine::open(&id)?.transcribe_parakeet()
}`
  },
  hudView: {
    toolTag: 'FALLOW BOUNDARY GUARD + OXLINT',
    dirty: `// hudView.tsx (✗ Hexagonal Boundary Violation)
import { invoke } from '@tauri-apps/api/core';
export const legacyBadgeStyle = { fontSize: '13px' };
// Directly calls Rust core from UI layer`,
    clean: `// hudView.tsx (✓ Strict Layer Isolation)
import { useHudController } from './overlayController';
// UI layer communicates strictly via controller`
  }
};

interface Props {
  isHealed: boolean;
  onToggleHeal: (nextHealed: boolean) => void;
  onLogFrame: (frame: WsFrameLog) => void;
}

export const PulseHudApp: React.FC<Props> = ({ isHealed, onToggleHeal, onLogFrame }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('overlayCtrl');
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });

  const nodes = isHealed ? HEALED_NODES : DIRTY_NODES;
  const edges = isHealed ? HEALED_EDGES : DIRTY_EDGES;
  const report = analyzeCodeGraph(nodes, edges);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const triggerKiroHookHeal = async () => {
    if (isHealed) {
      onToggleHeal(false);
      return;
    }
    setIsScanning(true);
    setScanPhase('[08ms] vp check → oxlint AST scan');
    await new Promise((r) => setTimeout(r, 180));
    setScanPhase('[21ms] fallow guard → pruning cycles & dead exports');
    await new Promise((r) => setTimeout(r, 180));
    setScanPhase('[34ms] cargo clippy + specta IPC bind');
    await new Promise((r) => setTimeout(r, 160));
    setIsScanning(false);
    setScanPhase('');
    onToggleHeal(true);

    const healedReport = analyzeCodeGraph(HEALED_NODES, HEALED_EDGES);
    await recordAuditRunToMomen(
      {
        app_slug: 'pulse-hud',
        module_name: selectedNode.label,
        health_score: healedReport.healthScore,
        circular_count: healedReport.cycleEdges.length,
        dead_export_count: healedReport.totalDeadExports,
        clippy_status: 'PASS_SPECTA_TYPED',
        healed_by_hook: true
      },
      onLogFrame
    );
  };

  // Interactive Spatial Field Canvas with Cursor Grid Warping & Animated Particle Flows
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const render = () => {
      tick += 0.022;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep Spatial Void Background
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, W, H);

      // Warped 36px Coordinate Field (Cartridge 03: SPATIAL_SHADER)
      const step = 36;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.065)';
      ctx.lineWidth = 1;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let gx = 0; gx <= W; gx += step) {
        ctx.beginPath();
        for (let gy = 0; gy <= H; gy += 18) {
          const dx = gx - mx;
          const dy = gy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = dist < 130 ? ((130 - dist) / 130) * 10 : 0;
          const wx = gx - (dx / (dist || 1)) * pull;
          const wy = gy - (dy / (dist || 1)) * pull;
          if (gy === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }

      // Draw Dependency Edges & Animated Signal Particles
      const cycleSet = new Set(report.cycleEdges.map((e) => `${e.from}->${e.to}`));
      const violationSet = new Set(report.boundaryViolations.map((e) => `${e.from}->${e.to}`));

      edges.forEach((edge, idx) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);
        if (!from || !to) return;

        const x1 = from.x * W;
        const y1 = from.y * H;
        const x2 = to.x * W;
        const y2 = to.y * H;

        const key = `${edge.from}->${edge.to}`;
        const isCycle = cycleSet.has(key);
        const isViolation = violationSet.has(key);

        ctx.save();
        if (isCycle) {
          ctx.strokeStyle = '#FF3366';
          ctx.lineWidth = 2.4;
          ctx.shadowColor = '#FF3366';
          ctx.shadowBlur = 12;
        } else if (isViolation) {
          ctx.strokeStyle = '#FF9F1C';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
        } else {
          ctx.strokeStyle = isHealed ? 'rgba(16, 185, 129, 0.55)' : 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 1.6;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Animated telemetry packet along edge
        const t = (tick * (isCycle ? 1.8 : 1) + idx * 0.23) % 1;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        ctx.fillStyle = isCycle ? '#FF3366' : isViolation ? '#FF9F1C' : '#00F0FF';
        ctx.beginPath();
        ctx.arc(px, py, isCycle ? 4 : 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Module Nodes
      nodes.forEach((node) => {
        const nx = node.x * W;
        const ny = node.y * H;
        const isSelected = node.id === selectedNodeId;
        const hasFault = node.cognitive > 15 || node.deadExports.length > 0 || node.hasRustUnwrap;
        const baseRadius = 20 + Math.min(16, node.cognitive * 0.4);

        // Outer complexity halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(nx, ny, baseRadius + (isSelected ? 7 : 2), 0, Math.PI * 2);
        ctx.fillStyle = hasFault
          ? 'rgba(255, 51, 102, 0.14)'
          : isHealed
          ? 'rgba(16, 185, 129, 0.14)'
          : 'rgba(0, 240, 255, 0.10)';
        ctx.fill();

        // Core node circle
        ctx.beginPath();
        ctx.arc(nx, ny, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0B0F17';
        ctx.fill();
        ctx.lineWidth = isSelected ? 2.6 : 1.5;
        ctx.strokeStyle = hasFault ? '#FF3366' : isSelected ? '#00F0FF' : '#10B981';
        ctx.stroke();

        // Layer badge inside node
        ctx.fillStyle = hasFault ? '#FF3366' : '#00F0FF';
        ctx.font = '600 9px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.layer.toUpperCase(), nx, ny - 3);

        // Cognitive score inside node
        ctx.fillStyle = '#E2F1FF';
        ctx.font = '700 11px "IBM Plex Mono", monospace';
        ctx.fillText(`C:${node.cognitive}`, nx, ny + 10);

        // Crisp module label below node
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#94A3B8';
        ctx.font = `${isSelected ? '700' : '500'} 11px "IBM Plex Mono", monospace`;
        ctx.fillText(node.label, nx, ny + baseRadius + 16);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [nodes, edges, report, selectedNodeId, isHealed]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    for (const node of nodes) {
      const nx = node.x * canvas.width;
      const ny = node.y * canvas.height;
      if (Math.hypot(cx - nx, cy - ny) <= 36) {
        setSelectedNodeId(node.id);
        break;
      }
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const snippet = CODE_SNIPPETS[selectedNode.id] || CODE_SNIPPETS.overlayCtrl;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '12px', height: '100%', minHeight: 0 }}>
      {/* Left 75%: Interactive Spatial Force-Graph Viewport */}
      <div
        style={{
          background: '#050608',
          border: '1px solid rgba(0, 240, 255, 0.18)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top Minimalist HUD Telemetry Strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px 14px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.14)',
            background: 'rgba(11, 15, 23, 0.85)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#00F0FF', fontWeight: 700 }}>APP 01 // PULSE_HUD</span>
            <span style={{ color: report.cycleEdges.length > 0 ? '#FF3366' : '#10B981' }}>
              CYCLES: {report.cycleEdges.length}
            </span>
            <span style={{ color: report.totalDeadExports > 0 ? '#FF9F1C' : '#10B981' }}>
              DEAD_EXPORTS: {report.totalDeadExports}
            </span>
            <span style={{ color: report.rustPanicsCount > 0 ? '#FF3366' : '#10B981' }}>
              CLIPPY_UNWRAP: {report.rustPanicsCount}
            </span>
          </div>

          <button
            data-testid="pulse-heal-btn"
            onClick={triggerKiroHookHeal}
            style={{
              background: isHealed ? 'rgba(16, 185, 129, 0.16)' : '#FF3300',
              color: isHealed ? '#10B981' : '#FFFFFF',
              border: `1px solid ${ isHealed ? '#10B981' : '#FF3300' }`,
              padding: '6px 14px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isHealed ? 'none' : '3px 3px 0 #00F0FF'
            }}
          >
            {isHealed ? <RotateCcw size={13} /> : <Sparkles size={13} />}
            {isHealed ? 'RESET TO DIRTY COMMIT' : 'HEAL VIA KIRO HOOK (ALT+H)'}
          </button>
        </div>

        {/* Interactive Graph Canvas */}
        <div style={{ flex: 1, position: 'relative', minHeight: '320px', height: '380px' }}>
          <canvas
            ref={canvasRef}
            width={780}
            height={440}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
          />

          {/* Scanline Loading Overlay during Kiro Hook Execution */}
          {isScanning && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 6, 8, 0.78)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: 'IBM Plex Mono, monospace'
              }}
            >
              <div style={{ color: '#00F0FF', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}>
                EXECUTING .kiro/hooks/agentic-clean-gate.json
              </div>
              <div style={{ color: '#10B981', fontSize: '12px' }}>{scanPhase}</div>
            </div>
          )}

          {/* Bottom-Left Legend Overlay (Max 4 words per chip) */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              bottom: '12px',
              display: 'flex',
              gap: '10px',
              background: 'rgba(5, 6, 8, 0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '6px 10px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              color: '#94A3B8'
            }}
          >
            <span style={{ color: '#FF3366' }}>● CIRCULAR DEP</span>
            <span style={{ color: '#FF9F1C' }}>--- BOUNDARY DRIFT</span>
            <span style={{ color: '#10B981' }}>● CLEAN DAG</span>
            <span>CLICK NODE TO INSPECT</span>
          </div>
        </div>
      </div>

      {/* Right 350px Surgical Telemetry Inspector */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>INSPECTED MODULE</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#E2F1FF', marginTop: '2px' }}>{selectedNode.label}</div>
          </div>
          <span
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 700,
              background: isHealed ? 'rgba(16,185,129,0.15)' : 'rgba(255,51,102,0.15)',
              color: isHealed ? '#10B981' : '#FF3366',
              border: `1px solid ${ isHealed ? '#10B981' : '#FF3366' }`
            }}
          >
            {report.status} · {report.healthScore}/100
          </span>
        </div>

        {/* 4-Cell Metric Readout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          <div style={{ background: '#050608', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '9px' }}>COGNITIVE COMPLEXITY</div>
            <div style={{ color: selectedNode.cognitive > 10 ? '#FF3366' : '#10B981', fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>
              {selectedNode.cognitive} <span style={{ fontSize: '10px', color: '#64748B' }}>/ 10 MAX</span>
            </div>
          </div>
          <div style={{ background: '#050608', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '9px' }}>DEAD EXPORTS (FALLOW)</div>
            <div style={{ color: selectedNode.deadExports.length > 0 ? '#FF9F1C' : '#10B981', fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>
              {selectedNode.deadExports.length}
            </div>
          </div>
          <div style={{ background: '#050608', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '9px' }}>OXLINT AST LATENCY</div>
            <div style={{ color: '#00F0FF', fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>11.4 ms</div>
          </div>
          <div style={{ background: '#050608', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '9px' }}>RUST SPECTA IPC</div>
            <div style={{ color: selectedNode.hasRustUnwrap ? '#FF3366' : '#10B981', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
              {selectedNode.hasRustUnwrap ? 'UNWRAP_PANIC' : 'TYPED_OK'}
            </div>
          </div>
        </div>

        {/* Node Selector Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNodeId(n.id)}
              style={{
                background: selectedNodeId === n.id ? '#00F0FF' : '#050608',
                color: selectedNodeId === n.id ? '#050608' : '#94A3B8',
                border: '1px solid rgba(0,240,255,0.25)',
                padding: '4px 8px',
                fontSize: '10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Live AST Code Diff View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ fontSize: '10px', color: '#00F0FF', marginBottom: '4px' }}>{snippet.toolTag}</div>
          <pre
            style={{
              flex: 1,
              margin: 0,
              background: '#050608',
              border: `1px solid ${ isHealed ? 'rgba(16,185,129,0.35)' : 'rgba(255,51,102,0.35)' }`,
              padding: '10px',
              fontSize: '10.5px',
              lineHeight: 1.45,
              color: '#E2F1FF',
              overflow: 'auto'
            }}
          >
            {isHealed ? snippet.clean : snippet.dirty}
          </pre>
        </div>
      </div>
    </div>
  );
};
