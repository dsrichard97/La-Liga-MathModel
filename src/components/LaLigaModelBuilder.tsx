import React, { useState } from 'react';
import { MLSTeam, MLSPlayer, LaLigaModelWeights, SimulationResult } from '../types/soccer';
import { LA_LIGA_PRESETS } from '../data/ligaMxData';
import { simulateLaLigaMatch } from '../utils/modelCalculations';
import { Sliders, Play, Sparkles, BookOpen, Calculator, RotateCcw, Save, ShieldAlert, Trophy, Package, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LaLigaModelBuilderProps {
  teams: MLSTeam[];
  players: MLSPlayer[];
  weights: LaLigaModelWeights;
  onUpdateWeights: (weights: LaLigaModelWeights) => void;
  onSelectPlayerForCompare: (player: MLSPlayer) => void;
  onOpenExportPackage?: () => void;
}

export const LaLigaModelBuilder: React.FC<LaLigaModelBuilderProps> = ({
  teams,
  players,
  weights,
  onUpdateWeights,
  onSelectPlayerForCompare,
  onOpenExportPackage,
}) => {
  const [homeTeamId, setHomeTeamId] = useState<string>(teams[0]?.id || 'club-america');
  const [awayTeamId, setAwayTeamId] = useState<string>(teams[5]?.id || teams[1]?.id || 'chivas');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const homeTeam = teams.find((t) => t.id === homeTeamId) || teams[0];
  const awayTeam = teams.find((t) => t.id === awayTeamId) || teams[1];

  const homeStar = players.find((p) => p.id === homeTeam.allStarPlayerId);
  const awayStar = players.find((p) => p.id === awayTeam.allStarPlayerId);

  // Run match simulation with current La Liga algorithmic weights
  const handleRunSimulation = () => {
    const result = simulateLaLigaMatch(homeTeam, awayTeam, homeStar, awayStar, weights);
    setSimulationResult(result);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00E5FF', '#F4D03F', '#FF007F'],
    });
  };

  const handleSliderChange = (key: keyof LaLigaModelWeights, val: number) => {
    onUpdateWeights({
      ...weights,
      [key]: val,
    });
  };

  const handleApplyPreset = (preset: LaLigaModelWeights) => {
    onUpdateWeights({ ...preset });
    setSavedNotification(`Applied preset: ${preset.name}`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleSaveModel = () => {
    setSavedNotification(`Saved "${weights.name}" configuration to active state!`);
    setTimeout(() => setSavedNotification(null), 3500);
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-6 border border-white/10 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-700/60 text-amber-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                Custom "La Liga" Algorithmic Model Builder
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Predictive Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Tune advanced metric weights to benchmark MLS clubs and simulate match outcomes
            </p>
          </div>
        </div>

        {/* Preset Selector & Save Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-mono">Preset:</span>
            <select
              value={weights.name}
              onChange={(e) => {
                const found = LA_LIGA_PRESETS.find((p) => p.name === e.target.value);
                if (found) handleApplyPreset(found);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {LA_LIGA_PRESETS.map((preset) => (
                <option key={preset.name} value={preset.name} className="bg-slate-900 text-white">
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveModel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Model
          </button>

          {onOpenExportPackage && (
            <button
              onClick={onOpenExportPackage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Package</span>
            </button>
          )}

          <a
            href="https://dsrichard97.github.io/La-Liga-MathModel/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GitHub Pages</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Sliders Grid: 6 Algorithmic Metric Weights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Technical Passing */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-200">Technical Passing & Progression</span>
            <span className="text-cyan-400 font-extrabold">{weights.technicalPassing}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={weights.technicalPassing}
            onChange={(e) => handleSliderChange('technicalPassing', parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>PrgP & Key Passes</span>
            <span>La Liga Core Weight</span>
          </div>
        </div>

        {/* Expected Threat (PV / xT) */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-200">Expected Threat & Spacing (xT)</span>
            <span className="text-cyan-400 font-extrabold">{weights.expectedThreatWeight}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={weights.expectedThreatWeight}
            onChange={(e) => handleSliderChange('expectedThreatWeight', parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Zone 14 Entry Threat</span>
            <span>Possession Value</span>
          </div>
        </div>

        {/* Finishing Clinicality */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-200">Clinical Finishing Efficiency</span>
            <span className="text-amber-400 font-extrabold">{weights.finishingEfficiency}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={weights.finishingEfficiency}
            onChange={(e) => handleSliderChange('finishingEfficiency', parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Goals / xG Ratio</span>
            <span>xGOT Leverage</span>
          </div>
        </div>

        {/* Press Resistance */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-200">Press Resistance & Ball Retention</span>
            <span className="text-emerald-400 font-extrabold">{weights.pressResistance}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={weights.pressResistance}
            onChange={(e) => handleSliderChange('pressResistance', parseInt(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Low Turnovers</span>
            <span>Ground Duel Win %</span>
          </div>
        </div>

        {/* High Counter-Pressing */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-200">Gegenpress & Transition Duels</span>
            <span className="text-purple-400 font-extrabold">{weights.highPressing}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={weights.highPressing}
            onChange={(e) => handleSliderChange('highPressing', parseInt(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>PPDA Inversion</span>
            <span>Interception Rate</span>
          </div>
        </div>

        {/* Aerial Dominance */}
        <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-slate-200">Aerial & Physical Duels</span>
            <span className="text-rose-400 font-extrabold">{weights.aerialDominance}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={weights.aerialDominance}
            onChange={(e) => handleSliderChange('aerialDominance', parseInt(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Aerial Win %</span>
            <span>Target Man Leverage</span>
          </div>
        </div>
      </div>

      {/* Live Algorithmic Formula Card */}
      <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="uppercase tracking-widest text-[11px] font-bold text-cyan-400">
            Active Algorithmic Prediction Equation:
          </span>
          <span className="text-slate-500">Live Mathematical Formulation</span>
        </div>
        <div className="p-3 rounded-lg bg-black/70 border border-white/5 text-slate-200 overflow-x-auto text-xs sm:text-sm font-code leading-relaxed">
          <span className="text-amber-400">Index_LaLiga</span> = (
          <span className="text-cyan-300">{(weights.technicalPassing / 100).toFixed(2)}</span>·PrgP +
          <span className="text-cyan-300"> {(weights.expectedThreatWeight / 100).toFixed(2)}</span>·xT +
          <span className="text-amber-300"> {(weights.finishingEfficiency / 100).toFixed(2)}</span>·(Goals/xG) +
          <span className="text-emerald-300"> {(weights.pressResistance / 100).toFixed(2)}</span>·Retention% +
          <span className="text-purple-300"> {(weights.highPressing / 100).toFixed(2)}</span>·PressIntensity +
          <span className="text-rose-300"> {(weights.aerialDominance / 100).toFixed(2)}</span>·Aerial%
          ) ÷ <span className="text-slate-400 font-bold">∑W</span>
        </div>
      </div>

      {/* Match Prediction Simulator using active La Liga weights */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-black border border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Liga MX Match Prediction Simulation Engine
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Simulate 10,000 algorithmic match iterations with your custom La Liga parameters (e.g. Clásico Nacional or Clásico Regio)
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            Run Match Simulation
          </button>
        </div>

        {/* Matchup Team Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
            <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Home Team
            </label>
            <select
              value={homeTeamId}
              onChange={(e) => setHomeTeamId(e.target.value)}
              className="w-full bg-[#111827] text-white text-sm font-semibold rounded-lg px-3 py-2 border border-cyan-800/60 focus:outline-none cursor-pointer"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (All-Star: {players.find((p) => p.id === t.allStarPlayerId)?.commonName})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40">
            <label className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
              Away Team
            </label>
            <select
              value={awayTeamId}
              onChange={(e) => setAwayTeamId(e.target.value)}
              className="w-full bg-[#111827] text-white text-sm font-semibold rounded-lg px-3 py-2 border border-rose-800/60 focus:outline-none cursor-pointer"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (All-Star: {players.find((p) => p.id === t.allStarPlayerId)?.commonName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulation Output Display */}
        {simulationResult && (
          <div className="mt-5 p-4 rounded-xl bg-black/60 border border-cyan-500/30 animate-fadeIn space-y-4">
            {/* Scoreline Banner */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-center flex-1">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {simulationResult.homeTeam.shortName}
                </div>
                <div className="font-tech font-extrabold text-4xl text-white mt-1">
                  {simulationResult.homePredictedGoals}
                </div>
              </div>

              <div className="text-center px-4">
                <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                  FT SIMULATION
                </span>
                <div className="text-xs text-amber-400 font-mono mt-0.5">
                  Draw: {simulationResult.drawProb}%
                </div>
              </div>

              <div className="text-center flex-1">
                <div className="text-xs font-mono text-rose-400 font-bold uppercase">
                  {simulationResult.awayTeam.shortName}
                </div>
                <div className="font-tech font-extrabold text-4xl text-white mt-1">
                  {simulationResult.awayPredictedGoals}
                </div>
              </div>
            </div>

            {/* Probability Distribution Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="text-cyan-400 font-bold">
                  {simulationResult.homeTeam.shortName} Win: {simulationResult.homeWinProb}%
                </span>
                <span className="text-slate-400 font-semibold">Draw: {simulationResult.drawProb}%</span>
                <span className="text-rose-400 font-bold">
                  {simulationResult.awayTeam.shortName} Win: {simulationResult.awayWinProb}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
                <div
                  style={{ width: `${simulationResult.homeWinProb}%` }}
                  className="bg-cyan-500 transition-all duration-500"
                />
                <div
                  style={{ width: `${simulationResult.drawProb}%` }}
                  className="bg-slate-600 transition-all duration-500"
                />
                <div
                  style={{ width: `${simulationResult.awayWinProb}%` }}
                  className="bg-rose-500 transition-all duration-500"
                />
              </div>
            </div>

            {/* Tactical Clash Notes */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 space-y-1">
              <div className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                La Liga Model Insight:
              </div>
              <p>{simulationResult.tacticalClashNote}</p>
              <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>• Home: {simulationResult.homeKeyFactor}</div>
                <div>• Away: {simulationResult.awayKeyFactor}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
