import React, { useState, useEffect, useRef } from 'react';
import { CubeState } from '../../core/cube/CubeState';
import { getMoveInstruction, MoveInstruction } from '../../core/cube/CubeNotation';
import { useLanguage } from '../../context/LanguageContext';
import { Cube3D } from '../3d/Cube3D';
import { Cube2DNet } from '../3d/Cube2DNet';
import { SolvedCelebration } from './SolvedCelebration';
import { sounds } from '../../core/audio/SoundEffects';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GuidedSolverProps {
  initialCube: CubeState;
  moves: string[];
  statesAfterEachMove: CubeState[];
  onRestart: () => void;
  onSaveSolve?: (durationMs: number) => void;
}

export const GuidedSolver: React.FC<GuidedSolverProps> = ({
  initialCube,
  moves,
  statesAfterEachMove,
  onRestart,
  onSaveSolve,
}) => {
  const { language } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0); // 0.5x, 1x, 2x
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'split'>('3d');
  const [startTime] = useState<number>(Date.now());
  const [solveSaved, setSolveSaved] = useState(false);

  const autoPlayTimerRef = useRef<any>(null);

  const totalMoves = moves.length;
  const isCompleted = currentStepIndex >= totalMoves;
  const currentCubeState = statesAfterEachMove[currentStepIndex] || initialCube;

  const currentMove = !isCompleted ? moves[currentStepIndex] : null;
  const instruction: MoveInstruction | null = currentMove
    ? getMoveInstruction(currentMove, language)
    : null;

  // Sound manager sync
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Auto-play interval handler
  useEffect(() => {
    if (isAutoPlaying && !isCompleted) {
      const intervalMs = Math.round(2000 / speed);
      autoPlayTimerRef.current = setTimeout(() => {
        handleNextStep();
      }, intervalMs);
    } else {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, currentStepIndex, speed, isCompleted]);

  const handleNextStep = () => {
    if (currentStepIndex < totalMoves) {
      setCurrentStepIndex(prev => prev + 1);
      sounds.playTurn();
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      sounds.playTurn();
      setIsAutoPlaying(false);
    }
  };

  const handleReplayCurrent = () => {
    sounds.playWhoosh();
    // Subtle visual bump or re-trigger animation
  };

  const handleCopySequence = () => {
    navigator.clipboard.writeText(moves.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSaveSolve && !solveSaved) {
      const duration = Date.now() - startTime;
      onSaveSolve(duration);
      setSolveSaved(true);
    }
  };

  // Plain-language localized move explanation
  const localizedInfo = instruction ? instruction[language] : null;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header bar with move counter and progress bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
              Step {Math.min(currentStepIndex + 1, totalMoves)} of {totalMoves}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isCompleted ? 'All Steps Finished!' : 'Follow Physical Turn'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySequence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Moves'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(prev => !prev)}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setViewMode(viewMode === '3d' ? 'split' : '3d')}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Toggle 2D Net View"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-green-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, (currentStepIndex / totalMoves) * 100)}%` }}
          />
        </div>

        {/* Move Pills Timeline */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
          {moves.map((m, idx) => {
            const isPast = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsAutoPlaying(false);
                  sounds.playTurn();
                }}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white scale-110 shadow-md ring-2 ring-blue-400'
                    : isPast
                    ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      {isCompleted ? (
        <SolvedCelebration
          totalMoves={totalMoves}
          durationMs={Date.now() - startTime}
          onRestart={onRestart}
          onSave={handleSave}
          isSaved={solveSaved}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Visualizer Canvas */}
          <div className={viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-8'}>
            <Cube3D
              cube={currentCubeState}
              interactive={false}
              autoRotate={false}
              className="w-full h-80 sm:h-96 md:h-[450px]"
            />
          </div>

          {/* If split mode, show 2D net */}
          {viewMode === 'split' && (
            <div className="lg:col-span-5 p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <Cube2DNet cube={currentCubeState} />
            </div>
          )}

          {/* Current Move Instruction & Checklist Card */}
          <div className={viewMode === 'split' ? 'lg:col-span-12' : 'lg:col-span-4'}>
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col gap-5">
              {/* Giant Move Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Current Turn
                  </span>
                  <div className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight mt-0.5 font-mono">
                    {currentMove}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {instruction?.direction}
                  </span>
                </div>
              </div>

              {/* Localized Plain Language Explanation */}
              {localizedInfo && (
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
                  <div className="font-bold text-blue-900 dark:text-blue-300">
                    {localizedInfo.title}
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 mt-1 leading-relaxed">
                    {localizedInfo.description}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 mt-1.5 font-medium italic">
                    💡 Tip: {localizedInfo.tip}
                  </p>
                </div>
              )}

              {/* Physical Cube Checklist */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Step-by-Step Checklist
                </span>
                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Watch the 3D model orientation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Turn the physical cube layer: <strong>{currentMove}</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Verify your real cube matches the screen</span>
                  </div>
                </div>
              </div>

              {/* Navigation & Speed Controls */}
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                {/* Primary Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Done — Next Step</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Secondary Controls: Prev, Replay, Auto-Play */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReplayCurrent}
                    className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(prev => !prev)}
                    className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      isAutoPlaying
                        ? 'bg-amber-600 text-white'
                        : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoPlaying ? 'Pause' : 'Auto'}</span>
                  </button>
                </div>

                {/* Speed Selector */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>Speed:</span>
                  <div className="flex items-center gap-1">
                    {[0.5, 1.0, 2.0].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpeed(s)}
                        className={`px-2.5 py-1 rounded-lg font-bold ${
                          speed === s
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
