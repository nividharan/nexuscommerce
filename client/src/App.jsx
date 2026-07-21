import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Pages
import Marketplace from "./pages/Marketplace";
import ProductWorkspace from "./pages/ProductWorkspace";
import CartCompiler from "./pages/CartCompiler";
import AccountSettings from "./pages/AccountSettings";
import PricingPlans from "./pages/PricingPlans";
import ApiHub from "./pages/ApiHub";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Components
import Navigation from "./components/Navigation";

// Route Guard Component
const ProtectedRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "100px" }}>Loading session details...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    const { rateLimitRemaining, rateLimitCooldown, cooldownCountdown } = useContext(AuthContext);

    // Format cooldown countdown timer
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Structural guard for Rate Limit Lockout
    if (rateLimitCooldown) {
        return (
            <div style={{
                width: "100vw",
                height: "100vh",
                background: "#060a13",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px"
            }} className="w-full h-screen flex items-center justify-center bg-[#060a13]">
                <div className="card glass animate-neon-lockout" style={{
                    maxWidth: "480px",
                    width: "100%",
                    padding: "2.5rem",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    boxShadow: "0 0 30px rgba(239, 68, 68, 0.15)",
                    textAlign: "center"
                }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem auto",
                        color: "var(--accent-rose)",
                        fontSize: "1.75rem",
                        border: "1px solid rgba(239, 68, 68, 0.3)"
                    }}>
                        ⏳
                    </div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                        Rate Limit Lockout Active
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                        Pipeline cooldown is enforced due to rate boundaries. Please wait for the cooldown window to complete.
                    </p>
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        color: "var(--accent-rose)",
                        letterSpacing: "1px",
                        background: "rgba(0, 0, 0, 0.3)",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        display: "inline-block",
                        border: "1px solid rgba(255, 255, 255, 0.05)"
                    }}>
                        {formatTime(cooldownCountdown)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            {/* Rate limit warning banner */}
            {rateLimitRemaining !== null && rateLimitRemaining <= 20 && !rateLimitCooldown && (
                <div style={{
                    background: "rgba(239, 68, 68, 0.95)",
                    color: "#ffffff",
                    textAlign: "center",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                }}>
                    <span>⚠️ Approaching pipeline rate limit ({rateLimitRemaining} requests remaining). Please pause heavy bulk executions to prevent temporary lockout.</span>
                </div>
            )}

            <Navigation />
            <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/product" element={<ProductWorkspace />} />
                <Route path="/pricing" element={<PricingPlans />} />
                <Route path="/api-docs" element={<ApiHub />} />
                
                {/* Protected Routes */}
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <CartCompiler />
                    </ProtectedRoute>
                } />
                <Route path="/account" element={
                    <ProtectedRoute>
                        <AccountSettings />
                    </ProtectedRoute>
                } />

                {/* Onboarding Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
