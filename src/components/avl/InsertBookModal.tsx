import React, { useState } from 'react';
import { useAvl } from '../../context/AvlContext';

interface InsertBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsertBookModal: React.FC<InsertBookModalProps> = ({ isOpen, onClose }) => {
  const { insertBook, root } = useAvl();

  const [isbn, setIsbn] = useState<number>(10025);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Algorithms & Data Structures');
  const [shelf, setShelf] = useState('Floor 2 · Stack CS-06');
  const [copies, setCopies] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isbn || !title.trim() || !author.trim()) return;

    insertBook({
      isbn: Number(isbn),
      title: title.trim(),
      author: author.trim(),
      genre,
      shelf,
      copiesTotal: Number(copies),
      copiesAvailable: Number(copies),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Insert Book into AVL Tree</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The tree will self-balance using LL, RR, LR, or RL rotations if needed
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              ISBN (Numeric Key for Binary Search) *
            </label>
            <input
              type="number"
              required
              value={isbn}
              onChange={(e) => setIsbn(Number(e.target.value))}
              placeholder="e.g. 10025"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Maps directly to <code className="font-mono">long long isbn</code> in test3.c
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Concrete Mathematics: A Foundation for CS"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Author Name *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Ronald L. Graham, Donald E. Knuth"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject / Category</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Mathematics">Mathematics & Logic</option>
                <option value="General Collection">General Collection</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Inventory Copies</label>
              <input
                type="number"
                min={1}
                max={50}
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Physical Shelf Location</label>
            <input
              type="text"
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              placeholder="e.g. Floor 2 · Stack CS-06"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>

          {root && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-[11px]">
              Root key is currently <span className="font-mono font-bold">{root.isbn}</span>. Inserting{' '}
              <span className="font-mono font-bold">{isbn}</span> will traverse the{' '}
              <span className="font-bold underline">{isbn < root.isbn ? 'LEFT' : 'RIGHT'}</span> subtree.
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
            >
              Insert & Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
