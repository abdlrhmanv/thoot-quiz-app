import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Import useTheme
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // Import icons for toggle button
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Layout = ({ children, searchQuery, setSearchQuery, filteredCategories }) => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile navbar toggle
  const { isDarkMode, toggleTheme } = useTheme(); // Get dark mode state and toggle function
  const { user, logOut } = useAuth(); // Get the current user and logOut function

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search Query:", searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Clear the search query
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="bg-primary p-6 shadow-lg fixed w-full top-0 z-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo and Search Bar */}
            <div className="flex items-center space-x-4 md:space-x-96">
              {/* Logo */}
              <Link to="/" className="logo">
                <img
                  src="/Logo.png"
                  alt="Quiz App"
                  className="w-20 h-auto"
                  aria-label="Quiz App Logo"
                />
              </Link>

              {/* Search Bar */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white"
                    aria-label="Search quizzes"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      aria-label="Clear search"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-secondary-200 text-white px-6 py-2 rounded-r-lg hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Submit search"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* Navbar Toggle (Mobile) and Dark Mode Toggle */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleTheme}
                className="bg-secondary-200 text-white p-2 rounded-full hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>

              {/* Navbar Toggle (Mobile) */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-secondary-200 focus:outline-none"
                  aria-label="Toggle navigation menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navbar Links */}
            <nav
              className={`${isOpen ? "block" : "hidden"} md:flex md:items-center space-x-4`}
              aria-label="Main navigation"
            >
              <ul className="flex flex-col md:flex-row md:space-x-4">
                <li>
                  <Link
                    to="/"
                    className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                    aria-label="Home"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quizzes"
                    className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                    aria-label="Quizzes"
                  >
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/results"
                    className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                    aria-label="Results"
                  >
                    Results
                  </Link>
                </li>
                {user ? ( // If the user is logged in
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                        aria-label="Profile"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logOut}
                        className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                        aria-label="Logout"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : ( // If the user is not logged in
                  <li>
                    <Link
                      to="/login"
                      className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                      aria-label="Login"
                    >
                      Login
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/contact-us"
                    className="text-secondary-200 font-bold hover:text-secondary-100 dark:text-white dark:hover:text-gray-300"
                    aria-label="Contact Us"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 bg-[url('/bg.png')] bg-cover bg-center flex flex-col justify-center items-center text-center mt-20 dark:bg-gray-800">
        {children}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-b from-gray-900/50 to-gray-900/80"
              : "bg-gradient-to-b from-black/50 to-black/80"
          }`}
        ></div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-100 p-4 dark:bg-gray-900 z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 z-10">
            <img
              src="/Logo.png"
              alt="Quiz App"
              className="w-20 h-auto mb-4 md:mb-0 z-10"
              aria-label="Quiz App Logo"
            />
          </Link>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-4 z-10">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-800 dark:hover:text-blue-400"
              aria-label="Facebook"
            >
              <FaFacebook size={25} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Twitter"
            >
              <FaTwitter size={25} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-800 dark:hover:text-pink-400"
              aria-label="Instagram"
            >
              <FaInstagram size={25} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-700 dark:hover:text-blue-400"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={25} />
            </a>
          </div>
        </div>

        {/* Copyright Text */}
        <div className="mt-4 flex md:flex-row text-center justify-center items-center z-10">
          <p className="text-center text-gray-400 mt-4 z-10 dark:text-gray-500 ">
            ©Thoot 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;