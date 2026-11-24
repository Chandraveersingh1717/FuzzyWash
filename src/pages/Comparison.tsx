import React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useFuzzyStore } from '../store/fuzzyStore';
import { PRESETS } from '../data/presets';

export const Comparison: React.FC = () => {
  const {
    scenarioA,
    scenarioB,
    snapshotA,
    snapshotB,
    setSensorA,
    setSensorB,
    setScenariosAB,
  } = useFuzzyStore();

  const chartData = [
    {
      metric: 'Wash Time (min)',
      Scenario_A: snapshotA.outputs.washTime,
      Scenario_B: snapshotB.outputs.washTime,
    },
    {
      metric: 'Water (L)',
      Scenario_A: snapshotA.outputs.waterIntake,
      Scenario_B: snapshotB.outputs.waterIntake,
    },
    {
      metric: 'Detergent (ml)',
      Scenario_A: snapshotA.outputs.detergent,
      Scenario_B: snapshotB.outputs.detergent,
    },
    {
      metric: 'Temp (°C)',
      Scenario_A: snapshotA.outputs.temperature,
      Scenario_B: snapshotB.outputs.temperature,
    },
    {
      metric: 'Spin (/10 RPM)',
      Scenario_A: Math.round(snapshotA.outputs.spinSpeed / 10),
      Scenario_B: Math.round(snapshotB.outputs.spinSpeed / 10),
    },
  ];

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
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">What-If Scenario Comparison</h2>
          </div>
          <p className="text-xs text-slate-400">
            Run two independent instances of the Mamdani fuzzy engine side-by-side to observe comparative actuation deltas
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-slate-200">Hardware Output Comparison</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Scenario_A" fill="#22D3EE" name="Scenario A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario_B" fill="#818CF8" name="Scenario B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Config Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario A */}
        <div className="glass p-5 rounded-2xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sm font-bold text-cyan-300 font-mono">Scenario A</span>
            <span className="text-xs text-slate-400 font-mono">{snapshotA.outputs.washTime} min wash</span>
          </div>

          {/* Quick Preset buttons */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  Object.entries(p.sensors).forEach(([k, v]) => setSensorA(k as any, v));
                }}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800"
              >
                {p.icon} {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Sensor Sliders A */}
          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Dirtiness:</span>
                <span className="text-cyan-300 font-bold">{scenarioA.dirtiness}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scenarioA.dirtiness}
                onChange={(e) => setSensorA('dirtiness', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Greasiness:</span>
                <span className="text-cyan-300 font-bold">{scenarioA.greasiness}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scenarioA.greasiness}
                onChange={(e) => setSensorA('greasiness', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Load Weight:</span>
                <span className="text-cyan-300 font-bold">{scenarioA.loadWeight} kg</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={scenarioA.loadWeight}
                onChange={(e) => setSensorA('loadWeight', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Output summary box */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Duration:</span>
              <span className="text-cyan-300 font-bold">{snapshotA.outputs.washTime} min</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Water:</span>
              <span className="text-blue-300 font-bold">{snapshotA.outputs.waterIntake} L</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Detergent:</span>
              <span className="text-purple-300 font-bold">{snapshotA.outputs.detergent} ml</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Temp:</span>
              <span className="text-amber-300 font-bold">{snapshotA.outputs.temperature} °C</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Spin:</span>
              <span className="text-emerald-300 font-bold">{snapshotA.outputs.spinSpeed} RPM</span>
            </div>
          </div>
        </div>

        {/* Scenario B */}
        <div className="glass p-5 rounded-2xl border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sm font-bold text-indigo-300 font-mono">Scenario B</span>
            <span className="text-xs text-slate-400 font-mono">{snapshotB.outputs.washTime} min wash</span>
          </div>

          {/* Quick Preset buttons */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.slice(3, 7).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  Object.entries(p.sensors).forEach(([k, v]) => setSensorB(k as any, v));
                }}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800"
              >
                {p.icon} {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Sensor Sliders B */}
          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Dirtiness:</span>
                <span className="text-indigo-300 font-bold">{scenarioB.dirtiness}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scenarioB.dirtiness}
                onChange={(e) => setSensorB('dirtiness', parseFloat(e.target.value))}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Greasiness:</span>
                <span className="text-indigo-300 font-bold">{scenarioB.greasiness}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scenarioB.greasiness}
                onChange={(e) => setSensorB('greasiness', parseFloat(e.target.value))}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Load Weight:</span>
                <span className="text-indigo-300 font-bold">{scenarioB.loadWeight} kg</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={scenarioB.loadWeight}
                onChange={(e) => setSensorB('loadWeight', parseFloat(e.target.value))}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Output summary box */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Duration:</span>
              <span className="text-indigo-300 font-bold">{snapshotB.outputs.washTime} min</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Water:</span>
              <span className="text-blue-300 font-bold">{snapshotB.outputs.waterIntake} L</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Detergent:</span>
              <span className="text-purple-300 font-bold">{snapshotB.outputs.detergent} ml</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Temp:</span>
              <span className="text-amber-300 font-bold">{snapshotB.outputs.temperature} °C</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Spin:</span>
              <span className="text-emerald-300 font-bold">{snapshotB.outputs.spinSpeed} RPM</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Comparison;
