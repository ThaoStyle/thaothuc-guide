const fs = require('fs');
let code = fs.readFileSync('frontend/src/main.js', 'utf8');

code = code.replace("if(tab==='cook') renderRecipes();", "if(tab==='cook') loadRecipesData();");

// Fix any Vietnamese characters mangled by replace in patch4
code = code.replace('B>c ', 'Bước ');

// Update doAdminAddRecipe and doAdminEditRecipe to save to GAS!
const oldDoAdminAdd = /function doAdminAddRecipe\(\)\{[\s\S]*?renderAdminRcpList\(\);\s*\}\s*function deleteRecipeItem\(id\)/m;

const newDoAdminAdd = `function doAdminAddRecipe(){
  var name = document.getElementById('ar-name').value.trim();
  if(!name){alert('Vui lòng nhập tên công thức món ăn!');return;}
  
  var btn = document.querySelector('#m-admin-add-recipe .btn-submit');
  var originalText = btn.innerHTML;
  btn.innerHTML = 'Đang lưu...';
  btn.style.pointerEvents = 'none';

  var newRcp = {
    name: name,
    category: document.getElementById('ar-cat').value.trim() || 'Món Nước / Bún Phở',
    time: document.getElementById('ar-time').value.trim() || '30 phút',
    level: document.getElementById('ar-level').value.trim() || 'Dễ làm',
    image: document.getElementById('ar-img').value.trim() || CAT_IMAGES['Default'],
    video_url: document.getElementById('ar-video').value.trim() || 'https://www.tiktok.com/@chongcookvolook',
    ingredients: document.getElementById('ar-ing').value.split('\\n').filter(function(s){return s.trim();}),
    steps: document.getElementById('ar-steps').value.split('\\n').filter(function(s){return s.trim();}),
    default_servings: document.getElementById('ar-servings') ? (document.getElementById('ar-servings').value || 4) : 4,
    searchCat: 'Bún / Phở / Món Nước'
  };

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(res){
        btn.innerHTML = originalText;
        btn.style.pointerEvents = 'auto';
        if(res && res.success){
          alert('Tuyệt! Đã lưu công thức lên Google Sheets.');
          closeModal('m-admin-add-recipe');
          ['ar-name','ar-cat','ar-time','ar-level','ar-img','ar-video','ar-ing','ar-steps','ar-servings'].forEach(function(id){
             let el=document.getElementById(id); if(el) el.value='';
          });
          loadRecipesData(true);
        } else {
          alert('Lỗi: ' + (res ? res.error : 'Unknown'));
        }
      })
      .addRecipe(newRcp);
  } else {
    // Local demo
    RECIPES_DATA.unshift({id: 'rcp_'+Date.now(), ...newRcp});
    btn.innerHTML = originalText;
    btn.style.pointerEvents = 'auto';
    closeModal('m-admin-add-recipe');
    renderRecipes();
    renderAdminRcpList();
  }
}

function deleteRecipeItem(id){
  if(!confirm('Bạn có chắc muốn xóa công thức này khỏi Google Sheets?')) return;
  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run.withSuccessHandler(function(res){
      if(res.success) loadRecipesData(true);
      else alert('Lỗi xóa: '+res.error);
    }).deleteRecipe(id);
  } else {
    RECIPES_DATA = RECIPES_DATA.filter(function(r){return r.id!==id;});
    renderRecipes();
    renderAdminRcpList();
  }
}`;

code = code.replace(oldDoAdminAdd, newDoAdminAdd);

fs.writeFileSync('frontend/src/main.js', code, 'utf8');
