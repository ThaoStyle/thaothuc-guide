const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// Replace map search placeholder
html = html.replace('placeholder="Tìm quán ăn, bún, phở..." id="map-search-input"', 'placeholder="Tìm quán ngon gần đây" id="map-search-input"');

// Replace Home titles
html = html.replace('Khám Phá Bản Đồ Ăn Ngay →', 'Khám Phá Quán Ngon Gần Bạn →');
html = html.replace('QUÁN NGON CẬP NHẬT', 'TOẠ ĐỘ MỚI NHẤT');
html = html.replace('MÓN MỚI LÊN SÓNG', 'CÔNG THỨC CHUẨN VỊ');
html = html.replace('🌐 MẠNG XÃ HỘI', 'KÊNH CỦA THAO THỨC');

// Replace Footer socials
html = html.replace(/<div class="h-social-grid">[\s\S]*?<\/div>/, `<div class="h-social-grid" style="display:flex; justify-content:center; gap:16px;">
        <a href="https://www.facebook.com/share/1BYD3k3Xk2/" target="_blank" class="social-icon" style="width:44px; height:44px; border-radius:50%; background:rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:center; color:var(--nv); border:1px solid rgba(15,23,42,0.1);">
          <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke-width:2.5; fill:none; stroke:currentColor;"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href="https://www.tiktok.com/@thaothucdian" target="_blank" class="social-icon" style="width:44px; height:44px; border-radius:50%; background:rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:center; color:var(--nv); border:1px solid rgba(15,23,42,0.1);">
          <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke-width:2.5; fill:none; stroke:currentColor;"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        </a>
        <a href="https://youtube.com/@thaothucdian" target="_blank" class="social-icon" style="width:44px; height:44px; border-radius:50%; background:rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:center; color:var(--nv); border:1px solid rgba(15,23,42,0.1);">
          <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke-width:2.5; fill:none; stroke:currentColor;"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon></svg>
        </a>
      </div>`);

// Replace Cook Banner text
html = html.replace(/<div class="cook-hero-sub">Cẩm nang nấu ăn chuẩn vị gia đình 🍲 Bí quyết đứng bếp mượt mà<\/div>/, `<div class="cook-desc" style="font-size: 13px; line-height: 1.5; opacity: 0.95; font-weight: 400;">
              Chia sẻ công thức và cách nấu 1001 món ăn đến từ niềm đam mê ẩm thực bất tận.<br>
              <span class="cook-desc-bold" style="font-weight: 700; font-size: 14px; margin-top: 8px; display: block; color: #ffedd5;">Giữ lửa gia đình từ căn bếp nhỏ.</span>
            </div>`);

// Replace Home fake search box
html = html.replace('<span>Tìm phở, bún chả, quán đêm...</span>', '<span>Tìm quán ăn ngon</span>');

// Replace main.js translation override
html = html.replace("'Tìm quán ăn, bún, phở...'", "'Tìm quán ngon gần đây'");
// Replace "MÓN MỚI LÊN SÓNG" in JS
html = html.replace(/'MÓN MỚI LÊN SÓNG'/g, "'CÔNG THỨC CHUẨN VỊ'");

// CSS for Heart/Filters/Dropdown
const newCSS = `
/* MAP SEARCH DROPDOWN NEW UI */
.sd-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: 0.2s; }
.sd-item:active { background: #f8fafc; }
.sd-item:last-child { border-bottom: none; }
.sd-icon { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--sl); flex-shrink:0; }
.sd-icon.history { color: #d97706; background: #fef3c7; }
.sd-icon svg { width: 16px; height: 16px; stroke-width: 2.5; }
.sd-text { font-size: 14px; font-weight: 600; color: var(--nv); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sd-sub { font-size: 11px; font-weight: 500; color: var(--sl); margin-top:2px; }

/* SHEET FILTERS (MAP) */
.sheet-filters { display: flex; gap: 8px; padding: 0 20px 16px 20px; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 10px; }
.s-filter-btn { padding: 8px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #f1f5f9; color: var(--sl); border: 1px solid transparent; display: flex; align-items: center; gap: 6px; white-space: nowrap; cursor: pointer; transition: 0.2s; }
.s-filter-btn svg { width: 14px; height: 14px; stroke-width: 2.5; }
.s-filter-btn.active { background: linear-gradient(135deg,#FF7043,#E64A19); color: white; box-shadow: 0 4px 12px rgba(255,112,67,0.3); }

/* HEART BUTTON (FAVORITE) */
.heart-btn { position: absolute; right: 12px; top: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; color: #94a3b8; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 10; }
.heart-btn:active { transform: scale(0.85); }
.heart-btn svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.5; transition: 0.2s; }
.heart-btn.liked { color: #ef4444; }
.heart-btn.liked svg { fill: currentColor; }
`;

if (!html.includes('.sd-item')) {
  html = html.replace('</style>', newCSS + '\n</style>');
}

const filterHTML = `
    <div class="sheet-filters">
      <div class="s-filter-btn" id="btn-near" onclick="toggleFilterMap('near', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        Gần tôi
      </div>
      <div class="s-filter-btn" id="btn-price" onclick="toggleFilterMap('price', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        Giá tiền
      </div>
      <div class="s-filter-btn" id="btn-fav" onclick="toggleFilterMap('fav', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Yêu thích
      </div>
    </div>`;

html = html.replace('<div class="sheet-content" id="mobile-list-content"></div>', filterHTML + '\n    <div class="sheet-content" id="mobile-list-content"></div>');

// Add Fav functions
const favFunctions = `
// --- FAVORITES LOGIC ---
function getFavs() {
  try { return JSON.parse(localStorage.getItem('tt_favs')) || []; } catch(e) { return []; }
}
function isFav(id) {
  return getFavs().includes(String(id));
}
function toggleFav(e, id) {
  if(e) e.stopPropagation();
  var favs = getFavs();
  id = String(id);
  if(favs.includes(id)) {
    favs = favs.filter(function(x) { return x !== id; });
  } else {
    favs.push(id);
  }
  localStorage.setItem('tt_favs', JSON.stringify(favs));
  
  var btns = document.querySelectorAll('.heart-btn[data-id="'+id+'"]');
  btns.forEach(function(btn) {
    if(favs.includes(id)) {
      btn.classList.add('liked');
      var card = btn.closest('.desktop-loc-card') || btn.closest('.home-featured-card');
      if(card) card.classList.add('is-liked');
    } else {
      btn.classList.remove('liked');
      var card = btn.closest('.desktop-loc-card') || btn.closest('.home-featured-card');
      if(card) {
        card.classList.remove('is-liked');
        var favFilter = document.getElementById('btn-fav');
        if(favFilter && favFilter.classList.contains('active') && card.classList.contains('desktop-loc-card')) {
          card.style.display = 'none';
        }
      }
    }
  });
}

function toggleFilterMap(type, btn) {
  btn.classList.toggle('active');
  if(type === 'fav') {
    var isFavActive = btn.classList.contains('active');
    var allItems = document.querySelectorAll('.desktop-loc-card');
    allItems.forEach(function(item) {
      if (isFavActive) {
        if (item.classList.contains('is-liked')) item.style.display = 'flex';
        else item.style.display = 'none';
      } else {
        item.style.display = 'flex';
      }
    });
  } else if(type === 'near') {
    if(typeof locateMe === 'function') locateMe();
  } else if(type === 'price') {
    // Basic price toggle visual only for now
  }
}
// -----------------------
`;

if (!html.includes('toggleFilterMap')) {
  html = html.replace(/var allLocs\s*=\s*\[\];/, favFunctions + '\nvar allLocs = [];');
}

// Modify renderHomeLatestCards to include heart button
const hfCardMatch = `'<div class="home-featured-card" onclick="openHomeCardLoc(\\''+latestLoc.id+'\\')">'
          + '<div class="hf-img-wrap"><img src="'+imgUrl+'" alt="Loc"/>'`;

const hfCardReplace = `'<div class="home-featured-card '+(isFav(latestLoc.id)?'is-liked':'')+'" onclick="openHomeCardLoc(\\''+latestLoc.id+'\\')">'
          + '<div class="hf-img-wrap">'
          + '<div class="heart-btn '+(isFav(latestLoc.id)?'liked':'')+'" data-id="'+latestLoc.id+'" onclick="toggleFav(event, \\''+latestLoc.id+'\\')"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>'
          + '<img src="'+imgUrl+'" alt="Loc"/>'`;

html = html.replace(hfCardMatch, hfCardReplace);

// Modify renderMobileList to include heart button using regex
const mRegex = /return '<div class="desktop-loc-card" style="position:relative;'\+bgStyle\+'" onclick="mobileListGoTo\('\+idx\+'\)">'[\s\S]*?\+ rankHtml[\s\S]*?\+ thumb/;

const mReplaceStr = `var likedClass = isFav(loc.id) ? 'is-liked' : '';
    var heartClass = isFav(loc.id) ? 'liked' : '';
    return '<div class="desktop-loc-card '+likedClass+'" style="position:relative;'+bgStyle+'" onclick="mobileListGoTo('+idx+')">'
      + rankHtml
      + '<div class="heart-btn '+heartClass+'" data-id="'+loc.id+'" onclick="toggleFav(event, \\''+loc.id+'\\')"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>'
      + thumb`;

if(mRegex.test(html)) {
  html = html.replace(mRegex, mReplaceStr);
}

// Modify search functions
const searchFunctions = `
function getSearchHistory() {
  try { return JSON.parse(localStorage.getItem('tt_search_history')) || []; } catch(e) { return []; }
}
function addSearchHistory(term) {
  if(!term) return;
  var h = getSearchHistory();
  h = h.filter(function(x) { return x !== term; });
  h.unshift(term);
  if(h.length > 5) h = h.slice(0,5);
  localStorage.setItem('tt_search_history', JSON.stringify(h));
}

function handleMapSearchFocus() {
  var cap = document.getElementById('map-header');
  if(cap) cap.classList.add('focused');
  handleMapSearch();
}

function handleMapSearchBlur() {
  var cap = document.getElementById('map-header');
  if(cap) cap.classList.remove('focused');
  setTimeout(function() {
    var dd = document.getElementById('map-search-dropdown');
    if(dd) dd.classList.remove('show');
  }, 500); // delay
}

function handleMapSearch() {
  var input = document.getElementById('map-search-input');
  var dd = document.getElementById('map-search-dropdown');
  var resDiv = document.getElementById('map-search-results');
  if(!input || !dd || !resDiv) return;
  var clearBtn = document.getElementById('sc-clear-btn');
  if(clearBtn) clearBtn.style.display = input.value ? 'flex' : 'none';

  var q = input.value.trim().toLowerCase();
  dd.classList.add('show');
  resDiv.innerHTML = '';

  const svgHistory = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
  const svgSuggest = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

  if(!q) {
    var hist = getSearchHistory();
    if(hist.length === 0) {
      resDiv.innerHTML = '<div class="sc-empty" style="padding: 16px; color: var(--sl); font-size: 13px; text-align: center;">Nhập tên quán hoặc món ăn...</div>';
    } else {
      hist.forEach(function(term) {
        var item = document.createElement('div');
        item.className = 'sd-item';
        item.innerHTML = '<div class="sd-icon history">' + svgHistory + '</div><div class="sd-text">' + term + '<div class="sd-sub">Lịch sử tìm kiếm</div></div>';
        item.onclick = function() {
          input.value = term;
          handleMapSearch();
        };
        resDiv.appendChild(item);
      });
    }
    return;
  }

  var results = allLocs.filter(function(loc) {
    var nameMatch = (loc.name || '').toLowerCase().indexOf(q) !== -1;
    var catMatch = (loc.category || '').toLowerCase().indexOf(q) !== -1;
    var mustMatch = (loc.must_try || '').toLowerCase().indexOf(q) !== -1;
    var descMatch = (loc.description || '').toLowerCase().indexOf(q) !== -1;
    return nameMatch || catMatch || mustMatch || descMatch;
  });

  if(results.length === 0) {
    resDiv.innerHTML = '<div class="sc-empty" style="padding: 16px; color: var(--sl); font-size: 13px; text-align: center;">Không tìm thấy quán nào phù hợp.</div>';
  } else {
    results.forEach(function(loc) {
      var item = document.createElement('div');
      item.className = 'sd-item';
      item.innerHTML = '<div class="sd-icon">' + svgSuggest + '</div><div class="sd-text">' + (loc.name||'') + '<div class="sd-sub">Gợi ý từ khoá</div></div>';
      item.onclick = function() {
        addSearchHistory(loc.name);
        if(map && loc.lat && loc.lng) {
          map.flyTo([loc.lat, loc.lng], 16, {animate: true, duration: 1.5});
          setTimeout(function(){ openSheet(loc); }, 1500);
        }
        dd.classList.remove('show');
      };
      resDiv.appendChild(item);
    });
  }
}
`;

const sRegex = /function handleMapSearchFocus\(\)[\s\S]*?dd\.classList\.add\('show'\);\s*\}/;
if(sRegex.test(html)) {
  html = html.replace(sRegex, searchFunctions);
}

fs.writeFileSync('Index.html', html, 'utf8');
console.log('Root Index.html fully updated');
