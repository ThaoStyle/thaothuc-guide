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
  var s = String(str);
  
  // 1. Match !3d<lat>!4d<lng> (Exact Google Maps place pin marker coordinate!)
  var mPin = s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (mPin) {
    return { lat: parseFloat(mPin[1]), lng: parseFloat(mPin[2]) };
  }

  // 2. Match @lat,lng, e.g. @21.0155114,105.5166529
  var mAt = s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (mAt) {
    return { lat: parseFloat(mAt[1]), lng: parseFloat(mAt[2]) };
  }

  // 3. Match q=lat,lng or ll=lat,lng or center=lat,lng
  var mQ = s.match(/(?:[?&](?:q|ll|query|center)=|maps\?q=)(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
  if (mQ) {
    return { lat: parseFloat(mQ[1]), lng: parseFloat(mQ[2]) };
  }

  return null;
}

function resolveLatLngFromMapUrl(mapUrl) {
  if (!mapUrl) return null;
  var url = String(mapUrl).trim();

  // Try direct regex on original URL
  var directMatch = extractLatLngRegex(url);
  if (directMatch) return directMatch;

  // Strategy 1: Don't follow redirects — capture the 302 Location header
  try {
    var resp1 = UrlFetchApp.fetch(url, {
      followRedirects: false,
      muteHttpExceptions: true
    });
    var loc = resp1.getHeaders()['Location'] || resp1.getHeaders()['location'];
    if (loc) {
      var m1 = extractLatLngRegex(loc);
      if (m1) return m1;
      // Location may itself be a redirect — follow it
      try {
        var resp2 = UrlFetchApp.fetch(loc, {
          followRedirects: false,
          muteHttpExceptions: true
        });
        var loc2 = resp2.getHeaders()['Location'] || resp2.getHeaders()['location'];
        if (loc2) {
          var m2 = extractLatLngRegex(loc2);
          if (m2) return m2;
        }
      } catch(e2) {}
    }
  } catch(e1) {}

  // Strategy 2: Follow all redirects, parse final content body
  try {
    var resp3 = UrlFetchApp.fetch(url, {
      followRedirects: true,
      muteHttpExceptions: true
    });
    var contentText = resp3.getContentText();
    var matchContent = extractLatLngRegex(contentText);
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

      locations.push({
        id: r[0],
        name: r[1],
        lat: lat || 16.0544,
        lng: lng || 108.2022,
        rating_stars: r[4],
        category: r[5],
        must_try: r[6],
        price_range: r[7],
        video_url: r[8],
        map_url: mapUrl,
        image_url: r[10],
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
    sheet.appendRow(['id','name','lat','lng','rating_stars','category','must_try','price_range','video_url','map_url','image_url','opening_hours','description']);
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
    sheet.appendRow(['timestamp','place_name','address','lat','lng','category','must_try_notes']);
  }
  sheet.appendRow([new Date(), data.name, data.address, data.lat, data.lng, data.category, data.notes]);
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
