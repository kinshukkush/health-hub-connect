import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Admin Dashboard Page Object Model
 * Handles admin dashboard, user management, and appointment approval functionality
 */
export class AdminPage extends BasePage {
  // Locators
  readonly dashboardStats: Locator;
  readonly totalUsersStat: Locator;
  readonly totalDoctorsStat: Locator;
  readonly totalAppointmentsStat: Locator;
  readonly totalRevenueStat: Locator;
  readonly usersTable: Locator;
  readonly usersTableRows: Locator;
  readonly doctorsTable: Locator;
  readonly doctorsTableRows: Locator;
  readonly appointmentsTable: Locator;
  readonly appointmentsTableRows: Locator;
  readonly productsTable: Locator;
  readonly productsTableRows: Locator;
  readonly userRoleDropdown: Locator;
  readonly userDeleteButton: Locator;
  readonly appointmentStatusDropdown: Locator;
  readonly appointmentApproveButton: Locator;
  readonly appointmentRejectButton: Locator;
  readonly addDoctorButton: Locator;
  readonly addProductButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly sidebarNav: Locator;
  readonly sidebarLinks: Locator;
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;
  readonly confirmDialog: Locator;
  readonly confirmDialogYes: Locator;
  readonly confirmDialogNo: Locator;
  readonly successToast: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Dashboard stats locators
    this.dashboardStats = page.locator('[data-testid="stats-container"], .stats-grid');
    this.totalUsersStat = page.locator('[data-testid="total-users"], .stat-card:has-text("Users")');
    this.totalDoctorsStat = page.locator('[data-testid="total-doctors"], .stat-card:has-text("Doctors")');
    this.totalAppointmentsStat = page.locator('[data-testid="total-appointments"], .stat-card:has-text("Appointments")');
    this.totalRevenueStat = page.locator('[data-testid="total-revenue"], .stat-card:has-text("Revenue")');

    // Table locators
    this.usersTable = page.locator('[data-testid="users-table"], table:has(th:has-text("User"))');
    this.usersTableRows = this.usersTable.locator('tbody tr');
    this.doctorsTable = page.locator('[data-testid="doctors-table"], table:has(th:has-text("Doctor"))');
    this.doctorsTableRows = this.doctorsTable.locator('tbody tr');
    this.appointmentsTable = page.locator('[data-testid="appointments-table"], table:has(th:has-text("Appointment"))');
    this.appointmentsTableRows = this.appointmentsTable.locator('tbody tr');
    this.productsTable = page.locator('[data-testid="products-table"], table:has(th:has-text("Product"))');
    this.productsTableRows = this.productsTable.locator('tbody tr');

    // Action locators
    this.userRoleDropdown = page.locator('select[name="role"], select[aria-label*="role"]');
    this.userDeleteButton = page.locator('button:has-text("Delete"):not(:has-text("Cancel"))');
    this.appointmentStatusDropdown = page.locator('select[name="status"], select[aria-label*="status"]');
    this.appointmentApproveButton = page.locator('button:has-text("Approve"), button:has-text("Approved")');
    this.appointmentRejectButton = page.locator('button:has-text("Reject"), button:has-text("Rejected")');
    this.addDoctorButton = page.locator('button:has-text("Add Doctor"), button:has-text("New Doctor")');
    this.addProductButton = page.locator('button:has-text("Add Product"), button:has-text("New Product")');
    this.editButton = page.locator('button:has-text("Edit"), button[aria-label*="Edit"]');
    this.deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="Delete"]');

    // Navigation locators
    this.sidebarNav = page.locator('[data-testid="sidebar"], nav, .sidebar');
    this.sidebarLinks = this.sidebarNav.locator('a, button');
    this.searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    this.filterDropdown = page.locator('select[name="filter"], select[aria-label*="filter"]');

    // Dialog locators
    this.confirmDialog = page.locator('[role="dialog"], .modal, .dialog');
    this.confirmDialogYes = page.locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("Delete")');
    this.confirmDialogNo = page.locator('button:has-text("No"), button:has-text("Cancel"), button:has-text("Go Back")');

    // Feedback locators
    this.successToast = page.locator('[role="status"], .toast-success, .alert-success');
    this.errorMessage = page.locator('[role="alert"], .toast-error, .alert-error');
  }

  /**
   * Navigate to admin dashboard
   */
  async navigate() {
    await this.goto('/admin');
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats(): Promise<{
    totalUsers: string;
    totalDoctors: string;
    totalAppointments: string;
    totalRevenue: string;
  }> {
    return {
      totalUsers: await this.getText(this.totalUsersStat),
      totalDoctors: await this.getText(this.totalDoctorsStat),
      totalAppointments: await this.getText(this.totalAppointmentsStat),
      totalRevenue: await this.getText(this.totalRevenueStat)
    };
  }

  /**
   * Get users table row count
   */
  async getUsersCount(): Promise<number> {
    return await this.usersTableRows.count();
  }

  /**
   * Get doctors table row count
   */
  async getDoctorsCount(): Promise<number> {
    return await this.doctorsTableRows.count();
  }

  /**
   * Get appointments table row count
   */
  async getAppointmentsCount(): Promise<number> {
    return await this.appointmentsTableRows.count();
  }

  /**
   * Update user role
   */
  async updateUserRole(userIndex: number = 0, role: string) {
    const roleDropdowns = this.userRoleDropdown;
    if (await roleDropdowns.count() > userIndex) {
      await roleDropdowns.nth(userIndex).selectOption(role);
      await this.wait(1000);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userIndex: number = 0) {
    const deleteButtons = this.userDeleteButton;
    if (await deleteButtons.count() > userIndex) {
      await deleteButtons.nth(userIndex).click();
      await this.wait(500);

      // Handle confirmation dialog
      if (await this.isVisible(this.confirmDialog)) {
        await this.clickElement(this.confirmDialogYes);
      }
      await this.wait(2000);
    }
  }

  /**
   * Approve appointment
   */
  async approveAppointment(appointmentIndex: number = 0) {
    const approveButtons = this.appointmentApproveButton;
    if (await approveButtons.count() > appointmentIndex) {
      await approveButtons.nth(appointmentIndex).click();
      await this.wait(2000);
    }
  }

  /**
   * Reject appointment
   */
  async rejectAppointment(appointmentIndex: number = 0) {
    const rejectButtons = this.appointmentRejectButton;
    if (await rejectButtons.count() > appointmentIndex) {
      await rejectButtons.nth(appointmentIndex).click();
      await this.wait(2000);
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(appointmentIndex: number = 0, status: string) {
    const statusDropdowns = this.appointmentStatusDropdown;
    if (await statusDropdowns.count() > appointmentIndex) {
      await statusDropdowns.nth(appointmentIndex).selectOption(status);
      await this.wait(1000);
    }
  }

  /**
   * Search in admin table
   */
  async search(searchTerm: string) {
    await this.fillInput(this.searchInput, searchTerm);
    await this.wait(1000);
  }

  /**
   * Filter admin table
   */
  async filterBy(filterValue: string) {
    if (await this.isVisible(this.filterDropdown)) {
      await this.filterDropdown.selectOption(filterValue);
      await this.wait(1000);
    }
  }

  /**
   * Click sidebar navigation link
   */
  async clickSidebarLink(linkText: string) {
    const link = this.sidebarLinks.filter({ hasText: linkText });
    await this.clickElement(link);
    await this.waitForNavigation();
  }

  /**
   * Verify admin dashboard elements
   */
  async verifyDashboardElements(): Promise<boolean> {
    return await this.isVisible(this.dashboardStats) &&
           await this.isVisible(this.sidebarNav);
  }

  /**
   * Verify users table is displayed
   */
  async verifyUsersTableDisplayed(): Promise<boolean> {
    return await this.isVisible(this.usersTable);
  }

  /**
   * Verify appointments table is displayed
   */
  async verifyAppointmentsTableDisplayed(): Promise<boolean> {
    return await this.isVisible(this.appointmentsTable);
  }

  /**
   * Get success toast visibility
   */
  async verifySuccessToast(): Promise<boolean> {
    return await this.isVisible(this.successToast);
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
}
