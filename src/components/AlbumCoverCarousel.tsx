import React from 'react';
import { MLSTeam, MLSPlayer } from '../types/soccer';
import { Disc3, Music2, Sparkles, Flame, Play } from 'lucide-react';

interface AlbumCoverCarouselProps {
  teams: MLSTeam[];
  players: MLSPlayer[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onSelectPlayerForCompare?: (player: MLSPlayer) => void;
}

export const AlbumCoverCarousel: React.FC<AlbumCoverCarouselProps> = ({
  teams,
  players,
  selectedTeamId,
  onSelectTeam,
  onSelectPlayerForCompare,
}) => {
  // Find all star player for team
  const getTeamAllStar = (team: MLSTeam): MLSPlayer | undefined => {
    return players.find((p) => p.id === team.allStarPlayerId) || players.find((p) => p.teamId === team.id);
  };

  // Duplicate teams array for seamless right-to-left marquee loop
  const duplicatedTeams = [...teams, ...teams, ...teams];

  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-white/10 bg-gradient-to-r from-[#070A10] via-[#0D131F] to-[#070A10]">
      {/* Background Ambience & Label */}
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00E5FF]" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <Disc3 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            Liga MX Club Vinyl Covers · Right-to-Left All-Star Reel
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
          Hover to pause reel · Click cover to inspect team chemistry
        </div>
      </div>

      {/* Marquee Reel Track Moving Right-to-Left */}
      <div className="relative w-full flex items-center overflow-x-hidden group">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#070A10] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#070A10] to-transparent z-20 pointer-events-none" />

        <div className="animate-marquee-left flex gap-6 px-4 py-2">
          {duplicatedTeams.map((team, idx) => {
            const allStar = getTeamAllStar(team);
            const isSelected = selectedTeamId === team.id;

            return (
              <div
                key={`${team.id}-${idx}`}
                onClick={() => onSelectTeam(team.id)}
                className={`relative flex-shrink-0 cursor-pointer group/album transition-all duration-300 transform hover:-translate-y-2 select-none ${
                  isSelected ? 'scale-105' : ''
                }`}
              >
                {/* Vinyl Record peeking out from sleeve on hover */}
                <div className="absolute top-1/2 -translate-y-1/2 right-1 w-36 h-36 rounded-full bg-[#111111] border-4 border-black shadow-2xl flex items-center justify-center transition-all duration-500 transform translate-x-2 group-hover/album:translate-x-12 z-0">
                  {/* Vinyl Grooves */}
                  <div className="w-28 h-28 rounded-full border border-neutral-800 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-neutral-700 flex items-center justify-center">
                      {/* Center Sticker */}
                      <div
                        className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[7px] font-bold text-black shadow-inner"
                        style={{ backgroundColor: team.albumCover.vinylColor }}
                      >
                        <span>{team.code}</span>
                        <span className="text-[6px] font-mono">45 RPM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Album Jacket / Sleeve */}
                <div
                  className={`relative z-10 w-52 h-64 sm:w-56 sm:h-72 rounded-xl overflow-hidden border-2 transition-all duration-300 glass-panel ${
                    isSelected
                      ? 'border-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.4)]'
                      : 'border-white/10 hover:border-white/40 shadow-xl'
                  }`}
                  style={{
                    background: `linear-gradient(145deg, rgba(17, 24, 39, 0.95), ${team.secondaryColor}22, #080B11)`,
                  }}
                >
                  {/* Album Cover Art (Player Profile Picture) */}
                  <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-900">
                    <img
                      src={allStar?.photoUrl || team.logoUrl}
                      alt={allStar?.name}
                      className="w-full h-full object-cover object-top filter contrast-110 brightness-95 group-hover/album:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient Fade to jacket bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40" />

                    {/* Top Jacket Badge: Team & Genre */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono z-10">
                      <span
                        className="px-2 py-0.5 rounded font-bold uppercase tracking-wider text-black shadow"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        {team.shortName}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-slate-300 font-semibold border border-white/10">
                        {team.albumCover.bpm} BPM
                      </span>
                    </div>

                    {/* All-Star Star Tag */}
                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/15">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-tech font-bold text-white tracking-wider">
                        {allStar?.commonName} ({allStar?.overallRating})
                      </span>
                    </div>
                  </div>

                  {/* Album Sleeve Lower Jacket Info */}
                  <div className="p-2.5 flex flex-col justify-between h-24 sm:h-28 bg-[#0b0f19]/90 backdrop-blur-md">
                    <div>
                      <h4 className="font-display font-extrabold text-xs sm:text-sm text-white truncate tracking-wide group-hover/album:text-cyan-400 transition-colors">
                        {team.albumCover.albumTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                        {team.albumCover.artistCredit}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span className="truncate max-w-[120px] text-cyan-300 font-semibold">
                        ♪ {team.albumCover.trackName}
                      </span>
                      <span className="text-amber-400 font-bold bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/20">
                        CHEM ×{allStar?.chemistryWeight ?? 1.2}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
