import { PracticeProgramme } from '../types/practice';

export const PRACTICE_PROGRAMMES: PracticeProgramme[] = [
  // ================= UNIT 1 =================
  {
    id: 'P-U1-01',
    unitId: 'unit-1',
    groupNumber: 2,
    title: 'Switch-Based Arithmetic Calculator (+, -, *, /, %)',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 2,
      syllabusRef: 'CS107ES Group 2: Expression evaluation (Switch-based arithmetic calculator).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal manual maps this to Experiment 2.1.',
    },
    technicalVerification: {
      supportedInputs: 'Integer operands a and b; operator char: +, -, *, /, %',
      complexityAnalysis: 'Time: O(1) constant time branching; Space: O(1) stack space.',
      edgeCases: [
        'Division by zero (b = 0 with / or % operator): Must halt and print error rather than causing SIGFPE.',
        'Negative integer operands with modulo (%): C99 standard specifies that result sign matches dividend (a % b has same sign as a).',
        'Invalid operator character: Handled via switch default: branch with error notification.',
        'Floating-point operands with %: In ANSI/ISO C, the % operator is strictly invalid for float/double; integer casting or fmod() must be used.',
      ],
      implementationNotes:
        'C99/C11 requires integer operands for the modulo operator (%). Safe division must verify b != 0 before executing either / or %.',
      overflowSafeguards:
        'Guards against INT_MIN / -1 overflow which produces SIGFPE on two-complement hardware.',
    },
    codeTemplate: `#include <stdio.h>

int main(void) {
    int a, b;
    char op;

    printf("Enter operator (+, -, *, /, %%): ");
    if (scanf(" %c", &op) != 1) return 1;

    printf("Enter two integers: ");
    if (scanf("%d %d", &a, &b) != 2) return 1;

    switch (op) {
        case '+':
            printf("%d + %d = %d\\n", a, b, a + b);
            break;
        case '-':
            printf("%d - %d = %d\\n", a, b, a - b);
            break;
        case '*':
            printf("%d * %d = %d\\n", a, b, a * b);
            break;
        case '/':
            if (b == 0) {
                printf("Error: Division by zero is undefined.\\n");
            } else {
                printf("%d / %d = %d\\n", a, b, a / b);
            }
            break;
        case '%':
            if (b == 0) {
                printf("Error: Modulo by zero is undefined.\\n");
            } else {
                printf("%d %%%% %d = %d\\n", a, b, a % b);
            }
            break;
        default:
            printf("Error: Unsupported operator '%c'\\n", op);
            break;
    }
    return 0;
}`
  },
  {
    id: 'P-U1-02',
    unitId: 'unit-1',
    groupNumber: 2,
    title: 'Armstrong Number Checker (General N-Digit & 3-Digit Specification)',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit I: Counting loops, while loops, sums and products in loops.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-SUPP',
      localCourseTitle: 'Theory Problem Solving Supplementary Exercise',
      institutionLocalNote: 'Frequently included in college tutorial problem sets.',
    },
    technicalVerification: {
      supportedInputs: 'Non-negative integers 0 <= N <= 2,147,483,647 (32-bit signed int).',
      complexityAnalysis: 'Time: O(log10 N) digit counting + O(log10 N * k) power summation; Space: O(1).',
      edgeCases: [
        'Single digit numbers (0 to 9): Trivially Armstrong numbers as d^1 = d.',
        'Distinction between 3-digit only check vs general N-digit check: 153 is 1^3 + 5^3 + 3^3 = 153; 1634 is 1^4 + 6^4 + 3^4 + 4^4 = 1634 (order 4).',
        'Academic integrity requirement: A program computing sum of cubes only is valid ONLY for 3-digit inputs (100-999). A general Armstrong checker must first count digits k, then raise each digit to power k.',
        'Negative inputs: Rejected or noted as non-Armstrong.',
      ],
      implementationNotes:
        'ACADEMIC DISTINCTION: Never present a sum-of-cubes implementation as a general Armstrong checker. For N-digit integers, the exponent k MUST equal the number of digits k = floor(log10 N) + 1.',
      overflowSafeguards:
        'Use long long for power accumulator to prevent intermediate overflow on large numbers.',
    },
    codeTemplate: `#include <stdio.h>
#include <math.h>

/* General N-digit Armstrong checker */
int isArmstrong(int n) {
    if (n < 0) return 0;
    if (n >= 0 && n < 10) return 1;

    int temp = n, digits = 0;
    while (temp > 0) {
        digits++;
        temp /= 10;
    }

    temp = n;
    long long sum = 0;
    while (temp > 0) {
        int rem = temp % 10;
        long long p = 1;
        for (int i = 0; i < digits; i++) p *= rem;
        sum += p;
        temp /= 10;
    }

    return (sum == n);
}`
  },
  {
    id: 'P-U1-03',
    unitId: 'unit-1',
    groupNumber: 2,
    title: 'Prime Number Verification with Overflow-Safe Loop Condition',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 2,
      syllabusRef: 'CS107ES Group 2: Prime number verification.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 2.2.',
    },
    technicalVerification: {
      supportedInputs: 'Integer N (-2^31 <= N <= 2^31 - 1).',
      complexityAnalysis: 'Time: O(sqrt(N)) trial division; Space: O(1).',
      edgeCases: [
        'N <= 1: Neither prime nor composite (return false).',
        'N = 2, 3: Smallest primes (return true).',
        'Even numbers > 2: Instantly composite (N % 2 == 0 return false).',
        'Avoid integer overflow in loop condition: Writing "i * i <= n" causes signed integer overflow when i * i exceeds 2,147,483,647 (undefined behavior in C). Must use "i <= n / i" or compute "int limit = (int)sqrt(n)".',
        'Requires proper C standard headers: <stdio.h>, <stdbool.h>, and <math.h> (with -lm linker flag when using sqrt).',
      ],
      implementationNotes:
        'C99/C11 integer overflow in (i * i <= n) produces undefined behavior if n > 2^31 / 2. The division-bounded form (i <= n / i) or precomputed sqrt(n) guarantees safe evaluation across full 32-bit range.',
      overflowSafeguards:
        'i <= n / i eliminates all potential multiplication overflow during trial division.',
    },
    codeTemplate: `#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    /* Overflow-safe bound: i <= n / i avoids i * i wrapping around INT_MAX */
    for (int i = 5; i <= n / i; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}`
  },
  {
    id: 'P-U1-04',
    unitId: 'unit-1',
    groupNumber: 2,
    title: 'Fibonacci Sequence Generation & Supported Input Limits',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 2,
      syllabusRef: 'CS107ES Group 2: Fibonacci series generation.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 2.4.',
    },
    technicalVerification: {
      supportedInputs: 'Term count N, where 0 <= N <= 45 for standard signed 32-bit int, or N <= 92 for unsigned 64-bit uint64_t.',
      complexityAnalysis: 'Iterative: O(N) time, O(1) space. Naive Recursive: O(2^N) exponential time, O(N) stack frames.',
      edgeCases: [
        'N = 0: Zero terms generated (or F(0) = 0).',
        'N = 1: Single term [0].',
        'N = 2: First two terms [0, 1].',
        '32-bit Integer Overflow Boundary: F(45) = 1,134,903,170; F(46) = 1,836,311,903. F(47) = 2,971,215,073 which exceeds INT32_MAX (2,147,483,647) and wraps negative.',
        'Academic explanation of complexity: Naive recursion tree duplicates calls (e.g. fib(3) called repeatedly), causing O(2^N) explosion and stack overflow for N > 40. Iterative accumulator is strictly O(N) time and O(1) space.',
      ],
      implementationNotes:
        'Standard C lab implementations must document the N <= 45 bound when storing terms in int. For terms up to N = 90, unsigned long long or uint64_t is required.',
      overflowSafeguards:
        'Input validation rejects N > 45 if using 32-bit int.',
    },
    codeTemplate: `#include <stdio.h>

void printFibonacci(int n) {
    if (n <= 0) {
        printf("No terms to display.\\n");
        return;
    }
    if (n > 45) {
        printf("Warning: Terms above N=45 exceed 32-bit signed int capacity.\\n");
    }

    long long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        printf("%lld%s", a, (i < n - 1) ? ", " : "\\n");
        long long next = a + b;
        a = b;
        b = next;
    }
}`
  },

  // ================= UNIT 2 =================
  {
    id: 'P-U2-01',
    unitId: 'unit-2',
    groupNumber: 1,
    title: 'Simple and Compound Interest Calculation (Double Precision)',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 1,
      syllabusRef: 'CS107ES Group 1: Simple and Compound Interest calculations.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 1.2.',
    },
    technicalVerification: {
      supportedInputs: 'Principal P > 0, Time T >= 0, Rate R >= 0 (double precision floating point).',
      complexityAnalysis: 'Time: O(1) mathematical calculation; Space: O(1).',
      edgeCases: [
        'Zero interest rate (R = 0): SI = 0.0, CI = 0.0.',
        'Negative inputs: Rejected with validation notice.',
        'Formula precision: Uses pow((1.0 + r / 100.0), t) from <math.h> with double precision to prevent truncation errors.',
        'Linker note: In GCC/Clang on POSIX systems, compiling requires -lm flag for math library linking.',
      ],
      implementationNotes:
        'Avoid integer division truncation: Use (P * T * R) / 100.0 with floating-point literals.',
    },
    codeTemplate: `#include <stdio.h>
#include <math.h>

int main(void) {
    double principal, time, rate;
    printf("Enter Principal, Time (years), and Rate (%%): ");
    if (scanf("%lf %lf %lf", &principal, &time, &rate) != 3 || principal < 0 || time < 0 || rate < 0) {
        printf("Error: Invalid financial input parameters.\\n");
        return 1;
    }

    double simpleInterest = (principal * time * rate) / 100.0;
    double compoundInterest = principal * pow((1.0 + rate / 100.0), time) - principal;

    printf("Simple Interest   = %.2f\\n", simpleInterest);
    printf("Compound Interest = %.2f\\n", compoundInterest);
    return 0;
}`
  },
  {
    id: 'P-U2-02',
    unitId: 'unit-2',
    groupNumber: 3,
    title: 'Variable Swapping via Pointer Indirection (Call-by-Reference)',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit II: Functions with output parameters, pointers, and memory indirection.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-SUPP',
      localCourseTitle: 'Modular Programming Supplementary Exercise',
      institutionLocalNote: 'Demonstration problem for call-by-reference mechanics.',
    },
    technicalVerification: {
      supportedInputs: 'Two memory addresses of integer variables (int *a, int *b).',
      complexityAnalysis: 'Time: O(1); Space: O(1).',
      edgeCases: [
        'Null pointers: if (a == NULL || b == NULL) return;',
        'Self-swap (a == b): Safe with temporary variable approach (*a = *b is a no-op). XOR swap without check causes value to become 0.',
        'Scope of names: Proves that C is strictly call-by-value; call-by-reference is simulated by passing pointer values.',
      ],
      implementationNotes:
        'Use temporary variable method: int temp = *a; *a = *b; *b = temp; Avoid XOR swap on identical addresses.',
      memorySafety: 'Check for NULL pointers prior to dereference.',
    },
    codeTemplate: `#include <stdio.h>

void swap(int *a, int *b) {
    if (a == NULL || b == NULL) return;
    int temp = *a;
    *a = *b;
    *b = temp;
}`
  },
  {
    id: 'P-U2-03',
    unitId: 'unit-2',
    title: 'Dynamic Memory Allocation (DMA) Syllabus Coverage Gap Analysis',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit II: Dynamic memory allocation failure checks and free(). NOTE: Omitted from CS107ES prescribed lab list.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-DMA',
      localCourseTitle: 'Dynamic Memory Management Supplementary Module',
      institutionLocalNote: 'Supplements syllabus gap between theory Unit II and CS107ES lab.',
    },
    technicalVerification: {
      supportedInputs: 'Runtime element count n > 0.',
      complexityAnalysis: 'malloc/calloc: O(N) allocation; free: O(1); Space: Heap-allocated block.',
      edgeCases: [
        'Allocation Failure: malloc/calloc returning NULL when heap memory exhausted.',
        'Memory Leaks: Forgetting to call free(ptr) before pointer goes out of scope.',
        'Dangling Pointers: Using pointer after free(ptr); must assign ptr = NULL immediately.',
        'Double Free: Calling free(ptr) twice on same address invokes undefined behavior / crash.',
        'SYLLABUS GAP RECONCILIATION: JNTUH CS103ES Unit II explicitly teaches malloc, calloc, realloc, and free(). However, the official CS107ES lab experiments do not include a dedicated standalone DMA experiment. RevPlay documents this gap honestly without fabricating an unauthorized syllabus mandate.',
      ],
      implementationNotes:
        'Essential pattern: int *p = malloc(n * sizeof(int)); if (p == NULL) { /* handle */ } ... free(p); p = NULL;',
      memorySafety: 'NULL verification mandatory before buffer access; explicit deallocation with free().',
    },
    codeTemplate: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    /* Allocate array of 5 integers on heap */
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "Heap allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    /* Free heap block and invalidate pointer */
    free(arr);
    arr = NULL;
    return 0;
}`
  },

  // ================= UNIT 3 =================
  {
    id: 'P-U3-01',
    unitId: 'unit-3',
    groupNumber: 3,
    title: '1D Array Min, Max, and Average Statistics via Functions',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 3,
      syllabusRef: 'CS107ES Group 3: Array minimum, maximum, and average using functions.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 3.1.',
    },
    technicalVerification: {
      supportedInputs: 'Integer array arr[] of length 1 <= N <= 1000.',
      complexityAnalysis: 'Time: O(N) single pass; Space: O(1).',
      edgeCases: [
        'Array of size N = 1: Min, Max, and Average are all equal to arr[0].',
        'All negative integers: Min and Max initialized to arr[0] (never initialize max to 0!).',
        'Floating-point average: Sum must be cast to double before dividing by N to avoid integer division truncation.',
        'Array boundary overrun: Subscript indexing strictly within 0 to N - 1.',
      ],
      implementationNotes:
        'Pass array size as separate parameter: double computeAvg(const int arr[], int n); C decays array arguments to base pointers.',
    },
    codeTemplate: `#include <stdio.h>

void calculateStats(const int arr[], int n, int *min, int *max, double *avg) {
    if (n <= 0) return;
    *min = arr[0];
    *max = arr[0];
    long long sum = arr[0];

    for (int i = 1; i < n; i++) {
        if (arr[i] < *min) *min = arr[i];
        if (arr[i] > *max) *max = arr[i];
        sum += arr[i];
    }
    *avg = (double)sum / n;
}`
  },
  {
    id: 'P-U3-02',
    unitId: 'unit-3',
    title: 'Matrix Transpose with Dimensional Validation (R x C to C x R)',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit III: Multidimensional arrays, 2D arrays, matrix transformations.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-SUPP',
      localCourseTitle: '2D Arrays Supplementary Practice',
      institutionLocalNote: 'Associated with matrix operations and linear transformations.',
    },
    technicalVerification: {
      supportedInputs: 'Matrix dimensions R, C (1 <= R, C <= 50) and integer elements.',
      complexityAnalysis: 'Time: O(R * C); Space: O(C * R) output matrix.',
      edgeCases: [
        'Square Matrix (R == C): Transpose can be done in-place by swapping elements across main diagonal where i < j.',
        'Rectangular Matrix (R != C): IN-PLACE TRANSPOSE IS IMPOSSIBLE in standard row-major static arrays because buffer dimensions change from R x C to C x R. A separate target matrix of size C x R is mathematically required.',
        'Input Bounds: Verify R > 0 and C > 0; reject invalid non-positive dimensions.',
      ],
      implementationNotes:
        'Dimensional Validation: T[j][i] = M[i][j]. For non-square matrices (e.g. 2x3), output matrix must have 3 rows and 2 columns.',
    },
    codeTemplate: `#include <stdio.h>

#define MAX_DIM 50

void transposeMatrix(int R, int C, const int src[MAX_DIM][MAX_DIM], int dest[MAX_DIM][MAX_DIM]) {
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) {
            dest[j][i] = src[i][j];
        }
    }
}`
  },
  {
    id: 'P-U3-03',
    unitId: 'unit-3',
    title: 'Unresolved Specification Programme (Unit III Entry 03)',
    category: 'Unresolved Specification',
    status: 'UNRESOLVED_IN_SPECIFICATION',
    isUnresolved: true,
    unresolvedReason:
      'ACADEMIC INTEGRITY NOTICE: Identifier P-U3-03 is listed as an entry in the V2 specification sequence, but lacks a matching technical definition in Version 1 and university course outlines. In accordance with strict academic guidelines, this identifier is preserved without fabricated content or silent renumbering.',
    technicalVerification: {
      supportedInputs: 'Unresolved in primary syllabus documents.',
      edgeCases: ['Preserved as unresolved specification placeholder.'],
      implementationNotes:
        'DO NOT INVENT: Kept transparently unresolved to preserve ID stability and progress tracking integrity.',
    }
  },
  {
    id: 'P-U3-04',
    unitId: 'unit-3',
    groupNumber: 5,
    title: 'String Palindrome & Symmetrical Verification',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 5,
      syllabusRef: 'CS107ES Group 5: String palindrome verification.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 5.2.',
    },
    technicalVerification: {
      supportedInputs: 'Null-terminated string (char[]) of length up to 1000.',
      complexityAnalysis: 'Time: O(L) where L is string length; Space: O(1).',
      edgeCases: [
        'Empty string ("") or single char ("a"): Trivially a palindrome.',
        'Even length ("abba") vs Odd length ("racecar").',
        'Case sensitivity: Clarified in challenge specification whether "Radar" is considered palindrome (case-insensitive) or non-palindrome (case-sensitive).',
        'Null terminator check: Loop terminates on s[i] == "\\0".',
      ],
      implementationNotes:
        'Traverse with two indices (left = 0, right = len - 1) moving inward: while (left < right) if (s[left++] != s[right--]) return 0;',
    },
    codeTemplate: `#include <stdio.h>
#include <string.h>

int isPalindrome(const char *str) {
    if (str == NULL) return 0;
    int left = 0;
    int right = (int)strlen(str) - 1;

    while (left < right) {
        if (str[left] != str[right]) return 0;
        left++;
        right--;
    }
    return 1;
}`
  },

  // ================= UNIT 4 =================
  {
    id: 'P-U4-01',
    unitId: 'unit-4',
    title: 'Recursive Factorial & Greatest Common Divisor (Euclidean GCD)',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit IV: The nature of recursion, tracing recursive functions, recursive math.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-SUPP',
      localCourseTitle: 'Recursion Supplementary Practice',
      institutionLocalNote: 'Standard recursive algorithms tutorial.',
    },
    technicalVerification: {
      supportedInputs: 'Factorial: 0 <= N <= 12 (32-bit) or N <= 20 (64-bit uint64_t). GCD: integers a, b >= 0.',
      complexityAnalysis: 'Factorial: O(N) time and stack frames. GCD: O(log(min(a, b))) time (Lame theorem).',
      edgeCases: [
        'Factorial base case: 0! = 1 and 1! = 1.',
        'Negative factorial: Undefined in natural arithmetic; must halt or return -1.',
        'Factorial overflow: 13! = 6,227,020,800 which exceeds 32-bit INT_MAX (2,147,483,647). Documented limit is N <= 12 for int.',
        'GCD base case: gcd(a, 0) = a.',
        'Stack overflow: Recursive depth must not exceed activation frame limits.',
      ],
      implementationNotes:
        'Base condition verification mandatory: if (b == 0) return a; return gcd(b, a % b);',
      overflowSafeguards: 'Factorial limited to N <= 12 for 32-bit int.',
    },
    codeTemplate: `#include <stdio.h>

int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

long long factorial(int n) {
    if (n < 0) return -1;
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`
  },
  {
    id: 'P-U4-02',
    unitId: 'unit-4',
    title: 'Structure vs Union Memory Layout & Implementation-Dependent sizeof',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit IV: User-defined structure types, union types, memory layout comparisons.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-MEM',
      localCourseTitle: 'Data Representation Supplementary Exercise',
      institutionLocalNote: 'Core theoretical and memory architecture analysis.',
    },
    technicalVerification: {
      supportedInputs: 'Heterogeneous data fields (char, int, double).',
      complexityAnalysis: 'Time: O(1) compile-time sizeof; Space: Stack/Data segment.',
      edgeCases: [
        'Memory Alignment & Structure Padding: In a struct, compiler inserts padding bytes between members so that each field aligns with its natural word boundary (e.g. 4-byte boundaries for int, 8-byte for double).',
        'Implementation-dependent sizeof: EXACT SIZEOF RESULTS ARE NOT FIXED BY C STANDARD. They depend on compiler ABI, architecture word size (32-bit vs 64-bit), and packing flags (#pragma pack). A struct containing { char c; int i; } is typically 8 bytes on x86_64 (1 byte char + 3 bytes padding + 4 bytes int), NOT 5 bytes.',
        'Union memory overlap: In a union, all members share offset 0. Total union size is at least equal to largest member size, padded up to largest member alignment requirement.',
      ],
      implementationNotes:
        'ACADEMIC ACCURACY: Never state that sizeof(struct) is strictly the sum of member sizes without explaining compiler padding and architecture alignment.',
    },
    codeTemplate: `#include <stdio.h>

struct ExampleStruct {
    char c;     /* 1 byte + 3 padding bytes */
    int i;      /* 4 bytes */
    double d;   /* 8 bytes */
}; /* Total: typically 16 bytes on 64-bit ABI */

union ExampleUnion {
    char c;
    int i;
    double d;
}; /* Total: 8 bytes (size of largest member) */

int main(void) {
    printf("sizeof(struct ExampleStruct) = %zu bytes (includes padding)\\n", sizeof(struct ExampleStruct));
    printf("sizeof(union ExampleUnion)   = %zu bytes (shared member memory)\\n", sizeof(union ExampleUnion));
    return 0;
}`
  },

  // ================= UNIT 5 =================
  {
    id: 'P-U5-01',
    unitId: 'unit-5',
    groupNumber: 4,
    title: 'Text File Stream Processing with Error Handling',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 4,
      syllabusRef: 'CS107ES Group 4: Copy file converting lowercase to uppercase characters.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 4.1.',
    },
    technicalVerification: {
      supportedInputs: 'Source filename string and target destination filename string.',
      complexityAnalysis: 'Time: O(FileSize); Space: O(1) streaming buffer.',
      edgeCases: [
        'File Open Error: fopen() returns NULL if file does not exist, permission is denied, or filesystem is full. Must verify fp != NULL before any stream operation.',
        'Safe EOF Handling: fgetc() returns an int (NOT char). If stored in unsigned char, EOF (-1) converts to 255 and loop never terminates (infinite loop).',
        'Resource Leaks: All opened streams must be closed using fclose(). If destination open fails after source open succeeds, source must still be closed before exiting.',
        'Buffer Flushing: Writing to streams is buffered; fclose() ensures final bytes are flushed to disk.',
      ],
      implementationNotes:
        'Mandatory idiom: int ch; while ((ch = fgetc(src)) != EOF) { fputc(toupper(ch), dest); }',
      memorySafety: 'Strict file handle validation and guaranteed fclose() on all return paths.',
    },
    codeTemplate: `#include <stdio.h>
#include <ctype.h>

int copyUppercaseFile(const char *srcPath, const char *destPath) {
    FILE *src = fopen(srcPath, "r");
    if (src == NULL) {
        perror("Error opening source file");
        return 1;
    }

    FILE *dest = fopen(destPath, "w");
    if (dest == NULL) {
        perror("Error opening destination file");
        fclose(src);
        return 2;
    }

    int ch; /* Must be int to hold EOF (-1) */
    while ((ch = fgetc(src)) != EOF) {
        fputc(toupper(ch), dest);
    }

    fclose(src);
    fclose(dest);
    return 0;
}`
  },
  {
    id: 'P-U5-02',
    unitId: 'unit-5',
    groupNumber: 6,
    title: 'Linear Search & Binary Search on Sorted Array',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 6,
      syllabusRef: 'CS107ES Group 6: Linear search and binary search on sorted array.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College lab manual Experiment 6.1.',
    },
    technicalVerification: {
      supportedInputs: 'Sorted integer array arr[] and search target value key.',
      complexityAnalysis: 'Linear Search: O(N) time. Binary Search: O(log N) time, O(1) space.',
      edgeCases: [
        'Precondition for Binary Search: Array MUST be sorted in ascending order. Running binary search on unsorted data yields undefined/incorrect results.',
        'Target not found: Loop condition while (low <= high) terminates and returns -1.',
        'Target at boundaries: Found at low (index 0) or high (index N - 1).',
        'Mid calculation overflow: Writing "mid = (low + high) / 2" can overflow 32-bit signed int when low + high > 2,147,483,647. Use "mid = low + (high - low) / 2".',
      ],
      implementationNotes:
        'Safe mid calculation: int mid = low + (high - low) / 2; Prevents arithmetic overflow on large arrays.',
    },
    codeTemplate: `#include <stdio.h>

int binarySearch(const int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; /* Overflow-safe */
        if (arr[mid] == key) return mid;
        else if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
  },
  {
    id: 'P-V-03',
    unitId: 'unit-5',
    title: 'Unresolved Specification Programme (Unit V Entry 03 / P-V-03)',
    category: 'Unresolved Specification',
    status: 'UNRESOLVED_IN_SPECIFICATION',
    isUnresolved: true,
    unresolvedReason:
      'ACADEMIC INTEGRITY NOTICE: Identifier P-V-03 (also referenced as P-U5-03) is listed in the V2 specification sequence, but lacks a matching technical definition in Version 1 and university course outlines. In accordance with strict academic guidelines, this identifier is preserved without fabricated content or silent renumbering.',
    technicalVerification: {
      supportedInputs: 'Unresolved in primary syllabus documents.',
      edgeCases: ['Preserved as unresolved specification placeholder.'],
      implementationNotes:
        'DO NOT INVENT: Kept transparently unresolved to preserve ID stability and progress tracking integrity.',
    }
  }
];
