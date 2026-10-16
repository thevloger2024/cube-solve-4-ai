import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Cpu, Code2, Award, Heart, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-8 max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          Product Story & Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          About Cube Solve 4 Ai
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          The mission of Cube Solve 4 Ai is to demystify the Rubik's Cube through interactive 3D computer graphics, mathematical group theory, and computer vision.
        </p>
      </div>

      {/* Engineering Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Herbert Kociemba's Two-Phase Algorithm
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Rather than relying on generic brute-force graph search, our engine leverages Herbert Kociemba’s renowned two-phase algorithm. Phase 1 reduces the cube into a subgroup solvable using only double turns of F, B, L, and R, and Phase 2 finds near-optimal solutions (around 20–22 moves) in milliseconds.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            High-Performance 3D Graphics
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Built using Three.js hardware-accelerated WebGL pipelines with orbit camera mechanics, dynamic lighting, and physical layer rotation animations. Every sticker is bound directly to underlying permutation state matrices.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Mathematical Parity Verification
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Before executing any solving computation, our validator guarantees that sticker counts, edge pairings, corner orientations, and permutation parities are strictly legal and solvable.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Physical-First Guidance
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            We never auto-advance user turns without confirmation. Our step-by-step checklist ensures cubers perform the exact physical moves on their physical cubes with confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
