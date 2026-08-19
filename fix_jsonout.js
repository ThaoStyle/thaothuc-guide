const fs = require('fs');
let code = fs.readFileSync('temp_gas/Code.js', 'utf8');

const jsonOutFunc = `
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

if (!code.includes('function jsonOut(obj)')) {
    code = code + '\n' + jsonOutFunc;
    fs.writeFileSync('temp_gas/Code.js', code, 'utf8');
    console.log('Added jsonOut');
}
