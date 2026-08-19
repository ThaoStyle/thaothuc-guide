import { test, expect } from '@playwright/test';

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
    
    // Fixed IDs
    await page.locator('#s-name').fill('Quán Test Tự Động');
    await page.locator('#s-addr').fill('123 Đường Tự Động Playwright');
    
    // Fixed button selector
    await page.locator('#m-sug .btn-submit').last().click();
    await page.waitForTimeout(500);
  });
});