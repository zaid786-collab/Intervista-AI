/**
 * Intervista AI - Master Technical & DSA Question Bank
 * Rich structured DSA problems with test cases, examples, constraints, and starter boilerplates.
 */

export const STRUCTURED_DSA_BY_ROLE = {
  "Frontend Developer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Sliding Window & Streams",
      title: "Maximum Telemetry Clicks in Sliding Window",
      difficulty: "Medium",
      question: "Given an unbounded stream of user click telemetry timestamps in ascending seconds, design an O(n) sliding-window algorithm to calculate the maximum number of user interactions in any continuous 5-second interval.",
      description: "You receive an array of integers `timestamps` sorted in ascending order where each element represents the second at which a user interaction occurred. A 5-second interval starting at timestamp `t` covers all events in the closed range `[t, t + 5]`.\n\nCalculate the maximum number of user interactions occurring within any 5-second window.",
      examples: [
        {
          input: "timestamps = [1, 2, 3, 5, 6, 8, 9, 10]",
          output: "5",
          explanation: "In the window [1, 6], timestamps [1, 2, 3, 5, 6] are within 5 seconds of 1 (6 - 1 = 5). There are 5 events.",
        },
        {
          input: "timestamps = [1, 10, 20, 30]",
          output: "1",
          explanation: "No two timestamps are within 5 seconds of each other. The maximum events in any window is 1.",
        },
        {
          input: "timestamps = [2, 2, 2, 4, 7, 7, 8]",
          output: "6",
          explanation: "In window [2, 7], events [2, 2, 2, 4, 7, 7] all fall within 7 - 2 = 5 seconds. Total = 6 events.",
        },
      ],
      constraints: [
        "1 <= timestamps.length <= 10^5",
        "0 <= timestamps[i] <= 10^9",
        "timestamps is sorted in non-decreasing order",
        "Optimal Time Complexity: O(n)",
        "Auxiliary Space Complexity: O(1)",
      ],
      function_name: "maxClicksInWindow",
      starter_templates: {
        javascript: `function maxClicksInWindow(timestamps) {
  // Implement O(n) two-pointer sliding window
  let left = 0;
  let maxClicks = 0;

  for (let right = 0; right < timestamps.length; right++) {
    while (timestamps[right] - timestamps[left] > 5) {
      left++;
    }
    maxClicks = Math.max(maxClicks, right - left + 1);
  }

  return maxClicks;
}`,
        python: `def max_clicks_in_window(timestamps: list[int]) -> int:
    left = 0
    max_clicks = 0
    for right in range(len(timestamps)):
        while timestamps[right] - timestamps[left] > 5:
            left += 1
        max_clicks = max(max_clicks, right - left + 1)
    return max_clicks`,
        cpp: `int maxClicksInWindow(vector<int>& timestamps) {
    int left = 0, maxClicks = 0;
    for (int right = 0; right < timestamps.size(); right++) {
        while (timestamps[right] - timestamps[left] > 5) left++;
        maxClicks = max(maxClicks, right - left + 1);
    }
    return maxClicks;
}`,
        java: `public int maxClicksInWindow(int[] timestamps) {
    int left = 0, maxClicks = 0;
    for (int right = 0; right < timestamps.length; right++) {
        while (timestamps[right] - timestamps[left] > 5) left++;
        maxClicks = Math.max(maxClicks, right - left + 1);
    }
    return maxClicks;
}`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Telemetry Surge",
          input: [[1, 2, 3, 5, 6, 8, 9, 10]],
          inputStr: "timestamps = [1, 2, 3, 5, 6, 8, 9, 10]",
          expectedOutput: 5,
          expectedOutputStr: "5",
          isHidden: false,
          explanation: "Window [1, 6] has 5 events: 1, 2, 3, 5, 6.",
        },
        {
          id: 2,
          name: "Sparse Timestamps",
          input: [[1, 10, 20, 30]],
          inputStr: "timestamps = [1, 10, 20, 30]",
          expectedOutput: 1,
          expectedOutputStr: "1",
          isHidden: false,
          explanation: "No multiple events within 5 seconds.",
        },
        {
          id: 3,
          name: "Duplicate Timestamps Edge Case",
          input: [[2, 2, 2, 4, 7, 7, 8]],
          inputStr: "timestamps = [2, 2, 2, 4, 7, 7, 8]",
          expectedOutput: 6,
          expectedOutputStr: "6",
          isHidden: false,
          explanation: "Timestamps [2, 2, 2, 4, 7, 7] span from 2 to 7 (delta = 5), count = 6.",
        },
        {
          id: 4,
          name: "Single Event Boundary",
          input: [[42]],
          inputStr: "timestamps = [42]",
          expectedOutput: 1,
          expectedOutputStr: "1",
          isHidden: true,
          explanation: "Single timestamp always yields 1 event.",
        },
      ],
      hint: "Use two pointers (left and right). Advance right, and shrink left whenever timestamps[right] - timestamps[left] > 5.",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Tree Diffing & Keys",
      title: "Virtual DOM Key Reconciler & Move Optimizer",
      difficulty: "Medium",
      question: "Given an initial list of element keys and an updated list of element keys, compute the minimum number of DOM element insertions, deletions, and retainments required.",
      description: "Implement a lightweight Virtual DOM key reconciliation helper `reconcileKeys(oldKeys, newKeys)`. It must return an object with `{ retained: number, inserted: number, deleted: number }`.",
      examples: [
        {
          input: "oldKeys = ['a', 'b', 'c'], newKeys = ['b', 'c', 'd']",
          output: "{\"retained\": 2, \"inserted\": 1, \"deleted\": 1}",
          explanation: "'b' and 'c' are retained, 'a' is deleted, and 'd' is newly inserted.",
        },
        {
          input: "oldKeys = ['x', 'y'], newKeys = ['x', 'y']",
          output: "{\"retained\": 2, \"inserted\": 0, \"deleted\": 0}",
          explanation: "Identical lists require 0 mutations and retain all 2 nodes.",
        },
      ],
      constraints: [
        "0 <= oldKeys.length, newKeys.length <= 10^4",
        "Keys are unique strings",
        "Time Complexity: O(n + m)",
        "Space Complexity: O(n + m)",
      ],
      function_name: "reconcileKeys",
      starter_templates: {
        javascript: `function reconcileKeys(oldKeys, newKeys) {
  const oldSet = new Set(oldKeys);
  const newSet = new Set(newKeys);
  let retained = 0;
  let inserted = 0;
  let deleted = 0;

  for (const k of newKeys) {
    if (oldSet.has(k)) retained++;
    else inserted++;
  }
  for (const k of oldKeys) {
    if (!newSet.has(k)) deleted++;
  }

  return { retained, inserted, deleted };
}`,
        python: `def reconcile_keys(old_keys: list[str], new_keys: list[str]) -> dict:
    old_set = set(old_keys)
    new_set = set(new_keys)
    retained = sum(1 for k in new_keys if k in old_set)
    inserted = sum(1 for k in new_keys if k not in old_set)
    deleted = sum(1 for k in old_keys if k not in new_set)
    return {"retained": retained, "inserted": inserted, "deleted": deleted}`,
        cpp: `// C++ implementation using std::unordered_set`,
        java: `// Java implementation using HashSet`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Key Shift",
          input: [["a", "b", "c"], ["b", "c", "d"]],
          inputStr: "oldKeys = ['a', 'b', 'c'], newKeys = ['b', 'c', 'd']",
          expectedOutput: { retained: 2, inserted: 1, deleted: 1 },
          expectedOutputStr: "{\"retained\": 2, \"inserted\": 1, \"deleted\": 1}",
          isHidden: false,
        },
        {
          id: 2,
          name: "Complete Overwrite",
          input: [["1", "2"], ["3", "4", "5"]],
          inputStr: "oldKeys = ['1', '2'], newKeys = ['3', '4', '5']",
          expectedOutput: { retained: 0, inserted: 3, deleted: 2 },
          expectedOutputStr: "{\"retained\": 0, \"inserted\": 3, \"deleted\": 2}",
          isHidden: false,
        },
        {
          id: 3,
          name: "Empty Target List",
          input: [["header", "footer"], []],
          inputStr: "oldKeys = ['header', 'footer'], newKeys = []",
          expectedOutput: { retained: 0, inserted: 0, deleted: 2 },
          expectedOutputStr: "{\"retained\": 0, \"inserted\": 0, \"deleted\": 2}",
          isHidden: true,
        },
      ],
      hint: "Use Hash Sets for O(1) membership checks. Retained elements are present in both sets; inserted are only in newKeys; deleted are only in oldKeys.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Graph & Cycle Detection",
      title: "Module Dependency Graph Cycle Detector",
      difficulty: "Medium",
      question: "Given a JavaScript module dependency adjacency list, detect whether any circular imports exist using DFS 3-color cycle detection.",
      description: "You are given `numModules` (0 to n-1) and an array of directed `dependencies` where `[u, v]` indicates module `u` imports module `v`.\n\nReturn `true` if there is a circular dependency cycle, or `false` if the dependency graph is a valid Directed Acyclic Graph (DAG).",
      examples: [
        {
          input: "numModules = 3, dependencies = [[0, 1], [1, 2], [2, 0]]",
          output: "true",
          explanation: "0 -> 1 -> 2 -> 0 forms a circular dependency cycle.",
        },
        {
          input: "numModules = 4, dependencies = [[0, 1], [0, 2], [1, 3], [2, 3]]",
          output: "false",
          explanation: "This is a diamond DAG with no back-edges or cycles.",
        },
      ],
      constraints: [
        "1 <= numModules <= 2000",
        "0 <= dependencies.length <= 5000",
        "Time Complexity: O(V + E)",
        "Space Complexity: O(V + E)",
      ],
      function_name: "hasCircularModuleDependency",
      starter_templates: {
        javascript: `function hasCircularModuleDependency(numModules, dependencies) {
  // 0 = unvisited (White), 1 = visiting (Gray), 2 = visited (Black)
  const adj = Array.from({ length: numModules }, () => []);
  for (const [u, v] of dependencies) {
    adj[u].push(v);
  }

  const state = new Array(numModules).fill(0);

  function dfs(u) {
    state[u] = 1; // Mark visiting
    for (const v of adj[u]) {
      if (state[v] === 1) return true; // Cycle detected
      if (state[v] === 0 && dfs(v)) return true;
    }
    state[u] = 2; // Mark finished
    return false;
  }

  for (let i = 0; i < numModules; i++) {
    if (state[i] === 0) {
      if (dfs(i)) return true;
    }
  }

  return false;
}`,
        python: `def has_circular_module_dependency(num_modules: int, dependencies: list[list[int]]) -> bool:
    adj = [[] for _ in range(num_modules)]
    for u, v in dependencies:
        adj[u].append(v)
    state = [0] * num_modules # 0=unvisited, 1=visiting, 2=visited
    def dfs(u):
        state[u] = 1
        for v in adj[u]:
            if state[v] == 1: return True
            if state[v] == 0 and dfs(v): return True
        state[u] = 2
        return False
    return any(dfs(i) for i in range(num_modules) if state[i] == 0)`,
      },
      test_cases: [
        {
          id: 1,
          name: "Direct Triangle Cycle",
          input: [3, [[0, 1], [1, 2], [2, 0]]],
          inputStr: "numModules = 3, dependencies = [[0, 1], [1, 2], [2, 0]]",
          expectedOutput: true,
          expectedOutputStr: "true",
          isHidden: false,
        },
        {
          id: 2,
          name: "Acyclic Diamond Graph",
          input: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]],
          inputStr: "numModules = 4, dependencies = [[0, 1], [0, 2], [1, 3], [2, 3]]",
          expectedOutput: false,
          expectedOutputStr: "false",
          isHidden: false,
        },
        {
          id: 3,
          name: "Self Loop Cycle",
          input: [2, [[0, 0]]],
          inputStr: "numModules = 2, dependencies = [[0, 0]]",
          expectedOutput: true,
          expectedOutputStr: "true",
          isHidden: true,
        },
      ],
      hint: "Use 3-color DFS marking: 0 = unvisited, 1 = in current recursion call stack (Gray), 2 = fully explored (Black). Hitting a Gray node confirms a cycle.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Dynamic Programming & Trie",
      title: "Fast Prefix Search & Auto-complete Matcher",
      difficulty: "Medium",
      question: "Implement an autocomplete prefix search function that returns all dictionary words beginning with a given prefix, sorted alphabetically.",
      description: "Given an array of strings `dictionary` and a query string `prefix`, return all words from `dictionary` that start with `prefix`. The resulting array should be sorted lexicographically.",
      examples: [
        {
          input: "dictionary = ['react', 'redux', 'relay', 'remix', 'vue'], prefix = 're'",
          output: "['react', 'redux', 'relay', 'remix']",
          explanation: "All four words start with prefix 're'.",
        },
        {
          input: "dictionary = ['apple', 'app', 'application'], prefix = 'app'",
          output: "['app', 'apple', 'application']",
          explanation: "All three words match prefix 'app'.",
        },
      ],
      constraints: [
        "1 <= dictionary.length <= 10^4",
        "1 <= prefix.length <= 100",
        "All strings contain lowercase English letters",
      ],
      function_name: "autocompletePrefix",
      starter_templates: {
        javascript: `function autocompletePrefix(dictionary, prefix) {
  // Return matching words sorted lexicographically
  const matches = dictionary.filter((word) => word.startsWith(prefix));
  return matches.sort();
}`,
        python: `def autocomplete_prefix(dictionary: list[str], prefix: str) -> list[str]:
    return sorted([w for w in dictionary if w.startswith(prefix)])`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Prefix Match",
          input: [["react", "redux", "relay", "remix", "vue"], "re"],
          inputStr: "dictionary = ['react', 'redux', 'relay', 'remix', 'vue'], prefix = 're'",
          expectedOutput: ["react", "redux", "relay", "remix"],
          expectedOutputStr: "['react', 'redux', 'relay', 'remix']",
          isHidden: false,
        },
        {
          id: 2,
          name: "No Matches",
          input: [["docker", "kubernetes", "helm"], "ang"],
          inputStr: "dictionary = ['docker', 'kubernetes', 'helm'], prefix = 'ang'",
          expectedOutput: [],
          expectedOutputStr: "[]",
          isHidden: false,
        },
      ],
      hint: "Filter strings using startsWith() or a Trie traversal, then apply lexicographical sort.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Virtual List Engine",
      title: "60fps Virtual List Slicer & Overscan Calculator",
      difficulty: "Hard",
      question: "Calculate the exact render range (startIndex, endIndex, topOffsetPx) for a virtualized list container with overscan buffering.",
      description: "Given `totalItems`, fixed `itemHeightPx`, current `scrollTopPx`, container `viewportHeightPx`, and `overscanCount` (extra items above and below viewport to prevent white flickers), compute the window parameters:\n\nReturn `{ startIndex: number, endIndex: number, topOffsetPx: number, totalHeightPx: number }`.",
      examples: [
        {
          input: "totalItems = 1000, itemHeightPx = 50, scrollTopPx = 200, viewportHeightPx = 400, overscanCount = 2",
          output: "{\"startIndex\": 2, \"endIndex\": 13, \"topOffsetPx\": 100, \"totalHeightPx\": 50000}",
          explanation: "Visible items: floor(200/50) = index 4 to index 11. With overscan=2: startIndex = max(0, 4-2) = 2, endIndex = min(999, 11+2) = 13. topOffset = 2 * 50 = 100px.",
        },
      ],
      constraints: [
        "1 <= totalItems <= 10^7",
        "itemHeightPx > 0, viewportHeightPx > 0, scrollTopPx >= 0",
        "overscanCount >= 0",
      ],
      function_name: "calculateVirtualWindow",
      starter_templates: {
        javascript: `function calculateVirtualWindow(totalItems, itemHeightPx, scrollTopPx, viewportHeightPx, overscanCount = 2) {
  const visibleStart = Math.floor(scrollTopPx / itemHeightPx);
  const visibleCount = Math.ceil(viewportHeightPx / itemHeightPx);
  const visibleEnd = visibleStart + visibleCount;

  const startIndex = Math.max(0, visibleStart - overscanCount);
  const endIndex = Math.min(totalItems - 1, visibleEnd + overscanCount);
  const topOffsetPx = startIndex * itemHeightPx;
  const totalHeightPx = totalItems * itemHeightPx;

  return { startIndex, endIndex, topOffsetPx, totalHeightPx };
}`,
        python: `def calculate_virtual_window(total_items: int, item_height_px: int, scroll_top_px: int, viewport_height_px: int, overscan_count: int = 2) -> dict:
    visible_start = scroll_top_px // item_height_px
    visible_count = (viewport_height_px + item_height_px - 1) // item_height_px
    visible_end = visible_start + visible_count
    start_idx = max(0, visible_start - overscan_count)
    end_idx = min(total_items - 1, visible_end + overscan_count)
    return {
        "startIndex": start_idx,
        "endIndex": end_idx,
        "topOffsetPx": start_idx * item_height_px,
        "totalHeightPx": total_items * item_height_px
    }`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Scroll Position",
          input: [1000, 50, 200, 400, 2],
          inputStr: "totalItems=1000, itemHeight=50, scrollTop=200, viewportHeight=400, overscan=2",
          expectedOutput: { startIndex: 2, endIndex: 14, topOffsetPx: 100, totalHeightPx: 50000 },
          expectedOutputStr: "{\"startIndex\": 2, \"endIndex\": 14, \"topOffsetPx\": 100, \"totalHeightPx\": 50000}",
          isHidden: false,
        },
        {
          id: 2,
          name: "Top of List Scroll = 0",
          input: [500, 40, 0, 200, 3],
          inputStr: "totalItems=500, itemHeight=40, scrollTop=0, viewportHeight=200, overscan=3",
          expectedOutput: { startIndex: 0, endIndex: 8, topOffsetPx: 0, totalHeightPx: 20000 },
          expectedOutputStr: "{\"startIndex\": 0, \"endIndex\": 8, \"topOffsetPx\": 0, \"totalHeightPx\": 20000}",
          isHidden: false,
        },
      ],
      hint: "startIndex = max(0, floor(scrollTop / itemHeight) - overscan). topOffset = startIndex * itemHeight.",
    },
  ],

  "Backend Developer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - LRU Cache Design",
      title: "Least Recently Used (LRU) Cache Simulation",
      difficulty: "Medium",
      question: "Implement a Least Recently Used (LRU) cache supporting get(key) and put(key, value) operations with O(1) amortized time.",
      description: "Execute a sequence of cache operations for an LRU cache with fixed `capacity`. Operations are given as `[ [\"put\", key, val], [\"get\", key], ... ]`.\n\nReturn the list of outputs for all `get` operations (`-1` if key is not found).",
      examples: [
        {
          input: "capacity = 2, operations = [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]]",
          output: "[1, -1, -1, 3, 4]",
          explanation: "put(1,1), put(2,2), get(1)->1. put(3,3) evicts key 2. get(2)->-1. put(4,4) evicts key 1. get(1)->-1, get(3)->3, get(4)->4.",
        },
      ],
      constraints: [
        "1 <= capacity <= 3000",
        "0 <= key, val <= 10^4",
        "At most 10^5 calls to get and put",
      ],
      function_name: "executeLRUOperations",
      starter_templates: {
        javascript: `function executeLRUOperations(capacity, operations) {
  const cache = new Map();
  const results = [];

  for (const op of operations) {
    const type = op[0];
    const key = op[1];

    if (type === "get") {
      if (!cache.has(key)) {
        results.push(-1);
      } else {
        const val = cache.get(key);
        // Refresh key position
        cache.delete(key);
        cache.set(key, val);
        results.push(val);
      }
    } else if (type === "put") {
      const val = op[2];
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= capacity) {
        // Evict least recently used (first key in Map)
        const lruKey = cache.keys().next().value;
        cache.delete(lruKey);
      }
      cache.set(key, val);
    }
  }

  return results;
}`,
        python: `from collections import OrderedDict

def execute_lru_operations(capacity: int, operations: list) -> list:
    cache = OrderedDict()
    results = []
    for op in operations:
        t, k = op[0], op[1]
        if t == "get":
            if k not in cache:
                results.append(-1)
            else:
                cache.move_to_end(k)
                results.append(cache[k])
        elif t == "put":
            v = op[2]
            if k in cache:
                cache.move_to_end(k)
            cache[k] = v
            if len(cache) > capacity:
                cache.popitem(last=False)
    return results`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard LRU Eviction Flow",
          input: [2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]]],
          inputStr: "capacity = 2, ops = [put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)]",
          expectedOutput: [1, -1, -1, 3, 4],
          expectedOutputStr: "[1, -1, -1, 3, 4]",
          isHidden: false,
        },
        {
          id: 2,
          name: "Single Capacity Edge Case",
          input: [1, [["put", 10, 100], ["get", 10], ["put", 20, 200], ["get", 10], ["get", 20]]],
          inputStr: "capacity = 1, ops = [put(10,100), get(10), put(20,200), get(10), get(20)]",
          expectedOutput: [100, -1, 200],
          expectedOutputStr: "[100, -1, 200]",
          isHidden: false,
        },
      ],
      hint: "Use Map insertion ordering in JavaScript or DoublyLinkedList + Hash Map for O(1) eviction and relocation.",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Priority Queue & Routing",
      title: "Microservice Network Shortest Latency Path",
      difficulty: "Medium",
      question: "Given a network of microservice nodes and edge latencies, compute the shortest latency from service 0 to all other service nodes using Dijkstra's algorithm.",
      description: "You are given `numNodes` (0 to n-1) and directed weighted edges `[[u, v, latency_ms], ...]`. Return an array of shortest distances from node 0 to every node `0 <= i < numNodes` (`-1` if unreachable).",
      examples: [
        {
          input: "numNodes = 4, edges = [[0, 1, 5], [0, 2, 10], [1, 2, 2], [2, 3, 4]]",
          output: "[0, 5, 7, 11]",
          explanation: "0->0 is 0. 0->1 is 5. 0->1->2 is 5+2=7 (better than direct 10). 0->1->2->3 is 7+4=11.",
        },
      ],
      constraints: [
        "1 <= numNodes <= 1000",
        "0 <= edges.length <= 5000",
        "1 <= latency <= 10^4",
      ],
      function_name: "dijkstraShortestPath",
      starter_templates: {
        javascript: `function dijkstraShortestPath(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
  }

  const dist = new Array(numNodes).fill(Infinity);
  dist[0] = 0;
  const visited = new Set();

  for (let i = 0; i < numNodes; i++) {
    let u = -1;
    for (let j = 0; j < numNodes; j++) {
      if (!visited.has(j) && (u === -1 || dist[j] < dist[u])) {
        u = j;
      }
    }

    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);

    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  return dist.map((d) => (d === Infinity ? -1 : d));
}`,
        python: `import heapq

def dijkstra_shortest_path(num_nodes: int, edges: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(num_nodes)]
    for u, v, w in edges:
        adj[u].append((v, w))
    dist = [float('inf')] * num_nodes
    dist[0] = 0
    pq = [(0, 0)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return [-1 if d == float('inf') else d for d in dist]`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard 4-Node Mesh",
          input: [4, [[0, 1, 5], [0, 2, 10], [1, 2, 2], [2, 3, 4]]],
          inputStr: "numNodes = 4, edges = [[0, 1, 5], [0, 2, 10], [1, 2, 2], [2, 3, 4]]",
          expectedOutput: [0, 5, 7, 11],
          expectedOutputStr: "[0, 5, 7, 11]",
          isHidden: false,
        },
      ],
      hint: "Initialize dist[0] = 0. Repeatedly pick unvisited node with minimal distance and relax all outgoing edges.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Monotonic Queue Rate Limiting",
      title: "Sliding-Window API Rate Limiter",
      difficulty: "Medium",
      question: "Determine whether incoming API requests are allowed or rate-limited under a sliding window limit.",
      description: "Given an array of request timestamps in seconds, a `maxLimit` (maximum requests allowed per window), and a `windowSec` duration, return an array of booleans indicating for each request whether it was ALLOWED (`true`) or BLOCKED (`false`).",
      examples: [
        {
          input: "timestamps = [1, 2, 2, 3, 6, 7], maxLimit = 3, windowSec = 4",
          output: "[true, true, true, false, true, true]",
          explanation: "At t=1: 1 req (allowed). t=2: 2 reqs (allowed, count=3). t=3: 4th req in window [0,3] (blocked). t=6: window [2,6] drops t=1, count=2 (allowed).",
        },
      ],
      constraints: [
        "1 <= timestamps.length <= 10^5",
        "1 <= maxLimit <= 1000",
        "1 <= windowSec <= 3600",
      ],
      function_name: "rateLimiterSlidingWindow",
      starter_templates: {
        javascript: `function rateLimiterSlidingWindow(timestamps, maxLimit, windowSec) {
  const queue = [];
  const results = [];

  for (const t of timestamps) {
    while (queue.length > 0 && queue[0] <= t - windowSec) {
      queue.shift();
    }
    if (queue.length < maxLimit) {
      queue.push(t);
      results.push(true);
    } else {
      results.push(false);
    }
  }

  return results;
}`,
        python: `from collections import deque

def rate_limiter_sliding_window(timestamps: list[int], max_limit: int, window_sec: int) -> list[bool]:
    q = deque()
    res = []
    for t in timestamps:
        while q and q[0] <= t - window_sec:
            q.popleft()
        if len(q) < max_limit:
            q.append(t)
            res.append(True)
        else:
            res.append(False)
    return res`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Burst Rate Limit",
          input: [[1, 2, 2, 3, 6, 7], 3, 4],
          inputStr: "timestamps = [1, 2, 2, 3, 6, 7], maxLimit = 3, windowSec = 4",
          expectedOutput: [true, true, true, false, true, true],
          expectedOutputStr: "[true, true, true, false, true, true]",
          isHidden: false,
        },
      ],
      hint: "Maintain a FIFO queue of accepted timestamps. For each incoming timestamp, evict timestamps older than t - windowSec.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Concurrency & MVCC",
      title: "Deadlock Cycle Detector in Database Locks",
      difficulty: "Hard",
      question: "Given a database wait-for graph of transactions waiting on locks held by other transactions, detect if a distributed deadlock cycle exists.",
      description: "You are given `numTx` transactions (0 to n-1) and a list of directed edges `[[txA, txB], ...]` meaning `txA` is blocked waiting for a lock held by `txB`. Return `true` if a deadlock cycle exists, `false` otherwise.",
      examples: [
        {
          input: "numTx = 3, edges = [[0, 1], [1, 2], [2, 0]]",
          output: "true",
          explanation: "tx0 waits for tx1, tx1 waits for tx2, tx2 waits for tx0 -> Circular deadlock.",
        },
      ],
      constraints: ["1 <= numTx <= 500", "0 <= edges.length <= 2000"],
      function_name: "detectDeadlockCycle",
      starter_templates: {
        javascript: `function detectDeadlockCycle(numTx, edges) {
  const adj = Array.from({ length: numTx }, () => []);
  for (const [u, v] of edges) adj[u].push(v);

  const state = new Array(numTx).fill(0); // 0=unvisited, 1=visiting, 2=visited

  function hasCycle(u) {
    state[u] = 1;
    for (const v of adj[u]) {
      if (state[v] === 1) return true;
      if (state[v] === 0 && hasCycle(v)) return true;
    }
    state[u] = 2;
    return false;
  }

  for (let i = 0; i < numTx; i++) {
    if (state[i] === 0 && hasCycle(i)) return true;
  }
  return false;
}`,
        python: `def detect_deadlock_cycle(num_tx: int, edges: list[list[int]]) -> bool:
    adj = [[] for _ in range(num_tx)]
    for u, v in edges: adj[u].append(v)
    state = [0] * num_tx
    def dfs(u):
        state[u] = 1
        for v in adj[u]:
            if state[v] == 1: return True
            if state[v] == 0 and dfs(v): return True
        state[u] = 2
        return False
    return any(dfs(i) for i in range(num_tx) if state[i] == 0)`,
      },
      test_cases: [
        {
          id: 1,
          name: "Direct Deadlock Pair",
          input: [2, [[0, 1], [1, 0]]],
          inputStr: "numTx = 2, edges = [[0, 1], [1, 0]]",
          expectedOutput: true,
          expectedOutputStr: "true",
          isHidden: false,
        },
        {
          id: 2,
          name: "Linear Pipeline (No Deadlock)",
          input: [3, [[0, 1], [1, 2]]],
          inputStr: "numTx = 3, edges = [[0, 1], [1, 2]]",
          expectedOutput: false,
          expectedOutputStr: "false",
          isHidden: false,
        },
      ],
      hint: "A deadlock in a wait-for graph is equivalent to a directed cycle. Use DFS 3-coloring.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Distributed Idempotency",
      title: "Idempotent Transaction Event Deduplicator",
      difficulty: "Medium",
      question: "Process an incoming stream of transaction event records and return only new, non-duplicate transactions based on idempotency keys and state transitions.",
      description: "Given a list of transaction events `[{ idempotencyKey: string, amount: number, timestamp: number }]`, filter and return only the events that have a unique `idempotencyKey` keeping the first occurrence.",
      examples: [
        {
          input: "events = [{ idempotencyKey: 'tx-1', amount: 100 }, { idempotencyKey: 'tx-1', amount: 100 }, { idempotencyKey: 'tx-2', amount: 50 }]",
          output: "[{ idempotencyKey: 'tx-1', amount: 100 }, { idempotencyKey: 'tx-2', amount: 50 }]",
          explanation: "Duplicate 'tx-1' event was safely deduplicated.",
        },
      ],
      constraints: ["1 <= events.length <= 10^5"],
      function_name: "deduplicateTransactions",
      starter_templates: {
        javascript: `function deduplicateTransactions(events) {
  const seen = new Set();
  const uniqueEvents = [];
  for (const ev of events) {
    if (!seen.has(ev.idempotencyKey)) {
      seen.add(ev.idempotencyKey);
      uniqueEvents.push(ev);
    }
  }
  return uniqueEvents;
}`,
        python: `def deduplicate_transactions(events: list[dict]) -> list[dict]:
    seen = set()
    res = []
    for ev in events:
        k = ev.get("idempotencyKey")
        if k not in seen:
            seen.add(k)
            res.append(ev)
    return res`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Duplication Filter",
          input: [[{ idempotencyKey: "k1", amount: 10 }, { idempotencyKey: "k1", amount: 10 }, { idempotencyKey: "k2", amount: 20 }]],
          inputStr: "events = [{ idempotencyKey: 'k1', amount: 10 }, { idempotencyKey: 'k1', amount: 10 }, { idempotencyKey: 'k2', amount: 20 }]",
          expectedOutput: [{ idempotencyKey: "k1", amount: 10 }, { idempotencyKey: "k2", amount: 20 }],
          expectedOutputStr: "[{ idempotencyKey: 'k1', amount: 10 }, { idempotencyKey: 'k2', amount: 20 }]",
          isHidden: false,
        },
      ],
      hint: "Use a Hash Set to record seen idempotency keys and preserve order for first-seen elements.",
    },
  ],

  "Full Stack Engineer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - CRDT Conflict Resolution",
      title: "LWW-Element-Set CRDT Resolver",
      difficulty: "Medium",
      question: "Implement a Last-Write-Wins Element-Set (LWW-Element-Set) CRDT resolver for collaborative document state syncing.",
      description: "Given `addSet` and `removeSet` arrays of `{ element: string, timestamp: number }`, return the active elements currently in the set. An element is present if its latest add timestamp is strictly greater than its latest remove timestamp (or if it was never removed). The result should be sorted alphabetically.",
      examples: [
        {
          input: "addSet = [{ element: 'A', timestamp: 100 }, { element: 'B', timestamp: 200 }], removeSet = [{ element: 'A', timestamp: 150 }]",
          output: "['B']",
          explanation: "'A' was removed at t=150 (after add t=100), so only 'B' remains active.",
        },
      ],
      constraints: ["0 <= addSet.length, removeSet.length <= 10^4"],
      function_name: "resolveLWWCRDT",
      starter_templates: {
        javascript: `function resolveLWWCRDT(addSet, removeSet) {
  const addMap = new Map();
  const remMap = new Map();

  for (const item of addSet) {
    const cur = addMap.get(item.element) || 0;
    addMap.set(item.element, Math.max(cur, item.timestamp));
  }

  for (const item of removeSet) {
    const cur = remMap.get(item.element) || 0;
    remMap.set(item.element, Math.max(cur, item.timestamp));
  }

  const active = [];
  for (const [el, addTime] of addMap.entries()) {
    const remTime = remMap.get(el) || 0;
    if (addTime > remTime) {
      active.push(el);
    }
  }

  return active.sort();
}`,
        python: `def resolve_lww_crdt(add_set: list[dict], remove_set: list[dict]) -> list[str]:
    add_map = {}
    rem_map = {}
    for x in add_set:
        add_map[x['element']] = max(add_map.get(x['element'], 0), x['timestamp'])
    for x in remove_set:
        rem_map[x['element']] = max(rem_map.get(x['element'], 0), x['timestamp'])
    active = [el for el, t in add_map.items() if t > rem_map.get(el, 0)]
    return sorted(active)`,
      },
      test_cases: [
        {
          id: 1,
          name: "Add then Remove",
          input: [[{ element: "A", timestamp: 100 }, { element: "B", timestamp: 200 }], [{ element: "A", timestamp: 150 }]],
          inputStr: "addSet=[A@100, B@200], removeSet=[A@150]",
          expectedOutput: ["B"],
          expectedOutputStr: "['B']",
          isHidden: false,
        },
        {
          id: 2,
          name: "Re-added After Remove",
          input: [[{ element: "X", timestamp: 100 }, { element: "X", timestamp: 300 }], [{ element: "X", timestamp: 200 }]],
          inputStr: "addSet=[X@100, X@300], removeSet=[X@200]",
          expectedOutput: ["X"],
          expectedOutputStr: "['X']",
          isHidden: false,
        },
      ],
      hint: "Track max timestamp for each element in Add-Set and Remove-Set. Include in output if max(Add) > max(Remove).",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Tree Indexing & Search",
      title: "In-Memory Inverted Index Search",
      difficulty: "Medium",
      question: "Build an in-memory Inverted Index full-text search engine supporting multi-keyword AND queries across product descriptions.",
      description: "Given `documents = [{ id: number, text: string }]` and a `query` string, return the list of document IDs that contain ALL words in the query (case-insensitive, matched as exact words).",
      examples: [
        {
          input: "documents = [{ id: 1, text: 'Ultra Fast SSD Drive' }, { id: 2, text: 'Fast USB Cable' }, { id: 3, text: 'SSD Internal Storage' }], query = 'fast ssd'",
          output: "[1]",
          explanation: "Only document 1 contains both words 'fast' and 'ssd'.",
        },
      ],
      constraints: ["1 <= documents.length <= 10^4", "1 <= query.length <= 100"],
      function_name: "invertedIndexSearch",
      starter_templates: {
        javascript: `function invertedIndexSearch(documents, query) {
  const index = new Map();

  for (const doc of documents) {
    const tokens = new Set(doc.text.toLowerCase().split(/\\W+/).filter(Boolean));
    for (const tok of tokens) {
      if (!index.has(tok)) index.set(tok, new Set());
      index.get(tok).add(doc.id);
    }
  }

  const qTokens = query.toLowerCase().split(/\\W+/).filter(Boolean);
  if (qTokens.length === 0) return [];

  let resultIds = null;

  for (const tok of qTokens) {
    const matchingDocs = index.get(tok) || new Set();
    if (resultIds === null) {
      resultIds = new Set(matchingDocs);
    } else {
      for (const id of resultIds) {
        if (!matchingDocs.has(id)) resultIds.delete(id);
      }
    }
  }

  return Array.from(resultIds || []).sort((a, b) => a - b);
}`,
        python: `def inverted_index_search(documents: list[dict], query: str) -> list[int]:
    import re
    index = {}
    for doc in documents:
        tokens = set(re.findall(r'\\w+', doc['text'].lower()))
        for t in tokens:
            index.setdefault(t, set()).add(doc['id'])
    q_tokens = re.findall(r'\\w+', query.lower())
    if not q_tokens: return []
    res = None
    for t in q_tokens:
        docs = index.get(t, set())
        res = set(docs) if res is None else res.intersection(docs)
    return sorted(list(res)) if res else []`,
      },
      test_cases: [
        {
          id: 1,
          name: "Multi-word Intersection",
          input: [[{ id: 1, text: "Ultra Fast SSD Drive" }, { id: 2, text: "Fast USB Cable" }, { id: 3, text: "SSD Internal Storage" }], "fast ssd"],
          inputStr: "documents=[doc1, doc2, doc3], query='fast ssd'",
          expectedOutput: [1],
          expectedOutputStr: "[1]",
          isHidden: false,
        },
      ],
      hint: "Tokenize words into sets, build inverted map `Map<token, Set<docId>>`, and perform intersection of posting sets.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Queue & Backpressure",
      title: "Circular Ring Buffer Producer-Consumer Queue",
      difficulty: "Medium",
      question: "Simulate a circular bounded FIFO buffer queue with drop-on-overflow policy.",
      description: "Given `capacity` and operations `[['push', val], ['pop'], ... ]`, return an array of all popped values (`-1` if popping an empty buffer). If pushing to a full buffer, the push is rejected and returns `false`.",
      examples: [
        {
          input: "capacity = 2, ops = [['push', 1], ['push', 2], ['push', 3], ['pop'], ['pop'], ['pop']]",
          output: "[1, 2, -1]",
          explanation: "push(1)->ok, push(2)->ok, push(3)->rejected (capacity 2). pop()->1, pop()->2, pop()->-1 (empty).",
        },
      ],
      constraints: ["1 <= capacity <= 5000"],
      function_name: "ringBufferQueue",
      starter_templates: {
        javascript: `function ringBufferQueue(capacity, ops) {
  const buffer = [];
  const popped = [];

  for (const op of ops) {
    if (op[0] === "push") {
      if (buffer.length < capacity) {
        buffer.push(op[1]);
      }
    } else if (op[0] === "pop") {
      if (buffer.length > 0) {
        popped.push(buffer.shift());
      } else {
        popped.push(-1);
      }
    }
  }

  return popped;
}`,
        python: `def ring_buffer_queue(capacity: int, ops: list) -> list:
    buf = []
    popped = []
    for op in ops:
        if op[0] == "push":
            if len(buf) < capacity:
                buf.append(op[1])
        elif op[0] == "pop":
            popped.append(buf.pop(0) if buf else -1)
    return popped`,
      },
      test_cases: [
        {
          id: 1,
          name: "Bounded Buffer Capacity Test",
          input: [2, [["push", 1], ["push", 2], ["push", 3], ["pop"], ["pop"], ["pop"]]],
          inputStr: "capacity = 2, ops = [push(1), push(2), push(3), pop(), pop(), pop()]",
          expectedOutput: [1, 2, -1],
          expectedOutputStr: "[1, 2, -1]",
          isHidden: false,
        },
      ],
      hint: "Track current size against capacity. Reject pushes when full; return -1 when popping empty queue.",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - OAuth2 PKCE Security",
      title: "PKCE Code Verifier & Challenge Matcher",
      difficulty: "Medium",
      question: "Simulate and validate the client-side PKCE code verifier format and challenge verification.",
      description: "Given a `codeVerifier` string, verify whether it conforms to RFC 7636 (length between 43 and 128 characters, containing only `[A-Z]`, `[a-z]`, `[0-9]`, `-`, `.`, `_`, `~`). Return `true` if valid, `false` otherwise.",
      examples: [
        {
          input: "codeVerifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'",
          output: "true",
          explanation: "Length is 43 characters and all characters are valid unreserved URL characters.",
        },
      ],
      constraints: ["1 <= codeVerifier.length <= 300"],
      function_name: "isValidPKCEVerifier",
      starter_templates: {
        javascript: `function isValidPKCEVerifier(codeVerifier) {
  if (typeof codeVerifier !== "string") return false;
  if (codeVerifier.length < 43 || codeVerifier.length > 128) return false;
  const validPattern = /^[A-Za-z0-9\\-\\._~]+$/;
  return validPattern.test(codeVerifier);
}`,
        python: `import re

def is_valid_pkce_verifier(code_verifier: str) -> bool:
    if not isinstance(code_verifier, str) or not (43 <= len(code_verifier) <= 128):
        return False
    return bool(re.match(r'^[A-Za-z0-9\\-\\._~]+$', code_verifier))`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard 43-char Verifier",
          input: ["dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"],
          inputStr: "codeVerifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'",
          expectedOutput: true,
          expectedOutputStr: "true",
          isHidden: false,
        },
        {
          id: 2,
          name: "Too Short (< 43 chars)",
          input: ["short_verifier"],
          inputStr: "codeVerifier = 'short_verifier'",
          expectedOutput: false,
          expectedOutputStr: "false",
          isHidden: false,
        },
      ],
      hint: "RFC 7636 requires length 43-128 and charset [A-Za-z0-9-._~].",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Real-time WebSocket Gateway",
      title: "WebSocket Broadcast Fan-out Metric Aggregator",
      difficulty: "Medium",
      question: "Aggregate telemetry message counts across WebSocket gateway channels in tumbling time windows.",
      description: "Given a list of message events `[{ channel: string, timestamp: number }]`, calculate the message count per channel. Return an object mapping `channel` names to total count.",
      examples: [
        {
          input: "events = [{ channel: 'chat', timestamp: 1 }, { channel: 'chat', timestamp: 2 }, { channel: 'alerts', timestamp: 3 }]",
          output: "{\"alerts\": 1, \"chat\": 2}",
          explanation: "Chat channel received 2 messages, alerts received 1.",
        },
      ],
      constraints: ["1 <= events.length <= 10^5"],
      function_name: "aggregateChannelMetrics",
      starter_templates: {
        javascript: `function aggregateChannelMetrics(events) {
  const counts = {};
  for (const ev of events) {
    counts[ev.channel] = (counts[ev.channel] || 0) + 1;
  }
  return counts;
}`,
        python: `def aggregate_channel_metrics(events: list[dict]) -> dict:
    counts = {}
    for ev in events:
        c = ev.get('channel', 'default')
        counts[c] = counts.get(c, 0) + 1
    return counts`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Channels Distribution",
          input: [[{ channel: "chat", timestamp: 1 }, { channel: "chat", timestamp: 2 }, { channel: "alerts", timestamp: 3 }]],
          inputStr: "events = [chat@1, chat@2, alerts@3]",
          expectedOutput: { alerts: 1, chat: 2 },
          expectedOutputStr: "{\"alerts\": 1, \"chat\": 2}",
          isHidden: false,
        },
      ],
      hint: "Iterate through events and increment count for each channel in a hash map.",
    },
  ],

  "AI / ML Engineer": [
    {
      id: 6,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - HNSW Vector Graph Indexing",
      title: "Cosine Similarity Matrix & Top-K Vector Search",
      difficulty: "Medium",
      question: "Calculate the Cosine Similarity between a query embedding vector and a database of candidate vectors, returning the top-K highest similarity vector IDs.",
      description: "Given a query vector `queryVec`, candidate vectors `candidates = [{ id: number, vec: number[] }]`, and integer `k`, return the `k` IDs with highest cosine similarity, sorted descending by score.\n\nCosine Similarity = `(A · B) / (||A|| * ||B||)`.",
      examples: [
        {
          input: "queryVec = [1, 0], candidates = [{ id: 1, vec: [1, 0] }, { id: 2, vec: [0, 1] }, { id: 3, vec: [0.7, 0.7] }], k = 2",
          output: "[1, 3]",
          explanation: "Similarity: id 1 = 1.0, id 3 ≈ 0.707, id 2 = 0.0. Top 2 IDs are [1, 3].",
        },
      ],
      constraints: [
        "1 <= queryVec.length <= 1536",
        "1 <= candidates.length <= 5000",
        "1 <= k <= candidates.length",
      ],
      function_name: "topKCosineSimilarity",
      starter_templates: {
        javascript: `function topKCosineSimilarity(queryVec, candidates, k) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  function norm(a) {
    return Math.sqrt(dot(a, a));
  }

  const qNorm = norm(queryVec);

  const scored = candidates.map((c) => {
    const cNorm = norm(c.vec);
    const sim = (qNorm === 0 || cNorm === 0) ? 0 : dot(queryVec, c.vec) / (qNorm * cNorm);
    return { id: c.id, sim };
  });

  scored.sort((a, b) => b.sim - a.sim);
  return scored.slice(0, k).map((x) => x.id);
}`,
        python: `import math

def top_k_cosine_similarity(query_vec: list[float], candidates: list[dict], k: int) -> list[int]:
    def dot(a, b): return sum(x * y for x, y in zip(a, b))
    def norm(a): return math.sqrt(dot(a, a))
    q_norm = norm(query_vec)
    scored = []
    for c in candidates:
        c_norm = norm(c['vec'])
        sim = dot(query_vec, c['vec']) / (q_norm * c_norm) if q_norm and c_norm else 0.0
        scored.append((c['id'], sim))
    scored.sort(key=lambda x: x[1], reverse=True)
    return [x[0] for x in scored[:k]]`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Orthogonal & Collinear Vectors",
          input: [[1, 0], [{ id: 1, vec: [1, 0] }, { id: 2, vec: [0, 1] }, { id: 3, vec: [0.7071, 0.7071] }], 2],
          inputStr: "query=[1,0], candidates=[id1:[1,0], id2:[0,1], id3:[0.7071,0.7071]], k=2",
          expectedOutput: [1, 3],
          expectedOutputStr: "[1, 3]",
          isHidden: false,
        },
      ],
      hint: "Compute dot product and norms, calculate cosine similarity, sort descending, and return top-k IDs.",
    },
    {
      id: 7,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - KV Cache & PagedAttention",
      title: "vLLM PagedAttention Physical GPU Block Allocator",
      difficulty: "Hard",
      question: "Simulate a PagedAttention memory manager that allocates physical GPU blocks to dynamic sequence generation requests.",
      description: "Given `totalPhysicalBlocks` and a stream of sequence requests `[{ seqId: number, tokenCount: number }]` with `blockSize` tokens per physical block, calculate the number of blocks allocated to each sequence. If free blocks are exhausted, return `-1` for that sequence.",
      examples: [
        {
          input: "totalPhysicalBlocks = 10, blockSize = 16, requests = [{ seqId: 1, tokenCount: 35 }, { seqId: 2, tokenCount: 20 }]",
          output: "[{\"seqId\": 1, \"blocksAllocated\": 3}, {\"seqId\": 2, \"blocksAllocated\": 2}]",
          explanation: "Seq 1: ceil(35/16) = 3 blocks (7 left). Seq 2: ceil(20/16) = 2 blocks (5 left).",
        },
      ],
      constraints: ["1 <= totalPhysicalBlocks <= 10^5", "1 <= blockSize <= 128"],
      function_name: "allocatePagedBlocks",
      starter_templates: {
        javascript: `function allocatePagedBlocks(totalPhysicalBlocks, blockSize, requests) {
  let freeBlocks = totalPhysicalBlocks;
  const allocations = [];

  for (const req of requests) {
    const blocksNeeded = Math.ceil(req.tokenCount / blockSize);
    if (freeBlocks >= blocksNeeded) {
      freeBlocks -= blocksNeeded;
      allocations.push({ seqId: req.seqId, blocksAllocated: blocksNeeded });
    } else {
      allocations.push({ seqId: req.seqId, blocksAllocated: -1 });
    }
  }

  return allocations;
}`,
        python: `import math

def allocate_paged_blocks(total_physical_blocks: int, block_size: int, requests: list[dict]) -> list[dict]:
    free_blocks = total_physical_blocks
    res = []
    for req in requests:
        needed = math.ceil(req['tokenCount'] / block_size)
        if free_blocks >= needed:
            free_blocks -= needed
            res.append({'seqId': req['seqId'], 'blocksAllocated': needed})
        else:
            res.append({'seqId': req['seqId'], 'blocksAllocated': -1})
    return res`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Dynamic Allocation",
          input: [10, 16, [{ seqId: 1, tokenCount: 35 }, { seqId: 2, tokenCount: 20 }]],
          inputStr: "totalBlocks=10, blockSize=16, requests=[seq1: 35 tokens, seq2: 20 tokens]",
          expectedOutput: [{ seqId: 1, blocksAllocated: 3 }, { seqId: 2, blocksAllocated: 2 }],
          expectedOutputStr: "[{ seqId: 1, blocksAllocated: 3 }, { seqId: 2, blocksAllocated: 2 }]",
          isHidden: false,
        },
      ],
      hint: "Number of blocks needed = ceil(tokens / blockSize). Subtract from available physical blocks.",
    },
    {
      id: 8,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "DSA - Matrix Multiply & Quantization",
      title: "FP8 / INT4 Weight Quantization Simulator",
      difficulty: "Hard",
      question: "Simulate symmetrical per-tensor quantization of floating-point neural network weights to 8-bit signed integers [-127, 127].",
      description: "Given a 1D float array `weights`, compute the scale factor `scale = max(abs(weights)) / 127` and return the quantized integer array where `quantized[i] = round(weights[i] / scale)`.",
      examples: [
        {
          input: "weights = [0.0, 1.27, -2.54, 2.54]",
          output: "[0, 64, -127, 127]",
          explanation: "maxAbs = 2.54. scale = 2.54 / 127 = 0.02. Quantized: [0, 64, -127, 127].",
        },
      ],
      constraints: ["1 <= weights.length <= 10^5"],
      function_name: "quantizeWeightsInt8",
      starter_templates: {
        javascript: `function quantizeWeightsInt8(weights) {
  let maxAbs = 0;
  for (const w of weights) {
    maxAbs = Math.max(maxAbs, Math.abs(w));
  }
  if (maxAbs === 0) return weights.map(() => 0);

  const scale = maxAbs / 127;
  return weights.map((w) => Math.max(-127, Math.min(127, Math.round(w / scale))));
}`,
        python: `def quantize_weights_int8(weights: list[float]) -> list[int]:
    max_abs = max(abs(w) for w in weights) if weights else 0
    if max_abs == 0: return [0] * len(weights)
    scale = max_abs / 127.0
    return [max(-127, min(127, round(w / scale))) for w in weights]`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Int8 Scaling",
          input: [[0.0, 1.27, -2.54, 2.54]],
          inputStr: "weights = [0.0, 1.27, -2.54, 2.54]",
          expectedOutput: [0, 64, -127, 127],
          expectedOutputStr: "[0, 64, -127, 127]",
          isHidden: false,
        },
      ],
      hint: "Find max absolute value, compute scale factor `maxAbs / 127`, and round weights / scale clamped to [-127, 127].",
    },
    {
      id: 9,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Production RAG Architecture",
      title: "Reciprocal Rank Fusion (RRF) Hybrid Search",
      difficulty: "Medium",
      question: "Combine ranked search results from Dense Vector search and Sparse BM25 search using Reciprocal Rank Fusion (RRF).",
      description: "Given ranked document IDs from Dense search `denseRanks` (1-indexed) and Sparse search `sparseRanks` (1-indexed), calculate the RRF score for each document:\n\n`RRF(d) = sum(1 / (k + rank(d)))` where constant `k = 60`.\n\nReturn the document IDs sorted by descending RRF score.",
      examples: [
        {
          input: "denseRanks = ['doc1', 'doc2', 'doc3'], sparseRanks = ['doc2', 'doc1', 'doc4'], k = 60",
          output: "['doc2', 'doc1', 'doc3', 'doc4']",
          explanation: "doc2 has rank 2 in dense (1/62) and rank 1 in sparse (1/61) -> highest sum.",
        },
      ],
      constraints: ["1 <= denseRanks.length, sparseRanks.length <= 1000", "k >= 1"],
      function_name: "reciprocalRankFusion",
      starter_templates: {
        javascript: `function reciprocalRankFusion(denseRanks, sparseRanks, k = 60) {
  const scores = new Map();

  denseRanks.forEach((docId, idx) => {
    const rank = idx + 1;
    const cur = scores.get(docId) || 0;
    scores.set(docId, cur + 1 / (k + rank));
  });

  sparseRanks.forEach((docId, idx) => {
    const rank = idx + 1;
    const cur = scores.get(docId) || 0;
    scores.set(docId, cur + 1 / (k + rank));
  });

  const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  return sorted.map((entry) => entry[0]);
}`,
        python: `def reciprocal_rank_fusion(dense_ranks: list[str], sparse_ranks: list[str], k: int = 60) -> list[str]:
    scores = {}
    for idx, d in enumerate(dense_ranks):
        scores[d] = scores.get(d, 0.0) + 1.0 / (k + idx + 1)
    for idx, d in enumerate(sparse_ranks):
        scores[d] = scores.get(d, 0.0) + 1.0 / (k + idx + 1)
    return [d for d, s in sorted(scores.items(), key=lambda x: x[1], reverse=True)]`,
      },
      test_cases: [
        {
          id: 1,
          name: "Standard Dual-Rank RRF",
          input: [["doc1", "doc2", "doc3"], ["doc2", "doc1", "doc4"], 60],
          inputStr: "dense=['doc1','doc2','doc3'], sparse=['doc2','doc1','doc4'], k=60",
          expectedOutput: ["doc2", "doc1", "doc3", "doc4"],
          expectedOutputStr: "['doc2', 'doc1', 'doc3', 'doc4']",
          isHidden: false,
        },
      ],
      hint: "For each list, compute `1 / (k + rank)` and sum scores in a hash map. Sort by highest aggregate score.",
    },
    {
      id: 10,
      round_number: 2,
      round_title: "Data Structures & Algorithms (DSA)",
      category: "Core Technical - Distributed Model Training",
      title: "ZeRO Optimizer State Memory Partitioning",
      difficulty: "Hard",
      question: "Calculate the GPU memory savings across ZeRO-1, ZeRO-2, and ZeRO-3 optimization stages for billion-parameter model training.",
      description: "Given `paramCountBillions` and `numGPUs`, calculate the memory footprint per GPU in Gigabytes (GB) assuming 16-bit mixed precision (FP16/BF16 weights = 2 bytes/param, FP16 gradients = 2 bytes/param, FP32 Adam optimizer states = 12 bytes/param):\n\n- Baseline (no ZeRO): `(2 + 2 + 12) * params` GB\n- ZeRO-1 (Optimizer partitioned): `(2 + 2 + 12 / N) * params` GB\n\nReturn `{ baselineGB: number, zero1GB: number }` rounded to 1 decimal place.",
      examples: [
        {
          input: "paramCountBillions = 10, numGPUs = 8",
          output: "{\"baselineGB\": 160.0, \"zero1GB\": 55.0}",
          explanation: "Baseline: 16 * 10 = 160 GB. ZeRO-1: (4 + 12/8) * 10 = 5.5 * 10 = 55.0 GB.",
        },
      ],
      constraints: ["1 <= paramCountBillions <= 1000", "1 <= numGPUs <= 1024"],
      function_name: "calculateZeROMemory",
      starter_templates: {
        javascript: `function calculateZeROMemory(paramCountBillions, numGPUs) {
  const p = paramCountBillions;
  const baselineGB = Math.round(16 * p * 10) / 10;
  const zero1GB = Math.round((4 + 12 / numGPUs) * p * 10) / 10;
  return { baselineGB, zero1GB };
}`,
        python: `def calculate_zero_memory(param_count_billions: float, num_gpus: int) -> dict:
    p = param_count_billions
    baseline = round(16 * p, 1)
    z1 = round((4 + 12.0 / num_gpus) * p, 1)
    return {"baselineGB": baseline, "zero1GB": z1}`,
      },
      test_cases: [
        {
          id: 1,
          name: "10B Model Across 8 GPUs",
          input: [10, 8],
          inputStr: "paramCountBillions = 10, numGPUs = 8",
          expectedOutput: { baselineGB: 160.0, zero1GB: 55.0 },
          expectedOutputStr: "{\"baselineGB\": 160.0, \"zero1GB\": 55.0}",
          isHidden: false,
        },
      ],
      hint: "Adam optimizer uses 12 bytes/param in FP32. ZeRO-1 partitions this by numGPUs.",
    },
  ],
};
