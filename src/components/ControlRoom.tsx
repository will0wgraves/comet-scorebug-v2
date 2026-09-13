import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Flame,
  Trophy,
  ArrowLeftRight,
  Plus,
  Trash2,
  Upload,
  Copy,
  ExternalLink,
  Radio,
  Sliders,
  Sparkles,
  Palette,
  Search,
  Check
} from 'lucide-react';
import { FootballState, TeamInfo } from '../types';
import { DEFAULT_LFG_TEAMS } from '../data/defaultTeams';
import { stateSync } from '../services/stateSync';
import { HexImportModal } from './HexImportModal';

interface ControlRoomProps {
  state: FootballState;
  onUpdateState: (partial: Partial<FootballState>) => void;
  onTriggerGoal?: (team: 'away' | 'home') => void;
  onTriggerSpinAway?: () => void;
  onTriggerSpinHome?: () => void;
}

export const ControlRoom: React.FC<ControlRoomProps> = ({
  state,
  onUpdateState,
  onTriggerGoal,
  onTriggerSpinAway,
  onTriggerSpinHome
}) => {
  // Solara Workspace directory handle
  const [dirHandle, setDirHandle] = useState<any>(null);
  const [folderStatus, setFolderStatus] = useState<string>('Not Attached');
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [liveReadData, setLiveReadData] = useState({
    awayScore: '0',
    homeScore: '0',
    clock: '15:00',
    quarter: '1st',
    status: '1ST & 10',
    playClock: ':25'
  });

  // Team Roster
  const [roster, setRoster] = useState<TeamInfo[]>(DEFAULT_LFG_TEAMS);
  const [awaySelectIdx, setAwaySelectIdx] = useState<number>(0);
  const [homeSelectIdx, setHomeSelectIdx] = useState<number>(1);
  const [rosterSaveStatus, setRosterSaveStatus] = useState<string>('Ready');
  const [isHexModalOpen, setIsHexModalOpen] = useState<boolean>(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState<string>('');
  const [quickPasteTeamIdx, setQuickPasteTeamIdx] = useState<number | null>(null);

  // Filtered roster for search
  const filteredRoster = React.useMemo(() => {
    if (!teamSearchQuery.trim()) {
      return roster.map((team, originalIdx) => ({ team, originalIdx }));
    }
    const q = teamSearchQuery.toLowerCase().trim();
    return roster
      .map((team, originalIdx) => ({ team, originalIdx }))
      .filter(
        ({ team }) =>
          team.name.toLowerCase().includes(q) ||
          team.abbr.toLowerCase().includes(q) ||
          team.gradients[0].toLowerCase().includes(q) ||
          team.gradients[1].toLowerCase().includes(q)
      );
  }, [roster, teamSearchQuery]);

  // Quick hex paste directly on a team card
  const handleCardQuickHexPaste = (originalIdx: number, text: string) => {
    const matches = text.match(/#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g) || [];
    if (matches.length > 0) {
      const hexes = matches.map((h) => (h.startsWith('#') ? h : `#${h}`));
      const updated = [...roster];
      updated[originalIdx] = {
        ...updated[originalIdx],
        gradients: [hexes[0], hexes[1] || hexes[0]],
        accent: hexes[2] || hexes[1] || hexes[0]
      };
      saveRoster(updated);
      if (originalIdx === awaySelectIdx || originalIdx === homeSelectIdx) {
        applyMatchup(awaySelectIdx, homeSelectIdx);
      }
    }
  };

  // Clock timer state
  const [isClockRunning, setIsClockRunning] = useState(false);
  const clockIntervalRef = useRef<any>(null);

  // Play clock timer state
  const [isPlayClockRunning, setIsPlayClockRunning] = useState(false);
  const playClockIntervalRef = useRef<any>(null);

  // Load roster from server
  useEffect(() => {
    fetch('/api/roster')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length >= 2) {
          setRoster(data);
          // Match selected teams
          const aIdx = data.findIndex((t: TeamInfo) => t.abbr === state.awayTeam);
          const hIdx = data.findIndex((t: TeamInfo) => t.abbr === state.homeTeam);
          if (aIdx >= 0) setAwaySelectIdx(aIdx);
          if (hIdx >= 0) setHomeSelectIdx(hIdx);
        }
      })
      .catch(() => {
        // Fallback to defaults
      });
  }, []);

  // Save roster to server
  const saveRoster = (newRoster: TeamInfo[]) => {
    setRoster(newRoster);
    setRosterSaveStatus('Saving...');
    fetch('/api/roster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoster)
    })
      .then((res) => res.json())
      .then(() => setRosterSaveStatus('Saved to server ✓'))
      .catch(() => setRosterSaveStatus('Saved locally'));
  };

  // -------------------------------------------------------------
  // SOLARA WORKSPACE FOLDER ATTACHMENT
  // -------------------------------------------------------------
  const handleAttachWorkspace = async () => {
    if (!('showDirectoryPicker' in window)) {
      alert('The File System Access API is not supported in this browser. Please use Google Chrome, Edge, or Brave on Windows/Mac.');
      return;
    }

    try {
      // @ts-ignore
      const handle = await window.showDirectoryPicker();
      setDirHandle(handle);
      setFolderStatus(`Attached: ${handle.name}`);
      setIsReadingFiles(true);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Directory selection failed', err);
        setFolderStatus('Error selecting folder');
      }
    }
  };

  // Read single file helper
  const getFileText = async (handle: any, filename: string): Promise<string | null> => {
    try {
      const fileHandle = await handle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const text = await file.text();
      return text.trim();
    } catch (_) {
      return null;
    }
  };

  // Poll workspace files every 150ms
  useEffect(() => {
    if (!dirHandle) return;

    const interval = setInterval(async () => {
      try {
        const away = await getFileText(dirHandle, 'Away-Score.txt');
        const home = await getFileText(dirHandle, 'Home-Score.txt');
        const clock = await getFileText(dirHandle, 'Clock.txt');
        const qtr = await getFileText(dirHandle, 'Quarter.txt');
        const status = await getFileText(dirHandle, 'Status.txt');
        const pc = await getFileText(dirHandle, 'PlayClock.txt');

        setLiveReadData({
          awayScore: away ?? liveReadData.awayScore,
          homeScore: home ?? liveReadData.homeScore,
          clock: clock ?? liveReadData.clock,
          quarter: qtr ?? liveReadData.quarter,
          status: status ?? liveReadData.status,
          playClock: pc ?? liveReadData.playClock
        });

        const updates: Partial<FootballState> = {};
        if (away !== null && !isNaN(parseInt(away, 10))) {
          const num = parseInt(away, 10);
          if (num !== state.awayScore) updates.awayScore = num;
        }
        if (home !== null && !isNaN(parseInt(home, 10))) {
          const num = parseInt(home, 10);
          if (num !== state.homeScore) updates.homeScore = num;
        }
        if (clock !== null && clock.length > 0 && clock !== state.clock) {
          updates.clock = clock;
        }
        if (qtr !== null && qtr.length > 0 && qtr !== state.quarter) {
          updates.quarter = qtr;
        }
        if (status !== null && status.length > 0 && status !== state.status) {
          updates.status = status;
          if (/flag/i.test(status)) updates.flagActive = true;
        }
        if (pc !== null && pc.length > 0 && pc !== state.playClock) {
          updates.playClock = pc;
        }

        if (Object.keys(updates).length > 0) {
          onUpdateState(updates);
        }
      } catch (e) {
        console.error('Error reading workspace files', e);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [dirHandle, state, liveReadData, onUpdateState]);

  // -------------------------------------------------------------
  // MATCHUP APPLIER
  // -------------------------------------------------------------
  const applyMatchup = (awayIdx = awaySelectIdx, homeIdx = homeSelectIdx) => {
    const away = roster[awayIdx];
    const home = roster[homeIdx];
    if (!away || !home) return;

    onUpdateState({
      awayTeam: away.abbr,
      awayLogoUrl: away.logoUrl || '',
      awayGradients: away.gradients,
      awayAccent: away.accent || '#38bdf8',

      homeTeam: home.abbr,
      homeLogoUrl: home.logoUrl || '',
      homeGradients: home.gradients,
      homeAccent: home.accent || '#ef4444'
    });
  };

  const handleSwapTeams = () => {
    const prevA = awaySelectIdx;
    const prevH = homeSelectIdx;
    setAwaySelectIdx(prevH);
    setHomeSelectIdx(prevA);
    applyMatchup(prevH, prevA);
  };

  // -------------------------------------------------------------
  // INTERNAL CLOCK TIMER
  // -------------------------------------------------------------
  useEffect(() => {
    if (isClockRunning) {
      clockIntervalRef.current = setInterval(() => {
        onUpdateState((prev: any) => {
          const currentClock = state.clock || '15:00';
          const parts = currentClock.split(':');
          let minutes = parseInt(parts[0], 10) || 0;
          let seconds = parseInt(parts[1], 10) || 0;

          let totalSec = minutes * 60 + seconds;
          if (totalSec > 0) {
            totalSec -= 1;
            const newMin = Math.floor(totalSec / 60);
            const newSec = totalSec % 60;
            const formatted = `${newMin}:${newSec < 10 ? '0' : ''}${newSec}`;
            return { clock: formatted };
          } else {
            setIsClockRunning(false);
            return { clock: '0:00' };
          }
        });
      }, 1000);
    } else {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
    }
    return () => {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
    };
  }, [isClockRunning, state.clock, onUpdateState]);

  // -------------------------------------------------------------
  // PLAY CLOCK TIMER
  // -------------------------------------------------------------
  useEffect(() => {
    if (isPlayClockRunning) {
      playClockIntervalRef.current = setInterval(() => {
        const pcStr = (state.playClock || ':25').replace(':', '').trim();
        let pcNum = parseInt(pcStr, 10);
        if (!isNaN(pcNum) && pcNum > 0) {
          pcNum -= 1;
          onUpdateState({ playClock: `:${pcNum < 10 ? '0' : ''}${pcNum}` });
        } else {
          setIsPlayClockRunning(false);
          onUpdateState({ playClock: ':00' });
        }
      }, 1000);
    } else {
      if (playClockIntervalRef.current) clearInterval(playClockIntervalRef.current);
    }
    return () => {
      if (playClockIntervalRef.current) clearInterval(playClockIntervalRef.current);
    };
  }, [isPlayClockRunning, state.playClock, onUpdateState]);

  // Helper for TUDN Liga MX Goal Gradient Swipe trigger
  const triggerGoalCelebration = (team: 'away' | 'home', scoreIncrement?: number) => {
    if (scoreIncrement && scoreIncrement > 0) {
      if (team === 'away') {
        onUpdateState({ awayScore: state.awayScore + scoreIncrement });
      } else {
        onUpdateState({ homeScore: state.homeScore + scoreIncrement });
      }
    }
    if (onTriggerGoal) {
      onTriggerGoal(team);
    } else {
      onUpdateState({
        goalActive: true,
        goalTeam: team,
        touchdownActive: false
      });
      setTimeout(() => {
        onUpdateState({ goalActive: false, goalTeam: '' });
      }, 3800);
    }
  };

  // Helper for Touchdown trigger (uses goal celebration swipe)
  const triggerTouchdown = (team: 'away' | 'home') => {
    triggerGoalCelebration(team, 6);
  };

  // Helper to handle local logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, teamIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = [...roster];
      updated[teamIdx] = {
        ...updated[teamIdx],
        logoUrl: dataUrl
      };
      saveRoster(updated);
      if (teamIdx === awaySelectIdx || teamIdx === homeSelectIdx) {
        applyMatchup(awaySelectIdx, homeSelectIdx);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 text-slate-100 font-redhat pb-16">
      {/* 1. TOP STATUS & SOLARA SYNC BANNER */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl font-black text-amber-400 uppercase tracking-wide">
                Solara Workspace Lua Bridge
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Attach your <code className="text-amber-300 font-bold">...\Solara\workspace</code> folder.
              The Roblox Lua script continuously updates the 6 game text files, which auto-spins the scorebug in real-time!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAttachWorkspace}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <Folder className="w-4 h-4" />
              <span>{dirHandle ? 'CHANGE FOLDER' : 'ATTACH SOLARA WORKSPACE'}</span>
            </button>
          </div>
        </div>

        {/* Folder Sync Status Display */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Status:</span>
            <span
              className={`font-redhat font-bold ${
                dirHandle ? 'text-emerald-400' : 'text-slate-400 italic'
              }`}
            >
              {folderStatus}
            </span>
          </div>

          {dirHandle && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Polling active files every 150ms</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. LIVE FILE DATA MONITOR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Live Lua Workspace File Feed
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-bold">Updates immediately on file save</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-400 font-bold">Away-Score.txt</div>
            <div className="text-2xl font-black text-sky-400 font-redhat mt-1">
              {liveReadData.awayScore}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-400 font-bold">Home-Score.txt</div>
            <div className="text-2xl font-black text-rose-400 font-redhat mt-1">
              {liveReadData.homeScore}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-400 font-bold">Clock.txt</div>
            <div className="text-2xl font-black text-amber-400 font-redhat mt-1">
              {liveReadData.clock}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-400 font-bold">Quarter.txt</div>
            <div className="text-2xl font-black text-slate-200 font-redhat mt-1">
              {liveReadData.quarter}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-400 font-bold">PlayClock.txt</div>
            <div className="text-2xl font-black text-amber-400 font-redhat mt-1">
              {liveReadData.playClock}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-400 font-bold">Status.txt</div>
            <div className="text-sm font-black text-white font-redhat mt-2 truncate">
              {liveReadData.status}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BROADCAST OPERATOR CONTROL PADS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AWAY TEAM CONTROLS */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.awayGradients[0] }} />
              <h3 className="font-black text-lg text-sky-400">
                AWAY: {state.awayTeam} ({state.awayScore})
              </h3>
            </div>
            <button
              onClick={() => onUpdateState({ possession: state.possession === 'away' ? 'none' : 'away' })}
              className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                state.possession === 'away'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🏈 {state.possession === 'away' ? 'HAS BALL' : 'SET BALL'}
            </button>
          </div>

          {/* Quick Score Increments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Score Controls</span>
              <span className="text-[10px] text-sky-400 font-black">TOUCHDOWN SWIPE</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                onClick={() => triggerGoalCelebration('away', 6)}
                className="bg-emerald-600/30 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-black py-2 rounded-lg text-sm transition-all border border-emerald-500/40 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-95"
                title="Score +6 & Trigger Touchdown Swipe"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>+6 TD</span>
              </button>
              <button
                onClick={() => {
                  onUpdateState({ awayScore: state.awayScore + 3 });
                }}
                className="bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                +3 FG
              </button>
              <button
                onClick={() => {
                  onUpdateState({ awayScore: state.awayScore + 2 });
                }}
                className="bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                +2 2PT
              </button>
              <button
                onClick={() => {
                  onUpdateState({ awayScore: state.awayScore + 1 });
                }}
                className="bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                +1 XP
              </button>
              <button
                onClick={() => {
                  onUpdateState({ awayScore: Math.max(0, state.awayScore - 1) });
                }}
                className="bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                -1
              </button>
              <button
                onClick={() => triggerGoalCelebration('away')}
                className="bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-black py-2 rounded-lg text-xs transition-all border border-amber-500/40 flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Trigger Touchdown Gradient Swipe"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>SWIPE</span>
              </button>
            </div>

            {/* Timeouts and Goal / Touchdown banner */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">Timeouts:</span>
                {[3, 2, 1, 0].map((to) => (
                  <button
                    key={to}
                    onClick={() => onUpdateState({ awayTimeouts: to })}
                    className={`w-7 h-7 text-xs font-black rounded-md border transition-all cursor-pointer ${
                      state.awayTimeouts === to
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {to}
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerGoalCelebration('away')}
                className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-black py-2 px-3.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>TOUCHDOWN!</span>
              </button>
            </div>
          </div>
        </div>

        {/* HOME TEAM CONTROLS */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.homeGradients[0] }} />
              <h3 className="font-black text-lg text-rose-400">
                HOME: {state.homeTeam} ({state.homeScore})
              </h3>
            </div>
            <button
              onClick={() => onUpdateState({ possession: state.possession === 'home' ? 'none' : 'home' })}
              className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                state.possession === 'home'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🏈 {state.possession === 'home' ? 'HAS BALL' : 'SET BALL'}
            </button>
          </div>

          {/* Quick Score Increments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Score Controls</span>
              <span className="text-[10px] text-rose-400 font-black">TOUCHDOWN SWIPE</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                onClick={() => triggerGoalCelebration('home', 6)}
                className="bg-emerald-600/30 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-black py-2 rounded-lg text-sm transition-all border border-emerald-500/40 flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-95"
                title="Score +6 & Trigger Touchdown Swipe"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>+6 TD</span>
              </button>
              <button
                onClick={() => {
                  onUpdateState({ homeScore: state.homeScore + 3 });
                }}
                className="bg-slate-800 hover:bg-rose-500 text-slate-200 hover:text-slate-950 font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                +3 FG
              </button>
              <button
                onClick={() => {
                  onUpdateState({ homeScore: state.homeScore + 2 });
                }}
                className="bg-slate-800 hover:bg-rose-500 text-slate-200 hover:text-slate-950 font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                +2 2PT
              </button>
              <button
                onClick={() => {
                  onUpdateState({ homeScore: state.homeScore + 1 });
                }}
                className="bg-slate-800 hover:bg-rose-500 text-slate-200 hover:text-slate-950 font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                +1 XP
              </button>
              <button
                onClick={() => {
                  onUpdateState({ homeScore: Math.max(0, state.homeScore - 1) });
                }}
                className="bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white font-bold py-2 rounded-lg text-sm transition-all border border-slate-700 cursor-pointer active:scale-95"
              >
                -1
              </button>
              <button
                onClick={() => triggerGoalCelebration('home')}
                className="bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-black py-2 rounded-lg text-xs transition-all border border-amber-500/40 flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Trigger Touchdown Gradient Swipe"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>SWIPE</span>
              </button>
            </div>

            {/* Timeouts and Goal / Touchdown banner */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">Timeouts:</span>
                {[3, 2, 1, 0].map((to) => (
                  <button
                    key={to}
                    onClick={() => onUpdateState({ homeTimeouts: to })}
                    className={`w-7 h-7 text-xs font-black rounded-md border transition-all cursor-pointer ${
                      state.homeTimeouts === to
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {to}
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerGoalCelebration('home')}
                className="bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white text-xs font-black py-2 px-3.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>TOUCHDOWN!</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. GAME STATE CONSOLE (DOWN, DISTANCE, CLOCK, FLAGS) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-wide">
              Center Console Controls (Down, Distance & Clocks)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Goal Swipe Toggle */}
            <button
              onClick={() => onUpdateState({ autoGoalSwipe: state.autoGoalSwipe === false ? true : false })}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                state.autoGoalSwipe !== false
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Automatically trigger Touchdown swipe when scores increase"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AUTO SWIPE: {state.autoGoalSwipe !== false ? 'ON' : 'OFF'}</span>
            </button>

            {/* Red Zone Toggle */}
            <button
              onClick={() => onUpdateState({ redZone: !state.redZone })}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                state.redZone
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.8)]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>RED ZONE</span>
            </button>

            {/* Flag on the Play Toggle */}
            <button
              onClick={() => onUpdateState({ flagActive: !state.flagActive })}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                state.flagActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.9)] animate-pulse'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-400'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>FLAG ON PLAY</span>
            </button>
          </div>
        </div>

        {/* Down & Distance Presets & Custom Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Down & Distance:</span>
            <span className="text-white font-redhat font-bold">{state.status}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {['1ST & 10', '2ND & 5', '3RD & 2', '4TH & 1', '1ST & GOAL', '3RD & GOAL'].map((d) => (
              <button
                key={d}
                onClick={() => onUpdateState({ status: d, flagActive: false })}
                className={`py-2 px-3 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                  state.status === d
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={state.status}
              onChange={(e) => onUpdateState({ status: e.target.value })}
              placeholder="Custom down & distance..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold flex-1"
            />
          </div>
        </div>

        {/* Game Clock, Quarter, Play Clock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
          {/* Game Clock */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Game Clock</span>
              <span className="font-redhat text-lg font-black text-amber-400">{state.clock}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsClockRunning(!isClockRunning)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isClockRunning ? 'bg-amber-400 text-slate-950' : 'bg-emerald-600 text-white'
                }`}
              >
                {isClockRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isClockRunning ? 'PAUSE' : 'START'}</span>
              </button>
              <button
                onClick={() => {
                  setIsClockRunning(false);
                  onUpdateState({ clock: '15:00' });
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                title="Reset 15:00"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateState({ clock: '2:00' })}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg cursor-pointer"
              >
                2:00
              </button>
            </div>
          </div>

          {/* Quarter Selector */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400">Quarter / Period</span>
            <div className="grid grid-cols-4 gap-1.5">
              {['1st', '2nd', '3rd', '4th', 'OT', 'HALF', 'FINAL'].map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateState({ quarter: q })}
                  className={`py-1 text-xs font-black rounded border transition-all cursor-pointer ${
                    state.quarter.toLowerCase() === q.toLowerCase()
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Play Clock */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Play Clock</span>
              {(() => {
                const clean = (state.playClock || '').replace(':', '').trim();
                const num = parseInt(clean, 10);
                const isCrit = !isNaN(num) && num <= 5;
                return (
                  <span
                    className={`font-redhat text-lg font-black transition-colors ${
                      isCrit ? 'text-red-500 animate-pulse' : 'text-white'
                    }`}
                  >
                    {state.playClock}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlayClockRunning(!isPlayClockRunning)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isPlayClockRunning ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {isPlayClockRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayClockRunning ? 'PAUSE' : 'COUNTDOWN'}</span>
              </button>
              <button
                onClick={() => onUpdateState({ playClock: ':25' })}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg cursor-pointer"
                title="Reset to :25"
              >
                :25
              </button>
              <button
                onClick={() => onUpdateState({ playClock: ':40' })}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg cursor-pointer"
                title="Reset to :40"
              >
                :40
              </button>
              <button
                onClick={() => onUpdateState({ playClock: ':05' })}
                className="px-2 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-xs font-black text-red-300 rounded-lg cursor-pointer"
                title="Test 5s Red Warning"
              >
                :05 🚨
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MATCHUP PICKER & TEAM ROSTER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-black text-lg text-sky-400">This Game's Matchup</h3>
            <p className="text-xs text-slate-400">
              Select teams to immediately push their logos, colors, and abbreviations to the broadcast bug.
            </p>
          </div>
          <button
            onClick={handleSwapTeams}
            className="flex items-center gap-1.5 text-xs font-black text-slate-300 bg-slate-800 hover:bg-slate-700 py-2 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>SWAP SIDES</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Away select & preview card */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-sky-400">Away Team</label>
            <select
              value={awaySelectIdx}
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                setAwaySelectIdx(idx);
                applyMatchup(idx, homeSelectIdx);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white font-bold p-3 rounded-xl text-sm"
            >
              {roster.map((team, i) => (
                <option key={i} value={i}>
                  {team.name} ({team.abbr})
                </option>
              ))}
            </select>

            {roster[awaySelectIdx] && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {roster[awaySelectIdx].logoUrl ? (
                    <img src={roster[awaySelectIdx].logoUrl} alt="" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xs font-black text-slate-500">{roster[awaySelectIdx].abbr}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs truncate">{roster[awaySelectIdx].name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {roster[awaySelectIdx].abbr}
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full rounded mt-1.5 shadow-inner border border-white/10"
                    style={{
                      background: `linear-gradient(to right, ${roster[awaySelectIdx].gradients[0]}, ${roster[awaySelectIdx].gradients[1]})`
                    }}
                  />
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                    <span>{roster[awaySelectIdx].gradients[0]}</span>
                    <span>→</span>
                    <span>{roster[awaySelectIdx].gradients[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Home select & preview card */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-400">Home Team</label>
            <select
              value={homeSelectIdx}
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                setHomeSelectIdx(idx);
                applyMatchup(awaySelectIdx, idx);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white font-bold p-3 rounded-xl text-sm"
            >
              {roster.map((team, i) => (
                <option key={i} value={i}>
                  {team.name} ({team.abbr})
                </option>
              ))}
            </select>

            {roster[homeSelectIdx] && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {roster[homeSelectIdx].logoUrl ? (
                    <img src={roster[homeSelectIdx].logoUrl} alt="" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xs font-black text-slate-500">{roster[homeSelectIdx].abbr}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xs truncate">{roster[homeSelectIdx].name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {roster[homeSelectIdx].abbr}
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full rounded mt-1.5 shadow-inner border border-white/10"
                    style={{
                      background: `linear-gradient(to right, ${roster[homeSelectIdx].gradients[0]}, ${roster[homeSelectIdx].gradients[1]})`
                    }}
                  />
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                    <span>{roster[homeSelectIdx].gradients[0]}</span>
                    <span>→</span>
                    <span>{roster[homeSelectIdx].gradients[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logo Size & Box Fill Control */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">Logo Box Fill Scale</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                {Math.round((state.logoScale ?? 1.1) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { label: 'Standard (100%)', scale: 1.0 },
                { label: 'FOX Fill (110%)', scale: 1.1 },
                { label: 'Max (120%)', scale: 1.2 },
                { label: 'Ultra (125%)', scale: 1.25 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => onUpdateState({ logoScale: preset.scale })}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                    Math.abs((state.logoScale ?? 1.1) - preset.scale) < 0.02
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500">80%</span>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.02"
              value={state.logoScale ?? 1.1}
              onChange={(e) => onUpdateState({ logoScale: parseFloat(e.target.value) })}
              className="flex-1 accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[10px] font-mono text-slate-500">130%</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Fills the entire team pod box edge-to-edge while keeping the logo neatly bounded inside (FOX broadcast style).
          </p>
        </div>

        <button
          onClick={() => applyMatchup()}
          className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-3 rounded-xl text-sm shadow-md transition-all active:scale-98 cursor-pointer"
        >
          PUSH TEAM VISUALS TO OVERLAY
        </button>
      </div>

      {/* 6. TEAM ROSTER MANAGER (WITH HEX CODE IMPORT & GRADIENT BUILDER) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-indigo-400">LFG Team Roster Manager</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                {roster.length} Teams
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage team abbreviations, hex gradients, and logo sources. You can import raw color sheets or paste hex codes directly.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">{rosterSaveStatus}</span>

            {/* IMPORT HEX CODES / GRADIENTS BUTTON */}
            <button
              type="button"
              onClick={() => setIsHexModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Palette className="w-4 h-4" />
              <span>IMPORT HEX CODES / GRADIENTS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const newTeam: TeamInfo = {
                  name: 'New Team',
                  abbr: 'NEW',
                  logoUrl: '',
                  gradients: ['#3b82f6', '#1e293b'],
                  accent: '#60a5fa'
                };
                const updated = [newTeam, ...roster];
                saveRoster(updated);
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs py-2 px-3 rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD TEAM</span>
            </button>
          </div>
        </div>

        {/* Quick Search and Info Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={teamSearchQuery}
              onChange={(e) => setTeamSearchQuery(e.target.value)}
              placeholder="Search 120+ LFG teams by name, abbr, or hex..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
            />
            {teamSearchQuery && (
              <button
                onClick={() => setTeamSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>
              Showing <strong className="text-white">{filteredRoster.length}</strong> of {roster.length} teams
            </span>
            <button
              onClick={() => setIsHexModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
            >
              Bulk Import or Export All
            </button>
          </div>
        </div>

        {/* Team List Cards */}
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredRoster.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-400 text-xs">
              No teams match "{teamSearchQuery}". Try another search or{' '}
              <button
                onClick={() => setTeamSearchQuery('')}
                className="text-indigo-400 underline font-bold"
              >
                clear search
              </button>
              .
            </div>
          ) : (
            filteredRoster.map(({ team, originalIdx }) => (
              <div
                key={originalIdx}
                className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl flex flex-col gap-3 shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Logo Preview & Upload */}
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-xs font-black text-slate-500">{team.abbr}</span>
                      )}
                    </div>
                    <label className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold cursor-pointer transition-all">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, originalIdx)}
                      />
                    </label>
                  </div>

                  {/* Team Name */}
                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Team Name</label>
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) => {
                        const updated = [...roster];
                        updated[originalIdx] = { ...updated[originalIdx], name: e.target.value };
                        saveRoster(updated);
                      }}
                      className="bg-slate-900 border border-slate-800 text-white font-bold px-2 py-1.5 rounded-lg text-xs w-full"
                    />
                  </div>

                  {/* Abbreviation */}
                  <div className="md:col-span-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Abbr</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={team.abbr}
                      onChange={(e) => {
                        const updated = [...roster];
                        updated[originalIdx] = { ...updated[originalIdx], abbr: e.target.value.toUpperCase() };
                        saveRoster(updated);
                      }}
                      className="bg-slate-900 border border-slate-800 text-white font-black px-2 py-1.5 rounded-lg text-xs w-full uppercase"
                    />
                  </div>

                  {/* Logo URL / File Path */}
                  <div className="md:col-span-4">
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Logo URL or Path</label>
                    <input
                      type="text"
                      value={team.logoUrl || ''}
                      placeholder="C:\Users\skull\Documents\..."
                      onChange={(e) => {
                        const updated = [...roster];
                        updated[originalIdx] = { ...updated[originalIdx], logoUrl: e.target.value };
                        saveRoster(updated);
                      }}
                      className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1.5 rounded-lg text-xs w-full font-mono"
                    />
                  </div>

                  {/* Delete Team & Quick Set */}
                  <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setAwaySelectIdx(originalIdx);
                        applyMatchup(originalIdx, homeSelectIdx);
                      }}
                      title="Set as Away Team"
                      className={`px-2 py-1 rounded text-[10px] font-black cursor-pointer transition-all ${
                        awaySelectIdx === originalIdx
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      AWAY
                    </button>
                    <button
                      onClick={() => {
                        setHomeSelectIdx(originalIdx);
                        applyMatchup(awaySelectIdx, originalIdx);
                      }}
                      title="Set as Home Team"
                      className={`px-2 py-1 rounded text-[10px] font-black cursor-pointer transition-all ${
                        homeSelectIdx === originalIdx
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      HOME
                    </button>
                    {roster.length > 2 && (
                      <button
                        onClick={() => {
                          const updated = roster.filter((_, i) => i !== originalIdx);
                          saveRoster(updated);
                          if (awaySelectIdx >= updated.length) setAwaySelectIdx(0);
                          if (homeSelectIdx >= updated.length) setHomeSelectIdx(1);
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all ml-1"
                        title="Delete Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* GRADIENTS & HEX IMPORT STRIP FOR THIS TEAM */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-900/40 p-2.5 rounded-lg">
                  {/* Live Gradient Preview Bar */}
                  <div className="sm:col-span-3 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">Gradient Preview:</span>
                    <div
                      className="h-6 w-full rounded-md shadow-inner border border-white/10"
                      style={{
                        background: `linear-gradient(to right, ${team.gradients[0]}, ${team.gradients[1]})`
                      }}
                    />
                  </div>

                  {/* Color 1 (Hex + Picker) */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Color 1 (Primary)</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                      <input
                        type="color"
                        value={team.gradients[0]}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[originalIdx] = {
                            ...updated[originalIdx],
                            gradients: [e.target.value, updated[originalIdx].gradients[1]]
                          };
                          saveRoster(updated);
                        }}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={team.gradients[0]}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = [...roster];
                          updated[originalIdx] = {
                            ...updated[originalIdx],
                            gradients: [val, updated[originalIdx].gradients[1]]
                          };
                          saveRoster(updated);
                        }}
                        className="bg-transparent text-white font-mono text-xs w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Color 2 (Hex + Picker) */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Color 2 (Secondary)</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                      <input
                        type="color"
                        value={team.gradients[1]}
                        onChange={(e) => {
                          const updated = [...roster];
                          updated[originalIdx] = {
                            ...updated[originalIdx],
                            gradients: [updated[originalIdx].gradients[0], e.target.value]
                          };
                          saveRoster(updated);
                        }}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={team.gradients[1]}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = [...roster];
                          updated[originalIdx] = {
                            ...updated[originalIdx],
                            gradients: [updated[originalIdx].gradients[0], val]
                          };
                          saveRoster(updated);
                        }}
                        className="bg-transparent text-white font-mono text-xs w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Quick Inline Hex Paste */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-indigo-300 font-bold mb-0.5">
                      Paste Hex Codes
                    </label>
                    <input
                      type="text"
                      placeholder="Paste #hex1 #hex2..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCardQuickHexPaste(originalIdx, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          handleCardQuickHexPaste(originalIdx, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="bg-indigo-950/40 border border-indigo-800/60 text-white font-mono text-xs px-2 py-1.5 rounded-lg w-full placeholder-indigo-400/60 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hex Import & Color Sheet Modal */}
      <HexImportModal
        isOpen={isHexModalOpen}
        onClose={() => setIsHexModalOpen(false)}
        currentRoster={roster}
        onApplyRoster={(newRoster) => {
          saveRoster(newRoster);
          const aIdx = newRoster.findIndex((t) => t.abbr === state.awayTeam);
          const hIdx = newRoster.findIndex((t) => t.abbr === state.homeTeam);
          if (aIdx >= 0) setAwaySelectIdx(aIdx);
          if (hIdx >= 0) setHomeSelectIdx(hIdx);
        }}
      />

      {/* 7. OBS BROWSER SOURCE SETUP HELPER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wide">
            OBS Studio Browser Source Setup
          </h3>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="font-mono text-slate-300 truncate">
            {typeof window !== 'undefined' ? `${window.location.origin}/?view=overlay` : '/?view=overlay'}
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(`${window.location.origin}/?view=overlay`);
                alert('Copied OBS Overlay URL to clipboard!');
              }
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 px-3 rounded-lg flex-shrink-0 cursor-pointer transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy URL</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-1">
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <span className="font-bold text-slate-200">1. Add Browser Source:</span> Set Width to <span className="text-amber-300 font-mono font-bold">1920</span> and Height to <span className="text-amber-300 font-mono font-bold">1080</span>.
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <span className="font-bold text-slate-200">2. Seamless Background:</span> Overlay mode renders with a 100% transparent alpha channel.
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
            <span className="font-bold text-slate-200">3. Real-Time Sync:</span> State syncs via local BroadcastChannel and SSE without any lag.
          </div>
        </div>
      </div>
    </div>
  );
};
