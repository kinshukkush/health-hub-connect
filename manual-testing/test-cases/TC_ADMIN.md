# Admin Dashboard Test Cases

**Module:** Admin Dashboard & User Management
**Total Test Cases:** 20
**Sprint:** HealthHub Connect QA

---

## Test Cases Table

| TC_ID | Title | Precondition | Test Steps | Expected Result | Actual Result | Status | Priority | Type |
|-------|-------|--------------|------------|-----------------|---------------|--------|----------|------|
| TC_ADMIN_001 | Admin can login and reach dashboard | Admin account exists | 1. Login with admin credentials<br>2. Navigate to /admin | Admin dashboard loads | | Pending | Critical | Positive |
| TC_ADMIN_002 | Dashboard displays correct stats | Admin logged in | 1. View dashboard<br>2. Check stats | Users, doctors, appointments counts shown | | Pending | High | Positive |
| TC_ADMIN_003 | Admin can view all users list | Admin logged in | 1. Click Users in sidebar<br>2. View table | All users displayed in table | | Pending | High | Positive |
| TC_ADMIN_004 | Admin can toggle user role | Admin logged in, users exist | 1. Go to Users<br>2. Change role dropdown<br>3. Select new role | Role updated, success toast | | Pending | High | Positive |
| TC_ADMIN_005 | Admin can delete user with confirmation | Admin logged in, multiple users | 1. Go to Users<br>2. Click Delete<br>3. Confirm | User deleted, count decreased | | Pending | High | Positive |
| TC_ADMIN_006 | User delete shows confirmation dialog | On users page | 1. Click Delete button | Confirmation dialog appears | | Pending | Medium | Positive |
| TC_ADMIN_007 | Users table displays all columns | On users page | 1. View table headers | Name, email, role columns visible | | Pending | Low | Positive |
| TC_ADMIN_008 | Admin can view all appointments | Admin logged in | 1. Click Appointments in sidebar | All appointments displayed | | Pending | High | Positive |
| TC_ADMIN_009 | Admin can approve appointment | Pending appointment exists | 1. Go to Appointments<br>2. Click Approve | Status changed to Approved | | Pending | Critical | Positive |
| TC_ADMIN_010 | Admin can reject appointment | Pending appointment exists | 1. Go to Appointments<br>2. Click Reject | Status changed to Rejected | | Pending | Critical | Positive |
| TC_ADMIN_011 | Admin can update status inline | On appointments page | 1. Change status dropdown<br>2. Select status | Status updated immediately | | Pending | High | Positive |
| TC_ADMIN_012 | Appointments table renders | On appointments page | 1. View table | Table with appointments displayed | | Pending | Medium | Positive |
| TC_ADMIN_013 | Admin can search users | On users page | 1. Enter search term<br>2. View results | Filtered users displayed | | Pending | Medium | Positive |
| TC_ADMIN_014 | Admin can search doctors | On doctors page | 1. Enter search term<br>2. View results | Filtered doctors displayed | | Pending | Medium | Positive |
| TC_ADMIN_015 | Admin can filter appointments | On appointments page | 1. Select status filter<br>2. View results | Filtered appointments displayed | | Pending | Medium | Positive |
| TC_ADMIN_016 | Total users stat displays | On dashboard | 1. View stats card | Users count visible | | Pending | Low | Positive |
| TC_ADMIN_017 | Total doctors stat displays | On dashboard | 1. View stats card | Doctors count visible | | Pending | Low | Positive |
| TC_ADMIN_018 | Total appointments stat displays | On dashboard | 1. View stats card | Appointments count visible | | Pending | Low | Positive |
| TC_ADMIN_019 | Admin sidebar navigation works | Admin logged in | 1. Click each sidebar link | Navigates to correct section | | Pending | Medium | Positive |
| TC_ADMIN_020 | Admin dashboard elements verify | On dashboard | 1. Check all elements | Stats, sidebar, content visible | | Pending | Medium | Positive |

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
