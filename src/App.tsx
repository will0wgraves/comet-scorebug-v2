import React, { useState, useEffect, useRef } from 'react';
import { FoxScorebug } from './components/FoxScorebug';
import { ControlRoom } from './components/ControlRoom';
import { LuaScriptHelper } from './components/LuaScriptHelper';
import { stateSync, INITIAL_FOOTBALL_STATE } from './services/stateSync';
import { FootballState } from './types';
import {
  Tv,
  Radio,
  Sliders,
  Sparkles,
  ExternalLink,
  Code,
  Eye,
  Minimize2,
  Maximize2
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<FootballState>(INITIAL_FOOTBALL_STATE);
  const [viewMode, setViewMode] = useState<'studio' | 'overlay'>('studio');
  const [showLuaScript, setShowLuaScript] = useState<boolean>(false);
  const [previewScale, setPreviewScale] = useState<number>(1.15);
  const [spinKeyAway, setSpinKeyAway] = useState(0);
  const [spinKeyHome, setSpinKeyHome] = useState(0);

  const prevScoreRef = useRef<{ away: number; home: number }>({
    away: INITIAL_FOOTBALL_STATE.awayScore,
    home: INITIAL_FOOTBALL_STATE.homeScore
  });

  // Check URL query parameters for OBS Browser Source: ?view=overlay or ?overlay=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'overlay' || params.get('overlay') === 'true' || window.location.pathname === '/overlay') {
        setViewMode('overlay');
      }
    }
  }, []);

  // Subscribe to real-time state sync (BroadcastChannel, SSE, localStorage)
  useEffect(() => {
    const unsubscribe = stateSync.subscribe((newState) => {
      // Check if away score changed -> trigger slot machine reel
      if (newState.awayScore !== prevScoreRef.current.away) {
        setSpinKeyAway((prev) => prev + 1);
        prevScoreRef.current.away = newState.awayScore;
      }
      // Check if home score changed -> trigger slot machine reel
      if (newState.homeScore !== prevScoreRef.current.home) {
        setSpinKeyHome((prev) => prev + 1);
        prevScoreRef.current.home = newState.homeScore;
      }

      setGameState(newState);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateState = (partial: Partial<FootballState>) => {
    stateSync.updateState(partial, true);
  };

  const handleTriggerSpinAway = () => {
    setSpinKeyAway((prev) => prev + 1);
  };

  const handleTriggerSpinHome = () => {
    setSpinKeyHome((prev) => prev + 1);
  };

  // -------------------------------------------------------------
  // OBS BROWSER OVERLAY MODE (100% Transparent, Bottom Centered)
  // -------------------------------------------------------------
  if (viewMode === 'overlay') {
    return (
      <div className="fixed inset-0 w-[1920px] h-[1080px] bg-transparent overflow-hidden pointer-events-none select-none">
        {/* FOX Style Scorebug at bottom center */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <FoxScorebug
            state={gameState}
            scale={1.32}
            spinKeyAway={spinKeyAway}
            spinKeyHome={spinKeyHome}
          />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STUDIO CONTROL ROOM & PREVIEW MODE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950">
      {/* Top Application Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-redhat font-black text-xl text-white tracking-wide uppercase">
                comet! <span className="text-sky-400">FOX NFL Scorebug</span>
              </h1>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                LFG Season 56
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold">
              ROBLOX FOOTBALL FUSION 3 • BROADCAST ENGINE
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowLuaScript(!showLuaScript)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showLuaScript
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Lua Crawler</span>
          </button>

          <a
            href="?view=overlay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
            title="Open pure OBS Browser Source Overlay URL"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>OBS Overlay View</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Scorebug Live Broadcast Stage Preview */}
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
          {/* Subtle Football Field Yard lines backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent pointer-events-none" />

          {/* Stage Controls Overlay Header */}
          <div className="absolute top-3 inset-x-6 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wider uppercase text-[10px]">
                LIVE BROADCAST PREVIEW (1:1 FOX REPLICA)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold">Scale:</span>
              <button
                onClick={() => setPreviewScale(Math.max(0.8, previewScale - 0.1))}
                className="w-6 h-6 rounded bg-slate-800 text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-[11px] font-redhat font-bold text-slate-300 w-10 text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale(Math.min(1.5, previewScale + 0.1))}
                className="w-6 h-6 rounded bg-slate-800 text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* The Scorebug rendered live */}
          <div className="pt-4 pb-2">
            <FoxScorebug
              state={gameState}
              scale={previewScale}
              spinKeyAway={spinKeyAway}
              spinKeyHome={spinKeyHome}
            />
          </div>

          {/* Quick slot machine preview trigger buttons below stage */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => {
                handleUpdateState({ awayScore: gameState.awayScore + 7 });
                handleTriggerSpinAway();
              }}
              className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold rounded-lg border border-sky-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Away Spin (+7)</span>
            </button>
            <button
              onClick={() => {
                handleUpdateState({ homeScore: gameState.homeScore + 7 });
                handleTriggerSpinHome();
              }}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Home Spin (+7)</span>
            </button>
          </div>
        </div>

        {/* Lua Script Helper (Collapsible or Open) */}
        {showLuaScript && (
          <div className="transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <LuaScriptHelper />
          </div>
        )}

        {/* Full Control Room (Workspace Folder Sync + Operator Pads + Team Roster) */}
        <ControlRoom
          state={gameState}
          onUpdateState={handleUpdateState}
          onTriggerSpinAway={handleTriggerSpinAway}
          onTriggerSpinHome={handleTriggerSpinHome}
        />
      </main>
    </div>
  );
}
