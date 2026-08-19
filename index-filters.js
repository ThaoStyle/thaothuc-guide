const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('sheet-filters'));
console.log(lines.slice(idx - 5, idx + 10).join('\n'));
