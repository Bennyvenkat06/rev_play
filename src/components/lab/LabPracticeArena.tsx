import React, { useState } from 'react';
import { LAB_PRACTICE_GROUPS, OFFICIAL_SYLLABUS_SOURCE, COLLEGE_LOCAL_COURSE_MAPPING } from '../../data/syllabusData';
import { REVISION_NOTES_DATABASE } from '../../data/revisionNotesData';
import { PRACTICE_PROGRAMMES } from '../../data/practiceCatalogue';
import { CHALLENGES_QUESTION_BANK } from '../../data/challengesData';
import { downloadRevisionNoteAsText } from '../../utils/downloadNotes';
import { soundManager } from '../../utils/sound';
import { PracticeProgramme } from '../../types/practice';
import { ChallengeSpecification } from '../../types/challenges';
import { 
  FileCode, 
  Play, 
  Terminal, 
  CheckCircle, 
  BookOpen, 
  Download, 
  Bug, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Code2,
  ChevronDown,
  ChevronRight,
  Filter
} from 'lucide-react';

interface LabPracticeArenaProps {
  onOpenNotes: (notesId: string) => void;
}

interface LabWorkbenchItem {
  id: string;
  groupId: number;
  title: string;
  objective: string;
  codeSnippet: string;
  inputs: { label: string; defaultVal: string }[];
  simulateRun: (inputs: Record<string, string>) => { output: string; success: boolean };
  bugHunt: {
    buggyCode: string;
    bugLine: number;
    errorType: 'Syntax Error' | 'Logical Error' | 'Runtime Error';
    bugExplanation: string;
    fixPrompt: string;
    options: string[];
    correctIndex: number;
  };
}

const LAB_ITEMS: LabWorkbenchItem[] = [
  // Group 1: Numeric
  {
    id: 'lab-1',
    groupId: 1,
    title: 'Group 1: 8-Bit Decimal to Binary Converter (0 to 255)',
    objective: 'Convert an 8-bit unsigned integer to binary representation using bitwise shifts ((val >> bit) & 1).',
    codeSnippet: `#include <stdio.h>

void printBinary(unsigned char n) {
    for (int i = 7; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
    }
    printf("\\n");
}

int main(void) {
    unsigned char val = 15;
    printBinary(val);
    return 0;
}`,
    inputs: [{ label: 'Decimal Number (0-255)', defaultVal: '15' }],
    simulateRun: (inp) => {
      const num = Math.min(255, Math.max(0, parseInt(inp['Decimal Number (0-255)']) || 0));
      let bin = '';
      for (let i = 7; i >= 0; i--) {
        bin += (num >> i) & 1;
      }
      return {
        output: `Decimal Input: ${num}\nBinary (8-bit): ${bin}\n[Process completed with exit code 0]`,
        success: true
      };
    },
    bugHunt: {
      buggyCode: `void printBinary(unsigned char n) {
    for (int i = 7; i >= 0; i--) {
        // BUG: Using bitwise OR instead of bitwise AND
        printf("%d", (n >> i) | 1);
    }
}`,
      bugLine: 4,
      errorType: 'Logical Error',
      bugExplanation: 'Using `| 1` forces the least significant bit to always be 1, printing 11111111 for all inputs.',
      fixPrompt: 'How should the bit mask be applied to isolate bit `i`?',
      options: ['(n >> i) & 1', '(n << i) & 1', '(n >> i) && 1', '(n & i) >> 1'],
      correctIndex: 0
    }
  },
  // Group 2: Expression Evaluation - Fixed integer calculator with safe division/modulo by zero
  {
    id: 'lab-2',
    groupId: 2,
    title: 'Group 2: Switch-based Arithmetic Calculator (+, -, *, /, %)',
    objective: 'Menu-driven calculator evaluating integer operations (+, -, *, /, %) with safe division-by-zero and modulo-by-zero validation.',
    codeSnippet: `#include <stdio.h>

int main(void) {
    int a = 20, b = 4;
    char op = '%';

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
                printf("Error: Division by zero is undefined!\\n");
            } else {
                printf("%d / %d = %d\\n", a, b, a / b);
            }
            break;
        case '%': 
            if (b == 0) {
                printf("Error: Modulo by zero is undefined!\\n");
            } else {
                printf("%d %% %d = %d\\n", a, b, a % b);
            }
            break;
        default: 
            printf("Error: Unsupported operator '%c'\\n", op);
            break;
    }
    return 0;
}`,
    inputs: [
      { label: 'Operand A (Integer)', defaultVal: '20' },
      { label: 'Operator (+, -, *, /, %)', defaultVal: '%' },
      { label: 'Operand B (Integer)', defaultVal: '4' }
    ],
    simulateRun: (inp) => {
      const a = parseInt(inp['Operand A (Integer)'], 10) || 0;
      const b = parseInt(inp['Operand B (Integer)'], 10) || 0;
      const op = inp['Operator (+, -, *, /, %)']?.trim() || '+';

      if ((op === '/' || op === '%') && b === 0) {
        return { 
          output: `[RUNTIME EXCEPTION CAUGHT]\nError: Division/Modulo by zero attempted on Operand B = 0!\nProtected by pre-operation guard: if (b == 0) { ... }\n[Process safely aborted with code 1]`, 
          success: false 
        };
      }

      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '*') res = a * b;
      else if (op === '/') res = Math.trunc(a / b);
      else if (op === '%') res = a % b;
      else return { output: `Error: Unsupported operator '${op}'\n[Process exited with code 1]`, success: false };

      return {
        output: `Integer Evaluation: ${a} ${op} ${b} = ${res}\nOperator: '${op}' (Safe Integer Arithmetic)\n[Process completed successfully with exit code 0]`,
        success: true
      };
    },
    bugHunt: {
      buggyCode: `switch (op) {
    case '+': result = a + b; // Missing break!
    case '-': result = a - b; break;
}`,
      bugLine: 2,
      errorType: 'Logical Error',
      bugExplanation: 'Missing break causes fallthrough: addition calculates, but is immediately overwritten by subtraction.',
      fixPrompt: 'What statement prevents control from falling through to the next case?',
      options: ['break;', 'continue;', 'return;', 'exit;'],
      correctIndex: 0
    }
  },
  // Group 3: Arrays & Pointers
  {
    id: 'lab-3',
    groupId: 3,
    title: 'Group 3: Pointer-based Array Reverse Display',
    objective: 'Traverse array from tail to head using pointer arithmetic `*(ptr + n - 1 - i)`.',
    codeSnippet: `#include <stdio.h>

void printReverse(int *arr, int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", *(arr + n - 1 - i));
    }
    printf("\\n");
}`,
    inputs: [{ label: 'Array Elements (comma separated)', defaultVal: '10, 20, 30, 40, 50' }],
    simulateRun: (inp) => {
      const raw = inp['Array Elements (comma separated)'];
      const items = raw.split(',').map(s => s.trim()).filter(Boolean);
      const reversed = [...items].reverse();
      return {
        output: `Original Buffer: [${items.join(', ')}]\nReversed via Pointer Offset: [${reversed.join(', ')}]\nElements: ${items.length}`,
        success: true
      };
    },
    bugHunt: {
      buggyCode: `// Attempting reverse traversal:
for (int *p = arr + n; p >= arr; p--) { // BUG!
    printf("%d ", *p);
}`,
      bugLine: 2,
      errorType: 'Runtime Error',
      bugExplanation: '`arr + n` points to one element past the valid array bounds. Dereferencing it reads garbage memory.',
      fixPrompt: 'How should the pointer be initialized to point to the actual last element?',
      options: ['int *p = arr + n - 1;', 'int *p = arr + n;', 'int *p = arr + 0;', 'int *p = &arr;'],
      correctIndex: 0
    }
  },
  // Group 4: Files - Fixed with explicit fopen NULL check
  {
    id: 'lab-4',
    groupId: 4,
    title: 'Group 4: Lowercase to Uppercase File Copy Pipeline',
    objective: 'Read stream character-by-character, convert with toupper(), verify file-open errors, and write to destination file.',
    codeSnippet: `#include <stdio.h>
#include <ctype.h>

int copyUppercaseFile(const char *srcPath, const char *destPath) {
    FILE *src = fopen(srcPath, "r");
    if (src == NULL) {
        perror("Error: Failed to open source file");
        return 1;
    }

    FILE *dest = fopen(destPath, "w");
    if (dest == NULL) {
        perror("Error: Failed to open destination file");
        fclose(src);
        return 2;
    }

    int ch; /* Must be int to represent EOF (-1) */
    while ((ch = fgetc(src)) != EOF) {
        fputc(toupper(ch), dest);
    }

    fclose(src);
    fclose(dest);
    return 0;
}`,
    inputs: [{ label: 'Input Stream Content', defaultVal: 'hello jntuh r25 c programming lab' }],
    simulateRun: (inp) => {
      const src = inp['Input Stream Content'] || '';
      const dest = src.toUpperCase();
      return {
        output: `Verified fopen("input.txt", "r") -> Handle valid (non-NULL)\nVerified fopen("output.txt", "w") -> Handle valid (non-NULL)\nSource Stream: "${src}"\nCharacters Streamed: ${src.length} (Safe int ch buffer to handle EOF = -1)\nOutput Stream: "${dest}"\nAll file handles closed cleanly via fclose().\n[Process completed with exit code 0]`,
        success: true
      };
    },
    bugHunt: {
      buggyCode: `char ch; // BUG: declared as char!
while ((ch = fgetc(src)) != EOF) {
    fputc(toupper(ch), dest);
}`,
      bugLine: 1,
      errorType: 'Logical Error',
      bugExplanation: 'If char is unsigned by default on target ABI, EOF (-1) converts to 255 and cannot equal -1, causing an infinite loop.',
      fixPrompt: 'What is the required return type for holding fgetc() results including EOF?',
      options: ['int ch;', 'char ch;', 'unsigned char ch;', 'long ch;'],
      correctIndex: 0
    }
  },
  // Group 5: Strings
  {
    id: 'lab-5',
    groupId: 5,
    title: 'Group 5: String Palindrome Verification',
    objective: 'Compare characters from outer boundaries inward to verify palindrome symmetry.',
    codeSnippet: `#include <stdio.h>
#include <string.h>

int isPalindrome(const char *s) {
    int len = strlen(s);
    for (int i = 0; i < len / 2; i++) {
        if (s[i] != s[len - 1 - i]) return 0;
    }
    return 1;
}`,
    inputs: [{ label: 'Test Word or Phrase', defaultVal: 'radar' }],
    simulateRun: (inp) => {
      const str = inp['Test Word or Phrase'] || '';
      const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
      const rev = clean.split('').reverse().join('');
      const isPal = clean === rev;
      return {
        output: `Evaluated String: "${str}"\nLength: ${str.length}\nSymmetry Check: ${isPal ? 'PALINDROME (Matches backwards)' : 'NOT A PALINDROME'}\nExit code: 0`,
        success: isPal
      };
    },
    bugHunt: {
      buggyCode: `// Attempting string copy:
char dest[10];
dest = "hello"; // BUG: Array assignment`,
      bugLine: 3,
      errorType: 'Syntax Error',
      bugExplanation: 'Array names are non-modifiable lvalues and cannot be assigned with `=`.',
      fixPrompt: 'Which function must be used to copy strings in C?',
      options: ['strcpy(dest, "hello");', 'dest == "hello";', 'strcat("hello", dest);', 'dest.copy("hello");'],
      correctIndex: 0
    }
  },
  // Group 6: Searching & Sorting
  {
    id: 'lab-6',
    groupId: 6,
    title: 'Group 6: Selection Sort Descending (Highest to Lowest)',
    objective: 'Find maximum element in unsorted partition and swap with start of pass.',
    codeSnippet: `#include <stdio.h>

void selectionSortDesc(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int maxIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] > arr[maxIdx]) maxIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[maxIdx];
        arr[maxIdx] = temp;
    }
}`,
    inputs: [{ label: 'Array to Sort Descending', defaultVal: '14, 88, 32, 95, 21' }],
    simulateRun: (inp) => {
      const raw = inp['Array to Sort Descending'] || '';
      const nums = raw.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const sorted = [...nums].sort((a, b) => b - a);
      return {
        output: `Input Array: [${nums.join(', ')}]\nSelection Sort Descending Complete\nResult (High to Low): [${sorted.join(', ')}]\nTotal Passes: ${Math.max(0, nums.length - 1)}`,
        success: true
      };
    },
    bugHunt: {
      buggyCode: `// In Selection Sort Descending:
for (int j = i + 1; j < n; j++) {
    if (arr[j] < arr[maxIdx]) maxIdx = j; // BUG: compares with < instead of >
}`,
      bugLine: 3,
      errorType: 'Logical Error',
      bugExplanation: 'Using `<` finds the minimum element rather than the maximum, sorting in ascending order instead of descending.',
      fixPrompt: 'How should the condition be written to sort in descending order?',
      options: ['if (arr[j] > arr[maxIdx])', 'if (arr[j] < arr[maxIdx])', 'if (arr[j] == arr[maxIdx])', 'if (arr[j] != arr[maxIdx])'],
      correctIndex: 0
    }
  }
];

export const LabPracticeArena: React.FC<LabPracticeArenaProps> = ({
  onOpenNotes
}) => {
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'workbench' | 'bughunt' | 'catalogue' | 'challenges'>('workbench');
  
  // Catalogue and Challenge filtering state
  const [catalogueFilter, setCatalogueFilter] = useState<'ALL' | 'PRESCRIBED_LAB' | 'SUPPLEMENTAL_PRACTICE' | 'UNRESOLVED_IN_SPECIFICATION'>('ALL');
  const [challengeFilter, setChallengeFilter] = useState<'ALL' | 'VERIFIED_PYQ' | 'PYQ_VARIANT' | 'SOURCE_MATCH_PENDING_PRIMARY_PDF' | 'SUPPLEMENTAL_CHALLENGE'>('ALL');
  const [expandedProgId, setExpandedProgId] = useState<string | null>(null);
  const [expandedChalId, setExpandedChalId] = useState<string | null>(null);

  // Active item
  const currentItem = LAB_ITEMS.find(it => it.groupId === selectedGroup) || LAB_ITEMS[0];
  
  // Inputs state
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    currentItem.inputs.forEach(inp => { init[inp.label] = inp.defaultVal; });
    return init;
  });

  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [bugAnswered, setBugAnswered] = useState(false);
  const [bugSelection, setBugSelection] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // When group changes, reset inputs and outputs
  const handleGroupChange = (grpNum: number) => {
    soundManager.playClick();
    setSelectedGroup(grpNum);
    const item = LAB_ITEMS.find(it => it.groupId === grpNum) || LAB_ITEMS[0];
    const init: Record<string, string> = {};
    item.inputs.forEach(inp => { init[inp.label] = inp.defaultVal; });
    setInputs(init);
    setConsoleOutput(null);
    setBugAnswered(false);
    setBugSelection(null);
  };

  const handleRunExecution = () => {
    soundManager.playClick();
    const res = currentItem.simulateRun(inputs);
    setConsoleOutput(res.output);
    if (res.success) {
      soundManager.playCorrect();
    } else {
      soundManager.playError();
    }
  };

  const handleBugSelect = (idx: number) => {
    if (bugAnswered) return;
    setBugSelection(idx);
    setBugAnswered(true);

    if (idx === currentItem.bugHunt.correctIndex) {
      soundManager.playCorrect();
    } else {
      soundManager.playError();
    }
  };

  const matchingNotesId = `notes-lab-group${selectedGroup}`;
  const matchingNote = REVISION_NOTES_DATABASE[matchingNotesId] || REVISION_NOTES_DATABASE['notes-lab-group1'];

  const handleDownloadNotes = () => {
    soundManager.playClick();
    const ok = downloadRevisionNoteAsText(matchingNote);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const filteredProgrammes = PRACTICE_PROGRAMMES.filter(p => {
    if (catalogueFilter === 'ALL') return true;
    return p.status === catalogueFilter;
  });

  const filteredChallenges = CHALLENGES_QUESTION_BANK.filter(c => {
    if (challengeFilter === 'ALL') return true;
    return c.provenance.status === challengeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-950 border border-blue-800 text-blue-300">
                {OFFICIAL_SYLLABUS_SOURCE.labCourseCode} Programming for Problem Solving Lab
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {OFFICIAL_SYLLABUS_SOURCE.regulation}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Interactive Lab Practice & Curriculum Integrity Arena
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Compile, simulate, debug syntax/logical errors across the six official JNTUH R25 lab practice groups, or inspect the authoritative 16-programme Practice Catalogue and the transparent PYQ Challenge Bank.
            </p>
            <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{OFFICIAL_SYLLABUS_SOURCE.governanceNote}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNotes(matchingNotesId)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Lab Notes</span>
            </button>

            <button
              onClick={handleDownloadNotes}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 glow-cyan'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Downloaded .txt!' : 'Download .txt'}</span>
            </button>
          </div>
        </div>

        {/* Primary View Mode Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('workbench');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'workbench'
                ? 'bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-950 glow-cyan'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('bughunt');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bughunt'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Debug Challenge</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('catalogue');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalogue'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Practice Catalogue (16)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-950 text-indigo-200 border border-indigo-700">
              V2 Reconciled
            </span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('challenges');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'challenges'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>PYQ & Challenge Bank (10)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-200 border border-emerald-700">
              Verified Provenance
            </span>
          </button>
        </div>

        {/* Group Selector Pills (Only for workbench and bughunt) */}
        {(activeTab === 'workbench' || activeTab === 'bughunt') && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
            {[
              { num: 1, label: 'Group 1: Numeric (0-255)' },
              { num: 2, label: 'Group 2: Switch Calculator' },
              { num: 3, label: 'Group 3: Pointers & Array Rev' },
              { num: 4, label: 'Group 4: File Copy Pipeline' },
              { num: 5, label: 'Group 5: String Palindrome' },
              { num: 6, label: 'Group 6: Selection Sort Desc' }
            ].map((grp) => (
              <button
                key={grp.num}
                onClick={() => handleGroupChange(grp.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedGroup === grp.num
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Workbench Body */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        {/* VIEW 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'workbench' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                {currentItem.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{currentItem.objective}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* C Code Block (7 cols) */}
              <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Standard C99 Implementation</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Tested & Verified</span>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{currentItem.codeSnippet}</code>
                </pre>
              </div>

              {/* Execution Simulator (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Input Parameters (stdin)</span>
                  </div>

                  {currentItem.inputs.map((inp, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-xs text-slate-300 font-medium">{inp.label}</label>
                      <input
                        type="text"
                        value={inputs[inp.label] || ''}
                        onChange={(e) => setInputs(prev => ({ ...prev, [inp.label]: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleRunExecution}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Run Simulated Program</span>
                  </button>
                </div>

                {/* Simulated Output Terminal */}
                <div className="bg-[#05070c] rounded-xl border border-slate-800 p-3 font-mono text-xs text-emerald-400 min-h-[120px] overflow-x-auto">
                  <div className="text-[10px] text-slate-500 mb-1 select-none">stdout terminal console:</div>
                  {consoleOutput ? (
                    <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                  ) : (
                    <span className="text-slate-600 italic">Click "Run Simulated Program" to view execution output...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: BUG HUNT / DEBUG CHALLENGE */}
        {activeTab === 'bughunt' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-rose-400">Error Classification</span>
                <div className="text-sm font-bold text-white">{currentItem.bugHunt.errorType} in Lab Source</div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-rose-950 text-rose-300 border border-rose-800">
                Suspect Line: #{currentItem.bugHunt.bugLine}
              </span>
            </div>

            {/* Buggy Snippet */}
            <div className="bg-slate-950 rounded-xl border border-rose-950 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-rose-400">
                Defective Source Fragment
              </div>
              <pre className="p-4 text-xs font-mono text-rose-300 leading-relaxed overflow-x-auto">
                <code>{currentItem.bugHunt.buggyCode}</code>
              </pre>
            </div>

            {/* Question Prompt */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white">
                {currentItem.bugHunt.fixPrompt}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentItem.bugHunt.options.map((opt, idx) => {
                  let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (bugAnswered) {
                    if (idx === currentItem.bugHunt.correctIndex) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold glow-neon';
                    } else if (idx === bugSelection) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      style = 'opacity-40 border-slate-900 text-slate-600';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={bugAnswered}
                      onClick={() => handleBugSelect(idx)}
                      className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {bugAnswered && idx === currentItem.bugHunt.correctIndex && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bug Explanation */}
            {bugAnswered && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-cyan-400">Root Cause Analysis:</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentItem.bugHunt.bugExplanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PRACTICE CATALOGUE (16 RECONCILED PROGRAMMES) */}
        {activeTab === 'catalogue' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Authoritative Practice Catalogue (16 Programmes)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reconciled against JNTUH R25 curriculum. Unresolved entries (<span className="text-amber-400 font-mono">P-U3-03</span> and <span className="text-amber-400 font-mono">P-V-03</span>) are explicitly preserved without invention or renumbering.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {(['ALL', 'PRESCRIBED_LAB', 'SUPPLEMENTAL_PRACTICE', 'UNRESOLVED_IN_SPECIFICATION'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setCatalogueFilter(st)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      catalogueFilter === st
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'All (16)' : st === 'PRESCRIBED_LAB' ? 'Prescribed Lab' : st === 'SUPPLEMENTAL_PRACTICE' ? 'Supplementary' : 'Unresolved'}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Programmes */}
            <div className="space-y-4">
              {filteredProgrammes.map((prog) => {
                const isExpanded = expandedProgId === prog.id;
                return (
                  <div 
                    key={prog.id} 
                    className={`border rounded-xl p-4 transition-all ${
                      prog.isUnresolved 
                        ? 'bg-amber-950/10 border-amber-900/40' 
                        : prog.status === 'PRESCRIBED_LAB' 
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                          prog.isUnresolved
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : prog.status === 'PRESCRIBED_LAB'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}>
                          {prog.id}
                        </span>
                        <h3 className="text-sm font-bold text-white">{prog.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                          prog.isUnresolved
                            ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                            : prog.status === 'PRESCRIBED_LAB'
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                            : 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50'
                        }`}>
                          {prog.category}
                        </span>

                        <button
                          onClick={() => setExpandedProgId(isExpanded ? null : prog.id)}
                          className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Unresolved Alert Notice */}
                    {prog.isUnresolved && (
                      <div className="mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <div className="font-bold">Unresolved Specification Marker:</div>
                          <p className="mt-0.5 leading-relaxed text-[11px]">{prog.unresolvedReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Expanded Technical Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in">
                        {/* Course & Local Mapping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          {prog.officialSyllabusMapping && (
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">University Syllabus Mapping</span>
                              <span className="text-cyan-300">{prog.officialSyllabusMapping.courseCode}</span>: {prog.officialSyllabusMapping.syllabusRef}
                            </div>
                          )}
                          {prog.collegeLocalMapping && (
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">College Internal Course Identifier</span>
                              <span className="text-purple-300">{prog.collegeLocalMapping.localCourseCode}</span> — {prog.collegeLocalMapping.institutionLocalNote}
                            </div>
                          )}
                        </div>

                        {/* Technical Verification Details */}
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold">Supported Input Range & Bounds: </span>
                            <span className="text-slate-200">{prog.technicalVerification.supportedInputs}</span>
                          </div>
                          {prog.technicalVerification.complexityAnalysis && (
                            <div>
                              <span className="text-slate-400 font-semibold">Computational Complexity: </span>
                              <span className="text-emerald-400 font-mono">{prog.technicalVerification.complexityAnalysis}</span>
                            </div>
                          )}
                          {prog.technicalVerification.implementationNotes && (
                            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300">
                              <span className="text-cyan-400 font-bold block mb-1">Academic Specification Note:</span>
                              {prog.technicalVerification.implementationNotes}
                            </div>
                          )}
                          {prog.technicalVerification.edgeCases && prog.technicalVerification.edgeCases.length > 0 && (
                            <div>
                              <span className="text-slate-400 font-semibold block mb-1">Critical Edge Cases & Pitfalls:</span>
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {prog.technicalVerification.edgeCases.map((ec, i) => (
                                  <li key={i} className="text-[11px]">{ec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Code Template Preview */}
                        {prog.codeTemplate && (
                          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                            <div className="px-3 py-1.5 bg-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Reference Code Template</span>
                            </div>
                            <pre className="p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                              <code>{prog.codeTemplate}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: PYQ & CHALLENGE BANK (TRANSPARENT PROVENANCE) */}
        {activeTab === 'challenges' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Challenge Question Bank with Provenance Records (10)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Transparent academic sourcing. Original examination question text is kept strictly separated from normalized platform problem statements.
                </p>
              </div>

              {/* Provenance Filter */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {(['ALL', 'VERIFIED_PYQ', 'PYQ_VARIANT', 'SOURCE_MATCH_PENDING_PRIMARY_PDF', 'SUPPLEMENTAL_CHALLENGE'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setChallengeFilter(st)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      challengeFilter === st
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'All (10)' : st === 'VERIFIED_PYQ' ? 'Verified PYQ' : st === 'PYQ_VARIANT' ? 'PYQ Variant' : st === 'SOURCE_MATCH_PENDING_PRIMARY_PDF' ? 'Pending PDF' : 'Supplemental'}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Challenges */}
            <div className="space-y-4">
              {filteredChallenges.map((chal) => {
                const isExpanded = expandedChalId === chal.id;
                return (
                  <div 
                    key={chal.id}
                    className="border border-slate-800 rounded-xl p-4 bg-slate-950/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                          {chal.id}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-white">{chal.title}</h3>
                          <span className="text-[11px] text-slate-400 font-mono">{chal.topicTag}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Provenance Badge */}
                        <span className={`text-[10px] px-2.5 py-1 rounded font-mono uppercase font-bold border ${
                          chal.provenance.status === 'VERIFIED_PYQ'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : chal.provenance.status === 'PYQ_VARIANT'
                            ? 'bg-purple-950 text-purple-300 border-purple-700'
                            : chal.provenance.status === 'SOURCE_MATCH_PENDING_PRIMARY_PDF'
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}>
                          {chal.provenance.status.replace(/_/g, ' ')}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                          chal.difficulty === 'Easy' ? 'bg-emerald-950/50 text-emerald-400' :
                          chal.difficulty === 'Medium' ? 'bg-amber-950/50 text-amber-400' :
                          'bg-rose-950/50 text-rose-400'
                        }`}>
                          {chal.difficulty}
                        </span>

                        <button
                          onClick={() => setExpandedChalId(isExpanded ? null : chal.id)}
                          className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Compact Provenance Summary Line */}
                    <div className="mt-2.5 text-xs text-slate-400 flex flex-wrap items-center gap-2 font-mono">
                      <span>Source: {chal.provenance.institution}</span>
                      {chal.provenance.paperCode && (
                        <span className="text-cyan-400 font-bold">• Paper {chal.provenance.paperCode} ({chal.provenance.regulation})</span>
                      )}
                      {chal.provenance.examinationSession && (
                        <span>• {chal.provenance.examinationSession}</span>
                      )}
                      {chal.provenance.questionNumber && (
                        <span className="text-emerald-400 font-bold">• Q{chal.provenance.questionNumber}</span>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in text-xs">
                        {/* Original Exam Wording vs Normalized Statement */}
                        {chal.originalExamWording && (
                          <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/50 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wider">
                              Original University Examination Wording
                            </span>
                            <p className="text-indigo-200 italic font-serif text-sm">
                              "{chal.originalExamWording}"
                            </p>
                          </div>
                        )}

                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-wider">
                            Normalized Platform Problem Statement
                          </span>
                          <p className="text-slate-200 leading-relaxed">
                            {chal.normalizedStatement}
                          </p>
                        </div>

                        {chal.normalizationNotes && (
                          <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                            <span className="text-amber-400 font-bold font-mono">Normalization & Provenance Note: </span>
                            {chal.normalizationNotes}
                          </div>
                        )}

                        {/* I/O Specifications & Constraints */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Input Format</span>
                            <span className="text-slate-300 whitespace-pre-wrap">{chal.inputFormat}</span>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Output Format</span>
                            <span className="text-slate-300 whitespace-pre-wrap">{chal.outputFormat}</span>
                          </div>
                        </div>

                        {/* Constraints */}
                        <div>
                          <span className="text-slate-400 font-semibold block mb-1">Computational Constraints:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-300 font-mono text-[11px]">
                            {chal.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Sample I/O */}
                        <div className="space-y-2">
                          <span className="text-slate-400 font-semibold block">Sample Input & Output:</span>
                          {chal.sampleIO.map((s, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 font-mono">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-slate-500 text-[10px] block">Sample Input {idx + 1}:</span>
                                  <pre className="p-2 rounded bg-slate-950 text-cyan-300 overflow-x-auto">{s.input}</pre>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[10px] block">Sample Output {idx + 1}:</span>
                                  <pre className="p-2 rounded bg-slate-950 text-emerald-300 overflow-x-auto">{s.output}</pre>
                                </div>
                              </div>
                              {s.explanation && (
                                <p className="text-[11px] text-slate-400 font-sans italic">{s.explanation}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Test-Case Plan */}
                        <div>
                          <span className="text-slate-400 font-semibold block mb-2">Test-Case Plan (Confidential Test Matrix):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {chal.testCasePlan.map((tc) => (
                              <div key={tc.caseId} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-bold text-slate-400">{tc.caseId}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                    tc.category === 'Boundary' ? 'bg-amber-950 text-amber-300' :
                                    tc.category === 'Edge' ? 'bg-rose-950 text-rose-300' :
                                    tc.category === 'Stress' ? 'bg-purple-950 text-purple-300' :
                                    'bg-slate-800 text-slate-300'
                                  }`}>
                                    {tc.category}
                                  </span>
                                </div>
                                <div className="text-slate-300">{tc.description}</div>
                                <div className="text-[10px] text-slate-500 mt-1">Expected: {tc.expectedBehavior}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
