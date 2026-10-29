import { SyllabusUnit, LabPracticeGroup, CoverageItem } from '../types/syllabus';

export const OFFICIAL_SYLLABUS_SOURCE = {
  institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
  regulation: 'R25 Academic Regulations (B.Tech III Year / I Year CSE AI&ML Foundation)',
  officialUrl: 'https://www.jntuh.ac.in/uploads/academics/R25B.Tech.CSE%28AIML%29IIIYearSyllabus.pdf',
  theoryCourseCode: 'CS103ES',
  theoryCourseTitle: 'Programming for Problem Solving',
  labCourseCode: 'CS107ES',
  labCourseTitle: 'Programming for Problem Solving Lab',
  localNote: 'College local identifiers map directly to these official university course codes.'
};

export const SYLLABUS_UNITS: SyllabusUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'C Fundamentals, Decisions, and Loops',
    codename: 'Silicon Plains',
    shortDescription: 'Syntax foundations, operators, precedence, decision structures, while, for, nested & do-while loops.',
    officialCourseCode: 'CS103ES',
    courseTitle: 'Programming for Problem Solving',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
    bossGameId: 'game-u1-flowchart',
    topics: [
      {
        id: 'u1-t1',
        unitId: 'unit-1',
        title: 'C Language Elements, Data Types & Operators',
        description: 'Variables, primitive data types (int, float, double, char), formatted I/O, operators, precedence and associativity.',
        officialJntuhRef: 'Unit I: C language elements, variable declarations, and data types. Executable statements and general form.',
        gameId: 'game-u1-predict',
        notesId: 'notes-u1-fundamentals',
      },
      {
        id: 'u1-t2',
        unitId: 'unit-1',
        title: 'Control Structures & Algorithmic Decisions',
        description: 'if, if-else, nested if-else, multiway switch statements, compound statement blocks and conditional decisions.',
        officialJntuhRef: 'Unit I: Control structures, conditions, if statements, compound statements, and algorithmic decision steps.',
        gameId: 'game-u1-branch',
        notesId: 'notes-u1-decisions',
      },
      {
        id: 'u1-t3',
        unitId: 'unit-1',
        title: 'Repetition, Counting & Conditional Loops',
        description: 'while loops, for loops, do-while loops, loop counters, sums/products accumulators, break and continue mechanics.',
        officialJntuhRef: 'Unit I: Repetition, counting loops, while loops, sums and products in loops, for loops, nested loops, do-while.',
        gameId: 'game-u1-loop',
        notesId: 'notes-u1-loops',
      },
      {
        id: 'u1-t4',
        unitId: 'unit-1',
        title: 'Algorithmic Flowcharts & Execution Logic',
        description: 'Translating problem statements and decision flowcharts directly into verified executable C code structures.',
        officialJntuhRef: 'Unit I: Algorithmic decision steps and structured loop design.',
        gameId: 'game-u1-flowchart',
        notesId: 'notes-u1-flowcharts',
      }
    ]
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'Functions, Top-Down Design, and Pointers',
    codename: 'Pointer Peaks',
    shortDescription: 'Modular programs, library functions, structure charts, pointer indirection (*, &), and output parameters.',
    officialCourseCode: 'CS103ES',
    courseTitle: 'Programming for Problem Solving',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    bossGameId: 'game-u2-callstack',
    topics: [
      {
        id: 'u2-t1',
        unitId: 'unit-2',
        title: 'Pointers, Indirection & Address Arithmetic',
        description: 'Memory addresses, address-of operator (&), dereference operator (*), pointer declarations, pointer assignments, dynamic memory allocation failure handling & free().',
        officialJntuhRef: 'Unit II: Pointers and the indirection operator. Scope of names, memory references, dynamic memory allocation failure checks and free().',
        gameId: 'game-u2-pointer-lab',
        notesId: 'notes-u2-pointers',
      },
      {
        id: 'u2-t2',
        unitId: 'unit-2',
        title: 'Functions, Scope & Call-Stack Mechanics',
        description: 'Function prototypes, functions without arguments and functions with input arguments, scope of names, output parameters using pointers (call-by-reference), stack frames.',
        officialJntuhRef: 'Unit II: Functions without arguments and functions with input arguments, functions with output parameters, scope of names.',
        gameId: 'game-u2-callstack',
        notesId: 'notes-u2-functions',
      },
      {
        id: 'u2-t3',
        unitId: 'unit-2',
        title: 'Top-Down Design & Modular Pipelines',
        description: 'Structure charts, decomposing large programs into pure modules, library functions vs user-defined functions.',
        officialJntuhRef: 'Unit II: Building programs from existing information, using library functions, top-down design.',
        gameId: 'game-u2-pipeline',
        notesId: 'notes-u2-topdown',
      }
    ]
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'Arrays and Strings',
    codename: 'Array Archipelago',
    shortDescription: '1D/2D arrays, subscripts, sequential traversal, string null terminators, string library and pointer arrays.',
    officialCourseCode: 'CS103ES',
    courseTitle: 'Programming for Problem Solving',
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-950/40 via-slate-900 to-slate-950',
    bossGameId: 'game-u3-matrix',
    topics: [
      {
        id: 'u3-t1',
        unitId: 'unit-3',
        title: 'Array Declarations, Subscripts & Memory Bounds',
        description: 'Contiguous storage, 0-indexed bounds, sequential processing with loops, passing array blocks to functions.',
        officialJntuhRef: 'Unit III: Array declarations, references, subscripts, sequential access with loops, array arguments.',
        gameId: 'game-u3-array-forge',
        notesId: 'notes-u3-arrays',
      },
      {
        id: 'u3-t2',
        unitId: 'unit-3',
        title: 'Multidimensional Matrices & Grid Missions',
        description: '2D arrays, row-major memory mapping, nested loop traversal, matrix addition and matrix multiplication algorithms.',
        officialJntuhRef: 'Unit III: Multidimensional arrays, parallel arrays, enumerated types.',
        gameId: 'game-u3-matrix',
        notesId: 'notes-u3-matrices',
      },
      {
        id: 'u3-t3',
        unitId: 'unit-3',
        title: 'Strings, Null-Terminator & String Library',
        description: 'Character arrays, null-terminator (\\0), strlen, strcpy, strcat, strcmp, substrings, whole-line input (fgets).',
        officialJntuhRef: 'Unit III: String basics and string library functions, assignment, substrings, concatenation, comparison.',
        gameId: 'game-u3-string-lab',
        notesId: 'notes-u3-strings',
      }
    ]
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'Recursion, Structures, and Unions',
    codename: 'Recursive Abyss',
    shortDescription: 'Recursive call tracing, base cases, struct definitions, member alignment, and union memory overlap.',
    officialCourseCode: 'CS103ES',
    courseTitle: 'Programming for Problem Solving',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    bossGameId: 'game-u4-memory-layout',
    topics: [
      {
        id: 'u4-t1',
        unitId: 'unit-4',
        title: 'Recursion Maze & Call Tracing',
        description: 'Base condition, recursive steps, stack activation records, unwinding return values, factorial, Fibonacci and GCD.',
        officialJntuhRef: 'Unit IV: The nature of recursion and tracing recursive functions. Recursive math, array & string parameters.',
        gameId: 'game-u4-recursion-maze',
        notesId: 'notes-u4-recursion',
      },
      {
        id: 'u4-t2',
        unitId: 'unit-4',
        title: 'Structures, Struct Pointers & Return Values',
        description: 'User-defined types (struct), member access (.), pointer access (->), passing structs by value vs reference, nested structs.',
        officialJntuhRef: 'Unit IV: User-defined structure types. Structure data as input/output parameters, returning structured values.',
        gameId: 'game-u4-struct-builder',
        notesId: 'notes-u4-structures',
      },
      {
        id: 'u4-t3',
        unitId: 'unit-4',
        title: 'Unions, Memory Overlap & Layout Challenge',
        description: 'Differences between struct and union memory footprints, shared member storage, data alignment and padding.',
        officialJntuhRef: 'Unit IV: Union types, memory representations and layout comparisons.',
        gameId: 'game-u4-memory-layout',
        notesId: 'notes-u4-unions',
      }
    ]
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    title: 'Files, Searching, and Sorting',
    codename: 'File Citadel',
    shortDescription: 'File streams (FILE*), text/binary I/O, linear vs binary search, and bubble, insertion & selection sort.',
    officialCourseCode: 'CS103ES',
    courseTitle: 'Programming for Problem Solving',
    accentColor: '#ef4444',
    bgGradient: 'from-rose-950/40 via-slate-900 to-slate-950',
    bossGameId: 'game-u5-sort-race',
    topics: [
      {
        id: 'u5-t1',
        unitId: 'unit-5',
        title: 'File Detective: Text & Binary File I/O',
        description: 'FILE pointer, fopen modes ("r", "w", "a", "rb", "wb"), fclose, fprintf, fscanf, fgetc, fputc, fread, fwrite, EOF checks.',
        officialJntuhRef: 'Unit V: Text and binary file pointers, file input/output, and binary files. Searching a file database.',
        gameId: 'game-u5-file-detective',
        notesId: 'notes-u5-files',
      },
      {
        id: 'u5-t2',
        unitId: 'unit-5',
        title: 'Searching Arena: Linear Search vs Binary Search',
        description: 'Unsorted sequential scan O(N) vs sorted divide-and-conquer O(log N), low/mid/high pointer mechanics, boundary conditions.',
        officialJntuhRef: 'Unit V: Searching a database. Linear search and binary search.',
        gameId: 'game-u5-binary-search',
        notesId: 'notes-u5-searching',
      },
      {
        id: 'u5-t3',
        unitId: 'unit-5',
        title: 'Sorting Race: Bubble, Insertion & Selection Sort',
        description: 'Comparative algorithm race: Bubble sort adjacent swaps, Selection sort minimum selection, Insertion sort card placement.',
        officialJntuhRef: 'Unit V: Bubble sort, insertion sort, and selection sort.',
        gameId: 'game-u5-sort-race',
        notesId: 'notes-u5-sorting',
      }
    ]
  },
  {
    id: 'lab',
    unitNumber: 'LAB',
    title: 'CS107ES Programming for Problem Solving Lab',
    codename: 'The Lab Forge',
    shortDescription: 'All 6 official JNTUH R25 lab practice groups with interactive code verification and revision notes.',
    officialCourseCode: 'CS107ES',
    courseTitle: 'Programming for Problem Solving Lab',
    accentColor: '#38bdf8',
    bgGradient: 'from-blue-950/40 via-slate-900 to-slate-950',
    bossGameId: 'game-lab-arena',
    topics: [
      {
        id: 'lab-t1',
        unitId: 'lab',
        title: 'Practice Group 1: Numeric Calculations',
        description: 'Max/min of three numbers, simple and compound interest, multiplication tables, binary equivalents (0 to 255).',
        officialJntuhRef: 'CS107ES Group 1: Numeric problems (Max/Min of 3, SI/CI, Table, Binary 0-255).',
        gameId: 'game-lab-arena',
        notesId: 'notes-lab-group1',
      },
      {
        id: 'lab-t2',
        unitId: 'lab',
        title: 'Practice Group 2: Expression Evaluation',
        description: 'Switch-based arithmetic calculator, prime number verification, digit sum accumulator, palindrome numbers, Fibonacci series.',
        officialJntuhRef: 'CS107ES Group 2: Expression evaluation (Calculator, Prime, Sum of Digits, Palindrome, Fibonacci).',
        gameId: 'game-lab-arena',
        notesId: 'notes-lab-group2',
      },
      {
        id: 'lab-t3',
        unitId: 'lab',
        title: 'Practice Group 3: Arrays, Pointers & Functions',
        description: 'Array min/max/average, matrix addition & multiplication using modular functions, pointer input and reverse display.',
        officialJntuhRef: 'CS107ES Group 3: Arrays, pointers, and functions (Min/Max/Avg, Matrix Add/Multiply, Reverse using pointers).',
        gameId: 'game-lab-arena',
        notesId: 'notes-lab-group3',
      },
      {
        id: 'lab-t4',
        unitId: 'lab',
        title: 'Practice Group 4: File Manipulation',
        description: 'Copy file while converting lowercase to uppercase characters, merge two input files into a destination third file.',
        officialJntuhRef: 'CS107ES Group 4: Files (Copy uppercase conversion, Merge two files).',
        gameId: 'game-lab-arena',
        notesId: 'notes-lab-group4',
      },
      {
        id: 'lab-t5',
        unitId: 'lab',
        title: 'Practice Group 5: String Algorithms',
        description: 'Substring insertion and deletion, string palindrome check, locate first character index or return -1, line/word/char count.',
        officialJntuhRef: 'CS107ES Group 5: Strings (Substring insert/delete, Palindrome, Locate char, Count words/lines).',
        gameId: 'game-lab-arena',
        notesId: 'notes-lab-group5',
      },
      {
        id: 'lab-t6',
        unitId: 'lab',
        title: 'Practice Group 6: Searching & Sorting',
        description: 'Linear search, binary search on sorted array, bubble sort asc, selection sort desc, insertion sort asc, alphabetical name sorting.',
        officialJntuhRef: 'CS107ES Group 6: Searching & Sorting (Linear, Binary, Bubble, Selection Desc, Insertion, Sorting Names).',
        gameId: 'game-lab-arena',
        notesId: 'notes-lab-group6',
      }
    ]
  }
];

export const LAB_PRACTICE_GROUPS: LabPracticeGroup[] = [
  {
    groupNumber: 1,
    title: 'Numeric Problems',
    officialObjective: 'Write, compile and debug programs for basic mathematical logic and bitwise binary conversion.',
    experiments: [
      {
        id: 'lab-1a',
        title: 'Find Maximum and Minimum of Three Numbers',
        expectedBehavior: 'Input: 3 integers a, b, c. Output: Display highest and lowest values accurately.',
        notesId: 'notes-lab-group1',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-1b',
        title: 'Simple and Compound Interest Calculation',
        expectedBehavior: 'Formula: SI = (P*T*R)/100; CI = P * pow((1 + R/100), T) - P. Use double precision.',
        notesId: 'notes-lab-group1',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-1c',
        title: 'Generate Multiplication Table up to N terms',
        expectedBehavior: 'Iterate 1 to N, print formatted table: num x i = (num * i).',
        notesId: 'notes-lab-group1',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-1d',
        title: 'Binary Equivalents for Decimal Values (0 to 255)',
        expectedBehavior: 'Convert 8-bit unsigned char to binary representation using bitwise shifts (>> & 1) or division by 2.',
        notesId: 'notes-lab-group1',
        gameId: 'game-lab-arena',
        verified: true
      }
    ]
  },
  {
    groupNumber: 2,
    title: 'Expression Evaluation & Number Theory',
    officialObjective: 'Evaluate complex mathematical conditions, loops, and multiway branching.',
    experiments: [
      {
        id: 'lab-2a',
        title: 'Switch-based Arithmetic Calculator (+, -, *, /, %)',
        expectedBehavior: 'Menu driven operator selection with divide-by-zero check.',
        notesId: 'notes-lab-group2',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-2b',
        title: 'Prime Number Verification',
        expectedBehavior: 'Check divisibility up to sqrt(N) for primality (N > 1).',
        notesId: 'notes-lab-group2',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-2c',
        title: 'Sum of Digits and Reverse Palindrome Check',
        expectedBehavior: 'Extract digits using % 10 and / 10; compare reversed integer with original value.',
        notesId: 'notes-lab-group2',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-2d',
        title: 'Fibonacci Sequence Generation',
        expectedBehavior: 'Output first N terms where F(n) = F(n-1) + F(n-2) with F(0)=0, F(1)=1.',
        notesId: 'notes-lab-group2',
        gameId: 'game-lab-arena',
        verified: true
      }
    ]
  },
  {
    groupNumber: 3,
    title: 'Arrays, Pointers, and Functions',
    officialObjective: 'Pass array pointers to functions, perform multi-dimensional arithmetic, and manipulate pointers.',
    experiments: [
      {
        id: 'lab-3a',
        title: 'Array Minimum, Maximum, and Average using Functions',
        expectedBehavior: 'Pass array and size to modular functions to compute extrema and statistical average.',
        notesId: 'notes-lab-group3',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-3b',
        title: 'Matrix Addition and Multiplication using Modular Functions',
        expectedBehavior: 'Validate dimensions (r1=r2, c1=c2 for add; c1=r2 for multiply); compute dot product.',
        notesId: 'notes-lab-group3',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-3c',
        title: 'Pointer-based Array Input and Reverse Traversal',
        expectedBehavior: 'Input elements using *(ptr + i) and print from last to first using *(ptr + n - 1 - i).',
        notesId: 'notes-lab-group3',
        gameId: 'game-lab-arena',
        verified: true
      }
    ]
  },
  {
    groupNumber: 4,
    title: 'File Manipulation & Streams',
    officialObjective: 'Demonstrate persistent storage, text streams, and file error handling.',
    experiments: [
      {
        id: 'lab-4a',
        title: 'Copy File with Lowercase to Uppercase Conversion',
        expectedBehavior: 'Read input.txt char by char using fgetc(), toupper() if islower(), write to output.txt.',
        notesId: 'notes-lab-group4',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-4b',
        title: 'Merge Two Files into a Third Target File',
        expectedBehavior: 'Append contents of file1.txt then file2.txt sequentially into merged.txt.',
        notesId: 'notes-lab-group4',
        gameId: 'game-lab-arena',
        verified: true
      }
    ]
  },
  {
    groupNumber: 5,
    title: 'String Algorithms & Buffer Operations',
    officialObjective: 'Manipulate null-terminated character buffers, pattern matching, and file/stream counters.',
    experiments: [
      {
        id: 'lab-5a',
        title: 'Substring Insertion and Substring Deletion',
        expectedBehavior: 'Insert string S2 into S1 at position P; delete L characters from S1 starting at position P.',
        notesId: 'notes-lab-group5',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-5b',
        title: 'String Palindrome Verification',
        expectedBehavior: 'Compare characters from start (0) and end (len-1) moving inward ignoring case differences.',
        notesId: 'notes-lab-group5',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-5c',
        title: 'Locate Character in String (Return Index or -1)',
        expectedBehavior: 'Linear scan of string; return first 0-based index or -1 if not found.',
        notesId: 'notes-lab-group5',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-5d',
        title: 'Count Lines, Words, and Characters in Text Buffer',
        expectedBehavior: 'Track newline chars (\\n), whitespace boundaries (isspace) for words, and total characters.',
        notesId: 'notes-lab-group5',
        gameId: 'game-lab-arena',
        verified: true
      }
    ]
  },
  {
    groupNumber: 6,
    title: 'Searching and Sorting Lab Benchmarks',
    officialObjective: 'Implement and analyze searching algorithms and classical sorting techniques.',
    experiments: [
      {
        id: 'lab-6a',
        title: 'Linear Search & Binary Search on Sorted Array',
        expectedBehavior: 'Linear search sequentially; binary search with low/mid/high on sorted array.',
        notesId: 'notes-lab-group6',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-6b',
        title: 'Bubble Sort Ascending',
        expectedBehavior: 'Adjacent comparisons with swap flag optimization.',
        notesId: 'notes-lab-group6',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-6c',
        title: 'Selection Sort Descending',
        expectedBehavior: 'Find maximum element in unsorted suffix and swap with current index.',
        notesId: 'notes-lab-group6',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-6d',
        title: 'Insertion Sort Ascending',
        expectedBehavior: 'Shift elements greater than key to right; insert key into sorted prefix.',
        notesId: 'notes-lab-group6',
        gameId: 'game-lab-arena',
        verified: true
      },
      {
        id: 'lab-6e',
        title: 'Sorting Array of Names (Alphabetical Order)',
        expectedBehavior: '2D char array or array of pointers sorted using strcmp() and strcpy().',
        notesId: 'notes-lab-group6',
        gameId: 'game-lab-arena',
        verified: true
      }
    ]
  }
];

export const COVERAGE_MATRIX: CoverageItem[] = [
  // Unit I
  {
    syllabusRef: 'Unit I (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'C Language Elements, Data Types, Expressions & Formatting',
    gameId: 'game-u1-predict',
    gameTitle: 'Predict the Output',
    notesId: 'notes-u1-fundamentals',
    notesTitle: 'C Fundamentals & Formatted I/O',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit I (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Control Structures, Conditions & Decision Trees',
    gameId: 'game-u1-branch',
    gameTitle: 'Branch Runner',
    notesId: 'notes-u1-decisions',
    notesTitle: 'Control Flow & Branch Decisions',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit I (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Counting Loops, While, For, Do-While & Loop Accumulators',
    gameId: 'game-u1-loop',
    gameTitle: 'Loop Reactor',
    notesId: 'notes-u1-loops',
    notesTitle: 'Iterative Loops & Design',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit I (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Algorithmic Flowcharts & Execution Logic',
    gameId: 'game-u1-flowchart',
    gameTitle: 'Flowchart Builder',
    notesId: 'notes-u1-flowcharts',
    notesTitle: 'Flowcharts & Algorithm Translation',
    status: 'Verified',
  },
  // Unit II
  {
    syllabusRef: 'Unit II (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Pointers, Indirection Operator & Memory Addresses',
    gameId: 'game-u2-pointer-lab',
    gameTitle: 'Pointer Lab & RAM Grid',
    notesId: 'notes-u2-pointers',
    notesTitle: 'Pointers, Addresses & Indirection',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit II (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Functions, Scope of Names & Call-Stack Mechanics',
    gameId: 'game-u2-callstack',
    gameTitle: 'Call-Stack Challenge',
    notesId: 'notes-u2-functions',
    notesTitle: 'Modular Functions & Activation Records',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit II (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Top-Down Design, Structure Charts & Library Functions',
    gameId: 'game-u2-pipeline',
    gameTitle: 'Function Pipeline',
    notesId: 'notes-u2-topdown',
    notesTitle: 'Top-Down Design & Modularity',
    status: 'Verified',
  },
  // Unit III
  {
    syllabusRef: 'Unit III (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Array Declarations, Subscripts & Function Arguments',
    gameId: 'game-u3-array-forge',
    gameTitle: 'Array Forge',
    notesId: 'notes-u3-arrays',
    notesTitle: 'Arrays & Subscript Traversal',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit III (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: '2D Multidimensional Arrays & Matrix Operations',
    gameId: 'game-u3-matrix',
    gameTitle: 'Matrix Mission',
    notesId: 'notes-u3-matrices',
    notesTitle: '2D Arrays & Matrix Mathematics',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit III (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Strings, Null Terminator, String Functions & Pointer Arrays',
    gameId: 'game-u3-string-lab',
    gameTitle: 'String Puzzle Lab',
    notesId: 'notes-u3-strings',
    notesTitle: 'Strings, Null-Byte & string.h',
    status: 'Verified',
  },
  // Unit IV
  {
    syllabusRef: 'Unit IV (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Nature of Recursion, Stack Tracing & Math Functions',
    gameId: 'game-u4-recursion-maze',
    gameTitle: 'Recursion Maze',
    notesId: 'notes-u4-recursion',
    notesTitle: 'Recursion Tracing & Call Stacks',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit IV (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'User-Defined Structure Types & Struct Pointers',
    gameId: 'game-u4-struct-builder',
    gameTitle: 'Structure Builder',
    notesId: 'notes-u4-structures',
    notesTitle: 'C Structures & Member Access',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit IV (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Unions, Memory Overlap & Layout Calculation',
    gameId: 'game-u4-memory-layout',
    gameTitle: 'Memory Layout Challenge',
    notesId: 'notes-u4-unions',
    notesTitle: 'Unions & Memory Footprints',
    status: 'Verified',
  },
  // Unit V
  {
    syllabusRef: 'Unit V (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Text & Binary File Pointers, fopen, fread, fwrite, fclose',
    gameId: 'game-u5-file-detective',
    gameTitle: 'File Detective',
    notesId: 'notes-u5-files',
    notesTitle: 'File Streams & Persistent I/O',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit V (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Searching Algorithms: Linear Search vs Binary Search',
    gameId: 'game-u5-binary-search',
    gameTitle: 'Binary Search Arena',
    notesId: 'notes-u5-searching',
    notesTitle: 'Linear vs Binary Search Mechanics',
    status: 'Verified',
  },
  {
    syllabusRef: 'Unit V (CS103ES)',
    courseCode: 'CS103ES',
    category: 'Theory',
    topicName: 'Sorting Algorithms: Bubble, Insertion & Selection Sort',
    gameId: 'game-u5-sort-race',
    gameTitle: 'Sorting Race',
    notesId: 'notes-u5-sorting',
    notesTitle: 'Sorting Algorithms & Comparisons',
    status: 'Verified',
  },
  // Lab Practice Groups
  {
    syllabusRef: 'Lab Group 1 (CS107ES)',
    courseCode: 'CS107ES',
    category: 'Lab Experiment',
    topicName: 'Numeric Calculations: Max/Min of 3, SI/CI, Tables, Binary 0-255',
    gameId: 'game-lab-arena',
    gameTitle: 'Lab Arena: Numeric Workbench',
    notesId: 'notes-lab-group1',
    notesTitle: 'Lab Practice 1: Numeric Logic',
    status: 'Verified',
  },
  {
    syllabusRef: 'Lab Group 2 (CS107ES)',
    courseCode: 'CS107ES',
    category: 'Lab Experiment',
    topicName: 'Expression Evaluation: Switch Calculator, Primes, Palindromes, Fibonacci',
    gameId: 'game-lab-arena',
    gameTitle: 'Lab Arena: Expression Lab',
    notesId: 'notes-lab-group2',
    notesTitle: 'Lab Practice 2: Expression Evaluation',
    status: 'Verified',
  },
  {
    syllabusRef: 'Lab Group 3 (CS107ES)',
    courseCode: 'CS107ES',
    category: 'Lab Experiment',
    topicName: 'Arrays, Pointers & Functions: Matrix Math & Pointer Traversal',
    gameId: 'game-lab-arena',
    gameTitle: 'Lab Arena: Pointers & Matrix',
    notesId: 'notes-lab-group3',
    notesTitle: 'Lab Practice 3: Array & Pointer Logic',
    status: 'Verified',
  },
  {
    syllabusRef: 'Lab Group 4 (CS107ES)',
    courseCode: 'CS107ES',
    category: 'Lab Experiment',
    topicName: 'Files: Uppercase File Copy & File Merging',
    gameId: 'game-lab-arena',
    gameTitle: 'Lab Arena: File Pipelines',
    notesId: 'notes-lab-group4',
    notesTitle: 'Lab Practice 4: File Processing',
    status: 'Verified',
  },
  {
    syllabusRef: 'Lab Group 5 (CS107ES)',
    courseCode: 'CS107ES',
    category: 'Lab Experiment',
    topicName: 'Strings: Substring Insertion/Deletion, Palindrome, Search, Word Counter',
    gameId: 'game-lab-arena',
    gameTitle: 'Lab Arena: String Workbench',
    notesId: 'notes-lab-group5',
    notesTitle: 'Lab Practice 5: String Algorithms',
    status: 'Verified',
  },
  {
    syllabusRef: 'Lab Group 6 (CS107ES)',
    courseCode: 'CS107ES',
    category: 'Lab Experiment',
    topicName: 'Searching & Sorting: Linear, Binary, Bubble, Selection, Insertion, Names',
    gameId: 'game-lab-arena',
    gameTitle: 'Lab Arena: Search & Sort Bench',
    notesId: 'notes-lab-group6',
    notesTitle: 'Lab Practice 6: Benchmark Algorithms',
    status: 'Verified',
  }
];

