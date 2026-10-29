const fs = require('fs');

const notes = fs.readFileSync('src/data/revisionNotesData.ts', 'utf8');
const syllabus = fs.readFileSync('src/data/syllabusData.ts', 'utf8');

const topicsToCheck = [
  { name: 'Functions without arguments & with input arguments', pattern: /without arguments/i },
  { name: 'Scope of names & formal output parameters', pattern: /formal output parameters|scope of names/i },
  { name: 'Parallel arrays & enumerated types', pattern: /parallel arrays|enumerated types|enum\s+/i },
  { name: 'Substrings, whole-line input (fgets), arrays of pointers', pattern: /fgets|arrays of pointers|substring/i },
  { name: 'Recursive math, arrays and strings recursion', pattern: /recursive.*(array|string)|palindrome.*recursive/i },
  { name: 'Structure data as in/out parameters & returning structured values', pattern: /returning structured values|structure data as input/i },
  { name: 'Union types and memory layout', pattern: /union types|memory layout/i },
  { name: 'Searching a database, linear search, binary search', pattern: /searching a database|linear search|binary search/i },
  { name: 'Bubble sort, insertion sort, selection sort', pattern: /bubble sort.*insertion sort.*selection sort/i },
  { name: 'Sorting an array of names in lab', pattern: /array of names|sorting names/i },
  { name: 'Dynamic memory allocation failure & free()', pattern: /malloc.*NULL|free\(|dynamic memory/i }
];

console.log('--- REVISION NOTES & SYLLABUS AUDIT ---');
for (const t of topicsToCheck) {
  const inNotes = t.pattern.test(notes);
  const inSyllabus = t.pattern.test(syllabus);
  console.log(`${t.name}: Notes=${inNotes ? 'YES' : 'NO'}, Syllabus=${inSyllabus ? 'YES' : 'NO'}`);
}

