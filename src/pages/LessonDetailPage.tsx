import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LESSONS, Lesson } from '../core/data/lessonsData';
import { Cube3D } from '../components/3d/Cube3D';
import { createSolvedCube, CubeState } from '../core/cube/CubeState';
import { applyMoveSequence } from '../core/cube/CubeMoves';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../core/audio/SoundEffects';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const lessonIndex = LESSONS.findIndex(l => l.id === lessonId);
  const lesson: Lesson = LESSONS[lessonIndex] || LESSONS[0];

  const prevLesson = lessonIndex > 0 ? LESSONS[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < LESSONS.length - 1 ? LESSONS[lessonIndex + 1] : null;

  const [completed, setCompleted] = useState(() => {
    try {
      const done: string[] = JSON.parse(localStorage.getItem('cs4a_completed_lessons') || '[]');
      return done.includes(lesson.id);
    } catch {
      return false;
    }
  });

  // Calculate demonstration cube
  const [demoCube, setDemoCube] = useState<CubeState>(() => {
    const solved = createSolvedCube();
    if (lesson.keyAlgorithm) {
      return applyMoveSequence(solved, lesson.keyAlgorithm);
    }
    return solved;
  });

  const handleToggleComplete = () => {
    try {
      const done: string[] = JSON.parse(localStorage.getItem('cs4a_completed_lessons') || '[]');
      let updated: string[];
      if (completed) {
        updated = done.filter(id => id !== lesson.id);
        setCompleted(false);
      } else {
        updated = [...done, lesson.id];
        setCompleted(true);
        sounds.playVictory();
      }
      localStorage.setItem('cs4a_completed_lessons', JSON.stringify(updated));
    } catch {}
  };

  const handleRunKeyAlgorithm = () => {
    if (lesson.keyAlgorithm) {
      setDemoCube(applyMoveSequence(demoCube, lesson.keyAlgorithm));
      sounds.playTurn();
    }
  };

  const handleResetDemoCube = () => {
    setDemoCube(createSolvedCube());
    sounds.playTurn();
  };

  const localizedTitle =
    language === 'hi' ? lesson.titleHi : language === 'hinglish' ? lesson.titleHinglish : lesson.title;

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8">
      {/* Back button and stage pill */}
      <div className="flex items-center justify-between">
        <Link
          to="/learn"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Lessons</span>
        </Link>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          Stage {lesson.stageNumber} of {LESSONS.length}
        </span>
      </div>

      {/* Main Lesson Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {localizedTitle}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* 3D Interactive Demonstration Stage */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Interactive 3D Stage Demonstration</span>
          </span>

          <div className="flex items-center gap-2">
            {lesson.keyAlgorithm && (
              <button
                type="button"
                onClick={handleRunKeyAlgorithm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play: {lesson.keyAlgorithm}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetDemoCube}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Reset 3D Cube"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Cube3D cube={demoCube} interactive={false} autoRotate={false} className="w-full h-80 sm:h-96" />
      </div>

      {/* Content Breakdown: Overview, Steps, Tips, Common Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          {/* Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Lesson Overview</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {lesson.content.overview}
            </p>
          </div>

          {/* Action Steps */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Step-by-Step Instructions
            </h3>
            <div className="space-y-3">
              {lesson.content.steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed mt-0.5">{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Tips & Common Mistakes */}
        <div className="md:col-span-4 space-y-6">
          {/* Pro Tips */}
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Speedcuber Tips</span>
            </h4>
            <div className="space-y-2 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              {lesson.content.tips.map((tip, i) => (
                <p key={i}>• {tip}</p>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-3">
            <h4 className="text-sm font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Common Mistakes</span>
            </h4>
            <div className="space-y-2 text-xs text-red-800 dark:text-red-200 leading-relaxed">
              {lesson.content.commonMistakes.map((mistake, i) => (
                <p key={i}>• {mistake}</p>
              ))}
            </div>
          </div>

          {/* Mark Complete Action */}
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              completed
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{completed ? 'Lesson Completed ✓' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation: Previous / Next Lesson */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {prevLesson ? (
          <Link
            to={`/learn/${prevLesson.id}`}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: {prevLesson.title}</span>
          </Link>
        ) : <div />}

        {nextLesson && (
          <Link
            to={`/learn/${nextLesson.id}`}
            className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Next: {nextLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
