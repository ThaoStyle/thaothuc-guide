const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const filterHTML = `
    <div class="sheet-filters">
      <div class="s-filter-btn" id="btn-near" onclick="toggleFilterMap('near', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        Gần tôi
      </div>
      <div class="s-filter-btn" id="btn-price" onclick="toggleFilterMap('price', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        Giá tiền
      </div>
      <div class="s-filter-btn" id="btn-fav" onclick="toggleFilterMap('fav', this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Yêu thích
      </div>
    </div>`;

html = html.replace('<div class="sheet-content" id="mobile-list-content"></div>', filterHTML + '\n    <div class="sheet-content" id="mobile-list-content"></div>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Filters injected into index.html');
