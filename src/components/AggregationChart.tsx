import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useFuzzyStore } from '../store/fuzzyStore';
import { ALL_CONTROLLERS } from '../engine/ruleBase';

interface AggregationChartProps {
  controllerId: string;
}

export const AggregationChart: React.FC<AggregationChartProps> = ({ controllerId }) => {
  const { snapshot } = useFuzzyStore();
  const aggregated = snapshot.aggregated[controllerId];
  const defuzz = snapshot.defuzzified[controllerId];
  const controller = ALL_CONTROLLERS.find((c) => c.id === controllerId);

  if (!aggregated || !controller || !defuzz) {
    return <div className="text-slate-500 text-xs p-4">No aggregation data available.</div>;
  }

  // Downsample to ~100 points for smooth charting performance
  const chartData = aggregated.points.filter((_, i) => i % 2 === 0).map((pt) => ({
    x: parseFloat(pt.x.toFixed(1)),
    μ: parseFloat(pt.y.toFixed(3)),
  }));

  return (
    <div className="w-full glass p-4 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            MAX-Aggregated Fuzzy Output Area
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {controller.name}
            </span>
          </h4>
          <p className="text-xs text-slate-400">
            Union of all clipped consequents: μ_agg(z) = max_i(min(α_i, μ_Ci(z)))
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-mono">Centroid z*</div>
          <div className="text-base font-bold font-mono text-amber-400">
            {defuzz.crispValue} {controller.outputUnit}
          </div>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${controllerId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="x"
              stroke="#64748b"
              fontSize={11}
              domain={[controller.outputMin, controller.outputMax]}
              unit={controller.outputUnit}
            />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 1]} tickCount={6} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
              formatter={(value: any) => [`μ = ${value}`, 'Membership']}
              labelFormatter={(label) => `${label} ${controller.outputUnit}`}
            />
            <Area
              type="monotone"
              dataKey="μ"
              stroke="#22D3EE"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${controllerId})`}
            />
            {/* Centroid Reference Line */}
            <ReferenceLine
              x={defuzz.crispValue}
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: `Centroid: ${defuzz.crispValue}`,
                fill: '#F59E0B',
                fontSize: 11,
                position: 'top',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical breakdown bar */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">Numerator ∫ z·μ(z) dz:</span>
          <span className="text-cyan-300 font-semibold">{defuzz.numerator.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Denominator ∫ μ(z) dz:</span>
          <span className="text-indigo-300 font-semibold">{defuzz.denominator.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Crisp Actuation Command:</span>
          <span className="text-amber-400 font-bold">
            {defuzz.crispValue} {controller.outputUnit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AggregationChart;
