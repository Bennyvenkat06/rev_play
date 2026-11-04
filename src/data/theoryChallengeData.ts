import { TheoryQuestion } from '../types/theoryChallenge';

export const THEORY_QUESTION_BANK: TheoryQuestion[] = [
  // =========================================================================
  // UNIT 1: C Fundamentals, Decisions, Loops
  // =========================================================================
  {
    id: 'TQ-U1-01',
    unitId: 'unit-1',
    unitNumber: 1,
    topic: 'Logical Operators & Short-Circuit Evaluation',
    type: 'OUTPUT_PREDICTION',
    difficulty: 'Medium',
    prompt: 'Predict the exact standard output of this C program demonstrating logical short-circuit evaluation:',
    codeSnippet: `#include <stdio.h>

int main(void) {
    int a = 1, b = 0;
    if (a || ++b) {
        printf("A:%d, B:%d\\n", a, b);
    } else {
        printf("Fail\\n");
    }
    return 0;
}`,
    options: [
      { id: 'opt-1', text: 'A:1, B:0', isCorrect: true },
      { id: 'opt-2', text: 'A:1, B:1', isCorrect: false },
      { id: 'opt-3', text: 'Fail', isCorrect: false },
      { id: 'opt-4', text: 'Compilation Error', isCorrect: false },
    ],
    explanation:
      'In C99 §6.5.14, the logical OR (||) operator guarantees left-to-right evaluation with short-circuit behavior. Since `a` is 1 (non-zero/true), the entire condition is already satisfied. The right operand `++b` is never evaluated, leaving `b` as 0.',
    hint: 'Does the right operand of || execute when the left operand is non-zero?',
    cStandardRef: 'ISO/IEC 9899:1999 §6.5.14 (Logical OR operator)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U1-02',
    unitId: 'unit-1',
    unitNumber: 1,
    topic: 'Operator Precedence and Associativity',
    type: 'CONCEPTUAL_REASONING',
    difficulty: 'Easy',
    prompt: 'Which of the following expressions evaluates first according to standard C operator precedence?',
    codeSnippet: `int result = a + b * c - d / e;`,
    options: [
      { id: 'opt-1', text: 'Addition (a + b)', isCorrect: false },
      { id: 'opt-2', text: 'Multiplicative operators (* and /) with left-to-right associativity', isCorrect: true },
      { id: 'opt-3', text: 'Subtraction (c - d)', isCorrect: false },
      { id: 'opt-4', text: 'Division (d / e) always before multiplication', isCorrect: false },
    ],
    explanation:
      'In C precedence tables, multiplicative operators (*, /, %) have higher precedence than additive operators (+, -). Between * and /, associativity is left-to-right, so `b * c` is evaluated before `d / e`.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.5 (Expressions)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U1-03',
    unitId: 'unit-1',
    unitNumber: 1,
    topic: 'Switch Fallthrough Mechanics',
    type: 'FIND_THE_ERROR',
    difficulty: 'Medium',
    prompt: 'Identify the logical defect in the switch statement below that causes multiple cases to execute unintendedly:',
    codeSnippet: `int code = 2;
switch (code) {
    case 1: printf("One ");
    case 2: printf("Two ");
    case 3: printf("Three ");
    default: printf("Done");
}`,
    options: [
      { id: 'opt-1', text: 'Case labels cannot be integers', isCorrect: false },
      { id: 'opt-2', text: 'Missing `break;` statements cause unconditional fallthrough to subsequent cases', isCorrect: true },
      { id: 'opt-3', text: 'The default case must be placed at the very top of the switch', isCorrect: false },
      { id: 'opt-4', text: 'The switch variable must be enclosed in double parentheses', isCorrect: false },
    ],
    explanation:
      'In C switch statements, cases do not automatically break. Control falls through into subsequent case statements until a `break;` is encountered or the switch block terminates. Output is "Two Three Done".',
    cStandardRef: 'ISO/IEC 9899:1999 §6.8.4.2 (The switch statement)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U1-04',
    unitId: 'unit-1',
    unitNumber: 1,
    topic: 'Data Types & Storage Classes',
    type: 'MULTIPLE_SELECT',
    difficulty: 'Hard',
    prompt: 'Which of the following are valid primitive data types or type specifiers in standard C99? (Select all that apply)',
    options: [
      { id: 'opt-1', text: '_Bool', isCorrect: true },
      { id: 'opt-2', text: 'long long int', isCorrect: true },
      { id: 'opt-3', text: 'string', isCorrect: false },
      { id: 'opt-4', text: 'unsigned char', isCorrect: true },
    ],
    explanation:
      'In C99, `_Bool` was introduced as a primitive keyword (often used via `<stdbool.h>` as `bool`). `long long int` is guaranteed to be at least 64 bits. `unsigned char` is a standard 1-byte type. `string` is NOT a primitive keyword in C (strings are null-terminated char arrays).',
    cStandardRef: 'ISO/IEC 9899:1999 §6.2.5 (Types)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U1-05',
    unitId: 'unit-1',
    unitNumber: 1,
    topic: 'For-Loop Initialization and Termination',
    type: 'CODE_TRACING',
    difficulty: 'Medium',
    prompt: 'Trace the value of variable `count` after the nested loop finishes execution:',
    codeSnippet: `int count = 0;
for (int i = 0; i < 3; i++) {
    for (int j = i; j < 3; j++) {
        count++;
    }
}`,
    options: [
      { id: 'opt-1', text: 'count = 6', isCorrect: true },
      { id: 'opt-2', text: 'count = 9', isCorrect: false },
      { id: 'opt-3', text: 'count = 3', isCorrect: false },
      { id: 'opt-4', text: 'count = 5', isCorrect: false },
    ],
    explanation:
      'Trace: \n- i=0: j runs 0, 1, 2 (3 iterations)\n- i=1: j runs 1, 2 (2 iterations)\n- i=2: j runs 2 (1 iteration)\nTotal count = 3 + 2 + 1 = 6.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.8.5.3 (The for statement)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },

  // =========================================================================
  // UNIT 2: Functions & Pointers
  // =========================================================================
  {
    id: 'TQ-U2-01',
    unitId: 'unit-2',
    unitNumber: 2,
    topic: 'Pointer Dereferencing & Indirection',
    type: 'OUTPUT_PREDICTION',
    difficulty: 'Medium',
    prompt: 'Predict the printed values of x and y after the pointer operations below:',
    codeSnippet: `#include <stdio.h>

int main(void) {
    int x = 10, y = 20;
    int *p1 = &x, *p2 = &y;
    *p1 = *p2 + 5;
    *p2 = *p1 * 2;
    printf("x=%d, y=%d\\n", x, y);
    return 0;
}`,
    options: [
      { id: 'opt-1', text: 'x=25, y=50', isCorrect: true },
      { id: 'opt-2', text: 'x=10, y=20', isCorrect: false },
      { id: 'opt-3', text: 'x=25, y=40', isCorrect: false },
      { id: 'opt-4', text: 'x=50, y=25', isCorrect: false },
    ],
    explanation:
      '1. `*p1 = *p2 + 5;` evaluates `20 + 5 = 25`, storing 25 into `x`.\n2. `*p2 = *p1 * 2;` evaluates `25 * 2 = 50`, storing 50 into `y`.\nPrinted output is "x=25, y=50".',
    cStandardRef: 'ISO/IEC 9899:1999 §6.5.3.2 (Address and indirection operators)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U2-02',
    unitId: 'unit-2',
    unitNumber: 2,
    topic: 'Pointer Arithmetic & Byte Scaling',
    type: 'CONCEPTUAL_REASONING',
    difficulty: 'Hard',
    prompt: 'On an architecture where `sizeof(int) == 4`, if pointer `p` holds memory address `0x2000`, what is the address value of `p + 3`?',
    options: [
      { id: 'opt-1', text: '0x2003', isCorrect: false },
      { id: 'opt-2', text: '0x200C (0x2000 + 12 bytes)', isCorrect: true },
      { id: 'opt-3', text: '0x2012', isCorrect: false },
      { id: 'opt-4', text: '0x2004', isCorrect: false },
    ],
    explanation:
      'Pointer arithmetic scales offsets by the size of the referenced type (`sizeof(*p)`). Adding 3 to an `int *` advances the address by `3 * sizeof(int) = 3 * 4 = 12 bytes` (which is `0x0C` in hex). Address: `0x2000 + 0x0C = 0x200C`.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.5.6 (Additive operators)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U2-03',
    unitId: 'unit-2',
    unitNumber: 2,
    topic: 'Pass-by-Value vs Output Parameters',
    type: 'FILL_MISSING_STEP',
    difficulty: 'Medium',
    prompt: 'Complete the swap function prototype and caller invocation so variables `a` and `b` in `main()` are modified by reference:',
    codeSnippet: `// Function prototype:
void swap(_______, _______);

int main(void) {
    int a = 5, b = 10;
    swap(_______, _______);
    return 0;
}`,
    options: [
      { id: 'opt-1', text: 'Prototype: (int *x, int *y); Caller: (&a, &b)', isCorrect: true },
      { id: 'opt-2', text: 'Prototype: (int x, int y); Caller: (a, b)', isCorrect: false },
      { id: 'opt-3', text: 'Prototype: (int &x, int &y); Caller: (a, b)', isCorrect: false },
      { id: 'opt-4', text: 'Prototype: (int *x, int *y); Caller: (*a, *b)', isCorrect: false },
    ],
    explanation:
      'C is strictly call-by-value. To simulate call-by-reference output parameters, the function must receive pointer addresses (`int *x, int *y`) and the caller must pass variable addresses using the address-of operator (`&a, &b`). Note: `int &x` is C++ reference syntax, illegal in C.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.9.1 (Function definitions)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U2-04',
    unitId: 'unit-2',
    unitNumber: 2,
    topic: 'Call Stack & Stack Frame Lifecycle',
    type: 'FIND_THE_ERROR',
    difficulty: 'Hard',
    prompt: 'Why is returning a pointer to a local variable considered undefined behavior in C?',
    codeSnippet: `int* createValue(void) {
    int val = 42;
    return &val; // Dangerous defect!
}`,
    options: [
      { id: 'opt-1', text: 'Local variable `val` has automatic storage duration; its stack memory is deallocated upon function exit, leaving a dangling pointer', isCorrect: true },
      { id: 'opt-2', text: 'Functions cannot return pointers to integer types', isCorrect: false },
      { id: 'opt-3', text: 'The return statement must use `*val` instead of `&val`', isCorrect: false },
      { id: 'opt-4', text: 'Pointers can only reference global variables', isCorrect: false },
    ],
    explanation:
      'Automatic variables allocated inside a function stack frame are destroyed when the stack frame is popped upon return. Returning `&val` produces a dangling pointer referencing reclaimed stack space. Dereferencing it yields undefined behavior.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.2.4 (Storage durations of objects)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },

  // =========================================================================
  // UNIT 3: Arrays, Matrices & Strings
  // =========================================================================
  {
    id: 'TQ-U3-01',
    unitId: 'unit-3',
    unitNumber: 3,
    topic: 'Array Name Decay to Pointer',
    type: 'CONCEPTUAL_REASONING',
    difficulty: 'Medium',
    prompt: 'In C, what is the fundamental difference between `sizeof(arr)` and `sizeof(ptr)` when `arr` is declared as `int arr[10]` and `ptr` as `int *ptr = arr`?',
    options: [
      { id: 'opt-1', text: '`sizeof(arr)` yields total array byte size (40 bytes), while `sizeof(ptr)` yields pointer size (4 or 8 bytes)', isCorrect: true },
      { id: 'opt-2', text: 'Both expressions evaluate to 40 bytes', isCorrect: false },
      { id: 'opt-3', text: 'Both expressions evaluate to 8 bytes on a 64-bit OS', isCorrect: false },
      { id: 'opt-4', text: '`sizeof(arr)` triggers a compiler error because array lengths cannot be determined', isCorrect: false },
    ],
    explanation:
      'In C, the name of an array in `sizeof(arr)` does not decay to a pointer; it evaluates to the total bytes allocated for all elements (10 * 4 = 40 bytes). In contrast, `sizeof(ptr)` evaluates to the size of a memory address on the target architecture (4 bytes on 32-bit, 8 bytes on 64-bit).',
    cStandardRef: 'ISO/IEC 9899:1999 §6.3.2.1 (Lvalues, arrays, and function designators)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U3-02',
    unitId: 'unit-3',
    unitNumber: 3,
    topic: '2D Array Memory Layout & Row-Major Order',
    type: 'CODE_TRACING',
    difficulty: 'Hard',
    prompt: 'Given matrix `int M[2][3] = {{10, 20, 30}, {40, 50, 60}};`, what value is accessed by expression `*(*(M + 1) + 2)`?',
    options: [
      { id: 'opt-1', text: '60 (Element M[1][2])', isCorrect: true },
      { id: 'opt-2', text: '30 (Element M[0][2])', isCorrect: false },
      { id: 'opt-3', text: '50 (Element M[1][1])', isCorrect: false },
      { id: 'opt-4', text: '40 (Element M[1][0])', isCorrect: false },
    ],
    explanation:
      'In C, `*(*(M + i) + j)` is equivalent to `M[i][j]`. Here `i = 1` and `j = 2`, accessing row 1, column 2 of the 0-indexed matrix. In `{ {10, 20, 30}, {40, 50, 60} }`, `M[1][2]` is 60.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.5.2.1 (Array subscripting)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U3-03',
    unitId: 'unit-3',
    unitNumber: 3,
    topic: 'String Null-Terminator Requirement',
    type: 'FIND_THE_ERROR',
    difficulty: 'Medium',
    prompt: 'What runtime bug occurs when executing `printf("%s", str)` on the character array below?',
    codeSnippet: `char str[5] = {'H', 'e', 'l', 'l', 'o'};
printf("%s\\n", str);`,
    options: [
      { id: 'opt-1', text: 'Memory overrun: Missing null-terminator `\\0` causes printf to read past array bounds into garbage memory until encountering a zero byte', isCorrect: true },
      { id: 'opt-2', text: 'Single quotes cannot be used for character constants', isCorrect: false },
      { id: 'opt-3', text: 'The array must be declared as `char *str[5]`', isCorrect: false },
      { id: 'opt-4', text: 'printf requires `%c` format specifier instead of `%s`', isCorrect: false },
    ],
    explanation:
      'In C, strings must terminate with the null character `\\0`. Because `str` has length 5 and holds 5 characters with no `\\0`, passing it to `%s` causes `printf` to continue reading adjacent memory until finding a random 0 byte, risking segmentation fault or garbage output.',
    cStandardRef: 'ISO/IEC 9899:1999 §7.1.1 (Definitions of terms in string handling)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },

  // =========================================================================
  // UNIT 4: Recursion, Structures & Unions
  // =========================================================================
  {
    id: 'TQ-U4-01',
    unitId: 'unit-4',
    unitNumber: 4,
    topic: 'Structure vs Union Memory Allocation',
    type: 'CONCEPTUAL_REASONING',
    difficulty: 'Medium',
    prompt: 'Which statement accurately describes the difference in memory layout between a `struct` and a `union` in C?',
    options: [
      { id: 'opt-1', text: 'A struct allocates separate memory for each member; a union allocates memory equal to its largest member, sharing the same base address across all members', isCorrect: true },
      { id: 'opt-2', text: 'A union allocates the sum of all members; a struct allocates only for the largest member', isCorrect: false },
      { id: 'opt-3', text: 'Unions cannot contain floating-point types, whereas structs can', isCorrect: false },
      { id: 'opt-4', text: 'Struct members are stored in heap memory, while union members are stored in CPU registers', isCorrect: false },
    ],
    explanation:
      'In C, all members of a `union` begin at the same memory address (`offset = 0`), and the union size is at least as large as its widest member. A `struct` allocates sequential memory for each member plus any necessary compiler alignment padding.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.7.2.1 (Structure and union specifiers)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U4-02',
    unitId: 'unit-4',
    unitNumber: 4,
    topic: 'Recursive Call Stack Growth',
    type: 'OUTPUT_PREDICTION',
    difficulty: 'Medium',
    prompt: 'Trace the output printed by the recursive function `countdown(3)`:',
    codeSnippet: `#include <stdio.h>

void countdown(int n) {
    if (n <= 0) return;
    printf("%d ", n);
    countdown(n - 1);
    printf("[%d] ", n);
}

int main(void) {
    countdown(3);
    return 0;
}`,
    options: [
      { id: 'opt-1', text: '3 2 1 [1] [2] [3]', isCorrect: true },
      { id: 'opt-2', text: '3 [3] 2 [2] 1 [1]', isCorrect: false },
      { id: 'opt-3', text: '1 2 3 [3] [2] [1]', isCorrect: false },
      { id: 'opt-4', text: '3 2 1', isCorrect: false },
    ],
    explanation:
      'The forward call prints `3 2 1` as stack frames are pushed. Once base case `n <= 0` is reached, recursion unwinds in reverse (LIFO order), printing `[1] [2] [3]` on return branches.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.8.6.4 (The return statement)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U4-03',
    unitId: 'unit-4',
    unitNumber: 4,
    topic: 'Structure Padding and Alignment',
    type: 'CONCEPTUAL_REASONING',
    difficulty: 'Hard',
    prompt: 'Why might `sizeof(struct Example)` evaluate to 8 bytes instead of 5 bytes on a 32/64-bit architecture with 4-byte alignment?',
    codeSnippet: `struct Example {
    char a;    // 1 byte
    int b;     // 4 bytes
};`,
    options: [
      { id: 'opt-1', text: 'Compiler inserts 3 bytes of alignment padding after member `a` so that integer `b` aligns on a 4-byte boundary', isCorrect: true },
      { id: 'opt-2', text: 'The character type `char` occupies 4 bytes in structs', isCorrect: false },
      { id: 'opt-3', text: 'The struct name occupies 3 bytes of header metadata', isCorrect: false },
      { id: 'opt-4', text: 'A null byte is automatically appended to all structs', isCorrect: false },
    ],
    explanation:
      'Processors access multi-byte words efficiently when aligned at multiples of their size. For a 4-byte `int`, the compiler places it at an offset divisible by 4. Member `a` takes offset 0, followed by 3 bytes of compiler padding, then `b` occupies offsets 4–7. Total size: 8 bytes.',
    cStandardRef: 'ISO/IEC 9899:1999 §6.7.2.1 paragraph 12 (Structure alignment)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },

  // =========================================================================
  // UNIT 5: File Handling & Searching / Sorting
  // =========================================================================
  {
    id: 'TQ-U5-01',
    unitId: 'unit-5',
    unitNumber: 5,
    topic: 'File Character Stream Handling & EOF',
    type: 'FIND_THE_ERROR',
    difficulty: 'Hard',
    prompt: 'Why must the return value of `fgetc()` be assigned to an `int` variable rather than a `char`?',
    codeSnippet: `FILE *fp = fopen("data.txt", "r");
char ch; // BUG!
while ((ch = fgetc(fp)) != EOF) {
    putchar(ch);
}`,
    options: [
      { id: 'opt-1', text: 'EOF is typically defined as -1. If char is unsigned by default on the target ABI, 255 cannot equal -1, resulting in an infinite loop', isCorrect: true },
      { id: 'opt-2', text: 'fgetc() only accepts file names as input arguments', isCorrect: false },
      { id: 'opt-3', text: 'putchar() cannot display char variables', isCorrect: false },
      { id: 'opt-4', text: 'char variables cannot be compared using !=', isCorrect: false },
    ],
    explanation:
      '`fgetc()` returns an `int` so that it can return all valid unsigned char values (`0` to `255`) PLUS the distinct negative sentinel value `EOF` (`-1`). If truncated into a `char`, on architectures where `char` is unsigned, `EOF` becomes `255`, causing `ch != EOF` to remain true indefinitely.',
    cStandardRef: 'ISO/IEC 9899:1999 §7.19.7.1 (The fgetc function)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U5-02',
    unitId: 'unit-5',
    unitNumber: 5,
    topic: 'Binary Search Algorithm Precondition & Mid Overflow',
    type: 'FILL_MISSING_STEP',
    difficulty: 'Medium',
    prompt: 'In binary search, which expression calculates the middle index safely without risking 32-bit signed integer overflow?',
    codeSnippet: `int binarySearch(int arr[], int low, int high, int key) {
    while (low <= high) {
        int mid = _________________________; // Safe mid calculation
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    options: [
      { id: 'opt-1', text: 'low + (high - low) / 2', isCorrect: true },
      { id: 'opt-2', text: '(low + high) / 2', isCorrect: false },
      { id: 'opt-3', text: '(low * high) / 2', isCorrect: false },
      { id: 'opt-4', text: 'high - low / 2', isCorrect: false },
    ],
    explanation:
      '`(low + high) / 2` fails when `low + high > INT_MAX` (2,147,483,647), causing negative signed overflow. The safe formula `low + (high - low) / 2` computes the exact same mathematical value while keeping all intermediate terms strictly within bounds.',
    cStandardRef: 'Algorithmic Safety Rule (CERT C INT32-C)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  },
  {
    id: 'TQ-U5-03',
    unitId: 'unit-5',
    unitNumber: 5,
    topic: 'Sorting Algorithm Time Complexity Comparisons',
    type: 'MULTIPLE_SELECT',
    difficulty: 'Medium',
    prompt: 'Which of the following statements about elementary sorting algorithms are TRUE? (Select all that apply)',
    options: [
      { id: 'opt-1', text: 'Insertion sort has an optimal O(N) best-case time complexity when the array is already sorted', isCorrect: true },
      { id: 'opt-2', text: 'Selection sort performs O(N^2) comparisons in all cases (best, average, and worst)', isCorrect: true },
      { id: 'opt-3', text: 'Binary search can be performed on an unsorted array with O(log N) time', isCorrect: false },
      { id: 'opt-4', text: 'Bubble sort with an early-exit swapped flag achieves O(N) for presorted input', isCorrect: true },
    ],
    explanation:
      '- Insertion sort and optimized Bubble sort break immediately on presorted input, running in O(N).\n- Selection sort always scans the entire unsorted partition to find the minimum/maximum, regardless of initial order, taking O(N^2) comparisons.\n- Binary search requires the array to be sorted as an absolute precondition.',
    cStandardRef: 'CS103ES Unit V (Algorithms & Complexity)',
    provenance: 'RevPlay Supplemental Conceptual Question'
  }
];

