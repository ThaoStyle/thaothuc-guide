const fs = require('fs');

let sheetCode = fs.readFileSync('tests/bottom-sheet.spec.js', 'utf8');
sheetCode = sheetCode.replace(/'#m-crit \.modal-close'/g, "'#m-crit .btn-submit'");
fs.writeFileSync('tests/bottom-sheet.spec.js', sheetCode);

console.log('Fixed button selector!');
