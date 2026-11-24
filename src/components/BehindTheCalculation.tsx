import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronDown, ChevronUp, Copy, Check, Download, RotateCcw, Cpu } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';
import { ALL_CONTROLLERS } from '../engine/ruleBase';

export const BehindTheCalculation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { snapshot, sensors, inputVars, setSensors, resetInputVars } = useFuzzyStore();
  const { fuzzified, evaluatedRules, defuzzified, outputs, safetyApplied } = snapshot;

  const handleCopyMath = () => {
    const rawData = {
      sensors,
      membershipDegrees: fuzzified,
      activeRules: evaluatedRules
        .filter((r) => r.active)
        .map((r) => ({
          id: r.rule.id,
          controller: r.rule.controllerId,
          firingStrength: r.firingStrength,
          conditions: r.conditionValues.map((cv) => `${cv.condition.variable}.${cv.condition.set}=${cv.value}`),
          consequents: r.rule.consequents.map((cq) => `${cq.variable}=${cq.set}`),
        })),
      centroidIntegrations: Object.entries(defuzzified).map(([ctrl, res]) => ({
        controller: ctrl,
        numerator: res.numerator,
        denominator: res.denominator,
        centroid: res.crispValue,
      })),
      finalHardwareOutputs: outputs,
      safetyOverrides: safetyApplied,
      numericalResolution: '300 trapezoidal intervals per output range',
    };

    navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fuzzywash-full-math-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full glass rounded-2xl border border-cyan-500/20 overflow-hidden shadow-xl">
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition bg-gradient-to-r from-slate-900/90 to-indigo-950/40 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Behind the Calculation (Mathematical Inspection & Audit)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                Live Engine Feed
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Inspect exact intermediate integration numerators, denominators, α-firing matrices, and parameter definitions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-cyan-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expandable Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-800 p-5 space-y-5 bg-slate-950/70"
          >
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                Integration Universe: 300 Trapezoidal Steps per Output Universe
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMath}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied JSON!' : 'Copy Math Snapshot'}
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download Report (JSON)
                </button>
              </div>
            </div>

            {/* Grid 1: Membership Degrees Vector */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                1. Input Membership Vector μ_A(x)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-mono text-xs">
                {Object.entries(fuzzified).map(([varId, sets]) => (
                  <div key={varId} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-bold block mb-1 text-[11px] truncate">{varId}</span>
                    <div className="space-y-0.5 text-[10px]">
                      {Object.entries(sets as Record<string, number>).map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-slate-400">{label}:</span>
                          <span className={val > 0 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                            {val.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid 2: Defuzzification Calculus: Numerator & Denominator */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                2. Continuous Numerical Integration: z* = ∫ z·μ(z)dz / ∫ μ(z)dz
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-mono text-xs">
                {ALL_CONTROLLERS.map((c) => {
                  const def = defuzzified[c.id];
                  if (!def) return null;
                  return (
                    <div key={c.id} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-300 font-bold block text-[11px] truncate">{c.name}</span>
                      <div className="text-[10px] text-slate-400">
                        Numerator: <span className="text-cyan-300">{def.numerator.toFixed(2)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Denominator: <span className="text-indigo-300">{def.denominator.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-amber-400 font-bold pt-1 border-t border-slate-800 flex justify-between">
                        <span>Centroid:</span>
                        <span>{def.crispValue} {c.outputUnit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid 3: Active Rule Firing Matrix */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                3. Active Mamdani Firing Strengths (α = min(μ_i))
              </h5>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 max-h-40 overflow-y-auto space-y-1 text-xs font-mono">
                {evaluatedRules.filter((r) => r.active).length === 0 ? (
                  <span className="text-slate-500">No active rules currently firing.</span>
                ) : (
                  evaluatedRules
                    .filter((r) => r.active)
                    .sort((a, b) => b.firingStrength - a.firingStrength)
                    .map((er) => (
                      <div key={er.rule.id} className="flex items-center justify-between py-0.5 border-b border-slate-800/60 text-[11px]">
                        <span className="text-cyan-300 font-bold">{er.rule.id} ({er.rule.controllerId})</span>
                        <span className="text-slate-400 truncate max-w-md mx-2">{er.rule.description}</span>
                        <span className="text-emerald-400 font-bold">α = {er.firingStrength.toFixed(3)}</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BehindTheCalculation;
