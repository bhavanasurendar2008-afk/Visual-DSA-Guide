import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, className, showLabel = false, color = 'primary', size = 'md' }: ProgressBarProps) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colors = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500',
    green: 'bg-gradient-to-r from-green-400 to-emerald-500',
    yellow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    red: 'bg-gradient-to-r from-red-400 to-rose-500',
  };
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium mb-1">
          <span className="text-slate-600 dark:text-slate-400">Progress</span>
          <span className="text-primary-600 dark:text-primary-400">{clamped}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[color])}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
