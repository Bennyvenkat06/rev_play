import { RevisionNote } from '../types/notes';

export const REVISION_NOTES_DATABASE: Record<string, RevisionNote> = {
  // UNIT I NOTES
  'notes-u1-fundamentals': {
    id: 'notes-u1-fundamentals',
    title: 'C Language Elements, Data Types & Operators',
    subtitle: 'Tokens, Primitive Types, Precedence, Formatting & Expressions',
    unitId: 'unit-1',
    unitName: 'Unit I — C Fundamentals, Decisions, and Loops',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u1-predict',
    associatedGameTitle: 'Predict the Output',
    officialSyllabusMapping: 'CS103ES Unit I: C language elements, variable declarations, data types, executable statements, arithmetic expressions, formatting numerical output.',
    isSupplemental: false,
    objective: 'Master basic C lexical elements, standard variable data types, memory sizes, format specifiers, integer division nuances, and operator precedence rules.',
    conceptSummary: [
      'A C program starts execution from the main() function and is processed sequentially.',
      'Basic primitive types include int, float, double, and char with architecture-specific sizes (typically 4, 4, 8, and 1 byte respectively on modern 32/64-bit systems).',
      'Format specifiers link memory representations to formatted I/O: %d for int, %f for float, %lf for double, %c for char, and %s for strings.',
      'Integer division in C (e.g. 5 / 2) truncates towards zero, producing 2, not 2.5.',
      'The modulus operator (%) requires integral operands and returns the remainder after division.',
      'Prefix increments (++x) increment the value before evaluation, whereas postfix increments (x++) evaluate using the current value before incrementing.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Variable Declaration',
        definition: 'Reserves storage space in memory with a designated identifier and type.',
        syntax: 'data_type identifier = initial_value;'
      },
      {
        term: 'Formatted Output (printf)',
        definition: 'Writes formatted output to the standard output stream stdout.',
        syntax: 'printf("format string with %specifiers", arg1, arg2);'
      },
      {
        term: 'Formatted Input (scanf)',
        definition: 'Reads formatted input from stdin into memory addresses provided by pointers.',
        syntax: 'scanf("%d", &variable_name);'
      },
      {
        term: 'Operator Precedence',
        definition: 'Determines the grouping of terms in an expression when multiple operators are present.',
        syntax: 'Multiplication/Division (*) precedes Addition/Subtraction (+)'
      }
    ],
    codeExamples: [
      {
        title: 'Basic C Program with Formatting and Integer Division',
        code: `#include <stdio.h>

int main(void) {
    int a = 15, b = 4;
    double exact_ratio;

    // Integer division truncates remainder:
    int int_div = a / b;          // Result: 3
    int remainder = a % b;        // Result: 3

    // Explicit type casting ensures floating-point division:
    exact_ratio = (double)a / b;  // Result: 3.750000

    printf("Integer Division: %d / %d = %d\\n", a, b, int_div);
    printf("Remainder:        %d %% %d = %d\\n", a, b, remainder);
    printf("Floating Division: %.2f\\n", exact_ratio);

    return 0;
}`,
        explanation: 'Shows integer truncation, modulus remainder, explicit casting, and field-width precision formatting (%.2f).'
      },
      {
        title: 'Prefix vs Postfix Increment Mechanics',
        code: `#include <stdio.h>

int main(void) {
    int x = 5, y = 5;
    int a = ++x; // x becomes 6, then a is assigned 6
    int b = y++; // b is assigned 5, then y becomes 6

    printf("Prefix:  x=%d, a=%d\\n", x, a);
    printf("Postfix: y=%d, b=%d\\n", y, b);
    return 0;
}`,
        explanation: 'Clear demonstration of order of operations between prefix and postfix increment operators.'
      }
    ],
    workedTrace: {
      description: 'Step-by-step trace of operator precedence: result = 10 + 20 * 2 / (5 - 1)',
      steps: [
        { step: 1, codeLine: 'Parentheses (5 - 1)', variableState: { inner: 4 }, explanation: 'Parentheses evaluate first with highest precedence.' },
        { step: 2, codeLine: 'Multiplication: 20 * 2', variableState: { prod: 40 }, explanation: '* and / have equal precedence and associate left-to-right.' },
        { step: 3, codeLine: 'Division: 40 / 4', variableState: { quot: 10 }, explanation: 'Division evaluates next using the parenthesized denominator.' },
        { step: 4, codeLine: 'Addition: 10 + 10', variableState: { result: 20 }, explanation: 'Addition has lower precedence and completes the expression.' }
      ],
      finalOutput: 'result = 20'
    },
    commonMistakes: [
      {
        pitfall: 'Omitting the address-of operator (&) in scanf for scalar variables',
        badCode: 'int n;\nscanf("%d", n); // Fatal: passes uninitialized value as pointer!',
        fixedCode: 'int n;\nscanf("%d", &n); // Correct: passes memory address of n',
        consequence: 'Undefined behavior; causes immediate segmentation fault or memory corruption.'
      },
      {
        pitfall: 'Expecting floating division when both operands are integers',
        badCode: 'float ratio = 5 / 2; // ratio receives 2.000000',
        fixedCode: 'float ratio = (float)5 / 2; // ratio receives 2.500000',
        consequence: 'Loss of decimal fraction due to integer truncation before assignment.'
      }
    ],
    quickChecklist: [
      'Know memory sizes: char (1B), int (4B), float (4B), double (8B).',
      'Remember format specifiers: %d, %c, %f, %lf, %u, %x.',
      'Always use & with scanf for primitive variables.',
      'Understand left-to-right associativity for arithmetic operators.'
    ],
    examTips: [
      'In JNTUH exams, evaluate sub-expressions strictly by operator precedence and associativity.',
      'Remember that % requires integer types; float % float causes a compile error.'
    ]
  },

  'notes-u1-decisions': {
    id: 'notes-u1-decisions',
    title: 'Control Structures & Algorithmic Decisions',
    subtitle: 'if, if-else, Nested Decisions, and Multiway Switch Statements',
    unitId: 'unit-1',
    unitName: 'Unit I — C Fundamentals, Decisions, and Loops',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u1-branch',
    associatedGameTitle: 'Branch Runner',
    officialSyllabusMapping: 'CS103ES Unit I: Control structures, conditions, if statements, compound statements, and algorithmic decision steps.',
    isSupplemental: false,
    objective: 'Master branching control structures in C, relational/logical operators, short-circuit evaluation, dangling-else traps, and switch-case flow.',
    conceptSummary: [
      'In C, any non-zero numeric expression evaluates to TRUE; zero evaluates to FALSE.',
      'The if statement conditionally executes a single statement or a compound block enclosed in curly braces {}.',
      'Logical AND (&&) and logical OR (||) exhibit short-circuit evaluation: if the left operand determines the outcome, the right operand is never evaluated.',
      'The switch statement provides multi-way branching based on an integral or character expression.',
      'Every case in a switch statement must be an integral constant or literal. Variables and ranges are not permitted.',
      'Without an explicit break statement, execution falls through into subsequent case blocks.'
    ],
    syntaxAndTerminology: [
      {
        term: 'if-else Statement',
        definition: 'Selects between two alternative execution paths based on a boolean condition.',
        syntax: 'if (condition) { /* true branch */ } else { /* false branch */ }'
      },
      {
        term: 'switch-case Construct',
        definition: 'Transfers control to matching case label; requires break to prevent fall-through.',
        syntax: 'switch (expr) { case C1: ... break; default: ... }'
      },
      {
        term: 'Short-Circuit Evaluation',
        definition: 'Logical operators stop evaluating operands as soon as the result is certain.',
        syntax: 'A && B (if A is 0, B is skipped); A || B (if A is 1, B is skipped)'
      }
    ],
    codeExamples: [
      {
        title: 'Multiway Decision with switch and Fallthrough Prevention',
        code: `#include <stdio.h>

int main(void) {
    char grade = 'B';

    switch (grade) {
        case 'A':
            printf("Excellent\\n");
            break;
        case 'B':
            printf("Good Job\\n");
            break;
        case 'C':
            printf("Satisfactory\\n");
            break;
        default:
            printf("Invalid or Remedial Grade\\n");
            break;
    }
    return 0;
}`,
        explanation: 'Illustrates matching character literals with case labels and breaking properly.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Using assignment operator (=) instead of equality test (==)',
        badCode: 'if (x = 0) { /* never runs because expression value is 0 */ }',
        fixedCode: 'if (x == 0) { /* tests whether x is equal to zero */ }',
        consequence: 'Assigns 0 to x and evaluates condition as false, silently corrupting logic.'
      },
      {
        pitfall: 'Forgetting break statement in switch cases',
        badCode: 'case 1: printf("One\\n");\ncase 2: printf("Two\\n"); // Falls through!',
        fixedCode: 'case 1: printf("One\\n"); break;\ncase 2: printf("Two\\n"); break;',
        consequence: 'Unintended cascade of subsequent case blocks.'
      }
    ],
    quickChecklist: [
      'Verify braces {} enclose multi-line if and else blocks.',
      'Always test for equality using ==, never =.',
      'Ensure every switch case ends with break unless deliberate fallthrough is documented.',
      'Include a default: label in all switch statements to handle unexpected inputs.'
    ],
    examTips: [
      'In JNTUH theory exams, draw control flow graphs or truth tables when asked to explain decision structures.'
    ]
  },

  'notes-u1-loops': {
    id: 'notes-u1-loops',
    title: 'Repetition, Counting & Conditional Loops',
    subtitle: 'while, for, do-while, Loop Invariants, and Break/Continue',
    unitId: 'unit-1',
    unitName: 'Unit I — C Fundamentals, Decisions, and Loops',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u1-loop',
    associatedGameTitle: 'Loop Reactor',
    officialSyllabusMapping: 'CS103ES Unit I: Repetition, counting loops, while loops, sums and products in loops, for loops, nested loops, do-while loops.',
    isSupplemental: false,
    objective: 'Master loop initialization, condition checking, iteration update, nested loops, accumulation (sums/products), and jump statements (break/continue).',
    conceptSummary: [
      'A loop consists of four key phases: initialization, condition evaluation, body execution, and update step.',
      'while loop is entry-controlled: the condition is tested BEFORE executing the body. If initially false, the body never runs.',
      'do-while loop is exit-controlled: the condition is tested AFTER the body. The body is guaranteed to execute AT LEAST ONCE.',
      'for loop packages initialization, test condition, and step increment in a single unified header.',
      'The break statement immediately terminates the innermost enclosing loop.',
      'The continue statement skips the remainder of the current iteration and jumps directly to the loop update step.'
    ],
    syntaxAndTerminology: [
      {
        term: 'while Loop (Entry-Controlled)',
        definition: 'Repeats while condition is true; 0 or more iterations.',
        syntax: 'while (condition) { /* body */ }'
      },
      {
        term: 'do-while Loop (Exit-Controlled)',
        definition: 'Executes body first, then checks condition; 1 or more iterations. Requires semicolon at end.',
        syntax: 'do { /* body */ } while (condition);'
      },
      {
        term: 'for Loop',
        definition: 'Standard counting loop with init, test, and update.',
        syntax: 'for (init; test; update) { /* body */ }'
      }
    ],
    codeExamples: [
      {
        title: 'Sum and Product Accumulator Loop',
        code: `#include <stdio.h>

int main(void) {
    int n = 5;
    int sum = 0;
    long product = 1;

    for (int i = 1; i <= n; i++) {
        sum += i;       // Accumulating sum: 1 + 2 + 3 + 4 + 5 = 15
        product *= i;   // Accumulating factorial product: 1*2*3*4*5 = 120
    }

    printf("Sum = %d, Product = %ld\\n", sum, product);
    return 0;
}`,
        explanation: 'Demonstrates standard accumulator patterns with correct neutral initial values (0 for sum, 1 for product).'
      }
    ],
    workedTrace: {
      description: 'Trace of for (i=1; i<=3; i++) with sum accumulation',
      steps: [
        { step: 1, codeLine: 'i=1; test 1<=3 (True)', variableState: { i: 1, sum: 1 }, explanation: 'First iteration: sum becomes 0 + 1 = 1' },
        { step: 2, codeLine: 'i++; test 2<=3 (True)', variableState: { i: 2, sum: 3 }, explanation: 'Second iteration: sum becomes 1 + 2 = 3' },
        { step: 3, codeLine: 'i++; test 3<=3 (True)', variableState: { i: 3, sum: 6 }, explanation: 'Third iteration: sum becomes 3 + 3 = 6' },
        { step: 4, codeLine: 'i++; test 4<=3 (False)', variableState: { i: 4, sum: 6 }, explanation: 'Loop terminates because 4 <= 3 is false.' }
      ],
      finalOutput: 'Loop terminates with i = 4, sum = 6'
    },
    commonMistakes: [
      {
        pitfall: 'Accidental semicolon immediately after for or while header',
        badCode: 'for (int i = 0; i < 5; i++);\n{\n    printf("%d ", i); // Runs only once with i=5!\n}',
        fixedCode: 'for (int i = 0; i < 5; i++) {\n    printf("%d ", i);\n}',
        consequence: 'Creates an empty loop body that spins to completion before entering the brace block.'
      },
      {
        pitfall: 'Initializing product accumulator with zero instead of one',
        badCode: 'int product = 0; for(i=1; i<=n; i++) product *= i; // Stays 0 forever',
        fixedCode: 'long product = 1; for(i=1; i<=n; i++) product *= i;',
        consequence: 'Any value multiplied by 0 remains 0, destroying product logic.'
      }
    ],
    quickChecklist: [
      'Check entry condition vs exit condition requirements.',
      'Remember semicolon at the end of do { ... } while (condition);',
      'Verify loop counter updates on every iteration to avoid infinite loops.',
      'Initialize sum accumulators to 0 and product accumulators to 1.'
    ],
    examTips: [
      'In JNTUH exams, compare while and do-while with a concise difference table and an example where condition is initially false.'
    ]
  },

  'notes-u1-flowcharts': {
    id: 'notes-u1-flowcharts',
    title: 'Algorithmic Flowcharts & Program Translation',
    subtitle: 'From Problem Definition to Structured C Control Flow',
    unitId: 'unit-1',
    unitName: 'Unit I — C Fundamentals, Decisions, and Loops',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u1-flowchart',
    associatedGameTitle: 'Flowchart Builder',
    officialSyllabusMapping: 'CS103ES Unit I: Algorithmic decision steps and structured loop design.',
    isSupplemental: false,
    objective: 'Convert algorithmic logic and flowchart standard symbols (terminal, input/output, process, decision, connector) into modular structured C implementations.',
    conceptSummary: [
      'An algorithm is a finite, unambiguous, step-by-step procedure to solve a specific computational problem.',
      'Flowcharts use standardized ANSI symbols: Oval (Start/Stop), Parallelogram (Input/Output), Rectangle (Process/Assignment), and Diamond (Decision).',
      'Structured programming forbids arbitrary jumps (goto) and enforces three canonical control patterns: Sequence, Selection, and Iteration.',
      'Every decision diamond maps directly to an if, if-else, or loop condition in C.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Terminal Symbol (Oval)',
        definition: 'Represents the entry (main) or exit (return) of the program.',
        syntax: 'int main(void) { ... return 0; }'
      },
      {
        term: 'Decision Symbol (Diamond)',
        definition: 'Evaluates a binary test with two exiting branches: Yes (True) and No (False).',
        syntax: 'if (condition) ...'
      },
      {
        term: 'Process Symbol (Rectangle)',
        definition: 'Computational calculation or variable assignment.',
        syntax: 'variable = expression;'
      }
    ],
    codeExamples: [
      {
        title: 'Structured Translation of Number Extrema Logic',
        code: `#include <stdio.h>

int main(void) {
    int a, b, c, max;
    printf("Enter 3 numbers: ");
    scanf("%d %d %d", &a, &b, &c);

    // Decision hierarchy:
    if (a >= b && a >= c) {
        max = a;
    } else if (b >= c) {
        max = b;
    } else {
        max = c;
    }

    printf("Maximum: %d\\n", max);
    return 0;
}`,
        explanation: 'Clean sequential mapping from flowchart decision diamonds to if-else-if ladder.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Connecting decision diamond outputs back into the loop above variable initialization',
        badCode: '// Logic loop resetting counter back to 0 on every iteration',
        fixedCode: '// Loop backwards only to the condition test, preserving updated state',
        consequence: 'Causes infinite loop execution.'
      }
    ],
    quickChecklist: [
      'Oval = Start / End.',
      'Parallelogram = Input / Output.',
      'Rectangle = Process / Calculation.',
      'Diamond = Condition / Decision.'
    ],
    examTips: [
      'Always draw flow lines with arrows pointing in direction of control flow.',
      'Label every diamond exit branch clearly with "Yes" or "No".'
    ]
  },

  // UNIT II NOTES
  'notes-u2-pointers': {
    id: 'notes-u2-pointers',
    title: 'Pointers, Indirection & Address Arithmetic',
    subtitle: 'Direct Memory Manipulation, &, *, and Pointer Traversal',
    unitId: 'unit-2',
    unitName: 'Unit II — Functions, Top-Down Design, and Pointers',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u2-pointer-lab',
    associatedGameTitle: 'Pointer Lab & RAM Grid',
    officialSyllabusMapping: 'CS103ES Unit II: Pointers and the indirection operator. Scope of names and actual memory references.',
    isSupplemental: false,
    objective: 'Understand how pointers store memory addresses, how the indirection operator (*) accesses target data, and how pointer arithmetic operates scaled by element size.',
    conceptSummary: [
      'A pointer is a variable whose stored value is the memory address of another variable.',
      'The address-of operator (&) returns the hexadecimal memory address of an lvalue.',
      'The dereference/indirection operator (*) accesses or mutates the value located at the address held by the pointer.',
      'Pointer arithmetic is typed and scaled: incrementing a pointer (ptr + 1) advances the address by sizeof(*ptr) bytes, not by 1 raw byte.',
      'NULL is a macro representing memory address 0; dereferencing a NULL or uninitialized pointer causes a runtime crash (Segmentation Fault).',
      'Pointers provide the fundamental mechanism for simulated call-by-reference in C.',
      'Dynamic memory allocation (malloc/calloc) allocates heap memory at runtime. If heap allocation fails, malloc returns NULL; you MUST verify ptr != NULL before use.',
      'Every malloc/calloc block must be explicitly deallocated with free(ptr) to prevent persistent memory leaks, and ptr set to NULL to prevent dangling pointers.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Pointer Declaration',
        definition: 'Declares a pointer variable of a specific base type.',
        syntax: 'int *ptr; // ptr is a pointer to an integer'
      },
      {
        term: 'Address-of Operator (&)',
        definition: 'Yields the memory address of a variable.',
        syntax: 'ptr = &var;'
      },
      {
        term: 'Indirection Operator (*)',
        definition: 'Accesses the value stored at the memory address pointed to by ptr.',
        syntax: '*ptr = 50; // assigns 50 to var'
      },
      {
        term: 'Pointer Arithmetic',
        definition: 'Adds an offset scaled by the base type byte size.',
        syntax: 'ptr + i points to address: (uintptr_t)ptr + i * sizeof(*ptr)'
      },
      {
        term: 'Dynamic Memory Allocation & free()',
        definition: 'Heap memory allocation with NULL failure check and subsequent deallocation.',
        syntax: 'int *p = (int*)malloc(n * sizeof(int)); if (p == NULL) { /* exit */ } ... free(p); p = NULL;'
      }
    ],
    codeExamples: [
      {
        title: 'Pointer Declaration, Indirection and Modification',
        code: `#include <stdio.h>

int main(void) {
    int x = 42;
    int *ptr = &x; // ptr holds the address of x

    printf("Value of x:              %d\\n", x);
    printf("Address of x (&x):       %p\\n", (void*)&x);
    printf("Address in ptr:          %p\\n", (void*)ptr);
    printf("Dereferenced (*ptr):     %d\\n", *ptr);

    // Modifying x through the pointer:
    *ptr = 100;
    printf("Modified x through ptr:  %d\\n", x); // prints 100

    return 0;
}`,
        explanation: 'Shows variable address extraction, assignment to pointer, dereferencing, and direct memory modification.'
      },
      {
        title: 'Dynamic Memory Allocation Failure Handling & free()',
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    // Request heap memory for dynamic array:
    int *arr = (int *)malloc(n * sizeof(int));

    // MANDATORY AUDIT: Check for allocation failure
    if (arr == NULL) {
        fprintf(stderr, "Fatal Error: Heap allocation failed (Out of Memory)!\\n");
        return 1;
    }

    // Populate and access allocated heap memory:
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
        printf("arr[%d] = %d\\n", i, arr[i]);
    }

    // Explicit deallocation to prevent memory leaks:
    free(arr);
    arr = NULL; // Defend against dangling pointer

    printf("Memory successfully released with free().\\n");
    return 0;
}`,
        explanation: 'Demonstrates malloc() heap allocation, strict NULL checking for failure, buffer utilization, and cleanup with free().'
      }
    ],
    workedTrace: {
      description: 'Trace of pointer assignment and indirection',
      steps: [
        { step: 1, codeLine: 'int a = 10; int *p = &a;', variableState: { a: 10, p: '0x1000' }, explanation: 'Variable a allocated at address 0x1000 with value 10.' },
        { step: 2, codeLine: '*p = 25;', variableState: { a: 25, p: '0x1000' }, explanation: 'Indirection operator writes 25 directly into memory location 0x1000.' },
        { step: 3, codeLine: 'int b = *p + 5;', variableState: { b: 30, a: 25 }, explanation: 'Reads 25 from *p, adds 5, stores 30 in b.' }
      ],
      finalOutput: 'a = 25, b = 30'
    },
    commonMistakes: [
      {
        pitfall: 'Dereferencing an uninitialized or wild pointer',
        badCode: 'int *ptr; // Wild pointer pointing to random memory\n*ptr = 10; // Crash!',
        fixedCode: 'int val = 0;\nint *ptr = &val;\n*ptr = 10;',
        consequence: 'Writing to arbitrary memory addresses causes segmentation faults or system corruption.'
      },
      {
        pitfall: 'Failing to check for dynamic memory allocation failure and leaking memory',
        badCode: 'int *p = (int*)malloc(1000 * sizeof(int));\np[0] = 50; // Crash if malloc returned NULL! Never freed!',
        fixedCode: 'int *p = (int*)malloc(1000 * sizeof(int));\nif (p == NULL) return -1;\np[0] = 50;\nfree(p); p = NULL;',
        consequence: 'Segmentation fault if memory exhausted; memory leaks exhaust OS resources over time.'
      },
      {
        pitfall: 'Confusing pointer declaration syntax with dereferencing',
        badCode: 'int *p; *p = &x; // Wrong: assigns address to an int, not the pointer',
        fixedCode: 'int *p; p = &x;   // Correct: assigns address to the pointer variable',
        consequence: 'Type mismatch warning and memory fault.'
      }
    ],
    quickChecklist: [
      '& gives address, * accesses the value at address.',
      'Always initialize pointers to NULL or a valid address.',
      'Pointer arithmetic scales by sizeof(type).',
      'Always check if (ptr == NULL) after malloc/calloc.',
      'Always release dynamic memory with free(ptr) and set ptr = NULL.'
    ],
    examTips: [
      'In JNTUH exams, always illustrate pointers with boxes showing addresses on the left/top and stored values inside.',
      'Always mention that free() releases heap memory back to the operating system.'
    ]
  },

  'notes-u2-functions': {
    id: 'notes-u2-functions',
    title: 'Functions, Scope & Call-Stack Mechanics',
    subtitle: 'Prototypes, Arguments, Call-by-Value vs Call-by-Reference & Stack Frames',
    unitId: 'unit-2',
    unitName: 'Unit II — Functions, Top-Down Design, and Pointers',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u2-callstack',
    associatedGameTitle: 'Call-Stack Challenge',
    officialSyllabusMapping: 'CS103ES Unit II: Functions without/with input arguments, functions with output parameters, multiple calls, scope of names.',
    isSupplemental: false,
    objective: 'Master modular function architecture, prototypes, stack activation frames, local vs global variable scopes, and modifying caller variables via pointer parameters.',
    conceptSummary: [
      'Functions encapsulate reusable code blocks with defined inputs (parameters) and outputs (return values).',
      'Functions without arguments (e.g. void displayHeader(void)) take no input parameters, whereas functions with input arguments (e.g. int square(int x)) accept values from the caller.',
      'A function prototype informs the compiler of function name, return type, and parameter types before its definition.',
      'By default, C passes all scalar arguments strictly by value: copies are placed on the call stack, so changes in the function do not affect caller variables.',
      'To achieve output parameters (call-by-reference), the caller passes variable addresses (&var), and the callee receives them as pointers (*param).',
      'Scope of names dictates identifier visibility: block scope ({...}), function scope, and file/global scope. Local declarations shadow outer declarations.',
      'Formal output parameters can be used directly as actual arguments in subsequent function calls across a processing pipeline.',
      'Every function call pushes a stack frame (activation record) containing return address and local variables; returning pops the frame.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Function Prototype',
        definition: 'Declaration stating return type and signature prior to main().',
        syntax: 'return_type function_name(param_type1, param_type2);'
      },
      {
        term: 'Functions Without Arguments',
        definition: 'Functions that require no caller inputs, declared with parameter void.',
        syntax: 'void printBanner(void);'
      },
      {
        term: 'Scope of Names',
        definition: 'Spatial range of program text over which an identifier is accessible.',
        syntax: 'Block scope { int local; } vs File scope int global;'
      },
      {
        term: 'Formal Output Parameters as Actual Arguments',
        definition: 'Output parameters updated by one callee passed as inputs to next function.',
        syntax: 'calculateRoots(a, b, c, &r1, &r2); displayResults(r1, r2);'
      },
      {
        term: 'Call-by-Reference via Pointers',
        definition: 'Passing pointers so callee can modify caller memory directly.',
        syntax: 'void swap(int *a, int *b) { int temp = *a; *a = *b; *b = temp; }'
      }
    ],
    codeExamples: [
      {
        title: 'Classic Swap Function using Pointer Output Parameters',
        code: `#include <stdio.h>

// Function prototype: takes two pointer parameters
void swap(int *p1, int *p2);

int main(void) {
    int num1 = 10, num2 = 20;

    printf("Before Swap: num1 = %d, num2 = %d\\n", num1, num2);
    // Pass memory addresses:
    swap(&num1, &num2);
    printf("After Swap:  num1 = %d, num2 = %d\\n", num1, num2);

    return 0;
}

void swap(int *p1, int *p2) {
    int temp = *p1;
    *p1 = *p2;
    *p2 = temp;
}`,
        explanation: 'Demonstrates passing addresses to swap caller variables in their own stack frame.'
      },
      {
        title: 'Functions Without Arguments, Scope & Formal Output Parameters as Actual Arguments',
        code: `#include <stdio.h>

// 1. Function without arguments:
void showHeader(void) {
    printf("=== JNTUH CS103ES Modular Pipeline ===\\n");
}

// 2. Function with input arguments and formal output parameters:
void computeCircle(double radius, double *area, double *circumference) {
    const double PI = 3.1415926535;
    *area = PI * radius * radius;
    *circumference = 2.0 * PI * radius;
}

// 3. Function receiving computed values as actual arguments:
void reportMetrics(double a, double c) {
    printf("Calculated Area:          %.2f sq units\\n", a);
    printf("Calculated Circumference: %.2f units\\n", c);
}

int main(void) {
    double r = 7.0;
    double circleArea = 0.0, circleCirc = 0.0;

    showHeader(); // Function without arguments

    // Pass addresses to receive output parameters:
    computeCircle(r, &circleArea, &circleCirc);

    // Formal output parameters from step 2 now used as actual arguments in step 3:
    reportMetrics(circleArea, circleCirc);

    return 0;
}`,
        explanation: 'Complete pipeline showing functions without arguments, input arguments, formal output parameters, and chaining results into subsequent calls.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Returning a pointer to a local automatic variable',
        badCode: 'int* getVal() {\n    int temp = 50;\n    return &temp; // DANGEROUS: stack frame destroyed on return!\n}',
        fixedCode: 'void getVal(int *out) {\n    *out = 50; // Write into caller memory\n}',
        consequence: 'Dangling pointer points to discarded stack memory, yielding corrupted values or crashes.'
      }
    ],
    quickChecklist: [
      'Declare prototypes before main().',
      'Pass &var if the function needs to modify the caller variable.',
      'Match prototype and definition argument counts and types exactly.',
      'Never return the address of a local variable.'
    ],
    examTips: [
      'In JNTUH exams, write swap() with and without pointers to prove why call-by-value cannot alter original variables.'
    ]
  },

  'notes-u2-topdown': {
    id: 'notes-u2-topdown',
    title: 'Top-Down Design & Modular Pipelines',
    subtitle: 'Structure Charts, Stepwise Refinement & Standard C Libraries',
    unitId: 'unit-2',
    unitName: 'Unit II — Functions, Top-Down Design, and Pointers',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u2-pipeline',
    associatedGameTitle: 'Function Pipeline',
    officialSyllabusMapping: 'CS103ES Unit II: Building programs from existing information and using library functions. Top-down design, structure charts.',
    isSupplemental: false,
    objective: 'Apply top-down stepwise refinement to decompose large computational problems into isolated single-purpose modules coordinated by structure charts.',
    conceptSummary: [
      'Top-down design decomposes complex problems into high-level sub-problems, refining them progressively until each maps to a single function.',
      'A structure chart is a tree diagram illustrating the functional hierarchy and data flow (inputs and outputs) between modules.',
      'Cohesion measures how focused a function is on a single task (high cohesion is preferred).',
      'Coupling measures the degree of dependency between functions (low coupling is preferred).',
      'Standard C libraries (<math.h>, <ctype.h>, <stdlib.h>) provide thoroughly tested building blocks.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Structure Chart',
        definition: 'Hierarchical diagram displaying modular decomposition with data and control flags.',
        syntax: 'main -> [ReadData, ProcessData, DisplayResults]'
      },
      {
        term: 'Library Header <math.h>',
        definition: 'Standard math functions like sqrt(), pow(), ceil(), floor(), fabs().',
        syntax: '#include <math.h> // Compile with -lm on Linux'
      }
    ],
    codeExamples: [
      {
        title: 'Top-Down Modular Calculation of Circle Properties',
        code: `#include <stdio.h>
#define PI 3.141592653589793

// Modular function prototypes:
double calculateArea(double radius);
double calculateCircumference(double radius);

int main(void) {
    double r = 5.0;
    double area = calculateArea(r);
    double circ = calculateCircumference(r);

    printf("Radius: %.2f | Area: %.2f | Circumference: %.2f\\n", r, area, circ);
    return 0;
}

double calculateArea(double radius) {
    return PI * radius * radius;
}

double calculateCircumference(double radius) {
    return 2.0 * PI * radius;
}`,
        explanation: 'Separates input, individual mathematical calculations, and display into discrete modules.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Writing monolithic main() functions handling input, processing, and output in a single block',
        badCode: '// 200 lines of mixed code in main()',
        fixedCode: '// main() calls readInput(), computeResults(), displayOutput()',
        consequence: 'Code is unmaintainable, difficult to debug, and impossible to unit-test.'
      }
    ],
    quickChecklist: [
      'Each function should do one task well (High Cohesion).',
      'Functions communicate through explicit arguments, not global variables (Low Coupling).',
      'Include appropriate headers for library functions.'
    ],
    examTips: [
      'When asked about top-down design in JNTUH exams, always draw a structure chart with rectangle module boxes and connecting arrows.'
    ]
  },

  // UNIT III NOTES
  'notes-u3-arrays': {
    id: 'notes-u3-arrays',
    title: 'Array Declarations, Subscripts & Memory Bounds',
    subtitle: '1D Arrays, Contiguous Storage, Bounds Safety & Passing to Functions',
    unitId: 'unit-3',
    unitName: 'Unit III — Arrays and Strings',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u3-array-forge',
    associatedGameTitle: 'Array Forge',
    officialSyllabusMapping: 'CS103ES Unit III: Array declarations, references, subscripts, sequential access with loops, array elements and array arguments.',
    isSupplemental: false,
    objective: 'Understand contiguous memory layout of 1D arrays, 0-indexed subscript calculation, sequential loop traversal, array decay to pointers, and bounds safety.',
    conceptSummary: [
      'An array is a fixed-size, contiguous collection of elements of the same data type.',
      'C uses zero-based indexing: for an array of size N, valid indices are strictly 0 to N-1.',
      'The array name without brackets decays to a pointer to its first element: arr == &arr[0].',
      'C performs NO automatic array bounds checking at compile time or runtime: accessing arr[N] is undefined behavior.',
      'When an array is passed to a function, it decays to a pointer. Therefore, the array length must be passed as an explicit additional argument.',
      'Array subscript notation arr[i] is syntactically equivalent to pointer arithmetic *(arr + i).'
    ],
    syntaxAndTerminology: [
      {
        term: 'Array Declaration',
        definition: 'Allocates N consecutive elements of given type.',
        syntax: 'int arr[5] = {10, 20, 30, 40, 50};'
      },
      {
        term: 'Subscript Operator []',
        definition: 'Accesses element at offset; translates to *(arr + i).',
        syntax: 'arr[i] = value;'
      },
      {
        term: 'Array Parameter in Functions',
        definition: 'Receives pointer to first element; size must be passed explicitly.',
        syntax: 'void printArray(int arr[], int size); or void printArray(int *arr, int size);'
      }
    ],
    codeExamples: [
      {
        title: 'Traversing Array and Computing Minimum and Average',
        code: `#include <stdio.h>

void findStats(const int arr[], int size, int *min, double *avg) {
    int sum = arr[0];
    *min = arr[0];

    for (int i = 1; i < size; i++) {
        if (arr[i] < *min) {
            *min = arr[i];
        }
        sum += arr[i];
    }
    *avg = (double)sum / size;
}

int main(void) {
    int scores[5] = {88, 72, 95, 64, 80};
    int minScore;
    double avgScore;

    findStats(scores, 5, &minScore, &avgScore);
    printf("Min Score: %d | Avg Score: %.2f\\n", minScore, avgScore);
    return 0;
}`,
        explanation: 'Demonstrates passing arrays, passing size, computing extrema and average, and outputting via pointers.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Off-by-one error accessing index equal to size (arr[size])',
        badCode: 'int a[5]; for(int i=0; i<=5; i++) a[i] = 0; // a[5] is out of bounds!',
        fixedCode: 'int a[5]; for(int i=0; i<5; i++) a[i] = 0;',
        consequence: 'Corrupts neighboring stack memory or causes immediate crash.'
      },
      {
        pitfall: 'Attempting to calculate array length inside a function using sizeof(arr)',
        badCode: 'void foo(int arr[]) { int n = sizeof(arr)/sizeof(arr[0]); // Returns sizeof(int*)/sizeof(int) = 1 or 2! }',
        fixedCode: 'void foo(int arr[], int n) { /* use passed parameter n */ }',
        consequence: 'sizeof on decayed pointer gives pointer size, not array capacity.'
      }
    ],
    quickChecklist: [
      'Indices start at 0 and end at size - 1.',
      'Array name decays to pointer to element 0.',
      'Always pass size along with array to functions.',
      'Never access out-of-bounds indices in C.'
    ],
    examTips: [
      'In JNTUH exams, show that arr[i] == *(arr + i) == *(i + arr) == i[arr].'
    ]
  },

  'notes-u3-matrices': {
    id: 'notes-u3-matrices',
    title: 'Multidimensional Matrices, Parallel Arrays & Enums',
    subtitle: '2D Arrays, Row-Major Memory Mapping, Parallel Structures & Enumerations',
    unitId: 'unit-3',
    unitName: 'Unit III — Arrays and Strings',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u3-matrix',
    associatedGameTitle: 'Matrix Mission',
    officialSyllabusMapping: 'CS103ES Unit III: Multidimensional arrays, parallel arrays, enumerated types.',
    isSupplemental: false,
    objective: 'Understand 2D array representation in C, row-major memory mapping order, nested loop indexing, matrix addition/multiplication, parallel arrays tracking synchronized entity fields, and enumerated types (enum).',
    conceptSummary: [
      'A 2D array is represented in C as an array of 1D arrays stored consecutively in row-major order.',
      'The memory address formula for cell [i][j] in a matrix with R rows and C columns is: Address(A[i][j]) = BaseAddress + (i * C + j) * sizeof(element).',
      'Matrix addition requires identical dimensions (R1 == R2 and C1 == C2): C[i][j] = A[i][j] + B[i][j].',
      'Matrix multiplication of A (R1 x C1) and B (R2 x C2) requires C1 == R2. The product matrix has dimensions R1 x C2.',
      'Matrix multiplication uses three nested loops: i (rows of A), j (cols of B), and k (inner product accumulator).',
      'Parallel arrays use two or more independent arrays of the exact same size, where elements at index i across all arrays describe the attributes of a single logical item (e.g., id[i] and marks[i]).',
      'Enumerated types (enum) allow programmer-defined types whose values are restricted to a discrete list of named integer constants (default starting at 0, incrementing by 1).'
    ],
    syntaxAndTerminology: [
      {
        term: '2D Array Declaration',
        definition: 'Declares row x col grid; second dimension is mandatory when passing to functions.',
        syntax: 'int matrix[3][4]; // 3 rows, 4 columns'
      },
      {
        term: 'Row-Major Order',
        definition: 'Consecutive elements of row 0 are placed first in memory, followed by row 1, etc.',
        syntax: 'Address = Base + (i * Cols + j) * size'
      },
      {
        term: 'Parallel Arrays',
        definition: 'Multiple synchronized arrays sharing common index subscript.',
        syntax: 'int roll[N]; float cgpa[N]; // roll[i] paired with cgpa[i]'
      },
      {
        term: 'Enumerated Types (enum)',
        definition: 'User-defined type creating named integer constants for code readability.',
        syntax: 'enum Status { FAIL = 0, PASS = 1, DISTINCTION = 2 };'
      }
    ],
    codeExamples: [
      {
        title: 'Matrix Multiplication Implementation',
        code: `#include <stdio.h>

#define R1 2
#define C1 3
#define R2 3
#define C2 2

int main(void) {
    int A[R1][C1] = {{1, 2, 3}, {4, 5, 6}};
    int B[R2][C2] = {{7, 8}, {9, 1}, {2, 3}};
    int Res[R1][C2] = {0};

    // Matrix multiplication:
    for (int i = 0; i < R1; i++) {
        for (int j = 0; j < C2; j++) {
            Res[i][j] = 0;
            for (int k = 0; k < C1; k++) {
                Res[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    printf("Result Cell [0][0]: %d\\n", Res[0][0]); // 1*7 + 2*9 + 3*2 = 31
    return 0;
}`,
        explanation: 'Three nested loops computing standard inner product.'
      },
      {
        title: 'Parallel Arrays and Enumerated Types (enum)',
        code: `#include <stdio.h>

// Enumerated type for academic standing:
enum Standing { PROBATION = 0, GOOD_STANDING = 1, DEANS_LIST = 2 };

int main(void) {
    // Parallel arrays sharing index i:
    int studentIds[3] = {101, 102, 103};
    float gpas[3] = {9.4f, 6.8f, 4.5f};
    enum Standing status[3];

    for (int i = 0; i < 3; i++) {
        if (gpas[i] >= 8.5f) {
            status[i] = DEANS_LIST;
        } else if (gpas[i] >= 5.0f) {
            status[i] = GOOD_STANDING;
        } else {
            status[i] = PROBATION;
        }

        printf("ID: %d | GPA: %.1f | Status Code: %d\\n", 
               studentIds[i], gpas[i], status[i]);
    }
    return 0;
}`,
        explanation: 'Demonstrates synchronized parallel arrays and enum constant assignment.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Omitting column dimension in function parameters',
        badCode: 'void processMatrix(int mat[][]) { ... } // Compile Error!',
        fixedCode: 'void processMatrix(int mat[][COL_SIZE]) { ... } // Valid: compiler needs column size to calculate row offset',
        consequence: 'Compiler cannot compute row-stride offset without the column dimension.'
      }
    ],
    quickChecklist: [
      'Row-major order: consecutive elements of a row sit side by side in memory.',
      'For matrix multiplication: cols of A must equal rows of B.',
      'Always initialize product accumulator cell to 0 before the k loop.'
    ],
    examTips: [
      'In JNTUH exams, always state the condition for multiplication (C1 == R2) before presenting code.'
    ]
  },

  'notes-u3-strings': {
    id: 'notes-u3-strings',
    title: 'Strings, Null-Terminator & String Library',
    subtitle: 'Character Arrays, \\0 Byte, string.h, and Buffer Management',
    unitId: 'unit-3',
    unitName: 'Unit III — Arrays and Strings',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u3-string-lab',
    associatedGameTitle: 'String Puzzle Lab',
    officialSyllabusMapping: 'CS103ES Unit III: String basics and string library functions. Assignment, substrings, concatenation, comparison, string pointers.',
    isSupplemental: false,
    objective: 'Master C string representation as null-terminated character sequences, string library functions (strlen, strcpy, strcat, strcmp), and safe input methods.',
    conceptSummary: [
      'In C, a string is a 1D character array terminated by a null character (\'\\0\', ASCII value 0).',
      'The length of a string (returned by strlen) is the number of characters before \'\\0\', excluding the null terminator.',
      'An array storing a string of length N must have capacity at least N + 1 bytes to accommodate the null terminator.',
      'String assignment cannot use the assignment operator (=); strings must be copied using strcpy() or strncpy().',
      'strcmp(s1, s2) returns 0 if strings are identical, negative if s1 < s2, and positive if s1 > s2 (lexicographical ASCII order).',
      'Never use gets(); use fgets(str, sizeof(str), stdin) for safe line input without buffer overflow vulnerabilities.',
      'Substrings can be isolated by locating start offsets and copying characters until length L, ensuring null-termination.',
      'Arrays of pointers (char *arr[]) store pointers to string literals, creating efficient ragged arrays without wasting fixed column padding.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Null Terminator (\'\\0\')',
        definition: 'Special byte marks the boundary end of a valid C string.',
        syntax: 'char str[6] = "Hello"; // elements: \'H\',\'e\',\'l\',\'l\',\'o\',\'\\0\''
      },
      {
        term: 'strlen(s)',
        definition: 'Counts characters until null terminator.',
        syntax: 'size_t len = strlen(str);'
      },
      {
        term: 'strcmp(s1, s2)',
        definition: 'Compares two strings lexicographically based on ASCII values.',
        syntax: 'if (strcmp(s1, s2) == 0) /* identical */'
      },
      {
        term: 'fgets()',
        definition: 'Safe whole-line input specifying max buffer capacity.',
        syntax: 'fgets(buffer, sizeof(buffer), stdin);'
      },
      {
        term: 'Array of Pointers to Strings',
        definition: 'Array where each element holds the address of a null-terminated string.',
        syntax: 'const char *topics[] = {"Pointers", "Recursion", "Files"};'
      }
    ],
    codeExamples: [
      {
        title: 'Safe String Operations with string.h',
        code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char greeting[30] = "Hello";
    char name[15] = " JNTUH";

    // Concatenate name onto greeting:
    strcat(greeting, name);
    printf("Combined: %s\\n", greeting); // Hello JNTUH
    printf("Length:   %lu\\n", (unsigned long)strlen(greeting));

    // String comparison:
    if (strcmp(greeting, "Hello JNTUH") == 0) {
        printf("Strings match perfectly!\\n");
    }

    return 0;
}`,
        explanation: 'Demonstrates strcat, strlen, and strcmp with proper buffer allocation.'
      },
      {
        title: 'Substrings, Whole-Line Input (fgets) & Arrays of Pointers',
        code: `#include <stdio.h>
#include <string.h>

// Substring extraction function:
void extractSubstring(const char *src, int start, int len, char *dest) {
    int i;
    for (i = 0; i < len && src[start + i] != '\\0'; i++) {
        dest[i] = src[start + i];
    }
    dest[i] = '\\0'; // Crucial null-termination
}

int main(void) {
    // 1. Array of pointers to strings:
    const char *courses[] = {"CS103ES PPS", "CS107ES Lab", "Math-I"};
    printf("Array of Pointers: %s | %s\\n", courses[0], courses[1]);

    // 2. Substring extraction:
    char sub[20];
    extractSubstring("JNTUH University", 0, 5, sub);
    printf("Extracted Substring: '%s'\\n", sub); // JNTUH

    // 3. Safe whole-line buffer input simulation:
    char lineBuffer[64];
    // In interactive mode: fgets(lineBuffer, sizeof(lineBuffer), stdin);
    // Strip trailing newline: lineBuffer[strcspn(lineBuffer, "\\n")] = 0;

    return 0;
}`,
        explanation: 'Covers whole-line fgets buffer concept, substring null-termination, and pointer arrays.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Allocating buffer too small for null terminator',
        badCode: 'char s[5] = "Hello"; // Missing room for \'\\0\'!',
        fixedCode: 'char s[6] = "Hello"; // Room for 5 chars + \'\\0\'',
        consequence: 'Undefined behavior when functions search for non-existent null byte, reading into unknown memory.'
      },
      {
        pitfall: 'Comparing strings with == instead of strcmp()',
        badCode: 'if (str1 == str2) // Compares memory addresses, NOT string content!',
        fixedCode: 'if (strcmp(str1, str2) == 0) // Compares actual string characters',
        consequence: 'Always returns false for distinct buffers even if they hold identical text.'
      }
    ],
    quickChecklist: [
      'Always add +1 to string length for null terminator.',
      'Use strcmp() == 0 to check for string equality.',
      'Use strcpy() to copy strings, never =.',
      'Use fgets() instead of unsafe gets().'
    ],
    examTips: [
      'In JNTUH exams, write manual while-loop implementations of strlen and strcpy without library functions.'
    ]
  },

  // UNIT IV NOTES
  'notes-u4-recursion': {
    id: 'notes-u4-recursion',
    title: 'Recursion Maze & Stack-Frame Tracing',
    subtitle: 'Base Cases, Recursive Leaps, Stack Activation Records & Unwinding',
    unitId: 'unit-4',
    unitName: 'Unit IV — Recursion, Structures, and Unions',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u4-recursion-maze',
    associatedGameTitle: 'Recursion Maze',
    officialSyllabusMapping: 'CS103ES Unit IV: The nature of recursion and tracing recursive functions. Recursive mathematical functions, array and string parameters.',
    isSupplemental: false,
    objective: 'Master recursive problem decomposition, mandatory base case design, call-stack frame stacking during descent, and value accumulation during return unwinding.',
    conceptSummary: [
      'A recursive function is a function that calls itself, directly or indirectly, to solve a smaller instance of the same problem.',
      'Every recursive function MUST have at least one base case that terminates recursion without making further recursive calls.',
      'Each recursive call creates a new stack frame on the call stack containing its own parameter values and local variables.',
      'If the base case is missing or never reached, recursion continues until memory is exhausted, causing a Stack Overflow crash.',
      'Recursion operates in two distinct phases: Winding (pushing frames down to the base case) and Unwinding (popping frames and returning values back up).',
      'Recursion naturally traverses linear structures: processing arrays recursively (head element + recursive tail of size n-1) and strings recursively (comparing left and right pointers towards center).'
    ],
    syntaxAndTerminology: [
      {
        term: 'Base Case',
        definition: 'The stopping condition where problem is trivial and returns an immediate answer.',
        syntax: 'if (n <= 1) return 1;'
      },
      {
        term: 'Recursive Step',
        definition: 'Reduces problem into smaller sub-problem and calls function itself.',
        syntax: 'return n * factorial(n - 1);'
      },
      {
        term: 'Array & String Recursion',
        definition: 'Passing sub-slices or index bounds into recursive calls.',
        syntax: 'sumArray(arr, n-1) or isPalindrome(str, left+1, right-1)'
      },
      {
        term: 'Stack Overflow',
        definition: 'Runtime error caused by unbounded recursive calls exceeding stack memory capacity.',
        syntax: 'Occurs when base case is missing or conditions never meet'
      }
    ],
    codeExamples: [
      {
        title: 'Recursive Factorial and Fibonacci Functions',
        code: `#include <stdio.h>

long factorial(int n) {
    // Base case:
    if (n <= 1) return 1;
    // Recursive step:
    return n * factorial(n - 1);
}

int fibonacci(int n) {
    // Base cases:
    if (n == 0) return 0;
    if (n == 1) return 1;
    // Recursive tree step:
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main(void) {
    printf("5! = %ld\\n", factorial(5));       // 120
    printf("Fib(6) = %d\\n", fibonacci(6));    // 8
    return 0;
}`,
        explanation: 'Demonstrates single linear recursion (factorial) and branching tree recursion (Fibonacci).'
      },
      {
        title: 'Recursive Functions with Array and String Parameters',
        code: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

// 1. Recursive array summation:
int sumArrayRecursive(const int arr[], int n) {
    if (n <= 0) return 0; // Base case: empty array
    return arr[n - 1] + sumArrayRecursive(arr, n - 1); // Head + tail
}

// 2. Recursive string palindrome verification:
bool isPalindromeRecursive(const char str[], int left, int right) {
    if (left >= right) return true; // Base case: single character or matched
    if (str[left] != str[right]) return false;
    return isPalindromeRecursive(str, left + 1, right - 1); // Recurse inwards
}

int main(void) {
    int nums[4] = {10, 20, 30, 40};
    printf("Recursive Sum: %d\\n", sumArrayRecursive(nums, 4)); // 100

    const char *word = "radar";
    bool pal = isPalindromeRecursive(word, 0, (int)strlen(word) - 1);
    printf("Is '%s' Palindrome? %s\\n", word, pal ? "YES" : "NO");

    return 0;
}`,
        explanation: 'Demonstrates processing array bounds and string pointer indices recursively.'
      }
    ],
    workedTrace: {
      description: 'Trace of factorial(3)',
      steps: [
        { step: 1, codeLine: 'factorial(3) calls 3 * factorial(2)', variableState: { n: 3, frame: 'Pushed Frame 1' }, explanation: 'First call paused waiting for factorial(2)' },
        { step: 2, codeLine: 'factorial(2) calls 2 * factorial(1)', variableState: { n: 2, frame: 'Pushed Frame 2' }, explanation: 'Second call paused waiting for factorial(1)' },
        { step: 3, codeLine: 'factorial(1) hits base case: returns 1', variableState: { n: 1, frame: 'Base Case Reached' }, explanation: 'Frame 3 unwinds and returns 1 to Frame 2' },
        { step: 4, codeLine: 'factorial(2) computes 2 * 1 = 2', variableState: { returnVal: 2, frame: 'Unwound Frame 2' }, explanation: 'Frame 2 completes and returns 2 to Frame 1' },
        { step: 5, codeLine: 'factorial(3) computes 3 * 2 = 6', variableState: { returnVal: 6, frame: 'Final Unwind' }, explanation: 'Frame 1 completes and returns final answer 6' }
      ],
      finalOutput: 'factorial(3) = 6'
    },
    commonMistakes: [
      {
        pitfall: 'Omitting the base case or testing wrong boundary condition',
        badCode: 'int fact(int n) { return n * fact(n - 1); } // Never stops!',
        fixedCode: 'int fact(int n) { if (n <= 1) return 1; return n * fact(n - 1); }',
        consequence: 'Infinite recursion leads to segmentation fault from stack overflow.'
      }
    ],
    quickChecklist: [
      'Base case must always be checked first before recursive call.',
      'Arguments must progress strictly towards the base case on each call.',
      'Understand stack memory consumption for deep recursion.'
    ],
    examTips: [
      'In JNTUH exams, always draw the activation frame stack diagram or recursion tree.'
    ]
  },

  'notes-u4-structures': {
    id: 'notes-u4-structures',
    title: 'Structures, Struct Pointers & Return Values',
    subtitle: 'User-Defined Heterogeneous Types, Dot (.) and Arrow (->) Operators',
    unitId: 'unit-4',
    unitName: 'Unit IV — Recursion, Structures, and Unions',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u4-struct-builder',
    associatedGameTitle: 'Structure Builder',
    officialSyllabusMapping: 'CS103ES Unit IV: User-defined structure types. Structure data as input/output parameters, functions returning structured values.',
    isSupplemental: false,
    objective: 'Define heterogeneous structured data types, access members via dot (.) and arrow (->) operators, pass structs to functions, and return structured objects.',
    conceptSummary: [
      'A struct is a user-defined composite data type that groups variables of different types under a single name.',
      'Structure members are accessed using the dot operator (.) on struct variables.',
      'When accessing members through a pointer to a struct, the arrow operator (->) is used as shorthand for (*ptr).member.',
      'Structures can be passed to functions by value (entire struct copied) or by reference using a pointer (efficient, modifies original).',
      'A function can return an entire structure value, providing a clean method to return multiple values simultaneously.'
    ],
    syntaxAndTerminology: [
      {
        term: 'struct Definition',
        definition: 'Declares a new template for composite data.',
        syntax: 'struct Student { int roll; char name[50]; float marks; };'
      },
      {
        term: 'Member Access (.)',
        definition: 'Accesses member on a direct struct instance.',
        syntax: 's1.roll = 101;'
      },
      {
        term: 'Arrow Operator (->)',
        definition: 'Accesses member through a pointer to a struct.',
        syntax: 'ptr->roll = 101; // Equivalent to (*ptr).roll = 101;'
      }
    ],
    codeExamples: [
      {
        title: 'Defining, Initializing, and Passing Structs via Pointers',
        code: `#include <stdio.h>

struct Student {
    int id;
    char name[30];
    float gpa;
};

// Function modifies struct via pointer (output parameter):
void updateGPA(struct Student *s, float newGpa) {
    s->gpa = newGpa; // Using arrow operator
}

int main(void) {
    struct Student s1 = {101, "Rahul Sharma", 8.4f};

    printf("Original GPA: %.2f\\n", s1.gpa);
    updateGPA(&s1, 9.2f);
    printf("Updated GPA:  %.2f\\n", s1.gpa);

    return 0;
}`,
        explanation: 'Demonstrates struct definition, initialization, and pointer-based parameter modification.'
      },
      {
        title: 'Structure as Input/Output Parameters & Functions Returning Structured Values',
        code: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

// 1. Function returning structured value:
struct Point createPoint(int x, int y) {
    struct Point p;
    p.x = x;
    p.y = y;
    return p; // Returns entire struct value directly
}

// 2. Function taking struct as input parameter and returning structured value:
struct Point addPoints(struct Point p1, struct Point p2) {
    struct Point result;
    result.x = p1.x + p2.x;
    result.y = p1.y + p2.y;
    return result;
}

// 3. Structure data as output parameter via pointer:
void scalePoint(struct Point *p, int factor) {
    p->x *= factor;
    p->y *= factor;
}

int main(void) {
    struct Point ptA = createPoint(3, 5);
    struct Point ptB = createPoint(7, 2);
    struct Point ptSum = addPoints(ptA, ptB);

    printf("Point Sum: (%d, %d)\\n", ptSum.x, ptSum.y); // (10, 7)

    scalePoint(&ptSum, 2);
    printf("Scaled Point: (%d, %d)\\n", ptSum.x, ptSum.y); // (20, 14)

    return 0;
}`,
        explanation: 'Shows functions returning structures by value and passing structures as both value inputs and pointer output parameters.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Using dot operator on a pointer without dereferencing parentheses',
        badCode: 'struct Student *p = &s1;\n*p.gpa = 9.0; // Error: dot has higher precedence than *!',
        fixedCode: '(*p).gpa = 9.0; or p->gpa = 9.0;',
        consequence: 'Compile error: compiler attempts to access p.gpa before dereferencing.'
      }
    ],
    quickChecklist: [
      'Remember semicolon at the end of struct definition: struct Foo { ... };',
      'Use . for variable, -> for pointer.',
      'Passing large structs by pointer saves stack memory and avoids expensive copies.'
    ],
    examTips: [
      'In JNTUH exams, clearly distinguish arrays (homogeneous) from structures (heterogeneous).'
    ]
  },

  'notes-u4-unions': {
    id: 'notes-u4-unions',
    title: 'Unions, Memory Overlap & Layout Challenge',
    subtitle: 'Shared Memory Architecture, sizeof Comparisons & Data Alignment',
    unitId: 'unit-4',
    unitName: 'Unit IV — Recursion, Structures, and Unions',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u4-memory-layout',
    associatedGameTitle: 'Memory Layout Challenge',
    officialSyllabusMapping: 'CS103ES Unit IV: Union types, memory representation and layout comparisons.',
    isSupplemental: false,
    objective: 'Contrast struct and union memory footprints, understand shared memory overlap where members share a common base address, and calculate byte sizes.',
    conceptSummary: [
      'A union is a user-defined type where all members share the SAME memory location.',
      'The total size of a union is equal to the size of its largest member (plus any alignment padding).',
      'In contrast, the size of a struct is at least the sum of sizes of all its individual members.',
      'Only ONE member of a union can store a meaningful value at any given moment: writing to one member overwrites the values of all other members.',
      'Unions are widely used in embedded systems, hardware register mapping, and memory-constrained protocols.'
    ],
    syntaxAndTerminology: [
      {
        term: 'union Keyword',
        definition: 'Declares a composite type with overlapping memory storage.',
        syntax: 'union Data { int i; float f; char str[20]; };'
      },
      {
        term: 'Memory Footprint Difference',
        definition: 'Struct sums member sizes; Union allocates only for largest member.',
        syntax: 'sizeof(struct) >= sum(members) vs sizeof(union) >= max(members)'
      }
    ],
    codeExamples: [
      {
        title: 'Demonstrating Memory Overlap in a Union',
        code: `#include <stdio.h>

union Data {
    int i;
    float f;
    char ch;
};

int main(void) {
    union Data d;
    printf("sizeof(union Data) = %lu bytes\\n", (unsigned long)sizeof(d)); // 4 bytes

    d.i = 65;
    printf("d.i = %d | as char d.ch = '%c'\\n", d.i, d.ch); // ASCII 65 is 'A'

    d.f = 3.14159f; // Overwrites the memory
    printf("After writing to f: d.f = %f | d.i is now garbage = %d\\n", d.f, d.i);

    return 0;
}`,
        explanation: 'Proves that writing to one union member directly alters the byte pattern seen by all other members.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Expecting multiple union members to retain values simultaneously',
        badCode: 'union Data d; d.i = 10; d.f = 2.5; printf("%d", d.i); // Garbage output!',
        fixedCode: '// If you need both simultaneously, use a struct instead of a union',
        consequence: 'Writing to d.f corrupted the bit representation of d.i.'
      }
    ],
    quickChecklist: [
      'sizeof(union) = size of largest member (plus alignment).',
      'All union members start at the exact same base memory address.',
      'Only read from the member that was most recently written to.'
    ],
    examTips: [
      'In JNTUH exams, always provide a 4-point comparison table between struct and union (Keyword, Memory Allocation, Member Access, Total Size).'
    ]
  },

  // UNIT V NOTES
  'notes-u5-files': {
    id: 'notes-u5-files',
    title: 'File Detective: Text & Binary File I/O',
    subtitle: 'FILE* Handles, fopen Modes, fprintf/fscanf, fread/fwrite, and EOF',
    unitId: 'unit-5',
    unitName: 'Unit V — Files, Searching, and Sorting',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u5-file-detective',
    associatedGameTitle: 'File Detective',
    officialSyllabusMapping: 'CS103ES Unit V: Text and binary file pointers, file input/output, and binary files. Searching a database.',
    isSupplemental: false,
    objective: 'Manage secondary storage files in C, open/close streams using fopen and fclose, process text streams with fprintf/fscanf, handle binary data with fread/fwrite, and detect EOF.',
    conceptSummary: [
      'In C, files are treated as byte streams managed through a FILE pointer (FILE*).',
      'fopen() opens a file with specified access mode ("r" read, "w" write/truncate, "a" append, "rb"/"wb" binary).',
      'If fopen() fails (e.g. file does not exist in read mode or insufficient permissions), it returns NULL. Always check for NULL before proceeding.',
      'fclose() flushes internal write buffers and releases OS file descriptors.',
      'fgetc() reads characters one-by-one and returns EOF (typically -1) when end-of-file is reached.',
      'fread() and fwrite() transfer raw contiguous blocks of bytes directly between memory and binary files.'
    ],
    syntaxAndTerminology: [
      {
        term: 'FILE Pointer (FILE*)',
        definition: 'Handle to file control structure defined in <stdio.h>.',
        syntax: 'FILE *fp = fopen("data.txt", "r");'
      },
      {
        term: 'fopen Modes',
        definition: '"r" (read existing), "w" (overwrite/create), "a" (append/create), "rb"/"wb" (binary).',
        syntax: 'fp = fopen(filename, mode);'
      },
      {
        term: 'EOF (End of File)',
        definition: 'Constant macro (integer -1) returned by stream functions when file ends.',
        syntax: 'while ((ch = fgetc(fp)) != EOF) { ... }'
      },
      {
        term: 'fread / fwrite',
        definition: 'Binary block transfer functions.',
        syntax: 'fwrite(&struct_var, sizeof(struct_var), 1, fp);'
      }
    ],
    codeExamples: [
      {
        title: 'Reading and Writing Text Files with Error Checking',
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *fp = fopen("output.txt", "w");
    if (fp == NULL) {
        perror("Error creating file");
        return 1;
    }

    fprintf(fp, "JNTUH R25 C Revision\\nCourse: CS103ES\\nScore: %d\\n", 100);
    fclose(fp);

    // Read back character by character:
    fp = fopen("output.txt", "r");
    if (fp == NULL) {
        perror("Error opening file");
        return 1;
    }

    int ch; // int, not char, to hold EOF (-1)
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }
    fclose(fp);

    return 0;
}`,
        explanation: 'Demonstrates creating text files, writing formatted data, checking for NULL, and reading to EOF.'
      },
      {
        title: 'Searching a File Database (Binary Records with fread)',
        code: `#include <stdio.h>
#include <string.h>

struct Record {
    int rollNo;
    char name[30];
    float marks;
};

// Search database file for target roll number:
int searchDatabase(const char *filename, int targetRoll, struct Record *result) {
    FILE *fp = fopen(filename, "rb");
    if (fp == NULL) return 0; // File open failed

    struct Record rec;
    int found = 0;

    // Sequential search through database file records:
    while (fread(&rec, sizeof(struct Record), 1, fp) == 1) {
        if (rec.rollNo == targetRoll) {
            *result = rec;
            found = 1;
            break;
        }
    }

    fclose(fp);
    return found;
}

int main(void) {
    struct Record matched;
    // Query simulated database file:
    if (searchDatabase("students.dat", 102, &matched)) {
        printf("Found: Roll %d, Name: %s, Marks: %.1f\\n", 
               matched.rollNo, matched.name, matched.marks);
    } else {
        printf("Record not found in database.\\n");
    }
    return 0;
}`,
        explanation: 'Demonstrates binary file searching using fread to inspect structured records until a target key matches.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Storing the return value of fgetc() in a char variable instead of int',
        badCode: 'char ch; while ((ch = fgetc(fp)) != EOF) // Bug on unsigned char systems!',
        fixedCode: 'int ch; while ((ch = fgetc(fp)) != EOF) // Correct: EOF is -1',
        consequence: 'If char is unsigned by default, (char)EOF wraps to 255, creating an infinite loop.'
      },
      {
        pitfall: 'Failing to check if fopen() returned NULL',
        badCode: 'FILE *fp = fopen("missing.txt", "r");\nfgetc(fp); // Crash!',
        fixedCode: 'FILE *fp = fopen("missing.txt", "r");\nif (fp == NULL) return 1;',
        consequence: 'Dereferencing NULL pointer crashes program immediately.'
      }
    ],
    quickChecklist: [
      'Always test fp != NULL after fopen.',
      'Always fclose(fp) when finished.',
      'Store fgetc() return values in int, not char.',
      'Use binary mode ("rb", "wb") when dealing with structs or non-ASCII data.'
    ],
    examTips: [
      'In JNTUH exams, write a complete file-copy program demonstrating EOF detection.'
    ]
  },

  'notes-u5-searching': {
    id: 'notes-u5-searching',
    title: 'Searching Arena: Linear Search vs Binary Search',
    subtitle: 'Sequential Scan O(N) vs Sorted Divide-and-Conquer O(log N)',
    unitId: 'unit-5',
    unitName: 'Unit V — Files, Searching, and Sorting',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u5-binary-search',
    associatedGameTitle: 'Binary Search Arena',
    officialSyllabusMapping: 'CS103ES Unit V: Searching a database. Linear search and binary search.',
    isSupplemental: false,
    objective: 'Implement and analyze linear search and binary search algorithms, track low/mid/high search intervals, understand time complexities, and handle boundary conditions.',
    conceptSummary: [
      'Linear Search checks elements sequentially from start to end; works on ANY array (unsorted or sorted) with O(N) time complexity.',
      'Binary Search requires the array to be SORTED beforehand; it repeatedly divides the search interval in half with O(log N) time complexity.',
      'Binary Search maintains three pointer indices: low, mid, and high.',
      'Midpoint formula: mid = low + (high - low) / 2 (avoids integer overflow compared to (low + high) / 2).',
      'If target == arr[mid], search succeeds. If target < arr[mid], discard right half (high = mid - 1). If target > arr[mid], discard left half (low = mid + 1).',
      'Search terminates unsuccessfully when low > high.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Linear Search Complexity',
        definition: 'Best: O(1) (found at index 0); Worst: O(N) (at end or absent).',
        syntax: 'for (int i=0; i<n; i++) if (arr[i] == key) return i;'
      },
      {
        term: 'Binary Search Complexity',
        definition: 'Best: O(1) (found at middle); Worst: O(log2 N).',
        syntax: 'while (low <= high) { mid = low + (high - low)/2; ... }'
      }
    ],
    codeExamples: [
      {
        title: 'Iterative Binary Search Algorithm',
        code: `#include <stdio.h>

int binarySearch(const int arr[], int size, int target) {
    int low = 0;
    int high = size - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2; // Safe midpoint

        if (arr[mid] == target) {
            return mid; // Target found at index mid
        } else if (arr[mid] < target) {
            low = mid + 1; // Discard left half
        } else {
            high = mid - 1; // Discard right half
        }
    }
    return -1; // Target not present in array
}

int main(void) {
    int sorted[7] = {11, 23, 35, 47, 59, 72, 88};
    int target = 47;
    int idx = binarySearch(sorted, 7, target);

    if (idx != -1) {
        printf("Found %d at index %d\\n", target, idx);
    } else {
        printf("Target not found\\n");
    }
    return 0;
}`,
        explanation: 'Clean iterative implementation avoiding integer overflow.'
      }
    ],
    workedTrace: {
      description: 'Binary Search for key 59 in [11, 23, 35, 47, 59, 72, 88]',
      steps: [
        { step: 1, codeLine: 'low=0, high=6; mid=3', variableState: { midVal: 47, target: 59 }, explanation: 'arr[3]=47 < 59: target is in right half; set low = 3 + 1 = 4' },
        { step: 2, codeLine: 'low=4, high=6; mid=5', variableState: { midVal: 72, target: 59 }, explanation: 'arr[5]=72 > 59: target is in left sub-half; set high = 5 - 1 = 4' },
        { step: 3, codeLine: 'low=4, high=4; mid=4', variableState: { midVal: 59, target: 59 }, explanation: 'arr[4]=59 == 59: MATCH FOUND at index 4!' }
      ],
      finalOutput: 'Target 59 found in 3 iterations at index 4'
    },
    commonMistakes: [
      {
        pitfall: 'Applying Binary Search on an unsorted array',
        badCode: 'int unsorted[5] = {50, 10, 40, 20, 30};\nbinarySearch(unsorted, 5, 20); // Fails randomly!',
        fixedCode: '// Must sort array before calling binarySearch',
        consequence: 'Divide-and-conquer assumption fails, falsely reporting element is not present.'
      },
      {
        pitfall: 'Integer overflow in midpoint calculation: (low + high) / 2',
        badCode: 'int mid = (low + high) / 2; // Overflows if low + high > INT_MAX',
        fixedCode: 'int mid = low + (high - low) / 2;',
        consequence: 'Produces negative midpoint leading to segmentation fault.'
      }
    ],
    quickChecklist: [
      'Binary search requires sorted data.',
      'Condition is while (low <= high).',
      'Update: low = mid + 1 and high = mid - 1.',
      'Returns -1 if element is absent.'
    ],
    examTips: [
      'In JNTUH exams, present the time complexity comparison table: Linear O(N) vs Binary O(log N).'
    ]
  },

  'notes-u5-sorting': {
    id: 'notes-u5-sorting',
    title: 'Sorting Race: Bubble, Insertion & Selection Sort',
    subtitle: 'Passes, Swaps, Comparisons & Algorithmic Complexity Comparison',
    unitId: 'unit-5',
    unitName: 'Unit V — Files, Searching, and Sorting',
    courseCode: 'CS103ES',
    courseName: 'Programming for Problem Solving',
    associatedGameId: 'game-u5-sort-race',
    associatedGameTitle: 'Sorting Race',
    officialSyllabusMapping: 'CS103ES Unit V: Bubble sort, insertion sort, and selection sort.',
    isSupplemental: false,
    objective: 'Implement, trace, and contrast the three elementary O(N^2) sorting algorithms: Bubble Sort, Selection Sort, and Insertion Sort.',
    conceptSummary: [
      'Bubble Sort: Compares adjacent elements and swaps them if out of order. After pass i, the i-th largest element bubbles up to its final position at the end. Can be optimized with a swapped flag.',
      'Selection Sort: Repeatedly finds the minimum element from the unsorted subarray and swaps it with the first unsorted element. Performs minimal swaps: exactly O(N) swaps.',
      'Insertion Sort: Builds sorted array one element at a time by picking the next element and shifting larger elements to the right to insert it into place. Efficient for small or nearly sorted arrays (best-case O(N)).',
      'All three algorithms take O(1) auxiliary space (in-place sorting).'
    ],
    syntaxAndTerminology: [
      {
        term: 'Bubble Sort Complexity',
        definition: 'Worst/Avg: O(N^2); Best (with flag): O(N). Stable.',
        syntax: 'if (arr[j] > arr[j+1]) swap(&arr[j], &arr[j+1]);'
      },
      {
        term: 'Selection Sort Complexity',
        definition: 'Best/Worst/Avg: O(N^2) comparisons, O(N) swaps. Unstable.',
        syntax: 'min_idx = j; ... swap(&arr[i], &arr[min_idx]);'
      },
      {
        term: 'Insertion Sort Complexity',
        definition: 'Worst/Avg: O(N^2); Best: O(N). Stable, online.',
        syntax: 'while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }'
      }
    ],
    codeExamples: [
      {
        title: 'Optimized Bubble Sort Implementation',
        code: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0; // Optimization flag
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break; // Array is already sorted
    }
}

int main(void) {
    int data[5] = {64, 25, 12, 22, 11};
    bubbleSort(data, 5);
    for (int i = 0; i < 5; i++) printf("%d ", data[i]);
    printf("\\n");
    return 0;
}`,
        explanation: 'Includes the early-exit optimization flag to achieve O(N) best case on sorted arrays.'
      },
      {
        title: 'Selection Sort and Insertion Sort Implementations',
        code: `#include <stdio.h>

// Selection Sort: Finds minimum in unsorted suffix and swaps once per pass
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

// Insertion Sort: Shifts elements greater than key to insert key in sorted prefix
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
    int a[5] = {29, 10, 14, 37, 13};
    int b[5] = {29, 10, 14, 37, 13};

    selectionSort(a, 5);
    insertionSort(b, 5);

    printf("Selection Sorted: %d %d %d %d %d\\n", a[0], a[1], a[2], a[3], a[4]);
    printf("Insertion Sorted: %d %d %d %d %d\\n", b[0], b[1], b[2], b[3], b[4]);
    return 0;
}`,
        explanation: 'Side-by-side implementations of Selection Sort and Insertion Sort with inner shifting logic.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Running inner loop to (n - 1) on every pass instead of (n - 1 - i)',
        badCode: 'for(int j=0; j<n-1; j++) // Performs unnecessary redundant comparisons',
        fixedCode: 'for(int j=0; j<n-1-i; j++) // Ignores already sorted tail elements',
        consequence: 'Wastes clock cycles re-checking already sorted suffix.'
      }
    ],
    quickChecklist: [
      'Bubble: adjacent swaps, bubbles largest to end.',
      'Selection: finds min element, swaps with start.',
      'Insertion: shifts larger items right, inserts key in place.',
      'Know comparison and swap counts for each algorithm.'
    ],
    examTips: [
      'In JNTUH exams, provide step-by-step array snapshots after every pass for the given example input array.'
    ]
  },

  // LAB PRACTICE GROUPS NOTES (CS107ES)
  'notes-lab-group1': {
    id: 'notes-lab-group1',
    title: 'Lab Practice 1: Numeric Logic & Bitwise Conversions',
    subtitle: 'CS107ES Lab Group 1 — Extrema, Interest, Multiplication Tables & Binary Conversion',
    unitId: 'lab',
    unitName: 'CS107ES Programming for Problem Solving Lab',
    courseCode: 'CS107ES',
    courseName: 'Programming for Problem Solving Lab',
    associatedGameId: 'game-lab-arena',
    associatedGameTitle: 'Lab Practice Arena',
    officialSyllabusMapping: 'CS107ES Practice Group 1: Numeric problems (Max/Min of three, SI/CI, Table, Binary 0-255).',
    isSupplemental: false,
    objective: 'Implement, compile, debug, and execute foundational mathematical programs: extrema of three numbers, simple and compound interest, multiplication tables, and binary conversion of 8-bit integers (0 to 255).',
    conceptSummary: [
      'Maximum and minimum of three numbers can be determined cleanly using relational conditions (a >= b && a >= c) or nested ternary operators.',
      'Simple Interest = (P * T * R) / 100.',
      'Compound Interest = P * pow(1 + R/100, T) - P; requires <math.h> and -lm compiler flag.',
      'Binary conversion of an 8-bit value (0 to 255) uses bitwise right shifts ((num >> i) & 1) from bit 7 down to bit 0, or iterative division by 2.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Bitwise Right Shift (>>)',
        definition: 'Shifts binary representation to right by specified bits.',
        syntax: '(num >> bit) & 1 yields the bit at index bit'
      },
      {
        term: 'pow() Function',
        definition: 'Calculates base raised to power exponent in <math.h>.',
        syntax: 'double result = pow(base, exponent);'
      }
    ],
    codeExamples: [
      {
        title: '8-bit Decimal to Binary Conversion (0 to 255)',
        code: `#include <stdio.h>

void printBinary8(unsigned char val) {
    printf("Decimal %3d = Binary: ", val);
    for (int i = 7; i >= 0; i--) {
        int bit = (val >> i) & 1;
        printf("%d", bit);
    }
    printf("\\n");
}

int main(void) {
    printBinary8(0);
    printBinary8(15);
    printBinary8(255);
    return 0;
}`,
        explanation: 'Inspects each bit position from 7 to 0 using bitwise shift and mask.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Calculating Compound Interest using integer arithmetic',
        badCode: 'float ci = p * pow((1 + r/100), t); // If r is int, r/100 evaluates to 0!',
        fixedCode: 'double ci = p * pow((1.0 + (double)r/100.0), t) - p;',
        consequence: 'Integer division truncates fraction, producing completely incorrect interest.'
      }
    ],
    quickChecklist: [
      'Link -lm when compiling with <math.h>.',
      'Ensure 8-bit numbers are unsigned char or bounded [0, 255].',
      'Format output with appropriate decimal precision (e.g. %.2f).'
    ],
    examTips: [
      'In lab viva, explain how (val >> i) & 1 isolates bit i without altering original val.'
    ]
  },

  'notes-lab-group2': {
    id: 'notes-lab-group2',
    title: 'Lab Practice 2: Expression Evaluation & Number Theory',
    subtitle: 'CS107ES Lab Group 2 — Switch Calculator, Primes, Palindromes & Fibonacci',
    unitId: 'lab',
    unitName: 'CS107ES Programming for Problem Solving Lab',
    courseCode: 'CS107ES',
    courseName: 'Programming for Problem Solving Lab',
    associatedGameId: 'game-lab-arena',
    associatedGameTitle: 'Lab Practice Arena',
    officialSyllabusMapping: 'CS107ES Practice Group 2: Expression evaluation (Calculator, Prime, Sum of Digits, Palindrome, Fibonacci).',
    isSupplemental: false,
    objective: 'Implement switch-case driven calculators, primality checking algorithms, digit reversal for palindrome verification, and Fibonacci sequence generation.',
    conceptSummary: [
      'Switch-based calculator processes operators (+, -, *, /, %) with explicit divide-by-zero checks before / and % operations.',
      'Prime checking: a number N > 1 is prime if it has no divisors other than 1 and N. Testing divisors up to sqrt(N) achieves O(sqrt(N)) time.',
      'Reversing an integer uses: rev = rev * 10 + (n % 10); n = n / 10; A number is a palindrome if original == rev.',
      'Fibonacci sequence starts with 0 and 1, with each subsequent term being the sum of previous two.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Modulo Operator (%) in Digit Extraction',
        definition: 'Extracts rightmost decimal digit.',
        syntax: 'int lastDigit = num % 10;'
      },
      {
        term: 'Divide-by-zero Guard',
        definition: 'Mandatory verification before division or modulo.',
        syntax: 'if (b == 0) { printf("Error: Division by zero!\\n"); }'
      }
    ],
    codeExamples: [
      {
        title: 'Number Palindrome and Digit Sum Verification',
        code: `#include <stdio.h>

int main(void) {
    int num = 12321, temp = num;
    int reversed = 0, sumOfDigits = 0;

    while (temp > 0) {
        int rem = temp % 10;
        sumOfDigits += rem;
        reversed = reversed * 10 + rem;
        temp /= 10;
    }

    printf("Original: %d | Reversed: %d | Digit Sum: %d\\n", num, reversed, sumOfDigits);
    if (num == reversed) {
        printf("%d is a PALINDROME\\n", num);
    }
    return 0;
}`,
        explanation: 'Extracts digits, computes sum, builds reversed number, and verifies palindrome property.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Testing primality up to N instead of sqrt(N) or missing edge cases (0, 1, negatives)',
        badCode: 'for(int i=2; i<n; i++) // Inefficient for large N; misses n<=1 check',
        fixedCode: 'if (n <= 1) return 0; for(int i=2; i*i<=n; i++) if (n % i == 0) return 0;',
        consequence: '0 and 1 are incorrectly flagged as prime; massive waste of CPU cycles.'
      }
    ],
    quickChecklist: [
      'Always test for b == 0 before division and modulo in calculators.',
      'Preserve original number in temp variable before extracting digits.',
      'Fibonacci base values: F(0) = 0, F(1) = 1.'
    ],
    examTips: [
      'In lab exams, demonstrate the calculator handling bad operators through default: case.'
    ]
  },

  'notes-lab-group3': {
    id: 'notes-lab-group3',
    title: 'Lab Practice 3: Arrays, Pointers & Functions',
    subtitle: 'CS107ES Lab Group 3 — Extrema/Average, Matrix Math & Pointer Reverse',
    unitId: 'lab',
    unitName: 'CS107ES Programming for Problem Solving Lab',
    courseCode: 'CS107ES',
    courseName: 'Programming for Problem Solving Lab',
    associatedGameId: 'game-lab-arena',
    associatedGameTitle: 'Lab Practice Arena',
    officialSyllabusMapping: 'CS107ES Practice Group 3: Arrays, pointers, and functions (Min/Max/Avg, Matrix Add/Multiply, Reverse using pointers).',
    isSupplemental: false,
    objective: 'Implement modular functions to compute array metrics, perform 2D matrix addition and multiplication, and traverse arrays in reverse using pointer arithmetic.',
    conceptSummary: [
      'Array statistics (min, max, average) are computed in modular functions receiving array base pointer and length.',
      'Matrix addition requires dimension check: R1 == R2 and C1 == C2.',
      'Matrix multiplication requires inner dimension check: C1 == R2; result matrix size is R1 x C2.',
      'Pointer traversal in reverse starts pointer at ptr + n - 1 and decrements using ptr-- down to base ptr.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Pointer Reverse Traversal',
        definition: 'Accessing elements from tail to head via pointer decrements.',
        syntax: 'for (int *p = arr + n - 1; p >= arr; p--) printf("%d ", *p);'
      }
    ],
    codeExamples: [
      {
        title: 'Pointer-based Array Input and Reverse Display',
        code: `#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int *ptr = arr; // points to arr[0]

    printf("Original: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", *(ptr + i));
    }

    printf("\\nReversed: ");
    for (int i = 4; i >= 0; i--) {
        printf("%d ", *(ptr + i));
    }
    printf("\\n");

    return 0;
}`,
        explanation: 'Uses pure pointer dereferencing *(ptr + i) to read and print in reverse.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Setting reverse pointer to ptr + n instead of ptr + n - 1',
        badCode: 'int *p = arr + n; // Points one past the last element!',
        fixedCode: 'int *p = arr + n - 1; // Points to actual last element',
        consequence: 'Reads uninitialized or out-of-bounds memory on first iteration.'
      }
    ],
    quickChecklist: [
      'Last valid element is at arr + n - 1.',
      'Matrix multiplication dimensions: cols of A == rows of B.',
      'Always pass matrix column dimensions in 2D array parameters.'
    ],
    examTips: [
      'Explain that arr[i] and *(arr + i) produce identical machine instructions.'
    ]
  },

  'notes-lab-group4': {
    id: 'notes-lab-group4',
    title: 'Lab Practice 4: File Manipulation Pipelines',
    subtitle: 'CS107ES Lab Group 4 — Uppercase File Copy & File Merging',
    unitId: 'lab',
    unitName: 'CS107ES Programming for Problem Solving Lab',
    courseCode: 'CS107ES',
    courseName: 'Programming for Problem Solving Lab',
    associatedGameId: 'game-lab-arena',
    associatedGameTitle: 'Lab Practice Arena',
    officialSyllabusMapping: 'CS107ES Practice Group 4: Files (Copy uppercase conversion, Merge two files into third).',
    isSupplemental: false,
    objective: 'Implement persistent file copy programs that convert lowercase characters to uppercase, and merge two separate source files sequentially into a third destination file.',
    conceptSummary: [
      'File copy: open source in "r" mode, destination in "w" mode; read char with fgetc(), convert with toupper() from <ctype.h>, write with fputc().',
      'File merge: open file1 ("r"), file2 ("r"), merged ("w"); copy all of file1 to merged, then copy all of file2 to merged.',
      'Always verify file pointers != NULL and close all opened handles.'
    ],
    syntaxAndTerminology: [
      {
        term: 'fgetc and fputc',
        definition: 'Character-by-character file reading and writing.',
        syntax: 'int ch = fgetc(src); fputc(toupper(ch), dest);'
      },
      {
        term: 'toupper() from <ctype.h>',
        definition: 'Converts lowercase character to uppercase; leaves other characters untouched.',
        syntax: 'ch = toupper(ch);'
      }
    ],
    codeExamples: [
      {
        title: 'Merge Two Files into a Third Destination File',
        code: `#include <stdio.h>
#include <stdlib.h>

void appendFile(FILE *src, FILE *dest) {
    int ch;
    while ((ch = fgetc(src)) != EOF) {
        fputc(ch, dest);
    }
}

int main(void) {
    FILE *f1 = fopen("part1.txt", "r");
    FILE *f2 = fopen("part2.txt", "r");
    FILE *fout = fopen("merged.txt", "w");

    if (!f1 || !f2 || !fout) {
        printf("Error opening files!\\n");
        return 1;
    }

    appendFile(f1, fout);
    appendFile(f2, fout);

    fclose(f1);
    fclose(f2);
    fclose(fout);
    printf("Files merged successfully into merged.txt\\n");
    return 0;
}`,
        explanation: 'Modular copy function called sequentially to merge two input streams into one output.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Opening destination file in "a" mode when "w" is needed to create fresh output',
        badCode: 'fopen("merged.txt", "a"); // Leaves old previous contents intact',
        fixedCode: 'fopen("merged.txt", "w"); // Truncates or creates clean new file',
        consequence: 'Old output from previous runs remains, corrupting test results.'
      }
    ],
    quickChecklist: [
      'Check all file pointers != NULL.',
      'Store character read in int ch.',
      'Close all files in reverse or orderly fashion.'
    ],
    examTips: [
      'In lab exams, demonstrate how to handle missing input files gracefully without crashing.'
    ]
  },

  'notes-lab-group5': {
    id: 'notes-lab-group5',
    title: 'Lab Practice 5: String Algorithms & Buffer Operations',
    subtitle: 'CS107ES Lab Group 5 — Substring Insert/Delete, Palindrome, Search & Counters',
    unitId: 'lab',
    unitName: 'CS107ES Programming for Problem Solving Lab',
    courseCode: 'CS107ES',
    courseName: 'Programming for Problem Solving Lab',
    associatedGameId: 'game-lab-arena',
    associatedGameTitle: 'Lab Practice Arena',
    officialSyllabusMapping: 'CS107ES Practice Group 5: Strings (Substring insert/delete, Palindrome, Locate char, Count words/lines).',
    isSupplemental: false,
    objective: 'Implement custom string manipulation algorithms without relying exclusively on high-level libraries: substring insertion/deletion, string palindrome, linear character search, and counting lines, words, and characters.',
    conceptSummary: [
      'Substring insertion: shifts existing characters to the right by length of insert string, then copies insert string into the gap.',
      'Substring deletion: shifts tail characters left over the deleted region and places a null terminator at new end.',
      'String palindrome: compares characters at left index and right index (len - 1 - i) moving inward towards center.',
      'Word counting: a word starts when a non-whitespace character is preceded by whitespace or start of string.'
    ],
    syntaxAndTerminology: [
      {
        term: 'isspace() from <ctype.h>',
        definition: 'Checks for whitespace characters (space, tab, newline).',
        syntax: 'if (isspace((unsigned char)ch)) { inWord = 0; }'
      }
    ],
    codeExamples: [
      {
        title: 'Count Lines, Words, and Characters in Text',
        code: `#include <stdio.h>
#include <ctype.h>

void countText(const char *str, int *lines, int *words, int *chars) {
    *lines = 0;
    *words = 0;
    *chars = 0;
    int inWord = 0;

    for (int i = 0; str[i] != '\\0'; i++) {
        (*chars)++;
        if (str[i] == '\\n') (*lines)++;

        if (isspace((unsigned char)str[i])) {
            inWord = 0;
        } else if (!inWord) {
            inWord = 1;
            (*words)++;
        }
    }
}

int main(void) {
    const char *text = "Hello JNTUH\\nWelcome to RevPlay Platform";
    int l, w, c;
    countText(text, &l, &w, &c);
    printf("Lines: %d | Words: %d | Chars: %d\\n", l, w, c);
    return 0;
}`,
        explanation: 'State machine tracking inWord flag to accurately count words despite multiple spaces.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Counting words simply by counting spaces',
        badCode: 'if (ch == \' \') words++; // Multiple consecutive spaces creates false words!',
        fixedCode: '// Track inWord state transition from whitespace to non-whitespace',
        consequence: 'Leading/trailing or multiple spaces gives completely erroneous word counts.'
      }
    ],
    quickChecklist: [
      'Null-terminate newly shifted strings.',
      'Ensure destination buffer is large enough for inserted substring.',
      'Use isspace() to test for whitespace boundaries.'
    ],
    examTips: [
      'In JNTUH lab exams, write character search returning index or -1 using a simple for loop.'
    ]
  },

  'notes-lab-group6': {
    id: 'notes-lab-group6',
    title: 'Lab Practice 6: Searching & Sorting Benchmarks',
    subtitle: 'CS107ES Lab Group 6 — Linear, Binary, Bubble, Selection Desc, Insertion & Name Sort',
    unitId: 'lab',
    unitName: 'CS107ES Programming for Problem Solving Lab',
    courseCode: 'CS107ES',
    courseName: 'Programming for Problem Solving Lab',
    associatedGameId: 'game-lab-arena',
    associatedGameTitle: 'Lab Practice Arena',
    officialSyllabusMapping: 'CS107ES Practice Group 6: Searching & Sorting (Linear, Binary, Bubble, Selection Desc, Insertion, Sorting Names).',
    isSupplemental: false,
    objective: 'Implement, verify, and benchmark searching and sorting algorithms required by JNTUH lab: Linear Search, Binary Search on sorted data, Bubble Sort (Ascending), Selection Sort (Descending), Insertion Sort (Ascending), and Alphabetical Sorting of Names.',
    conceptSummary: [
      'Linear search iterates 0 to N-1; binary search halves interval each step.',
      'Selection Sort Descending: finds maximum element in unsorted range and swaps with first index of pass.',
      'Insertion Sort Ascending: shifts larger elements right to insert key into sorted prefix.',
      'Sorting Names: uses 2D char array or array of char pointers, compared with strcmp() and swapped with strcpy() or pointer swapping.'
    ],
    syntaxAndTerminology: [
      {
        term: 'Selection Sort Descending',
        definition: 'Sorts largest to smallest by locating maximum in remaining items.',
        syntax: 'if (arr[j] > arr[max_idx]) max_idx = j;'
      },
      {
        term: 'Sorting Strings Alphabetically',
        definition: 'Uses strcmp() to compare and strcpy() to reorder.',
        syntax: 'if (strcmp(names[i], names[j]) > 0) swapStrings(names[i], names[j]);'
      }
    ],
    codeExamples: [
      {
        title: 'Alphabetical Sorting of Names using Bubble Sort',
        code: `#include <stdio.h>
#include <string.h>

void sortNames(char names[][20], int n) {
    char temp[20];
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (strcmp(names[j], names[j + 1]) > 0) {
                strcpy(temp, names[j]);
                strcpy(names[j], names[j + 1]);
                strcpy(names[j + 1], temp);
            }
        }
    }
}

int main(void) {
    char students[4][20] = {"Kavya", "Anand", "Suresh", "Divya"};
    sortNames(students, 4);

    for (int i = 0; i < 4; i++) {
        printf("%s\\n", students[i]);
    }
    return 0;
}`,
        explanation: 'Sorts array of names in ascending alphabetical order using strcmp and strcpy.'
      }
    ],
    commonMistakes: [
      {
        pitfall: 'Swapping strings with = operator instead of strcpy()',
        badCode: 'char temp[20]; temp = names[j]; // Compile Error: array assignment is invalid!',
        fixedCode: 'strcpy(temp, names[j]); strcpy(names[j], names[j+1]); strcpy(names[j+1], temp);',
        consequence: 'Compile error because array identifiers cannot be lvalues in assignments.'
      }
    ],
    quickChecklist: [
      'Ascending: < comparisons; Descending: > comparisons.',
      'Selection Sort Descending seeks maximum element.',
      'Always use strcpy() or pointer swapping for string arrays.'
    ],
    examTips: [
      'In JNTUH lab exams, be ready to execute Bubble Sort ascending and Selection Sort descending on chalkboard.'
    ]
  }
};

