const fs = require('fs');
const lines = fs.readFileSync('src/main.js', 'utf8').split('\n');
const fStart = lines.findIndex(l => l.includes('function openSheet'));
console.log(lines.slice(fStart, fStart + 25).join('\n'));
