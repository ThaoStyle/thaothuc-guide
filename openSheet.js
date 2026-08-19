const fs = require('fs');
const lines = fs.readFileSync('frontend/src/main.js', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('function openSheet('));
console.log(lines.slice(idx + 15, idx + 40).join('\n'));
