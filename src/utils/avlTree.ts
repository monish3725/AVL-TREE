import { Book, AVLNode, RotationEvent, RotationType } from '../types/avl';

export function getHeight(node: AVLNode | null): number {
  if (!node) return 0;
  return node.height;
}

export function getBalanceFactor(node: AVLNode | null): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

export function updateNodeMetadata(node: AVLNode): AVLNode {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  node.balanceFactor = getBalanceFactor(node);
  return node;
}

export function rightRotate(
  y: AVLNode,
  onRotation?: (event: RotationEvent) => void,
  isDouble?: boolean
): AVLNode {
  const x = y.left!;
  const T2 = x.right;

  // Perform rotation
  x.right = y;
  y.left = T2;

  // Update heights & balance factors
  updateNodeMetadata(y);
  updateNodeMetadata(x);

  if (onRotation && !isDouble) {
    onRotation({
      id: `rot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'LL',
      pivotIsbn: y.isbn,
      pivotTitle: y.book.title,
      description: `Single Right Rotation (LL) on Node ${y.isbn}`,
      timestamp: new Date().toLocaleTimeString(),
      details: `Node ${y.isbn} was left-heavy (BF=${y.balanceFactor + 2}). Right rotation promoted left child ${x.isbn} to root.`,
    });
  }

  return x;
}

export function leftRotate(
  x: AVLNode,
  onRotation?: (event: RotationEvent) => void,
  isDouble?: boolean
): AVLNode {
  const y = x.right!;
  const T2 = y.left;

  // Perform rotation
  y.left = x;
  x.right = T2;

  // Update heights & balance factors
  updateNodeMetadata(x);
  updateNodeMetadata(y);

  if (onRotation && !isDouble) {
    onRotation({
      id: `rot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'RR',
      pivotIsbn: x.isbn,
      pivotTitle: x.book.title,
      description: `Single Left Rotation (RR) on Node ${x.isbn}`,
      timestamp: new Date().toLocaleTimeString(),
      details: `Node ${x.isbn} was right-heavy (BF=${x.balanceFactor - 2}). Left rotation promoted right child ${y.isbn} to root.`,
    });
  }

  return y;
}

export function insertBookNode(
  root: AVLNode | null,
  book: Book,
  onRotation?: (event: RotationEvent) => void
): AVLNode {
  // 1. Perform normal BST insertion
  if (!root) {
    return {
      isbn: book.isbn,
      book,
      height: 1,
      balanceFactor: 0,
      left: null,
      right: null,
    };
  }

  if (book.isbn < root.isbn) {
    root.left = insertBookNode(root.left, book, onRotation);
  } else if (book.isbn > root.isbn) {
    root.right = insertBookNode(root.right, book, onRotation);
  } else {
    // Duplicate ISBN: update book details (matches test3.c)
    root.book = book;
    return root;
  }

  // 2. Update height & balance factor
  updateNodeMetadata(root);
  const bf = root.balanceFactor;

  // 3. Balance the tree (4 Cases)
  // Case 1: Left Left (LL)
  if (bf > 1 && book.isbn < root.left!.isbn) {
    return rightRotate(root, onRotation, false);
  }

  // Case 2: Right Right (RR)
  if (bf < -1 && book.isbn > root.right!.isbn) {
    return leftRotate(root, onRotation, false);
  }

  // Case 3: Left Right (LR)
  if (bf > 1 && book.isbn > root.left!.isbn) {
    if (onRotation) {
      onRotation({
        id: `rot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'LR',
        pivotIsbn: root.isbn,
        pivotTitle: root.book.title,
        description: `Double Left-Right Rotation (LR) on Node ${root.isbn}`,
        timestamp: new Date().toLocaleTimeString(),
        details: `Left child ${root.left!.isbn} was right-heavy. First rotated left on child ${root.left!.isbn}, then rotated right on root ${root.isbn}.`,
      });
    }
    root.left = leftRotate(root.left!, undefined, true);
    return rightRotate(root, undefined, true);
  }

  // Case 4: Right Left (RL)
  if (bf < -1 && book.isbn < root.right!.isbn) {
    if (onRotation) {
      onRotation({
        id: `rot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'RL',
        pivotIsbn: root.isbn,
        pivotTitle: root.book.title,
        description: `Double Right-Left Rotation (RL) on Node ${root.isbn}`,
        timestamp: new Date().toLocaleTimeString(),
        details: `Right child ${root.right!.isbn} was left-heavy. First rotated right on child ${root.right!.isbn}, then rotated left on root ${root.isbn}.`,
      });
    }
    root.right = rightRotate(root.right!, undefined, true);
    return leftRotate(root, undefined, true);
  }

  return root;
}

export function minValueNode(node: AVLNode): AVLNode {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
}

export function deleteBookNode(
  root: AVLNode | null,
  isbn: number,
  onRotation?: (event: RotationEvent) => void
): AVLNode | null {
  if (!root) return null;

  if (isbn < root.isbn) {
    root.left = deleteBookNode(root.left, isbn, onRotation);
  } else if (isbn > root.isbn) {
    root.right = deleteBookNode(root.right, isbn, onRotation);
  } else {
    // Node found
    if (!root.left || !root.right) {
      const temp = root.left ? root.left : root.right;
      if (!temp) {
        root = null;
      } else {
        root = temp;
      }
    } else {
      const temp = minValueNode(root.right);
      root.isbn = temp.isbn;
      root.book = temp.book;
      root.right = deleteBookNode(root.right, temp.isbn, onRotation);
    }
  }

  if (!root) return null;

  updateNodeMetadata(root);
  const bf = root.balanceFactor;

  // Balancing Cases for Deletion (Matching test3.c)
  // LL Case
  if (bf > 1 && getBalanceFactor(root.left) >= 0) {
    return rightRotate(root, onRotation, false);
  }

  // LR Case
  if (bf > 1 && getBalanceFactor(root.left) < 0) {
    if (onRotation) {
      onRotation({
        id: `rot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'LR',
        pivotIsbn: root.isbn,
        pivotTitle: root.book.title,
        description: `Deletion: Left-Right Rotation (LR) on Node ${root.isbn}`,
        timestamp: new Date().toLocaleTimeString(),
        details: `Rebalanced subtree after deleting node ${isbn}.`,
      });
    }
    root.left = leftRotate(root.left!, undefined, true);
    return rightRotate(root, undefined, true);
  }

  // RR Case
  if (bf < -1 && getBalanceFactor(root.right) <= 0) {
    return leftRotate(root, onRotation, false);
  }

  // RL Case
  if (bf < -1 && getBalanceFactor(root.right) > 0) {
    if (onRotation) {
      onRotation({
        id: `rot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'RL',
        pivotIsbn: root.isbn,
        pivotTitle: root.book.title,
        description: `Deletion: Right-Left Rotation (RL) on Node ${root.isbn}`,
        timestamp: new Date().toLocaleTimeString(),
        details: `Rebalanced subtree after deleting node ${isbn}.`,
      });
    }
    root.right = rightRotate(root.right!, undefined, true);
    return leftRotate(root, undefined, true);
  }

  return root;
}

export function searchBookNode(
  root: AVLNode | null,
  isbn: number,
  path: number[] = []
): { found: AVLNode | null; path: number[] } {
  if (!root) return { found: null, path };

  path.push(root.isbn);

  if (root.isbn === isbn) {
    return { found: root, path };
  }

  if (isbn < root.isbn) {
    return searchBookNode(root.left, isbn, path);
  } else {
    return searchBookNode(root.right, isbn, path);
  }
}

// Inorder Traversal: Returns books sorted by ISBN (Monish's menu option 4)
export function getInorderBooks(root: AVLNode | null, list: Book[] = []): Book[] {
  if (root) {
    getInorderBooks(root.left, list);
    list.push(root.book);
    getInorderBooks(root.right, list);
  }
  return list;
}

export function getInorderIsbns(root: AVLNode | null, list: number[] = []): number[] {
  if (root) {
    getInorderIsbns(root.left, list);
    list.push(root.isbn);
    getInorderIsbns(root.right, list);
  }
  return list;
}

export function getPreorderIsbns(root: AVLNode | null, list: number[] = []): number[] {
  if (root) {
    list.push(root.isbn);
    getPreorderIsbns(root.left, list);
    getPreorderIsbns(root.right, list);
  }
  return list;
}

export function getPostorderIsbns(root: AVLNode | null, list: number[] = []): number[] {
  if (root) {
    getPostorderIsbns(root.left, list);
    getPostorderIsbns(root.right, list);
    list.push(root.isbn);
  }
  return list;
}

export function getLevelOrderIsbns(root: AVLNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: AVLNode[] = [root];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current.isbn);
    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }

  return result;
}

export function countNodes(root: AVLNode | null): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

// SVG Tree Layout Calculation
export function assignTreeCoordinates(
  root: AVLNode | null,
  canvasWidth: number = 800,
  startX?: number,
  startY: number = 60,
  level: number = 0,
  yOffset: number = 75
): AVLNode | null {
  if (!root) return null;

  const treeHeight = getHeight(root);
  const initialWidth = startX ?? canvasWidth / 2;

  function setCoordinates(
    node: AVLNode | null,
    x: number,
    y: number,
    depth: number
  ) {
    if (!node) return;

    node.x = x;
    node.y = y;

    // The gap decreases as depth increases to avoid overlap
    const spread = Math.max(28, (canvasWidth / Math.pow(2, depth + 1.8)));

    if (node.left) {
      setCoordinates(node.left, x - spread, y + yOffset, depth + 1);
    }
    if (node.right) {
      setCoordinates(node.right, x + spread, y + yOffset, depth + 1);
    }
  }

  setCoordinates(root, initialWidth, startY, 0);
  return root;
}
