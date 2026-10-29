const fs = require('fs');
const n = fs.readFileSync('src/data/revisionNotesData.ts', 'utf8');

function showNote(noteId) {
  const start = n.indexOf(`'${noteId}':`);
  if (start === -1) {
    console.log(`Note ${noteId} not found`);
    return;
  }
  const end = n.indexOf(`},\n  'notes-`, start + 10);
  console.log(`=== ${noteId} ===`);
  console.log(n.slice(start, end !== -1 ? end + 2 : start + 3000));
}

showNote('notes-u2-functions');

