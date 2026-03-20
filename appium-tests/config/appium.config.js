/**
 * Appium Configuration for HealthHub Connect
 *
 * Mobile test configuration for Android and iOS devices
 * Supports multiple device types and OS versions
 */

const config = {
  // Base application URL
  baseUrl: 'https://health-hub-connect-livid.vercel.app',

  // Test timeout settings
  implicitWait: 10000,
  newCommandTimeout: 300000,
  pageLoadTimeout: 30000,

  // Android capabilities
  android: {
    platformName: 'Android',
    browserName: 'Chrome',
    automationName: 'UiAutomator2',

    // Supported Android versions (API levels)
    platformVersions: ['10', '11', '12', '13'],

    // Device configurations
    devices: {
      pixel4: {
        deviceName: 'Pixel 4',
        platformVersion: '10',
        resolution: '1080x2280'
      },
      pixel6: {
        deviceName: 'Pixel 6',
        platformVersion: '12',
        resolution: '1080x2400'
      },
      samsungS21: {
        deviceName: 'Samsung Galaxy S21',
        platformVersion: '11',
        resolution: '1080x2400'
      }
    },

    // Chrome browser capabilities
    chromeOptions: {
      args: ['--disable-web-security', '--no-first-run', '--disable-logging'],
      mobileEmulation: {
        deviceMetrics: {
          width: 375,
          height: 667,
          pixelRatio: 3.0
        }
      }
    }
  },

  // iOS capabilities
  ios: {
    platformName: 'iOS',
    browserName: 'Safari',
    automationName: 'XCUITest',

    // Supported iOS versions
    platformVersions: ['15', '16', '17'],

    // Device configurations
    devices: {
      iphone13: {
        deviceName: 'iPhone 13',
        platformVersion: '15',
        resolution: '390x844'
      },
      iphone14: {
        deviceName: 'iPhone 14',
        platformVersion: '16',
        resolution: '390x844'
      },
      iphone14Pro: {
        deviceName: 'iPhone 14 Pro',
        platformVersion: '17',
        resolution: '393x852'
      }
    },

    // Safari capabilities
    safariOptions: {
        technologyPreview: false,
        cleanSession: true
    }
  },

  // Common capabilities for all tests
  commonCapabilities: {
    acceptInsecureCerts: true,
    throwOnMatchError: false,
    createSessionTimeout: 60000
  },

  // Viewport configurations for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    mobileLarge: { width: 414, height: 896 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 }
  },

  // Test retry configuration
  retry: {
    maxRetries: 2,
    retryDelay: 1000
  },

  // Screenshot settings
  screenshots: {
    format: 'png',
    quality: 100,
    saveOnFailure: true,
    directory: './appium-tests/screenshots/'
  },

  // Log settings
  logging: {
    level: 'info',
    file: './appium-tests/logs/appium.log'
  }
};

/**
 * Get Android Chrome capabilities
 */
function getAndroidCapabilities(deviceName = 'Pixel 4', platformVersion = '11') {
  return {
    platformName: 'Android',
    browserName: 'Chrome',
    automationName: 'UiAutomator2',
    platformVersion: platformVersion,
    deviceName: deviceName,
    acceptInsecureCerts: true,
    implicitWait: config.implicitWait,
    newCommandTimeout: config.newCommandTimeout,
    'goog:chromeOptions': {
      args: config.android.chromeOptions.args,
      mobileEmulation: config.android.chromeOptions.mobileEmulation
    }
  };
}

/**
 * Get iOS Safari capabilities
 */
function getIOSCapabilities(deviceName = 'iPhone 13', platformVersion = '15') {
  return {
    platformName: 'iOS',
    browserName: 'Safari',
    automationName: 'XCUITest',
    platformVersion: platformVersion,
    deviceName: deviceName,
    acceptInsecureCerts: true,
    implicitWait: config.implicitWait,
    newCommandTimeout: config.newCommandTimeout
  };
}

/**
 * Get responsive testing viewports
 */
function getViewports() {
  return [
    { name: 'mobile', ...config.viewports.mobile },
    { name: 'mobileLarge', ...config.viewports.mobileLarge },
    { name: 'tablet', ...config.viewports.tablet }
  ];
}

module.exports = {
  config,
  getAndroidCapabilities,
  getIOSCapabilities,
  getViewports
};
