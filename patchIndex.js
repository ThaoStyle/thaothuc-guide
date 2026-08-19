const fs = require('fs');

let indexHtml = fs.readFileSync('Index.html', 'utf8');

// 1. UPDATE CSS
const newCss = `
/* --- RECIPE DYNAMIC SCALING CSS --- */
.rcp-stepper {
  display: flex; align-items: center; background: #fff;
  border: 1.5px solid rgba(15,23,42,0.1); border-radius: 999px;
  padding: 3px; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.rcp-stepper button {
  width: 26px; height: 26px; border-radius: 50%; border: none;
  background: var(--or-light); color: var(--or); font-size: 16px; font-weight: 900;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform 0.1s, background 0.1s;
}
.rcp-stepper button:active { transform: scale(0.9); background: var(--or); color: #fff; }
.rcp-stepper span { font-size: 13px; font-weight: 800; color: var(--nv); min-width: 58px; text-align: center; }

.rcp-ingred-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--nv); font-weight: 600; margin-bottom: 12px; cursor: pointer;}
.rcp-ingred-item input { margin-top: 2px; accent-color: var(--or); width: 16px; height: 16px; flex-shrink: 0; }
.rcp-ingred-name { flex: 1; line-height: 1.4; }
.ing-qty { font-weight: 800; color: var(--or); transition: color 0.3s ease; }
.changed { animation: flashOrange 0.6s ease-out; }
@keyframes flashOrange { 0% { color: var(--nv); transform: scale(1.1); } 100% { color: var(--or); transform: scale(1); } }
/* ---------------------------------- */
`;
if (!indexHtml.includes('.rcp-stepper')) {
    indexHtml = indexHtml.replace('</style>', newCss + '\n</style>');
}

// 2. UPDATE HTML (Recipe Modal)
const modalStart = indexHtml.indexOf('<div class="modal-backdrop" id="m-recipe-detail"');
const modalEnd = indexHtml.indexOf('<!--', modalStart);

const newModalHtml = `<div class="modal-backdrop" id="m-recipe-detail" onclick="if(event.target===this)closeModal('m-recipe-detail')">
    <div class="modal-card">
      <div class="modal-bar"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <span style="background:var(--or-light);color:var(--or);font-size:13px;font-weight:900;padding:4px 12px;border-radius:14px;display:flex;align-items:center;gap:4px;" id="rcp-cat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 10H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1zm-1.5-2a1 1 0 0 0 .5-.86v-1a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 6.14v1a1 1 0 0 0 .5.86h15z"/></svg> Bếp Nhà
        </span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="rcp-share-btn" onclick="shareCurrentRecipe()" title="Chia sẻ">
            <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;width:18px;height:18px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>
          <button class="sheet-close" onclick="closeModal('m-recipe-detail')" title="Đóng">
            <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;width:18px;height:18px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      
      <div class="modal-h2" id="rcp-title">Tên Công Thức</div>
      <div class="modal-p" id="rcp-meta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 45 phút &bull; 
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z"></path><path d="M19.914 10H4.086A2 2 0 0 0 2 12v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2.086-2z"></path><path d="M15 10V7a3 3 0 0 0-6 0v3"></path></svg> Dễ nấu
      </div>

      <div style="background:var(--bg);border:2px solid var(--bd-soft);border-radius:20px;padding:18px;margin-bottom:20px;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div style="font-size:15px;font-weight:900;color:var(--nv);display:flex;align-items:center;gap:6px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--or)" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Nguyên Liệu Cần Có:
            </div>
            <div class="rcp-stepper">
                <button onclick="changeServings(-1)">-</button>
                <span id="servings-display">4 người</span>
                <button onclick="changeServings(1)">+</button>
            </div>
        </div>

        <div id="rcp-ing-list" style="display:flex;flex-direction:column;">
        </div>
      </div>

      <div style="font-size:15px;font-weight:900;color:var(--nv);margin-bottom:16px;display:flex;align-items:center;gap:6px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--or)" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> Các Bước Thực Hiện:
      </div>
      
      <div id="rcp-steps-list" class="rcp-step-list">
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;">
        <a href="#" target="_blank" id="btn-rcp-video" class="btn-submit" style="background:var(--or);margin-top:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Xem Video Nấu Ăn
        </a>
      </div>
    </div>
  </div>\n  `;

indexHtml = indexHtml.substring(0, modalStart) + newModalHtml + indexHtml.substring(modalEnd);

// 3. UPDATE Admin Add HTML
const arRegex = /<textarea class="input-box" id="ar-ing" rows="4" [^>]+><\/textarea>/;
const arNew = `<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò...&#10;1kg bún..."></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="ar-servings" placeholder="Ví dụ: 4" value="4"/>`;
if (arRegex.test(indexHtml)) { indexHtml = indexHtml.replace(arRegex, arNew); }

// 4. UPDATE Admin Edit HTML
const erRegex = /<textarea class="input-box" id="er-ing" rows="4"><\/textarea>/;
const erNew = `<textarea class="input-box" id="er-ing" rows="4"></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="er-servings" placeholder="Ví dụ: 4"/>`;
if (erRegex.test(indexHtml)) { indexHtml = indexHtml.replace(erRegex, erNew); }

// 5. COPY JS updates from frontend/src/main.js to Index.html
const mainJs = fs.readFileSync('frontend/src/main.js', 'utf8');

// I will just replace the WHOLE script tag in Index.html with the content of main.js to make it perfectly sync!
// Because the user usually syncs them or I should sync them now to be sure they match exactly.
const scriptStart = indexHtml.indexOf('<script>');
const scriptEnd = indexHtml.indexOf('</script>', scriptStart);
if (scriptStart !== -1 && scriptEnd !== -1) {
    indexHtml = indexHtml.substring(0, scriptStart + 8) + '\n' + mainJs + '\n' + indexHtml.substring(scriptEnd);
}

fs.writeFileSync('Index.html', indexHtml, 'utf8');
console.log('Patched Index.html completely!');
