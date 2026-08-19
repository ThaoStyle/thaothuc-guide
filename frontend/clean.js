const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');

// 4a
let start = js.indexOf('// ── DEDICATED ADMIN TAB CONTROLLER');
let endStr = "alert('✔ Đã thêm (local test)');\r\n    }\r\n  }\r\n}";
let end = js.indexOf(endStr, start);
if(end === -1) end = js.indexOf("alert('✔ Đã thêm (local test)');\n    }\n  }\n}", start);
if(end !== -1) {
    js = js.substring(0, start) + js.substring(end + endStr.length);
} else {
    // try shorter
    let endStr2 = "alert('✔ Đã thêm (local test)');\r\n  }\r\n}";
    let end2 = js.indexOf(endStr2, start);
    if(end2 !== -1) {
        js = js.substring(0, start) + js.substring(end2 + endStr2.length);
    }
}

// 4b
js = js.replace(/checkAdminAuth\(\);\r?\n/, '');

// 4c
let s4c = "if(document.getElementById('page-admin').classList.contains('show')){\r\n    renderAdminLocList();\r\n  }";
if(js.includes(s4c)) js = js.replace(s4c, '');
else js = js.replace("if(document.getElementById('page-admin').classList.contains('show')){\n    renderAdminLocList();\n  }", '');

// 4d
js = js.replace(/\['home','map','cook','admin'\]\.forEach/g, "['home','map','cook'].forEach");
js = js.replace(/if\(tab==='admin'\) renderAdminTab\(\);\r?\n/, "");

let p1 = js.indexOf("if(tab==='admin'){ aiFab.style.opacity='0'; aiFab.style.pointerEvents='none'; aiFab.style.zIndex='-1'; }");
let p2 = js.indexOf("else{ aiFab.style.opacity=''; aiFab.style.pointerEvents=''; aiFab.style.zIndex=''; }", p1);
if(p1 !== -1 && p2 !== -1) {
    js = js.substring(0, p1) + "aiFab.style.opacity=''; aiFab.style.pointerEvents=''; aiFab.style.zIndex='';\n" + js.substring(p2 + 86);
}

// 4e
js = js.replace(/\['a-cat','edit-cat','s-cat'\]\.forEach/g, "['s-cat'].forEach");

// 4f
let fIdx1 = js.indexOf("['ar-cat','er-cat'].forEach(function(selId){");
if (fIdx1 !== -1) {
    let fIdx2 = js.indexOf("});", fIdx1);
    js = js.substring(0, fIdx1) + js.substring(fIdx2 + 3);
}

let rcpPillsStr = "var adminRcpPills = document.getElementById('admin-rcp-filter-pills');";
let rIdx1 = js.indexOf(rcpPillsStr);
if (rIdx1 !== -1) {
    let rIdx2 = js.indexOf("adminRcpPills.innerHTML = h;", rIdx1);
    if (rIdx2 !== -1) {
        js = js.substring(0, rIdx1) + js.substring(rIdx2 + 28);
    }
}

// 4g
js = js.replace(/\['page-home','page-cook','page-admin'\]\.forEach/g, "['page-home','page-cook'].forEach");

// 4h
js = js.replace(/\s*'addLocation':\s*\{[^}]*\},\r?\n/g, "\n");
js = js.replace(/\s*'updateLocation':\s*\{[^}]*\},\r?\n/g, "\n");
js = js.replace(/\s*'deleteLocation':\s*\{[^}]*\},\r?\n/g, "\n");
js = js.replace(/\s*'setGeminiAPIKey':\s*\{[^}]*\},\r?\n/g, "\n");
js = js.replace(/\s*'getAdminStatus':\s*\{[^}]*\},\r?\n/g, "\n");

let mStart = js.indexOf("if (gasMethodName === 'addLocation') {");
if (mStart !== -1) {
    let mEnd = js.indexOf("else if (gasMethodName === 'saveSuggestion') {", mStart);
    if (mEnd !== -1) {
        js = js.substring(0, mStart) + "if (gasMethodName === 'saveSuggestion') {" + js.substring(mEnd + 46);
    }
}

// 4i
const win_vars = [
    'changeAdminLocPage', 'changeAdminRcpPage', 'deleteAdminLoc', 'deleteRecipeItem',
    'doAdminAdd', 'doAdminAddRecipe', 'doAdminUpdateRecipe', 'openAdminEdit',
    'openAdminEditRecipe', 'openAdminModal', 'saveAdminEdit', 'setAdminLocFilter',
    'setAdminRcpFilter', 'switchAdminSec'
];
for(const v of win_vars) {
    js = js.replace(new RegExp('window\\.' + v + '\\s*=\\s*' + v + ';\\s*', 'g'), '');
}

fs.writeFileSync('src/main.js', js, 'utf8');
console.log('Done!');
