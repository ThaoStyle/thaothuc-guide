const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace map search placeholder
html = html.replace('placeholder="Tìm quán ăn, bún, phở..." id="map-search-input"', 'placeholder="Tìm quán ngon gần đây" id="map-search-input"');

// Replace Home titles
html = html.replace('Khám Phá Bản Đồ Ăn Ngay →', 'Khám Phá Quán Ngon Gần Bạn →');
html = html.replace('QUÁN NGON CẬP NHẬT', 'TOẠ ĐỘ MỚI NHẤT');
html = html.replace('MÓN MỚI LÊN SÓNG', 'CÔNG THỨC CHUẨN VỊ');
html = html.replace('🌐 MẠNG XÃ HỘI', 'KÊNH CỦA THAO THỨC');

// Replace Footer socials
html = html.replace(/<div class="h-social-grid">[\s\S]*?<\/div>/, `<div class="h-social-grid" style="display:flex; justify-content:center; gap:16px;">
        <a href="https://www.facebook.com/share/1BYD3k3Xk2/" target="_blank" class="social-icon" style="width:44px; height:44px; border-radius:50%; background:rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:center; color:var(--nv); border:1px solid rgba(15,23,42,0.1);">
          <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke-width:2.5; fill:none; stroke:currentColor;"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href="https://www.tiktok.com/@thaothucdian" target="_blank" class="social-icon" style="width:44px; height:44px; border-radius:50%; background:rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:center; color:var(--nv); border:1px solid rgba(15,23,42,0.1);">
          <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke-width:2.5; fill:none; stroke:currentColor;"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        </a>
        <a href="https://youtube.com/@thaothucdian" target="_blank" class="social-icon" style="width:44px; height:44px; border-radius:50%; background:rgba(15,23,42,0.05); display:flex; align-items:center; justify-content:center; color:var(--nv); border:1px solid rgba(15,23,42,0.1);">
          <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke-width:2.5; fill:none; stroke:currentColor;"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon></svg>
        </a>
      </div>`);

// Replace Cook Banner text
html = html.replace(/<div class="cook-hero-sub">Cẩm nang nấu ăn chuẩn vị gia đình 🍲 Bí quyết đứng bếp mượt mà<\/div>/, `<div class="cook-desc" style="font-size: 13px; line-height: 1.5; opacity: 0.95; font-weight: 400;">
              Chia sẻ công thức và cách nấu 1001 món ăn đến từ niềm đam mê ẩm thực bất tận.<br>
              <span class="cook-desc-bold" style="font-weight: 700; font-size: 14px; margin-top: 8px; display: block; color: #ffedd5;">Giữ lửa gia đình từ căn bếp nhỏ.</span>
            </div>`);

// Write back
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');
