# 🚀 Quick Start Guide - MediTrack QA Suite

Get up and running with the MediTrack QA Automation Suite in minutes!

## ⚡ 5-Minute Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/kinshukkush/health-hub-connect.git
cd health-hub-connect-main

# Install all dependencies
npm install --prefix Frontend
npm install --prefix Backend
npm install --prefix playwright-tests

# Install Playwright browsers
cd playwright-tests && npx playwright install && cd ..
```

### Step 2: Start Application (1 minute)

```bash
# Terminal 1: Backend
cd Backend
npm start

# Terminal 2: Frontend (new terminal)
cd Frontend
npm run dev
```

### Step 3: Run Tests (2 minutes)

```bash
# Terminal 3: Run Playwright tests (new terminal)
cd playwright-tests
npm test

# View report
npm run report
```

## 📋 What You Get

After setup, you'll have:

✅ **Manual Testing Docs** - `manual-testing/` folder
- Test Plan
- 26 Test Scenarios  
- 60+ Test Cases
- Bug Report Template
- Test Summary Report

✅ **Web Automation** - `playwright-tests/` folder
- 35+ automated tests
- Page Object Model
- Cross-browser support
- Test reports

✅ **API Testing** - `api-tests/` folder
- 10 API test cases
- Postman collection
- Newman integration

✅ **Mobile Testing** - `appium-tests/` folder
- Mobile test framework
- Android support
- Setup guide

✅ **CI/CD** - `.github/workflows/` folder
- Automated test runs
- Scheduled regression
- Test reporting

## 🎯 Quick Commands

### Running Tests

```bash
# Web tests (all)
cd playwright-tests && npm test

# Web tests (specific browser)
cd playwright-tests && npm run test:chromium

# Web tests (headed mode - see browser)
cd playwright-tests && npm run test:headed

# API tests
cd api-tests && newman run MediTrack_API_Tests.postman_collection.json

# View Playwright report
cd playwright-tests && npm run report
```

### Application

```bash
# Start backend
cd Backend && npm start

# Start frontend
cd Frontend && npm run dev

# Open in browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 📖 Next Steps

1. **Review Manual Tests**: Check `manual-testing/test-plan.md`
2. **Explore Test Cases**: Open `manual-testing/test-cases.csv`
3. **Run Automation**: Execute `cd playwright-tests && npm test`
4. **View Reports**: Run `npm run report` in playwright-tests
5. **Read Documentation**: Each folder has a README.md

## 🐛 Troubleshooting

### Tests Failing?

**Issue**: Backend not connected
```bash
# Check if backend is running
curl http://localhost:5000/api/doctors
```

**Issue**: Frontend not loading
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173  # Windows
lsof -i :5173                  # macOS/Linux
```

**Issue**: Playwright tests failing
```bash
# Reinstall browsers
cd playwright-tests
npx playwright install --with-deps
```

## 💡 Pro Tips

1. **Use .env files** - Configure test credentials
2. **Run in headed mode** - See what tests are doing
3. **Check reports** - HTML reports have screenshots
4. **Read logs** - Console output shows detailed errors
5. **Use test:ui mode** - Interactive Playwright UI

## 📞 Need Help?

- Check README.md in each folder
- Review test documentation
- Check GitHub Issues
- Review test reports for clues

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Dependencies installed
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Tests executed successfully
- [ ] Reports generated

---

**Ready to showcase your QA skills!** 🎉

For detailed documentation, see [QA_PROJECT_README.md](QA_PROJECT_README.md)
