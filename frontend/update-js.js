const fs = require('fs');
let main = fs.readFileSync('src/main.js', 'utf8');

const locLines = [
  '<div class="hf-body">',
  '<div class="hf-title">"+latestLoc.name+"</div>',
  '<div class="hf-sub">"+badgeStat+" • "+(latestLoc.category||"Khác")+"</div>',
  '<div class="hf-desc">Must try: "+(latestLoc.must_try||"")+"<br>"+(latestLoc.price_range||"")+"</div>',
  '<button class="hf-btn">Khám phá ngay &rarr;</button>',
  '</div></div>'
];
// Instead of full string matching, we can match the start and end of the block
// Actually, I can just use a regex that matches EVERYTHING between `<div class="hf-body">` and `'</div></div>';`

const locRegex = /'\+ '<div class="hf-body">'(?:\s*\+\s*'[^']*'|\s*\+\s*[a-zA-Z0-9_.()|"'+\s\u00C0-\u1EF9]+)*\+\s*'<button class="hf-btn">Khám phá ngay &rarr;<\/button>'\s*\+\s*'<\/div><\/div>';/;
const recRegex = /'\+ '<div class="hf-body">'(?:\s*\+\s*'[^']*'|\s*\+\s*[a-zA-Z0-9_.()|"'+\s\u00C0-\u1EF9]+)*\+\s*'<button class="hf-btn">Xem công thức 🍳<\/button>'\s*\+\s*'<\/div><\/div>';/;

const newLocCard = `'+ '<div class="hf-body">'
          + '<div class="hf-title">'+latestLoc.name+'</div>'
          + '<div class="hf-rating-row">'+badgeStat+'</div>'
          + '<div class="hf-tags-row"><div class="hf-pill">🍲 '+(latestLoc.category||'Khác')+'</div>' + (latestLoc.price_range ? '<div class="hf-pill hf-pill-price">💰 ' + latestLoc.price_range + '</div>' : '') + '</div>'
          + (latestLoc.must_try ? '<div class="hf-must-try"><div class="hf-must-try-icon">✨</div><div class="hf-must-try-text"><span>Must try:</span> ' + latestLoc.must_try + '</div></div>' : '<div style="flex:1"></div>')
          + '<button class="hf-btn">Khám phá ngay &rarr;</button>'
          + '</div></div>';`;

const newRecCard = `'+ '<div class="hf-body">'
          + '<div class="hf-title">'+latestRcp.name+'</div>'
          + '<div class="hf-tags-row">'
          + '<div class="hf-pill">⏱️ '+latestRcp.time+'</div>'
          + '<div class="hf-pill">👩‍🍳 '+serving+'</div>'
          + '<div class="hf-pill hf-pill-price">🌶️ '+latestRcp.level+'</div>'
          + '</div>'
          + '<div class="hf-must-try" style="background:#f1f5f9;border-color:#e2e8f0;"><div class="hf-must-try-icon">💡</div><div class="hf-must-try-text" style="color:#475569;">'+(latestRcp.category||'Cẩm nang nấu ăn chuẩn vị gia đình')+'</div></div>'
          + '<button class="hf-btn">Xem công thức 🍳</button>'
          + '</div></div>';`;

// Quick replace using substring index
const locStart = main.indexOf(`+ '<div class="hf-body">'\n          + '<div class="hf-title">'+latestLoc.name+'</div>'`);
const locEnd = main.indexOf(`+ '<button class="hf-btn">Khám phá ngay &rarr;</button>'\n          + '</div></div>';`, locStart) + (`+ '<button class="hf-btn">Khám phá ngay &rarr;</button>'\n          + '</div></div>';`).length;

if (locStart !== -1 && locEnd !== -1) {
  main = main.substring(0, locStart - 2) + newLocCard + main.substring(locEnd);
  console.log('Fixed loc card');
} else {
  console.log('Loc card bounds not found');
}

const recStart = main.indexOf(`+ '<div class="hf-body">'\n          + '<div class="hf-title">'+latestRcp.name+'</div>'`);
const recEnd = main.indexOf(`+ '<button class="hf-btn">Xem công thức 🍳</button>'\n          + '</div></div>';`, recStart) + (`+ '<button class="hf-btn">Xem công thức 🍳</button>'\n          + '</div></div>';`).length;

if (recStart !== -1 && recEnd !== -1) {
  main = main.substring(0, recStart - 2) + newRecCard + main.substring(recEnd);
  console.log('Fixed rec card');
} else {
  console.log('Rec card bounds not found');
}

fs.writeFileSync('src/main.js', main);
