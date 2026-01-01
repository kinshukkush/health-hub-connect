# HealthHub Connect - Backend

Node.js + Express + MongoDB backend API.

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Or with nodemon (auto-restart)
npm run dev
```

Server runs at: http://localhost:3000

## 📝 Environment Variables

Create `.env.local` for local development:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=development
```

## 🌐 Deploy to Render

1. Push to GitHub
2. Create Web Service on Render
3. Set root directory: `Backend`
4. Add environment variables
5. Deploy!

### Environment Variables for Render:
```env
# MongoDB credentials separated for security
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=cluster0.ceqszik.mongodb.net
MONGODB_DATABASE=healthhub

JWT_SECRET=secure_random_string
NODE_ENV=production
PORT=3000
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (protected)
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
- `GET /api/records` - Get records (protected)
- `POST /api/records` - Create record (protected)
- `DELETE /api/records/:id` - Delete record (protected)

## 🛠️ Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt

## 📚 Documentation

See root README.md for complete documentation.
