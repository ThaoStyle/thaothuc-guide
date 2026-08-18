const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

css = css.replace(/body\.desktop-mode #admin-loc-container, body\.desktop-mode #admin-rcp-container, body\.desktop-mode #admin-sug-container \{[\s\S]*?\}/, '');

let start = css.indexOf('/* ADMIN PAGE */');
if (start !== -1) {
    let endStr = '.admin-page-info { font-size:14px; font-weight:700; color:var(--nv); }';
    let end = css.indexOf(endStr, start);
    if(end !== -1) {
        css = css.substring(0, start) + css.substring(end + endStr.length);
    } else {
        // try finding end with regex
        css = css.replace(/\/\* ADMIN PAGE \*\/[\s\S]*?\.admin-page-info\s*\{[^}]*\}/, '');
    }
}

css = css.replace(/#page-admin \.page-container \{ padding-bottom: 110px; \}/g, '');

fs.writeFileSync('src/style.css', css, 'utf8');
console.log('style.css cleaned');
