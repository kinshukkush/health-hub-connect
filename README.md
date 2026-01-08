# HealthHub Connect - Healthcare Management Platform

A modern, feature-rich healthcare management platform built with React, TypeScript, and MongoDB. Features a beautiful dark mode interface with smooth animations and comprehensive functionality for managing healthcare appointments, medical records, and doctor consultations.

![HealthHub Connect](https://img.shields.io/badge/Status-Production%20Ready-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 📚 Documentation

- **[Project Structure](PROJECT_STRUCTURE.md)** - Complete folder structure overview
- **[QA PROJECT](QA_PROJECT_README.md)** - Complete Automation details
- **[QUICK START DETAILS](QUICKSTART_QA.md)** - Complete guidance to setpu the project
- **[Final summary](RESTRUCTURING_SUMMARY.md)** - Final details of the file structure
- **[Secutity](SECURITY.md)** - Steps to keep in mind for SECURITY

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure JWT-based login and registration with bcrypt password hashing
- **Doctor Management**: Browse, search, and view detailed doctor profiles from MongoDB
- **Appointment Booking**: Real-time appointment scheduling with approval workflow
- **Medical Records**: Secure storage and management of medical documents
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Settings Page**: User profile management and theme preferences

### UI/UX Enhancements
- **Dark Mode by Default**: Beautiful dark theme with smooth transitions
- **Theme Switcher**: Toggle between Light, Dark, and System themes
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Design**: Fully responsive across all device sizes
- **Enhanced Components**: Animated cards, hover effects, and transitions

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Shadcn/ui components
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API

### Backend
- **Server**: Node.js with Express
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **API**: RESTful API

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)

## 🔧 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/kinshukkush/health-hub-connect.git
cd health-hub-connect-main
```

### 2. Install Dependencies

**Frontend:**
```bash
cd Frontend
npm install
cd ..
```

**Backend:**
```bash
cd Backend
npm install
cd ..
```

### 3. Environment Configuration

**Frontend (Frontend/.env.local):**
```env
VITE_API_URL=http://localhost:3000/api
```

**Backend (Backend/.env.local):**
```env
# MongoDB credentials separated for security
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
MONGODB_CLUSTER=your_cluster.mongodb.net
MONGODB_DATABASE=healthhub

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

Frontend: http://localhost:8081  
Backend API: http://localhost:3000/api

## 🔐 Demo Accounts

**Patient Account:**
- Email: `patient@demo.com`
- Password: `demo123`

**Admin Account:**
- Email: `admin@demo.com`
- Password: `demo123`

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - **Root Directory**: `Frontend`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

4. **Deploy!** Vercel will automatically build and deploy

### Backend Deployment Options

**⚠️ Important**: Vercel is optimized for frontend. Deploy backend separately.

#### Option 1: Render.com (Recommended - Free Tier Available)

1. Go to [render.com](https://render.com)
2. Create New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_USERNAME` (your MongoDB username)
   - `MONGODB_PASSWORD` (your MongoDB password)
   - `MONGODB_CLUSTER` (cluster0.ceqszik.mongodb.net)
   - `MONGODB_DATABASE` (healthhub)
   - `JWT_SECRET` (generate a secure random string)
   - `NODE_ENV=production`
6. Deploy!

#### Option 2: Railway.app (Easy Setup)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Railway auto-detects Node.js and deploys

#### Option 3: Heroku

1. Install Heroku CLI
2. Create Heroku app:
```bash
heroku create your-app-name
```
3. Set environment variables:
```bash
heroku config:set MONGODB_USERNAME=your_username
heroku config:set MONGODB_PASSWORD=your_password
heroku config:set MONGODB_CLUSTER=cluster0.ceqszik.mongodb.net
heroku config:set MONGODB_DATABASE=healthhub
heroku config:set JWT_SECRET=your_secret
```
4. Deploy:
```bash
git subtree push --prefix Backend heroku main
```

### Post-Deployment Steps

1. **Update Frontend Environment Variable:**
   - In Vercel, update `VITE_API_URL` with your deployed backend URL
   - Redeploy frontend

2. **Enable CORS on Backend:**
   - Update `Backend/server.js` CORS settings:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-vercel-url.vercel.app'
   }));
   ```

3. **Test Your Deployment:**
   - Visit your Vercel URL
   - Login with demo accounts
   - Test booking appointments

## 📁 Project Structure

```
health-hub-connect-main/
├── Frontend/                     # Frontend Application
│   ├── src/                     # React source code
│   │   ├── components/         # React components
│   │   ├── context/            # Context providers (Auth, Appointments)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and API client
│   │   ├── pages/              # Page components
│   │   └── types/              # TypeScript type definitions
│   ├── public/                 # Static assets
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── .env                    # Environment variables (template)
│   └── .env.local              # Local environment variables
│
├── Backend/                     # Backend API
│   ├── config/                 # Database configuration
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth middleware
│   ├── seed.js                 # Database seeding
│   ├── server.js               # Express server
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment variables (template)
│   └── .env.local              # Local environment variables
│
├── README.md                    # Main documentation
├── DEPLOYMENT.md                # Deployment guide
├── QUICKSTART.md                # Quick start guide
└── .gitignore                   # Git ignore rules
```

The application is configured to use MongoDB Atlas:
- **Connection String**: Already configured in `src/lib/mongodb.ts`
- **Database Name**: `healthhub`
- **Collections**: users, doctors, appointments, medical_records

See `src/lib/models.ts` for complete schema definitions.

## 🎨 Key Features Implemented

### 1. Dark Mode Theme
- Default dark theme on load
- Theme provider with React Context  
- Persistent theme selection in localStorage
- Smooth color transitions

### 2. Settings Page (`/settings`)
- Profile management with avatar
- Theme switcher (Light/Dark/System)
- Notification preferences
- Security settings

### 3. Enhanced Animations
- Page transitions and entry animations
- Card hover effects (lift, scale, glow)
- Staggered list animations
- Interactive button states

### 4. Improved Components
- **Doctor Card**: Enhanced with badges, animations, detailed info
- **Appointment Card**: Status-based colors, gradient overlays
- **Stats Card**: Trend indicators, animated counters

## 🎯 Usage

### For Patients
1. Register/Login
2. Browse and search doctors
3. Book appointments
4. Manage medical records
5. Update settings and preferences

### For Administrators
- View all appointments across all users
- Approve or reject appointment requests
- Manage patient information
- Access comprehensive analytics dashboard

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

### Appointments
- `GET /api/appointments` - Get appointments (protected)
- `POST /api/appointments` - Create appointment (protected)
- `PUT /api/appointments/:id` - Update appointment (protected)
- `DELETE /api/appointments/:id` - Delete appointment (protected)

### Medical Records
- `GET /api/records` - Get medical records (protected)
- `POST /api/records` - Create record (protected)
- `DELETE /api/records/:id` - Delete record (protected)

## 🛠️ Development Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
cd server
npm start            # Start server
npm run dev          # Start with nodemon (auto-restart)
```

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check `.env` has correct `VITE_API_URL`
- Check browser console for CORS errors

### MongoDB connection failed
- Verify MongoDB URI in `server/.env`
- Check network access in MongoDB Atlas
- Ensure database user has read/write permissions

### Demo login not working
- Ensure backend seeded demo users successfully
- Check backend console for "Demo users created" message
- Try registering a new account

## 🔒 Security

- JWT token authentication
- Bcrypt password hashing
- Protected API routes
- Input validation
- CORS configuration
- Environment variables for sensitive data

## 💻 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, TypeScript, and MongoDB**

## 🎯 Production Checklist

Before deploying to production:

- [ ] Update MongoDB URI with production credentials
- [ ] Change JWT_SECRET to a secure random string
- [ ] Update CORS settings with production frontend URL
- [ ] Set NODE_ENV=production
- [ ] Update VITE_API_URL with production backend URL
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Verify data persistence
- [ ] Check responsive design on all devices

## 📊 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Note**: Deploy frontend to Vercel, backend to Render/Railway/Heroku separately.

---

**Need Help?** Open an issue or contact support.
