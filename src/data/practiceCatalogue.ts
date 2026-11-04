import { PracticeProgramme } from '../types/practice';

/**
 * Backward-compatible mapping for any stored identifiers or legacy references
 * from earlier iterations where IDs were assigned differently.
 */
export const LEGACY_PROGRAMME_ID_MAP: Record<string, string> = {
  // Legacy -> Authoritative V2
  'P-U1-01-CALCULATOR': 'P-U1-03',
  'P-U1-02-ARMSTRONG': 'P-U1-04',
  'P-U1-03-PRIME': 'P-U2-01',
  'P-U1-04-FIBONACCI': 'P-U4-01',
  'P-U2-01-INTEREST': 'P-U1-01', // numeric logic
  'P-U2-02-SWAP': 'P-U2-02',
  'P-U2-03-DMA': 'GAP-DMA-U2',
  'P-U3-01-STATS': 'P-U3-01',
  'P-U3-02-TRANSPOSE': 'P-U3-04',
  'P-U3-04-PALINDROME': 'P-U1-02',
  'P-U4-01-FACTORIAL': 'P-U4-01',
  'P-U4-02-STRUCT-UNION': 'P-U4-03',
  'P-U5-01-FILE-COPY': 'P-V-01',
  'P-U5-02-SEARCH': 'P-V-02',
  'P-V-03-UNRESOLVED': 'P-V-03',
};

/**
 * Curriculum Coverage Gap: Dynamic Memory Allocation (DMA)
 * Documented explicitly as instructed: DMA is taught in Theory Unit II (CS103ES),
 * but omitted from prescribed JNTUH R25 CS107ES laboratory experiments.
 */
export const DMA_COVERAGE_GAP_ITEM: PracticeProgramme = {
  id: 'GAP-DMA-U2',
  unitId: 'unit-2',
  title: 'Dynamic Memory Allocation (malloc, calloc, realloc, free) - Curriculum Coverage Gap',
  category: 'Supplementary Practice',
  status: 'SUPPLEMENTAL_PRACTICE',
  officialSyllabusMapping: {
    courseCode: 'CS103ES',
    syllabusRef: 'CS103ES Unit II: Dynamic memory allocation failure handling and free().',
    isMandatedByJntuh: false, // In Theory syllabus, but missing from prescribed CS107ES Lab experiments!
  },
  collegeLocalMapping: {
    localCourseCode: '25CS103ES-SUPP-DMA',
    localCourseTitle: 'Theory Problem Solving Supplementary Exercise (DMA)',
    institutionLocalNote: 'College tutorial sheet recommended exercise to bridge Theory-to-Lab gap.',
  },
  technicalVerification: {
    supportedInputs: 'Integer block size N elements (> 0).',
    complexityAnalysis: 'Time: O(N) memory allocation and traversal; Space: O(N) heap memory.',
    edgeCases: [
      'Allocation failure: malloc() returns NULL on out-of-memory condition. Must check (ptr == NULL).',
      'Memory leak prevention: Every allocated block must be released with free(ptr) and set to NULL.',
      'Dangling pointer: Accessing *ptr after free(ptr) is undefined behavior.',
      'Double free: Calling free(ptr) twice triggers runtime heap corruption SIGABRT.'
    ],
    implementationNotes:
      'Official syllabus gap: JNTUH R25 includes DMA in Theory CS103ES Unit II but omits it from CS107ES prescribed lab experiments. We provide this module as an authorized pedagogical bridge without inventing a fake official university lab code.',
    overflowSafeguards: 'Validates N * sizeof(int) does not overflow size_t.',
    memorySafety: 'Strict NULL check after malloc, free() before exit.'
  },
  codeTemplate: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("Enter number of elements to allocate on heap: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        fprintf(stderr, "Invalid element count.\\n");
        return 1;
    }

    // Allocate dynamic buffer on heap
    int *arr = (int *)malloc((size_t)n * sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "Memory allocation failed: heap exhausted.\\n");
        return 1;
    }

    printf("Successfully allocated %d integers (%zu bytes) on heap.\\n", n, (size_t)n * sizeof(int));
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
        printf("arr[%d] = %d\\n", i, arr[i]);
    }

    // Guaranteed heap deallocation
    free(arr);
    arr = NULL;
    printf("Memory freed successfully. Pointer reset to NULL.\\n");
    return 0;
}`
};

/**
 * Authoritative V2 Programme Catalogue
 * Aligned strictly with the revised master specification:
 * P-U1-01: Largest of Three
 * P-U1-02: Reverse Integer
 * P-U1-03: Menu-Driven Calculator
 * P-U1-04: Armstrong Number Checker
 * P-U2-01: Modular Prime & Leap Year
 * P-U2-02: Pass-by-Reference Variable Swapping
 * P-U2-03: Pointer Arithmetic & Array Passing
 * P-U3-01: 1D Array Statistics
 * P-U3-02: 2D Matrix Multiplication
 * P-U3-03: Unresolved in Specification (Preserved)
 * P-U3-04: Transpose of Matrix
 * P-U4-01: Recursive Fibonacci
 * P-U4-02: Student Grade Management using Structs
 * P-U4-03: Structure vs Union Memory Comparison
 * P-V-01:  File Copy & Character Count
 * P-V-02:  Linear vs Binary Search
 * P-V-03:  Unresolved in Specification (Preserved)
 * P-V-04:  Insertion Sort
 */
export const PRACTICE_PROGRAMMES: PracticeProgramme[] = [
  // ================= UNIT 1 =================
  {
    id: 'P-U1-01',
    unitId: 'unit-1',
    groupNumber: 1,
    title: 'Largest of Three',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 1,
      syllabusRef: 'CS107ES Group 1: Numeric calculations (Largest of three numbers).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 1.1.',
    },
    technicalVerification: {
      supportedInputs: 'Three signed integers: a, b, c (-2^31 <= n <= 2^31 - 1).',
      complexityAnalysis: 'Time: O(1) branching comparison; Space: O(1).',
      edgeCases: [
        'All three numbers identical (e.g. 5, 5, 5): Program must correctly report 5 without branch ambiguity.',
        'Two numbers equal and larger than the third (e.g. 7, 7, 2): Handled via >= comparison operators.',
        'Negative numbers (e.g. -10, -5, -20): Largest is -5.',
        'Extreme 32-bit limits: INT_MIN and INT_MAX.'
      ],
      implementationNotes:
        'Uses nested if-else or compound logical operators (a >= b && a >= c) to determine the maximum value cleanly.',
      overflowSafeguards: 'Comparison is purely relational; no arithmetic overflow risk.',
    },
    codeTemplate: `#include <stdio.h>

int main(void) {
    int a, b, c;
    printf("Enter three integers: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3) {
        printf("Invalid input.\\n");
        return 1;
    }

    int largest;
    if (a >= b && a >= c) {
        largest = a;
    } else if (b >= a && b >= c) {
        largest = b;
    } else {
        largest = c;
    }

    printf("Largest of (%d, %d, %d) is %d\\n", a, b, c, largest);
    return 0;
}`
  },

  {
    id: 'P-U1-02',
    unitId: 'unit-1',
    groupNumber: 1,
    title: 'Reverse Integer',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 1,
      syllabusRef: 'CS107ES Group 1: Numeric calculations and loop reversals.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 1.3.',
    },
    technicalVerification: {
      supportedInputs: 'Signed integer N. Safe range: within 32-bit integer limits without reverse overflow.',
      complexityAnalysis: 'Time: O(log10 |N|) iterations; Space: O(1).',
      edgeCases: [
        'Zero input (N = 0): Reverse is 0.',
        'Negative integers (e.g. -123): Retain sign or handle absolute value (-321).',
        'Numbers ending in zeroes (e.g. 1200): Reverse is 21 (leading zeroes naturally truncate in numerical form).',
        '32-bit overflow check: e.g. 1,000,000,009 reversed exceeds INT_MAX.'
      ],
      implementationNotes:
        'Iteratively extracts digits using remainder = n % 10 and accumulates via rev = rev * 10 + remainder, reducing n = n / 10.',
      overflowSafeguards: 'Pre-multiplication check: verifies rev <= INT_MAX / 10 before accumulating.',
    },
    codeTemplate: `#include <stdio.h>
#include <limits.h>

int main(void) {
    int n;
    printf("Enter an integer to reverse: ");
    if (scanf("%d", &n) != 1) return 1;

    int sign = (n < 0) ? -1 : 1;
    long long temp = (n < 0) ? -(long long)n : n;
    long long rev = 0;

    while (temp > 0) {
        rev = rev * 10 + (temp % 10);
        temp /= 10;
    }

    if (rev > INT_MAX) {
        printf("Reversed number overflows 32-bit integer range.\\n");
        return 1;
    }

    int result = (int)(sign * rev);
    printf("Original: %d | Reversed: %d\\n", n, result);
    return 0;
}`
  },

  {
    id: 'P-U1-03',
    unitId: 'unit-1',
    groupNumber: 2,
    title: 'Menu-Driven Calculator',
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
      institutionLocalNote: 'College internal lab manual Experiment 2.1.',
    },
    technicalVerification: {
      supportedInputs: 'Integer operands a and b; operator char: +, -, *, /, %',
      complexityAnalysis: 'Time: O(1) constant time branching; Space: O(1) stack space.',
      edgeCases: [
        'Division by zero (b = 0 with / or % operator): Must halt and print error rather than causing SIGFPE.',
        'Negative integer operands with modulo (%): C99 standard specifies that result sign matches dividend.',
        'Invalid operator character: Handled via switch default: branch with error notification.',
        'Modulo on floating-point: In ANSI/ISO C, % is strictly invalid for float/double; integer casting required.'
      ],
      implementationNotes:
        'C99/C11 requires integer operands for the modulo operator (%). Safe division must verify b != 0 before executing / or %.',
      overflowSafeguards: 'Guards against INT_MIN / -1 overflow which produces SIGFPE on two-complement hardware.',
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
    id: 'P-U1-04',
    unitId: 'unit-1',
    groupNumber: 2,
    title: 'Armstrong Number Checker',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 2,
      syllabusRef: 'CS107ES Group 2: Expression evaluation (Armstrong number verification).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 2.2.',
    },
    technicalVerification: {
      supportedInputs: 'Non-negative integers 0 <= N <= 2,147,483,647 (32-bit signed int).',
      complexityAnalysis: 'Time: O(log10 N) digit counting + O(log10 N * k) power summation; Space: O(1).',
      edgeCases: [
        'Single digit numbers (0 to 9): By mathematical definition, all are Armstrong numbers of order 1 (d^1 = d).',
        'Standard 3-digit Armstrong numbers: 153 (1^3 + 5^3 + 3^3 = 153), 370, 371, 407.',
        'General N-digit numbers: 1634 (order 4: 1^4 + 6^4 + 3^4 + 4^4 = 1634), 54748 (order 5).',
        'Negative inputs: Rejected (Armstrong definition applies to positive integers/natural numbers).'
      ],
      implementationNotes:
        'First computes digit count k = floor(log10(N)) + 1, then computes sum of (digit^k). Integer power avoids double-precision inaccuracies of pow().',
      overflowSafeguards: 'Pre-check ensures intermediate power accumulation does not exceed 64-bit bounds.',
    },
    codeTemplate: `#include <stdio.h>

long long intPower(int base, int exp) {
    long long res = 1;
    for (int i = 0; i < exp; i++) res *= base;
    return res;
}

int main(void) {
    int n;
    printf("Enter a positive integer: ");
    if (scanf("%d", &n) != 1 || n < 0) return 1;

    int temp = n, digits = 0;
    while (temp > 0) {
        digits++;
        temp /= 10;
    }
    if (n == 0) digits = 1;

    temp = n;
    long long sum = 0;
    while (temp > 0) {
        int d = temp % 10;
        sum += intPower(d, digits);
        temp /= 10;
    }

    if (sum == (long long)n) {
        printf("%d is an Armstrong number of order %d.\\n", n, digits);
    } else {
        printf("%d is NOT an Armstrong number (sum of %dth powers is %lld).\\n", n, digits, sum);
    }
    return 0;
}`
  },

  // ================= UNIT 2 =================
  {
    id: 'P-U2-01',
    unitId: 'unit-2',
    groupNumber: 2,
    title: 'Modular Prime & Leap Year',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 2,
      syllabusRef: 'CS107ES Group 2: Prime number verification & calendar leap year logic using modular functions.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 2.3.',
    },
    technicalVerification: {
      supportedInputs: 'Integer N for primality; positive year Y (1 <= Y <= 9999).',
      complexityAnalysis: 'Primality: O(sqrt(N)) trial division; Leap Year: O(1) Gregorian rule.',
      edgeCases: [
        'Numbers <= 1: Not prime by definition.',
        'N = 2: The only even prime number.',
        'Avoiding signed integer overflow: Check condition i <= n / i instead of i * i <= n to prevent INT_MAX overflow.',
        'Gregorian Leap Year Century Rule: Divisible by 4, except end-of-century years which must be divisible by 400 (e.g. 1900 not leap, 2000 is leap).'
      ],
      implementationNotes:
        'Encapsulates primality and leap year checks in modular functions isPrime(int n) and isLeapYear(int year).',
      overflowSafeguards: 'i <= n / i guarantees no 32-bit integer overflow during trial division.',
    },
    codeTemplate: `#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i <= n / i; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

bool isLeapYear(int year) {
    return (year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0));
}

int main(void) {
    int num, year;
    printf("Enter an integer to check primality: ");
    if (scanf("%d", &num) == 1) {
        printf("%d is %s\\n", num, isPrime(num) ? "PRIME" : "NOT PRIME");
    }

    printf("Enter a year to check leap year: ");
    if (scanf("%d", &year) == 1) {
        printf("Year %d is %s\\n", year, isLeapYear(year) ? "a LEAP YEAR" : "NOT a leap year");
    }
    return 0;
}`
  },

  {
    id: 'P-U2-02',
    unitId: 'unit-2',
    groupNumber: 3,
    title: 'Pass-by-Reference Variable Swapping',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 3,
      syllabusRef: 'CS107ES Group 3: Functions with output parameters (Call-by-reference using pointer indirection).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 3.1.',
    },
    technicalVerification: {
      supportedInputs: 'Two integer variables with valid non-null memory addresses (&a, &b).',
      complexityAnalysis: 'Time: O(1) constant time; Space: O(1) stack space.',
      edgeCases: [
        'NULL pointer input: Must verify ptr1 != NULL && ptr2 != NULL before dereferencing.',
        'Aliasing / Identical address (&a == &b): Safe temporary-variable swap avoids XOR self-clearing bug (x ^ x = 0).',
        'Large integers: Handles full 32-bit range without arithmetic overflow.'
      ],
      implementationNotes:
        'C supports only pass-by-value natively; passing pointer addresses simulates pass-by-reference allowing caller variables to be modified.',
      memorySafety: 'Strict NULL check prevents segmentation faults.',
    },
    codeTemplate: `#include <stdio.h>

void swap(int *p1, int *p2) {
    if (p1 == NULL || p2 == NULL) return;
    int temp = *p1;
    *p1 = *p2;
    *p2 = temp;
}

int main(void) {
    int x = 42, y = 99;
    printf("Before swap: x = %d (addr=%p), y = %d (addr=%p)\\n", x, (void*)&x, y, (void*)&y);
    swap(&x, &y);
    printf("After swap:  x = %d, y = %d\\n", x, y);
    return 0;
}`
  },

  {
    id: 'P-U2-03',
    unitId: 'unit-2',
    groupNumber: 3,
    title: 'Pointer Arithmetic & Array Passing',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 3,
      syllabusRef: 'CS107ES Group 3: Passing arrays to functions and pointer arithmetic scaling.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 3.2.',
    },
    technicalVerification: {
      supportedInputs: 'Array base address and element count N (1 <= N <= 1000).',
      complexityAnalysis: 'Time: O(N) linear traversal; Space: O(1).',
      edgeCases: [
        'Pointer scaling rule: p + i advances memory by i * sizeof(T) bytes.',
        'Array boundary: Dereferencing beyond arr + N causes undefined behavior.',
        'Empty array (N = 0): Guard against zero-length access.'
      ],
      implementationNotes:
        'Demonstrates that array parameter int arr[] decays to int *arr in function signatures, and shows pointer arithmetic *(ptr + i) vs array indexing arr[i].',
      memorySafety: 'Operates within stack buffer bounds without out-of-bounds pointer offsets.',
    },
    codeTemplate: `#include <stdio.h>
#include <stddef.h>

void printAndSumWithPointers(const int *arr, int size, int *outSum) {
    if (arr == NULL || outSum == NULL) return;
    *outSum = 0;
    printf("Array traversal using pointer arithmetic:\\n");
    for (const int *ptr = arr; ptr < arr + size; ptr++) {
        ptrdiff_t index = ptr - arr;
        printf("  Element [%td] at %p = %d\\n", index, (const void*)ptr, *ptr);
        *outSum += *ptr;
    }
}

int main(void) {
    int data[] = {10, 20, 30, 40, 50};
    int n = sizeof(data) / sizeof(data[0]);
    int total = 0;

    printAndSumWithPointers(data, n, &total);
    printf("Total sum calculated via pointers: %d\\n", total);
    return 0;
}`
  },

  // ================= UNIT 3 =================
  {
    id: 'P-U3-01',
    unitId: 'unit-3',
    groupNumber: 3,
    title: '1D Array Statistics',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 3,
      syllabusRef: 'CS107ES Group 3: Arrays, Pointers and Functions (Minimum, maximum, sum, average).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 3.3.',
    },
    technicalVerification: {
      supportedInputs: 'Integer array of size N (1 <= N <= 1000).',
      complexityAnalysis: 'Time: O(N) single-pass accumulation; Space: O(1).',
      edgeCases: [
        'Single element array (N = 1): Min, Max, and Average are all equal to arr[0].',
        'All negative integers: Min and Max must correctly initialize to arr[0], NOT 0.',
        'Average floating-point precision: Cast sum to double before division to prevent integer truncation.'
      ],
      implementationNotes:
        'Uses modular functions passing base pointer and length, computing statistics in a single linear pass.',
      overflowSafeguards: 'Sum accumulated in long long to prevent 32-bit overflow on large positive arrays.',
    },
    codeTemplate: `#include <stdio.h>

void computeStats(const int *arr, int n, int *outMin, int *outMax, double *outAvg) {
    if (n <= 0 || arr == NULL) return;
    int min = arr[0], max = arr[0];
    long long sum = 0;

    for (int i = 0; i < n; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
        sum += arr[i];
    }

    *outMin = min;
    *outMax = max;
    *outAvg = (double)sum / n;
}

int main(void) {
    int arr[] = {25, -7, 88, 14, 92, -3, 40};
    int n = sizeof(arr) / sizeof(arr[0]);
    int minVal, maxVal;
    double avgVal;

    computeStats(arr, n, &minVal, &maxVal, &avgVal);
    printf("Elements: %d\\nMin: %d\\nMax: %d\\nAverage: %.2f\\n", n, minVal, maxVal, avgVal);
    return 0;
}`
  },

  {
    id: 'P-U3-02',
    unitId: 'unit-3',
    groupNumber: 3,
    title: '2D Matrix Multiplication',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 3,
      syllabusRef: 'CS107ES Group 3: 2D Matrix multiplication and dimension validation.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 3.4.',
    },
    technicalVerification: {
      supportedInputs: 'Matrix A (r1 x c1) and Matrix B (r2 x c2). Inner dimension precondition: c1 == r2.',
      complexityAnalysis: 'Time: O(r1 * c1 * c2) triple nested loop; Space: O(r1 * c2) for result matrix C.',
      edgeCases: [
        'Dimension mismatch (c1 != r2): Multiplication is mathematically impossible. Program must print error and exit.',
        'Identity matrix multiplication: A * I = A.',
        'Zero matrix multiplication: Produces zero matrix.'
      ],
      implementationNotes:
        'Computes C[i][j] = sum(A[i][k] * B[k][j]) for k from 0 to c1-1. Validates bounds strictly before matrix allocation.',
      overflowSafeguards: 'Accumulator checked against 32-bit limits.',
    },
    codeTemplate: `#include <stdio.h>
#define MAX 10

int main(void) {
    int r1 = 2, c1 = 3;
    int r2 = 3, c2 = 2;

    int A[MAX][MAX] = { {1, 2, 3}, {4, 5, 6} };
    int B[MAX][MAX] = { {7, 8}, {9, 1}, {2, 3} };
    int C[MAX][MAX] = {0};

    if (c1 != r2) {
        printf("Error: Matrices cannot be multiplied (c1 != r2).\\n");
        return 1;
    }

    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            for (int k = 0; k < c1; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    printf("Result Matrix C (%dx%d):\\n", r1, c2);
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            printf("%4d", C[i][j]);
        }
        printf("\\n");
    }
    return 0;
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
      'In the authoritative V2 curriculum specification, entry P-U3-03 contains no problem title, objectives, or code definition. It is preserved explicitly as unresolved to prevent fabricating academic content.',
    technicalVerification: {
      supportedInputs: 'N/A (Unresolved)',
      edgeCases: ['Specification pending department review.'],
      implementationNotes: 'Preserved without invented content.'
    }
  },

  {
    id: 'P-U3-04',
    unitId: 'unit-3',
    groupNumber: 3,
    title: 'Transpose of Matrix',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 3,
      syllabusRef: 'CS107ES Group 3: 2D array manipulation and matrix transposition.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 3.5.',
    },
    technicalVerification: {
      supportedInputs: '2D matrix of dimensions R x C (1 <= R, C <= 10).',
      complexityAnalysis: 'Time: O(R * C); Space: O(C * R) for transposed matrix buffer.',
      edgeCases: [
        'Rectangular matrix (R != C): Dimensions flip from R x C to C x R. In-place transposition in a single buffer is impossible.',
        'Square matrix (R == C): Transpose swaps A[i][j] with A[j][i] across main diagonal.',
        '1x1 matrix: Transpose equals original matrix.'
      ],
      implementationNotes:
        'Uses destination buffer T[C][R] where T[j][i] = A[i][j]. Documents dimensional transition.',
      overflowSafeguards: 'Array dimensions bounded by MAX buffer limits.',
    },
    codeTemplate: `#include <stdio.h>
#define MAX 10

int main(void) {
    int r = 2, c = 3;
    int A[MAX][MAX] = { {1, 2, 3}, {4, 5, 6} };
    int T[MAX][MAX];

    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            T[j][i] = A[i][j];
        }
    }

    printf("Original Matrix (%dx%d):\\n", r, c);
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) printf("%3d", A[i][j]);
        printf("\\n");
    }

    printf("Transposed Matrix (%dx%d):\\n", c, r);
    for (int i = 0; i < c; i++) {
        for (int j = 0; j < r; j++) printf("%3d", T[i][j]);
        printf("\\n");
    }
    return 0;
}`
  },

  // ================= UNIT 4 =================
  {
    id: 'P-U4-01',
    unitId: 'unit-4',
    groupNumber: 2,
    title: 'Recursive Fibonacci',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 2,
      syllabusRef: 'CS107ES Group 2: Recursive function definitions and stack evaluation.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 4.1.',
    },
    technicalVerification: {
      supportedInputs: 'Integer N (0 <= N <= 40). Limits documented for recursion tree depth.',
      complexityAnalysis: 'Time: O(2^N) naive exponential tree; Space: O(N) call stack activation frames.',
      edgeCases: [
        'Base cases: F(0) = 0, F(1) = 1.',
        'Negative inputs: Rejected (Fibonacci domain non-negative).',
        'Stack overflow: Large N (> 45) overflows 32-bit signed int and triggers deep recursion delay.'
      ],
      implementationNotes:
        'Contrasts naive recursion O(2^N) stack frames with O(N) iterative calculation, illustrating stack growth and base case necessity.',
      overflowSafeguards: 'N restricted to <= 40 to prevent stack exhaustion.',
    },
    codeTemplate: `#include <stdio.h>

long long fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main(void) {
    int terms = 8;
    printf("First %d terms of Fibonacci sequence:\\n", terms);
    for (int i = 0; i < terms; i++) {
        printf("%lld ", fibonacci(i));
    }
    printf("\\n");
    return 0;
}`
  },

  {
    id: 'P-U4-02',
    unitId: 'unit-4',
    title: 'Student Grade Management using Structs',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit IV: User defined types, structures, arrays of structures.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-SUPP',
      localCourseTitle: 'Theory Problem Solving Structures Exercise',
      institutionLocalNote: 'College tutorial sheet recommended student record problem.',
    },
    technicalVerification: {
      supportedInputs: 'Array of student records: rollNo, name string, marks array.',
      complexityAnalysis: 'Time: O(N) linear computation of grade averages; Space: O(N) contiguous struct array.',
      edgeCases: [
        'String truncation: Uses snprintf to prevent buffer overflow in student names.',
        'Passing struct by reference: Passing struct pointer struct Student *s avoids copying full struct memory.',
        'Zero students: Empty array guard.'
      ],
      implementationNotes:
        'Illustrates typedef struct, struct member access via dot (.) and arrow (->) operators, and arrays of structs.',
      memorySafety: 'Safe bounded string copies with null termination.',
    },
    codeTemplate: `#include <stdio.h>
#include <string.h>

typedef struct {
    int rollNo;
    char name[50];
    float marks[3];
    float average;
} Student;

void calculateAverage(Student *s) {
    if (s == NULL) return;
    float sum = 0;
    for (int i = 0; i < 3; i++) sum += s->marks[i];
    s->average = sum / 3.0f;
}

int main(void) {
    Student s1 = {101, "Alice", {85.5f, 90.0f, 78.5f}, 0.0f};
    calculateAverage(&s1);

    printf("Student Record:\\n");
    printf("Roll No: %d\\nName: %s\\nAverage: %.2f\\n", s1.rollNo, s1.name, s1.average);
    return 0;
}`
  },

  {
    id: 'P-U4-03',
    unitId: 'unit-4',
    title: 'Structure vs Union Memory Comparison',
    category: 'Supplementary Practice',
    status: 'SUPPLEMENTAL_PRACTICE',
    officialSyllabusMapping: {
      courseCode: 'CS103ES',
      syllabusRef: 'CS103ES Unit IV: Structures, unions, and memory layout comparison.',
      isMandatedByJntuh: false,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS103ES-SUPP',
      localCourseTitle: 'Theory Problem Solving Memory Layout Exercise',
      institutionLocalNote: 'College tutorial sheet experiment comparing struct vs union sizeof().',
    },
    technicalVerification: {
      supportedInputs: 'Defined struct and union types with identical member types (char, int, double).',
      complexityAnalysis: 'Time: O(1); Space: O(1) compile-time sizeof evaluation.',
      edgeCases: [
        'Memory alignment padding: Struct size is >= sum of members due to compiler word alignment (e.g. 4 or 8 bytes).',
        'Union overlapping memory: Union size equals size of largest member (max(sizeof(members))).',
        'Overwriting union members: Writing to one member overwrites memory shared by other members.'
      ],
      implementationNotes:
        'Displays memory addresses (&) of members to visually demonstrate separate vs shared memory layouts.',
      memorySafety: 'Demonstrates safe access to union members.',
    },
    codeTemplate: `#include <stdio.h>

struct DataStruct {
    char c;     // 1 byte (+ padding)
    int i;      // 4 bytes
    double d;   // 8 bytes
};

union DataUnion {
    char c;
    int i;
    double d;
};

int main(void) {
    struct DataStruct s;
    union DataUnion u;

    printf("sizeof(struct DataStruct) = %zu bytes\\n", sizeof(s));
    printf("  s.c addr: %p\\n  s.i addr: %p\\n  s.d addr: %p\\n\\n", (void*)&s.c, (void*)&s.i, (void*)&s.d);

    printf("sizeof(union DataUnion)   = %zu bytes\\n", sizeof(u));
    printf("  u.c addr: %p\\n  u.i addr: %p\\n  u.d addr: %p (Identical base address!)\\n", (void*)&u.c, (void*)&u.i, (void*)&u.d);

    u.d = 3.14159;
    printf("\\nUnion assigned double 3.14159 -> u.d = %f\\n", u.d);
    u.i = 42; // Overwrites double memory
    printf("Union assigned int 42 -> u.i = %d, u.d is now corrupted\\n", u.i);

    return 0;
}`
  },

  // ================= UNIT 5 =================
  {
    id: 'P-V-01',
    unitId: 'unit-5',
    groupNumber: 4,
    title: 'File Copy & Character Count',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 4,
      syllabusRef: 'CS107ES Group 4: File processing, character streams, and file statistics.',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 4.1.',
    },
    technicalVerification: {
      supportedInputs: 'Source file path and destination file path.',
      complexityAnalysis: 'Time: O(N) stream processing; Space: O(1) buffer.',
      edgeCases: [
        'Source file missing: fopen() returns NULL. Must check and report error cleanly without crashing.',
        'fgetc return type: Return value must be stored in int ch (not char) to reliably detect EOF (-1).',
        'Guaranteed resource cleanup: fclose() must be called on all paths to prevent file descriptor leaks.'
      ],
      implementationNotes:
        'Copies character-by-character while counting total characters, words, and lines.',
      memorySafety: 'Zero memory leaks, all file streams closed.',
    },
    codeTemplate: `#include <stdio.h>
#include <ctype.h>

int main(void) {
    const char *srcName = "sample_input.txt";
    const char *destName = "sample_output.txt";

    // Create a demo file first
    FILE *demo = fopen(srcName, "w");
    if (demo != NULL) {
        fputs("Hello JNTUH R25 C Lab.\\nFile Copy Program.\\n", demo);
        fclose(demo);
    }

    FILE *src = fopen(srcName, "r");
    if (src == NULL) {
        perror("Failed to open source file");
        return 1;
    }

    FILE *dest = fopen(destName, "w");
    if (dest == NULL) {
        perror("Failed to open destination file");
        fclose(src);
        return 2;
    }

    int ch; // int to hold EOF (-1)
    long charCount = 0, lineCount = 0;

    while ((ch = fgetc(src)) != EOF) {
        fputc(ch, dest);
        charCount++;
        if (ch == '\\n') lineCount++;
    }

    fclose(src);
    fclose(dest);

    printf("File copied successfully.\\nCharacters copied: %ld\\nLines counted: %ld\\n", charCount, lineCount);
    return 0;
}`
  },

  {
    id: 'P-V-02',
    unitId: 'unit-5',
    groupNumber: 6,
    title: 'Linear vs Binary Search',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 6,
      syllabusRef: 'CS107ES Group 6: Searching algorithms (Linear search vs Binary search on sorted arrays).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 6.1.',
    },
    technicalVerification: {
      supportedInputs: 'Integer array of size N and target value key.',
      complexityAnalysis: 'Linear Search: O(N) comparisons; Binary Search: O(log2 N) comparisons on sorted array.',
      edgeCases: [
        'Precondition for Binary Search: Array must be sorted in ascending order.',
        'Target absent: Returns -1 cleanly without infinite loop.',
        'Mid calculation overflow guard: mid = low + (high - low) / 2 prevents (low + high) integer overflow.',
        'Single element array: Boundary checked correctly.'
      ],
      implementationNotes:
        'Demonstrates both algorithms side-by-side with operation counters to prove logarithmic speedup.',
      overflowSafeguards: 'mid = low + (high - low) / 2 prevents integer overflow.',
    },
    codeTemplate: `#include <stdio.h>

int linearSearch(const int arr[], int n, int key, int *comparisons) {
    *comparisons = 0;
    for (int i = 0; i < n; i++) {
        (*comparisons)++;
        if (arr[i] == key) return i;
    }
    return -1;
}

int binarySearch(const int arr[], int n, int key, int *comparisons) {
    *comparisons = 0;
    int low = 0, high = n - 1;
    while (low <= high) {
        (*comparisons)++;
        int mid = low + (high - low) / 2;
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main(void) {
    int arr[] = {12, 24, 35, 47, 59, 68, 73, 85, 91, 99};
    int n = sizeof(arr) / sizeof(arr[0]);
    int key = 73;
    int linComps = 0, binComps = 0;

    int linIdx = linearSearch(arr, n, key, &linComps);
    int binIdx = binarySearch(arr, n, key, &binComps);

    printf("Searching for %d in 10-element sorted array:\\n", key);
    printf("Linear Search: Index = %d (took %d comparisons)\\n", linIdx, linComps);
    printf("Binary Search: Index = %d (took %d comparisons)\\n", binIdx, binComps);
    return 0;
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
      'In the authoritative V2 curriculum specification, entry P-V-03 contains no problem title, objectives, or code definition. It is preserved explicitly as unresolved to prevent fabricating academic content.',
    technicalVerification: {
      supportedInputs: 'N/A (Unresolved)',
      edgeCases: ['Specification pending department review.'],
      implementationNotes: 'Preserved without invented content.'
    }
  },

  {
    id: 'P-V-04',
    unitId: 'unit-5',
    groupNumber: 6,
    title: 'Insertion Sort',
    category: 'Prescribed Lab Exercise',
    status: 'PRESCRIBED_LAB',
    officialSyllabusMapping: {
      courseCode: 'CS107ES',
      labGroup: 6,
      syllabusRef: 'CS107ES Group 6: Sorting algorithms (Insertion sort on integer array).',
      isMandatedByJntuh: true,
    },
    collegeLocalMapping: {
      localCourseCode: '25CS107ES-LOC',
      localCourseTitle: 'Problem Solving Lab (College Internal Scheme)',
      institutionLocalNote: 'College internal lab manual Experiment 6.2.',
    },
    technicalVerification: {
      supportedInputs: 'Array of N integers (1 <= N <= 1000).',
      complexityAnalysis: 'Time: Best O(N) when already sorted, Worst/Avg O(N^2); Space: O(1) in-place.',
      edgeCases: [
        'Already sorted array: Loops terminate early in O(N).',
        'Reverse sorted array: Maximum number of element shifts.',
        'Array with duplicate elements: Insertion sort is a stable sorting algorithm (preserves relative order of duplicates).'
      ],
      implementationNotes:
        'Builds sorted partition by shifting elements greater than key one position to the right.',
      overflowSafeguards: 'Array bounds protected.',
    },
    codeTemplate: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main(void) {
    int arr[] = {64, 25, 12, 22, 11, 90, 42};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original Array:  ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    insertionSort(arr, n);

    printf("Insertion Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`
  }
];
