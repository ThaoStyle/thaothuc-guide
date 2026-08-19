const fs = require('fs');
let js = fs.readFileSync('frontend/src/main.js', 'utf8');

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

if (!js.includes('function getFavs()')) {
  js = js.replace('function renderHomeLatestCards', favFunctions + '\nfunction renderHomeLatestCards');
  fs.writeFileSync('frontend/src/main.js', js, 'utf8');
  console.log('Fixed JS injection in frontend/src/main.js!');
} else {
  console.log('Already injected.');
}
