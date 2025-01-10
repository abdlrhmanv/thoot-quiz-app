// src/components/Signup.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useTheme } from "../context/ThemeContext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  return (
    <Layout>
    <div className="p-4 z-10">
      <h1 className="text-2xl font-bold mb-4 text-secondary-200 dark:text-white">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-secondary-200 hover:bg-secondary-100 text-white px-4 py-2 rounded-lg"
        >
          Sign Up
        </button>
      </form>
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
}

export default Signup;