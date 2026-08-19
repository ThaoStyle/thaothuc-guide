const fs = require('fs');

function fixActiveState(filePath) {
    let js = fs.readFileSync(filePath, 'utf8');

    js = js.replace(
        `document.querySelectorAll('.pill').forEach(function(b){b.classList.remove('active');});`,
        `document.querySelectorAll('.pill, .s-filter-btn').forEach(function(b){b.classList.remove('active');});`
    );

    fs.writeFileSync(filePath, js, 'utf8');
}

fixActiveState('frontend/src/main.js');
fixActiveState('Index.html');
console.log('Fixed pill active clear');
