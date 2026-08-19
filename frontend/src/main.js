// ═══════════════════════════════════════════════════════════════════
//  THAO THỨC GUIDE — FRONTEND MAIN.JS (Vite SPA v2.0)
//  Google Apps Script Shim: Giả lập google.script.run bằng fetch()
// ═══════════════════════════════════════════════════════════════════

// ── API CONFIG ──
// Điền URL Web App GAS mới vào đây sau khi bạn deploy backend-api/Code.gs
// Để trống ('') sẽ dùng mock data để chạy local preview
const API_URL = '/api/proxy'; // Vercel proxy - tranh CORS

// Deep link support (thay cho GAS scriptlet)
var DEEP_LINK_ID   = new URLSearchParams(window.location.search).get('id')   || '';
var DEEP_LINK_TYPE = new URLSearchParams(window.location.search).get('type') || '';
var SCRIPT_URL     = API_URL || window.location.href;

// ─────────────────────────────────────────────────────────────────
// GOOGLE SCRIPT SHIM — Tạo đối tượng google.script.run giả
// Hoạt động chính xác giống API GAS nhưng dùng fetch() bên trong
// Code cũ gọi: google.script.run.withSuccessHandler(fn).methodName(args)
// Shim này bắt đúng pattern đó và chuyển sang fetch(API_URL)
// ─────────────────────────────────────────────────────────────────
(function() {
  // Map tên hàm GAS → action + method
  var GAS_ACTION_MAP = {
    'getFoodLocations':  { action: 'getLocations',   method: 'GET' },
    'getRecipes':        { action: 'getRecipes',      method: 'GET' },
    'getSuggestions':    { action: 'getSuggestions',  method: 'GET' },
    'saveSuggestion':    { action: 'saveSuggestion',  method: 'POST' },
    'askGeminiAI':       { action: 'askAI',           method: 'POST' },
    'getScriptUrlLive':  { action: null,               method: null  },
  };

  // Mock data cho chế độ local (khi API_URL rỗng)
  var MOCK_DATA = {
    'getLocations': [
      { id: 'demo1', name: 'Bún Bò Demo', lat: 16.0544, lng: 108.2022, badge_type: 'approved', category: 'Bún / Phở', must_try: 'Bún bò đặc biệt', price_range: '30k-60k', map_url: '', image_url: 'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?w=400&q=80', opening_hours: '7h-22h', description: 'Quán demo để xem trước giao diện', phone: '', address: 'Đà Nẵng', video_url: '', shopeefood_link: '', grab_link: '', parking_info: '', payment_methods: 'Tiền mặt', day_off: '' },
      { id: 'demo2', name: 'Cà Phê Muối Demo', lat: 16.0654, lng: 108.2122, badge_type: 'heritage', category: 'Cafe / Đồ Uống', must_try: 'Cà phê muối signature', price_range: '25k-45k', map_url: '', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', opening_hours: '7h-22h', description: 'Quán demo café cực chill', phone: '', address: 'Đà Nẵng', video_url: '', shopeefood_link: '', grab_link: '', parking_info: '', payment_methods: 'Tiền mặt', day_off: '' },
      { id: 'demo3', name: 'Mỳ Quảng Demo', lat: 16.0444, lng: 108.1922, badge_type: 'spot', category: 'Mỳ / Hủ Tiếu', must_try: 'Mỳ quảng tôm thịt', price_range: '30k-50k', map_url: '', image_url: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', opening_hours: '7h-22h', description: 'Quán demo mỳ', phone: '', address: 'Đà Nẵng', video_url: '', shopeefood_link: '', grab_link: '', parking_info: '', payment_methods: 'Tiền mặt', day_off: '' },
      { id: 'demo4', name: 'Bánh Mỳ Demo', lat: 16.0510, lng: 108.2200, badge_type: 'approved', category: 'Bánh Mỳ', must_try: 'Bánh mỳ thịt nướng', price_range: '15k-30k', map_url: '', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', opening_hours: '6h-11h', description: 'Bánh mỳ demo ngon nhất phố', phone: '', address: 'Đà Nẵng', video_url: '', shopeefood_link: '', grab_link: '', parking_info: '', payment_methods: 'Tiền mặt', day_off: '' }
    ],
    'getRecipes': [
      { id: 'r1', name: 'Bún Bò Huế', category: 'Món Việt', time: '2 tiếng', level: 'Trung bình', serving: '4 người', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80', ingredients: 'Bún, bò, sả, mắm ruốc, ớt tươi', steps: 'Bước 1: Nấu nước lèo với sả và gia vị\nBước 2: Thêm mắm ruốc theo khẩu vị\nBước 3: Chan lên bún và thịt', video_url: '', tips: 'Mắm ruốc chất lượng là bí quyết ngon' },
      { id: 'r2', name: 'Phở Gà', category: 'Món Việt', time: '1.5 tiếng', level: 'Dễ', serving: '4 người', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c18037?w=400&q=80', ingredients: 'Phở, gà, hành, gừng, quế, hồi', steps: 'Bước 1: Luộc gà lấy nước\nBước 2: Nướng hành gừng, thêm gia vị\nBước 3: Chan nước dùng lên phở', video_url: '', tips: 'Hầm xương ít nhất 2 tiếng để nước ngọt' },
      { id: 'r3', name: 'Cơm Tấm Sườn Bì', category: 'Món Việt', time: '1 tiếng', level: 'Trung bình', serving: '2 người', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', ingredients: 'Cơm tấm, sườn heo, bì, chả', steps: 'Bước 1: Ướp sườn\nBước 2: Nướng sườn vàng đều\nBước 3: Trộn bì với thính', video_url: '', tips: 'Sườn ướp qua đêm sẽ ngấm gia vị hơn' },
      { id: 'r4', name: 'Bánh Xèo', category: 'Ăn Vặt', time: '45 phút', level: 'Trung bình', serving: '4 người', image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&q=80', ingredients: 'Bột gạo, tôm, thịt, giá, hành lá', steps: 'Bước 1: Pha bột\nBước 2: Chiên bánh giòn\nBước 3: Cuộn rau ăn kèm', video_url: '', tips: 'Chảo phải thật nóng trước khi đổ bột' }
    ],
    'getSuggestions': [],
    'getAdminStatus': { email: 'demo@local.dev', isAdmin: false }
  };

  function shimCall(gasMethodName, args) {
    var mapping = GAS_ACTION_MAP[gasMethodName];
    if (!mapping || !mapping.action) {
      // Hàm không có action (như getScriptUrlLive) — trả về giá trị trống
      return Promise.resolve(API_URL || '');
    }

    // Nếu chưa có API_URL, dùng mock data
    if (!API_URL) {
      console.log('[SHIM] Mock:', gasMethodName, '->', mapping.action);
      return Promise.resolve(MOCK_DATA[mapping.action] || { success: true });
    }

    console.log('[SHIM] Fetch:', gasMethodName, '->', API_URL + '?action=' + mapping.action);

    if (mapping.method === 'GET') {
      return fetch(API_URL + '?action=' + mapping.action)
        .then(function(r) { return r.json(); })
        .catch(function(e) {
          console.error('[SHIM] Error:', e);
          return MOCK_DATA[mapping.action] || { success: false, error: e.message };
        });
    } else {
      var body = { action: mapping.action };
      if (args && args.length > 0) {
        // Map args theo từng hàm
        if (gasMethodName === 'addLocation') body.row = args[0];
        else if (gasMethodName === 'updateLocation') { body.id = args[0]; body.row = args[1]; }
        else if (gasMethodName === 'deleteLocation') body.id = args[0];
        else if (gasMethodName === 'saveSuggestion') body.data = args[0];
        else if (gasMethodName === 'askGeminiAI') { body.query = args[0]; body.lat = args[1]; body.lng = args[2]; body.tab = args[3]; }
        else if (gasMethodName === 'setGeminiAPIKey') body.key = args[0];
      }
      return fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body)
      })
      .then(function(r) { return r.json(); })
      .catch(function(e) {
        console.error('[SHIM] Error:', e);
        return { success: false, error: e.message };
      });
    }
  }

  // Tạo đối tượng google.script.run giả
  // Interface: google.script.run.withSuccessHandler(cb).methodName(args...)
  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = new Proxy({}, {
    get: function(target, methodName) {
      if (methodName === 'withSuccessHandler') {
        return function(successCb) {
          // Tạo proxy hỗ trợ chain: .withSuccessHandler(fn).withFailureHandler(fn).method()
          var makeChainProxy = function(sc, fc) {
            return new Proxy({}, {
              get: function(t2, gasMethod) {
                // Hỗ trợ chain thêm withFailureHandler
                if (gasMethod === 'withFailureHandler') {
                  return function(failureCb) { return makeChainProxy(sc, failureCb); };
                }
                if (gasMethod === 'withSuccessHandler') {
                  return function(newSc) { return makeChainProxy(newSc, fc); };
                }
                // Gọi API thật
                return function() {
                  var args = Array.prototype.slice.call(arguments);
                  shimCall(gasMethod, args).then(function(result) {
                    if (sc) sc(result);
                  }).catch(function(e) {
                    if (fc) fc(e); else console.error('[SHIM] Failure:', e);
                  });
                };
              }
            });
          };
          return makeChainProxy(successCb, null);
        };
      }
      if (methodName === 'withFailureHandler') {
        return function() { return window.google.script.run; };
      }
      // Direct call không có handler
      return function() {
        var args = Array.prototype.slice.call(arguments);
        return shimCall(methodName, args);
      };
    }
  });

  console.log('[Thao Thức Guide] Google Script Shim active. API_URL:', API_URL || '(mock mode)');
})();
'use strict';
var UI_ICONS = {
  camera: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',
  pin: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  clock: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  text: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  star: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  play: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>'
};
var TR={
  vi:{l:'EN',cr:'Tiêu chí',sg:'Gợi ý',
    all:'🍽️ Tất cả',ld:'Đang tải bản đồ...',
    ckT:'🍳 Công Thức Nấu Ăn — Chồng Cook Vợ Look',ckS:'Món ngon chuẩn vị từ bếp nhà Chồng Cook Vợ Look 👨‍🍳',
    mcH:'Tiêu Chí Đánh Giá',mcP:'Tiêu chí đánh giá riêng của Thao Thức Guide',
    s3t:'Thao Thức Heritage',s3d:'Quán quen lâu đời, mang tính di sản và được dân bản địa yêu thích.',
    s2t:'Thao Thức Approved',s2d:'Món ngon chuẩn vị, trải nghiệm trọn vẹn, thử 1 lần là DÍNH.',
    s1t:'Thao Thức Spot',s1d:'Địa điểm ăn uống xung quanh bạn, được cộng đồng đánh giá tốt.',
    s0t:'Chờ duyệt',s0d:'Các quán nằm trong danh sách chuẩn bị lên lịch thẩm định.',
    mcok:'✓ Đã hiểu',
    msH:'Gợi Ý Địa Điểm',msP:'Bạn biết quán ngon? Chia sẻ với Thao Thức Guide nhé!',
    gps:'📍 Lấy vị trí GPS của tôi',send:'🚀 Gửi gợi ý tới Thao Thức Guide',
    navd: UI_ICONS.pin+'Chỉ đường',navv: UI_ICONS.play+'Review',must: UI_ICONS.star+'Món Phải Thử',
    bMap:'Bản Đồ',bCook:'Nấu Ăn',
    nameReq:'Vui lòng nhập tên địa điểm',sent:'✅ Đã gửi gợi ý tới Thao Thức Guide! Cảm ơn bạn 💖',
    locErr:'Không lấy được vị trí. Hãy cho phép truy cập vị trí.',
    ios:'🍎 Trên iPhone: nhấn Share (⬆) → "Thêm vào Màn hình chính"'},
  en:{l:'VI',cr:'Criteria',sg:'Suggest',
    all:'🍽️ All',ld:'Loading map...',
    ckT:'Recipes — Chồng Cook Vợ Look',ckS:"Delicious dishes from Chồng Cook Vợ Look's kitchen 👨‍🍳",
    mcH:'Rating Criteria',mcP:'How Thao Thức Guide selects locations',
    s3t:'Thao Thức Heritage',s3d:'Historic local favorites, deeply rooted in the community’s heritage.',
    s2t:'Thao Thức Approved',s2d:'Authentic flavors and complete experiences. One try and you are hooked!',
    s1t:'Thao Thức Spot',s1d:'Great local dining spots nearby, highly rated by the community.',
    s0t:'Pending Review',s0d:'Places currently on the waitlist for our upcoming evaluations.',
    mcok:'✓ Got it',
    msH:'Suggest a Place',msP:'Know a great spot? Share with Thao Thức Guide!',
    gps:'📍 Use my GPS location',send:'🚀 Send Suggestion',
    navd: UI_ICONS.pin+'Directions',navv: UI_ICONS.play+'Review',must: UI_ICONS.star+'Must Try',
    bMap:'Map',bCook:'Recipes',
    nameReq:'Please enter a place name',sent:'✅ Suggestion sent! Thank you 💖',
    locErr:'Could not get location. Please allow location access.',
    ios:'🍎 On iPhone: tap Share (⬆) → "Add to Home Screen"'}
};

var CAT_IMAGES={
  'Bún/Phở': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
  'Ăn vặt':  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'Cafe':    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  'Hải sản': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
  'Default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
};

var RECIPES_DATA = [];
var isRecipesLoaded = false;

var lang='vi';
var activeFilter='all';

// ── BASE64 WEBP ICON ASSETS (PASTE YOUR STRINGS HERE) ──


var WEBP_ICONS = {
  heritage: 'data:image/webp;base64,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', // Dán mã Base64 của pin-heritage.webp vào đây (VD: 'data:image/webp;base64,UklGR...')
  approved: 'data:image/webp;base64,UklGRnYUAABXRUJQVlA4WAoAAAAQAAAAnwAAnwAAQUxQSEQFAAABoIVtkyHJip4enNHatm3btr3Htm3btm3btm172JV/XEwxI7IOLyJiAui/tnnZtFNYlEknzcZuPPSCO55+78uff/n6/WfvuODgDaMapYaC/jvf+JnhGHMfXrNj/3znNVx304+c6HdXLC5zWPHqu6vZwj9umJnvpk7HfsPWfnZIC/f0vaKWLQZXnt/dLZ2uzAE2MQO1F7R1R6PTqsDWGw8Vh5a6IbPuG2ZjHzOAj+e6oN3dzGChtTlc10K95T9zaMAuZnhfzdSt5FxwWLBAU2NOLFSs8yscTiY8PNlCrXE/sIownw9QamklK2m8X6artJXHgZDGpqZ6qULbGw4EMyLBMubamhXqbGM4EKwhULtYmZU5VhamerIqk6pZXZP7ZYAiXX9mPRHA8D5urkb5W6yy4YfylchcykobHKbESmiDADa5cSq0/oHVRQC8j+srkLmbk0ZCqIMoIU3uTAVWIDHZnjdGXL2vWEVEATOjDuOVAmlHcWTISBC8vbD2VdFkIwwYdRhflss6i+NECITyYAMjRDB4X1Gdq2OxHiHAEVGH+YdySadxRECEhXsKavxrFK0/L5KzO1sO6+DHS8TkvWWb3AfFjEQcMKoAPl4nKedx4hDHfnywkMLvoyAGPd/KyJjICcI6xAcf9JFxQhKK+vHeMt5OxhODKIEPiWhlkmFoAZ+KEglL2Y3GhydIONEV8NlXwqOOgPG5TkD25xhMKKgR+J6A9vAxAWC1cz41pfZN5ggSYeJDOOPDPe3bKC9RhAqcad/+ftAp1i3tO9XPnfvbd5mfCQNPtePsu8UPYZQ/2777/Nx5oXV5D8Ixl2Rso/vZNWT9ra65yL4rXHOGfae65gj7DlALce1m38a4IC/25fZN0wUWjLGvC3xMKLDiaGtfwW8+XijVf8raR0/5GFc8TgLP9HHmKRI2sKcWooFXSOgK1AEzQ5s4TXsJmc842AEfZCTQBSEceBaJXMieO2bLKP8TQdDutxIZdCPrjjDXkNB5bFQLPVtK4VdRoNYXBVLoKNYcYY4ise1rNAtb3U4OXaMNYrqOBA82MSDAiIjZDJFEt8UQEVYhtltI9CAvqRwzrAmLcN4gWXRlQkLB4a8m4R0qtYHhiNWdpdHRDFXAiHIMiS/7grU0flG/KJdHS5OAXfFiFSmYuTMBBR/KaEBd/hCGJP7sTjrulhASS3RPUjL7dBIAiwU/ma8Fda9IQHRFb9JzZ512JUXzHowHsAuRHsxqQm2+j4U5FwaMaABCRf6lPem6BIhiwHVNkPVYR9pezojgDxZ7VUadBh+yqh83In1H1sQCKbkxpPFBsQg1fBCpnP+ENUBS/FiBTtT+J1uS/6kDab3Q6GAWk95n6HA6KV78OkMa+OVizahPhTj+vQfpvpmlYy1pf6m080j98rcYkl4u1o/6VDCkgH/rTi7cLIexktx4KYs9mxxZ8qqUF4tdQT1+k/FLJ3LnCkAAlpBLz2LYdzI5dYvn2PonitxCHX6w7bt25NoZnl3eNHLvoQx7wAeRg7P3scV3Zl1ETT6158NG5ObhVbZUDCRXbw07sIncfYkd55DDi1+y4cVil1HnnxLD9+3I7bO9pGqnk+sPTmofcn7ezclclXEflb+dxCtllAZ7/hrfj10oHS40McGbQWnxqJj4YEqN2bvjuTUvPVCD9+N4uwGlyV6/MaL82ovS5SJThVCV3hxKm0dxKPCBlDqzdzJC8PV56YPqv8MIeqWM0mj3nwPwXWdKpzNzfrWTKK3uXQe8I6XWzJUM5nMz6YWKn/LM3QWUZst336WY/mcQVlA4IAwPAACQOwCdASqgAKAAPm0wk0YkIyGhLhkaaIANiWoA1i4BXL5D/iPyk9oGwv4f8g8O4bbtwzpf7j1PeYT+rvSm8wn7Uftj7x/o0/xfqAf1X/OdZt6AHlv/tp///lD/r3/L9Kj/59YBwkX9j/CD9APkh44fqPxm85fLP8nkt92uy2W3ws00+gJ+i/SN0REbHs5ZKmDlR0DA5GgYd1772d9c0pAX3tk/rO64yjl5eBjrIxxQRsw/uwfRDQHCBS07rQ9ZT5CJmELbmGdvtzs7IenpY3s+7pRxdDXuHcTJC3bWO9rms65cc3JgjebyB2GpBt1s9x5QQOrAEh2RHZrJXS3KPjvIn2owcWI0nc5Wdj3qD+/4dMdZemqO9PuRpgDxX7xjE2B3OmFuuVnGdcI16zuGQoTr90sbpL6z0swdMl0yc6sJEtbRHGHYrRQRYIrlcvJS1YJqHw1s/kwsPUX5q1X04lRsMhgS+YJ7BwiNXgJw5vXBVHPolkFdPFEfnI1RJCSPedh1uw1dTYJzq3GC0Jnez3Ql3VK8mEdjjmW2rzBaxkDt0lJH+Un6GZ46r6ZeGKHsEqRZ8thM27pMg0pLfXi6Zj6Qa/RllJLNDuGw0K3zQYJE6a+tqmExYVGrQJCjyLM8k84NVOyXgAD+/nyU8eL9dyETjvBas3Bjn3IlATcQ++DhzRYH778pvZ4osRM+GD/EU8IauHgm/CmjMUOkgHjFIiRP5X/RZdj2fln4+w/3jGEbMqCTps3B64gSN0SGxOS+D4+8+9yZqO98iljNzDJfRu751yK7gGcBt4glW0BbOHLBDjAuvw7iYAWwpyTg3bWzpYJqRrEDKzsVv3MkHFLy5/bjwi+3OmYS84yYhqS0J0B8f4jFviLDD3eWTLgPeHtOMyJCNzOZPKP/bwM6icAK5wZ6sVNQmpoJVjFXGGMM4FTq5CErri9A69qOTTw/TdI4rlzRrwRX0fta6H0koNnb10uDq/t9NjISaiF6Pw42u4ztmZi1m/uf+wectIuH/4CkoRfWTq7SZb7Js43Iz+AiU0LuK/KX8aTt1uzfuKqcTMTFDH3uVFnlEbAPim/nZH/jCyFyCxUz1vsQAFb7Z4/M1wjwhnM/ML0QmeCwdeQyIBQ7mXgEWlBqYdQzvF0Knf5h3Ros+jkX/+K5XXX5YGV06aKHZ4W+KFWTvUKfRqHjL/jCrilNxqjDPO3rAs2z1dZM/iQlvvwXzAEvLm9qRpxNnK3KfadHgbmZg2ALCeriumoczmTi4Xnp5bfFyqIA/8mkwe5Rezm+yAr/b8wR1poYwHJL3uxHDC8fDAlySKtpAyxAYcJcoeZCXaJZpBqcGyGiASAhBz/UVscmVPkcyl3iIYRyqSu/t4p1XcE/QY7U2t32uUw1mltDwnexVDyI44OMdjugn7gdSfFMuInGfzdOYUaw6fEC2ITs5Cvy/0H54USgv7iRk37VLHFFJQLnre4jxwrsEGQJGZbtYq8B7805J28UZ33HHH00m0Uo7haAQMZFO8wepPc1wEWzzms4Tp9MXG7wIR0S4CgCoQqMHMUQzOtedGQom1wmnHyaZ3zYma1+Mce+PQHErSODTtjw3LKbTGO4+r3Cg8zLBhwrgyR3D0Q7+rP5OjoTSha17h8W3u8BGqFHhYEDzI9EvT9C/0La8h41S4QQBxl1QSjlHIipXshlN8a3ZzsCBTDCQsZuASDHcZHN449zYdwzzjfr8JFU9NvniarbpMM/rDsFd3gR+0YWLw5HopEZaMmfPoAxFI4jAlUxregT3oVsICVt9KsDX9UmzU56KtrrJVXzMlI6fOdiwCW+WciUY9Uw0FjQjBA780ykDfONO2NAPvGpsAQKkZmQy3dzNAXDn1NGJ6SS/iDr/wDRrgip8vPKWzRBj8508DMQojzrrVscQ7W4e9abf8CpSpuM0a/F7hP7k5/lKbpIt1AjXeL+jTIUfQxmtagktLq5lnpkE24QIYtP7vH5ONKeBNtsVCwQmQL566gHxcx7wBEetWVlaDQtlt0ZvukMxqelq954o0av3xnBqNF+G5qN101xE4jBkHuh3cqXcwIgx7v9TewN2IHiykyYIJkvrLsLurIL6zcshgbjXCrQE3aaqMG7eZjan9cLDzVbZgJOSmpKxeNV/gVLMYuxAhxkY/T2/DUfdONdf9Y6wpN86lO9tY2S0JSUWjz9C5H3mXXlsWTccIM3KMRUlOCLm6hsC7KfX7EslOX8Co/N2VbMNASpBIkpupGQiGRz3LOy6o62Qwg7vN9FrMEop63fJtkk7uYz1GzTmiNxJC8HEJNBTP6av2VqX/NCcp9K1QxC0zyFxtSLch293ec9QEbyFfadC9TmjTJI0467uLpHygf0GPPIROm3AMqyEbGL8TcuCc00zJbU2OjWR9djwTLZZP2b201Kb4RUmj2fzIwvdttYtl3Wh6Tg1HcJ8325qIE1DtyQS4tt/Y1cZKb41cVBSTIcSwLLmhNaSG5aUNgw0Kwrv3LNJGeNhpPPkFFT8z/j09yFXEHCZ6DHId1sZx7vegsN8mdgMwLOh3ajpIp9leJ7gSJLmA9jTvLxB29E+F8aVm3IxNgA5XeU4b4Vz9mrX1O+S+EOZtT2JBPQovUHPkXEHOL3XdlvLBR3Tz/tDe1lxtwHXqJCWe/rJvByrI83e5IIKmmXFF1jgTf2Coe/r/e3fBT0WSXB3J5voT9qAazqKXNsIVnGih4ZLrvjjCXpuQe1qguR7F9U/+4uOmNIFPG2QVGGrkDZ2VgdSEK78CZAj1OlfilV3IctaISnH9JmGNyAt9LH313Ph77sL2ThIYSHyjm4LiKzg/hyz1HoojdMkcGcJGPBeP61OmbjiQXBkd98xzLHfM3CAOveTMmIF+bYzTQ9gK4FypDzFv6XnBnvvn6uVJ+uedwZWHIA1urOPe/bERjR99clhC4H9B2E93Oa51SWwnaJxNFqo35mzIJQBcQRhR33RQc9NWg29BjrfZ7vzlBW/NXk4TCVKnhlX0KXaTMEA09bCfwrVClePtH59XyNnsLoqK2JTxm/YtwGKrAe/pDSVaT98NZkvBQXOBpfikxaTTKeD9EF7dyZNiBRonOBwZxKMJXSss37emy8IMojs0oETgopV+q53SLsXyYHF78/qzgaKDnvo/2UCnFeSkAtvRmdTKuzY+Vhq4To5d57NTRPfq0G0RXd/58XU7zrA9AeRu5WqDIHlp3K3/pPWsB0iTxecNflmhTdozo9H5jU+eNe/mYVlEPjmVSAoo4MvfNNgnDDwEt80HefXxr+W4ZkW7lB/H6a/7O1upe5Z9LxH2szB/nwgkZ7URZkbWf3cOcntr2X+ag2gkmvGrcTCk1mbDPPf2WkhXCDw91380tPUf+XKPJBzbNK5f9eo/YBqafgQ9L3IYapevCpNH6ZQdMeDIWncUPXsv00UvFdad8BkR/qLyrgraVeiWkZJT6NEklNtFqIy3M1b4Aty/+b0Mw2xgnGPeiAvct8W40W1KWczX6zsNQ7MzLJcsVi9PDD7pVLWQ8B3QytS0f71OjsBZ/DRNwbmEo2Q5qvnxBeOmjnbwjJGD8C6a3qIxdpmm8g9fUQvAtXfcG+tHeUji5fIR+q8CETniALaDkcsGzZm/dR9wvIcXfznd5mU0GuzX4Oc3QMJ85zhLeK/UuoQ5JXIGESUmept/zAsyLO5+yw5PzbtmJmF5A/rYLzNoXlbyiuxG4JAAZPh3jRKhRGHrS5FhIFsKiVuMPZd2HdKzC/cqF++8OzY8yxwysU8LTkYXjRELccLUTvVa8AYEcvlwWUcxsXg6xfhz3Jr6Gdb3jg+CJu0KnT2JKLuXFD2KuEoPozPkIDDbm6OezgnzrUYvwN9hbUuO9anQd07ATQ1nh6qOv4FfrqGtTFUZi4knWCXvEw13VcjP5NtuvBseFEfRHpJsisVZLhkukl5XNa4hGjmFC9+0D00pKYb1WAu9dy0OP2ko6Ct87UX9Ncos7Ui8TvFHg2V/qWDPqbBMsgxlM3+EOwYq++xRdYDaFw4znwfEfwF374h1CRJA87il6N2Bhg9zrqcmlv/I3ECSnYk/kX7tkSrAF5nyNhZS3ks+dc6EVXVnCwtqhV4ZKmfLaLu3i/crXzA87nVdT2w6zrL+KI5dCYbX/+z8BxLU9ttAwBW1YFkCaQFuXjj18BDBSKj99P93TkXbo7ziSFyUF9d75XueFUR0zqVzcoYA835Td/d3H3BaiqBdLghCPYQjBA8iTTH15Mu+49DZ6bHDI7JRYYGSUZwHWV/9PvTGeSvbVdNICvnX7Jp29DAx2NE3daxrD+oQp4soN1QCONzHNQtRfjMBTNPleVD6XiUIfJwVy/iN5QCFl5AEpbkgbMJQN70jDar79oo/f8ToSsSVgx2azxUvPxWORvfV8Si2EYC6nGMcF0f1ihwi1LlJiBcRQxPEUYMRKDFGMz+L5oC3GGXVlYYonUKFm+H+nav59nrnAvhINRVflaSG36o3zAUUEMZzpZsUrIW91FRkff99tAAMj/3gy1LOSJTQqX2m78s89F/lrEHdf2ERRuv8Ud+Qf3zcY/Bjh7T7cfYmjHF5Jw11KJWztmOW/fEG2dkXf1+6TXU4GfN5nd2AKw0cJGRtrnOgZwa3EitkwOCgLfJS7yCuJp0C9thH1GLOEzB+Qaf3ssC8nvifFjOdDVqYIdn1AxlLU6WNAyZMrITY7G4E2OHXLaO13nm22Qllq44mc2YDt94bUT69Vzb56Ut/Z/WvmwGmMAetfG1xWWYWrcI/R/PrF5FgsUVF8dG9JNbDqRvtc5kuG8lC5nohFmSFDGNscDZrUrUDOQD0txmO1kFndmvifyqrbRwA0kfVhls7J9Uuo4n/yE2disMb5i8HHBE87vZW6JeTFM4ZjU1mTa8pTMkFIIQOtAvFnBsybiugG0owV/KhsFqdKa6pAUyCLDJbYnXP/bBxN1dbj82GCn//7k2ScVu/+6OsVF/1Bxb9Dd+fsUz1+hGlH05QO8VSKAADkgahKZYD4lf4IytxPVLe5lTLnqrAKCGZNld5FBg0b7SrudGXUdFX19nFpXxsZO9AbEfod7nmTcfbgjpq4zj+XJUJacXHz8PdmyqKw+4dCxN6jHwuAG7kjM3uO77IoIhAAAAAA=', // Dán mã Base64 của pin-approved.webp vào đây
  spot: 'data:image/webp;base64,UklGRppVAABXRUJQVlA4WAoAAAAQAAAA/wAA/wAAQUxQSKAIAAAB8If/n2m3/v8919pIdtoTs25z1e2xrfrYtm3btm3Xtm0jTc2gTMM9z+cL3WtmZ2ae89e5roiYAPh3T8/3fd9zLT+txXEX3PH8hz8MGjt97qKly5bMmz62/zfvPnF9j255KZ7beJndr32n/+KyeiTF8QObpv/8aO+isJOEW134wZTyODVGrFr64wPHpXsu4TW/7POl1UiNWlROeu3UNDcId35ichWSlmLrj5fncs/v8uLcOtIZd4+4JotxWTdMqCUDln96coRlfvcPtyMZMr74qSJ2Rc8ZU0dG3f1Vd49TadfNFWTc+gk9QlxKu201kpHjk3qEORS7dgmSscWMHj53QucsRDJ6w7BuvOkyoIGMX/NtPl8yX9pDVtx8Y4Qnfs+lSJbE6UdyJOvjWrLo/ruj3PBOX06NEjUSEoRTinmR9uIBsu6Oyz1GtB6NZEUMRvGvM9jQYxNpi41MfmEHHoTuq6IkYrK0L7vYY0DsozhZvPZ233q5Q5EkEY2HgSj+barl2s4hWUQyNib4f0xENCDLaoeXkq1FAJpbaLETtpK9MQDNaWmtM3aSxUUQWtvRUmdVkE0RZSTXdrDSWZXEyA3tLXRyGUnHbUYr2ljnmB0kj1bCBFTSyjIdNxATA9DsXKs0W0rKRSC0AREmoIlNLJIxieQxgdV/iFgj+ivxFN/2LOG9hjKIFsCkiAQUv9YSV9UTW/efYoWj95CNMUmYgDYWWCBnGalF0ynGREFHpBov/DMlRvsFxgT4ivFuFAFUCgZQ7cmGa1dG7F2TY7TIUJJE22AyMJ6AfvRNdi/KWB6DEWKCeF+DdaykhMgC6XgCKs0xVspYYvJnxrpZSOHBkB21RxkqfwuxFWVoWsRI3sfEJ7zVSMfVMEbh9mwDhUeTLLKGXjZQnwYp5u5ta5zodGL2155prhQJkDEYrLqjYVLmE7u/M8xFgl/VHY0SnU0M/8oo5wqOVbU0iD+aWP6SQbrVqkLmbE83xyfE9LuNUVjBtZURU9yFXBPHGyI8l9Qig+gLQxxWr4ihqGBnuhneIL7jpUaIlTCOBhrhtDjn9uaY4F3iPF5igOgq1tFPBjiigXfbYvo9RaxGOXGydv4M5tGL2jWv4pXKuZ5ulyO/UKIqV7cvidkNJI29NAst4pbKlzTL288mDIaBxnp6nYpsIhEo+NaYXg8Q/xs66vWrImQVXqJVaJEiwSp6TqvMCkWsRQW/adW5gV8ql/g6nYPcEqiiPKbTw8R2DFLXQqev+RYYj9bIm+gEdJFGodVucJdGqWVu8JpG+dVu8KNG7eNuMFKjo9AN5nr69CA3XB3S53JH2BzR5xZHKEvV505H2NVUn3sdYU+6PverQX7tdb7dTfW5Rw3DK2L63K5CEAl2bY3oc60KlpeG9DnfERb5+pyKHEMFk0HfbkKBEAzrr1HLWgWE7FH5hUbplSo4/qxG0fUSyCBEJbdo5M+WEAxSfI5G0F+C66K7Th84QVWuTvc4wfqwTmeiDLJsoqdTi2oZnn8FOqesd4EHtIKxUuIgyCrspddHUhyvaaHXjTzDYGsieh0hWCb5G+idUREMWfaAZt7EYIQME8dpBm9wC+W2p+nWB4MFRLYoHAS65+1XgMTqh7XzpingtThGO3iaeRtT9TuiQUrw6hPQP6VEClmFvQwAn0vxeke6Cfoh534GE6aXMQ4vNAL8zLjyTDP0Enz7HMwYW8O2+ImGgNfYtjBqiq51jMJgD4Ip/UmMCr47zxhwNTIHVX0O5jxkLXdQTf2RBoEXmKN6jG+SlvsYhueAUX9g2LyoWbpXswsvB7N6v7FrTtQw0L2GWXghmNb7lVnTo8aBTvtY1XA2GPgDVvX3TVSwg1EHuoKRH0C2CLk3wMyxGSqQB/JrswwFJ9YpIHEQ5IW4HEztfSaHxNL+IWNB9mopnm5tAQbvVc8gvBZM7n3DECH1Z9hokLVUCoOhleIyJQVg+GOqZNhZdyYY/3YhgxJoO/EYmN//UoaZv4QsAE1nMGZJNlixeBMH8P9QamtHsORp1QxQW9sbrHlnA0viD4I9/RcxSWgl/Mi3CIR/tB4q+CcVrJo2ODlEwngKJ2aAZTNmJgmtMz8frFs0LzlEwi7LWoKFm61IApJtS9qBlYtXq7NuSSewdPF6JqzvBNbuuFoG7VTaBSzeeoXEwdEyazqC1VstUGHZFcVg+YI5llvWBqyfO9ZqC1oCA5sOttisImBh7Ee01dQ8YGL0A2EwTMbYbGCj/2SDoZCSOiQdGOndXq0KNUsq/hADXl5yQA0Smgq/jAI3e5UpMSEqEm9FgJ9HbjaT4vonfOBoxxXWqL7VA542X2CJA1cCWwsmq0OT7OoHjE0fqUxfRLnKM4C1Tf4yCiIp3HocMDflezSI0i1HAnuj76HJ1nUHBofeFlphctZ1ARaHno3rlNwV7YDJ/hP1ZlrZDtjs3VFnomWtgNHeXXXmWVUMrPZuqTPN0lbAbO/2Wo1QRUkxsNu7vk4flSXFwHDv7jpzbO4CLPdubzDF5u7AdO+x+saHqGLnMcB2/8F4o1NafiIw3n9V6Lf3DGB96A3Urfo8YH74G9Sr/iZgf8pPWsUf8/gHTcZphO/44II5M/T5PgJu2HKtLiPTwBW7bdFjbja446lVOpS2Bpe8rrbxVRwOTuk9io2t+hxwzNDX2Ljit4FzxgY2KnzDdw/IWqAClf0eARdtv1GB8tkZ4KYn7G0s61uDq15dFwjV7T0OnNV7FoOob7gGHDY6sBHg257LQM6M5I1IBbftUJaskgJw3XP2J2ffMeC+94lkxG8ABw7/moz3PReCzJnqxsTAjYu3qSopBFfuXa1m//Hgzk+iCnEbOHTKRBU/+C4FbUrlFmeBW/esldl/NDi29yoGE7eDc6cMDPZVyL0gc0aQoang4gUD4ger/+YQcPNQn/476uvLB5zqgbuntW6X4cG/ewJWUDgg1EwAAHC3AJ0BKgABAAE+GQqEQSEFozVRBABhLE3cLjwf0xupGwv3/8bfy0+TarP2L+6/3b+y/3L/vf5T5fdBPY/0ge9nzJ/l/za/rn/////3u/2P/U/vvun/U3/I9wL9KP8J/af8j/4f7V/////9WPqu/bb/o+wX9df+r/j/30+an/hft17of83/wPyO+QH+lf5T/xevJ7D/7uewR+13piftn/v/ku/rn+w/+H+0/4f//+hD+kf37/1fnb8gH/n9QD/lf//ja/5v+I364eUn9n/HT9ZvVP8X+V/tX90/Zn/A//T/XfEd/eeIX0f+K/7H989Tv5B9pPxn91/cz/F/vT8Vf5T8vv8T6Z/l37B/mPyY/vf7ZfYR+Mfyv+7/3n+8f6n+6fud9BntH+r/xf7b+MXrf91/1H+I/cD4C/Xf53/fv75+3f+I/bf2Lv7X/Cfst7o/XX/V/3z8o/sB/mP9M/zX+E/cr/Hf///s/d/+o8EX7j/p/97/qvgB/mH9X/0/+A/0P+w/0//6+1b9//3f+G/0H/g/zH////HxH/MP7N/sf8P/lP/D/kv///3v0E/kH84/y/9v/yH/S/wX///8f3Effn85/2Q/4f56fR3+qH+8/PFr0Vwg6o5YzZyGe+lP6wXdNvM7nLXewl9T3rbbxYQSZD+k167FLaRJIG/US0FcDBN+8pTStuVioQeaFfpBDecAID7BSTPeFizK7GEReY9KhpdTK4xf9jfpKl7J8ysdiY/cP/qO8U7hRgzViq95iuvaDEgS2alCyZDuBr5bsf/+r6oHHauN8e+W8Q+gp1YzWIl3slW+4hZu6nWsDNENoQLNM+vVyUStPv/6HczxhAxG8S8bYWKK44NyPAMNbxn2+D/WPU17flzJ3G3jAw0BKG5xQAeE2yPfD8OeINaKWh7zHYepWxUMxAo1idBjjRU4typrQNLaBT/lzbSyjav6gbfQgn1rR9dzpFTHgqwFJ0TdItk+h5qmW7uS7H//zS5ErzwpOy6X1m7qxDZFopb//+X07kmpjk/Q2IfLF6gWM4u29MBzqAzr4d6kUiVrKAhsrBr0KY9CE8//0WpZH3J/HpHPQUNAP4it4IU4hYKbLpY/70Q8ppkL27b51VOrFrPgtWeh00I7dOOYThyymNasxv5eRslWaZxPJbmT4m2E2ZWQ6S5xpoVt1kxu35zK8PZCg2n6nauKZ5V0nZc6m2wzYQOJSX9xeEVEnWcfd/rLZA7LaMs2+F6S/usPVZ+KHiJQypeOP28IJcA/AmE9eDE19SINpAwbbELnE6NP9ZXK9dKvaWvvm7vvV75FLuesLl2YLqC6Ur20HOmt88L1aqq/Ja1LvC/c5XKXyB2AvDMCfMdixUNeWT6jLLPoNEteiGGo+6hZhR5Y4FSM1vcH2fOWa7nlBqvUoxNEMaRanZPD/CGxFMNUtRQmz9hxfkzF7VPaVlRfz3PoTwoRq3vVHteLU7HNHnsCPMzvqFAyVDlTCN3MPQ4SQGZ8kHCXXJaqio1f42Lv/SRPW8PF45ue9HLMwYnSaesbdcacVnaIrdZtZf/k2Bmq5e6m54efO8XRH8MT/w1puVhcHytY0+oCLytLet9ewq80pjCq91F/EomKi9Kpq5QaOE6Jafu9LfCjLtcuM00vurO23yt5cuCPBhhZNb52C06sCT0VbL42V4kTmnOqaf+LN8mQB2cegNzjKwv5ZFTcjwMioYnWp3LvAHMHkRtW7JD7C+B1SRS9jmd4ucQPeeRdYu3XZsY96loOzi1OCpRE/7GD8Fe6X4QeutmI8s8zKobesPlTeWWEFrxReM1/UzYvxVAlW/bghyeKl2hOZN4T+usVrrj0kUs4UiSQOArFh5TEntI9pt/o2zeUc6lJNtD/4sxXxMQ3u0/68z1WrEN0vdoJfwOemOcErSAhgqdN+bIcXy8o16HlNe5NaxDdL8GcKo8dywLnWBAZZufq8BwSSBxNgAD+//JnLC/gfmzxVggHtD3DibIByspF3mLsWZ+1oQMNVb0js77EaAf8baQHXvS8uXhNGQc7aXYy7rwm0Owqxy1g74XGUNNo9fDWyFRb/5fWRqREEsiImD0LMoGCJUZjPUXT36U2k9yZiUH/Shgs8X+FeHdqyidrkqxJFkMpS/rt7nlKUUToqrYoomLwnNA/VTfbXkKgJMBAdLNp54y0vwFP54qwSONZHOM2GnNLPi3fjt6x6fN1C/AT/KSLMAZ59bKW+lQJZ/CUgPE8LoulX8TFJb4Ac/eJAZGYIcK+iU9gtA3KkrG50l8GMElktoQ6tatKJAnRhoab6089bbQTK1W4Hsc209vU02T4AaKw3qSIDFgf7IvJKUHU1BRNEorUUcLr70kAVOHJ/69o9CfncGWaAAYjD76f/sHJI39TJf9tvBSrsBknSvz19khAeuwL81j4r91+kAQ64A7+L8EENLCZCJqQ8h/r5BosF+EUKZSCI/YhjzsBZFLmwEoaDOOX2dvRmWCI1oZLQkwuPW6cL0KG2vOyRnIHWiAXnB395/I/ISvZXSVBRvQcfzneXzLw7fZ5mADx+skTHtyNoYmU9z7WArP72Keb7W3VY2Labc+7y0ONto1vpZawMwb8aNrG7o7X9MRS7kjQUW8SKT6/YKKR/UTfWPbJCeBRwbiPhgD91SVKSp/Kw+VJEQ5//pJA82IbizWScuWF6pBXyTjIjX5SWaGMg+0JLsynSnYEKs+SaTtF89+uXPDsss6t3I0DEjh4tG53kNeJSyUlbkNvmlWWqoMdWT0zEzI+KMBfIEER4joJC5++xlcOSNRsS8P+8XZyBy4ZpkJDuQV+/IpWoxPPIOzcAmKGay0Z7tywjuY3Ekk3c7AIDY72R2eytTUz2WLh+TrEDdoEcS7rgXkKAvYgloES/IuehTpWqvMN5PH7ClgLcGHCDMPNbSaTqbmDWQBp20ucCl0G/M/L/3mi+T12P6gj41cBCbRaVOqQtTG7siqQHOpNyUyiGttf5eHDY90ya/U3nxuoZXT22YuZA7GnGELFsgZG37pfi2dgTrAUUNkyUdSw+IXLkvXUYW+Q3wti/9BnazZ/KKw1UtEsW94AGLqxSD5B84QsyVoasHXS8yDGquvLXt3JnOOciI9DxOnDyqrAFk4vyuYJYn+mdE4D8so+8UxTSb9YCVQsMbfd5D2gnMNPs5hq68wCElyAU1RP6oJ9jnY4TvIfgqmtL1w39DXZUXBbvM2wugIPUg+RfMRkpdrZ2vbjXDYE5J2X4vL/HAuEwucDHdcnaUsX3NYuXD1pDZdqp4i7Aw8k/01T0XPkmhI9C59nnZkM8f44XtxKkT1ISACBEZSza3seNtNKioLx8vzn6Jb8cN1gumHIiNvD5IK7K1EaAhFu91/hRHR4T0HuOt+0aOg4rFpgfpm2VsYPFuj1rA4y1ITWDPilufPZclR8pKDvdaEzHxtTGSzmQLAumIXsCT/kSFGMCZzBEgXmPqLp/u0iV1s6RgxjmVZE4od1Mln9Fuy3XuUg9oiElzDmUI99QHJ0PywbopJhnVrIqj+i83153shFoqlgOeBw5gSxzUJDIbpc/rKfQY34s+yAyMCeFXYQVv5po2E187gPySpXhX4a3K02j+DYNqOgVHM0tDJT2DUf+HX6Tp9Op8gysX3WGblMnfSlmFBrBbO1z/CffHM69otA9YB+LCXPHG2/mDzzn/lUkAuVphqusLJj2N4AIrZPXKG3conLtb6mneaHesjNhWjy7kIh5Gruk5vrqg470MNRmYAa8itbR6+EASXvgfk+PIYzGA7hU0mRTb80jJ2NFmE6iUz2glL8gqC8bdxyNkGB73jwaHRtSNr3D44ke8rJ8UDUxnYCZy+w7IrUQap6CJgRurHKve2X19xthA3o7CSZTG8ToIZh/pl/uklm8plHTBuuUTE1ukO0Vj3fQqEr9gcZcbzCFxr1KarKQQfbBU5UNToExq+rXiMCHnc5XvlONoFhxBUBuZzR3xg91Q4lJnd8Oqifkq5HXEA+9oEDTcQrigLsOW1C6rl+Ai9h9Rddsxt456gmIDGxjqFpgYqbMx2wC7aBYxNgb834F7ilRu8ZqfHkcK7x2OOAAtHjloEQX1QL4qBnEBL//MwEodXlYsMIB9oVURRG1fyICW4tcVuOUnF1EFoiwyoQEHDwdbo0p6g6Tf3CEPbf6IGMZVo8YOws16uS1bhYC0NJqXf+I+rSIyWKikIhtcMLm7nGNKAxYgG/SIn7s7OVgeKyYMhwFMYjZYQ3HjuEfN5lONcYdZM5zr2WMHnpmHDEvBVlQx5dw9qbgSN3ksa7jVVM1NzoTKt4C8CFy34/Hsrd2Ci0Cfx52gcJmYWCpWasSsMOyUZyV5xH0MzHaOwEWOTMg3EypMPno+xC894/R40H6daVOdJjjxeOs73LyZ9IGKaZ38GBBRhrhOl90dgXn5yxhYIQ23nKV9OKPvnEP2qrV/eOHQASaloDWZXE4D5c7cCVYzost8R795yESOv+a2CBc/Xd3rVRgbCYRZZrE9x4rm/dWRAtzCSlgkLOf68EQi24Q+gZyhqFBqI0ewR3+LbKK/xel2F+xMplwkLDicahfo6wzq2CJ72BP4cFOIG1+3kIGi0Z1Ppw0Ti1UevB32vh0iRBCUc4vIMSrOPydPzAHj3tkv8m30gSZDgyQN7ZPVAeutkfAqRAbhaGoRH3Yxk9s8nrfRawF4hI3C/1Cm7oNTHw/Ph1evVmYhR22Dc+XU96pDWV/f/ESzMUR/IkyWI9lAi3ZSlgSowMcsMiWu4bVZz62JXOTSQ8G9UWX7OH8S3IFGLtYBYCOvi5f1UgAA/zE4a4xWowWrfWEW6gJBIUayVA/rsCMvWsGM3HTggaU67cWlj0lvVuLhq4Fbz+7cqFBPAJHH602Ms8eQv9CVQJ6QZtGjncyxKMdwgjsXgNDIAqjinVt1f0exMle0Ud3cnbTT1ub56pVdvpHRgRtB9+7UPTf4EdJ7Oil9FJsUlbp11eaN0Q92nd3ejZAQWXT3ffoTWJlMexYsN+xQiLzhS+6dHK7Lvor5hyWBrraR+Ie8inE7c6+bOgWMtiN/XhCEi/jdFmtyBHomty1jddMOwIx0fOexub9OhrF53e9PRjqKU6YVN2oh6zA8iQYyqP5wtgIjW0SkD7jdhUzqkU0Ohs8+jRjpGHi7T40mxnUilsW8EA9no/joK264ihUK99QjxiEr1a7HQRnuNQRxPPQBtVR1+vz7Oa/7zu6vaxD5qhsyIFkz7nPI8nK4Q0gbZG31RDbIp+X/wGhdnxaKt5X9tei58KZRL3nQhy5ruymwu3YwtB7xiocWkaTovty22cMUhmgPtPwD3C837arJjO6vaZLTQpFwNqtvIAvW9ueL92Hyl/XO9vOFLiSbbrEr51Lcpd8Mii5APeJWlJrndV5FnkooSMpO2k57TynEREeN3xpuqo3/zJxCT9MJ1mUima42JV1I+kQ3WTcJ3mEbQZE6hcSxFNt4k8D5BHsPMYkXfgOxeCFzqpQmO78ytAgMvNi4WOl4GEyPouhhzKGg4xqtHJyY6Nme3Q+TuMA6ML+OcDL9jofmY2Rktv2glKLXyeaRiurRg/O6DsKt11qQUn5p8Vq4EUaGjaE/VVukIs8WwzZ4OAC4A6dZCUOAsIzMmBy5W+HjzYyluccWGzbpYVCYwvqIp8hXFKBTtmIqanLUQGRHuoaj3FOKtQT9O9wYlNDBDzacQCeAcwk4DwlFOqbllwMPJKE7ZPH0lXq0HzBSvhe59NUsp++ibrZFUitiDcXEWBHVvu4++cQCRnyiWxfRBXdogg0XLhzw4cS/SHeDPXtdObNXUBlCPEm61JegLGeZXtgof0VvVNTn8lB5/M+yN9u4phWHBYMPF3/xWYMVKWYiG4WmwElHsK7UZh+sui2sja8ZOuEOjjzLfPwcIBbaau1LWm2Ag4BLQQ8VXqPwhALVcjegwVFYYXXHmQf63+fgt4ZTvCbnYX1uQvb/vosHdvBHp2NgBIVsQAM6xIHXjXyEhdYGr36kZ/ZnS5U3E/O53qEDcpW6BIb9TOiL6dqV9pIf482mllbeptt6k8y0tt0HbMXYjFUzd4wm2JK4uMqXR24dGCL9SR1iCAgJppf/PO1o0ReWZqWxVLMw8+8a2IcAFzWQ4C4z0ZthR9yGZtF2RVTa1uMSdyQ2XtbyhQq+mjCNxg+3H5GlX1ZVzdgpF31lEUrCTiVBr72ZabqNx2mtkyvcsRDchdeU1m5gESyruDL0RNHPJcMt8EVjhDvBb1MES2JcQ0aZgp89jJmptEAsPD899CVYv4X4qxmRsGMwlzuQs97DHcGosyFzkAgd2OI/LuApubJ5NTdHVpAN5CKVc1L3Lgzdeq4hr+M7d6RyjzaSA3q2JuP6JsY7x9Y5B7NOes/ixjTeuool8+GAo7/fyAfq8E2Ccyo7kOjuZizA+LHSCA38cYWbFdnNYF9HhNRRexXh+nN2VFBfBy+xZlSNeNLdmpp3yA8SEeu0e0YTgm3VdeOmaTTKKmJfEYWFKsgUobWhc6uSUgsgC0g8ssCRe3kkmjubl7CdQJlKoEnc5K+qDfQ9BeIGkJdYrZfB9KpTfEMf2pOsj/sHu4dGQzHWH7uL1p8mH5GtdPsg8qMqy+289DQNoH8Xa8gSy+1A7QxJHpzOsCHndzoUn5lVA+y/hlZ+jSs9EtnzRPw9VInDVw/3jsyJquHf0RghFJYq6zh4gYPIZKIcIYJdzIYPIISvcQZhwXNkfKRaguNRheBrD44pBti5EFhIxRs9Kpb+k3Y5sTBj59AZeupZhPf+ZxcOvL01qrsNmY3+eLYCEHjF9bmj9dvc9mYHMZuAspI9RbKtoz6ZiRQMHn8UocrRAqS29gaTkKA1aDNFgh/Pyrm0b1VbOhqzcDVZF8ILfmIestpHMT/iIesC5srIRom58GRxSdKycWBxIzeWO6F8BKBM4qInh4e3hUpVPHmzcj9xOZJon2XJW9HgZdM2YtnkU0xiWa5yyXPFvkdVbeVYMO4vlgoy2Ej3qmFvYCmKzET821gRITVkRI/yvnmEqAU4wdsIntiAYPIUwJ9Cyvmjiszg5Hk7VcMjOKFu1DLZcpjCeiiWbu9P7q5TZhf/m2OxYRmSEapwXT5RuNAjt1emI3D8jl8SRBgfULjgA0x5MW3EH7mVktBjxbzO77THl1Zkkt2FBvXvyviYizzd2kabk60BaaAvMMdRkbcq93A6RUxG/87BBXk/cJLapBV1VDVTYKOyFDbze1kdONEr2io4281+dpjOcvBcfGB2x5wzqqrWoTsV0mclsu8zp8nx4zBkI8zun9QUSojGSzzXpSs8epbZDbaaXk3C2PEta0WvZ9Xb6hMxiugKNBMv5SmfKxUeJoETEBLVCC97CdseoiYX1gPfKzKIs5ZOMd+V8dV/UG+pvn8HljGd8+Gz+MgVDMeNJh/0OFZbtbhzPgmZ6l+JfWqS2h7HUvUXdd5OJRbC/Bvvy0Ay2Y1iL5ZpDk6Uwd0C+6oRui2eBhgFonL1M0ZeHVkihH0M+p4pZKZK3kXDSjXjpOM3LAMR+2JVwHV5/hcOzTdLjQQ4/QYexKHVEVc6683wn873f5RtNUVD+Y7UCY/iwg+0FGiTvW1A/u5kq1Yuv7sa/UBvvs8ZjCgnnDe7xDwfdO+y8m1IOx1RNqiPYhxCXPPf+8E4ihyOQVq7ZtJ7oNroFVgrYrfkcUwQJGbmoE2+Sv/3KbKoCPzYKPIyo1FFIsW/vZRzz8UJ3aInV7AAwQ4fek30uUeyWZw9l+93EBzeFKFJ2OIh+wcvrp00VSRgJfUbh1zgSjXFFOgWsi/VNhRV4WdI5s2AEWNbU0l849E2iJxB65e2GrVPqKKPjj3HSknlIrmJhUQ5bgdRfnJQTxdLWQawCo+pXsLvdXnpaPpvRxy/0CTAatL51lDF8WL4QAyh6p0Pf3Tugh8IpyI3xUI/QJUIhNYBUwdhgGTCC0hQnycqL6JNDLJDOJV822qC+GB40OJHW5qC5BAM8SV0a3YC+/Nf/1IM3xhxrqSoLkoot1tLe6QrPFNAA28p1xU9U0Lt/FCkp+ava3ai6nRcF70ZJ7oQImwo6UVeeKHdkK+fow50JgRLtr/fjdz4JSOwU7CyjmzCnBJcwNCbOh9pTr4vCfTl8Kl+R2vpu5GtX5NZPUD/HrhbEgCcu8rkDYldjcuUQfRRnhIrZck0X1yXaYcvlQ6j/od1P6X7QI38Jpo3gYCNMykVFFQeCP4Anq5rQj71uBJk+yJMHrQBovsxe5qy9laG3hPuMtubS+az1XO3OQKfxIdcDJGRHbdVz0CZ1URQtb8K9bPdcUl/3y0sJHo3eZyWM09oPoOfVxllJZnfewj9NCwGKlUAKTHY6YwvaVSg4IgnCNX7cGqm60luiLMA5lZ/yn76vZ3Du0X2iwHLfErjU371dDdxY5iCWZnd8NY2RWBEuBmYvupG+yOl/pxBijtNUO9/euRW2noi6K+Tqh+NM7LV4PZ+k7jVPCX+9ysKlCkbwVL0AfDcH/7yH1bcI4qKmuC2vV/UfbNKbamIdxK3zLAGIjVaxBu0Fov2+CL0ngLt1Souik4rrOKKKTycY1Hs04aCUgQ5IqOqZZ6k8pkxeHMUVtMPRPp6rWDF7+9LMHKeTuWaSavi1UD3ZRJ11s3bJ+se9VmTNGtLFtpAHSvMa/DuuCNdyMnZaLZXDH9WraTFwl+7WwBxbTN4QA3K76UxNU1WQJgdKYIWBPq4QlYpM/impN+b9RZSUEyQRPpVE2d8zQSC08krGaKsbHq92DCfuvUi3mgCma113Uai4KGmCfCFkMhDnRvw9oLasEwicpNNdGb3+Ie1VEqR/kQyB9ITJ+p92uhT1kKRPCa8SIE3gtrDymKmKP14QESL+6G7h0LN2PAcdbxr6NlB5iDc7Lq4DPXxs9RbDkOd7r4cxd9ffcSG6yIt41yeP8GxtbpzIef+puBqCQs+mRuTlciNCVShuWx2yuhhoxpToJDlL4PFXv0jCrz35WG4hIeIXzBB8cCIUDCiruFmq5ndkBytWBt2R6rIyVAlE/y/YYUjENievi0qwV7UDsW7SAoMhAx5CRZbcxI06VIuTLnDyS+pathH13hSM6CH3sIEACZe1dxOjMxuCst5ABe84HEGGduZFoFWzsEQvXOQODDI0u9pe0jXG340cVvH+g5FqeQzEJTSJVxS/X7QTPdiuQzmvAP39JcRLLZC9qt1kZ+G8PzloKqHFto36tu5dVJJRNt9VzRpwnf7o6wHz6mUPxsZQp2jdDFEj5jklN4gVAATQ61FWCT/gVU+VIaPzonKLMBTAOqjjEibD01dd16cZMPp/QBQg03YVTOdTccaUCnC2kqIb3hLWsCFCKk964K5crw8Z1ofCPtq7U1pFxbndbjKH2KPaqaVGdEtU159rk+k5ti2W6sWHhN6X3Zi6flOtns4W6AcrS7U9AmHp5G+e/BPtFN2ZtBb3xRHij7qapX91G4g3OOKSBkzWN58l+X0sVnzPBA8wibtOQV+9dkaEtCsSlnmBgW6gd9kdl/Oj3UeiZNoZaGIY0akYwqORhJzhGep+mTifRICE7Ev09CEiYE0BDOicJjk7SApZZxDzi5FOFnsUyQKYWhEoiYzkQi2JmGFuWZv3mFdsaKBB0hSYnyyZHhNRRKnvCFvt4W/MIgJ0SNBEOExm5jzrz7xRgDTQCsoWmMM/SUlK0+3NChosBgQc4926P41P9tVvbTUAhqwZKEQYdvY/A2Al22j+G2xIn5M9HifUZITsywS2QtgONaJgKjyvRC4cIZ03sX5ktlt21C/M9dHwa7kT7xWlvk4XRKQZU6V9SnAsKThmGCFjqlPjjNHxNdFc8zFW2RcTzoXa8UOuK7v+ywTTZW604ig6JvhM8+7mxCBGRdPo9fa0wXCrn7tOJY9DbN2OiGcCgH8lA0B27DOalLrjST+r14R0cBMuKgYuTAI7TS36JUpZXH0xldzn3b1HyhNNSajSTjGRmZA+M/yCOB4CtNWL1X3A/7MacbmvJHk413vpKhPctz9gs51FLOkecYAuQwms9+TSW2gaHQlrosQDB/tKODH42OW8w/5ief1Kz3nf4C/qdLbj5MGjFIPQSi2lpFX0kQtCeFVf7rbnhuMTQlOdCyiAjG/2COPTchjntlknCFeFgMjAzITYcortK6FNL7KvlcdM6rugde1MuDPutl+M/LGkSIaCGayTt0xEcfYE+5uEVvYT559LXdQk54IXJkMEyKM1g1882d92DnpQbVhbDz7Dv3f57I9vlp6miEm3qwn0Q3B4WPCIGbLNmPIaC/isT+EEbGdxt5SEHZIML1h51vQ/hWfEQcCEeGvLsToLI2xn37IxMaF0oMwCKxyXrpPT2aVE2vh9uuc43Slo4DHbd0xBm0qKIQ2JjHdCFncHPAkL/J+MYyEYFthojo1fXqo54zefVoGPt4zp44Wlf4ZnbPTzP23m3EhRXCla4B3lhgp/aTFxE516jvtXbpWz60Hce86pFUtq5eQ0x+NsV9Ipkn7C/2t2CfMTmgZ64O4RDK6Jm0H7H6DmpjawYLtWmBgMtdOj1A25lum00vrZbF9W/zhByWFL0i1sgMWAWhuqWTJgek6eWfl0wYgsIgpIK+07cz4pk/iYiDxRVqcWYBSePKQpX/5Z2DfiiY36maTaWgZv6M/3HpaPOKlR4thpZdYeIwWmmaxZIdkteR/WuMH1K3e5j+1mvYT893Q2tCZOrGYoBVQqE4Bq3jlksdjICvmNYBrdWK1IrkB6aN3nbwiWrxoyVdg4cTCByUuW7CJOSMw88mgQzKEBIfA8adxsA5HR6b1csJNtNPE+2SzNiUmuZwoaBlPULhtYldSjz3DLVMkdsyHbRg9AqQcudO0Dck8+HPE9rTHt1RgpXlHeHhmF0sP52qJcn4q81HXrOjAx1lopK/j0m46Q6USupNn5LT5Zc7/5FP/vuF+Jj2hGNUac8wVUivRUr0I0wyGN9O3pIRXrWnqivrlHcaoX7bUHS9fmd7e+ydNUOGhC2yjhy+ETB4x0ZCfC+we9q9ryood/MJdkHLk++E1wkLnvMwGXmrTBoAHysULWZgGTECzEySGr+CfUYdp30MSV2oDu4ZSYFn1JGqpLrZI4cOgg6G0Br9X/PrFi2TjZF9HD4g3O0X1WCtILl0oD3vYgscI6DIaDy8uV38i/UfgaFAy/yG/kdg/bx2YwpIbaddzGSgPD2ePojW/AhgOsUtaZJZRTxn10BZM9svVAVSQGAtVpOoILU65ZWYLLZDFnp7nOu49n/wU/KXfcVw/LRtUwB/lv6W4+gQKqv8eoAdqsISXxH4uR5nbBcMbiiHf1QeuS+o0rOC7E6jw1nYW5NnQ5sy6OV6T+TF77sJ+7YXA5X9ncOtvim0lacFo+Zt9u3zJuUIQXyWKiJc72YMmmaVkGFUNfxQ+VwDJWQbt/sohIWUX49H/xWpWiSAGZLGt5vnMYdO5UCN6zvs8z0K6kHdOOSJE+jc6yTJogVIFJA+oijeyOayPcXduGt0N41fm1eokP4sAAICla4psDg7HqrKwlQxXVbh+ZGwKz+BxKalVw41h4ZRTuwxjzL5NewM1g7kCA8WsAQ++HEFfOC0LX6oC0BEqIuecv0egnQTpIcZyuC8hRlPFaayffO4A9umRLY6QQf452Keax66KFX8Y+8vFCHVcbl/nemoNLK8qXOOX8bBBuYuUnLkNoqhk0oogdHDnPzAvUUTZOH4mqqPSq3YR7aCCOO3z9HLM/61TUkw5xtO4GyX+a7qb+Bla2fcV3yJz6IaoBhRH7Fpm8SgiYE2AzoR+zaIXe9vbne2b3IjpVtVeB9/ICt+LmVvWxGLRcNzyj7mjz0WJTrjEw6+n4b9v7i+XiPjDn7OlZzqHfvKpqBdJDG8+88ZC4RyGK6UxQlOTRSm78h7E1Ym2TiMBNTd+bOrvPC4mp2qnGkaZVITK66J0rEEW5Fayn90+vFh3OixbrwJRTf3VzDnS912q3aMNnNrY0nj1R9KFVirusf61+vMdNzd6iKdN1SpXIRmviQ7SRgtWptEmcMhiStVNFSyDfeuBIahAfG24iPJtmxsO8KbrqP5duyHq0F0gVmtQ7T3tM4tmO7I1XNNRPI3/37dFmDWxv7vRG7jA1yBtJ8R4/Mdz4mHShZEjsoT6Vuiv0smO51z6S5T5fRKfNKZx2JjCZVgEAMjAfv/oLstJYDiQoo6EgoC6DhawJUtuW3aGbsOT3ru8pijBY8lPj2mSkq9jY/dfdaFWuMzB8p7KeH2rvsNtQulSHNRxsK92wiPNFBrHchYki4jL3rrpBMJx8IHGalIk8QHBlYpYyTDLP4FeZNKW0Zd9VQOHBTJY//yjO1I0ebqEbnK+K3vYVuii2AZH/vaWa16kOCbV3NCz7XTM6BnbGbQ+NEDCzQ5cyWQGnhkvOWQ0TeA3tzyLk5OckWIidJ8g1HHy8liE8BK3wLNDzZjHLDW1uHBWf3+Zf1b1auMFKcl4JMSanEuM8zVnn+AhHgfA5E3iNkw87Oxj37To5hcg488A/5Oqditr/kl+n7wcVrQUnbR+JZLpzHsCv8FeVJlZtMQYGJwMsFVGYWvGpYeeURB9joYoBtDhUFvyTTmsDj1nvrZaJbdC8nvEp+eg+NYzzzMzUNTn45zozKtianWO4cP4DiPCYL5LwVuUMlXQSxHqjapyT9868z9+plCMh9vGfdLGFOEZjfH4FzOSKNsij0u1OiNfI8+flAHvz0XRYzibyqdTQedjz3D8cDXKJvZw+fPqbjNKrfXs4vtKvg/yxZxbGPUqINX/o0imtBWdwMhiq1lmB/3e04avnKED+yE/+ZHdBIjnLa0scQ8hnK4/+lqmWX1ToEC7RDO9lmC6PVQGiU+cI5FpGtBz84z3GdaQeRT0u1789RpR5fnpGb1KcpnJYeHBiE/+o3tBo5RmCU9J32giU9x2niYQBHQOzVxU2YkZDjXsj+vFkNBKwfZdVLpLucUsAL1doZE9zNzKC3NyT68d2OSS78W8MWi295kltvb7T4xKt0FVJaVAtiiOMRuQ2ZE9FndtfhHfYIR22DKP+mVpFd+ZZYs1XGKgPQPuwiCZesNv6vNHvg2teUt6DmzzA49Cr8+i1S70LzZxRrtuW/VXfBipPv1WoRrH3gpzQ+pjILBUcpVOzIepl9rqkSYq7Lh0huMg6PgPAhH1esrmCPBvcwVwkx6zddze4d32MqmApj+c+GqfqZ/wrCr6Pc0Z98eypdxu4i/zBkHVTd0OqDU6it/xaOQwTlG9zKWQtCgg0GgzEopHHbyJkev/qahvRhwJhzPeuk6SywAFaTvDI7ChFD6thkIVzVb4vtF8GyQI0er4nHgEnCINGCyaETBzcWL25ZNfxv6tlovoEM62RFM+7z13NBCs2E6Y9abip7Hpoy7JXMbw/3ElKCt5IIvhdXR6Hmebr5LUKk05u8aIQwl3p4THDVM23oosprPvvHdEL292dUczMS15FlbcQ4zYCCJ4h4XSUipHq9X7P552KAyjwh3Jut3qCQy+dzJFd14hO7kDJ9A+rjNDlr9bOkREblnexKXopBWecnltnJ7zG8jTYjisWDZ+qhWmkvmXSn5N7PGv/HaHC3z2IIqpLa3+PetxyeoBv4NlwDvshPmvr1xZgq2OoH+Cb/GM1GTJFWBIWb3U5s3c+71yaTgnuR1rGkPLkCsepPza3LNJK4ofbJ6/B5E36XF5Gif2StZPjtri9P70z1EmdunRhPVkVEV49rTDqRqaZyK+7CWzkBqgI3EnQaG04W7X4qgU/VXwo/wm91Ms0KYXJjeL7yZSB3y3sFg+uMnK441QKAP/RhvhBCJcPFXodHqLGPVMgmVWgXxCaPtLc/5O0570EUT7Vx2+3hHZ4/9HkgKfR5qnaNrNLGhekzTR/O+l+vWU8sre/UMCdXeTn9h3PqjZDSCRGOUcBJr72PMWkf/+R4NLUucrGqL91UE4PxuBo7JFQZp8p2JvROvva+NGMhQll3KQNoF0oTUWfvaCk8PWfpv0FxT0PvOJVRMaNLBc7cXpfZdGpW+rJkJTGicFQs2EMD6e2I8Wg4vhdJl31VzV2VhUBKduAOFGnM0xI4IHO1V1u6g1ocumqzGSa7kR3Q/t2g1mmjEf+QNuXjmwQ2cTvltbcpnpoLlP/e2ncGVFk912KGNGgP333qeGSjZvZ6Ozi4W8O3pWd1hsmOvy01VHOzDxvRo04zSxe41df+V3nbgmeerWXx/ruuigMC6uLbcVnft78CBIGKoBUhsLU9f4NPJlrXRk5dKBEvxgcuHk+NqtuofBQf9/89ujEk0mDcvsZowFBZ5SrnccqS6Gky+994cvEmBGvKJV/BrA0WP+1UNZgkgKQSVS8j8M9ToroLpx9eaTbPjtEYDTVkEXRXu218NgpzH5cNGWIzhaCYKmgwMDlFH8RGjJs1eycv+yUOhw35ldFiGZS8khVdACkjIfniWk7ncrRRjT9wGkNcJWpvyKZi87id0F2CO5IgsImwemGLTV9jH2IE+bKyd9X9SjmuWOqwresYa1AQ2FgbaWlmf8WR8N8lKSZsc7VXUqhq1hvzNqBdmIHhbPAGtZnb8+Kx86XWgU0unyVmzEKnhogr9zs1qNQN7Aa00In08BU3lj8a2FuaYETMfcn2REC7m3JT9ayWK+gnaIxy3vKQlbq5rZrh8qgU+JuS/RCzRpQm7KfQ+rEqSv6wY28tQzE7YqhrZ41/6iTuOHOwACbQ7CZeJbre+IiYpZzLtZTjszB2u3TrYm20UAGnlCBOVGxPKJfQN/g4thc8GV8XNI/1PLB2nudqOUp+N+t3obAZoUsoIH4lk/bGbfF4kp4W/yWcqsEHvcjQcEKVLklWD7T0dPJR5IpXBc1AqeYB0NAHDWSNe2+BwlDBzqqMquOPWikxyKOKJ53q8UNrzKJE13G/+hZBNMtGCQ3GYozmK7UxXhinIez88GHMXROZel1UPpZgUx6pdWsT6bndAkaXf6gl3pM8n+wu2MPzB4jWcgEb8NBS9/CaRPch2tOEXcjB3tjGXPcTOI5h455cVUoeLEtUiA3XrHl7lK+522iqmaBrtxN5iaZM2JIB2HVip4/PXH39RQstScmEftWjrmdtEK9aq12AhFrD743yhhAYa9SZRUViSH/yzq/cOcW1NrggMC9WxXs06qSs2PoKkV5/0gkqX7muNnKvEtrMxbdlSnfx4qx9+0FiJLcEiHGzuYwN0WDp1bZIPzp2XilHSmEiKe9GixdEP8Zv5EAAaEi1KMi/+6jqIR1175ZS92YoFnHntRaFG9J5sVBZXAqdMzWEhlu1XOqhUU7HMC03dFNSpJFhD6d0PLauyeY2sZgQvQExm6ZGDJV1ZAYvkBJucjyYCBhFEzllFbs4JCwi5Z6tYLAyHD2Aggprjoz3Bwhxj7umr7GX27sxsM+bBzvKwmdG9lN8k+kHL4wxizaahMIh5f1gxUYh1/ljxMAyX/1GR/jG9BBBsZuQ1SA0C4/9I5jnctfOY7UrN/zpspHIQ1akasrguqu+VejlHpE6bK5cKlY6S6FBY70KftTgYTBXTKyr3TmBpIXyfwSxRzlDhTnbmHxbVBDNzvck+36yfD3QMtWG3G4zk4JhUQA41AitjulayvMKS0P8gAyoCQ8tM2vpjBCveGQKY2kgdxotAQSzKZZOIe5QjHG/gbLYARU5Bil8z7l2ureMt7S43gZRDY/r/0a/lzU1+3nM9tEo1nLNrxowmGDrGdlIeEhckne9MB3ADcDfYp9b3eHRjqY3adenROZG+E7auqCIlppvBGosCnCLf6lbaEpOHqeT6BDfJIsPdl8eZNXGGyrsNZ8/z6ItMHGLbO05NqQ4NcOxd3GAOVWdZ4vFMrAVazYJaHy0EUjXDkYhVqHUybf1IlxOY7v1JZ6TYQB8ivqpPKBOiIBQ5bODRkmOBsbuAWdSslhNlO4Q8iKI+ie6ZEdr+5yoXOjGiT0o9asit34tqluPrit8wGJ1sUXS2lh99eaXFlD+UYGpzJNOBtL/8jdMhsH64q2Az2nfx6iZZGMdZHgQOz6X+gGBtciMtEtawIz3Y81WLkK98SFJWu/t2VzW7Gjvx8LdMlzZzbX3HTBTJQD30seJzyIKn46LZpu3K/HM2JIOAQC5NxawjoIMcRCh3VnxxuNaPeaRjFBKKjvFSBqajcYwPY8nXcb8/59IsOepCUgndPeDWncSYfG9vDmHZMTmDIBkMKwIfEyJMkYkysM9UGnKR86cCOw8ev+r2lnGPGb66alyqMmuQYJ9cK6OxraXBnuxSuKkR6ia5hbGgEoqA8V8EJXrzb97EouxZZUkFdpFvz3LDkBfS2SN7nsOPRv56KaKCroM5uRtz3SFREXN4gKaSSkNrjoZPG94sw3SfFy9e8gkl/sfSE2YrNPtjKXV+54aZrEysL3gU9Gt/yI1vLeFg6xXHWk7aBNSzbTTcIbBiBsAzNyJlv9h8qB4D6wcH8niPzi+DI0Q3cFKYGU3mEBLF3y2Dt2h2CgJROXBfnKWLDoeQbf1dPT9i53rxeYt2ozrx4BBbL2soJWiFIXEMTkTIo6jY9A0rR8FcZ9XPdRFCqxsJQxegKhTKIwoj5k+UNJFpOgk9KoOcqt8rUit35pff89V7qkDQ6SxeZhglnpPQcSDEz9ReKDhA7y/Ddv7Uc8mDbgS4M1NLkZigku6zV5p7pJ7nD2fXp4Y2dULMNpydZuYpxeF4wLUst2717LMYNJzPU5I30dFTE0VkL+GrT24yl582qcLVtu5sUF7UkJpigVg18UwSFuss5JCvJS6d6WgCsR2A6nBnn9u9V7pCvNTCaQcp8P4kIyJ2n8SxQO1r/WrHvNha77N2yF5Q1wjs3qJR2mZ7SWkhRA4XLlK4WL/+1/VsQRRdZPHu+p5w1d/8mAE/oQUZYv3/4zsq+MBrTin6SBqQp1ht7DMEShb6O4BUVoaqlkeQb26BglYeWxNkER1Oe76uyT16t9v3LdbfwHPdzpKa5FVOyGTyuo/LSUpwvfN6IvQyl/+RBbNYIhsnVGTNXADHEsoO4MmdzaQyBzxkdFZrIav5vCVuPmagPVQPldYKMf8zmN2WiSTvYYaOj0SKx+hVQ4xLpxBCTz0yNy7KNLDNPKNzEJYCTDbrc8CjPZgBTAtvFwzD+ChObwrwx2i+sO3xCf8cjI4dxq4UVHhASIQ4FHlpRZzPbO7gDfJNY7GXepNqeB956A0hIiqjIAVNOL9afr6YDzkGF/eZf9VG8bkILKN+3A0L2S8nsWvsY5nKaqiwbLYynL/fJ08drADdw8wqLj87KJ043IdcVFjZpt9MtI8nn6XldVyxSNDGBxXT4hiVG6nNEdWMKHg2VGlimHLs0e3DJ/2MgsE11Kx67r4UGBe98uOMWF8IkfQdfP+4KCQse7vW8ADiGqL9cHrne6JN8twYiQz2Ghfc2lKIO1R4zSTv5sV7vefJ1Br/kxKu0BrKPlLRATRxAiF99rnSOfUYq6MK6O1L9nc4koeK1bi0zECncm4MeHTRSgz48aAN1x6OQ5J9nsCGZDUk0t4rm4CnjXQYKyHwps2gbRhxQTTFnhgs8tZN+k5xMLDMHOZ9iJXjX46cAxBopmkwyRbYN33ctam+QPA1lpzDY8F1D1KCu5FnARfSysVzZwylgL8CaWWFOYA0DU6SP/yQ0UQe8V/JcyCQ/c7aDrVEoJu72Z9x+NSXMAXz1t53YeW/dlCSrRaJU00zJKgJiXLURWx/dupR7AUyHF+9EYo22pr6zLxRf0XZ7zlGp+uR3umJ5FRibsbRG5j/qcs5V+xcQvfbeDTXI605u74nZfFSmefItrDS17vYQTu/reIHHoeutgo1DDndvpRy2O3mgohHE/LeYsgNmX1p9OrLdAjCo4x43cHg2zyHxqdFMEbIPnYo0UkasRhNFfUGa98yvCpcSFz4gzawOu4ylf+ScvvrCX+O3unXvBAhF3mPalYUq6wKdnHhdxAGZIxhhcTMJmw+4sdMIN9Jz6RMBLb6rCT7WRhEGPvX/HQV0YG+FPhBJX0LbIuBspGHR5y3QGE53GpeaueWy4SDgu/S6GlF05MfcAzrg6vWR9e87GylFmTRB0YRGAAdSmec9X3sd/wQJx3Sjsa8cIVDNg2PgSndQo9PRlFcRTMPiAKPYOEu/R2mM4oqVZcZDG2lBfkCcR4He+S++XYu2Rm3/9wd/fMXpqt01e2twPC47DPZbOlBeTpe7G9wKQfeFOluu9RXZqMA/TUdH1tRQpATaZMD7X3eXpzArGqguGZ0OjjbOGXMn/EWTSJZMev9b4TdFpj7iyQW66QZEn/kfNJ7X+cfmTKlwyqrXQHV9UayMRoa5HFCRwkdQQqQApmHvE6ZpGoPN1Jz5/N7sXP2tdGQi0U5y6fELmubOZTi2XZoZa1eVGD13cqVfxLU5faZkge6T29YpfpZOHo7dTFVcJp1XIgpfiz/fYoK2c0ZS2508sFONLuQYfeW36GXVRJzkYW55M+qozrmLMIn4OPBVQxBpGAHu50OZdinBFl+YTVJuTNI1TfvFcRqGwqCGLn4bjUTQXOJVFl9eebjXbY/y8rStMiN6i/4tDPds62GS+tQDNid5VC9f7Cj2SdOC3Uee2B4UFdKxXynzWGkt/ajd4Fyglw8OhyGBq6oFrzs67H2+INN0nKohlnmlsVxLD76GjkBXMUIWVoskvP/VAbw33fpSW2nnvi0SXuLsLsNcBA1HN73mm2HyIvwcLRZDUG1JIqWc6PnFWGSMQM5uN/OUzNf4WgFeMggft3AF+9+721Ir4PDSEoMbWgAuSPFcHYTI7PWWMfPIFGps8Hp4fZ0pFuvmmdQicRMFIUgU7lbtPimaCuuS18zbZ76G/RDDIp5GiZIdunWgPTlygYJInGzsgAouWcSJ2rwUIkDPVkagyFoNn5DKP3mFcjwdv2tWkIrkMCzDUbkbwCoiIgK+DqDBiLATvK1b8K65UmSalz2Qm2P424s+ihyrHxX4dYmXPfSkS3nFmo9WMOqIi3ZCjry7fC+rrkkUSdWZY3ZGl+uSR923v5jIVtDsRC4pE1asKJEQY89zawINCxwmjrjqjGqrEMUDOy8G5ySQVUwTHPSK7oiwuQbCYkMwmWF11q7ERLioBjIHeO2A48zzN+L1d7JKSBrklm5A1tAJvnxTNLemXUAGcjwZMeVAG4iGqR6zqGsupX9CRSocT21bMXTnHC7VM/UmpPxJAPhuaj3q5OuKxVrXPJ02FLUzW25u5RhG5prWv8r8Tdq5gL1tIUeKLQ2c/6hKY0WUNML7vFL5zlNUHjJ8gpLslHZsTgnZkLlr2qI/Gq4Ts5xqWQl8J8aEpDAw4saw+kirZfR6nPEuwG9y+wLg4ACusZoe7txu/PcF7LJBlj77ruIp2ivzlqxU0rt29U20fmMxhAD5zFOT41BPHxb0fmW0o+SYqGLttXv0oTSUhuh2EthZsFXqM10Kcu5GtJr6vvhZ2szRwXTD6Sx3lk5gCoqT4h95BDEryWec8LXOnZJKWoX/ncrMpsOeDSc2TVcunQmtAwBtqMZpj1J8X0FVUviM1RlCQmjovG83BF7ziipllLXiAFJFSAfJPUUeay3UjwdSQWeVoCd02Q45WeRU7boKnXZ/ZTC3brx6st4ngL5AE4MB0alYH0YL5kTD7jF807PzLt881QQG0Tg1phkGUhXrNMvcslPwxHL4jR/iaOWSRfAE1DL089Iqz/jS/aU0C6uoMV0i9V85CjkkFQSsOxUUvPc7N5HXZTcA0NrnbHYDJ6voHSy/txL6q4obZdQrHgSd6Dy2G9PR9rBfaEk2ZH7T2LNECnghhFlPR5niyoY7R5KcAINVuOTotxDQB1UBSrj5ynUuDm9TzoMacOVTk4UuRmhlPuArvqupztB4TWqrAK3AlzAJ3aH9VvJCmZ9KTDjeRu1KYowmBAsAIudwDaMvi62AvNmAt3OTnZBV7aTOlomXKcGXH4AnQ0V/SwtvYuJLaWjikU+9M/J5O/sGrHInXcrd0jru3Nlr0ElnlT/c6l/D2p0hhKy3BZYm7x2qzMaYTTu7h4TpzLBdt68z/gI+ObG1JC55rJI80DLPEHGNsAjvW63qz3kv5H9QhCFIGMli6jGbUse3uYstz8rGXL8deHD0u7k/SK5RDfm4arAvH9+QvoQebe5NUXM1YSsBxdNFyzRarF4z6pAsTqUggfWaqn4iMN64fwngKVtWlXWe+aQdCrD43nN4hgbz7EMXF5hk6LxwkH30lyUgEjJNYEzKFN0OZb0eprhXM4p6Y4y/NT6q8qqXVZohPYBi+RSBbq6lAKOE+x44n7a+xVXXnEj86bit12KHKgwjLqsGzIJznFOi1Uy1yXGvYK1EjRpQ0iCHbe2WvrrAjqoB0in4FxoYUeMcsKcOO4v114QK6H4KjJ5xa0mieocDBri3IXB+90SN6Fr0509pRhotuL075rRSJwGVAreeg6UJTjeaT7IBfiTNSOaVGbPvzQdZ4yHPR/vzAsxjTR5MYGI9Rbn/nmZ3Rv7RGlVJlCfCadzqYNU1Tg/9ptBis+19/KFZB74v0wqDiyd4Pq3Fk+CzblcGK3XP4LLSkrz/1KiIdlzW8McLQ6QikzkhAAFe7butqIBAGaABdAECO+W+ZMzqq6DdcL1lganKcp0Y9cj6CGM1AsRHKDuKK8klgdvk2Ttxg4+bdS1p80G/0iqLKhuqOjIYFmcTXG8wb949Npqn2X6nbL+1Mp5m1ipPuGgqIR9AAlVXtg9rLxsOqDedi0d0fsezRyJ1hOs5x8BUnouGr/F5miP1nHYzCftd14NIXNLYwQusf6anHJUhUe8qfXbvVAJg4V4s7wB5cHT8xfJ9O0lzEPmi4ylGk1O/HnolXM5+FFSmb27X6wKH0pXLfc95+95Vu9MstjvU10GSaOeOipnnT9lFhLk6By3QL+58HhFtWlqu3RZzuBGL2eBkp0kMEElWfW2wIwaNuEtijc1DI5wp7JgMZEkfn35jZikPMJpowv3eDPtFgrgVAAGTkKlommIe1z3Mv82EjSPxUKUcHgkwuiy/4gLYMuo8ZvpVt8SDZ9ek2KVe5FO35UAaN1vUWZwf9N0cPdGJy4/wxfo1JuBToLA4jDBgUcpyhTzDOGPOZB2MP+RKRC5zCLrUm9LPLl4Tk7bQ7u+eaPZ4e+DEk5oIFWS5qwBfP2dwCFvROcLYpbU6vRXbM6aPFC1GhkWzC7KAFZeJTPEoJgF3IW4R9dv+FGwmwAmfo59Jw3nztXUgzLgGaB63ep5CvA0EPhXBffUeeBMoa4N/ofLXw8n8lhhBSldJJBRfkEr/iTrzNu9P6I6GKCSOchBq3o6wM4a73woHEkNudgCTOYyOQDSR6ciLtR5hIKGYuDObab07++UCIJnxNLQVYsW/5suPD9VDfNt6OSqnJH0Z5INMcUJK0zxCLoQdpbK5QQFsm/bDJHc142mT2e5BJjQ3XjlSxy0raYiGMvPwSjbem+q6YAAPUXlWsuRDp4dD9Mlcj/0n+165CvNuhsXeSF6TDLyDodvZJ7vYHsNtdlDtrY2TOmPdQx8Og70k3K2ZUFXmZe652ArDDS00sQQBmNg3MDG29/UgsJL/pCl26tsKuyXsNT1lgrVXr11utexY/enEuLGJTHSD3ESZ/0sy/t0GNgnleJvdZn5pbni2X2UP3Z1FSLJ7xwEAte8dVPgTkzKjBLOpEdlfN8RdltzAeYMaFVKyhNI2zmUiN7m8H9MKsOwZGIuQMinukQCtW+Simt0oYUq5iWweJz9MRgUE60LOSak8gwkt+KGSQrYtyCZwf10OQfwaxA32MOmXRneUwyHNAT8RKQniHSrNiwsL9thoIR1ZGMLneOJlH1+faDYoSavQMgRFCJTCGqWU1dwe3w2LYKS2qwmTQBOmiKbnbxfv6muCPkGVvyMrwfI7TfEeSj+zWOWKoJ70Cy8emNcbiwgrNjylDGnwH4IbRPFb6wiAvJlH0/BTUr600YnVFc59ym8ADeHF/BBd1B0NnNX/rSie/+yKCKNUKKuN+W1uWtAixkxaP10ka0qdX+3ydkH+v24Ea3kwK5Xd9VuC0oD1EiVJHDSpP7V/KyNoBs/zOeWvVDggitsW4nNloXOKk7stmU9Z6DR3NHiKSTlBjyvg8AxP6BgEKRHZIlNW2hbqdLCH5BUNFl64cWfO4+HKKUEwY944hNRbmyVN9l5gREHCCf4CrWeH7EnoAVXKDArLqE5DHK3eHeQ+mQrin4y16nEYk31sqyQxyPoJFg3xO19jrfMJkBUsjCkNtaBcyC/9x9Hpb0Z8RYNYgNCWNIvrQYrCrI8EqD3nQsNESs6TGwMMiFzng7cDNswi0vl3wfqZlkMRcfBwV4MoeP93nk5Mjj79zRub4RVhpbRm4Ay9JUszJM+WRjq1g3yhia2WA6re/TG5XoWGAbaFD2kLB+XuCtplgP1TagK+Ohspf0NovYRfMNo+/Kudumsqi6Rv/rNsRjXKIaipxRyVf3RNCpdsQddJ10Gbr4EjQOmJA/bp8SmO/84Q3M94cKhIucvxf6DvYVHLgj0FTkgP//lZ3ylDOi5vAvzZz3bVPyrifxqYQJXDKCiBGRp0M95UtICtm4TYvyFDTdl1UVGi6IE1jHTIauJCxgcqhqVMdcwjVpJR6FF7djQFhs8A/ASvQ5N/PHGi9TVWNHcftRSrjBJPx/gr+/ajlTEl2g3699ks4/9afGOCAxrhlpnRXPbvA3PDZvII+jkDPK1SXdeo5LPzJI05nDqUQf8Imkfk5pGNnUDNbXBAXv/2aNlounjpAyX8BiXZ5/3ReaQFMVWJOEazU4+0HfA5ms1FfTjwYMZddMAUf5FenUEPwu1olRV1UashC/EFWPqpelMK8QVHIzgA6/8SSjfWfPo9GXHCgdZc68H+e9qjHlOJt4GdxCPZMSV9IXhdUSvHYhmi1lojA0EnqhQ3gs8ONgRLvQPrq7tGK5cVyvEYj8H7jkH8mbOHMQvBJDZhgsYFrHeoHWKpBFgEivIsMabJ8yYGjt38KgQEmBTwuAHISXtXw8vzM/ef3a3d5cxpNTP5Sd4EpMw8gdNx8a25sWS8e8jkfoa+R8Y3tJCGKQ+auOyuX95jXlm9iRm0JpVcllVOSl1WUZ2nY6HvE/Bkq5Ny+yPJEfpqSXoPz28AaZqP78mdCVmqw70OP0Ek13GKNWJnCpT+q5q+SdTv66PIpG1e5sePw+BJJgDtiaOg8h3iPBv4tNi71MBfbc0zKgAAWU2aOX5VtviZaH2CSsUVWaImsP8S8kW82zuvpzoQ7AWx3vUhKA/7PvHBP1SW1ti2bRIhRmJXWi2U5rjBMMrqfapfCJRq75HsZlNesAFvBrGhQGEiAECXB44J7QFIKfhuhZO/l7mHmjO7jJv21jcGDDbU+ItBaO8i8n78i4z+dgu9jQ3I8+jsamilsT1rB32cHbatNKxJ+m2WGMiOaBolBBsTc4trpEN22Ry9gKFxEIJeA9ncnnTeLHOdJ9Ew3d8gWD2gNS5SH7E9mOr/FpctXndfOteoL4fjlIWMBOIjYhZd3lauUL4qm/RbIJzA1Tr6JoHlHjkVzevC64oBS77JQPuL2INmIuOEvkUk/svj3KhTxM8YAtZ7YB89v1RFbnz9sqEOM9ceB/C7N5jEVD1DtaO6xa7MWImtUR5ewXnLsIGGGq+ziwlZ5GIumQp024UAyu31L0O9jhJNOCPHb7NJfOWCzNxBjZobt8QgJNBruI/NrIea1dMtKwX6Myxdh6X/nKGFNpt39Nr/KZvLckLma8QJBVDTZ4GYtGuxy3PvPCIusvRFS779kO5i5NCRqwb6hQBVj3iY3TdDrAiHp9HPsYo/+6WE6Qj1gnD5o8rDR0xU7IwvXGcil0RMOP38lxEu2jwE10kWiwnYRbdUovxlKYe0SAS1A8bXIv2YrSUfqzPkpdpRn60agl/p6+mWtTk2khIqB8DDY0Cep3w6MV+UEcKmnTcBfMVVon1pXWGqvq9wRRzIR5j7LNf+HPco0AaEBdrC7O1AK36EcTyPlwotGojm2H/iqFJLyntZj4SrCHoMnhV/SVES5IxPZ1kvDWhVr+IqtH3YPkBApkRJlGzgiK6LOGnYHoz+naNXz2IHT3C7K0VPiXHY8KIav4KcjG21OIaNAx1Y0oObI1V23IdTr5PlqiwZNzqss4JMbThPhF6S6sohakmbipfdTb7bAshHiSF8knGrn7PGVgDURY4u4J856Er/K4Fh7xA6wj8542My1k2EVN1bjfz5QLwzxF2Sr22jbsQ6fhKxQ2FHwzlpKkLdM8VY5JfVbJeTdbWMafoaD+TqltW/J9IgA0jLXl5ECqQilLrAj3ew2LJ32wNNveB+Qyl4fpQisXmCLJMaNZEnYsq3i1khOCf8gpt2aWS2l6+3RevJlUiuyNAMsDMa2o52aayCPZTsiZxR2wABeX/FbU221QIM70ZFqDKRQYn5QlotsORugPuMAWGzinjW0uOpSoJW1k9a5NHSVbSmglUcXA+jWJ8UFXXqT6WimzZh2pB3l46CVxx77gJc32Tu5gQeIUOe1E2vqqSBGBkhm6z5jXdn51wgU60WtJVIFcluATf0vEOlGrhDMk1/azNknKMsfxUKPsFiK4CiXsoJTkHI7aoXJcCVGBWF4fEVYNeScpSmyHkX619X1wqyVOm/RCKmToI44TtQ9gpxkOfMHJRWDFzjMvjp7RkGaWgB7ac/lfgwbafZU2eNKE27YTfGOUocJCF9Alqid9ibphLEXAXI68UTlhbkxYgtxCqYcujRNjBpH+ErJYwOuqPsLjI/nr6NUKIZveEfStGasZ/HZZ80yUBr3hrcMqLzxu8TBAC8hTvKuc43uzCoYXvyPJ4GdbhCdFUHCZTQSAw3ToPnhGp5JVaEOan0rvSYacpbmVtUV0/Cfpy1tQUXH6RIM4M5R81DIJ71NdsSCDebCKKzO4589A+IsnQMTgOBC1n01cOVhHIJoqTfEq4c/34Ot4R+869iqvo2wF0mw4vv66zx20HpQ2ABhulIKGhvF1qaiw1joEY6wCbvGn3sZRU10S7H2Wso+GGYM1TdGmAl/QjkBHFya5pMpgXsjVR4saBJ6nuueV5nzDq3IYhFD2yf54PtDG5H14MPwj0FmqA2nEihTpL7spb2zg4QP4O0UESRjRurFyOSDD9mtOEumrsO30IwdaG/Z5xhGoeqDG0MuepVUAD+Lk+Y8L/HclpF2z2VpXAGYwPW+G61HQGePcADgrxbkCTuF6OQQD4MbH1QPitMGKexuGOrqg0J8jA7qEPzIwzgM4AAMEU3ZInWTTpYm+KvuwiafB/kWUL6tpxLumIID6SFtSkVBX13HBksldxSrgrJFiAOxr16qVSmocZpfhPIf7VTw+q3Qy2oXZqmtWE4djDXtr5ynQiVl81TbJWD3VQJUpZKs9iWXPk7KUkJLZP3o3oCXiRdpmXVj6ZjcyFAzi5vcmrQjdNEje19y49+IKAFNbqb5jbE1w0WkgpGN2J5B7iuKBy9rjWz8URXUGmyf4YbQj8Snd2buNCidmhDtR4xg1sDvcxfecF1MTjhpq6dLM1hTxoLUxRvpSeyYj33pBDVpmVtOQK62glqzyzpgBDZeI8b4NdE3d72yryp59o7Mkffvv3YZprfjzL5XTuKCo8NvAi8LVTd20bbKKDM1FcU8zGDPswWjtOKtLxc+Q/rD/h87j+YAbgw33/YduUU20Yx/haUwMpnLEGIhK5+oU1vQIWCLPxCcUQ0oIjsAhfRBwr7sHnqDYwj4K7zQ8Wn4WVzdA1QOCUtUo+bVm1Oo9H4zaj9RXV/J4g13UjEVJ/3UqoZaFJYA12mwyN3OiZUrWScEiYiQq3uME4gQAy/7lWIamiJ2ylp+kmVVD711elMy+FTq58G0IIQ3vyQAAAvr76Or+uQGTESRBf52TnSPyZZbI5f1P/w1fV7427IUTW9w+vyx3jZ3s0rS3B57HpEU5MSMu1J7ttUohexuvFcSOf5KpRQokenU4/GONMEmC/HMIqOOIeq4+0DdTV4YA4smyondao7DpxhrAWHTh8GNp3gXoO1WDNOFfrfbopCnwg1SBAaSe1Rj/vg6ZhMALiyi83MoC/TqVxb/IPkY4gFMkbvNFCAjOYliSdBtkGc1iK09VCdPuinadORZSQkXdNIjL8On2At1vtaMCMnhrm7v//Yglh5pVAAAAAA==',     // Dán mã Base64 của pin-spot.webp vào đây
  pending: 'data:image/webp;base64,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',  // Dán mã Base64 của pin-pending.webp vào đây
  ai_bot: 'data:image/webp;base64,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'    // Dán mã Base64 của icon-ai-bot.webp vào đây
};

// ── CENTRALIZED CATEGORY LIST (syncs filter pills + admin dropdown) ──
// 9 nhóm danh mục chính thức cho Map Spots
var CATEGORIES = [
  { key: 'all',       emoji: '🟢', vi: 'Tất cả',     en: 'All',        pill: true, special: 'all' },
  
  
  
  
  { key: 'Bún / Phở / Món Nước',      emoji: '🍜', vi: 'Bún/Phở/Món Nước',     en: 'Noodle Soup',    pill: true },
  { key: 'Cơm / Bữa Chính',           emoji: '🍚', vi: 'Cơm/Bữa Chính',        en: 'Rice/Main',      pill: true },
  { key: 'Lẩu / Nướng / Nhậu',        emoji: '🍲', vi: 'Lẩu/Nướng/Nhậu',       en: 'Hotpot/BBQ',     pill: true },
  { key: 'Ăn Vặt / Đường Phố',        emoji: '🥟', vi: 'Ăn Vặt/Đường Phố',     en: 'Street Food',    pill: true },
  { key: 'Cà Phê / Đồ Uống',          emoji: '☕', vi: 'Cà Phê/Đồ Uống',       en: 'Cafe/Drinks',    pill: true },
  { key: 'Bếp Đêm / Ăn Khuya',        emoji: '🌙', vi: 'Bếp Đêm/Ăn Khuya',     en: 'Late Night',     pill: true },
  { key: 'Chỉ Bán Mang Về',           emoji: '🛍️', vi: 'Chỉ Bán Mang Về',      en: 'Takeaway Only',  pill: true },
  { key: 'Chỉ Bán Online',            emoji: '🛵', vi: 'Chỉ Bán Online',       en: 'Online Only',    pill: true },
  { key: 'Khác / Đặc Sản Bổ Sung',    emoji: '🍽️', vi: 'Khác/Đặc Sản',        en: 'Other/Specialty',pill: true }
];

// 8 nhóm danh mục chính thức cho Công Thức Nấu Ăn (Cook)
var RECIPE_CATEGORIES = [
  { key: 'Bữa Cơm Gia Đình',          emoji: '🍚', vi: 'Bữa Cơm Gia Đình' },
  { key: 'Món Nước / Bún Phở',        emoji: '🍜', vi: 'Món Nước/Bún Phở' },
  { key: 'Món Canh / Rau / Nộm',      emoji: '🥬', vi: 'Món Canh/Rau/Nộm' },
  { key: 'Món Chiên / Nướng / Nhậu',  emoji: '🍢', vi: 'Món Chiên/Nướng/Nhậu' },
  { key: 'Món Khuya / Bếp Đêm',       emoji: '🌙', vi: 'Món Khuya/Bếp Đêm' },
  { key: 'Ăn Vặt / Chè / Bánh',       emoji: '🍮', vi: 'Ăn Vặt/Chè/Bánh' },
  { key: 'Món Chay / Eat-Clean',      emoji: '🥗', vi: 'Món Chay/Eat-Clean' },
  { key: 'Mẹo Bếp / Gia Vị & Sốt',    emoji: '🧂', vi: 'Mẹo Bếp/Gia Vị & Sốt' }
];

function initCategories(){
  // 1. Build filter pills
  var bar = document.getElementById('pill-bar');
  bar.innerHTML = '';
  CATEGORIES.forEach(function(cat){
    if(!cat.pill) return;
    var btn = document.createElement('button');
    btn.className = 'pill' + (cat.special==='all' ? ' active' : '') + (cat.pillClass ? ' ' + cat.pillClass : '');
    btn.setAttribute('data-cat', cat.special || cat.key);
    btn.onclick = function(){ filterMap(cat.special || cat.key, btn); };
    
    if (cat.special && WEBP_ICONS[cat.special] && WEBP_ICONS[cat.special].length > 50) {
      btn.innerHTML = '<img src="' + WEBP_ICONS[cat.special] + '" style="height:16px; margin-right:4px; vertical-align:-2px;" alt="badge"> ' + (lang==='vi' ? cat.vi : cat.en);
    } else {
      btn.innerHTML = (cat.emoji||'') + ' ' + (lang==='vi' ? cat.vi : cat.en);
    }
    
    bar.appendChild(btn);
  });

  // 2. Populate category <select> dropdowns (admin add + edit forms, suggest) — chỉ dùng danh mục Map Spots
  var selectable = CATEGORIES.filter(function(c){ return !c.special; });
  ['s-cat'].forEach(function(id){
    var sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = '<option value="" disabled selected>📂 Chọn danh mục...</option>';
    selectable.forEach(function(cat){
      var opt = document.createElement('option');
      opt.value = cat.key;
      opt.textContent = cat.emoji + ' ' + cat.vi;
      sel.appendChild(opt);
    });
  });
}

// ── Danh mục Công Thức Nấu Ăn: dropdown Admin (ar-cat/er-cat) + filter pills trang Cook ──
function initRecipeCategories(){
  ['ar-cat','er-cat'].forEach(function(id){
    var sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = '<option value="" disabled selected>📂 Chọn loại món...</option>';
    RECIPE_CATEGORIES.forEach(function(cat){
      var opt = document.createElement('option');
      opt.value = cat.key;
      opt.textContent = cat.emoji + ' ' + cat.vi;
      sel.appendChild(opt);
    });
  });

  // Filter pills trên trang Cook (user view) — build động, thay cho HTML tĩnh cũ
  var bar = document.getElementById('cook-filter-bar');
  if(bar){
    bar.innerHTML = '<div class="cook-filter-chip active" data-f="all" onclick="filterRecipesByCategory(\'all\', this)">Tất cả</div>'
      + RECIPE_CATEGORIES.map(function(cat){
          return '<div class="cook-filter-chip" data-f="'+cat.key+'" onclick="filterRecipesByCategory(\''+cat.key+'\', this)">'+cat.emoji+' '+cat.vi+'</div>';
        }).join('');
  }

  // Filter pills trong Admin > Công Thức Nấu Ăn — build động từ cùng danh sách RECIPE_CATEGORIES
  var abar = document.getElementById('admin-rcp-filter-pills');
  if(abar){
    abar.innerHTML = '<div class="admin-fpill active" data-f="all" onclick="setAdminRcpFilter(\'all\')">Tất cả</div>'
      + RECIPE_CATEGORIES.map(function(cat){
          return '<div class="admin-fpill" data-f="'+cat.key+'" onclick="setAdminRcpFilter(\''+cat.key+'\')">'+cat.emoji+' '+cat.vi+'</div>';
        }).join('');
  }
}

var recipeFilterCategory = 'all';
function filterRecipesByCategory(cat, btn){
  recipeFilterCategory = cat;
  if(btn){
    document.querySelectorAll('.cook-filter-chip').forEach(function(c){c.classList.remove('active');});
    btn.classList.add('active');
  }
  renderRecipes();
}

function t(k){return TR[lang][k]||k;}

function applyLang(){
  var x=TR[lang];
  
  // Hàm an toàn: Kiểm tra thẻ tồn tại mới gán giá trị
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text !== undefined) {
      // Dùng innerHTML thay cho textContent để hiển thị được icon SVG
      el.innerHTML = text; 
    }
  }

  setText('lang-btn', x.l);
  setText('t-loading', x.ld);
  setText('t-ck-t', x.ckT);
  setText('t-ck-s', x.ckS);
  setText('t-mc-h2', x.mcH);
  setText('t-mc-p', x.mcP);
  setText('t-s3t', x.s3t);
  setText('t-s3d', x.s3d);
  setText('t-s2t', x.s2t);
  setText('t-s2d', x.s2d);
  setText('t-s1t', x.s1t);
    setText('t-s1d', x.s1d);
    setText('t-s0t', x.s0t);
    setText('t-s0d', x.s0d);
  setText('t-mc-ok', x.mcok);
  setText('t-ms-h2', x.msH);
  setText('t-ms-p', x.msP);
  setText('t-ms-gps', x.gps);
  setText('t-ms-send', x.send);
  setText('t-sh-must', x.must);
  setText('t-sh-dir', x.navd);
  setText('t-sh-vid', x.navv);
  setText('t-bnav-map', x.bMap);
  setText('t-bnav-cook', x.bCook);

  // Update tooltip title cho 2 nút action
  var critBtn = document.querySelector('button[onclick="openModal(\'m-crit\')"]');
  if (critBtn && x.cr) critBtn.title = x.cr;
  var sugBtn = document.querySelector('button[onclick="openModal(\'m-sug\')"]');
  if (sugBtn && x.sg) sugBtn.title = x.sg;

  // Dịch thanh tìm kiếm
  var searchInput = document.getElementById('map-search-input');
  if (searchInput) {
    searchInput.placeholder = (lang === 'en') ? 'Search places, food...' : 'Tìm quán ngon gần đây';
  }
}
function toggleLang(){ lang=lang==='vi'?'en':'vi'; applyLang(); initCategories(); }



// ── AUTO EXTRACT LAT/LNG FROM GOOGLE MAPS LINK
function extractLatLngFromMapUrl(url){
  if(!url) return null;
  var s = String(url).trim();

  // Pattern 1: Exact Place Pin Marker (!3d<lat>...!4d<lng>) -> HIGHEST ACCURACY
  var mPin = s.match(/!3d(-?\d+(?:\.\d+)?)(?:![^!]+)*?!4d(-?\d+(?:\.\d+)?)/);
  if(mPin){
    var latP = parseFloat(mPin[1]), lngP = parseFloat(mPin[2]);
    if(!isNaN(latP) && !isNaN(lngP) && Math.abs(latP) <= 90 && Math.abs(lngP) <= 180){
      return { lat: latP, lng: lngP };
    }
  }

  // Pattern 2: StaticMap markers=lat,lng or center=lat,lng
  var mMarker = s.match(/staticmap\?[^"]*?markers=(-?\d+(?:\.\d+)?)(?:%2C|,|\+)+(-?\d+(?:\.\d+)?)/i);
  if(mMarker){
    var latM = parseFloat(mMarker[1]), lngM = parseFloat(mMarker[2]);
    if(!isNaN(latM) && !isNaN(lngM) && Math.abs(latM) <= 90 && Math.abs(lngM) <= 180){
      return { lat: latM, lng: lngM };
    }
  }

  // Pattern 3: Query parameters (q=lat,lng or ll=lat,lng or query=lat,lng or center=lat,lng)
  var mQ = s.match(/(?:[?&](?:q|ll|query|center)=|maps\?q=)(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i);
  if(mQ){
    var latQ = parseFloat(mQ[1]), lngQ = parseFloat(mQ[2]);
    if(!isNaN(latQ) && !isNaN(lngQ) && Math.abs(latQ) <= 90 && Math.abs(lngQ) <= 180){
      return { lat: latQ, lng: lngQ };
    }
  }

  // Pattern 4: Path coordinates /search/lat,lng or /place/lat,lng or /dir/lat,lng
  var mPath = s.match(/\/(?:place|search|dir)\/[^\/]*?\/(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i) ||
              s.match(/\/(?:search|place|dir)\/(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i);
  if(mPath){
    var latPt = parseFloat(mPath[1]), lngPt = parseFloat(mPath[2]);
    if(!isNaN(latPt) && !isNaN(lngPt) && Math.abs(latPt) <= 90 && Math.abs(lngPt) <= 180){
      return { lat: latPt, lng: lngPt };
    }
  }

  // Pattern 5: Viewport Camera Center @lat,lng (Fallback)
  var mAt = s.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if(mAt){
    var latAt = parseFloat(mAt[1]), lngAt = parseFloat(mAt[2]);
    if(!isNaN(latAt) && !isNaN(lngAt) && Math.abs(latAt) <= 90 && Math.abs(lngAt) <= 180){
      return { lat: latAt, lng: lngAt };
    }
  }

  return null;
}

// ── IMAGE FILE ATTACHMENT: HD QUALITY BASE64 (<20,000 CHARS SAFE) HIDDEN FROM TEXTBOX
var addImgBase64 = "";
var editImgBase64 = "";

function handleImageFileSelect(fileInput, targetInputId, previewDivId){
  if(!fileInput.files || !fileInput.files[0]) return;
  var file = fileInput.files[0];
  var targetInput = document.getElementById(targetInputId);
  var previewDiv = document.getElementById(previewDivId);
  var previewImg = document.getElementById(previewDivId + '-img');

  var reader = new FileReader();
  reader.onload = function(e){
    var img = new Image();
    img.onload = function(){
      var canvas = document.createElement('canvas');
      var maxW = 900; // Crisp HD mobile resolution (2x Retina sharpness)
      var width = img.width, height = img.height;

      if(width > maxW){
        height = Math.round(height * (maxW / width));
        width = maxW;
      }

      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      var quality = 0.85; // High definition crispness
      var compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      // Smart dynamic compression: guarantee length is strictly < 45,000 characters
      var maxRetries = 20;
      while (compressedDataUrl.length > 45000 && maxRetries > 0) {
        width = Math.round(width * 0.88);
        height = Math.round(height * 0.88);
        if (width < 200 || height < 120) break;
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        quality = Math.max(0.40, quality - 0.08);
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        maxRetries--;
      }

      if (compressedDataUrl.length > 45000) {
        alert('Lỗi: Ảnh quá phức tạp, không thể nén đủ nhỏ. Vui lòng chọn một tấm ảnh khác hoặc crop nhỏ lại!');
        return;
      }

      // Store in memory variable (NOT in textbox!)
      if(targetInputId === 'a-img') addImgBase64 = compressedDataUrl;
      if(targetInputId === 'edit-img') editImgBase64 = compressedDataUrl;

      // Show immediate local preview
      if(previewDiv && previewImg){
        previewImg.src = compressedDataUrl;
        previewDiv.style.display = 'block';
      }

      // Set clean friendly indicator in textbox
      if(targetInput){
        targetInput.value = '[Đã chọn ảnh từ thiết bị]';
      }
    };
    img.onerror = function() {
      alert('Lỗi: Định dạng ảnh không được hỗ trợ (có thể là HEIC từ iPhone). Vui lòng chuyển sang JPEG/PNG và thử lại!');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearImageSelect(targetInputId, previewDivId, fileInputId){
  document.getElementById(targetInputId).value = '';
  if(targetInputId === 'a-img') addImgBase64 = '';
  if(targetInputId === 'edit-img') editImgBase64 = '';
  var fileInput = document.getElementById(fileInputId);
  if(fileInput) fileInput.value = '';
  var previewDiv = document.getElementById(previewDivId);
  if(previewDiv) previewDiv.style.display = 'none';
}

// ── MODALS
function openModal(id){
  var m=document.getElementById(id);
  if(m) m.classList.add('show');
}
function closeModal(id){
  var m=document.getElementById(id);
  if(m) m.classList.remove('show');
}

// ── RENDER RECIPES GRID - CHỒNG COOK VỢ LOOK

// --- RECIPE DYNAMIC SCALING LOGIC ---
let currentServings = 4;
let baseServings = 4;
let parsedIngredients = [];

function safeParseFloat(str) {
  if (!str) return 0;
  str = str.replace(',', '.');
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2 && parseFloat(parts[1]) !== 0) {
      return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
  }
  return parseFloat(str);
}

function parseIngredient(text) {
  try {
    const regex = /^([\d.,]+(?:\/\d+)?)\s*(g|kg|ml|l|lAt|mu-ng\s?canh|mu-ng|c|trAi|qu|con|nhAnh)?\s+(.*)$/i;
    const match = text.trim().match(regex);
    if (match) {
      let qty = safeParseFloat(match[1]);
      if (!isNaN(qty) && qty > 0) {
        return { qty: qty, unit: match[2] ? match[2].trim() : '', name: match[3], isScalable: true };
      }
    }
  } catch(e) {}
  return { qty: null, name: text, isScalable: false };
}

function changeServings(delta) {
  let newVal = currentServings + delta;
  if (newVal < 1 || newVal > 20) return;
  currentServings = newVal;
  renderIngredientsList(true);
}

function renderIngredientsList(animate = false) {
  const displayEl = document.getElementById('servings-display');
  const listEl = document.getElementById('rcp-ing-list');
  if (!displayEl || !listEl) return;

  displayEl.innerText = currentServings + " ng?i";
  const ratio = currentServings / baseServings;
  
  while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
  }

  parsedIngredients.forEach(ing => {
    let label = document.createElement('label');
    label.className = 'rcp-ingred-item';
    
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    label.appendChild(checkbox);

    let textSpan = document.createElement('span');
    textSpan.className = 'rcp-ingred-name';
    
    if (ing.isScalable) {
      let newQty = ing.qty * ratio;
      newQty = Math.round(newQty * 100) / 100;
      
      let qtySpan = document.createElement('span');
      qtySpan.className = animate ? "ing-qty changed" : "ing-qty";
      qtySpan.innerText = newQty + (ing.unit ? ing.unit + " " : " ");
      
      textSpan.appendChild(qtySpan);
      textSpan.appendChild(document.createTextNode(ing.name));
    } else {
      textSpan.innerText = ing.name;
    }
    
    label.appendChild(textSpan);
    listEl.appendChild(label);
  });
}

function loadRecipesData(force = false) {
  if (isRecipesLoaded && !force) {
    renderRecipes();
    return;
  }
  const rcpContainer = document.getElementById('recipe-list');
  if(rcpContainer) rcpContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--sl);">Đang tải công thức...</div>';

  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run.withSuccessHandler(function(res) {
      RECIPES_DATA = res || [];
      isRecipesLoaded = true;
      renderRecipes();
      if (document.getElementById('m-admin').style.display === 'flex') renderAdminRcpList();
    }).getRecipes();
  } else {
    // API Mock fallback or Vercel fetch
    fetch(API_URL + '?action=getRecipes').then(r => r.json()).then(res => {
       RECIPES_DATA = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
       isRecipesLoaded = true;
       renderRecipes();
       if (document.getElementById('m-admin').style.display === 'flex') renderAdminRcpList();
    }).catch(e => {
       console.log('Load recipes error:', e);
    });
  }
}
// ------------------------------------

function renderRecipes(){
  var grid = document.getElementById('recipe-list-grid');
  if(!grid) return;
  var list = RECIPES_DATA;
  if(recipeFilterCategory && recipeFilterCategory !== 'all'){
    list = RECIPES_DATA.filter(function(r){
      return (r.category||'').indexOf(recipeFilterCategory) !== -1;
    });
  }
  if(list.length === 0){
    grid.innerHTML = '<div style="text-align:center;padding:32px 20px;color:var(--sl);font-weight:700;grid-column:1/-1;">Chưa có công thức nào thuộc danh mục này.</div>';
    return;
  }
  grid.innerHTML = list.map(function(r){
    var vidUrl = r.video_url || 'https://www.tiktok.com/@chongcookvolook';
    var region = r.region || 'Đặc Sản';
    var serving = r.serving || '4 người';
    return '<div class="recipe-card-glass" onclick="openRecipeDetail(\''+r.id+'\')">'
      + '<div class="rcp-img-wrap"><img src="'+r.image+'" alt="'+r.name+'"/><span class="rcp-region-tag">'+region+'</span></div>'
      + '<div class="rcp-body">'
      + '<div class="rcp-title">'+r.name+'</div>'
      + '<div class="rcp-stats">'
      + '<div class="rcp-stat-item">⏱️ '+r.time+'</div>'
      + '<div class="rcp-stat-item">👨‍👩‍👧 '+serving+'</div>'
      + '<div class="rcp-stat-item">🧑‍🍳 '+r.level+'</div>'
      + '</div>'
      + '<button class="rcp-btn-play" onclick="event.stopPropagation(); window.open(\''+vidUrl+'\',\'_blank\')">🎬 Xem video nấu</button>'
      + '</div></div>';
  }).join('');
}

function openRecipeDetail(id){
    var r = RECIPES_DATA.find(function(item){return item.id===id;});
    if(!r) return;
    currentSheetRecipeId = r.id;
    
    document.getElementById('rcp-cat').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 10H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1zm-1.5-2a1 1 0 0 0 .5-.86v-1a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 6.14v1a1 1 0 0 0 .5.86h15z"/></svg> ' + r.category;
    document.getElementById('rcp-title').textContent = r.name;
    
    document.getElementById('rcp-meta').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + r.time + ' &bull; <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z"></path><path d="M19.914 10H4.086A2 2 0 0 0 2 12v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2.086-2z"></path><path d="M15 10V7a3 3 0 0 0-6 0v3"></path></svg> ' + r.level;

    baseServings = parseFloat(r.default_servings) || 4;
    currentServings = baseServings;
    parsedIngredients = (r.ingredients || []).map(parseIngredient);
    renderIngredientsList();

    document.getElementById('rcp-steps-list').className = 'rcp-step-list';
    document.getElementById('rcp-steps-list').innerHTML = r.steps.map(function(st, idx){
      var parts = st.split(':');
      var stNum = idx + 1;
      var stDesc = st;
      if(parts.length > 1) {
         stDesc = parts.slice(1).join(':').trim();
      }
      return '<div class="rcp-step-item">'
           + '<div class="rcp-step-num">'+stNum+'</div>'
           + '<div class="rcp-step-content">'
           + '<div class="rcp-step-title">B\u01B0\u1EDBc '+stNum+'</div>'
           + '<div class="rcp-step-desc">'+stDesc+'</div>'
           + '</div></div>';
    }).join('');

    var vidBtn = document.getElementById('btn-rcp-video');
    if(vidBtn){
      vidBtn.href = r.video_url || 'https://www.tiktok.com/@chongcookvolook';
    }

  document.getElementById('btn-rcp-findmap').onclick = function(){
    closeModal('m-recipe-detail');
    switchNav('map');
    var matchBtn = document.querySelector('.pill[data-cat="'+r.searchCat+'"]');
    filterMap(r.searchCat, matchBtn);
  };

  openModal('m-recipe-detail');
}

// ── SHARE / COPY LINK: dùng cho cả thẻ địa điểm và thẻ công thức ──
// Link dạng ?id=<id>[&type=recipe] — khi có domain riêng, Worker/proxy chỉ cần forward
// đúng path này sang URL exec, KHÔNG cần sửa gì ở đây vì base URL lấy từ window.location.
var currentSheetLoc = null;      // địa điểm đang mở trong bottom-sheet
var currentSheetRecipeId = null; // id công thức đang mở trong modal
var deepLinkLocResolved = false; // đảm bảo deep-link địa điểm chỉ tự mở đúng 1 lần

function buildShareUrl(type, id){
  var base = window.location.origin + window.location.pathname;
  
  if (typeof SCRIPT_URL !== 'undefined' && SCRIPT_URL && SCRIPT_URL.indexOf('script.google.com') !== -1) {
    base = SCRIPT_URL;
  }
  
  return base + '?id=' + encodeURIComponent(id) + (type === 'recipe' ? '&type=recipe' : '');
}

// Cập nhật SCRIPT_URL bất đồng bộ để chống lỗi cache
try {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run.withSuccessHandler(function(url) {
      if (url && url.indexOf('script.google.com') !== -1) {
        SCRIPT_URL = url;
      }
    }).getScriptUrlLive();
  }
} catch(e) {
  console.log("getScriptUrlLive not available on this deployment yet.");
}

function showToast(msg){
  var t = document.getElementById('mini-toast-el');
  if(!t){
    t = document.createElement('div');
    t.id = 'mini-toast-el';
    t.style.cssText = 'position:fixed;bottom:calc(90px + var(--sb,0px));left:50%;transform:translateX(-50%) translateY(20px);background:rgba(15,23,42,.92);color:#fff;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:600;z-index:5000;opacity:0;pointer-events:none;transition:opacity .25s ease,transform .25s ease;box-shadow:0 8px 24px rgba(0,0,0,.25);white-space:nowrap;max-width:86vw;text-align:center;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(function(){ t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(function(){ t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
}

function fallbackCopyText(text){
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try{ document.execCommand('copy'); showToast('Đã copy link!'); }
  catch(e){ showToast('Copy thất bại, vui lòng thử lại'); }
  document.body.removeChild(ta);
}

function shareOrCopy(url, title, text){
  if(navigator.share){
    navigator.share({title: title || '', text: text || '', url: url}).catch(function(){});
  } else if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(function(){ showToast('Đã copy link!'); }).catch(function(){ fallbackCopyText(url); });
  } else {
    fallbackCopyText(url);
  }
}

function shareCurrentLocation(){
  if(!currentSheetLoc) return;
  var url = buildShareUrl('loc', currentSheetLoc.id);
  shareOrCopy(url, fixUtf8(currentSheetLoc.name), 'Xem quán này trên Thao Thức Guide');
}

function shareCurrentRecipe(){
  if(!currentSheetRecipeId) return;
  var r = RECIPES_DATA.find(function(item){ return item.id === currentSheetRecipeId; });
  var url = buildShareUrl('recipe', currentSheetRecipeId);
  shareOrCopy(url, r ? r.name : '', 'Xem công thức này trên Thao Thức Guide');
}

// ── BOTTOM NAV: gọn mặc định; bấm vào tab -> cả thanh phình hiện label; cuộn trang/kéo map -> thu gọn lại
function expandNav(){ var n=document.getElementById('main-bottom-nav'); if(n) n.classList.add('expanded'); }
function collapseNav(){ var n=document.getElementById('main-bottom-nav'); if(n) n.classList.remove('expanded'); }
function navTap(tab){ switchNav(tab); expandNav(); }
['page-home','page-cook'].forEach(function(id){
  var el=document.getElementById(id);
  if(el) {
    var lastScrollTop = 0;
    el.addEventListener('scroll', function() {
      var st = el.scrollTop;
      if (st <= 0) {
        expandNav();
        lastScrollTop = 0;
        return;
      }
      if (Math.abs(lastScrollTop - st) <= 5) return; // Bỏ qua cuộn quá nhẹ
      
      if (st > lastScrollTop) {
        collapseNav(); // Cuộn xuống (kéo lên) -> đọc nội dung -> thu nhỏ
      } else {
        expandNav();   // Cuộn lên (kéo xuống) -> về đầu trang -> phóng to
      }
      lastScrollTop = st;
    }, {passive:true});
  }
});

// ── BOTTOM NAV SWITCHING (HOME | MAP | COOK | ADMIN)
function switchNav(tab, skipAutoFly){
  if(tab !== 'map'){ var dd = document.getElementById('map-search-dropdown'); if(dd) dd.classList.remove('show'); }
  ['home','map','cook'].forEach(function(k){
    var btn=document.getElementById('bnav-'+k);
    if(btn){
      var isActive = (k===tab);
      btn.classList.toggle('active', isActive);
      var icon = btn.querySelector('i');
      if(icon) icon.className = (isActive ? 'ph-fill ph-' : 'ph ph-') + btn.dataset.icon;
    }
    var p=document.getElementById('page-'+k);
    if(p) p.classList.toggle('show',k===tab);
  });

  var isMap=(tab==='map');
  document.getElementById('map-header').style.display = isMap ? 'flex' : 'none';
  document.getElementById('pill-bar').style.display = isMap ? 'flex' : 'none';
  document.getElementById('locate-btn').style.display = isMap ? 'flex' : 'none';
  var mobileListBtn = document.getElementById('mobile-list-btn');
  if(mobileListBtn) { mobileListBtn.style.display = isMap && window.innerWidth < 1024 ? 'flex' : 'none'; }
  if(!isMap) closeSheet();

  // ── DESKTOP SPLIT-VIEW: chỉ bật khi đang ở trang map VÀ màn hình rộng ≥1024px ──
  // ── DESKTOP MODE: rail trái áp dụng mọi trang; split-view map chỉ áp dụng trang map ──
  document.body.classList.toggle('desktop-mode', window.innerWidth >= 1024);
  document.body.classList.toggle('desktop-map-view', isMap && window.innerWidth >= 1024);
  if(isMap && window.map){ setTimeout(function(){ map.invalidateSize(true); map.setView(map.getCenter(), map.getZoom()); }, 350); }

  if(tab==='cook') loadRecipesData();
  
  // ── CHATBOT OVERLAY FIX: ẩn nút AI khi ở tab Admin để không che nút Sửa/Xóa ──
  var aiFab = document.getElementById('ai-fab') || document.querySelector('.ai-fab');
  if(aiFab){
    aiFab.style.opacity=''; aiFab.style.pointerEvents=''; aiFab.style.zIndex='';
  }

  if(isMap && window.map){
    setTimeout(function(){
      map.invalidateSize();
      if(!skipAutoFly) {
        if(userMarker){
          map.flyTo(userMarker.getLatLng(), 15, { animate: true, duration: 0.8 });
        } else if(markers.length){
          try{ 
            var group = L.featureGroup(markers);
            map.fitBounds(group.getBounds(), { maxZoom: 14, padding: [50, 50] });
          }catch(e){}
        }
      }
    },100);
  }
}

// ── DEDICATED ADMIN TAB CONTROLLER (THAO THỨC GUIDE ADMIN)
var isAdmin = false;

function checkAdminAuth(){
  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(res){
        if(res && res.isAdmin){
          isAdmin = true;
          document.getElementById('main-bottom-nav').classList.add('admin-mode');
          document.getElementById('bnav-admin').style.display = 'flex';
        } else {
          isAdmin = false;
          document.getElementById('main-bottom-nav').classList.remove('admin-mode');
          document.getElementById('bnav-admin').style.display = 'none';
        }
      })
      .getAdminStatus();
  } else {
    // Local dev mode auto-enable admin tab for testing
    isAdmin = true;
    document.getElementById('main-bottom-nav').classList.add('admin-mode');
    document.getElementById('bnav-admin').style.display = 'flex';
  }
}

function switchAdminSec(sec){
  ['locs','rcps','sugs'].forEach(function(k){
    var btn = document.getElementById('atab-'+k);
    if(btn) btn.classList.toggle('active', k===sec);
    var div = document.getElementById('asec-'+k);
    if(div) div.style.display = (k===sec) ? 'block' : 'none';
  });

  if(sec==='locs') renderAdminLocList();
  if(sec==='rcps') renderAdminRcpList();
  if(sec==='sugs') loadAdminSuggestions();
}

function renderAdminTab(){
  switchAdminSec('locs');
}

// ── ADMIN RECIPES: filter + pagination state ──
var adminRcpFilter = 'all';
var adminRcpPage = 1;

function setAdminRcpFilter(f){
  adminRcpFilter = f;
  adminRcpPage = 1;
  document.querySelectorAll('#admin-rcp-filter-pills .admin-fpill').forEach(function(p){
    p.classList.toggle('active', p.getAttribute('data-f')===f);
  });
  renderAdminRcpList();
}

function changeAdminRcpPage(delta){
  adminRcpPage += delta;
  renderAdminRcpList();
}

function renderAdminRcpList(){
  var container = document.getElementById('admin-rcp-container');
  if(!container) return;
  var inputEl = document.getElementById('admin-rcp-search');
  var query = inputEl ? (inputEl.value||'').toLowerCase().trim() : '';

  var list = RECIPES_DATA.filter(function(r){
    if(query){
      var ingText = Array.isArray(r.ingredients) ? r.ingredients.join(' ').toLowerCase() : '';
      if((r.name||'').toLowerCase().indexOf(query)===-1 && (r.category||'').toLowerCase().indexOf(query)===-1 && ingText.indexOf(query)===-1) return false;
    }
    if(adminRcpFilter==='all') return true;
    return (r.category||'').indexOf(adminRcpFilter) !== -1;
  });

  if(list.length === 0){
    container.innerHTML = '<div style="text-align:center;padding:32px 20px;color:var(--sl);font-weight:700;">Không tìm thấy công thức phù hợp.</div>';
    document.getElementById('admin-rcp-pagination').innerHTML = '';
    return;
  }

  var totalPages = Math.max(1, Math.ceil(list.length / ADMIN_PAGE_SIZE));
  if(adminRcpPage > totalPages) adminRcpPage = totalPages;
  if(adminRcpPage < 1) adminRcpPage = 1;
  var pageList = list.slice((adminRcpPage-1)*ADMIN_PAGE_SIZE, adminRcpPage*ADMIN_PAGE_SIZE);

  container.innerHTML = pageList.map(function(r){
    return '<div class="admin-loc-item">'
      + '<div class="admin-loc-info">'
      + '<div class="admin-loc-name">'+r.name+'</div>'
      + '<div class="admin-loc-sub">'+r.category+' • ⏱️ '+r.time+'</div>'
      + '</div>'
      + '<div class="admin-loc-btns">'
      + '<button class="btn-sm-edit" onclick="openAdminEditRecipe(\''+r.id+'\')">✏️ Sửa</button>'
      + '<button class="btn-sm-del" onclick="deleteRecipeItem(\''+r.id+'\')">🗑️ Xóa</button>'
      + '</div>'
      + '</div>';
  }).join('');

  document.getElementById('admin-rcp-pagination').innerHTML =
    '<button class="admin-page-btn" '+(adminRcpPage<=1?'disabled':'')+' onclick="changeAdminRcpPage(-1)">◀ Trang trước</button>'
    + '<span class="admin-page-info">Page '+adminRcpPage+' / '+totalPages+'</span>'
    + '<button class="admin-page-btn" '+(adminRcpPage>=totalPages?'disabled':'')+' onclick="changeAdminRcpPage(1)">Trang sau ▶</button>';
}

function openAdminEditRecipe(id){
  var r = RECIPES_DATA.find(function(x){return x.id===id;});
  if(!r) return;
  document.getElementById('er-id').value = r.id;
  document.getElementById('er-name').value = r.name || '';
  document.getElementById('er-cat').value = r.category || '';
  document.getElementById('er-time').value = r.time || '';
  document.getElementById('er-level').value = r.level || '';
  document.getElementById('er-img').value = r.image || '';
  document.getElementById('er-video').value = r.video_url || '';
  document.getElementById('er-ing').value = (r.ingredients||[]).join('\n');
  document.getElementById('er-steps').value = (r.steps||[]).join('\n');
  openModal('m-admin-edit-recipe');
}

function doAdminUpdateRecipe(){
  var id = document.getElementById('er-id').value;
  var r = RECIPES_DATA.find(function(x){return x.id===id;});
  if(!r) return;
  r.name = document.getElementById('er-name').value.trim() || r.name;
  r.category = document.getElementById('er-cat').value.trim() || r.category;
  r.time = document.getElementById('er-time').value.trim() || r.time;
  r.level = document.getElementById('er-level').value.trim() || r.level;
  r.image = document.getElementById('er-img').value.trim() || r.image;
  r.video_url = document.getElementById('er-video').value.trim() || r.video_url;
  r.ingredients = document.getElementById('er-ing').value.split('\n').filter(function(s){return s.trim();});
  r.steps = document.getElementById('er-steps').value.split('\n').filter(function(s){return s.trim();});
  alert('✅ Đã cập nhật công thức!');
  closeModal('m-admin-edit-recipe');
  renderRecipes();
  renderAdminRcpList();
}

function doAdminAddRecipe(){
  var name = document.getElementById('ar-name').value.trim();
  if(!name){alert('Vui lòng nhập tên công thức món ăn!');return;}
  
  var newRcp = {
    id: 'rcp_' + Date.now(),
    name: name,
    category: document.getElementById('ar-cat').value.trim() || 'Món Nước / Bún Phở',
    time: document.getElementById('ar-time').value.trim() || '30 phút',
    level: document.getElementById('ar-level').value.trim() || 'Dễ làm',
    image: document.getElementById('ar-img').value.trim() || CAT_IMAGES['Default'],
    video_url: document.getElementById('ar-video').value.trim() || 'https://www.tiktok.com/@chongcookvolook',
    ingredients: document.getElementById('ar-ing').value.split('\n').filter(function(s){return s.trim();}),
    steps: document.getElementById('ar-steps').value.split('\n').filter(function(s){return s.trim();}),
    searchCat: 'Bún / Phở / Món Nước'
  };

  RECIPES_DATA.unshift(newRcp);
  alert('✅ Đã thêm công thức mới vào Chồng Cook Vợ Look!');
  closeModal('m-admin-add-recipe');
  renderRecipes();
  renderAdminRcpList();
  ['ar-name','ar-cat','ar-time','ar-level','ar-img','ar-video','ar-ing','ar-steps'].forEach(function(id){document.getElementById(id).value='';});
}

function deleteRecipeItem(id){
  if(!confirm('Bạn có muốn xóa công thức này?')) return;
  RECIPES_DATA = RECIPES_DATA.filter(function(r){return r.id!==id;});
  renderRecipes();
  renderAdminRcpList();
}

function loadAdminSuggestions(){
  var container = document.getElementById('admin-sug-container');
  if(!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--sl);">Đang tải hòm thư gợi ý...</div>';

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(list){
        if(!Array.isArray(list) || list.length===0){
          container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--sl);font-weight:700;">Chưa có gợi ý nào từ khán giả.</div>';
          return;
        }
        container.innerHTML = list.map(function(s){
          return '<div class="admin-loc-item">'
            + '<div class="admin-loc-info">'
            + '<div class="admin-loc-name">'+UI_ICONS.pin+fixUtf8(s.place_name)+'</div>'
            + '<div class="admin-loc-sub">'+(fixUtf8(s.category)||'Ẩm thực')+' • '+(s.address||'')+ ' • GPS: '+s.lat+','+s.lng+'</div>'
            + '<div style="font-size:13px;color:var(--nv);margin-top:4px;font-style:italic;">"'+fixUtf8(s.must_try_notes)+'"</div>'
            + '</div>'
            + '</div>';
        }).join('');
      })
      .getSuggestions();
  } else {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--sl);font-weight:700;">Hòm thư gợi ý sẵn sàng (Google Sheet Suggestions tab).</div>';
  }
}

// ── GEOLOCATION & GPS FOCUS
var userMarker=null, locating=false;

function autoLocateOnLaunch(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(pos){
        var lat=pos.coords.latitude, lng=pos.coords.longitude;
        if(userMarker) map.removeLayer(userMarker);
        var html='<div class="user-dot-outer"><div class="user-dot-inner"></div></div>';
        userMarker=L.marker([lat,lng],{icon:L.divIcon({html:html,iconSize:[36,36],iconAnchor:[18,18],className:'custom-map-pin'})}).addTo(map);

        // Fly straight to user location at zoom level 15
        map.flyTo([lat, lng], 15, { animate: true, duration: 1.2 });
      },
      function(err){
        // GPS permission pending/denied
      },
      {enableHighAccuracy:true, timeout:8000}
    );
  }
}

function locateMe(){
  if(!navigator.geolocation){alert(t('locErr'));return;}
  switchNav('map'); // Auto-switch to map tab
  var btn=document.getElementById('locate-btn');
  if(locating)return;
  locating=true; btn.classList.add('locating');
  navigator.geolocation.getCurrentPosition(
    function(pos){
      locating=false; btn.classList.remove('locating');
      var lat=pos.coords.latitude, lng=pos.coords.longitude;
      if(userMarker) map.removeLayer(userMarker);
      var html='<div class="user-dot-outer"><div class="user-dot-inner"></div></div>';
      userMarker=L.marker([lat,lng],{icon:L.divIcon({html:html,iconSize:[36,36],iconAnchor:[18,18],className:'custom-map-pin'})}).addTo(map);

      // Smooth flyTo animation to user's exact GPS coordinates
      map.flyTo([lat, lng], 15, { animate: true, duration: 1.2 });

      if (activeFilter === 'near') { var nBtn = document.getElementById('btn-near'); if(nBtn) nBtn.classList.add('active'); }
        if (activeFilter === 'near') { var nBtn = document.getElementById('btn-near'); if(nBtn) nBtn.classList.add('active'); }
        filterMap(activeFilter, null, true); // cập nhật khoảng cách cho cả desktop & mobile

      setTimeout(function(){ map.invalidateSize(); }, 300);
    },
    function(){
      locating=false; btn.classList.remove('locating');
      alert(t('locErr'));
    },
    {enableHighAccuracy:true,timeout:10000}
  );
}

function gpsForSuggest(){
  if(!navigator.geolocation){alert(t('locErr'));return;}
  navigator.geolocation.getCurrentPosition(
    function(pos){
      document.getElementById('s-lat').value=pos.coords.latitude.toFixed(6);
      document.getElementById('s-lng').value=pos.coords.longitude.toFixed(6);
      var btn = document.getElementById('s-btn-gps');
      var badge = document.getElementById('s-gps-badge');
      if(btn) btn.style.display = 'none';
      if(badge) badge.style.display = 'block';
    },
    function(){alert(t('locErr'));},
    {enableHighAccuracy:true,timeout:10000}
  );
}

function doSuggest(){
  var name=document.getElementById('s-name').value.trim();
  if(!name){alert(t('nameReq'));return;}
  
  var data = {
    name: name,
    address: document.getElementById('s-addr').value.trim(),
    lat: document.getElementById('s-lat').value.trim(),
    lng: document.getElementById('s-lng').value.trim(),
    category: document.getElementById('s-cat').value.trim(),
    notes: document.getElementById('s-note').value.trim(),
    image: document.getElementById('s-img').value.trim()
  };

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(){
        alert(t('sent'));
        ['s-name','s-addr','s-lat','s-lng','s-cat','s-note','s-img'].forEach(function(id){
          var el = document.getElementById(id);
          if(el) el.value='';
        });
        var pv = document.getElementById('s-img-preview');
        var pvi = document.getElementById('s-img-preview-img');
        if(pv) pv.style.display = 'none';
        if(pvi) pvi.src = '';
        var btn = document.getElementById('s-btn-gps');
        var badge = document.getElementById('s-gps-badge');
        if(btn) btn.style.display = 'flex';
        if(badge) badge.style.display = 'none';
        closeModal('m-sug');
      })
      .withFailureHandler(function(e){alert('Lỗi: '+e.message);})
      .saveSuggestion(data);
  }else{
    alert(t('sent'));
    ['s-name','s-addr','s-lat','s-lng','s-cat','s-note'].forEach(function(id){document.getElementById(id).value='';});
    closeModal('m-sug');
  }
}

function openAdminModal(mode){
  clearImageSelect('a-img', 'a-img-preview', 'a-img-file');
  ['a-name','a-lat','a-lng','a-cat','a-must','a-price','a-video','a-map','a-hours','a-desc'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.value = '';
  });
  var starsEl = document.getElementById('a-stars');
  if(starsEl) starsEl.value = '3';

  var statusEl = document.getElementById('a-gps-status');
  if(statusEl){ statusEl.style.display='none'; statusEl.textContent=''; }

  // ── Auto-GPS: luôn tự lấy vị trí hiện tại khi mở modal (không chỉ khi bấm nút GPS riêng) ──
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      document.getElementById('a-lat').value=pos.coords.latitude.toFixed(6);
      document.getElementById('a-lng').value=pos.coords.longitude.toFixed(6);
      if(statusEl){ statusEl.style.display='inline-flex'; statusEl.textContent='📍 Đã tự động lấy vị trí GPS hiện tại'; statusEl.style.color='#0EA5E9'; statusEl.style.background='rgba(14,165,233,.1)'; }
    },function(){}, {enableHighAccuracy:true,timeout:8000});
  }

  // ── Live parser: dán link Google Maps vào ô a-map sẽ tự ghi đè lat/lng ──
  var mapInput = document.getElementById('a-map');
  if(mapInput && !mapInput._parserBound){
    mapInput._parserBound = true;
    ['input','paste'].forEach(function(evt){
      mapInput.addEventListener(evt, function(){
        setTimeout(function(){
          var extracted = extractLatLngFromMapUrl(mapInput.value.trim());
          if(extracted){
            document.getElementById('a-lat').value = extracted.lat;
            document.getElementById('a-lng').value = extracted.lng;
            if(statusEl){ statusEl.style.display='inline-flex'; statusEl.textContent='🎯 Đã cập nhật tọa độ từ Link Google Maps!'; statusEl.style.color='#FF7043'; statusEl.style.background='rgba(255,112,67,.1)'; }
          }
        }, 50);
      });
    });
  }

  openModal('m-admin');
}

// ── ADMIN MAP SPOTS: filter + pagination state ──
var adminLocFilter = 'all';
var adminLocPage = 1;
var ADMIN_PAGE_SIZE = 12;

function setAdminLocFilter(f){
  adminLocFilter = f;
  adminLocPage = 1;
  document.querySelectorAll('#admin-loc-filter-pills .admin-fpill').forEach(function(p){
    p.classList.toggle('active', p.getAttribute('data-f')===f);
  });
  renderAdminLocList();
}

function changeAdminLocPage(delta){
  adminLocPage += delta;
  renderAdminLocList();
}

function renderAdminLocList(){
  var container = document.getElementById('admin-loc-container');
  if(!container) return;
  var inputEl = document.getElementById('admin-search-input');
  var query = inputEl ? (inputEl.value||'').toLowerCase().trim() : '';

  // Cập nhật dashboard metric bar (tính trên toàn bộ allLocs, không phụ thuộc filter/search)
  var mTotal = allLocs.length;
  var mPending = allLocs.filter(function(l){return l.badge_type==='pending';}).length;
  var mApproved = allLocs.filter(function(l){return l.badge_type==='approved';}).length;
  var mHeritage = allLocs.filter(function(l){return l.badge_type==='heritage';}).length;
  var elT=document.getElementById('am-total'), elP=document.getElementById('am-pending'),
      elA=document.getElementById('am-approved'), elH=document.getElementById('am-heritage');
  if(elT) elT.textContent = mTotal;
  if(elP) elP.textContent = mPending;
  if(elA) elA.textContent = mApproved;
  if(elH) elH.textContent = mHeritage;

  var list = allLocs.filter(function(l){
    if(query){
      var hay = ((l.name||'')+' '+(l.category||'')+' '+(l.address||'')+' '+(l.must_try||'')+' '+(l.description||'')).toLowerCase();
      if(hay.indexOf(query) === -1) return false;
    }
    if(adminLocFilter==='all') return true;
    if(adminLocFilter==='Take-Away' || adminLocFilter==='Online-Only') return l.type===adminLocFilter;
    return l.badge_type===adminLocFilter;
  });

  if(list.length === 0){
    container.innerHTML = '<div style="text-align:center;padding:32px 20px;color:var(--sl);font-weight:700;">Không tìm thấy địa điểm phù hợp.<br/><span style="font-size:14px;color:var(--sl-light);margin-top:6px;display:block;">Hãy nhấn "➕ Thêm Địa Điểm Mới" ở trên để bắt đầu thêm địa điểm thật!</span></div>';
    document.getElementById('admin-loc-pagination').innerHTML = '';
    return;
  }

  var totalPages = Math.max(1, Math.ceil(list.length / ADMIN_PAGE_SIZE));
  if(adminLocPage > totalPages) adminLocPage = totalPages;
  if(adminLocPage < 1) adminLocPage = 1;
  var pageList = list.slice((adminLocPage-1)*ADMIN_PAGE_SIZE, adminLocPage*ADMIN_PAGE_SIZE);

  container.innerHTML = pageList.map(function(loc){
    var badge = BADGE_LABELS[loc.badge_type] || BADGE_LABELS['spot'];
    var badgeTag = '<span class="admin-badge-tag" style="color:'+badge.color+';background:'+badge.color+'1A;">'+getBadgeIconHtml(loc.badge_type)+badge.text+'</span>';
    return '<div class="admin-loc-item">'
      + '<div class="admin-loc-info">'
      + '<div class="admin-loc-name">'+fixUtf8(loc.name)+badgeTag+'</div>'
      + '<div class="admin-loc-sub">'+(fixUtf8(loc.category)||'Ẩm thực')+' • '+(loc.price_range||'')+(loc.opening_hours?' • '+UI_ICONS.clock+loc.opening_hours:'')+'</div>'
      + '</div>'
      + '<div class="admin-loc-btns">'
      + '<button class="btn-sm-edit" onclick="openAdminEdit(\''+loc.id+'\')">✏️ Sửa</button>'
      + '<button class="btn-sm-del" onclick="deleteAdminLoc(\''+loc.id+'\')">🗑️ Xóa</button>'
      + '</div>'
      + '</div>';
  }).join('');

  document.getElementById('admin-loc-pagination').innerHTML =
    '<button class="admin-page-btn" '+(adminLocPage<=1?'disabled':'')+' onclick="changeAdminLocPage(-1)">◀ Trang trước</button>'
    + '<span class="admin-page-info">Page '+adminLocPage+' / '+totalPages+'</span>'
    + '<button class="admin-page-btn" '+(adminLocPage>=totalPages?'disabled':'')+' onclick="changeAdminLocPage(1)">Trang sau ▶</button>';
}

function openAdminEdit(id){
  var loc = allLocs.find(function(l){return String(l.id)===String(id);});
  if(!loc) return;
  editImgBase64 = '';
  document.getElementById('edit-id').value = loc.id;
  document.getElementById('edit-name').value = loc.name || '';
  document.getElementById('edit-lat').value = loc.lat || '';
  document.getElementById('edit-lng').value = loc.lng || '';
  document.getElementById('edit-cat').value = loc.category || '';
  document.getElementById('edit-must').value = loc.must_try || '';
  document.getElementById('edit-price').value = loc.price_range || '';
  document.getElementById('edit-stars').value = loc.badge_type || 'spot';
  document.getElementById('edit-hours').value = loc.opening_hours || '';
  document.getElementById('edit-desc').value = loc.description || '';
  document.getElementById('edit-type').value = loc.type || '';
  document.getElementById('edit-phone').value = loc.phone || '';
  document.getElementById('edit-address').value = loc.address || '';
  document.getElementById('edit-shopeefood').value = loc.shopeefood_link || '';
  document.getElementById('edit-grab').value = loc.grab_link || '';
  document.getElementById('edit-parking').value = loc.parking_info || '';
  document.getElementById('edit-payment').value = loc.payment_methods || '';
  document.getElementById('edit-dayoff').value = loc.day_off || '';
  
  var imgVal = loc.image_url ? String(loc.image_url).trim() : '';
  if (imgVal.indexOf('data:image/') === 0) {
    editImgBase64 = imgVal;
    document.getElementById('edit-img').value = '[Đã đính kèm ảnh]';
    document.getElementById('edit-img-preview-img').src = imgVal;
    document.getElementById('edit-img-preview').style.display = 'block';
  } else if (imgVal.indexOf('http') === 0) {
    document.getElementById('edit-img').value = imgVal;
    document.getElementById('edit-img-preview-img').src = imgVal;
    document.getElementById('edit-img-preview').style.display = 'block';
  } else {
    document.getElementById('edit-img').value = '';
    document.getElementById('edit-img-preview').style.display = 'none';
  }
  
  document.getElementById('edit-video').value = loc.video_url || '';
  document.getElementById('edit-map').value = loc.map_url || '';

  openModal('m-admin-edit');
}

function saveAdminEdit(){
  var id = document.getElementById('edit-id').value;
  var name = document.getElementById('edit-name').value.trim();
  if(!name){alert('Vui lòng nhập tên địa điểm!');return;}

  var rawLat = document.getElementById('edit-lat').value.trim();
  var rawLng = document.getElementById('edit-lng').value.trim();
  var mapUrl = document.getElementById('edit-map').value.trim();

  var lat = parseFloat(rawLat);
  var lng = parseFloat(rawLng);

  if(isNaN(lat) || isNaN(lng)){
    var extracted = extractLatLngFromMapUrl(mapUrl);
    if(extracted){
      lat = extracted.lat;
      lng = extracted.lng;
    } else {
      lat = '';
      lng = '';
    }
  }

  var finalImg = '';
  if (editImgBase64) {
    finalImg = editImgBase64;
  } else {
    var typedImg = document.getElementById('edit-img').value.trim();
    if (typedImg.indexOf('[Đã') === 0) {
      var loc = allLocs.find(function(l){return String(l.id)===String(id);});
      finalImg = (loc && loc.image_url) ? loc.image_url : '';
    } else if (typedImg.indexOf('http') === 0) {
      finalImg = typedImg;
    }
  }

  var row = [
    id, name, lat, lng,
    document.getElementById('edit-stars').value,
    document.getElementById('edit-cat').value,
    document.getElementById('edit-must').value,
    document.getElementById('edit-price').value,
    document.getElementById('edit-video').value,
    mapUrl,
    finalImg,
    document.getElementById('edit-hours').value.trim(),
    document.getElementById('edit-desc').value.trim(),
    document.getElementById('edit-type').value,
    document.getElementById('edit-phone').value.trim(),
    document.getElementById('edit-address').value.trim(),
    document.getElementById('edit-shopeefood').value.trim(),
    document.getElementById('edit-grab').value.trim(),
    document.getElementById('edit-parking').value.trim(),
    document.getElementById('edit-payment').value.trim(),
    document.getElementById('edit-dayoff').value.trim()
  ];

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(){
        alert('✅ Đã lưu chỉnh sửa!');
        closeModal('m-admin-edit');
        loadData();
      })
      .withFailureHandler(function(e){alert('Lỗi: '+e.message);})
      .updateLocation(id, row);
  }else{
    var idx = allLocs.findIndex(function(l){return String(l.id)===String(id);});
    if(idx!==-1){
      allLocs[idx] = {id:row[0],name:row[1],lat:lat||16.0544,lng:lng||108.2022,badge_type:row[4]||'spot',category:row[5],must_try:row[6],price_range:row[7],video_url:row[8],map_url:row[9],image_url:row[10],opening_hours:row[11],description:row[12],type:row[13],phone:row[14],address:row[15],shopeefood_link:row[16],grab_link:row[17],parking_info:row[18],payment_methods:row[19],day_off:row[20]};
      loadMarkers(allLocs, true);
    }
    closeModal('m-admin-edit');
    alert('✅ Đã sửa (local test)');
  }
}

function deleteAdminLoc(id){
  if(!confirm('Bạn có chắc chắn muốn xóa địa điểm này khỏi Google Sheet và Bản đồ?')) return;

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(){
        alert('🗑️ Đã xóa địa điểm!');
        loadData();
      })
      .withFailureHandler(function(e){alert('Lỗi: '+e.message);})
      .deleteLocation(id);
  }else{
    allLocs = allLocs.filter(function(l){return String(l.id)!==String(id);});
    loadMarkers(allLocs, true);
    renderAdminLocList();
    alert('🗑️ Đã xóa (local test)');
  }
}

function doAdminAdd(){
  var name=document.getElementById('a-name').value.trim();
  if(!name){alert('Vui lòng nhập tên địa điểm!');return;}

  var rawLat = document.getElementById('a-lat').value.trim();
  var rawLng = document.getElementById('a-lng').value.trim();
  var mapUrl = document.getElementById('a-map').value.trim();

  var lat = parseFloat(rawLat);
  var lng = parseFloat(rawLng);

  if(isNaN(lat) || isNaN(lng)){
    var extracted = extractLatLngFromMapUrl(mapUrl);
    if(extracted){
      lat = extracted.lat;
      lng = extracted.lng;
    } else {
      lat = '';
      lng = '';
    }
  }

  var finalAddImg = '';
  if (addImgBase64) {
    finalAddImg = addImgBase64;
  } else {
    var typedAddImg = document.getElementById('a-img').value.trim();
    if (typedAddImg.indexOf('http') === 0) {
      finalAddImg = typedAddImg;
    }
  }

  var row=['loc_'+Date.now(),name,lat,lng,
    document.getElementById('a-stars').value,
    document.getElementById('a-cat').value,
    document.getElementById('a-must').value,
    document.getElementById('a-price').value,
    document.getElementById('a-video').value,
    mapUrl,
    finalAddImg,
    document.getElementById('a-hours').value.trim(),
    document.getElementById('a-desc').value.trim(),
    document.getElementById('a-type').value,
    document.getElementById('a-phone').value.trim(),
    document.getElementById('a-address').value.trim(),
    document.getElementById('a-shopeefood').value.trim(),
    document.getElementById('a-grab').value.trim(),
    document.getElementById('a-parking').value.trim(),
    document.getElementById('a-payment').value.trim(),
    document.getElementById('a-dayoff').value.trim()
  ];

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(res){
        alert('✅ Đã thêm địa điểm mới vào Google Sheet! (Tọa độ tự động định vị từ link Google Maps)');
        closeModal('m-admin');
        loadData();
      })
      .withFailureHandler(function(e){alert('Lỗi: '+e.message);})
      .addLocation(row);
  }else{
    allLocs.push({id:row[0],name:row[1],lat:lat||16.0544,lng:lng||108.2022,badge_type:row[4]||'spot',category:row[5],must_try:row[6],price_range:row[7],video_url:row[8],map_url:row[9],image_url:row[10],opening_hours:row[11],description:row[12],type:row[13],phone:row[14],address:row[15],shopeefood_link:row[16],grab_link:row[17],parking_info:row[18],payment_methods:row[19],day_off:row[20]});
    loadMarkers(allLocs, true);
    closeModal('m-admin');
    alert('✅ Đã thêm (local test)');
  }
}

// Comprehensive UTF-8 & Coordinate Sanitizers
function fixUtf8(str){
  if(!str) return '';
  var s = String(str);
  s = s.replace(/C\s+Ph\s+Mu\?i\s+H\?i\s+K\s*/gi, 'Cà Phê Muối Hải Ký')
       .replace(/B\s*n\s*B\s*Hu\? s*M\? s*R\?t/gi, 'Bún Bò Huế Mụ Rớt')
       .replace(/B\s*nh\s*M\s*Phu\?ng/gi, 'Bánh Mì Phượng')
       .replace(/M\s*Qu\?ng\s*B\s*Mua/gi, 'Mì Quảng Bà Mua')
       .replace(/Ch\s*B\s*Tu\s*D\s*N\?ng/gi, 'Chè Bà Tư Đà Nẵng')
       .replace(/C\s*ph\s*mu\?i/gi, 'Cà phê muối')
       .replace(/C\s*ph\s*tr\?ng/gi, 'Cà phê trứng')
       .replace(/B\s*n\s*b\s*d\?c\s*bi\?t/gi, 'Bún bò đặc biệt')
       .replace(/B\s*nh\s*m\s*th\?t\s*ngu\?i/gi, 'Bánh mì thịt nguội')
       .replace(/B\s*nh\s*m\s*tr\?ng/gi, 'Bánh mì trứng')
       .replace(/M\s*qu\?ng\s*t\s*m\s*th\?t/gi, 'Mì quảng tôm thịt')
       .replace(/M\s*qu\?ng\s*g\s*/gi, 'Mì quảng gà')
       .replace(/Ch\s*d\?u\s*xanh/gi, 'Chè đậu xanh')
       .replace(/Ch\s*tr\s*i\s*nu\?c/gi, 'Chè trôi nước')
       .replace(/An\s*v\?t/gi, 'Ăn vặt')
       .replace(/B\s*n\/Ph\?/gi, 'Bún/Phở');
  return s;
}

function parseCoord(rawLat, rawLng) {
  var sLat = String(rawLat || '').trim();
  var sLng = String(rawLng || '').trim();

  var lat = parseFloat(sLat.replace(',', '.'));
  if (isNaN(lat) || Math.abs(lat) > 90) {
    var clean1 = sLat.replace(/[^0-9]/g, '');
    lat = parseFloat(clean1.substring(0, 2) + '.' + clean1.substring(2)) || 16.0544;
  }

  var lng = parseFloat(sLng.replace(',', '.'));
  if (isNaN(lng) || lng > 180 || lng < 10) {
    var clean2 = sLng.replace(/[^0-9]/g, '');
    lng = parseFloat(clean2.substring(0, 3) + '.' + clean2.substring(3)) || 108.2022;
  }

  return { lat: lat, lng: lng };
}

// ── LOCATION DETAIL BOTTOM SHEET WITH FOOD PHOTO, HOURS & DESCRIPTION

function checkOpenStatus(openingHoursStr) {
  if(!openingHoursStr) return '';
  var normalizedStr = String(openingHoursStr).replace(/–|—/g, '-');
  var shifts = normalizedStr.split(',').map(function(s) { return s.trim(); });
  var now = new Date();
  var currentMins = now.getHours() * 60 + now.getMinutes();
  var isOpen = false, isClosingSoon = false;
  for(var i=0; i<shifts.length; i++) {
    var parts = shifts[i].split('-');
    if(parts.length !== 2) continue;
    var startParts = parts[0].trim().split(':');
    var endParts = parts[1].trim().split(':');
    if(startParts.length !== 2 || endParts.length !== 2) continue;
    var startMins = parseInt(startParts[0],10)*60 + parseInt(startParts[1],10);
    var endMins = parseInt(endParts[0],10)*60 + parseInt(endParts[1],10);
    var active = false, minsLeft = 0;
    if(endMins < startMins) {
      if(currentMins >= startMins || currentMins <= endMins) {
        active = true;
        minsLeft = currentMins <= endMins ? (endMins - currentMins) : (endMins + 1440 - currentMins);
      }
    } else {
      if(currentMins >= startMins && currentMins <= endMins) {
        active = true;
        minsLeft = endMins - currentMins;
      }
    }
    if(active) {
      isOpen = true;
      if(minsLeft <= 30) isClosingSoon = true;
      break;
    }
  }
  if(isOpen && isClosingSoon) return '<span class="status-pill amber">Sắp đóng cửa</span>';
  else if (isOpen) return '<span class="status-pill green">Đang mở cửa</span>';
  else return '<span class="status-pill red">Đã đóng cửa</span>';
}

function openSheet(loc){
  currentSheetLoc = loc;
  var name = fixUtf8(loc.name);
  var must_try = fixUtf8(loc.must_try);
  var category = fixUtf8(loc.category);
  var desc = fixUtf8(loc.description);

  // 1. Media Header
  var imgUrl = loc.image_url || loc.photo_url || CAT_IMAGES[category] || CAT_IMAGES['Default'] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
  document.getElementById('sh-cover-img').src = imgUrl;

  var badgeName = (loc.badge_type==='heritage'?'Heritage':loc.badge_type==='approved'?'Approved':loc.badge_type==='pending'?'Chờ Duyệt':'Spot');
  var badgeUrl = WEBP_ICONS[loc.badge_type] || WEBP_ICONS['spot'];
  var badgeIcon = '';
  if (badgeUrl && badgeUrl.length > 50) {
    badgeIcon = '<img src="' + badgeUrl + '" style="height:18px; margin-right:4px; vertical-align:-3px;" alt="badge"> ';
  } else {
    if(loc.badge_type==='heritage') badgeIcon = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    else if(loc.badge_type==='approved') badgeIcon = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
    else badgeIcon = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
  }
  
  document.getElementById('sh-badge-overlay').innerHTML = badgeIcon + badgeName;
  var inlineBadgeEl = document.getElementById('sh-badge-inline');
  if(inlineBadgeEl) inlineBadgeEl.innerHTML = badgeIcon + badgeName;

  // 2. Title & Meta
  
  var favBtn = document.getElementById('sh-fav-btn');
  if (favBtn) {
    if (isFav(loc.id)) favBtn.classList.add('liked');
    else favBtn.classList.remove('liked');
  }
document.getElementById('sh-title').textContent = name;
  document.getElementById('sh-cat').textContent = category || 'Ẩm thực';
  document.getElementById('sh-price').textContent = loc.price_range || 'Đang cập nhật';
  
  document.getElementById('sh-type-tag').style.display = 'none';

  // 3. Opening Hours
  var hoursWrap = document.getElementById('sh-hours-wrap');
  if(loc.opening_hours){
    document.getElementById('sh-hours-text').textContent = loc.opening_hours;
    document.getElementById('sh-status').innerHTML = checkOpenStatus(loc.opening_hours);
    hoursWrap.style.display = 'flex';
  } else {
    hoursWrap.style.display = 'none';
  }

  // 4. Description
  var descEl = document.getElementById('sh-desc');
  if(desc){
    descEl.textContent = desc;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }

  // 5. Utility Grid
  var hasUtil = false;
  if(loc.phone) { document.getElementById('sh-phone-link').href = 'tel:'+String(loc.phone).replace(/[^0-9]/g,''); document.getElementById('sh-phone-link').textContent = loc.phone; document.getElementById('util-phone').style.display = 'flex'; hasUtil = true; } else { document.getElementById('util-phone').style.display = 'none'; }
  
  var typeStr = 'Tự do';
  if(loc.type === 'Take-Away') typeStr = 'Chỉ bán mang đi';
  else if(loc.type === 'Dine-In') typeStr = 'Phục vụ tại chỗ';
  else if(loc.type === 'Online-Only') typeStr = 'Chỉ bán Online / Bếp đêm';
  else if(loc.type === 'Both') typeStr = 'Tại chỗ & Mang đi';
  document.getElementById('sh-type').textContent = typeStr;
  document.getElementById('util-type').style.display = 'flex';
  hasUtil = true;
  
  if(loc.payment_methods) { document.getElementById('sh-payment').textContent = fixUtf8(loc.payment_methods); document.getElementById('util-payment').style.display = 'flex'; hasUtil = true; } else { document.getElementById('util-payment').style.display = 'none'; }
  if(loc.parking_info) { document.getElementById('sh-parking').textContent = fixUtf8(loc.parking_info); document.getElementById('util-parking').style.display = 'flex'; hasUtil = true; } else { document.getElementById('util-parking').style.display = 'none'; }
  document.getElementById('sh-utility-card').style.display = hasUtil ? 'grid' : 'none';

  // 6. Must Try
  var mustWrap = document.getElementById('sh-must-wrap');
  var tagsBox = document.getElementById('sh-tags');
  var musts = (must_try||'').split(',').filter(function(s){return s.trim();});
  if(musts.length){
    mustWrap.style.display='block';
    tagsBox.innerHTML = musts.map(function(m){return '<span class="must-tag-pill">'+fixUtf8(m)+'</span>';}).join('');
  }else{
    mustWrap.style.display='none';
  }

  // 7. Actions Grid
  var row1 = document.getElementById('sh-row-1');
  var row2 = document.getElementById('sh-row-2');
  
  var mapLnk = loc.map_url || ('https://www.google.com/maps/dir/?api=1&destination='+loc.lat+','+loc.lng);
  var btn1Html = '<a href="'+mapLnk+'" target="_blank" class="sh-btn primary"><svg viewBox="0 0 24 24"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg> Chỉ đường</a>';
  if(loc.video_url) btn1Html += '<a href="'+loc.video_url+'" target="_blank" class="sh-btn secondary"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg> Review</a>';
  row1.innerHTML = btn1Html;
  row1.style.gridTemplateColumns = loc.video_url ? '1fr 1fr' : '1fr';

  var btn2Html = '';
  if(loc.shopeefood_link) btn2Html += '<a href="'+loc.shopeefood_link+'" target="_blank" class="sh-btn shopee">🧡 ShopeeFood</a>';
  if(loc.grab_link) btn2Html += '<a href="'+loc.grab_link+'" target="_blank" class="sh-btn grab">💚 GrabFood</a>';
  if(btn2Html) {
    row2.innerHTML = btn2Html;
    row2.style.display = 'grid';
    row2.style.gridTemplateColumns = (loc.shopeefood_link && loc.grab_link) ? '1fr 1fr' : '1fr';
  } else {
    row2.style.display = 'none';
  }

  document.getElementById('loc-sheet').classList.add('open');
  // Ẩn danh sách quán bên phải khi đang xem chi tiết 1 quán (tránh chồng lấn trên desktop)
  var sb = document.getElementById('desktop-sidebar');
  if(sb) sb.style.display = 'none';
}

function closeSheet(){
  document.getElementById('loc-sheet').classList.remove('open');
  // Hiện lại danh sách quán bên phải khi đóng chi tiết (chỉ khi đang ở desktop split-view)
  var sb = document.getElementById('desktop-sidebar');
  if(sb && document.body.classList.contains('desktop-map-view')) sb.style.display = '';
}

// ── MAP ENGINE & OFFICIAL GOOGLE MAPS TILE LAYER WITH CARTO & OSM FALLBACKS
var map, allLocs=[], markers=[];

function initMap(){
  map=L.map('map',{zoomControl:false,attributionControl:false,maxZoom:18}).setView([16.0544,108.2022],13);

  var googleMapsUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
  var cartoVoyagerUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
  var osmFallbackUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  var tileLayer = L.tileLayer(googleMapsUrl, {
    maxZoom:18,
    subdomains:['0','1','2','3'],
    attribution:'&copy; Google Maps'
  });

  tileLayer.on('tileerror', function(error, tile) {
    if(tile && tile.src){
      if(tile.src.indexOf('google.com') !== -1){
        tile.src = cartoVoyagerUrl.replace('{s}', 'a').replace('{z}', error.coords.z).replace('{x}', error.coords.x).replace('{y}', error.coords.y);
      } else if(tile.src.indexOf('cartocdn.com') !== -1){
        tile.src = osmFallbackUrl.replace('{s}', 'a').replace('{z}', error.coords.z).replace('{x}', error.coords.x).replace('{y}', error.coords.y);
      }
    }
  });

  tileLayer.addTo(map);

  map.on('click',function(){ closeSheet(); });
  map.on('dragstart',function(){ collapseNav(); });
  map.on('zoomstart',function(){ collapseNav(); });

  loadData();
    document.body.classList.toggle('desktop-mode', window.innerWidth >= 1024);
  document.body.classList.toggle('desktop-map-view', window.innerWidth >= 1024);
  setTimeout(function(){ map.invalidateSize(true); }, 400);
  autoLocateOnLaunch();
}

// DEMO DATA CLEARED - REAL LIVE MODE FOR GOOGLE SHEETS
var DEMO_DATA = [];

function loadData(){
  document.getElementById('map-loader').classList.remove('hidden');

  if(typeof google!=='undefined'&&google.script&&google.script.run){
    google.script.run
      .withSuccessHandler(function(d){
        onData(d);
      })
      .withFailureHandler(function(){
        document.getElementById('map-loader').classList.add('hidden');
        onData([]);
      })
      .getFoodLocations();
  }else{
    // ── DATA MẪU để test local (chỉ dùng khi không có Apps Script backend) ──
    onData([
      {
        id:'demo1', name:'Bún Bò Huế Ngô Thúy', lat:16.0680, lng:108.2100,
        badge_type:'heritage', category:'Bún / Phở / Món Nước', must_try:'Bún bò giò heo đặc biệt',
        price_range:'35.000đ - 55.000đ', rating_stars:4.8,
        opening_hours:'6:00 - 21:00', description:'Quán bún bò Huế lâu năm, nước dùng đậm đà chuẩn vị cố đô, được nhiều food blogger giới thiệu.',
        image_url:'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
        address:'123 Trần Phú, Hải Châu, Đà Nẵng', phone:'0905123456',
        shopeefood_link:'', grab_link:'', map_url:'', video_url:'',
        parking_info:'Có bãi đỗ xe máy', payment_methods:'Tiền mặt, Momo', day_off:'Không nghỉ', type:'restaurant'
      },
      {
        id:'demo2', name:'Cà Phê Muối Lâm Viên', lat:16.0620, lng:108.2250,
        badge_type:'approved', category:'Cà Phê / Đồ Uống', must_try:'Cà phê muối signature',
        price_range:'25.000đ - 45.000đ', rating_stars:4.5,
        opening_hours:'7:00 - 23:00', description:'Quán cà phê view sông Hàn, không gian yên tĩnh, món cà phê muối đặc trưng Đà Nẵng.',
        image_url:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        address:'45 Bạch Đằng, Hải Châu, Đà Nẵng', phone:'0905654321',
        shopeefood_link:'', grab_link:'', map_url:'', video_url:'',
        parking_info:'Bãi đỗ xe rộng', payment_methods:'Tiền mặt, chuyển khoản', day_off:'Không nghỉ', type:'cafe'
      },
      {
        id:'demo3', name:'Lẩu Lòng Bò Hạ Bằng', lat:16.0490, lng:108.1980,
        badge_type:'spot', category:'Lẩu / Nướng / Nhậu', must_try:'Lẩu lòng bò thập cẩm',
        price_range:'150.000đ - 300.000đ', rating_stars:4.3,
        opening_hours:'16:00 - 23:00', description:'Quán lẩu lòng bò nổi tiếng buổi tối, không gian bình dân, đông khách địa phương.',
        image_url:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        address:'78 Nguyễn Tất Thành, Thanh Khê, Đà Nẵng', phone:'0905789012',
        shopeefood_link:'', grab_link:'', map_url:'', video_url:'',
        parking_info:'Vỉa hè', payment_methods:'Tiền mặt', day_off:'Nghỉ Chủ Nhật', type:'restaurant'
      },
      {
        id:'demo4', name:'Cơm Gà A Hải', lat:16.0555, lng:108.2150,
        badge_type:'approved', category:'Cơm / Bữa Chính', must_try:'Cơm gà xé + gà quay',
        price_range:'30.000đ - 50.000đ', rating_stars:4.6,
        opening_hours:'10:00 - 20:00', description:'Cơm gà chuẩn vị Hội An giữa lòng Đà Nẵng, gà mềm, cơm dẻo thơm.',
        image_url:'https://images.unsplash.com/photo-1598515213692-5f252f5c6ba3?w=400',
        address:'12 Lê Duẩn, Hải Châu, Đà Nẵng', phone:'0905345678',
        shopeefood_link:'', grab_link:'', map_url:'', video_url:'',
        parking_info:'Có chỗ để xe', payment_methods:'Tiền mặt, Momo, ZaloPay', day_off:'Không nghỉ', type:'restaurant'
      },
      {
        id:'demo5', name:'Trà Sữa Đô Đô', lat:16.0700, lng:108.2000,
        badge_type:'spot', category:'Cà Phê / Đồ Uống', must_try:'Trà sữa trân châu đường đen',
        price_range:'20.000đ - 40.000đ', rating_stars:4.2,
        opening_hours:'8:00 - 22:00', description:'Chuỗi trà sữa quen thuộc, giá bình dân, phù hợp học sinh sinh viên.',
        image_url:'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
        address:'200 Điện Biên Phủ, Thanh Khê, Đà Nẵng', phone:'0905901234',
        shopeefood_link:'', grab_link:'', map_url:'', video_url:'',
        parking_info:'Bãi xe máy nhỏ', payment_methods:'Tiền mặt, chuyển khoản', day_off:'Không nghỉ', type:'cafe'
      }
    ]);
  }
}

function onData(d){
  document.getElementById('map-loader').classList.add('hidden');
  hideAppSplash();
  if(!Array.isArray(d)) d = [];
  d.forEach(function(loc){
    loc.name = fixUtf8(loc.name);
    loc.must_try = fixUtf8(loc.must_try);
    loc.category = fixUtf8(loc.category);
    loc.description = fixUtf8(loc.description);
    var c = parseCoord(loc.lat, loc.lng);
    loc.lat = c.lat;
    loc.lng = c.lng;
  });
  allLocs=d;
  
  // If userMarker exists, keep focus on user location at zoom level 15
  loadMarkers(d, !!userMarker);
  
  if(userMarker){
    map.flyTo(userMarker.getLatLng(), 15, { animate: true, duration: 0.8 });
  }

  
  renderHomeLatestCards();
  renderDesktopSidebar(d);
  renderMobileList(d);
  
  // Deep-link địa điểm (?id=...): chỉ tự mở 1 LẦN ngay sau lần load data đầu tiên,
  // tránh việc mọi lần onData() refresh sau đó (admin sửa/xóa...) lại mở lại sheet
  if(DEEP_LINK_ID && DEEP_LINK_TYPE !== 'recipe' && !deepLinkLocResolved){
    deepLinkLocResolved = true;
    openHomeCardLoc(DEEP_LINK_ID);
  }
}

// ── DESKTOP SIDEBAR: render danh sách quán bên phải (chỉ có ý nghĩa khi màn hình rộng, mobile không bị ảnh hưởng vì CSS ẩn sẵn) ──
// Tính khoảng cách thực tế (km) — dùng để hiện cạnh tên quán trong danh sách
function haversineDistanceKm(lat1, lng1, lat2, lng2){
  var R = 6371;
  var dLat = (lat2-lat1) * Math.PI/180;
  var dLng = (lng2-lng1) * Math.PI/180;
  var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

var BADGE_LABELS = {
  heritage: {text:'Heritage', color:'#D97706'},
  approved: {text:'Approved', color:'#FF7043'},
  pending:  {text:'Chờ duyệt', color:'#8B5CF6'},
  spot:     {text:'Spot', color:'#0EA5E9'}
};

function getBadgeIconHtml(badgeType){
  var url = WEBP_ICONS[badgeType] || WEBP_ICONS['spot'];
  if(url && url.length > 50){
    return '<img src="'+url+'" style="height:16px;width:16px;object-fit:contain;vertical-align:-3px;margin-right:3px;" alt="badge">';
  }
  // fallback giống hệt logic mkPin() dùng cho pin trên bản đồ khi không có ảnh WebP
  var fallbackIcon = badgeType==='heritage' ? '🏆' : badgeType==='approved' ? '✔️' : badgeType==='pending' ? '⏳' : UI_ICONS.pin;
  return fallbackIcon + ' ';
}

function renderDesktopSidebar(locs){
  var list = document.getElementById('desktop-sidebar-list');
  if(!list) return;

  var meta = document.getElementById('desktop-sidebar-meta');
  if(meta) meta.textContent = (locs ? locs.length : 0) + ' quán';

  var title = document.getElementById('desktop-sidebar-title');
  if(title){
    title.textContent = (activeFilter && activeFilter !== 'all') ? '🔍 ' + activeFilter : '🍜 Danh sách quán';
  }

  if(!Array.isArray(locs) || !locs.length){
    list.innerHTML = '<div style="padding:32px 20px;text-align:center;color:var(--sl);font-size:13px;font-weight:600;"><span style="font-size:28px;display:block;margin-bottom:8px;">😔</span>Không tìm thấy quán nào.</div>';
    return;
  }

  var uLat = userMarker ? userMarker.getLatLng().lat : null;
  var uLng = userMarker ? userMarker.getLatLng().lng : null;
  var hasGPS = !!(uLat && uLng);

  var gpsStatus = document.getElementById('desktop-sidebar-gps-status');
  if(gpsStatus) gpsStatus.style.display = hasGPS ? 'flex' : 'none';

  var sortedLocs = locs.map(function(loc){
    var dist = null;
    if(hasGPS){
      var c = parseCoord(loc.lat, loc.lng);
      if(c.lat && c.lng){
        dist = haversineDistanceKm(uLat, uLng, c.lat, c.lng);
      }
    }
    return {
      loc: loc,
      originalIdx: allLocs.indexOf(loc), // Use global index for navigation
      dist: dist
    };
  });

  if(hasGPS){
    sortedLocs.sort(function(a, b){
      var da = a.dist !== null ? a.dist : 99999;
      var db = b.dist !== null ? b.dist : 99999;
      return da - db;
    });
  }

  var rankColors = ['#f59e0b','#94a3b8','#b45309'];

  list.innerHTML = sortedLocs.map(function(item, i){
    var loc = item.loc;
    var idx = item.originalIdx;
    
    var img = loc.image_url || '';
    var thumb = img ? '<img src="'+img+'" loading="lazy" onerror="this.style.display=\'none\'"/>' : '<div style="width:52px;height:52px;border-radius:10px;background:#f1f5f9;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:24px;">' + (loc.emoji || '🍜') + '</div>';

    var badge = BADGE_LABELS[loc.badge_type] || BADGE_LABELS['spot'];
    var badgeHtml = '<span style="display:inline-flex;align-items:center;gap:2px;font-size:10px;font-weight:700;color:'+badge.color+';background:'+badge.color+'20;padding:2px 7px;border-radius:10px;margin-right:6px;">'+getBadgeIconHtml(loc.badge_type)+badge.text+'</span>';

    var isNear = false;
    var distHtml = '';
    if(hasGPS && item.dist !== null){
      isNear = item.dist < 1;
      distHtml = '<span style="margin-left:auto;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;white-space:nowrap;'
               + (isNear ? 'background:#dcfce7;color:#166534;' : 'background:#f1f5f9;color:var(--sl);')
               + '">' + (isNear ? '🟢 ' : '📍 ') + item.dist.toFixed(1) + ' km</span>';
    }

    var rankHtml = '';
    if(hasGPS && i < 3){
      rankHtml = '<div style="position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:'+rankColors[i]+';color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;">'+(i+1)+'</div>';
    }

    var bgStyle = (isNear && i===0) ? 'background: linear-gradient(135deg, #fff7ed, #fff);' : '';

    return '<div class="desktop-loc-card" style="position:relative;'+bgStyle+'" onclick="desktopSidebarGoTo('+idx+')">'
      + rankHtml
      + thumb
      + '<div style="flex:1;min-width:0;"><div class="desktop-loc-card-name" style="display:flex;align-items:center;flex-wrap:nowrap;gap:4px;padding-right:24px;"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+(loc.name||'')+'</span>'+distHtml+'</div>'
      + '<div class="desktop-loc-card-sub" style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">'+badgeHtml+'<span>'+(loc.category||'')+(loc.must_try ? ' · '+loc.must_try : '')+'</span></div></div>'
      + '</div>';
  }).join('');
}

function openMobileList() { document.getElementById('mobile-list-sheet').classList.add('open'); }
function closeMobileList() { document.getElementById('mobile-list-sheet').classList.remove('open'); }
function mobileListGoTo(idx) {
  closeMobileList();
  setTimeout(function(){
    var loc = allLocs[idx];
    if(!loc) return;
    var c = parseCoord(loc.lat, loc.lng);
    if(c.lat && c.lng) map.flyTo([c.lat, c.lng], 16, {animate: true, duration: 0.8});
    openSheet(loc);
  }, 350);
}

function renderMobileList(locs) {
  var countEl = document.getElementById('mobile-list-count');
  var countSheetEl = document.getElementById('mobile-sheet-count');
  var btn = document.getElementById('mobile-list-btn');
  if(btn) btn.style.display = 'flex';
  var num = locs ? locs.length : 0;
  var displayNum = num > 999 ? (num/1000).toFixed(1).replace('.0', '') + 'k' : num;
  if(countEl) countEl.textContent = displayNum;
  if(countSheetEl) countSheetEl.textContent = num;

  var content = document.getElementById('mobile-list-content');
  if(!content) return;
  if(!Array.isArray(locs) || !locs.length){
    content.innerHTML = '<div style="padding:32px 20px;text-align:center;color:var(--sl);font-size:13px;font-weight:600;"><span style="font-size:28px;display:block;margin-bottom:8px;">😔</span>Không tìm thấy quán nào.</div>';
    return;
  }
  
  var uLat = userMarker ? userMarker.getLatLng().lat : null;
  var uLng = userMarker ? userMarker.getLatLng().lng : null;
  var hasGPS = !!(uLat && uLng);

  var gpsStatus = document.getElementById('mobile-list-gps-status');
  if(gpsStatus) gpsStatus.style.display = hasGPS ? 'flex' : 'none';

  var sortedLocs = locs.map(function(loc){
    var dist = null;
    if(hasGPS){
      var c = parseCoord(loc.lat, loc.lng);
      if(c.lat && c.lng){
        dist = haversineDistanceKm(uLat, uLng, c.lat, c.lng);
      }
    }
    return { loc: loc, originalIdx: allLocs.indexOf(loc), dist: dist };
  });

  if(hasGPS){
    sortedLocs.sort(function(a, b){
      var da = a.dist !== null ? a.dist : 99999;
      var db = b.dist !== null ? b.dist : 99999;
      return da - db;
    });
  }

  var rankColors = ['#f59e0b','#94a3b8','#b45309'];
  content.innerHTML = sortedLocs.map(function(item, i){
    var loc = item.loc;
    var idx = item.originalIdx;
    var img = loc.image_url || '';
    var thumb = img ? '<img src="'+img+'" loading="lazy" style="width:60px;height:60px;border-radius:12px;object-fit:cover;flex-shrink:0;" onerror="this.style.display=\'none\'"/>' : '<div style="width:60px;height:60px;border-radius:12px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">' + (loc.emoji || '🍜') + '</div>';

    var badge = BADGE_LABELS[loc.badge_type] || BADGE_LABELS['spot'];
    var badgeHtml = '<span style="display:inline-flex;align-items:center;gap:2px;font-size:10px;font-weight:700;color:'+badge.color+';background:'+badge.color+'20;padding:2px 7px;border-radius:10px;margin-right:6px;">'+getBadgeIconHtml(loc.badge_type)+badge.text+'</span>';

    var isNear = false;
    var distHtml = '';
    if(hasGPS && item.dist !== null){
      isNear = item.dist < 1;
      distHtml = '<span style="margin-left:auto;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;white-space:nowrap;'
               + (isNear ? 'background:#dcfce7;color:#166534;' : 'background:#f1f5f9;color:var(--sl);')
               + '">' + (isNear ? '🟢 ' : '📍 ') + item.dist.toFixed(1) + ' km</span>';
    }

    var rankHtml = '';
    if(hasGPS && i < 3){
      rankHtml = '<div style="position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:'+rankColors[i]+';color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:10;">'+(i+1)+'</div>';
    }

    var bgStyle = (isNear && i===0) ? 'background: linear-gradient(135deg, #fff7ed, #fff);' : '';

    return '<div class="desktop-loc-card" style="position:relative;'+bgStyle+'" onclick="mobileListGoTo('+idx+')">'
      + rankHtml
      + thumb
      + '<div style="flex:1;min-width:0;"><div class="desktop-loc-card-name" style="display:flex;align-items:center;flex-wrap:nowrap;gap:4px;padding-right:24px;"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+(loc.name||'')+'</span>'+distHtml+'</div>'
      + '<div class="desktop-loc-card-sub" style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">'+badgeHtml+'<span>'+(loc.category||'')+(loc.must_try ? ' · '+loc.must_try : '')+'</span></div></div>'
      + '</div>';
  }).join('');
}

function desktopSidebarGoTo(idx){
  var loc = allLocs[idx];
  if(!loc) return;
  var c = parseCoord(loc.lat, loc.lng);
  if(c.lat && c.lng) map.panTo([c.lat, c.lng]);
  openSheet(loc);
}

// ── Cập nhật lại split-view khi người dùng kéo giãn/co nhỏ cửa sổ trình duyệt ──
window.addEventListener('resize', function(){
  var isMapNow = document.getElementById('page-map') ? document.getElementById('page-map').classList.contains('show') : false;
  // Nếu không dùng page-map riêng (mà map là base layer), coi map đang hiện khi không có overlay page nào 'show'
  var anyOverlayShown = ['home','cook','admin'].some(function(k){
    var p = document.getElementById('page-'+k);
    return p && p.classList.contains('show');
  });
  var onMapPage = !anyOverlayShown;
  document.body.classList.toggle('desktop-mode', window.innerWidth >= 1024);
  document.body.classList.toggle('desktop-map-view', onMapPage && window.innerWidth >= 1024);
  if(window.map) setTimeout(function(){ map.invalidateSize(true); }, 200);
});

// WebP 3D Map Pins (Floating with Arrow)
function mkPin(badge){
  var url = WEBP_ICONS[badge] || WEBP_ICONS['spot'];
  var colorClass = 'blue';
  var iconText = UI_ICONS.pin;
  
  var imgSize = 38;
  if(badge==='heritage'){ colorClass='gold'; iconText='🏆'; imgSize = 42; }
  else if(badge==='approved'){ colorClass='orange'; iconText='✔️'; imgSize = 40; }
  else if(badge==='pending'){ colorClass='purple'; iconText='⏳'; imgSize = 38; }

  // Nếu có link WebP, hiển thị ảnh 3D nổi và chèn mũi tên bên dưới
  if (url && url.length > 50) {
    var html = '<div style="display:flex; flex-direction:column; align-items:center;">'
      + '<img src="' + url + '" style="width:'+imgSize+'px; height:'+imgSize+'px; object-fit:contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));" alt="badge" />'
      + '<div class="map-pin-arrow '+colorClass+'" style="margin-top:-2px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));"></div>'
      + '</div>';
    
    var totalHeight = imgSize + 10 - 2; // img height + arrow height (10) - margin (-2)
    return L.divIcon({
      html: html,
      iconSize: [imgSize, totalHeight],
      iconAnchor: [imgSize/2, totalHeight],
      className: 'custom-map-pin'
    });
  }
  
  // Fallback (HTML thuần)
  var htmlFb = '<div class="map-pin-box">'
    + '<div class="map-pin-head '+colorClass+'">'+iconText+'</div>'
    + '<div class="map-pin-arrow '+colorClass+'"></div>'
    + '</div>';
    
  return L.divIcon({html:htmlFb,iconSize:[80,44],iconAnchor:[40,44],className:'custom-map-pin'});
}

function loadMarkers(locs, skipFitBounds){
  if(!Array.isArray(locs)) locs = [];
  markers.forEach(function(m){map.removeLayer(m);}); markers=[];
  var validBounds = [];
  locs.forEach(function(loc){
    var c = parseCoord(loc.lat, loc.lng);
    if(!c.lat || !c.lng) return;
    var m = L.marker([c.lat, c.lng], {icon: mkPin(loc.badge_type)});
    m.on('click', function(e){
      L.DomEvent.stopPropagation(e);
      openSheet(loc);
      map.panTo([c.lat, c.lng]);
    });
    m.addTo(map); markers.push(m);
    validBounds.push([c.lat, c.lng]);
  });

  if(map){
    map.invalidateSize();
  }

  // CRITICAL FIX: If userMarker exists, NEVER override map position back to default!
  if(!skipFitBounds && !userMarker){
    if(validBounds.length > 0){
      try{
        map.fitBounds(L.latLngBounds(validBounds), { maxZoom: 14, padding: [50, 50] });
      }catch(e){}
    }
  }
}

function filterMap(f, btn, skipFitBounds){
  activeFilter = f;
  if(btn){
    document.querySelectorAll('.pill, .s-filter-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
  }
  
  closeSheet();

  var filtered = [];
  if(!Array.isArray(allLocs)) allLocs = [];

  if(f==='fav') {
    filtered = allLocs.filter(function(l) { return isFav(l.id); });
  }else if(f==='near'){
    if (typeof userMarker !== 'undefined' && userMarker) {
      var uLat = userMarker.getLatLng().lat;
      var uLng = userMarker.getLatLng().lng;
      filtered = allLocs.filter(function(l) {
        var c = parseCoord(l.lat, l.lng);
        if(c.lat && c.lng) {
          var dist = haversineDistanceKm(uLat, uLng, c.lat, c.lng);
          return dist <= 5.0;
        }
        return false;
      });
    } else {
      filtered = allLocs;
    }
  }else if(f==='all'){
    filtered = allLocs;
  }else if(['heritage','approved','spot','pending'].indexOf(f) !== -1){
    filtered = allLocs.filter(function(l){ return l.badge_type === f; });
  }else{
    var searchCat = f.toLowerCase().trim();
    filtered = allLocs.filter(function(l){
      var c = (l.category||'').toLowerCase().trim();
      return c === searchCat || c.indexOf(searchCat) !== -1 || searchCat.indexOf(c) !== -1;
    });
  }

  loadMarkers(filtered, skipFitBounds || !!userMarker);

  if(document.body.classList.contains('desktop-map-view')) {
    renderDesktopSidebar(filtered);
  }
  renderMobileList(filtered);

  if(map){
    setTimeout(function(){ map.invalidateSize(); }, 50);
    setTimeout(function(){ map.invalidateSize(); }, 250);
  }
}

// Simple pulse animation for GPS dot since we can't inject @keyframes easily here without touching global CSS
setInterval(function(){
  var dot = document.getElementById('gps-pulse-dot');
  var mdot = document.getElementById('mobile-gps-pulse-dot');
  if(dot) dot.style.opacity = dot.style.opacity === '0.4' ? '1' : '0.4';
  if(mdot) mdot.style.opacity = mdot.style.opacity === '0.4' ? '1' : '0.4';
}, 750);

// ── PWA PROMPT
var deferredPrompt=null;
window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault(); deferredPrompt=e;
  setTimeout(function(){
    if(!localStorage.getItem('pwa-ok')) document.getElementById('pwa-banner').classList.add('show');
  },4000);
});
function installPWA(){
  if(!deferredPrompt){alert(t('ios'));return;}
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function(r){
    if(r.outcome==='accepted'){document.getElementById('pwa-banner').classList.remove('show');localStorage.setItem('pwa-ok','1');}
    deferredPrompt=null;
  });
}
function dismissPWA(){document.getElementById('pwa-banner').classList.remove('show');localStorage.setItem('pwa-ok','1');}

// ── OFFLINE
function chkOnline(){document.getElementById('offline-bar').style.display=navigator.onLine?'none':'block';}
window.addEventListener('online',chkOnline); window.addEventListener('offline',chkOnline); chkOnline();

var globalCarouselTimer = null;
var carouselInstances = [];

// ── HOME PAGE CARDS RENDER

// --- FAVORITES LOGIC ---
function getFavs() {
  try { return JSON.parse(localStorage.getItem('tt_favs')) || []; } catch(e) { return []; }
}
function isFav(id) {
  return getFavs().includes(String(id));
}
function toggleFav(e, id) {
  if(e) e.stopPropagation();
  var favs = getFavs();
  id = String(id);
  if(favs.includes(id)) {
    favs = favs.filter(function(x) { return x !== id; });
  } else {
    favs.push(id);
  }
  localStorage.setItem('tt_favs', JSON.stringify(favs));
  
  var btns = document.querySelectorAll('.sheet-fav-btn[data-id="'+id+'"]');
  btns.forEach(function(btn) {
    if(favs.includes(id)) {
      btn.classList.add('liked');
      var card = btn.closest('.desktop-loc-card') || btn.closest('.home-featured-card');
      if(card) card.classList.add('is-liked');
    } else {
      btn.classList.remove('liked');
      var card = btn.closest('.desktop-loc-card') || btn.closest('.home-featured-card');
      if(card) {
        card.classList.remove('is-liked');
        var favFilter = document.getElementById('btn-fav');
        if(favFilter && favFilter.classList.contains('active') && card.classList.contains('desktop-loc-card')) {
          card.style.display = 'none';
        }
      }
    }
  });
}

function toggleFilterMap(type, btn) {
    if(type === 'fav') {
        var isActive = btn.classList.contains('active');
        if (isActive) {
            btn.classList.remove('active');
            filterMap('all'); 
            var allPill = document.querySelector('.pill-scroll .pill:first-child');
            if (allPill) allPill.classList.add('active');
        } else {
            filterMap('fav', btn);
        }
    } else if(type === 'near') {
        var isActive = btn.classList.contains('active');
        if (isActive) {
            btn.classList.remove('active');
            filterMap('all'); 
            var allPill = document.querySelector('.pill-scroll .pill:first-child');
            if (allPill) allPill.classList.add('active');
        } else {
            // Provide immediate feedback
            document.querySelectorAll('.pill, .s-filter-btn').forEach(function(b){b.classList.remove('active');});
            btn.classList.add('active');
            
            if (typeof userMarker !== 'undefined' && userMarker) {
                filterMap('near', btn);
            } else {
                activeFilter = 'near';
                if(typeof locateMe === 'function') locateMe();
            }
        }
    } else if(type === 'price') {
      btn.classList.toggle('active');
    }
  }
  // -----------------------

function renderHomeLatestCards(){
  var locContainer = document.getElementById('home-loc-cards');
  var recipeContainer = document.getElementById('home-recipe-cards');
  
  if(globalCarouselTimer) clearInterval(globalCarouselTimer);
  carouselInstances = [];

  const svgShield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>';
  const svgTag = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
  const svgSpark = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  
  const svgClock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
  const svgUser = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
  const svgFlame = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>';
  const svgBook = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';

  if(locContainer && typeof allLocs!=='undefined' && allLocs.length > 0){
      var validLocs = allLocs.filter(function(loc){ return loc.badge_type !== 'pending'; });
      var html = '';
      var count = Math.min(4, validLocs.length);
      for(var i=0; i<count; i++){
        var latestLoc = validLocs[validLocs.length - 1 - i];
        
        var badgeText = (latestLoc.badge_type === 'heritage') ? 'Thao Thức Heritage' : (latestLoc.badge_type === 'approved') ? 'Thao Thức Approved' : 'Thao Thức Spot';
        var iconHtml = svgShield;
        if(typeof WEBP_ICONS!=='undefined' && WEBP_ICONS[latestLoc.badge_type] && WEBP_ICONS[latestLoc.badge_type].length > 50){
           iconHtml = '<img src="' + WEBP_ICONS[latestLoc.badge_type] + '" alt="badge">';
        }

        var imgUrl = latestLoc.image_url || latestLoc.photo_url || CAT_IMAGES[latestLoc.category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
        
        html += '<div class="home-featured-card" onclick="openHomeCardLoc(\''+latestLoc.id+'\')">'
          + '<div class="hf-img-wrap">'
          + '<img src="'+imgUrl+'" alt="Loc"/>'
          + (i===0 ? '<span class="hf-badge">MỚI REVIEW</span>' : '')
          + (latestLoc.price_range ? '<span class="hf-price-float">'+latestLoc.price_range+'</span>' : '')
          + '</div>'
          + '<div class="hf-body">'
          + '<div class="hf-title-row"><div class="hf-title">'+latestLoc.name+'</div></div>'
          + '<div class="hf-meta-row">'
          + '<span class="hf-rating">' + iconHtml + ' ' + badgeText + '</span>'
          + '<span class="hf-cat">' + svgTag + ' ' + (latestLoc.category||'Khác') + '</span>'
          + '</div>'
          + (latestLoc.must_try ? '<div class="hf-must-try">' + svgSpark + '<div><span>Món tủ:</span> ' + latestLoc.must_try + '</div></div>' : '<div style="flex:1"></div>')
          + '<button class="hf-btn">Khám phá ngay &rarr;</button>'
          + '</div></div>';
      }
      locContainer.innerHTML = html;
      if(typeof initCarouselDots === 'function') initCarouselDots('home-loc-cards', 'home-loc-dots', count);
  }

  if(recipeContainer && typeof RECIPES_DATA!=='undefined' && RECIPES_DATA.length > 0){
    var rhtml = '';
    var rcount = Math.min(4, RECIPES_DATA.length);
    var chibiImg = document.querySelector('.cook-hero-avatar img');
    var chibiSrc = chibiImg ? chibiImg.src : '';
    
    for(var j=0; j<rcount; j++){
      var latestRcp = RECIPES_DATA[RECIPES_DATA.length - 1 - j];
      var serving = latestRcp.servings || '2-3';
      
      rhtml += '<div class="home-featured-card" onclick="openRecipeDetail(\''+latestRcp.id+'\')">'
        + '<div class="hf-img-wrap"><img src="'+latestRcp.image+'" alt="Recipe"/>'
        + (j===0 ? '<span class="hf-badge" style="color:#059669;">CÔNG THỨC CHUẨN VỊ</span>' : '')
        + (chibiSrc ? '<div class="hf-avatar"><img src="'+chibiSrc+'" alt="Logo"/></div>' : '')
        + '</div>'
        + '<div class="hf-body">'
        + '<div class="hf-title-row"><div class="hf-title">'+latestRcp.name+'</div></div>'
        + '<div class="hf-rm-row">'
        + '<div class="hf-rm-item">' + svgClock + ' ' + latestRcp.time + '</div>'
        + '<div class="hf-rm-item">' + svgUser + ' ' + serving + ' ng</div>'
        + '<div class="hf-rm-item">' + svgFlame + ' ' + latestRcp.level + '</div>'
        + '</div>'
        + '<div class="hf-must-try">' + svgBook + ' <div>' + (latestRcp.category||'Cẩm nang nấu ăn chuẩn vị gia đình') + '</div></div>'
        + '<button class="hf-btn">Xem công thức &rarr;</button>'
        + '</div></div>';
    }
    recipeContainer.innerHTML = rhtml;
    if(typeof initCarouselDots === 'function') initCarouselDots('home-recipe-cards', 'home-recipe-dots', rcount);
  }
  
  startGlobalCarouselTimer();
}

function initCarouselDots(containerId, dotsId, count) {
  var container = document.getElementById(containerId);
  var dotsContainer = document.getElementById(dotsId);
  if(!container || !dotsContainer || count <= 1) {
    if(dotsContainer) dotsContainer.innerHTML = '';
    return;
  }
  
  var dotsHtml = '';
  for(var i=0; i<count; i++){
    dotsHtml += '<div class="h-dot '+(i===0?'active':'')+'" data-index="'+i+'"></div>';
  }
  dotsContainer.innerHTML = dotsHtml;
  
  var dots = dotsContainer.querySelectorAll('.h-dot');
  
  var instance = {
    container: container,
    count: count,
    currentIndex: 0,
    direction: 1
  };
  carouselInstances.push(instance);
  
  container.addEventListener('scroll', function(){
    var scrollLeft = container.scrollLeft;
    var cardWidth = container.offsetWidth;
    var index = Math.round(scrollLeft / cardWidth);
    if(index < 0) index = 0;
    if(index >= count) index = count - 1;
    
    instance.currentIndex = index;
    
    dots.forEach(function(d, i){
      if(i === index) d.classList.add('active');
      else d.classList.remove('active');
    });
  });
  
  dots.forEach(function(dot, i){
    dot.addEventListener('click', function(){
      var cardWidth = container.offsetWidth;
      container.scrollTo({
        left: cardWidth * i,
        behavior: 'smooth'
      });
    });
  });
  
  container.addEventListener('touchstart', stopGlobalCarouselTimer, {passive: true});
  container.addEventListener('touchend', startGlobalCarouselTimer, {passive: true});
  container.addEventListener('mouseenter', stopGlobalCarouselTimer);
  container.addEventListener('mouseleave', startGlobalCarouselTimer);
}

function startGlobalCarouselTimer() {
  if(globalCarouselTimer) clearInterval(globalCarouselTimer);
  globalCarouselTimer = setInterval(function(){
    carouselInstances.forEach(function(instance) {
      if(instance.direction === 1) {
        instance.currentIndex++;
        if(instance.currentIndex >= instance.count) {
          instance.currentIndex = instance.count - 2;
          instance.direction = -1;
        }
      } else {
        instance.currentIndex--;
        if(instance.currentIndex < 0) {
          instance.currentIndex = 1;
          instance.direction = 1;
        }
      }
      
      if(instance.currentIndex < 0) instance.currentIndex = 0;
      if(instance.currentIndex >= instance.count) instance.currentIndex = instance.count - 1;
      
      var cardWidth = instance.container.offsetWidth;
      instance.container.scrollTo({
        left: cardWidth * instance.currentIndex,
        behavior: 'smooth'
      });
    });
  }, 4000);
}

function stopGlobalCarouselTimer() {
  if(globalCarouselTimer) clearInterval(globalCarouselTimer);
  globalCarouselTimer = null;
}

function renderCriteriaIcons() {
  var map = { 'heritage': '🏆', 'approved': '✔️', 'spot': '📍', 'pending': '⏳' };
  Object.keys(map).forEach(function(k) {
    var el = document.getElementById('crit-icon-' + k);
    if(el) {
      if (WEBP_ICONS[k] && WEBP_ICONS[k].length > 50) {
        el.innerHTML = '<img src="' + WEBP_ICONS[k] + '" style="width:48px;height:48px;vertical-align:middle; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));" alt="badge">';
      } else {
        el.textContent = map[k];
      }
    }
  });
}

// ── INIT
// ── APP SPLASH SCREEN: ẩn khi data sẵn sàng, hoặc timeout an toàn tránh treo mãi ──
var splashHidden = false;
function hideAppSplash(){
  if(splashHidden) return;
  splashHidden = true;
  var el = document.getElementById('app-splash');
  if(el) el.classList.add('hide');
}

window.addEventListener('load',function(){
  // desktop-mode/desktop-map-view trước đây chỉ được set trong switchNav() khi bấm tab —
  // nên lần load đầu tiên (chưa bấm gì) trên màn hình rộng vẫn hiện dạng khung điện thoại.
  // Áp dụng ngay từ đầu, khớp với tab mặc định là 'map'.
  document.body.classList.toggle('desktop-mode', window.innerWidth >= 1024);
  document.body.classList.toggle('desktop-map-view', window.innerWidth >= 1024);

  renderCriteriaIcons();
  initCategories();
  initRecipeCategories();
  initMap();
  renderHomeLatestCards();
  setTimeout(hideAppSplash, 6000); // an toàn: nếu vì lý do gì data không về, vẫn tự ẩn splash sau 6s

  // Deep-link công thức (?id=...&type=recipe): RECIPES_DATA có sẵn ngay, không cần chờ onData()
  if(DEEP_LINK_ID && DEEP_LINK_TYPE === 'recipe'){
    switchNav('cook');
    setTimeout(function(){ openRecipeDetail(DEEP_LINK_ID); }, 300);
  }
});

// ── MAP SEARCH CAPSULE LOGIC ──

function getSearchHistory() {
  try { return JSON.parse(localStorage.getItem('tt_search_history')) || []; } catch(e) { return []; }
}
function addSearchHistory(term) {
  if(!term) return;
  var h = getSearchHistory();
  h = h.filter(function(x) { return x !== term; });
  h.unshift(term);
  if(h.length > 5) h = h.slice(0,5);
  localStorage.setItem('tt_search_history', JSON.stringify(h));
}

function handleMapSearchFocus() {
  var cap = document.getElementById('map-header');
  if(cap) cap.classList.add('focused');
  handleMapSearch();
}

function handleMapSearchBlur() {
  var cap = document.getElementById('map-header');
  if(cap) cap.classList.remove('focused');
  setTimeout(function() {
    var dd = document.getElementById('map-search-dropdown');
    if(dd) dd.classList.remove('show');
  }, 500); // delay
}

function handleMapSearch() {
  var input = document.getElementById('map-search-input');
  var dd = document.getElementById('map-search-dropdown');
  var resDiv = document.getElementById('map-search-results');
  if(!input || !dd || !resDiv) return;
  var clearBtn = document.getElementById('sc-clear-btn');
  if(clearBtn) clearBtn.style.display = input.value ? 'flex' : 'none';

  var q = input.value.trim().toLowerCase();
  dd.classList.add('show');
  resDiv.innerHTML = '';

  const svgHistory = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
  const svgSuggest = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

  if(!q) {
    var hist = getSearchHistory();
    if(hist.length === 0) {
      resDiv.innerHTML = '<div class="sc-empty" style="padding: 16px; color: var(--sl); font-size: 13px; text-align: center;">Nhập tên quán hoặc món ăn...</div>';
    } else {
      hist.forEach(function(term) {
        var item = document.createElement('div');
        item.className = 'sd-item';
        item.innerHTML = '<div class="sd-icon history">' + svgHistory + '</div><div class="sd-text">' + term + '<div class="sd-sub">Lịch sử tìm kiếm</div></div>';
        item.onclick = function() {
          input.value = term;
          handleMapSearch();
        };
        resDiv.appendChild(item);
      });
    }
    return;
  }

  var results = allLocs.filter(function(loc) {
    var nameMatch = (loc.name || '').toLowerCase().indexOf(q) !== -1;
    var catMatch = (loc.category || '').toLowerCase().indexOf(q) !== -1;
    var mustMatch = (loc.must_try || '').toLowerCase().indexOf(q) !== -1;
    var descMatch = (loc.description || '').toLowerCase().indexOf(q) !== -1;
    return nameMatch || catMatch || mustMatch || descMatch;
  });

  if(results.length === 0) {
    resDiv.innerHTML = '<div class="sc-empty" style="padding: 16px; color: var(--sl); font-size: 13px; text-align: center;">Không tìm thấy quán nào phù hợp.</div>';
  } else {
    results.forEach(function(loc) {
      var item = document.createElement('div');
      item.className = 'sd-item';
      item.innerHTML = '<div class="sd-icon">' + svgSuggest + '</div><div class="sd-text">' + (loc.name||'') + '<div class="sd-sub">Gợi ý từ khoá</div></div>';
      item.onclick = function() {
        addSearchHistory(loc.name);
        if(map && loc.lat && loc.lng) {
          map.flyTo([loc.lat, loc.lng], 16, {animate: true, duration: 1.5});
          setTimeout(function(){ openSheet(loc); }, 1500);
        }
        dd.classList.remove('show');
      };
      resDiv.appendChild(item);
    });
  }
}


function clearMapSearch(){
  var input = document.getElementById('map-search-input');
  var dd = document.getElementById('map-search-dropdown');
  var clearBtn = document.getElementById('sc-clear-btn');
  if(input) { input.value = ''; input.focus(); }
  if(dd) dd.classList.remove('show');
  if(clearBtn) clearBtn.style.display = 'none';
  // Also trigger handleMapSearch to reset map view
  handleMapSearch();
}

function openHomeCardLoc(locId) {
  switchNav('map'); 
  var cap = document.getElementById('map-header');
  if(cap) cap.classList.remove('focused');
  
  setTimeout(function() {
    var loc = allLocs.find(function(l){ return String(l.id) === String(locId); });
    if(loc && map && loc.lat && loc.lng) {
      map.flyTo([loc.lat, loc.lng], 16); 
      setTimeout(function() {
        openSheet(loc);
      }, 500);
    }
  }, 500);
}


// ── AI CHATBOT LOGIC ──
function toggleAiDrawer() {
  var drawer = document.getElementById('ai-drawer');
  if(drawer) drawer.classList.toggle('open');
}

function findLocsInText(text) {
  if (!text || typeof allLocs === 'undefined' || !allLocs || !allLocs.length) return [];
  var found = [];
  var seenIds = {};
 
  // Pass 1: tên quán được AI bôi đậm bằng **Tên**
  var names = [];
  var re = /\*\*(.+?)\*\*/g;
  var m;
  while ((m = re.exec(text)) !== null) { names.push(m[1].trim()); }
  names.forEach(function(n) {
	var nLower = n.toLowerCase();
	var loc = allLocs.find(function(l) { return l.name && l.name.toLowerCase() === nLower; });
	if (!loc) {
  	loc = allLocs.find(function(l) {
    	return l.name && (l.name.toLowerCase().indexOf(nLower) !== -1 || nLower.indexOf(l.name.toLowerCase()) !== -1);
  	});
	}
	if (loc && !seenIds[loc.id]) { seenIds[loc.id] = true; found.push(loc); }
  });
 
  // Pass 2: dự phòng khi AI không bôi đậm - quét tên quán xuất hiện trực tiếp trong câu trả lời
  if (!found.length) {
	var textLower = text.toLowerCase();
	allLocs.forEach(function(l) {
  	if (l.name && l.name.length > 3 && textLower.indexOf(l.name.toLowerCase()) !== -1 && !seenIds[l.id]) {
    	seenIds[l.id] = true; found.push(l);
  	}
	});
  }
 
  return found;
}
 
function appendAiMsg(text, isUser, matchedLocs, legacyLatLng) {
  var body = document.getElementById('ai-body');
  if(!body) return;
  var div = document.createElement('div');
  div.className = isUser ? 'user-msg' : 'ai-msg';
  if (isUser) { div.style.background = '#FF7043'; div.style.color = 'white'; }
 
  var cleanText = text.replace(/\(Lat:\s*-?\d+\.\d+,\s*Lng:\s*-?\d+\.\d+\)/gi, '').replace(/\*\*/g, '').trim();
  div.textContent = cleanText;
 
  if (!isUser) {
	var locs = (matchedLocs && matchedLocs.length) ? matchedLocs : (legacyLatLng ? [{ name: '', lat: legacyLatLng.lat, lng: legacyLatLng.lng, video_url: '' }] : []);
	locs.forEach(function(loc) {
  	var actionsDiv = document.createElement('div');
  	actionsDiv.className = 'ai-actions';
 
  	if (locs.length > 1 && loc.name) {
    	var label = document.createElement('span');
    	label.textContent = loc.name;
    	label.style.cssText = 'flex-basis:100%;font-size:11px;font-weight:800;color:var(--sl);';
    	actionsDiv.appendChild(label);
  	}
 
  	var btnMap = document.createElement('button');
  	btnMap.className = 'ai-act-btn';
  	btnMap.textContent = '📍 Xem bản đồ';
  	btnMap.onclick = function(){ aiActionFlyTo(loc.lat, loc.lng); };
  	actionsDiv.appendChild(btnMap);
 
  	var btnNav = document.createElement('button');
  	btnNav.className = 'ai-act-btn';
  	btnNav.textContent = '🗺️ Chỉ đường';
  	btnNav.onclick = function(){ aiActionNav(loc.lat, loc.lng); };
  	actionsDiv.appendChild(btnNav);
 
  	if (loc.video_url) {
    	var btnReview = document.createElement('button');
    	btnReview.className = 'ai-act-btn';
    	btnReview.textContent = '🎬 Review';
    	btnReview.onclick = function(){ window.open(loc.video_url, '_blank'); };
    	actionsDiv.appendChild(btnReview);
  	}
 
  	div.appendChild(actionsDiv);
	});
  }
 
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function aiActionFlyTo(lat, lng) {
  toggleAiDrawer();
  if (typeof map !== 'undefined' && map) {
    map.flyTo([lat, lng], 17);
    if(typeof markers !== 'undefined') {
      markers.forEach(function(m) {
        var pos = m.getLatLng();
        if (Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001) {
          m.openPopup();
        }
      });
    }
  }
}

function aiActionNav(lat, lng) {
  window.open('https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng, '_blank');
}

function sendAiMsg(overrideText) {
  var input = document.getElementById('ai-input');
  var text = overrideText || (input ? input.value.trim() : '');
  if (!text) return;
  
  if(input) input.value = '';
  appendAiMsg(text, true);
  
  var body = document.getElementById('ai-body');
  var typingDiv = document.createElement('div');
  typingDiv.className = 'ai-msg typing-indicator';
  typingDiv.textContent = 'Tớ đang suy nghĩ...';
  typingDiv.id = 'ai-typing';
  body.appendChild(typingDiv);
  body.scrollTop = body.scrollHeight;

  var uLat = typeof userMarker !== 'undefined' && userMarker ? userMarker.getLatLng().lat : null;
  var uLng = typeof userMarker !== 'undefined' && userMarker ? userMarker.getLatLng().lng : null;

  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler(function(res) {
        var t = document.getElementById('ai-typing');
        if (t) t.remove();
        
      var reply = res.reply || "";
    	var matchedLocs = findLocsInText(reply);
    	var legacyMatch = reply.match(/Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/i);
    	var legacyLatLng = legacyMatch ? { lat: legacyMatch[1], lng: legacyMatch[2] } : null;
    	appendAiMsg(reply, false, matchedLocs, legacyLatLng);

      })
      .withFailureHandler(function(err) {
        var t = document.getElementById('ai-typing');
        if (t) t.remove();
        appendAiMsg("Hic, đường truyền của tớ đang hơi yếu. Bạn thử lại sau chút xíu nha!", false);
      })
      .askGeminiAI(text, uLat, uLng, '');
  } else {
    setTimeout(function(){
      var t = document.getElementById('ai-typing');
      if (t) t.remove();
      appendAiMsg("Tớ đang chạy ở chế độ Local! Thử một quán ngon này", false, [], { lat: 16.0544, lng: 108.2022 });
    }, 1000);
  }
}
// --- VITE ES MODULE FIX: ATTACH GLOBALS FOR INLINE HTML HANDLERS ---
window.clearImageSelect = clearImageSelect;
window.clearMapSearch = clearMapSearch;
window.closeMobileList = closeMobileList;
window.closeModal = closeModal;
window.closeSheet = closeSheet;
window.desktopSidebarGoTo = desktopSidebarGoTo;
window.dismissPWA = dismissPWA;
window.doSuggest = doSuggest;
window.filterRecipesByCategory = filterRecipesByCategory;
window.gpsForSuggest = gpsForSuggest;
window.handleImageFileSelect = handleImageFileSelect;
window.handleMapSearch = handleMapSearch;
window.installPWA = installPWA;
window.locateMe = locateMe;
window.mobileListGoTo = mobileListGoTo;
window.navTap = navTap;
window.openHomeCardLoc = openHomeCardLoc;
window.openMobileList = openMobileList;
window.openModal = openModal;
window.openRecipeDetail = openRecipeDetail;
  window.changeServings = changeServings;
window.sendAiMsg = sendAiMsg;
window.shareCurrentLocation = shareCurrentLocation;
window.shareCurrentRecipe = shareCurrentRecipe;
window.switchNav = switchNav;
window.toggleAiDrawer = toggleAiDrawer;
window.toggleLang = toggleLang;
// --------------------------------------------------------------------

// Global click listener to close map search dropdown
document.addEventListener('click', function(e) {
  var dd = document.getElementById('map-search-dropdown');
  var cap = document.getElementById('map-header');
  if (dd && dd.classList.contains('show')) {
    if (!dd.contains(e.target) && (!cap || !cap.contains(e.target))) {
      dd.classList.remove('show');
    }
  }
});

window.toggleFilterMap = toggleFilterMap;
window.toggleFavLocSheet = function() {
  if (!currentSheetLoc) return;
  toggleFav(null, currentSheetLoc.id);
  var favBtn = document.getElementById('sh-fav-btn');
  if (favBtn) {
    if (isFav(currentSheetLoc.id)) favBtn.classList.add('liked');
    else favBtn.classList.remove('liked');
  }
};
