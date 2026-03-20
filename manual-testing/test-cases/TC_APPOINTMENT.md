# Appointment Test Cases

**Module:** Appointment Booking & Management
**Total Test Cases:** 25
**Sprint:** HealthHub Connect QA

---

## Test Cases Table

| TC_ID | Title | Precondition | Test Steps | Expected Result | Actual Result | Status | Priority | Type |
|-------|-------|--------------|------------|-----------------|---------------|--------|----------|------|
| TC_APPT_001 | User can search for doctor by name | User logged in | 1. Navigate to Appointments<br>2. Enter doctor name in search<br>3. View results | Matching doctors displayed | | Pending | High | Positive |
| TC_APPT_002 | Filter doctors by specialization | User logged in | 1. Navigate to Appointments<br>2. Select specialization filter<br>3. View results | Filtered doctors displayed | | Pending | High | Positive |
| TC_APPT_003 | View doctor profile details | On doctors list | 1. Click doctor card<br>2. View profile page | Name, specialization, experience, fees displayed | | Pending | Medium | Positive |
| TC_APPT_004 | Book appointment successfully | User logged in, doctors available | 1. Select doctor<br>2. Enter date, time, reason<br>3. Submit booking | Appointment created, confirmation shown | | Pending | Critical | Positive |
| TC_APPT_005 | Booking shows confirmation message | Appointment booked | 1. Complete booking flow<br>2. View response | Success toast with appointment details | | Pending | High | Positive |
| TC_APPT_006 | View appointment history | User has appointments | 1. Navigate to My Appointments<br>2. View list | All appointments displayed with status | | Pending | High | Positive |
| TC_APPT_007 | Cancel pending appointment | User has pending appointment | 1. Go to appointment history<br>2. Click Cancel<br>3. Confirm | Appointment status changed to cancelled | | Pending | High | Positive |
| TC_APPT_008 | Admin can approve appointment | Admin logged in, pending appointment | 1. Navigate to Admin > Appointments<br>2. Click Approve | Status updated to Approved | | Pending | Critical | Positive |
| TC_APPT_009 | Admin can reject appointment | Admin logged in, pending appointment | 1. Navigate to Admin > Appointments<br>2. Click Reject<br>3. Enter reason | Status updated to Rejected, reason saved | | Pending | Critical | Positive |
| TC_APPT_010 | Appointment status reflects in user view | Appointment status changed | 1. User views appointment<br>2. Check status | Updated status displayed | | Pending | High | Positive |
| TC_APPT_011 | Appointment form validation - missing doctor | On booking page | 1. Skip doctor selection<br>2. Fill other fields<br>3. Submit | Error "Please select a doctor" | | Pending | Medium | Negative |
| TC_APPT_012 | Appointment form validation - missing date | Doctor selected | 1. Skip date field<br>2. Fill time, reason<br>3. Submit | Error "Date required" | | Pending | Medium | Negative |
| TC_APPT_013 | Appointment form validation - missing reason | Doctor, date selected | 1. Skip reason field<br>2. Submit | Error "Reason required" | | Pending | Medium | Negative |
| TC_APPT_014 | Double booking prevention | Appointment exists for slot | 1. Book same doctor, date, time | Error "Slot already booked" | | Pending | High | Negative |
| TC_APPT_015 | Past date validation | On booking page | 1. Select past date<br>2. Submit | Error "Cannot book past appointments" | | Pending | Medium | Negative |
| TC_APPT_016 | Appointment with future date | On booking page | 1. Select date 30 days out<br>2. Submit | Booking successful | | Pending | Medium | Positive |
| TC_APPT_017 | Appointment time slot validation | On booking page | 1. Select invalid time (25:00)<br>2. Submit | Validation error | | Pending | Low | Negative |
| TC_APPT_018 | Appointment list pagination | User has 20+ appointments | 1. View appointment history<br>2. Navigate pages | All appointments accessible via pagination | | Pending | Low | Positive |
| TC_APPT_019 | Appointment search by date | User has appointments | 1. Enter date in search<br>2. View results | Filtered appointments displayed | | Pending | Low | Positive |
| TC_APPT_020 | Delete confirmation dialog | Appointment selected | 1. Click Delete<br>2. View dialog | Confirmation dialog appears | | Pending | Medium | Positive |
| TC_APPT_021 | Appointment count displays correctly | On history page | 1. View appointment count | Correct count shown | | Pending | Low | Positive |
| TC_APPT_022 | Back navigation from doctor profile | On doctor profile | 1. Click Back button | Returns to doctors list | | Pending | Low | Positive |
| TC_APPT_023 | Search returns matching results | On search page | 1. Search "Cardio"<br>2. View results | Cardiologists displayed | | Pending | Medium | Positive |
| TC_APPT_024 | Search with no match shows empty state | On search page | 1. Search "XYZNONEXISTENT"<br>2. View results | Empty state message displayed | | Pending | Low | Negative |
| TC_APPT_025 | Appointment page accessible from nav | Any page | 1. Click Appointments in nav | Navigates to appointments page | | Pending | Medium | Positive |

---

## Test Execution Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | 25 |
| Executed | 0 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Pass Rate | - |

---

**Last Updated:** 2026-03-20
**Test Engineer:** QA Automation Team
