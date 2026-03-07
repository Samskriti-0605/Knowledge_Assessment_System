import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TestBuilder from './pages/TestBuilder';
import TestPlayer from './pages/TestPlayer';
import Results from './pages/Results';
import Profile from './pages/Profile';
import StudentAssessments from './pages/StudentAssessments';
import TeacherAssessments from './pages/TeacherAssessments';
import Badges from './pages/Badges';
import StudentProgress from './pages/StudentProgress';
import Home from './pages/Home';
import About from './pages/About';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/student-dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student-assessments" element={<ProtectedRoute role="student"><StudentAssessments /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute role="student"><Badges /></ProtectedRoute>} />
            <Route path="/teacher-dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher-assessments" element={<ProtectedRoute role="teacher"><TeacherAssessments /></ProtectedRoute>} />
            <Route path="/student-progress" element={<ProtectedRoute role="teacher"><StudentProgress /></ProtectedRoute>} />
            <Route path="/create-test" element={<ProtectedRoute role="teacher"><TestBuilder /></ProtectedRoute>} />
            <Route path="/edit-test/:id" element={<ProtectedRoute role="teacher"><TestBuilder /></ProtectedRoute>} />
            <Route path="/take-test/:id" element={<ProtectedRoute role="student"><TestPlayer /></ProtectedRoute>} />
            <Route path="/results/:id" element={<ProtectedRoute role="teacher"><Results /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
