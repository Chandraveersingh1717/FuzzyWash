import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Filter, Zap, ArrowRight } from 'lucide-react';
import { useFuzzyStore } from '../store/fuzzyStore';
import type { EvaluatedRule } from '../types/fuzzy';

interface RuleViewerProps {
  controllerId?: string;
}

type FilterMode = 'all' | 'active' | 'inactive' | 'strongest';

export const RuleViewer: React.FC<RuleViewerProps> = ({ controllerId }) => {
  const { snapshot } = useFuzzyStore();
  const [filterMode, setFilterMode] = useState<FilterMode>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const allRules = snapshot.evaluatedRules;

  // Filter rules by controller, search and activation mode
  const filteredRules = useMemo(() => {
    let list = controllerId
      ? allRules.filter((r) => r.rule.controllerId === controllerId)
      : allRules;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.rule.id.toLowerCase().includes(q) ||
          r.rule.description.toLowerCase().includes(q) ||
          r.rule.consequents.some((c) => c.set.toLowerCase().includes(q))
      );
    }

    switch (filterMode) {
      case 'active':
        return list.filter((r) => r.active).sort((a, b) => b.firingStrength - a.firingStrength);
      case 'inactive':
        return list.filter((r) => !r.active);
      case 'strongest':
        return [...list].sort((a, b) => b.firingStrength - a.firingStrength).slice(0, 10);
      case 'all':
      default:
        return list;
    }
  }, [allRules, controllerId, filterMode, searchQuery]);

  const activeCount = useMemo(
    () => (controllerId ? allRules.filter((r) => r.rule.controllerId === controllerId && r.active).length : allRules.filter((r) => r.active).length),
    [allRules, controllerId]
  );

  const totalCount = useMemo(
    () => (controllerId ? allRules.filter((r) => r.rule.controllerId === controllerId).length : allRules.length),
    [allRules, controllerId]
  );

  return (
    <div className="w-full space-y-4">
      {/* Header & Stats bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Mamdani Rule Inference Engine
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono">
                {activeCount} / {totalCount} Active
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              MIN-operator evaluates premise conjunctions; clipping sets the firing strength α
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {(['active', 'strongest', 'all', 'inactive'] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                filterMode === mode
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
        <AnimatePresence>
          {filteredRules.length === 0 ? (
            <div className="col-span-2 text-center py-12 glass rounded-xl border border-slate-800 text-slate-400 text-sm">
              No rules match the current filter criteria.
            </div>
          ) : (
            filteredRules.map((er) => {
              const { rule, conditionValues, firingStrength, active } = er;
              return (
                <motion.div
                  key={rule.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    active
                      ? 'glass border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/40 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  {/* Top Bar: Rule ID + Firing Strength */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {rule.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{rule.controllerId}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {active ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <Flame className="w-3 h-3 text-emerald-400" />
                          <span>α = {firingStrength.toFixed(3)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs font-mono">Inactive (0.000)</span>
                      )}
                    </div>
                  </div>

                  {/* Rule Premise (IF Conditions) */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                      <span className="text-cyan-400 font-mono">IF</span>
                      <span className="text-slate-400 text-[10px]">({rule.operator})</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pl-2">
                      {conditionValues.map((cv, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                            cv.value > 0.001
                              ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          <span className="text-slate-400">{cv.condition.variable}:</span>
                          <span className="font-semibold">{cv.condition.set}</span>
                          <span className="text-cyan-400">({cv.value.toFixed(2)})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rule Consequent (THEN) */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs flex items-center gap-2">
                    <span className="text-indigo-400 font-mono font-semibold">THEN</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <div className="flex flex-wrap gap-1.5">
                      {rule.consequents.map((cq, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 font-mono text-[11px] font-medium"
                        >
                          {cq.variable} = <span className="font-bold text-indigo-300">{cq.set}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Math Breakdown: min calculation */}
                  <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-950/60 rounded px-2 py-1 flex items-center justify-between">
                    <span className="truncate">
                      min({conditionValues.map((cv) => cv.value.toFixed(2)).join(', ')})
                    </span>
                    <span className="text-emerald-400 font-bold ml-2">
                      = {firingStrength.toFixed(3)}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RuleViewer;
