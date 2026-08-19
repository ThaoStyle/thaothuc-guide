const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');
css = css.replace('left:10px;right:10px;z-index:390;', 'left:0;right:0;z-index:390;');
css = css.replace('padding:4px 0;', 'padding:4px 16px;');
css = css + '\n.filter-pills::after { content: `; display: block; min-width: 8px; }\n';
fs.writeFileSync('src/style.css', css, 'utf8');

let main = fs.readFileSync('src/main.js', 'utf8');
main = main.replace(/\{ key: 'heritage',.*?\},/g, '');
main = main.replace(/\{ key: 'approved',.*?\},/g, '');
main = main.replace(/\{ key: 'spot',.*?\},/g, '');
main = main.replace(/\{ key: 'pending',.*?\},/g, '');
fs.writeFileSync('src/main.js', main, 'utf8');
console.log('Done!');

