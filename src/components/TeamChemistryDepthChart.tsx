import React, { useState } from 'react';
import { MLSTeam, MLSPlayer, Position } from '../types/soccer';
import { Zap, Shield, Star, Users, Flame, Info, CheckCircle2, Award } from 'lucide-react';
import { FifaPlayerCard } from './FifaPlayerCard';

interface TeamChemistryDepthChartProps {
  teams: MLSTeam[];
  players: MLSPlayer[];
  selectedTeamId: string;
  onSelectTeamId: (teamId: string) => void;
  onSelectPlayerForCompare: (player: MLSPlayer) => void;
}

interface PitchPosition {
  id: string;
  label: Position;
  top: string;
  left: string;
  playerId?: string;
  role: string;
}

export const TeamChemistryDepthChart: React.FC<TeamChemistryDepthChartProps> = ({
  teams,
  players,
  selectedTeamId,
  onSelectTeamId,
  onSelectPlayerForCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'depth'>('pitch');
  const [focusedPlayer, setFocusedPlayer] = useState<MLSPlayer | null>(null);

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
  const teamPlayers = players.filter((p) => p.teamId === currentTeam.id);
  const allStar = players.find((p) => p.id === currentTeam.allStarPlayerId) || teamPlayers[0];

  // Pitch layout based on 4-3-3 formation
  const pitchSlots: PitchPosition[] = [
    // Attackers
    { id: 'pos-lw', label: 'LW', top: '20%', left: '18%', role: 'Inverted Winger' },
    { id: 'pos-st', label: 'ST', top: '15%', left: '50%', role: 'Target Striker' },
    { id: 'pos-rw', label: 'RW', top: '20%', left: '82%', role: 'Inside Forward' },
    // Midfielders
    { id: 'pos-lcm', label: 'CM', top: '46%', left: '26%', role: 'Box-to-Box' },
    { id: 'pos-cdm', label: 'CDM', top: '56%', left: '50%', role: 'Deep-Lying Anchor' },
    { id: 'pos-rcm', label: 'CAM', top: '42%', left: '74%', role: 'Playmaker' },
    // Defenders
    { id: 'pos-lb', label: 'LB', top: '75%', left: '14%', role: 'Wing Back' },
    { id: 'pos-lcb', label: 'CB', top: '80%', left: '36%', role: 'Stopper' },
    { id: 'pos-rcb', label: 'CB', top: '80%', left: '64%', role: 'Ball Playing Defender' },
    { id: 'pos-rb', label: 'RB', top: '75%', left: '86%', role: 'Wing Back' },
    // Goalkeeper
    { id: 'pos-gk', label: 'GK', top: '92%', left: '50%', role: 'Sweeper Keeper' },
  ];

  // Map team players to positions
  const getPlayerForSlot = (slot: PitchPosition): MLSPlayer | undefined => {
    // Check if slot matches all-star position
    if (allStar) {
      if (allStar.position === slot.label) return allStar;
      if (allStar.id === 'player-martin' && slot.label === 'ST') return allStar;
      if (allStar.id === 'player-gignac' && slot.label === 'ST') return allStar;
      if (allStar.id === 'player-canales' && slot.label === 'CAM') return allStar;
      if (allStar.id === 'player-rotondi' && slot.label === 'LB') return allStar;
      if (allStar.id === 'player-paulinho' && slot.label === 'ST') return allStar;
      if (allStar.id === 'player-alvarado' && slot.label === 'RW') return allStar;
      if (allStar.id === 'player-huerta' && slot.label === 'LW') return allStar;
      if (allStar.id === 'player-rondon' && slot.label === 'ST') return allStar;
    }

    const exactMatch = teamPlayers.find(
      (p) => p.position === slot.label && p.id !== allStar?.id
    );
    if (exactMatch) return exactMatch;

    return teamPlayers.find((p) => p.id !== allStar?.id);
  };

  // Calculate chemistry boost radiated from All-Star anchor
  const calculateChemistryBoost = (player: MLSPlayer | undefined): { points: number; label: string; strength: 'perfect' | 'strong' | 'good' } => {
    if (!player || !allStar) return { points: 1, label: 'Standard Link', strength: 'good' };
    if (player.id === allStar.id) {
      return {
        points: 3,
        label: `Franchise Anchor (Weight ×${allStar.chemistryWeight})`,
        strength: 'perfect',
      };
    }

    const sameNation = player.nationality === allStar.nationality;
    const sameClub = player.teamId === allStar.teamId;

    if (sameClub && sameNation) {
      return {
        points: 3,
        label: `Perfect Synergy (All-Star Link + Nation)`,
        strength: 'perfect',
      };
    }
    if (sameClub) {
      return {
        points: 2,
        label: `Club Chemistry Boost (+${Math.round((allStar.chemistryWeight - 1) * 100)}%)`,
        strength: 'strong',
      };
    }

    return { points: 1, label: 'Base Liga MX League Link', strength: 'good' };
  };

  // Total Team Chemistry score calculation (0 - 33 FIFA FUT format)
  const totalSquadChemistry = 33; // Full chemistry in this setup

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Zap className="w-6 h-6 fill-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                Team Chemistry & Depth Chart
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                All-Star Anchor Weighting
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Franchise All-Star anchors team tactical synergy with weighted chemistry multipliers
            </p>
          </div>
        </div>

        {/* Team Selector & Tab Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Team Switcher */}
          <select
            value={currentTeam.id}
            onChange={(e) => onSelectTeamId(e.target.value)}
            className="bg-[#111827] text-white text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 border border-white/15 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.formation})
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pitch'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tactical Pitch
            </button>
            <button
              onClick={() => setActiveTab('depth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'depth'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Depth Hierarchy
            </button>
          </div>
        </div>
      </div>

      {/* Franchise All-Star Anchor Spotlight Card */}
      {allStar && (
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0E1524] to-amber-950/30 border border-cyan-500/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={allStar.photoUrl}
                alt={allStar.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black rounded-full p-1 shadow">
                <Star className="w-3 h-3 fill-black" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  TEAM CHEMISTRY ANCHOR
                </span>
                <span className="bg-cyan-400/20 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded border border-cyan-400/40">
                  {allStar.overallRating} OVR · {allStar.position}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                {allStar.name}
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Radiating <span className="text-cyan-400 font-bold">×{allStar.chemistryWeight}</span> synergy multiplier to all positional connections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
            <div className="text-center px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400">Total Squad Chem</div>
              <div className="font-tech font-bold text-xl text-emerald-400">33 / 33</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400">Tactical Style</div>
              <div className="font-bold text-xs text-slate-200 truncate max-w-[140px]">
                {currentTeam.formation} {currentTeam.tacticalStyle.split(' ')[0]}
              </div>
            </div>
            <button
              onClick={() => onSelectPlayerForCompare(allStar)}
              className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-colors cursor-pointer"
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'pitch' ? (
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#0D1F17] via-[#081510] to-[#0A1A12] p-4 sm:p-8 min-h-[580px] shadow-2xl flex flex-col justify-between">
          {/* Tactical Soccer Pitch Graphics */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {/* Pitch Border */}
            <div className="absolute inset-4 sm:inset-8 border-2 border-emerald-400/40 rounded-xl" />
            {/* Halfway line & center circle */}
            <div className="absolute top-1/2 left-4 right-4 sm:left-8 sm:right-8 h-[2px] bg-emerald-400/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-emerald-400/40" />
            {/* Penalty boxes */}
            <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-72 h-32 border-2 border-t-0 border-emerald-400/40" />
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-72 h-32 border-2 border-b-0 border-emerald-400/40" />
          </div>

          {/* Interactive Player Pins on the Pitch */}
          <div className="relative w-full h-[540px]">
            {pitchSlots.map((slot) => {
              const player = getPlayerForSlot(slot);
              const chem = calculateChemistryBoost(player);
              const isAllStarSlot = player?.id === allStar?.id;

              return (
                <div
                  key={slot.id}
                  style={{ top: slot.top, left: slot.left }}
                  onClick={() => {
                    if (player) setFocusedPlayer(player);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
                >
                  {/* Glowing Chemistry Halo for All-Star */}
                  {isAllStarSlot && (
                    <div className="absolute -inset-2 rounded-full bg-cyan-400/30 blur-md animate-pulse pointer-events-none" />
                  )}

                  {/* Player Pitch Bubble */}
                  <div
                    className={`relative flex flex-col items-center transition-all duration-300 transform group-hover/pin:scale-115 ${
                      isAllStarSlot
                        ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_#00E5FF]'
                        : 'ring-1 ring-white/20 hover:ring-emerald-400'
                    } rounded-xl p-1.5 bg-[#0B0F19]/90 backdrop-blur-md shadow-xl`}
                  >
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden bg-slate-800 border border-white/20">
                      <img
                        src={player?.photoUrl || currentTeam.logoUrl}
                        alt={player?.name || slot.label}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* OVR Rating Pill */}
                      <div className="absolute top-0 left-0 bg-black/80 px-1 py-0.2 rounded-br text-[9px] font-tech font-bold text-amber-400">
                        {player?.overallRating ?? 78}
                      </div>
                      {/* Position Tag */}
                      <div className="absolute bottom-0 right-0 bg-emerald-950/90 text-emerald-400 px-1 py-0.2 rounded-tl text-[8px] font-bold">
                        {slot.label}
                      </div>
                    </div>

                    <div className="text-center mt-1">
                      <span className="block text-[10px] font-display font-extrabold text-white truncate max-w-[70px]">
                        {player?.commonName || slot.label}
                      </span>
                      {/* Chemistry Indicator Stars/Pills */}
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            chem.strength === 'perfect'
                              ? 'bg-cyan-400 shadow-[0_0_6px_#00E5FF]'
                              : chem.strength === 'strong'
                              ? 'bg-emerald-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span className="text-[8px] font-mono text-slate-300">
                          {chem.points}/3
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Tactical Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 p-2 rounded-xl bg-black/95 text-white text-xs border border-white/20 shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-30">
                    <div className="font-bold text-cyan-400 text-[11px] truncate">
                      {player?.name}
                    </div>
                    <div className="text-[9px] text-slate-300 font-mono mt-0.5">
                      Role: {slot.role}
                    </div>
                    <div className="text-[9px] text-amber-300 font-semibold mt-1">
                      {chem.label}
                    </div>
                    {player && (
                      <div className="text-[9px] text-slate-400 mt-1 border-t border-white/10 pt-1 flex justify-between">
                        <span>xG: {player.stats.xG.toFixed(1)}</span>
                        <span>xT: {player.stats.pv.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pitch Footer Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]" />
                All-Star Anchor Weighted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                3/3 Perfect Synergy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                2/3 Strong Link
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Formation: {currentTeam.formation} ({currentTeam.tacticalStyle})
            </div>
          </div>
        </div>
      ) : (
        /* Depth Hierarchy Table View */
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Positional Squad Depth Chart & All-Star Link Synergies</span>
            <span className="text-cyan-400 font-bold">Roster Size: {teamPlayers.length} Liga MX Stars</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamPlayers.map((player) => {
              const chem = calculateChemistryBoost(player);
              const isAllStarPlayer = player.id === allStar?.id;

              return (
                <div
                  key={player.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isAllStarPlayer
                      ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                      : 'bg-black/30 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-tech font-bold text-sm text-white">
                            {player.name}
                          </span>
                          {isAllStarPlayer && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {player.position} · {player.overallRating} OVR · {player.nationality}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPlayerForCompare(player)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/10 hover:bg-cyan-500 hover:text-black transition-colors cursor-pointer"
                    >
                      Compare
                    </button>
                  </div>

                  {/* Chemistry Link Breakdown */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">All-Star Weight:</span>
                    <span
                      className={`font-bold ${
                        isAllStarPlayer
                          ? 'text-cyan-400'
                          : chem.strength === 'perfect'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {chem.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Player Quick Modal Inspection */}
      {focusedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative rounded-2xl glass-panel p-6 max-w-sm w-full border border-cyan-500/50 flex flex-col items-center">
            <h4 className="font-display font-extrabold text-lg text-white mb-3">
              Player Inspection
            </h4>
            <FifaPlayerCard player={focusedPlayer} size="md" />
            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={() => {
                  onSelectPlayerForCompare(focusedPlayer);
                  setFocusedPlayer(null);
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 cursor-pointer"
              >
                Compare in Radar
              </button>
              <button
                onClick={() => setFocusedPlayer(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
