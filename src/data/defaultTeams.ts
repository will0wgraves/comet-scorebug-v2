import { TeamInfo } from '../types';
import { BUILT_IN_TEAMS } from './teamLogos';

export const DEFAULT_LFG_TEAMS: TeamInfo[] = BUILT_IN_TEAMS.map((t) => ({
  name: t.name,
  abbr: t.abbr,
  logoUrl: t.logoUrl,
  gradients: t.gradients,
  accent: t.accent
}));
