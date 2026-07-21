import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PricingPlans = () => {
    const { settings, updateDbSettings, token } = useContext(AuthContext);
    const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or annual
    const [loadingPlan, setLoadingPlan] = useState("");
    const navigate = useNavigate();

    const plans = [
        {
            name: "Free",
            priceMonthly: 0,
            priceAnnual: 0,
            features: [
                "2 Active Catalog Items",
                "Standard Vision segmentation queue",
                "Basic CSV Shopify imports",
                "Self-service community support"
            ],
            color: "var(--text-secondary)",
            buttonText: "Current Plan",
            action: "free"
        },
        {
            name: "Growth",
            priceMonthly: 2900,
            priceAnnual: 2320, // 20% off
            features: [
                "25 Active Catalog Items",
                "Priority AI Vision processing",
                "Bulk JSON / CSV exporting",
                "Shopify Direct API integrations",
                "Developer API access (10k requests/mo)",
                "Email support (24h response)"
            ],
            color: "var(--accent-cyan)",
            buttonText: "Upgrade to Growth",
            action: "upgrade",
            popular: true
        },
        {
            name: "Scale",
            priceMonthly: 7900,
            priceAnnual: 6320, // 20% off
            features: [
                "Unlimited Catalog Items",
                "Dedicated GPU Vision segmentations",
                "Automated web scraper syncs",
                "Full Developer API access (Unlimited)",
                "Stripe / Shopify advanced routing",
                "Dedicated slack channel support"
            ],
            color: "var(--accent-emerald)",
            buttonText: "Upgrade to Scale",
            action: "upgrade"
        }
    ];

    const handleSelectPlan = async (planName) => {
        if (!token) {
            alert("Please login as an operator to subscribe or change plans.");
            navigate("/login");
            return;
        }

        setLoadingPlan(planName);
        try {
            const res = await updateDbSettings({ ...settings, activePlan: planName });
            if (res && res.success) {
                alert(`Successfully subscribed to the "${planName}" plan! Your database profile has been updated.`);
            } else {
                alert("Failed to update subscription. Please try again.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPlan("");
        }
    };

    const currentPlan = settings?.activePlan || "Free";

    return (
        <main className="app-content" style={{ maxWidth: "1100px" }}>
            {/* Header section */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <span className="badge" style={{ marginBottom: "0.75rem" }}>SaaS Subscription Desk</span>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                    Select Your <span className="gradient-text">Automation Plan</span>
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto 1.5rem auto", lineHeight: 1.5 }}>
                    Scale your e-commerce production pipeline with dedicated AI segmentations, expanded Shopify syncing endpoints, and custom profit margin profiles.
                </p>

                {/* Billing cycle switcher */}
                <div style={{ display: "inline-flex", background: "rgba(17, 24, 39, 0.6)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-glass)" }}>
                    <button 
                        onClick={() => setBillingCycle("monthly")}
                        style={{ 
                            background: billingCycle === "monthly" ? "var(--bg-elevated)" : "transparent",
                            border: "none", color: "var(--text-primary)", padding: "6px 16px", borderRadius: "6px",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", transition: "var(--transition)"
                        }}
                    >
                        Monthly Billing
                    </button>
                    <button 
                        onClick={() => setBillingCycle("annual")}
                        style={{ 
                            background: billingCycle === "annual" ? "var(--bg-elevated)" : "transparent",
                            border: "none", color: "var(--text-primary)", padding: "6px 16px", borderRadius: "6px",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", transition: "var(--transition)",
                            display: "flex", alignItems: "center", gap: "6px"
                        }}
                    >
                        <span>Annual Billing</span>
                        <span style={{ fontSize: "0.62rem", background: "rgba(52, 211, 153, 0.15)", color: "var(--accent-emerald)", padding: "2px 6px", borderRadius: "10px" }}>Save 20%</span>
                    </button>
                </div>
            </div>

            {/* Pricing Card Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", alignItems: "stretch" }}>
                {plans.map((p) => {
                    const isCurrent = currentPlan.toLowerCase() === p.name.toLowerCase();
                    const displayedPrice = billingCycle === "monthly" ? p.priceMonthly : p.priceAnnual;
                    
                    return (
                        <div 
                            key={p.name} 
                            className="card glass" 
                            style={{ 
                                display: "flex", flexDirection: "column", padding: "2.25rem", position: "relative",
                                border: isCurrent ? `1px solid ${p.color}` : p.popular ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--border-glass)",
                                boxShadow: isCurrent ? `0 0 20px rgba(56, 189, 248, 0.05)` : "var(--shadow-premium)",
                                overflow: "hidden"
                            }}
                        >
                            {p.popular && (
                                <div style={{ 
                                    position: "absolute", top: "12px", right: "12px", fontSize: "0.62rem", 
                                    background: "rgba(56, 189, 248, 0.15)", color: "var(--accent-cyan)", 
                                    padding: "3px 10px", borderRadius: "12px", fontWeight: 700, textTransform: "uppercase" 
                                }}>
                                    Most Popular
                                </div>
                            )}

                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>{p.name} Plan</h3>
                            <div style={{ display: "flex", alignItems: "baseline", marginBottom: "1.5rem" }}>
                                <span style={{ fontSize: "1.85rem", fontWeight: 900 }}>₹{displayedPrice}</span>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: "4px" }}>
                                    / {billingCycle === "monthly" ? "mo" : "mo, billed annually"}
                                </span>
                            </div>

                            {/* Features list */}
                            <ul style={{ listStyle: "none", marginBottom: "2rem", flexGrow: 1 }}>
                                {p.features.map((f, i) => (
                                    <li key={i} style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Plan Action Button */}
                            {isCurrent ? (
                                <button disabled style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem" }}>
                                    Active Plan
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleSelectPlan(p.name)} 
                                    className="btn-primary" 
                                    style={{ width: "100%", padding: "12px", background: p.action === "free" ? "rgba(255,255,255,0.05)" : "var(--grad-neon)", color: p.action === "free" ? "var(--text-primary)" : "#0b0f19" }}
                                    disabled={loadingPlan !== ""}
                                >
                                    <span>{loadingPlan === p.name ? "Syncing..." : p.buttonText}</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default PricingPlans;
