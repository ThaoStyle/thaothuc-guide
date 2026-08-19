const fs = require('fs');

let html = fs.readFileSync('frontend/index.html', 'utf8');

// 1. Update ingredient list html
const oldIngRegex = /<div style="font-size:15px;font-weight:900;color:var\(--nv\);margin-bottom:10px;">.*?Nguyên Liệu Cần Có:<\/div>\s*<div id="rcp-ing-list" style="display:flex;flex-direction:column;gap:8px;font-size:15px;color:var\(--sl\);font-weight:700;"><\/div>/ms;
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

if (oldIngRegex.test(html)) {
    html = html.replace(oldIngRegex, newIngHtml);
} else {
    console.log('Ing regex did not match');
}

// 2. Add servings to Admin Add
const oldAdminAddRegex = /<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò\.\.\.&#10;1kg bún\.\.\."><\/textarea>/;
const newAdminAdd = `<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò...&#10;1kg bún..."></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="ar-servings" placeholder="Ví dụ: 4" value="4"/>`;
if (oldAdminAddRegex.test(html)) {
    html = html.replace(oldAdminAddRegex, newAdminAdd);
} else {
    console.log('AdminAdd regex did not match');
}

// 3. Add servings to Admin Edit
const oldAdminEditRegex = /<textarea class="input-box" id="er-ing" rows="4"><\/textarea>/;
const newAdminEdit = `<textarea class="input-box" id="er-ing" rows="4"></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="er-servings" placeholder="Ví dụ: 4"/>`;
if (oldAdminEditRegex.test(html)) {
    html = html.replace(oldAdminEditRegex, newAdminEdit);
} else {
    console.log('AdminEdit regex did not match');
}

fs.writeFileSync('frontend/index.html', html, 'utf8');
console.log('Patched frontend/index.html via patch2b');
