const fs = require('fs');

function applyFix(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');

    // 1. switchNav: Force hide dropdown
    if (!code.includes("if(tab !== 'map'){ var dd = document.getElementById('map-search-dropdown'); if(dd) dd.classList.remove('show'); }")) {
        code = code.replace("function switchNav(tab, skipAutoFly){", "function switchNav(tab, skipAutoFly){\n  if(tab !== 'map'){ var dd = document.getElementById('map-search-dropdown'); if(dd) dd.classList.remove('show'); }");
    }

    // 2. handleMapSearchBlur: Remove the 500ms timeout hack
    const oldBlur = `function handleMapSearchBlur() {
    var cap = document.getElementById('map-header');
    if(cap) cap.classList.remove('focused');
    setTimeout(function() {
      var dd = document.getElementById('map-search-dropdown');
      if(dd) dd.classList.remove('show');
    }, 500); // delay
  }`;
    const newBlur = `function handleMapSearchBlur() {
    var cap = document.getElementById('map-header');
    if(cap) cap.classList.remove('focused');
    // Global click listener will handle dropdown closing
  }`;
    // Replace by matching generic whitespace just in case
    code = code.replace(/function handleMapSearchBlur\(\)\s*\{\s*var cap = document\.getElementById\('map-header'\);\s*if\(cap\) cap\.classList\.remove\('focused'\);\s*setTimeout\(function\(\)\s*\{\s*var dd = document\.getElementById\('map-search-dropdown'\);\s*if\(dd\) dd\.classList\.remove\('show'\);\s*\}, 500\);\s*\}/m, newBlur);

    // 3. handleMapSearch: Close dropdown when clicking a history item
    const historyClick = `el.onclick = function() {
            input.value = term;
            handleMapSearch();
          };`;
    const newHistoryClick = `el.onclick = function() {
            input.value = term;
            handleMapSearch();
            dd.classList.remove('show');
          };`;
    code = code.replace(historyClick, newHistoryClick);

    // 4. handleMapSearch: Close dropdown when clicking a search result (suggestion)
    const resultClick = `el.onclick = function() {
          openHomeCardLoc(l.id);
        };`;
    const newResultClick = `el.onclick = function() {
          openHomeCardLoc(l.id);
          dd.classList.remove('show');
        };`;
    // Might appear multiple times (for exact matches, fuzzy matches), so global replace
    code = code.split(resultClick).join(newResultClick);

    // 5. Global click listener to close dropdown
    const globalListener = `
// Global click listener to close map search dropdown
document.addEventListener('click', function(e) {
  var dd = document.getElementById('map-search-dropdown');
  var cap = document.getElementById('map-header');
  if (dd && dd.classList.contains('show')) {
    if (!dd.contains(e.target) && (!cap || !cap.contains(e.target))) {
      dd.classList.remove('show');
    }
  }
});
`;
    if (!code.includes("Global click listener to close map search dropdown")) {
        code = code.replace("window.toggleFilterMap = toggleFilterMap;", globalListener + "\nwindow.toggleFilterMap = toggleFilterMap;");
    }

    fs.writeFileSync(filePath, code, 'utf8');
}

applyFix('frontend/src/main.js');
applyFix('Index.html');
console.log("Fixes applied successfully to main.js and Index.html");
