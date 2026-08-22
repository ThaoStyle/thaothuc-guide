const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

const dummyDOM = `
<div id="map" style="display:none"></div>
<div id="home-latest-container" style="display:none"></div>
<div id="page-home" style="display:none"></div>
<div id="page-cook" style="display:none"></div>
<div id="ai-drawer" style="display:none"></div>
`;

if (!html.includes('<div id="map"')) {
  html = html.replace('<body', '<body style="overflow:auto !important;"');
  html = html.replace('<body>', '<body>\n' + dummyDOM); // fallback
  html = html.replace('overflow:auto !important;">', 'overflow:auto !important;">\n' + dummyDOM);
  fs.writeFileSync('Index.html', html, 'utf8');
  console.log('Dummy DOM inserted!');
} else {
  console.log('Already exists');
}
