import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

type AlertType = 'info' | 'success' | 'warning' | 'error' | 'tip';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'info', title, children, className }: AlertProps) {
  const styles: Record<AlertType, { wrapper: string; icon: React.ReactNode }> = {
    info: {
      wrapper: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40 text-blue-800 dark:text-blue-300',
      icon: <Info size={16} className="text-blue-500" />,
    },
    success: {
      wrapper: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/40 text-green-800 dark:text-green-300',
      icon: <CheckCircle size={16} className="text-green-500" />,
    },
    warning: {
      wrapper: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/40 text-yellow-800 dark:text-yellow-300',
      icon: <AlertTriangle size={16} className="text-yellow-500" />,
    },
    error: {
      wrapper: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40 text-red-800 dark:text-red-300',
      icon: <AlertCircle size={16} className="text-red-500" />,
    },
    tip: {
      wrapper: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/40 text-purple-800 dark:text-purple-300',
      icon: <span>💡</span>,
    },
  };
  const { wrapper, icon } = styles[type];
  return (
    <div className={cn('rounded-xl border p-4', wrapper, className)}>
      <div className="flex gap-3">
        <span className="mt-0.5 flex-shrink-0">{icon}</span>
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
