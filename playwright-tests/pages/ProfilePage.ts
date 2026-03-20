import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Profile Page Object Model
 * Handles user profile viewing and editing functionality
 */
export class ProfilePage extends BasePage {
  // Locators
  readonly profileContainer: Locator;
  readonly profileImage: Locator;
  readonly profileImageUpload: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countryInput: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly changePasswordButton: Locator;
  readonly editProfileButton: Locator;
  readonly cancelPasswordButton: Locator;
  readonly accountStats: Locator;
  readonly totalAppointmentsStat: Locator;
  readonly totalRecordsStat: Locator;
  readonly memberSinceStat: Locator;
  readonly successToast: Locator;
  readonly errorMessage: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    super(page);

    // Profile container
    this.profileContainer = page.locator('[data-testid="profile-container"], .profile-container');

    // Image locators
    this.profileImage = page.locator('[data-testid="profile-image"], .profile-image, img[alt*="Profile"]');
    this.profileImageUpload = page.locator('input[type="file"][accept*="image"]');

    // Form inputs
    this.nameInput = page.locator('input[name="name"], input[placeholder*="Name"]');
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.phoneInput = page.locator('input[name="phone"], input[type="tel"]');
    this.addressInput = page.locator('input[name="address"], input[placeholder*="Address"], textarea[name="address"]');
    this.cityInput = page.locator('input[name="city"], input[placeholder*="City"]');
    this.stateInput = page.locator('input[name="state"], input[placeholder*="State"]');
    this.zipInput = page.locator('input[name="zip"], input[placeholder*="ZIP"], input[placeholder*="Postal"]');
    this.countryInput = page.locator('input[name="country"], input[placeholder*="Country"]');

    // Password inputs
    this.currentPasswordInput = page.locator('input[name="currentPassword"], input[placeholder*="Current"]');
    this.newPasswordInput = page.locator('input[name="newPassword"], input[placeholder*="New"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm"]');

    // Buttons
    this.saveButton = page.locator('button[type="submit"]:has-text("Save"), button:has-text("Update")');
    this.changePasswordButton = page.locator('button:has-text("Change Password"), button:has-text("Update Password")');
    this.editProfileButton = page.locator('button:has-text("Edit"), button:has-text("Edit Profile")');
    this.cancelPasswordButton = page.locator('button:has-text("Cancel"), button:has-text("Go Back")');

    // Stats locators
    this.accountStats = page.locator('[data-testid="account-stats"], .stats-container');
    this.totalAppointmentsStat = page.locator('[data-testid="total-appointments"], .stat:has-text("Appointments")');
    this.totalRecordsStat = page.locator('[data-testid="total-records"], .stat:has-text("Records")');
    this.memberSinceStat = page.locator('[data-testid="member-since"], .stat:has-text("Member")');

    // Feedback locators
    this.successToast = page.locator('[role="status"], .toast-success, .alert-success');
    this.errorMessage = page.locator('[role="alert"], .toast-error, .alert-error');
    this.validationError = page.locator('.field-error, .validation-error, [data-testid="error"]');
  }

  /**
   * Navigate to profile page
   */
  async navigate() {
    await this.goto('/profile');
  }

  /**
   * Get profile data
   */
  async getProfileData(): Promise<{
    name: string;
    email: string;
    phone: string;
  }> {
    return {
      name: await this.nameInput.inputValue(),
      email: await this.emailInput.inputValue(),
      phone: await this.isVisible(this.phoneInput) ? await this.phoneInput.inputValue() : ''
    };
  }

  /**
   * Update profile information
   */
  async updateProfile(name: string, phone: string, address: string) {
    if (await this.isVisible(this.nameInput)) {
      await this.fillInput(this.nameInput, name);
    }

    if (await this.isVisible(this.phoneInput)) {
      await this.fillInput(this.phoneInput, phone);
    }

    if (await this.isVisible(this.addressInput)) {
      await this.fillInput(this.addressInput, address);
    }

    await this.clickElement(this.saveButton);
    await this.wait(2000);
  }

  /**
   * Update address fields
   */
  async updateAddress(address: string, city: string, state: string, zip: string, country: string) {
    if (await this.isVisible(this.addressInput)) {
      await this.fillInput(this.addressInput, address);
    }
    if (await this.isVisible(this.cityInput)) {
      await this.fillInput(this.cityInput, city);
    }
    if (await this.isVisible(this.stateInput)) {
      await this.fillInput(this.stateInput, state);
    }
    if (await this.isVisible(this.zipInput)) {
      await this.fillInput(this.zipInput, zip);
    }
    if (await this.isVisible(this.countryInput)) {
      await this.fillInput(this.countryInput, country);
    }

    await this.clickElement(this.saveButton);
    await this.wait(2000);
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    await this.fillInput(this.currentPasswordInput, currentPassword);
    await this.fillInput(this.newPasswordInput, newPassword);
    await this.fillInput(this.confirmPasswordInput, confirmPassword);

    await this.clickElement(this.saveButton);
    await this.wait(2000);
  }

  /**
   * Click change password button
   */
  async clickChangePassword() {
    await this.clickElement(this.changePasswordButton);
    await this.wait(500);
  }

  /**
   * Get account stats
   */
  async getAccountStats(): Promise<{
    totalAppointments: string;
    totalRecords: string;
    memberSince: string;
  }> {
    return {
      totalAppointments: await this.getText(this.totalAppointmentsStat),
      totalRecords: await this.getText(this.totalRecordsStat),
      memberSince: await this.getText(this.memberSinceStat)
    };
  }

  /**
   * Verify update success
   */
  async verifyUpdateSuccess(): Promise<boolean> {
    return await this.isVisible(this.successToast);
  }

  /**
   * Verify password change with wrong current password fails
   */
  async verifyPasswordChangeFailed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage) ||
           await this.isVisible(this.validationError);
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
   * Verify profile page elements
   */
  async verifyProfilePageElements(): Promise<boolean> {
    return await this.isVisible(this.profileContainer) &&
           await this.isVisible(this.nameInput) &&
           await this.isVisible(this.emailInput) &&
           await this.isVisible(this.saveButton);
  }
}
