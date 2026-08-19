const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');

const regex = /return '<div class="desktop-loc-card" style="position:relative;'\+bgStyle\+'" onclick="mobileListGoTo\('\+idx\+'\)">'[\s\S]*?\+ rankHtml[\s\S]*?\+ thumb/;

const replaceStr = `var likedClass = isFav(loc.id) ? 'is-liked' : '';
    var heartClass = isFav(loc.id) ? 'liked' : '';
    return '<div class="desktop-loc-card '+likedClass+'" style="position:relative;'+bgStyle+'" onclick="mobileListGoTo('+idx+')">'
      + rankHtml
      + '<div class="heart-btn '+heartClass+'" data-id="'+loc.id+'" onclick="toggleFav(event, \\''+loc.id+'\\')"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>'
      + thumb`;

if(regex.test(js)) {
  js = js.replace(regex, replaceStr);
  fs.writeFileSync('src/main.js', js, 'utf8');
  console.log('Mobile cards replaced!');
} else {
  console.log('Match string not found.');
}
