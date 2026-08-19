const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');

// 4a.
js = js.replace(/\/\/ ── DEDICATED ADMIN TAB CONTROLLER[\s\S]*?function doAdminAdd\(\)\{[\s\S]*?alert\('✔ Đã thêm \(local test\)'\);\s*\}\s*\}/, '');

// 4b.
js = js.replace(/checkAdminAuth\(\);/, '');

// 4c.
js = js.replace(/if\(document\.getElementById\('page-admin'\)\.classList\.contains\('show'\)\)\{\s*renderAdminLocList\(\);\s*\}/, '');

// 4d.
js = js.replace(/\['home','map','cook','admin'\]\.forEach/, "['home','map','cook'].forEach");
js = js.replace(/if\(tab==='admin'\) renderAdminTab\(\);/, '');
js = js.replace(/if\(tab==='admin'\)\{\s*aiFab\.style\.opacity='0';[\s\S]*?\} else \{\s*(aiFab\.style\.opacity='';[^}]+)\}/, '');

// 4e.
js = js.replace(/\['a-cat','edit-cat','s-cat'\]\.forEach/, "['s-cat'].forEach");

// 4f.
js = js.replace(/\['ar-cat','er-cat'\]\.forEach.*?\}\);/, '');
js = js.replace(/var adminRcpPills = document\.getElementById\('admin-rcp-filter-pills'\);[\s\S]*?adminRcpPills\.innerHTML = h;/, '');

// 4g.
js = js.replace(/\['page-home','page-cook','page-admin'\]\.forEach/, "['page-home','page-cook'].forEach");

// 4h. GAS_ACTION_MAP
js = js.replace(/addLocation:\s*\{\s*path:.*\},\s*/, '');
js = js.replace(/updateLocation:\s*\{\s*path:.*\},\s*/, '');
js = js.replace(/deleteLocation:\s*\{\s*path:.*\},\s*/, '');
js = js.replace(/setGeminiAPIKey:\s*\{\s*path:.*\},\s*/, '');
js = js.replace(/getAdminStatus:\s*\{\s*path:.*\},\s*/, '');

js = js.replace(/'getAdminStatus': \{[^}]*\},\s*/, '');

js = js.replace(/if \(gasMethodName === 'addLocation'\) \{[\s\S]*?\}\s*else if \(gasMethodName === 'updateLocation'\) \{[\s\S]*?\}\s*else if \(gasMethodName === 'deleteLocation'\) \{[\s\S]*?\}\s*else if \(gasMethodName === 'setGeminiAPIKey'\) \{[\s\S]*?\}\s*else\s*if\s*\(gasMethodName === 'saveSuggestion'\)/, "if (gasMethodName === 'saveSuggestion')");

// 4i.
const winVars = [
    'changeAdminLocPage', 'changeAdminRcpPage', 'deleteAdminLoc', 'deleteRecipeItem',
    'doAdminAdd', 'doAdminAddRecipe', 'doAdminUpdateRecipe', 'openAdminEdit',
    'openAdminEditRecipe', 'openAdminModal', 'saveAdminEdit', 'setAdminLocFilter',
    'setAdminRcpFilter', 'switchAdminSec'
];
for(const v of winVars) {
    js = js.replace(new RegExp('window\\.' + v + ' = ' + v + ';\\s*'), '');
}

fs.writeFileSync('src/main.js', js, 'utf8');
console.log('main.js cleaned');
