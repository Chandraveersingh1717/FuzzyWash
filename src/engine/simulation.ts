import type {
  SensorReading, SimulationSnapshot, WashOutputs,
} from '../types/fuzzy';
import { fuzzify } from './fuzzification';
import { evaluateAllControllers } from './inference';
import { aggregateAll } from './aggregation';
import { defuzzifyAll } from './defuzzification';
import { ALL_CONTROLLERS } from './ruleBase';

/**
 * Run the complete fuzzy logic pipeline.
 * Returns a full snapshot of every computational stage.
 */
export function runSimulation(sensors: SensorReading): SimulationSnapshot {
  // Step 1: Fuzzification
  const fuzzified = fuzzify(sensors);

  // Step 2: Rule evaluation (all controllers)
  const evaluatedRules = evaluateAllControllers(ALL_CONTROLLERS, fuzzified);

  // Step 3: Aggregation
  const aggregated = aggregateAll(ALL_CONTROLLERS, evaluatedRules);

  // Step 4: Defuzzification
  const defuzzified = defuzzifyAll(ALL_CONTROLLERS, aggregated);

  // Step 5: Map to hardware outputs
  const safetyApplied: string[] = [];

  let washTime    = defuzzified['washTime']?.crispValue    ?? 30;
  let waterIntake = defuzzified['waterIntake']?.crispValue ?? 37;
  let detergent   = defuzzified['detergent']?.crispValue   ?? 55;
  let temperature = defuzzified['temperature']?.crispValue ?? 50;
  let spinSpeed   = defuzzified['spinSpeed']?.crispValue   ?? 800;

  // ─── Safety Constraints ───────────────────────────────────────────────────
  const delicateDegree = fuzzified.fabricRobustness['Delicate'] ?? 0;

  if (delicateDegree > 0.3) {
    if (temperature > 60) {
      temperature = 60 - (temperature - 60) * 0.5;
      safetyApplied.push('Temperature capped at ~60°C for delicate fabrics');
    }
    if (spinSpeed > 800) {
      spinSpeed = 800;
      safetyApplied.push('Spin speed capped at 800 RPM for delicate fabrics');
    }
  }

  // Clamp all outputs to valid hardware ranges
  washTime    = Math.max(0,   Math.min(60,   washTime));
  waterIntake = Math.max(15,  Math.min(60,   waterIntake));
  detergent   = Math.max(10,  Math.min(100,  detergent));
  temperature = Math.max(20,  Math.min(80,   temperature));
  spinSpeed   = Math.max(400, Math.min(1400, spinSpeed));

  const outputs: WashOutputs = {
    washTime:    parseFloat(washTime.toFixed(1)),
    waterIntake: parseFloat(waterIntake.toFixed(1)),
    detergent:   parseFloat(detergent.toFixed(1)),
    temperature: parseFloat(temperature.toFixed(1)),
    spinSpeed:   parseFloat(spinSpeed.toFixed(0)),
  };

  return { sensors, fuzzified, evaluatedRules, aggregated, defuzzified, outputs, safetyApplied };
}
