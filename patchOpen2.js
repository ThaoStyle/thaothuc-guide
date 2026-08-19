const fs = require('fs');

let indexHtml = fs.readFileSync('Index.html', 'utf8');
const mainJs = fs.readFileSync('frontend/src/main.js', 'utf8');

const startStr = 'function openRecipeDetail(id){';
const endStr = 'function doAdminUpdateRecipe(){'; // The next function after openRecipeDetail? Wait, let's check what's next.
