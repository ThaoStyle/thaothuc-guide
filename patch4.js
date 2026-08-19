const fs = require('fs');
let code = fs.readFileSync('frontend/src/main.js', 'utf8');

// 1. Remove hardcoded RECIPES_DATA
const oldHardcoded = /var RECIPES_DATA = \[[\s\S]*?searchCat:\s*'BAn\s*\/\s*PhY\s*\/\s*MA3n N>c'\s*\}\s*\];/m;
// Let's just find `var RECIPES_DATA = [` and slice it out until the next `];`
// Wait, regex might be flaky with vietnamese. I'll just replace the whole array.
const startIdx = code.indexOf('var RECIPES_DATA = [');
if (startIdx !== -1) {
    const endIdx = code.indexOf('];', startIdx) + 2;
    code = code.substring(0, startIdx) + 'var RECIPES_DATA = [];\nvar isRecipesLoaded = false;' + code.substring(endIdx);
}

// 2. Add loadRecipes() and scaling functions
const newFunctions = `
// --- RECIPE DYNAMIC SCALING LOGIC ---
let currentServings = 4;
let baseServings = 4;
let parsedIngredients = [];

function safeParseFloat(str) {
  if (!str) return 0;
  str = str.replace(',', '.');
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2 && parseFloat(parts[1]) !== 0) {
      return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
  }
  return parseFloat(str);
}

function parseIngredient(text) {
  try {
    const regex = /^([\\d.,]+(?:\\/\\d+)?)\\s*(g|kg|ml|l|lAt|mu-ng\\s?canh|mu-ng|c|trAi|qu|con|nhAnh)?\\s+(.*)$/i;
    const match = text.trim().match(regex);
    if (match) {
      let qty = safeParseFloat(match[1]);
      if (!isNaN(qty) && qty > 0) {
        return { qty: qty, unit: match[2] ? match[2].trim() : '', name: match[3], isScalable: true };
      }
    }
  } catch(e) {}
  return { qty: null, name: text, isScalable: false };
}

function changeServings(delta) {
  let newVal = currentServings + delta;
  if (newVal < 1 || newVal > 20) return;
  currentServings = newVal;
  renderIngredientsList(true);
}

function renderIngredientsList(animate = false) {
  const displayEl = document.getElementById('servings-display');
  const listEl = document.getElementById('rcp-ing-list');
  if (!displayEl || !listEl) return;

  displayEl.innerText = currentServings + " ng?i";
  const ratio = currentServings / baseServings;
  
  while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
  }

  parsedIngredients.forEach(ing => {
    let label = document.createElement('label');
    label.className = 'rcp-ingred-item';
    
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    label.appendChild(checkbox);

    let textSpan = document.createElement('span');
    textSpan.className = 'rcp-ingred-name';
    
    if (ing.isScalable) {
      let newQty = ing.qty * ratio;
      newQty = Math.round(newQty * 100) / 100;
      
      let qtySpan = document.createElement('span');
      qtySpan.className = animate ? "ing-qty changed" : "ing-qty";
      qtySpan.innerText = newQty + (ing.unit ? ing.unit + " " : " ");
      
      textSpan.appendChild(qtySpan);
      textSpan.appendChild(document.createTextNode(ing.name));
    } else {
      textSpan.innerText = ing.name;
    }
    
    label.appendChild(textSpan);
    listEl.appendChild(label);
  });
}

function loadRecipesData(force = false) {
  if (isRecipesLoaded && !force) {
    renderRecipes();
    return;
  }
  const rcpContainer = document.getElementById('recipe-list');
  if(rcpContainer) rcpContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--sl);">?ang ti cA'ng thcc...</div>';

  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run.withSuccessHandler(function(res) {
      RECIPES_DATA = res || [];
      isRecipesLoaded = true;
      renderRecipes();
      if (document.getElementById('m-admin').style.display === 'flex') renderAdminRcpList();
    }).getRecipes();
  } else {
    // API Mock fallback or Vercel fetch
    fetchApi('getRecipes').then(res => {
       RECIPES_DATA = res && Array.isArray(res.data) ? res.data : [];
       isRecipesLoaded = true;
       renderRecipes();
       if (document.getElementById('m-admin').style.display === 'flex') renderAdminRcpList();
    }).catch(e => {
       console.log('Load recipes error:', e);
    });
  }
}
// ------------------------------------
`;

if (!code.includes('function loadRecipesData')) {
    code = code.replace('function renderRecipes(){', newFunctions + '\nfunction renderRecipes(){');
}

// 3. Patch openRecipeDetail to use the new dynamic rendering
const oldOpenRecipe = /function openRecipeDetail\(id\)\{[\s\S]*?document\.getElementById\('rcp-steps-list'\)\.innerHTML = r\.steps\.map[\s\S]*?vidBtn\.style\.display = 'none';\s*\}/m;

const newOpenRecipe = `function openRecipeDetail(id){
    var r = RECIPES_DATA.find(function(item){return item.id===id;});
    if(!r) return;
    currentSheetRecipeId = r.id;
    
    // Set Header
    document.getElementById('rcp-cat').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 10H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1zm-1.5-2a1 1 0 0 0 .5-.86v-1a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 6.14v1a1 1 0 0 0 .5.86h15z"/></svg> ' + r.category;
    document.getElementById('rcp-title').textContent = r.name;
    
    // Meta (Clock & Chef Hat SVG)
    document.getElementById('rcp-meta').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + r.time + ' &bull; <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z"></path><path d="M19.914 10H4.086A2 2 0 0 0 2 12v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2.086-2z"></path><path d="M15 10V7a3 3 0 0 0-6 0v3"></path></svg> ' + r.level;

    // SCALING LOGIC SETUP
    baseServings = parseFloat(r.default_servings) || 4;
    currentServings = baseServings;
    parsedIngredients = (r.ingredients || []).map(parseIngredient);
    renderIngredientsList();

    // STEPS
    document.getElementById('rcp-steps-list').className = 'rcp-step-list';
    document.getElementById('rcp-steps-list').innerHTML = r.steps.map(function(st, idx){
      var parts = st.split(':');
      var stNum = idx + 1;
      var stDesc = st;
      if(parts.length > 1) {
         stDesc = parts.slice(1).join(':').trim();
      }
      return '<div class="rcp-step-item">'
           + '<div class="rcp-step-num">'+stNum+'</div>'
           + '<div class="rcp-step-content">'
           + '<div class="rcp-step-title">B>c '+stNum+'</div>'
           + '<div class="rcp-step-desc">'+stDesc+'</div>'
           + '</div></div>';
    }).join('');

    var vidBtn = document.getElementById('btn-rcp-video');
    if(vidBtn){
      vidBtn.href = r.video_url || '#';
      if(r.video_url){
         vidBtn.style.display = 'flex';
      }else{
         vidBtn.style.display = 'none';
      }
    }
}`;
code = code.replace(oldOpenRecipe, newOpenRecipe);

// 4. Also call loadRecipesData() inside switchNav when navigating to 'cook' tab
// I'll just find the place where switchNav sets tab === 'cook'
const switchCook = `if(tab==='cook'){
      // TODO load
    }`;
const newSwitchCook = `if(tab==='cook'){
      loadRecipesData();
    }`;
code = code.replace(switchCook, newSwitchCook);

// Replace any existing hardcoded call to renderRecipes if it's there on startup?
// The current code just calls `renderRecipes()` at the bottom.
// We will change it to `loadRecipesData()`
code = code.replace('renderRecipes(); // load bAn', 'loadRecipesData(); // load recipes');

fs.writeFileSync('frontend/src/main.js', code, 'utf8');
console.log('Patched frontend/src/main.js');
