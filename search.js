const fs = require('fs');
const lines = fs.readFileSync('frontend/index.html', 'utf8').split('\n');
console.log(lines.slice(0, 30).join('\n'));
