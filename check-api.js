const fs = require('fs');
const files = ['frontend/index.html', 'frontend/src/main.js'];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if(content.includes('SCRIPT_URL')) console.log(f + ' contains SCRIPT_URL');
  if(content.includes('fetch')) console.log(f + ' contains fetch');
});
