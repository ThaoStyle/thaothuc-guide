const fs = require('fs');
let main = fs.readFileSync('src/main.js', 'utf8');
let before = 'if(locContainer && typeof allLocs!==\\'undefined\\' && allLocs.length > 0){\r\n      var html = \\'\\';\r\n      var count = Math.min(4, allLocs.length);\r\n      for(var i=0; i<count; i++){\r\n        var latestLoc = allLocs[allLocs.length - 1 - i];';
let after = 'if(locContainer && typeof allLocs!==\\'undefined\\' && allLocs.length > 0){\n      var validLocs = allLocs.filter(function(loc){ return loc.badge_type !== \\'pending\\'; });\n      var html = \\'\\';\n      var count = Math.min(4, validLocs.length);\n      for(var i=0; i<count; i++){\n        var latestLoc = validLocs[validLocs.length - 1 - i];';
main = main.replace(before, after);
before = before.replace(/\r\n/g, '\n');
main = main.replace(before, after);
fs.writeFileSync('src/main.js', main, 'utf8');
console.log('Done!');

