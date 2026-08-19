import { test, expect } from '@playwright/test';

test.describe('Sanity & Map Filters Tests', () => {

  test('Trang chủ và bản đồ load thành công', async ({ page }) => {
    // Truy cập trang web
    await page.goto('/');

    // Kiểm tra title
    await expect(page).toHaveTitle(/Thao Thức Guide/);

    // Chờ bản đồ Leaflet render (kiểm tra vùng chứa có class leaflet-container)
    const map = page.locator('#map');
    await expect(map).toBeVisible();
    await expect(map).toHaveClass(/leaflet-container/);
  });

  test('Bộ lọc danh mục (Filter Pills) hoạt động và tương tác UI', async ({ page }) => {
    await page.goto('/');

    // Đợi thanh cuộn chứa pills hiện ra
    const pillBar = page.locator('.filter-pills');
    await expect(pillBar).toBeVisible();

    // Tìm nút "Bún/Phở" hoặc tương tự, nhưng ở đây dùng data-cat
    // Vì Cơm / Bữa Chính có key là 'Cơm / Bữa Chính', ta có thể test bằng pill 'Bún / Phở / Món Nước'
    // JS: data-cat="Bún / Phở / Món Nước"
    const bunPhoPill = page.locator('button[data-cat="Bún / Phở / Món Nước"]');
    
    // Nếu nút chưa hiện ngay, đợi một chút
    await bunPhoPill.waitFor({ state: 'visible' });

    // Ban đầu nút "Tất cả" phải đang active
    const allPill = page.locator('button[data-cat="all"]');
    await expect(allPill).toHaveClass(/active/);

    // Click vào Bún/Phở
    await bunPhoPill.click();

    // Nút Bún Phở lúc này phải có class active
    await expect(bunPhoPill).toHaveClass(/active/);
    
    // Nút "Tất cả" phải mất class active
    await expect(allPill).not.toHaveClass(/active/);
  });

  test('Giao diện không bị lỗi trên Mobile (Thanh tìm kiếm)', async ({ page, isMobile }) => {
    // Test này chủ yếu có ý nghĩa khi chạy trên project Mobile Safari
    await page.goto('/');
    
    const searchCapsule = page.locator('.search-capsule');
    await expect(searchCapsule).toBeVisible();

    // Check width of search capsule doesn't exceed screen width
    const boundingBox = await searchCapsule.boundingBox();
    const viewportSize = page.viewportSize();
    
    if (boundingBox && viewportSize) {
      expect(boundingBox.width).toBeLessThanOrEqual(viewportSize.width);
    }
  });

});
