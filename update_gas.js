const fs = require('fs');
let code = fs.readFileSync('backend-api/Code.gs', 'utf8');

// 1. replace doGet
let startDoGet = code.indexOf('function doGet(e) {');
let endDoGet = code.indexOf('function doPost(e) {', startDoGet);
if (startDoGet !== -1 && endDoGet !== -1) {
    let newDoGet = unction doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : '';

  if (action === 'getLocations')   return jsonOut(getFoodLocations());
  if (action === 'getRecipes')     return jsonOut(getRecipes());
  if (action === 'getSuggestions') return jsonOut(getSuggestions());
  if (action === 'getAdminStatus') return jsonOut(getAdminStatus());
  if (action) {
    return jsonOut({ status: 'ok', version: '2.0', message: 'Thao Thức Guide API is running.' });
  }

  var email = '';
  try { email = Session.getActiveUser().getEmail(); } catch (e1) {}
  var ownerEmail = '';
  try { ownerEmail = SpreadsheetApp.openById(SHEET_ID).getOwner().getEmail(); } catch (e2) {}

  if (email && ownerEmail && email.toLowerCase() === ownerEmail.toLowerCase()) {
    var tpl = HtmlService.createTemplateFromFile('Admin');
    tpl.currentEmail = email;
    return tpl.evaluate()
      .setTitle('Thao Thức Guide — Admin')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:40px;text-align:center;">' +
    '<h2>🔒 Truy cập bị từ chối</h2>' +
    '<p>Bạn cần đăng nhập đúng tài khoản Google chủ sở hữu để vào trang quản trị.</p>' +
    '</div>'
  );
}

;
    code = code.substring(0, startDoGet) + newDoGet + code.substring(endDoGet);
}

// 2. replace doPost
let startDoPost = code.indexOf('function doPost(e) {');
let endDoPost = code.indexOf('// ──', startDoPost);
if (endDoPost === -1) endDoPost = code.indexOf('function getAdminStatus()', startDoPost);
if (startDoPost !== -1 && endDoPost !== -1) {
    let newDoPost = unction doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';

    if (action === 'saveSuggestion') return jsonOut(saveSuggestion(body.data));
    if (action === 'askAI')          return jsonOut(askGeminiAI(body.query, body.lat, body.lng, body.tab));

    return jsonOut({ success: false, error: 'Unknown action: ' + action });
  } catch(err) {
    return jsonOut({ success: false, error: err.message });
  }
}

;
    code = code.substring(0, startDoPost) + newDoPost + code.substring(endDoPost);
}

// 3. append recipe functions correctly
let startGetRecipes = code.indexOf('function getRecipes() {');
if(startGetRecipes !== -1) {
    // Find the end of getRecipes correctly by matching braces
    let depth = 0;
    let i = startGetRecipes;
    while(i < code.length) {
        if (code[i] === '{') depth++;
        if (code[i] === '}') depth--;
        if (depth === 0 && i > startGetRecipes) {
            // we found the end
            let insertIdx = i + 1;
            let newRecipes = 

function addRecipe(row) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'Sheet Recipes not found' };
  sheet.appendRow(row);
  return { success: true };
}

function updateRecipe(id, row) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'Sheet Recipes not found' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return { success: true };
    }
  }
  return { success: false, error: 'ID not found' };
}

function deleteRecipe(id) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'Sheet Recipes not found' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) { sheet.deleteRow(i + 1); return { success: true }; }
  }
  return { success: false, error: 'ID not found' };
}
;
            code = code.substring(0, insertIdx) + newRecipes + code.substring(insertIdx);
            break;
        }
        i++;
    }
}

fs.writeFileSync('backend-api/Code.gs', code, 'utf8');
console.log('Code.gs updated successfully');
