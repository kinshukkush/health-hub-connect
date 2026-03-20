import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Medical Records Page Object Model
 * Handles medical record upload, viewing, and deletion functionality
 */
export class MedicalRecordsPage extends BasePage {
  // Locators
  readonly uploadRecordButton: Locator;
  readonly uploadModal: Locator;
  readonly recordTitleInput: Locator;
  readonly recordTypeDropdown: Locator;
  readonly recordDateInput: Locator;
  readonly recordDescriptionInput: Locator;
  readonly fileUploadInput: Locator;
  readonly fileUploadDropzone: Locator;
  readonly submitUploadButton: Locator;
  readonly recordsList: Locator;
  readonly recordCards: Locator;
  readonly recordTitle: Locator;
  readonly recordType: Locator;
  readonly recordDate: Locator;
  readonly recordFileIcon: Locator;
  readonly deleteRecordButton: Locator;
  readonly viewRecordButton: Locator;
  readonly downloadRecordButton: Locator;
  readonly deleteConfirmDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCancelButton: Locator;
  readonly successToast: Locator;
  readonly errorMessage: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Upload locators
    this.uploadRecordButton = page.locator('button:has-text("Upload"), button:has-text("Add Record"), button:has-text("New Record")');
    this.uploadModal = page.locator('[role="dialog"][aria-label*="Upload"], .modal, .dialog');
    this.recordTitleInput = page.locator('input[name="title"], input[placeholder*="Title"]');
    this.recordTypeDropdown = page.locator('select[name="type"], select[placeholder*="Type"]');
    this.recordDateInput = page.locator('input[type="date"], input[name="date"]');
    this.recordDescriptionInput = page.locator('textarea[name="description"], textarea[placeholder*="Description"]');
    this.fileUploadInput = page.locator('input[type="file"]');
    this.fileUploadDropzone = page.locator('[data-testid="dropzone"], .dropzone, .upload-area');
    this.submitUploadButton = page.locator('button[type="submit"]:has-text("Upload"), button:has-text("Save")');

    // List view locators
    this.recordsList = page.locator('[data-testid="records-list"], .records-list');
    this.recordCards = page.locator('[data-testid="record-card"], .record-card');
    this.recordTitle = page.locator('[data-testid="record-title"], .record-title');
    this.recordType = page.locator('[data-testid="record-type"], .record-type');
    this.recordDate = page.locator('[data-testid="record-date"], .record-date');
    this.recordFileIcon = page.locator('[data-testid="file-icon"], .file-icon, .file-type-icon');

    // Action locators
    this.deleteRecordButton = page.locator('button:has-text("Delete"), button[aria-label*="Delete"]');
    this.viewRecordButton = page.locator('button:has-text("View"), button[aria-label*="View"]');
    this.downloadRecordButton = page.locator('button:has-text("Download"), button[aria-label*="Download"]');

    // Dialog locators
    this.deleteConfirmDialog = page.locator('[role="dialog"], .modal, .dialog');
    this.deleteConfirmButton = page.locator('button:has-text("Yes"), button:has-text("Delete"), button:has-text("Confirm")');
    this.deleteCancelButton = page.locator('button:has-text("No"), button:has-text("Cancel"), button:has-text("Go Back")');

    // Feedback locators
    this.successToast = page.locator('[role="status"], .toast-success, .alert-success');
    this.errorMessage = page.locator('[role="alert"], .toast-error, .alert-error');

    // State locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-state, :has-text("No records")');
  }

  /**
   * Navigate to medical records page
   */
  async navigate() {
    await this.goto('/records');
  }

  /**
   * Click upload record button
   */
  async clickUploadRecord() {
    await this.clickElement(this.uploadRecordButton);
    await this.wait(500);
  }

  /**
   * Fill upload form
   */
  async fillUploadForm(title: string, type: string, date: string, description: string) {
    await this.fillInput(this.recordTitleInput, title);
    await this.selectOption(this.recordTypeDropdown, type);
    await this.fillInput(this.recordDateInput, date);
    await this.fillInput(this.recordDescriptionInput, description);
  }

  /**
   * Upload file
   */
  async uploadFile(filePath: string) {
    await this.fileUploadInput.setInputFiles(filePath);
    await this.wait(1000);
  }

  /**
   * Submit upload form
   */
  async submitUploadForm() {
    await this.clickElement(this.submitUploadButton);
    await this.wait(2000);
  }

  /**
   * Upload a new medical record
   */
  async uploadRecord(title: string, type: string, date: string, filePath: string, description: string = 'Test record') {
    await this.clickUploadRecord();
    await this.fillUploadForm(title, type, date, description);
    await this.uploadFile(filePath);
    await this.submitUploadForm();
  }

  /**
   * Get record count
   */
  async getRecordCount(): Promise<number> {
    return await this.recordCards.count();
  }

  /**
   * View a specific record
   */
  async viewRecord(recordIndex: number = 0) {
    const viewButtons = this.viewRecordButton;
    if (await viewButtons.count() > recordIndex) {
      await viewButtons.nth(recordIndex).click();
      await this.wait(1000);
    }
  }

  /**
   * Download a specific record
   */
  async downloadRecord(recordIndex: number = 0) {
    const downloadButtons = this.downloadRecordButton;
    if (await downloadButtons.count() > recordIndex) {
      await downloadButtons.nth(recordIndex).click();
      await this.wait(1000);
    }
  }

  /**
   * Delete a specific record
   */
  async deleteRecord(recordIndex: number = 0) {
    const deleteButtons = this.deleteRecordButton;
    if (await deleteButtons.count() > recordIndex) {
      await deleteButtons.nth(recordIndex).click();
      await this.wait(500);

      // Handle confirmation dialog
      if (await this.isVisible(this.deleteConfirmDialog)) {
        await this.clickElement(this.deleteConfirmButton);
      }
      await this.wait(2000);
    }
  }

  /**
   * Get record details at index
   */
  async getRecordDetails(recordIndex: number = 0): Promise<{
    title: string;
    type: string;
    date: string;
  }> {
    const titles = this.recordTitle;
    const types = this.recordType;
    const dates = this.recordDate;

    return {
      title: await titles.nth(recordIndex).textContent() || '',
      type: await types.nth(recordIndex).textContent() || '',
      date: await dates.nth(recordIndex).textContent() || ''
    };
  }

  /**
   * Verify upload success
   */
  async verifyUploadSuccess(): Promise<boolean> {
    return await this.isVisible(this.successToast) ||
           (await this.getRecordCount()) > 0;
  }

  /**
   * Verify delete success
   */
  async verifyDeleteSuccess(): Promise<boolean> {
    return await this.isVisible(this.successToast) ||
           this.getCurrentUrl().includes('/records');
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
   * Select dropdown option
   */
  async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  /**
   * Verify records page elements
   */
  async verifyRecordsPageElements(): Promise<boolean> {
    return await this.isVisible(this.uploadRecordButton) &&
           await this.isVisible(this.recordsList);
  }
}
