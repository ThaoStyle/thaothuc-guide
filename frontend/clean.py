import codecs
with codecs.open('src/main.js', 'r', 'utf-8') as f:
    js = f.read()

# 4a.
start_str = '// ── DEDICATED ADMIN TAB CONTROLLER'
start_idx = js.find(start_str)
if start_idx != -1:
    end_str = 'function doAdminAdd()'
    end_idx = js.find(end_str, start_idx)
    # find the end of doAdminAdd
    next_func_idx = js.find('\n//', end_idx) # next section usually starts with //
    if next_func_idx == -1: next_func_idx = js.find('\nfunction', end_idx+100)
    
    js = js[:start_idx] + js[next_func_idx:]

# 4b.
js = js.replace('checkAdminAuth();', '')

# 4c.
js = js.replace("if(document.getElementById('page-admin').classList.contains('show')){\n    renderAdminLocList();\n  }", "")
js = js.replace("if(document.getElementById('page-admin').classList.contains('show')){\r\n    renderAdminLocList();\r\n  }", "")
# If one liner
import re
js = re.sub(r"if\(document\.getElementById\('page-admin'\)\.classList\.contains\('show'\)\)\{\s*renderAdminLocList\(\);\s*\}", "", js)

# 4d.
js = js.replace("['home','map','cook','admin'].forEach", "['home','map','cook'].forEach")
js = re.sub(r"if\(tab==='admin'\)\s*renderAdminTab\(\);", "", js)
js = re.sub(r"if\(tab==='admin'\)\{\s*aiFab\.style\.opacity='0';\s*aiFab\.style\.pointerEvents='none';\s*aiFab\.style\.zIndex='-1';\s*\}\s*else\{\s*(aiFab\.style\.opacity='';[^}]+)\}", r"\1", js)

# 4e.
js = js.replace("['a-cat','edit-cat','s-cat'].forEach", "['s-cat'].forEach")

# 4f.
js = re.sub(r"\['ar-cat','er-cat'\]\.forEach\([\s\S]*?\}\);", "", js)
js = re.sub(r"var\s*adminRcpPills\s*=\s*document\.getElementById\('admin-rcp-filter-pills'\);[\s\S]*?adminRcpPills\.innerHTML\s*=\s*h;", "", js)

# 4g.
js = js.replace("['page-home','page-cook','page-admin'].forEach", "['page-home','page-cook'].forEach")

# 4h.
js = re.sub(r"\s*'addLocation':\s*\{[^\}]*\},", "", js)
js = re.sub(r"\s*'updateLocation':\s*\{[^\}]*\},", "", js)
js = re.sub(r"\s*'deleteLocation':\s*\{[^\}]*\},", "", js)
js = re.sub(r"\s*'setGeminiAPIKey':\s*\{[^\}]*\},", "", js)
js = re.sub(r"\s*'getAdminStatus':\s*\{[^\}]*\},", "", js)

js = re.sub(r"if\s*\(gasMethodName\s*===\s*'addLocation'\)\s*\{[\s\S]*?\}\s*else\s*if\s*\(gasMethodName\s*===\s*'updateLocation'\)\s*\{[\s\S]*?\}\s*else\s*if\s*\(gasMethodName\s*===\s*'deleteLocation'\)\s*\{[\s\S]*?\}\s*else\s*if\s*\(gasMethodName\s*===\s*'setGeminiAPIKey'\)\s*\{[\s\S]*?\}\s*else\s*if\s*\(gasMethodName\s*===\s*'saveSuggestion'\)", "if (gasMethodName === 'saveSuggestion')", js)

# 4i.
win_vars = [
    'changeAdminLocPage', 'changeAdminRcpPage', 'deleteAdminLoc', 'deleteRecipeItem',
    'doAdminAdd', 'doAdminAddRecipe', 'doAdminUpdateRecipe', 'openAdminEdit',
    'openAdminEditRecipe', 'openAdminModal', 'saveAdminEdit', 'setAdminLocFilter',
    'setAdminRcpFilter', 'switchAdminSec'
]
for v in win_vars:
    js = re.sub(r"window\." + v + r"\s*=\s*" + v + r";\s*", "", js)

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(js)
print('cleaned')
