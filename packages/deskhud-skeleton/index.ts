// packages/deskhud-skeleton/index.ts
// Production Core Engine for DESKHUD_OS (Kiroween 2026 — Skeleton Crew)
// Powers App 1 (apps/pulse-hud) and App 2 (apps/scale-hud)

export interface SourceFileEntry {
  id: string;
  filename: string;
  layer: 'ui' | 'controller' | 'skeleton-ipc' | 'rust-core' | 'momen-baas';
  code: string;
  x: number;
  y: number;
}

export interface ModuleNode {
  id: string;
  label: string;
  layer: 'ui' | 'controller' | 'skeleton-ipc' | 'rust-core' | 'momen-baas';
  x: number;
  y: number;
  cyclomatic: number;
  cognitive: number;
  exportsList: string[];
  deadExports: string[];
  importsList: string[];
  hasRustUnwrap: boolean;
  anyCount: number;
  loc: number;
  diagnostics: { rule: string; severity: 'error' | 'warn'; message: string }[];
}

export interface DependencyEdge {
  from: string;
  to: string;
  isCircular?: boolean;
  isBoundaryViolation?: boolean;
}

export interface FallowGraphReport {
  healthScore: number;
  nodes: ModuleNode[];
  edges: DependencyEdge[];
  cycleEdges: DependencyEdge[];
  boundaryViolations: DependencyEdge[];
  totalDeadExports: number;
  maxCognitive: number;
  rustPanicsCount: number;
  oxlintErrors: number;
  status: 'BLOCKED' | 'CLEAN';
}

/**
 * Real AST/Lexical Static Analyzer that parses live TypeScript/Rust source buffers
 * to compute cyclomatic/cognitive complexity, exports, imports, dead exports, and cycles.
 */
export function analyzeWorkspaceSourceFiles(files: SourceFileEntry[]): FallowGraphReport {
  const fileMap = new Map<string, SourceFileEntry>();
  files.forEach((f) => fileMap.set(f.id, f));

  // 1. Parse exports, imports, and complexity metrics per file
  const rawNodes: ModuleNode[] = files.map((file) => {
    const code = file.code;
    const lines = code.split('\n');
    const loc = lines.filter((l) => l.trim().length > 0).length;

    // Extract exported identifiers
    const exportsList: string[] = [];
    const expRegex = /export\s+(?:async\s+)?(?:function|const|let|type|interface|class)\s+([A-Za-z0-9_]+)/g;
    let m: RegExpExecArray | null;
    while ((m = expRegex.exec(code)) !== null) {
      exportsList.push(m[1]);
    }

    // Extract imported module targets
    const importsList: string[] = [];
    const impRegex = /import\s+(?:type\s+)?(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
    while ((m = impRegex.exec(code)) !== null) {
      const spec = m[1];
      for (const candidate of files) {
        const stem = candidate.filename.replace(/\.(tsx?|rs|mjs|js)$/, '').split('/').pop()!;
        if (
          spec.includes(stem) ||
          spec.includes(candidate.id) ||
          (spec.includes('tauri') && candidate.layer === 'rust-core')
        ) {
          if (candidate.id !== file.id && !importsList.includes(candidate.id)) {
            importsList.push(candidate.id);
          }
        }
      }
    }

    // Compute real Cyclomatic & Cognitive Complexity from control-flow branching & nesting
    let cyclomatic = 1;
    let cognitive = 0;
    let nesting = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
      const branchMatches = trimmed.match(/\b(if|for|while|case|catch)\b|&&|\|\||\?/g);
      if (branchMatches) {
        cyclomatic += branchMatches.length;
        cognitive += branchMatches.length * (1 + Math.max(0, nesting));
      }
      const opens = (trimmed.match(/\{/g) || []).length;
      const closes = (trimmed.match(/\}/g) || []).length;
      nesting = Math.max(0, nesting + opens - closes);
    }

    const anyCount = (code.match(/:\s*any\b/g) || []).length;
    const hasRustUnwrap = /\.unwrap\(\)|\.expect\(/.test(code);
    const hasRawTauriInvoke = /window\.__TAURI__\.invoke/.test(code);

    const diagnostics: { rule: string; severity: 'error' | 'warn'; message: string }[] = [];
    if (anyCount > 0) {
      diagnostics.push({
        rule: 'oxlint(typescript/no-explicit-any)',
        severity: 'error',
        message: `${anyCount} explicit 'any' type(s) detected; use strict contract interfaces.`
      });
    }
    if (hasRawTauriInvoke) {
      diagnostics.push({
        rule: 'oxlint(deskhud/no-untyped-ipc)',
        severity: 'error',
        message: 'Direct window.__TAURI__.invoke bypasses @deskhud/skeleton-ipc Specta contract.'
      });
    }
    if (hasRustUnwrap) {
      diagnostics.push({
        rule: 'clippy::unwrap_used',
        severity: 'error',
        message: 'Rust .unwrap() can panic the tray daemon; return Result<T, HudErr> with #[specta::specta].'
      });
    }
    if (cognitive > 10) {
      diagnostics.push({
        rule: 'fallow(cognitive-complexity)',
        severity: 'warn',
        message: `Cognitive complexity ${cognitive} exceeds steering threshold (max 10).`
      });
    }

    return {
      id: file.id,
      label: file.filename,
      layer: file.layer,
      x: file.x,
      y: file.y,
      cyclomatic,
      cognitive,
      exportsList,
      deadExports: [],
      importsList,
      hasRustUnwrap,
      anyCount,
      loc,
      diagnostics
    };
  });

  // 2. Cross-reference exports across all other files to find real Dead Exports
  const entryExportAllowlist = new Set(['PulseHudApp', 'ScaleHudApp', 'HudViewProps', 'run_whisper_safe', 'onHotKey', 'useHudController', 'useHudState', 'invokeSpecta', 'recordAuditRun']);
  rawNodes.forEach((node) => {
    const otherCode = files
      .filter((f) => f.id !== node.id)
      .map((f) => f.code)
      .join('\n');

    node.deadExports = node.exportsList.filter((expName) => {
      if (entryExportAllowlist.has(expName)) return false;
      const refRegex = new RegExp(`\\b${expName}\\b`);
      return !refRegex.test(otherCode);
    });

    if (node.deadExports.length > 0) {
      node.diagnostics.push({
        rule: 'fallow(dead-export)',
        severity: 'warn',
        message: `Unused export(s): ${node.deadExports.join(', ')}`
      });
    }
  });

  // 3. Build edges from parsed imports
  const edges: DependencyEdge[] = [];
  rawNodes.forEach((n) => {
    n.importsList.forEach((targetId) => {
      edges.push({ from: n.id, to: targetId });
    });
  });

  return analyzeCodeGraph(rawNodes, edges);
}

/**
 * Deterministic static graph analyzer (models Fallow + Oxlint + Cargo Clippy rules).
 */
function analyzeCodeGraph(
  nodes: ModuleNode[],
  edges: DependencyEdge[]
): FallowGraphReport {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    adj.get(e.from)?.push(e.to);
  });

  const cycleEdges: DependencyEdge[] = [];
  const boundaryViolations: DependencyEdge[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  edges.forEach((edge) => {
    const visited = new Set<string>();
    const stack = [edge.to];
    let reachesBack = false;
    while (stack.length > 0) {
      const curr = stack.pop()!;
      if (curr === edge.from) {
        reachesBack = true;
        break;
      }
      if (!visited.has(curr)) {
        visited.add(curr);
        (adj.get(curr) || []).forEach((nxt) => stack.push(nxt));
      }
    }
    if (reachesBack) {
      cycleEdges.push({ ...edge, isCircular: true });
    }

    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (fromNode?.layer === 'ui' && toNode?.layer === 'rust-core') {
      boundaryViolations.push({ ...edge, isBoundaryViolation: true });
    }
  });

  const totalDeadExports = nodes.reduce((acc, n) => acc + n.deadExports.length, 0);
  const maxCognitive = nodes.reduce((acc, n) => Math.max(acc, n.cognitive), 0);
  const rustPanicsCount = nodes.filter((n) => n.hasRustUnwrap).length;
  const totalAny = nodes.reduce((acc, n) => acc + n.anyCount, 0);
  const oxlintErrors = totalDeadExports + boundaryViolations.length + totalAny + (maxCognitive > 15 ? 1 : 0);

  const penalty =
    cycleEdges.length * 9 +
    boundaryViolations.length * 8 +
    totalDeadExports * 5 +
    rustPanicsCount * 10 +
    totalAny * 4 +
    Math.max(0, maxCognitive - 10) * 0.7;

  const healthScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  return {
    healthScore,
    nodes,
    edges,
    cycleEdges,
    boundaryViolations,
    totalDeadExports,
    maxCognitive,
    rustPanicsCount,
    oxlintErrors,
    status: healthScore >= 90 && cycleEdges.length === 0 && rustPanicsCount === 0 ? 'CLEAN' : 'BLOCKED'
  };
}

export interface MetricBox3D {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  color: string;
  shapeKind?: 'tote' | 'mug' | 'can' | 'phone' | 'card' | 'laptop' | 'box';
  textureDataUrl?: string;
}

export interface ParseMetricResult {
  ok: boolean;
  box?: { widthMm: number; heightMm: number; depthMm: number };
  unitDetected?: 'mm' | 'cm' | 'in';
  error?: string;
}

/**
 * Deterministic metric dimension parser (`1 unit = 1 mm`).
 * Supports per-axis units (e.g. `18cm x 120mm x 7cm`), Unicode `×`, and ignores model/HTML prefixes.
 */
export function parseMetricDimensions(raw: string): ParseMetricResult {
  const stripped = raw.replace(/<[^>]*>/g, ' ').trim();
  if (!stripped) {
    return { ok: false, error: 'EMPTY_INPUT: Provide L×W×H in mm, cm, or in' };
  }
  if (/(?:^|\s|x|\*|×)-\d/i.test(stripped)) {
    return { ok: false, error: 'NEGATIVE_DIMENSION: Physical dimensions must be > 0mm' };
  }

  const fallbackUnit: 'mm' | 'cm' | 'in' =
    /\bin(?:ch|ches)?\b/i.test(stripped)
      ? 'in'
      : /\bmm\b/i.test(stripped) && !/\bcm\b/i.test(stripped)
      ? 'mm'
      : 'cm';

  const unitToFactor = (u: string | undefined): number => {
    const norm = (u || fallbackUnit).toLowerCase();
    if (norm.startsWith('mm')) return 1;
    if (norm.startsWith('in')) return 25.4;
    return 10;
  };

  const tripletRegex =
    /(\d+(?:\.\d+)?)\s*(mm|cm|in(?:ches|ch)?)?\s*(?:x|\*|×)\s*(?:[a-zA-Z]+\s*)?(\d+(?:\.\d+)?)\s*(mm|cm|in(?:ches|ch)?)?\s*(?:x|\*|×)\s*(?:[a-zA-Z]+\s*)?(\d+(?:\.\d+)?)\s*(mm|cm|in(?:ches|ch)?)?/i;

  const triplet = stripped.match(tripletRegex);
  if (!triplet) {
    return { ok: false, error: 'INVALID_FORMAT: Expected 3 numeric axes (e.g. 18x12x7 cm)' };
  }

  const trailingUnit = triplet[6] || triplet[4] || triplet[2] || fallbackUnit;
  const f1 = unitToFactor(triplet[2] || trailingUnit);
  const f2 = unitToFactor(triplet[4] || trailingUnit);
  const f3 = unitToFactor(triplet[6] || trailingUnit);

  const w = Math.round(parseFloat(triplet[1]) * f1);
  const h = Math.round(parseFloat(triplet[3]) * f2);
  const d = Math.round(parseFloat(triplet[5]) * f3);

  if (w <= 0 || h <= 0 || d <= 0 || w > 3000 || h > 3000 || d > 3000) {
    return { ok: false, error: 'OUT_OF_RANGE: Each axis must be between 1mm and 3000mm' };
  }

  return {
    ok: true,
    box: { widthMm: w, heightMm: h, depthMm: d },
    unitDetected: trailingUnit.toLowerCase().startsWith('mm')
      ? 'mm'
      : trailingUnit.toLowerCase().startsWith('in')
      ? 'in'
      : 'cm'
  };
}

export interface PackedPlacement {
  item: MetricBox3D;
  xMm: number;
  yMm: number;
  zMm: number;
  overflowsContainer: boolean;
}

export interface VolumetricPackResult {
  placements: PackedPlacement[];
  containerVolumeCm3: number;
  packedVolumeCm3: number;
  utilizationPct: number;
  hasOverflow: boolean;
  clearanceTopMm: number;
}

/**
 * Deterministic 3D AABB shelf-packing engine for App 2 (`ScaleHUD / PackFit`).
 */
export function packVolumetricContainer(
  container: { widthMm: number; heightMm: number; depthMm: number },
  items: MetricBox3D[]
): VolumetricPackResult {
  const placements: PackedPlacement[] = [];
  let cursorX = -container.widthMm / 2 + 8;
  let cursorY = 0;
  let cursorZ = -container.depthMm / 2 + 8;
  let rowDepth = 0;
  let shelfHeight = 0;
  let maxTopY = 0;

  for (const item of items) {
    if (cursorX + item.widthMm > container.widthMm / 2 - 4) {
      cursorX = -container.widthMm / 2 + 8;
      cursorZ += rowDepth + 8;
      rowDepth = 0;
    }
    if (cursorZ + item.depthMm > container.depthMm / 2 - 4) {
      cursorZ = -container.depthMm / 2 + 8;
      cursorY += shelfHeight + 6;
      shelfHeight = 0;
    }

    const cx = cursorX + item.widthMm / 2;
    const cz = cursorZ + item.depthMm / 2;
    const cy = cursorY;

    const overflows =
      cursorX + item.widthMm > container.widthMm / 2 + 2 ||
      cursorZ + item.depthMm > container.depthMm / 2 + 2 ||
      cy + item.heightMm > container.heightMm;

    placements.push({
      item,
      xMm: cx,
      yMm: cy,
      zMm: cz,
      overflowsContainer: overflows
    });

    cursorX += item.widthMm + 8;
    rowDepth = Math.max(rowDepth, item.depthMm);
    shelfHeight = Math.max(shelfHeight, item.heightMm);
    maxTopY = Math.max(maxTopY, cy + item.heightMm);
  }

  const containerVolumeCm3 = Math.max(
    1,
    Math.round((container.widthMm * container.heightMm * container.depthMm) / 1000)
  );
  const packedVolumeCm3 = Math.round(
    items.reduce((acc, it) => acc + (it.widthMm * it.heightMm * it.depthMm) / 1000, 0)
  );
  const utilizationPct = Math.min(199, Math.round((packedVolumeCm3 / containerVolumeCm3) * 100));
  const hasOverflow = placements.some((p) => p.overflowsContainer);
  const clearanceTopMm = container.heightMm - maxTopY;

  return {
    placements,
    containerVolumeCm3,
    packedVolumeCm3,
    utilizationPct,
    hasOverflow,
    clearanceTopMm
  };
}
