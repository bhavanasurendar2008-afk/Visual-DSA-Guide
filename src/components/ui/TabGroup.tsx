import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function TabGroup({ tabs, defaultTab, className }: TabGroupProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  const current = tabs.find(t => t.id === active);

  return (
    <div className={className}>
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              active === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">{current?.content}</div>
    </div>
  );
}
