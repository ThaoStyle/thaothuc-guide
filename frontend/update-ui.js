const fs = require('fs');

// 1. UPDATE CSS
let css = fs.readFileSync('src/style.css', 'utf8');

const cssToRemoveRegex = /\.hf-body\{[\s\S]*?\.hf-btn:active\{[^}]*\}/;

const newCss = `.hf-body{padding:16px 18px 18px 18px;display:flex;flex-direction:column;flex:1;gap:8px;}
.hf-title{font-size:18px;font-weight:800;color:var(--nv);line-height:1.3;margin-bottom:2px;font-family:Inter,sans-serif;}
.hf-rating-row{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--or);}
.hf-rating-row svg{width:16px;height:16px;color:var(--or);fill:currentColor;}
.hf-tags-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;}
.hf-pill{background:#F1F5F9;color:#475569;font-size:11px;font-weight:600;padding:4px 10px;border-radius:8px;display:flex;align-items:center;gap:4px;}
.hf-pill-price{background:#ecfdf5;color:#059669;}
.hf-must-try{display:flex;align-items:flex-start;gap:6px;font-size:13px;font-weight:600;color:var(--nv);margin-bottom:8px;background:#fff7ed;padding:8px 12px;border-radius:12px;border:1px solid #ffedd5;flex:1;}
.hf-must-try-icon{font-size:14px;line-height:1;}
.hf-must-try-text{line-height:1.3;color:#9a3412;}
.hf-must-try-text span{font-weight:400;color:#ea580c;}
.hf-btn{background:linear-gradient(135deg,rgba(255,112,67,.15),rgba(230,74,25,.1));color:#FF7043;border-radius:14px;padding:10px;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;border:none;width:100%;transition:all .2s;margin-top:auto;}
.hf-btn:active{background:#FF7043;color:white;}`;

if (cssToRemoveRegex.test(css)) {
  css = css.replace(cssToRemoveRegex, newCss);
  fs.writeFileSync('src/style.css', css);
  console.log('Updated style.css successfully.');
} else {
  console.error('Could not find original hf- CSS block.');
}

// 2. UPDATE MAIN.JS
let main = fs.readFileSync('src/main.js', 'utf8');

// Replace location card rendering
const locRegex = /\+\s*'<div class="hf-body">'\s*\+\s*'<div class="hf-title">\+latestLoc\.name\+'<\/div>'\s*\+\s*'<div class="hf-sub">\+badgeStat\+' \u2022 '\+\(latestLoc\.category\|\|'Kh\u00E1c'\)\+'<\/div>'\s*\+\s*'<div class="hf-desc">Must try: '\+\(latestLoc\.must_try\|\|''\)\+'<br>'\+\(latestLoc\.price_range\|\|''\)\+'<\/div>'\s*\+\s*'<button class="hf-btn">Kh\u00E1m ph\u00E1 ngay &rarr;<\/button>'\s*\+\s*'<\/div><\/div>';/;

const newLocCard = `+ '<div class="hf-body">'
          + '<div class="hf-title">'+latestLoc.name+'</div>'
          + '<div class="hf-rating-row">'+badgeStat+'</div>'
          + '<div class="hf-tags-row"><div class="hf-pill">🍲 '+(latestLoc.category||'Khác')+'</div>' + (latestLoc.price_range ? '<div class="hf-pill hf-pill-price">💰 ' + latestLoc.price_range + '</div>' : '') + '</div>'
          + (latestLoc.must_try ? '<div class="hf-must-try"><div class="hf-must-try-icon">✨</div><div class="hf-must-try-text"><span>Must try:</span> ' + latestLoc.must_try + '</div></div>' : '<div style="flex:1"></div>')
          + '<button class="hf-btn">Khám phá ngay &rarr;</button>'
          + '</div></div>';`;

if (locRegex.test(main)) {
  main = main.replace(locRegex, newLocCard);
  console.log('Updated loc card logic.');
} else {
  console.error('Could not find loc card logic.');
}

// Replace recipe card rendering
const recRegex = /\+\s*'<div class="hf-body">'\s*\+\s*'<div class="hf-title">\+latestRcp\.name\+'<\/div>'\s*\+\s*'<div class="hf-sub">\u23F1\uFE0F '\+latestRcp\.time\+' \u2022 \uD83D\uDC69\u200D\uD83C\uDF73  '\+serving\+' \u2022 \uD83C\uDF36\uFE0F '\+latestRcp\.level\+'<\/div>'\s*\+\s*'<div class="hf-desc">'\+\(latestRcp\.category\|\|'C\u1EA9m nang n\u1EA5u \u0103n chu\u1EA9n v\u1ECB gia \u0111\u00ECnh'\)\+'<\/div>'\s*\+\s*'<button class="hf-btn">Xem c\u00F4ng th\u1EE9c \uD83C\uDF73<\/button>'\s*\+\s*'<\/div><\/div>';/;

const newRecCard = `+ '<div class="hf-body">'
          + '<div class="hf-title">'+latestRcp.name+'</div>'
          + '<div class="hf-tags-row">'
          + '<div class="hf-pill">⏱️ '+latestRcp.time+'</div>'
          + '<div class="hf-pill">👩‍🍳 '+serving+'</div>'
          + '<div class="hf-pill hf-pill-price">🌶️ '+latestRcp.level+'</div>'
          + '</div>'
          + '<div class="hf-must-try" style="background:#f1f5f9;border-color:#e2e8f0;"><div class="hf-must-try-icon">💡</div><div class="hf-must-try-text" style="color:#475569;">'+(latestRcp.category||'Cẩm nang nấu ăn chuẩn vị gia đình')+'</div></div>'
          + '<button class="hf-btn">Xem công thức 🍳</button>'
          + '</div></div>';`;

if (recRegex.test(main)) {
  main = main.replace(recRegex, newRecCard);
  console.log('Updated recipe card logic.');
} else {
  console.error('Could not find recipe card logic.');
}

fs.writeFileSync('src/main.js', main);
