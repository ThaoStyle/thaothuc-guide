const fs = require('fs');
let indexHtml = fs.readFileSync('Index.html', 'utf8');
const css = fs.readFileSync('frontend/src/style.css', 'utf8');

const styleStart = indexHtml.indexOf('<style>');
const styleEnd = indexHtml.indexOf('</style>', styleStart);

if (styleStart !== -1 && styleEnd !== -1) {
    indexHtml = indexHtml.substring(0, styleStart + 7) + '\n' + css + '\n' + indexHtml.substring(styleEnd);
    fs.writeFileSync('Index.html', indexHtml, 'utf8');
    console.log('Synced CSS in Index.html');
}
