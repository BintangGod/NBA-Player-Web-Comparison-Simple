// src/App.jsx
// Main app — orchestrates state, season picker, and all child components

import { useState, useEffect } from 'react';
import SearchBox     from './components/SearchBox';
import PlayerCard    from './components/PlayerCard';
import ComparisonView from './components/ComparisonView';
import CareerAndAwards from './components/CareerAndAwards';
import { getPlayerStats, getPlayerDetails, getAvailableSeasons } from './services/nbaApi';

export default function App() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [stats1,  setStats1]  = useState(null);
  const [stats2,  setStats2]  = useState(null);
  const [details1, setDetails1] = useState(null);
  const [details2, setDetails2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1,  setError1]  = useState('');
  const [error2,  setError2]  = useState('');
  const [season,  setSeason]  = useState(2024);

  const seasons = getAvailableSeasons();

  // Fetch stats & details whenever player or season changes
  useEffect(() => {
    if (!player1) { setStats1(null); setDetails1(null); setError1(''); return; }
    setLoading1(true); setError1('');
    Promise.all([
      getPlayerStats(player1.id, season),
      getPlayerDetails(player1.id)
    ])
      .then(([s, d]) => { setStats1(s); setDetails1(d); })
      .catch(() => setError1('Failed to load data for Player 1.'))
      .finally(() => setLoading1(false));
  }, [player1, season]);

  useEffect(() => {
    if (!player2) { setStats2(null); setDetails2(null); setError2(''); return; }
    setLoading2(true); setError2('');
    Promise.all([
      getPlayerStats(player2.id, season),
      getPlayerDetails(player2.id)
    ])
      .then(([s, d]) => { setStats2(s); setDetails2(d); })
      .catch(() => setError2('Failed to load data for Player 2.'))
      .finally(() => setLoading2(false));
  }, [player2, season]);

  const bothSelected = player1 && player2;
  const bothHaveStats = stats1 && stats2;

  return (
    <div className="min-h-screen bg-mesh">

      {/* ── Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(8,8,16,0.85)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(249,115,22,0.1))', border: '1px solid rgba(249,115,22,0.3)' }}>
              🏀
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight leading-none"
                style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                NBA Compare
              </h1>
              <p className="text-[10px] text-gray-600 leading-none mt-0.5">Player Stats · Head to Head</p>
            </div>
          </div>

          {/* Season selector */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-gray-600 hidden sm:block font-medium">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="glass text-white text-sm rounded-xl px-3 py-2 outline-none cursor-pointer transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'white', background: 'rgba(255,255,255,0.06)' }}
            >
              {seasons.map((s) => (
                <option key={s} value={s} style={{ background: '#111118' }}>
                  {s}–{String(s + 1).slice(2)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-[11px] text-gray-600 border border-white/[0.07] rounded-full px-4 py-1.5 mb-5"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Live data via stats.nba.com
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight leading-tight"
            style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            Compare Any Two{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
              NBA Players
            </span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Search for two players, pick a season, and instantly see their stats head-to-head.
          </p>
        </div>

        {/* Search row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <SearchBox label="Player 1" side="left"  onSelect={setPlayer1} selectedPlayer={player1} />
          <SearchBox label="Player 2" side="right" onSelect={setPlayer2} selectedPlayer={player2} />
        </div>

        {/* Errors */}
        {(error1 || error2) && (
          <div className="space-y-2 mb-4">
            {error1 && (
              <div className="text-sm text-red-400 rounded-xl px-4 py-2"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error1}
              </div>
            )}
            {error2 && (
              <div className="text-sm text-red-400 rounded-xl px-4 py-2"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error2}
              </div>
            )}
          </div>
        )}

        {/* Player cards */}
        {(player1 || player2) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <PlayerCard player={player1} stats={stats1} loading={loading1} side="left" />
            <PlayerCard player={player2} stats={stats2} loading={loading2} side="right" />
          </div>
        )}

        {/* VS divider when both selected */}
        {bothSelected && (
          <div className="flex items-center gap-4 mb-2 animate-fade-up">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.3))' }} />
            <div className="glass rounded-full w-10 h-10 flex items-center justify-center text-xs font-black text-gray-400"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              VS
            </div>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(59,130,246,0.3))' }} />
          </div>
        )}

        {/* Comparison table + charts */}
        <ComparisonView
          player1={player1} player2={player2}
          stats1={stats1}   stats2={stats2}
          season={season}
        />

        {/* Career & Awards section */}
        {(details1 || details2) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <CareerAndAwards player={player1} details={details1} side="left" />
            <CareerAndAwards player={player2} details={details2} side="right" />
          </div>
        )}

        {/* Empty state */}
        {!player1 && !player2 && (
          <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>
              🏀
            </div>
            <p className="text-lg font-semibold text-gray-600 mb-2">Search for two players to compare</p>
            <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
              {['LeBron James', 'Stephen Curry', 'Nikola Jokic', 'Jayson Tatum'].map((name) => (
                <span key={name}
                  className="text-xs text-gray-700 border border-white/[0.06] rounded-full px-3 py-1"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  Try "{name}"
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t mt-20 py-8 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-xs text-gray-700">
          Data provided by the official{' '}
          <span className="text-orange-600/80 font-semibold">
            NBA API
          </span>
          {' '}· For educational purposes only · NBA Compare
        </p>
      </footer>
    </div>
  );
}
