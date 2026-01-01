# HealthHub Connect - Frontend

React + TypeScript + Vite frontend application.

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Access at: http://localhost:8081

## 📦 Build for Production

```bash
npm run build
```

Output: `dist/` folder

## 🌐 Deploy to Vercel

1. Push this folder to GitHub
2. Connect to Vercel
3. Set environment variable: `VITE_API_URL`
4. Deploy!

## 📝 Environment Variables

Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:3000/api
```

For Vercel production, set in dashboard:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- Framer Motion
- React Router

## 📚 Documentation

See root README.md for complete documentation.
