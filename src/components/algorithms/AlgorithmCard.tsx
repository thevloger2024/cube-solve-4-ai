import React, { useState } from 'react';
import { AlgorithmCase } from '../../core/data/algorithmsData';
import { MiniCube3D } from '../3d/MiniCube3D';
import { createSolvedCube, CubeState } from '../../core/cube/CubeState';
import { applyMoveSequence } from '../../core/cube/CubeMoves';
import { sounds } from '../../core/audio/SoundEffects';
import { Copy, Check, Play, RotateCcw, Bookmark } from 'lucide-react';

interface AlgorithmCardProps {
  algo: AlgorithmCase;
  onPractice?: (algo: AlgorithmCase) => void;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algo, onPractice }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('cs4a_favorite_algos') || '[]');
      return favs.includes(algo.id);
    } catch {
      return false;
    }
  });

  // Calculate demonstration cube state (apply setup moves or inverse of algorithm to solved cube)
  const previewCube: CubeState = React.useMemo(() => {
    const solved = createSolvedCube();
    if (algo.setupMoves) {
      return applyMoveSequence(solved, algo.setupMoves);
    }
    return solved;
  }, [algo]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(algo.moves);
    setCopied(true);
    sounds.playTurn();
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('cs4a_favorite_algos') || '[]');
      let updated: string[];
      if (favs.includes(algo.id)) {
        updated = favs.filter(id => id !== algo.id);
        setIsBookmarked(false);
      } else {
        updated = [...favs, algo.id];
        setIsBookmarked(true);
      }
      localStorage.setItem('cs4a_favorite_algos', JSON.stringify(updated));
      sounds.playTurn();
    } catch {}
  };

  const getDifficultyBadge = (d: string) => {
    switch (d) {
      case 'Beginner':
        return 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800';
      case 'Intermediate':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800';
      case 'Advanced':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header with name and tags */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyBadge(algo.difficulty)}`}>
              {algo.difficulty}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1 group-hover:text-blue-500 transition-colors">
              {algo.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={toggleBookmark}
            title={isBookmarked ? 'Remove from favorites' : 'Save to favorites'}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {algo.description}
        </p>

        {/* 3D Mini Cube Preview */}
        <div className="flex items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 mb-4">
          <MiniCube3D cube={previewCube} size={110} autoRotate={true} />
        </div>

        {/* Algorithm Notation Display */}
        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider break-words flex items-center justify-between gap-2">
          <span>{algo.moves}</span>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy algorithm moves"
            className="p-1 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Footer Tags & Practice Action */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {algo.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {onPractice && (
          <button
            type="button"
            onClick={() => onPractice(algo)}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Practice</span>
          </button>
        )}
      </div>
    </div>
  );
};
