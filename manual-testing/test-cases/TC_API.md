# API Test Cases

**Module:** Backend API Endpoints
**Total Test Cases:** 30
**Sprint:** HealthHub Connect QA

---

## Test Cases Table

| TC_ID | Title | Precondition | Test Steps | Expected Result | Actual Result | Status | Priority | Type |
|-------|-------|--------------|------------|-----------------|---------------|--------|----------|------|
| TC_API_001 | POST /api/auth/register - valid data | No account exists | 1. Send POST with valid name, email, password | 201 Created, user object returned | | Pending | Critical | Positive |
| TC_API_002 | POST /api/auth/register - duplicate email | Account exists | 1. Send POST with existing email | 400 Bad Request, error message | | Pending | High | Negative |
| TC_API_003 | POST /api/auth/register - missing name | On register endpoint | 1. Send POST without name field | 400 Bad Request, validation error | | Pending | Medium | Negative |
| TC_API_004 | POST /api/auth/register - missing email | On register endpoint | 1. Send POST without email field | 400 Bad Request, validation error | | Pending | Medium | Negative |
| TC_API_005 | POST /api/auth/register - missing password | On register endpoint | 1. Send POST without password field | 400 Bad Request, validation error | | Pending | Medium | Negative |
| TC_API_006 | POST /api/auth/register - weak password | On register endpoint | 1. Send POST with password < 6 chars | 400 Bad Request, password error | | Pending | Medium | Negative |
| TC_API_007 | POST /api/auth/login - valid credentials | Account exists | 1. Send POST with email, password | 200 OK, token + user returned | | Pending | Critical | Positive |
| TC_API_008 | POST /api/auth/login - wrong password | Account exists | 1. Send POST with wrong password | 400/401, error message | | Pending | High | Negative |
| TC_API_009 | POST /api/auth/login - unregistered email | No account | 1. Send POST with unregistered email | 400/401, error message | | Pending | High | Negative |
| TC_API_010 | POST /api/auth/login - empty body | On login endpoint | 1. Send POST with empty body | 400 Bad Request | | Pending | Medium | Negative |
| TC_API_011 | GET /api/auth/profile - valid token | User logged in | 1. Send GET with valid Bearer token | 200 OK, profile data returned | | Pending | High | Positive |
| TC_API_012 | GET /api/auth/profile - no token | On profile endpoint | 1. Send GET without Authorization | 401 Unauthorized | | Pending | High | Negative |
| TC_API_013 | GET /api/auth/profile - invalid token | On profile endpoint | 1. Send GET with invalid token | 401 Unauthorized, token error | | Pending | High | Negative |
| TC_API_014 | GET /api/auth/profile - malformed token | On profile endpoint | 1. Send GET with malformed JWT | 401 Unauthorized | | Pending | Medium | Negative |
| TC_API_015 | GET /api/doctors - all doctors | User authenticated | 1. Send GET to /api/doctors | 200 OK, array of doctors | | Pending | High | Positive |
| TC_API_016 | GET /api/doctors - no auth | On doctors endpoint | 1. Send GET without token | 401 Unauthorized | | Pending | High | Negative |
| TC_API_017 | GET /api/doctors - with search query | On doctors endpoint | 1. Send GET with ?search=cardio | 200 OK, filtered results | | Pending | Medium | Positive |
| TC_API_018 | GET /api/doctors - with specialization | On doctors endpoint | 1. Send GET with ?specialization=X | 200 OK, filtered by spec | | Pending | Medium | Positive |
| TC_API_019 | GET /api/doctors - invalid query | On doctors endpoint | 1. Send GET with invalid param | 200 OK, all doctors returned | | Pending | Low | Positive |
| TC_API_020 | GET /api/doctors/:id - valid | Doctor exists | 1. Send GET with valid ObjectId | 200 OK, doctor object | | Pending | High | Positive |
| TC_API_021 | GET /api/doctors/:id - invalid format | On doctor endpoint | 1. Send GET with invalid ObjectId | 400 Bad Request | | Pending | Medium | Negative |
| TC_API_022 | GET /api/doctors/:id - non-existent | On doctor endpoint | 1. Send GET with valid but non-existent id | 404 Not Found | | Pending | Medium | Negative |
| TC_API_023 | GET /api/appointments - as user | User logged in | 1. Send GET with user token | 200 OK, user appointments | | Pending | High | Positive |
| TC_API_024 | GET /api/appointments - as admin | Admin logged in | 1. Send GET with admin token | 200 OK, all appointments | | Pending | High | Positive |
| TC_API_025 | GET /api/appointments - no token | On appointments endpoint | 1. Send GET without token | 401 Unauthorized | | Pending | High | Negative |
| TC_API_026 | POST /api/appointments - valid booking | User logged in, doctor exists | 1. Send POST with doctorId, date, time, reason | 201 Created, appointment object | | Pending | Critical | Positive |
| TC_API_027 | POST /api/appointments - missing doctorId | On appointments endpoint | 1. Send POST without doctorId | 400 Bad Request | | Pending | High | Negative |
| TC_API_028 | POST /api/appointments - missing date | On appointments endpoint | 1. Send POST without date | 400 Bad Request | | Pending | High | Negative |
| TC_API_029 | PUT /api/appointments/:id - admin update | Admin logged in | 1. Send PUT with new status | 200 OK, status updated | | Pending | High | Positive |
| TC_API_030 | PUT /api/appointments/:id - user update | User logged in | 1. User sends PUT to update status | 403 Forbidden | | Pending | High | Negative |

---

## Test Execution Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | 30 |
| Executed | 0 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Pass Rate | - |

---

**Last Updated:** 2026-03-20
**Test Engineer:** QA Automation Team
