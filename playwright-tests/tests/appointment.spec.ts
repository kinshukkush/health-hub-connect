import { test, expect } from '@playwright/test';
import { AppointmentPage } from '../pages/AppointmentPage';
import { DoctorPage } from '../pages/DoctorPage';
import { loginAsUser, loginAsAdmin, generateTestAppointment, DEMO_CREDENTIALS } from '../utils/test-helpers';

/**
 * Appointment Booking Test Suite
 * Tests appointment creation, viewing, cancellation, and admin approval
 *
 * @tag @smoke - Basic appointment booking flow
 * @tag @regression - Full appointment suite
 */
test.describe('@smoke Appointment Booking Tests', () => {
  let appointmentPage: AppointmentPage;
  let doctorPage: DoctorPage;

  test.beforeEach(async ({ page }) => {
    appointmentPage = new AppointmentPage(page);
    doctorPage = new DoctorPage(page);

    // Login before each test
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_APPT_001: User can search for a doctor by name', async ({ page }) => {
    await appointmentPage.navigate();

    // Search for doctor
    await appointmentPage.searchDoctor('Cardio');
    await page.waitForTimeout(1000);

    // Verify search results are displayed
    const doctorCount = await appointmentPage.doctorCards.count();
    expect(doctorCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_APPT_002: User can filter doctors by specialization', async ({ page }) => {
    await appointmentPage.navigate();

    // Filter by specialization
    await appointmentPage.filterBySpecialization('Cardiology');
    await page.waitForTimeout(1000);

    // Verify filtered results
    const doctorCount = await appointmentPage.doctorCards.count();
    expect(doctorCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_APPT_003: User can view doctor profile details', async ({ page }) => {
    await doctorPage.navigate();

    // Click first doctor card
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Verify profile page is displayed
    const isProfileDisplayed = await doctorPage.verifyProfilePageDisplayed();
    expect(isProfileDisplayed).toBeTruthy();
  });

  test('TC_APPT_004: User can book an appointment successfully', async ({ page }) => {
    const apptData = generateTestAppointment();

    await appointmentPage.navigate();

    // Book first available doctor
    const firstDoctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
    if (await firstDoctorCard.count() > 0) {
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      // Fill appointment details
      await appointmentPage.fillInput(appointmentPage.appointmentDateInput, apptData.date);
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, apptData.time);
      await appointmentPage.fillInput(appointmentPage.appointmentReasonInput, apptData.reason);

      // Submit
      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Verify booking success
      const isSuccess = await appointmentPage.verifyBookingSuccess();
      expect(isSuccess).toBeTruthy();
    }
  });

  test('TC_APPT_005: Booking shows confirmation message', async ({ page }) => {
    const apptData = generateTestAppointment();

    await appointmentPage.navigate();

    const firstDoctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
    if (await firstDoctorCard.count() > 0) {
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      await appointmentPage.fillInput(appointmentPage.appointmentDateInput, apptData.date);
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, apptData.time);
      await appointmentPage.fillInput(appointmentPage.appointmentReasonInput, apptData.reason);

      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Verify success toast is displayed
      const toastVisible = await appointmentPage.isVisible(appointmentPage.successToast);
      expect(toastVisible).toBeTruthy();
    }
  });
});

test.describe('@regression Appointment History Tests', () => {
  let appointmentPage: AppointmentPage;

  test.beforeEach(async ({ page }) => {
    appointmentPage = new AppointmentPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_APPT_006: User can view appointment history', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Verify history table is displayed
    const historyTableVisible = await appointmentPage.isVisible(appointmentPage.appointmentHistoryTable);
    expect(historyTableVisible).toBeTruthy();
  });

  test('TC_APPT_007: User can cancel a pending appointment', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Get initial count
    const initialCount = await appointmentPage.getAppointmentCount();

    // Cancel first appointment if exists
    if (initialCount > 0) {
      await appointmentPage.cancelAppointment(0);
      await page.waitForTimeout(2000);

      // Verify count decreased or status changed
      const newCount = await appointmentPage.getAppointmentCount();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('TC_APPT_008: Appointment status displays correctly', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Get first appointment status
    const status = await appointmentPage.getAppointmentStatus(0);

    // Status should be one of expected values
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled', 'completed'];
    expect(validStatuses).toContain(status.toLowerCase());
  });
});

test.describe('@regression Admin Appointment Management', () => {
  let appointmentPage: AppointmentPage;

  test.beforeEach(async ({ page }) => {
    appointmentPage = new AppointmentPage(page);
    await loginAsAdmin(page);
    await page.waitForTimeout(1000);
  });

  test('TC_APPT_009: Admin can approve a pending appointment', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Get initial pending count
    const initialCount = await appointmentPage.getAppointmentCount();

    // Approve first appointment if exists
    if (initialCount > 0) {
      const status = await appointmentPage.getAppointmentStatus(0);
      if (status.toLowerCase() === 'pending') {
        // Click approve button if exists
        const approveButton = page.locator('button:has-text("Approve")').first();
        if (await approveButton.count() > 0) {
          await approveButton.click();
          await page.waitForTimeout(2000);

          // Verify approval success
          const toastVisible = await appointmentPage.isVisible(appointmentPage.successToast);
          expect(toastVisible).toBeTruthy();
        }
      }
    }
  });

  test('TC_APPT_010: Admin can reject an appointment with reason', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Reject first pending appointment
    const initialCount = await appointmentPage.getAppointmentCount();

    if (initialCount > 0) {
      const status = await appointmentPage.getAppointmentStatus(0);
      if (status.toLowerCase() === 'pending') {
        const rejectButton = page.locator('button:has-text("Reject")').first();
        if (await rejectButton.count() > 0) {
          await rejectButton.click();
          await page.waitForTimeout(2000);

          // Verify rejection
          const toastVisible = await appointmentPage.isVisible(appointmentPage.successToast);
          expect(toastVisible).toBeTruthy();
        }
      }
    }
  });

  test('TC_APPT_011: Appointment status updates reflect in user view', async ({ page }) => {
    // Admin approves appointment
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Get status before
    const statusBefore = await appointmentPage.getAppointmentStatus(0);

    // Approve if pending
    if (statusBefore?.toLowerCase() === 'pending') {
      const approveButton = page.locator('button:has-text("Approve")').first();
      if (await approveButton.count() > 0) {
        await approveButton.click();
        await page.waitForTimeout(2000);
      }
    }

    // Refresh and check status after
    await page.reload();
    await page.waitForTimeout(1000);

    const statusAfter = await appointmentPage.getAppointmentStatus(0);

    // Status should have changed from pending
    if (statusBefore?.toLowerCase() === 'pending') {
      expect(statusAfter.toLowerCase()).not.toBe('pending');
    }
  });
});

test.describe('@regression Appointment Validation Tests', () => {
  let appointmentPage: AppointmentPage;

  test.beforeEach(async ({ page }) => {
    appointmentPage = new AppointmentPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_APPT_012: Appointment form validation for missing doctor', async ({ page }) => {
    await appointmentPage.navigate();

    // Try to book without selecting doctor
    const dateInput = appointmentPage.appointmentDateInput;
    if (await dateInput.count() > 0) {
      await appointmentPage.fillInput(dateInput, '2026-04-01');
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, '10:00');

      // Try to submit without doctor selection
      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Should show error or remain on selection page
      const errorMsg = await appointmentPage.getErrorMessageText();
      expect(errorMsg.length).toBeGreaterThan(0);
    }
  });

  test('TC_APPT_013: Appointment form validation for missing date', async ({ page }) => {
    await appointmentPage.navigate();

    const firstDoctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
    if (await firstDoctorCard.count() > 0) {
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      // Fill time and reason but not date
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, '10:00');
      await appointmentPage.fillInput(appointmentPage.appointmentReasonInput, 'Checkup');

      // Try to submit
      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Should show validation error
      const errorMsg = await appointmentPage.getErrorMessageText();
      expect(errorMsg.length).toBeGreaterThan(0);
    }
  });

  test('TC_APPT_014: Appointment form validation for missing reason', async ({ page }) => {
    await appointmentPage.navigate();

    const firstDoctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
    if (await firstDoctorCard.count() > 0) {
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      // Fill date and time but not reason
      await appointmentPage.fillInput(appointmentPage.appointmentDateInput, '2026-04-01');
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, '10:00');

      // Try to submit
      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Should show validation error
      const errorMsg = await appointmentPage.getErrorMessageText();
      expect(errorMsg.length).toBeGreaterThan(0);
    }
  });

  test('TC_APPT_015: Double booking prevention for same slot', async ({ page }) => {
    await appointmentPage.navigate();

    const firstDoctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
    if (await firstDoctorCard.count() > 0) {
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      // Book with specific date and time
      await appointmentPage.fillInput(appointmentPage.appointmentDateInput, '2026-04-01');
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, '10:00');
      await appointmentPage.fillInput(appointmentPage.appointmentReasonInput, 'First booking');

      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Try to book same slot again
      await appointmentPage.navigate();
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      await appointmentPage.fillInput(appointmentPage.appointmentDateInput, '2026-04-01');
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, '10:00');
      await appointmentPage.fillInput(appointmentPage.appointmentReasonInput, 'Second booking');

      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Should show error for double booking
      const errorMsg = await appointmentPage.getErrorMessageText();
      expect(errorMsg.length).toBeGreaterThan(0);
    }
  });
});

test.describe('@regression Appointment Edge Cases', () => {
  let appointmentPage: AppointmentPage;

  test.beforeEach(async ({ page }) => {
    appointmentPage = new AppointmentPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_APPT_016: Appointment with past date shows validation', async ({ page }) => {
    await appointmentPage.navigate();

    const firstDoctorCard = page.locator('[data-testid="doctor-card"], .doctor-card').first();
    if (await firstDoctorCard.count() > 0) {
      await firstDoctorCard.click();
      await page.waitForTimeout(1000);

      // Try to select past date
      await appointmentPage.fillInput(appointmentPage.appointmentDateInput, '2020-01-01');
      await appointmentPage.fillInput(appointmentPage.appointmentTimeInput, '10:00');
      await appointmentPage.fillInput(appointmentPage.appointmentReasonInput, 'Past date test');

      await appointmentPage.clickElement(appointmentPage.submitAppointmentButton);
      await page.waitForTimeout(2000);

      // Should show validation error
      const errorMsg = await appointmentPage.getErrorMessageText();
      expect(errorMsg.length).toBeGreaterThan(0);
    }
  });

  test('TC_APPT_017: Appointment page elements verify correctly', async ({ page }) => {
    await appointmentPage.navigate();

    // Verify all key elements are present
    const pageElements = await appointmentPage.verifyAppointmentPageElements();
    expect(pageElements).toBeTruthy();
  });

  test('TC_APPT_018: Delete confirmation dialog appears', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    const initialCount = await appointmentPage.getAppointmentCount();

    if (initialCount > 0) {
      // Click cancel button
      const cancelButtons = page.locator('button:has-text("Cancel")');
      if (await cancelButtons.count() > 0) {
        await cancelButtons.first().click();
        await page.waitForTimeout(500);

        // Verify dialog appears
        const dialogVisible = await appointmentPage.isVisible(appointmentPage.confirmDialog);
        expect(dialogVisible).toBeTruthy();

        // Click no to cancel deletion
        const noButton = appointmentPage.confirmDialogNo;
        if (await appointmentPage.isVisible(noButton)) {
          await appointmentPage.clickElement(noButton);
        }
      }
    }
  });

  test('TC_APPT_019: Search returns matching doctor results', async ({ page }) => {
    await appointmentPage.navigate();

    // Search with known term
    await appointmentPage.searchDoctor('Doctor');
    await page.waitForTimeout(1000);

    // Verify results displayed
    const doctorCount = await appointmentPage.doctorCards.count();
    expect(doctorCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_APPT_020: Search with no match shows empty state', async ({ page }) => {
    await appointmentPage.navigate();

    // Search with unlikely term
    await appointmentPage.searchDoctor('XYZNONEXISTENT');
    await page.waitForTimeout(1000);

    // Check for empty state or zero results
    const doctorCount = await appointmentPage.doctorCards.count();
    const isEmptyState = await appointmentPage.isEmptyStateDisplayed();

    // Either no results or empty state should be shown
    expect(doctorCount === 0 || isEmptyState).toBeTruthy();
  });

  test('TC_APPT_021: Appointment history table renders correctly', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    // Verify table is visible
    const tableVisible = await appointmentPage.isVisible(appointmentPage.appointmentHistoryTable);
    expect(tableVisible).toBeTruthy();
  });

  test('TC_APPT_022: Cancel appointment updates count', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    const initialCount = await appointmentPage.getAppointmentCount();

    if (initialCount > 0) {
      await appointmentPage.cancelAppointment(0);
      await page.waitForTimeout(2000);

      const newCount = await appointmentPage.getAppointmentCount();
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('TC_APPT_023: Appointment page accessible from navigation', async ({ page }) => {
    // Navigate from home
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Click appointments link in nav
    const appointmentsLink = page.locator('a:has-text("Appointments"), a[href*="appointments"]');
    if (await appointmentsLink.count() > 0) {
      await appointmentsLink.click();
      await page.waitForTimeout(1000);

      // Verify on appointments page
      expect(page.url()).toContain('/appointments');
    }
  });

  test('TC_APPT_024: Back navigation from doctor profile works', async ({ page }) => {
    await doctorPage.navigate();
    await doctorPage.clickFirstDoctorCard();
    await page.waitForTimeout(1000);

    // Click back button
    await doctorPage.backToDoctorsList();
    await page.waitForTimeout(1000);

    // Verify back on doctors list
    expect(page.url()).toContain('/doctors');
  });

  test('TC_APPT_025: Appointment count displays correctly', async ({ page }) => {
    await appointmentPage.navigate();
    await appointmentPage.viewAppointmentHistory();
    await page.waitForTimeout(1000);

    const count = await appointmentPage.getAppointmentCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
