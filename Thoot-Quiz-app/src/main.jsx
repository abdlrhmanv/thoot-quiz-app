import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <ThemeProvider> {/* Wrap the app with ThemeProvider */}
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);