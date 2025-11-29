#!/bin/bash

echo "🚀 Word Simulator Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB is not installed. You'll need MongoDB to run the backend."
    echo "   Install from: https://www.mongodb.com/try/download/community"
else
    echo "✅ MongoDB is installed"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

echo ""
echo "📝 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created from .env.example"
    echo "   Please edit backend/.env with your settings"
else
    echo "ℹ️  .env file already exists"
fi

cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running: mongod"
echo "2. Seed the database: cd backend && npm run seed"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "Default login credentials:"
echo "  Admin: admin@example.com / admin123"
echo "  Student: john@example.com / student123"
echo ""
echo "Documentation:"
echo "  README.md - Full documentation"
echo "  QUICKSTART.md - Quick setup guide"
echo "  DEPLOYMENT.md - Production deployment"
echo ""
echo "Happy coding! 🎉"
