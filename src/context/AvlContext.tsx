import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, AVLNode, RotationEvent, TreeStatistics } from '../types/avl';
import {
  insertBookNode,
  deleteBookNode,
  searchBookNode,
  getInorderBooks,
  getHeight,
  countNodes,
  assignTreeCoordinates,
} from '../utils/avlTree';
import { INITIAL_BOOKS } from '../data/mockBooks';

interface AvlContextType {
  root: AVLNode | null;
  books: Book[];
  rotationHistory: RotationEvent[];
  activeSearchPath: number[];
  selectedNode: AVLNode | null;
  treeStats: TreeStatistics;
  
  // Tree Actions
  insertBook: (book: Book) => void;
  deleteBook: (isbn: number) => boolean;
  searchBook: (isbn: number) => { found: AVLNode | null; path: number[] };
  clearSearchHighlight: () => void;
  setSelectedNode: (node: AVLNode | null) => void;
  checkoutBook: (isbn: number, memberName: string, memberId: string, dueDate: string) => boolean;
  returnBook: (isbn: number) => boolean;
  
  // Bulk / Utility
  resetTree: () => void;
  clearTree: () => void;
  exportCatalogJSON: () => string;
  exportCatalogCSV: () => void;
  triggerPresetRotation: (type: 'LL' | 'RR' | 'LR' | 'RL') => void;
}

const AvlContext = createContext<AvlContextType | undefined>(undefined);

const STORAGE_KEY_BOOKS = 'apex_avl_books_catalog_v1';
const STORAGE_KEY_ROTATIONS = 'apex_avl_rotations_v1';

export const AvlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rotationHistory, setRotationHistory] = useState<RotationEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ROTATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeSearchPath, setActiveSearchPath] = useState<number[]>([]);
  const [selectedNode, setSelectedNode] = useState<AVLNode | null>(null);

  // Build tree from books
  const buildTreeFromBooks = (bookList: Book[]): AVLNode | null => {
    let newRoot: AVLNode | null = null;
    const recordedEvents: RotationEvent[] = [];

    bookList.forEach((b) => {
      newRoot = insertBookNode(newRoot, b, (event) => {
        recordedEvents.push(event);
      });
    });

    return newRoot;
  };

  const [root, setRoot] = useState<AVLNode | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOOKS);
      const parsedBooks = stored ? JSON.parse(stored) : INITIAL_BOOKS;
      return buildTreeFromBooks(parsedBooks);
    } catch {
      return buildTreeFromBooks(INITIAL_BOOKS);
    }
  });

  // Derived books list via inorder traversal (sorted by ISBN)
  const books = getInorderBooks(root, []);

  // Save books to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROTATIONS, JSON.stringify(rotationHistory));
  }, [rotationHistory]);

  const handleRotationOccurred = (event: RotationEvent) => {
    setRotationHistory((prev) => [event, ...prev.slice(0, 49)]); // keep last 50 events
  };

  const insertBook = (book: Book) => {
    setRoot((currentRoot) => {
      const updated = insertBookNode(currentRoot, book, handleRotationOccurred);
      return assignTreeCoordinates(updated, 800);
    });
  };

  const deleteBook = (isbn: number): boolean => {
    const exists = books.some((b) => b.isbn === isbn);
    if (!exists) return false;

    setRoot((currentRoot) => {
      const updated = deleteBookNode(currentRoot, isbn, handleRotationOccurred);
      return assignTreeCoordinates(updated, 800);
    });

    if (selectedNode?.isbn === isbn) {
      setSelectedNode(null);
    }
    return true;
  };

  const searchBook = (isbn: number) => {
    const result = searchBookNode(root, isbn, []);
    setActiveSearchPath(result.path);
    if (result.found) {
      setSelectedNode(result.found);
    }
    return result;
  };

  const clearSearchHighlight = () => {
    setActiveSearchPath([]);
  };

  const checkoutBook = (isbn: number, memberName: string, memberId: string, dueDate: string): boolean => {
    let success = false;
    const target = books.find((b) => b.isbn === isbn);
    if (!target || target.copiesAvailable <= 0) return false;

    const updatedBook: Book = {
      ...target,
      copiesAvailable: target.copiesAvailable - 1,
      borrower: { memberName, memberId, dueDate },
    };

    setRoot((currentRoot) => {
      const updated = insertBookNode(currentRoot, updatedBook);
      return assignTreeCoordinates(updated, 800);
    });
    return true;
  };

  const returnBook = (isbn: number): boolean => {
    const target = books.find((b) => b.isbn === isbn);
    if (!target) return false;

    const updatedBook: Book = {
      ...target,
      copiesAvailable: Math.min(target.copiesTotal, target.copiesAvailable + 1),
      borrower: undefined,
    };

    setRoot((currentRoot) => {
      const updated = insertBookNode(currentRoot, updatedBook);
      return assignTreeCoordinates(updated, 800);
    });
    return true;
  };

  const resetTree = () => {
    localStorage.removeItem(STORAGE_KEY_BOOKS);
    localStorage.removeItem(STORAGE_KEY_ROTATIONS);
    setRotationHistory([]);
    setActiveSearchPath([]);
    setSelectedNode(null);
    setRoot(buildTreeFromBooks(INITIAL_BOOKS));
  };

  const clearTree = () => {
    setRoot(null);
    setActiveSearchPath([]);
    setSelectedNode(null);
  };

  // Demo tool to trigger specific rotations cleanly in the workshop
  const triggerPresetRotation = (type: 'LL' | 'RR' | 'LR' | 'RL') => {
    clearTree();
    setTimeout(() => {
      if (type === 'LL') {
        // Insert 30, 20, 10 -> triggers LL rotation on 30
        insertBook({ isbn: 30, title: 'Node 30', author: 'Author A', genre: 'LL Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' });
        setTimeout(() => insertBook({ isbn: 20, title: 'Node 20', author: 'Author B', genre: 'LL Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 100);
        setTimeout(() => insertBook({ isbn: 10, title: 'Node 10 (Triggers LL)', author: 'Author C', genre: 'LL Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 200);
      } else if (type === 'RR') {
        // Insert 10, 20, 30 -> triggers RR rotation on 10
        insertBook({ isbn: 10, title: 'Node 10', author: 'Author A', genre: 'RR Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' });
        setTimeout(() => insertBook({ isbn: 20, title: 'Node 20', author: 'Author B', genre: 'RR Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 100);
        setTimeout(() => insertBook({ isbn: 30, title: 'Node 30 (Triggers RR)', author: 'Author C', genre: 'RR Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 200);
      } else if (type === 'LR') {
        // Insert 30, 10, 20 -> triggers LR double rotation on 30
        insertBook({ isbn: 30, title: 'Node 30', author: 'Author A', genre: 'LR Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' });
        setTimeout(() => insertBook({ isbn: 10, title: 'Node 10', author: 'Author B', genre: 'LR Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 100);
        setTimeout(() => insertBook({ isbn: 20, title: 'Node 20 (Triggers LR)', author: 'Author C', genre: 'LR Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 200);
      } else if (type === 'RL') {
        // Insert 10, 30, 20 -> triggers RL double rotation on 10
        insertBook({ isbn: 10, title: 'Node 10', author: 'Author A', genre: 'RL Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' });
        setTimeout(() => insertBook({ isbn: 30, title: 'Node 30', author: 'Author B', genre: 'RL Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 100);
        setTimeout(() => insertBook({ isbn: 20, title: 'Node 20 (Triggers RL)', author: 'Author C', genre: 'RL Demo', copiesTotal: 1, copiesAvailable: 1, shelf: 'Demo' }), 200);
      }
    }, 50);
  };

  const exportCatalogJSON = (): string => {
    return JSON.stringify(books, null, 2);
  };

  const exportCatalogCSV = () => {
    const headers = ['ISBN', 'Title', 'Author', 'Genre', 'Shelf', 'Total Copies', 'Available Copies'];
    const rows = books.map((b) => [
      b.isbn,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.genre}"`,
      `"${b.shelf}"`,
      b.copiesTotal,
      b.copiesAvailable,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `library_avl_catalog_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Tree Statistics
  const totalNodes = countNodes(root);
  const currentHeight = getHeight(root);
  const minPossibleHeight = totalNodes > 0 ? Math.floor(Math.log2(totalNodes)) + 1 : 0;
  const maxPossibleHeight = totalNodes > 0 ? Math.ceil(1.44 * Math.log2(totalNodes + 2) - 0.328) : 0;

  const treeStats: TreeStatistics = {
    totalNodes,
    height: currentHeight,
    minPossibleHeight,
    maxPossibleHeight,
    isBalanced: true, // AVL is strictly balanced at all times
    totalRotations: rotationHistory.length,
  };

  return (
    <AvlContext.Provider
      value={{
        root,
        books,
        rotationHistory,
        activeSearchPath,
        selectedNode,
        treeStats,
        insertBook,
        deleteBook,
        searchBook,
        clearSearchHighlight,
        setSelectedNode,
        checkoutBook,
        returnBook,
        resetTree,
        clearTree,
        exportCatalogJSON,
        exportCatalogCSV,
        triggerPresetRotation,
      }}
    >
      {children}
    </AvlContext.Provider>
  );
};

export const useAvl = () => {
  const context = useContext(AvlContext);
  if (!context) {
    throw new Error('useAvl must be used within an AvlProvider');
  }
  return context;
};
