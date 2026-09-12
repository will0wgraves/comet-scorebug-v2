import React, { useState } from 'react';
import { Copy, Check, Terminal, Download, ShieldCheck } from 'lucide-react';

export const EXACT_USER_LUA_CODE = `game:GetService("Players").LocalPlayer.PlayerGui.MainGui.Scoreboard.Visible = true
game:GetService("Players").LocalPlayer.PlayerGui.MainGui.LeftMenu.Visible = true

local function formatStatus(text)
	if type(text) ~= "string" then return text end
	text = text:gsub("<%s*font.-%s*>", ""):gsub("<%s*/%s*font%s*>", "")
	text = text:gsub("(%d)(ST)", "%1st")
	text = text:gsub("(%d)(ND)", "%1nd")
	text = text:gsub("(%d)(RD)", "%1rd")
	text = text:gsub("(%d)(TH)", "%1th")
	return text
end

function FormatClock(seconds : number)
	local minutes = (seconds - seconds%60)/60
	seconds = seconds-minutes*60
	local zero = ""
	if (seconds < 10) then
		zero = "0"
	end

	return minutes .. ":" .. zero .. seconds
end

function FormatNumber(number : number)
	if (number == 1) then
		return "1st"
	elseif (number == 2) then
		return "2nd"
	elseif (number == 3) then
		return "3rd"
	elseif (number == 4) then
		return "4th"
	elseif (number >= 5) then
		return "OT " .. number-4
	end
end

local function Flags(path, file, format)
    pcall(function() local v = game:GetService("ReplicatedStorage"); for p in path:gmatch("[^.]+") do v = v[p] end writefile(file, format and format(v.Value) or tostring(v.Value)) v.Changed:Connect(function(n) pcall(writefile, file, format and format(n) or tostring(n)) end) end)
end

Flags("Flags.AwayScore", "Away-Score.txt")
Flags("Flags.TimerTag", "Clock.txt", FormatClock)
Flags("Flags.Quarter", "Quarter.txt", FormatNumber)
Flags("Flags.StatusTag", "Status.txt", formatStatus)
Flags("Flags.HomeScore", "Home-Score.txt")
Flags("Flags.Playclock", "PlayClock.txt", function(p) return ":" .. tostring(p) end)
`;

export const LuaScriptHelper: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EXACT_USER_LUA_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([EXACT_USER_LUA_CODE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comet_ff3_crawler.lua';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <h3 className="font-redhat font-black text-lg text-sky-400 uppercase tracking-wide">
              Roblox FF3 Lua Crawler Script
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Runs in Solara / Roblox to auto-crawl Football Fusion 3 match data and syncs to your scorebug in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .lua</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{EXACT_USER_LUA_CODE}</pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200">Dual Syncing Architecture:</span>
              <p className="text-slate-400 mt-0.5">
                Writes to Solara workspace files (<code className="text-sky-300">Away-Score.txt</code>, <code className="text-sky-300">Home-Score.txt</code>, etc.) AND sends HTTP POST to <code className="text-sky-300">/api/state</code>.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
              !
            </div>
            <div>
              <span className="font-bold text-slate-200">Local Logos Directory:</span>
              <p className="text-slate-400 mt-0.5">
                Team logos from <code className="text-amber-300">C:\Users\skull\Documents\comet-scorebugs\logos\LFG Team Logos</code> can be browsed or uploaded in the Team Manager below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
