import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, GitBranch, Heart, Shield, HelpCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Boxes className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white tracking-tight">
                Cube Solve 4 Ai
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Real 3x3 Rubik's Cube solver, interactive 3D visualizer, WCA practice timer, and learning platform.
            </p>
          </div>

          {/* Quick Solver Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Features</h4>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/solve" className="hover:text-blue-500">Manual Paint Solver</Link></li>
              <li><Link to="/solve" className="hover:text-blue-500">Camera Color Scanner</Link></li>
              <li><Link to="/practice" className="hover:text-blue-500">Speedcubing Timer (WCA)</Link></li>
              <li><Link to="/algorithms" className="hover:text-blue-500">Algorithm Library (OLL/PLL)</Link></li>
            </ul>
          </div>

          {/* Learn & Community */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Resources</h4>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/learn" className="hover:text-blue-500">Beginner's Method Course</Link></li>
              <li><Link to="/learn" className="hover:text-blue-500">CFOP Advanced Method</Link></li>
              <li><Link to="/community" className="hover:text-blue-500">Cuber Forum & Q&A</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-500">Plans & Pricing</Link></li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Help & Legal</h4>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <li><Link to="/help" className="hover:text-blue-500 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> Physical Cube Guide</Link></li>
              <li><Link to="/about" className="hover:text-blue-500">About & Architecture</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Cube Solve 4 Ai. Built with genuine two-phase Kociemba engine.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made for cubers worldwide <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
            </span>
            <a
              href="https://github.com/thevloger2024"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
            >
              <GitBranch className="w-4 h-4" /> thevloger2024
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
