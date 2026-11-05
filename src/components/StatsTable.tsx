import React, { useState, useMemo } from 'react';
import { MLSPlayer, MLSTeam, ModelMethod, LaLigaModelWeights } from '../types/soccer';
import { calculatePlayerModelScore } from '../utils/modelCalculations';
import { Search, ArrowUpDown, ArrowRightLeft, Star, Filter, Sparkles, Check, ChevronRight } from 'lucide-react';

interface StatsTableProps {
  players: MLSPlayer[];
  teams: MLSTeam[];
  activeMethod: ModelMethod;
  onSelectMethod: (method: ModelMethod) => void;
  laLigaWeights: LaLigaModelWeights;
  onOpenCompare: (p1: MLSPlayer, p2: MLSPlayer) => void;
  onSelectPlayerForCompare: (player: MLSPlayer) => void;
  selectedPlayerIdsForCompare: string[];
  onTogglePlayerCompareSelection: (playerId: string) => void;
}

export const StatsTable: React.FC<StatsTableProps> = ({
  players,
  teams,
  activeMethod,
  onSelectMethod,
  laLigaWeights,
  onOpenCompare,
  onSelectPlayerForCompare,
  selectedPlayerIdsForCompare,
  onTogglePlayerCompareSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conferenceFilter, setConferenceFilter] = useState<'All' | 'Liga MX' | 'Eastern' | 'Western'>('All');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<string>('modelScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Method options definition
  const methodOptions: { id: ModelMethod; name: string; description: string; badge: string }[] = [
    {
      id: 'la_liga_custom',
      name: 'Custom "La Liga" Model',
      description: 'Active weighted Spanish technical & possession index',
      badge: 'CUSTOM',
    },
    {
      id: 'xg_efficiency',
      name: 'xG & Finishing Efficiency',
      description: 'Goals vs expected goals conversion & xGOT overperformance',
      badge: 'OFFENSE',
    },
    {
      id: 'possession_value',
      name: 'Possession Threat (xT)',
      description: 'Progressive territory gain and packing value',
      badge: 'POSSESSION',
    },
    {
      id: 'pressing_intensity',
      name: 'Pressing & PPDA Intensity',
      description: 'Defensive turnovers forced & pressing efficiency',
      badge: 'DEFENSE',
    },
    {
      id: 'elo_power',
      name: 'Elo & Overall FUT Rating',
      description: 'Match leverage, FIFA card tier, and team rating',
      badge: 'FUT RATING',
    },
  ];

  // Calculate scores and filter
  const processedPlayers = useMemo(() => {
    return players
      .map((player) => {
        const { score, rankText, highlightMetric } = calculatePlayerModelScore(
          player,
          activeMethod,
          laLigaWeights
        );
        return {
          ...player,
          modelScore: score,
          rankText,
          highlightMetric,
        };
      })
      .filter((player) => {
        const matchesSearch =
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesConf =
          conferenceFilter === 'All' || player.conference === conferenceFilter;
        const matchesPos =
          positionFilter === 'All' || player.position === positionFilter;
        return matchesSearch && matchesConf && matchesPos;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        if (sortField === 'modelScore') {
          valA = a.modelScore;
          valB = b.modelScore;
        } else if (sortField === 'name') {
          valA = a.name;
          valB = b.name;
        } else if (sortField === 'goals') {
          valA = a.stats.goals;
          valB = b.stats.goals;
        } else if (sortField === 'xG') {
          valA = a.stats.xG;
          valB = b.stats.xG;
        } else if (sortField === 'assists') {
          valA = a.stats.assists;
          valB = b.stats.assists;
        } else if (sortField === 'xA') {
          valA = a.stats.xA;
          valB = b.stats.xA;
        } else if (sortField === 'prgP') {
          valA = a.stats.prgP;
          valB = b.stats.prgP;
        } else if (sortField === 'pv') {
          valA = a.stats.pv;
          valB = b.stats.pv;
        } else if (sortField === 'ovr') {
          valA = a.overallRating;
          valB = b.overallRating;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [players, activeMethod, laLigaWeights, searchTerm, conferenceFilter, positionFilter, sortField, sortAsc]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Compare selected players
  const handleTriggerCompareSelected = () => {
    if (selectedPlayerIdsForCompare.length >= 2) {
      const p1 = players.find((p) => p.id === selectedPlayerIdsForCompare[0]);
      const p2 = players.find((p) => p.id === selectedPlayerIdsForCompare[1]);
      if (p1 && p2) onOpenCompare(p1, p2);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 shadow-2xl space-y-5">
      {/* Method Filter Switcher Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tech font-bold text-sm uppercase tracking-wider text-white">
              Filter by Statistical Modeling Method
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Each model dynamically recalculates index scores and rankings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {methodOptions.map((method) => {
            const isActive = activeMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-400 text-black'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {method.badge}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div
                    className={`font-display font-bold text-xs sm:text-sm truncate ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {method.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1.5 line-clamp-1">
                  {method.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Liga MX star, club, nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 text-white text-xs font-mono border border-white/10 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
          </div>

          {/* Tournament / Conference Filter */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-mono">
            {(['All', 'Liga MX'] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setConferenceFilter(conf)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  conferenceFilter === conf || (conf === 'All' && conferenceFilter === 'All')
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {conf === 'All' ? 'All Apertura/Clausura' : 'Liga MX Top Clubs'}
              </button>
            ))}
          </div>

          {/* Position Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-[#111827] text-white text-xs font-mono rounded-xl px-3 py-2 border border-white/10 focus:outline-none cursor-pointer"
          >
            <option value="All">All Positions</option>
            <option value="ST">ST / Forwards</option>
            <option value="CAM">CAM / Playmakers</option>
            <option value="RW">RW / Wingers</option>
            <option value="LW">LW / Wingers</option>
            <option value="CDM">CDM / Holding Mid</option>
            <option value="LB">LB / Fullbacks</option>
          </select>
        </div>

        {/* Selected Compare Bar */}
        {selectedPlayerIdsForCompare.length > 0 && (
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-cyan-950/60 border border-cyan-500/50">
            <span className="text-xs font-mono text-cyan-300 font-bold">
              {selectedPlayerIdsForCompare.length} selected
            </span>
            <button
              onClick={handleTriggerCompareSelected}
              disabled={selectedPlayerIdsForCompare.length < 2}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                selectedPlayerIdsForCompare.length >= 2
                  ? 'bg-gradient-to-r from-cyan-400 to-amber-400 text-black hover:opacity-95 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Compare Radar
            </button>
          </div>
        )}
      </div>

      {/* Advanced Statistics Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-slate-400 uppercase text-[10px]">
              <th className="py-3 px-3 w-8 text-center">Sel</th>
              <th
                onClick={() => handleSort('modelScore')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1 text-cyan-400 font-bold">
                  Model Index
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Player / Club
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ovr')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  FUT OVR
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Pos</th>
              <th
                onClick={() => handleSort('goals')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  G / xG
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('assists')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  A / xA
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('prgP')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Prg Passes
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pv')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  xT (PV)
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">All-Star Weight</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {processedPlayers.map((player) => {
              const isSelectedForCompare = selectedPlayerIdsForCompare.includes(player.id);
              return (
                <tr
                  key={player.id}
                  className={`hover:bg-white/5 transition-colors ${
                    isSelectedForCompare ? 'bg-cyan-950/30' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelectedForCompare}
                      onChange={() => onTogglePlayerCompareSelection(player.id)}
                      className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                    />
                  </td>

                  {/* Calculated Model Index Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-tech font-extrabold text-base text-cyan-300">
                        {player.modelScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">
                        {player.highlightMetric}
                      </span>
                    </div>
                  </td>

                  {/* Player & Team Info */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="w-9 h-9 rounded-lg object-cover border border-white/20"
                        />
                        {player.isAllStar && (
                          <div className="absolute -top-1 -right-1 bg-amber-400 text-black p-0.5 rounded-full shadow">
                            <Star className="w-2.5 h-2.5 fill-black" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-display font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                          {player.name}
                          <span className="text-[9px] font-mono text-slate-400">
                            ({player.nationCode})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {player.teamName} · {player.conference}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* FIFA FUT Rating */}
                  <td className="py-3 px-3">
                    <span className="font-tech font-bold text-sm px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {player.overallRating} OVR
                    </span>
                  </td>

                  {/* Position */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-[11px] text-slate-300">
                      {player.position}
                    </span>
                  </td>

                  {/* Goals & xG */}
                  <td className="py-3 px-3 font-semibold">
                    <span className="text-white">{player.stats.goals}</span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({player.stats.xG.toFixed(1)} xG)
                    </span>
                  </td>

                  {/* Assists & xA */}
                  <td className="py-3 px-3 font-semibold">
                    <span className="text-white">{player.stats.assists}</span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({player.stats.xA.toFixed(1)} xA)
                    </span>
                  </td>

                  {/* Progressive Passes */}
                  <td className="py-3 px-3 text-cyan-300 font-bold">
                    {player.stats.prgP}
                  </td>

                  {/* Possession Threat (PV / xT) */}
                  <td className="py-3 px-3 text-emerald-300 font-bold">
                    +{player.stats.pv.toFixed(2)}
                  </td>

                  {/* Chemistry Multiplier */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        player.isAllStar
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      ×{player.chemistryWeight}
                    </span>
                  </td>

                  {/* Quick Compare Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectPlayerForCompare(player)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Compare
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
