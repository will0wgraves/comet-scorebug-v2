import { FootballState } from '../types';
import { resolveTeamLogo } from '../data/teamLogos';

export const INITIAL_FOOTBALL_STATE: FootballState = {
  visible: true,
  awayTeam: 'SYR',
  awayScore: 0,
  awayTimeouts: 3,
  awayGradients: ['#ff8103', '#0e77c6'],
  awayAccent: '#ce3907',
  awayLogoUrl: resolveTeamLogo('SYR'),

  homeTeam: 'SD',
  homeScore: 0,
  homeTimeouts: 3,
  homeGradients: ['#1e6eb6', '#fcb511'],
  homeAccent: '#e4e6de',
  homeLogoUrl: resolveTeamLogo('SD'),

  possession: 'away',
  quarter: '1ST',
  clock: '14:25',
  status: '2ND & 6',
  playClock: ':25',
  flagActive: false,
  redZone: false,
  touchdownActive: false,
  touchdownTeam: '',
  goalActive: false,
  goalTeam: '',
  celebrationText: 'TOUCHDOWN!',
  autoGoalSwipe: true,
  logoScale: 1.08,
  lastUpdated: Date.now()
};

const STORAGE_KEY = 'comet_lfg_football_state';
const BROADCAST_CHANNEL_NAME = 'comet_scorebug_sync_channel';

class StateSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(state: FootballState) => void> = new Set();
  private currentState: FootballState = INITIAL_FOOTBALL_STATE;
  private sseSource: EventSource | null = null;

  constructor() {
    // Load cached state if available
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.currentState = {
          ...INITIAL_FOOTBALL_STATE,
          ...parsed,
          awayLogoUrl: resolveTeamLogo(parsed.awayTeam || 'DET', parsed.awayLogoUrl),
          homeLogoUrl: resolveTeamLogo(parsed.homeTeam || 'SF', parsed.homeLogoUrl)
        };
      }
    } catch (_) {}

    // Init BroadcastChannel for 0ms cross-tab sync (e.g. Control Room tab <-> OBS Browser Source)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'STATE_UPDATE') {
            this.handleIncomingState(event.data.state, false);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not available', err);
      }
    }

    // Init SSE connection for server updates (e.g. from external Lua scripts posting to /api/state)
    this.initSSE();
  }

  private initSSE() {
    if (typeof window === 'undefined') return;
    try {
      this.sseSource = new EventSource('/api/events');
      this.sseSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed) {
            this.handleIncomingState(parsed, false);
          }
        } catch (_) {}
      };
      this.sseSource.onerror = () => {
        // Will auto reconnect
      };
    } catch (_) {}
  }

  public getState(): FootballState {
    return this.currentState;
  }

  public subscribe(callback: (state: FootballState) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentState);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public updateState(partial: Partial<FootballState>, notifyServer = true) {
    const newState: FootballState = {
      ...this.currentState,
      ...partial,
      lastUpdated: Date.now()
    };
    this.handleIncomingState(newState, true, notifyServer);
  }

  private handleIncomingState(state: FootballState, broadcastLocally = true, notifyServer = false) {
    this.currentState = state;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}

    // Broadcast across tabs
    if (broadcastLocally && this.channel) {
      try {
        this.channel.postMessage({ type: 'STATE_UPDATE', state });
      } catch (_) {}
    }

    // Push to server so any other client / OBS source gets it
    if (notifyServer) {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      }).catch(() => {});
    }

    // Notify local subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentState);
      } catch (_) {}
    });
  }
}

export const stateSync = new StateSyncService();
