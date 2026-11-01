import React from 'react';
import { GitBranch, Plus, Download, Terminal, BookOpen, RotateCw, ListFilter, Cpu } from 'lucide-react';
import { useAvl } from '../../context/AvlContext';

interface AvlHeaderProps {
  activeTab: 'tree' | 'catalog' | 'workshop' | 'traversals' | 'c_terminal' | 'roadmap';
  setActiveTab: (tab: 'tree' | 'catalog' | 'workshop' | 'traversals' | 'c_terminal' | 'roadmap') => void;
  onOpenInsertModal: () => void;
}

export const AvlHeader: React.FC<AvlHeaderProps> = ({ activeTab, setActiveTab, onOpenInsertModal }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                AVL Tree Library OS
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
                Self-Balancing Binary Search Tree & LMS
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation tabs */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'tree'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              Visual Tree Canvas
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Book Catalog & Lending
            </button>

            <button
              onClick={() => setActiveTab('workshop')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'workshop'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Rotation Workshop
            </button>

            <button
              onClick={() => setActiveTab('traversals')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'traversals'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Traversals & Metrics
            </button>

            <button
              onClick={() => setActiveTab('c_terminal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'c_terminal'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              C CLI Simulator
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              DSA Roadmap
            </button>
          </nav>

          {/* Zone 3: 1 primary action & download zip */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/hospital-database-management-system.zip"
              download="avl-tree-library-system.zip"
              title="Download Complete Source Code (.ZIP)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4 text-teal-600" />
              Download ZIP
            </a>

            <button
              onClick={onOpenInsertModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Insert Book Node
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'tree' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Visual Tree
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'catalog' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveTab('workshop')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'workshop' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rotations
          </button>
          <button
            onClick={() => setActiveTab('traversals')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'traversals' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Traversals
          </button>
          <button
            onClick={() => setActiveTab('c_terminal')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'c_terminal' ? 'bg-emerald-700 text-white' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            C Terminal
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'roadmap' ? 'bg-indigo-700 text-white' : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            Roadmap
          </button>
        </div>
      </div>
    </header>
  );
};
