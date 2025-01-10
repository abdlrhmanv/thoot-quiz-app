import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import { QuizContext } from "../context/QuizContext.jsx"; // Import QuizContext
import { useTheme } from "../context/ThemeContext"; // Import useTheme
import { db, auth } from "../firebase"; // Import Firestore and Authentication
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

function ResultsPage() {
  const { quizHistory } = useContext(QuizContext); // Get local quiz history from context
  const { isDarkMode } = useTheme(); // Get dark mode state
  const [firestoreQuizHistory, setFirestoreQuizHistory] = useState([]); // State for Firestore data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch quiz history from Firestore
  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const userId = auth.currentUser?.uid; // Get the current user's ID
        if (userId) {
          const querySnapshot = await getDocs(
            collection(db, "users", userId, "quizHistory")
          );
          const history = querySnapshot.docs.map((doc) => doc.data());
          setFirestoreQuizHistory(history); // Set Firestore quiz history
        }
      } catch (error) {
        console.error("Error fetching quiz history:", error);
        setError("Failed to fetch quiz history. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchQuizHistory();
  }, []);

  // Combine local quiz history (from context) and Firestore quiz history
  const combinedQuizHistory = [...quizHistory, ...firestoreQuizHistory];

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="p-4 md:p-10">
          <p className="text-gray-700 dark:text-gray-300">Loading quiz history...</p>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="p-4 md:p-10">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-10 z-10">
        <h1 className="text-2xl font-bold mb-4 text-secondary-200 dark:text-white">Quiz History</h1>
        {combinedQuizHistory.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No quiz history available.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex-auto">
              <thead className="bg-secondary-200 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 border text-left text-xs font-medium text-black uppercase tracking-wider dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-4 py-2 border text-left text-xs font-medium  text-black uppercase tracking-wider dark:text-gray-300">
                    Difficulty
                  </th>
                  <th className="px-4 py-2 border text-left text-xs font-medium  text-black uppercase tracking-wider dark:text-gray-300">
                    Score
                  </th>
                  <th className="px-4 py-2 border text-left text-xs font-medium text-black uppercase tracking-wider dark:text-gray-300">
                    Total Questions
                  </th>
                  <th className="px-4 py-2 border text-left text-xs font-medium  text-black uppercase tracking-wider dark:text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {combinedQuizHistory.map((quiz, index) => (
                  <tr
                    key={index}
                    className="bg-secondary-300 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-2 border text-sm text-gray-900 dark:text-gray-200">
                      {quiz.category}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-900 dark:text-gray-200">
                      {quiz.difficulty}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-900 dark:text-gray-200">
                      {quiz.score}/{quiz.totalQuestions}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-900 dark:text-gray-200">
                      {quiz.totalQuestions}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-900 dark:text-gray-200">
                      {quiz.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Gradient Overlay */}
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

export default ResultsPage;