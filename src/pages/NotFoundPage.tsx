import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, LayoutDashboard, Library, Target } from 'lucide-react';

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="max-w-2xl mx-auto text-center py-16 animate-slide-up">
      <div className="text-5xl mb-4">🧭</div>
      <p className="text-sm font-mono text-slate-400 dark:text-slate-500 mb-2">
        {pathname}
      </p>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
        Page <span className="gradient-text">not found</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        That link doesn’t match any page in the guide. Try one of these instead.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link to="/topics" className="btn-secondary inline-flex items-center gap-2">
          <Library size={16} /> All topics
        </Link>
        <Link to="/quiz" className="btn-outline inline-flex items-center gap-2">
          <Target size={16} /> Take a quiz
        </Link>
      </div>
      <p className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Compass size={12} /> Tip: use the search bar at the top or the sidebar to navigate.
      </p>
    </div>
  );
}
