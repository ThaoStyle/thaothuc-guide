const fs = require('fs');
let main = fs.readFileSync('src/main.js', 'utf8');

const newLocCard = `+ '<div class="hf-body">'
          + '<div class="hf-title">'+latestLoc.name+'</div>'
          + '<div class="hf-rating-row">'+badgeStat+'</div>'
          + '<div class="hf-tags-row"><div class="hf-pill">🍲 '+(latestLoc.category||'Khác')+'</div>' + (latestLoc.price_range ? '<div class="hf-pill hf-pill-price">💰 ' + latestLoc.price_range + '</div>' : '') + '</div>'
          + (latestLoc.must_try ? '<div class="hf-must-try"><div class="hf-must-try-icon">✨</div><div class="hf-must-try-text"><span>Must try:</span> ' + latestLoc.must_try + '</div></div>' : '<div style="flex:1"></div>')
          + '<button class="hf-btn">Khám phá ngay &rarr;</button>'
          + '</div></div>';`;

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

const locStart = main.indexOf(`+ '<div class="hf-body">'`);
const locEnd = main.indexOf(`'</div></div>';`, locStart) + `'</div></div>';`.length;

if (locStart !== -1 && locEnd !== -1) {
  main = main.substring(0, locStart - 2) + newLocCard + main.substring(locEnd);
  console.log('Fixed loc card');
} else {
  console.log('Loc bounds not found');
}

// Find second instance for recipe
const recStart = main.indexOf(`+ '<div class="hf-body">'`, locStart + newLocCard.length);
const recEnd = main.indexOf(`'</div></div>';`, recStart) + `'</div></div>';`.length;

if (recStart !== -1 && recEnd !== -1) {
  main = main.substring(0, recStart - 2) + newRecCard + main.substring(recEnd);
  console.log('Fixed rec card');
} else {
  console.log('Rec bounds not found');
}

fs.writeFileSync('src/main.js', main);
