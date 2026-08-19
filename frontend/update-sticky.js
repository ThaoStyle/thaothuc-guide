const fs = require('fs');

let css = fs.readFileSync('src/style.css', 'utf8');

// Find the .cook-filter-bar rule
const regex = /\.cook-filter-bar\s*\{[^}]*\}/;
const match = css.match(regex);

if (match) {
  let rule = match[0];
  // Replace position: sticky; top: 0; z-index: 100;
  // With position: relative;
  rule = rule.replace(/position:\s*sticky;/i, 'position:relative;');
  rule = rule.replace(/top:\s*0;/i, '');
  rule = rule.replace(/z-index:\s*100;/i, ''); // We can remove z-index or keep it, doesn't matter much if not sticky/fixed

  css = css.replace(regex, rule);
  fs.writeFileSync('src/style.css', css, 'utf8');
  console.log('style.css updated for cook-filter-bar');
} else {
  console.log('CSS block not found');
}
