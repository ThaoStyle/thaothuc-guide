const fs = require('fs');
let code = fs.readFileSync('Code.gs', 'utf8');
code = code.replace("if (!sheet) return [];", "if (!sheet) return [{id: 'err', name: 'Lỗi: Không tìm thấy sheet', lat: 16, lng: 108}];");
code = code.replace("if (data.length <= 1) return [];", "if (data.length <= 1) return [{id: 'err', name: 'Lỗi: Sheet trống (chỉ có header)', lat: 16, lng: 108}];");
fs.writeFileSync('Code.gs', code, 'utf8');
console.log('Patched empty sheet returns!');
