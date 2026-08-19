const fs = require('fs');

// Fix bottom-sheet.spec.js
let sheetCode = fs.readFileSync('tests/bottom-sheet.spec.js', 'utf8');
sheetCode = sheetCode.replace(/toHaveClass\(\/show\/\)/g, 'toHaveClass(/open/)');
fs.writeFileSync('tests/bottom-sheet.spec.js', sheetCode);

// Fix navigation-and-i18n.spec.js
let navCode = fs.readFileSync('tests/navigation-and-i18n.spec.js', 'utf8');
navCode = navCode.replace(/toHaveClass\(\/active\/\)/g, 'toHaveClass(/show/)');
fs.writeFileSync('tests/navigation-and-i18n.spec.js', navCode);

console.log('Fixed classes');
