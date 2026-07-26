import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PricingPlans = () => {
    const { token } = useContext(AuthContext);

    return (
        <main className="app-content" style={{ maxWidth: "850px", margin: "2rem auto" }}>
            {/* Header section */}
            <div className="card glass" style={{ textAlign: "center", padding: "3.5rem 2rem", border: "1px solid rgba(56, 189, 248, 0.2)", boxShadow: "0 0 40px rgba(56, 189, 248, 0.08)" }}>
                <span className="badge" style={{ marginBottom: "1rem", background: "rgba(52, 211, 153, 0.15)", color: "var(--accent-emerald)" }}>
                    ✨ Platform Access Unlocked
                </span>
                
                <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "1rem" }}>
                    Full E-Commerce Automation <span className="gradient-text">Included</span>
                </h1>
                
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "620px", margin: "0 auto 2rem auto", lineHeight: 1.6 }}>
                    All subscription paywalls have been removed. Every operator account has full, unthrottled access to AI pipeline Vision runs, bulk JSON/CSV compilers, and direct API catalog exports.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2.5rem", textAlign: "left" }}>
                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                        <div style={{ color: "var(--accent-cyan)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>⚡</div>
                        <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Unlimited Pipeline</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Process raw notes and generate studio assets with zero quotas.</p>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                        <div style={{ color: "var(--accent-emerald)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>📦</div>
                        <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Full Export Queue</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Compile and export Shopify-ready CSVs and Monaco JSON syntax.</p>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                        <div style={{ color: "var(--accent-indigo)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>🔑</div>
                        <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Full API Access</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Connect custom webhooks and backend endpoints freely.</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <Link to="/" className="btn-primary" style={{ padding: "12px 28px", textDecoration: "none" }}>
                        <span>Explore Marketplace Catalog</span>
                    </Link>
                    <Link to="/product" className="btn-secondary" style={{ padding: "12px 28px", textDecoration: "none", color: "var(--text-primary)" }}>
                        <span>Open AI Product Workspace</span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PricingPlans;
