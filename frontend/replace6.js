const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');

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

const regex = /function handleMapSearchFocus\(\)[\s\S]*?dd\.classList\.add\('show'\);\s*\}/;
if(regex.test(js)) {
  js = js.replace(regex, searchFunctions);
  fs.writeFileSync('src/main.js', js, 'utf8');
  console.log('Search functions replaced!');
} else {
  console.log('Search functions match string not found.');
}
