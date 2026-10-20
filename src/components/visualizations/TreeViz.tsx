import React, { useState, useCallback } from 'react';
import { Plus, Play, RotateCcw } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):       # O(log n) avg
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node

    def inorder(self, node=None):  # Left→Root→Right (sorted!)
        if node is None: node = self.root
        if not node: return []
        return self.inorder(node.left) + [node.val] + self.inorder(node.right)

    def search(self, val):      # O(log n) avg
        curr = self.root
        while curr:
            if val == curr.val: return True
            curr = curr.left if val < curr.val else curr.right
        return False

bst = BST()
for v in [50, 30, 70, 20, 40, 60, 80]:
    bst.insert(v)
print(bst.inorder())  # [20, 30, 40, 50, 60, 70, 80]`;

const CPP_CODE = `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class BST {
public:
    TreeNode* root = nullptr;

    TreeNode* insert(TreeNode* node, int val) {
        if (!node) return new TreeNode(val);
        if (val < node->val)
            node->left = insert(node->left, val);
        else if (val > node->val)
            node->right = insert(node->right, val);
        return node;
    }

    void inorder(TreeNode* node) {
        if (!node) return;
        inorder(node->left);
        cout << node->val << " ";
        inorder(node->right);
    }

    bool search(TreeNode* node, int val) {
        if (!node) return false;
        if (val == node->val) return true;
        if (val < node->val) return search(node->left, val);
        return search(node->right, val);
    }
};`;

interface TNode {
  val: number;
  left: TNode | null;
  right: TNode | null;
  x?: number;
  y?: number;
  id: string;
}

function insertBST(root: TNode | null, val: number): TNode {
  if (!root) return { val, left: null, right: null, id: `${val}-${Date.now()}` };
  if (val < root.val) return { ...root, left: insertBST(root.left, val) };
  if (val > root.val) return { ...root, right: insertBST(root.right, val) };
  return root;
}

function buildInitialTree(): TNode {
  let root: TNode | null = null;
  for (const v of [50, 30, 70, 20, 40, 60, 80]) {
    root = insertBST(root, v);
  }
  return root!;
}

interface NodeWithPos extends TNode {
  nx: number;
  ny: number;
}

function assignPositions(node: TNode | null, x: number, y: number, spread: number): NodeWithPos[] {
  if (!node) return [];
  const result: NodeWithPos[] = [{ ...node, nx: x, ny: y }];
  result.push(...assignPositions(node.left, x - spread, y + 70, spread / 2));
  result.push(...assignPositions(node.right, x + spread, y + 70, spread / 2));
  return result;
}

function getEdges(node: TNode | null, positions: Map<string, { nx: number; ny: number }>): { x1: number; y1: number; x2: number; y2: number }[] {
  if (!node) return [];
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const pos = positions.get(node.id);
  if (node.left && pos) {
    const lpos = positions.get(node.left.id);
    if (lpos) edges.push({ x1: pos.nx, y1: pos.ny, x2: lpos.nx, y2: lpos.ny });
    edges.push(...getEdges(node.left, positions));
  }
  if (node.right && pos) {
    const rpos = positions.get(node.right.id);
    if (rpos) edges.push({ x1: pos.nx, y1: pos.ny, x2: rpos.nx, y2: rpos.ny });
    edges.push(...getEdges(node.right, positions));
  }
  return edges;
}

export function TreeContent() {
  const [root, setRoot] = useState<TNode>(() => buildInitialTree());
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [busy, setBusy] = useState(false);

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const reset = () => {
    setRoot(buildInitialTree());
    setHighlighted([]);
    setMessage('');
    setBusy(false);
  };

  const insertNode = useCallback(async () => {
    const val = Number(inputVal);
    if (!inputVal || isNaN(val)) return;
    setBusy(true);
    setMessage(`Inserting ${val} into BST...`);
    // Animate search path
    let curr: TNode | null = root;
    const path: string[] = [];
    while (curr) {
      path.push(curr.id);
      setHighlighted([...path]);
      setMessage(val < curr.val
        ? `${val} < ${curr.val} — go LEFT`
        : `${val} > ${curr.val} — go RIGHT`);
      await sleep(700);
      curr = val < curr.val ? curr.left : val > curr.val ? curr.right : null;
      if (!curr) break;
    }
    const newRoot = insertBST(root, val);
    setRoot(newRoot);
    setHighlighted([]);
    setMessage(`Inserted ${val}. BST property maintained.`);
    setBusy(false);
    setInputVal('');
  }, [root, inputVal]);

  const inorderTraversal = useCallback(async () => {
    setBusy(true);
    const result: number[] = [];
    const traverse = async (node: TNode | null) => {
      if (!node) return;
      await traverse(node.left);
      setHighlighted([node.id]);
      result.push(node.val);
      setMessage(`In-order: visiting ${node.val} → [${result.join(', ')}]`);
      await sleep(600);
      await traverse(node.right);
    };
    await traverse(root);
    setHighlighted([]);
    setMessage(`✅ In-order result: [${result.join(', ')}] — Sorted! This is BST's key property.`);
    setBusy(false);
  }, [root]);

  const positions = assignPositions(root, 250, 30, 120);
  const posMap = new Map(positions.map(p => [p.id, { nx: p.nx, ny: p.ny }]));
  const edges = getEdges(root, posMap);
  const svgHeight = 300;

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="Binary Search Tree (BST)">
        A BST is a binary tree where for every node: <strong>left subtree values &lt; node value &lt; right subtree values</strong>. This property enables O(log n) search in balanced trees.
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { op: 'Search', time: 'O(log n)', note: 'Avg case in balanced BST' },
          { op: 'Insert', time: 'O(log n)', note: 'Avg case in balanced BST' },
          { op: 'Delete', time: 'O(log n)', note: 'Avg case in balanced BST' },
          { op: 'In-order Traversal', time: 'O(n)', note: 'Produces sorted output!' },
          { op: 'Worst case (skewed)', time: 'O(n)', note: 'When tree is unbalanced' },
          { op: 'Space', time: 'O(n)', note: 'For n nodes' },
        ].map(({ op, time, note }) => (
          <div key={op} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{op}</div>
            <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 px-2 py-0.5 rounded-full inline-block my-1">{time}</div>
            <div className="text-xs text-slate-500">{note}</div>
          </div>
        ))}
      </div>
      <Alert type="tip" title="Traversal Orders">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>In-order (L→Root→R)</strong>: Sorted output from BST</li>
          <li><strong>Pre-order (Root→L→R)</strong>: Copy a tree, prefix expression</li>
          <li><strong>Post-order (L→R→Root)</strong>: Delete tree, postfix expression</li>
          <li><strong>Level-order (BFS)</strong>: Shortest path, level-by-level</li>
        </ul>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Binary Search Tree</h3>
        <div className="overflow-x-auto">
          <svg width="500" height={svgHeight} className="mx-auto block">
            {/* Edges */}
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1} y1={e.y1 + 22} x2={e.x2} y2={e.y2 - 22}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray={highlighted.length > 0 ? '4 2' : 'none'}
              />
            ))}
            {/* Nodes */}
            {positions.map(({ id, val, nx, ny }) => (
              <g key={id} transform={`translate(${nx},${ny})`}>
                <circle
                  r="22"
                  className={cn(
                    'transition-all duration-400',
                  )}
                  fill={highlighted.includes(id) ? '#6366f1' : '#334155'}
                  stroke={highlighted.includes(id) ? '#818cf8' : '#475569'}
                  strokeWidth="2"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            ))}
          </svg>
        </div>
        {message && (
          <div className="mt-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 font-medium">
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
            onKeyDown={e => e.key === 'Enter' && insertNode()}
          />
          <button onClick={insertNode} disabled={busy || !inputVal} className="btn-primary flex items-center gap-1 text-sm py-2 disabled:opacity-50">
            <Plus size={14} /> Insert
          </button>
        </div>
        <button onClick={inorderTraversal} disabled={busy} className="btn-outline flex items-center gap-1 text-sm disabled:opacity-50">
          <Play size={14} /> In-order Traversal
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
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="bst.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="bst.cpp" /> },
      ]}
    />
  );
}
