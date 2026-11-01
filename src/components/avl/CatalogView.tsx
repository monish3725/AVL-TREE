import React, { useState } from 'react';
import { Search, Download, Trash2, CheckCircle2, BookOpen, User, Calendar, Plus } from 'lucide-react';
import { useAvl } from '../../context/AvlContext';
import { Book } from '../../types/avl';

export const CatalogView: React.FC<{ onOpenInsertModal: () => void }> = ({ onOpenInsertModal }) => {
  const { books, deleteBook, checkoutBook, returnBook, exportCatalogCSV } = useAvl();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [lendingBook, setLendingBook] = useState<Book | null>(null);

  // Lending modal state
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const genres = ['all', ...Array.from(new Set(books.map((b) => b.genre)))];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(book.isbn).includes(searchQuery);

    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const handleOpenLend = (book: Book) => {
    setLendingBook(book);
    setMemberName('');
    setMemberId(`MEM-${Math.floor(1000 + Math.random() * 9000)}`);
    setDueDate('2026-11-20');
  };

  const handleConfirmLend = (e: React.FormEvent) => {
    e.preventDefault();
    if (lendingBook && memberName.trim()) {
      checkoutBook(lendingBook.isbn, memberName, memberId, dueDate);
      setLendingBook(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total Catalog Titles</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{books.length}</span>
            <span className="text-xs text-slate-400">Indexed in AVL</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total Volume Copies</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-700">
              {books.reduce((acc, b) => acc + b.copiesTotal, 0)}
            </span>
            <span className="text-xs text-slate-400">Physical copies</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Available on Shelf</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {books.reduce((acc, b) => acc + b.copiesAvailable, 0)}
            </span>
            <span className="text-xs text-slate-400">Ready for checkout</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Currently On Loan</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-indigo-700">
              {books.reduce((acc, b) => acc + (b.copiesTotal - b.copiesAvailable), 0)}
            </span>
            <span className="text-xs text-slate-400">Active borrowers</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog by ISBN, title, or author..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Genre select */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === 'all' ? 'All Genres' : g}
              </option>
            ))}
          </select>

          <button
            onClick={exportCatalogCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={onOpenInsertModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Book
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">ISBN (Key)</th>
                <th className="py-3 px-4">Book Title & Author</th>
                <th className="py-3 px-4">Category / Genre</th>
                <th className="py-3 px-4">Shelf Location</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Borrower Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No books found matching the current search.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.isbn} className="hover:bg-slate-50/80 transition-colors">
                    {/* ISBN */}
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-slate-900">
                      {book.isbn}
                    </td>

                    {/* Title & Author */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{book.title}</span>
                        <span className="text-[11px] text-slate-500">by {book.author}</span>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="py-3.5 px-4 text-slate-600">{book.genre}</td>

                    {/* Shelf */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{book.shelf}</td>

                    {/* Availability */}
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      <span
                        className={`font-semibold ${
                          book.copiesAvailable > 0 ? 'text-teal-700' : 'text-rose-600'
                        }`}
                      >
                        {book.copiesAvailable} / {book.copiesTotal} available
                      </span>
                    </td>

                    {/* Borrower Status */}
                    <td className="py-3.5 px-4">
                      {book.borrower ? (
                        <div className="flex flex-col text-[11px]">
                          <span className="font-semibold text-slate-800">{book.borrower.memberName}</span>
                          <span className="text-slate-400 font-mono">Due: {book.borrower.dueDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">On shelf</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {book.copiesAvailable > 0 ? (
                          <button
                            onClick={() => handleOpenLend(book)}
                            className="px-2.5 py-1 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
                          >
                            Checkout
                          </button>
                        ) : (
                          <button
                            onClick={() => returnBook(book.isbn)}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            Return Copy
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Remove book ISBN ${book.isbn} from AVL Tree?`)) {
                              deleteBook(book.isbn);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Node from Tree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lend Copy Modal */}
      {lendingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Lend Book Copy</h3>
              <button
                onClick={() => setLendingBook(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmLend} className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block">{lendingBook.title}</span>
                <span className="text-slate-500 font-mono text-[11px]">ISBN: {lendingBook.isbn}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Borrower Member Name *</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Adrian Thomas"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Member ID</label>
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Return Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLendingBook(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Confirm Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
