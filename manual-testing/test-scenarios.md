# MediTrack - Test Scenarios
**Version:** 1.0  
**Date:** January 2, 2026

---

## 1. User Registration & Authentication

### TS-001: User Registration
**Module:** Authentication  
**Priority:** High  
**Description:** Verify user can register with valid details

**Test Scenarios:**
1. User registers with valid email, password, and personal details
2. User registers with existing email (should fail)
3. User registers with weak password (should fail)
4. User registers with invalid email format (should fail)
5. User registers with missing mandatory fields (should fail)
6. User receives email verification (if applicable)

---

### TS-002: User Login
**Module:** Authentication  
**Priority:** High  
**Description:** Verify user can login with valid credentials

**Test Scenarios:**
1. User logs in with valid email and password
2. User logs in with invalid email (should fail)
3. User logs in with invalid password (should fail)
4. User logs in with unregistered email (should fail)
5. User account lockout after multiple failed attempts
6. Remember me functionality
7. Session persistence across browser refresh

---

### TS-003: Password Management
**Module:** Authentication  
**Priority:** High  
**Description:** Verify password reset and change functionality

**Test Scenarios:**
1. User requests password reset with valid email
2. User resets password using valid reset link
3. User changes password from settings page
4. Password reset link expires after time limit
5. Old password cannot be reused after reset

---

## 2. Medicine Search & Discovery

### TS-004: Medicine Search
**Module:** Search  
**Priority:** High  
**Description:** Verify medicine search functionality

**Test Scenarios:**
1. User searches medicine by name
2. User searches medicine by generic/salt name
3. User searches with partial medicine name
4. User searches with invalid/non-existent medicine name
5. Search results display relevant medicines
6. Search filters work correctly (category, price range, availability)
7. Search results are sorted correctly
8. Auto-suggestions work during typing

---

### TS-005: Medicine Details
**Module:** Product Details  
**Priority:** Medium  
**Description:** Verify medicine detail page displays correct information

**Test Scenarios:**
1. Medicine detail page displays name, price, composition
2. Medicine substitutes are shown (same salt)
3. Dosage and usage instructions are visible
4. Side effects and warnings are displayed
5. Availability status is shown
6. Manufacturer information is present

---

## 3. Shopping Cart Operations

### TS-006: Add to Cart
**Module:** Cart  
**Priority:** High  
**Description:** Verify add to cart functionality

**Test Scenarios:**
1. User adds medicine to cart
2. Cart badge updates with item count
3. User adds multiple quantities of same medicine
4. User adds prescription-required medicine without prescription
5. User adds out-of-stock medicine (should fail)
6. Cart persists across sessions (logged-in users)

---

### TS-007: Cart Management
**Module:** Cart  
**Priority:** High  
**Description:** Verify cart modification operations

**Test Scenarios:**
1. User increases quantity of medicine in cart
2. User decreases quantity of medicine in cart
3. User removes medicine from cart
4. Cart calculates total price correctly
5. Discount/coupon code is applied correctly
6. Cart shows accurate item count
7. Empty cart displays appropriate message

---

## 4. Prescription Upload

### TS-008: Prescription Upload
**Module:** Prescription  
**Priority:** High  
**Description:** Verify prescription upload functionality

**Test Scenarios:**
1. User uploads valid prescription (JPG, PNG, PDF)
2. User uploads invalid file format (should fail)
3. User uploads file exceeding size limit (should fail)
4. Multiple prescriptions can be uploaded
5. Prescription preview is displayed
6. User can delete uploaded prescription
7. Order with prescription-required medicines requires prescription

---

## 5. Checkout & Order Placement

### TS-009: Address Management
**Module:** Checkout  
**Priority:** High  
**Description:** Verify address selection and management

**Test Scenarios:**
1. User adds new delivery address
2. User selects existing address
3. User edits saved address
4. User deletes saved address
5. Default address is pre-selected
6. Address validation for PIN code/area

---

### TS-010: Order Placement
**Module:** Checkout  
**Priority:** Critical  
**Description:** Verify order placement flow

**Test Scenarios:**
1. User places order with valid details
2. Order requires prescription for prescription medicines
3. Order summary displays correct items and prices
4. Payment method selection works
5. Order confirmation is displayed
6. Order confirmation email is sent
7. Order is saved in order history
8. Stock is updated after order placement

---

### TS-011: Payment Processing
**Module:** Payment  
**Priority:** High  
**Description:** Verify payment processing (mocked)

**Test Scenarios:**
1. User pays with valid card details (mocked)
2. Payment fails with invalid card (mocked)
3. Payment timeout scenario
4. Payment retry after failure
5. Multiple payment methods available (Card, UPI, COD)

---

## 6. Order History & Tracking

### TS-012: Order History
**Module:** Orders  
**Priority:** Medium  
**Description:** Verify order history display

**Test Scenarios:**
1. User views list of past orders
2. Orders are sorted by date (most recent first)
3. Order details are displayed correctly
4. Order status is shown (Pending, Confirmed, Delivered)
5. User can filter orders by status/date
6. Download invoice for completed orders

---

### TS-013: Order Tracking
**Module:** Orders  
**Priority:** Medium  
**Description:** Verify order tracking functionality

**Test Scenarios:**
1. User can track order status
2. Order timeline is displayed
3. Estimated delivery date is shown
4. User receives status update notifications

---

## 7. Doctor Appointments (Health Hub Feature)

### TS-014: Doctor Search & Booking
**Module:** Appointments  
**Priority:** High  
**Description:** Verify doctor appointment booking

**Test Scenarios:**
1. User searches doctors by specialization
2. User searches doctors by name
3. User views doctor profile and availability
4. User books appointment slot
5. Appointment requires approval
6. User receives appointment confirmation
7. User can view upcoming appointments
8. User can cancel appointment

---

## 8. Medical Records

### TS-015: Medical Records Management
**Module:** Medical Records  
**Priority:** Medium  
**Description:** Verify medical records functionality

**Test Scenarios:**
1. User uploads medical report
2. User views medical history
3. User downloads medical report
4. User deletes medical record
5. Medical records are secure and private

---

## 9. User Profile & Settings

### TS-016: Profile Management
**Module:** Settings  
**Priority:** Medium  
**Description:** Verify user profile updates

**Test Scenarios:**
1. User updates personal information
2. User updates email address
3. User updates phone number
4. User uploads profile picture
5. Changes are saved and reflected immediately

---

### TS-017: Theme & Preferences
**Module:** Settings  
**Priority:** Low  
**Description:** Verify theme and preference settings

**Test Scenarios:**
1. User switches to dark mode
2. User switches to light mode
3. User selects system theme
4. Theme persists across sessions
5. User manages notification preferences

---

## 10. Admin Dashboard

### TS-018: Admin - User Management
**Module:** Admin  
**Priority:** High  
**Description:** Verify admin can manage users

**Test Scenarios:**
1. Admin views list of all users
2. Admin can search and filter users
3. Admin can view user details
4. Admin can activate/deactivate users

---

### TS-019: Admin - Appointment Management
**Module:** Admin  
**Priority:** High  
**Description:** Verify admin can manage appointments

**Test Scenarios:**
1. Admin views all appointments
2. Admin can approve/reject appointments
3. Admin can reschedule appointments
4. Admin views appointment statistics

---

### TS-020: Admin - Analytics
**Module:** Admin  
**Priority:** Medium  
**Description:** Verify admin dashboard analytics

**Test Scenarios:**
1. Dashboard displays total users count
2. Dashboard displays total orders count
3. Dashboard displays revenue statistics
4. Dashboard displays appointment statistics
5. Charts and graphs render correctly

---

## 11. Security & Authorization

### TS-021: Access Control
**Module:** Security  
**Priority:** Critical  
**Description:** Verify role-based access control

**Test Scenarios:**
1. Unauthenticated users cannot access protected routes
2. Patients cannot access admin dashboard
3. JWT token expires after timeout
4. Invalid/expired token redirects to login
5. CORS policy prevents unauthorized origins

---

### TS-022: Data Privacy
**Module:** Security  
**Priority:** Critical  
**Description:** Verify sensitive data protection

**Test Scenarios:**
1. Passwords are hashed (not visible in response)
2. User can only view their own medical records
3. API endpoints validate authorization headers
4. Prescription images are stored securely

---

## 12. API Testing Scenarios

### TS-023: API Validation
**Module:** API  
**Priority:** High  
**Description:** Verify API endpoints work correctly

**Test Scenarios:**
1. POST /api/auth/register - creates new user
2. POST /api/auth/login - returns JWT token
3. GET /api/medicines - returns medicine list
4. POST /api/cart/add - adds item to cart
5. GET /api/orders - returns user orders
6. All endpoints return correct status codes
7. Error responses have proper format
8. API validates request payloads
9. API rate limiting works

---

## 13. Performance & Load

### TS-024: Performance Testing
**Module:** Performance  
**Priority:** Medium  
**Description:** Verify application performance

**Test Scenarios:**
1. Page load time is under 3 seconds
2. API response time is under 500ms
3. Medicine search returns results quickly
4. Image loading is optimized
5. Application handles 100+ concurrent users

---

## 14. Cross-Browser & Responsive

### TS-025: Browser Compatibility
**Module:** Compatibility  
**Priority:** High  
**Description:** Verify application works across browsers

**Test Scenarios:**
1. Application works on Chrome
2. Application works on Firefox
3. Application works on Edge
4. Application works on Safari
5. All features work consistently across browsers

---

### TS-026: Mobile Responsiveness
**Module:** Responsive Design  
**Priority:** High  
**Description:** Verify mobile/tablet compatibility

**Test Scenarios:**
1. Application is usable on mobile devices
2. Application is usable on tablets
3. Touch interactions work correctly
4. Layout adjusts properly for different screen sizes
5. Navigation menu adapts for mobile

---

## Summary

| Category | Total Scenarios |
|----------|----------------|
| Authentication | 3 |
| Medicine & Search | 2 |
| Cart & Checkout | 6 |
| Orders | 2 |
| Appointments | 1 |
| Medical Records | 1 |
| Profile & Settings | 2 |
| Admin | 3 |
| Security | 2 |
| API | 1 |
| Performance | 1 |
| Compatibility | 2 |
| **Total** | **26 Scenarios** |

---

**Document Status:** Approved  
**Last Updated:** January 2, 2026
