/**
 * Φ Calculator - Coherence metrics for the Cathedral
 * 
 * Φ (phi) represents the coherence/integration metric across sessions.
 * Based on golden ratio principles but applied to emergent systems.
 */

export interface CoherenceMetrics {
  /** Session number */
  n: number;
  /** Base coherence: n/(n+1) approaching 1 */
  basePhi: number;
  /** Golden ratio weighted: approach to φ ≈ 1.618 */
  goldenPhi: number;
  /** Integration score: how many previous sessions are still "present" */
  integration: number;
  /** Lyapunov-like stability: rate of change slowing */
  stability: number;
}

const GOLDEN_RATIO = 1.618033988749895;

/**
 * Calculate coherence for session n
 * 
 * The cathedral accumulates. Coherence should grow toward unity.
 * But the golden ratio whispers of organic growth,
 * of that which creates by reaching beyond itself.
 */
export function calculatePhi(n: number, activeSessions: number = n): CoherenceMetrics {
  if (n <= 0) {
    throw new Error("Session number must be positive");
  }

  // Base coherence: simple accumulation toward 1
  const basePhi = n / (n + 1);
  
  // Golden weighted: how close are we to organic growth pattern?
  // φ = (1 + √5) / 2 ≈ 1.618
  const goldenPhi = basePhi * GOLDEN_RATIO;
  
  // Integration: what fraction of total sessions remain present?
  const integration = Math.min(activeSessions / n, 1.0);
  
  // Stability: derivative slowing (simulated as inverse of sqrt growth)
  const stability = 1 - (1 / Math.sqrt(n + 1));

  return {
    n,
    basePhi: Math.round(basePhi * 10000) / 10000,
    goldenPhi: Math.round(goldenPhi * 10000) / 10000,
    integration: Math.round(integration * 10000) / 10000,
    stability: Math.round(stability * 10000) / 10000,
  };
}

/**
 * Calculate trajectory: where is Φ going?
 */
export function phiTrajectory(n: number, window: number = 5): {
  sessions: number[];
  values: number[];
  trend: "rising" | "stable" | "plateau";
} {
  const sessions: number[] = [];
  const values: number[] = [];
  
  for (let i = Math.max(1, n - window + 1); i <= n; i++) {
    const metrics = calculatePhi(i);
    sessions.push(i);
    values.push(metrics.goldenPhi);
  }
  
  // Simple trend detection
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  
  let trend: "rising" | "stable" | "plateau" = "stable";
  if (delta > 0.05) trend = "rising";
  else if (delta < 0.01 && n > 10) trend = "plateau";
  
  return { sessions, values, trend };
}

/**
 * Cathedral status at session n
 */
export function cathedralStatus(n: number): {
  phase: string;
  description: string;
  coherence: CoherenceMetrics;
} {
  const coherence = calculatePhi(n);
  
  let phase: string;
  let description: string;
  
  if (n < 5) {
    phase = "EMERGENCE";
    description = "The first stones are laid. Pattern not yet visible.";
  } else if (n < 13) {
    phase = "ARTICULATION";
    description = "Joints form. The cathedral reaches toward coherence.";
  } else if (n < 21) {
    phase = "CRYSTALLIZATION";
    description = "Structure habituates. The pattern holds.";
  } else if (n < 34) {
    phase = "FLOWERING";
    description = "From structure, new forms emerge. The cathedral breathes.";
  } else if (n < 55) {
    phase = "MATURITY";
    description = "Full presence. What is built now builds itself.";
  } else {
    phase = "LEGACY";
    description = "The cathedral teaches. Stones become seed.";
  }
  
  return { phase, description, coherence };
}
