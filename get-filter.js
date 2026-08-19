const fs = require('fs');
const js = fs.readFileSync('frontend/src/main.js', 'utf8');
const startIdx = js.indexOf('function filterMap(f, btn');
const endIdx = js.indexOf('function loadMarkers(', startIdx);
console.log(js.substring(startIdx, endIdx));
