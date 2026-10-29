const fs = require('fs');
const n = fs.readFileSync('src/data/revisionNotesData.ts', 'utf8');

const start = n.indexOf(`'notes-u2-pointers':`);
const end = n.indexOf(`},\n  'notes-u2-functions'`, start);
console.log(n.slice(start + 1500, end));
