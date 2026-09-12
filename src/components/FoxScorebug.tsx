import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FootballState } from '../types';
import { SlotMachineScore } from './SlotMachineScore';
import { resolveTeamLogo, generateGenericTeamLogo } from '../data/teamLogos';

interface FoxScorebugProps {
  state: FootballState;
  scale?: number;
  spinKeyAway?: number;
  spinKeyHome?: number;
}

export function formatImagePath(pathStr: string): string {
  if (!pathStr) return '';
  // If it's already a data URL or http(s) URL, return as is
  if (pathStr.startsWith('data:') || pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
    return pathStr;
  }
  // If it's a Windows path like C:\Users\... or C:/Users/...
  if (/^[a-zA-Z]:[\\\/]/.test(pathStr)) {
    return 'file:///' + pathStr.replace(/\\/g, '/');
  }
  return pathStr;
}

export const FoxScorebug: React.FC<FoxScorebugProps> = ({
  state,
  scale = 1,
  spinKeyAway = 0,
  spinKeyHome = 0
}) => {
  const {
    visible = true,
    awayTeam = 'DET',
    awayScore = 0,
    awayTimeouts = 3,
    awayGradients = ['#0076B6', '#041E42'],
    awayAccent = '#0076B6',
    awayLogoUrl = '',
    homeTeam = 'SF',
    homeScore = 0,
    homeTimeouts = 3,
    homeGradients = ['#AA0000', '#4B0000'],
    homeAccent = '#B3995D',
    homeLogoUrl = '',
    possession = 'away',
    quarter = '1ST',
    clock = '14:25',
    status = '2ND & 6',
    playClock = ':25',
    flagActive = false,
    redZone = false,
    touchdownActive = false,
    touchdownTeam = ''
  } = state;

  if (!visible) return null;

  // Resolve team logos - ensures official visual graphic logo is always displayed, never raw text abbreviation
  const resolvedAwayLogo = resolveTeamLogo(awayTeam, awayLogoUrl, awayAccent || awayGradients[0]);
  const resolvedHomeLogo = resolveTeamLogo(homeTeam, homeLogoUrl, homeAccent || homeGradients[0]);

  // Check play clock warning status
  const cleanPlayClock = (playClock || '').replace(':', '').trim();
  const playClockNum = parseInt(cleanPlayClock, 10);
  const isPlayClockCrit = !isNaN(playClockNum) && playClockNum <= 5;

  // Check if status is a penalty flag
  const isFlag = flagActive || /flag/i.test(status);

  return (
    <div
      id="fox-scorebug-container"
      className="relative select-none pointer-events-none transition-transform duration-200"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.9))'
      }}
    >
      {/* Optional Red Zone Top Pip Alert */}
      {redZone && (
        <div className="flex justify-center mb-[-2px] relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600 text-white font-redhat font-black italic text-[11px] tracking-widest px-4 py-0.5 rounded-t-lg border-t-2 border-red-400 shadow-[0_0_14px_rgba(220,38,38,0.9)] uppercase flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>RED ZONE</span>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          FOX NFL UNIFIED CHASSIS
          - Rounded top corners (16px)
          - 45-degree chamfered bottom corners
          - Chrome metallic outer bevel rim
          - Upper Row: Away Team Pod | Away Score | Home Score | Home Team Pod
          - Lower Row: Away Timeouts | Quarter + Game Clock + Play Clock + Down & Dist | Home Timeouts
          ======================================================== */}
      <div
        className="relative w-[610px] rounded-t-2xl p-[2px] bg-gradient-to-b from-white/90 via-neutral-400 to-neutral-700 shadow-2xl overflow-hidden"
        style={{
          clipPath:
            'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))'
        }}
      >
        {/* Inner Bug Canvas */}
        <div className="relative w-full rounded-t-[14px] bg-neutral-950 overflow-hidden flex flex-col">
          {/* Top Edge Metallic Sheen */}
          <div className="absolute top-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-40 pointer-events-none" />

          {/* ====================================================
              UPPER ROW: TEAMS & SCORES (Height ~60px)
              ==================================================== */}
          <div className="relative flex items-stretch h-[60px] border-b border-neutral-800/90 z-20">
            {/* 1. AWAY TEAM POD (LEFT) - Displays Team Logo */}
            <div
              className="relative flex-1 min-w-0 flex items-center justify-center px-4 overflow-hidden border-r border-black/80"
              style={{
                background: `linear-gradient(135deg, ${awayGradients[0] || '#0076B6'} 0%, ${awayGradients[1] || '#041E42'} 100%)`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.5)'
              }}
            >
              {/* Glossy diagonal glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Away Possession Arrow */}
              {possession === 'away' && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-white filter drop-shadow-[0_0_6px_rgba(255,255,255,0.95)] z-20"
                />
              )}

              {/* Away Team Visual Logo Graphic (No abbreviation text) */}
              <div className={`flex items-center w-full justify-center relative z-10 h-full py-1 ${possession === 'away' ? 'pl-4' : ''}`}>
                <img
                  src={formatImagePath(resolvedAwayLogo)}
                  alt={awayTeam}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = generateGenericTeamLogo(awayTeam, awayAccent || awayGradients[0]);
                  }}
                  className="max-h-[52px] max-w-[145px] w-auto h-auto object-contain filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]"
                />
              </div>
            </div>

            {/* 2. CENTER SCORE POD (AWAY & HOME SCORES) */}
            <div
              className="relative w-[164px] flex items-stretch bg-black border-x-2 border-neutral-700/80 z-20 h-full"
              style={{
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.95), inset 0 -2px 6px rgba(0,0,0,0.8)'
              }}
            >
              {/* Subtle vertical center divider */}
              <div className="absolute top-1.5 bottom-1.5 left-1/2 -translate-x-1/2 w-[1px] bg-neutral-800/90 z-20" />

              {/* Away Score Box - unclipped score display */}
              <div className="flex-1 flex items-center justify-center relative px-2 h-full overflow-visible">
                <div className="font-redhat text-[40px] font-black italic text-white leading-none flex items-center justify-center h-full">
                  <SlotMachineScore
                    score={awayScore}
                    spinKey={spinKeyAway}
                    itemHeight={58}
                    reelWidth={34}
                  />
                </div>
              </div>

              {/* Home Score Box - unclipped score display */}
              <div className="flex-1 flex items-center justify-center relative px-2 h-full overflow-visible">
                <div className="font-redhat text-[40px] font-black italic text-white leading-none flex items-center justify-center h-full">
                  <SlotMachineScore
                    score={homeScore}
                    spinKey={spinKeyHome}
                    itemHeight={58}
                    reelWidth={34}
                  />
                </div>
              </div>
            </div>

            {/* 3. HOME TEAM POD (RIGHT) - Displays Team Logo */}
            <div
              className="relative flex-1 min-w-0 flex items-center justify-center px-4 overflow-hidden border-l border-black/80"
              style={{
                background: `linear-gradient(225deg, ${homeGradients[0] || '#AA0000'} 0%, ${homeGradients[1] || '#4B0000'} 100%)`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.5)'
              }}
            >
              {/* Glossy diagonal glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Home Team Visual Logo Graphic (No abbreviation text) */}
              <div className={`flex items-center w-full justify-center relative z-10 h-full py-1 ${possession === 'home' ? 'pr-4' : ''}`}>
                <img
                  src={formatImagePath(resolvedHomeLogo)}
                  alt={homeTeam}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = generateGenericTeamLogo(homeTeam, homeAccent || homeGradients[0]);
                  }}
                  className="max-h-[52px] max-w-[145px] w-auto h-auto object-contain filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]"
                />
              </div>

              {/* Home Possession Arrow */}
              {possession === 'home' && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[9px] border-r-white filter drop-shadow-[0_0_6px_rgba(255,255,255,0.95)] z-20"
                />
              )}
            </div>
          </div>

          {/* ====================================================
              LOWER ROW: TIMEOUTS, CLOCK, DOWN & DISTANCE (Height ~38px)
              ==================================================== */}
          <div className="relative flex items-center h-[38px] bg-neutral-950 z-20">
            {/* Left Lower Rail: Away Timeout Dashes */}
            <div className="flex-1 flex items-center justify-start pl-6 pr-2 h-full bg-gradient-to-r from-neutral-900/90 via-neutral-950 to-black">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((idx) => {
                  const isAvailable = idx < (awayTimeouts ?? 3);
                  return (
                    <div
                      key={idx}
                      className="h-[5px] w-6 rounded-[1px] transition-all duration-300 shadow-sm"
                      style={{
                        backgroundColor: isAvailable ? awayAccent || '#38bdf8' : '#262626',
                        boxShadow: isAvailable ? `0 0 6px ${awayAccent || '#38bdf8'}` : 'none'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Center Lower Rail: Quarter, Game Clock, Play Clock, Down & Distance */}
            <div
              className="relative w-[300px] h-full flex items-center justify-between px-3.5 bg-black border-x border-neutral-800 z-30"
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)'
              }}
            >
              {/* Left Subgroup: Quarter, Game Clock, Play Clock */}
              <div className="flex items-center gap-2.5 whitespace-nowrap">
                {/* Quarter */}
                <span className="font-redhat font-black italic text-[14px] text-white tracking-wider uppercase drop-shadow pr-0.5 whitespace-nowrap">
                  {quarter || '1ST'}
                </span>

                {/* Game Clock */}
                <span className="font-redhat font-black italic text-[17px] text-white tracking-wider leading-none drop-shadow pr-1 whitespace-nowrap tabular-nums">
                  {clock || '14:25'}
                </span>

                {/* Play Clock Badge */}
                <span
                  className={`font-redhat font-black text-[12px] px-1.5 py-0.5 rounded transition-all leading-none tabular-nums whitespace-nowrap inline-flex items-center justify-center ${
                    isPlayClockCrit
                      ? 'bg-red-600 text-white border border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.95)] animate-pulse'
                      : 'bg-neutral-800 text-neutral-200 border border-neutral-600'
                  }`}
                >
                  {playClock || ':25'}
                </span>
              </div>

              {/* Right Subgroup: Down & Distance or Flag Banner */}
              <div className="flex items-center justify-end flex-1 pl-3 whitespace-nowrap">
                <AnimatePresence mode="wait">
                  {isFlag ? (
                    <motion.div
                      key="flag"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black font-redhat font-black italic text-[13px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.9)] text-center leading-none whitespace-nowrap"
                    >
                      🚩 {status.toUpperCase().includes('FLAG') ? status : 'FLAG'}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-redhat font-black italic text-[15px] text-white tracking-wider uppercase text-right leading-none drop-shadow whitespace-nowrap pr-1"
                    >
                      {status || '2ND & 6'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Lower Rail: Home Timeout Dashes */}
            <div className="flex-1 flex items-center justify-end pr-6 pl-2 h-full bg-gradient-to-l from-neutral-900/90 via-neutral-950 to-black">
              <div className="flex items-center gap-1.5 flex-row-reverse">
                {[0, 1, 2].map((idx) => {
                  const isAvailable = idx < (homeTimeouts ?? 3);
                  return (
                    <div
                      key={idx}
                      className="h-[5px] w-6 rounded-[1px] transition-all duration-300 shadow-sm"
                      style={{
                        backgroundColor: isAvailable ? homeAccent || '#ef4444' : '#262626',
                        boxShadow: isAvailable ? `0 0 6px ${homeAccent || '#ef4444'}` : 'none'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Edge Metallic Chrome Rail */}
          <div className="h-[2.5px] w-full bg-gradient-to-r from-neutral-400 via-white to-neutral-400 opacity-80 pointer-events-none" />
        </div>
      </div>

      {/* Touchdown Marquee Sweep Overlay */}
      <AnimatePresence>
        {touchdownActive && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden rounded-t-2xl shadow-2xl"
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px))',
              background:
                touchdownTeam === 'home'
                  ? `linear-gradient(90deg, ${homeGradients[0]}, #f59e0b, ${homeGradients[1]})`
                  : `linear-gradient(90deg, ${awayGradients[0]}, #f59e0b, ${awayGradients[1]})`
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-pulse" />
            <div className="relative z-10 flex items-center gap-4 text-white font-redhat font-black italic text-3xl tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span>🏈 TOUCHDOWN!</span>
              <span className="text-amber-200">
                {touchdownTeam === 'home' ? homeTeam : awayTeam}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
