const fs = require('fs');
let code = fs.readFileSync('Code.gs', 'utf8');
code = code.replace('function doGet(e) {', 'function doGet(e) {\n  // Fixed doGet');
fs.writeFileSync('Code.gs', code);
