import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly signupLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In")');
    this.signupLink = page.locator('a:has-text("Sign Up"), a:has-text("Register")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password")');
    this.errorMessage = page.locator('.error-message, [role="alert"], .alert-error');
    this.successMessage = page.locator('.success-message, [role="status"], .alert-success');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"][name="rememberMe"]');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.goto('/auth');
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(email: string, password: string) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    
    if (await this.isVisible(this.rememberMeCheckbox)) {
      await this.clickElement(this.rememberMeCheckbox);
    }
    
    await this.clickElement(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    // Check if redirected to dashboard or home
    await this.wait(2000);
    const url = this.getCurrentUrl();
    return url.includes('/dashboard') || url.includes('/home') || !url.includes('/auth');
  }

  /**
   * Click signup link
   */
  async clickSignup() {
    await this.clickElement(this.signupLink);
    await this.waitForNavigation();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.clickElement(this.forgotPasswordLink);
    await this.waitForNavigation();
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.emailInput) && 
           await this.isVisible(this.passwordInput) && 
           await this.isVisible(this.loginButton);
  }
}
