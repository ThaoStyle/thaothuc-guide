const fs = require('fs');

let indexHtml = fs.readFileSync('Index.html', 'utf8');
const mainJs = fs.readFileSync('frontend/src/main.js', 'utf8');

const oldOpenRegex = /function openRecipeDetail\(id\)\{[\s\S]*?vidBtn\.style\.display = 'none';\s*\}\s*\}/m;
const newOpenMatch = mainJs.match(/function openRecipeDetail\(id\)\{[\s\S]*?vidBtn\.style\.display = 'none';\s*\}\s*\}/m);

if (oldOpenRegex.test(indexHtml) && newOpenMatch) {
    indexHtml = indexHtml.replace(oldOpenRegex, newOpenMatch[0]);
    fs.writeFileSync('Index.html', indexHtml, 'utf8');
    console.log('Patched openRecipeDetail successfully');
} else {
    console.log('Regex fail');
}

