# Word Simulator - Student Testing Platform

A comprehensive web-based Microsoft Word simulator designed for testing and evaluating students' Word processing skills. The application provides a realistic Word-like interface where students can complete formatting tasks that are automatically validated and scored.

## 🌟 Features

### Document Editor
- **Rich Text Editing**: Full-featured editor built with Slate.js
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Font Controls**: Font family selection, font sizes (8-72pt)
- **Color Options**: Text color and background color
- **Paragraph Formatting**: Alignment (left, center, right, justify)
- **Lists**: Bulleted and numbered lists
- **Tables**: Insert and format tables with custom dimensions
- **Images**: Upload images or insert via URL
- **Page Layout**: Custom margins, portrait/landscape orientation
- **Zoom Controls**: 50%-200% zoom levels

### Task System
- **Task Instructions**: Clear task panels with step-by-step instructions
- **Timer**: Countdown timer with visual warnings
- **Progress Tracking**: Mark tasks as complete and track progress
- **Task Navigation**: Move between tasks seamlessly
- **Auto-save**: Document state preserved across tasks

### Validation Engine
- **Automated Scoring**: Validates formatting against expected criteria
- **Rule-based Validation**: Text, paragraph, list, table, and image validation
- **Detailed Feedback**: Specific feedback on what was correct/incorrect
- **Point System**: Granular scoring based on individual format rules

### Admin Features
- **Test Management**: Create, edit, and delete tests
- **Task Builder**: Define tasks with validation rules
- **Student Management**: View and manage student accounts
- **Results Dashboard**: View student performance and analytics

### Authentication
- **JWT-based Auth**: Secure token-based authentication
- **Role-based Access**: Student and Admin roles
- **Protected Routes**: Middleware-based route protection

## 🏗️ Project Structure

```
word-simulator/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── DocumentEditor.tsx
│   │   │   ├── Ribbon.tsx
│   │   │   ├── RibbonButton.tsx
│   │   │   ├── TaskPanel.tsx
│   │   │   ├── TaskInstructions.tsx
│   │   │   ├── Timer.tsx
│   │   │   └── ribbon/      # Ribbon tab components
│   │   ├── pages/           # Page components
│   │   │   ├── EditorPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── TestSelectionPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   │   ├── slateUtils.ts
│   │   │   └── validationEngine.ts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── styles/          # CSS styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── backend/                  # Node.js Express backend
    ├── src/
    │   ├── config/          # Configuration files
    │   │   ├── config.js
    │   │   └── database.js
    │   ├── models/          # Mongoose models
    │   │   ├── User.js
    │   │   ├── Test.js
    │   │   └── TestAttempt.js
    │   ├── controllers/     # Route controllers
    │   │   ├── authController.js
    │   │   ├── testController.js
    │   │   └── attemptController.js
    │   ├── routes/          # API routes
    │   │   ├── authRoutes.js
    │   │   ├── testRoutes.js
    │   │   └── attemptRoutes.js
    │   ├── middleware/      # Express middleware
    │   │   └── auth.js
    │   ├── utils/           # Utility functions
    │   │   └── generateToken.js
    │   └── server.js        # Express server
    ├── package.json
    └── .env.example
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd word-simulator/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (edit `.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/word-simulator
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start MongoDB** (if not already running)
   ```bash
   mongod
   ```

6. **Run the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd word-simulator/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

### First-Time Setup

1. **Create an admin user** (via API or MongoDB):
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@example.com",
       "password": "admin123",
       "role": "admin"
     }'
   ```

2. **Access the application**:
   - Open browser to `http://localhost:3000`
   - Login with admin credentials
   - Navigate to Admin Panel to create tests

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'admin',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Test Model
```javascript
{
  title: String,
  description: String,
  duration: Number (minutes),
  tasks: [
    {
      title: String,
      description: String,
      instructions: [String],
      expectedFormat: {
        elements: [FormatRule]
      },
      points: Number,
      order: Number
    }
  ],
  createdBy: ObjectId (User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### TestAttempt Model
```javascript
{
  test: ObjectId (Test),
  user: ObjectId (User),
  startTime: Date,
  endTime: Date,
  status: 'in-progress' | 'completed' | 'graded',
  taskResults: [
    {
      taskId: ObjectId,
      document: Mixed (Slate document),
      validationResults: [ValidationResult],
      score: Number,
      maxScore: Number,
      completedAt: Date
    }
  ],
  totalScore: Number,
  maxScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tests
- `GET /api/tests` - Get all tests (protected)
- `GET /api/tests/:id` - Get single test (protected)
- `POST /api/tests` - Create test (admin only)
- `PUT /api/tests/:id` - Update test (admin only)
- `DELETE /api/tests/:id` - Delete test (admin only)

### Test Attempts
- `POST /api/attempts` - Start new attempt (protected)
- `GET /api/attempts` - Get user's attempts (protected)
- `GET /api/attempts/:id` - Get single attempt (protected)
- `PUT /api/attempts/:id/tasks/:taskId` - Submit task result (protected)
- `PUT /api/attempts/:id/submit` - Submit/complete attempt (protected)
- `GET /api/attempts/all` - Get all attempts (admin only)

### API Request Examples

**Register User:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Test:**
```bash
POST /api/tests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Basic Formatting Test",
  "description": "Test basic Word formatting skills",
  "duration": 30,
  "tasks": [
    {
      "title": "Format Text",
      "description": "Apply bold formatting to specific text",
      "instructions": [
        "Type 'Hello World'",
        "Make it bold and 16pt"
      ],
      "expectedFormat": {
        "elements": [
          {
            "type": "text",
            "selector": "Hello World",
            "properties": {
              "bold": true,
              "fontSize": 16
            },
            "points": 10
          }
        ]
      },
      "points": 10,
      "order": 1
    }
  ]
}
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Rich Text Editor**: Slate.js
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors
- **Logging**: morgan

## 📝 Creating Tests

Tests are created through the Admin Panel or API. Each test consists of:

1. **Test Metadata**: Title, description, duration
2. **Tasks**: Individual challenges for students
3. **Validation Rules**: Criteria for automatic scoring

### Example Validation Rules

**Text Formatting:**
```javascript
{
  type: 'text',
  selector: 'Business Letter',  // Text to find
  properties: {
    bold: true,
    fontSize: 18,
    align: 'center'
  },
  points: 5
}
```

**List Validation:**
```javascript
{
  type: 'list',
  properties: {
    listType: 'bulleted'  // or 'numbered'
  },
  points: 3
}
```

**Table Validation:**
```javascript
{
  type: 'table',
  properties: {
    tableRows: 4,
    tableCols: 3
  },
  points: 10
}
```

## 🎯 Usage Guide

### For Students

1. **Login** to the platform
2. **Select a test** from available tests
3. **Read task instructions** carefully
4. **Complete tasks** using the Word-like interface
5. **Mark tasks complete** as you finish
6. **Submit test** when all tasks are done
7. **View results** and feedback

### For Administrators

1. **Login** with admin credentials
2. **Navigate to Admin Panel**
3. **Create tests** with tasks and validation rules
4. **Manage students** and view their progress
5. **Review results** and generate reports

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation

## 🚧 Future Enhancements

- [ ] Headers and footers support
- [ ] Advanced table merging/splitting
- [ ] Find and replace functionality
- [ ] Spell check integration
- [ ] Export to PDF/DOCX
- [ ] Collaborative editing
- [ ] Real-time auto-save
- [ ] Enhanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support

## 📄 License

MIT License

## 👥 Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ for education
