import React, { useState } from 'react';
import { CubeState, FaceName, ColorName, COLOR_HEX, FACES, cloneCube, countColors, createSolvedCube } from '../../core/cube/CubeState';
import { validateCubeState, ValidationResult } from '../../core/cube/CubeValidation';
import { getScrambledCube } from '../../core/cube/ScrambleGenerator';
import { Cube3D } from '../3d/Cube3D';
import { Cube2DNet } from '../3d/Cube2DNet';
import { sounds } from '../../core/audio/SoundEffects';
import {
  Paintbrush,
  RotateCcw,
  Undo2,
  Redo2,
  Dices,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Eye,
  Layers,
} from 'lucide-react';

interface ManualEntryProps {
  cube: CubeState;
  onChange: (newCube: CubeState) => void;
  onSolveRequest: () => void;
  isSolving?: boolean;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({
  cube,
  onChange,
  onSolveRequest,
  isSolving = false,
}) => {
  const [activeColor, setActiveColor] = useState<ColorName>('white');
  const [selectedSticker, setSelectedSticker] = useState<{ face: FaceName; index: number } | null>(null);
  const [history, setHistory] = useState<CubeState[]>([cloneCube(cube)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('split');
  const [lockCenters, setLockCenters] = useState(true);

  const validation: ValidationResult = validateCubeState(cube);
  const counts = countColors(cube);

  const colorsList: { name: ColorName; label: string; code: string }[] = [
    { name: 'white', label: 'White', code: 'U' },
    { name: 'yellow', label: 'Yellow', code: 'D' },
    { name: 'green', label: 'Green', code: 'F' },
    { name: 'blue', label: 'Blue', code: 'B' },
    { name: 'red', label: 'Red', code: 'R' },
    { name: 'orange', label: 'Orange', code: 'L' },
  ];

  const updateCube = (next: CubeState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cloneCube(next));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onChange(next);
    sounds.playTurn();
  };

  const handleStickerClick = (face: FaceName, index: number) => {
    // If center is locked and clicked on center sticker (index 4), disallow change
    if (lockCenters && index === 4) {
      return;
    }

    const next = cloneCube(cube);
    next[face][index] = activeColor;
    setSelectedSticker({ face, index });
    updateCube(next);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(cloneCube(prev));
      sounds.playTurn();
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(cloneCube(next));
      sounds.playTurn();
    }
  };

  const handleResetSolved = () => {
    const solved = createSolvedCube();
    updateCube(solved);
  };

  const handleRandomScramble = () => {
    const { cube: scrambled } = getScrambledCube(20);
    updateCube(scrambled);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Toolbar: Palette, History, View toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Color Palette */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mr-1">
            <Paintbrush className="w-3.5 h-3.5" /> Brush:
          </span>
          {colorsList.map(c => {
            const count = counts[c.name];
            const isFull = count === 9;
            const isSelected = activeColor === c.name;

            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveColor(c.name)}
                style={{ backgroundColor: COLOR_HEX[c.name] }}
                className={`relative px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all shadow-sm ${
                  isSelected
                    ? 'ring-4 ring-blue-500 scale-105 z-10 border-white'
                    : 'border-gray-300 dark:border-gray-700 opacity-80 hover:opacity-100'
                }`}
              >
                <span className={`text-xs font-bold ${c.name === 'white' || c.name === 'yellow' ? 'text-black' : 'text-white'}`}>
                  {c.label}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isFull
                      ? 'bg-green-600 text-white'
                      : count > 9
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-black/40 text-white'
                  }`}
                >
                  {count}/9
                </span>
              </button>
            );
          })}
        </div>

        {/* Undo / Redo & Presets */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo paint"
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo paint"
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRandomScramble}
            title="Apply random scramble to test solver"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <Dices className="w-4 h-4 text-purple-500" />
            <span>Random Scramble</span>
          </button>
          <button
            type="button"
            onClick={handleResetSolved}
            title="Reset cube to solved state"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Solved</span>
          </button>
        </div>
      </div>

      {/* Orientation Tip Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>
            <strong>Holding Orientation:</strong> Hold your physical cube with{' '}
            <strong className="underline">White on TOP</strong>,{' '}
            <strong className="underline">Green on FRONT</strong>, and{' '}
            <strong className="underline">Red on RIGHT</strong>. Center pieces never move relative to each other!
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(viewMode === '3d' ? '2d' : viewMode === '2d' ? 'split' : '3d')}
            className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 text-blue-700 dark:text-blue-200 font-medium text-[11px] flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>View: {viewMode.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Cube Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Cube Canvas */}
        {(viewMode === '3d' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <div className="relative">
              <Cube3D
                cube={cube}
                interactive={true}
                selectedSticker={selectedSticker}
                highlightedStickers={validation.issues.flatMap(i => i.highlightedStickers || [])}
                onStickerClick={handleStickerClick}
                className="w-full h-80 sm:h-96 md:h-[420px]"
              />
              <div className="absolute top-3 right-3 pointer-events-none px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs">
                Click any sticker to paint with <strong>{activeColor}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 2D Net View */}
        {(viewMode === '2d' || viewMode === 'split') && (
          <div className={viewMode === 'split' ? 'lg:col-span-5' : 'lg:col-span-12'}>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  2D Unfolded Net View
                </span>
                <span className="text-[11px] text-gray-400">
                  Tap stickers to paint directly
                </span>
              </div>
              <Cube2DNet
                cube={cube}
                interactive={true}
                selectedSticker={selectedSticker}
                highlightedStickers={validation.issues.flatMap(i => i.highlightedStickers || [])}
                onStickerClick={handleStickerClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Status & Solve CTA Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 w-full sm:w-auto">
          {validation.isValid ? (
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {validation.isValid ? 'Cube State Verified & Ready' : 'Cube State Needs Correction'}
            </h4>
            {validation.isValid ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                All 54 stickers and color permutations are physically valid.
              </p>
            ) : (
              <div className="space-y-1 mt-1">
                {validation.issues.slice(0, 3).map((issue, idx) => (
                  <p key={idx} className="text-xs text-red-600 dark:text-red-400 font-medium">
                    • {issue.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Solve Button */}
        <button
          type="button"
          disabled={!validation.isValid || isSolving}
          onClick={onSolveRequest}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
            validation.isValid && !isSolving
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {isSolving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Calculating Optimal Moves...</span>
            </>
          ) : (
            <>
              <span>Solve My Cube</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
