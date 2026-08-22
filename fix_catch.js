const fs = require('fs');
let code = fs.readFileSync('Code.gs', 'utf8');
code = code.replace("  } catch (e) {\n    return [];\n  }", "  } catch (e) {\n    return [{id: 'err', name: 'Lỗi Backend: ' + e.message, lat: 16.05, lng: 108.2, badge_type: 'spot', category: 'Lỗi', must_try: 'Lỗi'}];\n  }");
fs.writeFileSync('Code.gs', code, 'utf8');
console.log('Patched Code.gs error handler!');
