import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';

/**
 * Test Helpers Utility
 * Provides reusable helper functions for test scripts
 */

/**
 * Demo credentials
 */
export const DEMO_CREDENTIALS = {
  patient: {
    email: 'patient@demo.com',
    password: 'demo123'
  },
  admin: {
    email: 'admin@demo.com',
    password: 'demo123'
  }
};

/**
 * Test user data generator
 * Generates realistic healthcare test user data
 */
export function generateTestUser() {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 10000);

  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'Robert', 'Emily', 'David', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    name: `${firstName} ${lastName}`,
    email: `test_${firstName.toLowerCase()}_${randomId}@testmail.com`,
    password: 'Test@1234',
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    role: 'patient'
  };
}

/**
 * Generate test doctor data
 */
export function generateTestDoctor() {
  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics', 'General Medicine'];
  const firstNames = ['Dr. James', 'Dr. Maria', 'Dr. Robert', 'Dr. Lisa', 'Dr. William', 'Dr. Jennifer'];
  const lastNames = ['Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const specialization = specializations[Math.floor(Math.random() * specializations.length)];

  return {
    name: `${firstName} ${lastName}`,
    specialization,
    experience: `${Math.floor(Math.random() * 20) + 1} years`,
    fees: `$${(Math.floor(Math.random() * 20) + 5) * 10}`,
    email: `doctor_${lastName.toLowerCase()}@healthhub.com`
  };
}

/**
 * Generate test appointment data
 */
export function generateTestAppointment() {
  const reasons = ['Routine checkup', 'Follow-up consultation', 'Vaccination', 'Health screening', 'Specialist consultation'];
  const recordTypes = ['Blood Test', 'X-Ray', 'MRI Report', 'CT Scan', 'Ultrasound', 'Prescription', 'Discharge Summary'];

  // Generate future date
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
  const dateStr = futureDate.toISOString().split('T')[0];

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return {
    date: dateStr,
    time: times[Math.floor(Math.random() * times.length)],
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    recordType: recordTypes[Math.floor(Math.random() * recordTypes.length)]
  };
}

/**
 * Login as regular user/patient
 * Navigates to login page and logs in with patient credentials
 */
export async function loginAsUser(page: Page, email?: string, password?: string) {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(
    email || DEMO_CREDENTIALS.patient.email,
    password || DEMO_CREDENTIALS.patient.password
  );

  await page.waitForTimeout(2000);

  // Verify login success by checking URL changed from /auth
  expect(page.url()).not.toContain('/auth');
}

/**
 * Login as admin
 * Navigates to login page and logs in with admin credentials
 */
export async function loginAsAdmin(page: Page, email?: string, password?: string) {
  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);

  await loginPage.navigate();
  await loginPage.login(
    email || DEMO_CREDENTIALS.admin.email,
    password || DEMO_CREDENTIALS.admin.password
  );

  await page.waitForTimeout(2000);

  // Navigate to admin dashboard
  await adminPage.navigate();
  await page.waitForTimeout(1000);

  // Verify admin dashboard is displayed
  expect(await adminPage.verifyDashboardElements()).toBeTruthy();
}

/**
 * Wait for toast notification with specific message
 * Waits for toast element containing the message text
 */
export async function waitForToast(page: Page, message: string, timeout: number = 5000): Promise<boolean> {
  try {
    const toastLocator = page.locator('[role="status"], .toast, .alert, .notification');
    await toastLocator.waitFor({ state: 'visible', timeout });

    const toastText = await toastLocator.textContent();
    return toastText?.toLowerCase().includes(message.toLowerCase()) || false;
  } catch {
    return false;
  }
}

/**
 * Clear input field and type text
 * More reliable than fill() for some input types
 */
export async function clearAndType(page: Page, locator: string, text: string) {
  const element = page.locator(locator);
  await element.waitFor({ state: 'visible' });
  await element.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await element.fill(text);
}

/**
 * Take screenshot on test failure
 * Saves screenshot to test-results directory with test name
 */
export async function takeScreenshotOnFailure(page: Page, testName: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeTestName = testName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `test-results/failure_${safeTestName}_${timestamp}.png`;

  try {
    await page.screenshot({ path: filename, fullPage: true });
    return filename;
  } catch (error) {
    console.error('Failed to take screenshot:', error);
    return '';
  }
}

/**
 * Wait for element to be visible with custom timeout
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get text content of element
 */
export async function getElementText(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  return await element.textContent() || '';
}

/**
 * Check if element exists and is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Select dropdown option by value
 */
export async function selectDropdownOption(page: Page, selector: string, value: string) {
  const dropdown = page.locator(selector);
  await dropdown.waitFor({ state: 'visible' });
  await dropdown.selectOption(value);
  await page.waitForTimeout(500);
}

/**
 * Scroll to element and click
 */
export async function scrollToAndClick(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await element.waitFor({ state: 'visible' });
  await element.click();
}

/**
 * Verify URL contains expected path
 */
export async function verifyUrlContains(page: Page, expectedPath: string): Promise<boolean> {
  const currentUrl = page.url();
  return currentUrl.includes(expectedPath);
}

/**
 * Generate random test data for medical records
 */
export function generateMedicalRecordData() {
  const recordTypes = ['Blood Test', 'X-Ray', 'MRI Report', 'CT Scan', 'Ultrasound', 'Prescription', 'Discharge Summary', 'Lab Report'];
  const titles = ['Annual Health Checkup', 'Emergency Room Visit', 'Specialist Consultation', 'Follow-up Appointment', 'Diagnostic Test'];

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 90) - 1);
  const dateStr = pastDate.toISOString().split('T')[0];

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    type: recordTypes[Math.floor(Math.random() * recordTypes.length)],
    date: dateStr,
    description: 'Test medical record for QA automation testing'
  };
}

/**
 * HealthHub test configuration
 */
export const TEST_CONFIG = {
  baseURL: 'https://health-hub-connect-livid.vercel.app',
  apiBaseURL: 'https://mern-backend-main-zeta.vercel.app',
  defaultTimeout: 30000,
  retryCount: 2
};
