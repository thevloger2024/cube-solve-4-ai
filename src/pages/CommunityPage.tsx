import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  Search,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'Beginners' | 'Speedcubing' | 'Hardware' | 'CFOP';
  upvotes: number;
  repliesCount: number;
  timestamp: number;
  tags: string[];
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'How I dropped my 3x3 solve time from 1 minute to sub-30 seconds',
    content: 'The biggest breakthrough for me was switching to full 2-Look OLL and practicing untimed F2L lookahead. Don\'t turn fast during F2L—turn smoothly and track the next pair.',
    author: 'Aman Patel',
    category: 'Speedcubing',
    upvotes: 42,
    repliesCount: 8,
    timestamp: Date.now() - 3600000 * 24,
    tags: ['Sub-30', 'F2L', 'Tips'],
  },
  {
    id: 'post-2',
    title: 'Stuck on Yellow Cross (Dot case) in Beginner Method? Easy trick',
    content: 'If you have only the center yellow dot, you can hold the cube in any orientation and perform F R U R\' U\' F\'. That automatically produces the "L" angle!',
    author: 'RubikSensei',
    category: 'Beginners',
    upvotes: 28,
    repliesCount: 5,
    timestamp: Date.now() - 3600000 * 48,
    tags: ['Beginners', 'YellowCross', 'Guide'],
  },
  {
    id: 'post-3',
    title: 'Magnetic vs Non-Magnetic 3x3 cubes: Is the upgrade worth it?',
    content: 'Yes, 100%! The magnets prevent slice overshooting and help lock layers cleanly into position. Highly recommend starting with a budget magnetic cube.',
    author: 'SpeedCuber42',
    category: 'Hardware',
    upvotes: 35,
    repliesCount: 12,
    timestamp: Date.now() - 3600000 * 72,
    tags: ['Hardware', 'Magnets', 'Cubes'],
  },
];

export const CommunityPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem('cs4a_forum_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Beginners' | 'Speedcubing' | 'Hardware' | 'CFOP'>('Beginners');
  const [newTags, setNewTags] = useState('');

  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cs4a_upvoted_posts') || '[]');
    } catch {
      return [];
    }
  });

  const handleUpvote = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isAlready = upvotedIds.includes(postId);
    const updatedUpvotes = isAlready
      ? upvotedIds.filter(id => id !== postId)
      : [...upvotedIds, postId];

    setUpvotedIds(updatedUpvotes);
    localStorage.setItem('cs4a_upvoted_posts', JSON.stringify(updatedUpvotes));

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, upvotes: p.upvotes + (isAlready ? -1 : 1) }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: profile?.displayName || 'CuberGuest',
      category: newCategory,
      upvotes: 1,
      repliesCount: 0,
      timestamp: Date.now(),
      tags: newTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('cs4a_forum_posts', JSON.stringify(updated));

    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  const filteredPosts = posts.filter(p => {
    if (selectedCat !== 'All' && p.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Community Forum
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Connect with fellow cubers, share solve reconstructions, ask questions, and discuss hardware.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Beginners', 'Speedcubing', 'Hardware', 'CFOP'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions & tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          const isUpvoted = upvotedIds.includes(post.id);
          return (
            <Link
              key={post.id}
              to={`/community/${post.id}`}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-200 block space-y-3 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">• Posted by <strong>{post.author}</strong></span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Upvote Button */}
                <button
                  type="button"
                  onClick={e => handleUpvote(post.id, e)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                    isUpvoted
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-400 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
                  <span className="text-xs font-bold mt-1">{post.upvotes}</span>
                </button>
              </div>

              {/* Tags & Replies Count */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800/80 gap-2">
                <div className="flex items-center gap-1.5">
                  {post.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} replies</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* New Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Start New Discussion
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Tips for memorizing full PLL algorithms..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginners">Beginners</option>
                  <option value="Speedcubing">Speedcubing</option>
                  <option value="Hardware">Hardware</option>
                  <option value="CFOP">CFOP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Share your questions, insights, or practice techniques..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="e.g. PLL, Practice, Sub-20"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
