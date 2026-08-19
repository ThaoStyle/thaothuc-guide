const fs = require('fs');
let main = fs.readFileSync('src/main.js', 'utf8');

const regex = /function renderHomeLatestCards\(\)\s*\{[\s\S]*?function initCarouselDots\(/;

const newFunc = `function renderHomeLatestCards(){
  var locContainer = document.getElementById('home-loc-cards');
  var recipeContainer = document.getElementById('home-recipe-cards');
  
  if(globalCarouselTimer) clearInterval(globalCarouselTimer);
  carouselInstances = [];

  const svgShield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>';
  const svgTag = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
  const svgSpark = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  
  const svgClock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
  const svgUser = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
  const svgFlame = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>';
  const svgBook = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';

  if(locContainer && typeof allLocs!=='undefined' && allLocs.length > 0){
      var validLocs = allLocs.filter(function(loc){ return loc.badge_type !== 'pending'; });
      var html = '';
      var count = Math.min(4, validLocs.length);
      for(var i=0; i<count; i++){
        var latestLoc = validLocs[validLocs.length - 1 - i];
        
        var badgeText = (latestLoc.badge_type === 'heritage') ? 'Thao Thức Heritage' : (latestLoc.badge_type === 'approved') ? 'Thao Thức Approved' : 'Thao Thức Spot';
        var iconHtml = svgShield;
        if(typeof WEBP_ICONS!=='undefined' && WEBP_ICONS[latestLoc.badge_type] && WEBP_ICONS[latestLoc.badge_type].length > 50){
           iconHtml = '<img src="' + WEBP_ICONS[latestLoc.badge_type] + '" alt="badge">';
        }

        var imgUrl = latestLoc.image_url || latestLoc.photo_url || CAT_IMAGES[latestLoc.category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
        
        html += '<div class="home-featured-card" onclick="openHomeCardLoc(\\''+latestLoc.id+'\\')">'
          + '<div class="hf-img-wrap"><img src="'+imgUrl+'" alt="Loc"/>'
          + (i===0 ? '<span class="hf-badge">MỚI REVIEW</span>' : '')
          + (latestLoc.price_range ? '<span class="hf-price-float">'+latestLoc.price_range+'</span>' : '')
          + '</div>'
          + '<div class="hf-body">'
          + '<div class="hf-title-row"><div class="hf-title">'+latestLoc.name+'</div></div>'
          + '<div class="hf-meta-row">'
          + '<span class="hf-rating">' + iconHtml + ' ' + badgeText + '</span>'
          + '<span class="hf-cat">' + svgTag + ' ' + (latestLoc.category||'Khác') + '</span>'
          + '</div>'
          + (latestLoc.must_try ? '<div class="hf-must-try">' + svgSpark + '<div><span>Món tủ:</span> ' + latestLoc.must_try + '</div></div>' : '<div style="flex:1"></div>')
          + '<button class="hf-btn">Khám phá ngay &rarr;</button>'
          + '</div></div>';
      }
      locContainer.innerHTML = html;
      if(typeof initCarouselDots === 'function') initCarouselDots('home-loc-cards', 'home-loc-dots', count);
  }

  if(recipeContainer && typeof RECIPES_DATA!=='undefined' && RECIPES_DATA.length > 0){
    var rhtml = '';
    var rcount = Math.min(4, RECIPES_DATA.length);
    var chibiImg = document.querySelector('.cook-hero-avatar img');
    var chibiSrc = chibiImg ? chibiImg.src : '';
    
    for(var j=0; j<rcount; j++){
      var latestRcp = RECIPES_DATA[RECIPES_DATA.length - 1 - j];
      var serving = latestRcp.servings || '2-3';
      
      rhtml += '<div class="home-featured-card" onclick="openRecipeDetail(\\''+latestRcp.id+'\\')">'
        + '<div class="hf-img-wrap"><img src="'+latestRcp.image+'" alt="Recipe"/>'
        + (j===0 ? '<span class="hf-badge" style="color:#059669;">MÓN MỚI LÊN SÓNG</span>' : '')
        + (chibiSrc ? '<div class="hf-avatar"><img src="'+chibiSrc+'" alt="Logo"/></div>' : '')
        + '</div>'
        + '<div class="hf-body">'
        + '<div class="hf-title-row"><div class="hf-title">'+latestRcp.name+'</div></div>'
        + '<div class="hf-rm-row">'
        + '<div class="hf-rm-item">' + svgClock + ' ' + latestRcp.time + '</div>'
        + '<div class="hf-rm-item">' + svgUser + ' ' + serving + ' ng</div>'
        + '<div class="hf-rm-item">' + svgFlame + ' ' + latestRcp.level + '</div>'
        + '</div>'
        + '<div class="hf-must-try">' + svgBook + ' <div>' + (latestRcp.category||'Cẩm nang nấu ăn chuẩn vị gia đình') + '</div></div>'
        + '<button class="hf-btn">Xem công thức &rarr;</button>'
        + '</div></div>';
    }
    recipeContainer.innerHTML = rhtml;
    if(typeof initCarouselDots === 'function') initCarouselDots('home-recipe-cards', 'home-recipe-dots', rcount);
  }
  
  startGlobalCarouselTimer();
}

function initCarouselDots(`;

if (regex.test(main)) {
  main = main.replace(regex, newFunc);
  fs.writeFileSync('src/main.js', main);
  console.log('JS Updated');
} else {
  console.log('JS Regex missed');
}
