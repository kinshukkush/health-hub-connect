# Bug Reports

**Project:** HealthHub Connect
**Total Bugs:** 10
**Date Range:** 2026-01-01 to 2026-03-20

---

## Critical Bugs (2)

### BUG_001: Authentication Bypass via Direct URL Access

| Field | Details |
|-------|---------|
| Bug ID | BUG_001 |
| Title | Authentication Bypass - Direct URL access to /admin without login |
| Severity | Critical |
| Priority | High |
| Environment | Chrome 121, Windows 11, Production |
| Steps to Reproduce | 1. Open incognito window<br>2. Navigate directly to https://health-hub-connect-livid.vercel.app/admin<br>3. Observe page loads without authentication | Admin dashboard accessible without login |
| Expected Result | User should be redirected to /auth page |
| Actual Result | Admin dashboard loads, exposing sensitive data |
| Status | Open |
| Screenshot | [Placeholder: screenshots/BUG_001.png] |

---

### BUG_002: Data Loss on Session Timeout

| Field | Details |
|-------|---------|
| Bug ID | BUG_002 |
| Title | Unsaved form data lost on session timeout |
| Severity | Critical |
| Priority | High |
| Environment | Firefox 120, macOS, Staging |
| Steps to Reproduce | 1. Login and navigate to profile<br>2. Start editing profile form<br>3. Wait for session timeout (30 min)<br>4. Click Save | Form data lost, no warning shown |
| Expected Result | Session renewal prompt or data preservation |
| Actual Result | Form cleared, error "Session expired" |
| Status | Open |
| Screenshot | [Placeholder: screenshots/BUG_002.png] |

---

## Major Bugs (3)

### BUG_003: Appointment Double Booking Allowed

| Field | Details |
|-------|---------|
| Bug ID | BUG_003 |
| Title | Same time slot can be booked by multiple users |
| Severity | Major |
| Priority | High |
| Environment | Chrome 121, Windows 11, Production |
| Steps to Reproduce | 1. User A books appointment for Dr. X at 10:00 on 2026-04-01<br>2. User B books same slot<br>3. Both bookings confirmed | Double booking successful |
| Expected Result | Second booking should be rejected |
| Actual Result | Both appointments created with same slot |
| Status | Open |
| Screenshot | [Placeholder: screenshots/BUG_003.png] |

---

### BUG_004: Wrong Doctor Specialization Displayed

| Field | Details |
|-------|---------|
| Bug ID | BUG_004 |
| Title | Doctor profile shows incorrect specialization |
| Severity | Major |
| Priority | Medium |
| Environment | Safari 17, iPhone 14, Production |
| Steps to Reproduce | 1. Search for cardiologist<br>2. Click on Dr. Smith profile<br>3. View specialization field | Shows "Dermatology" instead of "Cardiology" |
| Expected Result | Specialization matches doctor's actual specialty |
| Actual Result | Wrong specialization displayed |
| Status | Fixed |
| Screenshot | [Placeholder: screenshots/BUG_004.png] |

---

### BUG_005: Admin Role Toggle Not Persisting

| Field | Details |
|-------|---------|
| Bug ID | BUG_005 |
| Title | User role change reverts after page refresh |
| Severity | Major |
| Priority | High |
| Environment | Chrome 121, Windows 11, Staging |
| Steps to Reproduce | 1. Admin navigates to Users<br>2. Change user role to Admin<br>3. Refresh page | Role reverts to "user" |
| Expected Result | Role change persists |
| Actual Result | Role reverts to original value |
| Status | In Progress |
| Screenshot | [Placeholder: screenshots/BUG_005.png] |

---

## Minor Bugs (3)

### BUG_006: Error Message Typo on Login

| Field | Details |
|-------|---------|
| Bug ID | BUG_006 |
| Title | Typo in login error message |
| Severity | Minor |
| Priority | Low |
| Environment | All browsers, Production |
| Steps to Reproduce | 1. Enter invalid credentials<br>2. Submit form | Error shows "Invaild credentials" |
| Expected Result | "Invalid credentials" |
| Actual Result | "Invaild credentials" (typo) |
| Status | Fixed |
| Screenshot | [Placeholder: screenshots/BUG_006.png] |

---

### BUG_007: Date Picker Shows Wrong Format

| Field | Details |
|-------|---------|
| Bug ID | BUG_007 |
| Title | Date picker displays MM/DD/YYYY instead of DD/MM/YYYY |
| Severity | Minor |
| Priority | Low |
| Environment | Chrome 121, India locale, Production |
| Steps to Reproduce | 1. Navigate to appointment booking<br>2. Click date field | Date format is US style |
| Expected Result | DD/MM/YYYY format for Indian users |
| Actual Result | MM/DD/YYYY displayed |
| Status | Open |
| Screenshot | [Placeholder: screenshots/BUG_007.png] |

---

### BUG_008: Toast Notification Overlaps Content

| Field | Details |
|-------|---------|
| Bug ID | BUG_008 |
| Title | Success toast overlaps page content on mobile |
| Severity | Minor |
| Priority | Medium |
| Environment | Pixel 6, Android 12, Production |
| Steps to Reproduce | 1. On mobile viewport<br>2. Submit form<br>3. View toast | Toast covers submit button |
| Expected Result | Toast should not overlap interactive elements |
| Actual Result | Toast positioned over content |
| Status | Open |
| Screenshot | [Placeholder: screenshots/BUG_008.png] |

---

## Trivial Bugs (2)

### BUG_009: Inconsistent Button Border Radius

| Field | Details |
|-------|---------|
| Bug ID | BUG_009 |
| Title | Submit button has different border radius than other buttons |
| Severity | Trivial |
| Priority | Low |
| Environment | All browsers, Production |
| Steps to Reproduce | 1. View login page<br>2. Compare button styles | Login button has 8px radius, others 4px |
| Expected Result | Consistent border radius across buttons |
| Actual Result | Inconsistent styling |
| Status | Open |
| Screenshot | [Placeholder: screenshots/BUG_009.png] |

---

### BUG_010: Extra Whitespace in Footer

| Field | Details |
|-------|---------|
| Bug ID | BUG_010 |
| Title | Extra whitespace in footer on tablet viewport |
| Severity | Trivial |
| Priority | Low |
| Environment | iPad Pro, Production |
| Steps to Reproduce | 1. Set viewport to 768px<br>2. Scroll to footer | Large gap before footer content |
| Expected Result | Consistent spacing |
| Actual Result | Extra 50px whitespace |
| Status | Closed |
| Screenshot | [Placeholder: screenshots/BUG_010.png] |

---

## Bug Summary

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 2 | 20% |
| Major | 3 | 30% |
| Minor | 3 | 30% |
| Trivial | 2 | 20% |
| **Total** | **10** | **100%** |

| Status | Count |
|--------|-------|
| Open | 6 |
| In Progress | 1 |
| Fixed | 2 |
| Closed | 1 |

---

**Last Updated:** 2026-03-20
**QA Lead:** HealthHub Connect QA Team
