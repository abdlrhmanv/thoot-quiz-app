import React from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useTheme } from "../context/ThemeContext";
import Layout from "./Layout";

function Profile() {
  const { user } = useAuth(); // Get the current user
  const { isDarkMode } = useTheme();

  return (
    <Layout>
    <div className="p-4 z-10  text-secondary-200 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 ">Profile</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          {/* Add more profile information here */}
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
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

export default Profile;