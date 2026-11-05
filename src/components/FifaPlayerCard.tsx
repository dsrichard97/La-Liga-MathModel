import React from 'react';
import { MLSPlayer } from '../types/soccer';
import { Sparkles, Star, Zap, Shield, Flame } from 'lucide-react';

interface FifaPlayerCardProps {
  player: MLSPlayer;
  size?: 'sm' | 'md' | 'lg';
  highlighted?: boolean;
  onSelect?: () => void;
  showChemistryBadge?: boolean;
}

export const FifaPlayerCard: React.FC<FifaPlayerCardProps> = ({
  player,
  size = 'md',
  highlighted = false,
  onSelect,
  showChemistryBadge = true,
}) => {
  const { fifaAttributes, overallRating, position, commonName, nationality, cardTier, isAllStar } = player;

  // Scale settings
  const dimensions = {
    sm: 'w-44 h-64 text-xs',
    md: 'w-56 h-84 text-sm',
    lg: 'w-72 h-[410px] text-base',
  }[size];

  // Visual Theme per card tier
  const tierStyle = {
    ICON: {
      border: 'border-[#F4D03F]/80 shadow-[0_0_30px_rgba(244,208,63,0.35)]',
      bg: 'bg-gradient-to-b from-[#2B2308] via-[#1A1608] to-[#0A0905]',
      accent: 'text-[#F4D03F]',
      badgeBg: 'bg-[#D4AF37]/20 text-[#FFDF00] border-[#D4AF37]/50',
      tag: 'ICON 93',
    },
    MLS_ALLSTAR: {
      border: 'border-[#00E5FF]/80 shadow-[0_0_30px_rgba(0,229,255,0.35)]',
      bg: 'bg-gradient-to-b from-[#06283D] via-[#091724] to-[#040D14]',
      accent: 'text-[#00E5FF]',
      badgeBg: 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50',
      tag: 'MLS ALL-STAR',
    },
    RECORD_BREAKER: {
      border: 'border-[#FF007F]/80 shadow-[0_0_30px_rgba(255,0,127,0.35)]',
      bg: 'bg-gradient-to-b from-[#33081E] via-[#1B0511] to-[#0D0209]',
      accent: 'text-[#FF4081]',
      badgeBg: 'bg-[#FF007F]/20 text-[#FF4081] border-[#FF007F]/50',
      tag: 'RECORD BREAKER',
    },
    TOTW: {
      border: 'border-[#E5A93C]/80 shadow-[0_0_25px_rgba(229,169,60,0.25)]',
      bg: 'bg-gradient-to-b from-[#1E1911] via-[#120F0B] to-[#0A0806]',
      accent: 'text-[#E5A93C]',
      badgeBg: 'bg-[#E5A93C]/20 text-[#E5A93C] border-[#E5A93C]/40',
      tag: 'TEAM OF THE WEEK',
    },
    GOLD: {
      border: 'border-[#C5A059]/70 shadow-[0_0_20px_rgba(197,160,89,0.2)]',
      bg: 'bg-gradient-to-b from-[#2A2318] via-[#17140F] to-[#0D0B08]',
      accent: 'text-[#F3E5AB]',
      badgeBg: 'bg-[#C5A059]/20 text-[#F3E5AB] border-[#C5A059]/30',
      tag: 'GOLD RARE',
    },
  }[cardTier] || {
    border: 'border-white/30',
    bg: 'bg-[#111827]',
    accent: 'text-white',
    badgeBg: 'bg-white/10 text-white',
    tag: 'STANDARD',
  };

  return (
    <div
      onClick={onSelect}
      className={`relative select-none transition-all duration-300 transform group ${
        onSelect ? 'cursor-pointer hover:-translate-y-2 hover:scale-[1.02]' : ''
      } ${dimensions} ${highlighted ? 'ring-2 ring-[#00E5FF] scale-105' : ''}`}
      style={{
        clipPath: 'polygon(5% 0%, 95% 0%, 100% 6%, 100% 90%, 50% 100%, 0% 90%, 0% 6%)',
      }}
    >
      {/* Outer Card Shell with Shield Border */}
      <div
        className={`w-full h-full relative rounded-2xl p-2.5 flex flex-col justify-between border-2 ${tierStyle.border} ${tierStyle.bg} overflow-hidden`}
      >
        {/* Holographic / Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.4),transparent_70%)]" />
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none bg-gradient-to-br from-white/30 to-transparent" />

        {/* Top Header: Rating, Position, Flag, Team */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-col items-center">
            <span className="font-tech font-bold text-3xl sm:text-4xl leading-none tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {overallRating}
            </span>
            <span className={`font-tech font-bold text-sm tracking-widest uppercase ${tierStyle.accent}`}>
              {position}
            </span>
            <div className="w-5 h-[1px] bg-white/20 my-1" />
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              {player.nationCode}
            </div>
            <div className="text-[9px] font-semibold text-slate-400 mt-0.5 truncate max-w-[48px]">
              {player.teamName.split(' ')[0]}
            </div>
          </div>

          {/* Player Cutout Photo */}
          <div className="relative flex-1 flex justify-center items-end h-32 sm:h-36 -mt-1 overflow-hidden">
            <img
              src={player.photoUrl}
              alt={player.name}
              className="h-full object-cover object-top drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {isAllStar && (
              <div className="absolute top-1 right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-black" />
                <span>STAR</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Name Banner */}
        <div className="relative z-10 text-center my-1 border-t border-b border-white/10 py-1 bg-black/30 backdrop-blur-sm">
          <div className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase truncate px-1">
            {commonName}
          </div>
          <div className="text-[9px] tracking-widest font-mono text-slate-400 uppercase">
            {nationality} · #{player.number}
          </div>
        </div>

        {/* 6 Core FIFA Attributes Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-x-2 gap-y-0.5 px-2 py-1 bg-black/40 rounded-lg border border-white/5 font-tech">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{fifaAttributes.pac}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">PAC</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{fifaAttributes.dri}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">DRI</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{fifaAttributes.sho}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">SHO</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{fifaAttributes.def}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">DEF</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{fifaAttributes.pas}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">PAS</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{fifaAttributes.phy}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">PHY</span>
          </div>
        </div>

        {/* Bottom Tier & Chemistry Anchor Footer */}
        {showChemistryBadge && (
          <div className="relative z-10 flex items-center justify-between mt-1 pt-1 border-t border-white/10 px-1">
            <div className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${tierStyle.badgeBg}`}>
              {tierStyle.tag}
            </div>
            {isAllStar ? (
              <div className="flex items-center gap-1 text-[9px] font-bold text-cyan-400">
                <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                <span>CHEM ×{player.chemistryWeight}</span>
              </div>
            ) : (
              <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>LINKED</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
