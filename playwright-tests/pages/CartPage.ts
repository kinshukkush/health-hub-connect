import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object Model
 * Handles shopping cart functionality
 */
export class CartPage extends BasePage {
  // Locators
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly cartItems: Locator;
  readonly cartItemCards: Locator;
  readonly emptyCartMessage: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly totalPrice: Locator;
  readonly subtotalPrice: Locator;
  readonly discountAmount: Locator;
  readonly quantityInput: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.cartIcon = page.locator('[aria-label="Cart"], button:has-text("Cart"), a[href*="cart"]');
    this.cartBadge = page.locator('.cart-badge, .badge, [data-testid="cart-count"]');
    this.cartItems = page.locator('.cart-items, [data-testid="cart-items"]');
    this.cartItemCards = page.locator('.cart-item, [data-testid="cart-item"]');
    this.emptyCartMessage = page.locator(':text("Cart is empty"), :text("No items in cart")');
    this.checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Proceed")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping"), a:has-text("Shop")');
    this.totalPrice = page.locator('.total-price, [data-testid="total-price"]');
    this.subtotalPrice = page.locator('.subtotal, [data-testid="subtotal"]');
    this.discountAmount = page.locator('.discount, [data-testid="discount"]');
    this.quantityInput = page.locator('input[type="number"], input[name="quantity"]');
    this.increaseQuantityButton = page.locator('button:has-text("+"), button[aria-label="Increase"]');
    this.decreaseQuantityButton = page.locator('button:has-text("-"), button[aria-label="Decrease"]');
    this.removeButton = page.locator('button:has-text("Remove"), button[aria-label="Remove"]');
  }

  /**
   * Navigate to cart page
   */
  async navigate() {
    await this.goto('/cart');
  }

  /**
   * Open cart via icon
   */
  async openCart() {
    await this.clickElement(this.cartIcon);
    await this.wait(1000);
  }

  /**
   * Get cart badge count
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.isVisible(this.cartBadge)) {
      const text = await this.getText(this.cartBadge);
      return parseInt(text) || 0;
    }
    return 0;
  }

  /**
   * Get number of items in cart
   */
  async getCartItemsCount(): Promise<number> {
    if (await this.isVisible(this.cartItemCards)) {
      return await this.cartItemCards.count();
    }
    return 0;
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCartMessage);
  }

  /**
   * Increase quantity of item
   */
  async increaseQuantity(itemIndex: number = 0) {
    const increaseBtn = this.cartItemCards.nth(itemIndex).locator('button:has-text("+"), button[aria-label="Increase"]');
    await this.clickElement(increaseBtn);
    await this.wait(1000);
  }

  /**
   * Decrease quantity of item
   */
  async decreaseQuantity(itemIndex: number = 0) {
    const decreaseBtn = this.cartItemCards.nth(itemIndex).locator('button:has-text("-"), button[aria-label="Decrease"]');
    await this.clickElement(decreaseBtn);
    await this.wait(1000);
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemIndex: number = 0) {
    const removeBtn = this.cartItemCards.nth(itemIndex).locator('button:has-text("Remove"), button[aria-label="Remove"]');
    await this.clickElement(removeBtn);
    await this.wait(1000);
  }

  /**
   * Get total price
   */
  async getTotalPrice(): Promise<string> {
    if (await this.isVisible(this.totalPrice)) {
      return await this.getText(this.totalPrice);
    }
    return '0';
  }

  /**
   * Click checkout button
   */
  async proceedToCheckout() {
    await this.clickElement(this.checkoutButton);
    await this.waitForNavigation();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    if (await this.isVisible(this.continueShoppingButton)) {
      await this.clickElement(this.continueShoppingButton);
      await this.waitForNavigation();
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart() {
    const itemCount = await this.getCartItemsCount();
    for (let i = itemCount - 1; i >= 0; i--) {
      await this.removeItem(0); // Always remove first item
    }
  }

  /**
   * Get item details
   */
  async getItemDetails(index: number = 0) {
    const item = this.cartItemCards.nth(index);
    const name = await item.locator('.item-name, h3, h4').textContent();
    const price = await item.locator('.price, [data-testid="price"]').textContent();
    const quantity = await item.locator('input[type="number"], .quantity').inputValue().catch(() => '1');
    
    return { name, price, quantity };
  }
}
