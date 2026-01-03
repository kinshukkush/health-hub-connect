# Playwright Tests for MediTrack

Comprehensive automated test suite for MediTrack application using Playwright.

## 📋 Overview

This test suite covers:
- ✅ User Authentication (Login/Logout)
- ✅ Medicine/Doctor Search
- ✅ Shopping Cart Operations
- ✅ Appointment Booking
- ✅ Order Management
- ✅ Cross-browser Testing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MediTrack application running (Frontend & Backend)

### Installation

```bash
cd playwright-tests
npm install
```

### Install Playwright Browsers

```bash
npx playwright install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your test environment settings:
```env
BASE_URL=http://localhost:5173
API_BASE_URL=http://localhost:5000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Test@1234
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests for Specific Browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run Specific Test File

```bash
npx playwright test tests/login.spec.ts
```

### Run Specific Test Case

```bash
npx playwright test tests/login.spec.ts -g "Verify user can login"
```

### Run Tests in Parallel

```bash
npm run test:parallel
```

## 📊 Viewing Reports

### HTML Report

After test execution, view the HTML report:

```bash
npm run report
```

This will open an interactive HTML report with test results, screenshots, and videos.

### Allure Report

Generate Allure report:

```bash
npx allure generate allure-results --clean
npx allure open
```

## 📁 Project Structure

```
playwright-tests/
├── pages/                  # Page Object Models
│   ├── BasePage.ts        # Base page with common methods
│   ├── LoginPage.ts       # Login page objects
│   ├── RegistrationPage.ts# Registration page objects
│   ├── SearchPage.ts      # Search page objects
│   ├── CartPage.ts        # Cart page objects
│   └── DashboardPage.ts   # Dashboard page objects
├── tests/                 # Test specifications
│   ├── login.spec.ts      # Login/logout tests
│   ├── search.spec.ts     # Search functionality tests
│   ├── cart.spec.ts       # Cart operations tests
│   └── ...
├── playwright-report/     # HTML test reports
├── allure-results/        # Allure test results
├── screenshots/           # Test screenshots
├── playwright.config.ts   # Playwright configuration
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🎯 Page Object Model

This project follows the Page Object Model (POM) design pattern:

### BasePage
Common methods used across all pages:
- `goto(url)` - Navigate to URL
- `clickElement(locator)` - Click element
- `fillInput(locator, value)` - Fill input field
- `isVisible(locator)` - Check visibility
- `waitForNavigation()` - Wait for page load

### LoginPage
```typescript
const loginPage = new LoginPage(page);
await loginPage.navigate();
await loginPage.login(email, password);
const isSuccess = await loginPage.isLoginSuccessful();
```

### SearchPage
```typescript
const searchPage = new SearchPage(page);
await searchPage.navigate();
await searchPage.searchMedicine('Paracetamol');
const count = await searchPage.getResultsCount();
```

### CartPage
```typescript
const cartPage = new CartPage(page);
await cartPage.navigate();
await cartPage.increaseQuantity(0);
await cartPage.removeItem(0);
const total = await cartPage.getTotalPrice();
```

## 🔧 Configuration

### Browser Configuration

Edit `playwright.config.ts` to customize:
- Timeout settings
- Browser options
- Viewport size
- Screenshot/video settings
- Retry logic

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Frontend URL | http://localhost:5173 |
| `API_BASE_URL` | Backend API URL | http://localhost:5000 |
| `TEST_USER_EMAIL` | Test user email | test@example.com |
| `TEST_USER_PASSWORD` | Test user password | Test@1234 |
| `HEADLESS` | Run in headless mode | false |

## 📝 Test Scenarios Covered

### Authentication (12 tests)
- ✅ TC-001: Login page display
- ✅ TC-002: Valid login
- ✅ TC-003: Invalid email
- ✅ TC-004: Invalid password
- ✅ TC-005: Empty email
- ✅ TC-006: Empty password
- ✅ TC-007: Signup navigation
- ✅ TC-008: Forgot password link
- ✅ TC-009: Form validation
- ✅ TC-010: Session persistence
- ✅ TC-011: Successful logout
- ✅ TC-012: Session cleared after logout

### Search (11 tests)
- ✅ TC-013: Search page loads
- ✅ TC-014: Basic search
- ✅ TC-015: Valid search results
- ✅ TC-016: No results for invalid search
- ✅ TC-017: Empty search
- ✅ TC-018: Special characters
- ✅ TC-019: Click results
- ✅ TC-020: Auto-suggestions
- ✅ TC-021: Pagination
- ✅ TC-022: Filters
- ✅ TC-023: Case insensitivity

### Cart (12 tests)
- ✅ TC-024: Cart page loads
- ✅ TC-025: Empty cart message
- ✅ TC-026: Add to cart
- ✅ TC-027: Cart badge updates
- ✅ TC-028: View cart items
- ✅ TC-029: Increase quantity
- ✅ TC-030: Decrease quantity
- ✅ TC-031: Remove item
- ✅ TC-032: Price calculation
- ✅ TC-033: Checkout button visibility
- ✅ TC-034: Cart persistence
- ✅ TC-035: Continue shopping

## 🎥 Test Artifacts

Tests automatically capture:
- **Screenshots** - On test failure
- **Videos** - On test failure
- **Traces** - On test failure

Artifacts are saved in:
- `playwright-report/` - HTML reports
- `test-results/` - Screenshots and videos
- `allure-results/` - Allure test data

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Install dependencies
  run: cd playwright-tests && npm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: cd playwright-tests && npm test

- name: Upload report
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-tests/playwright-report/
```

## 🐛 Debugging

### Debug Specific Test

```bash
npx playwright test tests/login.spec.ts --debug
```

### Inspect Selectors

```bash
npx playwright codegen http://localhost:5173
```

### View Trace

```bash
npx playwright show-trace test-results/trace.zip
```

## 📈 Test Coverage

Current automation coverage:
- **Login/Auth**: 12 tests
- **Search**: 11 tests
- **Cart**: 12 tests
- **Total**: 35+ automated tests

## 🤝 Contributing

When adding new tests:
1. Follow Page Object Model pattern
2. Add descriptive test names
3. Use test IDs (TC-XXX) for traceability
4. Add assertions for verification
5. Handle async operations properly
6. Clean up test data after execution

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Allure Reports](https://docs.qameta.io/allure/)

## ❓ Troubleshooting

### Tests Failing?

1. **Check Application Status**
   - Ensure frontend is running on correct port
   - Ensure backend is running and connected to database

2. **Environment Variables**
   - Verify `.env` file exists and has correct values
   - Check test user credentials are valid

3. **Browser Issues**
   - Reinstall browsers: `npx playwright install --with-deps`
   - Try running in headed mode to see what's happening

4. **Timeout Issues**
   - Increase timeout in `playwright.config.ts`
   - Check network/API response times

### Common Issues

**Issue**: Tests fail with "element not found"
- **Solution**: Locators may need updating based on UI changes

**Issue**: Login tests failing
- **Solution**: Verify test user exists in database with correct credentials

**Issue**: Slow test execution
- **Solution**: Reduce wait times, use parallel execution

## 📞 Support

For issues or questions:
- Check existing tests for examples
- Review Playwright documentation
- Debug using headed mode and traces

---

**Last Updated**: January 2, 2026  
**Test Suite Version**: 1.0.0
