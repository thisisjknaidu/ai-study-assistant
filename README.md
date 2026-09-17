# AI Study Assistant

An AI-powered full-stack study assistant that helps students organize subjects, notes, study plans, quizzes, quiz performance, and AI-powered study recommendations.

## Live Demo

### Frontend

https://ai-study-assistant-lzn2.onrender.com

### Backend API

https://ai-study-assistant-api-y88f.onrender.com

### GitHub Repository

https://github.com/thisisjknaidu/ai-study-assistant

---

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Dashboard with study progress
- Subject management
- Notes management
- Study plan management
- Create and manage study tasks
- Task completion tracking
- AI-generated study plans
- Add AI-generated plans to the study schedule
- AI Tutor
- Subject-based quizzes
- Quiz results
- Quiz history
- Quiz statistics
- AI study recommendations
- Responsive user interface
- PostgreSQL database
- Prisma ORM
- REST API

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### Database

- PostgreSQL
- Neon PostgreSQL
- Prisma ORM

### AI

- OpenAI API

### Deployment

- Render Static Site — Frontend
- Render Web Service — Backend
- Neon PostgreSQL — Database
- GitHub — Source Control

---

## Project Architecture

```text
User
  │
  ▼
React + Vite Frontend
  │
  │ REST API
  ▼
Node.js + Express Backend
  │
  ├── Authentication
  ├── Notes
  ├── Subjects
  ├── Study Plans
  ├── Quizzes
  ├── Quiz Statistics
  ├── AI Tutor
  └── AI Recommendations
  │
  ▼
Prisma ORM
  │
  ▼
Neon PostgreSQL
Project Structure
AI Study Assistant/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── config.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── generated/
│   ├── prisma.config.ts
│   ├── server.js
│   └── package.json
│
└── README.md
Application Pages

The application includes the following main pages:

Dashboard
Subjects
Notes
Study Plan
Create Task
AI Study Plan
AI Tutor
Quiz
Quiz Stats
Quiz History
Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
Git
PostgreSQL or a PostgreSQL-compatible database
Clone the Repository
git clone https://github.com/thisisjknaidu/ai-study-assistant.git
cd ai-study-assistant
Frontend Setup

Open a terminal and navigate to the client folder:

cd client
npm install

Create a .env file inside the client folder:

VITE_API_URL=http://localhost:5000

Start the frontend development server:

npm run dev

The Vite development server will normally run at:

http://localhost:5173
Backend Setup

Open another terminal and navigate to the server folder:

cd server
npm install

Create a .env file inside the server folder.

The backend requires environment variables for:

Database connection
JWT authentication
OpenAI integration

Do not commit the .env file to GitHub.

Start the backend:

npm start

The local backend normally runs at:

http://localhost:5000
Prisma Setup

The project uses Prisma ORM with PostgreSQL.

Generate the Prisma Client:

npx prisma generate

Validate the Prisma schema:

npx prisma validate

For development environments, Prisma migrations can be managed using the Prisma CLI.

Authentication

The application uses JWT-based authentication.

Authentication includes:

User registration
User login
Password hashing using bcryptjs
JWT token generation
Protected backend API routes
Protected frontend routes
Authenticated user information

The backend authenticates requests using the Authorization header:

Authorization: Bearer <token>
Database

The application uses PostgreSQL through Neon.

Prisma is used as the ORM for database access.

The database contains models for:

Users
Notes
Quiz Results
Study Tasks
Subjects
Flashcards
Quizzes
Quiz Questions
Study Materials

The production database is hosted using Neon PostgreSQL.

API Structure

The backend provides REST API endpoints for the application's major features.

/api/auth
/api/notes
/api/ai-tutor
/api/quiz
/api/study-plan
/api/subjects
/api/recommendations

The backend also provides a root health endpoint:

GET /

Production API:

https://ai-study-assistant-api-y88f.onrender.com
AI Features
AI Tutor

The AI Tutor provides an interactive learning experience using the OpenAI API.

Students can use it to ask study-related questions and receive AI-generated explanations.

AI Study Plan

The application can generate personalized study plans using AI.

The generated plan can then be added to the application's Study Plan.

AI Study Recommendations

The application analyzes quiz performance and study information to provide AI-powered study recommendations.

Quiz System

The quiz system supports:

Subject-based quizzes
Multiple-choice questions
Quiz submission
Score calculation
Quiz results
Quiz history
Quiz statistics
Subject performance tracking

Quiz performance is stored in the PostgreSQL database.

Study Plan

The Study Plan feature allows students to:

Create study tasks
Assign subjects
Add descriptions
Set due dates
Mark tasks as completed
View upcoming tasks
Manage existing tasks

AI-generated study plans can also be added to the Study Plan.

Subjects

Students can manage their study subjects.

The Subjects feature supports:

Adding subjects
Viewing subjects
Deleting subjects
Using subjects when creating study tasks
Using subjects for quizzes
Notes

The Notes feature allows students to:

Create notes
View notes
Update notes
Delete notes
Organize study information

Notes are associated with the authenticated user.

Dashboard

The Dashboard provides an overview of the student's study activity.

It includes information such as:

Study progress
Recent activity
Quiz performance
Study tasks
Subject-related information

Dashboard data is loaded dynamically from the backend API.

Local Development

Run the frontend and backend separately.

Terminal 1 — Backend
cd server
npm start
Terminal 2 — Frontend
cd client
npm run dev

The frontend communicates with the backend using:

VITE_API_URL=http://localhost:5000
Production Deployment

The application is deployed using Render and Neon.

Frontend — Render Static Site

The React frontend is deployed as a Render Static Site.

Build Command
npm install && npm run build
Publish Directory
client/dist
Environment Variable
VITE_API_URL=https://ai-study-assistant-api-y88f.onrender.com
SPA Rewrite

Because the frontend uses React Router, the following Render rewrite is required:

/* → /index.html

This allows frontend routes such as:

/login
/register
/dashboard
/subjects
/notes
/study-plan
/study-plan/create
/quiz
/quiz-history
/quiz-stats
/ai-study-plan
/ai-tutor

to work correctly after deployment.

Backend — Render Web Service

The backend is deployed as a Render Web Service.

Build Command
npm install && npx prisma generate
Start Command
npm start

Render provides the production PORT environment variable.

The Express server uses:

process.env.PORT || 5000

Production backend:

https://ai-study-assistant-api-y88f.onrender.com
Environment Variables
Frontend

The frontend uses:

VITE_API_URL=http://localhost:5000

For production:

VITE_API_URL=https://ai-study-assistant-api-y88f.onrender.com
Backend

The backend requires environment variables for:

DATABASE_URL
JWT_SECRET
OPENAI_API_KEY

Do not publish the actual values of these variables.

Security

Sensitive configuration is stored outside the source code.

Never commit:

.env

or any of the following to GitHub:

Database passwords
Database connection strings
JWT secrets
OpenAI API keys
Authentication tokens
Other private credentials
Git Workflow

Check the current Git status:

git status

Add changes:

git add .

Create a commit:

git commit -m "Describe your changes"

Push changes:

git push origin main

Render automatically deploys changes from the connected GitHub repository.

Production Architecture
                    ┌──────────────────────┐
                    │       Student        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Render Static Site │
                    │   React + Vite       │
                    └──────────┬───────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Render Web Service  │
                    │  Node + Express      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌──────────────────┐        ┌──────────────────┐
       │  Prisma ORM      │        │   OpenAI API     │
       └────────┬─────────┘        └──────────────────┘
                │
                ▼
       ┌──────────────────┐
       │ Neon PostgreSQL  │
       └──────────────────┘
Current Deployment
Component	Platform	Status
Frontend	Render Static Site	Live
Backend API	Render Web Service	Live
Database	Neon PostgreSQL	Connected
Source Code	GitHub	Public
Live Links
Frontend

https://ai-study-assistant-client-nwqk.onrender.com

Backend API

https://ai-study-assistant-api-y88f.onrender.com

GitHub Repository

https://github.com/thisisjknaidu/ai-study-assistant

Project Highlights

This project demonstrates a complete full-stack application built from the ground up, including:

Frontend development with React
Modern UI development with Tailwind CSS
Client-side routing
REST API development
JWT authentication
Password hashing
PostgreSQL database integration
Prisma ORM
CRUD operations
Quiz management
Study progress tracking
AI-powered features
Production database deployment
Cloud deployment
Git and GitHub workflow
Responsive application design
Future Improvements

Potential future improvements include:

More advanced AI tutoring
Additional quiz types
Flashcard learning modes
Study reminders
Progress charts
Learning streaks
More detailed analytics
File and PDF-based study material processing
Improved AI personalization
Additional authentication options
Author
Jaya Krishna

AI Study Assistant — Full-Stack AI Learning Platform
```
