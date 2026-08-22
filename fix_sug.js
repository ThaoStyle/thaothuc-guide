const fs = require('fs');
let code = fs.readFileSync('Code.gs', 'utf8');

let newFunc = `function getSuggestions() {
  try {
    var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Suggestions');
    if (!sheet) return [{ place_name: "Lỗi: Không tìm thấy sheet Suggestions" }];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[1]) continue;
      list.push({
        timestamp: String(r[0]),
        place_name: String(r[1]),
        address: String(r[2]),
        lat: String(r[3]),
        lng: String(r[4]),
        category: String(r[5]),
        must_try_notes: String(r[6])
      });
    }
    return list;
  } catch (e) {
    return [{ place_name: "Lỗi Backend: " + e.message }];
  }
}`;

code = code.replace(/function getSuggestions\(\) \{[\s\S]*?\}\s*(?=\n(?:function|\/\/|$))/g, newFunc + '\n');
fs.writeFileSync('Code.gs', code, 'utf8');
console.log('Patched getSuggestions!');
