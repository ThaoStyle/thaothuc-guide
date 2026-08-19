const fs = require('fs');

function fixFilter(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    const targetFilterMap = `  if(f==='all'){`;
    const newFilterMap = `  if(f==='fav') {
    filtered = allLocs.filter(function(l) { return isFav(l.id); });
  }else if(f==='all'){`;

    if (!js.includes(`if(f==='fav') {`)) {
        js = js.replace(targetFilterMap, newFilterMap);
    }

    const targetToggleFilter = `function toggleFilterMap(type, btn) {`;
    const newToggleFilter = `function toggleFilterMap(type, btn) {
    if(type === 'fav') {
        var isActive = btn.classList.contains('active');
        if (isActive) {
            btn.classList.remove('active');
            filterMap('all'); 
            // restore active pill to 'Tất cả' or whatever
            var allPill = document.querySelector('.pill-scroll .pill:first-child');
            if (allPill) allPill.classList.add('active');
        } else {
            filterMap('fav', btn);
        }
        return;
    }
`;
    if (!js.includes(`filterMap('fav', btn);`)) {
        js = js.replace(targetToggleFilter, newToggleFilter);
        // comment out the old if(type === 'fav') block? Yes.
        js = js.replace(/if\(type === 'fav'\) \{[\s\S]*?\} else if\(type === 'near'\) \{/, `if(type === 'near') {`);
    }

    fs.writeFileSync(filePath, js, 'utf8');
}

fixFilter('frontend/src/main.js');
fixFilter('Index.html');
console.log('Fixed Filter Map Logic');
