import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MLSPlayer } from '../types/soccer';
import { FifaPlayerCard } from './FifaPlayerCard';
import { X, ArrowRightLeft, Sparkles, Trophy, Shield, Zap, Search } from 'lucide-react';

interface PlayerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  player1: MLSPlayer | null;
  player2: MLSPlayer | null;
  allPlayers: MLSPlayer[];
  onSelectPlayer1: (player: MLSPlayer) => void;
  onSelectPlayer2: (player: MLSPlayer) => void;
}

interface RadarMetric {
  name: string;
  key1Value: number;
  key2Value: number;
  label1: string;
  label2: string;
}

export const PlayerCompareModal: React.FC<PlayerCompareModalProps> = ({
  isOpen,
  onClose,
  player1,
  player2,
  allPlayers,
  onSelectPlayer1,
  onSelectPlayer2,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');

  // Radar metrics calculation
  const getRadarMetrics = (p1: MLSPlayer, p2: MLSPlayer): RadarMetric[] => {
    return [
      {
        name: 'Pace & Acceleration',
        key1Value: p1.fifaAttributes.pac,
        key2Value: p2.fifaAttributes.pac,
        label1: `${p1.fifaAttributes.pac} PAC`,
        label2: `${p2.fifaAttributes.pac} PAC`,
      },
      {
        name: 'Shooting & xG',
        key1Value: Math.min(100, (p1.stats.xG / 20) * 100),
        key2Value: Math.min(100, (p2.stats.xG / 20) * 100),
        label1: `${p1.stats.xG.toFixed(1)} xG (${p1.stats.goals}G)`,
        label2: `${p2.stats.xG.toFixed(1)} xG (${p2.stats.goals}G)`,
      },
      {
        name: 'Passing & xA',
        key1Value: Math.min(100, (p1.stats.xA / 15) * 100),
        key2Value: Math.min(100, (p2.stats.xA / 15) * 100),
        label1: `${p1.stats.xA.toFixed(1)} xA (${p1.stats.assists}A)`,
        label2: `${p2.stats.xA.toFixed(1)} xA (${p2.stats.assists}A)`,
      },
      {
        name: 'Ball Progression (PrgP)',
        key1Value: Math.min(100, (p1.stats.prgP / 320) * 100),
        key2Value: Math.min(100, (p2.stats.prgP / 320) * 100),
        label1: `${p1.stats.prgP} Prg Passes`,
        label2: `${p2.stats.prgP} Prg Passes`,
      },
      {
        name: 'Possession Threat (xT)',
        key1Value: Math.min(100, p1.stats.pv * 105),
        key2Value: Math.min(100, p2.stats.pv * 105),
        label1: `${p1.stats.pv.toFixed(2)} PV`,
        label2: `${p2.stats.pv.toFixed(2)} PV`,
      },
      {
        name: 'Duels & Physicality',
        key1Value: p1.stats.duelWinPct,
        key2Value: p2.stats.duelWinPct,
        label1: `${p1.stats.duelWinPct.toFixed(0)}% Duels`,
        label2: `${p2.stats.duelWinPct.toFixed(0)}% Duels`,
      },
    ];
  };

  // Render D3 Radar Chart
  useEffect(() => {
    if (!isOpen || !svgRef.current || !player1 || !player2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 380;
    const height = 360;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    const metrics = getRadarMetrics(player1, player2);
    const totalAxes = metrics.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Center g container
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw concentric polygon rings
    const levels = 5;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);

    for (let level = 1; level <= levels; level++) {
      const levelFactor = (radius / levels) * level;
      const ringPoints: [number, number][] = [];

      for (let i = 0; i < totalAxes; i++) {
        const x = levelFactor * Math.sin(i * angleSlice);
        const y = -levelFactor * Math.cos(i * angleSlice);
        ringPoints.push([x, y]);
      }

      g.append('polygon')
        .attr('points', ringPoints.map((d) => d.join(',')).join(' '))
        .attr('stroke', 'rgba(255, 255, 255, 0.12)')
        .attr('stroke-width', '1')
        .attr('fill', level % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'none');

      // Level percentage labels
      g.append('text')
        .attr('x', 4)
        .attr('y', -levelFactor)
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .attr('fill', 'rgba(255, 255, 255, 0.3)')
        .text(`${level * 20}%`);
    }

    // Draw radial axes and labels
    metrics.forEach((metric, i) => {
      const x = radius * Math.sin(i * angleSlice);
      const y = -radius * Math.cos(i * angleSlice);

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'rgba(255, 255, 255, 0.15)')
        .attr('stroke-width', '1');

      // Axis labels with offset
      const labelRadius = radius + 24;
      const lx = labelRadius * Math.sin(i * angleSlice);
      const ly = -labelRadius * Math.cos(i * angleSlice);

      g.append('text')
        .attr('x', lx)
        .attr('y', ly)
        .attr('text-anchor', lx > 5 ? 'start' : lx < -5 ? 'end' : 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', '600')
        .attr('fill', '#94A3B8')
        .text(metric.name);
    });

    // Radar line generator
    const radarLine = d3
      .lineRadial<number>()
      .radius((d) => rScale(d))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    // Data points arrays
    const p1Values = metrics.map((m) => m.key1Value);
    const p2Values = metrics.map((m) => m.key2Value);

    // Player 1 Polygon (Electric Cyan)
    g.append('path')
      .datum(p1Values)
      .attr('d', radarLine)
      .attr('fill', 'rgba(0, 229, 255, 0.25)')
      .attr('stroke', '#00E5FF')
      .attr('stroke-width', 2.5)
      .style('filter', 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.5))');

    // Player 2 Polygon (Gold Foil)
    g.append('path')
      .datum(p2Values)
      .attr('d', radarLine)
      .attr('fill', 'rgba(244, 208, 63, 0.25)')
      .attr('stroke', '#F4D03F')
      .attr('stroke-width', 2.5)
      .style('filter', 'drop-shadow(0 0 8px rgba(244, 208, 63, 0.5))');

    // Dots for Player 1
    p1Values.forEach((val, i) => {
      const r = rScale(val);
      const x = r * Math.sin(i * angleSlice);
      const y = -r * Math.cos(i * angleSlice);
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4)
        .attr('fill', '#00E5FF')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5);
    });

    // Dots for Player 2
    p2Values.forEach((val, i) => {
      const r = rScale(val);
      const x = r * Math.sin(i * angleSlice);
      const y = -r * Math.cos(i * angleSlice);
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4)
        .attr('fill', '#F4D03F')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5);
    });
  }, [isOpen, player1, player2]);

  if (!isOpen || !player1 || !player2) return null;

  // Filtered player lists for selector
  const filteredList1 = allPlayers.filter(
    (p) =>
      p.id !== player2.id &&
      (p.name.toLowerCase().includes(searchTerm1.toLowerCase()) ||
        p.teamName.toLowerCase().includes(searchTerm1.toLowerCase()))
  );

  const filteredList2 = allPlayers.filter(
    (p) =>
      p.id !== player1.id &&
      (p.name.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        p.teamName.toLowerCase().includes(searchTerm2.toLowerCase()))
  );

  // Chemistry Link Calculation between the two players
  const sameClub = player1.teamId === player2.teamId;
  const sameNation = player1.nationality === player2.nationality;
  const bothAllStars = player1.isAllStar && player2.isAllStar;

  let chemStrength = 1;
  let chemLabel = 'Neutral Synergy (1/3 Chemistry)';
  if (sameClub && sameNation) {
    chemStrength = 3;
    chemLabel = 'Perfect Club & National Chemistry (3/3)';
  } else if (sameClub || sameNation || bothAllStars) {
    chemStrength = 2;
    chemLabel = sameClub
      ? 'Same Club Chemistry Link (2/3)'
      : sameNation
      ? 'National Teammate Link (2/3)'
      : 'MLS All-Star Star Link (2/3)';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-white/15 bg-[#0B0F19] shadow-2xl p-4 sm:p-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-white/10">
              <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white tracking-wide flex items-center gap-2">
                Side-by-Side Player Comparison
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  D3.js Radar Visualizer
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Compare FIFA Ultimate Team cards, tactical metrics, and chemistry links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Player Selector Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Player 1 Selector */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Player 1 (Cyan Axis)
            </label>
            <select
              value={player1.id}
              onChange={(e) => {
                const found = allPlayers.find((p) => p.id === e.target.value);
                if (found) onSelectPlayer1(found);
              }}
              className="w-full bg-[#111827] text-white text-sm font-semibold rounded-lg px-3 py-2 border border-cyan-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
            >
              {allPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.overallRating} OVR · {p.teamName})
                </option>
              ))}
            </select>
          </div>

          {/* Player 2 Selector */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Player 2 (Gold Axis)
            </label>
            <select
              value={player2.id}
              onChange={(e) => {
                const found = allPlayers.find((p) => p.id === e.target.value);
                if (found) onSelectPlayer2(found);
              }}
              className="w-full bg-[#111827] text-white text-sm font-semibold rounded-lg px-3 py-2 border border-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {allPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.overallRating} OVR · {p.teamName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chemistry Synergy Bar Between Both Players */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${chemStrength === 3 ? 'text-emerald-400' : chemStrength === 2 ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-200">
              FIFA Chemistry Synergy:
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                chemStrength === 3
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : chemStrength === 2
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {chemLabel}
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            All-Star Synergy Boost: <span className="text-cyan-400 font-bold">×{((player1.chemistryWeight + player2.chemistryWeight) / 2).toFixed(2)}</span>
          </div>
        </div>

        {/* Center Grid: Left FIFA Card, Center D3 Radar Chart, Right FIFA Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Player Card */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="text-center mb-2">
              <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                PLAYER 1
              </span>
            </div>
            <FifaPlayerCard player={player1} size="md" highlighted={true} />
            <div className="mt-2 text-center text-xs font-mono text-slate-400">
              Form Rating: <span className="text-cyan-400 font-bold">{player1.stats.matchRating.toFixed(2)}</span> / 10
            </div>
          </div>

          {/* Center: D3.js Radar Chart */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
            <div className="flex items-center justify-between w-full px-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <span className="w-3 h-3 rounded-full bg-[#00E5FF]" />
                <span>{player1.commonName}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                D3 Radial Projection
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <span className="w-3 h-3 rounded-full bg-[#F4D03F]" />
                <span>{player2.commonName}</span>
              </div>
            </div>

            {/* SVG Canvas for D3 */}
            <div className="relative flex items-center justify-center overflow-visible">
              <svg
                ref={svgRef}
                width={380}
                height={360}
                className="overflow-visible select-none"
              />
            </div>
          </div>

          {/* Right Player Card */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="text-center mb-2">
              <span className="text-xs font-bold text-amber-400 font-mono tracking-widest uppercase">
                PLAYER 2
              </span>
            </div>
            <FifaPlayerCard player={player2} size="md" highlighted={true} />
            <div className="mt-2 text-center text-xs font-mono text-slate-400">
              Form Rating: <span className="text-amber-400 font-bold">{player2.stats.matchRating.toFixed(2)}</span> / 10
            </div>
          </div>
        </div>

        {/* Head-to-Head Advanced Metrics Table */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan-400" />
            Head-to-Head Soccer Metrics Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                  <th className="py-2 px-3 text-cyan-400">{player1.commonName}</th>
                  <th className="py-2 px-3 text-center text-slate-300 font-semibold uppercase">Advanced Soccer Metric</th>
                  <th className="py-2 px-3 text-right text-amber-400">{player2.commonName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {[
                  {
                    name: 'Expected Goals (xG)',
                    v1: player1.stats.xG.toFixed(1),
                    v2: player2.stats.xG.toFixed(1),
                    diff: (player1.stats.xG - player2.stats.xG).toFixed(1),
                  },
                  {
                    name: 'Goals Scored',
                    v1: player1.stats.goals,
                    v2: player2.stats.goals,
                    diff: player1.stats.goals - player2.stats.goals,
                  },
                  {
                    name: 'Expected Assists (xA)',
                    v1: player1.stats.xA.toFixed(1),
                    v2: player2.stats.xA.toFixed(1),
                    diff: (player1.stats.xA - player2.stats.xA).toFixed(1),
                  },
                  {
                    name: 'Progressive Passes (PrgP)',
                    v1: player1.stats.prgP,
                    v2: player2.stats.prgP,
                    diff: player1.stats.prgP - player2.stats.prgP,
                  },
                  {
                    name: 'Progressive Carries (PrgC)',
                    v1: player1.stats.prgC,
                    v2: player2.stats.prgC,
                    diff: player1.stats.prgC - player2.stats.prgC,
                  },
                  {
                    name: 'Possession Threat Value (xT / PV)',
                    v1: player1.stats.pv.toFixed(2),
                    v2: player2.stats.pv.toFixed(2),
                    diff: (player1.stats.pv - player2.stats.pv).toFixed(2),
                  },
                  {
                    name: 'Pressing Index (PPDA)',
                    v1: player1.stats.ppda.toFixed(1),
                    v2: player2.stats.ppda.toFixed(1),
                    diff: (player2.stats.ppda - player1.stats.ppda).toFixed(1), // lower is better
                  },
                  {
                    name: 'Ground & Aerial Duel Win %',
                    v1: `${player1.stats.duelWinPct.toFixed(0)}%`,
                    v2: `${player2.stats.duelWinPct.toFixed(0)}%`,
                    diff: `${(player1.stats.duelWinPct - player2.stats.duelWinPct).toFixed(0)}%`,
                  },
                ].map((row, i) => {
                  const numDiff = parseFloat(String(row.diff));
                  return (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 px-3 font-bold text-cyan-300">
                        {row.v1}
                        {numDiff > 0 && (
                          <span className="ml-2 text-[10px] text-emerald-400 font-semibold">
                            (+{row.diff})
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-400">{row.name}</td>
                      <td className="py-2 px-3 text-right font-bold text-amber-300">
                        {numDiff < 0 && (
                          <span className="mr-2 text-[10px] text-emerald-400 font-semibold">
                            (+{Math.abs(numDiff)})
                          </span>
                        )}
                        {row.v2}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm tracking-wider uppercase hover:opacity-95 transition-opacity cursor-pointer shadow-lg"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
};
