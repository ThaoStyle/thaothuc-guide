const fs = require('fs');
const js = fs.readFileSync('frontend/src/main.js', 'utf8');
const idx = js.indexOf('function toggleFilterMap(type, btn)');
console.log(js.substring(idx - 200, idx + 100));
