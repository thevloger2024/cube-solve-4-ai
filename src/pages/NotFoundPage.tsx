import React from 'react';
import { Link } from 'react-router-dom';
import { MiniCube3D } from '../components/3d/MiniCube3D';
import { getScrambledCube } from '../core/cube/ScrambleGenerator';
import { Home, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const scrambled = React.useMemo(() => getScrambledCube(12).cube, []);

  return (
    <div className="py-16 max-w-md mx-auto text-center space-y-6">
      <div className="flex items-center justify-center">
        <MiniCube3D cube={scrambled} size={150} autoRotate={true} />
      </div>

      <div className="space-y-2">
        <span className="text-4xl sm:text-6xl font-black text-blue-600 dark:text-blue-400 font-mono">
          404
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cube Case Not Found
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          The requested page or algorithm permutation does not exist. Let's navigate back to a solved state.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
