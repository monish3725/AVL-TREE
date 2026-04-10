# AVL-TREE Library Management System

AVL Tree implementation for efficient library book management with O(log n) operations.

## Problem Statement
Design a system to store books in sorted order by ISBN for quick search, insert, and delete even as collection grows.

## Objective  
Create efficient library system using AVL Tree that maintains sorted records and fast operations.

## Data Fields
- ISBN (long long) - Unique identifier
- Title (string) - Book name
- Author (string) - Author name

## Data Structure
AVL Tree (Self-balancing Binary Search Tree)
- Automatic balancing with rotations
- Inorder traversal = sorted order
- O(log n) guaranteed operations

## Features
- Insert/Update book by ISBN
- Search book by ISBN
- Delete book by ISBN  
- Display books sorted by ISBN

## How to Run
gcc test3.c -o library
./library

text

## Menu
1. Insert Book
2. Search Book
3. Delete Book  
4. Display Books (Sorted)
5. Exit

## Time Complexity
- Insert: O(log n)
- Search: O(log n)  
- Delete: O(log n)
- Display: O(n)

## Team Members
- Monish Sengalvarayan
- Ryan Thomas (25BCE2615)  
- Adrian Thomas (25BCE2615)

## GitHub Link
https://github.com/monish3725/AVL-TREE

## Sample Output
ISBN: 12345 | Title: Data Structures | Author: CLRS
