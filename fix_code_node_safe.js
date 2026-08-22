const fs = require('fs');
let code = fs.readFileSync('Code.gs', 'utf8');

const newDoGet = `function doGet(e) {
  var email = '';
  try { email = Session.getActiveUser().getEmail(); } catch (e1) {}
  var ownerEmail = '';
  try { ownerEmail = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getOwner().getEmail(); } catch (e2) {}

  if (email && ownerEmail && email.toLowerCase() === ownerEmail.toLowerCase()) {
    var tpl = HtmlService.createTemplateFromFile('Index');
    return tpl.evaluate()
      .setTitle('Thao Thuc Guide - Admin')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=3.0, viewport-fit=cover');
  }

  return HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:40px;text-align:center;">' +
    '<h2>🔴 Truy cap bi tu choi</h2>' +
    '<p>Ban can dang nhap dung tai khoan Google chu so huu de vao trang quan tri.</p>' +
    '</div>'
  );
}`;

let endIdx = code.indexOf('function getAdminStatus()');
if (endIdx > 0) {
  code = newDoGet + '\n\n' + code.substring(endIdx);
  fs.writeFileSync('Code.gs', code, 'utf8');
}
