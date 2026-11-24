import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';
import { sampleMF, evaluateMF } from '../engine/membershipFunctions';
import type { MembershipFunction } from '../types/fuzzy';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MembershipChartProps {
  varId: string;
  crispValue: number;
  membershipFunctions: MembershipFunction[];
  title: string;
  unit: string;
  min: number;
  max: number;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: 'rgba(11, 16, 32, 0.95)',
        border: '1px solid #1e3a5f',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      <p style={{ color: '#94a3b8', marginBottom: 4 }}>
        x = <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{Number(label).toFixed(2)}</span>
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: '2px 0' }}>
          {entry.name}: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{Number(entry.value).toFixed(4)}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const MembershipChart: React.FC<MembershipChartProps> = ({
  varId,
  crispValue,
  membershipFunctions,
  title,
  unit,
  min,
  max,
}) => {
  // Build merged data: one array of {x, [mfLabel]: y} objects
  const chartData = useMemo(() => {
    if (!membershipFunctions.length) return [];

    // Sample all MFs, merge by x index
    const allSamples = membershipFunctions.map((mf) => sampleMF(mf, min, max, 200));
    const len = allSamples[0].length;

    return Array.from({ length: len }, (_, i) => {
      const x = allSamples[0][i].x;
      const point: Record<string, number> = { x };
      membershipFunctions.forEach((mf, mi) => {
        point[mf.label] = allSamples[mi][i].y;
      });
      return point;
    });
  }, [membershipFunctions, min, max, varId]);

  // Reference dots: intersection of crisp line with each MF
  const refDots = useMemo(
    () =>
      membershipFunctions.map((mf) => ({
        label: mf.label,
        color: mf.color,
        y: evaluateMF(mf, crispValue),
      })),
    [membershipFunctions, crispValue]
  );

  const clampedCrisp = Math.max(min, Math.min(max, crispValue));

  return (
    <div
      style={{
        background: 'transparent',
        borderRadius: 12,
        padding: '8px 0',
      }}
    >
      {title && (
        <p
          style={{
            color: '#94a3b8',
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
            paddingLeft: 8,
          }}
        >
          {title}
          {unit ? ` (${unit})` : ''}
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[min, max]}
            tickCount={7}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v: number) => `${Number(v).toFixed(unit === 'kg' ? 1 : 0)}`}
            axisLine={{ stroke: '#1e3a5f' }}
            tickLine={{ stroke: '#1e3a5f' }}
          />
          <YAxis
            domain={[0, 1]}
            tickCount={6}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v: number) => v.toFixed(1)}
            axisLine={{ stroke: '#1e3a5f' }}
            tickLine={{ stroke: '#1e3a5f' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 4 }}
          />

          {/* One line per membership function */}
          {membershipFunctions.map((mf) => (
            <Line
              key={mf.label}
              type="monotone"
              dataKey={mf.label}
              stroke={mf.color}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}

          {/* Vertical reference line at crisp value */}
          <ReferenceLine
            x={clampedCrisp}
            stroke="#22D3EE"
            strokeDasharray="5 3"
            strokeWidth={2}
            label={{
              value: `${Number(clampedCrisp).toFixed(unit === 'kg' ? 1 : 0)}${unit}`,
              position: 'top',
              fill: '#22D3EE',
              fontSize: 11,
              fontWeight: 600,
            }}
          />

          {/* Reference dots at intersections */}
          {refDots.map(({ label, color, y }) =>
            y > 0.001 ? (
              <ReferenceDot
                key={label}
                x={clampedCrisp}
                y={y}
                r={5}
                fill={color}
                stroke="#0B1020"
                strokeWidth={2}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MembershipChart;
