const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('sheet-filters'));
console.log(lines.slice(idx - 25, idx + 5).join('\n'));
