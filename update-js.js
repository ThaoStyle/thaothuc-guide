const fs = require('fs');

function fixJs(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    // 1. Export toggleFilterMap to window
    if (!js.includes('window.toggleFilterMap = toggleFilterMap;')) {
        js = js.replace('window.toggleFavLocSheet = function() {', 'window.toggleFilterMap = toggleFilterMap;\nwindow.toggleFavLocSheet = function() {');
    }

    // 2. Update toggleFilterMap to handle 'near' filtering
    const oldToggle = `} else if(type === 'near') {
        if(typeof locateMe === 'function') locateMe();
      } else if(type === 'price') {
        btn.classList.toggle('active');
      }`;
    
    const newToggle = `} else if(type === 'near') {
          var isActive = btn.classList.contains('active');
          if (isActive) {
              btn.classList.remove('active');
              filterMap('all'); 
              var allPill = document.querySelector('.pill-scroll .pill:first-child');
              if (allPill) allPill.classList.add('active');
          } else {
              if (typeof userMarker !== 'undefined' && userMarker) {
                  filterMap('near', btn);
              } else {
                  activeFilter = 'near';
                  if(typeof locateMe === 'function') locateMe();
              }
          }
      } else if(type === 'price') {
        btn.classList.toggle('active');
      }`;
    
    js = js.replace(oldToggle, newToggle);

    // 3. Update filterMap to handle 'near'
    const filterBlock = `if(f==='fav') {
      filtered = allLocs.filter(function(l) { return isFav(l.id); });
    }else if(f==='all'){`;

    const newFilterBlock = `if(f==='fav') {
      filtered = allLocs.filter(function(l) { return isFav(l.id); });
    }else if(f==='near'){
      if (typeof userMarker !== 'undefined' && userMarker) {
        var uLat = userMarker.getLatLng().lat;
        var uLng = userMarker.getLatLng().lng;
        filtered = allLocs.filter(function(l) {
          var c = parseCoord(l.lat, l.lng);
          if(c.lat && c.lng) {
            var dist = haversineDistanceKm(uLat, uLng, c.lat, c.lng);
            return dist <= 5.0; // Filter < 5km
          }
          return false;
        });
      } else {
        filtered = allLocs;
      }
    }else if(f==='all'){`;

    js = js.replace(filterBlock, newFilterBlock);

    // Also fix the case where locateMe completes and needs to update the button UI
    const locateMeEnd = `filterMap(activeFilter, null, true); // c`;
    const newLocateMeEnd = `if (activeFilter === 'near') { var nBtn = document.getElementById('btn-near'); if(nBtn) nBtn.classList.add('active'); }
        filterMap(activeFilter, null, true); // c`;
    js = js.replace(locateMeEnd, newLocateMeEnd);

    fs.writeFileSync(filePath, js, 'utf8');
}

fixJs('frontend/src/main.js');
console.log('Fixed JS bindings and near logic');
