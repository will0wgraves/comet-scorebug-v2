import React, { useState, useMemo } from 'react';
import {
  Palette,
  X,
  Check,
  AlertCircle,
  Copy,
  Sparkles,
  FileText,
  Layers,
  ArrowDownToLine,
  RefreshCw
} from 'lucide-react';
import { TeamInfo } from '../types';
import { parseHexImportText, LFG_OFFICIAL_COLOR_SHEET_RAW } from '../data/lfgColorSheet';

interface HexImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoster: TeamInfo[];
  onApplyRoster: (newRoster: TeamInfo[]) => void;
}

export const HexImportModal: React.FC<HexImportModalProps> = ({
  isOpen,
  onClose,
  currentRoster,
  onApplyRoster
}) => {
  const [activeTab, setActiveTab] = useState<'bulk' | 'quick' | 'export'>('bulk');
  const [rawText, setRawText] = useState<string>('');
  const [importMode, setImportMode] = useState<'merge' | 'replace' | 'updateOnly'>('merge');
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  // Single team quick paste state
  const [quickTeamIdx, setQuickTeamIdx] = useState<number>(0);
  const [quickHexInput, setQuickHexInput] = useState<string>('');

  // Parse bulk text in real time
  const parsedTeams = useMemo(() => {
    return parseHexImportText(rawText);
  }, [rawText]);

  if (!isOpen) return null;

  // Handle applying bulk import
  const handleApplyBulk = () => {
    if (parsedTeams.length === 0) return;

    if (importMode === 'replace') {
      onApplyRoster(parsedTeams);
      onClose();
      return;
    }

    const rosterCopy = [...currentRoster];

    for (const imported of parsedTeams) {
      const impNameLower = imported.name.toLowerCase();
      const impAbbrLower = imported.abbr.toLowerCase();

      const existingIdx = rosterCopy.findIndex(
        (t) =>
          t.name.toLowerCase() === impNameLower ||
          t.abbr.toLowerCase() === impAbbrLower ||
          t.name.toLowerCase().includes(impNameLower) ||
          impNameLower.includes(t.name.toLowerCase())
      );

      if (existingIdx >= 0) {
        // Update existing team colors
        rosterCopy[existingIdx] = {
          ...rosterCopy[existingIdx],
          gradients: imported.gradients,
          accent: imported.accent || imported.gradients[1]
        };
      } else if (importMode === 'merge') {
        // Append new team
        rosterCopy.push(imported);
      }
    }

    onApplyRoster(rosterCopy);
    onClose();
  };

  // Handle single team quick apply
  const handleApplyQuick = () => {
    if (quickTeamIdx < 0 || quickTeamIdx >= currentRoster.length) return;
    const matches = quickHexInput.match(/#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g) || [];
    if (matches.length === 0) return;

    const hexes = matches.map((h) => (h.startsWith('#') ? h : `#${h}`));
    const primary = hexes[0];
    const secondary = hexes[1] || primary;
    const accent = hexes[2] || secondary;

    const updated = [...currentRoster];
    updated[quickTeamIdx] = {
      ...updated[quickTeamIdx],
      gradients: [primary, secondary],
      accent
    };

    onApplyRoster(updated);
    setQuickHexInput('');
    setCopyFeedback('Updated team colors!');
    setTimeout(() => setCopyFeedback(''), 2500);
  };

  // Generate exported text from current roster
  const exportedText = currentRoster
    .map((t) => {
      return `${t.name}\n${t.gradients[0]}\n${t.gradients[1]}${t.accent && t.accent !== t.gradients[1] ? `\n${t.accent}` : ''}`;
    })
    .join('\n\n');

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportedText);
    setCopyFeedback('Copied color sheet to clipboard!');
    setTimeout(() => setCopyFeedback(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Team Gradient & Hex Code Importer
              </h2>
              <p className="text-xs text-slate-400">
                Bulk import team colors and gradients from raw text, color sheets, or direct hex inputs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/30 text-xs font-bold">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'bulk'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bulk Color Sheet Import</span>
          </button>

          <button
            onClick={() => setActiveTab('quick')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Single Team Quick Paste</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Export Current Hexes</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: BULK IMPORT */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs text-slate-300">
                  Paste your team list with hex codes below. Supports{' '}
                  <span className="text-amber-400 font-mono">Team \n #hex1 \n #hex2</span>,{' '}
                  <span className="text-amber-400 font-mono">Team: #hex1, #hex2</span>, CSV, or JSON.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRawText(LFG_OFFICIAL_COLOR_SHEET_RAW)}
                    className="text-xs bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Load Official LFG Sheet (129 Teams)</span>
                  </button>
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => setRawText('')}
                      className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="relative">
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Paste color sheet here, e.g.:

Akron
#173a5f
#e6b144
#0a233f

Austin Riverbats: #1d417e, #ed8135, #fcd9ad
Syracuse, #ff8103, #0e77c6`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Import Options & Parsed Preview */}
              {parsedTeams.length > 0 ? (
                <div className="space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                        ✓ {parsedTeams.length} Teams Detected
                      </span>
                      <span className="text-xs text-slate-400">
                        Review gradient swatches below before applying.
                      </span>
                    </div>

                    {/* Import Strategy Radios */}
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="merge"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="text-indigo-600 focus:ring-0"
                        />
                        <span>Merge & Update</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="updateOnly"
                          checked={importMode === 'updateOnly'}
                          onChange={() => setImportMode('updateOnly')}
                          className="text-indigo-600 focus:ring-0"
                        />
                        <span>Update Existing Only</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-rose-400 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="text-rose-600 focus:ring-0"
                        />
                        <span>Replace Entire Roster</span>
                      </label>
                    </div>
                  </div>

                  {/* Visual Preview Grid */}
                  <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 pr-1">
                    {parsedTeams.map((team, idx) => {
                      const exists = currentRoster.some(
                        (t) =>
                          t.name.toLowerCase() === team.name.toLowerCase() ||
                          t.abbr.toLowerCase() === team.abbr.toLowerCase()
                      );
                      return (
                        <div
                          key={idx}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-white truncate max-w-[130px]">
                              {team.name}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {team.abbr}
                            </span>
                          </div>

                          {/* Gradient Swatch Bar */}
                          <div
                            className="h-3.5 w-full rounded shadow-inner border border-white/10"
                            style={{
                              background: `linear-gradient(to right, ${team.gradients[0]}, ${team.gradients[1]})`
                            }}
                          />

                          {/* Hex values */}
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full border border-black/30"
                                style={{ backgroundColor: team.gradients[0] }}
                              />
                              {team.gradients[0]}
                            </span>
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full border border-black/30"
                                style={{ backgroundColor: team.gradients[1] }}
                              />
                              {team.gradients[1]}
                            </span>
                          </div>

                          <div className="text-[10px]">
                            {exists ? (
                              <span className="text-sky-400">Updates existing</span>
                            ) : (
                              <span className="text-emerald-400">+ New team</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : rawText ? (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    No valid teams and hex codes could be extracted from your input. Please make sure team names precede hex codes (e.g. #173a5f).
                  </span>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 2: SINGLE TEAM QUICK PASTE */}
          {activeTab === 'quick' && (
            <div className="space-y-4 max-w-xl">
              <div className="text-xs text-slate-300">
                Quickly apply primary and secondary gradient hex codes to a specific team in your roster.
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400">Select Team</label>
                <select
                  value={quickTeamIdx}
                  onChange={(e) => setQuickTeamIdx(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-bold"
                >
                  {currentRoster.map((team, idx) => (
                    <option key={idx} value={idx}>
                      {team.name} ({team.abbr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400">
                  Paste Hex Codes (e.g.{' '}
                  <span className="text-amber-400 font-mono">#173a5f #e6b144 #0a233f</span>)
                </label>
                <input
                  type="text"
                  value={quickHexInput}
                  onChange={(e) => setQuickHexInput(e.target.value)}
                  placeholder="#173a5f, #e6b144"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono"
                />
              </div>

              {/* Live Preview */}
              {(() => {
                const matches = quickHexInput.match(/#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g) || [];
                if (matches.length > 0) {
                  const hexes = matches.map((h) => (h.startsWith('#') ? h : `#${h}`));
                  const c1 = hexes[0];
                  const c2 = hexes[1] || c1;
                  return (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-400">Preview Gradient:</div>
                      <div
                        className="h-7 w-full rounded-lg shadow border border-white/10"
                        style={{ background: `linear-gradient(to right, ${c1}, ${c2})` }}
                      />
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                        <span>Color 1: {c1}</span>
                        <span>Color 2: {c2}</span>
                        {hexes[2] && <span>Accent: {hexes[2]}</span>}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyQuick}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer"
                >
                  Apply To Selected Team
                </button>
                {copyFeedback && <span className="text-xs font-bold text-emerald-400">{copyFeedback}</span>}
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-300">
                  Current roster formatted as LFG color sheet text ({currentRoster.length} teams).
                </div>
                <button
                  type="button"
                  onClick={handleCopyExport}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyFeedback || 'Copy All to Clipboard'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={10}
                value={exportedText}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 font-mono focus:outline-none select-all"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          {activeTab === 'bulk' && (
            <button
              type="button"
              disabled={parsedTeams.length === 0}
              onClick={handleApplyBulk}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer ${
                parsedTeams.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>
                Apply {parsedTeams.length > 0 ? `${parsedTeams.length} Teams` : 'Gradients'} to Roster
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
