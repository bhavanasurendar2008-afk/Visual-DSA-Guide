import React, { useState, useRef, useCallback } from 'react';
import { Play, RotateCcw, Plus, Minus, Eye } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `# Stack in Python (using list)
stack = []

# Push — O(1)
stack.append(10)
stack.append(20)
stack.append(30)
print(stack)   # [10, 20, 30]

# Peek — O(1)
top = stack[-1]   # 30 (doesn't remove)

# Pop — O(1)
popped = stack.pop()   # 30
print(stack)   # [10, 20]

# Check empty
if not stack:
    print("Empty!")

# Real use: Balanced brackets
def is_balanced(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in ')]}' :
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return len(stack) == 0`;

const CPP_CODE = `// Stack in C++ (STL)
#include <stack>
#include <iostream>
using namespace std;

int main() {
    stack<int> s;

    // Push — O(1)
    s.push(10);
    s.push(20);
    s.push(30);

    // Peek — O(1)
    cout << s.top();   // 30

    // Pop — O(1)
    s.pop();
    cout << s.top();   // 20

    // Size
    cout << s.size();  // 2

    // Empty check
    if (s.empty()) cout << "Empty!";
}`;

const MAX_SIZE = 8;

export function StackContent() {
  const [stack, setStack] = useState([10, 20, 30]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [busy, setBusy] = useState(false);
  const stepRef = useRef<ReturnType<typeof setTimeout>>();

  const sleep = (ms: number) => new Promise<void>(r => { stepRef.current = setTimeout(r, ms); });

  const reset = () => {
    clearTimeout(stepRef.current);
    setStack([10, 20, 30]);
    setHighlighted(null);
    setMessage('');
    setBusy(false);
  };

  const push = useCallback(async () => {
    const val = Number(inputVal);
    if (!inputVal || isNaN(val)) return;
    if (stack.length >= MAX_SIZE) { setMessage('Stack is full! (Overflow)'); return; }
    setBusy(true);
    setMessage(`Pushing ${val} onto top of stack — O(1)`);
    const newStack = [...stack, val];
    setStack(newStack);
    setHighlighted(newStack.length - 1);
    await sleep(800);
    setHighlighted(null);
    setMessage(`${val} is now on top.`);
    setBusy(false);
    setInputVal('');
  }, [stack, inputVal]);

  const pop = useCallback(async () => {
    if (stack.length === 0) { setMessage('Stack is empty! (Underflow)'); return; }
    setBusy(true);
    const top = stack[stack.length - 1];
    setHighlighted(stack.length - 1);
    setMessage(`Popping ${top} from top — O(1)`);
    await sleep(700);
    setStack(prev => prev.slice(0, -1));
    setHighlighted(null);
    setMessage(`Removed ${top}. New top: ${stack.length > 1 ? stack[stack.length - 2] : 'empty'}`);
    setBusy(false);
  }, [stack]);

  const peek = useCallback(async () => {
    if (stack.length === 0) { setMessage('Stack is empty!'); return; }
    const top = stack[stack.length - 1];
    setHighlighted(stack.length - 1);
    setMessage(`Peek: Top element is ${top} — O(1). Not removed.`);
    await sleep(1500);
    setHighlighted(null);
  }, [stack]);

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="What is a Stack?">
        A stack is a <strong>LIFO (Last-In, First-Out)</strong> data structure. The last element added is the first to be removed — like a stack of plates: you add and remove from the top only.
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { op: 'Push', time: 'O(1)', desc: 'Add to top' },
          { op: 'Pop', time: 'O(1)', desc: 'Remove from top' },
          { op: 'Peek', time: 'O(1)', desc: 'View top without removing' },
        ].map(({ op, time, desc }) => (
          <div key={op} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <div className="font-bold text-primary-600 dark:text-primary-400 text-lg">{op}</div>
            <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 px-2 py-0.5 rounded-full inline-block my-1">{time}</div>
            <div className="text-xs text-slate-500">{desc}</div>
          </div>
        ))}
      </div>
      <Alert type="tip" title="Real-World Uses of Stacks">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Browser Back button</strong> — push current page, pop on back</li>
          <li><strong>Undo/Redo</strong> — push actions, pop to undo</li>
          <li><strong>Function call stack</strong> — each function call is pushed</li>
          <li><strong>Balanced brackets checker</strong> — push opens, pop on close</li>
          <li><strong>DFS graph traversal</strong> — uses stack (explicit or recursion)</li>
        </ul>
      </Alert>
      <Alert type="warning" title="Common Mistakes">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Stack <strong>overflow</strong>: pushing too many elements (infinite recursion)</li>
          <li>Stack <strong>underflow</strong>: popping from an empty stack — always check first!</li>
          <li>Confusing stack with queue — stack is LIFO, queue is FIFO</li>
        </ul>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Stack (Top is the last pushed)</h3>
        <div className="flex gap-8 items-end">
          {/* Stack visual */}
          <div className="flex flex-col-reverse gap-1 min-h-[240px] justify-start">
            {stack.length === 0 ? (
              <div className="w-28 h-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center text-sm text-slate-400">empty</div>
            ) : (
              stack.map((val, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'w-28 h-12 rounded-xl flex items-center justify-center font-bold text-white border-2 transition-all duration-400',
                    idx === stack.length - 1 ? 'border-white/40' : 'border-transparent',
                    highlighted === idx
                      ? 'bg-yellow-500 scale-110 shadow-lg shadow-yellow-500/30'
                      : idx === stack.length - 1
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-md'
                      : 'bg-slate-600 dark:bg-slate-700'
                  )}
                >
                  {val}
                  {idx === stack.length - 1 && <span className="ml-1 text-xs opacity-70">← TOP</span>}
                </div>
              ))
            )}
          </div>
          {/* Legend */}
          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
            <div>Size: <strong className="text-slate-800 dark:text-white">{stack.length}</strong></div>
            <div>Max: <strong className="text-slate-800 dark:text-white">{MAX_SIZE}</strong></div>
            {stack.length > 0 && <div>Top: <strong className="text-primary-600 dark:text-primary-400">{stack[stack.length - 1]}</strong></div>}
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
            onKeyDown={e => e.key === 'Enter' && push()}
          />
          <button onClick={push} disabled={busy || !inputVal} className="btn-primary flex items-center gap-1 text-sm py-2 disabled:opacity-50">
            <Plus size={14} /> Push
          </button>
        </div>
        <button onClick={pop} disabled={busy || stack.length === 0} className="btn-outline flex items-center gap-1 text-sm disabled:opacity-50">
          <Minus size={14} /> Pop
        </button>
        <button onClick={peek} disabled={busy || stack.length === 0} className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-50">
          <Eye size={14} /> Peek
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
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="stack.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="stack.cpp" /> },
      ]}
    />
  );
}
