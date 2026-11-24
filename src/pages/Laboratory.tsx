import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, RotateCcw, Sliders, CheckCircle2 } from 'lucide-react';
import MembershipChart from '../components/MembershipChart';
import OutputDashboard from '../components/OutputDashboard';
import { useFuzzyStore } from '../store/fuzzyStore';

export const Laboratory: React.FC = () => {
  const { inputVars, updateInputVar, resetInputVars, sensors } = useFuzzyStore();
  const [selectedVarId, setSelectedVarId] = useState('dirtiness');

  const activeVar = inputVars.find((v) => v.id === selectedVarId) || inputVars[0];
  const crispVal = sensors[selectedVarId as keyof typeof sensors] ?? 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">Membership Function Laboratory</h2>
          </div>
          <p className="text-xs text-slate-400">
            Interactive mathematical workspace: modify vertices (a, b, c, d) and watch the fuzzy logic engine adapt live
          </p>
        </div>

        <button
          onClick={resetInputVars}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restore Default Geometry
        </button>
      </div>

      {/* Variable Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {inputVars.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVarId(v.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
              selectedVarId === v.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'glass text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {v.name} ({v.min}–{v.max} {v.unit})
          </button>
        ))}
      </div>

      {/* Main Lab Grid: Chart on Left, Vertex Editor Sliders on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Interactive Chart */}
        <div className="lg:col-span-7 glass p-5 rounded-2xl border border-slate-800 space-y-4">
          <MembershipChart
            varId={activeVar.id}
            crispValue={crispVal}
            membershipFunctions={activeVar.membershipFunctions}
            title={`${activeVar.name} Set Geometry`}
            unit={activeVar.unit}
            min={activeVar.min}
            max={activeVar.max}
          />

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Mathematical Specification:
            </div>
            <p className="text-[11px] leading-relaxed">
              • <strong>Triangular:</strong> μ(x) = max(0, min((x−a)/(b−a), (c−x)/(c−b)))<br />
              • <strong>Trapezoidal:</strong> μ(x) = max(0, min((x−a)/(b−a), 1, (d−x)/(d−c)))
            </p>
          </div>
        </div>

        {/* Live Vertex Tuning Controls */}
        <div className="lg:col-span-5 glass p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Adjust Set Vertices
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Propagates Real-Time</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {activeVar.membershipFunctions.map((mf) => (
              <div key={mf.label} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mf.color }} />
                    <span className="text-xs font-bold font-mono text-slate-200">{mf.label}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {mf.type}
                  </span>
                </div>

                {/* Param A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Left Foot (a):</span>
                    <span className="text-cyan-300 font-bold">{mf.a}</span>
                  </div>
                  <input
                    type="range"
                    min={activeVar.min}
                    max={activeVar.max}
                    step={1}
                    value={mf.a}
                    onChange={(e) => updateInputVar(activeVar.id, mf.label, { a: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Param B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{mf.type === 'triangular' ? 'Peak (b):' : 'Left Shoulder (b):'}</span>
                    <span className="text-cyan-300 font-bold">{mf.b}</span>
                  </div>
                  <input
                    type="range"
                    min={activeVar.min}
                    max={activeVar.max}
                    step={1}
                    value={mf.b}
                    onChange={(e) => updateInputVar(activeVar.id, mf.label, { b: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Param C */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{mf.type === 'triangular' ? 'Right Foot (c):' : 'Right Shoulder (c):'}</span>
                    <span className="text-cyan-300 font-bold">{mf.c}</span>
                  </div>
                  <input
                    type="range"
                    min={activeVar.min}
                    max={activeVar.max}
                    step={1}
                    value={mf.c}
                    onChange={(e) => updateInputVar(activeVar.id, mf.label, { c: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Param D if trapezoidal */}
                {mf.type === 'trapezoidal' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Right Foot (d):</span>
                      <span className="text-cyan-300 font-bold">{mf.d}</span>
                    </div>
                    <input
                      type="range"
                      min={activeVar.min}
                      max={activeVar.max}
                      step={1}
                      value={mf.d}
                      onChange={(e) => updateInputVar(activeVar.id, mf.label, { d: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output Impact preview */}
      <OutputDashboard />
    </motion.div>
  );
};

export default Laboratory;
