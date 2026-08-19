const fs = require('fs');

let html = fs.readFileSync('frontend/index.html', 'utf8');

const oldIngHtml = `<div style="font-size:15px;font-weight:900;color:var(--nv);margin-bottom:10px;">🥦 Nguyên Liệu Cần Có:</div>
      <div id="rcp-ing-list" style="display:flex;flex-direction:column;gap:8px;font-size:15px;color:var(--sl);font-weight:700;"></div>`;

const newIngHtml = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div style="font-size:15px;font-weight:900;color:var(--nv);display:flex;align-items:center;gap:6px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--or)" stroke-width="2" style="margin-top:-2px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Nguyên Liệu:
          </div>
          <div class="rcp-stepper">
              <button onclick="changeServings(-1)">-</button>
              <span id="servings-display">4 người</span>
              <button onclick="changeServings(1)">+</button>
          </div>
      </div>
      <div id="rcp-ing-list" style="display:flex;flex-direction:column;"></div>`;

if (!html.includes('id="servings-display"')) {
    html = html.replace(oldIngHtml, newIngHtml);
}

// Update the icons in the modal header
const oldHeaderIcon = `<span style="background:var(--or-light);color:var(--or);font-size:13px;font-weight:900;padding:4px 12px;border-radius:14px;" id="rcp-cat">🍳 Bếp Nhà</span>`;
const newHeaderIcon = `<span style="background:var(--or-light);color:var(--or);font-size:13px;font-weight:900;padding:4px 12px;border-radius:14px;display:flex;align-items:center;gap:4px;" id="rcp-cat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 10H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1zm-1.5-2a1 1 0 0 0 .5-.86v-1a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 6.14v1a1 1 0 0 0 .5.86h15z"/></svg> Bếp Nhà
        </span>`;
if (html.includes(oldHeaderIcon)) {
    html = html.replace(oldHeaderIcon, newHeaderIcon);
}

const oldStepsTitle = `<div style="font-size:15px;font-weight:900;color:var(--nv);margin-bottom:10px;">🍳 Các Bước Thực Hiện:</div>`;
const newStepsTitle = `<div style="font-size:15px;font-weight:900;color:var(--nv);margin-bottom:16px;display:flex;align-items:center;gap:6px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--or)" stroke-width="2" style="margin-top:-2px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> Các Bước Thực Hiện:
      </div>`;
if (html.includes(oldStepsTitle)) {
    html = html.replace(oldStepsTitle, newStepsTitle);
}

const oldVidBtn = `🎬 Xem Video Nấu (Chồng Cook Vợ Look)`;
const newVidBtn = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Xem Video Nấu Ăn`;
if (html.includes(oldVidBtn)) {
    html = html.replace(oldVidBtn, newVidBtn);
}

const oldShareBtn = `<button class="rcp-share-btn" onclick="shareCurrentRecipe()" title="Chia sẻ">
            <svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L7.05 9.81C6.5 9.31 5.79 9 5 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.05-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
          </button>`;
const newShareBtn = `<button class="rcp-share-btn" onclick="shareCurrentRecipe()" title="Chia sẻ">
            <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;width:18px;height:18px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>`;
if (html.includes(oldShareBtn)) {
    html = html.replace(oldShareBtn, newShareBtn);
}

const oldCloseBtn = `<button class="sheet-close" onclick="closeModal('m-recipe-detail')">✕</button>`;
const newCloseBtn = `<button class="sheet-close" onclick="closeModal('m-recipe-detail')">
            <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;width:18px;height:18px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>`;
if (html.includes(oldCloseBtn)) {
    html = html.replace(oldCloseBtn, newCloseBtn);
}

// Add admin fields for default servings
const oldAdminAdd = `<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò...&#10;1kg bún..."></textarea>`;
const newAdminAdd = `<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò...&#10;1kg bún..."></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="ar-servings" placeholder="Ví dụ: 4" value="4"/>`;
if (html.includes(oldAdminAdd)) {
    html = html.replace(oldAdminAdd, newAdminAdd);
}

const oldAdminEdit = `<textarea class="input-box" id="ae-ing" rows="4"></textarea>`;
const newAdminEdit = `<textarea class="input-box" id="ae-ing" rows="4"></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="ae-servings" placeholder="Ví dụ: 4"/>`;
if (html.includes(oldAdminEdit)) {
    html = html.replace(oldAdminEdit, newAdminEdit);
}

fs.writeFileSync('frontend/index.html', html, 'utf8');
console.log('Patched frontend/index.html');
