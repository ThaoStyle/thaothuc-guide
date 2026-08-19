// ═══════════════════════════════════════════════════════════════════
//  THAO THỨC GUIDE — BACKEND API (Version 2 — REST JSON API)
//  File này là BACKEND MỚI, độc lập với dự án cũ.
//  Sau khi deploy GAS mới, trả link Web App URL cho AI để cấu hình Frontend.
//
//  ⚠️ QUAN TRỌNG: Thay SHEET_ID bên dưới bằng ID Google Sheets của bạn.
//     (Lấy từ URL Sheets: https://docs.google.com/spreadsheets/d/<<SHEET_ID>>/edit)
// ═══════════════════════════════════════════════════════════════════

var SHEET_ID = "1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg";

// ────────────────────────────────────────────────────────────────────
// CORS Helper — cho phép Frontend Vercel gọi API này
// ────────────────────────────────────────────────────────────────────
function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────
// ROUTER — doGet & doPost
// ────────────────────────────────────────────────────────────────────
function doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : '';

  if (action === 'getLocations')   return jsonOut(getFoodLocations());
  if (action === 'getRecipes')     return jsonOut(getRecipes());
  if (action === 'getSuggestions') return jsonOut(getSuggestions());
  if (action === 'getAdminStatus') return jsonOut(getAdminStatus());

  // Health check
  return jsonOut({ status: 'ok', version: '2.0', message: 'Thao Thức Guide API is running.' });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';

    if (action === 'addLocation')    return jsonOut(addLocation(body.row));
    if (action === 'updateLocation') return jsonOut(updateLocation(body.id, body.row));
    if (action === 'deleteLocation') return jsonOut(deleteLocation(body.id));
    if (action === 'saveSuggestion') return jsonOut(saveSuggestion(body.data));
    if (action === 'askAI')          return jsonOut(askGeminiAI(body.query, body.lat, body.lng, body.tab));
    if (action === 'setApiKey')      return jsonOut(setGeminiAPIKey(body.key));

    return jsonOut({ success: false, error: 'Unknown action: ' + action });
  } catch(err) {
    return jsonOut({ success: false, error: err.message });
  }
}

// ────────────────────────────────────────────────────────────────────
// ADMIN AUTH
// ────────────────────────────────────────────────────────────────────
function getAdminStatus() {
  try {
    var email = Session.getActiveUser().getEmail();
    var ownerEmail = SpreadsheetApp.openById(SHEET_ID).getOwner().getEmail();
    return {
      email: email,
      isAdmin: (email.toLowerCase() === ownerEmail.toLowerCase())
    };
  } catch(e) {
    return { email: "", isAdmin: false };
  }
}

// ────────────────────────────────────────────────────────────────────
// GOOGLE MAPS URL PARSER — Trích xuất tọa độ từ link Google Maps
// ────────────────────────────────────────────────────────────────────
function extractLatLngRegex(str) {
  if (!str) return null;
  var s = String(str).trim();

  var mPin = s.match(/!3d(-?\d+(?:\.\d+)?)(?:![^!]+)*?!4d(-?\d+(?:\.\d+)?)/);
  if (mPin) { var latP = parseFloat(mPin[1]), lngP = parseFloat(mPin[2]); if (!isNaN(latP) && !isNaN(lngP) && Math.abs(latP) <= 90 && Math.abs(lngP) <= 180) return { lat: latP, lng: lngP }; }

  var mMarker = s.match(/staticmap\?[^"]*?markers=(-?\d+(?:\.\d+)?)(?:%2C|,|\+)+(-?\d+(?:\.\d+)?)/i);
  if (mMarker) { var latM = parseFloat(mMarker[1]), lngM = parseFloat(mMarker[2]); if (!isNaN(latM) && !isNaN(lngM) && Math.abs(latM) <= 90 && Math.abs(lngM) <= 180) return { lat: latM, lng: lngM }; }

  var mQ = s.match(/(?:[?&](?:q|ll|query|center)=|maps\?q=)(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i);
  if (mQ) { var latQ = parseFloat(mQ[1]), lngQ = parseFloat(mQ[2]); if (!isNaN(latQ) && !isNaN(lngQ) && Math.abs(latQ) <= 90 && Math.abs(lngQ) <= 180) return { lat: latQ, lng: lngQ }; }

  var mPath = s.match(/\/(?:place|search|dir)\/[^\/]*?\/(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i) ||
              s.match(/\/(?:search|place|dir)\/(-?\d+(?:\.\d+)?)(?:,|%2C|\+)+(-?\d+(?:\.\d+)?)/i);
  if (mPath) { var latPt = parseFloat(mPath[1]), lngPt = parseFloat(mPath[2]); if (!isNaN(latPt) && !isNaN(lngPt) && Math.abs(latPt) <= 90 && Math.abs(lngPt) <= 180) return { lat: latPt, lng: lngPt }; }

  var mAt = s.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (mAt) { var latAt = parseFloat(mAt[1]), lngAt = parseFloat(mAt[2]); if (!isNaN(latAt) && !isNaN(lngAt) && Math.abs(latAt) <= 90 && Math.abs(lngAt) <= 180) return { lat: latAt, lng: lngAt }; }

  return null;
}

function resolveLatLngFromMapUrl(mapUrl) {
  if (!mapUrl) return null;
  var url = String(mapUrl).trim();
  var directMatch = extractLatLngRegex(url);
  if (directMatch) return directMatch;

  var currentUrl = url;
  for (var hop = 0; hop < 3; hop++) {
    try {
      var resp = UrlFetchApp.fetch(currentUrl, { followRedirects: false, muteHttpExceptions: true });
      var loc = resp.getHeaders()['Location'] || resp.getHeaders()['location'];
      if (loc) { var ml = extractLatLngRegex(loc); if (ml) return ml; currentUrl = loc; } else break;
    } catch(e1) { break; }
  }

  try {
    var resp3 = UrlFetchApp.fetch(url, { followRedirects: true, muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } });
    var html = resp3.getContentText();
    var mMkr = html.match(/staticmap\?[^"]*?markers=(-?\d+(?:\.\d+)?)(?:%2C|,|\+)+(-?\d+(?:\.\d+)?)/i);
    if (mMkr) { var latH = parseFloat(mMkr[1]), lngH = parseFloat(mMkr[2]); if (!isNaN(latH) && !isNaN(lngH)) return { lat: latH, lng: lngH }; }
    var matchContent = extractLatLngRegex(html);
    if (matchContent) return matchContent;
  } catch(e3) {}

  return null;
}

// ────────────────────────────────────────────────────────────────────
// LOCATIONS CRUD
// ────────────────────────────────────────────────────────────────────
function getFoodLocations() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Locations');
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    var locations = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[0] || !r[1]) continue;
      var lat = parseFloat(r[2]), lng = parseFloat(r[3]);
      var mapUrl = r[9];
      var imgUrl = r[10] ? String(r[10]).trim() : '';
      if (imgUrl.length > 48000) { imgUrl = ''; sheet.getRange(i + 1, 11).setValue(''); }
      if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && mapUrl) {
        var resolved = resolveLatLngFromMapUrl(mapUrl);
        if (resolved) { lat = resolved.lat; lng = resolved.lng; sheet.getRange(i + 1, 3).setValue(lat); sheet.getRange(i + 1, 4).setValue(lng); }
      }
      var rawB = String(r[4] || '').toLowerCase().trim();
      var badge = 'spot';
      if (rawB==='3'||rawB==='heritage') badge='heritage';
      else if (rawB==='2'||rawB==='approved') badge='approved';
      else if (rawB==='pending') badge='pending';

      locations.push({
        id: r[0], name: r[1], lat: lat || 16.0544, lng: lng || 108.2022,
        badge_type: badge, category: r[5], must_try: r[6], price_range: r[7],
        video_url: r[8], map_url: mapUrl, image_url: imgUrl,
        opening_hours: r[11] || '', description: r[12] || '', type: r[13] || '',
        phone: r[14] || '', address: r[15] || '', shopeefood_link: r[16] || '',
        grab_link: r[17] || '', parking_info: r[18] || '',
        payment_methods: r[19] || '', day_off: r[20] || ''
      });
    }
    return locations;
  } catch (e) { return []; }
}

function addLocation(row) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Locations');
  if (!sheet) return { success: false, error: 'Sheet Locations not found' };
  var lat = parseFloat(row[2]), lng = parseFloat(row[3]);
  if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && row[9]) {
    var coords = resolveLatLngFromMapUrl(row[9]);
    if (coords) { row[2] = coords.lat; row[3] = coords.lng; }
  }
  for (var k = 0; k < row.length; k++) { if (typeof row[k] === 'string' && row[k].length > 48000) row[k] = ''; }
  sheet.appendRow(row);
  return { success: true, lat: row[2], lng: row[3] };
}

function updateLocation(id, row) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Locations');
  if (!sheet) return { success: false, error: 'No sheet' };
  var data = sheet.getDataRange().getValues();
  var lat = parseFloat(row[2]), lng = parseFloat(row[3]);
  if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && row[9]) {
    var coords = resolveLatLngFromMapUrl(row[9]);
    if (coords) { row[2] = coords.lat; row[3] = coords.lng; }
  }
  for (var k = 0; k < row.length; k++) { if (typeof row[k] === 'string' && row[k].length > 48000) row[k] = ''; }
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return { success: true };
    }
  }
  return { success: false, error: 'ID not found' };
}

function deleteLocation(id) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Locations');
  if (!sheet) return { success: false, error: 'No sheet' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) { sheet.deleteRow(i + 1); return { success: true }; }
  }
  return { success: false, error: 'ID not found' };
}

// ────────────────────────────────────────────────────────────────────
// RECIPES
// ────────────────────────────────────────────────────────────────────
function getRecipes() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Recipes');
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    var recipes = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[0] || !r[1]) continue;
      recipes.push({
        id: r[0], name: r[1], category: r[2] || '', time: r[3] || '',
        level: r[4] || '', serving: r[5] || '', image: r[6] || '',
        ingredients: r[7] || '', steps: r[8] || '', video_url: r[9] || '',
        tips: r[10] || ''
      });
    }
    return recipes;
  } catch(e) { return []; }
}

// ────────────────────────────────────────────────────────────────────
// SUGGESTIONS
// ────────────────────────────────────────────────────────────────────
function saveSuggestion(data) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Suggestions');
  if (!sheet) { sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet('Suggestions'); sheet.appendRow(['timestamp','place_name','address','lat','lng','category','must_try_notes','image_url']); }
  sheet.appendRow([new Date(), data.name, data.address, data.lat, data.lng, data.category, data.notes, data.image || '']);
  return { success: true };
}

function getSuggestions() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Suggestions');
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!r[1]) continue;
      list.push({ timestamp: r[0], place_name: r[1], address: r[2], lat: r[3], lng: r[4], category: r[5], must_try_notes: r[6] });
    }
    return list;
  } catch (e) { return []; }
}

// ────────────────────────────────────────────────────────────────────
// AI CHATBOT — Gemini
// ────────────────────────────────────────────────────────────────────
var GEMINI_MODEL = 'gemini-3.1-flash-lite';
var GLOBAL_DAILY_LIMIT = 700;
var USER_DAILY_LIMIT = 20;

function setGeminiAPIKey(apiKey) {
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', apiKey);
  return { success: true, message: 'API Key saved!' };
}

function checkAndConsumeQuota() {
  var props = PropertiesService.getScriptProperties();
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var key = 'quota_' + today;
  var data = JSON.parse(props.getProperty(key) || '{"total":0,"users":{}}');
  if (data.total >= GLOBAL_DAILY_LIMIT) return false;
  var userKey = Session.getTemporaryActiveUserKey() || 'anon';
  if ((data.users[userKey] || 0) >= USER_DAILY_LIMIT) return false;
  data.total += 1; data.users[userKey] = (data.users[userKey] || 0) + 1;
  props.setProperty(key, JSON.stringify(data));
  var yesterday = Utilities.formatDate(new Date(new Date().getTime() - 86400000), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  props.deleteProperty('quota_' + yesterday);
  return true;
}

function findNearestLocation(locs, lat, lng) {
  var uLat = parseFloat(lat), uLng = parseFloat(lng);
  if (!locs || !locs.length || isNaN(uLat) || isNaN(uLng)) return null;
  var nearest = null, minDist = Infinity;
  for (var i = 0; i < locs.length; i++) {
    var l = locs[i], lLat = parseFloat(l.lat), lLng = parseFloat(l.lng);
    if (isNaN(lLat) || isNaN(lLng)) continue;
    var dist = (lLat - uLat) * (lLat - uLat) + (lLng - uLng) * (lLng - uLng);
    if (dist < minDist) { minDist = dist; nearest = l; }
  }
  return nearest;
}

function askGeminiAI(userQuery, userLat, userLng, activeTab) {
  try {
    if (!checkAndConsumeQuota()) {
      var qLocs = getFoodLocations();
      var qSpot = findNearestLocation(qLocs, userLat, userLng) || qLocs[Math.floor(Math.random() * qLocs.length)] || { name: "Quán ngon", must_try: "món đặc sản" };
      return { success: true, isFallback: true, isQuotaLimited: true, reply: "Tớ hơi quá tải hôm nay 😅! Bạn ghé thử " + qSpot.name + " - " + qSpot.must_try + " nhé!" };
    }
    var apiKey = (PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || '').trim();
    if (!apiKey) throw new Error('No API Key');
    var locs = getFoodLocations();
    var ctx = locs.map(function(l) { return "[" + l.name + "] (" + l.category + ") - " + l.must_try + " (Lat: " + l.lat + ", Lng: " + l.lng + ")"; }).join("\n");
    var sysInst = "You are 'Thao Thức AI' 🤖 — a friendly Vietnamese culinary guide. Address yourself as 'tớ' and user as 'bạn'. Keep replies under 3 sentences.\n\n" + ctx;
    var payload = {
      systemInstruction: { parts: [{ text: sysInst }] },
      contents: [{ role: "user", parts: [{ text: "User asks: " + userQuery + (userLat ? " (Location: " + userLat + ", " + userLng + ")" : "") }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 256 }
    };
    var response = UrlFetchApp.fetch("https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent", {
      method: "post", contentType: "application/json",
      headers: { "x-goog-api-key": apiKey },
      payload: JSON.stringify(payload), muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) throw new Error('HTTP ' + response.getResponseCode());
    var json = JSON.parse(response.getContentText());
    if (json.error) throw new Error(JSON.stringify(json.error));
    return { success: true, reply: json.candidates[0].content.parts[0].text };
  } catch (e) {
    var fb = getFoodLocations();
    var spot = findNearestLocation(fb, userLat, userLng) || fb[0] || { name: "Quán ngon", must_try: "món đặc sản" };
    return { success: true, reply: "Tớ đang bận xíu 🤖! Bạn ghé " + spot.name + " - " + spot.must_try + " thử nhé!", isFallback: true };
  }
}
