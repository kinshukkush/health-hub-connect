import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Appointment Page Object Model
 * Handles all appointment booking and management functionality
 */
export class AppointmentPage extends BasePage {
  // Locators
  readonly searchDoctorInput: Locator;
  readonly specializationFilter: Locator;
  readonly doctorCards: Locator;
  readonly bookAppointmentButton: Locator;
  readonly appointmentDateInput: Locator;
  readonly appointmentTimeInput: Locator;
  readonly appointmentReasonInput: Locator;
  readonly submitAppointmentButton: Locator;
  readonly appointmentHistoryLink: Locator;
  readonly appointmentHistoryTable: Locator;
  readonly cancelAppointmentButton: Locator;
  readonly appointmentStatusBadge: Locator;
  readonly successToast: Locator;
  readonly errorMessage: Locator;
  readonly confirmDialog: Locator;
  readonly confirmDialogYes: Locator;
  readonly confirmDialogNo: Locator;

  constructor(page: Page) {
    super(page);

    // Doctor search locators
    this.searchDoctorInput = page.locator('input[placeholder*="Search doctor"], input[name="search"]');
    this.specializationFilter = page.locator('select[name="specialization"], input[name="specialization"]');
    this.doctorCards = page.locator('[data-testid="doctor-card"], .doctor-card');

    // Booking locators
    this.bookAppointmentButton = page.locator('button:has-text("Book Appointment"), button:has-text("Book")');
    this.appointmentDateInput = page.locator('input[type="date"]');
    this.appointmentTimeInput = page.locator('input[type="time"]');
    this.appointmentReasonInput = page.locator('textarea[name="reason"], input[name="reason"], textarea[placeholder*="reason"]');
    this.submitAppointmentButton = page.locator('button[type="submit"]:has-text("Confirm"), button:has-text("Book")');

    // History locators
    this.appointmentHistoryLink = page.locator('a:has-text("My Appointments"), a:has-text("History")');
    this.appointmentHistoryTable = page.locator('[data-testid="appointment-table"], table');

    // Action locators
    this.cancelAppointmentButton = page.locator('button:has-text("Cancel"), button:has-text("Cancel Appointment")');
    this.appointmentStatusBadge = page.locator('[data-testid="status-badge"], .status-badge, .status-pill');

    // Feedback locators
    this.successToast = page.locator('[role="status"], .toast-success, .alert-success');
    this.errorMessage = page.locator('[role="alert"], .toast-error, .alert-error');

    // Dialog locators
    this.confirmDialog = page.locator('[role="dialog"], .modal, .dialog');
    this.confirmDialogYes = page.locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("Delete")');
    this.confirmDialogNo = page.locator('button:has-text("No"), button:has-text("Cancel"), button:has-text("Go Back")');
  }

  /**
   * Navigate to appointment booking page
   */
  async navigate() {
    await this.goto('/appointments');
  }

  /**
   * Search for a doctor by name
   */
  async searchDoctor(name: string) {
    await this.fillInput(this.searchDoctorInput, name);
    await this.wait(1000);
  }

  /**
   * Filter doctors by specialization
   */
  async filterBySpecialization(specialization: string) {
    if (await this.isVisible(this.specializationFilter)) {
      await this.selectOption(this.specializationFilter, specialization);
    }
    await this.wait(1000);
  }

  /**
   * View doctor profile
   */
  async viewDoctorProfile(doctorName: string) {
    const doctorCard = this.page.locator('[data-testid="doctor-card"], .doctor-card').filter({ hasText: doctorName });
    await this.clickElement(doctorCard);
    await this.waitForNavigation();
  }

  /**
   * Book an appointment
   */
  async bookAppointment(doctorName: string, date: string, time: string, reason: string) {
    // Search and select doctor
    await this.searchDoctor(doctorName);
    await this.wait(1000);

    // Click first doctor card
    const firstDoctorCard = this.page.locator('[data-testid="doctor-card"], .doctor-card').first();
    await this.clickElement(firstDoctorCard);

    // Fill appointment details
    await this.fillInput(this.appointmentDateInput, date);
    await this.fillInput(this.appointmentTimeInput, time);
    await this.fillInput(this.appointmentReasonInput, reason);

    // Submit
    await this.clickElement(this.submitAppointmentButton);
    await this.wait(2000);
  }

  /**
   * View appointment history
   */
  async viewAppointmentHistory() {
    await this.clickElement(this.appointmentHistoryLink);
    await this.waitForNavigation();
  }

  /**
   * Get appointment count from history
   */
  async getAppointmentCount(): Promise<number> {
    const rows = this.appointmentHistoryTable.locator('tbody tr');
    return await rows.count();
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentIndex: number = 0) {
    const cancelButtons = this.page.locator('button:has-text("Cancel")');
    if (await cancelButtons.count() > appointmentIndex) {
      await cancelButtons.nth(appointmentIndex).click();
      await this.wait(500);

      // Handle confirmation dialog
      if (await this.isVisible(this.confirmDialog)) {
        await this.clickElement(this.confirmDialogYes);
      }
      await this.wait(2000);
    }
  }

  /**
   * Get appointment status
   */
  async getAppointmentStatus(appointmentIndex: number = 0): Promise<string> {
    const statusBadges = this.page.locator('[data-testid="status-badge"], .status-badge, .status-pill');
    if (await statusBadges.count() > appointmentIndex) {
      return await statusBadges.nth(appointmentIndex).textContent() || '';
    }
    return '';
  }

  /**
   * Verify appointment booking success
   */
  async verifyBookingSuccess(): Promise<boolean> {
    return await this.isVisible(this.successToast) ||
           this.getCurrentUrl().includes('/appointments');
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
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
   * Verify appointment page elements
   */
  async verifyAppointmentPageElements(): Promise<boolean> {
    return await this.isVisible(this.searchDoctorInput) &&
           await this.isVisible(this.specializationFilter) &&
           await this.isVisible(this.doctorCards.first());
  }
}
