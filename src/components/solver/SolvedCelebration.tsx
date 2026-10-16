import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Zap, RotateCcw, Save, Check } from 'lucide-react';
import { sounds } from '../../core/audio/SoundEffects';

interface SolvedCelebrationProps {
  totalMoves: number;
  durationMs: number;
  onRestart: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const SolvedCelebration: React.FC<SolvedCelebrationProps> = ({
  totalMoves,
  durationMs,
  onRestart,
  onSave,
  isSaved = false,
}) => {
  useEffect(() => {
    sounds.playVictory();

    // Burst confetti from sides
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch (e) {}
  }, []);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  return (
    <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-green-500/30 shadow-2xl text-center max-w-lg mx-auto">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-gray-950 shadow-xl shadow-amber-500/30 mb-6 animate-bounce">
        <Trophy className="w-10 h-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Cube Solved!
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Congratulations! You have physically turned every layer and your cube is 100% solved.
      </p>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Total Moves</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {totalMoves}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Time Taken</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {formatTime(durationMs)}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaved}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isSaved
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Solve Saved' : 'Save Session'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Solve Another Cube</span>
        </button>
      </div>
    </div>
  );
};
