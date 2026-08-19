const fs = require('fs');

function processFile(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    // 1. Remove heart-btn from renderMobileList
    const mRegex = /\s*\+\s*\'<div class="heart-btn \'\+heartClass\+\'" data-id="\'\+loc\.id\+\'" onclick="toggleFav\(event, \\\'\'\+loc\.id\+\'\\\'\)"><svg viewBox="0 0 24 24"><path d="M20\.84 4\.61a5\.5 5\.5 0 0 0-7\.78 0L12 5\.67l-1\.06-1\.06a5\.5 5\.5 0 0 0-7\.78 7\.78l1\.06 1\.06L12 21\.23l7\.78-7\.78 1\.06-1\.06a5\.5 5\.5 0 0 0 0-7\.78z"><\/path><\/svg><\/div>\'/;
    js = js.replace(mRegex, '');
    
    // Also remove the extra variables inside map
    js = js.replace(/var likedClass = isFav\(loc\.id\) \? 'is-liked' : '';\s*var heartClass = isFav\(loc\.id\) \? 'liked' : '';\s*/, '');
    js = js.replace(/<div class="desktop-loc-card '\+likedClass\+'"/g, '<div class="desktop-loc-card"');

    // 2. Remove heart-btn from renderHomeLatestCards
    const hRegex1 = /'<div class="home-featured-card '\+\(isFav\(latestLoc\.id\)\?'is-liked':''\)\+'" onclick="openHomeCardLoc\(\\\''\+latestLoc\.id\+\'\\\'\)">'/g;
    js = js.replace(hRegex1, '\'<div class="home-featured-card" onclick="openHomeCardLoc(\\\'\'\+latestLoc\.id\+\'\\\')">\'');
    
    const hRegex2 = /\s*\+\s*\'<div class="heart-btn \'\+\(isFav\(latestLoc\.id\)\?'liked':''\)\+'" data-id="\'\+latestLoc\.id\+\'" onclick="toggleFav\(event, \\\'\'\+latestLoc\.id\+\'\\\'\)"><svg viewBox="0 0 24 24"><path d="M20\.84 4\.61a5\.5 5\.5 0 0 0-7\.78 0L12 5\.67l-1\.06-1\.06a5\.5 5\.5 0 0 0-7\.78 7\.78l1\.06 1\.06L12 21\.23l7\.78-7\.78 1\.06-1\.06a5\.5 5\.5 0 0 0 0-7\.78z"><\/path><\/svg><\/div>\'/;
    js = js.replace(hRegex2, '');

    // 3. Modify toggleFav logic
    js = js.replace(/\.heart-btn\[data-id/g, '.sheet-fav-btn[data-id');

    fs.writeFileSync(filePath, js, 'utf8');
}

processFile('frontend/src/main.js');
processFile('Index.html');
console.log('Fixed JS injections');
