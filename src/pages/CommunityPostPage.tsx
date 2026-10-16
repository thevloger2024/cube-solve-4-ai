import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Send,
  Clock,
  User,
  Share2,
} from 'lucide-react';

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export const CommunityPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { profile } = useAuth();

  const [replies, setReplies] = useState<Reply[]>([
    {
      id: 'rep-1',
      author: 'SpeedySolve',
      content: 'Completely agree! Untimed slow solves for F2L helped me recognize pairs without pausing.',
      timestamp: Date.now() - 3600000 * 12,
    },
    {
      id: 'rep-2',
      author: 'CubingMaster',
      content: 'Also make sure you practice turning with fingertricks rather than full wrist rotations.',
      timestamp: Date.now() - 3600000 * 6,
    },
  ]);

  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      author: profile?.displayName || 'CuberGuest',
      content: replyText.trim(),
      timestamp: Date.now(),
    };

    setReplies([...replies, newReply]);
    setReplyText('');
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <Link
        to="/community"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discussions</span>
      </Link>

      {/* Main Post Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            Speedcubing
          </span>
          <span className="text-xs text-gray-400">• Discussion</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          How I dropped my 3x3 solve time from 1 minute to sub-30 seconds
        </h1>

        <div className="flex items-center gap-3 text-xs text-gray-500 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="font-bold text-gray-800 dark:text-gray-200">Aman Patel</span>
          <span>•</span>
          <span>1 day ago</span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          The biggest breakthrough for me was switching to full 2-Look OLL and practicing untimed F2L lookahead. Don't turn fast during F2L—turn smoothly and track the next pair. When you turn at high TPS without lookahead, you end up pausing 2-3 seconds between every single pair.
        </p>
      </div>

      {/* Replies Thread */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span>Responses ({replies.length})</span>
        </h3>

        {/* Existing replies */}
        <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          {replies.map(rep => (
            <div key={rep.id} className="pt-4 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>{rep.author}</span>
                </span>
                <span className="text-gray-400">
                  {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {rep.content}
              </p>
            </div>
          ))}
        </div>

        {/* Add reply form */}
        <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            Write a Reply
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Add your thoughts or answer..."
              className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
