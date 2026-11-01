import React, { useState } from 'react';
import { ListFilter, Play, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useAvl } from '../../context/AvlContext';
import {
  getInorderIsbns,
  getPreorderIsbns,
  getPostorderIsbns,
  getLevelOrderIsbns,
} from '../../utils/avlTree';

export const TraversalsView: React.FC = () => {
  const { root, treeStats } = useAvl();

  const [activeMode, setActiveMode] = useState<'inorder' | 'preorder' | 'postorder' | 'levelorder'>(
    'inorder'
  );
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const inorderList = getInorderIsbns(root, []);
  const preorderList = getPreorderIsbns(root, []);
  const postorderList = getPostorderIsbns(root, []);
  const levelOrderList = getLevelOrderIsbns(root);

  const getCurrentList = () => {
    switch (activeMode) {
      case 'inorder':
        return inorderList;
      case 'preorder':
        return preorderList;
      case 'postorder':
        return postorderList;
      case 'levelorder':
        return levelOrderList;
    }
  };

  const currentList = getCurrentList();

  const handlePlayTraversal = () => {
    if (currentList.length === 0) return;
    setPlayingIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < currentList.length) {
        setPlayingIndex(idx);
      } else {
        clearInterval(interval);
        setTimeout(() => setPlayingIndex(null), 1200);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Mathematical Rigor Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Theoretical Optimal Height</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {treeStats.minPossibleHeight}
            </span>
            <span className="text-xs text-slate-400 font-mono">⌊log₂ N⌋ + 1</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Current AVL Tree Height</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-700">
              {treeStats.height}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Strictly Balanced</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Max Theoretical AVL Height</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {treeStats.maxPossibleHeight}
            </span>
            <span className="text-xs text-slate-400 font-mono">≈ 1.44 · log₂ N</span>
          </div>
        </div>
      </div>

      {/* Traversal Selector & Player Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-teal-600" />
              Binary Tree Traversal Sequences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an algorithm to step through node visitation orders.
            </p>
          </div>

          <button
            onClick={handlePlayTraversal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Animate Traversal
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveMode('inorder')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeMode === 'inorder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inorder (Left, Root, Right) · Sorted
          </button>

          <button
            onClick={() => setActiveMode('preorder')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeMode === 'preorder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preorder (Root, Left, Right) · Serialization
          </button>

          <button
            onClick={() => setActiveMode('postorder')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeMode === 'postorder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Postorder (Left, Right, Root) · Deallocation
          </button>

          <button
            onClick={() => setActiveMode('levelorder')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeMode === 'levelorder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Level-Order (BFS) · By Depth
          </button>
        </div>

        {/* Current Traversal Output Sequence */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">Visited Node Sequence (ISBNs):</span>
            <span className="font-mono">{currentList.length} nodes</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentList.map((isbn, idx) => {
              const isCurrentlyPlaying = playingIndex === idx;
              const hasBeenPlayed = playingIndex !== null && idx < playingIndex;

              return (
                <div
                  key={`${isbn}-${idx}`}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                    isCurrentlyPlaying
                      ? 'bg-teal-600 text-white shadow-md scale-110'
                      : hasBeenPlayed
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {isbn}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mode Theory Explanations */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          {activeMode === 'inorder' && (
            <div>
              <span className="font-bold text-slate-900 block mb-1">Inorder Traversal (L → Root → R)</span>
              <p>
                In any Binary Search Tree, an inorder traversal visits nodes in ascending mathematical order.
                In Monish's <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">test3.c</code>, this powers
                Option 4: <span className="font-semibold text-slate-800">"Display Books (Sorted Order)"</span>.
              </p>
            </div>
          )}

          {activeMode === 'preorder' && (
            <div>
              <span className="font-bold text-slate-900 block mb-1">Preorder Traversal (Root → L → R)</span>
              <p>
                Visits the root before children. This traversal is essential for creating exact duplicates of a tree,
                writing serialized representations to disk or network streams, and expression tree prefix evaluations.
              </p>
            </div>
          )}

          {activeMode === 'postorder' && (
            <div>
              <span className="font-bold text-slate-900 block mb-1">Postorder Traversal (L → R → Root)</span>
              <p>
                Visits children before the parent. In C and C++, postorder is mandatory for safely deallocating all
                heap memory with <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">free(node)</code> without
                dangling pointer bugs.
              </p>
            </div>
          )}

          {activeMode === 'levelorder' && (
            <div>
              <span className="font-bold text-slate-900 block mb-1">Level-Order Traversal (Breadth-First Search)</span>
              <p>
                Visits nodes row-by-row from depth 0 (root) down to the leaves using a FIFO queue. Useful for level-by-level
                visual rendering and serialization.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
