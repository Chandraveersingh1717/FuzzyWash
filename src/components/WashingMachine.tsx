import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Waves, Flame, Gauge, Clock, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';

const INFERENCE_STAGES = [
  'Idle',
  'Sensors Reading',
  'Fuzzification',
  'Rule Evaluation',
  'Aggregation',
  'Defuzzification',
  'Washing in Progress',
  'Completed',
];

const PHYSICAL_STAGES = ['Filling', 'Heating', 'Washing', 'Rinsing', 'Spinning', 'Completed'];

export const WashingMachine: React.FC = () => {
  const {
    snapshot,
    machineRunning,
    machineStage,
    machineProgress,
    startMachine,
    pauseMachine,
    resetMachine,
    setMachineStage,
    setMachineProgress,
  } = useFuzzyStore();

  const { outputs } = snapshot;
  const [simulationMode, setSimulationMode] = useState<'inference' | 'physical'>('inference');

  // Automatic Cycle Progression
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (machineRunning) {
      timer = setInterval(() => {
        setMachineProgress(Math.min(100, machineProgress + 1));

        const stageList = simulationMode === 'inference' ? INFERENCE_STAGES : PHYSICAL_STAGES;
        const currentIdx = Math.min(
          stageList.length - 1,
          Math.floor((machineProgress / 100) * (stageList.length - 1))
        );

        if (machineProgress >= 100) {
          setMachineStage('Completed');
          pauseMachine();
        } else {
          setMachineStage(stageList[currentIdx]);
        }
      }, 250);
    }
    return () => clearInterval(timer);
  }, [machineRunning, machineProgress, simulationMode, pauseMachine, setMachineProgress, setMachineStage]);

  // Rotation duration based on spinSpeed (400 - 1400 RPM)
  const isSpinning = machineRunning && (machineStage === 'Washing' || machineStage === 'Spinning' || machineStage === 'Washing in Progress');
  const rotationDuration = isSpinning
    ? Math.max(0.3, 2.8 - ((outputs.spinSpeed - 400) / 1000) * 2.3)
    : 0;

  // Water fill height inside drum (15 - 60 L mapped to 20% - 75% height)
  const isWaterFilled = machineStage !== 'Idle' && machineStage !== 'Sensors Reading';
  const waterHeightPercent = isWaterFilled ? 20 + ((outputs.waterIntake - 15) / 45) * 55 : 0;

  // Foam bubble count (10 - 100 ml)
  const isFoaming = isWaterFilled && outputs.detergent > 15;
  const bubbleCount = isFoaming ? Math.floor(6 + (outputs.detergent / 100) * 18) : 0;

  // Temperature color & glow
  const isHeating = machineRunning && (machineStage === 'Heating' || machineStage === 'Washing' || machineStage === 'Washing in Progress');
  const tempHue = Math.min(360, 210 - ((outputs.temperature - 20) / 60) * 210); // 210 (cyan) to 0 (red)
  const tempColor = `hsl(${tempHue}, 90%, 55%)`;

  return (
    <div className="flex flex-col items-center glass p-6 rounded-3xl relative overflow-hidden shadow-2xl border border-cyan-500/30 w-full max-w-md">
      {/* Dynamic Ambient Heating/Cooling Glow */}
      <div
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: tempColor }}
      />

      {/* Machine Header & Stage Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> Digital Twin
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-cyan-950/90 border border-cyan-500/30 text-cyan-300 rounded-full font-mono">
              Fuzzy-Actuated
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2 tracking-tight">
            Smart Wash Pro 9000
          </h3>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${machineRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span className="text-[11px] font-mono font-bold text-slate-200">{machineStage}</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">{simulationMode} timeline</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="w-full flex items-center justify-between bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-mono">
        <button
          onClick={() => setSimulationMode('inference')}
          className={`flex-1 py-1.5 rounded-lg transition font-medium ${
            simulationMode === 'inference'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fuzzy Pipeline
        </button>
        <button
          onClick={() => setSimulationMode('physical')}
          className={`flex-1 py-1.5 rounded-lg transition font-medium ${
            simulationMode === 'physical'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hardware Wash Cycle
        </button>
      </div>

      {/* The Physical Washing Machine Chassis */}
      <div className="w-full aspect-[4/5] bg-gradient-to-b from-slate-800 via-slate-900 to-[#080d1a] rounded-3xl p-5 flex flex-col justify-between border-2 border-slate-700/80 shadow-2xl relative">
        {/* Top Control Panel */}
        <div className="bg-slate-950/95 rounded-2xl p-3 border border-slate-800 shadow-md flex items-center justify-between">
          {/* Detergent Dispenser Drawer */}
          <div className="flex flex-col gap-0.5">
            <div className="w-16 h-6 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center relative overflow-hidden">
              <span className="text-[9px] font-mono text-cyan-300 font-bold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> {outputs.detergent}ml
              </span>
              {machineRunning && machineStage === 'Filling' && (
                <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
              )}
            </div>
            <span className="text-[8px] text-slate-400 font-mono uppercase text-center">Dispenser</span>
          </div>

          {/* LED Micro-controller Display */}
          <div className="bg-cyan-950/70 border border-cyan-500/40 rounded-xl px-3 py-1.5 flex flex-col items-center">
            <div className="flex items-center gap-2.5">
              <span className="text-cyan-300 font-mono text-base font-black tracking-wider">
                {machineRunning
                  ? `${Math.max(1, Math.ceil(outputs.washTime * (1 - machineProgress / 100)))}m`
                  : `${outputs.washTime} min`}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                {outputs.spinSpeed} RPM
              </span>
            </div>
            <div className="w-24 bg-slate-800/80 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${machineProgress}%` }}
              />
            </div>
          </div>

          {/* Rotary Dial Knob */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border-2 border-slate-600 flex items-center justify-center shadow-lg cursor-pointer hover:border-cyan-400 transition">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          </div>
        </div>

        {/* Circular Glass Drum Door */}
        <div className="relative w-60 h-60 mx-auto rounded-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-3 shadow-2xl border-4 border-slate-600/80 flex items-center justify-center">
          {/* Outer Glass Bezel */}
          <div className="w-full h-full rounded-full bg-slate-950/95 relative overflow-hidden border-4 border-cyan-500/25 shadow-inner flex items-center justify-center">
            
            {/* Heating Element Glow Ring inside drum */}
            {isHeating && (
              <div
                className="absolute inset-2 rounded-full border-2 border-dashed opacity-75 animate-pulse pointer-events-none z-5 transition-colors duration-700"
                style={{ borderColor: tempColor, boxShadow: `inset 0 0 20px ${tempColor}` }}
              />
            )}

            {/* Water Fill Layer */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600/80 via-blue-500/60 to-cyan-400/30 backdrop-blur-[1px] transition-all duration-1000 ease-out z-10"
              style={{ height: `${waterHeightPercent}%` }}
            >
              {/* Animated wave crest */}
              <div className="w-full h-2.5 bg-cyan-200/50 animate-pulse" />
            </motion.div>

            {/* Rising Detergent Bubbles */}
            {machineRunning && isFoaming && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {Array.from({ length: bubbleCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/80 border border-white shadow-sm"
                    style={{
                      width: 5 + (i % 6) * 3,
                      height: 5 + (i % 6) * 3,
                      left: `${12 + (i * 19) % 76}%`,
                      bottom: `${10 + (i * 11) % Math.max(10, waterHeightPercent * 0.85)}%`,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      x: [-2, 2, -2],
                      opacity: [0.5, 0.95, 0.5],
                    }}
                    transition={{
                      duration: 1.2 + (i % 4) * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Rotating Mechanical Drum with Clothes */}
            <div
              className="w-44 h-44 rounded-full border-2 border-dashed border-slate-600/60 flex items-center justify-center relative transition-transform"
              style={{
                animation: isSpinning ? `spin ${rotationDuration}s linear infinite` : 'none',
              }}
            >
              {/* Metallic Internal Drum Baffles */}
              <div className="absolute top-2 w-3.5 h-6 bg-slate-500/70 rounded shadow" />
              <div className="absolute bottom-2 w-3.5 h-6 bg-slate-500/70 rounded shadow" />
              <div className="absolute left-2 w-6 h-3.5 bg-slate-500/70 rounded shadow" />
              <div className="absolute right-2 w-6 h-3.5 bg-slate-500/70 rounded shadow" />

              {/* Realistic Laundry Items */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="w-14 h-11 bg-indigo-500/85 rounded-2xl rotate-12 shadow-lg transform -translate-x-2 -translate-y-2 border border-indigo-400/40" />
                <div className="w-12 h-14 bg-rose-500/80 rounded-2xl -rotate-45 shadow-lg transform translate-x-2.5 translate-y-2 border border-rose-400/40" />
                <div className="w-12 h-10 bg-amber-500/80 rounded-full rotate-45 shadow-lg transform -translate-y-3.5 border border-amber-400/40" />
                <div className="w-9 h-9 bg-emerald-500/85 rounded-xl rotate-12 shadow-md border border-emerald-400/40" />
              </div>
            </div>

            {/* Glass Curved Glare & Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-300/15 pointer-events-none rounded-full z-30" />

            {/* Chrome Door Handle */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-12 bg-slate-300 rounded-full shadow-2xl border border-slate-200 z-40" />
          </div>
        </div>

        {/* Bottom Maintenance Plinth */}
        <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
          <span>Inverter BLDC Drive</span>
          <div className="w-8 h-5 rounded border border-slate-700 bg-slate-800/60 flex items-center justify-center">
            <div className="w-4 h-1 bg-slate-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Real-time Hardware Telemetry Badges */}
      <div className="grid grid-cols-4 gap-2 w-full mt-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex flex-col items-center">
          <Clock className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase font-mono">Duration</span>
          <span className="text-xs font-bold font-mono text-slate-200">{outputs.washTime} min</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex flex-col items-center">
          <Waves className="w-4 h-4 text-blue-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase font-mono">Water</span>
          <span className="text-xs font-bold font-mono text-slate-200">{outputs.waterIntake} L</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex flex-col items-center">
          <Flame className="w-4 h-4 mb-1" style={{ color: tempColor }} />
          <span className="text-[10px] text-slate-400 uppercase font-mono">Temp</span>
          <span className="text-xs font-bold font-mono text-slate-200">{outputs.temperature} °C</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex flex-col items-center">
          <Gauge className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase font-mono">Spin</span>
          <span className="text-xs font-bold font-mono text-slate-200">{outputs.spinSpeed} RPM</span>
        </div>
      </div>

      {/* Simulator Playback Controls */}
      <div className="flex items-center gap-3 mt-5">
        {!machineRunning ? (
          <button
            onClick={startMachine}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95 text-xs"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Start Cycle
          </button>
        ) : (
          <button
            onClick={pauseMachine}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all active:scale-95 text-xs"
          >
            <Pause className="w-4 h-4 fill-slate-950" /> Pause
          </button>
        )}
        <button
          onClick={resetMachine}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all active:scale-95 text-xs"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
};

export default WashingMachine;
