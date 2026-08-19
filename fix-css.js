const fs = require('fs');

let css = fs.readFileSync('frontend/src/style.css', 'utf8');

css = css.replace('.sheet-filters { display: flex;', '.sheet-filters { flex-shrink: 0; display: flex;');
if(!css.includes('#mobile-list-gps-status { flex-shrink: 0; }')) {
    css += '\n#mobile-list-gps-status { flex-shrink: 0; }\n';
}

const favBtnCss = `
.sheet-fav-btn { position: absolute; top: 12px; right: 56px; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); border: 1px solid rgba(15,23,42,.08); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; z-index: 10; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.sheet-fav-btn.liked { color: #ef4444; }
.sheet-fav-btn.liked svg { fill: currentColor; }
.sheet-fav-btn svg { width: 18px; height: 18px; stroke-width: 2.5; stroke: currentColor; fill: none; transition: 0.2s; }
.sheet-fav-btn:active { transform: scale(0.85); }
`;
if(!css.includes('.sheet-fav-btn { position: absolute;')) {
    css += favBtnCss;
}

fs.writeFileSync('frontend/src/style.css', css, 'utf8');
console.log('Fixed CSS');
