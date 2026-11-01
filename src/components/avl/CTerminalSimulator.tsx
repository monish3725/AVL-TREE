import React, { useState, useRef, useEffect } from 'react';
import { Terminal, RotateCcw, Code } from 'lucide-react';
import { useAvl } from '../../context/AvlContext';

export const CTerminalSimulator: React.FC = () => {
  const { books, insertBook, deleteBook, searchBook } = useAvl();

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Compiled with: gcc test3.c -o library',
    'Executing ./library ...',
    '',
    '===== Library Menu =====',
    '1. Insert Book',
    '2. Search Book',
    '3. Delete Book',
    '4. Display Books (Sorted Order)',
    '5. Exit',
    'Enter your choice: ',
  ]);

  const [inputVal, setInputVal] = useState('');
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [tempFormData, setTempFormData] = useState<any>({});
  const [showCodeModal, setShowCodeModal] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const appendLogs = (lines: string[]) => {
    setTerminalLogs((prev) => [...prev, ...lines]);
  };

  const showMainMenu = () => {
    appendLogs([
      '',
      '===== Library Menu =====',
      '1. Insert Book',
      '2. Search Book',
      '3. Delete Book',
      '4. Display Books (Sorted Order)',
      '5. Exit',
      'Enter your choice: ',
    ]);
    setActiveWorkflow(null);
    setWorkflowStep(0);
    setTempFormData({});
  };

  const handleSelectOption = (choice: number) => {
    appendLogs([`> ${choice}`]);

    switch (choice) {
      case 1: {
        // Insert Book
        appendLogs(['Enter ISBN: ']);
        setActiveWorkflow('insert_book');
        setWorkflowStep(1);
        break;
      }
      case 2: {
        // Search Book
        appendLogs(['Enter ISBN to search: ']);
        setActiveWorkflow('search_book');
        setWorkflowStep(1);
        break;
      }
      case 3: {
        // Delete Book
        appendLogs(['Enter ISBN to delete: ']);
        setActiveWorkflow('delete_book');
        setWorkflowStep(1);
        break;
      }
      case 4: {
        // Display Books (Sorted Order via inorder)
        appendLogs(['', 'Books in sorted order:']);
        if (books.length === 0) {
          appendLogs(['Tree is currently empty.']);
        } else {
          books.forEach((b) => {
            appendLogs([`ISBN: ${b.isbn} | Title: ${b.title} | Author: ${b.author}`]);
          });
        }
        showMainMenu();
        break;
      }
      case 5: {
        appendLogs(['Exiting...', 'Process finished with exit code 0.']);
        setActiveWorkflow('exited');
        break;
      }
      default: {
        appendLogs(['Invalid choice.']);
        showMainMenu();
      }
    }
  };

  const handleWorkflowInput = (input: string) => {
    appendLogs([`> ${input}`]);

    if (!activeWorkflow) {
      const choice = parseInt(input.trim(), 10);
      if (!isNaN(choice)) {
        handleSelectOption(choice);
      } else {
        appendLogs(['Invalid choice.']);
        showMainMenu();
      }
      return;
    }

    // Insert Workflow
    if (activeWorkflow === 'insert_book') {
      if (workflowStep === 1) {
        const isbn = parseInt(input.trim(), 10);
        if (isNaN(isbn)) {
          appendLogs(['Invalid ISBN numeric value.']);
          showMainMenu();
          return;
        }
        setTempFormData({ isbn });
        appendLogs(['Enter Title: ']);
        setWorkflowStep(2);
      } else if (workflowStep === 2) {
        setTempFormData((prev: any) => ({ ...prev, title: input }));
        appendLogs(['Enter Author: ']);
        setWorkflowStep(3);
      } else if (workflowStep === 3) {
        insertBook({
          isbn: tempFormData.isbn,
          title: tempFormData.title,
          author: input,
          genre: 'General Collection',
          copiesTotal: 5,
          copiesAvailable: 5,
          shelf: 'Floor 1 · General Stacks',
        });
        appendLogs(['Book inserted successfully. (AVL Self-Balanced)']);
        showMainMenu();
      }
      return;
    }

    // Search Workflow
    if (activeWorkflow === 'search_book') {
      const isbn = parseInt(input.trim(), 10);
      const res = searchBook(isbn);
      if (res.found) {
        appendLogs([
          `Found: ISBN: ${res.found.isbn} | Title: ${res.found.book.title} | Author: ${res.found.book.author}`,
        ]);
      } else {
        appendLogs(['Book not found.']);
      }
      showMainMenu();
      return;
    }

    // Delete Workflow
    if (activeWorkflow === 'delete_book') {
      const isbn = parseInt(input.trim(), 10);
      const ok = deleteBook(isbn);
      if (ok) {
        appendLogs(['Book deleted successfully (if ISBN existed). (AVL Rebalanced)']);
      } else {
        appendLogs(['Book not found.']);
      }
      showMainMenu();
      return;
    }
  };

  const handleRestart = () => {
    setTerminalLogs([
      'Compiled with: gcc test3.c -o library',
      'Executing ./library ...',
      '',
      '===== Library Menu =====',
      '1. Insert Book',
      '2. Search Book',
      '3. Delete Book',
      '4. Display Books (Sorted Order)',
      '5. Exit',
      'Enter your choice: ',
    ]);
    setActiveWorkflow(null);
    setWorkflowStep(0);
    setTempFormData({});
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            Monish, Ryan & Adrian's C Terminal CLI Simulator (test3.c)
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time interactive emulator of the original compiled C binary. Any book you insert, search, or delete
            here updates the visual AVL tree canvas simultaneously!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            View test3.c Source
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Binary
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Title bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400 text-[11px]">bash: ./library (C99 stdout)</span>
          </div>
          <span className="text-[11px] text-emerald-400">READY</span>
        </div>

        {/* Terminal Screen */}
        <div className="p-5 min-h-[360px] max-h-[460px] overflow-y-auto space-y-1 text-slate-300">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.startsWith('=====')
                  ? 'text-teal-400 font-bold'
                  : log.startsWith('>')
                  ? 'text-emerald-400 font-bold'
                  : log.includes('successfully') || log.includes('Found:')
                  ? 'text-emerald-300'
                  : log.includes('not found')
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Line */}
        <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold">{'>'}</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim()) {
                handleWorkflowInput(inputVal);
                setInputVal('');
              }
            }}
            placeholder="Type choice (1-5) or value and press Enter..."
            className="flex-1 bg-transparent text-emerald-300 focus:outline-none text-xs font-mono"
          />
          <button
            onClick={() => {
              if (inputVal.trim()) {
                handleWorkflowInput(inputVal);
                setInputVal('');
              }
            }}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-sans font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {/* Quick Menu Buttons */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
          Quick Interactive Menu (Simulating scanf &gt;&gt; choice)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => handleSelectOption(1)}
            className="p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">1. Insert Book</span>
            <span className="text-[10px] text-slate-400">insert(root, isbn...)</span>
          </button>

          <button
            onClick={() => handleSelectOption(2)}
            className="p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">2. Search Book</span>
            <span className="text-[10px] text-slate-400">search(root, isbn)</span>
          </button>

          <button
            onClick={() => handleSelectOption(3)}
            className="p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">3. Delete Book</span>
            <span className="text-[10px] text-slate-400">deleteNode(root, isbn)</span>
          </button>

          <button
            onClick={() => handleSelectOption(4)}
            className="p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-teal-700 block">4. Display (Sorted)</span>
            <span className="text-[10px] text-slate-400">inorder(root)</span>
          </button>

          <button
            onClick={() => handleSelectOption(5)}
            className="p-2.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-rose-900 border border-slate-200 rounded-lg text-left"
          >
            <span className="font-mono font-bold text-rose-700 block">5. Exit</span>
            <span className="text-[10px] text-slate-400">return 0</span>
          </button>
        </div>
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl max-w-3xl w-full border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs text-slate-300 font-bold">
                monish3725 / AVL-TREE / test3.c
              </span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <pre className="mt-4 p-4 bg-slate-900 text-slate-200 font-mono text-xs max-h-[60vh] overflow-y-auto rounded-lg leading-relaxed">
{`#include<stdio.h>
#include<stdlib.h>
#include<string.h>

struct Book {
    long long isbn;
    char title[100];
    char author[100];
    int height;
    struct Book *left, *right;
};

int height(struct Book *node) {
    if(node==NULL) return 0;
    return node->height;
}

int balanceFactor(struct Book *node) {
    if(node==NULL) return 0;
    return height(node->left) - height(node->right);
}

struct Book* rightRotate(struct Book *y) {
    struct Book *x = y->left;
    struct Book *T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + max(height(y->left), height(y->right));
    x->height = 1 + max(height(x->left), height(x->right));
    return x;
}

struct Book* leftRotate(struct Book *x) {
    struct Book *y = x->right;
    struct Book *T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = 1 + max(height(x->left), height(x->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;
}`}
            </pre>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
