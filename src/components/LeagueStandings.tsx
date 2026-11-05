import React, { useState, useMemo } from 'react';
import { MLSTeam, MLSPlayer } from '../types/soccer';
import { Trophy, ArrowUpDown, Shield, Star, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

interface LeagueStandingsProps {
  teams: MLSTeam[];
  players: MLSPlayer[];
  selectedTeamId: string;
  onSelectTeamId: (teamId: string) => void;
  onSelectPlayerForCompare: (player: MLSPlayer) => void;
}

export const LeagueStandings: React.FC<LeagueStandingsProps> = ({
  teams,
  players,
  selectedTeamId,
  onSelectTeamId,
  onSelectPlayerForCompare,
}) => {
  const [sortColumn, setSortColumn] = useState<string>('points');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [activeTournament, setActiveTournament] = useState<'Apertura' | 'LiguillaProjected'>('Apertura');

  // Find franchise All-Star player for each team
  const getAllStar = (team: MLSTeam): MLSPlayer | undefined => {
    return players.find((p) => p.id === team.allStarPlayerId) || players.find((p) => p.teamId === team.id);
  };

  // Sort and calculate standings dynamically
  const sortedStandings = useMemo(() => {
    const list = [...teams];

    return list.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      if (sortColumn === 'points') {
        valA = a.stats.points;
        valB = b.stats.points;
        // Tie-breaker: goal difference, then goals for
        if (valA === valB) {
          if (a.stats.goalDiff !== b.stats.goalDiff) {
            return sortAsc ? a.stats.goalDiff - b.stats.goalDiff : b.stats.goalDiff - a.stats.goalDiff;
          }
          return sortAsc ? (a.stats.goalsFor ?? 0) - (b.stats.goalsFor ?? 0) : (b.stats.goalsFor ?? 0) - (a.stats.goalsFor ?? 0);
        }
      } else if (sortColumn === 'matchesPlayed') {
        valA = a.stats.matchesPlayed;
        valB = b.stats.matchesPlayed;
      } else if (sortColumn === 'wins') {
        valA = a.stats.wins ?? 0;
        valB = b.stats.wins ?? 0;
      } else if (sortColumn === 'draws') {
        valA = a.stats.draws ?? 0;
        valB = b.stats.draws ?? 0;
      } else if (sortColumn === 'losses') {
        valA = a.stats.losses ?? 0;
        valB = b.stats.losses ?? 0;
      } else if (sortColumn === 'goalsFor') {
        valA = a.stats.goalsFor ?? 0;
        valB = b.stats.goalsFor ?? 0;
      } else if (sortColumn === 'goalsAgainst') {
        valA = a.stats.goalsAgainst ?? 0;
        valB = b.stats.goalsAgainst ?? 0;
      } else if (sortColumn === 'goalDiff') {
        valA = a.stats.goalDiff;
        valB = b.stats.goalDiff;
      } else if (sortColumn === 'xGD') {
        valA = a.stats.xGD;
        valB = b.stats.xGD;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [teams, sortColumn, sortAsc]);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(false);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 shadow-2xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-400">
            <Trophy className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                Liga MX Official League Standings
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Apertura 2024 / Clausura 2025
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Calculated team rankings based on points, goal differential, and win/loss/draw records
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTournament('Apertura')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTournament === 'Apertura'
                  ? 'bg-cyan-500 text-black font-extrabold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Current Table
            </button>
            <button
              onClick={() => setActiveTournament('LiguillaProjected')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTournament === 'LiguillaProjected'
                  ? 'bg-cyan-500 text-black font-extrabold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Liguilla Seeding
            </button>
          </div>
        </div>
      </div>

      {/* Qualification Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            1st–6th: Direct Liguilla Quarter-Finals (Cuartos)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
            7th–10th: Play-In Qualification
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Click any column to sort · Click club to focus tactical pitch
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-slate-400 uppercase text-[10px]">
              <th className="py-3 px-3 text-center w-12">Pos</th>
              <th className="py-3 px-3">Club</th>
              <th
                onClick={() => handleSort('matchesPlayed')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5">
                  GP
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('wins')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5">
                  W
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('draws')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5">
                  D
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('losses')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5">
                  L
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('goalsFor')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5">
                  GF
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('goalsAgainst')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5">
                  GA
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('goalDiff')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-center gap-0.5 text-cyan-300 font-bold">
                  GD
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('xGD')}
                className="py-3 px-2 text-center cursor-pointer hover:text-white hidden sm:table-cell"
              >
                <div className="flex items-center justify-center gap-0.5">
                  xGD
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('points')}
                className="py-3 px-3 text-center cursor-pointer hover:text-white bg-white/5 font-extrabold text-amber-300"
              >
                <div className="flex items-center justify-center gap-0.5">
                  PTS
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-center hidden md:table-cell">Last 5</th>
              <th className="py-3 px-3 text-right">Franchise Anchor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {sortedStandings.map((team, index) => {
              const position = index + 1;
              const allStar = getAllStar(team);
              const isSelected = selectedTeamId === team.id;

              // Position qualification style
              const isDirectLiguilla = position <= 6;
              const isPlayIn = position > 6 && position <= 10;

              return (
                <tr
                  key={team.id}
                  onClick={() => onSelectTeamId(team.id)}
                  className={`hover:bg-white/5 transition-colors cursor-pointer ${
                    isSelected ? 'bg-cyan-950/40' : ''
                  }`}
                >
                  {/* Position Rank with Qualification Pill */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-tech font-bold text-xs ${
                        isDirectLiguilla
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                          : isPlayIn
                          ? 'bg-amber-950 text-amber-400 border border-amber-700/60'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {position}
                    </span>
                  </td>

                  {/* Club Logo, Name & Tactical Style */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-black shadow"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        {team.code}
                      </div>
                      <div>
                        <div className="font-display font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          {team.name}
                          {isDirectLiguilla && (
                            <span className="text-[9px] font-mono text-emerald-400 font-semibold hidden lg:inline">
                              (Liguilla Seed #{position})
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                          {team.stadium.split(',')[0]}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Matches Played */}
                  <td className="py-3 px-2 text-center font-bold text-slate-300">
                    {team.stats.matchesPlayed}
                  </td>

                  {/* Wins */}
                  <td className="py-3 px-2 text-center text-emerald-400 font-bold">
                    {team.stats.wins ?? 0}
                  </td>

                  {/* Draws */}
                  <td className="py-3 px-2 text-center text-slate-400">
                    {team.stats.draws ?? 0}
                  </td>

                  {/* Losses */}
                  <td className="py-3 px-2 text-center text-rose-400">
                    {team.stats.losses ?? 0}
                  </td>

                  {/* Goals For */}
                  <td className="py-3 px-2 text-center text-slate-200">
                    {team.stats.goalsFor ?? 0}
                  </td>

                  {/* Goals Against */}
                  <td className="py-3 px-2 text-center text-slate-400">
                    {team.stats.goalsAgainst ?? 0}
                  </td>

                  {/* Goal Difference */}
                  <td className="py-3 px-2 text-center font-extrabold">
                    <span
                      className={
                        team.stats.goalDiff > 0
                          ? 'text-emerald-400'
                          : team.stats.goalDiff < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }
                    >
                      {team.stats.goalDiff > 0 ? `+${team.stats.goalDiff}` : team.stats.goalDiff}
                    </span>
                  </td>

                  {/* Expected Goal Difference (xGD) */}
                  <td className="py-3 px-2 text-center text-cyan-400 text-[11px] hidden sm:table-cell">
                    +{team.stats.xGD.toFixed(1)}
                  </td>

                  {/* Points (PTS) */}
                  <td className="py-3 px-3 text-center font-tech font-black text-base text-amber-300 bg-white/5">
                    {team.stats.points}
                  </td>

                  {/* Last 5 Matches Form Dots */}
                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {(team.stats.form ?? ['W', 'D', 'W', 'W', 'L']).map((result, rIdx) => (
                        <span
                          key={rIdx}
                          className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                            result === 'W'
                              ? 'bg-emerald-500 text-black'
                              : result === 'D'
                              ? 'bg-slate-600 text-white'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Franchise All-Star Anchor */}
                  <td className="py-3 px-3 text-right">
                    {allStar ? (
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-right">
                          <div className="font-tech font-bold text-xs text-white truncate max-w-[110px]">
                            {allStar.commonName}
                          </div>
                          <div className="text-[9px] font-mono text-cyan-400">
                            {allStar.overallRating} OVR · ×{allStar.chemistryWeight}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlayerForCompare(allStar);
                          }}
                          className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Radar
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Standings Summary Footer Callout */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>
            <strong>Cruz Azul</strong> leads with a historic 42-point campaign (+27 GD), while <strong>Toluca</strong> and <strong>Tigres</strong> lock in home advantage for the Liguilla.
          </span>
        </div>
        <div className="text-cyan-400 font-bold whitespace-nowrap">
          Top 6 advance directly to Liguilla
        </div>
      </div>
    </div>
  );
};
