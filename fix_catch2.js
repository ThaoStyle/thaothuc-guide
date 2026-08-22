const fs = require('fs');
let code = fs.readFileSync('Code.gs', 'utf8');
code = code.replace("  } catch(e) {\n    return [];\n  }", "  } catch(e) {\n    return [{id: 'err', name: 'Lỗi Backend: ' + e.message, category: 'Lỗi', time: '0', level: 'Lỗi'}];\n  }");
fs.writeFileSync('Code.gs', code, 'utf8');
console.log('Patched getRecipes catch block!');
