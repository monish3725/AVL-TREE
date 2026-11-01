import React, { useState } from 'react';
import { RotateCw, Play, Sparkles, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useAvl } from '../../context/AvlContext';

export const RotationWorkshopView: React.FC = () => {
  const { triggerPresetRotation, rotationHistory } = useAvl();

  const [activeTab, setActiveTab] = useState<'LL' | 'RR' | 'LR' | 'RL'>('LL');

  const rotationCases = [
    {
      type: 'LL' as const,
      name: 'Left-Left (LL) Imbalance',
      solution: 'Single Right Rotation (rightRotate)',
      triggerSequence: '[30, 20, 10]',
      condition: 'BF(Root) > 1 and new key < LeftChild->key',
      explanation:
        'A new node is inserted into the left subtree of the left child. Node 30 becomes left-heavy with BF=+2. A single right rotation pivots around Node 20, making 20 the new root with 10 on the left and 30 on the right.',
      cCode: `// From test3.c:
if (bf > 1 && isbn < root->left->isbn) {
    return rightRotate(root);
}`,
    },
    {
      type: 'RR' as const,
      name: 'Right-Right (RR) Imbalance',
      solution: 'Single Left Rotation (leftRotate)',
      triggerSequence: '[10, 20, 30]',
      condition: 'BF(Root) < -1 and new key > RightChild->key',
      explanation:
        'A new node is inserted into the right subtree of the right child. Node 10 becomes right-heavy with BF=-2. A single left rotation pivots around Node 20, promoting 20 to the root.',
      cCode: `// From test3.c:
if (bf < -1 && isbn > root->right->isbn) {
    return leftRotate(root);
}`,
    },
    {
      type: 'LR' as const,
      name: 'Left-Right (LR) Imbalance',
      solution: 'Double Rotation: Left on Child, then Right on Root',
      triggerSequence: '[30, 10, 20]',
      condition: 'BF(Root) > 1 and new key > LeftChild->key',
      explanation:
        'A new node is inserted into the right subtree of the left child, creating a "zigzag" shape. First, perform leftRotate on the left child (Node 10), which straightens the path into an LL case. Then perform rightRotate on root (Node 30).',
      cCode: `// From test3.c:
if (bf > 1 && isbn > root->left->isbn) {
    root->left = leftRotate(root->left);
    return rightRotate(root);
}`,
    },
    {
      type: 'RL' as const,
      name: 'Right-Left (RL) Imbalance',
      solution: 'Double Rotation: Right on Child, then Left on Root',
      triggerSequence: '[10, 30, 20]',
      condition: 'BF(Root) < -1 and new key < RightChild->key',
      explanation:
        'A new node is inserted into the left subtree of the right child, creating a right-left zigzag. First perform rightRotate on the right child (Node 30) to convert it to an RR case, followed by leftRotate on root (Node 10).',
      cCode: `// From test3.c:
if (bf < -1 && isbn < root->right->isbn) {
    root->right = rightRotate(root->right);
    return leftRotate(root);
}`,
    },
  ];

  const currentCase = rotationCases.find((c) => c.type === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-teal-600" />
          AVL Self-Balancing Rotation Workshop
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          An AVL tree maintains an invariant where the height difference between the left and right subtrees
          of any node (the Balance Factor BF = h_L - h_R) never exceeds ±1. When an insertion or deletion
          causes |BF| &gt; 1, the tree restores O(log n) balance using one of 4 rotation operations.
        </p>

        {/* Tab switcher */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          {rotationCases.map((rc) => (
            <button
              key={rc.type}
              onClick={() => setActiveTab(rc.type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === rc.type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {rc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Case Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-teal-700 uppercase">
              Case {currentCase.type} Analysis
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{currentCase.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Solution: {currentCase.solution}</p>
          </div>

          <button
            onClick={() => triggerPresetRotation(currentCase.type)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Live Simulate {currentCase.type} on Tree
          </button>
        </div>

        {/* Explanation & Math Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">Trigger Condition & Mechanics</span>
            <p className="text-slate-600 leading-relaxed">{currentCase.explanation}</p>
            <div className="pt-2 font-mono text-[11px] text-slate-700">
              <span className="text-slate-400 block">Balance Invariant:</span>
              <code>{currentCase.condition}</code>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto">
            <div className="text-slate-400 text-[11px] mb-2 font-sans font-semibold">
              Original C Implementation (test3.c)
            </div>
            <pre className="text-teal-400">{currentCase.cCode}</pre>
          </div>
        </div>

        {/* Rotation Diagram ASCII / Diagrammatic Representation */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 font-mono text-xs">
          <span className="font-bold text-slate-900 block mb-2">Subtree Transformation Model</span>
          {activeTab === 'LL' && (
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">Before (Imbalanced)</span>
                <pre className="text-rose-700 leading-tight">
{`      30 (BF=+2)
     /
   20 (BF=+1)
  /
10`}
                </pre>
              </div>
              <div className="text-slate-400 flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-teal-600" />
                <span className="text-[11px] mt-1">rightRotate(30)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">After (Balanced)</span>
                <pre className="text-emerald-700 leading-tight">
{`      20 (BF=0)
     /  \\
   10    30`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'RR' && (
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">Before (Imbalanced)</span>
                <pre className="text-rose-700 leading-tight">
{`   10 (BF=-2)
     \\
      20 (BF=-1)
        \\
         30`}
                </pre>
              </div>
              <div className="text-slate-400 flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-teal-600" />
                <span className="text-[11px] mt-1">leftRotate(10)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">After (Balanced)</span>
                <pre className="text-emerald-700 leading-tight">
{`      20 (BF=0)
     /  \\
   10    30`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'LR' && (
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">1. Zigzag Form</span>
                <pre className="text-rose-700 leading-tight">
{`      30 (BF=+2)
     /
   10
     \\
      20`}
                </pre>
              </div>
              <div className="text-slate-400 flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-teal-600" />
                <span className="text-[11px] mt-1">leftRotate(10) → rightRotate(30)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">2. Balanced Result</span>
                <pre className="text-emerald-700 leading-tight">
{`      20 (BF=0)
     /  \\
   10    30`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'RL' && (
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">1. Zigzag Form</span>
                <pre className="text-rose-700 leading-tight">
{`   10 (BF=-2)
     \\
      30
     /
   20`}
                </pre>
              </div>
              <div className="text-slate-400 flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-teal-600" />
                <span className="text-[11px] mt-1">rightRotate(30) → leftRotate(10)</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-1 text-[11px]">2. Balanced Result</span>
                <pre className="text-emerald-700 leading-tight">
{`      20 (BF=0)
     /  \\
   10    30`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
