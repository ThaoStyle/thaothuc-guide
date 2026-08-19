const fs = require('fs');
const lines = fs.readFileSync('frontend/src/main.js', 'utf8').split('\n');
console.log(lines.slice(2290, 2310).join('\n'));
