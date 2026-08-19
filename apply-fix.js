const fs = require('fs');
let js = fs.readFileSync('frontend/src/main.js', 'utf8');

// 1. Update toggleFilterMap
const startToggle = js.indexOf("} else if(type === 'near') {");
const endToggle = js.indexOf("} else if(type === 'price') {", startToggle);
if (startToggle !== -1 && endToggle !== -1) {
    const newToggleNear = `} else if(type === 'near') {
        var isActive = btn.classList.contains('active');
        if (isActive) {
            btn.classList.remove('active');
            filterMap('all'); 
            var allPill = document.querySelector('.pill-scroll .pill:first-child');
            if (allPill) allPill.classList.add('active');
        } else {
            // Provide immediate feedback
            document.querySelectorAll('.pill, .s-filter-btn').forEach(function(b){b.classList.remove('active');});
            btn.classList.add('active');
            
            if (typeof userMarker !== 'undefined' && userMarker) {
                filterMap('near', btn);
            } else {
                activeFilter = 'near';
                if(typeof locateMe === 'function') locateMe();
            }
        }
    `;
    js = js.substring(0, startToggle) + newToggleNear + js.substring(endToggle);
}

// 2. Update filterMap logic for 'near'
const startFilter = js.indexOf("}else if(f==='all'){");
if (startFilter !== -1 && !js.includes("}else if(f==='near'){")) {
    const newFilterNear = `}else if(f==='near'){
    if (typeof userMarker !== 'undefined' && userMarker) {
      var uLat = userMarker.getLatLng().lat;
      var uLng = userMarker.getLatLng().lng;
      filtered = allLocs.filter(function(l) {
        var c = parseCoord(l.lat, l.lng);
        if(c.lat && c.lng) {
          var dist = haversineDistanceKm(uLat, uLng, c.lat, c.lng);
          return dist <= 5.0;
        }
        return false;
      });
    } else {
      filtered = allLocs;
    }
  }else if(f==='all'){`;
    js = js.substring(0, startFilter) + newFilterNear + js.substring(startFilter + "}else if(f==='all'){".length);
}

// 3. Update locateMe callback to filter map properly if activeFilter is 'near'
// wait, locateMe already calls filterMap(activeFilter, null, true).
// If activeFilter is 'near', filterMap('near') will now execute the < 5km logic!
// Let's just make sure it also sets the button active state.
const locateEndStr = "filterMap(activeFilter, null, true);";
if (js.includes(locateEndStr)) {
    js = js.replace(locateEndStr, `if (activeFilter === 'near') { var nBtn = document.getElementById('btn-near'); if(nBtn) nBtn.classList.add('active'); }\n        filterMap(activeFilter, null, true);`);
}

fs.writeFileSync('frontend/src/main.js', js, 'utf8');
fs.writeFileSync('Index.html', js, 'utf8'); // Sync to Admin
console.log('Fixed near logic completely');
