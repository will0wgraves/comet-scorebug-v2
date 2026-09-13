import { TeamInfo } from '../types';
import { ALL_LFG_TEAMS } from './lfgColorSheet';
import { generateGenericTeamLogo } from './teamLogos';

export const DEFAULT_LFG_TEAMS: TeamInfo[] = ALL_LFG_TEAMS.map((t) => ({
  name: t.name,
  abbr: t.abbr,
  logoUrl: t.logoUrl || generateGenericTeamLogo(t.abbr, t.gradients[0]),
  gradients: t.gradients,
  accent: t.accent
}));

