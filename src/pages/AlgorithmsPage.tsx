import React, { useState } from 'react';
import { ALGORITHMS, AlgorithmCase } from '../core/data/algorithmsData';
import { AlgorithmCard } from '../components/algorithms/AlgorithmCard';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export const AlgorithmsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  const categories = [
    { id: 'all', label: 'All Algorithms' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'f2l', label: 'F2L (First 2 Layers)' },
    { id: 'oll', label: 'OLL (Orientation)' },
    { id: 'pll', label: 'PLL (Permutation)' },
    { id: 'roux', label: 'Roux Method' },
  ];

  const favoriteIds: string[] = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('cs4a_favorite_algos') || '[]');
    } catch {
      return [];
    }
  }, [showOnlyBookmarks]);

  const filteredAlgos = ALGORITHMS.filter(algo => {
    // Category match
    if (selectedCategory !== 'all' && algo.category !== selectedCategory) {
      return false;
    }

    // Bookmark filter
    if (showOnlyBookmarks && !favoriteIds.includes(algo.id)) {
      return false;
    }

    // Search query match (name, notation, or tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = algo.name.toLowerCase().includes(q);
      const matchMoves = algo.moves.toLowerCase().includes(q);
      const matchTags = algo.tags.some(t => t.toLowerCase().includes(q));
      return matchName || matchMoves || matchTags;
    }

    return true;
  });

  const handlePractice = (algo: AlgorithmCase) => {
    navigate(`/practice?algo=${algo.id}`);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Algorithm Database
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Searchable, verified collection of speedcubing algorithms with interactive 3D demos.
          </p>
        </div>

        {/* Favorites filter toggle */}
        <button
          type="button"
          onClick={() => setShowOnlyBookmarks(prev => !prev)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            showOnlyBookmarks
              ? 'bg-amber-500 text-white shadow-md'
              : 'border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-white' : ''}`} />
          <span>Favorites Only ({favoriteIds.length})</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, notation, or tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Algorithm Cards Grid */}
      {filteredAlgos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgos.map(algo => (
            <AlgorithmCard
              key={algo.id}
              algo={algo}
              onPractice={handlePractice}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center space-y-3">
          <Compass className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No algorithms match your criteria
          </h3>
          <p className="text-xs text-gray-500">
            Try adjusting your search terms or selecting another category filter.
          </p>
        </div>
      )}
    </div>
  );
};
