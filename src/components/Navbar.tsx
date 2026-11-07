import React from 'react';
import { Sliders, ArrowRightLeft, Shield, Sparkles, Trophy, ExternalLink, Package, Activity } from 'lucide-react';
import { MathSoccerAtom } from './MathSoccerAtom';

interface NavbarProps {
  activeSection: 'all' | 'standings' | 'laliga' | 'chemistry' | 'stats' | 'scouting';
  onSelectSection: (section: 'all' | 'standings' | 'laliga' | 'chemistry' | 'stats' | 'scouting') => void;
  onOpenCompare: () => void;
  onToggleSpotify: () => void;
  isSpotifyOpen: boolean;
  selectedCompareCount: number;
  onOpenExportPackage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onOpenCompare,
  onToggleSpotify,
  isSpotifyOpen,
  selectedCompareCount,
  onOpenExportPackage,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080B11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectSection('all')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <MathSoccerAtom size={22} className="text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black tracking-wider text-white">LIGA MX</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">PRO IQ</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">MATH ENGINE &amp; SCOUTING PLATFORM</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectSection('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSection === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Overview</span>
            </button>

            <button
              onClick={() => onSelectSection('standings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSection === 'standings'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Standings</span>
            </button>

            <button
              onClick={() => onSelectSection('laliga')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSection === 'laliga'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>La Liga Model</span>
            </button>

            <button
              onClick={() => onSelectSection('chemistry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSection === 'chemistry'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Depth Charts</span>
            </button>

            <button
              onClick={() => onSelectSection('scouting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSection === 'scouting'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pro Scouting &amp; Pitch IQ</span>
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCompare}
              className="relative px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
              {selectedCompareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-black rounded-full text-[10px]">
                  {selectedCompareCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenExportPackage}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all flex items-center space-x-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
