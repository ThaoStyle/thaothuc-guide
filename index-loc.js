const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('loc-sheet'));
console.log(lines.slice(idx, idx + 25).join('\n'));
