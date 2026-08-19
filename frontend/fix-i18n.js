const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find the Chờ duyệt section and inject IDs properly
const oldCritT = '<div class="crit-h3" style="font-weight:700; margin-bottom:4px; font-size:15px; color:#1e293b;">Chờ duyệt</div>';
const newCritT = '<div class="crit-h3" id="t-s0t" style="font-weight:700; margin-bottom:4px; font-size:15px; color:#1e293b;">Chờ duyệt</div>';

const oldCritD = '<div class="crit-desc" style="font-size:13px; color:#475569; line-height:1.5;">Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.</div>';
const newCritD = '<div class="crit-desc" id="t-s0d" style="font-size:13px; color:#475569; line-height:1.5;">Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.</div>';

html = html.replace(oldCritT, newCritT);
html = html.replace(oldCritD, newCritD);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html safely updated with Node.js');
