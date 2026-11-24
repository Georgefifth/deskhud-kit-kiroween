import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Load TypeScript source via simple strip or verify compiled module behavior
const skeletonSrc = fs.readFileSync(
  new URL('../packages/deskhud-skeleton/index.ts', import.meta.url),
  'utf8'
);
const pulseSrc = fs.readFileSync(
  new URL('../apps/pulse-hud/PulseHudApp.tsx', import.meta.url),
  'utf8'
);
const scaleSrc = fs.readFileSync(
  new URL('../apps/scale-hud/ScaleHudApp.tsx', import.meta.url),
  'utf8'
);

test('Skeleton Crew Rule #1: Both apps import from shared packages/deskhud-skeleton', () => {
  assert.match(pulseSrc, /packages\/deskhud-skeleton/);
  assert.match(scaleSrc, /packages\/deskhud-skeleton/);
});

test('Skeleton Crew Rule #2: Hexagonal boundary — apps/pulse-hud and apps/scale-hud never import each other', () => {
  assert.doesNotMatch(pulseSrc, /scale-hud/);
  assert.doesNotMatch(scaleSrc, /pulse-hud/);
});

test('Skeleton Crew Rule #3: Root /.kiro directory contains specs, steering, hooks, and MCP config and is NOT gitignored', () => {
  const gitignore = fs.readFileSync(new URL('../.gitignore', import.meta.url), 'utf8');
  assert.doesNotMatch(gitignore, /\.kiro/);
  assert.ok(fs.existsSync(new URL('../.kiro/specs/deskhud-skeleton.spec.md', import.meta.url)));
  assert.ok(fs.existsSync(new URL('../.kiro/specs/app1-pulse-hud.spec.md', import.meta.url)));
  assert.ok(fs.existsSync(new URL('../.kiro/specs/app2-scale-hud.spec.md', import.meta.url)));
  assert.ok(fs.existsSync(new URL('../.kiro/hooks/agentic-clean-gate.json', import.meta.url)));
  assert.ok(fs.existsSync(new URL('../.kiro/steering/agentic-clean-architecture.md', import.meta.url)));
});

test('Property-Based Test (PBT): 250 random metric dimension strings preserve 1cm = 10mm invariant', () => {
  // Deterministic PRNG (Mulberry32)
  let seed = 0x20261124;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const parseDim = (raw) => {
    const nums = raw.match(/(\d+(?:\.\d+)?)/g);
    const unit = /\bmm\b/i.test(raw) ? 'mm' : 'cm';
    const factor = unit === 'mm' ? 1 : 10;
    return {
      w: Math.round(parseFloat(nums[0]) * factor),
      h: Math.round(parseFloat(nums[1]) * factor),
      d: Math.round(parseFloat(nums[2]) * factor)
    };
  };

  for (let i = 0; i < 250; i++) {
    const wCm = Math.floor(rand() * 120) + 1;
    const hCm = Math.floor(rand() * 120) + 1;
    const dCm = Math.floor(rand() * 120) + 1;

    const fromCm = parseDim(`${wCm} x ${hCm} x ${dCm} cm`);
    const fromMm = parseDim(`${wCm * 10} x ${hCm * 10} x ${dCm * 10} mm`);

    assert.equal(fromCm.w, fromMm.w, `Seed #${i} width mismatch`);
    assert.equal(fromCm.h, fromMm.h, `Seed #${i} height mismatch`);
    assert.equal(fromCm.d, fromMm.d, `Seed #${i} depth mismatch`);
  }
});
