// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfh3oZgtkf4dW9Er0tTlLya1K5UKvU0FU",
  authDomain: "thoot-quiz-app.firebaseapp.com",
  projectId: "thoot-quiz-app",
  storageBucket: "thoot-quiz-app.firebasestorage.app",
  messagingSenderId: "297192894239",
  appId: "1:297192894239:web:b713d0cecda9e9fb180a2a",
  measurementId: "G-T1727FP7FV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

// Export Firebase services
export { auth, db };