# Authentication Test Cases

**Module:** Authentication & Authorization
**Total Test Cases:** 20
**Sprint:** HealthHub Connect QA

---

## Test Cases Table

| TC_ID | Title | Precondition | Test Steps | Expected Result | Actual Result | Status | Priority | Type |
|-------|-------|--------------|------------|-----------------|---------------|--------|----------|------|
| TC_AUTH_001 | Valid login with correct credentials | User registered with valid email | 1. Navigate to /auth<br>2. Enter registered email<br>3. Enter correct password<br>4. Click Login | User redirected to dashboard, session created | | Pending | High | Positive |
| TC_AUTH_002 | Login with incorrect password | User registered | 1. Navigate to /auth<br>2. Enter registered email<br>3. Enter wrong password<br>4. Click Login | Error message displayed, user stays on login page | | Pending | High | Negative |
| TC_AUTH_003 | Login with unregistered email | No account exists | 1. Navigate to /auth<br>2. Enter unregistered email<br>3. Enter any password<br>4. Click Login | Error message "Invalid credentials" displayed | | Pending | High | Negative |
| TC_AUTH_004 | Login with empty email field | On login page | 1. Leave email empty<br>2. Enter password<br>3. Click Login | Validation error shown, form not submitted | | Pending | Medium | Negative |
| TC_AUTH_005 | Login with empty password field | On login page | 1. Enter email<br>2. Leave password empty<br>3. Click Login | Validation error shown, form not submitted | | Pending | Medium | Negative |
| TC_AUTH_006 | Valid new user registration | No account exists | 1. Navigate to /auth<br>2. Click Sign Up<br>3. Enter valid name, email, password<br>4. Click Register | Account created, redirected to dashboard | | Pending | High | Positive |
| TC_AUTH_007 | Registration with duplicate email | Existing account | 1. Navigate to /auth<br>2. Click Sign Up<br>3. Enter existing email<br>4. Complete form | Error "Email already exists" displayed | | Pending | High | Negative |
| TC_AUTH_008 | Registration with weak password | On register page | 1. Enter valid name, email<br>2. Enter password < 6 chars<br>3. Click Register | Password strength error displayed | | Pending | Medium | Negative |
| TC_AUTH_009 | Registration with missing name | On register page | 1. Leave name empty<br>2. Enter email, password<br>3. Click Register | Validation error for name field | | Pending | Medium | Negative |
| TC_AUTH_010 | Logout clears session and token | User logged in | 1. Click Logout<br>2. Navigate to protected route | User redirected to login, session cleared | | Pending | High | Positive |
| TC_AUTH_011 | Protected route blocks unauthenticated | User not logged in | 1. Navigate to /dashboard<br>2. Without logging in | Redirected to /auth page | | Pending | High | Security |
| TC_AUTH_012 | JWT token expiry handling | User logged in | 1. Wait for token expiry<br>2. Make API request | 401 response, redirect to login | | Pending | High | Security |
| TC_AUTH_013 | Remember me session persistence | On login page | 1. Check "Remember me"<br>2. Login<br>3. Close browser<br>4. Reopen | Session persists, user logged in | | Pending | Medium | Positive |
| TC_AUTH_014 | Password field masking toggle | On login/register page | 1. Enter password<br>2. Click eye icon | Password visible when toggled | | Pending | Low | UX |
| TC_AUTH_015 | Login redirect after accessing protected route | User not logged in | 1. Navigate to /appointments<br>2. Login on redirect | Redirected back to attempted page | | Pending | Medium | Positive |
| TC_AUTH_016 | Admin login accesses admin dashboard | Admin account exists | 1. Login as admin<br>2. Navigate to /admin | Admin dashboard loads, no redirect | | Pending | High | Positive |
| TC_AUTH_017 | Non-admin blocked from admin routes | Regular user logged in | 1. Navigate to /admin | Redirected to dashboard or 403 page | | Pending | High | Security |
| TC_AUTH_018 | Profile update saves correctly | User logged in | 1. Navigate to /profile<br>2. Update name/phone<br>3. Click Save | Success toast, data persisted | | Pending | Medium | Positive |
| TC_AUTH_019 | Password change with correct old password | User logged in | 1. Navigate to /profile<br>2. Enter old + new password<br>3. Submit | Password changed, success toast | | Pending | High | Positive |
| TC_AUTH_020 | Password change with wrong old password | User logged in | 1. Navigate to /profile<br>2. Enter wrong old password<br>3. Submit | Error "Current password incorrect" | | Pending | High | Negative |

---

## Test Execution Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | 20 |
| Executed | 0 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Pass Rate | - |

---

**Last Updated:** 2026-03-20
**Test Engineer:** QA Automation Team
