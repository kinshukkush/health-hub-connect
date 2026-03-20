<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=HealthHub%20Connect&fontSize=60&fontAlignY=35&animation=twinkling&fontColor=ffffff&desc=Comprehensive%20QA%20Automation%20Suite&descSize=20&descAlignY=55"/>

# 🏥 HealthHub Connect QA Automation Suite

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=2D9CDB&center=true&vCenter=true&multiline=true&repeat=true&width=650&height=100&lines=Enterprise-Grade+Healthcare+QA+Testing;Playwright+%7C+Postman+%7C+Appium+%7C+CI%2FCD;350%2B+Test+Cases+%7C+94.8%25+Pass+Rate" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://health-hub-connect-livid.vercel.app">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fhealth-hub-connect-livid.vercel.app&style=for-the-badge&logo=vercel&label=Live%20Demo" alt="Live Demo"/>
  </a>
  <a href="https://github.com/kinshukkush/health-hub-connect">
    <img src="https://img.shields.io/github/stars/kinshukkush/health-hub-connect?style=for-the-badge&logo=github&color=yellow" alt="Stars"/>
  </a>
  <a href="https://github.com/kinshukkush/health-hub-connect/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/kinshukkush/health-hub-connect/nightly-regression.yml?style=for-the-badge&logo=github-actions&label=CI%2FCD" alt="CI/CD"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Playwright-v1.40+-45BA63?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"/>
  <img src="https://img.shields.io/badge/Postman-Newman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman"/>
  <img src="https://img.shields.io/badge/Appium-v2.0+-6D3F9E?style=for-the-badge&logo=appium&logoColor=white" alt="Appium"/>
  <img src="https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tests-350+-success?style=for-the-badge" alt="Tests"/>
  <img src="https://img.shields.io/badge/Pass_Rate-94.8%25-brightgreen?style=for-the-badge" alt="Pass Rate"/>
  <img src="https://img.shields.io/badge/Coverage-85%25+-blue?style=for-the-badge" alt="Coverage"/>
  <img src="https://img.shields.io/badge/Browsers-3-informational?style=for-the-badge" alt="Browsers"/>
</p>

---

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

## 📋 Project Overview

**HealthHub Connect** is a comprehensive MERN stack healthcare platform with an enterprise-grade QA automation suite. This project demonstrates professional testing practices across web, mobile, and API testing, complete with CI/CD integration.

### 🎯 What This QA Suite Tests

| Feature | Description | Test Coverage |
|---------|-------------|---------------|
| 🔐 **Authentication** | Login, Registration, Session Management | 20 Tests |
| 📅 **Appointments** | Booking, Cancellation, Admin Approval | 25 Tests |
| 👨‍⚕️ **Doctor Browse** | Search, Filter, Profile View | 15 Tests |
| 📋 **Medical Records** | Upload, View, Delete Records | 25 Tests |
| 👤 **User Profile** | Profile Edit, Password Change | 25 Tests |
| 🛡️ **Admin Dashboard** | User Management, Stats, CRUD | 30 Tests |
| 🔌 **API Endpoints** | REST API Validation | 200+ Tests |
| 📱 **Mobile Web** | Responsive, Touch, Navigation | 50+ Tests |

---

<div align="center">

## 📊 Test Coverage Summary

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

| Test Type | Tool | Total Cases | Pass Rate | Status |
|-----------|------|-------------|-----------|--------|
| 🖥️ **Manual UI** | Manual Testing | 200+ | 95% | ✅ Complete |
| 🎭 **E2E Automation** | Playwright | 150+ | 92% | ✅ Complete |
| 🔌 **API Testing** | Postman + Newman | 200+ | 95% | ✅ Complete |
| 📱 **Mobile Testing** | Appium | 50+ | 88% | ✅ Complete |
| 🌐 **Cross-Browser** | Playwright (3 browsers) | All Suites | 90% | ✅ Complete |

### 📈 Defect Summary

| Severity | Count | Percentage |
|----------|-------|------------|
| 🔴 Critical | 12 | 6.0% |
| 🟠 Major | 45 | 22.5% |
| 🟡 Minor | 98 | 49.0% |
| 🟢 Trivial | 45 | 22.5% |
| **Total** | **200** | **100%** |

---

<div align="center">

## 🏗️ Architecture

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

```
📦 health-hub-connect-main/
├── 🎭 playwright-tests/           # Web E2E Automation
│   ├── 📄 pages/                  # Page Object Models (POM)
│   │   ├── BasePage.ts            # Base class with common methods
│   │   ├── LoginPage.ts           # Authentication pages
│   │   ├── RegistrationPage.ts    # User registration
│   │   ├── AppointmentPage.ts     # Appointment booking
│   │   ├── DoctorPage.ts          # Doctor browsing
│   │   ├── MedicalRecordsPage.ts  # Medical records
│   │   ├── AdminPage.ts           # Admin dashboard
│   │   ├── ProfilePage.ts         # User profile
│   │   └── DashboardPage.ts       # Main dashboard
│   ├── 🧪 tests/                  # Test Specifications
│   │   ├── auth.spec.ts           # 20 auth tests
│   │   ├── appointment.spec.ts    # 25 appointment tests
│   │   ├── doctor.spec.ts         # 25 doctor tests
│   │   ├── medical-records.spec.ts # 25 records tests
│   │   ├── admin-dashboard.spec.ts # 30 admin tests
│   │   ├── profile.spec.ts        # 25 profile tests
│   │   ├── login.spec.ts          # Legacy login tests
│   │   ├── search.spec.ts         # Search tests
│   │   └── cart.spec.ts           # Cart tests
│   ├── 🔧 utils/                  # Test Utilities
│   │   └── test-helpers.ts        # Helper functions
│   └── ⚙️ playwright.config.ts   # Configuration
│
├── 🔌 api-tests/                  # API Automation
│   ├── HealthHub-API-Tests.postman_collection.json
│   ├── postman-environment.json
│   └── README.md
│
├── 📱 appium-tests/               # Mobile Automation
│   ├── config/
│   │   └── appium.config.js       # Device capabilities
│   ├── tests/
│   │   ├── login.test.js          # Mobile login tests
│   │   ├── appointment.test.js    # Mobile appointment tests
│   │   └── navigation.test.js     # Navigation tests
│   └── utils/
│       └── mobile-helpers.js      # Mobile utilities
│
├── 📝 manual-testing/             # Manual Testing Docs
│   ├── test-plan.md               # Master Test Plan
│   ├── test-summary-report.md     # Execution Summary
│   ├── test-cases/                # Detailed Test Cases
│   │   ├── TC_AUTH.md             # 20 auth test cases
│   │   ├── TC_APPOINTMENT.md      # 25 appointment cases
│   │   ├── TC_DOCTOR.md           # 15 doctor cases
│   │   ├── TC_ADMIN.md            # 20 admin cases
│   │   ├── TC_API.md              # 30 API cases
│   │   └── TC_MOBILE.md           # 20 mobile cases
│   └── bug-reports/
│       └── BUG_REPORTS.md         # Defect tracking
│
├── 🔄 .github/workflows/          # CI/CD Pipelines
│   ├── nightly-regression.yml     # Nightly regression
│   ├── smoke-tests.yml            # Post-deploy smoke
│   └── pr-tests.yml               # PR validation
│
├── 🌐 Frontend/                   # React Frontend
├── ⚙️ Backend/                    # Node.js Backend
└── 📖 QA_PROJECT_README.md        # This file
```

---

<div align="center">

## 🚀 Quick Start

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

### Prerequisites

```bash
# Required Software
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Installation

```bash
# Clone the repository
git clone https://github.com/kinshukkush/health-hub-connect.git
cd health-hub-connect-main

# Install Playwright dependencies
cd playwright-tests
npm install
npx playwright install

# Install Newman for API tests
npm install -g newman newman-reporter-htmlextra

# Back to root
cd ..
```

---

<div align="center">

## 🧪 How to Run Tests

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

### 🎭 Playwright E2E Tests

```bash
cd playwright-tests

# Run all tests
npx playwright test

# Run smoke tests only
npx playwright test --grep @smoke

# Run regression tests
npx playwright test --grep @regression

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with UI mode (interactive)
npx playwright test --ui

# Run headed (see browser)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

### 🔌 API Tests (Newman)

```bash
cd api-tests

# Run all API tests
newman run HealthHub-API-Tests.postman_collection.json \
  -e postman-environment.json

# Run with HTML report
newman run HealthHub-API-Tests.postman_collection.json \
  -e postman-environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export report.html

# Run specific folder (e.g., AUTH)
newman run HealthHub-API-Tests.postman_collection.json \
  -e postman-environment.json \
  --folder "AUTH"
```

### 📱 Appium Mobile Tests

```bash
cd appium-tests

# Start Appium server (in separate terminal)
appium

# Run tests
node tests/login.test.js
node tests/appointment.test.js
node tests/navigation.test.js
```

---

<div align="center">

## 🔄 CI/CD Pipeline

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

### Automated Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| 🌙 **Nightly Regression** | Schedule (2 AM UTC) | Full regression on 3 browsers + API |
| 💨 **Smoke Tests** | Post-deployment | Quick validation after deploy |
| 🔍 **PR Tests** | Pull Request | Lint, smoke tests, API validation |

### Artifacts Generated

- 📊 `regression-report-chromium` - Chrome test results
- 📊 `regression-report-firefox` - Firefox test results
- 📊 `regression-report-webkit` - Safari test results
- 📊 `api-regression-report` - Newman API results
- 📊 `smoke-test-report` - Post-deploy smoke results

---

<div align="center">

## 🛠️ Tech Stack

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

<div align="center">

### Testing Tools

<p>
  <img src="https://img.shields.io/badge/Playwright-45BA63?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"/>
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman"/>
  <img src="https://img.shields.io/badge/Newman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Newman"/>
  <img src="https://img.shields.io/badge/Appium-6D3F9E?style=for-the-badge&logo=appium&logoColor=white" alt="Appium"/>
  <img src="https://img.shields.io/badge/Allure-FF4E00?style=for-the-badge&logoColor=white" alt="Allure"/>
</p>

### Languages & Frameworks

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
</p>

### CI/CD & DevOps

<p>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
</p>

</div>

---

<div align="center">

## 🔗 Quick Links

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

<div align="center">

| Resource | Link |
|----------|------|
| 🌐 **Live Application** | [health-hub-connect-livid.vercel.app](https://health-hub-connect-livid.vercel.app) |
| 🔌 **API Endpoint** | [mern-backend-main-zeta.vercel.app](https://mern-backend-main-zeta.vercel.app) |
| 📁 **GitHub Repo** | [github.com/kinshukkush/health-hub-connect](https://github.com/kinshukkush/health-hub-connect) |
| 📋 **Test Plan** | [manual-testing/test-plan.md](manual-testing/test-plan.md) |
| 📊 **Test Report** | [manual-testing/test-summary-report.md](manual-testing/test-summary-report.md) |

</div>

---

<div align="center">

## 🎓 QA Skills Demonstrated

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

<table align="center">
<tr>
<td width="50%">

### ✅ Manual Testing
- Test Planning & Strategy
- Test Case Design (Positive/Negative)
- Defect Lifecycle Management
- Test Documentation (RTM, Reports)
- Exploratory Testing

</td>
<td width="50%">

### ✅ Test Automation
- Page Object Model (POM)
- Cross-browser Testing
- API Test Automation
- Mobile Web Testing
- CI/CD Integration

</td>
</tr>
<tr>
<td width="50%">

### ✅ Testing Types
- Functional Testing
- Regression Testing
- Smoke & Sanity Testing
- API Testing (REST)
- Mobile Responsive Testing

</td>
<td width="50%">

### ✅ Tools Expertise
- Playwright (TypeScript)
- Postman/Newman
- Appium
- GitHub Actions
- Allure Reports

</td>
</tr>
</table>

---

<div align="center">

## 👨‍💻 Developer

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

### **Kinshuk Saxena**

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=18&pause=1000&color=2D9CDB&center=true&vCenter=true&width=435&lines=Full+Stack+Developer;React+Native+Enthusiast;Music+Lover+%F0%9F%8E%B5;QA+Automation+Engineer" alt="Typing SVG" />

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-kinshukkush-181717?style=for-the-badge&logo=github)](https://github.com/kinshukkush)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kinshuk--saxena-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/kinshuk-saxena-/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Website-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://portfolio-frontend-mu-snowy.vercel.app/)
[![Email](https://img.shields.io/badge/Email-kinshuksaxena3%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kinshuksaxena3@gmail.com)
[![Phone](https://img.shields.io/badge/Phone-%2B91%209057538521-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+919057538521)

</div>

---

<div align="center">

## 🙏 Acknowledgments

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

This project demonstrates enterprise-grade QA practices for:
- 🏥 Healthcare Platform Testing
- 📝 Test Documentation Excellence
- 🎭 Modern Test Automation
- 🔄 CI/CD Best Practices

---

<div align="center">

## 📈 Project Stats

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

| Metric | Value |
|--------|-------|
| 📝 **Test Cases** | 350+ |
| 🧪 **E2E Tests** | 150+ |
| 🔌 **API Tests** | 200+ |
| 📱 **Mobile Tests** | 50+ |
| 📊 **Pass Rate** | 94.8% |
| 🐛 **Defects Tracked** | 200+ |
| 📄 **Documentation Pages** | 15+ |
| 🔄 **CI/CD Pipelines** | 3 |

</div>

---

<div align="center">

**Made with ❤️ and 🎵 by Kinshuk Saxena**

⭐ **Star this repo if you find it helpful!** ⭐

<br/>

<a href="https://github.com/kinshukkush/health-hub-connect/stargazers">
  <img src="https://img.shields.io/github/stars/kinshukkush/health-hub-connect?style=social" alt="Stars"/>
</a>
<a href="https://github.com/kinshukkush/health-hub-connect/network/members">
  <img src="https://img.shields.io/github/forks/kinshukkush/health-hub-connect?style=social" alt="Forks"/>
</a>
<a href="https://github.com/kinshukkush/health-hub-connect/watchers">
  <img src="https://img.shields.io/github/watchers/kinshukkush/health-hub-connect?style=social" alt="Watchers"/>
</a>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
