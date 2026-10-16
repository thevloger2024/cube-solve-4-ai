import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateScramble, getScrambledCube } from '../../core/cube/ScrambleGenerator';
import { CubeState, createSolvedCube } from '../../core/cube/CubeState';
import { MiniCube3D } from '../3d/MiniCube3D';
import { sounds } from '../../core/audio/SoundEffects';
import { syncSolveRecord, SolveRecord } from '../../lib/supabase';
import {
  Timer,
  RotateCcw,
  Copy,
  Check,
  Trophy,
  History,
  Trash2,
  Sparkles,
  Volume2,
} from 'lucide-react';

type TimerState = 'idle' | 'inspection' | 'holding' | 'ready' | 'running' | 'stopped';

export const SpeedTimer: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [inspectionSeconds, setInspectionSeconds] = useState(15);
  const [scramble, setScramble] = useState<string>(generateScramble(20));
  const [scrambledCube, setScrambledCube] = useState<CubeState>(() => getScrambledCube(20).cube);
  const [history, setHistory] = useState<SolveRecord[]>(() => {
    try {
      const raw = localStorage.getItem('cs4a_timer_history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<number | null>(null);
  const inspectionTimerRef = useRef<any>(null);
  const holdTimeoutRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // New Scramble generator
  const refreshScramble = useCallback(() => {
    const { cube, scramble: s } = getScrambledCube(20);
    setScramble(s);
    setScrambledCube(cube);
  }, []);

  // Format milliseconds into MM:SS.ms
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);

    const secStr = seconds.toString().padStart(2, '0');
    const hndStr = hundredths.toString().padStart(2, '0');

    if (minutes > 0) {
      return `${minutes}:${secStr}.${hndStr}`;
    }
    return `${seconds}.${hndStr}`;
  };

  // Compute Ao5 (Average of 5) according to WCA trimming rules
  const computeAo5 = (records: SolveRecord[]): number | null => {
    if (records.length < 5) return null;
    const last5 = records.slice(0, 5).map(r => r.durationMs);
    const sorted = [...last5].sort((a, b) => a - b);
    // Trim fastest (index 0) and slowest (index 4)
    const middle3 = sorted.slice(1, 4);
    const sum = middle3.reduce((acc, v) => acc + v, 0);
    return Math.round(sum / 3);
  };

  // Compute Ao12 (Average of 12)
  const computeAo12 = (records: SolveRecord[]): number | null => {
    if (records.length < 12) return null;
    const last12 = records.slice(0, 12).map(r => r.durationMs);
    const sorted = [...last12].sort((a, b) => a - b);
    const middle10 = sorted.slice(1, 11);
    const sum = middle10.reduce((acc, v) => acc + v, 0);
    return Math.round(sum / 10);
  };

  const personalBest = history.length > 0 ? Math.min(...history.map(r => r.durationMs)) : null;
  const currentAo5 = computeAo5(history);
  const currentAo12 = computeAo12(history);

  // Start Inspection
  const startInspection = () => {
    setTimerState('inspection');
    setInspectionSeconds(15);
    setElapsedMs(0);

    let sec = 15;
    if (inspectionTimerRef.current) clearInterval(inspectionTimerRef.current);

    inspectionTimerRef.current = setInterval(() => {
      sec -= 1;
      setInspectionSeconds(sec);

      if (sec === 7) sounds.playBeep('low'); // 8s warning
      if (sec === 3) sounds.playBeep('high'); // 12s warning

      if (sec <= 0) {
        if (inspectionTimerRef.current) clearInterval(inspectionTimerRef.current);
        // Start automatically or DNF
        setTimerState('idle');
      }
    }, 1000);
  };

  // Key / Touch down (prepare hold)
  const handleHoldStart = () => {
    if (timerState === 'running') {
      // Stop the timer
      const finalDuration = performance.now() - startTimeRef.current;
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      setElapsedMs(finalDuration);
      setTimerState('stopped');
      sounds.playTurn();

      // Record solve
      const record: SolveRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        durationMs: Math.round(finalDuration),
        moveCount: 0,
        moves: [],
        scramble,
        method: 'timer',
        isVerified: true,
      };

      const updated = [record, ...history];
      setHistory(updated);
      try {
        localStorage.setItem('cs4a_timer_history', JSON.stringify(updated.slice(0, 200)));
      } catch {}
      syncSolveRecord(record);
      refreshScramble();
      return;
    }

    if (timerState === 'idle' || timerState === 'stopped') {
      startInspection();
      return;
    }

    if (timerState === 'inspection') {
      setTimerState('holding');
      // Must hold for 300ms before becoming 'ready'
      holdTimeoutRef.current = setTimeout(() => {
        setTimerState('ready');
        sounds.playBeep('high');
      }, 300);
    }
  };

  // Key / Touch up (release to run)
  const handleHoldEnd = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);

    if (timerState === 'ready') {
      if (inspectionTimerRef.current) clearInterval(inspectionTimerRef.current);
      setTimerState('running');
      startTimeRef.current = performance.now();

      const tick = () => {
        setElapsedMs(performance.now() - startTimeRef.current);
        timerRef.current = requestAnimationFrame(tick);
      };
      timerRef.current = requestAnimationFrame(tick);
    } else if (timerState === 'holding') {
      // Released too early
      setTimerState('inspection');
    }
  };

  // Keyboard spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleHoldStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleHoldEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      if (inspectionTimerRef.current) clearInterval(inspectionTimerRef.current);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, [timerState, scramble]);

  const handleCopyScramble = () => {
    navigator.clipboard.writeText(scramble);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    if (confirm('Clear timer session history?')) {
      setHistory([]);
      localStorage.removeItem('cs4a_timer_history');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Scramble Display Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span>WCA Official Scramble (3x3x3)</span>
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold tracking-wide text-gray-900 dark:text-gray-100 select-all leading-relaxed">
            {scramble}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
            <button
              type="button"
              onClick={refreshScramble}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Scramble</span>
            </button>
            <button
              type="button"
              onClick={handleCopyScramble}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 3D Mini Cube Preview of Scrambled State */}
        <div className="flex flex-col items-center p-2 rounded-2xl bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800">
          <MiniCube3D cube={scrambledCube} size={110} autoRotate={true} />
          <span className="text-[10px] text-gray-400 font-mono mt-1">3D Scramble State</span>
        </div>
      </div>

      {/* Giant Interactive Touch/Keypad Timer Screen */}
      <div
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        className={`relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] rounded-3xl border flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-200 shadow-2xl ${
          timerState === 'running'
            ? 'bg-gray-950 border-gray-800 text-white'
            : timerState === 'ready'
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400 ring-8 ring-emerald-500/20'
            : timerState === 'holding'
            ? 'bg-red-950/90 border-red-500 text-red-400'
            : timerState === 'inspection'
            ? 'bg-amber-950/90 border-amber-500 text-amber-400'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
        }`}
      >
        {/* Status text */}
        <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-3">
          {timerState === 'inspection' && `INSPECTION (${inspectionSeconds}s)`}
          {timerState === 'holding' && 'HOLDING...'}
          {timerState === 'ready' && 'READY — RELEASE!'}
          {timerState === 'running' && 'SOLVING...'}
          {(timerState === 'idle' || timerState === 'stopped') && 'CLICK OR PRESS SPACE'}
        </div>

        {/* Main Big Digits */}
        <div className="font-mono text-6xl sm:text-8xl md:text-9xl font-black tracking-tight drop-shadow-md">
          {timerState === 'inspection' ? inspectionSeconds : formatTime(elapsedMs)}
        </div>

        {/* Spacebar helper prompt */}
        <div className="text-xs text-gray-400 mt-4 px-4 py-1.5 rounded-full bg-black/20">
          Hold Spacebar or Screen to Ready • Release to Start • Press to Stop
        </div>
      </div>

      {/* Statistics Cards: PB, Ao5, Ao12 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold">Personal Best</div>
            <div className="text-xl font-mono font-black text-gray-900 dark:text-white">
              {personalBest !== null ? formatTime(personalBest) : '—'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold">Average of 5 (Ao5)</div>
            <div className="text-xl font-mono font-black text-gray-900 dark:text-white">
              {currentAo5 !== null ? formatTime(currentAo5) : '—'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-bold">Average of 12 (Ao12)</div>
            <div className="text-xl font-mono font-black text-gray-900 dark:text-white">
              {currentAo12 !== null ? formatTime(currentAo12) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Session History Log */}
      {history.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              <span>Session History ({history.length} Solves)</span>
            </h3>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {history.slice(0, 18).map((solve, idx) => (
              <div
                key={solve.id}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-center"
              >
                <div className="text-[10px] text-gray-400 font-bold">#{history.length - idx}</div>
                <div className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                  {formatTime(solve.durationMs)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
