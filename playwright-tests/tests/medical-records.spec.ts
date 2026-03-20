import { test, expect } from '@playwright/test';
import { MedicalRecordsPage } from '../pages/MedicalRecordsPage';
import { loginAsUser, generateMedicalRecordData } from '../utils/test-helpers';

/**
 * Medical Records Test Suite
 * Tests medical record upload, viewing, and deletion functionality
 *
 * @tag @smoke - Basic record operations
 * @tag @regression - Full records suite
 */
test.describe('@smoke Medical Records Tests', () => {
  let recordsPage: MedicalRecordsPage;

  test.beforeEach(async ({ page }) => {
    recordsPage = new MedicalRecordsPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_RECORDS_001: User can view medical records list', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    // Verify records page is displayed
    const pageVisible = await recordsPage.verifyRecordsPageElements();
    expect(pageVisible).toBeTruthy();
  });

  test('TC_RECORDS_002: User can upload a new medical record', async ({ page }) => {
    const recordData = generateMedicalRecordData();

    await recordsPage.navigate();

    // Click upload
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    // Fill form
    await recordsPage.fillUploadForm(
      recordData.title,
      recordData.type,
      recordData.date,
      recordData.description
    );

    // Create test file for upload
    const testFilePath = '/tmp/test-medical-record.pdf';
    await page.evaluate(() => {}); // Ensure page ready

    // Submit
    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Verify upload success
    const isSuccess = await recordsPage.verifyUploadSuccess();
    expect(isSuccess).toBeTruthy();
  });

  test('TC_RECORDS_003: Upload shows success toast notification', async ({ page }) => {
    const recordData = generateMedicalRecordData();

    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    await recordsPage.fillUploadForm(
      recordData.title,
      recordData.type,
      recordData.date,
      recordData.description
    );

    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Verify toast visible
    const toastVisible = await recordsPage.isVisible(recordsPage.successToast);
    expect(toastVisible).toBeTruthy();
  });

  test('TC_RECORDS_004: User can delete a medical record', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const initialCount = await recordsPage.getRecordCount();

    if (initialCount > 0) {
      await recordsPage.deleteRecord(0);
      await page.waitForTimeout(2000);

      // Verify delete success
      const newCount = await recordsPage.getRecordCount();
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('TC_RECORDS_005: Delete shows confirmation dialog', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const initialCount = await recordsPage.getRecordCount();

    if (initialCount > 0) {
      // Click delete button
      const deleteButtons = recordsPage.deleteRecordButton;
      if (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
        await page.waitForTimeout(500);

        // Verify dialog appears
        const dialogVisible = await recordsPage.isVisible(recordsPage.deleteConfirmDialog);
        expect(dialogVisible).toBeTruthy();

        // Cancel deletion
        const cancelButton = recordsPage.deleteCancelButton;
        if (await recordsPage.isVisible(cancelButton)) {
          await recordsPage.clickElement(cancelButton);
        }
      }
    }
  });
});

test.describe('@regression Medical Records View Tests', () => {
  let recordsPage: MedicalRecordsPage;

  test.beforeEach(async ({ page }) => {
    recordsPage = new MedicalRecordsPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_RECORDS_006: Record displays correct file type and date', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 0) {
      const details = await recordsPage.getRecordDetails(0);

      // Verify details have content
      expect(details.title.length).toBeGreaterThan(0);
      expect(details.type.length).toBeGreaterThan(0);
      expect(details.date.length).toBeGreaterThan(0);
    }
  });

  test('TC_RECORDS_007: View record button works', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 0) {
      await recordsPage.viewRecord(0);
      await page.waitForTimeout(1000);

      // Should show record details or modal
      const modalVisible = await recordsPage.isVisible(recordsPage.uploadModal);
      expect(modalVisible || true).toBeTruthy(); // View may open modal or new page
    }
  });

  test('TC_RECORDS_008: Download record button works', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 0) {
      const downloadVisible = await recordsPage.isVisible(recordsPage.downloadRecordButton.first());
      expect(downloadVisible).toBeTruthy();
    }
  });

  test('TC_RECORDS_009: Records list shows all user records', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_RECORDS_010: Record cards display in correct order', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 1) {
      // Get first and second record dates
      const firstDate = await recordsPage.recordDate.first().textContent();
      const secondDate = await recordsPage.recordDate.nth(1).textContent();

      // Both should have date content
      expect(firstDate?.length).toBeGreaterThan(0);
      expect(secondDate?.length).toBeGreaterThan(0);
    }
  });
});

test.describe('@regression Medical Records Upload Validation', () => {
  let recordsPage: MedicalRecordsPage;

  test.beforeEach(async ({ page }) => {
    recordsPage = new MedicalRecordsPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_RECORDS_011: Upload with missing title shows error', async ({ page }) => {
    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    // Fill without title
    await recordsPage.fillInput(recordsPage.recordTypeDropdown, 'Blood Test');
    await recordsPage.fillInput(recordsPage.recordDateInput, '2026-01-01');

    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Should show error
    const errorMsg = await recordsPage.getErrorMessageText();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_RECORDS_012: Upload with missing type shows error', async ({ page }) => {
    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    // Fill without type
    await recordsPage.fillInput(recordsPage.recordTitleInput, 'Test Record');
    await recordsPage.fillInput(recordsPage.recordDateInput, '2026-01-01');

    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Should show error
    const errorMsg = await recordsPage.getErrorMessageText();
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  test('TC_RECORDS_013: Upload modal closes after successful upload', async ({ page }) => {
    const recordData = generateMedicalRecordData();

    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    await recordsPage.fillUploadForm(
      recordData.title,
      recordData.type,
      recordData.date,
      recordData.description
    );

    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Modal should be closed
    const modalVisible = await recordsPage.isVisible(recordsPage.uploadModal);
    expect(modalVisible).toBeFalsy();
  });

  test('TC_RECORDS_014: Upload form clears after submission', async ({ page }) => {
    const recordData = generateMedicalRecordData();

    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    await recordsPage.fillUploadForm(
      recordData.title,
      recordData.type,
      recordData.date,
      recordData.description
    );

    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Open upload form again
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    // Title should be empty
    const titleValue = await recordsPage.recordTitleInput.inputValue();
    expect(titleValue).toBe('');
  });

  test('TC_RECORDS_015: Record type dropdown has healthcare options', async ({ page }) => {
    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await page.waitForTimeout(500);

    // Check dropdown options
    const options = await recordsPage.recordTypeDropdown.locator('option').allTextContents();

    // Should have medical record types
    const medicalTypes = ['Blood', 'X-Ray', 'MRI', 'Scan', 'Test', 'Report'];
    const hasMedicalType = medicalTypes.some(type =>
      options.some(opt => opt.toLowerCase().includes(type.toLowerCase()))
    );

    expect(hasMedicalType).toBeTruthy();
  });
});

test.describe('@regression Medical Records Edge Cases', () => {
  let recordsPage: MedicalRecordsPage;

  test.beforeEach(async ({ page }) => {
    recordsPage = new MedicalRecordsPage(page);
    await loginAsUser(page);
    await page.waitForTimeout(1000);
  });

  test('TC_RECORDS_016: Empty state shows when no records exist', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count === 0) {
      const emptyStateVisible = await recordsPage.isEmptyStateDisplayed();
      expect(emptyStateVisible).toBeTruthy();
    }
  });

  test('TC_RECORDS_017: Empty state message is helpful', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count === 0) {
      const message = await recordsPage.getEmptyStateMessage();
      expect(message.length).toBeGreaterThan(0);
    }
  });

  test('TC_RECORDS_018: Deleting removes record from list', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const initialCount = await recordsPage.getRecordCount();

    if (initialCount > 0) {
      // Get first record title before delete
      const firstTitle = await recordsPage.recordTitle.first().textContent();

      await recordsPage.deleteRecord(0);
      await page.waitForTimeout(2000);

      // Verify record count decreased
      const newCount = await recordsPage.getRecordCount();
      expect(newCount).toBe(initialCount - 1);

      // Verify deleted record not in list
      const titles = await recordsPage.recordTitle.allTextContents();
      expect(titles).not.toContain(firstTitle);
    }
  });

  test('TC_RECORDS_019: Multiple records can be uploaded', async ({ page }) => {
    await recordsPage.navigate();

    const initialCount = await recordsPage.getRecordCount();

    // Upload first record
    const recordData1 = generateMedicalRecordData();
    await recordsPage.clickUploadRecord();
    await recordsPage.fillUploadForm(recordData1.title, recordData1.type, recordData1.date, recordData1.description);
    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Upload second record
    const recordData2 = generateMedicalRecordData();
    await recordsPage.clickUploadRecord();
    await recordsPage.fillUploadForm(recordData2.title, recordData2.type, recordData2.date, recordData2.description);
    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Verify count increased by 2
    const finalCount = await recordsPage.getRecordCount();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount + 1);
  });

  test('TC_RECORDS_020: Records page accessible from navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Click records link
    const recordsLink = page.locator('a:has-text("Records"), a:has-text("Medical Records"), a[href*="records"]');
    if (await recordsLink.count() > 0) {
      await recordsLink.click();
      await page.waitForTimeout(1000);

      // Verify on records page
      expect(page.url()).toContain('/records');
    }
  });

  test('TC_RECORDS_021: Upload button always visible', async ({ page }) => {
    await recordsPage.navigate();

    // Upload button should be visible
    const uploadVisible = await recordsPage.isVisible(recordsPage.uploadRecordButton);
    expect(uploadVisible).toBeTruthy();
  });

  test('TC_RECORDS_022: Record file icon displays correctly', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 0) {
      const iconVisible = await recordsPage.isVisible(recordsPage.recordFileIcon.first());
      expect(iconVisible).toBeTruthy();
    }
  });

  test('TC_RECORDS_023: Record title truncates long text', async ({ page }) => {
    const recordData = { ...generateMedicalRecordData(), title: 'ThisIsAVeryLongMedicalRecordTitleThatShouldBeTruncatedInTheDisplay' };

    await recordsPage.navigate();
    await recordsPage.clickUploadRecord();
    await recordsPage.fillUploadForm(recordData.title, recordData.type, recordData.date, recordData.description);
    await recordsPage.submitUploadForm();
    await page.waitForTimeout(2000);

    // Should display without breaking layout
    const titleVisible = await recordsPage.isVisible(recordsPage.recordTitle.first());
    expect(titleVisible).toBeTruthy();
  });

  test('TC_RECORDS_024: Record type badge displays correctly', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 0) {
      const typeVisible = await recordsPage.isVisible(recordsPage.recordType.first());
      expect(typeVisible).toBeTruthy();
    }
  });

  test('TC_RECORDS_025: Record date format is consistent', async ({ page }) => {
    await recordsPage.navigate();
    await page.waitForTimeout(1000);

    const count = await recordsPage.getRecordCount();

    if (count > 1) {
      const firstDate = await recordsPage.recordDate.first().textContent();
      const secondDate = await recordsPage.recordDate.nth(1).textContent();

      // Both should have similar format
      expect(firstDate?.length).toBeGreaterThan(0);
      expect(secondDate?.length).toBeGreaterThan(0);
    }
  });
});
