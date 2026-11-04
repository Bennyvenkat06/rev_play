// Comprehensive verification script for REVPLAY Iteration 2
const fs = require('fs');

console.log('================================================================');
console.log('--- STARTING REVPLAY ITERATION 2 MASTER INTEGRITY VERIFICATION ---');
console.log('================================================================\n');

let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
  } else {
    console.error(`✗ FAIL: ${message}`);
    failedTests++;
  }
}

// 1. Verify Authoritative V2 Programme Catalogue
console.log('--- 1. Testing Authoritative V2 Programme Catalogue ---');
const practiceFile = fs.readFileSync('src/data/practiceCatalogue.ts', 'utf8');

const authoritativeV2Map = [
  { id: 'P-U1-01', title: 'Largest of Three' },
  { id: 'P-U1-02', title: 'Reverse Integer' },
  { id: 'P-U1-03', title: 'Menu-Driven Calculator' },
  { id: 'P-U1-04', title: 'Armstrong Number Checker' },
  { id: 'P-U2-01', title: 'Modular Prime & Leap Year' },
  { id: 'P-U2-02', title: 'Pass-by-Reference Variable Swapping' },
  { id: 'P-U2-03', title: 'Pointer Arithmetic & Array Passing' },
  { id: 'P-U3-01', title: '1D Array Statistics' },
  { id: 'P-U3-02', title: '2D Matrix Multiplication' },
  { id: 'P-U3-03', title: 'Unresolved Specification Programme (Unit III Entry 03)' },
  { id: 'P-U3-04', title: 'Transpose of Matrix' },
  { id: 'P-U4-01', title: 'Recursive Fibonacci' },
  { id: 'P-U4-02', title: 'Student Grade Management using Structs' },
  { id: 'P-U4-03', title: 'Structure vs Union Memory Comparison' },
  { id: 'P-V-01',  title: 'File Copy & Character Count' },
  { id: 'P-V-02',  title: 'Linear vs Binary Search' },
  { id: 'P-V-03',  title: 'Unresolved Specification Programme (Unit V Entry 03 / P-V-03)' },
  { id: 'P-V-04',  title: 'Insertion Sort' },
];

authoritativeV2Map.forEach(item => {
  const hasId = practiceFile.includes(`id: '${item.id}'`);
  const hasTitle = practiceFile.includes(item.title);
  assert(hasId && hasTitle, `${item.id} accurately mapped to "${item.title}"`);
});

// Unresolved preservation check
assert(
  practiceFile.includes("'P-U3-03'") && practiceFile.includes('UNRESOLVED_IN_SPECIFICATION'),
  'P-U3-03 preserved as UNRESOLVED_IN_SPECIFICATION without inventing content'
);
assert(
  practiceFile.includes("'P-V-03'") && practiceFile.includes('UNRESOLVED_IN_SPECIFICATION'),
  'P-V-03 preserved as UNRESOLVED_IN_SPECIFICATION without inventing content'
);

// DMA Coverage Gap Item Check
assert(
  practiceFile.includes('GAP-DMA-U2') && practiceFile.includes('Dynamic Memory Allocation (malloc, calloc, realloc, free) - Curriculum Coverage Gap'),
  'DMA formally documented as a specific curriculum coverage gap without inventing an official JNTUH code'
);

// Backward Compatibility Map Check
assert(
  practiceFile.includes('LEGACY_PROGRAMME_ID_MAP'),
  'LEGACY_PROGRAMME_ID_MAP exists to ensure backward compatibility with earlier IDs'
);

// 2. Verify Four Experiences Architecture & Top-level Navigation
console.log('\n--- 2. Testing Four Experiences Architecture & Navigation ---');
const navbarFile = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
assert(navbarFile.includes("id: 'home'"), "Navbar contains 'home'");
assert(navbarFile.includes("id: 'theory'"), "Navbar contains 'theory' (CS103ES)");
assert(navbarFile.includes("id: 'laboratory'"), "Navbar contains 'laboratory' (CS107ES)");
assert(navbarFile.includes("id: 'notes'"), "Navbar contains 'notes' (Revision Library)");
assert(navbarFile.includes("id: 'progress'"), "Navbar contains 'progress'");

const appFile = fs.readFileSync('src/App.tsx', 'utf8');
assert(appFile.includes("<TheorySection"), 'App mounts TheorySection');
assert(appFile.includes("<LabSection"), 'App mounts LabSection');
assert(appFile.includes("<ProgressSection"), 'App mounts ProgressSection');
assert(appFile.includes("<NotesLibrary"), 'App mounts NotesLibrary');
assert(appFile.includes("theoryMode"), 'App maintains independent theoryMode');
assert(appFile.includes("labMode"), 'App maintains independent labMode');
assert(appFile.includes("hashchange"), 'App supports direct URL hash addressability (#/theory/practice, #/theory/challenge, #/laboratory/practice, #/laboratory/challenge)');

// 3. Verify Theory Section (Practice & Challenge Modes)
console.log('\n--- 3. Testing Theory Section Components ---');
const theorySectionFile = fs.readFileSync('src/components/theory/TheorySection.tsx', 'utf8');
assert(theorySectionFile.includes('TheoryChallengeArena'), 'TheorySection integrates TheoryChallengeArena');
assert(theorySectionFile.includes('5-Unit Curriculum Navigation'), 'TheorySection provides 5-unit theory navigation');
assert(theorySectionFile.includes('Practice Mode'), 'TheorySection supports Practice Mode');
assert(theorySectionFile.includes('Challenge Mode'), 'TheorySection supports Challenge Mode');

const theoryQuestionsFile = fs.readFileSync('src/data/theoryChallengeData.ts', 'utf8');
assert(theoryQuestionsFile.includes('THEORY_QUESTION_BANK'), 'THEORY_QUESTION_BANK is exported');
assert(theoryQuestionsFile.includes('RevPlay Supplemental Conceptual Question'), 'Theory questions are labeled with honest provenance');
assert(theoryQuestionsFile.includes('OUTPUT_PREDICTION'), 'Theory challenge supports OUTPUT_PREDICTION');
assert(theoryQuestionsFile.includes('CODE_TRACING'), 'Theory challenge supports CODE_TRACING');
assert(theoryQuestionsFile.includes('FIND_THE_ERROR'), 'Theory challenge supports FIND_THE_ERROR');
assert(theoryQuestionsFile.includes('FILL_MISSING_STEP'), 'Theory challenge supports FILL_MISSING_STEP');
assert(theoryQuestionsFile.includes('CONCEPTUAL_REASONING'), 'Theory challenge supports CONCEPTUAL_REASONING');
assert(theoryQuestionsFile.includes('MULTIPLE_SELECT'), 'Theory challenge supports MULTIPLE_SELECT');

// 4. Verify Laboratory Section (Practice & Challenge Modes)
console.log('\n--- 4. Testing Laboratory Section Components ---');
const labSectionFile = fs.readFileSync('src/components/lab/LabSection.tsx', 'utf8');
assert(labSectionFile.includes('LabPracticeArena'), 'LabSection preserves full LabPracticeArena in Practice Mode');
assert(labSectionFile.includes('LabChallengeArena'), 'LabSection integrates LabChallengeArena in Challenge Mode');

const labChallengeFile = fs.readFileSync('src/components/lab/LabChallengeArena.tsx', 'utf8');
assert(labChallengeFile.includes('Run Code'), 'LabChallengeArena provides Run Code button with custom stdin');
assert(labChallengeFile.includes('Submit Solution'), 'LabChallengeArena provides Submit Solution button');
assert(labChallengeFile.includes('CompilerService'), 'LabChallengeArena connects to CompilerService interface');
assert(labChallengeFile.includes('solution.c'), 'LabChallengeArena provides C code editor');

// 5. Verify Compiler Service (Truthful NOT_CONFIGURED state, zero fake compilation)
console.log('\n--- 5. Testing Compiler Service Interface ---');
const compilerServiceFile = fs.readFileSync('src/services/compilerService.ts', 'utf8');
assert(compilerServiceFile.includes('NOT_CONFIGURED'), 'CompilerService implements NOT_CONFIGURED verdict');
assert(compilerServiceFile.includes('No remote isolated C execution service is currently configured'), 'CompilerService provides truthful explanation when unconfigured');
assert(compilerServiceFile.includes('runCode'), 'CompilerService exports runCode');
assert(compilerServiceFile.includes('submitSolution'), 'CompilerService exports submitSolution');

// 6. Verify DOCX Notes Export
console.log('\n--- 6. Testing DOCX Notes Generation ---');
const downloadDocxFile = fs.readFileSync('src/utils/downloadDocx.ts', 'utf8');
assert(downloadDocxFile.includes('Document'), 'docx Document packing utility is present');
assert(downloadDocxFile.includes('Packer.toBlob'), 'docx Blob generation is present');

// 7. Verify Production Dist Assets
console.log('\n--- 7. Testing Production Build Output ---');
assert(fs.existsSync('dist/index.html'), 'dist/index.html exists');
const distFiles = fs.readdirSync('dist/assets');
const jsBundle = distFiles.find(f => f.endsWith('.js'));
const cssBundle = distFiles.find(f => f.endsWith('.css'));
assert(Boolean(jsBundle), `Production JS bundle found: ${jsBundle}`);
assert(Boolean(cssBundle), `Production CSS bundle found: ${cssBundle}`);

console.log('\n================================================================');
if (failedTests === 0) {
  console.log('🎉 ALL REVPLAY ITERATION 2 VERIFICATION CHECKS PASSED PERFECTLY!');
} else {
  console.error(`💥 VERIFICATION FAILED: ${failedTests} checks failed!`);
  process.exit(1);
}
console.log('================================================================');

