const fs = require('fs');
let mainJs = fs.readFileSync('frontend/src/main.js', 'utf8');

mainJs = mainJs.replace(
  "RECIPES_DATA = res && Array.isArray(res.data) ? res.data : [];", 
  "RECIPES_DATA = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);"
);

fs.writeFileSync('frontend/src/main.js', mainJs, 'utf8');
console.log('Fixed array check');
