import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-gray-500">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            1. Acceptance of Terms
          </h3>
          <p>
            By accessing or using Cube Solve 4 Ai, you agree to comply with and be bound by these Terms of Service. If you do not agree, you may discontinue use of the platform at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            2. Intellectual Property & Fair Use
          </h3>
          <p>
            The software, interactive 3D visualizations, and custom educational content are proprietary to Cube Solve 4 Ai. "Rubik's Cube" is a registered trademark of Spin Master Toys UK Limited, used here strictly for descriptive educational purposes under fair use.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            3. Disclaimer of Warranty
          </h3>
          <p>
            Cube Solve 4 Ai is provided "as is" without warranty of any kind. While our mathematical solver verifies solutions before rendering, we cannot guarantee performance on defective or physically modified cubes with altered internal cores.
          </p>
        </section>
      </div>
    </div>
  );
};
