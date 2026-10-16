import React from 'react';
import { useTheme, Theme } from '../context/ThemeContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { sounds } from '../core/audio/SoundEffects';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [soundEnabled, setSoundEnabled] = React.useState(sounds.enabled);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playTurn();
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Preferences & Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Customize your visual theme, dialect, sound feedback, and solver controls.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Appearance & Theme</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light' as Theme, label: 'Light Mode', icon: Sun },
              { id: 'dark' as Theme, label: 'Dark Mode', icon: Moon },
              { id: 'system' as Theme, label: 'System Theme', icon: Laptop },
            ].map(m => {
              const Icon = m.icon;
              const isSelected = theme === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTheme(m.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Language & Localization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'en' as Language, label: 'English', desc: 'Standard international cubing notation & terms' },
              { id: 'hi' as Language, label: 'हिन्दी (Hindi)', desc: 'शुद्ध देवनागरी लिपि और चरण-दर-चरण निर्देश' },
              { id: 'hinglish' as Language, label: 'Hinglish', desc: 'Conversational Hindi in English alphabet' },
            ].map(l => {
              const isSelected = language === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <span className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    {l.label}
                  </span>
                  <span className="text-[11px] text-gray-500 leading-relaxed">
                    {l.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio & Sound Feedback */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <span>Audio & Haptics</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                Procedural Sound Effects
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Play realistic mechanical cube clicks on each turn and victory fanfare upon completion.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 border-transparent'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
