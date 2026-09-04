AI Study Assistant

An AI-powered full-stack study management platform that helps students organize their subjects, notes, study plans, tasks, quizzes, and learning progress in one place.

Live Demo

Frontend: https://ai-study-assistant-client-nwqk.onrender.com

Backend API: https://ai-study-assistant-api-y88f.onrender.com

GitHub: https://github.com/thisisjknaidu/ai-study-assistant

Some AI features that use the OpenAI API require an OpenAI account with available API credits.

Features

Authentication

User registration and login

JWT-based authentication

Protected application routes

Dashboard

Overview of study activity

Dynamic progress and statistics

Recent activity

Subjects

Create and manage subjects

Organize notes, quizzes, and study tasks by subject

Notes

Create, view, update, and delete study notes

Organize notes for different subjects

Study Plan

Create and manage study tasks

Set due dates and subjects

Filter and track planned study work

AI Study Plan

Generate personalized study plans with AI

Review AI-generated plans

Add generated tasks directly to the Study Plan

AI Tutor

AI-powered study assistance

Ask questions and receive learning-focused responses

Quiz

Generate and take quizzes

Subject-based quiz experience

Store quiz results

Quiz History & Statistics

Review previous quiz attempts

Track quiz performance

View study and quiz statistics

Tech Stack

Frontend

React

Vite

Tailwind CSS

React Router

Backend

Node.js

Express

CORS

dotenv

JWT

bcryptjs

Database

PostgreSQL

Prisma ORM

Prisma PostgreSQL adapter

AI

OpenAI API

Deployment

GitHub

Render

Architecture

┌───────────────────────────────┐
│ React + Vite Client │
│ Tailwind CSS UI │
└───────────────┬───────────────┘
│ REST API
▼
┌───────────────────────────────┐
│ Node.js + Express │
│ Authentication │
│ Notes / Subjects │
│ Study Plans / Quizzes │
│ AI Features │
└───────────────┬───────────────┘
│ Prisma
▼
┌───────────────────────────────┐
│ PostgreSQL Database │
└───────────────────────────────┘

                │
                └──────────────► OpenAI API

Project Structure

AI Study Assistant/
│
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── layouts/
│ │ ├── pages/
│ │ ├── config.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── .env.example
│ ├── package.json
│ └── vite.config.js
│
├── server/
│ ├── prisma/
│ │ ├── migrations/
│ │ └── schema.prisma
│ ├── routes/
│ ├── generated/
│ ├── prisma.config.ts
│ ├── server.js
│ ├── .env.example
│ └── package.json
│
└── README.md

Getting Started

Prerequisites

Make sure you have:

Node.js installed

npm installed

PostgreSQL database

Git

1. Clone the repository

git clone https://github.com/thisisjknaidu/ai-study-assistant.git
cd ai-study-assistant

2. Install frontend dependencies

cd client
npm install

Create client/.env:

VITE_API_URL=http://localhost:5000

Start the frontend:

npm run dev

3. Install backend dependencies

Open another terminal:

cd server
npm install

Create server/.env with your own database and authentication configuration.

Do not commit .env files or API keys to GitHub.

4. Configure Prisma

From the server directory:

npx prisma generate

Run the appropriate Prisma database command for your development database, then start the backend:

npm run dev

The local API runs on:

http://localhost:5000

Environment Variables

Client

VITE_API_URL=http://localhost:5000

For production, set VITE_API_URL to the deployed backend URL.

Server

The backend uses environment variables for sensitive configuration such as:

DATABASE_URL

JWT_SECRET

OPENAI_API_KEY

PORT

Use .env.example as a template and keep actual secrets private.

Production Deployment

The project is deployed using Render.

Backend

The backend is deployed as a Render Web Service.

Build command:

npm install && npx prisma generate

Start command:

npm start

Frontend

The frontend is deployed as a Render Web Service with the client directory as its root directory.

Build command:

npm install && npm run build

Start command:

npm run preview -- --host 0.0.0.0 --port $PORT

The production frontend receives the backend URL through:

VITE_API_URL=https://ai-study-assistant-api-y88f.onrender.com

Security Notes

Environment files containing secrets are excluded from Git.

API keys should never be committed to the repository.

JWT authentication protects private application routes.

Production environment variables should be configured through the hosting platform.

Development

Run the frontend and backend in separate terminals.

Frontend

cd client
npm run dev

Backend

cd server
npm run dev

Future Improvements

Improve AI Tutor capabilities

Add more advanced learning analytics

Add reminders and notifications

Add richer quiz question types

Add additional AI-powered study recommendations

Further improve accessibility and mobile UX

Add automated testing and CI/CD checks

License

This project is currently intended as a personal/portfolio project.

Author

Jaya Krishna

GitHub: https://github.com/thisisjknaidu
