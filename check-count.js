const fs = require('fs');
const js = fs.readFileSync('frontend/src/main.js', 'utf8');
const matches = [...js.matchAll(/function toggleFilterMap/g)];
console.log("Found " + matches.length + " instances.");
