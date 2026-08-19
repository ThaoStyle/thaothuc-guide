const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('id="mobile-list-gps-status"'));
console.log(lines.slice(idx - 2, idx + 5).join('\n'));
