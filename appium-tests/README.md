# Appium Mobile Tests for MediTrack

Mobile automation test suite for MediTrack Android application using Appium and WebdriverIO.

## 📋 Overview

This mobile test suite covers:
- ✅ Android mobile application testing
- ✅ User authentication flows
- ✅ Medicine search on mobile
- ✅ Appointment booking
- ✅ Mobile-specific gestures
- ✅ Cross-device testing

## 🚀 Prerequisites

### Required Software

1. **Node.js** (v18+)
2. **Java JDK** (v11+)
3. **Android Studio** with Android SDK
4. **Appium Server** (v2.x)
5. **Appium Inspector** (optional, for element inspection)

### Environment Setup

#### 1. Install Java JDK

Download and install JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK.

Set environment variables:
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
setx PATH "%PATH%;%JAVA_HOME%\bin"

# macOS/Linux
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

#### 2. Install Android Studio

Download from [Android Studio](https://developer.android.com/studio)

Set Android environment variables:
```bash
# Windows
setx ANDROID_HOME "C:\Users\YourUser\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"

# macOS/Linux
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
```

#### 3. Install Appium

```bash
npm install -g appium
appium driver install uiautomator2
appium driver install xcuitest  # For iOS
```

Verify installation:
```bash
appium --version
appium driver list
```

#### 4. Create Android Virtual Device (AVD)

Open Android Studio → AVD Manager → Create Virtual Device

Recommended configuration:
- **Device**: Pixel 5 or Pixel 6
- **System Image**: Android 11 (API 30) or higher
- **RAM**: 2048 MB or more

## 📦 Installation

```bash
cd appium-tests
npm install
```

## 🧪 Running Tests

### Start Appium Server

```bash
appium
```

Or run in background:
```bash
appium --log appium.log &
```

### Start Android Emulator

```bash
npm run android:emulator
```

Or from Android Studio:
- Open AVD Manager
- Click ▶️ Play button on your AVD

### Run Tests

#### Run all tests
```bash
npm test
```

#### Run Android tests only
```bash
npm run test:android
```

#### Run specific test file
```bash
npm run test:local -- --spec ./tests/login.spec.js
```

## 📁 Project Structure

```
appium-tests/
├── tests/                    # Test specifications
│   ├── login.spec.js        # Login tests
│   ├── search.spec.js       # Search tests
│   └── appointments.spec.js # Appointment tests
├── pages/                   # Page Object Models
│   ├── LoginPage.js
│   ├── SearchPage.js
│   └── AppointmentPage.js
├── utils/                   # Utility functions
│   └── helpers.js
├── wdio.conf.js            # WebdriverIO configuration
├── wdio.android.conf.js    # Android-specific config
├── wdio.ios.conf.js        # iOS-specific config
└── package.json
```

## ⚙️ Configuration

### wdio.conf.js

Key configuration options:

```javascript
export const config = {
  runner: 'local',
  port: 4723,
  
  specs: [
    './tests/**/*.spec.js'
  ],
  
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Pixel_5_API_30',
    'appium:platformVersion': '11',
    'appium:automationName': 'UiAutomator2',
    'appium:app': '/path/to/app.apk',  // Or use browser
    'appium:browserName': 'Chrome',     // For mobile web testing
    'appium:noReset': true,
    'appium:fullReset': false
  }],
  
  framework: 'mocha',
  mochaOpts: {
    timeout: 60000
  }
}
```

## 🎯 Test Scenarios

### Authentication Tests

```javascript
describe('Mobile Login', () => {
  it('should login with valid credentials', async () => {
    await LoginPage.open();
    await LoginPage.login('test@example.com', 'Test@1234');
    expect(await DashboardPage.isDisplayed()).toBe(true);
  });
});
```

### Search Tests

```javascript
describe('Medicine Search', () => {
  it('should search and display results', async () => {
    await SearchPage.open();
    await SearchPage.searchMedicine('Paracetamol');
    expect(await SearchPage.getResultsCount()).toBeGreaterThan(0);
  });
});
```

## 📱 Supported Platforms

### Android
- **Minimum Version**: Android 8.0 (API 26)
- **Tested Versions**: Android 11, 12, 13
- **Automation**: UiAutomator2

### iOS (Future)
- **Minimum Version**: iOS 13.0
- **Automation**: XCUITest

## 🔍 Element Inspection

### Using Appium Inspector

1. Start Appium Server
2. Open Appium Inspector
3. Configure capabilities:
```json
{
  "platformName": "Android",
  "appium:deviceName": "Pixel_5_API_30",
  "appium:platformVersion": "11",
  "appium:automationName": "UiAutomator2",
  "appium:browserName": "Chrome"
}
```
4. Start Session
5. Inspect elements and get locators

### Using Chrome DevTools (for Mobile Web)

1. Open Chrome on desktop
2. Navigate to `chrome://inspect`
3. Connect device or emulator
4. Inspect mobile browser elements

## 🎨 Locator Strategies

### Best Practices

```javascript
// Prefer accessibility ID
await $('~login-button').click();

// Use resource-id
await $('android=new UiSelector().resourceId("com.meditrack:id/email")');

// Use XPath (last resort)
await $('//android.widget.EditText[@text="Email"]');

// Use class with index
await $('android.widget.Button')[0].click();
```

## 🧪 Test Examples

### Complete Login Test

```javascript
import { expect } from 'chai';

describe('Login Functionality', () => {
  beforeEach(async () => {
    // Clear app data before each test
    await driver.reset();
  });

  it('TC-001: Should login successfully with valid credentials', async () => {
    // Navigate to login screen
    await $('~email-input').setValue('test@example.com');
    await $('~password-input').setValue('Test@1234');
    await $('~login-button').click();

    // Wait for dashboard
    await $('~dashboard-screen').waitForDisplayed({ timeout: 10000 });

    // Verify login success
    const isDashboardVisible = await $('~dashboard-screen').isDisplayed();
    expect(isDashboardVisible).to.be.true;
  });

  it('TC-002: Should show error with invalid credentials', async () => {
    await $('~email-input').setValue('wrong@example.com');
    await $('~password-input').setValue('WrongPass123');
    await $('~login-button').click();

    // Verify error message
    await $('~error-message').waitForDisplayed({ timeout: 5000 });
    const errorText = await $('~error-message').getText();
    expect(errorText).to.include('Invalid credentials');
  });
});
```

### Mobile Gestures

```javascript
// Scroll
await driver.execute('mobile: scroll', {
  direction: 'down',
  element: await $('~scrollable-view')
});

// Swipe
await driver.execute('mobile: swipe', {
  direction: 'left',
  element: await $('~swipeable-item')
});

// Long press
await driver.touchAction([
  { action: 'press', x: 100, y: 200 },
  { action: 'wait', ms: 1000 },
  { action: 'release' }
]);
```

## 📊 Reporting

### Generate Allure Report

```bash
npm install -g allure-commandline

# Run tests with allure reporter
npx wdio run ./wdio.conf.js --reporter allure

# Generate report
allure generate allure-results --clean
allure open
```

## 🔧 Troubleshooting

### Common Issues

#### Appium Server Not Starting
```bash
# Check if port 4723 is in use
netstat -ano | findstr :4723  # Windows
lsof -i :4723                  # macOS/Linux

# Kill process and restart
```

#### Device/Emulator Not Detected
```bash
# Check connected devices
adb devices

# Restart adb
adb kill-server
adb start-server
```

#### Element Not Found
- Use Appium Inspector to verify locators
- Add explicit waits
- Check if element is within viewport

#### Session Creation Failed
- Verify Appium drivers are installed
- Check device/emulator is running
- Verify Android SDK paths

### Debug Mode

```bash
# Run with verbose logging
npx wdio run ./wdio.conf.js --log-level debug
```

## 📈 Best Practices

1. **Use Page Object Model**
   - Keep tests clean and maintainable
   - Reuse page objects across tests

2. **Explicit Waits**
   ```javascript
   await element.waitForDisplayed({ timeout: 10000 });
   ```

3. **Test Data Management**
   - Use separate test data for mobile tests
   - Clean up after test execution

4. **Parallel Execution**
   - Run tests on multiple devices
   - Reduce overall execution time

5. **Error Handling**
   - Capture screenshots on failure
   - Log detailed error messages

## 🎯 Future Enhancements

- [ ] iOS test suite
- [ ] Real device testing
- [ ] Cloud testing integration (BrowserStack, Sauce Labs)
- [ ] Performance testing
- [ ] Visual regression testing

## 📚 Resources

- [Appium Documentation](https://appium.io/docs/en/latest/)
- [WebdriverIO Documentation](https://webdriver.io/)
- [Appium Inspector](https://github.com/appium/appium-inspector)
- [Android ADB Commands](https://developer.android.com/studio/command-line/adb)

## 📞 Support

For mobile testing issues:
1. Verify all prerequisites are installed
2. Check Appium and WebdriverIO versions
3. Review Appium server logs
4. Use Appium Inspector for element debugging

---

**Last Updated**: January 2, 2026  
**Test Suite Version**: 1.0.0  
**Platform Support**: Android (iOS planned)

## 📝 Quick Start Checklist

- [ ] Java JDK installed and JAVA_HOME set
- [ ] Android Studio installed with SDK
- [ ] ANDROID_HOME environment variable set
- [ ] Appium installed globally
- [ ] UiAutomator2 driver installed
- [ ] Android emulator created and running
- [ ] npm install completed
- [ ] Appium server started
- [ ] Tests executed successfully

Once all items are checked, you're ready to start mobile testing! 🚀
