export interface TeamInfo {
  name: string;
  abbr: string;
  logoUrl?: string;
  gradients: [string, string];
  accent?: string;
}

export interface FootballState {
  visible: boolean;
  awayTeam: string;
  awayScore: number;
  awayTimeouts: number;
  awayGradients: [string, string];
  awayAccent?: string;
  awayLogoUrl: string;

  homeTeam: string;
  homeScore: number;
  homeTimeouts: number;
  homeGradients: [string, string];
  homeAccent?: string;
  homeLogoUrl: string;

  possession: 'away' | 'home' | 'none';
  quarter: string;
  clock: string;
  status: string; // e.g. "1ST & 10", "3RD & 4", "FLAG"
  playClock: string; // e.g. ":25"
  flagActive: boolean;
  redZone?: boolean;
  touchdownActive?: boolean;
  touchdownTeam?: string; // 'away' | 'home' | ''
  goalActive?: boolean;
  goalTeam?: 'away' | 'home' | '';
  celebrationText?: string; // e.g. "TOUCHDOWN!"
  autoGoalSwipe?: boolean; // trigger swipe on score increment (default true)
  logoScale?: number; // scale multiplier to fill box (default: 1.08)
  lastUpdated?: number;
}

export interface SolaraWorkspaceFiles {
  awayScore: string | null;
  homeScore: string | null;
  clock: string | null;
  quarter: string | null;
  status: string | null;
  playClock: string | null;
  lastReadTime: number;
}
