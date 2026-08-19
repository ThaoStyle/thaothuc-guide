const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace Home fake search box
html = html.replace('<span>Tìm phở, bún chả, quán đêm...</span>', '<span>Tìm quán ăn ngon</span>');

fs.writeFileSync('index.html', html, 'utf8');

let jsContent = fs.readFileSync('src/main.js', 'utf8');
// Replace main.js translation override
jsContent = jsContent.replace("'Tìm quán ăn, bún, phở...'", "'Tìm quán ngon gần đây'");
// Replace "MÓN MỚI LÊN SÓNG" in main.js to "CÔNG THỨC CHUẨN VỊ"
jsContent = jsContent.replace("'MÓN MỚI LÊN SÓNG'", "'CÔNG THỨC CHUẨN VỊ'");

fs.writeFileSync('src/main.js', jsContent, 'utf8');
console.log('index.html and main.js updated');
