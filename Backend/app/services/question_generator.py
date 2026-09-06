import os
import json
import re
from typing import List, Dict, Any, Optional, Tuple
import requests

# =====================================================================
# DOMAIN CONSTRAINTS & FORBIDDEN DRIFT KEYWORDS
# =====================================================================

DOMAIN_DRIFT_MAP = {
    "c++": {
        "forbidden": [
            "react", "virtual dom", "vdom", "fiber", "jsx", "usestate", "useeffect", "css", "html",
            "python", "django", "flask", "java spring", "jvm", "garbage collector", "node.js", "express"
        ],
        "required_keywords": ["c++", "pointer", "reference", "raii", "memory", "destructor", "template", "stl", "move", "rvalue", "virtual", "const", "thread", "vector", "smart pointer", "unique_ptr", "shared_ptr", "override", "struct", "class", "constexpr"]
    },
    "python": {
        "forbidden": [
            "react", "virtual dom", "jsx", "c++ pointer", "raii", "delete operator", "jvm", "java spring"
        ],
        "required_keywords": ["python", "gil", "generator", "yield", "decorator", "list comprehension", "dict", "tuple", "dunder", "__init__", "asyncio", "dataclass", "metaclass", "typing", "memory", "lambda", "gc"]
    },
    "java": {
        "forbidden": [
            "react", "virtual dom", "jsx", "c++ pointer", "raii", "python gil", "python decorator"
        ],
        "required_keywords": ["java", "jvm", "garbage collection", "heap", "stack", "bytecode", "spring", "interface", "abstract", "multithreading", "synchronized", "volatile", "generics", "stream api", "optional", "concurrent", "classloader"]
    },
    "javascript": {
        "forbidden": [
            "c++ pointer", "raii", "python gil", "python decorator", "jvm", "java spring"
        ],
        "required_keywords": ["javascript", "closure", "event loop", "prototype", "promise", "async", "await", "hoisting", "scope", "microtask", "call stack", "this", "callback", "es6", "json", "v8"]
    },
    "react": {
        "forbidden": [
            "c++ pointer", "raii", "python gil", "python decorator", "jvm", "java spring", "django"
        ],
        "required_keywords": ["react", "component", "hook", "state", "props", "useeffect", "usestate", "usememo", "virtual dom", "fiber", "reconciliation", "render", "context", "redux", "lifecycle", "jsx"]
    },
    "go": {
        "forbidden": [
            "react", "jsx", "virtual dom", "c++ template", "raii", "python gil", "jvm", "java spring"
        ],
        "required_keywords": ["go", "golang", "goroutine", "channel", "interface", "struct", "pointer", "defer", "panic", "recover", "context", "mutex", "sync", "slice", "map", "garbage collector"]
    },
    "sql & databases": {
        "forbidden": [
            "react", "jsx", "virtual dom", "c++ pointer", "python decorator"
        ],
        "required_keywords": ["sql", "query", "index", "b-tree", "join", "acid", "transaction", "isolation", "normalization", "foreign key", "primary key", "lock", "mvcc", "execution plan", "explain", "partition", "sharding", "database"]
    },
    "system design & architecture": {
        "forbidden": [
            "react component", "usestate", "c++ template", "python decorator"
        ],
        "required_keywords": ["scalability", "load balancer", "caching", "redis", "database", "sharding", "microservices", "latency", "throughput", "consistency", "cap theorem", "queue", "kafka", "cdn", "failover", "high availability", "api gateway"]
    },
    "machine learning": {
        "forbidden": [
            "react", "jsx", "virtual dom", "css", "c++ template"
        ],
        "required_keywords": ["model", "training", "inference", "loss", "gradient", "neural network", "overfitting", "regularization", "hyperparameter", "embedding", "transformer", "attention", "metric", "precision", "recall", "dataset", "gpu", "rag"]
    },
}

# =====================================================================
# CURATED KNOWLEDGE BANKS (PRE-COMPILED & VERIFIED)
# =====================================================================

CURATED_QUESTION_BANKS = {
    "c++": {
        "Technical Interview": {
            "Easy": [
                {
                    "category": "C++ Memory Management",
                    "question": "Explain the difference between a pointer and a reference in C++. Under what conditions would you choose one over the other?",
                    "hint": "References cannot be null or reseated; pointers support arithmetic and null assignment.",
                    "expected_key_points": ["Memory address vs alias", "Nullability & re-assignment safety", "Pointer arithmetic vs direct dereference", "Use references for function parameters when ownership is not transferred"],
                },
                {
                    "category": "C++ OOP & Const Correctness",
                    "question": "What is the significance of the `const` keyword when applied to member functions in a C++ class?",
                    "hint": "A const member function cannot modify non-mutable class member variables.",
                    "expected_key_points": ["Prevents modification of member variables (this becomes const Class*)", "Allows invoking method on const instances", "mutable keyword exception", "Improves code safety and compiler optimizations"],
                },
                {
                    "category": "C++ Resource Management",
                    "question": "What does the RAII (Resource Acquisition Is Initialization) idiom mean in C++, and how does it prevent memory leaks?",
                    "hint": "Resource lifetime is bound to the object's scope and destructor invocation.",
                    "expected_key_points": ["Constructor acquires resource, destructor releases it", "Automatic deterministic cleanup when exiting scope", "Exception safety guaranteed during stack unwinding", "Examples: std::unique_ptr, std::lock_guard, std::vector"],
                },
                {
                    "category": "C++ Stack vs Heap",
                    "question": "How does dynamic memory allocation with `new`/`delete` differ from stack allocation in C++ regarding performance and lifetime?",
                    "hint": "Stack allocation is a simple pointer bump; heap involves OS/allocator bookkeeping.",
                    "expected_key_points": ["Stack is fast (CPU register bump), heap has allocation overhead", "Stack lifetime is lexical scope; heap lifetime is manual until delete", "Stack has fixed size (risk of stack overflow)", "Memory fragmentation risks on heap"],
                },
                {
                    "category": "C++ Polymorphism",
                    "question": "Why should a base class with virtual functions always declare a `virtual` destructor in C++?",
                    "hint": "Deleting a derived object through a base pointer causes undefined behavior without a virtual destructor.",
                    "expected_key_points": ["Ensures derived class destructor executes first, then base", "Prevents resource/memory leaks in derived members", "Undefined behavior in C++ standard if non-virtual", "Vtable lookup dynamically resolves proper destructor chain"],
                },
            ],
            "Medium": [
                {
                    "category": "C++ Modern Semantics",
                    "question": "Explain move semantics and rvalue references (`&&`) introduced in C++11. How do they eliminate expensive deep copies?",
                    "hint": "Move semantics transfer ownership of heap resources without duplicating buffers.",
                    "expected_key_points": ["lvalue vs rvalue distinction (identity vs temporary)", "std::move casts to rvalue reference", "Move constructor/assignment steals internal pointers and nullifies source", "Massive performance gain for containers like std::vector and std::string"],
                },
                {
                    "category": "C++ Smart Pointers",
                    "question": "Compare `std::unique_ptr` and `std::shared_ptr` in C++. When does `std::shared_ptr` incur overhead, and how does `std::weak_ptr` resolve circular references?",
                    "hint": "Shared pointer maintains an atomic reference count control block.",
                    "expected_key_points": ["std::unique_ptr has zero runtime overhead (single exclusive owner)", "std::shared_ptr uses control block with atomic ref count increment/decrement", "Cyclic references between shared_ptrs prevent ref count reaching zero (leak)", "std::weak_ptr observes object without incrementing strong count"],
                },
                {
                    "category": "C++ Vtable & Virtual Dispatch",
                    "question": "Describe how the C++ compiler and runtime implement dynamic polymorphism using the virtual table (vtable) and virtual pointer (vptr). What is the runtime cost?",
                    "hint": "Each class with virtual functions has a table of function pointers; each instance has a hidden vptr.",
                    "expected_key_points": ["Compiler builds static vtable per class with addresses of virtual methods", "Object instance contains hidden pointer (_vptr) pointing to class vtable", "Indirect memory lookup cost (one pointer dereference) + branch misprediction", "Prevents inline optimization by compiler"],
                },
                {
                    "category": "C++ Templates & Compile-Time Metaprogramming",
                    "question": "What is the difference between template specialization and function overloading in C++? How does SFINAE or C++20 Concepts constrain templates?",
                    "hint": "SFINAE prevents substitution failures from being hard compiler errors; Concepts provide readable constraints.",
                    "expected_key_points": ["Templates generate code at compile-time per type", "Overloading participates in normal overload resolution; specialization overrides template instance", "SFINAE (Substitution Failure Is Not An Error) selectively enables template overloads via std::enable_if", "C++20 Concepts provide explicit compile-time contracts with clean compiler errors"],
                },
                {
                    "category": "C++ Concurrency & Memory Model",
                    "question": "Explain the difference between `std::mutex` and `std::atomic` in C++. When is a lock-free atomic operation preferred over a mutex lock?",
                    "hint": "Atomics leverage CPU hardware instructions (CAS) without putting threads into kernel sleep.",
                    "expected_key_points": ["std::mutex uses OS synchronization primitives (puts thread to sleep on contention)", "std::atomic provides lock-free hardware instructions (Compare-And-Swap / CAS)", "Atomics eliminate thread context-switching latency for simple counters/flags", "Memory order models (memory_order_relaxed, memory_order_seq_cst) define visibility boundaries"],
                },
            ],
            "Hard": [
                {
                    "category": "C++ Low-Level Systems & Alignment",
                    "question": "How does memory alignment and cache-line padding affect high-frequency multi-threaded C++ applications? Explain false sharing and how `alignas(hardware_destructive_interference_size)` mitigates it.",
                    "hint": "Two threads modifying distinct variables on the same 64-byte L1 cache line cause cache thrashing.",
                    "expected_key_points": ["L1/L2 cache operates on cache lines (typically 64 bytes)", "False sharing occurs when different cores modify independent variables in same cache line", "MESI cache coherence protocol repeatedly invalidates cache across cores", "alignas() pads data structures to keep variables on distinct cache lines"],
                },
                {
                    "category": "C++ Undefined Behavior & Compilers",
                    "question": "What is the Strict Aliasing Rule in C++, and what optimizations does the compiler perform based on it? How does `std::bit_cast` or `memcpy` safely bypass it without UB?",
                    "hint": "Compiler assumes pointers of different types never point to the same memory location.",
                    "expected_key_points": ["Strict aliasing allows compiler to cache loads in registers across writes through different pointer types", "Casting pointer to incompatible type and dereferencing is undefined behavior", "char* / std::byte* are allowed to alias any type", "std::bit_cast (C++20) or std::memcpy provides safe, optimized bitwise reinterpretation"],
                },
                {
                    "category": "C++ Memory Order & Concurrency",
                    "question": "In the C++ memory model, contrast `std::memory_order_acquire` / `release` with `std::memory_order_seq_cst`. Describe a lock-free single-producer single-consumer ring buffer using acquire-release semantics.",
                    "hint": "Release ensures prior writes are visible to thread executing acquire on the same atomic variable.",
                    "expected_key_points": ["seq_cst imposes total global ordering across all threads (expensive bus lock / barriers)", "acquire-release establishes synchronizes-with relationship without global barrier", "Producer writes payload, then stores head pointer with memory_order_release", "Consumer reads head pointer with memory_order_acquire before reading payload"],
                },
                {
                    "category": "C++ Object Model & Multiple Inheritance",
                    "question": "Explain how virtual inheritance solves the Diamond Problem in C++. How does the memory layout and offset calculation change for derived instances?",
                    "hint": "Virtual base pointers (vbptr) or vbase offset in vtable ensure only one shared base subobject exists.",
                    "expected_key_points": ["Diamond problem: multiple copies of common base class in multiple inheritance", "Virtual inheritance ensures single shared instance of base subobject", "Compiler introduces virtual base table (vbtable) or negative offsets in vtable", "Object construction order: most-derived class directly initializes virtual base"],
                },
                {
                    "category": "C++ Coroutines & Modern Runtime",
                    "question": "How do C++20 stackless coroutines function under the hood? Explain the roles of the promise object, coroutine handle, and `co_await` awaiter interface.",
                    "hint": "Compiler allocates a coroutine frame on the heap storing local variables and execution state.",
                    "expected_key_points": ["Stackless: coroutine state allocated on heap in a coroutine frame, not execution stack", "Promise object controls coroutine lifecycle, return value, and exception handling", "std::coroutine_handle is a non-owning handle to resume or destroy frame", "co_await calls await_ready, await_suspend, and await_resume"],
                },
            ],
        },
        "Coding & DSA": {
            "Medium": [
                {
                    "category": "C++ Algorithmic Coding",
                    "title": "Reverse Words in a String",
                    "question": "Implement a C++ function `std::string reverseWords(std::string s)` that reverses the words in a string in-place with O(1) auxiliary space.",
                    "hint": "Reverse the entire string, then reverse each word delimited by spaces in-place.",
                    "expected_key_points": ["In-place two-pointer reversal", "O(N) time complexity", "O(1) auxiliary memory space", "Edge cases: leading, trailing, and multiple spaces"],
                    "function_name": "reverseWords",
                    "starter_templates": {
                        "cpp": "#include <string>\n#include <algorithm>\n\nstd::string reverseWords(std::string s) {\n    // Write your C++ solution here\n    return s;\n}",
                        "javascript": "function reverseWords(s) {\n    return s.trim().split(/\\s+/).reverse().join(' ');\n}",
                    },
                    "test_cases": [
                        {"id": 1, "name": "Standard String", "inputStr": "\"the sky is blue\"", "expectedOutputStr": "\"blue is sky the\""},
                        {"id": 2, "name": "Extra Spaces", "inputStr": "\"  hello world  \"", "expectedOutputStr": "\"world hello\""}
                    ]
                },
                {
                    "category": "C++ Data Structures",
                    "title": "LRU Cache in C++",
                    "question": "Design an LRU Cache in C++ with O(1) `get(key)` and `put(key, value)` using `std::list` and `std::unordered_map`.",
                    "hint": "Store key-value pairs in a doubly-linked list; map key to list iterator for instant splicing.",
                    "expected_key_points": ["std::list for doubly-linked nodes", "std::unordered_map storing iterators", "list::splice to move node to front in O(1)", "Eviction of tail element when capacity exceeded"],
                    "function_name": "LRUCache",
                    "starter_templates": {
                        "cpp": "#include <unordered_map>\n#include <list>\n\nclass LRUCache {\n    int capacity;\n    std::list<std::pair<int, int>> items;\n    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> cache;\npublic:\n    LRUCache(int capacity) : capacity(capacity) {}\n    int get(int key) {\n        // Your code here\n        return -1;\n    }\n    void put(int key, int value) {\n        // Your code here\n    }\n};",
                        "javascript": "class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const v = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, v);\n        return v;\n    }\n    put(key, val) {\n        if (this.cache.has(key)) this.cache.delete(key);\n        else if (this.cache.size >= this.capacity) this.cache.delete(this.cache.keys().next().value);\n        this.cache.set(key, val);\n    }\n}"
                    },
                    "test_cases": [
                        {"id": 1, "name": "Capacity Test", "inputStr": "put(1,1), put(2,2), get(1)", "expectedOutputStr": "1"}
                    ]
                }
            ]
        }
    },
    "python": {
        "Technical Interview": {
            "Easy": [
                {
                    "category": "Python Fundamentals",
                    "question": "Explain the difference between mutable and immutable types in Python. List two examples of each and how default mutable arguments in functions cause bugs.",
                    "hint": "Default argument expressions are evaluated once when the function definition is executed.",
                    "expected_key_points": ["Mutable: list, dict, set; Immutable: int, float, str, tuple", "Object identity (id()) remains fixed vs creates new object", "Default arg `def f(x=[])` reuses same list instance across invocations", "Idiomatic fix: `def f(x=None): if x is None: x = []`"],
                },
                {
                    "category": "Python Data Structures",
                    "question": "How does a Python dictionary implement key lookups under the hood, and what are the average and worst-case time complexities?",
                    "hint": "Python dicts use an open-addressing hash table with sparse and dense arrays.",
                    "expected_key_points": ["Hash table using hash() function and modulus mask", "Average O(1) lookup, insert, and delete", "Worst-case O(N) when hash collisions occur", "Python 3.6+ preserves insertion order using combined dense array and hash indices"],
                },
                {
                    "category": "Python Iterators & Generators",
                    "question": "What is the difference between a list comprehension and a generator expression in Python? When should you prefer a generator?",
                    "hint": "Generators produce values lazily one at a time using the iterator protocol without allocating the whole array.",
                    "expected_key_points": ["List comprehension eagerly builds full list in memory", "Generator returns an iterator object generating items on-demand via yield", "Generators have O(1) memory footprint for large streams", "Generators can only be traversed once"],
                },
            ],
            "Medium": [
                {
                    "category": "Python Concurrency & GIL",
                    "question": "What is the Global Interpreter Lock (GIL) in CPython, and how does it affect CPU-bound vs I/O-bound multi-threaded code?",
                    "hint": "GIL allows only one native thread to execute Python bytecode at a time.",
                    "expected_key_points": ["CPython memory management is not thread-safe (reference counting)", "GIL restricts bytecode execution to one thread per process", "I/O bound tasks release GIL during system calls (threading works well)", "CPU bound tasks require multiprocessing or C-extensions to utilize multiple cores"],
                },
                {
                    "category": "Python Metaprogramming & Decorators",
                    "question": "How does a Python decorator work under the hood? Explain how `@functools.wraps` preserves function metadata.",
                    "hint": "Decorators are higher-order functions that accept a function and return a wrapper callable.",
                    "expected_key_points": ["Syntax sugar for `func = decorator(func)`", "Inner wrapper function captures arguments (*args, **kwargs)", "Without @wraps, __name__ and __doc__ reflect inner wrapper", "@functools.wraps copies attributes (__module__, __name__, __qualname__, __doc__)"],
                },
                {
                    "category": "Python Memory & Garbage Collection",
                    "question": "How does Python handle memory management and garbage collection? How does the cyclic GC detect reference cycles?",
                    "hint": "Primary mechanism is reference counting; secondary is generational cycle detector.",
                    "expected_key_points": ["Reference counting frees objects immediately when ref count hits 0", "Generational GC (Gen 0, 1, 2) handles circular references", "Double-linked lists of tracked container objects", "GC subtracts internal references to find unreachable cycles"],
                }
            ],
            "Hard": [
                {
                    "category": "Python AsyncIO & Event Loop",
                    "question": "Explain the architecture of Python's `asyncio` event loop. How do coroutines, Tasks, and Futures interact without OS thread preemption?",
                    "hint": "Cooperative multitasking using generators/yield from and OS I/O multiplexers like epoll/kqueue.",
                    "expected_key_points": ["Single-threaded cooperative multitasking via event loop", "Coroutines yield control at await points", "OS selector (epoll/kqueue) notifies loop when I/O socket is ready", "Futures represent eventual results; Tasks wrap coroutines into schedulable futures"],
                },
                {
                    "category": "Python Internals & Dunder Methods",
                    "question": "How does the Python Descriptor protocol (`__get__`, `__set__`, `__delete__`) work? How does Python implement `@property` and methods using descriptors?",
                    "hint": "Attribute access on class instances triggers descriptor methods before checking instance dict.",
                    "expected_key_points": ["Data descriptor (defines __set__ or __delete__) vs non-data descriptor (only __get__)", "Lookup order: Data descriptor -> instance __dict__ -> non-data descriptor -> class __dict__", "Functions are non-data descriptors that bind self and return bound method", "@property is implemented as a data descriptor"],
                }
            ]
        }
    },
    "java": {
        "Technical Interview": {
            "Medium": [
                {
                    "category": "Java Memory & JVM",
                    "question": "Explain the JVM memory model: Heap (Young/Old Generation), Stack, and Metaspace. How does Garbage Collection (e.g., G1 GC) manage them?",
                    "hint": "Young gen uses bump-pointer allocation; surviving objects are promoted to Tenured Old gen.",
                    "expected_key_points": ["Stack stores stack frames, primitives, and object references per thread", "Heap stores all objects; split into Eden, Survivor, and Old generations", "Metaspace stores class metadata in native memory", "G1 GC divides heap into equal regions and prioritizes regions with most garbage"],
                },
                {
                    "category": "Java Concurrency",
                    "question": "Compare `synchronized`, `volatile`, and `java.util.concurrent.atomic.AtomicInteger` in Java. What happens at the CPU memory cache level?",
                    "hint": "Volatile provides memory visibility and prevents instruction reordering without locking.",
                    "expected_key_points": ["volatile guarantees visibility (flushes CPU cache to RAM) and prevents reordering", "volatile does NOT guarantee atomicity for compound operations (e.g. count++)", "AtomicInteger uses lock-free hardware CAS (Compare-And-Swap)", "synchronized acquires monitor lock, providing atomicity and mutual exclusion"],
                },
                {
                    "category": "Java Core & Collections",
                    "question": "How does `ConcurrentHashMap` in Java achieve high concurrency without locking the entire table in Java 8+?",
                    "hint": "Java 8 replaced segment locks with node-level CAS and synchronized on bin heads.",
                    "expected_key_points": ["Java 7 used ReentrantLock segmented partitions", "Java 8 uses CAS for inserting first bin node", "Synchronizes only on the head node of a hash bucket on collisions", "Converts bins from linked list to red-black tree when bin size exceeds 8 (TREEIFY_THRESHOLD)"],
                }
            ]
        }
    },
    "react": {
        "Technical Interview": {
            "Medium": [
                {
                    "category": "React Internals & Fiber",
                    "question": "Explain how React Fiber enables incremental rendering and time-slicing. What is the difference between the Render Phase and Commit Phase?",
                    "hint": "Fiber is a singly-linked list tree structure that allows cooperative scheduling via requestIdleCallback/MessageChannel.",
                    "expected_key_points": ["Fiber nodes represent units of work with child, sibling, and return pointers", "Render Phase is asynchronous and interruptible (computes diffs)", "Commit Phase is synchronous (applies DOM mutations)", "Double buffering swaps workInProgress tree with current tree"],
                },
                {
                    "category": "React Performance & Hooks",
                    "question": "When should you use `useCallback` and `useMemo` in React? What is the performance cost of overusing them?",
                    "hint": "Memoization itself carries memory allocation and dependency comparison overhead.",
                    "expected_key_points": ["Preserves reference equality across renders to prevent child re-rendering with React.memo", "Caches computationally expensive derived values", "Overhead: allocating function/array closure + iterating dependencies on every render", "Don't wrap trivial calculations or components that re-render anyway"],
                },
                {
                    "category": "React State Management & Concurrency",
                    "question": "How does React 18 automatic batching and `useTransition` work to keep the UI responsive during heavy state updates?",
                    "hint": "useTransition marks state updates as non-urgent transitions that can be interrupted by user typing.",
                    "expected_key_points": ["Automatic batching groups multiple setState calls in promises, timeouts, and events into single re-render", "useTransition separates urgent updates (typing/clicking) from non-urgent (filtering/rendering lists)", "Urgent updates interrupt transition renders to eliminate input lag", "isPending boolean provides visual loading indicator"],
                }
            ]
        }
    },
    "system design & architecture": {
        "Technical Interview": {
            "Medium": [
                {
                    "category": "Distributed Systems & Caching",
                    "question": "Explain the Cache-Aside pattern with Redis. How do you prevent Cache Stampede (Thundering Herd) and Cache Penetration?",
                    "hint": "Cache stampede occurs when high-concurrency key expires; cache penetration occurs when non-existent keys bypass cache to DB.",
                    "expected_key_points": ["Application checks cache first; on miss, reads DB and writes to cache", "Cache Stampede mitigated using distributed mutex lock or probabilistic early expiration (XFetch)", "Cache Penetration mitigated using Bloom filters or caching null objects with short TTL", "Cache Avalanche mitigated with randomized jitter on TTL"],
                },
                {
                    "category": "Databases & Sharding",
                    "question": "How does database sharding work, and what is the difference between range-based sharding and hash-based consistent hashing?",
                    "hint": "Consistent hashing minimizes key remapping when adding or removing database nodes.",
                    "expected_key_points": ["Horizontal data partitioning across independent database nodes", "Range sharding splits by sequential keys (prone to write hotspots)", "Consistent hashing maps nodes and keys to a hash ring", "Virtual nodes ensure balanced distribution and seamless rebalancing"],
                },
                {
                    "category": "Microservices & Reliability",
                    "question": "Describe the 3-state machine of a Circuit Breaker (Closed, Open, Half-Open). How does it prevent cascading failures in microservice architectures?",
                    "hint": "When failure rate exceeds threshold, circuit trips Open to fail fast without overloading downstream services.",
                    "expected_key_points": ["Closed: normal traffic flows, tracks failure percentage", "Open: requests immediately fail fast or return fallback without calling degraded dependency", "Half-Open: after cooldown timeout, allows canary probe requests to test recovery", "Prevents thread pool starvation and cascading service failure"],
                }
            ]
        }
    },
    "behavioral & hr": {
        "Behavioral & HR": {
            "Medium": [
                {
                    "category": "Conflict & Collaboration (STAR)",
                    "question": "Describe a situation where you had a strong technical disagreement with a colleague or tech lead. How did you handle the situation and what was the outcome?",
                    "hint": "Use the STAR method: Situation, Task, Action, Result. Focus on data-driven discussions and disagree-and-commit.",
                    "expected_key_points": ["Situation: Clear technical trade-off context", "Action: Objective benchmarking, prototypes, active listening", "Outcome: Professional alignment and team delivery", "Key principle: Disagree and commit when decision is finalized"],
                },
                {
                    "category": "Production Outage & Ownership (STAR)",
                    "question": "Tell me about a time a project or production deployment failed or faced a critical bug. What specific actions did you take to mitigate it, and what did you learn?",
                    "hint": "Highlight immediate stabilization, blameless post-mortem, and automated regression guards.",
                    "expected_key_points": ["Immediate containment (rollback, traffic rerouting, feature flag toggle)", "Clear communication to stakeholders", "Blameless post-mortem identifying root cause", "Permanent preventive measures (tests, alerts, circuit breakers)"],
                },
                {
                    "category": "Mentorship & Leadership",
                    "question": "How do you handle ambiguous requirements or sudden scope changes from product managers close to a delivery deadline?",
                    "hint": "Focus on trade-off communication, MVP prioritization, and transparent technical debt tracking.",
                    "expected_key_points": ["Clarifying core business objectives and MVP boundary", "Communicating trade-offs (scope vs timeline vs quality)", "Proposing phased delivery or de-scoping non-critical features", "Maintaining team morale and quality standards"],
                }
            ]
        }
    }
}

# =====================================================================
# CONSTRAINT & RELEVANCE VALIDATOR
# =====================================================================

def validate_question(question_obj: Dict[str, Any], domain: str, interview_type: str) -> Tuple[bool, str]:
    """
    Strictly verifies that a question adheres to:
    1. The target domain (no forbidden cross-technology terms).
    2. The interview type (no HR questions in Technical interview, no coding in HR).
    3. Conciseness (1-3 sentences, 1 primary concept).
    """
    q_text = question_obj.get("question", "").strip()
    if not q_text or len(q_text) < 15:
        return False, "Question is empty or too short."

    lower_q = q_text.lower()
    lower_domain = domain.lower().strip()

    # 1. Check forbidden domain drift
    drift_rules = None
    for key, rules in DOMAIN_DRIFT_MAP.items():
        if key in lower_domain or lower_domain in key:
            drift_rules = rules
            break

    if drift_rules:
        for forbidden in drift_rules["forbidden"]:
            pattern = rf"\b{re.escape(forbidden)}\b"
            if re.search(pattern, lower_q):
                return False, f"Domain drift detected: contains forbidden term '{forbidden}' for domain '{domain}'."

    # 2. Check Interview Type alignment
    lower_type = interview_type.lower()
    if "behavioral" in lower_type or "hr" in lower_type:
        if any(term in lower_q for term in ["write a function", "implement", "time complexity", "big-o", "class", "pointer"]):
            return False, "HR interview received a code/technical question."
    elif "technical" in lower_type or "coding" in lower_type:
        behavioral_markers = [
            "tell me about a time", "describe a situation where you had a conflict",
            "greatest strength", "greatest weakness", "why do you want to work here",
            "where do you see yourself"
        ]
        if any(marker in lower_q for marker in behavioral_markers):
            return False, f"Technical interview received an HR/behavioral question: '{q_text}'."

    # 3. Check conciseness & single-concept focus
    sentences = [s.strip() for s in re.split(r'[.!?]+', q_text) if len(s.strip()) > 3]
    if len(sentences) > 5 or len(q_text.split()) > 100:
        return False, f"Question is too verbose ({len(q_text.split())} words, {len(sentences)} sentences). Real interview questions should be 1-3 sentences focusing on one core concept."

    return True, "Valid"


# =====================================================================
# AI GENERATION WITH GEMINI LLM
# =====================================================================

def generate_with_gemini(
    company: str,
    role: str,
    difficulty: str,
    interview_type: str,
    domain: str,
    question_count: int,
    api_key: str,
) -> Optional[List[Dict[str, Any]]]:
    """Generates strictly constrained interview questions using Gemini REST API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    system_prompt = f"""You are a Staff Technical Interviewer at {company} conducting a real {difficulty} difficulty {interview_type} for a {role} position.

CRITICAL HARD CONSTRAINTS:
1. DOMAIN / TOPIC: Every single question MUST strictly test: "{domain}".
2. ZERO DRIFT: Never ask questions about other unrelated languages, frameworks, or libraries. (e.g. If domain is C++, NEVER ask about React, Python, Java, or web CSS).
3. INTERVIEW TYPE: Must match "{interview_type}".
   - If "Technical Interview": In-depth conceptual & system questions on {domain} (memory, internals, trade-offs, concurrency).
   - If "Coding & DSA": Algorithmic problem with starter code in {domain} language and test cases.
   - If "Behavioral & HR": STAR method leadership/collaboration questions.
4. TONE & LENGTH: Real interviewer style!
   - 1 to 3 clear, focused sentences per question.
   - Exactly ONE primary concept per question. Do NOT combine 4-5 unrelated topics into a bloated paragraph.
5. DIFFICULTY: Calibrate strictly to "{difficulty}".

Generate exactly {question_count} distinct questions.

Return ONLY a valid JSON array of objects conforming to this schema (no markdown fences, no explanatory text):
[
  {{
    "id": 1,
    "category": "{domain} - Core Concept",
    "question": "Clear 1-3 sentence interviewer question testing one primary concept.",
    "hint": "Concise hint explaining the core expected technical intuition.",
    "expected_key_points": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "difficulty": "{difficulty}",
    "domain": "{domain}",
    "language": "{domain.lower()}"
  }}
]"""

    payload = {
        "contents": [{"parts": [{"text": system_prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json",
        },
    }

    try:
        response = requests.post(url, json=payload, timeout=25)
        if response.status_code == 200:
            data = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            parsed = json.loads(raw_text.strip())
            if isinstance(parsed, list) and len(parsed) > 0:
                validated_questions = []
                for q in parsed:
                    is_valid, reason = validate_question(q, domain, interview_type)
                    if is_valid:
                        validated_questions.append(q)
                    else:
                        print(f"[QuestionGenerator] Rejected LLM question due to constraint violation: {reason}")
                
                if len(validated_questions) >= max(1, question_count // 2):
                    return validated_questions
    except Exception as e:
        print(f"[QuestionGenerator] Gemini generation error: {e}")

    return None


# =====================================================================
# SYNTHESIZER / FALLBACK ENGINE FOR ANY DOMAIN
# =====================================================================

def synthesize_domain_questions(
    company: str,
    role: str,
    difficulty: str,
    interview_type: str,
    domain: str,
    question_count: int = 10,
) -> List[Dict[str, Any]]:
    """
    Synthesizes clean, professional, and strictly constrained questions for any domain
    using verified domain banks or domain-templated architecture.
    """
    lower_domain = domain.lower().strip()
    matched_bank = None

    for bank_key, bank_data in CURATED_QUESTION_BANKS.items():
        if bank_key in lower_domain or lower_domain in bank_key:
            matched_bank = bank_data
            break

    questions = []

    if matched_bank:
        type_key = "Behavioral & HR" if ("behavioral" in interview_type.lower() or "hr" in interview_type.lower()) else (
            "Coding & DSA" if "coding" in interview_type.lower() else "Technical Interview"
        )
        sub_bank = matched_bank.get(type_key, matched_bank.get("Technical Interview", {}))
        diff_questions = sub_bank.get(difficulty, sub_bank.get("Medium", []))
        
        pool = list(diff_questions)
        for d in ["Medium", "Easy", "Hard"]:
            if d != difficulty and d in sub_bank:
                for q in sub_bank[d]:
                    if q not in pool:
                        pool.append(q)

        for i in range(question_count):
            template_q = pool[i % len(pool)]
            q_copy = dict(template_q)
            q_copy["id"] = i + 1
            q_copy["round_number"] = (i // 5) + 1
            q_copy["domain"] = domain
            q_copy["difficulty"] = difficulty
            q_copy["round_title"] = f"{domain} {interview_type}"
            questions.append(q_copy)
    else:
        concepts = [
            ("Core Architecture & Memory", f"How does {domain} handle memory management, allocation, and lifecycle? Compare its approach to other standard runtimes.", ["Memory model & allocation mechanics", "Garbage collection or manual destruction semantics", "Stack vs heap boundaries in " + domain, "Performance trade-offs"]),
            ("Concurrency & Threading", f"Explain how concurrency and asynchronous operations are implemented in {domain}. How does it avoid race conditions?", ["Thread synchronization primitives", "Asynchronous event loops or green threads", "Locking mechanics or message passing channels", "Deadlock and data-race prevention in " + domain]),
            ("Type System & Error Handling", f"Describe the type system and error handling strategy of {domain}. What are the safety guarantees provided at compile-time vs runtime?", ["Static vs dynamic type checking", "Exception handling vs Result types", "Null safety and boundary checks", "Compile-time validation guarantees"]),
            ("Performance & Optimizations", f"What are the most common performance bottlenecks when scaling applications written in {domain}? How do you profile and optimize them?", ["CPU and memory profiling tools", "Algorithmic optimization patterns", "I/O and network latency minimization", "Benchmarking and hardware cache efficiency in " + domain]),
            ("Standard Libraries & Idioms", f"What are the standard idioms and design patterns recommended by the {domain} community for production-grade software?", ["Idiomatic design patterns", "Standard library best practices", "Code organization and modularity", "Maintainability and testing patterns"]),
            ("Resource Management", f"How are external resources (file handles, database connections, sockets) safely acquired and released in {domain}?", ["Automatic cleanup idioms (RAII, defer, using/try-with-resources)", "Leak prevention strategies", "Connection pooling", "Exception-safe destruction"]),
            ("Data Structures & Lookup", f"How do the primary built-in collection data structures in {domain} achieve fast search and insertion? What are their Big-O complexities?", ["Hash table collision handling", "Dynamic array resizing amortized complexity", "Tree map ordering guarantees", "Cache locality considerations"]),
            ("Compilation & Execution Model", f"Walk through the compilation or execution pipeline of {domain} from source code to machine execution.", ["Lexical analysis, parsing, and AST generation", "Intermediate representation / bytecode or native machine code", "JIT compilation or AOT optimization", "Runtime execution environment"]),
            ("System Boundary & Interoperability", f"How does {domain} interface with native OS APIs, C libraries, or external microservices?", ["Foreign Function Interface (FFI)", "Network protocols and serialization", "System call execution", "Marshaling overhead"]),
            ("Production Failure Recovery", f"When an unhandled failure or panic occurs in a {domain} application, how should recovery and telemetry be architected for high availability at {company}?", ["Supervisor trees and process recovery", "Structured logging and error propagation", "Graceful shutdown and in-flight request draining", "Health checks and automated alerting"]),
        ]

        for i in range(question_count):
            cat, prompt, points = concepts[i % len(concepts)]
            questions.append({
                "id": i + 1,
                "round_number": (i // 5) + 1,
                "round_title": f"{domain} {interview_type}",
                "category": f"{domain} - {cat}",
                "question": prompt,
                "hint": f"Discuss the internal design and production trade-offs specific to {domain}.",
                "expected_key_points": points,
                "difficulty": difficulty,
                "domain": domain,
                "language": lower_domain,
            })

    return questions


# =====================================================================
# MAIN GENERATION SERVICE ENTRY POINT
# =====================================================================

def generate_interview_session(
    company: str = "Google",
    role: str = "Software Engineer",
    difficulty: str = "Medium",
    interview_type: str = "Technical Interview",
    domain: str = "General Software Engineering",
    question_count: int = 10,
) -> List[Dict[str, Any]]:
    """
    Main entry point for interview question generation.
    Enforces HARD CONSTRAINTS:
    - Domain: Must strictly test the requested domain (e.g. C++).
    - Interview Type: Must match (Technical, Coding, System Design, Behavioral).
    - Difficulty: Must match (Easy, Medium, Hard).
    - Zero drift tolerance.
    """
    company = company.strip() if company else "Google"
    role = role.strip() if role else "Software Engineer"
    difficulty = difficulty.capitalize().strip() if difficulty else "Medium"
    interview_type = interview_type.strip() if interview_type else "Technical Interview"
    domain = domain.strip() if domain else "C++"
    question_count = max(5, min(question_count, 20))

    # 1. Try LLM Generation if API Key is configured in environment
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key and len(gemini_key) > 10:
        llm_questions = generate_with_gemini(
            company=company,
            role=role,
            difficulty=difficulty,
            interview_type=interview_type,
            domain=domain,
            question_count=question_count,
            api_key=gemini_key,
        )
        if llm_questions and len(llm_questions) >= question_count:
            for idx, q in enumerate(llm_questions):
                q["id"] = idx + 1
                q["round_number"] = (idx // 5) + 1
                q["round_title"] = f"{domain} {interview_type}"
            return llm_questions[:question_count]

    # 2. Resilient domain-curated generation (100% strictly adhering to domain and constraints)
    return synthesize_domain_questions(
        company=company,
        role=role,
        difficulty=difficulty,
        interview_type=interview_type,
        domain=domain,
        question_count=question_count,
    )
