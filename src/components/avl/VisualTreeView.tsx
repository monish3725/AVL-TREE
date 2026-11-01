import React, { useState } from 'react';
import { Search, RotateCcw, Plus, Trash2, BookOpen, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAvl } from '../../context/AvlContext';
import { AVLNode } from '../../types/avl';
import { getHeight, getBalanceFactor } from '../../utils/avlTree';

export const VisualTreeView: React.FC<{ onOpenInsertModal: () => void }> = ({ onOpenInsertModal }) => {
  const {
    root,
    searchBook,
    activeSearchPath,
    clearSearchHighlight,
    selectedNode,
    setSelectedNode,
    deleteBook,
    resetTree,
    treeStats,
    rotationHistory,
  } = useAvl();

  const [searchIsbn, setSearchIsbn] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<{ message: string; found: boolean } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(searchIsbn.trim(), 10);
    if (isNaN(val)) return;

    const res = searchBook(val);
    if (res.found) {
      setSearchFeedback({
        message: `Found "${res.found.book.title}" in ${res.path.length} comparisons (${res.path.join(' → ')})`,
        found: true,
      });
    } else {
      setSearchFeedback({
        message: `ISBN ${val} not found in tree. Path traversed: ${res.path.join(' → ') || 'Root is empty'}`,
        found: false,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchIsbn('');
    setSearchFeedback(null);
    clearSearchHighlight();
  };

  // Helper to render tree branches & nodes recursively in SVG
  const renderTreeEdges = (node: AVLNode | null): React.ReactNode[] => {
    if (!node || node.x === undefined || node.y === undefined) return [];

    const elements: React.ReactNode[] = [];

    if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
      const isLeftInPath =
        activeSearchPath.includes(node.isbn) && activeSearchPath.includes(node.left.isbn);

      elements.push(
        <line
          key={`edge-left-${node.isbn}-${node.left.isbn}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke={isLeftInPath ? '#059669' : '#cbd5e1'}
          strokeWidth={isLeftInPath ? 3 : 2}
          strokeDasharray={isLeftInPath ? 'none' : 'none'}
          className="transition-all duration-300"
        />
      );
      elements.push(...renderTreeEdges(node.left));
    }

    if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
      const isRightInPath =
        activeSearchPath.includes(node.isbn) && activeSearchPath.includes(node.right.isbn);

      elements.push(
        <line
          key={`edge-right-${node.isbn}-${node.right.isbn}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke={isRightInPath ? '#059669' : '#cbd5e1'}
          strokeWidth={isRightInPath ? 3 : 2}
          strokeDasharray={isRightInPath ? 'none' : 'none'}
          className="transition-all duration-300"
        />
      );
      elements.push(...renderTreeEdges(node.right));
    }

    return elements;
  };

  const renderTreeNodes = (node: AVLNode | null): React.ReactNode[] => {
    if (!node || node.x === undefined || node.y === undefined) return [];

    const isSelected = selectedNode?.isbn === node.isbn;
    const isInSearchPath = activeSearchPath.includes(node.isbn);
    const bf = getBalanceFactor(node);
    const nodeHeight = getHeight(node);

    const elements: React.ReactNode[] = [];

    elements.push(
      <g
        key={`node-${node.isbn}`}
        onClick={() => setSelectedNode(node)}
        className="cursor-pointer group select-none"
      >
        {/* Glow halo when in search path */}
        {isInSearchPath && (
          <circle
            cx={node.x}
            cy={node.y}
            r={30}
            fill="#10b981"
            opacity={0.2}
            className="animate-pulse"
          />
        )}

        {/* Outer Node Circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r={24}
          fill={isSelected ? '#0f172a' : isInSearchPath ? '#059669' : '#ffffff'}
          stroke={isSelected ? '#0f172a' : isInSearchPath ? '#047857' : '#94a3b8'}
          strokeWidth={isSelected || isInSearchPath ? 3 : 2}
          className="transition-all duration-200 group-hover:stroke-teal-600 shadow-sm"
        />

        {/* ISBN Text */}
        <text
          x={node.x}
          y={node.y - 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isSelected || isInSearchPath ? '#ffffff' : '#0f172a'}
          fontSize="11"
          fontWeight="bold"
          fontFamily="JetBrains Mono, monospace"
        >
          {node.isbn}
        </text>

        {/* Balance Factor Tag: BF = ... */}
        <g transform={`translate(${node.x + 14}, ${node.y - 14})`}>
          <circle
            cx={0}
            cy={0}
            r={8}
            fill={Math.abs(bf) > 1 ? '#ef4444' : '#f1f5f9'}
            stroke={Math.abs(bf) > 1 ? '#dc2626' : '#cbd5e1'}
            strokeWidth={1}
          />
          <text
            x={0}
            y={0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={Math.abs(bf) > 1 ? '#ffffff' : '#475569'}
            fontSize="8"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            {bf > 0 ? `+${bf}` : bf}
          </text>
        </g>

        {/* Height label beneath */}
        <text
          x={node.x}
          y={node.y + 35}
          textAnchor="middle"
          fill="#64748b"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
        >
          h={nodeHeight}
        </text>
      </g>
    );

    if (node.left) elements.push(...renderTreeNodes(node.left));
    if (node.right) elements.push(...renderTreeNodes(node.right));

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total Books in Tree (N)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {treeStats.totalNodes}
            </span>
            <span className="text-xs text-slate-400">Nodes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Current Tree Height (h)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-700">
              {treeStats.height}
            </span>
            <span className="text-xs text-slate-400">
              Optimal: {treeStats.minPossibleHeight}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Search Time Complexity</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-indigo-700">O(log n)</span>
            <span className="text-xs text-slate-400">Guaranteed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Balancing Invariants</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              |BF| ≤ 1
            </span>
            <span className="text-xs text-slate-400">Strictly Balanced</span>
          </div>
        </div>
      </div>

      {/* Control & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              value={searchIsbn}
              onChange={(e) => setSearchIsbn(e.target.value)}
              placeholder="Search by ISBN (e.g. 10020, 10040)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            Trace Search
          </button>
          {activeSearchPath.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
            >
              Clear
            </button>
          )}
        </form>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetTree}
            title="Reset to default seed catalog"
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Tree
          </button>

          <button
            onClick={onOpenInsertModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Insert Book
          </button>
        </div>
      </div>

      {/* Search Feedback Callout */}
      {searchFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            searchFeedback.found
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-mono">
            {searchFeedback.found ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{searchFeedback.message}</span>
          </div>
          <button
            onClick={handleClearSearch}
            className="text-[11px] underline font-sans text-slate-600 hover:text-slate-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Canvas Viewport & Node Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SVG Tree Canvas */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Live AVL Binary Tree Canvas</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300 inline-block" />
                <span className="font-mono text-[11px]">BF = h(L) - h(R)</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Click any node to inspect book details</span>
          </div>

          <div className="p-4 overflow-x-auto min-h-[460px] flex items-center justify-center bg-radial from-slate-50 to-white">
            {!root ? (
              <div className="text-center py-20 text-slate-400 text-xs">
                <p className="font-semibold text-sm text-slate-600">Tree is currently empty</p>
                <p className="mt-1">Insert a book node or reset the tree to view the visual layout.</p>
                <button
                  onClick={resetTree}
                  className="mt-4 px-4 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
                >
                  Load Seed Books
                </button>
              </div>
            ) : (
              <svg width="800" height="420" viewBox="0 0 800 420" className="overflow-visible">
                {/* Edges */}
                <g>{renderTreeEdges(root)}</g>
                {/* Nodes */}
                <g>{renderTreeNodes(root)}</g>
              </svg>
            )}
          </div>

          {/* Canvas Footer Legend */}
          <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span>Circle: ISBN</span>
              <span>Tag: Balance Factor (+1, 0, -1)</span>
              <span>Bottom: Node Height (h)</span>
            </div>
            <div>Green Glow: Active Search Trace</div>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Node Inspector
            </h4>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                {/* Book Cover if available */}
                {selectedNode.book.coverImage && (
                  <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img
                      src={selectedNode.book.coverImage}
                      alt={selectedNode.book.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div>
                  <span className="font-mono text-sm font-bold text-slate-900 block">
                    ISBN: {selectedNode.isbn}
                  </span>
                  <span className="font-semibold text-slate-800 text-sm mt-1 block">
                    {selectedNode.book.title}
                  </span>
                  <span className="text-slate-500 text-xs block mt-0.5">
                    by {selectedNode.book.author}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Height (h):</span>
                    <span className="font-bold text-slate-800">{getHeight(selectedNode)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Balance Factor (BF):</span>
                    <span
                      className={`font-bold ${
                        Math.abs(getBalanceFactor(selectedNode)) <= 1
                          ? 'text-teal-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {getBalanceFactor(selectedNode)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Left Child:</span>
                    <span>{selectedNode.left ? selectedNode.left.isbn : 'NULL'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Right Child:</span>
                    <span>{selectedNode.right ? selectedNode.right.isbn : 'NULL'}</span>
                  </div>
                </div>

                <div className="space-y-1 text-slate-600 text-xs">
                  <div>
                    <span className="font-medium text-slate-700">Genre:</span> {selectedNode.book.genre}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Location:</span> {selectedNode.book.shelf}
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Inventory:</span>{' '}
                    <span className="font-mono font-semibold text-teal-800">
                      {selectedNode.book.copiesAvailable}
                    </span>{' '}
                    available of {selectedNode.book.copiesTotal}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete book node ISBN ${selectedNode.isbn} from the AVL tree?`)) {
                        deleteBook(selectedNode.isbn);
                      }
                    }}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Node
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Click any node in the tree to inspect its ISBN, height, and book metadata.</p>
              </div>
            )}
          </div>

            {/* Recent Rotation Activity Feed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Rotation Event Feed
            </h4>
            {rotationHistory.length === 0 ? (
              <p className="text-slate-400 text-[11px]">
                No rotations triggered yet. All nodes are in perfect balance (|BF| ≤ 1).
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rotationHistory.slice(0, 5).map((rot) => (
                  <div key={rot.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between font-mono font-bold text-teal-900">
                      <span>{rot.type} Rotation</span>
                      <span className="text-[10px] text-slate-400">{rot.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{rot.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
