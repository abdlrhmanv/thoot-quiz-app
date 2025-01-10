// src/utils/quizHistory.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveQuizResult = async (userId, quizResult) => {
  try {
    // Save quiz result to Firestore under the user's document
    await setDoc(doc(db, "users", userId, "quizHistory", quizResult.id), quizResult);
    console.log("Quiz result saved successfully!");
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
};