import type { FuzzyVariable, MembershipFunction } from '../types/fuzzy';

// ─── COLOR PALETTES ──────────────────────────────────────────────────────────
const TRICOLORS = {
  low:    '#22D3EE',
  med:    '#8B5CF6',
  high:   '#F97316',
  extra:  '#10B981',
  vhigh:  '#EF4444',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const tri = (a: number, b: number, c: number, label: string, color: string): MembershipFunction => ({
  type: 'triangular', a, b, c, label, color,
});
const trap = (a: number, b: number, c: number, d: number, label: string, color: string): MembershipFunction => ({
  type: 'trapezoidal', a, b, c, d, label, color,
});

// ─── INPUT VARIABLES ─────────────────────────────────────────────────────────

export const DIRTINESS_VAR: FuzzyVariable = {
  id: 'dirtiness',
  name: 'Dirtiness',
  unit: '%',
  min: 0,
  max: 100,
  membershipFunctions: [
    trap(0, 0, 25, 50,   'Small',  TRICOLORS.low),
    tri(25, 50, 75,      'Medium', TRICOLORS.med),
    trap(50, 75, 100, 100, 'Large', TRICOLORS.high),
  ],
};

export const GREASINESS_VAR: FuzzyVariable = {
  id: 'greasiness',
  name: 'Greasiness',
  unit: '%',
  min: 0,
  max: 100,
  membershipFunctions: [
    trap(0, 0, 20, 45,    'NotGreasy', TRICOLORS.low),
    tri(30, 50, 70,       'Medium',    TRICOLORS.med),
    trap(55, 80, 100, 100,'Greasy',    TRICOLORS.high),
  ],
};

export const LOAD_WEIGHT_VAR: FuzzyVariable = {
  id: 'loadWeight',
  name: 'Load Weight',
  unit: 'kg',
  min: 0,
  max: 10,
  membershipFunctions: [
    trap(0, 0, 2, 4,    'Light',  TRICOLORS.low),
    tri(2.5, 5, 7.5,    'Medium', TRICOLORS.med),
    trap(6, 8, 10, 10,  'Heavy',  TRICOLORS.high),
  ],
};

export const FABRIC_ROBUSTNESS_VAR: FuzzyVariable = {
  id: 'fabricRobustness',
  name: 'Fabric Robustness',
  unit: '',
  min: 0,
  max: 100,
  membershipFunctions: [
    trap(0, 0, 20, 40,     'Delicate',   TRICOLORS.low),
    tri(25, 50, 75,        'Normal',     TRICOLORS.med),
    trap(60, 80, 100, 100, 'HeavyDuty',  TRICOLORS.high),
  ],
};

export const WATER_HARDNESS_VAR: FuzzyVariable = {
  id: 'waterHardness',
  name: 'Water Hardness',
  unit: 'ppm',
  min: 0,
  max: 300,
  membershipFunctions: [
    trap(0, 0, 50, 100,       'Soft',     TRICOLORS.low),
    tri(75, 150, 225,         'Moderate', TRICOLORS.med),
    trap(175, 225, 300, 300,  'Hard',     TRICOLORS.high),
  ],
};

export const ALL_INPUT_VARS: FuzzyVariable[] = [
  DIRTINESS_VAR,
  GREASINESS_VAR,
  LOAD_WEIGHT_VAR,
  FABRIC_ROBUSTNESS_VAR,
  WATER_HARDNESS_VAR,
];

// ─── OUTPUT MEMBERSHIP FUNCTIONS ─────────────────────────────────────────────

export const WASH_TIME_MFS: MembershipFunction[] = [
  trap(0, 0, 8, 15,      'VeryShort', TRICOLORS.low),
  tri(10, 18, 26,        'Short',     TRICOLORS.extra),
  tri(20, 30, 40,        'Medium',    TRICOLORS.med),
  tri(34, 44, 54,        'Long',      TRICOLORS.high),
  trap(48, 56, 60, 60,   'VeryLong',  TRICOLORS.vhigh),
];

export const WATER_INTAKE_MFS: MembershipFunction[] = [
  trap(15, 15, 22, 30,  'Low',    TRICOLORS.low),
  tri(22, 37, 52,       'Medium', TRICOLORS.med),
  trap(44, 52, 60, 60,  'High',   TRICOLORS.high),
];

export const DETERGENT_MFS: MembershipFunction[] = [
  trap(10, 10, 25, 40,  'Small',  TRICOLORS.low),
  tri(28, 55, 72,       'Medium', TRICOLORS.med),
  trap(60, 78, 100, 100,'Large',  TRICOLORS.high),
];

export const TEMPERATURE_MFS: MembershipFunction[] = [
  trap(20, 20, 28, 40,  'Cold', TRICOLORS.low),
  tri(30, 50, 65,       'Warm', TRICOLORS.med),
  trap(55, 68, 80, 80,  'Hot',  TRICOLORS.vhigh),
];

export const SPIN_SPEED_MFS: MembershipFunction[] = [
  trap(400, 400, 500, 650,    'Gentle', TRICOLORS.low),
  tri(550, 800, 1050,         'Normal', TRICOLORS.med),
  trap(950, 1150, 1400, 1400, 'High',   TRICOLORS.high),
];
