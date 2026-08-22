const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');
html = html.replace(/<\?!= JSON\.stringify\(deepLinkId \|\| ''\) \?>/g, '""');
html = html.replace(/<\?!= JSON\.stringify\(deepLinkType \|\| ''\) \?>/g, '""');
html = html.replace(/<\?!= typeof scriptUrl !== 'undefined' \? JSON\.stringify\(scriptUrl\) : '""' \?>/g, '""');
fs.writeFileSync('Index.html', html, 'utf8');
console.log('Fixed scriptlets in Index.html');
