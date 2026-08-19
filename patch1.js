const fs = require('fs');

// --- 1. PATCH Code.gs ---
let codeGs = fs.readFileSync('Code.gs', 'utf8');

const getRecipesFunc = `
function getRecipes() {
  try {
    var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
    if (!sheet) {
      sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").insertSheet('Recipes');
      sheet.appendRow(['id', 'name', 'category', 'time', 'level', 'image_url', 'video_url', 'ingredients_json', 'steps_json', 'default_servings', 'search_cat']);
      
      sheet.appendRow([
        'rcp_' + new Date().getTime(),
        'Bún Bò Huế Chuẩn Vị',
        'Món Nước / Bún Phở',
        '45 phút',
        'Dễ nấu',
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
        'https://www.tiktok.com/@chongcookvolook',
        JSON.stringify(['500g bắp bò / giò heo', '1kg bún tươi sợi to', '3 củ sả đập dập', '2 muỗng canh mắm ruốc Huế', '1.5 lít nước dùng', 'Hành tây, rau thơm, bắp chuối']),
        JSON.stringify(['Bước 1: Hầm bắp bò và giò heo với sả đập dập trong 30 phút.', 'Bước 2: Hòa tan mắm ruốc Huế với nước lạnh, lọc lấy nước trong cho vào nồi.', 'Bước 3: Phi thơm ớt sa tế, nêm nếm gia vị vừa ăn. Trụng bún, xếp thịt, chan nước dùng nóng hổi.']),
        4,
        'Bún / Phở / Món Nước'
      ]);
    }

    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[0]) continue;
      
      var ings = [];
      var steps = [];
      try { ings = JSON.parse(r[7] || '[]'); } catch(e) { ings = []; }
      try { steps = JSON.parse(r[8] || '[]'); } catch(e) { steps = []; }
      
      list.push({
        id: String(r[0]),
        name: String(r[1]),
        category: String(r[2]),
        time: String(r[3]),
        level: String(r[4]),
        image: String(r[5]),
        video_url: String(r[6]),
        ingredients: ings,
        steps: steps,
        default_servings: parseFloat(r[9]) || 4,
        searchCat: String(r[10])
      });
    }
    return list;
  } catch(e) {
    return [];
  }
}

function addRecipe(data) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'No sheet Recipes' };
  
  var newId = 'rcp_' + new Date().getTime();
  sheet.appendRow([
    newId,
    data.name,
    data.category,
    data.time,
    data.level,
    data.image,
    data.video_url,
    JSON.stringify(data.ingredients || []),
    JSON.stringify(data.steps || []),
    data.default_servings || 4,
    data.searchCat || ''
  ]);
  return { success: true, id: newId };
}

function updateRecipe(id, data) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'No sheet' };
  
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 2, 1, 10).setValues([[
        data.name,
        data.category,
        data.time,
        data.level,
        data.image,
        data.video_url,
        JSON.stringify(data.ingredients || []),
        JSON.stringify(data.steps || []),
        data.default_servings || 4,
        data.searchCat || ''
      ]]);
      return { success: true };
    }
  }
  return { success: false, error: 'Recipe ID not found' };
}

function deleteRecipe(id) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'No sheet' };
  
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Recipe ID not found' };
}
`;

if (!codeGs.includes("function getRecipes()")) {
    codeGs += "\n\n" + getRecipesFunc;
    fs.writeFileSync('Code.gs', codeGs, 'utf8');
    console.log("Patched Code.gs");
}

