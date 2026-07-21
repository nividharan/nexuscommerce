import axios from "axios";

// Dynamically target Render cloud backend vs local backend server
const isProduction = import.meta.env.PROD || window.location.hostname !== "localhost";

const apiBaseUrl = isProduction 
    ? (import.meta.env.VITE_API_URL || "https://nexuscommerce-backend.onrender.com") 
    : "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

// Automatically extract and append JWT token to outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
