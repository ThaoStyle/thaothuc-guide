const fs = require('fs');

function restoreToggle(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    const startIdx = js.indexOf('function toggleFilterMap(type, btn) {');
    const endMarker = '// -----------------------';
    let endIdx = js.indexOf(endMarker, startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        const correctToggle = `function toggleFilterMap(type, btn) {
    if(type === 'fav') {
        var isActive = btn.classList.contains('active');
        if (isActive) {
            btn.classList.remove('active');
            filterMap('all'); 
            var allPill = document.querySelector('.pill-scroll .pill:first-child');
            if (allPill) allPill.classList.add('active');
        } else {
            filterMap('fav', btn);
        }
    } else if(type === 'near') {
      if(typeof locateMe === 'function') locateMe();
    } else if(type === 'price') {
      btn.classList.toggle('active');
    }
  }
  `;
        js = js.substring(0, startIdx) + correctToggle + js.substring(endIdx);
        fs.writeFileSync(filePath, js, 'utf8');
        console.log('Restored toggleFilterMap in ' + filePath);
    }
}

restoreToggle('frontend/src/main.js');
restoreToggle('Index.html');
