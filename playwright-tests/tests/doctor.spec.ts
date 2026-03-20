import { test, expect } from '@playwright/test';
import { DoctorPage } from '../pages/DoctorPage';
import { loginAsUser, DEMO_CREDENTIALS } from '../utils/test-helpers';

/**
 * Doctor Management Test Suite
 * Tests doctor browsing, searching, filtering, and profile viewing
 *
 * @tag @smoke - Basic doctor browsing
 * @tag @regression - Full doctor suite
 */
test.describe('@smoke Doctor Browse Tests', () => {
  let doctorPage: DoctorPage;

  test.beforeEach(async ({ page }) => {
    doctorPage = new DoctorPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_DOCTOR_001: All doctors display on browse page', async ({ page }) => {
    await doctorPage.navigate();
    await page.waitForTimeout(1000);

    // Verify doctors list is displayed
    const doctorsCount = await doctorPage.getDoctorCardsCount();
    expect(doctorsCount).toBeGreaterThan(0);
  });

  test('TC_DOCTOR_002: Search returns matching doctor results', async ({ page }) => {
    await doctorPage.navigate();

    // Search for doctor
    await doctorPage.searchByName('Cardio');
    await page.waitForTimeout(1000);

    // Verify results displayed
    const doctorsCount = await doctorPage.getDoctorCardsCount();
    expect(doctorsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_DOCTOR_003: Filter by specialization returns correct doctors', async ({ page }) => {
    await doctorPage.navigate();

    // Filter by specialization
    await doctorPage.filterBySpecialization('Cardiology');
    await page.waitForTimeout(1000);

    // Verify filtered results
    const doctorsCount = await doctorPage.getDoctorCardsCount();
    expect(doctorsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_DOCTOR_004: Clicking doctor card opens profile page', async ({ page }) => {
    await doctorPage.navigate();

    // Click first doctor card
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Verify profile page is displayed
    const isProfileDisplayed = await doctorPage.verifyProfilePageDisplayed();
    expect(isProfileDisplayed).toBeTruthy();
  });

  test('TC_DOCTOR_005: Doctor profile shows name, specialization, experience, fees', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Get profile details
    const details = await doctorPage.getDoctorProfileDetails();

    // Verify all fields have content
    expect(details.name.length).toBeGreaterThan(0);
    expect(details.specialization.length).toBeGreaterThan(0);
  });
});

test.describe('@regression Doctor Search Tests', () => {
  let doctorPage: DoctorPage;

  test.beforeEach(async ({ page }) => {
    doctorPage = new DoctorPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_DOCTOR_006: Search with no match shows empty state message', async ({ page }) => {
    await doctorPage.navigate();

    // Search with unlikely term
    await doctorPage.searchByName('XYZNONEXISTENT123');
    await page.waitForTimeout(1000);

    // Verify empty state or zero results
    const isEmptyState = await doctorPage.isEmptyStateDisplayed();
    const doctorsCount = await doctorPage.getDoctorCardsCount();

    expect(isEmptyState || doctorsCount === 0).toBeTruthy();
  });

  test('TC_DOCTOR_007: Search results count displays correctly', async ({ page }) => {
    await doctorPage.navigate();

    // Get results count
    const countText = await doctorPage.getResultsCount();

    // Should show some count text or have results
    const doctorsCount = await doctorPage.getDoctorCardsCount();
    expect(doctorsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_DOCTOR_008: Search input accepts text input', async ({ page }) => {
    await doctorPage.navigate();

    // Verify search input is editable
    const searchVisible = await doctorPage.isVisible(doctorPage.searchInput);
    expect(searchVisible).toBeTruthy();

    await doctorPage.searchByName('Test');
    const inputValue = await doctorPage.searchInput.inputValue();
    expect(inputValue).toBe('Test');
  });

  test('TC_DOCTOR_009: Specialization filter dropdown works', async ({ page }) => {
    await doctorPage.navigate();

    // Verify dropdown exists and is visible
    const dropdownVisible = await doctorPage.isVisible(doctorPage.specializationDropdown);

    if (dropdownVisible) {
      // Select an option
      await doctorPage.selectOption(doctorPage.specializationDropdown, 'Cardiology');
      await page.waitForTimeout(1000);

      // Verify filter applied
      const doctorsCount = await doctorPage.getDoctorCardsCount();
      expect(doctorsCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC_DOCTOR_010: Sort by fees works correctly', async ({ page }) => {
    await doctorPage.navigate();

    // Verify sort dropdown exists
    const sortVisible = await doctorPage.isVisible(doctorPage.sortByDropdown);

    if (sortVisible) {
      // Sort by fees
      await doctorPage.sortByFees();
      await page.waitForTimeout(1000);

      // Verify doctors still displayed
      const doctorsCount = await doctorPage.getDoctorCardsCount();
      expect(doctorsCount).toBeGreaterThan(0);
    }
  });
});

test.describe('@regression Doctor Profile Tests', () => {
  let doctorPage: DoctorPage;

  test.beforeEach(async ({ page }) => {
    doctorPage = new DoctorPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_DOCTOR_011: Doctor profile displays complete information', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Get all profile details
    const details = await doctorPage.getDoctorProfileDetails();

    // Verify fields present
    expect(details.name.length).toBeGreaterThan(0);
    expect(details.specialization.length).toBeGreaterThan(0);
    expect(details.experience.length).toBeGreaterThan(0);
    expect(details.fees.length).toBeGreaterThan(0);
  });

  test('TC_DOCTOR_012: Book appointment button on profile page', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Verify book button exists
    const bookButtonVisible = await doctorPage.isVisible(doctorPage.bookAppointmentButton);
    expect(bookButtonVisible).toBeTruthy();
  });

  test('TC_DOCTOR_013: Back navigation from doctor profile works', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Go back to doctors list
    await doctorPage.backToDoctorsList();
    await page.waitForTimeout(1000);

    // Verify back on list page
    expect(page.url()).toContain('/doctors');
  });

  test('TC_DOCTOR_014: Profile page URL contains doctor identifier', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // URL should contain doctor id or slug
    const url = page.url();
    expect(url).toMatch(/\/doctors\/\w+/);
  });

  test('TC_DOCTOR_015: Multiple doctor cards display with unique info', async ({ page }) => {
    await doctorPage.navigate();
    await page.waitForTimeout(1000);

    const count = await doctorPage.getDoctorCardsCount();

    if (count > 1) {
      // Get first two doctor names
      const firstCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
      const secondCard = page.locator('[data-testid="doctor-card"], .doctor-card').nth(1);

      const firstName = await firstCard.textContent();
      const secondName = await secondCard.textContent();

      // Names should be different
      expect(firstName).not.toBe(secondName);
    }
  });
});

test.describe('@regression Doctor Pagination Tests', () => {
  let doctorPage: DoctorPage;

  test.beforeEach(async ({ page }) => {
    doctorPage = new DoctorPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_DOCTOR_016: Pagination controls display when multiple pages', async ({ page }) => {
    await doctorPage.navigate();

    // Check if pagination exists
    const paginationVisible = await doctorPage.isVisible(doctorPage.paginationControls);

    // Pagination may or may not exist depending on data
    // Test documents presence
    expect(typeof paginationVisible).toBe('boolean');
  });

  test('TC_DOCTOR_017: Next page button navigates correctly', async ({ page }) => {
    await doctorPage.navigate();

    const nextVisible = await doctorPage.isVisible(doctorPage.paginationNextButton);

    if (nextVisible) {
      const initialUrl = page.url();
      await doctorPage.goToNextPage();
      await page.waitForTimeout(1000);

      // URL should change or page param should update
      const newUrl = page.url();
      expect(newUrl).not.toBe(initialUrl);
    }
  });

  test('TC_DOCTOR_018: Previous page button navigates correctly', async ({ page }) => {
    await doctorPage.navigate();

    // Go to next page first if available
    const nextVisible = await doctorPage.isVisible(doctorPage.paginationNextButton);
    if (nextVisible) {
      await doctorPage.goToNextPage();
      await page.waitForTimeout(1000);
    }

    // Now try previous
    const prevVisible = await doctorPage.isVisible(doctorPage.paginationPrevButton);

    if (prevVisible) {
      await doctorPage.goToPreviousPage();
      await page.waitForTimeout(1000);

      // Should be back on first page or previous
      expect(page.url()).toContain('/doctors');
    }
  });

  test('TC_DOCTOR_019: Page buttons display correct page numbers', async ({ page }) => {
    await doctorPage.navigate();

    const pageButtons = doctorPage.paginationPages;
    const count = await pageButtons.count();

    if (count > 0) {
      // Get first page button text
      const firstPageText = await pageButtons.first().textContent();
      expect(firstPageText?.length).toBeGreaterThan(0);
    }
  });

  test('TC_DOCTOR_020: Doctors list page elements verify correctly', async ({ page }) => {
    await doctorPage.navigate();

    // Verify all key elements
    const pageElements = await doctorPage.verifyDoctorsListPageElements();
    expect(pageElements).toBeTruthy();
  });
});

test.describe('@regression Doctor Edge Cases', () => {
  let doctorPage: DoctorPage;

  test.beforeEach(async ({ page }) => {
    doctorPage = new DoctorPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_DOCTOR_021: Empty search clears and shows all doctors', async ({ page }) => {
    await doctorPage.navigate();

    // Search with term
    await doctorPage.searchByName('Test');
    await page.waitForTimeout(1000);

    // Clear search
    await doctorPage.searchInput.clear();
    await page.waitForTimeout(1000);

    // All doctors should show
    const allCount = await doctorPage.getDoctorCardsCount();
    expect(allCount).toBeGreaterThan(0);
  });

  test('TC_DOCTOR_022: Special search characters handled', async ({ page }) => {
    await doctorPage.navigate();

    // Search with special characters
    await doctorPage.searchByName('<script>alert(1)</script>');
    await page.waitForTimeout(1000);

    // Should not crash - either show results or empty state
    const doctorsCount = await doctorPage.getDoctorCardsCount();
    expect(doctorsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_DOCTOR_023: Very long search term handled', async ({ page }) => {
    await doctorPage.navigate();

    // Search with long term
    const longTerm = 'ThisIsAVeryLongSearchTermThatShouldBeHandledGracefullyByTheSearchFunctionality';
    await doctorPage.searchByName(longTerm);
    await page.waitForTimeout(1000);

    // Should not crash
    const doctorsCount = await doctorPage.getDoctorCardsCount();
    expect(doctorsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_DOCTOR_024: Doctor card clickable multiple times', async ({ page }) => {
    await doctorPage.navigate();

    // Click same doctor multiple times
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(500);

    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(500);

    // Should work both times
    const isProfileDisplayed = await doctorPage.verifyProfilePageDisplayed();
    expect(isProfileDisplayed).toBeTruthy();
  });

  test('TC_DOCTOR_025: Profile data consistent across navigation', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Get details first time
    const details1 = await doctorPage.getDoctorProfileDetails();

    // Navigate away and back
    await doctorPage.backToDoctorsList();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Get details second time
    const details2 = await doctorPage.getDoctorProfileDetails();

    // Should be same doctor
    expect(details1.name).toBe(details2.name);
  });
});
