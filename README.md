# Institute Management System

A comprehensive full-stack web application for managing institutional operations including student management, faculty coordination, club activities, events, and AI-powered student insights. Built with modern web technologies and intelligent analytics.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Configuration](#-configuration)
- [Project Structure Details](#-detailed-project-structure)
- [License](#-license)

## 🌟 Features

### Core Features
- **Student Management**: Complete student profiles, activity tracking, and supervision management
- **Faculty Management**: Faculty profiles, counsellor assignments, club coordinator roles
- **Club Management**: Club creation, membership tracking, event organization, feed sharing
- **Event Management**: Create, schedule, and track events with participation records
- **Messaging System**: Direct messaging between students and faculty
- **Counsellor Requests**: Students can submit counselling requests with status tracking
- **Admin Dashboard**: Comprehensive dashboards for institutional oversight and reporting

### Advanced Features
- **AI Insights**: Machine learning-driven analysis of student engagement using Ollama/Llama models
  - Message sentiment analysis
  - Student engagement level prediction
  - Risk scoring for at-risk students
  - Personalized insights generation
- **Student Twin System**: Intelligent student matching based on profiles and academic interests
- **NAAC Dashboard**: National Assessment and Accreditation Council compliance tracking
  - Evidence management for accreditation
  - Upload and organize accreditation documents
- **Policy Management**: Institute policy documentation and updates
- **Participation Tracking**: Track student participation in events and activities
- **Club Feed**: Social feed for club announcements and member interactions

### Role-Based Access
- **Students**: View dashboard, messages, events, counsellor requests, clubs, AI insights
- **Faculty**: Manage students, requests, club events, AI insights for assigned students
- **Admin**: System administration, policy management, NAAC compliance, reports
- **Club**: Club management, membership, events, feed

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4, Material-UI (MUI)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **UI Components**: Lucide React, Recharts (data visualization)
- **Animation**: Framer Motion
- **Markdown Support**: React Markdown with GFM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 2 connector
- **Authentication**: JWT (JSON Web Tokens), bcrypt.js
- **File Upload**: Multer
- **Environment**: dotenv
- **HTTP Client**: Axios
- **CORS**: Enabled for cross-origin requests

### AI/ML Service
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: MySQL connector
- **LLM Integration**: Ollama with Llama 3.2:3B model
- **HTTP Client**: Requests

### Database
- **Type**: MySQL
- **Version**: Compatible with MySQL 8.0+

## 📁 Project Structure

```
Institute-Management/
├── frontend/                   # React Vite application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/       # Layout components (Header, Footer, Auth, Dashboard)
│   │   │   ├── ui/           # UI elements (Button, Card, Input, Badge, Table)
│   │   │   ├── feedback/     # Feedback components (Alert, Loader)
│   │   │   ├── ChatLauncher.jsx
│   │   │   └── SyllabusChat.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── admin/       # Admin dashboards and management pages
│   │   │   ├── student/     # Student portal pages
│   │   │   ├── faculty/     # Faculty portal pages
│   │   │   ├── club/        # Club management pages
│   │   │   ├── login/       # Login pages
│   │   │   ├── signup/      # Registration pages
│   │   │   └── public/      # Public pages
│   │   ├── api/             # API configuration
│   │   ├── assets/          # Images and static assets
│   │   ├── theme/           # Theme configuration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── backend/                   # Express.js REST API
│   ├── controllers/          # Business logic
│   │   ├── studentController.js
│   │   ├── facultyController.js
│   │   ├── adminController.js
│   │   ├── clubController.js
│   │   ├── eventController.js
│   │   ├── participationController.js
│   │   ├── messageController.js
│   │   ├── counsellorRequestController.js
│   │   ├── aiInsightsController.js
│   │   ├── naacController.js
│   │   ├── naacEvidenceController.js
│   │   ├── twinController.js
│   │   ├── clubMembershipController.js
│   │   ├── clubFeedController.js
│   │   ├── clubEventController.js
│   │   └── policyController.js
│   ├── routes/              # API routes
│   │   └── [Various route files for each feature]
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── naacUpload.js
│   ├── config/              # Configuration files
│   │   └── db.js           # Database connection
│   ├── services/            # Business logic services
│   │   └── twinEngine.js    # Student matching engine
│   ├── uploads/             # File storage directory
│   ├── server.js            # Express app setup
│   └── package.json
│
├── ai-service/              # Python FastAPI service
│   ├── app.py              # FastAPI application
│   ├── db.py               # Database utilities
│   ├── ollama_client.py    # Ollama LLM integration
│   ├── worker.py           # AI insight generation worker
│   ├── requirements.txt     # Python dependencies
│   └── __pycache__/
│
├── aibackend/              # Additional AI backend components
│   ├── main.py
│   ├── pdf_loader.py       # PDF processing for syllabus
│   └── syllabus/
│
├── init.sql                # Database initialization script
├── seed.sql                # Sample data for testing
└── README.md               # This file

```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Python**: v3.8 or higher
- **MySQL**: v8.0 or higher
- **Ollama**: For AI service (optional, for AI insights feature)

### Verify Installation

```bash
node --version
npm --version
python --version
mysql --version
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MaheshSMA/Institute-Management.git
cd Institute-Management
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Backend Setup

```bash
cd ../backend
npm install
```

### 4. AI Service Setup (Optional)

```bash
cd ../ai-service
pip install -r requirements.txt
```

### 5. Create Environment Files

#### Backend `.env` file
Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql
DB_NAME=institution_db
JWT_SECRET=your_jwt_secret_key_here_change_this
PYTHON_WORKER_URL=http://localhost:8000
NODE_ENV=development
```

#### AI Service `.env` file (if using)
Create `ai-service/.env`:

```env
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:3b
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql
DB_NAME=institution_db
```

## 🗄️ Database Setup

### 1. Create Database and Tables

```bash
mysql -u root -p < init.sql
```

When prompted, enter your MySQL password.

### 2. (Optional) Seed Sample Data

```bash
mysql -u root -p institution_db < seed.sql
```

### 3. Verify Database Connection

```bash
mysql -u root -p
> USE institution_db;
> SHOW TABLES;
> EXIT;
```

## ▶️ Running the Application

### Terminal 1: Backend Server

```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend Application

```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Terminal 3: AI Service (Optional)

```bash
cd ai-service
python -m uvicorn app:app --reload --port 8000
# AI service runs on http://localhost:8000
```

### Terminal 4: Python AI Worker (Optional)

```bash
cd ai-service
python worker.py
```

The application should now be accessible at:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **AI Service**: `http://localhost:8000` (if running)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student profile
- `PUT /api/students/:id` - Update student profile
- `GET /api/students/:id/activity` - Get activity points

### Faculty
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/:id` - Get faculty profile
- `PUT /api/faculty/:id` - Update faculty profile
- `GET /api/faculty/:id/students` - Get assigned students

### Clubs
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create club
- `GET /api/clubs/:id` - Get club details
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Participation
- `POST /api/participation` - Register participation
- `PUT /api/participation/:id` - Update participation status
- `GET /api/participation/student/:studentId` - Get student participation history

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/messages/:id` - Get conversation
- `DELETE /api/messages/:id` - Delete message

### Counsellor Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create request
- `PUT /api/requests/:id` - Update request status
- `GET /api/requests/student/:studentId` - Get student requests

### AI Insights
- `GET /api/ai/insights` - Get AI insights for students
- `POST /api/ai/insights` - Generate new insights

### NAAC
- `GET /api/naac` - Get NAAC dashboard data
- `GET /api/naac/evidence` - Get evidence documents
- `POST /api/naac/evidence` - Upload evidence
- `PUT /api/naac/evidence/:id` - Update evidence

### Policies
- `GET /api/admin/policies` - Get all policies
- `POST /api/admin/policies` - Create policy
- `PUT /api/admin/policies/:id` - Update policy
- `DELETE /api/admin/policies/:id` - Delete policy

### Club Management
- `GET /api/clubs/:id/members` - Get club members
- `POST /api/clubs/:id/members` - Add member
- `DELETE /api/clubs/:id/members/:memberId` - Remove member
- `GET /api/clubs/:id/feed` - Get club feed
- `POST /api/clubs/:id/feed` - Post to club feed

### Student Twin
- `GET /api/twins/:studentId` - Get matched twins
- `POST /api/twins/match` - Generate new matches

## ⚙️ Configuration

### Database Configuration

Edit `backend/config/db.js` to modify database connection settings:

```javascript
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mysql',
  database: process.env.DB_NAME || 'institution_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### JWT Configuration

The JWT secret is configured in `.env` file. Change it in production:

```env
JWT_SECRET=your_super_secret_key_here_min_32_chars
```

### Vite Configuration

Frontend Vite settings are in `frontend/vite.config.js`. The default API base URL is configured in `frontend/src/api/axios.js`.

## 📚 Detailed Project Structure

### Frontend Components

- **Layout Components**: Header, Footer, AuthLayout, DashboardLayout, PublicLayout
- **UI Components**: Button, Card, Input, Badge, Table (reusable components)
- **Feedback Components**: Alert, Loader
- **Chat Components**: ChatLauncher, SyllabusChat (AI chat interfaces)

### Student Pages

- Dashboard (Overview and statistics)
- Events (Browse and register for events)
- Counsellor Requests (Submit and track requests)
- Faculty List (Browse and contact faculty)
- Messages (Direct messaging)
- Club Feed (View club activities)

### Faculty Pages

- Dashboard (Overview of assigned students)
- Requests (Manage counsellor requests)
- Students (List and profile view of assigned students)
- Club Events (Manage club events)
- AI Insights (View student insights)
- Student Twin Matching (View similar students)

### Admin Pages

- Dashboard (System statistics)
- Reports (Generate institutional reports)
- Students (Manage all students)
- Faculty (Manage all faculty)
- Events (Manage all events)
- Policies (Create and manage policies)
- NAAC Dashboard (Accreditation compliance)

### Club Pages

- Dashboard (Overview)
- Members (Membership management)
- Events (Event management)
- Messages (Club communications)
- Feed (Club announcements)

### Backend Controllers

Each controller handles specific business logic:
- `studentController.js` - Student CRUD and profile management
- `facultyController.js` - Faculty management
- `clubController.js` - Club operations
- `eventController.js` - Event management
- `participationController.js` - Event participation tracking
- `messageController.js` - Messaging system
- `counsellorRequestController.js` - Counselling request handling
- `aiInsightsController.js` - AI-driven student insights
- `naacController.js` - Accreditation management
- `twinController.js` - Student matching algorithm
- `authController.js` - Authentication and authorization
- `adminController.js` - Admin operations

## 🤖 AI Service Details

### Ollama Integration

The AI service uses Ollama with Llama 3.2:3B model for generating insights:

1. **Message Fetching**: Retrieves student messages from the past 7 days
2. **Sentiment Analysis**: Analyzes message sentiment and tone
3. **Topic Extraction**: Identifies dominant topics in communications
4. **Risk Scoring**: Calculates risk scores based on engagement patterns
5. **Insight Generation**: Generates personalized recommendations

### Running the AI Service

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull the model: `ollama pull llama3.2:3b`
3. Run Ollama: `ollama serve`
4. Start the AI service: `python -m uvicorn app:app --reload`

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run lint
# ESLint will check code quality
```

### Backend Testing

```bash
cd backend
# Add test script in package.json if needed
npm test
```

## 📦 Build & Deployment

### Frontend Build

```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

### Backend Deployment

The backend can be deployed to:
- Heroku
- Railway
- Fly.io
- Traditional VPS

### AI Service Deployment

The FastAPI service can be containerized with Docker:

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]
```

## 📝 Database Schema

The database includes the following main tables:
- `ADMIN` - Admin users
- `FACULTY` - Faculty members
- `STUDENT` - Student profiles
- `DEPT` - Departments
- `LOGIN` - Authentication credentials
- `CLUB` - Club information
- `CLUB_MEMBERSHIP` - Club memberships
- `EVENT` - Events
- `PARTICIPATION` - Event participation
- `MESSAGE` - Direct messages
- `COUNSELLOR_REQUEST` - Counselling requests
- `NAAC_EVIDENCE` - Accreditation documents
- `STUDENT_TWIN` - Student matching pairs
- `POLICY` - Institution policies
- `AI_INSIGHTS` - Generated AI insights
- `CLUB_FEED` - Club social feed

See `init.sql` for complete schema.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt.js for password security
- **Role-Based Access Control**: Different permission levels for different roles
- **CORS Protection**: Cross-origin request validation
- **Input Validation**: Server-side validation of all inputs
- **File Upload Security**: Multer configuration for safe file handling

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Last Updated**: February 2026
**Version**: 1.0.0
