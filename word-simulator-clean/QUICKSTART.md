# Quick Start Guide

Get the Word Simulator up and running in 5 minutes!

## Prerequisites

- Node.js (v18+)
- MongoDB (v6+)

## Quick Setup

### 1. Clone the Repository
```bash
cd word-simulator
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings (or use defaults for local development)

# Start MongoDB (if not already running)
mongod

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Login Credentials

After running the seed script, use these credentials:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Students:**
- Email: `john@example.com` / Password: `student123`
- Email: `jane@example.com` / Password: `student123`

## What's Included

The seed script creates:
- 1 Admin user
- 2 Student users
- 2 Sample tests with multiple tasks

## Next Steps

1. Login as admin to create more tests
2. Login as student to take tests
3. Explore the Word-like interface
4. Test the validation system

## Common Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running: `mongod`
- Check your `MONGODB_URI` in `.env`

**Port Already in Use:**
- Frontend: Change port in `vite.config.ts`
- Backend: Change `PORT` in `.env`

**Dependencies Error:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Development Mode

Both servers support hot-reload:
- Backend: Uses nodemon
- Frontend: Uses Vite HMR

## Testing the Application

1. **Create a Test** (as admin):
   - Go to Admin Panel
   - Create a new test with tasks

2. **Take a Test** (as student):
   - Select a test
   - Complete the tasks
   - Submit and view results

3. **Validate Formatting**:
   - The system auto-validates your work
   - Scores are calculated automatically

## API Health Check

Visit `http://localhost:5000/api/health` to verify backend is running.

## Need Help?

See the full [README.md](./README.md) for detailed documentation.

---

Happy Testing! 🎉
