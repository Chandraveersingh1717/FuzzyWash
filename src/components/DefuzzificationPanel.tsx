import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';
import { ALL_CONTROLLERS } from '../engine/ruleBase';
import AggregationChart from './AggregationChart';

export const DefuzzificationPanel: React.FC = () => {
  const { snapshot } = useFuzzyStore();
  const [selectedControllerId, setSelectedControllerId] = useState('washTime');

  const controller = ALL_CONTROLLERS.find((c) => c.id === selectedControllerId)!;
  const defuzz = snapshot.defuzzified[selectedControllerId];
  const outputVal = snapshot.outputs[selectedControllerId as keyof typeof snapshot.outputs];

  return (
    <div className="w-full space-y-5">
      {/* Controller Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {ALL_CONTROLLERS.map((c) => {
          const isActive = c.id === selectedControllerId;
          const val = snapshot.outputs[c.id as keyof typeof snapshot.outputs];
          return (
            <button
              key={c.id}
              onClick={() => setSelectedControllerId(c.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{c.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-300'}`}>
                {val} {c.outputUnit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Aggregation Visualization */}
      <AggregationChart controllerId={selectedControllerId} />

      {/* Mathematical Breakdown & Formula Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Formula & Method */}
        <div className="glass p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
            <Calculator className="w-4 h-4" />
            <span>Center of Gravity (Centroid) Defuzzification</span>
          </div>

          <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 font-mono text-center space-y-2">
            <div className="text-sm font-bold text-slate-100">
              z* = <span className="text-cyan-400">∫ z · μ(z) dz</span> / <span className="text-indigo-400">∫ μ(z) dz</span>
            </div>
            <div className="text-xs text-slate-400 border-t border-slate-800 pt-2">
              z* = <span className="text-cyan-300">{defuzz?.numerator.toFixed(2)}</span> /{' '}
              <span className="text-indigo-300">{defuzz?.denominator.toFixed(2)}</span> ={' '}
              <span className="text-amber-400 font-bold">{defuzz?.crispValue} {controller.outputUnit}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The Centroid method calculates the geometric center of gravity of the composite fuzzy region. The area is computed via numerical trapezoidal integration across {controller.outputMin} to {controller.outputMax} {controller.outputUnit}.
          </p>
        </div>

        {/* Fallback & Discretization Specification */}
        <div className="glass p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono">
            <Info className="w-4 h-4" />
            <span>Numerical Discretization & Fallback Guard</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Resolution:</strong> 300 discrete intervals across [{controller.outputMin}, {controller.outputMax}].</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Integration:</strong> Trapezoidal rule: (x_i + x_i+1)/2 · (y_i + y_i+1)/2 · Δx</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Zero-Area Fallback:</strong> If no rules fire (∫μ=0), defaults to interval midpoint {(controller.outputMin + controller.outputMax) / 2} {controller.outputUnit}.</span>
            </li>
          </ul>

          <div className="text-xs bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20 text-cyan-200">
            Final hardware signal: <span className="font-mono font-bold text-cyan-300">{outputVal} {controller.outputUnit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefuzzificationPanel;
