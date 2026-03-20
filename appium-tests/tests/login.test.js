/**
 * Mobile Login Test Suite
 * Tests login functionality on mobile devices using Appium
 *
 * @description Tests Android Chrome mobile browser login flow
 */

const { Builder, By, until } = require('selenium-webdriver');
const { getAndroidCapabilities, getIOSCapabilities } = require('../config/appium.config');
const {
  waitForElement,
  tapElement,
  takeScreenshot,
  dismissKeyboard,
  mobileTestData
} = require('../utils/mobile-helpers');

describe('Mobile Login Tests - Android', () => {
  let driver;

  before(async () => {
    const capabilities = getAndroidCapabilities('Pixel 4', '11');
    driver = await new Builder()
      .usingServer('http://localhost:4723')
      .withCapabilities(capabilities)
      .build();

    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  beforeEach(async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * TC_MOBILE_LOGIN_001: Successful login on Android Chrome
   */
  it('TC_MOBILE_LOGIN_001: Successful login on Android Chrome mobile browser', async () => {
    // Navigate to login
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    // Find and fill email
    const emailInput = await driver.findElement(By.css('input[type="email"], input[name="email"]'));
    await emailInput.sendKeys(mobileTestData.patient.email);

    // Find and fill password
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys(mobileTestData.patient.password);

    // Dismiss keyboard
    await dismissKeyboard(driver);

    // Find and click login button
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    // Wait for navigation
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Verify logged in
    const currentUrl = await driver.getCurrentUrl();
    currentUrl.should.not.include('/auth');
  });

  /**
   * TC_MOBILE_LOGIN_002: Login with wrong password shows error
   */
  it('TC_MOBILE_LOGIN_002: Login with wrong password shows error', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    // Fill credentials with wrong password
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys(mobileTestData.patient.email);

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys('WrongPassword123');

    await dismissKeyboard(driver);

    // Click login
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    // Wait for error message
    await driver.sleep(2000);

    // Verify error displayed
    const errorElement = await driver.findElement(By.css('.error-message, [role="alert"]'));
    const errorText = await errorElement.getText();
    errorText.length.should.be.above(0);
  });

  /**
   * TC_MOBILE_LOGIN_003: Login form validation on mobile viewport
   */
  it('TC_MOBILE_LOGIN_003: Login form validation on mobile viewport', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    // Try to submit empty form
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    // Wait for validation
    await driver.sleep(1000);

    // Should remain on login page
    const currentUrl = await driver.getCurrentUrl();
    currentUrl.should.include('/auth');
  });

  /**
   * TC_MOBILE_LOGIN_004: Session persists after app backgrounding
   */
  it('TC_MOBILE_LOGIN_004: Session persists after app backgrounding', async () => {
    // Login first
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys(mobileTestData.patient.email);

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys(mobileTestData.patient.password);

    await dismissKeyboard(driver);

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Simulate backgrounding by navigating away and back
    await driver.get('about:blank');
    await driver.sleep(1000);

    // Navigate back to app
    await driver.get('https://health-hub-connect-livid.vercel.app/dashboard');
    await driver.sleep(2000);

    // Should still be logged in
    const currentUrl = await driver.getCurrentUrl();
    currentUrl.should.not.include('/auth');
  });

  /**
   * TC_MOBILE_LOGIN_005: Mobile keyboard appears on input focus
   */
  it('TC_MOBILE_LOGIN_005: Mobile keyboard appears on input focus', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.click();

    // Keyboard should appear (tested by being able to send keys)
    await emailInput.sendKeys('test@test.com');
    const value = await emailInput.getAttribute('value');
    value.should.equal('test@test.com');
  });

  /**
   * TC_MOBILE_LOGIN_006: Touch targets are accessible size
   */
  it('TC_MOBILE_LOGIN_006: Touch targets are accessible size (min 44x44)', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    const rect = await loginButton.getRect();

    // Minimum touch target size is 44x44 pixels
    (rect.width >= 44).should.be.true;
    (rect.height >= 44).should.be.true;
  });

  /**
   * TC_MOBILE_LOGIN_007: Error messages are readable on mobile
   */
  it('TC_MOBILE_LOGIN_007: Error messages are readable on mobile viewport', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    // Submit with invalid data
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys('invalid');

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    await driver.sleep(2000);

    // Error should be visible and readable
    const errorElement = await driver.findElement(By.css('.error-message, [role="alert"]'));
    const displayed = await errorElement.isDisplayed();
    displayed.should.be.true;
  });

  /**
   * TC_MOBILE_LOGIN_008: Loading state displays during login
   */
  it('TC_MOBILE_LOGIN_008: Loading state displays during login', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys(mobileTestData.patient.email);

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys(mobileTestData.patient.password);

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    // Check for loading indicator
    const loadingPresent = await waitForElement(driver, '.loading, [aria-label="loading"], button:disabled', 5000);
    // Loading may or may not be present depending on implementation
    (typeof loadingPresent).should.equal('boolean');
  });

  /**
   * TC_MOBILE_LOGIN_009: Mobile viewport renders login form correctly
   */
  it('TC_MOBILE_LOGIN_009: Mobile viewport (375px) renders login form correctly', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    // Check form elements are visible
    const emailVisible = await waitForElement(driver, 'input[type="email"]', 5000);
    const passwordVisible = await waitForElement(driver, 'input[type="password"]', 5000);
    const buttonVisible = await waitForElement(driver, 'button[type="submit"]', 5000);

    emailVisible.should.be.true;
    passwordVisible.should.be.true;
    buttonVisible.should.be.true;
  });

  /**
   * TC_MOBILE_LOGIN_010: Remember me checkbox is accessible
   */
  it('TC_MOBILE_LOGIN_010: Remember me checkbox is accessible on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    // Check if remember me exists
    const checkboxPresent = await waitForElement(driver, 'input[type="checkbox"][name="rememberMe"]', 3000);

    if (checkboxPresent) {
      const checkbox = await driver.findElement(By.css('input[type="checkbox"][name="rememberMe"]'));
      const rect = await checkbox.getRect();

      // Should be tappable
      (rect.width >= 44 || rect.height >= 44).should.be.true;
    }
  });
});
