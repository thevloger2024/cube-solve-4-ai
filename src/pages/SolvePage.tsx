import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CubeState, createSolvedCube, cloneCube } from '../core/cube/CubeState';
import { solveCubeKociemba } from '../core/solver/KociembaSolver';
import { solveCubeBeginner } from '../core/solver/BeginnerSolver';
import { ManualEntry } from '../components/solver/ManualEntry';
import { CameraScanner } from '../components/solver/CameraScanner';
import { GuidedSolver } from '../components/solver/GuidedSolver';
import { syncSolveRecord, SolveRecord } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import {
  Paintbrush,
  Camera,
  RotateCcw,
  Sparkles,
  Zap,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';

export const SolvePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const [entryMethod, setEntryMethod] = useState<'manual' | 'camera'>('manual');
  const [solverMethod, setSolverMethod] = useState<'kociemba' | 'beginner'>('kociemba');
  const [activeStage, setActiveStage] = useState<'entry' | 'guided'>('entry');
  const [cube, setCube] = useState<CubeState>(() => createSolvedCube());
  const [isSolving, setIsSolving] = useState(false);
  const [solverError, setSolverError] = useState<string | null>(null);

  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [solutionStates, setSolutionStates] = useState<CubeState[]>([]);

  // Listen to url tab param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'camera') {
      setEntryMethod('camera');
    } else if (tab === 'manual') {
      setEntryMethod('manual');
    }
  }, [searchParams]);

  const handleSolve = () => {
    setIsSolving(true);
    setSolverError(null);

    // Run solver in next tick to allow spinner to paint
    setTimeout(() => {
      try {
        const result = solverMethod === 'kociemba'
          ? solveCubeKociemba(cube)
          : solveCubeBeginner(cube);

        if (result.success && result.verification.isSuccess) {
          setSolutionMoves(result.moves);
          setSolutionStates(result.verification.statesAfterEachMove);
          setActiveStage('guided');
        } else {
          setSolverError(
            result.error ||
              'Unable to calculate a valid physical solve. Please verify that all sticker colors and edge/corner pairings are placed accurately.'
          );
        }
      } catch (err) {
        setSolverError((err as Error).message);
      } finally {
        setIsSolving(false);
      }
    }, 50);
  };

  const handleCameraComplete = (scannedCube: CubeState) => {
    setCube(scannedCube);
    setEntryMethod('manual'); // Show user the scanned cube in manual editor for final inspection
  };

  const handleRestart = () => {
    setActiveStage('entry');
    setSolutionMoves([]);
    setSolutionStates([]);
  };

  const handleSaveSolveSession = (durationMs: number) => {
    const record: SolveRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      durationMs,
      moveCount: solutionMoves.length,
      moves: solutionMoves,
      method: solverMethod,
      isVerified: true,
    };
    syncSolveRecord(record);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {activeStage === 'guided' ? 'Guided Physical Solver' : t('solver.title')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeStage === 'guided'
              ? 'Execute each turn on your physical cube and click "Done — Next Step".'
              : t('solver.subtitle')}
          </p>
        </div>

        {activeStage === 'guided' && (
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-enter Cube State</span>
          </button>
        )}
      </div>

      {/* Solver Navigation Mode Tabs (Manual vs Camera) & Algorithm Selection */}
      {activeStage === 'entry' && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Entry Method Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setEntryMethod('manual');
                setSearchParams({ tab: 'manual' });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                entryMethod === 'manual'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>{t('solver.manualTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEntryMethod('camera');
                setSearchParams({ tab: 'camera' });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                entryMethod === 'camera'
                  ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t('solver.cameraTab')}</span>
            </button>
          </div>

          {/* Solver Algorithm Mode Toggle: Two-Phase Optimal vs Beginner CFOP */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase hidden sm:inline">
              Engine:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSolverMethod('kociemba')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  solverMethod === 'kociemba'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Kociemba (Optimal ~20 Moves)</span>
              </button>

              <button
                type="button"
                onClick={() => setSolverMethod('beginner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  solverMethod === 'beginner'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Beginner CFOP Steps</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solver Computation Error Notification */}
      {solverError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-800 dark:text-red-300">
            <strong className="block text-sm font-bold text-red-900 dark:text-red-200">
              Solution Computation Error
            </strong>
            <p className="mt-1 leading-relaxed">{solverError}</p>
          </div>
        </div>
      )}

      {/* Active Mode Component View */}
      {activeStage === 'guided' ? (
        <GuidedSolver
          initialCube={cube}
          moves={solutionMoves}
          statesAfterEachMove={solutionStates}
          onRestart={handleRestart}
          onSaveSolve={handleSaveSolveSession}
        />
      ) : entryMethod === 'camera' ? (
        <CameraScanner
          onScanComplete={handleCameraComplete}
          onCancel={() => setEntryMethod('manual')}
        />
      ) : (
        <ManualEntry
          cube={cube}
          onChange={setCube}
          onSolveRequest={handleSolve}
          isSolving={isSolving}
        />
      )}
    </div>
  );
};
