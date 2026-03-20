/**
 * Mobile Navigation Test Suite
 * Tests navigation, responsive layout, and mobile UX on HealthHub Connect
 */

const { Builder, By, until } = require('selenium-webdriver');
const { getAndroidCapabilities, getViewports } = require('../config/appium.config');
const {
  waitForElement,
  tapElement,
  takeScreenshot,
  checkResponsiveLayout,
  swipeUp,
  swipeDown,
  mobileTestData
} = require('../utils/mobile-helpers');

describe('Mobile Navigation Tests - Android', () => {
  let driver;

  before(async () => {
    const capabilities = getAndroidCapabilities('Pixel 4', '11');
    driver = await new Builder()
      .usingServer('http://localhost:4723')
      .withCapabilities(capabilities)
      .build();

    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * TC_MOBILE_NAV_001: Header navigation links work on mobile
   */
  it('TC_MOBILE_NAV_001: Header navigation links work on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    // Login first
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys(mobileTestData.patient.email);
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys(mobileTestData.patient.password);
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);
    await driver.wait(until.urlContains('/dashboard'), 10000);

    // Test nav links
    const navLinks = ['Dashboard', 'Appointments', 'Doctors', 'Records'];

    for (const link of navLinks) {
      const navElement = await driver.findElement(By.css(`a:contains("${link}"), nav a[href*="${link.toLowerCase()}"]`));
      if (navElement) {
        await tapElement(driver, navElement);
        await driver.sleep(1000);

        const url = await driver.getCurrentUrl();
        url.should.not.include('/auth');
      }
    }
  });

  /**
   * TC_MOBILE_NAV_002: Mobile hamburger menu opens and closes
   */
  it('TC_MOBILE_NAV_002: Mobile hamburger menu opens and closes', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    // Find hamburger button
    const hamburgerButton = await driver.findElement(By.css('button[aria-label="menu"], .hamburger, .mobile-menu-button'));

    if (hamburgerButton) {
      // Open menu
      await tapElement(driver, hamburgerButton);
      await driver.sleep(500);

      // Menu should be visible
      const menuVisible = await waitForElement(driver, '.mobile-menu, nav[aria-label="mobile"]', 3000);
      menuVisible.should.be.true;

      // Close menu
      await tapElement(driver, hamburgerButton);
      await driver.sleep(500);
    }
  });

  /**
   * TC_MOBILE_NAV_003: Protected routes redirect unauthenticated users
   */
  it('TC_MOBILE_NAV_003: Protected routes redirect unauthenticated on mobile', async () => {
    // Navigate to protected route without login
    await driver.get('https://health-hub-connect-livid.vercel.app/dashboard');
    await driver.sleep(2000);

    // Should redirect to auth
    const url = await driver.getCurrentUrl();
    url.should.include('/auth');
  });

  /**
   * TC_MOBILE_NAV_004: Back button behavior works correctly
   */
  it('TC_MOBILE_NAV_004: Back button behavior works correctly on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/doctors');
    await driver.sleep(2000);

    // Click doctor
    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"]'));
    await tapElement(driver, firstDoctor);
    await driver.sleep(1000);

    // Go back
    await driver.navigate().back();
    await driver.sleep(1000);

    // Should be back on doctors list
    const url = await driver.getCurrentUrl();
    url.should.include('/doctors');
  });

  /**
   * TC_MOBILE_NAV_005: Responsive layout at 375px breakpoint
   */
  it('TC_MOBILE_NAV_005: Responsive layout at 375px breakpoint', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    // Set mobile viewport
    await driver.executeScript('window.resizeTo(375, 667)');
    await driver.sleep(500);

    // Check responsive elements
    const headerVisible = await waitForElement(driver, 'header', 3000);
    headerVisible.should.be.true;

    // Content should be readable
    const mainVisible = await waitForElement(driver, 'main', 3000);
    mainVisible.should.be.true;
  });

  /**
   * TC_MOBILE_NAV_006: Responsive layout at 414px breakpoint
   */
  it('TC_MOBILE_NAV_006: Responsive layout at 414px breakpoint', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    await driver.executeScript('window.resizeTo(414, 896)');
    await driver.sleep(500);

    const headerVisible = await waitForElement(driver, 'header', 3000);
    headerVisible.should.be.true;
  });

  /**
   * TC_MOBILE_NAV_007: Responsive layout at 768px breakpoint (tablet)
   */
  it('TC_MOBILE_NAV_007: Responsive layout at 768px breakpoint (tablet)', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    await driver.executeScript('window.resizeTo(768, 1024)');
    await driver.sleep(500);

    const headerVisible = await waitForElement(driver, 'header', 3000);
    headerVisible.should.be.true;
  });

  /**
   * TC_MOBILE_NAV_008: Bottom navigation accessible on mobile
   */
  it('TC_MOBILE_NAV_008: Bottom navigation accessible on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    // Check for bottom nav
    const bottomNav = await waitForElement(driver, 'nav[aria-label="bottom"], .bottom-nav', 3000);

    if (bottomNav) {
      const navItems = await driver.findElements(By.css('.bottom-nav a, nav[aria-label="bottom"] a'));
      navItems.length.should.be.above(2);
    }
  });

  /**
   * TC_MOBILE_NAV_009: Touch gestures work on cards
   */
  it('TC_MOBILE_NAV_009: Touch gestures work on doctor cards', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/doctors');
    await driver.sleep(2000);

    const firstCard = await driver.findElement(By.css('[data-testid="doctor-card"]'));

    // Tap should work
    await tapElement(driver, firstCard);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    url.should.include('/doctors');
  });

  /**
   * TC_MOBILE_NAV_010: Scroll to content works on mobile
   */
  it('TC_MOBILE_NAV_010: Scroll to content works on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/doctors');
    await driver.sleep(2000);

    // Scroll down
    await driver.executeScript('window.scrollBy(0, 500)');
    await driver.sleep(500);

    // Content should still be interactive
    const cards = await driver.findElements(By.css('[data-testid="doctor-card"]'));
    cards.length.should.be.above(0);
  });

  /**
   * TC_MOBILE_NAV_011: Modal dialogs work on mobile
   */
  it('TC_MOBILE_NAV_011: Modal dialogs work on mobile viewport', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/records');
    await driver.sleep(2000);

    // Login if needed
    const url = await driver.getCurrentUrl();
    if (url.includes('/auth')) {
      await driver.get('https://health-hub-connect-livid.vercel.app/auth');
      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      await emailInput.sendKeys(mobileTestData.patient.email);
      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      await passwordInput.sendKeys(mobileTestData.patient.password);
      const loginButton = await driver.findElement(By.css('button[type="submit"]'));
      await tapElement(driver, loginButton);
      await driver.wait(until.urlContains('/dashboard'), 10000);
      await driver.get('https://health-hub-connect-livid.vercel.app/records');
    }

    // Click upload
    const uploadButton = await driver.findElement(By.css('button:contains("Upload"), button:contains("Add")'));
    if (uploadButton) {
      await tapElement(driver, uploadButton);
      await driver.sleep(1000);

      // Modal should be visible
      const modalVisible = await waitForElement(driver, '[role="dialog"], .modal', 3000);
      modalVisible.should.be.true;
    }
  });

  /**
   * TC_MOBILE_NAV_012: Deep links work on mobile
   */
  it('TC_MOBILE_NAV_012: Deep links work on mobile', async () => {
    // Direct deep link
    await driver.get('https://health-hub-connect-livid.vercel.app/doctors/6765e2aab40d59187f586e7e');
    await driver.sleep(2000);

    // Should load or redirect appropriately
    const url = await driver.getCurrentUrl();
    url.should.include('/doctors');
  });

  /**
   * TC_MOBILE_NAV_013: Footer links accessible on mobile
   */
  it('TC_MOBILE_NAV_013: Footer links accessible on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/');
    await driver.sleep(2000);

    // Scroll to footer
    await driver.executeScript('window.scrollBy(0, 1000)');
    await driver.sleep(500);

    // Footer should be present
    const footer = await waitForElement(driver, 'footer', 3000);
    footer.should.be.true;
  });

  /**
   * TC_MOBILE_NAV_014: Page loads within acceptable time on mobile
   */
  it('TC_MOBILE_NAV_014: Page loads within acceptable time on mobile', async () => {
    const startTime = Date.now();
    await driver.get('https://health-hub-connect-livid.vercel.app/');

    await driver.wait(until.elementLocated(By.css('body')), 10000);
    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds
    loadTime.should.be.below(10000);
  });

  /**
   * TC_MOBILE_NAV_015: Forms are usable on mobile keyboard
   */
  it('TC_MOBILE_NAV_015: Forms are usable with mobile keyboard', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys('test@test.com');

    const value = await emailInput.getAttribute('value');
    value.should.equal('test@test.com');
  });
});
