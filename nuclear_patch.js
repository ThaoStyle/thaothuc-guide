const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

const nuclearCSS = `
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
      var splash = document.getElementById('app-splash');
      if(splash) splash.remove();
      var loader = document.getElementById('map-loader');
      if(loader) loader.remove();
      var admin = document.getElementById('page-admin');
      if(admin) admin.classList.add('show');
    } catch(e) {}
  });
</script>
`;

if (!html.includes('id="nuclear-css"')) {
  html = html.replace('</body>', '<div id="nuclear-css"></div>\n' + nuclearCSS + '\n</body>');
  fs.writeFileSync('Index.html', html, 'utf8');
  console.log('Nuclear patch applied successfully!');
} else {
  console.log('Nuclear patch already exists');
}
