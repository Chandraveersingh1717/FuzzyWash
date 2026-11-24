// ─── Core Fuzzy Types ───────────────────────────────────────────────────────

export type MFType = 'triangular' | 'trapezoidal';

export interface TriangularMF {
  type: 'triangular';
  a: number; // left foot
  b: number; // peak
  c: number; // right foot
  label: string;
  color: string;
}

export interface TrapezoidalMF {
  type: 'trapezoidal';
  a: number; // left foot
  b: number; // left shoulder
  c: number; // right shoulder
  d: number; // right foot
  label: string;
  color: string;
}

export type MembershipFunction = TriangularMF | TrapezoidalMF;

export interface FuzzyVariable {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  membershipFunctions: MembershipFunction[];
}

export interface SensorReading {
  dirtiness: number;    // 0–100 %
  greasiness: number;   // 0–100 %
  loadWeight: number;   // 0–10 kg
  fabricRobustness: number; // 0–100
  waterHardness: number;    // 0–300 ppm
}

export interface MembershipDegrees {
  [setLabel: string]: number;
}

export interface FuzzifiedInputs {
  dirtiness: MembershipDegrees;
  greasiness: MembershipDegrees;
  loadWeight: MembershipDegrees;
  fabricRobustness: MembershipDegrees;
  waterHardness: MembershipDegrees;
}

// ─── Rules ──────────────────────────────────────────────────────────────────

export interface RuleCondition {
  variable: keyof SensorReading;
  set: string;
}

export interface RuleConsequent {
  variable: string;
  set: string;
}

export interface FuzzyRule {
  id: string;
  conditions: RuleCondition[];
  consequents: RuleConsequent[];
  operator: 'AND' | 'OR';
  description: string;
  controllerId: string;
}

export interface EvaluatedRule {
  rule: FuzzyRule;
  conditionValues: { condition: RuleCondition; value: number }[];
  firingStrength: number;
  active: boolean;
}

// ─── Controllers ────────────────────────────────────────────────────────────

export interface OutputMF {
  label: string;
  mf: MembershipFunction;
  color: string;
}

export interface FuzzyController {
  id: string;
  name: string;
  outputVariable: string;
  outputMin: number;
  outputMax: number;
  outputUnit: string;
  outputMFs: OutputMF[];
  rules: FuzzyRule[];
}

// ─── Aggregation ─────────────────────────────────────────────────────────────

export interface AggregationPoint {
  x: number;
  y: number;
}

export interface AggregatedOutput {
  controllerId: string;
  points: AggregationPoint[];
  contributingRules: { rule: EvaluatedRule; clippedPoints: AggregationPoint[] }[];
}

// ─── Defuzzification ─────────────────────────────────────────────────────────

export interface DefuzzResult {
  controllerId: string;
  crispValue: number;
  numerator: number;
  denominator: number;
  centroidX: number;
}

// ─── Final Outputs ────────────────────────────────────────────────────────────

export interface WashOutputs {
  washTime: number;      // 0–60 min
  waterIntake: number;   // 15–60 L
  detergent: number;     // 10–100 ml
  temperature: number;   // 20–80 °C
  spinSpeed: number;     // 400–1400 RPM
}

// ─── Complete Simulation State ─────────────────────────────────────────────

export interface SimulationSnapshot {
  sensors: SensorReading;
  fuzzified: FuzzifiedInputs;
  evaluatedRules: EvaluatedRule[];
  aggregated: { [controllerId: string]: AggregatedOutput };
  defuzzified: { [controllerId: string]: DefuzzResult };
  outputs: WashOutputs;
  safetyApplied: string[];
}

// ─── Algorithm Steps ───────────────────────────────────────────────────────

export type AlgorithmStepId =
  | 'sensor_acquisition'
  | 'fuzzification'
  | 'rule_evaluation'
  | 'implication'
  | 'aggregation'
  | 'defuzzification'
  | 'hardware_command'
  | 'digital_twin';

export interface AlgorithmStep {
  id: AlgorithmStepId;
  label: string;
  description: string;
  icon: string;
}

// ─── Presets ──────────────────────────────────────────────────────────────

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  sensors: SensorReading;
}

// ─── Validation ───────────────────────────────────────────────────────────

export interface ValidationTest {
  id: string;
  name: string;
  description: string;
  expected: number;
  tolerance: number;
  compute: () => number;
}

export interface ValidationResult {
  test: ValidationTest;
  actual: number;
  passed: boolean;
  diff: number;
}
