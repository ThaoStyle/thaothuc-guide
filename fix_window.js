const fs = require('fs');
let content = fs.readFileSync('frontend/src/main.js', 'utf8');
if (!content.includes('window.changeServings = changeServings')) {
    content = content.replace('window.openRecipeDetail = openRecipeDetail;', 'window.openRecipeDetail = openRecipeDetail;\n  window.changeServings = changeServings;');
    fs.writeFileSync('frontend/src/main.js', content, 'utf8');
    console.log('Added window.changeServings');
}
