import React, { useState } from 'react';
import { LIGA_MX_TEAMS, LIGA_MX_PLAYERS, DEFAULT_LA_LIGA_WEIGHTS } from './data/ligaMxData';
import { MLSPlayer, MLSTeam, ModelMethod, LaLigaModelWeights } from './types/soccer';
import { Navbar } from './components/Navbar';
import { MathSoccerAtom } from './components/MathSoccerAtom';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { AlbumCoverCarousel } from './components/AlbumCoverCarousel';
import { StatsTable } from './components/StatsTable';
import { TeamChemistryDepthChart } from './components/TeamChemistryDepthChart';
import { LaLigaModelBuilder } from './components/LaLigaModelBuilder';
import { PlayerCompareModal } from './components/PlayerCompareModal';
import { LeagueStandings } from './components/LeagueStandings';
import {
  Trophy,
  Zap,
  ArrowRightLeft,
  Sliders,
  Shield,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [teams] = useState<MLSTeam[]>(LIGA_MX_TEAMS);
  const [players] = useState<MLSPlayer[]>(LIGA_MX_PLAYERS);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('club-america');
  const [activeMethod, setActiveMethod] = useState<ModelMethod>('la_liga_custom');
  const [laLigaWeights, setLaLigaWeights] = useState<LaLigaModelWeights>(DEFAULT_LA_LIGA_WEIGHTS);
  const [activeSection, setActiveSection] = useState<'all' | 'standings' | 'laliga' | 'chemistry' | 'stats'>('all');

  // Player Compare Modal State
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [player1, setPlayer1] = useState<MLSPlayer>(LIGA_MX_PLAYERS[0]); // Henry Martín (América)
  const [player2, setPlayer2] = useState<MLSPlayer>(LIGA_MX_PLAYERS[3]); // André-Pierre Gignac (Tigres)
  const [selectedPlayerIdsForCompare, setSelectedPlayerIdsForCompare] = useState<string[]>([
    LIGA_MX_PLAYERS[0].id,
    LIGA_MX_PLAYERS[3].id,
  ]);

  // Spotify Drawer State
  const [isSpotifyOpen, setIsSpotifyOpen] = useState<boolean>(false);

  // Toggle player selection for compare
  const handleTogglePlayerCompareSelection = (playerId: string) => {
    setSelectedPlayerIdsForCompare((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }
      if (prev.length >= 2) {
        return [prev[0], playerId];
      }
      return [...prev, playerId];
    });
  };

  // Open modal with specific two players
  const handleOpenCompare = (p1: MLSPlayer, p2: MLSPlayer) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setIsCompareOpen(true);
  };

  // Select player to compare against current player 1 or 2
  const handleSelectPlayerForCompare = (player: MLSPlayer) => {
    if (player.id === player1.id) return;
    setPlayer2(player);
    setIsCompareOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#080B11] text-[#E2E8F0] font-sans flex flex-col selection:bg-[#00E5FF] selection:text-black overflow-x-hidden">
      {/* Background Math-Soccer Atomic Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 z-0">
        <MathSoccerAtom size="watermark" animate={true} />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenCompare={() => setIsCompareOpen(true)}
        onToggleSpotify={() => setIsSpotifyOpen(!isSpotifyOpen)}
        isSpotifyOpen={isSpotifyOpen}
        selectedCompareCount={selectedPlayerIdsForCompare.length}
      />

      {/* Expandable Spotify Matchday Music Drawer */}
      {isSpotifyOpen && (
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full animate-fadeIn">
          <SpotifyPlayer onClose={() => setIsSpotifyOpen(false)} />
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Hero Section with Math-Soccer Atom Blend */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c1424] via-[#090e17] to-[#120a1c] p-6 sm:p-10 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Liga MX Apertura & Clausura · Mathematical Soccer Studio</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Liga MX Stats &{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
                  Atomic Chemistry Lab
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm font-mono leading-relaxed">
                Analyze Mexican First Division soccer metrics, calibrate Spanish{' '}
                <strong className="text-amber-300 font-bold">"La Liga"</strong> tactical algorithms,
                benchmark franchise All-Star chemistry links, and compare players in real-time D3.js radar charts.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenCompare(players[0], players[3])}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4 fill-black text-black" />
                  Compare Henry Martín vs Gignac (D3 Radar)
                </button>

                <button
                  onClick={() => setActiveSection('standings')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  League Standings
                </button>

                <button
                  onClick={() => setActiveSection('laliga')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/50 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Tune "La Liga" Weights
                </button>

                <button
                  onClick={() => setIsSpotifyOpen(!isSpotifyOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] border border-[#1DB954]/50 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  {/* Spotify icon */}
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.303c-.218.358-.684.471-1.042.253-2.855-1.745-6.449-2.14-10.684-1.171-.41.093-.815-.164-.908-.574-.093-.41.164-.816.574-.908 4.636-1.06 8.608-.611 11.807 1.348.358.218.471.694.253 1.052zm1.467-3.262c-.274.446-.86.589-1.306.315-3.268-2.008-8.25-2.59-12.115-1.416-.499.151-1.026-.134-1.177-.633-.151-.499.134-1.026.633-1.177 4.417-1.34 9.907-.694 13.65 1.605.446.274.589.86.315 1.306zm.126-3.41c-3.918-2.327-10.375-2.541-14.11-1.398-.6.183-1.238-.16-1.421-.76-.183-.6.16-1.238.76-1.421 4.298-1.31 11.428-1.063 15.938 1.614.538.319.715 1.02.396 1.558-.319.538-1.02.725-1.563.407z" />
                  </svg>
                  Spotify Matchday Hub
                </button>
              </div>
            </div>

            {/* Right: Math-Soccer Atom Feature Emblem Showcase */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 border border-white/10 w-full lg:w-72">
              <div className="relative mb-2">
                <MathSoccerAtom size="lg" animate={true} />
                <span className="absolute -inset-2 rounded-full bg-cyan-400/20 blur-md pointer-events-none" />
              </div>
              <div className="text-center">
                <div className="text-xs font-display font-extrabold text-white">
                  Math-Soccer Atomic Engine
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Quantum tactical orbitals & coordinates
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-center gap-3 text-[10px] font-mono text-cyan-400">
                  <span>8 Powerhouse Clubs</span>
                  <span>·</span>
                  <span>16+ Stars</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Liga MX Team Profile Album Cover Marquee Reel (Right to Left) */}
        <section>
          <AlbumCoverCarousel
            teams={teams}
            players={players}
            selectedTeamId={selectedTeamId}
            onSelectTeam={(teamId) => {
              setSelectedTeamId(teamId);
              setActiveSection('chemistry');
            }}
            onSelectPlayerForCompare={handleSelectPlayerForCompare}
          />
        </section>

        {/* 2. Official Liga MX League Standings Table */}
        {(activeSection === 'all' || activeSection === 'standings') && (
          <section id="league-standings">
            <LeagueStandings
              teams={teams}
              players={players}
              selectedTeamId={selectedTeamId}
              onSelectTeamId={(teamId) => {
                setSelectedTeamId(teamId);
                setActiveSection('chemistry');
              }}
              onSelectPlayerForCompare={handleSelectPlayerForCompare}
            />
          </section>
        )}

        {/* 3. Custom "La Liga" Algorithmic Model Builder */}
        {(activeSection === 'all' || activeSection === 'laliga') && (
          <section id="laliga-builder">
            <LaLigaModelBuilder
              teams={teams}
              players={players}
              weights={laLigaWeights}
              onUpdateWeights={setLaLigaWeights}
              onSelectPlayerForCompare={handleSelectPlayerForCompare}
            />
          </section>
        )}

        {/* 3. Team Chemistry Depth Chart Pitch */}
        {(activeSection === 'all' || activeSection === 'chemistry') && (
          <section id="chemistry-pitch">
            <TeamChemistryDepthChart
              teams={teams}
              players={players}
              selectedTeamId={selectedTeamId}
              onSelectTeamId={setSelectedTeamId}
              onSelectPlayerForCompare={handleSelectPlayerForCompare}
            />
          </section>
        )}

        {/* 4. Advanced Statistics Table with Model Filtering */}
        {(activeSection === 'all' || activeSection === 'stats') && (
          <section id="stats-table">
            <StatsTable
              players={players}
              teams={teams}
              activeMethod={activeMethod}
              onSelectMethod={setActiveMethod}
              laLigaWeights={laLigaWeights}
              onOpenCompare={handleOpenCompare}
              onSelectPlayerForCompare={handleSelectPlayerForCompare}
              selectedPlayerIdsForCompare={selectedPlayerIdsForCompare}
              onTogglePlayerCompareSelection={handleTogglePlayerCompareSelection}
            />
          </section>
        )}
      </main>

      {/* Compare Players D3.js Radar Chart Modal */}
      <PlayerCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        player1={player1}
        player2={player2}
        allPlayers={players}
        onSelectPlayer1={setPlayer1}
        onSelectPlayer2={setPlayer2}
      />

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-white/10 bg-[#06080D] py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MathSoccerAtom size="sm" animate={false} />
            <span className="text-slate-400 font-bold">Liga MX Analytics & FIFA Chemistry Hub</span>
            <span>· Powered by D3.js, Spotify, and Mathematical Tactical Modeling</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Apertura / Clausura 2024-2025</span>
            <span>All-Star Synergy Weighted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
