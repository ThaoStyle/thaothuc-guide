const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
console.log(html.substring(6200, 6800));
