import React, { useState } from "react";

const ApiHub = () => {
    const [activeEndpoint, setActiveEndpoint] = useState("auth");

    const docEndpoints = {
        auth: {
            method: "POST",
            path: "/api/auth/login",
            desc: "Authenticate operator credentials to create a new session JWT.",
            request: {
                email: "operator@nexuscommerce.net",
                password: "your_password_here"
            },
            response: {
                success: true,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                    id: "usr_68df21ab",
                    email: "operator@nexuscommerce.net"
                }
            }
        },
        getProducts: {
            method: "GET",
            path: "/api/products",
            desc: "Retrieve all active product presets, taxonomies, and costs from the MERN database.",
            request: null,
            response: {
                success: true,
                data: [
                    {
                        id: "backpack",
                        title: "Aegis Waterproof Commuter Backpack",
                        cost: 1800,
                        sku: "AEGIS-BKPK-GRY",
                        category: "Apparel > Bags"
                    }
                ]
            }
        },
        syncCart: {
            method: "POST",
            path: "/api/cart",
            desc: "Add a segmentated, audited item to the operator export queue. Requires JWT Bearer token authorization.",
            request: {
                presetId: "backpack",
                title: "Aegis Waterproof Commuter Backpack",
                price: 5200.00,
                cost: 1800.00,
                sku: "AEGIS-BKPK-GRY"
            },
            response: {
                success: true,
                data: [
                    {
                        id: "cart_item_98d7",
                        title: "Aegis Waterproof Commuter Backpack",
                        price: 5200.00
                    }
                ]
            }
        }
    };

    return (
        <main className="app-content" style={{ maxWidth: "1000px" }}>
            <span className="badge" style={{ marginBottom: "0.75rem" }}>Developer API Workspace</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                NexusCommerce <span className="gradient-text">B2B Endpoint Integration Hub</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "2rem", maxWidth: "700px", lineHeight: 1.5 }}>
                Integrate external inventory channels, scrapers, or third-party Shopify apps. All requests must route through our rate-limited gateway and support JSON payloads.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }}>
                {/* Left Side: Tabs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <button 
                        onClick={() => setActiveEndpoint("auth")}
                        style={{
                            textAlign: "left", padding: "12px", borderRadius: "8px", 
                            background: activeEndpoint === "auth" ? "rgba(56, 189, 248, 0.08)" : "transparent",
                            border: activeEndpoint === "auth" ? "1px solid var(--border-glow)" : "1px solid transparent",
                            color: activeEndpoint === "auth" ? "var(--accent-cyan)" : "var(--text-secondary)",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "var(--transition)"
                        }}
                    >
                        POST /api/auth/login
                    </button>
                    <button 
                        onClick={() => setActiveEndpoint("getProducts")}
                        style={{
                            textAlign: "left", padding: "12px", borderRadius: "8px", 
                            background: activeEndpoint === "getProducts" ? "rgba(56, 189, 248, 0.08)" : "transparent",
                            border: activeEndpoint === "getProducts" ? "1px solid var(--border-glow)" : "1px solid transparent",
                            color: activeEndpoint === "getProducts" ? "var(--accent-cyan)" : "var(--text-secondary)",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "var(--transition)"
                        }}
                    >
                        GET /api/products
                    </button>
                    <button 
                        onClick={() => setActiveEndpoint("syncCart")}
                        style={{
                            textAlign: "left", padding: "12px", borderRadius: "8px", 
                            background: activeEndpoint === "syncCart" ? "rgba(56, 189, 248, 0.08)" : "transparent",
                            border: activeEndpoint === "syncCart" ? "1px solid var(--border-glow)" : "1px solid transparent",
                            color: activeEndpoint === "syncCart" ? "var(--accent-cyan)" : "var(--text-secondary)",
                            cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "var(--transition)"
                        }}
                    >
                        POST /api/cart
                    </button>
                </div>

                {/* Right Side: Docs Explorer */}
                <div className="card glass" style={{ padding: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <span style={{ 
                            background: docEndpoints[activeEndpoint].method === "POST" ? "rgba(56, 189, 248, 0.15)" : "rgba(52, 211, 153, 0.15)",
                            color: docEndpoints[activeEndpoint].method === "POST" ? "var(--accent-cyan)" : "var(--accent-emerald)",
                            padding: "4px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 800, fontFamily: "var(--font-mono)"
                        }}>
                            {docEndpoints[activeEndpoint].method}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            {docEndpoints[activeEndpoint].path}
                        </span>
                    </div>

                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                        {docEndpoints[activeEndpoint].desc}
                    </p>

                    {/* Headers required notification */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
                        <h5 style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Required Headers</h5>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                            <div>Content-Type: application/json</div>
                            {activeEndpoint !== "auth" && <div>Authorization: Bearer &lt;operator_jwt_token&gt;</div>}
                        </div>
                    </div>

                    {/* Show request payload if present */}
                    {docEndpoints[activeEndpoint].request && (
                        <div style={{ marginBottom: "1.5rem" }}>
                            <div className="code-header" style={{ borderRadius: "8px 8px 0 0" }}>Request Payload Body</div>
                            <pre className="json-code-block" style={{ margin: 0 }}>
                                <code style={{ borderRadius: "0 0 8px 8px" }}>{JSON.stringify(docEndpoints[activeEndpoint].request, null, 2)}</code>
                            </pre>
                        </div>
                    )}

                    {/* Show response payload */}
                    <div>
                        <div className="code-header" style={{ borderRadius: "8px 8px 0 0" }}>Response Payload Format</div>
                        <pre className="json-code-block" style={{ margin: 0 }}>
                            <code style={{ borderRadius: "0 0 8px 8px" }}>{JSON.stringify(docEndpoints[activeEndpoint].response, null, 2)}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ApiHub;
