import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Layout from "./Layout";

const QuizSetup = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch quiz categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://opentdb.com/api_category.php");
        const data = await response.json();
        setCategories(data.trivia_categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartQuiz = () => {
    if (!selectedCategory || !difficulty || questionCount < 1) {
      alert("Please select all options before starting the quiz.");
      return;
    }

    // Navigate to the quiz page with query parameters
    const queryParams = new URLSearchParams({
      category: selectedCategory,
      difficulty: difficulty,
      amount: questionCount,
    }).toString();

    navigate(`/quiz?${queryParams}`); // Use navigate instead of window.location.href
  };

  return (
    <Layout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredCategories={filteredCategories}
    >
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow z-10 dark:bg-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-center text-secondary-200 dark:text-white">
          Setup Your Quiz
        </h1>
        {loading && <p className="text-center text-secondary-200 dark:text-gray-300">Loading categories...</p>}

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block font-bold mb-2 text-secondary-200 dark:text-gray-300">
            Select a Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select a Category --</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div className="mb-4">
          <label className="block font-bold mb-2 text-secondary-200 dark:text-gray-300">
            Select Difficulty:
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select Difficulty --</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div className="mb-4">
          <label className="block font-bold mb-2 text-secondary-200 dark:text-gray-300">
            Number of Questions:
          </label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white"
            min="1"
            max="50"
          />
        </div>

        {/* Start Quiz Button */}
        <button
          onClick={handleStartQuiz}
          className="w-full bg-secondary-200 text-white py-2 rounded hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Start Quiz
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
    </Layout>
  );
};

export default QuizSetup;