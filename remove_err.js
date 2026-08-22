const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// The exact script I injected was:
const errHandler = `
<script>
  window.addEventListener('error', function(e) {
    var admin = document.getElementById('page-admin');
    if(admin) {
      var errDiv = document.createElement('div');
      errDiv.style.cssText = 'position:fixed; top:0; left:0; right:0; background:red; color:white; z-index:999999999; padding:20px; font-size:20px;';
      errDiv.innerText = 'JS ERROR: ' + e.message + ' at ' + e.filename + ':' + e.lineno;
      document.body.appendChild(errDiv);
    }
  });
  
  // also wrap onData body with try-catch
  var originalOnData;
  window.addEventListener('DOMContentLoaded', function() {
    if(typeof onData === 'function') {
      originalOnData = onData;
      onData = function(d) {
        try {
          originalOnData(d);
        } catch(e) {
          var errDiv = document.createElement('div');
          errDiv.style.cssText = 'position:fixed; top:50px; left:0; right:0; background:orange; color:black; z-index:999999999; padding:20px; font-size:20px;';
          errDiv.innerText = 'ONDATA ERROR: ' + e.message + '\\n' + e.stack;
          document.body.appendChild(errDiv);
        }
      };
    }
  });
</script>
`;

html = html.replace(errHandler + '\n</head>', '</head>');
html = html.replace(errHandler, '');
// Just in case it was somewhat modified
html = html.replace(/<script>\s*window\.addEventListener\('error'[\s\S]*?<\/script>\s*/, '');
fs.writeFileSync('Index.html', html, 'utf8');
console.log('Removed global error handler!');
