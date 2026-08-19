const fs = require('fs');
const html = fs.readFileSync('Index.html', 'utf8');
console.log('toggleFilterMap?', html.includes('toggleFilterMap'));
console.log('allLocs?', html.includes('var allLocs'));
console.log('getFavs?', html.includes('function getFavs'));
