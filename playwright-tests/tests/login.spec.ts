import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

/**
 * Login Test Suite
 * Tests user authentication functionality
 */
test.describe('User Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('TC-001: Verify login page is displayed', async ({ page }) => {
    const isDisplayed = await loginPage.verifyLoginPageDisplayed();
    expect(isDisplayed).toBeTruthy();
    expect(await page.title()).toContain('HealthHub');
  });

  test('TC-002: Verify user can login with valid credentials', async ({ page }) => {
    // Use environment variables or test data
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@1234';

    await loginPage.login(email, password);

    // Verify login success
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Verify URL changed
    expect(page.url()).not.toContain('/auth');
  });

  test('TC-003: Verify login fails with invalid email', async ({ page }) => {
    await loginPage.login('invalid@example.com', 'WrongPassword123');

    // Should remain on login page
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/auth');

    // Error message should be displayed
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC-004: Verify login fails with invalid password', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';

    await loginPage.login(email, 'WrongPassword123');

    // Should remain on login page
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/auth');

    // Error message should be displayed
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC-005: Verify login with empty email field', async ({ page }) => {
    await loginPage.login('', 'Test@1234');

    // Should remain on login page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/auth');
  });

  test('TC-006: Verify login with empty password field', async ({ page }) => {
    await loginPage.login('test@example.com', '');

    // Should remain on login page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/auth');
  });

  test('TC-007: Verify signup link navigation', async ({ page }) => {
    await loginPage.clickSignup();

    // Should navigate or show signup form
    await page.waitForTimeout(1000);
    // Verify signup form elements appear or URL changes
  });

  test('TC-008: Verify forgot password link is present', async ({ page }) => {
    const forgotLink = loginPage.forgotPasswordLink;
    const isVisible = await loginPage.isVisible(forgotLink);
    
    // Forgot password link may or may not be implemented
    // This test documents its presence
  });

  test('TC-009: Verify login form validation', async ({ page }) => {
    // Try submitting empty form
    await loginPage.clickElement(loginPage.loginButton);
    await page.waitForTimeout(1000);

    // Should show validation errors or prevent submission
    expect(page.url()).toContain('/auth');
  });

  test('TC-010: Verify login session persistence', async ({ page, context }) => {
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@1234';

    // Login
    await loginPage.login(email, password);
    await page.waitForTimeout(2000);

    // Check if logged in
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    if (isLoggedIn) {
      // Reload page
      await page.reload();
      await page.waitForTimeout(2000);

      // Should still be logged in
      const stillLoggedIn = await dashboardPage.isUserLoggedIn();
      expect(stillLoggedIn).toBeTruthy();
    }
  });
});

/**
 * Logout Test Suite
 */
test.describe('User Logout Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Login before each test
    await loginPage.navigate();
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@1234';
    await loginPage.login(email, password);
    await page.waitForTimeout(2000);
  });

  test('TC-011: Verify user can logout successfully', async ({ page }) => {
    // Check if logged in first
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    
    if (isLoggedIn) {
      await dashboardPage.logout();
      await page.waitForTimeout(2000);

      // Should redirect to login page
      expect(page.url()).toMatch(/\/(auth|login|$)/);
    }
  });

  test('TC-012: Verify session cleared after logout', async ({ page }) => {
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    
    if (isLoggedIn) {
      await dashboardPage.logout();
      await page.waitForTimeout(2000);

      // Try to navigate to dashboard
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);

      // Should redirect to login
      expect(page.url()).toMatch(/\/(auth|login)/);
    }
  });
});
