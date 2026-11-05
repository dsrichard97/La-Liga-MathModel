import React from 'react';
import { Sliders, ArrowRightLeft, Shield, Sparkles, Trophy } from 'lucide-react';
import { MathSoccerAtom } from './MathSoccerAtom';

interface NavbarProps {
  activeSection: 'all' | 'standings' | 'laliga' | 'chemistry' | 'stats';
  onSelectSection: (section: 'all' | 'standings' | 'laliga' | 'chemistry' | 'stats') => void;
  onOpenCompare: () => void;
  onToggleSpotify: () => void;
  isSpotifyOpen: boolean;
  selectedCompareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onOpenCompare,
  onToggleSpotify,
  isSpotifyOpen,
  selectedCompareCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080B11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup with Animated Math-Soccer Atom */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSelectSection('all')}
        >
          <div className="relative">
            <MathSoccerAtom size="sm" animate={true} />
            <span className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-sm pointer-events-none group-hover:bg-cyan-400/30 transition-all" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm sm:text-base text-white tracking-wider">
                LIGA MX ANALYTICS
              </span>
              <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-400 text-black">
                FUT 25
              </span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400 tracking-widest hidden sm:block">
              MATHEMATICAL SOCCER & LA LIGA LAB
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
          <button
            onClick={() => onSelectSection('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'all'
                ? 'bg-cyan-500 text-black font-extrabold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectSection('standings')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'standings'
                ? 'bg-cyan-500 text-black font-extrabold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Standings
          </button>
          <button
            onClick={() => onSelectSection('laliga')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'laliga'
                ? 'bg-cyan-500 text-black font-extrabold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            La Liga Model
          </button>
          <button
            onClick={() => onSelectSection('chemistry')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'chemistry'
                ? 'bg-cyan-500 text-black font-extrabold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Chemistry Pitch
          </button>
          <button
            onClick={() => onSelectSection('stats')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'stats'
                ? 'bg-cyan-500 text-black font-extrabold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Liga MX Stats
          </button>
        </nav>

        {/* Action Buttons: Radar Compare & Spotify Matchday Music */}
        <div className="flex items-center gap-2.5">
          {/* Compare Trigger Button */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Compare</span> Radar
            {selectedCompareCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-black flex items-center justify-center">
                {selectedCompareCount}
              </span>
            )}
          </button>

          {/* Spotify Matchday Hub Toggle Button */}
          <button
            onClick={onToggleSpotify}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
              isSpotifyOpen
                ? 'bg-[#1DB954] text-black border-[#1DB954] font-extrabold shadow-[0_0_15px_rgba(29,185,84,0.4)]'
                : 'bg-black/50 hover:bg-[#1DB954]/20 border-white/10 hover:border-[#1DB954]/50 text-slate-300 hover:text-[#1DB954]'
            }`}
            title="Spotify Matchday Audio Hub"
          >
            {/* Spotify SVG Icon */}
            <svg
              className={`w-4 h-4 ${isSpotifyOpen ? 'fill-black' : 'fill-[#1DB954]'}`}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.218.358-.684.471-1.042.253-2.855-1.745-6.449-2.14-10.684-1.171-.41.093-.815-.164-.908-.574-.093-.41.164-.816.574-.908 4.636-1.06 8.608-.611 11.807 1.348.358.218.471.694.253 1.052zm1.467-3.262c-.274.446-.86.589-1.306.315-3.268-2.008-8.25-2.59-12.115-1.416-.499.151-1.026-.134-1.177-.633-.151-.499.134-1.026.633-1.177 4.417-1.34 9.907-.694 13.65 1.605.446.274.589.86.315 1.306zm.126-3.41c-3.918-2.327-10.375-2.541-14.11-1.398-.6.183-1.238-.16-1.421-.76-.183-.6.16-1.238.76-1.421 4.298-1.31 11.428-1.063 15.938 1.614.538.319.715 1.02.396 1.558-.319.538-1.02.725-1.563.407z" />
            </svg>
            <span className="text-xs font-mono font-bold hidden sm:inline">Spotify</span>
          </button>
        </div>
      </div>
    </header>
  );
};
