const fs=require('fs'); const html=fs.readFileSync('Index.html','utf8'); const start=html.indexOf('id="page-admin"'); console.log(html.substring(start+3000, start + 6000));
