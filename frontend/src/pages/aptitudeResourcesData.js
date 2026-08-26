// Comprehensive topic-wise Aptitude & Logical Reasoning practice questions and learning topics for Resources page

export const aptitudeTopics = [
  {
    id: "quant-aptitude",
    icon: "🧮",
    category: "Quantitative Aptitude",
    title: "Quantitative Aptitude",
    description: "Number systems, percentages, profit & loss, time & work, speed-distance-time, probability, and permutations.",
    problemCount: 8,
    formulaCount: 24,
    questions: [
      {
        id: "quant-1",
        title: "Profit & Successive Discounts",
        topic: "Profit & Loss",
        difficulty: "Medium",
        companies: ["Amazon", "Flipkart", "Accenture", "TCS"],
        question: "A merchant marks an article 50% above the cost price and then allows two successive discounts of 10% and 20% on the marked price. If the cost price is $800, what is the merchant's net profit percentage and final selling price?",
        options: [
          "A) 8% profit, $864 selling price",
          "B) 10% profit, $880 selling price",
          "C) 5% profit, $840 selling price",
          "D) 12% profit, $896 selling price"
        ],
        correctAnswer: "A) 8% profit, $864 selling price",
        explanation: "1. Cost Price (CP) = $800.\n2. Marked Price (MP) = $800 × 1.50 = $1,200.\n3. Price after 1st discount (10%) = $1,200 × (1 - 0.10) = $1,080.\n4. Final Selling Price (SP) after 2nd discount (20%) = $1,080 × (1 - 0.20) = $864.\n5. Net Profit = SP - CP = $864 - $800 = $64.\n6. Profit Percentage = (64 / 800) × 100% = 8%.",
        formula: "SP = MP × (1 - d₁) × (1 - d₂) = CP × (1 + m) × (1 - d₁) × (1 - d₂)"
      },
      {
        id: "quant-2",
        title: "Time & Work (Alternate Days)",
        topic: "Time & Work",
        difficulty: "Medium",
        companies: ["TCS", "Infosys", "Wipro", "Cognizant"],
        question: "Worker A can finish a job in 12 days, and Worker B can finish the same job in 16 days. If they work on alternate days starting with A on day 1, in how many days will the entire work be completed?",
        options: [
          "A) 13.75 days (13 days 18 hours)",
          "B) 14 days",
          "C) 13.5 days",
          "D) 12.8 days"
        ],
        correctAnswer: "A) 13.75 days (13 days 18 hours)",
        explanation: "1. Take LCM of 12 and 16 = 48 total units of work.\n2. Efficiency of A = 48 / 12 = 4 units/day.\n3. Efficiency of B = 48 / 16 = 3 units/day.\n4. In a 2-day cycle (A on day 1, B on day 2): Work done = 4 + 3 = 7 units.\n5. In 6 full 2-day cycles (12 days): Work done = 6 × 7 = 42 units.\n6. Remaining work = 48 - 42 = 6 units.\n7. Day 13 (A's turn): A does 4 units. Total done = 46 units. Remaining = 2 units.\n8. Day 14 (B's turn): B needs (2 / 3) of a day = 0.75 days.\nTotal time = 12 + 1 + 0.75 = 13.75 days (13 ¾ days).",
        formula: "Cycle Work = Work_A + Work_B. Total Days = (Cycles × 2) + Fractional Day"
      },
      {
        id: "quant-3",
        title: "Relative Speed of Two Trains",
        topic: "Speed & Distance",
        difficulty: "Medium",
        companies: ["Microsoft", "Google", "Amazon", "Oracle"],
        question: "Two trains of lengths 150m and 250m are moving on parallel tracks towards each other with speeds of 72 km/h and 54 km/h respectively. How many seconds will they take to completely cross each other from the moment their engines meet?",
        options: [
          "A) 11.43 seconds (40/3.5 s ≈ 11.43s)",
          "B) 15.00 seconds",
          "C) 12.50 seconds",
          "D) 9.80 seconds"
        ],
        correctAnswer: "A) 11.43 seconds (40/3.5 s ≈ 11.43s)",
        explanation: "1. Total distance to cross = Length_1 + Length_2 = 150m + 250m = 400 meters.\n2. Relative speed (opposite directions) = Speed_1 + Speed_2 = 72 + 54 = 126 km/h.\n3. Convert km/h to m/s: 126 × (5 / 18) = 7 × 5 = 35 m/s.\n4. Time to cross = Total Distance / Relative Speed = 400 / 35 = 80 / 7 ≈ 11.43 seconds.",
        formula: "Time = (L₁ + L₂) / [(S₁ + S₂) × (5/18)]"
      },
      {
        id: "quant-4",
        title: "Permutations with Repetitions & Conditions",
        topic: "Permutations & Combinations",
        difficulty: "Medium",
        companies: ["Google", "Meta", "Adobe", "Goldman Sachs"],
        question: "In how many distinct ways can the letters of the word 'ENGINEERING' be arranged such that all 3 'E's are strictly together?",
        options: [
          "A) 15,120 ways",
          "B) 30,240 ways",
          "C) 7,560 ways",
          "D) 45,360 ways"
        ],
        correctAnswer: "A) 15,120 ways",
        explanation: "1. The word 'ENGINEERING' has 11 letters total: 3 E's, 3 N's, 2 G's, 2 I's, 1 R.\n2. Treat all 3 'E's as a single super-block [EEE].\n3. Now we have 9 items to arrange: [EEE], N, N, N, G, G, I, I, R.\n4. Number of permutations of these 9 items (with repeated letters: 3 N's, 2 G's, 2 I's):\nTotal = 9! / (3! × 2! × 2!) = 362,880 / (6 × 2 × 2) = 362,880 / 24 = 15,120 ways.\n5. Since all 3 E's inside [EEE] are identical, internal arrangement is 3! / 3! = 1.\nTotal = 15,120 distinct ways.",
        formula: "Permutations = n! / (p! × q! × r!)"
      },
      {
        id: "quant-5",
        title: "Conditional Probability & Bayes' Rule",
        topic: "Probability",
        difficulty: "Hard",
        companies: ["Google", "Meta", "NVIDIA", "Apple"],
        question: "A rare disease affects 0.1% (1 in 1000) of a population. A diagnostic test is 99% accurate for sick patients (true positive) and has a 2% false positive rate for healthy patients. If a randomly chosen person tests positive, what is the exact probability that they actually have the disease?",
        options: [
          "A) 4.72% (≈ 0.0472)",
          "B) 99.00%",
          "C) 50.00%",
          "D) 12.50%"
        ],
        correctAnswer: "A) 4.72% (≈ 0.0472)",
        explanation: "By Bayes' Theorem:\nP(Disease | Positive) = [P(Positive | Disease) × P(Disease)] / P(Positive)\n• P(Disease) = 0.001\n• P(Healthy) = 0.999\n• P(Positive | Disease) = 0.99\n• P(Positive | Healthy) = 0.02\nTotal P(Positive) = (0.99 × 0.001) + (0.02 × 0.999) = 0.00099 + 0.01998 = 0.02097.\nP(Disease | Positive) = 0.00099 / 0.02097 ≈ 0.0472 = 4.72%.\nEven with a 99% sensitive test, because the base rate is rare, positive results are mostly false positives.",
        formula: "P(A|B) = [P(B|A) × P(A)] / [P(B|A)P(A) + P(B|A')P(A')]"
      },
      {
        id: "quant-6",
        title: "Alligation & Mixture Replacement",
        topic: "Ratios & Mixtures",
        difficulty: "Medium",
        companies: ["Amazon", "TCS", "Accenture", "Infosys"],
        question: "In what ratio should tea at $35 per kg be mixed with tea at $45 per kg so that the resulting blend sold at $46.20 per kg yields a profit of 10%?",
        options: [
          "A) 3 : 7",
          "B) 2 : 5",
          "C) 3 : 4",
          "D) 1 : 2"
        ],
        correctAnswer: "A) 3 : 7",
        explanation: "1. Selling Price (SP) of mixture = $46.20 with 10% profit.\n2. Cost Price (Mean CP) of mixture = SP / (1 + 0.10) = 46.20 / 1.10 = $42 per kg.\n3. Using the Rule of Alligation:\n• Cheaper Price (C) = $35\n• Dearer Price (D) = $45\n• Mean Price (M) = $42\nRatio (Cheaper : Dearer) = (Dearer - Mean) / (Mean - Cheaper)\n= (45 - 42) / (42 - 35) = 3 / 7 = 3 : 7.",
        formula: "Quantity(Cheaper) / Quantity(Dearer) = (D - M) / (M - C)"
      },
      {
        id: "quant-7",
        title: "Difference between CI and SI for 3 Years",
        topic: "Compound Interest",
        difficulty: "Hard",
        companies: ["TCS", "Wipro", "IBM", "Capgemini"],
        question: "The difference between Compound Interest (compounded annually) and Simple Interest on a principal sum P at 10% per annum for 3 years is $155. What is the value of the principal P?",
        options: [
          "A) $5,000",
          "B) $4,500",
          "C) $6,000",
          "D) $5,500"
        ],
        correctAnswer: "A) $5,000",
        explanation: "Standard 3-year difference formula for CI and SI:\nDifference = P × (R / 100)² × [(300 + R) / 100]\nGiven Difference = $155 and R = 10%:\n155 = P × (10 / 100)² × [(300 + 10) / 100]\n155 = P × (1 / 100) × (310 / 100)\n155 = P × (31 / 1000)\nP = (155 × 1000) / 31 = 5 × 1000 = $5,000.",
        formula: "Difference(3 yr) = P × (R/100)² × [(300 + R)/100]"
      },
      {
        id: "quant-8",
        title: "Modular Remainder of Large Exponent",
        topic: "Number Systems",
        difficulty: "Medium",
        companies: ["TCS", "Infosys", "Oracle", "Goldman Sachs"],
        question: "What is the remainder when (35⁶³ + 17) is divided by 36?",
        options: [
          "A) 16",
          "B) 18",
          "C) 1",
          "D) 0"
        ],
        correctAnswer: "A) 16",
        explanation: "1. Express 35 modulo 36: 35 ≡ -1 (mod 36).\n2. 35⁶³ ≡ (-1)⁶³ ≡ -1 (mod 36) (since 63 is an odd exponent).\n3. Add 17: (35⁶³ + 17) ≡ -1 + 17 ≡ 16 (mod 36).\nTherefore, the remainder is 16.",
        formula: "(a - 1)^n ≡ (-1)^n (mod a)"
      }
    ]
  },

  {
    id: "logical-reasoning",
    icon: "🧩",
    category: "Logical Reasoning",
    title: "Logical Reasoning",
    description: "Syllogisms, blood relations, seating arrangements, coding-decoding, series, direction sense, and clock/calendar logic.",
    problemCount: 8,
    formulaCount: 18,
    questions: [
      {
        id: "logic-1",
        title: "Circular Seating Arrangement with Facing In/Out",
        topic: "Seating Arrangement",
        difficulty: "Hard",
        companies: ["Amazon", "Adobe", "Salesforce", "TCS"],
        question: "8 friends (A, B, C, D, E, F, G, H) sit around a circular table. A sits third to the right of B. C sits third to the left of A. D is not an immediate neighbor of B. E sits second to the left of C. G is an immediate neighbor of D. Who sits directly opposite to A?",
        options: [
          "A) E",
          "B) G",
          "C) D",
          "D) H"
        ],
        correctAnswer: "A) E",
        explanation: "1. Label 8 clock positions 1 to 8.\n2. Fix B at position 1 (facing center).\n3. A sits 3rd right of B => A is at position 4.\n4. C sits 3rd left of A => C is at position 1 (wait: 4 - 3 = 1). Since C is distinct from B, C must be 3rd counter-clockwise => Pos 7.\n5. E sits 2nd left of C (Pos 7) => Pos 8 (or Pos 8).\n6. Direct opposite in an 8-person circle is separated by (8/2) = 4 positions.\n7. Opposite to A (Pos 4) is Pos 8 (4 + 4 = 8), which is occupied by E.",
        formula: "Opposite in Circle of N = (Position + N/2) mod N"
      },
      {
        id: "logic-2",
        title: "Syllogisms (Either/Or & Valid Deductions)",
        topic: "Syllogisms",
        difficulty: "Medium",
        companies: ["TCS", "Accenture", "Infosys", "Wipro"],
        question: "Statements:\n1. All developers are problem solvers.\n2. Some problem solvers are musicians.\n3. No musician is an athlete.\nConclusions:\nI. Some problem solvers are not athletes.\nII. No developer is an athlete.\nIII. Some developers are musicians.",
        options: [
          "A) Only Conclusion I follows",
          "B) Both I and II follow",
          "C) Both I and III follow",
          "D) None of the conclusions follow"
        ],
        correctAnswer: "A) Only Conclusion I follows",
        explanation: "• Conclusion I: The problem solvers who are musicians CANNOT be athletes (because no musician is an athlete). Since that subset exists, some problem solvers are definitely not athletes. Conclusion I is 100% valid.\n• Conclusion II: Developers are inside problem solvers, but there is no direct negative relation between developers and athletes (an athlete could be a developer who isn't a musician). Conclusion II does not necessarily follow.\n• Conclusion III: Developers and musicians may or may not overlap within problem solvers. Conclusion III does not necessarily follow.",
        formula: "Some A are B + No B are C => Some A are not C"
      },
      {
        id: "logic-3",
        title: "Coded Blood Relations",
        topic: "Blood Relations",
        difficulty: "Medium",
        companies: ["Infosys", "Accenture", "TCS", "Capgemini"],
        question: "If 'P + Q' means P is the father of Q, 'P - Q' means P is the sister of Q, 'P * Q' means P is the brother of Q, and 'P / Q' means P is the mother of Q, which of the following expressions indicates that 'M is the maternal uncle of N'?",
        options: [
          "A) M * K / N",
          "B) M + K / N",
          "C) M - K * N",
          "D) M / K + N"
        ],
        correctAnswer: "A) M * K / N",
        explanation: "To prove 'M is maternal uncle of N', M must be the brother of N's mother.\n• In option A: 'M * K / N'\n1. 'K / N' means K is the mother of N.\n2. 'M * K' means M is the brother of K.\n3. Since M is the brother of N's mother K, M is the maternal uncle of N.\nOption A is correct.",
        formula: "Maternal Uncle = Brother of Mother => (M * Mother) / N"
      },
      {
        id: "logic-4",
        title: "Calendar Day Determination",
        topic: "Calendars",
        difficulty: "Medium",
        companies: ["TCS", "Wipro", "Infosys", "IBM"],
        question: "If January 1, 2024 was a Monday, what day of the week was January 1, 2025? (Note: 2024 was a leap year).",
        options: [
          "A) Wednesday",
          "B) Tuesday",
          "C) Thursday",
          "D) Monday"
        ],
        correctAnswer: "A) Wednesday",
        explanation: "1. A normal year has 365 days = 52 weeks + 1 odd day.\n2. A leap year has 366 days = 52 weeks + 2 odd days.\n3. The year 2024 is divisible by 4, so it is a leap year with 366 days (includes Feb 29, 2024).\n4. Moving 1 full leap year forward shifts the day of the week by +2 days.\n5. Monday + 2 days = Wednesday.\nTherefore, January 1, 2025 was a Wednesday.",
        formula: "Day Shift = (Total Days mod 7) => 366 mod 7 = +2 days"
      },
      {
        id: "logic-5",
        title: "Clock Hands Straight Line (Opposite Direction)",
        topic: "Clocks",
        difficulty: "Easy",
        companies: ["Infosys", "Wipro", "TCS", "Accenture"],
        question: "At what exact time between 7:00 and 8:00 are the hands of an analog clock pointing in opposite directions (straight line of 180°)?",
        options: [
          "A) 5 ⁵/₁₁ minutes past 7",
          "B) 7 ⁵/₁₁ minutes past 7",
          "C) 10 minutes past 7",
          "D) 4 ⁸/₁₁ minutes past 7"
        ],
        correctAnswer: "A) 5 ⁵/₁₁ minutes past 7",
        explanation: "1. At 7:00, the hour hand is at 7 (35 minute spaces) and the minute hand is at 12 (0 minute spaces).\n2. For opposite directions (180°), they must be 30 minute spaces apart.\n3. The minute hand must gain (35 - 30) = 5 minute spaces over the hour hand.\n4. Relative gain rate of minute hand = 55 spaces in 60 minutes = 12/11 spaces per minute.\n5. Time required = 5 × (12 / 11) = 60 / 11 = 5 ⁵/₁₁ minutes.\nExact time = 7:05:27 (5 ⁵/₁₁ minutes past 7).",
        formula: "Time = (Minute spaces to gain) × (12/11) minutes"
      },
      {
        id: "logic-6",
        title: "Direction Sense Angle Rotations",
        topic: "Direction Sense",
        difficulty: "Easy",
        companies: ["Accenture", "TCS", "Cognizant", "IBM"],
        question: "A man is facing North-West. He turns 90° clockwise, then 180° counter-clockwise, and finally another 90° counter-clockwise. Which direction is he facing now?",
        options: [
          "A) South-East",
          "B) North-East",
          "C) South-West",
          "D) East"
        ],
        correctAnswer: "A) South-East",
        explanation: "1. Net rotation = (+90° CW) + (-180° CCW) + (-90° CCW)\n2. Net rotation = +90° - 180° - 90° = -180° (180° CCW / CW is an exact opposite direction).\n3. The opposite direction of North-West is South-East.\nHe is facing South-East.",
        formula: "Net Angle = Σ(Clockwise) - Σ(Counter-Clockwise). 180° = Opposite Direction."
      },
      {
        id: "logic-7",
        title: "Matrix & Alphabetical Substitution Cipher",
        topic: "Coding-Decoding",
        difficulty: "Medium",
        companies: ["Wipro", "Infosys", "IBM", "TCS"],
        question: "In a corporate security code, 'CIPHER' is encoded as 'FLSKHU'. What is the decoded original word for the ciphertext 'FRPSXWHU'?",
        options: [
          "A) COMPUTER",
          "B) SOFTWARE",
          "C) COMPILER",
          "D) CONSUMER"
        ],
        correctAnswer: "A) COMPUTER",
        explanation: "1. Analyze encryption rule for CIPHER -> FLSKHU:\n• C (+3) = F\n• I (+3) = L\n• P (+3) = S\n• H (+3) = K\n• E (+3) = H\n• R (+3) = U\nThe encryption shifts each character forward by +3.\n2. To decode 'FRPSXWHU', shift each letter backward by -3:\n• F (-3) = C\n• R (-3) = O\n• P (-3) = M\n• S (-3) = P\n• X (-3) = U\n• W (-3) = T\n• H (-3) = E\n• U (-3) = R\nResult: COMPUTER.",
        formula: "Decoded Letter = (Cipher Position - 3) mod 26"
      },
      {
        id: "logic-8",
        title: "Letter & Number Alternating Series",
        topic: "Series & Sequences",
        difficulty: "Easy",
        companies: ["IBM", "Accenture", "TCS", "Wipro"],
        question: "Find the missing alphanumeric term: B2D, D4F, F8H, H16J, ?",
        options: [
          "A) J32L",
          "B) J32K",
          "C) I32L",
          "D) K32M"
        ],
        correctAnswer: "A) J32L",
        explanation: "Break into 3 patterns:\n1. 1st letter: B (+2) = D, D (+2) = F, F (+2) = H, H (+2) = J\n2. Number: 2 (×2) = 4, 4 (×2) = 8, 8 (×2) = 16, 16 (×2) = 32\n3. 2nd letter: D (+2) = F, F (+2) = H, H (+2) = J, J (+2) = L\nCombining terms: J32L.",
        formula: "Letter Pattern: +2 Alphabetical; Number Pattern: 2^n"
      }
    ]
  },

  {
    id: "tech-puzzles",
    icon: "⚡",
    category: "Interview Puzzles",
    title: "Classic Tech Puzzles",
    description: "Famous brain teasers and logical deduction puzzles asked in FAANG & Tier-1 technical interviews.",
    problemCount: 6,
    formulaCount: 12,
    questions: [
      {
        id: "puz-1",
        title: "25 Horses, 5 Tracks, No Stopwatch",
        topic: "Speed & Elimination",
        difficulty: "Hard",
        companies: ["Google", "Microsoft", "Amazon", "Uber"],
        question: "Find the 3 fastest horses out of 25 with a 5-lane track and no timer. What is the minimum number of races?",
        options: [
          "A) 7 races",
          "B) 6 races",
          "C) 8 races",
          "D) 9 races"
        ],
        correctAnswer: "A) 7 races",
        explanation: "1. Divide into 5 groups of 5 -> 5 races.\n2. Race the 5 winners against each other -> Race 6.\n3. The top horse is #1. Top 5 contenders for 2nd and 3rd are A2, A3, B1, B2, C1.\n4. Race these 5 contenders -> Race 7.\nTotal races = 7.",
        formula: "5 Initial + 1 Leader race + 1 Contender race = 7"
      },
      {
        id: "puz-2",
        title: "3 Switches & 3 Light Bulbs in Closed Room",
        topic: "State & Heat Transfer",
        difficulty: "Medium",
        companies: ["Microsoft", "Google", "Adobe", "Apple"],
        question: "You have 3 switches outside a room controlling 3 incandescent bulbs inside. You can only enter the room once. How do you find the matching pairs?",
        options: [
          "A) Turn Switch 1 ON for 10 min, turn it OFF, turn Switch 2 ON, then enter the room",
          "B) Turn Switch 1 and 2 ON and enter immediately",
          "C) Turn Switch 1 ON, enter room, come out and toggle Switch 2",
          "D) Impossible without entering twice"
        ],
        correctAnswer: "A) Turn Switch 1 ON for 10 min, turn it OFF, turn Switch 2 ON, then enter the room",
        explanation: "Bulb lit = Switch 2 (currently ON).\nBulb off but hot = Switch 1 (was ON for 10 minutes).\nBulb off and cold = Switch 3 (never turned ON).",
        formula: "States = [Lit & Warm (Sw2), Dark & Hot (Sw1), Dark & Cold (Sw3)]"
      },
      {
        id: "puz-3",
        title: "1,000 Wine Bottles & 10 Poison Test Mice",
        topic: "Binary Encoding",
        difficulty: "Hard",
        companies: ["Meta", "Google", "Amazon", "Palantir"],
        question: "1 out of 1000 wine bottles is poisoned. Poison kills within 24h. What is the minimum number of mice needed to identify the exact bottle in 24 hours?",
        options: [
          "A) 10 mice",
          "B) 100 mice",
          "C) 50 mice",
          "D) 32 mice"
        ],
        correctAnswer: "A) 10 mice",
        explanation: "2¹⁰ = 1,024 ≥ 1,000. Label each bottle in 10-bit binary. Mouse k drinks from bottles with bit k = 1. The binary vector of dead mice identifies the exact bottle.",
        formula: "Mice = ⌈log₂(N)⌉ = ⌈log₂(1000)⌉ = 10"
      },
      {
        id: "puz-4",
        title: "Burning Ropes (45-Minute Timer)",
        topic: "Non-Uniform Combustion",
        difficulty: "Medium",
        companies: ["Amazon", "Adobe", "Apple", "Goldman Sachs"],
        question: "Two non-uniform ropes each burn for exactly 60 minutes from end to end. How do you measure 45 minutes using only the two ropes and a lighter?",
        options: [
          "A) Light Rope 1 at both ends and Rope 2 at one end simultaneously; when Rope 1 burns out (30m), light the other end of Rope 2",
          "B) Cut Rope 1 in half and burn both halves",
          "C) Fold Rope 2 into 4 equal segments and light one end",
          "D) Light both ends of both ropes simultaneously"
        ],
        correctAnswer: "A) Light Rope 1 at both ends and Rope 2 at one end simultaneously; when Rope 1 burns out (30m), light the other end of Rope 2",
        explanation: "1. Lighting Rope 1 from both ends burns it in 30 minutes.\n2. When Rope 1 extinguishes (30 min mark), exactly 30 minutes of burn time remain on Rope 2.\n3. Lighting the second end of Rope 2 burns the remaining 30 minutes in half the time = 15 minutes.\nTotal elapsed time = 30 + 15 = 45 minutes.",
        formula: "T = (60/2) + ((60 - 30)/2) = 30 + 15 = 45 minutes"
      },
      {
        id: "puz-5",
        title: "2 Eggs & 100 Floors Building",
        topic: "Dynamic Programming & Balancing",
        difficulty: "Hard",
        companies: ["Apple", "Google", "Microsoft", "Bloomberg"],
        question: "Find the threshold floor in a 100-story building using 2 eggs in the minimum worst-case drops.",
        options: [
          "A) 14 drops",
          "B) 10 drops",
          "C) 20 drops",
          "D) 50 drops"
        ],
        correctAnswer: "A) 14 drops",
        explanation: "Solve x + (x-1) + ... + 1 ≥ 100 => x(x+1)/2 ≥ 100 => x = 14.\nDrop from floors 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100.",
        formula: "x(x+1)/2 ≥ N => for N=100, x = 14"
      },
      {
        id: "puz-6",
        title: "River Crossing (Wolf, Goat & Cabbage)",
        topic: "State Space Search",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "TCS", "Infosys"],
        question: "A traveler must cross a river with a wolf, goat, and cabbage. The boat carries traveler + 1 item. Wolf cannot be left with goat, goat cannot be left with cabbage. Minimum trips needed?",
        options: [
          "A) 7 trips",
          "B) 5 trips",
          "C) 6 trips",
          "D) 9 trips"
        ],
        correctAnswer: "A) 7 trips",
        explanation: "1. Take Goat over (Wolf & Cabbage safe).\n2. Return alone.\n3. Take Wolf over.\n4. Bring Goat back.\n5. Take Cabbage over.\n6. Return alone.\n7. Take Goat over.\nTotal = 7 trips.",
        formula: "Transitions = G →, ∅ ←, W →, G ←, C →, ∅ ←, G → (7 trips)"
      }
    ]
  }
];

export default aptitudeTopics;
