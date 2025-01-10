import React, { createContext, useState } from "react";

// Create a context for quiz history
export const QuizContext = createContext();

// Create a provider component
export const QuizProvider = ({ children }) => {
  const [quizHistory, setQuizHistory] = useState([]);

  // Function to add a quiz result to history
  const addQuizResult = (result) => {
    setQuizHistory((prevHistory) => [...prevHistory, result]);
  };

  return (
    <QuizContext.Provider value={{ quizHistory, addQuizResult }}>
      {children}
    </QuizContext.Provider>
  );
};