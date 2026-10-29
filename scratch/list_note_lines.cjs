const fs = require('fs');
const lines = fs.readFileSync('src/data/revisionNotesData.ts', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("': {")) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
  }
}

