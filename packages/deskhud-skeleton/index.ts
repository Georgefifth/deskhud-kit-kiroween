// packages/deskhud-skeleton/index.ts
// Core Reusable Skeleton Engine for Kiroween 2026 (Skeleton Crew Track)
// Powers both App 1 (apps/pulse-hud) and App 2 (apps/scale-hud)

export interface ModuleNode {
  id: string;
  label: string;
  layer: 'ui' | 'controller' | 'skeleton-ipc' | 'rust-core' | 'momen-baas';
  x: number;
  y: number;
  cyclomatic: number;
  cognitive: number;
  deadExports: string[];
  hasRustUnwrap: boolean;
  loc: number;
}

export interface DependencyEdge {
  from: string;
  to: string;
  isCircular?: boolean;
  isBoundaryViolation?: boolean;
}

export interface FallowGraphReport {
  healthScore: number;
  cycleEdges: DependencyEdge[];
  boundaryViolations: DependencyEdge[];
  totalDeadExports: number;
  maxCognitive: number;
  rustPanicsCount: number;
  oxlintErrors: number;
  status: 'BLOCKED' | 'CLEAN';
}

/**
 * Deterministic static graph analyzer (models Fallow + Oxlint + Cargo Clippy rules).
 */
export function analyzeCodeGraph(
  nodes: ModuleNode[],
  edges: DependencyEdge[]
): FallowGraphReport {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    adj.get(e.from)?.push(e.to);
  });

  // Detect cycles via DFS back-edge check
  const cycleEdges: DependencyEdge[] = [];
  const boundaryViolations: DependencyEdge[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  edges.forEach((edge) => {
    // Check if 'to' can reach 'from'
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
  const oxlintErrors = totalDeadExports + boundaryViolations.length + (maxCognitive > 15 ? 1 : 0);

  const penalty =
    cycleEdges.length * 9 +
    boundaryViolations.length * 8 +
    totalDeadExports * 5 +
    rustPanicsCount * 10 +
    Math.max(0, maxCognitive - 10) * 0.7;

  const healthScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  return {
    healthScore,
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

  // Match explicit 3-axis triplet separated by x, *, ×, or axis labels
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
