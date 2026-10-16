import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLocalSolveHistory, SolveRecord } from '../lib/supabase';
import { LESSONS } from '../core/data/lessonsData';
import {
  LayoutDashboard,
  Trophy,
  Zap,
  Clock,
  BookOpen,
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [solves] = useState<SolveRecord[]>(() => {
    const list = getLocalSolveHistory();
    const timerRaw = localStorage.getItem('cs4a_timer_history');
    const timerList: SolveRecord[] = timerRaw ? JSON.parse(timerRaw) : [];
    // Combine and sort by timestamp desc
    return [...list, ...timerList].sort((a, b) => b.timestamp - a.timestamp);
  });

  const [completedLessons] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cs4a_completed_lessons') || '[]');
    } catch {
      return [];
    }
  });

  const totalSolves = solves.length;
  const bestTime = solves.length > 0 ? Math.min(...solves.map(s => s.durationMs)) : null;
  const avgTime =
    solves.length > 0
      ? Math.round(solves.reduce((acc, s) => acc + s.durationMs, 0) / solves.length)
      : null;

  const avgMoves =
    solves.filter(s => s.moveCount > 0).length > 0
      ? Math.round(
          solves.filter(s => s.moveCount > 0).reduce((acc, s) => acc + s.moveCount, 0) /
            solves.filter(s => s.moveCount > 0).length
        )
      : null;

  const formatMs = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}.${hundredths.toString().padStart(2, '0')}s`;
  };

  const achievements = [
    {
      title: 'First Step',
      desc: 'Complete your first cube solve',
      unlocked: totalSolves >= 1,
    },
    {
      title: 'Speed Apprentice',
      desc: 'Solve a cube in under 60 seconds',
      unlocked: bestTime !== null && bestTime < 60000,
    },
    {
      title: 'Master Student',
      desc: 'Complete 5 learning curriculum lessons',
      unlocked: completedLessons.length >= 5,
    },
    {
      title: 'Dedicated Cuber',
      desc: 'Complete 10 total practice solves',
      unlocked: totalSolves >= 10,
    },
  ];

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Progress & Statistics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your verified solves, timing improvements, and learning milestones.
          </p>
        </div>

        <Link
          to="/solve"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Solve</span>
        </Link>
      </div>

      {totalSolves === 0 ? (
        /* Empty State with CTA (Requirement 13) */
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No Solving History Yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            You haven't recorded any solves yet. Solve your scrambled cube or practice with our WCA timer to start building your personal cubing statistics.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/solve"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20"
            >
              Start Your First Solve
            </Link>
            <Link
              to="/practice"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300"
            >
              Practice Timer
            </Link>
          </div>
        </div>
      ) : (
        /* Dashboard with Real Statistics */
        <>
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Total Solves</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                  {totalSolves}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Personal Best</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5 font-mono">
                  {bestTime ? formatMs(bestTime) : '—'}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Average Time</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5 font-mono">
                  {avgTime ? formatMs(avgTime) : '—'}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">Course Lessons</span>
                <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                  {completedLessons.length}/{LESSONS.length}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Milestones & Achievements</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    ach.unlocked
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                      : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {ach.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ach.unlocked ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {ach.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {ach.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Solves Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Recent Solving Sessions</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Date & Time</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Time Elapsed</th>
                    <th className="px-4 py-3">Moves</th>
                    <th className="px-4 py-3 rounded-r-xl">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {solves.slice(0, 10).map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-semibold capitalize text-gray-900 dark:text-white">
                        {s.method}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {formatMs(s.durationMs)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {s.moveCount > 0 ? `${s.moveCount} moves` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400">
                          Verified Solved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
