export interface Book {
  isbn: number;
  title: string;
  author: string;
  genre: string;
  copiesTotal: number;
  copiesAvailable: number;
  shelf: string;
  coverImage?: string;
  year?: number;
  borrower?: {
    memberName: string;
    memberId: string;
    dueDate: string;
  };
}

export interface AVLNode {
  isbn: number;
  book: Book;
  height: number;
  balanceFactor: number;
  left: AVLNode | null;
  right: AVLNode | null;
  x?: number;
  y?: number;
}

export type RotationType = 'LL' | 'RR' | 'LR' | 'RL';

export interface RotationEvent {
  id: string;
  type: RotationType;
  pivotIsbn: number;
  pivotTitle: string;
  description: string;
  timestamp: string;
  details: string;
}

export interface TreeStatistics {
  totalNodes: number;
  height: number;
  minPossibleHeight: number;
  maxPossibleHeight: number;
  isBalanced: boolean;
  totalRotations: number;
}
