// src/components/SearchBox.jsx
// Debounced live-search with animated dropdown + glassmorphism style

import { useState, useEffect, useRef } from 'react';
import { searchPlayers, getPlayerInitials } from '../services/nbaApi';

const THEMES = {
  left:  { accent: '#f97316', ring: 'focus:border-orange-500 focus:ring-orange-500/30', label: 'text-orange-400', dot: 'bg-orange-500' },
  right: { accent: '#3b82f6', ring: 'focus:border-blue-500 focus:ring-blue-500/30',   label: 'text-blue-400',   dot: 'bg-blue-500'   },
};

export default function SearchBox({ label, onSelect, selectedPlayer, side = 'left' }) {
  const theme = THEMES[side];
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [open, setOpen]       = useState(false);
  const debounceRef           = useRef(null);
  const containerRef          = useRef(null);
  const inputRef              = useRef(null);

  // Debounce search
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setOpen(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const players = await searchPlayers(query);
        setResults(players);
        setOpen(true);
      } catch {
        setError('Search failed. Check your connection.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 380);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(player) {
    onSelect(player);
    setQuery(`${player.first_name} ${player.last_name}`);
    setOpen(false);
    setResults([]);
  }

  function handleClear() {
    onSelect(null);
    setQuery('');
    setResults([]);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Label */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
        <label className={`text-xs font-bold uppercase tracking-widest ${theme.label}`}>
          {label}
        </label>
        {selectedPlayer && (
          <span className="ml-auto text-[10px] text-gray-600 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            Selected
          </span>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by player name…"
          className={`w-full glass rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-600 text-sm
            outline-none ring-1 ring-transparent focus:ring-1 ${theme.ring}
            transition-all duration-200`}
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        />

        {/* Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full spin"
            style={{ borderColor: `${theme.accent}40`, borderTopColor: theme.accent }} />
        )}

        {/* Clear */}
        {!loading && selectedPlayer && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all text-sm leading-none"
            aria-label="Clear"
          >×</button>
        )}
      </div>

      {/* Error */}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 glass rounded-2xl overflow-hidden shadow-2xl animate-fade-up"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          {results.map((player, idx) => {
            const initials = getPlayerInitials(player);
            return (
              <li
                key={player.id}
                onClick={() => handleSelect(player)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer glass-hover border-b last:border-none transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.05)', animationDelay: `${idx * 30}ms` }}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 flex-shrink-0"
                  style={{ background: `${theme.accent}22`, border: `1px solid ${theme.accent}44`, color: theme.accent }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {player.team?.full_name || 'Free Agent'}
                    {player.position && <span className="ml-1 text-gray-600">· {player.position}</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* No results */}
      {open && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 glass rounded-xl px-4 py-3 text-sm text-gray-500 animate-fade-up"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          No players found for "<span className="text-gray-300">{query}</span>"
        </div>
      )}
    </div>
  );
}
