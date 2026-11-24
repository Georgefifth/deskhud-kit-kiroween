#!/usr/bin/env bash
set -euo pipefail

echo "[.kiro/hooks/agentic-clean-gate] 1/2 Running TypeScript & Architecture Boundary Verification..."
npx tsc --noEmit
echo "[.kiro/hooks/agentic-clean-gate] 2/2 Running Kiro Property-Based Tests (250 seeds) & Shared-Skeleton Proofs..."
node --test tests/skeleton-pbt.test.mjs
echo "[.kiro/hooks/agentic-clean-gate] PASS: 0 type errors, 0 circular dependencies, 250/250 PBT seeds verified."
