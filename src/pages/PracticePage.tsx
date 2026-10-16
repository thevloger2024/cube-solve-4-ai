import React from 'react';
import { SpeedTimer } from '../components/timer/SpeedTimer';
import { Timer, Trophy, ShieldCheck } from 'lucide-react';

export const PracticePage: React.FC = () => {
  return (
    <div className="py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Speedcubing Practice Timer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            WCA regulation 15-second inspection timer, spacebar / touch hold triggers, and Ao5 / Ao12 stats.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>WCA Inspection Rules Active</span>
        </div>
      </div>

      {/* Speed Timer Component */}
      <SpeedTimer />
    </div>
  );
};
