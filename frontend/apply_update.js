const fs = require('fs');

// STEP 1: index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  '<div class="sh-badge-overlay" id="sh-badge-overlay"></div>',
  '<div class="sh-badge-overlay" id="sh-badge-overlay" onclick="openModal(\'m-crit\')" style="cursor:pointer;" title="Xem tiêu chí đánh giá"></div>'
);
html = html.replace(
  '<h2 class="sh-title" id="sh-title">Tên Quán <span class="sh-badge-inline" id="sh-badge-inline"></span></h2>',
  '<h2 class="sh-title" id="sh-title">Tên Quán <span class="sh-badge-inline" id="sh-badge-inline" onclick="openModal(\'m-crit\')" style="cursor:pointer;" title="Xem tiêu chí đánh giá"></span></h2>'
);
const htmlTarget1 = '<input type="text" class="sc-input" placeholder="T\u00ecm qu\u00e1n \u0103n, b\u00fan, ph\u1edf..." id="map-search-input" autocomplete="off" oninput="handleMapSearch()" onfocus="handleMapSearchFocus()" onblur="handleMapSearchBlur()" />\r\n      <div class="sc-divider"></div>';
const htmlTarget1_unix = htmlTarget1.replace(/\r\n/g, '\n');
const htmlReplace1 = '<input type="text" class="sc-input" placeholder="T\u00ecm qu\u00e1n \u0103n, b\u00fan, ph\u1edf..." id="map-search-input" autocomplete="off" oninput="handleMapSearch()" onfocus="handleMapSearchFocus()" onblur="handleMapSearchBlur()" />\n      <button class="sc-clear-btn" id="sc-clear-btn" onclick="clearMapSearch()" style="display:none;" title="Xoá" type="button">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\n      </button>\n      <div class="sc-divider"></div>';
html = html.replace(htmlTarget1, htmlReplace1).replace(htmlTarget1_unix, htmlReplace1);
fs.writeFileSync('index.html', html, 'utf8');

// STEP 2: style.css
let css = fs.readFileSync('src/style.css', 'utf8');
const cssTarget = '.sc-input::placeholder { color: #94A3B8; font-weight: 400; }\r\n  .sc-divider { width: 1px; height: 18px; background: rgba(148, 163, 184, 0.3); margin: 0 10px; }';
const cssTarget_unix = cssTarget.replace(/\r\n/g, '\n');
const cssReplace = '.sc-input::placeholder { color: #94A3B8; font-weight: 400; }\n  .sc-clear-btn { width: 22px; height: 22px; border-radius: 50%; border: none; background: rgba(148,163,184,0.25); color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; flex-shrink: 0; }\n  .sc-clear-btn svg { width: 13px; height: 13px; stroke: currentColor; }\n  .sc-clear-btn:active { transform: scale(0.9); background: rgba(148,163,184,0.4); }\n  .sc-divider { width: 1px; height: 18px; background: rgba(148, 163, 184, 0.3); margin: 0 10px; }';
css = css.replace(cssTarget, cssReplace).replace(cssTarget_unix, cssReplace);
fs.writeFileSync('src/style.css', css, 'utf8');

// STEP 3: main.js
let main = fs.readFileSync('src/main.js', 'utf8');

const mainTarget1 = 'function handleMapSearch() {\r\n  var input = document.getElementById(\'map-search-input\');\r\n  var dd = document.getElementById(\'map-search-dropdown\');\r\n  var resDiv = document.getElementById(\'map-search-results\');\r\n  if(!input || !dd || !resDiv) return;\r\n\r\n  var q = input.value.trim().toLowerCase();';
const mainTarget1_unix = mainTarget1.replace(/\r\n/g, '\n');
const mainReplace1 = 'function handleMapSearch() {\n  var input = document.getElementById(\'map-search-input\');\n  var dd = document.getElementById(\'map-search-dropdown\');\n  var resDiv = document.getElementById(\'map-search-results\');\n  if(!input || !dd || !resDiv) return;\n  var clearBtn = document.getElementById(\'sc-clear-btn\');\n  if(clearBtn) clearBtn.style.display = input.value ? \'flex\' : \'none\';\n\n  var q = input.value.trim().toLowerCase();';
main = main.replace(mainTarget1, mainReplace1).replace(mainTarget1_unix, mainReplace1);

const mainTarget2 = 'function openHomeCardLoc(locId) {';
const mainReplace2 = 'function clearMapSearch(){\n  var input = document.getElementById(\'map-search-input\');\n  var dd = document.getElementById(\'map-search-dropdown\');\n  var clearBtn = document.getElementById(\'sc-clear-btn\');\n  if(input) { input.value = \'\'; input.focus(); }\n  if(dd) dd.classList.remove(\'show\');\n  if(clearBtn) clearBtn.style.display = \'none\';\n  // Also trigger handleMapSearch to reset map view\n  handleMapSearch();\n}\n\nfunction openHomeCardLoc(locId) {';
main = main.replace(mainTarget2, mainReplace2);

const mainTarget3 = 'window.clearImageSelect = clearImageSelect;\r\nwindow.closeMobileList = closeMobileList;';
const mainTarget3_unix = mainTarget3.replace(/\r\n/g, '\n');
const mainReplace3 = 'window.clearImageSelect = clearImageSelect;\nwindow.clearMapSearch = clearMapSearch;\nwindow.closeMobileList = closeMobileList;';
main = main.replace(mainTarget3, mainReplace3).replace(mainTarget3_unix, mainReplace3);

fs.writeFileSync('src/main.js', main, 'utf8');

console.log('Update applied successfully!');
