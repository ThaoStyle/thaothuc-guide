const fs = require('fs');

function patchFile(filepath) {
  let html = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  // 1. Ingredients Header & Stepper
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
      changed = true;
  }

  // 2. Admin Add Servings
  const arRegex = /<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò\.\.\.&#10;1kg bún\.\.\."><\/textarea>/s;
  const arNew = `<textarea class="input-box" id="ar-ing" rows="4" placeholder="500g bắp bò...&#10;1kg bún..."></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="ar-servings" placeholder="Ví dụ: 4" value="4"/>`;
  if (arRegex.test(html)) {
      html = html.replace(arRegex, arNew);
      changed = true;
  }

  // 3. Admin Edit Servings
  const erRegex = /<textarea class="input-box" id="er-ing" rows="4"><\/textarea>/s;
  const erNew = `<textarea class="input-box" id="er-ing" rows="4"></textarea>
          <div style="font-size:13px;font-weight:700;color:var(--nv);margin:10px 0 6px;">Khẩu phần mặc định (Số người)</div>
          <input type="number" class="input-box" id="er-servings" placeholder="Ví dụ: 4"/>`;
  if (erRegex.test(html)) {
      html = html.replace(erRegex, erNew);
      changed = true;
  }

  // 4. Update Header Icon
  const oldHeaderIcon = `<span style="background:var(--or-light);color:var(--or);font-size:13px;font-weight:900;padding:4px 12px;border-radius:14px;" id="rcp-cat">🍳 Bếp Nhà</span>`;
  const newHeaderIcon = `<span style="background:var(--or-light);color:var(--or);font-size:13px;font-weight:900;padding:4px 12px;border-radius:14px;display:flex;align-items:center;gap:4px;" id="rcp-cat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 10H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1zm-1.5-2a1 1 0 0 0 .5-.86v-1a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 6.14v1a1 1 0 0 0 .5.86h15z"/></svg> Bếp Nhà
        </span>`;
  html = html.replace(oldHeaderIcon, newHeaderIcon);

  // 5. Update Steps Title
  const oldStepsTitle = `<div style="font-size:15px;font-weight:900;color:var(--nv);margin-bottom:10px;">🍳 Các Bước Thực Hiện:</div>`;
  const newStepsTitle = `<div style="font-size:15px;font-weight:900;color:var(--nv);margin-bottom:16px;display:flex;align-items:center;gap:6px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--or)" stroke-width="2" style="margin-top:-2px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> Các Bước Thực Hiện:
      </div>`;
  html = html.replace(oldStepsTitle, newStepsTitle);

  // 6. Update Video Button
  const oldVidBtn = `🎬 Xem Video Nấu (Chồng Cook Vợ Look)`;
  const newVidBtn = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Xem Video Nấu Ăn`;
  html = html.replace(oldVidBtn, newVidBtn);

  if (changed) {
    fs.writeFileSync(filepath, html, 'utf8');
    console.log('Patched ' + filepath);
  } else {
    console.log('No matches found in ' + filepath);
  }
}

patchFile('Index.html');
patchFile('frontend/index.html');
