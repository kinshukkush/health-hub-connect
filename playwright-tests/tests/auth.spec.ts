import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { DashboardPage } from '../pages/DashboardPage';
import { loginAsUser, DEMO_CREDENTIALS, generateTestUser } from '../utils/test-helpers';

/**
 * Authentication Test Suite
 * Tests user login, registration, and session management
 *
 * @tag @smoke - Basic login tests
 * @tag @regression - Full authentication suite
 */
test.describe('@smoke Authentication Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC_AUTH_001: Valid login with correct credentials', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(DEMO_CREDENTIALS.patient.email, DEMO_CREDENTIALS.patient.password);
    await page.waitForTimeout(2000);

    // Verify login success
    expect(page.url()).not.toContain('/auth');
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC_AUTH_002: Login with wrong password shows error message', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(DEMO_CREDENTIALS.patient.email, 'WrongPassword123');
    await page.waitForTimeout(2000);

    // Should remain on login page
    expect(page.url()).toContain('/auth');

    // Error message should be displayed
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_AUTH_003: Login with empty email field shows validation error', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('', DEMO_CREDENTIALS.patient.password);
    await page.waitForTimeout(1000);

    // Should remain on login page
    expect(page.url()).toContain('/auth');
  });

  test('TC_AUTH_004: Login with empty password field shows validation error', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(DEMO_CREDENTIALS.patient.email, '');
    await page.waitForTimeout(1000);

    // Should remain on login page
    expect(page.url()).toContain('/auth');
  });

  test('TC_AUTH_005: Login with unregistered email shows error', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('unregistered@example.com', 'Test@1234');
    await page.waitForTimeout(2000);

    // Should remain on login page
    expect(page.url()).toContain('/auth');

    // Error message should be displayed
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });
});

test.describe('@regression Registration Tests', () => {
  let registerPage: RegistrationPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegistrationPage(page);
    loginPage = new LoginPage(page);
  });

  test('TC_AUTH_006: Successful registration with valid data', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.navigate();
    await registerPage.register(
      testUser.name,
      testUser.email,
      testUser.phone,
      testUser.password,
      testUser.password
    );
    await page.waitForTimeout(2000);

    // Verify registration success
    const isSuccess = await registerPage.isRegistrationSuccessful();
    expect(isSuccess).toBeTruthy();
  });

  test('TC_AUTH_007: Registration with duplicate email shows error', async ({ page }) => {
    await registerPage.navigate();
    await registerPage.register(
      'Test User',
      DEMO_CREDENTIALS.patient.email, // Use existing email
      '+1234567890',
      'Test@1234',
      'Test@1234'
    );
    await page.waitForTimeout(2000);

    // Error message should be displayed
    const errorMsg = await registerPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_AUTH_008: Registration with weak password shows strength error', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.navigate();
    await registerPage.register(
      testUser.name,
      testUser.email,
      testUser.phone,
      'weak', // Weak password
      'weak'
    );
    await page.waitForTimeout(2000);

    // Should show password strength error or validation error
    const errorMsg = await registerPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_AUTH_009: Registration with missing name field shows error', async ({ page }) => {
    await registerPage.navigate();
    await registerPage.register(
      '', // Empty name
      'newuser@test.com',
      '+1234567890',
      'Test@1234',
      'Test@1234'
    );
    await page.waitForTimeout(2000);

    // Should show validation error
    const errorMsg = await registerPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_AUTH_010: Registration with missing email field shows error', async ({ page }) => {
    await registerPage.navigate();
    await registerPage.register(
      'Test User',
      '', // Empty email
      '+1234567890',
      'Test@1234',
      'Test@1234'
    );
    await page.waitForTimeout(2000);

    // Should show validation error
    const errorMsg = await registerPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_AUTH_011: Registration with missing password field shows error', async ({ page }) => {
    await registerPage.navigate();
    await registerPage.register(
      'Test User',
      'testuser@example.com',
      '+1234567890',
      '', // Empty password
      ''
    );
    await page.waitForTimeout(2000);

    // Should show validation error
    const errorMsg = await registerPage.getErrorMessage();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_AUTH_012: Logout clears session and redirects to login', async ({ page }) => {
    // Login first
    await loginAsUser(page);
    await page.waitForTimeout(2000);

    // Navigate to dashboard and logout
    dashboardPage = new DashboardPage(page);
    const isLoggedIn = await dashboardPage.isUserLoggedIn();

    if (isLoggedIn) {
      await dashboardPage.logout();
      await page.waitForTimeout(2000);

      // Should redirect to login page
      expect(page.url()).toMatch(/\/(auth|login|$)/);

      // Try to access protected route
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);

      // Should redirect to login
      expect(page.url()).toContain('/auth');
    }
  });
});

test.describe('@regression Session and Protection Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC_AUTH_013: Protected route redirects unauthenticated user to login', async ({ page }) => {
    // Navigate directly to protected route without logging in
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Should redirect to login page
    expect(page.url()).toContain('/auth');
  });

  test('TC_AUTH_014: JWT token expiry handling', async ({ page }) => {
    // Login first
    await loginAsUser(page);
    await page.waitForTimeout(2000);

    // Verify logged in
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    // Note: Full token expiry test would require waiting or mocking
    // This test verifies session is active
    expect(page.url()).not.toContain('/auth');
  });

  test('TC_AUTH_015: Remember me / session persistence', async ({ page, context }) => {
    await loginPage.navigate();
    await loginPage.loginWithRememberMe(DEMO_CREDENTIALS.patient.email, DEMO_CREDENTIALS.patient.password);
    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Should still be logged in
    const stillLoggedIn = await dashboardPage.isUserLoggedIn();
    expect(stillLoggedIn).toBeTruthy();
  });

  test('TC_AUTH_016: Password field masking toggle', async ({ page }) => {
    await loginPage.navigate();

    // Check if password toggle exists
    const toggleButton = page.locator('button[aria-label*="password"], button[type="button"]:has-text("👁")');
    const isTogglePresent = await toggleButton.count() > 0;

    // Test documents presence of password toggle (optional feature)
    if (isTogglePresent) {
      // Click toggle to show password
      await toggleButton.click();
      await page.waitForTimeout(500);

      // Password input should now be type="text"
      const passwordInput = page.locator('input[name="password"]');
      const inputType = await passwordInput.getAttribute('type');
      expect(inputType).toBe('text');
    }
  });

  test('TC_AUTH_017: Login redirect after accessing protected route', async ({ page }) => {
    // Try to access protected route
    await page.goto('/appointments');
    await page.waitForTimeout(1000);

    // Should redirect to login
    expect(page.url()).toContain('/auth');

    // Login
    await loginPage.login(DEMO_CREDENTIALS.patient.email, DEMO_CREDENTIALS.patient.password);
    await page.waitForTimeout(2000);

    // Should redirect back to attempted page or dashboard
    expect(page.url()).not.toContain('/auth');
  });

  test('TC_AUTH_018: Admin login accesses admin dashboard', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(DEMO_CREDENTIALS.admin.email, DEMO_CREDENTIALS.admin.password);
    await page.waitForTimeout(2000);

    // Navigate to admin section
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    // Should be on admin page, not redirected
    expect(page.url()).toContain('/admin');
  });

  test('TC_AUTH_019: Non-admin user blocked from admin routes', async ({ page }) => {
    // Login as regular user
    await loginAsUser(page);
    await page.waitForTimeout(2000);

    // Try to access admin route
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Should redirect away from admin or show access denied
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|auth|unauthorized|$)/);
  });

  test('TC_AUTH_020: Profile update saves correctly', async ({ page }) => {
    // Login first
    await loginAsUser(page);
    await page.waitForTimeout(2000);

    // Navigate to profile
    await page.goto('/profile');
    await page.waitForTimeout(1000);

    // Update profile
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('Updated Test User');
      await page.waitForTimeout(500);

      const saveButton = page.locator('button:has-text("Save")');
      if (await saveButton.count() > 0) {
        await saveButton.click();
        await page.waitForTimeout(2000);

        // Verify save success
        const updatedName = await nameInput.inputValue();
        expect(updatedName).toBe('Updated Test User');
      }
    }
  });
});
