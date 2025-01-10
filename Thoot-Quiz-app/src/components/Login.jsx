import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import Layout from "./Layout";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <Layout>
    <div className="p-4 z-10">
      <h1 className="text-2xl font-bold mb-4 text-secondary-200 dark:text-white">Login</h1>
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
          className="w-full bg-secondary-200 text-white px-4 py-2 rounded-lg hover:bg-secondary-100"
        >
          Login
        </button>
      </form>

      {/* Add a Sign Up link */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">Don't have an account?</p>
        <Link
          to="/signup"
          className="text-secondary-200 hover:text-secondary-100 dark:text-white font-semibold"
        >
          Sign Up
        </Link>
      </div>
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

export default Login;