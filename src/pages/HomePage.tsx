import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cube3D } from '../components/3d/Cube3D';
import { createSolvedCube, CubeState } from '../core/cube/CubeState';
import { getScrambledCube } from '../core/cube/ScrambleGenerator';
import { useLanguage } from '../context/LanguageContext';
import {
  Boxes,
  Camera,
  Paintbrush,
  BookOpen,
  Timer,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [heroCube, setHeroCube] = useState<CubeState>(() => getScrambledCube(12).cube);

  const handleHeroScramble = () => {
    const { cube } = getScrambledCube(15);
    setHeroCube(cube);
  };

  const handleHeroReset = () => {
    setHeroCube(createSolvedCube());
  };

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-blue-950/20 dark:via-gray-900 dark:to-gray-900 border border-gray-200/80 dark:border-gray-800 p-6 sm:p-10 lg:p-14 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Two-Phase Kociemba 3D Solver Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.1]">
              Solve Any Rubik’s Cube in{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                Seconds
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Enter your cube colors manually or scan with your camera. Follow realistic 3D move-by-move animations and physically solve your cube with 100% verified mathematical correctness.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/solve"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('app.solveCTA')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/learn"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('app.learnCTA')}</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Real Kociemba Algorithm
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-blue-500" /> Physical Checklist Mode
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" /> WebRTC Camera Scanner
              </span>
            </div>
          </div>

          {/* Right Interactive Hero 3D Cube */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm relative">
              <Cube3D
                cube={heroCube}
                interactive={false}
                autoRotate={true}
                className="w-full h-72 sm:h-80 rounded-3xl"
              />
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleHeroScramble}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Scramble Cube
                </button>
                <button
                  type="button"
                  onClick={handleHeroReset}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Reset Solved
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Quick-Start Entry Methods */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            How Would You Like to Start?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Choose your preferred method to enter your physical Rubik's Cube state or begin learning from square one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Manual Paint */}
          <Link
            to="/solve?tab=manual"
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Paintbrush className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Manual Color Entry
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Click on the 3D cube or 2D net layout to paint each face's colors. Features real-time sticker count and legal cube parity validation.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Open Color Painter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Camera Scanner */}
          <Link
            to="/solve?tab=camera"
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Webcam & Camera Scan
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Hold each face to your camera. Our image-processing algorithm auto-classifies the 9 stickers with confidence scoring and manual touchup.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Camera Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Learn from Scratch */}
          <Link
            to="/learn"
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Learn to Solve
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Step-by-step beginner course covering White Cross, Corners, Middle Layer, Yellow Cross, Sune, and PLL with interactive 3D demonstrations.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Start Learning Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Feature Grid: Speed Timer, Algorithms, Multi-Language */}
      <section className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Speedcubing Practice Timer
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                WCA 15-second inspection timer with audio cues, spacebar / touch hold-to-start, and automatic Ao5 and Ao12 calculations.
              </p>
              <Link to="/practice" className="inline-block mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Open Timer →
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                70+ Algorithm Library
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Searchable F2L, OLL, PLL, and Roux algorithms with 3D mini preview cubes, difficulty tags, and one-click copy.
              </p>
              <Link to="/algorithms" className="inline-block mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Explore Algorithms →
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Progress & Stats Dashboard
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Track total solves, personal bests, average solving times, and learning course completion milestones.
              </p>
              <Link to="/dashboard" className="inline-block mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
