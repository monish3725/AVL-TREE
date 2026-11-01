import React from 'react';
import { Cpu, ShieldCheck, Database, Layers, CheckCircle2, Code2, AlertTriangle, Sparkles } from 'lucide-react';

export const AvlRoadmapView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
        <span className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider block mb-1">
          Engineering Architecture Review & Roadmap
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          How to Take "AVL-TREE Library System" to the Next Level
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
          Monish, Ryan, and Adrian's implementation demonstrates foundational mastery of self-balancing
          binary search trees in C. Below is a senior software engineer's blueprint to evolve this algorithm
          from a terminal academic assignment into a production-grade database index.
        </p>
      </div>

      <div className="space-y-4">
        {/* Pillar 1: Heap Memory Safety */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 01 · Memory Safety & Leaks</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Heap Deallocation & Destructors: Freeing Recursive Tree Nodes
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">test3.c</code>, every book is allocated via{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">malloc(sizeof(struct Book))</code>. While{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">deleteNode</code> frees deleted single nodes,
                exiting the program or dropping the root leaves all allocated nodes orphaned in memory (Valgrind memory leak).
              </p>

              <div className="mt-3 p-3 bg-slate-900 rounded-lg text-slate-200 font-mono text-[11px] overflow-x-auto">
                <div className="text-teal-400 font-bold mb-1">// Recursive Post-Order Destructor to Add Before Exit:</div>
{`void freeTree(struct Book *root) {
    if (root != NULL) {
        freeTree(root->left);   // 1. Free left subtree
        freeTree(root->right);  // 2. Free right subtree
        free(root);             // 3. Free current node
    }
}

// In main() before return 0:
freeTree(root);
root = NULL;`}
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: AVL vs Red-Black vs B-Trees */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 02 · Index Selection Theory</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Real-World Trade-Offs: AVL vs Red-Black vs B-Trees
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Why doesn't PostgreSQL or the Linux Kernel use AVL trees everywhere? Understanding where AVL shines:
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg">
                  <span className="font-bold text-teal-900 block mb-1">AVL Trees</span>
                  <p className="text-teal-800 text-[11px]">
                    <strong>Strictly balanced:</strong> Height bound $h \le 1.44 \log_2 n$. Best for <em>search-heavy</em> workloads
                    (e.g., read-only library catalogs, symbol tables).
                  </p>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                  <span className="font-bold text-rose-900 block mb-1">Red-Black Trees</span>
                  <p className="text-rose-800 text-[11px]">
                    <strong>Looser balance:</strong> Height bound $h \le 2 \log_2(n+1)$. Requires fewer rotations on inserts/deletes.
                    Used in Linux CFS, C++ <code className="font-mono">std::map</code>, Java <code className="font-mono">TreeMap</code>.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg">
                  <span className="font-bold text-indigo-900 block mb-1">B-Trees & B+ Trees</span>
                  <p className="text-indigo-800 text-[11px]">
                    <strong>High branching factor:</strong> Nodes store thousands of keys per disk block to minimize mechanical disk seek time.
                    The gold standard for SQLite, MySQL, and PostgreSQL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: ISBN Validation & Data Integrity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 03 · Data Integrity</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Standardizing ISBN-10 / ISBN-13 Check Digits
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Currently, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">long long isbn</code> accepts any
                arbitrary integer (e.g. 12345). Real library databases validate check-digits before insertion:
              </p>

              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <div>
                  • <strong>ISBN-13 Modulo 10 Check:</strong> Alternating weights of 1 and 3 across the first 12 digits:
                  <code className="font-mono bg-slate-100 px-1 py-0.5 rounded ml-1 text-slate-800">
                    check = (10 - (∑ w_i · d_i % 10)) % 10
                  </code>
                </div>
                <div>
                  • <strong>ISBN-10 Modulo 11 Check:</strong> Weighted sum from 10 down to 2 with 'X' representing 10.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 4: Modern C++ & Rust Port */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Pillar 04 · Modernization</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                Generic Template Programming & Smart Pointers (C++20 / Rust)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Upgrade from a C struct tailored only to Books into a generic container{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">AVLTree&lt;Key, Value&gt;</code> utilizing
                RAII smart pointers (<code className="font-mono">std::unique_ptr</code>) to guarantee zero memory leaks and
                exception safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
