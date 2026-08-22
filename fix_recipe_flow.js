const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// Fix 1: loadRecipesData shouldn't conditionally check m-admin.
// It should just check if we are in admin page, or just call renderAdminRcpList() unconditionally because renderAdminRcpList has `if(!container) return;`
html = html.replace(/if \(document\.getElementById\('m-admin'\)\.style\.display === 'flex'\) renderAdminRcpList\(\);/g, 
  "if (document.getElementById('page-admin').classList.contains('show')) renderAdminRcpList();");

// Fix 2: switchAdminSec should call loadRecipesData if it's not loaded
html = html.replace(/if\(sec==='rcps'\) renderAdminRcpList\(\);/g, 
  "if(sec==='rcps') { if(!isRecipesLoaded) { document.getElementById('admin-rcp-container').innerHTML = '<div style=\"text-align:center;padding:40px;\">Đang tải dữ liệu...</div>'; loadRecipesData(); } renderAdminRcpList(); }");

fs.writeFileSync('Index.html', html, 'utf8');
console.log('Patched Recipe Loading flow!');
