import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const ProductWorkspace = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { settings, addToDbCart, token } = useContext(AuthContext);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [fastMode, setFastMode] = useState(false);

    const abortControllerRef = useRef(null);

    // Fast Mode Optimistic UI Snap
    useEffect(() => {
        if (fastMode) {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            setStep1State("completed");
            setStep2State("completed");
            setStep3State("completed");
            setStep4State("completed");
            setStep5State("completed");
            setIsComplete(true);
            setTelemetryState("idle");
            setProduct(prev => prev ? { ...prev, rawImg: prev.studioImg } : null);
            setConsoleOutput("⚡ [System] Sub-second Latency Mode Active. Stale queues snapped to completed.");
        } else {
            setStep1State("");
            setStep2State("");
            setStep3State("");
            setStep4State("");
            setStep5State("");
            setIsComplete(false);
        }
    }, [fastMode]);
    
    // Controlled inputs
    const [cost, setCost] = useState(0);
    const [margin, setMargin] = useState(60);
    const [shipping, setShipping] = useState(200);
    const [fee, setFee] = useState(3.0);
    const [computedPrice, setComputedPrice] = useState(0);
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

    // Refs for contenteditable elements
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const categoryRef = useRef(null);
    const specsRef = useRef(null);

    // Pipeline steps state
    const [step1State, setStep1State] = useState(""); // active, completed, or ""
    const [step2State, setStep2State] = useState("");
    const [step3State, setStep3State] = useState("");
    const [step4State, setStep4State] = useState("");
    const [step5State, setStep5State] = useState("");

    // Telemetry and active console
    const [telemetryState, setTelemetryState] = useState("idle"); // idle, active, error
    const [consoleOutput, setConsoleOutput] = useState("System idle. Initiate pipeline to begin...");
    const consoleBodyRef = useRef(null);

    // Limit margin bounds to prevent divisions by zero or negative margins
    const calculatePrice = (c, m, s, f) => {
        const marginVal = Math.min(Math.max(m, 5), 95);
        const feeVal = Math.min(Math.max(f, 0), 20);
        
        const marginDec = marginVal / 100;
        const feeDec = feeVal / 100;
        const denominator = 1 - marginDec - feeDec;
        if (denominator <= 0) {
            return (c + s) * 3;
        }
        return ((c + s) / denominator);
    };

    const getCurrencySymbol = () => {
        return settings.defaultCurrency === "INR" || settings.defaultCurrency === "₹" ? "₹" : "$";
    };

    const urlParams = new URLSearchParams(location.search);
    const prodId = urlParams.get("id");

    useEffect(() => {
        if (!prodId) {
            setLoading(false);
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const fetchProductDetails = async () => {
            try {
                const res = await axios.get(`/api/products/${prodId}`, { 
                    signal: controller.signal,
                    params: { fastModeActive: fastMode }
                });
                if (res.data.success) {
                    const prod = res.data.data;
                    setProduct(prod);
                    setCost(prod.cost);
                    setMargin(settings.defaultMargin);
                    setShipping(settings.defaultShipping);
                    setFee(settings.defaultFee);
                    setComputedPrice(calculatePrice(prod.cost, settings.defaultMargin, settings.defaultShipping, settings.defaultFee));
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }
                console.error("[Workspace] Error fetching product parameters: ", err.message);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProductDetails();

        return () => {
            controller.abort();
        };
    }, [prodId, settings, fastMode]);

    // Recalculate price when params change
    useEffect(() => {
        if (product) {
            setComputedPrice(calculatePrice(cost, margin, shipping, fee));
        }
    }, [cost, margin, shipping, fee, product]);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const logConsole = (message, type = "info") => {
        const time = new Date().toLocaleTimeString().split(" ")[0];
        let color = "#e0e0e0";
        if (type === "system") color = "#3b82f6";
        if (type === "warning") color = "#f59e0b";
        if (type === "error") color = "#ef4444";
        
        setConsoleOutput(prev => prev + `\n[${time}] ${message}`);
    };

    // Auto-scroll console body
    useEffect(() => {
        if (consoleBodyRef.current) {
            consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
        }
    }, [consoleOutput]);

    // Pipeline Execution Engine
    const runPipeline = async () => {
        if (!product || isRunning) return;

        setIsRunning(true);
        setIsComplete(false);
        setConsoleOutput("");
        setTelemetryState("active");

        // Clear steps
        setStep1State("");
        setStep2State("");
        setStep3State("");
        setStep4State("");
        setStep5State("");

        const currencySym = getCurrencySymbol();
        const waitTime = (ms) => fastMode ? sleep(ms / 10) : sleep(ms);

        // Step 1: Vision
        setStep1State("active");
        logConsole(`[Automation] Job ID initialized: job_catalog_${product.id}...`, "system");
        logConsole("[AI Brain] Reading raw image bytes. Running segmenter masks...");
        await waitTime(1000);
        logConsole("[AI Brain] Applying professional studio backdrop elements (ControlNet)...");
        // Swap image preview to studio render
        setProduct(prev => ({ ...prev, rawImg: prev.studioImg }));
        setStep1State("completed");

        // Step 2: Cataloging
        setStep2State("active");
        logConsole("[AI Brain] Classifying taxonomy attributes...");
        await waitTime(800);
        logConsole(`[Logic] Schema verification successful. Predicated Category: ${product.category}`);
        setStep2State("completed");

        // Step 3: Copywriting
        setStep3State("active");
        logConsole("[AI Brain] Running copywriting models. Generating SEO titles...");
        await waitTime(800);
        logConsole("[Logic] Checked search keyword density index. Generation approved.");
        setStep3State("completed");

        // Step 4: Margin Audit
        setStep4State("active");
        logConsole("[Logic] Starting margin price audits...");
        await waitTime(800);
        logConsole(`[Logic] Target listing cost bounds calculated: Cost: ${currencySym}${cost} | Fee: ${fee}%`);
        logConsole(`[Logic] Final retail price limit verified: ${currencySym}${computedPrice.toFixed(2)}`, "system");
        setStep4State("completed");

        // Step 5: Packaging
        setStep5State("active");
        logConsole("[Automation] Formulating Shopify Admin API payload array...");
        await waitTime(600);
        logConsole("[Automation] Payload packages validated. Pipeline processing complete.", "system");
        setStep5State("completed");

        setTelemetryState("idle");
        setIsRunning(false);
        setIsComplete(true);
    };

    // Add to Cart
    const handleAddToCart = async () => {
        if (!token) {
            alert("Sign in required to write items to cart database.");
            navigate("/login");
            return;
        }

        const activeTitle = titleRef.current?.textContent.trim() || product.title;
        const activeShort = descRef.current?.textContent.trim() || product.shortDesc;
        const activeCategory = categoryRef.current?.textContent.trim() || product.category;
        
        // Parse specs editable rows
        const activeSpecs = [];
        if (specsRef.current) {
            const listItems = specsRef.current.querySelectorAll("li");
            listItems.forEach(li => {
                const strong = li.querySelector("strong");
                const labelText = strong ? strong.textContent.replace(":", "").trim() : "";
                const valText = li.textContent.replace(strong ? strong.textContent : "", "").trim();
                activeSpecs.push({ label: labelText, value: valText });
            });
        }

        const cartItem = {
            id: product.id + "_" + Math.random().toString(36).substr(2, 4),
            presetId: product.id,
            title: activeTitle,
            shortDesc: activeShort,
            category: activeCategory,
            price: computedPrice,
            cost: cost,
            specs: activeSpecs.length > 0 ? activeSpecs : product.specs,
            sku: product.sku,
            studioImg: product.studioImg,
            tags: product.tags
        };

        await addToDbCart(cartItem);
        alert(`Successfully saved "${activeTitle}" to your checkout cart!`);
        navigate("/checkout");
    };

    if (loading) {
        return <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "100px" }}>Loading catalog workspace...</div>;
    }

    if (!product) {
        return (
            <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "100px" }}>
                Product ID not found. Please return to the <Link to="/" style={{ color: "var(--accent-cyber)" }}>Marketplace</Link>.
            </div>
        );
    }

    const currencySym = getCurrencySymbol();

    const steps = [
        { label: "Vision", desc: "AI segmentations", state: step1State },
        { label: "Cataloging", desc: "Taxonomy checks", state: step2State },
        { label: "Copywriting", desc: "SEO header tags", state: step3State },
        { label: "Margin Audit", desc: "Pricing thresholds", state: step4State },
        { label: "Packaging", desc: "API payloads", state: step5State }
    ];

    return (
        <main className="app-content">
            <div className="product-detail-layout card glass">
                {/* Left Side: Images & Console Actions */}
                <div className="detail-img-pane">
                    <div className="detail-img-box">
                        <img src={`/${product.rawImg}`} alt={product.title} />
                    </div>
                    
                    <div className="detail-actions-row">
                        <button onClick={runPipeline} className="btn-primary" disabled={isRunning}>
                            <span>Initiate Pipeline</span>
                        </button>
                        <button onClick={handleAddToCart} className="btn-secondary" disabled={!isComplete || isRunning}>
                            <span>Add to Cart</span>
                        </button>
                    </div>

                    {/* Fast Mode Toggle switcher */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        <input 
                            type="checkbox" 
                            id="fast-mode-chk" 
                            checked={fastMode} 
                            onChange={(e) => setFastMode(e.target.checked)} 
                            style={{ width: "auto", cursor: "pointer" }} 
                        />
                        <label htmlFor="fast-mode-chk" style={{ cursor: "pointer", fontWeight: 600, userSelect: "none" }}>
                            ⚡ Fast Mode (Bypass visual latency queue)
                        </label>
                    </div>

                    {/* Live console telemetry */}
                    <div className="live-console">
                        <div className="console-header">
                            <span>Console Telemetry</span>
                            <div className="telemetry-status-container">
                                <span className={`status-dot-pulse ${telemetryState}`} id="telemetry-status-dot"></span>
                                <span id="telemetry-status-text" style={{ color: telemetryState === "active" ? "var(--accent-emerald)" : "var(--text-muted)" }}>
                                    {telemetryState === "active" ? "Processing" : "Idle"}
                                </span>
                            </div>
                        </div>
                        <pre ref={consoleBodyRef} className="console-body" id="console-output">
                            {consoleOutput}
                        </pre>
                    </div>
                </div>

                {/* Right Side: Specifications, Inputs & Progress Steps */}
                <div className="detail-info-pane">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span ref={categoryRef} suppressContentEditableWarning={true} contentEditable={true} id="preview-category" className="detail-category">
                            {product.category}
                        </span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5, color: "var(--accent-cyan)" }}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </span>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }} className="detail-title">
                        <span ref={titleRef} suppressContentEditableWarning={true} contentEditable={true} id="preview-title" style={{ flexGrow: 1 }}>
                            {product.title}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5, color: "var(--accent-cyan)", flexShrink: 0 }}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </h2>
                    
                    <div className="detail-pricing-box">
                        <span id="preview-price" className="detail-price">
                            {currencySym}{computedPrice.toFixed(2)}
                        </span>
                        <span id="preview-margin-badge" className="detail-margin-tag">
                            {margin}% Margin
                        </span>
                    </div>

                    {/* Adjusted settings override card */}
                    <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", background: "rgba(15, 23, 42, 0.4)" }}>
                        <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "0.75rem" }}>
                            Adjust Pipeline Inputs
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                            <div className="input-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: "0.65rem" }}>Cost</label>
                                <input 
                                    type="number" 
                                    value={cost} 
                                    onChange={(e) => setCost(Math.max(parseFloat(e.target.value) || 0, 0))} 
                                    style={{ padding: "8px" }} 
                                />
                            </div>
                            <div className="input-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: "0.65rem" }}>Margin (%)</label>
                                <input 
                                    type="number" 
                                    value={margin} 
                                    onChange={(e) => handleMarginChange(e.target.value)} 
                                    onKeyDown={handleMarginKeyDown}
                                    style={{ 
                                        padding: "8px",
                                        borderColor: marginError ? "var(--accent-rose)" : "",
                                        boxShadow: marginError ? "0 0 10px rgba(239, 68, 68, 0.2)" : ""
                                    }} 
                                />
                            </div>
                            <div className="input-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: "0.65rem" }}>Shipping</label>
                                <input 
                                    type="number" 
                                    value={shipping} 
                                    onChange={(e) => setShipping(Math.max(parseFloat(e.target.value) || 0, 0))} 
                                    style={{ padding: "8px" }} 
                                />
                            </div>
                            <div className="input-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: "0.65rem" }}>Fee (%)</label>
                                <input 
                                    type="number" 
                                    value={fee} 
                                    onChange={(e) => setFee(Math.min(Math.max(parseFloat(e.target.value) || 0, 0), 20))} 
                                    style={{ padding: "8px" }} 
                                />
                            </div>
                        </div>
                        {marginError && (
                            <span style={{ fontSize: "0.68rem", color: "var(--accent-rose)", display: "block", marginTop: "10px", fontWeight: "bold", lineHeight: 1.4 }}>
                                {marginError}
                            </span>
                        )}
                    </div>

                    <div className="detail-card-panel">
                        <h4 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Description</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5, color: "var(--accent-cyan)" }}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </h4>
                        <p ref={descRef} suppressContentEditableWarning={true} contentEditable={true} id="preview-short-desc">
                            {product.shortDesc}
                        </p>
                    </div>

                    {/* Simulation steps */}
                    <div className="detail-card-panel" style={{ overflow: "visible" }}>
                        <h4 style={{ marginBottom: "1.5rem" }}>Active Pipeline Steps</h4>
                        
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", padding: "1rem 0", minHeight: "80px" }}>
                            {/* Horizontal progress connecting line */}
                            <div style={{
                                position: "absolute",
                                top: "26px",
                                left: "5%",
                                right: "5%",
                                height: "2px",
                                background: "rgba(255, 255, 255, 0.08)",
                                zIndex: 0
                            }} />

                            {steps.map((st, idx) => {
                                const isActive = st.state === "active";
                                const isCompleted = st.state === "completed";
                                
                                let circleStyle = {
                                    width: "34px",
                                    height: "34px",
                                    borderRadius: "50%",
                                    background: "#0d131f",
                                    border: "2px solid rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 1,
                                    transition: "all 0.3s ease",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    position: "relative"
                                };
                                
                                let nodeLabel = "";
                                let labelColor = "var(--text-muted)";
                                
                                if (fastMode) {
                                    circleStyle.border = "2px solid rgba(255, 255, 255, 0.15)";
                                    circleStyle.background = "rgba(255, 255, 255, 0.02)";
                                    circleStyle.color = "rgba(255, 255, 255, 0.3)";
                                    nodeLabel = "Skipped";
                                    labelColor = "rgba(255, 255, 255, 0.3)";
                                } else if (isActive) {
                                    circleStyle.borderColor = "var(--accent-indigo)";
                                    circleStyle.boxShadow = "0 0 15px rgba(129, 140, 248, 0.6)";
                                    circleStyle.background = "var(--accent-indigo)";
                                    circleStyle.color = "#ffffff";
                                    circleStyle.animation = "pulse-indigo 1.5s infinite";
                                    nodeLabel = "Active";
                                    labelColor = "var(--accent-indigo)";
                                } else if (isCompleted) {
                                    circleStyle.borderColor = "var(--accent-cyan)";
                                    circleStyle.boxShadow = "0 0 10px rgba(56, 189, 248, 0.4)";
                                    circleStyle.color = "var(--accent-cyan)";
                                    circleStyle.background = "rgba(56, 189, 248, 0.05)";
                                    nodeLabel = "Done";
                                    labelColor = "var(--accent-cyan)";
                                } else {
                                    nodeLabel = "Pending";
                                    labelColor = "var(--text-muted)";
                                }

                                return (
                                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "18%", zIndex: 1, textAlign: "center" }}>
                                        <div style={circleStyle} title={st.desc}>
                                            {isCompleted && !fastMode ? "✓" : isActive && !fastMode ? "●" : "—"}
                                        </div>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700, marginTop: "8px", color: isCompleted && !fastMode ? "var(--accent-cyan)" : isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
                                            {st.label}
                                        </span>
                                        <span style={{ fontSize: "0.62rem", color: labelColor, marginTop: "2px", fontWeight: 600 }}>
                                            {nodeLabel}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="detail-card-panel">
                        <h4 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Specifications</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5, color: "var(--accent-cyan)" }}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </h4>
                        <ul ref={specsRef} suppressContentEditableWarning={true} contentEditable={true} id="preview-specs-list" className="spec-list">
                            {product.specs.map((s, idx) => (
                                <li key={idx}>
                                    <strong>{s.label}:</strong> {s.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductWorkspace;
