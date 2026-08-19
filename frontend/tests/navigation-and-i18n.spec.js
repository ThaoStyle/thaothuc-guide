import { test, expect } from '@playwright/test';

test.describe('Navigation & Language', () => {
  test('Chuyển đổi ngôn ngữ EN/VI và kiểm tra độ phủ (Coverage)', async ({ page }) => {
    await page.goto('/');
    const langBtn = page.locator('#lang-btn');
    await langBtn.waitFor({ state: 'visible' });
    
    // TRẠNG THÁI TIẾNG VIỆT
    const searchInput = page.locator('#map-search-input');
    await expect(searchInput).toHaveAttribute('placeholder', /Tìm quán ăn/);
    
    const bnavMap = page.locator('#t-bnav-map');
    await expect(bnavMap).toHaveText('Bản Đồ');
    
    // ĐỔI NGÔN NGỮ SANG EN
    await langBtn.click();
    
    // TRẠNG THÁI TIẾNG ANH
    await expect(searchInput).toHaveAttribute('placeholder', /Search places/);
    await expect(bnavMap).toHaveText('Map');
    
    // Kiểm tra title của nút Gợi ý
    const sugBtn = page.locator('button[onclick="openModal(\'m-sug\')"]');
    await expect(sugBtn).toHaveAttribute('title', 'Suggest');
    
    // Kiểm tra UI Recipes tab
    await page.evaluate(() => window.switchNav && window.switchNav('cook'));
    await expect(page.locator('#t-ck-t')).toContainText('Recipes');
  });
  
  test('Chuyển qua lại các tab', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.switchNav && window.switchNav('cook'));
    const cookPage = page.locator('#page-cook');
    await expect(cookPage).toHaveClass(/show/);
    
    await page.evaluate(() => window.switchNav && window.switchNav('home'));
    const homePage = page.locator('#page-home');
    await expect(homePage).toHaveClass(/show/);
  });
});