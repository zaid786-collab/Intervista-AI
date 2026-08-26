import { companyAptitudeData } from "./aptitudeCompanyData";

const companyData = {
  Google: {
    stats: ["150+", "100+", "30+"],

    questions: [
      {
        title: "Minimum Time Difference",
        topic: " Staff, Array, MathString, Sorting",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/minimum-time-difference/description/?envType=problem-list-v2&envId=7p55wqm",
      },
      {
        title: "Longest Substring Without Repeating Characters",
        topic: "Strings • Sliding Window",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        title: "LRU Cache",
        topic: "Design • Hash Map",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        title: "Wave array [Practice Problem]",
        topic: "Arrays",
        difficulty: "Medium",
        url: "https://www.geeksforgeeks.org/problems/wave-array-1587115621/1",
      },
    ],

    mostAsked: [
      "Explain the difference between BFS and DFS.",
      "How does a HashMap work internally?",
      "What is the time complexity of binary search?",
      "Explain process vs thread.",
      "What is normalization in databases?",
      "How would you design a URL shortener?",
    ],

    preparation: {
      overview:
        "Focus on strong DSA fundamentals, problem-solving ability, computer science fundamentals and clear communication.",
      topics:
        "Arrays, Strings, Trees, Graphs, Dynamic Programming, Hashing, Binary Search and System Design.",
      strategy:
        "Practice problems without memorizing solutions. Focus on explaining your approach, complexity and edge cases.",
      tips:
        "During interviews, clarify the problem first, discuss your approach, write clean code and test it with examples.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding problems used for initial screening.",
      },
      {
        title: "Technical Interview",
        description:
          "DSA, algorithms, problem solving and CS fundamentals.",
      },
      {
        title: "Advanced Technical",
        description:
          "More complex coding, design and problem-solving discussion.",
      },
      {
        title: "Behavioral / Googliness",
        description:
          "Communication, collaboration, leadership and behavioral discussion.",
      },
    ],
  },

  Microsoft: {
    stats: ["130+", "90+", "28+"],

    questions: [
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • Dynamic Programming",
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
        title: "Course Schedule",
        topic: "Graphs • Topological Sort",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What is the difference between process and thread?",
      "Explain virtual memory.",
      "What is a deadlock?",
      "What is the Difference Between Abstraction and Encapsulation?",
      "How do you detect a cycle in a linked list?",
    ],

    preparation: {
      overview:
        "Microsoft interviews emphasize problem solving, coding fundamentals, CS concepts and communication.",
      topics:
        "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, OOP, OS, DBMS and Networks.",
      strategy:
        "Practice medium-level DSA problems and make sure you can explain multiple approaches.",
      tips:
        "Think aloud during the interview and explain why your chosen approach is efficient.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding and problem-solving assessment.",
      },
      {
        title: "Technical Round 1",
        description:
          "DSA and coding fundamentals.",
      },
      {
        title: "Technical Round 2",
        description:
          "Advanced coding and computer science concepts.",
      },
      {
        title: "Behavioral Round",
        description:
          "Teamwork, leadership, communication and experience.",
      },
    ],
  },

  Amazon: {
    stats: ["180+", "120+", "32+"],

    questions: [
      {
        title: "Segregate even and odd nodes in a Linked List",
        topic: "Arrays • Linked List",
        difficulty: "Easy",
        url: "https://www.geeksforgeeks.org/dsa/segregate-even-and-odd-elements-in-a-linked-list/",
      },
      {
        title: "Longest Palindromic Substring",
        topic: "Strings • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
      },
      {
        title: "Binary Tree Level Order Traversal",
        topic: "Trees • BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        title: "Rotting Oranges",
        topic: "Graphs • BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/rotting-oranges/",
      },
      {
        title: "Trapping Rain Water",
        topic: "Arrays • Two Pointer",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/trapping-rain-water/",
      },
    ],

    mostAsked: [
      "Explain the difference between stack and heap.",
      "How does BFS work?",
      "Explain binary search.",
      "Tell me about a time you were 75% through a project and had to pivot quickly. How did you handle it?",
      "Describe your most difficult customer and how you handled it. ",
      "Tell me about a difficult technical problem you solved.",
    ],

    preparation: {
      overview:
        "Amazon places strong emphasis on coding, problem solving and behavioral principles.",
      topics:
        "Arrays, Strings, Trees, Graphs, Dynamic Programming, Sorting, Searching and System Design.",
      strategy:
        "Practice timed coding problems and prepare structured behavioral answers.",
      tips:
        "Use structured examples for behavioral questions and always analyze time and space complexity.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description:
          "Coding assessment with algorithmic problems.",
      },
      {
        title: "Technical Interviews",
        description:
          "DSA, coding and technical fundamentals.",
      },
      {
        title: "Bar Raiser / Advanced Round",
        description:
          "Deeper technical and behavioral evaluation.",
      },
      {
        title: "Leadership Principles",
        description:
          "Behavioral questions based on Amazon's leadership principles.",
      },
    ],
  },

  Meta: {
    stats: ["140+", "110+", "36+"],

    questions: [
      {
        title: "Move all zeroes to the end of the array",
        topic: "Arrays",
        difficulty: "Easy",
        url: "https://www.geeksforgeeks.org/dsa/move-zeroes-end-array/",
      },
      {
        title: "Multiply large numbers represented as strings",
        topic: "Strings • DP",
        difficulty: "Medium",
        url: "https://www.geeksforgeeks.org/dsa/multiply-large-numbers-represented-as-strings/",
      },
      {
        title: "Convert a Binary Tree to a Circular Doubly Linked List",
        topic: "Trees • Linked List",
        difficulty: "Medium",
        url: "https://www.geeksforgeeks.org/dsa/convert-a-binary-tree-to-a-circular-doubly-link-list/",
      },
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        title: "Write a function to get the intersection point of two linked lists",
        topic: "Linked List",
        difficulty: "Hard",
        url: "https://www.geeksforgeeks.org/dsa/write-a-function-to-get-the-intersection-point-of-two-linked-lists/",
      },
    ],

    mostAsked: [
      "Why do you want to work at Meta, and how does our mission resonate with your personal values?",
      "How does Stack/Queue operations work ?",
      "what is sorting , Define its types ?",
      "How would you measure the success of a newly launched Instagram Reels feature?",
      "How do you address public criticism around privacy while still driving Meta’s data-driven culture?",
      "How would you measure the success of a newly launched Instagram Reels feature?",
    ],

    preparation: {
      overview:
        "Meta interviews emphasize problem solving, coding fundamentals, CS concepts and communication.",
      topics:
        "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, OOP, OS, DBMS and Networks.",
      strategy:
        "Practice medium-level DSA problems and make sure you can explain multiple approaches.",
      tips:
        "Think aloud during the interview and explain why your chosen approach is efficient.",
    },

    rounds: [
      {
        title: "Sorting of Candidates",
        description:
          "Sorting used for initial screening.",
      },
      {
        title: "Technical Interview/Assesment",
        description:
          "DSA, algorithms, problem solving and CS fundamentals.",
      },
      {
        title: "Advanced Round-",
        description:
          "More complex questions, design and coding discussion.",
      },
      {
        title: "Personal Interview",
        description:
          "Way of Speaking , collaboration, behavioral and professional discussion.",
      },
    ],
  },

  Apple: {
    stats: ["150+", "100+", "30+"],

    questions: [
      {
        title: "Binary Search",
        topic: "Arrays • Binary Search",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/binary-search/",
      },
      {
        title: "Merge Two Sorted Lists",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      },
      {
        title: "LRU Cache",
        topic: "Design • Hash Map",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
      {
        title: "Word Search",
        topic: "Backtracking • Matrix",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/word-search/",
      },
      {
        title: "Edit Distance",
        topic: "Dynamic Programming",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/edit-distance/",
      },
    ],

    mostAsked: [
      "Explain memory management in C++.",
      "What is the difference between a process and a thread?",
      "Explain multithreading and synchronization.",
      "What is dependency injection?",
      "Explain MVC architecture.",
      "How does operating system scheduling work?",
    ],

    preparation: {
      overview:
        "Focus on strong programming fundamentals, DSA, system concepts and writing clean, maintainable code.",

      topics:
        "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, OS, OOP and System Design.",

      strategy:
        "Practice explaining your approach clearly and focus on correctness, edge cases and code quality.",

      tips:
        "Think carefully about constraints, discuss trade-offs and test your solution before finalizing it.",
    },

    rounds: [
      {
        title: "Technical Screening",
        description: "Initial technical and coding assessment.",
      },
      {
        title: "Technical Interview",
        description: "DSA, programming fundamentals and problem solving.",
      },
      {
        title: "System Design",
        description: "Architecture, scalability and technical decision making.",
      },
      {
        title: "Behavioral Interview",
        description: "Communication, teamwork and behavioral discussion.",
      },
    ],
  },

  Netflix: {
    stats: ["120+", "90+", "25+"],

    questions: [
      {
        title: "Longest Substring Without Repeating Characters",
        topic: "Strings • Sliding Window",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        title: "3Sum",
        topic: "Arrays • Two Pointers",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/3sum/",
      },
      {
        title: "Top K Frequent Elements",
        topic: "Hash Map • Heap",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
      },
      {
        title: "Course Schedule",
        topic: "Graphs • Topological Sort",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
    ],

    mostAsked: [
      "How would you design a highly scalable video streaming system?",
      "Explain microservices architecture.",
      "How does caching improve application performance?",
      "What is eventual consistency?",
      "How would you debug a production performance issue?",
      "Explain horizontal versus vertical scaling.",
    ],

    preparation: {
      overview:
        "Focus on advanced problem solving, scalable systems, distributed systems and strong engineering fundamentals.",

      topics:
        "DSA, Distributed Systems, Microservices, Databases, Caching, Networking and System Design.",

      strategy:
        "Practice medium and hard problems while learning to reason about scalability and system trade-offs.",

      tips:
        "Be prepared to discuss why you chose a particular architecture and the trade-offs involved.",
    },

    rounds: [
      {
        title: "Technical Screening",
        description: "Initial coding and technical screening.",
      },
      {
        title: "Technical Interview",
        description: "DSA and engineering fundamentals.",
      },
      {
        title: "System Design",
        description: "Scalable distributed system design.",
      },
      {
        title: "Behavioral",
        description: "Engineering culture and behavioral discussion.",
      },
    ],
  },

  Adobe: {
    stats: ["130+", "90+", "25+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hash Map",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Binary Tree Level Order Traversal",
        topic: "Trees • BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        title: "Product of Array Except Self",
        topic: "Arrays",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
      },
      {
        title: "Word Ladder",
        topic: "Graphs • BFS",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/word-ladder/",
      },
    ],

    mostAsked: [
      "Explain OOP principles with examples.",
      "What is the difference between stack and heap memory?",
      "Explain database indexing.",
      "What is multithreading?",
      "Explain REST APIs.",
      "How would you optimize a slow application?",
    ],

    preparation: {
      overview:
        "Focus on DSA, object-oriented programming, databases and practical software engineering.",

      topics:
        "Arrays, Strings, Trees, Graphs, OOP, DBMS, OS and Computer Networks.",

      strategy:
        "Build strong fundamentals and practice explaining solutions before coding.",

      tips:
        "Always discuss time complexity, space complexity and possible optimizations.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Coding and aptitude screening.",
      },
      {
        title: "Technical Round",
        description: "DSA and CS fundamentals.",
      },
      {
        title: "Advanced Technical",
        description: "Problem solving and role-specific discussion.",
      },
      {
        title: "HR / Behavioral",
        description: "Communication and behavioral discussion.",
      },
    ],
  },

  Salesforce: {
    stats: ["120+", "80+", "25+"],

    questions: [
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Merge Intervals",
        topic: "Arrays • Sorting",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/merge-intervals/",
      },
      {
        title: "LRU Cache",
        topic: "Design • Hash Map",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs • BFS/DFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        title: "Serialize and Deserialize Binary Tree",
        topic: "Trees • Design",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      },
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is database normalization?",
      "Explain REST API design.",
      "What is multithreading?",
      "Explain authentication and authorization.",
      "How would you design a scalable web application?",
    ],

    preparation: {
      overview:
        "Focus on DSA, backend fundamentals, databases, APIs and scalable application design.",

      topics:
        "DSA, OOP, DBMS, REST APIs, Authentication, Databases and System Design.",

      strategy:
        "Practice coding problems and strengthen practical software development concepts.",

      tips:
        "Explain your implementation decisions and discuss scalability and security where relevant.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Coding and technical screening.",
      },
      {
        title: "Technical Interview",
        description: "DSA and CS fundamentals.",
      },
      {
        title: "Technical / Managerial",
        description: "Technical depth and problem solving.",
      },
      {
        title: "HR",
        description: "Behavioral and communication discussion.",
      },
    ],
  },

  IBM: {
    stats: ["120+", "80+", "25+"],

    questions: [
      {
        title: "Reverse Linked List",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays • DP",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/coin-change/",
      },
      {
        title: "Course Schedule",
        topic: "Graphs",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        title: "Word Ladder",
        topic: "Graphs • BFS",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/word-ladder/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What are operating system processes?",
      "Explain database normalization.",
      "What is cloud computing?",
      "Explain REST APIs.",
      "What is the difference between SQL and NoSQL databases?",
    ],

    preparation: {
      overview:
        "Focus on programming fundamentals, cloud technologies, databases and problem solving.",

      topics:
        "DSA, OOP, DBMS, OS, Networking, Cloud Computing and APIs.",

      strategy:
        "Build strong CS fundamentals and practice coding problems consistently.",

      tips:
        "Be comfortable explaining both theoretical concepts and practical implementations.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Coding and aptitude assessment.",
      },
      {
        title: "Technical Interview",
        description: "Programming and CS fundamentals.",
      },
      {
        title: "Technical Discussion",
        description: "Projects and role-specific technical topics.",
      },
      {
        title: "HR",
        description: "Behavioral and communication round.",
      },
    ],
  },

  Oracle: {
    stats: ["120+", "80+", "25+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hash Map",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Merge Intervals",
        topic: "Arrays • Sorting",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/merge-intervals/",
      },
      {
        title: "Binary Tree Level Order Traversal",
        topic: "Trees • BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs • DFS/BFS",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        title: "LRU Cache",
        topic: "Design",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/lru-cache/",
      },
    ],

    mostAsked: [
      "Explain SQL joins.",
      "What is database normalization?",
      "Explain indexing and query optimization.",
      "What is ACID?",
      "Explain transactions.",
      "What is the difference between SQL and NoSQL?",
    ],

    preparation: {
      overview:
        "Focus heavily on databases, SQL, DSA and backend engineering fundamentals.",

      topics:
        "SQL, DBMS, DSA, OOP, Transactions, Indexing and System Design.",

      strategy:
        "Practice SQL alongside DSA and understand how databases work internally.",

      tips:
        "Be prepared to explain query performance, indexes and database design decisions.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Coding and technical assessment.",
      },
      {
        title: "Technical Interview",
        description: "DSA, SQL and CS fundamentals.",
      },
      {
        title: "Advanced Technical",
        description: "Projects, databases and problem solving.",
      },
      {
        title: "HR",
        description: "Behavioral discussion.",
      },
    ],
  },

  NVIDIA: {
    stats: ["140+", "100+", "30+"],

    questions: [
      {
        title: "Merge k Sorted Lists",
        topic: "Linked List • Heap",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        title: "LRU Cache",
        topic: "Design",
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
        title: "Edit Distance",
        topic: "Dynamic Programming",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/edit-distance/",
      },
    ],

    mostAsked: [
      "Explain multithreading.",
      "What is parallel computing?",
      "Explain memory management.",
      "What is GPU architecture?",
      "Explain process versus thread.",
      "How would you optimize computationally intensive code?",
    ],

    preparation: {
      overview:
        "Focus on algorithms, performance, parallelism, systems and low-level programming concepts.",

      topics:
        "DSA, C/C++, OS, Computer Architecture, Parallel Computing and System Design.",

      strategy:
        "Practice difficult algorithmic problems and understand performance trade-offs.",

      tips:
        "Always consider runtime, memory usage, concurrency and hardware-level implications.",
    },

    rounds: [
      {
        title: "Coding Assessment",
        description: "Algorithmic and programming assessment.",
      },
      {
        title: "Technical Interview",
        description: "DSA and core technical concepts.",
      },
      {
        title: "Advanced Technical",
        description: "Systems, optimization and role-specific topics.",
      },
      {
        title: "Behavioral",
        description: "Communication and teamwork discussion.",
      },
    ],
  },

  Infosys: {
    stats: ["100+", "70+", "20+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
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
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is DBMS?",
      "Explain normalization.",
      "What is an operating system?",
      "Explain computer networks.",
      "What is SDLC?",
    ],

    preparation: {
      overview:
        "Focus on programming fundamentals, aptitude, DSA and core computer science concepts.",

      topics:
        "DSA, OOP, DBMS, OS, Computer Networks and Software Engineering.",

      strategy:
        "Strengthen fundamentals and practice easy-to-medium coding problems.",

      tips:
        "Focus on writing correct code quickly and explaining fundamentals clearly.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Aptitude, logical reasoning and coding.",
      },
      {
        title: "Technical Interview",
        description: "Programming and CS fundamentals.",
      },
      {
        title: "Managerial",
        description: "Problem solving and project discussion.",
      },
      {
        title: "HR",
        description: "Behavioral and communication round.",
      },
    ],
  },

  TCS: {
    stats: ["100+", "70+", "20+"],

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
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Merge Intervals",
        topic: "Arrays • Sorting",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/merge-intervals/",
      },
    ],

    mostAsked: [
      "Explain OOP concepts.",
      "What is normalization?",
      "Explain SQL joins.",
      "What are operating system processes?",
      "What is a computer network?",
      "Explain SDLC.",
    ],

    preparation: {
      overview:
        "Focus on aptitude, programming fundamentals, DSA and core CS subjects.",

      topics:
        "DSA, OOP, DBMS, OS, Networks and Software Engineering.",

      strategy:
        "Practice basic-to-medium coding problems and strengthen CS fundamentals.",

      tips:
        "Prioritize correctness and speed during online assessments.",
    },

    rounds: [
      {
        title: "NQT / Online Assessment",
        description: "Aptitude, coding and technical assessment.",
      },
      {
        title: "Technical Interview",
        description: "Programming and CS fundamentals.",
      },
      {
        title: "Managerial",
        description: "Projects and problem solving.",
      },
      {
        title: "HR",
        description: "Behavioral discussion.",
      },
    ],
  },

  Wipro: {
    stats: ["100+", "70+", "20+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays",
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
        title: "Reverse Linked List",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Binary Tree Level Order Traversal",
        topic: "Trees",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What is DBMS?",
      "Explain SQL joins.",
      "What is normalization?",
      "Explain process and thread.",
      "What is SDLC?",
    ],

    preparation: {
      overview:
        "Build strong fundamentals in programming, DSA and core computer science.",

      topics:
        "DSA, OOP, DBMS, OS, Networks and Software Engineering.",

      strategy:
        "Practice fundamental coding patterns and revise core CS concepts.",

      tips:
        "Be concise and structured when explaining technical concepts.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Aptitude and coding assessment.",
      },
      {
        title: "Technical Interview",
        description: "Programming and CS fundamentals.",
      },
      {
        title: "Managerial",
        description: "Project and problem-solving discussion.",
      },
      {
        title: "HR",
        description: "Behavioral interview.",
      },
    ],
  },

  Accenture: {
    stats: ["100+", "70+", "20+"],

    questions: [
      {
        title: "Two Sum",
        topic: "Arrays • Hash Map",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        title: "Reverse Linked List",
        topic: "Linked List",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        title: "Valid Parentheses",
        topic: "Stack",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        title: "Maximum Subarray",
        topic: "Arrays",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        title: "Number of Islands",
        topic: "Graphs",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/number-of-islands/",
      },
    ],

    mostAsked: [
      "Explain OOP principles.",
      "What is the difference between SQL and NoSQL?",
      "Explain REST APIs.",
      "What is cloud computing?",
      "Explain SDLC.",
      "What are process and threads?",
    ],

    preparation: {
      overview:
        "Focus on aptitude, programming, DSA, cloud fundamentals and core CS concepts.",

      topics:
        "DSA, OOP, DBMS, OS, Networks, Cloud Computing and Software Engineering.",

      strategy:
        "Practice coding fundamentals while improving aptitude and communication skills.",

      tips:
        "Prepare to explain your projects clearly and connect technical concepts to practical use cases.",
    },

    rounds: [
      {
        title: "Online Assessment",
        description: "Aptitude, logical reasoning and coding.",
      },
      {
        title: "Technical Interview",
        description: "Programming, projects and CS fundamentals.",
      },
      {
        title: "Communication / Managerial",
        description: "Communication and problem-solving discussion.",
      },
      {
        title: "HR",
        description: "Behavioral interview.",
      },
    ],
  },
};

// Enrich all companies with aptitude & logical questions and 4-stat metrics
Object.keys(companyData).forEach((comp) => {
  companyData[comp].aptitudeQuestions = companyAptitudeData[comp] || [];
  if (companyData[comp].stats && companyData[comp].stats.length === 3) {
    const aptCount = (companyAptitudeData[comp] || []).length;
    companyData[comp].stats = [
      companyData[comp].stats[0],
      companyData[comp].stats[1],
      `${aptCount > 0 ? aptCount + " Sets" : "20+"}`,
      companyData[comp].stats[2],
    ];
  }
});

export default companyData;