import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object Model
 * Handles user dashboard functionality
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly welcomeMessage: Locator;
  readonly userNameDisplay: Locator;
  readonly statsCards: Locator;
  readonly appointmentsSection: Locator;
  readonly ordersSection: Locator;
  readonly medicalRecordsSection: Locator;
  readonly quickActions: Locator;
  readonly navigationMenu: Locator;
  readonly logoutButton: Locator;
  readonly profileButton: Locator;
  readonly settingsButton: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    super(page);
    
    this.welcomeMessage = page.locator('.welcome, h1:has-text("Welcome")');
    this.userNameDisplay = page.locator('.user-name, [data-testid="user-name"]');
    this.statsCards = page.locator('.stat-card, [data-testid="stat-card"]');
    this.appointmentsSection = page.locator('.appointments-section, [data-testid="appointments"]');
    this.ordersSection = page.locator('.orders-section, [data-testid="orders"]');
    this.medicalRecordsSection = page.locator('.records-section, [data-testid="records"]');
    this.quickActions = page.locator('.quick-actions, [data-testid="quick-actions"]');
    this.navigationMenu = page.locator('nav, .navigation');
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out")');
    this.profileButton = page.locator('button:has-text("Profile"), a[href*="profile"]');
    this.settingsButton = page.locator('button:has-text("Settings"), a[href*="settings"]');
    this.themeToggle = page.locator('button[aria-label*="theme"], [data-testid="theme-toggle"]');
  }

  /**
   * Navigate to dashboard
   */
  async navigate() {
    await this.goto('/dashboard');
  }

  /**
   * Check if user is logged in (dashboard visible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    const url = this.getCurrentUrl();
    return url.includes('/dashboard') || await this.isVisible(this.welcomeMessage);
  }

  /**
   * Get user name from dashboard
   */
  async getUserName(): Promise<string> {
    if (await this.isVisible(this.userNameDisplay)) {
      return await this.getText(this.userNameDisplay);
    }
    return '';
  }

  /**
   * Logout user
   */
  async logout() {
    // Try to find and click logout button
    if (await this.isVisible(this.logoutButton)) {
      await this.clickElement(this.logoutButton);
    } else {
      // Try clicking profile menu first
      if (await this.isVisible(this.profileButton)) {
        await this.clickElement(this.profileButton);
        await this.wait(1000);
        await this.clickElement(this.logoutButton);
      }
    }
    await this.waitForNavigation();
  }

  /**
   * Navigate to settings
   */
  async goToSettings() {
    await this.clickElement(this.settingsButton);
    await this.waitForNavigation();
  }

  /**
   * Toggle theme
   */
  async toggleTheme() {
    if (await this.isVisible(this.themeToggle)) {
      await this.clickElement(this.themeToggle);
      await this.wait(500);
    }
  }

  /**
   * Navigate to specific section via menu
   */
  async navigateToSection(sectionName: string) {
    const link = this.navigationMenu.locator(`a:has-text("${sectionName}")`);
    if (await this.isVisible(link)) {
      await this.clickElement(link);
      await this.waitForNavigation();
    }
  }

  /**
   * Get statistics count
   */
  async getStatValue(statName: string): Promise<string> {
    const statCard = this.page.locator(`.stat-card:has-text("${statName}"), [data-testid="stat-${statName}"]`);
    if (await this.isVisible(statCard)) {
      const value = await statCard.locator('.stat-value, .count').textContent();
      return value || '0';
    }
    return '0';
  }

  /**
   * Check if dashboard sections are visible
   */
  async areDashboardSectionsVisible(): Promise<boolean> {
    // Wait for page to load
    await this.wait(2000);
    
    // Check if at least welcome message or stats are visible
    return await this.isVisible(this.welcomeMessage) || 
           await this.isVisible(this.statsCards);
  }
}
