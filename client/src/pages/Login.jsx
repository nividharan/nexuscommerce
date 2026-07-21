import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { token, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res.success) {
                navigate("/");
            } else {
                setError(res.message || "Failed to log in.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid operator email or password.");
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
                    <h3>Operator Login</h3>
                    <p className="auth-subtitle">Sign in with your operator credentials to sync database exports and pipeline parameters.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="login-email">Email Address</label>
                            <input type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@nexuscommerce.net" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="login-password">Password</label>
                            <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>

                        {error && <div className="auth-error-box">{error}</div>}

                        <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                            <span>{loading ? "Authenticating..." : "Sign In"}</span>
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>New operator? </span>
                        <Link to="/signup">Create an Account</Link>
                    </div>
                </div>
            </div>
        </body>
    );
};

export default Login;
