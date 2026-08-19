import { test, expect } from '@playwright/test';

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
});