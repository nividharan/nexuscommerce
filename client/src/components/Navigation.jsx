import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navigation = () => {
    const { token, user, cart, logout, settings } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const page = location.pathname;
    const planName = settings?.activePlan || "Free";

    return (
        <header className="app-header nav-header glass">
            <div className="nav-container">
                {/* Brand Logo */}
                <div className="logo-area" onClick={() => navigate("/")}>
                    <div className="logo-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="brand-name">NexusCommerce</span>
                        <span className="tagline">Production Pipeline</span>
                    </div>
                </div>

                {/* Search Mockup */}
                <div className="search-container-mock">
                    <input type="text" className="search-input-mock" placeholder="Search for products, templates and more..." readOnly />
                    <button className="search-btn-mock" aria-label="Search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="nav-links-menu">
                    <Link to="/" className={`nav-link ${page === "/" ? "active" : ""}`}>Marketplace</Link>
                    <Link to="/pricing" className={`nav-link ${page === "/pricing" ? "active" : ""}`}>Pricing</Link>
                    <Link to="/api-docs" className={`nav-link ${page === "/api-docs" ? "active" : ""}`}>API Hub</Link>
                    <Link to="/account" className={`nav-link ${page === "/account" ? "active" : ""}`}>Settings</Link>
                    
                    {/* Cart Link with counter */}
                    <Link to="/checkout" className={`nav-link cart-link ${page === "/checkout" ? "active" : ""}`}>
                        <div className="cart-icon-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </div>
                        <span>Cart</span>
                    </Link>

                    {token ? (
                        <div className="nav-user-area">
                            <div className="nav-user-info">
                                <span className="user-label">Operator ({planName}):</span>
                                <span className="user-email" title={user?.email}>{user?.email}</span>
                            </div>
                            <button onClick={logout} className="btn-logout-nav">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-login-nav">Login</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navigation;
