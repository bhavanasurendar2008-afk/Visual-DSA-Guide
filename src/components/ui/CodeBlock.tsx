import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'python', title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langColors: Record<string, string> = {
    python: 'text-blue-400',
    cpp: 'text-orange-400',
    javascript: 'text-yellow-400',
    sql: 'text-green-400',
  };

  return (
    <div className={cn('rounded-xl overflow-hidden border border-slate-700/50', className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          {title && <span className="text-xs text-slate-400">{title}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('text-xs font-semibold font-mono', langColors[language] || 'text-slate-400')}>
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      {/* Code content */}
      <pre className="bg-slate-900 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code className="text-slate-100">{code}</code>
      </pre>
    </div>
  );
}
