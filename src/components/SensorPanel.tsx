import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFuzzyStore } from '../store/fuzzyStore';
import { PRESETS } from '../data/presets';
import type { SensorReading, MembershipDegrees } from '../types/fuzzy';

// ─── Sensor Meta ────────────────────────────────────────────────────────────

interface SensorMeta {
  key: keyof SensorReading;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  icon: string;
  sets: string[];
}

const SENSOR_META: SensorMeta[] = [
  {
    key: 'dirtiness',
    label: 'Dirtiness',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    icon: '🌫️',
    sets: ['Small', 'Medium', 'Large'],
  },
  {
    key: 'greasiness',
    label: 'Greasiness',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    icon: '🍳',
    sets: ['NotGreasy', 'Medium', 'Greasy'],
  },
  {
    key: 'loadWeight',
    label: 'Load Weight',
    unit: 'kg',
    min: 0,
    max: 10,
    step: 0.1,
    icon: '⚖️',
    sets: ['Light', 'Medium', 'Heavy'],
  },
  {
    key: 'fabricRobustness',
    label: 'Fabric Robustness',
    unit: '',
    min: 0,
    max: 100,
    step: 1,
    icon: '🧵',
    sets: ['Delicate', 'Normal', 'HeavyDuty'],
  },
  {
    key: 'waterHardness',
    label: 'Water Hardness',
    unit: 'ppm',
    min: 0,
    max: 300,
    step: 1,
    icon: '💧',
    sets: ['Soft', 'Moderate', 'Hard'],
  },
];

// ─── Pill Colors ─────────────────────────────────────────────────────────────

const PILL_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  0: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  1: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/40' },
  2: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/40' },
};

const BAR_COLORS = ['bg-cyan-400', 'bg-violet-400', 'bg-orange-400'];

// ─── Membership Pill ─────────────────────────────────────────────────────────

interface MembershipPillProps {
  label: string;
  degree: number;
  colorIdx: number;
}

const MembershipPill: React.FC<MembershipPillProps> = ({ label, degree, colorIdx }) => {
  const c = PILL_COLORS[colorIdx] ?? PILL_COLORS[0];
  const active = degree > 0.001;
  return (
    <motion.span
      layout
      animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold
        ${c.bg} ${c.text} ${c.border}`}
    >
      {label}
      <span className="font-mono">{(degree * 100).toFixed(0)}%</span>
    </motion.span>
  );
};

// ─── Membership Bar ──────────────────────────────────────────────────────────

interface MembershipBarProps {
  degrees: MembershipDegrees;
  sets: string[];
}

const MembershipBar: React.FC<MembershipBarProps> = ({ degrees, sets }) => {
  const total = sets.reduce((s, lbl) => s + (degrees[lbl] ?? 0), 0) || 1;
  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px mt-2">
      {sets.map((lbl, i) => {
        const pct = ((degrees[lbl] ?? 0) / total) * 100;
        return (
          <motion.div
            key={lbl}
            className={`${BAR_COLORS[i] ?? 'bg-gray-500'} rounded-full`}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ minWidth: pct > 0 ? 2 : 0 }}
          />
        );
      })}
    </div>
  );
};

// ─── Sensor Card ─────────────────────────────────────────────────────────────

interface SensorCardProps {
  meta: SensorMeta;
  value: number;
  degrees: MembershipDegrees;
  onChange: (val: number) => void;
}

const SensorCard: React.FC<SensorCardProps> = ({ meta, value, degrees, onChange }) => {
  const pct = ((value - meta.min) / (meta.max - meta.min)) * 100;

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange],
  );

  const displayVal =
    meta.step < 1 ? value.toFixed(1) : Math.round(value).toString();

  return (
    <motion.div
      layout
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4
        hover:border-cyan-500/30 transition-colors duration-200 group"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.icon}</span>
          <span className="text-sm font-semibold text-slate-200">{meta.label}</span>
          {meta.unit && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-mono border border-slate-600">
              {meta.unit}
            </span>
          )}
        </div>

        {/* Large numeric display */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayVal}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="text-2xl font-bold font-mono text-cyan-300 tabular-nums"
          >
            {displayVal}
            {meta.unit && (
              <span className="text-sm font-normal text-slate-400 ml-0.5">{meta.unit}</span>
            )}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Slider */}
      <div className="relative mt-1 mb-3">
        <style>{`
          .sensor-slider-${meta.key}::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #22D3EE;
            cursor: pointer;
            box-shadow: 0 0 8px #22D3EE88;
            border: 2px solid #0B1020;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
          }
          .sensor-slider-${meta.key}::-webkit-slider-thumb:hover {
            transform: scale(1.25);
            box-shadow: 0 0 14px #22D3EEaa;
          }
          .sensor-slider-${meta.key}::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #22D3EE;
            cursor: pointer;
            box-shadow: 0 0 8px #22D3EE88;
            border: 2px solid #0B1020;
          }
        `}</style>
        <input
          type="range"
          min={meta.min}
          max={meta.max}
          step={meta.step}
          value={value}
          onChange={handleSlider}
          className={`sensor-slider-${meta.key} w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none`}
          style={{
            background: `linear-gradient(to right, #22D3EE ${pct}%, #1e3a5f ${pct}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>{meta.min}{meta.unit}</span>
          <span>{meta.max}{meta.unit}</span>
        </div>
      </div>

      {/* Membership pills */}
      <div className="flex flex-wrap gap-1.5 mb-1">
        {meta.sets.map((lbl, i) => (
          <MembershipPill
            key={lbl}
            label={lbl}
            degree={degrees[lbl] ?? 0}
            colorIdx={i}
          />
        ))}
      </div>

      {/* Membership distribution bar */}
      <MembershipBar degrees={degrees} sets={meta.sets} />
    </motion.div>
  );
};

// ─── Preset Button ────────────────────────────────────────────────────────────

interface PresetButtonProps {
  icon: string;
  name: string;
  active: boolean;
  onClick: () => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({ icon, name, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-semibold
      transition-colors duration-150 cursor-pointer whitespace-nowrap
      ${active
        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
        : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
      }`}
  >
    <span className="text-lg leading-none">{icon}</span>
    <span className="leading-tight text-center max-w-[72px] line-clamp-2">{name}</span>
  </motion.button>
);

// ─── SensorPanel ─────────────────────────────────────────────────────────────

const SensorPanel: React.FC = () => {
  const sensors = useFuzzyStore(s => s.sensors);
  const setSensor = useFuzzyStore(s => s.setSensor);
  const setSensors = useFuzzyStore(s => s.setSensors);
  const snapshot = useFuzzyStore(s => s.snapshot);

  const fuzzified = snapshot.fuzzified;

  // Determine which preset is active (all sensor values match)
  const activePresetId = PRESETS.find(p =>
    Object.entries(p.sensors).every(
      ([k, v]) => Math.abs((sensors as unknown as Record<string, number>)[k] - v) < 0.001,
    ),
  )?.id ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Presets Section ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎛️</span>
          <h3 className="text-sm font-semibold text-slate-200">Scenario Presets</h3>
          <span className="text-xs text-slate-500 ml-auto">Click to load</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <PresetButton
              key={preset.id}
              icon={preset.icon}
              name={preset.name.split(' ').slice(0, 3).join(' ')}
              active={activePresetId === preset.id}
              onClick={() => setSensors(preset.sensors)}
            />
          ))}
        </div>
      </div>

      {/* ── Sensor Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        {SENSOR_META.map(meta => {
          const degrees: MembershipDegrees =
            (fuzzified[meta.key as keyof typeof fuzzified] as MembershipDegrees) ?? {};
          return (
            <SensorCard
              key={meta.key}
              meta={meta}
              value={sensors[meta.key]}
              degrees={degrees}
              onChange={val => setSensor(meta.key, val)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SensorPanel;
