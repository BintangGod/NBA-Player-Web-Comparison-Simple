// src/components/StatChart.jsx
// Dual-mode chart: Bar Chart OR Radar Chart — both with premium dark styling

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const ORANGE = '#f97316';
const BLUE   = '#3b82f6';

// Stats for bar chart
const BAR_STATS = [
  { label: 'PTS',  key: 'pts'     },
  { label: 'AST',  key: 'ast'     },
  { label: 'REB',  key: 'reb'     },
  { label: 'STL',  key: 'stl'     },
  { label: 'BLK',  key: 'blk'     },
  { label: 'FG%',  key: 'fg_pct',  mult: 100 },
  { label: '3P%',  key: 'fg3_pct', mult: 100 },
];

// Stats for radar chart (normalized to 0–100 scale per stat max)
const RADAR_STATS = [
  { label: 'Scoring',   key: 'pts',     max: 40  },
  { label: 'Assists',   key: 'ast',     max: 15  },
  { label: 'Rebounds',  key: 'reb',     max: 20  },
  { label: 'FG%',       key: 'fg_pct',  max: 1   },
  { label: '3P%',       key: 'fg3_pct', max: 0.6 },
  { label: 'Steals',    key: 'stl',     max: 4   },
  { label: 'Blocks',    key: 'blk',     max: 4   },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-2xl text-xs"
      style={{ border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Inter, sans-serif' }}>
      <p className="text-gray-400 font-semibold mb-2">{label}</p>
      {payload.map((e) => (
        <p key={e.dataKey} className="font-medium" style={{ color: e.color }}>
          {e.name}: <span className="text-white">{typeof e.value === 'number' ? e.value.toFixed(1) : e.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function StatChart({ player1, player2, stats1, stats2, mode = 'bar' }) {
  if (!stats1 && !stats2) return null;

  const name1 = player1?.last_name || 'Player 1';
  const name2 = player2?.last_name || 'Player 2';

  /* ── BAR CHART ── */
  if (mode === 'bar') {
    const data = BAR_STATS.map(({ label, key, mult = 1 }) => ({
      stat: label,
      [name1]: stats1?.[key] != null ? parseFloat((stats1[key] * mult).toFixed(1)) : 0,
      [name2]: stats2?.[key] != null ? parseFloat((stats2[key] * mult).toFixed(1)) : 0,
    }));

    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="stat" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '14px', color: '#6b7280' }} />
          <Bar dataKey={name1} fill={ORANGE} radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey={name2} fill={BLUE}   radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /* ── RADAR CHART ── */
  const radarData = RADAR_STATS.map(({ label, key, max }) => ({
    subject: label,
    [name1]: stats1?.[key] != null ? parseFloat(((stats1[key] / max) * 100).toFixed(1)) : 0,
    [name2]: stats2?.[key] != null ? parseFloat(((stats2[key] / max) * 100).toFixed(1)) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name={name1} dataKey={name1} stroke={ORANGE} fill={ORANGE} fillOpacity={0.15} strokeWidth={2} />
        <Radar name={name2} dataKey={name2} stroke={BLUE}   fill={BLUE}   fillOpacity={0.15} strokeWidth={2} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: '#6b7280' }} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
