import React, { useState, useEffect } from 'react';
import { PulseHudApp } from '../apps/pulse-hud/PulseHudApp';
import { ScaleHudApp } from '../apps/scale-hud/ScaleHudApp';
import { VisualStoryDirector } from './components/VisualStoryDirector';
import { getSavedAuditRuns, fetchLiveMomenAuditRuns, type WsFrameLog } from './momenClient';
import { Mic, Terminal, Cpu, Box, Compass, Sparkles } from 'lucide-react';

type ActiveWorkspace = 'pulse-hud' | 'scale-hud' | 'story-rig';

export const App: React.FC = () => {
  const [workspace, setWorkspace] = useState<ActiveWorkspace>('pulse-hud');
  const [isHealed, setIsHealed] = useState<boolean>(false);
  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const [hudCommand, setHudCommand] = useState<string>('');
  const [botToast, setBotToast] = useState<string | null>(null);
  const [frames, setFrames] = useState<WsFrameLog[]>([
    {
      id: 'init_01',
      timestamp: '00:00:01',
      direction: 'RX',
      type: 'KIRO_STEER',
      summary: 'Loaded .kiro/specs/ + Oxlint/Vite+/Fallow + 1mm Spatial Contract'
    }
  ]);

  const [auditCount, setAuditCount] = useState<number>(() => getSavedAuditRuns().length);

  const appendFrame = (frame: WsFrameLog) => {
    setFrames((prev) => [frame, ...prev].slice(0, 6));
    setAuditCount(getSavedAuditRuns().length);
  };

  useEffect(() => {
    fetchLiveMomenAuditRuns((frame) => {
      setFrames((prev) => [frame, ...prev].slice(0, 6));
    }).then((rows) => {
      setAuditCount(rows.length);
    });
  }, []);

  // Global keyboard shortcuts (Alt+1, Alt+2, Alt+3, Alt+Space, Alt+H)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') setWorkspace('pulse-hud');
      if (e.altKey && e.key === '2') setWorkspace('scale-hud');
      if (e.altKey && e.key === '3') setWorkspace('story-rig');
      if (e.altKey && (e.key === 'h' || e.key === 'H')) setIsHealed((prev) => !prev);
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        setVoiceActive((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleBotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = hudCommand.trim().toLowerCase();
    if (!q) return;

    if (q.includes('heal') || q.includes('fix') || q.includes('fallow') || q.includes('clean')) {
      setWorkspace('pulse-hud');
      setIsHealed(true);
      setBotToast('HANDY_BOT // Executed .kiro/hooks/agentic-clean-gate → Fallow 98/100 (0 cycles)');
    } else if (q.includes('scale') || q.includes('shopee') || q.includes('3d') || q.includes('pack')) {
      setWorkspace('scale-hud');
      setBotToast('HANDY_BOT // Switched to ScaleHUD 1:1 Millimeter 3D Stage');
    } else {
      setBotToast(`HANDY_BOT // Dispatched "${hudCommand}" → Verified by Oxlint + Specta IPC`);
    }
    setHudCommand('');
  };

  const healthScore = isHealed ? 98 : 52;
  const savedRuns = getSavedAuditRuns();

  return (
    <div
      className="deskhud-shell"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#050608',
        color: '#E2F1FF',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #050608; overflow: hidden; }
        @media (max-width: 920px) {
          body { overflow-x: hidden; overflow-y: auto; }
          .deskhud-shell { width: 100% !important; height: auto !important; min-height: 100vh !important; overflow: visible !important; }
          .deskhud-stage { overflow: visible !important; height: auto !important; }
          .deskhud-stage > div { grid-template-columns: 1fr !important; height: auto !important; }
          .deskhud-pill { flex-wrap: wrap !important; width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      {/* TOP BAR: Floating Handy-Style DeskHUD Capsule + Global Mode Switcher */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#090C12',
          borderBottom: '1px solid rgba(0, 240, 255, 0.18)',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              background: isHealed ? '#10B981' : '#FF3300',
              boxShadow: `0 0 10px ${ isHealed ? '#10B981' : '#FF3300' }`
            }}
          />
          <span
            style={{
              fontFamily: 'Syne, Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}
          >
            DESKHUD_OS
          </span>
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              color: '#00F0FF',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              padding: '2px 6px'
            }}
          >
            TAURI_V2 · RUST · KIRO
          </span>
        </div>

        {/* Center Floating Handy Pill (Voice + Command + 3 Core Views) */}
        <div
          className="deskhud-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#050608',
            border: '1px solid rgba(0, 240, 255, 0.32)',
            padding: '4px 6px',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.75)'
          }}
        >
          <button
            data-testid="nav-pulse-hud"
            onClick={() => setWorkspace('pulse-hud')}
            style={{
              background: workspace === 'pulse-hud' ? '#00F0FF' : 'transparent',
              color: workspace === 'pulse-hud' ? '#050608' : '#94A3B8',
              border: 'none',
              padding: '6px 12px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            APP 1 // PULSE_HUD
          </button>

          <button
            data-testid="nav-scale-hud"
            onClick={() => setWorkspace('scale-hud')}
            style={{
              background: workspace === 'scale-hud' ? '#10B981' : 'transparent',
              color: workspace === 'scale-hud' ? '#050608' : '#94A3B8',
              border: 'none',
              padding: '6px 12px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            APP 2 // SCALE_HUD 3D
          </button>

          <button
            data-testid="nav-story-rig"
            onClick={() => setWorkspace('story-rig')}
            style={{
              background: workspace === 'story-rig' ? '#FF9F1C' : 'transparent',
              color: workspace === 'story-rig' ? '#050608' : '#94A3B8',
              border: 'none',
              padding: '6px 12px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            03 // CAMERA RIG
          </button>

          {/* Handy Voice / Command Input inside the Pill */}
          <form onSubmit={handleBotSubmit} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
            <button
              type="button"
              data-testid="handy-voice-btn"
              onClick={() => setVoiceActive(!voiceActive)}
              style={{
                background: voiceActive ? '#FF3366' : 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '5px 8px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Mic size={11} />
              {voiceActive ? 'REC' : 'ALT+SPC'}
            </button>
            <input
              data-testid="handy-bot-input"
              type="text"
              value={hudCommand}
              onChange={(e) => setHudCommand(e.target.value)}
              placeholder='Ask Handy Bot ("heal fallow" / "scale 3d")...'
              style={{
                width: '205px',
                background: '#090C12',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '5px 8px',
                color: '#E2F1FF',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px'
              }}
            />
          </form>
        </div>

        {/* Right Live Fallow & Momen Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px'
          }}
        >
          <span>
            FALLOW:{' '}
            <strong style={{ color: healthScore >= 90 ? '#10B981' : '#FF3366' }}>
              {healthScore}/100
            </strong>
          </span>
          <span style={{ color: '#64748B' }}>|</span>
          <span style={{ color: '#00F0FF' }}>MOMEN_PG: {auditCount}</span>
        </div>
      </header>

      {/* Optional Bot Toast Strip */}
      {botToast && (
        <div
          style={{
            background: 'rgba(0, 240, 255, 0.14)',
            borderBottom: '1px solid #00F0FF',
            padding: '6px 16px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            color: '#00F0FF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{botToast}</span>
          <button
            onClick={() => setBotToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#E2F1FF', cursor: 'pointer', fontFamily: 'IBM Plex Mono' }}
          >
            [X]
          </button>
        </div>
      )}

      {/* MAIN VIEWPORT: Zero-Scroll Spatial Canvas & Surgical Inspector */}
      <main
        className="deskhud-stage"
        style={{
          flex: 1,
          padding: '12px 16px',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        {workspace === 'pulse-hud' && (
          <PulseHudApp
            isHealed={isHealed}
            onToggleHeal={setIsHealed}
            onLogFrame={appendFrame}
          />
        )}
        {workspace === 'scale-hud' && <ScaleHudApp />}
        {workspace === 'story-rig' && (
          <VisualStoryDirector
            onJumpToApp={(target) => setWorkspace(target)}
          />
        )}
      </main>

      {/* BOTTOM WIRE TELEMETRY BAR: .kiro/hooks + Momen GraphQL/WebSocket Wire Frame Stream */}
      <footer
        style={{
          height: '34px',
          background: '#090C12',
          borderTop: '1px solid rgba(0, 240, 255, 0.16)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '10.5px',
          color: '#64748B'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#10B981', fontWeight: 700 }}>● WIRE_BUS</span>
          <span style={{ color: '#E2F1FF' }}>
            [{frames[0]?.direction}] {frames[0]?.type}: {frames[0]?.summary}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '14px', flexShrink: 0 }}>
          <span>SKELETON: packages/deskhud-skeleton</span>
          <span style={{ color: '#00F0FF' }}>APPS: apps/pulse-hud · apps/scale-hud</span>
        </div>
      </footer>
    </div>
  );
};
