import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enable CORS for all API endpoints so OBS / external scripts can interact without blocks
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const TEAMS_FILE = path.join(process.cwd(), "teams.json");

const DEFAULT_TEAMS = [
  {
    name: "Comet Huskies",
    abbr: "HSK",
    logoUrl: "",
    gradients: ["#1e40af", "#0f172a"],
    accent: "#60a5fa"
  },
  {
    name: "Viper Cadets",
    abbr: "VIP",
    logoUrl: "",
    gradients: ["#b91c1c", "#450a0a"],
    accent: "#f87171"
  },
  {
    name: "Thunder Wolves",
    abbr: "WLV",
    logoUrl: "",
    gradients: ["#0284c7", "#082f49"],
    accent: "#38bdf8"
  },
  {
    name: "Solar Flares",
    abbr: "SLR",
    logoUrl: "",
    gradients: ["#ea580c", "#431407"],
    accent: "#fb923c"
  },
  {
    name: "Phantom Reapers",
    abbr: "RPR",
    logoUrl: "",
    gradients: ["#7c3aed", "#2e1065"],
    accent: "#c084fc"
  },
  {
    name: "Emerald Titans",
    abbr: "TTN",
    logoUrl: "",
    gradients: ["#059669", "#064e3b"],
    accent: "#34d399"
  }
];

function readTeamsFile() {
  try {
    if (fs.existsSync(TEAMS_FILE)) {
      const raw = fs.readFileSync(TEAMS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return DEFAULT_TEAMS;
}

function writeTeamsFile(teams: any) {
  fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2), "utf8");
}

const DET_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 110"><defs><filter id="lionShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="%23000000" flood-opacity="0.6"/></filter></defs><g filter="url(%23lionShadow)"><path d="M22,76 C32,62 44,52 60,52 C76,52 82,40 92,26 C98,16 110,12 122,18 C134,24 140,36 136,46 C132,56 146,58 162,56 C170,54 180,60 182,66 C184,72 176,78 160,82 C142,86 132,76 120,76 C108,76 102,86 86,88 C68,90 48,92 26,82 Z" fill="%23ffffff" stroke="%23B0B7BC" stroke-width="3"/><path d="M66,45 C78,36 98,32 114,40 C104,50 90,56 74,56 Z" fill="%230076B6"/><circle cx="118" cy="28" r="3.5" fill="%230076B6"/><path d="M136,48 C144,48 152,50 160,48 C158,54 150,56 142,56 Z" fill="%230076B6"/><path d="M52,66 C68,64 88,68 100,74 C86,76 68,76 52,72 Z" fill="%230076B6"/></g></svg>`;

const SF_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><defs><filter id="sfShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="%23000000" flood-opacity="0.7"/></filter></defs><g filter="url(%23sfShadow)"><ellipse cx="100" cy="60" rx="90" ry="52" fill="%23AA0000" stroke="%23B3995D" stroke-width="6"/><ellipse cx="100" cy="60" rx="82" ry="44" fill="none" stroke="%23000000" stroke-width="2.5"/><ellipse cx="100" cy="60" rx="79" ry="41" fill="none" stroke="%23ffffff" stroke-width="3"/><text x="100" y="75" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-style="italic" font-weight="900" fill="%23ffffff" stroke="%23000000" stroke-width="1.8" text-anchor="middle" letter-spacing="-2">SF</text></g></svg>`;

const initialTeams = readTeamsFile();
const defaultAway = initialTeams.find((t: any) => t.abbr === "SYR") || initialTeams[0];
const defaultHome = initialTeams.find((t: any) => t.abbr === "SD") || initialTeams[1] || initialTeams[0];

let currentState = {
  visible: true,
  awayTeam: defaultAway ? defaultAway.abbr : "SYR",
  awayScore: 0,
  awayTimeouts: 3,
  awayGradients: defaultAway ? defaultAway.gradients : ["#ff8103", "#0e77c6"],
  awayAccent: defaultAway ? defaultAway.accent : "#ce3907",
  awayLogoUrl: defaultAway ? defaultAway.logoUrl : "",
  homeTeam: defaultHome ? defaultHome.abbr : "SD",
  homeScore: 0,
  homeTimeouts: 3,
  homeGradients: defaultHome ? defaultHome.gradients : ["#1e6eb6", "#fcb511"],
  homeAccent: defaultHome ? defaultHome.accent : "#e4e6de",
  homeLogoUrl: defaultHome ? defaultHome.logoUrl : "",
  possession: "away", // 'away' | 'home' | 'none'
  quarter: "1ST",
  clock: "14:25",
  status: "2ND & 6",
  playClock: ":25",
  flagActive: false,
  redZone: false,
  touchdownActive: false,
  touchdownTeam: "",
  goalActive: false,
  goalTeam: "",
  celebrationText: "TOUCHDOWN!",
  autoGoalSwipe: true,
  logoScale: 1.08,
  lastUpdated: Date.now()
};

// SSE subscribers for instant push to OBS Overlays
type ClientResponse = express.Response;
const sseClients: Set<ClientResponse> = new Set();

function broadcastState() {
  const payload = `data: ${JSON.stringify(currentState)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (_) {
      sseClients.delete(client);
    }
  }
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 2. Get current scorebug state
app.get("/api/state", (_req, res) => {
  res.json({ ok: true, state: currentState });
});

// Compatibility endpoint for old /state or /state.json
app.get(["/state", "/state.json"], (_req, res) => {
  res.json({ type: "INIT_STATE", state: { football: currentState } });
});

// 3. Post state update (from Control Room, Lua script, or external automation)
app.post("/api/state", (req, res) => {
  try {
    const update = req.body.state ? req.body.state : req.body;
    // Handle both wrapped { football: {...} } and direct fields
    const data = update.football ? update.football : update;

    currentState = {
      ...currentState,
      ...data,
      lastUpdated: Date.now()
    };

    broadcastState();
    res.json({ ok: true, state: currentState });
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// 4. SSE endpoint for instant live streaming overlay sync
app.get("/api/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  // Send initial state
  res.write(`data: ${JSON.stringify(currentState)}\n\n`);
  sseClients.add(res);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

// 5. Team Roster API
app.get(["/api/roster", "/roster"], (_req, res) => {
  res.json(readTeamsFile());
});

app.post(["/api/roster", "/roster"], (req, res) => {
  try {
    const teams = req.body;
    if (!Array.isArray(teams)) {
      return res.status(400).json({ ok: false, error: "Roster must be an array" });
    }
    writeTeamsFile(teams);
    res.json({ ok: true, teams });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[comet!] LFG FOX Scorebug Server running on port ${PORT}`);
  });
}

startServer();
