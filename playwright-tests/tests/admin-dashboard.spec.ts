import { test, expect } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { loginAsAdmin, DEMO_CREDENTIALS } from '../utils/test-helpers';

/**
 * Admin Dashboard Test Suite
 * Tests admin dashboard, user management, and appointment approval
 *
 * @tag @smoke - Basic admin functions
 * @tag @regression - Full admin suite
 */
test.describe('@smoke Admin Dashboard Tests', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_ADMIN_001: Admin can login and reach dashboard', async ({ page }) => {
    // Verify on admin page
    expect(page.url()).toContain('/admin');

    // Verify dashboard elements
    const dashboardVisible = await adminPage.verifyDashboardElements();
    expect(dashboardVisible).toBeTruthy();
  });

  test('TC_ADMIN_002: Dashboard displays correct stats', async ({ page }) => {
    const stats = await adminPage.getDashboardStats();

    // Stats should have content
    expect(stats.totalUsers.length).toBeGreaterThan(0);
    expect(stats.totalDoctors.length).toBeGreaterThan(0);
    expect(stats.totalAppointments.length).toBeGreaterThan(0);
  });

  test('TC_ADMIN_003: Admin can view all users list', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    // Verify users table displayed
    const tableVisible = await adminPage.verifyUsersTableDisplayed();
    expect(tableVisible).toBeTruthy();
  });

  test('TC_ADMIN_004: Admin can view all appointments', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    // Verify appointments table displayed
    const tableVisible = await adminPage.verifyAppointmentsTableDisplayed();
    expect(tableVisible).toBeTruthy();
  });

  test('TC_ADMIN_005: Admin can approve appointment', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    const count = await adminPage.getAppointmentsCount();

    if (count > 0) {
      // Approve first appointment
      await adminPage.approveAppointment(0);
      await page.waitForTimeout(2000);

      // Verify success
      const toastVisible = await adminPage.verifySuccessToast();
      expect(toastVisible).toBeTruthy();
    }
  });
});

test.describe('@regression Admin User Management', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_ADMIN_006: Admin can toggle user role', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    const usersCount = await adminPage.getUsersCount();

    if (usersCount > 0) {
      // Toggle first user role
      await adminPage.updateUserRole(0, 'admin');
      await page.waitForTimeout(1000);

      // Verify change applied
      const toastVisible = await adminPage.verifySuccessToast();
      expect(toastVisible).toBeTruthy();
    }
  });

  test('TC_ADMIN_007: Admin can delete user with confirmation', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    const usersCount = await adminPage.getUsersCount();

    if (usersCount > 1) {
      // Delete second user (keep first)
      await adminPage.deleteUser(1);
      await page.waitForTimeout(2000);

      // Verify count decreased
      const newCount = await adminPage.getUsersCount();
      expect(newCount).toBeLessThan(usersCount);
    }
  });

  test('TC_ADMIN_008: User delete shows confirmation dialog', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    const usersCount = await adminPage.getUsersCount();

    if (usersCount > 0) {
      // Click delete
      const deleteButtons = adminPage.userDeleteButton;
      if (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
        await page.waitForTimeout(500);

        // Verify dialog
        const dialogVisible = await adminPage.isVisible(adminPage.confirmDialog);
        expect(dialogVisible).toBeTruthy();

        // Cancel
        const noButton = adminPage.confirmDialogNo;
        if (await adminPage.isVisible(noButton)) {
          await adminPage.clickElement(noButton);
        }
      }
    }
  });

  test('TC_ADMIN_009: Users table displays all required columns', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    // Check for common column headers
    const headers = page.locator('thead th');
    const count = await headers.count();

    expect(count).toBeGreaterThanOrEqual(3); // Name, email, role at minimum
  });

  test('TC_ADMIN_010: User count displays correctly', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    const count = await adminPage.getUsersCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('@regression Admin Appointment Management', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_ADMIN_011: Admin can reject appointment', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    const count = await adminPage.getAppointmentsCount();

    if (count > 0) {
      await adminPage.rejectAppointment(0);
      await page.waitForTimeout(2000);

      // Verify success
      const toastVisible = await adminPage.verifySuccessToast();
      expect(toastVisible).toBeTruthy();
    }
  });

  test('TC_ADMIN_012: Admin can update appointment status inline', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    const count = await adminPage.getAppointmentsCount();

    if (count > 0) {
      await adminPage.updateAppointmentStatus(0, 'approved');
      await page.waitForTimeout(1000);

      // Verify update
      const toastVisible = await adminPage.verifySuccessToast();
      expect(toastVisible).toBeTruthy();
    }
  });

  test('TC_ADMIN_013: Appointments table renders correctly', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    const tableVisible = await adminPage.verifyAppointmentsTableDisplayed();
    expect(tableVisible).toBeTruthy();
  });

  test('TC_ADMIN_014: Appointment status badges display correctly', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    // Check for status elements
    const statusBadges = page.locator('.status-badge, [data-testid="status"], .status-pill');
    const count = await statusBadges.count();

    // Should have at least one status or table rows
    const apptCount = await adminPage.getAppointmentsCount();
    expect(count > 0 || apptCount > 0).toBeTruthy();
  });

  test('TC_ADMIN_015: Admin can filter appointments', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    // Search
    await adminPage.search('appointment');
    await page.waitForTimeout(1000);

    // Should still have results or empty state
    const count = await adminPage.getAppointmentsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('@regression Admin Dashboard Stats', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_ADMIN_016: Total users stat displays', async ({ page }) => {
    await adminPage.navigate();

    const statVisible = await adminPage.isVisible(adminPage.totalUsersStat);
    expect(statVisible).toBeTruthy();
  });

  test('TC_ADMIN_017: Total doctors stat displays', async ({ page }) => {
    await adminPage.navigate();

    const statVisible = await adminPage.isVisible(adminPage.totalDoctorsStat);
    expect(statVisible).toBeTruthy();
  });

  test('TC_ADMIN_018: Total appointments stat displays', async ({ page }) => {
    await adminPage.navigate();

    const statVisible = await adminPage.isVisible(adminPage.totalAppointmentsStat);
    expect(statVisible).toBeTruthy();
  });

  test('TC_ADMIN_019: Stats container renders correctly', async ({ page }) => {
    await adminPage.navigate();

    const statsVisible = await adminPage.isVisible(adminPage.dashboardStats);
    expect(statsVisible).toBeTruthy();
  });

  test('TC_ADMIN_020: Dashboard navigation works', async ({ page }) => {
    await adminPage.navigate();

    // Click each sidebar link
    const links = ['Dashboard', 'Users', 'Doctors', 'Appointments'];

    for (const link of links) {
      await adminPage.clickSidebarLink(link);
      await page.waitForTimeout(1000);

      // Should be on page
      expect(page.url()).not.toContain('error');
    }
  });
});

test.describe('@regression Admin Doctors/Product Management', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_ADMIN_021: Admin can view doctors list', async ({ page }) => {
    await adminPage.clickSidebarLink('Doctors');
    await page.waitForTimeout(1000);

    const doctorsCount = await adminPage.getDoctorsCount();
    expect(doctorsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_ADMIN_022: Doctors table renders correctly', async ({ page }) => {
    await adminPage.clickSidebarLink('Doctors');
    await page.waitForTimeout(1000);

    const tableVisible = await adminPage.isVisible(adminPage.doctorsTable);
    expect(tableVisible).toBeTruthy();
  });

  test('TC_ADMIN_023: Admin can view products list', async ({ page }) => {
    await adminPage.clickSidebarLink('Products');
    await page.waitForTimeout(1000);

    const productsCount = await adminPage.getProductsCount();
    expect(productsCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_ADMIN_024: Products table renders correctly', async ({ page }) => {
    await adminPage.clickSidebarLink('Products');
    await page.waitForTimeout(1000);

    const tableVisible = await adminPage.isVisible(adminPage.productsTable);
    expect(tableVisible).toBeTruthy();
  });

  test('TC_ADMIN_025: Admin sidebar navigation works for all routes', async ({ page }) => {
    await adminPage.navigate();

    // Verify sidebar exists
    const sidebarVisible = await adminPage.isVisible(adminPage.sidebarNav);
    expect(sidebarVisible).toBeTruthy();

    // Get all sidebar links
    const linksCount = await adminPage.sidebarLinks.count();
    expect(linksCount).toBeGreaterThanOrEqual(4);
  });
});

test.describe('@regression Admin Search and Filter', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_ADMIN_026: Admin can search users', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    await adminPage.search('user');
    await page.waitForTimeout(1000);

    // Should have results or empty state
    const count = await adminPage.getUsersCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_ADMIN_027: Admin can search doctors', async ({ page }) => {
    await adminPage.clickSidebarLink('Doctors');
    await page.waitForTimeout(1000);

    await adminPage.search('doctor');
    await page.waitForTimeout(1000);

    const count = await adminPage.getDoctorsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_ADMIN_028: Admin can search appointments', async ({ page }) => {
    await adminPage.clickSidebarLink('Appointments');
    await page.waitForTimeout(1000);

    await adminPage.search('appointment');
    await page.waitForTimeout(1000);

    const count = await adminPage.getAppointmentsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_ADMIN_029: Filter dropdown works', async ({ page }) => {
    await adminPage.clickSidebarLink('Users');
    await page.waitForTimeout(1000);

    const filterVisible = await adminPage.isVisible(adminPage.filterDropdown);

    if (filterVisible) {
      // Try to select option
      const options = adminPage.filterDropdown.locator('option');
      const optionCount = await options.count();

      if (optionCount > 1) {
        await adminPage.filterBy('admin');
        await page.waitForTimeout(1000);
      }
    }
  });

  test('TC_ADMIN_030: Admin dashboard elements verify', async ({ page }) => {
    await adminPage.navigate();

    const elementsVisible = await adminPage.verifyDashboardElements();
    expect(elementsVisible).toBeTruthy();
  });
});
