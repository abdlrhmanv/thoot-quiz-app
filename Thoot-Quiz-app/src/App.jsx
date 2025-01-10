import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext"; // Import the QuizProvider
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Homepage from './components/Homepage'; // Importing as default
import QuizSetup from "./components/QuizSetup";
import QuizPage from "./components/QuizPage";
import ResultsPage from "./components/ResultsPage"; // Import the ResultsPage
import Login from "./components/Login"; // Import Login component
import Signup from "./components/Signup"; // Import Signup component
import Profile from "./components/Profile"; // Import Profile component
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute component
import ContactUs from "./components/ContactUs"; // Import ContactUs component

function App() {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <ThemeProvider> {/* Wrap the app with ThemeProvider */}
        <QuizProvider> {/* Wrap the app with QuizProvider */}
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact-us" element={<ContactUs />} /> {/* Add ContactUs route */}

              {/* Protected Routes */}
              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <QuizSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <ResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<p>404: Page Not Found</p>} />
            </Routes>
          </Router>
        </QuizProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;