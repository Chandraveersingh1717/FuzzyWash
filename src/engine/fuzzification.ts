import type {
  SensorReading, FuzzifiedInputs, FuzzyVariable,
} from '../types/fuzzy';
import { evaluateAllMFs } from './membershipFunctions';
import {
  DIRTINESS_VAR, GREASINESS_VAR, LOAD_WEIGHT_VAR,
  FABRIC_ROBUSTNESS_VAR, WATER_HARDNESS_VAR,
} from '../data/membershipDefaults';

/** Map sensor key to its FuzzyVariable definition */
const VAR_MAP: Record<keyof SensorReading, FuzzyVariable> = {
  dirtiness:        DIRTINESS_VAR,
  greasiness:       GREASINESS_VAR,
  loadWeight:       LOAD_WEIGHT_VAR,
  fabricRobustness: FABRIC_ROBUSTNESS_VAR,
  waterHardness:    WATER_HARDNESS_VAR,
};

/**
 * Fuzzify all five sensor readings.
 * Returns membership degrees for every linguistic set of every variable.
 */
export function fuzzify(sensors: SensorReading): FuzzifiedInputs {
  const fuzzified: Partial<FuzzifiedInputs> = {};

  for (const key of Object.keys(VAR_MAP) as (keyof SensorReading)[]) {
    const variable = VAR_MAP[key];
    const crispValue = sensors[key];
    fuzzified[key] = evaluateAllMFs(variable.membershipFunctions, crispValue);
  }

  return fuzzified as FuzzifiedInputs;
}

/** Get the fuzzy variable for a given sensor key */
export function getVariableForSensor(key: keyof SensorReading): FuzzyVariable {
  return VAR_MAP[key];
}
