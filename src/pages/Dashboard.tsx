import React from 'react';
import { motion } from 'framer-motion';
import WashingMachine from '../components/WashingMachine';
import SensorPanel from '../components/SensorPanel';
import OutputDashboard from '../components/OutputDashboard';
import BehindTheCalculation from '../components/BehindTheCalculation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';

export const Dashboard: React.FC = () => {
  const { setActivePage } = useFuzzyStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Hero Welcome Banner */}
      <div className="glass p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-[#0e1630] to-indigo-950/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Fuzzy Logic Laboratory
            </span>
            <span className="text-xs text-slate-400 font-mono">Mamdani Inference Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
            FuzzyWash <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">— Smart Washing Machine Twin</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Experience how real-world crisp sensor signals undergo fuzzification, rule evaluation, implication, aggregation, and centroid defuzzification to control physical washing hardware smoothly and intelligently.
          </p>
        </div>

        <button
          onClick={() => setActivePage('timemachine')}
          className="z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg hover:shadow-cyan-500/30 transition active:scale-95 flex-shrink-0"
        >
          <span>Time Machine Walkthrough</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Ambient background blur */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main 2-Column Grid: Left Digital Twin Machine, Right Sensor Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex justify-center">
          <WashingMachine />
        </div>
        <div className="lg:col-span-7">
          <SensorPanel />
        </div>
      </div>

      {/* Crisp Output Hardware Dashboard */}
      <div className="pt-2">
        <OutputDashboard />
      </div>

      {/* Expandable Behind The Calculation Inspection Panel */}
      <div className="pt-2">
        <BehindTheCalculation />
      </div>
    </motion.div>
  );
};

export default Dashboard;
