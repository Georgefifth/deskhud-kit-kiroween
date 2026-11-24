#!/usr/bin/env bash
set -euo pipefail

echo "[.kiro/hooks/agentic-clean-gate] 1/4 Running Oxlint (oxc) AST Clean-Code Check..."
npx -y oxlint --deny-warnings src packages apps
echo "[.kiro/hooks/agentic-clean-gate] 2/4 Running Fallow Repository Graph Dead-Code Audit..."
npx -y fallow dead-code
echo "[.kiro/hooks/agentic-clean-gate] 3/4 Running TypeScript & Architecture Boundary Verification..."
npx tsc --noEmit
echo "[.kiro/hooks/agentic-clean-gate] 4/4 Running Kiro Property-Based Tests (250 seeds) & Real-World Regression..."
node --test tests/skeleton-pbt.test.mjs
echo "[.kiro/hooks/agentic-clean-gate] PASS: 0 Oxlint warnings, 0 Fallow dead code, 0 type errors, 250/250 PBT seeds verified."
