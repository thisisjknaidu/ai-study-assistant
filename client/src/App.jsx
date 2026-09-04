import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import StudyPlan from "./pages/StudyPlan";
import QuizHistory from "./pages/QuizHistory";
import Subjects from "./pages/Subjects";
import QuizStats from "./pages/QuizStats";
import StudyPlanAI from "./pages/StudyPlanAI";
import CreateTask from "./pages/CreateTask";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-history" element={<QuizHistory />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/quiz-stats" element={<QuizStats />} />
          <Route path="/ai-study-plan" element={<StudyPlanAI />} />

          {/* Create Task */}
          <Route path="/study-plan/create" element={<CreateTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
