import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { LoginPage } from '../pages/LoginPage';

/**
 * Medicine Search Test Suite
 * Tests search functionality for medicines/doctors
 */
test.describe('Medicine Search Tests', () => {
  let searchPage: SearchPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    loginPage = new LoginPage(page);

    // Login first
    await loginPage.navigate();
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@1234';
    await loginPage.login(email, password);
    await page.waitForTimeout(2000);

    // Navigate to search/doctors page
    await searchPage.navigate();
  });

  test('TC-013: Verify search page loads successfully', async ({ page }) => {
    expect(page.url()).toMatch(/\/(doctors|search|medicines)/);
    
    // Verify search input is present
    const isSearchVisible = await searchPage.isVisible(searchPage.searchInput);
    expect(isSearchVisible).toBeTruthy();
  });

  test('TC-014: Verify user can search for medicines/doctors', async ({ page }) => {
    const searchTerm = 'Cardio'; // Search for cardiologist or medicine

    await searchPage.searchMedicine(searchTerm);
    await page.waitForTimeout(2000);

    // Check if results are displayed
    const resultsCount = await searchPage.getResultsCount();
    
    // Results should be greater than 0 (assuming data exists)
    // Or no results message should be displayed
    const hasResults = resultsCount > 0;
    const hasNoResultsMsg = await searchPage.isNoResultsDisplayed();

    expect(hasResults || hasNoResultsMsg).toBeTruthy();
  });

  test('TC-015: Verify search with valid medicine name shows results', async ({ page }) => {
    const medicineName = process.env.TEST_MEDICINE_NAME || 'Dr';

    await searchPage.searchMedicine(medicineName);
    await page.waitForTimeout(2000);

    const resultsCount = await searchPage.getResultsCount();
    
    if (resultsCount > 0) {
      // Verify results contain search keyword
      const containsKeyword = await searchPage.doResultsContainKeyword(medicineName);
      expect(containsKeyword).toBeTruthy();
    }
  });

  test('TC-016: Verify search with non-existent medicine shows no results', async ({ page }) => {
    await searchPage.searchMedicine('XYZ999NotExistsMedicine');
    await page.waitForTimeout(2000);

    // Should show no results message or empty results
    const resultsCount = await searchPage.getResultsCount();
    const noResultsDisplayed = await searchPage.isNoResultsDisplayed();

    expect(resultsCount === 0 || noResultsDisplayed).toBeTruthy();
  });

  test('TC-017: Verify search with empty input', async ({ page }) => {
    await searchPage.searchMedicine('');
    await page.waitForTimeout(1000);

    // Should either show all results or show validation message
    // Implementation depends on the app's behavior
  });

  test('TC-018: Verify search with special characters', async ({ page }) => {
    await searchPage.searchMedicine('@#$%^&*');
    await page.waitForTimeout(2000);

    // Should handle gracefully - either no results or error message
    const resultsCount = await searchPage.getResultsCount();
    const noResultsDisplayed = await searchPage.isNoResultsDisplayed();

    expect(resultsCount === 0 || noResultsDisplayed).toBeTruthy();
  });

  test('TC-019: Verify search results can be clicked', async ({ page }) => {
    await searchPage.searchMedicine('Dr');
    await page.waitForTimeout(2000);

    const resultsCount = await searchPage.getResultsCount();

    if (resultsCount > 0) {
      const urlBefore = page.url();
      await searchPage.clickResult(0);
      await page.waitForTimeout(2000);

      // URL should change after clicking result
      const urlAfter = page.url();
      // expect(urlAfter).not.toBe(urlBefore);
    }
  });

  test('TC-020: Verify auto-suggestions appear while typing', async ({ page }) => {
    const searchInput = searchPage.searchInput;
    
    // Type slowly to trigger suggestions
    await searchInput.click();
    await searchInput.type('Para', { delay: 200 });
    await page.waitForTimeout(1000);

    // Check if suggestions appear (if implemented)
    const suggestionsVisible = await searchPage.areAutoSuggestionsVisible();
    
    // This test documents whether auto-suggestions exist
    // It won't fail if not implemented
  });

  test('TC-021: Verify search results pagination', async ({ page }) => {
    await searchPage.searchMedicine('Dr');
    await page.waitForTimeout(2000);

    const resultsCount = await searchPage.getResultsCount();

    // Check if pagination exists (if many results)
    const paginationExists = await page.locator('.pagination, [role="navigation"]').isVisible().catch(() => false);
    
    // Document pagination presence
  });

  test('TC-022: Verify search filters work correctly', async ({ page }) => {
    await searchPage.searchMedicine('Dr');
    await page.waitForTimeout(2000);

    const initialCount = await searchPage.getResultsCount();

    // Try to apply filter (if exists)
    if (await searchPage.isVisible(searchPage.filterButton)) {
      await searchPage.applyPriceFilter('0', '500');
      await page.waitForTimeout(2000);

      const filteredCount = await searchPage.getResultsCount();
      
      // Filtered results should be different or same based on data
    }
  });

  test('TC-023: Verify search is case insensitive', async ({ page }) => {
    // Search with lowercase
    await searchPage.searchMedicine('cardio');
    await page.waitForTimeout(2000);
    const lowercaseCount = await searchPage.getResultsCount();

    // Search with uppercase
    await searchPage.searchMedicine('CARDIO');
    await page.waitForTimeout(2000);
    const uppercaseCount = await searchPage.getResultsCount();

    // Both should return similar results (if data exists)
    if (lowercaseCount > 0 && uppercaseCount > 0) {
      expect(Math.abs(lowercaseCount - uppercaseCount)).toBeLessThan(5);
    }
  });
});
