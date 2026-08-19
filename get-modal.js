const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const start = html.indexOf('<div class="modal-backdrop" id="m-recipe-detail"');
const end = html.indexOf('<!-- ── MODAL ADMIN', start);
console.log(html.substring(start, end));
