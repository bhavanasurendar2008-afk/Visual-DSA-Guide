import React, { useState, useRef, useCallback } from 'react';
import { Play, RotateCcw, Plus, Minus } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `# Queue in Python (using deque)
from collections import deque

queue = deque()

# Enqueue (add to rear) — O(1)
queue.append(10)
queue.append(20)
queue.append(30)
print(queue)  # deque([10, 20, 30])

# Dequeue (remove from front) — O(1)
front = queue.popleft()  # 10
print(queue)  # deque([20, 30])

# Peek at front — O(1)
print(queue[0])  # 20

# Size
print(len(queue))  # 2

# NOTE: Never use list.pop(0) for a queue!
# list.pop(0) is O(n) — use deque.popleft() = O(1)`;

const CPP_CODE = `// Queue in C++ (STL)
#include <queue>
#include <iostream>
using namespace std;

int main() {
    queue<int> q;

    // Enqueue — O(1)
    q.push(10);
    q.push(20);
    q.push(30);

    // Front and Back
    cout << q.front();  // 10
    cout << q.back();   // 30

    // Dequeue — O(1)
    q.pop();
    cout << q.front();  // 20

    // Size
    cout << q.size();   // 2

    // Empty check
    if (q.empty()) cout << "Empty!";
}`;

const INITIAL = [10, 20, 30, 40];
const MAX = 7;

export function QueueContent() {
  const [queue, setQueue] = useState([...INITIAL]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<'front' | 'rear' | null>(null);
  const [message, setMessage] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [busy, setBusy] = useState(false);

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const reset = () => {
    setQueue([...INITIAL]);
    setHighlighted(null);
    setHighlight(null);
    setMessage('');
    setBusy(false);
  };

  const enqueue = useCallback(async () => {
    const val = Number(inputVal);
    if (!inputVal || isNaN(val)) return;
    if (queue.length >= MAX) { setMessage('Queue is full!'); return; }
    setBusy(true);
    setMessage(`Enqueuing ${val} at rear — O(1)`);
    setQueue(prev => [...prev, val]);
    setHighlight('rear');
    await sleep(800);
    setHighlight(null);
    setMessage(`${val} added to rear. FIFO: First in = first out.`);
    setBusy(false);
    setInputVal('');
  }, [queue, inputVal]);

  const dequeue = useCallback(async () => {
    if (queue.length === 0) { setMessage('Queue is empty!'); return; }
    setBusy(true);
    const front = queue[0];
    setHighlight('front');
    setMessage(`Dequeuing ${front} from front — O(1)`);
    await sleep(800);
    setQueue(prev => prev.slice(1));
    setHighlight(null);
    setMessage(`Removed ${front} from front.`);
    setBusy(false);
  }, [queue]);

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="What is a Queue?">
        A queue is a <strong>FIFO (First-In, First-Out)</strong> data structure. The first element added is the first to be removed — like a real queue at a ticket counter.
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { op: 'Enqueue', time: 'O(1)', desc: 'Add to rear' },
          { op: 'Dequeue', time: 'O(1)', desc: 'Remove from front' },
          { op: 'Peek/Front', time: 'O(1)', desc: 'View front element' },
          { op: 'Search', time: 'O(n)', desc: 'Check all elements' },
        ].map(({ op, time, desc }) => (
          <div key={op} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-primary-600 dark:text-primary-400">{op}</div>
            <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 px-2 py-0.5 rounded-full inline-block my-1">{time}</div>
            <div className="text-xs text-slate-500">{desc}</div>
          </div>
        ))}
      </div>
      <Alert type="tip" title="Real-World Applications">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>CPU scheduling</strong> — processes wait in a queue</li>
          <li><strong>Printer spooler</strong> — print jobs served in order</li>
          <li><strong>BFS traversal</strong> — graph exploration level by level</li>
          <li><strong>Network packets</strong> — buffered in FIFO order</li>
        </ul>
      </Alert>
      <Alert type="warning" title="Python Performance Trap">
        Never use <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">list.pop(0)</code> for queues — it is O(n) because every element must shift left. Use <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">collections.deque.popleft()</code> which is O(1).
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6">Queue (Front ← Remove | Add → Rear)</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-max">
            <span className="text-sm font-semibold text-green-600 dark:text-green-400 mr-2">FRONT</span>
            {queue.length === 0 ? (
              <div className="w-20 h-14 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center text-sm text-slate-400">empty</div>
            ) : (
              queue.map((val, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'w-16 h-14 rounded-xl flex items-center justify-center font-bold text-white transition-all duration-400',
                    highlight === 'front' && idx === 0
                      ? 'bg-red-500 scale-110 shadow-lg'
                      : highlight === 'rear' && idx === queue.length - 1
                      ? 'bg-green-500 scale-110 shadow-lg'
                      : idx === 0
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : idx === queue.length - 1
                      ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                      : 'bg-slate-600 dark:bg-slate-700'
                  )}
                >
                  {val}
                </div>
              ))
            )}
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 ml-2">REAR</span>
          </div>
        </div>
        {message && (
          <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Value..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="input w-28 text-sm"
            onKeyDown={e => e.key === 'Enter' && enqueue()}
          />
          <button onClick={enqueue} disabled={busy || !inputVal} className="btn-primary flex items-center gap-1 text-sm py-2 disabled:opacity-50">
            <Plus size={14} /> Enqueue
          </button>
        </div>
        <button onClick={dequeue} disabled={busy || queue.length === 0} className="btn-outline flex items-center gap-1 text-sm disabled:opacity-50">
          <Minus size={14} /> Dequeue
        </button>
        <button onClick={reset} className="btn-secondary flex items-center gap-1 text-sm">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );

  return (
    <TabGroup
      tabs={[
        { id: 'viz', label: '🎮 Visualization', content: visualization },
        { id: 'explain', label: '📖 Explanation', content: explanation },
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="queue.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="queue.cpp" /> },
      ]}
    />
  );
}
