const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir);
}

// 1. search.spec.js
const searchCode = `import { test, expect } from '@playwright/test';

test.describe('Search System', () => {
  test('Gõ tìm kiếm, hiển thị dropdown và xoá tìm kiếm', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 15000 });
    
    const input = page.locator('#map-search-input');
    await input.fill('bún');
    
    const dd = page.locator('#map-search-dropdown');
    await expect(dd).toHaveClass(/show/);
    
    const clearBtn = page.locator('#sc-clear-btn');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    
    await expect(input).toHaveValue('');
    await expect(dd).not.toHaveClass(/show/);
    await expect(clearBtn).not.toBeVisible();
  });
});`;
fs.writeFileSync(path.join(testsDir, 'search.spec.js'), searchCode);

// 2. bottom-sheet.spec.js
const sheetCode = `import { test, expect } from '@playwright/test';

test.describe('Bottom Sheet & Map Interactions', () => {
  test('Click marker hiện Bottom Sheet và Badge click', async ({ page }) => {
    await page.goto('/');
    const firstMarker = page.locator('.leaflet-marker-icon').first();
    await firstMarker.waitFor({ state: 'visible', timeout: 15000 });
    await firstMarker.click({ force: true });
    
    const sheet = page.locator('#bottom-sheet');
    await expect(sheet).toHaveClass(/show/);
    await expect(page.locator('#sh-title')).toBeVisible();
    
    const badge = page.locator('#sh-badge-overlay');
    if (await badge.isVisible()) {
       await badge.click({ force: true });
       const modalCrit = page.locator('#m-crit');
       await expect(modalCrit).toHaveClass(/show/);
       await page.locator('#m-crit .modal-close').click();
    }
    
    await page.locator('#sh-close-btn').click();
    await expect(sheet).not.toHaveClass(/show/);
  });
});`;
fs.writeFileSync(path.join(testsDir, 'bottom-sheet.spec.js'), sheetCode);

// 3. navigation-and-i18n.spec.js
const navCode = `import { test, expect } from '@playwright/test';

test.describe('Navigation & Language', () => {
  test('Chuyển qua lại các tab', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.switchNav && window.switchNav('cook'));
    await expect(page.locator('#cook-view')).toHaveClass(/active/);
    await page.evaluate(() => window.switchNav && window.switchNav('home'));
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });
});`;
fs.writeFileSync(path.join(testsDir, 'navigation-and-i18n.spec.js'), navCode);

// 4. modals.spec.js
const modalsCode = `import { test, expect } from '@playwright/test';

test.describe('Forms & Modals', () => {
  test('Điền form Gợi ý quán và Mock Network', async ({ page }) => {
    await page.route('https://script.google.com/macros/s/*/exec', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto('/');
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await page.evaluate(() => window.openModal && window.openModal('m-sug'));
    
    const modalSug = page.locator('#m-sug');
    await expect(modalSug).toHaveClass(/show/);
    
    await page.locator('#sug-name').fill('Quán Test Tự Động');
    await page.locator('#sug-addr').fill('123 Đường Tự Động Playwright');
    
    await page.locator('#m-sug button.primary-btn').click();
    await page.waitForTimeout(500);
  });
});`;
fs.writeFileSync(path.join(testsDir, 'modals.spec.js'), modalsCode);

console.log('Successfully wrote all test files!');
