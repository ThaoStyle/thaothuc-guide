const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/1AhW1i8IetVRIGSr8iVHPxuF31ZZc3hQtb88yzV0aQjg/htmlview', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const matches = data.match(/<li[^>]*id="sheet-button-\d+"[^>]*>.*?<\/li>/gi);
    if (matches) {
      matches.forEach(m => console.log(m.replace(/<[^>]+>/g, '')));
    } else {
      console.log('No tabs found or sheet is private.');
    }
  });
}).on('error', console.error);
