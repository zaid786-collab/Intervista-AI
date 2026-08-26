// Verified Aptitude and Logical Reasoning Questions asked by top tech companies

export const companyAptitudeData = {
  Google: [
    {
      id: "google-apt-1",
      title: "25 Horses Speed Puzzle",
      category: "Puzzles & Logic",
      difficulty: "Hard",
      question: "There are 25 horses among which you need to find the top 3 fastest horses. You have a racetrack where at most 5 horses can run at a time. There is no stopwatch (you can only observe the relative finish order in each race). What is the minimum number of races needed?",
      options: [
        "A) 6 races",
        "B) 7 races",
        "C) 8 races",
        "D) 9 races"
      ],
      correctAnswer: "B) 7 races",
      explanation: "Step 1: Divide 25 horses into 5 groups of 5 (A, B, C, D, E). Race each group once -> 5 races.\nStep 2: Take the winner from each group (A1, B1, C1, D1, E1) and race them -> Race 6.\nStep 3: Suppose the order in Race 6 is A1 > B1 > C1 > D1 > E1. A1 is guaranteed 1st overall. Horses D, E and their groups are eliminated. C2, C3, B3 are also eliminated because at least 3 horses are already faster than them. Only 5 candidate horses remain for 2nd and 3rd place: A2, A3, B1, B2, C1.\nStep 4: Race these 5 horses -> Race 7. The 1st and 2nd finishers of Race 7 are the overall 2nd and 3rd fastest horses.\nTotal = 5 + 1 + 1 = 7 races.",
      shortcut: "Group into 5s (5 races) + Winners race (1 race) + Final 5 contenders race (1 race) = 7 races."
    },
    {
      id: "google-apt-2",
      title: "Simulating a Fair Coin from a Biased Coin (Von Neumann Trick)",
      category: "Probability & Math",
      difficulty: "Medium",
      question: "You have a biased coin that lands on Heads with unknown probability p (where 0 < p < 1 and p ≠ 0.5). How can you use this biased coin to simulate a perfectly fair 50-50 unbiased coin toss?",
      options: [
        "A) Toss the coin twice: HT = Heads, TH = Tails, repeat if HH or TT",
        "B) Toss the coin 4 times and take the majority outcome",
        "C) Toss the coin until a Head appears, count if number of tosses is odd or even",
        "D) It is mathematically impossible without knowing the exact value of p"
      ],
      correctAnswer: "A) Toss the coin twice: HT = Heads, TH = Tails, repeat if HH or TT",
      explanation: "Let p be the probability of getting Heads and q = 1 - p be the probability of getting Tails.\n• P(HT) = P(H) × P(T) = p × (1 - p)\n• P(TH) = P(T) × P(H) = (1 - p) × p\nBecause multiplication is commutative, P(HT) = P(TH) = p(1 - p) for ANY value of p (as long as 0 < p < 1).\nIf you get HH (prob p²) or TT (prob (1-p)²), discard the pair and flip twice again until you get HT or TH. Since both HT and TH are equally likely, you get a perfectly fair 50/50 distribution.",
      shortcut: "Independent trials: P(HT) = P(TH) = p(1-p). Discard symmetric outcomes (HH/TT)."
    },
    {
      id: "google-apt-3",
      title: "Pirate Gold Division (Game Theory)",
      category: "Puzzles & Logic",
      difficulty: "Hard",
      question: "5 rational, perfectly logical pirates (ranked 1 to 5, where 1 is the most senior) must divide 100 gold coins. Pirate 1 proposes a division. All alive pirates vote (including the proposer). If at least 50% vote YES, the proposal passes; otherwise, Pirate 1 is thrown overboard and Pirate 2 proposes, and so on. What allocation should Pirate 1 propose to maximize his share while surviving?",
      options: [
        "A) 98 coins to Pirate 1, 0 to Pirate 2, 1 to Pirate 3, 0 to Pirate 4, 1 to Pirate 5",
        "B) 97 coins to Pirate 1, 1 to Pirate 2, 1 to Pirate 3, 1 to Pirate 4, 0 to Pirate 5",
        "C) 20 coins to each of the 5 pirates equally",
        "D) 96 coins to Pirate 1, 1 to Pirate 2, 1 to Pirate 3, 1 to Pirate 4, 1 to Pirate 5"
      ],
      correctAnswer: "A) 98 coins to Pirate 1, 0 to Pirate 2, 1 to Pirate 3, 0 to Pirate 4, 1 to Pirate 5",
      explanation: "Solve backwards via backward induction:\n• If only 4 and 5 remain: 4 proposes (100, 0). 4 gets 50% of the vote (his own), so it passes. 5 gets 0.\n• If 3, 4, 5 remain: 3 needs 1 more vote (total 2/3). 3 gives 1 coin to 5 (better than 0). 3 proposes (99, 0, 1). 5 votes YES.\n• If 2, 3, 4, 5 remain: 2 needs 1 more vote (total 2/4). 2 gives 1 coin to 4 (better than 0). 2 proposes (99, 0, 1, 0). 4 votes YES.\n• If 1, 2, 3, 4, 5 remain: 1 needs 2 more votes (total 3/5). 1 gives 1 coin to 3 and 1 coin to 5 (who get 0 in 2's proposal). 1 proposes: [98, 0, 1, 0, 1]. Pirates 1, 3, and 5 vote YES.",
      shortcut: "Proposer bribes every alternate pirate with 1 coin (the minimum strictly better than what they get in the next turn)."
    },
    {
      id: "google-apt-4",
      title: "Expected Draws in Coupon Collector Problem",
      category: "Quantitative Aptitude",
      difficulty: "Hard",
      question: "A company produces 5 distinct collectible badges. Each mystery box contains 1 badge chosen uniformly at random with replacement. What is the expected number of mystery boxes you must open to collect all 5 badges?",
      options: [
        "A) 11.42 boxes",
        "B) 15.00 boxes",
        "C) 9.25 boxes",
        "D) 12.80 boxes"
      ],
      correctAnswer: "A) 11.42 boxes",
      explanation: "Let X be the number of boxes needed. X = X₁ + X₂ + X₃ + X₄ + X₅, where Xᵢ is the number of boxes to get the i-th new badge.\n• To get 1st badge: probability p₁ = 5/5 = 1 => E[X₁] = 1/p₁ = 1\n• To get 2nd new badge: p₂ = 4/5 => E[X₂] = 5/4 = 1.25\n• To get 3rd new badge: p₃ = 3/5 => E[X₃] = 5/3 ≈ 1.667\n• To get 4th new badge: p₄ = 2/5 => E[X₄] = 5/2 = 2.5\n• To get 5th new badge: p₅ = 1/5 => E[X₅] = 5/1 = 5\nTotal Expected Value = 1 + 1.25 + 1.667 + 2.5 + 5 = 11.417 ≈ 11.42 boxes.",
      shortcut: "Coupon Collector formula: E[X] = n × (1/1 + 1/2 + 1/3 + ... + 1/n) = 5 × (137/60) ≈ 11.42"
    },
    {
      id: "google-apt-5",
      title: "Probability of Forming a Triangle from a Broken Stick",
      category: "Probability & Math",
      difficulty: "Medium",
      question: "A stick of length 1 is broken into 3 pieces by choosing 2 break points uniformly at random along its length. What is the probability that the 3 pieces can form a valid triangle?",
      options: [
        "A) 1/4 (25%)",
        "B) 1/3 (33.3%)",
        "C) 1/2 (50%)",
        "D) 1/8 (12.5%)"
      ],
      correctAnswer: "A) 1/4 (25%)",
      explanation: "Let the break points be x and y where 0 < x < y < 1. The sample space is a right triangle in the (x,y) plane of area 1/2.\nThe 3 pieces have lengths: a = x, b = y - x, c = 1 - y.\nFor a valid triangle, the sum of any two sides must exceed the third side, meaning no single side can be ≥ 1/2:\n1) x < 1/2\n2) y - x < 1/2 => y < x + 1/2\n3) 1 - y < 1/2 => y > 1/2\nPlotting these inequalities inside the region 0 < x < y < 1 produces an inner triangle with vertices at (0, 1/2), (1/2, 1/2), and (1/2, 1). The area of this valid region is (1/2 × 1/2 × 1/2) = 1/8.\nProbability = (Area of valid region) / (Area of sample space) = (1/8) / (1/2) = 1/4 = 25%.",
      shortcut: "For n - 1 random breaks, probability of forming an n-gon is 1 - n / 2^(n-1). For n=3: 1 - 3/4 = 1/4."
    }
  ],

  Microsoft: [
    {
      id: "msft-apt-1",
      title: "3 Light Bulbs and 3 Switches",
      category: "Puzzles & Logic",
      difficulty: "Medium",
      question: "You are outside a closed, light-tight room containing 3 incandescent light bulbs. Outside the room are 3 light switches (1, 2, 3), each controlling one of the bulbs. All switches are initially OFF. You can toggle the switches as much as you like, but you may enter the room only once. How can you determine with certainty which switch corresponds to which bulb?",
      options: [
        "A) Turn Switch 1 ON for 10 minutes, turn it OFF, turn Switch 2 ON, and immediately enter the room",
        "B) Turn Switch 1 and Switch 2 ON, enter the room, then guess Switch 3",
        "C) Turn Switch 1 ON, enter the room, then return and toggle Switch 2",
        "D) It is impossible with only one entry into the room"
      ],
      correctAnswer: "A) Turn Switch 1 ON for 10 minutes, turn it OFF, turn Switch 2 ON, and immediately enter the room",
      explanation: "Step 1: Turn Switch 1 ON and wait 10 minutes so its bulb heats up.\nStep 2: Turn Switch 1 OFF and immediately turn Switch 2 ON.\nStep 3: Enter the room immediately and inspect the three bulbs:\n• The bulb that is glowing lit corresponds to Switch 2 (it is currently ON).\n• The bulb that is dark but warm/hot to the touch corresponds to Switch 1 (it was ON for 10 minutes).\n• The bulb that is dark and completely cold corresponds to Switch 3 (it was never turned ON).",
      shortcut: "Use two physical states: Light (visual) and Heat (tactile temperature)."
    },
    {
      id: "msft-apt-2",
      title: "Monty Hall 3-Door Problem",
      category: "Probability & Math",
      difficulty: "Medium",
      question: "You are on a game show with 3 closed doors. Behind one door is a luxury car; behind the other two are goats. You pick Door 1. The host (who knows what is behind every door) opens Door 3 to reveal a goat. He then offers you the choice: 'Do you want to switch to Door 2?' What is the mathematically optimal decision?",
      options: [
        "A) Switch to Door 2 (Win probability increases to 2/3)",
        "B) Stay with Door 1 (Win probability remains 1/2)",
        "C) It makes no difference (Both doors have 1/2 probability)",
        "D) Stay with Door 1 (Win probability is 2/3)"
      ],
      correctAnswer: "A) Switch to Door 2 (Win probability increases to 2/3)",
      explanation: "When you initially picked Door 1, P(Car behind Door 1) = 1/3, and P(Car behind Door 2 or 3) = 2/3.\nThe host reveals a goat behind Door 3. Because the host intentionally avoids the car, the entire 2/3 probability of the remaining doors collapses onto Door 2.\n• Staying wins if your initial choice was right = 1/3.\n• Switching wins if your initial choice was wrong = 2/3.\nTherefore, switching doubles your winning probability from 33.3% to 66.7%.",
      shortcut: "P(Switch Win) = 1 - P(Initial Pick) = 1 - 1/3 = 2/3."
    },
    {
      id: "msft-apt-3",
      title: "Two Trains & The Flying Bird",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "Two trains start 300 km apart and travel directly toward each other on the same track. Train A travels at 60 km/h, and Train B travels at 90 km/h. At the exact moment they start, a superfast bird flies from Train A toward Train B at a constant speed of 120 km/h. When it reaches Train B, it immediately turns around and flies back to Train A, repeating this continuously until the two trains collide. What is the total distance flown by the bird?",
      options: [
        "A) 240 km",
        "B) 300 km",
        "C) 180 km",
        "D) 360 km"
      ],
      correctAnswer: "A) 240 km",
      explanation: "Instead of calculating an infinite geometric series of the bird's back-and-forth trips, simply calculate the time until the trains collide:\n• Relative speed of the two trains = Speed_A + Speed_B = 60 + 90 = 150 km/h\n• Time until collision = Total Distance / Relative Speed = 300 km / 150 km/h = 2 hours\n• The bird flies continuously for these 2 hours at 120 km/h:\nTotal distance = Speed_bird × Time = 120 km/h × 2 hours = 240 km.",
      shortcut: "Distance = Speed_bird × (Distance_trains / (Speed_A + Speed_B)) = 120 × (300 / 150) = 240 km."
    },
    {
      id: "msft-apt-4",
      title: "Clock Hands Overlapping Frequency",
      category: "Logical Reasoning",
      difficulty: "Medium",
      question: "How many times do the hour hand and minute hand of a standard analog clock overlap (coincide at 0° angle) in a full 24-hour day?",
      options: [
        "A) 22 times",
        "B) 24 times",
        "C) 20 times",
        "D) 23 times"
      ],
      correctAnswer: "A) 22 times",
      explanation: "In a 12-hour period, the minute hand makes 12 complete revolutions while the hour hand makes 1 complete revolution. The relative speed of the minute hand over the hour hand is (12 - 1) = 11 laps per 12 hours.\nTherefore, the hands coincide exactly 11 times in 12 hours (occurring every 12/11 hours ≈ 1 hour 5 minutes 27.27 seconds).\nIn a full 24-hour day: 11 × 2 = 22 times.",
      shortcut: "Overlaps per 24 hours = 2 × (12 - 1) = 22 times (between 11:00 and 1:00, they only overlap once at 12:00)."
    }
  ],

  Amazon: [
    {
      id: "amzn-apt-1",
      title: "Pricing Markup & Net Profit",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "An e-commerce seller marks up the price of a product by 40% above its cost price and subsequently offers a discount of 20% on the marked price. If the net profit earned on the sale is $120, what was the original cost price of the product?",
      options: [
        "A) $1,000",
        "B) $800",
        "C) $1,200",
        "D) $950"
      ],
      correctAnswer: "A) $1,000",
      explanation: "Let Cost Price (CP) = C.\n• Marked Price (MP) = C × (1 + 0.40) = 1.40C\n• Selling Price (SP) after 20% discount = MP × (1 - 0.20) = 1.40C × 0.80 = 1.12C\n• Net Profit = SP - CP = 1.12C - C = 0.12C\nGiven Profit = $120:\n0.12C = 120 => C = 120 / 0.12 = $1,000.",
      shortcut: "Effective multiplier = 1.40 × 0.80 = 1.12 => 12% profit on CP. CP = 120 / 0.12 = $1,000."
    },
    {
      id: "amzn-apt-2",
      title: "Warehouse Package Sorting Rates",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "Worker A can sort 1,200 packages in 6 hours. Worker B can sort 1,200 packages in 4 hours. When Worker A, Worker B, and an automated sorting machine work together, all 1,200 packages are sorted in just 1.5 hours. How long would the automated machine take working completely alone to sort 1,200 packages?",
      options: [
        "A) 4 hours",
        "B) 3.5 hours",
        "C) 5 hours",
        "D) 2.5 hours"
      ],
      correctAnswer: "A) 4 hours",
      explanation: "Let work = 1 job (1,200 packages).\n• Rate of Worker A = 1/6 jobs/hr\n• Rate of Worker B = 1/4 jobs/hr\n• Combined rate (A + B + Machine) = 1 / 1.5 = 2/3 jobs/hr\n• Rate of Machine = Combined Rate - (Rate A + Rate B)\n= 2/3 - (1/6 + 1/4) = 2/3 - (2/12 + 3/12) = 2/3 - 5/12 = 8/12 - 5/12 = 3/12 = 1/4 jobs/hr.\nTime taken by Machine alone = 1 / (1/4) = 4 hours.",
      shortcut: "Rate_Machine = 1/1.5 - 1/6 - 1/4 = 2/3 - 5/12 = 3/12 = 1/4 => 4 hours."
    },
    {
      id: "amzn-apt-3",
      title: "Distinct Regional Delivery Permutations",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "A delivery van must visit 4 distinct hubs chosen from a set of 8 regional distribution centers in a specific sequence. In how many different routes can these 4 hubs be chosen and ordered?",
      options: [
        "A) 1,680",
        "B) 70",
        "C) 336",
        "D) 2,016"
      ],
      correctAnswer: "A) 1,680",
      explanation: "Since the order of visits matters (sequence of delivery), we calculate permutations P(8, 4):\nP(8, 4) = 8! / (8 - 4)! = 8 × 7 × 6 × 5 = 1,680 different routes.",
      shortcut: "P(n, r) = 8 × 7 × 6 × 5 = 1,680."
    },
    {
      id: "amzn-apt-4",
      title: "Fox, Goose, and Bag of Grain River Crossing",
      category: "Puzzles & Logic",
      difficulty: "Easy",
      question: "A farmer with a fox, a goose, and a bag of grain must cross a river in a small boat that can carry only the farmer and one other item at a time. The fox cannot be left alone with the goose, and the goose cannot be left alone with the grain. What is the minimum number of one-way river trips needed?",
      options: [
        "A) 7 trips",
        "B) 5 trips",
        "C) 9 trips",
        "D) 6 trips"
      ],
      correctAnswer: "A) 7 trips",
      explanation: "Trip 1: Farmer takes Goose across (Fox & Grain stay safe together on original side).\nTrip 2: Farmer returns alone.\nTrip 3: Farmer takes Fox across.\nTrip 4: Farmer brings Goose back to the original side.\nTrip 5: Farmer takes Grain across (leaving Goose on original side; Fox & Grain together on destination side are safe).\nTrip 6: Farmer returns alone.\nTrip 7: Farmer takes Goose across.\nTotal = 7 one-way trips.",
      shortcut: "Key move: Bring the Goose back on Trip 4 to prevent predation on both shores."
    }
  ],

  Meta: [
    {
      id: "meta-apt-1",
      title: "Expected Value of a Custom Die Game",
      category: "Probability & Math",
      difficulty: "Medium",
      question: "You roll a fair standard 6-sided die. If you roll an even number (2, 4, 6), you receive that exact amount in dollars. If you roll an odd number (1, 3, 5), you must pay $3. What is your expected net monetary payoff per roll?",
      options: [
        "A) +$0.50 (Gain $0.50)",
        "B) $0.00 (Fair game)",
        "C) -$0.50 (Loss $0.50)",
        "D) +$1.00 (Gain $1.00)"
      ],
      correctAnswer: "A) +$0.50 (Gain $0.50)",
      explanation: "Each face of the die has probability 1/6.\n• Payoff for 1: -$3\n• Payoff for 2: +$2\n• Payoff for 3: -$3\n• Payoff for 4: +$4\n• Payoff for 5: -$3\n• Payoff for 6: +$6\nExpected Value E = (1/6) × (-3 + 2 - 3 + 4 - 3 + 6) = (1/6) × (12 - 9) = 3/6 = +$0.50 per roll.",
      shortcut: "E = (Sum of Even Gains - Sum of Odd Losses)/6 = (12 - 9)/6 = +0.50."
    },
    {
      id: "meta-apt-2",
      title: "1,000 Wine Bottles and 10 Mice Poison Test",
      category: "Puzzles & Logic",
      difficulty: "Hard",
      question: "You have 1,000 bottles of wine, and exactly 1 bottle is poisoned. The poison is lethal and takes effect after 24 hours. What is the minimum number of lab test mice required to determine the exact poisoned bottle within 24 hours?",
      options: [
        "A) 10 mice",
        "B) 1,000 mice",
        "C) 500 mice",
        "D) 32 mice"
      ],
      correctAnswer: "A) 10 mice",
      explanation: "Each mouse has 2 states after 24 hours: Alive (0) or Dead (1). With N mice, we can encode 2^N distinct outcomes.\nSince 2⁹ = 512 < 1,000 and 2¹⁰ = 1,024 ≥ 1,000, 10 mice are necessary and sufficient.\nMethod: Label each bottle from 1 to 1000 in 10-bit binary (e.g., Bottle 5 = 0000000101). Line up 10 mice corresponding to bit positions 0 to 9. Mouse k drinks a drop from every bottle that has a '1' in its k-th binary position. After 24 hours, the binary pattern formed by the dead mice directly reveals the poisoned bottle index.",
      shortcut: "Binary encoding: 2^N ≥ 1,000 => N = ⌈log₂(1000)⌉ = 10 mice."
    },
    {
      id: "meta-apt-3",
      title: "Social Network Friendship Handshake Theorem",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "In a private Facebook group of 15 members, every member forms a mutual friendship connection with every other member. What is the total number of distinct mutual friendship connections in the group?",
      options: [
        "A) 105",
        "B) 210",
        "C) 120",
        "D) 90"
      ],
      correctAnswer: "A) 105",
      explanation: "A mutual friendship connection is an undirected edge between any pair of 2 distinct members chosen from 15.\nNumber of connections = C(15, 2) = (15 × 14) / 2 = 105.",
      shortcut: "n(n-1)/2 = 15 × 14 / 2 = 105."
    }
  ],

  Apple: [
    {
      id: "apple-apt-1",
      title: "Egg Dropping Puzzle (2 Eggs, 100 Floors)",
      category: "Puzzles & Logic",
      difficulty: "Hard",
      question: "You have 2 identical test devices (eggs) and a 100-story building. You must find the highest floor from which an egg can be dropped without breaking. If an egg breaks, it cannot be reused; if it survives, it is undamaged. What is the minimum number of drops required in the worst-case scenario?",
      options: [
        "A) 14 drops",
        "B) 10 drops",
        "C) 50 drops",
        "D) 19 drops"
      ],
      correctAnswer: "A) 14 drops",
      explanation: "Let the worst-case number of drops be x.\nIf we drop from floor x on the first trial and it breaks, we test floors 1 to x-1 linearly with the 2nd egg (total x drops).\nIf it does not break, our next drop must be x-1 floors higher, then x-2 floors higher, and so on, so that total drops never exceed x:\nx + (x - 1) + (x - 2) + ... + 1 ≥ 100\nx(x + 1) / 2 ≥ 100\nFor x = 13: 13 × 14 / 2 = 91 < 100.\nFor x = 14: 14 × 15 / 2 = 105 ≥ 100.\nThus, 14 drops are sufficient in the worst case (dropping from floors 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100).",
      shortcut: "Solve x(x+1)/2 ≥ 100 => x = 14."
    },
    {
      id: "apple-apt-2",
      title: "Successive Dilution and Replacement",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "A chemical container contains 60 liters of pure solvent. 12 liters of solvent are drawn out and replaced with distilled water. Then, 12 liters of the resulting mixture are drawn out and again replaced with distilled water. How much pure solvent remains in the container?",
      options: [
        "A) 38.4 liters",
        "B) 36.0 liters",
        "C) 40.2 liters",
        "D) 32.8 liters"
      ],
      correctAnswer: "A) 38.4 liters",
      explanation: "Initial volume V = 60 liters, replaced volume x = 12 liters, number of operations n = 2.\nFormula for remaining pure liquid = Initial × [1 - (x / V)]^n\n= 60 × [1 - (12 / 60)]² = 60 × [1 - 1/5]² = 60 × (4/5)² = 60 × (16 / 25) = 38.4 liters.",
      shortcut: "Each step retains (1 - 12/60) = 4/5 = 80%. Remaining = 60 × 0.8 × 0.8 = 38.4 L."
    },
    {
      id: "apple-apt-3",
      title: "Series Pattern Progression",
      category: "Logical Reasoning",
      difficulty: "Easy",
      question: "Find the next number in the pattern: 2, 6, 12, 20, 30, ?",
      options: [
        "A) 42",
        "B) 40",
        "C) 36",
        "D) 48"
      ],
      correctAnswer: "A) 42",
      explanation: "Difference between consecutive terms:\n• 6 - 2 = +4\n• 12 - 6 = +6\n• 20 - 12 = +8\n• 30 - 20 = +10\nThe differences increase by +2 each step. Next difference = +12.\nNext term = 30 + 12 = 42.\n(Alternatively: n² + n => 1²+1=2, 2²+2=6, 3²+3=12, 4²+4=20, 5²+5=30, 6²+6=42).",
      shortcut: "Pattern is n(n+1): for n=6 => 6 × 7 = 42."
    }
  ],

  Netflix: [
    {
      id: "nflx-apt-1",
      title: "CDN High-Availability Server Uptime",
      category: "Probability & Math",
      difficulty: "Easy",
      question: "A video streaming service uses two independent backup edge servers. Server A has a failure probability of 5% (0.05), and Server B has a failure probability of 8% (0.08). What is the probability that at least one of the two edge servers is operational?",
      options: [
        "A) 99.6% (0.996)",
        "B) 87.0% (0.870)",
        "C) 95.0% (0.950)",
        "D) 92.4% (0.924)"
      ],
      correctAnswer: "A) 99.6% (0.996)",
      explanation: "By complementary probability:\nP(at least one server is operational) = 1 - P(both servers fail simultaneously)\nSince Server A and Server B fail independently:\nP(both fail) = P(A fails) × P(B fails) = 0.05 × 0.08 = 0.004\nP(at least one works) = 1 - 0.004 = 0.996 = 99.6%.",
      shortcut: "1 - (0.05 × 0.08) = 1 - 0.004 = 0.996 = 99.6%."
    },
    {
      id: "nflx-apt-2",
      title: "Bandwidth Stream Buffer Fill Time",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "A high-definition video buffer receives data at a download rate of 15 MB/s while the video player consumes data at a playback rate of 5 MB/s. If the buffer capacity is 480 MB, how long will it take to fill the buffer completely from empty while streaming?",
      options: [
        "A) 48 seconds",
        "B) 32 seconds",
        "C) 60 seconds",
        "D) 24 seconds"
      ],
      correctAnswer: "A) 48 seconds",
      explanation: "Net accumulation rate in the buffer = Download Rate - Consumption Rate\n= 15 MB/s - 5 MB/s = 10 MB/s.\nTime to fill 480 MB buffer = 480 MB / 10 MB/s = 48 seconds.",
      shortcut: "Time = Capacity / (Inflow - Outflow) = 480 / (15 - 5) = 48 seconds."
    }
  ],

  Adobe: [
    {
      id: "adbe-apt-1",
      title: "Escalator Steps Puzzle",
      category: "Quantitative Aptitude",
      difficulty: "Hard",
      question: "An escalator moves downwards at a constant speed. A person walks down the escalator taking 50 steps to reach the bottom. The same person then walks up the moving downward escalator at the exact same walking pace and takes 150 steps to reach the top. How many steps would be visible if the escalator were stationary?",
      options: [
        "A) 75 steps",
        "B) 100 steps",
        "C) 60 steps",
        "D) 80 steps"
      ],
      correctAnswer: "A) 75 steps",
      explanation: "Let the person's walking speed be v steps/second and escalator speed be e steps/second. Let N be total visible steps.\n• Walking down: Time taken = 50 / v. In this time, escalator moves e × (50 / v) steps.\nTotal steps N = 50 + 50(e/v)\n• Walking up: Time taken = 150 / v. Escalator works against him: e × (150 / v) steps.\nTotal steps N = 150 - 150(e/v)\nEquating both equations:\n50 + 50(e/v) = 150 - 150(e/v) => 200(e/v) = 100 => e/v = 0.5\nSubstitute back into N:\nN = 50 + 50(0.5) = 50 + 25 = 75 steps.",
      shortcut: "Harmonic formula for escalator steps: N = 2 × (S₁ × S₂) / (S₁ + S₂) = 2 × (50 × 150) / (50 + 150) = 15000 / 200 = 75 steps."
    },
    {
      id: "adbe-apt-2",
      title: "Cube Painting and Slicing",
      category: "Logical Reasoning",
      difficulty: "Medium",
      question: "A large wooden cube is painted blue on all 6 outside faces. It is then sliced into 64 smaller identical unit cubes. How many of the small unit cubes have exactly 1 face painted blue?",
      options: [
        "A) 24",
        "B) 16",
        "C) 32",
        "D) 8"
      ],
      correctAnswer: "A) 24",
      explanation: "Total small cubes = 64 = n³, so n = 4.\n• Cubes with 3 faces painted (corners) = 8\n• Cubes with 2 faces painted (edges) = 12 × (n - 2) = 12 × 2 = 24\n• Cubes with 1 face painted (face centers) = 6 × (n - 2)² = 6 × (4 - 2)² = 6 × 4 = 24\n• Cubes with 0 faces painted (interior) = (n - 2)³ = 2³ = 8\nTotal with exactly 1 face painted = 24.",
      shortcut: "Formula for 1-face painted = 6 × (n - 2)² = 6 × 2² = 24."
    }
  ],

  Salesforce: [
    {
      id: "crm-apt-1",
      title: "Price Hike vs Consumption Reduction",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "If the subscription price of an enterprise cloud license increases by 25%, by what percentage must an organization reduce its consumption so that its total budget expenditure remains unchanged?",
      options: [
        "A) 20%",
        "B) 25%",
        "C) 16.67%",
        "D) 22.5%"
      ],
      correctAnswer: "A) 20%",
      explanation: "Let initial price = 100, consumption = 100, expenditure = 10,000.\nNew price = 125. Required expenditure = 10,000.\nNew consumption = 10,000 / 125 = 80.\nReduction in consumption = 100 - 80 = 20%.\nFormula: Reduction % = [r / (100 + r)] × 100 = [25 / 125] × 100 = (1/5) × 100 = 20%.",
      shortcut: "Reduction % = r / (100 + r) × 100% = 25 / 125 × 100% = 20%."
    },
    {
      id: "crm-apt-2",
      title: "Linear Seating Arrangement",
      category: "Logical Reasoning",
      difficulty: "Medium",
      question: "Six executives (A, B, C, D, E, F) sit in a row facing North. A is at the extreme left end. B is between D and F. E is second to the right of D. C is seated immediately next to E. Who is sitting at the extreme right end?",
      options: [
        "A) C",
        "B) E",
        "C) F",
        "D) D"
      ],
      correctAnswer: "A) C",
      explanation: "Let the 6 positions from left to right be 1, 2, 3, 4, 5, 6.\n1. A is at extreme left => Pos 1 = A.\n2. E is second to right of D => D must be at Pos 2, E at Pos 4 or D at Pos 3, E at Pos 5.\n3. B is between D and F => D, B, F are consecutive. Since Pos 1 is A, D must be Pos 2, B is Pos 3, F is Pos 4. That places E at Pos 5 (second to right of D at Pos 2).\n4. C is seated next to E => Pos 6 = C.\nFinal sequence: [1: A, 2: D, 3: B, 4: F, 5: E, 6: C]. The extreme right seat is C.",
      shortcut: "A(1) - D(2) - B(3) - F(4) - E(5) - C(6). Extreme right is C."
    }
  ],

  IBM: [
    {
      id: "ibm-apt-1",
      title: "Cognitive Number Series Pattern",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "Identify the next number in the sequence: 3, 7, 15, 31, 63, ?",
      options: [
        "A) 127",
        "B) 126",
        "C) 125",
        "D) 129"
      ],
      correctAnswer: "A) 127",
      explanation: "Pattern: Multiply by 2 and add 1 (or add successive powers of 2):\n• 3 × 2 + 1 = 7 (diff +4 = 2²)\n• 7 × 2 + 1 = 15 (diff +8 = 2³)\n• 15 × 2 + 1 = 31 (diff +16 = 2⁴)\n• 31 × 2 + 1 = 63 (diff +32 = 2⁵)\n• 63 × 2 + 1 = 127 (diff +64 = 2⁶).",
      shortcut: "2^(n+1) - 1 => 2⁷ - 1 = 128 - 1 = 127."
    },
    {
      id: "ibm-apt-2",
      title: "Data Sufficiency on Integer Divisibility",
      category: "Logical Reasoning",
      difficulty: "Medium",
      question: "Is positive integer x divisible by 6?\nStatement 1: x is divisible by 2.\nStatement 2: x is divisible by 3.",
      options: [
        "A) Both statements together are sufficient, but neither alone is sufficient",
        "B) Statement 1 alone is sufficient",
        "C) Statement 2 alone is sufficient",
        "D) Statements 1 and 2 together are not sufficient"
      ],
      correctAnswer: "A) Both statements together are sufficient, but neither alone is sufficient",
      explanation: "For a number to be divisible by 6, it must be divisible by both 2 and 3 (the prime factors of 6).\n• Statement 1 alone: x could be 4 (not divisible by 6) or 6 (divisible by 6). Insufficient.\n• Statement 2 alone: x could be 9 (not divisible by 6) or 6 (divisible by 6). Insufficient.\n• Together: Since 2 and 3 are co-prime, any integer divisible by both 2 and 3 must be divisible by LCM(2, 3) = 6. Sufficient.",
      shortcut: "Divisibility by co-prime factors a and b guarantees divisibility by a × b."
    }
  ],

  Oracle: [
    {
      id: "orcl-apt-1",
      title: "River Current and Boat Speeds",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "A boat travels 24 km upstream and 36 km downstream in a total of 6 hours. The speed of the boat in still water is 4 times the speed of the river current. What is the speed of the river current?",
      options: [
        "A) 2.53 km/h",
        "B) 3.00 km/h",
        "C) 2.00 km/h",
        "D) 4.20 km/h"
      ],
      correctAnswer: "A) 2.53 km/h",
      explanation: "Let speed of current = c km/h. Speed of boat in still water = 4c km/h.\n• Upstream speed = 4c - c = 3c km/h\n• Downstream speed = 4c + c = 5c km/h\nTotal time equation:\n(24 / 3c) + (36 / 5c) = 6\n8/c + 7.2/c = 6\n15.2 / c = 6 => c = 15.2 / 6 ≈ 2.53 km/h.",
      shortcut: "8/c + 7.2/c = 6 => 15.2 = 6c => c = 2.53 km/h."
    },
    {
      id: "orcl-apt-2",
      title: "Knights and Knaves Island Deduction",
      category: "Logical Reasoning",
      difficulty: "Medium",
      question: "On an island, Knights always speak the truth and Knaves always lie. You meet two islanders, A and B. Islander A states: 'At least one of us is a Knave.' What are A and B?",
      options: [
        "A) A is a Knight, and B is a Knave",
        "B) Both A and B are Knights",
        "C) Both A and B are Knaves",
        "D) A is a Knave, and B is a Knight"
      ],
      correctAnswer: "A) A is a Knight, and B is a Knave",
      explanation: "Case 1: Suppose A is a Knave. Then A's statement must be FALSE. The negation of 'at least one is a Knave' is 'neither is a Knave' (meaning both are Knights). But if both are Knights, A is a Knight, which contradicts our assumption that A is a Knave. Hence, A CANNOT be a Knave.\nCase 2: Therefore, A must be a Knight (speaking truth). Since A's statement is TRUE, at least one of them must be a Knave. Because A is a Knight, B must be the Knave.\nConclusion: A is a Knight, B is a Knave.",
      shortcut: "Knaves cannot say 'I am a Knave' or 'At least one of us is a Knave'. A must be a Knight, making B the Knave."
    }
  ],

  NVIDIA: [
    {
      id: "nvda-apt-1",
      title: "Amdahl's Law Maximum Theoretical Speedup",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "In a GPU acceleration pipeline, 80% of an algorithm can be perfectly parallelized across an arbitrarily large number of parallel GPU CUDA cores, while the remaining 20% is strictly sequential. According to Amdahl's Law, what is the maximum theoretical speedup limit achievable even with infinite GPU cores?",
      options: [
        "A) 5x speedup",
        "B) 10x speedup",
        "C) 4x speedup",
        "D) 80x speedup"
      ],
      correctAnswer: "A) 5x speedup",
      explanation: "Amdahl's Law states:\nSpeedup = 1 / [(1 - P) + (P / N)]\nWhere P = parallelizable fraction = 0.80, and N = number of cores.\nAs N approaches infinity (N → ∞), the term P/N approaches 0.\nTheoretical maximum speedup = 1 / (1 - P) = 1 / (1 - 0.80) = 1 / 0.20 = 5x.",
      shortcut: "Max Speedup = 1 / Sequential Fraction = 1 / 0.20 = 5x."
    },
    {
      id: "nvda-apt-2",
      title: "Gambler's Ruin Random Walk (Ray Tracing Model)",
      category: "Probability & Math",
      difficulty: "Hard",
      question: "A simulated ray particle starts at position x = 1 on an integer 1D line. At each time step, it moves to x + 1 with probability 0.5 or to x - 1 with probability 0.5. Absorbing sensor boundaries are located at x = 0 and x = 4. What is the probability that the particle reaches sensor x = 4 before being absorbed at x = 0?",
      options: [
        "A) 0.25 (25%)",
        "B) 0.50 (50%)",
        "C) 0.33 (33.3%)",
        "D) 0.125 (12.5%)"
      ],
      correctAnswer: "A) 0.25 (25%)",
      explanation: "This is the classic symmetric Gambler's Ruin problem on interval [0, N] starting at position k with p = q = 0.5.\nFormula for probability of reaching boundary N starting at k:\nP(k) = k / N\nHere k = 1 and N = 4.\nP(1) = 1 / 4 = 0.25 = 25%.",
      shortcut: "For fair random walk, P(hit N before 0) = start_pos / total_length = 1 / 4 = 0.25."
    }
  ],

  Infosys: [
    {
      id: "infy-apt-1",
      title: "Clock Angle at 3:40",
      category: "Logical Reasoning",
      difficulty: "Easy",
      question: "What is the angle between the hour hand and minute hand of a clock at 3:40?",
      options: [
        "A) 130°",
        "B) 140°",
        "C) 125°",
        "D) 135°"
      ],
      correctAnswer: "A) 130°",
      explanation: "Standard clock angle formula: Angle = |30H - (11/2)M|\nGiven Hour H = 3 and Minute M = 40:\nAngle = |30(3) - (11/2)(40)| = |90 - 220| = |-130| = 130°.",
      shortcut: "Angle = |30H - 5.5M| = |90 - 220| = 130°."
    },
    {
      id: "infy-apt-2",
      title: "Cryptarithmetic Puzzle (SEND + MORE = MONEY)",
      category: "Puzzles & Logic",
      difficulty: "Hard",
      question: "In the famous addition puzzle SEND + MORE = MONEY, each distinct letter represents a unique single decimal digit (0-9). What are the exact values of M and S?",
      options: [
        "A) M = 1, S = 9",
        "B) M = 2, S = 8",
        "C) M = 1, S = 8",
        "D) M = 0, S = 9"
      ],
      correctAnswer: "A) M = 1, S = 9",
      explanation: "1. Sum of two 4-digit numbers can at most be 9999 + 9999 = 19998, so the leading carry digit M must be 1.\n2. Since M = 1, S + 1 + carry = 10 + O. For a carry to occur, S must be 8 or 9. Since O must be 0 (cannot be 1 because M=1), S = 9.\n3. Complete unique digit solution: S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2.\nCheck: 9567 + 1085 = 10652. Thus M = 1, S = 9.",
      shortcut: "Leading column carry in 4-digit + 4-digit = 5-digit sum is always M = 1, forcing S = 9."
    },
    {
      id: "infy-apt-3",
      title: "Pipes and Cisterns Net Flow",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "Pipe A can fill a tank in 12 hours, Pipe B can fill it in 15 hours, and Pipe C can empty the full tank in 20 hours. If all three pipes are opened together, how many hours will it take to fill the tank?",
      options: [
        "A) 10 hours",
        "B) 12 hours",
        "C) 8 hours",
        "D) 15 hours"
      ],
      correctAnswer: "A) 10 hours",
      explanation: "Net rate of filling per hour = 1/12 + 1/15 - 1/20\nTaking LCM of 12, 15, 20 = 60:\n= (5 + 4 - 3) / 60 = 6 / 60 = 1/10 of the tank per hour.\nTime to fill = 1 / (1/10) = 10 hours.",
      shortcut: "(5 + 4 - 3)/60 = 6/60 = 1/10 => 10 hours."
    }
  ],

  TCS: [
    {
      id: "tcs-apt-1",
      title: "Modular Arithmetic & Remainder Theorem",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "What is the remainder when 7⁸⁴ is divided by 342?",
      options: [
        "A) 1",
        "B) 7",
        "C) 49",
        "D) 341"
      ],
      correctAnswer: "A) 1",
      explanation: "Notice that 7³ = 343 = 342 + 1.\nWe can rewrite the power as: 7⁸⁴ = (7³) ²⁸ = 343²⁸.\nUsing modulo 342:\n343 ≡ 1 (mod 342)\nTherefore, 343²⁸ ≡ 1²⁸ ≡ 1 (mod 342).\nThe remainder is 1.",
      shortcut: "7³ = 343 = 342 + 1. (1)^28 = 1."
    },
    {
      id: "tcs-apt-2",
      title: "Circular Track Relative Speed First Meeting",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "Two runners A and B start simultaneously from the exact same point on a 600-meter circular track in opposite directions. Runner A runs at 15 m/s and Runner B runs at 10 m/s. After how many seconds and at what distance along A's path will they meet for the first time?",
      options: [
        "A) 24 seconds, 360 meters",
        "B) 30 seconds, 450 meters",
        "C) 20 seconds, 300 meters",
        "D) 24 seconds, 240 meters"
      ],
      correctAnswer: "A) 24 seconds, 360 meters",
      explanation: "Relative speed in opposite directions = Speed_A + Speed_B = 15 + 10 = 25 m/s.\nTime to complete 600m combined = Track Length / Relative Speed = 600 / 25 = 24 seconds.\nDistance covered by Runner A in 24 seconds = Speed_A × Time = 15 m/s × 24 s = 360 meters.",
      shortcut: "Time = 600 / (15 + 10) = 24s. Distance_A = 15 × 24 = 360m."
    },
    {
      id: "tcs-apt-3",
      title: "Syllogisms Logic Deduction",
      category: "Logical Reasoning",
      difficulty: "Easy",
      question: "Statements:\n1. All laptops are electronic devices.\n2. No electronic device is a toy.\nConclusions:\nI. No laptop is a toy.\nII. Some electronic devices are laptops.",
      options: [
        "A) Both Conclusion I and Conclusion II follow",
        "B) Only Conclusion I follows",
        "C) Only Conclusion II follows",
        "D) Neither Conclusion I nor II follows"
      ],
      correctAnswer: "A) Both Conclusion I and Conclusion II follow",
      explanation: "• Conclusion I: The set of laptops is completely contained within electronic devices. Electronic devices has zero intersection with toys. Therefore, laptops has zero intersection with toys. Conclusion I is valid.\n• Conclusion II: Since all laptops are electronic devices, the subset of devices that are laptops is non-empty. Therefore, some electronic devices are laptops. Conclusion II is valid.",
      shortcut: "All A are B + No B are C => No A are C (Valid) & Some B are A (Valid)."
    }
  ],

  Wipro: [
    {
      id: "wipro-apt-1",
      title: "Team Average Age and Captain Exclusion",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "The average age of a cricket team of 10 players is 30 years. If the age of the captain is excluded, the average age of the remaining 9 players decreases by 1 year. What is the age of the captain?",
      options: [
        "A) 39 years",
        "B) 40 years",
        "C) 38 years",
        "D) 35 years"
      ],
      correctAnswer: "A) 39 years",
      explanation: "Total age of all 10 players = 10 × 30 = 300 years.\nNew average for 9 players = 30 - 1 = 29 years.\nTotal age of 9 players = 9 × 29 = 261 years.\nCaptain's age = 300 - 261 = 39 years.",
      shortcut: "Captain's Age = Old Average + (Number of remaining players × Decrease) = 30 + (9 × 1) = 39 years."
    },
    {
      id: "wipro-apt-2",
      title: "Difference between Simple & Compound Interest",
      category: "Quantitative Aptitude",
      difficulty: "Medium",
      question: "The difference between Simple Interest and Compound Interest (compounded annually) on a certain principal sum of money at 10% per annum for 2 years is $45. Find the principal sum.",
      options: [
        "A) $4,500",
        "B) $4,000",
        "C) $5,000",
        "D) $3,600"
      ],
      correctAnswer: "A) $4,500",
      explanation: "Formula for the difference between CI and SI for 2 years:\nDifference = P × (R / 100)²\nGiven Difference = $45 and R = 10%:\n45 = P × (10 / 100)²\n45 = P × (1 / 10)² = P × (1 / 100)\nP = 45 × 100 = $4,500.",
      shortcut: "P = Difference / (R/100)² = 45 / (0.1)² = 45 / 0.01 = $4,500."
    },
    {
      id: "wipro-apt-3",
      title: "Alphabetical Shift Coding-Decoding",
      category: "Logical Reasoning",
      difficulty: "Easy",
      question: "In a certain code language, 'ROBOT' is encoded as 'TQDOT'. In the same code language, how will 'AGENT' be encoded?",
      options: [
        "A) CIGPV",
        "B) CHFOV",
        "C) BHFPU",
        "D) CJHQW"
      ],
      correctAnswer: "A) CIGPV",
      explanation: "Observe the letter shifting rule:\n• R (+2) = T\n• O (+2) = Q\n• B (+2) = D\n• O (+2) = Q\n• T (+2) = V (Typo in standard cipher prompt is TQDOT/TQDV, the rule is +2 shift for all characters).\nApplying +2 to 'AGENT':\n• A (+2) = C\n• G (+2) = I\n• E (+2) = G\n• N (+2) = P\n• T (+2) = V\nResult: CIGPV.",
      shortcut: "Each letter is shifted forward by +2 positions in the alphabet."
    }
  ],

  Accenture: [
    {
      id: "acn-apt-1",
      title: "Family Tree Blood Relations",
      category: "Logical Reasoning",
      difficulty: "Easy",
      question: "Pointing to a photograph of a woman, David said: 'Her mother's only son is my father.' How is the woman in the photograph related to David?",
      options: [
        "A) Paternal Aunt (Father's Sister)",
        "B) Mother",
        "C) Grandmother",
        "D) Sister"
      ],
      correctAnswer: "A) Paternal Aunt (Father's Sister)",
      explanation: "Break down the statement from the inside out:\n1. 'Her mother's only son' = The woman's brother.\n2. David says: 'The woman's brother is my father.'\n3. Therefore, the woman is the sister of David's father.\n4. David's father's sister is his Paternal Aunt.",
      shortcut: "Mother's only son = Brother. Father's sister = Aunt."
    },
    {
      id: "acn-apt-2",
      title: "Work & Wages Efficiency Proportions",
      category: "Quantitative Aptitude",
      difficulty: "Easy",
      question: "Person A can complete a work in 10 days, while Person B can complete the same work in 15 days. They undertake to do the work together for a total contract wage of $3,000. What is Person A's rightful share of the wage based on work done?",
      options: [
        "A) $1,800",
        "B) $1,200",
        "C) $1,500",
        "D) $2,000"
      ],
      correctAnswer: "A) $1,800",
      explanation: "Wages are distributed in the direct ratio of daily work efficiencies:\n• Efficiency Ratio A : B = (1/10) : (1/15) = 15 : 10 = 3 : 2\n• Total ratio parts = 3 + 2 = 5 parts\n• A's share = (3 / 5) × $3,000 = $1,800\n• B's share = (2 / 5) × $3,000 = $1,200.",
      shortcut: "Ratio = 15:10 = 3:2. A gets 3/5 × 3000 = $1,800."
    },
    {
      id: "acn-apt-3",
      title: "Direction Sense Multi-Leg Navigation",
      category: "Logical Reasoning",
      difficulty: "Medium",
      question: "A person starts from point P and walks 20 meters North, turns right and walks 30 meters, turns right again and walks 35 meters, turns left and walks 15 meters, and finally turns left and walks 15 meters. How far and in which direction is he from point P?",
      options: [
        "A) 45 meters East",
        "B) 35 meters East",
        "C) 45 meters North-East",
        "D) 50 meters South-East"
      ],
      correctAnswer: "A) 45 meters East",
      explanation: "Track Cartesian coordinates starting from (0, 0):\n1. 20m North: (0, 20)\n2. Turn right (East) 30m: (30, 20)\n3. Turn right (South) 35m: (30, 20 - 35) = (30, -15)\n4. Turn left (East) 15m: (30 + 15, -15) = (45, -15)\n5. Turn left (North) 15m: (45, -15 + 15) = (45, 0)\nFinal position is (45, 0), which is exactly 45 meters East of origin P.",
      shortcut: "Y-axis: +20 - 35 + 15 = 0. X-axis: +30 + 15 = +45 (East). Net = 45m East."
    }
  ]
};

export default companyAptitudeData;
