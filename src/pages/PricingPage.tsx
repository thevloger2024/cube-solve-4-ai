import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="py-10 max-w-5xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Level Up Your Cubing
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Core solving is always 100% free. Upgrade for deep analytics, advanced CFOP drills, and cloud sync.
        </p>

        {/* Billing cycle toggle */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mt-4">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'yearly'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Yearly (Save 35%)
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Community Free
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900 dark:text-white">$0</span>
              <span className="text-xs text-gray-500">/ forever</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Everything you need to solve any physical 3x3 cube, time your practice, and learn the fundamentals.
            </p>

            <ul className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Two-Phase Kociemba optimal 3x3 solver</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Interactive 3D animated step-by-step guidance</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Camera scanner with color calibration</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Beginner layer-by-layer learning curriculum</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Official WCA practice timer with Ao5/Ao12</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="w-full py-3.5 rounded-2xl border border-gray-300 dark:border-gray-700 font-bold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Included by Default
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-900/10 via-white to-white dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-900 border-2 border-blue-500 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-md">
              POPULAR
            </span>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Speedcuber Pro
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {billingCycle === 'yearly' ? '$3.25' : '$4.99'}
              </span>
              <span className="text-xs text-gray-500">/ month</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed for cubers looking to drop solve times to sub-20 with full OLL/PLL algorithm drills and cloud stats.
            </p>

            <ul className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Everything in Community Free</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Complete 57 OLL & 21 PLL interactive drills</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Advanced CFOP, Roux, and ZZ method deep dives</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Unlimited multi-device cloud synchronization</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Detailed solving graphs & lookahead drill mode</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Upgrade Simulation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Upgrade to Speedcuber Pro
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Payment gateway integration is ready for Stripe/Razorpay backend configuration. All core 3x3 solving features remain 100% free!
            </p>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
