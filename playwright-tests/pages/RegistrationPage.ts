import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Registration Page Object Model
 * Handles user registration functionality
 */
export class RegistrationPage extends BasePage {
  // Locators
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    this.nameInput = page.locator('input[name="name"], input[placeholder*="Name"]');
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.phoneInput = page.locator('input[type="tel"], input[name="phone"]');
    this.passwordInput = page.locator('input[name="password"]:not([name="confirmPassword"])').first();
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm"]');
    this.registerButton = page.locator('button[type="submit"]:has-text("Register"), button:has-text("Sign Up")');
    this.loginLink = page.locator('a:has-text("Login"), a:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, [role="alert"], .alert-error');
    this.successMessage = page.locator('.success-message, [role="status"], .alert-success');
    this.termsCheckbox = page.locator('input[type="checkbox"][name="terms"]');
  }

  /**
   * Navigate to registration page
   */
  async navigate() {
    await this.goto('/auth');
    // Click signup/register tab if exists
    const signupTab = this.page.locator('button:has-text("Sign Up"), [role="tab"]:has-text("Register")');
    if (await this.isVisible(signupTab)) {
      await this.clickElement(signupTab);
    }
  }

  /**
   * Register new user
   */
  async register(name: string, email: string, phone: string, password: string, confirmPassword: string) {
    await this.fillInput(this.nameInput, name);
    await this.fillInput(this.emailInput, email);
    
    if (await this.isVisible(this.phoneInput)) {
      await this.fillInput(this.phoneInput, phone);
    }
    
    await this.fillInput(this.passwordInput, password);
    
    if (await this.isVisible(this.confirmPasswordInput)) {
      await this.fillInput(this.confirmPasswordInput, confirmPassword);
    }
    
    // Accept terms if checkbox exists
    if (await this.isVisible(this.termsCheckbox)) {
      await this.clickElement(this.termsCheckbox);
    }
    
    await this.clickElement(this.registerButton);
    await this.wait(2000);
  }

  /**
   * Quick register with default values
   */
  async quickRegister(email: string, password: string) {
    await this.register('Test User', email, '+1234567890', password, password);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if registration was successful
   */
  async isRegistrationSuccessful(): Promise<boolean> {
    const url = this.getCurrentUrl();
    return url.includes('/dashboard') || 
           url.includes('/home') || 
           await this.isVisible(this.successMessage);
  }

  /**
   * Click login link
   */
  async clickLogin() {
    await this.clickElement(this.loginLink);
    await this.waitForNavigation();
  }
}
