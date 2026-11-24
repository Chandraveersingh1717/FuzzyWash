import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Layers } from 'lucide-react';
import RuleViewer from '../components/RuleViewer';
import { ALL_CONTROLLERS } from '../engine/ruleBase';

export const Rules: React.FC = () => {
  const [selectedController, setSelectedController] = useState<string | undefined>(undefined);

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
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Mamdani Rule Base Knowledge Engine</h2>
          </div>
          <p className="text-xs text-slate-400">
            81 expert fuzzy IF–THEN inference rules distributed across 5 modular sub-controllers
          </p>
        </div>
      </div>

      {/* Controller Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedController(undefined)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            selectedController === undefined
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
              : 'glass text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All 81 Rules
        </button>

        {ALL_CONTROLLERS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedController(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
              selectedController === c.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'glass text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {c.name} ({c.rules.length} rules)
          </button>
        ))}
      </div>

      {/* Embedded Rule Viewer */}
      <RuleViewer controllerId={selectedController} />
    </motion.div>
  );
};

export default Rules;
