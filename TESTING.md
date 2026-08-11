# 🧪 KỊCH BẢN KIỂM THỬ DỰ ÁN (TESTING.md)

Tài liệu này dùng để thực hiện test nhanh (Smoke Test & Visual Inspection) mỗi khi deploy phiên bản mới.

---

## 📱 1. TEST GIAO DIỆN MOBILE & RESPONSIVE

| STT | Hạng mục kiểm thử | Kịch bản test | Kết quả mong đợi |
|---|---|---|---|
| 1.1 | Visual Layout | Mở app trên mobile (393px width) | Không bị tràn viền, header sát top, bottom nav nổi ở đáy |
| 1.2 | Header Map-only | Chuyển tab giữa Map - Home - Cook | Header & Filter pills **chỉ hiện** ở tab Bản đồ, tự ẩn ở tab khác |
| 1.3 | Glassmorphism | Quan sát các thẻ Card & Banner | Thẻ mờ hiệu ứng glass, đổ bóng mềm, viền mờ `rgba(255,255,255,0.75)` |

---

## 🗺️ 2. TEST TÍNH NĂNG BẢN ĐỒ & FILTER

| STT | Hạng mục kiểm thử | Kịch bản test | Kết quả mong đợi |
|---|---|---|---|
| 2.1 | Lọc địa điểm | Bấm nút pill "Bún/Phở" trên thanh filter | Bản đồ chỉ hiển thị các marker thuộc loại Bún/Phở |
| 2.2 | GPS Location | Bấm nút FAB định vị tròn màu cam | Bản đồ di chuyển về vị trí GPS của thiết bị |
| 2.3 | Chi tiết địa điểm | Bấm vào 1 Marker bất kỳ | Bottom Sheet trượt lên hiển thị ảnh 16:9, món phải thử, nút Chỉ đường |

---

## ⚙️ 3. TEST TÍNH NĂNG ADMIN & ĐỒNG BỘ DATA

| STT | Hạng mục kiểm thử | Kịch bản test | Kết quả mong đợi |
|---|---|---|---|
| 3.1 | Phân quyền Admin | Đăng nhập tài khoản Google Admin | Xuất hiện thêm Tab thứ 4 "Admin" trên thanh điều hướng |
| 3.2 | Category Dropdown | Bấm "Thêm địa điểm mới" | Trường Loại quán hiển thị dạng `<select>` chứa đúng các loại trong `CATEGORIES` |
| 3.3 | Parse Link Maps | Thêm quán bằng link `https://maps.app.goo.gl/...` | Hệ thống bóc tách đúng tọa độ `Lat, Lng` thực tế thay vì ghim vị trí hiện tại |
