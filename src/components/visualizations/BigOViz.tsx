import React from 'react';
import { TabGroup } from '../ui/TabGroup';
import { Alert } from '../ui/Alert';
import { complexityData, dsaComplexityTable, sortingComplexityTable } from '../../data/complexity';
import { getComplexityColor } from '../../lib/utils';

function GrowthChart() {
  const ns = [1, 2, 4, 8, 16];
  const fns: Record<string, (n: number) => number> = {
    'O(1)': () => 1,
    'O(log n)': (n) => Math.log2(n),
    'O(n)': (n) => n,
    'O(n log n)': (n) => n * Math.log2(n),
    'O(n²)': (n) => n * n,
  };
  const maxVal = Math.max(...ns.flatMap(n => Object.values(fns).map(f => f(n))));
  const colors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];
  const labels = Object.keys(fns);

  return (
    <div className="card p-5">
      <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Growth Rate Comparison</h3>
      <div className="overflow-x-auto">
        <svg width="100%" viewBox="0 0 500 230" className="font-mono text-xs">
          {/* Grid lines + Y-axis ticks (0 to max operations) */}
          {[0, 0.25, 0.5, 0.75, 1].map(frac => {
            const y = 190 - frac * 180;
            return (
              <g key={frac}>
                <line x1="60" y1={y} x2="470" y2={y} stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-700" />
                <text x="52" y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="10">
                  {Math.round(frac * maxVal)}
                </text>
              </g>
            );
          })}

          {/* X labels (n values) — inside the viewBox so they are not clipped */}
          {ns.map((n, i) => {
            const x = 60 + (i / (ns.length - 1)) * 410;
            return <text key={n} x={x} y="212" textAnchor="middle" fill="#94a3b8" fontSize="10">n={n}</text>;
          })}

          {/* Y label */}
          <text x="15" y="100" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(-90 15 100)">operations</text>

          {/* Lines */}
          {labels.map((label, li) => {
            const color = colors[li];
            const points = ns.map((n, i) => {
              const x = 60 + (i / (ns.length - 1)) * 410;
              const raw = fns[label](n);
              const y = 190 - (raw / maxVal) * 180;
              return `${x},${Math.max(5, y)}`;
            });
            return (
              <polyline
                key={label}
                points={points.join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: colors[i] }} />
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BigOContent() {
  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="What is Big-O Notation?">
        Big-O notation describes how the <strong>running time or space</strong> of an algorithm grows as the input size (n) increases. It gives an upper bound — the <em>worst-case</em> scenario. We ignore constants and lower-order terms.
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {complexityData.map(({ name, notation, description, example, color }) => (
          <div key={notation} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-bold text-slate-800 dark:text-white">{name}</span>
                <div className="text-xs text-slate-500 mt-0.5">{description}</div>
              </div>
              <span
                className="px-2 py-1 rounded-lg text-white text-xs font-mono font-bold"
                style={{ backgroundColor: color }}
              >
                {notation}
              </span>
            </div>
            <div className="text-xs text-slate-500 italic">{example}</div>
          </div>
        ))}
      </div>

      <Alert type="tip" title="Rules for Calculating Big-O">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li><strong>Drop constants</strong>: O(2n) → O(n)</li>
          <li><strong>Drop lower-order terms</strong>: O(n² + n) → O(n²)</li>
          <li><strong>Sequential steps → add</strong>: O(n) + O(n²) → O(n²)</li>
          <li><strong>Nested loops → multiply</strong>: 2 loops over n → O(n²)</li>
          <li><strong>Halving pattern → log</strong>: binary search halves → O(log n)</li>
        </ol>
      </Alert>

      <Alert type="warning" title="Common Mistakes">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Confusing Big-O (upper bound) with exact performance</li>
          <li>O(n log n) is NOT O(n) × O(log n) in different algorithms — it means one algorithm doing n log n operations</li>
          <li>Forgetting space complexity — always analyse both time AND space</li>
        </ul>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-6">
      <GrowthChart />

      {/* DSA Complexity Table */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Data Structure Complexity Cheat Sheet</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="text-left p-2.5 rounded-tl-lg">Data Structure</th>
                <th className="p-2.5 text-center">Access</th>
                <th className="p-2.5 text-center">Search</th>
                <th className="p-2.5 text-center">Insert</th>
                <th className="p-2.5 text-center">Delete</th>
                <th className="p-2.5 text-center rounded-tr-lg">Space</th>
              </tr>
            </thead>
            <tbody>
              {dsaComplexityTable.map(({ ds, access, search, insert, delete: del, space }, i) => (
                <tr key={ds} className={i % 2 === 0 ? 'bg-white dark:bg-slate-800/20' : 'bg-slate-50 dark:bg-slate-800/50'}>
                  <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{ds}</td>
                  {[access, search, insert, del, space].map((v, j) => (
                    <td key={j} className="p-2.5 text-center font-mono" style={{ color: getComplexityColor(v) }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sorting Complexity */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Sorting Algorithm Complexity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="text-left p-2.5 rounded-tl-lg">Algorithm</th>
                <th className="p-2.5 text-center">Best</th>
                <th className="p-2.5 text-center">Average</th>
                <th className="p-2.5 text-center">Worst</th>
                <th className="p-2.5 text-center">Space</th>
                <th className="p-2.5 text-center rounded-tr-lg">Stable</th>
              </tr>
            </thead>
            <tbody>
              {sortingComplexityTable.map(({ algo, best, average, worst, space, stable }, i) => (
                <tr key={algo} className={i % 2 === 0 ? 'bg-white dark:bg-slate-800/20' : 'bg-slate-50 dark:bg-slate-800/50'}>
                  <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{algo}</td>
                  <td className="p-2.5 text-center font-mono text-green-700 dark:text-green-400">{best}</td>
                  <td className="p-2.5 text-center font-mono text-yellow-700 dark:text-yellow-400">{average}</td>
                  <td className="p-2.5 text-center font-mono text-red-700 dark:text-red-400">{worst}</td>
                  <td className="p-2.5 text-center font-mono">{space}</td>
                  <td className="p-2.5 text-center">{stable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <TabGroup
      tabs={[
        { id: 'viz', label: '📈 Charts', content: visualization },
        { id: 'explain', label: '📖 Explanation', content: explanation },
      ]}
    />
  );
}
