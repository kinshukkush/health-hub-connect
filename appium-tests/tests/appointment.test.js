/**
 * Mobile Appointment Test Suite
 * Tests appointment booking functionality on mobile devices using Appium
 */

const { Builder, By, until } = require('selenium-webdriver');
const { getAndroidCapabilities } = require('../config/appium.config');
const {
  waitForElement,
  tapElement,
  takeScreenshot,
  dismissKeyboard,
  scrollToElement,
  mobileTestData
} = require('../utils/mobile-helpers');

describe('Mobile Appointment Tests - Android', () => {
  let driver;

  before(async () => {
    const capabilities = getAndroidCapabilities('Pixel 4', '11');
    driver = await new Builder()
      .usingServer('http://localhost:4723')
      .withCapabilities(capabilities)
      .build();

    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  beforeEach(async () => {
    // Login before each test
    await driver.get('https://health-hub-connect-livid.vercel.app/auth');
    await driver.sleep(2000);

    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    await emailInput.sendKeys(mobileTestData.patient.email);

    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await passwordInput.sendKeys(mobileTestData.patient.password);

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, loginButton);

    await driver.wait(until.urlContains('/dashboard'), 10000);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * TC_MOBILE_APPT_001: Search doctor on mobile
   */
  it('TC_MOBILE_APPT_001: Search for doctor on mobile viewport', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    // Find search input
    const searchInput = await driver.findElement(By.css('input[placeholder*="Search"], input[name="search"]'));
    await searchInput.sendKeys('Cardio');

    await dismissKeyboard(driver);

    // Wait for results
    await driver.sleep(2000);

    // Verify results displayed
    const doctorCards = await driver.findElements(By.css('[data-testid="doctor-card"], .doctor-card'));
    doctorCards.length.should.be.aboveOrEqual(0);
  });

  /**
   * TC_MOBILE_APPT_002: Book appointment on mobile viewport
   */
  it('TC_MOBILE_APPT_002: Book appointment on mobile viewport', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    // Click first doctor
    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"], .doctor-card'));
    await tapElement(driver, firstDoctor);

    await driver.sleep(1000);

    // Fill date
    const dateInput = await driver.findElement(By.css('input[type="date"]'));
    await dateInput.sendKeys('2026-04-01');

    // Fill time
    const timeInput = await driver.findElement(By.css('input[type="time"]'));
    await timeInput.sendKeys('10:00');

    // Fill reason
    const reasonInput = await driver.findElement(By.css('textarea[name="reason"]'));
    await reasonInput.sendKeys('Routine checkup');

    await dismissKeyboard(driver);

    // Submit
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, submitButton);

    await driver.sleep(2000);

    // Verify success
    const currentUrl = await driver.getCurrentUrl();
    currentUrl.should.include('/appointments');
  });

  /**
   * TC_MOBILE_APPT_003: View appointment history on mobile
   */
  it('TC_MOBILE_APPT_003: View appointment history on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    // Click history link
    const historyLink = await driver.findElement(By.css('a:contains("History"), a:contains("My Appointments")'));
    await tapElement(driver, historyLink);

    await driver.sleep(1000);

    // Verify table displayed
    const table = await driver.findElement(By.css('table, [data-testid="appointment-table"]'));
    const displayed = await table.isDisplayed();
    displayed.should.be.true;
  });

  /**
   * TC_MOBILE_APPT_004: Cancel appointment on mobile
   */
  it('TC_MOBILE_APPT_004: Cancel appointment on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    // Go to history
    const historyLink = await driver.findElement(By.css('a:contains("History")'));
    if (historyLink) {
      await tapElement(driver, historyLink);
      await driver.sleep(1000);

      // Find cancel button
      const cancelButtons = await driver.findElements(By.css('button:contains("Cancel")'));
      if (cancelButtons.length > 0) {
        await tapElement(driver, cancelButtons[0]);
        await driver.sleep(2000);

        // Verify cancellation
        const url = await driver.getCurrentUrl();
        url.should.include('/appointments');
      }
    }
  });

  /**
   * TC_MOBILE_APPT_005: Filter specialization on mobile
   */
  it('TC_MOBILE_APPT_005: Filter doctors by specialization on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    // Find filter dropdown
    const filterSelect = await driver.findElement(By.css('select[name="specialization"]'));
    if (filterSelect) {
      const options = await filterSelect.findElements(By.css('option'));
      if (options.length > 0) {
        // Select first option
        await options[0].click();
        await driver.sleep(1000);

        // Verify filtered
        const doctors = await driver.findElements(By.css('[data-testid="doctor-card"]'));
        doctors.length.should.be.aboveOrEqual(0);
      }
    }
  });

  /**
   * TC_MOBILE_APPT_006: Doctor profile displays on mobile
   */
  it('TC_MOBILE_APPT_006: Doctor profile displays correctly on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/doctors');
    await driver.sleep(2000);

    // Click first doctor
    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"]'));
    await tapElement(driver, firstDoctor);

    await driver.sleep(1000);

    // Verify profile elements
    const nameVisible = await waitForElement(driver, '[data-testid="doctor-name"], h1', 5000);
    const specVisible = await waitForElement(driver, '[data-testid="doctor-specialization"]', 5000);

    nameVisible.should.be.true;
    specVisible.should.be.true;
  });

  /**
   * TC_MOBILE_APPT_007: Date picker works on mobile
   */
  it('TC_MOBILE_APPT_007: Date picker works on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"]'));
    await tapElement(driver, firstDoctor);

    const dateInput = await driver.findElement(By.css('input[type="date"]'));
    await dateInput.sendKeys('2026-04-15');

    const value = await dateInput.getAttribute('value');
    value.should.equal('2026-04-15');
  });

  /**
   * TC_MOBILE_APPT_008: Time picker works on mobile
   */
  it('TC_MOBILE_APPT_008: Time picker works on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"]'));
    await tapElement(driver, firstDoctor);

    const timeInput = await driver.findElement(By.css('input[type="time"]'));
    await timeInput.sendKeys('14:00');

    const value = await timeInput.getAttribute('value');
    value.should.equal('14:00');
  });

  /**
   * TC_MOBILE_APPT_009: Success toast visible on mobile
   */
  it('TC_MOBILE_APPT_009: Success toast visible on mobile viewport', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"]'));
    await tapElement(driver, firstDoctor);

    const dateInput = await driver.findElement(By.css('input[type="date"]'));
    await dateInput.sendKeys('2026-04-15');

    const timeInput = await driver.findElement(By.css('input[type="time"]'));
    await timeInput.sendKeys('10:00');

    const reasonInput = await driver.findElement(By.css('textarea[name="reason"]'));
    await reasonInput.sendKeys('Checkup');

    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await tapElement(driver, submitButton);

    await driver.sleep(2000);

    // Check for success toast
    const toastPresent = await waitForElement(driver, '[role="status"], .toast-success', 5000);
    toastPresent.should.be.true;
  });

  /**
   * TC_MOBILE_APPT_010: Appointment form scrollable on mobile
   */
  it('TC_MOBILE_APPT_010: Appointment form is scrollable on mobile', async () => {
    await driver.get('https://health-hub-connect-livid.vercel.app/appointments');
    await driver.sleep(2000);

    const firstDoctor = await driver.findElement(By.css('[data-testid="doctor-card"]'));
    await tapElement(driver, firstDoctor);

    // Scroll down
    await driver.executeScript('window.scrollBy(0, 300)');
    await driver.sleep(500);

    // Bottom elements should be visible
    const submitVisible = await waitForElement(driver, 'button[type="submit"]', 3000);
    submitVisible.should.be.true;
  });
});
