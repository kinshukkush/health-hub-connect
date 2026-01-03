# API Tests for MediTrack

Comprehensive API test suite for MediTrack backend using Postman.

## 📋 Overview

This API test suite validates:
- ✅ Authentication endpoints
- ✅ Doctor management APIs
- ✅ Appointment booking APIs
- ✅ Medical records APIs
- ✅ Error handling
- ✅ Authorization checks
- ✅ Response time validation

## 🚀 Getting Started

### Prerequisites

- Postman installed (Desktop App or Web)
- Newman (for CLI execution)
- MediTrack backend running

### Installation

#### Option 1: Using Postman App

1. Open Postman
2. Click Import
3. Select `MediTrack_API_Tests.postman_collection.json`
4. Import the collection

#### Option 2: Using Newman (CLI)

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

## 🧪 Running Tests

### Using Postman App

1. Open the imported collection
2. Click on "Run Collection" button
3. Configure test run settings
4. Click "Run MediTrack API Tests"

### Using Newman (Command Line)

#### Run all tests

```bash
newman run MediTrack_API_Tests.postman_collection.json
```

#### Run with environment variables

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  --env-var "base_url=http://localhost:5000"
```

#### Generate HTML report

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  -r htmlextra \
  --reporter-htmlextra-export ./reports/api-test-report.html
```

#### Run with detailed output

```bash
newman run MediTrack_API_Tests.postman_collection.json -r cli,json \
  --reporter-json-export ./reports/newman-report.json
```

## 🔧 Configuration

### Collection Variables

Update these variables in the collection:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | http://localhost:5000 | Backend API base URL |
| `test_email` | apitest@example.com | Test user email |
| `test_password` | Test@1234 | Test user password |
| `auth_token` | (auto-generated) | JWT authentication token |
| `user_id` | (auto-generated) | Logged-in user ID |

### Environment Setup

Create a Postman environment with:

```json
{
  "name": "MediTrack Local",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:5000",
      "enabled": true
    },
    {
      "key": "test_email",
      "value": "apitest@example.com",
      "enabled": true
    },
    {
      "key": "test_password",
      "value": "Test@1234",
      "enabled": true
    }
  ]
}
```

## 📊 Test Cases Covered

### Authentication (3 tests)

#### 1. Register New User
- **Method**: POST
- **Endpoint**: `/api/auth/register`
- **Tests**:
  - Status code is 201
  - Response contains user data
  - Password is not returned
  - Response time < 2000ms

#### 2. Login User
- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Tests**:
  - Status code is 200
  - Response contains JWT token
  - Token is valid JWT format
  - Response contains user data
  - Response time < 1000ms
  - Auto-saves token for subsequent requests

#### 3. Login with Invalid Credentials
- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Tests**:
  - Status code is 400 or 401
  - Error message is present
  - No token is returned

### Doctors API (2 tests)

#### 4. Get All Doctors
- **Method**: GET
- **Endpoint**: `/api/doctors`
- **Tests**:
  - Status code is 200
  - Response is an array
  - Doctors have required fields (name, specialization, email)
  - Response time < 500ms

#### 5. Get Doctor by ID
- **Method**: GET
- **Endpoint**: `/api/doctors/:id`
- **Tests**:
  - Status code is 200
  - Response is an object
  - Doctor has complete profile

### Appointments API (2 tests)

#### 6. Get User Appointments
- **Method**: GET
- **Endpoint**: `/api/appointments`
- **Tests**:
  - Status code is 200
  - Response is an array
  - Appointments have required fields (date, status, doctor)

#### 7. Create Appointment
- **Method**: POST
- **Endpoint**: `/api/appointments`
- **Tests**:
  - Status code is 201
  - Appointment is created with pending status
  - Appointment has correct date

### Medical Records API (1 test)

#### 8. Get User Medical Records
- **Method**: GET
- **Endpoint**: `/api/records`
- **Tests**:
  - Status code is 200
  - Response is an array

### Error Handling (2 tests)

#### 9. Unauthorized Request
- **Method**: GET
- **Endpoint**: `/api/appointments` (without auth token)
- **Tests**:
  - Status code is 401
  - Error message is present

#### 10. Invalid Endpoint
- **Method**: GET
- **Endpoint**: `/api/invalid-endpoint`
- **Tests**:
  - Status code is 404

## 📈 Test Execution Flow

```
1. Register New User
   ↓
2. Login User (saves token)
   ↓
3. Get All Doctors (uses token)
   ↓
4. Create Appointment (uses token)
   ↓
5. Get User Appointments (uses token)
   ↓
6. Error Handling Tests
```

## 🎯 Assertions Covered

### HTTP Status Codes
- ✅ 200 OK
- ✅ 201 Created
- ✅ 400 Bad Request
- ✅ 401 Unauthorized
- ✅ 404 Not Found

### Response Validation
- ✅ Response structure validation
- ✅ Required fields presence
- ✅ Data type validation
- ✅ JWT token format validation
- ✅ Sensitive data exclusion (password)

### Performance
- ✅ Response time thresholds
- ✅ API latency monitoring

### Security
- ✅ Authentication required for protected endpoints
- ✅ Token-based authorization
- ✅ Error message validation

## 📝 Sample Test Scripts

### Pre-request Script Example

```javascript
// Set timestamp for unique data
pm.collectionVariables.set("timestamp", Date.now());

// Generate random email
const randomEmail = `test${Date.now()}@example.com`;
pm.collectionVariables.set("random_email", randomEmail);
```

### Test Script Example

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
    pm.expect(jsonData.length).to.be.greaterThan(0);
});

// Save data for subsequent requests
pm.collectionVariables.set("doctor_id", pm.response.json()[0]._id);
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra
      
      - name: Run API Tests
        run: |
          newman run api-tests/MediTrack_API_Tests.postman_collection.json \
            --env-var "base_url=${{ secrets.API_BASE_URL }}" \
            -r htmlextra \
            --reporter-htmlextra-export ./reports/api-report.html
      
      - name: Upload Test Report
        uses: actions/upload-artifact@v2
        with:
          name: api-test-report
          path: ./reports/
```

## 📊 Reporting

### Newman HTML Report

Generate detailed HTML report:

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  -r htmlextra \
  --reporter-htmlextra-export ./reports/api-test-report.html \
  --reporter-htmlextra-title "MediTrack API Tests" \
  --reporter-htmlextra-displayProgressBar
```

### JSON Report for Analysis

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  -r json \
  --reporter-json-export ./reports/newman-report.json
```

## 🐛 Debugging

### View Request/Response

```bash
newman run MediTrack_API_Tests.postman_collection.json -r cli --verbose
```

### Run Single Folder

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  --folder "Authentication"
```

### Run with Delay

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  --delay-request 1000
```

## 📋 Test Data Management

### Dynamic Data Generation

```javascript
// In Pre-request Script
const timestamp = Date.now();
pm.collectionVariables.set("unique_email", `user${timestamp}@example.com`);
pm.collectionVariables.set("random_number", Math.floor(Math.random() * 1000));
```

### Data-Driven Testing

Create a CSV file with test data:

```csv
email,password
user1@example.com,Pass@123
user2@example.com,Pass@456
```

Run with data file:

```bash
newman run MediTrack_API_Tests.postman_collection.json \
  -d test-data.csv
```

## ✅ Best Practices

1. **Token Management**
   - Login test automatically saves token
   - Token is reused in subsequent requests
   - Token is stored in collection variables

2. **Test Independence**
   - Each test should work independently
   - Clean up test data after execution
   - Use unique identifiers for test data

3. **Error Handling**
   - Test both success and failure scenarios
   - Validate error messages
   - Check appropriate status codes

4. **Performance Testing**
   - Set response time thresholds
   - Monitor API latency
   - Identify slow endpoints

5. **Security Testing**
   - Test authentication requirements
   - Validate authorization checks
   - Ensure sensitive data is protected

## 🔍 Troubleshooting

### Tests Failing?

**Issue**: Connection refused
- **Solution**: Ensure backend server is running on correct port

**Issue**: 401 Unauthorized
- **Solution**: Check if login test ran successfully and saved token

**Issue**: Invalid data errors
- **Solution**: Verify test user exists or update test data variables

**Issue**: Timeout errors
- **Solution**: Increase Newman timeout: `--timeout-request 10000`

### Common Commands

```bash
# Check Newman version
newman --version

# List collection details
newman run MediTrack_API_Tests.postman_collection.json --list

# Run with specific iteration
newman run MediTrack_API_Tests.postman_collection.json -n 3

# Export environment after run
newman run MediTrack_API_Tests.postman_collection.json \
  --export-environment updated-env.json
```

## 📚 Resources

- [Postman Documentation](https://learning.postman.com/)
- [Newman Documentation](https://github.com/postmanlabs/newman)
- [Postman Test Scripts](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Newman Reporters](https://github.com/postmanlabs/newman#reporters)

## 📞 Support

For API test issues:
1. Check backend server logs
2. Verify API endpoints are accessible
3. Review Postman console for detailed errors
4. Check authentication token validity

---

**Last Updated**: January 2, 2026  
**Test Suite Version**: 1.0.0  
**Total Tests**: 10 API tests
