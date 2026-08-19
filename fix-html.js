const fs = require('fs');

function addFavBtnToHtml(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const target = `<button class="sheet-share-btn" onclick="shareCurrentLocation()" title="Chia sẻ">`;
    const favBtn = `<button class="sheet-fav-btn" id="sh-fav-btn" onclick="toggleFavLocSheet()" title="Yêu thích">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        `;
    if (!html.includes('sh-fav-btn')) {
        html = html.replace(target, favBtn + target);
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('Added to ' + filePath);
    }
}

addFavBtnToHtml('frontend/index.html');
addFavBtnToHtml('Index.html');
