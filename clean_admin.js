
const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

function removeBetween(str, startToken, endToken) {
  let s = str.indexOf(startToken);
  let e = str.indexOf(endToken);
  if (s !== -1 && e !== -1 && e > s) {
    return str.substring(0, s) + str.substring(e);
  }
  return str;
}

// Remove Home
html = removeBetween(html, '<div class="page-overlay" id="page-home"', '<div class="page-overlay" id="page-cook"');
// Remove Cook
html = removeBetween(html, '<div class="page-overlay" id="page-cook"', '<div class="page-overlay" id="page-admin"');
// Remove Map
html = removeBetween(html, '<div id="map"></div>', '<div class="page-overlay" id="page-home"');
// Remove Bottom Nav
html = removeBetween(html, '<!-- -- BOTTOM NAVIGATION -- -->', '<!-- -- AI CHATBOT FAB -- -->');
// Remove AI Chatbot
html = removeBetween(html, '<!-- -- AI CHATBOT FAB -- -->', '<!-- -- RECIPE DETAIL MODAL -- -->');
// Remove Recipe Modal
html = removeBetween(html, '<!-- -- RECIPE DETAIL MODAL -- -->', '<!-- -- SEARCH MODAL -- -->');
// Remove Search Modal
html = removeBetween(html, '<!-- -- SEARCH MODAL -- -->', '<!-- -- ADMIN LOGIN OVERLAY -- -->');
// Remove Admin Login Overlay (We already verify via Code.gs!)
// Actually wait, Code.gs verifies it. But maybe there is a client side login?
// We can leave it for now.

// Remove Leaflet and Map logic from JS
html = removeBetween(html, 'var map = L.map', 'function updateLocMarkers');

// Force Admin to show by adding 'show' class to it
html = html.replace('id="page-admin"', 'id="page-admin" class="page-overlay show"');

// Fix body overflow if any
html = html.replace('<body>', '<body style="overflow:auto !important;">');

fs.writeFileSync('Admin_Test.html', html);
console.log('Cleaned sizes:', fs.statSync('Index.html').size, '->', fs.statSync('Admin_Test.html').size);

