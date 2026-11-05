export type Position = 'ST' | 'CF' | 'CAM' | 'RW' | 'LW' | 'CM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';
export type CardTier = 'MLS_ALLSTAR' | 'TOTW' | 'GOLD' | 'RECORD_BREAKER' | 'ICON';

export interface FifaAttributes {
  pac: number; // Pace
  sho: number; // Shooting
  pas: number; // Passing
  dri: number; // Dribbling
  def: number; // Defending
  phy: number; // Physical
}

export interface PlayerStats {
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  xG: number;
  npxG: number;
  xA: number;
  xGOT: number;
  shots: number;
  keyPasses: number;
  prgP: number; // Progressive Passes
  prgC: number; // Progressive Carries
  pv: number;   // Possession Value / Expected Threat (xT)
  ppda: number; // Pressing index (Passes per defensive action)
  aerialWinPct: number;
  duelWinPct: number;
  interceptions: number;
  tacklesWon: number;
  turnovers: number;
  matchRating: number;
}

export interface MLSPlayer {
  id: string;
  name: string;
  commonName: string;
  number: number;
  position: Position;
  teamId: string;
  teamName: string;
  conference: 'Liga MX' | 'Apertura' | 'Clausura' | 'Eastern' | 'Western';
  nationality: string;
  nationCode: string;
  age: number;
  photoUrl: string;
  isAllStar: boolean;
  cardTier: CardTier;
  fifaAttributes: FifaAttributes;
  overallRating: number;
  chemistryWeight: number; // 1.0 to 1.5, boosted if team All-Star
  stats: PlayerStats;
}

export interface AlbumCoverInfo {
  albumTitle: string;
  artistCredit: string;
  trackName: string;
  bpm: number;
  genre: string;
  vinylColor: string;
  releaseYear: number;
  hypeTag: string;
}

export interface MLSTeam {
  id: string;
  name: string;
  shortName: string;
  code: string;
  conference: 'Liga MX' | 'Apertura' | 'Clausura' | 'Eastern' | 'Western';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  stadium: string;
  allStarPlayerId: string;
  formation: '4-3-3' | '4-2-3-1' | '3-5-2' | '4-2-2-2';
  tacticalStyle: string;
  albumCover: AlbumCoverInfo;
  stats: {
    matchesPlayed: number;
    points: number;
    wins?: number;
    draws?: number;
    losses?: number;
    goalsFor?: number;
    goalsAgainst?: number;
    goalDiff: number;
    xGD: number;
    possession: number;
    ppda: number;
    eloRating: number;
    form?: ('W' | 'D' | 'L')[];
  };
}

export type ModelMethod =
  | 'la_liga_custom'
  | 'xg_efficiency'
  | 'possession_value'
  | 'pressing_intensity'
  | 'elo_power';

export interface LaLigaModelWeights {
  name: string;
  technicalPassing: number;     // Weight on PrgP + KeyPasses
  expectedThreatWeight: number; // Weight on PV (xT)
  finishingEfficiency: number;  // Goals vs xG conversion
  pressResistance: number;      // Low turnovers + duelWinPct
  highPressing: number;         // Interceptions + PPDA pressure
  aerialDominance: number;      // Aerial duel win %
}

export interface SimulationResult {
  homeTeam: MLSTeam;
  awayTeam: MLSTeam;
  homePredictedGoals: number;
  awayPredictedGoals: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  homeKeyFactor: string;
  awayKeyFactor: string;
  tacticalClashNote: string;
}

export interface ChemistryConnection {
  fromId: string;
  toId: string;
  strength: 1 | 2 | 3; // 1: Bronze/Red, 2: Silver/Orange, 3: Gold/Green
  synergyReason: string;
  boostMultiplier: number;
}
