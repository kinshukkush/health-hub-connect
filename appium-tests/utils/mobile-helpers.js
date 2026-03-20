/**
 * Mobile Helpers Utility
 * Provides reusable helper functions for Appium mobile tests
 */

/**
 * Swipe up gesture
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endY - Ending Y coordinate
 */
async function swipeUp(driver, startX, startY, endY) {
  await driver.performAction({
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: startX, y: startY },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 500, x: startX, y: endY },
      { type: 'pointerUp', button: 0 }
    ]
  });
}

/**
 * Swipe down gesture
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endY - Ending Y coordinate
 */
async function swipeDown(driver, startX, startY, endY) {
  await driver.performAction({
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: startX, y: startY },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 500, x: startX, y: endY },
      { type: 'pointerUp', button: 0 }
    ]
  });
}

/**
 * Swipe left gesture
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endX - Ending X coordinate
 */
async function swipeLeft(driver, startX, startY, endX) {
  await driver.performAction({
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: startX, y: startY },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 500, x: endX, y: startY },
      { type: 'pointerUp', button: 0 }
    ]
  });
}

/**
 * Swipe right gesture
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endX - Ending X coordinate
 */
async function swipeRight(driver, startX, startY, endX) {
  await driver.performAction({
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: startX, y: startY },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 500, x: endX, y: startY },
      { type: 'pointerUp', button: 0 }
    ]
  });
}

/**
 * Tap on element
 * @param {WebDriver} driver - Appium driver instance
 * @param {WebElement} element - Element to tap
 */
async function tapElement(driver, element) {
  await element.click();
}

/**
 * Wait for element to be visible
 * @param {WebDriver} driver - Appium driver instance
 * @param {string} selector - CSS selector or XPath
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if element is visible
 */
async function waitForElement(driver, selector, timeout = 10000) {
  try {
    await driver.wait(async () => {
      const elements = await driver.findElements({ using: 'css selector', value: selector });
      return elements.length > 0 && await elements[0].isDisplayed();
    }, timeout);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Wait for element by text
 * @param {WebDriver} driver - Appium driver instance
 * @param {string} text - Text to search for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>}
 */
async function waitForElementByText(driver, text, timeout = 10000) {
  try {
    await driver.wait(async () => {
      const elements = await driver.findElements({ using: 'xpath', value: `//*[contains(text(), "${text}")]` });
      return elements.length > 0 && await elements[0].isDisplayed();
    }, timeout);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check responsive layout at specific breakpoint
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} breakpoint - Width breakpoint (375, 414, 768)
 * @returns {Promise<object>} - Layout analysis results
 */
async function checkResponsiveLayout(driver, breakpoint) {
  const windowSize = await driver.getWindowRect();

  const results = {
    breakpoint,
    actualWidth: windowSize.width,
    actualHeight: windowSize.height,
    isResponsive: Math.abs(windowSize.width - breakpoint) < 10,
    elements: {
      headerVisible: false,
      navigationVisible: false,
      contentVisible: false
    }
  };

  // Check key elements visibility
  try {
    results.elements.headerVisible = await waitForElement(driver, 'header, [role="banner"]', 3000);
    results.elements.navigationVisible = await waitForElement(driver, 'nav, [role="navigation"]', 3000);
    results.elements.contentVisible = await waitForElement(driver, 'main, [role="main"]', 3000);
  } catch (e) {
    // Elements not found
  }

  return results;
}

/**
 * Dismiss mobile keyboard
 * @param {WebDriver} driver - Appium driver instance
 */
async function dismissKeyboard(driver) {
  try {
    await driver.executeScript('mobile: hideKeyboard', [{}]);
  } catch (e) {
    // Keyboard may already be hidden
    try {
      // Fallback: click outside input
      await driver.executeScript('document.body.click()');
    } catch (e2) {
      // Ignore
    }
  }
}

/**
 * Scroll to element by text
 * @param {WebDriver} driver - Appium driver instance
 * @param {string} text - Text of element to scroll to
 * @returns {Promise<WebElement>}
 */
async function scrollToElement(driver, text) {
  try {
    // Try Android scroll
    await driver.executeScript('mobile: scroll', [{ direction: 'down', elementText: text }]);
    const elements = await driver.findElements({ using: 'xpath', value: `//*[contains(text(), "${text}")]` });
    return elements[0];
  } catch (e) {
    // Fallback: swipe up repeatedly
    const windowSize = await driver.getWindowRect();
    for (let i = 0; i < 5; i++) {
      await swipeUp(driver, windowSize.width / 2, windowSize.height - 100, 100);
      await driver.sleep(500);

      const elements = await driver.findElements({ using: 'xpath', value: `//*[contains(text(), "${text}")]` });
      if (elements.length > 0) {
        return elements[0];
      }
    }
    throw new Error(`Element with text "${text}" not found`);
  }
}

/**
 * Take screenshot
 * @param {WebDriver} driver - Appium driver instance
 * @param {string} name - Screenshot name
 * @returns {Promise<string>} - Screenshot path
 */
async function takeScreenshot(driver, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `./appium-tests/screenshots/${name}_${timestamp}.png`;

  const screenshot = await driver.takeScreenshot();
  const fs = require('fs');
  fs.writeFileSync(filename, screenshot, 'base64');

  return filename;
}

/**
 * Get element text safely
 * @param {WebDriver} driver - Appium driver instance
 * @param {string} selector - CSS selector
 * @returns {Promise<string>}
 */
async function getElementText(driver, selector) {
  try {
    const element = await driver.findElement({ using: 'css selector', value: selector });
    return await element.getText();
  } catch (e) {
    return '';
  }
}

/**
 * Check if element exists
 * @param {WebDriver} driver - Appium driver instance
 * @param {string} selector - CSS selector
 * @returns {Promise<boolean>}
 */
async function isElementPresent(driver, selector) {
  try {
    const elements = await driver.findElements({ using: 'css selector', value: selector });
    return elements.length > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Wait for page load
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForPageLoad(driver, timeout = 10000) {
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  }, timeout);
}

/**
 * Set viewport size
 * @param {WebDriver} driver - Appium driver instance
 * @param {number} width - Width
 * @param {number} height - Height
 */
async function setViewportSize(driver, width, height) {
  await driver.executeScript('window.resizeTo(arguments[0], arguments[1])', width, height);
}

/**
 * HealthHub mobile test data
 */
const mobileTestData = {
  patient: {
    email: 'patient@demo.com',
    password: 'demo123'
  },
  admin: {
    email: 'admin@demo.com',
    password: 'demo123'
  }
};

module.exports = {
  swipeUp,
  swipeDown,
  swipeLeft,
  swipeRight,
  tapElement,
  waitForElement,
  waitForElementByText,
  checkResponsiveLayout,
  dismissKeyboard,
  scrollToElement,
  takeScreenshot,
  getElementText,
  isElementPresent,
  waitForPageLoad,
  setViewportSize,
  mobileTestData
};
