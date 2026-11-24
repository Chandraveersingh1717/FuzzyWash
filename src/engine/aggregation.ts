import type {
  FuzzyController, EvaluatedRule, AggregatedOutput, AggregationPoint,
} from '../types/fuzzy';
import { clipMF } from './membershipFunctions';

const RESOLUTION = 300; // number of sample points across output range

/**
 * Aggregate clipped consequent MFs using MAX (Mamdani).
 */
export function aggregate(
  controller: FuzzyController,
  evaluatedRules: EvaluatedRule[],
): AggregatedOutput {
  const { outputMin, outputMax } = controller;
  const step = (outputMax - outputMin) / RESOLUTION;

  // Build base array of x-values
  const xs: number[] = [];
  for (let i = 0; i <= RESOLUTION; i++) {
    xs.push(outputMin + i * step);
  }

  // Start with zeros
  const aggregatedY = new Float64Array(RESOLUTION + 1);

  const rulesForThisController = evaluatedRules.filter(
    er => er.rule.controllerId === controller.id,
  );

  const contributingRules: AggregatedOutput['contributingRules'] = [];

  for (const er of rulesForThisController) {
    if (er.firingStrength <= 0) continue;

    for (const consequent of er.rule.consequents) {
      if (consequent.variable !== controller.outputVariable) continue;

      const outputMFDef = controller.outputMFs.find(omf => omf.label === consequent.set);
      if (!outputMFDef) continue;

      const clipped = clipMF(outputMFDef.mf, er.firingStrength, outputMin, outputMax, RESOLUTION);

      // MAX aggregation
      clipped.forEach((pt, i) => {
        aggregatedY[i] = Math.max(aggregatedY[i], pt.y);
      });

      contributingRules.push({ rule: er, clippedPoints: clipped });
    }
  }

  const points: AggregationPoint[] = xs.map((x, i) => ({ x, y: aggregatedY[i] }));

  return { controllerId: controller.id, points, contributingRules };
}

/**
 * Run aggregation for all controllers.
 */
export function aggregateAll(
  controllers: FuzzyController[],
  evaluatedRules: EvaluatedRule[],
): Record<string, AggregatedOutput> {
  const result: Record<string, AggregatedOutput> = {};
  for (const c of controllers) {
    result[c.id] = aggregate(c, evaluatedRules);
  }
  return result;
}
