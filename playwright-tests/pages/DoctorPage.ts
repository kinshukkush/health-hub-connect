import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Doctor Page Object Model
 * Handles doctor browsing, searching, and profile viewing functionality
 */
export class DoctorPage extends BasePage {
  // Locators
  readonly doctorListContainer: Locator;
  readonly doctorCards: Locator;
  readonly searchInput: Locator;
  readonly specializationDropdown: Locator;
  readonly specializationFilters: Locator;
  readonly sortByDropdown: Locator;
  readonly paginationControls: Locator;
  readonly paginationNextButton: Locator;
  readonly paginationPrevButton: Locator;
  readonly paginationPages: Locator;
  readonly doctorName: Locator;
  readonly doctorSpecialization: Locator;
  readonly doctorExperience: Locator;
  readonly doctorFees: Locator;
  readonly doctorEmail: Locator;
  readonly doctorPhone: Locator;
  readonly doctorBio: Locator;
  readonly bookAppointmentButton: Locator;
  readonly backToDoctorsButton: Locator;
  readonly emptyStateMessage: Locator;
  readonly resultsCount: Locator;

  constructor(page: Page) {
    super(page);

    // List view locators
    this.doctorListContainer = page.locator('[data-testid="doctor-list"], .doctor-list');
    this.doctorCards = page.locator('[data-testid="doctor-card"], .doctor-card');
    this.searchInput = page.locator('input[placeholder*="Search"], input[name="search"]');
    this.specializationDropdown = page.locator('select[name="specialization"]');
    this.specializationFilters = page.locator('button[role="checkbox"], .filter-checkbox');
    this.sortByDropdown = page.locator('select[name="sort"], select[aria-label*="sort"]');

    // Pagination locators
    this.paginationControls = page.locator('[role="navigation"][aria-label*="pagination"], .pagination');
    this.paginationNextButton = page.locator('button:has-text("Next"), [aria-label="Next Page"]');
    this.paginationPrevButton = page.locator('button:has-text("Previous"), [aria-label="Previous Page"]');
    this.paginationPages = page.locator('button[aria-label*="Page"], .page-button');

    // Profile locators
    this.doctorName = page.locator('[data-testid="doctor-name"], h1, .doctor-name');
    this.doctorSpecialization = page.locator('[data-testid="doctor-specialization"], .specialization');
    this.doctorExperience = page.locator('[data-testid="doctor-experience"], .experience');
    this.doctorFees = page.locator('[data-testid="doctor-fees"], .fees');
    this.doctorEmail = page.locator('[data-testid="doctor-email"], .email');
    this.doctorPhone = page.locator('[data-testid="doctor-phone"], .phone');
    this.doctorBio = page.locator('[data-testid="doctor-bio"], .bio, .about');
    this.bookAppointmentButton = page.locator('button:has-text("Book Appointment")');
    this.backToDoctorsButton = page.locator('button:has-text("Back"), button:has-text("All Doctors")');

    // State locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-state, :has-text("No doctors found")');
    this.resultsCount = page.locator('[data-testid="results-count"], .results-count');
  }

  /**
   * Navigate to doctors page
   */
  async navigate() {
    await this.goto('/doctors');
  }

  /**
   * Search doctors by name
   */
  async searchByName(name: string) {
    await this.fillInput(this.searchInput, name);
    await this.wait(1000);
  }

  /**
   * Filter doctors by specialization
   */
  async filterBySpecialization(specialization: string) {
    if (await this.isVisible(this.specializationDropdown)) {
      await this.selectOption(this.specializationDropdown, specialization);
      await this.wait(1000);
    }
  }

  /**
   * Sort doctors by fees
   */
  async sortByFees() {
    if (await this.isVisible(this.sortByDropdown)) {
      await this.selectOption(this.sortByDropdown, 'fees');
      await this.wait(1000);
    }
  }

  /**
   * Get all doctor cards
   */
  async getDoctorCardsCount(): Promise<number> {
    return await this.doctorCards.count();
  }

  /**
   * Click on doctor card
   */
  async clickDoctorCard(doctorName: string) {
    const doctorCard = this.page.locator('[data-testid="doctor-card"], .doctor-card')
      .filter({ hasText: doctorName });
    await this.clickElement(doctorCard);
    await this.waitForNavigation();
  }

  /**
   * Click first doctor card
   */
  async clickFirstDoctorCard() {
    await this.clickElement(this.doctorCards.first());
    await this.waitForNavigation();
  }

  /**
   * Get doctor profile details
   */
  async getDoctorProfileDetails(): Promise<{
    name: string;
    specialization: string;
    experience: string;
    fees: string;
  }> {
    return {
      name: await this.getText(this.doctorName),
      specialization: await this.getText(this.doctorSpecialization),
      experience: await this.getText(this.doctorExperience),
      fees: await this.getText(this.doctorFees)
    };
  }

  /**
   * Verify profile page is displayed
   */
  async verifyProfilePageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.doctorName) &&
           await this.isVisible(this.doctorSpecialization) &&
           await this.isVisible(this.bookAppointmentButton);
  }

  /**
   * Navigate back to doctors list
   */
  async backToDoctorsList() {
    await this.clickElement(this.backToDoctorsButton);
    await this.waitForNavigation();
  }

  /**
   * Go to next pagination page
   */
  async goToNextPage() {
    if (await this.isVisible(this.paginationNextButton)) {
      await this.clickElement(this.paginationNextButton);
      await this.waitForNavigation();
    }
  }

  /**
   * Go to previous pagination page
   */
  async goToPreviousPage() {
    if (await this.isVisible(this.paginationPrevButton)) {
      await this.clickElement(this.paginationPrevButton);
      await this.waitForNavigation();
    }
  }

  /**
   * Check if empty state is displayed
   */
  async isEmptyStateDisplayed(): Promise<boolean> {
    return await this.isVisible(this.emptyStateMessage);
  }

  /**
   * Get empty state message text
   */
  async getEmptyStateMessage(): Promise<string> {
    if (await this.isVisible(this.emptyStateMessage)) {
      return await this.getText(this.emptyStateMessage);
    }
    return '';
  }

  /**
   * Get results count text
   */
  async getResultsCount(): Promise<string> {
    if (await this.isVisible(this.resultsCount)) {
      return await this.getText(this.resultsCount);
    }
    return '';
  }

  /**
   * Select dropdown option
   */
  async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  /**
   * Verify doctors list page elements
   */
  async verifyDoctorsListPageElements(): Promise<boolean> {
    return await this.isVisible(this.searchInput) &&
           await this.isVisible(this.specializationDropdown) &&
           await this.isVisible(this.doctorCards.first());
  }
}
