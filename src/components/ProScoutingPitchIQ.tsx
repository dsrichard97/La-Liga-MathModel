import React, { useState, useMemo } from 'react';
import { Target, Activity, BarChart2, Filter, Users, Zap, TrendingUp, Compass, Award, Crosshair } from 'lucide-react';
import { MLSTeam, MLSPlayer } from '../types/soccer';
import { TeamStarAvatar } from './TeamStarAvatar';

interface ProScoutingProps {
  teams: MLSTeam[];
  players: MLSPlayer[];
}

export const ProScoutingPitchIQ: React.FC<ProScoutingProps> = ({ teams, players }) => {
  const [activeSubTab, setActiveSubTab] = useState<'xt_grid' | 'shot_map' | 'passing_net' | 'quadrant_scatter'>('xt_grid');

  // --- TOOL 1: 12x8 xT & OBV Grid State ---
  const [selectedZone, setSelectedZone] = useState<{ col: number; row: number } | null>({ col: 9, row: 4 });

  // Pre-generate 12x8 Grid data with realistic Markov xT & OBV values
  const gridData = useMemo(() => {
    const grid = [];
    const stars = [
      { name: 'Henry Martín', team: 'Club América', wiki: 'Henry_Martín', jersey: 9 },
      { name: 'André-Pierre Gignac', team: 'Tigres UANL', wiki: 'André-Pierre_Gignac', jersey: 10 },
      { name: 'Sergio Canales', team: 'CF Monterrey', wiki: 'Sergio_Canales', jersey: 10 },
      { name: 'Carlos "Charly" Rodríguez', team: 'Cruz Azul', wiki: 'Carlos_Rodríguez_(footballer,_born_1997)', jersey: 19 },
      { name: 'Roberto "Piojo" Alvarado', team: 'Chivas Guadalajara', wiki: 'Roberto_Alvarado', jersey: 25 },
      { name: 'Alexis Vega', team: 'Toluca FC', wiki: 'Alexis_Vega_(footballer,_born_1997)', jersey: 9 },
      { name: 'Salomón Rondón', team: 'CF Pachuca', wiki: 'Salomón_Rondón', jersey: 23 },
      { name: 'César "Chino" Huerta', team: 'Pumas UNAM', wiki: 'César_Huerta', jersey: 12 },
    ];

    for (let c = 0; c < 12; c++) {
      for (let r = 0; r < 8; r++) {
        const dist = Math.sqrt(Math.pow(11 - c, 2) + Math.pow(3.5 - r, 2));
        const xt = Math.max(0.005, Number((0.09 / (1 + dist * 0.45)).toFixed(3)));
        const obv = Math.max(0.002, Number((xt * 0.85 + (Math.sin(c + r) * 0.008)).toFixed(3)));
        const moveProb = Math.min(95, Math.max(20, Math.round(90 - c * 4 - Math.abs(3.5 - r) * 5)));
        const shotProb = 100 - moveProb;
        const star = stars[(c * 8 + r) % stars.length];

        grid.push({
          col: c,
          row: r,
          xt,
          obv,
          moveProb,
          shotProb,
          starPlayer: star,
        });
      }
    }
    return grid;
  }, []);

  const activeZoneData = useMemo(() => {
    if (!selectedZone) return gridData[0];
    return gridData.find(g => g.col === selectedZone.col && g.row === selectedZone.row) || gridData[0];
  }, [selectedZone, gridData]);


  // --- TOOL 2: Shot Map & Goal-Mouth PSxG State ---
  const [selectedShotTeamId, setSelectedShotTeamId] = useState<string>(teams[0]?.id || 'club-america');
  const [selectedShotId, setSelectedShotId] = useState<number>(0);

  const shotData = useMemo(() => {
    return [
      { id: 0, player: 'Henry Martín', teamId: 'club-america', jersey: 9, wiki: 'Henry_Martín', x: 88, y: 48, gx: 52, gy: 35, xG: 0.42, psxG: 0.68, outcome: 'Goal', dist: '11.2m', body: 'Header' },
      { id: 1, player: 'Henry Martín', teamId: 'club-america', jersey: 9, wiki: 'Henry_Martín', x: 79, y: 35, gx: 78, gy: 20, xG: 0.18, psxG: 0.35, outcome: 'Saved', dist: '19.5m', body: 'Right Foot' },
      { id: 2, player: 'Henry Martín', teamId: 'club-america', jersey: 9, wiki: 'Henry_Martín', x: 92, y: 55, gx: 45, gy: 60, xG: 0.55, psxG: 0.82, outcome: 'Goal', dist: '7.8m', body: 'Right Foot' },
      { id: 3, player: 'André-Pierre Gignac', teamId: 'tigres-uanl', jersey: 10, wiki: 'André-Pierre_Gignac', x: 74, y: 62, gx: 82, gy: 15, xG: 0.12, psxG: 0.44, outcome: 'Goal', dist: '24.1m', body: 'Right Foot (Volley)' },
      { id: 4, player: 'André-Pierre Gignac', teamId: 'tigres-uanl', jersey: 10, wiki: 'André-Pierre_Gignac', x: 85, y: 42, gx: 30, gy: 45, xG: 0.38, psxG: 0.15, outcome: 'Saved', dist: '14.0m', body: 'Right Foot' },
      { id: 5, player: 'Sergio Canales', teamId: 'cf-monterrey', jersey: 10, wiki: 'Sergio_Canales', x: 76, y: 50, gx: 65, gy: 25, xG: 0.22, psxG: 0.58, outcome: 'Goal', dist: '22.0m', body: 'Left Foot' },
      { id: 6, player: 'Carlos "Charly" Rodríguez', teamId: 'cruz-azul', jersey: 19, wiki: 'Carlos_Rodríguez_(footballer,_born_1997)', x: 72, y: 45, gx: 15, gy: 70, xG: 0.09, psxG: 0.00, outcome: 'Blocked', dist: '26.4m', body: 'Right Foot' },
      { id: 7, player: 'Roberto "Piojo" Alvarado', teamId: 'chivas-guadalajara', jersey: 25, wiki: 'Roberto_Alvarado', x: 83, y: 30, gx: 88, gy: 32, xG: 0.29, psxG: 0.61, outcome: 'Goal', dist: '16.5m', body: 'Left Foot' },
      { id: 8, player: 'Alexis Vega', teamId: 'toluca-fc', jersey: 9, wiki: 'Alexis_Vega_(footballer,_born_1997)', x: 78, y: 65, gx: 48, gy: 18, xG: 0.19, psxG: 0.52, outcome: 'Goal', dist: '21.3m', body: 'Right Foot' },
      { id: 9, player: 'Salomón Rondón', teamId: 'cf-pachuca', jersey: 23, wiki: 'Salomón_Rondón', x: 90, y: 50, gx: 50, gy: 50, xG: 0.64, psxG: 0.91, outcome: 'Goal', dist: '9.1m', body: 'Header' },
      { id: 10, player: 'César "Chino" Huerta', teamId: 'pumas-unam', jersey: 12, wiki: 'César_Huerta', x: 81, y: 25, gx: 72, gy: 40, xG: 0.26, psxG: 0.59, outcome: 'Goal', dist: '17.8m', body: 'Right Foot' },
    ];
  }, []);

  const filteredShots = useMemo(() => {
    return shotData.filter(s => s.teamId === selectedShotTeamId);
  }, [shotData, selectedShotTeamId]);

  const activeShot = useMemo(() => {
    return filteredShots.find(s => s.id === selectedShotId) || filteredShots[0] || shotData[0];
  }, [filteredShots, selectedShotId, shotData]);


  // --- TOOL 3: Tactical Passing Network State ---
  const [selectedPassTeamId, setSelectedPassTeamId] = useState<string>(teams[0]?.id || 'club-america');
  const [minPassFilter, setMinPassFilter] = useState<number>(12);

  const passingNetworkData = useMemo(() => {
    const activeTeam = teams.find(t => t.id === selectedPassTeamId) || teams[0];
    const star = activeTeam?.allStarPlayerName || 'Star Player';
    const starWiki = activeTeam?.wikiSlug || 'Henry_Martín';
    const starJersey = activeTeam?.jerseyNumber || 10;

    const nodes = [
      { id: 1, name: 'GK (Keeper)', role: 'GK', x: 10, y: 50, centrality: 40, passes: 18 },
      { id: 2, name: 'CB Left', role: 'DF', x: 28, y: 28, centrality: 62, passes: 45 },
      { id: 3, name: 'CB Right', role: 'DF', x: 28, y: 72, centrality: 65, passes: 48 },
      { id: 4, name: 'LB (Fullback)', role: 'DF', x: 42, y: 12, centrality: 58, passes: 38 },
      { id: 5, name: 'RB (Fullback)', role: 'DF', x: 42, y: 88, centrality: 60, passes: 40 },
      { id: 6, name: 'DM (Pivot)', role: 'MF', x: 48, y: 50, centrality: 88, passes: 64 },
      { id: 7, name: 'CM (Regista)', role: 'MF', x: 60, y: 35, centrality: 94, passes: 72 },
      { id: 8, name: star, role: 'CAM / Star', x: 68, y: 65, centrality: 100, passes: 85, isStar: true, wiki: starWiki, jersey: starJersey },
      { id: 9, name: 'LW (Winger)', role: 'FW', x: 78, y: 18, centrality: 72, passes: 34 },
      { id: 10, name: 'ST (Striker)', role: 'FW', x: 85, y: 50, centrality: 78, passes: 28 },
      { id: 11, name: 'RW (Winger)', role: 'FW', x: 78, y: 82, centrality: 70, passes: 32 },
    ];

    const connections = [
      { from: 1, to: 2, count: 22, xt: 0.012 },
      { from: 1, to: 3, count: 24, xt: 0.015 },
      { from: 2, to: 4, count: 35, xt: 0.038 },
      { from: 2, to: 6, count: 28, xt: 0.042 },
      { from: 3, to: 5, count: 32, xt: 0.035 },
      { from: 3, to: 6, count: 30, xt: 0.040 },
      { from: 6, to: 7, count: 48, xt: 0.075 },
      { from: 6, to: 8, count: 42, xt: 0.082 },
      { from: 7, to: 8, count: 52, xt: 0.098 },
      { from: 7, to: 9, count: 26, xt: 0.065 },
      { from: 8, to: 10, count: 38, xt: 0.125 },
      { from: 8, to: 11, count: 29, xt: 0.088 },
      { from: 9, to: 10, count: 18, xt: 0.055 },
      { from: 11, to: 10, count: 21, xt: 0.062 },
    ];

    return { nodes, connections, team: activeTeam };
  }, [selectedPassTeamId, teams]);

  const [activeNodeId, setActiveNodeId] = useState<number>(8);


  // --- TOOL 4: Scouting Quadrant Scatter & Similarity Engine State ---
  const [xAxisMetric, setXAxisMetric] = useState<string>('xG/90');
  const [yAxisMetric, setYAxisMetric] = useState<string>('xT/90');
  const [selectedScatterPlayer, setSelectedScatterPlayer] = useState<string>('Henry Martín');

  const scoutingMetrics = [
    { key: 'xG/90', label: 'Expected Goals (xG/90)' },
    { key: 'xT/90', label: 'Expected Threat (xT/90)' },
    { key: 'ProgCarries', label: 'Progressive Carries/90' },
    { key: 'PressResist', label: 'Press Resistance %' },
    { key: 'OBV/90', label: 'On-Ball Value (OBV/90)' },
    { key: 'AerialWin', label: 'Aerial Win %' },
    { key: 'KeyPasses', label: 'Key Passes/90' },
  ];

  const scatterPlayersData = useMemo(() => {
    return [
      { name: 'Henry Martín', team: 'Club América', wiki: 'Henry_Martín', jersey: 9, 'xG/90': 0.65, 'xT/90': 0.42, ProgCarries: 3.8, PressResist: 78, 'OBV/90': 0.38, AerialWin: 62, KeyPasses: 1.8 },
      { name: 'André-Pierre Gignac', team: 'Tigres UANL', wiki: 'André-Pierre_Gignac', jersey: 10, 'xG/90': 0.58, 'xT/90': 0.45, ProgCarries: 4.2, PressResist: 82, 'OBV/90': 0.41, AerialWin: 55, KeyPasses: 2.1 },
      { name: 'Sergio Canales', team: 'CF Monterrey', wiki: 'Sergio_Canales', jersey: 10, 'xG/90': 0.38, 'xT/90': 0.68, ProgCarries: 6.5, PressResist: 89, 'OBV/90': 0.52, AerialWin: 42, KeyPasses: 3.4 },
      { name: 'Carlos "Charly" Rodríguez', team: 'Cruz Azul', wiki: 'Carlos_Rodríguez_(footballer,_born_1997)', jersey: 19, 'xG/90': 0.22, 'xT/90': 0.62, ProgCarries: 5.8, PressResist: 91, 'OBV/90': 0.48, AerialWin: 48, KeyPasses: 3.1 },
      { name: 'Roberto "Piojo" Alvarado', team: 'Chivas Guadalajara', wiki: 'Roberto_Alvarado', jersey: 25, 'xG/90': 0.44, 'xT/90': 0.55, ProgCarries: 7.1, PressResist: 84, 'OBV/90': 0.45, AerialWin: 39, KeyPasses: 2.8 },
      { name: 'Alexis Vega', team: 'Toluca FC', wiki: 'Alexis_Vega_(footballer,_born_1997)', jersey: 9, 'xG/90': 0.51, 'xT/90': 0.58, ProgCarries: 6.2, PressResist: 80, 'OBV/90': 0.46, AerialWin: 45, KeyPasses: 2.9 },
      { name: 'Salomón Rondón', team: 'CF Pachuca', wiki: 'Salomón_Rondón', jersey: 23, 'xG/90': 0.61, 'xT/90': 0.35, ProgCarries: 2.9, PressResist: 75, 'OBV/90': 0.34, AerialWin: 68, KeyPasses: 1.4 },
      { name: 'César "Chino" Huerta', team: 'Pumas UNAM', wiki: 'César_Huerta', jersey: 12, 'xG/90': 0.48, 'xT/90': 0.59, ProgCarries: 7.8, PressResist: 83, 'OBV/90': 0.47, AerialWin: 41, KeyPasses: 2.6 },
    ];
  }, []);

  const similarityResults = useMemo(() => {
    const targetPlayer = scatterPlayersData.find(p => p.name === selectedScatterPlayer) || scatterPlayersData[0];
    const metricsToCompare = ['xG/90', 'xT/90', 'ProgCarries', 'PressResist', 'OBV/90', 'KeyPasses'] as const;

    const normalizedData = scatterPlayersData.map(p => {
      const vec: number[] = [];
      metricsToCompare.forEach(m => {
        const vals = scatterPlayersData.map(sp => sp[m] as number);
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const std = Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length) || 1;
        vec.push(((p[m] as number) - mean) / std);
      });
      return { player: p, vec };
    });

    const targetVec = normalizedData.find(nd => nd.player.name === targetPlayer.name)!.vec;

    const comps = normalizedData
      .filter(nd => nd.player.name !== targetPlayer.name)
      .map(nd => {
        let dot = 0, magA = 0, magB = 0;
        for (let i = 0; i < targetVec.length; i++) {
          dot += targetVec[i] * nd.vec[i];
          magA += targetVec[i] * targetVec[i];
          magB += nd.vec[i] * nd.vec[i];
        }
        const sim = Math.max(0, Math.min(1, (dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1) + 1) / 2));
        const simPercent = Number((sim * 100).toFixed(1));
        return { player: nd.player, simPercent };
      })
      .sort((a, b) => b.simPercent - a.simPercent)
      .slice(0, 3);

    return { targetPlayer, comps };
  }, [selectedScatterPlayer, scatterPlayersData]);


  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-md">
              PRO IQ ANALYTICS PLATFORM
            </span>
            <span className="text-xs text-cyan-400 font-mono font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> HUDL / OPTA / SKILLCORNER POWERED
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1 flex items-center gap-3">
            Pro Scouting &amp; Pitch IQ Visualizer
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Deep-dive advanced Markov-chain xT, PSxG Goal-Mouth tracking, Tactical Passing Networks, and Cosine Similarity Scouting.
          </p>
        </div>

        <div className="flex flex-wrap items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveSubTab('xt_grid')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'xt_grid'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" /> 12x8 xT Grid
          </button>
          <button
            onClick={() => setActiveSubTab('shot_map')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'shot_map'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-4 h-4" /> Shot Map &amp; PSxG
          </button>
          <button
            onClick={() => setActiveSubTab('passing_net')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'passing_net'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" /> Passing Network
          </button>
          <button
            onClick={() => setActiveSubTab('quadrant_scatter')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'quadrant_scatter'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Scouting Scatter
          </button>
        </div>
      </div>

      {activeSubTab === 'xt_grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Markov-Chain 12x8 Pitch Heatmap Grid
              </h3>
              <span className="text-xs text-slate-400">Click any zone to inspect xT / OBV analytics</span>
            </div>

            <div className="relative w-full aspect-[1.5/1] bg-emerald-950/80 rounded-xl border border-emerald-800/60 p-2 overflow-hidden shadow-inner">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1200 800" fill="none" stroke="#22c55e" strokeWidth="3">
                <rect x="20" y="20" width="1160" height="760" />
                <line x1="600" y1="20" x2="600" y2="780" />
                <circle cx="600" cy="400" r="110" />
                <rect x="20" y="200" width="180" height="400" />
                <rect x="1000" y="200" width="180" height="400" />
                <rect x="0" y="320" width="20" height="160" fill="#22c55e" fillOpacity="0.2" />
                <rect x="1180" y="320" width="20" height="160" fill="#22c55e" fillOpacity="0.2" />
              </svg>

              <div className="grid grid-cols-12 grid-rows-8 w-full h-full gap-0.5 relative z-10">
                {gridData.map((cell) => {
                  const isSelected = selectedZone?.col === cell.col && selectedZone?.row === cell.row;
                  const intensity = Math.min(1, cell.xt / 0.075);
                  const bgStyle = isSelected
                    ? 'rgba(6, 182, 212, 0.95)'
                    : `rgba(234, 88, 12, ${0.1 + intensity * 0.8})`;

                  return (
                    <button
                      key={`grid-${cell.col}-${cell.row}`}
                      onClick={() => setSelectedZone({ col: cell.col, row: cell.row })}
                      style={{ backgroundColor: bgStyle }}
                      className={`w-full h-full rounded-[2px] transition-all flex flex-col items-center justify-center border ${
                        isSelected ? 'border-2 border-white shadow-lg ring-2 ring-cyan-400 scale-105 z-20' : 'border-slate-900/30 hover:border-white/50'
                      }`}
                      title={`Zone (${cell.col+1},${cell.row+1}): xT ${cell.xt}`}
                    >
                      <span className={`text-[9px] font-mono font-black ${isSelected ? 'text-slate-950' : 'text-white/90'}`}>
                        {cell.xt.toFixed(3).replace('0.', '.')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>Goal (Left)</span>
              <div className="flex items-center gap-2">
                <span>Low xT</span>
                <div className="w-24 h-2.5 rounded bg-gradient-to-r from-orange-950 via-orange-600 to-cyan-400"></div>
                <span>High xT</span>
              </div>
              <span>Attack Direction &rarr; Goal (Right)</span>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Zone Analytics</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                  Col {activeZoneData.col + 1} / Row {activeZoneData.row + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1 font-semibold">Markov xT Value</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">+{activeZoneData.xt.toFixed(3)}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Threat created per pass</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1 font-semibold">On-Ball Value (OBV)</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">+{activeZoneData.obv.toFixed(3)}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Added goal probability</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Move Probability (Pass/Carry)</span>
                  <span className="text-cyan-400 font-mono">{activeZoneData.moveProb}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${activeZoneData.moveProb}%` }}></div>
                </div>

                <div className="flex justify-between text-xs font-bold pt-1">
                  <span className="text-slate-300">Direct Shot Probability</span>
                  <span className="text-amber-400 font-mono">{activeZoneData.shotProb}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${activeZoneData.shotProb}%` }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-cyan-500/30">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-2">
                  DOMINANT LIGA MX STAR IN ZONE
                </span>
                <div className="flex items-center gap-3">
                  <TeamStarAvatar
                    wikiSlug={activeZoneData.starPlayer.wiki}
                    playerName={activeZoneData.starPlayer.name}
                    jerseyNumber={activeZoneData.starPlayer.jersey}
                    size="lg"
                  />
                  <div>
                    <h4 className="font-extrabold text-white text-base leading-tight">
                      {activeZoneData.starPlayer.name}
                    </h4>
                    <span className="text-xs text-slate-300 font-medium">
                      {activeZoneData.starPlayer.team}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 block mt-1 font-bold">
                      #1 in Progressive Carries in Zone
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'shot_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Half-Pitch Shot Location Map
              </h3>
              <select
                value={selectedShotTeamId}
                onChange={(e) => setSelectedShotTeamId(e.target.value)}
                className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-cyan-500"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.allStarPlayerName})</option>
                ))}
              </select>
            </div>

            <div className="relative w-full aspect-[1.4/1] bg-emerald-950/90 rounded-xl border border-emerald-800/60 p-2 overflow-hidden shadow-inner">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 600 800" fill="none" stroke="#22c55e" strokeWidth="3">
                <rect x="20" y="20" width="560" height="760" />
                <line x1="20" y1="780" x2="580" y2="780" />
                <circle cx="300" cy="780" r="110" />
                <rect x="120" y="20" width="360" height="240" />
                <rect x="200" y="20" width="200" height="90" />
                <circle cx="300" cy="180" r="4" fill="#22c55e" />
                <rect x="230" y="0" width="140" height="20" fill="#22c55e" fillOpacity="0.3" />
              </svg>

              <div className="relative w-full h-full z-10">
                {filteredShots.map((shot) => {
                  const isSelected = activeShot.id === shot.id;
                  const radius = Math.max(12, Math.min(32, shot.xG * 40));
                  const outcomeColors = {
                    Goal: 'bg-emerald-500 border-emerald-200 ring-emerald-400',
                    Saved: 'bg-blue-500 border-blue-200 ring-blue-400',
                    Blocked: 'bg-red-500 border-red-200 ring-red-400',
                  }[shot.outcome as 'Goal' | 'Saved' | 'Blocked'] || 'bg-amber-500';

                  return (
                    <button
                      key={`shot-${shot.id}`}
                      onClick={() => setSelectedShotId(shot.id)}
                      style={{
                        left: `${shot.y}%`,
                        top: `${100 - shot.x}%`,
                        width: `${radius}px`,
                        height: `${radius}px`,
                      }}
                      className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all flex items-center justify-center border-2 shadow-lg ${outcomeColors} ${
                        isSelected ? 'scale-125 ring-4 z-30 opacity-100' : 'opacity-80 hover:opacity-100 hover:scale-110'
                      }`}
                      title={`${shot.player} (${shot.outcome}): ${shot.xG} xG`}
                    >
                      <span className="text-[10px] font-mono font-black text-white">
                        {shot.xG.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-around mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Goal</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Saved</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Blocked/Off-Target</span>
              <span className="text-slate-400 font-mono">Circle Size = xG Volume</span>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" /> Goal-Mouth PSxG Frame
                </h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">2D Placement</span>
              </div>

              <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-xl border-4 border-slate-300 p-2 overflow-hidden mb-4 shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"></div>

                {activeShot && (
                  <div
                    style={{ left: `${activeShot.gx}%`, top: `${activeShot.gy}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-bounce"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-xl flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-950"></div>
                    </div>
                    <span className="text-[9px] bg-slate-900 font-mono text-cyan-300 font-bold px-1 rounded shadow mt-0.5 whitespace-nowrap">
                      {activeShot.psxG} PSxG
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <TeamStarAvatar
                    wikiSlug={activeShot.wiki}
                    playerName={activeShot.player}
                    jerseyNumber={activeShot.jersey}
                    size="md"
                  />
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{activeShot.player}</h4>
                    <span className="text-xs text-slate-400">{activeShot.dist} &bull; {activeShot.body}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block font-medium">Pre-Shot xG</span>
                    <span className="text-xl font-black text-slate-200 font-mono">{activeShot.xG.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block font-medium">Post-Shot PSxG</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">{activeShot.psxG.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Finishing Clinicality (PSxG - xG)</span>
                  <span className="text-base font-black font-mono text-emerald-400">
                    +{(activeShot.psxG - activeShot.xG).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'passing_net' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> Tactical Passing Network &amp; Centrality Overlay
              </h3>
              <select
                value={selectedPassTeamId}
                onChange={(e) => setSelectedPassTeamId(e.target.value)}
                className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-cyan-500"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 mb-4 flex items-center gap-4">
              <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Filter Minimum Pass Volume</span>
                  <span className="text-cyan-400 font-mono">{minPassFilter}+ Passes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={minPassFilter}
                  onChange={(e) => setMinPassFilter(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="relative w-full aspect-[1.5/1] bg-emerald-950/90 rounded-xl border border-emerald-800/60 p-2 overflow-hidden shadow-inner">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="#22c55e" strokeWidth="0.8">
                <rect x="2" y="2" width="96" height="96" />
                <line x1="50" y1="2" x2="50" y2="98" />
                <circle cx="50" cy="50" r="15" />
                <rect x="2" y="25" width="18" height="50" />
                <rect x="80" y="25" width="18" height="50" />
              </svg>

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {passingNetworkData.connections
                  .filter(c => c.count >= minPassFilter)
                  .map((conn, idx) => {
                    const fromNode = passingNetworkData.nodes.find(n => n.id === conn.from)!;
                    const toNode = passingNetworkData.nodes.find(n => n.id === conn.to)!;
                    const strokeWidth = Math.max(0.6, Math.min(3.5, conn.count / 12));
                    const isStarConn = fromNode.isStar || toNode.isStar;

                    return (
                      <line
                        key={`conn-${idx}`}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isStarConn ? '#06b6d4' : '#94a3b8'}
                        strokeWidth={strokeWidth}
                        strokeOpacity={isStarConn ? 0.9 : 0.6}
                      />
                    );
                  })}
              </svg>

              <div className="relative w-full h-full z-20">
                {passingNetworkData.nodes.map((node) => {
                  const isSelected = activeNodeId === node.id;
                  const nodeSize = Math.max(24, Math.min(48, node.centrality * 0.45));

                  return (
                    <button
                      key={`node-${node.id}`}
                      onClick={() => setActiveNodeId(node.id)}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        width: `${nodeSize}px`,
                        height: `${nodeSize}px`,
                      }}
                      className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all flex items-center justify-center border-2 shadow-xl ${
                        node.isStar
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 border-white ring-4 ring-cyan-400'
                          : 'bg-slate-900 border-slate-300 hover:border-cyan-400'
                      } ${isSelected ? 'scale-125 z-30 ring-4 ring-white' : 'hover:scale-110'}`}
                      title={`${node.name}: ${node.passes} passes`}
                    >
                      {node.isStar ? (
                        <TeamStarAvatar
                          wikiSlug={node.wiki}
                          playerName={node.name}
                          jerseyNumber={node.jersey}
                          size="sm"
                          showBadge={false}
                        />
                      ) : (
                        <span className="text-[10px] font-black text-white font-mono">
                          {node.role}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Tactical Centrality</span>
                <h3 className="text-lg font-black text-white mt-1">
                  {passingNetworkData.nodes.find(n => n.id === activeNodeId)?.name || 'Player'}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block font-semibold">Ball Progression Centrality</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {passingNetworkData.nodes.find(n => n.id === activeNodeId)?.centrality}%
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">+14% vs League Avg</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400 block font-semibold">Total Completed Passes</span>
                  <span className="text-2xl font-black text-white font-mono mt-1 block">
                    {passingNetworkData.nodes.find(n => n.id === activeNodeId)?.passes}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-xs font-bold text-slate-300 block mb-2">Key Passing Links</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Primary Outlet</span>
                      <span className="font-mono text-cyan-400 font-bold">52 passes (xT +0.098)</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Secondary Link</span>
                      <span className="font-mono text-cyan-400 font-bold">42 passes (xT +0.082)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'quadrant_scatter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" /> 2D Scouting Quadrant Scatter Chart
              </h3>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="font-bold">X:</span>
                  <select
                    value={xAxisMetric}
                    onChange={(e) => setXAxisMetric(e.target.value)}
                    className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded border border-slate-700"
                  >
                    {scoutingMetrics.map(m => (
                      <option key={`x-${m.key}`} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="font-bold">Y:</span>
                  <select
                    value={yAxisMetric}
                    onChange={(e) => setYAxisMetric(e.target.value)}
                    className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded border border-slate-700"
                  >
                    {scoutingMetrics.map(m => (
                      <option key={`y-${m.key}`} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="relative w-full aspect-[1.4/1] bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-slate-700"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-slate-700"></div>
                <span className="absolute top-2 right-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded">
                  Elite / High Output
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  High {xAxisMetric}
                </span>
                <span className="absolute top-2 left-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  High {yAxisMetric}
                </span>
              </div>

              <div className="relative w-full h-full z-10">
                {scatterPlayersData.map((player) => {
                  const xVal = player[xAxisMetric as keyof typeof player] as number;
                  const yVal = player[yAxisMetric as keyof typeof player] as number;

                  const allX = scatterPlayersData.map(p => p[xAxisMetric as keyof typeof p] as number);
                  const allY = scatterPlayersData.map(p => p[yAxisMetric as keyof typeof p] as number);
                  const minX = Math.min(...allX), maxX = Math.max(...allX);
                  const minY = Math.min(...allY), maxY = Math.max(...allY);

                  const posX = 10 + ((xVal - minX) / (maxX - minX || 1)) * 80;
                  const posY = 90 - ((yVal - minY) / (maxY - minY || 1)) * 80;

                  const isSelected = selectedScatterPlayer === player.name;

                  return (
                    <button
                      key={`scatter-${player.name}`}
                      onClick={() => setSelectedScatterPlayer(player.name)}
                      style={{ left: `${posX}%`, top: `${posY}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all flex items-center gap-1 group ${
                        isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                      }`}
                    >
                      <TeamStarAvatar
                        wikiSlug={player.wiki}
                        playerName={player.name}
                        jerseyNumber={player.jersey}
                        size={isSelected ? 'md' : 'sm'}
                      />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow ${
                        isSelected ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-200 border border-slate-700'
                      }`}>
                        {player.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">SIMILARITY ENGINE</span>
                <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Cosine Player Comps
                </h3>
              </div>

              <div className="mb-4">
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Selected Star Player</label>
                <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <TeamStarAvatar
                    wikiSlug={similarityResults.targetPlayer.wiki}
                    playerName={similarityResults.targetPlayer.name}
                    jerseyNumber={similarityResults.targetPlayer.jersey}
                    size="md"
                  />
                  <div>
                    <h4 className="font-black text-white text-sm">{similarityResults.targetPlayer.name}</h4>
                    <span className="text-xs text-cyan-400 font-semibold">{similarityResults.targetPlayer.team}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wide">
                TOP 3 STATISTICAL COMPS
              </span>
              <div className="space-y-3">
                {similarityResults.comps.map((comp, idx) => (
                  <div key={`comp-${idx}`} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TeamStarAvatar
                          wikiSlug={comp.player.wiki}
                          playerName={comp.player.name}
                          jerseyNumber={comp.player.jersey}
                          size="sm"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-white">{comp.player.name}</h5>
                          <span className="text-[10px] text-slate-400">{comp.player.team}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                        {comp.simPercent}% MATCH
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                        style={{ width: `${comp.simPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
