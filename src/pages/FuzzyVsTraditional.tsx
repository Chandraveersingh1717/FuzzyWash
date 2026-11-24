import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { runSimulation } from '../engine/simulation';
import { DEFAULT_SENSORS } from '../data/presets';

export const FuzzyVsTraditional: React.FC = () => {
  const [dirtiness, setDirtiness] = useState(35);

  // Traditional threshold logic function
  const calcTraditional = (dirt: number) => {
    if (dirt < 30) return 15;
    if (dirt < 70) return 30;
    return 50;
  };

  // Pre-calculate 100 points for chart curve
  const comparisonCurve = useMemo(() => {
    const pts = [];
    for (let d = 0; d <= 100; d += 2) {
      const trad = calcTraditional(d);
      const snap = runSimulation({
        ...DEFAULT_SENSORS,
        dirtiness: d,
      });
      pts.push({
        dirtiness: d,
        Traditional: trad,
        FuzzyLogic: snap.outputs.washTime,
      });
    }
    return pts;
  }, []);

  const currentTrad = calcTraditional(dirtiness);
  const currentSnap = runSimulation({
    ...DEFAULT_SENSORS,
    dirtiness,
  });
  const currentFuzzy = currentSnap.outputs.washTime;
  const delta = Math.abs(currentFuzzy - currentTrad);

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
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Fuzzy Logic vs Traditional Crisp Thresholds</h2>
          </div>
          <p className="text-xs text-slate-400">
            Compare discontinuous step transitions in standard IF-ELSE code against continuous, smooth fuzzy reasoning
          </p>
        </div>
      </div>

      {/* Interactive Dirtiness Slider Card */}
      <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-200">Sweep Dirtiness Across Threshold Boundaries</span>
          <span className="text-base font-bold font-mono text-cyan-400">{dirtiness}% Dirtiness</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={dirtiness}
          onChange={(e) => setDirtiness(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>0% (Clean)</span>
          <span className="text-amber-400 font-bold">Boundary 1: 30%</span>
          <span className="text-amber-400 font-bold">Boundary 2: 70%</span>
          <span>100% (Heavily Soiled)</span>
        </div>
      </div>

      {/* Side-by-Side Current Decision Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Logic Card */}
        <div className="glass p-5 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Traditional Boolean / Crisp Logic
            </span>
            <span className="text-xs font-mono text-slate-400">Step Transitions</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-slate-300">
              <code className="text-[11px] block text-rose-300">
                IF dirtiness &lt; 30 → 15 min<br />
                ELSE IF dirtiness &lt; 70 → 30 min<br />
                ELSE → 50 min
              </code>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="text-slate-400">Actuation Output:</span>
              <span className="text-2xl font-black text-rose-400">{currentTrad} min</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              At 29.9% dirtiness the cycle is 15 min; at 30.0% it suddenly jumps to 30 min — a harsh 100% jump over a 0.1% sensory change!
            </p>
          </div>
        </div>

        {/* Fuzzy Logic Card */}
        <div className="glass p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Continuous Mamdani Fuzzy Logic
            </span>
            <span className="text-xs font-mono text-slate-400">Smooth Interpolation</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-slate-300">
              <code className="text-[11px] block text-emerald-300">
                Overlapping sets: Small, Medium, Large<br />
                Centroid integration calculates continuous curve
              </code>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="text-slate-400">Actuation Output:</span>
              <span className="text-2xl font-black text-emerald-400">{currentFuzzy} min</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Continuous smooth transition. Energy and water are conserved, mechanical wear is minimized, and sensor noise does not cause cycle thrashing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Curve Plot: Smooth vs Jump */}
      <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200">Decision Response Curve Across 0–100% Range</h4>
          <span className="text-xs font-mono text-slate-400">Delta at {dirtiness}%: {delta.toFixed(1)} min</span>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonCurve} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="dirtiness" stroke="#64748b" fontSize={11} unit="%" />
              <YAxis stroke="#64748b" fontSize={11} unit="m" domain={[0, 60]} />
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
              <Line
                type="stepAfter"
                dataKey="Traditional"
                stroke="#F43F5E"
                strokeWidth={2}
                dot={false}
                name="Traditional Step Logic"
              />
              <Line
                type="monotone"
                dataKey="FuzzyLogic"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
                name="Fuzzy Logic (Smooth)"
              />
              <ReferenceLine x={dirtiness} stroke="#22D3EE" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default FuzzyVsTraditional;
