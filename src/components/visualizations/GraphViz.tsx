import React, { useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B'],
    'F': ['C']
}

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

def dfs(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    order = [start]
    for neighbor in graph[start]:
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))
    return order

print(bfs(graph, 'A'))  # Level-by-level
print(dfs(graph, 'A'))  # Deep-first`;

const CPP_CODE = `#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

void bfs(vector<vector<int>>& adj, int start, int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}

void dfs(vector<vector<int>>& adj, int node,
         vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";
    for (int neighbor : adj[node]) {
        if (!visited[neighbor])
            dfs(adj, neighbor, visited);
    }
}`;

const NODES = [
  { id: 'A', x: 250, y: 50 },
  { id: 'B', x: 130, y: 140 },
  { id: 'C', x: 370, y: 140 },
  { id: 'D', x: 60,  y: 240 },
  { id: 'E', x: 200, y: 240 },
  { id: 'F', x: 370, y: 240 },
];

const EDGES = [
  ['A','B'], ['A','C'], ['B','D'], ['B','E'], ['C','F']
];

const GRAPH: Record<string, string[]> = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B'],
  F: ['C'],
};

export function GraphContent() {
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const reset = () => {
    setHighlighted([]);
    setVisited([]);
    setMessage('');
    setBusy(false);
  };

  const runBFS = useCallback(async () => {
    setBusy(true);
    setVisited([]);
    setHighlighted([]);
    const visitedSet = new Set<string>();
    const queue = ['A'];
    visitedSet.add('A');
    const order: string[] = [];
    setMessage('BFS: Starting from A. Using a QUEUE (FIFO).');
    await sleep(600);
    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);
      setHighlighted([node]);
      setVisited([...order]);
      setMessage(`BFS: Visiting ${node}. Order so far: [${order.join(' → ')}]`);
      await sleep(800);
      for (const neighbor of GRAPH[node]) {
        if (!visitedSet.has(neighbor)) {
          visitedSet.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    setHighlighted([]);
    setMessage(`✅ BFS complete! Order: [${order.join(' → ')}]. BFS finds SHORTEST paths in unweighted graphs.`);
    setBusy(false);
  }, []);

  const runDFS = useCallback(async () => {
    setBusy(true);
    setVisited([]);
    setHighlighted([]);
    const visitedSet = new Set<string>();
    const order: string[] = [];
    setMessage('DFS: Starting from A. Using RECURSION (implicit STACK).');
    await sleep(600);
    const dfs = async (node: string) => {
      if (visitedSet.has(node)) return;
      visitedSet.add(node);
      order.push(node);
      setHighlighted([node]);
      setVisited([...order]);
      setMessage(`DFS: Visiting ${node}. Path: [${order.join(' → ')}]`);
      await sleep(800);
      for (const neighbor of GRAPH[node]) {
        await dfs(neighbor);
      }
    };
    await dfs('A');
    setHighlighted([]);
    setMessage(`✅ DFS complete! Order: [${order.join(' → ')}]. DFS explores deeply before backtracking.`);
    setBusy(false);
  }, []);

  const nodePos = new Map(NODES.map(n => [n.id, { x: n.x, y: n.y }]));

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="What is a Graph?">
        A graph is a set of <strong>vertices (nodes)</strong> connected by <strong>edges</strong>. Graphs can be directed/undirected, weighted/unweighted, and cyclic/acyclic.
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { algo: 'BFS', uses: 'Queue (FIFO)', complexity: 'O(V+E)', note: 'Shortest path in unweighted graph' },
          { algo: 'DFS', uses: 'Stack/Recursion', complexity: 'O(V+E)', note: 'Cycle detection, topological sort' },
        ].map(({ algo, uses, complexity, note }) => (
          <div key={algo} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-primary-600 dark:text-primary-400 text-lg mb-1">{algo}</div>
            <div className="text-xs text-slate-500">Uses: {uses}</div>
            <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 px-2 py-0.5 rounded-full inline-block my-1">{complexity}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{note}</div>
          </div>
        ))}
      </div>
      <Alert type="tip" title="Graph Representations">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Adjacency Matrix</strong>: O(V²) space, O(1) edge check — good for dense graphs</li>
          <li><strong>Adjacency List</strong>: O(V+E) space, O(degree) edge check — good for sparse graphs</li>
        </ul>
      </Alert>
      <Alert type="warning" title="Common Mistakes">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Forgetting to mark nodes as visited → infinite loop</li>
          <li>Using BFS when you need the deepest path (use DFS instead)</li>
          <li>Confusing directed and undirected graph edge counts</li>
        </ul>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Graph Traversal (Undirected)</h3>
        <svg width="100%" viewBox="0 0 500 290" className="mx-auto">
          {/* Edges */}
          {EDGES.map(([a, b]) => {
            const pa = nodePos.get(a)!;
            const pb = nodePos.get(b)!;
            const bothVisited = visited.includes(a) && visited.includes(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x} y1={pa.y}
                x2={pb.x} y2={pb.y}
                stroke={bothVisited ? '#6366f1' : '#475569'}
                strokeWidth={bothVisited ? 3 : 2}
                strokeLinecap="round"
              />
            );
          })}
          {/* Nodes */}
          {NODES.map(({ id, x, y }) => (
            <g key={id} transform={`translate(${x},${y})`}>
              <circle
                r="26"
                fill={
                  highlighted.includes(id) ? '#f59e0b'
                  : visited.includes(id) ? '#6366f1'
                  : '#334155'
                }
                stroke={
                  highlighted.includes(id) ? '#fcd34d'
                  : visited.includes(id) ? '#818cf8'
                  : '#475569'
                }
                strokeWidth="2"
                className="transition-all duration-400"
              />
              <text textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="15" fontWeight="bold">{id}</text>
            </g>
          ))}
        </svg>
        {message && (
          <div className="mt-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 font-medium">
            {message}
          </div>
        )}
        {visited.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-slate-500">Visited:</span>
            {visited.map((n, i) => (
              <span key={i} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full font-mono">{n}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={runBFS} disabled={busy} className="btn-primary flex items-center gap-1 text-sm py-2 disabled:opacity-50">
          <Play size={14} /> Run BFS
        </button>
        <button onClick={runDFS} disabled={busy} className="btn-outline flex items-center gap-1 text-sm disabled:opacity-50">
          <Play size={14} /> Run DFS
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
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="graph.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="graph.cpp" /> },
      ]}
    />
  );
}
