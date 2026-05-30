// src/components/ComparisonView.jsx
// Premium head-to-head comparison: animated stat bars + switchable chart tabs

import { useState } from 'react';
import StatChart from './StatChart';

const STAT_ROWS = [
  { label: 'Points',         key: 'pts',       fmt: (v) => v?.toFixed(1) ?? '—',                         higher: true  },
  { label: 'Assists',        key: 'ast',       fmt: (v) => v?.toFixed(1) ?? '—',                         higher: true  },
  { label: 'Rebounds',       key: 'reb',       fmt: (v) => v?.toFixed(1) ?? '—',                         higher: true  },
  { label: 'FG %',           key: 'fg_pct',    fmt: (v) => v != null ? `${(v*100).toFixed(1)}%` : '—',   higher: true  },
  { label: '3P %',           key: 'fg3_pct',   fmt: (v) => v != null ? `${(v*100).toFixed(1)}%` : '—',   higher: true  },
  { label: 'FT %',           key: 'ft_pct',    fmt: (v) => v != null ? `${(v*100).toFixed(1)}%` : '—',   higher: true  },
  { label: 'Steals',         key: 'stl',       fmt: (v) => v?.toFixed(1) ?? '—',                         higher: true  },
  { label: 'Blocks',         key: 'blk',       fmt: (v) => v?.toFixed(1) ?? '—',                         higher: true  },
  { label: 'Turnovers',      key: 'turnover',  fmt: (v) => v?.toFixed(1) ?? '—',                         higher: false },
  { label: 'Games Played',   key: 'games_played', fmt: (v) => v ?? '—',                                  higher: true  },
  { label: 'Minutes / Game', key: 'min',       fmt: (v) => v ?? '—',                                     higher: true  },
];

function winner(key, v1, v2, higherIsBetter) {
  if (v1 == null || v2 == null) return null;
  if (v1 === v2) return 'tie';
  return (higherIsBetter ? v1 > v2 : v1 < v2) ? 'left' : 'right';
}

// Animated horizontal bar for a stat
function StatBar({ val1, val2, higher }) {
  const max = Math.max(val1 || 0, val2 || 0);
  if (!max) return null;
  const pct1 = ((val1 || 0) / max) * 100;
  const pct2 = ((val2 || 0) / max) * 100;

  return (
    <div className="flex items-center gap-1.5 mt-1">
      {/* Player 1 bar (right-aligned) */}
      <div className="flex-1 flex justify-end">
        <div className="h-1 rounded-full bg-orange-500/80 transition-all duration-700"
          style={{ width: `${pct1}%` }} />
      </div>
      {/* Center dot */}
      <div className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0" />
      {/* Player 2 bar */}
      <div className="flex-1">
        <div className="h-1 rounded-full bg-blue-500/80 transition-all duration-700"
          style={{ width: `${pct2}%` }} />
      </div>
    </div>
  );
}

const CHART_TABS = [
  { id: 'bar',   label: 'Bar Chart' },
  { id: 'radar', label: 'Radar Chart' },
];

export default function ComparisonView({ player1, player2, stats1, stats2, season }) {
  const [activeTab, setActiveTab] = useState('bar');

  if (!player1 && !player2) return null;

  const name1 = player1 ? `${player1.first_name} ${player1.last_name}` : '—';
  const name2 = player2 ? `${player2.first_name} ${player2.last_name}` : '—';

  // Count wins per player
  let wins1 = 0, wins2 = 0;
  STAT_ROWS.forEach(({ key, higher }) => {
    const w = winner(key, stats1?.[key], stats2?.[key], higher);
    if (w === 'left')  wins1++;
    if (w === 'right') wins2++;
  });

  return (
    <div className="mt-8 space-y-5 animate-fade-up">

      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.15em]">
          {season}–{String(season + 1).slice(2)} Season Comparison
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* Win count banner */}
      {stats1 && stats2 && (
        <div className="glass rounded-2xl p-4 grid grid-cols-3 text-center"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <p className="text-2xl font-black text-orange-400">{wins1}</p>
            <p className="text-[11px] text-gray-600 mt-0.5 truncate">{player1?.last_name} leads</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold">Categories</span>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-400">{wins2}</p>
            <p className="text-[11px] text-gray-600 mt-0.5 truncate">{player2?.last_name} leads</p>
          </div>
        </div>
      )}

      {/* Stat rows */}
      <div className="glass rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Header row */}
        <div className="grid grid-cols-3 px-5 py-4 border-b"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="text-sm font-bold text-orange-400 truncate pr-2">{name1}</div>
          <div className="text-[10px] text-center text-gray-600 uppercase tracking-widest self-center">Stat</div>
          <div className="text-sm font-bold text-blue-400 text-right truncate pl-2">{name2}</div>
        </div>

        {STAT_ROWS.map(({ label, key, fmt, higher }) => {
          const v1 = stats1?.[key];
          const v2 = stats2?.[key];
          const w  = winner(key, v1, v2, higher);
          const isNum = typeof v1 === 'number' && typeof v2 === 'number';

          return (
            <div key={key}
              className="group border-b last:border-none transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="grid grid-cols-3 px-5 py-3 group-hover:bg-white/[0.015]">

                {/* Player 1 */}
                <div className={`text-sm font-bold flex items-center gap-1
                  ${w === 'left' ? 'text-orange-400' : 'text-gray-400'}`}>
                  {w === 'left' && <span className="text-[10px] text-orange-500">▲</span>}
                  {fmt(v1)}
                </div>

                {/* Label */}
                <div className="text-[11px] text-center text-gray-600 self-center">{label}</div>

                {/* Player 2 */}
                <div className={`text-sm font-bold flex items-center justify-end gap-1
                  ${w === 'right' ? 'text-blue-400' : 'text-gray-400'}`}>
                  {fmt(v2)}
                  {w === 'right' && <span className="text-[10px] text-blue-500">▲</span>}
                </div>
              </div>

              {/* Bar */}
              {isNum && (
                <div className="px-5 pb-2">
                  <StatBar val1={v1} val2={v2} higher={higher} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts section — only when both players have stats */}
      {stats1 && stats2 && (
        <div className="glass rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            {CHART_TABS.map((tab) => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            <StatChart
              player1={player1} player2={player2}
              stats1={stats1}   stats2={stats2}
              mode={activeTab}
            />
          </div>
        </div>
      )}
    </div>
  );
}
