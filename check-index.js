const fs = require('fs');
const html = fs.readFileSync('Index.html', 'utf8');
const lines = html.split('\n');
const scriptStart = lines.findIndex(l => l.includes('function getFavs()'));
console.log(lines.slice(Math.max(0, scriptStart - 10), scriptStart + 20).join('\n'));
