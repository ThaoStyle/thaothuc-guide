const fs = require('fs');

// 1. UPDATE index.html
let html = fs.readFileSync('index.html', 'utf8');

// The original tag probably looks like:
// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, viewport-fit=cover"/>
// or something similar. Let's use a regex to replace maximum-scale=3.0 with maximum-scale=1.0, user-scalable=no
const viewportRegex = /<meta\s+name=["']viewport["']\s+content=["']([^"']*)["']\s*\/?>/i;

const match = html.match(viewportRegex);
if (match) {
  let content = match[1];
  // Remove existing maximum-scale and user-scalable
  content = content.replace(/,\s*maximum-scale=[0-9.]+/i, '');
  content = content.replace(/,\s*user-scalable=(yes|no)/i, '');
  
  // Append new rules
  content += ', maximum-scale=1.0, user-scalable=no';
  
  const newTag = `<meta name="viewport" content="${content}"/>`;
  html = html.replace(viewportRegex, newTag);
  
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('index.html viewport updated');
} else {
  console.log('Viewport meta tag not found');
}

// 2. UPDATE style.css
let css = fs.readFileSync('src/style.css', 'utf8');
if (!css.includes('touch-action: manipulation')) {
  css = `html, body { touch-action: manipulation; }\n` + css;
  fs.writeFileSync('src/style.css', css, 'utf8');
  console.log('style.css updated with touch-action');
} else {
  console.log('style.css already has touch-action');
}
