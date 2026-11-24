import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';
import MembershipChart from './MembershipChart';
import type { MembershipFunction } from '../types/fuzzy';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MembershipEditorProps {
  varId?: string;
}

// ─── Sensor key → store sensor key map ───────────────────────────────────────

const VAR_ID_TO_SENSOR: Record<string, keyof import('../types/fuzzy').SensorReading> = {
  dirtiness: 'dirtiness',
  greasiness: 'greasiness',
  loadWeight: 'loadWeight',
  fabricRobustness: 'fabricRobustness',
  waterHardness: 'waterHardness',
};

// ─── Parameter row component ──────────────────────────────────────────────────

interface ParamRowProps {
  label: string;
  param: 'a' | 'b' | 'c' | 'd';
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (param: 'a' | 'b' | 'c' | 'd', value: number) => void;
}

const ParamRow: React.FC<ParamRowProps> = ({ label, param, value, min, max, step, color, onChange }) => {
  const handleChange = useCallback(
    (raw: string) => {
      const v = parseFloat(raw);
      if (!isNaN(v)) onChange(param, v);
    },
    [param, onChange]
  );

  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="text-xs font-bold w-4 text-center shrink-0"
        style={{ color }}
      >
        {param}
      </span>
      <span className="text-xs text-slate-400 w-16 shrink-0">{label}</span>
      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-cyan-400"
        style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #1e3a5f ${((value - min) / (max - min)) * 100}%, #1e3a5f 100%)` }}
      />
      {/* Number input */}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-16 text-xs text-right bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500"
      />
    </div>
  );
};

// ─── MF Card ──────────────────────────────────────────────────────────────────

interface MFCardProps {
  mf: MembershipFunction;
  varMin: number;
  varMax: number;
  varId: string;
  updateFn: (mfLabel: string, params: Partial<{ a: number; b: number; c: number; d: number }>) => void;
  crispValue: number;
  degree: number;
}

const MFCard: React.FC<MFCardProps> = ({ mf, varMin, varMax, varId, updateFn, crispValue, degree }) => {
  const step = (varMax - varMin) / 100;

  const handleChange = useCallback(
    (param: 'a' | 'b' | 'c' | 'd', val: number) => {
      updateFn(mf.label, { [param]: val });
    },
    [mf.label, updateFn]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border p-3 mb-3"
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        borderColor: `${mf.color}33`,
        boxShadow: `0 0 0 1px ${mf.color}22`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: mf.color, boxShadow: `0 0 6px ${mf.color}` }}
          />
          <span className="text-sm font-semibold text-slate-100">{mf.label}</span>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ background: `${mf.color}22`, color: mf.color }}
          >
            {mf.type === 'triangular' ? 'TRI' : 'TRAP'}
          </span>
        </div>
        {/* Current membership degree */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">μ =</span>
          <motion.span
            key={degree}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold"
            style={{ color: degree > 0.01 ? mf.color : '#475569' }}
          >
            {degree.toFixed(3)}
          </motion.span>
        </div>
      </div>

      {/* Parameters */}
      <div className="space-y-0.5">
        <ParamRow
          label="left foot"
          param="a"
          value={mf.a}
          min={varMin}
          max={varMax}
          step={step}
          color={mf.color}
          onChange={handleChange}
        />
        <ParamRow
          label={mf.type === 'triangular' ? 'peak' : 'left shldr'}
          param="b"
          value={mf.b}
          min={varMin}
          max={varMax}
          step={step}
          color={mf.color}
          onChange={handleChange}
        />
        <ParamRow
          label={mf.type === 'triangular' ? 'right foot' : 'right shldr'}
          param="c"
          value={mf.c}
          min={varMin}
          max={varMax}
          step={step}
          color={mf.color}
          onChange={handleChange}
        />
        {mf.type === 'trapezoidal' && (
          <ParamRow
            label="right foot"
            param="d"
            value={mf.d}
            min={varMin}
            max={varMax}
            step={step}
            color={mf.color}
            onChange={handleChange}
          />
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MembershipEditor: React.FC<MembershipEditorProps> = ({ varId: initialVarId }) => {
  const { inputVars, updateInputVar, resetInputVars, sensors, snapshot } = useFuzzyStore();

  const [selectedVarId, setSelectedVarId] = useState<string>(
    initialVarId ?? inputVars[0]?.id ?? 'dirtiness'
  );

  const selectedVar = inputVars.find((v) => v.id === selectedVarId) ?? inputVars[0];

  // Current crisp sensor value for this variable
  const crispValue: number =
    selectedVar ? (sensors[VAR_ID_TO_SENSOR[selectedVar.id] as keyof typeof sensors] as number ?? 0) : 0;

  // Fuzzified degrees for selected var
  const degrees = selectedVar
    ? snapshot.fuzzified[selectedVar.id as keyof typeof snapshot.fuzzified] ?? {}
    : {};

  const handleUpdateMF = useCallback(
    (mfLabel: string, params: Partial<{ a: number; b: number; c: number; d: number }>) => {
      updateInputVar(selectedVarId, mfLabel, params);
    },
    [selectedVarId, updateInputVar]
  );

  if (!selectedVar) return null;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Variable selector */}
        <div className="relative flex-1">
          <select
            value={selectedVarId}
            onChange={(e) => setSelectedVarId(e.target.value)}
            className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-8 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {inputVars.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} {v.unit ? `(${v.unit})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Reset button */}
        <motion.button
          onClick={resetInputVars}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 text-slate-300 hover:border-cyan-600 hover:text-cyan-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </motion.button>
      </div>

      {/* ── Crisp value info banner ── */}
      <div
        className="rounded-xl px-4 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.18)' }}
      >
        <span className="text-xs text-slate-400">
          Current sensor value:{' '}
          <span className="font-bold text-cyan-300">
            {crispValue.toFixed(selectedVar.unit === 'kg' ? 1 : 0)}
            {selectedVar.unit ? ` ${selectedVar.unit}` : ''}
          </span>
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {selectedVar.membershipFunctions.map((mf) => {
            const deg = degrees[mf.label] ?? 0;
            return deg > 0.001 ? (
              <span
                key={mf.label}
                className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ background: `${mf.color}22`, color: mf.color, border: `1px solid ${mf.color}44` }}
              >
                {mf.label}: {deg.toFixed(2)}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* ── Live chart preview ── */}
      <div
        className="rounded-xl p-3"
        style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #1e3a5f' }}
      >
        <MembershipChart
          varId={selectedVar.id}
          crispValue={crispValue}
          membershipFunctions={selectedVar.membershipFunctions}
          title={selectedVar.name}
          unit={selectedVar.unit}
          min={selectedVar.min}
          max={selectedVar.max}
        />
      </div>

      {/* ── MF cards ── */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-0">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">
          Membership Functions
        </p>
        <AnimatePresence mode="wait" key={selectedVarId}>
          <div>
            {selectedVar.membershipFunctions.map((mf) => (
              <MFCard
                key={`${selectedVarId}-${mf.label}`}
                mf={mf}
                varMin={selectedVar.min}
                varMax={selectedVar.max}
                varId={selectedVarId}
                updateFn={handleUpdateMF}
                crispValue={crispValue}
                degree={degrees[mf.label] ?? 0}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MembershipEditor;
