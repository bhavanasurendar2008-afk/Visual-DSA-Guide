import React, { useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`;

const CPP_CODE = `#include <vector>
#include <algorithm>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        swap(arr[i], arr[minIdx]);
    }
}

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key)
            arr[j + 1] = arr[j--];
        arr[j + 1] = key;
    }
}`;

type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

interface SortStep {
  arr: number[];
  comparing: number[];
  swapped: number[];
  sorted: number[];
  message: string;
}

function generateBubbleSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ arr: [...a], comparing: [j, j + 1], swapped: [], sorted: [...sorted], message: `Comparing a[${j}]=${a[j]} with a[${j+1}]=${a[j+1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ arr: [...a], comparing: [], swapped: [j, j + 1], sorted: [...sorted], message: `Swapped! ${a[j+1]} > ${a[j]} ← now in order` });
      }
    }
    sorted.push(n - 1 - i);
  }
  sorted.push(0);
  steps.push({ arr: [...a], comparing: [], swapped: [], sorted: [...sorted], message: '✅ Array sorted!' });
  return steps;
}

function generateSelectionSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ arr: [...a], comparing: [minIdx, j], swapped: [], sorted: [...sorted], message: `Finding min: comparing a[${minIdx}]=${a[minIdx]} with a[${j}]=${a[j]}` });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ arr: [...a], comparing: [], swapped: [i, minIdx], sorted: [...sorted], message: `Placed minimum ${a[i]} at index ${i}` });
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  steps.push({ arr: [...a], comparing: [], swapped: [], sorted: [...sorted], message: '✅ Array sorted!' });
  return steps;
}

function generateInsertionSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ arr: [...a], comparing: [i], swapped: [], sorted: Array.from({ length: i }, (_, k) => k), message: `Key = ${key} at index ${i}, inserting into sorted portion` });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      steps.push({ arr: [...a], comparing: [j, j + 1], swapped: [], sorted: [], message: `Shifting ${a[j + 1]} right to make room` });
      j--;
    }
    a[j + 1] = key;
  }
  steps.push({ arr: [...a], comparing: [], swapped: [], sorted: Array.from({ length: n }, (_, k) => k), message: '✅ Array sorted!' });
  return steps;
}

const INITIAL_ARR = [64, 34, 25, 12, 22, 11, 90];
const ALGOS: { id: SortAlgo; label: string; best: string; avg: string; worst: string }[] = [
  { id: 'bubble', label: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
  { id: 'selection', label: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' },
  { id: 'insertion', label: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
];

export function SortingContent() {
  const [algo, setAlgo] = useState<SortAlgo>('bubble');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const currentStep = steps[stepIdx];
  const displayArr = currentStep ? currentStep.arr : INITIAL_ARR;

  const reset = () => {
    clearInterval(intervalRef.current);
    setSteps([]);
    setStepIdx(0);
    setPlaying(false);
    setGenerated(false);
  };

  const generate = (selectedAlgo: SortAlgo) => {
    reset();
    let s: SortStep[] = [];
    const arr = [...INITIAL_ARR];
    if (selectedAlgo === 'bubble') s = generateBubbleSteps(arr);
    else if (selectedAlgo === 'selection') s = generateSelectionSteps(arr);
    else if (selectedAlgo === 'insertion') s = generateInsertionSteps(arr);
    setSteps(s);
    setStepIdx(0);
    setGenerated(true);
  };

  const handleAlgoChange = (a: SortAlgo) => {
    setAlgo(a);
    reset();
  };

  const play = () => {
    if (stepIdx >= steps.length - 1) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
  };

  const stepForward = () => {
    if (stepIdx < steps.length - 1) setStepIdx(s => s + 1);
  };

  const maxVal = Math.max(...displayArr);

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="Sorting Algorithms Overview">
        Sorting algorithms arrange elements in a specific order. Understanding their time/space complexity helps you choose the right one for each situation.
      </Alert>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="text-left p-3 rounded-tl-xl">Algorithm</th>
              <th className="p-3 text-center">Best</th>
              <th className="p-3 text-center">Average</th>
              <th className="p-3 text-center">Worst</th>
              <th className="p-3 text-center">Space</th>
              <th className="p-3 text-center rounded-tr-xl">Stable</th>
            </tr>
          </thead>
          <tbody>
            {[
              { a: 'Bubble Sort', b: 'O(n)', av: 'O(n²)', w: 'O(n²)', s: 'O(1)', st: '✅' },
              { a: 'Selection Sort', b: 'O(n²)', av: 'O(n²)', w: 'O(n²)', s: 'O(1)', st: '❌' },
              { a: 'Insertion Sort', b: 'O(n)', av: 'O(n²)', w: 'O(n²)', s: 'O(1)', st: '✅' },
              { a: 'Merge Sort', b: 'O(n log n)', av: 'O(n log n)', w: 'O(n log n)', s: 'O(n)', st: '✅' },
              { a: 'Quick Sort', b: 'O(n log n)', av: 'O(n log n)', w: 'O(n²)', s: 'O(log n)', st: '❌' },
            ].map(({ a, b, av, w, s, st }, i) => (
              <tr key={a} className={i % 2 === 0 ? 'bg-white dark:bg-slate-800/30' : 'bg-slate-50 dark:bg-slate-800/60'}>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{a}</td>
                <td className="p-3 text-center font-mono text-xs text-green-700 dark:text-green-400">{b}</td>
                <td className="p-3 text-center font-mono text-xs text-yellow-700 dark:text-yellow-400">{av}</td>
                <td className="p-3 text-center font-mono text-xs text-red-700 dark:text-red-400">{w}</td>
                <td className="p-3 text-center font-mono text-xs">{s}</td>
                <td className="p-3 text-center">{st}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Alert type="tip" title="Which Algorithm to Choose?">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Nearly sorted data</strong> → Insertion Sort (O(n) best case)</li>
          <li><strong>General purpose, stable</strong> → Merge Sort</li>
          <li><strong>General purpose, in-place</strong> → Quick Sort</li>
          <li><strong>Learning/teaching</strong> → Bubble Sort (simple to understand)</li>
        </ul>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {ALGOS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleAlgoChange(id)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-semibold transition-all',
              algo === id ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bar chart visualization */}
      <div className="card p-5">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">
          {ALGOS.find(a => a.id === algo)?.label} Visualization
        </h3>
        <div className="flex items-end justify-center gap-2 h-40 mb-4">
          {displayArr.map((val, idx) => {
            const height = Math.max(8, (val / maxVal) * 140);
            const isComparing = currentStep?.comparing.includes(idx);
            const isSwapped = currentStep?.swapped.includes(idx);
            const isSorted = currentStep?.sorted.includes(idx);
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-xs font-mono text-slate-500">{val}</span>
                <div
                  style={{ height: `${height}px` }}
                  className={cn(
                    'w-10 rounded-t-lg transition-all duration-300 flex items-end justify-center',
                    isSwapped ? 'bg-red-500 shadow-lg shadow-red-500/30' :
                    isComparing ? 'bg-yellow-400 shadow-lg shadow-yellow-400/30' :
                    isSorted ? 'bg-green-500' :
                    'bg-primary-500 dark:bg-primary-600'
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-3">
          {[
            { color: 'bg-primary-500', label: 'Unsorted' },
            { color: 'bg-yellow-400', label: 'Comparing' },
            { color: 'bg-red-500', label: 'Swapped' },
            { color: 'bg-green-500', label: 'Sorted' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${color}`} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {currentStep?.message && (
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 font-medium">
            {currentStep.message}
          </div>
        )}

        {generated && (
          <div className="mt-2 text-xs text-slate-500">
            Step {stepIdx + 1} of {steps.length}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => generate(algo)}
          className="btn-primary text-sm py-2 flex items-center gap-1"
        >
          Generate Steps
        </button>
        {generated && (
          <>
            {playing ? (
              <button onClick={pause} className="btn-secondary flex items-center gap-1 text-sm">
                <Pause size={14} /> Pause
              </button>
            ) : (
              <button onClick={play} disabled={stepIdx >= steps.length - 1} className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-50">
                <Play size={14} /> Play
              </button>
            )}
            <button onClick={stepForward} disabled={playing || stepIdx >= steps.length - 1} className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-50">
              <SkipForward size={14} /> Step
            </button>
          </>
        )}
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
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="sorting.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="sorting.cpp" /> },
      ]}
    />
  );
}
