const fs = require('fs');

function fixCss(filePath) {
    let css = fs.readFileSync(filePath, 'utf8');

    // 1. Move fav button to bottom right
    css = css.replace('.sheet-fav-btn { position: absolute; top: 12px; right: 56px;', 
                      '.sheet-fav-btn { position: absolute; bottom: 12px; right: 12px;');

    // 2. Fix sheet-filters spacing
    css = css.replace('.sheet-filters { flex-shrink: 0; display: flex; gap: 8px; padding: 0 20px 16px 20px;', 
                      '.sheet-filters { flex-shrink: 0; display: flex; gap: 8px; padding: 12px 20px 16px 20px;');

    fs.writeFileSync(filePath, css, 'utf8');
}

fixCss('frontend/src/style.css');
console.log('Fixed CSS spacing and button position');
