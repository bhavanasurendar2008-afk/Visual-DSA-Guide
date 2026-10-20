import React, { useState, useCallback } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { TabGroup } from '../ui/TabGroup';
import { CodeBlock } from '../ui/CodeBlock';
import { Alert } from '../ui/Alert';
import { cn } from '../../lib/utils';

const PYTHON_CODE = `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_front(self, data):  # O(1)
        node = Node(data)
        node.next = self.head
        self.head = node

    def insert_end(self, data):    # O(n)
        node = Node(data)
        if not self.head:
            self.head = node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = node

    def delete(self, data):        # O(n)
        if not self.head: return
        if self.head.data == data:
            self.head = self.head.next
            return
        curr = self.head
        while curr.next:
            if curr.next.data == data:
                curr.next = curr.next.next
                return
            curr = curr.next

    def display(self):
        curr = self.head
        while curr:
            print(curr.data, end=' -> ')
            curr = curr.next
        print('None')`;

const CPP_CODE = `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
public:
    Node* head = nullptr;

    void insertFront(int data) {  // O(1)
        Node* node = new Node(data);
        node->next = head;
        head = node;
    }

    void insertEnd(int data) {    // O(n)
        Node* node = new Node(data);
        if (!head) { head = node; return; }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = node;
    }

    void deleteNode(int data) {   // O(n)
        if (!head) return;
        if (head->data == data) {
            head = head->next;
            return;
        }
        Node* curr = head;
        while (curr->next) {
            if (curr->next->data == data) {
                curr->next = curr->next->next;
                return;
            }
            curr = curr->next;
        }
    }
};

int main() {
    LinkedList ll;
    ll.insertEnd(10);
    ll.insertEnd(20);
    ll.insertEnd(30);
    ll.deleteNode(20);
    // Result: 10 -> 30 -> nullptr
}`;

const INITIAL = [10, 20, 30, 40];

export function LinkedListContent() {
  const [list, setList] = useState([...INITIAL]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [busy, setBusy] = useState(false);

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const reset = () => {
    setList([...INITIAL]);
    setHighlighted(null);
    setMessage('');
    setBusy(false);
  };

  const insertFront = useCallback(async () => {
    const val = Number(inputVal);
    if (!inputVal || isNaN(val)) return;
    setBusy(true);
    setMessage(`Inserting ${val} at head — O(1). Just update pointer.`);
    setList(prev => [val, ...prev]);
    setHighlighted(0);
    await sleep(900);
    setHighlighted(null);
    setMessage(`${val} is now the head node.`);
    setBusy(false);
    setInputVal('');
  }, [inputVal]);

  const insertEnd = useCallback(async () => {
    const val = Number(inputVal);
    if (!inputVal || isNaN(val)) return;
    setBusy(true);
    for (let i = 0; i < list.length; i++) {
      setHighlighted(i);
      setMessage(`Traversing to end... at node ${i} (value: ${list[i]})`);
      await sleep(400);
    }
    setList(prev => [...prev, val]);
    setHighlighted(list.length);
    setMessage(`Inserted ${val} at tail — O(n) traversal needed.`);
    await sleep(800);
    setHighlighted(null);
    setBusy(false);
    setInputVal('');
  }, [list, inputVal]);

  const deleteNode = useCallback(async (idx: number) => {
    if (busy) return;
    setBusy(true);
    const val = list[idx];
    for (let i = 0; i <= idx; i++) {
      setHighlighted(i);
      setMessage(`Traversing to find node... at index ${i}`);
      await sleep(350);
    }
    setMessage(`Found ${val} at index ${idx}. Updating pointer — O(n).`);
    await sleep(600);
    setList(prev => prev.filter((_, i) => i !== idx));
    setHighlighted(null);
    setMessage(`Deleted node with value ${val}.`);
    setBusy(false);
  }, [list, busy]);

  const explanation = (
    <div className="space-y-4">
      <Alert type="info" title="What is a Linked List?">
        A linked list is a <strong>linear data structure</strong> where each element (node) contains data and a pointer to the next node. Unlike arrays, nodes are NOT stored in contiguous memory — they can be anywhere in memory, connected by pointers.
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { op: 'Access (index)', time: 'O(n)', note: 'Must traverse from head' },
          { op: 'Search', time: 'O(n)', note: 'Linear scan' },
          { op: 'Insert at head', time: 'O(1)', note: 'Just update pointer' },
          { op: 'Insert at tail', time: 'O(n)', note: 'Traverse to find tail' },
          { op: 'Delete (known pos)', time: 'O(1)', note: 'Update prev.next' },
          { op: 'Delete (search)', time: 'O(n)', note: 'Find node first' },
        ].map(({ op, time, note }) => (
          <div key={op} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{op}</div>
            <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 px-2 py-0.5 rounded-full inline-block my-1">{time}</div>
            <div className="text-xs text-slate-500">{note}</div>
          </div>
        ))}
      </div>
      <Alert type="warning" title="Array vs Linked List">
        <table className="w-full text-xs">
          <thead><tr className="font-bold"><td>Feature</td><td>Array</td><td>Linked List</td></tr></thead>
          <tbody>
            <tr><td>Random access</td><td>✅ O(1)</td><td>❌ O(n)</td></tr>
            <tr><td>Insert at front</td><td>❌ O(n)</td><td>✅ O(1)</td></tr>
            <tr><td>Memory</td><td>Contiguous</td><td>Scattered</td></tr>
            <tr><td>Cache friendly</td><td>✅ Yes</td><td>❌ No</td></tr>
          </tbody>
        </table>
      </Alert>
    </div>
  );

  const visualization = (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Singly Linked List</h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-max">
            <span className="text-xs font-mono text-green-600 mr-2">HEAD</span>
            {list.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'relative w-16 h-14 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-400 cursor-pointer group',
                      highlighted === idx
                        ? 'bg-primary-500 border-primary-400 text-white scale-110 shadow-lg'
                        : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:border-primary-400'
                    )}
                  >
                    <span className="font-bold text-sm">{val}</span>
                    <span className="text-xs opacity-50">→</span>
                    <button
                      onClick={() => deleteNode(idx)}
                      disabled={busy}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ×
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">[{idx}]</span>
                </div>
                {idx < list.length - 1 && (
                  <div className="text-slate-400 font-mono text-lg mx-1">→</div>
                )}
              </React.Fragment>
            ))}
            {list.length === 0 && <span className="text-slate-400 italic text-sm">Empty list</span>}
            <div className="text-slate-500 font-mono ml-1">→ NULL</div>
          </div>
        </div>
        {message && (
          <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm text-primary-700 dark:text-primary-300 font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          placeholder="Value..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          className="input w-28 text-sm"
        />
        <button onClick={insertFront} disabled={busy || !inputVal} className="btn-primary flex items-center gap-1 text-sm py-2 disabled:opacity-50">
          <Plus size={14} /> Insert Front
        </button>
        <button onClick={insertEnd} disabled={busy || !inputVal} className="btn-outline flex items-center gap-1 text-sm disabled:opacity-50">
          <Plus size={14} /> Insert End
        </button>
        <button onClick={reset} className="btn-secondary flex items-center gap-1 text-sm">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <p className="text-xs text-slate-500">Hover over a node and click × to delete it.</p>
    </div>
  );

  return (
    <TabGroup
      tabs={[
        { id: 'viz', label: '🎮 Visualization', content: visualization },
        { id: 'explain', label: '📖 Explanation', content: explanation },
        { id: 'python', label: '🐍 Python', content: <CodeBlock code={PYTHON_CODE} language="python" title="linked_list.py" /> },
        { id: 'cpp', label: '⚙️ C++', content: <CodeBlock code={CPP_CODE} language="cpp" title="linked_list.cpp" /> },
      ]}
    />
  );
}
