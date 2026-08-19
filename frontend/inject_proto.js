const fs = require('fs');
let mainJs = fs.readFileSync('src/main.js', 'utf8');

// Inject prototype logic at the beginning of initCategories
const prototypeLogic = 
  // PROTOTYPE UI OVERRIDE: ?variant=prototype
  var urlParams = new URLSearchParams(window.location.search);
  var variant = urlParams.get('variant');
  if (variant === 'prototype') {
    // 1. Remove ranking categories
    CATEGORIES = CATEGORIES.filter(function(c) {
      return ['heritage', 'approved', 'spot', 'pending'].indexOf(c.special) === -1;
    });
    // 2. Inject CSS fix for filter-pills clipping
    var style = document.createElement('style');
    style.innerHTML = \
      body.desktop-mode .filter-pills { left: calc(420px + 16px + 16px) !important; padding: 4px 16px !important; }
      .filter-pills { left: 0 !important; right: 0 !important; padding: 4px 16px !important; }
      .filter-pills::after { content: ""; display: block; min-width: 8px; padding-right: 8px; }
      
      /* Prototype Floating Switcher */
      .proto-switcher {
        position: fixed; bottom: 120px; left: 50%; transform: translateX(-50%); z-index: 9999;
        background: #1e293b; color: white; padding: 8px 16px; border-radius: 24px;
        font-size: 13px; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        display: flex; gap: 12px; align-items: center;
      }
      .proto-switcher a { color: #38bdf8; text-decoration: none; }
    \;
    document.head.appendChild(style);
    
    // 3. Inject switcher UI
    window.addEventListener('DOMContentLoaded', function(){
      var switcher = document.createElement('div');
      switcher.className = 'proto-switcher';
      switcher.innerHTML = '<span>Variant: Prototype</span> <a href="?variant=original">Back to Original</a>';
      document.body.appendChild(switcher);
    });
  } else if (variant === 'original') {
    window.addEventListener('DOMContentLoaded', function(){
      var switcher = document.createElement('div');
      switcher.className = 'proto-switcher';
      switcher.innerHTML = '<span>Variant: Original</span> <a href="?variant=prototype">Try Prototype</a>';
      document.body.appendChild(switcher);
    });
  }
;

mainJs = mainJs.replace('function initCategories(){', 'function initCategories(){\n' + prototypeLogic);
fs.writeFileSync('src/main.js', mainJs, 'utf8');
console.log('Prototype injected!');
