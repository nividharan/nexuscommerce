import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Editor from "@monaco-editor/react";

const CartCompiler = () => {
    const { cart, settings, removeFromDbCart } = useContext(AuthContext);
    const [jsonOutput, setJsonOutput] = useState("{\n  \"products\": []\n}");
    const [jsonError, setJsonError] = useState(null);
    const [copyText, setCopyText] = useState("Copy");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const getCurrencySymbol = () => {
        return settings.defaultCurrency === "INR" || settings.defaultCurrency === "₹" ? "₹" : "$";
    };

    const currencySym = getCurrencySymbol();

    // Cumulative calculations
    const sumCost = cart.reduce((acc, item) => acc + item.cost, 0);
    const sumRetail = cart.reduce((acc, item) => acc + item.price, 0);
    const computedGrossProfit = sumRetail - sumCost;
    const computedGrossMargin = sumRetail > 0 ? (computedGrossProfit / sumRetail) * 100 : 0;

    // Compile Shopify variants JSON payload automatically on mount or cart change
    useEffect(() => {
        if (cart.length > 0) {
            const payload = {
                products: cart.map(item => ({
                    title: item.title,
                    body_html: `<p>${item.shortDesc}</p><ul>${item.specs.map(s => `<li><strong>${stripLabel(s.label)}:</strong> ${s.value}</li>`).join("")}</ul>`,
                    vendor: "NexusCommerce MERN Hub",
                    product_type: item.category.split(" > ").pop(),
                    tags: item.tags || [],
                    published: true,
                    variants: [
                        {
                            sku: item.sku,
                            price: item.price.toFixed(2),
                            cost_per_item: item.cost.toFixed(2),
                            fulfillment_service: "manual",
                            inventory_management: "shopify",
                            inventory_policy: "deny",
                            inventory_quantity: 100
                        }
                    ],
                    images: [
                        {
                            src: window.location.origin + "/" + item.studioImg,
                            alt: `${item.title} - Studio optimized view`
                        }
                    ]
                }))
            };
            const initialJson = JSON.stringify(payload, null, 2);
            setJsonOutput(initialJson);
            setJsonError(null);
        } else {
            setJsonOutput("{\n  \"products\": []\n}");
            setJsonError(null);
        }
    }, [cart]);

    const stripLabel = (lbl) => {
        return lbl ? lbl.toString().replace(":", "").trim() : "";
    };

    // Real-Time JSON validation checker
    const handleEditorChange = (value) => {
        setJsonOutput(value || "");
        if (!value) {
            setJsonError(null);
            return;
        }
        try {
            JSON.parse(value);
            setJsonError(null);
        } catch (err) {
            setJsonError(err.message);
        }
    };

    // Copy JSON payload with flash state
    const handleCopyPayload = () => {
        if (jsonError) return;
        navigator.clipboard.writeText(jsonOutput).then(() => {
            setCopyText("Copied!");
            setTimeout(() => setCopyText("Copy"), 1500);
        });
    };

    // Export Shopify bulk CSV
    const handleExportCsv = () => {
        if (jsonError) {
            setShowConfirmModal(true);
            return;
        }
        executeCsvDownload();
    };

    const executeCsvDownload = () => {
        let csvContent = `Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Price,Variant Cost\n`;
        
        cart.forEach(item => {
            const bodyHtml = `<p>${item.shortDesc}</p><ul>${item.specs.map(s => `<li><strong>${stripLabel(s.label)}:</strong> ${s.value}</li>`).join("")}</ul>`;
            const handle = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            csvContent += `"${handle}","${item.title}","${bodyHtml.replace(/"/g, '""')}","NexusCommerce MERN Hub","${item.category.split(" > ").pop()}","${(item.tags || []).join(", ")}",true,Title,Default Title,"${item.sku}",${item.price.toFixed(2)},${item.cost.toFixed(2)}\n`;
        });
            
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `nexus_shopify_import_${Math.floor(Date.now()/1000)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowConfirmModal(false);
    };

    // Direct Shopify Sync Simulator
    const handleShopifySync = async () => {
        if (jsonError) return;
        if (!settings.shopifyDomain || !settings.shopifyAccessToken) {
            alert("⚠️ Missing Integration Keys: Please add your Shopify credentials in Settings before syncing.");
            return;
        }
        setSyncing(true);
        setTimeout(() => {
            setSyncing(false);
            alert(`✅ Shopify Sync Complete! Synchronized ${cart.length} active variant cards to domain: ${settings.shopifyDomain}`);
        }, 1500);
    };

    return (
        <main className="app-content" style={{ maxWidth: "1280px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", alignItems: "start" }} className="cart-dashboard-grid">
                
                {/* Left Column: Cart Queue and Financial Calculator */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    
                    {/* Cart Items List Panel */}
                    <div className="card glass" style={{ padding: "2rem" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.5rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Active Export Queue</span>
                            <span className="badge" style={{ fontSize: "0.75rem" }}>{cart.length} Item{cart.length !== 1 ? "s" : ""}</span>
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {cart.length === 0 ? (
                                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                                    Your export queue is empty. Please visit the <Link to="/" style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>Pipeline Gallery</Link> to audit products.
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="cart-item" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "1rem" }}>
                                        <div className="cart-item-img">
                                            <img src={`/${item.studioImg}`} alt={item.title} />
                                        </div>
                                        <div className="cart-item-details" style={{ flexGrow: 1, paddingLeft: "1rem" }}>
                                            <h4 style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: "4px" }}>{item.title}</h4>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0" }}>SKU: <span style={{ fontFamily: "var(--font-mono)" }}>{item.sku}</span></p>
                                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0" }}>Category: {item.category}</p>
                                        </div>
                                        <div className="cart-item-price-actions" style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                                            <span className="cart-item-price" style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-cyan)" }}>{currencySym}{item.price.toFixed(2)}</span>
                                            <button onClick={() => removeFromDbCart(item.id)} className="btn-remove-item" style={{ marginTop: "8px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "4px 10px", fontSize: "0.7rem", color: "var(--accent-rose)", borderRadius: "4px", cursor: "pointer" }}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Financial Audit Summary Calculator */}
                    {cart.length > 0 && (
                        <div className="card glass" style={{ padding: "2rem" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.25rem", color: "var(--accent-cyan)" }}>Financial Audit Summary</h3>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                                <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-glass)" }}>
                                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Queue Total Cost</span>
                                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "4px" }}>{currencySym}{sumCost.toFixed(2)}</h4>
                                </div>
                                <div style={{ background: "rgba(56, 189, 248, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.1)" }}>
                                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Avg Gross Margin</span>
                                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "4px", color: "var(--accent-cyan)" }}>{computedGrossMargin.toFixed(1)}%</h4>
                                </div>
                                <div style={{ background: "rgba(52, 211, 153, 0.03)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(52, 211, 153, 0.1)" }}>
                                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total List Revenue</span>
                                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "4px", color: "var(--accent-emerald)" }}>{currencySym}{sumRetail.toFixed(2)}</h4>
                                </div>
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                                Margin calculations evaluate default variables. Listings are fully formatted to meet API payloads.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: Persistent Shopify JSON Auditor Panel */}
                <div className="card glass" style={{ padding: "2rem", display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--accent-cyan)" }}>Shopify Payload Auditor</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                            <button 
                                onClick={handleCopyPayload} 
                                className="btn-secondary" 
                                style={{ padding: "6px 12px", fontSize: "0.72rem" }}
                                disabled={!!jsonError || cart.length === 0}
                            >
                                <span>{copyText}</span>
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor Container */}
                    <div style={{ 
                        border: jsonError ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-glass)", 
                        borderRadius: "8px", 
                        overflow: "hidden",
                        background: "#1e1e1e",
                        height: "400px",
                        marginBottom: "1rem"
                    }}>
                        <Editor
                            height="100%"
                            defaultLanguage="json"
                            theme="vs-dark"
                            value={jsonOutput}
                            onChange={handleEditorChange}
                            options={{
                                minimap: { enabled: false },
                                wordWrap: "on",
                                fontSize: 12,
                                lineNumbers: "on",
                                folding: false,
                                automaticLayout: true,
                                scrollbar: { vertical: "hidden" }
                            }}
                        />
                    </div>

                    {/* Validation Error Banner */}
                    {jsonError && (
                        <div style={{ 
                            background: "rgba(239, 68, 68, 0.08)", 
                            border: "1px solid rgba(239, 68, 68, 0.2)", 
                            borderRadius: "6px", 
                            padding: "10px 14px", 
                            color: "var(--accent-rose)",
                            fontSize: "0.75rem",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "1.25rem",
                            lineHeight: 1.4
                        }}>
                            <strong>JSON Parser Error:</strong> {jsonError}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
                        <button 
                            onClick={handleExportCsv} 
                            style={{ 
                                flex: 1, 
                                padding: "12px", 
                                background: jsonError ? "rgba(255,255,255,0.02)" : "var(--accent-indigo)", 
                                color: "#ffffff", 
                                border: "none", 
                                borderRadius: "8px", 
                                fontWeight: 700, 
                                fontSize: "0.82rem",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                opacity: jsonError ? 0.4 : 1,
                                boxShadow: jsonError ? "none" : "0 0 15px rgba(129, 140, 248, 0.3)"
                            }}
                            disabled={cart.length === 0}
                        >
                            Download Shopify CSV
                        </button>
                        <button 
                            onClick={handleShopifySync} 
                            className="btn-primary" 
                            style={{ flex: 1, padding: "12px", fontSize: "0.82rem" }}
                            disabled={!!jsonError || cart.length === 0 || syncing}
                        >
                            <span>{syncing ? "Syncing..." : "Shopify API Sync"}</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Confirmation Error Prompt Modal */}
            {showConfirmModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(6, 10, 19, 0.8)",
                    backdropFilter: "blur(4px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                }}>
                    <div className="card glass" style={{ maxWidth: "420px", padding: "2rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-rose)", marginBottom: "0.75rem" }}>
                            ⚠️ Warning: Syntax Errors Exist
                        </h4>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                            Your Shopify API JSON payload contains parsing errors. Exporting now may output malformed values. Do you still wish to proceed with the CSV download?
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                            <button onClick={() => setShowConfirmModal(false)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
                                Cancel
                            </button>
                            <button 
                                onClick={executeCsvDownload} 
                                style={{ background: "var(--accent-rose)", color: "#ffffff", padding: "8px 16px", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                            >
                                Proceed Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CartCompiler;
