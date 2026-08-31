import { useState, useEffect } from "react";
import { fetchResources, fetchSolvedResources, toggleSolvedResource } from "../api";
import { aptitudeTopics } from "./aptitudeResourcesData";
import "./Resources.css";

const dsaTopics = [
  {
    icon: "▣",
    title: "Arrays",
    description:
      "Searching, sorting, prefix sums, hashing and two-pointer problems.",
    problemCount: 75,
    problems: [
      {
        name: "Two Sum",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/two-sum/",
      },
      {
        name: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        leetcode:
          "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      },
      {
        name: "Maximum Subarray",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        name: "Product of Array Except Self",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/product-of-array-except-self/",
      },
      {
        name: "First Missing Positive",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/first-missing-positive/",
      },
    ],
  },

  {
    icon: "Aa",
    title: "Strings",
    description:
      "String manipulation, hashing, patterns, anagrams and sliding window.",
    problemCount: 65,
    problems: [
      {
        name: "Valid Anagram",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/valid-anagram/",
      },
      {
        name: "Valid Palindrome",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/valid-palindrome/",
      },
      {
        name: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        name: "Group Anagrams",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/group-anagrams/",
      },
      {
        name: "Minimum Window Substring",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/minimum-window-substring/",
      },
    ],
  },

  {
    icon: "↗",
    title: "Linked List",
    description:
      "Reversal, cycle detection, merging, fast-slow pointers and more.",
    problemCount: 55,
    problems: [
      {
        name: "Reverse Linked List",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        name: "Merge Two Sorted Lists",
        difficulty: "Easy",
        leetcode:
          "https://leetcode.com/problems/merge-two-sorted-lists/",
      },
      {
        name: "Linked List Cycle",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/linked-list-cycle/",
      },
      {
        name: "Add Two Numbers",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/add-two-numbers/",
      },
      {
        name: "Merge k Sorted Lists",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
    ],
  },

  {
    icon: "◫",
    title: "Stack & Queue",
    description:
      "Monotonic stacks, queues, expressions and implementation problems.",
    problemCount: 50,
    problems: [
      {
        name: "Valid Parentheses",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        name: "Min Stack",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/min-stack/",
      },
      {
        name: "Evaluate Reverse Polish Notation",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      },
      {
        name: "Daily Temperatures",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/daily-temperatures/",
      },
      {
        name: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      },
    ],
  },

  {
    icon: "◇",
    title: "Trees",
    description:
      "Traversal, BST, recursion, depth, views and tree-based problems.",
    problemCount: 80,
    problems: [
      {
        name: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        leetcode:
          "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      },
      {
        name: "Invert Binary Tree",
        difficulty: "Easy",
        leetcode:
          "https://leetcode.com/problems/invert-binary-tree/",
      },
      {
        name: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        name: "Validate Binary Search Tree",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/validate-binary-search-tree/",
      },
      {
        name: "Binary Tree Maximum Path Sum",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      },
    ],
  },

  {
    icon: "◎",
    title: "Graphs",
    description:
      "BFS, DFS, shortest paths, connected components and graph algorithms.",
    problemCount: 75,
    problems: [
      {
        name: "Number of Islands",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        name: "Clone Graph",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/clone-graph/",
      },
      {
        name: "Course Schedule",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/course-schedule/",
      },
      {
        name: "Rotting Oranges",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/rotting-oranges/",
      },
      {
        name: "Word Ladder",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/word-ladder/",
      },
    ],
  },

  {
    icon: "⌁",
    title: "Dynamic Programming",
    description:
      "Memoization, tabulation, state transitions, knapsack and DP patterns.",
    problemCount: 100,
    problems: [
      {
        name: "Climbing Stairs",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/climbing-stairs/",
      },
      {
        name: "House Robber",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/house-robber/",
      },
      {
        name: "Coin Change",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/coin-change/",
      },
      {
        name: "Longest Increasing Subsequence",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/longest-increasing-subsequence/",
      },
      {
        name: "Edit Distance",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/edit-distance/",
      },
    ],
  },

  {
    icon: "⚡",
    title: "Recursion & Backtracking",
    description:
      "Combinations, permutations, subsets and constraint-based problems.",
    problemCount: 60,
    problems: [
      {
        name: "Subsets",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/subsets/",
      },
      {
        name: "Permutations",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/permutations/",
      },
      {
        name: "Combination Sum",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/combination-sum/",
      },
      {
        name: "Letter Combinations of a Phone Number",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
      },
      {
        name: "N-Queens",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/n-queens/",
      },
    ],
  },

  {
    icon: "↔",
    title: "Two Pointers",
    description:
      "Pair problems, sorted arrays, partitioning and pointer techniques.",
    problemCount: 40,
    problems: [
      {
        name: "Valid Palindrome",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/valid-palindrome/",
      },
      {
        name: "Move Zeroes",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/move-zeroes/",
      },
      {
        name: "Remove Duplicates from Sorted Array",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      },
      {
        name: "Two Sum II - Input Array Is Sorted",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      },
      {
        name: "3Sum",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/3sum/",
      },
      {
        name: "Container With Most Water",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/container-with-most-water/",
      },
      {
        name: "4Sum",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/4sum/",
      },
      {
        name: "Trapping Rain Water",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/trapping-rain-water/",
      },
    ],
  },

  {
    icon: "⌁",
    title: "Sliding Window",
    description:
      "Subarrays, substrings, frequency tracking and window optimization.",
    problemCount: 45,
    problems: [
      {
        name: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      },
      {
        name: "Contains Duplicate II",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/contains-duplicate-ii/",
      },
      {
        name: "Maximum Average Subarray I",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/maximum-average-subarray-i/",
      },
      {
        name: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        name: "Longest Repeating Character Replacement",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/longest-repeating-character-replacement/",
      },
      {
        name: "Permutation in String",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/permutation-in-string/",
      },
      {
        name: "Minimum Window Substring",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/minimum-window-substring/",
      },
      {
        name: "Sliding Window Maximum",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
      },
    ],
  },

  {
    icon: "⌗",
    title: "Binary Search",
    description:
      "Search space reduction, sorted arrays and binary search on answers.",
    problemCount: 50,
    problems: [
      {
        name: "Binary Search",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/binary-search/",
      },
      {
        name: "First Bad Version",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/first-bad-version/",
      },
      {
        name: "Search a 2D Matrix",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/search-a-2d-matrix/",
      },
      {
        name: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      },
      {
        name: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
      },
      {
        name: "Koko Eating Bananas",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/koko-eating-bananas/",
      },
      {
        name: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      },
      {
        name: "Split Array Largest Sum",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/split-array-largest-sum/",
      },
    ],
  },

  {
    icon: "◉",
    title: "Heap & Priority Queue",
    description:
      "Top K problems, scheduling, median finding and priority-based algorithms.",
    problemCount: 45,
    problems: [
      {
        name: "Kth Largest Element in a Stream",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      },
      {
        name: "Last Stone Weight",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/last-stone-weight/",
      },
      {
        name: "Kth Largest Element in an Array",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      },
      {
        name: "Top K Frequent Elements",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/top-k-frequent-elements/",
      },
      {
        name: "Task Scheduler",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/task-scheduler/",
      },
      {
        name: "Find K Closest Elements",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/find-k-closest-elements/",
      },
      {
        name: "Find Median from Data Stream",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/find-median-from-data-stream/",
      },
      {
        name: "Merge k Sorted Lists",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
    ],
  },

  {
    icon: "⌘",
    title: "Hashing",
    description:
      "Hash maps, hash sets, frequency counting and lookup optimization.",
    problemCount: 40,
    problems: [
      {
        name: "Contains Duplicate",
        difficulty: "Easy",
        leetcode:
          "https://leetcode.com/problems/contains-duplicate/",
      },
      {
        name: "Valid Anagram",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/valid-anagram/",
      },
      {
        name: "Two Sum",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/two-sum/",
      },
      {
        name: "Isomorphic Strings",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/isomorphic-strings/",
      },
      {
        name: "Group Anagrams",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/group-anagrams/",
      },
      {
        name: "Top K Frequent Elements",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
      },
      {
        name: "Longest Consecutive Sequence",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/longest-consecutive-sequence/",
      },
      {
        name: "First Missing Positive",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/first-missing-positive/",
      },
    ],
  },

  {
    icon: "△",
    title: "Greedy",
    description:
      "Interval scheduling, optimization and locally optimal strategies.",
    problemCount: 45,
    problems: [
      {
        name: "Assign Cookies",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/assign-cookies/",
      },
      {
        name: "Lemonade Change",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/lemonade-change/",
      },
      {
        name: "Best Time to Buy and Sell Stock II",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
      },
      {
        name: "Jump Game",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/jump-game/",
      },
      {
        name: "Jump Game II",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/jump-game-ii/",
      },
      {
        name: "Gas Station",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/gas-station/",
      },
      {
        name: "Partition Labels",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/partition-labels/",
      },
      {
        name: "Candy",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/candy/",
      },
    ],
  },

  {
    icon: "⊞",
    title: "Bit Manipulation",
    description:
      "Bitwise operators, XOR tricks, masks and binary representations.",
    problemCount: 35,
    problems: [
      {
        name: "Single Number",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/single-number/",
      },
      {
        name: "Number of 1 Bits",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/number-of-1-bits/",
      },
      {
        name: "Counting Bits",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/counting-bits/",
      },
      {
        name: "Reverse Bits",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/reverse-bits/",
      },
      {
        name: "Missing Number",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/missing-number/",
      },
      {
        name: "Sum of Two Integers",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/sum-of-two-integers/",
      },
      {
        name: "Single Number II",
        difficulty: "Medium",
        leetcode: "https://leetcode.com/problems/single-number-ii/",
      },
      {
        name: "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix",
        difficulty: "Hard",
        leetcode: "https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix/",
      },
    ],
  },
];

const dsaQuestions = {
  Arrays: [
    {
      title: "Two Sum",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/two-sum/",
    },
    {
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    },
    {
      title: "Maximum Subarray",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      title: "Product of Array Except Self",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
    },
    {
      title: "Container With Most Water",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
    },
    {
      title: "First Missing Positive",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/first-missing-positive/",
    },
  ],

  Strings: [
    {
      title: "Valid Anagram",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-anagram/",
    },
    {
      title: "Valid Palindrome",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-palindrome/",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    {
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/longest-palindromic-substring/",
    },
    {
      title: "Group Anagrams",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/group-anagrams/",
    },
    {
      title: "Minimum Window Substring",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/minimum-window-substring/",
    },
  ],

  "Linked List": [
    {
      title: "Reverse Linked List",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/reverse-linked-list/",
    },
    {
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/",
    },
    {
      title: "Linked List Cycle",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/linked-list-cycle/",
    },
    {
      title: "Add Two Numbers",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/add-two-numbers/",
    },
    {
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    },
    {
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
    },
  ],

  "Stack & Queue": [
    {
      title: "Valid Parentheses",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-parentheses/",
    },
    {
      title: "Implement Queue using Stacks",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/implement-queue-using-stacks/",
    },
    {
      title: "Min Stack",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/min-stack/",
    },
    {
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    },
    {
      title: "Daily Temperatures",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
    },
    {
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    },
  ],

  Trees: [
    {
      title: "Binary Tree Inorder Traversal",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    },
    {
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      leetcode:
        "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    },
    {
      title: "Invert Binary Tree",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/invert-binary-tree/",
    },
    {
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/validate-binary-search-tree/",
    },
    {
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
    {
      title: "Lowest Common Ancestor of a BST",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    },
    {
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    },
  ],

  Graphs: [
    {
      title: "Find if Path Exists in Graph",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
    },
    {
      title: "Number of Islands",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/number-of-islands/",
    },
    {
      title: "Clone Graph",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/clone-graph/",
    },
    {
      title: "Course Schedule",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/course-schedule/",
    },
    {
      title: "Rotting Oranges",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/rotting-oranges/",
    },
    {
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    },
    {
      title: "Word Ladder",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/word-ladder/",
    },
  ],

  "Dynamic Programming": [
    {
      title: "Climbing Stairs",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/climbing-stairs/",
    },
    {
      title: "House Robber",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/house-robber/",
    },
    {
      title: "Coin Change",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/coin-change/",
    },
    {
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/longest-increasing-subsequence/",
    },
    {
      title: "Word Break",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/word-break/",
    },
    {
      title: "Unique Paths",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/unique-paths/",
    },
    {
      title: "Edit Distance",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/edit-distance/",
    },
  ],

  "Recursion & Backtracking": [
    {
      title: "Subsets",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/subsets/",
    },
    {
      title: "Permutations",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/permutations/",
    },
    {
      title: "Combination Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/combination-sum/",
    },
    {
      title: "Word Search",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/word-search/",
    },
    {
      title: "Palindrome Partitioning",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/palindrome-partitioning/",
    },
    {
      title: "N-Queens",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/n-queens/",
    },
    {
      title: "Sudoku Solver",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/sudoku-solver/",
    },
  ],

  "Two Pointers": [
    {
      title: "Valid Palindrome",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-palindrome/",
    },
    {
      title: "Move Zeroes",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/move-zeroes/",
    },
    {
      title: "Remove Duplicates from Sorted Array",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    },
    {
      title: "Two Sum II - Input Array Is Sorted",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    },
    {
      title: "3Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/3sum/",
    },
    {
      title: "Container With Most Water",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
    },
    {
      title: "4Sum",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/4sum/",
    },
    {
      title: "Trapping Rain Water",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
    },
  ],

  "Sliding Window": [
    {
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    },
    {
      title: "Contains Duplicate II",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/contains-duplicate-ii/",
    },
    {
      title: "Maximum Average Subarray I",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/maximum-average-subarray-i/",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    {
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    },
    {
      title: "Permutation in String",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/permutation-in-string/",
    },
    {
      title: "Minimum Window Substring",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/minimum-window-substring/",
    },
    {
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/sliding-window-maximum/",
    },
  ],

  "Binary Search": [
    {
      title: "Binary Search",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/binary-search/",
    },
    {
      title: "First Bad Version",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/first-bad-version/",
    },
    {
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/search-a-2d-matrix/",
    },
    {
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    },
    {
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    },
    {
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/koko-eating-bananas/",
    },
    {
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    },
    {
      title: "Split Array Largest Sum",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/split-array-largest-sum/",
    },
  ],

  "Heap & Priority Queue": [
    {
      title: "Kth Largest Element in a Stream",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    },
    {
      title: "Last Stone Weight",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/last-stone-weight/",
    },
    {
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    },
    {
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
    },
    {
      title: "Task Scheduler",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/task-scheduler/",
    },
    {
      title: "Find K Closest Elements",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/find-k-closest-elements/",
    },
    {
      title: "Find Median from Data Stream",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/find-median-from-data-stream/",
    },
    {
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
    },
  ],

  Hashing: [
    {
      title: "Contains Duplicate",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/contains-duplicate/",
    },
    {
      title: "Valid Anagram",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-anagram/",
    },
    {
      title: "Two Sum",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/two-sum/",
    },
    {
      title: "Isomorphic Strings",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/isomorphic-strings/",
    },
    {
      title: "Group Anagrams",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/group-anagrams/",
    },
    {
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
    },
    {
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/longest-consecutive-sequence/",
    },
    {
      title: "First Missing Positive",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/first-missing-positive/",
    },
  ],

  Greedy: [
    {
      title: "Assign Cookies",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/assign-cookies/",
    },
    {
      title: "Lemonade Change",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/lemonade-change/",
    },
    {
      title: "Best Time to Buy and Sell Stock II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    },
    {
      title: "Jump Game",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game/",
    },
    {
      title: "Jump Game II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/jump-game-ii/",
    },
    {
      title: "Gas Station",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/gas-station/",
    },
    {
      title: "Partition Labels",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/partition-labels/",
    },
    {
      title: "Candy",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/candy/",
    },
  ],

  "Bit Manipulation": [
    {
      title: "Single Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/single-number/",
    },
    {
      title: "Number of 1 Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/number-of-1-bits/",
    },
    {
      title: "Counting Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/counting-bits/",
    },
    {
      title: "Reverse Bits",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/reverse-bits/",
    },
    {
      title: "Missing Number",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/missing-number/",
    },
    {
      title: "Sum of Two Integers",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/sum-of-two-integers/",
    },
    {
      title: "Single Number II",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/single-number-ii/",
    },
    {
      title: "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix/",
    },
  ],
};

function Resources() {
  const [activeHubTab, setActiveHubTab] = useState("all"); // "all" | "dsa" | "aptitude"
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [apiTopics, setApiTopics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Aptitude specific states (hidden by default until a card is clicked)
  const [selectedAptDomainIndex, setSelectedAptDomainIndex] = useState(null);
  const [aptSearch, setAptSearch] = useState("");
  const [aptDifficulty, setAptDifficulty] = useState("All");
  const [aptCompanyFilter, setAptCompanyFilter] = useState("All");
  const [expandedAptSolutions, setExpandedAptSolutions] = useState({});
  const [selectedAptOptions, setSelectedAptOptions] = useState({});
  const [copiedAptId, setCopiedAptId] = useState(null);

  const [solvedQuestions, setSolvedQuestions] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("intervista-solved-questions")
      ) || [];
    } catch {
      return [];
    }
  });

  // Always preserve full 15 DSA topics
  const activeTopics = (apiTopics && apiTopics.length >= dsaTopics.length) ? apiTopics : dsaTopics;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchResources({ search: searchQuery, difficulty: difficultyFilter })
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setApiTopics(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, difficultyFilter]);

  useEffect(() => {
    let isMounted = true;
    fetchSolvedResources()
      .then((solvedList) => {
        if (isMounted && Array.isArray(solvedList)) {
          setSolvedQuestions(solvedList);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSolved = (problemName) => {
    const updated = solvedQuestions.includes(problemName)
      ? solvedQuestions.filter((name) => name !== problemName)
      : [...solvedQuestions, problemName];

    setSolvedQuestions(updated);
    try {
      localStorage.setItem(
        "intervista-solved-questions",
        JSON.stringify(updated)
      );
    } catch {
      // LocalStorage fallback
    }

    toggleSolvedResource(problemName).catch(() => {});
  };

  const openTopic = (index) => {
    if (selectedTopic === index) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(index);
      setSearchQuery("");
      setDifficultyFilter("All");

      setTimeout(() => {
        const target = document.getElementById("questions-section");
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  const selectedTopicData = selectedTopic !== null
    ? (activeTopics[selectedTopic] || dsaTopics[selectedTopic] || null)
    : null;

  const currentQuestions = selectedTopicData
    ? (
        (dsaQuestions[selectedTopicData.title] && dsaQuestions[selectedTopicData.title].length > 0)
          ? dsaQuestions[selectedTopicData.title]
          : (selectedTopicData.problems || []).map((p) => ({
              title: p.name || p.title,
              difficulty: p.difficulty,
              leetcode: p.leetcode || p.leetcode_url || `https://leetcode.com/problemset/?search=${encodeURIComponent(p.name || p.title)}`,
            }))
      )
    : [];

  const filteredQuestions = currentQuestions.filter((question) => {
    const qTitle = question.title || question.name || "";
    const matchesSearch =
      !searchQuery ||
      qTitle.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesDifficulty =
      difficultyFilter === "All" ||
      (question.difficulty && question.difficulty.toLowerCase() === difficultyFilter.toLowerCase());

    return matchesSearch && matchesDifficulty;
  });

  // Aptitude logic
  const currentAptDomain =
    selectedAptDomainIndex !== null ? aptitudeTopics[selectedAptDomainIndex] : null;

  const filteredAptQuestions = currentAptDomain
    ? currentAptDomain.questions.filter((q) => {
        const matchesSearch =
          !aptSearch ||
          q.title.toLowerCase().includes(aptSearch.toLowerCase()) ||
          q.question.toLowerCase().includes(aptSearch.toLowerCase()) ||
          q.topic.toLowerCase().includes(aptSearch.toLowerCase()) ||
          q.companies?.some((c) => c.toLowerCase().includes(aptSearch.toLowerCase()));

        const matchesDifficulty =
          aptDifficulty === "All" || q.difficulty === aptDifficulty;

        const matchesCompany =
          aptCompanyFilter === "All" ||
          q.companies?.some((c) => c.toLowerCase() === aptCompanyFilter.toLowerCase());

        return matchesSearch && matchesDifficulty && matchesCompany;
      })
    : [];

  const toggleAptDomain = (index) => {
    if (selectedAptDomainIndex === index) {
      setSelectedAptDomainIndex(null);
    } else {
      setSelectedAptDomainIndex(index);
      setAptSearch("");
      setAptDifficulty("All");
      setAptCompanyFilter("All");
      setTimeout(() => {
        document.getElementById("aptitude-practice-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  };

  const toggleAptSolution = (id) => {
    setExpandedAptSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectAptOption = (questionId, optionIndex) => {
    setSelectedAptOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const copyAptToClipboard = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAptId(id);
      setTimeout(() => setCopiedAptId(null), 2000);
    }
  };

  const switchToTab = (tab) => {
    setActiveHubTab(tab);
    setTimeout(() => {
      document.getElementById("hub-navigation")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  return (
    <div className="resource-page">

      {/* Hero */}
      <section className="resource-hero">

        <div className="resource-hero-content">

          <span className="resource-badge">
            ✦ INTERVISTA AI RESOURCES
          </span>

          <h1>
            Prepare smarter.
            <br />
            <span>Practice with purpose.</span>
          </h1>

          <p>
            Master DSA algorithms, Quantitative Aptitude, Logical Reasoning puzzles,
            and sharpen your technical skills for top tier product and service companies.
          </p>

          <div className="resource-actions">

            <button
              className="resource-primary-btn"
              type="button"
              onClick={() => switchToTab("dsa")}
            >
              Explore DSA Roadmap
            </button>

            <button
              className="resource-secondary-btn"
              type="button"
              onClick={() => switchToTab("aptitude")}
            >
              Aptitude & Logic Hub →
            </button>

          </div>

        </div>

        {/* Right Side Visual */}
        <div className="resource-visual">

          <div className="resource-orbit orbit-one"></div>
          <div className="resource-orbit orbit-two"></div>
          <div className="resource-orbit orbit-three"></div>

          <div className="resource-core">
            <span>✦</span>
          </div>

          <div className="resource-floating-card card-top">
            <span>✓</span>

            <div>
              <strong>DSA Practice</strong>
              <small>Linked with LeetCode</small>
            </div>
          </div>

          <div className="resource-floating-card card-bottom">
            <span>🧮</span>

            <div>
              <strong>Aptitude & Logic</strong>
              <small>Verified Top Company Questions</small>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* HUB NAVIGATION SWITCHER */}
      {/* ========================================================= */}
      <div className="resource-hub-nav-wrap" id="hub-navigation">
        <div className="resource-hub-nav resource-hub-nav-three">
          <button
            type="button"
            className={`hub-nav-btn ${activeHubTab === "all" ? "active" : ""}`}
            onClick={() => setActiveHubTab("all")}
          >
            <span className="hub-nav-icon">✦</span>
            <div className="hub-nav-text">
              <strong>All Resources</strong>
              <small>15 DSA Topics & Aptitude Modules</small>
            </div>
          </button>

          <button
            type="button"
            className={`hub-nav-btn ${activeHubTab === "dsa" ? "active" : ""}`}
            onClick={() => setActiveHubTab("dsa")}
          >
            <span className="hub-nav-icon">⌘</span>
            <div className="hub-nav-text">
              <strong>DSA Roadmap</strong>
              <small>All 15 DSA Topic Cards</small>
            </div>
          </button>

          <button
            type="button"
            className={`hub-nav-btn ${activeHubTab === "aptitude" ? "active" : ""}`}
            onClick={() => setActiveHubTab("aptitude")}
          >
            <span className="hub-nav-icon">🧮</span>
            <div className="hub-nav-text">
              <strong>Aptitude & Logic Hub</strong>
              <small>Quant, Logic & Interview Puzzles</small>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DSA ROADMAP SECTION */}
      {/* ========================================================= */}
      {(activeHubTab === "all" || activeHubTab === "dsa") && (
        <>
          <section className="resource-section dsa-section" id="dsa-topics">
            <div className="resource-section-heading">
              <span>DSA ROADMAP</span>
              <h2>
                Master DSA,
                <br />
                <span>one topic at a time.</span>
              </h2>
              <p>
                Select a topic and start solving curated interview problems directly on LeetCode.
              </p>
            </div>

            <div className="dsa-grid">
              {activeTopics.map((topic, index) => (
                <div
                  className={`dsa-card ${selectedTopic === index ? "active" : ""}`}
                  key={topic.title}
                  onClick={() => openTopic(index)}
                >
                  <div className="dsa-card-icon">{topic.icon}</div>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <div className="dsa-card-bottom">
                    <span>{topic.problemCount} Problems</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTopic(index);
                      }}
                    >
                      Practice →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTopic !== null && selectedTopicData && (
              <div className="questions-panel" id="questions-section">
                <div className="questions-header">
                  <div>
                    <span className="resource-badge">PRACTICE SET</span>
                    <h2>
                      {selectedTopicData.title}
                      <span> Questions</span>
                    </h2>
                    <p>Solve curated questions and practice directly on LeetCode.</p>
                  </div>
                  <button
                    type="button"
                    className="close-questions"
                    onClick={() => setSelectedTopic(null)}
                    title="Close questions panel"
                  >
                    ✕
                  </button>
                </div>

                {/* Search and Difficulty Filter Controls */}
                <div className="questions-toolbar">
                  <input
                    type="text"
                    placeholder="Search questions in this topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="difficulty-filters">
                    {["All", "Easy", "Medium", "Hard"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={difficultyFilter === level ? "active-filter" : ""}
                        onClick={() => setDifficultyFilter(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="questions-list">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => {
                      const qTitle = question.title || question.name;
                      const isSolved = solvedQuestions.includes(qTitle);

                      return (
                        <div
                          className={`question-item ${isSolved ? "question-solved" : ""}`}
                          key={qTitle || index}
                        >
                          <div className="question-number">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="question-info">
                            <h3>{qTitle}</h3>
                            <span className={`difficulty ${(question.difficulty || "medium").toLowerCase()}`}>
                              {question.difficulty}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`solve-toggle ${isSolved ? "solved" : ""}`}
                            onClick={() => toggleSolved(qTitle)}
                          >
                            {isSolved ? "✓ Solved" : "Mark Solved"}
                          </button>

                          <a
                            href={question.leetcode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="leetcode-btn"
                          >
                            Solve on LeetCode →
                          </a>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-questions">
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔎</div>
                      <h3>No questions found</h3>
                      <p>Try another search term or difficulty level.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* ========================================================= */}
      {/* TAB 2: APTITUDE & LOGICAL REASONING HUB */}
      {/* ========================================================= */}
      {(activeHubTab === "all" || activeHubTab === "aptitude") && (
        <section className="resource-section aptitude-resources-hub" id="aptitude-hub">
          <div className="resource-section-heading">
            <span className="resource-badge">APTITUDE & REASONING HUB</span>
            <h2>
              Ace Aptitude & Logic Tests,
              <br />
              <span>topic by topic with verified solutions.</span>
            </h2>
            <p>
              Master Quantitative Aptitude, Logical Reasoning, and Classic Tech Puzzles
              asked in online assessments (TCS, Infosys, Amazon, Google, Microsoft, Meta).
            </p>
          </div>

          {/* 3 Domain Selector Cards */}
          <div className="aptitude-domain-grid">
            {aptitudeTopics.map((domain, index) => (
              <div
                key={domain.id}
                className={`aptitude-domain-card ${selectedAptDomainIndex === index ? "active" : ""}`}
                onClick={() => toggleAptDomain(index)}
              >
                <div className="domain-card-icon">{domain.icon}</div>
                <h3>{domain.title}</h3>
                <p>{domain.description}</p>
                <div className="domain-card-meta">
                  <span>{domain.problemCount} Curated Sets</span>
                  <span>{domain.formulaCount} Core Formulas</span>
                </div>
                <button
                  type="button"
                  className="domain-select-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAptDomain(index);
                  }}
                >
                  {selectedAptDomainIndex === index ? "Hide Questions ✕" : "View Questions →"}
                </button>
              </div>
            ))}
          </div>

          {/* Active Domain Practice Set - Hidden until a domain card is clicked */}
          {selectedAptDomainIndex !== null && currentAptDomain && (
            <div className="aptitude-practice-panel" id="aptitude-practice-panel">
              <div className="aptitude-panel-header questions-header">
                <div>
                  <span className="resource-badge">{currentAptDomain.category.toUpperCase()}</span>
                  <h2>{currentAptDomain.title} Practice Set</h2>
                  <p>
                    Comprehensive practice questions with step-by-step mathematical logic and company insights.
                  </p>
                </div>
                <button
                  type="button"
                  className="close-questions"
                  onClick={() => setSelectedAptDomainIndex(null)}
                  title="Close Aptitude questions"
                >
                  ✕
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="aptitude-hub-filter-bar">
                <input
                  type="text"
                  placeholder="Search questions, topics, formulas, or companies..."
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                  className="aptitude-hub-search"
                />

                <div className="aptitude-filter-row">
                  <div className="filter-group">
                    <label>Difficulty:</label>
                    {["All", "Easy", "Medium", "Hard"].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        className={`filter-btn ${aptDifficulty === diff ? "active" : ""}`}
                        onClick={() => setAptDifficulty(diff)}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>

                  <div className="filter-group">
                    <label>Target Company:</label>
                    {["All", "Google", "Amazon", "Microsoft", "Meta", "TCS", "Infosys", "Apple", "Adobe"].map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        className={`filter-btn ${aptCompanyFilter === comp ? "active" : ""}`}
                        onClick={() => setAptCompanyFilter(comp)}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Stream */}
              <div className="aptitude-questions-stream">
                {filteredAptQuestions.length > 0 ? (
                  filteredAptQuestions.map((q, idx) => {
                    const isSolved = solvedQuestions.includes(q.title);
                    const isExpanded = !!expandedAptSolutions[q.id];
                    const selectedOpt = selectedAptOptions[q.id];
                    const isCopied = copiedAptId === q.id;

                    return (
                      <div
                        key={q.id}
                        className={`apt-resource-card ${isSolved ? "solved" : ""}`}
                      >
                        <div className="apt-card-top">
                          <div className="apt-card-badges">
                            <span className="apt-index-badge">#{String(idx + 1).padStart(2, "0")}</span>
                            <span className="apt-topic-badge">{q.topic}</span>
                            <span className={`apt-diff-badge ${q.difficulty.toLowerCase()}`}>
                              {q.difficulty}
                            </span>
                            {q.companies && q.companies.length > 0 && (
                              <div className="apt-companies-tags">
                                {q.companies.slice(0, 3).map((comp) => (
                                  <span key={comp} className="company-tag">{comp}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="apt-card-actions">
                            <button
                              type="button"
                              className={`solve-toggle ${isSolved ? "solved" : ""}`}
                              onClick={() => toggleSolved(q.title)}
                            >
                              {isSolved ? "✓ Solved" : "Mark Solved"}
                            </button>
                            <button
                              type="button"
                              className="apt-copy-btn"
                              onClick={() => copyAptToClipboard(`${q.title}\n\n${q.question}\n\nOptions:\n${q.options ? q.options.join("\n") : ""}`, q.id)}
                            >
                              {isCopied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        </div>

                        <h3 className="apt-card-title">{q.title}</h3>
                        <p className="apt-card-question">{q.question}</p>

                        {/* MCQ Options */}
                        {q.options && q.options.length > 0 && (
                          <div className="apt-mcq-grid">
                            {q.options.map((opt, oIdx) => {
                              const letter = String.fromCharCode(65 + oIdx);
                              const isSelected = selectedOpt === oIdx;
                              const isCorrect = isExpanded && opt.startsWith(q.correctAnswer.charAt(0));
                              const isWrong = isSelected && !opt.startsWith(q.correctAnswer.charAt(0)) && isExpanded;

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  className={`apt-mcq-choice ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                                  onClick={() => selectAptOption(q.id, oIdx)}
                                >
                                  <span className="mcq-badge">{letter}</span>
                                  <span className="mcq-text">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Solution Toggle & Drawer */}
                        <div className="apt-solution-action">
                          <button
                            type="button"
                            className={`reveal-solution-btn ${isExpanded ? "active" : ""}`}
                            onClick={() => toggleAptSolution(q.id)}
                          >
                            {isExpanded ? "Hide Answer & Derivation ▲" : "View Answer & Detailed Derivation ▼"}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="apt-solution-drawer">
                            <div className="solution-correct-banner">
                              <strong>✓ Verified Answer:</strong> {q.correctAnswer}
                            </div>

                            <div className="solution-text-block">
                              <h4>Step-by-Step Mathematical Derivation:</h4>
                              <p>{q.explanation}</p>
                            </div>

                            {q.formula && (
                              <div className="solution-formula-block">
                                <span>⚡ Core Formula & Shortcut:</span>
                                <code>{q.formula}</code>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="no-aptitude-questions">
                    <div className="no-q-icon">🔍</div>
                    <h3>No matching aptitude questions</h3>
                    <p>Try clearing your search term or selecting "All" for filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================= */}
      {/* LEARNING HUB */}
      {/* ========================================================= */}
      <section className="resource-section">
        <div className="resource-section-heading">
          <span>LEARNING HUB</span>
          <h2>
            Everything you need to
            <br />
            <span>ace your interview.</span>
          </h2>
          <p>
            Choose your domain and start learning with curated notes,
            aptitude practice, interview questions, and coding roadmaps.
          </p>
        </div>

        <div className="resource-grid resource-grid-four">
          {/* 1. DSA */}
          <div className="resource-card">
            <div className="resource-icon">⌘</div>
            <h3>DSA Questions</h3>
            <p>
              Practice topic-wise Data Structures and Algorithms questions directly connected with LeetCode.
            </p>
            <button
              type="button"
              onClick={() => switchToTab("dsa")}
            >
              Explore DSA →
            </button>
          </div>

          {/* 2. APTITUDE & LOGICAL */}
          <div className="resource-card">
            <div className="resource-icon">🧮</div>
            <h3>Aptitude & Logic</h3>
            <p>
              Quantitative aptitude, logical reasoning, and tech interview puzzles with verified step-by-step solutions.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveHubTab("all");
                toggleAptDomain(0);
              }}
            >
              Practice Aptitude →
            </button>
          </div>

          {/* 3. DOMAIN NOTES */}
          <div className="resource-card">
            <div className="resource-icon">◈</div>
            <h3>Domain Notes</h3>
            <p>
              Get personalized technical notes based on your selected development or engineering domain.
            </p>
            <button type="button">
              View Notes →
            </button>
          </div>

          {/* 4. INTERVIEW QUESTIONS */}
          <div className="resource-card">
            <div className="resource-icon">✦</div>
            <h3>Interview Questions</h3>
            <p>
              Prepare with frequently asked technical and conceptual questions from real company interviews.
            </p>
            <button type="button">
              Practice Questions →
            </button>
          </div>
        </div>
      </section>

      {/* LeetCode & Aptitude CTA */}
      <section className="dsa-resource-section">
        <div className="dsa-resource-content">
          <span className="resource-badge">
            COMPREHENSIVE PREPARATION
          </span>
          <h2>
            Turn preparation into
            <span> measurable progress.</span>
          </h2>
          <p>
            Master DSA algorithms, quantitative aptitude, logical reasoning, and company-specific interview rounds in one unified platform.
          </p>

          <div className="dsa-stats dsa-stats-four">
            <div>
              <strong>860+</strong>
              <span>Curated Problems</span>
            </div>
            <div>
              <strong>15</strong>
              <span>DSA Topics</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Aptitude Domains</span>
            </div>
            <div>
              <strong>15+</strong>
              <span>Target Companies</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Resources;