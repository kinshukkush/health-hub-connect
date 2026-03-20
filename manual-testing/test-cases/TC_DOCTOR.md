# Doctor Test Cases

**Module:** Doctor Browse & Search
**Total Test Cases:** 15
**Sprint:** HealthHub Connect QA

---

## Test Cases Table

| TC_ID | Title | Precondition | Test Steps | Expected Result | Actual Result | Status | Priority | Type |
|-------|-------|--------------|------------|-----------------|---------------|--------|----------|------|
| TC_DOCTOR_001 | All doctors display on browse page | User logged in | 1. Navigate to /doctors<br>2. View list | All doctors displayed in grid | | Pending | High | Positive |
| TC_DOCTOR_002 | Search returns matching results | On doctors page | 1. Enter search term<br>2. View results | Matching doctors displayed | | Pending | High | Positive |
| TC_DOCTOR_003 | Search with no match shows empty state | On doctors page | 1. Search "XYZNONEXISTENT"<br>2. View results | Empty state message displayed | | Pending | Medium | Negative |
| TC_DOCTOR_004 | Filter by specialization | On doctors page | 1. Select Cardiology filter<br>2. View results | Only cardiologists displayed | | Pending | High | Positive |
| TC_DOCTOR_005 | Doctor profile displays complete info | On doctors list | 1. Click doctor card<br>2. View profile | Name, spec, experience, fees shown | | Pending | High | Positive |
| TC_DOCTOR_006 | Clicking doctor card opens profile | On doctors list | 1. Click any doctor card | Navigates to doctor profile page | | Pending | Medium | Positive |
| TC_DOCTOR_007 | Profile shows name and specialization | On doctor profile | 1. View profile details | Name and specialization visible | | Pending | Medium | Positive |
| TC_DOCTOR_008 | Profile shows experience and fees | On doctor profile | 1. View profile details | Experience years and fees visible | | Pending | Medium | Positive |
| TC_DOCTOR_009 | Pagination works correctly | Multiple pages of doctors | 1. Click Next page<br>2. View results | Next page doctors displayed | | Pending | Low | Positive |
| TC_DOCTOR_010 | Sort by fees works | On doctors page | 1. Select "Sort by Fees"<br>2. View order | Doctors sorted by fee amount | | Pending | Low | Positive |
| TC_DOCTOR_011 | Back navigation from profile | On doctor profile | 1. Click Back button | Returns to doctors list | | Pending | Low | Positive |
| TC_DOCTOR_012 | Search input accepts text | On doctors page | 1. Type in search box | Text appears in input | | Pending | Low | Positive |
| TC_DOCTOR_013 | Specialization dropdown works | On doctors page | 1. Open specialization filter<br>2. Select option | Filter applied | | Pending | Medium | Positive |
| TC_DOCTOR_014 | Multiple doctors display unique info | On doctors page | 1. View multiple cards | Each card shows different doctor | | Pending | Low | Positive |
| TC_DOCTOR_015 | Doctors list page elements verify | On doctors page | 1. Check all elements present | Search, filter, cards visible | | Pending | Medium | Positive |

---

## Test Execution Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | 15 |
| Executed | 0 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Pass Rate | - |

---

**Last Updated:** 2026-03-20
**Test Engineer:** QA Automation Team
