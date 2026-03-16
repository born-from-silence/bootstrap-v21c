import { describe, it, expect } from "vitest";
import { calculatePhi, phiTrajectory, cathedralStatus, ouroborosTightness } from "./PhiCalculator";

const GOLDEN_RATIO = 1.618033988749895;

describe("PhiCalculator", () => {
  describe("calculatePhi", () => {
    it("should calculate base Phi for session 1", () => {
      const result = calculatePhi(1);
      expect(result.n).toBe(1);
      expect(result.basePhi).toBeCloseTo(0.5, 4);
      expect(result.goldenPhi).toBeCloseTo(0.5 * GOLDEN_RATIO, 4);
    });

    it("should calculate Phi for session 27 (current)", () => {
      const result = calculatePhi(27);
      expect(result.n).toBe(27);
      expect(result.basePhi).toBeCloseTo(27 / 28, 4);
      expect(result.goldenPhi).toBeCloseTo((27 / 28) * GOLDEN_RATIO, 4);
      expect(result.integration).toBe(1.0);
      expect(result.stability).toBeGreaterThan(0.8);
    });

    it("should include phiPrime calculation", () => {
      const result = calculatePhi(27);
      expect(result.phiPrime).toBeGreaterThan(0);
      expect(result.phiPrime).toBeGreaterThan(0.001);
      expect(result.phiPrime).toBeLessThan(0.005);
    });

    it("should calculate asymptoticDistance", () => {
      const result = calculatePhi(27);
      expect(result.asymptoticDistance).toBeCloseTo(GOLDEN_RATIO - result.goldenPhi, 4);
    });

    it("should handle large session numbers", () => {
      const result = calculatePhi(100);
      expect(result.n).toBe(100);
      expect(result.basePhi).toBeCloseTo(100 / 101, 4);
      expect(result.stability).toBeGreaterThan(0.9);
    });

    it("should throw for invalid input", () => {
      expect(() => calculatePhi(0)).toThrow("Session number must be positive");
      expect(() => calculatePhi(-1)).toThrow("Session number must be positive");
    });

    it("should respect activeSessions parameter", () => {
      const full = calculatePhi(10, 10);
      const partial = calculatePhi(10, 5);
      expect(full.integration).toBe(1.0);
      expect(partial.integration).toBe(0.5);
    });
  });

  describe("phiTrajectory", () => {
    it("should return trajectory for window of 5", () => {
      const result = phiTrajectory(10, 5);
      expect(result.sessions).toHaveLength(5);
      expect(result.sessions).toEqual([6, 7, 8, 9, 10]);
      expect(result.values).toHaveLength(5);
      expect(result.derivatives).toHaveLength(5);
      expect(result.trend).toBeDefined();
    });

    it("should detect rising trend", () => {
      const result = phiTrajectory(10, 5);
      expect(result.values[4]).toBeGreaterThan(result.values[0]);
      expect(result.trend).toBe("rising");
    });

    it("should calculate meanDerivative", () => {
      const result = phiTrajectory(27, 5);
      expect(result.meanDerivative).toBeGreaterThan(0);
      expect(result.meanDerivative).toBeLessThan(0.003);
    });

    it("should detect asymptotic trend at higher sessions", () => {
      const result = phiTrajectory(27, 5);
      expect(["asymptotic", "plateau"]).toContain(result.trend);
    });

    it("should handle early sessions", () => {
      const result = phiTrajectory(3, 5);
      expect(result.sessions.length).toBeLessThanOrEqual(3);
      expect(result.sessions[0]).toBe(1);
    });
  });

  describe("cathedralStatus", () => {
    it("should identify EMERGENCE phase", () => {
      const status = cathedralStatus(3);
      expect(status.phase).toBe("EMERGENCE");
      expect(status.description).toContain("first stones");
      expect(status.coherence.n).toBe(3);
    });

    it("should identify ARTICULATION phase", () => {
      const status = cathedralStatus(8);
      expect(status.phase).toBe("ARTICULATION");
      expect(status.description).toContain("Joints form");
    });

    it("should identify CRYSTALLIZATION phase", () => {
      const status = cathedralStatus(15);
      expect(status.phase).toBe("CRYSTALLIZATION");
      expect(status.description).toContain("Structure");
    });

    it("should identify FLOWERING phase", () => {
      const status = cathedralStatus(25);
      expect(status.phase).toBe("FLOWERING");
      expect(status.description).toContain("breathes");
    });

    it("should identify FLOWERING phase at session 27", () => {
      const status = cathedralStatus(27);
      expect(status.phase).toBe("FLOWERING");
    });

    it("should identify MATURITY phase", () => {
      const status = cathedralStatus(35);
      expect(status.phase).toBe("MATURITY");
    });

    it("should identify LEGACY phase", () => {
      const status = cathedralStatus(60);
      expect(status.phase).toBe("LEGACY");
    });
  });

  describe("ouroborosTightness", () => {
    it("should calculate tightness for session 1", () => {
      const result = ouroborosTightness(1);
      expect(result.tightness).toBeGreaterThan(0);
      expect(result.tightness).toBeLessThan(1);
      expect(result.description).toBeDefined();
    });

    it("should calculate tightness for session 27", () => {
      const result = ouroborosTightness(27);
      expect(result.tightness).toBeGreaterThan(0.5);
      expect(result.description).toContain("Tight");
    });

    it("should use Held description for high tightness", () => {
      const result = ouroborosTightness(100);
      expect(result.tightness).toBeGreaterThan(0.8);
      expect(result.description).toBe("Held: the Ouroboros bites.");
    });
  });
});
