// src/services/nbaApi.js
// API proxy via Cloudflare Functions to stats.nba.com

const BASE_URL = '/api';

// Cache all players so we don't fetch 4000+ rows on every search stroke
let cachedPlayers = null;

/**
 * Fetch all players once, then filter locally by name
 */
export async function searchPlayers(name) {
  if (!name || name.trim().length < 2) return [];
  const query = name.trim().toLowerCase();

  // Load cache if not already loaded
  if (!cachedPlayers) {
    // commonallplayers endpoint returns all historical and current players
    const res = await fetch(`${BASE_URL}/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2024-25`);
    if (!res.ok) throw new Error(`Player fetch failed: ${res.status}`);
    const json = await res.json();
    
    // Parse the NBA API rowSet format
    const headers = json.resultSets[0].headers;
    const rows = json.resultSets[0].rowSet;
    
    const idIdx = headers.indexOf('PERSON_ID');
    const nameIdx = headers.indexOf('DISPLAY_FIRST_LAST');
    const teamCityIdx = headers.indexOf('TEAM_CITY');
    const teamNameIdx = headers.indexOf('TEAM_NAME');
    const teamIdIdx   = headers.indexOf('TEAM_ID');
    const fromYearIdx = headers.indexOf('FROM_YEAR');
    const toYearIdx = headers.indexOf('TO_YEAR');

    cachedPlayers = rows.map(row => {
      const fullName = row[nameIdx] || '';
      const parts = fullName.split(' ');
      const first_name = parts[0];
      const last_name = parts.slice(1).join(' ') || '';
      
      return {
        id: row[idIdx],
        first_name,
        last_name,
        full_name: fullName.toLowerCase(),
        from_year: row[fromYearIdx],
        to_year: row[toYearIdx],
        team: {
          id: row[teamIdIdx],
          full_name: row[teamCityIdx] && row[teamNameIdx] 
            ? `${row[teamCityIdx]} ${row[teamNameIdx]}` 
            : 'Unassigned / Alumni'
        },
        position: '—' // commonallplayers doesn't return position, we can fallback
      };
    });
  }

  // Filter cached players
  const results = cachedPlayers.filter(p => p.full_name.includes(query));
  
  // Sort: active players first, then by name match
  results.sort((a, b) => {
    const aActive = a.to_year === '2024';
    const bActive = b.to_year === '2024';
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return 0;
  });

  return results.slice(0, 10);
}

/**
 * Get season averages for a player using playercareerstats
 * @param {number} playerId
 * @param {number} season - e.g. 2024 for "2024-25"
 */
export async function getPlayerStats(playerId, season) {
  const res = await fetch(
    `${BASE_URL}/stats/playercareerstats?PerMode=PerGame&PlayerID=${playerId}`
  );
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
  const json = await res.json();
  
  const headers = json.resultSets[0].headers;
  const rows = json.resultSets[0].rowSet;
  
  const seasonStr = `${season}-${String(season + 1).slice(2)}`; // 2024 -> "2024-25"
  const seasonIdx = headers.indexOf('SEASON_ID');
  
  // Find the row matching the requested season
  const seasonRow = rows.find(row => row[seasonIdx] === seasonStr);
  if (!seasonRow) return null; // Player didn't play this season
  
  // Map NBA API columns to the format our frontend expects
  return {
    games_played: seasonRow[headers.indexOf('GP')],
    min: seasonRow[headers.indexOf('MIN')],
    pts: seasonRow[headers.indexOf('PTS')],
    ast: seasonRow[headers.indexOf('AST')],
    reb: seasonRow[headers.indexOf('REB')],
    stl: seasonRow[headers.indexOf('STL')],
    blk: seasonRow[headers.indexOf('BLK')],
    turnover: seasonRow[headers.indexOf('TOV')],
    fg_pct: seasonRow[headers.indexOf('FG_PCT')],
    fg3_pct: seasonRow[headers.indexOf('FG3_PCT')],
    ft_pct: seasonRow[headers.indexOf('FT_PCT')]
  };
}

/**
 * Get available seasons (2000 → current), newest first.
 */
export function getAvailableSeasons() {
  const current = new Date().getFullYear();
  // If we are before October, the new season hasn't started yet
  const maxSeason = new Date().getMonth() < 9 ? current - 1 : current;
  const seasons = [];
  for (let y = maxSeason; y >= 2000; y--) seasons.push(y);
  return seasons;
}

/**
 * Get player initials from player object.
 */
export function getPlayerInitials(player) {
  const f = player?.first_name?.[0] || '';
  const l = player?.last_name?.[0] || '';
  return (f + l).toUpperCase();
}

/**
 * Compute an overall rating (0–100) from a player's stats.
 */
export function computeOverallRating(stats) {
  if (!stats) return null;
  const pts  = (stats.pts      || 0) * 1.5;
  const ast  = (stats.ast      || 0) * 2.0;
  const reb  = (stats.reb      || 0) * 1.2;
  const stl  = (stats.stl      || 0) * 3.0;
  const blk  = (stats.blk      || 0) * 2.5;
  const tov  = (stats.turnover || 0) * -1.5;
  const fg   = (stats.fg_pct   || 0) * 20;
  const raw  = pts + ast + reb + stl + blk + tov + fg;
  return Math.min(100, Math.max(0, Math.round(raw * 1.2)));
}

/**
 * Map position abbreviation to full label.
 */
export function getPositionLabel(pos) {
  if (!pos || pos === '—') return 'Player';
  const map = {
    G: 'Guard', F: 'Forward', C: 'Center',
    'G-F': 'Guard-Forward', 'F-C': 'Forward-Center',
  };
  return map[pos] || pos;
}

/**
 * Get player career teams and awards
 */
export async function getPlayerDetails(playerId) {
  try {
    const [careerRes, awardsRes] = await Promise.all([
      fetch(`${BASE_URL}/stats/playercareerstats?PerMode=PerGame&PlayerID=${playerId}`),
      fetch(`${BASE_URL}/stats/playerawards?PlayerID=${playerId}`)
    ]);
    
    if (!careerRes.ok || !awardsRes.ok) return { teams: [], awards: [] };
    
    const careerJson = await careerRes.json();
    const awardsJson = await awardsRes.json();
    
    // Extract unique teams & stints
    const careerHeaders = careerJson.resultSets[0].headers;
    const careerRows = careerJson.resultSets[0].rowSet;
    const teamAbbrIdx = careerHeaders.indexOf('TEAM_ABBREVIATION');
    const teamIdIdx = careerHeaders.indexOf('TEAM_ID');
    const seasonIdx = careerHeaders.indexOf('SEASON_ID');
    
    const teamsList = [];
    let currentTeam = null;
    
    careerRows.forEach(row => {
      const abbr = row[teamAbbrIdx];
      const id = row[teamIdIdx];
      const season = row[seasonIdx]; // e.g. "2003-04"
      const year = parseInt(season.split('-')[0]);
      
      if (abbr === 'TOT' || id === 0) return;
      
      if (!currentTeam || currentTeam.id !== id) {
        currentTeam = { id, abbr, start: year, end: year };
        teamsList.push(currentTeam);
      } else {
        currentTeam.end = year;
      }
    });
    
    const teams = teamsList.map((t, idx) => ({
      key: `${t.id}-${idx}`, // Needs unique key since player can return to same team
      id: t.id, 
      abbr: t.abbr,
      years: t.start === t.end ? `${t.start}` : `${t.start}-${String(t.end + 1).slice(2)}`
    }));

    // Extract awards
    const awardsHeaders = awardsJson.resultSets[0].headers;
    const awardsRows = awardsJson.resultSets[0].rowSet;
    const descIdx = awardsHeaders.indexOf('DESCRIPTION');
    
    const awardsMap = new Map();
    awardsRows.forEach(row => {
      const desc = row[descIdx];
      awardsMap.set(desc, (awardsMap.get(desc) || 0) + 1);
    });
    
    const awards = Array.from(awardsMap.entries())
      .map(([desc, count]) => ({ desc, count }))
      .sort((a, b) => b.count - a.count);

    return { teams, awards };
  } catch (err) {
    console.error(err);
    return { teams: [], awards: [] };
  }
}

