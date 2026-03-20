# Mobile & Responsive Test Cases

**Module:** Mobile UX & Responsive Design
**Total Test Cases:** 20
**Sprint:** HealthHub Connect QA

---

## Test Cases Table

| TC_ID | Title | Precondition | Test Steps | Expected Result | Actual Result | Status | Priority | Type |
|-------|-------|--------------|------------|-----------------|---------------|--------|----------|------|
| TC_MOBILE_001 | Responsive layout at 375px | On any page | 1. Set viewport to 375x667<br>2. View page | Content reflows correctly | | Pending | High | Positive |
| TC_MOBILE_002 | Responsive layout at 414px | On any page | 1. Set viewport to 414x896<br>2. View page | Content reflows correctly | | Pending | High | Positive |
| TC_MOBILE_003 | Responsive layout at 768px (tablet) | On any page | 1. Set viewport to 768x1024<br>2. View page | Tablet layout displayed | | Pending | Medium | Positive |
| TC_MOBILE_004 | Mobile navigation works | On mobile viewport | 1. Click hamburger menu<br>2. Select link | Navigation opens, link works | | Pending | High | Positive |
| TC_MOBILE_005 | Touch targets accessible size | On any interactive element | 1. Measure button size | Min 44x44 pixels | | Pending | Medium | Accessibility |
| TC_MOBILE_006 | Mobile keyboard appears on input | On form page | 1. Tap input field | Keyboard appears | | Pending | High | Positive |
| TC_MOBILE_007 | Forms usable on mobile keyboard | On login page | 1. Fill form fields | All fields editable | | Pending | High | Positive |
| TC_MOBILE_008 | Error messages readable on mobile | Form validation triggered | 1. Submit invalid form<br>2. View error | Error text readable, not cut off | | Pending | Medium | Positive |
| TC_MOBILE_009 | Loading state visible on mobile | During async operation | 1. Trigger action<br>2. View loading | Loading indicator displayed | | Pending | Low | Positive |
| TC_MOBILE_010 | Modal dialogs work on mobile | On page with modal | 1. Trigger modal<br>2. Interact | Modal opens, buttons clickable | | Pending | Medium | Positive |
| TC_MOBILE_011 | Swipe gestures work | On scrollable content | 1. Swipe up/down | Content scrolls | | Pending | Low | Positive |
| TC_MOBILE_012 | Bottom navigation accessible | On mobile viewport | 1. View bottom nav | Nav items visible, clickable | | Pending | Medium | Positive |
| TC_MOBILE_013 | Header renders on mobile | On mobile viewport | 1. View header | Logo, menu button visible | | Pending | Medium | Positive |
| TC_MOBILE_014 | Footer accessible on mobile | On mobile viewport | 1. Scroll to bottom<br>2. View footer | Footer links accessible | | Pending | Low | Positive |
| TC_MOBILE_015 | Images scale correctly on mobile | Page with images | 1. View images | Images fit viewport, not overflow | | Pending | Medium | Positive |
| TC_MOBILE_016 | Text readable without zoom | On mobile viewport | 1. Check font size | Text >= 16px, readable | | Pending | Medium | Accessibility |
| TC_MOBILE_017 | No horizontal scroll | On mobile viewport | 1. Check page width | No horizontal scrolling | | Pending | Medium | Positive |
| TC_MOBILE_018 | Deep links work on mobile | On mobile device | 1. Navigate to deep URL | Page loads correctly | | Pending | Medium | Positive |
| TC_MOBILE_019 | Back button behavior | On sub-page | 1. Click back | Returns to previous page | | Pending | Low | Positive |
| TC_MOBILE_020 | Page load time acceptable | On mobile network | 1. Measure load time | Loads within 10 seconds | | Pending | Medium | Performance |

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
