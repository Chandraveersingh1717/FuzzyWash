import type { AggregatedOutput, DefuzzResult, FuzzyController } from '../types/fuzzy';

/**
 * Centroid (Center of Gravity) defuzzification.
 * z* = ∫ z·μ(z) dz / ∫ μ(z) dz
 * Uses trapezoidal numerical integration over aggregated points.
 */
export function defuzzify(
  controller: FuzzyController,
  aggregated: AggregatedOutput,
): DefuzzResult {
  const pts = aggregated.points;
  const n = pts.length;

  if (n < 2) {
    const mid = (controller.outputMin + controller.outputMax) / 2;
    return { controllerId: controller.id, crispValue: mid, numerator: 0, denominator: 0, centroidX: mid };
  }

  let numerator = 0;
  let denominator = 0;

  // Trapezoidal rule
  for (let i = 0; i < n - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const yAvg = (pts[i].y + pts[i + 1].y) / 2;
    const xAvg = (pts[i].x + pts[i + 1].x) / 2;
    numerator   += xAvg * yAvg * dx;
    denominator += yAvg * dx;
  }

  let crispValue: number;
  if (denominator < 1e-9) {
    // Fallback: use midpoint of output range
    crispValue = (controller.outputMin + controller.outputMax) / 2;
  } else {
    crispValue = numerator / denominator;
  }

  // Clamp to output range
  crispValue = Math.max(controller.outputMin, Math.min(controller.outputMax, crispValue));

  return {
    controllerId: controller.id,
    crispValue: parseFloat(crispValue.toFixed(4)),
    numerator:   parseFloat(numerator.toFixed(4)),
    denominator: parseFloat(denominator.toFixed(4)),
    centroidX:   parseFloat(crispValue.toFixed(4)),
  };
}

/**
 * Defuzzify all controllers.
 */
export function defuzzifyAll(
  controllers: FuzzyController[],
  aggregated: Record<string, AggregatedOutput>,
): Record<string, DefuzzResult> {
  const result: Record<string, DefuzzResult> = {};
  for (const c of controllers) {
    result[c.id] = defuzzify(c, aggregated[c.id]);
  }
  return result;
}
