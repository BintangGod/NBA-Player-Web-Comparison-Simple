import React from 'react';

export default function CareerAndAwards({ player, details, side }) {
  if (!player || !details) return null;

  const isLeft = side === 'left';
  const color = isLeft ? 'text-orange-400' : 'text-blue-400';
  const bg = isLeft ? 'bg-orange-500/10' : 'bg-blue-500/10';
  const border = isLeft ? 'border-orange-500/20' : 'border-blue-500/20';

  return (
    <div className={`glass rounded-2xl p-5 border shadow-lg ${border} animate-fade-up`}>
      <h3 className={`text-lg font-black mb-4 ${color}`}>
        {player.first_name} {player.last_name}
      </h3>

      {/* Career Teams */}
      <div className="mb-5">
        <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Career Journey</h4>
        <div className="flex flex-wrap gap-2">
          {details.teams.length > 0 ? (
            details.teams.map((t) => (
              <div key={t.key} className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1">
                <img 
                  src={`https://cdn.nba.com/logos/nba/${t.id}/global/L/logo.svg`}
                  alt={t.abbr}
                  className="w-5 h-5 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="text-xs font-semibold text-gray-300">
                  {t.abbr} <span className="text-gray-500 ml-0.5">{t.years}</span>
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-500">No team history available.</span>
          )}
        </div>
      </div>

      {/* Accolades */}
      <div>
        <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Accolades & Awards</h4>
        <div className="flex flex-col gap-2">
          {details.awards.length > 0 ? (
            details.awards.map((award, idx) => (
              <div key={idx} className={`flex items-center justify-between px-3 py-2 rounded-xl ${bg} ${border} border`}>
                <span className="text-sm font-semibold text-gray-200">{award.desc}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${color} bg-black/20`}>
                  x{award.count}
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-500">No major accolades listed.</span>
          )}
        </div>
      </div>
    </div>
  );
}
