const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');

// Replace "MÓN MỚI LÊN SÓNG" in main.js
js = js.replace(/'MÓN MỚI LÊN SÓNG'/g, "'CÔNG THỨC CHUẨN VỊ'");

// Add Fav functions
const favFunctions = `
// --- FAVORITES LOGIC ---
function getFavs() {
  try { return JSON.parse(localStorage.getItem('tt_favs')) || []; } catch(e) { return []; }
}
function isFav(id) {
  return getFavs().includes(String(id));
}
function toggleFav(e, id) {
  if(e) e.stopPropagation();
  var favs = getFavs();
  id = String(id);
  if(favs.includes(id)) {
    favs = favs.filter(function(x) { return x !== id; });
  } else {
    favs.push(id);
  }
  localStorage.setItem('tt_favs', JSON.stringify(favs));
  
  var btns = document.querySelectorAll('.heart-btn[data-id="'+id+'"]');
  btns.forEach(function(btn) {
    if(favs.includes(id)) {
      btn.classList.add('liked');
      var card = btn.closest('.desktop-loc-card') || btn.closest('.home-featured-card');
      if(card) card.classList.add('is-liked');
    } else {
      btn.classList.remove('liked');
      var card = btn.closest('.desktop-loc-card') || btn.closest('.home-featured-card');
      if(card) {
        card.classList.remove('is-liked');
        var favFilter = document.getElementById('btn-fav');
        if(favFilter && favFilter.classList.contains('active') && card.classList.contains('desktop-loc-card')) {
          card.style.display = 'none';
        }
      }
    }
  });
}

function toggleFilterMap(type, btn) {
  btn.classList.toggle('active');
  if(type === 'fav') {
    var isFavActive = btn.classList.contains('active');
    var allItems = document.querySelectorAll('.desktop-loc-card');
    allItems.forEach(function(item) {
      if (isFavActive) {
        if (item.classList.contains('is-liked')) item.style.display = 'flex';
        else item.style.display = 'none';
      } else {
        item.style.display = 'flex';
      }
    });
  } else if(type === 'near') {
    if(typeof locateMe === 'function') locateMe();
  } else if(type === 'price') {
    // Basic price toggle visual only for now
  }
}
// -----------------------
`;

if (!js.includes('toggleFilterMap')) {
  js = js.replace(/var allLocs\s*=\s*\[\];/, favFunctions + '\nvar allLocs = [];');
}

// Modify renderHomeLatestCards to include heart button
const hfCardMatch = `'<div class="home-featured-card" onclick="openHomeCardLoc(\\''+latestLoc.id+'\\')">'
          + '<div class="hf-img-wrap"><img src="'+imgUrl+'" alt="Loc"/>'`;

const hfCardReplace = `'<div class="home-featured-card '+(isFav(latestLoc.id)?'is-liked':'')+'" onclick="openHomeCardLoc(\\''+latestLoc.id+'\\')">'
          + '<div class="hf-img-wrap">'
          + '<div class="heart-btn '+(isFav(latestLoc.id)?'liked':'')+'" data-id="'+latestLoc.id+'" onclick="toggleFav(event, \\''+latestLoc.id+'\\')"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>'
          + '<img src="'+imgUrl+'" alt="Loc"/>'`;

js = js.replace(hfCardMatch, hfCardReplace);

// Modify renderMobileList to include heart button
const mobileCardMatch = `return '<div class="desktop-loc-card" style="position:relative;'+bgStyle+'" onclick="mobileListGoTo('+idx+')">'
      + rankHtml
      + thumb`;

const mobileCardReplace = `var likedClass = isFav(loc.id) ? 'is-liked' : '';
    var heartClass = isFav(loc.id) ? 'liked' : '';
    return '<div class="desktop-loc-card '+likedClass+'" style="position:relative;'+bgStyle+'" onclick="mobileListGoTo('+idx+')">'
      + rankHtml
      + '<div class="heart-btn '+heartClass+'" data-id="'+loc.id+'" onclick="toggleFav(event, \\''+loc.id+'\\')"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>'
      + thumb`;

js = js.replace(mobileCardMatch, mobileCardReplace);

fs.writeFileSync('src/main.js', js, 'utf8');
console.log('main.js modified for Hearts');
