const companyData = {
  Google: {
    overview:
      "Prepare for Google's technical and behavioral interview process with DSA, CS fundamentals, system design and problem-solving practice.",

    stats: {
      dsa: 15,
      questions: 12,
      topics: 8,
    },

    dsa: [
      {
        id: "google-two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/two-sum/",
      },
      {
        id: "google-valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Stack",
        leetcode:
          "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        id: "google-longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        topic: "Strings",
        leetcode:
          "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        id: "google-three-sum",
        title: "3Sum",
        difficulty: "Medium",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/3sum/",
      },
      {
        id: "google-merge-intervals",
        title: "Merge Intervals",
        difficulty: "Medium",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/merge-intervals/",
      },
      {
        id: "google-binary-tree-level",
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        topic: "Trees",
        leetcode:
          "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        id: "google-number-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        topic: "Graphs",
        leetcode:
          "https://leetcode.com/problems/number-of-islands/",
      },
      {
        id: "google-word-ladder",
        title: "Word Ladder",
        difficulty: "Hard",
        topic: "Graphs",
        leetcode:
          "https://leetcode.com/problems/word-ladder/",
      },
    ],

    mostAsked: [
      "Explain your most challenging project.",
      "How does a hash table work?",
      "Explain the difference between a process and a thread.",
      "What is the time complexity of your solution?",
      "How would you design a scalable system?",
      "Explain BFS and DFS.",
      "What is dynamic programming?",
      "How does garbage collection work?",
    ],

    rounds: [
      {
        name: "Online Assessment",
        description:
          "Coding problems used to evaluate problem-solving and algorithmic ability.",
      },
      {
        name: "Technical Interview 1",
        description:
          "DSA and problem-solving interview with live coding.",
      },
      {
        name: "Technical Interview 2",
        description:
          "More advanced algorithms and problem-solving.",
      },
      {
        name: "System Design",
        description:
          "Design scalable and reliable software systems.",
      },
      {
        name: "Behavioral / Googliness",
        description:
          "Communication, collaboration, leadership and behavioral questions.",
      },
    ],

    preparation: {
      overview:
        "Focus on strong DSA fundamentals, optimal problem solving, communication and system design.",

      topics: [
        "Arrays",
        "Strings",
        "Hash Maps",
        "Linked Lists",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "System Design",
      ],

      tips: [
        "Always clarify the problem before coding.",
        "Explain your approach before writing code.",
        "Start with a brute-force approach when appropriate.",
        "Optimize the solution and explain the trade-offs.",
        "Always discuss time and space complexity.",
        "Test your solution with edge cases.",
      ],
    },
  },

  Microsoft: {
    overview:
      "Prepare for Microsoft interviews with DSA, object-oriented programming, CS fundamentals and system design.",

    stats: {
      dsa: 15,
      questions: 12,
      topics: 9,
    },

    dsa: [
      {
        id: "microsoft-two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/two-sum/",
      },
      {
        id: "microsoft-reverse-list",
        title: "Reverse Linked List",
        difficulty: "Easy",
        topic: "Linked List",
        leetcode:
          "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        id: "microsoft-valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Stack",
        leetcode:
          "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        id: "microsoft-lru",
        title: "LRU Cache",
        difficulty: "Medium",
        topic: "Design",
        leetcode:
          "https://leetcode.com/problems/lru-cache/",
      },
      {
        id: "microsoft-number-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        topic: "Graphs",
        leetcode:
          "https://leetcode.com/problems/number-of-islands/",
      },
      {
        id: "microsoft-word-search",
        title: "Word Search",
        difficulty: "Medium",
        topic: "Backtracking",
        leetcode:
          "https://leetcode.com/problems/word-search/",
      },
    ],

    mostAsked: [
      "Explain the four pillars of OOP.",
      "What is the difference between an interface and an abstract class?",
      "Explain your project architecture.",
      "What is normalization in DBMS?",
      "Difference between process and thread.",
      "Explain polymorphism.",
      "What is a deadlock?",
      "Explain REST APIs.",
    ],

    rounds: [
      {
        name: "Online Assessment",
        description:
          "Programming and problem-solving assessment.",
      },
      {
        name: "Technical Round 1",
        description:
          "DSA, coding and fundamental CS concepts.",
      },
      {
        name: "Technical Round 2",
        description:
          "Advanced coding, projects and technical discussion.",
      },
      {
        name: "System Design",
        description:
          "Architecture and scalable system design.",
      },
      {
        name: "HR / Behavioral",
        description:
          "Communication, teamwork and behavioral questions.",
      },
    ],

    preparation: {
      overview:
        "Microsoft preparation should balance DSA with strong CS fundamentals and project knowledge.",

      topics: [
        "Arrays",
        "Linked Lists",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "OOP",
        "DBMS",
        "Operating Systems",
        "System Design",
      ],

      tips: [
        "Revise OOP thoroughly.",
        "Know every technology mentioned on your resume.",
        "Practice medium-level DSA problems.",
        "Practice explaining your code clearly.",
        "Revise DBMS and operating-system fundamentals.",
      ],
    },
  },

  Amazon: {
    overview:
      "Prepare for Amazon interviews with DSA, system design and Amazon Leadership Principles.",

    stats: {
      dsa: 15,
      questions: 12,
      topics: 8,
    },

    dsa: [
      {
        id: "amazon-two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/two-sum/",
      },
      {
        id: "amazon-valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Stack",
        leetcode:
          "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        id: "amazon-max-subarray",
        title: "Maximum Subarray",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        leetcode:
          "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        id: "amazon-number-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        topic: "Graphs",
        leetcode:
          "https://leetcode.com/problems/number-of-islands/",
      },
      {
        id: "amazon-kth-largest",
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        topic: "Heap",
        leetcode:
          "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      },
    ],

    mostAsked: [
      "Tell me about yourself.",
      "Tell me about a difficult technical problem you solved.",
      "Explain your project architecture.",
      "Describe a situation where you showed leadership.",
      "How would you optimize an algorithm?",
      "Explain a technical failure and what you learned.",
      "What is a hash map?",
      "Explain your most impactful project.",
    ],

    rounds: [
      {
        name: "Online Assessment",
        description:
          "Coding and problem-solving assessment.",
      },
      {
        name: "Technical Screening",
        description:
          "Initial technical evaluation.",
      },
      {
        name: "Technical Interview",
        description:
          "DSA, coding and technical fundamentals.",
      },
      {
        name: "Bar Raiser",
        description:
          "Independent evaluation of technical and behavioral skills.",
      },
      {
        name: "Leadership Principles / HR",
        description:
          "Behavioral questions based heavily on leadership principles.",
      },
    ],

    preparation: {
      overview:
        "Amazon preparation should focus on DSA plus behavioral answers using the STAR framework.",

      topics: [
        "Arrays",
        "Hashing",
        "Trees",
        "Graphs",
        "Heap",
        "Dynamic Programming",
        "System Design",
        "Leadership Principles",
      ],

      tips: [
        "Study Amazon Leadership Principles.",
        "Prepare STAR-format behavioral answers.",
        "Practice medium-level DSA extensively.",
        "Explain trade-offs clearly.",
        "Know your projects in depth.",
      ],
    },
  },

  Meta: {
    overview:
      "Prepare for Meta interviews with focused coding, algorithms, system design and behavioral preparation.",

    stats: {
      dsa: 15,
      questions: 12,
      topics: 8,
    },

    dsa: [
      {
        id: "meta-two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/two-sum/",
      },
      {
        id: "meta-valid-anagram",
        title: "Valid Anagram",
        difficulty: "Easy",
        topic: "Strings",
        leetcode:
          "https://leetcode.com/problems/valid-anagram/",
      },
      {
        id: "meta-three-sum",
        title: "3Sum",
        difficulty: "Medium",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/3sum/",
      },
      {
        id: "meta-tree-right",
        title: "Binary Tree Right Side View",
        difficulty: "Medium",
        topic: "Trees",
        leetcode:
          "https://leetcode.com/problems/binary-tree-right-side-view/",
      },
      {
        id: "meta-lca",
        title: "Lowest Common Ancestor of a Binary Tree",
        difficulty: "Medium",
        topic: "Trees",
        leetcode:
          "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      },
    ],

    mostAsked: [
      "Explain your strongest project.",
      "How would you design a social media feed?",
      "Explain BFS and DFS.",
      "How does caching work?",
      "SQL vs NoSQL?",
      "How would you scale a web application?",
      "Explain a difficult bug you solved.",
      "How do you optimize your code?",
    ],

    rounds: [
      {
        name: "Coding Screen",
        description:
          "Initial algorithmic coding evaluation.",
      },
      {
        name: "Coding Interview 1",
        description:
          "DSA and problem-solving.",
      },
      {
        name: "Coding Interview 2",
        description:
          "Advanced algorithmic problems.",
      },
      {
        name: "System Design",
        description:
          "Scalable system architecture.",
      },
      {
        name: "Behavioral",
        description:
          "Communication and collaboration.",
      },
    ],

    preparation: {
      overview:
        "Meta preparation requires strong algorithmic problem solving and fast implementation.",

      topics: [
        "Arrays",
        "Strings",
        "Hashing",
        "Trees",
        "Graphs",
        "Recursion",
        "System Design",
        "Distributed Systems",
      ],

      tips: [
        "Practice solving problems under time pressure.",
        "Focus on optimal solutions.",
        "Explain your thought process.",
        "Practice system-design fundamentals.",
        "Review common graph and tree patterns.",
      ],
    },
  },

  Apple: {
    overview:
      "Prepare for Apple technical interviews with DSA, CS fundamentals, projects and problem solving.",

    stats: {
      dsa: 12,
      questions: 10,
      topics: 7,
    },

    dsa: [
      {
        id: "apple-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      },
      {
        id: "apple-reverse-list",
        title: "Reverse Linked List",
        difficulty: "Easy",
        topic: "Linked List",
        leetcode:
          "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        id: "apple-product-array",
        title: "Product of Array Except Self",
        difficulty: "Medium",
        topic: "Arrays",
        leetcode:
          "https://leetcode.com/problems/product-of-array-except-self/",
      },
    ],

    mostAsked: [
      "Explain your project.",
      "Why did you choose this technology?",
      "Explain OOP.",
      "What is memory management?",
      "Explain your debugging approach.",
      "How would you optimize this application?",
    ],

    rounds: [
      {
        name: "Online Assessment",
        description:
          "Initial technical evaluation.",
      },
      {
        name: "Technical Interview",
        description:
          "Coding and technical fundamentals.",
      },
      {
        name: "Technical Interview",
        description:
          "Advanced technical discussion.",
      },
      {
        name: "Team / Hiring Manager",
        description:
          "Team fit and project discussion.",
      },
      {
        name: "HR",
        description:
          "Behavioral and communication discussion.",
      },
    ],

    preparation: {
      overview:
        "Apple preparation varies significantly by team, so combine strong fundamentals with role-specific knowledge.",

      topics: [
        "DSA",
        "OOP",
        "Operating Systems",
        "Computer Networks",
        "DBMS",
        "System Design",
        "Programming Fundamentals",
      ],

      tips: [
        "Understand your resume deeply.",
        "Strengthen CS fundamentals.",
        "Practice medium-level DSA.",
        "Research the role you are applying for.",
      ],
    },

      Meta: {
    stats: ["140+", "100+", "30+"],

    questions: [
      {
        title: "Valid Palindrome",
        topic: "Strings • Two Pointer",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-palindrome/",
      },
      {
        title: "3Sum",
        topic: "Arrays • Two Pointer",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/3sum/",
      },
      {
        title: "Binary Tree Right Side View",
        topic: "Trees • BFS/DFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-right-side-view/",
      },
      {
        title: "Clone Graph",
        topic: "Graphs • BFS/DFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/clone-graph/",
      },
      {
        title: "Word Search",
        topic: "Backtracking • Matrix",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/word-search/",
      },
    ],

    mostAsked: [
      "Explain the difference between BFS and DFS.",
      "How does a HashMap work?",
      "Explain the principles of object-oriented programming.",
      "What is the difference between SQL and NoSQL databases?",
      "How would you design a scalable social media feed?",
      "Tell me about a difficult technical problem you solved.",
    ],

    preparation: {
      overview:
        "Focus on strong coding fundamentals, algorithms, system thinking and communication.",
      topics:
        "Arrays, Strings, Trees, Graphs, Dynamic Programming, Hashing, System Design and OOP.",
      strategy:
        "Practice medium and hard DSA problems while learning to explain your approach clearly.",
      tips:
        "Always discuss complexity, edge cases and trade-offs before writing the final solution.",
    },

    rounds: [
      {
        title: "Initial Screening",
        description:
          "Initial evaluation through application or coding assessment.",
      },
      {
        title: "Technical Coding",
        description:
          "Algorithms, data structures and problem-solving.",
      },
      {
        title: "Technical / Design",
        description:
          "Deeper technical discussion and role-specific design.",
      },
      {
        title: "Behavioral",
        description:
          "Communication, teamwork, ownership and previous experiences.",
      },
    ],
  },

  Apple: {
    stats: ["120+", "90+", "28+"],

    questions: [
      {
        title: "Best Time to Buy and Sell Stock",
        topic: "Arrays • Greedy",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      },
      {
        title: "Product of Array Except Self",
        topic: "Arrays • Prefix",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
      },
      {
        title: "Group Anagrams",
        topic: "Strings • Hashing",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/group-anagrams/",
      },
      {
        title: "Binary Tree Maximum Path Sum",
        topic: "Trees • DFS",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      },
      {
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/coin-change/",
      },
    ],

    mostAsked: [
      "Explain memory management.",
      "What is the difference between stack and heap?",
      "Explain polymorphism and inheritance.",
      "How does a hash table work?",
      "Explain database indexing.",
      "Tell me about a project you are proud of.",
    ],

    preparation: {
      overview:
        "Prepare strong fundamentals, problem-solving skills and role-specific technical knowledge.",
      topics:
        "DSA, OOP, OS, DBMS, networking, system design and the technologies used by the target role.",
      strategy:
        "Focus on writing clean and efficient code while being able to justify every design decision.",
      tips:
        "Apple interviews can be role-specific, so study the job description carefully and prepare projects in depth.",
    },

    rounds: [
      {
        title: "Recruiter Screening",
        description:
          "Initial discussion about background, role and experience.",
      },
      {
        title: "Technical Interviews",
        description:
          "Coding, algorithms and role-specific technical questions.",
      },
      {
        title: "Team / Technical Discussion",
        description:
          "Deeper evaluation with engineers or the hiring team.",
      },
      {
        title: "Behavioral",
        description:
          "Communication, collaboration and experience-based discussion.",
      },
    ],
  },

  Netflix: {
    stats: ["100+", "80+", "25+"],

    questions: [
      {
        title: "Longest Substring Without Repeating Characters",
        topic: "Strings • Sliding Window",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        title: "Top K Frequent Elements",
        topic: "Hashing • Heap",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
      },
      {
        title: "Kth Largest Element in an Array",
        topic: "Heap • Quickselect",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      },
      {
        title: "Serialize and Deserialize Binary Tree",
        topic: "Trees • BFS/DFS",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      },
      {
        title: "Merge Intervals",
        topic: "Arrays • Sorting",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/merge-intervals/",
      },
    ],

    mostAsked: [
      "Explain caching and its trade-offs.",
      "How would you design a video streaming service?",
      "Explain load balancing.",
      "What is horizontal scaling?",
      "Explain microservices architecture.",
      "Describe a situation where you made an important technical decision.",
    ],

    preparation: {
      overview:
        "Netflix-oriented preparation should combine strong coding ability with distributed systems and system design.",
      topics:
        "DSA, system design, distributed systems, APIs, databases, caching and scalability.",
      strategy:
        "Practice DSA while spending significant time understanding scalable backend architecture.",
      tips:
        "For senior-style technical discussions, focus on trade-offs, reliability, scalability and system constraints.",
    },

    rounds: [
      {
        title: "Recruiter Screening",
        description:
          "Background, role expectations and experience discussion.",
      },
      {
        title: "Technical Screening",
        description:
          "Technical and coding evaluation.",
      },
      {
        title: "Technical / System Design",
        description:
          "Role-specific architecture and engineering discussion.",
      },
      {
        title: "Behavioral / Culture",
        description:
          "Discussion around ownership, judgment and collaboration.",
      },
    ],
  },

  Adobe: {
    stats: ["110+", "85+", "26+"],

    questions: [
      {
        title: "Merge Two Sorted Lists",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      },
      {
        title: "3Sum",
        topic: "Arrays • Two Pointer",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/3sum/",
      },
      {
        title: "Subarray Sum Equals K",
        topic: "Arrays • Prefix Sum",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
      },
      {
        title: "Lowest Common Ancestor of a Binary Tree",
        topic: "Trees",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      },
      {
        title: "Word Break",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/word-break/",
      },
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is a deadlock?",
      "Explain database normalization.",
      "What is the difference between REST and SOAP?",
      "Explain time complexity.",
      "Explain one of your major projects in detail.",
    ],

    preparation: {
      overview:
        "Build strong DSA fundamentals along with core CS and role-specific technical knowledge.",
      topics:
        "Arrays, Strings, Linked Lists, Trees, Graphs, DP, OOP, DBMS, OS and Networks.",
      strategy:
        "Solve topic-wise DSA problems and revise fundamental CS concepts regularly.",
      tips:
        "Be prepared to explain your projects, architecture decisions and implementation details.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding and aptitude-style screening.",
      },
      {
        title: "Technical Round",
        description:
          "DSA and core computer science questions.",
      },
      {
        title: "Advanced Technical",
        description:
          "Role-specific technical and problem-solving discussion.",
      },
      {
        title: "HR / Behavioral",
        description:
          "Communication and behavioral evaluation.",
      },
    ],
  },

  Salesforce: {
    stats: ["100+", "80+", "25+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hash Map",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "LRU Cache",
        topic: "Design • Hash Map",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
      {
        title: "Course Schedule",
        topic: "Graphs • Topological Sort",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/coin-change/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What is a REST API?",
      "Explain database indexing.",
      "How does a HashMap work?",
      "What is polymorphism?",
      "Explain your most challenging project.",
    ],

    preparation: {
      overview:
        "Focus on DSA, object-oriented programming, databases, APIs and role-specific Salesforce technologies.",
      topics:
        "DSA, OOP, DBMS, APIs, cloud fundamentals and system design.",
      strategy:
        "Combine coding practice with strong understanding of backend and software engineering concepts.",
      tips:
        "Understand the role requirements and prepare your projects and technical decisions thoroughly.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding and technical screening.",
      },
      {
        title: "Technical Round",
        description:
          "DSA and computer science fundamentals.",
      },
      {
        title: "Technical / Managerial",
        description:
          "Role-specific engineering and project discussion.",
      },
      {
        title: "HR / Behavioral",
        description:
          "Behavioral and communication evaluation.",
      },
    ],
  },

  IBM: {
    stats: ["90+", "70+", "24+"],

    questions: [
      {
        title: "Binary Search",
        topic: "Searching",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/binary-search/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs • BFS/DFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        title: "House Robber",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/house-robber/",
      },
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is normalization?",
      "Explain operating system scheduling.",
      "What is a REST API?",
      "Explain cloud computing.",
      "Tell me about your projects.",
    ],

    preparation: {
      overview:
        "Focus on DSA, CS fundamentals, cloud concepts and the technical requirements of the target role.",
      topics:
        "DSA, OOP, DBMS, OS, Networks, Cloud and programming fundamentals.",
      strategy:
        "Practice fundamental DSA problems and revise core CS subjects.",
      tips:
        "Prepare concise explanations of your projects and be ready to discuss implementation choices.",
    },

    rounds: [
      {
        title: "Assessment",
        description:
          "Technical and coding screening.",
      },
      {
        title: "Technical Interview",
        description:
          "Coding and core technical concepts.",
      },
      {
        title: "Managerial / Technical",
        description:
          "Role-specific technical and project discussion.",
      },
      {
        title: "HR",
        description:
          "Behavioral and communication round.",
      },
    ],
  },

  Oracle: {
    stats: ["100+", "75+", "25+"],

    questions: [
      {
        title: "Reverse Linked List",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Group Anagrams",
        topic: "Strings • Hashing",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/group-anagrams/",
      },
      {
        title: "Binary Tree Inorder Traversal",
        topic: "Trees",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      },
      {
        title: "Course Schedule",
        topic: "Graphs",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
    ],

    mostAsked: [
      "Explain OOP.",
      "What is database normalization?",
      "Explain indexing.",
      "What is a transaction?",
      "Explain multithreading.",
      "Describe your most important project.",
    ],

    preparation: {
      overview:
        "Prepare DSA and strong database, programming and software engineering fundamentals.",
      topics:
        "DSA, DBMS, SQL, OOP, OS, Networks and System Design.",
      strategy:
        "Practice coding problems and dedicate time to SQL and database concepts.",
      tips:
        "Oracle-oriented roles often benefit from strong database knowledge, so revise SQL thoroughly.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding and technical screening.",
      },
      {
        title: "Technical Round",
        description:
          "DSA, programming and CS fundamentals.",
      },
      {
        title: "Advanced Technical",
        description:
          "Role-specific technical discussion.",
      },
      {
        title: "HR / Managerial",
        description:
          "Behavioral and communication discussion.",
      },
    ],
  },

  NVIDIA: {
    stats: ["100+", "80+", "27+"],

    questions: [
      {
        title: "Single Number",
        topic: "Arrays • Bit Manipulation",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/single-number/",
      },
      {
        title: "Rotate Array",
        topic: "Arrays",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/rotate-array/",
      },
      {
        title: "LRU Cache",
        topic: "Design • Hash Map",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
      {
        title: "Word Search",
        topic: "Backtracking",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/word-search/",
      },
    ],

    mostAsked: [
      "Explain memory management.",
      "Explain multithreading.",
      "What is cache memory?",
      "Explain process vs thread.",
      "Explain pointers and memory allocation.",
      "Describe a technically challenging project.",
    ],

    preparation: {
      overview:
        "Focus on DSA, systems fundamentals and the technical requirements of the target engineering role.",
      topics:
        "DSA, C/C++, OS, computer architecture, parallel computing and system design.",
      strategy:
        "For systems-oriented roles, combine DSA with low-level programming and architecture knowledge.",
      tips:
        "Be ready to discuss performance, memory usage and optimization decisions.",
    },

    rounds: [
      {
        title: "Technical Screening",
        description:
          "Initial technical and coding evaluation.",
      },
      {
        title: "Coding Round",
        description:
          "Algorithms and problem solving.",
      },
      {
        title: "Technical Interviews",
        description:
          "Role-specific systems and engineering concepts.",
      },
      {
        title: "Behavioral",
        description:
          "Teamwork, communication and experience.",
      },
    ],
  },

  Infosys: {
    stats: ["80+", "60+", "20+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hashing",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Merge Two Sorted Lists",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is normalization?",
      "Difference between process and thread.",
      "Explain SQL joins.",
      "What is a primary key?",
      "Tell me about your project.",
    ],

    preparation: {
      overview:
        "Focus on programming fundamentals, DSA and core computer science concepts.",
      topics:
        "Arrays, Strings, OOP, DBMS, SQL, OS, Networks and basic DSA.",
      strategy:
        "Build strong fundamentals and practice easy-to-medium coding questions.",
      tips:
        "Revise aptitude and communication skills alongside technical preparation when applicable.",
    },

    rounds: [
      {
        title: "Assessment",
        description:
          "Aptitude, programming and technical screening.",
      },
      {
        title: "Technical Interview",
        description:
          "Programming and CS fundamentals.",
      },
      {
        title: "Managerial",
        description:
          "Project and role-related discussion.",
      },
      {
        title: "HR",
        description:
          "Behavioral and communication round.",
      },
    ],
  },

  TCS: {
    stats: ["80+", "65+", "20+"],

    questions: [
      {
        title: "Reverse Linked List",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Binary Search",
        topic: "Searching",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/binary-search/",
      },
      {
        title: "Best Time to Buy and Sell Stock",
        topic: "Arrays • Greedy",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      },
      {
        title: "Climbing Stairs",
        topic: "Dynamic Programming",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/climbing-stairs/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What is a database?",
      "Explain SQL joins.",
      "Difference between compiler and interpreter.",
      "What is an operating system?",
      "Explain your final-year or major project.",
    ],

    preparation: {
      overview:
        "Strong programming fundamentals and core CS knowledge are important for preparation.",
      topics:
        "Programming, OOP, DBMS, SQL, OS, Networks and basic DSA.",
      strategy:
        "Practice fundamentals and easy-to-medium coding problems consistently.",
      tips:
        "Keep project explanations clear and prepare common HR questions alongside technical topics.",
    },

    rounds: [
      {
        title: "National Qualifier / Assessment",
        description:
          "Initial aptitude and programming assessment.",
      },
      {
        title: "Technical Interview",
        description:
          "Programming and CS fundamentals.",
      },
      {
        title: "Managerial",
        description:
          "Project, role and behavioral discussion.",
      },
      {
        title: "HR",
        description:
          "Final behavioral and communication round.",
      },
    ],
  },

  Wipro: {
    stats: ["75+", "60+", "20+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Valid Anagram",
        topic: "Strings • Hashing",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-anagram/",
      },
      {
        title: "Merge Two Sorted Lists",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
    ],

    mostAsked: [
      "Explain OOP.",
      "What is DBMS?",
      "Explain SQL joins.",
      "Difference between process and thread.",
      "What is inheritance?",
      "Tell me about yourself and your projects.",
    ],

    preparation: {
      overview:
        "Focus on programming fundamentals, DSA and core computer science subjects.",
      topics:
        "Programming, OOP, DBMS, SQL, OS, Networks and basic DSA.",
      strategy:
        "Practice fundamental coding problems and revise core CS concepts.",
      tips:
        "Prepare both technical and communication questions and be ready to explain your projects.",
    },

    rounds: [
      {
        title: "Assessment",
        description:
          "Aptitude and programming screening.",
      },
      {
        title: "Technical Interview",
        description:
          "Programming and CS fundamentals.",
      },
      {
        title: "Managerial",
        description:
          "Project and behavioral discussion.",
      },
      {
        title: "HR",
        description:
          "Communication and behavioral evaluation.",
      },
    ],
  },

  Accenture: {
    stats: ["90+", "70+", "22+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hashing",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs • BFS/DFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is cloud computing?",
      "Explain SQL joins.",
      "Difference between process and thread.",
      "What is a REST API?",
      "Explain your project and your contribution.",
    ],

    preparation: {
      overview:
        "Prepare programming fundamentals, DSA, cloud concepts and communication skills.",
      topics:
        "Programming, OOP, DBMS, SQL, Cloud, APIs and basic DSA.",
      strategy:
        "Practice easy-to-medium coding questions and revise core CS fundamentals.",
      tips:
        "Prepare both technical and behavioral questions and understand the role description carefully.",
    },

    rounds: [
      {
        title: "Assessment",
        description:
          "Aptitude, technical and coding assessment.",
      },
      {
        title: "Technical Interview",
        description:
          "Programming, CS fundamentals and role-specific questions.",
      },
      {
        title: "Communication / Managerial",
        description:
          "Communication and project discussion.",
      },
      {
        title: "HR",
        description:
          "Behavioral and final discussion.",
      },
    ],
  },
  },
};

export default companyData;