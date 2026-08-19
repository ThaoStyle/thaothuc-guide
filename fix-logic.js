const fs = require('fs');

function addLogic(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    // add to openSheet
    if (!js.includes('sh-fav-btn')) {
        const osTarget = `document.getElementById('sh-title').textContent = name;`;
        const osLogic = `
  var favBtn = document.getElementById('sh-fav-btn');
  if (favBtn) {
    if (isFav(loc.id)) favBtn.classList.add('liked');
    else favBtn.classList.remove('liked');
  }
`;
        js = js.replace(osTarget, osLogic + osTarget);
    }

    // add toggleFavLocSheet function
    if (!js.includes('function toggleFavLocSheet')) {
        const fun = `
window.toggleFavLocSheet = function() {
  if (!currentSheetLoc) return;
  toggleFav(null, currentSheetLoc.id);
  var favBtn = document.getElementById('sh-fav-btn');
  if (favBtn) {
    if (isFav(currentSheetLoc.id)) favBtn.classList.add('liked');
    else favBtn.classList.remove('liked');
  }
};
`;
        js += fun;
    }

    fs.writeFileSync(filePath, js, 'utf8');
    console.log('Added logic to ' + filePath);
}

addLogic('frontend/src/main.js');
addLogic('Index.html');
