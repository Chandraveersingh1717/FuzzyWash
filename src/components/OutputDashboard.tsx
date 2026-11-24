import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Droplets, Sparkles, Thermometer, Gauge, AlertTriangle, Cpu } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';

interface OutputMeta {
  key: 'washTime' | 'waterIntake' | 'detergent' | 'temperature' | 'spinSpeed';
  label: string;
  actuator: string;
  unit: string;
  min: number;
  max: number;
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
}

const OUTPUT_CONFIGS: OutputMeta[] = [
  {
    key: 'washTime',
    label: 'Wash Duration',
    actuator: 'Microcontroller Cycle Timer',
    unit: 'min',
    min: 0,
    max: 60,
    icon: Clock,
    gradient: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'border-cyan-500/40',
  },
  {
    key: 'waterIntake',
    label: 'Water Intake',
    actuator: 'Dual-Inlet Solenoid Valve',
    unit: 'L',
    min: 15,
    max: 60,
    icon: Droplets,
    gradient: 'from-blue-500/20 to-sky-500/10',
    borderColor: 'border-blue-500/40',
  },
  {
    key: 'detergent',
    label: 'Detergent Dosage',
    actuator: 'Peristaltic Dispenser Pump',
    unit: 'ml',
    min: 10,
    max: 100,
    icon: Sparkles,
    gradient: 'from-purple-500/20 to-indigo-500/10',
    borderColor: 'border-purple-500/40',
  },
  {
    key: 'temperature',
    label: 'Water Temperature',
    actuator: 'PTC Electric Heating Element',
    unit: '°C',
    min: 20,
    max: 80,
    icon: Thermometer,
    gradient: 'from-amber-500/20 to-rose-500/10',
    borderColor: 'border-amber-500/40',
  },
  {
    key: 'spinSpeed',
    label: 'Spin Speed',
    actuator: 'BLDC Inverter Drum Motor',
    unit: 'RPM',
    min: 400,
    max: 1400,
    icon: Gauge,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/40',
  },
];

export const OutputDashboard: React.FC = () => {
  const { snapshot } = useFuzzyStore();
  const { outputs, safetyApplied, defuzzified } = snapshot;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Crisp Hardware Actuator Commands</h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time defuzzified control signals delivered to washing machine physical controllers
          </p>
        </div>
        {safetyApplied.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Fabric Protection Override Active</span>
          </div>
        )}
      </div>

      {/* 5 Hardware Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {OUTPUT_CONFIGS.map((item) => {
          const val = outputs[item.key];
          const defuzz = defuzzified[item.key];
          const pct = Math.max(0, Math.min(100, ((val - item.min) / (item.max - item.min)) * 100));
          const Icon = item.icon;

          // Check if this variable has safety overrides
          const isSafetyOverridden =
            (item.key === 'spinSpeed' && safetyApplied.some((s) => s.includes('Spin speed'))) ||
            (item.key === 'temperature' && safetyApplied.some((s) => s.includes('Temperature')));

          return (
            <motion.div
              key={item.key}
              layout
              className={`glass rounded-xl p-4 flex flex-col justify-between border ${item.borderColor} relative overflow-hidden bg-gradient-to-b ${item.gradient} hover:border-cyan-400/60 transition-all shadow-lg`}
            >
              {/* Card Top: Icon & Actuator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-400">
                    {item.min}–{item.max} {item.unit}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{item.actuator}</div>
              </div>

              {/* Card Center: Big Crisp Value */}
              <div className="my-3">
                <div className="flex items-baseline gap-1.5">
                  <motion.span
                    key={val}
                    initial={{ scale: 0.85, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black font-mono text-slate-50 tracking-tight"
                  >
                    {val}
                  </motion.span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">{item.unit}</span>
                </div>

                {defuzz && (
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Centroid: {defuzz.centroidX.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Card Bottom: Progress Gauge & Safety Tag */}
              <div className="space-y-1.5">
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {isSafetyOverridden ? (
                  <div className="text-[9px] text-amber-400 font-medium flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Safety Capped
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-400 flex justify-between font-mono">
                    <span>{pct.toFixed(0)}% Capacity</span>
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Safety Constraint Notes */}
      {safetyApplied.length > 0 && (
        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-semibold text-amber-300">Fabric Protection Rules Enforced Post-Inference:</span>
            <ul className="list-disc list-inside text-amber-200/80 text-[11px] space-y-0.5">
              {safetyApplied.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputDashboard;
