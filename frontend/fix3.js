const fs = require('fs');

const code = `import { test, expect } from '@playwright/test';

test.describe('Bottom Sheet & Map Interactions', () => {
  test('Click marker hiện Bottom Sheet và Badge click', async ({ page }) => {
    await page.goto('/');
    const firstMarker = page.locator('.leaflet-marker-icon').first();
    await firstMarker.waitFor({ state: 'visible', timeout: 15000 });
    await firstMarker.click({ force: true });
    await page.waitForTimeout(500);
    
    const sheet = page.locator('#loc-sheet');
    if (await sheet.isHidden()) {
      await firstMarker.click({ force: true });
    }
    
    await expect(sheet).toHaveClass(/open/);
    await expect(page.locator('#sh-title')).toBeVisible();
    
    const badge = page.locator('#sh-badge-overlay');
    if (await badge.isVisible()) {
       await badge.click({ force: true });
       const modalCrit = page.locator('#m-crit');
       await expect(modalCrit).toHaveClass(/show/);
       await page.locator('#m-crit .modal-close').click();
    }
    
    await page.locator('#loc-sheet .sheet-close-btn').click();
    await expect(sheet).not.toHaveClass(/open/);
  });
});`;
fs.writeFileSync('tests/bottom-sheet.spec.js', code);
console.log('Fixed bottom-sheet.spec.js');
