import type { ComplexityEntry, RevisionSlide } from '../types';

export const complexityData: ComplexityEntry[] = [
  { name: 'Constant',       notation: 'O(1)',      description: 'Does not depend on input size', example: 'Array index access, hash table lookup', color: '#22c55e' },
  { name: 'Logarithmic',    notation: 'O(log n)',  description: 'Halves the problem each step',   example: 'Binary search, balanced BST search',    color: '#84cc16' },
  { name: 'Linear',         notation: 'O(n)',      description: 'Grows proportionally',           example: 'Linear search, array traversal',        color: '#eab308' },
  { name: 'Linearithmic',   notation: 'O(n log n)', description: 'Slightly worse than linear',   example: 'Merge sort, heap sort, quick sort (avg)', color: '#f97316' },
  { name: 'Quadratic',      notation: 'O(n²)',     description: 'Nested loops over input',        example: 'Bubble sort, selection sort, insertion sort', color: '#ef4444' },
  { name: 'Exponential',    notation: 'O(2ⁿ)',     description: 'Doubles per input added',        example: 'Recursive Fibonacci, subsets enumeration', color: '#dc2626' },
  { name: 'Factorial',      notation: 'O(n!)',     description: 'Extremely slow growth',          example: 'Travelling salesman (brute force), permutations', color: '#7f1d1d' },
];

export const dsaComplexityTable = [
  { ds: 'Array',          access: 'O(1)',    search: 'O(n)',    insert: 'O(n)',    delete: 'O(n)',    space: 'O(n)' },
  { ds: 'Linked List',    access: 'O(n)',    search: 'O(n)',    insert: 'O(1)',    delete: 'O(1)',    space: 'O(n)' },
  { ds: 'Stack',          access: 'O(n)',    search: 'O(n)',    insert: 'O(1)',    delete: 'O(1)',    space: 'O(n)' },
  { ds: 'Queue',          access: 'O(n)',    search: 'O(n)',    insert: 'O(1)',    delete: 'O(1)',    space: 'O(n)' },
  { ds: 'Binary Search Tree (avg)', access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', space: 'O(n)' },
  { ds: 'Hash Table',     access: 'N/A',    search: 'O(1)',    insert: 'O(1)',    delete: 'O(1)',    space: 'O(n)' },
  { ds: 'Graph (adj list)', access: 'N/A', search: 'O(V+E)',  insert: 'O(1)',    delete: 'O(V+E)',  space: 'O(V+E)' },
];

export const sortingComplexityTable = [
  { algo: 'Bubble Sort',    best: 'O(n)',      average: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)',     stable: '✅' },
  { algo: 'Selection Sort', best: 'O(n²)',     average: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)',     stable: '❌' },
  { algo: 'Insertion Sort', best: 'O(n)',      average: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)',     stable: '✅' },
  { algo: 'Merge Sort',     best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: '✅' },
  { algo: 'Quick Sort',     best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)',   space: 'O(log n)', stable: '❌' },
];

export const revisionSlides: RevisionSlide[] = [
  {
    id: 1,
    title: '🧱 Arrays — The Building Block',
    content: `**Definition**: A collection of elements stored at contiguous memory locations.

**Key Properties:**
- Fixed size (static) or dynamic
- Index-based access: arr[0], arr[1]...
- Random access in O(1) time

**Real-world analogy**: A row of numbered lockers — you can jump directly to locker #5 without checking 1,2,3,4.

**When to use**: When you need fast indexed access and the size is known in advance.`,
    code: `# Python — Array basics
arr = [10, 20, 30, 40, 50]
print(arr[2])    # O(1) access → 30
arr.append(60)   # O(1) amortized
arr.insert(0, 5) # O(n) — shifts all
arr.pop(0)       # O(n) — shifts all`,
    language: 'python',
    tip: 'Use arrays when you access elements by index frequently. Use linked lists when you insert/delete from the middle often.',
  },
  {
    id: 2,
    title: '🔗 Linked Lists — Dynamic Chains',
    content: `**Definition**: A linear data structure where elements (nodes) are connected via pointers.

**Types:**
- **Singly**: Each node → next only
- **Doubly**: Each node ↔ prev + next
- **Circular**: Last node → first node

**Key advantage**: O(1) insertion/deletion at known position (no shifting needed).

**Key disadvantage**: No random access — must traverse from head.`,
    code: `# Python — Linked List node
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None   # pointer

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node  # O(1)`,
    language: 'python',
    tip: 'For interview questions: always handle edge cases — empty list, single node, inserting at head/tail.',
  },
  {
    id: 3,
    title: '📚 Stacks & Queues — Restricted Access',
    content: `**Stack (LIFO)**:
- Push = add to top
- Pop = remove from top
- Applications: Undo, function call stack, DFS, balanced brackets

**Queue (FIFO)**:
- Enqueue = add to rear
- Dequeue = remove from front
- Applications: BFS, printer spooler, CPU scheduling

**Both have O(1) push/pop/enqueue/dequeue** when implemented correctly.`,
    code: `# Stack using Python list
stack = []
stack.append(1)  # push
stack.append(2)
top = stack.pop()  # pop → 2

# Queue using deque
from collections import deque
queue = deque()
queue.append(1)     # enqueue
queue.append(2)
front = queue.popleft()  # dequeue → 1`,
    language: 'python',
    tip: 'In Python, always use collections.deque for queues — list.pop(0) is O(n), but deque.popleft() is O(1).',
  },
  {
    id: 4,
    title: '🌳 Trees & BST — Hierarchical Data',
    content: `**Binary Tree**: Each node has at most 2 children (left, right).

**BST property**: left < root < right (enables O(log n) search in balanced trees).

**Traversals:**
- **In-order** (L→Root→R): Sorted output from BST
- **Pre-order** (Root→L→R): Copy a tree, prefix notation
- **Post-order** (L→R→Root): Delete a tree, postfix notation
- **Level-order (BFS)**: Shortest path in unweighted trees

**Balanced vs Unbalanced**: AVL, Red-Black trees maintain O(log n) height.`,
    tip: 'Remember: In-order of BST = sorted array. Use this fact in many interview problems.',
  },
  {
    id: 5,
    title: '🕸️ Graphs — Connected Networks',
    content: `**Definition**: A set of vertices (V) connected by edges (E).

**Types:**
- Directed / Undirected
- Weighted / Unweighted
- Cyclic / Acyclic (DAG)

**Representations:**
- Adjacency Matrix: O(V²) space, O(1) edge lookup
- Adjacency List: O(V+E) space, O(degree) edge lookup

**Traversals:**
- **BFS**: Uses queue, finds shortest path (unweighted)
- **DFS**: Uses stack/recursion, explores deep paths`,
    code: `# Graph BFS
from collections import deque

def bfs(graph, start):
    visited, queue = {start}, deque([start])
    while queue:
        node = queue.popleft()
        print(node, end=' ')
        for neighbour in graph[node]:
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(neighbour)`,
    language: 'python',
    tip: 'For interviews: know when to use BFS vs DFS. BFS for shortest paths, DFS for cycle detection and topological sort.',
  },
  {
    id: 6,
    title: '🔢 Sorting Algorithms — Comparison',
    content: `| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |

**Choose wisely:**
- Small/nearly sorted array → Insertion Sort
- General purpose, stable needed → Merge Sort
- General purpose, in-place needed → Quick Sort`,
    tip: 'Merge Sort is the gold standard. Quick Sort is faster in practice due to better cache performance, despite same average Big-O.',
  },
  {
    id: 7,
    title: '📈 Big-O Notation — Complexity Analysis',
    content: `**Big-O** describes the upper bound of an algorithm's growth rate as input grows to infinity.

**Common Classes (fastest → slowest):**
O(1) → O(log n) → O(n) → O(n log n) → O(n²) → O(2ⁿ) → O(n!)

**Tips for analysis:**
1. Drop constants: O(2n) → O(n)
2. Drop lower-order terms: O(n² + n) → O(n²)
3. Nested loops → multiply: 2 nested loops over n → O(n²)
4. Sequential steps → add: O(n) + O(n²) → O(n²)

**Space complexity**: Count extra memory your algorithm uses, not input size.`,
    tip: 'In interviews, always state BOTH time AND space complexity. Interviewers often follow up asking if you can reduce space usage.',
  },
];
