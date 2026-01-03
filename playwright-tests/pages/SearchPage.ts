import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Search Page Object Model
 * Handles medicine search functionality
 */
export class SearchPage extends BasePage {
  // Locators
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly searchResultCards: Locator;
  readonly noResultsMessage: Locator;
  readonly filterButton: Locator;
  readonly priceFilter: Locator;
  readonly categoryFilter: Locator;
  readonly availabilityFilter: Locator;
  readonly sortDropdown: Locator;
  readonly autoSuggestions: Locator;

  constructor(page: Page) {
    super(page);
    
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    this.searchButton = page.locator('button:has-text("Search"), button[type="submit"]');
    this.searchResults = page.locator('.search-results, .medicine-list, [data-testid="search-results"]');
    this.searchResultCards = page.locator('.medicine-card, .product-card, [data-testid="medicine-card"]');
    this.noResultsMessage = page.locator(':text("No results"), :text("No medicines found")');
    this.filterButton = page.locator('button:has-text("Filter")');
    this.priceFilter = page.locator('input[name="priceRange"], select[name="price"]');
    this.categoryFilter = page.locator('select[name="category"], input[name="category"]');
    this.availabilityFilter = page.locator('input[name="availability"], select[name="availability"]');
    this.sortDropdown = page.locator('select[name="sort"], [data-testid="sort-dropdown"]');
    this.autoSuggestions = page.locator('.suggestions, .autocomplete, [role="listbox"]');
  }

  /**
   * Navigate to search/doctors page
   */
  async navigate() {
    await this.goto('/doctors');
  }

  /**
   * Search for medicine
   */
  async searchMedicine(medicineName: string) {
    await this.fillInput(this.searchInput, medicineName);
    
    // Check if search button exists, otherwise press Enter
    if (await this.isVisible(this.searchButton)) {
      await this.clickElement(this.searchButton);
    } else {
      await this.searchInput.press('Enter');
    }
    
    await this.wait(2000);
  }

  /**
   * Get search results count
   */
  async getResultsCount(): Promise<number> {
    if (await this.isVisible(this.searchResultCards)) {
      return await this.searchResultCards.count();
    }
    return 0;
  }

  /**
   * Check if no results message is displayed
   */
  async isNoResultsDisplayed(): Promise<boolean> {
    return await this.isVisible(this.noResultsMessage);
  }

  /**
   * Get first search result
   */
  async getFirstResult(): Promise<Locator> {
    return this.searchResultCards.first();
  }

  /**
   * Click on specific search result
   */
  async clickResult(index: number = 0) {
    await this.searchResultCards.nth(index).click();
    await this.waitForNavigation();
  }

  /**
   * Apply price filter
   */
  async applyPriceFilter(min: string, max: string) {
    if (await this.isVisible(this.priceFilter)) {
      // Implementation depends on filter UI
      await this.clickElement(this.filterButton);
      await this.wait(1000);
    }
  }

  /**
   * Apply category filter
   */
  async applyCategoryFilter(category: string) {
    if (await this.isVisible(this.categoryFilter)) {
      await this.categoryFilter.selectOption(category);
      await this.wait(1000);
    }
  }

  /**
   * Check if auto-suggestions appear
   */
  async areAutoSuggestionsVisible(): Promise<boolean> {
    return await this.isVisible(this.autoSuggestions);
  }

  /**
   * Type in search and wait for suggestions
   */
  async typeAndWaitForSuggestions(text: string) {
    await this.searchInput.type(text, { delay: 100 });
    await this.wait(500);
    return await this.areAutoSuggestionsVisible();
  }

  /**
   * Get medicine details from card
   */
  async getMedicineDetails(index: number = 0) {
    const card = this.searchResultCards.nth(index);
    const name = await card.locator('.medicine-name, h3, h4').textContent();
    const price = await card.locator('.price, [data-testid="price"]').textContent();
    return { name, price };
  }

  /**
   * Verify search results contain keyword
   */
  async doResultsContainKeyword(keyword: string): Promise<boolean> {
    const count = await this.getResultsCount();
    if (count === 0) return false;
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const details = await this.getMedicineDetails(i);
      if (details.name?.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
}
