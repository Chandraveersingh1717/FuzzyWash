import { create } from 'zustand';
import type {
  SensorReading, SimulationSnapshot, FuzzyVariable,
  AlgorithmStepId,
} from '../types/fuzzy';
import { runSimulation } from '../engine/simulation';
import { DEFAULT_SENSORS } from '../data/presets';
import {
  DIRTINESS_VAR, GREASINESS_VAR, LOAD_WEIGHT_VAR,
  FABRIC_ROBUSTNESS_VAR, WATER_HARDNESS_VAR,
} from '../data/membershipDefaults';

export type PageId =
  | 'dashboard'
  | 'simulator'
  | 'timemachine'
  | 'laboratory'
  | 'rules'
  | 'defuzzification'
  | 'comparison'
  | 'fuzzyVsTraditional'
  | 'fuzzy-vs-traditional'
  | 'learn'
  | 'validation';

interface FuzzyStore {
  // ── Navigation ──────────────────────────────────────────────────────────
  activePage: PageId;
  setActivePage: (p: PageId) => void;

  // ── Sensor Inputs ────────────────────────────────────────────────────────
  sensors: SensorReading;
  setSensor: (key: keyof SensorReading, value: number) => void;
  setSensors: (s: SensorReading) => void;

  // ── Simulation ───────────────────────────────────────────────────────────
  snapshot: SimulationSnapshot;
  recalculate: () => void;

  // ── Fuzzy Variables (editable) ───────────────────────────────────────────
  inputVars: FuzzyVariable[];
  updateInputVar: (varId: string, mfLabel: string, params: Partial<{ a: number; b: number; c: number; d: number }>) => void;
  resetInputVars: () => void;

  // ── Algorithm Time Machine ───────────────────────────────────────────────
  currentStep: number;
  maxSteps: number;
  isPlaying: boolean;
  playSpeed: number;
  setStep: (n: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPlaying: (b: boolean) => void;
  setPlaySpeed: (s: number) => void;
  resetSteps: () => void;

  // ── Comparison Mode ──────────────────────────────────────────────────────
  scenarioA: SensorReading;
  scenarioB: SensorReading;
  snapshotA: SimulationSnapshot;
  snapshotB: SimulationSnapshot;
  setScenariosAB: (a: SensorReading, b: SensorReading) => void;
  setSensorA: (key: keyof SensorReading, value: number) => void;
  setSensorB: (key: keyof SensorReading, value: number) => void;

  // ── Machine State ────────────────────────────────────────────────────────
  machineRunning: boolean;
  machineStage: string;
  machineProgress: number;
  startMachine: () => void;
  pauseMachine: () => void;
  resetMachine: () => void;
  setMachineStage: (s: string) => void;
  setMachineProgress: (p: number) => void;

  // ── Active highlight step for Time Machine ───────────────────────────────
  highlightedStepId: AlgorithmStepId | null;
  setHighlightedStep: (s: AlgorithmStepId | null) => void;
}

const DEFAULT_VARS: FuzzyVariable[] = [
  DIRTINESS_VAR, GREASINESS_VAR, LOAD_WEIGHT_VAR, FABRIC_ROBUSTNESS_VAR, WATER_HARDNESS_VAR,
];

const A_SENSORS: SensorReading = { dirtiness: 20, greasiness: 10, loadWeight: 2, fabricRobustness: 80, waterHardness: 80 };
const B_SENSORS: SensorReading = { dirtiness: 90, greasiness: 85, loadWeight: 8, fabricRobustness: 30, waterHardness: 250 };

export const useFuzzyStore = create<FuzzyStore>((set, get) => ({
  // ── Navigation ───────────────────────────────────────────────────────────
  activePage: 'dashboard',
  setActivePage: (p) => set({ activePage: p }),

  // ── Sensor Inputs ─────────────────────────────────────────────────────────
  sensors: { ...DEFAULT_SENSORS },
  setSensor: (key, value) => {
    const sensors = { ...get().sensors, [key]: value };
    set({ sensors });
    get().recalculate();
  },
  setSensors: (s) => {
    set({ sensors: s });
    get().recalculate();
  },

  // ── Simulation ────────────────────────────────────────────────────────────
  snapshot: runSimulation({ ...DEFAULT_SENSORS }),
  recalculate: () => {
    const snap = runSimulation(get().sensors);
    set({ snapshot: snap });
  },

  // ── Fuzzy Variables ───────────────────────────────────────────────────────
  inputVars: DEFAULT_VARS.map(v => ({ ...v, membershipFunctions: v.membershipFunctions.map(mf => ({ ...mf })) })),
  updateInputVar: (varId, mfLabel, params) => {
    const vars = get().inputVars.map(v => {
      if (v.id !== varId) return v;
      return {
        ...v,
        membershipFunctions: v.membershipFunctions.map(mf => {
          if (mf.label !== mfLabel) return mf;
          return { ...mf, ...params };
        }),
      };
    });
    set({ inputVars: vars });
    get().recalculate();
  },
  resetInputVars: () => {
    set({ inputVars: DEFAULT_VARS.map(v => ({ ...v, membershipFunctions: v.membershipFunctions.map(mf => ({ ...mf })) })) });
    get().recalculate();
  },

  // ── Algorithm Time Machine ────────────────────────────────────────────────
  currentStep: 0,
  maxSteps: 7,
  isPlaying: false,
  playSpeed: 1,
  setStep: (n) => set({ currentStep: Math.max(0, Math.min(7, n)) }),
  nextStep: () => set(s => ({ currentStep: Math.min(s.maxSteps, s.currentStep + 1) })),
  prevStep: () => set(s => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  setPlaying: (b) => set({ isPlaying: b }),
  setPlaySpeed: (s) => set({ playSpeed: s }),
  resetSteps: () => set({ currentStep: 0, isPlaying: false }),

  // ── Comparison Mode ───────────────────────────────────────────────────────
  scenarioA: A_SENSORS,
  scenarioB: B_SENSORS,
  snapshotA: runSimulation(A_SENSORS),
  snapshotB: runSimulation(B_SENSORS),
  setScenariosAB: (a, b) => set({
    scenarioA: a, scenarioB: b,
    snapshotA: runSimulation(a),
    snapshotB: runSimulation(b),
  }),
  setSensorA: (key, value) => {
    const a = { ...get().scenarioA, [key]: value };
    set({ scenarioA: a, snapshotA: runSimulation(a) });
  },
  setSensorB: (key, value) => {
    const b = { ...get().scenarioB, [key]: value };
    set({ scenarioB: b, snapshotB: runSimulation(b) });
  },

  // ── Machine State ─────────────────────────────────────────────────────────
  machineRunning: false,
  machineStage: 'Idle',
  machineProgress: 0,
  startMachine: () => set({ machineRunning: true, machineStage: 'Filling', machineProgress: 0 }),
  pauseMachine: () => set({ machineRunning: false }),
  resetMachine: () => set({ machineRunning: false, machineStage: 'Idle', machineProgress: 0 }),
  setMachineStage: (s) => set({ machineStage: s }),
  setMachineProgress: (p) => set({ machineProgress: p }),

  // ── Highlighted step ──────────────────────────────────────────────────────
  highlightedStepId: null,
  setHighlightedStep: (s) => set({ highlightedStepId: s }),
}));
