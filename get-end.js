const fs = require('fs');
const js = fs.readFileSync('frontend/src/main.js', 'utf8');
const idx = js.indexOf('renderDesktopSidebar(filtered)');
console.log(js.substring(idx, idx + 200));
