// src/components/PlayerCard.jsx
// Premium player card with player headshot, team logo, stat pills, and glassmorphism

import { useState } from 'react';
import { getPlayerInitials, getPositionLabel } from '../services/nbaApi';

const THEMES = {
  left: {
    accent:     '#f97316',
    accentFade: 'rgba(249,115,22,0.12)',
    border:     'rgba(249,115,22,0.3)',
    glow:       '0 0 40px rgba(249,115,22,0.08)',
    badge:      { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', color: '#f97316' },
  },
  right: {
    accent:     '#3b82f6',
    accentFade: 'rgba(59,130,246,0.12)',
    border:     'rgba(59,130,246,0.3)',
    glow:       '0 0 40px rgba(59,130,246,0.08)',
    badge:      { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', color: '#3b82f6' },
  },
};

// Tiny inline stat pill
function StatPill({ label, value, theme }) {
  return (
    <div className="flex flex-col items-center rounded-xl px-3 py-2"
      style={{ background: theme.accentFade, border: `1px solid ${theme.border}` }}>
      <span className="text-base font-black" style={{ color: theme.accent }}>{value ?? '—'}</span>
      <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

export default function PlayerCard({ player, stats, loading, side }) {
  const theme = THEMES[side] || THEMES.left;

  // Empty state
  if (!player) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px] text-gray-700"
        style={{ borderColor: 'rgba(255,255,255,0.06)', boxShadow: 'none' }}>
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center mb-3 text-2xl">
          ?
        </div>
        <p className="text-sm">No player selected</p>
      </div>
    );
  }

  const initials = getPlayerInitials(player);
  const fullName = `${player.first_name} ${player.last_name}`;
  const team     = player.team?.full_name || 'Free Agent';
  const position = getPositionLabel(player.position);

  // NBA CDN URLs
  const headshotUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`;
  const logoUrl     = player.team?.id ? `https://cdn.nba.com/logos/nba/${player.team.id}/global/L/logo.svg` : null;

  return (
    <div className="glass glass-hover rounded-2xl p-6 flex flex-col items-center text-center animate-fade-up"
      style={{ border: `1px solid ${theme.border}`, boxShadow: theme.glow }}>

      {/* Headshot Avatar */}
      <div className="relative mb-4 overflow-hidden rounded-full flex items-center justify-center" 
           style={{ width: 100, height: 100, border: `2px solid ${theme.border}`, background: 'rgba(255,255,255,0.02)' }}>
        <img 
          key={player.id}
          src={headshotUrl} 
          alt={fullName}
          className="object-cover w-full h-full scale-[1.2] translate-y-1.5"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback Initials (hidden by default, shown via onError) */}
        <div className="absolute inset-0 hidden items-center justify-center text-3xl font-black"
          style={{ background: theme.accentFade, color: theme.accent }}>
          {initials}
        </div>
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-white leading-tight mb-2 tracking-tight">{fullName}</h2>

      {/* Team & Logo */}
      <div className="flex items-center justify-center gap-2 mb-3 h-6">
        {logoUrl && (
          <img 
            key={player.team?.id}
            src={logoUrl} 
            alt="Team Logo" 
            className="h-full object-contain"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <p className="text-xs text-gray-400 leading-relaxed">{team}</p>
      </div>

      {/* Position badge */}
      {position && position !== '—' && (
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: theme.badge.bg, color: theme.badge.color, border: `1px solid ${theme.badge.border}` }}>
          {position}
        </span>
      )}

      {/* Quick stat pills */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 w-full mt-2">
          <StatPill label="PTS"  value={stats.pts?.toFixed(1)}  theme={theme} />
          <StatPill label="AST"  value={stats.ast?.toFixed(1)}  theme={theme} />
          <StatPill label="REB"  value={stats.reb?.toFixed(1)}  theme={theme} />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3.5 h-3.5 border-2 rounded-full spin"
            style={{ borderColor: `${theme.accent}40`, borderTopColor: theme.accent }} />
          Loading stats…
        </div>
      )}

      {/* No stats warning */}
      {!loading && player && !stats && (
        <p className="mt-4 text-xs text-yellow-500/70 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
          No stats found for this season
        </p>
      )}
    </div>
  );
}
