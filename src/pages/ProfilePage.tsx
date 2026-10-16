import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLocalSolveHistory, SolveRecord } from '../lib/supabase';
import {
  User,
  Shield,
  Download,
  Trash2,
  Mail,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, signOut, isConfigured, signInWithGoogle } = useAuth();
  const [solves] = useState<SolveRecord[]>(() => getLocalSolveHistory());

  const handleExportData = () => {
    const data = {
      user: profile,
      solves,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cube-solve-4-ai-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to delete all local solves and progress? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      {/* Profile Card Header */}
      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/25">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-3xl" />
          ) : (
            profile?.displayName?.charAt(0).toUpperCase() || 'C'
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {profile?.displayName || 'Speedcuber Guest'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {profile?.tier || 'Free Plan'}
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {profile?.email || 'Local guest session (Data persisted in browser IndexedDB & LocalStorage)'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" /> {solves.length} Total Solves
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Active Today
            </span>
          </div>
        </div>

        <div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* Account Preferences & Data Export */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <span>Data Privacy & Account Controls</span>
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                Export Solving & Practice Data
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Download a JSON copy of all your verified solves, algorithms, and timer records.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 gap-4">
            <div>
              <h4 className="text-xs font-bold text-red-900 dark:text-red-300">
                Clear Local Browser Storage
              </h4>
              <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-0.5">
                Deletes all local solves, lesson completion checks, and favorites from this browser.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearLocalData}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
