const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

const dummyDOM = `
<div id="dummy-container" style="display:none;">
  <div id="map"></div>
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
  // Find the exact body tag safely
  html = html.replace(/<body[^>]*>/i, match => match + '\n' + dummyDOM);
  fs.writeFileSync('Index.html', html, 'utf8');
  console.log('Dummy DOM forcefully inserted into body!');
} else {
  console.log('Already exists');
}
