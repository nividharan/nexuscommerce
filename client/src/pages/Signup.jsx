import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
    const { token, signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // If token exists, direct back to homepage
    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Password length validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        // 2. Letters & numbers validation
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        if (!hasLetters || !hasNumbers) {
            setError("Password must contain both letters and numbers.");
            return;
        }

        // 3. Confirm matching passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await signup(email, password);
            if (res.success) {
                alert("Account registration successful! Directing to marketplace.");
                navigate("/");
            } else {
                setError(res.message || "Failed to register profile.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An account with this email already exists.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <body className="auth-body">
            <div className="auth-container">
                {/* Logo Area */}
                <div className="logo-area" style={{ justifyContent: "center", marginBottom: "2rem", flexDirection: "column", textAlign: "center" }}>
                    <div className="logo-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="brand-name" style={{ fontSize: "1.4rem", marginTop: "4px" }}>NexusCommerce</span>
                        <span className="tagline" style={{ fontSize: "0.65rem" }}>Production Pipeline</span>
                    </div>
                </div>

                <div className="card glass auth-card">
                    <h3>Operator Registration</h3>
                    <p className="auth-subtitle">Register a new profile in the local database to configure default profit margin profiles.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="signup-email">Email Address</label>
                            <input type="email" id="signup-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@nexuscommerce.net" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="signup-password">Password</label>
                            <input type="password" id="signup-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Must contain at least 6 characters with mixed letters and numbers.</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="signup-confirm-password">Confirm Password</label>
                            <input type="password" id="signup-confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                        </div>

                        {error && <div className="auth-error-box">{error}</div>}

                        <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                            <span>{loading ? "Registering..." : "Create Operator Profile"}</span>
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default Signup;
