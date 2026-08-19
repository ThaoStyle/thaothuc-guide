const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');
js = js.replace(/function\(res\)\{\s*alert\('✔ Đã thêm địa điểm mới vào Google Sheet! \(Tọa độ tự động định vị từ link Google Maps\)'\);\s*closeModal\('m-admin'\);\s*loadData\(\);\s*\}\)\s*\.withFailureHandler\(function\(e\)\{alert\('Lỗi: '\+e\.message\);\}\)\s*\.addLocation\(row\);\s*\}else\{[\s\S]*?alert\('✔ Đã thêm \(local test\)'\);\s*\}\s*\}/, '');
fs.writeFileSync('src/main.js', js, 'utf8');
