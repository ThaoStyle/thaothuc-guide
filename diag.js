const fs = require('fs');
const html = fs.readFileSync('Index.html', 'utf8');
const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (scriptMatches) {
  scriptMatches.forEach((s, idx) => {
    const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    try {
      new Function(code);
    } catch(e) {
      console.log('Script ' + idx + ' Syntax Error:', e.message);
      const lines = code.split('\n');
      for (let j=0; j<lines.length; j++) {
        try { 
          new Function(lines.slice(0, j+1).join('\n')); 
        } catch(err) {
          if (err.message.includes('Unexpected identifier')) {
            console.log('Line ' + (j+1) + ': ' + lines[j]);
            console.log('Context:\n' + lines.slice(Math.max(0, j-2), j+3).join('\n'));
            break;
          }
        }
      }
    }
  });
}
