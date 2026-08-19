const fs = require('fs');

let indexHtml = fs.readFileSync('Index.html', 'utf8');

const oldOpen = `function openRecipeDetail(id){
    var r = RECIPES_DATA.find(function(item){return item.id===id;});
    if(!r) return;
    currentSheetRecipeId = r.id;
    document.getElementById('rcp-cat').textContent = 'dY?3 ' + r.category;
    document.getElementById('rcp-title').textContent = r.name;
    
    var serving = r.serving || '4 ng?i';
    document.getElementById('rcp-meta').textContent = '?,? ' + r.time + ' ? dY`"??dY`c??dY`  ' + serving + ' ? dY `??dY?3 ' + r.level;
    
    document.getElementById('rcp-ing-list').innerHTML = '<div class="rcp-ingred-grid">' + r.ingredients.map(function(ing){
      return '<label class="rcp-ingred-item"><input type="checkbox"/> <span class="rcp-ingred-name">'+ing+'</span></label>';
    }).join('') + '</div>';
  
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
      vidBtn.href = r.video_url || 'https://www.tiktok.com/@chongcookvolook';
    }`;

const newOpen = `function openRecipeDetail(id){
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
           + '<div class="rcp-step-title">Bước '+stNum+'</div>'
           + '<div class="rcp-step-desc">'+stDesc+'</div>'
           + '</div></div>';
    }).join('');

    var vidBtn = document.getElementById('btn-rcp-video');
    if(vidBtn){
      vidBtn.href = r.video_url || 'https://www.tiktok.com/@chongcookvolook';
    }`;

// Since the oldOpen contains Vietnamese encoding issues from PowerShell reading it earlier, I will use regex instead but carefully!
const safeOldOpenRegex = /function openRecipeDetail\(id\)\{[\s\S]*?var vidBtn = document.getElementById\('btn-rcp-video'\);\s*if\(vidBtn\)\{\s*vidBtn\.href = r\.video_url \|\| 'https:\/\/www\.tiktok\.com\/@chongcookvolook';\s*\}/m;

if (safeOldOpenRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(safeOldOpenRegex, newOpen);
    fs.writeFileSync('Index.html', indexHtml, 'utf8');
    console.log('Successfully patched openRecipeDetail in Index.html!');
} else {
    console.log('Regex still failing.');
}

