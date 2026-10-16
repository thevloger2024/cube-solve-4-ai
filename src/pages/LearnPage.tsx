import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS, Lesson } from '../core/data/lessonsData';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Advanced'>('All');

  const [completedLessonIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cs4a_completed_lessons') || '[]');
    } catch {
      return [];
    }
  });

  const filteredLessons = LESSONS.filter(l =>
    filterLevel === 'All' ? true : l.level === filterLevel
  );

  const completionPercent = Math.round(
    (completedLessonIds.length / LESSONS.length) * 100
  );

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-200">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Cubing Academy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Learn Rubik's Cube from Scratch
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Follow our proven, step-by-step curriculum with interactive 3D demonstrations. From zero knowledge to solving under 2 minutes.
          </p>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-blue-200 font-bold mb-1">
              <span>Course Progress</span>
              <span>{completionPercent}% Completed</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          {(['All', 'Beginner', 'Advanced'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterLevel === lvl
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {lvl} Track
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500 font-medium hidden sm:block">
          Showing {filteredLessons.length} lessons
        </span>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => {
          const isDone = completedLessonIds.includes(lesson.id);
          const localizedTitle =
            language === 'hi' ? lesson.titleHi : language === 'hinglish' ? lesson.titleHinglish : lesson.title;

          return (
            <Link
              key={lesson.id}
              to={`/learn/${lesson.id}`}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    Stage {lesson.stageNumber} • {lesson.level}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-500">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {localizedTitle}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {lesson.description}
                </p>

                {lesson.keyAlgorithm && (
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-950 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    Key: {lesson.keyAlgorithm}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {lesson.durationMin} mins
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
