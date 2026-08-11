function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Thao Thức Guide – Cẩm Nang Ẩm Thực & Lifestyle')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=3.0, viewport-fit=cover');
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
        description: r[12] || ''
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
    sheet.appendRow(['id','name','lat','lng','badge_type','category','must_try','price_range','video_url','map_url','image_url','opening_hours','description']);
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
