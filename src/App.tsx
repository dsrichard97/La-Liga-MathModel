import React, { useState } from 'react';
import { LIGA_MX_TEAMS } from './data/ligaMxData'; 
 import { MLS_PLAYERS as LIGA_MX_PLAYERS, DEFAULT_LA_LIGA_WEIGHTS } from './data/mlsData'; 
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
import { ExportPackageModal } from './components/ExportPackageModal';
import { ProScoutingPitchIQ } from './components/ProScoutingPitchIQ';
import { TeamStarAvatar } from './components/TeamStarAvatar';
import {
  Trophy,
  Zap,
  ArrowRightLeft,
  Sliders,
  Shield,
  Sparkles,
  Package,
  ExternalLink,
  Github,
  Globe,
  Activity,
  UserCheck
} from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState<
    'all' | 'standings' | 'laliga' | 'chemistry' | 'stats' | 'scouting'
  >('all');
  const [selectedTeam, setSelectedTeam] = useState<MLSTeam>(LIGA_MX_TEAMS[0]);
  const [modelWeights, setModelWeights] = useState<LaLigaModelWeights>(DEFAULT_LA_LIGA_WEIGHTS);
  const [selectedMethod, setSelectedMethod] = useState<ModelMethod>('elo');
  const [comparePlayerIds, setComparePlayerIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const toggleComparePlayer = (id: string) => {
    setComparePlayerIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenCompare={() => setIsCompareOpen(true)}
        onToggleSpotify={() => setIsSpotifyOpen(!isSpotifyOpen)}
        isSpotifyOpen={isSpotifyOpen}
        selectedCompareCount={comparePlayerIds.length}
        onOpenExportPackage={() => setIsExportModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Liga MX Apertura Analytics
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> Real Star Avatars &amp; Pro Pitch IQ
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                La Liga MX Mathematical Model &amp; Scouting
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                Comprehensive predictive analytics suite combining Markov xT threat grids, PSxG shot tracking, tactical passing networks, and star player roster scouting across Liga MX.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
              {LIGA_MX_TEAMS.slice(0, 4).map(team => (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`cursor-pointer p-2 rounded-xl border transition-all flex items-center gap-2 ${
                    selectedTeam.id === team.id
                      ? 'bg-slate-800 border-cyan-400 shadow-md scale-105'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <TeamStarAvatar
                    wikiSlug={team.wikiSlug}
                    playerName={team.allStarPlayerName}
                    jerseyNumber={team.jerseyNumber}
                    primaryColor={team.primaryColor}
                    secondaryColor={team.secondaryColor}
                    size="sm"
                  />
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-white truncate max-w-[80px]">{team.shortName}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">#{team.jerseyNumber} {team.allStarPlayerName?.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {activeSection === 'all' && (
          <div className="space-y-8">
            <LeagueStandings teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
            <ProScoutingPitchIQ teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
            <LaLigaModelBuilder players={LIGA_MX_PLAYERS}
              teams={LIGA_MX_TEAMS}
              weights={modelWeights}
              onWeightsChange={setModelWeights}
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
            />
            <TeamChemistryDepthChart teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
            <StatsTable
              players={LIGA_MX_PLAYERS}
              selectedCompareIds={comparePlayerIds}
              onToggleCompare={toggleComparePlayer}
            />
          </div>
        )}

        {activeSection === 'standings' && (
          <LeagueStandings teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
        )}

        {activeSection === 'laliga' && (
          <LaLigaModelBuilder players={LIGA_MX_PLAYERS}
            teams={LIGA_MX_TEAMS}
            weights={modelWeights}
            onWeightsChange={setModelWeights}
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />
        )}

        {activeSection === 'chemistry' && (
          <TeamChemistryDepthChart teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
        )}

        {activeSection === 'scouting' && (
          <ProScoutingPitchIQ teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
        )}

        {activeSection === 'stats' && (
          <StatsTable
            players={LIGA_MX_PLAYERS}
            selectedCompareIds={comparePlayerIds}
            onToggleCompare={toggleComparePlayer}
          />
        )}
      </main>

      <footer className="border-t border-slate-800 bg-[#04060A] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <MathSoccerAtom size={16} className="text-cyan-400" />
            <span className="font-bold text-slate-400">Liga MX Math &amp; Scouting Platform &copy; 2026</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Hudl StatsBomb IQ &bull; Opta Vision &bull; SkillCorner</span>
          </div>
        </div>
      </footer>

      {isCompareOpen && (
        <PlayerCompareModal
          players={LIGA_MX_PLAYERS.filter(p => comparePlayerIds.includes(p.id))}
          onClose={() => setIsCompareOpen(false)}
          onRemovePlayer={toggleComparePlayer}
        />
      )}

      {isExportModalOpen && (
        <ExportPackageModal onClose={() => setIsExportModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
