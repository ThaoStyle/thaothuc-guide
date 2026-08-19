const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/MÓN MỚI LÊN SÓNG/g, 'CÔNG THỨC CHUẨN VỊ');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replaced in ' + filePath);
}

replaceInFile('frontend/src/main.js');
replaceInFile('Index.html');
