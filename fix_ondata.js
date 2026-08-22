const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// Patch onData
html = html.replace("document.getElementById('map-loader').classList.add('hidden');", "var ml = document.getElementById('map-loader'); if(ml) ml.classList.add('hidden');");

// Let's also make sure hideAppSplash doesn't crash
html = html.replace("var el = document.getElementById('app-splash');\n    el.style.opacity = 0;", "var el = document.getElementById('app-splash');\n    if(el) el.style.opacity = 0;");
html = html.replace("var el = document.getElementById('app-splash');\n    if(el) el.classList.add('hide');", "var el = document.getElementById('app-splash');\n    if(el) el.classList.add('hide');"); // Already has if(el) in some versions

// Wait, I should just make sure any document.getElementById in hideAppSplash is safe
// Actually, in nuclear patch I did:
// if(splash) splash.remove();
// if(loader) loader.remove();
// Instead of removing them, just hide them! That way JS won't crash when it looks for them.

let nuclearCSS = `
<style>
  #app-splash, #map-loader, .bottom-sheet, #mobile-list-sheet, .bottom-nav, #page-home, #page-cook, #map {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
  }
  #page-admin {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
    z-index: 9999999 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: #f8fafc !important;
  }
  body, html { overflow: auto !important; height: 100% !important; background: #f8fafc !important; }
</style>
<script>
  window.addEventListener('load', function() {
    try {
      var admin = document.getElementById('page-admin');
      if(admin) admin.classList.add('show');
    } catch(e) {}
  });
</script>
`;

// Replace the old nuclear CSS with the new one that DOES NOT remove DOM elements
html = html.replace(/<div id="nuclear-css"><\/div>[\s\S]*?<\/html>/, '<div id="nuclear-css"></div>\n' + nuclearCSS + '\n</body>\n</html>');

fs.writeFileSync('Index.html', html, 'utf8');
console.log('Fixed onData crash!');
