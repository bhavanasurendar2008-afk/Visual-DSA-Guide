import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { BigOContent } from '../components/visualizations/BigOViz';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';

export function ComplexityPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Complexity <span className="gradient-text">Cheat Sheet</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Compare time and space complexity for the data structures and algorithms in this guide.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">
            <BarChart3 size={11} className="mr-1" /> Big-O reference
          </Badge>
          <Link
            to="/topics/big-o"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            Full lesson <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <Alert type="info" title="How to read these tables">
        These are the standard average-case complexities for the operations shown. Worst-case costs can
        be higher — for example, a Binary Search Tree becomes O(n) when it is completely unbalanced.
        Space complexity counts the extra memory used beyond the input.
      </Alert>

      <BigOContent />
    </div>
  );
}
