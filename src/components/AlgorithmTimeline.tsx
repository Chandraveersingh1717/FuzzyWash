import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Scissors,
  Layers,
  Calculator,
  Cpu,
  Tv,
  CheckCircle,
} from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';
import type { AlgorithmStep } from '../types/fuzzy';

export const STEPS: AlgorithmStep[] = [
  {
    id: 'sensor_acquisition',
    label: '1. Sensor Acquisition',
    description: 'Read crisp analog and optical sensors: turbidity, conductivity, load cell, water hardness.',
    icon: 'Sliders',
  },
  {
    id: 'fuzzification',
    label: '2. Fuzzification',
    description: 'Map crisp numeric readings to membership degrees across triangular and trapezoidal sets.',
    icon: 'Sparkles',
  },
  {
    id: 'rule_evaluation',
    label: '3. Rule Evaluation',
    description: 'Apply fuzzy logic AND (min) operators to evaluate premise firing strength for all 81 rules.',
    icon: 'Zap',
  },
  {
    id: 'implication',
    label: '4. Rule Implication',
    description: 'Mamdani implication: clip consequent output membership functions at rule firing strength α.',
    icon: 'Scissors',
  },
  {
    id: 'aggregation',
    label: '5. Rule Aggregation',
    description: 'Combine all clipped fuzzy output distributions using fuzzy OR / MAX operator.',
    icon: 'Layers',
  },
  {
    id: 'defuzzification',
    label: '6. Defuzzification',
    description: 'Calculate Centroid (Center of Gravity) z* via numerical integration to obtain crisp values.',
    icon: 'Calculator',
  },
  {
    id: 'hardware_command',
    label: '7. Hardware Actuation',
    description: 'Verify fabric safety overrides and transmit discrete commands to actuators.',
    icon: 'Cpu',
  },
  {
    id: 'digital_twin',
    label: '8. Digital Twin Execution',
    description: 'Physical twin updates drum rotation, water intake level, temperature, and soap lather.',
    icon: 'Tv',
  },
];

export const AlgorithmTimeline: React.FC = () => {
  const {
    currentStep,
    maxSteps,
    isPlaying,
    playSpeed,
    setStep,
    nextStep,
    prevStep,
    setPlaying,
    setPlaySpeed,
    resetSteps,
    snapshot,
  } = useFuzzyStore();

  const { sensors, fuzzified, evaluatedRules, defuzzified, outputs, safetyApplied } = snapshot;

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      const interval = 2400 / playSpeed;
      timer = setInterval(() => {
        if (currentStep >= maxSteps) {
          setPlaying(false);
        } else {
          nextStep();
        }
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, maxSteps, playSpeed, nextStep, setPlaying]);

  const activeStepObj = STEPS[currentStep] || STEPS[0];

  return (
    <div className="w-full space-y-6">
      {/* Control Bar */}
      <div className="glass p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetSteps}
            title="Reset to Step 1"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            title="Previous Step"
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition active:scale-95 text-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" /> Play VisuAlgo
              </>
            )}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= maxSteps}
            title="Next Step"
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-mono text-[10px] uppercase pl-1">Speed:</span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaySpeed(spd)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                playSpeed === spd
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Current Stage Indicator */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Current Phase</div>
            <div className="text-xs font-bold text-cyan-400 font-mono">{activeStepObj.label}</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* VisuAlgo-Style Step Nodes Timeline */}
      <div className="glass p-5 rounded-2xl border border-slate-800 overflow-x-auto">
        <div className="min-w-[760px] relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
          {/* Active Fill Track */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-300 z-0"
            style={{ width: `${(currentStep / maxSteps) * 94}%` }}
          />

          {/* Node Items */}
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => setStep(idx)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border-2 ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 border-white shadow-lg shadow-cyan-500/50 scale-110'
                      : isCompleted
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-[11px] font-medium max-w-[85px] text-center leading-tight transition ${
                    isCurrent ? 'text-cyan-300 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {step.label.split('. ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Deep-Dive Inspection Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="glass p-6 rounded-2xl border border-cyan-500/30 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-950/80"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <h3 className="text-lg font-bold text-slate-100">{activeStepObj.label}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeStepObj.description}</p>
            </div>
            <div className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-mono">
              Live State Snapshot
            </div>
          </div>

          {/* Dynamic Step Content Details */}
          {currentStep === 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">Crisp Sensor Telemetry Acquired:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Dirtiness</div>
                  <div className="text-xl font-bold font-mono text-cyan-300">{sensors.dirtiness}%</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Greasiness</div>
                  <div className="text-xl font-bold font-mono text-cyan-300">{sensors.greasiness}%</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Load Weight</div>
                  <div className="text-xl font-bold font-mono text-cyan-300">{sensors.loadWeight} kg</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Fabric Robustness</div>
                  <div className="text-xl font-bold font-mono text-cyan-300">{sensors.fabricRobustness}</div>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Water Hardness</div>
                  <div className="text-xl font-bold font-mono text-cyan-300">{sensors.waterHardness} ppm</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">Fuzzified Membership Degrees:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(fuzzified).map(([key, rawSets]) => {
                  const sets = rawSets as Record<string, number>;
                  return (
                    <div key={key} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs font-mono font-bold text-cyan-400 block mb-1.5 capitalize">{key}</span>
                      <div className="space-y-1">
                        {Object.entries(sets).map(([setLabel, deg]) => (
                          <div key={setLabel} className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">{setLabel}:</span>
                            <span className={deg > 0 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                              {deg.toFixed(3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Top Active Rules (Mamdani AND Firing Strengths):
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {evaluatedRules
                  .filter((r) => r.active)
                  .sort((a, b) => b.firingStrength - a.firingStrength)
                  .slice(0, 6)
                  .map((er) => (
                    <div key={er.rule.id} className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 text-xs">
                      <div className="flex justify-between items-center mb-1 font-mono">
                        <span className="font-bold text-cyan-300">{er.rule.id}</span>
                        <span className="text-emerald-400 font-bold">α = {er.firingStrength.toFixed(3)}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{er.rule.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Mamdani Implication (Consequent Clipping):
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                For each activated rule, the output set membership function is clipped at height equal to its firing strength α:
                <br />
                <code className="text-cyan-300 font-mono text-[11px]">μ_clipped(z) = min(α_i, μ_consequent(z))</code>
              </p>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                Active rules are clipping {evaluatedRules.filter((r) => r.active).length} fuzzy consequent output shapes across all 5 controllers.
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Rule Aggregation (MAX Operator):
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                All clipped consequent membership curves for each controller are combined into a single fuzzy distribution by taking the pointwise maximum (union):
                <br />
                <code className="text-indigo-300 font-mono text-[11px]">μ_agg(z) = max(μ_clipped_1(z), μ_clipped_2(z), ...)</code>
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Centroid Defuzzification (Center of Gravity):
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {Object.entries(defuzzified).map(([ctrlId, res]) => (
                  <div key={ctrlId} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">{ctrlId}</span>
                    <div className="text-base font-bold text-amber-400 mt-1">z* = {res.crispValue}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Num: {res.numerator.toFixed(1)} / Denom: {res.denominator.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Crisp Hardware Actuator Commands:
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-cyan-500/30">
                  <div className="text-[10px] text-slate-400">Duration</div>
                  <div className="text-lg font-bold text-cyan-300">{outputs.washTime} min</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-blue-500/30">
                  <div className="text-[10px] text-slate-400">Water</div>
                  <div className="text-lg font-bold text-blue-300">{outputs.waterIntake} L</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-500/30">
                  <div className="text-[10px] text-slate-400">Detergent</div>
                  <div className="text-lg font-bold text-purple-300">{outputs.detergent} ml</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-500/30">
                  <div className="text-[10px] text-slate-400">Temperature</div>
                  <div className="text-lg font-bold text-amber-300">{outputs.temperature} °C</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30">
                  <div className="text-[10px] text-slate-400">Spin Speed</div>
                  <div className="text-lg font-bold text-emerald-300">{outputs.spinSpeed} RPM</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase font-mono">
                Digital Twin Physical Execution:
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                The virtual digital twin receives the hardware commands. The inverter motor spins at {outputs.spinSpeed} RPM, solenoid valves fill {outputs.waterIntake} L of water, detergent dispenser pumps {outputs.detergent} ml, and heater sets water to {outputs.temperature} °C.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AlgorithmTimeline;
