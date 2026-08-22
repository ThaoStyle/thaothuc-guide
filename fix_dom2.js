const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

const dummyDOM = `
<div id="dummy-container" style="display:none;">
  <div id="home-latest-container"></div>
  <div id="home-cat-container"></div>
  <div id="home-search-res"></div>
  <div id="page-home"></div>
  <div id="page-cook"></div>
  <div id="cook-rcp-container"></div>
  <div id="ai-drawer"></div>
  <div id="chat-messages"></div>
  <div id="bot-status"></div>
  <div id="mobile-list-sheet"></div>
  <div id="mobile-list-content"></div>
</div>
`;

if (!html.includes('id="dummy-container"')) {
  html = html.replace('<div class="page-overlay" id="page-admin">', dummyDOM + '\n<div class="page-overlay" id="page-admin">');
  fs.writeFileSync('Index.html', html, 'utf8');
  console.log('Dummy DOM inserted!');
} else {
  console.log('Already exists');
}
