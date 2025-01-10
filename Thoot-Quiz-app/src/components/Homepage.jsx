import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../context/AuthContext"; // Import useAuth
import Layout from "./Layout";
import { useTheme } from "../context/ThemeContext"; // Import useTheme
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // Import icons for toggle button

const Homepage = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Get dark mode state and toggle function
  const { user } = useAuth(); // Get the current user
  const navigate = useNavigate(); // For programmatic navigation

  const handleStartQuiz = () => {
    if (user) {
      // If the user is logged in, navigate to the quiz setup page
      navigate("/quizzes");
    } else {
      // If the user is not logged in, redirect to the login page
      navigate("/login");
    }
  };

  return (
    <Layout>
      <div className="flex items-center flex-col justify-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-300 dark:text-white">
          Welcome to Thoot
        </h1>
        <p className="text-secondary-300 mt-4 dark:text-gray-300">
          Test your knowledge with our quizzes
        </p>
        <button
          onClick={handleStartQuiz}
          className="bg-secondary-200 text-white px-6 py-2 rounded-lg mt-4 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Start Quiz
        </button>
      </div>
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900/50 to-gray-900/80"
            : "bg-gradient-to-b from-black/50 to-black/80"
        }`}
      ></div>
    </Layout>
  );
};

export default Homepage;