import React from 'react';
import { HelpCircle, Compass, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="py-8 max-w-4xl mx-auto space-y-10">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          Support & Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          How to Hold & Inspect Your Physical Cube
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Follow this orientation guide to ensure your physical turns and sticker entries match the digital 3D model with 100% precision.
        </p>
      </div>

      {/* Physical Orientation Guide */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-500" />
          <span>Standard WCA Orientation Rule</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-1">
            <span className="font-bold text-gray-900 dark:text-white block">1. Top Face (U)</span>
            <p className="text-gray-500 dark:text-gray-400">Always keep the <strong className="text-gray-900 dark:text-white">White center</strong> facing toward the ceiling.</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-1">
            <span className="font-bold text-gray-900 dark:text-white block">2. Front Face (F)</span>
            <p className="text-gray-500 dark:text-gray-400">Keep the <strong className="text-green-500">Green center</strong> facing directly at you.</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-1">
            <span className="font-bold text-gray-900 dark:text-white block">3. Right Face (R)</span>
            <p className="text-gray-500 dark:text-gray-400">The <strong className="text-red-500">Red center</strong> must automatically be on your right hand.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
          <strong>Important:</strong> Center pieces are fixed to the internal core mechanism. They never move relative to each other. When entering colors or performing moves, always keep this grip steady so that R, U, F, L, B, D turns stay synchronized with the app.
        </div>
      </div>

      {/* Camera Scanning Lighting Advice */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-green-500" />
          <span>Tips for Accurate Camera Scanning</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Use diffused, even room lighting. Avoid direct sunlight or heavy desk lamps that create white hot-spot glare on glossy plastic stickers.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Hold the cube perpendicular to the lens so all 9 square patches sit comfortably inside the guide boxes.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>If orange and red or yellow and white look ambiguous in your webcam, tap any patch on the review screen to correct the color before moving to the next face.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
