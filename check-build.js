const fs = require('fs');
let html = fs.readFileSync('Index.html', 'utf8');

// The best way is to overwrite Index.html by combining frontend/index.html, frontend/src/style.css, and frontend/src/main.js !
// WAIT! Does Index.html exactly equal to those three combined?
// Let's check how the user builds Index.html.
