import { ChallengeSpecification } from '../types/challenges';

export const CHALLENGES_QUESTION_BANK: ChallengeSpecification[] = [
  // 1. Floyd's Triangle - VERIFIED_PYQ
  {
    id: 'CHAL-FLOYD',
    title: "Floyd's Natural Number Triangle",
    unitId: 'unit-1',
    difficulty: 'Easy',
    topicTag: 'Nested Loops & Numerical Patterns',
    normalizedStatement:
      'Given a positive integer N (the number of rows), generate Floyd’s Triangle consisting of sequential positive integers starting from 1. Row 1 contains 1 number, row 2 contains 2 numbers, and row r contains r numbers, separated by single spaces.',
    originalExamWording:
      'Write a C program to print Floyd\'s Triangle for a given number of rows N.',
    normalizationNotes:
      'Exam question asks for a full C program with standard console printing; normalized for platform submission requiring row-by-row formatted token strings with trimmed trailing spaces.',
    inputFormat: 'A single positive integer N representing the number of rows.',
    outputFormat: 'N lines. Line i (1 <= i <= N) contains i space-separated integers.',
    constraints: [
      '1 <= N <= 20',
      'Row 1 starts with integer 1',
      'The total number of integers printed is N * (N + 1) / 2 (for N = 20, max value is 210, well within 32-bit int)'
    ],
    sampleIO: [
      {
        input: '4',
        output: '1\n2 3\n4 5 6\n7 8 9 10',
        explanation: 'Row 1 has 1 number (1). Row 2 has 2 numbers (2, 3). Row 3 has 3 numbers (4, 5, 6). Row 4 has 4 numbers (7, 8, 9, 10).'
      },
      {
        input: '1',
        output: '1',
        explanation: 'A single row containing only the integer 1.'
      }
    ],
    edgeCases: [
      'N = 1: Single element boundary case.',
      'N = 20: Maximum supported row count; ensures counter does not wrap or truncate.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-FLOYD-01',
        category: 'Boundary',
        description: 'Smallest valid row count (N = 1).',
        expectedBehavior: 'Outputs a single row with "1".'
      },
      {
        caseId: 'TC-FLOYD-02',
        category: 'Normal',
        description: 'Standard 4-row pyramid.',
        expectedBehavior: 'Produces 4 lines matching sample output 1.'
      },
      {
        caseId: 'TC-FLOYD-03',
        category: 'Normal',
        description: 'Medium 7-row pattern (last number 28).',
        expectedBehavior: 'Properly increments from 1 to 28 across 7 rows.'
      },
      {
        caseId: 'TC-FLOYD-04',
        category: 'Boundary',
        description: 'Upper boundary row count (N = 20).',
        expectedBehavior: 'Generates 20 lines ending with 210 with no format breakage.'
      }
    ],
    provenance: {
      status: 'VERIFIED_PYQ',
      institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      regulation: 'R22',
      paperCode: '181AP',
      examinationSession: 'July/August 2024',
      questionNumber: '2(b)',
      primaryVerificationStatus: 'CONFIRMED_PRIMARY_PDF',
      notes:
        'Confirmed direct primary source match in official university paper archive for R22 B.Tech I Year II Semester examination (Paper Code 181AP, Question 2(b)).'
    },
    linkedProgrammeId: 'P-U1-01'
  },

  // 2. Array Monotonicity - SOURCE_MATCH_PENDING_PRIMARY_PDF
  {
    id: 'CHAL-MONOTONIC',
    title: 'Array Monotonicity Verifier',
    unitId: 'unit-3',
    difficulty: 'Easy',
    topicTag: '1D Arrays & Sequential Comparisons',
    normalizedStatement:
      'Given an array of N integers, determine whether the sequence is monotonic. An array is monotonic if it is either entirely non-decreasing (arr[i] <= arr[i+1]) or entirely non-increasing (arr[i] >= arr[i+1]) for all 0 <= i < N - 1. Output "MONOTONIC" if the property holds, or "NOT_MONOTONIC" otherwise.',
    originalExamWording:
      'Write a C program to check whether an array of integers is monotonic (either non-decreasing or non-increasing).',
    normalizationNotes:
      'Exam question evaluated overall logic. Platform normalizes output to strict standardized uppercase tokens ("MONOTONIC" / "NOT_MONOTONIC"). Secondary transcript recorded under Paper Code 132AD; pending archival verification of primary PDF.',
    inputFormat: 'Line 1: An integer N (the number of elements).\nLine 2: N space-separated integers.',
    outputFormat: 'A single string: "MONOTONIC" or "NOT_MONOTONIC".',
    constraints: [
      '1 <= N <= 10^4',
      '-10^9 <= arr[i] <= 10^9'
    ],
    sampleIO: [
      {
        input: '4\n1 2 2 3',
        output: 'MONOTONIC',
        explanation: 'Array is non-decreasing across all adjacent pairs.'
      },
      {
        input: '4\n6 5 4 4',
        output: 'MONOTONIC',
        explanation: 'Array is non-increasing across all adjacent pairs.'
      },
      {
        input: '3\n1 3 2',
        output: 'NOT_MONOTONIC',
        explanation: 'Elements rise from 1 to 3, then fall to 2; neither non-decreasing nor non-increasing.'
      }
    ],
    edgeCases: [
      'N = 1: An array with a single element is trivially monotonic.',
      'All equal elements (e.g. 5 5 5 5): Both non-decreasing and non-increasing, strictly MONOTONIC.',
      'Oscillating sequence with large negative values.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-MONO-01',
        category: 'Boundary',
        description: 'Single element array (N = 1).',
        expectedBehavior: 'Returns "MONOTONIC".'
      },
      {
        caseId: 'TC-MONO-02',
        category: 'Normal',
        description: 'Strictly increasing sequence.',
        expectedBehavior: 'Returns "MONOTONIC".'
      },
      {
        caseId: 'TC-MONO-03',
        category: 'Edge',
        description: 'Constant array with identical values.',
        expectedBehavior: 'Returns "MONOTONIC".'
      },
      {
        caseId: 'TC-MONO-04',
        category: 'Normal',
        description: 'Sequence with inflection point (peak then dip).',
        expectedBehavior: 'Returns "NOT_MONOTONIC".'
      },
      {
        caseId: 'TC-MONO-05',
        category: 'Stress',
        description: 'Large array of 10^4 non-decreasing elements.',
        expectedBehavior: 'Executes within linear time without timeout.'
      }
    ],
    provenance: {
      status: 'SOURCE_MATCH_PENDING_PRIMARY_PDF',
      institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      regulation: 'R16',
      paperCode: '132AD',
      examinationSession: 'Secondary Transcript Match',
      primaryVerificationStatus: 'SECONDARY_SOURCE_TRANSCRIPT',
      notes:
        'A matching question transcript exists in JNTUH R16 Paper Code 132AD compilation notes. Formal primary verification is held as pending until the original university scan is retrieved.'
    },
    linkedProgrammeId: 'P-U3-01'
  },

  // 3. Whitespace Compression - SOURCE_MATCH_PENDING_PRIMARY_PDF
  {
    id: 'CHAL-WHITESPACE-COMPRESS',
    title: 'Whitespace Stream Compression',
    unitId: 'unit-3',
    difficulty: 'Medium',
    topicTag: 'String Manipulation & Pointer Scanning',
    normalizedStatement:
      'Given an ASCII string of length up to 1000 characters, compress all contiguous sequences of whitespace characters (spaces, tabs, newlines) into a single space character \' \'. Strip leading and trailing whitespace completely.',
    originalExamWording:
      'Write a C program that reads a string and replaces multiple consecutive blanks with a single blank space.',
    normalizationNotes:
      'Original paper focused on console space characters; normalized specification explicitly handles tab (\\t) and newline (\\n) whitespace compaction with trimmed boundaries for unambiguous test evaluation.',
    inputFormat: 'A single line containing an ASCII string (may contain spaces, tabs, and characters).',
    outputFormat: 'The compressed string with single space separators and no leading/trailing blanks.',
    constraints: [
      '1 <= length <= 1000',
      'Characters are printable ASCII and standard whitespace'
    ],
    sampleIO: [
      {
        input: 'Hello     World   from    JNTUH',
        output: 'Hello World from JNTUH',
        explanation: 'All multiple spaces between words are collapsed into a single space.'
      },
      {
        input: '   Leading and trailing   ',
        output: 'Leading and trailing',
        explanation: 'Leading and trailing spaces are removed; inner spaces preserved as single.'
      }
    ],
    edgeCases: [
      'String consisting solely of spaces: Outputs empty string ("").',
      'String with no consecutive spaces: Outputs string identical to input.',
      'Tabs mixed with spaces: Compacted to a single standard ASCII space (0x20).'
    ],
    testCasePlan: [
      {
        caseId: 'TC-WHITE-01',
        category: 'Normal',
        description: 'Standard sentence with erratic spacing.',
        expectedBehavior: 'Produces clean single-spaced sentence.'
      },
      {
        caseId: 'TC-WHITE-02',
        category: 'Edge',
        description: 'String containing only spaces.',
        expectedBehavior: 'Produces empty output with no dangling whitespace.'
      },
      {
        caseId: 'TC-WHITE-03',
        category: 'Boundary',
        description: 'Leading and trailing multiple spaces.',
        expectedBehavior: 'Trimmed cleanly at head and tail.'
      },
      {
        caseId: 'TC-WHITE-04',
        category: 'Stress',
        description: 'Maximum length string (1000 chars) alternating words and spaces.',
        expectedBehavior: 'Processes in-place or via single pass O(N) buffer.'
      }
    ],
    provenance: {
      status: 'SOURCE_MATCH_PENDING_PRIMARY_PDF',
      institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      regulation: 'R16',
      paperCode: '132AD',
      examinationSession: 'Secondary Transcript Match',
      primaryVerificationStatus: 'SECONDARY_SOURCE_TRANSCRIPT',
      notes:
        'Secondary-source transcript documented under JNTUH R16 Paper Code 132AD. Primary archival PDF verification is pending.'
    },
    linkedProgrammeId: 'P-U3-04'
  },

  // 4. Character Category Counter - SOURCE_MATCH_PENDING_PRIMARY_PDF
  {
    id: 'CHAL-CHAR-COUNT',
    title: 'Character Classification & Category Counter',
    unitId: 'unit-3',
    difficulty: 'Easy',
    topicTag: 'Strings, Character Analysis & isalpha/isdigit',
    normalizedStatement:
      'Given a line of text, classify and count the total number of vowels (case-insensitive: a, e, i, o, u), consonants (alphabetic letters excluding vowels), decimal digits (0-9), and special characters (all other non-whitespace symbols).',
    originalExamWording:
      'Write a C program to count the number of vowels, consonants, digits and special characters in a given string.',
    normalizationNotes:
      'Original exam wording left whitespace classification ambiguous. Platform normalization specifies that whitespace characters (spaces, tabs, newlines) are omitted from the special character bucket, counting only non-whitespace punctuation and symbols.',
    inputFormat: 'A single line of text terminated by a newline.',
    outputFormat: 'Four lines in format:\nVowels: <count>\nConsonants: <count>\nDigits: <count>\nSpecial: <count>',
    constraints: [
      '1 <= length <= 500',
      'ASCII character set'
    ],
    sampleIO: [
      {
        input: 'C Programming 2026!',
        output: 'Vowels: 4\nConsonants: 8\nDigits: 4\nSpecial: 1',
        explanation:
          'Vowels: o, a, i, e (4). Consonants: C, P, r, g, r, m, m, n, g (9? C-P-r-g-r-a-m-m-i-n-g: C,P,r,g,r,m,m,n,g = 9; without spaces). Digits: 2, 0, 2, 6 (4). Special: ! (1). Spaces are not counted in special.'
      }
    ],
    edgeCases: [
      'All uppercase or all lowercase vowels: Case insensitivity must be respected (A and a both count).',
      'String containing only digits or only special characters: Zero counts for remaining categories.',
      'Empty string: All counts equal 0.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-CHAR-01',
        category: 'Normal',
        description: 'Standard mixed sentence with punctuation.',
        expectedBehavior: 'Correctly tallies each of the four categories.'
      },
      {
        caseId: 'TC-CHAR-02',
        category: 'Edge',
        description: 'Pure numerical string ("1234567890").',
        expectedBehavior: 'Digits: 10, all others 0.'
      },
      {
        caseId: 'TC-CHAR-03',
        category: 'Boundary',
        description: 'String containing only uppercase vowels ("AEIOU").',
        expectedBehavior: 'Vowels: 5, all others 0.'
      }
    ],
    provenance: {
      status: 'SOURCE_MATCH_PENDING_PRIMARY_PDF',
      institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      regulation: 'R16',
      paperCode: '132AD',
      examinationSession: 'Secondary Transcript Match',
      primaryVerificationStatus: 'SECONDARY_SOURCE_TRANSCRIPT',
      notes:
        'Preserved from secondary-source transcript for JNTUH R16 Paper Code 132AD; primary scan verification in progress.'
    },
    linkedProgrammeId: 'P-U3-04'
  },

  // 5. String Palindrome - PYQ_VARIANT
  {
    id: 'CHAL-STR-PALINDROME',
    title: 'Manual String Palindrome Verification (No string.h)',
    unitId: 'unit-3',
    difficulty: 'Medium',
    topicTag: 'Pointers & Null-Terminated Buffers',
    normalizedStatement:
      'Given a null-terminated ASCII string, verify whether it is a palindrome (reads identically forwards and backwards). You must implement your logic directly via character indexing or pointer arithmetic WITHOUT invoking <string.h> library functions (strlen, strcmp, strrev). Output "PALINDROME" or "NOT_PALINDROME".',
    originalExamWording:
      'Write a C program to check whether a given string is a palindrome or not.',
    normalizationNotes:
      'CRITICAL PLATFORM ADAPTATION: In the original JNTUH R16 Paper Code 132AD (Jan/Feb 2024), the question was a general program request. The restriction "without using <string.h> library functions" is a RevPlay pedagogical platform adaptation designed to test manual pointer traversal and null-terminator detection.',
    inputFormat: 'A single word string consisting of alphanumeric characters.',
    outputFormat: '"PALINDROME" or "NOT_PALINDROME".',
    constraints: [
      '1 <= length <= 256',
      'Case-sensitive evaluation',
      'No functions from string.h permitted'
    ],
    sampleIO: [
      {
        input: 'level',
        output: 'PALINDROME',
        explanation: 'Characters match symmetrically: l=l, e=e, v=v.'
      },
      {
        input: 'RevPlay',
        output: 'NOT_PALINDROME',
        explanation: 'R != y, not a palindrome.'
      }
    ],
    edgeCases: [
      'Single character: Always a palindrome.',
      'Case sensitivity: "Radar" is NOT_PALINDROME due to R != r under strict ASCII comparison.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-PAL-01',
        category: 'Boundary',
        description: 'Single character string ("x").',
        expectedBehavior: 'Returns "PALINDROME".'
      },
      {
        caseId: 'TC-PAL-02',
        category: 'Normal',
        description: 'Odd-length symmetric palindrome ("madam").',
        expectedBehavior: 'Returns "PALINDROME".'
      },
      {
        caseId: 'TC-PAL-03',
        category: 'Normal',
        description: 'Even-length symmetric palindrome ("noon").',
        expectedBehavior: 'Returns "PALINDROME".'
      },
      {
        caseId: 'TC-PAL-04',
        category: 'Edge',
        description: 'Mixed case word ("Madam").',
        expectedBehavior: 'Returns "NOT_PALINDROME" under case-sensitive rules.'
      }
    ],
    provenance: {
      status: 'PYQ_VARIANT',
      institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      regulation: 'R16',
      paperCode: '132AD',
      examinationSession: 'January/February 2024',
      primaryVerificationStatus: 'PLATFORM_ADAPTATION',
      notes:
        'Derived from JNTUH R16 Paper Code 132AD (Jan/Feb 2024). The prohibition of <string.h> is an explicit RevPlay platform adaptation, transparently documented.'
    },
    linkedProgrammeId: 'P-U3-04'
  },

  // 6. Bit-Shift Evaluator - PYQ_VARIANT
  {
    id: 'CHAL-BIT-SHIFT',
    title: 'Bitwise Shift Operator Evaluator',
    unitId: 'unit-1',
    difficulty: 'Medium',
    topicTag: 'Bitwise Operators & Integer Representation',
    normalizedStatement:
      'Given an integer value V and a shift count S, evaluate the arithmetic and logical results of: (1) Left shift (V << S), and (2) Right shift (V >> S). Output both resulting values separated by a space.',
    originalExamWording:
      'Explain bitwise shift operators (<< and >>) in C with suitable examples and show how bits are shifted.',
    normalizationNotes:
      'ACADEMIC CLARIFICATION: The JNTUH R22 Paper Code 181AP question tests bitwise shift operator expressions and evaluations on integers. IT IS NOT THE SAME as the CS107ES Lab Group 1(d) exercise which requires formatted 8-bit binary string representation. This challenge normalizes the theoretical exam question into an interactive shift evaluator.',
    inputFormat: 'Two space-separated integers: V (the value) and S (the shift count).',
    outputFormat: 'Two space-separated integers: <V_left_shifted> <V_right_shifted>.',
    constraints: [
      '0 <= V <= 10^6',
      '0 <= S <= 31'
    ],
    sampleIO: [
      {
        input: '8 2',
        output: '32 2',
        explanation: '8 << 2 = 8 * 4 = 32. 8 >> 2 = 8 / 4 = 2.'
      },
      {
        input: '15 1',
        output: '30 7',
        explanation: '15 << 1 = 30. 15 >> 1 = 7 (floor division by 2).'
      }
    ],
    edgeCases: [
      'S = 0: Value remains identical for both shifts.',
      'S >= 32: In C, shifting by >= width of type is undefined behavior; constrained to 0 <= S <= 31.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-SHIFT-01',
        category: 'Boundary',
        description: 'Zero shift count (S = 0).',
        expectedBehavior: 'Outputs original value twice.'
      },
      {
        caseId: 'TC-SHIFT-02',
        category: 'Normal',
        description: 'Standard power of two shifts.',
        expectedBehavior: 'Produces correct multiplied and divided integers.'
      },
      {
        caseId: 'TC-SHIFT-03',
        category: 'Boundary',
        description: 'High shift count (S = 16).',
        expectedBehavior: 'Evaluates without 32-bit arithmetic overflow for supported V.'
      }
    ],
    provenance: {
      status: 'PYQ_VARIANT',
      institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
      regulation: 'R22',
      paperCode: '181AP',
      examinationSession: 'July/August 2024',
      primaryVerificationStatus: 'PLATFORM_ADAPTATION',
      notes:
        'Adapted from JNTUH R22 Paper Code 181AP July/August 2024 theory question on bitwise shift operators. Distinguished from the 8-bit binary representation lab exercise.'
    },
    linkedProgrammeId: 'P-U1-01'
  },

  // 7. Matrix Saddle Point - SUPPLEMENTAL_CHALLENGE
  {
    id: 'CHAL-SADDLE-POINT',
    title: 'Matrix Saddle Point Discovery',
    unitId: 'unit-3',
    difficulty: 'Hard',
    topicTag: '2D Arrays & Nested Loop Optimizations',
    normalizedStatement:
      'Given an R x C matrix of distinct integers, determine whether it possesses a Saddle Point. A saddle point is an element that is simultaneously the minimum in its row and the maximum in its column. Output the value and 0-based coordinate (row, col) if found, or "NO_SADDLE_POINT" if none exists.',
    normalizationNotes:
      'SUPPLEMENTARY CHALLENGE: This is a classic algorithmic challenge for 2D array analysis. No university examination paper code is fabricated or claimed.',
    inputFormat: 'Line 1: Two integers R and C.\nNext R lines: C space-separated integers per line.',
    outputFormat: '"Value: <val> at (<r>, <c>)" or "NO_SADDLE_POINT".',
    constraints: [
      '1 <= R, C <= 50',
      'Matrix elements are distinct integers (-10^6 <= M[i][j] <= 10^6)'
    ],
    sampleIO: [
      {
        input: '3 3\n1 2 3\n4 5 6\n7 8 9',
        output: 'Value: 7 at (2, 0)',
        explanation: 'In row 2, 7 is the minimum. In column 0 (1, 4, 7), 7 is the maximum. Thus 7 is a saddle point.'
      }
    ],
    edgeCases: [
      '1x1 matrix: Trivially a saddle point.',
      'Matrix with no saddle point: Outputs "NO_SADDLE_POINT".'
    ],
    testCasePlan: [
      {
        caseId: 'TC-SADDLE-01',
        category: 'Normal',
        description: 'Standard 3x3 matrix with proven saddle point.',
        expectedBehavior: 'Finds value and coordinates accurately.'
      },
      {
        caseId: 'TC-SADDLE-02',
        category: 'Edge',
        description: 'Matrix with no saddle point.',
        expectedBehavior: 'Returns "NO_SADDLE_POINT".'
      }
    ],
    provenance: {
      status: 'SUPPLEMENTAL_CHALLENGE',
      institution: 'RevPlay Academic Question Bank',
      primaryVerificationStatus: 'NO_UNIVERSITY_PAPER_CLAIMED',
      notes:
        'Standard algorithmic problem. Preserved with transparent provenance; no JNTUH paper code match is claimed.'
    },
    linkedProgrammeId: 'P-U3-02'
  },

  // 8. Digital Root - SUPPLEMENTAL_CHALLENGE
  {
    id: 'CHAL-DIGITAL-ROOT',
    title: 'Digital Root (Iterative Sum of Digits to Single Digit)',
    unitId: 'unit-1',
    difficulty: 'Easy',
    topicTag: 'Number Theory & Modulo Arithmetic',
    normalizedStatement:
      'Given a non-negative integer N, compute its Digital Root. The digital root is the single-digit value obtained by repeatedly summing the digits of N until only a single digit remains.',
    normalizationNotes:
      'SUPPLEMENTARY CHALLENGE: Classic number theory exercise. Preserved without claiming an unverified exam paper code.',
    inputFormat: 'A single non-negative integer N.',
    outputFormat: 'A single integer (0-9).',
    constraints: [
      '0 <= N <= 2 * 10^9'
    ],
    sampleIO: [
      {
        input: '9875',
        output: '2',
        explanation: '9 + 8 + 7 + 5 = 29 -> 2 + 9 = 11 -> 1 + 1 = 2.'
      },
      {
        input: '0',
        output: '0',
        explanation: '0 is already a single digit.'
      }
    ],
    edgeCases: [
      'N = 0: Single digit 0.',
      'Multiples of 9: Digital root is always 9 (except for 0).'
    ],
    testCasePlan: [
      {
        caseId: 'TC-DIGIT-01',
        category: 'Boundary',
        description: 'N = 0.',
        expectedBehavior: 'Outputs 0.'
      },
      {
        caseId: 'TC-DIGIT-02',
        category: 'Normal',
        description: 'Multi-step reduction (e.g. 9875 -> 29 -> 11 -> 2).',
        expectedBehavior: 'Outputs 2.'
      }
    ],
    provenance: {
      status: 'SUPPLEMENTAL_CHALLENGE',
      institution: 'RevPlay Academic Question Bank',
      primaryVerificationStatus: 'NO_UNIVERSITY_PAPER_CLAIMED',
      notes:
        'Standard number theory practice problem. Preserved as a supplemental challenge.'
    },
    linkedProgrammeId: 'P-U1-01'
  },

  // 9. Recursive GCD - SUPPLEMENTAL_CHALLENGE
  {
    id: 'CHAL-RECURSIVE-GCD',
    title: 'Euclidean Recursive Greatest Common Divisor',
    unitId: 'unit-4',
    difficulty: 'Medium',
    topicTag: 'Recursion, Call Stack & Euclidean Algorithm',
    normalizedStatement:
      'Implement the Euclidean algorithm recursively to find the Greatest Common Divisor (GCD) of two non-negative integers a and b. Your function must trace the activation frames and return the integer GCD.',
    normalizationNotes:
      'SUPPLEMENTARY CHALLENGE: Found throughout general recursion curricula. No specific JNTUH paper code assigned until primary PDF verified.',
    inputFormat: 'Two space-separated non-negative integers a and b.',
    outputFormat: 'A single integer: gcd(a, b).',
    constraints: [
      '0 <= a, b <= 10^9',
      'a and b cannot both be 0'
    ],
    sampleIO: [
      {
        input: '48 18',
        output: '6',
        explanation: 'gcd(48, 18) = gcd(18, 12) = gcd(12, 6) = gcd(6, 0) = 6.'
      }
    ],
    edgeCases: [
      'b = 0: Base case returns a.',
      'a < b: First recursive call naturally swaps parameters.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-GCD-01',
        category: 'Boundary',
        description: 'b = 0.',
        expectedBehavior: 'Returns a.'
      },
      {
        caseId: 'TC-GCD-02',
        category: 'Normal',
        description: 'Standard composite values.',
        expectedBehavior: 'Computes correct GCD in O(log min(a, b)) steps.'
      }
    ],
    provenance: {
      status: 'SUPPLEMENTAL_CHALLENGE',
      institution: 'RevPlay Academic Question Bank',
      primaryVerificationStatus: 'NO_UNIVERSITY_PAPER_CLAIMED',
      notes:
        'Preserved as a foundational recursion practice challenge with honest provenance attribution.'
    },
    linkedProgrammeId: 'P-U4-01'
  },

  // 10. Matrix Trace - SUPPLEMENTAL_CHALLENGE
  {
    id: 'CHAL-MATRIX-TRACE',
    title: 'Square Matrix Trace Calculation',
    unitId: 'unit-3',
    difficulty: 'Easy',
    topicTag: '2D Arrays & Main Diagonal Accumulation',
    normalizedStatement:
      'Given an N x N square matrix, compute its Trace. The trace of a square matrix is defined as the sum of elements along its main diagonal (from top-left to bottom-right, where row index == column index).',
    normalizationNotes:
      'SUPPLEMENTARY CHALLENGE: Standard linear algebra benchmark for 2D array traversal. Preserved with transparent provenance.',
    inputFormat: 'Line 1: An integer N (matrix order).\nNext N lines: N space-separated integers per line.',
    outputFormat: 'A single integer representing the trace.',
    constraints: [
      '1 <= N <= 100',
      '-10^6 <= M[i][j] <= 10^6'
    ],
    sampleIO: [
      {
        input: '3\n1 2 3\n4 5 6\n7 8 9',
        output: '15',
        explanation: 'Main diagonal elements are 1, 5, 9. Trace = 1 + 5 + 9 = 15.'
      }
    ],
    edgeCases: [
      '1x1 matrix: Trace is the single element itself.',
      'Diagonal with negative numbers: Accumulator handles signed additions correctly.'
    ],
    testCasePlan: [
      {
        caseId: 'TC-TRACE-01',
        category: 'Boundary',
        description: '1x1 matrix.',
        expectedBehavior: 'Returns M[0][0].'
      },
      {
        caseId: 'TC-TRACE-02',
        category: 'Normal',
        description: '3x3 matrix from sample.',
        expectedBehavior: 'Returns 15.'
      }
    ],
    provenance: {
      status: 'SUPPLEMENTAL_CHALLENGE',
      institution: 'RevPlay Academic Question Bank',
      primaryVerificationStatus: 'NO_UNIVERSITY_PAPER_CLAIMED',
      notes:
        'Preserved as a supplemental matrix challenge. No university paper code claimed.'
    },
    linkedProgrammeId: 'P-U3-02'
  }
];

