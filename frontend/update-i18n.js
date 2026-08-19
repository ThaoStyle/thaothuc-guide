const fs = require('fs');

// 1. UPDATE index.html
let html = fs.readFileSync('index.html', 'utf8');

// Find the Chờ duyệt section and inject IDs
const oldCritT = '<div class="crit-h3" style="font-weight:700; margin-bottom:4px; font-size:15px; color:#1e293b;">Chờ duyệt</div>';
const newCritT = '<div class="crit-h3" id="t-s0t" style="font-weight:700; margin-bottom:4px; font-size:15px; color:#1e293b;">Chờ duyệt</div>';

const oldCritD = '<div class="crit-desc" style="font-size:13px; color:#475569; line-height:1.5;">Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.</div>';
const newCritD = '<div class="crit-desc" id="t-s0d" style="font-size:13px; color:#475569; line-height:1.5;">Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.</div>';

html = html.replace(oldCritT, newCritT);
html = html.replace(oldCritD, newCritD);

// Some Vietnamese encodings might get messed up by regex if not careful, but exact match for known string is safer. 
// However, reading UTF-8 in powershell may fail exact matching. Let's use flexible regex.
const critTRegex = /<div class="crit-h3"([^>]*)>Chờ duyệt<\/div>/i;
const critDRegex = /<div class="crit-desc"([^>]*)>Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định\.<\/div>/i;

html = html.replace(critTRegex, '<div class="crit-h3" id="t-s0t"$1>Chờ duyệt</div>');
html = html.replace(critDRegex, '<div class="crit-desc" id="t-s0d"$1>Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.</div>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated');

// 2. UPDATE main.js
let main = fs.readFileSync('src/main.js', 'utf8');

// Replace TR definition
const trRegex = /var TR=\{[\s\S]*?en:\{[^}]*l:'VI'[\s\S]*?\}\s*\};/;

const newTr = `var TR={
  vi:{l:'EN',cr:'Tiêu chí',sg:'Gợi ý',
    all:'🍽️ Tất cả',ld:'Đang tải bản đồ...',
    ckT:'🍳 Công Thức Nấu Ăn — Chồng Cook Vợ Look',ckS:'Món ngon chuẩn vị từ bếp nhà Chồng Cook Vợ Look 👨‍🍳',
    mcH:'Tiêu Chí Đánh Giá',mcP:'Tiêu chí đánh giá riêng của Thao Thức Guide',
    s3t:'Thao Thức Heritage',s3d:'Quán quen lâu đời, mang tính di sản và được dân bản địa yêu thích.',
    s2t:'Thao Thức Approved',s2d:'Món ngon chuẩn vị, trải nghiệm trọn vẹn, thử 1 lần là DÍNH.',
    s1t:'Thao Thức Spot',s1d:'Địa điểm ăn uống xung quanh bạn, được cộng đồng đánh giá tốt.',
    s0t:'Chờ duyệt',s0d:'Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.',
    mcok:'✓ Đã hiểu',
    msH:'Gợi Ý Địa Điểm',msP:'Bạn biết quán ngon? Chia sẻ với Thao Thức Guide nhé!',
    gps:'📍 Lấy vị trí GPS của tôi',send:'🚀 Gửi gợi ý tới Thao Thức Guide',
    navd: UI_ICONS.pin+'Chỉ đường',navv: UI_ICONS.play+'Review',must: UI_ICONS.star+'Món Phải Thử',
    bMap:'Bản Đồ',bCook:'Nấu Ăn',
    nameReq:'Vui lòng nhập tên địa điểm',sent:'✅ Đã gửi gợi ý tới Thao Thức Guide! Cảm ơn bạn 💖',
    locErr:'Không lấy được vị trí. Hãy cho phép truy cập vị trí.',
    ios:'🍎 Trên iPhone: nhấn Share (⬆) → "Thêm vào Màn hình chính"'},
  en:{l:'VI',cr:'Criteria',sg:'Suggest',
    all:'🍽️ All',ld:'Loading map...',
    ckT:'Recipes — Chồng Cook Vợ Look',ckS:"Delicious dishes from Chồng Cook Vợ Look's kitchen 👨‍🍳",
    mcH:'Rating Criteria',mcP:'How Thao Thức Guide selects locations',
    s3t:'Thao Thức Heritage',s3d:'Historic local favorites, deeply rooted in the community’s heritage.',
    s2t:'Thao Thức Approved',s2d:'Authentic flavors and complete experiences. One try and you are hooked!',
    s1t:'Thao Thức Spot',s1d:'Great local dining spots nearby, highly rated by the community.',
    s0t:'Pending Review',s0d:'Places currently on the waitlist for our upcoming evaluations.',
    mcok:'✓ Got it',
    msH:'Suggest a Place',msP:'Know a great spot? Share with Thao Thức Guide!',
    gps:'📍 Use my GPS location',send:'🚀 Send Suggestion',
    navd: UI_ICONS.pin+'Directions',navv: UI_ICONS.play+'Review',must: UI_ICONS.star+'Must Try',
    bMap:'Map',bCook:'Recipes',
    nameReq:'Please enter a place name',sent:'✅ Suggestion sent! Thank you 💖',
    locErr:'Could not get location. Please allow location access.',
    ios:'🍎 On iPhone: tap Share (⬆) → "Add to Home Screen"'}
};`;

if (trRegex.test(main)) {
  main = main.replace(trRegex, newTr);
  console.log('TR object updated');
} else {
  console.log('TR object not found');
}

// Add setText for s0t and s0d
const applyLangRegex = /setText\('t-s1t', x\.s1t\);\s*setText\('t-s1d', x\.s1d\);/;
if (applyLangRegex.test(main)) {
  main = main.replace(applyLangRegex, `setText('t-s1t', x.s1t);\n    setText('t-s1d', x.s1d);\n    setText('t-s0t', x.s0t);\n    setText('t-s0d', x.s0d);`);
  console.log('applyLang updated');
} else {
  console.log('applyLang not found');
}

fs.writeFileSync('src/main.js', main, 'utf8');

