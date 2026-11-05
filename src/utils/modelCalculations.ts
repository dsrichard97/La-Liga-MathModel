import { MLSPlayer, MLSTeam, ModelMethod, LaLigaModelWeights, SimulationResult } from '../types/soccer';

/**
 * Calculates a 0-100 rating for a player based on the selected model method.
 */
export function calculatePlayerModelScore(
  player: MLSPlayer,
  method: ModelMethod,
  laLigaWeights: LaLigaModelWeights
): { score: number; rankText: string; highlightMetric: string } {
  const { stats, fifaAttributes } = player;

  if (method === 'la_liga_custom') {
    // Normalizing each metric
    const passScore = Math.min(100, (stats.prgP / 3.0) + (stats.keyPasses * 0.8));
    const threatScore = Math.min(100, stats.pv * 105);
    const finishScore = Math.min(100, (stats.goals / Math.max(1, stats.xG)) * 75 + (stats.goals * 1.5));
    const pressResist = Math.min(100, stats.duelWinPct * 0.85 + (100 - (stats.turnovers / Math.max(1, stats.appearances)) * 12));
    const highPress = Math.min(100, (stats.interceptions * 1.8) + (100 - stats.ppda * 4));
    const aerialScore = Math.min(100, stats.aerialWinPct * 1.25);

    const totalWeight =
      laLigaWeights.technicalPassing +
      laLigaWeights.expectedThreatWeight +
      laLigaWeights.finishingEfficiency +
      laLigaWeights.pressResistance +
      laLigaWeights.highPressing +
      laLigaWeights.aerialDominance;

    const weightedScore =
      (passScore * laLigaWeights.technicalPassing +
        threatScore * laLigaWeights.expectedThreatWeight +
        finishScore * laLigaWeights.finishingEfficiency +
        pressResist * laLigaWeights.pressResistance +
        highPress * laLigaWeights.highPressing +
        aerialScore * laLigaWeights.aerialDominance) /
      Math.max(1, totalWeight);

    const finalScore = Math.round(Math.min(99, Math.max(65, weightedScore)));
    return {
      score: finalScore,
      rankText: `La Liga Index: ${finalScore}`,
      highlightMetric: `xT ${stats.pv.toFixed(2)} | PrgP ${stats.prgP}`,
    };
  }

  if (method === 'xg_efficiency') {
    const raw = (stats.goals / Math.max(0.5, stats.xG)) * 70 + (stats.xGOT * 1.2);
    const score = Math.round(Math.min(99, Math.max(60, raw)));
    return {
      score,
      rankText: `Finishing Ratio: +${(stats.goals - stats.xG).toFixed(1)} xG`,
      highlightMetric: `${stats.goals} G from ${stats.xG.toFixed(1)} xG`,
    };
  }

  if (method === 'possession_value') {
    const raw = (stats.pv * 85) + (stats.prgC * 0.12) + (fifaAttributes.dri * 0.2);
    const score = Math.round(Math.min(99, Math.max(62, raw)));
    return {
      score,
      rankText: `Possession Threat: ${(stats.pv * 100).toFixed(0)} PV`,
      highlightMetric: `${stats.prgP} PrgP | ${stats.prgC} PrgC`,
    };
  }

  if (method === 'pressing_intensity') {
    const raw = (stats.interceptions * 1.4) + (stats.tacklesWon * 1.2) + (stats.duelWinPct * 0.45);
    const score = Math.round(Math.min(99, Math.max(58, raw)));
    return {
      score,
      rankText: `Press Index: ${(100 - stats.ppda * 3).toFixed(0)}`,
      highlightMetric: `${stats.interceptions} Int | ${stats.tacklesWon} Tkl`,
    };
  }

  // elo_power
  const score = Math.round(player.overallRating * 0.95 + (stats.matchRating * 1.5));
  return {
    score: Math.min(99, score),
    rankText: `Elo Impact Rating: ${score}`,
    highlightMetric: `Rating ${stats.matchRating.toFixed(2)} / 10`,
  };
}

/**
 * Simulates a match between two MLS teams using Poisson expectations modulated
 * by the active La Liga model weights.
 */
export function simulateLaLigaMatch(
  homeTeam: MLSTeam,
  awayTeam: MLSTeam,
  homePlayer: MLSPlayer | undefined,
  awayPlayer: MLSPlayer | undefined,
  weights: LaLigaModelWeights
): SimulationResult {
  // Base xG expectation influenced by model weights
  const homeTech = (homeTeam.stats.possession / 50) * (weights.technicalPassing / 75);
  const awayTech = (awayTeam.stats.possession / 50) * (weights.technicalPassing / 75);

  const homeAllStarBoost = homePlayer?.isAllStar ? (homePlayer.chemistryWeight - 1.0) * 0.8 : 0;
  const awayAllStarBoost = awayPlayer?.isAllStar ? (awayPlayer.chemistryWeight - 1.0) * 0.8 : 0;

  // Expected goals
  const homeBaseLambda = 1.65 * homeTech + homeAllStarBoost + (homeTeam.stats.xGD / 34) * 0.5;
  const awayBaseLambda = 1.35 * awayTech + awayAllStarBoost + (awayTeam.stats.xGD / 34) * 0.5;

  const homeXG = Math.max(0.6, homeBaseLambda);
  const awayXG = Math.max(0.4, awayBaseLambda);

  // Probability calculations
  const totalWeight = homeXG + awayXG + 1.2;
  const homeWinProb = Math.round((homeXG / totalWeight) * 100);
  const awayWinProb = Math.round((awayXG / totalWeight) * 100);
  const drawProb = Math.max(12, 100 - (homeWinProb + awayWinProb));

  const homePredictedGoals = Math.max(0, Math.round(homeXG * (0.85 + Math.random() * 0.3)));
  const awayPredictedGoals = Math.max(0, Math.round(awayXG * (0.85 + Math.random() * 0.3)));

  let clashNote = `${homeTeam.shortName}'s ${homeTeam.tacticalStyle} meets ${awayTeam.shortName}'s ${awayTeam.tacticalStyle}.`;
  if (weights.technicalPassing > 80) {
    clashNote = `Under heavy Spanish build-up weighting, ${homeTeam.shortName}'s progressive passing efficiency gives them tactical control in central zones.`;
  } else if (weights.highPressing > 80) {
    clashNote = `Gegenpress parameters heavily penalize turnover count, rewarding rapid transition turnovers.`;
  }

  return {
    homeTeam,
    awayTeam,
    homePredictedGoals,
    awayPredictedGoals,
    homeWinProb,
    drawProb,
    awayWinProb,
    homeKeyFactor: `${homeTeam.albumCover.artistCredit} anchors final-third threat (xT ${(homePlayer?.stats.pv ?? 0.7).toFixed(2)})`,
    awayKeyFactor: `${awayTeam.albumCover.artistCredit} counter-press leverage (PPDA ${(awayTeam.stats.ppda).toFixed(1)})`,
    tacticalClashNote: clashNote,
  };
}
