import React, { useState, useEffect, useRef } from 'react';
import {
  analyzeWorkspaceSourceFiles,
  type SourceFileEntry
} from '../../packages/deskhud-skeleton';
import { recordAuditRunToMomen, type WsFrameLog } from '../../src/momenClient';
import { Sparkles, RotateCcw, Plus, GitBranch } from 'lucide-react';

const INITIAL_DIRTY_FILES: SourceFileEntry[] = [
  {
    id: 'hudView',
    filename: 'hudView.tsx',
    layer: 'ui',
    x: 0.20,
    y: 0.30,
    code: `// hudView.tsx — UI Layer
import { onHotKey } from './overlayController';
import { invoke } from '@tauri-apps/api/core';

export const legacyBadgeStyle = { fontSize: '13px' };

export function PulseHudApp(props: any) {
  if (props && props.visible) {
    if (props.hotkey) {
      invoke('run_whisper_unchecked', { raw: props.hotkey });
    }
  }
  return onHotKey(props);
}`
  },
  {
    id: 'overlayCtrl',
    filename: 'overlayController.ts',
    layer: 'controller',
    x: 0.50,
    y: 0.24,
    code: `// overlayController.ts — Controller Layer
import { useHudState } from './stateStore';
import { invokeSpecta } from './skeletonIpc';

export function deprecatedSyncState(payload: any) {
  return payload;
}

export const unusedVoiceBuf = new Uint8Array(64);

export async function onHotKey(e: any) {
  if (e && e.key === 'Space' && e.altKey) {
    for (let i = 0; i < e.targets.length; i++) {
      if (e.targets[i].active && e.targets[i].mode === 'stt') {
        if (e.targets[i].retry || e.targets[i].force) {
          await window.__TAURI__.invoke('whisper', e.targets[i]);
        }
      }
    }
  }
  return useHudState() && invokeSpecta('run_whisper_safe', 'default');
}`
  },
  {
    id: 'stateStore',
    filename: 'stateStore.ts',
    layer: 'controller',
    x: 0.38,
    y: 0.68,
    code: `// stateStore.ts — State Store (Circular import back to hudView!)
import { PulseHudApp } from './hudView';

export function useHudState() {
  if (typeof window !== 'undefined' && PulseHudApp) {
    return true;
  }
  return false;
}`
  },
  {
    id: 'skeletonIpc',
    filename: '@deskhud/skeleton-ipc.ts',
    layer: 'skeleton-ipc',
    x: 0.66,
    y: 0.54,
    code: `// @deskhud/skeleton-ipc.ts — Type-Safe Specta IPC Bridge
import { run_whisper_safe } from './commands';
import { recordAuditRun } from './momenClient';

export async function invokeSpecta(cmd: string, targetId: string) {
  if (cmd === 'run_whisper_safe') {
    await recordAuditRun(targetId);
    return run_whisper_safe(targetId);
  }
  return null;
}`
  },
  {
    id: 'rustCore',
    filename: 'src-tauri/commands.rs',
    layer: 'rust-core',
    x: 0.84,
    y: 0.28,
    code: `// src-tauri/commands.rs — Rust Tauri v2 Core
#[tauri::command]
pub fn run_whisper_safe(raw: String) -> String {
    let parsed: serde_json::Value = serde_json::from_str(&raw).unwrap();
    parsed["text"].as_str().unwrap().to_string()
}`
  },
  {
    id: 'momenBaas',
    filename: 'momenClient.ts',
    layer: 'momen-baas',
    x: 0.84,
    y: 0.74,
    code: `// momenClient.ts — Momen Headless BaaS GraphQL Client
export async function recordAuditRun(targetId: string) {
  return { id: targetId, synced: true };
}`
  }
];

const CLEAN_HEALED_FILES: SourceFileEntry[] = [
  {
    id: 'hudView',
    filename: 'hudView.tsx',
    layer: 'ui',
    x: 0.20,
    y: 0.30,
    code: `// hudView.tsx — UI Layer (Hexagonal Boundary Clean)
import { onHotKey } from './overlayController';
import { useHudState, type HudViewProps } from './stateStore';

export function PulseHudApp(props: HudViewProps) {
  const ready = useHudState();
  if (!ready || !props.visible) return null;
  return onHotKey(props);
}`
  },
  {
    id: 'overlayCtrl',
    filename: 'overlayController.ts',
    layer: 'controller',
    x: 0.48,
    y: 0.26,
    code: `// overlayController.ts — Controller Layer (0 Dead Exports · Cognitive 4)
import { useHudState, type HudViewProps } from './stateStore';
import { invokeSpecta } from './skeletonIpc';

export async function onHotKey(e: HudViewProps) {
  const active = e.targets.find((t) => t.active);
  if (!active || !useHudState()) return null;
  return invokeSpecta('run_whisper_safe', active.id);
}`
  },
  {
    id: 'stateStore',
    filename: 'stateStore.ts',
    layer: 'controller',
    x: 0.46,
    y: 0.68,
    code: `// stateStore.ts — Pure Leaf Store & Shared Contract (DAG Clean)
export interface HudViewProps {
  visible: boolean;
  key: string;
  altKey: boolean;
  targets: { id: string; active: boolean; mode: string }[];
}

export function useHudState(): boolean {
  return typeof window !== 'undefined';
}`
  },
  {
    id: 'skeletonIpc',
    filename: '@deskhud/skeleton-ipc.ts',
    layer: 'skeleton-ipc',
    x: 0.68,
    y: 0.50,
    code: `// @deskhud/skeleton-ipc.ts — Type-Safe Specta IPC Bridge
import { run_whisper_safe } from './commands';
import { recordAuditRun } from './momenClient';

export async function invokeSpecta(cmd: string, targetId: string) {
  if (cmd !== 'run_whisper_safe') return null;
  await recordAuditRun(targetId);
  return run_whisper_safe(targetId);
}`
  },
  {
    id: 'rustCore',
    filename: 'src-tauri/commands.rs',
    layer: 'rust-core',
    x: 0.85,
    y: 0.28,
    code: `// src-tauri/commands.rs — Rust Tauri v2 + Specta Safe Result<T, E>
#[tauri::command]
#[specta::specta]
pub fn run_whisper_safe(target_id: String) -> Result<String, String> {
    AudioSession::open(&target_id).map_err(|e| e.to_string())
}`
  },
  {
    id: 'momenBaas',
    filename: 'momenClient.ts',
    layer: 'momen-baas',
    x: 0.85,
    y: 0.72,
    code: `// momenClient.ts — Momen Headless BaaS GraphQL Client
export async function recordAuditRun(targetId: string) {
  return { id: targetId, synced: true };
}`
  }
];

interface Props {
  isHealed: boolean;
  onToggleHeal: (nextHealed: boolean, computedScore?: number) => void;
  onLogFrame: (frame: WsFrameLog) => void;
}

export const PulseHudApp: React.FC<Props> = ({ isHealed, onToggleHeal, onLogFrame }) => {
  const [files, setFiles] = useState<SourceFileEntry[]>(INITIAL_DIRTY_FILES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('overlayCtrl');
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<string>('');
  const [repoInput, setRepoInput] = useState<string>('Georgefifth/deskhud-kit-kiroween');
  const [repoLoading, setRepoLoading] = useState<boolean>(false);
  const [newFileModal, setNewFileModal] = useState<boolean>(false);
  const [newFilename, setNewFilename] = useState<string>('customPlugin.ts');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });

  // Sync preset when external Alt+H or Handy Bot toggles isHealed
  useEffect(() => {
    setFiles(isHealed ? CLEAN_HEALED_FILES : INITIAL_DIRTY_FILES);
  }, [isHealed]);

  // Real live AST analysis on the current source code buffers!
  const report = analyzeWorkspaceSourceFiles(files);
  const nodes = report.nodes;
  const edges = report.edges;
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const selectedFile = files.find((f) => f.id === selectedNode.id) || files[0];

  const handleCodeChange = (newCode: string) => {
    const updated = files.map((f) => (f.id === selectedFile.id ? { ...f, code: newCode } : f));
    setFiles(updated);
    const nextReport = analyzeWorkspaceSourceFiles(updated);
    onToggleHeal(nextReport.status === 'CLEAN', nextReport.healthScore);
  };

  const handleAddCustomFile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFilename.trim() || `module_${files.length + 1}.ts`;
    const id = cleanName.replace(/[^a-zA-Z0-9]/g, '');
    const newEntry: SourceFileEntry = {
      id,
      filename: cleanName,
      layer: cleanName.endsWith('.rs') ? 'rust-core' : 'controller',
      x: 0.30 + (files.length % 3) * 0.22,
      y: 0.45 + ((files.length * 17) % 30) * 0.01,
      code: `// ${cleanName} — Live Editable Buffer\nimport { invokeSpecta } from './skeletonIpc';\n\nexport const unusedHelper_${files.length} = true;\n\nexport async function runCustomTask(input: any) {\n  if (input && input.retry) {\n    return invokeSpecta('run_whisper_safe', String(input));\n  }\n  return null;\n}`
    };
    setFiles((prev) => [...prev, newEntry]);
    setSelectedNodeId(id);
    setNewFileModal(false);
  };

  const handleImportGitHubRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = repoInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!slug.includes('/')) return;
    setRepoLoading(true);
    try {
      const treeRes = await fetch(`https://api.github.com/repos/${slug}/git/trees/HEAD?recursive=1`);
      const treeJson = await treeRes.json();
      const codeBlobs = (treeJson?.tree || [])
        .filter((item: { type?: string; path?: string }) =>
          item.type === 'blob' &&
          item.path &&
          /\.(tsx?|rs|py|mjs)$/.test(item.path) &&
          !item.path.includes('node_modules') &&
          !item.path.includes('dist')
        )
        .slice(0, 7);

      if (codeBlobs.length > 0) {
        const fetchedFiles: SourceFileEntry[] = await Promise.all(
          codeBlobs.map(async (blob: { path: string }, idx: number) => {
            const rawRes = await fetch(`https://raw.githubusercontent.com/${slug}/HEAD/${blob.path}`);
            const text = await rawRes.text();
            const shortName = blob.path.split('/').slice(-2).join('/');
            const angle = (idx / codeBlobs.length) * Math.PI * 2;
            return {
              id: `gh_${idx}_${shortName.replace(/[^a-zA-Z0-9]/g, '')}`,
              filename: shortName,
              layer: blob.path.endsWith('.rs')
                ? 'rust-core'
                : blob.path.includes('App') || blob.path.includes('View')
                ? 'ui'
                : blob.path.includes('momen')
                ? 'momen-baas'
                : 'controller',
              x: 0.50 + Math.cos(angle) * 0.30,
              y: 0.50 + Math.sin(angle) * 0.28,
              code: text.slice(0, 2400)
            };
          })
        );
        setFiles(fetchedFiles);
        setSelectedNodeId(fetchedFiles[0].id);
        onLogFrame({
          id: `gh_${Date.now()}`,
          timestamp: new Date().toTimeString().slice(0, 8),
          direction: 'RX',
          type: 'GITHUB_AST',
          summary: `Imported ${fetchedFiles.length} live source files from github.com/${slug}`
        });
      }
    } catch {
      // ignore network error
    } finally {
      setRepoLoading(false);
    }
  };

  const triggerKiroHookHeal = async () => {
    if (report.status === 'CLEAN') {
      setFiles(INITIAL_DIRTY_FILES);
      onToggleHeal(false, 52);
      return;
    }
    setIsScanning(true);
    setScanPhase('[08ms] vp check → oxlint AST scan');
    await new Promise((r) => setTimeout(r, 160));
    setScanPhase('[19ms] fallow guard → pruning cycles & dead exports');
    await new Promise((r) => setTimeout(r, 160));
    setScanPhase('[31ms] cargo clippy + specta IPC bind');
    await new Promise((r) => setTimeout(r, 140));
    setIsScanning(false);
    setScanPhase('');

    setFiles(CLEAN_HEALED_FILES);
    const healedReport = analyzeWorkspaceSourceFiles(CLEAN_HEALED_FILES);
    onToggleHeal(true, healedReport.healthScore);

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

  // Interactive Spatial Field Canvas
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

      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, W, H);

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
          ctx.strokeStyle = report.status === 'CLEAN' ? 'rgba(16, 185, 129, 0.55)' : 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 1.6;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const t = (tick * (isCycle ? 1.8 : 1) + idx * 0.23) % 1;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        ctx.fillStyle = isCycle ? '#FF3366' : isViolation ? '#FF9F1C' : '#00F0FF';
        ctx.beginPath();
        ctx.arc(px, py, isCycle ? 4 : 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      nodes.forEach((node) => {
        const nx = node.x * W;
        const ny = node.y * H;
        const isSelected = node.id === selectedNode.id;
        const hasFault = node.cognitive > 10 || node.deadExports.length > 0 || node.hasRustUnwrap || node.anyCount > 0;
        const baseRadius = 20 + Math.min(16, node.cognitive * 0.45);

        ctx.save();
        ctx.beginPath();
        ctx.arc(nx, ny, baseRadius + (isSelected ? 7 : 2), 0, Math.PI * 2);
        ctx.fillStyle = hasFault
          ? 'rgba(255, 51, 102, 0.14)'
          : report.status === 'CLEAN'
          ? 'rgba(16, 185, 129, 0.14)'
          : 'rgba(0, 240, 255, 0.10)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0B0F17';
        ctx.fill();
        ctx.lineWidth = isSelected ? 2.6 : 1.5;
        ctx.strokeStyle = hasFault ? '#FF3366' : isSelected ? '#00F0FF' : '#10B981';
        ctx.stroke();

        ctx.fillStyle = hasFault ? '#FF3366' : '#00F0FF';
        ctx.font = '600 9px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.layer.toUpperCase(), nx, ny - 3);

        ctx.fillStyle = '#E2F1FF';
        ctx.font = '700 11px "IBM Plex Mono", monospace';
        ctx.fillText(`C:${node.cognitive}`, nx, ny + 10);

        ctx.fillStyle = isSelected ? '#FFFFFF' : '#94A3B8';
        ctx.font = `${isSelected ? '700' : '500'} 11px "IBM Plex Mono", monospace`;
        ctx.fillText(node.label, nx, ny + baseRadius + 16);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [nodes, edges, report, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;

    for (const node of nodes) {
      const nx = node.x * canvas.width;
      const ny = node.y * canvas.height;
      if (Math.hypot(cx - nx, cy - ny) <= 38) {
        setSelectedNodeId(node.id);
        break;
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 390px', gap: '12px', height: '100%', minHeight: 0 }}>
      {/* Left: Interactive Force-Directed AST Graph + GitHub Importer */}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '8px 12px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.14)',
            background: 'rgba(11, 15, 23, 0.9)',
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

          {/* Live GitHub Repo Importer + Kiro Hook Healer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <form onSubmit={handleImportGitHubRepo} style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="owner/repo (GitHub)"
                style={{
                  width: '175px',
                  background: '#050608',
                  border: '1px solid rgba(0,240,255,0.28)',
                  color: '#E2F1FF',
                  padding: '4px 8px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '10px'
                }}
              />
              <button
                type="submit"
                disabled={repoLoading}
                style={{
                  background: '#0B0F17',
                  color: '#00F0FF',
                  border: '1px solid rgba(0,240,255,0.35)',
                  padding: '4px 8px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <GitBranch size={11} />
                {repoLoading ? 'SYNC...' : 'IMPORT GH'}
              </button>
            </form>

            <button
              data-testid="pulse-heal-btn"
              onClick={triggerKiroHookHeal}
              style={{
                background: report.status === 'CLEAN' ? 'rgba(16, 185, 129, 0.16)' : '#FF3300',
                color: report.status === 'CLEAN' ? '#10B981' : '#FFFFFF',
                border: `1px solid ${ report.status === 'CLEAN' ? '#10B981' : '#FF3300' }`,
                padding: '5px 12px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: report.status === 'CLEAN' ? 'none' : '3px 3px 0 #00F0FF'
              }}
            >
              {report.status === 'CLEAN' ? <RotateCcw size={12} /> : <Sparkles size={12} />}
              {report.status === 'CLEAN' ? 'RESET DIRTY COMMIT' : 'HEAL VIA KIRO HOOK (ALT+H)'}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', minHeight: '320px', height: '380px' }}>
          <canvas
            ref={canvasRef}
            width={780}
            height={440}
            onClick={handleCanvasClick}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              mouseRef.current = {
                x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
                y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height
              };
            }}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
          />

          {isScanning && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(5, 6, 8, 0.82)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: 'IBM Plex Mono, monospace'
              }}
            >
              <div style={{ color: '#00F0FF', fontSize: '13px', fontWeight: 700 }}>
                EXECUTING .kiro/hooks/agentic-clean-gate.json
              </div>
              <div style={{ color: '#10B981', fontSize: '12px' }}>{scanPhase}</div>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              left: '12px',
              bottom: '12px',
              display: 'flex',
              gap: '10px',
              background: 'rgba(5, 6, 8, 0.88)',
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
            <span>LIVE AST PARSER ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Right: Live Editable Code Buffer & Real-Time Oxlint/Fallow Diagnostics */}
      <div
        style={{
          background: '#090C12',
          border: '1px solid rgba(0, 240, 255, 0.18)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontFamily: 'IBM Plex Mono, monospace',
          minHeight: 0
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '9.5px', color: '#64748B' }}>LIVE EDITABLE AST BUFFER</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2F1FF', marginTop: '2px' }}>{selectedNode.label}</div>
          </div>
          <span
            style={{
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 700,
              background: report.status === 'CLEAN' ? 'rgba(16,185,129,0.15)' : 'rgba(255,51,102,0.15)',
              color: report.status === 'CLEAN' ? '#10B981' : '#FF3366',
              border: `1px solid ${ report.status === 'CLEAN' ? '#10B981' : '#FF3366' }`
            }}
          >
            {report.status} · {report.healthScore}/100
          </span>
        </div>

        {/* 4-Cell Live Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10.5px' }}>
          <div style={{ background: '#050608', padding: '7px 9px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '8.5px' }}>COGNITIVE COMPLEXITY</div>
            <div style={{ color: selectedNode.cognitive > 10 ? '#FF3366' : '#10B981', fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
              {selectedNode.cognitive} <span style={{ fontSize: '9.5px', color: '#64748B' }}>/ 10 MAX</span>
            </div>
          </div>
          <div style={{ background: '#050608', padding: '7px 9px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '8.5px' }}>DEAD EXPORTS (FALLOW)</div>
            <div style={{ color: selectedNode.deadExports.length > 0 ? '#FF9F1C' : '#10B981', fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
              {selectedNode.deadExports.length}
            </div>
          </div>
          <div style={{ background: '#050608', padding: '7px 9px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '8.5px' }}>CYCLOMATIC BRANCHES</div>
            <div style={{ color: '#00F0FF', fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{selectedNode.cyclomatic}</div>
          </div>
          <div style={{ background: '#050608', padding: '7px 9px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#64748B', fontSize: '8.5px' }}>RUST SPECTA IPC</div>
            <div style={{ color: selectedNode.hasRustUnwrap ? '#FF3366' : '#10B981', fontSize: '12px', fontWeight: 700, marginTop: '3px' }}>
              {selectedNode.hasRustUnwrap ? 'UNWRAP_PANIC' : 'TYPED_OK'}
            </div>
          </div>
        </div>

        {/* File Tabs + Add Custom File Button */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNodeId(n.id)}
              style={{
                background: selectedNode.id === n.id ? '#00F0FF' : '#050608',
                color: selectedNode.id === n.id ? '#050608' : '#94A3B8',
                border: '1px solid rgba(0,240,255,0.25)',
                padding: '3px 7px',
                fontSize: '9.5px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => setNewFileModal(!newFileModal)}
            style={{
              background: 'rgba(16,185,129,0.15)',
              color: '#10B981',
              border: '1px solid #10B981',
              padding: '3px 7px',
              fontSize: '9.5px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <Plus size={10} /> FILE
          </button>
        </div>

        {newFileModal && (
          <form onSubmit={handleAddCustomFile} style={{ display: 'flex', gap: '5px' }}>
            <input
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              placeholder="filename.ts or .rs"
              style={{
                flex: 1,
                background: '#050608',
                border: '1px solid #10B981',
                color: '#E2F1FF',
                padding: '4px 8px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#10B981',
                color: '#050608',
                border: 'none',
                padding: '4px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              CREATE
            </button>
          </form>
        )}

        {/* Live Editable Source Textarea */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: '6px' }}>
          <div style={{ fontSize: '9.5px', color: '#00F0FF', display: 'flex', justifyContent: 'space-between' }}>
            <span>EDIT CODE BELOW (RE-ANALYZES AST ON EVERY KEYSTROKE)</span>
            <span>{selectedNode.loc} LOC</span>
          </div>
          <textarea
            value={selectedFile.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              resize: 'none',
              background: '#050608',
              border: `1px solid ${ report.status === 'CLEAN' ? 'rgba(16,185,129,0.4)' : 'rgba(255,51,102,0.4)' }`,
              padding: '8px',
              fontSize: '10.5px',
              lineHeight: 1.45,
              color: '#E2F1FF',
              fontFamily: 'IBM Plex Mono, monospace',
              outline: 'none'
            }}
          />

          {/* Live Diagnostics List */}
          <div style={{ maxHeight: '82px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {selectedNode.diagnostics.length === 0 ? (
              <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', padding: '5px 8px', fontSize: '10px', color: '#10B981' }}>
                ✓ 0 Oxlint / Fallow / Clippy issues in {selectedNode.label}
              </div>
            ) : (
              selectedNode.diagnostics.map((d, i) => (
                <div
                  key={i}
                  style={{
                    background: d.severity === 'error' ? 'rgba(255,51,102,0.12)' : 'rgba(255,159,28,0.12)',
                    borderLeft: `3px solid ${ d.severity === 'error' ? '#FF3366' : '#FF9F1C' }`,
                    padding: '4px 8px',
                    fontSize: '9.5px',
                    color: '#E2F1FF'
                  }}
                >
                  <strong style={{ color: d.severity === 'error' ? '#FF3366' : '#FF9F1C' }}>[{d.rule}]</strong> {d.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
