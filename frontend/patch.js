const fs = require('fs');
let main = fs.readFileSync('src/main.js', 'utf8');

let target = 'if(locContainer && typeof allLocs!==\\'undefined\\' && allLocs.length > 0){\\n      var html = \\'\\';\\n      var count = Math.min(4, allLocs.length);\\n      for(var i=0; i<count; i++){\\n        var latestLoc = allLocs[allLocs.length - 1 - i];';

let replacement = 'if(locContainer && typeof allLocs!==\\'undefined\\' && allLocs.length > 0){\\n      var validLocs = allLocs.filter(function(loc){ return loc.badge_type !== \\'pending\\'; });\\n      var html = \\'\\';\\n      var count = Math.min(4, validLocs.length);\\n      for(var i=0; i<count; i++){\\n        var latestLoc = validLocs[validLocs.length - 1 - i];';

if (main.includes('var count = Math.min(4, allLocs.length);')) {
    main = main.replace(target, replacement);
    fs.writeFileSync('src/main.js', main, 'utf8');
    console.log('Successfully injected validLocs logic!');
} else {
    console.log('Target string not found, doing fallback replace...');
    // Fallback regex
    let fbRegex = /if\(locContainer && typeof allLocs!=='undefined' && allLocs\.length > 0\)\s*\{\s*var html = '';\s*var count = Math\.min\(4, allLocs\.length\);\s*for\(var i=0; i<count; i\+\+\)\s*\{\s*var latestLoc = allLocs\[allLocs\.length - 1 - i\];/;
    main = main.replace(fbRegex, replacement);
    fs.writeFileSync('src/main.js', main, 'utf8');
    console.log('Fallback replace applied!');
}

