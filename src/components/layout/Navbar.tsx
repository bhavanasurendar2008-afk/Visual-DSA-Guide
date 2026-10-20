import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, BookOpen, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-slate-200 dark:border-slate-700/50">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left — menu + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-primary-500/30 transition-shadow">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:block">
              DSA <span className="gradient-text">Visual</span>
            </span>
          </Link>
        </div>

        {/* Center — search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search topics..."
              className="input pl-9 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/topics?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                }
              }}
            />
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
          <Link
            to="/quiz"
            className={cn(
              'hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              location.pathname.startsWith('/quiz')
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100'
            )}
          >
            🎯 Quiz
          </Link>
        </div>
      </div>
    </header>
  );
}
