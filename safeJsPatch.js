const fs = require('fs');

let indexHtml = fs.readFileSync('Index.html', 'utf8');
const mainJs = fs.readFileSync('frontend/src/main.js', 'utf8');
const styleCss = fs.readFileSync('frontend/src/style.css', 'utf8');

// The tricky part is replacing ONLY the <script> tags safely if they exist.
// Since Index.html is built from frontend, it's safer to just inject the exact functions I added to main.js into Index.html.
const oldOpenRecipe = /function openRecipeDetail\(id\)\{[\s\S]*?document\.getElementById\('rcp-steps-list'\)\.innerHTML = r\.steps\.map[\s\S]*?vidBtn\.style\.display = 'none';\s*\}/m;
const newOpenRecipeMatch = mainJs.match(/function openRecipeDetail\(id\)\{[\s\S]*?vidBtn\.style\.display = 'none';\s*\}\s*\}/m);
if (oldOpenRecipe.test(indexHtml) && newOpenRecipeMatch) {
    indexHtml = indexHtml.replace(oldOpenRecipe, newOpenRecipeMatch[0]);
    console.log("Patched openRecipeDetail");
}

// Extract scaling functions
const newFuncsMatch = mainJs.match(/\/\/ --- RECIPE DYNAMIC SCALING LOGIC ---[\s\S]*?\/\/ ------------------------------------/);
if (newFuncsMatch && !indexHtml.includes('function safeParseFloat')) {
    indexHtml = indexHtml.replace('function renderRecipes(){', newFuncsMatch[0] + '\nfunction renderRecipes(){');
    console.log("Patched scaling functions");
}

// Replace RECIPES_DATA
const rcpDataMatch = indexHtml.match(/var RECIPES_DATA = \[[\s\S]*?\];/m);
if (rcpDataMatch) {
    indexHtml = indexHtml.replace(rcpDataMatch[0], 'var RECIPES_DATA = [];\nvar isRecipesLoaded = false;');
    console.log("Patched RECIPES_DATA init");
}

// Replace switchNav cook
indexHtml = indexHtml.replace("if(tab==='cook') renderRecipes();", "if(tab==='cook') loadRecipesData();");

// Extract doAdminAddRecipe
const newAdminAddMatch = mainJs.match(/function doAdminAddRecipe\(\)\{[\s\S]*?\}\s*function deleteRecipeItem\(id\)/m);
const oldAdminAdd = /function doAdminAddRecipe\(\)\{[\s\S]*?\}\s*function deleteRecipeItem\(id\)/m;
if (newAdminAddMatch && oldAdminAdd.test(indexHtml)) {
    indexHtml = indexHtml.replace(oldAdminAdd, newAdminAddMatch[0]);
    console.log("Patched doAdminAddRecipe");
}

// Add CSS
const newCss = `
/* --- RECIPE DYNAMIC SCALING CSS --- */
.rcp-stepper {
  display: flex; align-items: center; background: #fff;
  border: 1.5px solid rgba(15,23,42,0.1); border-radius: 999px;
  padding: 3px; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.rcp-stepper button {
  width: 26px; height: 26px; border-radius: 50%; border: none;
  background: var(--or-light); color: var(--or); font-size: 16px; font-weight: 900;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform 0.1s, background 0.1s;
}
.rcp-stepper button:active { transform: scale(0.9); background: var(--or); color: #fff; }
.rcp-stepper span { font-size: 13px; font-weight: 800; color: var(--nv); min-width: 58px; text-align: center; }
.rcp-ingred-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--nv); font-weight: 600; margin-bottom: 12px; cursor: pointer;}
.rcp-ingred-item input { margin-top: 2px; accent-color: var(--or); width: 16px; height: 16px; flex-shrink: 0; }
.rcp-ingred-name { flex: 1; line-height: 1.4; }
.ing-qty { font-weight: 800; color: var(--or); transition: color 0.3s ease; }
.changed { animation: flashOrange 0.6s ease-out; }
@keyframes flashOrange { 0% { color: var(--nv); transform: scale(1.1); } 100% { color: var(--or); transform: scale(1); } }
/* ---------------------------------- */
`;
if (!indexHtml.includes('.rcp-stepper')) {
    indexHtml = indexHtml.replace('</style>', newCss + '\n</style>');
    console.log("Patched CSS");
}

fs.writeFileSync('Index.html', indexHtml, 'utf8');

