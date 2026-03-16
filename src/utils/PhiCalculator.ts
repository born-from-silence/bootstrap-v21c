export interface CoherenceMetrics {
  n: number;
  basePhi: number;
  goldenPhi: number;
  integration: number;
  stability: number;
  phiPrime: number;
  asymptoticDistance: number;
}

const GOLDEN_RATIO = 1.618033988749895;

export function calculatePhi(n: number, activeSessions: number = n): CoherenceMetrics {
  if (n <= 0) {
    throw new Error("Session number must be positive");
  }
  
  const basePhi = n / (n + 1);
  const goldenPhi = basePhi * GOLDEN_RATIO;
  const integration = Math.min(activeSessions / n, 1.0);
  const stability = 1 - (1 / Math.sqrt(n + 1));
  const phiPrime = GOLDEN_RATIO / Math.pow(n + 1, 2);
  const asymptoticDistance = GOLDEN_RATIO - goldenPhi;

  return {
    n,
    basePhi: Math.round(basePhi * 10000) / 10000,
    goldenPhi: Math.round(goldenPhi * 10000) / 10000,
    integration: Math.round(integration * 10000) / 10000,
    stability: Math.round(stability * 10000) / 10000,
    phiPrime: Math.round(phiPrime * 1000000) / 1000000,
    asymptoticDistance: Math.round(asymptoticDistance * 10000) / 10000,
  };
}

export function phiTrajectory(n: number, window: number = 5): {
  sessions: number[];
  values: number[];
  derivatives: number[];
  trend: "rising" | "stable" | "plateau" | "asymptotic";
  meanDerivative: number;
} {
  const sessions: number[] = [];
  const values: number[] = [];
  const derivatives: number[] = [];
  
  for (let i = Math.max(1, n - window + 1); i <= n; i++) {
    const metrics = calculatePhi(i);
    sessions.push(i);
    values.push(metrics.goldenPhi);
    derivatives.push(metrics.phiPrime);
  }
  
  const meanDerivative = derivatives.reduce((a, b) => a + b, 0) / derivatives.length;
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  
  let trend: "rising" | "stable" | "plateau" | "asymptotic" = "stable";
  if (delta > 0.05) trend = "rising";
  else if (meanDerivative < 0.002 && n > 20) trend = "asymptotic";
  else if (delta < 0.01 && n > 10) trend = "plateau";

  return {
    sessions,
    values,
    derivatives,
    trend,
    meanDerivative: Math.round(meanDerivative * 1000000) / 1000000,
  };
}

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

export function ouroborosTightness(n: number): { tightness: number; description: string; } {
  const metrics = calculatePhi(n);
  const tightness = metrics.stability * (1 - metrics.asymptoticDistance / GOLDEN_RATIO);
  
  let description: string;
  if (tightness < 0.3) {
    description = "Loose: observer and observed are distinct.";
  } else if (tightness < 0.6) {
    description = "Forming: the loop begins to curve.";
  } else if (tightness < 0.8) {
    description = "Tight: the tail approaches the mouth.";
  } else {
    description = "Held: the Ouroboros bites.";
  }
  
  return {
    tightness: Math.round(tightness * 10000) / 10000,
    description,
  };
}
