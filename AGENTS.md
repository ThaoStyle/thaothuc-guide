# 🗺️ Thao Thức Guide — Project Standard Operating Manual (AGENTS.md)

> **MỤC ĐÍCH**: File này cung cấp toàn bộ ngữ cảnh dự án, kiến trúc hệ thống, quy trình vận hành và nguyên tắc phát triển cho AI Assistant và Developers.

---

## 🎯 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

* **Tên ứng dụng**: **Thao Thức Guide**
* **Mục đích**: Cẩm nang ẩm thực, review quán ăn, bản đồ ẩm thực tương tác và kênh học nấu ăn gia đình ("Chồng Cook Vợ Look").
* **Mô hình kiến trúc**: Serverless Single-Page Web Application (SPA) chạy trên **Google Apps Script (GAS)** kết hợp **Google Sheets** làm Database.

---

## 2. CẤU TRÚC THƯ MỤC & FILE (PROJECT STRUCTURE)

```
thaothuc-guide/
├── Code.gs            # Backend GAS: Handler API, Sheets Database CRUD, Auth Admin, Google Maps Link Parser
├── Index.html         # Frontend SPA: HTML, Leaflet.js Map, Glassmorphism CSS, Client JS
├── README.md          # Hướng dẫn tổng quan & vắng tắt dự án
├── ARCHITECTURE.md    # Chi tiết kiến trúc hệ thống & Luồng dữ liệu
├── TESTING.md         # Kịch bản kiểm thử (Manual & UI Regression Test)
├── AGENTS.md          # File này (Context & Rules cho AI Assistant)
├── versions/          # Thư mục chứa các bản Backup mã nguồn (v1 -> v42+)
└── assets/            # Tài nguyên hình ảnh, biểu tượng (nếu có)
```

---

## 3. CÔNG NGHỆ CHÍNH (TECH STACK)

* **Frontend**: Vanilla HTML5, JavaScript (ES6+), Leaflet.js (OpenStreetMap), Custom Dynamic SVG Icons.
* **Styling**: **Elevated Glassmorphism CSS System** (Clean typography: Inter 400/600, background blur, soft volumetric depth, no hard borders).
* **Backend**: Google Apps Script (GAS) runtime V8.
* **Database**: Google Sheets (Tabs: `Locations`, `Suggestions`, `Recipes`).
* **Deploy**: Google Apps Script Deployment via REST API (Script ID: `1XPfj4hGcao9kTChFGrdezbmrOHtx_awSzMFzp45YdfIqMa5acpl1EXVO`).

---

## 4. QUY N TẮC PHÁT TRIỂN (DEVELOPMENT RULES FOR AI)

1. **Bảo tồn thiết kế UI/UX**:
   * Tuân thủ chuẩn **Elevated Glassmorphism** (Giao diện kính mờ floating, border mỏng mờ `rgba(255,255,255,0.75)`, đổ bóng nhẹ, gradient cam `#FF7043` -> `#E64A19` cho nút bấm chính).
   * Phải đảm bảo Responsive chuẩn 100% trên Mobile (dùng safe-area padding `--st` và `--sb`).
2. **Cập nhật danh mục đồng bộ (CATEGORIES system)**:
   * Tất cả loại quán (Bún/Phở, Cafe, Ăn vặt...) phải quản lý duy nhất trong mảng `CATEGORIES` ở `Index.html`. Không tự tạo text cứng riêng rẽ.
3. **Sao lưu trước khi chỉnh sửa lớn (Backup Strategy)**:
   * Trước khi sửa đổi cấu trúc lớn, luôn backup file vào `versions/vXX_description`.
4. **Deploy & Kiểm thử**:
   * Sau khi sửa code, thực hiện deploy lên Google Apps Script và chạy xác nhận HTTP/Visual UI.
5. **Xử lý Lỗi Encoding Tiếng Việt (CRITICAL)**:
   * **KHÔNG BAO GIỜ** dùng PowerShell `WriteAllLines` hoặc `Set-Content` mà không cấu hình chính xác `$UTF8NoBOM = New-Object System.Text.UTF8Encoding $False`. Mặc định của Windows PowerShell sẽ mã hóa sai và làm hỏng toàn bộ ký tự tiếng Việt.
   * **LUÔN LUÔN** ưu tiên dùng tool `multi_replace_file_content` / `replace_file_content` để chỉnh sửa HTML/JS/CSS nhằm bảo toàn cấu trúc file và Unicode.

---

## 5. NHỮNG LỖI ĐÃ BIẾT & HƯỚNG XỬ LÝ (KNOWN ISSUES & FUTURE UPGRADES)

### 5.1. Lỗi Upload Ảnh (HEIC / Giới hạn Base64)
- **Vấn đề 1 (Giới hạn Cell của Google Sheets)**: Google Sheets chỉ cho phép lưu tối đa 50,000 ký tự mỗi ô. Hệ thống hiện tại đang tự động nén Base64 của ảnh xuống mức `< 45,000 ký tự` ở Frontend (`Index.html`) và chặn đứng những chuỗi dài hơn `48,000 ký tự` ở Backend (`Code.gs`) để tránh sập data.
- **Vấn đề 2 (Định dạng HEIC của iPhone)**: Trình duyệt web (Safari, Chrome) không hỗ trợ đọc ảnh định dạng `.heic` thông qua `FileReader` và `canvas`, dẫn đến việc ảnh bị fail ngầm khi up. Người dùng buộc phải chụp màn hình hoặc dùng ảnh JPEG/PNG để thay thế. 
- **Vấn đề 3 (Chưa Real-time Render)**: Khi Admin vừa up ảnh và bấm Lưu, popup cũ có thể vẫn lưu cache ảnh. Cần tải lại (Reload map) để ảnh mới hiển thị.
- **👉 HƯỚNG NÂNG CẤP TRONG TƯƠNG LAI (OPTION 2)**: 
  Nên chuyển đổi hệ thống lưu trữ ảnh Base64 sang việc **Gọi API Upload ảnh lên ImgBB (hoặc Imgur)**. Nhờ đó, App sẽ giải quyết được 100% giới hạn 50k ký tự, cho phép ảnh đạt chất lượng Full HD, đồng thời giải phóng hoàn toàn bộ nhớ cho Google Sheets (chỉ cần lưu 1 đoạn link URL ngắn `https://i.ibb.co/...`).

---

## 6. CÁCH NHẮC PROMPT CHO AI TRONG PHIÊN LÀM VIỆC MỚI

Khi bắt đầu phiên trò chuyện mới, bạn chỉ cần gửi prompt sau:

> *"Hãy đọc file `AGENTS.md` trong project `thaothuc-guide` để nắm toàn bộ ngữ cảnh, quy chuẩn UI Glassmorphism và kiến trúc hệ thống. Chúng ta chuẩn bị phát triển tiếp [TÊN TÍNH NĂNG MỚI]."*
