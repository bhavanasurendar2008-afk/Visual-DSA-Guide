import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

export function Card({ children, className, hover = false, onClick, gradient = false }: CardProps) {
  return (
    <div
      className={cn(
        'card p-6',
        hover && 'hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer hover:-translate-y-0.5',
        gradient && 'bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-bold text-slate-900 dark:text-white text-lg', className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-slate-600 dark:text-slate-400', className)}>{children}</div>;
}
