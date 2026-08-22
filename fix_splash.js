const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// Hide the splash screen permanently
html = html.replace('id="app-splash"', 'id="app-splash" style="display:none !important"');
// And just in case, hide the map loader
html = html.replace('id="map-loader"', 'id="map-loader" style="display:none !important"');

// Force Admin to show permanently, regardless of JS
html = html.replace('id="page-admin" class="page-overlay show"', 'id="page-admin" class="page-overlay show" style="display:flex !important; opacity:1 !important; z-index:99999;"');
// If it didn't have "show", do it
html = html.replace('id="page-admin">', 'id="page-admin" class="page-overlay show" style="display:flex !important; opacity:1 !important; z-index:99999;">');

fs.writeFileSync('Index.html', html, 'utf8');
console.log('Splash hidden and Admin forced!');
