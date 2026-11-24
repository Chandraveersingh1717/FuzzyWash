import type {
  FuzzyRule, FuzzifiedInputs, EvaluatedRule,
  FuzzyController,
} from '../types/fuzzy';

/**
 * Evaluate a single rule given fuzzified inputs.
 * Uses MIN for AND, MAX for OR.
 */
export function evaluateRule(
  rule: FuzzyRule,
  fuzzified: FuzzifiedInputs,
): EvaluatedRule {
  const conditionValues = rule.conditions.map(cond => {
    const degrees = fuzzified[cond.variable];
    const value = degrees?.[cond.set] ?? 0;
    return { condition: cond, value };
  });

  let firingStrength: number;
  if (rule.operator === 'AND') {
    firingStrength = conditionValues.reduce(
      (acc, cv) => Math.min(acc, cv.value),
      1,
    );
  } else {
    // OR
    firingStrength = conditionValues.reduce(
      (acc, cv) => Math.max(acc, cv.value),
      0,
    );
  }

  return {
    rule,
    conditionValues,
    firingStrength: parseFloat(firingStrength.toFixed(6)),
    active: firingStrength > 0.001,
  };
}

/**
 * Evaluate all rules of a controller.
 */
export function evaluateController(
  controller: FuzzyController,
  fuzzified: FuzzifiedInputs,
): EvaluatedRule[] {
  return controller.rules.map(rule => evaluateRule(rule, fuzzified));
}

/**
 * Evaluate all controllers.
 */
export function evaluateAllControllers(
  controllers: FuzzyController[],
  fuzzified: FuzzifiedInputs,
): EvaluatedRule[] {
  return controllers.flatMap(c => evaluateController(c, fuzzified));
}
