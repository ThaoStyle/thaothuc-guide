const fs = require('fs');
const pkgPath = 'package.json';
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.devDependencies = pkg.devDependencies || {};
pkg.devDependencies['@playwright/test'] = '^1.40.0';

pkg.scripts = pkg.scripts || {};
pkg.scripts['test:e2e'] = 'playwright test';
pkg.scripts['test:ui'] = 'playwright test --ui';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('Updated package.json');

