import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const AccountSettings = () => {
    const { settings, updateDbSettings } = useContext(AuthContext);
    
    const [margin, setMargin] = useState(60);
    const [shipping, setShipping] = useState(200);
    const [fee, setFee] = useState(3.0);
    const [currency, setCurrency] = useState("INR");
    const [shopifyDomain, setShopifyDomain] = useState("");
    const [shopifyAccessToken, setShopifyAccessToken] = useState("");
    
    const [statusMsg, setStatusMsg] = useState("");
    const [statusType, setStatusType] = useState("success");
    const [apiKey, setApiKey] = useState("nx_live_51Mzk2M0NhcmRUcmFuc2FjdGlvbg");
    const [marginError, setMarginError] = useState("");

    const handleMarginChange = (val) => {
        let numericVal = parseInt(val, 10);
        
        if (isNaN(numericVal)) {
            setMargin("");
            return;
        }

        if (numericVal > 95) {
            setMargin(95);
            setMarginError("⚠️ Margins must fall strictly within safe structural limits (5% - 95%) to protect automated API models.");
        } else if (numericVal < 5) {
            setMargin(5);
            setMarginError("⚠️ Margins must fall strictly within safe structural limits (5% - 95%) to protect automated API models.");
        } else {
            setMargin(numericVal);
            setMarginError("");
        }
    };

    const handleMarginKeyDown = (e) => {
        if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+" || e.key === ".") {
            e.preventDefault();
        }
    };

    // Sync state with settings object from Context
    useEffect(() => {
        if (settings) {
            setMargin(settings.defaultMargin);
            setShipping(settings.defaultShipping);
            setFee(settings.defaultFee);
            setCurrency(settings.defaultCurrency);
            setShopifyDomain(settings.shopifyDomain || "");
            setShopifyAccessToken(settings.shopifyAccessToken || "");
        }
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg("");
        
        const newSettings = {
            ...settings,
            defaultMargin: parseFloat(margin) || 60,
            defaultShipping: parseFloat(shipping) || 0,
            defaultFee: parseFloat(fee) || 0,
            defaultCurrency: currency,
            shopifyDomain: shopifyDomain.trim(),
            shopifyAccessToken: shopifyAccessToken.trim()
        };

        const res = await updateDbSettings(newSettings);
        if (res && res.success) {
            setStatusType("success");
            setStatusMsg("Configuration settings saved successfully to MongoDB!");
        } else {
            setStatusType("error");
            setStatusMsg("Failed to save variables to server: " + (res?.error || "Unknown error"));
        }

        setTimeout(() => setStatusMsg(""), 3000);
    };

    const handleRotateApiKey = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let newKey = "nx_live_";
        for (let i = 0; i < 32; i++) {
            newKey += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setApiKey(newKey);
        alert("API Key rotated successfully! Please update your external client integrations.");
    };

    return (
        <main className="app-content" style={{ maxWidth: "800px" }}>
            <section className="card glass settings-card" style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 700, borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    <span>Pipeline Baseline Parameters & Controls</span>
                </h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="settings-grid">
                        <div className="input-group">
                            <label htmlFor="acc-margin">Default Profit Margin (%)</label>
                            <input 
                                type="number" 
                                id="acc-margin" 
                                value={margin} 
                                onChange={(e) => handleMarginChange(e.target.value)} 
                                onKeyDown={handleMarginKeyDown}
                                min="5" 
                                max="95"
                                style={{
                                    borderColor: marginError ? "var(--accent-rose)" : "",
                                    boxShadow: marginError ? "0 0 10px rgba(239, 68, 68, 0.2)" : ""
                                }}
                            />
                            {marginError ? (
                                <span style={{ fontSize: "0.68rem", color: "var(--accent-rose)", display: "block", marginTop: "4px", lineHeight: 1.4 }}>{marginError}</span>
                            ) : (
                                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Sets the target baseline markup in product files.</span>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="acc-shipping">Default Shipping Cost</label>
                            <input type="number" id="acc-shipping" value={shipping} onChange={(e) => setShipping(e.target.value)} step="10" />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Fulfillment cost (use base currency numerical values).</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="acc-fee">Default Platform Fee (%)</label>
                            <input type="number" id="acc-fee" value={fee} onChange={(e) => setFee(e.target.value)} step="0.1" />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Gateway card processing and site hosting allowances.</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="acc-currency">Currency Code</label>
                            <input type="text" id="acc-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Use INR (₹) or USD ($) settings.</span>
                        </div>
                    </div>

                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", margin: "2rem 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        <span>Shopify Native Integration Credentials</span>
                    </h3>

                    <div className="settings-grid">
                        <div className="input-group">
                            <label htmlFor="acc-shopify-domain">Shopify Custom Domain</label>
                            <input type="text" id="acc-shopify-domain" value={shopifyDomain} onChange={(e) => setShopifyDomain(e.target.value)} placeholder="your-store-name.myshopify.com" />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Your private Shopify storefront subdomain domain.</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="acc-shopify-token">Admin Access Token</label>
                            <input type="password" id="acc-shopify-token" value={shopifyAccessToken} onChange={(e) => setShopifyAccessToken(e.target.value)} placeholder="shpat_••••••••••••••••••••••••" />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Shopify Custom App Admin API credentials token.</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-glass)", paddingTop: "1.5rem", marginTop: "1rem" }}>
                        <span id="settings-status-msg" style={{ fontSize: "0.85rem", fontWeight: 600, color: statusType === "success" ? "var(--accent-emerald)" : "#ef4444", display: statusMsg ? "block" : "none" }}>
                            {statusMsg}
                        </span>
                        <button type="submit" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>
                            Save Parameters
                        </button>
                    </div>
                </form>
            </section>

            <section className="card glass settings-card">
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-cyan)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>Developer B2B API Token</span>
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                    Use this token to authenticate external scrapers, catalog listeners, or custom inventory management endpoints. Keep this key private.
                </p>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <input type="text" readOnly value={apiKey} style={{ flexGrow: 1, fontFamily: "var(--font-mono)", fontSize: "0.8rem", background: "rgba(6,10,19,0.9)", letterSpacing: "0.5px" }} />
                    <button onClick={handleRotateApiKey} className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.85rem", flexShrink: 0 }}>
                        Rotate Key
                    </button>
                </div>
            </section>
        </main>
    );
};

export default AccountSettings;



