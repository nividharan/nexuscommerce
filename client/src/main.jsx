import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import axios from "axios";

// Dynamically target Render cloud backend vs local backend server
const isProduction = typeof process !== "undefined" && process.env?.NODE_ENV === "production" 
    || import.meta.env.PROD 
    || window.location.hostname !== "localhost";

const apiBaseUrl = isProduction 
    ? (import.meta.env.VITE_API_URL || "https://nexuscommerce-1.onrender.com") 
    : "http://localhost:5000";

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
