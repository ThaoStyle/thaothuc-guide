const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// I will append a fix to the nuclear CSS block
let fixCss = "\n  .modal-backdrop { z-index: 99999999 !important; }\n";

html = html.replace('body, html { overflow: auto !important; height: 100% !important; background: #f8fafc !important; }', 
  'body, html { overflow: auto !important; height: 100% !important; background: #f8fafc !important; }' + fixCss);

fs.writeFileSync('Index.html', html, 'utf8');
console.log('Patched modal z-index!');
