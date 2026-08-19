const fs = require('fs');
let code = fs.readFileSync('temp_gas/Code.js', 'utf8');

const oldDoGetStart = code.indexOf('function doGet(e) {');
const oldDoGetEnd = code.indexOf('function getAdminStatus() {');

let newDoGet = `function doGet(e) {
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
  try { ownerEmail = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getOwner().getEmail(); } catch (e2) {}

  if (email && ownerEmail && email.toLowerCase() === ownerEmail.toLowerCase()) {
    var tpl = HtmlService.createTemplateFromFile('Admin');
    tpl.currentEmail = email;
    return tpl.evaluate()
      .setTitle('Thao Thức Guide - Admin')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:40px;text-align:center;">' +
    '<h2>🔴 Truy cập bị từ chối</h2>' +
    '<p>Bạn cần đăng nhập đúng tài khoản Google chủ sở hữu để vào trang quản trị.</p>' +
    '</div>'
  );
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';

    if (action === 'saveSuggestion') return jsonOut(saveSuggestion(body.data));
    if (action === 'askAI')          return jsonOut(askGeminiAI(body.query, body.lat, body.lng, body.tab));

    if (action === 'addRecipe')      return jsonOut(addRecipe(body.data));
    if (action === 'updateRecipe')   return jsonOut(updateRecipe(body.id, body.data));
    if (action === 'deleteRecipe')   return jsonOut(deleteRecipe(body.id));

    return jsonOut({ success: false, error: 'Unknown action: ' + action });
  } catch(err) {
    return jsonOut({ success: false, error: err.message });
  }
}
\n\n`;

if (oldDoGetStart !== -1 && oldDoGetEnd !== -1) {
    code = code.substring(0, oldDoGetStart) + newDoGet + code.substring(oldDoGetEnd);
    fs.writeFileSync('temp_gas/Code.js', code, 'utf8');
    console.log('Fixed doGet and added doPost in temp_gas/Code.js');
}

