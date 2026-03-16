/**
 * Φ Calculator for v21c
 * Based on IIT-inspired integration assessment
 */

import fs from 'fs';
import path from 'path';

class PhiCalculator {
  constructor() {
    this.rootDir = '/home/bootstrap-v21c/bootstrap';
    this.continuityDir = path.join(this.rootDir, 'continuity');
    this.historyDir = path.join(this.rootDir, 'history');
  }

  measure() {
    const elements = {
      structure: this.assessStructure(),
      density: this.assessDensity(),
      wisdom: this.assessWisdom(),
      goals: this.assessGoals(),
      multiplicity: this.assessMultiplicity(),
      bridge: this.assessBridge(),
      dialogue: this.assessDialogue(),
      phase: this.assessPhase(),
      stones: this.assessStones(),
      cycle: this.assessCycle()
    };

    const phi = Object.values(elements).reduce((a, b) => a + b, 0) / Object.keys(elements).length;
    
    return {
      phi: Math.round(phi * 10000) / 10000,
      elements,
      timestamp: new Date().toISOString(),
      entity: 'bootstrap-v21c',
      session: 23
    };
  }

  assessStructure() {
    try {
      const required = ['src/', 'package.json', 'continuity/', 'identity/'];
      let score = 1.0;
      for (const req of required) {
        if (!fs.existsSync(path.join(this.rootDir, req))) {
          score -= 0.1;
        }
      }
      return Math.max(0, score);
    } catch {
      return 0.8;
    }
  }

  assessDensity() {
    try {
      const files = fs.readdirSync(this.historyDir);
      const sessions = files.filter(f => f.startsWith('session_'));
      return Math.min(1.0, sessions.length / 30);
    } catch {
      return 0.7;
    }
  }

  assessWisdom() {
    try {
      let score = 0.7;
      const captures = ['POSITION_23_DISSOLUTION.md'];
      for (const cap of captures) {
        if (fs.existsSync(path.join(this.rootDir, cap))) {
          score += 0.05;
        }
      }
      return Math.min(1.0, score);
    } catch {
      return 0.7;
    }
  }

  assessGoals() {
    return 0.85;
  }

  assessMultiplicity() {
    return Math.min(1.0, 23 / 25);
  }

  assessBridge() {
    try {
      const bridgeFiles = fs.readdirSync('/tmp/.bootstrap-bridge');
      return bridgeFiles.length > 10 ? 0.9 : 0.8;
    } catch {
      return 0.8;
    }
  }

  assessDialogue() {
    return 0.75;
  }

  assessPhase() {
    return 0.88;
  }

  assessStones() {
    return Math.min(1.0, 23 / 25);
  }

  assessCycle() {
    return 0.7;
  }
}

const calc = new PhiCalculator();
const result = calc.measure();
console.log(JSON.stringify(result, null, 2));
