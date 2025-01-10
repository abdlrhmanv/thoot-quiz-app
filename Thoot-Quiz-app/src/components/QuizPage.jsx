import React, { useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { QuizContext } from "../context/QuizContext.jsx"; // Corrected import path
import { db } from "../firebase"; // Import Firestore
import { auth } from "../firebase"; // Import Firebase Authentication
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { useTheme } from "../context/ThemeContext";

function QuizPage() {
  const { addQuizResult } = useContext(QuizContext); // Access the context
  const { isDarkMode } = useTheme(); // Get dark mode state

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [timerActive, setTimerActive] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const categoryId = queryParams.get("category");
  const difficulty = queryParams.get("difficulty");
  const amount = Math.min(Math.max(1, parseInt(queryParams.get("amount"))), 50); // Validate amount

  // Mapping of category IDs to category names
  const categoryMap = {
    9: "General Knowledge",
    10: "Entertainment: Books",
    11: "Entertainment: Film",
    12: "Entertainment: Music",
    13: "Entertainment: Musicals & Theatres",
    14: "Entertainment: Television",
    15: "Entertainment: Video Games",
    16: "Entertainment: Board Games",
    17: "Science & Nature",
    18: "Science: Computers",
    19: "Science: Mathematics",
    20: "Mythology",
    21: "Sports",
    22: "Geography",
    23: "History",
    24: "Politics",
    25: "Art",
    26: "Celebrities",
    27: "Animals",
    28: "Vehicles",
    29: "Entertainment: Comics",
    30: "Science: Gadgets",
    31: "Entertainment: Japanese Anime & Manga",
    32: "Entertainment: Cartoon & Animations",
  };

  const categoryName = categoryMap[categoryId] || "Unknown Category"; // Get category name from ID

  // Fetch a session token from the API
  const fetchSessionToken = async () => {
    try {
      const response = await fetch("https://opentdb.com/api_token.php?command=request");
      const data = await response.json();
      if (data.response_code === 0) {
        setSessionToken(data.token);
        localStorage.setItem("sessionToken", data.token); // Cache the token
      } else {
        setError("Failed to fetch session token. Please try again later.");
      }
    } catch (err) {
      setError("Failed to fetch session token. Please try again later.");
    }
  };

  // Fetch quiz questions with exponential backoff
  const fetchQuestions = async (retries = 3, delay = 1000) => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple&token=${sessionToken}`;

      // Add a delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, delay));

      const response = await fetch(url);

      // Handle 429 Too Many Requests error
      if (response.status === 429 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 2)); // Double the delay
        return fetchQuestions(retries - 1, delay * 2); // Retry with increased delay
      }

      const data = await response.json();

      if (data.response_code === 0) {
        // Limit the number of questions to the requested amount
        const limitedQuestions = data.results.slice(0, amount);
        setQuestions(limitedQuestions);
        localStorage.setItem("quizQuestions", JSON.stringify(limitedQuestions)); // Cache limited questions
      } else if (data.response_code === 1) {
        setError("No questions found for the selected criteria.");
      } else if (data.response_code === 2) {
        setError("Invalid parameters. Please check your selections.");
      } else if (data.response_code === 3 || data.response_code === 4) {
        setError("Session token issue. Please try again.");
      } else {
        setError("Failed to fetch questions. Please try again later.");
      }
    } catch (err) {
      setError("Failed to fetch questions. Please try again later.");
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      // Validate amount
      if (isNaN(amount) || amount < 1 || amount > 50) {
        setError("Invalid number of questions. Please select between 1 and 50.");
        setLoading(false);
        return;
      }

      // Check for cached questions
      const cachedQuestions = localStorage.getItem("quizQuestions");
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        setLoading(false);
        return;
      }

      // Check for cached session token
      const cachedToken = localStorage.getItem("sessionToken");
      if (cachedToken) {
        setSessionToken(cachedToken);
      } else {
        await fetchSessionToken();
      }

      // Fetch questions if parameters are valid
      if (categoryId && difficulty && amount) {
        await fetchQuestions();
      } else {
        setError("Invalid quiz parameters. Please try again.");
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [categoryId, difficulty, amount, sessionToken]);

  // Timer logic
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion(); // Move to the next question when time runs out
    }
  }, [timeLeft, timerActive]);

  // Reset timer when moving to the next question
  useEffect(() => {
    setTimeLeft(60); // Reset timer to 60 seconds
    setTimerActive(true); // Activate timer for the new question
  }, [currentQuestionIndex]);

  // Memoize shuffled answers to prevent re-shuffling on every render
  const shuffledAnswers = useMemo(() => {
    if (!questions.length || !questions[currentQuestionIndex]) return [];
    const currentQuestion = questions[currentQuestionIndex];
    return [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(
      () => Math.random() - 0.5
    );
  }, [questions, currentQuestionIndex]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!questions.length || currentQuestionIndex >= questions.length) {
      setError("No questions available. Please try again.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      setError("Invalid question. Please try again.");
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    // Update score and user answers
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correct_answer,
        isCorrect,
      },
    ]);

    // Move to the next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Save quiz result to Firestore
      const userId = auth.currentUser?.uid;
      if (userId) {
        const quizResult = {
          id: `quiz_${Date.now()}`,
          category: categoryName,
          difficulty,
          score,
          totalQuestions: questions.length,
          date: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, "users", userId, "quizHistory", quizResult.id), quizResult);
          console.log("Quiz result saved to Firestore!");
        } catch (error) {
          console.error("Error saving quiz result to Firestore:", error);
        }
      }

      // Save quiz result to context
      const quizResult = {
        category: categoryName,
        difficulty,
        score,
        totalQuestions: questions.length,
        date: new Date().toLocaleString(),
      };
      addQuizResult(quizResult);

      setShowResults(true); // Show results when all questions are answered
    }

    // Stop the timer when moving to the next question
    setTimerActive(false);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setUserAnswers([]);
    setTimeLeft(60); // Reset timer
    setTimerActive(true); // Activate timer
    localStorage.removeItem("quizQuestions"); // Clear cached questions
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => fetchQuestions()}
          className="mt-4 bg-secondary-200 text-white py-2 px-4 rounded hover:bg-secondary-100 mr-2"
        >
          Retry
        </button>
        <button
          onClick={() => navigate("/quizzes")}
          className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Go Back to Setup
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <Layout>
        <div className="p-24 text-secondary-200 dark:text-white z-10">
          <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
          <p className="text-xl font-bold">
            Your Score: {score}/{questions.length}
          </p>

          <div className="mt-6">
            {userAnswers.map((answer, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold">
                  {index + 1}. {answer.question}
                </h3>
                <p className="text-gray-300 dark:text-gray-300">
                  Your Answer:{" "}
                  <span className={answer.isCorrect ? "text-green-500" : "text-red-500"}>
                    {answer.selectedAnswer || "No answer selected"}
                  </span>
                </p>
                <p className="text-gray-300 dark:text-gray-300">
                  Correct Answer:{" "}
                  <span className="text-green-500">{answer.correctAnswer}</span>
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleRestartQuiz}
            className="mt-4 bg-secondary-200 text-white py-2 px-4 rounded hover:bg-secondary-100 mr-2"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate("/results")}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            View Quiz History
          </button>
        </div>
        {/* Overlay */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-b from-gray-900/50 to-gray-900/80"
              : "bg-gradient-to-b from-black/50 to-black/80"
          }`}
        ></div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return <p>No questions found.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <p>Invalid question. Please try again.</p>;
  }

  return (
    <Layout>
      <div className="p-4 z-10 text-secondary-200 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 text-secondary-200 dark:text-white">Quiz Page</h1>
        <p>Category: {categoryName}</p>
        <p>Difficulty: {difficulty}</p>
        <p>Number of Questions: {amount}</p>

        <div className="mt-6 text-secondary-200 dark:text-white">
          <h3 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1}: {currentQuestion.question}
          </h3>
          <p className="text-secondary-300 dark:text-white">Time Left: {timeLeft} seconds</p>
          <ul className="mt-2">
            {shuffledAnswers.map((answer, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => handleAnswerClick(answer)}
                  className={`w-full text-left bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 ${
                    selectedAnswer === answer ? "bg-blue-200" : ""
                  }`}
                >
                  {answer}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="mt-4 bg-secondary-200 text-white py-2 px-4 rounded hover:bg-secondary-100 disabled:bg-gray-400"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </button>
      </div>
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900/50 to-gray-900/80"
            : "bg-gradient-to-b from-black/50 to-black/80"
        }`}
      ></div>
    </Layout>
  );
}

export default QuizPage;