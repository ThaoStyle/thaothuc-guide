const fs = require('fs');
const lines = fs.readFileSync('frontend/src/main.js', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('function filterMap('));
console.log(lines.slice(idx, idx + 25).join('\n'));
