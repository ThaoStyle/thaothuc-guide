# ðŸ—ºï¸ Thao Thá»©c Guide â€” Project Standard Operating Manual (AGENTS.md)

> **Má»¤C ÄÃCH**: File nÃ y cung cáº¥p toÃ n bá»™ ngá»¯ cáº£nh dá»± Ã¡n, kiáº¿n trÃºc há»‡ thá»‘ng, quy trÃ¬nh váº­n hÃ nh vÃ  nguyÃªn táº¯c phÃ¡t triá»ƒn cho AI Assistant vÃ  Developers.

---

## ðŸŽ¯ 1. Tá»”NG QUAN Dá»° ÃN (PROJECT OVERVIEW)

* **TÃªn á»©ng dá»¥ng**: **Thao Thá»©c Guide**
* **Má»¥c Ä‘Ã­ch**: Cáº©m nang áº©m thá»±c, review quÃ¡n Äƒn, báº£n Ä‘á»“ áº©m thá»±c tÆ°Æ¡ng tÃ¡c vÃ  kÃªnh há»c náº¥u Äƒn gia Ä‘Ã¬nh ("Chá»“ng Cook Vá»£ Look").
* **MÃ´ hÃ¬nh kiáº¿n trÃºc**: Serverless Single-Page Web Application (SPA) cháº¡y trÃªn **Google Apps Script (GAS)** káº¿t há»£p **Google Sheets** lÃ m Database.

---

## 2. Cáº¤U TRÃšC THÆ¯ Má»¤C & FILE (PROJECT STRUCTURE)

```
thaothuc-guide/
â”œâ”€â”€ Code.gs            # Backend GAS: Handler API, Sheets Database CRUD, Auth Admin, Google Maps Link Parser
â”œâ”€â”€ Index.html         # Frontend SPA: HTML, Leaflet.js Map, Glassmorphism CSS, Client JS
â”œâ”€â”€ README.md          # HÆ°á»›ng dáº«n tá»•ng quan & váº¯ng táº¯t dá»± Ã¡n
â”œâ”€â”€ ARCHITECTURE.md    # Chi tiáº¿t kiáº¿n trÃºc há»‡ thá»‘ng & Luá»“ng dá»¯ liá»‡u
â”œâ”€â”€ TESTING.md         # Ká»‹ch báº£n kiá»ƒm thá»­ (Manual & UI Regression Test)
â”œâ”€â”€ AGENTS.md          # File nÃ y (Context & Rules cho AI Assistant)
â”œâ”€â”€ versions/          # ThÆ° má»¥c chá»©a cÃ¡c báº£n Backup mÃ£ nguá»“n (v1 -> v42+)
â””â”€â”€ assets/            # TÃ i nguyÃªn hÃ¬nh áº£nh, biá»ƒu tÆ°á»£ng (náº¿u cÃ³)
```

---

## 3. CÃ”NG NGHá»† CHÃNH (TECH STACK)

* **Frontend**: Vanilla HTML5, JavaScript (ES6+), Leaflet.js (OpenStreetMap), Custom Dynamic SVG Icons.
* **Styling**: **Elevated Glassmorphism CSS System** (Clean typography: Inter 400/600, background blur, soft volumetric depth, no hard borders).
* **Backend**: Google Apps Script (GAS) runtime V8.
* **Database**: Google Sheets (Tabs: `Locations`, `Suggestions`, `Recipes`).
* **Deploy**: Google Apps Script Deployment via REST API (Script ID: `1XPfj4hGcao9kTChFGrdezbmrOHtx_awSzMFzp45YdfIqMa5acpl1EXVO`).

---

## 4. QUY N Táº®C PHÃT TRIá»‚N (DEVELOPMENT RULES FOR AI)

1. **Báº£o tá»“n thiáº¿t káº¿ UI/UX**:
   * TuÃ¢n thá»§ chuáº©n **Elevated Glassmorphism** (Giao diá»‡n kÃ­nh má» floating, border má»ng má» `rgba(255,255,255,0.75)`, Ä‘á»• bÃ³ng nháº¹, gradient cam `#FF7043` -> `#E64A19` cho nÃºt báº¥m chÃ­nh).
   * Pháº£i Ä‘áº£m báº£o Responsive chuáº©n 100% trÃªn Mobile (dÃ¹ng safe-area padding `--st` vÃ  `--sb`).
2. **Cáº­p nháº­t danh má»¥c Ä‘á»“ng bá»™ (CATEGORIES system)**:
   * Táº¥t cáº£ loáº¡i quÃ¡n (BÃºn/Phá»Ÿ, Cafe, Ä‚n váº·t...) pháº£i quáº£n lÃ½ duy nháº¥t trong máº£ng `CATEGORIES` á»Ÿ `Index.html`. KhÃ´ng tá»± táº¡o text cá»©ng riÃªng ráº½.
3. **Sao lÆ°u trÆ°á»›c khi chá»‰nh sá»­a lá»›n (Backup Strategy)**:
   * TrÆ°á»›c khi sá»­a Ä‘á»•i cáº¥u trÃºc lá»›n, luÃ´n backup file vÃ o `versions/vXX_description`.
4. **Deploy & Kiá»ƒm thá»­**:
   * Sau khi sá»­a code, thá»±c hiá»‡n deploy lÃªn Google Apps Script vÃ  cháº¡y xÃ¡c nháº­n HTTP/Visual UI.
5. **Xá»­ lÃ½ Lá»—i Encoding Tiáº¿ng Viá»‡t (CRITICAL)**:
   * **KHÃ”NG BAO GIá»œ** dÃ¹ng PowerShell `WriteAllLines` hoáº·c `Set-Content` mÃ  khÃ´ng cáº¥u hÃ¬nh chÃ­nh xÃ¡c `$UTF8NoBOM = New-Object System.Text.UTF8Encoding $False`. Máº·c Ä‘á»‹nh cá»§a Windows PowerShell sáº½ mÃ£ hÃ³a sai vÃ  lÃ m há»ng toÃ n bá»™ kÃ½ tá»± tiáº¿ng Viá»‡t.
   * **LUÃ”N LUÃ”N** Æ°u tiÃªn dÃ¹ng tool `multi_replace_file_content` / `replace_file_content` Ä‘á»ƒ chá»‰nh sá»­a HTML/JS/CSS nháº±m báº£o toÃ n cáº¥u trÃºc file vÃ  Unicode.

---

## 5. NHá»®NG Lá»–I ÄÃƒ BIáº¾T & HÆ¯á»šNG Xá»¬ LÃ (KNOWN ISSUES & FUTURE UPGRADES)

### 5.1. Lá»—i Upload áº¢nh (HEIC / Giá»›i háº¡n Base64)
- **Váº¥n Ä‘á» 1 (Giá»›i háº¡n Cell cá»§a Google Sheets)**: Google Sheets chá»‰ cho phÃ©p lÆ°u tá»‘i Ä‘a 50,000 kÃ½ tá»± má»—i Ã´. Há»‡ thá»‘ng hiá»‡n táº¡i Ä‘ang tá»± Ä‘á»™ng nÃ©n Base64 cá»§a áº£nh xuá»‘ng má»©c `< 45,000 kÃ½ tá»±` á»Ÿ Frontend (`Index.html`) vÃ  cháº·n Ä‘á»©ng nhá»¯ng chuá»—i dÃ i hÆ¡n `48,000 kÃ½ tá»±` á»Ÿ Backend (`Code.gs`) Ä‘á»ƒ trÃ¡nh sáº­p data.
- **Váº¥n Ä‘á» 2 (Äá»‹nh dáº¡ng HEIC cá»§a iPhone)**: TrÃ¬nh duyá»‡t web (Safari, Chrome) khÃ´ng há»— trá»£ Ä‘á»c áº£nh Ä‘á»‹nh dáº¡ng `.heic` thÃ´ng qua `FileReader` vÃ  `canvas`, dáº«n Ä‘áº¿n viá»‡c áº£nh bá»‹ fail ngáº§m khi up. NgÆ°á»i dÃ¹ng buá»™c pháº£i chá»¥p mÃ n hÃ¬nh hoáº·c dÃ¹ng áº£nh JPEG/PNG Ä‘á»ƒ thay tháº¿. 
- **Váº¥n Ä‘á» 3 (ChÆ°a Real-time Render)**: Khi Admin vá»«a up áº£nh vÃ  báº¥m LÆ°u, popup cÅ© cÃ³ thá»ƒ váº«n lÆ°u cache áº£nh. Cáº§n táº£i láº¡i (Reload map) Ä‘á»ƒ áº£nh má»›i hiá»ƒn thá»‹.
- **ðŸ‘‰ HÆ¯á»šNG NÃ‚NG Cáº¤P TRONG TÆ¯Æ NG LAI (OPTION 2)**: 
  NÃªn chuyá»ƒn Ä‘á»•i há»‡ thá»‘ng lÆ°u trá»¯ áº£nh Base64 sang viá»‡c **Gá»i API Upload áº£nh lÃªn ImgBB (hoáº·c Imgur)**. Nhá» Ä‘Ã³, App sáº½ giáº£i quyáº¿t Ä‘Æ°á»£c 100% giá»›i háº¡n 50k kÃ½ tá»±, cho phÃ©p áº£nh Ä‘áº¡t cháº¥t lÆ°á»£ng Full HD, Ä‘á»“ng thá»i giáº£i phÃ³ng hoÃ n toÃ n bá»™ nhá»› cho Google Sheets (chá»‰ cáº§n lÆ°u 1 Ä‘oáº¡n link URL ngáº¯n `https://i.ibb.co/...`).

### 5.2. Lá»—i Leaflet Animation Collision (Va cháº¡m hiá»‡u á»©ng trÃªn Mobile)
- **Váº¥n Ä‘á» (Crash `flyTo`)**: TrÃªn thiáº¿t bá»‹ di Ä‘á»™ng (Mobile), náº¿u gá»i hÃ m `map.flyTo()` ngay sau khi thá»±c hiá»‡n cÃ¡c thao tÃ¡c DOM náº·ng ná» (nhÆ° xÃ³a/váº½ láº¡i hÃ ng chá»¥c ghim `L.marker` thÃ´ng qua hÃ m `filterMap`), trÃ¬nh duyá»‡t sáº½ bá»‹ ngháº½n luá»“ng xá»­ lÃ½ chÃ­nh. Äiá»u nÃ y khiáº¿n thÆ° viá»‡n Leaflet há»§y bá» lá»‡nh bay (animation dropped), lÃ m báº£n Ä‘á»“ Ä‘á»©ng im khÃ´ng nháº£y tá»›i vá»‹ trÃ­ ghim (hoáº·c chá»‰ Ä‘á»©ng á»Ÿ vá»‹ trÃ­ GPS).
- **ðŸ‘‰ NGUYÃŠN Táº®C Báº®T BUá»˜C (CRITICAL RULE)**: 
  - **KHÃ”NG BAO GIá»œ** nhá»“i nhÃ©t hÃ m lá»c báº£n Ä‘á»“ (`filterMap`) hoáº·c tÃ­nh toÃ¡n láº¡i kÃ­ch thÆ°á»›c (`invalidateSize`) vÃ o cÃ¹ng má»™t lÃºc vá»›i lá»‡nh lÆ°á»›t báº£n Ä‘á»“ (`flyTo`) trong cÃ¡c nÃºt báº¥m chuyá»ƒn hÆ°á»›ng (nhÆ° nÃºt "KhÃ¡m phÃ¡ ngay" á»Ÿ Trang chá»§).
  - Äá»ƒ lÆ°á»›t mÆ°á»£t mÃ , hÃ£y thiáº¿t káº¿ cÃ¡c trigger sao cho chá»‰ gá»i `flyTo` trÃªn má»™t báº£n Ä‘á»“ Ä‘ang á»Ÿ tráº¡ng thÃ¡i tÄ©nh (khÃ´ng bá»‹ thay Ä‘á»•i sá»‘ lÆ°á»£ng ghim á»Ÿ background).
  - Náº¿u cáº§n `invalidateSize`, hÃ£y dÃ¹ng `map.stop()` vÃ  Ä‘áº£m báº£o má»™t Ä‘á»™ trá»… (`setTimeout`) thÃ­ch há»£p giá»¯a cÃ¡c thao tÃ¡c xá»­ lÃ½ giao diá»‡n vÃ  lá»‡nh bay.

---

## 6. CÃCH NHáº®C PROMPT CHO AI TRONG PHIÃŠN LÃ€M VIá»†C Má»šI

Khi báº¯t Ä‘áº§u phiÃªn trÃ² chuyá»‡n má»›i, báº¡n chá»‰ cáº§n gá»­i prompt sau:

> *"HÃ£y Ä‘á»c file `AGENTS.md` trong project `thaothuc-guide` Ä‘á»ƒ náº¯m toÃ n bá»™ ngá»¯ cáº£nh, quy chuáº©n UI Glassmorphism vÃ  kiáº¿n trÃºc há»‡ thá»‘ng. ChÃºng ta chuáº©n bá»‹ phÃ¡t triá»ƒn tiáº¿p [TÃŠN TÃNH NÄ‚NG Má»šI]."*

---

## 7. SKILL ROUTING â€” WORKFLOW CHO Dá»° ÃN NÃ€Y

AI pháº£i tá»± Ä‘á»™ng kÃ­ch hoáº¡t Ä‘Ãºng skill theo tá»«ng loáº¡i yÃªu cáº§u, KHÃ”NG Ä‘á»£i ngÆ°á»i dÃ¹ng nhá»› tÃªn skill:

| TÃ¬nh huá»‘ng | Trigger tá»« ngÆ°á»i dÃ¹ng | Skill cáº§n dÃ¹ng |
|---|---|---|
| Báº¯t Ä‘áº§u tÃ­nh nÄƒng má»›i | "lÃ m thÃªm X", "thÃªm tÃ­nh nÄƒng Y", "muá»‘n cÃ³ Z" | `grill-with-docs` â†’ phá»ng váº¥n + láº­p docs |
| Gáº·p lá»—i / bug | paste lá»—i, "khÃ´ng cháº¡y", "bá»‹ crash", "lá»—i" | `diagnosing-bugs` â†’ Ä‘i theo phase |
| LÃªn káº¿ hoáº¡ch | "plan", "káº¿ hoáº¡ch", "bÆ°á»›c tiáº¿p theo" | `to-spec` â†’ `to-tickets` |
| NghiÃªn cá»©u API/docs | "cÃ¡ch lÃ m X", "API nÃ o", "tra cá»©u" | `research` â†’ background agent |
| Thá»­ nghiá»‡m UI | "thá»­ xem", "prototype", "trÃ´ng tháº¿ nÃ o" | `prototype` â†’ HTML throwaway |
| TrÆ°á»›c khi deploy | "deploy", "push", "xong rá»“i" | `code-review` â†’ kiá»ƒm tra chuáº©n |
| Logic phá»©c táº¡p | filter, sort, state, calculation | Ä‘á» xuáº¥t `tdd` |
| Session dÃ i | > 20 turns, "mai lÃ m tiáº¿p" | `handoff` â†’ tÃ³m táº¯t context |
| File phÃ¬nh to | Index.html > 3000 dÃ²ng, muá»‘n refactor | `improve-codebase-architecture` |

### Quy táº¯c báº¯t buá»™c vá»›i dá»± Ã¡n Thao Thá»©c Guide:
- **KhÃ´ng bao giá» sá»­a code khi chÆ°a backup** â†’ luÃ´n backup vÃ o `versions/vXX_description` trÆ°á»›c.
- **KhÃ´ng sá»­a `Index.html` báº±ng `Set-Content` / `WriteAllLines`** â†’ luÃ´n dÃ¹ng `replace_file_content` tool.
- **KhÃ´ng deploy khi chÆ°a kiá»ƒm tra encoding tiáº¿ng Viá»‡t** â†’ kiá»ƒm tra UTF8-NoBOM.
- **KhÃ´ng gá»i `flyTo` khi Ä‘ang cháº¡y `filterMap`** â†’ xem má»¥c 5.2 Ä‘á»ƒ hiá»ƒu lÃ½ do.

## 8. KIẾN TRÚC DEPLOY KÉP (DUAL GAS DEPLOYMENT) - CRITICAL RULE

Dự án này bắt buộc phải duy trì 2 bản Google Apps Script (GAS) chạy song song với mục đích khác nhau. TUYỆT ĐỐI không được đẩy nhầm code của bản này sang bản kia.

- **BẢN 1: ADMIN GAS (Giao diện nhập liệu)**
  - **Vị trí code:** Thư mục gốc (/Code.gs, /Index.html).
  - **Mục đích:** Render ra giao diện HTML hoàn chỉnh để Admin quản lý dữ liệu.
  - **Script ID:** 1XPfj4hGcao9kTChFGrdezbmrOHtx_awSzMFzp45YdfIqMa5acpl1EXVO
  - **Lệnh Deploy:** Chạy 
px @google/clasp push ở thư mục gốc.

- **BẢN 2: VERCEL API GAS (Backend API cho Vercel)**
  - **Vị trí code:** Thư mục /temp_gas/ (Code.js, Admin.html).
  - **Mục đích:** Trả về dữ liệu chuẩn JSON thuần túy (không dính HTML) để Vercel Proxy gọi API (doGet / doPost).
  - **Script ID:** 16OCmcICv5eovb9LzPsRATCgPjBU20TdaYo0fueR0i2AM9U5zvHb-Acm2
  - **Lệnh Deploy:** cd temp_gas rồi mới chạy 
px @google/clasp push.

👉 **QUY TẮC SỐNG CÒN:** KHI có sự thay đổi logic Backend (GAS), AI phải ghi nhớ việc Deploy riêng biệt ở cả 2 nơi (root và 	emp_gas/). Nếu đẩy nhầm file Code.gs của root lên API của Vercel, Vercel sẽ nhận về HTML thay vì JSON và ngay lập tức sập toàn bộ Dữ liệu trên web (chuyển về Demo Data).
