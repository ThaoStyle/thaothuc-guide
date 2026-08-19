const fs = require('fs');
const html = fs.readFileSync('Index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
let allScript = scriptMatches.map(m => m[1]).join('\n');
fs.writeFileSync('temp.js', allScript, 'utf8');
