import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("authToken") || null);
    const [cart, setCart] = useState([]);
    const [settings, setSettings] = useState({
        defaultMargin: 60,
        defaultShipping: 200,
        defaultFee: 3.0,
        defaultCurrency: "INR"
    });
    const [loading, setLoading] = useState(true);

    // Global Rate limit states
    const [rateLimitRemaining, setRateLimitRemaining] = useState(null);
    const [rateLimitCooldown, setRateLimitCooldown] = useState(false);
    const [cooldownCountdown, setCooldownCountdown] = useState(0);

    const countdownIntervalRef = useRef(null);

    // Isolated response headers parser
    const parseRateLimitHeaders = (headers) => {
        if (!headers) return;
        const remaining = headers["x-ratelimit-remaining"];
        if (remaining !== undefined) {
            setRateLimitRemaining(parseInt(remaining, 10));
        }
    };

    // Axios interceptor for rate-limit monitoring
    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                parseRateLimitHeaders(response.headers);
                return response;
            },
            (error) => {
                if (error.response) {
                    parseRateLimitHeaders(error.response.headers);
                    if (error.response.status === 429) {
                        setRateLimitCooldown(true);
                        setCooldownCountdown(900); // 15 mins default fallback
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // Cooldown countdown timer using useRef interval token
    useEffect(() => {
        if (rateLimitCooldown) {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
            countdownIntervalRef.current = setInterval(() => {
                setCooldownCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                        setRateLimitCooldown(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [rateLimitCooldown]);

    // Load initial user details, settings, and cart
    useEffect(() => {
        const initializeSession = async () => {
            const savedToken = localStorage.getItem("authToken");
            const savedUser = localStorage.getItem("authUser");
            
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                
                try {
                    // Sync settings and cart with database
                    const settingsRes = await axios.get("/api/settings");
                    if (settingsRes.data.success) {
                        setSettings(settingsRes.data.data);
                    }
                    
                    const cartRes = await axios.get("/api/cart");
                    if (cartRes.data.success) {
                        setCart(cartRes.data.data);
                    }
                } catch (err) {
                    console.error("[Session] Error syncing MERN database states: ", err.message);
                    // If session expired or db unavailable, clear
                    if (err.response && err.response.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };
        
        initializeSession();
    }, [token]);

    // Onboarding handlers
    const signup = async (email, password) => {
        const res = await axios.post("/api/auth/signup", { email, password });
        if (res.data.success) {
            const { token: authToken, user: authUser } = res.data;
            localStorage.setItem("authToken", authToken);
            localStorage.setItem("authUser", JSON.stringify(authUser));
            setToken(authToken);
            setUser(authUser);
            return { success: true };
        }
        return { success: false, message: "Registration failed." };
    };

    const login = async (email, password) => {
        const res = await axios.post("/api/auth/login", { email, password });
        if (res.data.success) {
            const { token: authToken, user: authUser } = res.data;
            localStorage.setItem("authToken", authToken);
            localStorage.setItem("authUser", JSON.stringify(authUser));
            setToken(authToken);
            setUser(authUser);
            return { success: true };
        }
        return { success: false, message: "Authentication failed." };
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
        setCart([]);
    };

    // Database cart sync managers
    const addToDbCart = async (item) => {
        if (!token) return;
        try {
            const res = await axios.post("/api/cart", item);
            if (res.data.success) {
                setCart(res.data.data);
            }
        } catch (err) {
            console.error("[Cart] Failed to add item: ", err.message);
        }
    };

    const removeFromDbCart = async (itemId) => {
        if (!token) return;
        try {
            const res = await axios.delete(`/api/cart/${itemId}`);
            if (res.data.success) {
                setCart(res.data.data);
            }
        } catch (err) {
            console.error("[Cart] Failed to remove item: ", err.message);
        }
    };

    // Database settings sync manager
    const updateDbSettings = async (newSettings) => {
        if (!token) return;
        try {
            const res = await axios.post("/api/settings", newSettings);
            if (res.data.success) {
                setSettings(res.data.data);
                return { success: true };
            }
        } catch (err) {
            console.error("[Settings] Failed to save variables: ", err.message);
            return { success: false, error: err.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            cart,
            settings,
            loading,
            signup,
            login,
            logout,
            addToDbCart,
            removeFromDbCart,
            updateDbSettings,
            rateLimitRemaining,
            rateLimitCooldown,
            cooldownCountdown
        }}>
            {children}
        </AuthContext.Provider>
    );
};
