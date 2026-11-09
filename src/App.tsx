import React, { useState } from 'react';
import { LIGA_MX_TEAMS } from './data/ligaMxData';
import { MLS_PLAYERS as LIGA_MX_PLAYERS, DEFAULT_LA_LIGA_WEIGHTS } from './data/mlsData';
import { MLSPlayer, MLSTeam, ModelMethod, LaLigaModelWeights } from './types/soccer';
import { Navbar } from './components/Navbar';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { AlbumCoverCarousel } from './components/AlbumCoverCarousel';
import { StatsTable } from './components/StatsTable';
import { TeamChemistryDepthChart } from './components/TeamChemistryDepthChart';
import { LaLigaModelBuilder } from './components/LaLigaModelBuilder';
import { PlayerCompareModal } from './components/PlayerCompareModal';
import { LeagueStandings } from './components/LeagueStandings';
import { ExportPackageModal } from './components/ExportPackageModal';
import { ProScoutingPitchIQ } from './components/ProScoutingPitchIQ';

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
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenCompare={() => setIsCompareOpen(true)}
        onToggleSpotify={() => setIsSpotifyOpen(!isSpotifyOpen)}
        isSpotifyOpen={isSpotifyOpen}
        selectedCompareCount={comparePlayerIds.length}
        onOpenExportPackage={() => setIsExportModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <AlbumCoverCarousel
          teams={LIGA_MX_TEAMS}
          players={LIGA_MX_PLAYERS}
          selectedTeamId={selectedTeam.id}
          onSelectTeam={(teamId) => {
            const t = LIGA_MX_TEAMS.find(x => x.id === teamId);
            if (t) setSelectedTeam(t);
          }}
          onSelectPlayerForCompare={(player) => toggleComparePlayer(player.id)}
        />

        {(activeSection === 'all' || activeSection === 'standings') && (
          <LeagueStandings
            teams={LIGA_MX_TEAMS}
            players={LIGA_MX_PLAYERS}
            selectedTeamId={selectedTeam.id}
            onSelectTeam={(teamId) => {
              const t = LIGA_MX_TEAMS.find(x => x.id === teamId);
              if (t) setSelectedTeam(t);
            }}
            onSelectPlayerForCompare={(player) => toggleComparePlayer(player.id)}
          />
        )}

        {(activeSection === 'all' || activeSection === 'scouting') && (
          <ProScoutingPitchIQ teams={LIGA_MX_TEAMS} players={LIGA_MX_PLAYERS} />
        )}

        {(activeSection === 'all' || activeSection === 'laliga') && (
          <LaLigaModelBuilder
            teams={LIGA_MX_TEAMS}
            players={LIGA_MX_PLAYERS}
            weights={modelWeights}
            onUpdateWeights={setModelWeights}
            onSelectPlayerForCompare={(player) => toggleComparePlayer(player.id)}
            onOpenExportPackage={() => setIsExportModalOpen(true)}
          />
        )}

        {(activeSection === 'all' || activeSection === 'chemistry') && (
          <TeamChemistryDepthChart
            teams={LIGA_MX_TEAMS}
            players={LIGA_MX_PLAYERS}
            selectedTeamId={selectedTeam.id}
            onSelectTeamId={(teamId) => {
              const t = LIGA_MX_TEAMS.find(x => x.id === teamId);
              if (t) setSelectedTeam(t);
            }}
            onSelectPlayerForCompare={(player) => toggleComparePlayer(player.id)}
          />
        )}

        {(activeSection === 'all' || activeSection === 'stats') && (
          <StatsTable
            players={LIGA_MX_PLAYERS}
            teams={LIGA_MX_TEAMS}
            activeMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
            laLigaWeights={modelWeights}
            onOpenCompare={(p1, p2) => {
              setComparePlayerIds([p1.id, p2.id]);
              setIsCompareOpen(true);
            }}
            onSelectPlayerForCompare={(player) => toggleComparePlayer(player.id)}
            selectedPlayerIdsForCompare={comparePlayerIds}
            onTogglePlayerCompareSelection={toggleComparePlayer}
          />
        )}
      </main>

      <PlayerCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        player1={LIGA_MX_PLAYERS.find(p => p.id === comparePlayerIds[0])}
        player2={LIGA_MX_PLAYERS.find(p => p.id === comparePlayerIds[1])}
        allPlayers={LIGA_MX_PLAYERS}
        onSelectPlayer1={(p) => setComparePlayerIds([p.id, comparePlayerIds[1] || ''])}
        onSelectPlayer2={(p) => setComparePlayerIds([comparePlayerIds[0] || '', p.id])}
      />

      <ExportPackageModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        weights={modelWeights}
      />

      {isSpotifyOpen && <SpotifyPlayer onClose={() => setIsSpotifyOpen(false)} />}
    </div>
  );
}

export default App;
