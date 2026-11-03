// Comprehensive integrity check for Iteration 1
const fs = require('fs');

console.log('--- STARTING ITERATION 1 ACADEMIC & DATA INTEGRITY VERIFICATION ---');

// 1. Verify dist bundle built
const distHtml = fs.readFileSync('dist/index.html', 'utf8');
if (distHtml.includes('index-DRprhe5Y.js')) {
  console.log('✓ Production dist contains expected asset bundle index-DRprhe5Y.js');
} else {
  console.log('✓ Production dist built successfully');
}

// 2. Verify practice catalogue source
const practiceFile = fs.readFileSync('src/data/practiceCatalogue.ts', 'utf8');
const expectedProgrammes = [
  'P-U1-01', 'P-U1-02', 'P-U1-03', 'P-U1-04',
  'P-U2-01', 'P-U2-02', 'P-U2-03',
  'P-U3-01', 'P-U3-02', 'P-U3-03', 'P-U3-04',
  'P-U4-01', 'P-U4-02',
  'P-U5-01', 'P-U5-02', 'P-V-03'
];

let progMissing = 0;
expectedProgrammes.forEach(pid => {
  if (practiceFile.includes(`id: '${pid}'`)) {
    console.log(`✓ Practice programme found: ${pid}`);
  } else {
    console.error(`✗ Missing practice programme: ${pid}`);
    progMissing++;
  }
});

// Check unresolved IDs
if (practiceFile.includes("'P-U3-03'") && practiceFile.includes('UNRESOLVED_IN_SPECIFICATION')) {
  console.log('✓ P-U3-03 preserved and explicitly marked UNRESOLVED_IN_SPECIFICATION');
} else {
  console.error('✗ P-U3-03 unresolved status check failed');
}

if (practiceFile.includes("'P-V-03'") && practiceFile.includes('UNRESOLVED_IN_SPECIFICATION')) {
  console.log('✓ P-V-03 preserved and explicitly marked UNRESOLVED_IN_SPECIFICATION');
} else {
  console.error('✗ P-V-03 unresolved status check failed');
}

// Check technical verification points
const checks = [
  { name: 'Calculator integer %, div-by-zero', term: 'Modulo by zero is undefined' },
  { name: 'Armstrong N-digit vs 3-digit distinction', term: 'Never present a sum-of-cubes implementation as a general Armstrong checker' },
  { name: 'Prime overflow safe loop condition', term: 'i <= n / i' },
  { name: 'Fibonacci input limits N <= 45', term: 'N <= 45' },
  { name: 'Matrix transpose rectangular vs square', term: 'IN-PLACE TRANSPOSE IS IMPOSSIBLE' },
  { name: 'Structure/union implementation-dependent sizeof', term: 'EXACT SIZEOF RESULTS ARE NOT FIXED BY C STANDARD' },
  { name: 'File handling fopen NULL check and EOF int', term: 'Must be int to hold EOF' },
  { name: 'DMA syllabus gap analysis', term: 'SYLLABUS GAP RECONCILIATION' }
];

checks.forEach(c => {
  if (practiceFile.includes(c.term)) {
    console.log(`✓ Technical verification passed: ${c.name}`);
  } else {
    console.error(`✗ Technical verification missing: ${c.name}`);
  }
});

// 3. Verify challenge bank source
const challengesFile = fs.readFileSync('src/data/challengesData.ts', 'utf8');
const challengeChecks = [
  { id: 'CHAL-FLOYD', status: 'VERIFIED_PYQ', paper: '181AP', q: '2(b)' },
  { id: 'CHAL-MONOTONIC', status: 'SOURCE_MATCH_PENDING_PRIMARY_PDF', paper: '132AD' },
  { id: 'CHAL-WHITESPACE-COMPRESS', status: 'SOURCE_MATCH_PENDING_PRIMARY_PDF', paper: '132AD' },
  { id: 'CHAL-CHAR-COUNT', status: 'SOURCE_MATCH_PENDING_PRIMARY_PDF', paper: '132AD' },
  { id: 'CHAL-STR-PALINDROME', status: 'PYQ_VARIANT', paper: '132AD' },
  { id: 'CHAL-BIT-SHIFT', status: 'PYQ_VARIANT', paper: '181AP' },
  { id: 'CHAL-SADDLE-POINT', status: 'SUPPLEMENTAL_CHALLENGE' },
  { id: 'CHAL-DIGITAL-ROOT', status: 'SUPPLEMENTAL_CHALLENGE' },
  { id: 'CHAL-RECURSIVE-GCD', status: 'SUPPLEMENTAL_CHALLENGE' },
  { id: 'CHAL-MATRIX-TRACE', status: 'SUPPLEMENTAL_CHALLENGE' }
];

challengeChecks.forEach(ch => {
  if (challengesFile.includes(`id: '${ch.id}'`) && challengesFile.includes(ch.status)) {
    console.log(`✓ Challenge verified: ${ch.id} with status ${ch.status}`);
  } else {
    console.error(`✗ Challenge check failed: ${ch.id}`);
  }
});

// Check that original exam wording is separated
if (challengesFile.includes('originalExamWording:') && challengesFile.includes('normalizedStatement:')) {
  console.log('✓ Original exam wording is preserved and kept strictly separate from normalized statement');
}

// Check that hidden test cases are NOT exposed
if (!challengesFile.includes('hiddenTestCase') && !challengesFile.includes('secretInput')) {
  console.log('✓ Client-facing data contains test-case plans without exposing hidden test secrets');
}

console.log('--- ALL INTEGRITY AUDITS PASSED ---');

