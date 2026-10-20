import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, Trophy, FileText,
  TrendingUp, BarChart3, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard',   path: '/dashboard',  icon: LayoutDashboard },
  { label: 'Topics',      path: '/topics',      icon: BookOpen },
  { label: 'Quiz',        path: '/quiz',        icon: Trophy },
  { label: 'Revision',    path: '/revision',    icon: FileText },
  { label: 'Complexity',  path: '/complexity',  icon: BarChart3 },
  { label: 'Progress',    path: '/progress',    icon: TrendingUp },
];

const dsaTopics = [
  { label: '📦 Arrays',          path: '/topics/arrays' },
  { label: '🔗 Linked Lists',    path: '/topics/linked-lists' },
  { label: '📚 Stacks',          path: '/topics/stacks' },
  { label: '🚶 Queues',          path: '/topics/queues' },
  { label: '🌳 Trees & BST',     path: '/topics/trees' },
  { label: '🕸️ Graphs',          path: '/topics/graphs' },
  { label: '🔢 Sorting',         path: '/topics/sorting' },
  { label: '📈 Big-O',           path: '/topics/big-o' },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 overflow-y-auto transition-transform duration-300',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 space-y-6">
          {/* Close on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={16} />
          </button>

          {/* Main navigation */}
          <nav>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">
              Navigation
            </p>
            <ul className="space-y-1">
              {navItems.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      cn('nav-link', isActive && 'active')
                    }
                    onClick={onClose}
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* DSA Topics */}
          <nav>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">
              DSA Topics
            </p>
            <ul className="space-y-1">
              {dsaTopics.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      cn('nav-link text-xs', isActive && 'active')
                    }
                    onClick={onClose}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Info card */}
          <div className="mx-1 p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-700/30">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">💡 Daily Tip</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Practice one DSA topic daily. Consistency beats cramming!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
