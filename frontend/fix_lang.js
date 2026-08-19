const fs = require('fs');

let main = fs.readFileSync('src/main.js', 'utf8');

const regex = /function applyLang\(\)\s*\{[\s\S]*?document\.getElementById\('t-bnav-cook'\)\.textContent=x\.bCook;\r?\n\s*\}/;

const replacement = `function applyLang(){
  var x=TR[lang];
  
  // Hàm an toàn: Kiểm tra thẻ tồn tại mới gán giá trị
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text !== undefined) {
      // Dùng innerHTML thay cho textContent để hiển thị được icon SVG
      el.innerHTML = text; 
    }
  }

  setText('lang-btn', x.l);
  setText('t-loading', x.ld);
  setText('t-ck-t', x.ckT);
  setText('t-ck-s', x.ckS);
  setText('t-mc-h2', x.mcH);
  setText('t-mc-p', x.mcP);
  setText('t-s3t', x.s3t);
  setText('t-s3d', x.s3d);
  setText('t-s2t', x.s2t);
  setText('t-s2d', x.s2d);
  setText('t-s1t', x.s1t);
  setText('t-s1d', x.s1d);
  setText('t-mc-ok', x.mcok);
  setText('t-ms-h2', x.msH);
  setText('t-ms-p', x.msP);
  setText('t-ms-gps', x.gps);
  setText('t-ms-send', x.send);
  setText('t-sh-must', x.must);
  setText('t-sh-dir', x.navd);
  setText('t-sh-vid', x.navv);
  setText('t-bnav-map', x.bMap);
  setText('t-bnav-cook', x.bCook);

  // Update tooltip title cho 2 nút action
  var critBtn = document.querySelector('button[onclick="openModal(\\'m-crit\\')"]');
  if (critBtn && x.cr) critBtn.title = x.cr;
  var sugBtn = document.querySelector('button[onclick="openModal(\\'m-sug\\')"]');
  if (sugBtn && x.sg) sugBtn.title = x.sg;

  // Dịch thanh tìm kiếm
  var searchInput = document.getElementById('map-search-input');
  if (searchInput) {
    searchInput.placeholder = (lang === 'en') ? 'Search places, food...' : 'Tìm quán ăn, bún, phở...';
  }
}`;

if (regex.test(main)) {
  main = main.replace(regex, replacement);
  fs.writeFileSync('src/main.js', main);
  console.log('Fixed applyLang()');
} else {
  console.error('Could not find applyLang() in main.js');
}
