import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SensorPanel from '../components/SensorPanel';
import MembershipChart from '../components/MembershipChart';
import RuleViewer from '../components/RuleViewer';
import OutputDashboard from '../components/OutputDashboard';
import BehindTheCalculation from '../components/BehindTheCalculation';
import { useFuzzyStore } from '../store/fuzzyStore';

export const Simulator: React.FC = () => {
  const { inputVars, sensors } = useFuzzyStore();
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Interactive Fuzzy Simulator Deck</h2>
          <p className="text-xs text-slate-400">
            Real-time sensory adjustment with instant membership function intersection and rule inference
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sensor Sliders */}
        <div className="lg:col-span-5">
          <SensorPanel />
        </div>

        {/* Right Charts & Rules */}
        <div className="lg:col-span-7 space-y-5">
          {/* Variable Selector Tabs */}
          <div className="glass p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold mr-1">Inspect Set:</span>
              {inputVars.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVarId(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedVarId === v.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>

            {/* Embedded Live Membership Function Curve */}
            <MembershipChart
              varId={activeVar.id}
              crispValue={crispVal}
              membershipFunctions={activeVar.membershipFunctions}
              title={`${activeVar.name} Membership Curves`}
              unit={activeVar.unit}
              min={activeVar.min}
              max={activeVar.max}
            />
          </div>

          {/* Active Rules View */}
          <RuleViewer />
        </div>
      </div>

      {/* Crisp Output Cards */}
      <OutputDashboard />

      {/* Expandable Mathematical Audit Panel */}
      <BehindTheCalculation />
    </motion.div>
  );
};

export default Simulator;
