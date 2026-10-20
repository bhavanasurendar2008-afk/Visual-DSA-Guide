import React, { useState, useRef, useCallback } from 'react';
import { Play, RotateCcw, Search, Plus, Trash2 } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `# Arrays in Python
arr = [10, 20, 30, 40, 50]

# Access — O(1)
print(arr[2])   # 30

# Insert at end — O(1) amortized
arr.append(60)

# Insert at position — O(n)
arr.insert(2, 25)   # [10,20,25,30,40,50,60]

# Delete by index — O(n)
del arr[0]   # removes first element

# Search (linear) — O(n)
if 30 in arr:
    print('Found!')`;

const CPP_CODE = `// Arrays in C++
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {10, 20, 30, 40, 50};

    // Access — O(1)
    cout << arr[2];   // 30

    // Insert at end — O(1) amortized
    arr.push_back(60);

    // Insert at position — O(n)
    arr.insert(arr.begin() + 2, 25);

    // Delete — O(n)
    arr.erase(arr.begin());

    // Search — O(n)
    auto it = find(arr.begin(), arr.end(), 30);
    if (it != arr.end()) cout << "Found!";
}`;

const INITIAL = [10, 20, 30, 40, 50];

type Op = 'idle' | 'search' | 'insert' | 'delete';

export function ArraysContent() {
  const [arr, setArr] = useState([...INITIAL]);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [found, setFound] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [op, setOp] = useState<Op>('idle');
  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [insertIdx, setInsertIdx] = useState('');
  const [newNodes, setNewNodes] = useState<number[]>([]);
  const stepRef = useRef<ReturnType<typeof setTimeout>>();

  const reset = () => {
    clearTimeout(stepRef.current);
    setArr([...INITIAL]);
    setHighlighted([]);
    setFound(null);
    setMessage('');
    setOp('idle');
    setNewNodes([]);
  };

  const sleep = (ms: number) => new Promise<void>(r => { stepRef.current = setTimeout(r, ms); });

  const doSearch = useCallback(async () => {
    const target = Number(searchVal);
    if (!searchVal || isNaN(target)) return;
    setOp('search');
    setFound(null);
    setMessage(`Searching for ${target}...`);
    for (let i = 0; i < arr.length; i++) {
      setHighlighted([i]);
      setMessage(`Checking index ${i}: arr[${i}] = ${arr[i]}${arr[i] === target ? ' ✅ FOUND!' : ''}`);
      await sleep(700);
      if (arr[i] === target) {
        setFound(i);
        setMessage(`✅ Found ${target} at index ${i}! Time: O(n) in worst case.`);
        setOp('idle');
        return;
      }
    }
    setMessage(`❌ ${target} not found. Checked all ${arr.length} elements — O(n).`);
    setHighlighted([]);
    setOp('idle');
  }, [arr, searchVal]);

  const doInsert = useCallback(async () => {
    const val = Number(inputVal);
    const idx = insertIdx === '' ? arr.length : Number(insertIdx);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx > arr.length) return;
    setOp('insert');
    if (idx === arr.length) {
      setMessage(`Inserting ${val} at end (index ${idx}) — O(1).`);
      const newArr = [...arr, val];
      setNewNodes([idx]);
      setArr(newArr);
      await sleep(600);
      setHighlighted([idx]);
    } else {
      setMessage(`Shifting elements right from index ${idx} to make room — O(n).`);
      for (let i = arr.length - 1; i >= idx; i--) {
        setHighlighted([i]);
        await sleep(300);
      }
      const newArr = [...arr.slice(0, idx), val, ...arr.slice(idx)];
      setArr(newArr);
      setNewNodes([idx]);
      setHighlighted([idx]);
      setMessage(`Inserted ${val} at index ${idx}. Complexity: O(n) due to shifting.`);
    }
    await sleep(800);
    setHighlighted([]);
    setNewNodes([]);
    setOp('idle');
  }, [arr, inputVal, insertIdx]);

  const doDelete = useCallback(async (idx: number) => {
    if (op !== 'idle') return;
    setOp('delete');
    setHighlighted([idx]);
    setMessage(`Deleting element at index ${idx} (value: ${arr[idx]}). Shifting left...`);
    await sleep(600);
    for (let i = idx; i < arr.length - 1; i++) {
      setHighlighted([i, i + 1]);
      await sleep(250);
    }
    const newArr = arr.filter((_, i) => i !== idx);
    setArr(newArr);
    setHighlighted([]);
    setMessage(`Deleted. Remaining elements shifted left — O(n).`);
    setOp('idle');
  }, [arr, op]);

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="What is an Array?">
        An array stores elements in <strong>contiguous memory locations</strong>, making it possible to access any element instantly using its index. Think of it as a <strong>row of numbered lockers</strong> — you jump directly to locker #3 without checking 1 and 2.
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { op: 'Access arr[i]', time: 'O(1)', space: 'O(1)', note: 'Direct address calculation' },
          { op: 'Search (linear)', time: 'O(n)', space: 'O(1)', note: 'Check every element' },
          { op: 'Insert at end', time: 'O(1)*', space: 'O(1)', note: '*Amortized for dynamic' },
          { op: 'Insert at i', time: 'O(n)', space: 'O(1)', note: 'Must shift elements right' },
          { op: 'Delete at i', time: 'O(n)', space: 'O(1)', note: 'Must shift elements left' },
          { op: 'Delete at end', time: 'O(1)', space: 'O(1)', note: 'No shifting needed' },
        ].map(({ op: o, time, space, note }) => (
          <div key={o} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{o}</div>
            <div className="flex gap-3 mt-1">
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-mono">Time: {time}</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono">Space: {space}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{note}</div>
          </div>
        ))}
      </div>
      <Alert type="warning" title="Common Mistakes">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Confusing 0-based indexing — arr[0] is the first element, not arr[1]</li>
          <li>Assuming insert/delete at front is O(1) — it is O(n) due to shifting</li>
          <li>Using a fixed-size array when the number of elements is unknown</li>
        </ul>
      </Alert>
      <Alert type="tip" title="Practice Questions">
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Reverse an array in-place using two pointers</li>
          <li>Find the maximum subarray sum (Kadane's Algorithm)</li>
          <li>Rotate an array by k positions to the right</li>
          <li>Find all pairs in the array that sum to a target</li>
        </ol>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-6">
      {/* Array display */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Array State</h3>
        <div className="flex flex-wrap items-end gap-2 min-h-[80px]">
          {arr.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all duration-500',
                  newNodes.includes(idx) ? 'node-insert' : '',
                  highlighted.includes(idx)
                    ? found === idx
                      ? 'bg-green-500 border-green-400 text-white scale-110 shadow-lg shadow-green-500/30'
                      : 'bg-primary-500 border-primary-400 text-white scale-110 shadow-lg shadow-primary-500/30'
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:border-primary-400'
                )}
              >
                {val}
              </div>
              <div className="text-xs text-slate-400 font-mono">[{idx}]</div>
              <button
                onClick={() => doDelete(idx)}
                disabled={op !== 'idle'}
                className="text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {arr.length === 0 && (
            <p className="text-slate-400 italic text-sm">Array is empty. Insert some elements!</p>
          )}
        </div>
        {message && (
          <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700/30 text-sm text-primary-700 dark:text-primary-300 font-medium">
            {message}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search */}
        <div className="card p-4 space-y-3">
          <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Search size={15} /> Linear Search</h4>
          <input
            type="number"
            placeholder="Value to find..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="input text-sm"
          />
          <button
            onClick={doSearch}
            disabled={op !== 'idle'}
            className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play size={14} /> Search
          </button>
        </div>

        {/* Insert */}
        <div className="card p-4 space-y-3">
          <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Plus size={15} /> Insert Element</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="input text-sm"
            />
            <input
              type="number"
              placeholder="Index"
              value={insertIdx}
              onChange={e => setInsertIdx(e.target.value)}
              className="input text-sm w-24"
            />
          </div>
          <button
            onClick={doInsert}
            disabled={op !== 'idle' || !inputVal}
            className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> Insert
          </button>
        </div>
      </div>

      <button onClick={reset} className="btn-secondary flex items-center gap-2 text-sm">
        <RotateCcw size={14} /> Reset Array
      </button>
    </div>
  );

  return (
    <TabGroup
      tabs={[
        { id: 'viz', label: '🎮 Visualization', content: visualization },
        { id: 'explain', label: '📖 Explanation', content: explanation },
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="arrays.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="arrays.cpp" /> },
      ]}
    />
  );
}
