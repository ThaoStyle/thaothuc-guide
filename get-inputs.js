const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const inputs = [...html.matchAll(/<input[^>]+placeholder="([^"]+)"/g)];
inputs.forEach(i => console.log(i[1]));
