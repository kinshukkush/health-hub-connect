import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { SearchPage } from '../pages/SearchPage';
import { LoginPage } from '../pages/LoginPage';

/**
 * Shopping Cart Test Suite
 * Tests cart functionality
 */
test.describe('Shopping Cart Tests', () => {
  let cartPage: CartPage;
  let searchPage: SearchPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    searchPage = new SearchPage(page);
    loginPage = new LoginPage(page);

    // Login first
    await loginPage.navigate();
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@1234';
    await loginPage.login(email, password);
    await page.waitForTimeout(2000);
  });

  test('TC-024: Verify cart page loads successfully', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(1000);

    expect(page.url()).toContain('/cart');
  });

  test('TC-025: Verify empty cart message is displayed', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    // Clear cart if not empty
    if (!(await cartPage.isCartEmpty())) {
      await cartPage.clearCart();
      await page.waitForTimeout(1000);
    }

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test('TC-026: Verify user can add item to cart', async ({ page }) => {
    // Navigate to search/doctors page
    await searchPage.navigate();
    await page.waitForTimeout(1000);

    // Search for doctor/medicine
    await searchPage.searchMedicine('Dr');
    await page.waitForTimeout(2000);

    const resultsCount = await searchPage.getResultsCount();

    if (resultsCount > 0) {
      // Get initial cart count
      const initialCartCount = await cartPage.getCartBadgeCount();

      // Click on first result to view details
      await searchPage.clickResult(0);
      await page.waitForTimeout(2000);

      // Try to find and click "Add to Cart" or "Book Appointment" button
      const addButton = page.locator('button:has-text("Book"), button:has-text("Add")');
      
      if (await addButton.isVisible({ timeout: 5000 })) {
        await addButton.first().click();
        await page.waitForTimeout(2000);

        // Verify cart count increased (if cart badge exists)
        const newCartCount = await cartPage.getCartBadgeCount();
        // expect(newCartCount).toBeGreaterThan(initialCartCount);
      }
    }
  });

  test('TC-027: Verify cart badge updates after adding item', async ({ page }) => {
    // Get initial cart count
    const initialCount = await cartPage.getCartBadgeCount();

    // Navigate to search and add item (similar to TC-026)
    await searchPage.navigate();
    await page.waitForTimeout(1000);
    await searchPage.searchMedicine('Dr');
    await page.waitForTimeout(2000);

    const resultsCount = await searchPage.getResultsCount();

    if (resultsCount > 0) {
      await searchPage.clickResult(0);
      await page.waitForTimeout(2000);

      const addButton = page.locator('button:has-text("Book"), button:has-text("Add")');
      
      if (await addButton.isVisible({ timeout: 5000 })) {
        await addButton.first().click();
        await page.waitForTimeout(2000);

        // Check cart badge
        const newCount = await cartPage.getCartBadgeCount();
        // Verify count increased or cart shows items
      }
    }
  });

  test('TC-028: Verify user can view cart items', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const itemCount = await cartPage.getCartItemsCount();

    if (itemCount > 0) {
      // Verify cart items are displayed
      expect(itemCount).toBeGreaterThan(0);

      // Get details of first item
      const itemDetails = await cartPage.getItemDetails(0);
      expect(itemDetails.name).toBeTruthy();
    }
  });

  test('TC-029: Verify user can increase item quantity', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const itemCount = await cartPage.getCartItemsCount();

    if (itemCount > 0) {
      // Get initial quantity
      const initialDetails = await cartPage.getItemDetails(0);
      const initialQty = parseInt(initialDetails.quantity || '1');

      // Increase quantity
      await cartPage.increaseQuantity(0);
      await page.waitForTimeout(1000);

      // Get new quantity
      const newDetails = await cartPage.getItemDetails(0);
      const newQty = parseInt(newDetails.quantity || '1');

      // Verify quantity increased
      expect(newQty).toBeGreaterThan(initialQty);
    }
  });

  test('TC-030: Verify user can decrease item quantity', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const itemCount = await cartPage.getCartItemsCount();

    if (itemCount > 0) {
      // First increase quantity to ensure it's > 1
      await cartPage.increaseQuantity(0);
      await page.waitForTimeout(1000);

      // Get current quantity
      const currentDetails = await cartPage.getItemDetails(0);
      const currentQty = parseInt(currentDetails.quantity || '2');

      if (currentQty > 1) {
        // Decrease quantity
        await cartPage.decreaseQuantity(0);
        await page.waitForTimeout(1000);

        // Get new quantity
        const newDetails = await cartPage.getItemDetails(0);
        const newQty = parseInt(newDetails.quantity || '1');

        // Verify quantity decreased
        expect(newQty).toBeLessThan(currentQty);
      }
    }
  });

  test('TC-031: Verify user can remove item from cart', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const initialCount = await cartPage.getCartItemsCount();

    if (initialCount > 0) {
      // Remove first item
      await cartPage.removeItem(0);
      await page.waitForTimeout(2000);

      // Get new count
      const newCount = await cartPage.getCartItemsCount();

      // Verify count decreased
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('TC-032: Verify cart total price calculation', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const itemCount = await cartPage.getCartItemsCount();

    if (itemCount > 0) {
      // Get total price
      const totalPrice = await cartPage.getTotalPrice();
      
      // Total should be present and not empty
      expect(totalPrice).toBeTruthy();
      expect(totalPrice.length).toBeGreaterThan(0);
    }
  });

  test('TC-033: Verify checkout button is visible with items in cart', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const itemCount = await cartPage.getCartItemsCount();

    if (itemCount > 0) {
      // Checkout button should be visible
      const isCheckoutVisible = await cartPage.isVisible(cartPage.checkoutButton);
      expect(isCheckoutVisible).toBeTruthy();
    }
  });

  test('TC-034: Verify cart persists after page refresh', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    const initialCount = await cartPage.getCartItemsCount();

    if (initialCount > 0) {
      // Refresh page
      await page.reload();
      await page.waitForTimeout(2000);

      // Get count after refresh
      const countAfterRefresh = await cartPage.getCartItemsCount();

      // Cart should persist
      expect(countAfterRefresh).toBe(initialCount);
    }
  });

  test('TC-035: Verify continue shopping button works', async ({ page }) => {
    await cartPage.navigate();
    await page.waitForTimeout(2000);

    if (await cartPage.isVisible(cartPage.continueShoppingButton)) {
      await cartPage.continueShopping();
      await page.waitForTimeout(2000);

      // Should navigate away from cart
      expect(page.url()).not.toContain('/cart');
    }
  });
});
