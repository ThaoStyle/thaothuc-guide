function doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : '';

  if (action === 'getLocations')   return jsonOut(getFoodLocations());
  if (action === 'getRecipes')     return jsonOut(getRecipes());
  if (action === 'getSuggestions') return jsonOut(getSuggestions());
  if (action === 'getAdminStatus') return jsonOut(getAdminStatus());
  
  // Trả về JSON thuần túy, KHÔNG render HTML
  return jsonOut({ status: 'ok', version: '2.0', message: 'Thao Thức Guide API is running perfectly on Vercel API branch.' });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';

    if (action === 'saveSuggestion') return jsonOut(saveSuggestion(body.data));
    if (action === 'askAI')          return jsonOut(askGeminiAI(body.query, body.lat, body.lng, body.tab));

    if (action === 'addRecipe')      return jsonOut(addRecipe(body.data));
    if (action === 'updateRecipe')   return jsonOut(updateRecipe(body.id, body.data));
    if (action === 'deleteRecipe')   return jsonOut(deleteRecipe(body.id));

    return jsonOut({ success: false, error: 'Unknown action: ' + action });
  } catch(err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function getAdminStatus() {
  try {
    var email = Session.getActiveUser().getEmail();
    var ownerEmail = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getOwner().getEmail();
    return {
      email: email,
      isAdmin: (email.toLowerCase() === ownerEmail.toLowerCase())
    };
  } catch(e) {
    return { email: "", isAdmin: true };
  }
}

function extractLatLngRegex(str) {
  if (!str) return null;
  var s = String(str).trim();

  // Pattern 1: Exact Place Pin Marker (!3d<lat>...!4d<lng>) -> HIGHEST ACCURACY
  var mPin = s.match(/!3d(-?\d+(?:\.\d+)?)(?:![^!]+)*?!4d(-?\d+(?:\.\d+)?)/);
  if (mPin) {
    var latP = parseFloat(mPin[1]), lngP = parseFloat(mPin[2]);
    if (!isNaN(latP) && !isNaN(lngP) && Math.abs(latP) <= 90 && Math.abs(lngP) <= 180) {
      return { lat: latP, lng: lngP };
    }
  }

  // Pattern 2: StaticMap markers=lat,lng or center=lat,lng in URL or HTML
  var mMarker = s.match(/staticmap\?[^"]*?markers=(-?\d+(?:\.\d+)?)(?:%2C|,|\+)+(-?\d+(?:\.\d+)?)/i);
  if (mMarker) {
    var latM = parseFloat(mMarker[1]), lngM = parseFloat(mMarker[2]);
    if (!isNaN(latM) && !isNaN(lngM) && Math.abs(latM) <= 90 && Math.abs(lngM) <= 180) {
      return { lat: latM, lng: lngM };
    }
  }

  // Pattern 3: Query parameters (q=lat,lng or ll=lat,lng or query=lat,lng or center=lat,lng)
  var mQ = s.match(/(?:[?&](?:q|ll|query|center)=|maps\?q=)(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i);
  if (mQ) {
    var latQ = parseFloat(mQ[1]), lngQ = parseFloat(mQ[2]);
    if (!isNaN(latQ) && !isNaN(lngQ) && Math.abs(latQ) <= 90 && Math.abs(lngQ) <= 180) {
      return { lat: latQ, lng: lngQ };
    }
  }

  // Pattern 4: Path coordinates /search/lat,lng or /place/lat,lng or /dir/lat,lng
  var mPath = s.match(/\/(?:place|search|dir)\/[^\/]*?\/(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i) ||
              s.match(/\/(?:search|place|dir)\/(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i);
  if (mPath) {
    var latPt = parseFloat(mPath[1]), lngPt = parseFloat(mPath[2]);
    if (!isNaN(latPt) && !isNaN(lngPt) && Math.abs(latPt) <= 90 && Math.abs(lngPt) <= 180) {
      return { lat: latPt, lng: lngPt };
    }
  }

  // Pattern 5: Embedded JSON array pattern in Google Maps HTML body
  var mJsonPin = s.match(/\[null,null,(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\]/);
  if (mJsonPin) {
    var latJ = parseFloat(mJsonPin[1]), lngJ = parseFloat(mJsonPin[2]);
    if (!isNaN(latJ) && !isNaN(lngJ) && Math.abs(latJ) <= 90 && Math.abs(lngJ) <= 180) {
      return { lat: latJ, lng: lngJ };
    }
  }

  // Pattern 6: Viewport Camera Center @lat,lng (Fallback)
  var mAt = s.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (mAt) {
    var latAt = parseFloat(mAt[1]), lngAt = parseFloat(mAt[2]);
    if (!isNaN(latAt) && !isNaN(lngAt) && Math.abs(latAt) <= 90 && Math.abs(lngAt) <= 180) {
      return { lat: latAt, lng: lngAt };
    }
  }

  return null;
}

function resolveLatLngFromMapUrl(mapUrl) {
  if (!mapUrl) return null;
  var url = String(mapUrl).trim();

  // 1. Direct match on given URL
  var directMatch = extractLatLngRegex(url);
  if (directMatch) return directMatch;

  // 2. Follow redirects step-by-step up to 3 levels checking Location headers
  var currentUrl = url;
  for (var hop = 0; hop < 3; hop++) {
    try {
      var resp = UrlFetchApp.fetch(currentUrl, {
        followRedirects: false,
        muteHttpExceptions: true
      });
      var headers = resp.getHeaders();
      var loc = headers['Location'] || headers['location'];
      if (loc) {
        var matchLoc = extractLatLngRegex(loc);
        if (matchLoc) return matchLoc;
        currentUrl = loc;
      } else {
        break;
      }
    } catch(e1) {
      break;
    }
  }

  // 3. Follow all redirects and parse HTML head meta tags (og:image staticmap & og:url)
  try {
    var resp3 = UrlFetchApp.fetch(url, {
      followRedirects: true,
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    var htmlText = resp3.getContentText();

    // Check meta staticmap in HTML
    var matchMarker = htmlText.match(/staticmap\?[^"]*?markers=(-?\d+(?:\.\d+)?)(?:%2C|,|\+)+(-?\d+(?:\.\d+)?)/i) ||
                      htmlText.match(/staticmap\?[^"]*?center=(-?\d+(?:\.\d+)?)(?:%2C|,|\+)+(-?\d+(?:\.\d+)?)/i);
    if (matchMarker) {
      var latM = parseFloat(matchMarker[1]), lngM = parseFloat(matchMarker[2]);
      if (!isNaN(latM) && !isNaN(lngM) && Math.abs(latM) <= 90 && Math.abs(lngM) <= 180) {
        return { lat: latM, lng: lngM };
      }
    }

    // Check og:url or canonical url in HTML
    var matchOgUrl = htmlText.match(/<meta[^>]*?property="og:url"[^>]*?content="([^"]+)"/i) ||
                     htmlText.match(/<meta[^>]*?content="([^"]+)"[^>]*?property="og:url"/i) ||
                     htmlText.match(/<link[^>]*?rel="canonical"[^>]*?href="([^"]+)"/i);
    if (matchOgUrl) {
      var matchUrlPin = extractLatLngRegex(matchOgUrl[1]);
      if (matchUrlPin) return matchUrlPin;
    }

    // Fallback: extract from html content text
    var matchContent = extractLatLngRegex(htmlText);
    if (matchContent) return matchContent;
  } catch(e3) {}

  return null;
}

function getFoodLocations() {
  try {
    var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Locations');
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    var locations = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[0] || !r[1]) continue;

      var lat = parseFloat(r[2]);
      var lng = parseFloat(r[3]);
      var mapUrl = r[9];
      var imgUrl = r[10] ? String(r[10]).trim() : '';

      // Auto purge oversized legacy base64 strings (> 48000 chars) from Google Sheet cells
      if (imgUrl.length > 48000) {
        imgUrl = '';
        sheet.getRange(i + 1, 11).setValue(''); // Clean cell immediately in sheet!
      }

      // Auto fix row coordinates if missing or unparsed
      if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && mapUrl) {
        var resolved = resolveLatLngFromMapUrl(mapUrl);
        if (resolved) {
          lat = resolved.lat;
          lng = resolved.lng;
          sheet.getRange(i + 1, 3).setValue(lat);
          sheet.getRange(i + 1, 4).setValue(lng);
        }
      }

      var rawB = String(r[4] || '').toLowerCase().trim();
      var badge = 'spot';
      if(rawB==='3' || rawB==='heritage') badge = 'heritage';
      else if(rawB==='2' || rawB==='approved') badge = 'approved';
      else if(rawB==='pending') badge = 'pending';

      locations.push({
        id: r[0],
        name: r[1],
        lat: lat || 16.0544,
        lng: lng || 108.2022,
        badge_type: badge,
        category: r[5],
        must_try: r[6],
        price_range: r[7],
        video_url: r[8],
        map_url: mapUrl,
        image_url: imgUrl,
        opening_hours: r[11] || '',
        description: r[12] || '',
        type: r[13] || '',
        phone: r[14] || '',
        address: r[15] || '',
        shopeefood_link: r[16] || '',
        grab_link: r[17] || '',
        parking_info: r[18] || '',
        payment_methods: r[19] || '',
        day_off: r[20] || ''
      });
    }
    return locations;
  } catch (e) {
    return [];
  }
}

function addLocation(row) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Locations');
  if (!sheet) {
    sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").insertSheet('Locations');
    sheet.appendRow(['id','name','lat','lng','badge_type','category','must_try','price_range','video_url','map_url','image_url','opening_hours','description','type','phone','address','shopeefood_link','grab_link','parking_info','payment_methods','day_off']);
  }

  var lat = parseFloat(row[2]);
  var lng = parseFloat(row[3]);
  var mapUrl = row[9];

  if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && mapUrl) {
    var coords = resolveLatLngFromMapUrl(mapUrl);
    if (coords) {
      row[2] = coords.lat;
      row[3] = coords.lng;
    }
  }

  // Safety check: allow compact base64 (< 45000 chars) and URLs, prevent oversized strings > 48000 chars
  for (var k = 0; k < row.length; k++) {
    if (typeof row[k] === 'string' && row[k].length > 48000) {
      row[k] = '';
    }
  }

  sheet.appendRow(row);
  return { success: true, lat: row[2], lng: row[3] };
}

function updateLocation(id, row) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Locations');
  if (!sheet) return { success: false, error: 'No sheet' };
  var data = sheet.getDataRange().getValues();

  var lat = parseFloat(row[2]);
  var lng = parseFloat(row[3]);
  var mapUrl = row[9];

  if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && mapUrl) {
    var coords = resolveLatLngFromMapUrl(mapUrl);
    if (coords) {
      row[2] = coords.lat;
      row[3] = coords.lng;
    }
  }

  // Safety check: allow compact base64 (< 45000 chars) and URLs, prevent oversized strings > 48000 chars
  for (var k = 0; k < row.length; k++) {
    if (typeof row[k] === 'string' && row[k].length > 48000) {
      row[k] = '';
    }
  }

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return { success: true };
    }
  }
  return { success: false, error: 'ID not found' };
}

function deleteLocation(id) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Locations');
  if (!sheet) return { success: false, error: 'No sheet' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'ID not found' };
}

function saveSuggestion(data) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Suggestions');
  if (!sheet) {
    sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").insertSheet('Suggestions');
    sheet.appendRow(['timestamp','place_name','address','lat','lng','category','must_try_notes','image_url']);
  }
  sheet.appendRow([new Date(), data.name, data.address, data.lat, data.lng, data.category, data.notes, data.image || '']);
  return { success: true };
}

function getSuggestions() {
  try {
    var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Suggestions');
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[1]) continue;
      list.push({
        timestamp: r[0],
        place_name: r[1],
        address: r[2],
        lat: r[3],
        lng: r[4],
        category: r[5],
        must_try_notes: r[6]
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

// ── AI CHATBOT ENGINE ──
function setGeminiAPIKey(apiKey) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('GEMINI_API_KEY', apiKey);
  return { success: true, message: 'API Key saved securely!' };
}

var GEMINI_MODEL = 'gemini-3.1-flash-lite';
var GLOBAL_DAILY_LIMIT = 700;
var USER_DAILY_LIMIT = 20;

function checkAndConsumeQuota() {
  var props = PropertiesService.getScriptProperties();
  var tz = Session.getScriptTimeZone();
  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var key = 'quota_' + today;

  var raw = props.getProperty(key);
  var data = raw ? JSON.parse(raw) : { total: 0, users: {} };

  if (data.total >= GLOBAL_DAILY_LIMIT) return false;

  var userKey = Session.getTemporaryActiveUserKey() || 'anon';
  var userCount = data.users[userKey] || 0;
  if (userCount >= USER_DAILY_LIMIT) return false;

  data.total += 1;
  data.users[userKey] = userCount + 1;
  props.setProperty(key, JSON.stringify(data));

  var yesterday = Utilities.formatDate(new Date(new Date().getTime() - 86400000), tz, 'yyyy-MM-dd');
  props.deleteProperty('quota_' + yesterday);

  return true;
}

function findNearestLocation(locs, lat, lng) {
  var uLat = parseFloat(lat), uLng = parseFloat(lng);
  if (!locs || !locs.length || isNaN(uLat) || isNaN(uLng)) return null;

  var nearest = null, minDist = Infinity;
  for (var i = 0; i < locs.length; i++) {
    var l = locs[i];
    var lLat = parseFloat(l.lat), lLng = parseFloat(l.lng);
    if (isNaN(lLat) || isNaN(lLng)) continue;
    var dLat = lLat - uLat, dLng = lLng - uLng;
    var dist = dLat * dLat + dLng * dLng;
    if (dist < minDist) { minDist = dist; nearest = l; }
  }
  return nearest;
}

function askGeminiAI(userQuery, userLat, userLng, activeTab) {
  try {
    if (!checkAndConsumeQuota()) {
      var qLocs = getFoodLocations();
      var qSpot = findNearestLocation(qLocs, userLat, userLng) || qLocs[Math.floor(Math.random() * qLocs.length)];
      if (!qSpot) qSpot = { name: "Quán ngon", must_try: "món đặc sản địa phương" };
      return {
        success: true,
        isFallback: true,
        isQuotaLimited: true,
        reply: "Tớ hơi quá tải hôm nay rồi 😅! Bạn ghé thử " + qSpot.name + " - " + qSpot.must_try + " gần bạn nhé, mai tớ khoẻ lại liền!"
      };
    }

    var props = PropertiesService.getScriptProperties();
    var apiKey = (props.getProperty('GEMINI_API_KEY') || '').trim();
    var locs = getFoodLocations();

    if (!apiKey) {
      throw new Error('No API Key');
    }

    var contextData = locs.map(function(l) {
      return "[" + l.name + "] (" + l.category + ") - Món khuyên thử: " + l.must_try + " (Lat: " + l.lat + ", Lng: " + l.lng + ")";
    }).join("\n");

    var systemInstruction = "You are 'Thao Thức AI' 🤖 — a friendly, witty Vietnamese culinary guide for Thao Thức Guide. Address yourself as 'tớ' and user as 'bạn'. Keep replies under 3 concise sentences. Here is the list of verified locations you can recommend:\n\n" + contextData;

    var url = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent";

    var payload = {
      "systemInstruction": {
        "parts": [{ "text": systemInstruction }]
      },
      "contents": [{
        "role": "user",
        "parts": [{
          "text": "User asks: " + userQuery + (userLat ? " (User Location: " + userLat + ", " + userLng + ")" : "")
        }]
      }],
      "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 256
      }
    };

    var options = {
      "method": "post",
      "contentType": "application/json",
      "headers": {
        "x-goog-api-key": apiKey
      },
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    var response = UrlFetchApp.fetch(url, options);
    var statusCode = response.getResponseCode();
    var jsonText = response.getContentText();

    Logger.log('Gemini statusCode: ' + statusCode);
    Logger.log('Gemini raw response: ' + jsonText);

    if (statusCode !== 200) {
      throw new Error('GeminiHTTPError (' + statusCode + '): ' + jsonText);
    }

    var json = JSON.parse(jsonText);

    if (json.error) {
      throw new Error("GeminiAPIError: " + JSON.stringify(json.error));
    }

    if (!json.candidates || json.candidates.length === 0) {
      throw new Error('EmptyCandidates: ' + jsonText);
    }

    var candidate = json.candidates[0];
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      throw new Error('NoTextInCandidate: ' + JSON.stringify(candidate));
    }

    var textReply = candidate.content.parts[0].text;
    return { success: true, reply: textReply };

  } catch (e) {
    Logger.log('Lỗi askGeminiAI: ' + e.message);

    var fallbackLocs = getFoodLocations();
    var randomSpot = findNearestLocation(fallbackLocs, userLat, userLng) || fallbackLocs[Math.floor(Math.random() * fallbackLocs.length)];
    if (!randomSpot) randomSpot = { name: "Quán ngon", must_try: "món đặc sản địa phương" };

    var fallbackMsg = "Tớ đang bị quá tải nhẹ một xíu 🤖! (LỖI: " + e.message + ") Nhưng tớ bật mí ngay cho bạn quán ngon gần bạn nè: " + randomSpot.name + " - " + randomSpot.must_try + ". Bạn ghé thử nhé!";

    return { success: true, reply: fallbackMsg, isFallback: true };
  }
}

function testAskGeminiAI() {
  var result = askGeminiAI('Gợi ý quán bún gần đây', 16.0544, 108.2022, null);
  Logger.log(JSON.stringify(result));
}

function checkAvailableModels() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  var url = "https://generativelanguage.googleapis.com/v1beta/models";
  var response = UrlFetchApp.fetch(url, {
    headers: { 'x-goog-api-key': apiKey },
    muteHttpExceptions: true
  });
  Logger.log(response.getContentText());
}

function runOnceToSetAPIKey() {
  var myKey = "DÁN_API_KEY_CỦA_BẠN_VÀO_ĐÂY";
  setGeminiAPIKey(myKey);
}

function getScriptUrlLive() {
  return ScriptApp.getService().getUrl();
}

function getRecipes() {
  try {
    var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
    if (!sheet) {
      sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").insertSheet('Recipes');
      sheet.appendRow(['id', 'name', 'category', 'time', 'level', 'image_url', 'video_url', 'ingredients_json', 'steps_json', 'default_servings', 'search_cat']);
      
      sheet.appendRow([
        'rcp_' + new Date().getTime(),
        'Bún Bò Huế Chuẩn Vị',
        'Món Nước / Bún Phở',
        '45 phút',
        'Dễ nấu',
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
        'https://www.tiktok.com/@chongcookvolook',
        JSON.stringify(['500g bắp bò / giò heo', '1kg bún tươi sợi to', '3 củ sả đập dập', '2 muỗng canh mắm ruốc Huế', '1.5 lít nước dùng', 'Hành tây, rau thơm, bắp chuối']),
        JSON.stringify(['Bước 1: Hầm bắp bò và giò heo với sả đập dập trong 30 phút.', 'Bước 2: Hòa tan mắm ruốc Huế với nước lạnh, lọc lấy nước trong cho vào nồi.', 'Bước 3: Phi thơm ớt sa tế, nêm nếm gia vị vừa ăn. Trụng bún, xếp thịt, chan nước dùng nóng hổi.']),
        4,
        'Bún / Phở / Món Nước'
      ]);
    }

    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[0]) continue;
      
      var ings = [];
      var steps = [];
      try { ings = JSON.parse(r[7] || '[]'); } catch(e) { ings = []; }
      try { steps = JSON.parse(r[8] || '[]'); } catch(e) { steps = []; }
      
      list.push({
        id: String(r[0]),
        name: String(r[1]),
        category: String(r[2]),
        time: String(r[3]),
        level: String(r[4]),
        image: String(r[5]),
        video_url: String(r[6]),
        ingredients: ings,
        steps: steps,
        default_servings: parseFloat(r[9]) || 4,
        searchCat: String(r[10])
      });
    }
    return list;
  } catch(e) {
    return [];
  }
}

function addRecipe(data) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'No sheet Recipes' };
  
  var newId = 'rcp_' + new Date().getTime();
  sheet.appendRow([
    newId,
    data.name,
    data.category,
    data.time,
    data.level,
    data.image,
    data.video_url,
    JSON.stringify(data.ingredients || []),
    JSON.stringify(data.steps || []),
    data.default_servings || 4,
    data.searchCat || ''
  ]);
  return { success: true, id: newId };
}

function updateRecipe(id, data) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'No sheet' };
  
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 2, 1, 10).setValues([[
        data.name,
        data.category,
        data.time,
        data.level,
        data.image,
        data.video_url,
        JSON.stringify(data.ingredients || []),
        JSON.stringify(data.steps || []),
        data.default_servings || 4,
        data.searchCat || ''
      ]]);
      return { success: true };
    }
  }
  return { success: false, error: 'Recipe ID not found' };
}

function deleteRecipe(id) {
  var sheet = SpreadsheetApp.openById("1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg").getSheetByName('Recipes');
  if (!sheet) return { success: false, error: 'No sheet' };
  
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Recipe ID not found' };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
