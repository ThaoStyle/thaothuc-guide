const fs = require('fs');
let mainJs = fs.readFileSync('frontend/src/main.js', 'utf8');
mainJs = mainJs.replace("?ang ti cA'ng thcc...", "Đang tải công thức...");
fs.writeFileSync('frontend/src/main.js', mainJs, 'utf8');
