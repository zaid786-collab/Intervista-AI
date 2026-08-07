import { useState } from "react";
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
        name: "Find Median from Data Stream",
        difficulty: "Hard",
        leetcode:
          "https://leetcode.com/problems/find-median-from-data-stream/",
      },
      {
        name: "Task Scheduler",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/task-scheduler/",
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
        name: "Group Anagrams",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/group-anagrams/",
      },
      {
        name: "Longest Consecutive Sequence",
        difficulty: "Medium",
        leetcode:
          "https://leetcode.com/problems/longest-consecutive-sequence/",
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
        name: "Missing Number",
        difficulty: "Easy",
        leetcode: "https://leetcode.com/problems/missing-number/",
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
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      leetcode:
        "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    },
  ],

  "Stack & Queue": [
    {
      title: "Valid Parentheses",
      difficulty: "Easy",
      leetcode: "https://leetcode.com/problems/valid-parentheses/",
    },
    {
      title: "Min Stack",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/min-stack/",
    },
    {
      title: "Daily Temperatures",
      difficulty: "Medium",
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
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
  ],

  Graphs: [
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
      title: "N-Queens",
      difficulty: "Hard",
      leetcode: "https://leetcode.com/problems/n-queens/",
    },
  ],
};

function Resources({
  onOpenDashboard,
  onOpenPricing,
  onOpenFaq,
  onOpenLogin,
  onOpenSignup,
  user,
  onLogout,
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
const [difficultyFilter, setDifficultyFilter] = useState("All");
const [solvedQuestions, setSolvedQuestions] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("intervista-solved-questions")
    ) || [];
  } catch {
    return [];
  }
});
  const [difficulty, setDifficulty] = useState("All");

  const selectedData =
    selectedTopic !== null ? dsaTopics[selectedTopic] : null;

  const filteredProblems =
    selectedData?.problems.filter((problem) => {
      if (difficulty === "All") return true;

      return problem.difficulty === difficulty;
    }) || [];

  const openTopic = (index) => {
    setSelectedTopic(index);
    setDifficulty("All");

    setTimeout(() => {
      document
        .getElementById("problem-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const toggleSolved = (questionTitle) => {
  setSolvedQuestions((prev) => {
    const updated = prev.includes(questionTitle)
      ? prev.filter((title) => title !== questionTitle)
      : [...prev, questionTitle];

    localStorage.setItem(
      "intervista-solved-questions",
      JSON.stringify(updated)
    );

    return updated;
  });
};

const filteredQuestions =
  dsaQuestions[dsaTopics[selectedTopic]?.title]
    ?.filter((question) =>
      question.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter(
      (question) =>
        difficultyFilter === "All" ||
        question.difficulty === difficultyFilter
    ) || [];

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
            Master DSA, strengthen your technical fundamentals,
            and prepare for real-world interviews with personalized
            resources designed around your career path.
          </p>

          <div className="resource-actions">

            <button
              className="resource-primary-btn"
              type="button"
              onClick={() =>
                document
                  .getElementById("dsa-topics")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Resources
            </button>

            <button
              className="resource-secondary-btn"
              type="button"
              onClick={() =>
                document
                  .getElementById("dsa-topics")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Practice DSA →
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
            <span>AI</span>

            <div>
              <strong>Personalized Notes</strong>
              <small>Based on your domain</small>
            </div>
          </div>

        </div>

      </section>

      {/* DSA Topics */}
      <section
        className="resource-section dsa-section"
        id="dsa-topics"
      >

        <div className="resource-section-heading">

          <span>DSA ROADMAP</span>

          <h2>
            Master DSA,
            <br />
            <span>one topic at a time.</span>
          </h2>

          <p>
            Select a topic and start solving curated
            interview problems directly on LeetCode.
          </p>

        </div>

        <div className="dsa-grid">

          {dsaTopics.map((topic, index) => (

            <div
              className={`dsa-card ${
                selectedTopic === index ? "active" : ""
              }`}
              key={topic.title}
              onClick={() => openTopic(index)}
            >

              <div className="dsa-card-icon">
                {topic.icon}
              </div>

              <h3>{topic.title}</h3>

              <p>{topic.description}</p>

              <div className="dsa-card-bottom">

                <span>
                  {topic.problemCount} Problems
                </span>

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

        {selectedTopic !== null && (
  <div className="questions-panel">
    <div className="questions-header">
      <div>
        <span className="resource-badge">PRACTICE SET</span>

        <h2>
          {dsaTopics[selectedTopic].title}
          <span> Questions</span>
        </h2>

        <p>
          Solve curated questions and practice directly on LeetCode.
        </p>
      </div>

      <button
        type="button"
        className="close-questions"
        onClick={() => setSelectedTopic(null)}
      >
        ✕
      </button>
    </div>

    {/* <div className="questions-list">
      {dsaQuestions[dsaTopics[selectedTopic].title]?.map(
        (question, index) => (
          <div className="question-item" key={question.title}>
            <div className="question-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="question-info">
              <h3>{question.title}</h3>

              <span
                className={`difficulty ${question.difficulty.toLowerCase()}`}
              >
                {question.difficulty}
              </span>
            </div>

            <a
              href={question.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="leetcode-btn"
            >
              Solve on LeetCode →
            </a>
          </div>
        )
      )}
    </div> */}

    <div className="questions-list">

  {filteredQuestions.length > 0 ? (
    filteredQuestions.map((question, index) => {

      const isSolved = solvedQuestions.includes(question.title);

      return (
        <div
          className={`question-item ${isSolved ? "question-solved" : ""}`}
          key={question.title}
        >

          {/* Number */}
          <div className="question-number">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Question Information */}
          <div className="question-info">

            <h3>{question.title}</h3>

            <span
              className={`difficulty ${question.difficulty.toLowerCase()}`}
            >
              {question.difficulty}
            </span>

          </div>

          {/* Solved Button */}
          <button
            type="button"
            className={`solve-toggle ${
              isSolved ? "solved" : ""
            }`}
            onClick={() => toggleSolved(question.title)}
          >
            {isSolved ? "✓ Solved" : "Mark Solved"}
          </button>

          {/* LeetCode */}
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
      <div>🔎</div>

      <h3>No questions found</h3>

      <p>
        Try another search term or difficulty level.
      </p>
    </div>
  )}

</div>
  </div>
)}

      </section>

      {/* Problems */}
      {selectedData && (

        <section
          className="resource-section"
          id="problem-section"
        >

          <div className="resource-section-heading">

            <span>LEETCODE PROBLEMS</span>

            <h2>
              {selectedData.title}
              <br />
              <span>Practice Set</span>
            </h2>

            <p>
              Solve these curated problems to strengthen
              your {selectedData.title.toLowerCase()} concepts.
            </p>

          </div>

          {/* Difficulty Filter */}
          <div className="difficulty-filter">

            {["All", "Easy", "Medium", "Hard"].map(
              (level) => (

                <button
                  key={level}
                  type="button"
                  className={
                    difficulty === level
                      ? "difficulty-btn active"
                      : "difficulty-btn"
                  }
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>

              )
            )}

          </div>

          {/* Problem List */}
          <div className="problem-list">

            {filteredProblems.length === 0 ? (

              <div className="no-problems">
                No {difficulty} problems available
                for this topic yet.
              </div>

            ) : (

              filteredProblems.map((problem, index) => (

                <div
                  className="problem-card"
                  key={`${selectedData.title}-${problem.name}`}
                >

                  <div className="problem-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="problem-info">

                    <h3>{problem.name}</h3>

                    <span
                      className={`difficulty ${problem.difficulty.toLowerCase()}`}
                    >
                      {problem.difficulty}
                    </span>

                  </div>

                  <a
                    href={problem.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leetcode-btn"
                  >
                    Solve on LeetCode ↗
                  </a>

                </div>

              ))

            )}

          </div>

        </section>

      )}

      {/* Learning Hub */}
      <section className="resource-section">

        <div className="resource-section-heading">

          <span>LEARNING HUB</span>

          <h2>
            Everything you need to
            <br />
            <span>ace your interview.</span>
          </h2>

          <p>
            Choose your domain and start learning with
            curated notes, interview questions and coding problems.
          </p>

        </div>

        <div className="resource-grid">

          <div className="resource-card">

            <div className="resource-icon">⌘</div>

            <h3>DSA Questions</h3>

            <p>
              Practice topic-wise Data Structures and
              Algorithms questions directly connected with LeetCode.
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("dsa-topics")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore DSA →
            </button>

          </div>

          <div className="resource-card">

            <div className="resource-icon">◈</div>

            <h3>Domain Notes</h3>

            <p>
              Get personalized technical notes based
              on your selected development or engineering domain.
            </p>

            <button type="button">
              View Notes →
            </button>

          </div>

          <div className="resource-card">

            <div className="resource-icon">✦</div>

            <h3>Interview Questions</h3>

            <p>
              Prepare with frequently asked technical
              and conceptual questions from real interviews.
            </p>

            <button type="button">
              Practice Questions →
            </button>

          </div>

        </div>

      </section>

      {/* LeetCode CTA */}
      <section className="dsa-resource-section">

        <div className="dsa-resource-content">

          <span className="resource-badge">
            LEETCODE CONNECTED
          </span>

          <h2>
            Turn preparation into
            <span> measurable progress.</span>
          </h2>

          <p>
            Solve curated DSA problems according to difficulty
            and topic. Each problem takes you directly to LeetCode.
          </p>

          <div className="dsa-stats">

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
              <span>Difficulty Levels</span>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Resources;