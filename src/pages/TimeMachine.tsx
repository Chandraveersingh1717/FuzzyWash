import React from 'react';
import { motion } from 'framer-motion';
import AlgorithmTimeline from '../components/AlgorithmTimeline';
import WashingMachine from '../components/WashingMachine';
import SensorPanel from '../components/SensorPanel';
import { Clock, History, HelpCircle } from 'lucide-react';

export const TimeMachine: React.FC = () => {
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
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">Algorithm Time Machine</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
              VisuAlgo-Inspired
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Step forward and backward through the exact mathematical phases of the Mamdani fuzzy inference pipeline
          </p>
        </div>
      </div>

      {/* Main Timeline & VisuAlgo Controller */}
      <AlgorithmTimeline />

      {/* Two Columns: Digital Twin on Left, Quick Sensor Config on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        <div className="lg:col-span-5 flex justify-center">
          <WashingMachine />
        </div>
        <div className="lg:col-span-7">
          <SensorPanel />
        </div>
      </div>
    </motion.div>
  );
};

export default TimeMachine;
