import React from 'react';
import { Shield, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
          Privacy Policy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Your Privacy is Paramount
        </h1>
        <p className="text-xs text-gray-500">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-blue-500" />
            <span>1. Camera Feed Processing Never Leaves Your Device</span>
          </h3>
          <p>
            When using the Camera Scanner, video frames are processed 100% locally in your browser memory using an HTML5 offscreen canvas. We never upload, save, or transmit your camera video or photos to any external server.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span>2. Local Storage and Guest Persistence</span>
          </h3>
          <p>
            For guest users, all solve logs, algorithm bookmarks, and theme preferences are stored exclusively on your device via browser LocalStorage and IndexedDB. You can export or delete your local data at any time from your Profile settings.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-500" />
            <span>3. Authenticated Cloud Sync</span>
          </h3>
          <p>
            If you sign in using Google OAuth via Supabase, we store only your public display name, email, and synchronized solve session timestamps. We never sell or share user data with third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
};
